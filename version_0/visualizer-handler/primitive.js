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

    //Remove visual primitives
    Primitive.prototype.destroy = function() {
        var anim = Raphael.animation({opacity:0},1000);
        this.vis.animate(anim.delay(this.VH.setDelay(1000)));
    };
    
    //Remove visual primitives
    Primitive.prototype.update = function() {
        // shake it off
        var anim = Raphael.animation({x:-4},12);
        this.vis.animate(anim.delay(this.VH.setDelay(12)));

        for (var i = 0; i < 20; i++){
            var anim = Raphael.animation({x:8*(-1^i)},25);
            this.vis.animate(anim.delay(this.VH.setDelay(25)));
        }

        var anim = Raphael.animation({x:4},12);
        this.vis.animate(anim.delay(this.VH.setDelay(12)));

        this.vis.animate(
        {
            duration: 1000,
            step: function(now) { this.vis.attr("text", "hello"); }
        });
    };

    //draw the name of the function
    Primitive.prototype.Draw = function(){
        /*
	   //if the primitive is undefined, create a new vis element
       if (this.vis == null){
            //draw your text
            this.vis = this.paper.text(this.x, this.y, this.type + " " + this.name + " = " + this.value);
            this.vis.attr({"font-family": "times", "font-size": 18, 'text-anchor': 'start'});
       }

*/
       //log it in the console
       console.log(this.type + " " + this.name + " = " + this.value);
    }
});
