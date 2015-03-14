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
    
    VPQueue.prototype.compareNumbers = function(a, b) {
        return b - a;
    }
    
    VPQueue.prototype.compareFloats = function(a, b) {
        return a[0] - b[0];
    }
    
    VPQueue.prototype.compareStrings = function(a, b) {
        return a > b;
    }
    
    VPQueue.prototype.performMethod = function(type, origValue1, method, parameters, env, root) {
        var returnValue = null;
        var origValue = [];
        for (var i = 0; i<origValue1.length; i++){
            origValue[i]=(origValue1[i]);   
        }
        var valType;
        switch (type) {
            case "PriorityQueue<Integer>":
                valType = "int";
                break;
            case "PriorityQueue<String>":
                valType = "String";
                break;
            case "PriorityQueue<Float>":
                valType = "float";
                break;
        }
        if (method == 'add') {
            if (type == "PriorityQueue<Integer>") {
                console.log(parameters[0].value, typeof parameters[0].value);
                if (typeof parameters[0].value != typeof 1) {
                    env.throwError(root.linenum);
                    root.error("Looking for ints");
                } 
            } else if (type == "PriorityQueue<String>") {
                if (typeof parameters[0].value != typeof "H") {
                    env.throwError(root.linenum);
                    root.error("Looking for strings");
                }
                    
            } else if (type == "PriorityQueue<Float>") {
                console.log("Looking to add parameters: ", parameters);
                if (parameters[0].value.length != 2 || parameters[0].value[1] != "float") {
                    env.throwError(root.linenum);
                    root.error();
                }
            }
            var newList = [];
            
            var lengthOfList = origValue.length;
            for (var i = 0; i < lengthOfList; i++) {
                newList.push(origValue[i]);
            }
            newList.push(parameters[0].value);
            origValue = newList;
            if (type == "PriorityQueue<Integer>") {
                origValue.sort(this.compareNumbers);
            } else if (type == "PriorityQueue<String>") {
                origValue.sort(this.compareStrings);
            } else if (type == "PriorityQueue<Float>") {
                origValue.sort(this.compareFloats);
            }
            //returnValue = origValue.indexOf(parameters[0].value);
            return [returnValue, origValue];
        }
        if (method == "peek") {
            var valType;
            switch (type) {
                case "PriorityQueue<Integer>":
                    valType = "int";
                    break;
                case "PriorityQueue<String>":
                    valType = "String";
                    break;
                case "PriorityQueue<Float>":
                    valType = "float";
                    break;
            }

            var length = origValue.length;
            returnValue = origValue[length-1];
            return [returnValue, origValue, valType];
        }
        if (method == 'remove') {
            returnValue = origValue[0];
            //console.log(origValue, "##!#");
            origValue.splice(0, 1);
            //console.log("REturning, ", returnValue, " + ", origValue);
            return [returnValue, origValue, valType];
        }
        if (method == 'isEmpty') {
            returnValue = (origValue.length == 0);
            return [returnValue, origValue, "boolean"];
        }
        if (method == 'size') {
            returnValue = origValue.length;
            return [returnValue, origValue, "int"];
        }
        if (method == "populate") {
            var value = [];
            if (type == "PriorityQueue<Integer>") {
                for (var i = 0; i < parameters[0].value; i++) {
                    var toPush = Math.floor((Math.random()*100) + 1);
                    value.push(toPush);
                }
                value.sort(this.compareNumbers);
            } 
            if (type == "PriorityQueue<String>") {
                var options = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                for (var i = 0; i < parameters[0].value; i++) {
                    var toPush = Math.floor((Math.random()*100) + 1);
                    value.push(options[toPush]);
                }
                value.sort(this.compareStrings);
            }
            if (type == "PriorityQueue<Float>") {
                for (var i = 0; i < parameters[0].value; i++) {
                    var toPush = parseFloat((Math.random()*(7.00 - 0.01) + 1).toFixed(2));
                    value.push([toPush, "float"]);
                }
                value.sort(this.compareFloats);
            }
            return [returnValue, value];
        }
        
    }
});