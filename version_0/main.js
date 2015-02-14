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

    $("#listHelp").click(function() {
        document.getElementById("listWindow").show();
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
    });   

    $("#stackHelp").click(function() {
        try {
        document.getElementById("listWindow").close();
        } catch(InvalidStateError) {}
        try {
        document.getElementById("stackWindow").show();
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
    });    

    $("#queueHelp").click(function() {
        try {
        document.getElementById("listWindow").close();
        } catch(InvalidStateError) {}
        try {
        document.getElementById("stackWindow").close();
        } catch(InvalidStateError) {}
        try {
        document.getElementById("queueWindow").show();
        } catch(InvalidStateError) {}
        try {
        document.getElementById("graphWindow").close();
        } catch(InvalidStateError) {}
        try {
        document.getElementById("dictWindow").close();
        } catch(InvalidStateError) {}
    });    

    $("#graphHelp").click(function() {
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
        document.getElementById("graphWindow").show();
        } catch(InvalidStateError) {}
        try {
        document.getElementById("dictWindow").close();
        } catch(InvalidStateError) {}
    });    

    $("#dictHelp").click(function() {
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
        document.getElementById("dictWindow").show();
        } catch(InvalidStateError) {}
    });     

    $("#sampleList").click(function() {        
        EVH.onSampleList();
    });

    $("#sampleStack").click(function() {        
        EVH.onSampleStack();
    });

    $("#sampleQueue").click(function() {        
        EVH.onSampleQueue();
    });

    $("#samplePQueue").click(function() {        
        EVH.onSamplePQueue();
    });

    $("#sampleGraph").click(function() {        
        EVH.onSampleGraph();
    });

    $("#sampleDict").click(function() {        
        EVH.onSampleDict();
    });

    $("#slider").change(function() {
        var newDelay = $("#slider").val();
        EVH.onSlider(newDelay);
    });
    
});