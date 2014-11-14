$(document).ready(function () {
    SymbolTable = function(visualizerHandler) {
        //the list of entities
        this.table = [];
        this.visualizerHandler = visualizerHandler;
        return this;
    }
    
    Interpreter.prototype.updateVariable = function(type, name, value, action) {
        //TODO:update the table
        //While interpreting, call the method in symbol table for updates
        this.visualizerHandler.enqueueEvent("update",type, name, type, value);
    };
    
    Interpreter.prototype.removeVariable = function(type, name, value, action) {
        //TODO:update the table
        //While interpreting, call the method in symbol table for updates
        this.visualizerHandler.enqueueEvent("delete",type, name, type, value);
    };
    
    Interpreter.prototype.newVariable = function(type, name, value, action) {
        //TODO:update the table
        //While interpreting, call the method in symbol table for updates
        this.visualizerHandler.enqueueEvent("new",type, name, type, value);
    };
    
    //TODO: get value for name (called by entities)
}