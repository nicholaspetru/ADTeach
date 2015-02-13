/*
* VDictionary.js
*/

$(document).ready(function () {
   
    VDictionary = function(k, v) {
        console.log("CREATING A DICTIONARY");
        this.data = {};
        this.keyType = k;
        this.valueType = v;
    }
    
    VDictionary.prototype.listMethods = function() {
        console.log("IN here checking dictionary methods!!");
        var methods = ['elements', 'get', 'isEmpty', 'keys', 'put', 'remove', 'size', 'populate'];
        return methods;
    }
    
    VDictionary.prototype.checkParameters = function(method, parameters) {
        var zeroParam = ['elements', 'isEmpty', 'keys', 'size'];
        var oneParam = ['get', 'remove', 'populate'];
        var twoParam = ['put']
        
        if (zeroParam.indexOf(method) >= 0) {
            if (parameters.length != 0) {
                console.log("Does not take any parameters");
            }
        }
        
        if (oneParam.indexOf(method) >= 0) {
            if (parameters.length != 1) {
                console.log("Only takes one parameter");
            }   
        }  
            
        if (twoParam.indexOf(method) >= 0) {
            if (parameters.length != 2) {
                console.log("Takes two parameters");
            }
        }
        
        return true;
    }
    
    VDictionary.prototype.getType = function(val) {
        if (typeof val == typeof 1) {
            if (val.toString().indexOf(".") < 0) {
                return "int";
            } else {
                return "float";
            }
        } else if (typeof val == typeof "h") {
            return "String";
        } else if  (typeof val == typeof true) {
            return "bool";
        }
    }
    
    VDictionary.prototype.performMethod = function(type, origValue1, method, parameters) {
        var keyType;
        var valueJType;
        var valueType;
        console.log("TYPE IS: ", type);
        switch(type) {
            case "Dictionary<Integer, Integer>":
            case "Dictionary<Integer, String>":
            case "Dictionary<Integer, Boolean>":
            case "Dictionary<Integer, Float>":
                keyType = "int";
                break;
            case "Dictionary<String, Integer>":
            case "Dictionary<String, String>":
            case "Dictionary<String, Boolean>":
            case "Dictionary<String, Float>":
                keyType = "String";
                break;
            case "Dictionary<Float, Integer>":
            case "Dictionary<Float, String>":
            case "Dictionary<Float, Boolean>":
            case "Dictionary<Float, Float>":
                keyType = "float";
                break;
        }
        switch (type) {
            case "Dictionary<Integer, Integer>":
            case "Dictionary<String, Integer>":
            case "Dictionary<Float, Integer>":
                valueType = "int";
                break;
            case "Dictionary<Integer, String>":
            case "Dictionary<String, String>":
            case "Dictionary<Float, String>":
                valueType = "String";
                break;
            case "Dictionary<Integer, Boolean>":
            case "Dictionary<String, Boolean>":
            case "Dictionary<Float, Boolean>":
                valueType = "bool";
                break;
            case "Dictionary<Integer, Float>":
            case "Dictionary<String, Float>":
            case "Dictionary<Float, Float>":
                valueType = "float";
                break;
        }
        var returnValue = null;
        var origValue = {};
        var length = 0;
        for (var i in origValue1){
            origValue[i] = origValue1[i];
            length += 1;
        }
        
        if (method == 'get') {
            var key = parameters[0].value;
            var getType = this.getType(key);
            if (getType != keyType) {
                console.log("Incompatible Types!");
                //Throw Error
            }
            returnValue = origValue[parameters[0].value];
            return [returnValue, origValue];
        }
        
        if (method == 'elements') {
            returnValue = [];
            console.log("Original value is: ", origValue);
            
            for (var i in origValue) {
                returnValue.push(origValue[i]);
            }
            console.log("IN ELEMENTS");
            return [returnValue, origValue];
        }
        
        if (method == 'isEmpty') {
            returnValue = (origValue.length == 0);
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
            var count = 0;
            for (var i in origValue) {
                count += 1;
            }
            returnValue = count;
            return [returnValue, origValue];
            
        }
        
        if (method == "put") {
            var key = parameters[0].value;
            var value = parameters[1].value;
            var keyT = this.getType(key);
            var valueT = this.getType(value);
            console.log("key type is: ", keyT, " wanting: ", keyType);
            if (keyT != keyType || valueT != valueType) {
                console.log("Incompatible Types!");
                //Throw an error
            }
            origValue[key] = value;
            return [returnValue, origValue];
        }
        
        if (method == "remove") {
            var keyToRemove = parameters[0].value;
            var newDictionary = {};
            for (var i in origValue) {
                if (i != keyToRemove) {
                    newDictionary[i] = origValue[i];
                }
            }
            origValue = newDictionary;
            return [returnValue, origValue];
        }
        
        if (method == "populate") {
            var numKeys = parameters[0].value;
            var dict = {};
            var alph = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var toPush;
            for (var i = 0; i < numKeys; i++) {
                if (keyType == "int") {
                    toPush = Math.floor((Math.random()*100) + 1);
                    dict[toPush] = 0;
                }
                else if (keyType == "String") {
                    toPush = Math.floor((Math.random()*26) + 1);
                    dict[alph[toPush]] = 0;
                }
                else if (keyType == "float") {
                    toPush = (Math.random()*(7.00 - 0.01) + 1).toFixed(2);
                    dict[toPush] = 0;
                }
            }
            for (var j in dict) {
                if (valueType == "int") {
                    toPush = Math.floor((Math.random()*100) + 1);
                    dict[j] = toPush;
                }
                if (valueType == "String") {
                    toPush = Math.floor((Math.random() * 26) + 1);
                    dict[j] = alph[toPush];
                }
                if (valueType == "float") {
                    toPush = (Math.random()*(7.00 - 0.01) + 1).toFixed(2);
                    dict[j] = toPush;
                }
                if (valueType == "bool") {
                    toPush = Math.floor((Math.random() * 2) + 1);
                    if (toPush == 1) {
                        dict[j] = true;
                    } else {
                        dict[j] = false;
                    }
                }
            }
            origValue = dict;
            return [returnValue, origValue];
        }
            
    }
});