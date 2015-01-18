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
    Interpreter.prototype.eval = function(block, env) {
        while (block != None) {
            var blockType = block.Type;
            
            switch (blockType) {
                case "Semicolon":
                    this.evalSemiColonBlock(block, env);
                    break;
                case "For":
                    this.evalForBlock(block, env);
                    break;
                case "If":
                    this.evalIfBlock(block, env);
                    break;
                case "While":
                    this.evalWhileBlock(block, env);
                    break;
            }
            
            block = block.Next;
        }
    }
    
    Interpreter.prototype.evalValue = function(root, env) {
        if (root.Type != "symbol") {
            return root.Value;
        } else {
            if (root.Value not in env.getVariables()) {
                new UnidentifiedVariable();
            } else {
                return env.getVariables().get(root.Value).get(1);
            }
        }
    }
    
    Interpreter.prototype.evalSemiColonBlock = function(block, env) {
        var root = block.Value;
        var rootType = block.rootType;
        
        switch (rootType) {
            case "Assignment":
                this.evalAssignment(root, env);
                break;
            case "Method":
                this.evalMethod(root, env);
                break;
            case "++":
                this.evalPlusPlus(root, env);
                break;
            case "--":
                this.evalMinusMinus(root, env);
                break;
        }
    }
    
    Interpreter.prototype.evalForBlock = function(block, env) {
        var initialization = block.Initialization;
        var condition = block.Condition;
        var step = block.Step;
        var body = block.Body;
        var stepType;
        if (step.Value == "=") {
            stepType = "Assignment";
        } else {
            stepType = "Step";
        }
        
        this.evalAssignment(initialization, env);
        var isTrue = this.evalCondition(condition, env);
        while (isTrue == true) {
            this.eval(body, env);
            if (stepType == "Assignment") {
                this.evalAssignment(step, env);
            } else {
                this.evalStep(step, env);
            }
            isTrue = this.evalCondition(condition, env);
        }
    }
    
    Interpreter.prototype.evalIfBlock = function(block, env) {
        var condition = block.Condition;
        var body = block.Body;
        
        var isTrue = this.evalCondition(condition, env);
        
        if (isTrue == true) {
            this.eval(body, env);
        }
    }
    
    Interpreter.prototype.evalWhileBlock = function(block, env) {
        var condition = block.Condition;
        var body = block.Body;
        
        var isTrue = this.evalCondition(condition, env);
        
        while (isTrue == true) {
            this.eval(body, env);
            isTrue = this.evalCondition(condition, env);
        }
    }
    
    Interpreter.prototype.evalAssignment = function(root, env) {
        var valueRoot = root.RChild;
        var value;
        if (valueRoot.Value == ".") {
            value = this.evalMethod(valueRoot, env);
        }
        
        if (valueRoot.LChild == null && valueRoot.RChild == null) {
            if (valueRoot.MChild == null) {
                value = this.evalValue(valueRoot, env);
            } else {
                value = this.evalStep(valueRoot, env);
            }
        } else if (valueRoot.LChild != null && valueRoot.RChild != null) {
            if (valueRoot.Value in ['%', '+', '-', '*', '/', '**']) {
                value = this.evalMaths(valueRoot, env);
            } else if (valueRoot.Value == "new") {
                //Create the new ADT
            }
        }
        
        var variables = env.getVariables();
        if (root.LChild.Value == "init") {
            if (root.LChild.RChild.Value in variables) {
                new AlreadyInitialized(root.LChild.RChild.Value);
            } else {
                variables.get(root.LChild.RChild.Value) = [root.LChild.LChild.Value, value];
            }
        } else {
            if (root.LChild.Value in variables) {
                if (variables.get(root.LChild.Value).get(0) == this.checkType(value)) {
                    variables.get(root.LChild.Value).get(1) = value;
                } else {
                    new IncompatibleTypes();
                }
            } else {
                new AlreadyInitialized();
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
        if (root.Value not in ['%', '+', '-', '*', '/', '**']) {
            return this.evalValue(root, env);
        } else {
            if (root.value == "+") {
                return this.evalMaths(root.LChild, env) + this.evalMaths(root.RChild, env);
            } else {
                var leftValue = this.evalMaths(root.LChild, env);
                var rightValue = this.evalMaths(root.RChild, env);
                if (leftValue.Type == "String" or rightValue.Type == "String") {
                    new IncompatibleTypes();
                } else {
                    switch (root.Value) {
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
        var adt = root.LChild;
        var adtType = env.getVariables().get(adt).get(0);
        var method = root.MChild;
        
        if (method not in adtType.listMethods()) {
            new InvalidMethod();
        }
        
        //Check parameters
        //TODO
        //get listOfParameters
        //TODO
        
        if (adtType.checkParameters(method, listOfParameters) != true) {
            new IncorrectParameters();
        } else {
            adtType.performMethod(method, listOfParameters);
        }
    }
    
    Interpreter.prototype.evalStep(root, env) {
        if (root.Value == "++") {
            this.evalPlusPlus(root, env);
        } else if (root.Value == "--") {
            this.evalMinusMinus(root, env);
        }
    }
    
    Interpreter.prototype.evalCondition(root, env) {
        if (root.Value == "true") {
            return true;
        } else if (root.Value == "false") {
            return false;
        }
        
        var leftValue = this.evalValue(root.LChild);
        var rightValue = this.evalValue(root.RChild);
        
        switch (root.Value) {
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