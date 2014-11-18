$(document).ready(function () {
 
    var VH = new VisualizerHandler();
    var CD = new CodeDatabase("someday-this-will-be-a-database.txt");
    var EVH = new EventHandler();
    var CB = new CodeBox();
    var ST = new SymbolTable();
    var INT = new Interpreter();
    VH.symbolTable = ST;
    EVH.interpreter = INT;
    EVH.codeDatabase = CD;
    EVH.codeBox = CB;
    EVH.visualizerHandler = VH;
    ST.visualizerHandler = VH;
    INT.symbolTable = ST;
    
    //Listen to buttonz
    $("#build").click(function() {
        EVH.onBuild();
    });
    
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