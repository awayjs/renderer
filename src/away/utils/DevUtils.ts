
///<reference path="../_definitions.ts"/>

module away.utils
{

    export class DevUtils
    {

        public static DEBUG     : boolean = true;
        public static LOG       : boolean = true;

        public static partialImplementationError( clss : string , fnc : string , msg : string )
        {

            DevUtils.log( clss , fnc , msg );

            if ( DevUtils.DEBUG )
            {

                throw new away.errors.PartialImplementationError( clss + '.' + fnc + ': ' +  msg );

            }

        }

        public static log ( clss : string , fnc : string , msg : string = '' )
        {

            if ( DevUtils.LOG )
            {

                console.log( clss + '.' + fnc + ': ' +  msg );

            }

        }

    }

}
