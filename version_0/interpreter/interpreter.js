$(document).ready(function () {
    
    Interpreter = function(code){
        //the list of entities
        //this.entities = [];
        //this.eventQueue = [];
        this.symbolTable = null;
        this.code = code;
        this.TokenList = null;
        this.NodeList = null;
        this.ParseTree = null;
        this.Error = null;
        return this;
    }
    
    //uncommented this to work on visualizer handler stuff
    Interpreter.prototype.eval = function(expression) {
        //While interpreting, call the method in symbol table for updates
        console.log("Interpreter: eval(" + expression + ")");
        var newName1 = this.symbolTable.newVariable('int','.', 5, 'new'); //will return .1 as name
        var newName2 = this.symbolTable.newVariable('int', 'x', null, 'new');
        var removeBool1 = this.symbolTable.removeVariable('int', newName1, 5, 'remove');
        var newName3 = this.symbolTable.newVariable('stack','.', [], 'new'); //will return .2 as name
        /*
        var newName4 = this.symbolTable.newVariable('Stack<Integer>', 's', null, 'new');
        var updateBool2 = this.symbolTable.updateVariable('Stack<Integer>', newName4, [], newName3);
        var removeBool2 = this.symbolTable.removeVariable('Stack<Integer>', newName3, [], 'remove');
        var updateBool3 = this.symbolTable.updateVariable('Stack<Integer>', newName4, [5], newName2);
        var updateBool4 = this.symbolTable.updateVariable('Stack<Integer>', newName4, [], newName4 + '.pop()');
        var newName5 = this.symbolTable.newVariable('int', '.', 5, newName4 + '.pop()'); //will return .3 as name
        var removeBool3 = this.symbolTable.removeVariable('int', newName5, 5, 'remove');*/

        //here's a new variable I'm making to test entity drawing
        this.symbolTable.newVariable('bool', 'pp', null, 'new');
        this.symbolTable.newVariable('bool', 'ps', null, 'new');
        var updateBool1 = this.symbolTable.updateVariable('int', newName2, 5, newName1);
        this.symbolTable.removeVariable('int', 'ps', 5, 'remove');
        this.symbolTable.newVariable('bool', 'ap', null, 'new');
        this.symbolTable.newVariable('bool', 'boo', null, 'new');
        this.symbolTable.newVariable('bool', 'p1', null, 'new');
        this.symbolTable.newVariable('bool', 'p2', null, 'new');
        this.symbolTable.removeVariable('int', 'boo', 5, 'remove');
        this.symbolTable.newVariable('bool', 'p3', null, 'new');
        this.symbolTable.newVariable('bool', 'p4', null, 'new');

        //console.log("updateBools: " + updateBool1 + updateBool2 + updateBool3 + updateBool4);
        //console.log("removeBools: " + removeBool1 + removeBool2 + removeBool3);
        //var testVar = this.symbolTable.getValue(newName1);
        //console.log("testing getValue: " + testVar);
    };
    

    Interpreter.prototype.tokenize = function() {
        //split an expression and return a list of all the tokens
        this.TokenList = this.makeTokenList();
        this.NodeList = this.makeNodeList();
    };

    Interpreter.prototype.parse = function() {
        this.tokenize();
        this.ParseTree = this.makeParseTree();
    }

    Interpreter.prototype.makeParseTree = function() {
        var p = new Parser(this.NodeList);
        p.parseTokens();
        p.showParseTree();
    }

    Interpreter.prototype.makeTokenList = function() {
        var t = new Tokenizer();
        var tokens = [];
        var parenLevel = 0;
        var braceLevel = 0;

        t.input(this.code);

        var currentToken = t.token();
        while (currentToken.type !== 'NULL_TYPE') {
            switch (currentToken.type) {
                case 'OPEN_PAREN':
                    parenLevel++;
                    break;
                case 'CLOSE_PAREN':
                    parenLevel--;
                    break;
                case 'OPEN_BRACE':
                    braceLevel++;
                    break;
                case 'CLOSE_BRACE':
                    braceLevel--;
                    break;
                default:
                    break;
            }

            tokens.push(currentToken);
            currentToken = t.token();
        }

        if (parenLevel > 0) {
            return "Syntax error: Missing close parenthesis";
        }
        else if (parenLevel < 0) {
            return "Syntax error: Missing open parenthesis";
        }
        else if (braceLevel > 0) {
            return "Syntax error: Missing close brace";
        }
        else if (braceLevel < 0) {
            return "Syntax error: Missing open brace";
        }

        return tokens;

    };

    Interpreter.prototype.makeNodeList = function() {
        var t = this.TokenList;
        if (typeof t == 'string') {
            return t; // syntax error
        }
        var temp = [];
        for (var i=t.length-1; i>=0; i--) {
            if (t[i].type === 'SYMBOL_TYPE') {
                if (t[i].value === 'true' || t[i].value === 'false') {
                    t[i].type = 'BOOL_TYPE';
                } 
            }
            temp.push(t[i]);
        }

        var head = null;
        var curNode = null;

        for (var i=0; i<temp.length; i++) {
            curNode = new Node(temp[i].value, temp[i].type, temp[i].linenum, temp[i].pos);
            curNode.Next = head;
            head = curNode;
        }

        return head;
    }
});