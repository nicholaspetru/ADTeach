$(document).ready(function () {

    //Entity class-- the 
     CodeBox = function(){
        //constructor is here
        
        // from liz/colby's EventHandler code
        this.code = "";
        this.playing = false;
        this.lineNumber = 0;
        this.interpreted = false;

	return this;
    }
    

    // called when playing/stepping of code begins. prevents user from editing code
    CodeBox.prototype.freezeCode = function(){
        console.log("Code Box: freezeCode()");
        $("#user_textbox").prop('disabled', true);
        $("#user_textbox").css({"background-color": "#B6C5BE"});
        $("#vis_paper").css({"background-color": "#DBE6E0"});
        // freezecdoe() called if onClick(play/step) called
        // if (this.PLAYING == true) {
        //     grey out the box and prevent user from making changes
        // }
    };
    
    // called when playing/stepping of code ends. allows user to edit code
    CodeBox.prototype.unfreezeCode = function(){
        console.log("Code Box: unfreezeCode()");
        $("#user_textbox").prop('disabled', false);
        $("#user_textbox").css({"background-color": "#F0F8FF"});
        $("#vis_paper").css({"background-color": "#B6C5BE"});
    };
    
    CodeBox.prototype.setCode = function(code){
        console.log("Code Box: setCode(" + code + ")");
        this.code = code;
        var textbox = document.getElementById("user_textbox");
        textbox.value = code;
    };
    
    CodeBox.prototype.getCode = function() {
        this.code = $("#user_textbox").val();
        console.log("code: " + this.code);
        return this.code;
    };

    // aggregate code from code box
    $("#CodeBox").text = function(){

    };


    // from liz/colby's code...
    $("#Play").click(function() {
        console.log('set playing=false')
    });

});