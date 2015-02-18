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
        
        List.prototype.create = function(){
        }

        //use this.me.push(newDU) to move graph as a whole
        List.prototype.move = function(){
        }

        // addEdge, addVertex, removeEdge, setDirected, 
        List.prototype.update = function(action,originADT){
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
});