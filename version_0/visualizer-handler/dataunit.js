// dataunit.js
// create properties and actions of units of dataunit

DataUnit = function(paper,type,value,vishandler,x,y,dimension,shape){
        this.paper = paper;
        this.VH = vishandler;
        this.type = type;
        this.value = value;
        this.shape = shape;
        // dimension of box/circle
        this.dimension = dimension;

        // array of value, box/circle container, associated arrows, etc.
        // IMPORTANT: first item is the value, second is the container (box/circle)
        this.vis = [];

        //assign the position
        this.x = x;
        this.y = y;

        //visual component
        this.vis[0] = this.paper.text(this.x+this.dimension/4, this.y+this.dimension/2, this.value);
        this.vis[0].attr({"opacity": 0,"font-family": "times", "font-size": 14, 'text-anchor': 'start'});
    }

   	//Create visual primitve in the specific position
    DataUnit.prototype.create = function(newX, newY) {
        //this.x = newX;
        //this.y = newY;
        
        //move them to the new area
        //this.vis[0].transform("t" + (this.x) + "," + (this.y));
        
        //fade it in
        var anim = Raphael.animation({opacity:1},1000);
        for (var i =0; i < this.vis.length; i++){
        	this.vis[i].animate(anim.delay(this.VH.setDelay(1000)));
        }
    };    

    //Create visual primitve in the specific position
    DataUnit.prototype.fadeIn = function() {
        
        //fade it in
        var anim = Raphael.animation({opacity:1},1000);
        this.vis.animate(anim.delay(this.VH.setDelay(1000)));
    };

	//Modifiy data unit value
    DataUnit.prototype.update = function(newValue) {
        // shake it off
        var anim = Raphael.animation({x:-4},12);
        this.vis[0].animate(anim.delay(this.VH.setDelay(12)));

        for (var i = 0; i < 21; i++){
            var anim = Raphael.animation({x:8*(-1^i)},25);
            this.vis[0].animate(anim.delay(this.VH.setDelay(25)));
        }
        var _t = this, _val = this.value;
        setTimeout(function(){
            _t.vis.attr({"text": newValue});
        },(this.VH.delay - this.VH.date.getTime()));

        var anim = Raphael.animation({x:0},12);
        this.vis[0].animate(anim.delay(this.VH.setDelay(12)));
        
        this.VH.setDelay(50);
    };


   // draw the appropriate container for the data unit
   DataUnit.prototype.contain = function() {
   		console.log("shape: " + this.shape)
   		// which container type is it? (0 is box, 1 is circle)
   		if (this.shape == 0) {
   			this.vis[1] = this.paper.rect(this.x, this.y, this.dimension, this.dimension);
   		} 
   		if (this.shape == 1) {
   			this.vis[1] = this.paper.circle(this.x+this.dimension/2, this.y+this.dimension/2, this.dimension/2)
   		}
   };

   DataUnit.prototype.highlight = function() {
   		var anim = Raphael.animation({stroke: "green"}, 50)
   		this.vis[1].animate(anim.delay(this.VH.setDelay(500)))
   };

