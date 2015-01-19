/*
* interpeter.js
*
*
*/

$(document).ready(function () {
    
    Interpreter = function(code){
        //the list of entities
        //this.entities = [];
        //this.eventQueue = [];
        this.symbolTable = null;
        this.code = code;
        this.TokenList = null;
        this.NodeList = null;
        this.ParseTree = null;
        this.Error = null;
        return this;
    }
    
    
    
    //uncommented this to work on visualizer handler stuff
    Interpreter.prototype.eval = function(arrayOfBlocks, env) {
        var count = 0;
        while (arrayOfBlocks) {
            var block = arrayOfBlocks.get(count);
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
            }
            
            count += 1;
        }
    }
    
    Interpreter.prototype.evalValue = function(root, env) {
        if (root.arity != "name") {
            return root.value;
        } else {
            if (env.getVariables().indexOf(root.value) < 0) {
                console.log("not in env");
                //new UnidentifiedVariable();
            } else {
                return env.getVariables().get(root.value).get(1);
            }
        }
    }
    
    Interpreter.prototype.evalSemiColonBlock = function(block, env) {
        var root = block.value;
        var rootType = block.arity;
        
        if (rootType == "binary" && root == "=") {
            this.evalAssignment(root, env);
        } else if (rootType == "unary" && root == "++") {
            this.evalPlusPlus(root, env);
        } else if (rootType == "unary" && root == "--") {
            this.evalMinusMinus(root, env);
        } else if (rootType == "Initialization") {
            this.evalAssignment(root, env);
        } else if (rootType == "FunCall") {
            this.evalMethod(root, env);
        }
        
        
        
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
    
    Interpreter.prototype.evalWhileBlock = function(block, env) {
        var condition = block.Test;
        var body = block.Body;
        
        var isTrue = this.evalCondition(condition, env);
        
        while (isTrue == true) {
            this.eval(body, env);
            isTrue = this.evalCondition(condition, env);
        }
    }
    
    Interpreter.prototype.evalAssignment = function(root, env) {
        var valueRoot = root.second;
        var value;
        if (valueRoot.arity == "FunCall") {
            value = this.evalMethod(valueRoot, env);
        }
        
        //Literals, ints, floats
        if (valueRoot.arity == "literal" || valueRoot.arity == "name") {
            value = this.evalValue(valueRoot, env);
        }
        else if (valueRoot.value == "++" || valueRoot.value == "--") {
            value = this.evalStep(valueRoot, env);
        }
        
        
        } else if (['%', '+', '-', '*', '/', '**'].indexOf(valueRoot.value) >= 0) {
                value = this.evalMaths(valueRoot, env);
        } else if (valueRoot.value == "new") {
                //Create the new ADT
            }
        }
        
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
    
    Interpreter.prototype.evalMaths(root, env) {
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
                    //new IncompatibleTypes();
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
                        case "**":
                            return leftValue ** rightValue;
                    }
                }
            }
        }
    }
    
    Interpreter.prototype.evalMethod(root, env) {
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
    
    Interpreter.prototype.evalStep(root, env) {
        if (root.value == "++") {
            this.evalPlusPlus(root, env);
        } else if (root.value == "--") {
            this.evalMinusMinus(root, env);
        }
    }
    
    Interpreter.prototype.evalCondition(root, env) {
        
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
        
        var leftValue = this.evalValue(root.first);
        var rightValue = this.evalValue(root.second);
        
        switch (root.value) {
            case "<":
                return (leftValue < rightValue);
            case ">":
                return (leftValue > rightValue);
            case "==":
                return (leftValue == rightValue);
            case "!=":
                return (leftValue != rightValue);
        }
    }
    
}