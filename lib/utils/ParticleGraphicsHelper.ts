import AttributesBuffer					from "awayjs-core/lib/attributes/AttributesBuffer";
import Matrix							from "awayjs-core/lib/geom/Matrix";
import Matrix3D							from "awayjs-core/lib/geom/Matrix3D";
import Point							from "awayjs-core/lib/geom/Point";
import Vector3D							from "awayjs-core/lib/geom/Vector3D";

import ParticleData						from "awayjs-display/lib/animators/data/ParticleData";
import Graphics							from "awayjs-display/lib/graphics/Graphics";
import TriangleElements					from "awayjs-display/lib/graphics/TriangleElements";
import Sprite							from "awayjs-display/lib/display/Sprite";

import ParticleGraphicsTransform		from "../tools/data/ParticleGraphicsTransform";

/**
 * ...
 */
class ParticleGraphicsHelper
{
	public static MAX_VERTEX:number /*int*/ = 65535;

	public static generateGraphics(output:Graphics, graphicsArray:Array<Graphics>, transforms:Array<ParticleGraphicsTransform> = null)
	{
		var indicesVector:Array<Array<number>> /*uint*/ = new Array<Array<number>>() /*uint*/;
		var positionsVector:Array<Array<number>> = new Array<Array<number>>();
		var normalsVector:Array<Array<number>> = new Array<Array<number>>();
		var tangentsVector:Array<Array<number>> = new Array<Array<number>>();
		var uvsVector:Array<Array<number>> = new Array<Array<number>>();
		var vertexCounters:Array<number> /*uint*/ = new Array<number>() /*uint*/;
		var particles:Array<ParticleData> = new Array<ParticleData>();
		var elementsArray:Array<TriangleElements> = new Array<TriangleElements>();
		var numParticles:number /*uint*/ = graphicsArray.length;

		var sourceGraphics:Graphics;
		var sourceElements:TriangleElements;
		var numGraphics:number /*uint*/;
		var indices:Array<number> /*uint*/;
		var positions:Array<number>;
		var normals:Array<number>;
		var tangents:Array<number>;
		var uvs:Array<number>;
		var vertexCounter:number /*uint*/;
		var elements:TriangleElements;
		var i:number /*int*/;
		var j:number /*int*/;
		var sub2SubMap:Array<number> /*int*/ = new Array<number>() /*int*/;

		var tempVertex:Vector3D = new Vector3D;
		var tempNormal:Vector3D = new Vector3D;
		var tempTangents:Vector3D = new Vector3D;
		var tempUV:Point = new Point;

		for (i = 0; i < numParticles; i++) {
			sourceGraphics = graphicsArray[i];
			numGraphics = sourceGraphics.count;
			for (var srcIndex:number /*int*/ = 0; srcIndex < numGraphics; srcIndex++) {
				//create a different particle subgeometry group for each source subgeometry in a particle.
				if (sub2SubMap.length <= srcIndex) {
					sub2SubMap.push(elementsArray.length);
					indicesVector.push(new Array<number>() /*uint*/);
					positionsVector.push(new Array<number>());
					normalsVector.push(new Array<number>());
					tangentsVector.push(new Array<number>());
					uvsVector.push(new Array<number>());
					elementsArray.push(new TriangleElements(new AttributesBuffer()));
					vertexCounters.push(0);
				}

				sourceElements = <TriangleElements> sourceGraphics.getGraphicAt(srcIndex).elements;

				//add a new particle subgeometry if this source subgeometry will take us over the maxvertex limit
				if (sourceElements.numVertices + vertexCounters[sub2SubMap[srcIndex]] > ParticleGraphicsHelper.MAX_VERTEX) {
					//update submap and add new subgeom vectors
					sub2SubMap[srcIndex] = elementsArray.length;
					indicesVector.push(new Array<number>() /*uint*/);
					positionsVector.push(new Array<number>());
					normalsVector.push(new Array<number>());
					tangentsVector.push(new Array<number>());
					uvsVector.push(new Array<number>());
					elementsArray.push(new TriangleElements(new AttributesBuffer()));
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
				elements = elementsArray[j];

				var particleData:ParticleData = new ParticleData();
				particleData.numVertices = sourceElements.numVertices;
				particleData.startVertexIndex = vertexCounter;
				particleData.particleIndex = i;
				particleData.elements = elements;
				particles.push(particleData);

				vertexCounters[j] += sourceElements.numVertices;

				var k:number /*int*/;
				var tempLen:number /*int*/;
				var compact:TriangleElements = sourceElements;
				var product:number /*uint*/;
				var sourcePositions:ArrayBufferView;
				var sourceNormals:Float32Array;
				var sourceTangents:Float32Array;
				var sourceUVs:ArrayBufferView;

				if (compact) {
					tempLen = compact.numVertices;
					sourcePositions = compact.positions.get(tempLen);
					sourceNormals = compact.normals.get(tempLen);
					sourceTangents = compact.tangents.get(tempLen);
					sourceUVs = compact.uvs.get(tempLen);

					if (transforms) {
						var particleGraphicsTransform:ParticleGraphicsTransform = transforms[i];
						var vertexTransform:Matrix3D = particleGraphicsTransform.vertexTransform;
						var invVertexTransform:Matrix3D = particleGraphicsTransform.invVertexTransform;
						var UVTransform:Matrix = particleGraphicsTransform.UVTransform;

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
							positions.push(tempVertex.x, tempVertex.y, tempVertex.z);
							normals.push(tempNormal.x, tempNormal.y, tempNormal.z);
							tangents.push(tempTangents.x, tempTangents.y, tempTangents.z);
							uvs.push(tempUV.x, tempUV.y);
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

				tempLen = sourceElements.numElements;
				var sourceIndices:Uint16Array = sourceElements.indices.get(tempLen);
				for (k = 0; k < tempLen; k++) {
					product = k*3;
					indices.push(sourceIndices[product] + vertexCounter, sourceIndices[product + 1] + vertexCounter, sourceIndices[product + 2] + vertexCounter);
				}
			}
		}

		output.particles = particles;
		output.numParticles = numParticles;

		numParticles = elementsArray.length;
		for (i = 0; i < numParticles; i++) {
			elements = elementsArray[i];
			elements.autoDeriveNormals = false;
			elements.autoDeriveTangents = false;
			elements.setIndices(indicesVector[i]);
			elements.setPositions(positionsVector[i]);
			elements.setNormals(normalsVector[i]);
			elements.setTangents(tangentsVector[i]);
			elements.setUVs(uvsVector[i]);
			output.addGraphic(elements);
		}
	}
}

export default ParticleGraphicsHelper;