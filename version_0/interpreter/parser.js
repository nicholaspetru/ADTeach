/**
* Parser for Simplified JavaScript written in Simplified JavaScript
* From Top Down Operator Precedence
* http://javascript.crockford.com/tdop/index.html
* Douglas Crockford
* 2010-06-26
*
* Modified by: Liz Shank, Colby Seyferth, Sarah LeBlanc
* ADTeach Team, 2015
**/
var make_parse = function (env) {
    var scope;
    var symbol_table = {};
    var token;
    var tokens;
    var token_nr;
    var envir = env;

    var itself = function () {
        return this;
    };

    var original_scope = {
        // defines new variables in the scope (transforms a name token into a variable token)
        // produces an error if the variable has already been defined in the scope,
        // or if the variable has already been used as a reserved word
        define: function (n) {
            var t = this.def[n.value];
            if (typeof t === "object") {
                //console.log("Syntax error: ", token.linenum);
                envir.throwError(token.linenum, "Variable \"" + n.value + "\" already defined");
                n.error(t.reserved ? "Already reserved." : "Already defined.");
            }
            this.def[n.value] = n;
            n.reserved = false;
            n.nud      = itself;
            n.led      = null;
            n.std      = null;
            n.lbp      = 0;
            n.scope    = scope;
            return n;
        },
        find: function (n) {
            var e = this, o;
            while (true) {
                o = e.def[n];
                if (o && typeof o !== 'function') {
                    return e.def[n];
                }
                e = e.parent;
                if (!e) {
                    o = symbol_table[n];
                    return o && typeof o !== 'function' ? o : symbol_table["(name)"];
                }
            }
        },
        pop_scope: function () {
            scope = this.parent;
        },
        reserve: function (n) {
            if (n.arity !== "name" || n.reserved) {
                return;
            }
            var t = this.def[n.value];
            if (t) {
                if (t.reserved) {
                    return;
                }
                if (t.arity === "name") {
                    //console.log("Syntax error: ", token.linenum);
                    envir.throwError(token.linenum, "Variable \"" + n.value + "\" already defined");
                    n.error("Already defined.");
                }
            }
            this.def[n.value] = n;
            n.reserved = true;
        }
    };

    // establishes a new scope for a function or a block
    var new_scope = function () {
        var s = scope;
        scope = Object.create(original_scope);
        scope.def = {};
        scope.parent = s;
        return scope;
    };

    // makes a new token object from the next simple token in the array
    // and assigns it to the token variable
    // it can take an optional id param, which it can check against the id of the previous token
    // the new token object's prototype is a (name) token in the current scope, or a symbol from the symbol table
    var advance = function (id) {
        var a, o, t, v;
        if (id && token.id !== id) {
            //console.log("Syntax error: ", token.linenum-1);
            envir.throwError(token.linenum, "Expected '" + id + "'.");
            token.error();
        }
        if (token_nr >= tokens.length) {
            token = symbol_table["(end)"];
            return;
        }
        t = tokens[token_nr];
        token_nr += 1;
        v = t.value;
        a = t.type;
        //console.log("Looking at t: ", t);
        if (a === "name") {
            o = scope.find(v);
        } else if (a === "operator") {
            o = symbol_table[v];
            if (!o) {
                envir.throwError(token.linenum, "Unknown operator.");
                t.error();
            }
        } else if (a === "string" || a ===  "number") {
            o = symbol_table["(literal)"];
            a = "literal";
        } else {
            envir.throwError(token.linenum, "Unexpected token.");
            t.error();
        }
        token = Object.create(o);
        token.from  = t.from;
        token.to    = t.to;
        token.value = v;
        token.arity = a;
        token.linenum = t.linenum;
        token.pos = t.pos;
        token.jtype = t.jtype; // tracks the Viva-specific tokens like INT_TYPE, FLOAT_TYPE, etc. (a little heavy-handed)
        return token;
    };

    var expression = function (rbp, passing) {
        var left;
        var t = token;
        advance();
        ////console.log("T nud is: ", t.nud());
        left = t.nud(passing);
        while (rbp < token.lbp) {
            t = token;
            advance();
            left = t.led(left);
        }
        return left;
    };

    // parses one statement
    // if the current token has an std method, the token is reserved and the std is invoked
    // otherwise, we assume the statement is terminated with a semicolon
    var statement = function () {
        var n = token, v;

        if (n.std) {
            advance();
            scope.reserve(n);
            return n.std();
        }
        v = expression(0);
        /*
        if (!v.assignment && v.id !== "(") {
            v.error("Bad expression statement.");
        }
        */
        advance(";");
        return v;
    };

    // parses statements until it sees (end) or } which signals the end of a block
    // returns a statement, an array of statements, or null if there were no statements present
    var statements = function () {
        var a = [], s;
        while (true) {
            if (token.id === "}" || token.id === "(end)") {
                break;
            }
            s = statement();
            if (s) {
                a.push(s);
            }
        }
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    };

    // parses a block
    var block = function () {
        var t = token;
        advance("{");
        return t.std();
    };

    var original_symbol = {
        nud: function () {
            //console.log("Syntax error: ", token.linenum);
            envir.throwError(token.linenum, "Undefined");
            this.error("Undefined.");
        },
        led: function (left) {
            //console.log("Syntax error: ", token.linenum);
            envir.throwError(token.linenum, "Missing operator");
            this.error("Missing operator.");
        }
    };

    // Takes a symbol id and an optional binding power (which defaults to 0)
    // Returns a symbol object for that id
    // If the symbol already exists in the symbol_table, the function returns that symbol table
    var symbol = function (id, bp) {
        var s = symbol_table[id];
        bp = bp || 0;
        if (s) {
            if (bp >= s.lbp) {
                s.lbp = bp;
            }
        } else {
            s = Object.create(original_symbol);
            s.id = s.value = id;
            s.lbp = bp;
            symbol_table[id] = s;
        }
        return s;
    };

    var constant = function (s, v) {
        var x = symbol(s);
        x.nud = function () {
            scope.reserve(this);
            this.value = symbol_table[this.id].value;
            this.arity = "literal";
            return this;
        };
        x.value = v;
        return x;
    };

    var infix = function (id, bp, led) {
        var s = symbol(id, bp);
        s.led = led || function (left) {
            this.first = left;
            this.second = expression(bp);
            this.arity = "binary";
            return this;
        };
        return s;
    };

    var infixr = function (id, bp, led) {
        var s = symbol(id, bp);
        s.led = led || function (left) {
            this.first = left;
            this.second = expression(bp - 1);
            this.arity = "binary";
            return this;
        };
        return s;
    };

    var assignment = function (id) {
        return infixr(id, 10, function (left) {
            if (left.id !== "." && left.id !== "[" && left.arity !== "name") {
                left.error("Bad lvalue.");
            }
            this.first = left;
            this.second = expression(9);
            this.assignment = true;
            this.arity = "binary";
            return this;
        });
    };
    
    var postfix = function (id, bp, led) {
        var s = symbol(id, 139);
        s.led = led || function (left) {
            this.first = left;
            this.arity = "unary";
            return this;
        };
        return s;
    };

    var prefix = function (id, nud) {
        var s = symbol(id);
        s.nud = nud || function () {
            scope.reserve(this);
            this.first = expression(129);
            this.arity = "unary";
            return this;
        };
        return s;
    };

    // add a statement symbol s to the symbol_table
    // takes statement id and std function
    var stmt = function (s, f) {
        var x = symbol(s);
        x.std = f;
        return x;
    };

    symbol("(end)");
    symbol("(name)");
    symbol(":");
    symbol(";");
    symbol(")");
    symbol("]");
    symbol("}");
    symbol(",");
    symbol("else");

    constant("true", true);
    constant("false", false);
    constant("null", null);
    constant("pi", 3.141592653589793);

    symbol("(literal)").nud = itself;

    symbol("this").nud = function () {
        scope.reserve(this);
        this.arity = "this";
        return this;
    };

    /////////////////
    // ASSIGNMENT
    /////////////////
    assignment("=");
    assignment("+=");
    assignment("-=");
    //assignment("*=");
    //assignment("/=");
    //assignment("%=");


    /////////////////
    // MULTIPLICATIVE
    /////////////////
    infix("*", 120);
    infix("/", 120);
    infix("%", 120);


    /////////////////
    // ADDITIVE
    ////////////////
    infix("+", 110);
    infix("-", 110);


    /////////////////
    // COMPARATIVE
    /////////////////
    infix("<", 90);
    infix("<=", 90);
    infix(">", 90);
    infix(">=", 90);

    infix("==", 80);
    infix("!=", 80);


    //////////////////
    // LOGICAL AND/OR
    //////////////////
    infix("&&", 40);
    infix("||", 20);


    infix(".", 150, function (left) {
        this.first = left;
        if (token.arity !== "name") {
            //console.log("Syntax error: ", token.linenum);
            envir.throwError(token.linenum, "Expected a property name");
            token.error("Expected a property name.");
        }
        token.arity = "literal";
        this.second = token;
        this.arity = "binary";
        advance();
        return this;
    });

    infix("(", 150, function (left) {
        var a = [];
        //console.log(left.id);
        //console.log("IN open paren: ", left);
        if (left.id === "." || left.id === "[") {
            this.arity = "FunCall";
            this.Caller = left.first;
            this.MethodName = left.second;
            this.Arguments = a;
        } else if (left.id == "new") {
            this.arity = "Initialization";
            this.Arguments = a;
            //console.log("Arguments are: ", this.Arguments);
        }else {
            this.arity = "binary";
            this.first = left;
            this.second = a;
            if ((left.arity !== "unary" || left.id !== "function") &&
                    left.arity !== "name" && left.id !== "(" &&
                    left.id !== "&&" && left.id !== "||" && left.id !== "?") {
                //console.log("Syntax error: ", token.linenum);
                envir.throwError(token.linenum, "Expected a variable name");
                left.error("Expected a variable name.");
            }
        }
        if (token.id !== ")") {
            //console.log("Looking for closed paren");
            while (true) {
                a.push(expression(0));
                if (token.id !== ",") {
                    break;
                }
                advance(",");
            }
        }
        if (left.id == "new") {
            //console.log("Arguments are: ", a, "Comparing to: ", []);
            if (this.Arguments.length != 0) {
                envir.throwError(token.linenum, "Invalid Arguments");
                left.error();
            }
        }
        //console.log("The arguments are: ", a);
        advance(")");
        return this;
    });

    /////////////////
    // POSTFIX
    /////////////////
    postfix("++");
    postfix("--");

    /////////////////
    // PREFIX 
    /////////////////
    prefix("++");
    prefix("--");
    prefix("-");
    prefix("!");
    prefix("int");

    prefix("(", function () {
        var e = expression(0);
        advance(")");
        return e;
    });

    prefix("new", function (passed) {
        if (token.value != passed) {
            //console.log("ERROR ERROR ERROR");
            envir.throwError(token.linenum, "syntax Error");
            envir.error();
        }
        if (token.arity !== "name") {
            //console.log("Syntax error: ", token.linenum);
            envir.throwError(token.linenum, "Expected a property name.");
            token.error("Expected a property name.");
        }
        token.arity = "literal";
        this.first = token;
        this.arity = "NEW_ADT";
        advance();
        return this;
    });


    // block statement wraps a pair of curly braces around a list of statements, giving them a new scope
    stmt("{", function () {
        new_scope();
        var a = statements();
        advance("}");
        scope.pop_scope();
        return a;
    });

     // declares one or more variables of the given type in the current block
    // each name can optionally be followed by = and an initializing expression
    var primitiveInit = function(type) {
        stmt(type, function() {
            var a = [], n, t;
            n = token;
            if (n.arity !== "name") {
                //console.log("Syntax error: ", token.linenum);
                envir.throwError(token.linenum, "Expected a new variable name.");
                n.error("Expected a new variable name.");
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                t.first = type;
                t.second = n;
                t.arity = "Initialization";
                advance("=");
                t.third = expression(0);
                a.push(t);
            }
            else {
                t = token;
                t.value = "init";
                t.first = type;
                t.second = n;
                t.third = undefined;
                t.arity = "Initialization";
                a.push(t);
            }
        
            advance(";");
            return a.length === 0 ? null : a.length === 1 ? a[0] : a;
        });
    }

    primitiveInit("int");
    primitiveInit("float");
    primitiveInit("double");
    primitiveInit("char");
    primitiveInit("boolean");
    primitiveInit("String");

    /**
    *
    * Sets up the values for all the different types of ADTs
    *
    **/
    stmt("Stack<Integer>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "Stack<Integer>";
                t.third = expression(0, "Stack<Integer>");                
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "Stack<Integer>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("Stack<String>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "Stack<String>";
                t.third = expression(0, "Stack<String>");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "Stack<String>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("Stack<Float>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "Stack<Float>";
                t.third = expression(0, "Stack<Float>");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "Stack<Float>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("List<Integer>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "List<Integer>";
                t.third = expression(0, "List<Integer>")
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "List<Integer>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("List<String>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "List<String>";
                t.third = expression(0, "List<String>");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "List<String>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("List<Float>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "List<Float>";
                t.third = expression(0, "List<Float>")
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "List<Float>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });

    stmt("Queue<Integer>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "Queue<Integer>";
                t.third = expression(0, "Queue<Integer>");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "Queue<Integer>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("Queue<String>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "Queue<String>";
                t.third = expression(0, "Queue<String>");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "Queue<String>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("Queue<Float>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "Queue<Float>";
                t.third = expression(0, "Queue<Float>");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "Queue<Float>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("PriorityQueue<Integer>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "PriorityQueue<Integer>";
                t.third = expression(0, "PriorityQueue<Integer>");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "PriorityQueue<Integer>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("PriorityQueue<String>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "PriorityQueue<String>";
                t.third = expression(0, "PriorityQueue<String>");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "PriorityQueue<String>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("PriorityQueue<Float>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "PriorityQueue<Float>";
                t.third = expression(0, "PriorityQueue<Float>");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "PriorityQueue<Float>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("Dictionary<Integer, Integer>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "Dictionary<Integer, Integer>";
                t.third = expression(0, "Dictionary<Integer, Integer>");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "Dictionary<Integer, Integer>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("Dictionary<Integer, String>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "Dictionary<Integer, String>";
                t.third = expression(0, "Dictionary<Integer, String>");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "Dictionary<Integer, String>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("Dictionary<Integer, Float>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "Dictionary<Integer, Float>";
                t.third = expression(0, "Dictionary<Integer, Float>");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "Dictionary<Integer, Float>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("Dictionary<String, Integer>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                //console.log("Syntax error: ", token.linenum);
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error("Expected a new variable name.");
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "Dictionary<String, Integer>";
                t.third = expression(0, "Dictionary<String, Integer>");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "Dictionary<String, Integer>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("Dictionary<String, String>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "Dictionary<String, String>";
                t.third = expression(0, "Dictionary<String, String>");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "Dictionary<String, String>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("Dictionary<String, Float>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "Dictionary<String, Float>";
                t.third = expression(0, "Dictionary<String, Float>");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "Dictionary<String, Float>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("Dictionary<Float, Integer>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "Dictionary<Float, Integer>";
                t.third = expression(0, "Dictionary<Float, Integer>");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "Dictionary<Float, Integer>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("Dictionary<Float, String>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "Dictionary<Float, String>";
                t.third = expression(0, "Dictionary<Float, String>");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "Dictionary<Float, String>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("Dictionary<Float, Float>", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "Dictionary<Float, Float>";
                t.third = expression(0, "Dictionary<Float, Float>");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "Dictionary<Float, Float>";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("Graph", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "Graph";
                t.third = expression(0, "Graph");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "Graph";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("WeightedGraph", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "WeightedGraph";
                t.third = expression(0, "WeightedGraph");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "WeightedGraph";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });
    
    stmt("Tree", function () {
        var a = [], n, t;
        while (true) {
            n = token;
            if (n.arity !== "name") {
                envir.throwError(token.linenum, "Expected a new Variable name.");
                n.error();
            }
            scope.define(n);
            advance();
            if (token.id === "=") {
                t = token;
                t.value = "init";
                advance("=");
                t.first = "Tree";
                t.third = expression(0, "Tree");
                t.second = n;
                t.arity = "Initialization";
                a.push(t);
            }
            else {
                t = token;
                t.value = "Tree";
                t.first = n;
                t.second = null;
                t.arity = "Initialization";
                a.push(t);
            }
            if (token.id !== ",") {
                break;
            }
            advance(",");
        }
        advance(";");
        return a.length === 0 ? null : a.length === 1 ? a[0] : a;
    });

    /*
    * -------------------------------------------------------------------------
    * SPECIAL BLOCK STATEMENTS
    *
    */
    stmt("if", function () {
        advance("(");
        this.Test = expression(0);
        advance(")");
        this.IfBody = block();
        if (token.id === "else") {
            scope.reserve(token);
            advance("else");
            this.ElseBody = token.id === "if" ? statement() : block();
        } else {
            this.ElseBody = null;
        }
        this.arity = "IF_BLOCK";
        return this;
    });

    stmt("return", function () {
        if (token.id !== ";") {
            this.first = expression(0);
        }
        advance(";");
        if (token.id !== "}") {
            //console.log("Syntax error: ", token.linenum);
            envir.throwError(token.linenum, "Unreachable statement");
            token.error("Unreachable statement.");
        }
        this.arity = "RETURN_STATEMENT";
        return this;
    });

    stmt("break", function () {
        advance(";");
        if (token.id !== "}") {
            //console.log("Syntax error: ", token.linenum);
            envir.throwError(token.linenum, "Unreachable statement");
            token.error("Unreachable statement.");
        }
        this.arity = "BREAK_STATEMENT";
        return this;
    });

    stmt("while", function () {
        advance("(");
        this.Test = expression(0);
        advance(")");
        this.Body = block();
        this.arity = "WHILE_BLOCK";
        return this;
    });

    stmt("for", function () {
        advance("(");
        this.Initialization = statement();
        this.Test = statement();
        this.Increment = expression(0);
        advance(")");
        this.Body = block();
        this.arity = "FOR_BLOCK";
        return this;
    });

    return function (source) {
        tokens = source;
        token_nr = 0;
        new_scope();
        advance();
        var s = statements();
        advance("(end)");
        scope.pop_scope();
        return s;
    };
};