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

    eval(tree, e)
    print "***********************************************"
    printParseTree(tree, 0)
    e.printVariables()
    
    
    f.close()