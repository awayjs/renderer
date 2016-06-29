"use strict";
var Image2D_1 = require("@awayjs/core/lib/image/Image2D");
var AbstractMethodError_1 = require("@awayjs/core/lib/errors/AbstractMethodError");
var AGALMiniAssembler_1 = require("@awayjs/stage/lib/aglsl/assembler/AGALMiniAssembler");
var ShaderRegisterCache_1 = require("../../shaders/ShaderRegisterCache");
var Filter3DTaskBase = (function () {
    function Filter3DTaskBase(requireDepthRender) {
        if (requireDepthRender === void 0) { requireDepthRender = false; }
        this._scaledTextureWidth = -1;
        this._scaledTextureHeight = -1;
        this._textureWidth = -1;
        this._textureHeight = -1;
        this._textureDimensionsInvalid = true;
        this._program3DInvalid = true;
        this._textureScale = 0;
        this._requireDepthRender = requireDepthRender;
        this._registerCache = new ShaderRegisterCache_1.ShaderRegisterCache("baseline");
    }
    ;
    Object.defineProperty(Filter3DTaskBase.prototype, "textureScale", {
        /**
         * The texture scale for the input of this texture. This will define the output of the previous entry in the chain
         */
        get: function () {
            return this._textureScale;
        },
        set: function (value) {
            if (this._textureScale == value)
                return;
            this._textureScale = value;
            this._scaledTextureWidth = this._textureWidth >> this._textureScale;
            this._scaledTextureHeight = this._textureHeight >> this._textureScale;
            this._textureDimensionsInvalid = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter3DTaskBase.prototype, "target", {
        get: function () {
            return this._target;
        },
        set: function (value) {
            this._target = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter3DTaskBase.prototype, "rttManager", {
        get: function () {
            return this._rttManager;
        },
        set: function (value) {
            if (this._rttManager == value)
                return;
            this._rttManager = value;
            this._textureDimensionsInvalid = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter3DTaskBase.prototype, "textureWidth", {
        get: function () {
            return this._textureWidth;
        },
        set: function (value) {
            if (this._textureWidth == value)
                return;
            this._textureWidth = value;
            this._scaledTextureWidth = this._textureWidth >> this._textureScale;
            this._textureDimensionsInvalid = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter3DTaskBase.prototype, "textureHeight", {
        get: function () {
            return this._textureHeight;
        },
        set: function (value) {
            if (this._textureHeight == value)
                return;
            this._textureHeight = value;
            this._scaledTextureHeight = this._textureHeight >> this._textureScale;
            this._textureDimensionsInvalid = true;
        },
        enumerable: true,
        configurable: true
    });
    Filter3DTaskBase.prototype.getMainInputTexture = function (stage) {
        if (this._textureDimensionsInvalid)
            this.updateTextures(stage);
        return this._mainInputTexture;
    };
    Filter3DTaskBase.prototype.dispose = function () {
        if (this._mainInputTexture)
            this._mainInputTexture.dispose();
        if (this._program3D)
            this._program3D.dispose();
    };
    Filter3DTaskBase.prototype.invalidateProgram = function () {
        this._program3DInvalid = true;
    };
    Filter3DTaskBase.prototype.updateProgram = function (stage) {
        if (this._program3D)
            this._program3D.dispose();
        this._program3D = stage.context.createProgram();
        this._registerCache.reset();
        var vertexByteCode = (new AGALMiniAssembler_1.AGALMiniAssembler().assemble("part vertex 1\n" + this.getVertexCode() + "endpart"))['vertex'].data;
        var fragmentByteCode = (new AGALMiniAssembler_1.AGALMiniAssembler().assemble("part fragment 1\n" + this.getFragmentCode() + "endpart"))['fragment'].data;
        this._program3D.upload(vertexByteCode, fragmentByteCode);
        this._program3DInvalid = false;
    };
    Filter3DTaskBase.prototype.getVertexCode = function () {
        var position = this._registerCache.getFreeVertexAttribute();
        this._positionIndex = position.index;
        var uv = this._registerCache.getFreeVertexAttribute();
        this._uvIndex = uv.index;
        this._uvVarying = this._registerCache.getFreeVarying();
        var code;
        code = "mov op, " + position + "\n" +
            "mov " + this._uvVarying + ", " + uv + "\n";
        return code;
    };
    Filter3DTaskBase.prototype.getFragmentCode = function () {
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    Filter3DTaskBase.prototype.updateTextures = function (stage) {
        if (this._mainInputTexture)
            this._mainInputTexture.dispose();
        this._mainInputTexture = new Image2D_1.Image2D(this._scaledTextureWidth, this._scaledTextureHeight);
        this._textureDimensionsInvalid = false;
    };
    Filter3DTaskBase.prototype.getProgram = function (stage) {
        if (this._program3DInvalid)
            this.updateProgram(stage);
        return this._program3D;
    };
    Filter3DTaskBase.prototype.activate = function (stage, camera, depthTexture) {
    };
    Filter3DTaskBase.prototype.deactivate = function (stage) {
    };
    Object.defineProperty(Filter3DTaskBase.prototype, "requireDepthRender", {
        get: function () {
            return this._requireDepthRender;
        },
        enumerable: true,
        configurable: true
    });
    return Filter3DTaskBase;
}());
exports.Filter3DTaskBase = Filter3DTaskBase;
