//http://wesleytodd.com/2013/4/drag-n-drop-in-raphael-js.html
    Raphael.st.draggable = function() {
        var me = this, // ref to set
            lx = 0, // where the elements are currently
            ly = 0,
            ox = 0, // where the elements started
            oy = 0,
            moveFnc = function(dx, dy){
                lx = dx + ox; // add the new change in x to the drag origin
                ly = dy + oy; // do the same for y
                me.transform('t' + lx + ',' + ly);
            },
            startFnc = function(){},
            endFnc = function(){
                ox = lx;
                oy = ly;
            };
        this.drag(moveFnc, startFnc, endFnc); // loop through all elements in set and attach the three event handlers
    };
    
// http://raphaeljs.com/graffle.html
// and http://stackoverflow.com/questions/3679436/how-can-i-combine-objects-in-the-raphael-javascript-library?lq=1
/*
    Raphael.fn.connection = function (obj1, obj2, line, bg) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
        {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
        {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
        {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
        {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
        {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
        {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
        {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
        d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    
    var path = ["M", x1.toFixed(3), y1.toFixed(3), x4.toFixed(3), y4.toFixed(3)].join(",");
    if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});
    } else {
        var color = typeof line == "string" ? line : "#000";
        return {
            bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
            line: this.path(path).attr({stroke: color, fill: "none", opacity:"0"}),
            from: obj1,
            to: obj2
        };
    }
};
*/

// from, to, radius
Raphael.fn.connect = function(obj1, obj2, isDirected, isWeighted, w, wAttr) {
    // list of paths each object has
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

    // create a line/path from object 1 to object 2

    var p = this.path("M" + c1x + "," + c1y
                        + " L" + c2x + "," + c2y);



    //console.log(p.weight);
    if (isDirected) {

    }

    p.attr({"stroke-width": 1.5, "opacity":0});
    p.toBack();


    if (isWeighted) {

        var totalLen = p.getTotalLength();
        var mid = p.getPointAtLength((totalLen / 2));
        p.weight = this.text(mid.x,mid.y,(w.toString()));
        p.weight.attr(wAttr);
        //console.log("total: " + totalLen);
        console.log("mid: (" + mid.x + "," + mid.y + ")   " + mid.alpha);
        //p.data("weight",w);
        //console.log(p.data("weight"));
    }
    // set the from and to node for this edge
    p.from = obj1;
    p.to = obj2;

    // add the path to each of the objects
    obj1.connections.push(p)
    obj2.connections.push(p)

    return p;
};