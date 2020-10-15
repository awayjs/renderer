import { IAsset } from '@awayjs/core';

import { AttributesView, Short3Attributes, Float3Attributes, Float2Attributes } from '@awayjs/stage';

/**
 * @class away.base.TriangleElements
 */
export interface IElements extends IAsset
{
	autoDeriveNormals: boolean;

	autoDeriveTangents: boolean;

	useCondensedIndices: boolean;

	condensedIndexLookUp: Array<number>;

	/**
     * The raw index data that define the faces.
     */
	indices: Short3Attributes;

	numElements: number;

	numVertices: number;
}