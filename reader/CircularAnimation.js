function MyCircularAnimation(scene,id,span,type,centerx,centery,centerz,radius,startang,rotang){

  MyAnimation.call(scene, id, type, span);

  this.centerx=centerx;
  this.centery=centery;
  this.centerz=centerz;
  this.radius=radius;
  this.startang=startang;
  this.rotang=rotang;
}
