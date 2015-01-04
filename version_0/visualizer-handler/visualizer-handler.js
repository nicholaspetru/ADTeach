$(document).ready(function () {
  
    VisualizerHandler = function(){
        //Create the paper

        //the list of entities
        this.entities = [];
        this.eventQueue = [];
        this.symbolTable = null;

        //define constants
        this.PRIMITIVE_COLUMNWIDTH = 120;
        this.PRIMITIVE_SECTION_HEIGHT = 100;
        this.HBORDER = 8;
        this.VBORDER = 12;
        this.FONT_HEIGHT = 12;
        this.FONT_SIZE = 18;
        this.PRIMITIVE_SECTION_Y = this.FONT_HEIGHT + this.VBORDER + 12;
        this.ADT_SECTION_Y = this.PRIMITIVE_SECTION_HEIGHT + this.PRIMITIVE_SECTION_Y;

        //drawing basic stuff on the paper: the sections
        this.paper = Raphael("vis_paper", 500,1000);
        this.paper.text(this.HBORDER, this.VBORDER, "primitives:").attr({"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
        this.paper.path("M " + this.HBORDER + "," + (this.VBORDER + this.FONT_HEIGHT) + " L " + (this.HBORDER + 200) + "," + (this.VBORDER + this.FONT_HEIGHT));

        this.paper.text(this.HBORDER, this.ADT_SECTION_Y, "data structures:").attr({"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
        this.paper.path("M " + this.HBORDER + "," + (this.ADT_SECTION_Y + this.FONT_HEIGHT) + " L " + (this.HBORDER + 200) + "," + (this.ADT_SECTION_Y + this.FONT_HEIGHT));

        return this;
    }
    
    
    //Dequeue all the events from the event queue, execute them, and render
    VisualizerHandler.prototype.goForth = function() {
        console.log("Visualizer Handler: goForth()");
        while (this.eventQueue.length > 0) {
            curEvent = this.eventQueue.shift();
            if (curEvent[0] == 'new') {
                this.NewEntity(curEvent[1], curEvent[2], curEvent[3], curEvent[4]);
            }
            else if (curEvent[0] == 'update') {
                this.UpdateEntity(curEvent[2], curEvent[4]);
            }
            else if (curEvent[0] == 'delete') {
                this.DeleteEntity(curEvent[2]);
            }
            else {
                console.log('unrecognized event: ' + curEvent[0]);
            }
        }
        this.Render();
    };
    
    //Call the draw function of each entity
    VisualizerHandler.prototype.Render = function() {
        console.log("Visualizer Handler: render()");
        var x = 100;
        var y = 100;
        //at some point, we'll delete and assign here
        //sort the entities
        this.arrangePrimitives();

        //for each item in entities, draw
        for (var i = 0; i < this.entities.length; i++){
            if (this.entities[i] != null) {
                this.entities[i].value = this.symbolTable.getValue(this.entities[i].name);
                this.entities[i].Draw();
                //increment y
                y += 16;
            }
        }
    };
    
    //Enqueue an event onto the event queue
    VisualizerHandler.prototype.enqueueEvent = function(event, className, name, type, value) {
        console.log("Visualizer Handler: enqueueEvent(" + event + ',' + className + ',' + name + ',' + type + ',' + value + ')');
        this.eventQueue.push([event, className, name, type, value]);
    };

    //Pushes a new Entity onto the list
    VisualizerHandler.prototype.NewEntity = function(className, name, type, value) {
	    console.log("Visualizer Handler: newEntity(" + className + ',' + name + ',' + type + ',' + value + ')');
        this.entities.push(this.getNewEntity(className,name,type,value));
    };

    //Updates the value of an Entity
    VisualizerHandler.prototype.UpdateEntity = function(name, value) {
        console.log("Visualizer Handler: updateEntity(" + name + ',' + value + ')');
        for (var i = 0; i < this.entities.length; i++){
            if (this.entities[i] != null && this.entities[i].name == name){
                this.entities[i].value = value;
            }
        }
    }

    //Deletes the named Entity
    VisualizerHandler.prototype.DeleteEntity = function(name) {
        console.log("Visualizer Handler: deleteEntity(" + name + ")");
        for (var i = 0; i < this.entities.length; i++){
            if (this.entities[i] != null && this.entities[i].name == name){
                this.entities = this.entities.splice(i,1);
            }
        }
    }
    
    //Returns a new Entity of the given type
    VisualizerHandler.prototype.getNewEntity = function(className, name, type, value) {
        switch(className){
        case "int":
            return new Primitive(this.paper,name,type,value);
        case "string":
            return new Primitive(this.paper,name,type,value);
        case "float":
            return new Primitive(this.paper,name,type,value);
        case "bool":
            return new Primitive(this.paper,name,type,value);
        case "stack":
            return new Stack(this.paper,name,type,value);
        //and more cases....
        default:
            console.log("Unknown type for newEntity: " + className);
            return;
        }
    };

    //Arranges primitives (now all entities)
    VisualizerHandler.prototype.arrangePrimitives = function() {
        var curX = this.VBORDER, curY = this.PRIMITIVE_SECTION_Y, t = 500;

        for (var i = 0; i < this.entities.length; i++){
            if (this.entities[i].x != curX || this.entities[i].y != curY) {
                var anim = Raphael.animation({x:curX,y:curY},500);
                this.entities[i].vis.animate(anim.delay(t));
                t += 500;
            }
            //traverse down
            curY += this.FONT_HEIGHT + 6;
            //move to the next column
            if (curY > this.PRIMITIVE_SECTION_HEIGHT){
                curY = this.PRIMITIVE_SECTION_Y;
                curX +=  this.PRIMITIVE_COLUMNWIDTH;
            }
       }

    }
});