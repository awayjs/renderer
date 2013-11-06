///<reference path='ts/_reference.ts'/>

module testimport.ts
{

    import FooA         = testimport.ts.FooA;
    import FooB         = testimport.ts.FooB;
    import BaseClass    = testimport.ts.BaseClass

    class ImportTest extends FooB
    {

        constructor()
        {
            super();
            BaseClass.logThat( 'helloWorld');
            this.logThis( 'hello Me');
        }

        // override
        public logThis( txt : string ) : void
        {
            console.log( 'override '  + txt );
        }

    }

}
