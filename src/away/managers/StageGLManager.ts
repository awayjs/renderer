///<reference path="../_definitions.ts"/>

module away.managers
{
	//import away.arcane;

	//import flash.base.Stage;
	//import flash.utils.Dictionary;

	//use namespace arcane;

	/**
	 * The StageGLManager class provides a multiton object that handles management for StageGL objects. StageGL objects
	 * should not be requested directly, but are exposed by a StageGLProxy.
	 *
	 * @see away.base.StageGLProxy
	 */
	export class StageGLManager extends away.events.EventDispatcher
	{
		private static STAGEGL_MAX_QUANTITY:number = 8;
		private _stageGLs:Array<away.base.StageGL>;

		//private static _instances:Object;
		private static _instance:StageGLManager;
		private static _numStageGLs:number = 0;
		private _onContextCreatedDelegate:Function;
		/**
		 * Creates a new StageGLManager class.
		 * @param stage The Stage object that contains the StageGL objects to be managed.
		 * @private
		 */
		constructor(StageGLManagerSingletonEnforcer:StageGLManagerSingletonEnforcer)
		{
			super();

			if (!StageGLManagerSingletonEnforcer)
				throw new Error("This class is a multiton and cannot be instantiated manually. Use StageGLManager.getInstance instead.");

			this._stageGLs = new Array<away.base.StageGL>(StageGLManager.STAGEGL_MAX_QUANTITY);

			this._onContextCreatedDelegate = away.utils.Delegate.create(this, this.onContextCreated);
		}

		/**
		 * Gets a StageGLManager instance for the given Stage object.
		 * @param stage The Stage object that contains the StageGL objects to be managed.
		 * @return The StageGLManager instance for the given Stage object.
		 */
		public static getInstance():StageGLManager
		{
			if (this._instance == null)
				this._instance = new StageGLManager(new StageGLManagerSingletonEnforcer());

			return this._instance;

		}

		/**
		 * Requests the StageGL for the given index.
		 *
		 * @param index The index of the requested StageGL.
		 * @param forceSoftware Whether to force software mode even if hardware acceleration is available.
		 * @param profile The compatibility profile, an enumeration of ContextGLProfile
		 * @return The StageGL for the given index.
		 */
		public getStageGLAt(index:number, forceSoftware:boolean = false, profile:string = "baseline"):away.base.StageGL
		{
			if (index < 0 || index >= StageGLManager.STAGEGL_MAX_QUANTITY)
				throw new away.errors.ArgumentError("Index is out of bounds [0.." + StageGLManager.STAGEGL_MAX_QUANTITY + "]");

			if (!this._stageGLs[index]) {
				StageGLManager._numStageGLs++;

				var canvas:HTMLCanvasElement = document.createElement("canvas");
				var stageGL:away.base.StageGL = this._stageGLs[index] = new away.base.StageGL(canvas, index, this, forceSoftware, profile);
				stageGL.addEventListener(away.events.StageGLEvent.CONTEXTGL_CREATED, this._onContextCreatedDelegate);
				stageGL.requestContext(true, forceSoftware, profile);
			}

			return stageGL;
		}

		/**
		 * Removes a StageGL from the manager.
		 * @param stageGL
		 * @private
		 */
		public iRemoveStageGL(stageGL:away.base.StageGL)
		{
			StageGLManager._numStageGLs--;

			stageGL.removeEventListener(away.events.StageGLEvent.CONTEXTGL_CREATED, this._onContextCreatedDelegate);

			this._stageGLs[ stageGL._iStageGLIndex ] = null;
		}

		/**
		 * Get the next available stageGL. An error is thrown if there are no StageGLProxies available
		 * @param forceSoftware Whether to force software mode even if hardware acceleration is available.
		 * @param profile The compatibility profile, an enumeration of ContextGLProfile
		 * @return The allocated stageGL
		 */
		public getFreeStageGL(forceSoftware:boolean = false, profile:string = "baseline"):away.base.StageGL
		{
			var i:number = 0;
			var len:number = this._stageGLs.length;

			//console.log( StageGLManager._stageProxies );

			while (i < len) {
				if (!this._stageGLs[i])
					return this.getStageGLAt(i, forceSoftware, profile);

				++i;
			}

			return null;
		}

		/**
		 * Checks if a new stageGL can be created and managed by the class.
		 * @return true if there is one slot free for a new stageGL
		 */
		public get hasFreeStageGL():boolean
		{
			return StageGLManager._numStageGLs < StageGLManager.STAGEGL_MAX_QUANTITY? true : false;
		}

		/**
		 * Returns the amount of stageGL objects that can be created and managed by the class
		 * @return the amount of free slots
		 */
		public get numSlotsFree():number
		{
			return StageGLManager.STAGEGL_MAX_QUANTITY - StageGLManager._numStageGLs;
		}

		/**
		 * Returns the amount of StageGL objects currently managed by the class.
		 * @return the amount of slots used
		 */
		public get numSlotsUsed():number
		{
			return StageGLManager._numStageGLs;
		}

		/**
		 * The maximum amount of StageGL objects that can be managed by the class
		 */
		public get numSlotsTotal():number
		{
			return this._stageGLs.length;
		}

		private onContextCreated(e:away.events.Event):void
		{
			var stageGL:away.base.StageGL = <away.base.StageGL> e.target;
			document.body.appendChild(stageGL.canvas)
		}
	}
}

class StageGLManagerSingletonEnforcer
{
}
