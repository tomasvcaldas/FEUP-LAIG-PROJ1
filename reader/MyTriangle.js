/**
 * Triangle
 * @constructor
 */
function Triangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
    CGFobject.call(this, scene);

    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;
    this.x3 = x3;
    this.y3 = y3;
    this.z3 = z3;

    this.initBuffers();
};

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor = Triangle;

Triangle.prototype.initBuffers = function() {
    this.vertices = [
        this.x1, this.y1, this.z1,
        this.x2, this.y2, this.z2,
        this.x3, this.y3, this.z3
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

    var properties = this.getVectorsProperties(this.makeVector(this.point3, this.point2),
            this.makeVector(this.point3, this.point1));


        this.baseTexCoords = [
          properties[0] - properties[1] * Math.cos(properties[2]), properties[1] * Math.sin(properties[2]),
          0, 1,
          properties[0], 1,
        ];

        this.texCoords = [
          properties[0] - properties[1] * Math.cos(properties[2]), 1 - properties[1] * Math.sin(properties[2]),
          0, 1,
          properties[0], 1,
        ];

        this.initGLBuffers();
    };


    Triangle.prototype.makeVector = function(point1, point2) {
        return new Point3(this.x2 - this.x1, this.y2 - this.y1, this.z2 - this.z1)
    }

    Triangle.prototype.dotProduct = function(point1, point2) {
        return (this.x1 * this.x2) + (this.y1 * this.y2) + (this.z1 * this.z2);
    }

    Triangle.prototype.calculateLength = function(vec) {
        return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y) + (vec.z * vec.z));
    }

    Triangle.prototype.getVectorsProperties = function(vec1, vec2) {
        var length1 = this.calculateLength(vec1);
        var length2 = this.calculateLength(vec2);
        var dot = this.dotProduct(vec1, vec2);
        var angle = Math.acos(dot / (length1 * length2));

        return [length1, length2, angle];
    }


    Triangle.prototype.setTextureCoords = function(length_s, length_t) {
      this.texCoords = [
        this.baseTexCoords[0] / length_s, 1-(this.baseTexCoords[1] / length_t),
        0, 1,
        this.baseTexCoords[4] / length_s, 1
      ];

        this.initGLBuffers();
    };
