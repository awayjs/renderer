///<reference path="../_definitions.ts"/>


module away.utils
{

	export class RequestAnimationFrame
	{

		private _callback:Function;
		private _callbackContext:Object;
		private _active:boolean = false;
		private _rafUpdateFunction:any;
		private _prevTime:number;
		private _dt:number;
		private _currentTime:number;
		private _argsArray:any[] = new Array();
		private _getTimer:Function;

		constructor(callback:Function, callbackContext:Object)
		{


			this._getTimer = away.utils.getTimer;

			this.setCallback(callback, callbackContext);

			this._rafUpdateFunction = () =>
			{

				if (this._active) {

					this._tick();

				}

			}

			this._argsArray.push(this._dt);

		}

		// Public

		/**
		 *
		 * @param callback
		 * @param callbackContext
		 */
		public setCallback(callback:Function, callbackContext:Object)
		{

			this._callback = callback;
			this._callbackContext = callbackContext;

		}

		/**
		 *
		 */
		public start()
		{

			this._prevTime = this._getTimer();
			this._active = true;

			if (window['mozRequestAnimationFrame']) {

				window.requestAnimationFrame = window['mozRequestAnimationFrame'];

			} else if (window['webkitRequestAnimationFrame']) {

				window.requestAnimationFrame = window['webkitRequestAnimationFrame'];

			} else if (window['oRequestAnimationFrame']) {

				window.requestAnimationFrame = window['oRequestAnimationFrame'];

			}

			if (window.requestAnimationFrame) {

				window.requestAnimationFrame(this._rafUpdateFunction);

			}


		}

		/**
		 *
		 */
		public stop()
		{

			this._active = false;

		}

		// Get / Set

		/**
		 *
		 * @returns {boolean}
		 */
		public get active():boolean
		{

			return this._active;

		}

		// Private

		/**
		 *
		 * @private
		 */
		private _tick():void
		{

			this._currentTime = this._getTimer();
			this._dt = this._currentTime - this._prevTime;
			this._argsArray[0] = this._dt;
			this._callback.apply(this._callbackContext, this._argsArray);

			window.requestAnimationFrame(this._rafUpdateFunction);

			this._prevTime = this._currentTime;

		}


	}
}
