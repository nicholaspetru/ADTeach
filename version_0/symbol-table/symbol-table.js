$(document).ready(function () {
    SymbolTable = function() {
        //the list of entities
        this.table = [];
        this.visualizerHandler = null;
        return this;
    }
    
    SymbolTable.prototype.updateVariable = function(type, name, value, action) {
        console.log('Symbol Table: updateVariable(' + type + ',' + name + ',' + value + ',' + action + ')');
        //TODO:update the table
        //While interpreting, call the method in symbol table for updates
        this.visualizerHandler.enqueueEvent("update",type, name, type, value);
    };
    
    SymbolTable.prototype.removeVariable = function(type, name, value, action) {
        console.log('Symbol Table: removeVariable(' + type + ',' + name + ',' + value + ',' + action + ')');
        //TODO:update the table
        //While interpreting, call the method in symbol table for updates
        this.visualizerHandler.enqueueEvent("delete",type, name, type, value);
    };
    
    SymbolTable.prototype.newVariable = function(type, name, value, action) {
        console.log('Symbol Table: newVariable(' + type + ',' + name + ',' + value + ',' + action + ')');
        //TODO:update the table
        //While interpreting, call the method in symbol table for updates
        this.visualizerHandler.enqueueEvent("new",type, name, type, value);
    };
    
    //returns the value of a variable given a key
    SymbolTable.prototype.getValue = function(key) {
        console.log('Symbol Table: getValue(' + key +');');
        return "a value is here.";
    };
    //TODO: get value for name (called by entities)
});