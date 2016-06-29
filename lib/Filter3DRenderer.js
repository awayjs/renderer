"use strict";
var ContextGLDrawMode_1 = require("@awayjs/stage/lib/base/ContextGLDrawMode");
var ContextGLBlendFactor_1 = require("@awayjs/stage/lib/base/ContextGLBlendFactor");
var ContextGLVertexBufferFormat_1 = require("@awayjs/stage/lib/base/ContextGLVertexBufferFormat");
var RTTEvent_1 = require("./events/RTTEvent");
var RTTBufferManager_1 = require("./managers/RTTBufferManager");
/**
 * @class away.render.Filter3DRenderer
 */
var Filter3DRenderer = (function () {
    function Filter3DRenderer(stage) {
        var _this = this;
        this._filterSizesInvalid = true;
        this._onRTTResizeDelegate = function (event) { return _this.onRTTResize(event); };
        this._stage = stage;
        this._rttManager = RTTBufferManager_1.RTTBufferManager.getInstance(stage);
        this._rttManager.addEventListener(RTTEvent_1.RTTEvent.RESIZE, this._onRTTResizeDelegate);
    }
    Filter3DRenderer.prototype.onRTTResize = function (event) {
        this._filterSizesInvalid = true;
    };
    Object.defineProperty(Filter3DRenderer.prototype, "requireDepthRender", {
        get: function () {
            return this._requireDepthRender;
        },
        enumerable: true,
        configurable: true
    });
    Filter3DRenderer.prototype.getMainInputTexture = function (stage) {
        if (this._filterTasksInvalid)
            this.updateFilterTasks(stage);
        return this._mainInputTexture;
    };
    Object.defineProperty(Filter3DRenderer.prototype, "filters", {
        get: function () {
            return this._filters;
        },
        set: function (value) {
            this._filters = value;
            this._filterTasksInvalid = true;
            this._requireDepthRender = false;
            if (!this._filters)
                return;
            for (var i = 0; i < this._filters.length; ++i)
                if (this._filters[i].requireDepthRender)
                    this._requireDepthRender = true;
            this._filterSizesInvalid = true;
        },
        enumerable: true,
        configurable: true
    });
    Filter3DRenderer.prototype.updateFilterTasks = function (stage) {
        var len;
        if (this._filterSizesInvalid)
            this.updateFilterSizes();
        if (!this._filters) {
            this._tasks = null;
            return;
        }
        this._tasks = new Array();
        len = this._filters.length - 1;
        var filter;
        for (var i = 0; i <= len; ++i) {
            // make sure all internal tasks are linked together
            filter = this._filters[i];
            filter.setRenderTargets(i == len ? null : this._filters[i + 1].getMainInputTexture(stage), stage);
            this._tasks = this._tasks.concat(filter.tasks);
        }
        this._mainInputTexture = this._filters[0].getMainInputTexture(stage);
    };
    Filter3DRenderer.prototype.render = function (stage, camera, depthTexture) {
        var len;
        var i;
        var task;
        var context = stage.context;
        var indexBuffer = this._rttManager.indexBuffer;
        var vertexBuffer = this._rttManager.renderToTextureVertexBuffer;
        if (!this._filters)
            return;
        if (this._filterSizesInvalid)
            this.updateFilterSizes();
        if (this._filterTasksInvalid)
            this.updateFilterTasks(stage);
        len = this._filters.length;
        for (i = 0; i < len; ++i)
            this._filters[i].update(stage, camera);
        len = this._tasks.length;
        if (len > 1) {
            context.setProgram(this._tasks[0].getProgram(stage));
            context.setVertexBufferAt(this._tasks[0]._positionIndex, vertexBuffer, 0, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_2);
            context.setVertexBufferAt(this._tasks[0]._uvIndex, vertexBuffer, 8, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_2);
        }
        for (i = 0; i < len; ++i) {
            task = this._tasks[i];
            stage.setRenderTarget(task.target);
            context.setProgram(task.getProgram(stage));
            stage.getAbstraction(task.getMainInputTexture(stage)).activate(task._inputTextureIndex, false);
            if (!task.target) {
                stage.scissorRect = null;
                vertexBuffer = this._rttManager.renderToScreenVertexBuffer;
                context.setVertexBufferAt(task._positionIndex, vertexBuffer, 0, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_2);
                context.setVertexBufferAt(task._uvIndex, vertexBuffer, 8, ContextGLVertexBufferFormat_1.ContextGLVertexBufferFormat.FLOAT_2);
            }
            context.clear(0.0, 0.0, 0.0, 0.0);
            task.activate(stage, camera, depthTexture);
            context.setBlendFactors(ContextGLBlendFactor_1.ContextGLBlendFactor.ONE, ContextGLBlendFactor_1.ContextGLBlendFactor.ZERO);
            context.drawIndices(ContextGLDrawMode_1.ContextGLDrawMode.TRIANGLES, indexBuffer, 0, 6);
            task.deactivate(stage);
        }
        context.setTextureAt(0, null);
        context.setVertexBufferAt(0, null);
        context.setVertexBufferAt(1, null);
    };
    Filter3DRenderer.prototype.updateFilterSizes = function () {
        for (var i = 0; i < this._filters.length; ++i) {
            this._filters[i].textureWidth = this._rttManager.textureWidth;
            this._filters[i].textureHeight = this._rttManager.textureHeight;
            this._filters[i].rttManager = this._rttManager;
        }
        this._filterSizesInvalid = true;
    };
    Filter3DRenderer.prototype.dispose = function () {
        this._rttManager.removeEventListener(RTTEvent_1.RTTEvent.RESIZE, this._onRTTResizeDelegate);
        this._rttManager = null;
        this._stage = null;
    };
    return Filter3DRenderer;
}());
exports.Filter3DRenderer = Filter3DRenderer;
