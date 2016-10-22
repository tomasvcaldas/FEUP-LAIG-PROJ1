
function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;

	this.primitive={};
	this.nodes = {};
	this.transformations = {};
	this.comp = {};
	this.materials = {};
	this.textures = {};
	this.omniLights=[];
	this.spotLights=[];

	this.degToRad= Math.PI / 180.0;

	// File reading
	this.reader = new CGFXMLreader();

	/*
	* Read the contents of the xml file, and refer to this class for loading and error handlers.
	* After the file is read, the reader calls onXMLReady on this object.
	* If any error occurs, the reader calls onXMLError on this object, with an error message
	*/

	this.reader.open('scenes/'+filename, this);
}

/*
* Callback to be executed after successful reading
*/
MySceneGraph.prototype.onXMLReady=function()
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;

	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseGlobalsExample(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk=true;

	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};





/*
* Example of method that parses elements of one block and stores information in a specific data structure
*/
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {

	var elems =  rootElement.getElementsByTagName('globals');
	if (elems === null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	//-----------------------------------------------------------------------------//
	//LISTAS ----------------------------------------------------------------------//
	//-----------------------------------------------------------------------------//
	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}

	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	}

	//-----------------------------------------------------------------------------//
	//PRIMITIVAS ------------------------------------------------------------------//
	//-----------------------------------------------------------------------------//

	var tempPrim=rootElement.getElementsByTagName('primitives');

	if (tempPrim == null  || tempPrim.length==0) {
		return "primitives element is missing.";
	}




	for(var i = 0; i < tempPrim[0].children.length ; i++){

		var prim = tempPrim[0].children[i].children;

		if(prim[0].tagName == 'rectangle' ){
			var x1 = prim[0].attributes.getNamedItem("x1").value;
			var y1 = prim[0].attributes.getNamedItem("y1").value;
			var x2 = prim[0].attributes.getNamedItem("x2").value;
			var y2 = prim[0].attributes.getNamedItem("y2").value;

			this.primitive[tempPrim[0].children[i].attributes.getNamedItem("id").value] = new MyQuad(this.scene,x1,y1,x2,y2);
		}

		if(prim[0].tagName == 'triangle' ){
			var tx1 = prim[0].attributes.getNamedItem("x1").value;
			var ty1 = prim[0].attributes.getNamedItem("y1").value;
			var tz1 = prim[0].attributes.getNamedItem("z1").value;
			var tx2 = prim[0].attributes.getNamedItem("x2").value;
			var ty2 = prim[0].attributes.getNamedItem("y2").value;
			var tz2 = prim[0].attributes.getNamedItem("z2").value;
			var tx3 = prim[0].attributes.getNamedItem("x3").value;
			var ty3 = prim[0].attributes.getNamedItem("y3").value;
			var tz3 = prim[0].attributes.getNamedItem("z3").value;

			this.primitive[tempPrim[0].children[i].attributes.getNamedItem("id").value] = new Triangle(this.scene,tx1,ty1,tz1,tx2,ty2,tz2,tx3,ty3,tz3);
		}

		if(prim[0].tagName == 'cylinder' ){
			var base = prim[0].attributes.getNamedItem("base").value;
			var top = prim[0].attributes.getNamedItem("top").value;
			var height = prim[0].attributes.getNamedItem("height").value;
			var slices = prim[0].attributes.getNamedItem("slices").value;
			var stacks = prim[0].attributes.getNamedItem("stacks").value;

			this.primitive[tempPrim[0].children[i].attributes.getNamedItem("id").value] = new CreateCylinder(this.scene,base, top, height, slices, stacks);
		}

		if(prim[0].tagName == 'sphere' ){
			var radius = prim[0].attributes.getNamedItem("radius").value;
			var slices = prim[0].attributes.getNamedItem("slices").value;
			var stacks = prim[0].attributes.getNamedItem("stacks").value;
			this.primitive[tempPrim[0].children[i].attributes.getNamedItem("id").value] = new MySphere(this.scene,radius,slices,stacks);
		}

		if(prim[0].tagName == 'torus' ){
			var inner = prim[0].attributes.getNamedItem("inner").value;
			var outer = prim[0].attributes.getNamedItem("outer").value;
			var slices = prim[0].attributes.getNamedItem("slices").value;
			var loops = prim[0].attributes.getNamedItem("loops").value;

			this.primitive[tempPrim[0].children[i].attributes.getNamedItem("id").value] = new Torus(this.scene, inner, outer, slices, loops);
		}

	}



	//-----------------------------------------------------------------------------//
	//TRANSFORMATIONS -------------------------------------------------------------//
	//-----------------------------------------------------------------------------//

	var tempTransf=rootElement.getElementsByTagName('transformations');
	if (tempTransf == null  || tempTransf.length==0) {
		return "transformations element is missing.";
	}

	var transfLength = tempTransf[0].children.length;
	for(var i = 0; i < transfLength; i++){
		var id = tempTransf[0].children[i].attributes.getNamedItem("id").value;

		this.transformations[id]  = this.getTransformationMatrix(tempTransf[0].children[i]);


	}



	//-----------------------------------------------------------------------------//
	//TEXTURES---------------------------------------------------------------------//
	//-----------------------------------------------------------------------------//

	var tempText = rootElement.getElementsByTagName('textures');

	if (tempText == null  || tempText.length==0) {
		return "Textures element is missing.";
	}
	for(var i= 0; i < tempText[0].children.length; i++){
		var currentText = tempText[0].children;
		var textureID = currentText[i].attributes.getNamedItem("id").value
		var file = currentText[i].attributes.getNamedItem("file").value;
		var textureF = new CGFtexture(this.scene, file);
		var lengths = currentText[i].attributes.getNamedItem("length_s").value;
		var lengtht = currentText[i].attributes.getNamedItem("length_t").value;

		var newTexture = new Texture(textureID, textureF, lengths, lengtht);

		this.textures[textureID] = newTexture;


	}


	//-----------------------------------------------------------------------------//
	//MATERIALS--------------------------------------------------------------------//
	//-----------------------------------------------------------------------------//

	var materialsList=rootElement.getElementsByTagName('materials');
	if (materialsList == null  || materialsList.length==0) {
		return "Materials element is missing.";
	}


	for(var i = 0; i < materialsList[0].children.length ; i++)
	{
		var currentMat = materialsList[0].children[i];
		var matID = currentMat.attributes.getNamedItem("id").value;
		var emission = [];
		var ambient = [];
		var diffuse = [];
		var specular = [];
		var shininess;

		for(var j = 0; j < currentMat.children.length; j++){

			if(currentMat.children[j].tagName == 'emission'){

				emission[0] = currentMat.children[i].attributes.getNamedItem("r").value;
				emission[1] = currentMat.children[i].attributes.getNamedItem("g").value;
				emission[2] = currentMat.children[i].attributes.getNamedItem("g").value;
				emission[3] = currentMat.children[i].attributes.getNamedItem("a").value;
			}

			if(currentMat.children[j].tagName == 'ambient'){
				ambient[0] = currentMat.children[i].attributes.getNamedItem("r").value;
				ambient[1] = currentMat.children[i].attributes.getNamedItem("g").value;
				ambient[2] = currentMat.children[i].attributes.getNamedItem("g").value;
				ambient[3] = currentMat.children[i].attributes.getNamedItem("a").value;
			}

			if(currentMat.children[j].tagName == 'diffuse'){

				diffuse[0] = currentMat.children[i].attributes.getNamedItem("r").value;
				diffuse[1] = currentMat.children[i].attributes.getNamedItem("g").value;
				diffuse[2] = currentMat.children[i].attributes.getNamedItem("g").value;
				diffuse[3] = currentMat.children[i].attributes.getNamedItem("a").value;
			}

			if(currentMat.children[j].tagName == 'specular'){

				specular[0] = currentMat.children[i].attributes.getNamedItem("r").value;
				specular[1] = currentMat.children[i].attributes.getNamedItem("g").value;
				specular[2] = currentMat.children[i].attributes.getNamedItem("g").value;
				specular[3] = currentMat.children[i].attributes.getNamedItem("a").value;
			}

			if(currentMat.children[j].tagName == 'shininess'){
				shininess = this.reader.getFloat(currentMat.getElementsByTagName('shininess')[0], 'value');
			}

			var newMaterial = new CGFappearance(this.scene);
			newMaterial.setEmission(emission[0],emission[1],emission[2],emission[3]);
			newMaterial.setAmbient(ambient[0],ambient[1],ambient[2],ambient[3]);
			newMaterial.setDiffuse(diffuse[0],diffuse[1],diffuse[2],diffuse[3]);
			newMaterial.setSpecular(specular[0],specular[1],specular[2],specular[3]);
			newMaterial.setShininess(shininess);
			newMaterial.setTextureWrap('REPEAT', 'REPEAT');

			this.materials[matID] = newMaterial;



		}





	}
	//-----------------------------------------------------------------------------//
	//COMPONENTES -----------------------------------------------------------------//
	//-----------------------------------------------------------------------------//

	var tempComp=rootElement.getElementsByTagName('components');
	var numNodes = tempComp[0].getElementsByTagName('component');
	if (tempComp == null  || tempComp.length==0) {
		return "components element is missing.";
	}

	this.components=[];

	for(var i = 0; i < numNodes.length; i++){
		var tempNode = numNodes[i];
		var nodeChildren = tempNode.getElementsByTagName('children'); //dame o children
		var listChildren = nodeChildren[0].children; //dame o dentro do children
		var node = new MyNode();

		for(var j = 0; j < listChildren.length; j++){
			if(listChildren[j].tagName == "componentref"){
				node.componentId.push(listChildren[j].attributes.getNamedItem("id").value); //se for component criar um node
			}
			else {
				if(listChildren[j].tagName == "primitiveref"){
					node.primitive = this.primitive[listChildren[j].attributes.getNamedItem("id").value]; //se for primitiva vai adicionar a que tiver id igual
				}
				else {
					return "Erro na tagName de children ";
				}
			}
		}


		var nodeId = tempNode.attributes.getNamedItem("id").value; // id do component
		var nodeTransformation =  tempNode.getElementsByTagName('transformation');
		var idTransf1 =  nodeTransformation[0].children[0].attributes.getNamedItem("id").value;
		node.mat = this.transformations[idTransf1];



		//materiais

		var loadMaterials = tempNode.getElementsByTagName('materials');
		var loadMaterialsList = loadMaterials[0].children;


		for (var j = 0; j < loadMaterialsList.length; j++){
			var idmaterial = loadMaterialsList[j].attributes.getNamedItem("id").value;
			node.material.push(this.materials[idmaterial]);
	}

	//textures

	var loadTextures = tempNode.getElementsByTagName('texture')[0];
	var idtextures  = this.reader.getString(loadTextures, 'id', true);
	node.texture = this.textures[idtextures];
	this.nodes[nodeId] = node;


}

	//-----------------------------------------------------------------------------//
	//ILLUMINATION-----------------------------------------------------------------//
	//-----------------------------------------------------------------------------//

	var tempIlum = rootElement.getElementsByTagName('illumination');

	if (tempIlum == null  || tempIlum.length==0) {
		return "Illumination element is missing.";
	}

	this.illumination=[];
	var illumination = tempIlum[0];

for(var i=0; i < illumination.children.length; i++){
	if(illumination.children[i].tagName =='ambient'){
		console.log("Read ambient with values r = " + illumination.children[i].attributes.getNamedItem("r").value +
		" g = " +illumination.children[i].attributes.getNamedItem("g").value +
		" b = " +illumination.children[i].attributes.getNamedItem("b").value +
		" a = " +illumination.children[i].attributes.getNamedItem("a").value);
	}

	if(illumination.children[i].tagName =='background'){
		console.log("Read background with values r = " + illumination.children[i].attributes.getNamedItem("r").value +
		" g = " +illumination.children[i].attributes.getNamedItem("g").value +
		" g = " +illumination.children[i].attributes.getNamedItem("b").value +
		" g = " +illumination.children[i].attributes.getNamedItem("a").value);
	}
}



//-----------------------------------------------------------------------------//
//SCENE------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//

var tempScene=rootElement.getElementsByTagName('scene');

if (tempScene == null  || tempScene.length==0) {
	return "scene element is missing.";
}

this.sceneLine=[];

var sceneLine = tempScene[0];

console.log("Read scene item with root axis_length values: " +
sceneLine.attributes.getNamedItem("root").value + " " +
sceneLine.attributes.getNamedItem("axis_length").value + ".");

//-----------------------------------------------------------------------------//
//VIEWS------------------------------------------------------------------------//
//-----------------------------------------------------------------------------//

var tempViews=rootElement.getElementsByTagName('views');

if (tempViews == null  || tempViews.length==0) {
	return "views element is missing.";
}

this.views=[];

var views = tempViews[0]

console.log("Read views item with id value: " + views.attributes.getNamedItem("default").value + ".");

for(var i = 0; i < views.children.length; i++){
	console.log("Read perspective item with id near far angle values: " +
	views.children[i].attributes.getNamedItem("id").value + " " +
	views.children[i].attributes.getNamedItem("near").value + " " +
	views.children[i].attributes.getNamedItem("far").value + " " +
	views.children[i].attributes.getNamedItem("angle").value + ".")

	var viewChild = views.children[i].children;

	for(var j = 0; j < viewChild.length; j++){
		if(viewChild[j].tagName == 'from'){
			console.log("Read from item with x y z values: " +
			viewChild[j].attributes.getNamedItem("x").value + " " +
			viewChild[j].attributes.getNamedItem("y").value + " " +
			viewChild[j].attributes.getNamedItem("z").value + ".")
		}

		if(viewChild[j].tagName == 'to'){
			console.log("Read to item with x y z values: " +
			viewChild[j].attributes.getNamedItem("x").value + " " +
			viewChild[j].attributes.getNamedItem("y").value + " " +
			viewChild[j].attributes.getNamedItem("z").value + ".")
		}
	}
}

//-----------------------------------------------------------------------------//
//LIGHTS-----------------------------------------------------------------------//
//-----------------------------------------------------------------------------//

var tempLights=rootElement.getElementsByTagName('lights');

if (tempLights == null  || tempLights.length==0) {
	return "lights element is missing.";
}

this.lights=[];

var lights = tempLights[0];

for(var i = 0; i < lights.children.length; i++){
	var lightsChild = lights.children[i];

	if(lightsChild.tagName == 'omni'){
		var id = this.reader.getString(lightsChild, 'id');
		var enabled = this.reader.getBoolean(lightsChild,'enabled');

		var locationEl = lightsChild.getElementsByTagName('location')[0];
		var location = new Point3W(this.reader.getFloat(locationEl, 'x'), this.reader.getFloat(locationEl, 'y'),
            this.reader.getFloat(locationEl, 'z'), this.reader.getFloat(locationEl, 'w'));

		var ambient = this.getColor(lightsChild.getElementsByTagName('ambient')[0]);
		var diffuse = this.getColor(lightsChild.getElementsByTagName('diffuse')[0]);
		var specular = this.getColor(lightsChild.getElementsByTagName('specular')[0]);

		this.omniLights.push(new Omni(id,enabled,location,ambient,diffuse,specular));

	}


	if(lightsChild.tagName == 'spot'){
		var id = this.reader.getString(lightsChild,'id');
		var enabled = this.reader.getBoolean(lightsChild,'enabled');
		var angle = this.reader.getFloat(lightsChild,'angle');
		var exponent = this.reader.getFloat(lightsChild,'exponent');
		var target = this.getPoint3Element(lightsChild.getElementsByTagName('target')[0]);
		var location = this.getPoint3Element(lightsChild.getElementsByTagName('location')[0]);
		var ambient = this.getColor(lightsChild.getElementsByTagName('ambient')[0]);
		var diffuse = this.getColor(lightsChild.getElementsByTagName('diffuse')[0]);
		var specular = this.getColor(lightsChild.getElementsByTagName('specular')[0]);

		this.spotLights.push(new Spot(id, enabled, angle, exponent, target, location, ambient, diffuse, specular));


	}
}

};

MySceneGraph.prototype.getTransformationMatrix = function(transformationElement) {
	var matrix = mat4.create();

	for (var i = 0; i < transformationElement.children.length ; i++) {
		var transformation = transformationElement.children[i];
		var transformationName = transformation.tagName;


		switch (transformationName) {
			case 'translate':

			var translateCoords;

			translateCoords = this.getPoint3Element(transformation);
			mat4.translate(matrix, matrix, translateCoords.toArray());
			break;

			case 'rotate':
			var rotationAxis, angle, rotation;

			rotationAxis = this.reader.getString(transformation, 'axis');
			angle = this.reader.getFloat(transformation, 'angle');

			if (rotationAxis == 'x') rotation = [1, 0, 0];
			else if (rotationAxis == 'y') rotation = [0, 1, 0];
			else if (rotationAxis == 'z') rotation = [0, 0, 1];

			mat4.rotate(matrix, matrix, angle*this.degToRad, rotation);
			break;

			case 'scale':
			var scaleCoords;

			scaleCoords = this.getPoint3Element(transformation);
			mat4.scale(matrix, matrix, scaleCoords.toArray());
			break;
		}
	}
	return matrix;
};

MySceneGraph.prototype.getPoint3Element = function(element) {
	if (element == null){
		this.onXMLError("Error loading 'Point3' element .");
		return 1;
	}

	var res = new Point3(this.reader.getFloat(element, 'x'), this.reader.getFloat(element, 'y'),
	this.reader.getFloat(element, 'z'));

	return res;
}

MySceneGraph.prototype.getColor = function(element) {
	if (element == null){
		this.onXMLError("Error loading color element .");
		return 1;
	}

	var res = new Color(this.reader.getFloat(element, 'r'), this.reader.getFloat(element, 'g'),
	this.reader.getFloat(element, 'b'),this.reader.getFloat(element, 'a'));

	return res;
}

/*
* Callback to be executed on any read error
*/

MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);
	this.loadedOk=false;
};
