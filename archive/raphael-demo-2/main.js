$(document).ready(function () {
 
    var VH = new VisualizerHandler();

    //VH.NewEntity('list','y','int', [5,4,3,2,1], 50, 400, 50, 50, 22);
    //VH.NewEntity('int', '.a','int',7,300,200,50,50,22);

    //VH.Render();
    console.log("-----updating-----");
    //VH.UpdateEntity(".x",10);
    //VH.Render(raph);
    //console.log("-----deleting-----");
    //VH.DeleteEntity("x");
    //VH.Render();


    $("#step").click(function() {
        onStep();
    });

    $("#speed").click(function() {
        onSlide();
    });

    onStep = function() {
        console.log("------------onStep----------")
        VH.TakeStep();
    };

    // onPlay, call onStep with VH.speed delay between each call (use setTimeout)
    onSlide = function() {
        console.log("--------------onSlide----------");
        console.log("speed: " + $("#speed").val());
        VH.UpdateSpeed($("#speed").val());
    };
});