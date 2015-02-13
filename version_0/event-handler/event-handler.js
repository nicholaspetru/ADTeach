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
        $("#helptext").hide();
        $("#listHelp").hide();
        $("#stackHelp").hide();
        $("#queueHelp").hide();
        $("#graphHelp").hide();
        $("#dictHelp").hide();
        try {
        document.getElementById("listWindow").close();
        } catch(InvalidStateError) {}
        try {
        document.getElementById("stackWindow").close();
        } catch(InvalidStateError) {}
        try {
        document.getElementById("queueWindow").close();
        } catch(InvalidStateError) {}
        try {
        document.getElementById("graphWindow").close();
        } catch(InvalidStateError) {}
        try {
        document.getElementById("dictWindow").close();
        } catch(InvalidStateError) {}
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
        $("#build").show();
        $("#helptext").show();
        $("#sampleList").show();
        $("#sampleStack").show();
        $("#sampleQueue").show();
        $("#sampleGraph").show();
        $("#sampleDict").show();
    };
    
    EventHandler.prototype.onSampleList = function() {
       console.log('Event Handler: onSampleList()');
       code = this.codeDatabase.getCode('list'); 
       this.codeBox.setCode(code);
    };
    
    EventHandler.prototype.onSampleStack = function() {
       console.log('Event Handler: onSampleStack()');
       code = this.codeDatabase.getCode('stack'); 
       this.codeBox.setCode(code);
    };

    EventHandler.prototype.onSampleQueue = function() {
       console.log('Event Handler: onSampleQueue()');
       code = this.codeDatabase.getCode('queue'); 
       this.codeBox.setCode(code);
    };

    EventHandler.prototype.onSampleGraph = function() {
       console.log('Event Handler: onSampleGraph()');
       code = this.codeDatabase.getCode('graph'); 
       this.codeBox.setCode(code);
    };

    EventHandler.prototype.onSampleDict = function() {
       console.log('Event Handler: onSampleDict()');
       code = this.codeDatabase.getCode('dict'); 
       this.codeBox.setCode(code);
    };


    //TODO: Actually get this to modify delay appropriately...

    //takes in a value from 0-100
    //0 represents slower animation speed
    //100 represents higher animation speed
    EventHandler.prototype.onSlider = function(newDelay) {
        console.log('Event Handler: onSlider(' + newDelay + ');');
        var delayMod = (10+newDelay)/50;
        this.visualizerHandler.setDelay(delayMod);
    }
});