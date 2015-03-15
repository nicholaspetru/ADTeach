$(document).ready(function () {
	drawBox = function(r,x,y,width,height,color) {
		var box = r.rect(x,y,width,height);
		box.attr({"fill":color, "stroke-width": 2});
		return box;
	}

	drawText = function(r,x,y,val,size) {
		var text = r.text(x,y,val);
		text.attr({"font-family": "Sans-serif", "font-size": size});
		return text;
	}

	select = function(r,box,t,d) {
		var anim1 = Raphael.animation({"stroke": "#339933", "stroke-width":4},t,function() {
			var anim2 = Raphael.animation({"stroke": "#000000", "stroke-width":2});
			box.animate(anim2.delay(d));
		});
		box.animate(anim1.delay(d));
	}

	move = function(r,box,text,width,t,d) {
		var tstring = ""
		var anim = Raphael.animation({"transform": "t" + width.toString() + ",0"},t);
		box.animate(anim.delay(d));
		text.animate(anim.delay(d));
	}
});
