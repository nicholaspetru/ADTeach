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
    Stack = function(paper,name,type,value) /*, x, y, width, height)*/{
        //assigning the stack attributes
        this.paper = paper;
        this.name = name;
        this.type = "stack<" + type + ">"; 
        this.value = value;
        this.x = 250;
        this.y = 250;
        this.width = 40;
        this.height = 200;
    }
    
    Stack.prototype = Object.create(Entity.prototype);
    Stack.prototype.constructor = Stack;

    //draw a Stack of the function
    Stack.prototype.Draw = function(){
        var box = paper.path("M " + this.x + ", " + this.y + " V " + (this.y + this.height) + " H " + (this.x + this.width) + " V " + this.y);
        var name = paper.text(this.x + this.width/2, this.y + this.height + 10, this.name)
        console.log(this.DrawName() + " = " + this.value);
    }

    // Loop through values and put them into the stack
    Stack.prototype.Populate = function(){
        var tempY;
        for (var i = 0; i < this.value.length; i++) {
            var item = paper.rect(this.x + 2, (this.y + this.height) - (i+1)*(this.width), this.width - 4, this.width - 4);
            
            if (i == 0) 
                tempY = (this.y + this.height) - (i+1)*(this.width/2 + 4);
            else 
                tempY = tempY - (this.width);

            var val = paper.text(this.x + this.width/2, tempY, this.value[i]);
        }
    }

});



