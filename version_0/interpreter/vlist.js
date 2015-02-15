/*
* VList.js
*/

$(document).ready(function () {
   
    VList = function(t) {
        this.vals = [];
        this.storeType = t;
    }
    
    VList.prototype.listMethods = function() {
        var methods = ["add", "contains", "get", "indexOf", "isEmpty", "remove", "set", "size", "populate", "clear"];
        return methods;
    }
    
    VList.prototype.checkParameters = function(method, parameters) {
        var noParam = ['isEmpty', 'size', 'clear'];
        var oneParam = ['get', 'contains', 'indexOf', 'remove', 'populate'];
        var twoParam = ['set'];
        console.log("Checking parameters of: ", method, "with parameters: ", parameters);
        if (noParam.indexOf(method) >= 0) {
            if (parameters.length != 0) {
                return false;
                console.log("no parameters");
                //new IncorrectParameters();
            }
        }
        if (oneParam.indexOf(method) >= 0) {
            console.log("Checking for one parameter");
            if (parameters.length != 1) {
                return false;
                console.log("One parameters!");
                //new IncorrectParameters();
            }
        }
        if (twoParam.indexOf(method) >= 0) {
            if (parameters.length != 2) {
                return false;
                console.log("Two parameters!");
                //new IncorrectParameters();
            }
        }
        if (method == 'add'){
            if (parameters.length > 2){
                return false;
                console.log("Need 2 params or one sometimes...");
            }
        }                
        return true;
    }
    
    VList.prototype.performMethod = function(type, origValue1, method, parameters, env, root) {
        var returnValue = null;
        var origValue = [];
        for (var i = 0; i<origValue1.length; i++){
            origValue[i]=(origValue1[i]);   
        }
        if (method == 'add') {
            
            if (parameters.length == 1){
                if (type == "List<Integer>") {
                    if (typeof parameters[0].value != typeof 2) {
                        env.throwError(root.linenum);
                        root.error();
                    } else if (parameters[0].value.toString().indexOf('.') >= 0) {
                        env.throwError(root.linenum);
                        root.error();
                    }
                } else if (type == "List<Float>") {
                    if (typeof parameters[0].value != typeof 2) {
                        env.throwError(root.linenum);
                        root.error();
                    } else if (parameters[0].value.toString().indexOf('.') < 0) {
                        env.throwError(root.linenum);
                        root.error();
                    }
                } else if (type == "List<String>") {
                    if (typeof parameters[0].value != typeof "h") {
                        env.throwError(root.linenum);
                        root.error();
                    }
                }
                origValue.push(parameters[0].value);
                return [returnValue, origValue];
            }
            else{
                if (parameters[0].value > origValue.length-1) {
                    env.throwError(root.linenum);
                    console.log("Index out of bounds");
                    root.error("Index out of bounds");
                } 
                
                if (type == "List<Integer>") {
                    if (typeof parameters[1].value != typeof 2) {
                        console.log("THIS IS TRUE");
                        env.throwError(root.linenum);
                        root.error();
                    } else if (parameters[1].value.toString().indexOf('.') >= 0) {
                        env.throwError(root.linenum);
                        root.error();
                    }
                } else if (type == "List<Float>") {
                    if (typeof parameters[1].value != typeof 2) {
                        env.throwError(root.linenum);
                        root.error();
                    } else if (parameters[1].value.toString().indexOf('.') < 0) {
                        env.throwError(root.linenum);
                        root.error();
                    }
                } else if (type == "List<String>") {
                    if (typeof parameters[1].value != typeof "h") {
                        env.throwError(root.linenum);
                        root.error();
                    }
                }
                var first = origValue.slice(0, parameters[0].value);
                var second = [parameters[1].value];
                var third = origValue.slice(parameters[0].value);
                
                origValue = first.concat(second).concat(third);                
                return [returnValue, origValue]; 
            }
        }
        if (method == 'get') {
            if (parameters[0].value > origValue.length || parameters[0].value < 0) {
                env.throwError(root.linenum);
                console.log("Index out of bounds");
                root.error("index out of bounds");
            }
            returnValue = origValue[parameters[0].value];
            return [returnValue, origValue];
        }
        if (method == 'contains') {
            returnValue = (origValue.indexOf(parameters[0].value) >= 0);
            return [returnValue, origValue];
        }
        if (method == 'indexOf') {
            returnValue = origValue.indexOf(parameters[0].value);
            return [returnValue, origValue];
        }
        if (method == "remove") {
            var index = parameters[0].value;
            if (index > -1 && index < origValue.length) {
                origValue.splice(index, 1);
            } else {
                env.throwError(root.linenum);
                console.log("Not in list");
                root.error("Not in list");
            }
            return [returnValue, origValue];
        }
        if (method == 'isEmpty') {
            returnValue = (origValue.length == 0);
            return [returnValue, origValue];
        }
        if (method == 'size') {
            returnValue = (origValue.length);
            return [returnValue, origValue];
        }
        if (method == 'clear') {
            origValue = [];
            return [returnValue, origValue];
        }
        if (method == 'set') {
            if (parameters[0].value > origValue.length-1) {
                env.throwError(root.linenum);
                console.log("Index out of bounds");
                root.error("Index out of bounds");
            } 
            
            if (type == "List<Integer>") {
                if (typeof parameters[1].value != typeof 2) {
                    env.throwError(root.linenum);
                    root.error();
                } else if (parameters[1].value.toString().indexOf(".") >= 0) {
                    env.throwError(root.linenum);
                    root.error();
                }
            } else if (type == "List<Float>") {
                if (typeof parameters[1].value != typeof 2) {
                    env.throwError(root.linenum);
                    root.error();
                } else if (parameters[1].value.toString().indexOf(".") < 0) {
                    env.throwError(root.linenum);
                    root.error();
                }
            } else if (type == "List<String>") {
                if (typeof parameters[1].value != typeof "h") {
                    env.throwError(root.linenum);
                    root.error();
                }
            }
            origValue[parameters[0].value] = parameters[1].value;
            return [returnValue, origValue];
            
        }
        if (method == 'populate') {
            if (type == "List<Integer>") {
                var value = [];
                for (i = 0; i < parameters[0].value; i++) {
                    var toPush = Math.floor((Math.random()*100) + 1);
                    value.push(toPush);
                }
                return [returnValue, value];  
            }
            if (type == "List<String>") {
                var value = [];
                for (i = 0; i < parameters[0].value; i++) {
                    var options = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    var toPush = Math.floor((Math.random()*26) + 1);
                    console.log("Going to push: ", options[toPush], typeof options[toPush]);
                    value.push('"' + options[toPush] + '"');
                }
                return [returnValue, value];
            }
            if (type == "List<Float>") {
                var value = [];
                for (i = 0; i < parameters[0].value; i++) {
                    var toPush = (Math.random()*(7.00 - 0.01) + 1).toFixed(2);
                    value.push(toPush);
                }
                return [returnValue, value];
            }
        }
    }
    
    VList.prototype.add = function(e) {
        this.vals.push(e);
    }
    
    VList.prototype.contains = function(e) {
        var contain = vals.indexOf(e);
        return (contain > 0);
    }
    
    VList.prototype.get = function(i) {
        if (i > (this.vals.length -1)) {
            env.throwError(root.linenum);
            console.log("Index out of bounds");
            root.error("Index out of bounds");
            //new IndexOutOfBoundsException();
        }
        return this.vals[i];
    }
    
    VList.prototype.indexOf = function(i) {
        for (j = 0; j < this.vals.length; j++) {
            if (this.vals[j] == i) {
                return this.vals.indexOf(j);
            }
        }
    }
    
    VList.prototype.isEmpty = function() {
        return (this.vals.length == 0);
    }
    
    VList.prototype.remove = function(i) {
        var newList = [];
        for (j = 0; j < this.vals.length; j++) {
            if (j != i) {
                newList.push(this.vals[j]);
            }
        this.vals = newList;
        }
    }
    
    VList.prototype.set = function(i, e) {
        if (i > this.vals.length) {
            env.throwError(root.linenum);
            console.log("Index out of bounds");
            root.error("Index out of bounds");
            //new IndexOutOfBoundException();
        }
        for (j = 0; j < this.vals.length; j++) {
            if (j == i) {
                this.vals[j] = e;
            }
        }
    }
    
    VList.prototype.size = function() {
        return this.vals.length;
    }
    
});