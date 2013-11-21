///<reference path="../../../_definitions.ts"/>

module away.loaders
{

	export class ParserUtil
	{

		/**
		 * Converts an ByteArray to an Image - returns an HTMLImageElement
		 *
		 * @param image data as a ByteArray
		 *
		 * @return HTMLImageElement
		 *
		 */
		public static byteArrayToImage(data:away.utils.ByteArray):HTMLImageElement
		{

			var byteStr:string = '';
			var bytes:Uint8Array = new Uint8Array(data.arraybytes);
			var len:number = bytes.byteLength;

			for (var i = 0; i < len; i++) {
				byteStr += String.fromCharCode(bytes[ i ])
			}

			var base64Image:string = window.btoa(byteStr);
			var str:string = 'data:image/png;base64,' + base64Image;
			var img:HTMLImageElement = <HTMLImageElement> new Image();
			img.src = str;

			return img;

		}

		/**
		 * Returns a object as ByteArray, if possible.
		 *
		 * @param data The object to return as ByteArray
		 *
		 * @return The ByteArray or null
		 *
		 */
		public static toByteArray(data:any):away.utils.ByteArray
		{
			var b:away.utils.ByteArray = new away.utils.ByteArray();
			b.setArrayBuffer(data);
			return b;
		}

		/**
		 * Returns a object as String, if possible.
		 *
		 * @param data The object to return as String
		 * @param length The length of the returned String
		 *
		 * @return The String or null
		 *
		 */
		public static toString(data:any, length:number = 0):string
		{

			if (typeof data === 'string');
			{

				var s:string = <string> data;

				if (s['substr'] != null) {
					return s.substr(0, s.length);
				}

			}

			if (data instanceof away.utils.ByteArray) {

				var ba:away.utils.ByteArray = <away.utils.ByteArray> data;
				ba.position = 0;
				return ba.readUTFBytes(Math.min(ba.getBytesAvailable(), length));

			}

			return null;

			/*
			 var ba:ByteArray;

			 length ||= uint.MAX_VALUE;

			 if (data is String)
			 return String(data).substr(0, length);

			 ba = toByteArray(data);
			 if (ba) {
			 ba.position = 0;
			 return ba.readUTFBytes(Math.min(ba.bytesAvailable, length));
			 }

			 return null;

			 */

		}
	}
}
