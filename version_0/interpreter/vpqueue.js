/**
* Priority Queue ADT
* Types supported: Integer, Float, String
* Methods supported: getValue, isEmpty, push, pop, populate, peek, search, size
* Authors: Sarah LeBlanc and Colby Seyferth
* ADTeach Team
*/

$(document).ready(function () {
   
    VPQueue = function(t) {
        this.front = [];
        this.storeType = t;
    }
    
    /**
    *
    * Return the supported methods for the Priority Queue ADT
    *
    *@return {Object} List of supported methods
    *
    **/
    VPQueue.prototype.listMethods = function() {
        var methods = ["remove", "add", "isEmpty", "size", "populate", "peek"];
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
    
    
    /**
    *
    * Performs the method 
    *
    *@param {string} type - the type of Priority Queue
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
    VPQueue.prototype.performMethod = function(type, method, parameters, env, root, adt) {
        var returnValue = null;
        var origValue = [];
        var origValue2 = env.getVariables()[env.getIndex(adt)].value;
        for (var i = 0; i<origValue2.length; i++){
            origValue[i]=(origValue2[i]);   
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

        //Decide which method to perform

        //Add method
        //Parameters: add(value) - adds value to end of queue then sorts
        //Returns:    nothing
        //            updates the queue with new value added
        if (method == 'add') {
            //Check to make sure that the value being added is compatible with type of queue
            //If they are not compatible, throw an error to the environment and error out of the interpreter
            if (type == "PriorityQueue<Integer>") {
                    if (typeof parameters[0].value != typeof 2) {
                        env.throwError(root.linenum, "Incompatible Types! Expected int, received " + typeof parameters[0].value);
                        root.error();
                    } else if (parameters[0].value.toString().indexOf('.') >= 0) {
                        env.throwError(root.linenum, "Incompatible Types! Expected int, received float");
                        root.error();
                    }
                } else if (type == "PriorityQueue<Float>") {
                    if (typeof parameters[0].value != typeof []) {
                        env.throwError(root.linenum, "Incompatible Types! Expected float, received " + typeof parameters[0].value);
                        root.error();
                    } else if (parameters[0].value.length < 2 || parameters[0].value[1] != "float") {
                        env.throwError(root.linenum, "Must add float to queue");
                        root.error();
                    }
                } else if (type == "PriorityQueue<String>") {
                    if (typeof parameters[0].value != typeof "h") {
                        env.throwError(root.linenum, "Incompatible Types! Expected String, received " + typeof parameters[0].value);
                        root.error();
                    }
                }

            //If they are compatible types, push the value onto the copy of the current value and return
            //the new value of the list and null for the returnValue
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
            returnValue = origValue.indexOf(parameters[0].value);
            console.log("Just added: ", parameters[0].value, "to list at index: ", returnValue);
            return [returnValue, origValue];
        }

        //Peek method
        //Parameters: nothing
        //Returns:    The item at the front of the queue
        //            updates nothing
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

        //Remove method
        //Parameters: nothing
        //Returns:    The item in the front of the queue
        //            updates the queue with front value removed
        if (method == 'remove') {
            returnValue = origValue[0];
            //console.log(origValue, "##!#");
            origValue.splice(0, 1);
            //console.log("REturning, ", returnValue, " + ", origValue);
            return [returnValue, origValue, valType];
        }

        //isEmpty method
        //Parameters: nothing
        //Returns:    true if the queue is empty, false otherwise
        //            updates nothing
        if (method == 'isEmpty') {
            returnValue = (origValue.length == 0);
            return [returnValue, origValue, "boolean"];
        }

        //Size method
        //Parameters: nothing
        //Returns:    the length of the queue
        //            updates nothing
        if (method == 'size') {
            returnValue = origValue.length;
            return [returnValue, origValue, "int"];
        }

        //Populate method 
        //Parameters: populate(num) - adds num random elements to queue then sorts
        //Returns:    nothing
        //            updates the queue with new value(s) added
        if (method == "populate") {
            if (typeof parameters[0].value != typeof 2){
                env.throwError(root.linenum, "populate requires integer input");
                this.error();
            }

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