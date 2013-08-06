/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="Away3D.ts"/>
///<reference path="../tests/scene/PhongTorus.ts"/>
///<reference path="../tests/scene/MaterialTorus.ts"/>
///<reference path="../tests/aglsl/AssemblerTest.ts"/>

module away
{
    export class AppHarness
    {
        constructor() 
        {
			new aglsl.AssemblerTest();
        }
    }
}

window.onload = function ()
{
    var app = new away.AppHarness();
}