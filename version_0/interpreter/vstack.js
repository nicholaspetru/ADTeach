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
        var methods = ['getValue', 'isEmpty', 'push', 'pop', 'populate', 'peek', 'search', 'size'];
        return methods;
    }
    
    VStack.prototype.checkParameters = function(method, parameters) {
        var noParam = ['pop', 'getValue', 'isEmpty', 'peek', 'size'];
        var oneParam = ['push', 'populate', 'search'];
        if (noParam.indexOf(method) >= 0) {
            if (parameters.length != 0) {
                console.log("no parameters");
                return false;
                //new IncorrectParameters();
            }
        }
        if (oneParam.indexOf(method) >= 0) {
            if (parameters.length != 1) {
                console.log("need one parameter");
                return false;
                //new IncorrectParameters();
            }
        }
        return true;
    }
    
    VStack.prototype.performMethod = function(type, origValue1, method, parameters, env, root) {
        var returnValue = null;
        var origValue = [];
        for (var i = 0; i<origValue1.length; i++){
            origValue[i]=(origValue1[i]);   
        }
        
        if (method == "pop") {
            returnValue = origValue.pop();
            console.log('POPPING', typeof returnValue);
            if (type == "Stack<String>") {
                var valType = "String";
            } else if (type == "Stack<Integer>") {
                var valType = "int";
            } else if (type == "Stack<Float>") {
                var valType = "float";
                returnValue = returnValue[0];
            }
            return [returnValue, origValue, valType];
        } 
        
        if (method == "size") {
            returnValue = origValue.length;
            return [returnValue, origValue, "int"];
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
            return [returnValue, origValue, "int"];
        }
        
        if (method == "push") {
            if (type == "Stack<Integer>") {
                if (typeof parameters[0].value != typeof 2) {
                    env.throwError(root.linenum);
                    root.error("Incompatible types");
                } else if (parameters[0].value.toString().indexOf('.') >= 0) {
                    env.throwError(root.linenum);
                    root.error();
                }
            } else if (type == "Stack<Float>") {
                console.log("Parameters are: ", parameters);
                if (parameters[0].value[1] != "float") {
                    env.throwError(root.linenum);
                    root.error();
                } //else if (parameters[0].value.toString().indexOf('.') < 0) {
                    //env.throwError(root.linenum);
                    //root.error();
                //}
            
            } else if (type == "Stack<String>") {
                if (typeof parameters[0].value != typeof "h") {
                    env.throwError(root.linenum);
                    root.error("Incompatible types");
                }
            } 
            
            console.log("PUSHING: ", parameters[0]);
                origValue.push(parameters[0].value);
            
            return [returnValue, origValue];
        } 
        
        if (method == "isEmpty") {
            if (origValue.length == 0) {
                returnValue = true;
            } else {
                returnValue = false;
            }
            return [returnValue, origValue, "boolean"];
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
            if (type == "Stack<Float>") {
                var value = [];
                for (i = 0; i < parameters[0].value; i++) {
                    var toPush = parseFloat((Math.random()*(7.00 - 0.01) + 1).toFixed(2));
                    value.push([toPush, "float"]);
                }
                return [returnValue, value];
            }
        }
        
        if (method == "peek") {
            var length = origValue.length;
            if (type == "Stack<String>") {
                var valType = "String";
            } else if (type == "Stack<Integer>") {
                var valType = "int";
                
            } else if (type == "Stack<Float>") {
                var valType = "float";
                
            }
            if (length == 0) {
                returnValue = "null";
            } else {
                returnValue = origValue[length-1];
            }
            return [returnValue, origValue, valType];
        }
        
    }
    
    
});