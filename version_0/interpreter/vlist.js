/**
*
* List ADT
* Types supported: Integer, String, Float
* Methods supported: add, contains, get, indexOf, isEmpty, remove, set, size, populate, clear
* Authors: Colby Seyferth and Sarah LeBlanc
* ADTeach Team
*
**/

$(document).ready(function () {
   
    VList = function() {
    }
    
    /**
    *
    * Return the supported methods for the List ADT
    *
    *@return {Object} List of supported methods
    *
    **/
    VList.prototype.listMethods = function() {
        var methods = ["add", "contains", "get", "indexOf", "isEmpty", "remove", "set", "size", "populate", "clear"];
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
    VList.prototype.checkParameters = function(method, parameters) {

        //Separate the supported methods based on how many parameters they take
        var noParam = ['isEmpty', 'size', 'clear'];
        var oneParam = ['get', 'contains', 'indexOf', 'remove', 'populate'];
        var twoParam = ['set'];
        if (method == 'add'){
            if (parameters.length > 2){
                return false;
            }
        }

        //Check the number of needed parameters against number of given parameters
        if (noParam.indexOf(method) >= 0) {
            if (parameters.length != 0) {
                return false;
            }
        }
        if (oneParam.indexOf(method) >= 0) {
            if (parameters.length != 1) {
                return false;
            }
        }
        if (twoParam.indexOf(method) >= 0) {
            if (parameters.length != 2) {
                return false;
            }
        }    
        return true;
    }
    

    /**
    *
    * Performs the method 
    *
    *@param {string} type - the type of List
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
    VList.prototype.performMethod = function(type, method, parameters, env, root, adt) {
        console.log("TYpe of root:::::", typeof parameters)
        var returnValue = null;
        var origValue = env.getVariables()[env.getIndex(adt)].value;
        var valueCopy = [];
        for (var i = 0; i<origValue.length; i++){
            valueCopy[i]=(origValue[i]);   
        }
        if (method == 'add') {
            
            if (parameters.length == 1){
                //console.log("Parameters are: ", parameters);
                if (type == "List<Integer>") {
                    if (typeof parameters[0].value != typeof 2) {
                        env.throwError(root.linenum);
                        root.error();
                    } else if (parameters[0].value.toString().indexOf('.') >= 0) {
                        env.throwError(root.linenum);
                        root.error();
                    }
                } else if (type == "List<Float>") {
                    //console.log("Parameters are: ", parameters);
                    if (typeof parameters[0].value != typeof []) {
                        env.throwError(root.linenum);
                        root.error("Expected float");
                    } else if (parameters[0].value.length < 2 || parameters[0].value[1] != "float") {
                        env.throwError(root.linenum);
                        root.error("Expected float");
                    }
                } else if (type == "List<String>") {
                    if (typeof parameters[0].value != typeof "h") {
                        env.throwError(root.linenum);
                        root.error();
                    }
                }
                if (type == "List<Float>") {
                    valueCopy.push([parameters[0].value, "float"]);
                } else {
                    valueCopy.push(parameters[0].value);
                }
                return [returnValue, valueCopy];
            }
            else {
                if (parameters[0].value > valueCopy.length-1) {
                    env.throwError(root.linenum);
                    //console.log("Index out of bounds");
                    root.error("Index out of bounds");
                } 
                
                if (type == "List<Integer>") {
                    if (typeof parameters[1].value != typeof 2) {
                        //console.log("THIS IS TRUE");
                        env.throwError(root.linenum);
                        root.error();
                    } else if (parameters[1].value.toString().indexOf('.') >= 0) {
                        env.throwError(root.linenum);
                        root.error();
                    }
                } else if (type == "List<Float>") {
                    if (parameters[1].value[1] != "float") {
                        env.throwError(root.linenum);
                        root.error();
                    }
                } else if (type == "List<String>") {
                    if (typeof parameters[1].value != typeof "h") {
                        env.throwError(root.linenum);
                        root.error();
                    }
                }
                var first = valueCopy.slice(0, parameters[0].value);
                var second = [parameters[1].value];
                if (type == "List<Float>") second = [[second[0], "float"]];
                var third = valueCopy.slice(parameters[0].value);
                
                valueCopy = first.concat(second).concat(third);                
                return [returnValue, valueCopy]; 
            }
        }
        if (method == 'get') {
            var valType;
            switch (type) {
                case "List<Integer>":
                    valType = "int";
                    returnValue = parseInt(valueCopy[parameters[0].value]);
                    break;
                case "List<Float>":
                    valType = "float";
                    returnValue = parseFloat(valueCopy[parameters[0].value]);
                    break;
                case "List<String>":
                    valType = "String";
                    returnValue = valueCopy[parameters[0].value];
                    break;
            }
            if (parameters[0].value > valueCopy.length || parameters[0].value < 0) {
                env.throwError(root.linenum);
                //console.log("Index out of bounds");
                root.error("index out of bounds");
            }
            
            //returnValue = valueCopy[parameters[0].value];
            //console.log("Type of: ", returnValue, "is", typeof returnValue);
            return [returnValue, valueCopy, valType];
        }


        if (method == 'contains') {
            if (type == "List<Float>") {
                if (typeof parameters[0].value != typeof []) {
                    env.throwError(root.linenum);
                    root.error("Expected float");
                } else if (parameters[0].value.length < 2 || parameters[0].value[1] != "float") {
                    env.throwError(root.linenum);
                    root.error("Expected float");
                }
                var index = -1;
                for(var i = 0; i < valueCopy.length; i++){
                    if (valueCopy[i][0][0] == parameters[0].value[0]) index = i;
                }
                if (index >= 0)  return [true, valueCopy, "boolean"];
                return [false, valueCopy, "boolean"];
            }
            returnValue = (valueCopy.indexOf(parameters[0].value) >= 0);
            return [returnValue, valueCopy, "boolean"];
        }
        if (method == 'indexOf') {
            if (type == "List<Float>") {
                if (typeof parameters[0].value != typeof []) {
                    env.throwError(root.linenum);
                    root.error("Expected float");
                } else if (parameters[0].value.length < 2 || parameters[0].value[1] != "float") {
                    env.throwError(root.linenum);
                    root.error("Expected float");
                }
                var index = -1;
                for(var i = 0; i < valueCopy.length; i++){
                    if (valueCopy[i][0][0] == parameters[0].value[0]) index = i;
                }
                returnValue = index;
                return [returnValue, valueCopy, "int"];
            }
            returnValue = valueCopy.indexOf(parameters[0].value);
            return [returnValue, valueCopy, "int"];
        }
        if (method == "remove") {
            var index = parameters[0].value;

            switch (type) {
                case "List<Integer>":
                    valType = "int";
                    returnValue = parseInt(valueCopy[parameters[0].value]);
                    break;
                case "List<Float>":
                    valType = "float";
                    returnValue = parseFloat(valueCopy[parameters[0].value]);
                    break;
                case "List<String>":
                    valType = "String";
                    returnValue = valueCopy[parameters[0].value];
                    break;
            }

            if (index > -1 && index < valueCopy.length) {
                valueCopy.splice(index, 1);
            } else {
                env.throwError(root.linenum);
                //console.log("Not in list");
                root.error("Not in list");
            }


            

            return [returnValue, valueCopy, valType];
        }
        if (method == 'isEmpty') {
            returnValue = (valueCopy.length == 0);
            return [returnValue, valueCopy, 'boolean'];
        }
        if (method == 'size') {
            returnValue = (valueCopy.length);
            return [returnValue, valueCopy, 'int'];
        }
        if (method == 'clear') {
            valueCopy = [];
            return [returnValue, valueCopy];
        }
        if (method == 'set') {
            if (parameters[0].value > valueCopy.length-1) {
                env.throwError(root.linenum);
                //console.log("Index out of bounds");
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
                if (typeof parameters[1].value != typeof []) {
                    env.throwError(root.linenum);
                    root.error("Expected float");
                } else if (parameters[1].value.length < 2 || parameters[1].value[1] != "float") {
                    env.throwError(root.linenum);
                    root.error("Expected float");
                }
                valueCopy[parameters[0].value] = [parameters[1].value, "float"];
                return [returnValue, valueCopy];
            } else if (type == "List<String>") {
                if (typeof parameters[1].value != typeof "h") {
                    env.throwError(root.linenum);
                    root.error();
                }
            }
            valueCopy[parameters[0].value] = parameters[1].value;
            return [returnValue, valueCopy];
            
        }
        if (method == 'populate') {
            if (type == "List<Integer>") {
                var value = [];
                for (i = 0; i < parameters[0].value; i++) {
                    var toPush = Math.floor((Math.random()*100) + 1);
                    value.push(toPush);
                }
                return [returnValue, value, type];  
            }
            if (type == "List<String>") {
                var value = [];
                for (i = 0; i < parameters[0].value; i++) {
                    var options = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    var toPush = Math.floor((Math.random()*26) + 1);
                    //console.log("Going to push: ", options[toPush], typeof options[toPush]);
                    value.push('"' + options[toPush] + '"');
                }
                return [returnValue, value, type];
            }
            if (type == "List<Float>") {
                var value = [];
                for (i = 0; i < parameters[0].value; i++) {
                    var toPush = parseFloat((Math.random()*(7.00 - 0.01) + 1).toFixed(2));
                    value.push([toPush,  "float"]);
                }
                return [returnValue, value, type];
            }
        }
    }
});