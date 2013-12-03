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
				case away.display3D.Context3DTextureFormat.COMPRESSED:
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
		public iRender(renderable:away.base.IRenderable, stage3DProxy:away.managers.Stage3DProxy, camera:away.cameras.Camera3D, viewProjection:away.geom.Matrix3D)
		{
			var context:away.display3D.Context3D = stage3DProxy._iContext3D;
			var pos:away.geom.Vector3D = camera.scenePosition;
			this._vertexData[0] = pos.x;
			this._vertexData[1] = pos.y;
			this._vertexData[2] = pos.z;
			this._vertexData[4] = this._vertexData[5] = this._vertexData[6] = camera.lens.far/Math.sqrt(3);
			context.setProgramConstantsFromMatrix(away.display3D.Context3DProgramType.VERTEX, 0, viewProjection, true);
			context.setProgramConstantsFromArray(away.display3D.Context3DProgramType.VERTEX, 4, this._vertexData, 2);
			renderable.activateVertexBuffer(0, stage3DProxy);
			context.drawTriangles(renderable.getIndexBuffer(stage3DProxy), 0, renderable.numTriangles);
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(stage3DProxy:away.managers.Stage3DProxy, camera:away.cameras.Camera3D)
		{
			super.iActivate(stage3DProxy, camera);
			var context:away.display3D.Context3D = stage3DProxy._iContext3D;
			context.setSamplerStateAt(0, away.display3D.Context3DWrapMode.CLAMP, away.display3D.Context3DTextureFilter.LINEAR, this._cubeTexture.hasMipMaps? away.display3D.Context3DMipFilter.MIPLINEAR : away.display3D.Context3DMipFilter.MIPNONE);
			context.setDepthTest(false, away.display3D.Context3DCompareMode.LESS);
			context.setTextureAt(0, this._cubeTexture.getTextureForStage3D(stage3DProxy));
		}
	}
}
