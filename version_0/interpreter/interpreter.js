/**
*
* Interpreter
* 
* Iterates through the parse tree and evaluates each block
* Keeps track of current variables and their values in the Environment
*
* Authors: Sarah LeBlanc and Colby Seyferth
* ADTeach Team, 2015
*
**/

$(document).ready(function () {
    
    /**
    * Constructor:
    *
    * Instance variables:
    * code = string of code to be interpreted
    * TokenList = list of tokens 
    * env = Environment interpreter will be updating
    * inLoop = keeps track if interpreter currently in the body of a loop (to avoid creating new variables inside loops)
    * settingVar = true if setting variable in for loop instantiation (to allow for nested loops and avoid conflict with inLoop)
    *
    **/
    Interpreter = function(){
        this.code = "";
        this.TokenList = undefined;
        this.ParseTree = undefined;
        this.env = undefined;
        this.inLoop = false;
        this.settingVar = false;
        return this;
    }

    /**
    * Interpret: sets up token list and parser, passes parse tree to evaluator 
    *
    *@param {string} code - string of code to be interpreted
    *@param {Object} vh - Visualizer handler used to create new Environment
    *
    **/
    Interpreter.prototype.interpret = function(code, vh) {

        //Create new Environment to track variables and values
        var f = new Environment(null, vh);

        //Create token list and make parse tree
        this.code = code;
        this.makeTokenList(f);
        var source = this.TokenList;
        var parse = make_parse(f);
        var tree = parse(source);

        //Interpret parse tree
        this.eval(tree, f);
    }
    
    /**
    * Eval: iterates through parse tree list of blocks and calls appropriate evluate methods
    *
    *@param {Object} arrayOfBlocks - list of blocks to interpret
    *@param {Object} env - working Environment interpreter updates
    *
    **/
    Interpreter.prototype.eval = function(arrayOfBlocks, env) {

        //If there are no blocks, return null
        if (arrayOfBlocks == null) {
            return null;
        }
        var count = 0;

        //If only one block, decide next eval method based on block type
        if (typeof arrayOfBlocks[count] === "undefined") {
            var block = arrayOfBlocks;
            var blockType = block.arity;
            switch (blockType) {
                case "FOR_BLOCK":
                    this.evalForBlock(block, env);
                    break;
                case "IF_BLOCK":
                    this.evalIfBlock(block, env);
                    break;
                case "WHILE_BLOCK":
                    this.evalWhileBlock(block, env);
                    break;
                default:
                    this.evalSemiColonBlock(block, env);
                    break;
            }
        }

        //Until reaches the end of block list, eval the block depending on block type
        else {
            while (typeof arrayOfBlocks[count] != "undefined") {
                var block = arrayOfBlocks[count];
                var blockType = block.arity;
                switch (blockType) {
                    case "FOR_BLOCK":
                        this.evalForBlock(block, env);
                        break;
                    case "IF_BLOCK":
                        this.evalIfBlock(block, env);
                        break;
                    case "WHILE_BLOCK":
                        this.evalWhileBlock(block, env);
                        break;
                    default:
                        this.evalSemiColonBlock(block, env);
                        break;
                }
                count += 1;
            }
        }
    }
    
    /**
    *Eval semi colon: determines the type of tree in body of semi-colon block and calls appropriate evaluation method
    *
    *@param {Object} block - current semi colon block ready for evaluation
    *                   Information in semi colon block:
    *                       Body
    *@param {Object} env - working Environment that interpreter is updating
    *
    **/
    Interpreter.prototype.evalSemiColonBlock = function(block, env) {
        var root = block.value;
        var rootType = block.arity;
        if (rootType == "binary" && root == "=") {
            this.evalAssignment(block, env);
        } else if (rootType == "unary" && root == "++") {
            this.evalPlusPlus(block, env);
        } else if (rootType == "unary" && root == "--") {
            this.evalMinusMinus(block, env);
        } else if (rootType == "binary" && root == "+=") {
            this.evalPlusEqual(block, env);
        } else if (rootType == "binary" && root == "-=") {
            this.evalMinusEqual(block, env);
        } else if (rootType == "Initialization") {
            this.evalAssignment(block, env);
        } else if (rootType == "FunCall") {
            this.evalMethod(block, env);
        }
    }

    /**
    *Eval value - evaluates a tree
    *
    *@param {Object} root - the root of the tree to be evaluated
    *@param {Object} env - working Environment interpreter is updating
    **/
    Interpreter.prototype.evalValue = function(root, env) {

        //Chooses how to obtain value of root based on root's arity

        //Root is a method call
        if (root.arity == "FunCall") {
            return this.evalMethod(root, env)[0];
        }

        //Root is a literal or a math tree
        if (root.arity != "name") {
            switch(root.jtype) {
                case 'INT_TYPE':
                    return parseInt(root.value);
                    break;
                case 'FLOAT_TYPE':
                    return [parseFloat(root.value), "float"];
                    break;
                case 'STR_TYPE':
                    return root.value;
                    break;
                case 'CHAR_TYPE':
                    return root.value;
                    break;
                case 'BOOL_TYPE':
                    return root.value;
                    break;
                case 'OPERATOR_TYPE':
                    return this.evalMaths(root, env);
                    break;
            }

        //Root is a variable, so looks up value from environment
        } else {

            //Get information from environment about variable
            var val = env.getValue(root.value);
            var valType = env.getType(root.value);

            if (val === "no value") {
                env.throwError(root.linenum, "No value for variable");
                root.error();
            } 
            else if (valType === "no type") {
                env.throwError(root.linenum, "No type for variable");
                root.error();
            }

            //Determine value of the variable and return, changing if necessary based on value's type
            else {
                switch(valType) {
                    case "int":
                        return parseInt(val);
                        break;
                    case "float":
                        return [parseFloat(val), "float"];
                        break;
                    case "double":
                        return parseFloat(val);
                        break;
                    case "String":
                        return val;
                        break;
                    case "char":
                        return val;
                        break;
                    case "boolean":
                        return val;
                        break;
                    case "List<Integer>":
                    case "List<String>":
                    case "List<Float>":
                    case "Stack<Integer>":
                    case "Stack<String>":
                    case "Stack<Float>":
                    case "Queue<Integer>":
                    case "Queue<String>":
                    case "Queue<Float>":
                    case "PriorityQueue<Integer>":
                    case "PriorityQueue<String>":
                    case "PriorityQueue<Float>":
                    case "Graph":
                    case "Tree":
                    case "Dictionary<Integer, Integer>":
                    case "Dictionary<Integer, String>":
                    case "Dictionary<Integer, Float>":
                    case "Dictionary<String, Integer>":
                    case "Dictionary<String, Float>":
                    case "Dictionary<String, String>":
                    case "Dictionary<Float, Integer>":
                    case "Dictionary<Float, String>":
                    case "Dictionary<Float, Float>":
                        return [val, valType];
                        break;
                    default:
                        env.throwError(token.linenum, "Invalid type");
                        root.error();
                        break;
                }
            }
        }
    }

    /**
    *Eval while block - goes through process of a while loop and evaluates body while condition is true
    *
    *@param {Object} block - while block to be evaluated
    *               Information in while block:
    *                       Condition
    *                       Body
    *@param {Object} env - working Environment interpreter is updating
    **/
    Interpreter.prototype.evalWhileBlock = function(block, env) {

        //Get condition block and test for boolean value of condition by calling evalCondition
        var condition = block.Test;
        var isTrue = this.evalCondition(condition, env);

        //Set the end time and count to help determine if while loop is infinite
        var endTime = (new Date().getTime()/1000)+21;
        var count = 0;

        //Perform the body of the while loop while the condition is true
        while (isTrue == true) {

            //Set inLoop to true to make sure new variables are not created while in a loop
            this.inLoop = true;
            var body = block.Body;
            this.eval(body, env);

            //After performing the body, recheck the condition
            isTrue = this.evalCondition(condition, env);
            count++;

            //To check for possible infinite while loop, make sure body is not performed more than
            //1,243 times, or that it is not iterating for more than 21 seconds
            if (count > 1243) {
                env.throwError(block.linenum, "Interpreter Timed out, check while loop for infinite loop");
                block.error();
                
            }
            if (new Date().getTime()/1000 > endTime){
                env.throwError(block.linenum, "Interpreter Timed out, check while loop for infinite loop");
                block.error();
            }
        }

        //Once the condition is false, set inLoop to false, so variables can be intialized again
        this.inLoop = false;
    }
    
    /**
    *Eval assignment - evaluates an assignment tree, either initializing or updating a variable
    *
    *@param {Object} root - root of the assignment tree
    *@param {Object} env - working Environment the interpreter is updating
    *
    **/
    Interpreter.prototype.evalAssignment = function(root, env) {
        var valueRoot, value, returnedValue;
        var originMethod = "new";
        var originADT = "";
        var valueType;
        //Arity of the root determines if variable is being initialized or updated
        if (root.arity === "Initialization") {

            //Do not allow for variable initialization inside a loop unless it is setting a variable for a for loop counter
            if (this.inLoop && !this.settingVar) {
                env.throwError(root.linenum, "Please do not intialize variables inside a loop");
            }

            //Variable is initialized to resulting value from a method call, set the root of the method tree to root.second
            if (root.second.arity == "FunCall") {
                valueRoot = root.second;
            }

            //Right side of equal side is either another type of tree or null, and variable is just being initialized
            if (root.second.arity == "FunCall") {
                valueRoot = root.second;

            } else {
                //Variable being initialized
                if (root.third != null) {
                    valueRoot = root.third;

                //Variable is just being instantiated, create variable with null value
                } else {
                    valueRoot = null;
                    env.createVariable(root.first, root.second.value, null, null, null, root.linenum);
                    return;
                }
            }
        }

        //Variable already exists in environment, so value is just being updated
        else {
            variable = root.first.value;
            valueRoot = root.second;
        }
                
        //Find the value from the valueRoot (source determined from code above), store it in variable value

        //Right side of equal sign is a method, evaluate the method by calling evalMethod
        if (valueRoot.arity == "FunCall") {
            //Get resulting value from method call
            var methodValue = this.evalMethod(valueRoot, env);

            //Method value format: [current value of ADT, value returned from method, method called, type of returned value]
            value = methodValue[0];
            returnedValue = methodValue[1];
            originMethod = methodValue[2];
            valueType = methodValue[3];
            originADT = valueRoot.Caller.value;
        }
        
        //Right side of equal sign is a literal or variable
        if (valueRoot.arity == "literal" || valueRoot.arity == "name") {
            originADT = root.second.value;

            //Get current value of variable or literal by calling evalValue
            originADT = root.second.value;
            value = this.evalValue(valueRoot, env);

            if (typeof value == typeof [] && value.length >= 1 && value[1].indexOf("<") >=0) {
                env.throwError(root.linenum, "Expected a function call");
            }
        }

        //Right side of equal sign is a step call
        else if (valueRoot.value == "++" || valueRoot.value == "--") {
            value = this.evalStep(valueRoot, env);
        }
        
        //Right side of equal sign is a math tree
        else if (['%', '+', '-', '*', '/', '**'].indexOf(valueRoot.value) >= 0) {
            value = this.evalMaths(valueRoot, env);                
        } 

        //Creating a new variable of value being value as assigned above
        if (root.arity === "Initialization") {

            //The value is not from a method call
            if (root.third.arity != "FunCall") {
                var typeString = root.first;

                //Determine value of new variable based on ADT type
                //Since the right side of the equal sign is not a method, it must be a new ADT
                //The only possible values for initialized ADT is new or result of method
                switch(typeString) {

                    //Stack, Lists, Queues, PriorityQueues, Trees all stored as lists
                    case "Stack<Integer>":
                    case "Stack<String>":
                    case "Stack<Float>":
                    case "List<Integer>":
                    case "List<String>":
                    case "List<Float>":
                    case "Queue<Integer>":
                    case "Queue<String>":
                    case "Queue<Float>":
                    case "PriorityQueue<Integer>":
                    case "PriorityQueue<String>":
                    case "PriorityQueue<Float>":
                    case "Tree":
                        env.createVariable(typeString, root.second.value, [], "new", originADT, root.linenum);
                        break;

                    //Dictionaries are stored as an associative array
                    case "Dictionary<Integer, Integer>":
                    case "Dictionary<Integer, String>":
                    case "Dictionary<Integer, Float>":
                    case "Dictionary<Integer, Boolean>":
                    case "Dictionary<String, String>":
                    case "Dictionary<String, Integer>":
                    case "Dictionary<String, Float>":
                    case "Dictionary<String, Boolean>":
                    case "Dictionary<Float, String>":
                    case "Dictionary<Float, Integer>":
                    case "Dictionary<Float, Float>":
                    case "Dictionary<Float, Boolean>":
                        env.createVariable(typeString, root.second.value, {}, "new", originADT, root.linenum);
                        break;

                    //Graphs and Weighted Graphs are stored as an Array, with the first item being the values for each node and the second item
                    //being a boolean for the graph being directed or not, set to false by default
                    case "Graph":
                    case "WeightedGraph":
                        env.createVariable(typeString, root.second.value, [[], "false"], "new", originADT, root.linenum);
                        break;
                
                    //Initializing a variable that is not an ADT
                    default:
                        var type = this.checkType(value);

                        //Error if value being initialized doesn't match type of variable
                        if (root.first != type){
                            env.throwError(root.linenum, "Incompatible types! expected " + root.first + ", received " + type);
                            root.error();
                        }

                        //Create variable in environment to the value assigned above
                        env.createVariable(root.first, root.second.value, value, originMethod, originADT, root.linenum);
                        break;
                }

            //Value on right side of equal sign is from a method call
            } else {

                //Make sure type of returned value from method is correct for variable initialization
                if (root.first != valueType) {
                    env.throwError(root.linenum, "Incompatible types! expected " + root.first + ", received " + valueType);
                    root.error();
                }
                
                //Create new variable with value returned from method call
                env.createVariable(root.first, root.second.value, value, originMethod, originADT, root.linenum);
            }

        //Updating a variable instead of initializing one
        } else {
            //Find the value by calling evalValue, and find what type the value is
            var type = this.checkType(value);
            var val = this.evalValue(root.first, env);
            var valType = this.checkType(val);
            
            if (valueType) {
                if (val[1] != valueType) {
                    env.throwError(root.linenum, "Incompatible types!");
                    root.error();
                }  
            }
            
            if (typeof val == typeof [] && val.length >= 2 && val[1] != "float") {
                if (root.second.arity != "FunCall") {
                    env.throwError(root.linenum, "expected a function call");
                    root.error();
                }
            }

            if (val == null && root.first.arity == "name") {
                val = env.getType(root.first.value);
                if (val.size() > 1) {
                    if (root.second.arity != "FunCall") {
                        env.throwError(root.linenum, "expected a function call");
                        root.error();
                    }
                }
            }

            //Error if value is not compatible with type of existing variable
            if (valType != type){
                env.throwError(root.linenum, "Incompatible types! expected " + valType + ", received " + type);
                root.error();
            }
            if (type == null) {
                if (typeof val == typeof [] && val.length == 4 && methodValue[3] != val[1]){
                    env.throwError(root.linenum, "Incompatible types! expected " + methodValue[3] + ", received " + val[1]);
                    root.error();
                }
            }
            if (value.length == 2) {
                if (typeof value[0] == typeof []) {
                    value = value[0];
                }
            }

            //Update the variable of existing variable to value calculated above
            env.updateVariable(root.first.value, value, originMethod, originADT, root.linenum);
        }
    }
    
    /**
    *Eval condition -  evaluates the condition tree and returns boolean value
    *
    *@param {Object} root - the root of the condition tree
    *               Possible roots: <, >, ==, !=, <=, >=, &&, ||
    *@param {Object} env - working Environment interpreter is updating
    *
    *@return {Boolean} - true or false depending on result of condition check
    *
    **/
    Interpreter.prototype.evalCondition = function(root, env) {   
        var truth;

        //If root is boolean value, return value
        if (root.value == true) {
            return true;
        } else if (root.value == false) {
            return false;

        //If root is unary, this means it is !, so evaluate condition, and return opposite
        } else if (root.arity == "unary") {
            if (root.first.arity == "FunCall") {
                truth = this.evalCondition(root.first, env)[0];
            } else {
                truth = this.evalCondition(root.first, env);
            }
            if (truth) {
                return false;
            } else {
                return true;
            }

        //If root is a literal, make sure it is not an empty literal (0, 0.0, empty string), and return true
        } else if (root.arity == "literal") {
            if (root.value != 0 && root.value != 0.0 && root.value != '""') {
                return true;
            } else {
                return false;
            }

        //Root is a variable
        } else if (root.arity == "name") {
            var variable = this.evalValue(root, env);

            //Error if variable is not boolean type
            if (typeof variable != typeof true) {
                env.throwError(root.linenum, "Expected boolean, found " + typeof variable + " (" + variable+ ")");
                root.error();

            //Return value of variable
            } else {
                return variable;
            }

        //Root is a method call
        } else if (root.arity == "FunCall") {
            return this.evalMethod(root, env);
        
        //Root is binary, meaning it is a comparison
        } else if (root.arity === "binary") {

            //Determine what left and right side values of comparison are
            if (root.value == "&&" || root.value == "||"){
                var leftValue = this.evalCondition(root.first, env);
                if(root.value == "&&" && !this.evalCondition(root.first, env)) return false;
                var rightValue = this.evalCondition(root.second, env);

            } else {
                var leftValue = this.evalValue(root.first, env);
                var rightValue = this.evalValue(root.second, env);
                if (leftValue.length == 2 && leftValue[1] == "float") {
                    leftValue = leftValue[0];
                } 
                if (rightValue.length == 2 && rightValue[1] == "float") {
                    rightValue = rightValue[0];
                }
            }

            //Perform comparison
            switch (root.value) {
                case "&&":
                    return (leftValue && rightValue);
                    break;
                case "||":
                    return (leftValue || rightValue);
                    break;
                case "<":
                    return (leftValue < rightValue);
                    break;
                case ">":
                    return (leftValue > rightValue);
                    break;
                case ">=":
                    return (leftValue >= rightValue);
                    break;
                case "<=":
                    return (leftValue <= rightValue);
                    break;
                case "==":
                    return (leftValue == rightValue);
                    break;
                case "!=":
                    return (leftValue != rightValue);
                    break;
                default:
                    return undefined;
                    break;
            }
        }
        return undefined;
    }

    /**
    *Eval for block - goes through process of a for loop and evaluates body for entirety of counter
    *
    *@param {Object} block - for block to be evaluated
    *               Information in for block:
    *                       Initialization of counter variable
    *                       Step
    *                       Condition
    *                       Body
    *@param {Object} env - working Environment interpreter is updating
    **/
    Interpreter.prototype.evalForBlock = function(block, env) {
        var initialization = block.Initialization;
        var condition = block.Test;
        var step = block.Increment;
        var body = block.Body;
        var stepType;

        //Set the setting variable to true so counter variable can be set in nested loop
        this.settingVar = true;
        this.evalAssignment(initialization, env);
        this.settingVar = false;

        //While test is true, perform body of for loop
        var isTrue = this.evalCondition(condition, env);
        while (isTrue == true) {
            this.inLoop = true;
            this.eval(body, env);

            //After performing body of for loop, perform step and reevaluate condition
            this.evalSemiColonBlock(step, env);
            isTrue = this.evalCondition(condition, env);
        }
        this.inLoop = false;

        //Remove the intialized variable which only lives for duration of for loop
        env.removeVariable(initialization.second.value, initialization.linenum);
    }
    
    /**
    *Eval if block - goes through process of an if statement and evaluates body if condition is true
    *
    *@param {Object} block - if block to be evaluated
    *               Information in if block:
    *                       Condition
    *                       Body for when if is true
    *                       Else body for when if is false
    *@param {Object} env - working Environment interpreter is updating
    **/
    Interpreter.prototype.evalIfBlock = function(block, env) {
        var condition = block.Test;
        var body = block.IfBody;
        var elseBody = block.ElseBody;
        
        //Evaluate condition
        var isTrue = this.evalCondition(condition, env);
        
        //If condition is true, evaluate body of if statement, or else, evaluate body of else statement
        if (isTrue == true) {
            this.eval(body, env);
        } else {
            if (elseBody != null){
                this.eval(elseBody, env);
            }
        }
    }

    /**
    *Check type: return the type of a value as a string
    *
    *@param {Object} value - value to find the type of
    *
    **/
    Interpreter.prototype.checkType = function(value) {

        //Value is a float if a list with second item "float"
        if (typeof value == typeof []) {
            if (value.length == 2) {
                if (value[1] == "float") {
                    return "float";
                }
            }
        }

        //Determine type by using typeof value
        switch (typeof value) {
            case typeof 1:
                return "int";
            case typeof "1":
                return "String";
            case typeof true:
                return "boolean";
            default:
                return null
        }
    }
    
    /**
    *Eval maths: evaluates the math tree
    *
    *@param {Object} root - the root of the math tree
    *@param {Object} env - working Environment interpreter is updating
    *
    **/
    Interpreter.prototype.evalMaths = function(root, env) {  

        //If root is not an operator, find value using evalValue    
        if (['%', '+', '-', '*', '/', '**'].indexOf(root.value) < 0) {
            value = this.evalValue(root, env);
            return value;

        //Go through possible operators
        } else {

            //Deal with special cases of adding floats (parsing float value to get actual float number), and adding strings
            if (root.value == "+") {
                if (root.first.jtype == "FLOAT_TYPE") {
                    if (root.second.jtype == "FLOAT_TYPE") {
                        return [parseFloat(root.first.value) + parseFloat(root.second.value), "float"];
                    }
                }
                if (root.first.jtype == "STR_TYPE") {
                    if (root.second.jtype == "STR_TYPE") {
                        return root.first.value.substring(0, root.first.value.length-1) + root.second.value.substring(1, root.second.value.length);
                    }
                }
                return this.evalMaths(root.first, env) + this.evalMaths(root.second, env);

            //Take care of special cases for floats
            } else {
                var leftValue, rightValue;
                if (root.first.jtype == "FLOAT_TYPE") {
                    if (root.first.jtype == "FLOAT_TYPE") {
                        leftValue = parseFloat(root.first.value)
                        rightValue = parseFloat(root.second.value)
                        
                        switch(root.value) {
                            case "%":
                                return [leftValue % rightValue, "float"];
                            case "-":
                                return [leftValue - rightValue, "float"];
                            case "*":
                                return [leftValue * rightValue, "float"];
                            case "/":
                                return [leftValue / rightValue, "float"];
                        }
                    }

                //Find value of left and right by calling evaluating math on them
                } else {    
                    leftValue = this.evalMaths(root.first, env);
                    rightValue = this.evalMaths(root.second, env);
                }

                //Error if trying any math operator but addition on strings
                if (typeof leftValue === typeof "String" || typeof rightValue === typeof "String") {
                    env.throwError(root.linenum, "Incompatible types! expected Number, found String");
                    root.error();

                //Else, perform the operator on the left and right value
                } else {
                    switch (root.value) {
                        case "%":
                            return leftValue % rightValue;
                        case "-":
                            return leftValue - rightValue;
                        case "*":
                            return leftValue * rightValue;
                        case "/":
                            return leftValue / rightValue;
                    }
                }
            }
        }
    }
    
    /**
    *Eval plus plus: adds one to the current value of variable
    *
    *@param {Object} root - root of the plus plus tree
    *@param {Object} env - working Environment interpreter is updating
    *
    **/
    Interpreter.prototype.evalPlusPlus = function(root, env) {
        var name = root.first.value;
        var index = env.getIndex(root.first.value);

        //Find variable in the environment
        if (index >= 0){
            var value = env.getValue(name);
            if (value == null) {
                env.throwError(root.linenum, "This variable is not yet initialized");
                root.error();
            }

            //Add one to the current value of the variable and update the environment
            if (value.length == 2 && value[1] == "float") {
                env.updateVariable(name, [value[0]+1, "float"], "Step", "new", root.linenum);
            } else {
                env.updateVariable(name, value+1, "Step", "new", root.linenum);
            }
        }
    
    }
    
    /**
    *Eval minus minus: subtracts one to the current value of variable
    *
    *@param {Object} root - root of the minus minus tree
    *@param {Object} env - working Environment interpreter is updating
    *
    **/
    Interpreter.prototype.evalMinusMinus = function(root, env) {
        var name = root.first.value;
        var index = env.getIndex(root.first.value);

        //Find variable in the environment
        if (index >= 0) {
            var value = env.getValue(name);
            if (value == null) {
                env.throwError(root.linenum, "This variable is not yet initialized");
                root.error();
            }

            //Subtract one from the current value of the variable and update the environment
            if (value.length == 2 && value[1] == "float") {
                env.updateVariable(name, [value[0]-1, "float"], "Step", "new", root.linenum);
            } else {
                env.updateVariable(name, value-1, "Step", "new", root.linenum);
            }
        }
    
    }
    
    /**
    *Eval plus equal: adds a value to the current value of variable
    *
    *@param {Object} root - root of the plus equal tree
    *@param {Object} env - working Environment interpreter is updating
    *
    **/
    Interpreter.prototype.evalPlusEqual = function(root, env) {
        var name = root.first.value;
        var index = env.getIndex(name);
        var adding = root.second.value;

        //If value being added is not a literal, evaluate it using evalValue
        if (adding.jtype != "INT_TYPE" || adding.jtype != "STRING_TYPE" || adding.jtype != "FLOAT_TYPE") {
            adding = this.evalValue(root.second, env);
        }
        
        if (adding.length == 2 && adding[1] == "float") {
            adding = adding[0];
        }

        //Throw error if variable not in environment
        if (index < 0) {
            env.throwError(root.linenum, "Variable, " + name + " has not been declared");
            root.error();
        }

        //Add value to the current value in environment and update the environment
        var value = env.getValue(name);
        if (value.length == 2 && value[1] == "float") {
            newVal = [value[0] + adding, "float"];
        } else {
            var newVal = value + adding;
        }
        env.updateVariable(name, newVal, "+=", "new", root.linenum);
    }
    
    /**
    *Eval minus equal: subtracts a value from the current value of variable
    *
    *@param {Object} root - root of the minus equal tree
    *@param {Object} env - working Environment interpreter is updating
    *
    **/
    Interpreter.prototype.evalMinusEqual = function(root, env) {
        var name = root.first.value;
        var index = env.getIndex(name);
        var subtracting = root.second.value;

        //If value being subtracted is not a literal, evaluate it using evalValue
        if (subtracting.jtype != "INT_TYPE" || subtracting.jtype != "STRING_TYPE" || subtracting.jtype != "FLOAT_TYPE") {
            subtracting = this.evalValue(root.second, env);
        }

        if (subtracting.length == 2 && subtracting[1] == "float") {
            subtracting = subtracting[0];
        }
        //Throw error if variable not in environment
        if (index < 0) {
            env.throwError(root.linenum, "Variable, " + name + " has not been declared");
            root.error();
        }

        //Subtract value from current value in environment and update the environment
        var value = env.getValue(name);
        if (value.length == 2 && value[1] == "float") {
            newVal = [value[0] - subtracting, "float"];
        } else {
            var newVal = value - subtracting;
        }
        env.updateVariable(name, newVal, "-=", "new", root.linenum);
    }

    /**
    *isActuallyADT - checks to make sure type is not a literal
    *
    *@param {string} type - type of value we want to check
    *
    *@return {Boolean} - true if type is not a literal, false otherwise
    **/
    Interpreter.prototype.isActuallyADT = function(type) {
        var adt = ["int", "float", "String", "boolean"];
        if (adt.indexOf(type) >= 0) {
            return false;
        } else {
            return true;
        }
    }

    /**
    *Eval Method: evaluates a method root
    *
    *@param {Object} root - root of the method call tree
    *@param {Object} env - working Environment interpreter is updating
    *
    **/
    Interpreter.prototype.evalMethod = function(root, env) {
        var adt = root.Caller.value;
        var adtIndex = env.getIndex(adt);
        var adtType = env.getVariables()[adtIndex].type;
        
        var method = root.MethodName.value;
        var parameters = root.Arguments;
        var originADT = null;
        
        var isADT = this.isActuallyADT(adtType);

        //Error if trying to call method on a literal
        if (!isADT) {
            env.throwError(root.linenum, "Can't call method on literal");
            root.error();
        }

        var adtMethods = this.findMethods(adtType);
        var paramCheck = this.checkParameters(adtType, method, parameters);
        var newValue, returnValue;
        var cloneParam = [];

        //Error if calling unsupported method on ADT
        if (adtMethods.indexOf(method) < 0) {
            env.throwError(root.linenum, "Type " + adtType + " has no method \"" + method + "\"");
            root.error();
        }

        //Error if passing incorrect number of parameters
        if (paramCheck != true) {
            env.throwError(root.linenum, "Incorrect Parameters for method " + method);
            root.error();


        } else {

            //Evaluate all the parameters being passed in
            if (parameters.length != 0) {
                if (parameters[0].arity == "FunCall") {
                    originADT = parameters[0].Caller.value;
                }
                else if (env.getValue(parameters[parameters.length - 1].value) != null) {
                    originADT = parameters[parameters.length-1].value;
                }
                for (var i = 0; i < parameters.length; i++){
                    var varValue = this.evalValue(parameters[i], env);
                    var cloneVar = {value:varValue};
                    cloneParam[i] = cloneVar;
                }
            }

            //Do the actual method, return value in format [returned value, new ADT value, type of returned value]
            methodValue = this.doMethod(adtType, method, cloneParam, env, root, adt);
            returnValue = methodValue[0];
            newValue = methodValue[1];
            var valueType = methodValue[2];

            //Create more descriptive method name to pass to visualizers
            switch(method) {
                case("set"):
                case("get"):
                case("search"):
                case("contains"):
                case("indexOf"):
                case("getNeighbors"):
                case("getParent"):
                case("getChildren"):
                case('getInDegree'):
                case('getDegree'):
                case('removeVertex'):
                case('setDirected'):
                case('setRoot'):

                    //Add parameter to method name
                    if (cloneParam[0].value.length == 2 && cloneParam[0].value[1] == "float") {
                        method = method + "," + cloneParam[0].value[0];
                    } else {
                        method = method + "," + cloneParam[0].value;
                    }
                    break;

                case("add"):
                case("addVertex"):

                    //Add position in ADT item was added to name of method
                    if (adtType == "PriorityQueue<Integer>" || adtType == "PriorityQueue<String>"
                       || adtType == "PriorityQueue<Float>" || adtType == "Graph" || adtType == "WeightedGraph") {
                        method = method + "," + returnValue;
                        break;
                    }
                    if (parameters.length == 1) {
                        method = method + "," + env.getVariables()[env.getIndex(adt)].value.length;
                        break;
                    } else {
                        method = method + "," + cloneParam[0].value;
                        break;
                    }
                    break;

                case("remove"):

                    //Add posiiton in ADT item as removed from to name of method
                    if (adtType == "PriorityQueue<Integer>" || adtType == "PriorityQueue<String>" || adtType == "PriorityQueue<Float>" 
                        || adtType == "Queue<String>" || adtType == "Queue<Integer>" || adtType == "Queue<Float>") {
                        method = method + "," + env.getVariables()[env.getIndex(adt)].value.length;
                        break;
                    } else if (adtType == "Dictionary<Float, String>" || adtType == "Dictionary<Float, Integer>" || adtType == "Dictionary<Float, Float>") {
                        method = method + "," + cloneParam[0].value[0];
                        break;
                    } else {
                        method = method + "," + cloneParam[0].value;
                        break;
                    }

                case("addEdge"):
                case("removeEdge"):
                case("hasEdge"):
                case("getChild"):
                case("removeChild"):
                case('getWeight'):
                case('setWeight'):

                    //Add what was added and at which index to name of method
                    method = method + "," + cloneParam[0].value + "," + cloneParam[1].value;
                    if (cloneParam.length == 3) {
                        method = method + "," + cloneParam[2].value;
                    }
                    break;

                case("addChild"):

                    //Add parent node and child node to name of method (and possibly position of child)
                    if (parameters.length == 2) {
                        method = method + ',' + cloneParam[0].value + "," + cloneParam[1].value + "," + env.getVariables()[env.getIndex(adt)].value.length;
                    } else if (parameters.length == 3) {
                        method = method + ',' + cloneParam[0].value + "," + cloneParam[1].value + "," + cloneParam[2].value;
                    
                    }

                case("put"):
                    //Add key and value to name of method
                    if (adtType == "Dictionary<Float, Float>") {
                        method = method + "," + cloneParam[0].value[0] + "," + cloneParam[1].value[0];
                    } else {
                        method = method + "," + cloneParam[0].value + "," + cloneParam[1].value;
                    }
            }
            env.updateVariable(adt, newValue, method, originADT, root.linenum, adtType);
        }
        return [returnValue, newValue, method, valueType];
    }
    
    /**
    *Find methods: find the supported method for given ADT type
    *
    *@param {string} type - ADT type
    *
    *@return {Object} - list of supported methods for ADT type
    **/
    Interpreter.prototype.findMethods = function(type) {
        var y;
        switch(type) {
            case "Stack<Integer>":
            case "Stack<String>":
            case "Stack<Float>":
                y = new VStack();
                return y.listMethods();
                break;
            case "List<Integer>":
            case "List<String>":
            case "List<Float>":
                y = new VList();
                return y.listMethods();
                break;
            case "Queue<Integer>":
            case "Queue<String>":
            case "Queue<Float>":
                y = new VQueue();
                return y.listMethods();
                break;
            case "PriorityQueue<Integer>":
            case "PriorityQueue<String>":
            case "PriorityQueue<Float>":
                y = new VPQueue();
                return y.listMethods();
                break;
            case "Dictionary<Integer, Integer>":
            case "Dictionary<Integer, String>":
            case "Dictionary<Integer, Float>":
            case "Dictionary<String, Integer>":
            case "Dictionary<String, String>":
            case "Dictionary<String, Float>":
            case "Dictionary<Float, Integer>":
            case "Dictionary<Float, String>":
            case "Dictionary<Float, Float>":
                y = new VDictionary();
                return y.listMethods();
                break;
            case "Graph":
                y = new VGraph();
                return y.listMethods();
                break;
            case "WeightedGraph":
                y = new VWeightedGraph();
                return y.listMethods();
                break;
            case "Tree":
                y = new VTree();
                return y.listMethods();
                break;
        }
    }
    
    /**
    *Check parameters: check for appropriate number of provided parameters against number of required parameters for method
    *
    *@param {string} type - ADT type
    *@param {string} method - method being called
    *@param {Object} parameters - list of parameters being passed in
    *
    *@return {Boolean} - true if number of passed parameters matches number of required parameters, flase otherwise
    **/
    Interpreter.prototype.checkParameters = function(type, method, parameters) {
        var y;
        switch(type) {
            case "Stack<Integer>":
            case "Stack<String>":
            case "Stack<Float>":
                y = new VStack();
                return y.checkParameters(method, parameters);
                break;
            case "List<Integer>":
            case "List<String>":
            case "List<Float>":
                y = new VList();
                return y.checkParameters(method, parameters);
                break;
            case "Queue<Integer>":
            case "Queue<String>":
            case "Queue<Float>":
                y = new VQueue();
                return y.checkParameters(method, parameters);
                break;
            case "PriorityQueue<Integer>":
            case "PriorityQueue<String>":
            case "PriorityQueue<Float>":
                y = new VPQueue();
                return y.checkParameters(method, parameters);
                break;
            case "Dictionary<Integer, Integer>":
            case "Dictionary<Integer, String>":
            case "Dictionary<Integer, Float>":
            case "Dictionary<String, Integer>":
            case "Dictionary<String, String>":
            case "Dictionary<String, Float>":
            case "Dictionary<Float, Integer>":
            case "Dictionary<Float, String>":
            case "Dictionary<Float, Float>":
                y = new VDictionary();
                return y.checkParameters(method, parameters);
                break;
            case "Graph":
                y = new VGraph();
                return y.checkParameters(method, parameters);
                break;
            case "WeightedGraph":
                y = new VWeightedGraph();
                return y.checkParameters(method, parameters);
                break;
            case "Tree":
                y = new VTree();
                return y.checkParameters(method, parameters);
                break;
        }
    }
    
    /**
    *Do method: calls the performs method method from ADT class on the given ADT with given parameters
    *
    *@param {string} type - ADT type
    *@param {string} method - method being called
    *@param {Object} env - working Environment interpreter is updating
    *@param {Object} root - root of the method tree
    *@param {string} adt - name of ADT method is being called on
    *
    *@return {Object} - list of return information (return value, new ADT value, type of return value)
    **/
    Interpreter.prototype.doMethod = function(type, method, parameters, env, root, adt) {
        var y;
        var newV, returnV, value;
        switch(type) {
            case "Stack<Integer>":
            case "Stack<String>":
            case "Stack<Float>":
                y = new VStack();
                value = y.performMethod(type, method, parameters, env, root, adt);
                return value;
                break;
            case "List<Integer>":
            case "List<String>":
            case "List<Float>":
                y = new VList();
                value = y.performMethod(type, method, parameters, env, root, adt);
                return value;
                break;
            case "Queue<Integer>":
            case "Queue<String>":
            case "Queue<Float>":
                y = new VQueue();
                value = y.performMethod(type, method, parameters, env, root, adt);
                return value;
                break;
            case "PriorityQueue<Integer>":
            case "PriorityQueue<String>":
            case "PriorityQueue<Float>":
                y = new VPQueue();
                value = y.performMethod(type, method, parameters, env, root, adt);
                return value;
                break;
            case "Dictionary<Integer, Integer>":
            case "Dictionary<Integer, String>":
            case "Dictionary<Integer, Float>":
            case "Dictionary<String, Integer>":
            case "Dictionary<String, String>":
            case "Dictionary<String, Float>":
            case "Dictionary<Float, Integer>":
            case "Dictionary<Float, String>":
            case "Dictionary<Float, Float>":
                y = new VDictionary();
                value = y.performMethod(type, method, parameters, env, root, adt);
                return value;
                break;
            case "Graph":
                y = new VGraph();
                value = y.performMethod(type, method, parameters, env, root, adt);
                return value;
                break;
            case "WeightedGraph":
                y = new VWeightedGraph();
                value = y.performMethod(type, method, parameters, env, root, adt);
                return value;
                break;
            case "Tree":
                y = new VTree();
                value = y.performMethod(type, method, parameters, env, root, adt);
                return value;
                break;
            default:
                env.throwError(root.linenum, "Invalid ADT Type: " + type);
                root.error();
        }
    }
    
    /**
    * Eval step: evaluates a step tree
    *
    *@param {Object} root - the root of the step tree
    *@param {Object} env - the working Environment the interpreter is updating
    *
    **/
    Interpreter.prototype.evalStep = function(root, env) {
        if (root.value == "++") {
            this.evalPlusPlus(root, env);
        } else if (root.value == "--") {
            this.evalMinusMinus(root, env);
        }
    }
    
    /**
    *Make token list
    *
    *@param {Object} env - working Environment of interpreter
    *
    **/
    Interpreter.prototype.makeTokenList = function(env) {
        var t = new Tokenizer();
        var tokens = [];
        var parenLevel = 0;
        var braceLevel = 0;

        t.input(this.code);

        var currentToken = t.token(env);
        while (currentToken) {
            switch (currentToken.type) {
                case 'OPEN_PAREN':
                    parenLevel++;
                    break;
                case 'CLOSE_PAREN':
                    parenLevel--;
                    break;
                case 'OPEN_BRACE':
                    braceLevel++;
                    break;
                case 'CLOSE_BRACE':
                    braceLevel--;
                    break;
                default:
                    break;
            }
            if (currentToken.type != null) {
                tokens.push(currentToken);

            }
            currentToken = t.token(env);

        }

        if (parenLevel > 0) {
            env.throwError(1, "Syntax error: Missing close parenthesis");
            env.error();
        }
        else if (parenLevel < 0) {
            env.throwError(1, "Syntax error: Missing open parenthesis");
            env.error();
        }
        else if (braceLevel > 0) {
            env.throwError(1, "Syntax error: Missing close brace");
            env.error();
        }
        else if (braceLevel < 0) {
            env.throwError(1, "Syntax error: Missing open brace");
            env.error();
        }

        this.TokenList = tokens;
    }

    /**
    *Display tokens
    *
    *@returns {string} - returns token list as a string
    **/
    Interpreter.prototype.displayTokens = function() {
        var result = "";
        var t = this.TokenList;
        for (var i=0; i<t.length; i++) {
            result += t[i].type;
            result += ":";
            result += t[i].value;
            result += "\t\tline: ";
            result += t[i].linenum;
            result += "\n";
        }
        return result;
    }
    
    /**
    *Make Parse tree
    **/
    Interpreter.prototype.makeParseTree = function() {
        this.makeTokenList();
        var source = this.TokenList;
        var parse = make_parse();
        var tree = parse(source);
        this.ParseTree = tree;    
    }
});