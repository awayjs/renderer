///<reference path="../../_definitions.ts"/>

module away.display3D
{
	export class Texture extends TextureBase
	{

		public textureType:string = "texture2d";
		
		private _width:number;
		private _height:number;

        private _frameBuffer:WebGLFramebuffer;

		private _glTexture:WebGLTexture;
		
		constructor( gl:WebGLRenderingContext, width:number, height:number )
		{
			super( gl );
			this._width = width;
			this._height = height;
			
			this._glTexture = this._gl.createTexture();
		}
		
		public dispose()
		{
			this._gl.deleteTexture( this._glTexture );
		}
		
		public get width():number
		{
			return this._width;
		}
		
		public get height():number
		{
			return this._height;
		}

        public get frameBuffer():WebGLFramebuffer
        {
            return this._frameBuffer;
        }

		public uploadFromHTMLImageElement( image:HTMLImageElement, miplevel:number = 0 )
		{
			this._gl.bindTexture( this._gl.TEXTURE_2D, this._glTexture );
			this._gl.texImage2D( this._gl.TEXTURE_2D, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image );
			this._gl.bindTexture( this._gl.TEXTURE_2D, null );
		}
		
		public uploadFromBitmapData( data:away.display.BitmapData, miplevel:number = 0 )
		{
			this._gl.bindTexture( this._gl.TEXTURE_2D, this._glTexture );
			this._gl.texImage2D( this._gl.TEXTURE_2D, miplevel, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data.imageData );
			this._gl.bindTexture( this._gl.TEXTURE_2D, null );
		}
		
		public get glTexture(): WebGLTexture
		{
			return this._glTexture;
		}

        public generateFromRenderBuffer(data:away.display.BitmapData)
        {
            this._frameBuffer = this._gl.createFramebuffer();
            this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._frameBuffer);
            this._frameBuffer.width = this._width;
            this._frameBuffer.height = this._height;

            this._gl.bindTexture( this._gl.TEXTURE_2D, this._glTexture );
            this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR);
            this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR_MIPMAP_NEAREST);
            //this._gl.generateMipmap(this._gl.TEXTURE_2D);

            //this._gl.texImage2D( this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, data.imageData );

            this._gl.texImage2D( this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._width, this._height, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, null );

            var renderBuffer:WebGLRenderbuffer = this._gl.createRenderbuffer();
            this._gl.bindRenderbuffer( this._gl.RENDERBUFFER, renderBuffer );
            this._gl.renderbufferStorage(this._gl.RENDERBUFFER, this._gl.DEPTH_COMPONENT16, this._width, this._height);

            this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_2D, this._glTexture, 0);
            this._gl.framebufferRenderbuffer(this._gl.FRAMEBUFFER, this._gl.DEPTH_ATTACHMENT, this._gl.RENDERBUFFER, renderBuffer);

            this._gl.bindTexture( this._gl.TEXTURE_2D, null );
            this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, null);
            this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
        }

        public generateMipmaps()
        {
            //this._gl.bindTexture( this._gl.TEXTURE_2D, this._glTexture );
            //this._gl.generateMipmap(this._gl.TEXTURE_2D);
            //this._gl.bindTexture( this._gl.TEXTURE_2D, null );
        }
	}
}