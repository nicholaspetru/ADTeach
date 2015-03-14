/**
*
* Queue ADT
* Types supported: Integer, String, Float
* Methods supported: remove, add, isEmpty, size, populate, peek
* Authors: Sarah LeBlanc and Colby Seyferth
* ADTeach Team, 2015
*
**/

$(document).ready(function () {
   
    VQueue = function() {
    }
    
    /**
    *
    * Return the supported methods for the Queue ADT
    *
    *@return {Object} List of supported methods
    *
    **/
    VQueue.prototype.listMethods = function() {
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
    VQueue.prototype.checkParameters = function(method, parameters) {

        //Identify the supported methods that do not take any parameters
        var zeroParam = ["remove", "isEmpty", "size", "peek"]

        //Check number of needed parameters against number of given parameters
        if (zeroParam.indexOf(method) >= 0) {
            if (parameters.length != 0) {
                return false;
            }
        } else if (method == "add" || method == "populate") {
            if (parameters.length != 1) {
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
    VQueue.prototype.performMethod = function(type, method, parameters, env, root, adt) {
        
        //Get the current value for the ADT from the environment and make a copy of it
        var returnValue = null;
        var origValue = env.getVariables()[env.getIndex(adt)].value;
        var valueCopy = [];
        for (var i = 0; i<origValue.length; i++){
            valueCopy[i]=(origValue[i]);   
        }

        //Determine the valType (what type of values the queue holds)
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

        //Decide which method to perform

        //Add method
        //Parameters:   add(value) - adds value to the back of the queue
        //Returns:      nothing
        //              appends value to end of queue
        if (method == 'add') {

            //Make sure that parameter is compatible type with type of queue
            if (type == "Queue<Integer>") {
                if (typeof parameters[0].value != typeof 1) {
                    env.throwError(root.linenum, "Must add integer to queue");
                    root.error();
                } else if (parameters[0].value.toString().indexOf(".") >= 0) {
                    env.throwError(root.linenum, "Must add integer to queue");
                    root.error();
                }
            } else if (type == "Queue<String>") {
                if (typeof parameters[0].value != typeof "H") {
                    env.throwError(root.linenum, "Must add string to queue");
                    root.error();
                }   
            } else if (type == "Queue<Float>") {
                if (typeof parameters[0].value != typeof []) {
                    env.throwError(root.linenum, "Must add float to queue");
                    root.error();
                } else if (parameters[0].value.length < 2 || parameters[0].value[1] != "float") {
                    env.throwError(root.linenum, "Must add float to queue");
                    root.error();
                }
            }

            //Make a copy of the original value and add new value to end of the queue
            var newList = [];
            var lengthOfList = valueCopy.length;
            for (var i = 0; i < lengthOfList; i++) {
                newList.push(valueCopy[i]);
            }
            newList.push(parameters[0].value);
            valueCopy = newList;
            return [returnValue, valueCopy];
        }

        //Peek method
        //Parameters:     nothing
        //Returns:        first thing in the queue
        //                does not change the content of the queue
        if (method == "peek") {
            returnValue = valueCopy[0];
            return [returnValue, valueCopy, valType];
        }

        //Remove method
        //Parameters:   nothing
        //Returns:      first thing in the queue
        //              removes first thing in the queue                
        if (method == 'remove') {
            returnValue = valueCopy[0];
            valueCopy.splice(0, 1);
            return [returnValue, valueCopy, valType];
        }

        //IsEmpty method
        //Parameters:   nothing
        //Returns:      boolean - true if empty, false if not empty
        //              does not change the content of the queue
        if (method == 'isEmpty') {
            returnValue = (valueCopy.length == 0);
            return [returnValue, valueCopy, "int"];
        }

        //Size method
        //Parameters:   nothing
        //Returns:      integer - size of the queue
        //              does not change the content of the queue
        if (method == 'size') {
            returnValue = valueCopy.length;
            return [returnValue, valueCopy, "int"];
        }

        //Populate method
        //Parameters:   integer - number of items to fill list with
        //Returns:      nothing
        //              fills the queue with random items
        if (method == "populate") {
            var value = [];

            //Error out of user enters anything but an integer as parameter
            if (typeof parameters[0].value != typeof 2) {
                env.throwError(root.linenum, "Parameter of populate must be an integer");
                root.error();
            } else if (parameters[0].value.toString().indexOf('.') >= 0) {
                env.throwError(root.linenum, "Parameter of populate must be an integer");
                root.error();
            }

            //Fills queue with random integers
            if (type == "Queue<Integer>") {
                for (var i = 0; i < parameters[0].value; i++) {
                    var toPush = Math.floor((Math.random()*100) + 1);
                    value.push(toPush);
                }
            } 

            //Finds random numbers and fills queue with corresponding strings
            if (type == "Queue<String>") {
                var options = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                for (var i = 0; i < parameters[0].value; i++) {
                    var toPush = Math.floor((Math.random()*100) + 1);
                    value.push(options[toPush]);
                }
            }

            //Fills queue with random floats
            if (type == "Queue<Float>") {
                for (var i = 0; i < parameters[0].value; i++) {
                    var toPush = parseFloat((Math.random()*(7.00 - 0.01) + 1).toFixed(2));
                    value.push([toPush, "float"]);
                }
            }
            return [returnValue, value, type];
        }
        
    }
});