"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3DUtils_1 = require("@awayjs/core/lib/geom/Matrix3DUtils");
var ContextGLDrawMode_1 = require("@awayjs/stage/lib/base/ContextGLDrawMode");
var ContextGLProgramType_1 = require("@awayjs/stage/lib/base/ContextGLProgramType");
var GL_ElementsBase_1 = require("../elements/GL_ElementsBase");
/**
 *
 * @class away.pool.GL_TriangleElements
 */
var GL_TriangleElements = (function (_super) {
    __extends(GL_TriangleElements, _super);
    function GL_TriangleElements(triangleElements, stage) {
        _super.call(this, triangleElements, stage);
        this._triangleElements = triangleElements;
    }
    Object.defineProperty(GL_TriangleElements.prototype, "elementsType", {
        get: function () {
            return GL_TriangleElements.elementsType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_TriangleElements.prototype, "elementsClass", {
        get: function () {
            return GL_TriangleElements;
        },
        enumerable: true,
        configurable: true
    });
    GL_TriangleElements._iIncludeDependencies = function (shader) {
    };
    GL_TriangleElements._iGetVertexCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        //get the projection coordinates
        var position = (shader.globalPosDependencies > 0) ? sharedRegisters.globalPositionVertex : sharedRegisters.animatedPosition;
        //reserving vertex constants for projection matrix
        var viewMatrixReg = registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        shader.viewMatrixIndex = viewMatrixReg.index * 4;
        if (shader.projectionDependencies > 0) {
            sharedRegisters.projectionFragment = registerCache.getFreeVarying();
            var temp = registerCache.getFreeVertexVectorTemp();
            code += "m44 " + temp + ", " + position + ", " + viewMatrixReg + "\n" +
                "mov " + sharedRegisters.projectionFragment + ", " + temp + "\n" +
                "mov op, " + temp + "\n";
        }
        else {
            code += "m44 op, " + position + ", " + viewMatrixReg + "\n";
        }
        return code;
    };
    GL_TriangleElements._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    GL_TriangleElements.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._triangleElements = null;
    };
    GL_TriangleElements.prototype._setRenderState = function (renderable, shader, camera, viewProjection) {
        _super.prototype._setRenderState.call(this, renderable, shader, camera, viewProjection);
        //set buffers
        //TODO: find a better way to update a concatenated buffer when autoderiving
        if (shader.normalIndex >= 0 && this._triangleElements.autoDeriveNormals)
            this._triangleElements.normals;
        if (shader.tangentIndex >= 0 && this._triangleElements.autoDeriveTangents)
            this._triangleElements.tangents;
        if (shader.curvesIndex >= 0)
            this.activateVertexBufferVO(shader.curvesIndex, this._triangleElements.getCustomAtributes("curves"));
        if (shader.uvIndex >= 0)
            this.activateVertexBufferVO(shader.uvIndex, this._triangleElements.uvs || this._triangleElements.positions);
        if (shader.secondaryUVIndex >= 0)
            this.activateVertexBufferVO(shader.secondaryUVIndex, this._triangleElements.getCustomAtributes("secondaryUVs") || this._triangleElements.uvs || this._triangleElements.positions);
        if (shader.normalIndex >= 0)
            this.activateVertexBufferVO(shader.normalIndex, this._triangleElements.normals);
        if (shader.tangentIndex >= 0)
            this.activateVertexBufferVO(shader.tangentIndex, this._triangleElements.tangents);
        if (shader.jointIndexIndex >= 0)
            this.activateVertexBufferVO(shader.jointIndexIndex, this._triangleElements.jointIndices);
        if (shader.jointWeightIndex >= 0)
            this.activateVertexBufferVO(shader.jointIndexIndex, this._triangleElements.jointWeights);
        this.activateVertexBufferVO(0, this._triangleElements.positions);
    };
    GL_TriangleElements.prototype.draw = function (renderable, shader, camera, viewProjection, count, offset) {
        //set constants
        if (shader.sceneMatrixIndex >= 0) {
            renderable.renderSceneTransform.copyRawDataTo(shader.vertexConstantData, shader.sceneMatrixIndex, true);
            viewProjection.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
        }
        else {
            var matrix3D = Matrix3DUtils_1.Matrix3DUtils.CALCULATION_MATRIX;
            matrix3D.copyFrom(renderable.renderSceneTransform);
            matrix3D.append(viewProjection);
            matrix3D.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
        }
        var context = this._stage.context;
        context.setProgramConstantsFromArray(ContextGLProgramType_1.ContextGLProgramType.VERTEX, shader.vertexConstantData);
        context.setProgramConstantsFromArray(ContextGLProgramType_1.ContextGLProgramType.FRAGMENT, shader.fragmentConstantData);
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
     * @returns {away.pool.GL_GraphicRenderable}
     * @protected
     */
    GL_TriangleElements.prototype._pGetOverflowElements = function () {
        return new GL_TriangleElements(this._triangleElements, this._stage);
    };
    GL_TriangleElements.elementsType = "[elements Triangle]";
    return GL_TriangleElements;
}(GL_ElementsBase_1.GL_ElementsBase));
exports.GL_TriangleElements = GL_TriangleElements;
