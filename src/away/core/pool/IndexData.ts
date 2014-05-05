///<reference path="../../_definitions.ts"/>

/**
 * @module away.base
 */
module away.pool
{
	/**
	 *
	 */
	export class IndexData
	{
		private static LIMIT_VERTS:number = 0xffff;

		private static LIMIT_INDICES:number = 0xffffff;

		private _dataDirty = true;

		public invalid:Array<boolean> = new Array(8);

		public stageGLs:Array<away.base.StageGL> = new Array<away.base.StageGL>(8);

		public buffers:Array<away.gl.IndexBuffer> = new Array<away.gl.IndexBuffer>(8);

		public data:Array<number>;

		public indexMappings:Array<number>;

		public originalIndices:Array<number>;

		public offset:number;

		public level:number;

		constructor(level:number)
		{
			this.level = level;
		}

		public updateData(offset:number, indices:Array<number>, numVertices:number)
		{
			if (this._dataDirty) {
				this._dataDirty = false;

				if (indices.length < IndexData.LIMIT_INDICES && numVertices < IndexData.LIMIT_VERTS) {
					//shortcut for those buffers that fit into the maximum buffer sizes
					this.indexMappings = null;
					this.originalIndices = null;
					this.setData(indices);
					this.offset = indices.length;
				} else {
					var i:number;
					var len:number;
					var outIndex:number;
					var j:number;
					var k:number;
					var splitIndices:Array<number> = new Array<number>();

					this.indexMappings = new Array<number>(indices.length);
					this.originalIndices = new Array<number>();

					i = this.indexMappings.length;

					while (i--)
						this.indexMappings[i] = -1;

					var originalIndex:number;
					var splitIndex:number;

					// Loop over all triangles
					outIndex = 0;
					len = indices.length;
					i = offset;
					k = 0;
					while (i < len && outIndex + 3 < IndexData.LIMIT_INDICES && k + 3 < IndexData.LIMIT_VERTS) {
						// Loop over all vertices in a triangle //TODO ensure this works for segments or any grouping
						for (j = 0; j < 3; j++) {

							originalIndex = indices[i + j];

							if (this.indexMappings[originalIndex] >= 0) {
								splitIndex = this.indexMappings[originalIndex];
							} else {

								// This vertex does not yet exist in the split list and
								// needs to be copied from the long list.
								splitIndex = k++;
								this.indexMappings[originalIndex] = splitIndex;
								this.originalIndices.push(originalIndex);
							}

							// Store new index, which may have come from the mapping look-up,
							// or from copying a new set of vertex data from the original vector
							splitIndices[outIndex + j] = splitIndex;
						}

						outIndex += 3;
						i += 3
					}

					this.setData(splitIndices);
					this.offset = i;
				}
			}
		}

		public invalidateData()
		{
			this._dataDirty = true;
		}

		public dispose()
		{
			for (var i:number = 0; i < 8; ++i) {
				if (this.stageGLs[i]) {
					this.stageGLs[i].disposeIndexData(this);
					this.stageGLs[i] = null
				}
			}
		}

		/**
		 * @private
		 */
		private disposeBuffers()
		{
			for (var i:number = 0; i < 8; ++i) {
				if (this.buffers[i]) {
					this.buffers[i].dispose();
					this.buffers[i] = null;
				}
			}
		}

		/**
		 * @private
		 */
		private invalidateBuffers()
		{
			for (var i:number = 0; i < 8; ++i)
				this.invalid[i] = true;
		}

		/**
		 *
		 * @param data
		 * @private
		 */
		private setData(data:Array<number>)
		{
			if (this.data && this.data.length != data.length)
				this.disposeBuffers();
			else
				this.invalidateBuffers();

			this.data = data;
		}
	}
}