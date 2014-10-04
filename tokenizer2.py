'''
This is a tokenizer in python for the language Racket
We will make this accept our language later...
'''
from linkedlist import checkType

def tokenize(expression):
    expression += " "
    tokenList = []
    temp = ""
    stringFlag = False
    tokenSeparators = ['(', ')', '+', '-', '*', '/', '{', '}']
    
    for i in range(len(expression)):
        if expression[i] in tokenSeparators:
            if stringFlag:
                temp += ' '
            elif len(temp) == 0:
                temp = expression[i]
                tokenList.append(temp)
                temp = ""
            else:
                tokenList.append(temp)
                temp = expression[i]
                tokenList.append(temp)
                temp = ""
                
        elif expression[i] == "\"":
            if stringFlag:
                stringFlag = False
            else:
                stringFlag =True
            
        elif expression[i] == ' ':
            if stringFlag:
                temp += ' '
            elif len(temp) > 0:
                tokenList.append(temp)
                temp = ""
        
        elif expression[i] == '\t':
            if stringFlag:
                temp += '\t'
            elif len(temp) > 0:
                tokenList.append(temp)
                temp = ""
        
        elif expression[i] == '\n':
            if stringFlag:
                temp += '\n'
            elif len(temp) > 0:
                tokenList.append(temp)
                temp = ""
        
        elif expression[i] == ';':
            return
        else:
            temp += expression[i]
            
    for i in tokenList:
        print i, checkType(i)
    
tokenize(raw_input("enter a line to tokenize: "))

inputt = "String myString = new Stack(String).push(\"hello\").push(\"world!\").pop()"
                
