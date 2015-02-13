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
        this.code = code;
        this.makeTokenList();
        var source = this.TokenList;
        var parse = make_parse();
        var tree = parse(source);
        var f = new Environment(null, vh);
        this.eval(tree, f);
    }
    
    // Evaluates an array of statements or a single statement
    Interpreter.prototype.eval = function(arrayOfBlocks, env) {
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
            console.log("Where I wanna be");
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
            console.log("ENV1 IS: ", env);
            return this.evalMethod(root, env)[0];
        }
        if (root.arity != "name") {
            console.log("NOT GOING TO MATH: ", root);
            switch(root.jtype) {
                case 'INT_TYPE':
                    return parseInt(root.value);
                    break;
                case 'FLOAT_TYPE':
                    return parseFloat(root.value);
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
            var val = env.getValue(root.value);
            var valType = env.getType(root.value);
            if (val === "no value") {
                console.log("not in env");
                //new UnidentifiedVariable();
            } 

            else if (valType === "no type") {
                console.log("variable " + root.value + " is in env, but does not have a type associated with it");
            }

            else {
                switch(valType) {
                    case "int":
                        return parseInt(val);
                        break;
                    case "float":
                        return parseFloat(val);
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
                    default:
                        console.log("variable " + root.value + " was initialized with an invalid type...or alternatively, it references an ADT and we haven't implemented that here yet.");
                        break;
                }
            }
        }
    }

    Interpreter.prototype.evalWhileBlock = function(block, env) {
        var condition = block.Test;
        
        var isTrue = this.evalCondition(condition, env);
        while (isTrue == true) {
            var body = block.Body;
            var condition2 = block.Test;

            this.eval(body, env);
            isTrue = this.evalCondition(condition2, env);
        }
    }
    
    Interpreter.prototype.evalAssignment = function(root, env) {
        var valueRoot, value, returnedValue;
        var originMethod = "new";
        var originADT = "";
        
        if (root.arity === "Initialization") {
            console.log("ROOT IS: ", root);
            if (root.second.arity == "FunCall") {
                valueRoot = root.second;
                //valueRoot = root.second
                //value = root.first
            } else {
                valueRoot = root.third;
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
            originMethod = methodValue[2];
            //originMethod = valueRoot.MethodName.value;
            originADT = valueRoot.Caller.value;
            //ADD ORIGIN
        }
        
        //Literals: ints, floats, strings, etc.
        if (valueRoot.arity == "literal" || valueRoot.arity == "name") {
            value = this.evalValue(valueRoot, env);
        }
        else if (valueRoot.value == "++" || valueRoot.value == "--") {
            value = this.evalStep(valueRoot, env);
        
        }
        
        else if (['%', '+', '-', '*', '/', '**'].indexOf(valueRoot.value) >= 0) {
                value = this.evalMaths(valueRoot, env);
                
        } 

        
        if (root.arity === "Initialization") {
            if (root.third.arity != "FunCall") {
                var typeString = root.first;
                switch(root.first) {
                    case "Stack<Integer>":
                    case "Stack<String>":
                    case "List<Integer>":
                    case "List<String>":
                    case "Queue<Integer>":
                    case "Queue<String>":
                    case "PriorityQueue<Integer>":
                    case "PriorityQueue<String>":
                    case "Tree":
                        env.createVariable(typeString, root.second.value, [], "new", originADT, root.linenum);
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
                        env.createVariable(typeString, root.second.value, {}, "new", originADT, root.linenum);
                        break;
                    case "Graph":
                        env.createVariable("Graph", root.second.value, [[], "false"], "new", originADT, root.linenum);
                        break;
                    case "WeightedGraph":
                        env.createVariable("WeightedGraph", root.second.value, [[], "false"], "new", originADT, root.linenum);
                        break;
                    
                    default:
                        var type = this.checkType(value);
                        if (root.first != type){
                            console.log("INCOMPATIBLE TYPES!!");   
                        }
                        env.createVariable(root.first, root.second.value, value, originMethod, originADT, root.linenum);
                }
            console.log("HERE AND ROOT IS: ", root);
            } else {
                console.log("Creating variable: ", root.first);
                console.log("Value is: ", value);
                //returnValue = value[0];
                //method = value[2];
                //originMethod = method;
                env.createVariable(root.first, root.second.value, value, originMethod, originADT, root.linenum);
            }
        }
        else {
            var type = this.checkType(value);
            if (root.first != type){
             console.log("INCOMPATIBLE TYPES!!");   
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
                console.log("No literals");
            } else {
                return variable;
            }
        } else if (root.arity == "FunCall") {
            return this.evalMethod(root, env);
        }
        
        if (root.arity === "binary") {
        
            var leftValue = this.evalValue(root.first, env);
            var rightValue = this.evalValue(root.second, env);
        
            switch (root.value) {
                case "<":
                    return (leftValue < rightValue);
                    break;
                case ">":
                    return (leftValue > rightValue);
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
        switch (typeof value) {
            case typeof 1:
                return "int";
            case typeof 1.0:
                return "float";
            case typeof "1":
                return "String";
            case typeof true:
                return "Boolean";
                
            case typeof VStack("int"):
                return "Stack<int>";
            case typeof VStack("float"):
                return "Stack<float>";
            case typeof VStack("String"):
                return "Stack<String>";
                
            case typeof VList("int"):
                return "List<Integer>";
            case typeof VList("String"):
                return "List<String>";
                
            case typeof VQueue("int"):
                return "Queue<int>";
            case typeof VQueue("float"):
                return "Queue<float>";
            case typeof VQueue("String"):
                return "Queue<String>";
                
            case typeof VPQueue("int"):
                return "PriorityQueue<Integer>";
            case typeof VPQueue("String"):
                return "PriorityQueue<String>";
                
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
        if (['%', '+', '-', '*', '/', '**'].indexOf(root.value) < 0) {
            return this.evalValue(root, env);
        } else {
            if (root.value == "+") {
                return this.evalMaths(root.first, env) + this.evalMaths(root.second, env);
            } else {
                var leftValue = this.evalMaths(root.first, env);
                var rightValue = this.evalMaths(root.second, env);
                if (typeof leftValue === "String" || typeof rightValue === "String") {
                    console.log("Incompatible types");
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
            env.updateVariable(name, value+1, "Step", "new", root.linenum);
        }
    
    }
    
    Interpreter.prototype.evalMinusMinus = function(root, env) {
        var name = root.first.value;
        var index = env.getIndex(root.first.value);
        if (index >= 0){
            var value = env.getValue(name);
            env.updateVariable(name, value-1, "Step", "new", root.linenum);
        }
    
    }
    
    Interpreter.prototype.evalPlusEqual = function(root, env) {
        var name = root.first.value;
        var index = env.getIndex(name);
        var adding = root.second.value;
        console.log("Want to add: ", root);
        if (adding.jtype != "INT_TYPE" || adding.jtype != "STRING_TYPE") {
            adding = this.evalValue(root.second, env);
        }
        if (index < 0) {
            console.log("Variable not declared");
            //Throw error
        }
        var value = env.getValue(name);
        var newVal = value + adding;
        env.updateVariable(name, newVal, "+=", "new", root.linenum);
    }
    
    Interpreter.prototype.evalMinusEqual = function(root, env) {
        var name = root.first.value;
        var index = env.getIndex(name);
        var subtracting = root.second.value;
        console.log("Want to add: ", root);
        if (subtracting.jtype != "INT_TYPE" || subtracting.jtype != "STRING_TYPE") {
            subtracting = this.evalValue(root.second, env);
        }
        if (index < 0) {
            console.log("Variable not declared");
            //Throw error
        }
        var value = env.getValue(name);
        var newVal = value - subtracting;
        env.updateVariable(name, newVal, "-=", "new", root.linenum);
    }
    
    Interpreter.prototype.evalMethod = function(root, env) {
        var adt = root.Caller.value;
        console.log("Env is: ", env);
        var adtIndex = env.getIndex(adt);
        console.log("HERE: ", env.getVariables()[adtIndex]);
        var adtType = env.getVariables()[adtIndex].type;
        var adtCurValue = env.getVariables()[adtIndex].value;
        console.log(env.getVariables()[adtIndex]);
        console.log("ADT CURRENT VALUE IS: ", adtCurValue);
        var method = root.MethodName.value;
        var parameters = root.Arguments;
        var originADT = null;
        
        
        var adtMethods = this.findMethods(adtType);
        var paramCheck = this.checkParameters(adtType, method, parameters);
        var newValue, returnValue;
        var cloneParam = [];
        console.log("Evaluating the method: ", root);
        console.log("adtMethod: ", method);
        console.log("Adt methods are: ", adtMethods);
        console.log("Adt type: ", adtType);
        if (adtMethods.indexOf(method) < 0) {
            console.log("Invalid Method");
            //new InvalidMethod();
        }
        if (paramCheck != true) {
            console.log("incorrect parameters");
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
            methodValue = this.doMethod(adtType, adtCurValue, method, cloneParam);
            console.log("returned value is *******: ", methodValue, "From method: ", method);
            returnValue = methodValue[0];
            
            newValue = methodValue[1];
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
                    console.log("Going to add: ", cloneParam);
                    method = method + "." + cloneParam[0].value;
                    console.log("method is: ", method);
                    break;
                case("add"):
                    if (adtType == "PriorityQueue<Integer>" || adtType == "PriorityQueue<String>") {
                        method = method + "." + returnValue;
                        break;
                    }
                    if (parameters.length == 1) {
                        method = method + "." + adtCurValue.length;
                    } else {
                        method = method + "." + cloneParam[0].value;
                    }
                    break;
                case("remove"):
                    if (adtType == "PriorityQueue<Integer>" || adtType == "PriorityQueue<String>" || 
                        adtType == "Queue<String>" || adtType == "Queue<Integer>") {
                        method = method + "." + adtCurValue.length;
                    } else {
                        method = method + "." + cloneParam[0].value;
                    }
            }
            
            env.updateVariable(adt, newValue, method, originADT, root.linenum);
        }
        return [returnValue, newValue, method];
    }
    
    Interpreter.prototype.findMethods = function(type) {
        var y;
        switch(type) {
            case "Stack<Integer>":
            case "Stack<String>":
                y = new VStack("String");
                return y.listMethods();
                break;
            case "List<Integer>":
            case "List<String>":
                y = new VList("int");
                return y.listMethods();
                break;
            case "Queue<Integer>":
            case "Queue<String>":
                y = new VQueue("int");
                return y.listMethods();
                break;
            case "PriorityQueue<Integer>":
            case "PriorityQueue<String>":
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
                y = new VStack("String");
                return y.checkParameters(method, parameters);
                break;
            case "List<Integer>":
            case "List<String>":
                y = new VList("String");
                return y.checkParameters(method, parameters);
                break;
            case "Queue<Integer>":
            case "Queue<String>":
                y = new VQueue("String");
                return y.checkParameters(method, parameters);
            case "PriorityQueue<Integer>":
            case "PriorityQueue<String>":
                y = new VPQueue("String");
                return y.checkParameters(method, parameters);
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
                y = new VDictionary("String");
                return y.checkParameters(method, parameters);
            case "Graph":
                y = new VGraph();
                return y.checkParameters(method, parameters);
            case "WeightedGraph":
                y = new VWeightedGraph();
                return y.checkParameters(method, parameters);
            case "Tree":
                y = new VTree();
                return y.checkParameters(method, parameters);
        }
    }
    
    Interpreter.prototype.doMethod = function(type, origValue, method, parameters) {
        var y;
        var newV, returnV, value;
        switch(type) {
            case "Stack<Integer>":
                y = new VStack("int");
                value = y.performMethod(type, origValue, method, parameters);
                return value;
                break;
            case "Stack<String>":
                y = new VStack("String");
                value = y.performMethod(type, origValue, method, parameters);
                return value;
                break;
            case "List<Integer>":
                y = new VList("int");
                value = y.performMethod(type, origValue, method, parameters);
                return value;
                break;
            case "List<String>":
                y = new VList("String");
                value = y.performMethod(type, origValue, method, parameters);
                return value;
                break;
            case "Queue<Integer>":
                console.log("PERFORMING METHOD: ", method);
                y = new VQueue("int");
                value = y.performMethod(type, origValue, method, parameters);
                return value;
            case "Queue<String>":
                y = new VQueue("String");
                value = y.performMethod(type, origValue, method, parameters);
                return value;
            case "PriorityQueue<Integer>":
                y = new VPQueue("int");
                value = y.performMethod(type, origValue, method, parameters);
                return value;
            case "PriorityQueue<String>":
                y = new VPQueue("String");
                value = y.performMethod(type, origValue, method, parameters);
                return value;
            case "Dictionary<Integer, Integer>":
                y = new VDictionary("int", "int");
                value = y.performMethod(type, origValue, method, parameters);
                return value;
            case "Dictionary<Integer, String>":
                y = new VDictionary("int", "String");
                value = y.performMethod(type, origValue, method, parameters);
                return value;
            case "Dictionary<Integer, Boolean>":
                y = new VDictionary("int", "bool");
                value = y.performMethod(type, origValue, method, parameters);
                return value;
            case "Dictionary<Integer, Float>":
                y = new VDictionary("int", "float");
                value = y.performMethod(type, origValue, method, parameters);
                return value;
            case "Dictionary<String, Integer>":
                y = new VDictionary("String", "int");
                value = y.performMethod(type, origValue, method, parameters);
                return value;
            case "Dictionary<String, String>":
                y = new VDictionary("String", "String");
                value = y.performMethod(type, origValue, method, parameters);
                return value;
            case "Dictionary<String, Boolean>":
                y = new VDictionary("String", "bool");
                value = y.performMethod(type, origValue, method, parameters);
                return value;
            case "Dictionary<String, Float>":
                y = new VDictionary("String", "float");
                value = y.performMethod(type, origValue, method, parameters);
                return value;
            case "Dictionary<Float, Integer>":
                y = new VDictionary("float", "int");
                value = y.performMethod(type, origValue, method, parameters);
                return value;
            case "Dictionary<Float, String>":
                y = new VDictionary("float", "String");
                value = y.performMethod(type, origValue, method, parameters);
                return value;
            case "Dictionary<Float, Boolean>":
                y = new VDictionary("float", "bool");
                value = y.performMethod(type, origValue, method, parameters);
                return value;
            case "Dictionary<Float, Float>":
                y = new VDictionary("float", "float");
                value = y.performMethod(type, origValue, method, parameters);
                return value;
            case "Graph":
                y = new VGraph();
                value = y.performMethod(type, origValue, method, parameters);
                return value;
            case "WeightedGraph":
                y = new VWeightedGraph();
                value = y.performMethod(type, origValue, method, parameters);
                return value;
            case "Tree":
                y = new VTree();
                value = y.performMethod(type, origValue, method, parameters);
                return value;
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
    Interpreter.prototype.makeTokenList = function() {
        var t = new Tokenizer();
        var tokens = [];
        var parenLevel = 0;
        var braceLevel = 0;

        t.input(this.code);

        var currentToken = t.token();
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

            tokens.push(currentToken);
            currentToken = t.token();
        }

        if (parenLevel > 0) {
            this.Error = "Syntax error: Missing close parenthesis";
        }
        else if (parenLevel < 0) {
            this.Error = "Syntax error: Missing open parenthesis";
        }
        else if (braceLevel > 0) {
            this.Error = "Syntax error: Missing close brace";
        }
        else if (braceLevel < 0) {
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