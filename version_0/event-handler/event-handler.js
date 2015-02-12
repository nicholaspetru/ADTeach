$(document).ready(function() {   
    
    //Constructor
    EventHandler = function() {
        this.code = "";
        this.playing = false;
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
    
    EventHandler.prototype.onPlay = function() {
        console.log('Event Handler: onPlay()');
        this.visualizerHandler.goForthAll();
    };
    

    // hidden until INTERPRETED = true
    EventHandler.prototype.onPause = function() {
        console.log('Event Handler: onPause()');
    };

    // hidden until INTERPRETED = true
    EventHandler.prototype.onStep = function() {
       console.log("Event Handler: onStep()");
       this.visualizerHandler.goForthOnce();
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


    //TODO: Actually get this to modify delay appropriately...

    //takes in a value from 0-100
    //0 represents slower animation speed
    //100 represents higher animation speed
    EventHandler.prototype.onSlider = function(newDelay) {
        console.log('Event Handler: onSlider(' + newDelay + ');');
        var curDelay = this.visualizerHandler.getDelay();
        //delayMod in between 0 and 2
        //0 corresponds to newDelay of 100, represents faster animation speed
        //2 corresponds to newDelay of 0, represents slower animation speed
        var delayMod = (50-newDelay)/50;
        //delay may be set to anywhere from 0 to twice the current delay
        this.visualizerHandler.setDelay(curDelay*delayMod);
    }
});