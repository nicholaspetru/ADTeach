/**
*
* Weighted Graph ADT
* Types supported: All verticies are integers
* Methods supported: hasEdge, getWeight, setWeight, addVertex, getDegree, getInDegree, getOutDegree, getNeighbors, getEdges, getVerticies, addEdge, removeEdge, populate, numEdges, numVerts, clear, isEmpty, 'setDirected
* 
* Authors: Colby Seyferth and Sarah LeBlanc
* ADTeach Team
*
*/

$(document).ready(function () {

    VWeightedGraph = function() {
    }
    
    /**
    *
    * Return the supported methods for the Weighted Graph ADT
    *
    *@return {Object} List of supported methods
    *
    **/
    VWeightedGraph.prototype.listMethods = function() {
        var methods = ['hasEdge', 'getWeight', 'setWeight', 'addVertex', 'getDegree', 'getInDegree', 'getOutDegree', 'getNeighbors', 'getEdges', 'getVerticies', 'addEdge', 'removeEdge', 'populate', 'numEdges', 'numVerts', 'clear', 'isEmpty', 'setDirected'];
        return methods;
    }
    
    
    /**
    *
    *Error checking for number of parameters needed against number of parameters given
    *
    *@param {string} method - The method being called
    *@param {Object} parameters - The list of parameters being passed in
    *
    *@return {Boolean} Returns true if the number of given parameters matches number of 
    *                   required parameters for method.
    *
    **/
    VWeightedGraph.prototype.checkParameters = function(method, parameters) {
        
        //Separate the supported methods based on how many parameters they take
        //Check the number of needed parameters against the number of given parameters
        var noParam = ['getVerticies', 'addVertex', 'numEdges', 'numVerts', 'clear', 'isEmpty'];
        if (noParam.indexOf(method) >= 0) {
            if (parameters.length != 0) {
                console.log("zero parameters needed");
                return false;
            }
        }
        var oneParam = ['getDegree', 'getInDegree', 'getOutDegree', 'getNeighbors', 'setDirected'];
        if (oneParam.indexOf(method) >= 0) {
            if (parameters.length != 1) {
                console.log("one parameters needed");
                return false;
            }
        }
        var twoParam = ['removeEdge', 'populate', 'hasEdge', 'getWeight'];
        if (twoParam.indexOf(method) >= 0) {
            if (parameters.length != 2) {
                console.log("two parameters needed");
                return false;
            }
        }
        var threeParam = ['addEdge', 'setWeight'];
        if (threeParam.indexOf(method) >= 0) {
            if (parameters.length != 3) {
                console.log("three parameters needed");
                return false;
            }
        }
        return true;
    }
    
    /**
    *
    * Performs the method 
    *
    *@param {string} type - the type of Weighted Graph
    *@param {string} method - the method being called
    *@param {Object} parameters - a list of the parameters passed in
    *@param {Object} env - the working environment
    *@param {Object} root - the FunCall block 
    *@param {string} adt - the variable name for the ADT
    *
    *@return {Object} [returnValue, valueCopy, valType] - a list containing the value returned from method,
    *                       the updated value of the ADT, and the correct type of the returned value.
    *
    **/
    VWeightedGraph.prototype.performMethod = function(type, method, parameters, env, root, adt) {
        var returnValue = null;
        var origValue = env.getVariables()[env.getIndex(adt)].value;
        var valueCopy = [];
        var isDirected = origValue[1];
        var neighborNeigh = [];
        for (var i = 0; i<origValue[0].length; i++){
            valueCopy[i]=(origValue[0][i]);   
        }

        //Decide which method to perform
        
        //SetDirected method
        //Parameters:   setDirected(boolean) - make graph directed or undirected
        //Returns:      nothing
        //              Changes format of graph depending on what it was before
        //              and making it directed or undirected
        if (method == "setDirected") {

            //Check to make sure parameter is a boolean
            if (parameters[0].value != true && parameters[0].value != false) {
                env.throwError(root.linenum, "Must set directed to true or false");
                root.error();
            }

            //If making a graph directed, the current value of the graph does not need to change
            //but the directed value is set to true
            if (parameters[0].value == true) {
                isDirected = true;
                return [returnValue, [valueCopy, isDirected]];
            }

            //If making a graph undirected, each node needs to have it's current in neighbors become it's out neighbors
            if (parameters[0].value == false) {
                isDirected = false;
                for (var currVertex = 0; currVertex < valueCopy.length; currVertex++) {
                    var vertexNeighbors = valueCopy[currVertex];

                    for (var neighbor = 0; neighbor < vertexNeighbors.length; neighbor++) {
                        
                        var currNeighbor = vertexNeighbors[neighbor][0];
                        var neighborNeigh = valueCopy[currNeighbor];

                        var edgeCheck = false;
                        for (var i = 0; i<neighborNeigh.length; i++){
                            if (neighborNeigh[i][0] == currVertex) edgeCheck = true;
                        }

                        
                        if (!edgeCheck) {
                            var weight = vertexNeighbors[neighbor][1];
                            neighborNeigh.push([currVertex, weight]);
                        }
                    }
                    valueCopy[currNeighbor] = neighborNeigh;                    
                }
                return [returnValue, [valueCopy, isDirected], "WeightedGraph"];
            }
            
        } 
        
        //AddEdge method
        //Parameters:   addEdge(node1Int, node2Int, weight) - adds an edge from node1 to node2
        //Returns:      nothing
        //              updates the neighbor lists to include node2 in node1 (and node1 in node2 in undirected graphs)        
        if (method == "addEdge"){ 
            //Throws error if parameters are not an integers
            if (typeof parameters[0].value != typeof 2 || typeof parameters[1].value != typeof 2 || typeof parameters[2].value != typeof 2) {
                env.throwError(root.linenum, "Parameters must be integers");
                root.error();
            }
            var node1 = parameters[0].value;
            var node2 = parameters[1].value;
            var weight = parameters[2].value;

            //if the node is not in the graph
            if (node1 > valueCopy.length || node2 > valueCopy.length){
                env.throwError(root.linenum, "Vertex not in graph");
                this.error();
            }
            
            var node1Edges = valueCopy[node1];
            var node2Edges = valueCopy[node2];
            var edgeCheck = false;

            for (var i = 0; i < node1Edges.length; i++){
                console.log(node1Edges[i][0]);
                console.log(node2);
                if (node1Edges[i][0] == node2) edgeCheck = true;
            }
            if (edgeCheck){
                env.throwError(root.linenum, "Error! Edge in graph already");
                root.error();
            }

            node1Edges.push([node2, weight]);
            if (isDirected != true) node2Edges.push([node1, weight]);
            
            return [returnValue, [valueCopy, isDirected], "WeightedGraph"];  
        } 

        //Populate method
        //Parameters:   populate(numOfNodes, linkingProbability) - an integer for how many nodes are in the graph, and a float 
        //                      between 0 and 1 for the linking probability for each pair of nodes
        //Returns:      nothing
        //              randomly populates the graph 
        if (method == "populate") {

            //Throws error if first parameter is not an integer or if second parameter is not a float
            if (typeof parameters[0].value != typeof 2) {
                env.throwError(root.linenum, "Parameters must be an integer and a float");
                root.error();
            }
            if (parameters[1].value != 1 && parameters[1].value != 0 && parameters[1].value[1] != "float") {
                env.throwError(root.linenum, "Make sure the second parameter is a float between 0 and 1");
                root.error();
            }

            //Make sure the linking probability is between 0 and 1
            console.log("Linking probability is: ", parameters[1].value[0]);
            if (0 > parameters[1].value[0] || parameters[1].value[0] > 1) {
                env.throwError(root.linenum, "Make sure the second parameter is a float between 0 and 1");
            }

            var numNodes = parameters[0].value;
            var density = parameters[1].value;

            //Create a random number for each of the other nodes, and if it is less than the density,
            //make those nodes neighbors with random weight
            for (var i = 0; i < numNodes; i++) {
                valueCopy.push([]);
                for (var j = 0; j < i; j++) {
                    var prob = (Math.random()* (0 - 1) + 1).toFixed(2);
                    var weight = Math.floor((Math.random() * 10) + 1);
                    if (prob < density) {
                        iEdge = valueCopy[i];
                        jEdge = valueCopy[j];
                        iEdge.push([j, weight]);
                        if (isDirected != true) jEdge.push([i, weight]);
                        else {
                            prob = (Math.random()* (0 - 1) + 1).toFixed(2);
                            if (prob < density) jEdge.push([i, weight]);
                        }
                    }
                }
            }
            return [returnValue, [valueCopy, isDirected], "WeightedGraph"];
        }
        
        //RemoveEdge method
        //Parameters:       removeEdge(node1Int, node2Int) - two integers each representing a node
        //Returns:          nothing
        //                  removes edge going from node1 to node2 in graph
        //                  (in undirected graph removes edge going from node2 to node1)
        if (method == "removeEdge") {
            var node1 = parameters[0].value;
            var node2 = parameters[1].value;
            var node1Edges = valueCopy[node1];
            var node2Edges = valueCopy[node2];
            var node1NEdges = [];
            var node2NEdges = [];
            var edgeCheck = false;
            
            //Make sure that both nodes exist in the graph
            if (node1 >= valueCopy.length || node2 >= valueCopy.length){
                env.throwError(root.linenum, "Vertex not in graph");
                root.error();
            }

            for (var i = 0; i < node1Edges.length; i++){
                if (node1Edges[i][0] == node2) edgeCheck = true;
            }

            if (!edgeCheck) {
                env.throwError(root.linenum);
                env.throwError(root.linenum, "Edge is not in graph");
                root.error();
            } else {
                for (var i = 0; i < node1Edges.length; i++) {
                    var currEdge = node1Edges[i];
                    if (currEdge[0] != node2) {
                        node1NEdges.push(currEdge);
                    }
                }
                valueCopy[node1] = node1NEdges;
                
                if (isDirected != true){
                    for (var j = 0; j < node2Edges.length; j++) {
                        var curr2Edge = node2Edges[j];
                        if (curr2Edge[0] != node1) {
                            node2NEdges.push(curr2Edge);
                        }
                    }
                    valueCopy[node2] = node2NEdges;
                } else{
                    valueCopy[node2] = node2Edges;
                }
                
                return [returnValue, [valueCopy, isDirected], "WeightedGraph"];
            }
        }
        
        //AddVertex method
        //Parameters:       none
        //Returns:          nothing
        //                  Adds a vertex with no neighbors to graph
        if (method == "addVertex") {
            valueCopy.push([]);
            return [returnValue, [valueCopy, isDirected], "WeightedGraph"];
        }

        //GetVertices method
        //Parameters:   none
        //Returns:      a List<Integer> of the vertices 
        //              does not change content of graph
        if (method == "getVertices") {
            returnValue = [];
            for (var i = 0; i < valueCopy.length; i++) {
                returnValue.push(i)[0];
            }
            return [returnValue, [valueCopy, isDirected], "List<Integer>"];
        }

        if (method == "getDegree") {
            if (isDirected == true) {
                env.throwError(root.linenum);
                console.log("Must Specify in degree or out degree");
                root.error("Must Specify in degree or out degree");
                //Throw error
            }
            var vertex = parameters[0].value;
            returnValue = valueCopy[vertex].length;
            return [returnValue, [valueCopy, isDirected], "int"];
        }

        

        if (method == "getOutDegree") {
            if (isDirected != true) {
                env.throwError(root.linenum);
                console.log("No out degree for undirected graph");
                root.error("No out degree for undirected graph");
                //Throw error
            }
            var vertex = parameters[0].value;
            returnValue = valueCopy[vertex].length;
            return [returnValue, [valueCopy, isDirected], "int"];
        }

        if (method == "getInDegree") {
            if (isDirected != true) {
                env.throwError(root.linenum);
                console.log("No in degree for undirected graph");
                root.error("No in degree for undirected graph");
                //Throw error
            }
            var vertex = parameters[0].value;
            var degree = 0;
            for (var i = 0; i < valueCopy.length; i++) {
                var neighbors = valueCopy[i];
                for(var j = 0; j<neighbors.length; j++){
                    if (neighbors[j][0] == vertex) degree++;
                }
            }
            returnValue = degree;
            return [returnValue, [valueCopy, isDirected], "int"];
        }

        //HasEdge method
        //Parameters:   hasEdge(node1Int, node2Int) - the two nodes connected by edge or not
        //Returns:      boolean - true if edge exists, false otherwise
        //              does not change content of graph
        if (method == "hasEdge") {

            //Errors if either parameter is not an integer
            if (typeof parameters[0].value != typeof 2 || typeof parameters[1].value != typeof 2) {
                env.throwError(root.linenum, "Both parameters need to be integers");
                root.error();
            }

            var node1 = parameters[0].value;
            var node2 = parameters[1].value;
            var node1Edges = valueCopy[node1];
            
            returnValue = false;
            for (var i = 0; i < node1Edges.length; i++){
                if (node1Edges[i][0] == node2) returnValue = true;
            }
            console.log(returnValue);
            return [returnValue, [valueCopy, isDirected], "boolean"];
        }
        
        //GetNeighbors method
        //Parameters:   getNeighbors(node1Int) - the integer of a node
        //Returns:      List<Integer> - list of neighbors of node
        //              does not change content of graph
        if (method == "getNeighbors") {

            //Errors if parameter is not an integer
            if (typeof parameters[0].value != typeof 2) {
                env.throwError(root.linenum, "Parameter needs to be an integer");
                root.error();
            } 

            var node = parameters[0].value;
            var node1Edges = valueCopy[node];
            var neighbors = [];
            
            if (node >= valueCopy.length) {
                env.throwError(root.linenum);
                env.throwError(root.linenum, "Vertex not in graph");
                root.error();
            } 

            for (var i = 0; i<node1Edges.length; i++){
                neighbors.push(node1Edges[i][0]);
            }
            
            returnValue = neighbors;
            return [returnValue, [valueCopy, isDirected], "List<Integer>"];
        }
        
        //NumEdges method
        //Parameters:   nothing
        //Returns:      integer - number of edges in graph
        //              does not change content of graph
        if (method == "numEdges") {
            var length = 0;
            for (var i = 0; i < valueCopy.length; i++) {
                console.log("looking at edge: ", i, valueCopy[i], "length: ");
                length += valueCopy[i].length;
            }
            returnValue = length / 2;
            return [returnValue, [valueCopy, isDirected], "int"];
        }
        
        //NumVerts method
        //Parameters:   nothing
        //Returns:      integer - number of vertices in graph
        //              does not change content of graph
        if (method == "numVerts") {
            returnValue = valueCopy.length;
            return [returnValue, [valueCopy, isDirected], "int"];
        }
        
        //IsEmpty method
        //Parameters:   nothing
        //Returns:      boolean - true if graph has no vertices, otherwise false
        //              does not change content of graph
        if (method == "isEmpty") {
            returnValue = (valueCopy.length == 0);
            return [returnValue, [valueCopy, isDirected], "boolean"];
        }
        
        //Clear method
        //Parameters:   nothing
        //Returns:      nothing
        //              empties contents of graph
        if (method == "clear") {
            valueCopy = [];
            return [returnValue, [valueCopy, isDirected], "WeightedGraph"];
        }
        
        //GetWeight method
        //Parameters:   hasEdge(node1Int, node2Int) - the two nodes connected by edge
        //Returns:      int - weight of the edge
        //              does not change content of graph
        if (method == "getWeight") {

            //Errors if either parameter is not an integer
            if (typeof parameters[0].value != typeof 2 || typeof parameters[1].value != typeof 2) {
                env.throwError(root.linenum, "Both parameters need to be integers");
                root.error();
            }

            var node1 = parameters[0].value;
            var node2 = parameters[1].value;
            if (valueCopy.length < node1-1 || valueCopy.length < node2-1) {
                env.throwError(root.linenum, "Vertices not in graph");
                root.error();
            }
            var node1Edges = valueCopy[node1];
            console.log(node1, node2, node1Edges);
            var edgeCheck = false;
            for (var i = 0; i < node1Edges.length; i++){
                if (node1Edges[i][0] == node2) {
                    returnValue = node1Edges[i][1];
                    edgeCheck = true;
                }
            }

            if (!edgeCheck){
                env.throwError(root.linenum, "Edge Not in Graph");
                this.error();
            } 

            return [returnValue, [valueCopy, isDirected], "int"];

        }

        if (method == "setWeight") {

            //Throws error if parameters are not an integers
            if (typeof parameters[0].value != typeof 2 || typeof parameters[1].value != typeof 2 || typeof parameters[2].value != typeof 2) {
                env.throwError(root.linenum, "Parameters must be integers");
                root.error();
            }

            var node1 = parameters[0].value;
            var node2 = parameters[1].value;
            var weight = parameters[2].value;
            var node1Edges = valueCopy[node1];
            var node2Edges = valueCopy[node2];
            
            edgeCheck = false;
            for (var i = 0; i < node1Edges.length; i++){
                if (node1Edges[i][0] == node2) {
                    node1Edges[i][1] = weight;
                    edgeCheck = true;
                    if (isDirected != true) node2Edges[node1][1] = weight;
                }
            }

            if (!edgeCheck){
                env.throwError(root.linenum, "Edge Not in Graph");
                this.error();
            }

            return [returnValue, [valueCopy, isDirected], "int"];

        }
        
        
        
    }
    
    
    
});