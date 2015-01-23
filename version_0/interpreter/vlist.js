/*
* VList.js
*/

$(document).ready(function () {
   
    VList = function(t) {
        this.vals = [];
        this.storeType = t;
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