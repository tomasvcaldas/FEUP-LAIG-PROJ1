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

class Texture{
	constructor(id, file, lengths, lengtht){
		this.id = id;
		this.file = file;
		this.lengths = parseFloat(lengths);
		this.lengtht = parseFloat(lengtht);
	}
}
