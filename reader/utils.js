class Point3 {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	toArray() {
		return [this.x, this.y, this.z];
	}
}

function Material(id, emission, ambient, diffuse, specular, shininess){
    this.id = id;
    this.emission = emission;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;
    this.shininess = shininess;
}

class Color{
	constructor(r,g,b,a){
		this.r=r;
		this.g=g;
		this.b=b;
		this.a=a;
	}
}

class Omni{
	constructor(id,enabled,location,ambient,diffuse,specular){
		this.id=id;
		this.enabled=enabled;
		this.location=location;
		this.ambient=ambient;
		this.diffuse=diffuse;
		this.specular=specular;
	}
}

class Spot{

	constructor(id,enabled,exponent,angle,target,location,ambient,diffuse,specular){
		this.id=id;
		this.enabled=enabled;
		this.exponent=exponent;
		this.angle=angle;
		this.target=target;
		this.location=location;
		this.ambient=ambient;
		this.diffuse=diffuse;
		this.specular=specular;
	}
}

class Point3W{
	constructor(x,y,z,w){
		this.x=x;
		this.y=y;
		this.z=z;
		this.w=w;
	}
}

class Texture{
	constructor(id, file, lengths, lengtht){
		this.id = id;
		this.file = file;
		this.lengths = parseFloat(lengths);
		this.lengtht = parseFloat(lengtht);
	}
}

function Stack(item){
	this.stack = [];
	if(item != null)
	this.stack.push(item);
}

Stack.prototype.push = function(item){
	this.stack.push(item);
}

Stack.prototype.pop = function(){
	this.stack.pop();
}

Stack.prototype.top = function(){
	return this.stack[this.stack.length - 1];
}

class Illumination{
	constructor(doublesided,local,ambient,background){
		this.doublesided=doublesided;
		this.local=local;
		this.ambient=ambient;
		this.background=background;
	}
}
