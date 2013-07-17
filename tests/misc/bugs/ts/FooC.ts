///<reference path="FooA.ts" />
module ZeBug
{

    export class FooC extends ZeBug.FooA
    {

        constructor()
        {

            super();

        }

        public sayFooC() : void
        {

            console.log( 'say fooC');

        }




    }

}