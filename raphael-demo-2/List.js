//List.js
//A test implementation of a list

$(document).ready(function () {
	List = function(r,name,type,value,x,y,width,height) {
		Entity.call(this,r,name,type,value,x,y,width,height,"#D4F1FF");
		this.rBoxes = [];
		this.rTexts = [];
		this.rPosBoxes = [];
		this.rPosTexts = [];
	}

	List.prototype = Object.create(Entity.prototype);
	List.prototype.constructor = List;

	List.prototype.Draw = function() {
		this.DrawName();
		this.drawBoxes();
		this.drawTexts();
		this.drawPositionBoxes();
		this.drawPositionTexts();
	}

	List.prototype.drawBoxes = function() {
		for (var i=0; i < this.value.length; i++) {
			this.rBoxes.push(drawBox(this.r, this.x + i*this.width, this.y, this.width, this.height, this.color));
		}
	}

	List.prototype.drawTexts = function() {
		for (var i=0; i < this.value.length; i++) {
			this.rTexts.push(drawText(this.r, this.x + i*this.width + this.width/2, this.y + this.height/2, this.value[i].toString(), this.textSize));
		}
	}

	List.prototype.drawPositionBoxes = function() {
		for (var i=0; i < this.value.length; i++) {
			this.rPosBoxes.push(drawBox(this.r, this.x + i*this.width, this.y - this.height/3, this.width, this.height/3, "#E6E6E6"));
		}
	}

	List.prototype.drawPositionTexts = function() {
		for (var i=0; i < this.value.length; i++) {
			this.rPosTexts.push(drawText(this.r, this.x + i*this.width + this.width/2, this.y - this.height/6, i.toString(), this.textSize/2));
		}
	}

	List.prototype.MakeRoom = function() {
		this.rPosBoxes.push(drawBox(this.r, this.x + this.value.length*this.width, this.y - this.height/3, this.width, this.height/3, "#E6E6E6"));
		this.rPosTexts.push(drawText(this.r, this.x + this.value.length*this.width + this.width/2, this.y - this.height/6, this.value.length.toString(), this.textSize/2));
		this.moveDown();
	}

	List.prototype.moveDown = function() {
		t = 500;
		d = 500;
		for (var i = this.value.length - 1; i >=0; i--) {
			select(this.r,this.rBoxes[i],t,d);
			move(this.r,this.rBoxes[i],this.rTexts[i],this.width,t,d);
			//t += 500;
			d += 1000;
		}
	}
});