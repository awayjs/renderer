
///<reference path='_reference.ts'/>

module testimport.ts
{

    import FooA = testimport.ts.FooA

    export class FooB extends FooA
    {

        constructor()
        {
            super();
            console.log( 'FooB');
        }

    }


}
