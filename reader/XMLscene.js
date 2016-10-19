
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	  this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	  this.enableTextures(true);

    this.brick = "../resources/images/brick.jpg";
    this.wood = "../resources/images/wood.jpg";
    this.boia = "../resources/images/boia.jpg";
    this.new = "../resources/images/orange.jpg";
    this.floor = "../resources/images/carpet3.jpg";
    this.wall ="../resources/images/wall.jpg";

    this.tableAppearance = new CGFappearance(this);
  	this.tableAppearance.setAmbient(0.7,0.7,0.7,0.7);
  	this.tableAppearance.setDiffuse(0.7,0.7,0.7,1);
  	this.tableAppearance.setSpecular(1,1,1,1);
  	this.tableAppearance.setShininess(120);
  	this.tableAppearance.loadTexture(this.wood);

    this.legAppearance = new CGFappearance(this);
    this.legAppearance.setAmbient(0.7,0.7,0.7,0.7);
    this.legAppearance.setDiffuse(0.7,0.7,0.7,1);
    this.legAppearance.setSpecular(1,1,1,1);
    this.legAppearance.setShininess(120);
    this.legAppearance.loadTexture(this.wood);

    this.torusAppearance = new CGFappearance(this);
    this.torusAppearance.setAmbient(0.7,0.7,0.7,0.7);
    this.torusAppearance.setDiffuse(0.7,0.7,0.7,1);
    this.torusAppearance.setSpecular(1,1,1,1);
    this.torusAppearance.setShininess(120);
    this.torusAppearance.loadTexture(this.boia);

    this.floorAppearance = new CGFappearance(this);
    this.floorAppearance.setAmbient(0.7,0.7,0.7,0.7);
    this.floorAppearance.setDiffuse(0.7,0.7,0.7,1);
    this.floorAppearance.setSpecular(1,1,1,1);
    this.floorAppearance.setShininess(120);
    this.floorAppearance.loadTexture(this.floor);


    this.backgroundAppearance = new CGFappearance(this);
    this.backgroundAppearance.setAmbient(0.7,0.7,0.7,0.7);
    this.backgroundAppearance.setDiffuse(0.7,0.7,0.7,1);
    this.backgroundAppearance.setSpecular(1,1,1,1);
    this.backgroundAppearance.setShininess(120);
    this.backgroundAppearance.loadTexture(this.wall);

    this.default = new CGFappearance(this);

	this.axis=new CGFaxis(this);

};

XMLscene.prototype.initLights = function () {

  //OMNI
	 this.lights[0].setPosition(5, 5, 5, 0.2);
   this.lights[0].setAmbient(0.8,0.8,0.8, 0.8);
   this.lights[0].setDiffuse(0.5, 0.5, 0.5, 0.5);
   this.lights[0].setSpecular(1, 1, 0, 1);
   this.lights[0].enable();

};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function ()
{
	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	this.lights[0].setVisible(true);
    this.lights[0].enable();
};

XMLscene.prototype.createGraph = function(initialNode){
  var material = null;
  if(initialNode != null){
    var node = this.graph.nodes[initialNode];

    /*if(node.material != null)
    material = node.material;
    if(material != null)
    this.applyMaterial(material);*/

    if(node.primitive != null)
    node.primitive.display();

    for(var i = 0; i < node.children.length; i++){
      this.pushMatrix();
      //this.applyMaterial(material);
      this.createGraph(node.children[i]);
      this.popMatrix();
    }
  }
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup

	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();
/*
	// Draw axis
	//this.axis.display();
  this.cube = new MyUnitCubeQuad(this);

  //Cubo para fazer o tampo da mesa
  this.pushMatrix();
  this.translate(1,1.5,2);
  this.scale(1.8,0.2,3);
  this.tableAppearance.apply();
  this.cube.display();
  this.popMatrix();

  this.cylinder = new CreateCylinder(this,0.5,0.5,1,50,20);

  //Perna da mesa 2
  this.pushMatrix();
  this.translate(0.2,0,0.6);
  this.rotate(-Math.PI/2, 1, 0, 0);
  this.scale(0.1, 0.1, 1.5);
  this.legAppearance.apply();
  this.cylinder.display();
  this.popMatrix();

  //Perna da mesa 1
  this.pushMatrix();
  this.translate(0.2,0,3.4);
  this.rotate(-Math.PI/2, 1, 0, 0);
  this.scale(0.1, 0.1, 1.5);
  this.legAppearance.apply();
  this.cylinder.display();
  this.popMatrix();

  //Perna da mesa 3
  this.pushMatrix();
  this.translate(1.8,0,3.4);
  this.rotate(-Math.PI/2, 1, 0, 0);
  this.scale(0.1, 0.1, 1.5);
  this.legAppearance.apply();
  this.cylinder.display();
  this.popMatrix();

  //Perna da mesa 4
  this.pushMatrix();
  this.translate(1.8,0,0.6);
  this.rotate(-Math.PI/2, 1, 0, 0);
  this.scale(0.1, 0.1, 1.5);
  this.legAppearance.apply();
  this.cylinder.display();
  this.popMatrix();

  this.triangle = new Triangle(this, -0.5,0,0,0,1,0,0.5,0,0);

  //Triangulo1
  this.pushMatrix();
  this.translate(0.8,1.6,0.7);
  this.rotate(Math.PI/6, 1,0,0);
  this.triangle.display();
  this.popMatrix();

  //Triangulo2
  this.pushMatrix();
  this.translate(0.8,1.6,1.7);
  this.rotate(Math.PI/6, -1,0,0);
  this.rotate(Math.PI, 0,1,0);
  this.triangle.display();
  this.popMatrix();

  //Triangulo3
  this.pushMatrix();
  this.translate(0.3,1.6,1.2);
  this.rotate(Math.PI/6,0,0,-1);
  this.rotate(Math.PI/2, 0,1,0);
  this.triangle.display();
  this.popMatrix();

  //Triangulo4
  this.pushMatrix();
  this.translate(1.3,1.6,1.2);
  this.rotate(Math.PI/6,0,0,1);
  this.rotate(Math.PI/2, 0,-1,0);
  this.triangle.display();
  this.popMatrix();

  this.floor = new MyQuad(this);

  this.pushMatrix();
  this.scale(7,7,7);
  this.translate(0.5,0,0.5);
  this.rotate(Math.PI/2,-1,0,0);
  this.rotate(Math.PI,0,0,1);
  this.floorAppearance.apply();
  this.floor.display();
  this.popMatrix();

  this.torus = new Torus(this,0.5,1,20,10);

  this.pushMatrix();
  this.translate(1,1.75,3);
  this.rotate(-Math.PI/2,1,0,0);
  this.scale(0.3,0.3,0.3);
  this.torusAppearance.apply();
  this.torus.display();
  this.popMatrix();

  this.floor = new MyQuad(this);

  this.default.apply();

  this.pushMatrix();
  this.scale(7,7,7);
  this.translate(0.5,0,0.5);
  this.rotate(Math.PI/2,-1,0,0);
  this.rotate(Math.PI,0,0,1);
  this.floorAppearance.apply();
  this.floor.display();
  this.popMatrix();

  this.default.apply();

 this.background = new MyQuad(this);
  this.pushMatrix();
  this.scale(7,5,7);
  this.translate(0,0.5,0.5);
  this.rotate(Math.PI/2,0,1,0);
  this.rotate(Math.PI,0,0,1);
  this.backgroundAppearance.apply();
  this.background.display();
  this.popMatrix();

//Parede da direita
  this.background = new MyQuad(this);
  this.pushMatrix();
  this.scale(7,5,7);
  this.translate(0.5,0.5,0);
  this.rotate(Math.PI/2,0,0,1);
  this.rotate(Math.PI,0,0,1);
  this.backgroundAppearance.apply();
  this.background.display();
  this.popMatrix();*/

	this.setDefaultAppearance();

	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		this.lights[0].update();
	};

 /*for(var key in this.graph.primitives){
   this.graph.primitives[key].display();
 }*/


};
