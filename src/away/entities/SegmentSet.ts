/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="Entity.ts" />
///<reference path="../base/IRenderable.ts" />
///<reference path="../primitives/data/Segment.ts" />
///<reference path="../bounds/BoundingVolumeBase.ts" />
///<reference path="../library/assets/AssetType.ts" />

module away.entities
{
	
	export class SegmentSet extends away.entities.Entity implements away.base.IRenderable
	{
		private LIMIT:number = 3*0xFFFF;
		//private _activeSubSet:SubSet;
		private _subSets:SubSet[];
		private _subSetCount:number;
		private _numIndices:number;
		//private _material:MaterialBase;
		//private _animator:IAnimator;
		private _hasData:boolean;
		
		public _pSegments:Object; //Dictionary
		private _indexSegments:number;
		
		constructor()
		{
			super();
			
			this._subSetCount = 0;
			this._subSets = [];
			this.addSubSet();
			
			this._pSegments = new Object();
			//this.material = new SegmentMaterial();
		}
		
		public addSegment( segment:away.primitives.Segment )
		{
			segment.iSegmentsBase = this;
			
			this._hasData = true;
			
			var subSetIndex:number = this._subSets.length - 1;
			var subSet:SubSet = this._subSets[subSetIndex];
			
			if( subSet.vertices.length + 44 > this.LIMIT )
			{
				subSet = this.addSubSet();
				subSetIndex++;
			}
			
			segment.iIndex = subSet.vertices.length;
			segment.iSubSetIndex = subSetIndex;
			
			this.iUpdateSegment( segment );
			
			var index:number = subSet.lineCount << 2;
			
			subSet.indices.push(index, index + 1, index + 2, index + 3, index + 2, index + 1);
			subSet.numVertices = subSet.vertices.length/11;
			subSet.numIndices = subSet.indices.length;
			subSet.lineCount++;
			
			var segRef:SegRef = new SegRef();
			segRef.index = index;
			segRef.subSetIndex = subSetIndex;
			segRef.segment = segment;
			
			this._pSegments[this._indexSegments] = segRef;
			
			this._indexSegments++;
		}
		
		public removeSegmentByIndex( index:number, dispose:boolean = false )
		{
			var segRef:SegRef;
			if (index >= this._indexSegments)
			{
				return;
			}
			if( this._pSegments[index] )
			{
				segRef = this._pSegments[index];
			}
			else
			{
				return;
			}
			
			var subSet:SubSet;
			if ( !this._subSets[segRef.subSetIndex] )
			{
				return;
			}
			
			var subSetIndex:number = segRef.subSetIndex;
			subSet = this._subSets[segRef.subSetIndex];
			
			var segment:away.primitives.Segment = segRef.segment;
			var indices:number[] = subSet.indices;
			
			var ind:number = index * 6;
			for (var i:number = ind; i < indices.length; ++i)
			{
				indices[i] -= 4;
			}
			subSet.indices.splice(index*6, 6);
			subSet.vertices.splice(index*44, 44);
			subSet.numVertices = subSet.vertices.length/11;
			subSet.numIndices = indices.length;
			subSet.vertexBufferDirty = true;
			subSet.indexBufferDirty = true;
			subSet.lineCount--;
			
			if( dispose )
			{
				segment.dispose();
				segment = null;
				
			}
			else
			{
				segment.iIndex = -1;
				segment.iSegmentsBase = null;
			}
			
			if( subSet.lineCount == 0 ) {
				
				if( subSetIndex == 0 )
				{
					this._hasData = false;
				}
				else
				{
					subSet.dispose();
					this._subSets[subSetIndex] = null;
					this._subSets.splice(subSetIndex, 1);
				}
			}
			
			this.reOrderIndices( subSetIndex, index );
			
			segRef = null;
			this._pSegments[this._indexSegments] = null;
			this._indexSegments--;
		}
		
		public removeSegment( segment:away.primitives.Segment, dispose:boolean = false )
		{
			if( segment.iIndex == -1 )
			{
				return;
			}
			this.removeSegmentByIndex(segment.iIndex/44);
		}
		
		public removeAllSegments()
		{
			var subSet:SubSet;
			for ( var i:number = 0; i < this._subSetCount; ++i )
			{
				subSet = this._subSets[i];
				subSet.vertices = null;
				subSet.indices = null;
				if (subSet.vertexBuffer)
				{
					subSet.vertexBuffer.dispose();
				}
				if (subSet.indexBuffer)
				{
					subSet.indexBuffer.dispose();
				}
				subSet = null;
			}
			
			for( var segRef in this._pSegments )
			{
				segRef = null;
			}
			this._pSegments = null; //WHY?
			this._subSetCount = 0;
			//this._activeSubSet = null;
			this._indexSegments = 0;
			this._subSets = [];
			this._pSegments = new Object();
			
			this.addSubSet();
			
			this._hasData = false;
		}
		
		public getSegment( index:number ):away.primitives.Segment
		{
			if (index > this._indexSegments - 1)
			{
				return null;
			}
			return this._pSegments[index].segment;
		}
		
		public get segmentCount():number
		{
			return this._indexSegments;
		}
		
		public get iSubSetCount():number
		{
			return this._subSetCount;
		}
		
		public iUpdateSegment( segment:away.primitives.Segment )
		{
			var start:away.geom.Vector3D = segment._pStart;
			var end:away.geom.Vector3D = segment._pEnd;
			var startX:number = start.x, startY:number = start.y, startZ:number = start.z;
			var endX:number = end.x, endY:number = end.y, endZ:number = end.z;
			var startR:number = segment._pStartR, startG:number = segment._pStartG, startB:number = segment._pStartB;
			var endR:number = segment._pEndR, endG:number = segment._pEndG, endB:number = segment._pEndB;
			var index:number = segment.iIndex;
			var t:number = segment.thickness;
			
			var subSet:SubSet = this._subSets[segment.iSubSetIndex];
			var vertices:number[] = subSet.vertices;
			
			vertices[index++] = startX;
			vertices[index++] = startY;
			vertices[index++] = startZ;
			vertices[index++] = endX;
			vertices[index++] = endY;
			vertices[index++] = endZ;
			vertices[index++] = t;
			vertices[index++] = startR;
			vertices[index++] = startG;
			vertices[index++] = startB;
			vertices[index++] = 1;
			
			vertices[index++] = endX;
			vertices[index++] = endY;
			vertices[index++] = endZ;
			vertices[index++] = startX;
			vertices[index++] = startY;
			vertices[index++] = startZ;
			vertices[index++] = -t;
			vertices[index++] = endR;
			vertices[index++] = endG;
			vertices[index++] = endB;
			vertices[index++] = 1;
			
			vertices[index++] = startX;
			vertices[index++] = startY;
			vertices[index++] = startZ;
			vertices[index++] = endX;
			vertices[index++] = endY;
			vertices[index++] = endZ;
			vertices[index++] = -t;
			vertices[index++] = startR;
			vertices[index++] = startG;
			vertices[index++] = startB;
			vertices[index++] = 1;
			
			vertices[index++] = endX;
			vertices[index++] = endY;
			vertices[index++] = endZ;
			vertices[index++] = startX;
			vertices[index++] = startY;
			vertices[index++] = startZ;
			vertices[index++] = t;
			vertices[index++] = endR;
			vertices[index++] = endG;
			vertices[index++] = endB;
			vertices[index++] = 1;
			
			subSet.vertexBufferDirty = true;
			
			this._pBoundsInvalid = true;
		}
		
		public get hasData():boolean
		{
			return this._hasData;
		}
		
		/*
		public getIndexBuffer( stage3DProxy:away.managers.Stage3DProxy ):away.display3D.IndexBuffer3D
		{
			if( this._activeSubSet.indexContext3D != stage3DProxy.context3D || this._activeSubSet.indexBufferDirty )
			{
				this._activeSubSet.indexBuffer = stage3DProxy._context3D.createIndexBuffer( this._activeSubSet.numIndices );
				this._activeSubSet.indexBuffer.uploadFromVector( this._activeSubSet.indices, 0, this._activeSubSet.numIndices );
				this._activeSubSet.indexBufferDirty = false;
				this._activeSubSet.indexContext3D = stage3DProxy.context3D;
			}
			
			return this._activeSubSet.indexBuffer;
		}
		*/
		/*
		public activateVertexBuffer( index:number, stage3DProxy:away.managers.Stage3DProxy )
		{
			var subSet:SubSet = this._subSets[index];
			
			this._activeSubSet = subSet;
			this._numIndices = subSet.numIndices;
			
			var vertexBuffer:away.display3D.VertexBuffer3D = subSet.vertexBuffer;
			
			if (subSet.vertexContext3D != stage3DProxy.context3D || subSet.vertexBufferDirty) {
				subSet.vertexBuffer = stage3DProxy._context3D.createVertexBuffer(subSet.numVertices, 11);
				subSet.vertexBuffer.uploadFromVector(subSet.vertices, 0, subSet.numVertices);
				subSet.vertexBufferDirty = false;
				subSet.vertexContext3D = stage3DProxy.context3D;
			}
			
			var context3d:Context3D = stage3DProxy._context3D;
			context3d.setVertexBufferAt(0, vertexBuffer, 0, Context3DVertexBufferFormat.FLOAT_3);
			context3d.setVertexBufferAt(1, vertexBuffer, 3, Context3DVertexBufferFormat.FLOAT_3);
			context3d.setVertexBufferAt(2, vertexBuffer, 6, Context3DVertexBufferFormat.FLOAT_1);
			context3d.setVertexBufferAt(3, vertexBuffer, 7, Context3DVertexBufferFormat.FLOAT_4);
		}
		
		public activateUVBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy)
		{
		}
		
		public activateVertexNormalBuffer( index:number, stage3DProxy:away.managers.Stage3DProxy)
		{
		}
		
		public activateVertexTangentBuffer( index:number, stage3DProxy:away.managers.Stage3DProxy )
		{
		}
		
		public activateSecondaryUVBuffer( index:number, stage3DProxy:away.managers.Stage3DProxy)
		{
		}
		*/
		
		private reOrderIndices( subSetIndex:number, index:number )
		{
			var segRef:SegRef;
			
			for( var i:number = index; i < this._indexSegments - 1; ++i )
			{
				segRef = this._pSegments[i + 1];
				segRef.index = i;
				if( segRef.subSetIndex == subSetIndex )
				{
					segRef.segment.iIndex -= 44;
				}
				this._pSegments[i] = segRef;
			}
		}
		
		private addSubSet():SubSet
		{
			var subSet:SubSet = new SubSet();
			this._subSets.push(subSet);
			
			subSet.vertices = [];
			subSet.numVertices = 0;
			subSet.indices = [];
			subSet.numIndices = 0;
			subSet.vertexBufferDirty = true;
			subSet.indexBufferDirty = true;
			subSet.lineCount = 0;
			
			this._subSetCount++;
			
			return subSet;
		}
		
		//@override
		public dispose()
		{
			super.dispose();
			this.removeAllSegments();
			this._pSegments = null
			//this._material = null;
			var subSet:SubSet = this._subSets[0];
			subSet.vertices = null;
			subSet.indices = null;
			this._subSets = null;
		}
		
		//@override
		public get mouseEnabled():boolean
		{
			return false;
		}
		
		//@override
		public pGetDefaultBoundingVolume():away.bounds.BoundingVolumeBase
		{
			//return new away.bounds.BoundingSphere();
			return null;
		}
		
		//@override
		public updateBounds()
		{
			var subSet:SubSet;
			var len:number;
			var v:number;
			var index:number;
			
			var minX:number = Infinity;
			var minY:number = Infinity;
			var minZ:number = Infinity;
			var maxX:number = -Infinity;
			var maxY:number = -Infinity;
			var maxZ:number = -Infinity;
			var vertices:number[];
			
			for( var i:number = 0; i < this._subSetCount; ++i )
			{
				subSet = this._subSets[i];
				index = 0;
				vertices = subSet.vertices;
				len = vertices.length;
				
				if (len == 0)
				{
					continue;
				}
				
				while(index < len)
				{
					v = vertices[index++];
					if (v < minX)
						minX = v;
					else if (v > maxX)
						maxX = v;
					
					v = vertices[index++];
					if (v < minY)
						minY = v;
					else if (v > maxY)
						maxY = v;
					
					v = vertices[index++];
					if (v < minZ)
						minZ = v;
					else if (v > maxZ)
						maxZ = v;
					
					index += 8;
				}
			}
			/*
			if (minX != Infinity)
				this._bounds.fromExtremes(minX, minY, minZ, maxX, maxY, maxZ);
			
			else {
				var min:Number = .5;
				this._bounds.fromExtremes(-min, -min, -min, min, min, min);
			}
			*/
			this._pBoundsInvalid = false;
		}
		
		
		//@override
		/*
		public iCreateEntityPartitionNode():EntityNode
		{
			return new RenderableNode(this);
		}*/
		
		public get numTriangles():number
		{
			return this._numIndices/3;
		}
		
		public get sourceEntity():away.entities.Entity
		{
			return this;
		}
		
		public get castsShadows():boolean
		{
			return false;
		}
		/*
		public get material():MaterialBase
		{
			return this._material;
		}
		
		public get animator():IAnimator
		{
			return this._animator;
		}
		
		public set material( value:MaterialBase )
		{
			if( value == this._material)
			{
				return;
			}
			if( this._material )
			{
				this._material.removeOwner(this);
			}
			this._material = value;
			if( this._material )
			{
				this._material.addOwner(this);
			}
		}
		*/
		public get uvTransform():away.geom.Matrix
		{
			return null;
		}
		
		public get vertexData():number[]
		{
			return null;
		}
		
		public get indexData():number[]
		{
			return null;
		}
		
		public get UVData():number[]
		{
			return null;
		}
		
		public get numVertices():number
		{
			return null;
		}
		
		public get vertexStride():number
		{
			return 11;
		}
		
		public get vertexNormalData():number[]
		{
			return null;
		}
		
		public  get vertexTangentData():number[]
		{
			return null;
		}
		
		public get vertexOffset():number
		{
			return 0;
		}
		
		public get vertexNormalOffset():number
		{
			return 0;
		}
		
		public get vertexTangentOffset():number
		{
			return 0;
		}
		
		//@override
		public get assetType():string
		{
			return away.library.AssetType.SEGMENT_SET;
		}
		
		public getRenderSceneTransform( camera:away.cameras.Camera3D ):away.geom.Matrix3D
		{
			return this._pSceneTransform;
		}
	}
	
	class SegRef
	{
		public index:number;
		public subSetIndex:number;
		public segment:away.primitives.Segment;
	}
	
	class SubSet
	{
		public vertices:number[];
		public numVertices:number;
		
		public indices:number[];
		public numIndices:number;
		
		public vertexBufferDirty:boolean;
		public indexBufferDirty:boolean;
		
		public vertexContext3D:away.display3D.Context3D;
		public indexContext3D:away.display3D.Context3D;
		
		public vertexBuffer:away.display3D.VertexBuffer3D;
		public indexBuffer:away.display3D.IndexBuffer3D;
		public lineCount:number;
		
		public dispose()
		{
			this.vertices = null;
			if( this.vertexBuffer )
			{
				this.vertexBuffer.dispose();
			}
			if( this.indexBuffer )
			{
				this.indexBuffer.dispose();
			}
		}
	}
}