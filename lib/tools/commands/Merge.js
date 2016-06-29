"use strict";
var AttributesBuffer_1 = require("@awayjs/core/lib/attributes/AttributesBuffer");
var Matrix3DUtils_1 = require("@awayjs/core/lib/geom/Matrix3DUtils");
var TriangleElements_1 = require("@awayjs/display/lib/graphics/TriangleElements");
var Sprite_1 = require("@awayjs/display/lib/display/Sprite");
/**
 *  Class Merge merges two or more static sprites into one.<code>Merge</code>
 */
var Merge = (function () {
    /**
     * @param    keepMaterial    [optional]    Determines if the merged object uses the recevier sprite material information or keeps its source material(s). Defaults to false.
     * If false and receiver object has multiple materials, the last material found in receiver subsprites is applied to the merged subsprite(es).
     * @param    disposeSources  [optional]    Determines if the sprite and geometry source(s) used for the merging are disposed. Defaults to false.
     * If true, only receiver geometry and resulting sprite are kept in  memory.
     * @param    objectSpace     [optional]    Determines if source sprite(es) is/are merged using objectSpace or worldspace. Defaults to false.
     */
    function Merge(keepMaterial, disposeSources, objectSpace) {
        if (keepMaterial === void 0) { keepMaterial = false; }
        if (disposeSources === void 0) { disposeSources = false; }
        if (objectSpace === void 0) { objectSpace = false; }
        this._keepMaterial = keepMaterial;
        this._disposeSources = disposeSources;
        this._objectSpace = objectSpace;
    }
    Object.defineProperty(Merge.prototype, "disposeSources", {
        get: function () {
            return this._disposeSources;
        },
        /**
         * Determines if the sprite and geometry source(s) used for the merging are disposed. Defaults to false.
         */
        set: function (b) {
            this._disposeSources = b;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Merge.prototype, "keepMaterial", {
        get: function () {
            return this._keepMaterial;
        },
        /**
         * Determines if the material source(s) used for the merging are disposed. Defaults to false.
         */
        set: function (b) {
            this._keepMaterial = b;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Merge.prototype, "objectSpace", {
        get: function () {
            return this._objectSpace;
        },
        /**
         * Determines if source sprite(es) is/are merged using objectSpace or worldspace. Defaults to false.
         */
        set: function (b) {
            this._objectSpace = b;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Merges all the children of a container into a single Sprite. If no Sprite object is found, method returns the receiver without modification.
     *
     * @param    receiver           The Sprite to receive the merged contents of the container.
     * @param    objectContainer    The DisplayObjectContainer holding the sprites to be mergd.
     *
     * @return The merged Sprite instance.
     */
    Merge.prototype.applyToContainer = function (receiver, objectContainer) {
        this.reset();
        //collect container sprites
        this.parseContainer(receiver, objectContainer);
        //collect receiver
        this.collect(receiver, false);
        //merge to receiver
        this.merge(receiver, this._disposeSources);
    };
    /**
     * Merges all the sprites found in the Array&lt;Sprite&gt; into a single Sprite.
     *
     * @param    receiver    The Sprite to receive the merged contents of the sprites.
     * @param    sprites      A series of Sprites to be merged with the reciever sprite.
     */
    Merge.prototype.applyToSprites = function (receiver, sprites) {
        this.reset();
        if (!sprites.length)
            return;
        //collect sprites in vector
        for (var i = 0; i < sprites.length; i++)
            if (sprites[i] != receiver)
                this.collect(sprites[i], this._disposeSources);
        //collect receiver
        this.collect(receiver, false);
        //merge to receiver
        this.merge(receiver, this._disposeSources);
    };
    /**
     *  Merges 2 sprites into one. It is recommand to use apply when 2 sprites are to be merged. If more need to be merged, use either applyToSprites or applyToContainer methods.
     *
     * @param    receiver    The Sprite to receive the merged contents of both sprites.
     * @param    sprite        The Sprite to be merged with the receiver sprite
     */
    Merge.prototype.apply = function (receiver, sprite) {
        this.reset();
        //collect sprite
        this.collect(sprite, this._disposeSources);
        //collect receiver
        this.collect(receiver, false);
        //merge to receiver
        this.merge(receiver, this._disposeSources);
    };
    Merge.prototype.reset = function () {
        this._toDispose = new Array();
        this._graphicVOs = new Array();
    };
    Merge.prototype.merge = function (destSprite, dispose) {
        var i;
        //var oldGraphics:Graphics;
        var destGraphics;
        var useSubMaterials;
        //oldGraphics = destSprite.graphics.clone();
        destGraphics = destSprite.graphics;
        // Only apply materials directly to sub-sprites if necessary,
        // i.e. if there is more than one material available.
        useSubMaterials = (this._graphicVOs.length > 1);
        for (i = 0; i < this._graphicVOs.length; i++) {
            var elements = new TriangleElements_1.TriangleElements(new AttributesBuffer_1.AttributesBuffer());
            elements.autoDeriveNormals = false;
            elements.autoDeriveTangents = false;
            var data = this._graphicVOs[i];
            elements.setIndices(data.indices);
            elements.setPositions(data.vertices);
            elements.setNormals(data.normals);
            elements.setTangents(data.tangents);
            elements.setUVs(data.uvs);
            if (this._keepMaterial && useSubMaterials)
                destGraphics.addGraphic(elements, data.material);
            else
                destGraphics.addGraphic(elements);
        }
        if (this._keepMaterial && !useSubMaterials && this._graphicVOs.length)
            destSprite.material = this._graphicVOs[0].material;
        if (dispose) {
            var len = this._toDispose.length;
            for (var i; i < len; i++)
                this._toDispose[i].dispose();
        }
        this._toDispose = null;
    };
    Merge.prototype.collect = function (sprite, dispose) {
        var subIdx;
        var calc;
        for (subIdx = 0; subIdx < sprite.graphics.count; subIdx++) {
            var i;
            var len;
            var iIdx, vIdx, nIdx, tIdx, uIdx;
            var indexOffset;
            var elements;
            var vo;
            var vertices;
            var normals;
            var tangents;
            var ind;
            elements = sprite.graphics.getGraphicAt(subIdx).elements;
            // Get (or create) a VO for this material
            vo = this.getGraphicData(sprite.graphics.getGraphicAt(subIdx).material);
            // Vertices and normals are copied to temporary vectors, to be transformed
            // before concatenated onto those of the data. This is unnecessary if no
            // transformation will be performed, i.e. for object space merging.
            vertices = (this._objectSpace) ? vo.vertices : new Array();
            normals = (this._objectSpace) ? vo.normals : new Array();
            tangents = (this._objectSpace) ? vo.tangents : new Array();
            // Copy over vertex attributes
            vIdx = vertices.length;
            nIdx = normals.length;
            tIdx = tangents.length;
            uIdx = vo.uvs.length;
            this.copyAttributes(elements.positions, vertices, elements.numVertices, vIdx);
            this.copyAttributes(elements.normals, normals, elements.numVertices, nIdx);
            this.copyAttributes(elements.tangents, tangents, elements.numVertices, tIdx);
            this.copyAttributes(elements.uvs, vo.uvs, elements.numVertices, uIdx);
            // Copy over triangle indices
            indexOffset = (!this._objectSpace) ? vo.vertices.length / 3 : 0;
            iIdx = vo.indices.length;
            len = elements.numElements;
            ind = elements.indices.get(len);
            for (i = 0; i < len; i++) {
                calc = i * 3;
                vo.indices[iIdx++] = ind[calc] + indexOffset;
                vo.indices[iIdx++] = ind[calc + 1] + indexOffset;
                vo.indices[iIdx++] = ind[calc + 2] + indexOffset;
            }
            if (!this._objectSpace) {
                sprite.sceneTransform.transformVectors(vertices, vertices);
                Matrix3DUtils_1.Matrix3DUtils.deltaTransformVectors(sprite.sceneTransform, normals, normals);
                Matrix3DUtils_1.Matrix3DUtils.deltaTransformVectors(sprite.sceneTransform, tangents, tangents);
                // Copy vertex data from temporary (transformed) vectors
                vIdx = vo.vertices.length;
                nIdx = vo.normals.length;
                tIdx = vo.tangents.length;
                len = vertices.length;
                for (i = 0; i < len; i++) {
                    vo.vertices[vIdx++] = vertices[i];
                    vo.normals[nIdx++] = normals[i];
                    vo.tangents[tIdx++] = tangents[i];
                }
            }
        }
        if (dispose)
            this._toDispose.push(sprite);
    };
    Merge.prototype.copyAttributes = function (attributes, array, count, startIndex) {
        var vertices = attributes.get(count);
        var dim = attributes.dimensions;
        var stride = attributes.stride;
        var len = count * stride;
        for (var i = 0; i < len; i += stride)
            for (var j = 0; j < dim; j++)
                array[startIndex++] = vertices[i + j];
    };
    Merge.prototype.getGraphicData = function (material) {
        var data;
        if (this._keepMaterial) {
            var i;
            var len;
            len = this._graphicVOs.length;
            for (i = 0; i < len; i++) {
                if (this._graphicVOs[i].material == material) {
                    data = this._graphicVOs[i];
                    break;
                }
            }
        }
        else if (this._graphicVOs.length) {
            // If materials are not to be kept, all data can be
            // put into a single VO, so return that one.
            data = this._graphicVOs[0];
        }
        // No data (for this material) found, create new.
        if (!data) {
            data = new GraphicVO();
            data.vertices = new Array();
            data.normals = new Array();
            data.tangents = new Array();
            data.uvs = new Array();
            data.indices = new Array();
            data.material = material;
            this._graphicVOs.push(data);
        }
        return data;
    };
    Merge.prototype.parseContainer = function (receiver, object) {
        var child;
        var i;
        if (object instanceof Sprite_1.Sprite && object != receiver)
            this.collect(object, this._disposeSources);
        for (i = 0; i < object.numChildren; ++i) {
            child = object.getChildAt(i);
            this.parseContainer(receiver, child);
        }
    };
    return Merge;
}());
exports.Merge = Merge;
var GraphicVO = (function () {
    function GraphicVO() {
    }
    return GraphicVO;
}());
exports.GraphicVO = GraphicVO;
