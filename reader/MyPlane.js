/**
 * @constructor
 */

function MyPlane(scene, dx, dy) {
	this.scene = scene;

	var knots = [0, 0, 1, 1];
	var controlPoints = [
							[
								[-dx/2, -dy/2, 0, 1],
								[-dx/2, dy/2, 0, 1]
							],
							[
								[dx/2, -dy/2, 0, 1],
								[dx/2, dy/2, 0, 1]
							]
						];

	var nurbsSurface = new CGFnurbsSurface(1, 1, knots, knots, controlPoints);

	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	this.plane = new CGFnurbsObject(this.scene, getSurfacePoint, dx, dy);

}

MyPlane.prototype = Object.create(CGFobject.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.display = function() {
		this.plane.display();
}

MyPlane.prototype.setAmpSAmpT = function (ampS, ampT) {}
