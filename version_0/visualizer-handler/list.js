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
        this.FONT_SIZE = 11;
        this.WIDTH = 280;
        this.HEIGHT = 45;
        this.DUNIT_HEIGHT = this.HEIGHT*.85;
        this.DUNIT_WIDTH = this.DUNIT_HEIGHT*.5;
        this.vis = [];

        //visual component
        this.myLabel = null;
        this.myFrame = null;
    }

    //BuildVisual is different for stacks, it adds all the visual components of the stack to an array
    //that is then animated piecewise
    List.prototype.buildVisual = function(){
        this.myLabel = this.paper.text(this.x, this.y + this.HEIGHT + 13, this.type + " " + this.name);
        this.myLabel.attr({"opacity": 0,"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});

        this.myFrame = this.paper.path("M " + this.x + ", " + this.y + " V " + (this.y + this.HEIGHT) + " H " + (this.x + this.WIDTH) + " V " + this.y);
        this.myFrame.attr({"opacity": 0,"stroke": "black", "stroke-width": 2.25});

        //here's the visual component's representation of the content of the stack. the "data units"
        for (var i = 0; i < this.value.length; i++){
            this.vis.push(new DataUnit(this.paper,this.type,this.value[i], this.VH,  this.x + (this.DUNIT_WIDTH*.2) + (this.DUNIT_WIDTH*1.2)*(i),
                                       this.y + (this.HEIGHT - this.DUNIT_HEIGHT)/2, this.DUNIT_WIDTH, this.DUNIT_HEIGHT, 0));
        }
    }

   //Create visual primitve in the specific position
    List.prototype.create = function(newX, newY) {
        this.x = newX;
        this.y = newY;
        this.buildVisual();

        //get the delay for outside the loop
        var delay = this.VH.setDelay(500);

        //Fade in the label and frame
        var anim = Raphael.animation({opacity:1},500);
        this.myLabel.animate(anim.delay(delay));
        this.myFrame.animate(anim.delay(delay));
        for (var i = 0; i < this.vis.length; i++){
            this.vis[i].create();
        }
    };

    //Moves the visual primitve to the specific positon
    List.prototype.move = function(newX, newY) {
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
    List.prototype.destroy = function() {
        //get the delay for outside the loop
        var delay = this.VH.setDelay(1000);

        //Fade out the label and frame
        var anim = Raphael.animation({opacity:0},1000);
        this.myLabel.animate(anim.delay(delay));
        this.myFrame.animate(anim.delay(delay));
        for (var i = this.vis.length-1; i >= 0; i--){
            this.vis[i].fadeOut(delay);
        }
    };
    

    //Update the List
    List.prototype.update = function(action, originADT) {
        //strip the string and get the params from the "Action" str
        var split = action.split(".");

        //animate the change
        switch(split[0]){
            case "add":
                var index = parseInt(split[1]);
                this.AddAtPosition(index, this.value[index]);
                break;
            case "populate":
                //erase old data
                for (var i = 0; i < this.vis.length; i++){
                    this.vis[i].remove();
                }
                //create new data units
                for (var i = 0; i < this.value.length; i++){
                    var newDU = new DataUnit(this.paper,this.type,this.value[i], this.VH,  this.x + (this.DUNIT_WIDTH*.2) + (this.DUNIT_WIDTH*1.2)*(i),
                                       this.y + (this.HEIGHT - this.DUNIT_HEIGHT)/2, this.DUNIT_WIDTH, this.DUNIT_HEIGHT, 0);
                    this.vis.push(newDU);
                    newDU.create();
                }
                break;
            case "remove":
                var index = parseInt(split[1]);
                this.RemoveAtPosition(index);
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
                break;
        }
    };

    //Adds a new dataunit at the specified index
    List.prototype.AddAtPosition = function(index, value) {
        //Create the new data unit
        var newDU = new DataUnit(this.paper,this.type,value, this.VH,  this.x + (this.DUNIT_WIDTH*.2),
                                       this.y - this.DUNIT_HEIGHT, this.DUNIT_WIDTH, this.DUNIT_HEIGHT, 0);
        newDU.create();

        //Scooch down all the other data units
        var delay = this.VH.setDelay(500);
        for (var i = index; i < this.vis.length; i++){
            this.vis[i].move(this.DUNIT_WIDTH*1.2,0,delay,500);
        }

        //Insert the new data unit in it's proper location
        newDU.move(this.DUNIT_WIDTH*1.2*index,0,this.VH.setDelay(500),500);
        newDU.move(0,this.DUNIT_HEIGHT + (this.HEIGHT - this.DUNIT_HEIGHT)/2,this.VH.setDelay(500),500);
        this.vis.splice(index, 0, newDU);
    }

    //Removes a  dataunit at the specified index
    List.prototype.RemoveAtPosition = function(index) {
        //deletes the new data unit
        this.vis[index].destroy();

        var delay = this.VH.setDelay(500);
        for (var i = index; i < this.vis.length; i++){
            this.vis[i].move(-this.DUNIT_WIDTH*1.2,0,delay,500);
        }

        this.vis.splice(index, 1);
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

//add : adds something at the end
//set: inserts a new thing at a certain spot in the list set.index
//remove: removal.index 