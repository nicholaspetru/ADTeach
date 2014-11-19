$(document).ready(function () {
    CodeDatabase = function(database) {
        //the list of entities
        this.database = database;
        return this;
    }
    
    CodeDatabase.prototype.getCode = function(key) {
        //given some key, returns the associated value in the database
        //if we want database to be a hash table: 
        //(write our own) http://www.mojavelinux.com/articles/javascript_hashes.html
        //(use a library) http://www.timdown.co.uk/jshashtable/
        console.log('Code Database: getCode(' + key + ')');
        var code = 'int x = 5;\nStack<Integer> s = new Stack<Integer>();\ns.push(x);\ns.pop();'
        return code;
    };
    
});
