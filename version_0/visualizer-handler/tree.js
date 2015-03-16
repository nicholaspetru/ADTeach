/**
 * tree.js
 * Represents a tree
 * ------------------
 */
$(document).ready(function() {
	Tree = function(paper, name, value, vishandler) {
		this.name = name;
		this.type = "Tree";
		this.value = value;
		this.anon = [];
		this.drawn = false;

		/* visual components */
		this.paper = paper;
		this.VH = vishandler;

		// style
		this.FONT_SIZE = 15;
		this.DUNIT_BACKGROUND_COLOR = "#B6C5BE";
		this.DUNIT_WIDTH = 25.5;
		this.DUNIT_OFFSETY = 20;
		this.WIDTH = 150;
		this.HEIGHT = 45;

		// initial position
		this.x = 0;
		this.y = 0;

		this.tnodes = {}; // track TreeNodes

		this.myLabel = null;
		this.me = null; // set containing the circle and text elements of each treeNode's dataunit and each treeNode's inBranches

		this.allNodes = [];
	}

	/*-----------------------------------------
	         VH & UTILITY/HELPER FUNCTIONS
	  -----------------------------------------*/
	Tree.prototype.create = function(newX, newY) {
		console.log("create tree");
		this.x = newX;
		this.y = newY;

		this.buildVisual();

		var delay = this.VH.setDelay(500);
		var anim = Raphael.animation({
			opacity: 1
		}, this.VH.getAnimTime(500));
		this.myLabel.animate(anim.delay(delay));
	};

	Tree.prototype.buildVisual = function() {

		this.me = this.paper.set();
		this.myLabel = this.paper.text(this.x, this.y + this.HEIGHT + 13, this.type + " " + this.name);
		this.myLabel.attr({
			"opacity": 0,
			"font-family": "times",
			"font-size": this.FONT_SIZE,
			"text-anchor": 'start'
		});
		this.me.push(this.myLabel);
	};

	Tree.prototype.move = function(newX, newY) {
		var difX, difY;
		difX = newX - this.x;
		difY = newY - this.y;
		this.x = newX;
		this.y = newY;

		var delay = this.VH.setDelay(500);
		var time = this.VH.getAnimTime(500);
		var _t = this;
		setTimeout(function() {
			_t.me.animate({
				transform: '...t' + difX + ' ' + difY
			}, time);
		}, (this.VH.delay - this.VH.date.getTime()));
	};

	Tree.prototype.erase = function(delay) {
		var _t = this;
		setTimeout(function() {
			_t.me.remove();
		}, (this.VH.delay - this.VH.date.getTime()));
	}

	Tree.prototype.dragNode = function(n) {
		// pairing based on: http://stackoverflow.com/questions/3679436/how-can-i-combine-objects-in-the-raphael-javascript-library
        var dragger = function() {
                // Original coords for main element
                this.ox = this.type == "circle" ? this.attr("cx") : this.attr("x");
                this.oy = this.type == "circle" ? this.attr("cy") : this.attr("y");

                // Original coords for pair element
                this.pair.ox = this.pair.type == "circle" ? this.pair.attr("cx") : this.pair.attr("x");
                this.pair.oy = this.pair.type == "circle" ? this.pair.attr("cy") : this.pair.attr("y");
            },
            move = function(dx, dy) {
                // Move main element
                var att = this.type == "circle" ? {
                    cx: this.ox + dx,
                    cy: this.oy + dy
                } : {
                    x: this.ox + dx,
                    y: this.oy + dy
                };
                this.attr(att);

                // Move paired element
                att = this.pair.type == "circle" ? {
                    cx: this.pair.ox + dx,
                    cy: this.pair.oy + dy
                } : {
                    x: this.pair.ox + dx,
                    y: this.pair.oy + dy
                };
                this.pair.attr(att);

                // Move connections
                var temp, x1, y1, x2, y2;
                if (this.type == "circle") {
                    temp = this;
                } else {
                    temp = this.pair;
                }

                // move all of the circle's connections
                if (temp.connections) {
                    for (var i = 0; i < temp.connections.length; i++) {
                        var tempPath = temp.connections[i];
                        var x1, y1, x2, y2;

                        // connection is FROM temp
                        if (tempPath.from.data("nodeID") == temp.data("nodeID")) {
                            x1 = this.ox + dx;
                            y1 = this.oy + dy;
                            x2 = tempPath.to.attr("cx");
                            y2 = tempPath.to.attr("cy");
                        }

                        // connection is TO temp
                        else {
                            x1 = tempPath.from.attr("cx");
                            y1 = tempPath.from.attr("cy")
                            x2 = this.ox + dx;
                            y2 = this.oy + dy;
                        }

                        // create a new path from (x1,y1) to (x2,y2)
                        tempPath.attr({
                            path: "M " + x1 + "," + y1 + "L " + x2 + "," + y2
                        });

                        // move its arrowhead
                        if (tempPath.isDirected) {
                            var totalLen = tempPath.getTotalLength(); // total length of the path
                            var intLen = totalLen - tempPath.to.attr("r"); // subtract the length of toNode's radius
                            var hp = tempPath.getPointAtLength(intLen);
                            var arrowString = this.paper.arrowheadString(x1, y1, (hp.x), (hp.y), 7);
                            tempPath.head.attr({
                                path: arrowString
                            });
                        }
                        tempPath.toBack();
                    }
                }
            },
            up = function() {};

        var tempS = n.vis[1]; // the circle
        var tempT = n.vis[0]; // the node id

        // remove old dragger if it exists
        tempS.undrag();
        tempT.undrag();

        // cursor on hover
        tempS.attr({
            cursor: "move"
        });
        tempT.attr({
            cursor: "move"
        });

        // add drag handler
        tempS.drag(move, dragger, up);
        tempT.drag(move, dragger, up);

        // associate the circle/id so that dragging one moves the other with it
        tempS.pair = tempT;
        tempT.pair = tempS;
	};

    /*---------------------------------------
                    ADT METHODS
    -----------------------------------------*/
	Tree.prototype.update = function(action, originADT) {
		console.log("Tree update");
		console.log(action);
		// get method and params
		var split = action.split(",");
		// animate the change
		switch (split[0]) {
			case "populate":
				this.Populate();
				break;
			case "setRoot":
				this.SetRoot(parseInt(split[1]));
				break;
			case "addChild":
				if (split.length > 3) {
					this.AddChild(parseInt(split[1]), parseInt(split[2]), parseInt(split[3]));
				} else {
					this.AddChild(parseInt(split[1]), parseInt(split[2]));
				}
				break;
			case "getChild":
				this.GetChild(parseInt(split[1]), parseInt(split[2]));
				break;
			case "getChildren":
				this.GetChildren(parseInt(split[1]));
				break;
			case "getParent":
				this.GetParent(parseInt(split[1]));
				break;
			case "removeChild":
				this.RemoveChild(parseInt(split[1]), parseInt(split[2]));
				break;
			case "removeVertex":
				this.RemoveVertex(parseInt(split[1]));
				break;
			default:
				console.log("Unknown action for Trees: " + action);
				break;
		}
	};

	// empties the tree, then creates a random binary tree
	Tree.prototype.Populate = function() {
		console.log("VH populate");

		var rootNode = this.value[0];
		this.SetRoot(rootNode[0]);

		for (var i = 1; i < this.value.length; i++) {
			var curNode = this.value[i];
			var child = curNode[0];
			var parent = curNode[1];
			this.AddChild(parent, child);
		}

	};
	// sets vertex x to be the root of the tree
	Tree.prototype.SetRoot = function(x) {
		var newTNode = new TreeNode(this, x, null);
		this.tnodes[x] = newTNode;
		this.allNodes.push(newTNode);

		newTNode.buildVisual();
		newTNode.createTNode(this.VH.setDelay(500), this.VH.getAnimTime(500));
		newTNode.lowLight(this.VH.setDelay(500, this.VH.getAnimTime(500)));

		this.dragNode((newTNode.DU));
		this.me.push(newTNode.DU.vis[0]);
		this.me.push(newTNode.DU.vis[1]);
	};

	// sets vertex y to be child of vertex x
	// if 3 params, sets vertex y to be the zth child of vertex x,
	// where z is either 0 or 1
	Tree.prototype.AddChild = function(x, y, z) {
		console.log("$$$$$$$$$$$$$$");
		console.log("AddChild ( " + x + " , " + y + " , " + z + " )");
		var childNode = new TreeNode(this, y, x);
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

		childNode.inBranch = this.paper.connect(parentNode.DU, childNode.DU, true, false);
		this.me.push(childNode.inBranch);
		this.me.push(childNode.inBranch.head);
		parentNode.highLight(this.VH.setDelay(500), this.VH.getAnimTime(500));
		this.VH.setDelay(250);
		var delay1 = this.VH.setDelay(250);
		var time1 = this.VH.getAnimTime(250);
		childNode.createInBranch(delay1, time1);
		childNode.createTNode(delay1, time1);
		this.VH.setDelay(500);

		var delay = this.VH.setDelay(500);
		var time = this.VH.getAnimTime(500);
		parentNode.lowLight(delay, time);
		childNode.lowlightInBranch(delay, time);
		childNode.lowLight(delay, time);

		this.tnodes[y] = childNode;
		this.dragNode((childNode.DU));
		this.me.push(childNode.DU.vis[0]);
		this.me.push(childNode.DU.vis[1]);

	};

	// highlight parent node, highlight child node, unhighlight all
	Tree.prototype.GetChild = function(x, y) {
		var parentNode = this.tnodes[x];
		var childNode = parentNode.ChildTNodes[y];

		var delay1 = this.VH.setDelay(250);
		var time1 = this.VH.getAnimTime(250);

		this.VH.setDelay(500);

		var delay2 = this.VH.setDelay(250);
		var time2 = this.VH.getAnimTime(250);

		this.VH.setDelay(500);

		var delay3 = this.VH.setDelay(250);
		var time3 = this.VH.getAnimTime(250);

		console.log("parent val: " + parentNode.value);
		console.log("child val: " + childNode.value);
		console.log("child position: " + childNode.position);

		parentNode.highLight(delay1,time1);
		childNode.highlightInBranch(delay2,time2);
		childNode.highLight(delay2,time2);

		parentNode.lowLight(delay3, time3);
		childNode.lowlightInBranch(delay3, time3);
		childNode.lowLight(delay3, time3);
	};

	// highlight parent, highlight inbranches/children
	Tree.prototype.GetChildren = function(x) {
		var parentNode = this.tnodes[x];
		var childNodes = parentNode.ChildTNodes;


		var delay1 = this.VH.setDelay(250);
		var time1 = this.VH.getAnimTime(250);

		this.VH.setDelay(500);

		var delay2 = this.VH.setDelay(250);
		var time2 = this.VH.getAnimTime(250);

		this.VH.setDelay(500);

		var delay3 = this.VH.setDelay(250);
		var time3 = this.VH.getAnimTime(250);

		// highlight parent
		parentNode.highLight(delay1,time1);
		// highlight edges
		for (var i = 0; i < childNodes.length; i++) {
			childNodes[i].highlightInBranch(delay2, time2);
		}

		for (var i = 0; i < childNodes.length; i++) {
			childNodes[i].highLight(delay2, time2);
		}

		parentNode.lowLight(delay3, time3);
		for (var i = 0; i < childNodes.length; i++) {
			childNodes[i].lowLight(delay3, time3);
			childNodes[i].lowlightInBranch(delay3, time3);
		}
	};

	// highlight child, highlight inbranch, highlight parent
	Tree.prototype.GetParent = function(x) {
		var childNode = this.tnodes[x];
		var delay1 = this.VH.setDelay(250);
		var time1 = this.VH.getAnimTime(250);

		this.VH.setDelay(500);

		var delay2 = this.VH.setDelay(250);
		var time2 = this.VH.getAnimTime(250);

		this.VH.setDelay(500);

		var delay3 = this.VH.setDelay(250);
		var time3 = this.VH.getAnimTime(250);

		this.VH.setDelay(500);

		var delay4 = this.VH.setDelay(250);
		var time4 = this.VH.getAnimTime(250);

		childNode.highLight(delay1,time1);

		if (childNode.parent !== null) {
			var parentNode = childNode.ParentTNode;

			childNode.highlightInBranch(delay2,time2);
			parentNode.highLight(delay3,time3);

			parentNode.lowLight(delay4, time4);
			childNode.lowlightInBranch(delay4, time4);
		}
		childNode.lowLight(delay4, time4);
	};

	Tree.prototype
	// highlight vertex in red, highlight subtree in red if applicable, 
	// then fade out all
	Tree.prototype.RemoveVertex = function(x) {
		// highlight vertex
        var delay1 = this.VH.setDelay(250);
        var time1 = this.VH.getAnimTime(250);

        this.VH.setDelay(250);

        // highlight subtree
        var delay2 = this.VH.setDelay(250);
        var time2 = this.VH.getAnimTime(250);

        this.VH.setDelay(250);

        // fade out
        var delay3 = this.VH.setDelay(250);
        var time3 = this.VH.getAnimTime(250);

        this.VH.setDelay(250);

        // remove?
        var delay4 = this.VH.setDelay(100);

		var rootNode = this.tnodes[x];

		var valNodes = [];
		var removeNodes = [];

		for (var x = 0; x < this.value.length; x++) {
			var curNode = this.value[x];
			valNodes.push(curNode[0]);
		}

		for (var i = 0; i < this.allNodes.length; i++) {
			var currentNode = this.allNodes[i];
			if ((valNodes.indexOf(currentNode.value) === -1) && (currentNode.value != rootNode.value)) {
				removeNodes.push(currentNode);
			}
		}

		rootNode.highLight(delay1,time1,"red");
		for (var j = 0; j < removeNodes.length; j++) {
			var curVal = removeNodes[j];
			var cur = this.tnodes[curVal];
			cur.highlightInBranch(delay2, time2, "red");
			cur.highLight(delay2, time2, "red");
			cur.hideInBranch(delay3, time3);
			cur.hide(delay3, time3);
		}
		rootNode.hide(delay3, time3);
	};

	// removes the yth child of vertex x in the tree
	Tree.prototype.RemoveChild = function(x, y) {
		var parentNode = this.tnodes[x];
		var childNode = parentNode.ChildTNodes[y];
		this.RemoveVertex(childNode.value);
	};
});