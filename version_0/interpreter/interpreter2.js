/*
* interpeter.js
*
*
*/

$(document).ready(function () {
    
    Interpreter = function(){
        this.symbolTable = null;
        this.code = "";
        this.TokenList = undefined;
        this.NodeList = null;
        this.ParseTree = undefined;
        this.Error = null;
        this.env = undefined;
        return this;
    }
    Interpreter.prototype.interpret = function(code, vh) {
        var f = new Environment(null, vh);
        this.code = code;
        this.makeTokenList();
        var source = this.TokenList;
        var parse = make_parse(f);
        var tree = parse(source);
        this.eval(tree, f);
    }
    
    // Evaluates an array of statements or a single statement
    Interpreter.prototype.eval = function(arrayOfBlocks, env) {
        console.log("Evaling: ", arrayOfBlocks);
        if (arrayOfBlocks == null) {
            return null;
        }
        var count = 0;
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
        console.log("Didn't find anything");
    }

    Interpreter.prototype.evalValue = function(root, env) {
        if (root.arity == "FunCall") {
            console.log("ROOOOOOOT is: ", root);
            console.log("ENV1 IS: ", env);
            return this.evalMethod(root, env)[0];
        }
        if (root.arity != "name") {
            console.log("NOT GOING TO MATH: ", root);
            switch(root.jtype) {
                case 'INT_TYPE':
                    console.log("This is right");
                    return parseInt(root.value);
                    break;
                case 'FLOAT_TYPE':
                    /*
                    console.log("<><><>", root.value);
                    if (parseFloat(root.value).toString().indexOf('.') < 0) {
                        var precNumber = parseFloat(root.value).toString().length + 1;
                        console.log("Parsed float will be: ", typeof parseFloat(root.value).toPrecision(precNumber));
                        var front = Number(root.value);
                        //var returning = front.0;
                        return [front, "float"];
                    }
                    */
                    console.log("Parsed float will be: ", typeof parseFloat(root.value));
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
        } else {
            console.log("LOOKING FOR I");
            var val = env.getValue(root.value);
            var valType = env.getType(root.value);
            console.log("Found the value: ", val);
            if (val === "no value") {
                console.log("not in env");
                env.throwError(root.linenum);
                root.error("Error no value");
                //new UnidentifiedVariable();
            } 

            else if (valType === "no type") {
                env.throwError(root.linenum);
                console.log("variable " + root.value + " is in env, but does not have a type associated with it");
                root.error("No type");
            }

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
                        console.log(valType);
                        console.log("variable " + root.value + " was initialized with an invalid type...or alternatively, it references an ADT and we haven't implemented that here yet.");
                        env.throwError(token.linenum);
                        root.error("No type");
                        
                        break;
                }
            }
        }
    }

    Interpreter.prototype.evalWhileBlock = function(block, env) {
        var condition = block.Test;
        console.log("Test is: ", condition);
        var isTrue = this.evalCondition(condition, env);
        var endTime = (new Date().getTime()/1000)+21;
        while (isTrue == true) {
            var body = block.Body;
            var condition2 = block.Test;

            this.eval(body, env);
            isTrue = this.evalCondition(condition2, env);

            if (new Date().getTime()/1000 > endTime){
                console.log(endTime);
                console.log(new Date().getTime());
                isTrue = false;
                console.log("Interpreter Timed out, check while loop for infinite loop");
            }
        }
    }
    
    Interpreter.prototype.evalAssignment = function(root, env) {
        var valueRoot, value, returnedValue;
        var originMethod = "new";
        var originADT = "";
        
        if (root.arity === "Initialization") {
            console.log("ROOT IS: ", root);
            if (root.second.arity == "FunCall") {
                console.log("Right side of equal side is function call", root.second);
                valueRoot = root.second;
                //valueRoot = root.second
                //value = root.first
            } else {
                if (root.third != null) {
                    console.log("Saying right side is: ", root);
                    valueRoot = root.third;
                } else {
                    valueRoot = null;
                    env.createVariable(root.first, root.second.value, null, null, null, root.linenum);
                    return;
                }
            }
        }
        else {
            variable = root.first.value;
            valueRoot = root.second;
            console.log("VALUE ROOT IS: ", valueRoot);
        }
                
        // Get the value of the righthand side of the equals sign
        if (valueRoot.arity == "FunCall") {
            console.log("CALLING A FUNCTION");
            var methodValue = this.evalMethod(valueRoot, env);
            returnedValue = methodValue[1];
            value = methodValue[0];
            valueType = methodValue[3];
            console.log("BEING RETURNED: ", typeof value);
            originMethod = methodValue[2];
            //originMethod = valueRoot.MethodName.value;
            originADT = valueRoot.Caller.value;
            //ADD ORIGIN
        }
        
        //Literals: ints, floats, strings, etc.
        if (valueRoot.arity == "literal" || valueRoot.arity == "name") {
            console.log("Current root is: ", root);
            originADT = root.second.value;
            value = this.evalValue(valueRoot, env);
            //originADT = this.evalValue(valueRoot, env)[1];
            console.log("Valueeee is: ", value);
            console.log("Origin ADT is: ", originADT);
        }
        else if (valueRoot.value == "++" || valueRoot.value == "--") {
            value = this.evalStep(valueRoot, env);
        
        }
        
        else if (['%', '+', '-', '*', '/', '**'].indexOf(valueRoot.value) >= 0) {
                console.log("Passing in: ", valueRoot);
                value = this.evalMaths(valueRoot, env);
                console.log("VVVValue is: ", value);
                
        } 

        
        if (root.arity === "Initialization") {
            if (root.third.arity != "FunCall") {
                var typeString = root.first;
                switch(root.first) {
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
                        console.log("Going to create a new ADT: ", root);
                        if (root.third.arity === "Initialization") {
                            env.createVariable(typeString, root.second.value, [], "new", originADT, root.linenum);
                        } else {
                            console.log("Creating from right spot", root);
                            if (value[1] != typeString) {
                                env.throwError(root.linenum);
                                root.error();
                            }
                            env.createVariable(typeString, root.second.value, value[0], "new", root.third.value, root.linenum);
                        }
                        break;
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
                        if (root.third.arity === "Initialization") {
                            env.createVariable(typeString, root.second.value, {}, "new", originADT, root.linenum);
                        } else {
                            if (value[1] != typeString) {
                                env.throwError(root.linenum);
                                root.error();
                            }
                            env.createVariable(typeString, root.second.value, value[0], "new", root.third.value, root.linenum);
                        }
                        break;
                    case "Graph":
                        if (root.third.arity === "Initialization") {
                            env.createVariable("Graph", root.second.value, [[], "false"], "new", originADT, root.linenum);
                        } else {
                            if (value[1] != typeString) {
                                env.throwError(root.linenum);
                                root.error();
                            }
                            env.createVariable(typeString, root.second.value, value[0], "new", root.third.value, root.linenum);
                        }
                        break;
                    case "WeightedGraph":
                        if (root.third.arity === "Initialization") {
                            env.createVariable("WeightedGraph", root.second.value, [[], "false"], "new", originADT, root.linenum);
                        } else {
                            if (value[1] != typeString) {
                                env.throwError(root.linenum);
                                root.error();
                            }
                            env.createVariable(typeStirng, root.second.value, value[0], "new", root.third.value, root.linenum);
                        }
                        break;
                    
                    default:
                        var type = this.checkType(value);
                        console.log("Value is: ", value);
                        console.log("Checking: ", type, "against: ", root.first);
                        if (root.first != type){
                            console.log("root is: ", root);
                            console.log("root.first is: ", root.first, "and type is:", type);
                            env.throwError(root.linenum);
                            console.log("INCOMPATIBLE TYPES!!");
                            root.error("Incompatible types");
                        }/*
                        if (value.length = 2) {
                            if (value[1] == "float") {
                                value = value[0];
                            }
                        }*/
                        env.createVariable(root.first, root.second.value, value, originMethod, originADT, root.linenum);
                        break;
                }
            console.log("HERE AND ROOT IS: ", root);
            } else {
                console.log("Creating variable: ", root);
                console.log("Value is: ", typeof value);
                //console.log("Type is: ", valueType);
                //console.log("Of type: ", this.checkType(value));
                if (root.third.arity == "FunCall") {
                    console.log("IS A FUNCALL");
                    console.log("Root first: ", root.first);
                    console.log("Want type: ", valueType);
                    if (root.first != valueType) {
                        env.throwError(root.linenum);
                        root.error();
                    }
                }
                 else if (root.first != this.checkType(value)) {
                    env.throwError(root.linenum);
                    root.error();
                }
                //returnValue = value[0];
                //method = value[2];
                //originMethod = method;
                console.log("VALUE ISSSSS: ", value);
                env.createVariable(root.first, root.second.value, value, originMethod, originADT, root.linenum);
            }
        }
        else {
            var type = this.checkType(value);
            var val = this.evalValue(root.first, env);
            var valType = this.checkType(val);
            console.log(root.first);
            if (val == null && root.first.arity == "name") {
                console.log("In correct if statement");
                console.log(env.getType(root.first.value));
                val = env.getType(root.first.value);
            }
            console.log("VAL IS: ", val);
            console.log("Root.first type is: ", typeof val, " and type is: ", type);
            
            if (valType != type){
                console.log(val, typeof val, type);
                env.throwError(root.linenum);
                console.log("INCOMPATIBLE TYPES!!");   
                root.error("INcompatible types");
            }
            console.log("root is: ", root);
            env.updateVariable(root.first.value, value, originMethod, originADT, root.linenum);
        }
    }
    
    Interpreter.prototype.evalCondition = function(root, env) {        
        if (root.value == true) {
            return true;
        } else if (root.value == false) {
            return false;
        } else if (root.arity == "literal") {
            console.log("Can't do literals");
        } else if (root.arity == "name") {
            var variable = this.evalValue(root, env);
            if (typeof variable != typeof true) {
                env.throwError(root.linenum);
                console.log("No literals");
                root.error("No literals");
            } else {
                return variable;
            }
        } else if (root.arity == "FunCall") {
            return this.evalMethod(root, env);
        }
        
        if (root.arity === "binary") {
        
            var leftValue = this.evalValue(root.first, env);
            var rightValue = this.evalValue(root.second, env);
            if (leftValue.length == 2 && leftValue[1] == "float") {
                leftValue = leftValue[0];
            } 
            if (rightValue.length == 2 && rightValue[1] == "float") {
                rightValue = rightValue[0];
            }
            switch (root.value) {
                case "&&":
                    console.log("DOing aaaand");
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
                    console.log("unrecognized operator: " + root.value);
                    return undefined;
                    break;
            }
        }
        return undefined;

    }


    Interpreter.prototype.evalForBlock = function(block, env) {
        var initialization = block.Initialization;
        var condition = block.Test;
        var step = block.Increment;
        var body = block.Body;
        var stepType;
        
        this.evalAssignment(initialization, env);
        var isTrue = this.evalCondition(condition, env);
        while (isTrue == true) {
            this.eval(body, env);
            this.evalSemiColonBlock(step, env);
            isTrue = this.evalCondition(condition, env);
        }
        console.log(initialization);
        env.removeVariable(initialization.second.value, initialization.linenum);
        
    }
    
    Interpreter.prototype.evalIfBlock = function(block, env) {
        var condition = block.Test;
        var body = block.IfBody;
        var elseBody = block.ElseBody;
        
        var isTrue = this.evalCondition(condition, env);
        
        if (isTrue == true) {
            this.eval(body, env);
        } else {
            if (elseBody != null){
                this.eval(elseBody, env);
            }
        }
    }
    Interpreter.prototype.checkType = function(value) {
        console.log("**************** Type of value is:", typeof value);
        console.log("Looking at: ", value);
        if (typeof value == typeof []) {
            if (value.length == 2) {
                if (value[1] == "float") {
                    return "float";
                }
            }
        }
        switch (typeof value) {
            case typeof 1:
                console.log("Returning whaaaat we want");
                return "int";
            case typeof "1":
                return "String";
            case typeof true:
                return "boolean";
                
            case typeof VStack("int"):
                return "Stack<int>";
                break;
            case typeof VStack("float"):
                return "Stack<Float>";
                break;
            case typeof VStack("String"):
                return "Stack<String>";
                break;
                
            case typeof VList("int"):
                return "List<Integer>";
            case typeof VList("String"):
                return "List<String>";
            case typeof VList("float"):
                return "List<Float>";
                
            case typeof VQueue("int"):
                return "Queue<int>";
            case typeof VQueue("float"):
                return "Queue<Float>";
            case typeof VQueue("String"):
                return "Queue<String>";
                
            case typeof VPQueue("int"):
                return "PriorityQueue<Integer>";
            case typeof VPQueue("String"):
                return "PriorityQueue<String>";
            case typeof VPQueue("float"):
                return "PriorityQueue<Float>";
                
            case typeof VDictionary("int", "int"):
                return "Dictionary<Integer, Integer>";
            case typeof VDictionary("int", "String"):
                return "Dictionary<Integer, String>";
            case typeof VDictionary("int", "bool"):
                return "Dictionary<Integer, Boolean>";
            case typeof VDictionary("int", "float"):
                return "Dictionary<Integer, Float>";
                
            case typeof VDictionary("String", "int"):
                return "Dictionary<String, Integer>";
            case typeof VDictionary("String", "String"):
                return "Dictionary<String, String>";
            case typeof VDictionary("String", "bool"):
                return "Dictionary<String, Boolean>";
            case typeof VDictionary("String", "float"):
                return "Dictionary<String, Float>";
                
            case typeof VDictionary("float", "int"):
                return "Dictionary<Float, Integer>";
            case typeof VDictionary("float", "String"):
                return "Dictionary<Float, String>";
            case typeof VDictionary("float", "bool"):
                return "Dictionary<Float, Boolean>";
            case typeof VDictionary("float", "float"):
                return "Dictionary<Float, Float>";
                
            case typeof VGraph():
                return "Graph";
            case typeof VWeightedGraph():
                return "WeightedGraph";
            case typeof VTree():
                return "Tree";
            default:
                return null
        }
    }
    
    
    
    Interpreter.prototype.evalMaths = function(root, env) {      
        console.log("root is:::::", root);
        if (['%', '+', '-', '*', '/', '**'].indexOf(root.value) < 0) {
            value = this.evalValue(root, env);
            return value;
        } else {
            if (root.value == "+") {
                if (root.first.jtype == "FLOAT_TYPE") {
                    if (root.second.jtype == "FLOAT_TYPE") {
                        return [parseFloat(root.first.value) + parseFloat(root.second.value), "float"];
                    }
                }
                return this.evalMaths(root.first, env) + this.evalMaths(root.second, env);
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
                } else {    
                    leftValue = this.evalMaths(root.first, env);
                    rightValue = this.evalMaths(root.second, env);
                }
                if (typeof leftValue === "String" || typeof rightValue === "String") {
                    env.throwError(root.linenum);
                    console.log("Incompatible types");
                    root.error("Incompatible types");
                } else {
                    switch (root.value) {
                        case "%":
                            return leftValue % rightValue;
                        case "-":
                            console.log(leftValue + "-" + rightValue);
                            return leftValue - rightValue;
                        case "*":
                            return leftValue * rightValue;
                        case "/":
                            return leftValue / rightValue;
                        /*
                        case "**":
                            return leftValue ** rightValue;
                        */
                    }
                }
            }
        }
    }
    
    Interpreter.prototype.evalPlusPlus = function(root, env) {
        var name = root.first.value;
        var index = env.getIndex(root.first.value);
        if (index >= 0){
            var value = env.getValue(name);
            if (value.length == 2 && value[1] == "float") {
                env.updateVariable(name, [value[0]+1, "float"], "Step", "new", root.linenum);
            } else {
                env.updateVariable(name, value+1, "Step", "new", root.linenum);
            }
        }
    
    }
    
    Interpreter.prototype.evalMinusMinus = function(root, env) {
        var name = root.first.value;
        var index = env.getIndex(root.first.value);
        if (index >= 0){
            var value = env.getValue(name);
            if (value.length == 2 && value[1] == "float") {
                env.updateVariable(name, [value[0]-1, "float"], "Step", "new", root.linenum);
            } else {
                env.updateVariable(name, value-1, "Step", "new", root.linenum);
            }
        }
    
    }
    
    Interpreter.prototype.evalPlusEqual = function(root, env) {
        var name = root.first.value;
        var index = env.getIndex(name);
        var adding = root.second.value;
        console.log("Want to add: ", root);
        if (adding.jtype != "INT_TYPE" || adding.jtype != "STRING_TYPE" || adding.jtype != "FLOAT_TYPE") {
            adding = this.evalValue(root.second, env);
        }
        
        if (adding.length == 2 && adding[1] == "float") {
            adding = adding[0];
        }
        if (index < 0) {
            env.throwError(root.linenum);
            console.log("Variable not declared");
            root.error("Variable not declared");
            //Throw error
        }
        var value = env.getValue(name);
        if (value.length == 2 && value[1] == "float") {
            console.log("ADDING: ", value[0], "and", adding);
            newVal = [value[0] + adding, "float"];
        } else {
            var newVal = value + adding;
        }
        env.updateVariable(name, newVal, "+=", "new", root.linenum);
    }
    
    Interpreter.prototype.evalMinusEqual = function(root, env) {
        var name = root.first.value;
        var index = env.getIndex(name);
        var subtracting = root.second.value;
        console.log("Want to add: ", root);
        if (subtracting.jtype != "INT_TYPE" || subtracting.jtype != "STRING_TYPE" || subtracting.jtype != "FLOAT_TYPE") {
            subtracting = this.evalValue(root.second, env);
        }
        if (subtracting.length == 2 && subtracting[1] == "float") {
            subtracting = subtracting[0];
        }
        if (index < 0) {
            env.throwError(root.linenum);
            console.log("Variable not declared");
            root.error("Variable not declared");
            //Throw error
        }
        var value = env.getValue(name);
        if (value.length == 2 && value[1] == "float") {
            newVal = [value[0] - subtracting, "float"];
        } else {
            var newVal = value - subtracting;
        }
        env.updateVariable(name, newVal, "-=", "new", root.linenum);
    }
    Interpreter.prototype.isActuallyADT = function(type) {
        var adt = ["int", "float", "String", "boolean"];
        if (adt.indexOf(type) >= 0) {
            return false;
        } else {
            return true;
        }
    }
    Interpreter.prototype.evalMethod = function(root, env) {
        var adt = root.Caller.value;
        console.log("Env is: ", env);
        var adtIndex = env.getIndex(adt);
        console.log("HERE: ", env.getVariables()[adtIndex]);
        var adtType = env.getVariables()[adtIndex].type;
        
        console.log("Adt type is: ", adtType);
        var adtCurValue = env.getVariables()[adtIndex].value;
        console.log(env.getVariables()[adtIndex]);
        console.log("ADT CURRENT VALUE IS: ", adtCurValue);
        var method = root.MethodName.value;
        var parameters = root.Arguments;
        var originADT = null;
        
        var isADT = this.isActuallyADT(adtType);
        if (!isADT) {
            env.throwError(root.linenum);
            root.error();
        
        }
        var adtMethods = this.findMethods(adtType);
        var paramCheck = this.checkParameters(adtType, method, parameters);
        var newValue, returnValue;
        var cloneParam = [];
        console.log("Evaluating the method: ", root);
        console.log("adtMethod: ", method);
        console.log("Adt methods are: ", adtMethods);
        console.log("Adt type: ", adtType);
        if (adtMethods.indexOf(method) < 0) {
            env.throwError(root.linenum);
            console.log("Invalid Method");
            root.error("Invalid method");
            //new InvalidMethod();
        }
        if (paramCheck != true) {
            console.log("Incorrect parameters");
            env.throwError(root.linenum);
            console.log("incorrect parameters");
            root.error("Incorrect parameters");
            //new IncorrectParameters();
        } else {
            if (parameters.length != 0) {
                console.log("PARAMETERS ARE: ", parameters);
                if (parameters[0].arity == "FunCall") {
                    originADT = parameters[0].Caller.value;
                }
                else if (env.getValue(parameters[parameters.length - 1].value) != null) {
                    originADT = parameters[parameters.length-1].value;
                }
                for (var i = 0; i < parameters.length; i++){
                    console.log("Parameter is: ", parameters[i]);
                    console.log("ENV2 IS: ", env);
                    var varValue = this.evalValue(parameters[i], env);
                    console.log("Value of parameter is: ", varValue);
                    console.log("VAR VALUE IS: ", varValue);
                    var cloneVar = {value:varValue};
                    cloneParam[i] = cloneVar;
                }
            }
            methodValue = this.doMethod(adtType, adtCurValue, method, cloneParam, env, root);
            console.log("returned value is *******: ", methodValue, "From method: ", method);
            returnValue = methodValue[0];
            
            newValue = methodValue[1];
            var valueType = methodValue[2];
            console.log("Return value is: ", newValue);
            console.log("THe parameters are: ", cloneParam);
            //console.log("Adding to method: ", cloneParam[0].value);
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
                case('getOutDegree'):
                case('removeVertex'):
                case('setDirected'):
                case('setRoot'):
                    console.log("Going to add: ", cloneParam);
                    if (cloneParam[0].value.length == 2 && cloneParam[0].value[1] == "float") {
                        method = method + "." + cloneParam[0].value[0];
                    } else {
                        method = method + "." + cloneParam[0].value;
                    }
                    console.log("method is: ", method);
                    break;
                case("add"):
                case("addVertex"):
                    if (adtType == "PriorityQueue<Integer>" || adtType == "PriorityQueue<String>"
                       || adtType == "Graph" || adtType == "WeightedGraph") {
                        method = method + "." + returnValue;
                        break;
                    }
                    if (parameters.length == 1) {
                        method = method + "." + adtCurValue.length;
                        break;
                    } else {
                        method = method + "." + cloneParam[0].value;
                        break;
                    }
                    break;
                case("remove"):
                    if (adtType == "PriorityQueue<Integer>" || adtType == "PriorityQueue<String>" || adtType == "PriorityQueue<Float>" 
                        || adtType == "Queue<String>" || adtType == "Queue<Integer>" || adtType == "Queue<Float>") {
                        method = method + "." + adtCurValue.length;
                        break;
                    } else if (adtType == "Dictionary<Float, String>" || adtType == "Dictionary<Float, Integer>" || adtType == "Dictionary<Float, Float>") {
                        method = method + "." + cloneParam[0].value[0];
                        break;
                    } else {
                        method = method + "." + cloneParam[0].value;
                        break;
                    }
                case("addEdge"):
                case("removeEdge"):
                case("hasEdge"):
                case("getChild"):
                case("put"):
                case("removeChild"):
                    method = method + "." + cloneParam[0].value + "." + cloneParam[1].value;
                    break;
                case("addChild"):
                    if (parameters.length == 2) {
                        method = method + '.' + cloneParam[0].value + "." + cloneParam[1].value + "." + adtCurValue.length;
                    } else if (parameters.length == 3) {
                        method = method + '.' + cloneParam[0].value + "." + cloneParam[1].value + "." + cloneParam[2].value;
                    
                    }
            }
            
            env.updateVariable(adt, newValue, method, originADT, root.linenum, adtType);
        }
        console.log("IN PERFORM METHOD: ", valueType);
        return [returnValue, newValue, method, valueType];
    }
    
    Interpreter.prototype.findMethods = function(type) {
        var y;
        switch(type) {
            case "Stack<Integer>":
            case "Stack<String>":
            case "Stack<Float>":
                y = new VStack("String");
                return y.listMethods();
                break;
            case "List<Integer>":
            case "List<String>":
            case "List<Float>":
                y = new VList("int");
                return y.listMethods();
                break;
            case "Queue<Integer>":
            case "Queue<String>":
            case "Queue<Float>":
                y = new VQueue("int");
                return y.listMethods();
                break;
            case "PriorityQueue<Integer>":
            case "PriorityQueue<String>":
            case "PriorityQueue<Float>":
                y = new VPQueue("int");
                return y.listMethods();
                break;
            case "Dictionary<Integer, Integer>":
            case "Dictionary<Integer, String>":
            case "Dictionary<Integer, Boolean>":
            case "Dictionary<Integer, Float>":
            case "Dictionary<String, Integer>":
            case "Dictionary<String, String>":
            case "Dictionary<String, Boolean>":
            case "Dictionary<String, Float>":
            case "Dictionary<Float, Integer>":
            case "Dictionary<Float, String>":
            case "Dictionary<Float, Boolean>":
            case "Dictionary<Float, Float>":
                console.log("111111111111");
                y = new VDictionary("int");
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
    
    Interpreter.prototype.checkParameters = function(type, method, parameters) {
        var y;
        switch(type) {
            case "Stack<Integer>":
            case "Stack<String>":
            case "Stack<Float>":
                y = new VStack("String");
                return y.checkParameters(method, parameters);
                break;
            case "List<Integer>":
            case "List<String>":
            case "List<Float>":
                y = new VList("String");
                return y.checkParameters(method, parameters);
                break;
            case "Queue<Integer>":
            case "Queue<String>":
            case "Queue<Float>":
                y = new VQueue("String");
                return y.checkParameters(method, parameters);
                break;
            case "PriorityQueue<Integer>":
            case "PriorityQueue<String>":
            case "PriorityQueue<Float>":
                y = new VPQueue("String");
                return y.checkParameters(method, parameters);
                break;
            case "Dictionary<Integer, Integer>":
            case "Dictionary<Integer, String>":
            case "Dictionary<Integer, Boolean>":
            case "Dictionary<Integer, Float>":
            case "Dictionary<String, Integer>":
            case "Dictionary<String, String>":
            case "Dictionary<String, Boolean>":
            case "Dictionary<String, Float>":
            case "Dictionary<Float, Integer>":
            case "Dictionary<Float, String>":
            case "Dictionary<Float, Boolean>":
            case "Dictionary<Float, Float>":
                console.log("2222222222222");
                y = new VDictionary("String");
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
    
    Interpreter.prototype.doMethod = function(type, origValue, method, parameters, env, root) {
        var y;
        var newV, returnV, value;
        switch(type) {
            case "Stack<Integer>":
                y = new VStack("int");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "Stack<String>":
                y = new VStack("String");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "Stack<Float>":
                y = new VStack("float");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "List<Integer>":
                y = new VList("int");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "List<String>":
                y = new VList("String");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "List<Float>":
                y = new VList("float");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "Queue<Integer>":
                y = new VQueue("int");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "Queue<String>":
                y = new VQueue("String");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "Queue<Float>":
                y = new VQueue("float");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "PriorityQueue<Integer>":
                y = new VPQueue("int");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "PriorityQueue<String>":
                y = new VPQueue("String");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "PriorityQueue<Float>":
                y = new VPQueue("float");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "Dictionary<Integer, Integer>":
                console.log("333333333");
                y = new VDictionary("int", "int");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "Dictionary<Integer, String>":
                console.log("333333333");
                y = new VDictionary("int", "String");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "Dictionary<Integer, Boolean>":
                console.log("333333333");
                y = new VDictionary("int", "bool");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "Dictionary<Integer, Float>":
                console.log("333333333");
                y = new VDictionary("int", "float");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "Dictionary<String, Integer>":
                console.log("333333333");
                y = new VDictionary("String", "int");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "Dictionary<String, String>":
                console.log("333333333");
                y = new VDictionary("String", "String");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "Dictionary<String, Boolean>":
                console.log("333333333");
                y = new VDictionary("String", "bool");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "Dictionary<String, Float>":
                console.log("333333333");
                y = new VDictionary("String", "float");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "Dictionary<Float, Integer>":
                console.log("333333333");
                y = new VDictionary("float", "int");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "Dictionary<Float, String>":
                console.log("333333333");
                y = new VDictionary("float", "String");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "Dictionary<Float, Boolean>":
                console.log("333333333");
                y = new VDictionary("float", "bool");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "Dictionary<Float, Float>":
                console.log("333333333");
                y = new VDictionary("float", "float");
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "Graph":
                y = new VGraph();
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "WeightedGraph":
                y = new VWeightedGraph();
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            case "Tree":
                y = new VTree();
                value = y.performMethod(type, origValue, method, parameters, env, root);
                return value;
                break;
            default:
                env.throwError(root.linenum);
                root.error();
        }
    }
    
    Interpreter.prototype.evalStep = function(root, env) {
        if (root.value == "++") {
            this.evalPlusPlus(root, env);
        } else if (root.value == "--") {
            this.evalMinusMinus(root, env);
        }
    }
    
    
    // Generate list of tokens and store it in this.TokenList
    Interpreter.prototype.makeTokenList = function(env) {
        var t = new Tokenizer();
        var tokens = [];
        var parenLevel = 0;
        var braceLevel = 0;

        t.input(this.code);

        var currentToken = t.token();
        console.log("Returning current token: ", currentToken);
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
            env.throwError(1);
            this.Error = "Syntax error: Missing close parenthesis";
        }
        else if (parenLevel < 0) {
            env.throwError(1);
            this.Error = "Syntax error: Missing open parenthesis";
        }
        else if (braceLevel > 0) {
            env.throwError(1);
            this.Error = "Syntax error: Missing close brace";
        }
        else if (braceLevel < 0) {
            env.throwError(1);
            this.Error = "Syntax error: Missing open brace";
        }

        this.TokenList = tokens;
    }

    // Return this.TokenList as a string
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
    
    Interpreter.prototype.makeParseTree = function() {
        this.makeTokenList();
        var source = this.TokenList;
        var parse = make_parse();
        var tree = parse(source);
        this.ParseTree = tree;
        
    }
});