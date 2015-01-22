$(document).ready(function () {
 /*
    var VH = new VisualizerHandler();
    var CD = new CodeDatabase();
    var EVH = new EventHandler();
    var CB = new CodeBox();
    var ST = new SymbolTable();
    VH.symbolTable = ST;
    EVH.interpreter = INT;
    EVH.codeDatabase = CD;
    EVH.codeBox = CB;
    EVH.visualizerHandler = VH;
    ST.visualizerHandler = VH;
    INT.symbolTable = ST;
    */
    //Listen to buttonz
    
    var EVH = new EventHandler();
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