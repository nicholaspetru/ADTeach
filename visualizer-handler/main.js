$(document).ready(function () {
 
    var VH = new VisualizerHandler();
    VH.NewEntity('int','x','int',5);
    VH.NewEntity('stack','y','int',[1,2,3,4,5]);
    VH.Render();
    console.log("-----updating-----");
    VH.UpdateEntity("x",10);
    VH.Render();
    console.log("-----deleting-----");
    VH.DeleteEntity("y");
    VH.Render();
});