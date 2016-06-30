import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";

import {Camera}						from "@awayjs/display/lib/display/Camera";
import {DirectionalLight}				from "@awayjs/display/lib/display/DirectionalLight";
import {LightProbe}					from "@awayjs/display/lib/display/LightProbe";
import {PointLight}					from "@awayjs/display/lib/display/PointLight";
import {LightPickerBase}				from "@awayjs/display/lib/materials/lightpickers/LightPickerBase";
import {LightSources}					from "@awayjs/display/lib/materials/LightSources";

import {ContextGLProfile}				from "@awayjs/stage/lib/base/ContextGLProfile";
import {Stage}						from "@awayjs/stage/lib/base/Stage";
import {IContextGL}					from "@awayjs/stage/lib/base/IContextGL";
import {GL_ImageBase}					from "@awayjs/stage/lib/image/GL_ImageBase";

import {ILightingPass}				from "../surfaces/passes/ILightingPass";

import {ShaderBase}					from "../shaders/ShaderBase";
import {CompilerBase}					from "../shaders/compilers/CompilerBase";
import {LightingCompiler}				from "../shaders/compilers/LightingCompiler";
import {IElementsClassGL}				from "../elements/IElementsClassGL";
import {GL_RenderableBase}			from "../renderables/GL_RenderableBase";

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

	public _iIncludeDependencies():void
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
		this.usesCommonData = this.usesLightFallOff;
		this.numLights = numAllLights + numLightProbes;
		this.usesLights = numAllLights > 0 && (combinedLightSources & LightSources.LIGHTS) != 0;
		this.usesProbes = numLightProbes > 0 && (combinedLightSources & LightSources.PROBES) != 0;
		this.usesLightsForSpecular = numAllLights > 0 && (specularLightSources & LightSources.LIGHTS) != 0;
		this.usesProbesForSpecular = numLightProbes > 0 && (specularLightSources & LightSources.PROBES) != 0;
		this.usesLightsForDiffuse = numAllLights > 0 && (diffuseLightSources & LightSources.LIGHTS) != 0;
		this.usesProbesForDiffuse = numLightProbes > 0 && (diffuseLightSources & LightSources.PROBES) != 0;
		this.usesShadows = this._lightingPass._iUsesShadows(this);

		//IMPORTANT this must occur after shader lighting initialisation above
		super._iIncludeDependencies();
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
	public _setRenderState(renderable:GL_RenderableBase, camera:Camera, viewProjection:Matrix3D):void
	{
		super._setRenderState(renderable, camera, viewProjection);

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

				this.ambientR += dirLight._iAmbientR;
				this.ambientG += dirLight._iAmbientG;
				this.ambientB += dirLight._iAmbientB;

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

				this.fragmentConstantData[k++] = dirLight._iDiffuseR;
				this.fragmentConstantData[k++] = dirLight._iDiffuseG;
				this.fragmentConstantData[k++] = dirLight._iDiffuseB;
				this.fragmentConstantData[k++] = 1;

				this.fragmentConstantData[k++] = dirLight._iSpecularR;
				this.fragmentConstantData[k++] = dirLight._iSpecularG;
				this.fragmentConstantData[k++] = dirLight._iSpecularB;
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
				dirPos = pointLight.scenePosition;

				this.ambientR += pointLight._iAmbientR;
				this.ambientG += pointLight._iAmbientG;
				this.ambientB += pointLight._iAmbientB;

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

				this.fragmentConstantData[k++] = pointLight._iDiffuseR;
				this.fragmentConstantData[k++] = pointLight._iDiffuseG;
				this.fragmentConstantData[k++] = pointLight._iDiffuseB;

				var radius:number = pointLight._pRadius;
				this.fragmentConstantData[k++] = radius*radius;

				this.fragmentConstantData[k++] = pointLight._iSpecularR;
				this.fragmentConstantData[k++] = pointLight._iSpecularG;
				this.fragmentConstantData[k++] = pointLight._iSpecularB;
				this.fragmentConstantData[k++] = pointLight._pFallOffFactor;

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