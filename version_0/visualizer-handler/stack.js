//stack.js
//A test implementation of a stack.

/*
Put this code in  Redner() in visualizer-handler.js to test this code

var xstack = new Stack(paper, "test stack", "Integer", ["test", "a", "is", "this"]);
        xstack.Draw(300, 200);
        xstack.Populate();
*/

$(document).ready(function () {
    
    // eventually we will want to pass in x, y, width, and height into Stack instatiations
    // currently the Draw function (in primitives) takes x and y
    Stack = function(paper,name,type,value, x, y, width, height){
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

});



