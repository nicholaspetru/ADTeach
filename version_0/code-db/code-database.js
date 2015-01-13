$(document).ready(function () {
    CodeDatabase = function() {
        //hash table of code samples
        this.database = new Object();
        this.database['stack'] = 
            ['int x = 5;',
             'Stack<Integer> s = new Stack<Integer>();',
             's.push(x);\ns.pop();',
            ].join('\n');
        this.database['stack2'] = 
            ['Stack<String> s = new Stack<String>();',
            's.push("hello")',
            's.push("world");',
            ].join('\n');
        return this;
    }

    CodeDatabase.prototype.getCode = function(key) {
        //given some key, returns the associated value in the database
        console.log('Code Database: getCode(' + key + ')');
        var code = this.database[key];
        return code;
    };
    
});
