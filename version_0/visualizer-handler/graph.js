//graph.js
//Represents a graph

$(document).ready(function () {
    
    Graph = function(paper,name,type,value,vishandler){
        this.paper = paper;
        this.VH = vishandler;
        this.name = name;
        this.type = type;
        this.value = value;

        //assign the position
        this.x = 0;
        this.y = 0;
        // dict for edges: key is source node, value is destination nodes
        this.EDGES_OUT = {};
        this.EDGES_IN = {};
        // list of nodes (by id)
        this.NODES = [];
        this.FONT_SIZE = 15;
        this.DUNIT_WIDTH = (45*.85)*.5;
        this.DUNIT_BUFFER = .2;

        //width and height refer to max width and height-- how much room this object takes up on the screen
        this.WIDTH = (this.DUNIT_WIDTH*this.DUNIT_BUFFER*2) + (this.DUNIT_WIDTH*(1 + this.DUNIT_BUFFER)*(this.MAX_LENGTH + 1));
        this.HEIGHT = 45;

        //visual component
        // this.me is a Raphael set containing the name, frame, and data units of the list. 
        // any animation on this.me will affect the entire list, which'll be useful for dragging ADTs
        this.me = null; 
        }
        

        Graph.prototype.buildVisual = function() {
            this.myLabel = this.paper.text(this.x, this.y + this.HEIGHT + 13, this.type + " " + this.name);
            this.myLabel.attr({"opacity": 0,"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
            this.me = this.paper.set();
            this.me.push(this.myLabel);

        }

        // addEdge, addVertex, removeEdge, setDirected, 
        Graph.prototype.update = function(action,originADT){
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
            for (var i = 0; i < this.vis.length; i++){
                this.vis[i].create();
            }
        
        };

        //use this.me.push(newDU) to move graph as a whole
        Graph.prototype.move = function(){
        }
});