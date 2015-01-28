//primitive.js
//Represents primitive objects like ints, strings, etc (something that doesn't need a data structure.)

$(document).ready(function () {
    
    Primitive = function(paper,name,type,value,vishandler){
        this.paper = paper;
        this.VH = vishandler;
        this.name = name;
        this.type = type;
        this.value = value;

        //assign the position
        this.x = 0;
        this.y = 0;

        //visual component
        this.vis = this.paper.text(this.x, this.y, this.type + " " + this.name + " = " + this.value);
        this.vis.attr({"opacity": 0,"font-family": "times", "font-size": 18, 'text-anchor': 'start'});
    }

   //Create visual primitve in the specific position
    Primitive.prototype.create = function(newX, newY) {
        this.x = newX;
        this.y = newY;
        //move them to the new area
        this.vis.transform("t" + (newX) + "," + (newY));
        //fade it in
        var anim = Raphael.animation({opacity:1},1000);
        this.vis.animate(anim.delay(this.VH.setDelay(1000)));
    };

    //Moves the visual primitve to the specific positon
    Primitive.prototype.move = function(newX, newY) {
        var difX, difY;
        difX = newX - this.x;
        difY = newY - this.y;
        this.x = newX;
        this.y = newY;
        var anim = Raphael.animation({x:difX,y:difY},500);
        this.vis.animate(anim.delay(this.VH.setDelay(500)));
    };

    //Remove visual primitives
    Primitive.prototype.destroy = function() {
        var anim = Raphael.animation({opacity:0},1000);
        this.vis.animate(anim.delay(this.VH.setDelay(1000)));
    };
    
    //Modifiy visual primitives
    Primitive.prototype.update = function() {
        // shake it off
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
        
        this.VH.setDelay(50);
    };

    Primitive.prototype.copyTo = function() {

    }
});
