/*
* VGraph.js
*/

$(document).ready(function () {

    VGraph = function(t) {
        this.adList = {};
        var string = "";
        var number = 0;
        if (t == "String") {
            this.storeType = typeof string;
        } else if (t == "int") {
            this.storeType = typeof number;
        }
    }
    
    VGraph.prototype.addEdge = function(node1, node2) {
        this.adList[node1].add(node2);
        var node1Edges = this.adList[node1];
            if (typeof node1Edges == typeof [1,2]){
                node1Edges.add(node2);
                this.adList[node1] = node1Edges;

        var node2Edges = this.adList[node2];
            if (typeof node2Edges == typeof [1,2]){
                node2Edges.add(node1);
                this.adList[node2] = node2Edges;
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
    /*
    VStack.prototype.performMethod = function(type, origValue, method, parameters) {
        var returnValue = null;
        if (method == "pop") {
            returnValue = origValue.pop();
            return [returnValue, origValue];
        } if (method == "push") {
            if (type == "Stack<Integer>") {
                if (parameters[0].jtype != "INT_TYPE") {
                    console.log('INCOMPATIBLE TYPES, want ints');
                }
            } else if (type == "Stack<String>") {
                if (parameters[0].jtype != "STRING_TYPE") {
                    console.log('INCOMPATIBLE TYPES, want strings');
                }
            } 
            //TODO: Check types
            origValue.push(parameters[0].value);
            return [returnValue, origValue];
        } if (method == "isEmpty") {
            return origValue.isEmpty();
        } if (method == "getValue") {
            return origValue.getValue();
        } if (method == "getType") {
            return origValue.getType();
        } if (method == "populate") {
            if (type == "Stack<Integer>") {
                var value = [];
                for (i = 0; i < parameters[0].value; i++) {
                    var toPush = Math.floor((Math.random()*100) + 1);
                    value.push(toPush);
                }
                return [returnValue, value];  
            }
            if (type == "Stack<String>") {
                var value = [];
                for (i = 0; i < parameters[0].value; i++) {
                    var options = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    var toPush = Math.floor((Math.random()*26) + 1);
                    value.push(options[toPush]);
                }
                return [returnValue, value];
            }
        }
        
    }
    */
    
    
});