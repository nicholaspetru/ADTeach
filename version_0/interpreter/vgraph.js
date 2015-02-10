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
    
    VStack.prototype.performMethod = function(type, origValue, method, parameters) {
        var returnValue = null;
        if (method == "addEdge"){ 
            var node1 = parameters[0];
            var node2 = parameters[1];
            var node1Edges = this.adList[node1];
                if (typeof node1Edges == typeof [1,2]){
                    node1Edges.add(node2);
                    this.adList[node1] = node1Edges;
                }else{
                    this.adList[node1] = [node2];
                }

            var node2Edges = this.adList[node2];
                if (typeof node2Edges == typeof [1,2]){
                    node2Edges.add(node1);
                    this.adList[node2] = node2Edges;
                }else{
                    this.adList[node2] = [node1];
                }
            }
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
                    value.push('"' + options[toPush] + '"');
                }
                return [returnValue, value];
            }
        }
        
    }
    
    
    
});