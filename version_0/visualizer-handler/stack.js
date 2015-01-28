//stack.js
//Represents a stack

$(document).ready(function () {
    
    Stack = function(paper,name,type,value,vishandler){
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
        this.WIDTH = 95;
        this.HEIGHT = 280;
        this.DUNIT_WIDTH = this.WIDTH*.85;
        this.DUNIT_HEIGHT = this.DUNIT_WIDTH*.3;
        this.vis = [];

        //visual component
        this.myLabel = null;
        this.myFrame = null;
    }

    //BuildVisual is different for stacks, it adds all the visual components of the stack to an array
    //that is then animated piecewise
    Stack.prototype.buildVisual = function(){
        this.myLabel = this.paper.text(this.x, this.y + this.HEIGHT + 13, this.type + " " + this.name);
        this.myLabel.attr({"opacity": 0,"font-family": "times", "font-size": this.FONT_SIZE, 'text-anchor': 'start'});

        this.myFrame = this.paper.path("M " + this.x + ", " + this.y + " V " + (this.y + this.HEIGHT) + " H " + (this.x + this.WIDTH) + " V " + this.y);
        this.myFrame.attr({"opacity": 0,"stroke": "black", "stroke-width": 2.25});

        //here's the visual component's representation of the content of the stack. the "data units"
        //that we'd talked about, nick
        for (var i = this.value.length - 1; i >= 0; i--){
            this.vis.push(new DataUnit(this.paper,this.type,this.value[i], this.VH, this.x + (this.WIDTH - this.DUNIT_WIDTH)/2,
                                        this.y + this.HEIGHT - (this.DUNIT_HEIGHT*1.2)*(i + 1), this.DUNIT_WIDTH, this.DUNIT_HEIGHT, 0));
            //paper,type,value,vishandler,x,y, width, height, shape
        }
    }

   //Create visual primitve in the specific position
    Stack.prototype.create = function(newX, newY) {
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
    Stack.prototype.move = function(newX, newY) {
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
            this.vis[i].move(newX,newY,delay)
        }
    };

    //Remove visual primitives
    Stack.prototype.destroy = function() {
        var anim = Raphael.animation({opacity:0},1000);
        this.vis.animate(anim.delay(this.VH.setDelay(1000)));
    };
    
    //Remove visual primitives
    Stack.prototype.update = function() {
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
    Stack.prototype.copyTo = function() {

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



