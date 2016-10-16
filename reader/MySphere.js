function Sphere(scene, radius, slices, stacks) {
    CGFobject.call(this, scene);

    this.radius = parseFloat(radius);
    this.slices = parseInt(slices);
    this.stacks = parseInt(stacks);

    this.initBuffers();
};

Sphere.prototype = Object.create(CGFobject.prototype);
Sphere.prototype.constructor = Sphere;

Sphere.prototype.initBuffers = function() {

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    for (var stack = 0; stack <= this.stacks; stack++) {
        var theta = stack * Math.PI / this.stacks;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var slice = 0; slice <= this.slices; slice++) {
            var phi = slice * 2 * Math.PI / this.slices;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = this.radius * cosPhi * sinTheta;
            var y = this.radius * cosTheta;
            var z = this.radius * sinPhi * sinTheta;
            var s = 1 - (stack / this.stacks);
            var t = 1 - (slice / this.slices);

            this.vertices.push(x, y, z);
            this.normals.push(x, y, z);
            this.texCoords.push(s, t);
        }
    }

    for (var stack = 0; stack < this.stacks; stack++) {
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
