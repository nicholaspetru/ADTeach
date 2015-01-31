//list.js
//Represents a list

$(document).ready(function () {
    
    List = function(paper,name,type,value,vishandler){
        this.paper = paper;
        this.VH = vishandler;
        this.name = name;
        this.type = type;
        //HARDCODED VALUE OF STACK RIGHT HERE FOR TESTING
        this.value = [2,3, 5,"brady"];

        //assign the position
        this.x = 0;
        this.y = 0;
        this.FONT_SIZE = 11;
        this.WIDTH = 280;
        this.HEIGHT = 60;
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
        //that we'd talked about, nick
        for (var i = this.value.length - 1; i >= 0; i--){
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
        for (var i = this.vis.length-1; i >= 0; i--){
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
    
    //Remove visual primitives
    List.prototype.update = function() {
        this.destroy();
        //I hhave disabled this for the time being so it wont cause crashes
        /*
        //animate changing the value
        var anim = Raphael.animation({x:-4},12);
        this.vis.animate(anim.delay(this.VH.setDelay(12)));

        for (var i = 0; i < 21; i++){
            var anim = Raphael.animation({x:8*(-1^i)},25);
            this.vis.animate(anim.delay(this.VH.setDelay(25)));
        }
        var _t = this, _val = this.value;
        setTimeout(function(){
            _t.vis.attr({"text": (_t.type + " " + _t.name + " = " + _val)});
        },(this.VH.delay - this.VH.date.getTime()));

        var anim = Raphael.animation({x:0},12);
        this.vis.animate(anim.delay(this.VH.setDelay(12)));

        this.VH.setDelay(50);*/
    };

    //TODO
    List.prototype.copyTo = function() {

    }
});