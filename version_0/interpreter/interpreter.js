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
        this.symbolTable.newVariable('int','.', 5, 'new'); //will return .1 as name
        this.symbolTable.newVariable('int', 'x', null, 'new');
        this.symbolTable.updateVariable('int', 'x', 5, '.1');
        this.symbolTable.removeVariable('int', '.1', 5, 'remove');
        this.symbolTable.newVariable('Stack<Integer>','.', [], 'new'); //will return .2 as name
        this.symbolTable.newVariable('Stack<Integer>', 's', null, 'new');
        this.symbolTable.updateVariable('Stack<Integer>', 's', [], '.2');
        this.symbolTable.removeVariable('Stack<Integer>', '.2', [], 'remove');
        this.symbolTable.updateVariable('Stack<Integer>', 's', [5], 'x');
        this.symbolTable.updateVariable('Stack<Integer>', 's', [], 's.pop()');
        this.symbolTable.newVariable('int', '.', 5, 's.pop()'); //will return .3 as name
        this.symbolTable.removeVariable('int', '.3', 5, 'remove');
    };
    
});