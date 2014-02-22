///<reference path="../../_definitions.ts"/>

module away.materials
{
	import Camera							= away.entities.Camera;
	import StageGL							= away.base.StageGL;
	import ShadingMethodEvent				= away.events.ShadingMethodEvent;
	import DirectionalLight					= away.lights.DirectionalLight;
	import CascadeShadowMapper				= away.lights.CascadeShadowMapper;
	import RenderableBase					= away.pool.RenderableBase;
	
	import Event							= away.events.Event;

	/**
	 * CascadeShadowMapMethod is a shadow map method to apply cascade shadow mapping on materials.
	 * Must be used with a DirectionalLight with a CascadeShadowMapper assigned to its shadowMapper property.
	 *
	 * @see away.lights.CascadeShadowMapper
	 */
	export class CascadeShadowMapMethod extends ShadowMapMethodBase
	{
		private _baseMethod:SimpleShadowMapMethodBase;
		private _cascadeShadowMapper:CascadeShadowMapper;
		private _depthMapCoordVaryings:ShaderRegisterElement[];
		private _cascadeProjections:ShaderRegisterElement[];
		
		/**
		 * Creates a new CascadeShadowMapMethod object.
		 *
		 * @param shadowMethodBase The shadow map sampling method used to sample individual cascades (fe: HardShadowMapMethod, SoftShadowMapMethod)
		 */
		constructor(shadowMethodBase:SimpleShadowMapMethodBase)
		{
			super(shadowMethodBase.castingLight);
			
			this._baseMethod = shadowMethodBase;
			if (!(this._pCastingLight instanceof DirectionalLight))
				throw new Error("CascadeShadowMapMethod is only compatible with DirectionalLight");
			
			this._cascadeShadowMapper = <CascadeShadowMapper> this._pCastingLight.shadowMapper;
			
			if (!this._cascadeShadowMapper)
				throw new Error("CascadeShadowMapMethod requires a light that has a CascadeShadowMapper instance assigned to shadowMapper.");
			
			this._cascadeShadowMapper.addEventListener(Event.CHANGE, (event:away.events.Event) => this.onCascadeChange(event));
			this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, (event:away.events.Event) => this.onShaderInvalidated(event));
		}

		/**
		 * The shadow map sampling method used to sample individual cascades. These are typically those used in conjunction
		 * with a DirectionalShadowMapper.
		 *
		 * @see HardShadowMapMethod
		 * @see SoftShadowMapMethod
		 */
		public get baseMethod():SimpleShadowMapMethodBase
		{
			return this._baseMethod;
		}
		
		public set baseMethod(value:SimpleShadowMapMethodBase)
		{
			if (this._baseMethod == value)
				return;

			this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, (event:ShadingMethodEvent) => this.onShaderInvalidated(event));
			this._baseMethod = value;
			this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, (event:ShadingMethodEvent) => this.onShaderInvalidated(event));
			this.iInvalidateShaderProgram();
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(vo:MethodVO)
		{
			var tempVO:MethodVO = new MethodVO();
			this._baseMethod.iInitVO(tempVO);
			vo.needsGlobalVertexPos = true;
			vo.needsProjection = true;
		}

		/**
		 * @inheritDoc
		 */
		set iSharedRegisters(value:ShaderRegisterData)
		{
			this.setISharedRegisters(value);
			this._baseMethod.iSharedRegisters = value;
		}

		/**
		 * @inheritDoc
		 */
		public iInitConstants(vo:MethodVO)
		{
			var fragmentData:Array<number> = vo.fragmentData;
			var vertexData:Array<number> = vo.vertexData;
			var index:number = vo.fragmentConstantsIndex;
			fragmentData[index] = 1.0;
			fragmentData[index + 1] = 1/255.0;
			fragmentData[index + 2] = 1/65025.0;
			fragmentData[index + 3] = 1/16581375.0;
			
			fragmentData[index + 6] = .5;
			fragmentData[index + 7] = -.5;
			
			index = vo.vertexConstantsIndex;
			vertexData[index] = .5;
			vertexData[index + 1] = -.5;
			vertexData[index + 2] = 0;
		}

		/**
		 * @inheritDoc
		 */
		public iCleanCompilationData()
		{
			super.iCleanCompilationData();
			this._cascadeProjections = null;
			this._depthMapCoordVaryings = null;
		}

		/**
		 * @inheritDoc
		 */
		public iGetVertexCode(vo:MethodVO, regCache:ShaderRegisterCache):string
		{
			var code:string = "";
			var dataReg:ShaderRegisterElement = regCache.getFreeVertexConstant();
			
			this.initProjectionsRegs(regCache);
			vo.vertexConstantsIndex = dataReg.index*4;
			
			var temp:ShaderRegisterElement = regCache.getFreeVertexVectorTemp();
			
			for (var i:number = 0; i < this._cascadeShadowMapper.numCascades; ++i) {
				code += "m44 " + temp + ", " + this._sharedRegisters.globalPositionVertex + ", " + this._cascadeProjections[i] + "\n" +
					"add " + this._depthMapCoordVaryings[i] + ", " + temp + ", " + dataReg + ".zzwz\n";
			}
			
			return code;
		}

		/**
		 * Creates the registers for the cascades' projection coordinates.
		 */
		private initProjectionsRegs(regCache:ShaderRegisterCache)
		{
			this._cascadeProjections = new Array<ShaderRegisterElement>(this._cascadeShadowMapper.numCascades);
			this._depthMapCoordVaryings = new Array<ShaderRegisterElement>(this._cascadeShadowMapper.numCascades);
			
			for (var i:number = 0; i < this._cascadeShadowMapper.numCascades; ++i) {
				this._depthMapCoordVaryings[i] = regCache.getFreeVarying();
				this._cascadeProjections[i] = regCache.getFreeVertexConstant();
				regCache.getFreeVertexConstant();
				regCache.getFreeVertexConstant();
				regCache.getFreeVertexConstant();
			}
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			var numCascades:number = this._cascadeShadowMapper.numCascades;
			var depthMapRegister:ShaderRegisterElement = regCache.getFreeTextureReg();
			var decReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			var dataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			var planeDistanceReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			var planeDistances:Array<string> = Array<string>( planeDistanceReg + ".x", planeDistanceReg + ".y", planeDistanceReg + ".z", planeDistanceReg + ".w" );
			var code:string;
			
			vo.fragmentConstantsIndex = decReg.index*4;
			vo.texturesIndex = depthMapRegister.index;
			
			var inQuad:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			regCache.addFragmentTempUsages(inQuad, 1);
			var uvCoord:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
			regCache.addFragmentTempUsages(uvCoord, 1);
			
			// assume lowest partition is selected, will be overwritten later otherwise
			code = "mov " + uvCoord + ", " + this._depthMapCoordVaryings[numCascades - 1] + "\n";
			
			for (var i:number = numCascades - 2; i >= 0; --i) {
				var uvProjection:ShaderRegisterElement = this._depthMapCoordVaryings[i];
				
				// calculate if in texturemap (result == 0 or 1, only 1 for a single partition)
				code += "slt " + inQuad + ".z, " + this._sharedRegisters.projectionFragment + ".z, " + planeDistances[i] + "\n"; // z = x > minX, w = y > minY
				
				var temp:ShaderRegisterElement = regCache.getFreeFragmentVectorTemp();
				
				// linearly interpolate between old and new uv coords using predicate value == conditional toggle to new value if predicate == 1 (true)
				code += "sub " + temp + ", " + uvProjection + ", " + uvCoord + "\n" +
					"mul " + temp + ", " + temp + ", " + inQuad + ".z\n" +
					"add " + uvCoord + ", " + uvCoord + ", " + temp + "\n";
			}
			
			regCache.removeFragmentTempUsage(inQuad);
			
			code += "div " + uvCoord + ", " + uvCoord + ", " + uvCoord + ".w\n" +
				"mul " + uvCoord + ".xy, " + uvCoord + ".xy, " + dataReg + ".zw\n" +
				"add " + uvCoord + ".xy, " + uvCoord + ".xy, " + dataReg + ".zz\n";
			
			code += this._baseMethod._iGetCascadeFragmentCode(vo, regCache, decReg, depthMapRegister, uvCoord, targetReg) +
				"add " + targetReg + ".w, " + targetReg + ".w, " + dataReg + ".y\n";
			
			regCache.removeFragmentTempUsage(uvCoord);
			
			return code;
		}
		
		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stageGL:away.base.StageGL)
		{
			stageGL.contextGL.setTextureAt(vo.texturesIndex, this._pCastingLight.shadowMapper.depthMap.getTextureForStageGL(stageGL));
			
			var vertexData:Array<number> = vo.vertexData;
			var vertexIndex:number = vo.vertexConstantsIndex;
			
			vo.vertexData[vo.vertexConstantsIndex + 3] = -1/(this._cascadeShadowMapper.depth*this._pEpsilon);
			
			var numCascades:number = this._cascadeShadowMapper.numCascades;
			vertexIndex += 4;
			for (var k:number = 0; k < numCascades; ++k) {
				this._cascadeShadowMapper.getDepthProjections(k).copyRawDataTo(vertexData, vertexIndex, true);
				vertexIndex += 16;
			}
			
			var fragmentData:Array<number> = vo.fragmentData;
			var fragmentIndex:number = vo.fragmentConstantsIndex;
			fragmentData[fragmentIndex + 5] = 1 - this._pAlpha;
			
			var nearPlaneDistances:Array<number> = this._cascadeShadowMapper._iNearPlaneDistances;
			
			fragmentIndex += 8;
			for (var i:number = 0; i < numCascades; ++i)
				fragmentData[fragmentIndex + i] = nearPlaneDistances[i];
			
			this._baseMethod.iActivateForCascade(vo, stageGL);
		}

		/**
		 * @inheritDoc
		 */
		public iSetRenderState(vo:MethodVO, renderable:away.pool.RenderableBase, stageGL:away.base.StageGL, camera:away.entities.Camera)
		{
		}

		/**
		 * Called when the shadow mappers cascade configuration changes.
		 */
		private onCascadeChange(event:Event)
		{
			this.iInvalidateShaderProgram();
		}

		/**
		 * Called when the base method's shader code is invalidated.
		 */
		private onShaderInvalidated(event:ShadingMethodEvent)
		{
			this.iInvalidateShaderProgram();
		}
	}
}
