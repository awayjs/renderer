///<reference path="../../_definitions.ts"/>
module away.materials
{
	import StageGL                     = away.base.StageGL;
	import Texture2DBase					= away.textures.Texture2DBase;
	import Delegate							= away.utils.Delegate;

	import ShadingMethodEvent               = away.events.ShadingMethodEvent;

	/**
	 * CompositeDiffuseMethod provides a base class for diffuse methods that wrap a diffuse method to alter the
	 * calculated diffuse reflection strength.
	 */
	export class CompositeDiffuseMethod extends BasicDiffuseMethod
	{
		public pBaseMethod:BasicDiffuseMethod;

		private _onShaderInvalidatedDelegate:Function;

		/**
		 * Creates a new WrapDiffuseMethod object.
		 * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature clampDiffuse(t : ShaderRegisterElement, regCache : ShaderRegisterCache) : string, in which t.w will contain the diffuse strength.
		 * @param baseDiffuseMethod The base diffuse method on which this method's shading is based.
		 */
		constructor(scope:Object, modulateMethod:Function = null, baseDiffuseMethod:BasicDiffuseMethod = null)
		{
			super();

			this._onShaderInvalidatedDelegate = Delegate.create(this, this.onShaderInvalidated);

			if (scope != null && modulateMethod != null)
				this._pInitCompositeDiffuseMethod(scope, modulateMethod, baseDiffuseMethod);
		}

		public _pInitCompositeDiffuseMethod(scope:Object, modulateMethod:Function, baseDiffuseMethod:BasicDiffuseMethod = null)
		{
			this.pBaseMethod = baseDiffuseMethod || new BasicDiffuseMethod();
			this.pBaseMethod._iModulateMethod = modulateMethod;
			this.pBaseMethod._iModulateMethodScope = scope;
			this.pBaseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
		}

		/**
		 * The base diffuse method on which this method's shading is based.
		 */
		public get baseMethod():BasicDiffuseMethod
		{
			return this.pBaseMethod;
		}

		public set baseMethod(value:BasicDiffuseMethod)
		{
			if (this.pBaseMethod == value)
				return;

			this.pBaseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
			this.pBaseMethod = value;
			this.pBaseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
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
			this.pBaseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
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
		public get texture():Texture2DBase
		{
			return this.pBaseMethod.texture;
		}

		/**
		 * @inheritDoc
		 */
		public set texture(value:Texture2DBase)
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
		public iGetFragmentPreLightingCode(vo:MethodVO, regCache:ShaderRegisterCache):string
		{
			return this.pBaseMethod.iGetFragmentPreLightingCode(vo, regCache);
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCodePerLight(vo:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, regCache:ShaderRegisterCache):string
		{
			var code:string = this.pBaseMethod.iGetFragmentCodePerLight(vo, lightDirReg, lightColReg, regCache);
			this.pTotalLightColorReg = this.pBaseMethod.pTotalLightColorReg;
			return code;
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCodePerProbe(vo:MethodVO, cubeMapReg:ShaderRegisterElement, weightRegister:string, regCache:ShaderRegisterCache):string
		{
			var code:string = this.pBaseMethod.iGetFragmentCodePerProbe(vo, cubeMapReg, weightRegister, regCache);
			this.pTotalLightColorReg = this.pBaseMethod.pTotalLightColorReg;
			return code;
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stageGL:away.base.StageGL):void
		{
			this.pBaseMethod.iActivate(vo, stageGL);
		}

		/**
		 * @inheritDoc
		 */
		public iDeactivate(vo:MethodVO, stageGL:away.base.StageGL):void
		{
			this.pBaseMethod.iDeactivate(vo, stageGL);
		}

		/**
		 * @inheritDoc
		 */
		public iGetVertexCode(vo:MethodVO, regCache:ShaderRegisterCache):string
		{
			return this.pBaseMethod.iGetVertexCode(vo, regCache);
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentPostLightingCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
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

		public set iSharedRegisters(value:ShaderRegisterData)
		{
			this.pBaseMethod.setISharedRegisters(value);
			super.setISharedRegisters(value);

		}

		public setISharedRegisters(value:ShaderRegisterData)
		{
			this.pBaseMethod.setISharedRegisters(value);
			super.setISharedRegisters(value);

		}

		/**
		 * @inheritDoc
		 */
		public set iShadowRegister(value:ShaderRegisterElement)
		{
			super.setIShadowRegister(value);
			this.pBaseMethod.setIShadowRegister(value);
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
