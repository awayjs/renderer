///<reference path="../../../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/base/Object3DTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/base/Object3DTest.js
//------------------------------------------------------------------------------------------------

class Object3DTest
{

    private obj : away.base.Object3D;

    constructor()
    {

        var q : away.math.Quaternion = new away.math.Quaternion();
        var m : away.geom.Matrix3D = new away.geom.Matrix3D();

        this.obj = new away.base.Object3D();

        this.obj.x = 100;
        this.obj.y = 100;
        this.obj.z = 100;

        this.obj.scaleX = 1;
        this.obj.scaleY = 2;
        this.obj.scaleZ = 3;

        console.log( this.obj.transform )

        away.math.Matrix3DUtils;

    }

}

var test: Object3DTest;
window.onload = function ()
{

    test = new Object3DTest();


}
