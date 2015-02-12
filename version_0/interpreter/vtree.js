/*
* VTree.js
*/

$(document).ready(function () {
   
    VTree = function(t) {
    }
    
    VTree.prototype.listMethods = function() {
        var methods = ['populate', 'setRoot', 'addChild', 'addLeftChild', 'addRightChild', 'getParent', 'getChildren', 'getLeftChild', 'getRightChild', 'removeChild', 'removeVertex'];
        return methods;
    }
    
    VTree.prototype.checkParameters = function(method, parameters) {
        var oneParam = ['populate', 'setRoot', 'getParent', 'getChildren', 'getLeftChild', 'getRightChild', 'removeChild', 'removeVertex'];
        if (oneParam.indexOf(method) >= 0) {
            if (parameters.length != 1) {
                console.log("one parameters");
                //new IncorrectParameters();
            }
        }
        var twoParam = ['addChild'];
        if (twoParam.indexOf(method) >= 0) {
            if (parameters.length != 2) {
                console.log("two parameters");
                //new IncorrectParameters();
            }
        }
        return true;
    }
    
    VTree.prototype.performMethod = function(type, origValue1, method, parameters) {
        var returnValue = null;
        var origValue = [];
        for (var i = 0; i<origValue1.length; i++){
            origValue[i]=(origValue1[i]);   
        }
        
        if (method == "setRoot") {
            if (origValue.length == 0) {
                origValue.push([parameters[0].value, null, []]);
                return [returnValue, origValue];
            } else {
                var newValue = [];
                newValue.push([parameters[0].value, null, origValue[0][0]]);
                var oldRoot = origValue[0];
                oldRoot[1] = parameters[0].value;
                newValue.push(oldRoot);
                for (var i = 1; i < origValue.length; i++) {
                    newValue.push(origValue[i]);
                }
                origValue = newValue;
                return [returnValue, origValue];
            }
        }
        
        if (method == "addChild") {
            var vertex = parameters[0].value;
            var child = parameters[1].value;
            var origValueCopy = [];
            
            for (var k = 0; k < origValue.length; k++) {
                origValueCopy.push(origValue[k]);
            }
            
            for (var i = 0; i < origValue.length; i++) {
                var currentTreeNode = origValueCopy[i];
                console.log("Current tree node is: ", currentTreeNode);
                var currValue = currentTreeNode[0];
                if (currValue == vertex) {
                    console.log("truuuuu");
                    var currChildrenCopy = [];
                    for (var j = 0; j < currentTreeNode[2].length; j++) {
                        console.log("Not crashing");
                        currChildrenCopy.push(currentTreeNode[2][j]);
                    }
                    currChildrenCopy.push(child);
                    origValueCopy[i][2] = currChildrenCopy;
                    origValueCopy.push([child, currValue, []]);
                }
            }
            origValue = origValueCopy;
            
            /*
            for (var i = 0; i < origValue.length; i++) {
                console.log("In first for");
                var currTreeNode = origValue[i];
                var currValue = currTreeNode[0];
                if (currValue == vertex) {
                    var currChildrenCopy = [];
                    for (var j = 0; j < currTreeNode[2]; j++) {
                        console.log("In second for");
                        currChildrenCopy.push(currTreeNode[2][j]);
                    }
                    currChildrenCopy.push(child);
                    origValue[i][2] = currChildrenCopy;
                    origValue.push([vertex, currValue, []]);
                }
            }
            */
            return [returnValue, origValue];
            
        }
        
        if (method == 'getParent') {
            var vertex = parameters[0].value;
            var parent;
            for (var i = 0; i < origValue.length; i++) {
                var currTreeNode = origValue[i];
                var currValue = currTreeNode[0];
                if (currValue == vertex) {
                    parent = currTreeNode[1];
                }
            }
            returnValue = parent;
            return [returnValue, origValue];
        }
        
        if (method == "getChildren") {
            var vertex = parameters[0].value;
            var children;
            for (var i = 0; i < origValue.length; i++) {
                var currTreeNode = origValue[i];
                var currValue = currTreeNode[0];
                if (currValue == vertex) {
                    children = currTreeNode[2];
                }
            }
            returnValue = children;
            return [returnValue, origValue];
        }
        
        if (method == "getLeftChild") {
            var vertex = parameters[0].value;
            var leftChild;
            for (var i = 0; i < origValue.length; i++) {
                var currTreeNode = origValue[i];
                var currValue = currTreeNode[0];
                if (currValue == vertex) {
                    if (currTreeNode.length != 0) {
                        leftChild = currTreeNode[2][0];
                    } else {
                        leftChild = null;
                    }
                }
            }
            returnValue = leftChild;
            return [returnValue, origValue];
        }
        
        if (method == "getRightChild") {
            var vertex = parameters[0].value;
            var rightChild;
            
            for (var i = 0; i < origValue.length; i++) {
                var currTreeNode = origValue[i];
                var currValue = currTreeNode[0];
                if (currValue == vertex) {
                    if (currTreeNode.length >= 2) {
                        rightChild = currTreeNode[2][1];
                    } else {
                        rightChild = null;
                    }
                }
            }
            returnValue = rightChild;
            return [returnValue, origValue];
        }
        
    }
    
    
});