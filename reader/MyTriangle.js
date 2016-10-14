/**
 * Triangle
 * @constructor
 */
function Triangle(scene, point1, point2, point3) {
    CGFobject.call(this, scene);

    this.point1 = point1;
    this.point2 = point2;
    this.point3 = point3;

    this.initBuffers();
};

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor = Triangle;

Triangle.prototype.initBuffers = function() {
    this.vertices = [
        this.point1.x, this.point1.y, this.point1.z,
        this.point2.x, this.point2.y, this.point2.z,
        this.point3.x, this.point3.y, this.point3.z
    ];

    this.indices = [
        0, 1, 2,
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;


    this.normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
    ];

    this.initGLBuffers();
};
