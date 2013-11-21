///<reference path="../_definitions.ts"/>

// Reference note: http://www.w3schools.com/jsref/dom_obj_event.asp

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

		// TODO: AS3 <> Conversion
		//private _mouseMoveEvent:away.events.MouseEvent = new away.events.MouseEvent(away.events.MouseEvent.MOUSE_MOVE);

		private static _mouseUp:away.events.MouseEvent3D = new away.events.MouseEvent3D(away.events.MouseEvent3D.MOUSE_UP);
		private static _mouseClick:away.events.MouseEvent3D = new away.events.MouseEvent3D(away.events.MouseEvent3D.CLICK);
		private static _mouseOut:away.events.MouseEvent3D = new away.events.MouseEvent3D(away.events.MouseEvent3D.MOUSE_OUT);
		private static _mouseDown:away.events.MouseEvent3D = new away.events.MouseEvent3D(away.events.MouseEvent3D.MOUSE_DOWN);
		private static _mouseMove:away.events.MouseEvent3D = new away.events.MouseEvent3D(away.events.MouseEvent3D.MOUSE_MOVE);
		private static _mouseOver:away.events.MouseEvent3D = new away.events.MouseEvent3D(away.events.MouseEvent3D.MOUSE_OVER);
		private static _mouseWheel:away.events.MouseEvent3D = new away.events.MouseEvent3D(away.events.MouseEvent3D.MOUSE_WHEEL);
		private static _mouseDoubleClick:away.events.MouseEvent3D = new away.events.MouseEvent3D(away.events.MouseEvent3D.DOUBLE_CLICK);
		private _forceMouseMove:boolean;
		private _mousePicker:away.pick.IPicker = away.pick.PickingType.RAYCAST_FIRST_ENCOUNTERED;
		private _childDepth:number = 0;
		private static _previousCollidingView:number = -1;
		private static _collidingView:number = -1;
		private _collidingDownObject:away.pick.PickingCollisionVO;
		private _collidingUpObject:away.pick.PickingCollisionVO;


		/**
		 * Creates a new <code>Mouse3DManager</code> object.
		 */
			constructor()
		{

			if (!Mouse3DManager._view3Ds) {
				Mouse3DManager._view3Ds = new Object();
				Mouse3DManager._view3DLookup = new Array<away.containers.View3D>();//Vector.<View3D>();
			}

		}

		// ---------------------------------------------------------------------
		// Interface.
		// ---------------------------------------------------------------------

		// TODO: required dependency stage3DProxy
		public updateCollider(view:away.containers.View3D)
		{
			throw new away.errors.PartialImplementationError('stage3DProxy');
			/*
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
			 */
		}

		public fireMouseEvents()
		{

			throw new away.errors.PartialImplementationError('View3D().layeredView')

			/*

			 var i:number;
			 var len:number;
			 var event:away.events.MouseEvent3D;
			 var dispatcher:away.containers.ObjectContainer3D;



			 // If multiple view are used, determine the best hit based on the depth intersection.
			 if ( Mouse3DManager._collidingViewObjects )
			 {
			 Mouse3DManager._pCollidingObject = null;//_collidingObject = null;

			 // Get the top-most view colliding object
			 var distance:number = Infinity;
			 var view:away.containers.View3D;

			 for (var v:number = Mouse3DManager._viewCount - 1; v >= 0; v--)
			 {
			 view = _view3DLookup[v];

			 if ( Mouse3DManager._collidingViewObjects[v] && (view.layeredView || Mouse3DManager._collidingViewObjects[v].rayEntryDistance < distance))
			 {

			 distance = Mouse3DManager._collidingViewObjects[v].rayEntryDistance;

			 Mouse3DManager._pCollidingObject = Mouse3DManager._collidingViewObjects[v];//_collidingObject = Mouse3DManager._collidingViewObjects[v];

			 if (view.layeredView)
			 {

			 break;

			 }

			 }
			 }
			 }

			 // If colliding object has changed, queue over/out events.
			 if (Mouse3DManager._pCollidingObject  != Mouse3DManager._previousCollidingObject)
			 {

			 if (Mouse3DManager._previousCollidingObject)
			 {

			 this.queueDispatch(Mouse3DManager._mouseOut, this._mouseMoveEvent, Mouse3DManager._previousCollidingObject);

			 }

			 if (Mouse3DManager._pCollidingObject)
			 {
			 this.queueDispatch(Mouse3DManager._mouseOver, this._mouseMoveEvent, Mouse3DManager._pCollidingObject );
			 }

			 }

			 // Fire mouse move events here if forceMouseMove is on.
			 if ( this._forceMouseMove && Mouse3DManager._pCollidingObject)
			 {

			 this.queueDispatch( Mouse3DManager._mouseMove, this._mouseMoveEvent, Mouse3DManager._pCollidingObject);

			 }


			 // Dispatch all queued events.
			 len = Mouse3DManager._queuedEvents.length;

			 for (i = 0; i < len; ++i)
			 {
			 // Only dispatch from first implicitly enabled object ( one that is not a child of a mouseChildren = false hierarchy ).
			 event = Mouse3DManager._queuedEvents[i];
			 dispatcher = event.object;

			 while (dispatcher && ! dispatcher._iAncestorsAllowMouseEnabled )
			 {

			 dispatcher = dispatcher.parent;

			 }


			 if (dispatcher)
			 {

			 dispatcher.dispatchEvent(event);

			 }

			 }
			 Mouse3DManager._queuedEvents.length = 0;

			 this._updateDirty = false;
			 Mouse3DManager._previousCollidingObject = Mouse3DManager._pCollidingObject;//_collidingObject;
			 //*/
		}

		public addViewLayer(view:away.containers.View3D)
		{
			throw new away.errors.PartialImplementationError('Stage3DProxy, Stage, DisplayObjectContainer ( as3 / native ) ');

			/*
			 var stg:Stage = view.stage;

			 // Add instance to mouse3dmanager to fire mouse events for multiple views
			 if (!view.stage3DProxy.mouse3DManager)
			 view.stage3DProxy.mouse3DManager = this;

			 if (!hasKey(view))
			 _view3Ds[view] = 0;

			 _childDepth = 0;
			 traverseDisplayObjects(stg);
			 _viewCount = _childDepth;
			 */

		}

		public enableMouseListeners(view:away.containers.View3D)
		{
			throw new away.errors.PartialImplementationError('MouseEvent ( as3 / native ) as3 <> JS Conversion');

			/*
			 view.addEventListener(MouseEvent.CLICK, onClick);
			 view.addEventListener(MouseEvent.DOUBLE_CLICK, onDoubleClick);
			 view.addEventListener(MouseEvent.MOUSE_DOWN, onMouseDown);
			 view.addEventListener(MouseEvent.MOUSE_MOVE, onMouseMove);
			 view.addEventListener(MouseEvent.MOUSE_UP, onMouseUp);
			 view.addEventListener(MouseEvent.MOUSE_WHEEL, onMouseWheel);
			 view.addEventListener(MouseEvent.MOUSE_OVER, onMouseOver);
			 view.addEventListener(MouseEvent.MOUSE_OUT, onMouseOut);
			 */
		}

		public disableMouseListeners(view:away.containers.View3D)
		{
			throw new away.errors.PartialImplementationError('MouseEvent ( as3 / native ) as3 <> JS Conversion');

			/*
			 view.removeEventListener(MouseEvent.CLICK, onClick);
			 view.removeEventListener(MouseEvent.DOUBLE_CLICK, onDoubleClick);
			 view.removeEventListener(MouseEvent.MOUSE_DOWN, onMouseDown);
			 view.removeEventListener(MouseEvent.MOUSE_MOVE, onMouseMove);
			 view.removeEventListener(MouseEvent.MOUSE_UP, onMouseUp);
			 view.removeEventListener(MouseEvent.MOUSE_WHEEL, onMouseWheel);
			 view.removeEventListener(MouseEvent.MOUSE_OVER, onMouseOver);
			 view.removeEventListener(MouseEvent.MOUSE_OUT, onMouseOut);
			 */

		}

		public dispose()
		{
			this._mousePicker.dispose();
		}

		// ---------------------------------------------------------------------
		// Private.
		// ---------------------------------------------------------------------

		private queueDispatch(event:away.events.MouseEvent3D, sourceEvent:MouseEvent, collider:away.pick.PickingCollisionVO = null)
		{
			throw new away.errors.PartialImplementationError('MouseEvent ( as3 / native ) as3 <> JS Conversion');

			/*
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
			 */
		}

		private reThrowEvent(event:MouseEvent)
		{

			/*
			 if (!this._activeView || (this._activeView && !this._activeView._pShareContext))
			 {


			 return;

			 }

			 // TODO: Debug / keep on eye on this one :
			 for (var v in Mouse3DManager._view3Ds)
			 {
			 if (v != this._activeView && Mouse3DManager._view3Ds[v] < Mouse3DManager._view3Ds[this._activeView])
			 {

			 v.dispatchEvent(event);

			 }

			 }
			 */

			throw new away.errors.PartialImplementationError('MouseEvent - AS3 <> JS Conversion');

		}

		private hasKey(view:away.containers.View3D):boolean
		{

			for (var v in Mouse3DManager._view3Ds) {

				if (v === view) {

					return true;

				}

			}

			return false;
		}

		private traverseDisplayObjects(container:any) //:DisplayObjectContainer)
		{
			throw new away.errors.PartialImplementationError('DisplayObjectContainer ( as3 / native ) as3 <> JS Conversion');
			/*
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
			 */
		}

		// ---------------------------------------------------------------------
		// Listeners.
		// ---------------------------------------------------------------------

		private onMouseMove(event:MouseEvent)
		{

			throw new away.errors.PartialImplementationError('MouseEvent ( as3 / native ) as3 <> JS Conversion');

			/*
			 if (Mouse3DManager._pCollidingObject)
			 {

			 this.queueDispatch(Mouse3DManager._mouseMove, this._mouseMoveEvent = event);

			 }
			 else
			 {

			 this.reThrowEvent(event);

			 }

			 this._updateDirty = true;
			 */
		}

		private onMouseOut(event:MouseEvent)
		{

			this._activeView = null;

			if (Mouse3DManager._pCollidingObject) {

				this.queueDispatch(Mouse3DManager._mouseOut, event, Mouse3DManager._pCollidingObject);

			}

			this._updateDirty = true;

			throw new away.errors.PartialImplementationError('MouseEvent ( as3 / native ) as3 <> JS Conversion');

		}

		private onMouseOver(event:MouseEvent)
		{

			/*
			 this._activeView = <away.containers.View3D> event.target ;//as View3D); // TODO: target was changed from currentTarget ( which might cause a bug ) .
			 //_activeView = (event.currentTarget as View3D);

			 if ( Mouse3DManager._pCollidingObject && Mouse3DManager._previousCollidingObject !=  Mouse3DManager._pCollidingObject)
			 {
			 this.queueDispatch( Mouse3DManager._mouseOver, event, Mouse3DManager._pCollidingObject);
			 }
			 else
			 {
			 this.reThrowEvent(event);
			 }

			 this._updateDirty = true;
			 */

			throw new away.errors.PartialImplementationError('MouseEvent ( as3 / native ) as3 <> JS Conversion');

		}

		private onClick(event:MouseEvent)
		{
			/*
			 if ( Mouse3DManager._pCollidingObject)
			 {

			 this.queueDispatch(Mouse3DManager._mouseClick, event);

			 }
			 else
			 {

			 this.reThrowEvent(event);

			 }

			 this._updateDirty = true;
			 */
			throw new away.errors.PartialImplementationError('MouseEvent ( as3 / native ) as3 <> JS Conversion');

		}

		private onDoubleClick(event:MouseEvent)
		{
			if (Mouse3DManager._pCollidingObject) {
				this.queueDispatch(Mouse3DManager._mouseDoubleClick, event);
			} else {
				this.reThrowEvent(event);
			}

			this._updateDirty = true;
		}

		private onMouseDown(event:MouseEvent)
		{
			/*
			 this._activeView = <away.containers.View3D> event.target ;//as View3D); // TODO: target was changed from currentTarget ( which might cause a bug ) .

			 this.updateCollider(this._activeView); // ensures collision check is done with correct mouse coordinates on mobile
			 if ( Mouse3DManager._pCollidingObject)
			 {

			 this.queueDispatch( Mouse3DManager._mouseDown, event);
			 Mouse3DManager._previousCollidingObject = Mouse3DManager._pCollidingObject;//_collidingObject;

			 }
			 else
			 {

			 this.reThrowEvent(event);

			 }

			 this._updateDirty = true;
			 */
			throw new away.errors.PartialImplementationError('MouseEvent ( as3 / native ) as3 <> JS Conversion');
		}

		private onMouseUp(event:MouseEvent)
		{
			/*
			 if ( Mouse3DManager._pCollidingObject)
			 {

			 this.queueDispatch( Mouse3DManager._mouseUp , event );
			 Mouse3DManager._previousCollidingObject = Mouse3DManager._pCollidingObject;

			 }
			 else
			 {

			 this.reThrowEvent(event);

			 }

			 this._updateDirty = true;
			 */
			throw new away.errors.PartialImplementationError('MouseEvent ( as3 / native ) as3 <> JS Conversion');

		}

		private onMouseWheel(event:MouseEvent)
		{
			/*
			 if (Mouse3DManager._pCollidingObject)
			 {

			 this.queueDispatch(Mouse3DManager._mouseWheel, event);

			 }
			 else
			 {

			 this.reThrowEvent(event);

			 }

			 this._updateDirty = true;

			 */
			throw new away.errors.PartialImplementationError('MouseEvent ( as3 / native ) as3 <> JS Conversion');

		}

		// ---------------------------------------------------------------------
		// Getters & setters.
		// ---------------------------------------------------------------------

		public get forceMouseMove():boolean
		{
			return this._forceMouseMove;
		}

		public set forceMouseMove(value:boolean)
		{
			this._forceMouseMove = value;
		}

		public get mousePicker():away.pick.IPicker
		{
			return this._mousePicker;
		}

		public set mousePicker(value:away.pick.IPicker)
		{
			this._mousePicker = value;
		}
	}
}
