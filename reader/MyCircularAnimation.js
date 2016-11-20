function MyCircularAnimation(scene,id,span,type,centerx,centery,centerz,radius,startang,rotang){

  MyAnimation.call(this,scene, id, span,type);
  this.centerx=centerx;
  this.centery=centery;
  this.centerz=centerz;
  this.radius=radius;
  this.startang=startang*Math.PI/180;
  this.rotang=rotang*Math.PI/180;
  this.complete = false;
  this.elapsedTime = 0;

  this.velocity = this.rotang / span;
};

MyCircularAnimation.prototype = Object.create(MyAnimation.prototype);

MyCircularAnimation.prototype.constructor = MyCircularAnimation;

MyCircularAnimation.prototype.apply = function(currTime,node) {
  if(this.elapsedTime == 0) this.elapsedTime = currTime;
  var span = currTime-this.elapsedTime;
	if (span > this.span){
		span = this.span;
    this.complete = true;
  }

    if(node.animationIndex < node.animation.length){
      node.animationIndex++;
 }

	this.scene.translate(this.centerx, this.centery, this.centerz);

	var angle = this.startang + this.velocity * span;
	this.scene.rotate(angle, 0, 1, 0);

	this.scene.translate(this.radius, 0, 0);
}
