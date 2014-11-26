$(document).ready(function () {
    SymbolTable = function() {
        //the list of entities
        this.table = [[]];
        this.nextAnonVar = 1;
        this.visualizerHandler = null;
        return this;
    }
    
    //returns false if variable was not in the table, else returns true
    //if false, updateVariable does not create a new symbolTable, nor does it call enqueueEvent.
    //Note that this sets the 'type' field to an updated type, which may be different from the
    //original type. Is this an option we want to provide? Should we instead use type combined with
    //name to find the relevant variable? Is type even necessary to be passed in here?
    SymbolTable.prototype.updateVariable = function(type, name, value, action) {
        console.log('Symbol Table: updateVariable(' + type + ',' + name + ',' + value + ',' + action + ')');
        var curTable = this.table[this.table.length-1];
        var newTable = curTable.slice(0);
        for (var i = 0; i < newTable.length; i++) {
            if (newTable[i][1] == name) {
                var curLine = newTable[i];
                curLine[0] = type;
                curLine[2] = value;
                curLine[3] = action;
                this.table.push(newTable);
                //why is type being passed in twice here?
                this.visualizerHandler.enqueueEvent("update",type, name, type, value);
                return true;
            }
        }
        return false;
    };
    
    //returns false if variable was not in the table, else returns true
    //if false, removeVariable does not create a new symbolTable, nor does it call enqueueEvent.
    //Note: This is silly. This function pretty much does the exact same thing as updateVariable.
    //The only difference is that type and value aren't set, but these wouldn't be different in a
    //remove call anyway. Also the enqueueEvent call is slightly different, but this could easily
    //be handled by having the first argument passed in be action instead of 'update' or 'delete'.
    //Do we need to distinguish between these two function calls?
    SymbolTable.prototype.removeVariable = function(type, name, value, action) {
        console.log('Symbol Table: removeVariable(' + type + ',' + name + ',' + value + ',' + action + ')');
        var curTable = this.table[this.table.length-1];
        var newTable = curTable.slice(0);
        var varIndex = null;
        for (var i = 0; i < newTable.length; i++) {
            if (newTable[i][1] == name) {
                var curLine = newTable[i];
                curLine[3] = 'remove';
                this.table.push(newTable);
                //why is type being passed in twice here?
                this.visualizerHandler.enqueueEvent("delete",type, name, type, value);
                return true;
            }
        }
        return false;
    };

    //returns the name of the new variable, regardless of whether a new .x name was assigned
    SymbolTable.prototype.newVariable = function(type, name, value, action) {
        console.log('Symbol Table: newVariable(' + type + ',' + name + ',' + value + ',' + action + ')');
        var curTable = this.table[this.table.length-1];
        var newTable = curTable.slice(0);
        if (name == '.') {
            name = name + this.nextAnonVar.toString();
            this.nextAnonVar++;
        }
        var newLine = new Array(4);
        newLine[0] = type;
        newLine[1] = name;
        newLine[2] = value;
        newLine[3] = action;
        newTable.push(newLine);
        this.table.push(newTable);
        //why is type being passed in twice here?
        this.visualizerHandler.enqueueEvent("new",type, name, type, value);
        return name;
    };
    
    //returns the value of a variable given a name
    //returns false if name not in most recent iteration of symbolTable, or if variable has been removed
    SymbolTable.prototype.getValue = function(name) {
        console.log('Symbol Table: getValue(' + name +');');
        var curTable = this.table[this.table.length-1];
        for (var i = 0; i < curTable.length; i++) {
            if (curTable[i][1] == name && curTable[i][3] != 'remove') {
                return curTable[i][2];
            }
        }
        return false;
    };

});