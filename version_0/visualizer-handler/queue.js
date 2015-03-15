//queue.js
//Represents a queue

$(document).ready(function () {
    
    Queue = function(paper,name,type,value,vishandler){
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
        this.DUNIT_HEIGHT = 45*.85;        
        //Queues with floats have fatter data units
        if (this.type.split("<")[1] == "Float>"){
            this.DUNIT_WIDTH = (45*.85)*.8;
        }else{
            this.DUNIT_WIDTH = (45*.85)*.5;
        }
        this.DUNIT_BUFFER = .2;
        this.WIDTH = 0;
        this.setDimensions();

        //visual component
        this.myLabel = null;
        this.myFrame = null;
        this.frontText = null;
        this.vis = [];
        this.drawn = false;

        //anonymous DU
        this.anon = [];
    }

    //BuildVisual is different for stacks, it adds all the visual components of the stack to an array
    //that is then animated piecewise
    Queue.prototype.buildVisual = function(){
        this.myLabel = this.paper.text(this.x + this.WIDTH/2.5, this.y + this.HEIGHT + 13, this.type.split("<")[0] + " " + this.name);
        this.frontText = this.paper.text(this.x + (this.DUNIT_WIDTH*this.DUNIT_BUFFER*2) + this.DUNIT_WIDTH*(1.5 + this.DUNIT_BUFFER + this.value.length),this.y + this.HEIGHT/2,"front");
        //"M " + this.x + ", " + () + " V " + (this.y + this.HEIGHT) + " H " +  + " V " + (this.y + this.HEIGHT/2)), this.y + this.HEIGHT/2, "  front");

        this.frontText.attr({"opacity": 0,"font-family": "times", "font-size": this.FONT_SIZE - 4, 'text-anchor': 'start'});
        this.myLabel.attr({"opacity": 0,"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});

        //new: scale the frame's length to the length of the list
        //this.myFrame = this.paper.path("M " + (this.x + this.WIDTH) + ", " + this.y + " H " + (this.x) + " V " + (this.y + this.HEIGHT) + " H " + (this.x + this.WIDTH));
        this.myFrame = this.paper.path("M " + this.x + ", " + (this.y  + this.HEIGHT/2) + " V " + (this.y + this.HEIGHT) + " H " + (this.x + (this.DUNIT_WIDTH*this.DUNIT_BUFFER*2) + (this.DUNIT_WIDTH*(1 + this.DUNIT_BUFFER)) + " V " + (this.y + this.HEIGHT/2)));
        this.myFrame.attr({"opacity": 0,"stroke": "black", "stroke-width": 2.25});

        //here's the visual component's representation of the content of the stack. the "data units"
        for (var i = 0; i < this.value.length; i++){
            this.vis.push(new DataUnit(this.paper,this.type,this.value[i], this.VH,  this.x + this.WIDTH - (this.DUNIT_WIDTH*this.DUNIT_BUFFER) - (this.DUNIT_WIDTH*(1 + this.DUNIT_BUFFER))*(i),
                                       this.y + (this.HEIGHT - this.DUNIT_HEIGHT)/2, this.DUNIT_WIDTH, this.DUNIT_HEIGHT, 0));
        }
        this.stretch();
    }

    //Sets the appropriate width and height for the Queue
    //returns true if the width changes
    Queue.prototype.setDimensions = function() {
        this.HEIGHT = 45;
        if (this.WIDTH < (this.DUNIT_WIDTH*this.DUNIT_BUFFER*2) + (this.DUNIT_WIDTH*(1 + this.DUNIT_BUFFER)*(1 + this.value.length))){
            this.WIDTH = (this.DUNIT_WIDTH*this.DUNIT_BUFFER*2) + (this.DUNIT_WIDTH*(1 + this.DUNIT_BUFFER)*(1 + this.value.length));
            return true;
        }
        return false;
    }

    //Update the List
    Queue.prototype.update = function(action, originADT) {
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
                this.stretch();
                this.Add(parseInt(split[1]),speed);
                break;
            case "populate":
                this.populate();
                break;
            case "new":
                this.populate();
                break;
            case "remove":
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
    Queue.prototype.create = function(newX, newY) {
        this.x = newX;
        this.y = newY;
        this.buildVisual();

        //get the delay for outside the loop
        var delay = this.VH.setDelay(500);

        //Fade in the label and frame
        var anim = Raphael.animation({opacity:1},this.VH.getAnimTime(500));
        this.frontText.animate(anim.delay(delay));
        this.myLabel.animate(anim.delay(delay));
        this.myFrame.animate(anim.delay(delay));
        for (var i = 0; i < this.vis.length; i++){
            this.vis[i].create();
        }
    };

    //Stretches the frame to accomadate the new length of the list
    Queue.prototype.stretch = function() {
        //variables for list
        var changed = this.setDimensions();
        var _t = this, _0 = this.x, _1 = this.y  + this.HEIGHT/2, _2 = this.y  + this.HEIGHT, _3 = this.x + this.WIDTH;
        //this.VH.setDelay(40);
        //"M " + this.x + ", " + () + " V " + (this.y + this.HEIGHT) + " H " +  + " V " + (this.y + this.HEIGHT/2))
        //in the timeout, create and assign the actual path
        if (changed){
            setTimeout(function(){
                _t.myFrame.remove();
                _t.myFrame = _t.paper.path("M " + _0 + ", " + _1 + " V " + _2 + " H " + _3 + " V " + _1);4
                _t.frontText.attr({"x": (_3 + (_t.DUNIT_WIDTH*_t.DUNIT_BUFFER))});
                _t.myFrame.attr({"opacity": 1,"stroke": "black", "stroke-width": 2.25});
                _t.myLabel.attr({"x": _t.x + _t.WIDTH/4});
                //you also have to schooch down all the data units
                for (var i = 0; i < _t.vis.length; i ++){
                    _t.vis[i].moveTo(_t.x + _t.WIDTH - (_t.DUNIT_WIDTH*_t.DUNIT_BUFFER) - (_t.DUNIT_WIDTH*(1 + _t.DUNIT_BUFFER))*(i + 1),
                                       _t.y + (_t.HEIGHT - _t.DUNIT_HEIGHT)/2,0,10);
                }
            },(this.VH.delay - this.VH.date.getTime()));
        }
        this.VH.setDelay(100);
    };


    //Moves the visual primitve to the specific positon
    Queue.prototype.move = function(newX, newY) {
        var difX, difY;
        difX = newX - this.x;
        difY = newY - this.y;
        this.x = newX;
        this.y = newY;

        var delay = this.VH.setDelay(500);
        //Set timeout and move the data structure at the proper delay
        var _t = this;
        setTimeout(function(){
            _t.frontText.animate({transform:'...t' + difX + ' ' + difY},_t.VH.getAnimTime(500));
            _t.myLabel.animate({transform:'...t' + difX + ' ' + difY},_t.VH.getAnimTime(500));
            _t.myFrame.animate({transform:'...t' + difX + ' ' + difY},_t.VH.getAnimTime(500));

            //move the dataunits
            for (var i =0; i < _t.vis.length; i++){
                _t.vis[i].move(difX,difY,0,500);
            }
        },(this.VH.delay - this.VH.date.getTime()));

    };

    //Remove visual primitives
    Queue.prototype.populate = function() {
        for (var i = 0; i < this.vis.length; i++){
            this.vis[i].destroy();
        }              
        this.vis = [];
        this.stretch();
        //create new data units to match the new dataset
        for (var i = 0; i < this.value.length; i++){
            var newDU = new DataUnit(this.paper,this.type,this.value[i], this.VH, this.x + this.WIDTH - (this.DUNIT_WIDTH*.2) - (this.DUNIT_WIDTH*1.2)*(i + 1),
                               this.y + (this.HEIGHT - this.DUNIT_HEIGHT)/2, this.DUNIT_WIDTH, this.DUNIT_HEIGHT, 0);
            this.vis.push(newDU);
            newDU.create();
        }
    }

    //Remove visual primitives
    Queue.prototype.destroy = function() {
        //get the delay for outside the loop
        var delay = this.VH.setDelay(1000);

        //Fade out the label and frame
        var anim = Raphael.animation({opacity:0},this.VH.getAnimTime(1000));
        this.myLabel.animate(anim.delay(delay));
        this.myFrame.animate(anim.delay(delay));
        this.frontText.animate(anim.delay(delay));
        for (var i = this.vis.length-1; i >= 0; i--){
            this.vis[i].fadeOut(delay);
        }
    };

    //Adds a new dataunit 
    Queue.prototype.Add = function(index, speed) {
        console.log("INDEX" + index + " " + this.value);
        //Create the new data unit
        var newDU = new DataUnit(this.paper,this.type,this.value[index], this.VH,  this.x + (this.DUNIT_WIDTH*.2) ,
                                       this.y - this.DUNIT_HEIGHT, this.DUNIT_WIDTH, this.DUNIT_HEIGHT, 0);
       
       //if you're going quickly (and not generating a new DU, )
        if (speed){
            newDU.create();
            newDU.highLight();
        }else{
            newDU.popIn();
            newDU.vis[0].attr({stroke: "green"});
            newDU.vis[1].attr({stroke: "green"});
        }

        //schooch all the previous ones down
        var delay = null;
        for (var i = index; i < this.vis.length; i++){
            if (delay == null){
                delay = this.VH.setDelay(500);
            }
            this.vis[i].move(-this.DUNIT_WIDTH*1.2,0,delay,500);
        }


        //Insert the new data unit in it's proper location
        newDU.move(0,this.DUNIT_HEIGHT + (this.HEIGHT - this.DUNIT_HEIGHT)/2,this.VH.setDelay(500),500);
        this.VH.setDelay(100);
        newDU.move(this.WIDTH - 2*(this.DUNIT_WIDTH*.2) - (this.DUNIT_WIDTH*1.2)*(index + 1),0,this.VH.setDelay(500),500);
        newDU.lowLight();

        //after the delay, splice in the new addition =) nu baby
        var _t = this;
        setTimeout(function(){
            _t.vis.splice(index, 0, newDU);
        },(this.VH.delay - this.VH.date.getTime()));
    }

    //Gets a new dataunit at the specified index
    Queue.prototype.Get = function() {
        //Create the new data unit
        var xx = this.x + this.WIDTH - (this.DUNIT_WIDTH*.2) - (this.DUNIT_WIDTH*1.2),
            yy = this.y + (this.HEIGHT - this.DUNIT_HEIGHT)/2;

        var newDU = new DataUnit(this.paper,this.type, this.value[0], this.VH,  xx,
                                        yy, this.DUNIT_WIDTH, this.DUNIT_HEIGHT, -1);
        newDU.create();
        newDU.highLight();

        //Move the new data unit to it's proper location and set as the anonymous variable
        newDU.move(0,-(this.DUNIT_HEIGHT + (this.HEIGHT - this.DUNIT_HEIGHT)/2),this.VH.setDelay(500),500);
        this.VH.setDelay(250);
        this.anon.push(newDU);
    }

    //Removes a  dataunit at the specified index
    Queue.prototype.Remove = function() {
        //Create the new data unit
        var xx = this.x + this.WIDTH - (this.DUNIT_WIDTH*.2) - (this.DUNIT_WIDTH*1.2),
            yy = this.y + (this.HEIGHT - this.DUNIT_HEIGHT)/2;

        var newDU = new DataUnit(this.paper,this.type, this.oldValue[0], this.VH,  xx,
                                        yy, this.DUNIT_WIDTH, this.DUNIT_HEIGHT, 0);
        newDU.create();
        newDU.highLight();

        this.vis[0].fastDestroy();
        newDU.move(0,-(this.DUNIT_HEIGHT + (this.HEIGHT - this.DUNIT_HEIGHT)/2),this.VH.setDelay(500),500);
        this.anon.push(newDU);

        //remove the visual unit AT THE KRITICAL MOMENT
        var _t = this;
        setTimeout(function(){
            _t.vis.splice(0, 1);
        },(this.VH.delay - this.VH.date.getTime()));

        //schooch everything down
        var delay = this.VH.setDelay(500);
        for (var i = 0; i < this.vis.length; i++){
            this.vis[i].move(this.DUNIT_WIDTH*1.2,0,delay,500);
        }

    }

    //Changes the value of the data unit at the given index
    Queue.prototype.ChangeAtPosition = function(index) {
        this.vis[index].update(this.value[index],0);
    }

    //Changes the value of the data unit at the given index
    Queue.prototype.HighLightAtPosition = function(index) {
        this.vis[index].highLight();
        this.VH.setDelay(200);
        this.vis[index].lowLight();
    }
});