$(document).ready(function () {
    
    Interpreter = function(){
        //the list of entities
        //this.entities = [];
        //this.eventQueue = [];
        this.symbolTable = null;
        return this;
    }
    
    Interpreter.prototype.eval = function(code) {
        //While interpreting, call the method in symbol table for updates
        console.log("Interpreter: eval(" + code + ")");
        this.symbolTable.newVariable('int', 'x', 5, 'new');
        this.symbolTable.newVariable('stack','y',[1,2,3,4,5], 'new');
        this.symbolTable.updateVariable('int', "x",10, 'update');
        this.symbolTable.removeVariable('stack', "y", [1,2,3,4,5], 'remove');
    };
    
});