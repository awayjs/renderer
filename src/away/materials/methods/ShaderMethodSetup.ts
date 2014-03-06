///<reference path="../../_definitions.ts"/>
module away.materials
{
	import Delegate							= away.utils.Delegate;

	import ShadingMethodEvent				= away.events.ShadingMethodEvent;

	/**
	 * ShaderMethodSetup contains the method configuration for an entire material.
	 */
	export class ShaderMethodSetup extends away.events.EventDispatcher
	{
		public _iColorTransformMethod:EffectColorTransformMethod;
		public _iColorTransformMethodVO:MethodVO;
		public _iNormalMethod:NormalBasicMethod;
		public _iNormalMethodVO:MethodVO;
		public _iAmbientMethod:AmbientBasicMethod;
		public _iAmbientMethodVO:MethodVO;
		public _iShadowMethod:ShadowMapMethodBase;
		public _iShadowMethodVO:MethodVO;
		public _iDiffuseMethod:DiffuseBasicMethod;
		public _iDiffuseMethodVO:MethodVO;
		public _iSpecularMethod:SpecularBasicMethod;
		public _iSpecularMethodVO:MethodVO;
		public _iMethods:Array<MethodVOSet>;

		private _onShaderInvalidatedDelegate:Function;

		/**
		 * Creates a new <code>ShaderMethodSetup</code> object.
		 */
		constructor()
		{
			super();

			this._onShaderInvalidatedDelegate = Delegate.create(this, this.onShaderInvalidated);

			this._iMethods = new Array<MethodVOSet>();
			this._iNormalMethod = new NormalBasicMethod();
			this._iAmbientMethod = new AmbientBasicMethod();
			this._iDiffuseMethod = new DiffuseBasicMethod();
			this._iSpecularMethod = new SpecularBasicMethod();

			this._iNormalMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
			this._iDiffuseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
			this._iSpecularMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
			this._iAmbientMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

			this._iNormalMethodVO = this._iNormalMethod.iCreateMethodVO();
			this._iAmbientMethodVO = this._iAmbientMethod.iCreateMethodVO();
			this._iDiffuseMethodVO = this._iDiffuseMethod.iCreateMethodVO();
			this._iSpecularMethodVO = this._iSpecularMethod.iCreateMethodVO();
		}

		/**
		 * Called when any method's code is invalidated.
		 */
		private onShaderInvalidated(event:ShadingMethodEvent)
		{
			this.iInvalidateShaderProgram();
		}

		/**
		 * Invalidates the material's shader code.
		 */
		private iInvalidateShaderProgram()
		{
			this.dispatchEvent(new ShadingMethodEvent(ShadingMethodEvent.SHADER_INVALIDATED));

		}

		/**
		 *  The method used to generate the per-pixel normals.
		 */
		public get normalMethod():NormalBasicMethod
		{
			return this._iNormalMethod;
		}

		public set normalMethod(value:NormalBasicMethod)
		{
			if (this._iNormalMethod)
				this._iNormalMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

			if (value) {
				if (this._iNormalMethod)
					value.copyFrom(this._iNormalMethod);

				this._iNormalMethodVO = value.iCreateMethodVO();
				value.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
			}

			this._iNormalMethod = value;

			if (value)
				this.iInvalidateShaderProgram();
		}

		/**
		 * The method that provides the ambient lighting contribution.
		 */
		public get ambientMethod():AmbientBasicMethod
		{
			return this._iAmbientMethod;
		}

		public set ambientMethod(value:AmbientBasicMethod)
		{
			if (this._iAmbientMethod)
				this._iAmbientMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

			if (value) {
				if (this._iAmbientMethod)
					value.copyFrom(this._iAmbientMethod);

				value.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
				this._iAmbientMethodVO = value.iCreateMethodVO();
			}

			this._iAmbientMethod = value;

			if (value)
				this.iInvalidateShaderProgram();
		}

		/**
		 * The method used to render shadows cast on this surface, or null if no shadows are to be rendered.
		 */
		public get shadowMethod():ShadowMapMethodBase
		{
			return this._iShadowMethod;
		}

		public set shadowMethod(value:ShadowMapMethodBase)
		{
			if (this._iShadowMethod)
				this._iShadowMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

			this._iShadowMethod = value;

			if (this._iShadowMethod) {
				this._iShadowMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
				this._iShadowMethodVO = this._iShadowMethod.iCreateMethodVO();
			} else {
				this._iShadowMethodVO = null;

			}

			this.iInvalidateShaderProgram();

		}

		/**
		 * The method that provides the diffuse lighting contribution.
		 */
		public get diffuseMethod():DiffuseBasicMethod
		{
			return this._iDiffuseMethod;
		}

		public set diffuseMethod(value:DiffuseBasicMethod)
		{
			if (this._iDiffuseMethod)
				this._iDiffuseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

			if (value) {
				if (this._iDiffuseMethod)
					value.copyFrom(this._iDiffuseMethod);

				value.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

				this._iDiffuseMethodVO = value.iCreateMethodVO();
			}

			this._iDiffuseMethod = value;

			if (value)
				this.iInvalidateShaderProgram();

		}

		/**
		 * The method to perform specular shading.
		 */
		public get specularMethod():SpecularBasicMethod
		{
			return this._iSpecularMethod;
		}

		public set specularMethod(value:SpecularBasicMethod)
		{
			if (this._iSpecularMethod) {
				this._iSpecularMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

				if (value)
					value.copyFrom(this._iSpecularMethod);

			}

			this._iSpecularMethod = value;

			if (this._iSpecularMethod) {
				this._iSpecularMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

				this._iSpecularMethodVO = this._iSpecularMethod.iCreateMethodVO();
			} else {
				this._iSpecularMethodVO = null;
			}

			this.iInvalidateShaderProgram();

		}

		/**
		 * @private
		 */
		public get iColorTransformMethod():EffectColorTransformMethod
		{
			return this._iColorTransformMethod;
		}

		public set iColorTransformMethod(value:EffectColorTransformMethod)
		{
			if (this._iColorTransformMethod == value)
				return;

			if (this._iColorTransformMethod)
				this._iColorTransformMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

			if (!this._iColorTransformMethod || !value)
				this.iInvalidateShaderProgram();


			this._iColorTransformMethod = value;

			if (this._iColorTransformMethod) {
				this._iColorTransformMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

				this._iColorTransformMethodVO = this._iColorTransformMethod.iCreateMethodVO();
			} else {
				this._iColorTransformMethodVO = null;

			}

		}

		/**
		 * Disposes the object.
		 */
		public dispose()
		{
			this.clearListeners(this._iNormalMethod);
			this.clearListeners(this._iDiffuseMethod);
			this.clearListeners(this._iShadowMethod);
			this.clearListeners(this._iAmbientMethod);
			this.clearListeners(this._iSpecularMethod);

			for (var i:number = 0; i < this._iMethods.length; ++i)
				this.clearListeners(this._iMethods[i].method);

			this._iMethods = null;

		}

		/**
		 * Removes all listeners from a method.
		 */
		private clearListeners(method:ShadingMethodBase)
		{
			if (method)
				method.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
		}

		/**
		 * Adds a method to change the material after all lighting is performed.
		 * @param method The method to be added.
		 */
		public addMethod(method:EffectMethodBase)
		{
			this._iMethods.push(new MethodVOSet(method));

			method.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

			this.iInvalidateShaderProgram();

		}

		/**
		 * Queries whether a given effect method was added to the material.
		 *
		 * @param method The method to be queried.
		 * @return true if the method was added to the material, false otherwise.
		 */
		public hasMethod(method:EffectMethodBase):boolean
		{
			return this.getMethodSetForMethod(method) != null;

		}

		/**
		 * Inserts a method to change the material after all lighting is performed at the given index.
		 * @param method The method to be added.
		 * @param index The index of the method's occurrence
		 */
		public addMethodAt(method:EffectMethodBase, index:number)
		{
			this._iMethods.splice(index, 0, new MethodVOSet(method));

			method.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

			this.iInvalidateShaderProgram();
		}

		/**
		 * Returns the method added at the given index.
		 * @param index The index of the method to retrieve.
		 * @return The method at the given index.
		 */
		public getMethodAt(index:number):EffectMethodBase
		{
			if (index > this._iMethods.length - 1)
				return null;

			return this._iMethods[index].method;
		}

		/**
		 * The number of "effect" methods added to the material.
		 */
		public get numMethods():number
		{
			return this._iMethods.length;
		}

		/**
		 * Removes a method from the pass.
		 * @param method The method to be removed.
		 */
		public removeMethod(method:EffectMethodBase)
		{
			var methodSet:MethodVOSet = this.getMethodSetForMethod(method);

			if (methodSet != null) {
				var index:number = this._iMethods.indexOf(methodSet);

				this._iMethods.splice(index, 1);

				method.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

				this.iInvalidateShaderProgram();
			}
		}

		private getMethodSetForMethod(method:EffectMethodBase):MethodVOSet
		{
			var len:number = this._iMethods.length;

			for (var i:number = 0; i < len; ++i)
				if (this._iMethods[i].method == method)
					return this._iMethods[i];

			return null;
		}
	}
}
