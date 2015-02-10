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
        } else if (rootType == "Initialization") {
            this.evalAssignment(block, env);
        } else if (rootType == "FunCall") {
            this.evalMethod(block, env);
        }
    }

    Interpreter.prototype.evalValue = function(root, env) {
        console.log("Evaling value of: ", root);
        if (root.arity == "FunCall") {
            
            return this.evalMethod(root, env)[0];
        }
        if (root.arity != "name") {
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
                    return this.evalMaths(root);
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
            if (root.value == "Stack<Integer>") {
                valueRoot = root.second
                value = root.first
            } else {
                valueRoot = root.third;
            }
        }
        else {
            variable = root.first.value;
            valueRoot = root.second;
        }
                
        // Get the value of the righthand side of the equals sign
        if (valueRoot.arity == "FunCall") {
            var methodValue = this.evalMethod(valueRoot, env);
            returnedValue = methodValue[1];
            value = methodValue[0];
            originMethod = valueRoot.MethodName.value;
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
            if (root.first == "Stack<Integer>") {
                env.createVariable("Stack<Integer>", root.second.value, [], "new", originADT, root.linenum); 
            } else if (root.first == "Stack<String>") {
                env.createVariable("Stack<String>", root.second.value, [], "new", originADT, root.linenum);
            } else if (root.first == "List<Integer>") {
                console.log("Root is: ", root);
                env.createVariable("List<Integer>", root.second.value, [], "new", originADT, root.linenum);
            } else if (root.first == "List<String>") {
                env.createVariable("List<String>", root.second.value, [], "new", originADT, root.linenum);
            } else if (root.first == "Queue<Integer>") {
                env.createVariable("Queue<Integer>", root.second.value, [], "new", originADT, root.linenum);
            } else if (root.first == "Queue<String>") {
                env.createVariable("Queue<String>", root.second.value, [], "new", originADT, root.linenum);
            } else if (root.first == "Dictionary") {
                env.createVariable("Dictionary", root.second.value, {}, "new", originADT, root.linenum);
            } else if (root.first == "PriorityQueue<Integer>") {
                env.createVariable("PriorityQueue<Integer>", root.second.value, [], "new", originADT, root.linenum);
            } else if (root.first == "PriorityQueue<String>") {
                env.createVariable("PriorityQueue<String>", root.second.value, [], "new", originADT, root.linenum);
            } else if (root.first == "Graph") {
                env.createVariable("Graph", root.second.value, [], "new", originADT, root.linenum);
            } else {
                var type = this.checkType(value);
                if (root.first != type){
                 console.log("INCOMPATIBLE TYPES!!");   
                }
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
            var variable = this.evalValue(root.value);
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
            case typeof VDictionary():
                return "Dictionary";
            case typeof VGraph():
                return "Graph";
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
    
    Interpreter.prototype.evalMethod = function(root, env) {
        var adt = root.Caller.value;
        var adtIndex = env.getIndex(adt);
        console.log("HERE: ", env.getVariables()[adtIndex]);
        var adtType = env.getVariables()[adtIndex].type;
        var adtCurValue = env.getVariables()[adtIndex].value;
        var method = root.MethodName.value;
        var parameters = root.Arguments;
        var originADT = null;
        
        
        var adtMethods = this.findMethods(adtType);
        var paramCheck = this.checkParameters(adtType, method, parameters);
        var newValue, returnValue;
        var cloneParam = [];
        console.log("Evaluating the method: ", root);
        console.log("adtMethod: ", method);
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
            if (env.getValue(parameters[parameters.length - 1].value) != null) {
                originADT = parameters[parameters.length-1].value;
            }
            for (var i = 0; i < parameters.length; i++){
                console.log("Parameter is: ", parameters[i]);
                var varValue = this.evalValue(parameters[i], env);
                console.log("Value of parameter is: ", varValue);
                var cloneVar = {value:varValue};
                cloneParam[i] = cloneVar;
                
                
            }
            }
            methodValue = this.doMethod(adtType, adtCurValue, method, cloneParam);
            returnValue = methodValue[0];
            
            newValue = methodValue[1];
            console.log("Return value is: ", newValue);
            console.log("THe parameters are: ", cloneParam);
            //console.log("Adding to method: ", cloneParam[0].value);
            switch(method) {
                case("set"):
                case("remove"):
                case("get"):
                case("search"):
                case("contains"):
                case("indexOf"):
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
            }
            
            env.updateVariable(adt, newValue, method, originADT, root.linenum);
        }
        return [returnValue, newValue];
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
            case "Dictionary":
                y = new VDictionary();
                return y.listMethods();
                break;
            case "Graph":
                y = new VGraph();
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
            case "Dictionary":
                y = new VDictionary();
                return y.checkParameters(method, parameters);
            case "Graph":
                y = new VGraph();
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
            case "Dictionary":
                y = new VDictionary();
                value = y.performMethod(type, origValue, method, parameters);
                return value;
            case "Graph":
                y = new VGraph();
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