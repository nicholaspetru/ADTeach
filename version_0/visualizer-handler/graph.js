/**
* graph.js
* Represents an unweighted graph
*/
$(document).ready(function() {
    Graph = function(paper, name, type, value, vishandler) {
        this.name = name;
        this.type = type;
        this.value = value;
        this.anon = [];
        this.drawn = false;

        /* visual components */
        this.paper = paper;
        this.VH = vishandler;

        // style
        this.FONT_SIZE = 15;
        this.DUNIT_WIDTH = 25.5;
        this.backgroundColor = "#B6C5BE";
        this.HEIGHT = 45;

        // initial position
        this.x = 0;
        this.y = 0;

        this.nodes = []; // track node dataunits
        this.wedges = []; // wedge format: [fromNodeID,toNodeID,connection]

        this.edgeCheck = {}; // check whether an edge has been drawn
        this.isDirected = false;

        this.myLabel = null;
        this.me = null; // set containing circle and text elements of each dataunit

        // for node layout
        this.nextNodeX = 0;
        this.nextNodeY = 0;
        this.count = 0;
    }
 
    /*-----------------------------------------
             VH & UTILITY/HELPER FUNCTIONS
      -----------------------------------------*/

    // build and create the visual component
    Graph.prototype.create = function(newX, newY) {
        console.log("create graph at (" + newX + "," + newY + ")");
        this.x = newX;
        this.y = newY;

        this.buildVisual();

        //get the delay for outside the loop
        var delay = this.VH.setDelay(500);

        //Fade in the label
        var anim = Raphael.animation({
            opacity: 1
        }, this.VH.getAnimTime(500));
        this.myLabel.animate(anim.delay(delay));
    };

    Graph.prototype.buildVisual = function() {
        // create the set
        this.me = this.paper.set();
        // build the label
        this.myLabel = this.paper.text(this.x, this.y + 45 + 13, this.type + " " + this.name);
        this.myLabel.attr({
            "opacity": 0,
            "font-family": "times",
            "font-size": this.FONT_SIZE,
            'text-anchor': 'start'
        });
    };

    // move the ADT to (newX,newY)
    Graph.prototype.move = function(newX, newY) {
        console.log("move graph");
        var difX, difY;
        difX = newX - this.x;
        difY = newY - this.y;
        this.x = newX;
        this.y = newY;

        var delay = this.VH.setDelay(500);
        //Set timeout and move the data structure at the proper delay
        var _t = this;
        setTimeout(function() {
            _t.myLabel.animate({
                transform: '...t' + difX + ' ' + difY
            }, _t.VH.getAnimTime(500));
            _t.me.animate({
                transform: '...t' + difX + ' ' + difY
            }, _t.VH.getAnimTime(500));
            for (var i = 0; i < _t.wedges.length; i++) {
                var cur = _t.wedges[i];
                cur = cur[2];
                if (typeof(cur) !== "undefined") {
                    cur.animate({
                        transform: '...t' + difX + ' ' + difY
                    }, _t.VH.getAnimTime(500));
                    if (_t.isDirected) {
                        cur.head.animate({
                            transform: '...t' + difX + ' ' + difY
                        }, _t.VH.getAnimTime(500));
                    }
                }
            }
        }, (this.VH.delay - this.VH.date.getTime()));
    };

    // not-unintelligent placement of nodes
    Graph.prototype.getNextPos = function() {
        if (this.count == 0) {
            this.nextNodeX = this.x;
            this.nextNodeY = this.y + 20;
        }
        if (this.count % 2 == 0) {
            this.nextNodeY = this.y + 20;
            this.nextNodeX += this.DUNIT_WIDTH * 2;

        } else {
            this.nextNodeY = this.y + 20 + this.DUNIT_WIDTH * 2;
            this.nextNodeX += this.DUNIT_WIDTH * 2;

        }
        this.count += 1;
    };

    // create and display the node
    Graph.prototype.createNode = function(delay, time) {
        this.getNextPos();
        var nodeID = this.nodes.length;

        // create the node dataunit
        var newNode = new DataUnit(this.paper, 'Graph', nodeID.toString(), this.VH, this.nextNodeX, this.nextNodeY, this.DUNIT_WIDTH, this.DUNIT_WIDTH, 1);
        newNode.buildVisual();

        // fade it in
        var anim = Raphael.animation({
            opacity: 1
        }, time);

        for (var i = 0; i < newNode.vis.length; i++) {
            newNode.vis[i].animate(anim.delay(delay));
        }
        // styling
        newNode.vis[1].attr({
            'stroke-width': 2,
            'fill': this.backgroundColor,
            'fill-opacity': 1
        });
        newNode.vis[0].toFront();

        // track node ID
        newNode.vis[1].data("nodeID", nodeID);
        newNode.id = nodeID;

        // add to set
        this.me.push(newNode.vis[0]);
        this.me.push(newNode.vis[1]);

        this.nodes.push(newNode); // add to list of nodes
        this.edgeCheck[nodeID] = []; // add node id to edge tracker
        this.dragNode(newNode); // make the node draggable
    };

    // add a drag event handler to the given node
    Graph.prototype.dragNode = function(n) {
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

                        // if tempPath is directed, move its arrowhead
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

    // highlight the given node with the given color after the given delay
    Graph.prototype.highlightNode = function(node, delay, time, color) {
        var anim = Raphael.animation({
            stroke: color
        }, time);
        for (var i = 0; i < node.vis.length; i++) {
            node.vis[i].animate(anim.delay(delay));
        }
    };

    // create an edge from fromNode to toNode, then fade it in
    Graph.prototype.createEdge = function(fromNode, toNode, delay, time, color) {
        console.log("createEdge(" + fromNode.id + "," + toNode.id + ")");
        // build the animation
        var anim = Raphael.animation({
            opacity: 1,
            "stroke": color || "#4b4b4b"
        }, time);

        // create the connection
        var newEdge = this.paper.connect(fromNode, toNode, this.isDirected, false);

        // reset drag event handlers for each node so that the new edge follows them
        this.dragNode(fromNode);
        this.dragNode(toNode);

        // fade it in
        newEdge.animate(anim.delay(delay));
        if (this.isDirected) {
            var anim2 = Raphael.animation({
                opacity: 1,
                "stroke": color || "#4b4b4b",
                "fill": color || "#4b4b4b"
            });
            newEdge.head.animate(anim2.delay(delay));
        }

        // update edgecheck
        this.edgeCheck[(fromNode.id)].push((toNode.id));

        // create and track wedge
        var wedge = [];
        wedge.push(fromNode.id, toNode.id, newEdge);
        this.wedges.push(wedge);
    };

    // check if an edge from (fromNodeID,toNodeID) is already represented on the screen
    Graph.prototype.hasDrawnEdge = function(fromNodeID, toNodeID) {
        //console.log("hasDrawnEdge( " + fromNodeID + " , " + toNodeID + " )");
        var check1 = this.edgeCheck[fromNodeID];

        // directed:
        if (this.isDirected) {
            // return true if an edge from fromNodeID to toNodeID is represented, false otherwise
            return check1.indexOf(toNodeID) !== -1;
        }

        // undirected:
        var check2 = this.edgeCheck[toNodeID];

        // return true if an edge from fromNodeID to toNodeID is represented,
        // or if an edge from toNodeID to fromNodeID is represented
        return (check1.indexOf(toNodeID) !== -1) || (check2.indexOf(fromNodeID) !== -1)
    };

    // highlight the edge from fromNodeID to toNodeID
    Graph.prototype.highlightEdge = function(fromNodeID, toNodeID, delay, time, color) {
        //console.log('highlightEdge( + fromNodeID + "," + toNodeID + ")"));
        var edge = this.getEdge(fromNodeID, toNodeID);
        if (edge !== false) {
            var anim = Raphael.animation({
                stroke: color
            }, time);

            edge.animate(anim.delay(delay));
            if (this.isDirected) {
                edge.head.animate(anim.delay(delay));
            }
        }
    };

    // returns the drawn edge from fromNodeID to toNodeID
    Graph.prototype.getEdge = function(fromNodeID, toNodeID) {
        for (var i = 0; i < this.wedges.length; i++) {
            var wedge = this.wedges[i];
            var f = wedge[0],
                t = wedge[1];
            if (f == fromNodeID && t == toNodeID) {
                return wedge[2];
            }
            if (!this.isDirected) {
                if (f == toNodeID && t == fromNodeID) {
                    return wedge[2];
                }
            }
        }
        return false;
    };

    // returns the wedge ([fromNodeID,toNodeID,drawn edge]) from (fromNodeID,toNodeID)
    Graph.prototype.getWedge = function(fromNodeID, toNodeID) {
        for (var i = 0; i < this.wedges.length; i++) {
            var wedge = this.wedges[i];
            var f = wedge[0],
                t = wedge[1];
            if (f == fromNodeID && t == toNodeID) {
                return wedge;
            }
            if (!this.isDirected) {
                if (f == toNodeID && t == fromNodeID) {
                    return wedge;
                }
            }
        }
        return false;
    };

    // erase all values in the graph after the given delay
    Graph.prototype.eraseValues = function(delay) {
        var _t = this;
        setTimeout(function() {
            if (_t.me !== null) {
                _t.me.remove();
            }

            for (var j = 0; j < _t.wedges.length; j++) {
                var currentWedge = _t.wedges[j];
                currentWedge = currentWedge[2];
                if (typeof(currentWedge) !== "undefined") {
                    if (_t.isDirected) {
                        currentWedge.head.remove();
                    }
                    currentWedge.remove();
                }
            }

            _t.me = _t.paper.set();
            _t.wedges = [];
            _t.nodes = [];
            _t.edgeCheck = {};
            _t.nextNodeY = 0;
            _t.nextNodeX = 0;
            _t.count = 0;
        }, delay);
    };

    // remove all graph values now
    Graph.prototype.erase = function() {
        if (this.me !== null) {
            this.me.remove();
        }

        for (var j = 0; j < this.wedges.length; j++) {
            var currentWedge = this.wedges[j];
            currentWedge = currentWedge[2];
            if (this.isDirected) {
                currentWedge.head.remove();
            }
            currentWedge.remove();
        }

        this.me = this.paper.set();
        this.wedges = [];
        this.nodes = [];
        this.edgeCheck = {};
        this.nextNodeY = 0;
        this.nextNodeX = 0;
        this.count = 0;

        console.log("Graph erase()");
        console.log("this.wedges: " + this.wedges);
        console.log("this.nodes: " + this.nodes);
        console.log("this.me: " + this.me);

    };

    /*---------------------------------------
                    ADT METHODS
    -----------------------------------------*/

    // update the given action
    Graph.prototype.update = function(action, originADT) {
        //strip the string and get the params from the "Action" str
        var split = action.split(",");
        //animate the change
        switch (split[0]) {
            case "setDirected":
                this.SetDirected();
                break;
            case "populate":
                this.Populate();
                break;
            case "addEdge":
                this.AddEdge(parseInt(split[1]), parseInt(split[2]));
                break;
            case "hasEdge":
                this.HasEdge(parseInt(split[1]), parseInt(split[2]));
                break;
            case "removeEdge":
                this.RemoveEdge(parseInt(split[1]), parseInt(split[2]));
                break;
            case "addVertex":
                this.AddVertex();
                break;
            case "getDegree":
                this.GetDegree(parseInt(split[1]));
                break;
            case "getInDegree":
                this.GetInDegree(parseInt(split[1]));
                break;
            case "getNeighbors":
                this.GetNeighbors(parseInt(split[1]));
                break;
            case "clear":
                this.Clear();
                break;
            default:
                console.log("Unknown action for Graphs: " + action);
                this.VH.setDelay(250);

        }
    };

    // if the directed boolean changed, erase the currently displayed edges and redraw
    Graph.prototype.SetDirected = function() {
        console.log("setDirected(" + this.value[1] + ")");
        if (this.value[1] !== this.isDirected) {
            this.VH.setDelay(500);
            this.isDirected = this.value[1];
            var delay = this.VH.setDelay(250);
            var time = this.VH.getAnimTime(250);
            var tempOp = 0;

            if (this.isDirected) {
                tempOp = 1;
            }

            var anim = Raphael.animation({
                opacity: tempOp
            }, time);
            for (var i = 0; i < this.wedges.length; i++) {
                var currentWedge = this.wedges[i];
                currentWedge = currentWedge[2];
                currentWedge.head.animate(anim.delay(delay));
            }

            if (this.isDirected) {
                var graphVal = this.value[0];
                for (var fromNodeID = 0; fromNodeID < graphVal.length; fromNodeID++) {
                    var toNodes = graphVal[fromNodeID];
                    for (var x = 0; x < toNodes.length; x++) {
                        var toNodeID = toNodes[x];
                        if (!this.hasDrawnEdge(fromNodeID, toNodeID)) {
                            var f = this.nodes[fromNodeID];
                            var t = this.nodes[toNodeID];
                            this.createEdge(f, t, delay, time);
                        }
                    }
                }
            }
        }
    };

    // empties the graph then builds and creates the new value visually
    Graph.prototype.Populate = function() {
        console.log("VH populate");
        console.log("value: " + this.value);
        var graphVal = this.value[0];
        this.erase();

        // create the nodes
        var edgeCheck = {};
        for (var i = 0; i < graphVal.length; i++) {
            var delay = this.VH.setDelay(250);
            var time = this.VH.getAnimTime(250);
            this.createNode(delay, time);
            edgeCheck[i] = [];
        }

        this.VH.setDelay(250);

        // create the edges
        for (var fromNodeID = 0; fromNodeID < graphVal.length; fromNodeID++) {
            var toNodes = graphVal[fromNodeID];
            for (var x = 0; x < toNodes.length; x++) {
                var toNodeID = toNodes[x];

                if (!this.hasDrawnEdge(fromNodeID, toNodeID)) {
                    var f = this.nodes[fromNodeID];
                    var t = this.nodes[toNodeID];
                    var delay = this.VH.setDelay(250);
                    var time = this.VH.getAnimTime(250);
                    this.createEdge(f, t, delay, time);
                }
            }
        }
    };

    // highlight fromNode and toNode, then create an edge between them and fade it in
    Graph.prototype.AddEdge = function(fromNodeID, toNodeID) {
        console.log("VH AddEdge ( " + fromNodeID + " , " + toNodeID + " )");
        var f = this.nodes[fromNodeID];
        var t = this.nodes[toNodeID];

        var delay1 = this.VH.setDelay(250);
        var time1 = this.VH.getAnimTime(250);

        this.VH.setDelay(500);

        var delay2 = this.VH.setDelay(250);
        var time2 = this.VH.getAnimTime(250);

        this.VH.setDelay(500);

        var delay3 = this.VH.setDelay(250);
        var time3 = this.VH.getAnimTime(250);

        this.VH.setDelay(500);

        var delay4 = this.VH.setDelay(500);
        var time4 = this.VH.getAnimTime(500);

        this.highlightNode(f, delay1, time1, "green");
        this.highlightNode(t, delay2, time2, "green");
        this.createEdge(f, t, delay3, time3, "green");
        this.highlightNode(f, delay4, time4, "#4b4b4b");
        this.highlightNode(t, delay4, time4, "#4b4b4b");
        this.highlightEdge(fromNodeID, toNodeID, delay4, time4, "#4b4b4b");
    };

    // highlight fromNode and toNode
    // if there is an edge between the nodes, highlight it
    // otherwise, turn the nodes red
    Graph.prototype.HasEdge = function(fromNodeID, toNodeID) {
        console.log("VH HasEdge ( " + fromNodeID + " , " + toNodeID + " )");
        var f = this.nodes[fromNodeID];
        var t = this.nodes[toNodeID];

        var delay1 = this.VH.setDelay(250);
        var time1 = this.VH.getAnimTime(250);

        this.VH.setDelay(500);

        var delay2 = this.VH.setDelay(250);
        var time2 = this.VH.getAnimTime(250);

        this.VH.setDelay(500);

        var delay3 = this.VH.setDelay(250);
        var time3 = this.VH.getAnimTime(250);

        this.VH.setDelay(750);

        var delay4 = this.VH.setDelay(500);
        var time4 = this.VH.getAnimTime(500);

        this.highlightNode(f, delay1, time1, "green");
        this.highlightNode(t, delay2, time2, "green");

        if (this.hasDrawnEdge(fromNodeID,toNodeID)) {
            console.log(true);
            this.highlightEdge(fromNodeID,toNodeID,delay3,time3,"green");
            this.highlightEdge(fromNodeID,toNodeID,delay4,time4, "#4b4b4b");
        }
        else {
            console.log(false);
            this.highlightNode(f, delay3, time3, "red");
            this.highlightNode(t, delay3, time3, "red");
        }

        this.highlightNode(f, delay4, time4, "#4b4b4b");
        this.highlightNode(t, delay4, time4, "#4b4b4b");
    };

    // highlight the edge from (fromNodeID,toNodeID), then fade it out
    // update this accordingly
    Graph.prototype.RemoveEdge = function(fromNodeID, toNodeID) {
        console.log("VH RemoveEdge ( " + fromNodeID + " , " + toNodeID + " )");
        var f = this.nodes[fromNodeID];
        var t = this.nodes[toNodeID];
        var edge = this.getEdge(fromNodeID, toNodeID);

        // highlight fromNode
        var delay1 = this.VH.setDelay(250);
        var time1 = this.VH.getAnimTime(250);

        this.VH.setDelay(500);

        // highlight toNode
        var delay2 = this.VH.setDelay(250);
        var time2 = this.VH.getAnimTime(250);

        this.VH.setDelay(500);

        // highlight edge to remove
        var delay3 = this.VH.setDelay(250);
        var time3 = this.VH.getAnimTime(250);

        this.VH.setDelay(500);

        // fade out edge, unhighlight nodes
        var delay4 = this.VH.setDelay(250);
        var time4 = this.VH.getAnimTime(250);

        // remove edge
        var delay5 = this.VH.setDelay(100);

        // highlight (fromNode,toNode)
        this.highlightNode(f,delay1,time1,"red");
        this.highlightNode(t,delay2,time2,"red");

        // highlight the edge to be removed
        this.highlightEdge(fromNodeID, toNodeID, delay3, time3, "red");

        // fade out the edge
        var anim4 = Raphael.animation({
            opacity: 0
        }, time4);
        edge.animate(anim4.delay(delay4));
        if (this.isDirected) {
            edge.head.animate(anim4.delay(delay4));
        }

        // unhighlight (fromNode,toNode)
        this.highlightNode(f,delay4,time4,"#4b4b4b");
        this.highlightNode(t,delay4,time4,"#4b4b4b");

        // remove the edge and update the edge tracker
        var _t = this;
        setTimeout(function(){
            // remove the edge
            var _edge = _t.getEdge(fromNodeID,toNodeID);
            if (_t.isDirected) {
                _edge.head.remove();
            }
            _edge.remove();

            // remove the wedge
            var index = -1;
            for (var i = 0; i < _t.wedges.length; i++) {
                var wedge = _t.wedges[i];
                var f = wedge[0],
                    t = wedge[1];
                if (f == fromNodeID && t == toNodeID) {
                    index = i;
                }
                else if (!_t.isDirected) {
                    if (f == toNodeID && t == fromNodeID) {
                        index = i;
                    }
                }
            }

            if (index !== -1) {
                _t.wedges.splice(index, 1);
            }

            // update the edge tracker
            // remove toNodeID from fromNodeID
            var check = _t.edgeCheck[fromNodeID];
            var c = check.indexOf(toNodeID);
            if (c !== -1) {
                (_t.edgeCheck[fromNodeID]).splice(c, 1);
            } 

            // if undirected, remove fromNodeID from toNodeID
            else if (!_t.isDirected) {
                var check2 = _t.edgeCheck[toNodeID];
                var c2 = check.indexOf(fromNodeID);
                if (c2 !== -1) {
                    (_t.edgeCheck[fromNodeID]).splice(c2, 1);
                }
            }
        }, delay5);
    };

    // create an edgeless vertex and fade it in
    Graph.prototype.AddVertex = function() {
        var delay = this.VH.setDelay(250);
        var time = this.VH.getAnimTime(250);
        this.createNode(delay, time);
    };

    // highlight fromNode, then highlight all the edges coming OUT from fromNode
    // and those edges' toNodes
    Graph.prototype.GetDegree = function(fromNodeID) {
        var f = this.nodes[fromNodeID];

        var neighborVals;

        // get the nodeIDs of f's neighbors
        var graphVal = this.value[0];
        for (var i=0; i<graphVal.length; i++) {
            if (i === fromNodeID) {
                neighborVals = graphVal[i];
            }
        }

        // highlight fromNode
        var delay1 = this.VH.setDelay(250);
        var time1 = this.VH.getAnimTime(250);

        this.VH.setDelay(500);

        // highlight fromNode's out edges and the edges' toNodes
        var delay2 = this.VH.setDelay(250);
        var time2 = this.VH.getAnimTime(250);

        this.VH.setDelay(500);

        // unhighlight all
        var delay3 = this.VH.setDelay(500);
        var time3 = this.VH.getAnimTime(500);

        // highlight fromNode
        this.highlightNode(f,delay1,time1,"green");

        // highlight out edges and toNodes
        for (var i=0; i<neighborVals.length; i++) {
            this.highlightEdge(fromNodeID,(neighborVals[i]),delay2,time2,"green");
            var t = this.nodes[(neighborVals[i])];
            this.highlightNode(t,delay2,time2,"green");
        }

        // unhighlight everything
        this.highlightNode(f,delay3,time3,"#4b4b4b");
        for (var i=0; i<neighborVals.length; i++) {
            this.highlightEdge(fromNodeID,(neighborVals[i]),delay3,time3,"#4b4b4b");
            var t = this.nodes[(neighborVals[i])];
            this.highlightNode(t,delay3,time3,"#4b4b4b");
        }
    };

    // highlight toNode, then highlight all the edges going IN to toNode
    // and those edges' fromNodes
    Graph.prototype.GetInDegree = function(toNodeID) {
        var t = this.nodes[toNodeID];

        var neighborVals = [];

        // get the nodeIDs of t's neighbors
        var graphVal = this.value[0];
        for (var i=0; i<graphVal.length; i++) {
            var currentToNodes = graphVal[i];
            if (currentToNodes.indexOf(toNodeID) !== -1) {
                neighborVals.push(i);
            }
        }

        // highlight toNode
        var delay1 = this.VH.setDelay(250);
        var time1 = this.VH.getAnimTime(250);

        this.VH.setDelay(500);

        // highlight toNode's out edges and the edges' fromNodes
        var delay2 = this.VH.setDelay(250);
        var time2 = this.VH.getAnimTime(250);

        this.VH.setDelay(500);

        // unhighlight all
        var delay3 = this.VH.setDelay(500);
        var time3 = this.VH.getAnimTime(500);

        // highlight toNode
        this.highlightNode(t,delay1,time1,"green");

        // highlight to edges and fromNodes
        for (var i=0; i<neighborVals.length; i++) {
            this.highlightEdge(toNodeID,(neighborVals[i]),delay2,time2,"green");
            var f = this.nodes[(neighborVals[i])];
            this.highlightNode(f,delay2,time2,"green");
        }

        // unhighlight everything
        this.highlightNode(t,delay3,time3,"#4b4b4b");
        for (var i=0; i<neighborVals.length; i++) {
            this.highlightEdge(toNodeID,(neighborVals[i]),delay3,time3,"#4b4b4b");
            var f = this.nodes[(neighborVals[i])];
            this.highlightNode(f,delay3,time3,"#4b4b4b");
        }
    };

    // highlight fromNode, highlight all edges coming out of fromNode,
    // then highlight fromNode's neighbors
    Graph.prototype.GetNeighbors = function(fromNodeID) {
        var f = this.nodes[fromNodeID];

        var neighborVals;

        // get the nodeIDs of f's neighbors
        var graphVal = this.value[0];
        for (var i=0; i<graphVal.length; i++) {
            if (i === fromNodeID) {
                neighborVals = graphVal[i];
            }
        }

        // highlight fromNode
        var delay1 = this.VH.setDelay(250);
        var time1 = this.VH.getAnimTime(250);

        this.VH.setDelay(500);

        // highlight fromNode's out edges and the edges' toNodes
        var delay2 = this.VH.setDelay(250);
        var time2 = this.VH.getAnimTime(250);

        this.VH.setDelay(500);

        // unhighlight all
        var delay3 = this.VH.setDelay(500);
        var time3 = this.VH.getAnimTime(500);

        // highlight fromNode
        this.highlightNode(f,delay1,time1,"green");

        // highlight out edges and toNodes
        for (var i=0; i<neighborVals.length; i++) {
            this.highlightEdge(fromNodeID,(neighborVals[i]),delay2,time2,"green");
            var t = this.nodes[(neighborVals[i])];
            this.highlightNode(t,delay2,time2,"green");
        }

        // unhighlight everything
        this.highlightNode(f,delay3,time3,"#4b4b4b");
        for (var i=0; i<neighborVals.length; i++) {
            this.highlightEdge(fromNodeID,(neighborVals[i]),delay3,time3,"#4b4b4b");
            var t = this.nodes[(neighborVals[i])];
            this.highlightNode(t,delay3,time3,"#4b4b4b");
        }
    };

    // fade out then remove all nodes/edges in the graph
    Graph.prototype.Clear = function() {
        var anim1 = Raphael.animation({
            opacity: 0
        }, this.VH.getAnimTime(250));
        var delay1 = this.VH.setDelay(500);

        this.me.animate(anim1.delay(delay1));

        for (var j = 0; j < this.wedges.length; j++) {
            var currentWedge = this.wedges[j];
            currentWedge = currentWedge[2];
            if (typeof(currentWedge) !== "undefined") {
                currentWedge.animate(anim1.delay(delay1));
                if (this.isDirected) {
                    currentWedge.head.animate(anim1.delay(delay1));
                }
            }
        }

        this.eraseValues(this.VH.setDelay(10));
    };
});