import {AnimationNodeBase}				from "@awayjs/display/lib/animators/nodes/AnimationNodeBase";

import {ParticleAnimationSet}				from "../../animators/ParticleAnimationSet";
import {AnimationRegisterData}			from "../../animators/data/AnimationRegisterData";
import {ParticleProperties}				from "../../animators/data/ParticleProperties";
import {ShaderBase}						from "../../shaders/ShaderBase";
import {ShaderRegisterCache}				from "../../shaders/ShaderRegisterCache";

/**
 * Provides an abstract base class for particle animation nodes.
 */
export class ParticleNodeBase extends AnimationNodeBase
{
	private _priority:number;

	public _pMode:number;
	public _pDataLength:number = 3;
	public _pOneData:Array<number>;

	public _iDataOffset:number;

	//modes alias
	private static GLOBAL:string = 'Global';
	private static LOCAL_STATIC:string = 'LocalStatic';
	private static LOCAL_DYNAMIC:string = 'LocalDynamic';

	//modes list
	private static MODES:Object =
	{
		0:ParticleNodeBase.GLOBAL,
		1:ParticleNodeBase.LOCAL_STATIC,
		2:ParticleNodeBase.LOCAL_DYNAMIC
	};

	/**
	 * Returns the property mode of the particle animation node. Typically set in the node constructor
	 *
	 * @see away.animators.ParticlePropertiesMode
	 */
	public get mode():number
	{
		return this._pMode;
	}

	/**
	 * Returns the priority of the particle animation node, used to order the agal generated in a particle animation set. Set automatically on instantiation.
	 *
	 * @see away.animators.ParticleAnimationSet
	 * @see #getAGALVertexCode
	 */
	public get priority():number
	{
		return this._priority;
	}

	/**
	 * Returns the length of the data used by the node when in <code>LOCAL_STATIC</code> mode. Used to generate the local static data of the particle animation set.
	 *
	 * @see away.animators.ParticleAnimationSet
	 * @see #getAGALVertexCode
	 */
	public get dataLength():number
	{
		return this._pDataLength;
	}

	/**
	 * Returns the generated data vector of the node after one particle pass during the generation of all local static data of the particle animation set.
	 *
	 * @see away.animators.ParticleAnimationSet
	 * @see #generatePropertyOfOneParticle
	 */
	public get oneData():Array<number>
	{
		return this._pOneData;
	}

	/**
	 * Creates a new <code>ParticleNodeBase</code> object.
	 *
	 * @param               name            Defines the generic name of the particle animation node.
	 * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	 * @param               dataLength      Defines the length of the data used by the node when in <code>LOCAL_STATIC</code> mode.
	 * @param    [optional] priority        the priority of the particle animation node, used to order the agal generated in a particle animation set. Defaults to 1.
	 */
	constructor(name:string, mode:number, dataLength:number, priority:number = 1)
	{
		super();

		name = name + ParticleNodeBase.MODES[mode];

		this.name = name;
		this._pMode = mode;
		this._priority = priority;
		this._pDataLength = dataLength;

		this._pOneData = new Array<number>(this._pDataLength);
	}

	/**
	 * Returns the AGAL code of the particle animation node for use in the vertex shader.
	 */
	public getAGALVertexCode(shader:ShaderBase, animationSet:ParticleAnimationSet, registerCache:ShaderRegisterCache, animationRegisterData:AnimationRegisterData):string
	{
		return "";
	}

	/**
	 * Returns the AGAL code of the particle animation node for use in the fragment shader.
	 */
	public getAGALFragmentCode(shader:ShaderBase, animationSet:ParticleAnimationSet, registerCache:ShaderRegisterCache, animationRegisterData:AnimationRegisterData):string
	{
		return "";
	}

	/**
	 * Returns the AGAL code of the particle animation node for use in the fragment shader when UV coordinates are required.
	 */
	public getAGALUVCode(shader:ShaderBase, animationSet:ParticleAnimationSet, registerCache:ShaderRegisterCache, animationRegisterData:AnimationRegisterData):string
	{
		return "";
	}

	/**
	 * Called internally by the particle animation set when assigning the set of static properties originally defined by the initParticleFunc of the set.
	 *
	 * @see away.animators.ParticleAnimationSet#initParticleFunc
	 */
	public _iGeneratePropertyOfOneParticle(param:ParticleProperties):void
	{

	}

	/**
	 * Called internally by the particle animation set when determining the requirements of the particle animation node AGAL.
	 */
	public _iProcessAnimationSetting(particleAnimationSet:ParticleAnimationSet):void
	{

	}
}