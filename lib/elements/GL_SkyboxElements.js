"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Matrix3D_1 = require("@awayjs/core/lib/geom/Matrix3D");
var Vector3D_1 = require("@awayjs/core/lib/geom/Vector3D");
var ContextGLDrawMode_1 = require("@awayjs/stage/lib/base/ContextGLDrawMode");
var ContextGLProgramType_1 = require("@awayjs/stage/lib/base/ContextGLProgramType");
var GL_TriangleElements_1 = require("../elements/GL_TriangleElements");
/**
 *
 * @class away.pool.GL_SkyboxElements
 */
var GL_SkyboxElements = (function (_super) {
    __extends(GL_SkyboxElements, _super);
    function GL_SkyboxElements() {
        _super.apply(this, arguments);
        this._skyboxProjection = new Matrix3D_1.Matrix3D();
    }
    Object.defineProperty(GL_SkyboxElements.prototype, "elementsType", {
        get: function () {
            return GL_SkyboxElements.elementsType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_SkyboxElements.prototype, "elementsClass", {
        get: function () {
            return GL_SkyboxElements;
        },
        enumerable: true,
        configurable: true
    });
    GL_SkyboxElements._iIncludeDependencies = function (shader) {
    };
    /**
     * @inheritDoc
     */
    GL_SkyboxElements._iGetVertexCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        //get the projection coordinates
        var position = (shader.globalPosDependencies > 0) ? sharedRegisters.globalPositionVertex : sharedRegisters.animatedPosition;
        //reserving vertex constants for projection matrix
        var viewMatrixReg = registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        shader.viewMatrixIndex = viewMatrixReg.index * 4;
        var scenePosition = registerCache.getFreeVertexConstant();
        shader.scenePositionIndex = scenePosition.index * 4;
        var skyboxScale = registerCache.getFreeVertexConstant();
        var temp = registerCache.getFreeVertexVectorTemp();
        code += "mul " + temp + ", " + position + ", " + skyboxScale + "\n" +
            "add " + temp + ", " + temp + ", " + scenePosition + "\n";
        if (shader.projectionDependencies > 0) {
            sharedRegisters.projectionFragment = registerCache.getFreeVarying();
            code += "m44 " + temp + ", " + temp + ", " + viewMatrixReg + "\n" +
                "mov " + sharedRegisters.projectionFragment + ", " + temp + "\n" +
                "mov op, " + temp + "\n";
        }
        else {
            code += "m44 op, " + temp + ", " + viewMatrixReg + "\n";
        }
        return code;
    };
    GL_SkyboxElements._iGetFragmentCode = function (shader, registerCache, sharedRegisters) {
        return "";
    };
    GL_SkyboxElements.prototype.draw = function (renderable, shader, camera, viewProjection, count, offset) {
        var index = shader.scenePositionIndex;
        var pos = camera.scenePosition;
        shader.vertexConstantData[index++] = 2 * pos.x;
        shader.vertexConstantData[index++] = 2 * pos.y;
        shader.vertexConstantData[index++] = 2 * pos.z;
        shader.vertexConstantData[index++] = 1;
        shader.vertexConstantData[index++] = shader.vertexConstantData[index++] = shader.vertexConstantData[index++] = camera.projection.far / Math.sqrt(3);
        shader.vertexConstantData[index] = 1;
        var near = new Vector3D_1.Vector3D();
        this._skyboxProjection.copyFrom(viewProjection);
        this._skyboxProjection.copyRowTo(2, near);
        var camPos = camera.scenePosition;
        var cx = near.x;
        var cy = near.y;
        var cz = near.z;
        var cw = -(near.x * camPos.x + near.y * camPos.y + near.z * camPos.z + Math.sqrt(cx * cx + cy * cy + cz * cz));
        var signX = cx >= 0 ? 1 : -1;
        var signY = cy >= 0 ? 1 : -1;
        var p = new Vector3D_1.Vector3D(signX, signY, 1, 1);
        var inverse = this._skyboxProjection.clone();
        inverse.invert();
        var q = inverse.transformVector(p);
        this._skyboxProjection.copyRowTo(3, p);
        var a = (q.x * p.x + q.y * p.y + q.z * p.z + q.w * p.w) / (cx * q.x + cy * q.y + cz * q.z + cw * q.w);
        this._skyboxProjection.copyRowFrom(2, new Vector3D_1.Vector3D(cx * a, cy * a, cz * a, cw * a));
        //set constants
        if (shader.sceneMatrixIndex >= 0) {
            renderable.renderSceneTransform.copyRawDataTo(shader.vertexConstantData, shader.sceneMatrixIndex, true);
            this._skyboxProjection.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
        }
        else {
            this._skyboxProjection.copyRawDataTo(shader.vertexConstantData, shader.viewMatrixIndex, true);
        }
        var context = this._stage.context;
        context.setProgramConstantsFromArray(ContextGLProgramType_1.ContextGLProgramType.VERTEX, shader.vertexConstantData);
        context.setProgramConstantsFromArray(ContextGLProgramType_1.ContextGLProgramType.FRAGMENT, shader.fragmentConstantData);
        if (this._indices)
            this.getIndexBufferGL().draw(ContextGLDrawMode_1.ContextGLDrawMode.TRIANGLES, 0, this.numIndices);
        else
            this._stage.context.drawVertices(ContextGLDrawMode_1.ContextGLDrawMode.TRIANGLES, offset, count || this.numVertices);
    };
    GL_SkyboxElements.elementsType = "[elements Skybox]";
    return GL_SkyboxElements;
}(GL_TriangleElements_1.GL_TriangleElements));
exports.GL_SkyboxElements = GL_SkyboxElements;
