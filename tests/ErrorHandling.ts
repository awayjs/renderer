///<reference path="../src/away/errors/Error.ts" />
///<reference path="../src/away/errors/AbstractMethodError.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/IMGLoaderTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/IMGLoaderTest.js
//------------------------------------------------------------------------------------------------


class ErrorHandlingTest
{

    constructor()
    {

        throw new away.errors.AbstractMethodError();

    }


}

window.onload = function ()
{

    try
    {

        var test = new ErrorHandlingTest();

    } catch ( e )
    {

        console.log( e , e instanceof away.errors.Error );

    }


}


