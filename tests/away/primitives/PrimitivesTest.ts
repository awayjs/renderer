///<reference path="../../../src/away/_definitions.ts" />


//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/pick/PickingTests.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/pick/PickingTests.js
//------------------------------------------------------------------------------------------------


module tests {

    export class PrimitivesTest //extends away.events.EventDispatcher
    {

        private torus : away.primitives.TorusGeometry;

        constructor()
        {

            this.torus = new away.primitives.TorusGeometry();
            this.torus.iValidate();
            console.log( this.torus );

        }

    }

}

window.onload = function ()
{

    var test = new tests.PrimitivesTest();


}


