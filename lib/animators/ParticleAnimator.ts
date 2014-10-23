import ISubMesh							= require("awayjs-display/lib/base/ISubMesh");
import SubGeometryBase					= require("awayjs-display/lib/base/SubGeometryBase");
import Camera							= require("awayjs-display/lib/entities/Camera");

import AnimatorBase						= require("awayjs-stagegl/lib/animators/AnimatorBase");
import AnimationRegisterCache			= require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
import Stage							= require("awayjs-stagegl/lib/base/Stage");
import RenderableBase					= require("awayjs-stagegl/lib/pool/RenderableBase");
import TriangleSubMeshRenderable		= require("awayjs-stagegl/lib/pool/TriangleSubMeshRenderable");
import ContextGLProgramType				= require("awayjs-stagegl/lib/base/ContextGLProgramType");
import IContextStageGL					= require("awayjs-stagegl/lib/base/IContextStageGL");
import ShaderObjectBase					= require("awayjs-stagegl/lib/materials/compilation/ShaderObjectBase");

import ParticleAnimationSet				= require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
import AnimationSubGeometry				= require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
import ParticleAnimationData			= require("awayjs-renderergl/lib/animators/data/ParticleAnimationData");
import ParticlePropertiesMode			= require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
import ParticleNodeBase					= require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
import ParticleStateBase				= require("awayjs-renderergl/lib/animators/states/ParticleStateBase");

/**
 * Provides an interface for assigning paricle-based animation data sets to mesh-based entity objects
 * and controlling the various available states of animation through an interative playhead that can be
 * automatically updated or manually triggered.
 *
 * Requires that the containing geometry of the parent mesh is particle geometry
 *
 * @see away.base.ParticleGeometry
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
	public setRenderState(shaderObject:ShaderObjectBase, renderable:RenderableBase, stage:Stage, camera:Camera, vertexConstantOffset:number /*int*/, vertexStreamOffset:number /*int*/)
	{
		var animationRegisterCache:AnimationRegisterCache = this._particleAnimationSet._iAnimationRegisterCache;

		var subMesh:ISubMesh = (<TriangleSubMeshRenderable> renderable).subMesh;
		var state:ParticleStateBase;
		var i:number;

		if (!subMesh)
			throw(new Error("Must be subMesh"));

		//process animation sub geometries
		var animationSubGeometry:AnimationSubGeometry = this._particleAnimationSet.getAnimationSubGeometry(subMesh);

		for (i = 0; i < this._animationParticleStates.length; i++)
			this._animationParticleStates[i].setRenderState(stage, renderable, animationSubGeometry, animationRegisterCache, camera);

		//process animator subgeometries
		var animatorSubGeometry:AnimationSubGeometry = this.getAnimatorSubGeometry(subMesh);

		for (i = 0; i < this._animatorParticleStates.length; i++)
			this._animatorParticleStates[i].setRenderState(stage, renderable, animatorSubGeometry, animationRegisterCache, camera);

		(<IContextStageGL> stage.context).setProgramConstantsFromArray(ContextGLProgramType.VERTEX, animationRegisterCache.vertexConstantOffset, animationRegisterCache.vertexConstantData, animationRegisterCache.numVertexConstant);

		if (animationRegisterCache.numFragmentConstant > 0)
			(<IContextStageGL> stage.context).setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, animationRegisterCache.fragmentConstantOffset, animationRegisterCache.fragmentConstantData, animationRegisterCache.numFragmentConstant);
	}

	/**
	 * @inheritDoc
	 */
	public testGPUCompatibility(shaderObject:ShaderObjectBase)
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
			(<AnimationSubGeometry> this._animatorSubGeometries[key]).dispose();
	}

	private getAnimatorSubGeometry(subMesh:ISubMesh):AnimationSubGeometry
	{
		if (!this._animatorParticleStates.length)
			return;

		var subGeometry:SubGeometryBase = subMesh.subGeometry;
		var animatorSubGeometry:AnimationSubGeometry = this._animatorSubGeometries[subGeometry.id] = new AnimationSubGeometry();

		//create the vertexData vector that will be used for local state data
		animatorSubGeometry.createVertexData(subGeometry.numVertices, this._totalLenOfOneVertex);

		//pass the particles data to the animator subGeometry
		animatorSubGeometry.animationParticles = this._particleAnimationSet.getAnimationSubGeometry(subMesh).animationParticles;
	}
}

export = ParticleAnimator;