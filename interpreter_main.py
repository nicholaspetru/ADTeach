from nodeClass import *
from parser2 import *
from tokenizer2 import *
from environment import *

if __name__ == '__main__':
    expression = raw_input()
    tokenList = tokenize(expression)
    tree = parse(tokenList)
    
    printParseTree(tree)