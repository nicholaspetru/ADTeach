TOKEN/NODE TYPES:
-----------
SYMBOL_TYPE
INT_TYPE
FLOAT_TYPE
STR_TYPE
OPEN_PAREN
CLOSE_PAREN
OPEN_BRACE
CLOSE_BRACE
BOOL_TYPE
SEMI
-----------

Syntax for creating a new node from a non-token (ie paren/curly/semi levels):

if (t.type == CLOSE_PAREN) {
	// do stuff

	// Node objects are initialized with: token (i.e. value), type, linenum, and position
	// So either one of these would be fine:
	var x = new Node('ParenLevel', 'ParenLevel', t.linenum, t.pos);
	var n = new Node('ParenLevel', 'ParenLevel', 0, 0);
}

This creates a node object w/ the following properties:

	n.Token = 'ParenLevel'
	n.Type = 'ParenLevel'
	n.linenum = 0 // line number isnt important for non-tokens
	n.pos = 0 // neither is position in the line
	n.Next = null

-----------

while (curToken != null && ['OPEN_PAREN', 'OPEN_BRACE','SEMI', 'BraceLevel', 'SemicolonLevel'].indexOf(curToken.Type) >= 0)
