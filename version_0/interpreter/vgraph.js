/**
*
* Graph ADT
* Types supported: All vertices are integers
* Methods supported: addVertex, getNeighbors, getVertices, addEdge, removeEdge, populate, numEdges, numVerts, clear, isEmpty, setDirected,
*                   getInDegree, getDegree, hasEdge
* Authors: Sarah LeBlanc and Colby Seyferth
* ADTeach Team, 2015
*
**/

$(document).ready(function () {

    VGraph = function() {
    }
    
    /**
    *
    * Return the supported methods for the Graph ADT
    *
    *@return {Object} List of supported methods
    *
    **/
    VGraph.prototype.listMethods = function() {
        var methods = ['addVertex', 'getNeighbors', 'getVertices', 'addEdge', 'removeEdge', 'populate', 'numEdges', 'numVerts', 'clear', 'isEmpty', 'setDirected', 'getInDegree', 'getDegree', 'hasEdge'];
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
    VGraph.prototype.checkParameters = function(method, parameters) {

        //Separate the supported methods based on how many parameters they take
        var noParam = ['getVertices', 'addVertex', 'numEdges', 'numVerts', 'clear', 'isEmpty'];
        var oneParam = ['getNeighbors', 'setDirected', 'getInDegree', 'getDegree'];
        var twoParam = ['addEdge', 'removeEdge', 'populate', 'hasEdge'];

        //Check the number of needed parameters against the number of given parameters
        if (noParam.indexOf(method) >= 0) {
            if (parameters.length != 0) {
                return false;
            }
        }
        if (oneParam.indexOf(method) >= 0) {
            if (parameters.length != 1) {
                return false;
            }
        }
        if (twoParam.indexOf(method) >= 0) {
            if (parameters.length != 2) {
                return false;
            }
        }
        return true;
    }
    
    /**
    *
    * Performs the method 
    *
    *@param {string} type - the type of List
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
    VGraph.prototype.performMethod = function(type, method, parameters, env, root, adt) {

        //Get the current value for the ADT from the environment and make a copy of it
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
            if (parameters[0].value != true) {
                isDirected = false;

                //For each node, find it's current neighbors
                for (var currVertex = 0; currVertex < valueCopy.length; currVertex++) {
                    var vertexNeighbors = valueCopy[currVertex];

                    //Add the current node to each neighbor's list of neighbors
                    for (var neighbor = 0; neighbor < vertexNeighbors.length; neighbor++) {
                        var currNeighbor = vertexNeighbors[neighbor];
                        var neighborNeigh = valueCopy[currNeighbor];

                        if (neighborNeigh.indexOf(currVertex) < 0) {
                            neighborNeigh.push(currVertex);
                        }
                    }
                    valueCopy[currNeighbor] = neighborNeigh;                    
                }
                return [returnValue, [valueCopy, isDirected]];
            }
        }
        
        //AddEdge method
        //Parameters:   addEdge(node1Int, node2Int) - adds an edge from node1 to node2
        //Returns:      nothing
        //              updates the neighbor lists to include node2 in node1 (and node1 in node2 in undirected graphs)        
        if (method == "addEdge"){ 

            //Throws error if parameters are not an integers
            if (typeof parameters[0].value != typeof 2 || typeof parameters[1].value != typeof 2) {
                env.throwError(root.linenum, "Parameters must be integers");
                root.error();
            } else if ((parameters[0].value.toString().indexOf('.') >= 0) || (parameters[1].value.toString().indexOf('.') >= 0)) {
                env.throwError(root.linenum, "Parameters must be integers");
                root.error();
            }

            //Throws error if the node is not in the graph
            if (parameters[0].value > valueCopy.length - 1 || parameters[1].value > valueCopy.length - 1) {
                env.throwError(root.linenum, "Vertex not in graph");
                root.error();
            }

            if (isDirected != true) {
                var node1 = parameters[0].value;
                var node2 = parameters[1].value;

                //Make sure that both nodes exist in the graph
                if (node1 > valueCopy.length || node2 > valueCopy.length){
                    env.throwError(root.linenum, "Vertex not in graph");
                    root.error();
                }

                var node1Edges = valueCopy[node1];
                var node2Edges = valueCopy[node2];
                //Make sure the edge doesn't already exist in the graph
                if (node1Edges.indexOf(node2) >= 0){
                    env.throwError(root.linenum, "Edge already in graph");
                    root.error();
                }

                //For an undirected graph, add each node to the other's neighbor list
                node1Edges.push(node2);
                node2Edges.push(node1);
                return [returnValue, [valueCopy, isDirected]];
            }

            if (isDirected === true) {
                var fromVertex = parameters[0].value;
                var toVertex = parameters[1].value;
                var fromNeighbors = valueCopy[fromVertex];
                var toNeighbors = valueCopy[toVertex];

                //Make sure edge isn't already in the graph
                if (fromNeighbors.indexOf(toVertex) >= 0) {
                    env.throwError(root.linenum, "Edge already exists in graph");
                    root.error();
                } 

                //For a directed graph, push the second node onto the first's neighbor list
                fromNeighbors.push(toVertex);
                valueCopy[fromVertex] = fromNeighbors;
                return [returnValue, [valueCopy, isDirected]];
            }
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
            } else if (parameters[0].value.toString().indexOf('.') >= 0) {
                env.throwError(root.linenum, "First parameter must be an integer");
                root.error();
            } else if (parameters[1].value[1] != "float") {
                env.throwError(root.linenum, "Second parameter must be a float");
                root.error();
            }

            //Make sure the linking probability is between 0 and 1
            console.log("Linking probability is: ", parameters[1].value[0]);
            if (0 > parameters[1].value[0] || parameters[1].value[0] > 1) {
                env.throwError(root.linenum, "Make sure the second parameter is a float between 0 and 1");
            }

            var numNodes = parameters[0].value;
            var density = parameters[1].value;

            //For an undirected graph, put an empty list for each node in the graph
            //Create a random number for each of the other nodes, and if it is less than the density,
            //make those nodes neighbors
            if (isDirected != true) {
                for (var i = 0; i < numNodes; i++) {
                    valueCopy.push([]);
                    for (var j = 0; j < i; j++) {
                        var prob = (Math.random()* (0 - 1) + 1).toFixed(2);
                        if (prob < density) {
                            iEdge = valueCopy[i];
                            jEdge = valueCopy[j];
                            iEdge.push(j);
                            jEdge.push(i);
                        }
                    }
                }
                return [returnValue, [valueCopy, isDirected]];
            }

            //For a directed graph, perform the same calculations, except for each node, calculate the probability
            //of it being a to neighbor and it being a from neighbor
            if (isDirected == true) {
                for (var m = 0; m < numNodes; m++) {
                    valueCopy.push([]);
                    for (var n = 0; n < m; n++) {
                        var probFrom = (Math.random() * (0 - 1) + 1).toFixed(2);
                        if (probFrom < density) {
                            iEdge = valueCopy[m];
                            iEdge.push(n);
                        }
                        var probTo = (Math.random() * (0 - 1) + 1).toFixed(2);
                        if (probTo < density) {
                            jEdge = valueCopy[n];
                            jEdge.push(m);
                        }
                    }
                }
                return [returnValue, [valueCopy, isDirected]];
            }
        }
        
        //RemoveEdge method
        //Parameters:       removeEdge(node1Int, node2Int) - two integers each representing a node
        //Returns:          nothing
        //                  removes edge going from node1 to node2 in graph
        //                  (in undirected graph removes edge going from node2 to node1)
        if (method == "removeEdge") {

            //Throws error if parameters are not an integers
            if (typeof parameters[0].value != typeof 2 || typeof parameters[1].value != typeof 2) {
                env.throwError(root.linenum, "Parameters must be integers");
                root.error();
            } else if ((parameters[0].value.toString().indexOf('.') >= 0) || (parameters[1].value.toString().indexOf('.') >= 0)) {
                env.throwError(root.linenum, "Parameters must be integers");
                root.error();
            }

            if (isDirected != true) {
                var node1 = parameters[0].value;
                var node2 = parameters[1].value;
                var node1Edges = valueCopy[node1];
                var node2Edges = valueCopy[node2];
                var node1NEdges = [];
                var node2NEdges = [];

                //Throws error if edge is not in graph
                if (node1Edges.indexOf(node2) < 0) {
                    env.throwError(root.linenum, "Edge is not in graph");
                    root.error();
                } else {

                    //For the first node, keep every neighbor except for node2
                    for (var i = 0; i < node1Edges.length; i++) {
                        var currEdge = node1Edges[i];
                        if (currEdge != node2) {
                            node1NEdges.push(currEdge);
                        }
                    }

                    //Because it is an undirected graph, for the second node, keep every neighbor except for node1
                    for (var j = 0; j < node2Edges.length; j++) {
                        var curr2Edge = node2Edges[j];
                        if (curr2Edge != node1) {
                            node2NEdges.push(curr2Edge);
                        }
                    }
                    valueCopy[node1] = node1NEdges;
                    valueCopy[node2] = node2NEdges;
                    return [returnValue, [valueCopy, isDirected]];
                }
            }
            
            if (isDirected == true) {
                var node1 = parameters[0].value;
                var node2 = parameters[1].value;
                var node1Edges = valueCopy[node1];
                var node1NEdges = [];

                //Throws error if edge is not in graph
                if (node1Edges.indexOf(node2) < 0) {
                    env.throwError(root.linenum, "Edge is not in graph");
                    root.error();
                }

                //For a directed graph, only change the first node's neighbors, keeping all but node2
                for (var i = 0; i < node1Edges; i++) {
                    var currEdge = node1Edges[i];
                    if (currEdge != node2) {
                        node1NEdges.push(currEdge);
                    }
                }
                valueCopy[node1] = node1NEdges;
                return [returnValue, [valueCopy, isDirected]];
            }
        }
        
        //AddVertex method
        //Parameters:       none
        //Returns:          nothing
        //                  Adds a vertex with no neighbors to graph
        if (method == "addVertex") {
            valueCopy.push([]);
            returnValue = valueCopy.length;
            return [returnValue, [valueCopy, isDirected]];
        }
        
        //GetVertices method
        //Parameters:   none
        //Returns:      a List<Integer> of the vertices 
        //              does not change content of graph
        if (method == "getVertices") {
            returnValue = [];
            for (var i = 0; i < valueCopy.length; i++) {
                returnValue.push(i);
            }
            return [returnValue, [valueCopy, isDirected], "List<Integer>"];
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
            } else if (parameters[0].value.toString().indexOf('.') >= 0 || parameters[1].value.toString().indexOf('.') >= 0) {
                env.throwError(root.linenum, "Both parameters need to be integers");
                root.error();
            }

            
            var node1 = parameters[0].value;
            var node2 = parameters[1].value;
            var node1Edges = valueCopy[node1];

            //Returns true if node2 is a neighbor of node1
            if (node1Edges.indexOf(node2) < 0) {
                returnValue = false;
            } else {
                returnValue = true;
            }
            return [returnValue, [valueCopy, isDirected], "boolean"];
            
        }
        
        //GetNeighbors method
        //Parameters:   getNeighbors(node1Int) - the integer of a node
        //Returns:      List<Integer> - list of neighbors of node
        //              does not change content of graph
        if (method == "getNeighbors") {
            var node = parameters[0].value;

            //Errors if parameter is not an integer
            if (typeof parameters[0].value != typeof 2) {
                env.throwError(root.linenum, "Parameter needs to be an integer");
                root.error();
            } else if (parameters[0].value.toString().indexOf('.') >= 0) {
                env.throwError(root.linenum, "Parameter needs to be an integer");
                root.error();
            }

            //Throw error if vertex not in graph
            if (valueCopy.length < node) {
                env.throwError(root.linenum, "Vertex not in graph");
                root.error();
            }

            //Return list of neighbors
            returnValue = valueCopy[node];
            return [returnValue, [valueCopy, isDirected], "List<Integer>"];
        }
        
        //GetDegree method
        //Parameters:   getDegree(node1Int) - the integer of a node
        //Returns:      integer - out degree of node
        //              does not change content of graph
        if (method == "getDegree") {

            //Errors if parameter is not an integer
            if (typeof parameters[0].value != typeof 2) {
                env.throwError(root.linenum, "Parameter needs to be an integer");
                root.error();
            } else if (parameters[0].value.toString().indexOf('.') >= 0) {
                env.throwError(root.linenum, "Parameter needs to be an integer");
                root.error();
            }

            var vertex = parameters[0].value;
            returnValue = valueCopy[vertex].length;
            return [returnValue, [valueCopy, isDirected], "int"];
        }
        
        //GetInDegree method
        //Parameters:   getInDegree(node1Int) - the integer of a node
        //Returns:      integer - in degree of node
        //              does not change content of graph
        if (method == "getInDegree") {

            //Errors if parameter is not an integer
            if (typeof parameters[0].value != typeof 2) {
                env.throwError(root.linenum, "Parameter needs to be an integer");
                root.error();
            } else if (parameters[0].value.toString().indexOf('.') >= 0) {
                env.throwError(root.linenum, "Parameter needs to be an integer");
                root.error();
            }

            //Error if finding in degree of undirected graph
            if (isDirected != true) {
                env.throwError(root.linenum, "No in degree for undirected graph");
                root.error();
            }

            var vertex = parameters[0].value;
            var degree = 0;

            //Find all vertices who have node as neighbor
            for (var i = 0; i < valueCopy.length; i++) {
                var neighbors = valueCopy[i];
                if (neighbors.indexOf(vertex) >= 0) {
                    degree += 1;
                }
            }
            returnValue = degree;
            return [returnValue, [valueCopy, isDirected], "int"];
        }
        
        //NumEdges method
        //Parameters:   nothing
        //Returns:      integer - number of edges in graph
        //              does not change content of graph
        if (method == "numEdges") {

            //Calculates the total number of neighbors and divides by two because graph is undirected
            if (isDirected != true) {
                var length = 0;
                for (var i = 0; i < valueCopy.length; i++) {
                    length += valueCopy[i].length;
                }
                returnValue = length / 2;
                return [returnValue, [valueCopy, isDirected], "int"];
            }
            
            //Counts the total number of neighbors for every node
            if (isDirected == true) {
                var length = 0;
                for (var i = 0; i < valueCopy.length; i++) {
                    length += valueCopy[i].length;
                }
                returnValue = length;
                return [returnValue, [valueCopy, isDirected], "int"];
            }
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
            return [returnValue, [valueCopy, isDirected]];
        }   
    }   
});