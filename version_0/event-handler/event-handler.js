$(document).ready(function() {   
    
    //Constructor
    EventHandler = function() {
        this.CODE = "";
        this.PLAYING = false;
        this.LINENUMBER = 0;
        this.INTERPRETED = false;
        this.interpreter = null;
        this.codeBox = null;
        this.codeDatabase = null;
        return this;
    }
    
    //$("#play").click(function() {
    EventHandler.prototype.onPlay = function() {
        this.interpreter.eval($("#user_textbox").text());
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
        console.log('set PLAYING=false');
    };

    // hidden until INTERPRETED = true
    EventHandler.prototype.onStep = function() {
	   console.log('VisHandler.goForth()');
    };
    
    // hidden until INTERPRETED = true
    EventHandler.prototype.onStop = function() {
	   console.log('freeze the visualizer screen, unfreeze the textbox, set PLAYING=false and INTERPRETED=false');
    };
    
    // if we design the side nav like the mockup, there will likely be multiple of these (ie $("#listExample").click , $("#stackExample").click etc.)
    EventHandler.prototype.onSample = function() {
	   console.log('CODE = CodeDB.getCode(key); textbox.writeCode(CODE);');
    };

    // handle animantion?
});