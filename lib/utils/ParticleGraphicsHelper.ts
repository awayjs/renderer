import {AttributesBuffer}					from "@awayjs/core/lib/attributes/AttributesBuffer";
import {Matrix}							from "@awayjs/core/lib/geom/Matrix";
import {Matrix3D}							from "@awayjs/core/lib/geom/Matrix3D";
import {Point}							from "@awayjs/core/lib/geom/Point";
import {Vector3D}							from "@awayjs/core/lib/geom/Vector3D";

import {ParticleData}						from "@awayjs/display/lib/animators/data/ParticleData";
import {Graphics}							from "@awayjs/display/lib/graphics/Graphics";
import {TriangleElements}					from "@awayjs/display/lib/graphics/TriangleElements";
import {Sprite}							from "@awayjs/display/lib/display/Sprite";

import {ParticleGraphicsTransform}		from "../tools/data/ParticleGraphicsTransform";

/**
 * ...
 */
export class ParticleGraphicsHelper
{
	public static MAX_VERTEX:number = 65535;

	public static generateGraphics(output:Graphics, graphicsArray:Array<Graphics>, transforms:Array<ParticleGraphicsTransform> = null):void
	{
		var indicesVector:Array<Array<number>> = new Array<Array<number>>();
		var positionsVector:Array<Array<number>> = new Array<Array<number>>();
		var normalsVector:Array<Array<number>> = new Array<Array<number>>();
		var tangentsVector:Array<Array<number>> = new Array<Array<number>>();
		var uvsVector:Array<Array<number>> = new Array<Array<number>>();
		var vertexCounters:Array<number> = new Array<number>();
		var particles:Array<ParticleData> = new Array<ParticleData>();
		var elementsArray:Array<TriangleElements> = new Array<TriangleElements>();
		var numParticles:number = graphicsArray.length;

		var sourceGraphics:Graphics;
		var sourceElements:TriangleElements;
		var numGraphics:number;
		var indices:Array<number>;
		var positions:Array<number>;
		var normals:Array<number>;
		var tangents:Array<number>;
		var uvs:Array<number>;
		var vertexCounter:number;
		var elements:TriangleElements;
		var i:number;
		var j:number;
		var sub2SubMap:Array<number> = new Array<number>();

		var tempVertex:Vector3D = new Vector3D;
		var tempNormal:Vector3D = new Vector3D;
		var tempTangents:Vector3D = new Vector3D;
		var tempUV:Point = new Point;

		for (i = 0; i < numParticles; i++) {
			sourceGraphics = graphicsArray[i];
			numGraphics = sourceGraphics.count;
			for (var srcIndex:number = 0; srcIndex < numGraphics; srcIndex++) {
				//create a different particle subgeometry group for each source subgeometry in a particle.
				if (sub2SubMap.length <= srcIndex) {
					sub2SubMap.push(elementsArray.length);
					indicesVector.push(new Array<number>());
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
					indicesVector.push(new Array<number>());
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

				var k:number;
				var index:number;
				var posIndex:number;
				var normalIndex:number;
				var tangentIndex:number;
				var uvIndex:number;

				var tempLen:number;
				var compact:TriangleElements = sourceElements;
				var sourcePositions:ArrayBufferView;
				var posStride:number;
				var sourceNormals:Float32Array;
				var normalStride:number;
				var sourceTangents:Float32Array;
				var tangentStride:number;
				var sourceUVs:ArrayBufferView;
				var uvStride:number;

				if (compact) {
					tempLen = compact.numVertices;
					sourcePositions = compact.positions.get(tempLen);
					posStride = compact.positions.stride;
					sourceNormals = compact.normals.get(tempLen);
					normalStride = compact.normals.stride;
					sourceTangents = compact.tangents.get(tempLen);
					tangentStride = compact.tangents.stride;
					sourceUVs = compact.uvs.get(tempLen);
					uvStride = compact.uvs.stride;

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
							posIndex = k*posStride;
							tempVertex.x = sourcePositions[posIndex];
							tempVertex.y = sourcePositions[posIndex + 1];
							tempVertex.z = sourcePositions[posIndex + 2];
							normalIndex = k*normalStride;
							tempNormal.x = sourceNormals[normalIndex];
							tempNormal.y = sourceNormals[normalIndex + 1];
							tempNormal.z = sourceNormals[normalIndex + 2];
							tangentIndex = k*tangentStride;
							tempTangents.x = sourceTangents[tangentIndex];
							tempTangents.y = sourceTangents[tangentIndex + 1];
							tempTangents.z = sourceTangents[tangentIndex + 2];
							uvIndex = k*uvStride;
							tempUV.x = sourceUVs[uvIndex];
							tempUV.y = sourceUVs[uvIndex + 1];
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
							posIndex = k*posStride;
							normalIndex = k*normalStride;
							tangentIndex = k*tangentStride;
							uvIndex = k*uvStride;
							//this is faster than that only push one data
							positions.push(sourcePositions[posIndex], sourcePositions[posIndex + 1], sourcePositions[posIndex + 2]);
							normals.push(sourceNormals[normalIndex], sourceNormals[normalIndex + 1], sourceNormals[normalIndex + 2]);
							tangents.push(sourceTangents[tangentIndex], sourceTangents[tangentIndex + 1], sourceTangents[tangentIndex + 2]);
							uvs.push(sourceUVs[uvIndex], sourceUVs[uvIndex + 1]);
						}
					}
				} else {
					//Todo
				}

				tempLen = sourceElements.numElements;
				var sourceIndices:Uint16Array = sourceElements.indices.get(tempLen);
				for (k = 0; k < tempLen; k++) {
					index = k*3;
					indices.push(sourceIndices[index] + vertexCounter, sourceIndices[index + 1] + vertexCounter, sourceIndices[index + 2] + vertexCounter);
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