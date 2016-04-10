import ElementsBase						from "awayjs-display/lib/graphics/ElementsBase";
import Camera							from "awayjs-display/lib/display/Camera";
import Graphic							from "awayjs-display/lib/graphics/Graphic";

import ContextGLProgramType				from "awayjs-stagegl/lib/base/ContextGLProgramType";
import Stage							from "awayjs-stagegl/lib/base/Stage";

import AnimatorBase						from "../animators/AnimatorBase";
import AnimationRegisterCache			from "../animators/data/AnimationRegisterCache";
import ParticleAnimationSet				from "../animators/ParticleAnimationSet";
import AnimationElements				from "../animators/data/AnimationElements";
import ParticlePropertiesMode			from "../animators/data/ParticlePropertiesMode";
import ParticleNodeBase					from "../animators/nodes/ParticleNodeBase";
import ParticleStateBase				from "../animators/states/ParticleStateBase";
import ShaderBase						from "../shaders/ShaderBase";
import GL_RenderableBase				from "../renderables/GL_RenderableBase";
import GL_GraphicRenderable			from "../renderables/GL_GraphicRenderable";

/**
 * Provides an interface for assigning paricle-based animation data sets to sprite-based entity objects
 * and controlling the various available states of animation through an interative playhead that can be
 * automatically updated or manually triggered.
 *
 * Requires that the containing geometry of the parent sprite is particle geometry
 *
 * @see away.base.ParticleGraphics
 */
class ParticleAnimator extends AnimatorBase
{

	private _particleAnimationSet:ParticleAnimationSet;
	private _animationParticleStates:Array<ParticleStateBase> = new Array<ParticleStateBase>();
	private _animatorParticleStates:Array<ParticleStateBase> = new Array<ParticleStateBase>();
	private _timeParticleStates:Array<ParticleStateBase> = new Array<ParticleStateBase>();
	private _totalLenOfOneVertex:number /*uint*/ = 0;
	private _animatorSubGeometries:Object = new Object();

	/**
	 * Creates a new <code>ParticleAnimator</code> object.
	 *
	 * @param particleAnimationSet The animation data set containing the particle animations used by the animator.
	 */
	constructor(particleAnimationSet:ParticleAnimationSet)
	{
		super(particleAnimationSet);
		this._particleAnimationSet = particleAnimationSet;

		var state:ParticleStateBase;
		var node:ParticleNodeBase;

		for (var i:number = 0; i < this._particleAnimationSet.particleNodes.length; i++) {
			node = this._particleAnimationSet.particleNodes[i];
			state = <ParticleStateBase> this.getAnimationState(node);
			if (node.mode == ParticlePropertiesMode.LOCAL_DYNAMIC) {
				this._animatorParticleStates.push(state);
				node._iDataOffset = this._totalLenOfOneVertex;
				this._totalLenOfOneVertex += node.dataLength;
			} else {
				this._animationParticleStates.push(state);
			}
			if (state.needUpdateTime)
				this._timeParticleStates.push(state);
		}
	}

	/**
	 * @inheritDoc
	 */
	public clone():AnimatorBase
	{
		return new ParticleAnimator(this._particleAnimationSet);
	}

	/**
	 * @inheritDoc
	 */
	public setRenderState(shader:ShaderBase, renderable:GL_RenderableBase, stage:Stage, camera:Camera, vertexConstantOffset:number /*int*/, vertexStreamOffset:number /*int*/)
	{
		var animationRegisterCache:AnimationRegisterCache = this._particleAnimationSet._iAnimationRegisterCache;

		var graphic:Graphic = (<GL_GraphicRenderable> renderable).graphic;
		var state:ParticleStateBase;
		var i:number;

		if (!graphic)
			throw(new Error("Must be graphic"));

		//process animation sub geometries
		var animationElements:AnimationElements = this._particleAnimationSet.getAnimationElements(graphic);

		for (i = 0; i < this._animationParticleStates.length; i++)
			this._animationParticleStates[i].setRenderState(stage, renderable, animationElements, animationRegisterCache, camera);

		//process animator subgeometries
		var animatorElements:AnimationElements = this.getAnimatorElements(graphic);

		for (i = 0; i < this._animatorParticleStates.length; i++)
			this._animatorParticleStates[i].setRenderState(stage, renderable, animatorElements, animationRegisterCache, camera);

		stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, animationRegisterCache.vertexConstantOffset, animationRegisterCache.vertexConstantData, animationRegisterCache.numVertexConstant);

		if (animationRegisterCache.numFragmentConstant > 0)
			stage.context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, animationRegisterCache.fragmentConstantOffset, animationRegisterCache.fragmentConstantData, animationRegisterCache.numFragmentConstant);
	}

	/**
	 * @inheritDoc
	 */
	public testGPUCompatibility(shader:ShaderBase)
	{

	}

	/**
	 * @inheritDoc
	 */
	public start()
	{
		super.start();

		for (var i:number = 0; i < this._timeParticleStates.length; i++)
			this._timeParticleStates[i].offset(this._pAbsoluteTime);
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateDeltaTime(dt:number)
	{
		this._pAbsoluteTime += dt;

		for (var i:number = 0; i < this._timeParticleStates.length; i++)
			this._timeParticleStates[i].update(this._pAbsoluteTime);
	}

	/**
	 * @inheritDoc
	 */
	public resetTime(offset:number /*int*/ = 0)
	{
		for (var i:number = 0; i < this._timeParticleStates.length; i++)
			this._timeParticleStates[i].offset(this._pAbsoluteTime + offset);
		this.update(this.time);
	}

	public dispose()
	{
		for (var key in this._animatorSubGeometries)
			(<AnimationElements> this._animatorSubGeometries[key]).dispose();
	}

	private getAnimatorElements(graphic:Graphic):AnimationElements
	{
		if (!this._animatorParticleStates.length)
			return;

		var elements:ElementsBase = graphic.elements;
		var animatorElements:AnimationElements = this._animatorSubGeometries[elements.id] = new AnimationElements();

		//create the vertexData vector that will be used for local state data
		animatorElements.createVertexData(elements.numVertices, this._totalLenOfOneVertex);

		//pass the particles data to the animator elements
		animatorElements.animationParticles = this._particleAnimationSet.getAnimationElements(graphic).animationParticles;
	}
}

export default ParticleAnimator;