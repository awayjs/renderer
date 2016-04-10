import ElementsBase						from "awayjs-display/lib/graphics/ElementsBase";
import IAnimationSet					from "awayjs-display/lib/animators/IAnimationSet";
import ParticleData						from "awayjs-display/lib/animators/data/ParticleData";
import AnimationNodeBase				from "awayjs-display/lib/animators/nodes/AnimationNodeBase";
import Sprite							from "awayjs-display/lib/display/Sprite";
import Graphic							from "awayjs-display/lib/graphics/Graphic";
import Graphics							from "awayjs-display/lib/graphics/Graphics";

import Stage							from "awayjs-stagegl/lib/base/Stage";

import AnimationSetBase					from "../animators/AnimationSetBase";
import AnimationRegisterCache			from "../animators/data/AnimationRegisterCache";
import AnimationElements				from "../animators/data/AnimationElements";
import ParticleAnimationData			from "../animators/data/ParticleAnimationData";
import ParticleProperties				from "../animators/data/ParticleProperties";
import ParticlePropertiesMode			from "../animators/data/ParticlePropertiesMode";
import ParticleNodeBase					from "../animators/nodes/ParticleNodeBase";
import ParticleTimeNode					from "../animators/nodes/ParticleTimeNode";
import ShaderBase						from "../shaders/ShaderBase";


/**
 * The animation data set used by particle-based animators, containing particle animation data.
 *
 * @see away.animators.ParticleAnimator
 */
class ParticleAnimationSet extends AnimationSetBase implements IAnimationSet
{
	/** @private */
	public _iAnimationRegisterCache:AnimationRegisterCache;

	//all other nodes dependent on it
	private _timeNode:ParticleTimeNode;

	/**
	 * Property used by particle nodes that require compilers at the end of the shader
	 */
	public static POST_PRIORITY:number /*int*/ = 9;

	/**
	 * Property used by particle nodes that require color compilers
	 */
	public static COLOR_PRIORITY:number /*int*/ = 18;

	private _animationElements:Object = new Object();
	private _particleNodes:Array<ParticleNodeBase> = new Array<ParticleNodeBase>();
	private _localDynamicNodes:Array<ParticleNodeBase> = new Array<ParticleNodeBase>();
	private _localStaticNodes:Array<ParticleNodeBase> = new Array<ParticleNodeBase>();
	private _totalLenOfOneVertex:number /*int*/ = 0;

	//set true if has an node which will change UV
	public hasUVNode:boolean;
	//set if the other nodes need to access the velocity
	public needVelocity:boolean;
	//set if has a billboard node.
	public hasBillboard:boolean;
	//set if has an node which will apply color multiple operation
	public hasColorMulNode:boolean;
	//set if has an node which will apply color add operation
	public hasColorAddNode:boolean;

	/**
	 * Initialiser function for static particle properties. Needs to reference a with the following format
	 *
	 * <code>
	 * initParticleFunc(prop:ParticleProperties)
	 * {
	 * 		//code for settings local properties
	 * }
	 * </code>
	 *
	 * Aside from setting any properties required in particle animation nodes using local static properties, the initParticleFunc function
	 * is required to time node requirements as they may be needed. These properties on the ParticleProperties object can include
	 * <code>startTime</code>, <code>duration</code> and <code>delay</code>. The use of these properties is determined by the setting
	 * arguments passed in the constructor of the particle animation set. By default, only the <code>startTime</code> property is required.
	 */
	public initParticleFunc:Function;

	/**
	 * Initialiser function scope for static particle properties
	 */
	public initParticleScope:Object;

	/**
	 *
	 */
	public shareAnimationGraphics:boolean = true;

	/**
	 * Creates a new <code>ParticleAnimationSet</code>
	 *
	 * @param    [optional] usesDuration    Defines whether the animation set uses the <code>duration</code> data in its static properties to determine how long a particle is visible for. Defaults to false.
	 * @param    [optional] usesLooping     Defines whether the animation set uses a looping timeframe for each particle determined by the <code>startTime</code>, <code>duration</code> and <code>delay</code> data in its static properties function. Defaults to false. Requires <code>usesDuration</code> to be true.
	 * @param    [optional] usesDelay       Defines whether the animation set uses the <code>delay</code> data in its static properties to determine how long a particle is hidden for. Defaults to false. Requires <code>usesLooping</code> to be true.
	 */
	constructor(usesDuration:boolean = false, usesLooping:boolean = false, usesDelay:boolean = false)
	{
		super();

		//automatically add a particle time node to the set
		this.addAnimation(this._timeNode = new ParticleTimeNode(usesDuration, usesLooping, usesDelay));
	}

	/**
	 * Returns a vector of the particle animation nodes contained within the set.
	 */
	public get particleNodes():Array<ParticleNodeBase>
	{
		return this._particleNodes;
	}

	/**
	 * @inheritDoc
	 */
	public addAnimation(node:AnimationNodeBase)
	{
		var i:number /*int*/;
		var n:ParticleNodeBase = <ParticleNodeBase> node;
		n._iProcessAnimationSetting(this);
		if (n.mode == ParticlePropertiesMode.LOCAL_STATIC) {
			n._iDataOffset = this._totalLenOfOneVertex;
			this._totalLenOfOneVertex += n.dataLength;
			this._localStaticNodes.push(n);
		} else if (n.mode == ParticlePropertiesMode.LOCAL_DYNAMIC)
			this._localDynamicNodes.push(n);

		for (i = this._particleNodes.length - 1; i >= 0; i--) {
			if (this._particleNodes[i].priority <= n.priority)
				break;
		}

		this._particleNodes.splice(i + 1, 0, n);

		super.addAnimation(node);
	}

	/**
	 * @inheritDoc
	 */
	public activate(shader:ShaderBase, stage:Stage)
	{
//			this._iAnimationRegisterCache = pass.animationRegisterCache;
	}

	/**
	 * @inheritDoc
	 */
	public deactivate(shader:ShaderBase, stage:Stage)
	{
//			var context:IContextGL = <IContextGL> stage.context;
//			var offset:number /*int*/ = this._iAnimationRegisterCache.vertexAttributesOffset;
//			var used:number /*int*/ = this._iAnimationRegisterCache.numUsedStreams;
//			for (var i:number /*int*/ = offset; i < used; i++)
//				context.setVertexBufferAt(i, null);
	}

	/**
	 * @inheritDoc
	 */
	public getAGALVertexCode(shader:ShaderBase):string
	{
		//grab animationRegisterCache from the materialpassbase or create a new one if the first time
		this._iAnimationRegisterCache = shader.animationRegisterCache;

		if (this._iAnimationRegisterCache == null)
			this._iAnimationRegisterCache = shader.animationRegisterCache = new AnimationRegisterCache(shader.profile);

		//reset animationRegisterCache
		this._iAnimationRegisterCache.vertexConstantOffset = shader.numUsedVertexConstants;
		this._iAnimationRegisterCache.vertexAttributesOffset = shader.numUsedStreams;
		this._iAnimationRegisterCache.varyingsOffset = shader.numUsedVaryings;
		this._iAnimationRegisterCache.fragmentConstantOffset = shader.numUsedFragmentConstants;
		this._iAnimationRegisterCache.hasUVNode = this.hasUVNode;
		this._iAnimationRegisterCache.needVelocity = this.needVelocity;
		this._iAnimationRegisterCache.hasBillboard = this.hasBillboard;
		this._iAnimationRegisterCache.sourceRegisters = shader.animatableAttributes;
		this._iAnimationRegisterCache.targetRegisters = shader.animationTargetRegisters;
		this._iAnimationRegisterCache.needFragmentAnimation = shader.usesFragmentAnimation;
		this._iAnimationRegisterCache.needUVAnimation = !shader.usesUVTransform;
		this._iAnimationRegisterCache.hasColorAddNode = this.hasColorAddNode;
		this._iAnimationRegisterCache.hasColorMulNode = this.hasColorMulNode;
		this._iAnimationRegisterCache.reset();

		var code:string = "";

		code += this._iAnimationRegisterCache.getInitCode();

		var node:ParticleNodeBase;
		var i:number /*int*/;

		for (i = 0; i < this._particleNodes.length; i++) {
			node = this._particleNodes[i];
			if (node.priority < ParticleAnimationSet.POST_PRIORITY)
				code += node.getAGALVertexCode(shader, this._iAnimationRegisterCache);
		}

		code += this._iAnimationRegisterCache.getCombinationCode();

		for (i = 0; i < this._particleNodes.length; i++) {
			node = this._particleNodes[i];
			if (node.priority >= ParticleAnimationSet.POST_PRIORITY && node.priority < ParticleAnimationSet.COLOR_PRIORITY)
				code += node.getAGALVertexCode(shader, this._iAnimationRegisterCache);
		}

		code += this._iAnimationRegisterCache.initColorRegisters();

		for (i = 0; i < this._particleNodes.length; i++) {
			node = this._particleNodes[i];
			if (node.priority >= ParticleAnimationSet.COLOR_PRIORITY)
				code += node.getAGALVertexCode(shader, this._iAnimationRegisterCache);
		}
		code += this._iAnimationRegisterCache.getColorPassCode();
		return code;
	}

	/**
	 * @inheritDoc
	 */
	public getAGALUVCode(shader:ShaderBase):string
	{
		var code:string = "";
		if (this.hasUVNode) {
			this._iAnimationRegisterCache.setUVSourceAndTarget(shader.uvSource, shader.uvTarget);
			code += "mov " + this._iAnimationRegisterCache.uvTarget + ".xy," + this._iAnimationRegisterCache.uvAttribute.toString() + "\n";
			var node:ParticleNodeBase;
			for (var i:number /*uint*/ = 0; i < this._particleNodes.length; i++)
				node = this._particleNodes[i];
				code += node.getAGALUVCode(shader, this._iAnimationRegisterCache);
			code += "mov " + this._iAnimationRegisterCache.uvVar.toString() + "," + this._iAnimationRegisterCache.uvTarget + ".xy\n";
		} else
			code += "mov " + shader.uvTarget + "," + shader.uvSource + "\n";
		return code;
	}

	/**
	 * @inheritDoc
	 */
	public getAGALFragmentCode(shader:ShaderBase, shadedTarget:string):string
	{
		return this._iAnimationRegisterCache.getColorCombinationCode(shadedTarget);
	}

	/**
	 * @inheritDoc
	 */
	public doneAGALCode(shader:ShaderBase)
	{
		this._iAnimationRegisterCache.setDataLength();

		//set vertexZeroConst,vertexOneConst,vertexTwoConst
		this._iAnimationRegisterCache.setVertexConst(this._iAnimationRegisterCache.vertexZeroConst.index, 0, 1, 2, 0);
	}

	/**
	 * @inheritDoc
	 */
	public get usesCPU():boolean
	{
		return false;
	}

	/**
	 * @inheritDoc
	 */
	public cancelGPUCompatibility()
	{

	}

	public dispose()
	{
		for (var key in this._animationElements)
			(<AnimationElements> this._animationElements[key]).dispose();

		super.dispose();
	}

	public getAnimationElements(graphic:Graphic)
	{
		var animationElements:AnimationElements = (this.shareAnimationGraphics)? this._animationElements[graphic.elements.id] : this._animationElements[graphic.id];

		if (animationElements)
			return animationElements;

		this._iGenerateAnimationElements(graphic.parent);

		return (this.shareAnimationGraphics)? this._animationElements[graphic.elements.id] : this._animationElements[graphic.id];
	}


	/** @private */
	public _iGenerateAnimationElements(graphics:Graphics)
	{
		if (this.initParticleFunc == null)
			throw(new Error("no initParticleFunc set"));

		var i:number /*int*/, j:number /*int*/, k:number /*int*/;
		var animationElements:AnimationElements;
		var newAnimationElements:boolean = false;
		var elements:ElementsBase;
		var graphic:Graphic;
		var localNode:ParticleNodeBase;

		for (i = 0; i < graphics.count; i++) {
			graphic = graphics.getGraphicAt(i);
			elements = graphic.elements;
			if (this.shareAnimationGraphics) {
				animationElements = this._animationElements[elements.id];

				if (animationElements)
					continue;
			}

			animationElements = new AnimationElements();

			if (this.shareAnimationGraphics)
				this._animationElements[elements.id] = animationElements;
			else
				this._animationElements[graphic.id] = animationElements;

			newAnimationElements = true;

			//create the vertexData vector that will be used for local node data
			animationElements.createVertexData(elements.numVertices, this._totalLenOfOneVertex);
		}

		if (!newAnimationElements)
			return;

		var particles:Array<ParticleData> = graphics.particles;
		var particlesLength:number /*uint*/ = particles.length;
		var numParticles:number /*uint*/ = graphics.numParticles;
		var particleProperties:ParticleProperties = new ParticleProperties();
		var particle:ParticleData;

		var oneDataLen:number /*int*/;
		var oneDataOffset:number /*int*/;
		var counterForVertex:number /*int*/;
		var counterForOneData:number /*int*/;
		var oneData:Array<number>;
		var numVertices:number /*uint*/;
		var vertexData:Array<number>;
		var vertexLength:number /*uint*/;
		var startingOffset:number /*uint*/;
		var vertexOffset:number /*uint*/;

		//default values for particle param
		particleProperties.total = numParticles;
		particleProperties.startTime = 0;
		particleProperties.duration = 1000;
		particleProperties.delay = 0.1;

		i = 0;
		j = 0;
		while (i < numParticles) {
			particleProperties.index = i;

			//call the init on the particle parameters
			this.initParticleFunc.call(this.initParticleScope, particleProperties);

			//create the next set of node properties for the particle
			for (k = 0; k < this._localStaticNodes.length; k++)
				this._localStaticNodes[k]._iGeneratePropertyOfOneParticle(particleProperties);

			//loop through all particle data for the curent particle
			while (j < particlesLength && (particle = particles[j]).particleIndex == i) {
				//find the target animationElements
				for (k = 0; k < graphics.count; k++) {
					graphic = graphics.getGraphicAt(k);
					if (graphic.elements == particle.elements) {
						animationElements = (this.shareAnimationGraphics)? this._animationElements[graphic.elements.id] : this._animationElements[graphic.id];
						break;
					}
				}
				numVertices = particle.numVertices;
				vertexData = animationElements.vertexData;
				vertexLength = numVertices*this._totalLenOfOneVertex;
				startingOffset = animationElements.numProcessedVertices*this._totalLenOfOneVertex;

				//loop through each static local node in the animation set
				for (k = 0; k < this._localStaticNodes.length; k++) {
					localNode = this._localStaticNodes[k];
					oneData = localNode.oneData;
					oneDataLen = localNode.dataLength;
					oneDataOffset = startingOffset + localNode._iDataOffset;

					//loop through each vertex set in the vertex data
					for (counterForVertex = 0; counterForVertex < vertexLength; counterForVertex += this._totalLenOfOneVertex) {
						vertexOffset = oneDataOffset + counterForVertex;

						//add the data for the local node to the vertex data
						for (counterForOneData = 0; counterForOneData < oneDataLen; counterForOneData++)
							vertexData[vertexOffset + counterForOneData] = oneData[counterForOneData];
					}

				}

				//store particle properties if they need to be retreived for dynamic local nodes
				if (this._localDynamicNodes.length)
					animationElements.animationParticles.push(new ParticleAnimationData(i, particleProperties.startTime, particleProperties.duration, particleProperties.delay, particle));

				animationElements.numProcessedVertices += numVertices;

				//next index
				j++;
			}

			//next particle
			i++;
		}
	}
}

export default ParticleAnimationSet;