///<reference path="../loaders/parsers/JSONTextureParser.ts" />
///<reference path="../../../lib/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.geom {

    export class MatrixTest
    {

        private ma : away.geom.Matrix = new away.geom.Matrix( 10 , 11, 12 , 13 , 14 , 15);
        private mb : away.geom.Matrix = new away.geom.Matrix( 0 , 1, 2 , 3 , 4 , 5);

        constructor()
        {

            this.ma.concat( this.mb );
            console.log( this.ma );

        }


    }
}