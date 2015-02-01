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

        //Move the labels
        var delay = this.VH.setDelay(500);
        var anim = Raphael.animation({"transform": "t" + difX + "," + difY},500);
        this.myLabel.animate(anim.delay(delay));  
        this.myFrame.animate(anim.delay(delay));
          
        //move the dataunits
        for (var i =0; i < this.vis.length; i++){
            this.vis[i].move(difX,difY,delay);
        }
    };

    //Remove visual primitives
    List.prototype.destroy = function() {
        //get the delay for outside the loop
        var delay = this.VH.setDelay(1000);

        //Fade in the label and frame
        var anim = Raphael.animation({opacity:0},1000);
        this.myLabel.animate(anim.delay(delay));
        this.myFrame.animate(anim.delay(delay));
        for (var i = this.vis.length-1; i >= 0; i--){
            this.vis[i].fadeOut(delay);
        }
    };
    
    //Update the 
    List.prototype.update = function(action, originADT) {

        switch(action){
            case "add":
                this.AddAtPosition(1,2);
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
            this.vis[i].move(this.DUNIT_WIDTH*1.2,0,delay);
        }

        //Insert the new data unit in it's proper location
        newDU.move(this.DUNIT_WIDTH*1.2*index,0,this.VH.setDelay(500));
        newDU.move(0,this.DUNIT_HEIGHT + (this.HEIGHT - this.DUNIT_HEIGHT)/2,this.VH.setDelay(500));
        //newDU.move(220,200,this.VH.setDelay(500));
        this.vis.splice(index, 0, newDU);
    }
});