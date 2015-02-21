//primitive.js
//Represents primitive objects like ints, strings, etc (something that doesn't need a data structure.)

$(document).ready(function () {
    
    Primitive = function(paper,name,type,value,vishandler){
        this.paper = paper;
        this.VH = vishandler;
        this.name = name;
        this.type = type;
        this.value = value;
        this.dragged = false;

        //assign the position
        this.x = 0;
        this.y = 0;

        this.FONT_SIZE = 18;

        //visual component
        this.vis = this.paper.text(this.x, this.y, this.type + " " + this.name + " = " + this.value);
        this.vis.attr({"opacity": 0,"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});
    }

    //Create visual primitve in the specific position
    Primitive.prototype.create = function(newX, newY) {
        this.x = newX;
        this.y = newY;

        //set animation and delay
        var anim = Raphael.animation({opacity:1},250);
        var delay = this.VH.setDelay(250);

        //move them to the new area
        this.vis.transform("t" + (newX) + "," + (newY));
        //fade it in
        var anim = Raphael.animation({opacity:1},1000);
        this.vis.animate(anim.delay(delay));
    };

    //Moves the visual primitve to the specific positon
    Primitive.prototype.move = function(difX, difY) {
        var _t = this;
        var delay = this.VH.setDelay(500);
        var difX, difY;

        setTimeout(function(){
            _t.x += difX;
            _t.y += difY;

            var anim = Raphael.animation({transform:'...t' + difX + ' ' + difY}, 250);
            _t.vis.animate(anim.delay(0));
        }, (delay));
    };

    //Remove visual primitives
    Primitive.prototype.destroy = function() {
        var prime = Raphael.animation({fill:'red'},250);
        this.vis.animate(prime.delay(this.VH.setDelay(250)));
        var anim = Raphael.animation({opacity:0},1000);
        this.vis.animate(anim.delay(this.VH.setDelay(1000)));
    };
    
    //Modifiy visual primitives
    Primitive.prototype.update = function(action, originADT) {
        //pull the anonymous variable from the origin
        if (originADT != null){
            this.VH.getAnonymousVariable(originADT,this.x + (this.FONT_SIZE/2.5)*(this.type + " " + this.name + " = ").length, this.y - this.FONT_SIZE/2);
        }
        // shake it off
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

    //make a data unit near your location and return it 
    Primitive.prototype.createAnonymous = function() {s
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
