$(document).ready(function () {
    SymbolTable = function(vh) {
        //the list of entities
        this.table = [[]];
        this.nextAnonVar = 1;
        this.visualizerHandler = vh;
        return this;
    }
    
    //returns false if variable was not in the table, else returns true
    //if false, updateVariable does not create a new symbolTable, nor does it call enqueueEvent.
    SymbolTable.prototype.updateVariable = function(type, name, value, action, originADT, lineNum) {
        console.log('Symbol Table: updateVariable(' + type + ',' + name + ',' + value + ',' + action + ',' + originADT + ',' + lineNum + ')');
        var curTable = this.table[this.table.length-1];
        var newTable = curTable.slice(0);
        for (var i = 0; i < newTable.length; i++) {
            if (newTable[i][1] == name) {
                var curLine = newTable[i];
                curLine[2] = value;
                curLine[3] = action;
                curLine[4] = originADT;
                curLine[5] = lineNum;
                this.table.push(newTable);
                //why is type being passed in twice here?
                this.visualizerHandler.enqueueEvent("update", type, name, value, action, originADT, lineNum);
                return true;
            }
        }
        return false;
    };
    
    //returns false if variable was not in the table, else returns true
    //if false, removeVariable does not create a new symbolTable, nor does it call enqueueEvent.
    SymbolTable.prototype.removeVariable = function(type, name, value, lineNum) {
        //console.log('Symbol Table: removeVariable(' + type + ',' + name + ',' + value + ',' + lineNum + ')');
        var curTable = this.table[this.table.length-1];
        var newTable = curTable.slice(0);
        var varIndex = null;
        for (var i = 0; i < newTable.length; i++) {
            if (newTable[i][1] == name) {
                var curLine = newTable[i];
                curLine[3] = 'remove';
                curLine[5] = lineNum;
                this.table.push(newTable);
                //why is type being passed in twice here?
                this.visualizerHandler.enqueueEvent("delete", type, name, value, curLine[3], curLine[4], lineNum);
                return true;
            }
        }
        return false;
    };

    //returns the name of the new variable, regardless of whether a new .x name was assigned
    SymbolTable.prototype.newVariable = function(type, name, value, action, originADT, lineNum) {
        //console.log('Symbol Table: newVariable(' + type + ',' + name + ',' + value + ',' + action + ',' + originADT + ',' + lineNum + ')');
        var curTable = this.table[this.table.length-1];
        var newTable = curTable.slice(0);
        if (name == '.') {
            name = name + this.nextAnonVar.toString();
            this.nextAnonVar++;
        }
        var newLine = new Array(5);
        newLine[0] = type;
        newLine[1] = name;
        newLine[2] = value;
        newLine[3] = action;
        newLine[4] = originADT;
        newLine[5] = lineNum;
        newTable.push(newLine);
        this.table.push(newTable);
        //why is type being passed in twice here?
        this.visualizerHandler.enqueueEvent("new", type, name, value, action, originADT, lineNum);
        return name;
    };
    
    //returns the value of a variable given a name
    //returns false if name not in most recent iteration of symbolTable, or if variable has been removed
    SymbolTable.prototype.getValue = function(name) {
        //console.log('Symbol Table: getValue(' + name +');');
        var curTable = this.table[this.table.length-1];
        for (var i = 0; i < curTable.length; i++) {
            if (curTable[i][1] == name && curTable[i][3] != 'remove') {
                return curTable[i][2];
            }
        }
        return false;
    };

    SymbolTable.prototype.throwError = function(lineNum, error) {
        $("#modal").hide();
        $("#helptext").hide();
        $("#listHelp").hide();
        $("#stackHelp").hide();
        $("#queueHelp").hide();
        $("#graphHelp").hide();
        $("#treeHelp").hide();
        $("#dictHelp").hide();
        $("#exitHelp").hide();
        $("#build").hide();
        $("#sample").hide();
        $("#help").hide();
        $("#stop").show();
        this.visualizerHandler.highlightLine(lineNum, "red");
        this.visualizerHandler.displayError(error);

    }

});