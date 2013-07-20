/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="Away3D.ts"/>
///<reference path="../tests/scene/LightTorus.ts"/>

module away
{

    export class AppHarness extends away.Away3D
    {

        private lt : scene.LightTorus;
        constructor()
        {

            super();

            this.lt = new scene.LightTorus();

        }
    }

}



window.onload = function ()
{

    var app = new away.AppHarness();

}


