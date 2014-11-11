from nodeClass import *
from parser2 import *
from tokenizer2 import *
from environment import *
import operator
from Exception import *

def eval(expr, env):
    #check for empty expression
    if expr == None:
        return None
    #all checks on expr
    #evaluating newLevel
    #else:
        
        #print expr.getToken()
    if expr.getType() == 13:
        eval(expr.getToken(),env)
        return eval(expr.getNext(), env)

    if expr.getType() in [11,12]:
        newNode = Node(str(eval(expr.getToken(), env)))
        newNode.setNext(expr.getNext())
        return eval( newNode, env)
    #evaluating assignment statements which declare type
    elif expr.getToken() in ['int','String','float','node','boolean']: 
        #no value assigned
        print "declaring var of type:", expr.getToken()
        if expr.getNext() == None or expr.getNext().getType() != 1:
            raise DeclarationError('Expected symbol after declaring type: ', expr.getToken())

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
                raise DeclarationError('Expected Symbol on left side of assignment')
            value = eval(expr.getNext().getNext(), env)
            evalEquals(expr.getToken(), [None, value], env)
        #evaluating algebra
        elif expr.getNext().getToken() in ['+', "-", "*", "/", "%", "**"]:
            return evalMaths(expr, expr.getNext(), expr.getNext().getNext(), env)
        elif expr.getNext().getToken() in ["==", "!=", ">", "<", ">=", "<="]:
            return evalPred(expr, env)
    #Check our environment for the variable
    elif expr.getType() == 1:
        return resolveVariable(expr, env)
    #can't be evaluated
    else:
        return expr.getToken()
    

def evalPred(args, env):
    "is this even called??"
    #if it is an empty ()
    if args == None:
        raise PredicateMissingException()
    
    #If it goes to a new level, evaluate the new level

    if args.getType() == 11:
        return evalPred(args.getToken(), env)
    
    
    #If it is a sinlge token, return Either True or False
    #False is False, everything else is true
    if args.getNext() == None:
        if args.getToken() == False:
            return False
        else:
            return True
    
    else:
        first, op, second = findOperator(args, env)
        if op == None:
            raise PredicateLogicError()
        a = eval(first, env)
        b = eval(second, env)
        ops = { ">": operator.gt, "<": operator.lt, ">=": operator.ge, "<=": operator.le, "==": operator.eq, "!=": operator.ne} 
        if op.getToken() in ["==", "!=", ">", "<", ">=", "<="]:
            print "============================"
            print  op.getToken()
            return ops[op.getToken()](a,b)
    

def findOperator(head, env):
    op = head
    while op.getToken() not in ["==", "!=", ">", "<", ">=", "<="]:
        temp = op
        op = op.getNext()
        if op == None:
            return None, None, None
    if op.getNext() == None:
        return None, None, None
    temp.setNext(None)
    print head.getToken(), op.getToken(), op.getNext().getToken()
    return head, op, op.getNext()
    
    
    
#def evalInequality(arg1, op, arg2, env):
        
def resolveVariable(var, env):
    variables = env.getVariables()
    if var.getToken() in variables:
        return variables[var.getToken()][1]
    else:
        print "Error! ", var.getToken(), "has not been instantiated!"
        exit(1)
        
        
def evalWhile(pred):
    #make sure there is a predicate and est of code to execute
    if pred == None or pred.getType() != 11 or pred.getNext() == None or pred.getNext().getType() != 11:
        raise WhileLoopSyntaxError()
    while evalPred(pred, env):
        eval(pred.getNext().getToken())
    
    
    

def evalMaths(first, op, second, env):
    print "Starting evalMaths: First, Second:", first.getToken(), second.getToken()
    if second == None:
        raise ArithmeticError()
        
    hasThird = False
    
    if second.getNext() != None:
        if second.getNext().getToken() in ['+', "-", "*", "/", "%", "**"]:
            op2 = second.getNext()
            hasThird = True
        else:
            raise ArithmeticError()
    
    firstNode = Node(str(first.getToken()))
    print "What is Second's type?????", second.getType(), second.getToken()
    if second.getType() > 10:
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
            raise IncompatibleTypes()
        else:
            raise AlreadyInitialized()
    
def evalEquals(name, value, env):
    dictionary = env.getVariables()
    print "in eval equals with the variable, ", name, value[0]
    # Error if variable is not initialized, otherwise update value
    if value[0] == None:
        if name not in dictionary:
            raise UnidentifiedVariable(name)
            
        #Check for type errors, or else update value
        else:
            
            
            inputedType = type(value[1])
            print "inputed type is: ", inputedType, ' for ', value[1]
            dictionaryType = type(dictionary[name][1])
            if dictionary[name][1] == None:
                dictionaryType = dictionary[name][0]
            print "dictionary type is: ", dictionaryType, ' for ', dictionary[name][1]
            if inputedType != dictionaryType:
                raise IncompatibleTypes(dictionaryType, inputedType)
            dictionary[name][1] = value[1]
    
    # Error if passing a type when already initialized 
    # Else creating variable in dictionary
    else:
        if name in dictionary:
            if dictionary[name][0] != type(value[1]):
                raise IncompatibleTypes()
            else:
                raise AlreadyInitialized(name)
        else:
            print "*** Need to check for incompatible types ***"
            print "inputted type:", value[0], "...", "actual type:", type(value[1]), "...", "Are they compatible???:", value[0] == type(value[1])
            dictionary[name] = [0, 0]
            dictionary[name][0] = type(value[1])
            dictionary[name][1] = value[1]
    
    return env

if __name__ == '__main__':
    e = Environment()
    tokenList = tokenize(raw_input())
    tree = parse(tokenList)

    print evalPred(tree, e)