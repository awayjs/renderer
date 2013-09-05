///<reference path="../_definitions.ts"/>

module away.textures
{
	export class HTMLImageElementCubeTexture extends CubeTextureBase
	{

		private _bitmapDatas:Array<HTMLImageElement>;
        private _useMipMaps : boolean = false;

		constructor(posX:HTMLImageElement, negX:HTMLImageElement,
                    posY:HTMLImageElement, negY:HTMLImageElement,
                    posZ:HTMLImageElement, negZ:HTMLImageElement)
		{
			super();
			
			this._bitmapDatas = new Array<HTMLImageElement>(6);
			this.testSize(this._bitmapDatas[0] = posX);
            this.testSize(this._bitmapDatas[1] = negX);
            this.testSize(this._bitmapDatas[2] = posY);
            this.testSize(this._bitmapDatas[3] = negY);
            this.testSize(this._bitmapDatas[4] = posZ);
            this.testSize(this._bitmapDatas[5] = negZ);
			
			this.pSetSize(posX.width, posX.height);
		}
		
		/**
		 * The texture on the cube's right face.
		 */
		public get positiveX():HTMLImageElement
		{
			return this._bitmapDatas[0];
		}
		
		public set positiveX(value:HTMLImageElement)
		{
			this.testSize(value);
			this.invalidateContent();
			this.pSetSize(value.width, value.height);
			this._bitmapDatas[0] = value;
		}
		
		/**
		 * The texture on the cube's left face.
		 */
		public get negativeX():HTMLImageElement
		{
			return this._bitmapDatas[1];
		}
		
		public set negativeX(value:HTMLImageElement)
		{
			this.testSize(value);
            this.invalidateContent();
            this.pSetSize(value.width, value.height);
            this._bitmapDatas[1] = value;
		}
		
		/**
		 * The texture on the cube's top face.
		 */
		public get positiveY():HTMLImageElement
		{
			return this._bitmapDatas[2];
		}
		
		public set positiveY(value:HTMLImageElement)
		{
            this.testSize(value);
            this.invalidateContent();
            this.pSetSize(value.width, value.height);
            this._bitmapDatas[2] = value;
		}
		
		/**
		 * The texture on the cube's bottom face.
		 */
		public get negativeY():HTMLImageElement
		{
			return this._bitmapDatas[3];
		}
		
		public set negativeY(value:HTMLImageElement)
		{
            this.testSize(value);
            this.invalidateContent();
            this.pSetSize(value.width, value.height);
            this._bitmapDatas[3] = value;
		}
		
		/**
		 * The texture on the cube's far face.
		 */
		public get positiveZ():HTMLImageElement
		{
			return this._bitmapDatas[4];
		}
		
		public set positiveZ(value:HTMLImageElement)
		{
            this.testSize(value);
            this.invalidateContent();
            this.pSetSize(value.width, value.height);
            this._bitmapDatas[4] = value;
		}
		
		/**
		 * The texture on the cube's near face.
		 */
		public get negativeZ():HTMLImageElement
		{
			return this._bitmapDatas[5];
		}
		
		public set negativeZ(value:HTMLImageElement)
		{
            this.testSize(value);
            this.invalidateContent();
            this.pSetSize(value.width, value.height);
            this._bitmapDatas[5] = value;
		}
		
		private testSize(value:HTMLImageElement):void
		{
			if (value.width != value.height)
				throw new Error("BitmapData should have equal width and height!");
			if (!away.utils.TextureUtils.isHTMLImageElementValid(value))
				throw new Error("Invalid bitmapData: Width and height must be power of 2 and cannot exceed 2048");
		}
		
		public pUploadContent(texture:away.display3D.TextureBase):void
		{
			for (var i:number = 0; i < 6; ++i)
            {
                if ( this._useMipMaps )
                {

                    //away.materials.MipmapGenerator.generateMipMaps(this._bitmapDatas[i], texture, null, false, i);

                }
                else
                {

                    var tx : away.display3D.CubeTexture = <any> texture;
                        tx.uploadFromHTMLImageElement( this._bitmapDatas[i] , i , 0 );

                }


            }
		}
	}
}
