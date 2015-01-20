/*
* interpeter.js
*
*
*/

$(document).ready(function () {
    
    Interpreter = function(code){
        this.symbolTable = null;
        this.code = code;
        this.TokenList = undefined;
        this.NodeList = null;
        this.ParseTree = undefined;
        this.Error = null;
        this.env = undefined;
        return this;
    }
    Interpreter.prototype.interpret = function() {
        this.makeTokenList();
        var source = this.TokenList;
        var parse = make_parse();
        var tree = parse(source);
        //var f = new Environment(null);
        //this.env = f;
        var f = new SymbolTable();
        this.eval(tree,f);
    }

    Interpreter.prototype.eval = function(arrayOfBlocks, env) {
        var count = 0;
        console.log(arrayOfBlocks);
        while (arrayOfBlocks !== undefined) {
            var block = arrayOfBlocks.shift();
            console.log("block: " + block);
            var blockType = block.arity;
            console.log(blockType);
            
            switch (blockType) {
                case "FOR_BLOCK":
                    this.evalForBlock(block, env);
                    break;
                case "IF_BLOCK":
                    this.evalIfBlock(block, env);
                    break;
                case "WHILE_BLOCK":
                    this.evalWhileBlock(block, this.env);
                    break;
                default:
                    this.evalSemiColonBlock(block, env);
            }
            
            count += 1;
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
    }

    Interpreter.prototype.evalValue = function(root, env) {
        console.log("----- evalValue " + root.value + " -----");
        if (root.arity != "name") {
            console.log(parseInt(root.value));
            return parseInt(root.value);
        } else {
            var val = env.getValue(root.value);
            console.log(val);
            if (val === "no value") {
                console.log("not in env");
                //new UnidentifiedVariable();
            } else {
                // SPECIFIC
                return parseInt(val);
            }
        }
    }

    Interpreter.prototype.evalWhileBlock = function(block, env) {
        console.log("========= evalWhileBlock =======");
        env = this.env;
        var condition = block.Test;
        var body = block.Body;
        
        var isTrue = this.evalCondition(condition, env);
        console.log(isTrue);
        
        while (isTrue == true) {
            this.eval(body, env);
            isTrue = this.evalCondition(condition, env);
        }
    }
    
    Interpreter.prototype.evalAssignment = function(root, env) {
        console.log("========== evalAssignment ===========");
        console.log("root.arity: " + root.arity);
        console.log(root);
        var valueRoot, value;

        if (root.arity === "Initialization") {
            valueRoot = root.third;
        }
        else {
            variable = root.first.value;
            valueRoot = root.second;
        }
        console.log(valueRoot);
        

        // Get the value of the righthand side of the equals sign
        if (valueRoot.arity == "FunCall") {
            value = this.evalMethod(valueRoot, env);
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
            env.newVariable(root.first, root.second.value, value);
            this.env = env;
        }
        else {
            //var type = checkType(value);

            env.updateVariable("int", root.first.value, value);
            this.env = env;
        }
    }
    Interpreter.prototype.evalCondition = function(root, env) {
        console.log(root);
        /*
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
        */
        if (root.arity === "binary") {

        
            var leftValue = this.evalValue(root.first, this.env);
            var rightValue = this.evalValue(root.second, this.env);
        
            console.log(root.first);
            console.log("condition: " + leftValue + " " + root.value + " " + rightValue);

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
    }
    
    Interpreter.prototype.evalIfBlock = function(block, env) {
        var condition = block.Test;
        var body = block.IfBody;
        var elseBody = block.ElseBody;
        
        var isTrue = this.evalCondition(condition, env);
        
        if (isTrue == true) {
            this.eval(body, env);
        } else {
            this.eval(elseBody, env);
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
    
    Interpreter.prototype.evalMethod = function(root, env) {
        var adt = root.Caller;
        var adtType = env.getVariables().get(adt).get(0);
        var method = root.MethodName;
        var parameters = root.Arguments;
        
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
        console.log(this.TokenList.length);

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