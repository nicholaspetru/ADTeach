def eval(expr, env):
   
    
    if expr == None:
        return None
    if expr.getType() == 11:
        return eval(expr.getToken())
    
    # Type is a symbol (type, variable, equal sign)
    if (expr.getNext() != None and expr.getNext().getNext() != None and expr.getNext().getNext().getNext() != None):
        if expr.getType() == 1:
            if expr.getNext().getType() == 1:
                if expr.getNext().getNext().getType() == 1:
                    value = eval(expr.getNext().getNext().getNext(), env)
                    evalEquals(expr.getNext().getToken(), [expr.getToken(), value], env)
                
    # Type is a symbol (variable, equal sign)
    elif (expr.getNext() != None and expr.getNext().getNext() != None):
        if expr.getType() == 1:
            if expr.getNext().getType() == 1:  
                value = eval(expr.getNext().getNext(), env)
                evalEquals(expr.getToken(), [None, value], env)
        
    else:
        return expr.getToken()
    
            

        
    
    
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
            if dictionary[name][0] != value[0]:
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


    
        