/**
* MyChessboard
* @constructor
*/
function MyChessboard(scene, du, dv, textureref, su, sv, c1, c2, cs) {
  CGFobject.call(this,scene);

  this.du = du;
  this.dv = dv;
  this.textureref = textureref;
  this.su = su;
  this.sv = sv;
  this.c1 = vec4.fromValues(c1.r, c1.g, c1.b, c1.a);
  this.c2 = vec4.fromValues(c2.r, c2.g, c2.b, c2.a);
  this.cs = vec4.fromValues(cs.r, cs.g, cs.b, cs.a);

  this.boardPlane = new MyPlane(this.scene, 1.0, 1.0, this.du*4, this.dv*4);

  this.texture = new CGFappearance(this.scene);
  this.texture.loadTexture(this.textureref);

  this.shader = new CGFshader(this.scene.gl, "shaders/chessboard.vert", "shaders/chessboard.frag");
  this.shader.setUniformsValues({du : this.du});
  this.shader.setUniformsValues({dv : this.dv});
  this.shader.setUniformsValues({su : this.su});
  this.shader.setUniformsValues({sv : this.sv});
  this.shader.setUniformsValues({c1 : this.c1});
  this.shader.setUniformsValues({c2 : this.c2});
  this.shader.setUniformsValues({cs : this.cs});

  this.initBuffers();

};

MyChessboard.prototype = Object.create(CGFobject.prototype);
MyChessboard.prototype.constructor = MyChessboard;

MyChessboard.prototype.display = function() {
  this.texture.apply();
  this.scene.setActiveShader(this.shader);
  this.boardPlane.display();
  this.scene.setActiveShader(this.scene.defaultShader);
};
