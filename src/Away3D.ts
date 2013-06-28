//--------------------------------------------------------------------------------------------
// WebStorm compile param strings
//--------------------------------------------------------------------------------------------
//
// Multiple JS export:
//  --sourcemap $ProjectFileDir$/src/Away3D.ts --target ES5  --comments --declaration --out $ProjectFileDir$/bin-debug/js/
//
// Single JS export:
//  --sourcemap $ProjectFileDir$/src/Away3D.ts --target ES5  --comments --declaration --out $ProjectFileDir$/bin-debug/js/Away3D_all.js
//
//--------------------------------------------------------------------------------------------

/// <reference path="away3d/core/math/Orientation3D.ts" />
/// <reference path="away3d/core/math/Vector3D.ts" />
/// <reference path="away3d/core/math/MathConsts.ts" />
/// <reference path="away3d/core/math/Matrix3DUtils.ts" />
/// <reference path="away3d/core/math/Matrix3D.ts" />
/// <reference path="away3d/core/math/Plane3D.ts" />
/// <reference path="away3d/core/math/PlaneClassification.ts" />
/// <reference path="away3d/core/math/Quaternion.ts" />


/// <reference path="away3d/core/data/EntityListItemPool.ts" />
/// <reference path="away3d/core/data/RenderableListItemPool.ts" />

// TEST Commit...


module test{

    export class CoreMathTest {

        private va : away3d.core.math.Vector3D = new away3d.core.math.Vector3D(1,2,3,4);
        private vb : away3d.core.math.Vector3D = new away3d.core.math.Vector3D(4,3,2,1);

        private ma : away3d.core.math.Matrix3D  = new away3d.core.math.Matrix3D();
        private mb : away3d.core.math.Matrix3D  = new away3d.core.math.Matrix3D();

        private qa : away3d.core.math.Quaternion= new away3d.core.math.Quaternion(1,2,3,4);
        private qb : away3d.core.math.Quaternion= new away3d.core.math.Quaternion(1,2,3,5);
        private qc : away3d.core.math.Quaternion= new away3d.core.math.Quaternion(11,12,13,14);

        private plane3d : away3d.core.math.Plane3D= new away3d.core.math.Plane3D(.1,.5,.7,1.1 );

        public start() : void {

            // Quick tests to make sure it compiles

            this.va.subtract( this.vb );
            console.log( this.va , this.va.toString() );

            this.qa.lerp( this.qb, this.qc,.25);
            console.log( this.qa , this.qa.toString() );

            this.plane3d.normalize();
            console.log( this.plane3d, this.plane3d.toString() );

            this.va.normalize()
            this.plane3d.fromNormalAndPoint( this.va , this.vb )

            console.log( 'Matrix3DUtils.compare:' + away3d.core.math.Matrix3DUtils.compare( this.ma , this.ma ) );
        }

    }

}

var coreMathTest : test.CoreMathTest;

/*
 */
function onWindowLoad( event ) {

    coreMathTest = new test.CoreMathTest();
    coreMathTest.start();

}

/*
 */
function onWindowError( event ) {


}

window.onload  = onWindowLoad;
window.onerror = onWindowError;


