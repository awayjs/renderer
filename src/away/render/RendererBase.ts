///<reference path="../_definitions.ts"/>

module away.render
{

	/**
	 * RendererBase forms an abstract base class for classes that are used in the rendering pipeline to render geometry
	 * to the back buffer or a texture.
	 */
	export class RendererBase
	{
		public _pContext:away.display3D.Context3D;
		public _pStage3DProxy:away.managers.Stage3DProxy;
		
		private _backgroundR:number = 0;
		private _backgroundG:number = 0;
		private _backgroundB:number = 0;
		private _backgroundAlpha:number = 1;
		private _shareContext:boolean = false;
		
		public _pRenderTarget:away.display3D.TextureBase;
		public _pRenderTargetSurface:number;
		
		// only used by renderers that need to render geometry to textures
		private _viewWidth:number;
		private _viewHeight:number;
		
		public _pRenderableSorter:away.sort.IEntitySorter;

		//private _backgroundImageRenderer:BackgroundImageRenderer;
		//private _background:Texture2DBase;
		
		private _renderToTexture:boolean;
		private _antiAlias:number;
		private _textureRatioX:number = 1;
		private _textureRatioY:number = 1;
		
		private _snapshotBitmapData:away.display.BitmapData;
		private _snapshotRequired:boolean;
		
		private _clearOnRender:boolean = true;
		public _pRttViewProjectionMatrix:away.geom.Matrix3D = new away.geom.Matrix3D();

		
		/**
		 * Creates a new RendererBase object.
		 */
		constructor(renderToTexture:boolean = false)
		{
			this._pRenderableSorter = new away.sort.RenderableMergeSort();
			this._renderToTexture = renderToTexture;
		}
		
		public iCreateEntityCollector():away.traverse.EntityCollector
		{
			return new away.traverse.EntityCollector();
		}
		
		public get iViewWidth():number
		{
			return this._viewWidth;
		}
		
		public set iViewWidth(value:number)
		{
			this._viewWidth = value;
		}
		
		public get iViewHeight():number
		{
			return this._viewHeight;
		}
		
		public set iViewHeight(value:number)
		{
			this._viewHeight = value;
		}
		
		public get iRenderToTexture():boolean
		{
			return this._renderToTexture;
		}
		
		public get renderableSorter():away.sort.IEntitySorter
		{
			return this._pRenderableSorter;
		}
		
		public set renderableSorter(value:away.sort.IEntitySorter)
		{
			this._pRenderableSorter = value;
		}
		
		public get iClearOnRender():boolean
		{
			return this._clearOnRender;
		}
		
		public set iClearOnRender(value:boolean)
		{
			this._clearOnRender = value;
		}
		
		/**
		 * The background color's red component, used when clearing.
		 *
		 * @private
		 */
		public get iBackgroundR():number
		{
			return this._backgroundR;
		}
		
		public set iBackgroundR(value:number)
		{
			this._backgroundR = value;
		}
		
		/**
		 * The background color's green component, used when clearing.
		 *
		 * @private
		 */
		public get iBackgroundG():number
		{
			return this._backgroundG;
		}
		
		public set iBackgroundG(value:number)
		{
			this._backgroundG = value;
		}
		
		/**
		 * The background color's blue component, used when clearing.
		 *
		 * @private
		 */
		public get iBackgroundB():number
		{
			return this._backgroundB;
		}
		
		public set iBackgroundB(value:number)
		{
			this._backgroundB = value;
		}
		
		/**
		 * The Stage3DProxy that will provide the Context3D used for rendering.
		 *
		 * @private
		 */
		public get iStage3DProxy():away.managers.Stage3DProxy
		{
			return this._pStage3DProxy;
		}
		
		public set iStage3DProxy(value:away.managers.Stage3DProxy)
		{

            this.iSetStage3DProxy( value );

		}

        public iSetStage3DProxy( value:away.managers.Stage3DProxy)
        {

            if (value == this._pStage3DProxy)
            {

                return;

            }


            if (!value)
            {

                if (this._pStage3DProxy)
                {

                    this._pStage3DProxy.removeEventListener(away.events.Stage3DEvent.CONTEXT3D_CREATED, this.onContextUpdate , this );
                    this._pStage3DProxy.removeEventListener(away.events.Stage3DEvent.CONTEXT3D_RECREATED, this.onContextUpdate , this );

                }

                this._pStage3DProxy = null;
                this._pContext = null;

                return;
            }

            //else if (_pStage3DProxy) throw new Error("A Stage3D instance was already assigned!");

            this._pStage3DProxy = value;
            this._pStage3DProxy.addEventListener(away.events.Stage3DEvent.CONTEXT3D_CREATED, this.onContextUpdate , this );
            this._pStage3DProxy.addEventListener(away.events.Stage3DEvent.CONTEXT3D_RECREATED, this.onContextUpdate , this );

            /*
             if (_backgroundImageRenderer)
             _backgroundImageRenderer.stage3DProxy = value;
             */
            if (value.context3D)
                this._pContext = value.context3D;

        }
		
		/**
		 * Defers control of Context3D clear() and present() calls to Stage3DProxy, enabling multiple Stage3D frameworks
		 * to share the same Context3D object.
		 *
		 * @private
		 */
		public get iShareContext():boolean
		{
			return this._shareContext;
		}
		
		public set iShareContext(value:boolean)
		{
			this._shareContext = value;
		}
		
		/**
		 * Disposes the resources used by the RendererBase.
		 *
		 * @private
		 */
		public iDispose()
		{
			this._pStage3DProxy = null;

            /*
			if (_backgroundImageRenderer) {
				_backgroundImageRenderer.dispose();
				_backgroundImageRenderer = null;
			}
			*/
		}
		
		/**
		 * Renders the potentially visible geometry to the back buffer or texture.
		 * @param entityCollector The EntityCollector object containing the potentially visible geometry.
		 * @param target An option target texture to render to.
		 * @param surfaceSelector The index of a CubeTexture's face to render to.
		 * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
		 */
		public iRender(entityCollector:away.traverse.EntityCollector, target:away.display3D.TextureBase = null, scissorRect:away.geom.Rectangle = null, surfaceSelector:number = 0)
		{
			if (!this._pStage3DProxy || !this._pContext)
            {

                return;


            }

			
			this._pRttViewProjectionMatrix.copyFrom(entityCollector.camera.viewProjection);
            this._pRttViewProjectionMatrix.appendScale(this._textureRatioX, this._textureRatioY, 1);

            this.pExecuteRender(entityCollector, target, scissorRect, surfaceSelector);
			
			// clear buffers
			
			for (var i:number = 0; i < 8; ++i)
            {

				this._pContext.setVertexBufferAt(i, null);
                this._pContext.setTextureAt(i, null);

			}
		}
		
		/**
		 * Renders the potentially visible geometry to the back buffer or texture. Only executed if everything is set up.
		 * @param entityCollector The EntityCollector object containing the potentially visible geometry.
		 * @param target An option target texture to render to.
		 * @param surfaceSelector The index of a CubeTexture's face to render to.
		 * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
		 */
		public pExecuteRender(entityCollector:away.traverse.EntityCollector, target:away.display3D.TextureBase = null, scissorRect:away.geom.Rectangle = null, surfaceSelector:number = 0)
		{
			this._pRenderTarget = target;
			this._pRenderTargetSurface = surfaceSelector;
			
			if (this._pRenderableSorter)
            {

                this._pRenderableSorter.sort(entityCollector);

            }

			
			if (this._renderToTexture){

                this.pExecuteRenderToTexturePass(entityCollector);

            }

			this._pStage3DProxy.setRenderTarget(target, true, surfaceSelector);
			
			if ((target || !this._shareContext) && this._clearOnRender)
            {

               this. _pContext.clear(this._backgroundR, this._backgroundG, this._backgroundB, this._backgroundAlpha, 1, 0);

            }

			this._pContext.setDepthTest(false, away.display3D.Context3DCompareMode.ALWAYS);

			this._pStage3DProxy.scissorRect = scissorRect;

            /*
			if (_backgroundImageRenderer)
				_backgroundImageRenderer.render();
			*/

			this.pDraw(entityCollector, target);
			
			//line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
			this._pContext.setDepthTest(false, away.display3D.Context3DCompareMode.LESS_EQUAL);
			
			if (!this._shareContext)
            {

				if (this._snapshotRequired && this._snapshotBitmapData)
                {

                    this._pContext.drawToBitmapData(this._snapshotBitmapData);
                    this._snapshotRequired = false;

				}

			}
            this._pStage3DProxy.scissorRect = null;
		}
		
		/*
		 * Will draw the renderer's output on next render to the provided bitmap data.
		 * */
		public queueSnapshot(bmd:away.display.BitmapData)
		{
			this._snapshotRequired = true;
            this._snapshotBitmapData = bmd;
		}
		
		public pExecuteRenderToTexturePass(entityCollector:away.traverse.EntityCollector)
		{
			throw new away.errors.AbstractMethodError();
		}
		
		/**
		 * Performs the actual drawing of geometry to the target.
		 * @param entityCollector The EntityCollector object containing the potentially visible geometry.
		 */
		public pDraw(entityCollector:away.traverse.EntityCollector, target:away.display3D.TextureBase)
		{
            throw new away.errors.AbstractMethodError();
		}
		
		/**
		 * Assign the context once retrieved
		 */
		private onContextUpdate(event:Event)
		{
			this._pContext = this._pStage3DProxy.context3D;
		}
		
		public get iBackgroundAlpha():number
		{
			return this._backgroundAlpha;
		}
		
		public set iBackgroundAlpha(value:number)
		{
			this._backgroundAlpha = value;
		}

        /*
		public get iBackground():away.textures.Texture2DBase
		{
			return this._background;
		}
		*/

        /*
		public set iBackground(value:away.textures.Texture2DBase)
		{
			if (this._backgroundImageRenderer && !value) {
                this._backgroundImageRenderer.dispose();
                this._backgroundImageRenderer = null;
			}
			
			if (!this._backgroundImageRenderer && value)
            {

                this._backgroundImageRenderer = new BackgroundImageRenderer(this._pStage3DProxy);

            }

			
			this._background = value;
			
			if (this._backgroundImageRenderer)
                this._backgroundImageRenderer.texture = value;
		}
		*/
		/*
		public get backgroundImageRenderer():BackgroundImageRenderer
		{
			return _backgroundImageRenderer;
		}
		*/

		public get antiAlias():number
		{
			return this._antiAlias;
		}
		
		public set antiAlias(antiAlias:number)
		{
            this._antiAlias = antiAlias;
		}
		
		public get iTextureRatioX():number
		{
			return this._textureRatioX;
		}
		
		public set iTextureRatioX(value:number)
		{
			this._textureRatioX = value;
		}
		
		public get iTextureRatioY():number
		{
			return this._textureRatioY;
		}
		
		public set iTextureRatioY(value:number)
		{
			this._textureRatioY = value;
		}

	}
}
