var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
/**
 * Provides an abstract base class for particle animation nodes.
 */
var ParticleNodeBase = (function (_super) {
    __extends(ParticleNodeBase, _super);
    /**
     * Creates a new <code>ParticleNodeBase</code> object.
     *
     * @param               name            Defines the generic name of the particle animation node.
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param               dataLength      Defines the length of the data used by the node when in <code>LOCAL_STATIC</code> mode.
     * @param    [optional] priority        the priority of the particle animation node, used to order the agal generated in a particle animation set. Defaults to 1.
     */
    function ParticleNodeBase(name, mode /*uint*/, dataLength /*uint*/, priority) {
        if (priority === void 0) { priority = 1; }
        _super.call(this);
        this._pDataLength = 3;
        name = name + ParticleNodeBase.MODES[mode];
        this.name = name;
        this._pMode = mode;
        this._priority = priority;
        this._pDataLength = dataLength;
        this._pOneData = new Array(this._pDataLength);
    }
    Object.defineProperty(ParticleNodeBase.prototype, "mode", {
        /**
         * Returns the property mode of the particle animation node. Typically set in the node constructor
         *
         * @see away.animators.ParticlePropertiesMode
         */
        get: function () {
            return this._pMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleNodeBase.prototype, "priority", {
        /**
         * Returns the priority of the particle animation node, used to order the agal generated in a particle animation set. Set automatically on instantiation.
         *
         * @see away.animators.ParticleAnimationSet
         * @see #getAGALVertexCode
         */
        get: function () {
            return this._priority;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleNodeBase.prototype, "dataLength", {
        /**
         * Returns the length of the data used by the node when in <code>LOCAL_STATIC</code> mode. Used to generate the local static data of the particle animation set.
         *
         * @see away.animators.ParticleAnimationSet
         * @see #getAGALVertexCode
         */
        get: function () {
            return this._pDataLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleNodeBase.prototype, "oneData", {
        /**
         * Returns the generated data vector of the node after one particle pass during the generation of all local static data of the particle animation set.
         *
         * @see away.animators.ParticleAnimationSet
         * @see #generatePropertyOfOneParticle
         */
        get: function () {
            return this._pOneData;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns the AGAL code of the particle animation node for use in the vertex shader.
     */
    ParticleNodeBase.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
        return "";
    };
    /**
     * Returns the AGAL code of the particle animation node for use in the fragment shader.
     */
    ParticleNodeBase.prototype.getAGALFragmentCode = function (shaderObject, animationRegisterCache) {
        return "";
    };
    /**
     * Returns the AGAL code of the particle animation node for use in the fragment shader when UV coordinates are required.
     */
    ParticleNodeBase.prototype.getAGALUVCode = function (shaderObject, animationRegisterCache) {
        return "";
    };
    /**
     * Called internally by the particle animation set when assigning the set of static properties originally defined by the initParticleFunc of the set.
     *
     * @see away.animators.ParticleAnimationSet#initParticleFunc
     */
    ParticleNodeBase.prototype._iGeneratePropertyOfOneParticle = function (param) {
    };
    /**
     * Called internally by the particle animation set when determining the requirements of the particle animation node AGAL.
     */
    ParticleNodeBase.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
    };
    //modes alias
    ParticleNodeBase.GLOBAL = 'Global';
    ParticleNodeBase.LOCAL_STATIC = 'LocalStatic';
    ParticleNodeBase.LOCAL_DYNAMIC = 'LocalDynamic';
    //modes list
    ParticleNodeBase.MODES = {
        0: ParticleNodeBase.GLOBAL,
        1: ParticleNodeBase.LOCAL_STATIC,
        2: ParticleNodeBase.LOCAL_DYNAMIC
    };
    return ParticleNodeBase;
})(AnimationNodeBase);
module.exports = ParticleNodeBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvUGFydGljbGVOb2RlQmFzZS50cyJdLCJuYW1lcyI6WyJQYXJ0aWNsZU5vZGVCYXNlIiwiUGFydGljbGVOb2RlQmFzZS5jb25zdHJ1Y3RvciIsIlBhcnRpY2xlTm9kZUJhc2UubW9kZSIsIlBhcnRpY2xlTm9kZUJhc2UucHJpb3JpdHkiLCJQYXJ0aWNsZU5vZGVCYXNlLmRhdGFMZW5ndGgiLCJQYXJ0aWNsZU5vZGVCYXNlLm9uZURhdGEiLCJQYXJ0aWNsZU5vZGVCYXNlLmdldEFHQUxWZXJ0ZXhDb2RlIiwiUGFydGljbGVOb2RlQmFzZS5nZXRBR0FMRnJhZ21lbnRDb2RlIiwiUGFydGljbGVOb2RlQmFzZS5nZXRBR0FMVVZDb2RlIiwiUGFydGljbGVOb2RlQmFzZS5faUdlbmVyYXRlUHJvcGVydHlPZk9uZVBhcnRpY2xlIiwiUGFydGljbGVOb2RlQmFzZS5faVByb2Nlc3NBbmltYXRpb25TZXR0aW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFPLGlCQUFpQixXQUFjLHNEQUFzRCxDQUFDLENBQUM7QUFROUYsQUFHQTs7R0FERztJQUNHLGdCQUFnQjtJQUFTQSxVQUF6QkEsZ0JBQWdCQSxVQUEwQkE7SUFrRS9DQTs7Ozs7OztPQU9HQTtJQUNIQSxTQTFFS0EsZ0JBQWdCQSxDQTBFVEEsSUFBV0EsRUFBRUEsSUFBSUEsQ0FBUUEsUUFBREEsQUFBU0EsRUFBRUEsVUFBVUEsQ0FBUUEsUUFBREEsQUFBU0EsRUFBRUEsUUFBMkJBO1FBQTNCQyx3QkFBMkJBLEdBQTNCQSxZQUEyQkE7UUFFckdBLGlCQUFPQSxDQUFDQTtRQXZFRkEsaUJBQVlBLEdBQW1CQSxDQUFDQSxDQUFDQTtRQXlFdkNBLElBQUlBLEdBQUdBLElBQUlBLEdBQUdBLGdCQUFnQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFFM0NBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO1FBQ2pCQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUNuQkEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDMUJBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLFVBQVVBLENBQUNBO1FBRS9CQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFTQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTtJQUN2REEsQ0FBQ0E7SUExRERELHNCQUFXQSxrQ0FBSUE7UUFMZkE7Ozs7V0FJR0E7YUFDSEE7WUFFQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDcEJBLENBQUNBOzs7T0FBQUY7SUFRREEsc0JBQVdBLHNDQUFRQTtRQU5uQkE7Ozs7O1dBS0dBO2FBQ0hBO1lBRUNHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBO1FBQ3ZCQSxDQUFDQTs7O09BQUFIO0lBUURBLHNCQUFXQSx3Q0FBVUE7UUFOckJBOzs7OztXQUtHQTthQUNIQTtZQUVDSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQTtRQUMxQkEsQ0FBQ0E7OztPQUFBSjtJQVFEQSxzQkFBV0EscUNBQU9BO1FBTmxCQTs7Ozs7V0FLR0E7YUFDSEE7WUFFQ0ssTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDdkJBLENBQUNBOzs7T0FBQUw7SUF3QkRBOztPQUVHQTtJQUNJQSw0Q0FBaUJBLEdBQXhCQSxVQUF5QkEsWUFBNkJBLEVBQUVBLHNCQUE2Q0E7UUFFcEdNLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBO0lBQ1hBLENBQUNBO0lBRUROOztPQUVHQTtJQUNJQSw4Q0FBbUJBLEdBQTFCQSxVQUEyQkEsWUFBNkJBLEVBQUVBLHNCQUE2Q0E7UUFFdEdPLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBO0lBQ1hBLENBQUNBO0lBRURQOztPQUVHQTtJQUNJQSx3Q0FBYUEsR0FBcEJBLFVBQXFCQSxZQUE2QkEsRUFBRUEsc0JBQTZDQTtRQUVoR1EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7SUFDWEEsQ0FBQ0E7SUFFRFI7Ozs7T0FJR0E7SUFDSUEsMERBQStCQSxHQUF0Q0EsVUFBdUNBLEtBQXdCQTtJQUcvRFMsQ0FBQ0E7SUFFRFQ7O09BRUdBO0lBQ0lBLG9EQUF5QkEsR0FBaENBLFVBQWlDQSxvQkFBeUNBO0lBRzFFVSxDQUFDQTtJQXRIRFYsYUFBYUE7SUFDRUEsdUJBQU1BLEdBQVVBLFFBQVFBLENBQUNBO0lBQ3pCQSw2QkFBWUEsR0FBVUEsYUFBYUEsQ0FBQ0E7SUFDcENBLDhCQUFhQSxHQUFVQSxjQUFjQSxDQUFDQTtJQUVyREEsWUFBWUE7SUFDR0Esc0JBQUtBLEdBQ3BCQTtRQUNDQSxDQUFDQSxFQUFDQSxnQkFBZ0JBLENBQUNBLE1BQU1BO1FBQ3pCQSxDQUFDQSxFQUFDQSxnQkFBZ0JBLENBQUNBLFlBQVlBO1FBQy9CQSxDQUFDQSxFQUFDQSxnQkFBZ0JBLENBQUNBLGFBQWFBO0tBQ2hDQSxDQUFDQTtJQTRHSEEsdUJBQUNBO0FBQURBLENBaklBLEFBaUlDQSxFQWpJOEIsaUJBQWlCLEVBaUkvQztBQUVELEFBQTBCLGlCQUFqQixnQkFBZ0IsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvbm9kZXMvUGFydGljbGVOb2RlQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQW5pbWF0aW9uTm9kZUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9hbmltYXRvcnMvbm9kZXMvQW5pbWF0aW9uTm9kZUJhc2VcIik7XHJcblxyXG5pbXBvcnQgQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9BbmltYXRpb25SZWdpc3RlckNhY2hlXCIpO1xyXG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcclxuXHJcbmltcG9ydCBQYXJ0aWNsZUFuaW1hdGlvblNldFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9QYXJ0aWNsZUFuaW1hdGlvblNldFwiKTtcclxuaW1wb3J0IFBhcnRpY2xlUHJvcGVydGllc1x0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1BhcnRpY2xlUHJvcGVydGllc1wiKTtcclxuXHJcbi8qKlxyXG4gKiBQcm92aWRlcyBhbiBhYnN0cmFjdCBiYXNlIGNsYXNzIGZvciBwYXJ0aWNsZSBhbmltYXRpb24gbm9kZXMuXHJcbiAqL1xyXG5jbGFzcyBQYXJ0aWNsZU5vZGVCYXNlIGV4dGVuZHMgQW5pbWF0aW9uTm9kZUJhc2Vcclxue1xyXG5cdHByaXZhdGUgX3ByaW9yaXR5Om51bWJlciAvKmludCovO1xyXG5cclxuXHRwdWJsaWMgX3BNb2RlOm51bWJlciAvKnVpbnQqLztcclxuXHRwdWJsaWMgX3BEYXRhTGVuZ3RoOm51bWJlciAvKnVpbnQqLyA9IDM7XHJcblx0cHVibGljIF9wT25lRGF0YTpBcnJheTxudW1iZXI+O1xyXG5cclxuXHRwdWJsaWMgX2lEYXRhT2Zmc2V0Om51bWJlciAvKnVpbnQqLztcclxuXHJcblx0Ly9tb2RlcyBhbGlhc1xyXG5cdHByaXZhdGUgc3RhdGljIEdMT0JBTDpzdHJpbmcgPSAnR2xvYmFsJztcclxuXHRwcml2YXRlIHN0YXRpYyBMT0NBTF9TVEFUSUM6c3RyaW5nID0gJ0xvY2FsU3RhdGljJztcclxuXHRwcml2YXRlIHN0YXRpYyBMT0NBTF9EWU5BTUlDOnN0cmluZyA9ICdMb2NhbER5bmFtaWMnO1xyXG5cclxuXHQvL21vZGVzIGxpc3RcclxuXHRwcml2YXRlIHN0YXRpYyBNT0RFUzpPYmplY3QgPVxyXG5cdHtcclxuXHRcdDA6UGFydGljbGVOb2RlQmFzZS5HTE9CQUwsXHJcblx0XHQxOlBhcnRpY2xlTm9kZUJhc2UuTE9DQUxfU1RBVElDLFxyXG5cdFx0MjpQYXJ0aWNsZU5vZGVCYXNlLkxPQ0FMX0RZTkFNSUNcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBSZXR1cm5zIHRoZSBwcm9wZXJ0eSBtb2RlIG9mIHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gbm9kZS4gVHlwaWNhbGx5IHNldCBpbiB0aGUgbm9kZSBjb25zdHJ1Y3RvclxyXG5cdCAqXHJcblx0ICogQHNlZSBhd2F5LmFuaW1hdG9ycy5QYXJ0aWNsZVByb3BlcnRpZXNNb2RlXHJcblx0ICovXHJcblx0cHVibGljIGdldCBtb2RlKCk6bnVtYmVyIC8qdWludCovXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3BNb2RlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmV0dXJucyB0aGUgcHJpb3JpdHkgb2YgdGhlIHBhcnRpY2xlIGFuaW1hdGlvbiBub2RlLCB1c2VkIHRvIG9yZGVyIHRoZSBhZ2FsIGdlbmVyYXRlZCBpbiBhIHBhcnRpY2xlIGFuaW1hdGlvbiBzZXQuIFNldCBhdXRvbWF0aWNhbGx5IG9uIGluc3RhbnRpYXRpb24uXHJcblx0ICpcclxuXHQgKiBAc2VlIGF3YXkuYW5pbWF0b3JzLlBhcnRpY2xlQW5pbWF0aW9uU2V0XHJcblx0ICogQHNlZSAjZ2V0QUdBTFZlcnRleENvZGVcclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IHByaW9yaXR5KCk6bnVtYmVyIC8qaW50Ki9cclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fcHJpb3JpdHk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBSZXR1cm5zIHRoZSBsZW5ndGggb2YgdGhlIGRhdGEgdXNlZCBieSB0aGUgbm9kZSB3aGVuIGluIDxjb2RlPkxPQ0FMX1NUQVRJQzwvY29kZT4gbW9kZS4gVXNlZCB0byBnZW5lcmF0ZSB0aGUgbG9jYWwgc3RhdGljIGRhdGEgb2YgdGhlIHBhcnRpY2xlIGFuaW1hdGlvbiBzZXQuXHJcblx0ICpcclxuXHQgKiBAc2VlIGF3YXkuYW5pbWF0b3JzLlBhcnRpY2xlQW5pbWF0aW9uU2V0XHJcblx0ICogQHNlZSAjZ2V0QUdBTFZlcnRleENvZGVcclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGRhdGFMZW5ndGgoKTpudW1iZXIgLyppbnQqL1xyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9wRGF0YUxlbmd0aDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJldHVybnMgdGhlIGdlbmVyYXRlZCBkYXRhIHZlY3RvciBvZiB0aGUgbm9kZSBhZnRlciBvbmUgcGFydGljbGUgcGFzcyBkdXJpbmcgdGhlIGdlbmVyYXRpb24gb2YgYWxsIGxvY2FsIHN0YXRpYyBkYXRhIG9mIHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gc2V0LlxyXG5cdCAqXHJcblx0ICogQHNlZSBhd2F5LmFuaW1hdG9ycy5QYXJ0aWNsZUFuaW1hdGlvblNldFxyXG5cdCAqIEBzZWUgI2dlbmVyYXRlUHJvcGVydHlPZk9uZVBhcnRpY2xlXHJcblx0ICovXHJcblx0cHVibGljIGdldCBvbmVEYXRhKCk6QXJyYXk8bnVtYmVyPlxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9wT25lRGF0YTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZXMgYSBuZXcgPGNvZGU+UGFydGljbGVOb2RlQmFzZTwvY29kZT4gb2JqZWN0LlxyXG5cdCAqXHJcblx0ICogQHBhcmFtICAgICAgICAgICAgICAgbmFtZSAgICAgICAgICAgIERlZmluZXMgdGhlIGdlbmVyaWMgbmFtZSBvZiB0aGUgcGFydGljbGUgYW5pbWF0aW9uIG5vZGUuXHJcblx0ICogQHBhcmFtICAgICAgICAgICAgICAgbW9kZSAgICAgICAgICAgIERlZmluZXMgd2hldGhlciB0aGUgbW9kZSBvZiBvcGVyYXRpb24gYWN0cyBvbiBsb2NhbCBwcm9wZXJ0aWVzIG9mIGEgcGFydGljbGUgb3IgZ2xvYmFsIHByb3BlcnRpZXMgb2YgdGhlIG5vZGUuXHJcblx0ICogQHBhcmFtICAgICAgICAgICAgICAgZGF0YUxlbmd0aCAgICAgIERlZmluZXMgdGhlIGxlbmd0aCBvZiB0aGUgZGF0YSB1c2VkIGJ5IHRoZSBub2RlIHdoZW4gaW4gPGNvZGU+TE9DQUxfU1RBVElDPC9jb2RlPiBtb2RlLlxyXG5cdCAqIEBwYXJhbSAgICBbb3B0aW9uYWxdIHByaW9yaXR5ICAgICAgICB0aGUgcHJpb3JpdHkgb2YgdGhlIHBhcnRpY2xlIGFuaW1hdGlvbiBub2RlLCB1c2VkIHRvIG9yZGVyIHRoZSBhZ2FsIGdlbmVyYXRlZCBpbiBhIHBhcnRpY2xlIGFuaW1hdGlvbiBzZXQuIERlZmF1bHRzIHRvIDEuXHJcblx0ICovXHJcblx0Y29uc3RydWN0b3IobmFtZTpzdHJpbmcsIG1vZGU6bnVtYmVyIC8qdWludCovLCBkYXRhTGVuZ3RoOm51bWJlciAvKnVpbnQqLywgcHJpb3JpdHk6bnVtYmVyIC8qaW50Ki8gPSAxKVxyXG5cdHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdFx0bmFtZSA9IG5hbWUgKyBQYXJ0aWNsZU5vZGVCYXNlLk1PREVTW21vZGVdO1xyXG5cclxuXHRcdHRoaXMubmFtZSA9IG5hbWU7XHJcblx0XHR0aGlzLl9wTW9kZSA9IG1vZGU7XHJcblx0XHR0aGlzLl9wcmlvcml0eSA9IHByaW9yaXR5O1xyXG5cdFx0dGhpcy5fcERhdGFMZW5ndGggPSBkYXRhTGVuZ3RoO1xyXG5cclxuXHRcdHRoaXMuX3BPbmVEYXRhID0gbmV3IEFycmF5PG51bWJlcj4odGhpcy5fcERhdGFMZW5ndGgpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmV0dXJucyB0aGUgQUdBTCBjb2RlIG9mIHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gbm9kZSBmb3IgdXNlIGluIHRoZSB2ZXJ0ZXggc2hhZGVyLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXRBR0FMVmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZTpBbmltYXRpb25SZWdpc3RlckNhY2hlKTpzdHJpbmdcclxuXHR7XHJcblx0XHRyZXR1cm4gXCJcIjtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJldHVybnMgdGhlIEFHQUwgY29kZSBvZiB0aGUgcGFydGljbGUgYW5pbWF0aW9uIG5vZGUgZm9yIHVzZSBpbiB0aGUgZnJhZ21lbnQgc2hhZGVyLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXRBR0FMRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBhbmltYXRpb25SZWdpc3RlckNhY2hlOkFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHJldHVybiBcIlwiO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmV0dXJucyB0aGUgQUdBTCBjb2RlIG9mIHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gbm9kZSBmb3IgdXNlIGluIHRoZSBmcmFnbWVudCBzaGFkZXIgd2hlbiBVViBjb29yZGluYXRlcyBhcmUgcmVxdWlyZWQuXHJcblx0ICovXHJcblx0cHVibGljIGdldEFHQUxVVkNvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGU6QW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSk6c3RyaW5nXHJcblx0e1xyXG5cdFx0cmV0dXJuIFwiXCI7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBDYWxsZWQgaW50ZXJuYWxseSBieSB0aGUgcGFydGljbGUgYW5pbWF0aW9uIHNldCB3aGVuIGFzc2lnbmluZyB0aGUgc2V0IG9mIHN0YXRpYyBwcm9wZXJ0aWVzIG9yaWdpbmFsbHkgZGVmaW5lZCBieSB0aGUgaW5pdFBhcnRpY2xlRnVuYyBvZiB0aGUgc2V0LlxyXG5cdCAqXHJcblx0ICogQHNlZSBhd2F5LmFuaW1hdG9ycy5QYXJ0aWNsZUFuaW1hdGlvblNldCNpbml0UGFydGljbGVGdW5jXHJcblx0ICovXHJcblx0cHVibGljIF9pR2VuZXJhdGVQcm9wZXJ0eU9mT25lUGFydGljbGUocGFyYW06UGFydGljbGVQcm9wZXJ0aWVzKVxyXG5cdHtcclxuXHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBDYWxsZWQgaW50ZXJuYWxseSBieSB0aGUgcGFydGljbGUgYW5pbWF0aW9uIHNldCB3aGVuIGRldGVybWluaW5nIHRoZSByZXF1aXJlbWVudHMgb2YgdGhlIHBhcnRpY2xlIGFuaW1hdGlvbiBub2RlIEFHQUwuXHJcblx0ICovXHJcblx0cHVibGljIF9pUHJvY2Vzc0FuaW1hdGlvblNldHRpbmcocGFydGljbGVBbmltYXRpb25TZXQ6UGFydGljbGVBbmltYXRpb25TZXQpXHJcblx0e1xyXG5cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCA9IFBhcnRpY2xlTm9kZUJhc2U7Il19