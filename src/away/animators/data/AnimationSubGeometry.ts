///<reference path="../../_definitions.ts"/>

module away.animators
{
	import Stage					= away.base.Stage;
	import IContextStageGL			= away.stagegl.IContextStageGL;
	import IVertexBuffer			= away.stagegl.IVertexBuffer;
	
	/**
	 * ...
	 */
	export class AnimationSubGeometry
	{
		public static SUBGEOM_ID_COUNT:number = 0;

		public _pVertexData:Array<number>;
		
		public _pVertexBuffer:Array<IVertexBuffer> = new Array<IVertexBuffer>(8);
		public _pBufferContext:Array<IContextStageGL> = new Array<IContextStageGL>(8);
		public _pBufferDirty:Array<boolean> = new Array<boolean>(8);
		
		private _numVertices:number /*uint*/;
		
		private _totalLenOfOneVertex:number /*uint*/;
		
		public numProcessedVertices:number /*int*/ = 0;
		
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
			for (var i:number /*int*/ = 0; i < 8; i++)
				this._pBufferDirty[i] = true;

			this._iUniqueId = AnimationSubGeometry.SUBGEOM_ID_COUNT++;
		}
		
		public createVertexData(numVertices:number /*uint*/, totalLenOfOneVertex:number /*uint*/)
		{
			this._numVertices = numVertices;
			this._totalLenOfOneVertex = totalLenOfOneVertex;
			this._pVertexData = new Array<number>(numVertices*totalLenOfOneVertex);
		}

		public activateVertexBuffer(index:number /*int*/, bufferOffset:number /*int*/, stage:Stage, format:string)
		{
			var contextIndex:number /*int*/ = stage.stageIndex;
			var context:IContextStageGL = <IContextStageGL> stage.context;
			
			var buffer:IVertexBuffer = this._pVertexBuffer[contextIndex];
			if (!buffer || this._pBufferContext[contextIndex] != context) {
				buffer = this._pVertexBuffer[contextIndex] = context.createVertexBuffer(this._numVertices, this._totalLenOfOneVertex);
				this._pBufferContext[contextIndex] = context;
				this._pBufferDirty[contextIndex] = true;
			}
			if (this._pBufferDirty[contextIndex]) {
				buffer.uploadFromArray(this._pVertexData, 0, this._numVertices);
				this._pBufferDirty[contextIndex] = false;
			}
			context.setVertexBufferAt(index, buffer, bufferOffset, format);
		}
		
		public dispose()
		{
			while (this._pVertexBuffer.length) {
				var vertexBuffer:IVertexBuffer = this._pVertexBuffer.pop()
				
				if (vertexBuffer)
					vertexBuffer.dispose();
			}
		}
		
		public invalidateBuffer()
		{
			for (var i:number /*int*/ = 0; i < 8; i++)
				this._pBufferDirty[i] = true;
		}
		
		public get vertexData():Array<number>
		{
			return this._pVertexData;
		}
		
		public get numVertices():number /*uint*/
		{
			return this._numVertices;
		}
		
		public get totalLenOfOneVertex():number /*uint*/
		{
			return this._totalLenOfOneVertex;
		}
	}
}
