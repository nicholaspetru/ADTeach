$(document).ready(function () {

    VisualizerHandler = function() {
        this.r = this.CreatePaper();
        this.entities = [];
        this.steps = [];
        this.currentStep = 0;
        this.delay = 500;
        this.eventQueue = [];
        return this;
    }

    VisualizerHandler.prototype.TakeStep = function() {
        console.log("--------- TakeStep ----------");

        if (this.currentStep == 0) {
            this.fakeEvents();
            this.Render();
        }

        if (this.steps[this.currentStep]) {
            console.log("Starting step " + this.currentStep);
            switch(this.steps[this.currentStep].getType()) {
                case "new":
                    this.steps[this.currentStep].drawNew();
                    break;
                case "add":
                    this.steps[this.currentStep].add();
                    var a = this.steps[this.currentStep].getE1();
                    var b = this.steps[this.currentStep].getE2();
                    a.value.unshift(b.value); // add b to the front of a
                    this.DeleteEntity(b.name);
                    break;
                default:
                    console.log("undefined step type");
                    break;
            }
            this.currentStep++;
        }
    };

    VisualizerHandler.prototype.step = function() {
        var val = undefined;
        var a = undefined;
        var b = undefined;
        return {
            setE1: function(element) {a = element;},
            setE2: function(element) {b = element;},
            getE1: function() {return a;},
            getE2: function() {return b;},
            setType: function(newVal) {val = newVal;},
            getType: function() {return val;},
            //drawNew: function() {return a.Draw();},
            // draw a new entity on the screen
            drawNew: function() {a.Draw();},
            // add b to a
            add: function() {b.addTo(a);} 
        }
    };

    VisualizerHandler.prototype.Render = function() {
        console.log("--------- Render ----------");

        for (var i=0; i<this.eventQueue.length; i++) {
            console.log("event " + i + ": " + this.eventQueue[i]);
            var currentEvent = this.eventQueue[i];
            var s = this.step();
            switch(currentEvent[0]) {
                case "new":
                    console.log("\t\t new");
                    // random hard-coded placements
                    this.NewEntity(this.r, currentEvent[2], currentEvent[1], currentEvent[3], 100 + i*100, 400 - i*200, 50,50);
                    s.setType("new");
                    s.setE1(this.entities[this.entities.length-1]);
                    this.steps.push(s);
                    break;
                case "add":
                    console.log("\t\t add");
                    s.setType("add");
                    s.setE1(this.getNamedEntity(currentEvent[2]));
                    s.setE2(this.getNamedEntity(currentEvent[3]));
                    this.steps.push(s);
                    break;
                default:
                    console.log("undefined event: " + currentEvent);
                    break;
            }
        }
    };

    VisualizerHandler.prototype.fakeEvents = function() {
        console.log("--------- fakeEvents ----------");
        var action1 = ['new','list','x', [4,2,0]];
        var action2 = ['new','int', 'y', 3];
        var action3 = ['add', 'list', 'x','y'];
        this.eventQueue.push(action1);
        this.eventQueue.push(action2);
        this.eventQueue.push(action3);
    };

    VisualizerHandler.prototype.NewEntity = function(r,name,type,value,x,y,width,height) {
        // x, y, width, and height will eventually be handled somewhere else, 
        // but they're hard-coded here for now
        console.log("--------- NewEntity ---------");
        console.log("name=" + name + ", type=" + type + ", value=" + value);

        this.entities.push(this.getNewEntity(r,name,type,value,x,y,width,height));
    };

    VisualizerHandler.prototype.getNewEntity = function(r,name,type,value,x,y,width,height) {
        switch(type) {
            case 'int':
                return new Primitive(r,name,type,value,x,y,width,height);
            case 'float':
                return new Primitive(r,name,type,value,x,y,width,height);
            case 'string':
                return new Primitive(r,name,type,value,x,y,width,height);
            case 'bool':
                return new Primitive(r,name,type,value,x,y,width,height);
            case 'list':
                return new List(r,name,type,value,x,y,width,height);
            default:
                console.lot("Unknown entity type :(");
                return;
        }
    };

            //Deletes the named Entity
    VisualizerHandler.prototype.DeleteEntity = function(name) {
        console.log("Visualizer Handler: DeleteEntity(" + name + ")");
        for (var i = 0; i < this.entities.length; i++){
            if (this.entities[i].name == name){
                this.entities.splice(i,1);
            }
        }
    };

    VisualizerHandler.prototype.UpdateEntity = function(name,newVal) {
        //console.log("UpdateEntity: " + name + ")");
        var temp = this.getNamedEntity(name);
        console.log("UpdateEntity: " + name + " = " + temp.value);

        temp.SetValue(newVal);
        //this.getNamedEntity(name).SetValue(newVal);
    };

                //Returns the named Entity
    VisualizerHandler.prototype.getNamedEntity = function(name) {
        console.log("Visualizer Handler: getNamedEntity(" + name + ")");
        for (var i = 0; i < this.entities.length; i++){
            if (this.entities[i].name == name){
                return this.entities[i];
            }
        }
    };

    VisualizerHandler.prototype.CreatePaper = function() {
        console.log("==== Visualizer Handler: Create Paper =====");
        //for each item in entities, draw
        var height = $("#vis_env").height();
        var width = $("#vis_env").width();
        var r = Raphael("vis_env", width, height);
        return r;
    };
});