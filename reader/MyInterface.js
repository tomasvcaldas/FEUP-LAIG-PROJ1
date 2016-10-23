/**
 * MyInterface
 * @constructor
 */

function MyInterface() {
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);

	this.gui = new dat.GUI();

  this.omni=this.gui.addFolder("Omni lights:");
	this.omni.open();

  this.spot=this.gui.addFolder("Spot lights:");
  this.spot.open();

	return true;
};

MyInterface.prototype.addLight = function(type,i, name) {
    if (type == "omni")
        this.omni.add(this.scene.lightsBoolean, i, this.scene.lightsBoolean[i]).name(name);
    if(type=="spot")
       this.spot.add(this.scene.lightsBoolean, i, this.scene.lightsBoolean[i]).name(name);
};


MyInterface.prototype.processKeyDown = function(event) {

    switch (event.keyCode) {
        case (86):
        case (118): //v maiusculo ou minusculo
            this.scene.updateView();
            break;
    };
};

