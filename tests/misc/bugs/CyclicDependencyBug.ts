///<reference path="../../ts/FooC.ts" />
///<reference path="ts/FooA.ts" />


// --sourcemap $ProjectFileDir$/tests/CyclicDependencyBug.ts --target ES5 --comments --out $ProjectFileDir$/tests/CyclicDependencyBug.js

class TestCDB
{

    private fooA : ZeBug.FooA;
    private fooC : ZeBug.FooC;

    constructor()
    {

    }

}

var test: TestCDB;

window.onload = function ()
{

    test = new TestCDB();

}

