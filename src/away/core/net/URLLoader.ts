///<reference path="../../_definitions.ts"/>
module away.net
{

	// TODO: implement / test cross domain policy

	export class URLLoader extends away.events.EventDispatcher
	{

		private _XHR:XMLHttpRequest;
		private _bytesLoaded:number = 0;
		private _bytesTotal:number = 0;
		private _data:any;
		private _dataFormat:string = away.net.URLLoaderDataFormat.TEXT;
		private _request:away.net.URLRequest;
		private _loadError:boolean = false;

		constructor()
		{

			super();

		}

		// Public

		/**
		 *
		 * @param request {away.net.URLRequest}
		 */
		public load(request:away.net.URLRequest):void
		{

			this.initXHR();
			this._request = request;

			if (request.method === away.net.URLRequestMethod.POST) {

				this.postRequest(request);


			} else {

				this.getRequest(request);

			}

		}

		/**
		 *
		 */
		public close():void
		{

			this._XHR.abort();
			this.disposeXHR();

		}

		/**
		 *
		 */
		public dispose():void
		{

			if (this._XHR) {

				this._XHR.abort();

			}

			this.disposeXHR();

			this._data = null;
			this._dataFormat = null;
			this._bytesLoaded = null;
			this._bytesTotal = null;

			/*
			 if( this._request )
			 {

			 this._request.dispose();

			 }
			 */

			this._request = null;

		}

		// Get / Set

		/**
		 *
		 * away.net.URLLoaderDataFormat.BINARY
		 * away.net.URLLoaderDataFormat.TEXT
		 * away.net.URLLoaderDataFormat.VARIABLES
		 *
		 * @param format
		 */
		public set dataFormat(format:string)
		{

			if (format === away.net.URLLoaderDataFormat.BLOB || format === away.net.URLLoaderDataFormat.ARRAY_BUFFER || format === away.net.URLLoaderDataFormat.BINARY || format === away.net.URLLoaderDataFormat.TEXT || format === away.net.URLLoaderDataFormat.VARIABLES) {

				this._dataFormat = format;

			} else {

				throw new away.errors.Error('URLLoader error: incompatible dataFormat');

			}

		}

		/**
		 *
		 * @returns {string}
		 *      away.net.URLLoaderDataFormat
		 */
		public get dataFormat():string
		{

			return this._dataFormat;

		}

		/**
		 *
		 * @returns {*}
		 */
		public get data():any
		{

			return this._data;

		}

		/**
		 *
		 * @returns {number}
		 */
		public get bytesLoaded():number
		{

			return this._bytesLoaded;

		}

		/**
		 *
		 * @returns {number}
		 */
		public get bytesTotal():number
		{

			return this._bytesTotal;

		}

		/**
		 *
		 * @returns {away.net.URLRequest}
		 */
		public get request():away.net.URLRequest
		{

			return this._request;

		}

		// Private

		/**
		 *
		 * @param xhr
		 * @param responseType
		 */
		private setResponseType(xhr:XMLHttpRequest, responseType:string):void
		{

			switch (responseType) {

				case away.net.URLLoaderDataFormat.ARRAY_BUFFER:
				case away.net.URLLoaderDataFormat.BLOB:
				case away.net.URLLoaderDataFormat.TEXT:

					xhr.responseType = responseType;

					break;

				case away.net.URLLoaderDataFormat.VARIABLES:

					xhr.responseType = away.net.URLLoaderDataFormat.TEXT;

					break;


				case away.net.URLLoaderDataFormat.BINARY:

					xhr.responseType = '';

					break;


			}


		}

		/**
		 *
		 * @param request {away.net.URLRequest}
		 */
		private getRequest(request:away.net.URLRequest):void
		{

			try {

				this._XHR.open(request.method, request.url, request.async);
				this.setResponseType(this._XHR, this._dataFormat);
				this._XHR.send(); // No data to send

			} catch (e /* <XMLHttpRequestException> */) {

				this.handleXmlHttpRequestException(e);

			}

		}

		/**
		 *
		 * @param request {away.net.URLRequest}
		 */
		private postRequest(request:away.net.URLRequest):void
		{

			this._loadError = false;

			this._XHR.open(request.method, request.url, request.async);

			if (request.data != null) {

				if (request.data instanceof away.net.URLVariables) {

					var urlVars:away.net.URLVariables = <away.net.URLVariables> request.data;

					try {

						this._XHR.responseType = 'text';
						this._XHR.send(urlVars.formData);


					} catch (e /* <XMLHttpRequestException> */) {

						this.handleXmlHttpRequestException(e);

					}

				} else {

					this.setResponseType(this._XHR, this._dataFormat);

					if (request.data) {

						this._XHR.send(request.data); // TODO: Test

					} else {

						this._XHR.send(); // no data to send

					}


				}

			} else {

				this._XHR.send(); // No data to send

			}

		}

		/**
		 *
		 * @param error {XMLHttpRequestException}
		 */
		private handleXmlHttpRequestException(error /* <XMLHttpRequestException> */):void
		{

			switch (error.code) {

			/******************************************************************************************************************************************************************************************************
			 *
			 *  XMLHttpRequestException { message: "NETWORK_ERR: XMLHttpRequest Exception 101", name: "NETWORK_ERR", code: 101, stack: "Error: A network error occurred in synchronous req…",NETWORK_ERR: 101… }
			 *  code: 101 , message: "NETWORK_ERR: XMLHttpRequest Exception 101" ,  name: "NETWORK_ERR"
			 *
			 ******************************************************************************************************************************************************************************************************/

				case 101:

					// Note: onLoadError event throws IO_ERROR event - this case is already Covered

					break;


			}


		}

		/**
		 *
		 */
		private initXHR()
		{

			if (!this._XHR) {

				this._XHR = new XMLHttpRequest();

				this._XHR.onloadstart = (event) => this.onLoadStart(event);                 // loadstart	        - When the request starts.
				this._XHR.onprogress = (event) => this.onProgress(event);	                // progress	            - While loading and sending data.
				this._XHR.onabort = (event) => this.onAbort(event);	                        // abort	            - When the request has been aborted, either by invoking the abort() method or navigating away from the page.
				this._XHR.onerror = (event) => this.onLoadError(event);                     // error	            - When the request has failed.
				this._XHR.onload = (event) => this.onLoadComplete(event);                   // load	                - When the request has successfully completed.
				this._XHR.ontimeout = (event) => this.onTimeOut(event);                     // timeout	            - When the author specified timeout has passed before the request could complete.
				this._XHR.onloadend = (event) => this.onLoadEnd(event);                     // loadend	            - When the request has completed, regardless of whether or not it was successful.
				this._XHR.onreadystatechange = (event) => this.onReadyStateChange(event);   // onreadystatechange   - When XHR state changes

			}

		}

		/**
		 *
		 */
		private disposeXHR()
		{

			if (this._XHR !== null) {

				this._XHR.onloadstart = null;
				this._XHR.onprogress = null;
				this._XHR.onabort = null;
				this._XHR.onerror = null;
				this._XHR.onload = null;
				this._XHR.ontimeout = null;
				this._XHR.onloadend = null;
				this._XHR = null;

			}

		}

		/**
		 *
		 * @param source
		 */
		public decodeURLVariables(source:string):Object
		{

			var result:Object = new Object();

			source = source.split("+").join(" ");

			var tokens, re = /[?&]?([^=]+)=([^&]*)/g;

			while (tokens = re.exec(source)) {

				result[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);

			}

			return result;

		}

		// XMLHttpRequest - Event Handlers

		/**
		 * When XHR state changes
		 * @param event
		 */
		private onReadyStateChange(event)
		{
			if (this._XHR.readyState == 4) {

				if (this._XHR.status == 404) {

					this._loadError = true;
					this.dispatchEvent(new away.events.IOErrorEvent(away.events.IOErrorEvent.IO_ERROR));

				}

				this.dispatchEvent(new away.events.HTTPStatusEvent(away.events.HTTPStatusEvent.HTTP_STATUS, this._XHR.status));

			}

		}

		/**
		 * When the request has completed, regardless of whether or not it was successful.
		 * @param event
		 */
		private onLoadEnd(event)
		{

			if (this._loadError === true) return;

		}

		/**
		 * When the author specified timeout has passed before the request could complete.
		 * @param event
		 */
		private onTimeOut(event)
		{

			//TODO: Timeout not currently implemented ( also not part of AS3 API )

		}

		/**
		 * When the request has been aborted, either by invoking the abort() method or navigating away from the page.
		 * @param event
		 */
		private onAbort(event)
		{

			// TODO: investigate whether this needs to be an IOError

		}

		/**
		 * While loading and sending data.
		 * @param event
		 */
		private onProgress(event)
		{

			this._bytesTotal = event.total;
			this._bytesLoaded = event.loaded;

			var progressEvent:away.events.ProgressEvent = new away.events.ProgressEvent(away.events.ProgressEvent.PROGRESS);
			progressEvent.bytesLoaded = this._bytesLoaded;
			progressEvent.bytesTotal = this._bytesTotal;
			this.dispatchEvent(progressEvent);

		}

		/**
		 * When the request starts.
		 * @param event
		 */
		private onLoadStart(event)
		{

			this.dispatchEvent(new away.events.Event(away.events.Event.OPEN));

		}

		/**
		 * When the request has successfully completed.
		 * @param event
		 */
		private onLoadComplete(event)
		{

			if (this._loadError === true) return;

			// TODO: Assert received data format

			switch (this._dataFormat) {

				case away.net.URLLoaderDataFormat.TEXT:

					this._data = this._XHR.responseText;

					break;

				case away.net.URLLoaderDataFormat.VARIABLES:

					this._data = this.decodeURLVariables(this._XHR.responseText);

					break;

				case away.net.URLLoaderDataFormat.BLOB:
				case away.net.URLLoaderDataFormat.ARRAY_BUFFER:
				case away.net.URLLoaderDataFormat.BINARY:

					this._data = this._XHR.response;

					break;

				default:

					this._data = this._XHR.responseText;

					break;

			}

			this.dispatchEvent(new away.events.Event(away.events.Event.COMPLETE));

		}

		/**
		 * When the request has failed. ( due to network issues ).
		 * @param event
		 */
		private onLoadError(event)
		{

			this._loadError = true;
			this.dispatchEvent(new away.events.IOErrorEvent(away.events.IOErrorEvent.IO_ERROR));

		}


	}

}