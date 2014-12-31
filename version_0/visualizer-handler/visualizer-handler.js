$(document).ready(function () {
  
    VisualizerHandler = function(paper){
        //the list of entities
        this.entities = [];
        this.eventQueue = [];
        this.symbolTable = null;
        this.paper = paper;
        return this;
    }
    
    
    //Dequeue all the events from the event queue, execute them, and render
    VisualizerHandler.prototype.goForth = function() {
        console.log("Visualizer Handler: goForth()");
        while (this.eventQueue.length > 0) {
            curEvent = this.eventQueue.shift();
            //console.log('curEvent: ' + curEvent)
            if (curEvent[0] == 'new') {
                this.NewEntity(curEvent[1], curEvent[2], curEvent[3], curEvent[4]);
            }
            else if (curEvent[0] == 'update') {
                this.UpdateEntity(curEvent[2], curEvent[4]);
            }
            else if (curEvent[0] == 'delete') {
                this.DeleteEntity(curEvent[2]);
            }
            else {
                console.log('unrecognized event: ' + curEvent[0]);
            }
        }
        this.Render();
    };
    
    //Call the draw function of each entity
    VisualizerHandler.prototype.Render = function() {
        console.log("Visualizer Handler: render()");
        //for each item in entities, draw
        for (var i = 0; i < this.entities.length; i++){
            if (this.entities[i] != null) {
                this.entities[i].value = this.symbolTable.getValue(this.entities[i].name);
                this.entities[i].Draw();
            }
        }
    };
    
    //Enqueue an event onto the event queue
    VisualizerHandler.prototype.enqueueEvent = function(event, className, name, type, value) {
        console.log("Visualizer Handler: enqueueEvent(" + event + ',' + className + ',' + name + ',' + type + ',' + value + ')');
        this.eventQueue.push([event, className, name, type, value]);
    };

    //Pushes a new Entity onto the list
    VisualizerHandler.prototype.NewEntity = function(className, name, type, value) {
	    console.log("Visualizer Handler: newEntity(" + className + ',' + name + ',' + type + ',' + value + ')');
        this.entities.push(this.getNewEntity(className,name,type,value));
    };

    //Updates the value of an Entity
    VisualizerHandler.prototype.UpdateEntity = function(name, value) {
        console.log("Visualizer Handler: updateEntity(" + name + ',' + value + ')');
        for (var i = 0; i < this.entities.length; i++){
            if (this.entities[i] != null && this.entities[i].name == name){
            this.entities[i].value = value;
            }
        }
    }

    //Deletes the named Entity
    VisualizerHandler.prototype.DeleteEntity = function(name) {
        console.log("Visualizer Handler: deleteEntity(" + name + ")");
        for (var i = 0; i < this.entities.length; i++){
            if (this.entities[i] != null && this.entities[i].name == name){
            this.entities.splice(i,1);
            }
        }
    }
    
    //Returns a new Entity of the given type
    VisualizerHandler.prototype.getNewEntity = function(className, name, type, value) {
        switch(className){
        case "int":
            return new Primitive(this.paper,name,type,value);
        case "string":
            return new Primitive(this.paper,name,type,value);
        case "float":
            return new Primitive(this.paper,name,type,value);
        case "bool":
            return new Primitive(this.paper,name,type,value);
        case "stack":
            return new Stack(this.paper,name,type,value);
        //and more cases....
        default:
            console.log("Unknown type for newEntity.");
            return;
        }
    };

});