import {Matrix3DUtils}				from "@awayjs/core/lib/geom/Matrix3DUtils";
import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";

import {Camera}						from "@awayjs/display/lib/display/Camera";

import {ContextGLDrawMode}			from "@awayjs/stage/lib/base/ContextGLDrawMode";
import {ContextGLProgramType}			from "@awayjs/stage/lib/base/ContextGLProgramType";
import {IContextGL}					from "@awayjs/stage/lib/base/IContextGL";

import {ShaderBase}					from "../shaders/ShaderBase";
import {ShaderRegisterCache}			from "../shaders/ShaderRegisterCache";
import {ShaderRegisterElement}		from "../shaders/ShaderRegisterElement";
import {GL_TriangleElements}			from "../elements/GL_TriangleElements";
import {IElementsClassGL}				from "../elements/IElementsClassGL";
import {GL_RenderableBase}			from "../renderables/GL_RenderableBase";
import {ShaderRegisterData}			from "../shaders/ShaderRegisterData";

/**
 *
 * @class away.pool.GL_SkyboxElements
 */
export class GL_SkyboxElements extends GL_TriangleElements
{
	private _skyboxProjection:Matrix3D = new Matrix3D();
	
	public static elementsType:string = "[elements Skybox]";

	public get elementsType():string
	{
		return GL_SkyboxElements.elementsType;
	}
	
	public get elementsClass():IElementsClassGL
	{
		return GL_SkyboxElements;
	}
	
	public static _iIncludeDependencies(shader:ShaderBase):void
	{
	}

	/**
	 * @inheritDoc
	 */
	public static _iGetVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		//get the projection coordinates
		var position:ShaderRegisterElement = (shader.globalPosDependencies > 0)? sharedRegisters.globalPositionVertex : sharedRegisters.animatedPosition;

		//reserving vertex constants for projection matrix
		var viewMatrixReg:ShaderRegisterElement = registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		registerCache.getFreeVertexConstant();
		shader.viewMatrixIndex = viewMatrixReg.index*4;

		var scenePosition:ShaderRegisterElement = registerCache.getFreeVertexConstant();
		shader.scenePositionIndex = scenePosition.index*4;

		var skyboxScale:ShaderRegisterElement = registerCache.getFreeVertexConstant();
		
		var temp:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();

		code += "mul " + temp + ", " + position + ", " + skyboxScale + "\n" +
			"add " + temp + ", " + temp + ", " + scenePosition + "\n";

		if (shader.projectionDependencies > 0) {
			sharedRegisters.projectionFragment = registerCache.getFreeVarying();
			code += "m44 " + temp + ", " + temp + ", " + viewMatrixReg + "\n" +
				"mov " + sharedRegisters.projectionFragment + ", " + temp + "\n" +
				"mov op, " + temp + "\n";
		} else {
			code += "m44 op, " + temp + ", " + viewMatrixReg + "\n";
		}

		return code;
	}

	public static _iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	public draw(renderable:GL_RenderableBase, shader:ShaderBase, camera:Camera, viewProjection:Matrix3D, count:number, offset:number):void
	{
		var index:number = shader.scenePositionIndex;
		var pos:Vector3D = camera.scenePosition;
		shader.vertexConstantData[index++] = 2*pos.x;
		shader.vertexConstantData[index++] = 2*pos.y;
		shader.vertexConstantData[index++] = 2*pos.z;
		shader.vertexConstantData[index++] = 1;
		shader.vertexConstantData[index++] = shader.vertexConstantData[index++] = shader.vertexConstantData[index++] = camera.projection.far/Math.sqrt(3);
		shader.vertexConstantData[index] = 1;

		var near:Vector3D = new Vector3D();

		this._skyboxProjection.copyFrom(viewProjection);
		this._skyboxProjection.copyRowTo(2, near);

		var camPos:Vector3D = camera.scenePosition;

		var cx:number = near.x;
		var cy:number = near.y;
		var cz:number = near.z;
		var cw:number = -(near.x*camPos.x + near.y*camPos.y + near.z*camPos.z + Math.sqrt(cx*cx + cy*cy + cz*cz));

		var signX:number = cx >= 0? 1 : -1;
		var signY:number = cy >= 0? 1 : -1;

		var p:Vector3D = new Vector3D(signX, signY, 1, 1);

		var inverse:Matrix3D = this._skyboxProjection.clone();
		inverse.invert();

		var q:Vector3D = inverse.transformVector(p);

		this._skyboxProjection.copyRowTo(3, p);

		var a:number = (q.x*p.x + q.y*p.y + q.z*p.z + q.w*p.w)/(cx*q.x + cy*q.y + cz*q.z + cw*q.w);

		this._skyboxProjection.copyRowFrom(2, new Vector3D(cx*a, cy*a, cz*a, cw*a));
		
		//set constants
		if (shader.sceneMatrixIndex >= 0) {
			renderable.renderSceneTransform.copyRawDataTo(shader.vertexConstantData, shader.sceneMatrixIndex, true);
			this._skyboxProjection.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
		} else {
			this._skyboxProjection.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
		}

		var context:IContextGL = this._stage.context;
		context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, shader.vertexConstantData);
		context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, shader.fragmentConstantData);

		if (this._indices)
			this.getIndexBufferGL().draw(ContextGLDrawMode.TRIANGLES, 0, this.numIndices);
		else
			this._stage.context.drawVertices(ContextGLDrawMode.TRIANGLES, offset, count || this.numVertices);
	}
}