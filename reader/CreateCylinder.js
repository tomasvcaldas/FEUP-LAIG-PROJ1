/**
* CreateCylinder
* @constructor
*/
function CreateCylinder(scene, base, top, height, slices, stacks) {
	CGFobject.call(this,scene);

	this.surface = new MyCylinder(scene, base, top, height, slices, stacks);
	this.root = new MyCylinderBase(scene, base, slices);
	this.top = new MyCylinderBase(scene, top, slices);
};

CreateCylinder.prototype = Object.create(CGFobject.prototype);
CreateCylinder.prototype.constructor = CreateCylinder;


CreateCylinder.prototype.display = function() {

	this.surface.display();

	this.scene.pushMatrix();
		this.scene.translate(0, 0, 1);
		this.root.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.top.display();
	this.scene.popMatrix();
}
