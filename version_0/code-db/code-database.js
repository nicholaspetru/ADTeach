$(document).ready(function () {
    CodeDatabase = function() {
        //hash table of code samples
        this.database = new Object();
        this.database['stack'] = 
            ['List<Integer> s = new List<Integer>();',
             'List<Integer> t = new List<Integer>();',
             's.populate(4);',
             's.add(2);',
             'for (int i = 0; i < s.size(); i++) {',
             '\t t.add(s.get(i));',
             '}'
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
