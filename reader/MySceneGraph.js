
function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;

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
	if (elems == null) {
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
	};

	//-----------------------------------------------------------------------------//
	//PRIMITIVAS ------------------------------------------------------------------//
	//-----------------------------------------------------------------------------//

	var tempPrim=rootElement.getElementsByTagName('primitives');

	if (tempPrim == null  || tempPrim.length==0) {
		return "primitives element is missing.";
	}

	this.primitives=[];


	for(var i = 0; i < tempPrim[0].children.length ; i++){

		console.log("Read primitive with id " + tempPrim[0].children[i].attributes.getNamedItem("id").value);
		var prim = tempPrim[0].children[i].children;

			for(var j = 0; j < prim.length; j++){

				if(prim[j].tagName == 'rectangle' ){
					console.log("Read rectangle item with x1 y1 x2 y2 values: "
					+ prim[j].attributes.getNamedItem("x1").value + " "
					+ prim[j].attributes.getNamedItem("y1").value + " "
					+ prim[j].attributes.getNamedItem("x2").value + " "
					+ prim[j].attributes.getNamedItem("y2").value + "."
					)
				}
				if(prim[j].tagName == 'triangle' ){
					console.log("Read triangle item with x1 y1 z1 x2 y2 z2 x3 y3 z3 values: "
					+ prim[j].attributes.getNamedItem("x1").value + " "
					+ prim[j].attributes.getNamedItem("y1").value + " "
					+ prim[j].attributes.getNamedItem("z1").value + " "
					+ prim[j].attributes.getNamedItem("x2").value + " "
					+ prim[j].attributes.getNamedItem("y2").value + " "
					+ prim[j].attributes.getNamedItem("z2").value + " "
					+ prim[j].attributes.getNamedItem("x3").value + " "
					+ prim[j].attributes.getNamedItem("y3").value + " "
					+ prim[j].attributes.getNamedItem("z3").value + "."
					)
				}
				if(prim[j].tagName == 'cylinder' ){
					console.log("Read cylinder item with base top height slices stacks values: "
					+ prim[j].attributes.getNamedItem("base").value + " "
					+ prim[j].attributes.getNamedItem("top").value + " "
					+ prim[j].attributes.getNamedItem("height").value + " "
					+ prim[j].attributes.getNamedItem("slices").value + " "
					+ prim[j].attributes.getNamedItem("stacks").value + "."
					)
				}
				if(prim[j].tagName == 'sphere' ){
					console.log("Read sphere item with radius slices stacks values: "
					+ prim[j].attributes.getNamedItem("radius").value + " "
					+ prim[j].attributes.getNamedItem("slices").value + " "
					+ prim[j].attributes.getNamedItem("stacks").value + "."
					)
				}
				if(prim[j].tagName == 'torus' ){
					console.log("Read torus item with inner outer slices loops values: "
					+ prim[j].attributes.getNamedItem("inner").value + " "
					+ prim[j].attributes.getNamedItem("outer").value + " "
					+ prim[j].attributes.getNamedItem("slices").value + " "
					+ prim[j].attributes.getNamedItem("loops").value + "."
					)
				}
			}
	}

	//-----------------------------------------------------------------------------//
	//COMPONENTES -----------------------------------------------------------------//
	//-----------------------------------------------------------------------------//

	var tempComp=rootElement.getElementsByTagName('components');

	if (tempComp == null  || tempComp.length==0) {
		return "components element is missing.";
	}

	this.components=[];


	for(var i = 0; i < tempComp[0].children.length ; i++){
		var comp = tempComp[0].children[i].children;

		for(var j = 0; j < comp.length; j++){
			var compChild1 = tempComp[0].children[i].children[j].children;

			if(comp[j].tagName == 'transformation'){
				for(var k = 0; k < compChild1.length; k++){
					if(compChild1[k].tagName == 'transformationref'){
						console.log("Read transformationref item with id value: "
						 + compChild1[k].attributes.getNamedItem("id").value + ".");
					}
					if(compChild1[k].tagName == 'translate'){
						console.log("Read translate item with x y z values: "
						+ compChild1[k].attributes.getNamedItem("x").value + " "
						+ compChild1[k].attributes.getNamedItem("y").value + " "
						+ compChild1[k].attributes.getNamedItem("z").value + ".");
					}
					if(compChild1[k].tagName == 'rotate'){
						console.log("Read rotate item with axis angle values: "
						+ compChild1[k].attributes.getNamedItem("axis").value + " "
						+ compChild1[k].attributes.getNamedItem("angle").value + ".");
					}
					if(compChild1[k].tagName == 'scale'){
						console.log("Read scale item with x y z values: "
						+ compChild1[k].attributes.getNamedItem("x").value + " "
						+ compChild1[k].attributes.getNamedItem("y").value + " "
						+ compChild1[k].attributes.getNamedItem("z").value + ".");
					}
				}
			}

			if(comp[j].tagName == 'materials'){
				console.log("Read material item with id value: " + compChild1[0].attributes.getNamedItem("id").value + ".");
			}

			if(comp[j].tagName == 'texture'){
				console.log("Read texture item with id value: " + comp[j].attributes.getNamedItem("id").value + ".");
			}

			if(comp[j].tagName == 'children'){
				console.log("Read componentref item with id value: " + compChild1[0].attributes.getNamedItem("id").value + ".");
				console.log("Read primitiveref item with id value: " + compChild1[1].attributes.getNamedItem("id").value + ".");
			}


		}

	}

	//-----------------------------------------------------------------------------//
	//TRANSFORMATIONS -------------------------------------------------------------//
	//-----------------------------------------------------------------------------//

	var tempTransf=rootElement.getElementsByTagName('transformations');
	if (tempTransf == null  || tempTransf.length==0) {
		return "transformations element is missing.";
	}

	this.transformations=[];

	for(var i = 0; i < tempTransf[0].children.length ; i++){


		console.log("Read transformation with id " + tempTransf[0].children[i].attributes.getNamedItem("id").value);
		var transf = tempTransf[0].children[i].children;

		for(var j=0; j < transf.length; j++){
			if(transf[j].tagName =='translate'){
				console.log("Read transformation: translation item with x y z values: "
				+ transf[j].attributes.getNamedItem("x").value + " "
				+ transf[j].attributes.getNamedItem("y").value + " "
				+ transf[j].attributes.getNamedItem("z").value + " "
				)
			}

			if(transf[j].tagName =='rotate'){
				console.log("Read transformation: rotation item with axis angle values: "
				+ transf[j].attributes.getNamedItem("axis").value + " "
				+ transf[j].attributes.getNamedItem("angle").value + " "
				)
			}

			if(transf[j].tagName =='scale'){
				console.log("Read transformation: scaling item with x y z values: "
				+ transf[j].attributes.getNamedItem("x").value + " "
				+ transf[j].attributes.getNamedItem("y").value + " "
				+ transf[j].attributes.getNamedItem("z").value + " "
				)
			}
		}
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

	console.log("Read illumination: doublesided - " + illumination.attributes.getNamedItem("doublesided").value +
							" and local: - " + illumination.attributes.getNamedItem("local").value);

	for(var i=0; i < illumination.children.length; i++){
		if(illumination.children[i].tagName =='ambient'){
			console.log("Read ambient with values r = " + illumination.children[i].attributes.getNamedItem("r").value +
			" g = " +illumination.children[i].attributes.getNamedItem("g").value +
			" g = " +illumination.children[i].attributes.getNamedItem("b").value +
			" g = " +illumination.children[i].attributes.getNamedItem("a").value);
		}

		if(illumination.children[i].tagName =='background'){
			console.log("Read background with values r = " + illumination.children[i].attributes.getNamedItem("r").value +
			" g = " +illumination.children[i].attributes.getNamedItem("g").value +
			" g = " +illumination.children[i].attributes.getNamedItem("b").value +
			" g = " +illumination.children[i].attributes.getNamedItem("a").value);
		}
	}

	//-----------------------------------------------------------------------------//
	//TEXTURES---------------------------------------------------------------------//
	//-----------------------------------------------------------------------------//

	var tempText = rootElement.getElementsByTagName('textures');

	if (tempText == null  || tempText.length==0) {
		return "Textures element is missing.";
	}

	this.text=[];
	var text = tempText[0].children;

	for(var i=0; i < text.length; i++){
		console.log("Read texture with id= " +text[i].attributes.getNamedItem("id").value +
		" file = " + text[i].attributes.getNamedItem("file").value +
		" length_s = " + text[i].attributes.getNamedItem("length_s").value +
		" length_t = " + text[i].attributes.getNamedItem("length_t").value);
	}

	//-----------------------------------------------------------------------------//
	//MATERIALS--------------------------------------------------------------------//
	//-----------------------------------------------------------------------------//

	var tempMat=rootElement.getElementsByTagName('materials');
	if (tempMat == null  || tempMat.length==0) {
		return "Materials element is missing.";
	}

	this.materials=[];

	for(var i = 0; i < tempMat[0].children.length ; i++)
	{


		console.log("Read material with id " + tempMat[0].children[i].attributes.getNamedItem("id").value);
		var mats = tempMat[0].children[i].children;

		for(var j=0; j < mats.length; j++){
			if(mats[j].tagName =='emission'){
				console.log("Read transformation: emission with r = " +
				+ mats[j].attributes.getNamedItem("r").value + " and g = "
				+ mats[j].attributes.getNamedItem("g").value + " and b = "
				+ mats[j].attributes.getNamedItem("b").value + " and a = "
				+ mats[j].attributes.getNamedItem("b").value);
			}
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

	var sceneLine = tempScene[0]

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
			console.log("Read omni item with id enable values: " + lightsChild.attributes.getNamedItem("id").value + " " +	lightsChild.attributes.getNamedItem("enabled").value + ".");
			for(var j = 0; j < lightsChild.children.length; j++){
				if(lightsChild.children[j].tagName == 'location'){
					console.log("Read location item with x y z w values: " +
					lightsChild.children[j].attributes.getNamedItem("x").value + " " +
					lightsChild.children[j].attributes.getNamedItem("y").value + " " +
					lightsChild.children[j].attributes.getNamedItem("z").value + " " +
					lightsChild.children[j].attributes.getNamedItem("w").value + ".");
				}
				if(lightsChild.children[j].tagName == 'ambient'){
					console.log("Read ambient item with r g b a values: " +
					lightsChild.children[j].attributes.getNamedItem("r").value + " " +
					lightsChild.children[j].attributes.getNamedItem("g").value + " " +
					lightsChild.children[j].attributes.getNamedItem("b").value + " " +
					lightsChild.children[j].attributes.getNamedItem("a").value + ".");
				}
				if(lightsChild.children[j].tagName == 'diffuse'){
					console.log("Read diffuse item with r g b a values: " +
					lightsChild.children[j].attributes.getNamedItem("r").value + " " +
					lightsChild.children[j].attributes.getNamedItem("g").value + " " +
					lightsChild.children[j].attributes.getNamedItem("b").value + " " +
					lightsChild.children[j].attributes.getNamedItem("a").value + ".");
				}
				if(lightsChild.children[j].tagName == 'specular'){
					console.log("Read specular item with r g b a values: " +
					lightsChild.children[j].attributes.getNamedItem("r").value + " " +
					lightsChild.children[j].attributes.getNamedItem("g").value + " " +
					lightsChild.children[j].attributes.getNamedItem("b").value + " " +
					lightsChild.children[j].attributes.getNamedItem("a").value + ".");
				}
			}
		}

		if(lightsChild.tagName == 'spot'){
			console.log("Read spot item with id enable angle exponent values: " +
			lightsChild.attributes.getNamedItem("id").value + " " +
			lightsChild.attributes.getNamedItem("enabled").value + " " +
			lightsChild.attributes.getNamedItem("angle").value + " " +
			lightsChild.attributes.getNamedItem("exponent").value + ".");

			for(var j = 0; j < lightsChild.children.length; j++){
				if(lightsChild.children[j].tagName == 'target'){
					console.log("Read target item with x y z values: " +
					lightsChild.children[j].attributes.getNamedItem("x").value + " " +
					lightsChild.children[j].attributes.getNamedItem("y").value + " " +
					lightsChild.children[j].attributes.getNamedItem("z").value + ".");
				}
				if(lightsChild.children[j].tagName == 'location'){
					console.log("Read location item with x y z values: " +
					lightsChild.children[j].attributes.getNamedItem("x").value + " " +
					lightsChild.children[j].attributes.getNamedItem("y").value + " " +
					lightsChild.children[j].attributes.getNamedItem("z").value + ".");
				}
				if(lightsChild.children[j].tagName == 'ambient'){
					console.log("Read ambient item with r g b a values: " +
					lightsChild.children[j].attributes.getNamedItem("r").value + " " +
					lightsChild.children[j].attributes.getNamedItem("g").value + " " +
					lightsChild.children[j].attributes.getNamedItem("b").value + " " +
					lightsChild.children[j].attributes.getNamedItem("a").value + ".");
				}
				if(lightsChild.children[j].tagName == 'diffuse'){
					console.log("Read diffuse item with r g b a values: " +
					lightsChild.children[j].attributes.getNamedItem("r").value + " " +
					lightsChild.children[j].attributes.getNamedItem("g").value + " " +
					lightsChild.children[j].attributes.getNamedItem("b").value + " " +
					lightsChild.children[j].attributes.getNamedItem("a").value + ".");
				}
				if(lightsChild.children[j].tagName == 'specular'){
					console.log("Read specular item with r g b a values: " +
					lightsChild.children[j].attributes.getNamedItem("r").value + " " +
					lightsChild.children[j].attributes.getNamedItem("g").value + " " +
					lightsChild.children[j].attributes.getNamedItem("b").value + " " +
					lightsChild.children[j].attributes.getNamedItem("a").value + ".");
				}
			}
		}
	}

};

/*
 * Callback to be executed on any read error
 */

MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);
	this.loadedOk=false;
};
