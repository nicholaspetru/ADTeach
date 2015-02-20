/*
* VWeightedGraph.js
*/

$(document).ready(function () {

    VWeightedGraph = function(t) {
        if (t == "String") {
            this.storeType = typeof string;
        } else if (t == "int") {
            this.storeType = typeof number;
        }
    }
    
    VWeightedGraph.prototype.listMethods = function() {
        var methods = ['hasEdge', 'getWeight', 'setWeight', 'addVertex', 'getDegree', 'getInDegree', 'getOutDegree', 'getNeighbors', 'getEdges', 'getVerticies', 'addEdge', 'removeEdge', 'populate', 'numEdges', 'numVerts', 'clear', 'isEmpty', 'setDirected'];
        return methods;
    }
    
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
        var twoParam = ['removeEdge', 'populate', 'hasEdge', 'getWeight', 'setWeight'];
        if (twoParam.indexOf(method) >= 0) {
            if (parameters.length != 2) {
                console.log("two parameters needed");
                return false;
                //new IncorrectParameters();
            }
        }
        var threeParam = ['addEdge'];
        if (threeParam.indexOf(method) >= 0) {
            if (parameters.length != 3) {
                console.log("three parameters needed");
                return false;
                //new IncorrectParameters();
            }
        }
        return true;
    }
    
    VWeightedGraph.prototype.performMethod = function(type, origValue1, method, parameters, env, root) {
        var returnValue = null;
        var origValue = [];
        var isDirected = origValue1[1];
        var neighborNeigh = [];
        for (var i = 0; i<origValue1[0].length; i++){
            origValue[i]=(origValue1[0][i]);   
        }
        
        if (method == "setDirected") {
            if (parameters[0].value == true) {
                isDirected = true;
                return [returnValue, [origValue, isDirected]];
            }
            if (parameters[0].value == false) {
                isDirected = false;
                for (var currVertex = 0; currVertex < origValue.length; currVertex++) {
                    var vertexNeighbors = origValue[currVertex];

                    for (var neighbor = 0; neighbor < vertexNeighbors.length; neighbor++) {
                        
                        var currNeighbor = vertexNeighbors[neighbor][0];
                        var neighborNeigh = origValue[currNeighbor];

                        var edgeCheck = false;
                        for (var i = 0; i<neighborNeigh.length; i++){
                            if (neighborNeigh[i][0] == currVertex) edgeCheck = true;
                        }

                        
                        if (!edgeCheck) {
                            var weight = vertexNeighbors[neighbor][1];
                            neighborNeigh.push([currVertex, weight]);
                        }
                    }
                    origValue[currNeighbor] = neighborNeigh;                    
                }
                return [returnValue, [origValue, isDirected], "WeightedGraph"];
            }
            
        } 
        
        if (method == "addEdge"){ 
            var node1 = parameters[0].value;
            var node2 = parameters[1].value;
            var weight = parameters[2].value;
            if (node1 > origValue.length || node2 > origValue.length){
                env.throwError(root.linenum);
                console.log("Error! Node not in graph");
                root.error("Node not in graph");
                //Throw an error!
            }
            
            var node1Edges = origValue[node1];
            var node2Edges = origValue[node2];
            
            if (node1Edges.indexOf(node2) >= 0){
                env.throwError(root.linenum);
                console.log("Error! Edge in graph already");
                root.error("Edge already in graph");
                //Throw an error!
            }
            node1Edges.push([node2, weight]);
            if (isDirected != true) node2Edges.push([node1, weight]);
            
            return [returnValue, [origValue, isDirected], "WeightedGraph"];
            
        } if (method == "populate") {
            var numNodes = parameters[0].value;
            var density = parameters[1].value;
            for (var i = 0; i < numNodes; i++) {
                origValue.push([]);
                for (var j = 0; j < i; j++) {
                    var prob = (Math.random()* (0 - 1) + 1).toFixed(2);
                    var weight = Math.floor((Math.random() * 10) + 1);
                    if (prob < density) {
                        iEdge = origValue[i];
                        jEdge = origValue[j];
                        iEdge.push([j, weight]);
                        if (isDirected != true) jEdge.push([i, weight]);
                        else {
                            prob = (Math.random()* (0 - 1) + 1).toFixed(2);
                            if (prob < density) jEdge.push([i, weight]);
                        }
                    }
                }
            }
            return [returnValue, [origValue, isDirected], "WeightedGraph"];
        }
        
        if (method == "removeEdge") {
            var node1 = parameters[0].value;
            var node2 = parameters[1].value;
            var node1Edges = origValue[node1];
            var node2Edges = origValue[node2];
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
                origValue[node1] = node1NEdges;
                
                if (isDirected != true){
                    for (var j = 0; j < node2Edges.length; j++) {
                        var curr2Edge = node2Edges[j];
                        if (curr2Edge[0] != node1) {
                            node2NEdges.push(curr2Edge);
                        }
                    }
                    origValue[node2] = node2NEdges;
                } else{
                    origValue[node2] = node2Edges;
                }
                
                return [returnValue, [origValue, isDirected], "WeightedGraph"];
            }
        }
        
        if (method == "addVertex") {
            origValue.push([]);
            return [returnValue, [origValue, isDirected], "WeightedGraph"];
        }

        if (method == "getVertices") {
            returnValue = [];
            for (var i = 0; i < origValue.length; i++) {
                returnValue.push(i)[0];
            }
            return [returnValue, [origValue, isDirected], "List<Integer>"];
        }

        if (method == "getDegree") {
            if (isDirected == true) {
                env.throwError(root.linenum);
                console.log("Must Specify in degree or out degree");
                root.error("Must Specify in degree or out degree");
                //Throw error
            }
            var vertex = parameters[0].value;
            returnValue = origValue[vertex].length;
            return [returnValue, [origValue, isDirected], "int"];
        }

        

        if (method == "getOutDegree") {
            if (isDirected != true) {
                env.throwError(root.linenum);
                console.log("No out degree for undirected graph");
                root.error("No out degree for undirected graph");
                //Throw error
            }
            var vertex = parameters[0].value;
            returnValue = origValue[vertex].length;
            return [returnValue, [origValue, isDirected], "int"];
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
            for (var i = 0; i < origValue.length; i++) {
                var neighbors = origValue[i];
                for(var j = 0; j<neighbors.length; j++){
                    if (neighbors[j][0] == vertex) degree++;
                }
            }
            returnValue = degree;
            return [returnValue, [origValue, isDirected], "int"];
        }

        if (method == "hasEdge") {
            var node1 = parameters[0].value;
            var node2 = parameters[1].value;
            console.log("Nodes are: ", origValue);
            console.log("Node 1 is: ", node1);
            var node1Edges = origValue[node1];
            
            returnValue = false;
            for (var i = 0; i < node1Edges.length; i++){
                if (node1Edges[i][0] == node2) returnValue = true;
            }
            console.log(returnValue);
            return [returnValue, [origValue, isDirected], "boolean"];
        }
        
        if (method == "getNeighbors") {
            var node = parameters[0].value;
            var node1Edges = origValue[node];
            var neighbors = [];
            
            if (node >= origValue.length) {
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
            return [returnValue, [origValue, isDirected], "List<Integer>"];
        }
        
        if (method == "numEdges") {
            var length = 0;
            for (var i = 0; i < origValue.length; i++) {
                console.log("looking at edge: ", i, origValue[i], "length: ");
                length += origValue[i].length;
            }
            returnValue = length / 2;
            return [returnValue, [origValue, isDirected], "int"];
        }
        
        if (method == "numVerts") {
            returnValue = origValue.length;
            return [returnValue, [origValue, isDirected], "int"];
        }
        
        if (method == "isEmpty") {
            returnValue = (origValue.length == 0);
            return [returnValue, [origValue, isDirected], "boolean"];
        }
        
        if (method == "clear") {
            origValue = [];
            return [returnValue, [origValue, isDirected], "WeightedGraph"];
        }
        
        if (method == "getWeight") {
            var node1 = parameters[0].value;
            var node2 = parameters[1].value;
            if (origValue.length < node1-1 || origValue.length < node2-1) {
                env.throwError(root.linenum);
                root.error("Nodes not in graph");
            }
            var node1Edges = origValue[node1];
            console.log(node1, node2, node1Edges);
            returnValue = 89;
            for (var i = 0; i < node1Edges.length; i++){
                if (node1Edges[i][0] == node2) {
                    returnValue = node1Edges[i][1];
                }
            }

            return [returnValue, [origValue, isDirected], "int"];

        }

        if (method == "setWeight") {
            var node1 = parameters[0].value;
            var node2 = parameters[1].value;
            var weight = parameters[2].value;
            var node1Edges = origValue[node1];
            var node2Edges = origValue[node2];
            
            edgeCheck = false;
            for (var i = 0; i < node1Edges.length; i++){
                if (node1Edges[i][0] == node2) {
                    node1Edges[i][1] = weight;
                    if (isDirected != true) node2Edges[node1][1] = weight;
                }
            }

            return [returnValue, [origValue, isDirected], "int"];

        }
        
        
        
    }
    
    
    
});