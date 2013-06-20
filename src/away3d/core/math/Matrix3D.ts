/// <reference path="Vector3D.ts" />

module away3d.core.math
{

    export class Matrix3D
    {

        public rawData : Array<number> = new Array<number>(16);

        constructor( data ? )
        {
            // TODO: implement

        }

        public copyRawDataFrom( m : Array<number> ) : away3d.core.math.Matrix3D
        {


            return new away3d.core.math.Matrix3D();// todo: implement

        }

        public copyRawDataTo( m : Matrix3D , index : number = 0 , transpose : bool = false ) : void
        {

            //return new away3d.core.math.Matrix3D();// todo: implement

        }


        public copyColumnTo(column : number, v : away3d.core.math.Vector3D ) : void
        {


        }

        public decompose( orientationStyle : string = "eulerAngles" ) : Array<number>
        {

            return new Array<number>(16);

        }

    }

}
