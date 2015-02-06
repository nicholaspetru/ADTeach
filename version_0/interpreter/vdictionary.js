/*
* VDictionary.js
*/

$(document).ready(function () {
   
    VDictionary = function(t) {
        this.data = {};
        this.storeType = t;
    }
    
    VDictionary.prototype.listMethods = function() {
        var methods = ['elements', 'get', 'isEmpty', 'keys', 'put', 'remove', 'size'];
        return methods;
    }
    
    VDictionary.prototype.checkParameters = function(method, parameters) {
        var oneParam = ['get', 'remove'];
        var zeroParam = ['elements', 'isEmpty', 'keys', 'size'];
        if (oneParam.indexOf(method) >= 0) {
            if (parameters.length != 1) {
                console.log("Only takes one parameter");
            }
        } else if (zeroParam.indexOf(method) >= 0) {
            if (parameters.length != 0) {
                console.log("Does not take any parameters");
            }
        } else {
            if (parameters.length != 2) {
                console.log("Takes two parameters");
            }
        }
        return true;
    }
    
    VDictionary.prototype.getLength = function(array) {
        for (var i in array) {
            console.log(i);
        }
    }
    
    VDictionary.prototype.performMethod = function(type, origValue1, method, parameters) {
        var returnValue = null;
        var origValue = {};
        var length = 0;
        for (var i in origValue1){
            origValue[i] = origValue1[i];
            length += 1;
        }
        if (method == 'get') {
            returnValue = origValue[parameters[0].value];
            return [returnValue, origValue];
        }
        if (method == 'elements') {
            returnValue = origValue.elements();
            return [returnValue, origValue];
        }
        if (method == 'isEmpty') {
            returnValue = (length == 0);
            return [returnValue, origValue];
        }
        if (method == 'keys') {
            var keys = [];
            for (i in origValue) {
                keys.push(i);
            }
            returnValue = keys;
            return [returnValue, origValue];
        }
        if (method == 'size') {
            returnValue = length;
            return [returnValue, origValue];
            
        }
    }
});