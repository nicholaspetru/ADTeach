$(document).ready(function () {
	Entity = function(r,name,type,value,x,y,width,height,color) {
		this.r = r;
		this.name = name;
		this.type = type;
		this.value = value;
		this.x = x;
		this.y = y;
		this.width = width; // width of a single element in the entity
		this.height = height; // height of a single element in the entity
		this.color = color;
		this.textSize = 22;
		this.rName = undefined;
		return this;
	}

	Entity.prototype.DrawName = function() {
		console.log("======= DRAW (" + this.name + " = " + this.value + ") ========");

		if (this.name.charAt(0) != '.') {
			var rName = undefined;
			if (this.type == 'int') {
				rName = this.r.text(this.x + this.width / 2, this.y + this.height + this.height/2, this.name);
			}
			else {
				rName = this.r.text(this.x + (this.value.length * this.width / 2), this.y + this.height + this.height/2, this.name);
			}
			rName.attr({"font-family": "Monospace", "font-size": 22, "font-weight": "bold"});
			this.rName = rName;
		}
	};

	Entity.prototype.SetValue = function(newVal) {
		this.value = newVal;
		console.log("SetValue " + this.name + " = " + this.value);

	};
});
