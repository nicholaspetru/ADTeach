/*
* VQueue.js
*/

$(document).ready(function () {
   
    VQueue = function(t) {
        this.front = [];
        this.storeType = t;
    }
    
    VQueue.prototype.dequeue = function() {
        return this.front.pop();
    }
    
    VQueue.prototype.push = function(value) {
        return this.front.push(value);
    }
    
    VQueue.prototype.isEmpty = function() {
        return (this.front.length == 0);
    }
    
    VQueue.prototype.getValue = function() {
        return this.front;
    }
    
    VQueue.prototype.getType = function() {
        return "Queue";
    }
});