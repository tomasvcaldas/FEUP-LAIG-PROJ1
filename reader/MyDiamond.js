/**
 * MyDiamond
 * @constructor
 */

 function MyDiamond(scene, slices) {
 	CGFobject.call(this,scene);

  this.slices =slices;

 	this.initBuffers();
 };


 MyDiamond.prototype = Object.create(CGFobject.prototype);
 MyDiamond.prototype.constructor = MyDiamond;

 MyDiamond.prototype.initBuffers = function() {

  this.trianglesUp=[];
  this.trianglesDown=[];

  var angle = 2* Math.PI / this.slices;

  for (var i=0; i < this.slices; i++){

    this.trianglesUp[i] = new Triangle(this.scene,
                                          0.5*Math.cos(i*angle),0,0.5*Math.sin(i*angle),
                                          0,2,0,
                                          0.5*Math.cos((i+1)*angle),0, 0.5*Math.sin((i+1)*angle));

    this.trianglesDown[i] = new Triangle(this.scene,
                                          0.5*Math.cos(i*angle),0,0.5*Math.sin(i*angle),
                                          0,-2,0,
                                          0.5*Math.cos((i+1)*angle),0, 0.5*Math.sin((i+1)*angle));

  }


};

MyDiamond.prototype.display = function (){
for (var j = 0; j < this.slices; j++) {
  this.trianglesUp[j].display();
  this.trianglesDown[j].display();
}
}
