/*
* main.js
* ---------
* Main script for DataTutor v0 Interpreter testing
*/

$(document).ready(function () {
    $("#output_box").hide();
    
    $("#tokens").click(function() {
        onTokens();
    });
    
    $("#nodes").click(function() {
        onNodes();
    });

    $("#tree").click(function() {
        onTree();
    });

    onTree = function() {
        console.log("--------------onTree-------------");
        $("#output_box").show();

        var code = $("#test_code").val();
        console.log("======= Test code ======== \n\n" + code + "\n\n ==========================");
        
        var i = new Interpreter(code);
        i.parse();

        var result = "";
        // result = displayParseTree(i.ParseTree) or i.displayParseTree()
        result = "hi!\n\n the parse tree is in the javascript console (in chrome, threelinething > more tools > javascript console). \n\n it looks good to me except i'm not sure if paren/bracelevels are getting added to the tree";
        $("#test_output").val(result);
    }


    onTokens = function() {
        console.log("--------------onTokens-------------");
        $("#output_box").show();

        var code = $("#test_code").val();
        console.log("======= Test code ======== \n\n" + code + "\n\n ==========================");
        
        var i = new Interpreter(code);
        i.tokenize();

        var result = "";
        result = displayTokens(i.TokenList);
        $("#test_output").val(result);
    };


    onNodes = function() {
        console.log("--------------onNodes-------------");
        $("#output_box").show();

        var code = $("#test_code").val();
        console.log("======= Test code ======== \n\n" + code + "\n\n ==========================");
        
        var i = new Interpreter(code);
        i.tokenize();

        var result = "";
        result = displayNodes(i.NodeList);

        $("#test_output").val(result);
    };


    var displayTokens = function(t) {
        var result = "";
        for (var i=0; i<t.length; i++) {
            console.log("\t" + t[i].type + ':' + t[i].value + "\t\tline: " + t[i].linenum);
            result += t[i].type;
            result += ":";
            result += t[i].value;
            result += "\t\tline: ";
            result += t[i].linenum;
            result += "\n";
        }
        return result;
    };

    var displayNodes = function(head) {
        // display error messages
        if (typeof head == 'string') {
            console.log(head);
            return head;
        }

        var result = "";
        while (head != null) {
            console.log(head.Token + "\t type: " + head.Type);
            result += head.Token;
            result += " \t\t " + head.Type + "\n";
            head = head.Next;
        }
        return result;
    };

});