///<reference path="../../../src/away/entities/Entity.ts"/>

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/EntityTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/EntityTest.js
//------------------------------------------------------------------------------------------------


module tests {

    export class EntityTest //extends away.events.EventDispatcher
    {


        private entity : away.entities.Entity;

        constructor()
        {

            this.entity = new away.entities.Entity();
            this.entity.x = 10;
            this.entity.y = 10;
            this.entity.z = 10;

            this.entity.getIgnoreTransform();
        }

    }

}

var GL = null;//: WebGLRenderingContext;

var test

window.onload = function ()
{

    test = new tests.EntityTest();

    var canvas : HTMLCanvasElement = document.createElement('canvas');
    GL = canvas.getContext("experimental-webgl");

}

