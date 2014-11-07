$(document).ready(function () {
    
    Primitive = function(name,type,value){
        Entity.call(this);
    }
    
    Primitive.prototype = Object.create(Entity.prototype);
    Primitive.prototype.constructor = Primitive;
    
    /*
    //draw the name of the function
    Primitive.prototype.Draw = function() {
        DrawName();
        console.log(value);
    }*/

/*
    //Primitive class-- represents non-ADT variables like strings, ints, etc.
    Primitive = function(name,type,value){
    
        //inherit from Entity
        Primitive.prototype = Object.create(Entity

        //draw function
        this.Draw = function() {
            this.DrawName();
            console.log(value);
        };


    }*/

});
