///<reference path="../../_definitions.ts"/>
module away.materials
{

	/**
	 * ShaderMethodSetup contains the method configuration for an entire material.
	 */
	export class ShaderMethodSetup extends away.events.EventDispatcher
	{
		public _iColorTransformMethod:away.materials.ColorTransformMethod;
        public _iColorTransformMethodVO:away.materials.MethodVO;
        public _iNormalMethod:away.materials.BasicNormalMethod;
        public _iNormalMethodVO:away.materials.MethodVO;
        public _iAmbientMethod:away.materials.BasicAmbientMethod;
        public _iAmbientMethodVO:away.materials.MethodVO;
        public _iShadowMethod:away.materials.ShadowMapMethodBase;
        public _iShadowMethodVO:away.materials.MethodVO;
        public _iDiffuseMethod:away.materials.BasicDiffuseMethod;
        public _iDiffuseMethodVO:away.materials.MethodVO;
        public _iSpecularMethod:away.materials.BasicSpecularMethod;
        public _iSpecularMethodVO:away.materials.MethodVO;
        public _iMethods:away.materials.MethodVOSet[];//Vector.<MethodVOSet>;

		/**
		 * Creates a new ShaderMethodSetup object.
		 */
		constructor()
		{

            super();

			this._iMethods = new Array<away.materials.MethodVOSet>();//Vector.<MethodVOSet>();
            this._iNormalMethod = new away.materials.BasicNormalMethod();
            this._iAmbientMethod = new away.materials.BasicAmbientMethod();
            this._iDiffuseMethod = new away.materials.BasicDiffuseMethod();
            this._iSpecularMethod = new away.materials.BasicSpecularMethod();
            this._iNormalMethod.addEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated, this);
            this._iDiffuseMethod.addEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated, this);
            this._iSpecularMethod.addEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated, this);
            this._iAmbientMethod.addEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this);
            this._iNormalMethodVO = this._iNormalMethod.iCreateMethodVO();
            this._iAmbientMethodVO = this._iAmbientMethod.iCreateMethodVO();
            this._iDiffuseMethodVO = this._iDiffuseMethod.iCreateMethodVO();
            this._iSpecularMethodVO = this._iSpecularMethod.iCreateMethodVO();
		}

		/**
		 * Called when any method's code is invalidated.
		 */
		private onShaderInvalidated(event:away.events.ShadingMethodEvent)
		{
			this.invalidateShaderProgram();
		}

		/**
		 * Invalidates the material's shader code.
		 */
		private invalidateShaderProgram()
		{

			this.dispatchEvent( new away.events.ShadingMethodEvent(away.events.ShadingMethodEvent.SHADER_INVALIDATED) );

		}

		/**
		 *  The method used to generate the per-pixel normals.
		 */
		public get normalMethod():away.materials.BasicNormalMethod
		{
			return this._iNormalMethod;
		}
		
		public set normalMethod(value:away.materials.BasicNormalMethod)
		{
			if (this._iNormalMethod)
            {

                this._iNormalMethod.removeEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );

            }

			
			if (value)
            {

				if (this._iNormalMethod)
                {

                    value.copyFrom(this._iNormalMethod);

                }


				this._iNormalMethodVO = value.iCreateMethodVO();
				value.addEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );
			}
			
			this._iNormalMethod = value;
			
			if (value)
				this.invalidateShaderProgram();
		}

		/**
		 * The method that provides the ambient lighting contribution.
		 */
		public get ambientMethod():away.materials.BasicAmbientMethod
		{
			return this._iAmbientMethod;
		}
		
		public set ambientMethod(value:away.materials.BasicAmbientMethod)
		{
			if (this._iAmbientMethod)
				this._iAmbientMethod.removeEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );

			if (value)
            {

				if (this._iAmbientMethod)
					value.copyFrom(this._iAmbientMethod);

				value.addEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );
				this._iAmbientMethodVO = value.iCreateMethodVO();

			}
			this._iAmbientMethod = value;
			
			if (value)
				this.invalidateShaderProgram();
		}

		/**
		 * The method used to render shadows cast on this surface, or null if no shadows are to be rendered.
		 */
		public get shadowMethod():away.materials.ShadowMapMethodBase
		{
			return this._iShadowMethod;
		}
		
		public set shadowMethod(value:away.materials.ShadowMapMethodBase)
		{
			if (this._iShadowMethod)
            {

                this._iShadowMethod.removeEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );

            }

			this._iShadowMethod = value;

			if ( this._iShadowMethod)
            {

				this._iShadowMethod.addEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );
				this._iShadowMethodVO = this._iShadowMethod.iCreateMethodVO();

			}
            else
            {

                this._iShadowMethodVO = null;

            }

			this.invalidateShaderProgram();

		}

		/**
		 * The method that provides the diffuse lighting contribution.
		 */
		 public get diffuseMethod():away.materials.BasicDiffuseMethod
		{
			return this._iDiffuseMethod;
		}
		
		public set diffuseMethod(value:away.materials.BasicDiffuseMethod)
		{
			if (this._iDiffuseMethod)
				this._iDiffuseMethod.removeEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );
			
			if (value)
            {

				if (this._iDiffuseMethod)
					value.copyFrom( this._iDiffuseMethod);

				value.addEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );

				this._iDiffuseMethodVO = value.iCreateMethodVO();
			}
			
			this._iDiffuseMethod = value;
			
			if (value)
				this.invalidateShaderProgram();

		}
		
		/**
		 * The method to perform specular shading.
		 */
		public get specularMethod():away.materials.BasicSpecularMethod
		{
			return this._iSpecularMethod;
		}
		
		public set specularMethod(value:away.materials.BasicSpecularMethod)
		{
			if (this._iSpecularMethod)
            {
				this._iSpecularMethod.removeEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );

				if (value)
					value.copyFrom(this._iSpecularMethod);

			}
			
			this._iSpecularMethod = value;
			if (this._iSpecularMethod)
            {

				this._iSpecularMethod.addEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );
				this._iSpecularMethodVO = this._iSpecularMethod.iCreateMethodVO();

			}
            else
            {

                this._iSpecularMethodVO = null;

            }

			this.invalidateShaderProgram();

		}
		
		/**
		 * @private
		 */
		public get iColorTransformMethod():away.materials.ColorTransformMethod
		{
			return this._iColorTransformMethod;
		}
		
		public set iColorTransformMethod(value:away.materials.ColorTransformMethod)
		{
			if (this._iColorTransformMethod == value)
				return;

			if (this._iColorTransformMethod)
				this._iColorTransformMethod.removeEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );

			if (!this._iColorTransformMethod || !value)
            {

                this.invalidateShaderProgram();

            }

			
			this._iColorTransformMethod = value;

			if (this._iColorTransformMethod)
            {
				this._iColorTransformMethod.addEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );
				this._iColorTransformMethodVO = this._iColorTransformMethod.iCreateMethodVO();

			}
            else
            {

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
            {

                this.clearListeners(this._iMethods[i].method);

            }

			
			this._iMethods = null;

		}

		/**
		 * Removes all listeners from a method.
		 */
		private clearListeners(method:away.materials.ShadingMethodBase)
		{
			if (method)
				method.removeEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );
		}
		
		/**
		 * Adds a method to change the material after all lighting is performed.
		 * @param method The method to be added.
		 */
		public addMethod(method:away.materials.EffectMethodBase)
		{
			this._iMethods.push(new away.materials.MethodVOSet(method));

			method.addEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );

			this.invalidateShaderProgram();

		}

		/**
		 * Queries whether a given effect method was added to the material.
		 *
		 * @param method The method to be queried.
		 * @return true if the method was added to the material, false otherwise.
		 */
		public hasMethod(method:away.materials.EffectMethodBase):boolean
		{

			return this.getMethodSetForMethod(method) != null;

		}
		
		/**
		 * Inserts a method to change the material after all lighting is performed at the given index.
		 * @param method The method to be added.
		 * @param index The index of the method's occurrence
		 */
		public addMethodAt(method:away.materials.EffectMethodBase, index:number)
		{
			this._iMethods.splice(index, 0, new away.materials.MethodVOSet(method));

			method.addEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );

			this.invalidateShaderProgram();

		}

		/**
		 * Returns the method added at the given index.
		 * @param index The index of the method to retrieve.
		 * @return The method at the given index.
		 */
		public getMethodAt(index:number):away.materials.EffectMethodBase
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
		public removeMethod(method:away.materials.EffectMethodBase)
		{
			var methodSet:away.materials.MethodVOSet = this.getMethodSetForMethod(method);

			if (methodSet != null)
            {
				var index:number = this._iMethods.indexOf(methodSet);

				this._iMethods.splice(index, 1);

				method.removeEventListener(away.events.ShadingMethodEvent.SHADER_INVALIDATED, this.onShaderInvalidated , this );

				this.invalidateShaderProgram();

			}
		}
		
		private getMethodSetForMethod(method:away.materials.EffectMethodBase):away.materials.MethodVOSet
		{
			var len:number = this._iMethods.length;

			for (var i:number = 0; i < len; ++i)
            {
				if (this._iMethods[i].method == method)
					return this._iMethods[i];
			}
			
			return null;
		}
	}
}
