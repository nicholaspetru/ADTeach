//dictionary.js
//Represents a dictionary

$(document).ready(function () {
    
    Dictionary = function(paper,name,type,value,vishandler){
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
        this.DUNIT_HEIGHT = 18;
        this.DUNIT_WIDTH = 80;
        this.DUNIT_BUFFER = .2;        
        this.WIDTH = 200;
        this.HEIGHT = 100;
        this.COL_NUM = 4;

        //visual component
        this.myLabel = null;
        this.myFrame = [];
        this.vis = [];
        this.drawn = false;

        //anonymous DU
        this.anon = [];
    }

    //BuildVisual is different for stacks, it adds all the visual components of the stack to an array
    //that is then animated piecewise
    Dictionary.prototype.buildVisual = function(){
        this.myLabel = this.paper.text(this.x, this.y + this.HEIGHT + 13, this.type.split("<")[0] + " " + this.name);
        this.myLabel.attr({"opacity": 0,"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});

        //new: scale the frame's length to the length of the list
        this.myFrame[0] = this.paper.text(this.x - 10, this.y + 40,"{");
        this.myFrame[0].attr({"transform" : "s 1, 1.5", "opacity": 0,"font-family": "times", "font-size": 60, 'text-anchor': 'start'});
        this.myFrame[1] = this.paper.text(this.x + this.WIDTH - 10, this.y + 40,"}");
        this.myFrame[1].attr({"transform" : "s 1, 1.5","opacity": 0,"font-family": "times", "font-size": 60, 'text-anchor': 'start'});

        this.stretch();
        this.Populate();
    }

    //Update the List
    Dictionary.prototype.update = function(action, originADT) {
        //strip the string and get the params from the "Action" str
        var split = action.split(".");
        //animate the change
        switch(split[0]){
            case "put":
                //check if there's an anonymous variable
                if (originADT != null){
                    this.VH.getAnonymousVariable(originADT, this.x + (this.DUNIT_WIDTH*.2), this.y - this.DUNIT_HEIGHT);
                }
                this.stretch();
                this.Add(split[1],split[2]);
                break;
            case "populate":
                //erase old data
                for (var i = 0; i < this.vis.length; i++){
                    this.vis[i].destroy();
                }
                this.vis = [];  
                this.stretch();
                this.Populate();
                break;
            case "remove":
                this.Remove(split[1]);                
                this.stretch();
                break;
            case "get":
                this.Get(split[1]);
                break;
        }
    };


    /*
    ANIMATIONS
    */

    //Create visual primitve in the specific position
    Dictionary.prototype.create = function(newX, newY) {
        this.x = newX;
        this.y = newY;
        this.buildVisual();

        //get the delay for outside the loop
        var delay = this.VH.setDelay(500);

        //Fade in the label and frame
        var anim = Raphael.animation({opacity:1},this.VH.getAnimTime(500));
        this.myLabel.animate(anim.delay(delay));
        this.myFrame[0].animate(anim.delay(delay));
        this.myFrame[1].animate(anim.delay(delay));
        for (var i = 0; i < this.vis.length; i++){
            this.vis[i].create();
        }
    };

    //Populates the dict with it's contents
    Dictionary.prototype.Populate = function() {
        var index = 0;
        var names = Object.getOwnPropertyNames(this.value);
        for (var val in this.value){
           //Create the new data unit
            var newDU = new DataUnit(this.paper,this.type,names[index] + " : " + this.value[val], this.VH,  this.x + (this.DUNIT_WIDTH*.2) + 90*Math.floor(index/this.COL_NUM),
                                           this.y + (2*this.HEIGHT/this.COL_NUM) +  this.HEIGHT/this.COL_NUM*((index%this.COL_NUM) - this.COL_NUM/2), this.DUNIT_WIDTH, this.DUNIT_HEIGHT, -1);
            newDU.create();
            this.stretch();
            this.vis.push(newDU);
            index++;
        }
    }

    //Stretches the frame to accomadate the new length of the dict
    Dictionary.prototype.stretch = function() {
        //count the number of real items in the dict
        var count = 0;
        for (var i = 0; i < this.vis.length; i++){
            if (this.vis[i] != null){
                count ++;
            }
        }

        //in the timeout, expand or contract
        var _t = this;
        setTimeout(function(){
            if (_t.WIDTH/100 < Math.ceil(count/_t.COL_NUM)){
                _t.WIDTH += 100;
                _t.myFrame[1].animate({transform:'...t 100 0'},_t.VH.getAnimTime(250));
            }
        },(this.VH.delay - this.VH.date.getTime()));
    };


    //Moves the visual primitve to the specific positon
    Dictionary.prototype.move = function(newX, newY) {
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
            _t.myFrame[0].animate({transform:'...t' + difX + ' ' + difY},_t.VH.getAnimTime(500));
            _t.myFrame[1].animate({transform:'...t' + difX + ' ' + difY},_t.VH.getAnimTime(500));

            //move the dataunits
            for (var i =0; i < _t.vis.length; i++){
                _t.vis[i].move(difX,difY,0,500);
            }
        },(this.VH.delay - this.VH.date.getTime()));

    };

    //Remove visual primitives
    Dictionary.prototype.destroy = function() {
        //get the delay for outside the loop
        var delay = this.VH.setDelay(1000);

        //Fade out the label and frame

        var anim = Raphael.animation({opacity:0},this.VH.getAnimTime(1000));
        this.myLabel.animate(anim.delay(delay));
        this.myFrame[0].animate(anim.delay(delay));
        this.myFrame[1].animate(anim.delay(delay));
        for (var i = this.vis.length-1; i >= 0; i--){
            this.vis[i].fadeOut(delay);
        }
    };

    //Adds a new dataunit 
    Dictionary.prototype.Add = function(key, value) {
        //Create the new data unit
        var newDU = new DataUnit(this.paper,this.type,key + " : " + value, this.VH,  this.x + (this.DUNIT_WIDTH*.2),
                                       this.y - this.DUNIT_HEIGHT, this.DUNIT_WIDTH, this.DUNIT_HEIGHT, -1);
        newDU.create();

        //find the next available spot
        for (var i = 0; i < this.vis.length; i++){
            if (this.vis[i] == null){
                break;
            }
        }  

        //Insert the new data unit in it's proper location
        newDU.move(90*Math.floor(i/this.COL_NUM),this.DUNIT_HEIGHT + (2*this.HEIGHT/this.COL_NUM) +  this.HEIGHT/this.COL_NUM*((i%this.COL_NUM) - this.COL_NUM/2),this.VH.setDelay(500),500);
        this.VH.setDelay(250);
        var _t = this;
        setTimeout(function(){
            _t.vis.splice(i, 0, newDU);
        },(this.VH.delay - this.VH.date.getTime()));
    }

    //Gets a new dataunit at the specified index
    Dictionary.prototype.Get = function(key) {
        //Find the data unit
        for (var i = 0; i < this.vis.length; i++){
            if (this.vis[i].value.split(" :")[0] == key){
                break;
            }
        }

        //Create the new data unit
        var newDU = new DataUnit(this.paper,this.type,this.vis[i].value.split(" : ")[1], this.VH,  this.x + (this.DUNIT_WIDTH*.2) + 90*Math.floor(i/this.COL_NUM) + this.vis[i].value.split(" : ")[1].length*this.FONT_SIZE*2.5,
                                       this.y + (2*this.HEIGHT/this.COL_NUM) +  this.HEIGHT/this.COL_NUM*((i%this.COL_NUM) - this.COL_NUM/2), this.DUNIT_WIDTH, this.DUNIT_HEIGHT, -1);
        newDU.create();

        //Move the new data unit to it's proper location and set as the anonymous variable
        newDU.moveTo(this.x + (this.DUNIT_WIDTH*.2), this.y - this.DUNIT_HEIGHT,this.VH.setDelay(500),500);
        this.VH.setDelay(250);
        this.anon.push(newDU);
    }

    //Removes a  dataunit at the specified index
    Dictionary.prototype.Remove = function(key) {
        //Destroy the data unit
        for (var i = 0; i < this.vis.length; i++){
            if (this.vis[i].value.split(" :")[0] == key){
                this.vis[i].turnRed();
                this.vis[i].destroy();
                this.vis[i] = null;
            }
        }
    }

    //Changes the value of the data unit at the given index
    Dictionary.prototype.ChangeAtPosition = function(index) {
        this.vis[index].update(this.value[index],0);
    }

    //Changes the value of the data unit at the given index
    Dictionary.prototype.HighLightAtPosition = function(index) {
        this.vis[index].highLight();
        this.VH.setDelay(200);
        this.vis[index].lowLight();
    }
});