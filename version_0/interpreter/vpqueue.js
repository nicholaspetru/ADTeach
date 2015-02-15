/*
* VPQueue.js
*/

$(document).ready(function () {
   
    VPQueue = function(t) {
        this.front = [];
        this.storeType = t;
    }
    
    VPQueue.prototype.dequeue = function() {
        return this.front.pop();
    }
    
    VPQueue.prototype.push = function(value) {
        return this.front.push(value);
    }
    
    VPQueue.prototype.isEmpty = function() {
        return (this.front.length == 0);
    }
    
    VPQueue.prototype.getValue = function() {
        return this.front;
    }
    
    VPQueue.prototype.getType = function() {
        return "PriorityQueue";
    }
    
    VPQueue.prototype.listMethods = function() {
        var methods = ["remove", "add", "isEmpty", "size", "populate", "peek"];
        return methods;
    }
    
    VPQueue.prototype.checkParameters = function(method, parameters) {
        var zeroParam = ["remove", "isEmpty", "size", "peek"]
        if (zeroParam.indexOf(method) >= 0) {
            if (parameters.length != 0) {
                console.log("Only takes one parameter");
                return false;
            }
        } else if (method == "add" || method == "populate") {
            if (parameters.length != 1) {
                console.log("Method takes one parameter");
                return false;
            }
        }
        return true;
    }
    
    VPQueue.prototype.performMethod = function(type, origValue1, method, parameters, env, root) {
        var returnValue = null;
        var origValue = [];
        for (var i = 0; i<origValue1.length; i++){
            origValue[i]=(origValue1[i]);   
        }
        if (method == 'add') {
            if (type == "PriorityQueue<Integer>") {
                if (typeof parameters[0].value != number) {
                    env.throwError(root.linenum);
                    root.error("Looking for ints");
                } else if (parameters[0].value.toString().indexOf(".") >= 0) {
                    env.throwError(root.linenum);
                    root.error("Looking for ints");
                }
            } else if (type == "PriorityQueue<String>") {
                if (typeof parameters[0].value != typeof "H") {
                    env.throwError(root.linenum);
                    root.error("Looking for strings");
                }
                    
            }
            var newList = [];
            newList.push(parameters[0].value);
            var lengthOfList = origValue.length;
            for (var i = 0; i < lengthOfList; i++) {
                newList.push(origValue[i]);
            }
            origValue = newList;
            origValue.sort();
            returnValue = origValue.indexOf(parameters[0].value);
            return [returnValue, origValue];
        }
        if (method == "peek") {
            var length = origValue.length;
            returnValue = origValue[length-1];
            return [returnValue, origValue];
        }
        if (method == 'remove') {
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
            var value = [];
            if (type == "PriorityQueue<Integer>") {
                for (var i = 0; i < parameters[0].value; i++) {
                    var toPush = Math.floor((Math.random()*100) + 1);
                    value.push(toPush);
                }
                value.sort();
            } 
            if (type == "PriorityQueue<String>") {
                var options = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                for (var i = 0; i < parameters[0].value; i++) {
                    var toPush = Math.floor((Math.random()*100) + 1);
                    value.push(options[toPush]);
                }
                value.sort();
            }
            return [returnValue, value];
        }
        
    }
});