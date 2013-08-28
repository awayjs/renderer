///<reference path="../../../_definitions.ts"/>

module away.loaders
{

	export class ParserUtil
	{
		
		/**
		 * Returns a object as ByteArray, if possible.
		 * 
		 * @param data The object to return as ByteArray
		 * 
		 * @return The ByteArray or null
		 *
		 */
		public static toByteArray(data:any) : away.utils.ByteArray
		{

            var b : away.utils.ByteArray = new away.utils.ByteArray();
                b.arraybytes = ArrayBuffer( data );
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
		public static toString(data:any /*, length:number = 0 */):string
		{

            if ( typeof data == 'string' );
            {
                var s : string = <string> data;
                return s.substr(0 , s.length );

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
