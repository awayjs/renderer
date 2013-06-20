//--------------------------------------------------------------------------------------------
// Note: WebStorm test compile ( not commiting the export JS yet):
//
//  --sourcemap $ProjectFileDir$/src/Away3D.ts --target ES5  --comments --declaration --out $ProjectFileDir$/bin-debug/js/
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

module test{

    export class CoreMathTest {

        private va : away3d.core.math.Vector3D = new away3d.core.math.Vector3D(1,2,3,4);
        private vb : away3d.core.math.Vector3D = new away3d.core.math.Vector3D(4,3,2,1);

        private ma : away3d.core.math.Matrix3D  = new away3d.core.math.Matrix3D();
        private mb : away3d.core.math.Matrix3D  = new away3d.core.math.Matrix3D();

        private qa : away3d.core.math.Quaternion= new away3d.core.math.Quaternion();
        private qb : away3d.core.math.Quaternion= new away3d.core.math.Quaternion();

        public start() : void {

            this.va.subtract( this.vb );
            console.log( this.va , this.va.toString() );

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


