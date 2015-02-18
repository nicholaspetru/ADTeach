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

        //define constants
        this.PRIMITIVE_NUM_COLS= 8;
        this.PRIMITIVE_COL_LEN = 5;
        this.PRIMITIVE_COLUMNWIDTH = 140;
        this.ADT_COLUMNWIDTH = 140;
        this.PRIMITIVE_SECTION_HEIGHT = 100;
        this.HBORDER = 10;
        this.VBORDER = 12;
        this.FONT_HEIGHT = 12;
        this.FONT_SIZE = 18;
        this.PRIMITIVE_SECTION_Y = this.FONT_HEIGHT + this.VBORDER;
        this.ADT_SECTION_TEXT_Y = this.PRIMITIVE_SECTION_HEIGHT + this.PRIMITIVE_SECTION_Y;
        this.ADT_SECTION_Y = this.PRIMITIVE_SECTION_HEIGHT + this.PRIMITIVE_SECTION_Y + this.FONT_HEIGHT + 12 + 30;
        this.NEXT_PRIM_X = -1;
        this.NEXT_PRIM_Y = 0;
        //Positional 2D arrays
        this.primitiveArray = Array.matrix(this.PRIMITIVE_COL_LEN, this.PRIMITIVE_NUM_COLS, 0);
        this.adtArray = [[]];

        //drawing basic stuff on the paper: the sections
        this.paper = Raphael("vis_paper", 1000,1000);
        this.paper.text(this.HBORDER, this.VBORDER, "primitives:").attr({"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
        this.paper.path("M " + this.HBORDER + "," + (this.VBORDER + this.FONT_HEIGHT) + " L " + (this.HBORDER + 200) + "," + (this.VBORDER + this.FONT_HEIGHT));

        this.paper.text(this.HBORDER, this.ADT_SECTION_TEXT_Y, "data structures:").attr({"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
        this.paper.path("M " + this.HBORDER + "," + (this.ADT_SECTION_TEXT_Y + this.FONT_HEIGHT) + " L " + (this.HBORDER + 200) + "," + (this.ADT_SECTION_TEXT_Y + this.FONT_HEIGHT));

        this.codeboxPaper = null;        
        
        // Keep a count of all ADT types to determine positioning
        // There are three categories: vertADT is stacks, hoADT are lists/queues (horizontally oriented), and blobADT is graphs and dicts
        this.vertADT_count = -1;
        this.hoADT_count = -1;
        this.blobADT_count = -1;


        //Testing new primitive system
        
        /*
        this.enqueueEvent("new", "int", "a", 1, "int");
        this.enqueueEvent("new", "int", "b", 2, "int");
        this.enqueueEvent("new", "int", "c", 3, "int");
        this.enqueueEvent("new", "int", "d", 4, "int");
        this.enqueueEvent("update", "int", "c", 10, "int");
        this.enqueueEvent("update", "int", "d", 11, "int");
        this.enqueueEvent("new", "int", "e", 5, "int");
        this.enqueueEvent("delete", "int", "b", 2, "int");
        this.enqueueEvent("delete", "int", "e", 5, "int");
        this.enqueueEvent("new", "int", "f", 6, "int");
        this.enqueueEvent("delete", "int", "f", 6, "int");
        this.enqueueEvent("new", "int", "g", 7, "int");
        this.enqueueEvent("delete", "int", "e", 5, "int");   
        this.enqueueEvent("new", "int", "h", 8, "int");
        this.enqueueEvent("new", "int", "i", 9, "int");
        */

        return this;
    }

    VisualizerHandler.prototype.highlightLine = function(lineNumber, color) {
        console.log("Visualizer Handler: highlightLine(" + lineNumber + ")");
        //paper for highlight line
        if (this.codeboxPaper != null) {
            this.codeboxPaper.remove();
        }
        var xpos = $("#code_env").position().left - ($("#code_env").position().left - $("#user_textbox").position().left);
        var ypos = $("#code_env").position().top - ($("#code_env").position().top - $("#user_textbox").position().top);
        var w = $("#code_env").width() - ($("#code_env").width() - $("#user_textbox").width());
        var h = $("#code_env").height() - ($("#code_env").height() - $("#user_textbox").height());

        //console.log("xpos: " + xpos + " width: " + w);
        this.codeboxPaper = Raphael(xpos, ypos, w, h);

        var highlight = this.codeboxPaper.rect(0,3+(13*lineNumber),w,13);
        highlight.attr("fill", color);
        highlight.attr("fill-opacity", .2);
        highlight.attr("stroke-width", 0);
    }

    //TODO: Dudes, this is just not the right way to do this.
    //We gotta fix this up, so that it waits to do a new event
    //Dequeue all the events from the event queue, execute them, and render
    VisualizerHandler.prototype.goForthAll = function() {
        console.log("Visualizer Handler: goForthAll()");
        while (this.eventQueue.length > 0) {
            curEvent = this.eventQueue.shift();
            this.highlightLine(curEvent[6], "yellow");
            if (curEvent[0] == 'new') {
                this.NewEntity(curEvent[1], curEvent[2], curEvent[3], curEvent[4], curEvent[5]);
            }
            else if (curEvent[0] == 'update') {
                this.UpdateEntity(curEvent[1], curEvent[3], curEvent[4], curEvent[5]);
            }
            else if (curEvent[0] == 'delete') {
                this.DeleteEntity(curEvent[1]);
            }
            else {
                console.log('unrecognized event: ' + curEvent[0]);
            }
        }
    };
    
    VisualizerHandler.prototype.goForthOnce = function() {
        console.log("Visualizer Handler: goForthOnce() ");
        if (this.eventQueue.length > 0) {
            curEvent = this.eventQueue.shift();
            console.log("CUR5: " + curEvent[5]);
            this.highlightLine(curEvent[6], "yellow");
            if (curEvent[0] == 'new') {
                this.NewEntity(curEvent[1], curEvent[2], curEvent[3], curEvent[4], curEvent[5]);
            }
            else if (curEvent[0] == 'update') {
                this.UpdateEntity(curEvent[1], curEvent[3], curEvent[4], curEvent[5]);
            }
            else if (curEvent[0] == 'delete') {
                this.DeleteEntity(curEvent[1]);
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
        this.ClearAnonymous();
    };

    //Pushes a new Entity onto the list
    VisualizerHandler.prototype.NewEntity = function(name, type, value, action, originADT) {
        console.log("Visualizer Handler: newEntity("+ name + ',' + type + ',' + value + ',' + action + ',' + originADT + ')');
        
        if (originADT == null){
            this.ClearAnonymous();
        }

        this.entities.push(this.getNewEntity(name,type,value, action, originADT));

        this.arrangeEntities();
        //this.ClearAnonymous();
    };

    //Updates the value of an Entity
    VisualizerHandler.prototype.UpdateEntity = function(name, value, action, originADT) {
        console.log("Visualizer Handler: updateEntity(" + name + ',' + value + ', ' +  action + ', ' + originADT + ')');

        if (originADT == null){
            this.ClearAnonymous();
        }

        for (var i = 0; i < this.entities.length; i++){
            if (this.entities[i] != null && this.entities[i].name == name){
                this.entities[i].value = value;
                this.entities[i].update(action, originADT);
            }
        }
    };

    //Deletes the named Entity
    VisualizerHandler.prototype.DeleteEntity = function(name) {
        console.log("Visualizer Handler: deleteEntity(" + name + ")");
        for (var i = 0; i < this.entities.length; i++){
            if (this.entities[i] != null && this.entities[i].name == name){
                this.entities[i].destroy();
                var start = i;

                // reset respective matrix position to 0 for arranging purposes
                var delX = (this.entities[i].x-this.HBORDER)/this.PRIMITIVE_COLUMNWIDTH;
                var delY = (this.entities[i].y-this.PRIMITIVE_SECTION_Y)/(this.FONT_HEIGHT*1.7);
                this.primitiveArray[Math.round(delY)][Math.round(delX)] = 0;  
                this.entities.splice(i,1);
            }
        }
        this.ClearAnonymous();
        this.reArrangePrimitives(start);
    };


    //Grabs the anonymous variable from the named entity, moves it to the proper location
    VisualizerHandler.prototype.getAnonymousVariable = function(name, destX, destY){
        this.getDelay();
        var _t = this;
        setTimeout(function(){
            var anon = null;
            for (var i = 0; i < _t.entities.length; i++){
                if (_t.entities[i].name == name){
                    //it's an ADT
                    if (!_t.isPrimitive(_t.entities[i])){
                        anon = _t.entities[i].anon;
                    //it's a primitive, create a new DU
                    }else{
                        anon = _t.entities[i].createAnonymous();
                    }
                }
            }

            //now move the anon to the new location
            if (anon != null){
                var difX, difY;
                difX = destX - anon.x;
                difY = destY - anon.y;
                anon.move(difX,difY,0,500);
                anon.fadeOut(750);
            }
        },(this.delay - this.date.getTime()));

    }


    //Clear the anonymous variables of ADTs
    VisualizerHandler.prototype.ClearAnonymous = function(){
        for (var i = 0; i < this.entities.length; i++){
            if (!this.isPrimitive(this.entities[i])){
                var adt = this.entities[i];
                //if it has an anonymous variable, clear it
                if (adt.anon != null ){
                    adt.anon.destroy();
                    adt.anon = null;
                }
            }
        }
    }

    //Resets certain values
    VisualizerHandler.prototype.ResetValues = function() {
        this.hoADT_count = -1;
        this.vertADT_count = -1;
        this.blobADT_count = -1;

    }

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


    
    //Returns a new Entity of the given type
    VisualizerHandler.prototype.getNewEntity = function(name, type, value, action, originADT) {
        switch(type.split("<")[0]){
            case "int":
                return new Primitive(this.paper,name,type,value,this);
            case "String":
                return new Primitive(this.paper,name,type,value,this);
            case "float":
                return new Primitive(this.paper,name,type,value,this);
            case "boolean":
                return new Primitive(this.paper,name,type,value,this);
            case "List":
                return new List(this.paper,name,type,value, this);
            case "Queue":
                return new Queue(this.paper,name,type,value, this);
            case "Stack":
                return new Stack(this.paper,name,type,value, this);
            //and more cases....
            default:
                console.log("Unknown type for newEntity: " + type);
                return;
        }
    };
    // from Crockford Javascript the good parts
    Array.matrix = function(numrows, numcols, initial) {
        var arr = [];
        for (var i = 0; i < numcols; ++i) {
            var columns = [];
            for (var j = 0; j < numrows; ++j) {
                columns[j] = initial;
            }
            arr[i] = columns;
        }
        return arr;
    }

    // Gives the next available position to draw a primitive entity
    VisualizerHandler.prototype.nextPrimitivePosition = function() {
        if (this.NEXT_PRIM_Y + 1 == this.PRIMITIVE_COL_LEN) {
            this.NEXT_PRIM_Y = 0;
            this.NEXT_PRIM_X += 1;
        }
        else {
            this.NEXT_PRIM_Y += 1;
        }
    }
    
    //Arranges entities
    VisualizerHandler.prototype.arrangeEntities = function() {
        console.log("Visualizer Handler: arrangeEntities()")
        this.arrangePrimitives();
        this.arrangeADTs();
        return;
    }

    // RE-arrange primitives when entity destroyed
    VisualizerHandler.prototype.reArrangePrimitives = function (start) {
        this.NEXT_PRIM_Y = 0;
        this.NEXT_PRIM_X = -1;
        for (var i = start; i < this.entities.length; i++){ 
            if (this.isPrimitive(this.entities[i])) {
                if (this.entities[i].drawn == true) {
                    this.nextPrimitivePosition();

                    while (this.primitiveArray[this.NEXT_PRIM_Y][this.NEXT_PRIM_X] != 0) {
                        this.nextPrimitivePosition();
                    }

                    // reset respective matrix position to 0 for arranging purposes
                    var delX = Math.round((this.entities[i].x-this.HBORDER)/this.PRIMITIVE_COLUMNWIDTH);
                    var delY = Math.round((this.entities[i].y-this.PRIMITIVE_SECTION_Y)/(this.FONT_HEIGHT*1.7));
                    this.primitiveArray[delY][delX] = 0;

                    this.primitiveArray[this.NEXT_PRIM_Y][this.NEXT_PRIM_X] = this.entities[i];

                    console.log(this.NEXT_PRIM_X, this.NEXT_PRIM_Y)
                    var difX = (this.NEXT_PRIM_X * this.PRIMITIVE_COLUMNWIDTH + this.HBORDER) - this.entities[i].x;
                    var difY = (this.NEXT_PRIM_Y*this.FONT_HEIGHT*1.7 + this.PRIMITIVE_SECTION_Y) - this.entities[i].y;
                    this.entities[i].move(difX, difY);
                }
            }
        }
    };

    //Arranges primitives
    VisualizerHandler.prototype.arrangePrimitives = function() {
        var newX = this.HBORDER;
        var newY = this.PRIMITIVE_SECTION_Y;

        for (var i = 0; i < this.entities.length; i++){ 
            if (this.isPrimitive(this.entities[i])){
                if (this.entities[i].dragged == false && this.entities[i].drawn == false) {
                    this.nextPrimitivePosition();
                    // keep generating new positions until we find one that isnt already taken
                    this.NEXT_PRIM_X = 0;
                    this.NEXT_PRIM_Y = 0;
                    while (this.primitiveArray[this.NEXT_PRIM_Y][this.NEXT_PRIM_X] != 0) {
                        this.nextPrimitivePosition();
                    }

                    // claim this position
                    this.primitiveArray[this.NEXT_PRIM_Y][this.NEXT_PRIM_X] = this.entities[i];
                    // and draw the primitive there
                    newX = this.NEXT_PRIM_X * this.PRIMITIVE_COLUMNWIDTH + this.HBORDER;
                    newY = this.NEXT_PRIM_Y*this.FONT_HEIGHT*1.7 + this.PRIMITIVE_SECTION_Y;
                    this.entities[i].create(newX, newY);
                    this.entities[i].drawn = true;
                }
                // else if this.entities[i].dragged == true
                // move the primitive <-- i don't think we want to move it if it's been dragged
            }
        }
    };

    //Arrange ADT helper function
    VisualizerHandler.prototype.shiftADT = function(entities) {
        console.log("Visualizer Handler: shiftADT()")

        var element = document.getElementById('vis_paper');
        var paper_width = document.defaultView.getComputedStyle(element,null).getPropertyValue("width");
        var paper_height = document.defaultView.getComputedStyle(element,null).getPropertyValue("height");

        var curX, curY;

        for (var i = 0; i < entities.length; i++){
            if (!this.isPrimitive(entities[i])){

                // check ADT type to determine general positioning
                switch(entities[i].type.split("<")[0]){
                    // "fall-through" case for horizontal ADTS; to right of vert, and above blob
                    case "List":
                    case "Queue":
                    case "PriorityQueue":
                        //increment the ADT category count
                        if (entities[i].x == 0) {
                            curX = this.VBORDER + (90)*(this.vertADT_count+1);
                            curY = this.ADT_SECTION_Y + (entities[i].HEIGHT + 12 + entities[i].FONT_SIZE)*this.hoADT_count;
                        }
                        break;

                    // Stack is only vertical ADT (?); starts on bottom left
                    case "Stack":
                        // bottom left TODO: need to make it so that if a stack is drawn, all existing non stack adts must move
                        //increment the ADT category count
                        if (entities[i].x == 0)
                            this.vertADT_count += 1;
                        //if (this.hoADT_count > -1 || this.blobADT_count > -1)
                        //   i = 0;
                        curX = this.VBORDER + (entities[i].WIDTH+20)*this.vertADT_count;
                        curY = parseInt(paper_height, 10) - entities[i].HEIGHT-entities[i].FONT_SIZE-6;

                    
                        break;

                    //fall-through case for 'blob' ADTs; to go right of stack and below horizontally oriented ADTs
                    case "Graph":
                    case "Dict":
                        // bottom right
                        this.blobADT_count += 1;
                        break;
                    
                    default:
                        console.log("Unknown ADT type: " + entities[i].type);
                        return; 
                }
                entities[i].move(entities[i].x-curX, entities[i].y-curY);
            }
        }
    };

    //Arranges ADT
    VisualizerHandler.prototype.arrangeADTs = function() {
        var element = document.getElementById('vis_paper');
        var paper_width = document.defaultView.getComputedStyle(element,null).getPropertyValue("width");
        var paper_height = document.defaultView.getComputedStyle(element,null).getPropertyValue("height");

        var curX = this.VBORDER, curY = this.ADT_SECTION_Y;
        //var curX = 0, curY = 0;

        for (var i = 0; i < this.entities.length; i++){
            if (!this.isPrimitive(this.entities[i])){
                if (this.entities[i].x != curX) {

                    console.log("Before " + this.entities[i].x + " and " + this.entities[i].y + " for " + this.entities[i].name)

                    // check ADT type to determine general positioning
                    switch(this.entities[i].type.split("<")[0]){
                        // "fall-through" case for horizontal ADTS; to right of vert, and above blob
                        case "List":
                        case "Queue":
                        case "PriorityQueue":
                            //increment the ADT category count
                            if (this.entities[i].x == 0)
                                this.hoADT_count += 1;
                            curX = this.VBORDER + (90)*(this.vertADT_count+1);
                            curY = this.ADT_SECTION_Y + (this.entities[i].HEIGHT + 12 + this.entities[i].FONT_SIZE)*this.hoADT_count;
                            console.log("curX: " + curX + " and curY: " + curY)
                            break;

                        // Stack is only vertical ADT (?); starts on bottom left
                        case "Stack":
                            // bottom left TODO: need to make it so that if a stack is drawn, all existing non stack adts must move
                            //increment the ADT category count
                            if (this.entities[i].x == 0)
                                this.vertADT_count += 1;
                            if (this.hoADT_count > -1 || this.blobADT_count > -1)
                                this.shiftADT(this.entities.slice(0,i));


                            curX = this.VBORDER + (this.entities[i].WIDTH+20)*this.vertADT_count;
                            curY = parseInt(paper_height, 10) - this.entities[i].HEIGHT-this.entities[i].FONT_SIZE-6;

                        
                            break;

                        //fall-through case for 'blob' ADTs; to go right of stack and below horizontally oriented ADTs
                        case "Graph":
                        case "Dict":
                            // bottom right
                            this.blobADT_count += 1;
                            break;
                        
                        default:
                            console.log("Unknown ADT type: " + this.entities[i].type);
                            return; 
                    }

                    console.log(this.vertADT_count)
                    //check and see if this is a new entity. if so, fade it in. if not, move it
                    if (this.entities[i].x == 0){
                        this.entities[i].create(curX, curY);
                    }else{
                        this.entities[i].move(this.entities[i].x-curX, this.entities[i].y-curY);
                    }
                    console.log("After " + this.entities[i].x + " and " + this.entities[i].y + " for " + this.entities[i].name)

                }
                //curX +=  this.entities[i].WIDTH*1.2;
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
            case "boolean":
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
        return (100 + this.delay - this.date.getTime());
    }
});