import {Stage}							from "@awayjs/stage/lib/base/Stage";
import {IContextGL}						from "@awayjs/stage/lib/base/IContextGL";
import {IVertexBuffer}					from "@awayjs/stage/lib/base/IVertexBuffer";

import {ParticleAnimationData}			from "../../animators/data/ParticleAnimationData";

/**
 * ...
 */
export class AnimationElements
{
	public static SUBGEOM_ID_COUNT:number = 0;

	public _pVertexData:Array<number>;

	public _pVertexBuffer:Array<IVertexBuffer> = new Array<IVertexBuffer>(8);
	public _pBufferContext:Array<IContextGL> = new Array<IContextGL>(8);
	public _pBufferDirty:Array<boolean> = new Array<boolean>(8);

	private _numVertices:number;

	private _totalLenOfOneVertex:number;

	public numProcessedVertices:number = 0;

	public previousTime:number = Number.NEGATIVE_INFINITY;

	public animationParticles:Array<ParticleAnimationData> = new Array<ParticleAnimationData>();

	/**
	 * An id for this animation subgeometry, used to identify animation subgeometries when using animation sets.
	 *
	 * @private
	 */
	public _iUniqueId:number;//Arcane

	constructor()
	{
		for (var i:number = 0; i < 8; i++)
			this._pBufferDirty[i] = true;

		this._iUniqueId = AnimationElements.SUBGEOM_ID_COUNT++;
	}

	public createVertexData(numVertices:number, totalLenOfOneVertex:number):void
	{
		this._numVertices = numVertices;
		this._totalLenOfOneVertex = totalLenOfOneVertex;
		this._pVertexData = new Array<number>(numVertices*totalLenOfOneVertex);
	}

	public activateVertexBuffer(index:number, bufferOffset:number, stage:Stage, format:number):void
	{
		var contextIndex:number = stage.stageIndex;
		var context:IContextGL = <IContextGL> stage.context;

		var buffer:IVertexBuffer = this._pVertexBuffer[contextIndex];
		if (!buffer || this._pBufferContext[contextIndex] != context) {
			buffer = this._pVertexBuffer[contextIndex] = context.createVertexBuffer(this._numVertices, this._totalLenOfOneVertex*4);
			this._pBufferContext[contextIndex] = context;
			this._pBufferDirty[contextIndex] = true;
		}
		if (this._pBufferDirty[contextIndex]) {
			buffer.uploadFromArray(this._pVertexData, 0, this._numVertices);
			this._pBufferDirty[contextIndex] = false;
		}
		context.setVertexBufferAt(index, buffer, bufferOffset*4, format);
	}

	public dispose():void
	{
		while (this._pVertexBuffer.length) {
			var vertexBuffer:IVertexBuffer = this._pVertexBuffer.pop()

			if (vertexBuffer)
				vertexBuffer.dispose();
		}
	}

	public invalidateBuffer():void
	{
		for (var i:number = 0; i < 8; i++)
			this._pBufferDirty[i] = true;
	}

	public get vertexData():Array<number>
	{
		return this._pVertexData;
	}

	public get numVertices():number
	{
		return this._numVertices;
	}

	public get totalLenOfOneVertex():number
	{
		return this._totalLenOfOneVertex;
	}
}