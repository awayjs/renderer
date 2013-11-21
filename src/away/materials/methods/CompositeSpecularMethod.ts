///<reference path="../../_definitions.ts"/>

module away.materials
{

	/**
	 * CompositeSpecularMethod provides a base class for specular methods that wrap a specular method to alter the
	 * calculated specular reflection strength.
	 */
	export class CompositeSpecularMethod extends away.materials.BasicSpecularMethod
	{
		private _baseMethod:away.materials.BasicSpecularMethod;

		/**
		 * Creates a new WrapSpecularMethod object.
		 * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature modSpecular(t : ShaderRegisterElement, regCache : ShaderRegisterCache) : string, in which t.w will contain the specular strength and t.xyz will contain the half-vector or the reflection vector.
		 * @param baseSpecularMethod The base specular method on which this method's shading is based.
		 */
			constructor(scope:Object, modulateMethod:Function, baseSpecularMethod:away.materials.BasicSpecularMethod = null)
		{
			super();

			if (scope != null && modulateMethod != null)
				this._pInitCompositeSpecularMethod(scope, modulateMethod, baseSpecularMethod);
		}

		public _pInitCompositeSpecularMethod(scope:Object, modulateMethod:Function, baseSpecularMethod:away.materials.BasicSpecularMethod = null)
		{
			this._baseMethod = baseSpecularMethod || new away.materials.BasicSpecularMethod();
			this._baseMethod._iModulateMethod = modulateMethod;
			this._baseMethod._iModulateMethodScope = scope;
			this._baseMethod.addEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated, this);
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(vo:away.materials.MethodVO):void
		{
			this._baseMethod.iInitVO(vo);
		}

		/**
		 * @inheritDoc
		 */
		public iInitConstants(vo:away.materials.MethodVO):void
		{
			this._baseMethod.iInitConstants(vo);
		}

		/**
		 * The base specular method on which this method's shading is based.
		 */
		public get baseMethod():away.materials.BasicSpecularMethod
		{
			return this._baseMethod;
		}

		public set baseMethod(value:away.materials.BasicSpecularMethod)
		{
			if (this._baseMethod == value)
				return;
			this._baseMethod.removeEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated, this);
			this._baseMethod = value;
			this._baseMethod.addEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated, this);
			this.iInvalidateShaderProgram();
		}

		/**
		 * @inheritDoc
		 */
		public get gloss():number
		{
			return this._baseMethod.gloss;
		}

		public set gloss(value:number)
		{
			this._baseMethod.gloss = value;
		}

		/**
		 * @inheritDoc
		 */
		public get specular():number
		{
			return this._baseMethod.specular;
		}

		public set specular(value:number)
		{
			this._baseMethod.specular = value;
		}

		/**
		 * @inheritDoc
		 */
		public get passes():Array<away.materials.MaterialPassBase>
		{
			return this._baseMethod.passes;
		}

		/**
		 * @inheritDoc
		 */
		public dispose():void
		{
			this._baseMethod.removeEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated, this);
			this._baseMethod.dispose();
		}

		/**
		 * @inheritDoc
		 */
		public get texture():away.textures.Texture2DBase
		{
			return this._baseMethod.texture;
		}

		public set texture(value:away.textures.Texture2DBase)
		{
			this._baseMethod.texture = value;
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(vo:away.materials.MethodVO, stage3DProxy:away.managers.Stage3DProxy):void
		{
			this._baseMethod.iActivate(vo, stage3DProxy);
		}

		/**
		 * @inheritDoc
		 */
		public iDeactivate(vo:away.materials.MethodVO, stage3DProxy:away.managers.Stage3DProxy):void
		{
			this._baseMethod.iDeactivate(vo, stage3DProxy);
		}

		/**
		 * @inheritDoc
		 */
		public set iSharedRegisters(value:away.materials.ShaderRegisterData)
		{
			super.setISharedRegisters(value);
			this._baseMethod.setISharedRegisters(value);
		}

		public setISharedRegisters(value:away.materials.ShaderRegisterData)
		{
			super.setISharedRegisters(value);
			this._baseMethod.setISharedRegisters(value);
		}

		/**
		 * @inheritDoc
		 */
		public iGetVertexCode(vo:away.materials.MethodVO, regCache:away.materials.ShaderRegisterCache):string
		{
			return this._baseMethod.iGetVertexCode(vo, regCache);
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentPreLightingCode(vo:away.materials.MethodVO, regCache:away.materials.ShaderRegisterCache):string
		{
			return this._baseMethod.iGetFragmentPreLightingCode(vo, regCache);
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCodePerLight(vo:away.materials.MethodVO, lightDirReg:away.materials.ShaderRegisterElement, lightColReg:away.materials.ShaderRegisterElement, regCache:away.materials.ShaderRegisterCache):string
		{
			return this._baseMethod.iGetFragmentCodePerLight(vo, lightDirReg, lightColReg, regCache);
		}

		/**
		 * @inheritDoc
		 * @return
		 */
		public iGetFragmentCodePerProbe(vo:away.materials.MethodVO, cubeMapReg:away.materials.ShaderRegisterElement, weightRegister:string, regCache:away.materials.ShaderRegisterCache):string
		{
			return this._baseMethod.iGetFragmentCodePerProbe(vo, cubeMapReg, weightRegister, regCache);
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentPostLightingCode(vo:away.materials.MethodVO, regCache:away.materials.ShaderRegisterCache, targetReg:away.materials.ShaderRegisterElement):string
		{
			return this._baseMethod.iGetFragmentPostLightingCode(vo, regCache, targetReg);
		}

		/**
		 * @inheritDoc
		 */
		public iReset():void
		{
			this._baseMethod.iReset();
		}

		/**
		 * @inheritDoc
		 */
		public iCleanCompilationData():void
		{
			super.iCleanCompilationData();
			this._baseMethod.iCleanCompilationData();
		}

		/**
		 * @inheritDoc
		 */
		public set iShadowRegister(value:away.materials.ShaderRegisterElement)
		{

			this.setIShadowRegister(value);
			this._baseMethod.setIShadowRegister(value);
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
