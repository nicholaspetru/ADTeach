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
        var methods = ['removeNode', 'addNode', 'getDegree', 'getNeighbors', 'getEdges', 'getNodes', 'addEdge', 'removeEdge', 'populate'];
        return methods;
    }
    
    VGraph.prototype.checkParameters = function(method, parameters) {
        var noParam = ['getEdges', 'getNodes'];
        if (noParam.indexOf(method) >= 0) {
            if (parameters.length != 0) {
                console.log("no parameters");
                //new IncorrectParameters();
            }
        }
        var oneParam = ['removeNode', 'addNode', 'getDegree', 'getNeighbors'];
        if (noParam.indexOf(method) >= 0) {
            if (parameters.length != 1) {
                console.log("one parameters");
                //new IncorrectParameters();
            }
        }
        var twoParam = ['addEdge', 'removeEdge', 'populate'];
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
            node1Edges.push(node2);
            
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
        }
        value = origValue;
        return [returnValue, value];
        
    }
    
    
    
});