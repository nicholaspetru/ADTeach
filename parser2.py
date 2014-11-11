from tokenizer2 import *

def addToParseTree(tree, token):
    # If the token is not a close type, just push it onto the tree
    if token.getType() not in [6, 8, 10]:
        token.setNext(tree)
        return token
    
    # If it is a close type, then we need to create a new level of the parse tree
    else:
        # We create a temporary stack to hold all of the tokens that go in the new level
        tempStack = None
        curToken, tree = popFromFront(tree)
        
        # Pop all the tokens and put them into the temp stack
        # Until we get to the open type
        if token.getType() == 10:
            while curToken != None and curToken.getType() not in [5, 7,10, 12, 13]:
                print "CURRRRRRTOKEN:", curToken.getToken()
                tempStack = addToParseTree(tempStack, curToken)
                curToken, tree = popFromFront(tree)
            tree = curToken
            #print "Noooooowwww the tree is:", printParseTree(tree)
            newLevel = Node("SemicolonLevel")
            newLevel.setNext(None)
            newLevel.setToken(tempStack)
                
        elif token.getType() == 6:
            while curToken != None and curToken.getType() not in [5]:
                tempStack = addToParseTree(tempStack, curToken)
                curToken, tree = popFromFront(tree)
                #if curToken == None:
                 #   raise MissingParentheses("Missing open paren")
            #tree = curToken
            newLevel = Node("ParenLevel")
            newLevel.setNext(None)
            newLevel.setToken(tempStack)
            
            
        else:
            while curToken != None and curToken.getType() not in [7]:
                tempStack = addToParseTree(tempStack, curToken)
                curToken, tree = popFromFront(tree)
                #if curToken == None:
                    #raise MissingCurlyBrace("Missing open curly brace")
            #tree = curToken
            newLevel = Node("CurlyBraceLevel")
            newLevel.setNext(None)
            newLevel.setToken(tempStack)
            
        # Create a new node that marks the new level of the tree
        # Set its value to the stack of tokens that make up the new level
        #newLevel = Node("NewLevel2")
        #newLevel.setNext(None)
        #newLevel.setToken(tempStack)
        
        # Push the new level onto the tree in the right spot
        tree = addToParseTree(tree, newLevel)
        
        return tree
        
    
def parse(tokenList):
    #Create an empty tree and add all of the tokens to it iteratively 
    tree = None
    while tokenList != None:
    
        token, tokenList = popFromFront(tokenList)
        #print "tokenizing:", token.getToken(), token.getType()
        
        tree = addToParseTree(tree, token)
        #print "tree is:", printParseTree(tree)
        #if tree.getType() == 13:
        #    print "tree points to:", tree.getToken()
    #reverse the parse tree so it is in the right order
    previous = None;
    while tree != None:
        temp = tree.getNext()
        tree.setNext(previous)
        previous = tree
        tree = temp
    tree = previous
    
    return tree


def printParseTree(tree, depth):
    #print "TREE TREE TREE", tree
    indent = ""
    for i in range(depth):
        indent = indent + "     "
    if tree == None:
        return
    if tree.getType() == 11:
        print indent,"("
        depth = depth + 1
        printParseTree(tree.getToken(), depth)
        depth = depth - 1
        print indent, ")"
    elif tree.getType() == 12:
        print indent, "{"
        depth = depth + 1
        printParseTree(tree.getToken(),depth)
        depth = depth - 1
        print indent, "}"
    elif tree.getType() == 13:
        print indent, "open ;"
        
        #if tree.getToken().getNext() == None:
            #print "it is none"
        #print "token for ; is", tree.getToken(), "next token for ; is", tree.getToken().getNext().getToken(), tree.getToken().getNext().getNext().getToken()
        #print "****"
        #print tree.getToken().getType()
        printParseTree(tree.getToken(), depth)
        print indent, "close ;"
        print 
        
        
    else:
        print indent, tree.getToken()#, tree.getType()
        
    printParseTree(tree.getNext(), depth)
    
    
def popFromFront(tree):
    if tree == None:
        return None, None
    token = tree
    tree = tree.getNext()
    return token, tree
    
    
    
if __name__ == "__main__":
    tokenList = tokenize('x = (5 + 3) + 4')
    tokenList = tokenize("x.pop().push().push()")
    parsedList = parse(tokenList)
    printParseTree(parsedList)