///<reference path="ts/FooA.ts" />
///<reference path="ts/FooC.ts" />

// --sourcemap $ProjectFileDir$/tests/CyclicDependencyBug.ts --target ES5 --comments --out $ProjectFileDir$/tests/CyclicDependencyBug.js

class TestCDB
{

    private fooA : ZeBug.FooA;
    private fooC : ZeBug.FooC;

    constructor()
    {

        this.fooA = new ZeBug.FooA();
        this.fooA.sayBase();

        this.fooC = new ZeBug.FooC();
        this.fooC.sayFooA();

    }


}

var test: TestCDB;

window.onload = function ()
{

    test = new TestCDB();

}

