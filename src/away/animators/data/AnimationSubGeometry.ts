///<reference path="../../_definitions.ts"/>

module away.animators
{
	import Stage3DProxy = away.managers.Stage3DProxy;
	import Context3D = away.display3D.Context3D;
	import VertexBuffer3D = away.display3D.VertexBuffer3D;
	
	/**
	 * ...
	 */
	export class AnimationSubGeometry
	{
		public static SUBGEOM_ID_COUNT:number = 0;

		public _pVertexData:Array<number>;
		
		public _pVertexBuffer:Array<VertexBuffer3D> = new Array<VertexBuffer3D>(8);
		public _pBufferContext:Array<Context3D> = new Array<Context3D>(8);
		public _pBufferDirty:Array<Boolean> = new Array<Boolean>(8);
		
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
		
		public activateVertexBuffer(index:number /*int*/, bufferOffset:number /*int*/, stage3DProxy:Stage3DProxy, format:string)
		{
			var contextIndex:number /*int*/ = stage3DProxy.stage3DIndex;
			var context:Context3D = stage3DProxy.context3D;
			
			var buffer:VertexBuffer3D = this._pVertexBuffer[contextIndex];
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
				var vertexBuffer:VertexBuffer3D = this._pVertexBuffer.pop()
				
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
