import {IAnimationSet}					from "@awayjs/display/lib/animators/IAnimationSet";

import {AnimationSetBase}					from "../animators/AnimationSetBase";
import {AnimationRegisterData}			from "../animators/data/AnimationRegisterData";
import {VertexAnimationMode}				from "../animators/data/VertexAnimationMode";
import {ShaderBase}						from "../shaders/ShaderBase";
import {ShaderRegisterElement}			from "../shaders/ShaderRegisterElement";
import {ShaderRegisterCache}				from "../shaders/ShaderRegisterCache";
import {ShaderRegisterData}				from "../shaders/ShaderRegisterData";

/**
 * The animation data set used by vertex-based animators, containing vertex animation state data.
 *
 * @see VertexAnimator
 */
export class VertexAnimationSet extends AnimationSetBase implements IAnimationSet
{
	private _iAnimationRegisterData:AnimationRegisterData;
	
	private _numPoses:number;
	private _blendMode:string;

	/**
	 * Returns the number of poses made available at once to the GPU animation code.
	 */
	public get numPoses():number
	{
		return this._numPoses;
	}

	/**
	 * Returns the active blend mode of the vertex animator object.
	 */
	public get blendMode():string
	{
		return this._blendMode;
	}

	/**
	 * Returns whether or not normal data is used in last set GPU pass of the vertex shader.
	 */
//		public get useNormals():boolean
//		{
//			return this._uploadNormals;
//		}

	/**
	 * Creates a new <code>VertexAnimationSet</code> object.
	 *
	 * @param numPoses The number of poses made available at once to the GPU animation code.
	 * @param blendMode Optional value for setting the animation mode of the vertex animator object.
	 *
	 * @see away3d.animators.data.VertexAnimationMode
	 */
	constructor(numPoses:number = 2, blendMode:string = "absolute")
	{
		super();
		this._numPoses = numPoses;
		this._blendMode = blendMode;
	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		//grab animationRegisterData from the materialpassbase or create a new one if the first time
		this._iAnimationRegisterData = shader.animationRegisterData;

		if (this._iAnimationRegisterData == null)
			this._iAnimationRegisterData = shader.animationRegisterData = new AnimationRegisterData();
		
		if (this._blendMode == VertexAnimationMode.ABSOLUTE)
			return this.getAbsoluteAGALCode(shader, registerCache, sharedRegisters);
		else
			return this.getAdditiveAGALCode(shader, registerCache, sharedRegisters);
	}

	/**
	 * @inheritDoc
	 */
	public getAGALFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, shadedTarget:ShaderRegisterElement):string
	{
		return "";
	}

	/**
	 * @inheritDoc
	 */
	public getAGALUVCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "mov " + sharedRegisters.uvTarget + "," + sharedRegisters.uvSource + "\n";
	}

	/**
	 * @inheritDoc
	 */
	public doneAGALCode(shader:ShaderBase):void
	{

	}

	/**
	 * Generates the vertex AGAL code for absolute blending.
	 */
	private getAbsoluteAGALCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var temp1:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		registerCache.addVertexTempUsages(temp1, 1);
		var temp2:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		var regs:Array<string> = new Array<string>(".x", ".y", ".z", ".w");
		var len:number = sharedRegisters.animatableAttributes.length;
		var constantReg:ShaderRegisterElement = registerCache.getFreeVertexConstant();
		this._iAnimationRegisterData.weightsIndex = constantReg.index;
		this._iAnimationRegisterData.poseIndices = new Array<number>(this._numPoses);
		var poseInput:ShaderRegisterElement;
		var k:number = 0;
		
		if (len > 2)
			len = 2;
		
		for (var i:number = 0; i < len; ++i) {
			code += "mul " + temp1 + ", " + sharedRegisters.animatableAttributes[i] + ", " + constantReg + regs[0] + "\n";
		
			for (var j:number = 1; j < this._numPoses; ++j) {
				poseInput = registerCache.getFreeVertexAttribute();
				this._iAnimationRegisterData.poseIndices[k++] = poseInput.index;
				code += "mul " + temp2 + ", " + poseInput + ", " + constantReg + regs[j] + "\n";
		
				if (j < this._numPoses - 1) //TODO this is always the case, write better?
					code += "add " + temp1 + ", " + temp1 + ", " + temp2 + "\n";
			}
		
			code += "add " + sharedRegisters.animationTargetRegisters[i] + ", " + temp1 + ", " + temp2 + "\n";
		}
		
		// add code for bitangents if tangents are used
		if (shader.tangentDependencies > 0 || shader.outputsNormals) {
			code += "dp3 " + temp1 + ".x, " + sharedRegisters.animatableAttributes[2] + ", " + sharedRegisters.animationTargetRegisters[1] + "\n" +
				"mul " + temp1 + ", " + sharedRegisters.animationTargetRegisters[1] + ", " + temp1 + ".x\n" +
				"sub " + sharedRegisters.animationTargetRegisters[2] + ", " + sharedRegisters.animationTargetRegisters[2] + ", " + temp1 + "\n";
		}
		//
		// // simply write attributes to targets, do not animate them
		// // projection will pick up on targets[0] to do the projection
		// var len:number = sharedRegisters.animatableAttributes.length;
		// for (var i:number = 0; i < len; ++i)
		// 	code += "mov " + sharedRegisters.animationTargetRegisters[i] + ", " + sharedRegisters.animatableAttributes[i] + "\n";

		return code;
	}

	/**
	 * Generates the vertex AGAL code for additive blending.
	 */
	private getAdditiveAGALCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var len:number = sharedRegisters.animatableAttributes.length;
		var regs:Array<string> = [".x", ".y", ".z", ".w"];
		var temp1:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		var constantReg:ShaderRegisterElement = registerCache.getFreeVertexConstant();
		this._iAnimationRegisterData.weightsIndex = constantReg.index;
		this._iAnimationRegisterData.poseIndices = new Array<number>(this._numPoses);
		var poseInput:ShaderRegisterElement;
		var k:number = 0;

		if (len > 2)
			len = 2;

		code += "mov  " + sharedRegisters.animationTargetRegisters[0] + ", " + sharedRegisters.animatableAttributes[0] + "\n";
		if (shader.normalDependencies > 0)
			code += "mov " + sharedRegisters.animationTargetRegisters[1] + ", " + sharedRegisters.animatableAttributes[1] + "\n";

		for (var i:number = 0; i < len; ++i) {
			for (var j:number = 0; j < this._numPoses; ++j) {
				poseInput = registerCache.getFreeVertexAttribute();
				this._iAnimationRegisterData.poseIndices[k++] = poseInput.index;
				code += "mul " + temp1 + ", " + poseInput + ", " + constantReg + regs[j] + "\n" +
					"add " + sharedRegisters.animationTargetRegisters[i] + ", " + sharedRegisters.animationTargetRegisters[i] + ", " + temp1 + "\n";
			}
		}

		if (shader.tangentDependencies > 0 || shader.outputsNormals) {
			code += "dp3 " + temp1 + ".x, " + sharedRegisters.animatableAttributes[2] + ", " + sharedRegisters.animationTargetRegisters[1] + "\n" +
				"mul " + temp1 + ", " + sharedRegisters.animationTargetRegisters[1] + ", " + temp1 + ".x\n" +
				"sub " + sharedRegisters.animationTargetRegisters[2] + ", " + sharedRegisters.animatableAttributes[2] + ", " + temp1 + "\n";
		}

		return code;
	}
}