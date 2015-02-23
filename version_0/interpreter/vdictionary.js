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
                return false;
            }
        }
        
        if (oneParam.indexOf(method) >= 0) {
            if (parameters.length != 1) {
                console.log("Only takes one parameter");
                return false;
            }   
        }  
            
        if (twoParam.indexOf(method) >= 0) {
            if (parameters.length != 2) {
                console.log("Takes two parameters");
                return false;
            }
        }
        
        return true;
    }
    
    VDictionary.prototype.getType = function(val) {
        if (val.length == 2 && val[1] == "float") {
            return "float";
        } else if (typeof val == typeof 1) {
            return "int";
        } else if (typeof val == typeof "h") {
            return "String";
        } else if  (typeof val == typeof true) {
            return "bool";
        }
    }
    
    VDictionary.prototype.containsKey = function(key, dict) {
        //console.log("checking for the key: ", key);
        var keys = [];
        for (var i in dict) {
            keys.push(i);
        }
        if (keys.indexOf('"' + key + '"') >= 0) {
            return true;
        } else {
            return false;
        }
    }
    
    VDictionary.prototype.performMethod = function(type, origValue1, method, parameters, env, root) {
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
                valueType = "boolean";
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
            console.log("Getting: ", key);
            console.log("Against: ", getType);
            if (getType != keyType) {
                env.throwError(root.linenum);
                console.log("Incompatible Types!");
                root.error("Incompatible types");
                //Throw Error
            }
            returnValue = origValue[parameters[0].value];
            return [returnValue, origValue, valueType];
        }
        
        if (method == 'elements') {
            var valType;
            switch (valueType) {
                case "int":
                    valType = "List<Integer>";
                    break;
                case "String":
                    valType = "List<String>";
                    break;
                case "float":
                    valType = "List<Float>";
                    break;
            }
            returnValue = [];
            for (var i in origValue) {
                returnValue.push(origValue[i]);
            }
            return [returnValue, origValue, valType];
        }
        
        if (method == 'isEmpty') {
            returnValue = (origValue.length == 0);
            return [returnValue, origValue, "boolean"];
        }
        
        if (method == 'keys') {
            var valType;
            switch (keyType) {
                case "int":
                    valType = "List<Integer>";
                    break;
                case "String":
                    valType = "List<String>";
                    break;
                case "float":
                    valType = "List<Float>";
                    break;
            }
            console.log("IN HEREEEEEEEE");
            var keys = [];
            console.log("Orig value is: ", origValue);
            for (i in origValue) {
                console.log("i is: ", i);
                console.log(typeof i);
                keys.push(i);
            }
            returnValue = keys;
            return [returnValue, origValue, valType];
        }
        
        if (method == 'size') {
            var count = 0;
            for (var i in origValue) {
                count += 1;
            }
            returnValue = count;
            return [returnValue, origValue, "int"];
            
        }
        
        if (method == "put") {
            var key = parameters[0].value;
            if (this.containsKey(key, origValue) == true) {
                env.throwError(root.linenum);
                root.error();
            }
            var value = parameters[1].value;
            var keyT = this.getType(key);
            var valueT = this.getType(value);
            console.log("key type is: ", keyT, " wanting: ", keyType);
            if (keyT != keyType || valueT != valueType) {
                env.throwError(root.linenum);
                console.log("Incompatible Types!");
                root.error("Incompatible types");
                //Throw an error
            }
            origValue[key] = value;
            return [returnValue, origValue];
        }
        
        if (method == "remove") {
            var keyToRemove = parameters[0].value;
            console.log("Key to remove: ", keyToRemove, typeof keyToRemove);
            console.log("Looking at: ", keyType, "against ", this.getType(keyToRemove));
            if (this.getType(keyToRemove) != keyType) {
                env.throwError(root.linenum);
                console.log("Incompatible key types");
                root.error("Incompatible types");
            }
            var newDictionary = {};
            var isSeen = false;
            for (var i in origValue) {
                if (i != keyToRemove) {
                    newDictionary[i] = origValue[i];
                } if (i == keyToRemove) {
                    isSeen = true;
                }
            }
            if (isSeen != true) {
                env.throwError(root.linenum);
                console.log("key not in dictionary");
                root.error("Not in dictionary");
            }
            
            origValue = newDictionary;
            return [returnValue, origValue];
        }
        
        if (method == "populate") {
            var numKeys = parameters[0].value;
            var dict = {};
            
            var alph;
            //Generate alph
            var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            
            
            
            
            var alph = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

            var toPush;
            var count = 0;
            console.log("Size is: ", dict.size);
            while(count < numKeys) {
                
                if (keyType == "int") {
                    toPush = Math.floor((Math.random()*100) + 1);
                    console.log("Going to push: ", typeof toPush);
                    if (this.containsKey(toPush, dict) != true) {
                        dict[toPush] = 0;
                        count += 1;
                    }
                }
                else if (keyType == "String") {
                    var word = '';
                    for (var n = 0; n < 3; n++) {
                        toPush = Math.floor((Math.random()*alph.length-1) + 1);
                        word += alph[toPush];
                    }
                    if (this.containsKey('"' + word + '"', dict) != true) {
                        dict['"' + word + '"'] = 0;
                        count += 1;
                    }
                    
                }
                else if (keyType == "float") {
                    toPush = parseFloat((Math.random()*(7.00 - 0.01) + 1).toFixed(2));
                    if (this.containsKey([toPush, "float"], dict) != true) {
                        dict[[toPush, "float"]] = 0;
                        count += 1;
                    }
                }
                //console.log("After count: ", count);
            }
            console.log("Count is: ", count);
            console.log("Dictionary to start is: ", dict);
            for (var j in dict) {
                console.log("j is: ", typeof j);
                if (valueType == "int") {
                    toPush = Math.floor((Math.random()*100) + 1);
                    dict[j] = toPush;
                }
                if (valueType == "String") {
                    toPush = Math.floor((Math.random() * 26) + 1);
                    dict[j] = '"' + alph[toPush] + '"';
                }
                if (valueType == "float") {
                    toPush = parseFloat((Math.random()*(7.00 - 0.01) + 1).toFixed(2));
                    dict[j] = [toPush, "float"];
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