/**
* graph.js
* Represents a graph
* ------------------
* 
* TODO:
* ------------------
* ! setDirected when edges have already been drawn
* - removeEdge
* - Highlight nodes/edges for these?? 
*       getInDegree(nodeID), getOutDegree(nodeID), getNeighbors(nodeID),
*       hasEdge(fromNodeID,toNodeID), size()/isEmpty(), numEdges(), numVerts()
* - timing of edge creation/revisit node dragger
*/
$(document).ready(function () {
    
    Graph = function(paper,name,type,value,vishandler){
        this.paper = paper;
        this.VH = vishandler;
        this.name = name;
        this.type = type;
        //this.value = value;
        // each vertex is an index of the list
        // each list is a list of TO neighbors
        //this.value = [[3],[2],[1,3],[0,2]];
        this.value = value;
        //assign the position
        this.x = 0;
        this.y = 0;

        this.FONT_SIZE = 15;
        this.DUNIT_WIDTH = 38.25;
        this.DUNIT_BUFFER = .2;
        this.MAX_LENGTH = 10;

        this.nodes = [];
        this.edges = [];

        this.edgeCheck = {};
        this.isDirected = false;

        //width and height refer to max width and height-- how much room this object takes up on the screen
        this.WIDTH = (this.DUNIT_WIDTH*this.DUNIT_BUFFER*2) + (this.DUNIT_WIDTH*(1 + this.DUNIT_BUFFER)*(this.MAX_LENGTH + 1));
        this.HEIGHT = 45;

        //visual component
        // this.me is a Raphael set containing the name, frame, and data units of the list. 
        // any animation on this.me will affect the entire list, which'll be useful for dragging ADTs
        this.me = null;
        this.myLabel = null;
        this.drawn = false;

        this.nextNodeX = 0;
        this.nextNodeY = 0;
        this.count = 0;
        }
        
        // populate, addEdge, addVertex, removeEdge, setDirected 
        Graph.prototype.update = function(action,originADT){
            //strip the string and get the params from the "Action" str
            var split = action.split(".");
            //animate the change
            switch(split[0]){
                case "populate":
                    this.Populate();
                    break;
                case "addEdge":
                    this.AddEdge(parseInt(split[1]), parseInt(split[2]));
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
                default:
                    console.log("Unknown action for Graphs: " + action);
            }
        };

        Graph.prototype.AddEdge = function(fromNodeID,toNodeID) {
            console.log("########################");
            console.log("VH graph addEdge( " + fromNodeID + " , " + toNodeID + " (add an edge from " + fromNodeID + " to " + toNodeID + ")");
            var f = this.nodes[fromNodeID];
            f = f.vis[1];
            var t = this.nodes[toNodeID];
            t = t.vis[1];

            var delay1 = this.VH.setDelay(500);
            var anim1 = Raphael.animation({stroke: "green"}, 500);
            f.animate(anim1.delay(delay1));
            t.animate(anim1.delay(delay1));

            this.createEdge(fromNodeID,toNodeID);

            var delay2 = this.VH.setDelay(500);
            var anim2 = Raphael.animation({stroke: "#4b4b4b"}, 500);
            f.animate(anim2.delay(delay2));
            t.animate(anim2.delay(delay2));
        };

        Graph.prototype.AddVertex = function() {
            console.log("########################");
            console.log("VH graph addVertex()");
            this.createNode();
        };

        Graph.prototype.Populate = function() {
            console.log("VH populate graph");
            var graphVal = this.value[0];

            for (var x = 0; x < graphVal.length; x++) {
                console.log("graphVal[" + x + "]: " + graphVal[x]);
            }
            //erase old data
            this.erase();

            // create the nodes
            for (var i = 0; i < graphVal.length; i++){
                this.createNode();
            }
            
            for (var fromNodeID = 0; fromNodeID < graphVal.length; fromNodeID++) {
                var toNodes = graphVal[fromNodeID];
                for (var x = 0; x < toNodes.length; x++) {
                    var toNodeID = toNodes[x];
                    var checking = this.hasDrawnEdge(fromNodeID,toNodeID);

                    if (this.hasDrawnEdge(fromNodeID,toNodeID) == false) {
                        this.createEdge(fromNodeID,toNodeID);
                    }
                }
            }
            this.graphDragger();
        };

        Graph.prototype.SetDirected= function() {
            if (this.value[1] !== this.isDirected) {
                this.isDirected = this.value[1];

                // erase old edges
                for (var i = 0; i < this.edges.length; i++)  {
                    this.edges[i].line.remove();
                }
                this.nodeDragger();            
                
                var graphVal = this.value[0];

                for (var fromNodeID = 0; fromNodeID < graphVal.length; fromNodeID++) {
                    var toNodes = graphVal[fromNodeID];
                    for (var x = 0; x < toNodes.length; x++) {
                        var toNodeID = toNodes[x];
                        this.createEdge(fromNodeID,toNodeID);
                    }
                }
            }
        };

        Graph.prototype.RemoveEdge = function(fromNodeID,toNodeID) {
            for (var i = 0; i < this.edges.length; i++) {
                if (this.edges[i].from.id == fromNodeID) {
                    if (this.edges[i].to.id == toNodeID) {
                        var anim = Raphael.animation({opacity:0},250, function() {
                            this.edges[i].line.remove();
                            this.edges[i].splice(i, 1);});
                        var delay = this.VH.setDelay(250);
                        this.edges[i].line.animate(anim.delay(delay));
                    }
                }
                else if (this.edges[i].from.id == toNodeID) {
                    if (this.edges[i].to.id == fromNodeID) {
                        var anim = Raphael.animation({opacity:0},250, function() {
                            this.edges[i].line.remove();
                            this.edges[i].splice(i, 1);});
                        var delay = this.VH.setDelay(250);
                        this.edges[i].line.animate(anim.delay(delay));
                    }
                }
            }
        };


        Graph.prototype.HasEdge = function(fromNodeID,toNodeID) {
            if (this.hasDrawnEdge(fromNodeID,toNodeID) == true) {
                this.highLightEdge(fromNodeID,toNodeID,"green");
            } else if ((this.isDirected == false) && (this.hasDrawnEdge(toNodeID,fromNodeID) == true)) {
                this.highLightEdge(toNodeID,fromNodeID,"green");
            }
        };

        Graph.prototype.highLightEdge = function(fromNodeID,toNodeID,color) {
            console.log("highLightEdge( " + fromNodeID + "," + toNodeID + ")" );
            for (var i = 0; i < this.edges.length; i++) {
                if (this.edges[i].from.id == fromNodeID) {
                    if (this.edges[i].to.id == toNodeID) {
                        var anim = Raphael.animation({stroke:color},250);
                        var delay = this.VH.setDelay(250);
                        this.edges[i].line.animate(anim.delay(delay));
                    }
                }
                else if (this.edges[i].from.id == toNodeID) {
                    if (this.edges[i].to.id == fromNodeID) {
                        var anim = Raphael.animation({stroke:color},250);
                        var delay = this.VH.setDelay(250);
                        this.edges[i].line.animate(anim.delay(delay));
                    }
                }
            }
        };

        Graph.prototype.createNode = function() {
            // create and display the node
            this.getNextPos();
            var nodeID = this.nodes.length;
            var newNode = new DataUnit(this.paper,'Graph',nodeID.toString(),this.VH,this.nextNodeX,this.nextNodeY,this.DUNIT_WIDTH,this.DUNIT_WIDTH,1);
            newNode.create();
            newNode.vis[1].attr({'stroke-width':2});
            newNode.vis[1].id = nodeID;

            // add to set
            this.me.push(newNode.vis[0]);
            this.me.push(newNode.vis[1]);

            this.nodes.push(newNode);

            // add node id to edge tracker
            this.edgeCheck[nodeID] = [];
            this.nodeDragger();
        };

        Graph.prototype.createEdge = function(fromNodeID,toNodeID) {
            console.log("#########!!!!!!!!!#############");
            console.log("createEdge(" + fromNodeID + " , " + toNodeID + ")");
            // create an edge connecting fromNodeID to toNodeID
            var f = this.nodes[fromNodeID];
            f = f.vis[1];
            var t = this.nodes[toNodeID];
            t = t.vis[1];

            var edge = this.paper.connection(f, t, "#000");
            if (this.isDirected == true) {
                edge.line.attr({'arrow-end': 'classic-wide-long'});
            }
            edge.line.attr({'stroke-width': 1.5});
            // fade in the new edges
            var delay = this.VH.setDelay(250); //get the delay for outside the loop
            var anim = Raphael.animation({opacity:1},250);
            edge.line.animate(anim.delay(delay));

            this.edges.push(edge);

            // make it draggable
            this.nodeDragger();
        };

        // check if an edge from (fromNodeID,toNodeID) is already represented
        // on the screen
        Graph.prototype.hasDrawnEdge = function(fromNodeID,toNodeID) {
            //console.log("hasDrawnEdge( " + fromNodeID + " , " + toNodeID + " )");
            var check = this.edgeCheck[fromNodeID];
            return check.indexOf(toNodeID) !== -1; 
        };

        Graph.prototype.create = function(newX,newY){
            this.x = newX;
            this.y = newY;

            this.buildVisual();

            //get the delay for outside the loop
            var delay = this.VH.setDelay(500);

            //Fade in the label
            var anim = Raphael.animation({opacity:1},500);
            this.myLabel.animate(anim.delay(delay));
        };

        Graph.prototype.buildVisual = function() {
            // create the set
            this.me = this.paper.set();
            // build the label
            this.myLabel = this.paper.text(this.x, this.y + this.HEIGHT + 13, this.type + " " + this.name);
            this.myLabel.attr({"opacity": 0,"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
            this.me.push(this.myLabel);
        }

        Graph.prototype.erase = function() {
            for (var i = 0; i < this.nodes.length; i++){
                var curNode = this.nodes[i];
                for (var j = 0; j < curNode.length; j++) {
                    curNode[j].remove();
                }
            }

            for (var i = 0; i < this.edges.length; i++) {
                this.edges[i].remove();
            }
            this.count = 0;
            this.nextNodeX = 0;
            this.nextNodeY = 0;

        }

        // not-unintelligent placement of nodes
        Graph.prototype.getNextPos = function() {
            if (this.count == 0) {
                this.nextNodeX = this.x;
                this.nextNodeY = this.y;
            }
            if (this.count % 2 == 0) {
                this.nextNodeX += this.DUNIT_WIDTH*2;
            } else {
                this.nextNodeY += this.DUNIT_WIDTH*2;
            }
            this.count += 1;
        };

        // allows the user to drag the nodes around & arrange them as they like
        // the edges follow the nodes
        Graph.prototype.nodeDragger = function() {
            var tempS, tempT;
            for (var i = 0, ii = this.nodes.length; i < ii; i++) {
                var n = this.nodes[i];
                tempS = n.vis[1]; // the circle
                tempT = n.vis[0]; // the node id
                tempS.undrag();
                tempT.undrag();
            }

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
                for (i = connections.length; i--;) {
                    this.paper.connection(connections[i]);
                }
            },
            up = function () {
            },
            connections = this.edges;

            for (var i = 0, ii = this.nodes.length; i < ii; i++) {
                var n = this.nodes[i];
                tempS = n.vis[1]; // the circle
                tempT = n.vis[0]; // the node id
                
                tempS.attr({cursor: "move"});
                tempT.attr({cursor: "move"});
                
                tempS.drag(move,dragger,up);
                tempT.drag(move,dragger,up);

                // associate the circle/id so that dragging one moves the other with it
                tempS.pair = tempT;
                tempT.pair = tempS;
            }
        };

        //use this.me.push(newDU) to move graph as a whole
        //Moves the graph to the specific positon
        Graph.prototype.move = function(newX,newY){
            var difX, difY;
            difX = newX - this.x;
            difY = newY - this.y;
            this.x = newX;
            this.y = newY;

            var delay = this.VH.setDelay(500);
            //Set timeout and move the data structure at the proper delay
            var _t = this;
            setTimeout(function(){
                _t.me.animate({transform:'...t' + difX + ' ' + difY},500);
                //_t.myLabel.animate({transform:'...t' + difX + ' ' + difY},500);

                //move the dataunits
                /*
                for (var i =0; i < _t.vis.length; i++){
                    _t.vis[i].move(difX,difY,0,500);
                }
                */
            },(this.VH.delay - this.VH.date.getTime())); 
        };
        

});