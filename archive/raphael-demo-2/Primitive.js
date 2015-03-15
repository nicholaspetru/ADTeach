//primitive.js
//Represents primitive objects like ints, strings, etc (something that doesn't need a data structure.)

$(document).ready(function () {
	Primitive = function(r,name,type,value,x,y,width,height) {
		Entity.call(this,r,name,type,value,x,y,width,height,"#FFF");
		this.rBox = undefined;
		this.rText = undefined;
	}

	Primitive.prototype = Object.create(Entity.prototype);
	Primitive.prototype.constructor = Primitive;

	Primitive.prototype.Draw = function() {
		this.DrawName();
		this.rBox = drawBox(this.r, this.x, this.y, this.width, this.height, this.color);
		this.rText = drawText(this.r, this.x + this.width/2, this.y + this.height/2, this.value.toString(), this.textSize);
	};

	Primitive.prototype.addTo = function(element) {
		console.log("======= ADD " + this.name + " TO " + element.name + " ==========");
		if (this.rName) {
			this.rName.remove();
		}

		// in the case that we're adding a primitive entity to a 
		// LIST:
		element.MakeRoom();
		var d = 500 + 1000*element.value.length;

		var anim1 = Raphael.animation({"x": element.x, "y": element.y},500); // hardcoded timing
		var anim2 = Raphael.animation({"x": element.x + element.width/2, "y": element.y + element.height/2},500);
		this.rBox.animate(anim1.delay(d));; // hardcoded timing
		this.rText.animate(anim2.delay(d));
		
		var blend = Raphael.animation({"fill": element.color});
		this.rBox.animate(blend.delay(d + 500));
	};
});
