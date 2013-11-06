
module testimport.ts
{

    export class BaseClass
    {

        constructor()
        {
            console.log( 'BaseClass');
        }

        public logThis( txt : string ) : void
        {
            console.log( txt );

        }

        public static logThat( txt : string ) : void
        {


        }

    }


}
