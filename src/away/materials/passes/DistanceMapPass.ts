///<reference path="../../_definitions.ts"/>
module away.materials
{
	import SubGeometry								= away.base.TriangleSubGeometry;

	/**
	 * DistanceMapPass is a pass that writes distance values to a depth map as a 32-bit value exploded over the 4 texture channels.
	 * This is used to render omnidirectional shadow maps.
	 */
	export class DistanceMapPass extends MaterialPassBase
	{
		private _fragmentData:Array<number>;
		private _vertexData:Array<number>;
		private _alphaThreshold:number;
		private _alphaMask:away.textures.Texture2DBase;

		/**
		 * Creates a new DistanceMapPass object.
		 */
		constructor()
		{
			super();

			this._fragmentData = new Array<number>(1.0, 255.0, 65025.0, 16581375.0, 1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0, 0.0, 0.0, 0.0, 0.0);
			this._vertexData = new Array<number>(4);
			this._vertexData[3] = 1;
			this._pNumUsedVertexConstants = 9;
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
			this._fragmentData[8] = this._alphaThreshold;
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

			//TODO: AGAL<> GLSL

			var code:string;
			code = "m44 op, vt0, vc0		\n" + "m44 vt1, vt0, vc5		\n" + "sub v0, vt1, vc9		\n";

			if (this._alphaThreshold > 0) {

				code += "mov v1, va1\n";

				this._pNumUsedTextures = 1;
				this._pNumUsedStreams = 2;

			} else {
				this._pNumUsedTextures = 0;
				this._pNumUsedStreams = 1;
			}

			return code;
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(animationCode:string):string
		{
			var code:string;
			var wrap:string = this._pRepeat? "wrap" : "clamp";
			var filter:string;

			if (this._pSmooth)
				filter = this._pMipmap? "linear,miplinear" : "linear";
			else
				filter = this._pMipmap? "nearest,mipnearest" : "nearest";

			//TODO: AGAL<> GLSL

			// squared distance to view
			code = "dp3 ft2.z, v0.xyz, v0.xyz	\n" + "mul ft0, fc0, ft2.z	\n" + "frc ft0, ft0			\n" + "mul ft1, ft0.yzww, fc1	\n";

			if (this._alphaThreshold > 0) {

				var format:string;

				switch (this._alphaMask.format) {
					case away.gl.ContextGLTextureFormat.COMPRESSED:
						format = "dxt1,";
						break;

					case "compressedAlpha":
						format = "dxt5,";
						break;

					default:
						format = "";
				}

				code += "tex ft3, v1, fs0 <2d," + filter + "," + format + wrap + ">\n" + "sub ft3.w, ft3.w, fc2.x\n" + "kil ft3.w\n";
			}

			code += "sub oc, ft0, ft1		\n";

			return code;
		}

		/**
		 * @inheritDoc
		 */
		public iRender(renderable:away.pool.RenderableBase, stageGL:away.base.StageGL, camera:away.entities.Camera, viewProjection:away.geom.Matrix3D)
		{
			var context:away.gl.ContextGL = stageGL.contextGL;
			var pos:away.geom.Vector3D = camera.scenePosition;

			this._vertexData[0] = pos.x;
			this._vertexData[1] = pos.y;
			this._vertexData[2] = pos.z;
			this._vertexData[3] = 1;

			var sceneTransform:away.geom.Matrix3D = renderable.sourceEntity.getRenderSceneTransform(camera);

			context.setProgramConstantsFromMatrix(away.gl.ContextGLProgramType.VERTEX, 5, sceneTransform, true);

			context.setProgramConstantsFromArray(away.gl.ContextGLProgramType.VERTEX, 9, this._vertexData, 1);

			if (this._alphaThreshold > 0)
				stageGL.activateBuffer(1, renderable.getVertexData(SubGeometry.SECONDARY_UV_DATA), renderable.getVertexOffset(SubGeometry.SECONDARY_UV_DATA), SubGeometry.SECONDARY_UV_FORMAT);


			var matrix:away.geom.Matrix3D = away.geom.Matrix3DUtils.CALCULATION_MATRIX;

			matrix.copyFrom(sceneTransform);
			matrix.append(viewProjection);

			context.setProgramConstantsFromMatrix(away.gl.ContextGLProgramType.VERTEX, 0, matrix, true);

			stageGL.activateBuffer(0, renderable.getVertexData(SubGeometry.POSITION_DATA), renderable.getVertexOffset(SubGeometry.POSITION_DATA), SubGeometry.POSITION_FORMAT);
			context.drawTriangles(stageGL.getIndexBuffer(renderable.getIndexData()), 0, renderable.numTriangles);
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(stageGL:away.base.StageGL, camera:away.entities.Camera)
		{
			var context:away.gl.ContextGL = stageGL.contextGL;
			super.iActivate(stageGL, camera);

			var f:number = camera.projection.far;

			f = 1/(2*f*f);
			// sqrt(f*f+f*f) is largest possible distance for any frustum, so we need to divide by it. Rarely a tight fit, but with 32 bits precision, it's enough.
			this._fragmentData[0] = 1*f;
			this._fragmentData[1] = 255.0*f;
			this._fragmentData[2] = 65025.0*f;
			this._fragmentData[3] = 16581375.0*f;

			if (this._alphaThreshold > 0) {
				this._alphaMask.activateTextureForStage(0, stageGL);
				context.setProgramConstantsFromArray(away.gl.ContextGLProgramType.FRAGMENT, 0, this._fragmentData, 3);
			} else {
				context.setProgramConstantsFromArray(away.gl.ContextGLProgramType.FRAGMENT, 0, this._fragmentData, 2);
			}
		}
	}
}
