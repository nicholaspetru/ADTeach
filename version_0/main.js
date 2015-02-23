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
    
    $("#help").click(function() {
        $("#helptext").show();
        $("#listHelp").show();
        $("#stackHelp").show();
        $("#queueHelp").show();
        $("#graphHelp").show();
        $("#treeHelp").show();
        $("#dictHelp").show();
        $("#help").hide();
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
        $("#content").empty().append('<h3><center>Programming in ADTeach</center></h3>');
        $("#content").append('<p>"Viva", or <em>Visual Java</em>, is a simplified version of Java supported by ADTeach. It uses the same syntax as Java, but is built around the idea of visualizing ADTs. To this end, users will notice the following differences between Java and Viva:</p>');
        $("#content").append('<p><li>Unlike Java, users may not create their own classes or methods in Viva. For a list of supported classes and their corresponding methods, explore the help buttons above the code box.</li>');
        $("#content").append('<li>Users may not import Java libraries in Viva. This helps to ensure your code will run smoothly and quickly.</li>');
        $("#content").append('<li>Pointers do not work the same in Viva as they do in Java.  For instance, you may initialize a List to be equal to an already existing List, but changing one will not change the other as it does in Java.</li>');
        $("#content").append('<li>Primitives may or may not be initialized when instantiated, but every ADT must be intialized.</li>');
        $("#content").append('</p><p>For more help getting started with programming in Viva, check out the sample code for each ADT contained in the help buttons above the code box!</p><p>Bring your code to life with Viva!</p>');
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
        $("#content").append('List&lt;*type&gt; listName = new List&lt;*type&gt;();</p>');
        $("#content").append('*type = String || Integer || Float');
        $("#content").append('<p><h4>Methods:</h4>');
        $("#content").append("<p>");
        $("#content").append('<style type="text/css">.tftable {font-size:12px;color:#333333;width:100%;border-width: 1px;border-color:#000000;border-collapse: collapse;}.tftable \
                        th {font-size:14px;border-width: 1px;padding: 8px;border-style: solid;border-color: #000000;text-align:left;}.tftable \
                        td {font-size:14px;border-width: 1px;padding: 8px;border-style: solid;border-color: #000000;text-align:left;}.tftable \
                        tr {background-color:#d4e3e5;}.tftable</style><table class="tftable" border="1"> \
                    <tr><th>add(*type x)</th><td>Adds element x to the end of the list</td></tr> \
                    <tr><th>add(int x, *type y)</th><td>Adds element y to the list at index x</td></tr> \
                    <tr><th>contains(*type x)</th><td>Returns a boolean true if the list contains element x, false if it does not</td></tr>\
                    <tr><th>get(int x)</th><td>Returns the element at index x</td></tr> \
                    <tr><th>indexOf(*type x)</th><td>Returns the index of element x</td></tr> \
                    <tr><th>isEmpty()</th><td>Returns a boolean true if the list is empty, false if the list contains at least one element</td></tr>\
                    <tr><th>size()</th><td>Returns the size of the list</td></tr> \
                    <tr><th>remove(int x)</th><td>Removes the element at index x in the list</td></tr> \
                    <tr><th>set(int x, *type y)</th><td>Replaces the element at index x in the list with element y</td></tr> \
                    <tr><th>clear()</th><td>Empties the list</td></tr>\
                    <tr><th>populate(int x)</th><td>Empties the list, then adds x randomly generated elements of appropriate type to the list</td></tr> \</table>');
        $("#content").append("</p>");
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
        $("#content").append('Stack&lt;*type&gt; stackName = new Stack&lt;*type&gt;();</p>');
        $("#content").append('*type = String || Integer || Float');
        $("#content").append('<p><h4>Methods:</h4>');
        $("#content").append("<p>");
        $("#content").append('<style type="text/css">.tftable {font-size:12px;color:#333333;width:100%;border-width: 1px;border-color:#000000;border-collapse: collapse;}.tftable \
                        th {font-size:14px;border-width: 1px;padding: 8px;border-style: solid;border-color: #000000;text-align:left;}.tftable \
                        td {font-size:14px;border-width: 1px;padding: 8px;border-style: solid;border-color: #000000;text-align:left;}.tftable \
                        tr {background-color:#d4e3e5;}.tftable</style><table class="tftable" border="1"> \
                    <tr><th>push(*type x)</th><td>Adds element x to the top of the stack</td></tr> \
                    <tr><th>pop()</th><td>Removes and returns the top item in the stack</td></tr>\
                    <tr><th>peek()</th><td>Returns the top item in the stack, but does not remove it</td></tr> \
                    <tr><th>isEmpty()</th><td>Returns a boolean true if the stack is empty, false if the stack contains at least one element</td></tr>\
                    <tr><th>search(*type x)</th><td>Returns the index of value x in the stack, where an index 1 represents the top of the stack</td></tr>\
                    <tr><th>populate(int x)</th><td>Empties the stack, then adds x randomly generated elements of appropriate type to the stack</td></tr></table>');
        $("#content").append("</p>");
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
        $("#content").append('Queue&lt;*type&gt; queueName = new Queue&lt;*type&gt;();<br></p>');
        $("#content").append('<p>PriorityQueue&lt;*type&gt; queueName = new PriorityQueue&lt;*type&gt;();</p>');
        $("#content").append('*type = String || Integer || Float');
        $("#content").append('<p><h4>Methods:</h4>');
        $("#content").append("<p>");
        $("#content").append('<style type="text/css">.tftable {font-size:12px;color:#333333;width:100%;border-width: 1px;border-color:#000000;border-collapse: collapse;}.tftable \
                        th {font-size:14px;border-width: 1px;padding: 8px;border-style: solid;border-color: #000000;text-align:left;}.tftable \
                        td {font-size:14px;border-width: 1px;padding: 8px;border-style: solid;border-color: #000000;text-align:left;}.tftable \
                        tr {background-color:#d4e3e5;}.tftable</style><table class="tftable" border="1"> \
                    <tr><th>add(*type x)</th><td>Adds element x to the end of the queue (and then sorts for a priority queue)</td></tr> \
                    <tr><th>remove()</th><td>Removes and returns the first item in the queue</td></tr>\
                    <tr><th>peek()</th><td>Returns the first item in the queue, but does not remove it</td></tr> \
                    <tr><th>isEmpty()</th><td>Returns a boolean true if the queue is empty, false if the queue contains at least one element</td></tr>\
                    <tr><th>size()</th><td>Returns the size of the queue</td></tr> \
                    <tr><th>populate(int x)</th><td>Empties the queue, then adds x randomly generated elements of appropriate type to the queue</td></tr></table>');
        $("#content").append("</p>");
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
        $("#content").append('Graph graphName = new Graph();<br></p>');
        $("#content").append('<p>WeightedGraph graphName = new WeightedGraph();<br></p>');
        $("#content").append('<p><h4>Methods for both graph types:</h4>');
        
        $("#content").append('<style type="text/css">.tftable {font-size:12px;color:#333333;width:100%;border-width: 1px;border-color:#000000;border-collapse: collapse;}.tftable \
                        th {font-size:14px;border-width: 1px;padding: 8px;border-style: solid;border-color: #000000;text-align:left;}.tftable \
                        td {font-size:14px;border-width: 1px;padding: 8px;border-style: solid;border-color: #000000;text-align:left;}.tftable \
                        tr {background-color:#d4e3e5;}.tftable</style><table class="tftable" border="1"> \
                    <tr><th>addVertex()</th><td>Adds an edgeless vertex to the graph</td></tr> \
                    <tr><th>getDegree(int x)</th><td>Returns the number of edges going out of vertex x</td></tr>\
                    <tr><th>getInDegree(int x)</th><td>Returns the number of edges going into vertex x</td></tr>\
                    <tr><th>getNeighbors(int x)</th><td>Returns a List&lt;Integer&gt; of vertices connected to x (for directed graphs, neighbors x is pointing <i>to</i>)</td></tr> \
                    <tr><th>hasEdge(int x, int y)</th><td>Returns a boolean true if there exists an edge from vertex x to vertex y, false otherwise</td></tr>\
                    <tr><th>isEmpty()</th><td>Returns a boolean true if the graph is empty, false if the graph contains at least one vertex</td></tr> \
                    <tr><th>numVerts()</th><td>Returns the number of vertices in the graph</td></tr> \
                    <tr><th>numEdges()</th><td>Returns the number of edges in the graph</td></tr> \
                    <tr><th>removeEdge(int x, int y)</th><td>Removes the edge from vertex x to vertex y</td></tr> \
                    <tr><th>setDirected(boolean x)</th><td>Sets the graph to be directed if x is true, else sets the graph to be undirected.  All graphs are undirected by default</td></tr> \
                    <tr><th>populate(int x, float y)</th><td>Empties the graph, adds x vertices with each vertex having possibility y of being connected to each other node.  y = 0 is a completely unconnected graph, y = 1 is a completely connected graph</td></tr></table>');
        $("#content").append("</p>");
        
        $("#content").append('<p><h4>Methods for unweighted graphs only:</h4>');
        $("#content").append('<style type="text/css">.tftable {font-size:12px;color:#333333;width:100%;border-width: 1px;border-color:#000000;border-collapse: collapse;}.tftable \
                        th {font-size:14px;border-width: 1px;padding: 8px;border-style: solid;border-color: #000000;text-align:left;}.tftable \
                        td {font-size:14px;border-width: 1px;padding: 8px;border-style: solid;border-color: #000000;text-align:left;}.tftable \
                        tr {background-color:#d4e3e5;}.tftable</style><table class="tftable" border="1"> \
                    <tr><th>addEdge(int x, int y)</th><td>Adds an edge from vertex x to vertex y</td></tr></table>');
        $("#content").append("</p>");
        
        
        $("#content").append('<p><h4>Methods for weighted graphs only:</h4>');
        $("#content").append('<style type="text/css">.tftable {font-size:12px;color:#333333;width:100%;border-width: 1px;border-color:#000000;border-collapse: collapse;}.tftable \
                        th {font-size:14px;border-width: 1px;padding: 8px;border-style: solid;border-color: #000000;text-align:left;}.tftable \
                        td {font-size:14px;border-width: 1px;padding: 8px;border-style: solid;border-color: #000000;text-align:left;}.tftable \
                        tr {background-color:#d4e3e5;}.tftable</style><table class="tftable" border="1"> \
                    <tr><th>addEdge(int x, int y, int z)</th><td>Adds an edge from vertex x to vertex y with weight z</td></tr>\
                    <tr><th>setWeight(int x, int y, int z)</th><td>Sets the edge from vertex x to vertex y to be weight z</td></tr> \
                    <tr><th>getWeight(int x, int y)</th><td>Returns the weight of the edge from vertex x to vertex y</td></tr></table>');
        $("#content").append("</p>");
        


        
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
        $("#content").append('Dictionary<*keyType, *valType> dictName = new Dictionary<*keyType, *valType>();<br></p>');
        $("#content").append('<p>*keyType = String || Integer || Float');
        $("#content").append('*valType = String || Integer || Float</p>');
        $("#content").append('<p><h4>Methods:</h4>');
        
        $("#content").append("<p>");
        $("#content").append('<style type="text/css">.tftable {font-size:12px;color:#333333;width:100%;border-width: 1px;border-color:#000000;border-collapse: collapse;}.tftable \
                        th {font-size:14px;border-width: 1px;padding: 8px;border-style: solid;border-color: #000000;text-align:left;}.tftable \
                        td {font-size:14px;border-width: 1px;padding: 8px;border-style: solid;border-color: #000000;text-align:left;}.tftable \
                        tr {background-color:#d4e3e5;}.tftable</style><table class="tftable" border="1"> \
                    <tr><th>put(*keyType x, *valType y)</th><td>Adds the key-value pair {x:y} to the dictionary (if key x is not already in dictionary)</td></tr> \
                    <tr><th>remove(*keyType x)</th><td>Removes the pair associated with key x from the dictionary</td></tr>\
                    <tr><th>get(*keyType x)</th><td>Returns the value associated with key x in the dictionary</td></tr> \
                    <tr><th>elements()</th><td>Returns a List&lt;*valType&gt; of all values in the dictionary</td></tr>\
                    <tr><th>keys()</th><td>Returns a List&lt;*keyType&gt; of all keys in the dictionary</td></tr>\
                    <tr><th>size()</th><td>Returns the number of key-value pairs in the dictionary</td></tr>\
                    <tr><th>isEmpty()</th><td>Returns a boolean true if the dictionary is empty, false if the dictionary contains at least one key-value pair</td></tr>\
                    <tr><th>populate(int x)</th><td>Empties the dictionary, then adds x randomly generated key-value pairs</td></tr></table>');
        $("#content").append("</p>");
        
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
        
        $("#content").append("<p>");
        $("#content").append('<style type="text/css">.tftable {font-size:12px;color:#333333;width:100%;border-width: 1px;border-color:#000000;border-collapse: collapse;}.tftable \
                        th {font-size:14px;border-width: 1px;padding: 8px;border-style: solid;border-color: #000000;text-align:left;}.tftable \
                        td {font-size:14px;border-width: 1px;padding: 8px;border-style: solid;border-color: #000000;text-align:left;}.tftable \
                        tr {background-color:#d4e3e5;}.tftable</style><table class="tftable" border="1"> \
                    <tr><th>setRoot(int x)</th><td>Sets vertex x to be the root of the tree</td></tr> \
                    <tr><th>removeVertex(int x)</th><td>Removes vertex x (and subsequent subtree) from the tree</td></tr>\
                    <tr><th>removeChild(int x, int y)</th><td>Removes the y<sup>th</sup> child of vertex x (and subsequent subtree) from the tree</td></tr> \
                    <tr><th>getChild(int x, int y)</th><td>Returns the y<sup>th</sup> child of vertex x in the tree</td></tr>\
                    <tr><th>getChildren(int x)()</th><td>Returns a List&lt;Integer&gt; of all children of vertex x in the tree</td></tr>\
                    <tr><th>getParent(int x)</th><td>Returns the parent of vertex x in the tree</td></tr>\
                    <tr><th>addChild(int x, int y)</th><td>Sets vertex y to be child of vertex x</td></tr>\
                    <tr><th>addChild(int x, int y, int z)</th><td>Sets vertex y to be the z<sup>th</sup> child of vertex x, where z is either 0 or 1</td></tr>\
                    <tr><th>populate(int x)</th><td>Empties the tree, then creates a random binary tree of x vertices</td></tr>\</table>');
        $("#content").append("</p>");
        
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

    $("#user_textbox").on('change keyup paste', function() {
        var scrollHeight = document.getElementById('user_textbox').scrollHeight;
        if (scrollHeight > 340) {
            $("#user_textbox").height( scrollHeight-4+'px' );
        }
    });
    
});