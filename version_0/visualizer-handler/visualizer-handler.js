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
        //event, type, name, value, action, originADT
        /*
        this.enqueueEvent("new","List<Integer>","stack1",[1,2,3], "", "");
        this.enqueueEvent("update","List<Integer>","stack1",[2,5,5], "set", "set");
        this.enqueueEvent("update","List<Integer>","stack1",[1,2,3,5], "add", "add");
        this.enqueueEvent("update","List<Integer>","stack1",[2,5,5], "set", "set");
        this.enqueueEvent("update","List<Integer>","stack1",[2,3,5], "remove", "remove");
        this.enqueueEvent("update","List<Integer>","stack1",[2,5,5], "set", "set");
        */
        //this.enqueueEvent("update","Stack<Integer>","stack1","Stack<Integer>",[3,4]);
        //this.enqueueEvent("update","stack","stack2","stack",[1,2]);


        //define constants
        this.PRIMITIVE_ROW_LEN = 8
        this.PRIMITIVE_COL_LEN = 5
        this.PRIMITIVE_COLUMNWIDTH = 140;
        this.ADT_COLUMNWIDTH = 140;
        this.PRIMITIVE_SECTION_HEIGHT = 100;
        this.HBORDER = 10;
        this.VBORDER = 12;
        this.FONT_HEIGHT = 12;
        this.FONT_SIZE = 18;
        this.PRIMITIVE_SECTION_Y = this.FONT_HEIGHT + this.VBORDER + 12;
        this.ADT_SECTION_TEXT_Y = this.PRIMITIVE_SECTION_HEIGHT + this.PRIMITIVE_SECTION_Y;
        this.ADT_SECTION_Y = this.PRIMITIVE_SECTION_HEIGHT + this.PRIMITIVE_SECTION_Y + this.FONT_HEIGHT + 12 + 30;

        //Positional 2D arrays
        this.primitiveArray = Array.matrix(this.PRIMITIVE_ROW_LEN, this.PRIMITIVE_COL_LEN, 0);
        this.adtArray = [[]];

        //drawing basic stuff on the paper: the sections
        this.paper = Raphael("vis_paper", 1000,1000);
        this.paper.text(this.HBORDER, this.VBORDER, "primitives:").attr({"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
        this.paper.path("M " + this.HBORDER + "," + (this.VBORDER + this.FONT_HEIGHT) + " L " + (this.HBORDER + 200) + "," + (this.VBORDER + this.FONT_HEIGHT));

        this.paper.text(this.HBORDER, this.ADT_SECTION_TEXT_Y, "data structures:").attr({"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
        this.paper.path("M " + this.HBORDER + "," + (this.ADT_SECTION_TEXT_Y + this.FONT_HEIGHT) + " L " + (this.HBORDER + 200) + "," + (this.ADT_SECTION_TEXT_Y + this.FONT_HEIGHT));

        this.codeboxPaper = null;        
        //Testing new primitive system
        /*
        this.enqueueEvent("new", "int", "a", 1, "int");
        this.enqueueEvent("new", "int", "b", 2, "int");
        this.enqueueEvent("new", "int", "c", 3, "int");
        this.enqueueEvent("new", "int", "d", 4, "int");
        this.enqueueEvent("new", "int", "e", 5, "int");
        this.enqueueEvent("new", "int", "f", 6, "int");
        this.enqueueEvent("new", "int", "g", 7, "int");
        this.enqueueEvent("new", "int", "h", 8, "int");
        this.enqueueEvent("new", "int", "i", 9, "int");
        */

        return this;
    }

    VisualizerHandler.prototype.highlightLine = function(lineNumber) {
        console.log("Visualizer Handler: highlightLine()");
        //paper for highlight line
        if (this.codeboxPaper != null) {
            this.codeboxPaper.remove();
        }
        this.codeboxPaper = Raphael(35, 105, 444, 444);
        var highlight = this.codeboxPaper.rect(0,3+(13*lineNumber),444,13);
        highlight.attr("fill", "yellow");
        highlight.attr("fill-opacity", .2);
        highlight.attr("stroke-width", 0);
    }

    //Dequeue all the events from the event queue, execute them, and render
    VisualizerHandler.prototype.goForthAll = function() {
        console.log("Visualizer Handler: goForthAll()");
        while (this.eventQueue.length > 0) {
            curEvent = this.eventQueue.shift();
            this.highlightLine(curEvent[6]);
            if (curEvent[0] == 'new') {
                this.NewEntity(curEvent[1], curEvent[2], curEvent[3], curEvent[4], curEvent[5]);
            }
            else if (curEvent[0] == 'update') {
                this.UpdateEntity(curEvent[1], curEvent[3], curEvent[4], curEvent[5]);
            }
            else if (curEvent[0] == 'delete') {
                this.DeleteEntity(curEvent[2]);
            }
            else {
                console.log('unrecognized event: ' + curEvent[0]);
            }
        }
    };
    
    VisualizerHandler.prototype.goForthOnce = function() {
        console.log("Visualizer Handler: goForthOnce()");
        if (this.eventQueue.length > 0) {
            curEvent = this.eventQueue.shift();
            this.highlightLine(curEvent[6]);
            if (curEvent[0] == 'new') {
                this.NewEntity(curEvent[1], curEvent[2], curEvent[3], curEvent[4], curEvent[5]);
            }
            else if (curEvent[0] == 'update') {
                this.UpdateEntity(curEvent[1], curEvent[3], curEvent[4], curEvent[5]);
            }
            else if (curEvent[0] == 'delete') {
                this.DeleteEntity(curEvent[2]);
            }
            else {
                console.log('unrecognized event: ' + curEvent[0]);
            }
        }
    };
    
    //Enqueue an event onto the event queue
    VisualizerHandler.prototype.enqueueEvent = function(event, type, name, value, action, originADT, lineNum) {
        console.log("Visualizer Handler: enqueueEvent(" + event + ',' + type + ',' + name + ',' + value + ',' + action + ',' + originADT + ',' + lineNum + ')');
        this.eventQueue.push([event, name, type, value, action, originADT, lineNum]);
    };

    //Pushes a new Entity onto the list
    VisualizerHandler.prototype.NewEntity = function(name, type, value, action, originADT) {
        console.log("Visualizer Handler: newEntity(" + name + ',' + type + ',' + value + ',' + action + ',' + originADT + ')');
        this.entities.push(this.getNewEntity(name,type,value, action, originADT));
        this.arrangeEntities();
    };

    //Updates the value of an Entity
    VisualizerHandler.prototype.UpdateEntity = function(name, value, action, originADT) {
        console.log("Visualizer Handler: updateEntity(" + name + ',' + value + ')');
        for (var i = 0; i < this.entities.length; i++){
            if (this.entities[i] != null && this.entities[i].name == name){
                this.entities[i].value = value;
                this.entities[i].update(action, originADT);
            }
        }
    };

    //Deletes all Entities
    VisualizerHandler.prototype.DeleteAll = function(string) {
        console.log("Visualizer Handler: DeleteAll()");
        this.paper.clear();
        this.paper.text(this.HBORDER, this.VBORDER, "primitives:").attr({"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
        this.paper.path("M " + this.HBORDER + "," + (this.VBORDER + this.FONT_HEIGHT) + " L " + (this.HBORDER + 200) + "," + (this.VBORDER + this.FONT_HEIGHT));

        this.paper.text(this.HBORDER, this.ADT_SECTION_TEXT_Y, "data structures:").attr({"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
        this.paper.path("M " + this.HBORDER + "," + (this.ADT_SECTION_TEXT_Y + this.FONT_HEIGHT) + " L " + (this.HBORDER + 200) + "," + (this.ADT_SECTION_TEXT_Y + this.FONT_HEIGHT));
        
        this.entities = [];
        this.eventQueue = [];
        this.symbolTable = null;
        this.date = new Date();
        this.delay = this.date.getTime();
        if (this.codeboxPaper != null) {
            this.codeboxPaper.remove();
        }
    }

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
    VisualizerHandler.prototype.getNewEntity = function(name, type, value, action, originADT) {
        switch(type){
        case "int":
            return new Primitive(this.paper,name,type,value,this);
        case "String":
            return new Primitive(this.paper,name,type,value,this);
        case "float":
            return new Primitive(this.paper,name,type,value,this);
        case "bool":
            return new Primitive(this.paper,name,type,value,this);
        case "List<Integer>":
            return new List(this.paper,name,type,value, this);
        //and more cases....
        default:
            console.log("Unknown type for newEntity: " + className);
            return;
        }
    };
    // from Crockford Javascript the good parts
    Array.matrix = function(numrows, numcols, initial) {
        var arr = [];
        for (var i = 0; i < numrows; ++i) {
            var columns = [];
            for (var j = 0; j < numcols; ++j) {
                columns[j] = initial;
            }
            arr[i] = columns;
        }
        return arr;
    }
    
    //Arranges entities
    VisualizerHandler.prototype.arrangeEntities = function() {
        this.arrangePrimitives();
        this.arrangeADTs();
        return;
    }

    //Arranges primitives
    VisualizerHandler.prototype.arrangePrimitives = function() {
        var curX = this.HBORDER;
        var curY = this.PRIMITIVE_SECTION_Y;

        var k = 0;
        for (var i = 0; i < this.entities.length; i++){ 
            var j = 0;
            while (j < this.PRIMITIVE_COL_LEN) {
                // ensure entity is a primitive that is allowed to be [re]arranged
                if (this.isPrimitive(this.entities[i])){
                    if (this.entities[i].dragged == false) { 
                        
                        if (this.entities[i].x != curX || this.entities[i].y != curY) {
                            curX = k*this.PRIMITIVE_COLUMNWIDTH+this.HBORDER, curY = j*this.FONT_HEIGHT*1.7+this.PRIMITIVE_SECTION_Y;
                            console.log("Confirmed primitive on k, " + 0 + ", and entity, " + i + ", is " + this.entities[i].name)
                            if (this.primitiveArray[k][j] == 0) {
                                //check and see if this is a new entity and move it accordingly
                                console.log("curX " + curX + " and curY " + curY);

                                //this.primitiveArray[k].push(this.entities[i]);

                                this.primitiveArray[k][j] = this.entities[i].name;
                                console.log(this.primitiveArray[k][j]);
                                if (this.entities[i].x == 0){
                                    this.entities[i].create(curX, curY);
                                }else{
                                    //set former index to null before moving
                                    //var tempX = this.entities[i].x;
                                    //var tempY = this.entities[i].y;
                                    this.entities[i].move(curX, curY);
                                        

                                    //// determine which spot was vacated and set to null
                                    //var tempJ = (tempX-this.HBORDER) / this.PRIMITIVE_COLUMNWIDTH;
                                    //var tempK = (tempY - this.PRIMITIVE_SECTION_Y) / this.FONT_HEIGHT
                                    //this.primitiveArray[tempJ][(tempK];
                                }

                                // indicate that the newly filled coordinate is occupied

                            }
                        }    
                    }
                }
                    //reset the while loop and increment k if there are still entities to arrange
                    if (i == this.entities.length - 2) {
                        if  (j == this.PRIMITIVE_COL_LEN-1){
                            k += 1;
                        }
                    }
                    j += 1;
            }
        }
    };

    //Arranges primitives
    VisualizerHandler.prototype.arrangeADTs = function() {
        var curX = this.VBORDER, curY = this.ADT_SECTION_Y;

        for (var i = 0; i < this.entities.length; i++){
            if (!this.isPrimitive(this.entities[i])){
                if (this.entities[i].x != curX) {
                    //check and see if this is a new entity. if so, fade it in. if not, move it
                    if (this.entities[i].x == 0){
                        this.entities[i].create(curX, curY);
                    }else{
                        this.entities[i].move(curX, curY);
                    }
                }
                curX +=  this.entities[i].WIDTH*1.2;
            }
        }
    }

    //Returns whether or not the Entity is a primitive
    VisualizerHandler.prototype.isPrimitive = function(entity) {
        switch(entity.type){
            case "int":
                return true;
            case "String":
                return true;
            case "float":
                return true;
            case "bool":
                return true;
            case "Stack<Integer>":
                return false;
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
        return (50 + this.delay - this.date.getTime());
    }

});