/**
*
* List ADT
* Types supported: Integer, String, Float
* Methods supported: add, contains, get, indexOf, isEmpty, remove, set, size, populate, clear
* Authors: Colby Seyferth and Sarah LeBlanc
* ADTeach Team, 2015
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
        
        //Get the current value for the ADT from the environment and make a copy of it
        var returnValue = null;
        var origValue = env.getVariables()[env.getIndex(adt)].value;
        var valueCopy = [];
        for (var i = 0; i<origValue.length; i++){
            valueCopy[i]=(origValue[i]);   
        }

        //Decide which method to perform

        //Add method
        //Parameters: add(value) - adds value to end of list
        //            add(index, value) - adds value to given index
        //Returns:    nothing
        //            updates the list with new value added
        if (method == 'add') {

            //Perform add method with one parameter (add to end of list)
            if (parameters.length == 1){

                //Check to make sure that the value being added is compatible with type of list
                //If they are not compatible, throw an error to the environment and error out of the interpreter
                if (type == "List<Integer>") {
                    if (typeof parameters[0].value != typeof 2) {
                        env.throwError(root.linenum, "Must add integer to list");
                        root.error();
                    } else if (parameters[0].value.toString().indexOf('.') >= 0) {
                        env.throwError(root.linenum, "Must add integer to list");
                        root.error();
                    }
                } else if (type == "List<Float>") {
                    if (typeof parameters[0].value != typeof []) {
                        env.throwError(root.linenum, "Must add float to list");
                        root.error();
                    } else if (parameters[0].value.length < 2 || parameters[0].value[1] != "float") {
                        env.throwError(root.linenum, "Must add float to list");
                        root.error();
                    }
                } else if (type == "List<String>") {
                    if (typeof parameters[0].value != typeof "h") {
                        env.throwError(root.linenum, "Must add string to list");
                        root.error();
                    }
                }

                //If they are compatible types, push the value onto the copy of the current value and return
                //the new value of the list and null for the returnValue
                if (type == "List<Float>") {
                    valueCopy.push(parameters[0].value);
                } else {
                    valueCopy.push(parameters[0].value);
                }
                return [returnValue, valueCopy];
            }

            //Perform add method when there are two parameters (value to add, index to add it)
            else {

                //Make sure index is not out of bounds, or else throw an error
                if (parameters[0].value > valueCopy.length-1) {
                    env.throwError(root.linenum, "Index out of bounds");
                    root.error();
                } 
                
                //Check that what is being added is of compatible to the type of list
                if (type == "List<Integer>") {
                    if (typeof parameters[1].value != typeof 2) {
                        env.throwError(root.linenum, "Must add integer to list");
                        root.error();
                    } else if (parameters[1].value.toString().indexOf('.') >= 0) {
                        env.throwError(root.linenum, "Must add integer to list");
                        root.error();
                    }
                } else if (type == "List<Float>") {
                    if (parameters[1].value[1] != "float") {
                        env.throwError(root.linenum, "Must add float to list");
                        root.error();
                    }
                } else if (type == "List<String>") {
                    if (typeof parameters[1].value != typeof "h") {
                        env.throwError(root.linenum, "Must add string to list");
                        root.error();
                    }
                }

                //Split the list with values before index and values after index
                var first = valueCopy.slice(0, parameters[0].value);
                var second = [parameters[1].value];
                if (type == "List<Float>") second = [[second[0], "float"]];
                var third = valueCopy.slice(parameters[0].value);
                
                //Concantenate parts of list into the value to return
                valueCopy = first.concat(second).concat(third);                
                return [returnValue, valueCopy]; 
            }
        }

        //Get method
        //Parameters:   get(index) - finds value at index
        //Returns:      value (integer, string, or float), at index
        //              does not change contents of list
        if (method == 'get') {
            var valType;

            //Error out if parameter is not an integer
            if (typeof parameters[0].value != typeof 2) {
                env.throwError(root.linenum, "Index must be an integer");
                root.error();
            } else if (parameters[0].value.toString().indexOf('.') >= 0) {
                env.throwError(root.linenum, "Index must be an integer");
                root.error();
            }

            //Determine the correct type for value being returned, get the item at index of list
            switch (type) {
                case "List<Integer>":
                    valType = "int";
                    returnValue = parseInt(valueCopy[parameters[0].value]);
                    break;
                case "List<Float>":
                    valType = "float";
                    returnValue = valueCopy[parameters[0].value];
                    break;
                case "List<String>":
                    valType = "String";
                    returnValue = valueCopy[parameters[0].value];
                    break;
            }

            //Error out if index is out of bounds
            if (parameters[0].value > valueCopy.length || parameters[0].value < 0) {
                env.throwError(root.linenum, "Index out of bounds");
                root.error();
            }
            
            return [returnValue, valueCopy, valType];
        }

        //Contains method
        //Parameters:   contains(value) - decides if value is in list
        //Returns:      boolean - true if in list, false if not
        //              does not change contents of list
        if (method == 'contains') {

            //Finding an item in a list of floats is different than other types because of the different
            //format of floats
            if (type == "List<Float>") {

                //Make sure user is looking for a float, or else error
                if (typeof parameters[0].value != typeof []) {
                    env.throwError(root.linenum, "Must be looking for a float");
                    root.error();
                } else if (parameters[0].value.length < 2 || parameters[0].value[1] != "float") {
                    env.throwError(root.linenum, "Must be looking for a float");
                    root.error();
                }

                //Iterate through list looking for value of float in the list
                var index = -1;
                for(var i = 0; i < valueCopy.length; i++){
                    if (valueCopy[i][0] == parameters[0].value[0]) index = i;
                }

                //Return true if found, false if not
                if (index >= 0)  return [true, valueCopy, "boolean"];
                return [false, valueCopy, "boolean"];
            }

            //Make sure user is looking for item of compatible type to type of list, else error 
            if (type == "List<Integer>") {
                if (typeof parameters[0].value != typeof 2) {
                    env.throwError(root.linenum, "Must be looking for an integer");
                    root.error();
                } else if (parameters[0].value.toString().indexOf('.') >= 0) {
                    env.throwError(root.linenum, "Must be looking for an integer");
                    root.error();
                }
            } else if (type == "List<String>") {
                if (typeof parameters[0].value != typeof "") {
                    env.throwError(root.linenum, "Must be looking for a string");
                }
            }

            //Look for value in the list, return
            returnValue = (valueCopy.indexOf(parameters[0].value) >= 0);
            return [returnValue, valueCopy, "boolean"];
        }

        //IndexOf method
        //Parameters:   indexOf(value) - returns the index of the value in the list
        //Returns:      integer - index of the value
        //              does not change content of list
        if (method == 'indexOf') {

            //Lists of floats have special case
            if (type == "List<Float>") {

                //Make sure user is looking for index of a float
                if (typeof parameters[0].value != typeof []) {
                    env.throwError(root.linenum, "Must be looking for the index of a float");
                    root.error();
                } else if (parameters[0].value.length < 2 || parameters[0].value[1] != "float") {
                    env.throwError(root.linenum, "Must be looking for the index of a float");
                    root.error();
                }

                //Iterate through list until found given float, set index to return value and return
                var index = -1;
                for(var i = 0; i < valueCopy.length; i++){
                    if (valueCopy[i][0][0] == parameters[0].value[0]) index = i;
                }
                returnValue = index;
                return [returnValue, valueCopy, "int"];
            }

            //Check to make sure user is looking for item of compatible types to type of list
            if (type == "List<Integer>") {
                if (typeof parameters[0].value != typeof 2) {
                    env.throwError(root.linenum, "Must be looking for index of an integer");
                    root.error();
                } else if (parameters[0].value.toString().indexOf('.') >= 0) {
                    env.throwError(root.linenum, "Must be looking for index of an integer");
                    root.error();
                }
            } else if (type == "List<String>") {
                if (typeof parameters[0].value != typeof "") {
                    env.throwError(root.linenum, "Must be looking for index of a string");
                }
            }

            //Find index of the value given and return
            returnValue = valueCopy.indexOf(parameters[0].value);
            return [returnValue, valueCopy, "int"];
        }

        //Remove method
        //Parameters:   remove(index)
        //Returns:      value of item at specific index
        //              removes item from value of list
        if (method == "remove") {
            var index = parameters[0].value;

            //Error out of user enters anything but an integer as the index
            if (typeof parameters[0].value != typeof 2) {
                env.throwError(root.linenum, "Index must be an integer");
                root.error();
            } else if (parameters[0].value.toString().indexOf('.') >= 0) {
                env.throwError(root.linenum, "Index must be an integer");
                root.error();
            }

            //Determine the type of the return value and get value at index in list and store in returnValue
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

            //Remove item from the list, or error out if item not in list
            if (index > -1 && index < valueCopy.length) {
                valueCopy.splice(index, 1);
            } else {
                env.throwError(root.linenum, "Item not in list");
                root.error();
            }

            return [returnValue, valueCopy, valType];
        }


        //IsEmpty method
        //Parameters:       none
        //Returns:          boolean - true if empty, false if not
        //                  does not change content of list
        if (method == 'isEmpty') {
            returnValue = (valueCopy.length == 0);
            return [returnValue, valueCopy, 'boolean'];
        }

        //Size method
        //Parameters:       none
        //Returns:          integer - size of list
        //                  does not change content of list
        if (method == 'size') {
            returnValue = (valueCopy.length);
            return [returnValue, valueCopy, 'int'];
        }

        //Clear method
        //Parameters:       none
        //Returns:          none
        //                  removes everything from list
        if (method == 'clear') {
            valueCopy = [];
            return [returnValue, valueCopy];
        }

        //Set method
        //Parameters:       set(index, value) - sets the item at index to the value
        //Returns:          none
        //                  changes item in list to value at index
        if (method == 'set') {

            //Error out of user enters anything but an integer as the index
            if (typeof parameters[0].value != typeof 2) {
                env.throwError(root.linenum, "Index must be an integer");
                root.error();
            } else if (parameters[0].value.toString().indexOf('.') >= 0) {
                env.throwError(root.linenum, "Index must be an integer");
                root.error();
            }

            //Error out if index is out of bounds
            if (parameters[0].value > valueCopy.length-1) {
                env.throwError(root.linenum, "Index out of bounds");
                root.error();
            } 
            
            //Error checking to make sure item being set to index is compatible for type of list
            if (type == "List<Integer>") {
                if (typeof parameters[1].value != typeof 2) {
                    env.throwError(root.linenum, "Must be setting item at index to an integer");
                    root.error();
                } else if (parameters[1].value.toString().indexOf(".") >= 0) {
                    env.throwError(root.linenum, "Must be setting item at index to an integer");
                    root.error();
                }
            } else if (type == "List<Float>") {
                if (typeof parameters[1].value != typeof []) {
                    env.throwError(root.linenum, "Must be setting item at index to a float");
                    root.error();
                } else if (parameters[1].value.length < 2 || parameters[1].value[1] != "float") {
                    env.throwError(root.linenum, "Must be setting item at index to a float");
                    root.error();
                }

                //Set the value at index to be value passed in as float
                valueCopy[parameters[0].value] = parameters[1].value;
                return [returnValue, valueCopy];

            } else if (type == "List<String>") {
                if (typeof parameters[1].value != typeof "h") {
                    env.throwError(root.linenum);
                    root.error();
                }
            }

            //Set item at index to the given value and return
            valueCopy[parameters[0].value] = parameters[1].value;
            return [returnValue, valueCopy];
        }

        //Populate method
        //Parameters:       integer - size of desired list
        //Returns:          none
        //                  fills list with random values
        if (method == 'populate') {

            //Error out of user enters anything but an integer as parameter
            if (typeof parameters[0].value != typeof 2) {
                env.throwError(root.linenum, "Parameter of populate must be an integer");
                root.error();
            } else if (parameters[0].value.toString().indexOf('.') >= 0) {
                env.throwError(root.linenum, "Parameter of populate must be an integer");
                root.error();
            }

            //Create a new list and fill with random integers
            if (type == "List<Integer>") {
                var value = [];
                for (i = 0; i < parameters[0].value; i++) {
                    var toPush = Math.floor((Math.random()*100) + 1);
                    value.push(toPush);
                }
                return [returnValue, value, type];  
            }

            //Pick random numbers and fill list with corresponding letters
            if (type == "List<String>") {
                var value = [];
                for (i = 0; i < parameters[0].value; i++) {
                    var options = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    var toPush = Math.floor((Math.random()*26) + 1);
                    value.push('"' + options[toPush] + '"');
                }
                return [returnValue, value, type];
            }

            //Pick random floats to 2 decimal positions and fill list
            if (type == "List<Float>") {
                var value = [];
                for (i = 0; i < parameters[0].value; i++) {
                    var toPush = parseFloat((Math.random()*(7.00 - 0.01) + 1).toFixed(2));
                    var rounded = toPush.toFixed(1);
                    value.push([rounded,  "float"]);
                }
                return [returnValue, value, type];
            }
        }
    }
});