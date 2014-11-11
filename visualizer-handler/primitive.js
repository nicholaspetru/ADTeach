//primitive.js
//Represents primitive objects like ints, strings, etc (something that doesn't need a data structure.)

$(document).ready(function () {
    
    Primitive = function(name,type,value){
	Entity.call(this,name,type,value);
	//specific calls go here
    }
    
    Primitive.prototype = Object.create(Entity.prototype);
    Primitive.prototype.constructor = Primitive;

    //draw the name of the function
    Primitive.prototype.Draw = function(){
	console.log(this.DrawName() + " = " + this.value);
    }
});
