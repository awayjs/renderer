
///<reference path='_reference.ts'/>

module testimport.ts
{

    import BaseClass = testimport.ts.BaseClass

    export class FooA extends BaseClass
    {

        constructor()
        {
            super();
            console.log( 'BaseClass');
        }

        public logThis( txt : string ) : void
        {
            console.log( txt );
        }

    }


}
