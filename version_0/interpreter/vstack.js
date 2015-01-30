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
            console.log(t);
            this.storeType = typeof number;
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
                console.log("need one parameter");
                //new IncorrectParameters();
            }
        }
        return true;
    }
    
    VStack.prototype.performMethod = function(type, origValue, method, parameters) {
        var returnValue = null;
        if (method == "pop") {
            returnValue = origValue.pop();
            return returnValue, origValue;
        } if (method == "push") {
            if (type == "Stack<Integer>") {
                if (parameters[0].jtype != "INT_TYPE") {
                    console.log('INCOMPATIBLE TYPES, want ints');
                }
            } elif (type == "Stack<String>") {
                if (parameters[0].jtype != "STRING_TYPE") {
                    console.log('INCOMPATIBLE TYPES, want strings');
                }
            }
            //TODO: Check types
            origValue.push(parameters[0]);
            return returnValue, origValue;
        } if (method == "isEmpty") {
            return origValue.isEmpty();
        } if (method == "getValue") {
            return origValue.getValue();
        } if (method == "getType") {
            return origValue.getType();
        }
        
    }
    
    
});