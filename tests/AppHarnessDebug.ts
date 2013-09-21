/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../src/Away3D.ts"/>
///<reference path="unit/TestSuite.ts"/>

module away
{
    export class AppHarnessDebug
    {
        constructor()
        {
            new tests.unit.TestSuite();
        }
    }
}

window.onload = function ()
{
    var app = new away.AppHarnessDebug();
}