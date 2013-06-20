/// <reference path="Vector3D.ts" />

module away3d.core.math
{

    export class Matrix3D
    {

        public rawData : Array<number> = new Array<number>(16);

        // TODO: implement
        constructor( data ? )
        {

        }

        // TODO: implement
        public copyRawDataFrom( m : Array<number> ) : Matrix3D
        {

            return new Matrix3D();// todo: implement

        }

        // TODO: implement
        public copyRawDataTo( m : Array<number> , index : number = 0 , transpose : bool = false ) : void
        {

            //return new away3d.core.math.Matrix3D();// todo: implement

        }

        // TODO: implement
        public copyColumnTo(column : number, v : away3d.core.math.Vector3D ) : void
        {


        }

        // TODO: implement
        public decompose( orientationStyle : string = "eulerAngles" ) : Array<away3d.core.math.Vector3D>
        {
            return new Array<away3d.core.math.Vector3D>(16);

        }

    }

}
