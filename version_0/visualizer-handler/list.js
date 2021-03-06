//list.js
//Represents a list

$(document).ready(function () {
    
    List = function(paper,name,type,value,vishandler){
        this.paper = paper;
        this.VH = vishandler;
        this.name = name;
        this.type = type;
        this.value = value;

        //assign the position
        this.x = 0;
        this.y = 0;
        this.cur_length = 1;
        this.MAX_LENGTH = 10;
        this.FONT_SIZE = 15;
        this.DUNIT_HEIGHT = 45*.85;
        //Lists of floats have fatter data units
        if (this.type.split("<")[1] == "Float>"){
            this.DUNIT_WIDTH = (45*.85)*.8;
        }else{
            this.DUNIT_WIDTH = (45*.85)*.5;
        }
        this.DUNIT_BUFFER = .2;

        //width and height refer to max width and height-- how much room this object takes up on the screen
        this.WIDTH = (this.DUNIT_WIDTH*this.DUNIT_BUFFER*2) + (this.DUNIT_WIDTH*(1 + this.DUNIT_BUFFER)*(this.MAX_LENGTH + 1));
        this.HEIGHT = 45;

        //visual component
        // this.me is a Raphael set containing the name, frame, and data units of the list. 
        // any animation on this.me will affect the entire list, which'll be useful for dragging ADTs
        this.me = null; 
        this.myLabel = null;
        this.myFrame = null;
        this.vis = [];
        this.indices = [];
        this.drawn = false;

        //anonymous DU
        this.anon = [];
    }

    //BuildVisual is different for stacks, it adds all the visual components of the stack to an array
    //that is then animated piecewise
    List.prototype.buildVisual = function(){
        this.myLabel = this.paper.text(this.x, this.y + this.HEIGHT + 20, this.type.split("<")[0] + " " + this.name);
        this.myLabel.attr({"opacity": 0,"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});

        //new: scale the frame's length to the length of the list
        this.myFrame = this.paper.path("M " + this.x + ", " + this.y + " V " + (this.y + this.HEIGHT) + " H " + (this.x + (this.DUNIT_WIDTH*this.DUNIT_BUFFER*2) + (this.DUNIT_WIDTH*(1 + this.DUNIT_BUFFER)) + " V " + this.y));
        this.myFrame.attr({"opacity": 0,"stroke": "black", "stroke-width": 2.25});

        //here's the visual component's representation of the content of the stack. the "data units"
        for (var i = 0; i < this.value.length; i++){
            this.vis.push(new DataUnit(this.paper,this.type,this.value[i], this.VH,  this.x + (this.DUNIT_WIDTH*this.DUNIT_BUFFER) + (this.DUNIT_WIDTH*(1 + this.DUNIT_BUFFER))*(i),
                                       this.y + (this.HEIGHT - this.DUNIT_HEIGHT)/2, this.DUNIT_WIDTH, this.DUNIT_HEIGHT, 0));
        }
        this.stretch();

        this.me = this.paper.set();
        this.me.push(this.myLabel,this.myFrame);
        //this.me.draggable();
    }

    //Update the List
    List.prototype.update = function(action, originADT) {
        //strip the string and get the params from the "Action" str
        var split = action.split(",");

        //animate the change
        switch(split[0]){
            case "add":
                //check if there's an anonymous variable
                var speed = false;
                if (originADT != null){
                    speed = true;
                    this.VH.getAnonymousVariable(originADT, this.x + (this.DUNIT_WIDTH*.2), this.y - this.DUNIT_HEIGHT);
                }
                var index = parseInt(split[1]);
                this.stretch();
                this.AddAtPosition(index, this.value[index],speed);
                break;
            case "populate":
                this.populate();
                break;        
            case "getNeighbors":
                this.populate();
                break;        
            case "getVertices":
                this.populate();
                break;     
            case "getChildren":
                this.populate();
                break;   
            case "new":
                this.populate();
                break;
            case "remove":
                var index = parseInt(split[1]);
                this.RemoveAtPosition(index);
                this.stretch();
                break;
            case "set":
                var index = parseInt(split[1]);
                this.ChangeAtPosition(index);
                break;
            case "clear":
                //erase old data
                for (var i = 0; i < this.vis.length; i++){
                    this.vis[i].destroy();
                }
                this.vis = [];
                this.stretch();
                break;
            case "get":
                var index = parseInt(split[1]);
                this.GetFromPosition(index);
                break;
        }
    };

    /*
    ANIMATIONS
    */

    //Create visual primitve in the specific position
    List.prototype.create = function(newX, newY) {
        this.x = newX;
        this.y = newY;
        this.buildVisual();

        //get the delay for outside the loop
        var delay = this.VH.setDelay(500);

        //Fade in the label and frame
        var anim = Raphael.animation({opacity:1},this.VH.getAnimTime(500));
        this.me.animate(anim.delay(delay));

        for (var i = 0; i < this.vis.length; i++){
            this.vis[i].create();
        }
        
    };

    //Stretches the frame to accomadate the new length of the list
    List.prototype.stretch = function() {
        this.checkPosition();
        //variables for list
        var _t = this, _0 = this.x, _1 = this.y, _2 = (this.y + this.HEIGHT), _3 = (this.x + (this.DUNIT_WIDTH*this.DUNIT_BUFFER*2) + this.value.length*(this.DUNIT_WIDTH*(1 + this.DUNIT_BUFFER)));
        
        //in the timeout, create and assign the actual path
        if (this.WIDTH != _3){
            //this.VH.setDelay(500);
            setTimeout(function(){
                //clear all items of the indices
                for (var i = 0; i < _t.indices.length; i++){     
                    _t.indices[i].remove();
                } 
                //create indices for the list
                for (var i = 0; i < _t.value.length; i++){            
                    var index = _t.paper.text(_t.x + (_t.DUNIT_WIDTH*_t.DUNIT_BUFFER) + (_t.DUNIT_WIDTH*(1 + _t.DUNIT_BUFFER))*(i) + _t.DUNIT_WIDTH/2, _t.y + _t.HEIGHT + _t.FONT_SIZE/2,"" + i);
                    _t.myLabel.attr({"opacity": 1,"font-family": "times", "font-size": this.FONT_SIZE/2, 'text-anchor': 'start'});
                    _t.indices.push(index);
                }
                _t.myFrame.remove();
                _t.myFrame = _t.paper.path("M " + _0 + ", " + _1 + " V " + _2 + " H " + _3 + " V " + _1);
                _t.myFrame.attr({"opacity": 1,"stroke": "black", "stroke-width": 2.25});
                _t.WIDTH = _3;
                _t.me.push(_t.myFrame);
            },(this.VH.delay - this.VH.date.getTime()));
        }
    };


    //Fills the list
    List.prototype.populate = function() {
        //erase old data
        for (var i = 0; i < this.vis.length; i++){
            this.vis[i].destroy();
        }
        this.vis = [];

        this.stretch();
        //create new data units to match the new dataset
        for (var i = 0; i < this.value.length; i++){
            var newDU = new DataUnit(this.paper,this.type,this.value[i], this.VH,  this.x + (this.DUNIT_WIDTH*.2) + (this.DUNIT_WIDTH*1.2)*(i),
                               this.y + (this.HEIGHT - this.DUNIT_HEIGHT)/2, this.DUNIT_WIDTH, this.DUNIT_HEIGHT, 0);
            this.vis.push(newDU);
            newDU.create();
            //newDU.updateIndex(i);
        }
    };

    //Moves the visual primitve to the specific positon
    List.prototype.move = function(newX, newY) {
        this.checkPosition();
        var difX, difY;
        difX = newX - this.x;
        difY = newY - this.y;
        this.x = newX;
        this.y = newY;

        var delay = this.VH.setDelay(500);
        //Set timeout and move the data structure at the proper delay
        var _t = this;
        setTimeout(function(){
            _t.myLabel.animate({transform:'...t' + difX + ' ' + difY},_t.VH.getAnimTime(500));
            _t.myFrame.animate({transform:'...t' + difX + ' ' + difY},_t.VH.getAnimTime(500));
            //move the indices
            for (var i =0; i < _t.indices.length; i++){
                _t.indices[i].animate({transform:'...t' + difX + ' ' + difY},_t.VH.getAnimTime(500));
            }
            //move the dataunits
            for (var i =0; i < _t.vis.length; i++){
                _t.vis[i].move(difX,difY,0,500);
            }
        },(this.VH.delay - this.VH.date.getTime()));

    };

    //Remove visual primitives
    List.prototype.destroy = function() {
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

    //Adds a new dataunit at the specified index
    List.prototype.AddAtPosition = function(index, value, speed) {
        console.log("INDEX" + index + " " + value);
        this.checkPosition();
        //Create the new data unit
        var newDU = new DataUnit(this.paper,this.type,value, this.VH,  this.x + (this.DUNIT_WIDTH*.2),
                                       this.y - this.DUNIT_HEIGHT, this.DUNIT_WIDTH, this.DUNIT_HEIGHT, 0);

        if (!speed){
            newDU.create();
            newDU.highLight();
        }else{
            newDU.popIn();
            newDU.vis[0].attr({stroke: "green"});
            newDU.vis[1].attr({stroke: "green"});
        }

        //newDU.updateIndex(index);

        //Scooch down all the other data units if you need to schooch
        var delay = null;
        for (var i = index; i < this.vis.length; i++){
            if (delay == null){
                delay = this.VH.setDelay(500);
            }
            this.vis[i].move(this.DUNIT_WIDTH*1.2,0,delay,500);
            //this.vis[i].updateIndex(i + 1);
        }

        //Insert the new data unit in it's proper location
        newDU.move(this.DUNIT_WIDTH*1.2*index,0,this.VH.setDelay(500),500);
        this.VH.setDelay(100);
        newDU.move(0,this.DUNIT_HEIGHT + (this.HEIGHT - this.DUNIT_HEIGHT)/2,this.VH.setDelay(500),500);
        this.VH.setDelay(100);

        var _t = this;
        setTimeout(function(){
            _t.vis.splice(index, 0, newDU);
        },(this.VH.delay - this.VH.date.getTime()));

        newDU.lowLight();

        // weird stuff happens
        this.me = this.paper.set();
        this.me.push(this.myFrame, this.myLabel, newDU.vis[0],newDU.vis[1]);
        //this.me.draggable();
    }

    List.prototype.checkPosition = function() {
        var curX = this.myFrame.getBBox().x;
        var curY = this.myFrame.getBBox().y;
        if (curX !== this.x || curY !== this.y) {
            this.x = curX;
            this.y = curY;
        }
        
    }
    //Gets a new dataunit at the specified index
    List.prototype.GetFromPosition = function(index) {
        //Create the new data unit
        var xx = this.x + (this.DUNIT_WIDTH*.2) + this.DUNIT_WIDTH*1.2*index,
            yy = this.y + (this.HEIGHT - this.DUNIT_HEIGHT)/2;

        var newDU = new DataUnit(this.paper,this.type, this.value[index], this.VH,  xx,
                                        yy, this.DUNIT_WIDTH, this.DUNIT_HEIGHT, 0);
        newDU.create();
        newDU.highLight();
        //Move the new data unit to it's proper location and set as the anonymous variable
        newDU.move(0,-(this.DUNIT_HEIGHT + (this.HEIGHT - this.DUNIT_HEIGHT)/2),this.VH.setDelay(500),500);
        this.anon.push(newDU);
    }

    //Removes a  dataunit at the specified index
    List.prototype.RemoveAtPosition = function(index) {
        //deletes the new data unit
        this.vis[index].destroy();

        var delay = this.VH.setDelay(500);
        for (var i = index; i < this.vis.length; i++){
            this.vis[i].move(-this.DUNIT_WIDTH*1.2,0,delay,500);
            //this.vis[i].updateIndex(i - 1);
        }
        var _t = this;
        setTimeout(function(){
            _t.vis.splice(index, 1);
        },(this.VH.delay - this.VH.date.getTime()));
    }

    //Changes the value of the data unit at the given index
    List.prototype.ChangeAtPosition = function(index) {
        this.vis[index].update(this.value[index],0);
    }

    //Changes the value of the data unit at the given index
    List.prototype.HighLightAtPosition = function(index) {
        this.vis[index].highLight();
        this.VH.setDelay(200);
        this.vis[index].lowLight();
    }
});