import {ElementsBase}						from "@awayjs/display/lib/graphics/ElementsBase";
import {IAnimationSet}					from "@awayjs/display/lib/animators/IAnimationSet";
import {ParticleData}						from "@awayjs/display/lib/animators/data/ParticleData";
import {AnimationNodeBase}				from "@awayjs/display/lib/animators/nodes/AnimationNodeBase";
import {Graphic}							from "@awayjs/display/lib/graphics/Graphic";
import {Graphics}							from "@awayjs/display/lib/graphics/Graphics";

import {AnimationSetBase}					from "../animators/AnimationSetBase";
import {AnimationRegisterData}			from "../animators/data/AnimationRegisterData";
import {AnimationElements}				from "../animators/data/AnimationElements";
import {ParticleAnimationData}			from "../animators/data/ParticleAnimationData";
import {ParticleProperties}				from "../animators/data/ParticleProperties";
import {ParticlePropertiesMode}			from "../animators/data/ParticlePropertiesMode";
import {ParticleNodeBase}					from "../animators/nodes/ParticleNodeBase";
import {ParticleTimeNode}					from "../animators/nodes/ParticleTimeNode";
import {ShaderBase}						from "../shaders/ShaderBase";
import {ShaderRegisterElement}			from "../shaders/ShaderRegisterElement";
import {ShaderRegisterCache}				from "../shaders/ShaderRegisterCache";
import {ShaderRegisterData}				from "../shaders/ShaderRegisterData";

/**
 * The animation data set used by particle-based animators, containing particle animation data.
 *
 * @see away.animators.ParticleAnimator
 */
export class ParticleAnimationSet extends AnimationSetBase implements IAnimationSet
{
	/** @private */
	public _iAnimationRegisterData:AnimationRegisterData;

	//all other nodes dependent on it
	private _timeNode:ParticleTimeNode;

	/**
	 * Property used by particle nodes that require compilers at the end of the shader
	 */
	public static POST_PRIORITY:number = 9;

	/**
	 * Property used by particle nodes that require color compilers
	 */
	public static COLOR_PRIORITY:number = 18;

	private _animationElements:Object = new Object();
	private _particleNodes:Array<ParticleNodeBase> = new Array<ParticleNodeBase>();
	private _localDynamicNodes:Array<ParticleNodeBase> = new Array<ParticleNodeBase>();
	private _localStaticNodes:Array<ParticleNodeBase> = new Array<ParticleNodeBase>();
	private _totalLenOfOneVertex:number = 0;

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
	public addAnimation(node:AnimationNodeBase):void
	{
		var i:number;
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
	public getAGALVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		//grab animationRegisterData from the materialpassbase or create a new one if the first time
		this._iAnimationRegisterData = shader.animationRegisterData;

		if (this._iAnimationRegisterData == null)
			this._iAnimationRegisterData = shader.animationRegisterData = new AnimationRegisterData();

		//reset animationRegisterData
		this._iAnimationRegisterData.reset(registerCache, sharedRegisters, this.needVelocity);

		var code:string = "";

		var len:number = sharedRegisters.animatableAttributes.length;
		for (var i:number = 0; i < len; i++)
			code += "mov " + sharedRegisters.animationTargetRegisters[i] + "," + sharedRegisters.animatableAttributes[i] + "\n";

		code += "mov " + this._iAnimationRegisterData.positionTarget + ".xyz," + this._iAnimationRegisterData.vertexZeroConst + "\n";

		if (this.needVelocity)
			code += "mov " + this._iAnimationRegisterData.velocityTarget + ".xyz," + this._iAnimationRegisterData.vertexZeroConst + "\n";

		var node:ParticleNodeBase;
		var i:number;

		for (i = 0; i < this._particleNodes.length; i++) {
			node = this._particleNodes[i];
			if (node.priority < ParticleAnimationSet.POST_PRIORITY)
				code += node.getAGALVertexCode(shader, this, registerCache, this._iAnimationRegisterData);
		}

		code += "add " + this._iAnimationRegisterData.scaleAndRotateTarget + ".xyz," + this._iAnimationRegisterData.scaleAndRotateTarget + ".xyz," + this._iAnimationRegisterData.positionTarget + ".xyz\n";

		for (i = 0; i < this._particleNodes.length; i++) {
			node = this._particleNodes[i];
			if (node.priority >= ParticleAnimationSet.POST_PRIORITY && node.priority < ParticleAnimationSet.COLOR_PRIORITY)
				code += node.getAGALVertexCode(shader, this, registerCache, this._iAnimationRegisterData);
		}

		if (this.hasColorMulNode) {
			this._iAnimationRegisterData.colorMulTarget = registerCache.getFreeVertexVectorTemp();
			registerCache.addVertexTempUsages(this._iAnimationRegisterData.colorMulTarget, 1);
			this._iAnimationRegisterData.colorMulVary = registerCache.getFreeVarying();
			code += "mov " + this._iAnimationRegisterData.colorMulTarget + "," + this._iAnimationRegisterData.vertexOneConst + "\n";
		}
		if (this.hasColorAddNode) {
			this._iAnimationRegisterData.colorAddTarget = registerCache.getFreeVertexVectorTemp();
			registerCache.addVertexTempUsages(this._iAnimationRegisterData.colorAddTarget, 1);
			this._iAnimationRegisterData.colorAddVary = registerCache.getFreeVarying();
			code += "mov " + this._iAnimationRegisterData.colorAddTarget + "," + this._iAnimationRegisterData.vertexZeroConst + "\n";
		}

		for (i = 0; i < this._particleNodes.length; i++) {
			node = this._particleNodes[i];
			if (node.priority >= ParticleAnimationSet.COLOR_PRIORITY)
				code += node.getAGALVertexCode(shader, this, registerCache, this._iAnimationRegisterData);
		}
		if (shader.usesFragmentAnimation && (this.hasColorAddNode || this.hasColorMulNode)) {
			if (this.hasColorMulNode)
				code += "mov " + this._iAnimationRegisterData.colorMulVary + "," + this._iAnimationRegisterData.colorMulTarget + "\n";
			if (this.hasColorAddNode)
				code += "mov " + this._iAnimationRegisterData.colorAddVary + "," + this._iAnimationRegisterData.colorAddTarget + "\n";
		}
		return code;
	}

	/**
	 * @inheritDoc
	 */
	public getAGALUVCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		if (this.hasUVNode) {
			this._iAnimationRegisterData.setUVSourceAndTarget(sharedRegisters);
			code += "mov " + this._iAnimationRegisterData.uvTarget + ".xy," + this._iAnimationRegisterData.uvAttribute.toString() + "\n";
			var node:ParticleNodeBase;
			for (var i:number = 0; i < this._particleNodes.length; i++)
				node = this._particleNodes[i];
				code += node.getAGALUVCode(shader, this, registerCache, this._iAnimationRegisterData);
			code += "mov " + this._iAnimationRegisterData.uvVar + "," + this._iAnimationRegisterData.uvTarget + ".xy\n";
		} else
			code += "mov " + sharedRegisters.uvTarget + "," + sharedRegisters.uvSource + "\n";
		return code;
	}

	/**
	 * @inheritDoc
	 */
	public getAGALFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, shadedTarget:ShaderRegisterElement):string
	{
		var code:string = "";
		if (shader.usesFragmentAnimation && (this.hasColorAddNode || this.hasColorMulNode)) {
			if (this.hasColorMulNode)
				code += "mul " + shadedTarget + "," + shadedTarget + "," + this._iAnimationRegisterData.colorMulVary + "\n";
			if (this.hasColorAddNode)
				code += "add " + shadedTarget + "," + shadedTarget + "," + this._iAnimationRegisterData.colorAddVary + "\n";
		}
		return code;
	}

	/**
	 * @inheritDoc
	 */
	public doneAGALCode(shader:ShaderBase):void
	{
		//set vertexZeroConst,vertexOneConst,vertexTwoConst
		shader.setVertexConst(this._iAnimationRegisterData.vertexZeroConst.index, 0, 1, 2, 0);
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
	public cancelGPUCompatibility():void
	{

	}

	public dispose():void
	{
		for (var key in this._animationElements)
			(<AnimationElements> this._animationElements[key]).dispose();

		super.dispose();
	}

	public getAnimationElements(graphic:Graphic):AnimationElements
	{
		var animationElements:AnimationElements = (this.shareAnimationGraphics)? this._animationElements[graphic.elements.id] : this._animationElements[graphic.id];

		if (animationElements)
			return animationElements;

		this._iGenerateAnimationElements(graphic.parent);

		return (this.shareAnimationGraphics)? this._animationElements[graphic.elements.id] : this._animationElements[graphic.id];
	}


	/** @private */
	public _iGenerateAnimationElements(graphics:Graphics):void
	{
		if (this.initParticleFunc == null)
			throw(new Error("no initParticleFunc set"));

		var i:number, j:number, k:number;
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
		var particlesLength:number = particles.length;
		var numParticles:number = graphics.numParticles;
		var particleProperties:ParticleProperties = new ParticleProperties();
		var particle:ParticleData;

		var oneDataLen:number;
		var oneDataOffset:number;
		var counterForVertex:number;
		var counterForOneData:number;
		var oneData:Array<number>;
		var numVertices:number;
		var vertexData:Array<number>;
		var vertexLength:number;
		var startingOffset:number;
		var vertexOffset:number;

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