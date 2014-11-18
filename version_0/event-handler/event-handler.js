$(document).ready(function() {   
    
    //Constructor
    EventHandler = function() {
        this.code = "";
        this.playing = false;
        this.lineNumber = 0;
        this.interpreted = false;
        this.interpreter = null;
        this.codeBox = null;
        this.codeDatabase = null;
        this.visualizerHandler = null;
        
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
        evaluated = this.interpreter.eval($("#user_textbox").text());
        $("#play").show();
        $("#pause").show();
        $("#step").show();
        $("#stop").show();
        $("#build").hide();
        $("#sample").hide();
    };
    
    EventHandler.prototype.takeStep = function() {
        //wrapper for what happens at the same time when going forth
        console.log('Event Handler: takeStep()');
        this.codeBox.highlightLine(this.lineNumber);
        this.visualizerHandler.goForth();
    };
    
    EventHandler.prototype.onPlay = function() {
        console.log('Event Handler: onPlay()');
        this.takeStep();
        // if PLAYING = false
        // CODE = (get the code from the textarea)
        //this.CODE = $('code_env#code').val();
        //console.log('this.Code = ' + this.CODE);
        // make an instance of the VisualizerHandler
        // var vizHandler = new VisualizerHandler();
        // make an instance of the symbol table with the vizHandler as a param
        // var symbols= new SymbolTable(vizHandler);
        // make an instance of the interpreter with the symbol table as a param
        // var interp = new Interpreter(symbols)
        // interp.eval(CODE)
        // if the interpreter successfully interprets the code
        // INTERPRETED = true;
        // if PLAYING = true
        // ? animate starting from the current step
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
       code = this.codeDatabase.getCode('this-will-be-a-key') 
       this.codeBox.setCode(code);
    };
});