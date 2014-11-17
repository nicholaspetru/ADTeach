$(document).ready(function () {
    SymbolTable = function() {
        //the list of entities
        this.table = [];
        this.visualizerHandler = null;
        return this;
    }
    
    SymbolTable.prototype.updateVariable = function(type, name, value, action) {
        console.log("updating variable here");
        //TODO:update the table
        //While interpreting, call the method in symbol table for updates
        this.visualizerHandler.enqueueEvent("update",type, name, type, value);
    };
    
    SymbolTable.prototype.removeVariable = function(type, name, value, action) {
        console.log("removing variable here");
        //TODO:update the table
        //While interpreting, call the method in symbol table for updates
        this.visualizerHandler.enqueueEvent("delete",type, name, type, value);
    };
    
    SymbolTable.prototype.newVariable = function(type, name, value, action) {
        console.log("creating new variable here");
        //TODO:update the table
        //While interpreting, call the method in symbol table for updates
        this.visualizerHandler.enqueueEvent("new",type, name, type, value);
    };
    
    //TODO: get value for name (called by entities)
});