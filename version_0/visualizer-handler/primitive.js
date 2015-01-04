//primitive.js
//Represents primitive objects like ints, strings, etc (something that doesn't need a data structure.)

$(document).ready(function () {
    
    Primitive = function(paper,name,type,value){
        this.paper = paper;
        this.name = name;
        this.type = type;
        this.value = value;

        //assign the position
        this.x = -100;
        this.y = -100;

        //
        this.vis = this.paper.text(this.x, this.y, this.type + " " + this.name + " = " + this.value);
        this.vis.attr({"font-family": "times", "font-size": 18, 'text-anchor': 'start'});
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
       //log it in the console
       console.log(this.type + " " + this.name + " = " + this.value);
    }
});
