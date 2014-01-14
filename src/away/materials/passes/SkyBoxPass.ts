///<reference path="../../_definitions.ts"/>

module away.materials
{

	/**
	 * SkyBoxPass provides a material pass exclusively used to render sky boxes from a cube texture.
	 */
	export class SkyBoxPass extends away.materials.MaterialPassBase
	{
		private _cubeTexture:away.textures.CubeTextureBase;
		private _vertexData:number[];

		/**
		 * Creates a new SkyBoxPass object.
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
		public get cubeTexture():away.textures.CubeTextureBase
		{
			return this._cubeTexture;
		}

		public set cubeTexture(value:away.textures.CubeTextureBase)
		{
			this._cubeTexture = value;
		}

		/**
		 * @inheritDoc
		 */
		public iGetVertexCode():string
		{
			return "mul vt0, va0, vc5		\n" + "add vt0, vt0, vc4		\n" + "m44 op, vt0, vc0		\n" + "mov v0, va0\n";
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(animationCode:string):string
		{
			var format:string;
			switch (this._cubeTexture.format) {
				case away.displayGL.ContextGLTextureFormat.COMPRESSED:
					format = "dxt1,";
					break;
				case "compressedAlpha":
					format = "dxt5,";
					break;
				default:
					format = "";
			}

			var mip:string = ",mipnone";

			if (this._cubeTexture.hasMipMaps) {
				mip = ",miplinear";
			}
			return "tex ft0, v0, fs0 <cube," + format + "linear,clamp" + mip + ">	\n" + "mov oc, ft0							\n";
		}

		/**
		 * @inheritDoc
		 */
		public iRender(renderable:away.base.IRenderable, stageGLProxy:away.managers.StageGLProxy, camera:away.cameras.Camera3D, viewProjection:away.geom.Matrix3D)
		{
			var context:away.displayGL.ContextGL = stageGLProxy._iContextGL;
			var pos:away.geom.Vector3D = camera.scenePosition;
			this._vertexData[0] = pos.x;
			this._vertexData[1] = pos.y;
			this._vertexData[2] = pos.z;
			this._vertexData[4] = this._vertexData[5] = this._vertexData[6] = camera.lens.far/Math.sqrt(3);
			context.setProgramConstantsFromMatrix(away.displayGL.ContextGLProgramType.VERTEX, 0, viewProjection, true);
			context.setProgramConstantsFromArray(away.displayGL.ContextGLProgramType.VERTEX, 4, this._vertexData, 2);
			renderable.activateVertexBuffer(0, stageGLProxy);
			context.drawTriangles(renderable.getIndexBuffer(stageGLProxy), 0, renderable.numTriangles);
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(stageGLProxy:away.managers.StageGLProxy, camera:away.cameras.Camera3D)
		{
			super.iActivate(stageGLProxy, camera);
			var context:away.displayGL.ContextGL = stageGLProxy._iContextGL;
			context.setSamplerStateAt(0, away.displayGL.ContextGLWrapMode.CLAMP, away.displayGL.ContextGLTextureFilter.LINEAR, this._cubeTexture.hasMipMaps? away.displayGL.ContextGLMipFilter.MIPLINEAR : away.displayGL.ContextGLMipFilter.MIPNONE);
			context.setDepthTest(false, away.displayGL.ContextGLCompareMode.LESS);
			context.setTextureAt(0, this._cubeTexture.getTextureForStageGL(stageGLProxy));
		}
	}
}
