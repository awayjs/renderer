///<reference path="../_definitions.ts"/>

module away.utils
{

	export class GeometryUtils
	{
		/**
		 * Build a list of sub-geometries from raw data vectors, splitting them up in
		 * such a way that they won't exceed buffer length limits.
		 */
		public static fromVectors(verts:Array<number>, indices:Array<number> /*uint*/, uvs:Array<number>, normals:Array<number>, tangents:Array<number>, weights:Array<number>, jointIndices:Array<number>, triangleOffset:number = 0):away.base.ISubGeometry[]
		{
			var LIMIT_VERTS:number = 3*0xffff;
			var LIMIT_INDICES:number = 15*0xffff;

			var subs:away.base.ISubGeometry[] = new Array<away.base.ISubGeometry>();

			if (uvs && !uvs.length)
				uvs = null;

			if (normals && !normals.length)
				normals = null;

			if (tangents && !tangents.length)
				tangents = null;

			if (weights && !weights.length)
				weights = null;

			if (jointIndices && !jointIndices.length)
				jointIndices = null;

			if ((indices.length >= LIMIT_INDICES) || (verts.length >= LIMIT_VERTS)) {

				var i:number;
				var len:number;
				var outIndex:number;
				var j:number;
				var splitVerts:Array<number> = new Array<number>();
				var splitIndices:Array<number> /*uint*/ = new Array<number>();
				var splitUvs:Array<number> = (uvs != null)? new Array<number>() : null;
				var splitNormals:Array<number> = (normals != null)? new Array<number>() : null;
				var splitTangents:Array<number> = (tangents != null)? new Array<number>() : null;
				var splitWeights:Array<number> = (weights != null)? new Array<number>() : null;
				var splitJointIndices:Array<number> = (jointIndices != null)? new Array<number>() : null;

				var mappings:Array<number> = new Array<number>(verts.length/3);

				i = mappings.length;

				while (i-- > 0) {
					mappings[i] = -1;
				}

				var originalIndex:number;
				var splitIndex:number;
				var o0:number;
				var o1:number;
				var o2:number;
				var s0:number;
				var s1:number;
				var s2:number;
				var su:number;
				var ou:number;
				var sv:number;
				var ov:number;
				// Loop over all triangles
				outIndex = 0;
				len = indices.length;

				for (i = 0; i < len; i += 3) {

					splitIndex = splitVerts.length + 6;

					if (( (outIndex + 2) >= LIMIT_INDICES) || (splitIndex >= LIMIT_VERTS)) {
						subs.push(GeometryUtils.constructSubGeometry(splitVerts, splitIndices, splitUvs, splitNormals, splitTangents, splitWeights, splitJointIndices, triangleOffset));
						splitVerts = new Array<number>();
						splitIndices = new Array<number>();
						splitUvs = (uvs != null)? new Array<number>() : null;
						splitNormals = (normals != null)? new Array<number>() : null;
						splitTangents = (tangents != null)? new Array<number>() : null;
						splitWeights = (weights != null)? new Array<number>() : null;
						splitJointIndices = (jointIndices != null)? new Array<number>() : null;
						splitIndex = 0;
						j = mappings.length;

						while (j-- > 0) {
							mappings[j] = -1;
						}

						outIndex = 0;
					}

					// Loop over all vertices in triangle
					for (j = 0; j < 3; j++) {

						originalIndex = indices[i + j];

						if (mappings[originalIndex] >= 0) {
							splitIndex = mappings[originalIndex];

						} else {

							o0 = originalIndex*3 + 0;
							o1 = originalIndex*3 + 1;
							o2 = originalIndex*3 + 2;

							// This vertex does not yet exist in the split list and
							// needs to be copied from the long list.
							splitIndex = splitVerts.length/3;

							s0 = splitIndex*3 + 0;
							s1 = splitIndex*3 + 1;
							s2 = splitIndex*3 + 2;

							splitVerts[s0] = verts[o0];
							splitVerts[s1] = verts[o1];
							splitVerts[s2] = verts[o2];

							if (uvs) {
								su = splitIndex*2 + 0;
								sv = splitIndex*2 + 1;
								ou = originalIndex*2 + 0;
								ov = originalIndex*2 + 1;

								splitUvs[su] = uvs[ou];
								splitUvs[sv] = uvs[ov];
							}

							if (normals) {
								splitNormals[s0] = normals[o0];
								splitNormals[s1] = normals[o1];
								splitNormals[s2] = normals[o2];
							}

							if (tangents) {
								splitTangents[s0] = tangents[o0];
								splitTangents[s1] = tangents[o1];
								splitTangents[s2] = tangents[o2];
							}

							if (weights) {
								splitWeights[s0] = weights[o0];
								splitWeights[s1] = weights[o1];
								splitWeights[s2] = weights[o2];
							}

							if (jointIndices) {
								splitJointIndices[s0] = jointIndices[o0];
								splitJointIndices[s1] = jointIndices[o1];
								splitJointIndices[s2] = jointIndices[o2];
							}

							mappings[originalIndex] = splitIndex;
						}

						// Store new index, which may have come from the mapping look-up,
						// or from copying a new set of vertex data from the original vector
						splitIndices[outIndex + j] = splitIndex;
					}

					outIndex += 3;
				}

				if (splitVerts.length > 0) {
					// More was added in the last iteration of the loop.
					subs.push(GeometryUtils.constructSubGeometry(splitVerts, splitIndices, splitUvs, splitNormals, splitTangents, splitWeights, splitJointIndices, triangleOffset));
				}

			} else {
				subs.push(GeometryUtils.constructSubGeometry(verts, indices, uvs, normals, tangents, weights, jointIndices, triangleOffset));
			}

			return subs;
		}

		/**
		 * Build a sub-geometry from data vectors.
		 */
		public static constructSubGeometry(verts:Array<number>, indices:Array<number> /*uint*/, uvs:Array<number>, normals:Array<number>, tangents:Array<number>, weights:Array<number>, jointIndices:Array<number>, triangleOffset:number):away.base.CompactSubGeometry
		{
			var sub:away.base.CompactSubGeometry;

			if (weights && jointIndices) {
				// If there were weights and joint indices defined, this
				// is a skinned mesh and needs to be built from skinned
				// sub-geometries.
				sub = new away.base.SkinnedSubGeometry(weights.length/(verts.length/3));

				var ssg:away.base.SkinnedSubGeometry = <away.base.SkinnedSubGeometry> sub;

				ssg.iUpdateJointWeightsData(weights);
				ssg.iUpdateJointIndexData(jointIndices);

			} else {
				sub = new away.base.CompactSubGeometry();

			}

			sub.updateIndexData(indices);
			sub.fromVectors(verts, uvs, normals, tangents);

			return sub;
		}

		/*
		 * Combines a set of separate raw buffers into an interleaved one, compatible
		 * with CompactSubGeometry. SubGeometry uses separate buffers, whereas CompactSubGeometry
		 * uses a single, combined buffer.
		 * */
		public static interleaveBuffers(numVertices:number, vertices:Array<number> = null, normals:Array<number> = null, tangents:Array<number> = null, uvs:Array<number> = null, suvs:Array<number> = null):Array<number>
		{

			var i:number, compIndex:number, uvCompIndex:number, interleavedCompIndex:number;
			var interleavedBuffer:Array<number>;

			interleavedBuffer = new Array<number>();

			/**
			 * 0 - 2: vertex position X, Y, Z
			 * 3 - 5: normal X, Y, Z
			 * 6 - 8: tangent X, Y, Z
			 * 9 - 10: U V
			 * 11 - 12: Secondary U V
			 */
			for (i = 0; i < numVertices; ++i) {
				uvCompIndex = i*2;
				compIndex = i*3;
				interleavedCompIndex = i*13;

				interleavedBuffer[ interleavedCompIndex     ] = vertices? vertices[ compIndex       ] : 0;
				interleavedBuffer[ interleavedCompIndex + 1 ] = vertices? vertices[ compIndex + 1   ] : 0;
				interleavedBuffer[ interleavedCompIndex + 2 ] = vertices? vertices[ compIndex + 2   ] : 0;
				interleavedBuffer[ interleavedCompIndex + 3 ] = normals? normals[   compIndex       ] : 0;
				interleavedBuffer[ interleavedCompIndex + 4 ] = normals? normals[   compIndex + 1   ] : 0;
				interleavedBuffer[ interleavedCompIndex + 5 ] = normals? normals[   compIndex + 2   ] : 0;
				interleavedBuffer[ interleavedCompIndex + 6 ] = tangents? tangents[ compIndex       ] : 0;
				interleavedBuffer[ interleavedCompIndex + 7 ] = tangents? tangents[ compIndex + 1   ] : 0;
				interleavedBuffer[ interleavedCompIndex + 8 ] = tangents? tangents[ compIndex + 2   ] : 0;
				interleavedBuffer[ interleavedCompIndex + 9 ] = uvs? uvs[           uvCompIndex     ] : 0;
				interleavedBuffer[ interleavedCompIndex + 10 ] = uvs? uvs[          uvCompIndex + 1 ] : 0;
				interleavedBuffer[ interleavedCompIndex + 11 ] = suvs? suvs[        uvCompIndex      ] : 0;
				interleavedBuffer[ interleavedCompIndex + 12 ] = suvs? suvs[        uvCompIndex + 1 ] : 0;

			}

			return interleavedBuffer;
		}

		/*
		 * returns the subGeometry index in its parent mesh subgeometries vector
		 */
		public static getMeshSubGeometryIndex(subGeometry:away.base.ISubGeometry):number
		{
			var index:number;
			var subGeometries:Array<away.base.ISubGeometry> = subGeometry.parentGeometry.subGeometries;

			for (var i:number = 0; i < subGeometries.length; ++i) {
				if (subGeometries[i] == subGeometry) {
					index = i;
					break;
				}
			}

			return index;
		}

		/*
		 * returns the subMesh index in its parent mesh subMeshes vector
		 */
		public static getMeshSubMeshIndex(subMesh:away.base.SubMesh):number
		{
			var index:number;
			var subMeshes:Array<away.base.SubMesh> = (<away.entities.Mesh> subMesh.sourceEntity).subMeshes;

			for (var i:number = 0; i < subMeshes.length; ++i) {

				if (subMeshes[i] == subMesh) {

					index = i;
					break;

				}
			}

			return index;
		}
	}
}
