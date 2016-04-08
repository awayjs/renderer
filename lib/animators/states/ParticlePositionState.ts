import Vector3D							from "awayjs-core/lib/geom/Vector3D";

import Camera							from "awayjs-display/lib/display/Camera";

import Stage							from "awayjs-stagegl/lib/base/Stage";
import ContextGLVertexBufferFormat		from "awayjs-stagegl/lib/base/ContextGLVertexBufferFormat";

import ParticleAnimator					from "awayjs-renderergl/lib/animators/ParticleAnimator";
import AnimationRegisterCache			from "awayjs-renderergl/lib/animators/data/AnimationRegisterCache";
import AnimationElements				from "awayjs-renderergl/lib/animators/data/AnimationElements";
import ParticlePropertiesMode			from "awayjs-renderergl/lib/animators/data/ParticlePropertiesMode";
import ParticlePositionNode				from "awayjs-renderergl/lib/animators/nodes/ParticlePositionNode";
import ParticleStateBase				from "awayjs-renderergl/lib/animators/states/ParticleStateBase";
import GL_RenderableBase				from "awayjs-renderergl/lib/animators/../renderables/GL_RenderableBase";

/**
 * ...
 * @author ...
 */
class ParticlePositionState extends ParticleStateBase
{
	/** @private */
	public static POSITION_INDEX:number /*uint*/ = 0;

	private _particlePositionNode:ParticlePositionNode;
	private _position:Vector3D;

	/**
	 * Defines the position of the particle when in global mode. Defaults to 0,0,0.
	 */
	public get position():Vector3D
	{
		return this._position;
	}

	public set position(value:Vector3D)
	{
		this._position = value;
	}

	/**
	 *
	 */
	public getPositions():Array<Vector3D>
	{
		return this._pDynamicProperties;
	}

	public setPositions(value:Array<Vector3D>)
	{
		this._pDynamicProperties = value;

		this._pDynamicPropertiesDirty = new Object();
	}

	constructor(animator:ParticleAnimator, particlePositionNode:ParticlePositionNode)
	{
		super(animator, particlePositionNode);

		this._particlePositionNode = particlePositionNode;
		this._position = this._particlePositionNode._iPosition;
	}

	/**
	 * @inheritDoc
	 */
	public setRenderState(stage:Stage, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterCache:AnimationRegisterCache, camera:Camera)
	{
		if (this._particlePositionNode.mode == ParticlePropertiesMode.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationElements._iUniqueId])
			this._pUpdateDynamicProperties(animationElements);

		var index:number /*int*/ = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticlePositionState.POSITION_INDEX);

		if (this._particlePositionNode.mode == ParticlePropertiesMode.GLOBAL)
			animationRegisterCache.setVertexConst(index, this._position.x, this._position.y, this._position.z);
		else
			animationElements.activateVertexBuffer(index, this._particlePositionNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
	}
}

export default ParticlePositionState;