//http://wesleytodd.com/2013/4/drag-n-drop-in-raphael-js.html
	Raphael.st.draggable = function() {
		var me = this, // ref to set
			lx = 0, // where the elements are currently
			ly = 0,
			ox = 0, // where the elements started
			oy = 0,
			moveFnc = function(dx, dy){
				lx = dx + ox; // add the new change in x to the drag origin
				ly = dy + oy; // do the same for y
				me.transform('t' + lx + ',' + ly);
			},
			startFnc = function(){},
			endFnc = function(){
				ox = lx;
				oy = ly;
			};
		this.drag(moveFnc, startFnc, endFnc); // loop through all elements in set and attach the three event handlers
	};