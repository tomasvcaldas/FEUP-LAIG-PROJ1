/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyVehicle(scene,orderU,orderV,partsU,partsV, cPoints) {
	CGFobject.call(this,scene);

	this.base = new CreateCylinder(this.scene,0.5,0.5,1,50,20);
	this.wheelline = new CreateCylinder(this.scene,0.5,0.5,1,50,20);
	this.wheelline2 = new CreateCylinder(this.scene,0.5,0.5,1,50,20);
	this.wheel1 = new Torus(this.scene, 0.3, 1, 20, 10);
	this.wheel2 = new Torus(this.scene, 0.3, 1, 20, 10);

	this.tophelice = new MyPatch(this.scene,orderU,orderV,partsU,partsV,cPoints);

	this.backhelice1 = new CreateCylinder(this.scene,0.5,0.5,1,50,20);
	this.backhelice2 = new CreateCylinder(this.scene,0.5,0.5,1,50,20);



  this.base.initBuffers();
	this.wheelline.initBuffers();
	this.wheelline2.initBuffers();
	this.wheel1.initBuffers();
	this.wheel2.initBuffers();
	this.backhelice1.initBuffers();
	this.backhelice2.initBuffers();


};

MyVehicle.prototype = Object.create(CGFobject.prototype);
MyVehicle.prototype.constructor=MyVehicle;

MyVehicle.prototype.display = function() {
  this.scene.pushMatrix();
    this.scene.translate(-4,9.5,6.85);
		this.scene.rotate(Math.PI/2,0,1,0);
    this.scene.scale(0.5,0.5,6);
    this.base.display();
  this.scene.popMatrix();


	this.scene.pushMatrix();
    this.scene.translate(1.7,9.5,6.85);
		this.scene.rotate(Math.PI,1,0,0);
		this.scene.rotate(-Math.PI/4,1,0,0);
		this.scene.rotate(Math.PI/2,0,0,1);
		this.scene.rotate(Math.PI/2,0,1,0);
    this.scene.scale(0.1,0.1,1);
    this.wheelline.display();
  this.scene.popMatrix();

	this.scene.pushMatrix();
    this.scene.translate(1.7,9.5,6.85);
		this.scene.rotate(Math.PI,1,0,0);
		this.scene.rotate(Math.PI/4,1,0,0);
		this.scene.rotate(Math.PI/2,0,0,1);
		this.scene.rotate(Math.PI/2,0,1,0);
    this.scene.scale(0.1,0.1,1);
    this.wheelline2.display();
  this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(1.7,8.8,6.15);
	this.scene.scale(0.1,0.1,0.1 );
		this.wheel1.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(1.7,8.8,7.55);
		this.scene.scale(0.1,0.1,0.1 );
		this.wheel2.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0,9.5,6.85);
		this.scene.rotate(Math.PI,1,0,0);
		this.scene.rotate(Math.PI/2,1,0,0);
		this.scene.scale(1,2,1);
		this.tophelice.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(-3,9.5,5.6);
		this.scene.scale(1.2,0.2,2.5);
		this.backhelice1.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(-3,10.3,6.85);
		this.scene.rotate(Math.PI/2,1,0,0);
		this.scene.scale(1.2,0.2,1.5);
		this.backhelice2.display();
	this.scene.popMatrix();

	};
