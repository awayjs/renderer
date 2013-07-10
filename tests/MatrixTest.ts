///<reference path="../src/away/geom/Matrix.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/MatrixTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/MatrixTest.js
//------------------------------------------------------------------------------------------------


class MatrixTest
{

    private ma : away.geom.Matrix = new away.geom.Matrix( 10 , 11, 12 , 13 , 14 , 15);
    private mb : away.geom.Matrix = new away.geom.Matrix( 0 , 1, 2 , 3 , 4 , 5);

    constructor()
    {

        this.ma.concat( this.mb );
        console.log( this.ma );

    }


}

window.onload = function ()
{

    try
    {

        var test = new MatrixTest();

    }
    catch ( e )
    {

        console.log( e );

    }


}


