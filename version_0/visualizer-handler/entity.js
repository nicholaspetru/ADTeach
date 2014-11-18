$(document).ready(function () {

    //Entity class-- the 
    Entity = function(name,type,value){
        //constructor is here
        this.name = name;
        this.type = type;
        this.value = value;
        
	   return this;
    }
    
    //draw the name of the function
    Entity.prototype.DrawName = function() {
	   return this.type + " " + this.name;
    };
    
});
