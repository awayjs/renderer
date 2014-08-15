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

			this.pBaseMethod._iModulateMethod = (shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => this.scatterLight(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);

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
		public iInitConstants(shaderObject:ShaderObjectBase, methodVO:MethodVO)
		{
			super.iInitConstants(shaderObject, methodVO);

			var data:Array<number> = shaderObject.vertexConstantData;
			var index:number /*int*/ = methodVO.secondaryVertexConstantsIndex;
			data[index] = .5;
			data[index + 1] = -.5;
			data[index + 2] = 0;
			data[index + 3] = 1;
			
			data = shaderObject.fragmentConstantData;
			index = methodVO.secondaryFragmentConstantsIndex;
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
		public iGetVertexCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
		{
			var code:string = super.iGetVertexCode(shaderObject, methodVO, registerCache, sharedRegisters);
			var lightProjection:ShaderRegisterElement;
			var toTexRegister:ShaderRegisterElement;
			var temp:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			
			toTexRegister = registerCache.getFreeVertexConstant();
			vo.secondaryVertexConstantsIndex = toTexRegister.index*4;

			this._lightProjVarying = registerCache.getFreeVarying();
			lightProjection = registerCache.getFreeVertexConstant();
			registerCache.getFreeVertexConstant();
			registerCache.getFreeVertexConstant();
			registerCache.getFreeVertexConstant();
			
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
		public iGetFragmentPreLightingCode(shaderObject:ShaderLightingObject, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
		{
			this._colorReg = registerCache.getFreeFragmentConstant();
			this._decReg = registerCache.getFreeFragmentConstant();
			this._propReg = registerCache.getFreeFragmentConstant();
			methodVO.secondaryFragmentConstantsIndex = this._colorReg.index*4;
			
			return super.iGetFragmentPreLightingCode(shaderObject, methodVO, registerCache, sharedRegisters);
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetFragmentCodePerLight(shaderObject:ShaderLightingObject, methodVO:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
		{
			this._pIsFirstLight = true;
			this._lightColorReg = lightColReg;
			return super.iGetFragmentCodePerLight(shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters);
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetFragmentPostLightingCode(shaderObject:ShaderLightingObject, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
		{
			var code:string = super.iGetFragmentPostLightingCode(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
			var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
			
			code += "mul " + temp + ".xyz, " + this._lightColorReg + ".xyz, " + this._targetReg + ".w\n" +
				"mul " + temp + ".xyz, " + temp + ".xyz, " + this._colorReg + ".xyz\n" +
				"add " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
			
			if (this._targetReg != sharedRegisters.viewDirFragment)
				registerCache.removeFragmentTempUsage(targetReg);
			
			return code;
		}
		
		/**
		 * @inheritDoc
		 */
		public iActivate(shaderObject:ShaderLightingObject, methodVO:MethodVO, stage:Stage)
		{
			super.iActivate(shaderObject, methodVO, stage);
			
			var index:number /*int*/ = methodVO.secondaryFragmentConstantsIndex;
			var data:Array<number> = shaderObject.fragmentConstantData;
			data[index] = this._scatterR;
			data[index + 1] = this._scatterG;
			data[index + 2] = this._scatterB;
			data[index + 8] = this._scattering;
			data[index + 9] = this._translucency;
		}

		/**
		 * @inheritDoc
		 */
		public iSetRenderState(shaderObject:ShaderObjectBase, methodVO:MethodVO, renderable:away.pool.RenderableBase, stage:away.base.Stage, camera:away.entities.Camera)
		{
			(<IContextStageGL> stage.context).activateTexture(methodVO.secondaryTexturesIndex, this._depthPass._iGetDepthMap(renderable));

			this._depthPass._iGetProjection(renderable).copyRawDataTo(methodVO.vertexData, methodVO.secondaryVertexConstantsIndex + 4, true);
		}
		
		/**
		 * Generates the code for this method
		 */
		private scatterLight(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
		{
			// only scatter first light
			if (!this._pIsFirstLight)
				return "";

			this._pIsFirstLight = false;

			var code:string = "";
			var depthReg:ShaderRegisterElement = registerCache.getFreeTextureReg();

			if (sharedRegisters.viewDirFragment) {
				this._targetReg = sharedRegisters.viewDirFragment;
			} else {
				this._targetReg = registerCache.getFreeFragmentVectorTemp();
				registerCache.addFragmentTempUsages(this._targetReg, 1);
			}

			methodVO.secondaryTexturesIndex = depthReg.index;
			
			var temp:ShaderRegisterElement = registerCache.getFreeFragmentVectorTemp();
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
