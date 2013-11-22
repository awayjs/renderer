///<reference path="../../_definitions.ts"/>

module away.tools
{
	import ParticleData					= away.animators.ParticleData;
	import ParticleGeometry				= away.base.ParticleGeometry;
	import CompactSubGeometry			= away.base.CompactSubGeometry;
	import Geometry						= away.base.Geometry;
	import ISubGeometry					= away.base.ISubGeometry;
	import Matrix						= away.geom.Matrix;
	import Matrix3D						= away.geom.Matrix3D;
	import Point						= away.geom.Point;
	import Vector3D						= away.geom.Vector3D;
	
	/**
	 * ...
	 */
	export class ParticleGeometryHelper
	{
		public static MAX_VERTEX:number /*int*/ = 65535;
		
		public static generateGeometry(geometries:Array<Geometry>, transforms:Array<ParticleGeometryTransform> = null):ParticleGeometry
		{
			var verticesVector:Array<Array<number>> = new Array<Array<number>>();
			var indicesVector:Array<Array<number>> /*uint*/ = new Array<Array<number>>() /*uint*/;
			var vertexCounters:Array<number> /*uint*/ = new Array<number>() /*uint*/;
			var particles:Array<ParticleData> = new Array<ParticleData>();
			var subGeometries:Array<CompactSubGeometry> = new Array<CompactSubGeometry>();
			var numParticles:number /*uint*/ = geometries.length;
			
			var sourceSubGeometries:Array<ISubGeometry>;
			var sourceSubGeometry:ISubGeometry;
			var numSubGeometries:number /*uint*/;
			var vertices:Array<number>;
			var indices:Array<number> /*uint*/;
			var vertexCounter:number /*uint*/;
			var subGeometry:CompactSubGeometry;
			var i:number /*int*/;
			var j:number /*int*/;
			var sub2SubMap:Array<number> /*int*/ = new Array<number>() /*int*/;
			
			var tempVertex:Vector3D = new Vector3D;
			var tempNormal:Vector3D = new Vector3D;
			var tempTangents:Vector3D = new Vector3D;
			var tempUV:Point = new Point;
			
			for (i = 0; i < numParticles; i++) {
				sourceSubGeometries = geometries[i].subGeometries;
				numSubGeometries = sourceSubGeometries.length;
				for (var srcIndex:number /*int*/ = 0; srcIndex < numSubGeometries; srcIndex++) {
					//create a different particle subgeometry group for each source subgeometry in a particle.
					if (sub2SubMap.length <= srcIndex) {
						sub2SubMap.push(subGeometries.length);
						verticesVector.push(new Array<number>());
						indicesVector.push(new Array<number>() /*uint*/);
						subGeometries.push(new CompactSubGeometry());
						vertexCounters.push(0);
					}
					
					sourceSubGeometry = sourceSubGeometries[srcIndex];
					
					//add a new particle subgeometry if this source subgeometry will take us over the maxvertex limit
					if (sourceSubGeometry.numVertices + vertexCounters[sub2SubMap[srcIndex]] > ParticleGeometryHelper.MAX_VERTEX) {
						//update submap and add new subgeom vectors
						sub2SubMap[srcIndex] = subGeometries.length;
						verticesVector.push(new Array<number>());
						indicesVector.push(new Array<number>() /*uint*/);
						subGeometries.push(new CompactSubGeometry());
						vertexCounters.push(0);
					}
					
					j = sub2SubMap[srcIndex];
					
					//select the correct vector
					vertices = verticesVector[j];
					indices = indicesVector[j];
					vertexCounter = vertexCounters[j];
					subGeometry = subGeometries[j];
					
					var particleData:ParticleData = new ParticleData();
					particleData.numVertices = sourceSubGeometry.numVertices;
					particleData.startVertexIndex = vertexCounter;
					particleData.particleIndex = i;
					particleData.subGeometry = subGeometry;
					particles.push(particleData);
					
					vertexCounters[j] += sourceSubGeometry.numVertices;
					
					var k:number /*int*/;
					var tempLen:number /*int*/;
					var compact:CompactSubGeometry = <CompactSubGeometry> sourceSubGeometry;
					var product:number /*uint*/;
					var sourceVertices:Array<number>;
					
					if (compact) {
						tempLen = compact.numVertices;
						compact.numTriangles;
						sourceVertices = compact.vertexData;
						
						if (transforms) {
							var particleGeometryTransform:ParticleGeometryTransform = transforms[i];
							var vertexTransform:Matrix3D = particleGeometryTransform.vertexTransform;
							var invVertexTransform:Matrix3D = particleGeometryTransform.invVertexTransform;
							var UVTransform:Matrix = particleGeometryTransform.UVTransform;
							
							for (k = 0; k < tempLen; k++) {
								/*
								 * 0 - 2: vertex position X, Y, Z
								 * 3 - 5: normal X, Y, Z
								 * 6 - 8: tangent X, Y, Z
								 * 9 - 10: U V
								 * 11 - 12: Secondary U V*/
								product = k*13;
								tempVertex.x = sourceVertices[product];
								tempVertex.y = sourceVertices[product + 1];
								tempVertex.z = sourceVertices[product + 2];
								tempNormal.x = sourceVertices[product + 3];
								tempNormal.y = sourceVertices[product + 4];
								tempNormal.z = sourceVertices[product + 5];
								tempTangents.x = sourceVertices[product + 6];
								tempTangents.y = sourceVertices[product + 7];
								tempTangents.z = sourceVertices[product + 8];
								tempUV.x = sourceVertices[product + 9];
								tempUV.y = sourceVertices[product + 10];
								if (vertexTransform) {
									tempVertex = vertexTransform.transformVector(tempVertex);
									tempNormal = invVertexTransform.deltaTransformVector(tempNormal);
									tempTangents = invVertexTransform.deltaTransformVector(tempNormal);
								}
								if (UVTransform)
									tempUV = UVTransform.transformPoint(tempUV);
								//this is faster than that only push one data
								vertices.push(tempVertex.x, tempVertex.y, tempVertex.z, tempNormal.x,
									tempNormal.y, tempNormal.z, tempTangents.x, tempTangents.y,
									tempTangents.z, tempUV.x, tempUV.y, sourceVertices[product + 11],
									sourceVertices[product + 12]);
							}
						} else {
							for (k = 0; k < tempLen; k++) {
								product = k*13;
								//this is faster than that only push one data
								vertices.push(sourceVertices[product], sourceVertices[product + 1], sourceVertices[product + 2], sourceVertices[product + 3],
									sourceVertices[product + 4], sourceVertices[product + 5], sourceVertices[product + 6], sourceVertices[product + 7],
									sourceVertices[product + 8], sourceVertices[product + 9], sourceVertices[product + 10], sourceVertices[product + 11],
									sourceVertices[product + 12]);
							}
						}
					} else {
						//Todo
					}
					
					var sourceIndices:Array<number> /*uint*/ = sourceSubGeometry.indexData;
					tempLen = sourceSubGeometry.numTriangles;
					for (k = 0; k < tempLen; k++) {
						product = k*3;
						indices.push(sourceIndices[product] + vertexCounter, sourceIndices[product + 1] + vertexCounter, sourceIndices[product + 2] + vertexCounter);
					}
				}
			}
			
			var particleGeometry:ParticleGeometry = new ParticleGeometry();
			particleGeometry.particles = particles;
			particleGeometry.numParticles = numParticles;
			
			numParticles = subGeometries.length;
			for (i = 0; i < numParticles; i++) {
				subGeometry = subGeometries[i];
				subGeometry.updateData(verticesVector[i]);
				subGeometry.updateIndexData(indicesVector[i]);
				particleGeometry.addSubGeometry(subGeometry);
			}
			
			return particleGeometry;
		}
	}

}
