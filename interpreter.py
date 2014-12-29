from nodeClass import *
from parser2 import *
from tokenizer2 import *
from environment import *
import operator
from Exception import *
from ADTs import *

def eval(expr, env):
    #adts = []
    #for adt in library:
    #   adts.append(adt)
    
    #check for empty expression
    if expr == None:
        return None
    #print type(expr)
    #If it is a semicolon type, evaluate the semicolon line, then evaluate the next thing
    if expr.getType() == 13:
        eval(expr.getToken(),env)
        return eval(expr.getNext(), env)

    #if you get to a new level: eval what is in the new level,
    #put it in a new node, and continue eval-ing
    if expr.getType() in [11,12]:
        newNode = Node(str(eval(expr.getToken(), env)))
        newNode.setNext(expr.getNext())
        return eval( newNode, env)
    
    if expr.getToken() == "for":
        
        #make sure there is a predicate and rest of code to execute
        if expr.getNext() == None or expr.getNext().getType() != 11 or expr.getNext().getNext() == None or expr.getNext().getNext().getType() != 12:
            raise ForLoopSyntaxError()
            
        if expr.getNext().getToken() == None or expr.getNext().getToken().getNext() == None or expr.getNext().getToken().getType() != 13 or expr.getNext().getToken().getNext().getType() != 13 or expr.getNext().getToken().getNext().getNext() == None:
            raise ForLoopSyntaxError()
            
        env = evalFor(expr.getNext(), env)
        env.printVariables()
        return eval(expr.getNext().getNext().getNext(), env)
    
    if expr.getToken() == "while":
        
        #make sure there is a predicate and rest of code to execute
        if expr.getNext() == None or expr.getNext().getType() != 11 or expr.getNext().getNext() == None or expr.getNext().getNext().getType() != 12:
            raise WhileLoopSyntaxError()
        env = evalWhile(expr.getNext(), env)
        env.printVariables()
        return eval(expr.getNext().getNext().getNext(), env)
        
    elif expr.getToken() == "if":
        
        #make sure there is a predicate and rest of code to execute
        if expr.getNext() == None or expr.getNext().getType() != 11 or expr.getNext().getNext() == None or expr.getNext().getNext().getType() != 12:
            raise IfSyntaxError()
        env = evalIf(expr.getNext(), env)
        env.printVariables()
        return eval(expr.getNext().getNext().getNext(), env)

    elif expr.getToken() == "new":
        print "new"

        
    # *****
    #
    #   Evaluation if the code is an assignment / initialization line
    #
    # *****
    
    elif expr.getToken() in ['int','String','float', 'long', 'node','boolean', 'Stack']: 
        
        #THROW SYNTAX ERROR
        #Missing variable for assignment (e.g. "int;") or 
        #Assignment is not valid variable (e.g. "int 5;")
        if expr.getNext() == None or expr.getNext().getType() != 1:
            raise DeclarationError('Expected symbol after declaring type: ', expr.getToken())
         
        
        #THROW SYNTAX ERROR
        #Make sure if there is an equal sign that there is 
        #something to the right of it
        #if expr.getNext().getNext() != None and expr.getNext().getNext().getNext() == None:
        #    raise SyntaxError("Need something after equal sign")
            

          
        
        #  ******************************************************************
        #  **** STRINGS **** #
        #  **** ASSIGNMENT **** #
        #  ******************************************************************
        
        elif expr.getToken() == 'String':
            print expr.getNext().getNext()
            
            #ADD TO ENVIRONMENT
            #Initialization but not assignment (e.g. "int x;")
            #Add the variable to the environment with value None
            if expr.getNext().getNext() == None:
                evalDeclare(expr.getNext().getToken(), [expr.getToken(), None], env)
        
        
            #ASSIGNMENT
            else:
                
                #THROW SYNTAX ERROR
                #Make sure if there is an equal sign that there is 
                #something to the right of it
                if expr.getNext().getNext() != None and expr.getNext().getNext().getNext() == None:
                    raise SyntaxError("Need something after equal sign")
                
                #CHECK COMPATIBILITY
                #Make sure that whatever is on right side of equal sign is a string
                if type(expr.getNext().getNext().getNext().getToken()) != type(""):
                    raise IncompatibleTypes(str(expr.getNext().getToken()) + " should be a string")
            
            
                #ADD SINGLE STRING TO DICTIONARY
                #If there is only one string being assigned
                #(e.g. "String y = "hello";)
                if expr.getNext().getNext().getNext().getNext() == None:
                    evalDeclare(expr.getNext().getToken(), [expr.getToken(), expr.getNext().getNext().getNext().getToken()], env)
            
            
                #CONCATENATE STRINGS
                #If there is more than one thing on the right side of the equal sign
                #make sure that it is only a + or another string
                else:
                    temp = expr.getNext().getNext().getNext().getToken()
                    curr = expr.getNext().getNext().getNext().getNext()
                
                    #THROW SYNTAX ERROR
                    #if something besides + follows first string
                    if curr.getToken() != "+":
                        raise SyntaxError((str(expr.getNext().getToken()) + " has an improper string format"))
                    
                    #THROW SYNTAX ERROR...
                    while curr != None:
                    
                        #If there is anything besides string or +
                        if curr.getToken() != "+" and type(curr.getToken()) != type(""):
                            raise SyntaxError((str(expr.getNext().getToken()) + " has an improper string format"))
                        
                        #If there are two strings in a row without a + inbetween
                        elif curr.getToken() != "+" and type(curr.getToken()) == type("") and curr.getNext() != None and curr.getNext().getToken() != "+":
                            raise SyntaxError((str(expr.getNext().getToken()) + " has an improper string format"))
                    
                        #If there are two + in a row with no string inbetween
                        elif curr.getToken() == "+" and curr.getNext().getToken() == "+":
                            raise SyntaxError((str(expr.getNext().getToken()) + " has an improper string format"))
                        
                        #If there is a + with no string after it
                        elif curr.getToken() == "+" and curr.getNext() == None:
                            raise SyntaxError((str(expr.getNext().getToken()) + " has an improper string format"))
                    
                        #CONCATENATE STRING
                        elif curr.getToken() != "+":
                            temp += curr.getToken()
                        
                        #Continue the while loop
                        if curr.getNext() != None:   
                            curr = curr.getNext()
                        else:
                            curr = None
                   
                    #ADD CONCATENATED STRING TO ENVIRONMENT
                    evalDeclare(expr.getNext().getToken(), [expr.getToken(), temp], env)
                
                
                
                
            #TODO
            #Doesn't catch following code:
            #   String = "hello";

            
        #  ******************************************************************
        #  **** INTEGER **** #
        #  **** ASSIGNMENT **** #
        #  ******************************************************************
            
        elif expr.getToken() == 'int':
            
            #INITIALIZATION
            #ADD TO ENVIRONMENT
            #Initialization but not assignment (e.g. "int x;")
            #Add the variable to the environment with value None
            if expr.getNext().getNext() == None:
                evalDeclare(expr.getNext().getToken(), [expr.getToken(), None], env)
            
            
            #ASSIGNMENT
            else:
                
                #THROW SYNTAX ERROR
                #Make sure if there is an equal sign that there is 
                #something to the right of it
                if expr.getNext().getNext() != None and expr.getNext().getNext().getNext() == None:
                    raise SyntaxError("Need something after equal sign")
                
                #CHECK COMPATIBILITY
                #Check to make sure right side of equal sign is an integer
                if type(expr.getNext().getNext().getNext().getToken()) != type(0):
                    raise IncompatibleTypes(str(expr.getNext().getToken()) + " should be an integer")


                #ADD SINGLE INTEGER TO ENVIRONMENT
                #If there is no arithmetic needed on the right side of equal sign
                if expr.getNext().getNext().getNext().getNext() == None:
                    evalDeclare(expr.getNext().getToken(), [expr.getToken(), expr.getNext().getNext().getNext().getToken()], env)


                #CALCULATE INTEGER AND ADD TO ENVIRONMENT
                #Check to make sure arithmetic does not contain any invalid symbols
                #and evaluate right side of the equal sign
                else:
                    operations = ["+", "-", "*", "/", "**"]
                    temp = expr.getNext().getNext().getNext()

                    #THROW SYNTAX ERROR...
                    while temp != None:

                        #If it is not an integer or an operator
                        if (type(temp.getToken()) != type(0)) and (temp.getToken() not in operations):
                            raise SyntaxError("Not a valid string of operations")

                        #If there are two operators next to each other without a number inbetween 
                        elif temp.getToken() in operations and temp.getNext() != None and temp.getNext().getToken() in operations:
                            raise SyntaxError("Not a valid string of operations")

                        #If there are two integers without an operator inbetween
                        elif type(temp.getToken()) == type(0) and temp.getNext() != None and type(temp.getNext().getToken()) == type(0):
                            raise SyntaxError("Not a valid string of operations")

                        #Continue with while loop
                        temp = temp.getNext()


                    #Calculate the outcome of operations of right side
                    firstNumber = expr.getNext().getNext().getNext()
                    operation = expr.getNext().getNext().getNext().getNext()
                    secondNumber = expr.getNext().getNext().getNext().getNext().getNext()

                    value = evalMaths(firstNumber, operation, secondNumber, env)
                    print value

                    #Add value to the environment
                    evalDeclare(expr.getNext().getToken(), [expr.getToken(), value], env)
                
                
        #  ******************************************************************
        #  **** FLOAT **** #
        #  **** ASSIGNMENT **** #
        #  ******************************************************************
            
        elif expr.getToken() == 'float':
            
            #ADD TO ENVIRONMENT
            #Initialization but not assignment (e.g. "int x;")
            #Add the variable to the environment with value None
            if expr.getNext().getNext() == None:
                evalDeclare(expr.getNext().getToken(), [expr.getToken(), None], env)
            
            
            #CHECK COMPATIBILITY
            #Check to make sure right side of equal sign is an integer
            if type(expr.getNext().getNext().getNext().getToken()) != type(0.0):
                raise IncompatibleTypes(str(expr.getNext().getToken()) + " should be a float")
                
                
            #ADD SINGLE INTEGER TO ENVIRONMENT
            #If there is no arithmetic needed on the right side of equal sign
            if expr.getNext().getNext().getNext().getNext() == None:
                evalDeclare(expr.getNext().getToken(), [expr.getToken(), expr.getNext().getNext().getNext().getToken()], env)
            
            
            #CALCULATE INTEGER AND ADD TO ENVIRONMENT
            #Check to make sure arithmetic does not contain any invalid symbols
            #and evaluate right side of the equal sign
            else:
                operations = ["+", "-", "*", "/", "**"]
                temp = expr.getNext().getNext().getNext()
                
                #THROW SYNTAX ERROR...
                while temp != None:
                    
                    #If it is not an integer or an operator
                    if (type(temp.getToken()) != type(0.0)) and (temp.getToken() not in operations):
                        raise SyntaxError("Not a valid string of operations")
                        
                    #If there are two operators next to each other without a number inbetween 
                    elif temp.getToken() in operations and temp.getNext() != None and temp.getNext().getToken() in operations:
                        raise SyntaxError("Not a valid string of operations")
                        
                    #If there are two integers without an operator inbetween
                    elif type(temp.getToken()) == type(0.0) and temp.getNext() != None and type(temp.getNext().getToken()) == type(0.0):
                        raise SyntaxError("Not a valid string of operations")
                        
                    #Continue with while loop
                    temp = temp.getNext()
                
                #QUESTION:
                #QUESTION:
                #QUESTION:
                #I forgot how float arithmetic worked in Java, I tried to run it and it wouldn't
                #let me add two floats together
                #How do we want float arithmetic to work?
                
                #Calculate the outcome of operations of right side
                firstNumber = expr.getNext().getNext().getNext()
                operation = expr.getNext().getNext().getNext().getNext()
                secondNumber = expr.getNext().getNext().getNext().getNext().getNext()
                
                value = evalMaths(firstNumber, operation, secondNumber, env)
                print value
                
                #Add value to the environment
                evalDeclare(expr.getNext().getToken(), [expr.getToken(), value], env)
             
            
            
        #  ******************************************************************
        #  **** STACK **** #
        #  **** ASSIGNMENT **** #
        #  ******************************************************************   
            
        elif expr.getToken() in ['Stack', 'Queue']:

            #THROW SYNTAX ERROR...
            
            #if Stack initialization is missing <
            #(e.g. StackInteger> y;)
            if expr.getNext() != None and expr.getNext().getToken() != '<':
                raise SyntaxError("Missing <")
                
                
            #if Stack is not intialized with content type
            #(e.g. Stack<> y;)
            if expr.getNext().getNext() == None:
                raise SyntaxError("Missing type")
                
                
            #if Stack initialization is missing >
            #(e.g. Stack<Integer y;)
            if expr.getNext().getNext().getNext() == None or (expr.getNext().getNext().getNext() != None and expr.getNext().getNext().getNext().getToken() != ">"):
                raise SyntaxError("Missing >")
                
            
            #if the stack does not have a variable
            if expr.getNext().getNext().getNext().getNext() == None:
                raise SyntaxError("Need a variable")
                
            
            #has an equal sign but no value on right
            if expr.getNext().getNext().getNext().getNext().getNext() != None and expr.getNext().getNext().getNext().getNext().getNext().getNext() == None:
                raise SyntaxError("Need something on right side of equal sign")
                
                
            #INITIALIZE
            #ADD TO ENVIRONMENT
            #If the stack is initialized but not assigned a value
            if expr.getNext().getNext().getNext().getNext().getNext() == None:
                variable = expr.getNext().getNext().getNext().getNext().getToken()
                stackType = expr.getNext().getNext().getToken()
                stack = VStack(stackType)
                evalDeclare(variable, [stack, None], env)
                
            #QUESTION:
            #QUESTION:
            #QUESTION:
            #How can they initialize the Stack?
            #They can do Stack<String> y = new Stack<String>(), but can they
            #initialize it with anything inside?
            if expr.getNext().getNext().getNext().getNext().getNext() != None:
                stackValue = expr.getNext().getNext().getNext().getNext().getNext().getNext()
                variable = expr.getNext().getNext().getNext().getNext().getToken()
                stackType = expr.getNext().getNext().getToken()

                stack = VStack(stackType)
                if stackValue.getToken() != "new":
                    if stackValue.getNext() != None:
                        raise SyntaxError("Improper Stack assignment")
                    evalDeclare(variable, [stack, stackValue.getToken()], env)
                    
                else:
                    if stackValue.getNext() == None or stackValue.getNext().getToken() != "Stack":
                        raise SyntaxError("Must be a new Stack")
                    elif stackValue.getNext().getNext() == None or stackValue.getNext().getNext().getToken() != "<":
                        raise SyntaxError("Missing <")
                    elif stackValue.getNext().getNext().getNext() == None or stackValue.getNext().getNext().getNext().getToken() != stackType:
                        raise IncompatibleTypes("Must initialize Stack of type: " + str(stackType))
                    elif stackValue.getNext().getNext().getNext().getNext() == None or stackValue.getNext().getNext().getNext().getNext().getToken() != ">":
                        raise SyntaxError("Missing >")
                    elif stackValue.getNext().getNext().getNext().getNext().getNext() == None or stackValue.getNext().getNext().getNext().getNext().getNext().getType() != 11:
                        raise SyntaxError("Missing ()")
                    elif stackValue.getNext().getNext().getNext().getNext().getNext().getToken() != None:
                        raise DeclarationError("Stack must be declared with ()")
                    else:
                        evalDeclare(variable, [stack, stack.getValue()], env)
                
                
            
            
            '''
        if expr.getToken() in ['Stack', 'Queue']:
            if expr.getNext().getToken() != None and expr.getNext().getToken() != '<':
                raise SyntaxError("Missing <")
            if expr.getNext().getNext() == None:
                raise SyntaxError("Missing type")
            if expr.getNext().getNext().getNext().getToken() != None and expr.getNext().getNext().getNext().getToken() != ">":
                raise SyntaxError("Missing >")
            
                
            print "n"
            if expr.getNext().getNext() == None:
                evalDeclare(expr.getNext().getNext().getNext().getNext().getToken(), [expr.getToken(), None], env)  
            #value assigned
            else:
                print expr.getNext().getNext().getNext().getNext().getNext().getNext().getToken(), "HHHHH"
                value = eval(expr.getNext().getNext().getNext().getNext().getNext().getNext(), env)
                evalEquals(expr.getNext().getToken(), [expr.getToken(), value], env)
                return
            
        #no value assigned
        print "declaring var of type:", expr.getToken()
        '''
        
    
          
        '''    
        #If a value is assigned, do a few things:
        #   Make sure types are compatible 
        #   If it is an int:
        #       check for arithmetic on right side
        else:
            if expr.getNext().getNext().getNext().getNext() == None:
                
                evalDeclare(expr.getNext().getToken(), [expr.getToken(), expr.getNext().getNext().getNext().getToken()], env)


        print expr.getNext().getNext().getNext().getToken(), "HHHHH", expr.getNext().getNext().getNext().getNext().getToken()
            value = eval(expr.getNext().getNext().getNext(), env)
            evalEquals(expr.getNext().getNext().getNext().getNext().getToken(), [expr.getNext().getNext().getNext().getToken(), value], env)

        return
            '''
    
    elif expr.getNext() != None:
        #all checks on expr.next()
        #evaluating assignment statements which don't declare type
        if expr.getNext().getToken() == "=":
            if expr.getType() != 1:
                raise DeclarationError('Expected Symbol on left side of assignment')
            value = eval(expr.getNext().getNext(), env)
            evalEquals(expr.getToken(), [None, value], env)
        #evaluating algebra
        elif expr.getNext().getToken() in ['+', "-", "*", "/", "%", "**", "++", "--"]:
            return evalMaths(expr, expr.getNext(), expr.getNext().getNext(), env)
        elif expr.getNext().getToken() in ["==", "!=", ">", "<", ">=", "<="]:
            return evalPred(expr, env)
        
    #Check our environment for the variable
    elif expr.getType() == 1:
        print "getting in here", expr.getToken()
        print expr.getType()
        return resolveVariable(expr, env)
    
    #can't be evaluated
    else:
        return expr.getToken()
    
#return the truth value of a predicate
def evalPred(args, env):
    
    print "args is:", args, type(args)
    
   
        
    
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
    
    #If it has multiple arguement tokens, solve it
    else:
        cloneArgs = args.cloneNode()
        first, op, second = findOperator(cloneArgs, env)
        if op == None:
            raise PredicateLogicError()
        a = eval(first, env)
        print "second is:", second.getToken()
        b = eval(second, env)
        
        #Table to look up operators so we dont need to use 6 similar if/elif's 
        #ex: operator.gt(a,b) returns (a > b)
        ops = { ">": operator.gt, "<": operator.lt, ">=": operator.ge, "<=": operator.le, "==": operator.eq, "!=": operator.ne} 
        if op.getToken() in ["==", "!=", ">", "<", ">=", "<="]:
            print "============================"
            print  ops[op.getToken()](a,b)
            return ops[op.getToken()](a,b)
    
#Find the arguements of the predicate
def findOperator(head, env):
    op = head
    #loop through the possible operators to find out which one to use
    while op.getToken() not in ["==", "!=", ">", "<", ">=", "<="]:
        temp = op
        op = op.getNext()
        
        #if there is no operator in the token list, then return None, None, None
        if op == None:
            return None, None, None
    if op.getNext() == None:
        return None, None, None
    #temp.setNext(None)
    one = Node(str(head.getToken()))
    #print head.getToken(), op.getToken(), op.getNext().getToken()
    return one, op, op.getNext()
    
#look up the variable in the environment dictionary
def resolveVariable(var, env):
    variables = env.getVariables()
    if var.getToken() in variables:
        return variables[var.getToken()][1]
    else:
        raise NotBeenInitialized(var.getToken())

        
        
def evalWhile(pred, env):
    while evalPred(pred, env):
        eval(pred.getNext().getToken(), env)
        env.printVariables()
    return env
    
def evalIf(pred, env):
    if evalPred(pred, env):
        eval(pred.getNext().getToken(), env)
        env.printVariables()
    elif pred.getNext().getNext() != None and pred.getNext().getNext().getToken() == 'else':
        print "10101010*****10101010101010", pred.getNext().getNext().getNext().getType()
        printParseTree(pred.getNext().getNext().getNext(), 0)
        eval(pred.getNext().getNext().getNext(), env)
        print "Got  here????"
    else:
        return env
    print "Got  here????"
    env.printVariables()
    return env

def evalFor(args, env):
    initial = args.getToken().getToken().cloneNode()
    
    condition = args.getToken().getNext().getToken().cloneNode()
    
    step = args.getToken().getNext().getNext().cloneNode()
    print "initial:", initial.getNext().getToken()
    eval(initial, env)

    while evalPred(condition, env):
        print 'IN THE WHILE'
        eval(args.getNext().getToken(), env)
        eval(step, env)
    return env
    
    
    

def evalMaths(first, op, second, env):
    if second == None:
        if op.getToken() not in ["++", "--"]:
            raise ArithmeticError()
        else:
            print "first is:", first
            env.printVariables()
            if op.getToken() == '++':
                print "passing in:", first.getToken()
                env.addVariable(first.getToken(), [type(1), resolveVariable(first, env) + 1])
                print env.getVariables()
            if op.getToken() == '--':
                env.addVariable(first.getToken(), [type(1), resolveVariable(first, env) -1])
            env.printVariables()
            return env
                
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
    elif op.getToken() == '**':
        sum1 = first ** second
    if op.getToken() == '/':
        sum1 = first / second
    if op.getToken() == '%':
        sum1 = first % second
    
    
        
    if hasThird:
        return evalMaths(Node(str(sum1)), op2, op2.getNext(), env)
    else:
        return sum1
    
def convertDeclaredType(declaredType):
    stringStack = VStack(type(0))
    if declaredType == 'int':
        return int
    if declaredType == 'float':
        return float
    if declaredType == 'String':
        return str
    return declaredType
    
    
def evalDeclare(name, value, env):
    print 'in eval declare'
    dictionary = env.getVariables()
    #print dictionary
    if name not in dictionary:
        print "name not in dictionary"
        dictionary[name] = [0,0]
        #print "value is: ", value[0]
        dictionary[name][0] = convertDeclaredType(value[0])
        #print "*&*&*&", value[1]
        dictionary[name][1] = value[1]
        #print dictionary[name][1]
    else:
        if dictionary[name][0] != convertDeclaredType(value[0]):
            raise IncompatibleTypes()
        else:
            raise AlreadyInitialized()
    
def evalEquals(name, value, env):
    dictionary = env.getVariables()
    #print "in eval equals with the variable, ", name, value[0]
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
    
    env.printVariables()
    return env

if __name__ == '__main__':
    e = Environment()
    tokenList = tokenize(raw_input())
    tree = parse(tokenList)

    print evalPred(tree, e)
    