/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="Away3D.ts"/>
///<reference path="../tests/scene/PhongTorus.ts"/>
///<reference path="../tests/scene/MaterialTorus.ts"/>
///<reference path="../tests/scene/AGALTorus.ts"/>

///<reference path="../tests/aglsl/AssemblerTest.ts"/>
///<reference path="../tests/aglsl/AGALCompilerTest.ts"/>
///<reference path="../tests/demos/cubes/CubeDemo.ts"/>

///<reference path="../tests/unit/TestSuite.ts"/>

module away
{
    export class AppHarness
    {
        constructor()
        {
			new tests.unit.TestSuite();
        }
    }
}

window.onload = function ()
{
    var app = new away.AppHarness();
}