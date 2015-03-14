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
		this.DUNIT_BACKGROUND_COLOR = "#B6C5BE";
		this.WIDTH = 45;
		this.HEIGHT = 45;

		this.tnodes = {};
		this.branches = [];
		this.myLabel = null;
		this.me = null;

		this.numNodes = 0;
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

	Tree.prototype.createTreeNode = function(value,parent,z) {
		var newTNode = new TreeNode(this,value,parent);
		if (typeof z !== "undefined") {
			newTNode.position = z;
		}

		newTNode.create();

		this.me.push(newTNode.DU.vis[0]);
		this.me.push(newTNode.DU.vis[1]);

		this.tnodes[value] = newTNode;

		if (parent !== null) {
			var parentTNode = this.tnodes[parent];
			if (typeof z === "undefined") {
				parentTNode.addChildNode(newTNode);
			}
			else {
				parentTNode.addChildNode(newTNode,z);
			}
		}
	};
	// sets vertex x to be the root of the tree
	Tree.prototype.SetRoot = function(x) {
		this.createTreeNode(x,null);
	};

	// sets vertex y to be child of vertex x
	// if 3 params, sets vertex y to be the zth child of vertex x,
	// where z is either 0 or 1
	Tree.prototype.AddChild = function(x,y,z) {
		var newTNode = new TreeNode(this,y,x);
		if (z) {
			newTNode.position = z;
		}
		var parentNode = this.tnodes[x];
		parentNode.addChildNode(newTNode);
		this.tnodes[y] = newTNode;

	};

	// returns the yth child of vertex x in the tree
	Tree.prototype.GetChild = function(x,y) {

	};

	// returns a List<Integer> of all children of vertex x in the tree
	Tree.prototype.GetChildren = function(x) {

	};

	// removes a vertex x(and subsequent subtree) from the tree
	Tree.prototype.RemoveVertex = function(x) {

	};

	// removes the yth child of vertex x in the tree
	Tree.prototype.RemoveChild = function(x,y) {

	};

	// empties the tree, then creates a random binary tree
	Tree.prototype.Populate = function() {

	};
});