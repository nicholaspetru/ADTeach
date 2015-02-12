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
        var methods = ['hasEdge', 'removeNode', 'addVertex', 'getDegree', 'getNeighbors', 'getEdges', 'getNodes', 'addEdge', 'removeEdge', 'populate', 'numEdges', 'numVerts', 'clear', 'isEmpty', 'setDirected'];
        return methods;
    }
    
    VWeightedGraph.prototype.checkParameters = function(method, parameters) {
        var noParam = ['getEdges', 'getNodes', 'addVertex', 'numEdges', 'numVerts', 'clear', 'isEmpty', 'setDirected'];
        if (noParam.indexOf(method) >= 0) {
            if (parameters.length != 0) {
                console.log("zero parameters needed");
                //new IncorrectParameters();
            }
        }
        var oneParam = ['removeNode', 'getDegree', 'getNeighbors'];
        if (noParam.indexOf(method) >= 0) {
            if (parameters.length != 1) {
                console.log("one parameters needed");
                //new IncorrectParameters();
            }
        }
        var twoParam = ['removeEdge', 'populate', 'hasEdge', 'getWeight', 'setWeight'];
        if (noParam.indexOf(method) >= 0) {
            if (parameters.length != 2) {
                console.log("two parameters needed");
                //new IncorrectParameters();
            }
        }
        var threeParam = ['addEdge'];
        if (noParam.indexOf(method) >= 0) {
            if (parameters.length != 3) {
                console.log("three parameters needed");
                //new IncorrectParameters();
            }
        }
        return true;
    }
    
    VWeightedGraph.prototype.performMethod = function(type, origValue1, method, parameters) {
        var returnValue = null;
        var origValue = [];
        for (var i = 0; i<origValue1[0].length; i++){
            origValue[i]=(origValue1[0][i]);   
        }
        if (method == "addEdge"){ 
            var node1 = parameters[0].value;
            var node2 = parameters[1].value;
            var weight = parameters[2].value;
            if (node1 > origValue.length || node2 > origValue.length){
                console.log("Error! Node not in graph");
                //Throw an error!
            }
            
            var node1Edges = origValue[node1];
            var node2Edges = origValue[node2];
            
            if (node1Edges.indexOf(node2) >= 0){
                console.log("Error! Edge in graph already");
                //Throw an error!
            }
            node1Edges.push([node2, weight]);
            node2Edges.push([node1, weight]);
            return [returnValue, origValue];
            
        } if (method == "populate") {
            var numNodes = parameters[0].value;
            var density = parameters[1].value;
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
            return [returnValue, origValue];
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
                console.log("Not an edge");
                //Throw an error
            } else {
                for (var i = 0; i < node1Edges.length; i++) {
                    var currEdge = node1Edges[i];
                    if (currEdge[0] != node2) {
                        node1NEdges.push(currEdge);
                    }
                }
                for (var j = 0; j < node2Edges.length; j++) {
                    var curr2Edge = node2Edges[j];
                    if (curr2Edge[0] != node1) {
                        node2NEdges.push(curr2Edge);
                    }
                }
                origValue[node1] = node1NEdges;
                origValue[node2] = node2NEdges;
                return [returnValue, origValue];
            }
        }
        
        if (method == "addVertex") {
            origValue.push([]);
            return [returnValue, origValue];
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
            return [returnValue, origValue];
        }
        
        if (method == "getNeighbors") {
            var node = parameters[0].value;
            var node1Edges = origValue[node];
            var neighbors = [];
            
            if (node >= origValue.length) {
                console.log("********Node not in graph");
                //Throw Error
            } 
            console.log("######### ok, let's get the neighbors");
            for (var i = 0; i<node1Edges.length; i++){
                neighbors.push(node1Edges[i][0]);
            }
            
            returnValue = neighbors;
            return [returnValue, origValue];
        }
        
        if (method == "numEdges") {
            var length = 0;
            for (var i = 0; i < origValue.length; i++) {
                console.log("looking at edge: ", i, origValue[i], "length: ");
                length += origValue[i].length;
            }
            returnValue = length / 2;
            return [returnValue, origValue];
        }
        
        if (method == "numVerts") {
            returnValue = origValue.length;
            return [returnValue, origValue];
        }
        
        if (method == "isEmpty") {
            returnValue = (origValue.length == 0);
            return [returnValue, origValue];
        }
        
        if (method == "clear") {
            origValue = [];
            return [returnValue, origValue];
        }
        
        if (method == "getWeight") {
            var node1 = parameters[0].value;
            var node2 = parameters[1].value;
            var node1Edges = origValue[node1];
            console.log(node1, node2, node1Edges);
            returnValue = 89;
            for (var i = 0; i < node1Edges.length; i++){
                if (node1Edges[i][0] == node2) {
                    returnValue = node1Edges[i][1];
                }
            }

            return [returnValue, origValue];

        }

        if (method == "setWeight") {
            var node1 = parameters[0].value;
            var node2 = parameters[1].value;
            var weight = parameters[2].value;
            var node1Edges = origValue[node1];
            
            edgeCheck = false;
            for (var i = 0; i < node1Edges.length; i++){
                if (node1Edges[i][0] == node2) {
                    node1Edges[i][1] = weight;
                }
            }

            return [returnValue, origValue];

        }
        
        
        
    }
    
    
    
});