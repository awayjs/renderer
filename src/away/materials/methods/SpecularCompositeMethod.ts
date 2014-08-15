///<reference path="../../_definitions.ts"/>

module away.materials
{
	import Stage                    		= away.base.Stage;
	import Camera							= away.entities.Camera;
	import RenderableBase					= away.pool.RenderableBase;
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
		constructor(modulateMethod:(shaderObject:ShaderObjectBase, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData) => string, baseMethod:SpecularBasicMethod = null)
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
		public iInitVO(shaderObject:ShaderLightingObject, methodVO:MethodVO)
		{
			this._baseMethod.iInitVO(shaderObject, methodVO);
		}

		/**
		 * @inheritDoc
		 */
		public iInitConstants(shaderObject:ShaderObjectBase, methodVO:MethodVO)
		{
			this._baseMethod.iInitConstants(shaderObject, methodVO);
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
		public iActivate(shaderObject:ShaderLightingObject, methodVO:MethodVO, stage:Stage)
		{
			this._baseMethod.iActivate(shaderObject, methodVO, stage);
		}

		/**
		 * @inheritDoc
		 */
		public iSetRenderState(shaderObject:ShaderLightingObject, methodVO:MethodVO, renderable:RenderableBase, stage:Stage, camera:Camera)
		{
			this._baseMethod.iSetRenderState(shaderObject, methodVO, renderable, stage, camera);
		}

		/**
		 * @inheritDoc
		 */
		public iDeactivate(shaderObject:ShaderObjectBase, methodVO:MethodVO, stage:Stage)
		{
			this._baseMethod.iDeactivate(shaderObject, methodVO, stage);
		}

		/**
		 * @inheritDoc
		 */
		public iGetVertexCode(shaderObject:ShaderObjectBase, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
		{
			return this._baseMethod.iGetVertexCode(shaderObject, methodVO, registerCache, sharedRegisters);
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentPreLightingCode(shaderObject:ShaderLightingObject, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
		{
			return this._baseMethod.iGetFragmentPreLightingCode(shaderObject, methodVO, registerCache, sharedRegisters);
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCodePerLight(shaderObject:ShaderLightingObject, methodVO:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
		{
			return this._baseMethod.iGetFragmentCodePerLight(shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters);
		}

		/**
		 * @inheritDoc
		 * @return
		 */
		public iGetFragmentCodePerProbe(shaderObject:ShaderLightingObject, methodVO:MethodVO, cubeMapReg:ShaderRegisterElement, weightRegister:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
		{
			return this._baseMethod.iGetFragmentCodePerProbe(shaderObject, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters);
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentPostLightingCode(shaderObject:ShaderLightingObject, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
		{
			return this._baseMethod.iGetFragmentPostLightingCode(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
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
		 * Called when the base method's shader code is invalidated.
		 */
		private onShaderInvalidated(event:ShadingMethodEvent)
		{
			this.iInvalidateShaderProgram();
		}
	}
}
