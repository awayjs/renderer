import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");

import ContextGLDrawMode			= require("awayjs-stagegl/lib/base/ContextGLDrawMode");
import Stage						= require("awayjs-stagegl/lib/base/Stage");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import ContextGLProgramType			= require("awayjs-stagegl/lib/base/ContextGLProgramType");

import LineElements					= require("awayjs-display/lib/graphics/LineElements");
import ElementsEvent				= require("awayjs-display/lib/events/ElementsEvent");
import Camera						= require("awayjs-display/lib/display/Camera");

import GL_ElementsBase				= require("awayjs-renderergl/lib/elements/GL_ElementsBase");
import ElementsPool					= require("awayjs-renderergl/lib/elements/ElementsPool");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import IEntity = require("awayjs-display/lib/display/IEntity");
import IAbstractionPool = require("awayjs-core/lib/library/IAbstractionPool");

/**
 *
 * @class away.pool.GL_LineElements
 */
class GL_LineElements extends GL_ElementsBase
{
	public static pONE_VECTOR:Float32Array = new Float32Array([1, 1, 1, 1]);
	public static pFRONT_VECTOR:Float32Array = new Float32Array([0, 0, -1, 0]);

	public static vertexAttributesOffset:number = 3;

	public static _iIncludeDependencies(shader:ShaderBase)
	{
		shader.colorDependencies++;
	}

	public static _iGetVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "m44 vt0, va0, vc8			\n" + // transform Q0 to eye space
			"m44 vt1, va1, vc8			\n" + // transform Q1 to eye space
			"sub vt2, vt1, vt0 			\n" + // L = Q1 - Q0

				// test if behind camera near plane
				// if 0 - Q0.z < Camera.near then the point needs to be clipped
				//"neg vt5.x, vt0.z				\n" + // 0 - Q0.z
			"slt vt5.x, vt0.z, vc7.z			\n" + // behind = ( 0 - Q0.z < -Camera.near ) ? 1 : 0
			"sub vt5.y, vc5.x, vt5.x			\n" + // !behind = 1 - behind

				// p = point on the plane (0,0,-near)
				// n = plane normal (0,0,-1)
				// D = Q1 - Q0
				// t = ( dot( n, ( p - Q0 ) ) / ( dot( n, d )

				// solve for t where line crosses Camera.near
			"add vt4.x, vt0.z, vc7.z			\n" + // Q0.z + ( -Camera.near )
			"sub vt4.y, vt0.z, vt1.z			\n" + // Q0.z - Q1.z

				// fix divide by zero for horizontal lines
			"seq vt4.z, vt4.y vc6.x			\n" + // offset = (Q0.z - Q1.z)==0 ? 1 : 0
			"add vt4.y, vt4.y, vt4.z			\n" + // ( Q0.z - Q1.z ) + offset

			"div vt4.z, vt4.x, vt4.y			\n" + // t = ( Q0.z - near ) / ( Q0.z - Q1.z )

			"mul vt4.xyz, vt4.zzz, vt2.xyz	\n" + // t(L)
			"add vt3.xyz, vt0.xyz, vt4.xyz	\n" + // Qclipped = Q0 + t(L)
			"mov vt3.w, vc5.x			\n" + // Qclipped.w = 1

				// If necessary, replace Q0 with new Qclipped
			"mul vt0, vt0, vt5.yyyy			\n" + // !behind * Q0
			"mul vt3, vt3, vt5.xxxx			\n" + // behind * Qclipped
			"add vt0, vt0, vt3				\n" + // newQ0 = Q0 + Qclipped

				// calculate side vector for line
			"sub vt2, vt1, vt0 			\n" + // L = Q1 - Q0
			"nrm vt2.xyz, vt2.xyz			\n" + // normalize( L )
			"nrm vt5.xyz, vt0.xyz			\n" + // D = normalize( Q1 )
			"mov vt5.w, vc5.x				\n" + // D.w = 1
			"crs vt3.xyz, vt2, vt5			\n" + // S = L x D
			"nrm vt3.xyz, vt3.xyz			\n" + // normalize( S )

				// face the side vector properly for the given point
			"mul vt3.xyz, vt3.xyz, va2.xxx	\n" + // S *= weight
			"mov vt3.w, vc5.x			\n" + // S.w = 1

				// calculate the amount required to move at the point's distance to correspond to the line's pixel width
				// scale the side vector by that amount
			"dp3 vt4.x, vt0, vc6			\n" + // distance = dot( view )
			"mul vt4.x, vt4.x, vc7.x			\n" + // distance *= vpsod
			"mul vt3.xyz, vt3.xyz, vt4.xxx	\n" + // S.xyz *= pixelScaleFactor

				// add scaled side vector to Q0 and transform to clip space
			"add vt0.xyz, vt0.xyz, vt3.xyz	\n" + // Q0 + S

			"m44 op, vt0, vc0			\n"  // transform Q0 to clip space
	}

	public static _iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	private _constants:Float32Array = new Float32Array([0, 0, 0, 0]);
	private _calcMatrix:Matrix3D = new Matrix3D();
	private _thickness:number = 1.25;

	private _lineElements:LineElements;

	constructor(lineElements:LineElements, shader:ShaderBase, pool:IAbstractionPool)
	{
		super(lineElements, shader, pool);

		this._lineElements = lineElements;

		this._constants[1] = 1/255;
	}

	public onClear(event:AssetEvent)
	{
		super.onClear(event);


		this._onClearVertices(new ElementsEvent(ElementsEvent.CLEAR_VERTICES, this._lineElements.positions));
		this._onClearVertices(new ElementsEvent(ElementsEvent.CLEAR_VERTICES, this._lineElements.thickness));
		this._onClearVertices(new ElementsEvent(ElementsEvent.CLEAR_VERTICES, this._lineElements.colors));

		this._lineElements = null;
	}

	public _render(sourceEntity:IEntity, camera:Camera, viewProjection:Matrix3D)
	{
		if (this._shader.colorBufferIndex >= 0)
			this.activateVertexBufferVO(this._shader.colorBufferIndex, this._lineElements.colors);

		var context:IContextGL = this._stage.context;

		this._constants[0] = this._thickness/((this._stage.scissorRect)? Math.min(this._stage.scissorRect.width, this._stage.scissorRect.height) : Math.min(this._stage.width, this._stage.height));

		// value to convert distance from camera to model length per pixel width
		this._constants[2] = camera.projection.near;

		// projection matrix
		context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, camera.projection.matrix, true);

		context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 5, GL_LineElements.pONE_VECTOR, 1);
		context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 6, GL_LineElements.pFRONT_VECTOR, 1);
		context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 7, this._constants, 1);

		this._calcMatrix.copyFrom(sourceEntity.sceneTransform);
		this._calcMatrix.append(camera.inverseSceneTransform);
		context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 8, this._calcMatrix, true);

		this.activateVertexBufferVO(0, this._lineElements.positions, 3);
		this.activateVertexBufferVO(1, this._lineElements.positions, 3, 12);
		this.activateVertexBufferVO(2, this._lineElements.thickness);

		super._render(sourceEntity, camera, viewProjection);
	}

	public _drawElements(firstIndex:number, numIndices:number)
	{
		this.getIndexBufferVO().draw(ContextGLDrawMode.TRIANGLES, 0, numIndices);
	}

	public _drawArrays(firstVertex:number, numVertices:number)
	{
		this._stage.context.drawVertices(ContextGLDrawMode.TRIANGLES, firstVertex, numVertices);
	}

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param renderable
	 * @param level
	 * @param indexOffset
	 * @returns {away.pool.LineSubMeshRenderable}
	 * @protected
	 */
	public _pGetOverflowElements():GL_ElementsBase
	{
		return new GL_LineElements(this._lineElements, this._shader, this._pool);
	}
}

export = GL_LineElements;