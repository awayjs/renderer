import Vector3D							from "awayjs-core/lib/geom/Vector3D";

import Camera							from "awayjs-display/lib/display/Camera";

import Stage							from "awayjs-stagegl/lib/base/Stage";
import ContextGLVertexBufferFormat		from "awayjs-stagegl/lib/base/ContextGLVertexBufferFormat";

import ParticleAnimator					from "awayjs-renderergl/lib/animators/ParticleAnimator";
import AnimationRegisterCache			from "awayjs-renderergl/lib/animators/data/AnimationRegisterCache";
import AnimationElements				from "awayjs-renderergl/lib/animators/data/AnimationElements";
import ParticlePropertiesMode			from "awayjs-renderergl/lib/animators/data/ParticlePropertiesMode";
import ParticleSpriteSheetNode			from "awayjs-renderergl/lib/animators/nodes/ParticleSpriteSheetNode";
import ParticleStateBase				from "awayjs-renderergl/lib/animators/states/ParticleStateBase";
import GL_RenderableBase				from "awayjs-renderergl/lib/animators/../renderables/GL_RenderableBase";

/**
 * ...
 */
class ParticleSpriteSheetState extends ParticleStateBase
{
	/** @private */
	public static UV_INDEX_0:number /*uint*/ = 0;

	/** @private */
	public static UV_INDEX_1:number /*uint*/ = 1;

	private _particleSpriteSheetNode:ParticleSpriteSheetNode;
	private _usesCycle:boolean;
	private _usesPhase:boolean;
	private _totalFrames:number /*int*/;
	private _numColumns:number /*int*/;
	private _numRows:number /*int*/;
	private _cycleDuration:number;
	private _cyclePhase:number;
	private _spriteSheetData:Array<number>;

	/**
	 * Defines the cycle phase, when in global mode. Defaults to zero.
	 */
	public get cyclePhase():number
	{
		return this._cyclePhase;
	}

	public set cyclePhase(value:number)
	{
		this._cyclePhase = value;

		this.updateSpriteSheetData();
	}

	/**
	 * Defines the cycle duration in seconds, when in global mode. Defaults to 1.
	 */
	public get cycleDuration():number
	{
		return this._cycleDuration;
	}

	public set cycleDuration(value:number)
	{
		this._cycleDuration = value;

		this.updateSpriteSheetData();
	}

	constructor(animator:ParticleAnimator, particleSpriteSheetNode:ParticleSpriteSheetNode)
	{
		super(animator, particleSpriteSheetNode);

		this._particleSpriteSheetNode = particleSpriteSheetNode;

		this._usesCycle = this._particleSpriteSheetNode._iUsesCycle;
		this._usesPhase = this._particleSpriteSheetNode._iUsesCycle;
		this._totalFrames = this._particleSpriteSheetNode._iTotalFrames;
		this._numColumns = this._particleSpriteSheetNode._iNumColumns;
		this._numRows = this._particleSpriteSheetNode._iNumRows;
		this._cycleDuration = this._particleSpriteSheetNode._iCycleDuration;
		this._cyclePhase = this._particleSpriteSheetNode._iCyclePhase;

		this.updateSpriteSheetData();
	}

	public setRenderState(stage:Stage, renderable:GL_RenderableBase, animationElements:AnimationElements, animationRegisterCache:AnimationRegisterCache, camera:Camera)
	{
		if (animationRegisterCache.needUVAnimation) {
			animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleSpriteSheetState.UV_INDEX_0), this._spriteSheetData[0], this._spriteSheetData[1], this._spriteSheetData[2], this._spriteSheetData[3]);
			if (this._usesCycle) {
				var index:number /*int*/ = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleSpriteSheetState.UV_INDEX_1);
				if (this._particleSpriteSheetNode.mode == ParticlePropertiesMode.LOCAL_STATIC) {
					if (this._usesPhase)
						animationElements.activateVertexBuffer(index, this._particleSpriteSheetNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
					else
						animationElements.activateVertexBuffer(index, this._particleSpriteSheetNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_2);
				} else
					animationRegisterCache.setVertexConst(index, this._spriteSheetData[4], this._spriteSheetData[5]);
			}
		}
	}

	private updateSpriteSheetData()
	{
		this._spriteSheetData = new Array<number>(8);

		var uTotal:number = this._totalFrames/this._numColumns;

		this._spriteSheetData[0] = uTotal;
		this._spriteSheetData[1] = 1/this._numColumns;
		this._spriteSheetData[2] = 1/this._numRows;

		if (this._usesCycle) {
			if (this._cycleDuration <= 0)
				throw(new Error("the cycle duration must be greater than zero"));
			this._spriteSheetData[4] = uTotal/this._cycleDuration;
			this._spriteSheetData[5] = this._cycleDuration;
			if (this._usesPhase)
				this._spriteSheetData[6] = this._cyclePhase;
		}
	}
}

export default ParticleSpriteSheetState;