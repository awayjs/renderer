///<reference path="../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/GeomTests.ts --target ES5 --comments --out $ProjectFileDir$/tests/GeomTests.js
//------------------------------------------------------------------------------------------------

class GeomTests
{

    private geomBase    : away.base.SubGeometryBase = new away.base.SubGeometryBase();
    private geom        : away.base.Geometry = new away.base.Geometry();

    constructor()
    {

        console.log( 'geomBase'     , this.geomBase);
        console.log( 'geom'         , this.geom);

        away.Debug.THROW_ERRORS                           = false;

    }

    public onContextCreated( e : away.events.Stage3DEvent ) : void
    {

        away.Debug.log( 'onContextCreated' , e );

    }

    public onContextReCreated( e : away.events.Stage3DEvent ) : void
    {

        away.Debug.log( 'onContextReCreated' , e );

    }

    public onContextDisposed( e : away.events.Stage3DEvent ) : void
    {

        away.Debug.log( 'onContextDisposed' , e );

    }

}

var GL = null;//: WebGLRenderingContext;
var test: GeomTests;
window.onload = function ()
{

    var canvas : HTMLCanvasElement = document.createElement('canvas');
    GL = canvas.getContext("experimental-webgl");

    test = new GeomTests();

}
