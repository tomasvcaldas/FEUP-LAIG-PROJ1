/**
 * Torus
 * @constructor
 */
function Torus(scene, inner, outer, slices, loops) {
    CGFobject.call(this, scene);

    this.inner = parseFloat(inner);
    this.outer = parseFloat(outer);
    this.slices = parseInt(slices);
    this.loops = parseInt(loops);

    this.initBuffers();
};

Torus.prototype = Object.create(CGFobject.prototype);
Torus.prototype.constructor = Torus;

Torus.prototype.initBuffers = function() {

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    for (var stack = 0; stack <= this.loops; stack++) {
        var theta = stack * 2 * Math.PI / this.loops;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var slice = 0; slice <= this.slices; slice++) {
            var phi = slice * 2 * Math.PI / this.slices;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = (this.outer + (this.inner * cosTheta)) * cosPhi;
            var y = (this.outer + (this.inner * cosTheta)) * sinPhi
            var z = this.inner * sinTheta;
            var s = 1 - (stack / this.loops);
            var t = 1 - (slice / this.slices);

            this.vertices.push(x, y, z);
            this.normals.push(x, y, z);
            this.texCoords.push(s, t);
        }
    }

    for (var stack = 0; stack < this.loops; stack++) {
        for (var slice = 0; slice < this.slices; slice++) {
            var first = (stack * (this.slices + 1)) + slice;
            var second = first + this.slices + 1;

            this.indices.push(first, second + 1, second);
            this.indices.push(first, first + 1, second + 1);
        }
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
