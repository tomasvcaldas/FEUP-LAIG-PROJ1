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

class Material{
	constructor(id, emission, ambient, diffuse, specular, shininess){
		this.id = id;
		this.emission = parseFloat(emission);
		this.ambient = parseFloat(ambient);
		this.diffuse = parseFloat(diffuse);
		this.specular = parseFloat(specular);
		this.shiniess = parseInt(shininess);
	}
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

	constructor(id,enabled,angle,exponent,target,location,ambient,diffuse,specular){
		this.id=id;
		this.enabled=enabled;
		this.angle=angle;

	constructor(id,enabled,exponent,target,location,ambient,diffuse,specular){
		this.id=id;
		this.enabled=enabled;
		this.exponent=exponent;
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
