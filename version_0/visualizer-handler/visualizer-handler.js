$(document).ready(function () {
  
    VisualizerHandler = function(){
        //the list of entities
        this.entities = [];
        this.eventQueue = [];
        return this;
    }
    
    
    //Dequeue all the events from the event queue, execute them, and render
    VisualizerHandler.prototype.goForth = function() {
        /*
        //dequeue everything from the event queue
        //Go through while dequeing and call the appropriate method below
        //Then render errything
        while(eventQueue.length > 0){
            //switch around the first item
            switch(eventQueue[0][0])
                case("new")
                        newE
        }*/
        this.Render();
    };
    
    //Call the draw function of each entity
    VisualizerHandler.prototype.Render = function() {
        //for each item in entities, draw
        for (var i = 0; i < this.entities.length; i++){
            this.entities[i].Draw();
        }
    };
    
    //Enqueue an event onto the event queue
    VisualizerHandler.prototype.enqueueEvent = function(event, classname, name, type, value) {
        console.log("visualizer handler: enqueue of new event.");
        this.eventQueue[this.eventQueue.length].push([event, className, name, type, value]);
    };

    //Pushes a new Entity onto the list
    VisualizerHandler.prototype.NewEntity = function(className, name, type, value) {
	   this.entities.push(this.getNewEntity(className,name,type,value));
    };

    //Updates the value of an Entity
    VisualizerHandler.prototype.UpdateEntity = function(name, value) {
        for (var i = 0; i < this.entities.length; i++){
            if (this.entities[i].name == name){
            this.entities[i].value = value;
            }
        }
    }

    //Deletes the named Entity
    VisualizerHandler.prototype.DeleteEntity = function(name) {
        for (var i = 0; i < this.entities.length; i++){
            if (this.entities[i].name == name){
            this.entities.splice(i,1);
            }
        }
    }
    
    //Returns a new Entity of the given type
    VisualizerHandler.prototype.getNewEntity = function(className, name, type, value) {
        switch(className){
        case "int":
            return new Primitive(name,type,value);
        case "string":
            return new Primitive(name,type,value);
        case "float":
            return new Primitive(name,type,value);
        case "bool":
            return new Primitive(name,type,value);
        case "stack":
            return new Stack(name,type,value);
        //and more cases....
        default:
            console.log("Unknown type for newEntity.");
            return;
        }
    };

});