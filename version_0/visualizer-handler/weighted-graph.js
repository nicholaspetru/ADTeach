/**
* weighted-graph.js
* Represents a weighted graph
* ------------------
* TODO
* - SetDirected
* - bounding box
* - better node placement
* - place weight
* - animation timing
*/
$(document).ready(function () {
    WeightedGraph = function(paper,name,type,value,vishandler){
        this.paper = paper;
        this.VH = vishandler;
        this.name = name;
        this.type = type;
        this.value = value; // [[...[toID,weight]]]
        //assign the position
        this.x = 0;
        this.y = 0;

        this.FONT_SIZE = 15;
        this.DUNIT_WIDTH = 25.5;
        this.DUNIT_BUFFER = .2;
        this.MAX_LENGTH = 10;

        this.nodes = [];
        this.edges = [];
        this.wedges = []; // [fromNodeID, toNodeID, connection]

        this.backgroundColor = "#B6C5BE";
        this.edgeCheck = {};
        this.isDirected = false;
        this.edgeLines = [];

        //width and height refer to max width and height-- how much room this object takes up on the screen
        this.WIDTH = (this.DUNIT_WIDTH*this.DUNIT_BUFFER*2) + (this.DUNIT_WIDTH*(1 + this.DUNIT_BUFFER)*(this.MAX_LENGTH + 1));
        this.HEIGHT = 45*2;
        this.anon = [];

        //visual component
        // this.me is a Raphael set containing the name, frame, and data units of the list. 
        // any animation on this.me will affect the entire list, which'll be useful for dragging ADTs
        this.me = null;
        this.myLabel = null;
        this.drawn = false;

        this.nextNodeX = 0;
        this.nextNodeY = 0;
        this.count = 0;

        this.edgeFontSize = 13;
        this.wAttr = {"font-size": this.edgeFontSize, "font-family": "times", "opacity": 0};
        }


        WeightedGraph.prototype.move = function(newX,newY) {
            var difX,difY;
            difX = newX - this.x;
            difY = newY - this.y;
            this.x = newX;
            this.y = newY;
            
            var delay = this.VH.setDelay(500);
            //Set timeout and move the data structure at the proper delay
            var _t = this;
            setTimeout(function(){
                _t.me.animate({transform:'...t' + difX + ' ' + difY},_t.VH.getAnimTime(500));
                for (var i = 0; i<_t.wedges.length; i++) {
                    var cur = _t.wedges[i];
                    cur = cur[2];
                    cur.weight.animate({transform:'...t' + difX + ' ' + difY}, _t.VH.getAnimTime(500));
                    cur.animate({transform:'...t' + difX + ' ' + difY}, _t.VH.getAnimTime(500));
                }
            },(this.VH.delay - this.VH.date.getTime())); 
        };

        WeightedGraph.prototype.Populate = function() {
            console.log("VH populate");
            console.log("value: " + this.value);
            var graphVal = this.value[0];
            this.erase();

            // create the nodes
            var edgeCheck = {};
            for (var i = 0; i < graphVal.length; i++){
                this.createNode();
                edgeCheck[i] = [];
            }

            for (var fromNodeID = 0; fromNodeID < graphVal.length; fromNodeID++) {
                var toNodes = graphVal[fromNodeID];
                for (var x = 0; x < toNodes.length; x++) {
                    var toNode = toNodes[x]; // pair [to,weight]
                    var toNodeID = toNode[0];
                    var weight = toNode[1];
                    console.log("from: " + fromNodeID + " to: " + toNodeID + " weight: " + weight);

                    if (!this.hasDrawnEdge(fromNodeID,toNodeID)) {
                        console.log(false);
                        var f = this.nodes[fromNodeID];
                        var t = this.nodes[toNodeID];
                        this.createEdge(f,t,weight);
                    }
                }
            }

        };

        WeightedGraph.prototype.SetWeight = function(fromNodeID,toNodeID,weight) {
            console.log("VH getWeight ( " + fromNodeID + " , " + toNodeID + " )");
            var f = this.nodes[fromNodeID];
            var t = this.nodes[toNodeID];

            f.highLight();
            t.highLight();
            var fromNode = this.nodes[fromNodeID];
            var toNode = this.nodes[toNodeID];
            this.VH.setDelay(500);
            var anim = Raphael.animation({stroke:"#4b4b4b"},this.VH.getAnimTime(500));
            var delay = this.VH.setDelay(500);

            for (var i=0; i<f.vis.length; i++) {
                f.vis[i].animate(anim.delay(delay));
                t.vis[i].animate(anim.delay(delay));
            }

            this.highlightEdge(fromNodeID,toNodeID);
            this.VH.setDelay(500);
            var e = this.getEdge(fromNodeID,toNodeID);
            
            var delay1 = this.VH.setDelay(500);
            var anim1 = Raphael.animation({opacity:0},this.VH.getAnimTime(500));
            var anim2 = Raphael.animation({opacity:1}, this.VH.getAnimTime(500),
                 this.destroyWedge(fromNodeID,toNodeID));
            var anim3 = Raphael.animation({stroke: "green"},this.VH.getAnimTime(500));
            var anim4 = Raphael.animation({stroke: "black"},this.VH.getAnimTime(500));
            var delay2 = this.VH.setDelay(500);
            var delay3 = this.VH.setDelay(500);

            var newEdge = this.paper.connect(fromNode,toNode,this.isDirected,true,weight,this.wAttr);
            newEdge.attr({opacity:1});

            e.weight.animate(anim1.delay(delay1));
            this.VH.setDelay(500);
            newEdge.weight.animate(anim2.delay(delay2));
            newEdge.weight.animate(anim3.delay(delay2));
            newEdge.weight.animate(anim4.delay(delay3));
            newEdge.animate(anim4.delay(delay3));

            var wedge = [];
            wedge.push(fromNodeID);
            wedge.push(toNodeID);
            wedge.push(newEdge);
            this.wedges.push(wedge);
        };


        WeightedGraph.prototype.GetWeight = function(fromNodeID,toNodeID) {
            console.log("VH getWeight ( " + fromNodeID + " , " + toNodeID + " )");
            var f = this.nodes[fromNodeID];
            var t = this.nodes[toNodeID];

            f.highLight();
            this.VH.setDelay(500);
            t.highLight();
            this.VH.setDelay(500);

            this.highlightEdge(fromNodeID,toNodeID);
            this.VH.setDelay(1000);
            var e = this.getEdge(fromNodeID,toNodeID);
            var delay = this.VH.setDelay(1000);
            var anim1 = Raphael.animation({stroke: "#4b4b4b"}, this.VH.getAnimTime(2000));
            var anim2 = Raphael.animation({stroke: "black"}, this.VH.getAnimTime(2000));

            for (var i=0; i<f.vis.length; i++) {
                f.vis[i].animate(anim1.delay(delay));
                t.vis[i].animate(anim1.delay(delay));
            }

            e.animate(anim2.delay(delay));
            e.weight.animate(anim2.delay(delay));
        };

        WeightedGraph.prototype.GetDegree = function(fromNodeID) {
           var neighbors = [];
            for (var i = 0; i < this.nodes.length; i++) {
                if (this.hasDrawnEdge(fromNodeID,i)) {
                    var n = this.getEdge(fromNodeID,i);
                    neighbors.push(n);
                }
            }
            var f = this.nodes[fromNodeID];
            f.highLight();
            this.VH.setDelay(500);

            var anim1 = Raphael.animation({stroke:"green"},this.VH.getAnimTime(500));
            var delay1 = this.VH.setDelay(500);

            for (var j = 0; j < neighbors.length; j++) {
                neighbors[j].weight.animate(anim1.delay(delay1));
                neighbors[j].animate(anim1.delay(delay1));
            }
            this.VH.setDelay(1000);
            var anim2 = Raphael.animation({stroke:"black"},this.VH.getAnimTime(500));
            var anim3 = Raphael.animation({stroke:"#4b4b4b"},this.VH.getAnimTime(500));
            var delay2 = this.VH.setDelay(500);

            for (var j = 0; j < neighbors.length; j++) {
                neighbors[j].animate(anim2.delay(delay2));
                neighbors[j].weight.animate(anim2.delay(delay2));
            }
            for (var i=0; i<f.vis.length; i++) {
                f.vis[i].animate(anim3.delay(delay2));
            }
        };

        WeightedGraph.prototype.GetInDegree = function(toNodeID) {
           var neighbors = [];
            for (var i = 0; i < this.nodes.length; i++) {
                if (this.hasDrawnEdge(i,toNodeID)) {
                    var n = this.getEdge(i,toNodeID);
                    neighbors.push(n);
                }
            }

            var t = this.nodes[toNodeID];
            t.highLight();
            this.VH.setDelay(500);

            var anim1 = Raphael.animation({stroke:"green"},this.VH.getAnimTime(500));
            var delay1 = this.VH.setDelay(500);

            for (var j = 0; j < neighbors.length; j++) {
                neighbors[j].weight.animate(anim1.delay(delay1));
                neighbors[j].animate(anim1.delay(delay1));
            }
            this.VH.setDelay(1000);
            var anim2 = Raphael.animation({stroke:"black"},this.VH.getAnimTime(500));
            var anim3 = Raphael.animation({stroke:"#4b4b4b"},this.VH.getAnimTime(500));
            var delay2 = this.VH.setDelay(500);

            for (var j = 0; j < neighbors.length; j++) {
                neighbors[j].animate(anim2.delay(delay2));
                neighbors[j].weight.animate(anim2.delay(delay2));
            }
            for (var i=0; i<t.vis.length; i++) {
                t.vis[i].animate(anim3.delay(delay2));
            }
        };

        WeightedGraph.prototype.GetNeighbors = function(fromNodeID) {
            var neighbors = [];
            for (var i = 0; i < this.nodes.length; i++) {
                if (this.hasDrawnEdge(fromNodeID,i)) {
                    var n = this.getWedge(fromNodeID,i);
                    neighbors.push(n);
                }
            }

            var f = this.nodes[fromNodeID];
            f.highLight();
            this.VH.setDelay(500);

            for (var j = 0; j < neighbors.length; j++) {
                var current = neighbors[j];
                this.highlightEdge((current[0]),(current[1]));
                if (current[0] == fromNodeID) {
                    var n = current[1];
                    n = this.nodes[n];
                    n.highLight();
                }
                else {
                    var n = current[0];
                    n = this.nodes[n];
                    n.highLight();
                }
            }

            this.VH.setDelay(1000);
            var anim2 = Raphael.animation({stroke: "black"},this.VH.getAnimTime(1000));
            var anim3 = Raphael.animation({stroke: "#4b4b4b"},this.VH.getAnimTime(1000));
            var delay2 = this.VH.setDelay(1000);

            for (var j = 0; j < neighbors.length; j++) {
                var current = neighbors[j];
                var curEdge = this.getEdge((current[0]),(current[1]));
                curEdge.animate(anim2.delay(delay2));
                curEdge.weight.animate(anim2.delay(delay2));
                if (current[0] == fromNodeID) {
                    var n = current[1];
                    n = this.nodes[n];
                    for (var i=0; i<n.vis.length; i++) {
                        n.vis[i].animate(anim3.delay(delay2));
                    }
                }
                else {
                    var n = current[0];
                    n = this.nodes[n];
                    for (var i=0; i<n.vis.length; i++) {
                        n.vis[i].animate(anim3.delay(delay2));
                    }
                
                }      
            }

            var f = this.nodes[fromNodeID];
            for (var i=0; i<n.vis.length; i++) {
                f.vis[i].animate(anim3.delay(delay2));
            }
        };






        WeightedGraph.prototype.highlightEdge = function(fromNodeID,toNodeID) {
            console.log('highlightEdge');
            var edge = this.getEdge(fromNodeID,toNodeID);
            var delay = this.VH.setDelay(250);
            var anim = Raphael.animation({stroke:"green"},this.VH.getAnimTime(250));

            edge.animate(anim.delay(delay));
            edge.weight.animate(anim.delay(delay));

        };
        WeightedGraph.prototype.lowlightEdge = function(fromNodeID,toNodeID) {
            var edge = this.getEdge(fromNodeID,toNodeID);
            var delay = this.VH.setDelay(250);
            var anim = Raphael.animation({stroke:"black"},this.VH.getAnimTime(250));

            edge.animate(anim.delay(delay));
            edge.weight.animate(anim.delay(delay));

        };

        WeightedGraph.prototype.getEdge = function(fromNodeID,toNodeID) {
            for (var i=0; i<this.wedges.length; i++) {
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

        WeightedGraph.prototype.getWedge = function(fromNodeID,toNodeID) {
            for (var i=0; i<this.wedges.length; i++) {
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

        WeightedGraph.prototype.destroyWedge = function(fromNodeID,toNodeID) {
            var index = -1;
            for (var i=0; i<this.wedges.length; i++) {
                var wedge = this.wedges[i];
                var f = wedge[0],
                    t = wedge[1];
                if (f == fromNodeID && t == toNodeID) {
                    index = i;
                }
                if (!this.isDirected) {
                    if (f == toNodeID && t == fromNodeID) {
                        index = i;
                    }
                }
            } 
            this.wedges.splice(index,1);
        };

        WeightedGraph.prototype.createEdge = function(fromNode,toNode,weight) {
            
            var delay = this.VH.setDelay(250);
            var anim = Raphael.animation({opacity:1},this.VH.getAnimTime(250));
            

            var newEdge = this.paper.connect(fromNode,toNode, this.isDirected, true, weight, 
                {"font-size": this.edgeFontSize, "font-family": "times", "opacity": 0});

            this.dragNode(fromNode);
            this.dragNode(toNode);

            newEdge.animate(anim.delay(delay));
            newEdge.weight.animate(anim.delay(delay));

            this.edges.push(newEdge);

            this.edgeCheck[(fromNode.id)].push((toNode.id));

            var wedge = [];
            wedge.push(fromNode.id);
            wedge.push(toNode.id);
            wedge.push(newEdge);
            this.wedges.push(wedge);
            this.me.push(newEdge.weight);

        };
        // check if an edge from (fromNodeID,toNodeID) is already represented
        // on the screen
        WeightedGraph.prototype.hasDrawnEdge = function(fromNodeID,toNodeID) {
            console.log("hasDrawnEdge( " + fromNodeID + " , " + toNodeID + " )");
            var check1 = this.edgeCheck[fromNodeID];
            if (this.isDirected) {
                return check1.indexOf(toNodeID) !== -1; 
            }
            var check2 = this.edgeCheck[toNodeID];
            return (check1.indexOf(toNodeID) !== -1)
                    || (check2.indexOf(fromNodeID) !== -1)
        };



        WeightedGraph.prototype.createNode = function() {
            // create and display the node
            this.getNextPos();
            var nodeID = this.nodes.length;
            var newNode = new DataUnit(this.paper,'WeightedGraph',nodeID.toString(),this.VH,this.nextNodeX,this.nextNodeY,this.DUNIT_WIDTH,this.DUNIT_WIDTH,1);
            newNode.create();
            newNode.vis[1].attr({'stroke-width':2, 'fill': this.backgroundColor, 'fill-opacity':1});
            newNode.vis[0].toFront();
            newNode.vis[1].data("nodeID", nodeID);
            newNode.id = nodeID;
            // add to set
            this.me.push(newNode.vis[0]);
            this.me.push(newNode.vis[1]);

            this.nodes.push(newNode);

            // add node id to edge tracker
            this.edgeCheck[nodeID] = [];
            this.dragNode(newNode);
        };













        WeightedGraph.prototype.AddEdge = function(fromNodeID,toNodeID,weight) {
            console.log(fromNodeID + " , " + toNodeID + " , " + weight);
            var f = this.nodes[fromNodeID];
            var t = this.nodes[toNodeID];

            f.highLight();
            this.VH.setDelay(500);
            t.highLight();
            this.VH.setDelay(500);
            this.createEdge(f,t,weight);

            var delay = this.VH.setDelay(1000);
            var anim = Raphael.animation({stroke: "#4b4b4b"}, this.VH.getAnimTime(1000));
            for (var i=0; i<f.vis.length; i++) {
                f.vis[i].animate(anim.delay(delay));
                t.vis[i].animate(anim.delay(delay));
            }
        };

        WeightedGraph.prototype.HasEdge = function(fromNodeID,toNodeID) {
            console.log("VH HasEdge");
            var f = this.nodes[fromNodeID];
            var t = this.nodes[toNodeID];

            f.highLight();
            this.VH.setDelay(500);
            t.highLight();
            this.VH.setDelay(500);

            if (this.hasDrawnEdge(fromNodeID,toNodeID)) {
                //this.VH.setDelay(1000);
                this.highlightEdge(fromNodeID,toNodeID);
                this.VH.setDelay(500);
                this.lowlightEdge(fromNodeID,toNodeID);
            }
            else {
                var delay1 = this.VH.setDelay(500);
                var anim1 = Raphael.animation({stroke: "red"}, this.VH.getAnimTime(500));
                for (var i=0; i<f.vis.length; i++) {
                    f.vis[i].animate(anim1.delay(delay1));
                    t.vis[i].animate(anim1.delay(delay1));
                }
            }

            var delay = this.VH.setDelay(1500);
            var anim = Raphael.animation({stroke: "#4b4b4b"}, this.VH.getAnimTime(1500));
            for (var i=0; i<f.vis.length; i++) {
                f.vis[i].animate(anim.delay(delay));
                t.vis[i].animate(anim.delay(delay));
            }
        };

        WeightedGraph.prototype.RemoveEdge = function(fromNodeID,toNodeID) {
            console.log("VH removeEdge");
            var edge = this.getEdge(fromNodeID,toNodeID);

            var check = this.edgeCheck[fromNodeID];
            var c = check.indexOf(toNodeID);
            if (c !== -1) {
                (this.edgeCheck[fromNodeID]).splice(c,1);
            }
            else if (!this.isDirected) {
                var check2 = this.edgeCheck[toNodeID];
                var c2 = check.indexOf(fromNodeID);
                if (c2 !== -1) {
                    (this.edgeCheck[fromNodeID]).splice(c2,1);
                }
            }
            this.highlightEdge(fromNodeID,toNodeID);
            this.VH.setDelay(500);

            var anim1 = Raphael.animation({opacity:0},this.VH.getAnimTime(250));
            var anim2 = Raphael.animation({opacity:0},this.VH.getAnimTime(250), 
                this.destroyWedge(fromNodeID,toNodeID));
            var delay = this.VH.setDelay(250);

            edge.animate(anim1.delay(delay));
            edge.weight.animate(anim2.delay(delay));
        };

        WeightedGraph.prototype.update = function(action,originADT){
            //strip the string and get the params from the "Action" str
            var split = action.split(".");
            //animate the change
            switch(split[0]){
                case "populate":
                    this.Populate();
                    break;
                case "addEdge":
                    this.AddEdge(parseInt(split[1]), parseInt(split[2]), parseInt(split[3]));
                    break;
                case "addVertex":
                    this.AddVertex();
                    break;
                case "removeEdge":
                    this.RemoveEdge(parseInt(split[1]), parseInt(split[2]));
                    break;
                case "setDirected":
                    this.SetDirected();
                    break;
                case "hasEdge":
                    this.HasEdge(parseInt(split[1]), parseInt(split[2]));
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
                case "setWeight":
                    this.SetWeight(parseInt(split[1]),parseInt(split[2]),parseInt(split[3]));
                    break;
                case "getWeight":
                    this.GetWeight(parseInt(split[1]),parseInt(split[2]));
                    break;
                case "clear":
                    this.Clear();
                    break;
                default:
                    console.log("Unknown action for Graphs: " + action);
            }
        };
        WeightedGraph.prototype.dragNode = function(n) {
            var dragger = function () {
                // Original coords for main element
                this.ox = this.type == "circle" ? this.attr("cx") : this.attr("x");
                this.oy = this.type == "circle" ? this.attr("cy") : this.attr("y");

                // Original coords for pair element
                this.pair.ox = this.pair.type == "circle" ? this.pair.attr("cx") : this.pair.attr("x");
                this.pair.oy = this.pair.type == "circle" ? this.pair.attr("cy") : this.pair.attr("y");
            },
            move = function (dx, dy) {

                // Move main element
                var att = this.type == "circle" ? {cx: this.ox + dx, cy: this.oy + dy} : 
                                               {x: this.ox + dx, y: this.oy + dy};
                this.attr(att);
            
                // Move paired element
                att = this.pair.type == "circle" ? {cx: this.pair.ox + dx, cy: this.pair.oy + dy} : 
                                               {x: this.pair.ox + dx, y: this.pair.oy + dy};
                this.pair.attr(att);            
            
                // Move connections
                var temp, x1, y1, x2, y2;
                if (this.type == "circle") {
                    temp = this;
                    x1 = this.ox + dx;
                    y1 = this.oy + dy;
                }
                else {
                    temp = this.pair;
                    x1 = this.pair.ox + dx;
                    y1 = this.pair.oy + dy;
                }
                if (temp.connections) {
                    for (var i=0; i<temp.connections.length; i++) {
                        var tempPath = temp.connections[i];

                        var pathString;
                        if (tempPath.from.data("nodeID") == temp.data("nodeID") ) {
                            pathString = "M " + (this.ox + dx).toString() + ","
                                            + (this.oy + dy).toString() + "L " 
                                            + tempPath.to.attr("cx") + ","
                                            + tempPath.to.attr("cy");
                            x2 = tempPath.to.attr("cx");
                            y2 = tempPath.to.attr("cy");

                        } else {
                            pathString = "M " + tempPath.from.attr("cx") + ","
                                        + tempPath.from.attr("cy") + " L"
                                        + (this.ox + dx).toString() + ","
                                        + (this.oy + dy).toString();
                            x2 = tempPath.from.attr("cx");
                            y2 = tempPath.from.attr("cy");
                        }
                        tempPath.attr({ path : pathString });

                        var totalLen = tempPath.getTotalLength();
                        var mid = tempPath.getPointAtLength((totalLen / 2));

                        var wx = mid.x,
                            wy = mid.y;

                        if (mid.alpha == 180) {
                            wy += -10;
                        }
                        else {
                            wx += -13;
                        }

                        tempPath.weight.attr({"x": wx, "y": wy});

                        tempPath.toBack();
                    }
                }
            },
            up = function () {
            };

            var tempS = n.vis[1]; // the circle
            var tempT = n.vis[0]; // the node id

            // remove old dragger if it exists
            tempS.undrag();
            tempT.undrag();

            // cursor on hover
            tempS.attr({cursor: "move"});
            tempT.attr({cursor: "move"});
            
            // add drag handler
            tempS.drag(move,dragger,up);
            tempT.drag(move,dragger,up);

            // associate the circle/id so that dragging one moves the other with it
            tempS.pair = tempT;
            tempT.pair = tempS;
        };

        WeightedGraph.prototype.erase = function() {
            if (this.me !== null) {
                this.me.remove();
                this.me = this.paper.set();
            }

            for (var j=0; j<this.wedges.length; j++) {
                var currentWedge = _t.wedges[j];
                currentWedge = currentWedge[2];
                currentWedge.remove();
            }

            this.wedges = [];
            this.nodes = [];
            this.edgeCheck = {};
            this.nextNodeY = 0;
            this.nextNodeX = 0;
            this.count = 0;

        };

        WeightedGraph.prototype.Clear = function() {
            var anim1 = Raphael.animation({opacity:0},this.VH.getAnimTime(250));
            var delay1 = this.VH.setDelay(500);

            this.me.animate(anim1.delay(delay1));

            for (var j=0; j<this.wedges.length; j++) {
                var currentWedge = this.wedges[j];
                currentWedge = currentWedge[2];
                console.log(currentWedge);
                currentWedge.animate(anim1.delay(delay1));
            }

            this.eraseValues(this.VH.setDelay(250));
        };

        WeightedGraph.prototype.eraseValues = function(delay) {
            var _t = this;
            setTimeout(function(){
                _t.me.remove();

                for (var j=0; j<_t.wedges.length; j++) {
                    var currentWedge = _t.wedges[j];
                    currentWedge = currentWedge[2];
                    currentWedge.remove();
                }

                _t.wedges = [];
                _t.nodes = [];
                _t.edgeCheck = {};
                _t.nextNodeY = 0;
                _t.nextNodeX = 0;
                _t.count = 0;
            }, delay);
        };

        // not-unintelligent placement of nodes
        WeightedGraph.prototype.getNextPos = function() {
            if (this.count == 0) {
                this.nextNodeX = this.x;
                this.nextNodeY = this.y+20;
            }
            if (this.count % 2 == 0) {
                this.nextNodeY = this.y +20;
                this.nextNodeX += this.DUNIT_WIDTH*2;

            } else {
                this.nextNodeY = this.y + 20 + this.DUNIT_WIDTH*2;
                this.nextNodeX += this.DUNIT_WIDTH*2;

            }
            this.count += 1;
        };

        WeightedGraph.prototype.AddVertex = function() {
            this.createNode();
        };

        // not yet working
        WeightedGraph.prototype.SetDirected = function() {
            if (this.value[1] !== this.isDirected) {
                this.isDirected = this.value[1];
            }

            // erase old edges
            for (var i=0; i<this.edges.length; i++) {
                this.edges[i].weight.remove();
                this.edges[i].remove();
            }

            for (var j=0; j < this.nodes.length; j++) {
                var currentNode = this.nodes[j];
                var n = currentNode.vis[1];
                if (n.connections) {
                    n.connections = [];
                }
            }

            var graphVal = this.value[0];
            for (var fromNodeID = 0; fromNodeID < graphVal.length; fromNodeID++) {
                var toNodes = graphVal[fromNodeID];
                for (var x = 0; x < toNodes.length; x++) {
                    var toNode = toNodes[x]; // pair [to,weight]
                    var toNodeID = toNode[0];
                    var weight = toNode[1];
                    console.log("from: " + fromNodeID + " to: " + toNodeID + " weight: " + weight);
                    var f = this.nodes[fromNodeID];
                    var t = this.nodes[toNodeID];
                    this.createEdge(f,t,weight);
                }
            }
        };
        WeightedGraph.prototype.create = function(newX,newY){
            this.x = newX;
            this.y = newY;

            this.buildVisual();

            //get the delay for outside the loop
            var delay = this.VH.setDelay(500);

            //Fade in the label
            var anim = Raphael.animation({opacity:1},this.VH.getAnimTime(500));
            this.myLabel.animate(anim.delay(delay));
        };

        WeightedGraph.prototype.buildVisual = function() {
            // create the set
            this.me = this.paper.set();
            // build the label
            this.myLabel = this.paper.text(this.x, this.y + this.HEIGHT + 20, this.type + " " + this.name);
            this.myLabel.attr({"opacity": 0,"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
        };

});