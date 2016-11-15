/**
 * @constructor
 */
 function MyPatch(scene, orderU, orderV, divX, divY) {
    this.scene = scene;

    var knots1 = this.getKnotsVector(orderU);
  	var knots2 = this.getKnotsVector(orderV);

    this.orderU = orderU;
    this.orderV = orderV;

    this.dX = divX;
    this.dY = divY;

    this.controlP = [	// U = 0
            [ // V = 0..1;
            [ -1.5, -1.5, 0, 1 ],
            [ -1.5,  1.5, 0, 1 ]

            ],
              // U = 1
            [ // V = 0..1
            [ 0, -1.5, 3.0, 1 ],
            [ 0,  1.5, 3.0, 1 ]
            ],
              // U = 2
              [ // V = 0..1
            [ 1.5, -1.5, 0, 1 ],
            [ 1.5,  1.5, 0, 1 ]
            ]
            ];

    var nurbsSurface = new CGFnurbsSurface(this.orderU, this.orderV, knots1, knots2, this.controlP);
    getSurfacePoint = function(u, v){
      return nurbsSurface.getPoint(u,v);
    };

    this.patch = new CGFnurbsObject(this.scene, getSurfacePoint, this.dX, this.dY);

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
  }

  MyPatch.prototype.display = function(){
    this.patch.display();
  };
