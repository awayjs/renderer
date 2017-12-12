import {Matrix3D, Vector3D, Box, Sphere, Rectangle, Point} from "@awayjs/core";

import {AttributesBuffer, AttributesView, Short2Attributes, Short3Attributes, Float2Attributes, Float3Attributes, Float4Attributes, Byte4Attributes} from "@awayjs/stage";

export class ElementsUtils
{
	private static tempFloat32x4:Float32Array = new Float32Array(4);

	private static LIMIT_VERTS:number = 0xffff;

	private static LIMIT_INDICES:number = 0xffffff;

	private static _indexSwap:Array<number> = new Array<number>();

	public static generateFaceNormals(indexAttributes:Short3Attributes, positionAttributes:AttributesView, faceNormalAttributes:Float4Attributes, count:number, offset:number = 0):Float4Attributes
	{
		var indices:Uint16Array = indexAttributes.get(count, offset);
		var positions:ArrayBufferView = positionAttributes.get(positionAttributes.count);

		if (faceNormalAttributes == null)
			faceNormalAttributes = new Float4Attributes(count + offset);
		else if (faceNormalAttributes.count < count + offset)
			faceNormalAttributes.count = count + offset;

		var indexDim:number = indexAttributes.stride;
		var posDim:number = positionAttributes.dimensions;
		var posStride:number = positionAttributes.stride;

		var faceNormals:Float32Array = faceNormalAttributes.get(count, offset);

		var len:number = count*indexDim;
		var i:number = 0;
		var j:number = 0;
		var index:number;

		var x1:number, x2:number, x3:number;
		var y1:number, y2:number, y3:number;
		var z1:number, z2:number, z3:number;
		var dx1:number, dy1:number, dz1:number;
		var dx2:number, dy2:number, dz2:number;
		var cx:number, cy:number, cz:number;
		var d:number;

		if (posDim == 3) {
			for (i = 0; i < len; i += indexDim) {
				index = indices[i]*posStride;
				x1 = positions[index];
				y1 = positions[index + 1];
				z1 = positions[index + 2];
				index = indices[i + 1]*posStride;
				x2 = positions[index];
				y2 = positions[index + 1];
				z2 = positions[index + 2];
				index = indices[i + 2]*posStride;
				x3 = positions[index];
				y3 = positions[index + 1];
				z3 = positions[index + 2];
				dx1 = x3 - x1;
				dy1 = y3 - y1;
				dz1 = z3 - z1;
				dx2 = x2 - x1;
				dy2 = y2 - y1;
				dz2 = z2 - z1;
				cx = dz1*dy2 - dy1*dz2;
				cy = dx1*dz2 - dz1*dx2;
				cz = dy1*dx2 - dx1*dy2;
				d = Math.sqrt(cx*cx + cy*cy + cz*cz);
				// length of cross product = 2*triangle area

				faceNormals[j++] = cx;
				faceNormals[j++] = cy;
				faceNormals[j++] = cz;
				faceNormals[j++] = d;
			}
		} else if (posDim == 2) {
			for (i = 0; i < len; i += indexDim) {
				faceNormals[j++] = 0;
				faceNormals[j++] = 0;
				faceNormals[j++] = 1;
				faceNormals[j++] = 1;
			}
		}

		return faceNormalAttributes;
	}

	public static generateNormals(indexAttributes:Short3Attributes, faceNormalAttributes:Float4Attributes, normalAttributes:Float3Attributes, concatenatedBuffer:AttributesBuffer):Float3Attributes
	{
		var indices:Uint16Array = indexAttributes.get(indexAttributes.count);
		var faceNormals:Float32Array = faceNormalAttributes.get(faceNormalAttributes.count);

		if (normalAttributes == null)
			normalAttributes = new Float3Attributes(concatenatedBuffer);

		var indexDim:number = indexAttributes.dimensions;
		var normalStride:number = normalAttributes.stride;

		var normals:Float32Array = normalAttributes.get(normalAttributes.count);

		var i:number;
		var len:number = normalAttributes.count*normalStride;

		//clear normal values
		for (i = 0; i < len; i += normalStride) {
			normals[i] = 0;
			normals[i + 1] = 0;
			normals[i + 2] = 0;
		}

		len = indexAttributes.count*indexDim;
		var index:number;
		var f1:number = 0;
		var f2:number = 1;
		var f3:number = 2;

		//collect face normals
		for (i = 0; i < len; i += indexDim) {
			index = indices[i]*normalStride;
			normals[index] += faceNormals[f1];
			normals[index + 1] += faceNormals[f2];
			normals[index + 2] += faceNormals[f3];
			index = indices[i + 1]*normalStride;
			normals[index] += faceNormals[f1];
			normals[index + 1] += faceNormals[f2];
			normals[index + 2] += faceNormals[f3];
			index = indices[i + 2]*normalStride;
			normals[index] += faceNormals[f1];
			normals[index + 1] += faceNormals[f2];
			normals[index + 2] += faceNormals[f3];
			f1 += 4;
			f2 += 4;
			f3 += 4;
		}

		len = normalAttributes.count*normalStride;
		var vx:number;
		var vy:number;
		var vz:number;
		var d:number;

		//normalise normals collections
		for (i = 0; i < len; i += normalStride) {
			vx = normals[i];
			vy = normals[i + 1];
			vz = normals[i + 2];
			d = 1.0/Math.sqrt(vx*vx + vy*vy + vz*vz);

			normals[i] = vx*d;
			normals[i + 1] = vy*d;
			normals[i + 2] = vz*d;
		}

		return normalAttributes;
	}

	public static generateFaceTangents(indexAttributes:Short3Attributes, positionAttributes:AttributesView, uvAttributes:AttributesView, faceTangentAttributes:Float4Attributes, count:number, offset:number = 0, useFaceWeights:boolean = false):Float4Attributes
	{
		var indices:Uint16Array = indexAttributes.get(count, offset);
		var positions:ArrayBufferView = positionAttributes.get(positionAttributes.count);
		var uvs:Float32Array = <Float32Array> uvAttributes.get(uvAttributes.count);

		if (faceTangentAttributes == null)
			faceTangentAttributes = new Float4Attributes(count + offset);
		else if (faceTangentAttributes.count < count + offset)
			faceTangentAttributes.count = count + offset;

		var indexDim:number = indexAttributes.dimensions;
		var posDim:number = positionAttributes.dimensions;
		var posStride:number = positionAttributes.stride;
		var uvStride:number = uvAttributes.stride;

		var faceTangents:Float32Array = faceTangentAttributes.get(count, offset);

		var i:number = 0;
		var index1:number;
		var index2:number;
		var index3:number;
		var v0:number;
		var v1:number;
		var v2:number;
		var dv1:number;
		var dv2:number;
		var denom:number;
		var x0:number, y0:number, z0:number;
		var dx1:number, dy1:number, dz1:number;
		var dx2:number, dy2:number, dz2:number;
		var cx:number, cy:number, cz:number;

		//multiply by dimension to get index length
		var len:number = count*indexDim;
		for (i = 0; i < len; i += indexDim) {
			index1 = indices[i];
			index2 = indices[i + 1];
			index3 = indices[i + 2];

			v0 = uvs[index1*uvStride + 1];
			dv1 = uvs[index2*uvStride + 1] - v0;
			dv2 = uvs[index3*uvStride + 1] - v0;

			v0 = index1*posStride;
			v1 = index2*posStride;
			v2 = index3*posStride;

			x0 = positions[v0];
			dx1 = positions[v1] - x0;
			dx2 = positions[v2] - x0;
			cx = dv2*dx1 - dv1*dx2;

			y0 = positions[v0 + 1];
			dy1 = positions[v1 + 1] - y0;
			dy2 = positions[v2 + 1] - y0;
			cy = dv2*dy1 - dv1*dy2;

			if (posDim == 3) {
				z0 = positions[v0 + 2];
				dz1 = positions[v1 + 2] - z0;
				dz2 = positions[v2 + 2] - z0;
				cz = dv2*dz1 - dv1*dz2;
			} else {
				cz = 0;
			}

			denom = 1/Math.sqrt(cx*cx + cy*cy + cz*cz);

			faceTangents[i] = denom*cx;
			faceTangents[i + 1] = denom*cy;
			faceTangents[i + 2] = denom*cz;
		}

		return faceTangentAttributes;
	}

	public static generateTangents(indexAttributes:Short3Attributes, faceTangentAttributes:Float3Attributes, faceNormalAttributes:Float4Attributes, tangentAttributes:Float3Attributes, concatenatedBuffer:AttributesBuffer):Float3Attributes
	{
		var indices:Uint16Array = indexAttributes.get(indexAttributes.count);
		var faceTangents:Float32Array = faceTangentAttributes.get(faceTangentAttributes.count);
		var faceNormals:Float32Array = faceNormalAttributes.get(faceNormalAttributes.count);

		if (tangentAttributes == null)
			tangentAttributes = new Float3Attributes(concatenatedBuffer);

		var indexDim:number = indexAttributes.dimensions;
		var tangentStride:number = tangentAttributes.stride;

		var tangents:Float32Array = tangentAttributes.get(tangentAttributes.count);

		var i:number;
		var len:number = tangentAttributes.count*tangentStride;

		//clear tangent values
		for (i = 0; i < len; i += tangentStride) {
			tangents[i] = 0;
			tangents[i + 1] = 0;
			tangents[i + 2] = 0;
		}

		var weight:number;
		var index:number;
		var f1:number = 0;
		var f2:number = 1;
		var f3:number = 2;
		var f4:number = 3;

		len = indexAttributes.count*indexDim;

		//collect face tangents
		for (i = 0; i < len; i += indexDim) {
			weight = faceNormals[f4];
			index = indices[i]*tangentStride;
			tangents[index++] += faceTangents[f1]*weight;
			tangents[index++] += faceTangents[f2]*weight;
			tangents[index] += faceTangents[f3]*weight;
			index = indices[i + 1]*tangentStride;
			tangents[index++] += faceTangents[f1]*weight;
			tangents[index++] += faceTangents[f2]*weight;
			tangents[index] += faceTangents[f3]*weight;
			index = indices[i + 2]*tangentStride;
			tangents[index++] += faceTangents[f1]*weight;
			tangents[index++] += faceTangents[f2]*weight;
			tangents[index] += faceTangents[f3]*weight;
			f1 += 3;
			f2 += 3;
			f3 += 3;
			f4 += 4;
		}

		var vx:number;
		var vy:number;
		var vz:number;
		var d:number;

		//normalise tangents collections
		for (i = 0; i < len; i += tangentStride) {
			vx = tangents[i];
			vy = tangents[i + 1];
			vz = tangents[i + 2];
			d = 1.0/Math.sqrt(vx*vx + vy*vy + vz*vz);

			tangents[i] = vx*d;
			tangents[i + 1] = vy*d;
			tangents[i + 2] = vz*d;
		}

		return tangentAttributes;
	}

	public static generateColors(indexAttributes:Short3Attributes, colorAttributes:Byte4Attributes, concatenatedBuffer:AttributesBuffer, count:number, offset:number = 0):Byte4Attributes
	{
		if (colorAttributes == null)
			colorAttributes = new Byte4Attributes(concatenatedBuffer);

		if (colorAttributes.count < count + offset)
			colorAttributes.count = count + offset;

		var colors:Uint8Array = colorAttributes.get(count, offset);
		var colorStride:number = colorAttributes.stride;

		var len:number = colorAttributes.count*colorStride;
		for (var i:number = 0; i < len; i += colorStride) {
			colors[i] = 0xFF;
			colors[i + 1] = 0xFF;
			colors[i + 2] = 0xFF;
			colors[i + 3] = 0xFF;
		}

		return colorAttributes;
	}

	public static scale(scaleA:number, scaleB:number, scaleC:number, output:AttributesView, count:number, offset:number = 0):void
	{
		if (output.count < count + offset)
			output.count = count + offset;

		var scaleArray:Float32Array = new Float32Array([scaleA, scaleB, scaleC]);
		var values:ArrayBufferView = output.get(count, offset);
		var outputStride:number = output.stride;
		var outputDim:number = output.dimensions;

		var i:number;
		var j:number;
		var len:number = count*outputStride;

		for (i = 0; i < len; i += outputStride)
			for (j = 0; j < outputDim; j++)
				values[i+j] *= scaleArray[j];

		output.invalidate();
	}

	public static applyTransformation(transform:Matrix3D, positionAttributes:AttributesView, normalAttributes:Float3Attributes, tangentAttributes:Float3Attributes, count:number, offset:number = 0):void
	{
		//todo: make this compatible with 2-dimensional positions
		var positions:ArrayBufferView = positionAttributes.get(count, offset);
		var positionStride:number = positionAttributes.stride;

		var normals:Float32Array;
		var normalStride:number;

		if (normalAttributes) {
			normals = normalAttributes.get(count, offset);
			normalStride = normalAttributes.stride;
		}

		var tangents:Float32Array;
		var tangentStride:number;

		if (tangentAttributes) {
			tangents = tangentAttributes.get(count, offset);
			tangentStride = tangentAttributes.stride;
		}

		var i:number;
		var i1:number;
		var i2:number;
		var vector:Vector3D = new Vector3D();
		var invTranspose:Matrix3D;

		if (normalAttributes || tangentAttributes) {
			invTranspose = transform.clone();
			invTranspose.invert();
			invTranspose.transpose();
		}

		var vi0:number = 0;
		var ni0:number = 0;
		var ti0:number = 0;

		for (i = 0; i < count; ++i) {
			// bake position
			i1 = vi0 + 1;
			i2 = vi0 + 2;
			vector.x = positions[vi0];
			vector.y = positions[i1];
			vector.z = positions[i2];
			vector = transform.transformVector(vector);
			positions[vi0] = vector.x;
			positions[i1] = vector.y;
			positions[i2] = vector.z;
			vi0 += positionStride;

			if	(normals) {
				// bake normal
				i1 = ni0 + 1;
				i2 = ni0 + 2;
				vector.x = normals[ni0];
				vector.y = normals[i1];
				vector.z = normals[i2];
				vector = invTranspose.deltaTransformVector(vector);
				vector.normalize();
				normals[ni0] = vector.x;
				normals[i1] = vector.y;
				normals[i2] = vector.z;
				ni0 += normalStride;
			}

			if (tangents) {
				// bake tangent
				i1 = ti0 + 1;
				i2 = ti0 + 2;
				vector.x = tangents[ti0];
				vector.y = tangents[i1];
				vector.z = tangents[i2];
				vector = invTranspose.deltaTransformVector(vector);
				vector.normalize();
				tangents[ti0] = vector.x;
				tangents[i1] = vector.y;
				tangents[i2] = vector.z;
				ti0 += tangentStride;
			}
		}

		positionAttributes.invalidate();

		if (normalAttributes)
			normalAttributes.invalidate();

		if (tangentAttributes)
			tangentAttributes.invalidate();
	}

	public static getSubIndices(indexAttributes:Short2Attributes, numVertices:number, indexMappings:Array<number>, indexOffset?:number):AttributesBuffer;
	public static getSubIndices(indexAttributes:Short3Attributes, numVertices:number, indexMappings:Array<number>, indexOffset?:number):AttributesBuffer;
	public static getSubIndices(indexAttributes:AttributesView, numVertices:number, indexMappings:Array<number>, indexOffset:number = 0):AttributesBuffer
	{
		var buffer:AttributesBuffer = indexAttributes.attributesBuffer;
		var numIndices:number = indexAttributes.length;

		//reset mappings
		indexMappings.length = 0;

		//shortcut for those buffers that fit into the maximum buffer sizes
		if (numIndices < ElementsUtils.LIMIT_INDICES && numVertices < ElementsUtils.LIMIT_VERTS)
			return buffer;

		var i:number;
		var indices:Uint16Array = <Uint16Array> indexAttributes.get(indexAttributes.count, indexOffset);
		var splitIndices:Array<number> = new Array<number>();
		var indexSwap:Array<number> = ElementsUtils._indexSwap;


		indexSwap.length = numIndices;
		for (i = 0; i < numIndices; i++)
			indexSwap[i] = -1;

		var originalIndex:number;
		var splitIndex:number;
		var index:number = 0;
		var offsetLength:number = indexOffset*indexAttributes.dimensions;

		// Loop over all triangles

		i = 0;
		while (i < numIndices + offsetLength && i + 1 < ElementsUtils.LIMIT_INDICES && index + 1 < ElementsUtils.LIMIT_VERTS) {
			originalIndex = indices[i];

			if (indexSwap[originalIndex] >= 0) {
				splitIndex = indexSwap[originalIndex];
			} else {
				// This vertex does not yet exist in the split list and
				// needs to be copied from the long list.
				splitIndex = index++;
				indexSwap[originalIndex] = splitIndex;
				indexMappings[splitIndex] = originalIndex;
			}

			// Store new index, which may have come from the swap look-up,
			// or from copying a new set of vertex data from the original vector
			splitIndices[i++] = splitIndex;
		}

		buffer = new AttributesBuffer(indexAttributes.size*indexAttributes.dimensions, splitIndices.length/indexAttributes.dimensions);

		indexAttributes = indexAttributes.clone(buffer);
		indexAttributes.set(splitIndices);

		return buffer;
	}

	public static getSubVertices(vertexBuffer:AttributesBuffer, indexMappings:Array<number>):AttributesBuffer
	{
		if (!indexMappings.length)
			return vertexBuffer;

		var stride:number = vertexBuffer.stride;

		var vertices:Uint8Array = vertexBuffer.bufferView;

		var splitVerts:Uint8Array = new Uint8Array(indexMappings.length*stride);
		var splitIndex:number;
		var originalIndex:number;
		var i:number = 0;
		var j:number = 0;
		var len:number = indexMappings.length;
		for (i = 0; i < len; i++) {
			splitIndex = i*stride;
			originalIndex = indexMappings[i]*stride;

			for (j = 0; j < stride; j++)
				splitVerts[splitIndex + j] = vertices[originalIndex + j];
		}

		vertexBuffer = new AttributesBuffer(stride, len);
		vertexBuffer.bufferView = splitVerts;

		return vertexBuffer;
	}
}