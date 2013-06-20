/// <reference path="Vector3D.ts" />

module away3d.core.math
{

    export class Matrix3D
    {

        private _rawData : number[] = new Array<number>(16);

        // TODO: implement
        constructor( data ? : number[] )
        {

        }

        // TODO: implement
        public decompose( orientationStyle : string = "eulerAngles" ) : away3d.core.math.Vector3D[]
        {

            return new Array<away3d.core.math.Vector3D>();

        }

        // TODO: implement
        public append(lhs : Matrix3D) : void
        {

        }

        // TODO: implement
        public appendRotation(degrees : number, axis : away3d.core.math.Vector3D, pivotPoint : away3d.core.math.Vector3D = null) : void
        {

        }

        // TODO: implement
        public appendScale(xScale : number, yScale : number, zScale : number) : void
        {

        }

        // TODO: implement
        public appendTranslation(x : number, y : number, z : number) : void
        {

        }

        // TODO: implement
        public clone() : Matrix3D
        {
            return new Matrix3D();
        }

        // TODO: implement
        public copyColumnFrom(column : number, vector3D : away3d.core.math.Vector3D) : void
        {

        }

        // TODO: implement
        public copyColumnTo(column : number /*uint*/, vector3D : away3d.core.math.Vector3D) : void
        {

        }

        // TODO: implement
        public copyFrom(sourceMatrix3D : Matrix3D) : void
        {

        }

        // TODO: implement
        public copyRawDataFrom(vector : number[], index : number /*uint*/ = 0, transpose : Boolean = false) : void
        {

        }

        // TODO: implement
        public copyRawDataTo(vector : number[], index : number /*uint*/ = 0, transpose : Boolean = false) : void
        {

        }

        // TODO: implement
        public copyRowFrom(row : number /*uint*/ , vector3D : away3d.core.math.Vector3D) : void
        {

        }

        // TODO: implement
        public copyRowTo(row : number /*uint*/ , vector3D : away3d.core.math.Vector3D) : void
        {

        }

        // TODO: implement
        public copyToMatrix3D(dest : Matrix3D) : void
        {

        }

        // TODO: implement
        public deltaTransformVector(v : away3d.core.math.Vector3D) : away3d.core.math.Vector3D
        {
            return new away3d.core.math.Vector3D();
        }

        // TODO: implement
        public get determinant() : number
        {
            return 0;
        }

        // TODO: implement
        public identity() : void
        {

        }

        // TODO: implement
        public static interpolate(thisMat : Matrix3D, toMat : Matrix3D, percent : number) : Matrix3D
        {
            return new Matrix3D;
        }

        // TODO: implement
        public interpolateTo(toMat : Matrix3D, percent : number) : void
        {

        }

        // TODO: implement
        public invert() : boolean
        {

            return false;

        }

        // TODO: implement
        public pointAt(pos : away3d.core.math.Vector3D, at : away3d.core.math.Vector3D = null, up : away3d.core.math.Vector3D = null) : void
        {

        }

        // TODO: implement
        public get position() : away3d.core.math.Vector3D
        {

            return new away3d.core.math.Vector3D();// TODO : Implement;

        }

        // TODO: implement
        public set position( pos : away3d.core.math.Vector3D )
        {

        }

        // TODO: implement
        public prepend(rhs : Matrix3D) : void
        {

        }

        // TODO: implement
        public prependRotation(degrees : number, axis : away3d.core.math.Vector3D, pivotPoint : away3d.core.math.Vector3D = null) : void
        {

        }

        // TODO: implement
        public prependScale(xScale : number, yScale : number, zScale : number) : void
        {

        }

        // TODO: implement
        public prependTranslation(x : number, y : number, z : number) : void
        {

        }

        // TODO: implement
        public get rawData() : number[]
        {

            return new Array<number>();
        }

        // TODO: implement
        public set rawData(v : number[])
        {

        }

        // TODO: implement
        public recompose(components : away3d.core.math.Vector3D[], orientationStyle : String = "eulerAngles") : boolean
        {

            return false;

        }

        // TODO: implement
        public transformVector(v : away3d.core.math.Vector3D) : away3d.core.math.Vector3D
        {
            return new away3d.core.math.Vector3D();
        }

        // TODO: implement
        public transformVectors(vin : number[], vout : number[]) : void
        {

        }

        // TODO: implement
        public transpose() : void
        {

        }

    }

}

