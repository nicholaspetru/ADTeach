'''
Base for interpreter with new parse tree structure
#Given a list of Blocks and each block will have some trees assosciated with them
#Different kinds of blocks: semi-colon, for, while, if
#Different kinds of trees: assignments, method, +=, -=, ++, --, ==, <, >, !=
'''


'''
Eval takes in a block, iterates through all blocks and evaluating them
Each block contains a Next and a Type
Eval the block depending on the type
'''

def eval(block, env):
    while block != None:
        blockType = block.Type

        if blockType == "Semicolon":
            evalSemiColonBlock(block, env)
        elif blockType == "For":
            evalForBlock(block, env)
        elif blockType == "If":
            evalIfBlock(block, env)
        elif blockType == "While":
            evalWhileBlock(block, env)
        
        block = block.Next
      
'''
Semi colon blocks have a Next, Type and Value
Value is the root of the tree
The root of the tree has a type for that tree
When given a semi colon block, evaluate the tree depending on its type
'''

def evalSemiColonBlock(block, env):
    root = block.Value
    rootType = block.rootType
    
    if rootType == "Assignment":
        evalAssignment(root, env)
    elif rootType == "Method": 
        evalMethod(root, env)
    elif rootType == "+=":
        evalPlusEqual(root, env)
    elif rootType == "-=":
        evalMinusEqual(root, env)
    elif rootType == "++":
        evalPlusPlus(root, env)
    elif rootType == "--":
        evalMinusMinus(root, env)
        
    return None
    
    
'''
For blocks have a Next, Initialization, Condition, Step and Body
Initialization is an assignment tree
Condition is a condition tree
Step is an assignment tree or a step tree (++, --)
The body is either empty or a block
    1) Perform the initialization
    2) While the condition is true:
    3)  Perform the body
    4)  Perform the step
'''

def evalForBlock(block, env):
    initialization = block.Initialization
    condition = block.Condition
    step = block.Step
    body = block.Body
    
    #Check what kind of step it is:
    if step.Value == "=":
        stepType = "Assignment"
    else:
        stepType = "Step"
    
    evalAssignment(initialization, env)
    isTrue = evalCondition(condition, env)
    while isTrue:
        eval(body, env)
        if stepType == "Assignment":
            evalAssignment(step, env)
        else:
            evalStep(step, env)
        isTrue = evalCondition(condition, env)
        
    return None
    
    
'''
If blocks have a Next, Type, Condition and Body
Condition is a condition tree
Body is either empty or a block
    1) Check the condition:
    2)  If it is true perform the body
'''

def evalIfBlock(block, env):
    condition = block.Condition
    body = block.Body
    
    isTrue = evalCondition(condition, env)
    
    if isTrue:
        eval(body, env)
        
    return None


'''
While blocks have a Next, Type, Condition and Body
Condition is a condition tree
Body is either empty or a block
    1) While the condition is true:
    2)  Evaluate the body
'''

def evalWhileBlock(block, env):
    condition = block.Condition
    body = block.Body
    
    isTrue = evalCondition(condition, env)
    
    while isTrue:
        eval(body, env)
        isTrue = evalCondition(condition, env)
        
    return None


'''
'''

def evalAssignment(root, env):
    #right side
    valueRoot = root.RChild
    
    if valueRoot.Value == ".":
        value = evalMethod(valueRoot, env)
        
    if valueRoot.LChild == None and valueRoot.RChild == None:
        if valueRoot.MChild == None:
            value = evalValue(valueRoot, env)
        else:
            value = evalStep(valueRoot, env)
            
    elif valueRoot.LChild != None and valueRoot.RChild != None:
        if valueRoot.Value in ['%', '+', '-', '*', '/', '**']:
            value = evalMaths(valueRoot, env)
            
        if valueRoot.Value == "new":
            #Create the new ADT
    
    #LEFT SIDE!! STRONG SIIIIIIIIDE!
    variables = env.getVariables()
    if root.LChild.Value == "init":
        if root.LChild.RChild.Value in variables:
            raise AlreadyInitialized(root.LChild.RChild.Value + " is already initialized")
        else:
            variables[root.LChild.RChild.Value]=[root.LChild.LChild.Value, value]
    
    else:
        if root.LChild.Value in variables:
            if variables[root.LChild.Value][0] == checkType(value):
                variables[root.LChild.Value][1] = value
            else:
                raise IncompatibleTypes(root.LChild.Value + "expected type: " + variables[root.LChild.Value][0] + ". Recieved type: " +checkType(value)) 
            
        else:
            raise AlreadyInitialized(root.LChild.RChild.Value + " is already initialized")
        
    return None

def checkType(value):
    if type(value) == type(1):
        return "int"
    elif type(value) == type(1.0):
        return "float"
    elif type(value) == type("1"):
        return "String"
    elif type(value) == type(True):
        return "Boolean"
    elif type(value) == type(VStack("int")):
        return "Stack<int>"
    elif type(value) == type(VStack("float")):
        return "Stack<float>"
    elif type(value) == type(VStack("String")):
        return "Stack<String>"
    elif type(value) == type(VQueue("int")):
        return "Queue<int>"
    elif type(value) == type(VQueue("float")):
        return "Queue<float>"
    elif type(value) == type(VQueue("String")):
        return "Queue<String>"
    else:
        return None
    

def evalMaths(root, env):
    if root.Value not in ['%', '+', '-', '*', '/', '**']:
        return evalValue(root, env)
    else:
        if root.Value == "+":
            return evalMaths(root.LChild, env) + evalMaths(root.RChild, env)
        else:
            leftValue = evalMaths(root.LChild, env)
            rightValue = evalMaths(root.RChild, env)
            if leftValue.Type == "String" or rightValue.Type == "String":
                raise IncompatibleTypes()
            elif root.Value == "%":
                return leftValue % rightValue
            elif root.Value == "-":
                return leftValue - rightValue
            elif root.Value == "*":
                return leftValue * rightValue
            elif root.Value == "/":
                return leftValue / rightValue
            elif root.Value == "**":
                return leftValue ** rightValue


'''
A method tree has one root ('.') which has three children:
    Left child = ADT name (variable)
    Middle child = method being called
    Right child = parameters
    
Make sure that method is valid for adt type, check parameters
If method and parameters are valid, perform the method
'''

def evalMethod(root, env):
    adt = root.LChild
    adtType = env.getVariables()[adt][0]
    
    method = root.MChild
    
    #Make sure it is a valid method
    if method not in adtType.listMethods():
        raise InvalidMethod("Not a valid method for a " + adtType.getType())
    
    #Check the parameters
    #TODO
    #accumulate list of parameters
    #TODO
    
    if adtType.checkParameters(method, listOfParameters) != True:
        raise IncorrectParameters("Incorrect parameters for " + method)
    else:
        adtType.performMethod(method, listOfParameters)
    return None


'''
A plus equal tree only has two children:
    Left child = variable
    Right child = how much to add
'''
def evalPlusEqual(root, env):
    variable = root.LChild
    toAdd = root.RChild
    
    #Check to make sure variable is in the dictionary
    if variable not in env.getVariables():
        raise UnidentifiedVariable(variable + " is not initialized")
        
    currentValue = env.getVariables()[variable][1]
    
    #TODO
    #Make an assignment tree with variable, current value
    #and value to add
    #TODO
    return None


'''
Same as evalPlusEqual just making the assignment tree have a subtraction
'''

def evalMinusEqual(root, env):
    return None


'''
Same as evalPlusEqual, just making the assignment tree add one
'''

def evalPlusPlus(root, env):
    return None


'''
Same as evalPlusPlus except making the assignment tree subtract one
'''

def evalMinusMinus(root, env):
    return None



'''
The two possible step trees will have a root of either ++ or --,
so evaluate them by calling the correct method
'''

def evalStep(root, env):
    if root.Value == "++":
        evalPlusPlus(root, env)
    elif root.Value == "--":
        evalMinusMinus(root, env)
    return None


'''
There are a few possible roots for a condition tree:
    <, >, ==, !=, true, false
'''
def evalCondition(root, env):
    if root.Value == "true":
        return True
    elif root.Value == "false":
        return False
    
    leftValue = root.LChild
    rightValue = root.RChild
    
    #TODO
    #Need to check to see if these values are variables
    #and if they are to check to make sure they are in the env
    #and what their values are
    #TODO
    
    if root.Value == "<":
        if leftValue < rightValue:
            return True
    elif root.Value == ">":
        if leftValue > rightValue:
            return True
    elif root.Value == "==":
        if leftValue == rightValue:
            return True
    elif root.Value == "!=":
        if leftValue != rightValue:
            return True
    return False