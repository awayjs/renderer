/// <reference path="Vector3D.ts" />
/// <reference path="PlaneClassification.ts" />

module away3d.core.math {
	//import away3d.arcane;

	//import flash.geom.Vector3D;

	export class Plane3D
	{
		/**
		 * The A coefficient of this plane. (Also the x dimension of the plane normal)
		 */
		public a : number;

		/**
		 * The B coefficient of this plane. (Also the y dimension of the plane normal)
		 */
		public b : number;

		/**
		 * The C coefficient of this plane. (Also the z dimension of the plane normal)
		 */
		public c : number;

		/**
		 * The D coefficient of this plane. (Also the inverse dot product between normal and point)
		 */
		public d : number;

		public _alignment : number; // ARCANE

		// indicates the alignment of the plane
		public static ALIGN_ANY : number = 0;
		public static ALIGN_XY_AXIS : number = 1;
		public static ALIGN_YZ_AXIS : number = 2;
		public static ALIGN_XZ_AXIS : number = 3;

		/**
		 * Create a Plane3D with ABCD coefficients
		 */
		constructor(a : number = 0, b : number = 0, c : number = 0, d : number = 0)
		{
			this.a = a;
			this.b = b;
			this.c = c;
			this.d = d;
			if (a == 0 && b == 0) this._alignment = Plane3D.ALIGN_XY_AXIS;
			else if (b == 0 && c == 0) this._alignment = Plane3D.ALIGN_YZ_AXIS;
			else if (a == 0 && c == 0) this._alignment = Plane3D.ALIGN_XZ_AXIS;
			else this._alignment = Plane3D.ALIGN_ANY;
		}

		/**
		 * Fills this Plane3D with the coefficients from 3 points in 3d space.
		 * @param p0 Vector3D
		 * @param p1 Vector3D
		 * @param p2 Vector3D
		 */
		public fromPoints(p0 : away3d.core.math.Vector3D, p1 : away3d.core.math.Vector3D, p2 : away3d.core.math.Vector3D) : void
		{
			var d1x : number = p1.x - p0.x;
			var d1y : number = p1.y - p0.y;
			var d1z : number = p1.z - p0.z;

			var d2x : number = p2.x - p0.x;
			var d2y : number = p2.y - p0.y;
			var d2z : number = p2.z - p0.z;

			this.a = d1y * d2z - d1z * d2y;
            this.b = d1z * d2x - d1x * d2z;
            this.c = d1x * d2y - d1y * d2x;
            this.d = this.a * p0.x + this.b * p0.y + this.c * p0.z;

			// not using epsilon, since a plane is infinite and a small incorrection can grow very large
			if (this.a == 0 && this.b == 0) this._alignment = Plane3D.ALIGN_XY_AXIS;
			else if (this.b == 0 && this.c == 0) this._alignment = Plane3D.ALIGN_YZ_AXIS;
			else if (this.a == 0 && this.c == 0) this._alignment = Plane3D.ALIGN_XZ_AXIS;
			else this._alignment = Plane3D.ALIGN_ANY;
		}

		/**
		 * Fills this Plane3D with the coefficients from the plane's normal and a point in 3d space.
		 * @param normal Vector3D
		 * @param point  Vector3D
		 */
		public fromNormalAndPoint(normal : away3d.core.math.Vector3D, point : away3d.core.math.Vector3D) : void
		{
			this.a = normal.x;
            this.b = normal.y;
            this.c = normal.z;
            this.d = this.a * point.x + this.b * point.y + this.c * point.z;
			if (this.a == 0 && this.b == 0) this._alignment = Plane3D.ALIGN_XY_AXIS;
			else if (this.b == 0 && this.c == 0) this._alignment = Plane3D.ALIGN_YZ_AXIS;
			else if (this.a == 0 && this.c == 0) this._alignment = Plane3D.ALIGN_XZ_AXIS;
			else this._alignment = Plane3D.ALIGN_ANY;
		}

		/**
		 * Normalize this Plane3D
		 * @return Plane3D This Plane3D.
		 */
		public normalize() : away3d.core.math.Plane3D
		{
			var len : number = 1 / Math.sqrt(this.a*this.a + this.b*this.b + this.c*this.c);
            this.a *= len;
            this.b *= len;
            this.c *= len;
            this.d *= len;
			return this;
		}

		/**
		 * Returns the signed distance between this Plane3D and the point p.
		 * @param p Vector3D
		 * @returns Number
		 */
		public distance(p : away3d.core.math.Vector3D ) : number
		{
			if (this._alignment == Plane3D.ALIGN_YZ_AXIS)
				return this.a*p.x - this.d;
			else if (this._alignment == Plane3D.ALIGN_XZ_AXIS)
				return this.b*p.y - this.d;
			else if (this._alignment == Plane3D.ALIGN_XY_AXIS)
				return this.c*p.z - this.d;
            else
				return this.a*p.x + this.b*p.y + this.c*p.z - this.d;
		}

		/**
		 * Classify a point against this Plane3D. (in front, back or intersecting)
		 * @param p Vector3D
		 * @return int Plane3.FRONT or Plane3D.BACK or Plane3D.INTERSECT
		 */
		public classifyPoint(p : away3d.core.math.Vector3D, epsilon : number = 0.01) : number
		{
			// check NaN
			if (this.d != this.d) return away3d.core.math.PlaneClassification.FRONT;

			var len : number;
			if (this._alignment == Plane3D.ALIGN_YZ_AXIS)
				len = this.a*p.x - this.d;
			else if (this._alignment == Plane3D.ALIGN_XZ_AXIS)
				len = this.b*p.y - this.d;
			else if (this._alignment == Plane3D.ALIGN_XY_AXIS)
				len = this.c*p.z - this.d;
			else
				len = this.a*p.x + this.b*p.y + this.c*p.z - this.d;

			if (len < -epsilon)
				return away3d.core.math.PlaneClassification.BACK;
			else if (len > epsilon)
				return away3d.core.math.PlaneClassification.FRONT;
			else
				return away3d.core.math.PlaneClassification.INTERSECT;
		}

		public toString() : string
		{
			return "Plane3D [a:" + this.a + ", b:" + this.b + ", c:" + this.c + ", d:" + this.d + "].";
		}
	}
}
