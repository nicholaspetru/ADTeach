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
    $("#modal").hide();
    $("#highlight_paper").hide();
    
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
        $("#content").empty().append('<h3><center>List ADT</center></h3>');
        $("#content").append('<p><h4>Instantiation:</h4>');
        $("#content").append('List&lt;type&gt; listName = new List&lt;type&gt;();</p>');
        $("#content").append('<p><h4>Methods:</h4>');
        $("#content").append('<b>listName.add(x);</b> Adds element x to the end of the list<br>');
        $("#content").append('<b>listName.add(x,y);</b> Adds element y to the list at index x<br>');
        $("#content").append('<b>listName.contains(x);</b> Returns a boolean <em>true</em> if the list contains element x, <em>false</em> if it does not<br>');
        $("#content").append('<b>listName.get(x);</b> Returns the element at index x<br>');
        $("#content").append('<b>listName.indexOf(x);</b> Returns the index of element x<br>');
        $("#content").append('<b>listName.isEmpty();</b> Returns a boolean <em>true</em> if the list is empty, <em>false</em> if the list contains at least one element<br>');
        $("#content").append('<b>listName.populate(x);</b> Empties the list, then adds x randomly generated elements of appropriate type to the list<br>');        
        $("#content").append('<b>listName.size();</b> Returns the size of the list<br>');
        $("#content").append('<b>listName.remove(x);</b> Removes the element at index x in the list<br>');
        $("#content").append('<b>listName.set(x,y);</b> Replaces the element at index x in the list with element y<br>');
        $("#content").append('<b>listName.clear();</b> Empties the list</p>');
        $("#sampleStack").hide();
        $("#sampleQueue").hide();
        $("#samplePQueue").hide();
        $("#sampleGraph").hide();
        $("#sampleDict").hide();
        $("#sampleList").show();
        $("#modal").show();   
    });   

    $("#stackHelp").click(function() {
        $("#content").empty().append('<h3><center>Stack ADT</center></h3>');
        $("#content").append('<p><h4>Instantiation:</h4>');
        $("#content").append('Stack&lt;type&gt; stackName = new Stack&lt;type&gt;();</p>');
        $("#content").append('<p><h4>Methods:</h4>');
        $("#content").append('<b>stackName.peek();</b> Returns the top item in the stack, but does not remove it<br>');
        $("#content").append('<b>stackName.push(x);</b> Adds element x to the top of the stack<br>');
        $("#content").append('<b>stackName.pop();</b> Removes and returns the top item in the stack<br>');
        $("#content").append('<b>stackName.isEmpty();</b> Returns a boolean <em>true</em> if the stack is empty, <em>false</em> if the stack contains at least one element<br>');
        $("#content").append('<b>stackName.populate(x);</b> Empties the stack, then adds x randomly generated elements of appropriate type to the stack<br>');
        $("#content").append('<b>stackName.search(x);</b> Returns the index of value x in the stack, where an index of 1 represents the top of the stack</p>');
        $("#sampleStack").show();
        $("#sampleQueue").hide();
        $("#samplePQueue").hide();
        $("#sampleGraph").hide();
        $("#sampleDict").hide();
        $("#sampleList").hide();
        $("#modal").show();
    });    

    $("#queueHelp").click(function() {
        $("#content").empty().append('<h3><center>Queue ADT</center></h3>');
        $("#content").append('<p><h4>Instantiation:</h4>');
        $("#content").append('Queue&lt;type&gt; queueName = new Queue&lt;type&gt;();<br>');
        $("#content").append('PriorityQueue&lt;type&gt; queueName = new PriorityQueue&lt;type&gt;();</p>');
        $("#content").append('<p><h4>Methods:</h4>');
        $("#content").append('<b>queueName.peek();</b> Returns the first item in the queue, but does not remove it<br>');
        $("#content").append('<b>queueName.add(x);</b> Adds element x to the end of the queue<br>');
        $("#content").append('<b>queueName.remove();</b> Removes and returns the first item in the queue<br>');
        $("#content").append('<b>queueName.isEmpty();</b> Returns a boolean <em>true</em> if the queue is empty, <em>false</em> if the queue contains at least one element<br>');
        $("#content").append('<b>queueName.populate(x);</b> Empties the queue, then adds x randomly generated elements of appropriate type to the queue<br>');     
        $("#content").append('<b>queueName.size(x);</b> Returns the size of the queue</p>');        
        $("#sampleStack").hide();
        $("#sampleQueue").show();
        $("#samplePQueue").show();
        $("#sampleGraph").hide();
        $("#sampleDict").hide();
        $("#sampleList").hide();
        $("#modal").show();
    });    

    $("#graphHelp").click(function() {
        $("#content").empty().append('<h3><center>Graph ADT</center></h3>');
        $("#content").append('<p>Stuff about graphs...</p>');
        $("#sampleStack").hide();
        $("#sampleQueue").hide();
        $("#samplePQueue").hide();
        $("#sampleGraph").show();
        $("#sampleDict").hide();
        $("#sampleList").hide();
        $("#modal").show();
    });    

    $("#dictHelp").click(function() {
        $("#content").empty().append('<h3><center>Dictionary ADT</center></h3>');
        $("#content").append('<p>Stuff about dicts...</p>');
        $("#sampleStack").hide();
        $("#sampleQueue").hide();
        $("#samplePQueue").hide();
        $("#sampleGraph").hide();
        $("#sampleDict").show();
        $("#sampleList").hide();
        $("#modal").show();
    });     

    $("#exitModal").click(function() {
        $("#modal").hide();
    });


    $("#sampleList").click(function() {   
        console.log("hi");     
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