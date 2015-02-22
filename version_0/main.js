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

    $("#aboutViva").click(function() {
        $("#content").empty().append('<h3><center>About Viva</center></h3>');
        $("#content").append('<p>"Viva", or <em>Visual Java</em>, is a simplified version of Java supported by ADTeach. It uses the same syntax as Java, but is built around the idea of visualizing ADTs. To this end, users will notice the following differences between Java and Viva:</p>');
        $("#content").append('<p><li>Unlike Java, users may not create their own classes or methods in Viva. For a list of supported classes and their corresponding methods, explore the help buttons above the code box.</li>');
        $("#content").append('<li>Users may not import Java libraries in Viva. This helps to ensure your code will run smoothly and quickly.</li>');
        $("#content").append('<li>Pointers do not work the same in Viva as they do in Java.  For instance, you may initialize a List to be equal to an already existing List, but changing one will not change the other as it does in Java.</li>');
        $("#content").append('<li>Primitives may or may not be initialized when instantiated, but every ADT must be intialized.</li>');
        $("#content").append('</p>');
        $("#sampleStack").hide();
        $("#sampleQueue").hide();
        $("#samplePQueue").hide();
        $("#sampleGraph").hide();
        $("#sampleWeightedGraph").hide();
        $("#sampleDict").hide();
        $("#sampleList").hide();
        $("#sampleTree").hide();
        $("#modal").show();
    });

    $("#listHelp").click(function() {
        $("#content").empty().append('<h3><center>List ADT</center></h3>');
        $("#content").append('<p><h4>Instantiation:</h4>');
        $("#content").append('List&lt;type&gt; listName = new List&lt;type&gt;();</p>');
        $("#content").append('<p><h4>Methods:</h4>');
        $("#content").append('<b>listName.add(listType x);</b> Adds element x to the end of the list<br>');
        $("#content").append('<b>listName.add(int x, listType y);</b> Adds element y to the list at index x<br>');
        $("#content").append('<b>listName.contains(listType x);</b> Returns a boolean <em>true</em> if the list contains element x, <em>false</em> if it does not<br>');
        $("#content").append('<b>listName.get(int x);</b> Returns the element at index x<br>');
        $("#content").append('<b>listName.indexOf(listType x);</b> Returns the index of element x<br>');
        $("#content").append('<b>listName.isEmpty();</b> Returns a boolean <em>true</em> if the list is empty, <em>false</em> if the list contains at least one element<br>');
        $("#content").append('<b>listName.populate(int x);</b> Empties the list, then adds x randomly generated elements of appropriate type to the list<br>');        
        $("#content").append('<b>listName.size();</b> Returns the size of the list<br>');
        $("#content").append('<b>listName.remove(int x);</b> Removes the element at index x in the list<br>');
        $("#content").append('<b>listName.set(int x, listType y);</b> Replaces the element at index x in the list with element y<br>');
        $("#content").append('<b>listName.clear();</b> Empties the list</p>');
        $("#sampleStack").hide();
        $("#sampleQueue").hide();
        $("#samplePQueue").hide();
        $("#sampleGraph").hide();
        $("#sampleWeightedGraph").hide();
        $("#sampleDict").hide();
        $("#sampleList").show();
        $("#sampleTree").hide();
        $("#modal").show();   
    });   

    $("#stackHelp").click(function() {
        $("#content").empty().append('<h3><center>Stack ADT</center></h3>');
        $("#content").append('<p><h4>Instantiation:</h4>');
        $("#content").append('Stack&lt;type&gt; stackName = new Stack&lt;type&gt;();</p>');
        $("#content").append('<p><h4>Methods:</h4>');
        $("#content").append('<b>stackName.peek();</b> Returns the top item in the stack, but does not remove it<br>');
        $("#content").append('<b>stackName.push(stackType x);</b> Adds element x to the top of the stack<br>');
        $("#content").append('<b>stackName.pop();</b> Removes and returns the top item in the stack<br>');
        $("#content").append('<b>stackName.isEmpty();</b> Returns a boolean <em>true</em> if the stack is empty, <em>false</em> if the stack contains at least one element<br>');
        $("#content").append('<b>stackName.populate(int x);</b> Empties the stack, then adds x randomly generated elements of appropriate type to the stack<br>');
        $("#content").append('<b>stackName.search(stackType x);</b> Returns the index of value x in the stack, where an index of 1 represents the top of the stack</p>');
        $("#sampleStack").show();
        $("#sampleQueue").hide();
        $("#samplePQueue").hide();
        $("#sampleGraph").hide();
        $("#sampleWeightedGraph").hide();
        $("#sampleDict").hide();
        $("#sampleList").hide();
        $("#sampleTree").hide();
        $("#modal").show();
    });    

    $("#queueHelp").click(function() {
        $("#content").empty().append('<h3><center>Queue ADT</center></h3>');
        $("#content").append('<p><h4>Instantiation:</h4>');
        $("#content").append('Queue&lt;type&gt; queueName = new Queue&lt;type&gt;();<br>');
        $("#content").append('PriorityQueue&lt;type&gt; queueName = new PriorityQueue&lt;type&gt;();</p>');
        $("#content").append('<p><h4>Methods:</h4>');
        $("#content").append('<b>queueName.peek();</b> Returns the first item in the queue, but does not remove it<br>');
        $("#content").append('<b>queueName.add(queueType x);</b> Adds element x to the end of the queue<br>');
        $("#content").append('<b>queueName.remove();</b> Removes and returns the first item in the queue<br>');
        $("#content").append('<b>queueName.isEmpty();</b> Returns a boolean <em>true</em> if the queue is empty, <em>false</em> if the queue contains at least one element<br>');
        $("#content").append('<b>queueName.populate(int x);</b> Empties the queue, then adds x randomly generated elements of appropriate type to the queue<br>');     
        $("#content").append('<b>queueName.size();</b> Returns the size of the queue</p>');        
        $("#sampleStack").hide();
        $("#sampleQueue").show();
        $("#samplePQueue").show();
        $("#sampleGraph").hide();
        $("#sampleWeightedGraph").hide();
        $("#sampleDict").hide();
        $("#sampleList").hide();
        $("#sampleTree").hide();
        $("#modal").show();
    });    

    $("#graphHelp").click(function() {
        $("#content").empty().append('<h3><center>Graph ADT</center></h3>');
        $("#content").append('<p><h4>Instantiation:</h4>');
        $("#content").append('Graph graphName = new Graph();<br>');
        $("#content").append('WeightedGraph graphName = new WeightedGraph();<br>');
        $("#content").append('<p><h4>Methods for both graph types:</h4>');
        $("#content").append('<b>graphName.addVertex();</b> Adds an edgeless vertex to the graph<br>');
        $("#content").append('<b>graphName.getInDegree(int x);</b> Returns the number of edges going into vertex x<br>');
        $("#content").append('<b>graphName.getDegree(int x);</b> Returns the number of edges coming out of vertex x<br>');
        $("#content").append('<b>graphName.getNeighbors(int x);</b> Returns a list of vertices with edges connecting them to vertex x<br>');
        $("#content").append('<b>graphName.hasEdge(int x, int y);</b> Returns a boolean <em>true</em> if there exists an edge from vertex x to vertex y, <em>false</em> otherwise<br>');
        $("#content").append('<b>graphName.populate(int x, float y);</b> Empties the graph, adds x vertices to the graph, and adds y edges from each vertex to other random vertices<br>');
        $("#content").append('<b>graphName.isEmpty();</b> Returns a boolean <em>true</em> if the graph is empty, <em>false</em> if the graph contains at least one vertex<br>');
        $("#content").append('<b>graphName.size();</b> Returns the number of vertices in the graph<br>');
        $("#content").append('<b>graphName.numEdges();</b> Returns the number of edges in the graph<br>');
        $("#content").append('<b>graphName.numVerts();</b> Returns the number of vertices in the graph<br>');
        $("#content").append('<b>graphName.removeEdge(int x, int y);</b> Removes from the graph the edge from vertex x to vertex y<br>');
        $("#content").append('<b>graphName.setDirected(boolean x);</b> Sets the graph to be directed if x=<em>true</em>, else sets the graph to be undirected</p>');
        $("#content").append('<p><h4>Methods for unweighted graphs only:</h4>');
        $("#content").append('<b>graphName.addEdge(int x, int y);</b> Adds an edge into the graph from vertex x to vertex y</p>');
        $("#content").append('<p><h4>Methods for weighted graphs only:</h4>');
        $("#content").append('<b>graphName.addEdge(int x, int y, int z);</b> Adds an edge into the graph from vertex x to vertex y with weight z<br>');
        $("#content").append('<b>graphName.setWeight(int x, int y, int z);</b> Sets the edge from vertex x to vertex y to be weight z<br>');
        $("#content").append('<b>graphName.getWeight(int x, int y);</b> Returns the weight of the edge from vertex x to vertex y</p>');
        $("#sampleStack").hide();
        $("#sampleQueue").hide();
        $("#samplePQueue").hide();
        $("#sampleGraph").show();
        $("#sampleWeightedGraph").show();
        $("#sampleDict").hide();
        $("#sampleList").hide();
        $("#sampleTree").hide();
        $("#modal").show();
    });    

    $("#dictHelp").click(function() {
        $("#content").empty().append('<h3><center>Dictionary ADT</center></h3>');
        $("#content").append('<p><h4>Instantiation:</h4>');
        $("#content").append('Dictionary<keyType, valType> dictName = new Dictionary<keyType, valType>();<br>');
        $("#content").append('<p><h4>Methods:</h4>');
        $("#content").append('<b>dictName.put(keyType x, valType y);</b> Adds the key-value pair {x,y} to the dictionary<br>');
        $("#content").append('<b>dictName.remove(keyType x);</b> Removes the pair associated with key x from the dictionary<br>');
        $("#content").append('<b>dictName.populate(int x);</b> Empties the dictionary, then adds x randomly generated key-value pairs<br>');
        $("#content").append('<b>dictName.get(keyType x);</b> Returns the value associated with key x in the dictionary<br>');
        $("#content").append('<b>dictName.elements();</b> Returns a list of all key-value pairs in the dictionary<br>');
        $("#content").append('<b>dictName.isEmpty();</b> Returns a boolean <em>true</em> if the dictionary is empty, <em>false</em> if the dictionary contains at least one key-value pair<br>');
        $("#content").append('<b>dictName.keys();</b> Returns a list of all keys in the dictionary<br>');
        $("#content").append('<b>dictName.size();</b> Returns the number of key-value pairs in the dictionary</p>');
        $("#sampleStack").hide();
        $("#sampleQueue").hide();
        $("#samplePQueue").hide();
        $("#sampleGraph").hide();
        $("#sampleWeightedGraph").hide();
        $("#sampleDict").show();
        $("#sampleList").hide();
        $("#sampleTree").hide();
        $("#modal").show();
    });

    $("#treeHelp").click(function() {
        $("#content").empty().append('<h3><center>Tree ADT</center></h3>');
        $("#content").append('<p><h4>Instantiation:</h4>');
        $("#content").append('Tree treeName = new Tree();');
        $("#content").append('<p><h4>Methods:</h4>');
        $("#content").append('<b>treeName.setRoot(int x);</b> Sets vertex x to be the root of the tree<br>');
        $("#content").append('<b>treeName.populate(int x);</b> Empties the tree, then populates it with x nodes<br>');
        $("#content").append('<b>treeName.removeVertex(int x);</b> Removes vertex x from the tree<br>');
        $("#content").append('<b>treeName.removeChild(int x, int y);</b> Removes the y<sup>th</sup> child of vertex x from the tree<br>');
        $("#content").append('<b>treeName.getChild(int x, int y);</b> Returns the y<sup>th</sup> child of vertex x in the tree<br>');
        $("#content").append('<b>treeName.getChildren(int x);</b> Returns a list of all children of vertex x in the tree<br>');
        $("#content").append('<b>treeName.getParent(int x);</b> Returns the parent of vertex x in the tree<br>');
        $("#content").append('<b>treeName.addChild(int x, int y);</b> Sets vertex y to be the child of vertex x<br>');
        $("#content").append('<b>treeName.addChild(int x, int y, int z);</b> Sets vertex y to be the z<sup>th</sup> child of vertex x, where z is either 0 or 1</p>');
        $("#sampleStack").hide();
        $("#sampleQueue").hide();
        $("#samplePQueue").hide();
        $("#sampleGraph").hide();
        $("#sampleWeightedGraph").hide();
        $("#sampleDict").hide();
        $("#sampleList").hide();
        $("#sampleTree").show();
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

    $("#sampleWeightedGraph").click(function() {        
        EVH.onSampleWeightedGraph();
    });

    $("#sampleTree").click(function() {        
        EVH.onSampleTree();
    });

    $("#sampleDict").click(function() {        
        EVH.onSampleDict();
    });

    $("#slider").change(function() {
        var newDelay = $("#slider").val();
        EVH.onSlider(newDelay);
    });
    
});