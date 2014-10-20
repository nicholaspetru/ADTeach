from nodeClass import *

def eval(expr, env):
    #check for empty expression
    if expr == None:
        return None
    #all checks on expr
    #evaluating newLevel
    #else:
        
        #print expr.getToken()
    if expr.getType() == 11:
        newNode = Node(str(eval(expr.getToken(), env)))
        newNode.setNext(expr.getNext())
        return eval( newNode, env)
    #evaluating assignment statements which declare type
    elif expr.getToken() in ['int','string','float','node','boolean']: 
        #no value assigned
        if expr.getNext() == None or expr.getNext().getType() != 1:
            print "Error! expected symbol after declaring type:", expr.getToken()
            exit(1)
        if expr.getNext().getNext() == None:
            evalDeclare(expr.getNext().getToken(), [expr.getToken(), None], env)  
        #value assigned
        else:
            value = eval(expr.getNext().getNext().getNext(), env)
            evalEquals(expr.getNext().getToken(), [expr.getToken(), value], env)
    elif expr.getNext() != None:
        #all checks on expr.next()
        #evaluating assignment statements which don't declare type
        if expr.getNext().getToken() == "=":
            if expr.getType() != 1:
                print "Error! Expected Symbol on left side of assignment"
                exit(1)
            value = eval(expr.getNext().getNext(), env)
            evalEquals(expr.getToken(), [None, value], env)
        #evaluating algebra
        elif expr.getNext().getToken() in ['+', "-", "*", "/", "%", "**"]:
            return evalMaths(expr, expr.getNext(), expr.getNext().getNext(), env)
    #Check our environment for the variable
    elif expr.getType() == 1:
        return resolveVariable(expr, env)
    #can't be evaluated
    else:
        return expr.getToken()
    

def evalPred(args, env):
    #if it is an empty ()
    if args == None:
        print "No predicate in the condition spot"
        exit(1)
    
    #If it goes to a new leve, evaluate the new level
    if args.getType() == 11:
        return evalPred(args.getToken())
    
    #If it is a sinlge token, return Either True or False
    #False is False, everything else is true
    if args.getNext() == None:
        if args.getToken() == False:
            return False
        else:
            return True
    
    if
    
def findOperator(head, env):
    op = head
    while op.getToken() not in ["==", "!=", ">", "<", ">=", "<="]:
        op = op.getNext()
        if op == None:
            return
    
    
def evalInequality(arg1, op, arg2, env):
        
def resolveVariable(var, env):
    variables = env.getVariables()
    if var.getToken() in variables:
        return variables[var.getToken()][1]
    else:
        print "Error! ", var.getToken(), "has not been instantiated!"
        exit(1)
    
def evalMaths(first, op, second, env):
    print "Starting evalMaths: First, Second:", first.getToken(), second.getToken()
    if second == None:
        print "Error in your Arithmatic111"
        exit(1)
        
    hasThird = False
    
    if second.getNext() != None:
        if second.getNext().getToken() in ['+', "-", "*", "/", "%", "**"]:
            op2 = second.getNext()
            hasThird = True
        else:
            print "Error in your arithmatic222"
            exit(1)
    
    firstNode = Node(str(first.getToken()))
    if second.getType()==11:
        secondNode = Node(str(eval(second.getToken(), env)))
    else:
        secondNode = Node(str(second.getToken()))
    
    first = eval(firstNode, env)
    second = eval(secondNode, env)
    print "THIS IS THE SECOND VAL AND TYPE!:", secondNode.getToken(), secondNode.getType()
    
    
    if op.getToken() == '+':
        sum1 = first + second
    if op.getToken() == '-':
        sum1 = first - second
    if op.getToken() == '*':
        sum1 = first * second
    if op.getToken() == '/':
        sum1 = first / second
    if op.getToken() == '%':
        sum1 = first % second
    if op.getToken() == '**':
        sum1 = first ** second
        
    if hasThird:
        return evalMaths(Node(str(sum1)), op2, op2.getNext(), env)
    else:
        return sum1
    
def convertDeclaredType(declaredType):
    if declaredType == 'int':
        return int
    if declaredType == 'float':
        return float
    if declaredType == 'string':
        return str
    
    
def evalDeclare(name, value, env):
    print 'in eval declare'
    dictionary = env.getVariables()
    print dictionary
    if name not in dictionary:
        dictionary[name] = [0,0]
        dictionary[name][0] = convertDeclaredType(value[0])
        dictionary[name][1] = None
    else:
        if dictionary[name][0] != convertDeclaredType(value[0]):
            print "Incompatible types"
            exit(1)
        else:
            print "Already initialized"
            exit(1)
    
def evalEquals(name, value, env):
    dictionary = env.getVariables()
    print "in eval equals with the variable, ", name, value[0]
    # Error if variable is not initialized, otherwise update value
    if value[0] == None:
        if name not in dictionary:
            print "This variable has not been initialized"
            exit(1)
            
        #Check for type errors, or else update value
        else:
            
            
            inputedType = type(value[1])
            print "inputed type is: ", inputedType, ' for ', value[1]
            dictionaryType = type(dictionary[name][1])
            if dictionary[name][1] == None:
                dictionaryType = dictionary[name][0]
            print "dictionary type is: ", dictionaryType, ' for ', dictionary[name][1]
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
                print name, " has already been initialized"
                exit(1)
        else:
            dictionary[name] = [0, 0]
            dictionary[name][0] = type(value[1])
            dictionary[name][1] = value[1]
    
    return env


    
        