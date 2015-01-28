//list.js
//Represents a list

$(document).ready(function () {
    
    List = function(paper,name,type,value,vishandler){
        this.paper = paper;
        this.VH = vishandler;
        this.name = name;
        this.type = type;
        //HARDCODED VALUE OF STACK RIGHT HERE FOR TESTING
        this.value = [2,3];

        //assign the position
        this.x = 0;
        this.y = 0;
        this.FONT_SIZE = 18;
        this.LIST_WIDTH = 60;
        this.LIST_HEIGHT = 240;
        this.vis = [];

        //visual component
        this.buildVisual();
    }

    //BuildVisual is different for stacks, it adds all the visual components of the stack to an array
    //that is then animated piecewise
    List.prototype.buildVisual = function(){
        var myLabel, frame;
        myLabel = this.paper.text(this.x, this.y + this.STACK_HEIGHT + 13, this.type + " " + this.name);
        myLabel.attr({"opacity": 0,"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});

        frame = this.paper.path("M " + this.x + ", " + this.y + " V " + (this.y + this.LIST_HEIGHT) + " H " + (this.x + this.LIST_WIDTH) + " V " + this.y);
        frame.attr({"opacity": 0,"stroke": "#000000"});

        //here's the visual component's representation of the content of the stack. the "data units"
        //that we'd talked about, nick
        for (var i = this.value.length - 1; i >= 0; i--){
            var dataUnit =  this.paper.text(this.x + this.LIST_WIDTH/2, this.y + this.LIST_HEIGHT - (this.FONT_SIZE*1.5)*i - this.FONT_SIZE, this.value[i]);
            dataUnit.attr({"opacity": 0,"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'center'});
            this.vis.push(dataUnit);
        }

        this.vis.push(myLabel);
        this.vis.push(frame);
    }

   //Create visual primitve in the specific position
    List.prototype.create = function(newX, newY) {
        this.x = newX;
        this.y = newY;
        //get the delay for outside the loop
        var delay = this.VH.setDelay(1000);
        //!!!Here! follow this procedure for animating or moving all the elements of a list.
        //move all the visual elements into a new area
        for (var i = 0; i < this.vis.length; i++){
            this.vis[i].transform("t" + (newX) + "," + (newY));
            var anim = Raphael.animation({opacity:1},1000);
            this.vis[i].animate(anim.delay(delay));
        }
    };

    //Moves the visual primitve to the specific positon
    List.prototype.move = function(newX, newY) {
        var difX, difY;
        difX = newX - this.x;
        difY = newY - this.y;
        this.x = newX;
        this.y = newY;
        var anim = Raphael.animation({x:difX,y:difY},500);
        this.vis.animate(anim.delay(this.VH.setDelay(500)));
    };

    //Remove visual primitives
    List.prototype.destroy = function() {
        var anim = Raphael.animation({opacity:0},1000);
        this.vis.animate(anim.delay(this.VH.setDelay(1000)));
    };
    
    //Remove visual primitives
    List.prototype.update = function() {
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



