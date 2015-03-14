/**
* Tree ADT
* Types supported: All verticies are integers
* Methods supported: populate, setRoot, addChild, getParent, getChildren, getChild, removeChild, removeVertex
* Authors: Sarah LeBlanc and Colby Seyferth
* ADTeach Team
*/

$(document).ready(function () {
   
    VTree = function(t) {
    }
    
    
    /**
    *
    * Return the supported methods for the Tree ADT
    *
    *@return {Object} List of supported methods
    *
    **/
    VTree.prototype.listMethods = function() {
        var methods = ['populate', 'setRoot', 'addChild', 'getParent', 'getChildren', 'getChild', 'removeChild', 'removeVertex'];
        return methods;
    }
    
    
    /**
    *
    *Error checking for number of parameters needed against number of parameters given
    *
    *@param {string} method - The method being called
    *@param {Object} parameters - The list of parameters being passed in
    *
    *@return {Boolean} Returns true if the number of given parameters matches number of 
    *                   required parameters for method.
    *
    **/
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
    
    
    
    /**
    *
    * Performs the method 
    *
    *@param {string} type - the type of Tree
    *@param {string} method - the method being called
    *@param {Object} parameters - a list of the parameters passed in
    *@param {Object} env - the working environment
    *@param {Object} root - the FunCall block 
    *@param {string} adt - the variable name for the ADT
    *
    *@return {Object} [returnValue, valueCopy, valType] - a list containing the value returned from method,
    *                       the updated value of the ADT, and the correct type of the returned value.
    *
    **/
    VTree.prototype.performMethod = function(type, method, parameters, env, root,adt) {
        var returnValue = null;
        var valueCopy = [];
        var origValue = env.getVariables()[env.getIndex(adt)].value;
        for (var i = 0; i < origValue.length; i++){
            valueCopy[i]=(origValue[i]);   
        }
        
        if (method == "setRoot") {
            if (valueCopy.length == 0) {
                valueCopy.push([parameters[0].value, null, []]);
                return [returnValue, valueCopy];
            } else if (typeof parameters[0].value != typeof 1) {
                env.throwError(root.linenum);
                root.error();
            } else if (parameters[0].value.toString().indexOf('.') >= 0) {
                env.throwError(root.linenum);
                root.error();
            } else {
                var newValue = [];
                newValue.push([parameters[0].value, null, valueCopy[0][0]]);
                var oldRoot = valueCopy[0];
                oldRoot[1] = parameters[0].value;
                newValue.push(oldRoot);
                for (var i = 1; i < valueCopy.length; i++) {
                    newValue.push(valueCopy[i]);
                }
                valueCopy = newValue;
                return [returnValue, valueCopy];
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
            
            var valueCopyCopy = [];
            var seenVertex = false;
            for (var k = 0; k < valueCopy.length; k++) {
                valueCopyCopy.push(valueCopy[k]);
                if (valueCopy[k][0] == vertex) {
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
                for (var i = 0; i < valueCopy.length; i++) {
                    var currentTreeNode = valueCopyCopy[i];
                    var currValue = currentTreeNode[0];
                    if (currValue == vertex) {
                        var currChildrenCopy = [];
                        for (var j = 0; j < currentTreeNode[2].length; j++) {
                            currChildrenCopy.push(currentTreeNode[2][j]);
                        }
                        currChildrenCopy.push(child);
                        valueCopyCopy[i][2] = currChildrenCopy;
                        valueCopyCopy.push([child, currValue, []]);
                    }
                }
                valueCopy = valueCopyCopy;
                return [returnValue, valueCopy];
            }
            
            if (parameters.length == 3) {
                for (var i = 0; i < valueCopy.length; i++) {
                    var currentTreeNode = valueCopyCopy[i];
                    var currValue = currentTreeNode[0];
                    if (currValue == vertex) {
                        var currChildrenCopy = [];

                        var first = currentTreeNode[2].slice(0, pos);
                        var second = child;
                        var third = currentTreeNode[2].slice(pos);
                        
                        currChildrenCopy = first.concat(second).concat(third); 

                        valueCopyCopy[i][2] = currChildrenCopy;
                        valueCopyCopy.push([child, currValue, []]);
                    }
                }
                valueCopy = valueCopyCopy;
                return [returnValue, valueCopy];
            }
            
        }
        
        if (method == 'getParent') {
            var vertex = parameters[0].value;
            var parent;
            for (var i = 0; i < valueCopy.length; i++) {
                var currTreeNode = valueCopy[i];
                var currValue = currTreeNode[0];
                if (currValue == vertex) {
                    parent = currTreeNode[1];
                }
            }
            returnValue = parent;
            return [returnValue, valueCopy, "int"];
        }
        
        if (method == "getChildren") {
            var vertex = parameters[0].value;
            var children;
            for (var i = 0; i < valueCopy.length; i++) {
                var currTreeNode = valueCopy[i];
                var currValue = currTreeNode[0];
                if (currValue == vertex) {
                    children = currTreeNode[2];
                }
            }
            returnValue = children;
            return [returnValue, valueCopy, "List<Integer>"];
        }
        
        if (method == "getChild") {
            var vertex = parameters[0].value;
            var child = parameters[1].value;
            
            for (var i = 0; i < valueCopy.length; i++) {
                var currTreeNode = valueCopy[i];
                var currValue = currTreeNode[0];
                if (currValue == vertex) {
                    child = currTreeNode[2][child];
                }
            }
            returnValue = child;
            return [returnValue, valueCopy, "int"];
        }
        
        if (method == "removeChild") {
            var vertex = parameters[0].value;
            var child = parameters[1].value;
            var childrenToRemove = [];
            
            var valueCopyCopy = [];
            var seenVertex = false;
            for (var k = 0; k < valueCopy.length; k++) {
                valueCopyCopy.push(valueCopy[k]);
                if (valueCopy[k][0] == vertex) {
                    seenVertex = true;
                }
            }
            
            if (seenVertex != true) {
                env.throwError(root.linenum);
                console.log("Vertex not in graph");
                root.error("Node not in graph");
                //Throw error
            }
            
            if (typeof child != typeof 1 || typeof vertex != typeof 1) {
                env.throwError(root.linenum);
                root.error();
            }
            
            for (var i = 0; i < valueCopyCopy.length; i++) {
                var currentTreeNode = valueCopyCopy[i];
                var currValue = currentTreeNode[0];
                if (currValue == vertex) {
                    if (currentTreeNode[2].length <= child) {
                        env.throwError(root.linenum);
                        root.error("No child in that position");
                    }
                    
                    
                    var childVertex = currentTreeNode[2][child];
                    childrenToRemove.push(childVertex);
                    var currChildrenCopy = [];
                    
                    for (var j = 0; j < currentTreeNode[2].length; j++) {
                        if (currentTreeNode[2][j] != childVertex) {
                            currChildrenCopy.push(currentTreeNode[2][j]);
                        }
                    }
                    
                    console.log("Leftover children: ", currChildrenCopy);
                    valueCopyCopy[i][2] = currChildrenCopy;
                    
                    while (childrenToRemove.length != 0) {
                        for (var k = 0; k < valueCopyCopy.length; k++) {
                            var currVertex = valueCopyCopy[k];
                            console.log("Curr vertex is: ", currVertex);
                            var value = currVertex[0];
                            if (value == childrenToRemove[0]) {
                                for (var m = 0; m < currVertex[2].length; m++) {
                                    childrenToRemove.push(currVertex[2][m]);
                                }
                                valueCopyCopy[k] = null;
                                childrenToRemove.splice(0, 1);
                            }
                        }
                    }
                    break;
                }
            }
            var cleanUp = [];
            for (var b = 0; b < valueCopyCopy.length; b++) {
                if (valueCopyCopy[b] != null) {
                    cleanUp.push(valueCopyCopy[b]);
                }
            }
            valueCopy = cleanUp;
            return [returnValue, valueCopy];
            
         
        }
        
        if (method == "removeVertex") {
            var vertex = parameters[0].value;
            
            var valueCopyCopy = [];
            var justVertices = [];
            var seenVertex = false;
            for (var k = 0; k < valueCopy.length; k++) {
                valueCopyCopy.push(valueCopy[k]);
                justVertices.push(valueCopy[k][0]);
                if (valueCopy[k][0] == vertex) {
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
            
            for (var j = 0; j < valueCopyCopy.length; j++) {
                var currentTreeNode = valueCopy[j];
                var currValue = currentTreeNode[0];
                if (currValue == vertex) {
                    var children = valueCopy[j][2];
                    var parent = valueCopy[j][1];
                    var parentIndex = justVertices.indexOf(parent);
                    var otherChildren = valueCopyCopy[parentIndex][2];
                    otherChildren.splice(otherChildren.indexOf(currValue), 1);
                    
                    for (var i = 0; i < valueCopyCopy.length; i++) {
                        var currentTreeNode2 = valueCopyCopy[i];
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
            valueCopy = newList;
            return [returnValue, valueCopy];
        
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
            
            valueCopy = tree;
            return [returnValue, valueCopy];
                
        }
        
    }
    
    
});