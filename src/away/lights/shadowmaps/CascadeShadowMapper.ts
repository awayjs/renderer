

module away.lights
{
	import Camera					= away.entities.Camera;
	import FreeMatrixProjection		= away.projections.FreeMatrixProjection;
	import IProjection				= away.projections.IProjection;
	import Scene					= away.containers.Scene;
	import Matrix3DUtils			= away.geom.Matrix3DUtils;
	import DepthRenderer			= away.render.DepthRenderer;
	
	import ITextureBase				= away.stagegl.ITextureBase;
//	import Event					= away.events.Event;
	import EventDispatcher			= away.events.EventDispatcher;
	import IEventDispatcher			= away.events.IEventDispatcher;
	import Matrix3D					= away.geom.Matrix3D;
	import Rectangle				= away.geom.Rectangle;
	
	export class CascadeShadowMapper extends DirectionalShadowMapper implements away.events.IEventDispatcher
	{
		public _pScissorRects:Rectangle[];
		private _pScissorRectsInvalid:boolean = true;
		private _splitRatios:number[];
		
		private _numCascades:number /*int*/;
		private _depthCameras:Array<Camera>;
		private _depthLenses:Array<FreeMatrixProjection>;
		
		private _texOffsetsX:Array<number>;
		private _texOffsetsY:Array<number>;
		
		private _changeDispatcher:EventDispatcher;
		private _nearPlaneDistances:number[];
		
		constructor(numCascades:number /*uint*/ = 3)
		{
			super();

			if (numCascades < 1 || numCascades > 4)
				throw new Error("numCascades must be an integer between 1 and 4");

			this._numCascades = numCascades;
			this._changeDispatcher = new EventDispatcher(this);
			this.init();
		}
		
		public getSplitRatio(index:number /*uint*/):number
		{
			return this._splitRatios[index];
		}
		
		public setSplitRatio(index:number /*uint*/, value:number)
		{
			if (value < 0)
				value = 0;
			else if (value > 1)
				value = 1;
			
			if (index >= this._numCascades)
				throw new Error("index must be smaller than the number of cascades!");
			
			this._splitRatios[index] = value;
		}
		
		public getDepthProjections(partition:number /*uint*/):Matrix3D
		{
			return this._depthCameras[partition].viewProjection;
		}
		
		private init()
		{
			this._splitRatios = new Array<number>(this._numCascades);
			this._nearPlaneDistances = new Array<number>(this._numCascades);
			
			var s:number = 1;
			for (var i:number /*int*/ = this._numCascades - 1; i >= 0; --i) {
				this._splitRatios[i] = s;
				s *= .4;
			}
			
			this._texOffsetsX = Array<number>(-1, 1, -1, 1);
			this._texOffsetsY = Array<number>(1, 1, -1, -1);
			this._pScissorRects = new Array<Rectangle>(4);
			this._depthLenses = new Array<FreeMatrixProjection>();
			this._depthCameras = new Array<Camera>();
			
			for (i = 0; i < this._numCascades; ++i) {
				this._depthLenses[i] = new FreeMatrixProjection();
				this._depthCameras[i] = new Camera(this._depthLenses[i]);
			}
		}

		public _pSetDepthMapSize(value:number /*uint*/)
		{
			super._pSetDepthMapSize(value);

			this.invalidateScissorRects();
		}
		
		private invalidateScissorRects()
		{
			this._pScissorRectsInvalid = true;
		}
		
		public get numCascades():number /*int*/
		{
			return this._numCascades;
		}
		
		public set numCascades(value:number /*int*/)
		{
			if (value == this._numCascades)
				return;
			if (value < 1 || value > 4)
				throw new Error("numCascades must be an integer between 1 and 4");
			this._numCascades = value;
			this.invalidateScissorRects();
			this.init();
			this.dispatchEvent(new away.events.Event(away.events.Event.CHANGE));
		}
		
		public pDrawDepthMap(target:away.textures.RenderTexture, scene:Scene, renderer:DepthRenderer)
		{
			if (this._pScissorRectsInvalid)
				this.updateScissorRects();
			
			this._pCasterCollector.cullPlanes = this._pCullPlanes;
			this._pCasterCollector.camera = this._pOverallDepthCamera;
			this._pCasterCollector.clear();
			scene.traversePartitions(this._pCasterCollector);
			
			renderer.iRenderCascades(this._pCasterCollector, target, this._numCascades, this._pScissorRects, this._depthCameras);
		}
		
		private updateScissorRects()
		{
			var half:number = this._pDepthMapSize*.5;
			
			this._pScissorRects[0] = new Rectangle(0, 0, half, half);
			this._pScissorRects[1] = new Rectangle(half, 0, half, half);
			this._pScissorRects[2] = new Rectangle(0, half, half, half);
			this._pScissorRects[3] = new Rectangle(half, half, half, half);
			
			this._pScissorRectsInvalid = false;
		}
		
		public pUpdateDepthProjection(viewCamera:Camera)
		{
			var matrix:Matrix3D;
			var projection:IProjection = viewCamera.projection;
			var projectionNear:number = projection.near;
			var projectionRange:number = projection.far - projectionNear;
			
			this.pUpdateProjectionFromFrustumCorners(viewCamera, viewCamera.projection.frustumCorners, this._pMatrix);
			this._pMatrix.appendScale(.96, .96, 1);
			this._pOverallDepthProjection.matrix = this._pMatrix;
			this.pUpdateCullPlanes(viewCamera);
			
			for (var i:number /*int*/ = 0; i < this._numCascades; ++i) {
				matrix = this._depthLenses[i].matrix;
				
				this._nearPlaneDistances[i] = projectionNear + this._splitRatios[i]*projectionRange;
				this._depthCameras[i].transform = this._pOverallDepthCamera.transform;
				
				this.updateProjectionPartition(matrix, this._splitRatios[i], this._texOffsetsX[i], this._texOffsetsY[i]);
				
				this._depthLenses[i].matrix = matrix;
			}
		}
		
		private updateProjectionPartition(matrix:Matrix3D, splitRatio:number, texOffsetX:number, texOffsetY:number)
		{
			var raw:Array<number> = Matrix3DUtils.RAW_DATA_CONTAINER;
			var xN:number, yN:number, zN:number;
			var xF:number, yF:number, zF:number;
			var minX:number = Number.POSITIVE_INFINITY, minY:number = Number.POSITIVE_INFINITY, minZ:number;
			var maxX:number = Number.NEGATIVE_INFINITY, maxY:number = Number.NEGATIVE_INFINITY, maxZ:number = Number.NEGATIVE_INFINITY;
			var i:number /*uint*/ = 0;
			
			while (i < 12) {
				xN = this._pLocalFrustum[i];
				yN = this._pLocalFrustum[i + 1];
				zN = this._pLocalFrustum[i + 2];
				xF = xN + (this._pLocalFrustum[i + 12] - xN)*splitRatio;
				yF = yN + (this._pLocalFrustum[i + 13] - yN)*splitRatio;
				zF = zN + (this._pLocalFrustum[i + 14] - zN)*splitRatio;
				if (xN < minX)
					minX = xN;
				if (xN > maxX)
					maxX = xN;
				if (yN < minY)
					minY = yN;
				if (yN > maxY)
					maxY = yN;
				if (zN > maxZ)
					maxZ = zN;
				if (xF < minX)
					minX = xF;
				if (xF > maxX)
					maxX = xF;
				if (yF < minY)
					minY = yF;
				if (yF > maxY)
					maxY = yF;
				if (zF > maxZ)
					maxZ = zF;
				i += 3;
			}
			
			minZ = 1;
			
			var w:number = (maxX - minX);
			var h:number = (maxY - minY);
			var d:number = 1/(maxZ - minZ);
			
			if (minX < 0)
				minX -= this._pSnap; // because int() rounds up for < 0
			if (minY < 0)
				minY -= this._pSnap;
			minX = Math.floor(minX/this._pSnap)*this._pSnap;
			minY = Math.floor(minY/this._pSnap)*this._pSnap;
			
			var snap2:number = 2*this._pSnap;
			w = Math.floor(w/snap2 + 1)*snap2;
			h = Math.floor(h/snap2 + 1)*snap2;
			
			maxX = minX + w;
			maxY = minY + h;
			
			w = 1/w;
			h = 1/h;
			
			raw[0] = 2*w;
			raw[5] = 2*h;
			raw[10] = d;
			raw[12] = -(maxX + minX)*w;
			raw[13] = -(maxY + minY)*h;
			raw[14] = -minZ*d;
			raw[15] = 1;
			raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[11] = 0;
			
			matrix.copyRawDataFrom(raw);
			matrix.appendScale(.96, .96, 1);
			matrix.appendTranslation(texOffsetX, texOffsetY, 0);
			matrix.appendScale(.5, .5, 1);
		}
		
		public addEventListener(type:string, listener:Function)
		{
			this._changeDispatcher.addEventListener(type, listener);
		}
		
		public removeEventListener(type:string, listener:Function)
		{
			this._changeDispatcher.removeEventListener(type, listener);
		}
		
		public dispatchEvent(event:away.events.Event)
		{
			return this._changeDispatcher.dispatchEvent(event);
		}
		
		public hasEventListener(type:string):boolean
		{
			return this._changeDispatcher.hasEventListener(type);
		}
		
		get _iNearPlaneDistances():Array<number>
		{
			return this._nearPlaneDistances;
		}
	}
}
