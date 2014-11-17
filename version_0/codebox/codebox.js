$(document).ready(function () {

    //Entity class-- the 
     CodeBox = function(){
        //constructor is here
        
        // from liz/colby's EventHandler code
        this.CODE = "";
        this.PLAYING = false;
        this.LINENUMBER = 0;
        this.INTERPRETED = false;

	return this;
    }
    
    //highlight current line of the function
    CodeBox.prototype.highlightLine = function(line) {
        // traverse lines of code in text box
        // if line in text box == line
        // draw a marker/highlight current line
    };

    // called when playing/stepping of code begins. prevents user from editing code
    CodeBox.prototype.freezeCode = function(){
        // freezecdoe() called if onClick(play/step) called
        // if (this.PLAYING == true) {
        //     grey out the box and prevent user from making changes
        // }
    };

    // aggregate code from code box
    $("#CodeBox").text = function(){

    };


    // from liz/colby's code...
    $("#Play").click(function() {
        console.log('set PLAYING=false')
    });

});