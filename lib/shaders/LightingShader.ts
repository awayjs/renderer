import {Matrix3D, Vector3D, ProjectionBase}	 from "@awayjs/core";

import {DirectionalLight, LightProbe, PointLight, LightSources} from "@awayjs/graphics";

import {ContextGLProfile, Stage, GL_ImageBase, IElementsClassGL, GL_RenderableBase, CompilerBase, ShaderBase} from "@awayjs/stage";

import {ILightingPass} from "../materials/passes/ILightingPass";

import {LightingCompiler} from "./compilers/LightingCompiler";


/**
 * ShaderBase keeps track of the number of dependencies for "named registers" used across a pass.
 * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
 * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
 * each time a method has been compiled into the shader.
 *
 * @see RegisterPool.addUsage
 */
export class LightingShader extends ShaderBase
{
	public _lightingPass:ILightingPass;

	private _includeCasters:boolean = true;

	/**
	 * The first index for the fragment constants containing the light data.
	 */
	public lightFragmentConstantIndex:number;

	/**
	 * The starting index if the vertex constant to which light data needs to be uploaded.
	 */
	public lightVertexConstantIndex:number;

	/**
	 * Indices for the light probe diffuse textures.
	 */
	public lightProbeDiffuseIndices:Array<number> /*uint*/;

	/**
	 * Indices for the light probe specular textures.
	 */
	public lightProbeSpecularIndices:Array<number> /*uint*/;

	/**
	 * The index of the fragment constant containing the weights for the light probes.
	 */
	public probeWeightsIndex:number;

	public numDirectionalLights:number;
	public numPointLights:number;
	public numLightProbes:number;

	public usesLightFallOff:boolean;

	public usesShadows:boolean;

	/**
	 * Indicates whether the shader uses any lights.
	 */
	public usesLights:boolean;

	/**
	 * Indicates whether the shader uses any light probes.
	 */
	public usesProbes:boolean;

	/**
	 * Indicates whether the lights uses any specular components.
	 */
	public usesLightsForSpecular:boolean;

	/**
	 * Indicates whether the probes uses any specular components.
	 */
	public usesProbesForSpecular:boolean;

	/**
	 * Indicates whether the lights uses any diffuse components.
	 */
	public usesLightsForDiffuse:boolean;

	/**
	 * Indicates whether the probes uses any diffuse components.
	 */
	public usesProbesForDiffuse:boolean;

	/**
	 * Creates a new MethodCompilerVO object.
	 */
	constructor(elementsClass:IElementsClassGL, lightingPass:ILightingPass, stage:Stage)
	{
		super(elementsClass, lightingPass, stage);

		this._lightingPass = lightingPass;
	}

	public _includeDependencies():void
	{
		this.numPointLights = this._lightingPass.numPointLights;
		this.numDirectionalLights = this._lightingPass.numDirectionalLights;
		this.numLightProbes = this._lightingPass.numLightProbes;

		var numAllLights:number = this._lightingPass.numPointLights + this._lightingPass.numDirectionalLights;
		var numLightProbes:number = this._lightingPass.numLightProbes;
		var diffuseLightSources:number = this._lightingPass._iUsesDiffuse(this)? this._lightingPass.diffuseLightSources : 0x00;
		var specularLightSources:number = this._lightingPass._iUsesSpecular(this)? this._lightingPass.specularLightSources : 0x00;
		var combinedLightSources:number = diffuseLightSources | specularLightSources;

		this.usesLightFallOff = this._lightingPass.enableLightFallOff && this.profile != ContextGLProfile.BASELINE_CONSTRAINED;
		this.usesCommonData = this.usesLightFallOff || this.usesCommonData;
		this.numLights = numAllLights + numLightProbes;
		this.usesLights = numAllLights > 0 && (combinedLightSources & LightSources.LIGHTS) != 0;
		this.usesProbes = numLightProbes > 0 && (combinedLightSources & LightSources.PROBES) != 0;
		this.usesLightsForSpecular = numAllLights > 0 && (specularLightSources & LightSources.LIGHTS) != 0;
		this.usesProbesForSpecular = numLightProbes > 0 && (specularLightSources & LightSources.PROBES) != 0;
		this.usesLightsForDiffuse = numAllLights > 0 && (diffuseLightSources & LightSources.LIGHTS) != 0;
		this.usesProbesForDiffuse = numLightProbes > 0 && (diffuseLightSources & LightSources.PROBES) != 0;
		this.usesShadows = this._lightingPass._iUsesShadows(this);

		//IMPORTANT this must occur after shader lighting initialisation above
		super._includeDependencies();
	}

	/**
	 * Factory method to create a concrete compiler object for this object
	 *
	 * @param materialPassVO
	 * @returns {away.materials.LightingCompiler}
	 */
	public createCompiler(elementsClass:IElementsClassGL, pass:ILightingPass):CompilerBase
	{
		return new LightingCompiler(elementsClass, pass, this);
	}


	/**
	 *
	 *
	 * @param renderable
	 * @param stage
	 * @param camera
	 */
	public _setRenderState(renderable:GL_RenderableBase, projection:ProjectionBase):void
	{
		super._setRenderState(renderable, projection);

		if (this._lightingPass.lightPicker)
			this._lightingPass.lightPicker.collectLights(renderable.sourceEntity);

		if (this.usesLights)
			this.updateLights();

		if (this.usesProbes)
			this.updateProbes();
	}

	/**
	 * Updates constant data render state used by the lights. This method is optional for subclasses to implement.
	 */
	private updateLights():void
	{
		var dirLight:DirectionalLight;
		var pointLight:PointLight;
		var i:number = 0;
		var k:number = 0;
		var len:number;
		var dirPos:Vector3D;
		var total:number = 0;
		var numLightTypes:number = this.usesShadows? 2 : 1;
		var l:number;
		var offset:number;

		this.ambientR = this.ambientG = this.ambientB = 0;

		l = this.lightVertexConstantIndex;
		k = this.lightFragmentConstantIndex;

		var cast:number = 0;
		var dirLights:Array<DirectionalLight> = this._lightingPass.lightPicker.directionalLights;
		offset = this._lightingPass.directionalLightsOffset;
		len = this._lightingPass.lightPicker.directionalLights.length;

		if (offset > len) {
			cast = 1;
			offset -= len;
		}

		for (; cast < numLightTypes; ++cast) {
			if (cast)
				dirLights = this._lightingPass.lightPicker.castingDirectionalLights;

			len = dirLights.length;

			if (len > this.numDirectionalLights)
				len = this.numDirectionalLights;

			for (i = 0; i < len; ++i) {
				dirLight = dirLights[offset + i];
				dirPos = dirLight.sceneDirection;

				this.ambientR += dirLight._ambientR;
				this.ambientG += dirLight._ambientG;
				this.ambientB += dirLight._ambientB;

				if (this.usesTangentSpace) {
					var x:number = -dirPos.x;
					var y:number = -dirPos.y;
					var z:number = -dirPos.z;

					this.vertexConstantData[l++] = this._pInverseSceneMatrix[0]*x + this._pInverseSceneMatrix[4]*y + this._pInverseSceneMatrix[8]*z;
					this.vertexConstantData[l++] = this._pInverseSceneMatrix[1]*x + this._pInverseSceneMatrix[5]*y + this._pInverseSceneMatrix[9]*z;
					this.vertexConstantData[l++] = this._pInverseSceneMatrix[2]*x + this._pInverseSceneMatrix[6]*y + this._pInverseSceneMatrix[10]*z;
					this.vertexConstantData[l++] = 1;
				} else {
					this.fragmentConstantData[k++] = -dirPos.x;
					this.fragmentConstantData[k++] = -dirPos.y;
					this.fragmentConstantData[k++] = -dirPos.z;
					this.fragmentConstantData[k++] = 1;
				}

				this.fragmentConstantData[k++] = dirLight._diffuseR;
				this.fragmentConstantData[k++] = dirLight._diffuseG;
				this.fragmentConstantData[k++] = dirLight._diffuseB;
				this.fragmentConstantData[k++] = 1;

				this.fragmentConstantData[k++] = dirLight._specularR;
				this.fragmentConstantData[k++] = dirLight._specularG;
				this.fragmentConstantData[k++] = dirLight._specularB;
				this.fragmentConstantData[k++] = 1;

				if (++total == this.numDirectionalLights) {
					// break loop
					i = len;
					cast = numLightTypes;
				}
			}
		}

		// more directional supported than currently picked, need to clamp all to 0
		if (this.numDirectionalLights > total) {
			i = k + (this.numDirectionalLights - total)*12;

			while (k < i)
				this.fragmentConstantData[k++] = 0;
		}

		total = 0;

		var pointLights:Array<PointLight> = this._lightingPass.lightPicker.pointLights;
		offset = this._lightingPass.pointLightsOffset;
		len = this._lightingPass.lightPicker.pointLights.length;

		if (offset > len) {
			cast = 1;
			offset -= len;
		} else {
			cast = 0;
		}

		for (; cast < numLightTypes; ++cast) {
			if (cast)
				pointLights = this._lightingPass.lightPicker.castingPointLights;

			len = pointLights.length;

			for (i = 0; i < len; ++i) {
				pointLight = pointLights[offset + i];
				dirPos = pointLight.transform.concatenatedMatrix3D.position;

				this.ambientR += pointLight._ambientR;
				this.ambientG += pointLight._ambientG;
				this.ambientB += pointLight._ambientB;

				if (this.usesTangentSpace) {
					x = dirPos.x;
					y = dirPos.y;
					z = dirPos.z;

					this.vertexConstantData[l++] = this._pInverseSceneMatrix[0]*x + this._pInverseSceneMatrix[4]*y + this._pInverseSceneMatrix[8]*z + this._pInverseSceneMatrix[12];
					this.vertexConstantData[l++] = this._pInverseSceneMatrix[1]*x + this._pInverseSceneMatrix[5]*y + this._pInverseSceneMatrix[9]*z + this._pInverseSceneMatrix[13];
					this.vertexConstantData[l++] = this._pInverseSceneMatrix[2]*x + this._pInverseSceneMatrix[6]*y + this._pInverseSceneMatrix[10]*z + this._pInverseSceneMatrix[14];
					this.vertexConstantData[l++] = 1;
				} else if (!this.usesGlobalPosFragment) {
					this.vertexConstantData[l++] = dirPos.x;
					this.vertexConstantData[l++] = dirPos.y;
					this.vertexConstantData[l++] = dirPos.z;
					this.vertexConstantData[l++] = 1;
				} else {
					this.fragmentConstantData[k++] = dirPos.x;
					this.fragmentConstantData[k++] = dirPos.y;
					this.fragmentConstantData[k++] = dirPos.z;
					this.fragmentConstantData[k++] = 1;
				}

				this.fragmentConstantData[k++] = pointLight._diffuseR;
				this.fragmentConstantData[k++] = pointLight._diffuseG;
				this.fragmentConstantData[k++] = pointLight._diffuseB;

				var radius:number = pointLight.radius;
				this.fragmentConstantData[k++] = radius*radius;

				this.fragmentConstantData[k++] = pointLight._specularR;
				this.fragmentConstantData[k++] = pointLight._specularG;
				this.fragmentConstantData[k++] = pointLight._specularB;
				this.fragmentConstantData[k++] = pointLight.fallOffFactor;

				if (++total == this.numPointLights) {
					// break loop
					i = len;
					cast = numLightTypes;
				}
			}
		}

		// more directional supported than currently picked, need to clamp all to 0
		if (this.numPointLights > total) {
			i = k + (total - this.numPointLights)*12;

			for (; k < i; ++k)
				this.fragmentConstantData[k] = 0;
		}
	}

	/**
	 * Updates constant data render state used by the light probes. This method is optional for subclasses to implement.
	 */
	private updateProbes():void
	{
		var probe:LightProbe;
		var lightProbes:Array<LightProbe> = this._lightingPass.lightPicker.lightProbes;
		var weights:Array<number> = this._lightingPass.lightPicker.lightProbeWeights;
		var len:number = lightProbes.length - this._lightingPass.lightProbesOffset;
		var addDiff:boolean = this.usesProbesForDiffuse;
		var addSpec:boolean = this.usesProbesForSpecular;

		if (!(addDiff || addSpec))
			return;

		if (len > this.numLightProbes)
			len = this.numLightProbes;

		for (var i:number = 0; i < len; ++i) {
			probe = lightProbes[ this._lightingPass.lightProbesOffset + i];

			if (addDiff)
				(<GL_ImageBase> this._stage.getAbstraction(probe.diffuseMap)).activate(this.lightProbeDiffuseIndices[i], probe.diffuseSampler.mipmap);

			if (addSpec)
				(<GL_ImageBase> this._stage.getAbstraction(probe.specularMap)).activate(this.lightProbeSpecularIndices[i], probe.diffuseSampler.mipmap);
		}

		for (i = 0; i < len; ++i)
			this.fragmentConstantData[this.probeWeightsIndex + i] = weights[this._lightingPass.lightProbesOffset + i];
	}
}