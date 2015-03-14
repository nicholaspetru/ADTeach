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
        var methods = ["remove", "add", "isEmpty", "size", "populate", "peek"];
        return methods;
    }
    
    VQueue.prototype.checkParameters = function(method, parameters) {
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
    
    VQueue.prototype.performMethod = function(type, origValue1, method, parameters, env, root) {
        var returnValue = null;
        var origValue = [];
        for (var i = 0; i<origValue1.length; i++){
            origValue[i]=(origValue1[i]);   
        }
        var valType;
        switch (type) {
            case "Queue<Integer>":
                valType = "int";
                break;
            case "Queue<String>":
                valType = "String";
                break;
            case "Queue<Float>":
                valType = "float";
                break;
        }
        if (type == "Queue<Integer>") {
            valType = "int";
        }
        if (method == 'add') {
            if (type == "Queue<Integer>") {
                if (typeof parameters[0].value != typeof 1) {
                    env.throwError(root.linenum);
                    root.error("Looking for ints");
                } else if (parameters[0].value.toString().indexOf(".") >= 0) {
                    env.throwError(root.linenum);
                    root.error("Looking for ints");
                }
            } else if (type == "Queue<String>") {
                if (typeof parameters[0].value != typeof "H") {
                    env.throwError(root.linenum);
                    root.error("Looking for strings");
                }   
            } else if (type == "Queue<Float>") {
                if (typeof parameters[0].value != typeof []) {
                    env.throwError(root.linenum);
                    root.error("Expected float");
                } else if (parameters[0].value.length < 2 || parameters[0].value[1] != "float") {
                    env.throwError(root.linenum);
                    root.error("Expected float");
                }
            }
            var newList = [];
            
            var lengthOfList = origValue.length;
            for (var i = 0; i < lengthOfList; i++) {
                newList.push(origValue[i]);
            }
            newList.push(parameters[0].value);
            origValue = newList;
            return [returnValue, origValue];
        }
        if (method == "peek") {
            returnValue = origValue[0];
            return [returnValue, origValue, valType];
        }
        if (method == 'remove') {
            returnValue = origValue[0];
            //console.log(origValue, "##!#");
            origValue.splice(0, 1);
            //console.log(origValue);
            //console.log("REturning, ", returnValue, " + ", origValue);
            return [returnValue, origValue, valType];
        }
        if (method == 'isEmpty') {
            returnValue = (origValue.length == 0);
            return [returnValue, origValue, "int"];
        }
        if (method == 'size') {
            returnValue = origValue.length;
            return [returnValue, origValue, "int"];
        }
        if (method == "populate") {
            var value = [];
            if (type == "Queue<Integer>") {
                for (var i = 0; i < parameters[0].value; i++) {
                    var toPush = Math.floor((Math.random()*100) + 1);
                    value.push(toPush);
                }
            } 
            if (type == "Queue<String>") {
                var options = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                for (var i = 0; i < parameters[0].value; i++) {
                    var toPush = Math.floor((Math.random()*100) + 1);
                    value.push(options[toPush]);
                }
            }
            if (type == "Queue<Float>") {
                for (var i = 0; i < parameters[0].value; i++) {
                    var toPush = parseFloat((Math.random()*(7.00 - 0.01) + 1).toFixed(2));
                    value.push([toPush, "float"]);
                }
            }
            return [returnValue, value, "Queue<Float>"];
        }
        
    }
});