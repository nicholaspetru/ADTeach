from nodeClass import *
from parser2 import *
from tokenizer2 import *
from environment import *
from interpreter import *

if __name__ == '__main__':
    e = Environment()
    #e.addVariable(Node("x").getToken(), [str, 'hello'])
    
    f = open('code.txt', 'r')
    expression = f.read()
    
    
    tokenList = tokenize(expression)
    print tokenList
    tree = parse(tokenList)
    print tree.getToken(), tree.getType()
    print "***********************************************"
    printParseTree(tree)
    '''
    expressionList = expression.split(";") + expression2.split(";")
    for ex in expressionList:
        tokenList = tokenize(ex)
        tree = parse(tokenList)
    
    
        #printParseTree(tree)
    
        eval(tree, e)
        
        
    e.printVariables()
    '''
    
    f.close()