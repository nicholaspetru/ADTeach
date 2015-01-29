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
        //this.symbolTable = f;
        this.eval(tree, f);
    }
    
    // Evaluates an array of statements or a single statement
    Interpreter.prototype.eval = function(arrayOfBlocks, env) {
        console.log(typeof arrayOfBlocks);
        var count = 0;
        if (typeof arrayOfBlocks[count] === "undefined") {
            console.log("single statement");
            var block = arrayOfBlocks;
            var blockType = block.arity;
            console.log("blockType: " + blockType);
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
            console.log(typeof arrayOfBlocks[count]);
            while (typeof arrayOfBlocks[count] != "undefined") {
                var block = arrayOfBlocks[count];
                var blockType = block.arity;
                console.log("blockType: " + blockType);
            
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
                //console.log("count: " + count);
            }
        }
    }
    
    Interpreter.prototype.evalSemiColonBlock = function(block, env) {
        console.log("========= evalSemiColonBlock =======");

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
        else {
            console.log("is this called?");
        }
    }

    Interpreter.prototype.evalValue = function(root, env) {
        console.log("----- evalValue " + root.value + " -----");
        if (root.arity != "name") {
            console.log("jtype: " + root.jtype);
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
            }
        } else {
            var val = env.getValue(root.value);
            var valType = env.getType(root.value);
            console.log(val);
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
        console.log("========= evalWhileBlock =======");
        var condition = block.Test;
        
        var isTrue = this.evalCondition(condition, env);
        console.log(isTrue);
        while (isTrue == true) {
            var body = block.Body;
            var condition2 = block.Test;
            console.log("start while");

            console.log(isTrue);
            this.eval(body, env);
            console.log("PAST EVAL");
            isTrue = this.evalCondition(condition2, env);
            console.log("end while");
        }
        //console.log(this.symbolTable.getValue("x"));
        //console.log(this.symbolTable.getValue("y"));
    }
    
    Interpreter.prototype.evalAssignment = function(root, env) {
        console.log("========== evalAssignment ===========");
        console.log("root.arity: " + root.arity);
        console.log(root);
        var valueRoot, value;
        var origin = "new";
        console.log("Here here here", root);
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
        
        console.log("now here: ", valueRoot);
        

        // Get the value of the righthand side of the equals sign
        if (valueRoot.arity == "FunCall") {
            value = this.evalMethod(valueRoot, env);
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

        else if (valueRoot.value == "new") {
                //Create the new ADT
        }
        
        console.log("value: " + value);
        /*
        var variables = env.getVariables();
        if (root.first.value == "init") {
            if (variables.indexOf(root.first.second.value) >= 0) {
                console.log("Already initialized");
                //AlreadyInitialized(root.first.right.value);
            } else {
                //Check dictionaries in JS
                variables.get(root.first.second.value) = [root.first.first.value, value];
            }
        } else {
            if (variables.indexOf(root.first.value) >= 0) {
                if (variables.get(root.first.value).get(0) == this.checkType(value)) {
                    variables.get(root.first.value).get(1) = value;
                } else {
                    console.log("Incompatible Types");
                    //new IncompatibleTypes();
                }
            } else {
                console.log("Not been initialized");
                //new AlreadyInitialized();
            }
        }

        */
        
        if (root.arity === "Initialization") {
            if (root.value == "Stack<Integer>") {
                env.createVariable("Stack<Integer>", value, [], "new"); 
            }
            //this.symbolTable.newVariable(root.first, root.second.value, value);
            //this.symbolTable.getValue(root.second.value);
            env.createVariable(root.first, root.second.value, value, origin);
        }
        else {
            //var type = checkType(value);

            //var s = this.symbolTable.updateVariable("int", root.first.value, value);
            //this.symbolTable = this.symbolTable.table;
            //console.log(this.symbolTable.getValue(root.first.value));
            env.updateVariable(root.first.value, value, origin);
        }
    }
    Interpreter.prototype.evalCondition = function(root, env) {
        console.log("========evalCondition========");
        console.log(root.value);
        
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
        }
        
        if (root.arity === "binary") {

        
            var leftValue = this.evalValue(root.first, env);
            var rightValue = this.evalValue(root.second, env);
        
            console.log(root.first);
            console.log("condition: " + leftValue + " " + root.value + " " + rightValue);

            console.log(root.value);
            switch (root.value) {
                case "<":
                    return (leftValue < rightValue);
                    break;
                case ">":
                    return (leftValue > rightValue);
                    break;
                case "==":
                    console.log("DID IT EVEN GET HERE THO?????????????????");
                    console.log(leftValue === rightValue);
                    console.log("......");
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
        switch (type(value)) {
            case type(1):
                return "int";
            case type(1.0):
                return "float";
            case type("1"):
                return "String";
            case type(true):
                return "Boolean";
            case type(VStack("int")):
                return "Stack<int>";
            case type(VStack("float")):
                return "Stack<float>";
            case type(VStack("String")):
                return "Stack<String>";
            case type(VQueue("int")):
                return "Queue<int>";
            case type(VQueue("float")):
                return "Queue<float>";
            case type(VQueue("String")):
                return "Queue<String>";
            default:
                return null
        }
    }
    
    Interpreter.prototype.evalMaths = function(root, env) {
        console.log("============= evalMaths ==========");
        if (['%', '+', '-', '*', '/', '**'].indexOf(root.value) < 0) {
            return this.evalValue(root, env);
        } else {
            if (root.value == "+") {
                console.log("plus");
                return this.evalMaths(root.first, env) + this.evalMaths(root.second, env);
            } else {
                var leftValue = this.evalMaths(root.first, env);
                var rightValue = this.evalMaths(root.second, env);
                if (typeof leftValue === "String" || typeof rightValue === "String") {
                    console.log("Incompatible types");
                    //new IncompatibleTypes();
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
        console.log("============= evalPlusPlus ==========");
        var name = root.first.value;
        var index = env.getIndex(root.first.value);
        if (index >= 0){
            var value = env.getValue(name);
            console.log(name + value + "new");
            env.updateVariable(name, value+1, "new");
        }
    
    }
    
    Interpreter.prototype.evalMinusMinus = function(root, env) {
        console.log("============= evalPlusPlus ==========");
        var name = root.first.value;
        var index = env.getIndex(root.first.value);
        if (index >= 0){
            var value = env.getValue(name);
            console.log(name + value + "new");
            env.updateVariable(name, value-1, "new");
        }
    
    }
    
    Interpreter.prototype.evalMethod = function(root, env) {
        var adt = root.Caller.value;
        var adtIndex = env.getIndex(adt);
        var adtType = env.getVariables()[adtIndex].type;
        var method = root.MethodName.value;
        var parameters = root.Arguments;

        console.log("***");
        console.log(adt);
        console.log(typeof adtType);
        console.log(method);
        console.log(parameters);
        
        if (adtType == "String<Integer>") {
            adtType = typeof VStack;
        }
        
        console.log(adtType);
        console.log(adtType.listMethods());
        if (adtType.listMethods().indexOf(method) < 0) {
            console.log("Invalid Method");
            //new InvalidMethod();
        }
        if (adtType.checkParameters(method, parameters) != true) {
            console.log("incorrect parameters");
            //new IncorrectParameters();
        } else {
            adtType.performMethod(method, parameters);
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
        //console.log(this.TokenList.length);

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