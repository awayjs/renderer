///<reference path="../../_definitions.ts"/>

module away.materials
{
	import SubGeometry								= away.base.TriangleSubGeometry;

	/**
	 * The SingleObjectDepthPass provides a material pass that renders a single object to a depth map from the point
	 * of view from a light.
	 */
	export class SingleObjectDepthPass extends MaterialPassBase
	{
		private _textures:Object;
		private _projections:Object;
		private _textureSize:number /*uint*/;
		private _polyOffset:Array<number>;
		private _enc:Array<number>;
		private _projectionTexturesInvalid:Boolean = true;
		
		/**
		 * Creates a new SingleObjectDepthPass object.
		 * @param textureSize The size of the depth map texture to render to.
		 * @param polyOffset The amount by which the rendered object will be inflated, to prevent depth map rounding errors.
		 *
		 * todo: provide custom vertex code to assembler
		 */
		constructor(textureSize:number /*uint*/ = 512, polyOffset:number = 15)
		{
			super(true);
			
			this._textureSize = textureSize;
			this._pNumUsedStreams = 2;
			this._pNumUsedVertexConstants = 7;
			this._polyOffset = Array<number>(polyOffset, 0, 0, 0);
			this._enc = Array<number>(1.0, 255.0, 65025.0, 16581375.0, 1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0);

			this._pAnimatableAttributes = Array<string>("va0", "va1");
			this._pAnimationTargetRegisters = Array<string>("vt0", "vt1");
		}
		
		/**
		 * @inheritDoc
		 */
		public dispose()
		{
			if (this._textures) {
				for (var key in this._textures) {
					var texture:away.textures.RenderTexture = this._textures[key];
					texture.dispose();
				}
				this._textures = null;
			}
		}

		/**
		 * Updates the projection textures used to contain the depth renders.
		 */
		private updateProjectionTextures()
		{
			if (this._textures) {
				for (var key in this._textures) {
					var texture:away.textures.RenderTexture = this._textures[key];
					texture.dispose();
				}
			}

			this._textures = new Object();
			this._projections = new Object();
			this._projectionTexturesInvalid = false;
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetVertexCode():string
		{
			var code:string;
			// offset
			code = "mul vt7, vt1, vc4.x	\n" +
				"add vt7, vt7, vt0		\n" +
				"mov vt7.w, vt0.w		\n";
			// project
			code += "m44 vt2, vt7, vc0		\n" +
				"mov op, vt2			\n";
			
			// perspective divide
			code += "div v0, vt2, vt2.w \n";
			
			return code;
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(animationCode:string):string
		{
			var code:string = "";
			
			// encode float -> rgba
			code += "mul ft0, fc0, v0.z     \n" +
				"frc ft0, ft0           \n" +
				"mul ft1, ft0.yzww, fc1 \n" +
				"sub ft0, ft0, ft1      \n" +
				"mov oc, ft0            \n";
			
			return code;
		}

		/**
		 * Gets the depth maps rendered for this object from all lights.
		 * @param renderable The renderable for which to retrieve the depth maps.
		 * @param stage3DProxy The Stage3DProxy object currently used for rendering.
		 * @return A list of depth map textures for all supported lights.
		 */
		public _iGetDepthMap(renderable:away.pool.RenderableBase):away.textures.RenderTexture
		{
			return this._textures[renderable.materialOwner.id];
		}
		
		/**
		 * Retrieves the depth map projection maps for all lights.
		 * @param renderable The renderable for which to retrieve the projection maps.
		 * @return A list of projection maps for all supported lights.
		 */
		public _iGetProjection(renderable:away.pool.RenderableBase):away.geom.Matrix3D
		{
			return this._projections[renderable.materialOwner.id];
		}
		
		/**
		 * @inheritDoc
		 */
		public iRender(renderable:away.pool.RenderableBase, stageGL:away.base.StageGL, camera:away.entities.Camera, viewProjection:away.geom.Matrix3D)
		{
			var matrix:away.geom.Matrix3D;
			var context:away.stagegl.IContext = stageGL.contextGL;
			var len:number /*uint*/;
			var light:away.lights.LightBase;
			var lights:Array<away.lights.LightBase> = this._pLightPicker.allPickedLights;
			var rId:number = renderable.materialOwner.id;

			if (!this._textures[rId])
				this._textures[rId] = new away.textures.RenderTexture(this._textureSize, this._textureSize);
			
			if (!this._projections[rId])
				this._projections[rId] = new away.geom.Matrix3D();
			
			len = lights.length;
			// local position = enough
			light = lights[0];
			
			matrix = light.iGetObjectProjectionMatrix(renderable.sourceEntity, camera, this._projections[rId]);

			stageGL.setRenderTarget(this._textures[rId], true);
			context.clear(1.0, 1.0, 1.0);
			context.setProgramConstantsFromMatrix(away.stagegl.ContextGLProgramType.VERTEX, 0, matrix, true);
			context.setProgramConstantsFromArray(away.stagegl.ContextGLProgramType.FRAGMENT, 0, this._enc, 2);

			stageGL.activateBuffer(0, renderable.getVertexData(SubGeometry.POSITION_DATA), renderable.getVertexOffset(SubGeometry.POSITION_DATA), SubGeometry.POSITION_FORMAT);
			stageGL.activateBuffer(1, renderable.getVertexData(SubGeometry.NORMAL_DATA), renderable.getVertexOffset(SubGeometry.NORMAL_DATA), SubGeometry.NORMAL_FORMAT);
			context.drawTriangles(stageGL.getIndexBuffer(renderable.getIndexData()), 0, renderable.numTriangles);
		}
		
		/**
		 * @inheritDoc
		 */
		public iActivate(stageGL:away.base.StageGL, camera:away.entities.Camera)
		{
			if (this._projectionTexturesInvalid)
				this.updateProjectionTextures();

			// never scale
			super.iActivate(stageGL, camera);

			stageGL.contextGL.setProgramConstantsFromArray(away.stagegl.ContextGLProgramType.VERTEX, 4, this._polyOffset, 1);
		}
	}
}
