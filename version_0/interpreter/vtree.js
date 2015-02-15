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
                return false;
                //new IncorrectParameters();
            }
        }
        var twoParam = ['addChild'];
        if (twoParam.indexOf(method) >= 0) {
            if (parameters.length != 2) {
                console.log("two parameters");
                return false;
                //new IncorrectParameters();
            }
        }
        return true;
    }
    
    VTree.prototype.performMethod = function(type, origValue1, method, parameters, env, root) {
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
            var seenVertex = false;
            for (var k = 0; k < origValue.length; k++) {
                origValueCopy.push(origValue[k]);
                if (origValue[k][0] == vertex) {
                    seenVertex = true;
                }
            }
            
            if (seenVertex != true) {
                env.throwError(root.linenum);
                console.log("Vertex not in graph");
                root.error("Node not in graph");
                //Throw error
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
            return [returnValue, origValue];
            
        }
        
        if (method == "addLeftChild") {
            var vertex = parameters[0].value;
            var leftChild = parameters[1].value;
            var origValueCopy = [];
            var seenVertex = false;
            for (var k = 0; k < origValue.length; k++) {
                origValueCopy.push(origValue[k]);
                if (origValue[k][0] == vertex) {
                    seenVertex = true;
                }
            }
            
            if (seenVertex != true) {
                env.throwError(root.linenum);
                console.log("Vertex not in graph");
                root.error("Vertex not in graph");
                //Throw error
            }
            
            for (var i = 0; i < origValue.length; i++) {
                var currentTreeNode = origValueCopy[i];
                var currValue = currentTreeNode[0];
                if (currValue == vertex) {
                    var currChildrenCopy = [];
                    var currentChildren = currentTreeNode[2];
                    if (currentChildren.length > 1) {
                        console.log("Already has two children");
                        //Throw error
                    } else {
                        currChildrenCopy.push(leftChild);
                        if (currentChildren[0] != null) {
                            currChildrenCopy.push(currentChildren[0]);
                        }
                        origValueCopy[i][2] = currChildrenCopy;
                        origValueCopy.push([leftChild, currValue, []]);
                    }
                }
            }
            origValue = origValueCopy;
            return [returnValue, origValue];
        }
        
        if (method == "addRightChild") {
            var vertex = parameters[0].value;
            var rightChild = parameters[1].value;
            var origValueCopy = [];
            var seenVertex = false;
            for (var k = 0; k < origValue.length; k++) {
                origValueCopy.push(origValue[k]);
                if (origValue[k][0] == vertex) {
                    seenVertex = true;
                }
            }
            
            if (seenVertex != true) {
                console.log("Vertex not in graph");
                //Throw error
            }
            
            for (var i = 0; i < origValue.length; i++) {
                var currentTreeNode = origValueCopy[i];
                var currValue = currentTreeNode[0];
                if (currValue == vertex) {
                    var currChildrenCopy = [];
                    var currentChildren = currentTreeNode[2];
                    if (currentChildren.length > 1) {
                        console.log("Already has two children");
                        //Throw error
                    } else {
                        if (currentChildren[0] != null) {
                            currChildrenCopy.push(currentChildren[0]);
                        }
                        currChildrenCopy.push(rightChild);
                        origValueCopy[i][2] = currChildrenCopy;
                        origValueCopy.push([rightChild, currValue, []]);
                    }
                }
            }
            origValue = origValueCopy;
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