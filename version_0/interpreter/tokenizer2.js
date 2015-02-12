/*
* tokenizer2.js
* -------------
* Modeled after a code sample in the following blog post by Eli Bendersky (her code samples are in the public domain): 
* http://eli.thegreenplace.net/2013/07/16/hand-written-lexer-in-javascript-compared-to-the-regex-based-ones
*/

$(document).ready(function () {

Tokenizer = function() {
	this.pos = 0;
	this.linenum = 0;
	this.buf = null;
	this.buflen = 0;
	this.operators = ['=', '>','<','!',':','+','-','*','/' ,'^','%',
		'==', '!=', '+=', '-=', '++', '--', '&&', '||'];
	this.separators = {
		';': 'SEMI', 
		',': 'COMMA',
		'.': 'DOT',
		'(': 'OPEN_PAREN', 
		')': 'CLOSE_PAREN',
		'{': 'OPEN_BRACE',
		'}': 'CLOSE_BRACE',
		'[': 'OPEN_BRACKET',
		']': 'CLOSE_BRACKET'
	};
	return this;
}

// Initialize the Tokenizer's buffer. This resets the tokenizer's internal
// state and subsequent tokens will be returned starting with the
// beginning of the new buffer
Tokenizer.prototype.input = function(buf) {
	this.pos = 0;
	this.linenum = 1;
	this.buf = buf;
	this.buflen = buf.length;
}

// Get the next token from the current buffer. A token is an object with
// the following properties:
// - name: name of the pattern that this token matched (taken from rules)
// - value: actual string value of the token
// - pos: offset in the current buffer where the token starts
// - linenum: linenum in the current buffer where the token starts
//
// If there are not more tokens in the buffer, returns null. In case of error throws error.
Tokenizer.prototype.token = function() {
	this._skipnontokens();
	if (this.pos >= this.buflen) return null;

	// The char at this.pos is part of a real token. Figure out which.
	var c = this.buf.charAt(this.pos);
	var sep = this.separators[c];
	if (sep !== undefined) {
		return {type: "operator", jtype: sep, value: c, pos: this.pos++, linenum: this.linenum};
	}
	else {
		if (this._isdigit(c)) {
			return this._process_number();
		}
		else if (c === '"') {
			return this._process_string();
		}
		else if (c === "'") {
			return this._process_char();
		}
		else {
			return this._process_symbol();
		}
	}
}


Tokenizer.prototype._isnewline = function(c) {
	return c === '\r' || c === '\n';
}

Tokenizer.prototype._iswhitespace = function(c) {
	return c === ' ' || c === '\t' || c == '\n' || c === '\r';
}

Tokenizer.prototype._isdigit = function(c) {
	return c >= '0' && c <= '9';
}

Tokenizer.prototype._isnonzerodigit = function(c) {
	return c >= '1' && c <= '9';
}

// isinitial
Tokenizer.prototype._isalpha = function(c) {
	return (c >= 'a' && c <= 'z') ||
			(c >= 'A' && c <= 'Z') ||
			c === '_' || c === '$';
}

// is subsequent
Tokenizer.prototype._isalphanum = function(c) {
	return (c >= '0' && c <= '9') ||
			(c >= 'a' && c <= 'z') ||
			(c >= 'A' && c <= 'Z') ||
			c === '_' || c === '$';
}


Tokenizer.prototype._process_number = function() {
	var endpos = this.pos + 1;
	while (endpos < this.buflen && this._isdigit(this.buf.charAt(endpos))) {
		endpos++;
	}
	var x = this.buf.charAt(endpos);
	var y = this.buf.charAt(endpos + 1);
	if (x === '.' && this._isdigit(y)) {
		while (endpos < this.buflen && this._isdigit(y)) {
			endpos++;
			y = this.buf.charAt(endpos);
		}

		var tok = {
			type: "number",
			jtype: 'FLOAT_TYPE',
			value: this.buf.substring(this.pos, endpos),
			pos: this.pos,
			linenum: this.linenum
		};
		this.pos = endpos;
		return tok;
	}

	else {
		var tok = {
			type: "number",
			jtype: 'INT_TYPE',
			value: this.buf.substring(this.pos, endpos),
			pos: this.pos,
			linenum: this.linenum
		};
		this.pos = endpos;
		return tok;
	}
}


Tokenizer.prototype._process_symbol = function() {
	var endpos = this.pos + 1;
	var op1 = this.operators.indexOf(this.buf.charAt(this.pos));
	var op2 = this.operators.indexOf(this.buf.charAt(endpos));

	if (op1 !== -1) {
		if (op2 !== -1) {
			endpos++;
			var tok = {
				type: "operator",
				jtype: 'OPERATOR_TYPE',
				value: this.buf.substring(this.pos,endpos),
				pos: this.pos,
				linenum: this.linenum
			};
			this.pos = endpos;
			return tok;
		}
		var tok = {
			type: "operator",
			jtype: 'OPERATOR_TYPE',
			value: this.buf[this.pos],
			pos: this.pos,
			linenum: this.linenum
		};
		this.pos = endpos;
		return tok;
	}

	while (endpos < this.buflen && this._isalphanum(this.buf.charAt(endpos))) {
		endpos++;
	}

	var temp = this.buf.substring(this.pos, endpos);

	// BOOLEAN 
	if (temp === 'true' || temp === 'false') {
		var tok = {
			type: "name",
			jtype: 'BOOL_TYPE',
			value: temp,
			pos: this.pos,
			linenum: this.linenum
		};
		this.pos = endpos;
		return tok;
	}
/*
	else if (temp === 'new') {
		var tok = {
			type: "operator",
			jtype: 'OPERATOR_TYPE',
			value: temp,
			pos: this.pos,
			linenum: this.linenum
		};
		this.pos = endpos;
		return tok;
	}
*/
	else if (temp === 'Stack' || temp === 'Queue' || temp === 'List' || temp === 'PriorityQueue' || temp === "Dictionary") {
		if (this.buf.charAt(endpos) !== '<') {
			throw Error('Syntax error: expected type specifier for ADT');
		}
		var close_angle = this.buf.indexOf('>', endpos+1); // find the closing bracket >
		if (close_angle === -1) {
			throw Error("Syntax error: missing closing bracket >");
		} else {
			var tok = {
				type: "name",
				jtype: 'SYMBOL_TYPE',
				value: this.buf.substring(this.pos, close_angle + 1),
				pos: this.pos,
				linenum: this.linenum
			};
		this.pos = close_angle + 1;
		return tok;
		}	
	}
	// regular old symbol
	var tok = {
		type: "name",
		jtype: 'SYMBOL_TYPE',
		value: temp,
		pos: this.pos,
		linenum: this.linenum
	};
	this.pos = endpos;
	return tok;
}

Tokenizer.prototype._process_string = function() {
	// this.pos points at the opening quote
	var end_index = this.buf.indexOf('"', this.pos+1); // find the ending quote

	if (end_index === -1) {
		throw Error('Unterminated quote');
	} else {
		var tok = {
			type: "string",
			jtype: 'STR_TYPE',
			value: this.buf.substring(this.pos, end_index + 1),
			pos: this.pos,
			linenum: this.linenum
		};
		this.pos = end_index + 1;
		return tok;
	}
}

Tokenizer.prototype._process_char = function() {
	// this.pos points at the opening quote
	var end_index = this.buf.indexOf("'", this.pos+1); // find the ending quote

	if (end_index === -1) {
		throw Error('Unterminated quote');
	} else {
		var tok = {
			type: "string",
			jtype: 'CHAR_TYPE',
			value: this.buf.substring(this.pos, end_index + 1),
			pos: this.pos,
			linenum: this.linenum
		};
		this.pos = end_index + 1;
		return tok;
	}
}

Tokenizer.prototype._skipnontokens = function() {
	while (this.pos < this.buflen) {
		var c = this.buf.charAt(this.pos);
		var next_c = this.buf.charAt(this.pos + 1);

		if (this._iswhitespace(c)) {
			this.pos++;
			if (this._isnewline(c)) {
				this.linenum++;
			}
		}

		// process single line comments
		else if (c == '/' && next_c == '/') {
			var endpos = this.pos + 1;
			while ((this.pos < this.buflen) && !(this.buf.charAt(endpos)._isnewline)) {
				endpos++;
			}
			this.linenum++;
			this.pos = endpos + 1;
		}

		// process multiline comments 

		else {
			break;
		}
	}
}

});