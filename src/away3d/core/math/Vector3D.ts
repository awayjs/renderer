/**
 * @author Gary Paluk
 * @created 6/19/13
 * @module away3d.core.math
 */
module away3d.core.math {

    export class Vector3D
    {

        /**
         * The first element of a Vector3D object, such as the x coordinate of a point in the three-dimensional space.
         */
        public x:number;

        /*
         *The second element of a Vector3D object, such as the y coordinate of a point in the three-dimensional space.
         */
        public y:number;

        /**
         * The third element of a Vector3D object, such as the y coordinate of a point in the three-dimensional space.
         */
        public z:number;

        /**
         * The fourth element of a Vector3D object (in addition to the x, y, and z properties) can hold data such as
         * the angle of rotation.
         */
        public w:number;

        /**
         * Creates an instance of a Vector3D object.
         */
        constructor( x:number = 0, y:number = 0, z: number = 0, w: number = 0)
        {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }

        /**
         * [read-only] The length, magnitude, of the current Vector3D object from the origin (0,0,0) to the object's
         * x, y, and z coordinates.
         * @returns The length of the Vector3D
         */
        public get length():number
        {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }

        /**
         * [read-only] The square of the length of the current Vector3D object, calculated using the x, y, and z
         * properties.
         * @returns The squared length of the vector
         */
        public get lengthSquared():number
        {
            return (this.x * this.x + this.y * this.y + this.z + this.z);
        }

        /**
         * Adds the value of the x, y, and z elements of the current Vector3D object to the values of the x, y, and z
         * elements of another Vector3D object.
         */
        public add(a:Vector3D):Vector3D
        {
            return new Vector3D( this.x + a.x, this.y + a.y, this.z + a.z, this.w + a.w)
        }

        /**
         * [static] Returns the angle in radians between two vectors.
         */
        static angleBetween(a:Vector3D, b:Vector3D):number
        {
            return Math.acos(a.dotProduct(b) /(a.length* b.length));
        }

        /**
         * Returns a new Vector3D object that is an exact copy of the current Vector3D object.
         */
        public clone():Vector3D
        {
            return new Vector3D(this.x, this.y, this.z, this.w);
        }

        /**
         * Copies all of vector data from the source Vector3D object into the calling Vector3D object.
         */
        public copyFrom(src:Vector3D):Vector3D
        {
            return new Vector3D(src.x, src.y, src.z, src.w);
        }

        /**
         * Returns a new Vector3D object that is perpendicular (at a right angle) to the current Vector3D and another
         * Vector3D object.
         */
        public crossProduct(a:Vector3D):Vector3D
        {
            return new Vector3D( this.y * a.z - this.z * a.y,
                                 this.z * a.x - this.x * a.z,
                                 this.x * a.y - this.y * a.x );
        }

        /**
         * Decrements the value of the x, y, and z elements of the current Vector3D object by the values of the x, y,
         * and z elements of specified Vector3D object.
         */
        public decrementBy(a:Vector3D)
        {
            this.x -= a.x;
            this.y -= a.y;
            this.z -= a.z;
        }

        /**
         * [static] Returns the distance between two Vector3D objects.
         */
        static distance(pt1:Vector3D, pt2:Vector3D):number
        {
            var dx:number = (pt1.x - pt2.x) * (pt1.x - pt2.x);
            var dy:number = (pt1.y - pt2.y) * (pt1.y - pt2.y);
            var dz:number = (pt1.z - pt2.z) * (pt1.z - pt2.z);
            return Math.sqrt(dx + dy + dz);
        }

        /**
         * If the current Vector3D object and the one specified as the parameter are unit vertices, this method returns
         * the cosine of the angle between the two vertices.
         */
        public dotProduct(a:Vector3D)
        {
            return this.x * a.x + this.y * a.y + this.z * a.z;
        }

        /**
         * Determines whether two Vector3D objects are equal by comparing the x, y, and z elements of the current
         * Vector3D object with a specified Vector3D object.
         */
        public equals(cmp:Vector3D, allFour:boolean = false):boolean
        {
            if( !allFour )
            {
                return (this.x == cmp.x && this.y == cmp.y && this.z == cmp.z);
            }
            return (this.x == cmp.x && this.y == cmp.y && this.z == cmp.z && this.w == cmp.w);
        }

        /**
         * Increments the value of the x, y, and z elements of the current Vector3D object by the values of the x, y,
         * and z elements of a specified Vector3D object.
         */
        public incrementBy(a:Vector3D)
        {
            this.x += a.x;
            this.y += a.y;
            this.z += a.z;
        }

        /**
         * Compares the elements of the current Vector3D object with the elements of a specified Vector3D object to
         * determine whether they are nearly equal.
         */
        public nearEquals(cmp:Vector3D, epsilon:number, allFour:boolean = true):boolean
        {
            if((Math.abs(this.x - cmp.x) < epsilon )
             ||(Math.abs(this.y - cmp.y) < epsilon )
             ||(Math.abs(this.z - cmp.z) < epsilon ))
            {
                return false;
            }
            return Math.abs(this.w - cmp.w) > epsilon;
        }

        /**
         * Sets the current Vector3D object to its inverse.
         */
        public negate():void
        {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
        }

        /**
         * Converts a Vector3D object to a unit vector by dividing the first three elements (x, y, z) by the length of
         * the vector.
         */
        public normalize():void
        {
            var invLength = 1 / this.length;
            if(invLength != 0)
            {
                this.x *= invLength;
                this.y *= invLength;
                this.z *= invLength;
                return;
            }
            throw "Cannot divide by zero.";
        }

        /**
         * Divides the value of the x, y, and z properties of the current Vector3D object by the value of its w
         * property.
         */
        public project():void
        {
            this.x /= this.w;
            this.y /= this.w;
            this.z /= this.w;
        }

        /**
         * Scales the current Vector3D object by a scalar, a magnitude.
         */
        public scaleBy(s:number):void
        {
            this.x *= s;
            this.y *= s;
            this.z *= s;
        }

        /**
         * Sets the members of Vector3D to the specified values
         */
        public setTo(xa:number, ya:number, za:number):void
        {
            this.x = xa;
            this.y = ya;
            this.z = za;
        }

        /**
         * Subtracts the value of the x, y, and z elements of the current Vector3D object from the values of the x, y,
         * and z elements of another Vector3D object.
         */
        public subtract(a:Vector3D):Vector3D
        {
            return new Vector3D( this.x - a.x,this.y - a.y, this.z - a.z);
        }

        /**
         * Returns a string representation of the current Vector3D object.
         */
        public toString():string
        {
            return "[Vector3D] (x:" + this.x + " ,y:" + this.y + ", z" + this.z + ", w:" + this.w + ")";
        }

    }
}