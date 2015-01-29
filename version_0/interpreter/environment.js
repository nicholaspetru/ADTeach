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
		console.log("getValue");
		var index = this.names.indexOf(name);
		console.log("index " + index);
		if (index >= 0) {
			var v = this.variables.index
			console.log(this.variables[index].value);
			return this.variables[index].value;
		}
		else {
			return "no value";
		}
	}

	Environment.prototype.getType = function(name) {
		console.log("getType");
		var index = this.names.indexOf(name);
		console.log("index " + index);
		if (index >= 0) {
			var v = this.variables.index
			console.log(this.variables[index].value);
			return this.variables[index].type;
		}
		else {
			return "no type";
		}
	}

	Environment.prototype.createVariable = function(type, variable, value, origin) {
        console.log("&&&&&&&&&");
		var n = {type: type,
			name: variable, 
			value: value};
		/*
		console.log(n.name);
		console.log(n.type);
		console.log(n.value);
		*/
        console.log(n);
        
		this.variables.push(n);
		this.names.push(variable);
		this.symbolTable.newVariable(type, variable, value, origin);
		//console.log(this.variables);
	}

	Environment.prototype.updateVariable = function(name, newVal, origin) {
		console.log("-------updateVariable( " + name + " , " + newVal + ")");
        console.log(newVal);
		var index = this.names.indexOf(name);
        var type = this.variables[index].type;
        //if (type != typeof newVal) {
         
        //CHECK TYPE
        if (type != "int") {
            console.log(type);
            console.log(typeof newVal);
            console.log("Incompatible types");
            //new IncompatibleTypes();
        }
		this.variables[index].value = newVal;
        this.symbolTable.updateVariable(type, name, newVal, origin);
		//this.symbolTable.updateVariable();
	}
});