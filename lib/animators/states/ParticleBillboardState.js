"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MathConsts_1 = require("@awayjs/core/lib/geom/MathConsts");
var Matrix3D_1 = require("@awayjs/core/lib/geom/Matrix3D");
var Orientation3D_1 = require("@awayjs/core/lib/geom/Orientation3D");
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleBillboardState = (function (_super) {
    __extends(ParticleBillboardState, _super);
    /**
     *
     */
    function ParticleBillboardState(animator, particleNode) {
        _super.call(this, animator, particleNode);
        this._matrix = new Matrix3D_1.Matrix3D;
        this._billboardAxis = particleNode._iBillboardAxis;
    }
    ParticleBillboardState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        var comps;
        if (this._billboardAxis) {
            var pos = renderable.sourceEntity.sceneTransform.position;
            var look = camera.sceneTransform.position.subtract(pos);
            var right = look.crossProduct(this._billboardAxis);
            right.normalize();
            look = this.billboardAxis.crossProduct(right);
            look.normalize();
            //create a quick inverse projection matrix
            this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
            comps = this._matrix.decompose(Orientation3D_1.Orientation3D.AXIS_ANGLE);
            this._matrix.copyColumnFrom(0, right);
            this._matrix.copyColumnFrom(1, this.billboardAxis);
            this._matrix.copyColumnFrom(2, look);
            this._matrix.copyColumnFrom(3, pos);
            this._matrix.appendRotation(-comps[1].w * MathConsts_1.MathConsts.RADIANS_TO_DEGREES, comps[1]);
        }
        else {
            //create a quick inverse projection matrix
            this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
            this._matrix.append(camera.inverseSceneTransform);
            //decompose using axis angle rotations
            comps = this._matrix.decompose(Orientation3D_1.Orientation3D.AXIS_ANGLE);
            //recreate the matrix with just the rotation data
            this._matrix.identity();
            this._matrix.appendRotation(-comps[1].w * MathConsts_1.MathConsts.RADIANS_TO_DEGREES, comps[1]);
        }
        //set a new matrix transform constant
        shader.setVertexConstFromMatrix(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleBillboardState.MATRIX_INDEX), this._matrix);
    };
    Object.defineProperty(ParticleBillboardState.prototype, "billboardAxis", {
        /**
         * Defines the billboard axis.
         */
        get: function () {
            return this.billboardAxis;
        },
        set: function (value) {
            this.billboardAxis = value ? value.clone() : null;
            if (this.billboardAxis)
                this.billboardAxis.normalize();
        },
        enumerable: true,
        configurable: true
    });
    /** @private */
    ParticleBillboardState.MATRIX_INDEX = 0;
    return ParticleBillboardState;
}(ParticleStateBase_1.ParticleStateBase));
exports.ParticleBillboardState = ParticleBillboardState;
