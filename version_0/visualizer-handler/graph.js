//graph.js
//Represents a graph

$(document).ready(function () {
    
    Graph = function(paper,name,type,value,vishandler){
        this.paper = paper;
        this.VH = vishandler;
        this.name = name;
        this.type = type;
        //this.value = value;
        // each vertex is an index of the list
        // each list is a list of TO neighbors
        this.value = [[3],[2],[1,3],[0,2]];
        //assign the position
        this.x = 0;
        this.y = 0;
        // dict for edges: key is source node, value is destination nodes
        this.EDGES_OUT = {};
        this.EDGES_IN = {};
        // list of nodes (by id)
        this.NODES = [];
        this.TEXTS = [];
        this.FONT_SIZE = 15;
        this.DUNIT_WIDTH = 38.25;
        this.DUNIT_BUFFER = .2;

        this.edges = [];
        //width and height refer to max width and height-- how much room this object takes up on the screen
        this.WIDTH = (this.DUNIT_WIDTH*this.DUNIT_BUFFER*2) + (this.DUNIT_WIDTH*(1 + this.DUNIT_BUFFER)*(this.MAX_LENGTH + 1));
        this.HEIGHT = 45;

        //visual component
        // this.me is a Raphael set containing the name, frame, and data units of the list. 
        // any animation on this.me will affect the entire list, which'll be useful for dragging ADTs
        this.me = null;
        this.myLabel = null;
        this.vis = [];
        this.nextX = 0;
        this.nextY = 0;
        this.count = 0;
        }
        
        Graph.prototype.getNextPos = function() {
            if (this.count == 0) {
                this.nextX = this.x;
                this.nextY = this.y;
            }
            if (this.count % 2 == 0) {
                this.nextX += this.DUNIT_WIDTH*2;
            } else {
                this.nextY += this.DUNIT_WIDTH*2;
            }
            this.count += 1;
        }
        Graph.prototype.buildVisual = function() {
            this.me = this.paper.set();

            this.myLabel = this.paper.text(this.x, this.y + this.HEIGHT + 13, this.type + " " + this.name);
            this.myLabel.attr({"opacity": 0,"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
            for (var i = 0; i < this.value.length; i++){
                this.getNextPos();
                var newDU = new DataUnit(this.paper,'Graph',i.toString(),this.VH,this.nextX,this.nextY,38.25,38.25,1);
                newDU.create();
                this.vis.push(newDU);
                this.NODES.push(newDU.vis[1]);
                this.TEXTS.push(newDU.vis[0]);
            }


            for (var i = 0; i < this.value.length; i++) {
                if (this.value[i]) {
                    for (var j = 0; j < this.value[i].length; j++) {
                        var fromNode = this.value[i];
                        var toNode= fromNode[j];
                        this.edges.push(this.paper.connection(this.NODES[i], this.NODES[toNode], "#000"));
                    }
                }
            }
            
            this.nodeDragger();
            this.me.push(this.myLabel);
            for (var i = 0; i < this.vis.length; i++) {
                this.me.push(this.vis[i]);
            }

        }

        Graph.prototype.nodeDragger = function() {
            var tempS, tempT;
            

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
            for (var i = 0, ii = this.NODES.length; i < ii; i++) {
                tempS = this.NODES[i].attr({fill: "blue", stroke: "black", "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
                tempT = this.TEXTS[i].attr({fill: "black", stroke: "none", "font-size": this.FONT_SIZE, cursor: "move"});

                this.NODES[i].drag(move, dragger, up);
                this.TEXTS[i].drag(move,dragger,up);

                // Associate the elements
                tempS.pair = tempT;
                tempT.pair = tempS;
            }
        }

        // addEdge, addVertex, removeEdge, setDirected, 
        Graph.prototype.update = function(action,originADT){
            //strip the string and get the params from the "Action" str
            var split = action.split(".");
            switch(action.splice("(")[0]) {
                case "addEdge":
                    break;
                case "addVertex":
                    break;
                case "removeEdge":
                    break;
                case "setDirected":
                    break;
                default:
                    console.log("Unknown action for Graphs: " + action);
            }
        }
        Graph.prototype.create = function(newX,newY){
            this.x = newX;
            this.y = newY;
            this.buildVisual();

            //get the delay for outside the loop
            var delay = this.VH.setDelay(500);

            //Fade in the label and frame
            var anim = Raphael.animation({opacity:1},500);
            this.me.animate(anim.delay(delay));
            /*
            this.myLabel.animate(anim.delay(delay));
            this.myFrame.animate(anim.delay(delay));
            */
            /*
            for (var i = 0; i < this.vis.length; i++){
                console.log("create " + this.vis[i]);
                this.vis[i].create();
            }
            */
            
        
        };

        //use this.me.push(newDU) to move graph as a whole
        Graph.prototype.move = function(){
        }
});