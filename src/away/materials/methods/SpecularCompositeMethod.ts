///<reference path="../../_definitions.ts"/>

module away.materials
{
	import Stage                    		= away.base.Stage;
	import Texture2DBase					= away.textures.Texture2DBase;
	import Delegate							= away.utils.Delegate;

	import ShadingMethodEvent               = away.events.ShadingMethodEvent;

	/**
	 * SpecularCompositeMethod provides a base class for specular methods that wrap a specular method to alter the
	 * calculated specular reflection strength.
	 */
	export class SpecularCompositeMethod extends SpecularBasicMethod
	{
		private _baseMethod:SpecularBasicMethod;

		private _onShaderInvalidatedDelegate:Function;

		/**
		 * Creates a new <code>SpecularCompositeMethod</code> object.
		 *
		 * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature modSpecular(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the specular strength and t.xyz will contain the half-vector or the reflection vector.
		 * @param baseMethod The base specular method on which this method's shading is based.
		 */
		constructor(modulateMethod:Function, baseMethod:SpecularBasicMethod = null)
		{
			super();

			this._onShaderInvalidatedDelegate = Delegate.create(this, this.onShaderInvalidated);

			this._baseMethod = baseMethod || new SpecularBasicMethod();
			this._baseMethod._iModulateMethod = modulateMethod;
			this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(vo:MethodVO)
		{
			this._baseMethod.iInitVO(vo);
		}

		/**
		 * @inheritDoc
		 */
		public iInitConstants(vo:MethodVO)
		{
			this._baseMethod.iInitConstants(vo);
		}

		/**
		 * The base specular method on which this method's shading is based.
		 */
		public get baseMethod():SpecularBasicMethod
		{
			return this._baseMethod;
		}

		public set baseMethod(value:SpecularBasicMethod)
		{
			if (this._baseMethod == value)
				return;

			this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
			this._baseMethod = value;
			this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
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
		public get passes():Array<MaterialPassBase>
		{
			return this._baseMethod.passes;
		}

		/**
		 * @inheritDoc
		 */
		public dispose()
		{
			this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
			this._baseMethod.dispose();
		}

		/**
		 * @inheritDoc
		 */
		public get texture():Texture2DBase
		{
			return this._baseMethod.texture;
		}

		public set texture(value:Texture2DBase)
		{
			this._baseMethod.texture = value;
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stage:Stage)
		{
			this._baseMethod.iActivate(vo, stage);
		}

		/**
		 * @inheritDoc
		 */
		public iDeactivate(vo:MethodVO, stage:Stage)
		{
			this._baseMethod.iDeactivate(vo, stage);
		}

		/**
		 * @inheritDoc
		 */
		public set iSharedRegisters(value:ShaderRegisterData)
		{
			super.setISharedRegisters(value);
			this._baseMethod.setISharedRegisters(value);
		}

		public setISharedRegisters(value:ShaderRegisterData)
		{
			super.setISharedRegisters(value);
			this._baseMethod.setISharedRegisters(value);
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
		public iGetFragmentPreLightingCode(vo:MethodVO, regCache:ShaderRegisterCache):string
		{
			return this._baseMethod.iGetFragmentPreLightingCode(vo, regCache);
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCodePerLight(vo:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, regCache:ShaderRegisterCache):string
		{
			return this._baseMethod.iGetFragmentCodePerLight(vo, lightDirReg, lightColReg, regCache);
		}

		/**
		 * @inheritDoc
		 * @return
		 */
		public iGetFragmentCodePerProbe(vo:MethodVO, cubeMapReg:ShaderRegisterElement, weightRegister:string, regCache:ShaderRegisterCache):string
		{
			return this._baseMethod.iGetFragmentCodePerProbe(vo, cubeMapReg, weightRegister, regCache);
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentPostLightingCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			return this._baseMethod.iGetFragmentPostLightingCode(vo, regCache, targetReg);
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
		public set iShadowRegister(value:ShaderRegisterElement)
		{

			this.setIShadowRegister(value);
			this._baseMethod.setIShadowRegister(value);
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
