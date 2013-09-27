///<reference path="../../_definitions.ts"/>

module away.render
{
	export class RenderBase
	{
		
		//TODO remove image render background stuff and provide a render target geometry
		
		public _pContext:away.display3D.Context3D;
		public _pStage3DProxy:away.managers.Stage3DProxy;
		
		public _pBackgroundR:number = 0;
		public _pBackgroundG:number = 0;
		public _pBackgroundB:number = 0;
		public _pBackgroundAlpha:number = 1;
		public _pShareContext:boolean = false;
		
		public _pRenderTarget:away.display3D.TextureBase;
		public _pRenderTargetSurface:number;
		
		// only used by renderers that need to render geometry to textures
		public _pViewWidth:number;
		public _pViewHeight:number;
		
		public _pRenderableSorter:away.sort.IEntitySorter;
		//private _backgroundImageRenderer:BackgroundImageRenderer;
		private _background:away.textures.Texture2DBase;
		
		public _pRenderToTexture:boolean;
		public _pAntiAlias:number;
		public _pTextureRatioX:number = 1;
		public _pTextureRatioY:number = 1;
		
		private _snapshotBitmapData:away.display.BitmapData;
		private _snapshotRequired:boolean;
		
		private _clearOnRender:boolean = true;
		public _pRttViewProjectionMatrix:away.geom.Matrix3D = new away.geom.Matrix3D();
		
		constructor( renderToTexture:boolean = false )
		{
			this._pRenderableSorter = new away.sort.RenderableMergeSort();
			this._pRenderToTexture = renderToTexture;
		}
		
		//@arcane
		public iCreateEntityCollector():away.traverse.EntityCollector
		{
			return new away.traverse.EntityCollector();
		}
		
		//@arcane
		public get iViewWidth():number
		{
			return this._pViewWidth;
		}
		
		//@arcane
		public set iViewWidth( value:number )
		{
			this._pViewWidth = value;
		}
		
		//@arcane
		public get iViewHeight():number
		{
			return this._pViewHeight;
		}
		
		//@arcane
		public set iViewHeight( value:number )
		{
			this._pViewHeight = value;
		}
		
		//@arcane
		public get iRenderToTexture():boolean
		{
			return this._pRenderToTexture;
		}
		
		public get renderableSorter():away.sort.IEntitySorter
		{
			return this._pRenderableSorter;
		}
		
		public set renderableSorter( value:away.sort.IEntitySorter )
		{
			this._pRenderableSorter = value;
		}
		
		//@arcane
		public get iClearOnRender():boolean
		{
			return this._clearOnRender;
		}
		
		//@arcane
		public set iClearOnRender(value:boolean)
		{
			this._clearOnRender = value;
		}
		
		//@arcane
		public get iBackgroundR():number
		{
			return this._pBackgroundR;
		}
		
		//@arcane
		public set iBackgroundR(value:number)
		{
			this._pBackgroundR = value;
		}
		
		//@arcane
		public get iBackgroundG():number
		{
			return this._pBackgroundG;
		}
		
		//@arcane
		public set iBackgroundG(value:number)
		{
			this._pBackgroundG = value;
		}
		
		//@arcane
		public get iBackgroundB():number
		{
			return this._pBackgroundB;
		}
		
		//@arcane
		public set iBackgroundB(value:number)
		{
			this._pBackgroundB = value;
		}
		
		//@arcane
		public get iStage3DProxy():away.managers.Stage3DProxy
		{
			return this._pStage3DProxy;
		}
		
		//@arcane
		public set iStage3DProxy( value:away.managers.Stage3DProxy )
		{
			if( value == this._pStage3DProxy )
			{
				return;
			}
			if(!value)
			{
				if( this._pStage3DProxy )
				{
					this._pStage3DProxy.removeEventListener( away.events.Stage3DEvent.CONTEXT3D_CREATED, this.onContextUpdate, this );
					this._pStage3DProxy.removeEventListener( away.events.Stage3DEvent.CONTEXT3D_RECREATED, this.onContextUpdate, this );
				}
				this._pStage3DProxy = null;
				this._pContext = null;
				return;
			}
			
			this._pStage3DProxy = value;
			this._pStage3DProxy.addEventListener( away.events.Stage3DEvent.CONTEXT3D_CREATED, this.onContextUpdate, this );
			this._pStage3DProxy.addEventListener( away.events.Stage3DEvent.CONTEXT3D_RECREATED, this.onContextUpdate, this );
			
			/*if( this._pBackgroundImageRenderer )
			{
				this._pBackgroundImageRenderer.stage3DProxy = value;
			}*/
			
			if( value.context3D )
			{
				this._pContext = value.context3D;
			}
		}
		
		//@arcane
		public get iShareContext():boolean
		{
			return this._pShareContext;
		}
		
		//@arcane
		public set iShareContext(value:boolean)
		{
			this._pShareContext = value;
		}
		
		//@arcane
		public iDispose():void
		{
			this._pStage3DProxy = null;
			/*
			if( this._pBackgroundImageRenderer )
			{
				this._pBackgroundImageRenderer.dispose();
				this._pBackgroundImageRenderer = null;
			}*/
		}
		
		//@arcane
		public iRender( entityCollector:away.traverse.EntityCollector, target:away.display3D.TextureBase = null, scissorRect:away.geom.Rectangle = null, surfaceSelector:number = 0 )
		{
			if( !this._pStage3DProxy || !this._pContext )
			{
				return;
			}
			
			this._pRttViewProjectionMatrix.copyFrom( entityCollector.camera.viewProjection);
			this._pRttViewProjectionMatrix.appendScale( this._pTextureRatioX, this._pTextureRatioY, 1);
			
			this.pExecuteRender( entityCollector, target, scissorRect, surfaceSelector );
			
			// clear buffers
			for( var i:number = 0; i < 8; ++i )
			{
				this._pContext.setVertexBufferAt( i, null );
				this._pContext.setTextureAt( i, null );
			}
		}
		
		public pExecuteRender( entityCollector:away.traverse.EntityCollector, target:away.display3D.TextureBase = null, scissorRect:away.geom.Rectangle = null, surfaceSelector:number = 0 )
		{
			this._pRenderTarget = target;
			this._pRenderTargetSurface = surfaceSelector;
			
			if( this._pRenderableSorter )
			{
				this._pRenderableSorter.sort(entityCollector);
			}
			if( this._pRenderToTexture )
			{
				this.pExecuteRenderToTexturePass(entityCollector);
			}
			
			this._pStage3DProxy.setRenderTarget( target, true, surfaceSelector );
			
			if ((target || !this._pShareContext) && this._clearOnRender)
			{
				this._pContext.clear( this._pBackgroundR, this._pBackgroundG, this._pBackgroundB, this._pBackgroundAlpha, 1, 0 );
			}
			this._pContext.setDepthTest(false, away.display3D.Context3DCompareMode.ALWAYS );
			this._pStage3DProxy.scissorRect = scissorRect;
			/*
			if( this._backgroundImageRenderer )
			{
				this._backgroundImageRenderer.render();
			}*/
			this.pDraw(entityCollector, target);
			
			//line required for correct rendering when using away3d with starling. DO NOT REMOVE UNLESS STARLING INTEGRATION IS RETESTED!
			this._pContext.setDepthTest( false, away.display3D.Context3DCompareMode.LESS_EQUAL );
			
			if( !this._pShareContext )
			{
				if( this._snapshotRequired && this._snapshotBitmapData) {
					this._pContext.drawToBitmapData( this._snapshotBitmapData );
					this._snapshotRequired = false;
				}
			}
			this._pStage3DProxy.scissorRect = null;
		}
		
		public queueSnapshot(bmd:away.display.BitmapData)
		{
			this._snapshotRequired = true;
			this._snapshotBitmapData = bmd;
		}
		
		public pExecuteRenderToTexturePass( entityCollector:away.traverse.EntityCollector )
		{
			throw new away.errors.AbstractMethodError();
		}
		
		public pDraw( entityCollector:away.traverse.EntityCollector, target:away.display3D.TextureBase )
		{
			throw new away.errors.AbstractMethodError();
		}
		
		private onContextUpdate(event:away.events.Event)
		{
			this._pContext = this._pStage3DProxy.context3D;
		}
		
		//@arcane
		public get iBackgroundAlpha():number
		{
			return this._pBackgroundAlpha;
		}
		
		//@arcane
		public set iBackgroundAlpha(value:number)
		{
			this._pBackgroundAlpha = value;
		}
		
		//@arcane
		public get iBackground():away.textures.Texture2DBase
		{
			return this._background;
		}
		
		//@arcane
		/*
		public set iBackground( value:away.textures.Texture2DBase )
		{
			if( this._backgroundImageRenderer && !value )
			{
				this._backgroundImageRenderer.dispose();
				this._backgroundImageRenderer = null;
			}
			
			if( !this._backgroundImageRenderer && value )
			{
				this._backgroundImageRenderer = new away.render.BackgroundImageRenderer( this._stage3DProxy );
			}
			this._background = value;
			
			if( this._backgroundImageRenderer )
			{
				this._backgroundImageRenderer.texture = value;
			}
		}*/
		
		/*
		public get backgroundImageRenderer():away.render.BackgroundImageRenderer
		{
			return this._backgroundImageRenderer;
		}*/
		
		public get antiAlias():number
		{
			return this._pAntiAlias;
		}
		
	}
}