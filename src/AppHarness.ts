/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="Away3D.ts"/>
///<reference path="../tests/scene/LightTorus.ts"/>

export class AppHarness extends away.Away3D
{
	constructor()
	{

        super();
		var app = new LightTorus();

	}
}

window.onload = function ()
{

    var app = new AppHarness();

}


