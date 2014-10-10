from tokenizer2 import *

def addToParseTree(tree, token):
    nextToken = token.getNext()
    if token.getType() not in [5,6,7,8]:
        token.setNext(tree)
        return token
    elif token.getType() in [5,7]:
        token.setNext(tree)
        return token
    else:
        tempStack = None
        curToken, tree = popFromFront(tree)
        while curToken.getType() not in [5,7]:
            tempStack = addToParseTree(tempStack, curToken)
            curToken, tree = popFromFront(tree)
            print "TempStack:"
        newLevel = Node("NewLevel")
        newLevel.setNext(None)
        newLevel.setToken(tempStack)
        tree = addToParseTree(tree, newLevel)
        
        return tree
        
    
    '''
    if token.getType() in [5,7]:
        if token.getNext() != None and token.getNext().getType() not in [6,8]:
            if token.getType() == 5:
                parenDepth += 1
            else:
                braceDepth += 1
            token.setChild(token.getNext())
            token.getNext().setParent(token)
            token.getNext().setPrev(None)
            token.setNext(None)
        elif token.getNext() != None:
            token.setNext(token.getNext())
            token.getNext().setPrev(token)
    elif token.getType() in [6,8]:
        token.setPrev(tree)
        if token.getType() == 6:
            parenDepth -= 1
        else:
            braceDepth -= 1
        curToken = token
        while curToken.getPrev() != None:
            print 'going back'
            curToken = curToken.getPrev()
        curToken = curToken.getParent()
        while curToken.getParent() != None and curToken.getNext() != None:
            print 'going up'
            curToken = curToken.getParent()
        curToken.setNext(token)
        token.setPrev(curToken)
        tree.setNext(None)
    else:
        if tree != token:
            tree.setNext(token)
            if tree.getType not in [5,7]:
                token.setPrev(tree)
    if nextToken != None:
        addToParseTree(token, nextToken, parenDepth, braceDepth)
    return tree
    '''

def parse(tokenList):
    tree = None
    while tokenList != None:
        #print tokenList.getToken(), "-top of the stack"
        token, tokenList = popFromFront(tokenList)
        #print token.getToken(), "-token to add"
        tree = addToParseTree(tree, token)
        
    previous = None;
    while tree != None:
        temp = tree.getNext()
        tree.setNext(previous)
        previous = tree
        tree = temp
    tree = previous
    printParseTree(tree)

def printParseTree(tree):
    if tree == None:
        return
    if tree.getType() == 11:
        print "("
        printParseTree(tree.getToken())
        print ")"
    else:
        print tree.getToken()
        #print tree.getType()
    printParseTree(tree.getNext())
    
def popFromFront(tree):
    if tree == None:
        return None, None
    token = Node(tree.getToken())
    tree = tree.getNext()
    return token, tree
    
    
    
if __name__ == "__main__":
    tokenList = tokenize('x = (5 + 3) + 4')
    tokenList = tokenize("Stack s = new Stack(int)")
    
    parsedList = parse(tokenList)
    printParseTree(parsedList)