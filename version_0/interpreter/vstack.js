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
        var methods = ['getValue', 'isEmpty', 'push', 'pop', 'populate', 'peek', 'search'];
        return methods;
    }
    
    VStack.prototype.checkParameters = function(method, parameters) {
        var noParam = ['pop', 'getValue', 'isEmpty', 'peek'];
        var oneParam = ['push', 'populate', 'search'];
        if (noParam.indexOf(method) >= 0) {
            if (parameters.length != 0) {
                console.log("no parameters");
                //new IncorrectParameters();
            }
        }
        if (oneParam.indexOf(method) >= 0) {
            if (parameters.length != 1) {
                console.log("need one parameter");
                //new IncorrectParameters();
            }
        }
        return true;
    }
    
    VStack.prototype.performMethod = function(type, origValue1, method, parameters) {
        var returnValue = null;
        var origValue = [];
        for (var i = 0; i<origValue1.length; i++){
            origValue[i]=(origValue1[i]);   
        }
        
        if (method == "pop") {
            returnValue = origValue.pop();
            return [returnValue, origValue];
        } 
        
        if (method == "search") {
            var count = 1;
            if (origValue.indexOf(parameters[0].value) >= 0) {
                for (var i = origValue.length - 1; i > -1; i--) {
                    if (origValue[i] == parameters[0].value) {
                        returnValue = count;
                        break;
                    } else {
                        count += 1;
                    }
                }
            } else {
                returnValue = -1;
            }
            return [returnValue, origValue];
        }
        
        if (method == "push") {
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
        } 
        
        if (method == "isEmpty") {
            if (origValue.length == 0) {
                returnValue = true;
            } else {
                returnValue = false;
            }
            return [returnValue, origValue];
        } 
        
        if (method == "getValue") {
            return origValue.getValue();
        } 
        
        if (method == "getType") {
            return origValue.getType();
        } 
        
        if (method == "populate") {
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
        
        if (method == "peek") {
            var length = origValue.length;
            returnValue = origValue[length-1];
            return [returnValue, origValue];
        }
        
    }
    
    
});