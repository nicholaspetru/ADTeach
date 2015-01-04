$(document).ready(function () {

	Node = function(value, type, linenum, pos){
        this.Token = value;
        this.Type = type;
        this.linenum = linenum;
        this.pos = pos;
        this.Next = null;
        return this;
	}
});
