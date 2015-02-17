/*
* VTree.js
*/

$(document).ready(function () {
   
    VTree = function(t) {
    }
    
    VTree.prototype.listMethods = function() {
        var methods = ['populate', 'setRoot', 'addChild', 'getParent', 'getChildren', 'getChild', 'removeChild', 'removeVertex'];
        return methods;
    }
    
    VTree.prototype.checkParameters = function(method, parameters) {
        var oneParam = ['populate', 'setRoot', 'getParent', 'getChildren', 'removeVertex'];
        var twoParam = ['getChild', 'removeChild'];
        if (oneParam.indexOf(method) >= 0) {
            if (parameters.length != 1) {
                console.log("one parameters");
                return false;
                //new IncorrectParameters();
            }
        }
        if (twoParam.indexOf(method) >= 0) {
            if (parameters.length != 2) {
                console.log("two parameters");
                return false;
                //new IncorrectParameters();
            }
        }
        if (method == "addChild") {
            if (parameters.length != 2 && parameters.length != 3) {
                return false;   
            }
        }
        return true;
    }
    
    VTree.prototype.performMethod = function(type, origValue1, method, parameters, env, root) {
        var returnValue = null;
        var origValue = [];
        for (var i = 0; i < origValue1.length; i++){
            origValue[i]=(origValue1[i]);   
        }
        
        if (method == "setRoot") {
            if (origValue.length == 0) {
                origValue.push([parameters[0].value, null, []]);
                return [returnValue, origValue];
            } else if (typeof parameters[0].value != typeof 1) {
                env.throwError(root.linenum);
                root.error();
            } else if (parameters[0].value.toString().indexOf('.') >= 0) {
                env.throwError(root.linenum);
                root.error();
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
            if (parameters.length == 3) {
                var pos = parameters[2].value;
                if (pos != 0 && pos != 1) {
                    env.throwError(root.linenum);
                    root.error();
                }
            }
            
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
            
            if (typeof child != typeof 1 || child.toString().indexOf('.') >= 0) {
                env.throwError(root.linenum);
                root.error();
            }
            
            if (parameters.length == 2) {
                for (var i = 0; i < origValue.length; i++) {
                    var currentTreeNode = origValueCopy[i];
                    var currValue = currentTreeNode[0];
                    if (currValue == vertex) {
                        var currChildrenCopy = [];
                        for (var j = 0; j < currentTreeNode[2].length; j++) {
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
            
            if (parameters.length == 3) {
                for (var i = 0; i < origValue.length; i++) {
                    var currentTreeNode = origValueCopy[i];
                    var currValue = currentTreeNode[0];
                    if (currValue == vertex) {
                        var currChildrenCopy = [];

                        var first = currentTreeNode[2].slice(0, pos);
                        var second = child;
                        var third = currentTreeNode[2].slice(pos);
                        
                        currChildrenCopy = first.concat(second).concat(third); 

                        origValueCopy[i][2] = currChildrenCopy;
                        origValueCopy.push([child, currValue, []]);
                    }
                }
                origValue = origValueCopy;
                return [returnValue, origValue];
            }
            
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
            return [returnValue, origValue, "int"];
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
            return [returnValue, origValue, "List<Integer>"];
        }
        
        if (method == "getChild") {
            var vertex = parameters[0].value;
            var child = parameters[1].value;
            
            for (var i = 0; i < origValue.length; i++) {
                var currTreeNode = origValue[i];
                var currValue = currTreeNode[0];
                if (currValue == vertex) {
                    child = currTreeNode[2][child];
                }
            }
            returnValue = child;
            return [returnValue, origValue, "int"];
        }
        
        if (method == "removeChild") {
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
            
            if (typeof child != typeof 1 || child.toString().indexOf('.') >= 0
               || typeof vertex != typeof 1 || vertex.toString().indexOf('.') >= 0) {
                env.throwError(root.linenum);
                root.error();
            }
            
            if (parameters.length == 2) {
                for (var i = 0; i < origValue.length; i++) {
                    var currentTreeNode = origValueCopy[i];
                    var currValue = currentTreeNode[0];
                    if (currValue == vertex) {
                        var currChildrenCopy = [];
                        for (var j = 0; j < currentTreeNode[2].length; j++) {
                            var first = currentTreeNode[2].slice(0, child);
                            var second = currentTreeNode[2].slice(child+1);
                            currChildrenCopy = first.concat(second);
                        }
                        origValueCopy[i][2] = currChildrenCopy;
                        origValueCopy.push([child, currValue, []]);
                    }
                }
                origValue = origValueCopy;
                return [returnValue, origValue];
            }
         
        }
        
        if (method == "removeVertex") {
            var vertex = parameters[0].value;
            
            var origValueCopy = [];
            var justVertices = [];
            var seenVertex = false;
            for (var k = 0; k < origValue.length; k++) {
                origValueCopy.push(origValue[k]);
                justVertices.push(origValue[k][0]);
                if (origValue[k][0] == vertex) {
                    seenVertex = true;
                }
            }
            
            if (seenVertex != true) {
                env.throwError(root.linenum);
                console.log("Vertex not in graph");
                root.error("Node not in graph");
            }
            
            if (typeof vertex != typeof 1 || vertex.toString().indexOf('.') >= 0) {
                env.throwError(root.linenum);
                root.error();
            }
            
            var newList = [];
            
            for (var j = 0; j < origValueCopy.length; j++) {
                var currentTreeNode = origValue[j];
                var currValue = currentTreeNode[0];
                if (currValue == vertex) {
                    var children = origValue[j][2];
                    var parent = origValue[j][1];
                    var parentIndex = justVertices.indexOf(parent);
                    var otherChildren = origValueCopy[parentIndex][2];
                    otherChildren.splice(otherChildren.indexOf(currValue), 1);
                    
                    for (var i = 0; i < origValueCopy.length; i++) {
                        var currentTreeNode2 = origValueCopy[i];
                        var currValue2 = currentTreeNode2[0];
                        
                        if (currValue2 == parent) {
                            var newChildren = [];
                            var parentChildren = 0;
                        }
                        
                        if (currValue2 != currValue && children.indexOf(currValue2) < 0) {
                            newList.push(currentTreeNode2);
                        }
                    }
                    
                    
                }
            }
            origValue = newList;
            return [returnValue, origValue];
        
        }
        
        if (method == "populate") {
            var tree = [];
            var vertices = [];
            var values = [];
            var parents = [];
            var parentVertices = [];
            var children = [];
            var numVertices = parameters[0].value;
            var count = 0;
            
            //Create vertices
            while (count < numVertices) {
                var randomV = Math.floor((Math.random() * 100) + 1);
                while (values.indexOf(randomV) >= 0) {
                    randomV = Math.floor((Math.random() * 100) + 1);
                }
                var vertex = [randomV, null, []];
                values.push(randomV);
                vertices.push(vertex);
                count += 1;
            }
            //Make connections
            //Choose root:
            var randomRoot = Math.floor((Math.random()*numVertices-1) + 1);
            var root = [values[randomRoot], null, []];
            
            for (var i = 0; i < vertices.length; i++) {
                parents.push(vertices[i]);
                parentVertices.push(vertices[i][0]);
                if (i != 0) {
                    children.push(vertices[i]);
                }
            }
            
            //Connect root
            var numChildren = Math.floor((Math.random()*2) + 1)
            console.log("Vertices are: ", values);
            var parValue = parents[0][0];
            numChildren = 2;
            //Root:
            //one child
            if (children.length != 0) {
                if (numChildren == 1) {
                    var child1 = children[0][0];
                    parents[0][2].push(children[0][0]);
                    parents[parentVertices.indexOf(child1)][1] = parents[0][0];
                    children.splice(0, 1);
                } 

                //root has two child
                else if (numChildren == 2) {
                    console.log("Trying to set: ", children);
                    var child1 = children[0][0];
                    parents[0][2].push(children[0][0]);
                    parents[parentVertices.indexOf(child1)][1] = parValue;
                    if (children.length >= 2) {
                        var child2 = children[1][0];
                        parents[0][2].push(children[1][0]);
                        parents[parentVertices.indexOf(child2)][1] = parents[0][0];
                    }
                    children.splice(0, 2);

                }
            } else {
                parents[0][2] = [];
            }
            console.log("Children are now: ", children);
            tree.push(parents[0]);
            console.log("Tree is: ", tree);
            
            parents.splice(0, 1);
            parentVertices.splice(0, 1);
            
            
            while (children.length != 0) {
                numChildren = Math.floor((Math.random()*2) + 1);
                
                if (numChildren == 1) {
                    var child1 = children[0][0];
                    parents[0][2].push(children[0][0]);
                    parents[parentVertices.indexOf(child1)][1] = parents[0][0];
                    tree.push(parents[0]);
                    children.splice(0, 1);
                    parents.splice(0, 1);
                    parentVertices.splice(0, 1);
                    continue;
                    
                } else if (numChildren == 2) {
                    console.log("Parents are: ", parents);
                    var child1 = children[0][0];
                    parents[0][2].push(children[0][0]);
                    parents[parentVertices.indexOf(child1)][1] = parents[0][0];
                    if (children.length >= 2) {
                        var child2 = children[1][0];
                        parents[0][2].push(children[1][0]);
                        parents[parentVertices.indexOf(child2)][1] = parents[0][0];
                    }
                    tree.push(parents[0]);
                    children.splice(0, 2);
                    parents.splice(0, 1);
                    parentVertices.splice(0, 1);
                }
            }
            
            for (var j = 0; j < parents.length; j++) {
                tree.push(parents[j]);
            }
            console.log("Ending tree is: ", tree);
            console.log("Leftover parents: ", parents);
            
            origValue = tree;
            return [returnValue, origValue];
                
        }
        
    }
    
    
});