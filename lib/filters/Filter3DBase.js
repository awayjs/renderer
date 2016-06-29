"use strict";
var Filter3DBase = (function () {
    function Filter3DBase() {
        this._tasks = new Array();
    }
    Object.defineProperty(Filter3DBase.prototype, "requireDepthRender", {
        get: function () {
            return this._requireDepthRender;
        },
        enumerable: true,
        configurable: true
    });
    Filter3DBase.prototype.addTask = function (filter) {
        this._tasks.push(filter);
        if (this._requireDepthRender == null)
            this._requireDepthRender = filter.requireDepthRender;
    };
    Object.defineProperty(Filter3DBase.prototype, "tasks", {
        get: function () {
            return this._tasks;
        },
        enumerable: true,
        configurable: true
    });
    Filter3DBase.prototype.getMainInputTexture = function (stage) {
        return this._tasks[0].getMainInputTexture(stage);
    };
    Object.defineProperty(Filter3DBase.prototype, "textureWidth", {
        get: function () {
            return this._textureWidth;
        },
        set: function (value) {
            this._textureWidth = value;
            for (var i = 0; i < this._tasks.length; ++i)
                this._tasks[i].textureWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter3DBase.prototype, "rttManager", {
        get: function () {
            return this._rttManager;
        },
        set: function (value) {
            this._rttManager = value;
            for (var i = 0; i < this._tasks.length; ++i)
                this._tasks[i].rttManager = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter3DBase.prototype, "textureHeight", {
        get: function () {
            return this._textureHeight;
        },
        set: function (value) {
            this._textureHeight = value;
            for (var i = 0; i < this._tasks.length; ++i)
                this._tasks[i].textureHeight = value;
        },
        enumerable: true,
        configurable: true
    });
    // link up the filters correctly with the next filter
    Filter3DBase.prototype.setRenderTargets = function (mainTarget, stage) {
        this._tasks[this._tasks.length - 1].target = mainTarget;
    };
    Filter3DBase.prototype.dispose = function () {
        for (var i = 0; i < this._tasks.length; ++i)
            this._tasks[i].dispose();
    };
    Filter3DBase.prototype.update = function (stage, camera) {
    };
    return Filter3DBase;
}());
exports.Filter3DBase = Filter3DBase;
