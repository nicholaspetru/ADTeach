/**
* weighted-graph.js
* Represents a weighted graph
* ------------------
* 
*/
$(document).ready(function () {
    WeightedGraph = function(paper,name,type,value,vishandler){
        this.paper = paper;
        this.VH = vishandler;
        this.name = name;
        this.type = type;
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
        this.edgeLines = [];

        //width and height refer to max width and height-- how much room this object takes up on the screen
        this.WIDTH = (this.DUNIT_WIDTH*this.DUNIT_BUFFER*2) + (this.DUNIT_WIDTH*(1 + this.DUNIT_BUFFER)*(this.MAX_LENGTH + 1));
        this.HEIGHT = 45;
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

        this.edgeFont = this.paper.getFont("Open Sans Regular");
        }

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
                    this.GetNeighbors(parseInt(split[1]),parseInt(split[2]),parseInt(split[3]));
                    break;
                case "getWeight":
                    this.GetNeighbors(parseInt(split[1]),parseInt(split[2]));
                    break;
                default:
                    console.log("Unknown action for Graphs: " + action);
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
            this.myLabel = this.paper.text(this.x, this.y + this.HEIGHT + 13, this.type + " " + this.name);
            this.myLabel.attr({"opacity": 0,"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
            this.me.push(this.myLabel);


            this.paper.print(100,100,"420",this.edgeFont, 15);
        }

        WeightedGraph.prototype.createNode = function() {
            // create and display the node
            this.getNextPos();
            var nodeID = this.nodes.length;
            var newNode = new DataUnit(this.paper,'WeightedGraph',nodeID.toString(),this.VH,this.nextNodeX,this.nextNodeY,this.DUNIT_WIDTH,this.DUNIT_WIDTH,1);
            newNode.create();
            newNode.vis[1].attr({'stroke-width':2, 'fill-opacity':1});
            newNode.vis[0].toFront();
            newNode.vis[1].id = nodeID;

            // add to set
            this.me.push(newNode.vis[0]);
            this.me.push(newNode.vis[1]);

            this.nodes.push(newNode);

            // add node id to edge tracker
            this.edgeCheck[nodeID] = [];
            this.nodeDragger();
        };
        // allows the user to drag the nodes around & arrange them as they like
        // the edges follow the nodes
        WeightedGraph.prototype.nodeDragger = function() {
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

        WeightedGraph.prototype.erase = function() {
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

        };
        // not-unintelligent placement of nodes
        WeightedGraph.prototype.getNextPos = function() {
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
});