"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractionBase_1 = require("@awayjs/core/lib/library/AbstractionBase");
var AbstractMethodError_1 = require("@awayjs/core/lib/errors/AbstractMethodError");
var AssetEvent_1 = require("@awayjs/core/lib/events/AssetEvent");
var ElementsEvent_1 = require("@awayjs/display/lib/events/ElementsEvent");
var ElementsUtils_1 = require("@awayjs/display/lib/utils/ElementsUtils");
/**
 *
 * @class away.pool.GL_ElementsBaseBase
 */
var GL_ElementsBase = (function (_super) {
    __extends(GL_ElementsBase, _super);
    function GL_ElementsBase(elements, stage) {
        var _this = this;
        _super.call(this, elements, stage);
        this.usages = 0;
        this._vertices = new Object();
        this._verticesUpdated = new Object();
        this._indexMappings = Array();
        this._numIndices = 0;
        this._elements = elements;
        this._stage = stage;
        this._onInvalidateIndicesDelegate = function (event) { return _this._onInvalidateIndices(event); };
        this._onClearIndicesDelegate = function (event) { return _this._onClearIndices(event); };
        this._onInvalidateVerticesDelegate = function (event) { return _this._onInvalidateVertices(event); };
        this._onClearVerticesDelegate = function (event) { return _this._onClearVertices(event); };
        this._elements.addEventListener(ElementsEvent_1.ElementsEvent.CLEAR_INDICES, this._onClearIndicesDelegate);
        this._elements.addEventListener(ElementsEvent_1.ElementsEvent.INVALIDATE_INDICES, this._onInvalidateIndicesDelegate);
        this._elements.addEventListener(ElementsEvent_1.ElementsEvent.CLEAR_VERTICES, this._onClearVerticesDelegate);
        this._elements.addEventListener(ElementsEvent_1.ElementsEvent.INVALIDATE_VERTICES, this._onInvalidateVerticesDelegate);
    }
    Object.defineProperty(GL_ElementsBase.prototype, "elementsType", {
        get: function () {
            throw new AbstractMethodError_1.AbstractMethodError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_ElementsBase.prototype, "elementsClass", {
        get: function () {
            throw new AbstractMethodError_1.AbstractMethodError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_ElementsBase.prototype, "elements", {
        get: function () {
            return this._elements;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_ElementsBase.prototype, "numIndices", {
        /**
         *
         */
        get: function () {
            return this._numIndices;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GL_ElementsBase.prototype, "numVertices", {
        /**
         *
         */
        get: function () {
            return this._numVertices;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    GL_ElementsBase.prototype.getIndexMappings = function () {
        if (!this._indicesUpdated)
            this._updateIndices();
        return this._indexMappings;
    };
    /**
     *
     */
    GL_ElementsBase.prototype.getIndexBufferGL = function () {
        if (!this._indicesUpdated)
            this._updateIndices();
        return this._indices;
    };
    /**
     *
     */
    GL_ElementsBase.prototype.getVertexBufferGL = function (attributesView) {
        //first check if indices need updating which may affect vertices
        if (!this._indicesUpdated)
            this._updateIndices();
        var bufferId = attributesView.attributesBuffer.id;
        if (!this._verticesUpdated[bufferId])
            this._updateVertices(attributesView);
        return this._vertices[bufferId];
    };
    /**
     *
     */
    GL_ElementsBase.prototype.activateVertexBufferVO = function (index, attributesView, dimensions, offset) {
        if (dimensions === void 0) { dimensions = 0; }
        if (offset === void 0) { offset = 0; }
        this.getVertexBufferGL(attributesView).activate(index, attributesView.size, dimensions || attributesView.dimensions, attributesView.offset + offset, attributesView.unsigned);
    };
    /**
     *
     */
    GL_ElementsBase.prototype.onClear = function (event) {
        _super.prototype.onClear.call(this, event);
        this._elements.removeEventListener(ElementsEvent_1.ElementsEvent.CLEAR_INDICES, this._onClearIndicesDelegate);
        this._elements.removeEventListener(ElementsEvent_1.ElementsEvent.INVALIDATE_INDICES, this._onInvalidateIndicesDelegate);
        this._elements.removeEventListener(ElementsEvent_1.ElementsEvent.CLEAR_VERTICES, this._onClearVerticesDelegate);
        this._elements.removeEventListener(ElementsEvent_1.ElementsEvent.INVALIDATE_VERTICES, this._onInvalidateVerticesDelegate);
        this._elements = null;
        if (this._overflow) {
            this._overflow.onClear(event);
            this._overflow = null;
        }
    };
    GL_ElementsBase.prototype._setRenderState = function (renderable, shader, camera, viewProjection) {
        if (!this._verticesUpdated)
            this._updateIndices();
        //TODO replace overflow system with something sensible
        //this._render(renderable, camera, viewProjection);
        //
        // if (this._overflow)
        // 	this._overflow._iRender(renderable, camera, viewProjection);
    };
    GL_ElementsBase.prototype.draw = function (renderable, shader, camera, viewProjection, count, offset) {
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    /**
     * //TODO
     *
     * @private
     */
    GL_ElementsBase.prototype._updateIndices = function (indexOffset) {
        if (indexOffset === void 0) { indexOffset = 0; }
        var indices = this._elements.indices;
        if (indices) {
            this._indices = this._stage.getAbstraction(ElementsUtils_1.ElementsUtils.getSubIndices(indices, this._elements.numVertices, this._indexMappings, indexOffset));
            this._numIndices = this._indices._attributesBuffer.count * indices.dimensions;
        }
        else {
            this._indices = null;
            this._numIndices = 0;
            this._indexMappings = Array();
        }
        indexOffset += this._numIndices;
        //check if there is more to split
        if (indices && indexOffset < indices.count * this._elements.indices.dimensions) {
            if (!this._overflow)
                this._overflow = this._pGetOverflowElements();
            this._overflow._updateIndices(indexOffset);
        }
        else if (this._overflow) {
            this._overflow.onClear(new AssetEvent_1.AssetEvent(AssetEvent_1.AssetEvent.CLEAR, this._elements));
            this._overflow = null;
        }
        this._indicesUpdated = true;
        //invalidate vertices if index mappings exist
        if (this._indexMappings.length)
            for (var key in this._verticesUpdated)
                this._verticesUpdated[key] = false;
    };
    /**
     * //TODO
     *
     * @param attributesView
     * @private
     */
    GL_ElementsBase.prototype._updateVertices = function (attributesView) {
        this._numVertices = this._elements.numVertices;
        var bufferId = attributesView.attributesBuffer.id;
        this._vertices[bufferId] = this._stage.getAbstraction(ElementsUtils_1.ElementsUtils.getSubVertices(attributesView.attributesBuffer, this._indexMappings));
        this._verticesUpdated[bufferId] = true;
    };
    /**
     * //TODO
     *
     * @param event
     * @private
     */
    GL_ElementsBase.prototype._onInvalidateIndices = function (event) {
        if (!event.attributesView)
            return;
        this._indicesUpdated = false;
    };
    /**
     * //TODO
     *
     * @param event
     * @private
     */
    GL_ElementsBase.prototype._onClearIndices = function (event) {
        if (!event.attributesView)
            return;
        this._indices.onClear(new AssetEvent_1.AssetEvent(AssetEvent_1.AssetEvent.CLEAR, event.attributesView));
        this._indices = null;
    };
    /**
     * //TODO
     *
     * @param event
     * @private
     */
    GL_ElementsBase.prototype._onInvalidateVertices = function (event) {
        if (!event.attributesView)
            return;
        var bufferId = event.attributesView.attributesBuffer.id;
        this._verticesUpdated[bufferId] = false;
    };
    /**
     * //TODO
     *
     * @param event
     * @private
     */
    GL_ElementsBase.prototype._onClearVertices = function (event) {
        if (!event.attributesView)
            return;
        var bufferId = event.attributesView.attributesBuffer.id;
        if (this._vertices[bufferId]) {
            this._vertices[bufferId].onClear(new AssetEvent_1.AssetEvent(AssetEvent_1.AssetEvent.CLEAR, event.attributesView));
            delete this._vertices[bufferId];
            delete this._verticesUpdated[bufferId];
        }
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
    GL_ElementsBase.prototype._pGetOverflowElements = function () {
        throw new AbstractMethodError_1.AbstractMethodError();
    };
    return GL_ElementsBase;
}(AbstractionBase_1.AbstractionBase));
exports.GL_ElementsBase = GL_ElementsBase;
