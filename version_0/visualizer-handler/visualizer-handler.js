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
        this.animSpeed = 1;

        //define constants
        this.PRIMITIVE_NUM_COLS= 8;
        this.PRIMITIVE_COL_LEN = 4;
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
        this.NEXT_PRIM_X = -1;
        this.NEXT_PRIM_Y = 0;

        //Positional 2D arrays
        this.primitiveArray = Array.matrix(this.PRIMITIVE_COL_LEN, this.PRIMITIVE_NUM_COLS, 0);
        this.adtArray = [[]];

        //drawing basic stuff on the paper: the sections
        this.paper = Raphael("vis_paper", 1000,1000);
        this.paper.text(this.HBORDER, this.VBORDER, "Primitives:").attr({"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
        this.paper.path("M " + this.HBORDER + "," + (this.VBORDER + this.FONT_HEIGHT) + " L " + (this.HBORDER + 200) + "," + (this.VBORDER + this.FONT_HEIGHT));

        this.paper.text(this.HBORDER, this.ADT_SECTION_TEXT_Y, "Data Structures:").attr({"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
        this.paper.path("M " + this.HBORDER + "," + (this.ADT_SECTION_TEXT_Y + this.FONT_HEIGHT) + " L " + (this.HBORDER + 200) + "," + (this.ADT_SECTION_TEXT_Y + this.FONT_HEIGHT));

        this.codeboxPaper = null;        
        
        // Keep a count of all ADT types to determine positioning
        // There are three categories: vertADT is stacks, hoADT are lists/queues (horizontally oriented), and blobADT is graphs and dicts
        this.vertADT_count = -1;
        this.hoADT_count = -1;
        this.blobADT_count = -1;

        return this;
    }

    VisualizerHandler.prototype.highlightLine = function(lineNumber, color) {
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
        var fontSize = $("#user_textbox").css('font-size');
        var os = navigator.platform;
        if (os == 'MacIntel') {
            var lineHeight = Math.floor(parseInt(fontSize.replace('px','')) * 1.2);
        }
        else if (os == 'Win32') {
            var lineHeight = Math.floor(parseInt(fontSize.replace('px','')) * 1.3);
        }
        else {
            var lineHeight = Math.floor(parseInt(fontSize.replace('px','')) * 1.2);
        }
        var highlight = this.codeboxPaper.rect(0,3+(lineHeight*lineNumber),w,lineHeight);
        highlight.attr("fill", color);
        highlight.attr("fill-opacity", .2);
        highlight.attr("stroke-width", 0);
    }

    VisualizerHandler.prototype.displayError = function(error) {
        //console.log(error);
        this.paper.text(this.HBORDER, this.ADT_SECTION_TEXT_Y+50, "Error: " + error).attr({"font-family": "times", "font-size": this.FONT_SIZE + 8, "stroke" : "red", 'text-anchor': 'start'});
    };

    VisualizerHandler.prototype.goForthAll = function() {
        //console.log("Visualizer Handler: goForthAll()");
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
                //console.log('unrecognized event: ' + curEvent[0]);
            }
        }
    };

    // Trying to get play to operate the same as step. This didn't work...
    VisualizerHandler.prototype.goForthAllNew = function() {
        //console.log("Visualizer Handler: goForthAllNew()");

        while (this.eventQueue.length > 0){
            this.goForthOnce();
            this.setDelay(10);
        }
    };

    
    VisualizerHandler.prototype.goForthOnce = function() {
        //console.log("Visualizer Handler: goForthOnce() ");
        if (this.eventQueue.length > 0) {
            curEvent = this.eventQueue.shift();
            //console.log("CUR5: " + curEvent[5]);
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
                //console.log('unrecognized event: ' + curEvent[0]);
            }
            return true;
        }
        return false;
    };
    
    //Enqueue an event onto the event queue
    VisualizerHandler.prototype.enqueueEvent = function(event, type, name, value, action, originADT, lineNum) {
        //console.log("Visualizer Handler: enqueueEvent(" + event + ',' + type + ',' + name + ',' + value + ',' + action + ',' + originADT + ',' + lineNum + ')');
        this.eventQueue.push([event, name, type, value, action, originADT, lineNum]);
        this.ClearAnonymous();
    };

    //Pushes a new Entity onto the list
    VisualizerHandler.prototype.NewEntity = function(name, type, value, action, originADT) {
        //console.log("Visualizer Handler: newEntity("+ name + ',' + type + ',' + value + ',' + action + ',' + originADT + ')');
        
        if (originADT == null){
            this.ClearAnonymous();
        }

        this.entities.push(this.getNewEntity(name,type,value, action, originADT));
        this.arrangeEntities();
    };

    //Updates the value of an Entity
    VisualizerHandler.prototype.UpdateEntity = function(name, value, action, originADT) {
        //console.log("Visualizer Handler: updateEntity(" + name + ',' + value + ', ' +  action + ', ' + originADT + ')');

        if (originADT == null){
            this.ClearAnonymous();
        }

        for (var i = 0; i < this.entities.length; i++){
            if (this.entities[i] != null && this.entities[i].name == name){
                var oldVal = this.entities[i].value;i
                this.entities[i].oldValue = oldVal;
                this.entities[i].value = value;
                this.entities[i].update(action, originADT);
            }
        }
    };

    //Deletes the named Entity
    VisualizerHandler.prototype.DeleteEntity = function(name) {
        //console.log("Visualizer Handler: deleteEntity(" + name + ")");
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

        // manage remaining visuals accordingly
        this.ClearAnonymous();
        this.reArrangePrimitives(start);
    };


    //Grabs the anonymous variable from the named entity, moves it to the proper location
    VisualizerHandler.prototype.getAnonymousVariable = function(name, destX, destY){
        var anon = null;
        for (var i = 0; i < this.entities.length; i++){
            if (this.entities[i].name == name){
                //it's an ADT
                if (!this.isPrimitive(this.entities[i])){
                    anon = this.entities[i].anon[0];
                //it's a primitive, create a new DU
                }else{
                    anon = this.entities[i].createAnonymous();
                }
            }
        }

        //now move the anon to the new location
        if (anon != null){
            var difX, difY;
            anon.moveTo(destX,destY,this.setDelay(500),this.getAnimTime(500));
            this.setDelay(this.getAnimTime(500));
            anon.fastDestroy();
        }
    }


    //Clear the anonymous variables of ADTs
    VisualizerHandler.prototype.ClearAnonymous = function(){
        for (var i = 0; i < this.entities.length; i++){
            if (!this.isPrimitive(this.entities[i])){
                var adt = this.entities[i];
                //if it has an anonymous variable, clear it
				if (adt.anon) {
                if (adt.anon.length != 0){
                    for (var ii = 0; ii < adt.anon.length; ii++){
                        adt.anon[ii].fastDestroy();
                    }
                    adt.anon = [];
                }
				}
            }
        }
    }

    //Resets certain values (i.e. if screen is cleared)
    VisualizerHandler.prototype.ResetValues = function() {
        this.hoADT_count = -1;
        this.vertADT_count = -1;
        this.blobADT_count = -1;
        this.primitiveArray = Array.matrix(this.PRIMITIVE_COL_LEN, this.PRIMITIVE_NUM_COLS, 0);

    }

    //Deletes all Entities
    VisualizerHandler.prototype.DeleteAll = function(string) {
        //console.log("Visualizer Handler: DeleteAll()");
        this.paper.clear();
        this.paper.text(this.HBORDER, this.VBORDER, "Primitives:").attr({"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
        this.paper.path("M " + this.HBORDER + "," + (this.VBORDER + this.FONT_HEIGHT) + " L " + (this.HBORDER + 200) + "," + (this.VBORDER + this.FONT_HEIGHT));

        this.paper.text(this.HBORDER, this.ADT_SECTION_TEXT_Y, "Data Structures:").attr({"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
        this.paper.path("M " + this.HBORDER + "," + (this.ADT_SECTION_TEXT_Y + this.FONT_HEIGHT) + " L " + (this.HBORDER + 200) + "," + (this.ADT_SECTION_TEXT_Y + this.FONT_HEIGHT));
        
        this.entities = [];
        this.eventQueue = [];
        this.symbolTable = null;
        this.date = new Date();
        //this.delay = this.date.getTime();
        if (this.codeboxPaper != null) {
            this.codeboxPaper.remove();
        }
    }


    
    //Returns a new Entity of the given type
    VisualizerHandler.prototype.getNewEntity = function(name, type, value, action, originADT) {

        switch(type.split("<")[0]){
            case "int":
                return new Primitive(this.paper,name,type,value,this,originADT);
            case "String":
                return new Primitive(this.paper,name,type,value,this,originADT);
            case "float":
                return new Primitive(this.paper,name,type,value,this,originADT);
            case "boolean":
                return new Primitive(this.paper,name,type,value,this,originADT);
            case "List":
                return new List(this.paper,name,type,value, this);
            case "Queue":
                return new Queue(this.paper,name,type,value, this);
            case "PriorityQueue":
                return new Queue(this.paper,name,type,value, this);
            case "Stack":
                return new Stack(this.paper,name,type,value, this);
            case "Dictionary":
                return new Dictionary(this.paper,name,type,value, this);
            case "Graph":
                return new Graph(this.paper,name,type,value, this);
            case "WeightedGraph":
                return new WeightedGraph(this.paper,name,type,value,this);
            case "Tree":
                return new Tree(this.paper,name,value,this);
            default:
                //console.log("Unknown type for newEntity: " + type);
                return;
        }
    };
    // from Crockford Javascript the good parts
    // this matrix function is called to create a system for storing primitives
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

    // Gives the next available position to draw a primitive entity (arrangeADTs helper function)
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
        //console.log("Visualizer Handler: arrangeEntities()")
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

                    //console.log(this.NEXT_PRIM_X, this.NEXT_PRIM_Y)
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
                if (this.entities[i].drawn == false) {
                    this.nextPrimitivePosition();

                    // keep generating new positions until we find one that isnt already taken
                    this.NEXT_PRIM_X = 0;
                    this.NEXT_PRIM_Y = 0;
                    while (this.primitiveArray[this.NEXT_PRIM_Y][this.NEXT_PRIM_X] != 0) {
                        this.nextPrimitivePosition();
                    }

                    // claim this position in the matrix
                    this.primitiveArray[this.NEXT_PRIM_Y][this.NEXT_PRIM_X] = this.entities[i];
                    // and draw the primitive there
                    newX = this.NEXT_PRIM_X * this.PRIMITIVE_COLUMNWIDTH + this.HBORDER;
                    newY = this.NEXT_PRIM_Y*this.FONT_HEIGHT*1.7 + this.PRIMITIVE_SECTION_Y;
                    this.entities[i].create(newX, newY);
                    this.entities[i].drawn = true;
                }
            }
        }
    };

    //Arrange ADT helper function. Used to move previously existing ADTs
    VisualizerHandler.prototype.shiftADT = function(entities, type) {
        //console.log("Visualizer Handler: shiftADT()")

        var element = document.getElementById('vis_paper');
        var paper_width = document.defaultView.getComputedStyle(element,null).getPropertyValue("width");
        var paper_height = document.defaultView.getComputedStyle(element,null).getPropertyValue("height");

        var curX, curY;

        // note that it loops through a local variable that contains ADTs already drawn
        for (var i = 0; i < entities.length; i++){
            if (!this.isPrimitive(entities[i])){

                // switch on things already drawn but check the type of the ADT that caused the shift
                switch(entities[i].type.split("<")[0]){
                    
                    //the horizontalADT category
                    case "List":
                    case "Queue":
                    case "PriorityQueue":
                        //increment the ADT category count
                        if (type == "Stack"){
                            curX = entities[i].x + 90;
                        } else {
                            curX = entities[i].x;
                        }

                        curY = entities[i].y;
                        entities[i].move(curX, curY);
                        break;

                    // Stacks won't ever shift, this is just here so stacks don't feel left out
                    case "Stack":
                        break;

                    // the "blobADT" category
                    case "Graph":
                    case "WeightedGraph":
                    case "Dictionary":
                    case "Tree":
                        if (type == "Stack"){
                            curX = entities[i].x + 90;
                            curY = entities[i].y;
                        } else {
                            curX = entities[i].x
                            curY = entities[i].y + 120;
                        }
                        entities[i].move(curX, curY);
                        break;
                    
                    default:
                        //console.log("Unknown ADT type: " + entities[i].type);
                        return; 
                }
            }
        }
    };



    //Arranges ADT
    VisualizerHandler.prototype.arrangeADTs = function() {
        var element = document.getElementById('vis_paper');
        var paper_width = document.defaultView.getComputedStyle(element,null).getPropertyValue("width");
        var paper_height = document.defaultView.getComputedStyle(element,null).getPropertyValue("height");

        var curX = this.VBORDER, curY = this.ADT_SECTION_Y;

        for (var i = 0; i < this.entities.length; i++){
            if (!this.isPrimitive(this.entities[i])){
                if (this.entities[i].x != curX) {

                    // check ADT type to determine general positioning
                    // (There are 3 categories of ADT shape: vertical, horizontal, blob.)
                    switch(this.entities[i].type.split("<")[0]){
                        case "List":
                        case "Queue":
                        case "PriorityQueue":
                            // shift an existing blobADTs
                            if (this.blobADT_count > -1) {
                                if (!this.entities[i].shiftPrev) {
                                    this.shiftADT(this.entities.slice(0,i), this.entities[i].type.split("<")[0]);
                                    this.entities[i].shiftPrev = true;
                                }
                            }

                            //increment the horizontal ADT category count
                            if (this.entities[i].x == 0)
                                this.hoADT_count += 1;
                            curX = this.VBORDER + (90)*(1+this.vertADT_count);
                            curY = this.ADT_SECTION_Y + (this.entities[i].HEIGHT + 60 + this.entities[i].FONT_SIZE)*this.hoADT_count;
                            break;

                        case "Stack":
                            // shift any existing ho/blobADTs
                            if (this.hoADT_count > -1 || this.blobADT_count > -1) {
                                if (!this.entities[i].shiftPrev) {
                                    this.shiftADT(this.entities.slice(0,i), this.entities[i].type.split("<")[0]);
                                    this.entities[i].shiftPrev = true;
                                }
                            }

                            //increment the stack/vertical category count
                            if (this.entities[i].x == 0) {
                                this.vertADT_count += 1;
                                curX = this.VBORDER + (this.entities[i].WIDTH+30)*this.vertADT_count;
                                curY = this.ADT_SECTION_Y;
                            }
                            break;

                        case "Graph":
                        case "WeightedGraph":
                        case "Dictionary":
                        case "Tree":
                            // shift any existing blobADTs
                            if (this.blobADT_count > -1) {
                                if (!this.entities[i].shiftPrev) {
                                    this.shiftADT(this.entities.slice(0,i), this.entities[i].type.split("<")[0]);
                                    this.entities[i].shiftPrev = true;
                                }
                            }

                            // increment graph/dict/blob count
                            if (this.entities[i].x == 0)
                                this.blobADT_count += 1;

                            curX = this.VBORDER + (90)*(1+this.vertADT_count);
                            curY = this.ADT_SECTION_Y + (this.entities[i].HEIGHT + 10 + this.entities[i].FONT_SIZE)*(1+this.hoADT_count+this.blobADT_count);
                            break;
                        
                        default:
                            //console.log("Unknown ADT type: " + this.entities[i].type);
                            return; 
                    }

                    //check and see if this is a new entity. if so, fade it in. if not, move it
                    if (!this.entities[i].drawn) {
                        this.entities[i].create(curX, curY);
                        this.entities[i].drawn = true;
                    }
                }
            }
        }
    };

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


    //Returns the animation times the current speed
    VisualizerHandler.prototype.getAnimTime = function(t) {
        return t*this.animSpeed;
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
        var startDelay = this.delay - this.date.getTime();
        this.delay += t*this.animSpeed;
        return startDelay;
    }
});