from nodeClass import *

def eval(expr, env):
    #check for empty expression
    if expr == None:
        return None
    #all checks on expr
    #evaluating newLevel
    else:
        print expr.getToken()
    if expr.getType() == 11:
        return eval(expr.getToken(), env)
    #evaluating assignment statements which declare type
    elif expr.getToken() in ['int','string','float','node','boolean']:  
        #no value assigned
        if expr.getNext().getNext() == None:
            pass #uncomment out next line and remove pass when evalDeclare is written
            #evalDeclare(expr.getNext().getToken(), [expr.getType(), None], env)   
        #value assigned
        else:
            value = eval(expr.getNext().getNext().getNext(), env)
            evalEquals(expr.getNext().getToken(), [expr.getToken(), value], env)
    elif expr.getNext() != None:
        #all checks on expr.next()
        #evaluating assignment statements which don't declare type
        if expr.getNext().getToken() == "=":
            value = eval(expr.getNext().getNext(), env)
            evalEquals(expr.getToken(), [None, value], env)
        #evaluating algebra
        elif expr.getNext().getToken() in ['+', "-", "*", "/", "%", "**"]:
            return evalMaths(expr, expr.getNext(), expr.getNext().getNext(), env)
    #can't be evaluated
    else:
        return expr.getToken()
    
            
def evalMaths(first, op, second, env):
    firstNode = Node(str(first.getToken()))
    secondNode = Node(str(second.getToken()))
    
    first = eval(firstNode, env)
    second = eval(secondNode, env)
    
    if op.getToken() == '+':
        return first + second
    if op.getToken() == '-':
        return first - second
    if op.getToken() == '*':
        return first * second
    if op.getToken() == '/':
        return first / second
    if op.getToken() == '%':
        return first % second
    if op.getToken() == '**':
        return first ** second
    
    
def evalEquals(name, value, env):
    dictionary = env.getVariables()
    
    # Error if variable is not initialized, otherwise update value
    if value[0] == None:
        if name not in dictionary:
            print "This variable has not been initialized"
            exit(1)
            
        #Check for type errors, or else update value
        else:
            
            
            inputedType = type(value[1])
            
            dictionaryType = type(dictionary[name][1])
            if inputedType != dictionaryType:
                print "Cannot convert type ", dictionaryType, " to", inputedType
                exit(1)
            dictionary[name][1] = value[1]
    
    # Error if passing a type when already initialized 
    # Else creating variable in dictionary
    else:
        if name in dictionary:
            if dictionary[name][0] != type(value[1]):
                print "Incompatible types"
                exit(1)
            else:
                print name, "has already been initialized"
                exit(1)
        else:
            dictionary[name] = [0, 0]
            dictionary[name][0] = type(value[1])
            dictionary[name][1] = value[1]
    
    return env


    
        