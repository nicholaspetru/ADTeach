$(document).ready(function () {
  
    VisualizerHandler = function(){
	//the list of entities
	this.entities = [];
	return this;
    }
    
    //Call the draw function of each entity
    VisualizerHandler.prototype.Render = function() {
	//for each item in entities, draw
	for (var i = 0; i < this.entities.length; i++){
	    this.entities[i].Draw();
	}
    };

    //Pushes a new Entity onto the list. This is called by the symbolTable.
    VisualizerHandler.prototype.NewEntity = function(className, name, type, value) {
	this.entities.push(this.getNewEntity(className,name,type,value));
    }

    //Updates the value of an Entity. This is called by the symbol table.
    VisualizerHandler.prototype.UpdateEntity = function(name, value) {
	for (var i = 0; i < this.entities.length; i++){
	    if (this.entities[i].name == name){
		this.entities[i].value = value;
	    }
	}
    }

    //Deletes the named Entity. This is called by the symbol table.
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