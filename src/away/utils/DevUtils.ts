
///<reference path="../_definitions.ts"/>

module away.utils
{

    export class Dev
    {

        public static THROW_ERROR   : boolean = true;
        public static DEBUG         : boolean = true;
        public static LOG           : boolean = true;

        public static throwPIR( clss : string , fnc : string , msg : string )
        {

            Dev.log( clss , fnc , msg );

            if ( Dev.THROW_ERROR )
            {

                throw new away.errors.PartialImplementationError( clss + '.' + fnc + ': ' +  msg );

            }

        }

        public static log ( clss : string , fnc : string , msg : string = '' )
        {

            if ( Dev.LOG )
            {

                console.log( clss + '.' + fnc + ': ' +  msg );

            }

        }

    }

}
