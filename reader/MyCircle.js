/**
 * MyCircle
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyCircle(scene, slices) {
	CGFobject.call(this,scene);
	this.slices = slices;

	this.initBuffers();
};

MyPolygon.prototype = Object.create(CGFobject.prototype);
MyPolygon.prototype.constructor=MyCicle;

MyPolygon.prototype.initBuffers = function () {
  this.vertices = [];
  this.indices = [];
  this.normals = [];
  this.texCoords = [];

 	this.ang = Math.PI*2/this.slices;

 	this.vertices.push(0, 0, 0);
 	this.normals.push(0, 0, 1);
 	this.texCoords.push(0.5, 0.5);

    for(i=0; i< this.slices; i++){
    	this.vertices.push(Math.cos(this.ang*i), Math.sin(this.ang*i), 0);
    	this.normals.push(0, 0, 1);
    	this.texCoords.push((Math.cos(-this.ang*i)+1)/2, (Math.sin(-this.ang*i)+1)/2);
    }

    for(i=1; i<= this.slices; i++){
    	this.indices.push(i, i%this.slices+1, 0);
    }

	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
