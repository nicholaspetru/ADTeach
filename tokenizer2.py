'''
This is a tokenizer in python for the language Racket
We will make this accept our language later...
'''
from linkedlist import checkType
from nodeClass import *
from Exception import *


def tokenize(expression):
    parenDepth = 0
    braceDepth = 0
    head = None
    expression += " "
    tokenList = []
    temp = ""
    stringFlag = False
    tokenSeparators = ['(', ')', '/', '{', '}', ';']
    
    for i in range(len(expression)):
        if expression[i] == '(':
            parenDepth += 1
        elif expression[i] == ')':
            parenDepth -= 1
        if expression[i] == '{':
            braceDepth += 1
        elif expression[i] == '}':
            braceDepth -= 1
        if expression[i] in tokenSeparators:
            if stringFlag:
                temp += expression[i]
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
                temp = "\"" + temp + "\""
                tokenList.append(temp)
                temp = ""
            else:
                stringFlag =True
                
        elif expression[i] == ' ':
            if stringFlag:
                temp += ' '
            elif len(temp) > 0:
                tokenList.append(temp)
                temp = ""
                continue
                
        elif expression[i] == '.':
            if stringFlag:
                temp += '.'
            elif len(temp) > 0:
                if temp[0] in ['1', '2','3','4','5','6','7','8','9','0','-']:
                    temp += '.'
                else:
                    tokenList.append(temp)
                    temp = "." 
            else:
                temp = "."
        
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
        
        elif (expression[i] == ','):
            if stringFlag:
                temp += ","
            elif (temp != ""):
                tokenList.append(temp)
                temp = ""
            tokenList.append(",")
        
        elif (expression[i] == '<') and (expression[i+1] != None) and (expression[i+1] != "="):
            if (temp != ""):
                tokenList.append(temp)
                temp = ""
            tokenList.append('<')    
        
        elif (expression[i] == '>') and (expression[i+1] != None) and (expression[i+1] != "="):
            if (temp != ""):
                tokenList.append(temp)
                temp = ""
            tokenList.append('>') 
                
        elif (i > 0) and (expression[i] == '=') and (expression[i-1] == '='):
            #print "*************************", temp
            if stringFlag:
                temp += '='
            elif len(temp) > 1:
                #print "*************************", temp
                tokenList.append(temp[:-1])
                tokenList.append("==")
                temp = ''
            else:
                temp = ''
                tokenList.append("==")
        
        elif (i > 0) and (expression[i] == '=') and (expression[i-1] == '<'):
            #print "*************************", temp
            if stringFlag:
                temp += '='
            elif len(temp) > 1:
                #print "*************************", temp
                tokenList.append(temp[:-1])
                tokenList.append("<=")
                temp = ''
            else:
                temp = ''
                tokenList.append("<=")
                
        elif (i > 0) and (expression[i] == '=') and (expression[i-1] == '>'):
            #print "*************************", temp
            if stringFlag:
                temp += '='
            elif len(temp) > 1:
                #print "*************************", temp
                tokenList.append(temp[:-1])
                tokenList.append(">=")
                temp = ''
            else:
                temp = ''
                tokenList.append(">=")
                
        elif (i > 0) and (expression[i] == '=') and (expression[i-1] == '!'):
            #print "*************************", temp
            if stringFlag:
                temp += '='
            elif len(temp) > 1:
                #print "*************************", temp
                tokenList.append(temp[:-1])
                tokenList.append("!=")
                temp = ''
            else:
                temp = ''
                tokenList.append("!=")
                
        elif (i > 0) and (expression[i] == '=') and (expression[i-1] == '+'):
            #print "*************************", temp
            if stringFlag:
                temp += '='
            elif len(temp) > 1:
                #print "*************************", temp
                tokenList.append(temp[:-1])
                tokenList.append("+=")
                temp = ''
            else:
                temp = ''
                tokenList.append("+=")
                
        elif (i > 0) and (expression[i] == '=') and (expression[i-1] == '-'):
            #print "*************************", temp
            if stringFlag:
                temp += '='
            elif len(temp) > 1:
                #print "*************************", temp
                tokenList.append(temp[:-1])
                tokenList.append("-=")
                temp = ''
            else:
                temp = ''
                tokenList.append("-=")
            
        elif (i > 0) and expression[i] == '+' and expression[i-1] == '+':
            #print "*************************", temp
            if stringFlag:
                temp += '+'
            elif len(temp) > 1:
                #print "*************************", temp
                tokenList.append(temp[:-1])
                tokenList.append("++")
                temp = ''
            else:
                temp = ''
                tokenList.append("++")
                
        elif (i > 0) and expression[i] == '-' and expression[i-1] == '-':
            #print "*************************", temp
            if stringFlag:
                temp += '-'
            elif len(temp) > 1:
                #print "*************************", temp
                tokenList.append(temp[:-1])
                tokenList.append("--")
                temp = ''
            else:
                temp = ''
                tokenList.append("--")
                
        
            
        elif expression[i] == ';':
            if stringFlag:
                temp += ';'
            elif len(temp) > 0:
                tokenList.append(temp)
                tokenList.append(';')
                temp = ""
        else:
            temp += expression[i]
            
    #Turn the list of tokens into a linked list of nodes        
    for i in tokenList:
        curNode = Node(i)
        curNode.setNext(head)
        head = curNode
    
	#Reverse our linked list of nodes to be in the correct order
    previous = None;
    while head != None:
        temp = head.getNext()
        head.setNext(previous)
        previous = head
        head = temp
    head = previous
    
    if parenDepth != 0:
        raise MissingParentheses("Unmatched parentheses")
    if braceDepth != 0:
        raise MissingCurlyBrace("Unmatched curly braces")
    
    
    #print out the list of tokens in order to check! 
    #printHead = head
    #while printHead != None:
    #    print printHead.getToken(), printHead.getType()
    #    printHead = printHead.getNext()
    
    return head
    
if __name__ == "__main__":
    tokenize(raw_input("enter a line to tokenize: "))
    #tokenize('"hello world" "goodbye"')
    #tokenize('one 2 3.0 "4" (){}true false')
    #tokenize("String myString = new Stack(String).push(\"hello\").push(\"world!\").pop()")
                
