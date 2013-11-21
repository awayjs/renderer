///<reference path="../../_definitions.ts"/>
module away.geom
{

	export class Matrix
	{

		public a:number;
		public b:number;
		public c:number;
		public d:number;
		public tx:number;
		public ty:number;

		constructor(a:number = 1, b:number = 0, c:number = 0, d:number = 1, tx:number = 0, ty:number = 0)
		{

			this.a = a;
			this.b = b;
			this.c = c;
			this.d = d;
			this.tx = tx;
			this.ty = ty;

		}

		/**
		 *
		 * @returns {away.geom.Matrix}
		 */
		public clone():Matrix
		{

			return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);

		}

		/**
		 *
		 * @param m
		 */
		public concat(m:Matrix):void
		{

			var a1 = this.a*m.a + this.b*m.c;
			this.b = this.a*m.b + this.b*m.d;
			this.a = a1;

			var c1 = this.c*m.a + this.d*m.c;
			this.d = this.c*m.b + this.d*m.d;

			this.c = c1;

			var tx1 = this.tx*m.a + this.ty*m.c + m.tx;
			this.ty = this.tx*m.b + this.ty*m.d + m.ty;
			this.tx = tx1;

		}

		/**
		 *
		 * @param column
		 * @param vector3D
		 */
		public copyColumnFrom(column:number, vector3D:Vector3D):void
		{

			if (column > 2) {

				throw "Column " + column + " out of bounds (2)";

			} else if (column == 0) {

				this.a = vector3D.x;
				this.c = vector3D.y;

			} else if (column == 1) {

				this.b = vector3D.x;
				this.d = vector3D.y;

			} else {

				this.tx = vector3D.x;
				this.ty = vector3D.y;

			}

		}

		/**
		 *
		 * @param column
		 * @param vector3D
		 */
		public copyColumnTo(column:number, vector3D:away.geom.Vector3D):void
		{

			if (column > 2) {

				throw new away.errors.ArgumentError("ArgumentError, Column " + column + " out of bounds [0, ..., 2]");

			} else if (column == 0) {

				vector3D.x = this.a;
				vector3D.y = this.c;
				vector3D.z = 0;

			} else if (column == 1) {

				vector3D.x = this.b;
				vector3D.y = this.d;
				vector3D.z = 0;

			} else {

				vector3D.x = this.tx;
				vector3D.y = this.ty;
				vector3D.z = 1;

			}

		}

		/**
		 *
		 * @param other
		 */
		public copyFrom(other:away.geom.Matrix):void
		{

			this.a = other.a;
			this.b = other.b;
			this.c = other.c;
			this.d = other.d;
			this.tx = other.tx;
			this.ty = other.ty;

		}

		/**
		 *
		 * @param row
		 * @param vector3D
		 */
		public copyRowFrom(row:number, vector3D:away.geom.Vector3D):void
		{

			if (row > 2) {

				throw new away.errors.ArgumentError("ArgumentError, Row " + row + " out of bounds [0, ..., 2]");

			} else if (row == 0) {

				this.a = vector3D.x;
				this.c = vector3D.y;

			} else if (row == 1) {

				this.b = vector3D.x;
				this.d = vector3D.y;

			} else {

				this.tx = vector3D.x;
				this.ty = vector3D.y;

			}

		}

		/**
		 *
		 * @param row
		 * @param vector3D
		 */
		public copyRowTo(row:number, vector3D:away.geom.Vector3D):void
		{

			if (row > 2) {

				throw new away.errors.ArgumentError("ArgumentError, Row " + row + " out of bounds [0, ..., 2]");

			} else if (row == 0) {

				vector3D.x = this.a;
				vector3D.y = this.b;
				vector3D.z = this.tx;

			} else if (row == 1) {

				vector3D.x = this.c;
				vector3D.y = this.d;
				vector3D.z = this.ty;

			} else {

				vector3D.setTo(0, 0, 1);

			}

		}

		/**
		 *
		 * @param scaleX
		 * @param scaleY
		 * @param rotation
		 * @param tx
		 * @param ty
		 */
		public createBox(scaleX:number, scaleY:number, rotation:number = 0, tx:number = 0, ty:number = 0):void
		{

			this.a = scaleX;
			this.d = scaleY;
			this.b = rotation;
			this.tx = tx;
			this.ty = ty;

		}

		/**
		 *
		 * @param width
		 * @param height
		 * @param rotation
		 * @param tx
		 * @param ty
		 */
		public createGradientBox(width:number, height:number, rotation:number = 0, tx:number = 0, ty:number = 0):void
		{

			this.a = width/1638.4;
			this.d = height/1638.4;

			if (rotation != 0.0) {

				var cos = Math.cos(rotation);
				var sin = Math.sin(rotation);

				this.b = sin*this.d;
				this.c = -sin*this.a;
				this.a *= cos;
				this.d *= cos;

			} else {

				this.b = this.c = 0;

			}

			this.tx = tx + width/2;
			this.ty = ty + height/2;

		}

		/**
		 *
		 * @param point
		 * @returns {away.geom.Point}
		 */
		public deltaTransformPoint(point:away.geom.Point):away.geom.Point
		{

			return new away.geom.Point(point.x*this.a + point.y*this.c, point.x*this.b + point.y*this.d);

		}

		/**
		 *
		 */
		public identity():void
		{

			this.a = 1;
			this.b = 0;
			this.c = 0;
			this.d = 1;
			this.tx = 0;
			this.ty = 0;

		}

		/**
		 *
		 * @returns {away.geom.Matrix}
		 */
		public invert():Matrix
		{

			var norm = this.a*this.d - this.b*this.c;

			if (norm == 0) {

				this.a = this.b = this.c = this.d = 0;
				this.tx = -this.tx;
				this.ty = -this.ty;

			} else {

				norm = 1.0/norm;
				var a1 = this.d*norm;
				this.d = this.a*norm;
				this.a = a1;
				this.b *= -norm;
				this.c *= -norm;

				var tx1 = -this.a*this.tx - this.c*this.ty;
				this.ty = -this.b*this.tx - this.d*this.ty;
				this.tx = tx1;

			}

			return this;

		}

		/**
		 *
		 * @param m
		 * @returns {away.geom.Matrix}
		 */
		public mult(m:Matrix):Matrix
		{

			var result = new Matrix();

			result.a = this.a*m.a + this.b*m.c;
			result.b = this.a*m.b + this.b*m.d;
			result.c = this.c*m.a + this.d*m.c;
			result.d = this.c*m.b + this.d*m.d;

			result.tx = this.tx*m.a + this.ty*m.c + m.tx;
			result.ty = this.tx*m.b + this.ty*m.d + m.ty;

			return result;

		}

		/**
		 *
		 * @param angle
		 */
		public rotate(angle:number):void
		{

			var cos = Math.cos(angle);
			var sin = Math.sin(angle);

			var a1 = this.a*cos - this.b*sin;
			this.b = this.a*sin + this.b*cos;
			this.a = a1;

			var c1 = this.c*cos - this.d*sin;
			this.d = this.c*sin + this.d*cos;
			this.c = c1;

			var tx1 = this.tx*cos - this.ty*sin;
			this.ty = this.tx*sin + this.ty*cos;
			this.tx = tx1;

		}

		/**
		 *
		 * @param x
		 * @param y
		 */
		public scale(x:number, y:number):void
		{

			this.a *= x;
			this.b *= y;

			this.c *= x;
			this.d *= y;

			this.tx *= x;
			this.ty *= y;

		}

		/**
		 *
		 * @param angle
		 * @param scale
		 */
		public setRotation(angle:number, scale:number = 1):void
		{

			this.a = Math.cos(angle)*scale;
			this.c = Math.sin(angle)*scale;
			this.b = -this.c;
			this.d = this.a;

		}

		/**
		 *
		 * @param a
		 * @param b
		 * @param c
		 * @param d
		 * @param tx
		 * @param ty
		 */
		public setTo(a:number, b:number, c:number, d:number, tx:number, ty:number):void
		{

			this.a = a;
			this.b = b;
			this.c = c;
			this.d = d;
			this.tx = tx;
			this.ty = ty;

		}

		/**
		 *
		 * @returns {string}
		 */
		public toString():string
		{

			return "[Matrix] (a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";

		}

		/**
		 *
		 * @param point
		 * @returns {away.geom.Point}
		 */
		public transformPoint(point:Point):away.geom.Point
		{

			return new away.geom.Point(point.x*this.a + point.y*this.c + this.tx, point.x*this.b + point.y*this.d + this.ty);

		}

		/**
		 *
		 * @param x
		 * @param y
		 */
		public translate(x:number, y:number):void
		{

			this.tx += x;
			this.ty += y;

		}


	}
}
