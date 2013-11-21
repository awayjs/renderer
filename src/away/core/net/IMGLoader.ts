///<reference path="../../_definitions.ts"/>
module away.net
{

	// TODO: implement / test cross domain policy

	export class IMGLoader extends away.events.EventDispatcher
	{

		private _image:HTMLImageElement;
		private _request:away.net.URLRequest;
		private _name:string = '';
		private _loaded:boolean = false;
		private _crossOrigin:string;

		constructor(imageName:string = '')
		{

			super();
			this._name = imageName;
			this.initImage();

		}

		// Public
		/**
		 * load an image
		 * @param request {away.net.URLRequest}
		 */
		public load(request:away.net.URLRequest):void
		{

			this._loaded = false;
			this._request = request;

			if (this._crossOrigin) {

				if (this._image['crossOrigin'] != null) {

					this._image['crossOrigin'] = this._crossOrigin;

				}


			}

			this._image.src = this._request.url;

		}

		/**
		 *
		 */
		public dispose():void
		{

			if (this._image) {

				this._image.onabort = null;
				this._image.onerror = null;
				this._image.onload = null;
				this._image = null;

			}

			if (this._request) {

				this._request = null;

			}

		}

		// Get / Set

		/**
		 * Get reference to image if it is loaded
		 * @returns {HTMLImageElement}
		 */
		public get image():HTMLImageElement
		{

			return this._image;

		}

		/**
		 * Get image width. Returns null is image is not loaded
		 * @returns {number}
		 */
		public get loaded():boolean
		{

			return this._loaded

		}

		public get crossOrigin():string
		{

			return this._crossOrigin;
		}

		public set crossOrigin(value:string)
		{

			this._crossOrigin = value;

		}

		/**
		 * Get image width. Returns null is image is not loaded
		 * @returns {number}
		 */
		public get width():number
		{

			if (this._image) {

				return this._image.width;

			}

			return null;

		}

		/**
		 * Get image height. Returns null is image is not loaded
		 * @returns {number}
		 */
		public get height():number
		{

			if (this._image) {

				return this._image.height;

			}

			return null;

		}

		/**
		 * return URL request used to load image
		 * @returns {away.net.URLRequest}
		 */
		public get request():away.net.URLRequest
		{

			return this._request;

		}

		/**
		 * get name of HTMLImageElement
		 * @returns {string}
		 */
		public get name():string
		{

			if (this._image) {

				return this._image.name;

			}

			return this._name;

		}

		/**
		 * set name of HTMLImageElement
		 * @returns {string}
		 */
		public set name(value:string)
		{

			if (this._image) {

				this._image.name = value;

			}

			this._name = value;

		}

		// Private

		/**
		 * intialise the image object
		 */
		private initImage()
		{

			if (!this._image) {

				this._image = new Image();
				this._image.onabort = (event) => this.onAbort(event); //Loading of an image is interrupted
				this._image.onerror = (event) => this.onError(event); //An error occurs when loading an image
				this._image.onload = (event) => this.onLoadComplete(event); //image is finished loading
				this._image.name = this._name;

			}

		}

		// Image - event handlers

		/**
		 * Loading of an image is interrupted
		 * @param event
		 */
		private onAbort(event):void
		{

			this.dispatchEvent(new away.events.Event(away.events.IOErrorEvent.IO_ERROR));

		}

		/**
		 * An error occured when loading the image
		 * @param event
		 */
		private onError(event):void
		{

			this.dispatchEvent(new away.events.Event(away.events.IOErrorEvent.IO_ERROR));

		}

		/**
		 * image is finished loading
		 * @param event
		 */
		private onLoadComplete(event):void
		{
			this._loaded = true;
			this.dispatchEvent(new away.events.Event(away.events.Event.COMPLETE));

		}

	}

}
