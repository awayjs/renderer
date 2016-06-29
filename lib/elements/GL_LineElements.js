"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3D_1 = require("@awayjs/core/lib/geom/Matrix3D");
var ContextGLDrawMode_1 = require("@awayjs/stage/lib/base/ContextGLDrawMode");
var ContextGLProgramType_1 = require("@awayjs/stage/lib/base/ContextGLProgramType");
var GL_ElementsBase_1 = require("../elements/GL_ElementsBase");
/**
 *
 * @class away.pool.GL_LineElements
 */
var GL_LineElements = (function (_super) {
    __extends(GL_LineElements, _super);
    function GL_LineElements(lineElements, stage) {
        _super.call(this, lineElements, stage);
        this._calcMatrix = new Matrix3D_1.Matrix3D();
        this._thickness = 1.25;
        this._lineElements = lineElements;
    }
    Object.defineProperty(GL_LineElements.prototype, "elementsType", {
        get: function () {
            return GL_LineElements.elementsType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_LineElements.prototype, "elementsClass", {
        get: function () {
            return GL_LineElements;
        },
        enumerable: true,
        configurable: true
    });
    GL_LineElements._iIncludeDependencies = function (shader) {
        shader.colorDependencies++;
    };
    GL_LineElements._iGetVertexCode = function (shader, registerCache, sharedRegisters) {
        //get the projection coordinates
        var position0 = (shader.globalPosDependencies > 0) ? sharedRegisters.globalPositionVertex : sharedRegisters.animatedPosition;
        var position1 = registerCache.getFreeVertexAttribute();
        var thickness = registerCache.getFreeVertexAttribute();
        //reserving vertex constants for projection matrix
        var viewMatrixReg = registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        shader.viewMatrixIndex = viewMatrixReg.index * 4;
        registerCache.getFreeVertexConstant(); // not used
        var constOne = registerCache.getFreeVertexConstant();
        var constNegOne = registerCache.getFreeVertexConstant();
        var misc = registerCache.getFreeVertexConstant();
        var sceneMatrixReg = registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        shader.sceneMatrixIndex = sceneMatrixReg.index * 4;
        var q0 = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(q0, 1);
        var q1 = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(q1, 1);
        var l = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(l, 1);
        var behind = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(behind, 1);
        var qclipped = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(qclipped, 1);
        var offset = registerCache.getFreeVertexVectorTemp();
        registerCache.addVertexTempUsages(offset, 1);
        return "m44 " + q0 + ", " + position0 + ", " + sceneMatrixReg + "			\n" +
            "m44 " + q1 + ", " + position1 + ", " + sceneMatrixReg + "			\n" +
            "sub " + l + ", " + q1 + ", " + q0 + " 			\n" +
            // test if behind camera near plane
            // if 0 - Q0.z < Camera.near then the point needs to be clipped
            "slt " + behind + ".x, " + q0 + ".z, " + misc + ".z			\n" +
            "sub " + behind + ".y, " + constOne + ".x, " + behind + ".x			\n" +
            // p = point on the plane (0,0,-near)
            // n = plane normal (0,0,-1)
            // D = Q1 - Q0
            // t = ( dot( n, ( p - Q0 ) ) / ( dot( n, d )
            // solve for t where line crosses Camera.near
            "add " + offset + ".x, " + q0 + ".z, " + misc + ".z			\n" +
            "sub " + offset + ".y, " + q0 + ".z, " + q1 + ".z			\n" +
            // fix divide by zero for horizontal lines
            "seq " + offset + ".z, " + offset + ".y " + constNegOne + ".x			\n" +
            "add " + offset + ".y, " + offset + ".y, " + offset + ".z			\n" +
            "div " + offset + ".z, " + offset + ".x, " + offset + ".y			\n" +
            "mul " + offset + ".xyz, " + offset + ".zzz, " + l + ".xyz	\n" +
            "add " + qclipped + ".xyz, " + q0 + ".xyz, " + offset + ".xyz	\n" +
            "mov " + qclipped + ".w, " + constOne + ".x			\n" +
            // If necessary, replace Q0 with new Qclipped
            "mul " + q0 + ", " + q0 + ", " + behind + ".yyyy			\n" +
            "mul " + qclipped + ", " + qclipped + ", " + behind + ".xxxx			\n" +
            "add " + q0 + ", " + q0 + ", " + qclipped + "				\n" +
            // calculate side vector for line
            "nrm " + l + ".xyz, " + l + ".xyz			\n" +
            "nrm " + behind + ".xyz, " + q0 + ".xyz			\n" +
            "mov " + behind + ".w, " + constOne + ".x				\n" +
            "crs " + qclipped + ".xyz, " + l + ", " + behind + "			\n" +
            "nrm " + qclipped + ".xyz, " + qclipped + ".xyz			\n" +
            // face the side vector properly for the given point
            "mul " + qclipped + ".xyz, " + qclipped + ".xyz, " + thickness + ".xxx	\n" +
            "mov " + qclipped + ".w, " + constOne + ".x			\n" +
            // calculate the amount required to move at the point's distance to correspond to the line's pixel width
            // scale the side vector by that amount
            "dp3 " + offset + ".x, " + q0 + ", " + constNegOne + "			\n" +
            "mul " + offset + ".x, " + offset + ".x, " + misc + ".x			\n" +
            "mul " + qclipped + ".xyz, " + qclipped + ".xyz, " + offset + ".xxx	\n" +
            // add scaled side vector to Q0 and transform to clip space
            "add " + q0 + ".xyz, " + q0 + ".xyz, " + qclipped + ".xyz	\n" +
            "m44 op, " + q0 + ", " + viewMatrixReg + "			\n"; // transform Q0 to clip space
    };
    GL_LineElements._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    GL_LineElements.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._lineElements = null;
    };
    GL_LineElements.prototype._setRenderState = function (renderable, shader, camera, viewProjection) {
        _super.prototype._setRenderState.call(this, renderable, shader, camera, viewProjection);
        if (shader.colorBufferIndex >= 0)
            this.activateVertexBufferVO(shader.colorBufferIndex, this._lineElements.colors);
        this.activateVertexBufferVO(0, this._lineElements.positions, 3);
        this.activateVertexBufferVO(2, this._lineElements.positions, 3, 12);
        this.activateVertexBufferVO(3, this._lineElements.thickness);
        shader.vertexConstantData[4 + 16] = 1;
        shader.vertexConstantData[5 + 16] = 1;
        shader.vertexConstantData[6 + 16] = 1;
        shader.vertexConstantData[7 + 16] = 1;
        shader.vertexConstantData[10 + 16] = -1;
        shader.vertexConstantData[12 + 16] = this._thickness / ((this._stage.scissorRect) ? Math.min(this._stage.scissorRect.width, this._stage.scissorRect.height) : Math.min(this._stage.width, this._stage.height));
        shader.vertexConstantData[13 + 16] = 1 / 255;
        shader.vertexConstantData[14 + 16] = camera.projection.near;
        var context = this._stage.context;
    };
    GL_LineElements.prototype.draw = function (renderable, shader, camera, viewProjection, count, offset) {
        var context = this._stage.context;
        // projection matrix
        camera.projection.matrix.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
        this._calcMatrix.copyFrom(renderable.sourceEntity.sceneTransform);
        this._calcMatrix.append(camera.inverseSceneTransform);
        this._calcMatrix.copyRawDataTo(shader.vertexConstantData, shader.sceneMatrixIndex, true);
        context.setProgramConstantsFromArray(ContextGLProgramType_1.ContextGLProgramType.VERTEX, shader.vertexConstantData);
        if (this._indices)
            this.getIndexBufferGL().draw(ContextGLDrawMode_1.ContextGLDrawMode.TRIANGLES, 0, this.numIndices);
        else
            this._stage.context.drawVertices(ContextGLDrawMode_1.ContextGLDrawMode.TRIANGLES, offset, count || this.numVertices);
    };
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
    GL_LineElements.prototype._pGetOverflowElements = function () {
        return new GL_LineElements(this._lineElements, this._stage);
    };
    GL_LineElements.elementsType = "[elements Line]";
    return GL_LineElements;
}(GL_ElementsBase_1.GL_ElementsBase));
exports.GL_LineElements = GL_LineElements;
