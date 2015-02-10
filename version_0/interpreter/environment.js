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
        console.log("Line number: ", lineNum);
		var n = {type: type,
			name: variable, 
			value: value};
		
		this.variables.push(n);
		this.names.push(variable);
		this.symbolTable.newVariable(type, variable, value, originMethod, originADT, lineNum-1);
	}

	Environment.prototype.updateVariable = function(name, newVal, originMethod, originADT, lineNum) {
		console.log("-------updateVariable( " + name + " , " + newVal + " , " + originMethod + " , " + originADT + ")");
        console.log("Line number: ", lineNum);
		console.log("Origin method is: ", originMethod);
        var index = this.names.indexOf(name);
        var type = this.variables[index].type;
         
        //CHECK TYPE
        if (type != "int") {
            console.log("Incompatible types");
            //new IncompatibleTypes();
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
        this.symbolTable.updateVariable(type, name, null, null, null, lineNum-1);
	}
});