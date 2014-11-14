//stack.js
//A test implementation of a stack.

$(document).ready(function () {
    
    Stack = function(name,type,value){
	Entity.call(this,name,type,value);
	//specific calls go here
	this.type = "stack<" + type + ">"; 
    }
    
    Stack.prototype = Object.create(Entity.prototype);
    Stack.prototype.constructor = Stack;

    //draw the name of the function
    Stack.prototype.Draw = function(){
	console.log(this.DrawName() + " = " + this.value);
    }
});
