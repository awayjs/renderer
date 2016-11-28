import {IAsset, AssetBase, AbstractMethodError} from "@awayjs/core";

import {AnimationNodeBase}			from "@awayjs/graphics";

import {AnimationSetError} from "../errors/AnimationSetError";
import {ShaderBase} from "../shaders/ShaderBase";
import {ShaderRegisterElement} from "../shaders/ShaderRegisterElement";
import {ShaderRegisterCache} from "../shaders/ShaderRegisterCache";
import {ShaderRegisterData} from "../shaders/ShaderRegisterData";

/**
 * Provides an abstract base class for data set classes that hold animation data for use in animator classes.
 *
 * @see away.animators.AnimatorBase
 */
export class AnimationSetBase extends AssetBase implements IAsset
{
	public static assetType:string = "[asset AnimationSet]";

	private _usesCPU:boolean;
	private _animations:Array<AnimationNodeBase> = new Array<AnimationNodeBase>();
	private _animationNames:Array<string> = new Array<string>();
	private _animationDictionary:Object = new Object();

	constructor()
	{
		super();
	}

	/**
	 * Retrieves a temporary GPU register that's still free.
	 *
	 * @param exclude An array of non-free temporary registers.
	 * @param excludeAnother An additional register that's not free.
	 * @return A temporary register that can be used.
	 */
	public _pFindTempReg(exclude:Array<string>, excludeAnother:string = null):string
	{
		var i:number = 0;
		var reg:string;

		while (true) {
			reg = "vt" + i;
			if (exclude.indexOf(reg) == -1 && excludeAnother != reg)
				return reg;
			++i;
		}
	}

	/**
	 * Indicates whether the properties of the animation data contained within the set combined with
	 * the vertex registers already in use on shading materials allows the animation data to utilise
	 * GPU calls.
	 */
	public get usesCPU():boolean
	{
		return this._usesCPU;
	}

	/**
	 * Called by the material to reset the GPU indicator before testing whether register space in the shader
	 * is available for running GPU-based animation code.
	 *
	 * @private
	 */
	public resetGPUCompatibility():void
	{
		this._usesCPU = false;
	}

	public cancelGPUCompatibility():void
	{
		this._usesCPU = true;
	}


	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		throw new AbstractMethodError();
	}

	/**
	 * @inheritDoc
	 */
	public getAGALFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, shadedTarget:ShaderRegisterElement):string
	{
		throw new AbstractMethodError();
	}

	/**
	 * @inheritDoc
	 */
	public getAGALUVCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		throw new AbstractMethodError();
	}

	/**
	 * @inheritDoc
	 */
	public doneAGALCode(shader:ShaderBase):void
	{
		throw new AbstractMethodError();
	}

	/**
	 * @inheritDoc
	 */
	public get assetType():string
	{
		return AnimationSetBase.assetType;
	}

	/**
	 * Returns a vector of animation state objects that make up the contents of the animation data set.
	 */
	public get animations():Array<AnimationNodeBase>
	{
		return this._animations;
	}

	/**
	 * Returns a vector of animation state objects that make up the contents of the animation data set.
	 */
	public get animationNames():Array<string>
	{
		return this._animationNames;
	}

	/**
	 * Check to determine whether a state is registered in the animation set under the given name.
	 *
	 * @param stateName The name of the animation state object to be checked.
	 */
	public hasAnimation(name:string):boolean
	{
		return this._animationDictionary[name] != null;
	}

	/**
	 * Retrieves the animation state object registered in the animation data set under the given name.
	 *
	 * @param stateName The name of the animation state object to be retrieved.
	 */
	public getAnimation(name:string):AnimationNodeBase
	{
		return this._animationDictionary[name];
	}

	/**
	 * Adds an animation state object to the aniamtion data set under the given name.
	 *
	 * @param stateName The name under which the animation state object will be stored.
	 * @param animationState The animation state object to be staored in the set.
	 */
	public addAnimation(node:AnimationNodeBase):void
	{
		if (this._animationDictionary[node.name])
			throw new AnimationSetError("root node name '" + node.name + "' already exists in the set");

		this._animationDictionary[node.name] = node;

		this._animations.push(node);

		this._animationNames.push(node.name);
	}

	/**
	 * Cleans up any resources used by the current object.
	 */
	public dispose():void
	{
	}
}