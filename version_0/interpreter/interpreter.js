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
        var newName1 = this.symbolTable.newVariable('int','.', 5, 'new'); //will return .1 as name
        var newName2 = this.symbolTable.newVariable('int', 'x', null, 'new');
        var updateBool1 = this.symbolTable.updateVariable('int', newName2, 5, newName1);
        var removeBool1 = this.symbolTable.removeVariable('int', newName1, 5, 'remove');
        var newName3 = this.symbolTable.newVariable('Stack<Integer>','.', [], 'new'); //will return .2 as name
        var newName4 = this.symbolTable.newVariable('Stack<Integer>', 's', null, 'new');
        var updateBool2 = this.symbolTable.updateVariable('Stack<Integer>', newName4, [], newName3);
        var removeBool2 = this.symbolTable.removeVariable('Stack<Integer>', newName3, [], 'remove');
        var updateBool3 = this.symbolTable.updateVariable('Stack<Integer>', newName4, [5], newName2);
        var updateBool4 = this.symbolTable.updateVariable('Stack<Integer>', newName4, [], newName4 + '.pop()');
        var newName5 = this.symbolTable.newVariable('int', '.', 5, newName4 + '.pop()'); //will return .3 as name
        var removeBool3 = this.symbolTable.removeVariable('int', newName5, 5, 'remove');
        //console.log("updateBools: " + updateBool1 + updateBool2 + updateBool3 + updateBool4);
        //console.log("removeBools: " + removeBool1 + removeBool2 + removeBool3);
        //var testVar = this.symbolTable.getValue(newName1);
        //console.log("testing getValue: " + testVar);
    };
    
});