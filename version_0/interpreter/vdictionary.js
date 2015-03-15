/**
*
* Dictionary ADT
* Types supported: (key - Integer, String, Float) (value - Integer, String, Float)
* Methods supported: elements, get, isEmpty, keys, put, remove, size, populate
* Authors: Colby Seyferth and Sarah LeBlanc
* ADTeach Team, 2015
*
**/

$(document).ready(function () {
   
    VDictionary = function() {
    }
    
    /**
    *
    * Return the supported methods for the Dictionary ADT
    *
    *@return {Object} List of supported methods
    *
    **/
    VDictionary.prototype.listMethods = function() {
        var methods = ['elements', 'get', 'isEmpty', 'keys', 'put', 'remove', 'size', 'populate'];
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
    VDictionary.prototype.checkParameters = function(method, parameters) {

        //Separate the supported methods based on how many parameters they take
        var zeroParam = ['elements', 'isEmpty', 'keys', 'size'];
        var oneParam = ['get', 'remove', 'populate'];
        var twoParam = ['put']
        
        //Check the number of needed parameters against number of given parameters
        if (zeroParam.indexOf(method) >= 0) {
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
    *Method to return type of value as a string
    *
    *@param {Object} val - value looking for type of
    *
    *@return {string} - type of value (float, int, String)
    *
    **/
    VDictionary.prototype.getType = function(val) {
        if (val.length == 2 && val[1] == "float") {
            return "float";
        } else if (typeof val == typeof 1) {
            return "int";
        } else if (typeof val == typeof "h") {
            return "String";
        } 
    }
    
    /**
    *
    *Given a dictionary, finds out if dictionary already contains key
    *
    *@param {Object} key - the key looking for in the dictionary
    *@param {Object} dict - the current dictionary
    *
    *@return {Boolean} - true if dictionary already has the key, false otherwise
    *
    **/
    VDictionary.prototype.containsKey = function(key, dict) {
        for (var i in dict) {
            if (i == key) {
                return true;
            }
        }
        return false;
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
    VDictionary.prototype.performMethod = function(type, method, parameters, env, root, adt) {
        var keyType;
        var valueJType;
        var valueType;

        //Determine the type of key dictionary can hold
        switch(type) {
            case "Dictionary<Integer, Integer>":
            case "Dictionary<Integer, String>":
            case "Dictionary<Integer, Float>":
                keyType = "int";
                break;
            case "Dictionary<String, Integer>":
            case "Dictionary<String, String>":
            case "Dictionary<String, Float>":
                keyType = "String";
                break;
            case "Dictionary<Float, Integer>":
            case "Dictionary<Float, String>":
            case "Dictionary<Float, Float>":
                keyType = "float";
                break;
        }

        //Determine the type of value dictionary can hold
        switch (type) {
            case "Dictionary<Integer, Integer>":
            case "Dictionary<String, Integer>":
            case "Dictionary<Float, Integer>":
                valueType = "int";
                break;
            case "Dictionary<Integer, String>":
            case "Dictionary<String, String>":
            case "Dictionary<Float, String>":
                valueType = "String";
                break;
            case "Dictionary<Integer, Boolean>":
            case "Dictionary<String, Boolean>":
            case "Dictionary<Float, Boolean>":
                valueType = "boolean";
                break;
            case "Dictionary<Integer, Float>":
            case "Dictionary<String, Float>":
            case "Dictionary<Float, Float>":
                valueType = "float";
                break;
        }

        //Get current value of dictionary and make a copy of it
        var returnValue = null;
        var origValue = env.getVariables()[env.getIndex(adt)].value;
        var valueCopy = {};
        var length = 0;
        for (var i in origValue){
            valueCopy[i] = origValue[i];
            length += 1;
        }
        
        //Determine method to perform

        //Get method
        //Parameters:   get(key) - key to look up value for 
        //Returns:      int || string || float - value in dictionary of key
        //              does not change content of dictionary
        if (method == 'get') {
            var key = parameters[0].value;
            var getType = this.getType(key);

            //Ensure parameter matches key type of dictionary
            if (getType != keyType) {
                env.throwError(root.linenum, "Parameter must be same type as dictionary keys");
                root.error();
            }

            returnValue = valueCopy[parameters[0].value];
            return [returnValue, valueCopy, valueType];
        }
        
        //Elements method
        //Parameters:   nothing
        //Returns:      list of values of dictionary
        //              does not change content of dictionary
        if (method == 'elements') {
            var valType;

            //Determine what kind of list will be returned based on value type of dictionary
            switch (valueType) {
                case "int":
                    valType = "List<Integer>";
                    break;
                case "String":
                    valType = "List<String>";
                    break;
                case "float":
                    valType = "List<Float>";
                    break;
            }

            //Create list of all values in dictionary
            returnValue = [];
            for (var i in valueCopy) {
                returnValue.push(valueCopy[i]);
            }
            return [returnValue, valueCopy, valType];
        }
        
        //IsEmpty method
        //Parameters:  
        //Returns: 
        if (method == 'isEmpty') {
            returnValue = (valueCopy.length == 0);
            return [returnValue, valueCopy, "boolean"];
        }
        
        //Keys method
        //Parameters:  
        //Returns: 
        if (method == 'keys') {
            var valType;
            switch (keyType) {
                case "int":
                    valType = "List<Integer>";
                    break;
                case "String":
                    valType = "List<String>";
                    break;
                case "float":
                    valType = "List<Float>";
                    break;
            }
            console.log("IN HEREEEEEEEE");
            var keys = [];
            console.log("Orig value is: ", valueCopy);
            for (i in valueCopy) {
                console.log("i is: ", i);
                console.log(typeof i);
                keys.push(i);
            }
            returnValue = keys;
            return [returnValue, valueCopy, valType];
        }
        
        //Size method
        //Parameters:  
        //Returns: 
        if (method == 'size') {
            var count = 0;
            for (var i in valueCopy) {
                count += 1;
            }
            returnValue = count;
            return [returnValue, valueCopy, "int"];
            
        }
        
        //Put method
        //Parameters:  
        //Returns: 
        if (method == "put") {
            var key = parameters[0].value;
            if (this.containsKey(key, valueCopy) == true) {
                env.throwError(root.linenum);
                root.error();
            }
            var value = parameters[1].value;
            var keyT = this.getType(key);
            var valueT = this.getType(value);
            console.log("key type is: ", keyT, " wanting: ", keyType);
            if (keyT != keyType || valueT != valueType) {
                env.throwError(root.linenum);
                console.log("Incompatible Types!");
                root.error("Incompatible types");
                //Throw an error
            }
            valueCopy[key] = value;
            return [returnValue, valueCopy];
        }
        
        //Remove method
        //Parameters:  
        //Returns: 
        if (method == "remove") {
            var keyToRemove = parameters[0].value;
            console.log("Key to remove: ", keyToRemove, typeof keyToRemove);
            console.log("Looking at: ", keyType, "against ", this.getType(keyToRemove));
            if (this.getType(keyToRemove) != keyType) {
                env.throwError(root.linenum);
                console.log("Incompatible key types");
                root.error("Incompatible types");
            }
            var newDictionary = {};
            var isSeen = false;
            for (var i in valueCopy) {
                if (i != keyToRemove) {
                    newDictionary[i] = valueCopy[i];
                } if (i == keyToRemove) {
                    isSeen = true;
                }
            }
            if (isSeen != true) {
                env.throwError(root.linenum);
                console.log("key not in dictionary");
                root.error("Not in dictionary");
            }
            
            valueCopy = newDictionary;
            return [returnValue, valueCopy];
        }
        
        //Populate method
        //Parameters:  
        //Returns: 
        if (method == "populate") {
            var numKeys = parameters[0].value;
            var dict = {};
            
            var alph;
            //Generate alph
            var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            
            
            
            
            var alph = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

            var toPush;
            var count = 0;
            console.log("Size is: ", dict.size);
            while(count < numKeys) {
                
                if (keyType == "int") {
                    toPush = Math.floor((Math.random()*100) + 1);
                    console.log("Going to push: ", typeof toPush);
                    if (this.containsKey(toPush, dict) != true) {
                        dict[toPush] = 0;
                        count += 1;
                    }
                }
                else if (keyType == "String") {
                    var word = '';
                    for (var n = 0; n < 3; n++) {
                        toPush = Math.floor((Math.random()*alph.length-1) + 1);
                        word += alph[toPush];
                    }
                    if (this.containsKey('"' + word + '"', dict) != true) {
                        dict['"' + word + '"'] = 0;
                        count += 1;
                    }
                    
                }
                else if (keyType == "float") {
                    toPush = parseFloat((Math.random()*(7.00 - 0.01) + 1).toFixed(2));
                    if (this.containsKey([toPush, "float"], dict) != true) {
                        dict[[toPush, "float"]] = 0;
                        count += 1;
                    }
                }
                //console.log("After count: ", count);
            }
            console.log("Count is: ", count);
            console.log("Dictionary to start is: ", dict);
            console.log("VALUE TYPE IS: ", valueType);
            for (var j in dict) {
                console.log("j is: ", typeof j);
                if (valueType == "int") {
                    toPush = Math.floor((Math.random()*100) + 1);
                    dict[j] = toPush;
                }
                if (valueType == "String") {
                    toPush = Math.floor((Math.random() * 26) + 1);
                    dict[j] = '"' + alph[toPush] + '"';
                }
                if (valueType == "float") {
                    console.log("In here:::::");
                    toPush = parseFloat((Math.random()*(7.00 - 0.01) + 1).toFixed(2));
                    dict[j] = [toPush, "float"];
                    console.log("Dictionary at j: ", j, "Is now: ", dict[j]);
                }
                if (valueType == "bool") {
                    toPush = Math.floor((Math.random() * 2) + 1);
                    if (toPush == 1) {
                        dict[j] = true;
                    } else {
                        dict[j] = false;
                    }
                }
            }
            valueCopy = dict;
            return [returnValue, valueCopy];
        }
            
    }
});