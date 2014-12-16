Interpreter.prototype.addToParseTree = function(tree, token) {
    if ([6,8,10].indexOf(token.Type) >= 0){
        token.Next = tree;
        return token;
    }

    else{

        var tempStack = null;
        var nodes = popFromFront(tree);
        var curToken = nodes[0];
        tree = nodes[1];

        if (token.Type == 10){

            while (curToken != null && [5, 7,10, 12, 13].indexOf(curToken.Type) >= 0){

                tempStack = addToParseTree(tempStack, curToken);
                nodes = popFromFront(tree);
                curToken = nodes[0];
                tree = nodes[1];
            }

            tree = curToken;

            var newLevel = Node("SemicolonLevel");
            newLevel.Token = tempStack;
        }

        else if (token.Type == 6){

            while (curToken != null && [5].indexOf(curToken.Type) >= 0){

                tempStack = addToParseTree(tempStack, curToken);
                nodes = popFromFront(tree);
                curToken = nodes[0];
                tree = nodes[1];
            }

            var newLevel = Node("ParenLevel");
            newLevel.Next = null;
            newLevel.Token = tempStack;
        }

        else{

            while (curToken != null && [7].indexOf(curToken.Type) >= 0){

                tempStack = addToParseTree(tempStack, curToken);
                nodes = popFromFront(tree);
                curToken = nodes[0];
                tree = nodes[1];
            }

            var newLevel = Node("CurlyBraceLevel");
            newLevel.Next = null;
            newLevel.Token = tempStack;
        }

        tree = addToParseTree(tree, newLevel);

    }
};