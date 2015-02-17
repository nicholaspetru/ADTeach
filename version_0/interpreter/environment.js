$(document).ready(function () {
	Environment = function(parent, vh) {
		this.symbolTable = new SymbolTable(vh);
		this.parent = parent;
		this.variables = [];
		this.names = [];
		return this;
	}

	Environment.prototype.getVariables = function() {
		return this.variables;
	}
    
	Environment.prototype.getNames = function() {
		return this.names;
	}
    
    Environment.prototype.getIndex = function(name) {
        var index = this.names.indexOf(name);
        return index;
    }
    
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

	Environment.prototype.createVariable = function(type, variable, value, originMethod, originADT, lineNum) {
        console.log("-------createVariable( " + type + " , " + variable + " , " + value + " , " + originMethod + " , " + originADT + ")");
        console.log("Origin method is: ", originMethod);
        console.log("Value is: ", value);
        console.log("Line number: ", lineNum);
		var n = {type: type,
			name: variable, 
			value: value};
		console.log("AFTER CREATION: ", n.value);
		this.variables.push(n);
		this.names.push(variable);
		this.symbolTable.newVariable(type, variable, value, originMethod, originADT, lineNum-1);
	}

	Environment.prototype.updateVariable = function(name, newVal, originMethod, originADT, lineNum, adtType) {
		console.log("-------updateVariable( " + name + " , " + newVal + " , " + originMethod + " , " + originADT + ")");
        console.log("Line number: ", lineNum);
        console.log("Value is: ", newVal);
		console.log("Origin method is: ", originMethod);
        console.log("Origin method type is: ", adtType); 
        var index = this.names.indexOf(name);
        var type = this.variables[index].type;
        if (adtType == "Stack<Float>" || adtType == "List<Float>" || adtType == "Queue<Float>" || adtType == "PriorityQueue<Float>") {
            var slicedValue = [];
            for (var i = 0; i < newVal.length; i++) {
                slicedValue.push(newVal[i][0]);
            }
            newVal = slicedValue;
        
        }
        
		this.variables[index].value = newVal;
        this.symbolTable.updateVariable(type, name, newVal, originMethod, originADT, lineNum-1);
	}
    
    Environment.prototype.removeVariable = function(name, lineNum) {
		console.log("-------removeVariable( " + name + ")");
        console.log("Line number: ", lineNum);
        var index = this.names.indexOf(name);
        var type = this.variables[index].type;
         
        //CHECK TYPE
        if (type != "int") {
            console.log("Incompatible types");
            //new IncompatibleTypes();
        }
		this.variables.splice(this.variables.indexOf(name), 1);
        this.symbolTable.removeVariable(type, name, null, null, null, lineNum-1);
	}
    
    Environment.prototype.throwError = function(lineNum) {
        console.log("THROWING ERROR AT LINE: ", lineNum);
        this.symbolTable.throwError(lineNum-1);
    }
    
});