// based on http://stackoverflow.com/questions/9956186/raphael-js-maintain-path-between-two-objects
Raphael.fn.connect = function(fromNode, toNode, isDirected, isWeighted, w, wAttr) {
    // get the circle of the data unit
    var obj1 = fromNode.vis[1];
    var obj2 = toNode.vis[1];
    // maintain list of paths each object has
    if (!obj1.connections) obj1.connections = []
    if (!obj2.connections) obj2.connections = []
    // get the (x,y) center of each node
    var c1x, c1y, c2x, c2y;
    if (obj1.type === "circle") {
        c1x = obj1.attr("cx");
        c1y = obj1.attr("cy");
    }
    if (obj2.type === "circle") {
        c2x = obj2.attr("cx");
        c2y = obj2.attr("cy");
    }

    // create a path from circle1 to circle2
    var p = this.path("M" + c1x + "," + c1y
                        + " L" + c2x + "," + c2y);

    // if the graph is directed, put an arrowhead at the radius of node2
    if (isDirected) {
        p.isDirected = true;
        var totalLen = p.getTotalLength(); // get the total length of the path
        var intLen = totalLen - obj2.attr("r"); // subtract the length of circle2's radius
        var intersect = p.getPointAtLength(intLen); // get the point at this length
        var pathString = p.getSubpath(0,intLen); // create a subpath
        p.attr({
            path : pathString,
            'arrow-end': 'classic-wide-long'
        });
    }
    else {
        p.isDirected = false;
    }

    p.attr({"stroke-width": 1.5, "opacity":0});
    p.toBack();


    if (isWeighted) {
        var totalLen = p.getTotalLength();
        var mid = p.getPointAtLength((totalLen / 2));
        var wx = mid.x,
            wy = mid.y;
        if (mid.alpha == 180) {
            wy += -10;
        }
        else {
            wx += -13;
        }
        p.weight = this.text(wx,wy,(w.toString()));
        p.weight.attr(wAttr);
    }
    // set the from and to node for this edge
    p.from = obj1;
    p.to = obj2;
    p.fromNodeID = fromNode.id;
    p.toNodeID = toNode.id;

    // add the path to each of the circle objects
    obj1.connections.push(p)
    obj2.connections.push(p)

    return p;
};