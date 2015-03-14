/**
* Stack ADT
* Types supported: Integer, Float, String
* Methods supported: getValue, isEmpty, push, pop, populate, peek, search, size
* Authors: Sarah LeBlanc and Colby Seyferth
* ADTeach Team
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
    
    /**
    *
    * Return the supported methods for the Stack ADT
    *
    *@return {Object} List of supported methods
    *
    **/
    VStack.prototype.listMethods = function() {
        var methods = ['isEmpty', 'push', 'pop', 'populate', 'peek', 'search', 'size'];
        return methods;
    }
    
    /**
    *
    *Error checking for number of parameters needed against number of parameters given
    *
    *@param {string} method - The method being called
    *@param {Object} parameters - The list of parameters being passed in
    *
    *@return {Boolean} Returns true if the number of given parameters matches number of 
    *                   required parameters for method.
    *
    **/
    VStack.prototype.checkParameters = function(method, parameters) {
        var noParam = ['pop', 'isEmpty', 'peek', 'size'];
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
    
    
    /**
    *
    * Performs the method 
    *
    *@param {string} type - the type of Stack
    *@param {string} method - the method being called
    *@param {Object} parameters - a list of the parameters passed in
    *@param {Object} env - the working environment
    *@param {Object} root - the FunCall block 
    *@param {string} adt - the variable name for the ADT
    *
    *@return {Object} [returnValue, valueCopy, valType] - a list containing the value returned from method,
    *                       the updated value of the ADT, and the correct type of the returned value.
    *
    **/
    VStack.prototype.performMethod = function(type, method, parameters, env, root, adt) {
        var returnValue = null;
        var valueCopy = [];
        var origValue = env.getVariables()[env.getIndex(adt)].value;
        for (var i = 0; i<origValue.length; i++){
            valueCopy[i]=(origValue[i]);   
        }
        
        
        if (method == "pop") {
            returnValue = valueCopy.pop();
            console.log('POPPING', typeof returnValue);
            if (type == "Stack<String>") {
                var valType = "String";
            } else if (type == "Stack<Integer>") {
                var valType = "int";
            } else if (type == "Stack<Float>") {
                var valType = "float";
                console.log("POPPING FLOATS", returnValue);
                returnValue = returnValue;
            }
            return [returnValue, valueCopy, valType];
        } 
        
        if (method == "size") {
            returnValue = valueCopy.length;
            return [returnValue, valueCopy, "int"];
        }
        
        if (method == "search") {
            console.log("*&#(*$&#(*$&#(*&$#(*&$");
            console.log("Searching for: ", parameters);
            
            if (parameters[0].value.length == 2 && parameters[0].value[1] == "float") {
                var count = 1;
                if (type == "Stack<Float>") {
                    for (var i = valueCopy.length -1; i > -1; i--) {
                        if (valueCopy[i][0] == parameters[0].value[0]) {
                            returnValue = count;
                            break;
                        } else {
                            count += 1;
                        }
                    }
                } else {
                    returnValue = -1;
                }
                return [returnValue, valueCopy, "int"];
            } 
            
            if (valueCopy.indexOf(parameters[0].value) >= 0) {
                var count = 1;
                for (var i = valueCopy.length - 1; i > -1; i--) {
                    if (valueCopy[i] == parameters[0].value) {
                        returnValue = count;
                        break;
                    } else {
                        count += 1;
                    }
                }
            } else {
                returnValue = -1;
            }
            return [returnValue, valueCopy, "int"];
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
                valueCopy.push(parameters[0].value);
            
            return [returnValue, valueCopy];
        } 
        
        if (method == "isEmpty") {
            if (valueCopy.length == 0) {
                returnValue = true;
            } else {
                returnValue = false;
            }
            return [returnValue, valueCopy, "boolean"];
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
                    value.push('"' + options[toPush] + '"');
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
            var length = valueCopy.length;
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
                returnValue = valueCopy[length-1];
            }
            return [returnValue, valueCopy, valType];
        }
        
    }
    
    
});