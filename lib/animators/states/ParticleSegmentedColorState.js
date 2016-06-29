"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ParticleStateBase_1 = require("../../animators/states/ParticleStateBase");
/**
 *
 */
var ParticleSegmentedColorState = (function (_super) {
    __extends(ParticleSegmentedColorState, _super);
    function ParticleSegmentedColorState(animator, particleSegmentedColorNode) {
        _super.call(this, animator, particleSegmentedColorNode);
        this._usesMultiplier = particleSegmentedColorNode._iUsesMultiplier;
        this._usesOffset = particleSegmentedColorNode._iUsesOffset;
        this._startColor = particleSegmentedColorNode._iStartColor;
        this._endColor = particleSegmentedColorNode._iEndColor;
        this._segmentPoints = particleSegmentedColorNode._iSegmentPoints;
        this._numSegmentPoint = particleSegmentedColorNode._iNumSegmentPoint;
        this.updateColorData();
    }
    Object.defineProperty(ParticleSegmentedColorState.prototype, "startColor", {
        /**
         * Defines the start color transform of the state, when in global mode.
         */
        get: function () {
            return this._startColor;
        },
        set: function (value) {
            this._startColor = value;
            this.updateColorData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSegmentedColorState.prototype, "endColor", {
        /**
         * Defines the end color transform of the state, when in global mode.
         */
        get: function () {
            return this._endColor;
        },
        set: function (value) {
            this._endColor = value;
            this.updateColorData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSegmentedColorState.prototype, "numSegmentPoint", {
        /**
         * Defines the number of segments.
         */
        get: function () {
            return this._numSegmentPoint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSegmentedColorState.prototype, "segmentPoints", {
        /**
         * Defines the key points of color
         */
        get: function () {
            return this._segmentPoints;
        },
        set: function (value) {
            this._segmentPoints = value;
            this.updateColorData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSegmentedColorState.prototype, "usesMultiplier", {
        get: function () {
            return this._usesMultiplier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleSegmentedColorState.prototype, "usesOffset", {
        get: function () {
            return this._usesOffset;
        },
        enumerable: true,
        configurable: true
    });
    ParticleSegmentedColorState.prototype.setRenderState = function (shader, renderable, animationElements, animationRegisterData, camera, stage) {
        if (shader.usesFragmentAnimation) {
            if (this._numSegmentPoint > 0)
                shader.setVertexConst(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleSegmentedColorState.TIME_DATA_INDEX), this._timeLifeData[0], this._timeLifeData[1], this._timeLifeData[2], this._timeLifeData[3]);
            if (this._usesMultiplier)
                shader.setVertexConstFromArray(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleSegmentedColorState.START_MULTIPLIER_INDEX), this._multiplierData);
            if (this._usesOffset)
                shader.setVertexConstFromArray(animationRegisterData.getRegisterIndex(this._pAnimationNode, ParticleSegmentedColorState.START_OFFSET_INDEX), this._offsetData);
        }
    };
    ParticleSegmentedColorState.prototype.updateColorData = function () {
        this._timeLifeData = new Float32Array(4);
        this._multiplierData = new Float32Array(4 * (this._numSegmentPoint + 1));
        this._offsetData = new Float32Array(4 * (this._numSegmentPoint + 1));
        //cut off the time data
        var i;
        var j = 0;
        var count = this._numSegmentPoint > 3 ? 3 : this._numSegmentPoint;
        for (i = 0; i < count; i++) {
            if (i == 0)
                this._timeLifeData[j++] = this._segmentPoints[i].life;
            else
                this._timeLifeData[j++] = this._segmentPoints[i].life - this._segmentPoints[i - 1].life;
        }
        i = count;
        if (this._numSegmentPoint == 0)
            this._timeLifeData[j++] = 1;
        else
            this._timeLifeData[j++] = 1 - this._segmentPoints[i - 1].life;
        if (this._usesMultiplier) {
            j = 0;
            this._multiplierData[j++] = this._startColor.redMultiplier;
            this._multiplierData[j++] = this._startColor.greenMultiplier;
            this._multiplierData[j++] = this._startColor.blueMultiplier;
            this._multiplierData[j++] = this._startColor.alphaMultiplier;
            for (i = 0; i < this._numSegmentPoint; i++) {
                if (i == 0) {
                    this._multiplierData[j++] = (this._segmentPoints[i].color.redMultiplier - this._startColor.redMultiplier) / this._timeLifeData[i];
                    this._multiplierData[j++] = (this._segmentPoints[i].color.greenMultiplier - this._startColor.greenMultiplier) / this._timeLifeData[i];
                    this._multiplierData[j++] = (this._segmentPoints[i].color.blueMultiplier - this._startColor.blueMultiplier) / this._timeLifeData[i];
                    this._multiplierData[j++] = (this._segmentPoints[i].color.alphaMultiplier - this._startColor.alphaMultiplier) / this._timeLifeData[i];
                }
                else {
                    this._multiplierData[j++] = (this._segmentPoints[i].color.redMultiplier - this._segmentPoints[i - 1].color.redMultiplier) / this._timeLifeData[i];
                    this._multiplierData[j++] = (this._segmentPoints[i].color.greenMultiplier - this._segmentPoints[i - 1].color.greenMultiplier) / this._timeLifeData[i];
                    this._multiplierData[j++] = (this._segmentPoints[i].color.blueMultiplier - this._segmentPoints[i - 1].color.blueMultiplier) / this._timeLifeData[i];
                    this._multiplierData[j++] = (this._segmentPoints[i].color.alphaMultiplier - this._segmentPoints[i - 1].color.alphaMultiplier) / this._timeLifeData[i];
                }
            }
            i = this._numSegmentPoint;
            if (this._numSegmentPoint == 0) {
                this._multiplierData[j++] = this._endColor.redMultiplier - this._startColor.redMultiplier;
                this._multiplierData[j++] = this._endColor.greenMultiplier - this._startColor.greenMultiplier;
                this._multiplierData[j++] = this._endColor.blueMultiplier - this._startColor.blueMultiplier;
                this._multiplierData[j++] = this._endColor.alphaMultiplier - this._startColor.alphaMultiplier;
            }
            else {
                this._multiplierData[j++] = (this._endColor.redMultiplier - this._segmentPoints[i - 1].color.redMultiplier) / this._timeLifeData[i];
                this._multiplierData[j++] = (this._endColor.greenMultiplier - this._segmentPoints[i - 1].color.greenMultiplier) / this._timeLifeData[i];
                this._multiplierData[j++] = (this._endColor.blueMultiplier - this._segmentPoints[i - 1].color.blueMultiplier) / this._timeLifeData[i];
                this._multiplierData[j++] = (this._endColor.alphaMultiplier - this._segmentPoints[i - 1].color.alphaMultiplier) / this._timeLifeData[i];
            }
        }
        if (this._usesOffset) {
            j = 0;
            this._offsetData[j++] = this._startColor.redOffset / 255;
            this._offsetData[j++] = this._startColor.greenOffset / 255;
            this._offsetData[j++] = this._startColor.blueOffset / 255;
            this._offsetData[j++] = this._startColor.alphaOffset / 255;
            for (i = 0; i < this._numSegmentPoint; i++) {
                if (i == 0) {
                    this._offsetData[j++] = (this._segmentPoints[i].color.redOffset - this._startColor.redOffset) / this._timeLifeData[i] / 255;
                    this._offsetData[j++] = (this._segmentPoints[i].color.greenOffset - this._startColor.greenOffset) / this._timeLifeData[i] / 255;
                    this._offsetData[j++] = (this._segmentPoints[i].color.blueOffset - this._startColor.blueOffset) / this._timeLifeData[i] / 255;
                    this._offsetData[j++] = (this._segmentPoints[i].color.alphaOffset - this._startColor.alphaOffset) / this._timeLifeData[i] / 255;
                }
                else {
                    this._offsetData[j++] = (this._segmentPoints[i].color.redOffset - this._segmentPoints[i - 1].color.redOffset) / this._timeLifeData[i] / 255;
                    this._offsetData[j++] = (this._segmentPoints[i].color.greenOffset - this._segmentPoints[i - 1].color.greenOffset) / this._timeLifeData[i] / 255;
                    this._offsetData[j++] = (this._segmentPoints[i].color.blueOffset - this._segmentPoints[i - 1].color.blueOffset) / this._timeLifeData[i] / 255;
                    this._offsetData[j++] = (this._segmentPoints[i].color.alphaOffset - this._segmentPoints[i - 1].color.alphaOffset) / this._timeLifeData[i] / 255;
                }
            }
            i = this._numSegmentPoint;
            if (this._numSegmentPoint == 0) {
                this._offsetData[j++] = (this._endColor.redOffset - this._startColor.redOffset) / 255;
                this._offsetData[j++] = (this._endColor.greenOffset - this._startColor.greenOffset) / 255;
                this._offsetData[j++] = (this._endColor.blueOffset - this._startColor.blueOffset) / 255;
                this._offsetData[j++] = (this._endColor.alphaOffset - this._startColor.alphaOffset) / 255;
            }
            else {
                this._offsetData[i] = (this._endColor.redOffset - this._segmentPoints[i - 1].color.redOffset) / this._timeLifeData[i] / 255;
                this._offsetData[j++] = (this._endColor.greenOffset - this._segmentPoints[i - 1].color.greenOffset) / this._timeLifeData[i] / 255;
                this._offsetData[j++] = (this._endColor.blueOffset - this._segmentPoints[i - 1].color.blueOffset) / this._timeLifeData[i] / 255;
                this._offsetData[j++] = (this._endColor.alphaOffset - this._segmentPoints[i - 1].color.alphaOffset) / this._timeLifeData[i] / 255;
            }
        }
    };
    /** @private */
    ParticleSegmentedColorState.START_MULTIPLIER_INDEX = 0;
    /** @private */
    ParticleSegmentedColorState.START_OFFSET_INDEX = 1;
    /** @private */
    ParticleSegmentedColorState.TIME_DATA_INDEX = 2;
    return ParticleSegmentedColorState;
}(ParticleStateBase_1.ParticleStateBase));
exports.ParticleSegmentedColorState = ParticleSegmentedColorState;
