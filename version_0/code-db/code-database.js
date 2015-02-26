$(document).ready(function () {
    CodeDatabase = function() {
        //hash table of code samples
        this.database = new Object();
        this.database['list'] = 
            ['List<Integer> s = new List<Integer>();',
             's.populate(6);',
             'boolean sorted = false;',
             'int temp = 0;',
             'int count = 0;',
             'while(sorted == false) {',
             '  sorted = true;',
             '  for (int i = 1; i < s.size() - count; i++) {',
             '      if (s.get(i - 1) > s.get(i)) {',
             '          temp = s.get(i - 1);',
             '          s.set((i - 1), s.get(i));',
             '          s.set(i, temp);',
             '          sorted = false;',
             '      }',
             '  }',
             '  count++;',
             '}'
            ].join('\n');
        this.database['stack'] = 
            ['Stack<Integer> s = new Stack<Integer>();',
             'Stack<Integer> t = new Stack<Integer>();',
             's.populate(4);',
             's.push(2);', 
             'while (s.isEmpty() == false) {',
             '  t.push(s.pop());',
             '}'
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
            ['List<Integer> y = new List<Integer>();',
             'Graph g = new Graph();',
             'g.populate(5, 0.5);',
             'for (int i = 0; i < g.numVerts(); i++) {',
             '  y.add(g.getDegree(i));',
             '}'
            ].join('\n');
        this.database['weightedGraph'] =
            ['WeightedGraph g = new WeightedGraph();',
             'g.setDirected(true);',
             'g.populate(5, 0);',
             'g.addEdge(0,1,3);',
             'g.addEdge(1,2,7);',
             'g.addEdge(0,2,0);',
             'int x = g.getWeight(0,1);'
            ].join('\n');
        this.database['tree'] =
            ['Tree t = new Tree();',
            't.populate(6);'
            ].join('\n');
        this.database['dict'] =
            ['List<String> firstLetters = new List<String>();',
             'Dictionary<String, Integer> d = new Dictionary<String, Integer>();',
             'List<Integer> values = new List<Integer>();',
             'firstLetters.add("S");',
             'firstLetters.add("C");',
             'firstLetters.add("E");',
             'firstLetters.add("N");',
             'firstLetters.add("B");',
             'firstLetters.add("L");',
             'values.populate(6);',
             'for (int i = 0; i < firstLetters.size(); i++) {',
             '  d.put(firstLetters.get(i), values.get(i));',
             '}'
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
