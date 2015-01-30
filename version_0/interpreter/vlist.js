/*
* VList.js
*/

$(document).ready(function () {
   
    VList = function(t) {
        this.vals = [];
        this.storeType = t;
    }
    
    VList.prototype.listMethods = function() {
        var methods = ["add", "contains", "get", "indexOf", "isEmpty", "remove", "set", "size"];
        return methods;
    }
    
    VList.prototype.checkParameters = function(method, parameters) {
        var oneParam = ['add', 'get', 'contains', 'indexOf', 'remove'];
        var zeroParam = ['isEmpty', 'size'];
        if (oneParam.indexOf(method) > 0) {
            if (parameters[1] != null) {
                console.log("Only one parameter");
            }
        } else if (zeroParam.indexOf(method) > 0) {
            if (parameters[0] != null) {
                console.log("No parameters");
            }
        } else {
            if (parameters[0] == null && parameters[1] == null && parameters[3] != null) {
                console.log("Two parameters needed");
            }
        }
        return true;
    }
    
    VList.prototype.performMethod = function(type, origValue, method, parameters) {
        var returnValue = null;
        if (method == 'add') {
            origValue.push(parameters[0]);
            return [returnValue, origValue];
        }
    }
    
    VList.prototype.add = function(e) {
        this.vals.push(e);
    }
    
    VList.prototype.contains = function(e) {
        var contain = vals.indexOf(e);
        return (contain > 0);
    }
    
    VList.prototype.get = function(i) {
        if (i > (this.vals.length -1)) {
            console.log("Index out of bounds");
            //new IndexOutOfBoundsException();
        }
        return this.vals[i];
    }
    
    VList.prototype.indexOf = function(i) {
        for (j = 0; j < this.vals.length; j++) {
            if (this.vals[j] == i) {
                return this.vals.indexOf(j);
            }
        }
    }
    
    VList.prototype.isEmpty = function() {
        return (this.vals.length == 0);
    }
    
    VList.prototype.remove = function(i) {
        var newList = [];
        for (j = 0; j < this.vals.length; j++) {
            if (j != i) {
                newList.push(this.vals[j]);
            }
        this.vals = newList;
        }
    }
    
    VList.prototype.set = function(i, e) {
        if (i > this.vals.length) {
            console.log("Index out of bounds");
            //new IndexOutOfBoundException();
        }
        for (j = 0; j < this.vals.length; j++) {
            if (j == i) {
                this.vals[j] = e;
            }
        }
    }
    
    VList.prototype.size = function() {
        return this.vals.length;
    }
    
});