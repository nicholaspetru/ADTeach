/*
* VGraph.js
*/

$(document).ready(function () {

    VGraph = function(t) {
        if (t == "String") {
            this.storeType = typeof string;
        } else if (t == "int") {
            this.storeType = typeof number;
        }
    }
    
    VGraph.prototype.listMethods = function() {
        var methods = ['addVertex', 'getNeighbors', 'getVertices', 'addEdge', 'removeEdge', 'populate', 'numEdges', 'numVerts', 'clear', 'isEmpty', 'setDirected', 'getInDegree', 'getOutDegree', 'hasEdge'];
        return methods;
    }
    
    VGraph.prototype.checkParameters = function(method, parameters) {
        var noParam = ['getVertices', 'addVertex', 'numEdges', 'numVerts', 'clear', 'isEmpty'];
        if (noParam.indexOf(method) >= 0) {
            console.log("LOOKing at method: ", method);
            console.log("Parameters are: ", parameters);
            if (parameters.length != 0) {
                console.log("no parameters");
                return false;
                //new IncorrectParameters();
            }
        }
        var oneParam = ['getNeighbors', 'setDirected', 'getInDegree', 'getOutDegree'];
        if (oneParam.indexOf(method) >= 0) {
            if (parameters.length != 1) {
                console.log("one parameters");
                return false;
                //new IncorrectParameters();
            }
        }
        var twoParam = ['addEdge', 'removeEdge', 'populate', 'hasEdge'];
        if (twoParam.indexOf(method) >= 0) {
            if (parameters.length != 2) {
                console.log("two parameters");
                return false;
                //new IncorrectParameters();
            }
        }
        return true;
    }
    
    VGraph.prototype.performMethod = function(type, origValue1, method, parameters, env, root) {
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
            if (parameters[0].value != true) {
                isDirected = false;
                for (var currVertex = 0; currVertex < origValue.length; currVertex++) {
                    var vertexNeighbors = origValue[currVertex];

                    for (var neighbor = 0; neighbor < vertexNeighbors.length; neighbor++) {
                        
                        var currNeighbor = vertexNeighbors[neighbor];
                        var neighborNeigh = origValue[currNeighbor];

                        
                        if (neighborNeigh.indexOf(currVertex) < 0) {
                            neighborNeigh.push(currVertex);
                        }
                    }
                    origValue[currNeighbor] = neighborNeigh;                    
                }
                return [returnValue, [origValue, isDirected]];
            }
            
        }
        
        if (method == "addEdge"){ 
            if (isDirected != true) {
                console.log("ADDING EDGE WHEN FALSE");
                var node1 = parameters[0].value;
                var node2 = parameters[1].value;
                console.log("NODE 1 IS: ", node1);
                console.log("NODE2 IS: ", node2);
                if (node1 > origValue.length || node2 > origValue.length){
                    env.throwError(root.linenum);
                    console.log("Error! Node not in graph");
                    root.error("Edge not in graph");
                    //Throw an error!
                }

                var node1Edges = origValue[node1];
                var node2Edges = origValue[node2];
                if (node1Edges.indexOf(node2) >= 0){
                    env.throwError(root.linenum);
                    console.log("Error! Edge in graph already");
                    root.error("Edge not in graph");
                    //Throw an error!
                }
                node1Edges.push(node2);
                node2Edges.push(node1);
                return [returnValue, [origValue, isDirected]];
            }
            if (isDirected === true) {
                console.log("ADDING EDGE WHEN TRUE");
                var fromVertex = parameters[0].value;
                var toVertex = parameters[1].value;
                var fromNeighbors = origValue[fromVertex];
                var toNeighbors = origValue[toVertex];
                if (fromNeighbors.indexOf(toVertex) >= 0) {
                    env.throwError(root.linenum);
                    console.log("Already exists an edge");
                    root.error("Edge already exists");
                    //Throw an error
                } 
                fromNeighbors.push(toVertex);
                origValue[fromVertex] = fromNeighbors;
                return [returnValue, [origValue, isDirected]];
                
            }
            
        } if (method == "populate") {
            var numNodes = parameters[0].value;
            var density = parameters[1].value;
            if (isDirected != true) {
                for (var i = 0; i < numNodes; i++) {
                    origValue.push([]);
                    for (var j = 0; j < i; j++) {
                        var prob = (Math.random()* (0 - 1) + 1).toFixed(2);
                        if (prob < density) {
                            iEdge = origValue[i];
                            jEdge = origValue[j];
                            iEdge.push(j);
                            jEdge.push(i);
                        }
                    }
                }
                return [returnValue, [origValue, isDirected]];
            }
            if (isDirected == true) {
                for (var m = 0; m < numNodes; m++) {
                    origValue.push([]);
                    for (var n = 0; n < m; n++) {
                        var probFrom = (Math.random() * (0 - 1) + 1).toFixed(2);
                        if (probFrom < density) {
                            iEdge = origValue[m];
                            iEdge.push(n);
                        }
                        var probTo = (Math.random() * (0 - 1) + 1).toFixed(2);
                        if (probTo < density) {
                            jEdge = origValue[n];
                            jEdge.push(m);
                        }
                    }
                }
                return [returnValue, [origValue, isDirected]];
            }
        }
        
        if (method == "removeEdge") {
            if (isDirected != true) {
                var node1 = parameters[0].value;
                var node2 = parameters[1].value;
                var node1Edges = origValue[node1];
                var node2Edges = origValue[node2];
                var node1NEdges = [];
                var node2NEdges = [];
                if (node1Edges.indexOf(node2) < 0) {
                    env.throwError(root.linenum);
                    console.log("Not an edge");
                    root.error("Not an edge");
                    //Throw an error
                } else {
                    for (var i = 0; i < node1Edges.length; i++) {
                        var currEdge = node1Edges[i];
                        if (currEdge != node2) {
                            node1NEdges.push(currEdge);
                        }
                    }
                    for (var j = 0; j < node2Edges.length; j++) {
                        var curr2Edge = node2Edges[j];
                        if (curr2Edge != node1) {
                            node2NEdges.push(curr2Edge);
                        }
                    }
                    origValue[node1] = node1NEdges;
                    origValue[node2] = node2NEdges;
                    return [returnValue, [origValue, isDirected]];
                }
            }
            
            if (isDirected == true) {
                var node1 = parameters[0].value;
                var node2 = parameters[1].value;
                var node1Edges = origValue[node1];
                var node1NEdges = [];
                if (node1Edges.indexOf(node2) < 0) {
                    env.throwError(root.linenum);
                    console.log("Not an edge");
                    root.error("Not an edge");
                    //Throw an error
                }
                for (var i = 0; i < node1Edges; i++) {
                    var currEdge = node1Edges[i];
                    if (currEdge != node2) {
                        node1NEdges.push(currEdge);
                    }
                }
                origValue[node1] = node1NEdges;
                return [returnValue, [origValue, isDirected]];
            }
        }
        
        
        
        if (method == "addVertex") {
            origValue.push([]);
            returnValue = origValue.length;
            return [returnValue, [origValue, isDirected]];
        }
        
        if (method == "getVertices") {
            returnValue = [];
            for (var i = 0; i < origValue.length; i++) {
                returnValue.push(i);
            }
            return [returnValue, [origValue, isDirected], "List<Integer>"];
        }
        
        if (method == "hasEdge") {
            if (typeof parameters[0].value != typeof 2 || typeof parameters[1].value != typeof 2) {
                env.throwError(root.linenum);
                root.error("Need ints");
            } else if (parameters[0].value.toString().indexOf('.') >= 0 || parameters[1].value.toString().indexOf('.') >= 0) {
                env.throwError(root.linenum);
                root.error();
            }
            if (isDirected != true) {
                var node1 = parameters[0].value;
                var node2 = parameters[1].value;
                console.log("Nodes are: ", origValue);
                console.log("Node 1 is: ", node1);
                var node1Edges = origValue[node1];
                console.log("Node 1 edges are: ", node1Edges);
                if (node1Edges.indexOf(node2) < 0) {
                    returnValue = false;
                } else {
                    returnValue = true;
                }
                return [returnValue, [origValue, isDirected]];
            }
            
            if (isDirected == true) {
                var node1 = parameters[0].value;
                var node2 = parameters[1].value;
                var node1Edges = origValue[node1];
                if (node1Edges.indexOf(node2) < 0) {
                    returnValue = false;
                } else {
                    returnValue = true;
                }
                return [returnValue, [origValue, isDirected], "boolean"];
            }
        }
        
        if (method == "getNeighbors") {
            var node = parameters[0].value;
            console.log("Here: ", origValue);
            if (origValue.length < node) {
                env.throwError(root.linenum);
                console.log("Node not in graph");
                root.error("Not in graph");
                //Throw Error
            }
            returnValue = origValue[node];
            return [returnValue, [origValue, isDirected], "List<Integer>"];
        }
        
        if (method == "getOutDegree") {
            if (isDirected != true) {
                env.throwError(root.linenum);
                console.log("No out degree for undirected graph");
                root.error("No degree for undirected graph");
                //Throw error
            }
            var vertex = parameters[0].value;
            returnValue = origValue[vertex].length;
            return [returnValue, [origValue, isDirected], "int"];
        }
        
        if (method == "getInDegree") {
            if (isDirected != true) {
                env.throwError(root.linenum);
                console.log("No out degree for undirected graph");
                root.error("No degree for undirected graph");
                //Throw error
            }
            var vertex = parameters[0].value;
            var degree = 0;
            for (var i = 0; i < origValue.length; i++) {
                var neighbors = origValue[i];
                if (neighbors.indexOf(vertex) >= 0) {
                    degree += 1;
                }
            }
            returnValue = degree;
            return [returnValue, [origValue, isDirected], "int"];
        }
        
        if (method == "numEdges") {
            if (isDirected != true) {
                var length = 0;
                for (var i = 0; i < origValue.length; i++) {
                    console.log("looking at edge: ", i, origValue[i], "length: ");
                    length += origValue[i].length;
                }
                returnValue = length / 2;
                return [returnValue, [origValue, isDirected], "int"];
            }
            
            if (isDirected == true) {
                var length = 0;
                for (var i = 0; i < origValue.length; i++) {
                    console.log("looking at edge: ", i, origValue[i], "length: ");
                    length += origValue[i].length;
                }
                returnValue = length;
                return [returnValue, [origValue, isDirected], "int"];
            }
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
            return [returnValue, [origValue, isDirected]];
        }
        
        
    }
    
    
    
});