function MyLinearAnimation(scene,id,span,type,controlP){

  MyAnimation.call(this, scene, id, span, type);
   this.controlP=controlP;

   this.distance=0;
  this.segDist = [];

   for (var i = 0; i < controlP.length - 1; i++) {
 		this.distance += vec3.dist(vec3.fromValues(controlP[i][0], controlP[i][1], controlP[i][2]), vec3.fromValues(controlP[i + 1][0], controlP[i + 1][1],controlP[i + 1][2]));
 		this.segDist.push(this.distance);
 	}

   this.velocity = this.distance / span;
 };

 MyLinearAnimation.prototype = Object.create(MyAnimation.prototype);

 MyLinearAnimation.prototype.constructor = MyLinearAnimation;

 MyLinearAnimation.prototype.apply = function(span){

   if(span > this.span)
     span = this.span;

     this.currentDistance = this.velocity * span;

     //encontra segmento
     var i = 0;
 	  while (this.currentDistance > this.segDist[i] && i < this.segDist.length)
 		i++;
     //encontra pontos de controlo do segmento
     var p1 = this.controlP[i];
 	  var p2 = this.controlP[i + 1];

     var dist1 = p2[0] - p1[0];
     var dist2 = p2[1] - p1[1];
     var dist3 = p2[2] - p1[2];


   var lastDist;
   if(i == 0)
     lastDist = 0;
   else
     lastDist = this.segDist[i - 1];

     var displacement = (this.currentDistance - lastDist) / (this.segDist[i] - lastDist);

    this.scene.translate(dist1 * displacement + p1[0], dist2* displacement + p1[1], dist3 * displacement * p1[2]);
 }
