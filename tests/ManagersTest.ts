///<reference path="../src/away/_definitions.ts" />

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


    }

    public init() : void
    {

        var camN : away.entities.Entity = new away.entities.Entity();

    }

}

var GL = null;//: WebGLRenderingContext;
var test: ManagersTest;
window.onload = function ()
{

    var canvas : HTMLCanvasElement = document.createElement('canvas');
    GL = canvas.getContext("experimental-webgl");

    test = new ManagersTest();
    test.init();

}

