/*I'm mostly going to get rid of entities-- the inheritance in JavaScript is such crap that
I don't think it's worth it.*/

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
       //paper.text(300, 200, this.name);
	   return this.type + " " + this.name;
    };
    
});
