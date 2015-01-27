/*
* main.js
* ---------
* Main script for DataTutor v0 Interpreter testing
*/

$(document).ready(function () {
    $("#token_box").hide();
    $("#tree_box").hide();
    $("#interpreter_box").hide();

    $("#tokens").click(function() {
        onTokens();
    });

    $("#tree").click(function() {
        onTree();
    });

    $("#interpret").click(function() {
        onInterpret();
    });

    onInterpret = function() {
        console.log("--------------onTree-------------");
        // Show output boxes
        $("#token_box").show();
        $("#tree_box").show();
        $("#interpreter_box").show();

        // Get the test code
        var code = $("#test_code").val();
        console.log("======= Test code ======== \n\n" + code + "\n\n ==========================");
        var vh = 1;
        var i = new Interpreter();
        i.interpret(code,vh);

        // Tokenize the test code and display the array of tokens
        //i.makeParseTree();
        var token_result = "";
        token_result += i.displayTokens();
        $("#token_output").val(token_result);

        // Transform a token object into an exception object and throw it
        /*
        Object.prototype.error = function (message, t) {
            t = t || this;
            t.name = "SyntaxError";
            t.message = message;
            throw t;
        };

        // Generate the parse tree and represent it as a string
        var string;

        try {
            i.makeParseTree();

            string = JSON.stringify(i.ParseTree, ['key', 'name', 'message',
                'value', 'arity', 'first', 'second', 'third', 'fourth', 'Initialization', 'Test', 'Increment','Body', 'IfBody', 'ElseBody', 'WhileBody', 'MethodName', 'Caller', 'Arguments'], 4);
            //console.log(i.ParseTree[0]);
            //console.log(i.ParseTree[1]);
        } 


        catch (e) {
            string = JSON.stringify(e, ['name', 'message', 'from', 'to', 'key',
                    'value', 'arity', 'first', 'second', 'third', 'fourth', 'Initialization', 'Test', 'Increment','Body', 'IfBody', 'ElseBody', 'WhileBody', 'MethodName', 'Caller', 'Arguments'], 4);
        }
        

        //parse_result += string;
        $("#tree_output").val(string);
        */
    }

    onTree = function() {
        console.log("--------------onTree-------------");
        // Show output boxes
        $("#token_box").show();
        $("#tree_box").show();

        // Get the test code
        var code = $("#test_code").val();
        console.log("======= Test code ======== \n\n" + code + "\n\n ==========================");
        var vh = 1;
        var i = new Interpreter();
        i.interpret(code,vh);
        var source = i.TokenList;

        var token_result = "";
        token_result = i.displayTokens();
        $("#token_output").val(token_result);

        // Transform a token object into an exception object and throw it
        Object.prototype.error = function (message, t) {
            t = t || this;
            t.name = "SyntaxError";
            t.message = message;
            throw t;
        };

        // Generate the parse tree and represent it as a string
        var parse = make_parse();
        var string, tree;

        try {
            tree = parse(source);

            string = JSON.stringify(tree, ['key', 'name', 'message',
                'value', 'arity', 'first', 'second', 'third', 'fourth', 'Initialization', 'Test', 'Increment','Body', 'IfBody', 'ElseBody', 'WhileBody', 'MethodName', 'Caller', 'Arguments'], 4);
        } catch (e) {
            string = JSON.stringify(e, ['name', 'message', 'from', 'to', 'key',
                    'value', 'arity', 'first', 'second', 'third', 'fourth', 'Initialization', 'Test', 'Increment','Body', 'IfBody', 'ElseBody', 'WhileBody', 'MethodName', 'Caller', 'Arguments'], 4);
        }

        // Display the parse tree
        var parse_result = "";
        /*
        if (!tree) {
            parse_result += "no tree :(\n\n";
        }
        else {
            parse_result += string;
        }
        */

        parse_result += string;
        $("#tree_output").val(parse_result);
    }


    onTokens = function() {
        console.log("--------------onTokens-------------");
        $("#token_box").show();

        var code = $("#test_code").val();
        console.log("======= Test code ======== \n\n" + code + "\n\n ==========================");
        var vh = 1;
        var i = new Interpreter();
        i.interpret(code,vh);

        // Tokenize the test code and display the array of tokens
        var token_result = i.displayTokens();
        $("#token_output").val(token_result);
    };


});