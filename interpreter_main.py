from nodeClass import *
from parser2 import *
from tokenizer2 import *
from environment import *
from interpreter import *

if __name__ == '__main__':
    e = Environment()
    #e.addVariable(Node("x").getToken(), [str, 'hello'])
    
    expression = raw_input()
    expression2 = raw_input()
    expressionList = expression.split(";") + expression2.split(";")
    for ex in expressionList:
        tokenList = tokenize(ex)
        tree = parse(tokenList)
    
    
        #printParseTree(tree)
    
        eval(tree, e)
        
    e.printVariables()