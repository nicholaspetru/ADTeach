// LIST ADT
$(document).ready(function () {
	/*
	* Create a Raphael paper with the dimensions of the vis_env div element,
	* and put it in the proper location
	* ----------------------------------------------------------------------
	*/
	var height = $("#vis_env").height();
	var width = $("#vis_env").width();
	var r = Raphael("vis_env", width, height);

	/*
	* There's no easy way to append a text element to a rectangle element,
	* so we have to draw them separately. These functions draw the original 
	* list on the paper
	* ---------------------------------------------------------------------
	*/
	
	// Draw a box for each element in the array.
	// After this function executes, the array contains Raphael rectangle elements 
	// instead of strings
	Array.prototype.drawListBoxes = function(x,y,w,h) {
		for (i = 0; i < this.length; i++) {
			this[i] = r.rect(x,y,w,h); // create the rectangle element at x,y
			this[i].attr("fill", "#D4F1FF"); // modify its attributes
			this[i].attr("stroke-width", "2");
			x += w; // move to the proper x coord for the next rectangle element
		}
	}

	// Draw the value of each list element on top of the appropriate box
	// After this function executes, the array contains Raphael text elements
	// instead of strings
	Array.prototype.drawListTexts = function(x,y,w,h) {
		for (i = 0; i < this.length; i++) {
			var nx = x + w/2;
			var ny = y + h/2;

			var val = this[i].valueOf(); // get the primitive element at this list position
			val = val.toString(); // irrelevant here but for integers etc it'll matter
			this[i] = r.text(nx,ny,val); // create the text element at nx,ny
			this[i].attr({"font-family": "Sans-serif", "font-size": 22});
			this[i].toFront(); // put the text on top of the box so it's visible
			x += w;
		}
	}

	// Draw a box for each index in the array. 
	// After this function executes, the array contains Raphael rectangle elements 
	// instead of strings
	Array.prototype.drawListHeader = function(x,y,w,h) {
		for (i = 0; i < this.length; i++) {
			this[i] = r.rect(x,y,w,h);
			this[i].attr("fill", "#E6E6E6");
			this[i].attr("stroke-width", "2");
			x += w;
		}
	}

	// Draw each index number on top of the appropriate box
	// After this function executes, the array contains Raphael text elements
	// instead of strings
	Array.prototype.drawListIndices = function(x,y,w,h) {
		for (i = 0; i < this.length; i++) {

			var nx = x + w/2;
			var ny = y + h/2;

			var name = i.toString();
			this[i] = r.text(nx,ny,name);
			this[i].attr({"font-family": "Sans-serif", "font-size": 14, "font-weight:": 500});
			this[i].toFront();
			x += w;
		}
	}

	/*
	* These functions draw a primitive value on the paper
	* ----------------------------------------------------
	*/

	// Draw a w x h Raphael rectangle element at (x,y) and return a reference to it 
	drawPrimitiveBox = function(x,y,w,h) {
		box = r.rect(x,y,w,h);
		box.attr("stroke-width", "2");
		return box;
	}

	// Draw a Raphael text element at (x,y) with value val and return a reference to it
	drawPrimitiveText = function(x,y,w,h,val) {
		var nx = x + w/2;
		var ny = y + h/2;

		text = r.text(nx,ny,val);
		text.attr({"font-family": "Sans-serif", "font-size": 22});

		return text;
	}

	/*
	* These functions 'select' and 'unselect' a Raphael rectangle element on the paper.
	* ----------------------------------------------------
	*/

	// Selecting an element makes the border bold and green
	select = function(box,t) {
		var anim = Raphael.animation({"stroke": "#339933", "stroke-width":3});
		box.animate(anim.delay(t)); // delay the animation by t ms; this is so everything doesnt happen at once
	}

	// Unselecting an element changes it back to normal
	unselect = function(box,t){
		var anim = Raphael.animation({"stroke": "#000000", "stroke-width":2});
		box.animate(anim.delay(t));
	}

	/*
	* These functions are called when an element is inserted into 
	* the front of the list. 
	* ----------------------------------------------------
	*/
	// Draw an additional index box
	Array.prototype.addToListHeader = function(x,y,w,h) {
		var len = this.length;
		this[len] = r.rect(250,ly-lh/3,lw,lh/3);
		this[len].attr("fill", "#E6E6E6");
		this[len].attr("stroke-width", "2");
	}

	// Draw the additional index on top of the box
	Array.prototype.addToIndices = function(x,y,w,h) {
		var len = this.length;
		var nx = x + w/2;
		var ny = y + h/2;

		var name = len.toString();
		this[len] = r.text(nx,ny,name);
		this[i].attr({"font-family": "Sans-serif", "font-size": 14, "font-weight:": 500});
		this[len].toFront();	
	}

	// Starting at the end of the list: select each element, shift it one position to the right,
	// then unselect the element
	shiftBoxesDown = function(boxes) {
		var t = 500;

		for (i = boxes.length - 1; i >= 0; i--) {
			select(boxes[i],t);
			var x1 = boxes[i].getBBox().x;
			var x2 = x1 + boxes[i].getBBox().width;
			var anim = Raphael.animation({x:x2},500); // the element is moved from x1 to x2 in 500ms
			boxes[i].animate(anim.delay(t)); // delay by t ms to move each element one by one
			t += 500;
			unselect(boxes[i],t);
		}
	}

	// Starting at the end of the list, shift each text element one position to the right
	shiftTextsDown = function(texts) {
		var t = 500;

		for (i = texts.length - 1; i >= 0; i--) {
			var x1 = listBoxes[i].getBBox().x;
			var bw = listBoxes[i].getBBox().width;
			var x2 = x1 + bw + bw/2;

			var anim = Raphael.animation({x:x2},500);
			texts[i].animate(anim.delay(t));
			t += 500;
		}
	}	

	/*
	* Make the things, do the stuff 
	* ----------------------------------------------------
	*/

	var list = ["C", "B", "D", "A"]; // mock a List object's "value" attribute
	// make a bunch of copies of this array... not really sure why I decided to do it this way
	// but I guess I'll commit now
	var listBoxes = list.slice();
	var listTexts = list.slice();
	var listHeader = list.slice();
	var listIndices = list.slice();

	var lx = 50; // x coord of first element in the list
	var ly = 400; // y coord of first element in the list
	var lw = 50; // width of each list element
	var lh = 50; // height of each list element

	draw = function() {	
		listBoxes.drawListBoxes(lx,ly,lw,lh);
		listTexts.drawListTexts(lx,ly,lw,lh);
		listHeader.drawListHeader(lx,ly-lh/3,lw,lh/3);
		listIndices.drawListIndices(lx,ly-lh/3,lw,lh/3);
	}

	draw();

	insertInFront = function(box,text,t) {
		var x1 = box.getBBox().x;
		var y1 = box.getBBox().y;
		var x2 = lx;
		var y2 = ly;
		var x3 = lx + lw/2;
		var y3 = ly + lh/2;

		var boxeList = [];
		boxeList.append([x1, y1]);
		boxeList.append([x2, y2]);
		boxeList.append([x3, y3]);


		var anim1 = Raphael.animation({x:x2,y:y2},1000); // move the primitive element's box to list position 0 in 1000ms
		var anim2 = Raphael.animation({x:x3,y:y3},1000); // move the primitive element's text to position 0 in 1000ms
		var anim3 = Raphael.animation({"fill": "#D4F1FF"}); // make the element blue once it's in the right spot

		select(box,t);
		t+=400;
		box.animate(anim1.delay(t));
		text.animate(anim2.delay(t));
		t += 1000;
		unselect(box,t);
		box.animate(anim3.delay(t));
	}


	// Listen for clicks
	$("#addToFront").click(function() {
		// Draw the primitive element to insert
		var p1 = "E";
		var p1box = drawPrimitiveBox(200,200,50,50);
		var p1text = drawPrimitiveText(200,200,50,50,p1);

		var t = list.length;

		var front = ["E"];
		var newList = front.concat(list);

		select(p1box,500*listBoxes.length);
		listHeader.addToListHeader(250,ly-lh/3,lw,lh/3);
		listIndices.addToIndices(250,ly-lh/3,lw,lh/3);
		shiftBoxesDown(listBoxes);
		shiftTextsDown(listTexts);
		insertInFront(p1box,p1text,t*500);

		list = newList;
		listBoxes = list.slice();
		listTexts = list.slice();
		listHeader = list.slice();
		listIndices = list.slice();
		console.log(list);
	})
});