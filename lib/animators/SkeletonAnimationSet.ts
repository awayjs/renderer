import {IAnimationSet}					from "@awayjs/display/lib/animators/IAnimationSet";

import {AnimationSetBase}					from "../animators/AnimationSetBase";
import {ShaderBase}						from "../shaders/ShaderBase";
import {ShaderRegisterElement}			from "../shaders/ShaderRegisterElement";
import {ShaderRegisterCache}				from "../shaders/ShaderRegisterCache";
import {ShaderRegisterData}				from "../shaders/ShaderRegisterData";

/**
 * The animation data set used by skeleton-based animators, containing skeleton animation data.
 *
 * @see away.animators.SkeletonAnimator
 */
export class SkeletonAnimationSet extends AnimationSetBase implements IAnimationSet
{
	private _jointsPerVertex:number;
	private _matricesIndex:number;

	/**
	 * Returns the amount of skeleton joints that can be linked to a single vertex via skinned weight values. For GPU-base animation, the
	 * maximum allowed value is 4.
	 */
	public get jointsPerVertex():number
	{
		return this._jointsPerVertex;
	}
	
	public get matricesIndex():number
	{
		return this._matricesIndex;
	}
	
	/**
	 * Creates a new <code>SkeletonAnimationSet</code> object.
	 *
	 * @param jointsPerVertex Sets the amount of skeleton joints that can be linked to a single vertex via skinned weight values. For GPU-base animation, the maximum allowed value is 4. Defaults to 4.
	 */
	constructor(jointsPerVertex:number = 4)
	{
		super();

		this._jointsPerVertex = jointsPerVertex;
	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		this._matricesIndex = registerCache.numUsedVertexConstants;
		var indexOffset0:number = this._matricesIndex;
		var indexOffset1:number = this._matricesIndex + 1;
		var indexOffset2:number = this._matricesIndex + 2;
		
		var indexStream:ShaderRegisterElement = registerCache.getFreeVertexAttribute();
		shader.jointIndexIndex = indexStream.index;
		
		var weightStream:ShaderRegisterElement = registerCache.getFreeVertexAttribute();
		shader.jointWeightIndex = weightStream.index;
		
		var indices:Array<string> = [ indexStream + ".x", indexStream + ".y", indexStream + ".z", indexStream + ".w" ];
		var weights:Array<string> = [ weightStream + ".x", weightStream + ".y", weightStream + ".z", weightStream + ".w" ];
		var temp1:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		var dot:string = "dp4";
		var code:string = "";

		var len:number = sharedRegisters.animatableAttributes.length;
		for (var i:number = 0; i < len; ++i) {

			var source:ShaderRegisterElement = sharedRegisters.animatableAttributes[i];
			var target:ShaderRegisterElement = sharedRegisters.animationTargetRegisters[i];

			for (var j:number = 0; j < this._jointsPerVertex; ++j) {
				registerCache.getFreeVertexConstant();
				registerCache.getFreeVertexConstant();
				registerCache.getFreeVertexConstant();
				code += dot + " " + temp1 + ".x, " + source + ", vc[" + indices[j] + "+" + indexOffset0 + "]\n" +
					dot + " " + temp1 + ".y, " + source + ", vc[" + indices[j] + "+" + indexOffset1 + "]\n" +
					dot + " " + temp1 + ".z, " + source + ", vc[" + indices[j] + "+" + indexOffset2 + "]\n" +
					"mov " + temp1 + ".w, " + source + ".w\n" +
					"mul " + temp1 + ", " + temp1 + ", " + weights[j] + "\n"; // apply weight

				// add or mov to target. Need to write to a temp reg first, because an output can be a target
				if (j == 0)
					code += "mov " + target + ", " + temp1 + "\n";
				else
					code += "add " + target + ", " + target + ", " + temp1 + "\n";
			}
			
			// switch to dp3 once positions have been transformed, from now on, it should only be vectors instead of points
			dot = "dp3";
		}

		return code;
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
}