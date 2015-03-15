/**
* tree.js
* Represents a tree
* ------------------
*/

$(document).ready(function () {
	Tree = function(paper,name,value,vishandler) {
		this.name = name;
		this.type = "Tree";
		this.value = value;
		this.anon = [];
		this.drawn = false;

		this.paper = paper;
		this.VH = vishandler;
		this.x = 0;
		this.y = 0;

		this.FONT_SIZE = 15;
		this.DUNIT_WIDTH = 25.5;
		this.DUNIT_OFFSETY = 20;
		this.DUNIT_OFFSETX = 20;
		this.DUNIT_BACKGROUND_COLOR = "#B6C5BE";
		this.WIDTH = 150;
		this.HEIGHT = 45;

		this.tnodes = {};
		this.branches = [];
		this.myLabel = null;
		this.me = null;

		this.numNodes = 0;
		this.allNodes = [];
	}

	Tree.prototype.update = function(action,originADT) {
		// get method and params
		var split = action.split(".");
		// animate the change
		switch(split[0]) {
			case "populate":
				this.Populate();
				break;
			case "setRoot":
				this.SetRoot(parseInt(split[1]));
				break;
			case "addChild":
				if (split.length > 3) {
					this.AddChild(parseInt(split[1]),parseInt(split[2]),parseInt(split[3]));
				}
				else {
					this.AddChild(parseInt(split[1]),parseInt(split[2]));
				}
				break;
			case "getChild":
				this.GetChild(parseInt(split[1]),parseInt(split[2]));
				break;
			case "getChildren":
				this.GetChildren(parseInt(split[1]));
				break;
			case "getParent":
				this.GetParent(parseInt(split[1]));
				break;
			case "removeChild":
				this.RemoveChild(parseInt(split[1]),parseInt(split[2]));
				break;
			case "removeVertex":
				this.RemoveVertex(parseInt(split[1]));
				break;
			default:
				console.log("Unknown action for Trees: " + action);
				break;
		}
	};

	Tree.prototype.move = function(newX,newY) {
		var difX,difY;
		difX = newX - this.x;
		difY = newY - this.y;
		this.x = newX;
		this.y = newY;

		var delay = this.VH.setDelay(500);
		var _t = this;
		setTimeout(function(){
			_t.me.animate({transform:'...t' + difX + ' ' + difY},_t.VH.getAnimTime(500));
			for (var i=0; i<_t.branches.length; i++) {
				var cur = _t.branches[i];
				cur = cur[2];
				cur.animate({transform:'...t' + difX + ' ' + difY}, _t.VH.getAnimTime(500));
			}
		},(this.VH.delay - thisVH.date.getTime()));
	};

	Tree.prototype.create = function(newX,newY) {
		console.log("create tree");
		this.x = newX;
		this.y = newY;

		this.buildVisual();

		var delay = this.VH.setDelay(500);
		var anim = Raphael.animation({opacity:1}, this.VH.getAnimTime(500));
		this.myLabel.animate(anim.delay(delay));
	};

	Tree.prototype.buildVisual = function() {

		this.me = this.paper.set();
		this.myLabel = this.paper.text(this.x, this.y + this.HEIGHT + 13, this.type + " " + this.name);
		this.myLabel.attr({
			"opacity":0, 
			"font-family": "times", 
			"font-size":this.FONT_SIZE, 
			"text-anchor": 'start'});
		this.me.push(this.myLabel);
	};

	// sets vertex x to be the root of the tree
	Tree.prototype.SetRoot = function(x) {
		var newTNode = new TreeNode(this,x,null);
		this.tnodes[x] = newTNode;
		this.allNodes.push(newTNode);

		newTNode.buildVisual();
		newTNode.createTNode(this.VH.setDelay(500),this.VH.getAnimTime(500));
		newTNode.lowLight(this.VH.setDelay(500,this.VH.getAnimTime(500)));
	};

	// sets vertex y to be child of vertex x
	// if 3 params, sets vertex y to be the zth child of vertex x,
	// where z is either 0 or 1
	Tree.prototype.AddChild = function(x,y,z) {
		console.log("$$$$$$$$$$$$$$");
		console.log("AddChild ( " + x + " , " + y + " , " + z + " )");
		var childNode = new TreeNode(this,y,x);
		this.allNodes.push(childNode);
		var parentNode = this.tnodes[x];
		console.log(parentNode);

		childNode.parent = x;
		childNode.ParentTNode = parentNode;
		parentNode.ChildTNodes.push(childNode);
		parentNode.children.push(childNode.value);
		childNode.buildVisual();

		if (z) {
			childNode.position = z;
		}

		childNode.inBranch = this.paper.connect(parentNode.DU,childNode.DU,true,false);

		parentNode.highLight(this.VH.setDelay(500),this.VH.getAnimTime(500));
		this.VH.setDelay(250);
		childNode.createInBranch(this.VH.setDelay(500),this.VH.getAnimTime(500));
		this.VH.setDelay(250);
		childNode.createTNode(this.VH.setDelay(500),this.VH.getAnimTime(500));
		this.VH.setDelay(500);

		var delay = this.VH.setDelay(500);
		var time = this.VH.getAnimTime(500);
		parentNode.lowLight(delay,time);
		childNode.lowlightInBranch(delay,time);
		childNode.lowLight(delay,time);

		this.tnodes[y] = childNode;

	};

	// returns the yth child of vertex x in the tree
	Tree.prototype.GetChild = function(x,y) {
		var parentNode = this.tnodes[x];
		var childNode = parentNode.ChildTNodes[y];

		console.log("parent val: " + parentNode.value);
		console.log("child val: " + childNode.value);
		console.log("child position: " + childNode.position);

		parentNode.highLight(this.VH.setDelay(500),this.VH.getAnimTime(500));
		this.VH.setDelay(250);
		childNode.highlightInBranch(this.VH.setDelay(500),this.VH.getAnimTime(500));
		this.VH.setDelay(250);
		childNode.highLight(this.VH.setDelay(500),this.VH.getAnimTime(500));
		this.VH.setDelay(500);

		var delay = this.VH.setDelay(500);
		var time = this.VH.getAnimTime(500);
		parentNode.lowLight(delay,time);
		childNode.lowlightInBranch(delay,time);
		childNode.lowLight(delay,time);
	};

	// returns a List<Integer> of all children of vertex x in the tree
	Tree.prototype.GetChildren = function(x) {
		var parentNode = this.tnodes[x];
		var childNodes = parentNode.ChildTNodes;

		// highlight parent
		parentNode.highLight(this.VH.setDelay(500),this.VH.getAnimTime(500));
		this.VH.setDelay(250);

		var delay1 = this.VH.setDelay(500);
		var time1 = this.VH.getAnimTime(500);

		// highlight edges
		for (var i=0; i<childNodes.length; i++) {
			childNodes[i].highlightInBranch(delay1,time1);
		}

		// highlight children
		var delay2 = this.VH.setDelay(500);
		var time2 = this.VH.getAnimTime(500);

		for (var i=0; i<childNodes.length; i++) {
			childNodes[i].highLight(delay2,time2);
		}

		this.VH.setDelay(500);
		// lowlight all
		var delay3 = this.VH.setDelay(500);
		var time3 = this.VH.getAnimTime(500);

		parentNode.lowLight(delay3,time3);
		for (var i=0; i<childNodes.length; i++) {
			childNodes[i].lowLight(delay3,time3);
			childNodes[i].lowlightInBranch(delay3,time3);
		}
	};

	// returns the parent x of the vertex x in the tree
	Tree.prototype.GetParent = function(x) {
		var childNode = this.tnodes[x];

		childNode.highLight(this.VH.setDelay(500),this.VH.getAnimTime(500));
		this.VH.setDelay(250);

		if (childNode.parent !== null) {
			var parentNode = childNode.ParentTNode;

			childNode.highlightInBranch(this.VH.setDelay(500),this.VH.getAnimTime(500));
			this.VH.setDelay(250);
			parentNode.highLight(this.VH.setDelay(500),this.VH.getAnimTime(500));
			this.VH.setDelay(500);

			var delay = this.VH.setDelay(500);
			var time = this.VH.getAnimTime(500);
			parentNode.lowLight(delay,time);
			childNode.lowlightInBranch(delay,time);
			childNode.lowLight(delay,time);
		}
	};

	// removes a vertex x(and subsequent subtree) from the tree
	Tree.prototype.RemoveVertex = function(x) {
		var rootNode = this.tnodes[x];

		rootNode.highLight(this.VH.setDelay(500),this.VH.getAnimTime(500));
		this.VH.setDelay(500);

		var valNodes = [];
		var removeNodes = [];

		for (var x = 0; x<this.value.length; x++) {
			var curNode = this.value[x];
			valNodes.push(curNode[0]);
		}


		for (var i = 0; i<this.allNodes.length; i++) {
			var currentNode = this.allNodes[i];
			if ((valNodes.indexOf(currentNode.value) === -1) 
				&& (currentNode.value != rootNode.value)){
					removeNodes.push(currentNode);
			}
		}

		var delay1 = this.VH.setDelay(500);
		var time1 = this.VH.getAnimTime(500);
		this.VH.setDelay(500);
		var delay2 = this.VH.setDelay(500);
		var time2 = this.VH.getAnimTime(500);

		for (var j=0; j<removeNodes.length;j++) {
			var cur = removeNodes[j];
			cur.highlightInBranch(delay1,time1);
			cur.highLight(delay1,time1);
			cur.hideInBranch(delay2,time2);
			cur.hide(delay2,time2);
		}

		rootNode.hide(delay2,time2);
	};

	// removes the yth child of vertex x in the tree
	Tree.prototype.RemoveChild = function(x,y) {
		var parentNode = this.tnodes[x];
		var childNode = parentNode.ChildTNodes[y];
		this.RemoveVertex(childNode.value);
	};

	// empties the tree, then creates a random binary tree
	Tree.prototype.Populate = function() {
		console.log("VH populate");

		var rootNode = this.value[0];
		this.SetRoot(rootNode[0]);

		for (var i=1; i<this.value.length;i++) {
			var curNode = this.value[i];
			var child = curNode[0];
			var parent = curNode[1];
			this.AddChild(parent,child);
		}

	};
});