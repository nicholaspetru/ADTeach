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


function textOnPath( r, message, path, align, fontSize, letterSpacing, kerning, geckoKerning) {
    // if fontSize or letterSpacing are undefined, they are calculated to fill the path
    // 10% of fontSize is usually good for manual letterspacing

    // Gecko, i.e. Firefox etc, inflates and alters the letter spacing
    var align = align || 'left';
  
    var gecko = /rv:([^\)]+)\) Gecko\/\d{8}/.test(navigator.userAgent||'') ? true : false;

    var letters = [], places = [], messageLength = 0;
    for (var c=0; c < message.length; c++) {
        var letter = r.text(0, 0, message[c]).attr({"text-anchor" : "middle"});
        var character = letter.attr('text'), kern = 0;
        letters.push(letter);

        if (kerning) {
            if(gecko && geckoKerning) {
                kerning = geckoKerning;
            }
            var predecessor = letters[c-1] ? letters[c-1].attr('text') : '';
            if (kerning[c]) {
                kern = kerning[c];
            } else if (kerning[character]) {
                if( typeof kerning[character] === 'object' ) {
                    kern = kerning[character][predecessor] || kerning[character]['default'] || 0;
                } else {
                    kern = kerning[character];
                }
            }
            if(kerning['default'] ) {
                kern = kern + (kerning['default'][predecessor] || 0);
            }            
        }

        messageLength += kern;
        places.push(messageLength);
        //spaces get a width of 0, so set min at 4px
        messageLength += Math.max(4.5, letter.getBBox().width);
    }

    var len = path.getTotalLength();

  
    if( letterSpacing ){
        if (gecko) {
            letterSpacing = letterSpacing * 0.83;
        }
    } else {
        letterSpacing = letterSpacing || len /  messageLength;
    }
    fontSize = fontSize || 10 * letterSpacing;

      
    for (c = 0; c < letters.length; c++) {
        letters[c].attr("font-size", fontSize + "px");
      var adjust = '';
      if(align!='left'){
        adjust = align=='right' ? len-messageLength : len/2-messageLength/2;
      }

      console.log(align,adjust);
      p = path.getPointAtLength(places[c] * letterSpacing + adjust);
        
        var rotate = 'R' + (p.alpha < 180 ? p.alpha + 180 : p.alpha > 360 ? p.alpha - 360 : p.alpha )+','+p.x+','+p.y;
    letters[c].attr({ x: p.x, y: p.y, transform: rotate });

    }
};