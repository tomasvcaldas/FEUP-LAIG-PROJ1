/**
 * @constructor
 */
 function MyPatch(scene, orderU, orderV, divX, divY,controlP) {
    this.scene = scene;

    this.orderU = parseInt(orderU);
    this.orderV = parseInt(orderV);
    this.dX = parseInt(divX);
    this.dY = parseInt(divY);
    this.controlP = controlP;

    console.log(this.controlP);

    var knots1 = this.getKnotsVector(this.orderU);
    var knots2 = this.getKnotsVector(this.orderV);

    this.points = [[0,0,0],[2,2,2],[4,4,4]];

    var nurbsSurface = new CGFnurbsSurface(this.orderU, this.orderV, knots1, knots2, this.controlP);
    getSurfacePoint = function(u, v){
      return nurbsSurface.getPoint(u,v);
    };


    this.patch = new CGFnurbsObject(this.scene, getSurfacePoint, this.dX, this.dY);


    //this.animation = new MyLinearAnimation(scene,0,10,0,this.points);
/*
    this.animation = new MyCircularAnimation(scene,0,5,0,0,0,0,0,0,90);*/

  };

  MyPatch.prototype = Object.create(CGFobject.prototype);
  MyPatch.prototype.constructor = MyPatch;

  MyPatch.prototype.getKnotsVector = function(degree){
    var v = new Array();
    for (var i=0; i<=degree; i++) {
      v.push(0);
    }
    for (var i=0; i<=degree; i++) {
      v.push(1);
    }
    return v;
  };

  MyPatch.prototype.display = function(time){
  //  this.animation.apply(time);
    this.patch.display();
  };
