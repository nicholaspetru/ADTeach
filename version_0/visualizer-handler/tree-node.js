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

			this.x = this.tree.x + 
				(this.position * this.tree.WIDTH / Math.pow(this.level,2));
		}

		else {
			this.x = (this.tree.WIDTH / 2);
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
		var anim = Raphael.animation({opacity:1,stroke:"green"},this.VH.getAnimTime(250));
		var delay = this.VH.setDelay(250);

		this.DU.vis[0].animate(anim.delay(delay));
		this.DU.vis[1].animate(anim.delay(delay));
		this.VH.setDelay(1000);
		this.lowLight(this.VH.setDelay(250),this.VH.getAnimTime(250));
	};

	TreeNode.prototype.getChildTNodes = function() {
		return this.ChildTNodes;
	};

	TreeNode.prototype.getParentTNodes = function() {
		return this.ParentTNode;
	};

	TreeNode.prototype.highLight = function(delay,time) {
		var anim = Raphael.animation({stroke: "green"},time);
		this.DU.vis[0].animate(anim.delay(delay));
		this.DU.vis[1].animate(anim.delay(delay));
	};

	TreeNode.prototype.lowLight = function(delay,time) {
		var anim = Raphael.animation({stroke: "#4b4b4b"},time);
		this.DU.vis[0].animate(anim.delay(delay));
		this.DU.vis[1].animate(anim.delay(delay));
	};

	TreeNode.prototype.addChildNode = function(child,z) {
		this.children.push(child.value);
		console.log(this.children);
		child.parent = this.value;
		child.ParentTNode = this;
		child.buildVisual();
		if (typeof z !== "undefined") {
			child.position = z;
		}
		else {
			var tempConnection = this.paper.connect(this.DU,child.DU,true,false);
			child.inBranch = tempConnection;
			child.highlightInBranch(this.VH.setDelay(500),this.VH.getAnimTime(500));
			//this.highlightConnection(tempConnection,this.VH.setDelay(500),this.VH.getAnimTime(500));
			this.VH.setDelay(1000);

			child.create();
			this.lowlightConnection(tempConnection,this.VH.setDelay(250),this.VH.getAnimTime(250));


			this.children.push(child.value);
			this.ChildTNodes.push(child);
			this.branches_out.push(tempConnection);
			child.branches_in.push(tempConnection);

		}

	};

	TreeNode.prototype.highlightInBranch = function(delay,time) {
		var anim = Raphael.animation({stroke:"green"},time);
		if (this.inBranch.attr("opacity") == 0) {
			anim = Raphael.animation({opacity:1,stroke:"green"},time);
		}
		this.inBranch.animate(anim.delay(delay));
	};

	TreeNode.prototype.highlightConnection = function(connection,delay,time) {
		var anim = Raphael.animation({opacity:1,stroke:"green"},time);
		connection.animate(anim.delay(delay));
	}

	TreeNode.prototype.lowlightConnection = function(connection,delay,time) {
		var anim = Raphael.animation({stroke:"#4b4b4b"},time);
		connection.animate(anim.delay(delay));
	}

});