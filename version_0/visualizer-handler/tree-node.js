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
		this.node = null;
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

		return this;
	}

	TreeNode.prototype.buildVisual = function() {
		if (this.parent !== null) {
			this.level = this.parent.level + 1;
			this.position = this.parent.children.indexOf(this.value);
		}

		this.y = this.tree.y + 
			(this.level * (this.tree.DUNIT_WIDTH + this.tree.DUNIT_OFFSETY));

		this.x = this.tree.x + 
			(this.tree.WIDTH / Math.pow(this.level,2));

		var newNode = new DataUnit(this.paper,'Tree',this.value,this.VH,this.x,this.y,this.DUNIT_WIDTH,this.DUNIT_WIDTH,1);
		newNode.vis[1].attr(this.DU_ATTR);
		newNode.vis[0].toFront();
		newNode.id = this.value;
		newNode.vis[1].data("nodeID",nodeID);

		this.node = newNode;
	};

	TreeNode.prototype.create = function() {
		this.buildVisual();
		this.node.create();
	};

	TreeNode.prototype.getChildTNodes = function() {
		return this.ChildTNodes;
	};

	TreeNode.prototype.getParentTNodes = function() {
		return this.ParentTNode;
	};

	TreeNode.prototype.addChildNode = function(child,z) {
		if (z) {
			//add at index z
		}
		else {
			this.children.push(child.value);
			this.ChildTNodes.push(child);
			var tempConnection = this.paper.connect2(this.node,child.node);
			this.branches_out.push(tempConnection);
			child.branches_in.push(tempConnection);
		}

	};

});