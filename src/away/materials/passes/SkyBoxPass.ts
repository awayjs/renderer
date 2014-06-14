///<reference path="../../_definitions.ts"/>

module away.materials
{
	import TriangleSubGeometry						= away.base.TriangleSubGeometry;
	import StageGL									= away.base.StageGL;
	import Camera									= away.entities.Camera;
	import Matrix3D									= away.geom.Matrix3D;
	import Vector3D									= away.geom.Vector3D;
	import RenderableBase							= away.pool.RenderableBase;
	import IContext									= away.stagegl.IContext;
	import ContextGLCompareMode						= away.stagegl.ContextGLCompareMode;
	import ContextGLMipFilter						= away.stagegl.ContextGLMipFilter;
	import ContextGLProgramType						= away.stagegl.ContextGLProgramType;
	import ContextGLTextureFilter					= away.stagegl.ContextGLTextureFilter;
	import ContextGLTextureFormat					= away.stagegl.ContextGLTextureFormat;
	import ContextGLWrapMode						= away.stagegl.ContextGLWrapMode;
	import CubeTextureBase							= away.textures.CubeTextureBase;
	
	/**
	 * SkyboxPass provides a material pass exclusively used to render sky boxes from a cube texture.
	 */
	export class SkyboxPass extends MaterialPassBase
	{
		private _cubeTexture:CubeTextureBase;
		private _vertexData:Array<number>;

		/**
		 * Creates a new SkyboxPass object.
		 */
		constructor()
		{
			super();

			this.mipmap = false;
			this._pNumUsedTextures = 1;
			this._vertexData = new Array<number>(0, 0, 0, 0, 1, 1, 1, 1);
		}

		/**
		 * The cube texture to use as the skybox.
		 */
		public get cubeTexture():CubeTextureBase
		{
			return this._cubeTexture;
		}

		public set cubeTexture(value:CubeTextureBase)
		{
			this._cubeTexture = value;
		}

		/**
		 * @inheritDoc
		 */
		public iGetVertexCode():string
		{
			return "mul vt0, va0, vc5\n" +
				"add vt0, vt0, vc4\n" +
				"m44 op, vt0, vc0\n" +
				"mov v0, va0\n";
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(animationCode:string):string
		{
			var format:string;
			switch (this._cubeTexture.format) {
				case ContextGLTextureFormat.COMPRESSED:
					format = "dxt1,";
					break;
				case "compressedAlpha":
					format = "dxt5,";
					break;
				default:
					format = "";
			}

			var mip:string = ",mipnone";

			if (this._cubeTexture.hasMipmaps)
				mip = ",miplinear";

			return "tex ft0, v0, fs0 <cube," + format + "linear,clamp" + mip + ">\n" +
				"mov oc, ft0\n";
		}

		/**
		 * @inheritDoc
		 */
		public iRender(renderable:RenderableBase, stageGL:StageGL, camera:Camera, viewProjection:Matrix3D)
		{
			var context:IContext = stageGL.contextGL;
			var pos:Vector3D = camera.scenePosition;
			this._vertexData[0] = pos.x;
			this._vertexData[1] = pos.y;
			this._vertexData[2] = pos.z;
			this._vertexData[4] = this._vertexData[5] = this._vertexData[6] = camera.projection.far/Math.sqrt(3);
			context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, viewProjection, true);
			context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 4, this._vertexData, 2);

			stageGL.activateBuffer(0, renderable.getVertexData(TriangleSubGeometry.POSITION_DATA), renderable.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);
			context.drawTriangles(stageGL.getIndexBuffer(renderable.getIndexData()), 0, renderable.numTriangles);
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(stageGL:StageGL, camera:Camera)
		{
			super.iActivate(stageGL, camera);
			var context:IContext = stageGL.contextGL;
			context.setSamplerStateAt(0, ContextGLWrapMode.CLAMP, ContextGLTextureFilter.LINEAR, this._cubeTexture.hasMipmaps? ContextGLMipFilter.MIPLINEAR : ContextGLMipFilter.MIPNONE);
			context.setDepthTest(false, ContextGLCompareMode.LESS);
			this._cubeTexture.activateTextureForStage(0, stageGL);
		}
	}
}
