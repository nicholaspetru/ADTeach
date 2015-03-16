// based on: http://stackoverflow.com/questions/9956186/raphael-js-maintain-path-between-two-objects
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
    var p = this.path("M" + c1x + "," + c1y + " L" + c2x + "," + c2y);
    p.isDirected = isDirected;
    // directed edge 
    // put an arrowhead at the intersection of
    // the path and the center of node2
    var totalLen = p.getTotalLength(); // total length of the path
    var intLen = totalLen - obj2.attr("r"); // subtract the length of circle2's radius
    var a = p.getPointAtLength(intLen);
    var size = 7;
    p.head = this.arrowhead(c1x, c1y, (a.x), (a.y), size);
    p.attr({
        "stroke-width": 1.5,
        "opacity": 0,
        "stroke": "#4b4b4b"
    });
    p.toBack();

    // weighted edge
    if (isWeighted) {
        var totalLen = p.getTotalLength();
        var mid = p.getPointAtLength((totalLen / 2));
        var wx = mid.x,
            wy = mid.y;
        if (mid.alpha == 180) {
            wy += -10;
        } else {
            wx += -13;
        }
        p.weight = this.text(wx, wy, (w.toString()));
        p.weight.attr(wAttr);
    }

    // set the from and to nodes for this edge
    p.from = obj1;
    p.to = obj2;
    p.fromNodeID = fromNode.id;
    p.toNodeID = toNode.id;

    // add the path to each of the circle objects
    obj1.connections.push(p)
    obj2.connections.push(p)

    return p;
};

// point calculation based on: https://gist.github.com/viking/1043360
Raphael.fn.arrowhead = function(x1, y1, x2, y2, size) {
    var angle = Raphael.angle(x1, y1, x2, y2);
    var a45 = Raphael.rad(angle - 25);
    var a45m = Raphael.rad(angle + 25);

    var x2a = x2 + Math.cos(a45) * size;
    var y2a = y2 + Math.sin(a45) * size;

    var x2b = x2 + Math.cos(a45m) * size;
    var y2b = y2 + Math.sin(a45m) * size;

    return this.path(
        "M" + x2 + " " + y2 + "L" + x2a + " " + y2a +
                    "L" + x2b + " " + y2b +
                    "L" + x2 + " " + y2).attr({
                        "opacity":0,
                        "stroke-width":2,
                        "stroke":"#4b4b4b",
                        "fill": "#4b4b4b"
                    });
};

Raphael.fn.arrowheadString = function(x1, y1, x2, y2, size) {
    var angle = Raphael.angle(x1, y1, x2, y2);
    var a45 = Raphael.rad(angle - 25);
    var a45m = Raphael.rad(angle + 25);

    var x2a = x2 + Math.cos(a45) * size;
    var y2a = y2 + Math.sin(a45) * size;

    var x2b = x2 + Math.cos(a45m) * size;
    var y2b = y2 + Math.sin(a45m) * size;

    var pathString = "M" + x2 + " " + y2 + "L" + x2a + " " + y2a +
                    "L" + x2b + " " + y2b +
                    "L" + x2 + " " + y2;

    return pathString;
};