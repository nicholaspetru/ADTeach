$(document).ready(function () {

	var Node = function(token){
	    this.Token = token;
	    this.Next = null;
	    this.Type = checkType(token);
	}

	Node.prototype.checkType = function(token){

		var period = 0;
        var index = 0;

		if (this.Token == "ParenLevel") return 11;

        if (this.Token == "CurlyBraceLevel") return 12;

        if (this.Token == "SemicolonLevel") return 13;

        if (this.Token == "None") return 0;

        if(this.Token.charAt(0) == '\"' and this.Token[len(this.Token)-1] == '\"') return 4;

        else if (this.Token.charAt(0) == '(') return 5;

        else if (this.Token.charAt(0)  == ')') return 6;

        else if (this.Token.charAt(0) == '{') return 7;

        else if (this.Token.charAt(0)  == '}') return 8;

        else if (this.Token == 'true' || this.Token == 'True'){
            this.Token = true;
            return 9;
        }
        else if (this.Token == 'false' || this.Token == 'False'){
            this.Token = false;
            return 9;
        }
        else if (this.Token.charAt(0) == ';') return 10;

        else if (this.Token.charAt(0)  == '-'){
            if (this.Token.length == 1) return 1;
            else index = 1;
        }

  
        for (var i = index; i<this.Token.length; i++){
        	// If it is not a digit, using ASCII values
            if(!this.Token.charCodeAt(i) >= 48 && !this.Token.charCodeAt(i) <= 57){
                if (i==0) return 1;
                else return 0;
            }
            // if it is a period
            else if(this.Token[i] == '.'){
                if (period == 1) return 0;
                else period = 1;
            }
        }
        if (period == 0){
            this.Token = parseInt(this.Token);
            return 2;
        }
        else{
            this.Token = parseFloat(this.Token);
            return 3;
        }



	};

});
