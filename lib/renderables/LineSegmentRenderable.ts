import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import IAssetClass					= require("awayjs-core/lib/library/IAssetClass");

import IRenderableOwner				= require("awayjs-display/lib/base/IRenderableOwner");
import LineSubGeometry				= require("awayjs-core/lib/data/LineSubGeometry");
import SubGeometryEvent				= require("awayjs-core/lib/events/SubGeometryEvent");
import Camera						= require("awayjs-display/lib/entities/Camera");
import LineSegment					= require("awayjs-display/lib/entities/LineSegment");
import DefaultMaterialManager		= require("awayjs-display/lib/managers/DefaultMaterialManager");

import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import ContextGLProgramType			= require("awayjs-stagegl/lib/base/ContextGLProgramType");
import Stage						= require("awayjs-stagegl/lib/base/Stage");

import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import RenderablePool				= require("awayjs-renderergl/lib/renderables/RenderablePool");
import PassBase						= require("awayjs-renderergl/lib/render/passes/PassBase");

/**
 * @class away.pool.LineSubMeshRenderable
 */
class LineSegmentRenderable extends RenderableBase
{
	public static assetClass:IAssetClass = LineSegment;

	private static _lineGeometry:Object = new Object();

	public static pONE_VECTOR:Array<number> = Array<number>(1, 1, 1, 1);
	public static pFRONT_VECTOR:Array<number> = Array<number>(0, 0, -1, 0);

	private _constants:Array<number> = new Array<number>(0, 0, 0, 0);
	private _calcMatrix:Matrix3D;
	private _thickness:number = 1.25;


	public static vertexAttributesOffset:number = 3;

	/**
	 *
	 */
	private _lineSegment:LineSegment;

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param subMesh
	 * @param level
	 * @param dataOffset
	 */
	constructor(pool:RenderablePool, lineSegment:LineSegment, stage:Stage, level:number = 0, indexOffset:number = 0)
	{
		super(pool, lineSegment, lineSegment, lineSegment.material, stage, level, indexOffset);

		this._lineSegment = lineSegment;

		this._calcMatrix = new Matrix3D();

		this._constants[1] = 1/255;
	}

	/**
	 * //TODO
	 *
	 * @returns {base.LineSubGeometry}
	 * @protected
	 */
	public _pGetSubGeometry():LineSubGeometry
	{
		var geometry:LineSubGeometry = LineSegmentRenderable._lineGeometry[this._lineSegment.id] || (LineSegmentRenderable._lineGeometry[this._lineSegment.id] = new LineSubGeometry());

		this._pVertexDataDirty[LineSubGeometry.START_POSITION_DATA] = true;
		this._pVertexDataDirty[LineSubGeometry.END_POSITION_DATA] = true;
		this._pVertexDataDirty[LineSubGeometry.THICKNESS_DATA] = true;
		this._pVertexDataDirty[LineSubGeometry.COLOR_DATA] = true;

		var start:Vector3D = this._lineSegment.startPostion;
		var end:Vector3D = this._lineSegment.endPosition;

		var startPositions:Array<number>;
		var endPositions:Array<number>;
		var thickness:Array<number>;

		if (geometry.indices != null) {
			startPositions = geometry.startPositions;
			endPositions = geometry.endPositions;
			thickness = geometry.thickness;
		} else {
			startPositions = new Array<number>(3);
			endPositions = new Array<number>(3);
			thickness = new Array<number>(1);
		}

		startPositions[0] = start.x;
		startPositions[1] = start.y;
		startPositions[2] = start.z;
		endPositions[0] = end.x;
		endPositions[1] = end.y;
		endPositions[2] = end.z;
		thickness[0] = this._lineSegment.thickness;

		geometry.updatePositions(startPositions, endPositions);
		geometry.updateThickness(thickness);

		return geometry;
	}

	public static _iIncludeDependencies(shader:ShaderBase)
	{
		shader.colorDependencies++;
	}

	/**
	 * @inheritDoc
	 */
	public static _iGetVertexCode(shader:ShaderBase, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData):string
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

	/**
	 * @inheritDoc
	 */
	public _iActivate(pass:PassBase, camera:Camera)
	{
		super._iActivate(pass, camera);

		this._constants[0] = this._thickness/((this._stage.scissorRect)? Math.min(this._stage.scissorRect.width, this._stage.scissorRect.height) : Math.min(this._stage.width, this._stage.height));

		// value to convert distance from camera to model length per pixel width
		this._constants[2] = camera.projection.near;

		var context:IContextGL = this._stage.context;

		context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 5, LineSegmentRenderable.pONE_VECTOR, 1);
		context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 6, LineSegmentRenderable.pFRONT_VECTOR, 1);
		context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 7, this._constants, 1);

		// projection matrix
		context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, camera.projection.matrix, true);
	}

	/**
	 * @inheritDoc
	 */
	public _iRender(pass:PassBase, camera:Camera, viewProjection:Matrix3D)
	{
		super._iRender(pass, camera, viewProjection);

		var context:IContextGL = this._stage.context;
		this._calcMatrix.copyFrom(this.sourceEntity.sceneTransform);
		this._calcMatrix.append(camera.inverseSceneTransform);

		context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 8, this._calcMatrix, true);

		this._stage.activateBuffer(0, this.getVertexData(LineSubGeometry.START_POSITION_DATA), this.getVertexOffset(LineSubGeometry.START_POSITION_DATA), LineSubGeometry.POSITION_FORMAT);
		this._stage.activateBuffer(1, this.getVertexData(LineSubGeometry.END_POSITION_DATA), this.getVertexOffset(LineSubGeometry.END_POSITION_DATA), LineSubGeometry.POSITION_FORMAT);
		this._stage.activateBuffer(2, this.getVertexData(LineSubGeometry.THICKNESS_DATA), this.getVertexOffset(LineSubGeometry.THICKNESS_DATA), LineSubGeometry.THICKNESS_FORMAT);

		context.drawTriangles(this._stage.getIndexBuffer(this.getIndexData()), 0, this.numTriangles);
	}

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param renderableOwner
	 * @param level
	 * @param indexOffset
	 * @returns {away.pool.LineSubMeshRenderable}
	 * @private
	 */
	public _pGetOverflowRenderable(indexOffset:number):RenderableBase
	{
		return new LineSegmentRenderable(this._pool, <LineSegment> this.renderableOwner, this._stage, this._level + 1, indexOffset);
	}
}

export = LineSegmentRenderable;