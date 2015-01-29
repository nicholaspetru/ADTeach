/*
* VStack.js
*/

$(document).ready(function () {

    VStack = function(t) {
        this.top = [];
        var string = "";
        var number = 0;
        if (t == "String") {
            this.storeType = typeof string;
        } else if (t == "int") {
            this.storeType = typeof number;
        }
    }
    
    VStack.prototype.pop = function() {
        return this.top.pop();
    }
    
    VStack.prototype.push = function(value) {
        if (typeof value != this.storeType) {
            console.log("Incompatible types");
            //new IncompatibleTypes();
        } else {
            this.top.push(value);
        }
    }
    
    VStack.prototype.isEmpty = function() {
        return (this.top.length == 0);
    }
    
    VStack.prototype.getValue = function() {
        return this.top;
    }
    
    VStack.prototype.getType = function() {
        return "Stack";
    }
    
    VStack.prototype.listMethods = function() {
        var methods = ['getValue', 'isEmpty', 'push', 'pop'];
        return methods;
    }
    
    VStack.prototype.checkParameters = function(method, parameters) {
        var noParam = ['pop', 'getValue', 'isEmpty'];
        if (noParam.indexOf(method) > 0) {
            if (parameters.length != 0) {
                console.log("no parameters");
                //new IncorrectParameters();
            }
        }
        if (method == "push") {
            if (parameters.length != 1) {
                console.log("need parameters");
                //new IncorrectParameters();
            }
        }
        return true;
    }
    
    VStack.prototype.performMethod = function(origValue, method, parameters) {
        if (method == "pop") {
            return origValue.pop();
        } if (method == "push") {
            origValue.push(parameters[0]);
        } if (method == "isEmpty") {
            return origValue.isEmpty();
        } if (method == "getValue") {
            return origValue.getValue();
        } if (method == "getType") {
            return origValue.getType();
        }

        return origValue;
    }
    
    
});