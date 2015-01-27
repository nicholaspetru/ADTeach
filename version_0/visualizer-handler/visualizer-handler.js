$(document).ready(function () {
  
    VisualizerHandler = function(){
        //Create the paper

        //the list of entities
        this.entities = [];
        this.eventQueue = [];
        this.symbolTable = null;

        //used to delay animations
        this.date = new Date();
        this.delay = this.date.getTime();

        //Testing a stack here
        this.enqueueEvent("new","stack","stack1","stack",[]);
        //this.enqueueEvent("new","stack","stack2","stack",[1,2]);
        //this.enqueueEvent("update","stack","stack1","stack",[3,4]);
        //this.enqueueEvent("update","stack","stack2","stack",[1,2]);

        //define constants
        this.PRIMITIVE_COLUMNWIDTH = 140;
        this.ADT_COLUMNWIDTH = 140;
        this.PRIMITIVE_SECTION_HEIGHT = 100;
        this.HBORDER = 10;
        this.VBORDER = 12;
        this.FONT_HEIGHT = 12;
        this.FONT_SIZE = 18;
        this.PRIMITIVE_SECTION_Y = this.FONT_HEIGHT + this.VBORDER + 12;
        this.ADT_SECTION_TEXT_Y = this.PRIMITIVE_SECTION_HEIGHT + this.PRIMITIVE_SECTION_Y;
        this.ADT_SECTION_Y = this.PRIMITIVE_SECTION_HEIGHT + this.PRIMITIVE_SECTION_Y + this.FONT_HEIGHT + 12;

        //drawing basic stuff on the paper: the sections
        this.paper = Raphael("vis_paper", 500,1000);
        this.paper.text(this.HBORDER, this.VBORDER, "primitives:").attr({"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
        this.paper.path("M " + this.HBORDER + "," + (this.VBORDER + this.FONT_HEIGHT) + " L " + (this.HBORDER + 200) + "," + (this.VBORDER + this.FONT_HEIGHT));

        this.paper.text(this.HBORDER, this.ADT_SECTION_TEXT_Y, "data structures:").attr({"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
        this.paper.path("M " + this.HBORDER + "," + (this.ADT_SECTION_TEXT_Y + this.FONT_HEIGHT) + " L " + (this.HBORDER + 200) + "," + (this.ADT_SECTION_TEXT_Y + this.FONT_HEIGHT));

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
    
    //Render is just going to chill out and let the change variables hit themselves
    VisualizerHandler.prototype.Render = function() {
        console.log("Visualizer Handler: render()");
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
        this.arrangeEntities();
    };

    //Updates the value of an Entity
    VisualizerHandler.prototype.UpdateEntity = function(name, value) {
        console.log("Visualizer Handler: updateEntity(" + name + ',' + value + ')');
        for (var i = 0; i < this.entities.length; i++){
            if (this.entities[i] != null && this.entities[i].name == name){
                this.entities[i].value = value;
                this.entities[i].update();
            }
        }
    };

    //Deletes the named Entity
    VisualizerHandler.prototype.DeleteEntity = function(name) {
        console.log("Visualizer Handler: deleteEntity(" + name + ")");
        for (var i = 0; i < this.entities.length; i++){
            if (this.entities[i] != null && this.entities[i].name == name){
                this.entities[i].destroy();
                this.entities.splice(i,1);
            }
        }
        this.arrangeEntities();
    };
    
    //Returns a new Entity of the given type
    VisualizerHandler.prototype.getNewEntity = function(className, name, type, value) {
        switch(className){
        case "int":
            return new Primitive(this.paper,name,type,value,this);
        case "string":
            return new Primitive(this.paper,name,type,value,this);
        case "float":
            return new Primitive(this.paper,name,type,value,this);
        case "bool":
            return new Primitive(this.paper,name,type,value,this);
        case "stack":
            return new Stack(this.paper,name,type,value, this);
        //and more cases....
        default:
            console.log("Unknown type for newEntity: " + className);
            return;
        }
    };

    
    //Arranges entities
    VisualizerHandler.prototype.arrangeEntities = function() {
        this.arrangePrimitives();
        this.arrangeADTs();
        return;
    }

    //Arranges primitives
    VisualizerHandler.prototype.arrangePrimitives = function() {
        var curX = this.VBORDER, curY = this.PRIMITIVE_SECTION_Y;

        for (var i = 0; i < this.entities.length; i++){
            if (this.isPrimitive(this.entities[i])){
                if (this.entities[i].x != curX || this.entities[i].y != curY) {
                    //check and see if this is a new entity. if so, fade it in. if not, move it
                    if (this.entities[i].x == 0){
                        this.entities[i].create(curX, curY);
                    }else{
                        this.entities[i].move(curX, curY);
                    }
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
    }

    //Arranges primitives
    VisualizerHandler.prototype.arrangeADTs = function() {
        var curX = this.VBORDER, curY = this.ADT_SECTION_Y;

        for (var i = 0; i < this.entities.length; i++){
            if (!this.isPrimitive(this.entities[i])){
                if (this.entities[i].x != curX || this.entities[i].y != curY) {
                    //check and see if this is a new entity. if so, fade it in. if not, move it
                    if (this.entities[i].x == 0){
                        this.entities[i].create(curX, curY);
                    }else{
                        this.entities[i].move(curX, curY);
                    }
                }
                //traverse down
                curY += this.FONT_HEIGHT + 6;
                //move to the next column
                if (curY > this.ADT_SECTION_HEIGHT){
                    curY = this.ADT_SECTION_Y;
                    curX +=  this.ADT_COLUMNWIDTH;
                }
            }
        }
    }

    //Returns whether or not the Entity is a primitive
    VisualizerHandler.prototype.isPrimitive = function(entity) {
        switch(entity.type){
            case "int":
                return true;
            case "string":
                return true;
            case "float":
                return true;
            case "bool":
                return true;
            default:
                return false;
        }
    }


    //Finds the delay
    VisualizerHandler.prototype.getDelay = function() {
        if (this.date.getTime() > this.delay){
            this.delay = this.date.getTime();
        }
        return this.delay;
    }

    //Sets the delay
    VisualizerHandler.prototype.setDelay = function(t) {
        this.getDelay();
        this.delay += t;
        return (this.delay - this.date.getTime());
    }

});