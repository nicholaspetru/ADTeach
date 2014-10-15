from tokenizer2 import *

def addToParseTree(tree, token):
    # If the token is not a close type, just push it onto the tree
    if token.getType() not in [6, 8]:
        token.setNext(tree)
        return token
    
    # If it is a close type, then we need to create a new level of the parse tree
    else:
        # We create a temporary stack to hold all of the tokens that go in the new level
        tempStack = None
        curToken, tree = popFromFront(tree)
        
        # Pop all the tokens and put them into the temp stack
        # Until we get to the open type
        while curToken.getType() not in [5,7]:
            tempStack = addToParseTree(tempStack, curToken)
            curToken, tree = popFromFront(tree)
            
        # Create a new node that marks the new level of the tree
        # Set its value to the stack of tokens that make up the new level
        newLevel = Node("NewLevel")
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
        tree = addToParseTree(tree, token)
        
    #reverse the parse tree so it is in the right order
    previous = None;
    while tree != None:
        temp = tree.getNext()
        tree.setNext(previous)
        previous = tree
        tree = temp
    tree = previous
    
    return tree


def printParseTree(tree):
    if tree == None:
        return
    if tree.getType() == 11:
        print "("
        printParseTree(tree.getToken())
        print ")"
    else:
        print tree.getToken(), tree.getType()
    printParseTree(tree.getNext())
    
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