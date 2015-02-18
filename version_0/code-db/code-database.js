$(document).ready(function () {
    CodeDatabase = function() {
        //hash table of code samples
        this.database = new Object();
        this.database['list'] = 
            ['List<Integer> s = new List<Integer>();',
             'List<Integer> t = new List<Integer>();',
             's.populate(4);',
             's.add(2);',
             'for (int i = 0; i < s.size(); i++) {',
             '\t t.add(s.get(i));',
             '}'
            ].join('\n');
        this.database['stack'] = 
            ['Stack<String> s = new Stack<String>();',
            's.push("hello");',
            's.push("world");',
            'String curItem = s.peek();',
            'while (s.isEmpty() == false) {',
            '\t s.pop();',
            '\t curItem = s.peek();',
            '}',
            's.populate(5);',
            's.push("item");',
            'int x = s.search("item");'
            ].join('\n');
        this.database['queue'] =
            ['Queue<Integer> q = new Queue<Integer>();',
            'q.populate(3);',
            'q.add(70);',
            'int size = q.size();',
            'q.remove();'
            ].join('\n');
        this.database['priorityQueue'] =
            ['PriorityQueue<Integer> q = new PriorityQueue<Integer>();',
            'q.populate(3);',
            'q.add(4);',
            'int size = q.size();',
            'q.remove();'
            ].join('\n');
        this.database['graph'] =
            ['Graph g = new Graph();',
            'g.addEdge(0,1);',
            'g.addEdge(1,2);',
            'g.addEdge(0,2);',
            'int x = g.outDegree(0);'
            ].join('\n');
        this.database['tree'] =
            ['Tree t = new Tree();',
            't.populate(6);',
            't.removeVertex(5);'
            ].join('\n');
        this.database['dict'] =
            ['Dictionary<String, Integer> d = new Dictionary<String, Integer>();',
            'd.populate(5);',
            'd.put("hello",4);',
            'int x = d.get("hello);'
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
