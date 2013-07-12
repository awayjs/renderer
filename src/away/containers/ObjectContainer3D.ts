/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */
 
///<reference path="../base/Object3D.ts" />
///<reference path="../geom/Matrix3D.ts" />
///<reference path="../library/assets/AssetType.ts" />
///<reference path="../events/Object3DEvent.ts" />

module away.containers
{
	export class ObjectContainer3D extends away.base.Object3D
	{
		public _iAncestorsAllowMouseEnabled:boolean;
		public _iIsRoot:boolean;
		
		public _pScene:Scene3D;
		public _pParent:ObjectContainer3D;
		public _pSceneTransform:away.geom.Matrix3D = new away.geom.Matrix3D();
		public _pSceneTransformDirty:boolean = true;
		
		//TODO public _pExplicitPartition:away.partitions.Partition3D;
		//TODO public _pImplicitPartition:away.partitions.Partition3D;
		public _pMouseEnabled:boolean;
		
		private _sceneTransformChanged:away.events.Object3DEvent;
		private _scenechanged:away.events.Object3DEvent;
		private _children:away.containers.ObjectContainer3D[] = [];
		private _mouseChildren:boolean = true;
		private _oldScene:away.containers.Scene3D;
		private _inverseSceneTransform:away.geom.Matrix3D = new away.geom.Matrix3D();
		private _inverseSceneTransformDirty:boolean = true;
		private _scenePosition:away.geom.Vector3D = new away.geom.Vector3D();
		private _scenePositionDirty:boolean = true;
		private _explicitVisibility:boolean = true;
		private _implicitVisibility:boolean = true;
		private _listenToSceneTransformChanged:boolean;
		private _listenToSceneChanged:boolean;
		
		public _pIgnoreTransform:boolean = false;
		
		constructor()
		{
			super();
		}
		
		public getIgnoreTransform():boolean
		{
			return this._pIgnoreTransform;
		}
		
		public setIgnoreTransform( value:boolean )
		{
			this._pIgnoreTransform = value;
			this._pSceneTransformDirty = !value;
			this._inverseSceneTransformDirty = !value;
			this._scenePositionDirty = !value;
			
			if( value ) {
				this._pSceneTransform.identity();
				this._scenePosition.setTo( 0, 0, 0 );
			}
		}
		/*
		public get iImplicitPartition():away.partitions.Partition3D
		{
			return this._iImplicitPartition;
		}
		
		public set iImplicitPartition( value:away.partitions.Partition3D )
		{
			if (value == _iImplicitPartition)
			{
				return;
			}
			
			var i:number;
			var len:number = _children.length;
			var child:away.containers.ObjectContainer3D;
			
			_iImplicitPartition = value;
			
			while (i < len)
			{
				child = _children[i++];
				
				// assign implicit partition if no explicit one is given
				if( !child._explicitPartition )
				{
					child._iImplicitPartition = value;
				}
			}
		}
		*/
		
		public get _iIsVisible():boolean
		{
			return this._implicitVisibility && this._explicitVisibility;
		}
		
		public iSetParent( value:away.containers.ObjectContainer3D )
		{
			this._pParent = value;
			
			//this.pUpdateMouseChildren();
			
			if( value == null ) {
				this.scene = null;
				return;
			}
			
			this.notifySceneTransformChange();
			this.notifySceneChange();
		}
		
		private notifySceneTransformChange()
		{
			if ( this._pSceneTransformDirty || this._pIgnoreTransform )
			{
				return;
			}
			
			this.pInvalidateSceneTransform();
			
			var i:number;
			var len:number = this._children.length;
			
			//act recursively on child objects
			while( i < len )
			{
				this._children[i++].notifySceneTransformChange();
			}
			
			//trigger event if listener exists
			if( this._listenToSceneTransformChanged )
			{
				if( !this._sceneTransformChanged )
				{
					this._sceneTransformChanged = new away.events.Object3DEvent( away.events.Object3DEvent.SCENETRANSFORM_CHANGED, this );
				}
				this.dispatchEvent( this._sceneTransformChanged );
			}
		}
		
		private notifySceneChange()
		{
			this.notifySceneTransformChange();
			
			var i:number;
			var len:number = this._children.length;
			
			while(i < len)
			{
				this._children[i++].notifySceneChange();
			}
			
			if( this._listenToSceneChanged )
			{
				if( !this._scenechanged )
				{
					this._scenechanged = new away.events.Object3DEvent( away.events.Object3DEvent.SCENE_CHANGED, this );
				}
				this.dispatchEvent( this._scenechanged );
			}
		}
		
		/*
		public pUpdateMouseChildren():void
		{
			if( this._pParent && !this._pParent._iIsRoot ) {
				// Set implicit mouse enabled if parent its children to be so.
				this._iAncestorsAllowMouseEnabled = this._pParent._iAncestorsAllowMouseEnabled && this._pParent.mouseChildren;
			}
			else
			{
				this._iAncestorsAllowMouseEnabled = this.mouseChildren;
			}
			
			// Sweep children.
			var len:number = this._children.length;
			for( var i:number = 0; i < len; ++i )
			{
				this._children[i].updateMouseChildren();
			}
		}
		*/
		
		public get mouseEnabled():boolean
		{
			return this._pMouseEnabled;
		}
		
		/*
		public set mouseEnabled( value:boolean )
		{
			this._pMouseEnabled = value;
			this._pUpdateMouseChildren();
		}
		*/
		
		// TODO override arcane function invalidateTransform():void
		
		public pInvalidateSceneTransform()
		{
			this._pSceneTransformDirty = !this._pIgnoreTransform;
			this._inverseSceneTransformDirty = !this._pIgnoreTransform;
			this._scenePositionDirty = !this._pIgnoreTransform;
		}
		
		public pUpdateSceneTransform()
		{
			if ( this._pParent && !this._pParent._iIsRoot )
			{
				this._pSceneTransform.copyFrom( this._pParent.sceneTransform );
				this._pSceneTransform.prepend( this.transform );
			}
			else
			{
				this._pSceneTransform.copyFrom( this.transform );
			}
			this._pSceneTransformDirty = false;
		}
		
		public get mouseChildren():boolean
		{
			return this._mouseChildren;
		}
		
		/*
		public set mouseChildren( value:boolean )
		{
			this._mouseChildren = value;
			this._pUpdateMouseChildren();
		}
		*/
		
		public get visible():boolean
		{
			return this._explicitVisibility;
		}
		
		public set visible( value:boolean )
		{
			var len:number = this._children.length;
			
			this._explicitVisibility = value;
			
			for( var i:number = 0; i < len; ++i )
			{
				this._children[i].updateImplicitVisibility();
			}
		}
		
		public get assetType():string
		{
			return away.library.AssetType.CONTAINER;
		}
		
		public get scenePosition():away.geom.Vector3D
		{
			if ( this._scenePositionDirty )
			{
				this.sceneTransform.copyColumnTo( 3, this._scenePosition );
				this._scenePositionDirty = false;
			}
			return this._scenePosition;
		}
		
		public get minX():number
		{
			var i:number;
			var len:number = this._children.length;
			var min:number = Number.POSITIVE_INFINITY;
			var m:number;
			
			while( i < len ) {
				var child:away.containers.ObjectContainer3D = this._children[i++];
				m = child.minX + child.x;
				if( m < min )
				{
					min = m;
				}
			}
			return min;
		}
		
		public get minY():number
		{
			var i:number;
			var len:number = this._children.length;
			var min:number = Number.POSITIVE_INFINITY;
			var m:number;
			
			while( i < len )
			{
				var child:away.containers.ObjectContainer3D = this._children[i++];
				m = child.minY + child.y;
				if( m < min )
				{
					min = m;
				}
			}
			return min;
		}
		
		public get minZ():number
		{
			var i:number;
			var len:number = this._children.length;
			var min:number = Number.POSITIVE_INFINITY;
			var m:number;
			
			while( i < len )
			{
				var child:away.containers.ObjectContainer3D = this._children[i++];
				m = child.minZ + child.z;
				if( m < min )
				{
					min = m;
				}
			}
			return min;
		}
		
		public get maxX():number
		{
			var i:number;
			var len:number = this._children.length;
			var max:number = Number.NEGATIVE_INFINITY;
			var m:number;
			
			while( i < len ) {
				var child:away.containers.ObjectContainer3D = this._children[i++];
				m = child.maxX + child.x;
				if( m > max )
				{
					max = m;
				}
			}
			return max;
		}
		
		public get maxY():number
		{
			var i:number;
			var len:number = this._children.length;
			var max:number = Number.NEGATIVE_INFINITY;
			var m:number;
			
			while( i < len )
			{
				var child:away.containers.ObjectContainer3D = this._children[i++];
				m = child.maxY + child.y;
				if( m > max )
				{
					max = m;
				}
			}
			return max;
		}
		
		public get maxZ():number
		{
			var i:number;
			var len:number = this._children.length;
			var max:number = Number.NEGATIVE_INFINITY;
			var m:number;
			
			while( i < len ) {
				var child:away.containers.ObjectContainer3D = this._children[i++];
				m = child.maxZ + child.z;
				if( m > max )
				{
					max = m;
				}
			}
			return max;
		}
		
		/*
		public get partition():away.partitions.Partition3D
		{
			return this._pExplicitPartition;
		}
		
		public set partition( value:away.partitions.Partition3D )
		{
			this._explicitPartition = value;
			this.implicitPartition = value ? value : ( this._pParent ? this._pParent.implicitPartition : null);
		}
		*/
		
		public get sceneTransform():away.geom.Matrix3D
		{
			if( this._pSceneTransformDirty )
			{
				this.pUpdateSceneTransform();
			}
			return this._pSceneTransform;
		}
		
		public get scene():away.containers.Scene3D
		{
			return this._pScene;
		}
		
		//TODO public function set scene(value:Scene3D):void
		
		public get inverseSceneTransform():away.geom.Matrix3D
		{
			if ( this._inverseSceneTransformDirty )
			{
				this._inverseSceneTransform.copyFrom( this.sceneTransform );
				this._inverseSceneTransform.invert();
				this._inverseSceneTransformDirty = false;
			}
			return this._inverseSceneTransform;
		}
		
		public get parent():away.containers.ObjectContainer3D
		{
			return this._pParent;
		}
		
		public contains( child:away.containers.ObjectContainer3D ):boolean
		{
			return this._children.indexOf( child ) >= 0;
		}
		
		public addChild( child:away.containers.ObjectContainer3D ):away.containers.ObjectContainer3D
		{
			if (child == null)
			{
				throw new away.errors.Error("Parameter child cannot be null.");
			}
			
			if (child._pParent)
			{
				child._pParent.removeChild(child);
			}
			/*
			if (!child._pExplicitPartition)
			{
				child.implicitPartition = _implicitPartition;
			}
			*/
			child.iSetParent( this );
			child.scene = this._pScene;
			child.notifySceneTransformChange();
			//child.updateMouseChildren();
			child.updateImplicitVisibility();
			
			this._children.push(child);
			
			return child;
		}
		
		/*
		public addChildren( childarray:away.containers.ObjectContainer3D )
		{
			for(var child:away.containers.ObjectContainer3D in childarray )
			{
				this.addChild( child );
			}
		}
		
		*/
		
		public removeChild( child:away.containers.ObjectContainer3D )
		{
			if ( child == null )
			{
				throw new away.errors.Error("Parameter child cannot be null");
			}
			
			var childIndex:number = this._children.indexOf(child);
			
			if ( childIndex == -1 )
			{
				throw new away.errors.Error("Parameter is not a child of the caller");
			}
			
			this.removeChildInternal( childIndex, child );
		}
		
		public removeChildAt( index:number )
		{
			var child:ObjectContainer3D = this._children[index];
			this.removeChildInternal( index, child );
		}
		
		private removeChildInternal( childIndex:number, child:away.containers.ObjectContainer3D )
		{
			this._children.splice( childIndex, 1 );
			child.iSetParent( null );
			/*
			if ( !child._explicitPartition )
			{
				child.implicitPartition = null;
			}*/
		}
		
		public getChildAt( index:number ):away.containers.ObjectContainer3D
		{
			return this._children[index];
		}
		
		public get numChildren():number
		{
			return this._children.length;
		}
		
		//TODO override public function lookAt(target:Vector3D, upAxis:Vector3D = null):void
		//TODO override public function translateLocal(axis:Vector3D, distance:Number):void
		
		//TODO override public function dispose():void
		/*
		public disposeWithChildren()
		{
			this.dispose();
			while( this.numChildren > 0 )
			{
				this.getChildAt(0).dispose();
			}
		}
		*/
		//TODO override public function clone():Object3D
		//TODO override public function rotate(axis:Vector3D, angle:Number):void
		//TODO override public function dispatchEvent(event:Event):Boolean
		
		public updateImplicitVisibility()
		{
			var len:number = this._children.length;
			
			this._implicitVisibility = this._pParent._explicitVisibility && this._pParent._implicitVisibility;
			
			for (var i:number = 0; i < len; ++i)
			{
				this._children[i].updateImplicitVisibility();
			}
		}
		
		//TODO override public function addEventListener(type:String, listener:Function, useCapture:Boolean = false, priority:int = 0, useWeakReference:Boolean = false):void
		//TODO override public function removeEventListener(type:String, listener:Function, useCapture:Boolean = false):void
		
		
		
	}
}