/**
* Weighted Graph ADT
* Types supported: All verticies are integers
* Methods supported: hasEdge, getWeight, setWeight, addVertex, getDegree, getInDegree, getOutDegree, getNeighbors, getEdges, getVerticies, addEdge, removeEdge, populate, numEdges, numVerts, clear, isEmpty, 'setDirected
* Authors: Sarah LeBlanc and Colby Seyferth
* ADTeach Team
*/

$(document).ready(function () {

    VWeightedGraph = function(t) {
        if (t == "String") {
            this.storeType = typeof string;
        } else if (t == "int") {
            this.storeType = typeof number;
        }
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
        var noParam = ['getVerticies', 'addVertex', 'numEdges', 'numVerts', 'clear', 'isEmpty'];
        if (noParam.indexOf(method) >= 0) {
            if (parameters.length != 0) {
                console.log("zero parameters needed");
                return false;
                //new IncorrectParameters();
            }
        }
        var oneParam = ['getDegree', 'getInDegree', 'getOutDegree', 'getNeighbors', 'setDirected'];
        if (oneParam.indexOf(method) >= 0) {
            if (parameters.length != 1) {
                console.log("one parameters needed");
                return false;
                //new IncorrectParameters();
            }
        }
        var twoParam = ['removeEdge', 'populate', 'hasEdge', 'getWeight'];
        if (twoParam.indexOf(method) >= 0) {
            if (parameters.length != 2) {
                console.log("two parameters needed");
                return false;
                //new IncorrectParameters();
            }
        }
        var threeParam = ['addEdge', 'setWeight'];
        if (threeParam.indexOf(method) >= 0) {
            if (parameters.length != 3) {
                console.log("three parameters needed");
                return false;
                //new IncorrectParameters();
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
        
        if (method == "setDirected") {
            if (parameters[0].value == true) {
                isDirected = true;
                return [returnValue, [valueCopy, isDirected]];
            }
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
        
        if (method == "addEdge"){ 
            var node1 = parameters[0].value;
            var node2 = parameters[1].value;
            var weight = parameters[2].value;
            if (node1 > valueCopy.length || node2 > valueCopy.length){
                env.throwError(root.linenum);
                console.log("Error! Node not in graph");
                root.error("Node not in graph");
                //Throw an error!
            }
            
            var node1Edges = valueCopy[node1];
            var node2Edges = valueCopy[node2];
            
            if (node1Edges.indexOf(node2) >= 0){
                env.throwError(root.linenum);
                console.log("Error! Edge in graph already");
                root.error("Edge already in graph");
                //Throw an error!
            }
            node1Edges.push([node2, weight]);
            if (isDirected != true) node2Edges.push([node1, weight]);
            
            return [returnValue, [valueCopy, isDirected], "WeightedGraph"];
            
        } if (method == "populate") {
            var numNodes = parameters[0].value;
            var density = parameters[1].value;
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
        
        if (method == "removeEdge") {
            var node1 = parameters[0].value;
            var node2 = parameters[1].value;
            var node1Edges = valueCopy[node1];
            var node2Edges = valueCopy[node2];
            var node1NEdges = [];
            var node2NEdges = [];
            var edgeCheck = false;
            for (var i = 0; i < node1Edges.length; i++){
                if (node1Edges[i][0] == node2) edgeCheck = true;
            }
            if (!edgeCheck) {
                env.throwError(root.linenum);
                console.log("Not an edge");
                root.error("Not an edge");
                //Throw an error
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
        
        if (method == "addVertex") {
            valueCopy.push([]);
            return [returnValue, [valueCopy, isDirected], "WeightedGraph"];
        }

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

        if (method == "hasEdge") {
            var node1 = parameters[0].value;
            var node2 = parameters[1].value;
            console.log("Nodes are: ", valueCopy);
            console.log("Node 1 is: ", node1);
            var node1Edges = valueCopy[node1];
            
            returnValue = false;
            for (var i = 0; i < node1Edges.length; i++){
                if (node1Edges[i][0] == node2) returnValue = true;
            }
            console.log(returnValue);
            return [returnValue, [valueCopy, isDirected], "boolean"];
        }
        
        if (method == "getNeighbors") {
            var node = parameters[0].value;
            var node1Edges = valueCopy[node];
            var neighbors = [];
            
            if (node >= valueCopy.length) {
                env.throwError(root.linenum);
                console.log("********Node not in graph");
                root.error("Node not in graph");
                //Throw Error
            } 
            console.log("######### ok, let's get the neighbors");
            for (var i = 0; i<node1Edges.length; i++){
                neighbors.push(node1Edges[i][0]);
            }
            
            returnValue = neighbors;
            return [returnValue, [valueCopy, isDirected], "List<Integer>"];
        }
        
        if (method == "numEdges") {
            var length = 0;
            for (var i = 0; i < valueCopy.length; i++) {
                console.log("looking at edge: ", i, valueCopy[i], "length: ");
                length += valueCopy[i].length;
            }
            returnValue = length / 2;
            return [returnValue, [valueCopy, isDirected], "int"];
        }
        
        if (method == "numVerts") {
            returnValue = valueCopy.length;
            return [returnValue, [valueCopy, isDirected], "int"];
        }
        
        if (method == "isEmpty") {
            returnValue = (valueCopy.length == 0);
            return [returnValue, [valueCopy, isDirected], "boolean"];
        }
        
        if (method == "clear") {
            valueCopy = [];
            return [returnValue, [valueCopy, isDirected], "WeightedGraph"];
        }
        
        if (method == "getWeight") {
            var node1 = parameters[0].value;
            var node2 = parameters[1].value;
            if (valueCopy.length < node1-1 || valueCopy.length < node2-1) {
                env.throwError(root.linenum);
                root.error("Nodes not in graph");
            }
            var node1Edges = valueCopy[node1];
            console.log(node1, node2, node1Edges);
            returnValue = 89;
            for (var i = 0; i < node1Edges.length; i++){
                if (node1Edges[i][0] == node2) {
                    returnValue = node1Edges[i][1];
                }
            }

            return [returnValue, [valueCopy, isDirected], "int"];

        }

        if (method == "setWeight") {
            var node1 = parameters[0].value;
            var node2 = parameters[1].value;
            var weight = parameters[2].value;
            var node1Edges = valueCopy[node1];
            var node2Edges = valueCopy[node2];
            
            edgeCheck = false;
            for (var i = 0; i < node1Edges.length; i++){
                if (node1Edges[i][0] == node2) {
                    node1Edges[i][1] = weight;
                    if (isDirected != true) node2Edges[node1][1] = weight;
                }
            }

            return [returnValue, [valueCopy, isDirected], "int"];

        }
        
        
        
    }
    
    
    
});