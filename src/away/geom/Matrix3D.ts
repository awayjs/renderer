/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="Vector3D.ts" />
///<reference path="../errors/ArgumentError.ts" />

module away.geom
{
	
	export class Matrix3D
	{
		
		/**
		 * A Vector of 16 Numbers, where every four elements is a column of a 4x4 matrix.
		 *
		 * <p>An exception is thrown if the rawData property is set to a matrix that is not invertible. The Matrix3D 
		 * object must be invertible. If a non-invertible matrix is needed, create a subclass of the Matrix3D object.</p>
		 */
		public rawData:number[];
		
		/**
		 * Creates a Matrix3D object.
		 */
		constructor( v:number[] = null )
		{
			if( v != null && v.length == 16 )
			{
				this.rawData = v;
			}
			else
			{
				this.rawData = [ 1, 0, 0, 0,
								 0, 1, 0, 0,
								 0, 0, 1, 0,
								 0, 0, 0, 1 ];
			}
		}
		
		/**
		 * Appends the matrix by multiplying another Matrix3D object by the current Matrix3D object.
		 */
		public append( lhs:Matrix3D )
		{
			var m111:number = this.rawData[0], m121:number = this.rawData[4], m131:number = this.rawData[8], m141:number = this.rawData[12],
			m112:number = this.rawData[1], m122:number = this.rawData[5], m132:number = this.rawData[9], m142:number = this.rawData[13],
			m113:number = this.rawData[2], m123:number = this.rawData[6], m133:number = this.rawData[10], m143:number = this.rawData[14],
			m114:number = this.rawData[3], m124:number = this.rawData[7], m134:number = this.rawData[11], m144:number = this.rawData[15],
			m211:number = lhs.rawData[0], m221:number = lhs.rawData[4], m231:number = lhs.rawData[8], m241:number = lhs.rawData[12],
			m212:number = lhs.rawData[1], m222:number = lhs.rawData[5], m232:number = lhs.rawData[9], m242:number = lhs.rawData[13],
			m213:number = lhs.rawData[2], m223:number = lhs.rawData[6], m233:number = lhs.rawData[10], m243:number = lhs.rawData[14],
			m214:number = lhs.rawData[3], m224:number = lhs.rawData[7], m234:number = lhs.rawData[11], m244:number = lhs.rawData[15];
			
			this.rawData[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
			this.rawData[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
			this.rawData[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
			this.rawData[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;
			
			this.rawData[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
			this.rawData[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
			this.rawData[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
			this.rawData[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;
			
			this.rawData[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
			this.rawData[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
			this.rawData[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
			this.rawData[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;
			
			this.rawData[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
			this.rawData[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
			this.rawData[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
			this.rawData[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
		}
		
		/**
		 * Appends an incremental rotation to a Matrix3D object.
		 */
		public appendRotation( degrees:number, axis:Vector3D, pivotPoint:Vector3D = null ) 
		{
			var m:Matrix3D = Matrix3D.getAxisRotation( axis.x, axis.y, axis.z, degrees );
			
			if (pivotPoint != null) 
			{
				var p:Vector3D = pivotPoint;
				m.appendTranslation( p.x, p.y, p.z );
			}
			
			this.append(m);
		}
		
		/**
		 * Appends an incremental scale change along the x, y, and z axes to a Matrix3D object.
		 */
		public appendScale( xScale:number, yScale:number, zScale:number )
		{
			this.append(new Matrix3D( [ xScale, 0.0, 0.0, 0.0, 0.0, yScale, 0.0, 0.0, 0.0, 0.0, zScale, 0.0, 0.0, 0.0, 0.0, 1.0 ] ));
		}
		
		/**
		 * Appends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
		 */
		public appendTranslation( x:number, y:number, z:number ) 
		{
			this.rawData[12] += x;
			this.rawData[13] += y;
			this.rawData[14] += z;
		}
		
		/**
		 * Returns a new Matrix3D object that is an exact copy of the current Matrix3D object.
		 */
		public clone():Matrix3D
		{
			return new Matrix3D( this.rawData.slice( 0 ) );
		}
		
		/**
		 * Copies a Vector3D object into specific column of the calling Matrix3D object.
		 */
		public copyColumnFrom( column:number, vector3D:Vector3D )
		{
			switch( column )
			{
				case 0:
						vector3D.x = this.rawData[ 0 ];
						vector3D.y = this.rawData[ 4 ];
						vector3D.z = this.rawData[ 8 ];
						vector3D.w = this.rawData[ 12 ];
					break;
				case 1:
						vector3D.x = this.rawData[ 1 ];
						vector3D.y = this.rawData[ 5 ];
						vector3D.z = this.rawData[ 9 ];
						vector3D.w = this.rawData[ 13 ];
					break;
				case 2:
						vector3D.x = this.rawData[ 2 ];
						vector3D.y = this.rawData[ 6 ];
						vector3D.z = this.rawData[ 10 ];
						vector3D.w = this.rawData[ 14 ];
					break;
				case 3:
						vector3D.x = this.rawData[ 3 ];
						vector3D.y = this.rawData[ 7 ];
						vector3D.z = this.rawData[ 11 ];
						vector3D.w = this.rawData[ 15 ];
					break;
				default:
					throw new away.errors.ArgumentError( "ArgumentError, Column " + column + " out of bounds [0, ..., 3]");
			}
		}
		
		/**
		 * Copies specific column of the calling Matrix3D object into the Vector3D object.
		 */
		public copyColumnTo( column:number, vector3D:Vector3D )
		{
			switch( column )
			{
				case 0:
						this.rawData[ 0 ] = vector3D.x;
						this.rawData[ 4 ] = vector3D.y;
						this.rawData[ 8 ] = vector3D.z;
						this.rawData[ 12 ] = vector3D.w;
					break;
				case 1:
						this.rawData[ 1 ] = vector3D.x;
						this.rawData[ 5 ] = vector3D.y;
						this.rawData[ 9 ] = vector3D.z;
						this.rawData[ 13 ] = vector3D.w;
					break;
				case 2:
						this.rawData[ 2 ] = vector3D.x;
						this.rawData[ 6 ] = vector3D.y;
						this.rawData[ 10 ] = vector3D.z;
						this.rawData[ 14 ] = vector3D.w;
					break;
				case 3:
						this.rawData[ 3 ] = vector3D.x;
						this.rawData[ 7 ] = vector3D.y;
						this.rawData[ 11 ] = vector3D.z;
						this.rawData[ 15 ] = vector3D.w;
					break;
				default:
                    throw new away.errors.ArgumentError( "ArgumentError, Column " + column + " out of bounds [0, ..., 3]");
			}
		}
		
		/**
		 * Copies all of the matrix data from the source Matrix3D object into the calling Matrix3D object.
		 */
		public copyFrom( sourceMatrix3D: Matrix3D )
		{
			this.rawData = sourceMatrix3D.rawData.slice( 0 );
		}
		
		public copyRawDataFrom( vector:number[], index:number = 0, transpose:boolean = false )
		{
			//TODO fully implement
			this.rawData = vector.splice(0);
		}
		
		/* TODO implement copyRawDataTo
		public copyRawDataTo( vector:number[], index:number = 0, transpose:boolean = false )
		{
		}
		*/
		
		/**
		 * Copies a Vector3D object into specific row of the calling Matrix3D object.
		 */
		public copyRowFrom( row:number, vector3D:Vector3D )
		{
			switch( row )
			{
				case 0:
						vector3D.x = this.rawData[ 0 ];
						vector3D.y = this.rawData[ 1 ];
						vector3D.z = this.rawData[ 2 ];
						vector3D.w = this.rawData[ 3 ];
					break;
				case 1:
						vector3D.x = this.rawData[ 4 ];
						vector3D.y = this.rawData[ 5 ];
						vector3D.z = this.rawData[ 6 ];
						vector3D.w = this.rawData[ 7 ];
					break;
				case 2:
						vector3D.x = this.rawData[ 8 ];
						vector3D.y = this.rawData[ 9 ];
						vector3D.z = this.rawData[ 10 ];
						vector3D.w = this.rawData[ 11 ];
					break;
				case 3:
						vector3D.x = this.rawData[ 12 ];
						vector3D.y = this.rawData[ 13 ];
						vector3D.z = this.rawData[ 14 ];
						vector3D.w = this.rawData[ 15 ]
					break;
				default:
                    throw new away.errors.ArgumentError( "ArgumentError, Row " + row + " out of bounds [0, ..., 3]");
			}
		}
		
		/**
		 * Copies specific row of the calling Matrix3D object into the Vector3D object.
		 */
		public copyRowTo( row:number, vector3D:Vector3D )
		{
			switch( row )
			{
				case 0:
						this.rawData[ 0 ] = vector3D.x;
						this.rawData[ 1 ] = vector3D.y;
						this.rawData[ 2 ] = vector3D.z;
						this.rawData[ 3 ] = vector3D.w;
					break;
				case 1:
						this.rawData[ 4 ] = vector3D.x;
						this.rawData[ 5 ] = vector3D.y;
						this.rawData[ 6 ] = vector3D.z;
						this.rawData[ 7 ] = vector3D.w;
					break;
				case 2:
						this.rawData[ 8 ] = vector3D.x;
						this.rawData[ 9 ] = vector3D.y;
						this.rawData[ 10 ] = vector3D.z;
						this.rawData[ 11 ] = vector3D.w;
					break;
				case 3:
						this.rawData[ 12 ] = vector3D.x;
						this.rawData[ 13 ] = vector3D.y;
						this.rawData[ 14 ] = vector3D.z;
						this.rawData[ 15 ] = vector3D.w;
					break;
				default:
                    throw new away.errors.ArgumentError( "ArgumentError, Row " + row + " out of bounds [0, ..., 3]");
			}
		}
		
		/**
		 * Copies this Matrix3D object into a destination Matrix3D object.
		 */
		public copyToMatrix3D( dest:Matrix3D )
		{
			dest.rawData = this.rawData.slice(0);
		}
		
		// TODO orientationStyle:string = "eulerAngles"
		/**
		 * Returns the transformation matrix's translation, rotation, and scale settings as a Vector of three Vector3D objects.
		 */
		public decompose():Vector3D[]
		{
			var vec:Vector3D[] = [];
			var m = this.clone();
			var mr = m.rawData;
			
			var pos: Vector3D = new Vector3D( mr[12], mr[13], mr[14] );
			mr[12] = 0;
			mr[13] = 0;
			mr[14] = 0;
			
			var scale: Vector3D = new Vector3D();
			
			scale.x = Math.sqrt (mr[0] * mr[0] + mr[1] * mr[1] + mr[2] * mr[2]);
			scale.y = Math.sqrt (mr[4] * mr[4] + mr[5] * mr[5] + mr[6] * mr[6]);
			scale.z = Math.sqrt (mr[8] * mr[8] + mr[9] * mr[9] + mr[10] * mr[10]);
			
			if (mr[0] * (mr[5] * mr[10] - mr[6] * mr[9]) - mr[1] * (mr[4] * mr[10] - mr[6] * mr[8]) + mr[2] * (mr[4] * mr[9] - mr[5] * mr[8]) < 0)
			{
				scale.z = -scale.z;
			}
			
			mr[0] /= scale.x; 
			mr[1] /= scale.x; 
			mr[2] /= scale.x; 
			mr[4] /= scale.y; 
			mr[5] /= scale.y; 
			mr[6] /= scale.y; 
			mr[8] /= scale.z; 
			mr[9] /= scale.z; 
			mr[10] /= scale.z;
			
			var rot = new Vector3D ();
			rot.y = Math.asin( -mr[2]);
			var cos:number = Math.cos(rot.y);
			
			if (cos > 0)
			{
				rot.x = Math.atan2 (mr[6], mr[10]);
				rot.z = Math.atan2 (mr[1], mr[0]);
			}
			else
			{
				rot.z = 0;
				rot.x = Math.atan2 (mr[4], mr[5]);
			} 
			
			vec.push(pos);
			vec.push(rot);
			vec.push(scale);
			
			return vec;
		}
		
		/**
		 * Uses the transformation matrix without its translation elements to transform a Vector3D object from one space
		 * coordinate to another.
		 */
		public deltaTransformVector( v:Vector3D ):Vector3D
		{
			var x:number = v.x, y:number = v.y, z:number = v.z;
			return new Vector3D (
						(x * this.rawData[0] + y * this.rawData[1] + z * this.rawData[2] + this.rawData[3]),
						(x * this.rawData[4] + y * this.rawData[5] + z * this.rawData[6] + this.rawData[7]),
						(x * this.rawData[8] + y * this.rawData[9] + z * this.rawData[10] + this.rawData[11]),
					0);
		}
		
		/**
		 * Converts the current matrix to an identity or unit matrix.
		 */
		public identity()
		{
			this.rawData = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1 ];
		}
		
		/**
		 * [static] Interpolates the translation, rotation, and scale transformation of one matrix toward those of the target matrix.
		 */
		static interpolate( thisMat:Matrix3D, toMat:Matrix3D, percent:number ):Matrix3D
		{
			var m:Matrix3D = new Matrix3D();
			for( var i: number = 0; i < 16; ++i )
			{
				m.rawData[i] = thisMat.rawData[i] + (toMat.rawData[i] - thisMat.rawData[i]) * percent;
			}
			return m;
		}
		
		/**
		 * Interpolates this matrix towards the translation, rotation, and scale transformations of the target matrix.
		 */
		public interpolateTo( toMat:Matrix3D, percent:number )
		{
			for( var i: number = 0; i < 16; ++i )
			{
				this.rawData[i] = this.rawData[i] + (toMat.rawData[i] - this.rawData[i]) * percent;
			}
		}
		
		/**
		 * Inverts the current matrix.
		 */
		public invert():boolean
		{
			var d = this.determinant;
			var invertable = Math.abs (d) > 0.00000000001;
			
			if (invertable)
			{
				d = -1 / d;
				var m11:number = this.rawData[0]; var m21:number = this.rawData[4]; var m31:number = this.rawData[8]; var m41:number = this.rawData[12];
				var m12:number = this.rawData[1]; var m22:number = this.rawData[5]; var m32:number = this.rawData[9]; var m42:number = this.rawData[13];
				var m13:number = this.rawData[2]; var m23:number = this.rawData[6]; var m33:number = this.rawData[10]; var m43:number = this.rawData[14];
				var m14:number = this.rawData[3]; var m24:number = this.rawData[7]; var m34:number = this.rawData[11]; var m44:number = this.rawData[15];
				
				this.rawData[0] = d * (m22 * (m33 * m44 - m43 * m34) - m32 * (m23 * m44 - m43 * m24) + m42 * (m23 * m34 - m33 * m24));
				this.rawData[1] = -d * (m12 * (m33 * m44 - m43 * m34) - m32 * (m13 * m44 - m43 * m14) + m42 * (m13 * m34 - m33 * m14));
				this.rawData[2] = d * (m12 * (m23 * m44 - m43 * m24) - m22 * (m13 * m44 - m43 * m14) + m42 * (m13 * m24 - m23 * m14));
				this.rawData[3] = -d * (m12 * (m23 * m34 - m33 * m24) - m22 * (m13 * m34 - m33 * m14) + m32 * (m13 * m24 - m23 * m14));
				this.rawData[4] = -d * (m21 * (m33 * m44 - m43 * m34) - m31 * (m23 * m44 - m43 * m24) + m41 * (m23 * m34 - m33 * m24));
				this.rawData[5] = d * (m11 * (m33 * m44 - m43 * m34) - m31 * (m13 * m44 - m43 * m14) + m41 * (m13 * m34 - m33 * m14));
				this.rawData[6] = -d * (m11 * (m23 * m44 - m43 * m24) - m21 * (m13 * m44 - m43 * m14) + m41 * (m13 * m24 - m23 * m14));
				this.rawData[7] = d * (m11 * (m23 * m34 - m33 * m24) - m21 * (m13 * m34 - m33 * m14) + m31 * (m13 * m24 - m23 * m14));
				this.rawData[8] = d * (m21 * (m32 * m44 - m42 * m34) - m31 * (m22 * m44 - m42 * m24) + m41 * (m22 * m34 - m32 * m24));
				this.rawData[9] = -d * (m11 * (m32 * m44 - m42 * m34) - m31 * (m12 * m44 - m42 * m14) + m41 * (m12 * m34 - m32 * m14));
				this.rawData[10] = d * (m11 * (m22 * m44 - m42 * m24) - m21 * (m12 * m44 - m42 * m14) + m41 * (m12 * m24 - m22 * m14));
				this.rawData[11] = -d * (m11 * (m22 * m34 - m32 * m24) - m21 * (m12 * m34 - m32 * m14) + m31 * (m12 * m24 - m22 * m14));
				this.rawData[12] = -d * (m21 * (m32 * m43 - m42 * m33) - m31 * (m22 * m43 - m42 * m23) + m41 * (m22 * m33 - m32 * m23));
				this.rawData[13] = d * (m11 * (m32 * m43 - m42 * m33) - m31 * (m12 * m43 - m42 * m13) + m41 * (m12 * m33 - m32 * m13));
				this.rawData[14] = -d * (m11 * (m22 * m43 - m42 * m23) - m21 * (m12 * m43 - m42 * m13) + m41 * (m12 * m23 - m22 * m13));
				this.rawData[15] = d * (m11 * (m22 * m33 - m32 * m23) - m21 * (m12 * m33 - m32 * m13) + m31 * (m12 * m23 - m22 * m13));
			}
			return invertable;
		}
		
		/* TODO implement pointAt
		public pointAt( pos:Vector3D, at:Vector3D = null, up:Vector3D = null )
		{
		}
		*/
		
		/**
		 * Prepends a matrix by multiplying the current Matrix3D object by another Matrix3D object.
		 */
		public prepend( rhs:Matrix3D )
		{
			var m111:number = rhs.rawData[0], m121:number = rhs.rawData[4], m131:number = rhs.rawData[8], m141:number = rhs.rawData[12],
			m112:number = rhs.rawData[1], m122:number = rhs.rawData[5], m132:number = rhs.rawData[9], m142:number = rhs.rawData[13],
			m113:number = rhs.rawData[2], m123:number = rhs.rawData[6], m133:number = rhs.rawData[10], m143:number = rhs.rawData[14],
			m114:number = rhs.rawData[3], m124:number = rhs.rawData[7], m134:number = rhs.rawData[11], m144:number = rhs.rawData[15],
			m211:number = this.rawData[0], m221:number = this.rawData[4], m231:number = this.rawData[8], m241:number = this.rawData[12],
			m212:number = this.rawData[1], m222:number = this.rawData[5], m232:number = this.rawData[9], m242:number = this.rawData[13],
			m213:number = this.rawData[2], m223:number = this.rawData[6], m233:number = this.rawData[10], m243:number = this.rawData[14],
			m214:number = this.rawData[3], m224:number = this.rawData[7], m234:number = this.rawData[11], m244:number = this.rawData[15];
			
			this.rawData[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
			this.rawData[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
			this.rawData[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
			this.rawData[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;
			
			this.rawData[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
			this.rawData[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
			this.rawData[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
			this.rawData[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;
			
			this.rawData[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
			this.rawData[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
			this.rawData[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
			this.rawData[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;
			
			this.rawData[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
			this.rawData[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
			this.rawData[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
			this.rawData[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
		}
		
		/**
		 * Prepends an incremental rotation to a Matrix3D object.
		 */
		public prependRotation( degrees:number, axis:Vector3D, pivotPoint:Vector3D = null )
		{
			var m: Matrix3D = Matrix3D.getAxisRotation( axis.x, axis.y, axis.z, degrees );
			if ( pivotPoint != null )
			{
				var p:Vector3D = pivotPoint;
				m.appendTranslation( p.x, p.y, p.z );
			}
			this.prepend( m );
		}
		
		/**
		 * Prepends an incremental scale change along the x, y, and z axes to a Matrix3D object.
		 */
		public prependScale( xScale:number, yScale:number, zScale:number )
		{
			this.prepend(new Matrix3D( [ xScale, 0, 0, 0, 0, yScale, 0, 0, 0, 0, zScale, 0, 0, 0, 0, 1 ] ));
		}
		
		/**
		 * Prepends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
		 */
		public prependTranslation( x:number, y:number, z:number )
		{
			var m = new Matrix3D();
			m.position = new Vector3D( x, y, z );
			this.prepend( m );
		}
		
		// TODO orientationStyle
		/**
		 * Sets the transformation matrix's translation, rotation, and scale settings.
		 */
		public recompose( components:Vector3D[] ): boolean
		{
			if (components.length < 3 || components[2].x == 0 || components[2].y == 0 || components[2].z == 0) return false;
			
			this.identity();
			this.appendScale (components[2].x, components[2].y, components[2].z);
			
			var angle:number;
			angle = -components[1].x;
			this.append (new Matrix3D ([1, 0, 0, 0, 0, Math.cos(angle), -Math.sin(angle), 0, 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 0 , 0]));
			angle = -components[1].y;
			this.append (new Matrix3D ([Math.cos(angle), 0, Math.sin(angle), 0, 0, 1, 0, 0, -Math.sin(angle), 0, Math.cos(angle), 0, 0, 0, 0, 0]));
			angle = -components[1].z;
			this.append (new Matrix3D ([Math.cos(angle), -Math.sin(angle), 0, 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]));
			
			this.position = components[0];
			this.rawData[15] = 1;
			
			return true;
		}
		
		public transformVector( v:away.geom.Vector3D ):away.geom.Vector3D
		{
			var x:number = v.x;
			var y:number = v.y;
			var z:number = v.z;
			return new away.geom.Vector3D(
				(x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8] + this.rawData[12]),
				(x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9] + this.rawData[13]),
				(x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10] + this.rawData[14]),
			1);
			
		}
		
		/**
		 * Uses the transformation matrix to transform a Vector of Numbers from one coordinate space to another.
		 */
		public transformVectors( vin:number[], vout:number[] )
		{
			var i:number = 0;
			var x:number = 0, y:number = 0, z:number = 0;
			
			while( i + 3 <= vin.length )
			{
				x = vin[i];
				y = vin[i + 1];
				z = vin[i + 2];
				vout[i] = x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8] + this.rawData[12];
				vout[i + 1] = x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9] + this.rawData[13];
				vout[i + 2] = x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10] + this.rawData[14];
				i += 3;
			}
		}
		
		/**
		 * Converts the current Matrix3D object to a matrix where the rows and columns are swapped.
		 */
		public transpose()
		{
			var oRawData:number[] = this.rawData.slice( 0 );
			
			this.rawData[1] = oRawData[4];
			this.rawData[2] = oRawData[8];
			this.rawData[3] = oRawData[12];
			this.rawData[4] = oRawData[1];
			this.rawData[6] = oRawData[9];
			this.rawData[7] = oRawData[13];
			this.rawData[8] = oRawData[2];
			this.rawData[9] = oRawData[6];
			this.rawData[11] = oRawData[14];
			this.rawData[12] = oRawData[3];
			this.rawData[13] = oRawData[7];
			this.rawData[14] = oRawData[11];
		}
		
		static getAxisRotation( x:number, y:number, z:number, degrees:number ):Matrix3D 
		{
			var m:Matrix3D = new Matrix3D();
			
			var a1:Vector3D = new Vector3D( x, y, z );
			var rad = -degrees * ( Math.PI / 180 );
			var c:number = Math.cos( rad );
			var s:number = Math.sin( rad );
			var t:number = 1.0 - c;
			
			m.rawData[0] = c + a1.x * a1.x * t;
			m.rawData[5] = c + a1.y * a1.y * t;
			m.rawData[10] = c + a1.z * a1.z * t;
			
			var tmp1 = a1.x * a1.y * t;
			var tmp2 = a1.z * s;
			m.rawData[4] = tmp1 + tmp2;
			m.rawData[1] = tmp1 - tmp2;
			tmp1 = a1.x * a1.z * t;
			tmp2 = a1.y * s;
			m.rawData[8] = tmp1 - tmp2;
			m.rawData[2] = tmp1 + tmp2;
			tmp1 = a1.y * a1.z * t;
			tmp2 = a1.x*s;
			m.rawData[9] = tmp1 + tmp2;
			m.rawData[6] = tmp1 - tmp2;
			
			return m;
		}
		
		/**
		 * [read-only] A Number that determines whether a matrix is invertible.
		 */
		public get determinant(): number
		{
			return	-1 * ((this.rawData[0] * this.rawData[5] - this.rawData[4] * this.rawData[1]) * (this.rawData[10] * this.rawData[15] - this.rawData[14] * this.rawData[11])
				- (this.rawData[0] * this.rawData[9] - this.rawData[8] * this.rawData[1]) * (this.rawData[6] * this.rawData[15] - this.rawData[14] * this.rawData[7])
				+ (this.rawData[0] * this.rawData[13] - this.rawData[12] * this.rawData[1]) * (this.rawData[6] * this.rawData[11] - this.rawData[10] * this.rawData[7])
				+ (this.rawData[4] * this.rawData[9] - this.rawData[8] * this.rawData[5]) * (this.rawData[2] * this.rawData[15] - this.rawData[14] * this.rawData[3])
				- (this.rawData[4] * this.rawData[13] - this.rawData[12] * this.rawData[5]) * (this.rawData[2] * this.rawData[11] - this.rawData[10] * this.rawData[3])
				+ (this.rawData[8] * this.rawData[13] - this.rawData[12] * this.rawData[9]) * (this.rawData[2] * this.rawData[7] - this.rawData[6] * this.rawData[3]));
		}
		
		/**
		 * A Vector3D object that holds the position, the 3D coordinate (x,y,z) of a display object within the
		 * transformation's frame of reference.
		 */
		public get position():Vector3D
		{
			return new Vector3D( this.rawData[12], this.rawData[13], this.rawData[14] );
		}
		
		public set position( value:Vector3D )
		{
			this.rawData[12] = value.x;
			this.rawData[13] = value.y;
			this.rawData[14] = value.z;
		}
	}
}