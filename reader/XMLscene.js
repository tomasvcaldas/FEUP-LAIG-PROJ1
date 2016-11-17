
function XMLscene(myInterface) {
  CGFscene.call(this);
  this.myInterface=myInterface;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
  CGFscene.prototype.init.call(this, application);

  this.initCameras();

  //this.initLights();

  this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

  this.gl.clearDepth(100.0);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.enable(this.gl.CULL_FACE);
  this.gl.depthFunc(this.gl.LEQUAL);

  this.enableTextures(true);

  this.materials = new Stack(null);
  this.textures = new Stack(null);
  this.appearance = new CGFappearance(this);
  this.patch = new MyPatch(this, 2, 1, 10, 10);
  this.plane = new MyPlane(this, 5, 5);


  this.lightsBoolean=[];

  this.viewIndex=0;
  this.materialIndex = 0;
  this.setUpdatePeriod(100/6);
  this.startTime = 0;

  this.axis=new CGFaxis(this);

};

XMLscene.prototype.initCameras = function () {
  this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function ()
{
  this.gl.clearColor(this.graph.illumination.background.r,this.graph.illumination.background.g,this.graph.illumination.background.b,this.graph.illumination.background.a );
  this.setGlobalAmbientLight(this.graph.illumination.ambient.r,this.graph.illumination.ambient.g,this.graph.illumination.ambient.b,this.graph.illumination.ambient.a);
  this.loadLights();

  this.updateView();
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};

XMLscene.prototype.createGraph = function(initialNode){

  var material = null;

  if(initialNode != null){

    var newNode = this.graph.nodes[initialNode];

    if(newNode.material[this.materialIndex] != "inherit"){
      this.materials.push(this.graph.materials[newNode.material[this.materialIndex]]);
      material = this.materials.top();
      this.materials.pop();
      if(material != null){
        this.appearance.setEmission(material.emission.r, material.emission.g, material.emission.b, material.emission.a);
        this.appearance.setAmbient(material.ambient.r,material.ambient.g,material.ambient.b,material.ambient.a);
        this.appearance.setDiffuse(material.diffuse.r,material.diffuse.g,material.diffuse.b,material.diffuse.a);
        this.appearance.setSpecular(material.specular.r,material.specular.g,material.specular.b,material.specular.a);
        this.appearance.setShininess(material.shininess);


      }

    }

    else{

      this.materials.push(this.materials.top());
    }




    if(newNode.texture != "none" && newNode.texture!= "inherit" && newNode.texture != null){
      this.textures.push(newNode.texture.file);
      this.appearance.setTexture(this.textures.top());
      this.appearance.apply();
    }
    if(newNode.texture != null){
      if(newNode.texture == "inherit"){
        this.textures.push(this.textures.top());
      }
    }
    this.textures.pop();

    this.multMatrix(newNode.mat);

    if(newNode.primitive != null){
      this.pushMatrix();
      newNode.primitive.display();

      this.popMatrix();
    }

    for(var i = 0; i < newNode.componentId.length; i++){
      this.pushMatrix();
      this.createGraph(newNode.componentId[i]);
      this.popMatrix();
    }

  }


};


XMLscene.prototype.update = function(currTime) {
  if (this.startTime == 0)
    this.startTime = currTime;
  this.elapsedTime = (currTime - this.startTime) / 1000;
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
  this.updateLights();
  this.applyViewMatrix();

  this.setDefaultAppearance();
  this.axis.display();
  this.patch.display(this.elapsedTime);

  /*
  if (this.graph.loadedOk)
  {
    this.createGraph("start");
  }*/

};

XMLscene.prototype.loadLights = function () {

  var index = 0;

  for(var i=0; i < this.graph.omniLights.length; i++, index++){

    //Percorrer vetor de luzes omni
    var omni = this.graph.omniLights[i];
    this.lights[index].setPosition(omni.location.x, omni.location.y, omni.location.z, omni.location.w);
    this.lights[index].setAmbient(omni.ambient.r, omni.ambient.g, omni.ambient.b, omni.ambient.a);
    this.lights[index].setDiffuse(omni.diffuse.r, omni.diffuse.g, omni.diffuse.b, omni.diffuse.a);
    this.lights[index].setSpecular(omni.specular.r, omni.specular.g, omni.specular.b, omni.specular.a);

    if (omni.enabled) this.lights[index].enable();
    this.lights[index].setVisible(false);
    this.lights[index].update();

    this.lightsBoolean[index] = omni.enabled;

    this.myInterface.addLight("omni",index, omni.id);
  }

  for(var i=0; i < this.graph.spotLights.length;i++,index++){
    //Percorrer vetor de luzes spot

    var spot = this.graph.spotLights[i];

    this.lights[index].setPosition(spot.location.x, spot.location.y, spot.location.z, spot.location.w);
    this.lights[index].setAmbient(spot.ambient.r, spot.ambient.g, spot.ambient.b, spot.ambient.a);
    this.lights[index].setDiffuse(spot.diffuse.r, spot.diffuse.g, spot.diffuse.b, spot.diffuse.a);
    this.lights[index].setSpecular(spot.specular.r, spot.specular.g, spot.specular.b, spot.specular.a);
    this.lights[index].setSpotDirection((spot.target.x - spot.location.x),(spot.target.y - spot.location.y),(spot.target.z - spot.location.z));
    this.lights[index].setSpotExponent(spot.exponent);

    if (spot.enabled) this.lights[index].enable();
    this.lights[index].setVisible(false);
    this.lights[index].update();

    this.lightsBoolean[index] = spot.enabled;
    this.myInterface.addLight("spot",index, spot.id);
  }

};

XMLscene.prototype.updateLights = function(){
  for(var i = 0; i < this.lightsBoolean.length; i++){
    this.lights[i].setVisible(true);
    if(this.lightsBoolean[i] == true)
    this.lights[i].enable();
    else
    this.lights[i].disable();

    this.lights[i].update();
  }
};

XMLscene.prototype.updateView = function () {
  this.camera = this.graph.perspectives[this.viewIndex];
  this.myInterface.setActiveCamera(this.graph.perspectives[this.viewIndex]);

  this.viewIndex = (++this.viewIndex) % this.graph.perspectives.length;
};

XMLscene.prototype.updateMaterials = function(){

  if(this.materialIndex < this.graph.maxMaterial)
  this.materialIndex ++;
  else {
    this.materialIndex = 0;
  }

};
