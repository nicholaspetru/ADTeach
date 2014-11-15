$(document).ready(function() {    
    EventHandler = function() {
	this.CODE = "";
	this.PLAYING = false;
	this.LINENUMBER = 0;
	this.INTERPRETED = false;
	return this;
    }

    $("#play").click(function() {
        console.log('send code from textarea to Interpreter');
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
    });

    // hidden until INTERPRETED = true
    $("#pause").click(function() {
	console.log('set PLAYING=false')
    });

    // hidden until INTERPRETED = true
    $("#step").click(function() {
	console.log('VisHandler.goForth()');
    });
    // hidden until INTERPRETED = true
    $("#stop").click(function() {
	console.log('freeze the visualizer screen, unfreeze the textbox, set PLAYING=false and INTERPRETED=false');
    });
    
    // if we design the side nav like the mockup, there will likely be multiple of these (ie $("#listExample").click , $("#stackExample").click etc.)
    $("#sampleCode").click(function() {
	console.log('CODE = CodeDB.getCode(key); textbox.writeCode(CODE);');
    });

    // handle animantion?
});