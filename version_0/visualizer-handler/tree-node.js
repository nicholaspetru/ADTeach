$(document).ready(function () {


	TreeNode = function(tree,value,parent) {
		// value
		this.value = value;
		this.parent = parent;
		this.children = [];
		this.level = 0;
		this.position = -1;

		// visuals
		this.paper = tree.paper;
		this.VH = tree.VH;
		this.tree = tree;

		this.x = 0;
		this.y = 0;
		this.DU = null;
		this.ParentTNode = null;
		this.ChildTNodes = [];

		this.DUNIT_WIDTH = tree.DUNIT_WIDTH;
		this.DUNIT_BACKGROUND_COLOR = tree.DUNIT_BACKGROUND_COLOR;
		this.FONT_SIZE = tree.FONT_SIZE;
		this.DU_ATTR = {
			'stroke-width': 2,
			'fill': tree.DUNIT_BACKGROUND_COLOR,
			'fill-opacity': 1
		};
		this.branches_in = [];
		this.branches_out = [];
		this.inBranch = null;

		return this;
	}

	TreeNode.prototype.buildVisual = function() {
		console.log("buildVisual for treenode " + this.value);

		if (this.parent !== null) {
			console.log("parent: " + this.parent.value);
			console.log("parents children: " + this.parent.children);
			this.level = this.ParentTNode.level + 1;
			this.position = this.ParentTNode.children.indexOf(this.value);
			this.y = this.tree.y + 
				(this.level * (this.tree.DUNIT_WIDTH + this.tree.DUNIT_OFFSETY));

			console.log("x: " + this.x);
			console.log("LEVEL: "+ this.level);
			// left child
			if (this.position == 0) {
				//this.x = this.ParentTNode.x  -  this.tree.WIDTH / 2*this.level;
				this.x = this.ParentTNode.x - this.tree.WIDTH / Math.pow(2,this.level);
			}
			// right child
			else {
				this.x = this.ParentTNode.x  + this.tree.WIDTH / Math.pow(2,this.level);;
			}

			/*
			// right parent
			if (this.ParentTNode.position == 1) {
				//left child
				if (this.position == 0) {
					this.x = this.ParentTNode.x  - tree.WIDTH / 2*this.level;
				}
				//right child
				else {
					this.x = this.ParentTNode.x  + tree.WIDTH / 2*this.level;
				}
			}
			// left parent
			else {
				// left child
				if (this.position == 0) {
					this.x = this.ParentTNode.x - 40;
				}
				// right child
				else {
					this.x = this.ParentTNode.x + 20;
				}
			}

			console.log("x: " + this.x);
			*/

		}

		else {
			this.x = this.tree.x + (this.tree.WIDTH / 2);
			this.y = this.tree.y;
		}
		console.log(this.value + " at (" + this.x + "," + this.y + ")");
		console.log(this.DUNIT_WIDTH);
		console.log(this.DU_ATTR);

		var newNode = new DataUnit(this.paper,'Tree',this.value,this.VH,this.x,this.y,this.DUNIT_WIDTH,this.DUNIT_WIDTH,1);
		newNode.buildVisual();
		console.log(newNode);
		newNode.vis[1].attr(this.DU_ATTR);
		newNode.vis[0].toFront();
		newNode.id = this.value;
		newNode.vis[1].data("nodeID",this.value);

		this.DU = newNode;
	};

	TreeNode.prototype.create = function() {
		if (this.parent === null) {
			this.buildVisual();
		}
	};

	TreeNode.prototype.getChildTNodes = function() {
		return this.ChildTNodes;
	};

	TreeNode.prototype.getParentTNodes = function() {
		return this.ParentTNode;
	};

	TreeNode.prototype.createTNode = function(delay,time) {
		console.log("createTNode " + this.value + " delay: " + delay + " time: " + time);
		var anim = Raphael.animation({stroke: "green",opacity:1},time);
		this.DU.vis[0].animate(anim.delay(delay));
		this.DU.vis[1].animate(anim.delay(delay));
	}
	TreeNode.prototype.highLight = function(delay,time) {
		console.log("highLight " + this.value + " delay: " + delay + " time: " + time);
		var anim = Raphael.animation({stroke: "green"},time);

		this.DU.vis[0].animate(anim.delay(delay));
		this.DU.vis[1].animate(anim.delay(delay));
	};

	TreeNode.prototype.lowLight = function(delay,time) {
		console.log("lowLight " + this.value + " delay: " + delay + " time: " + time);
		var anim = Raphael.animation({stroke: "#4b4b4b"},time);
		this.DU.vis[0].animate(anim.delay(delay));
		this.DU.vis[1].animate(anim.delay(delay));
	};


	TreeNode.prototype.createInBranch = function(delay,time) {
		console.log("createInBranch " + this.value + " delay: " + delay + " time: " + time);
		var anim = Raphael.animation({opacity:1,stroke:"green"},time);
		this.inBranch.animate(anim.delay(delay));
	}
	TreeNode.prototype.highlightInBranch = function(delay,time) {
		console.log("highlightInBranch " + this.value + " delay: " + delay + " time: " + time);
		var anim = Raphael.animation({stroke:"green"},time);
		this.inBranch.animate(anim.delay(delay));
	};
	TreeNode.prototype.lowlightInBranch = function(delay,time) {
		console.log("lowlightInBranch " + this.value + " delay: " + delay + " time: " + time);
		var anim = Raphael.animation({stroke:"#4b4b4b"},time);
		this.inBranch.animate(anim.delay(delay));
	};

	TreeNode.prototype.hide = function(delay,time) {
		console.log("delete treenode");
		var anim = Raphael.animation({opacity:0},time);
		this.DU.vis[0].animate(anim.delay(delay));
		this.DU.vis[1].animate(anim.delay(delay));

	}

	TreeNode.prototype.hideInBranch = function(delay,time) {
		console.log("hidebranch");
		var anim = Raphael.animation({opacity:0},time);
		this.inBranch.animate(anim.delay(delay));
	}

/*
	TreeNode.prototype.addChildNode = function(child,z) {
		console.log("addChildNode " + child.value + " to parent " + this.value);
		this.children.push(child.value);
		this.ChildTNodes.push(child);
		console.log(this.children);
		console.log("child.parent val " + child.parent.value);
		if (typeof z !== "undefined") {
			child.position = z;
		}
		else {
			child.position = this.children.length - 1;
			child.inBranch = this.paper.connect(this.DU,child.DU,true,false);
		}
	};
*/

});