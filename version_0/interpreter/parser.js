/*
* parser.js
* -------------
* 
*/

$(document).ready(function () {

Parser = function(nodeList) {
    this.tokenList = nodeList;
    this.tree = null; // empty tree
    return this;
}
Parser.prototype.addToParseTree = function(tree, token) {
    // if the token is not a close type, just push it onto the tree
    if (['CLOSE_PAREN','CLOSE_BRACE','SEMI'].indexOf(token.Type) <= 0){
        token.Next = tree;
        return token;
    }

    // the token is a close type:
    else { 
        // we create a temporary stack to hold all of the tokens that go in the new level
        var tempStack = null;
        var nodes = this.popFromFront(tree);
        var curToken = nodes[0]; 
        tree = nodes[1];

        // if we find a semicolon
        if (token.Type == 'SEMI'){
            // pop all the tokens and put them into the temp stack,
            // until we get to the open type or previous semi colon or close curly
            while (curToken != null && ['OPEN_PAREN', 'OPEN_BRACE','SEMI', 'CurlyBraceLevel', 'SemicolonLevel'].indexOf(curToken.Type) <= 0){

                tempStack = this.addToParseTree(tempStack, curToken);
                nodes = this.popFromFront(tree);
                curToken = nodes[0];
                tree = nodes[1];
            }

            tree = curToken;
            // create a new semicolon level and set its token to the tempStack
            // the tempStack is the list of tokens before the semicolon
            var newLevel = new Node('SemicolonLevel', 'SemicolonLevel', 0, 0);
            newLevel.Token = tempStack;
        }

        // if we find a close parentheses
        else if (token.Type == 'CLOSE_PAREN'){
            // pop all the tokens and put them on the temp stack untel we get to the open paren type
            while (curToken != null && ['OPEN_PAREN'].indexOf(curToken.Type) <= 0){

                tempStack = this.addToParseTree(tempStack, curToken);
                nodes = this.popFromFront(tree);
                curToken = nodes[0];
                tree = nodes[1];
            }
            var newLevel = new Node('ParenLevel', 'ParenLevel', 0, 0);
            newLevel.Next = null;
            newLevel.Token = tempStack;
        }

        // if we find a close curly brace
        else{
            // pop all the tokens and put them into the temp stack until we get to the open curly type
            while (curToken != null && ['OPEN_BRACE'].indexOf(curToken.Type) <= 0){

                tempStack = this.addToParseTree(tempStack, curToken);
                nodes = this.popFromFront(tree);
                curToken = nodes[0];
                tree = nodes[1];
            }

            var newLevel = new Node('CurlyBraceLevel', 'CurlyBraceLevel', 0, 0);
            newLevel.Next = null;
            newLevel.Token = tempStack;
        }

        tree = this.addToParseTree(tree, newLevel); 
        return tree;
    }
};

Parser.prototype.parseTokens = function() {
    // create an empty tree and add the tokens to it iteratively
    var tree = null;
    while (this.tokenList) {
        var token = this.getNextToken();
        tree = this.addToParseTree(tree, token);
    }

    // reverse the parse tree so it's in the right order
    var prev = null;
    var temp = null;

    while (tree !== null) {
        temp = tree.Next;
        tree.Next = prev;
        prev = tree;
        tree = temp;
    }
    tree = prev;

    this.tree = tree;
    return this.tree;
}

Parser.prototype.printParseTree = function(tree, depth) {
    var indent = " ";
    for (var i=0; i<depth; i++) {
        indent = indent + "\t";
    }

    if (tree === null) {
        return;
    }

    if (tree.Type === 'ParenLevel') {
        console.log(indent + "\(");
        depth++;
        this.printParseTree(tree.Token, depth);
        depth = depth - 1;
        console.log(indent + "\)");
    }

    else if (tree.Type === 'CurlyBraceLevel') {
        console.log(indent + "\{");
        depth++;
        this.printParseTree(tree.Token, depth);
        depth = depth - 1;
        console.log(indent + "\{");
    }

    else if (tree.Type === 'SemicolonLevel') {
        console.log(indent + "open ;");
        depth++;
        this.printParseTree(tree.Token, depth);
        depth = depth - 1;
        console.log(indent + "close ;\n");
    }

    else {
        console.log(indent + tree.Token);
    }

    this.printParseTree(tree.Next, depth);
};

Parser.prototype.showParseTree = function() {
    this.printParseTree(this.tree, 0);
}






Parser.prototype.getNextToken = function() {
    if (this.tokenList === null) {
        return null;
    }

    var token = this.tokenList;
    this.tokenList = this.tokenList.Next;
    return token;
}

Parser.prototype.popFromFront = function(tree) {
    if (tree === null) {
        return [null, null];
    }

    var token = tree;
    tree = tree.Next;

    return [token, tree];
}



});