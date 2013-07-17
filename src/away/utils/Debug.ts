
///<reference path="../_definitions.ts"/>

module away.utils
{

    export class Debug
    {

        public static THROW_ERROR   : boolean = true;
        public static DEBUG         : boolean = true;
        public static LOG           : boolean = true;

        public static throwPIR( clss : string , fnc : string , msg : string )
        {

            Debug.log( 'PartialImplementationError '  + clss , fnc , msg );

            if ( Debug.THROW_ERROR )
            {

                throw new away.errors.PartialImplementationError( clss + '.' + fnc + ': ' +  msg );

            }

        }

        public static log ( clss : string , fnc : string , msg : string = '' )
        {

            if ( Debug.LOG )
            {

                console.log( clss + '.' + fnc + ': ' +  msg );

            }

        }

    }

}
