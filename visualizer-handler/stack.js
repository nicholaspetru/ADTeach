$(document).ready(function () {

    //Stack class
    Stack = function(id){
        //constructor is here
        this.id = id;
        $("#main").append('<p> Stack ' + id + ' initialized.</p>');
        
        //sample stack push
        this.push = function(words) {
            $("#main").append('<p> Stack ' + id + 'called push '+ words + '</p>');
        };
        console.log(typeof push);

    }

});