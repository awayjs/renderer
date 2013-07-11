//<reference path="../src/away/base/Object3D.ts" />
///<reference path="../src/away/math/MathConsts.ts" />
///<reference path="../src/away/math/Quaternion.ts" />
///<reference path="../src/away/math/Matrix3DUtils.ts" />
///<reference path="../src/away/math/Plane3D.ts" />
///<reference path="../src/away/geom/Matrix3D.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/Object3DTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/Object3DTest.js
//------------------------------------------------------------------------------------------------

class Object3DTest
{


    constructor()
    {

        var q : away.math.Quaternion = new away.math.Quaternion();

        var m : away.geom.Matrix3D = new away.geom.Matrix3D();
        away.math.Matrix3DUtils;


        //console.log( away.math.MathConsts.DEGREES_TO_RADIANS );
        //console.log( away.math.MathConsts.RADIANS_TO_DEGREES );

        var rdc:number[] = new Array<number>(16);
        console.log(rdc.length);

    }


}

var test: Object3DTest;
window.onload = function ()
{

    test = new Object3DTest();


}
