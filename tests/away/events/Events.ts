///<reference path="../../../src/away/events/MouseEvent3D.ts"/>


//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/EventsTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/EventsTest.js
//------------------------------------------------------------------------------------------------


module tests {

    export class Events //extends away.events.EventDispatcher
    {

        var e : away.events.MouseEvent3D;

        constructor()
        {

        }

    }


}

var GL = null;//: WebGLRenderingContext;

window.onload = function ()
{

    var test = new tests.Events();
    var canvas : HTMLCanvasElement = document.createElement('canvas');
    GL = canvas.getContext("experimental-webgl");

}

