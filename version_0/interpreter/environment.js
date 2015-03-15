/**
*
* Environment
* 
* Keeps track of variables and their values as updated by the interpreter
* Called from interpreter.js during evalAssignment and evalMethod
*
* Authors: Colby Seyferth and Sarah LeBlanc
* ADTeach Team, 2015
*
**/

$(document).ready(function () {

    /**
    * Constructor:
    *
    *@param parent
    *@param vh - visualizer handler 
    *
    * Initializes a symbol table to update as variables are added and changed
    * Creates a list of variables and a list of names for the variables
    *    
    **/
	Environment = function(parent, vh) {
		this.symbolTable = new SymbolTable(vh);
		this.parent = parent;
		this.variables = [];
		this.names = [];
		return this;
	}

    /**
    *@returns {Object} - list of variables and their values
    **/
	Environment.prototype.getVariables = function() {
		return this.variables;
	}
    
    /**
    *@returns {Object} - list of variable names
    **/
	Environment.prototype.getNames = function() {
		return this.names;
	}
    
    /**
    *@param {string} name - variable in the environment
    *@returns {Number} - index of variable in list of names
    **/
    Environment.prototype.getIndex = function(name) {
        var index = this.names.indexOf(name);
        return index;
    }
    
    /**
    *@param {string} - variable in the environment
    *@returns {Object} - current value of variable, null if variable not in environment
    **/
	Environment.prototype.getValue = function(name) {
		var index = this.names.indexOf(name);
		if (index >= 0) {
			var v = this.variables.index
			return this.variables[index].value;
		}
		else {
			return null;
		}
	}

    /**
    *@param {string} - variable in the environment
    *@return {string} - the type of the variable, or no-type if not in environment
    **/
	Environment.prototype.getType = function(name) {
		var index = this.names.indexOf(name);
		if (index >= 0) {
			var v = this.variables.index
			return this.variables[index].type;
		}
		else {
			return "no type";
		}
	}

    /**
    * Creates a new variable and puts the variable's name, type and current value in the environment
    *
    *@param {string} type - type of new variable
    *@param {string} variable - name of the new variable
    *@param {Object} value - current value of the new variable
    *@param {string} originMethod - the name of the method that gave variable its value
    *@param {string} originADT - the name of the ADT from where the variable got its value
    *@param {Number} lineNum - the line number that the variable was created on
    **/
	Environment.prototype.createVariable = function(type, variable, value, originMethod, originADT, lineNum) {

        //Create a new object to store information about new variable
		var n = {type: type,
			name: variable, 
			value: value};

        //Add variable to list of variables and list of names
		this.variables.push(n);
		this.names.push(variable);

        //Before passing to symbol table, obtain float value from [floatValue, "float"] for each value in List of floats
        if (type == "List<Float>") {
            var slicedValue = [];
            for (var i = 0; i < value.length; i++) {
                slicedValue.push(value[i][0]);
            }
            value = slicedValue;
        }

        //Obtain float value from [floatValue, "float"]
        if (type == "float") {
            value = value[0];
        }

        //Pass information about new variable to the symbol table
		this.symbolTable.newVariable(type, variable, value, originMethod, originADT, lineNum-1);
	}

    /**
    * Updates value of a variable in the environment
    *
    *@param {string} name - name of changed variable
    *@param {Object} newVal - new value for variable
    *@param {string} originMethod - the name of the method that gave variable its new value
    *@param {string} originADT - the name of the ADT from where the variable got its value (which ADT was method called on)
    *@param {Number} lineNum - the line number that the variable was created on
    *@param {string} adtType - the type of ADT that method was called on
    **/
	Environment.prototype.updateVariable = function(name, newVal, originMethod, originADT, lineNum, adtType) {
        var index = this.names.indexOf(name);
        var type = this.variables[index].type;

        //Set the value of the variable in environment to the new value
        this.variables[index].value = newVal;

        //Before sending information to Symbol Table, parse floatValue out of list of [floatValue, "float"] for single float...
        if (type == "float") {
            newVal = newVal[0];
        }

        //...or for each item in ADT that contains floats
        if (adtType == "Stack<Float>" || adtType == "List<Float>" || adtType == "Queue<Float>" || adtType == "PriorityQueue<Float>") {
            var slicedValue = [];
            for (var i = 0; i < newVal.length; i++) {
                slicedValue.push(newVal[i][0]);
            }
            newVal = slicedValue;
        } else if (adtType == "Dictionary<Float, Integer>" || adtType == "Dictionary<Float, String>") {
            var slicedDictionary = {};
            for (var i in newVal) {
                i = i.split(",");
                slicedDictionary[i[0]] = newVal[i];
            }
            newVal = slicedDictionary;
        } else if (adtType == "Dictionary<Integer, Float>" || adtType == "Dictionary<String, Float>") {
            var slicedDictionary = {};
            for (var i in newVal) {
                slicedDictionary[i] = newVal[i][0];
            }
            newVal = slicedDictionary;
        } else if (adtType == "Dictionary<Float, Float>") {
            var slicedDictionary = {};
            for (var i in newVal) {
                var preSplit = newVal[i][0];
                i = i.split(',');
                slicedDictionary[i[0]] = preSplit;
            }
            newVal = slicedDictionary;
        }

        //Send new value and origin information to the symbol table
        this.symbolTable.updateVariable(type, name, newVal, originMethod, originADT, lineNum-1);
	}
    
    /**
    * Removes variable from the environment
    *
    *@param {string} name - name of variable to be removed
    *@param {Number} lineNum - the line number where variable should be removed
    **/
    Environment.prototype.removeVariable = function(name, lineNum) {
        var index = this.names.indexOf(name);
        var type = this.variables[index].type;
        
        //Remove variable from list of variables and from list of names
		this.variables.splice(this.variables.indexOf(name), 1);
        this.names.splice(this.variables.indexOf(name), 1);

        //Send removing information to the symbol table
        this.symbolTable.removeVariable(type, name, null, null, null, lineNum-1);
	}
    
    /**
    * Lets the symbol table know that the interpreter encountered an error
    *
    *@param {Number} lineNum - the line number where variable should be removed
    *@param {string} error - a descriptive string of what the error is
    **/
    Environment.prototype.throwError = function(lineNum, error) {
        this.symbolTable.throwError(lineNum-1, error);
    } 
});