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
        var methods = ['removeNode', 'addVertex', 'getDegree', 'getNeighbors', 'getEdges', 'getNodes', 'addEdge', 'removeEdge', 'populate', 'numEdges'];
        return methods;
    }
    
    VGraph.prototype.checkParameters = function(method, parameters) {
        var noParam = ['getEdges', 'getNodes', 'addVertex', 'numEdges'];
        if (noParam.indexOf(method) >= 0) {
            if (parameters.length != 0) {
                console.log("no parameters");
                //new IncorrectParameters();
            }
        }
        var oneParam = ['removeNode', 'getDegree', 'getNeighbors'];
        if (noParam.indexOf(method) >= 0) {
            if (parameters.length != 1) {
                console.log("one parameters");
                //new IncorrectParameters();
            }
        }
        var twoParam = ['addEdge', 'removeEdge', 'populate', 'hasEdge'];
        if (noParam.indexOf(method) >= 0) {
            if (parameters.length != 2) {
                console.log("two parameters");
                //new IncorrectParameters();
            }
        }
        return true;
    }
    
    VGraph.prototype.performMethod = function(type, origValue1, method, parameters) {
        var returnValue = null;
        var origValue = [];
        for (var i = 0; i<origValue1.length; i++){
            origValue[i]=(origValue1[i]);   
        }
        if (method == "addEdge"){ 
            var node1 = parameters[0].value;
            var node2 = parameters[1].value;
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
            node1Edges.push(node2);
            node2Edges.push(node1);
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
            if (node1Edges.indexOf(node2) < 0) {
                console.log("Not an edge");
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
            console.log("Node 1 edges are: ", node1Edges);
            if (node1Edges.indexOf(node2) < 0) {
                returnValue = false;
            } else {
                returnValue = true;
            }
            return [returnValue, origValue];
        }
        
        if (method == "getNeighbors") {
            var node = parameters[0].value;
            if (origValue.indexOf(node) < 0) {
                console.log("Node not in graph");
                //Throw Error
            }
            returnValue = origValue[node];
            return [returnValue, origValue];
        }
        
        if (method == "numEdges") {
            var edges = [];
            var edge = [];
            edge.push([3, 1]);
            var attempt = [3, 1];
            console.log("TEST EDGES ARE: ", edge);
            var testing = edge.indexOf(attempt);
            console.log("IS IN???: ", testing);
            console.log("ORig value = ", origValue);
            for (var i = 0; i < origValue.length; i++) {
                for (var j = 0; j < origValue[i].length; j++) {
                    var currEdge = [i, origValue[i][j]];
                    var otherCurrEdge = [origValue[i][j], i];
                    console.log("Current edge and other current edge is: ", currEdge, otherCurrEdge);
                    if (edges.indexOf(currEdge) < 0 && edges.indexOf(otherCurrEdge) < 0) {
                        edges.push(currEdge);
                    }
                    console.log("edges are: ", edges);
                }
            }
            returnValue = edges.length;
            return [returnValue, origValue];
        }
        
        
    }
    
    
    
});