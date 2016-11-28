import {IPass} from "../../materials/passes/IPass";
import {IElementsClassGL} from "../../elements/IElementsClassGL";

import {ShaderBase} from "../ShaderBase";
import {ShaderRegisterCache} from "../ShaderRegisterCache";
import {ShaderRegisterData} from "../ShaderRegisterData";
import {ShaderRegisterElement} from "../ShaderRegisterElement";

/**
 * CompilerBase is an abstract base class for shader compilers that use modular shader methods to assemble a
 * material. Concrete subclasses are used by the default materials.
 *
 * @see away.materials.ShadingMethodBase
 */
export class CompilerBase
{
	public _pShader:ShaderBase;
	public _pSharedRegisters:ShaderRegisterData;
	public _pRegisterCache:ShaderRegisterCache;
	public _pElementsClass:IElementsClassGL;
	public _pRenderPass:IPass;

	public _pVertexCode:string = ''; // Changed to emtpy string- AwayTS
	public _pFragmentCode:string = '';// Changed to emtpy string - AwayTS
	public _pPostAnimationFragmentCode:string = '';// Changed to emtpy string - AwayTS

	/**
	 * Creates a new CompilerBase object.
	 * @param profile The compatibility profile of the renderer.
	 */
	constructor(elementsClass:IElementsClassGL, pass:IPass, shader:ShaderBase)
	{
		this._pElementsClass = elementsClass;
		this._pRenderPass = pass;
		this._pShader = shader;

		this._pSharedRegisters = new ShaderRegisterData();

		this._pRegisterCache = new ShaderRegisterCache(shader.profile);
	}

	/**
	 * Compiles the code after all setup on the compiler has finished.
	 */
	public compile():void
	{
		this._pShader.reset();

		this._pShader._iIncludeDependencies();

		this.pInitRegisterIndices();

		this.pCompileDependencies();

		//compile custom vertex & fragment codes
		this._pVertexCode += this._pRenderPass._iGetVertexCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);
		this._pPostAnimationFragmentCode += this._pRenderPass._iGetFragmentCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);

		//assign the final output color to the output register
		this._pPostAnimationFragmentCode += "mov " + this._pRegisterCache.fragmentOutputRegister + ", " + this._pSharedRegisters.shadedTarget + "\n";
		this._pRegisterCache.removeFragmentTempUsage(this._pSharedRegisters.shadedTarget);
	}
	/**
	 * Calculate the transformed colours
	 */
	private compileColorTransformCode():void
	{
		// rm, gm, bm, am - multiplier
		// ro, go, bo, ao - offset
		var ct1:ShaderRegisterElement = this._pRegisterCache.getFreeFragmentConstant();
		var ct2:ShaderRegisterElement = this._pRegisterCache.getFreeFragmentConstant();
		this._pShader.colorTransformIndex = ct1.index*4;
		this._pPostAnimationFragmentCode += "mul " + this._pSharedRegisters.shadedTarget + ", " + this._pSharedRegisters.shadedTarget + ", " + ct1 + "\n";
		this._pPostAnimationFragmentCode += "add " + this._pSharedRegisters.shadedTarget + ", " + this._pSharedRegisters.shadedTarget + ", " + ct2 + "\n";
	}
	/**
	 * Compile the code for the methods.
	 */
	public pCompileDependencies():void
	{
		this._pSharedRegisters.shadedTarget = this._pRegisterCache.getFreeFragmentVectorTemp();
		this._pRegisterCache.addFragmentTempUsages(this._pSharedRegisters.shadedTarget, 1);

		//compile the world-space position if required
		if (this._pShader.globalPosDependencies > 0)
			this.compileGlobalPositionCode();

        //compile the local-space position if required
        if (this._pShader.usesPositionFragment)
            this.compilePositionCode();

		if (this._pShader.usesCurves)
			this.compileCurvesCode();

		if (this._pShader.usesColorTransform)
			this.compileColorTransformCode();

		//Calculate the (possibly animated) UV coordinates.
		if (this._pShader.uvDependencies > 0)
			this.compileUVCode();

		if (this._pShader.secondaryUVDependencies > 0)
			this.compileSecondaryUVCode();

		if (this._pShader.normalDependencies > 0)
			this.compileNormalCode();

		if (this._pShader.viewDirDependencies > 0)
			this.compileViewDirCode();

		//collect code from material
		this._pVertexCode += this._pElementsClass._iGetVertexCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);
		this._pFragmentCode += this._pElementsClass._iGetFragmentCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);

		//collect code from pass
		this._pVertexCode += this._pRenderPass._iGetPreLightingVertexCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);
		this._pFragmentCode += this._pRenderPass._iGetPreLightingFragmentCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);
	}

	private compileGlobalPositionCode():void
	{
		this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.globalPositionVertex = this._pRegisterCache.getFreeVertexVectorTemp(), this._pShader.globalPosDependencies);

		var sceneMatrixReg:ShaderRegisterElement = this._pRegisterCache.getFreeVertexConstant();
		this._pRegisterCache.getFreeVertexConstant();
		this._pRegisterCache.getFreeVertexConstant();
		this._pRegisterCache.getFreeVertexConstant();

		this._pShader.sceneMatrixIndex = sceneMatrixReg.index*4;

		this._pVertexCode += "m44 " + this._pSharedRegisters.globalPositionVertex + ", " + this._pSharedRegisters.animatedPosition + ", " + sceneMatrixReg + "\n";

		if (this._pShader.usesGlobalPosFragment) {
			this._pSharedRegisters.globalPositionVarying = this._pRegisterCache.getFreeVarying();
			this._pVertexCode += "mov " + this._pSharedRegisters.globalPositionVarying + ", " + this._pSharedRegisters.globalPositionVertex + "\n";
		}
	}

    private compilePositionCode()
    {
        this._pSharedRegisters.positionVarying = this._pRegisterCache.getFreeVarying();
        this._pVertexCode += "mov " + this._pSharedRegisters.positionVarying + ", " + this._pSharedRegisters.animatedPosition + "\n";
    }


	private compileCurvesCode():void
	{
		this._pSharedRegisters.curvesInput = this._pRegisterCache.getFreeVertexAttribute();
		this._pShader.curvesIndex = this._pSharedRegisters.curvesInput.index;

		this._pSharedRegisters.curvesVarying = this._pRegisterCache.getFreeVarying();
		this._pVertexCode += "mov " + this._pSharedRegisters.curvesVarying + ", " + this._pSharedRegisters.curvesInput + "\n";

		var temp:ShaderRegisterElement = this._pRegisterCache.getFreeFragmentSingleTemp();

		this._pFragmentCode += "mul " + temp + ", " + this._pSharedRegisters.curvesVarying + ".y, " + this._pSharedRegisters.curvesVarying + ".y\n" +
							"sub " + temp + ", " + temp + ", " + this._pSharedRegisters.curvesVarying + ".z\n" +
							"mul " + temp + ", " + temp + ", " + this._pSharedRegisters.curvesVarying + ".x\n" +
							"kil " + temp + "\n";
		
		// var temp:ShaderRegisterElement = this._pRegisterCache.getFreeFragmentVectorTemp();
		//
		// this._pPostAnimationFragmentCode += "mul " + temp + ".x, " + this._pSharedRegisters.curvesVarying + ".y, " + this._pSharedRegisters.curvesVarying + ".y\n" +
		// 					"sub " + temp + ".x, " + temp + ".x, " + this._pSharedRegisters.curvesVarying + ".z\n" +
		// 					"mul " + temp + ".x, " + temp + ".x, " + this._pSharedRegisters.curvesVarying + ".x\n" +
		// 					"ddx " + temp + ".y," + temp + ".x\n" +
		// 					"ddy " + temp + ".z," + temp + ".x\n" +
		// 					"mul " + temp + ".y, " + temp + ".y, " + temp + ".y\n" +
		// 					"mul " + temp + ".z, " + temp + ".z, " + temp + ".z\n" +
		// 					"add " + this._pSharedRegisters.shadedTarget + ".w, " + temp + ".y, " + temp + ".z\n" +
		// 					"sqt " + this._pSharedRegisters.shadedTarget + ".w, " + this._pSharedRegisters.shadedTarget + ".w\n" +
		// 					"div " + this._pSharedRegisters.shadedTarget + ".w, " + temp + ".x, " + this._pSharedRegisters.shadedTarget + ".w\n" +
		// 					"max " + this._pSharedRegisters.shadedTarget + ".w, " + this._pSharedRegisters.shadedTarget + ".w, " + this._pSharedRegisters.commons + ".y\n" +
		// 					"min " + this._pSharedRegisters.shadedTarget + ".w, " + this._pSharedRegisters.shadedTarget + ".w, " + this._pSharedRegisters.commons + ".w\n";
	}

	/**
	 * Calculate the (possibly animated) UV coordinates.
	 */
	private compileUVCode():void
	{
		var uvAttributeReg:ShaderRegisterElement = this._pRegisterCache.getFreeVertexAttribute();
		this._pShader.uvIndex = uvAttributeReg.index;

		var varying:ShaderRegisterElement = this._pSharedRegisters.uvVarying = this._pRegisterCache.getFreeVarying();

		if (this._pShader.usesUVTransform) {
			// a, b, 0, tx
			// c, d, 0, ty
			var uvTransform1:ShaderRegisterElement = this._pRegisterCache.getFreeVertexConstant();
			var uvTransform2:ShaderRegisterElement = this._pRegisterCache.getFreeVertexConstant();
			this._pShader.uvMatrixIndex = uvTransform1.index*4;

			this._pVertexCode += "dp4 " + varying + ".x, " + uvAttributeReg + ", " + uvTransform1 + "\n" +
								 "dp4 " + varying + ".y, " + uvAttributeReg + ", " + uvTransform2 + "\n" +
								 "mov " + varying + ".zw, " + uvAttributeReg + ".zw \n";
		} else {
			this._pShader.uvMatrixIndex = -1;
			this._pSharedRegisters.uvTarget = varying;
			this._pSharedRegisters.uvSource = uvAttributeReg;
		}
	}

	/**
	 * Provide the secondary UV coordinates.
	 */
	private compileSecondaryUVCode():void
	{
		var uvAttributeReg:ShaderRegisterElement = this._pRegisterCache.getFreeVertexAttribute();
		this._pShader.secondaryUVIndex = uvAttributeReg.index;
		this._pSharedRegisters.secondaryUVVarying = this._pRegisterCache.getFreeVarying();
		this._pVertexCode += "mov " + this._pSharedRegisters.secondaryUVVarying + ", " + uvAttributeReg + "\n";
	}

	/**
	 * Calculate the view direction.
	 */
	public compileViewDirCode():void
	{
		var cameraPositionReg:ShaderRegisterElement = this._pRegisterCache.getFreeVertexConstant();
		this._pSharedRegisters.viewDirVarying = this._pRegisterCache.getFreeVarying();
		this._pSharedRegisters.viewDirFragment = this._pRegisterCache.getFreeFragmentVectorTemp();
		this._pRegisterCache.addFragmentTempUsages(this._pSharedRegisters.viewDirFragment, this._pShader.viewDirDependencies);

		this._pShader.cameraPositionIndex = cameraPositionReg.index*4;

		if (this._pShader.usesTangentSpace) {
			var temp:ShaderRegisterElement = this._pRegisterCache.getFreeVertexVectorTemp();
			this._pVertexCode += "sub " + temp + ", " + cameraPositionReg + ", " + this._pSharedRegisters.animatedPosition + "\n" +
				"m33 " + this._pSharedRegisters.viewDirVarying + ".xyz, " + temp + ", " + this._pSharedRegisters.animatedTangent + "\n" +
				"mov " + this._pSharedRegisters.viewDirVarying + ".w, " + this._pSharedRegisters.animatedPosition + ".w\n";
		} else {
			this._pVertexCode += "sub " + this._pSharedRegisters.viewDirVarying + ", " + cameraPositionReg + ", " + this._pSharedRegisters.globalPositionVertex + "\n";
			this._pRegisterCache.removeVertexTempUsage(this._pSharedRegisters.globalPositionVertex);
		}

		//TODO is this required in all cases? (re: distancemappass)
		this._pFragmentCode += "nrm " + this._pSharedRegisters.viewDirFragment + ".xyz, " + this._pSharedRegisters.viewDirVarying + "\n" +
			"mov " + this._pSharedRegisters.viewDirFragment + ".w,   " + this._pSharedRegisters.viewDirVarying + ".w\n";
	}

	/**
	 * Calculate the normal.
	 */
	public compileNormalCode():void
	{
		this._pSharedRegisters.normalFragment = this._pRegisterCache.getFreeFragmentVectorTemp();
		this._pRegisterCache.addFragmentTempUsages(this._pSharedRegisters.normalFragment, this._pShader.normalDependencies);

		//simple normal aquisition if no tangent space is being used
		if (this._pShader.outputsNormals && !this._pShader.outputsTangentNormals) {
			this._pVertexCode += this._pRenderPass._iGetNormalVertexCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);
			this._pFragmentCode += this._pRenderPass._iGetNormalFragmentCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);

			return;
		}

		var normalMatrix:Array<ShaderRegisterElement>;

		if (!this._pShader.outputsNormals || !this._pShader.usesTangentSpace) {
			normalMatrix = new Array<ShaderRegisterElement>(3);
			normalMatrix[0] = this._pRegisterCache.getFreeVertexConstant();
			normalMatrix[1] = this._pRegisterCache.getFreeVertexConstant();
			normalMatrix[2] = this._pRegisterCache.getFreeVertexConstant();

			this._pRegisterCache.getFreeVertexConstant();

			this._pShader.sceneNormalMatrixIndex = normalMatrix[0].index*4;

			this._pSharedRegisters.normalVarying = this._pRegisterCache.getFreeVarying();
		}

		if (this._pShader.outputsNormals) {
			if (this._pShader.usesTangentSpace) {
				// normalize normal + tangent vector and generate (approximated) bitangent used in m33 operation for view
				this._pVertexCode += "nrm " + this._pSharedRegisters.animatedNormal + ".xyz, " + this._pSharedRegisters.animatedNormal + "\n" +
					"nrm " + this._pSharedRegisters.animatedTangent + ".xyz, " + this._pSharedRegisters.animatedTangent + "\n" +
					"crs " + this._pSharedRegisters.bitangent + ".xyz, " + this._pSharedRegisters.animatedNormal + ", " + this._pSharedRegisters.animatedTangent + "\n";

				this._pFragmentCode += this._pRenderPass._iGetNormalFragmentCode(this._pShader, this._pRegisterCache, this._pSharedRegisters);
			} else {
				//Compiles the vertex shader code for tangent-space normal maps.
				this._pSharedRegisters.tangentVarying = this._pRegisterCache.getFreeVarying();
				this._pSharedRegisters.bitangentVarying = this._pRegisterCache.getFreeVarying();
				var temp:ShaderRegisterElement = this._pRegisterCache.getFreeVertexVectorTemp();

				this._pVertexCode += "m33 " + temp + ".xyz, " + this._pSharedRegisters.animatedNormal + ", " + normalMatrix[0] + "\n" +
					"nrm " + this._pSharedRegisters.animatedNormal + ".xyz, " + temp + "\n" +
					"m33 " + temp + ".xyz, " + this._pSharedRegisters.animatedTangent + ", " + normalMatrix[0] + "\n" +
					"nrm " + this._pSharedRegisters.animatedTangent + ".xyz, " + temp + "\n" +
					"mov " + this._pSharedRegisters.tangentVarying + ".x, " + this._pSharedRegisters.animatedTangent + ".x  \n" +
					"mov " + this._pSharedRegisters.tangentVarying + ".z, " + this._pSharedRegisters.animatedNormal + ".x  \n" +
					"mov " + this._pSharedRegisters.tangentVarying + ".w, " + this._pSharedRegisters.normalInput + ".w  \n" +
					"mov " + this._pSharedRegisters.bitangentVarying + ".x, " + this._pSharedRegisters.animatedTangent + ".y  \n" +
					"mov " + this._pSharedRegisters.bitangentVarying + ".z, " + this._pSharedRegisters.animatedNormal + ".y  \n" +
					"mov " + this._pSharedRegisters.bitangentVarying + ".w, " + this._pSharedRegisters.normalInput + ".w  \n" +
					"mov " + this._pSharedRegisters.normalVarying + ".x, " + this._pSharedRegisters.animatedTangent + ".z  \n" +
					"mov " + this._pSharedRegisters.normalVarying + ".z, " + this._pSharedRegisters.animatedNormal + ".z  \n" +
					"mov " + this._pSharedRegisters.normalVarying + ".w, " + this._pSharedRegisters.normalInput + ".w  \n" +
					"crs " + temp + ".xyz, " + this._pSharedRegisters.animatedNormal + ", " + this._pSharedRegisters.animatedTangent + "\n" +
					"mov " + this._pSharedRegisters.tangentVarying + ".y, " + temp + ".x    \n" +
					"mov " + this._pSharedRegisters.bitangentVarying + ".y, " + temp + ".y  \n" +
					"mov " + this._pSharedRegisters.normalVarying + ".y, " + temp + ".z    \n";

				this._pRegisterCache.removeVertexTempUsage(this._pSharedRegisters.animatedTangent);

				//Compiles the fragment shader code for tangent-space normal maps.
				var t:ShaderRegisterElement;
				var b:ShaderRegisterElement;
				var n:ShaderRegisterElement;

				t = this._pRegisterCache.getFreeFragmentVectorTemp();
				this._pRegisterCache.addFragmentTempUsages(t, 1);
				b = this._pRegisterCache.getFreeFragmentVectorTemp();
				this._pRegisterCache.addFragmentTempUsages(b, 1);
				n = this._pRegisterCache.getFreeFragmentVectorTemp();
				this._pRegisterCache.addFragmentTempUsages(n, 1);

				this._pFragmentCode += "nrm " + t + ".xyz, " + this._pSharedRegisters.tangentVarying + "\n" +
					"mov " + t + ".w, " + this._pSharedRegisters.tangentVarying + ".w	\n" +
					"nrm " + b + ".xyz, " + this._pSharedRegisters.bitangentVarying + "\n" +
					"nrm " + n + ".xyz, " + this._pSharedRegisters.normalVarying + "\n";

				//compile custom fragment code for normal calcs
				this._pFragmentCode += this._pRenderPass._iGetNormalFragmentCode(this._pShader, this._pRegisterCache, this._pSharedRegisters) +
					"m33 " + this._pSharedRegisters.normalFragment + ".xyz, " + this._pSharedRegisters.normalFragment + ", " + t + "\n" +
					"mov " + this._pSharedRegisters.normalFragment + ".w, " + this._pSharedRegisters.normalVarying + ".w\n";

				this._pRegisterCache.removeFragmentTempUsage(b);
				this._pRegisterCache.removeFragmentTempUsage(t);
				this._pRegisterCache.removeFragmentTempUsage(n);
			}
		} else {
			// no output, world space is enough
			this._pVertexCode += "m33 " + this._pSharedRegisters.normalVarying + ".xyz, " + this._pSharedRegisters.animatedNormal + ", " + normalMatrix[0] + "\n" +
				"mov " + this._pSharedRegisters.normalVarying + ".w, " + this._pSharedRegisters.animatedNormal + ".w\n";

			this._pFragmentCode += "nrm " + this._pSharedRegisters.normalFragment + ".xyz, " + this._pSharedRegisters.normalVarying + "\n" +
				"mov " + this._pSharedRegisters.normalFragment + ".w, " + this._pSharedRegisters.normalVarying + ".w\n";

			if (this._pShader.tangentDependencies > 0) {
				this._pSharedRegisters.tangentVarying = this._pRegisterCache.getFreeVarying();

				this._pVertexCode += "m33 " + this._pSharedRegisters.tangentVarying + ".xyz, " + this._pSharedRegisters.animatedTangent + ", " + normalMatrix[0] + "\n" +
					"mov " + this._pSharedRegisters.tangentVarying + ".w, " + this._pSharedRegisters.animatedTangent + ".w\n";
			}
		}

		if (!this._pShader.usesTangentSpace)
			this._pRegisterCache.removeVertexTempUsage(this._pSharedRegisters.animatedNormal);
	}

	/**
	 * Reset all the indices to "unused".
	 */
	public pInitRegisterIndices():void
	{
		this._pShader.pInitRegisterIndices();

		this._pSharedRegisters.animatedPosition = this._pRegisterCache.getFreeVertexVectorTemp();
		this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.animatedPosition, 1);

		this._pSharedRegisters.animatableAttributes.push(this._pRegisterCache.getFreeVertexAttribute());
		this._pSharedRegisters.animationTargetRegisters.push(this._pSharedRegisters.animatedPosition);
		this._pVertexCode = "";
		this._pFragmentCode = "";
		this._pPostAnimationFragmentCode = "";


		//create commonly shared constant registers
		if (this._pShader.usesCommonData || this._pShader.normalDependencies > 0) {
			this._pSharedRegisters.commons = this._pRegisterCache.getFreeFragmentConstant();
			this._pShader.commonsDataIndex = this._pSharedRegisters.commons.index*4;
		}

		//Creates the registers to contain the tangent data.
		//Needs to be created FIRST and in this order (for when using tangent space)
		if (this._pShader.tangentDependencies > 0 || this._pShader.outputsNormals) {
			this._pSharedRegisters.tangentInput = this._pRegisterCache.getFreeVertexAttribute();
			this._pShader.tangentIndex = this._pSharedRegisters.tangentInput.index;

			this._pSharedRegisters.animatedTangent = this._pRegisterCache.getFreeVertexVectorTemp();
			this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.animatedTangent, 1);

			if (this._pShader.usesTangentSpace) {
				this._pSharedRegisters.bitangent = this._pRegisterCache.getFreeVertexVectorTemp();
				this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.bitangent, 1);
			}

			this._pSharedRegisters.animatableAttributes.push(this._pSharedRegisters.tangentInput);
			this._pSharedRegisters.animationTargetRegisters.push(this._pSharedRegisters.animatedTangent);
		}

		if (this._pShader.normalDependencies > 0) {
			this._pSharedRegisters.normalInput = this._pRegisterCache.getFreeVertexAttribute();
			this._pShader.normalIndex = this._pSharedRegisters.normalInput.index;

			this._pSharedRegisters.animatedNormal = this._pRegisterCache.getFreeVertexVectorTemp();
			this._pRegisterCache.addVertexTempUsages(this._pSharedRegisters.animatedNormal, 1);

			this._pSharedRegisters.animatableAttributes.push(this._pSharedRegisters.normalInput);
			this._pSharedRegisters.animationTargetRegisters.push(this._pSharedRegisters.animatedNormal);
		}

		if (this._pShader.colorDependencies > 0) {
			this._pSharedRegisters.colorInput = this._pRegisterCache.getFreeVertexAttribute();
			this._pShader.colorBufferIndex = this._pSharedRegisters.colorInput.index;

			this._pSharedRegisters.colorVarying = this._pRegisterCache.getFreeVarying();
			this._pVertexCode += "mov " + this._pSharedRegisters.colorVarying + ", " + this._pSharedRegisters.colorInput + "\n";
		}
	}

	/**
	 * Disposes all resources used by the compiler.
	 */
	public dispose():void
	{
		this._pRegisterCache.dispose();
		this._pRegisterCache = null;
		this._pSharedRegisters = null;
	}

	/**
	 * The generated vertex code.
	 */
	public get vertexCode():string
	{
		return this._pVertexCode;
	}

	/**
	 * The generated fragment code.
	 */
	public get fragmentCode():string
	{
		return this._pFragmentCode;
	}

	/**
	 * The generated fragment code.
	 */
	public get postAnimationFragmentCode():string
	{
		return this._pPostAnimationFragmentCode;
	}

	/**
	 * The register containing the final shaded colour.
	 */
	public get shadedTarget():ShaderRegisterElement
	{
		return this._pSharedRegisters.shadedTarget;
	}
}