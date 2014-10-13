from nodeClass import *
from parser2 import *
from tokenizer2 import *
from environment import *
from interpreter import *

if __name__ == '__main__':
    e = Environment()
    e.addVariable(Node("x").getToken(), [str, 'hello'])
    
    expression = raw_input()
    tokenList = tokenize(expression)
    tree = parse(tokenList)
    
    
    printParseTree(tree)
    
    eval(tree, e)
    e.printVariables()