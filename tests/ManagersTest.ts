///<reference path="../src/away/partition/CameraNode.ts" />




//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/ManagersTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/ManagersTest.js
//------------------------------------------------------------------------------------------------

class ManagersTest
{

    //private stage       : away.display.Stage;
    //private sManager    : away.managers.Stage3DManager;
    //private sProxy      : away.managers.Stage3DProxy;

    constructor()
    {

        var camN : away.partition.CameraNode = new away.partition.CameraNode();

        //var nb : away.partition.NodeBase = new away.partition.NodeBase();
        //var e : away.entities.Entity= new away.entities.Entity(); // ERROR

        //var sc3d : away.containers.Scene3D = new away.containers.Scene3D();
        //var pt : away.traverse.PartitionTraverser = new away.traverse.PartitionTraverser();// notOK
        //var p3d : away.math.Plane3D = new away.math.Plane3D(); //OK
        //var s : away.entities.SegmentSet = new away.entities.SegmentSet();// ERROR
        //var wp : away.primitives.WireframePrimitiveBase = new away.primitives.WireframePrimitiveBase();// OK

        //var n : away.partition.EntityNode = new away.partition.EntityNode(); // ERROR
        //var nb : away.partition.NodeBase = new away.partition.NodeBase(); // ERROR

        //var c :away.partition.CameraNode = new away.partition.CameraNode();
        //this.stage = new away.display.Stage();
        //this.sManager = away.managers.Stage3DManager.getInstance( this.stage );

    }

}

var GL = null;//: WebGLRenderingContext;
var test: ManagersTest;
window.onload = function ()
{

    var canvas : HTMLCanvasElement = document.createElement('canvas');
    GL = canvas.getContext("experimental-webgl");

    test = new ManagersTest();

}


