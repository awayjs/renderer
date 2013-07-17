///<reference path="Base.ts" />
///<reference path="FooC.ts" />

module ZeBug
{

    export class FooA extends ZeBug.Base
    {

        private fooc : ZeBug.FooC = new ZeBug.FooC();

        constructor()
        {

            super();
            console.log( 'FooA');

        }

        public sayFooA() : void
        {

            console.log( 'say fooA');
        }


    }

}
