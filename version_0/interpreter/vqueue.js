/*
* VQueue.js
*/

$(document).ready(function () {
   
    VQueue = function(t) {
        this.front = [];
        this.storeType = t;
    }
    
    VQueue.prototype.dequeue = function() {
        return this.front.pop();
    }
    
    VQueue.prototype.push = function(value) {
        return this.front.push(value);
    }
    
    VQueue.prototype.isEmpty = function() {
        return (this.front.length == 0);
    }
    
    VQueue.prototype.getValue = function() {
        return this.front;
    }
    
    VQueue.prototype.getType = function() {
        return "Queue";
    }
    
    VQueue.prototype.listMethods = function() {
        var methods = ["enqueue", "dequeue", "isEmpty", "size", "populate"];
        return methods;
    }
    
    VQueue.prototype.checkParameters = function(method, parameters) {
        var zeroParam = ["dequeue", "isEmpty", "size"]
        if (zeroParam.indexOf(method) >= 0) {
            if (parameters.length != 0) {
                console.log("Only takes one parameter");
            }
        } else if (method == "enqueue" || method == "populate") {
            if (parameters.length != 1) {
                console.log("Method takes one parameter");
            }
        }
        return true;
    }
    
    VQueue.prototype.performMethod = function(type, origValue1, method, parameters) {
        var returnValue = null;
        var origValue = [];
        for (var i = 0; i<origValue1.length; i++){
            origValue[i]=(origValue1[i]);   
        }
        if (method == 'enqueue') {
            var newList = [];
            newList.push(parameters[0].value);
            var lengthOfList = origValue.length;
            for (var i = 0; i < lengthOfList; i++) {
                newList.push(origValue[i]);
            }
            origValue = newList;
            return [returnValue, origValue];
        }
        if (method == 'dequeue') {
            returnValue = origValue.pop();
            console.log("REturning, ", returnValue, " + ", origValue);
            return [returnValue, origValue];
        }
        if (method == 'isEmpty') {
            returnValue = (origValue.length == 0);
            return [returnValue, origValue];
        }
        if (method == 'size') {
            returnValue = origValue.length;
            return [returnValue, origValue];
        }
        if (method == "populate") {
            if (type == "Queue<Integer>") {
                for (var i = 0; i < parameters[0]; i++) {
                    var toPush = Math.floor((Math.random()*100) + 1);
                    value.push(toPush);
                }
            } 
            if (type == "Queue<String>") {
                var options = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                for (var i = 0; i < parameters[0]; i++) {
                    var toPush = Math.floor((Math.random()*100) + 1);
                    value.push(options[toPush]);
                }
            }
        }
        
    }
});