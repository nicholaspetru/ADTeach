//primitive.js
//Represents primitive objects like ints, strings, etc (something that doesn't need a data structure.)

$(document).ready(function () {
    
    Stack = function(paper,name,type,value,vishandler){
        this.paper = paper;
        this.VH = vishandler;
        this.name = name;
        this.type = type;
        this.value = value;

        //assign the position
        this.x = 0;
        this.y = 0;
        this.STACK_WIDTH = 30;
        this.STACK_HEIGHT = 60;

        //visual component
        this.buildVisual();
    }


    Stack.prototype.buildVisual = function(){
        this.vis = this.paper.path("M " + this.x + ", " + this.y + " V " + (this.y + this.STACK_HEIGHT) + " H " + (this.x + this.STACK_WIDTH) + " V " + this.y);
        //this.vis = this.paper.text(this.x, this.y, this.type + " " + this.name + " = " + this.value);
        this.vis.attr({"opacity": 0,"font-family": "times", "font-size": 18, 'text-anchor': 'start'});
    }


    //Remove visual primitives
    Stack.prototype.destroy = function() {
        /*var anim = Raphael.animation({opacity:0},1000);
        this.vis.animate(anim.delay(this.VH.setDelay(1000)));*/
    };
    
    //Remove visual primitives
    Stack.prototype.update = function() {
        /*
        // shake it off
        var anim = Raphael.animation({x:-4},12);
        this.vis.animate(anim.delay(this.VH.setDelay(12)));

        for (var i = 0; i < 21; i++){
            var anim = Raphael.animation({x:8*(-1^i)},25);
            this.vis.animate(anim.delay(this.VH.setDelay(25)));
        }
        var _t = this
        setTimeout(function(){
            _t.vis.attr({"text": (_t.type + " " + _t.name + " = " + _t.value)});
        },(this.VH.delay - this.VH.date.getTime()));

        var anim = Raphael.animation({x:0},12);
        this.vis.animate(anim.delay(this.VH.setDelay(12)));*/
    };

    Primitive.prototype.copyTo = function() {

    }

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
    }
});


//stack.js
//A test implementation of a stack.

/*
Put this code in  Redner() in visualizer-handler.js to test this code

var xstack = new Stack(paper, "test stack", "Integer", ["test", "a", "is", "this"]);
        xstack.Draw(300, 200);
        xstack.Populate();


$(document).ready(function () {
    
    // eventually we will want to pass in x, y, width, and height into Stack instatiations
    // currently the Draw function (in primitives) takes x and y
    Stack = function(paper,name,type,value) {// x, y, width, height){
        //assigning the stack attributes
        this.paper = paper;
        this.name = name;
        this.type = "stack<" + type + ">"; 
        this.value = value;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    Stack.prototype = Object.create(Entity.prototype);
    Stack.prototype.constructor = Stack;

    //draw a Stack of the function
    Stack.prototype.Draw = function(){
        var box = this.paper.path("M " + this.x + ", " + this.y + " V " + (this.y + this.height) + " H " + (this.x + this.width) + " V " + this.y);
        var name = this.paper.text(this.x + this.width/2, this.y + this.height + 10, this.name)
        console.log(this.DrawName() + " = " + this.value);
    }

    // Loop through values and put them into the stack
    Stack.prototype.Populate = function(){
        var tempY, t = 500;
        for (var i = 0; i < this.value.length; i++) {
            if (i == 0) 
                tempY = (this.y + this.height) - (i+1)*(this.width/2 + 4);
            else 
                tempY = tempY - (this.width);

            var item = this.paper.rect(0, 0, this.width - 4, this.width - 4);
            //var val = this.paper.text(this.x + this.width/2, tempY, this.value[i]);
            var val = this.paper.text(this.x + this.width/2, tempY, this.value[i]);

            var anim = Raphael.animation({x:this.x + 2 ,y:(this.y + this.height) - (i+1)*(this.width)}, 500);
            item.animate(anim.delay(t));
            val.animateWith(anim, {x:this.x + this.width/2, y:tempY});
            t += 500;
        }
    }

});*/



