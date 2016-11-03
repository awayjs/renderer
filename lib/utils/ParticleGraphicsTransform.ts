import {Matrix}							from "@awayjs/core/lib/geom/Matrix";
import {Matrix3D}							from "@awayjs/core/lib/geom/Matrix3D";

/**
 * ...
 */
export class ParticleGraphicsTransform
{
	private _defaultVertexTransform:Matrix3D;
	private _defaultInvVertexTransform:Matrix3D;
	private _defaultUVTransform:Matrix;

	public set vertexTransform(value:Matrix3D)
	{
		this._defaultVertexTransform = value;
		this._defaultInvVertexTransform = value.clone();
		this._defaultInvVertexTransform.invert();
		this._defaultInvVertexTransform.transpose();
	}

	public set UVTransform(value:Matrix)
	{
		this._defaultUVTransform = value;
	}

	public get UVTransform():Matrix
	{
		return this._defaultUVTransform;
	}

	public get vertexTransform():Matrix3D
	{
		return this._defaultVertexTransform;
	}

	public get invVertexTransform():Matrix3D
	{
		return this._defaultInvVertexTransform;
	}
}