///<reference path="../../_definitions.ts"/>

module away.materials
{
	import Stage									= away.base.Stage;
	import Matrix3D									= away.geom.Matrix3D;
	import RenderableBase							= away.pool.RenderableBase;
	import IContextStageGL							= away.stagegl.IContextStageGL;
	import RenderTexture							= away.textures.RenderTexture;

	/**
	 * DiffuseSubSurfaceMethod provides a depth map-based diffuse shading method that mimics the scattering of
	 * light inside translucent surfaces. It allows light to shine through an object and to soften the diffuse shading.
	 * It can be used for candle wax, ice, skin, ...
	 */
	export class DiffuseSubSurfaceMethod extends DiffuseCompositeMethod
	{
		private _depthPass:SingleObjectDepthPass;
		private _lightProjVarying:ShaderRegisterElement;
		private _propReg:ShaderRegisterElement;
		private _scattering:number;
		private _translucency:number = 1;
		private _lightColorReg:ShaderRegisterElement;
		private _scatterColor:number /*uint*/ = 0xffffff;
		private _colorReg:ShaderRegisterElement;
		private _decReg:ShaderRegisterElement;
		private _scatterR:number = 1.0;
		private _scatterG:number = 1.0;
		private _scatterB:number = 1.0;
		private _targetReg:ShaderRegisterElement;
		
		/**
		 * Creates a new <code>DiffuseSubSurfaceMethod</code> object.
		 *
		 * @param depthMapSize The size of the depth map used.
		 * @param depthMapOffset The amount by which the rendered object will be inflated, to prevent depth map rounding errors.
		 * @param baseMethod The diffuse method used to calculate the regular diffuse-based lighting.
		 */
		constructor(depthMapSize:number /*int*/ = 512, depthMapOffset:number = 15, baseMethod:DiffuseBasicMethod = null)
		{
			super(null, baseMethod);

			this.pBaseMethod._iModulateMethod = (vo:MethodVO, target:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => this.scatterLight(vo, target, regCache, sharedRegisters);

			this._passes = new Array<MaterialPassBase>();
			this._depthPass = new SingleObjectDepthPass();
			this._depthPass.textureSize = depthMapSize;
			this._depthPass.polyOffset = depthMapOffset;
			this._passes.push(this._depthPass);
			this._scattering = 0.2;
			this._translucency = 1;
		}

		/**
		 * @inheritDoc
		 */
		public iInitConstants(vo:MethodVO)
		{
			super.iInitConstants(vo);
			var data:Array<number> = vo.vertexData;
			var index:number /*int*/ = vo.secondaryVertexConstantsIndex;
			data[index] = .5;
			data[index + 1] = -.5;
			data[index + 2] = 0;
			data[index + 3] = 1;
			
			data = vo.fragmentData;
			index = vo.secondaryFragmentConstantsIndex;
			data[index + 3] = 1.0;
			data[index + 4] = 1.0;
			data[index + 5] = 1/255;
			data[index + 6] = 1/65025;
			data[index + 7] = 1/16581375;
			data[index + 10] = .5;
			data[index + 11] = -.1;
		}
		
		public iCleanCompilationData()
		{
			super.iCleanCompilationData();

			this._lightProjVarying = null;
			this._propReg = null;
			this._lightColorReg = null;
			this._colorReg = null;
			this._decReg = null;
			this._targetReg = null;
		}
		
		/**
		 * The amount by which the light scatters. It can be used to set the translucent surface's thickness. Use low
		 * values for skin.
		 */
		public get scattering():number
		{
			return this._scattering;
		}
		
		public set scattering(value:number)
		{
			this._scattering = value;
		}
		
		/**
		 * The translucency of the object.
		 */
		public get translucency():number
		{
			return this._translucency;
		}
		
		public set translucency(value:number)
		{
			this._translucency = value;
		}
		
		/**
		 * The colour of the "insides" of the object, ie: the colour the light becomes after leaving the object.
		 */
		public get scatterColor():number /*uint*/
		{
			return this._scatterColor;
		}
		
		public set scatterColor(scatterColor:number /*uint*/)
		{
			this._scatterColor = scatterColor;
			this._scatterR = ((scatterColor >> 16) & 0xff)/0xff;
			this._scatterG = ((scatterColor >> 8) & 0xff)/0xff;
			this._scatterB = (scatterColor & 0xff)/0xff;
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetVertexCode(vo:MethodVO, regCache:ShaderRegisterCache):string
		{
			var code:string = super.iGetVertexCode(vo, regCache);
			var lightProjection:ShaderRegisterElement;
			var toTexRegister:ShaderRegisterElement;
			var temp:ShaderRegisterElement = regCache.getFreeVertexVectorTemp();
			
			toTexRegister = regCache.getFreeVertexConstant();
			vo.secondaryVertexConstantsIndex = toTexRegister.index*4;

			this._lightProjVarying = regCache.getFreeVarying();
			lightProjection = regCache.getFreeVertexConstant();
			regCache.getFreeVertexConstant();
			regCache.getFreeVertexConstant();
			regCache.getFreeVertexConstant();
			
			code += "m44 " + temp + ", vt0, " + lightProjection + "\n" +
				"div " + temp + ".xyz, " + temp + ".xyz, " + temp + ".w\n" +
				"mul " + temp + ".xy, " + temp + ".xy, " + toTexRegister + ".xy\n" +
				"add " + temp + ".xy, " + temp + ".xy, " + toTexRegister + ".xx\n" +
				"mov " + this._lightProjVarying + ".xyz, " + temp + ".xyz\n" +
				"mov " + this._lightProjVarying + ".w, va0.w\n";
			
			return code;
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetFragmentPreLightingCode(vo:MethodVO, regCache:ShaderRegisterCache):string
		{
			this._colorReg = regCache.getFreeFragmentConstant();
			this._decReg = regCache.getFreeFragmentConstant();
			this._propReg = regCache.getFreeFragmentConstant();
			vo.secondaryFragmentConstantsIndex = this._colorReg.index*4;
			
			return super.iGetFragmentPreLightingCode(vo, regCache);
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetFragmentCodePerLight(vo:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, regCache:ShaderRegisterCache):string
		{
			this._pIsFirstLight = true;
			this._lightColorReg = lightColReg;
			return super.iGetFragmentCodePerLight(vo, lightDirReg, lightColReg, regCache);
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetFragmentPostLightingCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			var code:string = super.iGetFragmentPostLightingCode(vo, regCache, targetReg);
			var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			
			code += "mul " + temp + ".xyz, " + this._lightColorReg + ".xyz, " + this._targetReg + ".w\n" +
				"mul " + temp + ".xyz, " + temp + ".xyz, " + this._colorReg + ".xyz\n" +
				"add " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
			
			if (this._targetReg != this._sharedRegisters.viewDirFragment)
				regCache.removeFragmentTempUsage(targetReg);
			
			return code;
		}
		
		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stage:Stage)
		{
			super.iActivate(vo, stage);
			
			var index:number /*int*/ = vo.secondaryFragmentConstantsIndex;
			var data:Array<number> = vo.fragmentData;
			data[index] = this._scatterR;
			data[index + 1] = this._scatterG;
			data[index + 2] = this._scatterB;
			data[index + 8] = this._scattering;
			data[index + 9] = this._translucency;
		}

		/**
		 * @inheritDoc
		 */
		public setRenderState(vo:MethodVO, renderable:RenderableBase, stage:Stage, camera:away.entities.Camera)
		{
			(<IContextStageGL> stage.context).activateTexture(vo.secondaryTexturesIndex, this._depthPass._iGetDepthMap(renderable));

			this._depthPass._iGetProjection(renderable).copyRawDataTo(vo.vertexData, vo.secondaryVertexConstantsIndex + 4, true);
		}
		
		/**
		 * Generates the code for this method
		 */
		private scatterLight(vo:MethodVO, targetReg:ShaderRegisterElement, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
		{
			// only scatter first light
			if (!this._pIsFirstLight)
				return "";

			this._pIsFirstLight = false;

			var code:string = "";
			var depthReg:ShaderRegisterElement = regCache.getFreeTextureReg();

			if (sharedRegisters.viewDirFragment) {
				this._targetReg = sharedRegisters.viewDirFragment;
			} else {
				this._targetReg = regCache.getFreeFragmentVectorTemp();
				regCache.addFragmentTempUsages(this._targetReg, 1);
			}
			
			vo.secondaryTexturesIndex = depthReg.index;
			
			var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			code += "tex " + temp + ", " + this._lightProjVarying + ", " + depthReg + " <2d,nearest,clamp>\n" +
				// reencode RGBA
				"dp4 " + targetReg + ".z, " + temp + ", " + this._decReg + "\n";
			// currentDistanceToLight - closestDistanceToLight
			code += "sub " + targetReg + ".z, " + this._lightProjVarying + ".z, " + targetReg + ".z\n" +
				
				"sub " + targetReg + ".z, " + this._propReg + ".x, " + targetReg + ".z\n" +
				"mul " + targetReg + ".z, " + this._propReg + ".y, " + targetReg + ".z\n" +
				"sat " + targetReg + ".z, " + targetReg + ".z\n" +
				
				// targetReg.x contains dot(lightDir, normal)
				// modulate according to incident light angle (scatter = scatter*(-.5*dot(light, normal) + .5)
				"neg " + targetReg + ".y, " + targetReg + ".x\n" +
				"mul " + targetReg + ".y, " + targetReg + ".y, " + this._propReg + ".z\n" +
				"add " + targetReg + ".y, " + targetReg + ".y, " + this._propReg + ".z\n" +
				"mul " + this._targetReg + ".w, " + targetReg + ".z, " + targetReg + ".y\n" +
				
				// blend diffuse: d' = (1-s)*d + s*1
				"sub " + targetReg + ".y, " + this._colorReg + ".w, " + this._targetReg + ".w\n" +
				"mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n";
			
			return code;
		}
	}
}
