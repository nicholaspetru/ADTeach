$(document).ready(function () {
	Environment = function(parent) {
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
	Environment.prototype.getValue = function(name) {
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

	Environment.prototype.createVariable = function(type,variable,value) {
		var n = {type: type, 
			name: variable, 
			value: value};
		/*
		console.log(n.name);
		console.log(n.type);
		console.log(n.value);
		*/
		this.variables.push(n)
		this.names.push(variable);
		//console.log(this.variables);
	}

	Environment.prototype.updateValue = function(name,newVal) {
		var index = this.names.indexOf(name);
		this.variables[index].value = newVal;
	}
});