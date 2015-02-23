// dataunit.js
// create properties and actions of units of dataunit

$(document).ready(function () {

  DataUnit = function(paper,type,value,vishandler,x,y, width, height, shape){
          this.paper = paper;
          this.VH = vishandler;
          this.type = type;
          this.value = value;
          this.shape = shape;
          // dimension of box/circle
          this.width = width;
          this.height = height;
          this.font_size = 14;
          this.index = " ";

          // array of value, box/circle container, associated arrows, etc.
          // IMPORTANT: first item is the value, second is the container (box/circle)
          this.vis = [];
          this.me= null // for when we want to drag just this dataunit (graphs)

          //assign the position
          this.x = x;
          this.y = y;
      }

     	//Create visual primitve in the specific position
      DataUnit.prototype.create = function() {
          //create the container
          this.buildVisual();

          //fade it in
          var anim = Raphael.animation({opacity:1},this.VH.getAnimTime(250));
          var delay = this.VH.setDelay(250);
          for (var i =0; i < this.vis.length; i++){
          	this.vis[i].animate(anim.delay(delay));
          }

      };

      //Create visual primitve in the specific position with no delay
      DataUnit.prototype.popIn = function() {
          //create the container
          this.buildVisual();

          //fade it in
          var anim = Raphael.animation({opacity:1},0);
          var delay = this.VH.setDelay(0);
          for (var i =0; i < this.vis.length; i++){
            this.vis[i].animate(anim.delay(delay));
          }

      };

      //Moves the dataunit by the given amount at the specified time
      DataUnit.prototype.move = function(difX, difY, delay, time) {

          var _t = this;
          setTimeout(function(){
            _t.x += difX;
            _t.y += difY;
            for (var i =0; i < _t.vis.length; i++){
              var anim = Raphael.animation({transform:'...t' + difX + ' ' + difY},_t.VH.getAnimTime(time));
              _t.vis[i].animate(anim.delay(0));
            }
            //_t.VH.setDelay(100);
          },(delay));
      };

      //Moves the dataunit to the given position at the specified time
      DataUnit.prototype.moveTo = function(xx, yy, delay, time) {
          var _t = this;
          setTimeout(function(){
            var difX = xx - _t.x, difY = yy - _t.y;
            _t.x += difX;
            _t.y += difY;
            for (var i =0; i < _t.vis.length; i++){
              var anim = Raphael.animation({transform:'...t' + difX + ' ' + difY},_t.VH.getAnimTime(time));
              _t.vis[i].animate(anim.delay(0));
            }
          },(delay));
      };


      //Deletes the item (actually, this just fades it out)
      DataUnit.prototype.fastDestroy = function() {
          //fade it out
          var anim = Raphael.animation({opacity:0},0);
          var delay = this.VH.setDelay(0);
          for (var i =0; i < this.vis.length; i++){
            this.vis[i].animate(anim.delay(delay));
          }
      };

      //Deletes the item (actually, this just fades it out)
      DataUnit.prototype.destroy = function() {
          var preAnim = Raphael.animation({stroke: "red"}, this.VH.getAnimTime(500));
          this.vis[1].animate(preAnim.delay(this.VH.setDelay(500)));

          //fade it out
          var anim = Raphael.animation({opacity:0},this.VH.getAnimTime(500));
          var delay = this.VH.setDelay(500);
          for (var i =0; i < this.vis.length; i++){
            this.vis[i].animate(anim.delay(delay));
          }
      };

      //Deletes the item with a provided delay
      DataUnit.prototype.fadeOut = function(delay) {
          //fade it out
          var anim = Raphael.animation({opacity:0},this.VH.getAnimTime(250));
          for (var i =0; i < this.vis.length; i++){
            this.vis[i].animate(anim.delay(delay));
          }
      };

  	//Modifiy data unit value
    //Orientation determines whether the dataunit is shaking up and down (0) or left to right (1)
      DataUnit.prototype.update = function(newValue, orientation) {

          for (var i = 0; i < 20; i++){
              //console.log("y val: " + 8*Math.pow(-1,i));
              this.move(8*Math.pow(-1,i)*orientation,8*Math.pow(-1,i)*(!orientation), this.VH.setDelay(50),25);
          }

          var _t = this, _val = this.value;
          setTimeout(function(){
              _t.vis[0].attr({"text": newValue});
          },(this.VH.delay - this.VH.date.getTime()));

          this.VH.setDelay(50);
      };

      //Modifiy data unit index
      DataUnit.prototype.updateIndex = function(newIndex) {
        if (this.vis[2] != null){
          var _t = this, _val = this.value;
          setTimeout(function(){
              _t.vis[2].attr({"text": newIndex});
          },(this.VH.delay - this.VH.date.getTime()));
        }
      };

     // build the visual rep for the dataunit
     DataUnit.prototype.buildVisual = function() {
        //value
        this.vis[0] = this.paper.text(this.x+this.width/2, this.y+this.height/2, this.value);
        this.vis[0].attr({"opacity": 0,"font-family": "times", "font-size": this.font_size, 'text-anchor': 'center'});

     		// which container type is it? (0 is box, 1 is circle, -1 is nothing)
     		if (this.shape == -1) {
          this.vis[1] = this.paper.rect(this.x, this.y, this.width, this.height);
          this.vis[1].attr({"opacity": 0, "stroke-width": 0, "stroke": "#4b4b4b"});
        } 
        if (this.shape == 0) {
     			this.vis[1] = this.paper.rect(this.x, this.y, this.width, this.height);
          this.vis[1].attr({"opacity": 0, "stroke-width": 1.5, "stroke": "#4b4b4b"});
     		} 
     		if (this.shape == 1) {
     			this.vis[1] = this.paper.circle(this.x+this.width/2, this.y+this.width/2, this.width/2);
          this.vis[1].attr({"opacity": 0, "stroke-width": 1.5, "stroke": "#4b4b4b"});
          // TODO in edges
          /*
          this.me = this.paper.set();
          this.me.push(this.vis[0],this.vis[1]);
          this.me.draggable();
          */
     		}

        //add an index
        this.vis[2] = this.paper.text(this.x+this.width/2, this.y - 6, this.index);
        this.vis[2].attr({"opacity": 0,"font-family": "times", "font-size": this.font_size - 3, 'text-anchor': 'center'});

     };
     
     //Highlight
     DataUnit.prototype.highLight = function() {
     		var anim = Raphael.animation({stroke: "green"}, this.VH.getAnimTime(250));
        this.vis[0].animate(anim.delay(this.VH.setDelay(250)));
     		this.vis[1].animate(anim.delay(this.VH.setDelay(250)));
     };

     //turn red
     DataUnit.prototype.turnRed = function() {
        var anim = Raphael.animation({stroke: "red"}, this.VH.getAnimTime(250));
        this.vis[0].animate(anim.delay(this.VH.setDelay(250)))
        this.vis[1].animate(anim.delay(this.VH.setDelay(250)))
     };

      //Highlight
     DataUnit.prototype.lowLight = function() {
        var anim = Raphael.animation({stroke: "#4b4b4b"}, this.VH.getAnimTime(1000));
        this.vis[0].animate(anim.delay(this.VH.setDelay(1000)));
        this.vis[1].animate(anim.delay(this.VH.setDelay(1000)));
     };
});

//