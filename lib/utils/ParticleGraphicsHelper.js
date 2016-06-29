"use strict";
var AttributesBuffer_1 = require("@awayjs/core/lib/attributes/AttributesBuffer");
var Point_1 = require("@awayjs/core/lib/geom/Point");
var Vector3D_1 = require("@awayjs/core/lib/geom/Vector3D");
var ParticleData_1 = require("@awayjs/display/lib/animators/data/ParticleData");
var TriangleElements_1 = require("@awayjs/display/lib/graphics/TriangleElements");
/**
 * ...
 */
var ParticleGraphicsHelper = (function () {
    function ParticleGraphicsHelper() {
    }
    ParticleGraphicsHelper.generateGraphics = function (output, graphicsArray, transforms) {
        if (transforms === void 0) { transforms = null; }
        var indicesVector = new Array();
        var positionsVector = new Array();
        var normalsVector = new Array();
        var tangentsVector = new Array();
        var uvsVector = new Array();
        var vertexCounters = new Array();
        var particles = new Array();
        var elementsArray = new Array();
        var numParticles = graphicsArray.length;
        var sourceGraphics;
        var sourceElements;
        var numGraphics;
        var indices;
        var positions;
        var normals;
        var tangents;
        var uvs;
        var vertexCounter;
        var elements;
        var i;
        var j;
        var sub2SubMap = new Array();
        var tempVertex = new Vector3D_1.Vector3D;
        var tempNormal = new Vector3D_1.Vector3D;
        var tempTangents = new Vector3D_1.Vector3D;
        var tempUV = new Point_1.Point;
        for (i = 0; i < numParticles; i++) {
            sourceGraphics = graphicsArray[i];
            numGraphics = sourceGraphics.count;
            for (var srcIndex = 0; srcIndex < numGraphics; srcIndex++) {
                //create a different particle subgeometry group for each source subgeometry in a particle.
                if (sub2SubMap.length <= srcIndex) {
                    sub2SubMap.push(elementsArray.length);
                    indicesVector.push(new Array());
                    positionsVector.push(new Array());
                    normalsVector.push(new Array());
                    tangentsVector.push(new Array());
                    uvsVector.push(new Array());
                    elementsArray.push(new TriangleElements_1.TriangleElements(new AttributesBuffer_1.AttributesBuffer()));
                    vertexCounters.push(0);
                }
                sourceElements = sourceGraphics.getGraphicAt(srcIndex).elements;
                //add a new particle subgeometry if this source subgeometry will take us over the maxvertex limit
                if (sourceElements.numVertices + vertexCounters[sub2SubMap[srcIndex]] > ParticleGraphicsHelper.MAX_VERTEX) {
                    //update submap and add new subgeom vectors
                    sub2SubMap[srcIndex] = elementsArray.length;
                    indicesVector.push(new Array());
                    positionsVector.push(new Array());
                    normalsVector.push(new Array());
                    tangentsVector.push(new Array());
                    uvsVector.push(new Array());
                    elementsArray.push(new TriangleElements_1.TriangleElements(new AttributesBuffer_1.AttributesBuffer()));
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
                var particleData = new ParticleData_1.ParticleData();
                particleData.numVertices = sourceElements.numVertices;
                particleData.startVertexIndex = vertexCounter;
                particleData.particleIndex = i;
                particleData.elements = elements;
                particles.push(particleData);
                vertexCounters[j] += sourceElements.numVertices;
                var k;
                var index;
                var posIndex;
                var normalIndex;
                var tangentIndex;
                var uvIndex;
                var tempLen;
                var compact = sourceElements;
                var sourcePositions;
                var posStride;
                var sourceNormals;
                var normalStride;
                var sourceTangents;
                var tangentStride;
                var sourceUVs;
                var uvStride;
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
                        var particleGraphicsTransform = transforms[i];
                        var vertexTransform = particleGraphicsTransform.vertexTransform;
                        var invVertexTransform = particleGraphicsTransform.invVertexTransform;
                        var UVTransform = particleGraphicsTransform.UVTransform;
                        for (k = 0; k < tempLen; k++) {
                            /*
                             * 0 - 2: vertex position X, Y, Z
                             * 3 - 5: normal X, Y, Z
                             * 6 - 8: tangent X, Y, Z
                             * 9 - 10: U V
                             * 11 - 12: Secondary U V*/
                            posIndex = k * posStride;
                            tempVertex.x = sourcePositions[posIndex];
                            tempVertex.y = sourcePositions[posIndex + 1];
                            tempVertex.z = sourcePositions[posIndex + 2];
                            normalIndex = k * normalStride;
                            tempNormal.x = sourceNormals[normalIndex];
                            tempNormal.y = sourceNormals[normalIndex + 1];
                            tempNormal.z = sourceNormals[normalIndex + 2];
                            tangentIndex = k * tangentStride;
                            tempTangents.x = sourceTangents[tangentIndex];
                            tempTangents.y = sourceTangents[tangentIndex + 1];
                            tempTangents.z = sourceTangents[tangentIndex + 2];
                            uvIndex = k * uvStride;
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
                    }
                    else {
                        for (k = 0; k < tempLen; k++) {
                            posIndex = k * posStride;
                            normalIndex = k * normalStride;
                            tangentIndex = k * tangentStride;
                            uvIndex = k * uvStride;
                            //this is faster than that only push one data
                            positions.push(sourcePositions[posIndex], sourcePositions[posIndex + 1], sourcePositions[posIndex + 2]);
                            normals.push(sourceNormals[normalIndex], sourceNormals[normalIndex + 1], sourceNormals[normalIndex + 2]);
                            tangents.push(sourceTangents[tangentIndex], sourceTangents[tangentIndex + 1], sourceTangents[tangentIndex + 2]);
                            uvs.push(sourceUVs[uvIndex], sourceUVs[uvIndex + 1]);
                        }
                    }
                }
                else {
                }
                tempLen = sourceElements.numElements;
                var sourceIndices = sourceElements.indices.get(tempLen);
                for (k = 0; k < tempLen; k++) {
                    index = k * 3;
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
    };
    ParticleGraphicsHelper.MAX_VERTEX = 65535;
    return ParticleGraphicsHelper;
}());
exports.ParticleGraphicsHelper = ParticleGraphicsHelper;
