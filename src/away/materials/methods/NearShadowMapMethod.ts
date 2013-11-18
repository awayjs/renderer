///<reference path="../../_definitions.ts"/>

module away.materials
{
	import Camera3D                         = away.cameras.Camera3D;
	import IRenderable                      = away.base.IRenderable;
	import Stage3DProxy                     = away.managers.Stage3DProxy;
	import ShadingMethodEvent               = away.events.ShadingMethodEvent;
	import NearDirectionalShadowMapper      = away.lights.NearDirectionalShadowMapper;
	
	// TODO: shadow mappers references in materials should be an interface so that this class should NOT extend ShadowMapMethodBase just for some delegation work
	/**
	 * NearShadowMapMethod provides a shadow map method that restricts the shadowed area near the camera to optimize
	 * shadow map usage. This method needs to be used in conjunction with a NearDirectionalShadowMapper.
	 *
	 * @see away.lights.NearDirectionalShadowMapper
	 */
	export class NearShadowMapMethod extends SimpleShadowMapMethodBase
	{
		private _baseMethod:SimpleShadowMapMethodBase;
		
		private _fadeRatio:number;
		private _nearShadowMapper:NearDirectionalShadowMapper;

		/**
		 * Creates a new NearShadowMapMethod object.
		 * @param baseMethod The shadow map sampling method used to sample individual cascades (fe: HardShadowMapMethod, SoftShadowMapMethod)
		 * @param fadeRatio The amount of shadow fading to the outer shadow area. A value of 1 would mean the shadows start fading from the camera's near plane.
		 */
		constructor(baseMethod:SimpleShadowMapMethodBase, fadeRatio:number = .1)
		{
			super(baseMethod.castingLight);
			this._baseMethod = baseMethod;
            this._fadeRatio = fadeRatio;
            this._nearShadowMapper = <NearDirectionalShadowMapper> this._pCastingLight.shadowMapper;
			if (!this._nearShadowMapper)
				throw new Error("NearShadowMapMethod requires a light that has a NearDirectionalShadowMapper instance assigned to shadowMapper.");
			this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated, this);
		}

		/**
		 * The base shadow map method on which this method's shading is based.
		 */
		public get baseMethod():SimpleShadowMapMethodBase
		{
			return this._baseMethod;
		}

		public set baseMethod(value:SimpleShadowMapMethodBase)
		{
			if (this._baseMethod == value)
				return;
            this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated, this);
            this._baseMethod = value;
            this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated, this);
			this.iInvalidateShaderProgram();
		}

		/**
		 * @inheritDoc
		 */
		public iInitConstants(vo:MethodVO):void
		{
			super.iInitConstants(vo);
            this._baseMethod.iInitConstants(vo);
			
			var fragmentData:Array<number> = vo.fragmentData;
			var index:number /*int*/ = vo.secondaryFragmentConstantsIndex;
			fragmentData[index + 2] = 0;
			fragmentData[index + 3] = 1;
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(vo:MethodVO):void
		{
            this._baseMethod.iInitVO(vo);
			vo.needsProjection = true;
		}

		/**
		 * @inheritDoc
		 */
		public dispose()
		{
			this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated, this);
		}

		/**
		 * @inheritDoc
		 */
		public get alpha():number
		{
			return this._baseMethod.alpha;
		}
		
		public set alpha(value:number)
		{
            this._baseMethod.alpha = value;
		}

		/**
		 * @inheritDoc
		 */
		public get epsilon():number
		{
			return this._baseMethod.epsilon;
		}
		
		public set epsilon(value:number)
		{
            this._baseMethod.epsilon = value;
		}

		/**
		 * The amount of shadow fading to the outer shadow area. A value of 1 would mean the shadows start fading from the camera's near plane.
		 */
		public get fadeRatio():number
		{
			return this._fadeRatio;
		}
		
		public set fadeRatio(value:number)
		{
			this._fadeRatio = value;
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			var code:string = this._baseMethod.iGetFragmentCode(vo, regCache, targetReg);
			var dataReg:ShaderRegisterElement = regCache.getFreeFragmentConstant();
			var temp:ShaderRegisterElement = regCache.getFreeFragmentSingleTemp();
			vo.secondaryFragmentConstantsIndex = dataReg.index*4;
			
			code += "abs " + temp + ", " + this._sharedRegisters.projectionFragment + ".w\n" +
				"sub " + temp + ", " + temp + ", " + dataReg + ".x\n" +
				"mul " + temp + ", " + temp + ", " + dataReg + ".y\n" +
				"sat " + temp + ", " + temp + "\n" +
				"sub " + temp + ", " + dataReg + ".w," + temp + "\n" +
				"sub " + targetReg + ".w, " + dataReg + ".w," + targetReg + ".w\n" +
				"mul " + targetReg + ".w, " + targetReg + ".w, " + temp + "\n" +
				"sub " + targetReg + ".w, " + dataReg + ".w," + targetReg + ".w\n";
			
			return code;
		}
		
		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stage3DProxy:Stage3DProxy):void
		{
            this._baseMethod.iActivate(vo, stage3DProxy);
		}

		/**
		 * @inheritDoc
		 */
		public iDeactivate(vo:MethodVO, stage3DProxy:Stage3DProxy):void
		{
            this._baseMethod.iDeactivate(vo, stage3DProxy);
		}

		/**
		 * @inheritDoc
		 */
		public iSetRenderState(vo:MethodVO, renderable:IRenderable, stage3DProxy:Stage3DProxy, camera:Camera3D):void
		{
			// todo: move this to activate (needs camera)
			var near:number = camera.lens.near;
			var d:number = camera.lens.far - near;
			var maxDistance:number = this._nearShadowMapper.coverageRatio;
			var minDistance:number = maxDistance*(1 - this._fadeRatio);
			
			maxDistance = near + maxDistance*d;
			minDistance = near + minDistance*d;
			
			var fragmentData:Array<number> = vo.fragmentData;
			var index:number /*int*/ = vo.secondaryFragmentConstantsIndex;
			fragmentData[index] = minDistance;
			fragmentData[index + 1] = 1/(maxDistance - minDistance);
            this._baseMethod.iSetRenderState(vo, renderable, stage3DProxy, camera);
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetVertexCode(vo:MethodVO, regCache:ShaderRegisterCache):string
		{
			return this._baseMethod.iGetVertexCode(vo, regCache);
		}
		
		/**
		 * @inheritDoc
		 */
		public iReset()
		{
            this._baseMethod.iReset();
		}

		/**
		 * @inheritDoc
		 */
		public iCleanCompilationData()
		{
			super.iCleanCompilationData();
            this._baseMethod.iCleanCompilationData();
		}
		
		/**
		 * @inheritDoc
		 */
		public set iSharedRegisters(value:ShaderRegisterData)
		{
			this._sharedRegisters = this._baseMethod.iSharedRegisters = value;
		}

		/**
		 * Called when the base method's shader code is invalidated.
		 */
		private onShaderInvalidated(event:ShadingMethodEvent):void
		{
            this.iInvalidateShaderProgram();
		}
	}
}
