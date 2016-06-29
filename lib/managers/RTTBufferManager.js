"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Rectangle_1 = require("@awayjs/core/lib/geom/Rectangle");
var EventDispatcher_1 = require("@awayjs/core/lib/events/EventDispatcher");
var ImageUtils_1 = require("@awayjs/core/lib/utils/ImageUtils");
var RTTEvent_1 = require("../events/RTTEvent");
var RTTBufferManager = (function (_super) {
    __extends(RTTBufferManager, _super);
    function RTTBufferManager(stage) {
        _super.call(this);
        this._viewWidth = -1;
        this._viewHeight = -1;
        this._textureWidth = -1;
        this._textureHeight = -1;
        this._buffersInvalid = true;
        this._renderToTextureRect = new Rectangle_1.Rectangle();
        this._stage = stage;
    }
    RTTBufferManager.getInstance = function (stage) {
        if (!stage)
            throw new Error("stage key cannot be null!");
        if (RTTBufferManager._instances == null)
            RTTBufferManager._instances = new Array();
        var rttBufferManager = RTTBufferManager.getRTTBufferManagerFromStage(stage);
        if (rttBufferManager == null) {
            rttBufferManager = new RTTBufferManager(stage);
            var vo = new RTTBufferManagerVO();
            vo.stage3d = stage;
            vo.rttbfm = rttBufferManager;
            RTTBufferManager._instances.push(vo);
        }
        return rttBufferManager;
    };
    RTTBufferManager.getRTTBufferManagerFromStage = function (stage) {
        var l = RTTBufferManager._instances.length;
        var r;
        for (var c = 0; c < l; c++) {
            r = RTTBufferManager._instances[c];
            if (r.stage3d === stage)
                return r.rttbfm;
        }
        return null;
    };
    RTTBufferManager.deleteRTTBufferManager = function (stage) {
        var l = RTTBufferManager._instances.length;
        var r;
        for (var c = 0; c < l; c++) {
            r = RTTBufferManager._instances[c];
            if (r.stage3d === stage) {
                RTTBufferManager._instances.splice(c, 1);
                return;
            }
        }
    };
    Object.defineProperty(RTTBufferManager.prototype, "textureRatioX", {
        get: function () {
            if (this._buffersInvalid)
                this.updateRTTBuffers();
            return this._textureRatioX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RTTBufferManager.prototype, "textureRatioY", {
        get: function () {
            if (this._buffersInvalid)
                this.updateRTTBuffers();
            return this._textureRatioY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RTTBufferManager.prototype, "viewWidth", {
        get: function () {
            return this._viewWidth;
        },
        set: function (value) {
            if (value == this._viewWidth)
                return;
            this._viewWidth = value;
            this._buffersInvalid = true;
            this._textureWidth = ImageUtils_1.ImageUtils.getBestPowerOf2(this._viewWidth);
            if (this._textureWidth > this._viewWidth) {
                this._renderToTextureRect.x = Math.floor((this._textureWidth - this._viewWidth) * .5);
                this._renderToTextureRect.width = this._viewWidth;
            }
            else {
                this._renderToTextureRect.x = 0;
                this._renderToTextureRect.width = this._textureWidth;
            }
            this.dispatchEvent(new RTTEvent_1.RTTEvent(RTTEvent_1.RTTEvent.RESIZE, this));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RTTBufferManager.prototype, "viewHeight", {
        get: function () {
            return this._viewHeight;
        },
        set: function (value) {
            if (value == this._viewHeight)
                return;
            this._viewHeight = value;
            this._buffersInvalid = true;
            this._textureHeight = ImageUtils_1.ImageUtils.getBestPowerOf2(this._viewHeight);
            if (this._textureHeight > this._viewHeight) {
                this._renderToTextureRect.y = Math.floor((this._textureHeight - this._viewHeight) * .5);
                this._renderToTextureRect.height = this._viewHeight;
            }
            else {
                this._renderToTextureRect.y = 0;
                this._renderToTextureRect.height = this._textureHeight;
            }
            this.dispatchEvent(new RTTEvent_1.RTTEvent(RTTEvent_1.RTTEvent.RESIZE, this));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RTTBufferManager.prototype, "renderToTextureVertexBuffer", {
        get: function () {
            if (this._buffersInvalid)
                this.updateRTTBuffers();
            return this._renderToTextureVertexBuffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RTTBufferManager.prototype, "renderToScreenVertexBuffer", {
        get: function () {
            if (this._buffersInvalid)
                this.updateRTTBuffers();
            return this._renderToScreenVertexBuffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RTTBufferManager.prototype, "indexBuffer", {
        get: function () {
            return this._indexBuffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RTTBufferManager.prototype, "renderToTextureRect", {
        get: function () {
            if (this._buffersInvalid)
                this.updateRTTBuffers();
            return this._renderToTextureRect;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RTTBufferManager.prototype, "textureWidth", {
        get: function () {
            return this._textureWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RTTBufferManager.prototype, "textureHeight", {
        get: function () {
            return this._textureHeight;
        },
        enumerable: true,
        configurable: true
    });
    RTTBufferManager.prototype.dispose = function () {
        RTTBufferManager.deleteRTTBufferManager(this._stage);
        if (this._indexBuffer) {
            this._indexBuffer.dispose();
            this._renderToScreenVertexBuffer.dispose();
            this._renderToTextureVertexBuffer.dispose();
            this._renderToScreenVertexBuffer = null;
            this._renderToTextureVertexBuffer = null;
            this._indexBuffer = null;
        }
    };
    // todo: place all this in a separate model, since it's used all over the place
    // maybe it even has a place in the core (together with screenRect etc)?
    // needs to be stored per view of course
    RTTBufferManager.prototype.updateRTTBuffers = function () {
        var context = this._stage.context;
        var textureVerts;
        var screenVerts;
        var x;
        var y;
        if (this._renderToTextureVertexBuffer == null)
            this._renderToTextureVertexBuffer = context.createVertexBuffer(4, 20);
        if (this._renderToScreenVertexBuffer == null)
            this._renderToScreenVertexBuffer = context.createVertexBuffer(4, 20);
        if (!this._indexBuffer) {
            this._indexBuffer = context.createIndexBuffer(6);
            this._indexBuffer.uploadFromArray([2, 1, 0, 3, 2, 0], 0, 6);
        }
        this._textureRatioX = x = Math.min(this._viewWidth / this._textureWidth, 1);
        this._textureRatioY = y = Math.min(this._viewHeight / this._textureHeight, 1);
        var u1 = (1 - x) * .5;
        var u2 = (x + 1) * .5;
        var v1 = (1 - y) * .5;
        var v2 = (y + 1) * .5;
        // last element contains indices for data per vertex that can be passed to the vertex shader if necessary (ie: frustum corners for deferred rendering)
        textureVerts = [-x, -y, u1, v1, 0, x, -y, u2, v1, 1, x, y, u2, v2, 2, -x, y, u1, v2, 3];
        screenVerts = [-1, -1, u1, v1, 0, 1, -1, u2, v1, 1, 1, 1, u2, v2, 2, -1, 1, u1, v2, 3];
        this._renderToTextureVertexBuffer.uploadFromArray(textureVerts, 0, 4);
        this._renderToScreenVertexBuffer.uploadFromArray(screenVerts, 0, 4);
        this._buffersInvalid = false;
    };
    return RTTBufferManager;
}(EventDispatcher_1.EventDispatcher));
exports.RTTBufferManager = RTTBufferManager;
var RTTBufferManagerVO = (function () {
    function RTTBufferManagerVO() {
    }
    return RTTBufferManagerVO;
}());
