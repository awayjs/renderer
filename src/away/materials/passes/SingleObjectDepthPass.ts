///<reference path="../../_definitions.ts"/>

module away.materials
{
	/**
	 * The SingleObjectDepthPass provides a material pass that renders a single object to a depth map from the point
	 * of view from a light.
	 */
	export class SingleObjectDepthPass extends MaterialPassBase
	{
		private _textures:Array<Object>;
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
				for (var i:number /*uint*/ = 0; i < 8; ++i) {
					for (var key in this._textures[i]) {
						var vec:Array<away.gl.Texture> = this._textures[i][key];
						for (var j:number /*uint*/ = 0; j < vec.length; ++j)
							vec[j].dispose();
					}
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
				for (var i:number /*uint*/ = 0; i < 8; ++i) {
					for (var key in this._textures[i]) {
						var vec:Array<away.gl.Texture> = this._textures[i][key];
						for (var j:number /*uint*/ = 0; j < vec.length; ++j)
							vec[j].dispose();
					}
				}
			}

			this._textures = new Array<Object>(8);
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
		public _iGetDepthMap(renderable:away.pool.RenderableBase, stageGL:away.base.StageGL):away.gl.Texture
		{
			return this._textures[stageGL.stageGLIndex][renderable.materialOwner.id];
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
			var contextIndex:number /*int*/ = stageGL.stageGLIndex;
			var context:away.gl.ContextGL = stageGL.contextGL;
			var len:number /*uint*/;
			var light:away.lights.LightBase;
			var lights:Array<away.lights.LightBase> = this._pLightPicker.allPickedLights;
			var rId:string = renderable.materialOwner.id;

			if (this._textures[contextIndex] == undefined)
				this._textures[contextIndex] = new Object();
			
			if (!this._projections[rId])
				this._projections[rId] = new away.geom.Matrix3D();
			
			len = lights.length;
			// local position = enough
			light = lights[0];
			
			matrix = light.iGetObjectProjectionMatrix(renderable.sourceEntity, camera, this._projections[rId]);
			
			// todo: use texture proxy?
			var target:away.gl.Texture = this._textures[contextIndex][rId];

			if (target == null)
				target = context.createTexture(this._textureSize, this._textureSize, away.gl.ContextGLTextureFormat.BGRA, true);

			stageGL.setRenderTarget(target, true);
			context.clear(1.0, 1.0, 1.0);
			context.setProgramConstantsFromMatrix(away.gl.ContextGLProgramType.VERTEX, 0, matrix, true);
			context.setProgramConstantsFromArray(away.gl.ContextGLProgramType.FRAGMENT, 0, this._enc, 2);
			renderable.subGeometry.activateVertexBuffer(0, stageGL);
			renderable.subGeometry.activateVertexNormalBuffer(1, stageGL);
			context.drawTriangles(renderable.subGeometry.getIndexBuffer(stageGL), 0, renderable.subGeometry.numTriangles);
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

			stageGL.contextGL.setProgramConstantsFromArray(away.gl.ContextGLProgramType.VERTEX, 4, this._polyOffset, 1);
		}
	}
}
