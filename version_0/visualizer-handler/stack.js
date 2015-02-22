//queue.js
//Represents a queue

$(document).ready(function () {
    
    Stack = function(paper,name,type,value,vishandler){
        this.paper = paper;
        this.VH = vishandler;
        this.name = name;
        this.type = type;
        this.value = value;

        //assign the position
        this.x = 0;
        this.y = 0;
        this.cur_length = 10;
        this.MAX_LENGTH = 10;
        this.FONT_SIZE = 15;
        this.DUNIT_WIDTH = 65*.85;
        this.DUNIT_HEIGHT = (45*.85)*.5;
        this.DUNIT_BUFFER = .2;
        this.setDimensions();

        //visual component
        this.myLabel = null;
        this.myFrame = null;
        this.vis = [];
        this.shiftPrev = false;
        this.drawn = false;

        //anonymous DU
        this.anon = null;
    }

    //BuildVisual is different for stacks, it adds all the visual components of the stack to an array
    //that is then animated piecewise
    Stack.prototype.buildVisual = function(){
        this.myLabel = this.paper.text(this.x, this.y + this.HEIGHT + 13, this.type.split("<")[0] + " " + this.name);
        this.myLabel.attr({"opacity": 0,"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});

        //new: scale the frame's length to the length of the list
        this.myFrame = this.paper.path("M " + (this.x) + ", " + this.y + " V " + (this.y + this.HEIGHT) + " H " + (this.x + this.WIDTH) + " V " + (this.y));
        this.myFrame.attr({"opacity": 0,"stroke": "black", "stroke-width": 2.25});

        //here's the visual component's representation of the content of the stack. the "data units"
        for (var i = 0; i < this.value.length; i++){
            this.vis.push(new DataUnit(this.paper,this.type,this.value[i], this.VH, this.x + (this.WIDTH - this.DUNIT_WIDTH)/2,
                                       this.y + this.HEIGHT  - this.DUNIT_HEIGHT - (this.DUNIT_HEIGHT*this.DUNIT_BUFFER) - (this.DUNIT_HEIGHT*(1 + this.DUNIT_BUFFER))*(i), this.DUNIT_WIDTH, this.DUNIT_HEIGHT, 0));
        }
        this.stretch();
    }

    //Sets the appropriate width and height for the Queue
    Stack.prototype.setDimensions = function() {
        //width and height refer to max width and height-- how much room this object takes up on the screen
        var min;
        if (this.value.length < 11)
            min = 10;
        else
            min = this.value.length;

        this.WIDTH = 65;
        if (this.HEIGHT != (this.DUNIT_HEIGHT*this.DUNIT_BUFFER*2) + (this.DUNIT_HEIGHT*(1 + this.DUNIT_BUFFER)*(min))){
            this.HEIGHT = (this.DUNIT_HEIGHT*this.DUNIT_BUFFER*2) + (this.DUNIT_HEIGHT*(1 + this.DUNIT_BUFFER)*(min));
            return true;
        }
        return false;
    }

    //Update the List
    Stack.prototype.update = function(action, originADT) {
        //strip the string and get the params from the "Action" str
        var split = action.split(".");

        //animate the change
        switch(split[0]){
            case "push":
                //check if there's an anonymous variable
                if (originADT != null){
                    this.VH.getAnonymousVariable(originADT, this.x + (this.WIDTH - this.DUNIT_WIDTH)/2, this.y - this.DUNIT_HEIGHT);
                }
                this.stretch();
                this.Add();
                break;
            case "populate":
                //erase old data
                for (var i = 0; i < this.vis.length; i++){
                    this.vis[i].destroy();
                }                
                this.vis = [];
                this.stretch();
                //create new data units to match the new dataset
                for (var i = 0; i < this.value.length; i++){
                    var newDU = new DataUnit(this.paper,this.type,this.value[i], this.VH,  this.x + (this.WIDTH - this.DUNIT_WIDTH)/2,
                                       this.y  + this.HEIGHT - this.DUNIT_HEIGHT- (this.DUNIT_HEIGHT*this.DUNIT_BUFFER) - (this.DUNIT_HEIGHT*(1 + this.DUNIT_BUFFER))*(i), this.DUNIT_WIDTH, this.DUNIT_HEIGHT, 0);
                    this.vis.push(newDU);
                    newDU.create();
                }
                break;
            case "pop":
                this.Remove();                
                this.stretch();
                break;
            case "clear":
                //erase old data
                for (var i = 0; i < this.vis.length; i++){
                    this.vis[i].destroy();
                }
                this.vis = [];
                this.stretch();
                break;
            case "peek":
                this.Get();
                break;
        }
    };


    /*
    ANIMATIONS
    */

    //Create visual primitve in the specific position
    Stack.prototype.create = function(newX, newY) {
        this.x = newX;
        this.y = newY;
        this.buildVisual();

        //get the delay for outside the loop
        var delay = this.VH.setDelay(500);

        //Fade in the label and frame
        var anim = Raphael.animation({opacity:1},this.VH.getAnimTime(500));
        this.myLabel.animate(anim.delay(delay));
        this.myFrame.animate(anim.delay(delay));
        for (var i = 0; i < this.vis.length; i++){
            this.vis[i].create();
        }
    };

    //Stretches the frame to accomadate the new length of the list
    Stack.prototype.stretch = function() {
        //variables for list
        var changed = this.setDimensions();
        var _t = this, _0 = this.x, _1 = this.y, _2 = this.y + this.HEIGHT, _3 = this.x+ this.WIDTH;
        
        if (changed){
            //in the timeout, create and assign the actual path
            setTimeout(function(){
                _t.myFrame.remove();
                _t.myFrame = _t.paper.path("M " + _0 + ", " + _1 + " V " + _2 + " H " + _3 + " V " + _1);
                _t.myFrame.attr({"opacity": 1,"stroke": "black", "stroke-width": 2.25});
            },(this.VH.delay - this.VH.date.getTime()));
        }
    };


    //Moves the visual primitve to the specific positon
    Stack.prototype.move = function(newX, newY) {
        var difX, difY;
        difX = newX - this.x;
        difY = newY - this.y;
        this.x = newX;
        this.y = newY;

        var delay = this.VH.setDelay(500);
        //Set timeout and move the data structure at the proper delay
        var _t = this;
        setTimeout(function(){
            _t.myLabel.animate({transform:'...t' + difX + ' ' + difY},500);
            _t.myFrame.animate({transform:'...t' + difX + ' ' + difY},500);

            //move the dataunits
            for (var i =0; i < _t.vis.length; i++){
                _t.vis[i].move(difX,difY,0,500);
            }
        },(this.VH.delay - this.VH.date.getTime()));

    };

    //Remove visual primitives
    Stack.prototype.destroy = function() {
        //get the delay for outside the loop
        var delay = this.VH.setDelay(1000);

        //Fade out the label and frame
        var anim = Raphael.animation({opacity:0},this.VH.getAnimTime(1000));
        this.myLabel.animate(anim.delay(delay));
        this.myFrame.animate(anim.delay(delay));
        for (var i = this.vis.length-1; i >= 0; i--){
            this.vis[i].fadeOut(delay);
        }
    };

    //Adds a new dataunit 
    Stack.prototype.Add = function(value) {
        //Create the new data unit
        var newDU = new DataUnit(this.paper,this.type,this.value[this.value.length-1], this.VH,  this.x + (this.WIDTH - this.DUNIT_WIDTH)/2,
                                       this.y - this.DUNIT_HEIGHT, this.DUNIT_WIDTH, this.DUNIT_HEIGHT, 0);
        newDU.create();

        //Insert the new data unit in it's proper location
        newDU.move(0, this.HEIGHT - (this.DUNIT_HEIGHT*this.DUNIT_BUFFER) - (this.DUNIT_HEIGHT*(1 + this.DUNIT_BUFFER))*(this.value.length - 1),this.VH.setDelay(500),500);
        this.vis.splice(this.value.length, 0, newDU);
    }


    //TODO
    //Gets a new dataunit at the specified index
    Stack.prototype.Get = function() {
        //Create the new data unit
        var newDU = new DataUnit(this.paper,this.type, this.value[this.value.length - 1], this.VH, this.x + (this.WIDTH - this.DUNIT_WIDTH)/2,
                                       this.y  + this.HEIGHT - this.DUNIT_HEIGHT- (this.DUNIT_HEIGHT*this.DUNIT_BUFFER) - (this.DUNIT_HEIGHT*(1 + this.DUNIT_BUFFER))*(this.vis.length - 1), this.DUNIT_WIDTH, this.DUNIT_HEIGHT, -1);
        newDU.create();
        newDU.highLight();

        //Move the new data unit to it's proper location and set as the anonymous variable
        newDU.move(0,-(this.HEIGHT - (this.DUNIT_HEIGHT*(1 + this.DUNIT_BUFFER))*(-1 + this.value.length)), this.VH.setDelay(500),500);
        this.anon = newDU;
        this.VH.setDelay(250);
    }

    //Removes a  dataunit at the specified index
    Stack.prototype.Remove = function() {
        //move the top item to the stack and fade it out
        this.vis[this.vis.length - 1].move(0,-(this.HEIGHT - (this.DUNIT_HEIGHT*(1 + this.DUNIT_BUFFER))*(this.value.length)), this.VH.setDelay(500),500);
        this.VH.setDelay(400);
        this.vis[this.vis.length - 1].fadeOut(this.VH.setDelay(250));

        //Create the new data at the top of the stack
        var xx = this.x + (this.WIDTH - this.DUNIT_WIDTH)/2,
            yy = this.y - this.DUNIT_HEIGHT;

        var newDU = new DataUnit(this.paper,this.type, this.vis[this.vis.length - 1].value, this.VH,  xx,
                                        yy, this.DUNIT_WIDTH, this.DUNIT_HEIGHT, -1);
        newDU.create();
        this.vis.splice(this.vis.length - 1, 1);
        this.anon = newDU;
    }

    //Changes the value of the data unit at the given index
    Stack.prototype.ChangeAtPosition = function(index) {
        this.vis[index].update(this.value[index],0);
    }

    //Changes the value of the data unit at the given index
    Stack.prototype.HighLightAtPosition = function(index) {
        this.vis[index].highLight();
        this.VH.setDelay(200);
        this.vis[index].lowLight();
    }
});