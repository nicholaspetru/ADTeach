$(document).ready(function () {
 
    var VH = new VisualizerHandler();
    var CD = new CodeDatabase("someday-this-will-be-a-database.txt");
    var EVH = new EventHandler();
    var CB = new CodeBox();
    var ST = new SymbolTable();
    var INT = new Interpreter();
    EVH.interpreter = INT;
    EVH.codeDatabase = CD;
    ST.visualizerHandler = VH;
    INT.symbolTable = ST;
    
    console.log("boop boop compu-talk.");
    
    //Listen to buttonz
    $("#play").click(function() {
        EVH.onPlay();
    });
    
    $("#pause").click(function() {        
        EVH.onPause();
    });
    
    $("#step").click(function() {        
        EVH.onStep();
    });
    
    $("#stop").click(function() {        
        EVH.onStop();
    });    
    
    $("#sample").click(function() {        
        EVH.onSample();
    });
    
});