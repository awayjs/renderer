///<reference path="../_definitions.ts" />
/**
 * @module away.base
 */
module away.base
{
	//import away3d.arcane;
	//import away3d.controllers.*;
	//import away3d.core.math.*;
	//import away3d.events.*;
	//import away3d.library.assets.*;
	
	//import flash.geom.Matrix3D;
	//import flash.geom.Vector3D;
	
	//use namespace arcane;
	
	/**
	 * Dispatched when the position of the 3d object changes.
	 *
	 * @eventType away3d.events.Object3DEvent
	 */
	//[Event(name="positionChanged", type="away3d.events.Object3DEvent")]
	
	/**
	 * Dispatched when the scale of the 3d object changes.
	 *
	 * @eventType away3d.events.Object3DEvent
	 */
	//[Event(name="scaleChanged", type="away3d.events.Object3DEvent")]
	
	/**
	 * Dispatched when the rotation of the 3d object changes.
	 *
	 * @eventType away3d.events.Object3DEvent
	 */
	//[Event(name="rotationChanged", type="away3d.events.Object3DEvent")]

    /**
     *
	 * Object3D provides a base class for any 3D object that has a (local) transformation.<br/><br/>
	 *
	 * Standard Transform:
	 * <ul>
	 *     <li> The standard order for transformation is [parent transform] * (Translate+Pivot) * (Rotate) * (-Pivot) * (Scale) * [child transform] </li>
	 *     <li> This is the order of matrix multiplications, left-to-right. </li>
	 *     <li> The order of transformation is right-to-left, however!
	 *          (Scale) happens before (-Pivot) happens before (Rotate) happens before (Translate+Pivot)
	 *          with no pivot, the above transform works out to [parent transform] * Translate * Rotate * Scale * [child transform]
	 *          (Scale) happens before (Rotate) happens before (Translate) </li>
	 *     <li> This is based on code in updateTransform and ObjectContainer3D.updateSceneTransform(). </li>
	 *     <li> Matrix3D prepend = operator on rhs - e.g. transform' = transform * rhs; </li>
	 *     <li> Matrix3D append =  operator on lhr - e.g. transform' = lhs * transform; </li>
	 * </ul>
	 *
	 * To affect Scale:
	 * <ul>
	 *     <li> set scaleX/Y/Z directly, or call scale(delta) </li>
	 * </ul>
	 *
	 * To affect Pivot:
	 * <ul>
	 *     <li> set pivotPoint directly, or call movePivot() </li>
	 * </ul>
	 *
	 * To affect Rotate:
	 * <ul>
	 *    <li> set rotationX/Y/Z individually (using degrees), set eulers [all 3 angles] (using radians), or call rotateTo()</li>
	 *    <li> call pitch()/yaw()/roll()/rotate() to add an additional rotation *before* the current transform.
	 *         rotationX/Y/Z will be reset based on these operations. </li>
	 * </ul>
	 *
	 * To affect Translate (post-rotate translate):
	 *
	 * <ul>
	 *    <li> set x/y/z/position or call moveTo(). </li>
	 *    <li> call translate(), which modifies x/y/z based on a delta vector. </li>
	 *    <li> call moveForward()/moveBackward()/moveLeft()/moveRight()/moveUp()/moveDown()/translateLocal() to add an
	 *         additional translate *before* the current transform. x/y/z will be reset based on these operations. </li>
	 * </ul>
     *
     * @class away.base.Object3D
	 */
	export class Object3D extends away.library.NamedAssetBase
	{
		/** @private */
		public _iController:away.controllers.ControllerBase; // Arcane
		
		private _smallestNumber : number = 0.0000000000000000000001;
		private _transformDirty : boolean = true;
		
		private _positionDirty  : boolean = true;
		private _rotationDirty  : boolean = true;
		private _scaleDirty     : boolean = true;
		
		// TODO: not used
		// private var _positionValuesDirty:boolean;
		// private var _rotationValuesDirty:boolean;
		// private var _scaleValuesDirty:boolean;

		private _positionChanged:away.events.Object3DEvent;
		private _rotationChanged:away.events.Object3DEvent;
		private _scaleChanged:away.events.Object3DEvent;

		private _rotationX      : number = 0;
		private _rotationY      : number = 0;
		private _rotationZ      : number = 0;
		private _eulers         : away.geom.Vector3D = new away.geom.Vector3D();
		private _flipY          : away.geom.Matrix3D = new away.geom.Matrix3D();

		private _listenToPositionChanged    : boolean;
		private _listenToRotationChanged    : boolean;
		private _listenToScaleChanged       : boolean;
		private _zOffset                    : number = 0;
		
		private invalidatePivot()
		{
			this._pivotZero = (this._pivotPoint.x == 0) && (this._pivotPoint.y == 0) && (this._pivotPoint.z == 0);
			this.iInvalidateTransform();

		}
		
		private invalidatePosition()
		{
			if (this._positionDirty)
				return;
			
			this._positionDirty = true;
			
			this.iInvalidateTransform();

			if (this._listenToPositionChanged)
				this.notifyPositionChanged();

		}

		private notifyPositionChanged()
		{
			if (!this._positionChanged)
            {


				this._positionChanged = new away.events.Object3DEvent(away.events.Object3DEvent.POSITION_CHANGED, this);

            }
			this.dispatchEvent( this._positionChanged );
		}


		public addEventListener(type : string , listener : Function , target : Object )
		{
			super.addEventListener(type, listener, target ) ;//, priority, useWeakReference);

			switch (type) {
				case away.events.Object3DEvent.POSITION_CHANGED:
                    this._listenToPositionChanged = true;
					break;
				case away.events.Object3DEvent.ROTATION_CHANGED:
                    this._listenToRotationChanged = true;
					break;
				case away.events.Object3DEvent.SCALE_CHANGED:
					this._listenToScaleChanged = true;
					break;
			}
		}

		public removeEventListener(type : string , listener : Function , target : Object )
		{
			super.removeEventListener(type, listener, target);
			
			if (this.hasEventListener(type , listener , target ))
				return;
			
			switch (type) {

				case away.events.Object3DEvent.POSITION_CHANGED:
					this._listenToPositionChanged = false;
					break;

				case away.events.Object3DEvent.ROTATION_CHANGED:
                    this._listenToRotationChanged = false;
					break;

				case away.events.Object3DEvent.SCALE_CHANGED:
                    this._listenToScaleChanged = false;
					break;
			}
		}

		private invalidateRotation()
		{
			if (this._rotationDirty)
            {

                return;

            }

			this._rotationDirty = true;
			
			this.iInvalidateTransform();


			if (this._listenToRotationChanged)
				this.notifyRotationChanged();


		}

		private notifyRotationChanged()
		{
			if (!this._rotationChanged)
				this._rotationChanged = new away.events.Object3DEvent(away.events.Object3DEvent.ROTATION_CHANGED, this);
			
			this.dispatchEvent(this._rotationChanged);
		}

		private invalidateScale()
		{
			if (this._scaleDirty)
            {

                return;

            }

			this._scaleDirty = true;
			
			this.iInvalidateTransform();

			if (this._listenToScaleChanged)
                this.notifyScaleChanged();

		}

		private notifyScaleChanged()
		{
			if (!this._scaleChanged)
				this._scaleChanged = new away.events.Object3DEvent(away.events.Object3DEvent.SCALE_CHANGED, this);
			
			this.dispatchEvent(this._scaleChanged);
		}

		public _pTransform  : away.geom.Matrix3D = new away.geom.Matrix3D();
        public _pScaleX     : number = 1;
        public _pScaleY     : number = 1;
        public _pScaleZ     : number = 1;
		private _x          : number = 0;
		private _y          : number = 0;
		private _z          : number = 0;
		private _pivotPoint : away.geom.Vector3D = new away.geom.Vector3D();
		private _pivotZero  : boolean = true;
		public _pPos        : away.geom.Vector3D = new away.geom.Vector3D();
		private _rot        : away.geom.Vector3D = new away.geom.Vector3D();
		private _sca        : away.geom.Vector3D = new away.geom.Vector3D();
        private _transformComponents : away.geom.Vector3D[];
		
		/**
		 * An object that can contain any extra data.
		 */
		public extra:Object;
		
		/**
		 * Defines the x coordinate of the 3d object relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
		 */
		public get x():number
		{
			return this._x;
		}
		
		public set x(val:number)
		{
			if (this._x == val)
            {

                return;

            }


			this._x = val;
			this.invalidatePosition();

		}
		
		/**
		 * Defines the y coordinate of the 3d object relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
		 */
		public get y():number
		{
			return this._y;
		}
		
		public set y(val:number)
		{
			if (this._y == val)
            {

                return;

            }

			this._y = val;
			this.invalidatePosition();

		}
		
		/**
		 * Defines the z coordinate of the 3d object relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
		 */
		public get z():number
		{
			return this._z;
		}
		
		public set z(val:number)
		{
			if (this._z == val)
            {

                return;

            }

			this._z = val;
			this.invalidatePosition();

		}
		
		/**
		 * Defines the euler angle of rotation of the 3d object around the x-axis, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
		 */
		public get rotationX():number
		{
			return this._rotationX*away.math.MathConsts.RADIANS_TO_DEGREES;
		}
		
		public set rotationX(val:number)
		{
			if (this.rotationX == val)
            {

                return;

            }

			
			this._rotationX = val*away.math.MathConsts.DEGREES_TO_RADIANS;
			this.invalidateRotation();
		}
		
		/**
		 * Defines the euler angle of rotation of the 3d object around the y-axis, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
		 */
		public get rotationY():number
		{
			return this._rotationY*away.math.MathConsts.RADIANS_TO_DEGREES;
		}
		
		public set rotationY(val:number)
		{
			if (this.rotationY == val)
            {

                return;

            }

			this._rotationY = val*away.math.MathConsts.DEGREES_TO_RADIANS;
			
			this.invalidateRotation();
		}
		
		/**
		 * Defines the euler angle of rotation of the 3d object around the z-axis, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
		 */
		public get rotationZ():number
		{
			return this._rotationZ*away.math.MathConsts.RADIANS_TO_DEGREES;
		}
		
		public set rotationZ(val:number)
		{
			if (this.rotationZ == val)
            {

                return;

            }

			
			this._rotationZ = val*away.math.MathConsts.DEGREES_TO_RADIANS;
			
			this.invalidateRotation();
		}
		
		/**
		 * Defines the scale of the 3d object along the x-axis, relative to local coordinates.
		 */
		public get scaleX():number
		{
			return this._pScaleX;
		}
		
		public set scaleX(val:number)
		{
			if (this._pScaleX == val)
            {

                return;

            }

			this._pScaleX = val;
			
			this.invalidateScale();
		}
		
		/**
		 * Defines the scale of the 3d object along the y-axis, relative to local coordinates.
		 */
		public get scaleY():number
		{
			return this._pScaleY;
		}
		
		public set scaleY(val:number)
		{
			if (this._pScaleY == val)
            {

                return;

            }

            this._pScaleY = val;

            this.invalidateScale();

		}
		
		/**
		 * Defines the scale of the 3d object along the z-axis, relative to local coordinates.
		 */
		public get scaleZ():number
		{
			return this._pScaleZ;
		}
		
		public set scaleZ(val:number)
		{
			if (this._pScaleZ == val)
            {

                return;

            }

			this._pScaleZ = val;
			this.invalidateScale();

		}
		
		/**
		 * Defines the rotation of the 3d object as a <code>Vector3D</code> object containing euler angles for rotation around x, y and z axis.
		 */
		public get eulers():away.geom.Vector3D
		{
			this._eulers.x = this._rotationX*away.math.MathConsts.RADIANS_TO_DEGREES;
            this._eulers.y = this._rotationY*away.math.MathConsts.RADIANS_TO_DEGREES;
            this._eulers.z = this._rotationZ*away.math.MathConsts.RADIANS_TO_DEGREES;
			
			return this._eulers;
		}
		
		public set eulers(value:away.geom.Vector3D)
		{
			this._rotationX = value.x*away.math.MathConsts.DEGREES_TO_RADIANS;
            this._rotationY = value.y*away.math.MathConsts.DEGREES_TO_RADIANS;
            this._rotationZ = value.z*away.math.MathConsts.DEGREES_TO_RADIANS;

            this.invalidateRotation();
		}
		
		/**
		 * The transformation of the 3d object, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
		 */

		public get transform():away.geom.Matrix3D
		{
			if (this._transformDirty)
            {

                this.pUpdateTransform()

            }

			
			return this._pTransform;
		}

		public set transform(val:away.geom.Matrix3D)
		{

            // TODO: From AS3 - Do we still need this in JS ?
            //ridiculous matrix error
            //*
            if (!val.rawData[0])
            {

                var raw:number[] = away.math.Matrix3DUtils.RAW_DATA_CONTAINER;
                val.copyRawDataTo( raw );
                raw[0] = this._smallestNumber;
                val.copyRawDataFrom(raw);
            }
            //*/
			var elements:away.geom.Vector3D[]= val.decompose();
			var vec:away.geom.Vector3D;
			
			vec = elements[0];
			
			if (this._x != vec.x || this._y != vec.y || this._z != vec.z)
            {
                this._x = vec.x;
                this._y = vec.y;
                this._z = vec.z;
				
				this.invalidatePosition();
			}
			
			vec = elements[1];
			
			if (this._rotationX != vec.x || this._rotationY != vec.y || this._rotationZ != vec.z)
            {
                this._rotationX = vec.x;
                this._rotationY = vec.y;
                this._rotationZ = vec.z;

                this.invalidateRotation();
			}
			
			vec = elements[2];
			
			if (this._pScaleX != vec.x || this._pScaleY != vec.y || this._pScaleZ != vec.z) {
                this._pScaleX = vec.x;
                this._pScaleY = vec.y;
                this._pScaleZ = vec.z;

                this.invalidateScale();
			}
		}


		/**
		 * Defines the local point around which the object rotates.
		 */

		public get pivotPoint():away.geom.Vector3D
		{
			return this._pivotPoint;
		}


		public set pivotPoint(pivot:away.geom.Vector3D)
		{
			this._pivotPoint = pivot.clone();

            this.invalidatePivot();
		}

		/**
		 * Defines the position of the 3d object, relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
		 */
		public get position():away.geom.Vector3D
		{
			this._pTransform.copyColumnTo(3, this._pPos);
			
			return this._pPos.clone();
		}
		
		public set position(value:away.geom.Vector3D)
		{
			this._x = value.x;
            this._y = value.y;
            this._z = value.z;

            this.invalidatePosition();
		}
		
		/**
		 *
		 */
		public get forwardVector():away.geom.Vector3D
		{
			return away.math.Matrix3DUtils.getForward( this.transform );
		}
		/**
		 *
		 */
		public get rightVector():away.geom.Vector3D
		{
			return away.math.Matrix3DUtils.getRight( this.transform );
		}
		/**
		 *
		 */
		public get upVector():away.geom.Vector3D
		{
			return away.math.Matrix3DUtils.getUp( this.transform );
		}
		/**
		 *
		 */
		public get backVector():away.geom.Vector3D
		{
			var director:away.geom.Vector3D = away.math.Matrix3DUtils.getForward( this.transform);
			director.negate();
			
			return director;
		}
		/**
		 *
		 */
		public get leftVector():away.geom.Vector3D
		{
			var director:away.geom.Vector3D = away.math.Matrix3DUtils.getRight( this.transform );
			director.negate();
			
			return director;
		}
		/**
		 *
		 */
		public get downVector():away.geom.Vector3D
		{
			var director:away.geom.Vector3D = away.math.Matrix3DUtils.getUp( this.transform );
			director.negate();
			
			return director;
		}
		/**
		 * Creates an Object3D object.
		 */
		constructor()
		{

            super();

			// Cached vector of transformation components used when
			// recomposing the transform matrix in updateTransform()

            this._transformComponents = new Array<away.geom.Vector3D>(3);//_transformComponents = new Vector.<Vector3D>(3, true);

			this._transformComponents[0] = this._pPos;
            this._transformComponents[1] = this._rot;
            this._transformComponents[2] = this._sca;
			
            this._pTransform.identity();
			
			this._flipY.appendScale( 1, -1, 1 );
		}
		
		/**
		 * Appends a uniform scale to the current transformation.
		 * @param value The amount by which to scale.
		 */
		public scale(value:number)
		{
			this._pScaleX *= value;
            this._pScaleY *= value;
            this._pScaleZ *= value;

            this.invalidateScale();
		}
		/**
		 * Moves the 3d object forwards along it's local z axis
		 *
		 * @param    distance    The length of the movement
		 */
		public moveForward(distance:number)
		{
			this.translateLocal(away.geom.Vector3D.Z_AXIS, distance);
		}
		/**
		 * Moves the 3d object backwards along it's local z axis
		 *
		 * @param    distance    The length of the movement
		 */
		public moveBackward(distance:number)
		{
			this.translateLocal(away.geom.Vector3D.Z_AXIS, -distance);
		}
		/**
		 * Moves the 3d object backwards along it's local x axis
		 *
		 * @param    distance    The length of the movement
		 */

		public moveLeft(distance:number)
		{
			this.translateLocal(away.geom.Vector3D.X_AXIS, -distance);
		}

		/**
		 * Moves the 3d object forwards along it's local x axis
		 *
		 * @param    distance    The length of the movement
		 */
		public moveRight(distance:number)
		{
			this.translateLocal(away.geom.Vector3D.X_AXIS, distance);
		}
		/**
		 * Moves the 3d object forwards along it's local y axis
		 *
		 * @param    distance    The length of the movement
		 */
		public moveUp(distance:number)
		{
			this.translateLocal(away.geom.Vector3D.Y_AXIS, distance);
		}
		/**
		 * Moves the 3d object backwards along it's local y axis
		 *
		 * @param    distance    The length of the movement
		 */
		public moveDown(distance:number)
		{
			this.translateLocal(away.geom.Vector3D.Y_AXIS, -distance);
		}

		/**
		 * Moves the 3d object directly to a point in space
		 *
		 * @param    dx        The amount of movement along the local x axis.
		 * @param    dy        The amount of movement along the local y axis.
		 * @param    dz        The amount of movement along the local z axis.
		 */

		public moveTo(dx:number, dy:number, dz:number)
		{
			if (this._x == dx && this._y == dy && this._z == dz)
            {

                return;

            }

            this._x = dx;
            this._y = dy;
            this._z = dz;

            this.invalidatePosition();
		}

		/**
		 * Moves the local point around which the object rotates.
		 *
		 * @param    dx        The amount of movement along the local x axis.
		 * @param    dy        The amount of movement along the local y axis.
		 * @param    dz        The amount of movement along the local z axis.
		 */
		public movePivot(dx:number, dy:number, dz:number)
		{

            if ( this._pivotPoint == null )
            {

                this._pivotPoint = new away.geom.Vector3D();

            }

			this._pivotPoint.x += dx;
            this._pivotPoint.y += dy;
            this._pivotPoint.z += dz;

            this.invalidatePivot();
		}
		/**
		 * Moves the 3d object along a vector by a defined length
		 *
		 * @param    axis        The vector defining the axis of movement
		 * @param    distance    The length of the movement
		 */
		public translate(axis:away.geom.Vector3D, distance:number)
		{
			var x:number = axis.x, y:number = axis.y, z:number = axis.z;
			var len:number = distance/Math.sqrt(x*x + y*y + z*z);
			
			this._x += x*len;
            this._y += y*len;
            this._z += z*len;
			
			this.invalidatePosition();
		}
		/**
		 * Moves the 3d object along a vector by a defined length
		 *
		 * @param    axis        The vector defining the axis of movement
		 * @param    distance    The length of the movement
		 */
		public translateLocal(axis:away.geom.Vector3D, distance:number)
		{
			var x:number = axis.x, y:number = axis.y, z:number = axis.z;
			var len:number = distance/Math.sqrt(x*x + y*y + z*z);
			
			this.transform.prependTranslation(x*len, y*len, z*len);
			
			this._pTransform.copyColumnTo(3, this._pPos);
			
			this._x = this._pPos.x;
            this._y = this._pPos.y;
            this._z = this._pPos.z;

            this.invalidatePosition();
		}
		/**
		 * Rotates the 3d object around it's local x-axis
		 *
		 * @param    angle        The amount of rotation in degrees
		 */
		public pitch(angle:number)
		{
            this.rotate(away.geom.Vector3D.X_AXIS, angle);
		}
		/**
		 * Rotates the 3d object around it's local y-axis
		 *
		 * @param    angle        The amount of rotation in degrees
		 */
		public yaw(angle:number)
		{
			this.rotate(away.geom.Vector3D.Y_AXIS, angle);
		}
		/**
		 * Rotates the 3d object around it's local z-axis
		 *
		 * @param    angle        The amount of rotation in degrees
		 */
		public roll(angle:number)
		{
			this.rotate(away.geom.Vector3D.Z_AXIS, angle);
		}
		public clone():Object3D
		{
			var clone:away.base.Object3D = new away.base.Object3D();
		    	clone.pivotPoint = this.pivotPoint;
			    clone.transform = this.transform;
			    clone.name = name;
			// todo: implement for all subtypes
			return clone;
		}
		/**
		 * Rotates the 3d object directly to a euler angle
		 *
		 * @param    ax        The angle in degrees of the rotation around the x axis.
		 * @param    ay        The angle in degrees of the rotation around the y axis.
		 * @param    az        The angle in degrees of the rotation around the z axis.
		 */
		public rotateTo(ax:number, ay:number, az:number)
		{
			this._rotationX = ax*away.math.MathConsts.DEGREES_TO_RADIANS;
            this._rotationY = ay*away.math.MathConsts.DEGREES_TO_RADIANS;
            this._rotationZ = az*away.math.MathConsts.DEGREES_TO_RADIANS;
			
			this.invalidateRotation();
		}
		/**
		 * Rotates the 3d object around an axis by a defined angle
		 *
		 * @param    axis        The vector defining the axis of rotation
		 * @param    angle        The amount of rotation in degrees
		 */
		public rotate(axis:away.geom.Vector3D, angle:number)
		{
			this.transform.prependRotation(angle, axis);
			this.transform = this.transform;

		}
		/**
		 * Rotates the 3d object around to face a point defined relative to the local coordinates of the parent <code>ObjectContainer3D</code>.
		 *
		 * @param    target        The vector defining the point to be looked at
		 * @param    upAxis        An optional vector used to define the desired up orientation of the 3d object after rotation has occurred
		 */
		public lookAt(target:away.geom.Vector3D, upAxis:away.geom.Vector3D = null)
		{

			var yAxis:away.geom.Vector3D;
            var zAxis:away.geom.Vector3D;
            var xAxis:away.geom.Vector3D;
			var raw:number[];

            if ( upAxis == null)
            {
                upAxis = away.geom.Vector3D.Y_AXIS;
            }

			zAxis = target.subtract(this.position);
			zAxis.normalize();
			
			xAxis = upAxis.crossProduct(zAxis);
			xAxis.normalize();
			
			if (xAxis.length < .05)
				xAxis = upAxis.crossProduct(away.geom.Vector3D.Z_AXIS);
			
			yAxis = zAxis.crossProduct(xAxis);
			
			raw = away.math.Matrix3DUtils.RAW_DATA_CONTAINER;
			
			raw[0] = this._pScaleX*xAxis.x;
			raw[1] = this._pScaleX*xAxis.y;
			raw[2] = this._pScaleX*xAxis.z;
			raw[3] = 0;
			
			raw[4] = this._pScaleY*yAxis.x;
			raw[5] = this._pScaleY*yAxis.y;
			raw[6] = this._pScaleY*yAxis.z;
			raw[7] = 0;
			
			raw[8] = this._pScaleZ*zAxis.x;
			raw[9] = this._pScaleZ*zAxis.y;
			raw[10] = this._pScaleZ*zAxis.z;
			raw[11] = 0;
			
			raw[12] = this._x;
			raw[13] = this._y;
			raw[14] = this._z;
			raw[15] = 1;

            this._pTransform.copyRawDataFrom(raw);

            this.transform = this.transform;
			
			if (zAxis.z < 0)
            {
                this.rotationY = (180 - this.rotationY);
                this.rotationX -= 180;
                this.rotationZ -= 180;
			}

		}
		/**
		 * Cleans up any resources used by the current object.
		 */
		public dispose()
		{
		}
		/**
		 * @inheritDoc
		 */
		public disposeAsset()
		{
			this.dispose();
		}
		/**
		 * Invalidates the transformation matrix, causing it to be updated upon the next request
		 */

		public iInvalidateTransform()
		{
			this._transformDirty = true;
		}


		public pUpdateTransform()
		{

			this._pPos.x = this._x;
            this._pPos.y = this._y;
            this._pPos.z = this._z;

            this._rot.x = this._rotationX;
            this._rot.y = this._rotationY;
            this._rot.z = this._rotationZ;

            this._sca.x = this._pScaleX;
            this._sca.y = this._pScaleY;
            this._sca.z = this._pScaleZ;

            this._pTransform.recompose(this._transformComponents);

			if (!this._pivotZero)
            {
                this._pTransform.prependTranslation(-this._pivotPoint.x, -this._pivotPoint.y, -this._pivotPoint.z);
                this._pTransform.appendTranslation(this._pivotPoint.x, this._pivotPoint.y, this._pivotPoint.z);
			}

            this._transformDirty = false;
            this._positionDirty = false;
            this._rotationDirty = false;
            this._scaleDirty = false;

		}

		public get zOffset():number
		{
			return this._zOffset;
		}
		
		public set zOffset(value:number)
		{
			this._zOffset = value;
		}
	}

}
