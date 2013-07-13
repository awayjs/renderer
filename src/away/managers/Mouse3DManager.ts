///<reference path="../containers/View3D.ts"/>
///<reference path="../containers/ObjectContainer3D.ts"/>
///<reference path="../geom/Vector3D.ts"/>
///<reference path="../pick/PickingCollisionVO.ts"/>
///<reference path="../pick/IPicker.ts"/>
///<reference path="../pick/PickingType.ts"/>
///<reference path="../events/MouseEvent3D.ts"/>

module away.managers
{
	//import away3d.arcane;
	//import away3d.containers.ObjectContainer3D;
	//import away3d.containers.View3D;
	//import away3d.core.pick.IPicker;
	//import away3d.core.pick.PickingCollisionVO;
	//import away3d.core.pick.PickingType;
	//import away3d.events.MouseEvent3D;
	
	//import flash.display.DisplayObject;
	//import flash.display.DisplayObjectContainer;
	//import flash.display.Stage;
	//import flash.events.MouseEvent;
	//import flash.geom.Vector3D;
	//import flash.utils.Dictionary;
	
	//use namespace arcane;
	
	/**
	 * Mouse3DManager enforces a singleton pattern and is not intended to be instanced.
	 * it provides a manager class for detecting 3D mouse hits on View3D objects and sending out 3D mouse events.
	 */
	export class Mouse3DManager
	{
		private static _view3Ds:Object;
		private static _view3DLookup:away.containers.View3D[];
		private static _viewCount:number = 0;
		
		private _activeView:away.containers.View3D;
		private _updateDirty:boolean = true;
		private _nullVector:away.geom.Vector3D = new away.geom.Vector3D();
		public static _pCollidingObject:away.pick.PickingCollisionVO;//Protected
		private static _previousCollidingObject:away.pick.PickingCollisionVO;
		private static _collidingViewObjects:away.pick.PickingCollisionVO[];//Vector.<PickingCollisionVO>;
		private static _queuedEvents:away.events.MouseEvent3D[] = new Array<away.events.MouseEvent3D>();//Vector.<MouseEvent3D> = new Vector.<MouseEvent3D>();
		
		private _mouseMoveEvent:away.events.MouseEvent = new away.events.MouseEvent(away.events.MouseEvent.MOUSE_MOVE);
		
		private static _mouseUp:away.events.MouseEvent3D = new away.events.MouseEvent3D(away.events.MouseEvent3D.MOUSE_UP);
		private static _mouseClick:away.events.MouseEvent3D = new away.events.MouseEvent3D(away.events.MouseEvent3D.CLICK);
		private static _mouseOut:away.events.MouseEvent3D = new away.events.MouseEvent3D(away.events.MouseEvent3D.MOUSE_OUT);
		private static _mouseDown:away.events.MouseEvent3D = new away.events.MouseEvent3D(away.events.MouseEvent3D.MOUSE_DOWN);
		private static _mouseMove:away.events.MouseEvent3D = new away.events.MouseEvent3D(away.events.MouseEvent3D.MOUSE_MOVE);
		private static _mouseOver:away.events.MouseEvent3D = new away.events.MouseEvent3D(away.events.MouseEvent3D.MOUSE_OVER);
		private static _mouseWheel:away.events.MouseEvent3D = new away.events.MouseEvent3D(away.events.MouseEvent3D.MOUSE_WHEEL);
		private static _mouseDoubleClick:away.events.MouseEvent3D = new away.events.MouseEvent3D(away.events.MouseEvent3D.DOUBLE_CLICK);
		private _forceMouseMove:boolean;
		private _mousePicker:away.pick.IPicker = away.events.PickingType.RAYCAST_FIRST_ENCOUNTERED;
		private var _childDepth:number = 0;
		private static var _previousCollidingView:number = -1;
		private static var _collidingView:number = -1;
		private var _collidingDownObject:away.pick.PickingCollisionVO;
		private var _collidingUpObject:away.pick.PickingCollisionVO;
		
		/**
		 * Creates a new <code>Mouse3DManager</code> object.
		 */
		constructor()
		{

			if (!Mouse3DManager._view3Ds)
            {
                Mouse3DManager._view3Ds         = new Object();
                Mouse3DManager._view3DLookup    = new Array<away.containers.View3D> () ;//Vector.<View3D>();
			}

		}
		
		// ---------------------------------------------------------------------
		// Interface.
		// ---------------------------------------------------------------------
		
		public updateCollider( view : away.containers.View3D )
		{
			this._previousCollidingView = this._collidingView;
			
			if (view) {
				// Clear the current colliding objects for multiple views if backBuffer just cleared
				if (view.stage3DProxy.bufferClear)
					_collidingViewObjects = new Vector.<PickingCollisionVO>(_viewCount);
				
				if (!view.shareContext) {
					if (view == _activeView && (_forceMouseMove || _updateDirty)) { // If forceMouseMove is off, and no 2D mouse events dirtied the update, don't update either.
						_collidingObject = _mousePicker.getViewCollision(view.mouseX, view.mouseY, view);
					}
				} else {
					if (view.getBounds(view.parent).contains(view.mouseX + view.x, view.mouseY + view.y)) {
						if (!_collidingViewObjects)
							_collidingViewObjects = new Vector.<PickingCollisionVO>(_viewCount);
						_collidingObject = _collidingViewObjects[_view3Ds[view]] = _mousePicker.getViewCollision(view.mouseX, view.mouseY, view);
					}
				}
			}
		}
		
		public fireMouseEvents()
		{
			var i:number;
			var len:number;
			var event:MouseEvent3D;
			var dispatcher:ObjectContainer3D;
			
			// If multiple view are used, determine the best hit based on the depth intersection.
			if (_collidingViewObjects) {
				_collidingObject = null;
				// Get the top-most view colliding object
				var distance:number = Infinity;
				var view:View3D;
				for (var v:number = _viewCount - 1; v >= 0; v--) {
					view = _view3DLookup[v];
					if (_collidingViewObjects[v] && (view.layeredView || _collidingViewObjects[v].rayEntryDistance < distance)) {
						distance = _collidingViewObjects[v].rayEntryDistance;
						_collidingObject = _collidingViewObjects[v];
						if (view.layeredView)
							break;
					}
				}
			}
			
			// If colliding object has changed, queue over/out events.
			if (_collidingObject != _previousCollidingObject) {
				if (_previousCollidingObject)
					queueDispatch(_mouseOut, _mouseMoveEvent, _previousCollidingObject);
				if (_collidingObject)
					queueDispatch(_mouseOver, _mouseMoveEvent, _collidingObject);
			}
			
			// Fire mouse move events here if forceMouseMove is on.
			if (_forceMouseMove && _collidingObject)
				queueDispatch(_mouseMove, _mouseMoveEvent, _collidingObject);
			
			// Dispatch all queued events.
			len = _queuedEvents.length;
			for (i = 0; i < len; ++i) {
				// Only dispatch from first implicitly enabled object ( one that is not a child of a mouseChildren = false hierarchy ).
				event = _queuedEvents[i];
				dispatcher = event.object;
				
				while (dispatcher && !dispatcher._ancestorsAllowMouseEnabled)
					dispatcher = dispatcher.parent;
				
				if (dispatcher)
					dispatcher.dispatchEvent(event);
			}
			_queuedEvents.length = 0;
			
			_updateDirty = false;
			_previousCollidingObject = _collidingObject;
		}
		
		public addViewLayer(view:View3D)
		{
			var stg:Stage = view.stage;
			
			// Add instance to mouse3dmanager to fire mouse events for multiple views
			if (!view.stage3DProxy.mouse3DManager)
				view.stage3DProxy.mouse3DManager = this;
			
			if (!hasKey(view))
				_view3Ds[view] = 0;
			
			_childDepth = 0;
			traverseDisplayObjects(stg);
			_viewCount = _childDepth;
		}
		
		public enableMouseListeners(view:View3D)
		{
			view.addEventListener(MouseEvent.CLICK, onClick);
			view.addEventListener(MouseEvent.DOUBLE_CLICK, onDoubleClick);
			view.addEventListener(MouseEvent.MOUSE_DOWN, onMouseDown);
			view.addEventListener(MouseEvent.MOUSE_MOVE, onMouseMove);
			view.addEventListener(MouseEvent.MOUSE_UP, onMouseUp);
			view.addEventListener(MouseEvent.MOUSE_WHEEL, onMouseWheel);
			view.addEventListener(MouseEvent.MOUSE_OVER, onMouseOver);
			view.addEventListener(MouseEvent.MOUSE_OUT, onMouseOut);
		}
		
		public disableMouseListeners(view:View3D)
		{
			view.removeEventListener(MouseEvent.CLICK, onClick);
			view.removeEventListener(MouseEvent.DOUBLE_CLICK, onDoubleClick);
			view.removeEventListener(MouseEvent.MOUSE_DOWN, onMouseDown);
			view.removeEventListener(MouseEvent.MOUSE_MOVE, onMouseMove);
			view.removeEventListener(MouseEvent.MOUSE_UP, onMouseUp);
			view.removeEventListener(MouseEvent.MOUSE_WHEEL, onMouseWheel);
			view.removeEventListener(MouseEvent.MOUSE_OVER, onMouseOver);
			view.removeEventListener(MouseEvent.MOUSE_OUT, onMouseOut);
		}
		
		public dispose()
		{
			_mousePicker.dispose();
		}
		
		// ---------------------------------------------------------------------
		// Private.
		// ---------------------------------------------------------------------
		
		private queueDispatch(event:MouseEvent3D, sourceEvent:MouseEvent, collider:PickingCollisionVO = null)
		{
			// 2D properties.
			event.ctrlKey = sourceEvent.ctrlKey;
			event.altKey = sourceEvent.altKey;
			event.shiftKey = sourceEvent.shiftKey;
			event.delta = sourceEvent.delta;
			event.screenX = sourceEvent.localX;
			event.screenY = sourceEvent.localY;
			
			collider ||= _collidingObject;
			
			// 3D properties.
			if (collider) {
				// Object.
				event.object = collider.entity;
				event.renderable = collider.renderable;
				// UV.
				event.uv = collider.uv;
				// Position.
				event.localPosition = collider.localPosition? collider.localPosition.clone() : null;
				// Normal.
				event.localNormal = collider.localNormal? collider.localNormal.clone() : null;
				// Face index.
				event.index = collider.index;
				// SubGeometryIndex.
				event.subGeometryIndex = collider.subGeometryIndex;
				
			} else {
				// Set all to null.
				event.uv = null;
				event.object = null;
				event.localPosition = _nullVector;
				event.localNormal = _nullVector;
				event.index = 0;
				event.subGeometryIndex = 0;
			}
			
			// Store event to be dispatched later.
			_queuedEvents.push(event);
		}
		
		private reThrowEvent(event:MouseEvent)
		{
			if (!_activeView || (_activeView && !_activeView.shareContext))
				return;
			
			for (var v:* in _view3Ds) {
				if (v != _activeView && _view3Ds[v] < _view3Ds[_activeView])
					v.dispatchEvent(event);
			}
		}
		
		private hasKey(view:View3D):boolean
		{
			for (var v:* in _view3Ds) {
				if (v === view)
					return true;
			}
			return false;
		}
		
		private traverseDisplayObjects(container:DisplayObjectContainer)
		{
			var childCount:number = container.numChildren;
			var c:number = 0;
			var child:DisplayObject;
			for (c = 0; c < childCount; c++) {
				child = container.getChildAt(c);
				for (var v:* in _view3Ds) {
					if (child == v) {
						_view3Ds[child] = _childDepth;
						_view3DLookup[_childDepth] = v;
						_childDepth++;
					}
				}
				if (child is DisplayObjectContainer)
					traverseDisplayObjects(child as DisplayObjectContainer);
			}
		}
		
		// ---------------------------------------------------------------------
		// Listeners.
		// ---------------------------------------------------------------------
		
		private onMouseMove(event:MouseEvent)
		{
			if (_collidingObject)
				queueDispatch(_mouseMove, _mouseMoveEvent = event);
			else
				reThrowEvent(event);
			_updateDirty = true;
		}
		
		private onMouseOut(event:MouseEvent)
		{
			_activeView = null;
			if (_collidingObject)
				queueDispatch(_mouseOut, event, _collidingObject);
			_updateDirty = true;
		}
		
		private onMouseOver(event:MouseEvent)
		{
			_activeView = (event.currentTarget as View3D);
			if (_collidingObject && _previousCollidingObject != _collidingObject)
				queueDispatch(_mouseOver, event, _collidingObject);
			else
				reThrowEvent(event);
			_updateDirty = true;
		}
		
		private onClick(event:MouseEvent)
		{
			if (_collidingObject) {
				queueDispatch(_mouseClick, event);
			} else
				reThrowEvent(event);
			_updateDirty = true;
		}
		
		private onDoubleClick(event:MouseEvent)
		{
			if (_collidingObject)
				queueDispatch(_mouseDoubleClick, event);
			else
				reThrowEvent(event);
			_updateDirty = true;
		}
		
		private onMouseDown(event:MouseEvent)
		{
			_activeView = (event.currentTarget as View3D);
			updateCollider(_activeView); // ensures collision check is done with correct mouse coordinates on mobile
			if (_collidingObject) {
				queueDispatch(_mouseDown, event);
				_previousCollidingObject = _collidingObject;
			} else
				reThrowEvent(event);
			_updateDirty = true;
		}
		
		private onMouseUp(event:MouseEvent)
		{
			if (_collidingObject) {
				queueDispatch(_mouseUp, event);
				_previousCollidingObject = _collidingObject;
			} else
				reThrowEvent(event);
			_updateDirty = true;
		}
		
		private onMouseWheel(event:MouseEvent)
		{
			if (_collidingObject)
				queueDispatch(_mouseWheel, event);
			else
				reThrowEvent(event);
			_updateDirty = true;
		}
		
		// ---------------------------------------------------------------------
		// Getters & setters.
		// ---------------------------------------------------------------------
		
		public get forceMouseMove():boolean
		{
			return _forceMouseMove;
		}
		
		public set forceMouseMove(value:boolean)
		{
			_forceMouseMove = value;
		}
		
		public get mousePicker():IPicker
		{
			return _mousePicker;
		}
		
		public set mousePicker(value:IPicker)
		{
			_mousePicker = value;
		}
	}
}
