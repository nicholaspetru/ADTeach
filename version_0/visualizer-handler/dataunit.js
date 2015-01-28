// dataunit.js
// create properties and actions of units of dataunit

DataUnit = function(paper,type,value,vishandler,x,y,dimension){
        this.paper = paper;
        this.VH = vishandler;
        this.type = type;
        this.value = value;
        // dimension of box/circle
        this.dimension = dimension

        // array of value, box/circle container, associated arrows, etc.
        // NOTE: the value must alwasy be the first item in the list
        this.vis = [];

        //assign the position
        this.x = x;
        this.y = y;

        //visual component
        this.vis = this.paper.text(this.x+(this.dimension/2), this.y+(this.dimension/2), this.value);
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

       //Create visual primitve in the specific position
    Primitive.prototype.fadeIn = function() {
        
        //fade it in
        var anim = Raphael.animation({opacity:1},1000);
        this.vis.animate(anim.delay(this.VH.setDelay(1000)));
    };

	//Modifiy data unit value
    Primitive.prototype.update = function(newValue) {
        // shake it off
        var anim = Raphael.animation({x:-4},12);
        this.vis[0].animate(anim.delay(this.VH.setDelay(12)));

        for (var i = 0; i < 21; i++){
            var anim = Raphael.animation({x:8*(-1^i)},25);
            this.vis[0].animate(anim.delay(this.VH.setDelay(25)));
        }
        var _t = this, _val = this.value;
        setTimeout(function(){
            _t.vis.attr({"text": newValue});
        },(this.VH.delay - this.VH.date.getTime()));

        var anim = Raphael.animation({x:0},12);
        this.vis[0].animate(anim.delay(this.VH.setDelay(12)));
        
        this.VH.setDelay(50);
    };