
///<reference path="../_definitions.ts"/>

module away.utils
{

    export class Debug
    {

        public static THROW_ERRORS  : boolean = true;
        public static ENABLE_LOG    : boolean = true;
        public static LOG_PI_ERRORS : boolean = true;

        public static throwPIR( clss : string , fnc : string , msg : string )
        {

            Debug.logPIR( 'PartialImplementationError '  + clss , fnc , msg );

            if ( Debug.THROW_ERRORS )
            {

                throw new away.errors.PartialImplementationError( clss + '.' + fnc + ': ' +  msg );

            }

        }

        private static logPIR ( clss : string , fnc : string , msg : string = '' )
        {

            if ( Debug.LOG_PI_ERRORS )
            {

                console.log( clss + '.' + fnc + ': ' +  msg );

            }

        }

        public static log ( ...args : any[] )
        {

            if ( Debug.ENABLE_LOG )
            {

                console.log.apply(console, arguments);

            }

        }

    }

}
