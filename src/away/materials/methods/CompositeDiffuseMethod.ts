///<reference path="../../_definitions.ts"/>
module away.materials
{

	/**
	 * CompositeDiffuseMethod provides a base class for diffuse methods that wrap a diffuse method to alter the
	 * calculated diffuse reflection strength.
	 */
	export class CompositeDiffuseMethod extends away.materials.BasicDiffuseMethod
	{
		public pBaseMethod:away.materials.BasicDiffuseMethod;

		/**
		 * Creates a new WrapDiffuseMethod object.
		 * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature clampDiffuse(t : ShaderRegisterElement, regCache : ShaderRegisterCache) : string, in which t.w will contain the diffuse strength.
		 * @param baseDiffuseMethod The base diffuse method on which this method's shading is based.
		 */
		constructor(modulateMethod:Function = null, baseDiffuseMethod:away.materials.BasicDiffuseMethod = null)
		{

            super();

			this.pBaseMethod = baseDiffuseMethod || new away.materials.BasicDiffuseMethod();
            this.pBaseMethod._iModulateMethod = modulateMethod;
            this.pBaseMethod.addEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );
		}

		/**
		 * The base diffuse method on which this method's shading is based.
		 */
		public get baseMethod():away.materials.BasicDiffuseMethod
		{
			return this.pBaseMethod;
		}

		public set baseMethod(value:away.materials.BasicDiffuseMethod)
		{
			if (this.pBaseMethod == value)
				return;
            this.pBaseMethod.removeEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );
            this.pBaseMethod = value;
            this.pBaseMethod.addEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated, this );
			this.iInvalidateShaderProgram();//invalidateShaderProgram();
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(vo:MethodVO):void
		{
            this.pBaseMethod.iInitVO(vo);
		}

		/**
		 * @inheritDoc
		 */
		public iInitConstants(vo:MethodVO):void
		{
            this.pBaseMethod.iInitConstants(vo);
		}
		
		/**
		 * @inheritDoc
		 */
		public dispose():void
		{
            this.pBaseMethod.removeEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );
            this.pBaseMethod.dispose();
		}

		/**
		 * @inheritDoc
		 */
		public get alphaThreshold():number
		{
			return this.pBaseMethod.alphaThreshold;
		}
		
		public set alphaThreshold(value:number)
		{
            this.pBaseMethod.alphaThreshold = value;
		}
		
		/**
		 * @inheritDoc
		 */
		public get texture():away.textures.Texture2DBase
		{
			return this.pBaseMethod.texture;
		}
		
		/**
		 * @inheritDoc
		 */
		public set texture(value:away.textures.Texture2DBase)
		{
            this.pBaseMethod.texture = value;
		}
		
		/**
		 * @inheritDoc
		 */
		public get diffuseAlpha():number
		{
			return this.pBaseMethod.diffuseAlpha;
		}
		
		/**
		 * @inheritDoc
		 */
		public get diffuseColor():number
		{
			return this.pBaseMethod.diffuseColor;
		}
		
		/**
		 * @inheritDoc
		 */
		public set diffuseColor(diffuseColor:number)
		{
            this.pBaseMethod.diffuseColor = diffuseColor;
		}
		
		/**
		 * @inheritDoc
		 */
		public set diffuseAlpha(value:number)
		{
            this.pBaseMethod.diffuseAlpha = value;
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetFragmentPreLightingCode(vo:away.materials.MethodVO, regCache:away.materials.ShaderRegisterCache):string
		{
			return this.pBaseMethod.iGetFragmentPreLightingCode(vo, regCache);
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetFragmentCodePerLight(vo:MethodVO, lightDirReg:away.materials.ShaderRegisterElement, lightColReg:away.materials.ShaderRegisterElement, regCache:away.materials.ShaderRegisterCache):string
		{
			var code:string = this.pBaseMethod.iGetFragmentCodePerLight(vo, lightDirReg, lightColReg, regCache);
			this.pTotalLightColorReg = this.pBaseMethod.pTotalLightColorReg;
			return code;
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetFragmentCodePerProbe(vo:away.materials.MethodVO, cubeMapReg:away.materials.ShaderRegisterElement, weightRegister:string, regCache:away.materials.ShaderRegisterCache):string
		{
			var code:string = this.pBaseMethod.iGetFragmentCodePerProbe(vo, cubeMapReg, weightRegister, regCache);
			this.pTotalLightColorReg = this.pBaseMethod.pTotalLightColorReg;
			return code;
		}
		
		/**
		 * @inheritDoc
		 */
		public iActivate(vo:away.materials.MethodVO, stage3DProxy:away.managers.Stage3DProxy):void
		{
            this.pBaseMethod.iActivate(vo, stage3DProxy);
		}

		/**
		 * @inheritDoc
		 */
		public iDeactivate(vo:away.materials.MethodVO, stage3DProxy:away.managers.Stage3DProxy):void
		{
            this.pBaseMethod.iDeactivate(vo, stage3DProxy);
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetVertexCode(vo:away.materials.MethodVO, regCache:away.materials.ShaderRegisterCache):string
		{
			return this.pBaseMethod.iGetVertexCode(vo, regCache);
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetFragmentPostLightingCode(vo:away.materials.MethodVO, regCache:away.materials.ShaderRegisterCache, targetReg:away.materials.ShaderRegisterElement):string
		{
			return this.pBaseMethod.iGetFragmentPostLightingCode(vo, regCache, targetReg);
		}
		
		/**
		 * @inheritDoc
		 */
		public iReset():void
		{
            this.pBaseMethod.iReset();
		}

		/**
		 * @inheritDoc
		 */
		public iCleanCompilationData():void
		{
			super.iCleanCompilationData();
            this.pBaseMethod.iCleanCompilationData();
		}
		
		/**
		 * @inheritDoc
		 */

		public set iSharedRegisters(value:away.materials.ShaderRegisterData)
		{
            this.pBaseMethod.setISharedRegisters( value );
            this.setISharedRegisters( value ) ;

		}

		/**
		 * @inheritDoc
		 */
		public set iShadowRegister(value:away.materials.ShaderRegisterElement)
		{
			super.setIShadowRegister( value );
            this.pBaseMethod.setIShadowRegister( value );
		}

		/**
		 * Called when the base method's shader code is invalidated.
		 */
		private onShaderInvalidated(event:away.events.ShadingMethodEvent):void
		{
			this.iInvalidateShaderProgram();
		}
	}
}
