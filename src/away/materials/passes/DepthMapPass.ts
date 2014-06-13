///<reference path="../../_definitions.ts"/>

module away.materials
{
	import SubGeometry								= away.base.TriangleSubGeometry;

	/**
	 * DepthMapPass is a pass that writes depth values to a depth map as a 32-bit value exploded over the 4 texture channels.
	 * This is used to render shadow maps, depth maps, etc.
	 */
	export class DepthMapPass extends MaterialPassBase
	{
		private _data:Array<number>;
		private _alphaThreshold:number = 0;
		private _alphaMask:away.textures.Texture2DBase;

		/**
		 * Creates a new DepthMapPass object.
		 */
		constructor()
		{
			super();

			this._data = new Array<number>(1.0, 255.0, 65025.0, 16581375.0, 1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0, 0.0, 0.0, 0.0, 0.0);
		}

		/**
		 * The minimum alpha value for which pixels should be drawn. This is used for transparency that is either
		 * invisible or entirely opaque, often used with textures for foliage, etc.
		 * Recommended values are 0 to disable alpha, or 0.5 to create smooth edges. Default value is 0 (disabled).
		 */
		public get alphaThreshold():number
		{
			return this._alphaThreshold;
		}

		public set alphaThreshold(value:number)
		{
			if (value < 0)
				value = 0;
			else if (value > 1)
				value = 1;

			if (value == this._alphaThreshold)
				return;

			if (value == 0 || this._alphaThreshold == 0)
				this.iInvalidateShaderProgram();

			this._alphaThreshold = value;
			this._data[8] = this._alphaThreshold;

		}

		/**
		 * A texture providing alpha data to be able to prevent semi-transparent pixels to write to the alpha mask.
		 * Usually the diffuse texture when alphaThreshold is used.
		 */
		public get alphaMask():away.textures.Texture2DBase
		{
			return this._alphaMask;
		}

		public set alphaMask(value:away.textures.Texture2DBase)
		{
			this._alphaMask = value;
		}

		/**
		 * @inheritDoc
		 */
		public iGetVertexCode():string
		{
			var code:string = "";
			// project

			//TODO: AGAL <> GLSL conversion

			code = "m44 vt1, vt0, vc0\n" +
				   "mov op, vt1\n";

			if (this._alphaThreshold > 0) {
				this._pNumUsedTextures = 1;
				this._pNumUsedStreams = 2;
				code += "mov v0, vt1\n" +
					    "mov v1, va1\n";
			} else {
				this._pNumUsedTextures = 0;
				this._pNumUsedStreams = 1;
				code += "mov v0, vt1\n";
			}

			return code;
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(code:string):string
		{
			var wrap:string = this._pRepeat? "wrap" : "clamp";
			var filter:string;

			if (this._pSmooth)
				filter = this._pMipmap? "linear,miplinear" : "linear";
			else
				filter = this._pMipmap? "nearest,mipnearest" : "nearest";

			// TODO: AGAL<>GLSL

			var codeF:string = "div ft2, v0, v0.w\n" + //"sub ft2.z, fc0.x, ft2.z\n" +    //invert
							   "mul ft0, fc0, ft2.z\n" +
							   "frc ft0, ft0\n" +
							   "mul ft1, ft0.yzww, fc1\n";

			//codeF += "mov ft1.w, fc1.w	\n" +
			//    "mov ft0.w, fc0.x	\n";

			if (this._alphaThreshold > 0) {

				var format:string;

				switch (this._alphaMask.format) {
					case away.stagegl.ContextGLTextureFormat.COMPRESSED:
						format = "dxt1,";
						break;

					case "compressedAlpha":
						format = "dxt5,";
						break;

					default:
						format = "";
				}

				codeF += "tex ft3, v1, fs0 <2d," + filter + "," + format + wrap + ">\n" + "sub ft3.w, ft3.w, fc2.x\n" + "kil ft3.w\n";
			}

			codeF += "sub oc, ft0, ft1		\n";

			return codeF;
		}

		/**
		 * @inheritDoc
		 */
		public iRender(renderable:away.pool.RenderableBase, stageGL:away.base.StageGL, camera:away.entities.Camera, viewProjection:away.geom.Matrix3D)
		{
			if (this._alphaThreshold > 0)
				stageGL.activateBuffer(1, renderable.getVertexData(SubGeometry.UV_DATA), renderable.getVertexOffset(SubGeometry.UV_DATA), SubGeometry.UV_FORMAT);


			var context:away.stagegl.IContext = stageGL.contextGL;
			var matrix:away.geom.Matrix3D = away.geom.Matrix3DUtils.CALCULATION_MATRIX;

			matrix.copyFrom(renderable.sourceEntity.getRenderSceneTransform(camera));
			matrix.append(viewProjection);
			context.setProgramConstantsFromMatrix(away.stagegl.ContextGLProgramType.VERTEX, 0, matrix, true);

			stageGL.activateBuffer(0, renderable.getVertexData(SubGeometry.POSITION_DATA),  renderable.getVertexOffset(SubGeometry.POSITION_DATA), SubGeometry.POSITION_FORMAT);
			context.drawTriangles(stageGL.getIndexBuffer(renderable.getIndexData()), 0, renderable.numTriangles);

		}

		/**
		 * @inheritDoc
		 */
		public iActivate(stageGL:away.base.StageGL, camera:away.entities.Camera)
		{
			var context:away.stagegl.IContext = stageGL.contextGL;

			super.iActivate(stageGL, camera);

			if (this._alphaThreshold > 0) {
				this._alphaMask.activateTextureForStage(0, stageGL);
				context.setProgramConstantsFromArray(away.stagegl.ContextGLProgramType.FRAGMENT, 0, this._data, 3);
			} else {
				context.setProgramConstantsFromArray(away.stagegl.ContextGLProgramType.FRAGMENT, 0, this._data, 2);
			}
		}
	}
}
