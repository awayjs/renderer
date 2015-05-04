import IAnimationSet					= require("awayjs-display/lib/animators/IAnimationSet");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import AnimationSetBase					= require("awayjs-renderergl/lib/animators/AnimationSetBase");
import ShaderBase						= require("awayjs-renderergl/lib/shaders/ShaderBase");

/**
 * The animation data set used by skeleton-based animators, containing skeleton animation data.
 *
 * @see away.animators.SkeletonAnimator
 */
class SkeletonAnimationSet extends AnimationSetBase implements IAnimationSet
{
	private _jointsPerVertex:number /*uint*/;

	/**
	 * Returns the amount of skeleton joints that can be linked to a single vertex via skinned weight values. For GPU-base animation, the
	 * maximum allowed value is 4.
	 */
	public get jointsPerVertex():number /*uint*/
	{
		return this._jointsPerVertex;
	}

	/**
	 * Creates a new <code>SkeletonAnimationSet</code> object.
	 *
	 * @param jointsPerVertex Sets the amount of skeleton joints that can be linked to a single vertex via skinned weight values. For GPU-base animation, the maximum allowed value is 4. Defaults to 4.
	 */
	constructor(jointsPerVertex:number /*uint*/ = 4)
	{
		super();

		this._jointsPerVertex = jointsPerVertex;
	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shader:ShaderBase):string
	{
		var len:number /*uint*/ = shader.animatableAttributes.length;

		var indexOffset0:number /*uint*/ = shader.numUsedVertexConstants;
		var indexOffset1:number /*uint*/ = indexOffset0 + 1;
		var indexOffset2:number /*uint*/ = indexOffset0 + 2;
		var indexStream:string = "va" + shader.numUsedStreams;
		var weightStream:string = "va" + (shader.numUsedStreams + 1);
		var indices:Array<string> = [ indexStream + ".x", indexStream + ".y", indexStream + ".z", indexStream + ".w" ];
		var weights:Array<string> = [ weightStream + ".x", weightStream + ".y", weightStream + ".z", weightStream + ".w" ];
		var temp1:string = this._pFindTempReg(shader.animationTargetRegisters);
		var temp2:string = this._pFindTempReg(shader.animationTargetRegisters, temp1);
		var dot:string = "dp4";
		var code:string = "";

		for (var i:number /*uint*/ = 0; i < len; ++i) {

			var src:string = shader.animatableAttributes[i];

			for (var j:number /*uint*/ = 0; j < this._jointsPerVertex; ++j) {
				code += dot + " " + temp1 + ".x, " + src + ", vc[" + indices[j] + "+" + indexOffset0 + "]\n" +
					dot + " " + temp1 + ".y, " + src + ", vc[" + indices[j] + "+" + indexOffset1 + "]\n" +
					dot + " " + temp1 + ".z, " + src + ", vc[" + indices[j] + "+" + indexOffset2 + "]\n" +
					"mov " + temp1 + ".w, " + src + ".w\n" +
					"mul " + temp1 + ", " + temp1 + ", " + weights[j] + "\n"; // apply weight

				// add or mov to target. Need to write to a temp reg first, because an output can be a target
				if (j == 0)
					code += "mov " + temp2 + ", " + temp1 + "\n"; else
					code += "add " + temp2 + ", " + temp2 + ", " + temp1 + "\n";
			}
			// switch to dp3 once positions have been transformed, from now on, it should only be vectors instead of points
			dot = "dp3";
			code += "mov " + shader.animationTargetRegisters[i] + ", " + temp2 + "\n";
		}

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public activate(shader:ShaderBase, stage:Stage)
	{
	}

	/**
	 * @inheritDoc
	 */
	public deactivate(shader:ShaderBase, stage:Stage)
	{
//			var streamOffset:number /*uint*/ = pass.numUsedStreams;
//			var context:IContextGL = <IContextGL> stage.context;
//			context.setVertexBufferAt(streamOffset, null);
//			context.setVertexBufferAt(streamOffset + 1, null);
	}

	/**
	 * @inheritDoc
	 */
	public getAGALFragmentCode(shader:ShaderBase, shadedTarget:string):string
	{
		return "";
	}

	/**
	 * @inheritDoc
	 */
	public getAGALUVCode(shader:ShaderBase):string
	{
		return "mov " + shader.uvTarget + "," + shader.uvSource + "\n";
	}

	/**
	 * @inheritDoc
	 */
	public doneAGALCode(shader:ShaderBase)
	{

	}
}

export = SkeletonAnimationSet;