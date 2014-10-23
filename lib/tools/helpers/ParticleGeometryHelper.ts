import Matrix							= require("awayjs-core/lib/geom/Matrix");
import Matrix3D							= require("awayjs-core/lib/geom/Matrix3D");
import Point							= require("awayjs-core/lib/geom/Point");
import Vector3D							= require("awayjs-core/lib/geom/Vector3D");

import Geometry							= require("awayjs-display/lib/base/Geometry");
import TriangleSubGeometry				= require("awayjs-display/lib/base/TriangleSubGeometry");
import Mesh								= require("awayjs-display/lib/entities/Mesh");
import MaterialBase						= require("awayjs-display/lib/materials/MaterialBase");

import ParticleData						= require("awayjs-renderergl/lib/animators/data/ParticleData");
import ParticleGeometry					= require("awayjs-renderergl/lib/base/ParticleGeometry");
import ParticleGeometryTransform		= require("awayjs-renderergl/lib/tools/data/ParticleGeometryTransform");

/**
 * ...
 */
class ParticleGeometryHelper
{
	public static MAX_VERTEX:number /*int*/ = 65535;

	public static generateGeometry(geometries:Array<Geometry>, transforms:Array<ParticleGeometryTransform> = null):ParticleGeometry
	{
		var indicesVector:Array<Array<number>> /*uint*/ = new Array<Array<number>>() /*uint*/;
		var positionsVector:Array<Array<number>> = new Array<Array<number>>();
		var normalsVector:Array<Array<number>> = new Array<Array<number>>();
		var tangentsVector:Array<Array<number>> = new Array<Array<number>>();
		var uvsVector:Array<Array<number>> = new Array<Array<number>>();
		var vertexCounters:Array<number> /*uint*/ = new Array<number>() /*uint*/;
		var particles:Array<ParticleData> = new Array<ParticleData>();
		var subGeometries:Array<TriangleSubGeometry> = new Array<TriangleSubGeometry>();
		var numParticles:number /*uint*/ = geometries.length;

		var sourceSubGeometries:Array<TriangleSubGeometry>;
		var sourceSubGeometry:TriangleSubGeometry;
		var numSubGeometries:number /*uint*/;
		var indices:Array<number> /*uint*/;
		var positions:Array<number>;
		var normals:Array<number>;
		var tangents:Array<number>;
		var uvs:Array<number>;
		var vertexCounter:number /*uint*/;
		var subGeometry:TriangleSubGeometry;
		var i:number /*int*/;
		var j:number /*int*/;
		var sub2SubMap:Array<number> /*int*/ = new Array<number>() /*int*/;

		var tempVertex:Vector3D = new Vector3D;
		var tempNormal:Vector3D = new Vector3D;
		var tempTangents:Vector3D = new Vector3D;
		var tempUV:Point = new Point;

		for (i = 0; i < numParticles; i++) {
			sourceSubGeometries = <Array<TriangleSubGeometry>> geometries[i].subGeometries;
			numSubGeometries = sourceSubGeometries.length;
			for (var srcIndex:number /*int*/ = 0; srcIndex < numSubGeometries; srcIndex++) {
				//create a different particle subgeometry group for each source subgeometry in a particle.
				if (sub2SubMap.length <= srcIndex) {
					sub2SubMap.push(subGeometries.length);
					indicesVector.push(new Array<number>() /*uint*/);
					positionsVector.push(new Array<number>());
					normalsVector.push(new Array<number>());
					tangentsVector.push(new Array<number>());
					uvsVector.push(new Array<number>());
					subGeometries.push(new TriangleSubGeometry(true));
					vertexCounters.push(0);
				}

				sourceSubGeometry = sourceSubGeometries[srcIndex];

				//add a new particle subgeometry if this source subgeometry will take us over the maxvertex limit
				if (sourceSubGeometry.numVertices + vertexCounters[sub2SubMap[srcIndex]] > ParticleGeometryHelper.MAX_VERTEX) {
					//update submap and add new subgeom vectors
					sub2SubMap[srcIndex] = subGeometries.length;
					indicesVector.push(new Array<number>() /*uint*/);
					positionsVector.push(new Array<number>());
					normalsVector.push(new Array<number>());
					tangentsVector.push(new Array<number>());
					uvsVector.push(new Array<number>());
					subGeometries.push(new TriangleSubGeometry(true));
					vertexCounters.push(0);
				}

				j = sub2SubMap[srcIndex];

				//select the correct vector
				indices = indicesVector[j];
				positions = positionsVector[j];
				normals = normalsVector[j];
				tangents = tangentsVector[j];
				uvs = uvsVector[j];
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
				var compact:TriangleSubGeometry = sourceSubGeometry;
				var product:number /*uint*/;
				var sourcePositions:Array<number>;
				var sourceNormals:Array<number>;
				var sourceTangents:Array<number>;
				var sourceUVs:Array<number>;

				if (compact) {
					tempLen = compact.numVertices;
					compact.numTriangles;
					sourcePositions = compact.positions;
					sourceNormals = compact.vertexNormals;
					sourceTangents = compact.vertexTangents;
					sourceUVs = compact.uvs;

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
							product = k*3;
							tempVertex.x = sourcePositions[product];
							tempVertex.y = sourcePositions[product + 1];
							tempVertex.z = sourcePositions[product + 2];
							tempNormal.x = sourceNormals[product];
							tempNormal.y = sourceNormals[product + 1];
							tempNormal.z = sourceNormals[product + 2];
							tempTangents.x = sourceTangents[product];
							tempTangents.y = sourceTangents[product + 1];
							tempTangents.z = sourceTangents[product + 2];
							tempUV.x = sourceUVs[k*2];
							tempUV.y = sourceUVs[k*2 + 1];
							if (vertexTransform) {
								tempVertex = vertexTransform.transformVector(tempVertex);
								tempNormal = invVertexTransform.deltaTransformVector(tempNormal);
								tempTangents = invVertexTransform.deltaTransformVector(tempNormal);
							}
							if (UVTransform)
								tempUV = UVTransform.transformPoint(tempUV);
							//this is faster than that only push one data
							sourcePositions.push(tempVertex.x, tempVertex.y, tempVertex.z);
							sourceNormals.push(tempNormal.x, tempNormal.y, tempNormal.z);
							sourceTangents.push(tempTangents.x, tempTangents.y, tempTangents.z);
							sourceUVs.push(tempUV.x, tempUV.y);
						}
					} else {
						for (k = 0; k < tempLen; k++) {
							product = k*3;
							//this is faster than that only push one data
							positions.push(sourcePositions[product], sourcePositions[product + 1], sourcePositions[product + 2]);
							normals.push(sourceNormals[product], sourceNormals[product + 1], sourceNormals[product + 2]);
							tangents.push(sourceTangents[product], sourceTangents[product + 1], sourceTangents[product + 2]);
							uvs.push(sourceUVs[k*2], sourceUVs[k*2 + 1]);
						}
					}
				} else {
					//Todo
				}

				var sourceIndices:Array<number> /*uint*/ = sourceSubGeometry.indices;
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
			subGeometry.autoDeriveNormals = false;
			subGeometry.autoDeriveTangents = false;
			subGeometry.updateIndices(indicesVector[i]);
			subGeometry.updatePositions(positionsVector[i]);
			subGeometry.updateVertexNormals(normalsVector[i]);
			subGeometry.updateVertexTangents(tangentsVector[i]);
			subGeometry.updateUVs(uvsVector[i]);
			particleGeometry.addSubGeometry(subGeometry);
		}

		return particleGeometry;
	}
}

export = ParticleGeometryHelper;