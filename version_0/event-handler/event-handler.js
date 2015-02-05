$(document).ready(function() {   
    
    //Constructor
    EventHandler = function() {
        this.code = "";
        this.playing = false;
        this.lineNumber = 0;
        this.interpreted = false;
        this.interpreter = new Interpreter();
        this.codeBox = new CodeBox();
        this.codeDatabase = new CodeDatabase();
        this.visualizerHandler = new VisualizerHandler();

        
        //for now, put this code here
        $("#play").hide();
        $("#pause").hide();
        $("#step").hide();
        $("#stop").hide();
        $("#sample").show();
        $("#build").show();
        
        return this;
    }
    
    

    EventHandler.prototype.changeTime = function() {
        console.log('Event Handler: changeTime()');
        //TO-DO: Allow user to set this number by some user interface
        this.timeBetweenSteps = 2000;
    }


    //build
    EventHandler.prototype.onBuild = function() {
        console.log('Event Handler: onBuild()');
        this.codeBox.freezeCode();
        this.code = this.codeBox.getCode();
        this.interpreter.interpret(this.code, this.visualizerHandler);
        //evaluated = this.interpreter.eval($("#user_textbox").val());
        $("#play").show();
        $("#pause").show();
        $("#step").show();
        $("#stop").show();
        $("#build").hide();
        $("#sample").hide();
    };
    
    EventHandler.prototype.playStep = function() {
        //wrapper for what happens at the same time when going forth
        console.log('Event Handler: playStep()');
        this.codeBox.highlightLine(this.lineNumber);
        this.visualizerHandler.goForthAll();
    };
    
    EventHandler.prototype.takeStep = function() {
        console.log('Event Handler: takeStep()');
        this.codeBox.highlightLine(this.lineNumber);
        this.visualizerHandler.goForthOnce();
    };
    
    EventHandler.prototype.onPlay = function() {
        console.log('Event Handler: onPlay()');
        this.playStep();
    };
    

    // hidden until INTERPRETED = true
    EventHandler.prototype.onPause = function() {
        console.log('Event Handler: onPause()');
    };

    // hidden until INTERPRETED = true
    EventHandler.prototype.onStep = function() {
       console.log("Event Handler: onStep()");
       this.takeStep();
    };
    
    // hidden until INTERPRETED = true
    EventHandler.prototype.onStop = function() {
       console.log("Event Handler: onStop()");
       this.codeBox.unfreezeCode();
       this.visualizerHandler.DeleteAll();
        //show the needed buttonz
        $("#play").hide();
        $("#pause").hide();
        $("#step").hide();
        $("#stop").hide();
        $("#sample").show();
        $("#build").show();
    };
    
    EventHandler.prototype.onSample = function() {
       console.log('Event Handler: onSample()');
       code = this.codeDatabase.getCode('stack') 
       this.codeBox.setCode(code);
    };
});