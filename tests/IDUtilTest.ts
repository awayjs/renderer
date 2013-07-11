///<reference path="../src/away/library/utils/IDUtil.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/IDUtilTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/IDUtilTest.js
//------------------------------------------------------------------------------------------------

class IDUtilTest
{


    constructor()
    {
        console.log( away.library.IDUtil.createUID() );
    }


}

var test: IDUtilTest;
window.onload = function ()
{

    test = new IDUtilTest();

}
