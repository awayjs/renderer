/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts"/>

module away.utils
{
	export class ByteArray extends ByteArrayBase
	{
		
		public maxlength:number = 0;
		public arraybytes; //ArrayBuffer  
		public unalignedarraybytestemp; //ArrayBuffer
		
		constructor()
		{
			super();
			this._mode = "Typed array";
			this.maxlength = 4;
			this.arraybytes = new ArrayBuffer( this.maxlength );
			this.unalignedarraybytestemp = new ArrayBuffer( 16 );
		}
		
		public ensureWriteableSpace( n:number )
		{
			this.ensureSpace( n + this.position );
		}

        public setArrayBuffer( aBuffer : ArrayBuffer ) : void
        {

            /*
            var v2 : Int8Array = new Int8Array( aBuffer );

            for (var i = 0; i < v2.length - 1 ; i++)
            {
                this.writeByte( v2[ i ] );
            }
            //*/
            /*
            this.maxlength = aBuffer.byteLength + 4;
            this.arraybytes = new ArrayBuffer( this.maxlength );

            this.length = aBuffer.byteLength;

            for (var i = 0; i < aBuffer.byteLength; i++)
            {
                this.arraybytes [ i ] = aBuffer[ i  ];
            }
            //*/
            //bytes.setArrayBuffer( result );

            /*
            this.maxlength += 4;

            this.maxlength = this.length = aBuffer.byteLength;
            this.maxlength += 4;

            this.maxlength = this.length = aBuffer.byteLength;
            this.maxlength += 4;

            this.arraybytes = aBuffer;
            */

            //*
            this.maxlength = this.length = aBuffer.byteLength;
            //this.maxlength += 4;

            this.arraybytes = aBuffer;
            //*/

        }

        public getBytesAvailable() : number
        {
            return ( this.arraybytes.byteLength ) - ( this.position ) ;
        }

		public ensureSpace( n:number )
		{
			if ( n > this.maxlength )
			{
				var newmaxlength:number = (n+255)&(~255); 
				var newarraybuffer = new ArrayBuffer(newmaxlength);                              
				var view = new Uint8Array( this.arraybytes, 0, this.length ); 
				var newview = new Uint8Array( newarraybuffer, 0, this.length ); 
				newview.set( view );      // memcpy                        
				this.arraybytes = newarraybuffer;
				this.maxlength = newmaxlength;                         
			}
		}
		
		public writeByte( b:number )
		{                    
			this.ensureWriteableSpace( 1 );         
			var view = new Int8Array( this.arraybytes ); 
			view[ this.position++ ] = (~~b); // ~~ is cast to int in js...
			if ( this.position > this.length )
			{
				this.length = this.position;
			}
		}
		
		public readByte()
		{     
			if ( this.position >= this.length )
			{
				throw "ByteArray out of bounds read. Positon="+this.position+", Length="+this.length; 
			}
			var view = new Int8Array(this.arraybytes);
			return view[ this.position++ ];
		}

        public readBytes( bytes : ByteArray , start : number = 0 , end : number = 0 )
        {

            var uintArr : Uint8Array = new Uint8Array( this.arraybytes );

            if ( end == start || end <= start )
            {
                end = uintArr.length;
            }

            var result      : ArrayBuffer   = new ArrayBuffer( end - start );
            var resultArray : Uint8Array    = new Uint8Array(result);

            for (var i = 0; i < resultArray.length; i++)
            {
                resultArray[ i ] = uintArr[ i + start ];
            }

            bytes.setArrayBuffer( result );

        }
		
		public writeUnsignedByte( b:number )
		{                    
			this.ensureWriteableSpace( 1 );         
			var view = new Uint8Array( this.arraybytes ); 
			view[this.position++] = (~~b) & 0xff; // ~~ is cast to int in js...
			if ( this.position > this.length )
			{
				this.length = this.position;
			}
		}
		
		public readUnsignedByte()
		{     
			if ( this.position >= this.length )
			{
				throw "ByteArray out of bounds read. Positon="+this.position+", Length="+this.length; 
			}
			var view = new Uint8Array(this.arraybytes); 
			return view[this.position++];                
		}
		
		public writeUnsignedShort( b:number )
		{       
			this.ensureWriteableSpace ( 2 );         
			if ( ( this.position & 1 ) == 0 )
			{
				var view = new Uint16Array( this.arraybytes );
				view[ this.position >> 1 ] = (~~b) & 0xffff; // ~~ is cast to int in js...
			} 
			else
			{
				var view = new Uint16Array(this.unalignedarraybytestemp, 0, 1 );
				view[0] = (~~b) & 0xffff;
				var view2 = new Uint8Array( this.arraybytes, this.position, 2 );                         
				var view3 = new Uint8Array( this.unalignedarraybytestemp, 0, 2 ); 
				view2.set(view3);               
			}
			this.position += 2;
			if ( this.position > this.length )
			{
				this.length = this.position;
			}
		}
		
		public readUnsignedShort()
		{     
			if ( this.position > this.length + 2 )
			{
				throw "ByteArray out of bounds read. Positon=" + this.position + ", Length=" + this.length;         
			}
			if ( ( this.position & 1 )==0 )
			{
				var view = new Uint16Array( this.arraybytes );
				var pa:number = this.position >> 1;
				this.position += 2;
				return view[ pa ];
			}
			else
			{
				var view = new Uint16Array( this.unalignedarraybytestemp, 0, 1 );
				var view2 = new Uint8Array( this.arraybytes,this.position, 2 );
				var view3 = new Uint8Array( this.unalignedarraybytestemp, 0, 2 );
				view3.set( view2 );
				this.position += 2;
				return view[0];
			}
		}
		
		public writeUnsignedInt( b:number )
		{                    
			this.ensureWriteableSpace( 4 );         
			if ( ( this.position & 3 ) == 0 )
			{
				var view = new Uint32Array( this.arraybytes );
				view[ this.position >> 2 ] = (~~b) & 0xffffffff; // ~~ is cast to int in js...            
			}
			else
			{
				var view = new Uint32Array( this.unalignedarraybytestemp, 0, 1 );
				view[0] = (~~b) & 0xffffffff; 
				var view2 = new Uint8Array( this.arraybytes, this.position, 4 );                         
				var view3 = new Uint8Array( this.unalignedarraybytestemp, 0, 4 ); 
				view2.set( view3 );                 
			}        
			this.position+=4; 
			if ( this.position > this.length )
			{
				this.length = this.position;
			}
		}


        public readUnsignedInteger()
        {

            if ( this.position > this.length + 4 )
            {
                throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
            }

            var view = new Uint32Array( this.unalignedarraybytestemp, 0, 1 );
            var view2 = new Uint8Array( this.arraybytes,this.position, 4 );
            var view3 = new Uint8Array( this.unalignedarraybytestemp, 0, 4 );
            view3.set( view2 );
            this.position += 4;
            return view[0];

        }



		public readUnsignedInt()
		{

			if ( this.position > this.length + 4 )
			{
				throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
			}
			if ( ( this.position & 3 ) == 0 )
			{
				var view = new Uint32Array( this.arraybytes );
				var pa:number = this.position >> 2;
				this.position += 4;
				return view[ pa ];
			}
			else
			{
				var view = new Uint32Array( this.unalignedarraybytestemp, 0, 1 );
				var view2 = new Uint8Array( this.arraybytes,this.position, 4 );
				var view3 = new Uint8Array( this.unalignedarraybytestemp, 0, 4 );
				view3.set( view2 );
				this.position += 4;
				return view[0];
			}
		}
		
		public writeFloat( b:number )
		{                    
			this.ensureWriteableSpace( 4 );         
			if ( ( this.position & 3 ) == 0 ) {
				var view = new Float32Array( this.arraybytes );
				view[ this.position >> 2 ] = b; 
			}
			else
			{
				var view = new Float32Array( this.unalignedarraybytestemp, 0, 1 );
				view[0] = b;
				var view2 = new Uint8Array( this.arraybytes,this.position, 4 );
				var view3 = new Uint8Array( this.unalignedarraybytestemp, 0, 4 );
				view2.set(view3);
			}
			this.position += 4; 
			if ( this.position > this.length )
			{
				this.length = this.position;
			}
		}
		
		public readFloat()
		{     
			if ( this.position > this.length + 4 )
			{
				throw "ByteArray out of bounds read. Positon="+this.position+", Length="+this.length;         
			}
			if ( (this.position&3) == 0 )
			{
				var view = new Float32Array(this.arraybytes);
				var pa = this.position >> 2;
				this.position += 4;
				return view[pa];
			}
			else
			{
				var view = new Float32Array( this.unalignedarraybytestemp, 0, 1 );
				var view2 = new Uint8Array( this.arraybytes, this.position, 4 );
				var view3 = new Uint8Array( this.unalignedarraybytestemp, 0, 4 );
				view3.set( view2 );
				this.position += 4;
				return view[ 0 ];
			}
		}
	}
}