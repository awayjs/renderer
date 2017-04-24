import {IElementsClassGL, ShaderRegisterElement, CompilerBase} from "@awayjs/stage";

import {ILightingPass} from "../../materials/passes/ILightingPass";

import {LightingShader} from "../LightingShader";

/**
 * CompilerBase is an abstract base class for shader compilers that use modular shader methods to assemble a
 * material. Concrete subclasses are used by the default materials.
 *
 * @see away.materials.ShadingMethodBase
 */
export class LightingCompiler extends CompilerBase
{
	private _shaderLightingObject:LightingShader;
	public _pointLightFragmentConstants:Array<ShaderRegisterElement>;
	public _pointLightVertexConstants:Array<ShaderRegisterElement>;
	public _dirLightFragmentConstants:Array<ShaderRegisterElement>;
	public _dirLightVertexConstants:Array<ShaderRegisterElement>;

	public _pNumProbeRegisters:number;

	/**
	 * Creates a new CompilerBase object.
	 * @param profile The compatibility profile of the renderer.
	 */
	constructor(elementsClass:IElementsClassGL, lightingPass:ILightingPass, shaderLightingObject:LightingShader)
	{
		super(elementsClass, lightingPass, shaderLightingObject);

		this._shaderLightingObject = shaderLightingObject;
	}

	/**
	 * Compile the code for the methods.
	 */
	public pCompileDependencies():void
	{
		super.pCompileDependencies();

		//collect code from pass
		this._vertexCode += (<ILightingPass> this._renderPass)._getPreLightingVertexCode(this._registerCache, this._sharedRegisters);
		this._postAnimationFragmentCode += (<ILightingPass> this._renderPass)._getPreLightingFragmentCode(this._registerCache, this._sharedRegisters);

		//compile the lighting code
		if (this._shaderLightingObject.usesShadows)
			this.pCompileShadowCode();

		if (this._shaderLightingObject.usesLights) {
			this.initLightRegisters();
			this.compileLightCode();
		}

		if (this._shaderLightingObject.usesProbes)
			this.compileLightProbeCode();
	}

	/**
	 * Provides the code to provide shadow mapping.
	 */
	public pCompileShadowCode():void
	{
		if (this._shaderLightingObject.normalDependencies > 0) {
			this._sharedRegisters.shadowTarget = this._sharedRegisters.normalFragment;
		} else {
			this._sharedRegisters.shadowTarget = this._registerCache.getFreeFragmentVectorTemp();
			this._registerCache.addFragmentTempUsages(this._sharedRegisters.shadowTarget, 1);
		}
	}

	/**
	 * Initializes constant registers to contain light data.
	 */
	private initLightRegisters():void
	{
		// init these first so we're sure they're in sequence
		var i:number, len:number;

		if (this._dirLightVertexConstants) {
			len = this._dirLightVertexConstants.length;
			for (i = 0; i < len; ++i) {
				this._dirLightVertexConstants[i] = this._registerCache.getFreeVertexConstant();

				if (this._shaderLightingObject.lightVertexConstantIndex == -1)
					this._shaderLightingObject.lightVertexConstantIndex = this._dirLightVertexConstants[i].index*4;
			}
		}

		if (this._pointLightVertexConstants) {
			len = this._pointLightVertexConstants.length;
			for (i = 0; i < len; ++i) {
				this._pointLightVertexConstants[i] = this._registerCache.getFreeVertexConstant();

				if (this._shaderLightingObject.lightVertexConstantIndex == -1)
					this._shaderLightingObject.lightVertexConstantIndex = this._pointLightVertexConstants[i].index*4;
			}
		}

		len = this._dirLightFragmentConstants.length;
		for (i = 0; i < len; ++i) {
			this._dirLightFragmentConstants[i] = this._registerCache.getFreeFragmentConstant();

			if (this._shaderLightingObject.lightFragmentConstantIndex == -1)
				this._shaderLightingObject.lightFragmentConstantIndex = this._dirLightFragmentConstants[i].index*4;
		}

		len = this._pointLightFragmentConstants.length;
		for (i = 0; i < len; ++i) {
			this._pointLightFragmentConstants[i] = this._registerCache.getFreeFragmentConstant();

			if (this._shaderLightingObject.lightFragmentConstantIndex == -1)
				this._shaderLightingObject.lightFragmentConstantIndex = this._pointLightFragmentConstants[i].index*4;
		}
	}

	/**
	 * Compiles the shading code for directional and point lights.
	 */
	private compileLightCode():void
	{
		var diffuseColorReg:ShaderRegisterElement;
		var specularColorReg:ShaderRegisterElement;
		var lightPosReg:ShaderRegisterElement;
		var lightDirReg:ShaderRegisterElement;
		var vertexRegIndex:number = 0;
		var fragmentRegIndex:number = 0;
		var addSpec:boolean = this._shaderLightingObject.usesLightsForSpecular;
		var addDiff:boolean = this._shaderLightingObject.usesLightsForDiffuse;

		//compile the shading code for directional lights.
		for (var i:number = 0; i < this._shaderLightingObject.numDirectionalLights; ++i) {
			if (this._shaderLightingObject.usesTangentSpace) {
				lightDirReg = this._dirLightVertexConstants[vertexRegIndex++];

				var lightVarying:ShaderRegisterElement = this._registerCache.getFreeVarying();

				this._vertexCode += "m33 " + lightVarying + ".xyz, " + lightDirReg + ", " + this._sharedRegisters.animatedTangent + "\n" +
					"mov " + lightVarying + ".w, " + lightDirReg + ".w\n";

				lightDirReg = this._registerCache.getFreeFragmentVectorTemp();
				this._registerCache.addVertexTempUsages(lightDirReg, 1);

				this._postAnimationFragmentCode += "nrm " + lightDirReg + ".xyz, " + lightVarying + "\n" +
					"mov " + lightDirReg + ".w, " + lightVarying + ".w\n";

			} else {
				lightDirReg = this._dirLightFragmentConstants[fragmentRegIndex++];
			}

			diffuseColorReg = this._dirLightFragmentConstants[fragmentRegIndex++];
			specularColorReg = this._dirLightFragmentConstants[fragmentRegIndex++];

			if (addDiff)
				this._postAnimationFragmentCode += (<ILightingPass> this._renderPass)._getPerLightDiffuseFragmentCode(lightDirReg, diffuseColorReg, this._registerCache, this._sharedRegisters);

			if (addSpec)
				this._postAnimationFragmentCode += (<ILightingPass> this._renderPass)._getPerLightSpecularFragmentCode(lightDirReg, specularColorReg, this._registerCache, this._sharedRegisters);

			if (this._shaderLightingObject.usesTangentSpace)
				this._registerCache.removeVertexTempUsage(lightDirReg);
		}

		vertexRegIndex = 0;
		fragmentRegIndex = 0;

		//compile the shading code for point lights
		for (var i:number = 0; i < this._shaderLightingObject.numPointLights; ++i) {

			if (this._shaderLightingObject.usesTangentSpace || !this._shaderLightingObject.usesGlobalPosFragment)
				lightPosReg = this._pointLightVertexConstants[vertexRegIndex++];
			else
				lightPosReg = this._pointLightFragmentConstants[fragmentRegIndex++];

			diffuseColorReg = this._pointLightFragmentConstants[fragmentRegIndex++];
			specularColorReg = this._pointLightFragmentConstants[fragmentRegIndex++];

			lightDirReg = this._registerCache.getFreeFragmentVectorTemp();
			this._registerCache.addFragmentTempUsages(lightDirReg, 1);

			var lightVarying:ShaderRegisterElement;

			if (this._shaderLightingObject.usesTangentSpace) {
				lightVarying = this._registerCache.getFreeVarying();
				var temp:ShaderRegisterElement = this._registerCache.getFreeVertexVectorTemp();
				this._vertexCode += "sub " + temp + ", " + lightPosReg + ", " + this._sharedRegisters.animatedPosition + "\n" +
					"m33 " + lightVarying + ".xyz, " + temp + ", " + this._sharedRegisters.animatedTangent + "\n" +
					"mov " + lightVarying + ".w, " + this._sharedRegisters.animatedPosition + ".w\n";
			} else if (!this._shaderLightingObject.usesGlobalPosFragment) {
				lightVarying = this._registerCache.getFreeVarying();
				this._vertexCode += "sub " + lightVarying + ", " + lightPosReg + ", " + this._sharedRegisters.globalPositionVertex + "\n";
			} else {
				lightVarying = lightDirReg;
				this._postAnimationFragmentCode += "sub " + lightDirReg + ", " + lightPosReg + ", " + this._sharedRegisters.globalPositionVarying + "\n";
			}

			if (this._shaderLightingObject.usesLightFallOff) {
				// calculate attenuation
				this._postAnimationFragmentCode += // attenuate
					"dp3 " + lightDirReg + ".w, " + lightVarying + ", " + lightVarying + "\n" + // w = d - radius
					"sub " + lightDirReg + ".w, " + lightDirReg + ".w, " + diffuseColorReg + ".w\n" + // w = (d - radius)/(max-min)
					"mul " + lightDirReg + ".w, " + lightDirReg + ".w, " + specularColorReg + ".w\n" + // w = clamp(w, 0, 1)
					"sat " + lightDirReg + ".w, " + lightDirReg + ".w\n" + // w = 1-w
					"sub " + lightDirReg + ".w, " + this._sharedRegisters.commons + ".w, " + lightDirReg + ".w\n" + // normalize
					"nrm " + lightDirReg + ".xyz, " + lightVarying + "\n";
			} else {
				this._postAnimationFragmentCode += "nrm " + lightDirReg + ".xyz, " + lightVarying + "\n" +
					"mov " + lightDirReg + ".w, " + lightVarying + ".w\n";
			}

			if (this._shaderLightingObject.lightFragmentConstantIndex == -1)
				this._shaderLightingObject.lightFragmentConstantIndex = lightPosReg.index*4;

			if (addDiff)
				this._postAnimationFragmentCode += (<ILightingPass> this._renderPass)._getPerLightDiffuseFragmentCode(lightDirReg, diffuseColorReg, this._registerCache, this._sharedRegisters);

			if (addSpec)
				this._postAnimationFragmentCode += (<ILightingPass> this._renderPass)._getPerLightSpecularFragmentCode(lightDirReg, specularColorReg, this._registerCache, this._sharedRegisters);

			this._registerCache.removeFragmentTempUsage(lightDirReg);
		}
	}

	/**
	 * Compiles shading code for light probes.
	 */
	private compileLightProbeCode():void
	{
		var weightReg:string;
		var weightComponents = [ ".x", ".y", ".z", ".w" ];
		var weightRegisters:Array<ShaderRegisterElement> = new Array<ShaderRegisterElement>();
		var i:number;
		var texReg:ShaderRegisterElement;
		var addSpec:boolean = this._shaderLightingObject.usesProbesForSpecular;
		var addDiff:boolean = this._shaderLightingObject.usesProbesForDiffuse;

		if (addDiff)
			this._shaderLightingObject.lightProbeDiffuseIndices = new Array<number>();

		if (addSpec)
			this._shaderLightingObject.lightProbeSpecularIndices = new Array<number>();

		for (i = 0; i < this._pNumProbeRegisters; ++i) {
			weightRegisters[i] = this._registerCache.getFreeFragmentConstant();

			if (i == 0)
				this._shaderLightingObject.probeWeightsIndex = weightRegisters[i].index*4;
		}

		for (i = 0; i < this._shaderLightingObject.numLightProbes; ++i) {
			weightReg = weightRegisters[Math.floor(i/4)].toString() + weightComponents[i%4];

			if (addDiff) {
				texReg = this._registerCache.getFreeTextureReg();
				this._shaderLightingObject.lightProbeDiffuseIndices[i] = texReg.index;
				this._postAnimationFragmentCode += (<ILightingPass> this._renderPass)._getPerProbeDiffuseFragmentCode(texReg, weightReg, this._registerCache, this._sharedRegisters);
			}

			if (addSpec) {
				texReg = this._registerCache.getFreeTextureReg();
				this._shaderLightingObject.lightProbeSpecularIndices[i] = texReg.index;
				this._postAnimationFragmentCode += (<ILightingPass> this._renderPass)._getPerProbeSpecularFragmentCode(texReg, weightReg, this._registerCache, this._sharedRegisters);
			}
		}
	}

	/**
	 * Reset all the indices to "unused".
	 */
	public pInitRegisterIndices():void
	{
		super.pInitRegisterIndices();

		this._shaderLightingObject.lightVertexConstantIndex = -1;
		this._shaderLightingObject.lightFragmentConstantIndex = -1;
		this._shaderLightingObject.probeWeightsIndex = -1;

		this._pNumProbeRegisters = Math.ceil(this._shaderLightingObject.numLightProbes/4);

		//init light data
		if (this._shaderLightingObject.usesTangentSpace || !this._shaderLightingObject.usesGlobalPosFragment) {
			this._pointLightVertexConstants = new Array<ShaderRegisterElement>(this._shaderLightingObject.numPointLights);
			this._pointLightFragmentConstants = new Array<ShaderRegisterElement>(this._shaderLightingObject.numPointLights*2);
		} else {
			this._pointLightFragmentConstants = new Array<ShaderRegisterElement>(this._shaderLightingObject.numPointLights*3);
		}

		if (this._shaderLightingObject.usesTangentSpace) {
			this._dirLightVertexConstants = new Array<ShaderRegisterElement>(this._shaderLightingObject.numDirectionalLights);
			this._dirLightFragmentConstants = new Array<ShaderRegisterElement>(this._shaderLightingObject.numDirectionalLights*2);
		} else {
			this._dirLightFragmentConstants = new Array<ShaderRegisterElement>(this._shaderLightingObject.numDirectionalLights*3);
		}
	}
}