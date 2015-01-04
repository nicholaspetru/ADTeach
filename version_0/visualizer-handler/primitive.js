//primitive.js
//Represents primitive objects like ints, strings, etc (something that doesn't need a data structure.)

$(document).ready(function () {
    
    Primitive = function(paper,name,type,value){
        this.paper = paper;
        this.name = name;
        this.type = type;
        this.value = value;
    }
    
    //draw the name of the function
    Primitive.prototype.Draw = function(x, y){
        var text = paper.text(x, y, this.type + " " + this.name + " = " + this.value);
        text.attr({"font-family": "times", "font-size": 18, 'text-anchor': 'start'});
	     console.log(this.type + " " + this.name + " = " + this.value);
    }
});
