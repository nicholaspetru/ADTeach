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

    Interpreter.prototype.tokenize = function(expression) {
        //split an expression and return a list of all the tokens
        var parenDepth = 0;
        var braceDepth = 0;
        var head = null;
        expression += ' ';
        var tokenList = [];
        var temp = "";
        var stringFlag = false;
        var TokenSeparators = ['(', ')', '/', '{', '}', ';'];

        for (var i = 0; i<expression.length; i++){

            switch(expression.charAt(i)){

                case '(':
                    parenDepth++;
                    if (stringFlag) temp += expression.charAt(i);
                    else if (temp.length > 0) tokenList.push(temp);
                    tokenList.push(expression.charAt(i));
                    temp = "";
                    break;

                case ')':
                    parenDepth--;
                    if (stringFlag) temp += expression.charAt(i);
                    else if (temp.length > 0) tokenList.push(temp);
                    tokenList.push(expression.charAt(i));
                    temp = "";
                    break;

                case '{':
                    braceDepth--;
                    if (stringFlag) temp += expression.charAt(i);
                    else if (temp.length > 0) tokenList.push(temp);
                    tokenList.push(expression.charAt(i));
                    temp = "";
                    break;

                case '}':
                    braceDepth--;
                    if (stringFlag) temp += expression.charAt(i);
                    else if (temp.length > 0) tokenList.push(temp);
                    tokenList.push(expression.charAt(i));
                    temp = "";
                    break;

                case '\"':
                    if (stringFlag){
                        stringFlag = false;
                        temp = "\"" + temp + "\"";
                        tokenList.push(temp);
                        temp = "";
                    }
                    else{
                        stringFlag =True;
                    }
                    break;

                case ' ':
                    if (stringFlag) temp += ' ';
                    else if (temp.length > 0){
                        tokenList.push(temp);
                        temp= "";
                    }
                    break;

                case '.':
                    if (stringFlag) temp += ' ';
                    else if (temp.length > 0){
                        if (['1', '2','3','4','5','6','7','8','9','0','-'].indexOf(temp.charAt(0)) != -1) temp += '.';
                        else{
                            tokenList.push(temp);
                            temp = "";
                        }
                    }
                    else temp = '.';
                    break;

                case '\t':
                    if (stringFlag) temp += '\t';
                    else if (temp.length > 0){
                        tokenList.push(temp);
                        temp = '';
                    }
                    break;

                case '\n':
                    if (stringFlag) temp += '\n';
                    else if (temp.length > 0){
                        tokenList.push(temp);
                        temp = '';
                    }
                    break;

                case ';':
                    if (stringFlag) temp += ';';
                    else if (temp.length > 0){
                        tokenList.push(temp);
                        tokenList.push(';');
                        temp = '';
                    }
                    break;

                case '/':
                    if (stringFlag) temp += ';';
                    else if (temp.length > 0){
                        tokenList.push(temp);
                        tokenList.push('/');
                        temp = '';
                    }
                    break;

                case '+':
                    if (stringFlag) temp += '+';
                    else if ((expression.length > i+1) && (['+', '='].indexOf(expression.charAt(i+1)) != -1)){
                        if (temp.length > 0) tokenList.push(temp);
                        tokenList.push('+'+expression.charAt(i+1));
                        temp = '';
                        i++;
                    }
                    else{
                        if (temp.length > 0) tokenList.push(temp);
                        tokenList.push('+');
                        temp = "";

                    }
                    break;

                case '-':
                    if (stringFlag) temp += '-';
                    else if ((expression.length > i+1) && (['-', '='].indexOf(expression.charAt(i+1)) != -1)){
                        if (temp.length > 0) tokenList.push(temp);
                        tokenList.push('-'+expression.charAt(i+1));
                        temp = '';
                        i++;
                    }
                    else{
                        if (temp.length > 0) tokenList.push(temp);
                        tokenList.push('-');
                        temp = "";

                    }
                    break;

                case '*':
                    if (stringFlag) temp += '*';
                    else if ((expression.length > i+1) && (expression.charAt(i+1) == '*')){
                        if (temp.length > 0) tokenList.push(temp);
                        tokenList.push('**');
                        temp = '';
                        i++;
                    }
                    else{
                        if (temp.length > 0) tokenList.push(temp);
                        tokenList.push('*');
                        temp = "";

                    }
                    break;

                case '=':
                    if (stringFlag) temp += '=';
                    else if ((expression.length > i+1) && (expression.charAt(i+1) == '=')){
                        if (temp.length > 0) tokenList.push(temp);
                        tokenList.push('==');
                        temp = '';
                        i++;
                    }
                    else{
                        if (temp.length > 0) tokenList.push(temp);
                        tokenList.push('=');
                        temp = "";

                    }
                    break;

                case '!':
                    if (stringFlag) temp += '!';
                    else if ((expression.length > i+1) && (expression.charAt(i+1) == '=')){
                        if (temp.length > 0) tokenList.push(temp);
                        tokenList.push('!=');
                        temp = '';
                        i++;
                    }
                    else{
                        if (temp.length > 0) tokenList.push(temp);
                        tokenList.push('!');
                        temp = "";

                    }
                    break;

                case '>':
                    if (stringFlag) temp += '>';
                    else if ((expression.length > i+1) && (expression.charAt(i+1) == '=')){
                        if (temp.length > 0) tokenList.push(temp);
                        tokenList.push('>=');
                        temp = '';
                        i++;
                    }
                    else{
                        if (temp.length > 0) tokenList.push(temp);
                        tokenList.push('>');
                        temp = "";

                    }
                    break;

                case '<':
                    if (stringFlag) temp += '<';
                    else if ((expression.length > i+1) && (expression.charAt(i+1) == '=')){
                        if (temp.length > 0) tokenList.push(temp);
                        tokenList.push('<=');
                        temp = '';
                        i++;
                    }
                    else{
                        if (temp.length > 0) tokenList.push(temp);
                        tokenList.push('<');
                        temp = "";

                    }
                    break;
                
                default:
                    temp += expression.charAt(i);
                    break;
            }
        }

        for (var i = 0; i<tokenList.length; i++){
            curNode = {Token:tokenList[i], Type:1, Next:head};
            head = curNode;
        }
        var prev = null;
        var temp = null;
        while (head != null){
            temp = head.Next;
            head.Next = prev;
            prev = head;
            head = temp;
        }
        head = prev;

        while (head != null){
            console.log(head.Token);
            head=head.Next;
        }

        if (parenDepth != 0) console.log("Unmatched Parentheses");
        if (braceDepth != 0) console.log("Unmatched Curly Brace");


    };
    
});