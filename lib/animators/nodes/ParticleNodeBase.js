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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvcGFydGljbGVub2RlYmFzZS50cyJdLCJuYW1lcyI6WyJQYXJ0aWNsZU5vZGVCYXNlIiwiUGFydGljbGVOb2RlQmFzZS5jb25zdHJ1Y3RvciIsIlBhcnRpY2xlTm9kZUJhc2UubW9kZSIsIlBhcnRpY2xlTm9kZUJhc2UucHJpb3JpdHkiLCJQYXJ0aWNsZU5vZGVCYXNlLmRhdGFMZW5ndGgiLCJQYXJ0aWNsZU5vZGVCYXNlLm9uZURhdGEiLCJQYXJ0aWNsZU5vZGVCYXNlLmdldEFHQUxWZXJ0ZXhDb2RlIiwiUGFydGljbGVOb2RlQmFzZS5nZXRBR0FMRnJhZ21lbnRDb2RlIiwiUGFydGljbGVOb2RlQmFzZS5nZXRBR0FMVVZDb2RlIiwiUGFydGljbGVOb2RlQmFzZS5faUdlbmVyYXRlUHJvcGVydHlPZk9uZVBhcnRpY2xlIiwiUGFydGljbGVOb2RlQmFzZS5faVByb2Nlc3NBbmltYXRpb25TZXR0aW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFPLGlCQUFpQixXQUFjLHNEQUFzRCxDQUFDLENBQUM7QUFROUYsQUFHQTs7R0FERztJQUNHLGdCQUFnQjtJQUFTQSxVQUF6QkEsZ0JBQWdCQSxVQUEwQkE7SUFrRS9DQTs7Ozs7OztPQU9HQTtJQUNIQSxTQTFFS0EsZ0JBQWdCQSxDQTBFVEEsSUFBV0EsRUFBRUEsSUFBSUEsQ0FBUUEsUUFBREEsQUFBU0EsRUFBRUEsVUFBVUEsQ0FBUUEsUUFBREEsQUFBU0EsRUFBRUEsUUFBMkJBO1FBQTNCQyx3QkFBMkJBLEdBQTNCQSxZQUEyQkE7UUFFckdBLGlCQUFPQSxDQUFDQTtRQXZFRkEsaUJBQVlBLEdBQW1CQSxDQUFDQSxDQUFDQTtRQXlFdkNBLElBQUlBLEdBQUdBLElBQUlBLEdBQUdBLGdCQUFnQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFFM0NBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO1FBQ2pCQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUNuQkEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDMUJBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLFVBQVVBLENBQUNBO1FBRS9CQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFTQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTtJQUN2REEsQ0FBQ0E7SUExRERELHNCQUFXQSxrQ0FBSUE7UUFMZkE7Ozs7V0FJR0E7YUFDSEE7WUFFQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDcEJBLENBQUNBOzs7T0FBQUY7SUFRREEsc0JBQVdBLHNDQUFRQTtRQU5uQkE7Ozs7O1dBS0dBO2FBQ0hBO1lBRUNHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBO1FBQ3ZCQSxDQUFDQTs7O09BQUFIO0lBUURBLHNCQUFXQSx3Q0FBVUE7UUFOckJBOzs7OztXQUtHQTthQUNIQTtZQUVDSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQTtRQUMxQkEsQ0FBQ0E7OztPQUFBSjtJQVFEQSxzQkFBV0EscUNBQU9BO1FBTmxCQTs7Ozs7V0FLR0E7YUFDSEE7WUFFQ0ssTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDdkJBLENBQUNBOzs7T0FBQUw7SUF3QkRBOztPQUVHQTtJQUNJQSw0Q0FBaUJBLEdBQXhCQSxVQUF5QkEsWUFBNkJBLEVBQUVBLHNCQUE2Q0E7UUFFcEdNLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBO0lBQ1hBLENBQUNBO0lBRUROOztPQUVHQTtJQUNJQSw4Q0FBbUJBLEdBQTFCQSxVQUEyQkEsWUFBNkJBLEVBQUVBLHNCQUE2Q0E7UUFFdEdPLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBO0lBQ1hBLENBQUNBO0lBRURQOztPQUVHQTtJQUNJQSx3Q0FBYUEsR0FBcEJBLFVBQXFCQSxZQUE2QkEsRUFBRUEsc0JBQTZDQTtRQUVoR1EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7SUFDWEEsQ0FBQ0E7SUFFRFI7Ozs7T0FJR0E7SUFDSUEsMERBQStCQSxHQUF0Q0EsVUFBdUNBLEtBQXdCQTtJQUcvRFMsQ0FBQ0E7SUFFRFQ7O09BRUdBO0lBQ0lBLG9EQUF5QkEsR0FBaENBLFVBQWlDQSxvQkFBeUNBO0lBRzFFVSxDQUFDQTtJQXRIRFYsYUFBYUE7SUFDRUEsdUJBQU1BLEdBQVVBLFFBQVFBLENBQUNBO0lBQ3pCQSw2QkFBWUEsR0FBVUEsYUFBYUEsQ0FBQ0E7SUFDcENBLDhCQUFhQSxHQUFVQSxjQUFjQSxDQUFDQTtJQUVyREEsWUFBWUE7SUFDR0Esc0JBQUtBLEdBQ3BCQTtRQUNDQSxDQUFDQSxFQUFDQSxnQkFBZ0JBLENBQUNBLE1BQU1BO1FBQ3pCQSxDQUFDQSxFQUFDQSxnQkFBZ0JBLENBQUNBLFlBQVlBO1FBQy9CQSxDQUFDQSxFQUFDQSxnQkFBZ0JBLENBQUNBLGFBQWFBO0tBQ2hDQSxDQUFDQTtJQTRHSEEsdUJBQUNBO0FBQURBLENBaklBLEFBaUlDQSxFQWpJOEIsaUJBQWlCLEVBaUkvQztBQUVELEFBQTBCLGlCQUFqQixnQkFBZ0IsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvbm9kZXMvUGFydGljbGVOb2RlQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQW5pbWF0aW9uTm9kZUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9hbmltYXRvcnMvbm9kZXMvQW5pbWF0aW9uTm9kZUJhc2VcIik7XG5cbmltcG9ydCBBbmltYXRpb25SZWdpc3RlckNhY2hlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL0FuaW1hdGlvblJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5cbmltcG9ydCBQYXJ0aWNsZUFuaW1hdGlvblNldFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9QYXJ0aWNsZUFuaW1hdGlvblNldFwiKTtcbmltcG9ydCBQYXJ0aWNsZVByb3BlcnRpZXNcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9QYXJ0aWNsZVByb3BlcnRpZXNcIik7XG5cbi8qKlxuICogUHJvdmlkZXMgYW4gYWJzdHJhY3QgYmFzZSBjbGFzcyBmb3IgcGFydGljbGUgYW5pbWF0aW9uIG5vZGVzLlxuICovXG5jbGFzcyBQYXJ0aWNsZU5vZGVCYXNlIGV4dGVuZHMgQW5pbWF0aW9uTm9kZUJhc2Vcbntcblx0cHJpdmF0ZSBfcHJpb3JpdHk6bnVtYmVyIC8qaW50Ki87XG5cblx0cHVibGljIF9wTW9kZTpudW1iZXIgLyp1aW50Ki87XG5cdHB1YmxpYyBfcERhdGFMZW5ndGg6bnVtYmVyIC8qdWludCovID0gMztcblx0cHVibGljIF9wT25lRGF0YTpBcnJheTxudW1iZXI+O1xuXG5cdHB1YmxpYyBfaURhdGFPZmZzZXQ6bnVtYmVyIC8qdWludCovO1xuXG5cdC8vbW9kZXMgYWxpYXNcblx0cHJpdmF0ZSBzdGF0aWMgR0xPQkFMOnN0cmluZyA9ICdHbG9iYWwnO1xuXHRwcml2YXRlIHN0YXRpYyBMT0NBTF9TVEFUSUM6c3RyaW5nID0gJ0xvY2FsU3RhdGljJztcblx0cHJpdmF0ZSBzdGF0aWMgTE9DQUxfRFlOQU1JQzpzdHJpbmcgPSAnTG9jYWxEeW5hbWljJztcblxuXHQvL21vZGVzIGxpc3Rcblx0cHJpdmF0ZSBzdGF0aWMgTU9ERVM6T2JqZWN0ID1cblx0e1xuXHRcdDA6UGFydGljbGVOb2RlQmFzZS5HTE9CQUwsXG5cdFx0MTpQYXJ0aWNsZU5vZGVCYXNlLkxPQ0FMX1NUQVRJQyxcblx0XHQyOlBhcnRpY2xlTm9kZUJhc2UuTE9DQUxfRFlOQU1JQ1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBwcm9wZXJ0eSBtb2RlIG9mIHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gbm9kZS4gVHlwaWNhbGx5IHNldCBpbiB0aGUgbm9kZSBjb25zdHJ1Y3RvclxuXHQgKlxuXHQgKiBAc2VlIGF3YXkuYW5pbWF0b3JzLlBhcnRpY2xlUHJvcGVydGllc01vZGVcblx0ICovXG5cdHB1YmxpYyBnZXQgbW9kZSgpOm51bWJlciAvKnVpbnQqL1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3BNb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHByaW9yaXR5IG9mIHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gbm9kZSwgdXNlZCB0byBvcmRlciB0aGUgYWdhbCBnZW5lcmF0ZWQgaW4gYSBwYXJ0aWNsZSBhbmltYXRpb24gc2V0LiBTZXQgYXV0b21hdGljYWxseSBvbiBpbnN0YW50aWF0aW9uLlxuXHQgKlxuXHQgKiBAc2VlIGF3YXkuYW5pbWF0b3JzLlBhcnRpY2xlQW5pbWF0aW9uU2V0XG5cdCAqIEBzZWUgI2dldEFHQUxWZXJ0ZXhDb2RlXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHByaW9yaXR5KCk6bnVtYmVyIC8qaW50Ki9cblx0e1xuXHRcdHJldHVybiB0aGlzLl9wcmlvcml0eTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBsZW5ndGggb2YgdGhlIGRhdGEgdXNlZCBieSB0aGUgbm9kZSB3aGVuIGluIDxjb2RlPkxPQ0FMX1NUQVRJQzwvY29kZT4gbW9kZS4gVXNlZCB0byBnZW5lcmF0ZSB0aGUgbG9jYWwgc3RhdGljIGRhdGEgb2YgdGhlIHBhcnRpY2xlIGFuaW1hdGlvbiBzZXQuXG5cdCAqXG5cdCAqIEBzZWUgYXdheS5hbmltYXRvcnMuUGFydGljbGVBbmltYXRpb25TZXRcblx0ICogQHNlZSAjZ2V0QUdBTFZlcnRleENvZGVcblx0ICovXG5cdHB1YmxpYyBnZXQgZGF0YUxlbmd0aCgpOm51bWJlciAvKmludCovXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcERhdGFMZW5ndGg7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgZ2VuZXJhdGVkIGRhdGEgdmVjdG9yIG9mIHRoZSBub2RlIGFmdGVyIG9uZSBwYXJ0aWNsZSBwYXNzIGR1cmluZyB0aGUgZ2VuZXJhdGlvbiBvZiBhbGwgbG9jYWwgc3RhdGljIGRhdGEgb2YgdGhlIHBhcnRpY2xlIGFuaW1hdGlvbiBzZXQuXG5cdCAqXG5cdCAqIEBzZWUgYXdheS5hbmltYXRvcnMuUGFydGljbGVBbmltYXRpb25TZXRcblx0ICogQHNlZSAjZ2VuZXJhdGVQcm9wZXJ0eU9mT25lUGFydGljbGVcblx0ICovXG5cdHB1YmxpYyBnZXQgb25lRGF0YSgpOkFycmF5PG51bWJlcj5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9wT25lRGF0YTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IDxjb2RlPlBhcnRpY2xlTm9kZUJhc2U8L2NvZGU+IG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtICAgICAgICAgICAgICAgbmFtZSAgICAgICAgICAgIERlZmluZXMgdGhlIGdlbmVyaWMgbmFtZSBvZiB0aGUgcGFydGljbGUgYW5pbWF0aW9uIG5vZGUuXG5cdCAqIEBwYXJhbSAgICAgICAgICAgICAgIG1vZGUgICAgICAgICAgICBEZWZpbmVzIHdoZXRoZXIgdGhlIG1vZGUgb2Ygb3BlcmF0aW9uIGFjdHMgb24gbG9jYWwgcHJvcGVydGllcyBvZiBhIHBhcnRpY2xlIG9yIGdsb2JhbCBwcm9wZXJ0aWVzIG9mIHRoZSBub2RlLlxuXHQgKiBAcGFyYW0gICAgICAgICAgICAgICBkYXRhTGVuZ3RoICAgICAgRGVmaW5lcyB0aGUgbGVuZ3RoIG9mIHRoZSBkYXRhIHVzZWQgYnkgdGhlIG5vZGUgd2hlbiBpbiA8Y29kZT5MT0NBTF9TVEFUSUM8L2NvZGU+IG1vZGUuXG5cdCAqIEBwYXJhbSAgICBbb3B0aW9uYWxdIHByaW9yaXR5ICAgICAgICB0aGUgcHJpb3JpdHkgb2YgdGhlIHBhcnRpY2xlIGFuaW1hdGlvbiBub2RlLCB1c2VkIHRvIG9yZGVyIHRoZSBhZ2FsIGdlbmVyYXRlZCBpbiBhIHBhcnRpY2xlIGFuaW1hdGlvbiBzZXQuIERlZmF1bHRzIHRvIDEuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihuYW1lOnN0cmluZywgbW9kZTpudW1iZXIgLyp1aW50Ki8sIGRhdGFMZW5ndGg6bnVtYmVyIC8qdWludCovLCBwcmlvcml0eTpudW1iZXIgLyppbnQqLyA9IDEpXG5cdHtcblx0XHRzdXBlcigpO1xuXG5cdFx0bmFtZSA9IG5hbWUgKyBQYXJ0aWNsZU5vZGVCYXNlLk1PREVTW21vZGVdO1xuXG5cdFx0dGhpcy5uYW1lID0gbmFtZTtcblx0XHR0aGlzLl9wTW9kZSA9IG1vZGU7XG5cdFx0dGhpcy5fcHJpb3JpdHkgPSBwcmlvcml0eTtcblx0XHR0aGlzLl9wRGF0YUxlbmd0aCA9IGRhdGFMZW5ndGg7XG5cblx0XHR0aGlzLl9wT25lRGF0YSA9IG5ldyBBcnJheTxudW1iZXI+KHRoaXMuX3BEYXRhTGVuZ3RoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBBR0FMIGNvZGUgb2YgdGhlIHBhcnRpY2xlIGFuaW1hdGlvbiBub2RlIGZvciB1c2UgaW4gdGhlIHZlcnRleCBzaGFkZXIuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0QUdBTFZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGU6QW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBBR0FMIGNvZGUgb2YgdGhlIHBhcnRpY2xlIGFuaW1hdGlvbiBub2RlIGZvciB1c2UgaW4gdGhlIGZyYWdtZW50IHNoYWRlci5cblx0ICovXG5cdHB1YmxpYyBnZXRBR0FMRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBhbmltYXRpb25SZWdpc3RlckNhY2hlOkFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgQUdBTCBjb2RlIG9mIHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gbm9kZSBmb3IgdXNlIGluIHRoZSBmcmFnbWVudCBzaGFkZXIgd2hlbiBVViBjb29yZGluYXRlcyBhcmUgcmVxdWlyZWQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0QUdBTFVWQ29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZTpBbmltYXRpb25SZWdpc3RlckNhY2hlKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cblx0LyoqXG5cdCAqIENhbGxlZCBpbnRlcm5hbGx5IGJ5IHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gc2V0IHdoZW4gYXNzaWduaW5nIHRoZSBzZXQgb2Ygc3RhdGljIHByb3BlcnRpZXMgb3JpZ2luYWxseSBkZWZpbmVkIGJ5IHRoZSBpbml0UGFydGljbGVGdW5jIG9mIHRoZSBzZXQuXG5cdCAqXG5cdCAqIEBzZWUgYXdheS5hbmltYXRvcnMuUGFydGljbGVBbmltYXRpb25TZXQjaW5pdFBhcnRpY2xlRnVuY1xuXHQgKi9cblx0cHVibGljIF9pR2VuZXJhdGVQcm9wZXJ0eU9mT25lUGFydGljbGUocGFyYW06UGFydGljbGVQcm9wZXJ0aWVzKVxuXHR7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxsZWQgaW50ZXJuYWxseSBieSB0aGUgcGFydGljbGUgYW5pbWF0aW9uIHNldCB3aGVuIGRldGVybWluaW5nIHRoZSByZXF1aXJlbWVudHMgb2YgdGhlIHBhcnRpY2xlIGFuaW1hdGlvbiBub2RlIEFHQUwuXG5cdCAqL1xuXHRwdWJsaWMgX2lQcm9jZXNzQW5pbWF0aW9uU2V0dGluZyhwYXJ0aWNsZUFuaW1hdGlvblNldDpQYXJ0aWNsZUFuaW1hdGlvblNldClcblx0e1xuXG5cdH1cbn1cblxuZXhwb3J0ID0gUGFydGljbGVOb2RlQmFzZTsiXX0=