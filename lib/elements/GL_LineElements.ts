import {AssetEvent}					from "@awayjs/core/lib/events/AssetEvent";
import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";

import {ContextGLDrawMode}			from "@awayjs/stage/lib/base/ContextGLDrawMode";
import {IContextGL}					from "@awayjs/stage/lib/base/IContextGL";
import {ContextGLProgramType}			from "@awayjs/stage/lib/base/ContextGLProgramType";
import {Stage}						from "@awayjs/stage/lib/base/Stage";

import {LineElements}					from "@awayjs/display/lib/graphics/LineElements";
import {Camera}						from "@awayjs/display/lib/display/Camera";

import {GL_ElementsBase}				from "../elements/GL_ElementsBase";
import {IElementsClassGL}				from "../elements/IElementsClassGL";
import {ShaderBase}					from "../shaders/ShaderBase";
import {ShaderRegisterCache}			from "../shaders/ShaderRegisterCache";
import {ShaderRegisterElement}		from "../shaders/ShaderRegisterElement";
import {ShaderRegisterData}			from "../shaders/ShaderRegisterData";
import {GL_RenderableBase}			from "../renderables/GL_RenderableBase";

/**
 *
 * @class away.pool.GL_LineElements
 */
export class GL_LineElements extends GL_ElementsBase
{
	public static elementsType:string = "[elements Line]";
	
	public get elementsType():string
	{
		return GL_LineElements.elementsType;
	}
	
	public get elementsClass():IElementsClassGL
	{
		return GL_LineElements;
	}
	
	public static _iIncludeDependencies(shader:ShaderBase):void
	{
		shader.colorDependencies++;
	}

	public static _iGetVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		//get the projection coordinates
		var position0:ShaderRegisterElement = (shader.globalPosDependencies > 0)? sharedRegisters.globalPositionVertex : sharedRegisters.animatedPosition;
		var position1:ShaderRegisterElement = registerCache.getFreeVertexAttribute();
		var thickness:ShaderRegisterElement = registerCache.getFreeVertexAttribute();

		//reserving vertex constants for projection matrix
		var viewMatrixReg:ShaderRegisterElement = registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		shader.viewMatrixIndex = viewMatrixReg.index*4;

		registerCache.getFreeVertexConstant(); // not used
		var constOne:ShaderRegisterElement = registerCache.getFreeVertexConstant();
		var constNegOne:ShaderRegisterElement = registerCache.getFreeVertexConstant();
		var misc:ShaderRegisterElement = registerCache.getFreeVertexConstant();

		var sceneMatrixReg:ShaderRegisterElement = registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		shader.sceneMatrixIndex = sceneMatrixReg.index*4;
		
		var q0:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		registerCache.addVertexTempUsages(q0, 1);
		var q1:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		registerCache.addVertexTempUsages(q1, 1);
		
		var l:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		registerCache.addVertexTempUsages(l, 1);
		var behind:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		registerCache.addVertexTempUsages(behind, 1);
		var qclipped:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		registerCache.addVertexTempUsages(qclipped, 1);
		var offset:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
		registerCache.addVertexTempUsages(offset, 1);

		return "m44 " + q0 + ", " + position0 + ", " + sceneMatrixReg + "			\n" + // transform Q0 to eye space
			"m44 " + q1 + ", " + position1 + ", " + sceneMatrixReg + "			\n" + // transform Q1 to eye space
			"sub " + l + ", " + q1 + ", " + q0 + " 			\n" + // L = Q1 - Q0

				// test if behind camera near plane
				// if 0 - Q0.z < Camera.near then the point needs to be clipped
			"slt " + behind + ".x, " + q0 + ".z, " + misc + ".z			\n" + // behind = ( 0 - Q0.z < -Camera.near ) ? 1 : 0
			"sub " + behind + ".y, " + constOne + ".x, " + behind + ".x			\n" + // !behind = 1 - behind

				// p = point on the plane (0,0,-near)
				// n = plane normal (0,0,-1)
				// D = Q1 - Q0
				// t = ( dot( n, ( p - Q0 ) ) / ( dot( n, d )

				// solve for t where line crosses Camera.near
			"add " + offset + ".x, " + q0 + ".z, " + misc + ".z			\n" + // Q0.z + ( -Camera.near )
			"sub " + offset + ".y, " + q0 + ".z, " + q1 + ".z			\n" + // Q0.z - Q1.z

				// fix divide by zero for horizontal lines
			"seq " + offset + ".z, " + offset + ".y " + constNegOne + ".x			\n" + // offset = (Q0.z - Q1.z)==0 ? 1 : 0
			"add " + offset + ".y, " + offset + ".y, " + offset + ".z			\n" + // ( Q0.z - Q1.z ) + offset

			"div " + offset + ".z, " + offset + ".x, " + offset + ".y			\n" + // t = ( Q0.z - near ) / ( Q0.z - Q1.z )

			"mul " + offset + ".xyz, " + offset + ".zzz, " + l + ".xyz	\n" + // t(L)
			"add " + qclipped + ".xyz, " + q0 + ".xyz, " + offset + ".xyz	\n" + // Qclipped = Q0 + t(L)
			"mov " + qclipped + ".w, " + constOne + ".x			\n" + // Qclipped.w = 1

				// If necessary, replace Q0 with new Qclipped
			"mul " + q0 + ", " + q0 + ", " + behind + ".yyyy			\n" + // !behind * Q0
			"mul " + qclipped + ", " + qclipped + ", " + behind + ".xxxx			\n" + // behind * Qclipped
			"add " + q0 + ", " + q0 + ", " + qclipped + "				\n" + // newQ0 = Q0 + Qclipped

				// calculate side vector for line
			"nrm " + l + ".xyz, " + l + ".xyz			\n" + // normalize( L )
			"nrm " + behind + ".xyz, " + q0 + ".xyz			\n" + // D = normalize( Q1 )
			"mov " + behind + ".w, " + constOne + ".x				\n" + // D.w = 1
			"crs " + qclipped + ".xyz, " + l + ", " + behind + "			\n" + // S = L x D
			"nrm " + qclipped + ".xyz, " + qclipped + ".xyz			\n" + // normalize( S )

				// face the side vector properly for the given point
			"mul " + qclipped + ".xyz, " + qclipped + ".xyz, " + thickness + ".xxx	\n" + // S *= weight
			"mov " + qclipped + ".w, " + constOne + ".x			\n" + // S.w = 1

				// calculate the amount required to move at the point's distance to correspond to the line's pixel width
				// scale the side vector by that amount
			"dp3 " + offset + ".x, " + q0 + ", " + constNegOne + "			\n" + // distance = dot( view )
			"mul " + offset + ".x, " + offset + ".x, " + misc + ".x			\n" + // distance *= vpsod
			"mul " + qclipped + ".xyz, " + qclipped + ".xyz, " + offset + ".xxx	\n" + // S.xyz *= pixelScaleFactor

				// add scaled side vector to Q0 and transform to clip space
			"add " + q0 + ".xyz, " + q0 + ".xyz, " + qclipped + ".xyz	\n" + // Q0 + S

			"m44 op, " + q0 + ", " + viewMatrixReg + "			\n"  // transform Q0 to clip space
	}

	public static _iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}
	
	private _calcMatrix:Matrix3D = new Matrix3D();
	private _thickness:number = 1.25;

	private _lineElements:LineElements;

	constructor(lineElements:LineElements, stage:Stage)
	{
		super(lineElements, stage);

		this._lineElements = lineElements;
	}

	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._lineElements = null;
	}

	public _setRenderState(renderable:GL_RenderableBase, shader:ShaderBase, camera:Camera, viewProjection:Matrix3D):void
	{
		super._setRenderState(renderable, shader, camera, viewProjection);
		
		if (shader.colorBufferIndex >= 0)
			this.activateVertexBufferVO(shader.colorBufferIndex, this._lineElements.colors);

		this.activateVertexBufferVO(0, this._lineElements.positions, 3);
		this.activateVertexBufferVO(2, this._lineElements.positions, 3, 12);
		this.activateVertexBufferVO(3, this._lineElements.thickness);

		shader.vertexConstantData[4+16] = 1;
		shader.vertexConstantData[5+16] = 1;
		shader.vertexConstantData[6+16] = 1;
		shader.vertexConstantData[7+16] = 1;

		shader.vertexConstantData[10+16] = -1;

		shader.vertexConstantData[12+16] = this._thickness/((this._stage.scissorRect)? Math.min(this._stage.scissorRect.width, this._stage.scissorRect.height) : Math.min(this._stage.width, this._stage.height));
		shader.vertexConstantData[13+16] = 1/255;
		shader.vertexConstantData[14+16] = camera.projection.near;

		var context:IContextGL = this._stage.context;
	}

	public draw(renderable:GL_RenderableBase, shader:ShaderBase, camera:Camera, viewProjection:Matrix3D, count:number, offset:number):void
	{
		var context:IContextGL = this._stage.context;
		
		// projection matrix
		camera.projection.matrix.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
		
		this._calcMatrix.copyFrom(renderable.sourceEntity.sceneTransform);
		this._calcMatrix.append(camera.inverseSceneTransform);
		this._calcMatrix.copyRawDataTo(shader.vertexConstantData, shader.sceneMatrixIndex, true);

		context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, shader.vertexConstantData);
		
		if (this._indices)
			this.getIndexBufferGL().draw(ContextGLDrawMode.TRIANGLES, 0, this.numIndices);
		else
			this._stage.context.drawVertices(ContextGLDrawMode.TRIANGLES, offset, count || this.numVertices);
	}

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param renderable
	 * @param level
	 * @param indexOffset
	 * @returns {away.pool.LineSubSpriteRenderable}
	 * @protected
	 */
	public _pGetOverflowElements():GL_ElementsBase
	{
		return new GL_LineElements(this._lineElements, this._stage);
	}
}