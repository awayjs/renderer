import IAnimationSet					= require("awayjs-display/lib/animators/IAnimationSet");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import AnimationSetBase					= require("awayjs-renderergl/lib/animators/AnimationSetBase");
import VertexAnimationMode				= require("awayjs-renderergl/lib/animators/data/VertexAnimationMode");
import ShaderObjectBase					= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");

/**
 * The animation data set used by vertex-based animators, containing vertex animation state data.
 *
 * @see VertexAnimator
 */
class VertexAnimationSet extends AnimationSetBase implements IAnimationSet
{
	private _numPoses:number /*uint*/;
	private _blendMode:string;

	/**
	 * Returns the number of poses made available at once to the GPU animation code.
	 */
	public get numPoses():number /*uint*/
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
	constructor(numPoses:number /*uint*/ = 2, blendMode:string = "absolute")
	{
		super();
		this._numPoses = numPoses;
		this._blendMode = blendMode;

	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shaderObject:ShaderObjectBase):string
	{
		if (this._blendMode == VertexAnimationMode.ABSOLUTE)
			return this.getAbsoluteAGALCode(shaderObject);
		else
			return this.getAdditiveAGALCode(shaderObject);
	}

	/**
	 * @inheritDoc
	 */
	public activate(shaderObject:ShaderObjectBase, stage:Stage)
	{
//			var uID:number = pass._iUniqueId;
//			this._uploadNormals = <boolean> this._useNormals[uID];
//			this._uploadTangents = <boolean> this._useTangents[uID];
	}

	/**
	 * @inheritDoc
	 */
	public deactivate(shaderObject:ShaderObjectBase, stage:Stage)
	{
//			var uID:number = pass._iUniqueId;
//			var index:number /*uint*/ = this._streamIndices[uID];
//			var context:IContextGL = <IContextGL> stage.context;
//			context.setVertexBufferAt(index, null);
//			if (this._uploadNormals)
//				context.setVertexBufferAt(index + 1, null);
//			if (this._uploadTangents)
//				context.setVertexBufferAt(index + 2, null);
	}

	/**
	 * @inheritDoc
	 */
	public getAGALFragmentCode(shaderObject:ShaderObjectBase, shadedTarget:string):string
	{
		return "";
	}

	/**
	 * @inheritDoc
	 */
	public getAGALUVCode(shaderObject:ShaderObjectBase):string
	{
		return "mov " + shaderObject.uvTarget + "," + shaderObject.uvSource + "\n";
	}

	/**
	 * @inheritDoc
	 */
	public doneAGALCode(shaderObject:ShaderObjectBase)
	{

	}

	/**
	 * Generates the vertex AGAL code for absolute blending.
	 */
	private getAbsoluteAGALCode(shaderObject:ShaderObjectBase):string
	{
		var code:string = "";
		var temp1:string = this._pFindTempReg(shaderObject.animationTargetRegisters);
		var temp2:string = this._pFindTempReg(shaderObject.animationTargetRegisters, temp1);
		var regs:Array<string> = new Array<string>("x", "y", "z", "w");
		var len:number /*uint*/ = shaderObject.animatableAttributes.length;
		var constantReg:string = "vc" + shaderObject.numUsedVertexConstants;

		if (len > 2)
			len = 2;
		var streamIndex:number /*uint*/ = shaderObject.numUsedStreams;

		for (var i:number /*uint*/ = 0; i < len; ++i) {
			code += "mul " + temp1 + ", " + shaderObject.animatableAttributes[i] + ", " + constantReg + "." + regs[0] + "\n";

			for (var j:number /*uint*/ = 1; j < this._numPoses; ++j) {
				code += "mul " + temp2 + ", va" + streamIndex + ", " + constantReg + "." + regs[j] + "\n";

				if (j < this._numPoses - 1)
					code += "add " + temp1 + ", " + temp1 + ", " + temp2 + "\n";

				++streamIndex;
			}

			code += "add " + shaderObject.animationTargetRegisters[i] + ", " + temp1 + ", " + temp2 + "\n";
		}

		// add code for bitangents if tangents are used
		if (shaderObject.tangentDependencies > 0 || shaderObject.outputsNormals) {
			code += "dp3 " + temp1 + ".x, " + shaderObject.animatableAttributes[2] + ", " + shaderObject.animationTargetRegisters[1] + "\n" +
				"mul " + temp1 + ", " + shaderObject.animationTargetRegisters[1] + ", " + temp1 + ".x\n" +
				"sub " + shaderObject.animationTargetRegisters[2] + ", " + shaderObject.animationTargetRegisters[2] + ", " + temp1 + "\n";
		}
		return code;
	}

	/**
	 * Generates the vertex AGAL code for additive blending.
	 */
	private getAdditiveAGALCode(shaderObject:ShaderObjectBase):string
	{
		var code:string = "";
		var len:number /*uint*/ = shaderObject.animatableAttributes.length;
		var regs:Array<string> = ["x", "y", "z", "w"];
		var temp1:string = this._pFindTempReg(shaderObject.animationTargetRegisters);
		var k:number /*uint*/;

		var streamIndex:number /*uint*/ = shaderObject.numUsedStreams;

		if (len > 2)
			len = 2;

		code += "mov  " + shaderObject.animationTargetRegisters[0] + ", " + shaderObject.animatableAttributes[0] + "\n";
		if (shaderObject.normalDependencies > 0)
			code += "mov " + shaderObject.animationTargetRegisters[1] + ", " + shaderObject.animatableAttributes[1] + "\n";

		for (var i:number /*uint*/ = 0; i < len; ++i) {
			for (var j:number /*uint*/ = 0; j < this._numPoses; ++j) {
				code += "mul " + temp1 + ", va" + (streamIndex + k) + ", vc" + shaderObject.numUsedVertexConstants + "." + regs[j] + "\n" +
					"add " + shaderObject.animationTargetRegisters[i] + ", " + shaderObject.animationTargetRegisters[i] + ", " + temp1 + "\n";
				k++;
			}
		}

		if (shaderObject.tangentDependencies > 0 || shaderObject.outputsNormals) {
			code += "dp3 " + temp1 + ".x, " + shaderObject.animatableAttributes[2] + ", " + shaderObject.animationTargetRegisters[1] + "\n" +
				"mul " + temp1 + ", " + shaderObject.animationTargetRegisters[1] + ", " + temp1 + ".x\n" +
				"sub " + shaderObject.animationTargetRegisters[2] + ", " + shaderObject.animatableAttributes[2] + ", " + temp1 + "\n";
		}

		return code;
	}
}

export = VertexAnimationSet;