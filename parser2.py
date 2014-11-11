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
        
        #if we find a semicolon:
        if token.getType() == 10:
            # Pop all the tokens and put them into the temp stack
            # Until we get to the open type or previous semi colon or close curly
            while curToken != None and curToken.getType() not in [5, 7,10, 12, 13]:
                tempStack = addToParseTree(tempStack, curToken)
                curToken, tree = popFromFront(tree)
                
            #The pointer to the tree is currently at curToken
            #we need to set it back to tree
            tree = curToken
            
            #create a new semicolon level and set it's token to the tempStack
            #The tempStack is the list of tokens before the semicolon
            newLevel = Node("SemicolonLevel")
            newLevel.setToken(tempStack)
                
        #If we find a close parentheses:
        elif token.getType() == 6:
            # Pop all the tokens and put them into the temp stack
            # Until we get to the open paren type
            while curToken != None and curToken.getType() not in [5]:
                tempStack = addToParseTree(tempStack, curToken)
                curToken, tree = popFromFront(tree)
                
            #create a new Parentheses level and set it's token to the tempStack
            #The tempStack is the list of tokens between the parantheses  
            newLevel = Node("ParenLevel")
            newLevel.setNext(None)
            newLevel.setToken(tempStack)
            
        #If we find a close curly brace:    
        else:
            # Pop all the tokens and put them into the temp stack
            # Until we get to the open curly type
            while curToken != None and curToken.getType() not in [7]:
                tempStack = addToParseTree(tempStack, curToken)
                curToken, tree = popFromFront(tree)
                
            #create a new Curly Brace level and set it's token to the tempStack
            #The tempStack is the list of tokens between the Curly Braces      
            newLevel = Node("CurlyBraceLevel")
            newLevel.setNext(None)
            newLevel.setToken(tempStack)
            
        
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


#Print the parse tree with indents to help visualize different levels of the tree
def printParseTree(tree, depth):
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