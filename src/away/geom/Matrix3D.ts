///<reference path="../_definitions.ts"/>

module away.geom
{

    export class Matrix3D
    {

        private _isfloat        : boolean;
        public  data            : any; // Can be Float32Array or number[];

        private static DEG2RAD      : number = Math.PI / 180.0;
        private static tempMul      : any;//boolean[] ;//= new Array<boolean>();
        private static temp         : any;//boolean[] ;//= new Array<boolean>();

        constructor( mat : number[] = null , usefloat : boolean = false )
        {

            if( Matrix3D.tempMul == null )
            {
                Matrix3D.tempMul           = new Array<boolean>();
                Matrix3D.tempMul[true]     = new Matrix3D( null , true );
                Matrix3D.tempMul[false]    = new Matrix3D( null , false );

            }

            if( Matrix3D.temp == null )
            {
                Matrix3D.temp           = new Array<boolean>();
                Matrix3D.temp[true]     = new Matrix3D( null , true );
                Matrix3D.temp[false]    = new Matrix3D( null , false );

            }

            if ( usefloat && typeof(Float32Array)!=typeof(undefined) )
            {

                this.data = new Float32Array(16);
                this._isfloat = true;

            }
            else
            {

                this.data = Array<number>();
                this._isfloat = false;

            }

            if ( mat == null )
            {
                this.identity();
            }
            else
            {
                // note: added ( karim )
                this.fromArray( mat );

            }

        }

        public get rawData() : number[]
        {
            return this.data;
        }

        public set rawData( value : number[] )
        {
            this.data = value;
        }

        public get isfloat() : boolean
        {

            return this._isfloat;
        }

        public identity () : void
        {
            this.data[0] = 1;  this.data[1] = 0;  this.data[2] = 0;  this.data[3] = 0;
            this.data[4] = 0;  this.data[5] = 1;  this.data[6] = 0;  this.data[7] = 0;
            this.data[8] = 0;  this.data[9] = 0;  this.data[10]= 1;  this.data[11]= 0;
            this.data[12]= 0;  this.data[13]= 0;  this.data[14]= 0;  this.data[15]= 1;
        }

        public scale ( sx : number , sy : number , sz : number ) : Matrix3D
        {
            this.identity ();

            this.data[0]    = sx;
            this.data[5]    = sy;
            this.data[10]   = sz;

            return this;
        }

        public translation ( dx : number , dy : number , dz : number ) : Matrix3D
        {

            this.identity ();

            this.data[12] = dx;
            this.data[13] = dy;
            this.data[14] = dz;

            return this;

        }

        public fromArray ( src : number[] ) : void
        {
            for (var i=0; i<16; i++ )
            {
                this.data[i] = src[i];
            }
        }

        // rotate about aligned axis only
        public rotationX ( angledeg : number ) : void
        {
            var cosa : number = Math.cos ( -angledeg * Matrix3D.DEG2RAD );
            var sina : number = Math.sin ( -angledeg * Matrix3D.DEG2RAD );

            this.fromArray ( [  1,0,0,0,
                                0, cosa, -sina, 0,
                                0, sina, cosa, 0,
                                0, 0, 0, 1 ] );

        }

        public rotationY ( angledeg : number ) : void
        {
            var cosa : number = Math.sin ( -angledeg * Matrix3D.DEG2RAD );
            var sina : number = Math.cos ( -angledeg * Matrix3D.DEG2RAD );

            this.fromArray ( [  cosa,0,sina,0,
                                0, 1, 0, 0,
                                -sina, 0, cosa, 0,
                                0, 0, 0, 1 ] );

        }

        public rotationZ ( angledeg : number ) : void
        {
            var cosa : number = Math.cos ( -angledeg * Matrix3D.DEG2RAD );
            var sina : number = Math.sin ( -angledeg * Matrix3D.DEG2RAD );

            this.fromArray ( [  cosa, -sina, 0, 0,
                                sina, cosa, 0, 0,
                                0,0,1,0,
                                0,0,0,1 ] );

        }

        // rotate about specified axis
        // assumes axis is normalized!
        public rotationXYZ ( angledeg : number , ax: number , ay: number , az : number ) : void
        {

            var cosa : number = Math.cos ( -angledeg * Matrix3D.DEG2RAD );
            var sina : number = Math.sin ( -angledeg * Matrix3D.DEG2RAD );

            var n11 : number = ax * ax;
            var n22 : number = ay * ay;
            var n33 : number = az * az;
            var nxy : number = ax * ay;
            var nxz : number = ax * az;
            var nyz : number = ay * az;
            this.fromArray ( [  n11 + (1 - n11 ) * cosa, nxy * (1 - cosa) - az * sina, nxz * (1 - cosa) + ay * sina, 0,
                                nxy * (1 - cosa) + az * sina, n22 + (1 - n22 ) * cosa, nyz * (1 - cosa) - ax * sina, 0,
                                nxz * (1 - cosa) - ay * sina, nyz * (1 - cosa) + ax * sina, n33 + (1 - n33 ) * cosa, 0,
                                0, 0, 0, 1 ] );
        }

        public rotation ( angledeg : number , axis : away.geom.Vector3D ) : void
        {
            this.rotationXYZ ( angledeg, axis.x, axis.y, axis.z );
            /*
             if ( axis===Matrix3D.X_AXIS ) {
             this.rotationX ( angledeg );
             } else {
             if ( axis===Matrix3D.Y_AXIS ) {
             this.rotationY ( angledeg );
             } else {
             if ( axis===Matrix3D.Z_AXIS ) {
             this.rotationZ ( angledeg );
             } else {
             this.rotationXYZ ( angledeg, axis[0], axis[1], axis[2] );
             }
             }
             }*/
        }

        public multiplyInPlace ( dest : Matrix3D , a : Matrix3D , b  : Matrix3D ) : void
        {
            /*
            function dotRowColumn ( ar, bc )
            {
                return  a.data[ar*4  ]*b.data[bc] +
                        a.data[ar*4+1]*b.data[bc+4] +
                        a.data[ar*4+2]*b.data[bc+8] +
                        a.data[ar*4+3]*b.data[bc+12];
            }
            */

            // reference
            var orgdest : Matrix3D ;

            if ( dest===a || dest===b )
            {
                orgdest = dest;
                dest = Matrix3D.tempMul[dest.isfloat];
            }

            for ( var row=0; row<4; row++ )
            {
                dest.data[row*4+0] = this.dotRowColumn ( a , b , row, 0 );
                dest.data[row*4+1] = this.dotRowColumn ( a , b , row, 1 );
                dest.data[row*4+2] = this.dotRowColumn ( a , b , row, 2 );
                dest.data[row*4+3] = this.dotRowColumn ( a , b , row, 3 );
            }

            if ( orgdest )
            {
                orgdest.copyFrom(dest);
            }
        }

        private dotRowColumn (  a : Matrix3D , b  : Matrix3D , ar : number , bc : number ) : number
        {
            return  a.data[ar*4  ]*b.data[bc] +
                    a.data[ar*4+1]*b.data[bc+4] +
                    a.data[ar*4+2]*b.data[bc+8] +
                    a.data[ar*4+3]*b.data[bc+12];
        }

        public copyFrom ( othermatrix : Matrix3D ): void
        {

            if ( this.isfloat && othermatrix.isfloat )
            {

                ( <Float32Array> this.data ).set( othermatrix.data );
                //this.data.set ( othermatrix.data );
            }
            else
            {
                for (var i=0; i<16; i++ )
                {
                    this.data[i] = othermatrix.data[i];
                }
            }
        }

        public copyTo ( othermatrix : Matrix3D ) : void
        {
            othermatrix.copyFrom(this);
        }

        public determinant () : number
        {
            // test if matrix has no shearing, which is often true
            if ( this.data[0*4+3] == 0 && this.data[1*4+3] == 0 && this.data[2*4+3] == 0 )
            {
                var a = this.data[2*4+2] * this.data[3*4+3];
                var b = this.data[1*4+2] * this.data[3*4+3];
                var d = this.data[0*4+2] * this.data[3*4+3];

                return this.data[0*4+0] * ( this.data[1*4+1] * a - this.data[2*4+1] * b )
                        - this.data[1*4+0] * ( this.data[0*4+1] * a - this.data[2*4+1] * d )
                        + this.data[2*4+0] * ( this.data[0*4+1] * b - this.data[1*4+1] * d );
            }
            else
            {
                var a = this.data[2*4+2] * this.data[3*4+3] - this.data[3*4+2] * this.data[2*4+3];
                var b = this.data[1*4+2] * this.data[3*4+3] - this.data[3*4+2] * this.data[1*4+3];
                var c = this.data[1*4+2] * this.data[2*4+3] - this.data[2*4+2] * this.data[1*4+3];
                var d = this.data[0*4+2] * this.data[3*4+3] - this.data[3*4+2] * this.data[0*4+3];
                var e = this.data[0*4+2] * this.data[2*4+3] - this.data[2*4+2] * this.data[0*4+3];
                var f = this.data[0*4+2] * this.data[1*4+3] - this.data[1*4+2] * this.data[0*4+3];
                return this.data[0*4+0] * ( this.data[1*4+1] * a - this.data[2*4+1] * b + this.data[3*4+1] * c )
                        - this.data[1*4+0] * ( this.data[0*4+1] * a - this.data[2*4+1] * d + this.data[3*4+1] * e )
                        + this.data[2*4+0] * ( this.data[0*4+1] * b - this.data[1*4+1] * d + this.data[3*4+1] * f )
                        - this.data[3*4+0] * ( this.data[0*4+1] * c - this.data[1*4+1] * e + this.data[2*4+1] * f );

            }

        }

        public invert () : boolean
        {
            var t;
            var m0, m1, m2, m3, s;

            var r0 = [], r1 = [], r2 = [], r3 = [];

            r0[0] = this.data[0*4+0], r0[1] = this.data[1*4+0],
            r0[2] = this.data[2*4+0], r0[3] = this.data[3*4+0],
            r0[4] = 1.0, r0[5] = r0[6] = r0[7] = 0.0,

            r1[0] = this.data[0*4+1], r1[1] = this.data[1*4+1],
            r1[2] = this.data[2*4+1], r1[3] = this.data[3*4+1],
            r1[5] = 1.0, r1[4] = r1[6] = r1[7] = 0.0,

            r2[0] = this.data[0*4+2], r2[1] = this.data[1*4+2],
            r2[2] = this.data[2*4+2], r2[3] = this.data[3*4+2],
            r2[6] = 1.0, r2[4] = r2[5] = r2[7] = 0.0,

            r3[0] = this.data[0*4+3], r3[1] = this.data[1*4+3],
            r3[2] = this.data[2*4+3], r3[3] = this.data[3*4+3],
            r3[7] = 1.0, r3[4] = r3[5] = r3[6] = 0.0;

            // choose pivot - or die
            if (Math.abs(r3[0])>Math.abs(r2[0])) { t=r3; r3=r2; r2=t; }
            if (Math.abs(r2[0])>Math.abs(r1[0])) { t=r2; r2=r1; r1=t; }
            if (Math.abs(r1[0])>Math.abs(r0[0])) { t=r1; r1=r0; r0=t; }
            if (0.0 == r0[0])  return false;

            // eliminate first variable
            m1 = r1[0]/r0[0]; m2 = r2[0]/r0[0]; m3 = r3[0]/r0[0];
            s = r0[1]; r1[1] -= m1 * s; r2[1] -= m2 * s; r3[1] -= m3 * s;
            s = r0[2]; r1[2] -= m1 * s; r2[2] -= m2 * s; r3[2] -= m3 * s;
            s = r0[3]; r1[3] -= m1 * s; r2[3] -= m2 * s; r3[3] -= m3 * s;

            s = r0[4];
            if (s != 0.0) { r1[4] -= m1 * s; r2[4] -= m2 * s; r3[4] -= m3 * s; }
            s = r0[5];
            if (s != 0.0) { r1[5] -= m1 * s; r2[5] -= m2 * s; r3[5] -= m3 * s; }
            s = r0[6];
            if (s != 0.0) { r1[6] -= m1 * s; r2[6] -= m2 * s; r3[6] -= m3 * s; }
            s = r0[7];
            if (s != 0.0) { r1[7] -= m1 * s; r2[7] -= m2 * s; r3[7] -= m3 * s; }

            // choose pivot - or die
            if (Math.abs(r3[1])>Math.abs(r2[1])) { t=r3; r3=r2; r2=t; }
            if (Math.abs(r2[1])>Math.abs(r1[1])) { t=r2; r2=r1; r1=t; }
            if (0.0 == r1[1])  return false;

            // eliminate second variable
            m2 = r2[1]/r1[1]; m3 = r3[1]/r1[1];
            r2[2] -= m2 * r1[2]; r3[2] -= m3 * r1[2];
            r2[3] -= m2 * r1[3]; r3[3] -= m3 * r1[3];
            s = r1[4]; if (0.0 != s) { r2[4] -= m2 * s; r3[4] -= m3 * s; }
            s = r1[5]; if (0.0 != s) { r2[5] -= m2 * s; r3[5] -= m3 * s; }
            s = r1[6]; if (0.0 != s) { r2[6] -= m2 * s; r3[6] -= m3 * s; }
            s = r1[7]; if (0.0 != s) { r2[7] -= m2 * s; r3[7] -= m3 * s; }

            // choose pivot - or die
            if (Math.abs(r3[2])>Math.abs(r2[2])) { t=r3; r3=r2; r2=t; }
            if (0.0 == r2[2])  return false;

            // eliminate third variable
            m3 = r3[2]/r2[2];
            r3[3] -= m3 * r2[3], r3[4] -= m3 * r2[4],
            r3[5] -= m3 * r2[5], r3[6] -= m3 * r2[6],
            r3[7] -= m3 * r2[7];

            // last check
            if (0.0 == r3[3]) return false;
            s = 1.0/r3[3];             // now back substitute row 3
            r3[4] *= s; r3[5] *= s; r3[6] *= s; r3[7] *= s;
            m2 = r2[3];                 // now back substitute row 2
            s  = 1.0/r2[2]
            r2[4] = s * (r2[4] - r3[4] * m2), r2[5] = s * (r2[5] - r3[5] * m2),
            r2[6] = s * (r2[6] - r3[6] * m2), r2[7] = s * (r2[7] - r3[7] * m2);
            m1 = r1[3];
            r1[4] -= r3[4] * m1, r1[5] -= r3[5] * m1,
            r1[6] -= r3[6] * m1, r1[7] -= r3[7] * m1;
            m0 = r0[3];
            r0[4] -= r3[4] * m0, r0[5] -= r3[5] * m0,
            r0[6] -= r3[6] * m0, r0[7] -= r3[7] * m0;

            m1 = r1[2];                 // now back substitute row 1
            s  = 1.0/r1[1];
            r1[4] = s * (r1[4] - r2[4] * m1), r1[5] = s * (r1[5] - r2[5] * m1),
            r1[6] = s * (r1[6] - r2[6] * m1), r1[7] = s * (r1[7] - r2[7] * m1);
            m0 = r0[2];
            r0[4] -= r2[4] * m0, r0[5] -= r2[5] * m0,
            r0[6] -= r2[6] * m0, r0[7] -= r2[7] * m0;

            m0 = r0[1];                 // now back substitute row 0
            s  = 1.0/r0[0];
            r0[4] = s * (r0[4] - r1[4] * m0), r0[5] = s * (r0[5] - r1[5] * m0),
            r0[6] = s * (r0[6] - r1[6] * m0), r0[7] = s * (r0[7] - r1[7] * m0);

            this.data[0*4+0] = r0[4]; this.data[1*4+0] = r0[5],
                this.data[2*4+0] = r0[6]; this.data[3*4+0] = r0[7],
                this.data[0*4+1] = r1[4]; this.data[1*4+1] = r1[5],
                this.data[2*4+1] = r1[6]; this.data[3*4+1] = r1[7],
                this.data[0*4+2] = r2[4]; this.data[1*4+2] = r2[5],
                this.data[2*4+2] = r2[6]; this.data[3*4+2] = r2[7],
                this.data[0*4+3] = r3[4]; this.data[1*4+3] = r3[5],
                this.data[2*4+3] = r3[6]; this.data[3*4+3] = r3[7];

            return true;
        }

        public toArray ( ) : number[]
        {
            var a : number[] = new Array<number>();
            for (var i=0; i<16; i++ )
            {
                a[i] = this.data[i];
            }
            return a;
        }

        public toString () : string
        {
            return (this.toArray()).toString()+(this.isfloat?" Float":" Number");
        }

        public isEpsEqual ( other : Matrix3D , eps : number )
        {

            for (var i=0; i<16; i++ )
            {
                if ( !this.epsEqual( other.data[i], this.data[i], eps) ) return false;
            }
            return true;
        }

        private epsEqual ( a : number , b: number , eps : number )
        {
            return a-eps <= b && a+eps >= b;
        }

        public frustum ( left : number , right: number , top: number , bottom: number , znear: number , zfar : number ) : void
        {
            this.data[0] = (2*znear)/(right-left);
            this.data[1] = 0;
            this.data[2] = (right+left)/(right-left);
            this.data[3] = 0;

            this.data[4] = 0;
            this.data[5] = (2*znear)/(top-bottom);
            this.data[6] = (top+bottom)/(top-bottom);
            this.data[7] = 0;

            this.data[8] = 0;
            this.data[9] = 0;
            this.data[10] = zfar/(znear-zfar);
            this.data[11] = -1;

            this.data[12] = 0;
            this.data[13] = 0;
            this.data[14] = (znear*zfar)/(znear-zfar);
            this.data[15] = 0;
        }

        public projection = function ( znear : number , zfar: number , fovdeg: number , aspect : number ) : void
        {

            var yval : number = znear * Math.tan( fovdeg * Matrix3D.DEG2RAD * 0.5 );
            var xval : number = yval * aspect;

            this.frustum ( -xval, xval, -yval, yval, znear, zfar );
        }

        public transform3x3transposed ( vectorin : away.geom.Vector3D , vectorout : away.geom.Vector3D ) : void
        {
            vectorout.x = vectorin.x * this.data[0] + vectorin.y * this.data[1] + vectorin.z * this.data[2];
            vectorout.y = vectorin.x * this.data[4] + vectorin.y * this.data[5] + vectorin.z * this.data[6];
            vectorout.z = vectorin.x * this.data[8] + vectorin.y * this.data[9] + vectorin.z * this.data[10];
        }

        public transform4x4transposed (vectorin : away.geom.Vector3D , vectorout : away.geom.Vector3D ) : void
        {
            vectorout.x = vectorin.x*this.data[0] + vectorin.y*this.data[1] + vectorin.z*this.data[2] + vectorin.w*this.data[3];
            vectorout.y= vectorin.x*this.data[4] + vectorin.y*this.data[5] + vectorin.z*this.data[6] + vectorin.w*this.data[7];
            vectorout.z = vectorin.x*this.data[8] + vectorin.y*this.data[9] + vectorin.z*this.data[10] + vectorin.w*this.data[11];
            vectorout.w = vectorin.x*this.data[12] + vectorin.y*this.data[13] + vectorin.z*this.data[14] + vectorin.w*this.data[15];
        }

        public transform3x3 ( vectorin : away.geom.Vector3D , vectorout : away.geom.Vector3D ) : void
        {
            vectorout.x = vectorin.x*this.data[0] + vectorin.y*this.data[4] + vectorin.z*this.data[8];
            vectorout.y = vectorin.x*this.data[1] + vectorin.y*this.data[5] + vectorin.z*this.data[9];
            vectorout.z = vectorin.x*this.data[2] + vectorin.y*this.data[6] + vectorin.z*this.data[10];
        }

        // same as Flash transformVector
        public transform3x4 ( vectorin : away.geom.Vector3D , vectorout : away.geom.Vector3D ) : void
        {
            vectorout.x = vectorin.x*this.data[0] + vectorin.y*this.data[4] + vectorin.z*this.data[8] + this.data[12];
            vectorout.y = vectorin.x*this.data[1] + vectorin.y*this.data[5] + vectorin.z*this.data[9] + this.data[13];
            vectorout.z = vectorin.x*this.data[2] + vectorin.y*this.data[6] + vectorin.z*this.data[10]  + this.data[14];
        }

        public transformVector ( vectorin : away.geom.Vector3D , vectorout : away.geom.Vector3D ) : void
        {
            return this.transform3x4( vectorin , vectorout );
        }

        public transform4x4 ( vectorin : away.geom.Vector3D , vectorout : away.geom.Vector3D ) : void
        {
            vectorout.x = vectorin.x*this.data[0] + vectorin.y*this.data[4] + vectorin.z*this.data[8] + vectorin.w*this.data[12];
            vectorout.y = vectorin.x*this.data[1] + vectorin.y*this.data[5] + vectorin.z*this.data[9] + vectorin.w*this.data[13];
            vectorout.z = vectorin.x*this.data[2] + vectorin.y*this.data[6] + vectorin.z*this.data[10] + vectorin.w*this.data[14];
            vectorout.w = vectorin.x*this.data[3] + vectorin.y*this.data[7] + vectorin.z*this.data[11] + vectorin.w*this.data[15];
        }

        // same as Flash function, 3x4, non transposed
        public transformVectors ( numbersarrayin : away.geom.Vector3D, numbersarrayout : away.geom.Vector3D ) : void
        {
            for ( var i = 0; i<numbersarrayin.length-2; i+=3 )
            {
                var x = numbersarrayin.x
                var y = numbersarrayin.y
                var z = numbersarrayin.z

                numbersarrayout.x = x*this.data[0] + y*this.data[4] + z*this.data[8] + this.data[12]; // implicit w=1
                numbersarrayout.y = x*this.data[1] + y*this.data[5] + z*this.data[9] + this.data[13]; // implicit w=1
                numbersarrayout.z = x*this.data[2] + y*this.data[6] + z*this.data[10] + this.data[14]; // implicit w=1
            }
        }

        //---------------------------------------------------------------------------
        // missing functions from AS3:
        //---------------------------------------------------------------------------

        // todo: is this the translation function
        //public function append(lhs : Matrix3D) : void; // Missing

        // todo: is this the rotation function ?
        //public function appendRotation(degrees : Number, axis : Vector3D, pivotPoint : Vector3D = null) : void;

        // todo: is this the scale function ?
        //public function appendScale(xScale : Number, yScale : Number, zScale : Number) : void;

        // todo: implement
        //public function appendTranslation(x : Number, y : Number, z : Number) : void;

        // todo: implement
        //public function copyColumnFrom(column : uint, vector3D : Vector3D) : void;

        // todo: implement
        //public function copyColumnTo(column : uint, vector3D : Vector3D) : void;

        // todo: implement
        //public function copyFrom(sourceMatrix3D : Matrix3D) : void;

        // todo: implement
        //public function copyRawDataFrom(vector : Vector.<Number>, index : uint = 0, transpose : Boolean = false) : void;

        // todo: implement
        //public function copyRawDataTo(vector : Vector.<Number>, index : uint = 0, transpose : Boolean = false) : void;

        // todo: imeplement
        //public function copyRowFrom(row : uint, vector3D : Vector3D) : void;

        // todo: implement
        //public function copyRowTo(row : uint, vector3D : Vector3D) : void;

        // todo: implement
        //public function copyToMatrix3D(dest : Matrix3D) : void;

        // todo: implement
        //public function decompose(orientationStyle : String = "eulerAngles") : Vector.<Vector3D>;

        // todo: implement
        //public function deltaTransformVector(v : Vector3D) : Vector3D;

        // todo: implement
        //public static function interpolate(thisMat : Matrix3D, toMat : Matrix3D, percent : Number) : Matrix3D;

        // todo: implement
        //public function interpolateTo(toMat : Matrix3D, percent : Number) : void;

        // todo: implement
        //public function pointAt(pos : Vector3D, at : Vector3D = null, up : Vector3D = null) : void;

        // todo: implement
        //public function get position() : Vector3D;
        //public function set position(pos : Vector3D) : void;

        // todo: implement
        //public function prependRotation(degrees : Number, axis : Vector3D, pivotPoint : Vector3D = null) : void;

        // todo: implement
        //public function prependScale(xScale : Number, yScale : Number, zScale : Number) : void;

        // todo: implement
        //public function prependTranslation(x : Number, y : Number, z : Number) : void;

        // todo: implement
        //public function recompose(components : Vector.<Vector3D>, orientationStyle : String = "eulerAngles") : Boolean;



    }


}