from tokenizer2 import *

def addToParseTree(tree, token, parenDepth, braceDepth):
    nextToken = token.getNext()
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

def parse(tokenList):
    return addToParseTree(tokenList, tokenList, 0, 0)

def printParseTree(tree):
    if tree == None:
        return
    print tree.getToken()
    #print tree.getToken() + "'s children!"
    printParseTree(tree.getChild())
    #print tree.getToken() + "'s next!"
    printParseTree(tree.getNext())
    
    
    
    
if __name__ == "__main__":
    tokenList = tokenize('(hello (1 (2 3)) world)')
    parsedList = parse(tokenList)
    printParseTree(parsedList)