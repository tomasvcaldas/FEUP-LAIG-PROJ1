
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

		var prim = tempPrim[0].children[i].children;

		/*var var1 = prim[j].attributes.getNamedItem("x1").value;       <isto é a outra maneira de mostrar.>
		console.log("Read rectangle item id x1 with value " + var1);
		var var2 = prim[j].attributes.getNamedItem("y1").value;
		console.log("Read rectangle item id y1 with value " + var2);
		var var3 = prim[j].attributes.getNamedItem("x2").value;
		console.log("Read rectangle item id x2 with value " + var3);
		var var4 = prim[j].attributes.getNamedItem("y2").value;
		console.log("Read rectangle item id y2 with value " + var4);*/
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


			/*for(var k = 0 ; k < comp.length ;  k++){
				console.log("tag name: " + comp[j].tagName + " tamanho: " + comp[j].children.length);
			}*/

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






};

/*
 * Callback to be executed on any read error
 */

MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);
	this.loadedOk=false;
};
