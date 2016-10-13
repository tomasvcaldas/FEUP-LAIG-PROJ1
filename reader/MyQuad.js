/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyQuad(scene, x1, y1, x2, y2, minS = 0, maxS = 1, minT = 0, maxT = 1) {
	CGFobject.call(this,scene);

	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;

	this.minS = minS;
	this.maxS = maxS;
	this.minT = minT;
	this.maxT = maxT;

	this.initBuffers();
};

MyQuad.prototype = Object.create(CGFobject.prototype);
MyQuad.prototype.constructor=MyQuad;

MyQuad.prototype.initBuffers = function () {
	this.vertices = [
        this.x1, this.y1, 0,
        this.x2, this.y1, 0,
        this.x2, this.y2, 0,
        this.x1, this.y2, 0
    ];

	this.indices = [
            0, 1, 2,
            2,3,0
    ];

		this.primitiveType=this.scene.gl.TRIANGLES;

    this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
    ]

	this.texCoords = [
			this.minS, this.maxT,
			this.maxS, this.maxT,
			this.maxS, this.minT,
			this.minS, this.minT
	]


	this.initGLBuffers();
};
