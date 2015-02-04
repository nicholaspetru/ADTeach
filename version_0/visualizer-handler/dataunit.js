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

          // array of value, box/circle container, associated arrows, etc.
          // IMPORTANT: first item is the value, second is the container (box/circle)
          this.vis = [];

          //assign the position
          this.x = x;
          this.y = y;
      }

     	//Create visual primitve in the specific position
      DataUnit.prototype.create = function() {
          //create the container
          this.buildVisual();

          //fade it in
          var anim = Raphael.animation({opacity:1},250);
          var delay = this.VH.setDelay(250);
          for (var i =0; i < this.vis.length; i++){
          	this.vis[i].animate(anim.delay(delay));
          }
      };

      //Moves the dataunit to the given position at the specified time
      DataUnit.prototype.move = function(difX, difY, delay, time) {
          var _t = this;
          setTimeout(function(){
            _t.x += difX;
            _t.y += difY;
            //console.log(difY);
            for (var i =0; i < _t.vis.length; i++){
              var anim = Raphael.animation({transform:'...t' + difX + ' ' + difY},time);
              _t.vis[i].animate(anim.delay(0));
            }
            _t.VH.setDelay(100);
          },(delay));
      };

      //Deletes the item (actually, this just fades it out)
      DataUnit.prototype.destroy = function() {
          //fade it out
          var anim = Raphael.animation({opacity:0},250);
          var delay = this.VH.setDelay(250);
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


     // build the visual rep for the dataunit
     DataUnit.prototype.buildVisual = function() {
        //value
        this.vis[0] = this.paper.text(this.x+this.width/2, this.y+this.height/2, this.value);
        this.vis[0].attr({"opacity": 0,"font-family": "times", "font-size": 14, 'text-anchor': 'center'});

     		// which container type is it? (0 is box, 1 is circle)
     		if (this.shape == 0) {
     			this.vis[1] = this.paper.rect(this.x, this.y, this.width, this.height);
     		} 
     		if (this.shape == 1) {
     			this.vis[1] = this.paper.circle(this.x+this.dimension/2, this.y+this.dimension/2, this.dimension/2)
     		}
        this.vis[1].attr({"opacity": 0, "stroke-width": 1.5, "stroke": "#4b4b4b"});
     };

     //Highlight
     DataUnit.prototype.highLight = function() {
     		var anim = Raphael.animation({stroke: "green"}, 250)
     		this.vis[1].animate(anim.delay(this.VH.setDelay(250)))
     };

      //Highlight
     DataUnit.prototype.lowLight = function() {
        var anim = Raphael.animation({stroke: "#4b4b4b"}, 250)
        this.vis[1].animate(anim.delay(this.VH.setDelay(250)))
     };
});

//