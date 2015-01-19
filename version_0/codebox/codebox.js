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
    
    //highlight current line of the function
    CodeBox.prototype.highlightLine = function(line) {
        console.log("Code Box: highlightLine(" + line + ")");
        // traverse lines of code in text box
        // if line in text box == line
        // draw a marker/highlight current line
        var code = $("#user_textbox").val();                                 
        var lines = code.replace(/\r\n/g, "\n").split("\n");
        var lineToHighlight = lines[line];
        //console.log(lineToHighlight);
        //figure out this plugin: http://mistic100.github.io/jquery-highlighttextarea/
    };

    // called when playing/stepping of code begins. prevents user from editing code
    CodeBox.prototype.freezeCode = function(){
        console.log("Code Box: freezeCode()");
        $("#user_textbox").prop('disabled', true);
        $("#user_textbox").css({"background-color": "#E0E0E0"});
        // freezecdoe() called if onClick(play/step) called
        // if (this.PLAYING == true) {
        //     grey out the box and prevent user from making changes
        // }
    };
    
    // called when playing/stepping of code ends. allows user to edit code
    CodeBox.prototype.unfreezeCode = function(){
        console.log("Code Box: unfreezeCode()");
        $("#user_textbox").prop('disabled', false);
        $("#user_textbox").css({"background-color": "white"});
    };
    
    CodeBox.prototype.setCode = function(code){
        console.log("Code Box: setCode(" + code + ")");
        this.code = code;
        var textbox = document.getElementById("user_textbox");
        textbox.value = code;
    };

    // aggregate code from code box
    $("#CodeBox").text = function(){

    };


    // from liz/colby's code...
    $("#Play").click(function() {
        console.log('set playing=false')
    });

});