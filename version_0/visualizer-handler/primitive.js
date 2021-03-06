//primitive.js
//Represents primitive objects like ints, strings, etc (something that doesn't need a data structure.)

$(document).ready(function () {
    
    Primitive = function(paper,name,type,value,vishandler,originADT){
        this.paper = paper;
        this.VH = vishandler;
        this.name = name;
        this.type = type;
        this.value = value;
        this.dragged = false;
        this.originADT = originADT;
        this.drawn = false;

        //assign the position
        this.x = 0;
        this.y = 0;

        this.FONT_SIZE = 18;

        //visual component
        this.vis = this.paper.text(this.x, this.y, this.type + " " + this.name + " = " + this.value);
        this.vis.attr({"opacity": 0,"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
    }

    //Create visual primitve in the specific position
    Primitive.prototype.create = function(newX, newY){
        this.x = newX;
        this.y = newY;

        if (this.originADT != null && this.originADT != this.name){
             this.VH.getAnonymousVariable(this.originADT,this.x + (this.FONT_SIZE/2.5)*(this.type + " " + this.name + " = ").length, this.y - this.FONT_SIZE/2);
        }

        //set animation and delay
        var anim = Raphael.animation({opacity:1},this.VH.getAnimTime(250));
        var delay = this.VH.setDelay(250);

        //move them to the new area
        this.vis.transform("t" + (newX) + "," + (newY));
        //fade it in
        var anim = Raphael.animation({opacity:1},this.VH.getAnimTime(1000));
        this.vis.animate(anim.delay(delay));
    };

    //Moves the visual primitve to the specific positon
    Primitive.prototype.move = function(difX, difY){
        var _t = this;
        var delay = this.VH.setDelay(500);
        var difX, difY;

        setTimeout(function(){
            _t.x += difX;
            _t.y += difY;

            var anim = Raphael.animation({transform:'...t' + difX + ' ' + difY}, this.VH.getAnimTime(250));
            _t.vis.animate(anim.delay(0));
        }, (delay));
    };

    //Remove visual primitives
    Primitive.prototype.destroy = function() {
        var prime = Raphael.animation({fill:'red'},this.VH.getAnimTime(250));
        this.vis.animate(prime.delay(this.VH.setDelay(250)));
        var anim = Raphael.animation({opacity:0},this.VH.getAnimTime(1000));
        this.vis.animate(anim.delay(this.VH.setDelay(1000)));
    };
    
    //Modifiy visual primitives
    Primitive.prototype.update = function(action, originADT) {
        //pull the anonymous variable from the origin
        if (originADT != null){
            this.VH.getAnonymousVariable(originADT,this.x + (this.FONT_SIZE/2.5)*(this.type + " " + this.name + " = ").length, this.y - this.FONT_SIZE/2);
        }
        // shake the primitive to indicate value change
        for (var i = 0; i < 11; i++){
            var anim = Raphael.animation({x:4*Math.pow(-1,i)},this.VH.getAnimTime(50));
            this.vis.animate(anim.delay(this.VH.setDelay(100)));
        }

        //setTimeout used to allow text value change
        var _t = this, _val = this.value;
        setTimeout(function(){
            _t.vis.attr({"text": (_t.type + " " + _t.name + " = " + _val)});
        },(this.VH.delay - this.VH.date.getTime()));

        var anim = Raphael.animation({x:0},this.VH.getAnimTime(12));
        this.vis.animate(anim.delay(this.VH.setDelay(12)));
        
        this.VH.setDelay(50);
    };

    //make a data unit near your location and return it 
    Primitive.prototype.createAnonymous = function() {
        //Create the new data unit
        var xx = this.x + (this.FONT_SIZE/2.5)*(this.type + " " + this.name + " = ").length;
            yy = this.y - this.FONT_SIZE/2;

        var newDU = new DataUnit(this.paper,this.type, this.value, this.VH,  xx,
                                        yy, 18, 18, -1);
        newDU.font_size = 18;
        newDU.create();

        return newDU;
    }
});
