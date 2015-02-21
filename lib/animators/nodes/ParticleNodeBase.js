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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvUGFydGljbGVOb2RlQmFzZS50cyJdLCJuYW1lcyI6WyJQYXJ0aWNsZU5vZGVCYXNlIiwiUGFydGljbGVOb2RlQmFzZS5jb25zdHJ1Y3RvciIsIlBhcnRpY2xlTm9kZUJhc2UubW9kZSIsIlBhcnRpY2xlTm9kZUJhc2UucHJpb3JpdHkiLCJQYXJ0aWNsZU5vZGVCYXNlLmRhdGFMZW5ndGgiLCJQYXJ0aWNsZU5vZGVCYXNlLm9uZURhdGEiLCJQYXJ0aWNsZU5vZGVCYXNlLmdldEFHQUxWZXJ0ZXhDb2RlIiwiUGFydGljbGVOb2RlQmFzZS5nZXRBR0FMRnJhZ21lbnRDb2RlIiwiUGFydGljbGVOb2RlQmFzZS5nZXRBR0FMVVZDb2RlIiwiUGFydGljbGVOb2RlQmFzZS5faUdlbmVyYXRlUHJvcGVydHlPZk9uZVBhcnRpY2xlIiwiUGFydGljbGVOb2RlQmFzZS5faVByb2Nlc3NBbmltYXRpb25TZXR0aW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFPLGlCQUFpQixXQUFjLHNEQUFzRCxDQUFDLENBQUM7QUFROUYsQUFHQTs7R0FERztJQUNHLGdCQUFnQjtJQUFTQSxVQUF6QkEsZ0JBQWdCQSxVQUEwQkE7SUFrRS9DQTs7Ozs7OztPQU9HQTtJQUNIQSxTQTFFS0EsZ0JBQWdCQSxDQTBFVEEsSUFBV0EsRUFBRUEsSUFBSUEsQ0FBUUEsUUFBREEsQUFBU0EsRUFBRUEsVUFBVUEsQ0FBUUEsUUFBREEsQUFBU0EsRUFBRUEsUUFBMkJBO1FBQTNCQyx3QkFBMkJBLEdBQTNCQSxZQUEyQkE7UUFFckdBLGlCQUFPQSxDQUFDQTtRQXZFRkEsaUJBQVlBLEdBQW1CQSxDQUFDQSxDQUFDQTtRQXlFdkNBLElBQUlBLEdBQUdBLElBQUlBLEdBQUdBLGdCQUFnQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFFM0NBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO1FBQ2pCQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUNuQkEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDMUJBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLFVBQVVBLENBQUNBO1FBRS9CQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFTQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTtJQUN2REEsQ0FBQ0E7SUExRERELHNCQUFXQSxrQ0FBSUE7UUFMZkE7Ozs7V0FJR0E7YUFDSEE7WUFFQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDcEJBLENBQUNBOzs7T0FBQUY7SUFRREEsc0JBQVdBLHNDQUFRQTtRQU5uQkE7Ozs7O1dBS0dBO2FBQ0hBO1lBRUNHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBO1FBQ3ZCQSxDQUFDQTs7O09BQUFIO0lBUURBLHNCQUFXQSx3Q0FBVUE7UUFOckJBOzs7OztXQUtHQTthQUNIQTtZQUVDSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQTtRQUMxQkEsQ0FBQ0E7OztPQUFBSjtJQVFEQSxzQkFBV0EscUNBQU9BO1FBTmxCQTs7Ozs7V0FLR0E7YUFDSEE7WUFFQ0ssTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDdkJBLENBQUNBOzs7T0FBQUw7SUF3QkRBOztPQUVHQTtJQUNJQSw0Q0FBaUJBLEdBQXhCQSxVQUF5QkEsWUFBNkJBLEVBQUVBLHNCQUE2Q0E7UUFFcEdNLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBO0lBQ1hBLENBQUNBO0lBRUROOztPQUVHQTtJQUNJQSw4Q0FBbUJBLEdBQTFCQSxVQUEyQkEsWUFBNkJBLEVBQUVBLHNCQUE2Q0E7UUFFdEdPLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBO0lBQ1hBLENBQUNBO0lBRURQOztPQUVHQTtJQUNJQSx3Q0FBYUEsR0FBcEJBLFVBQXFCQSxZQUE2QkEsRUFBRUEsc0JBQTZDQTtRQUVoR1EsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7SUFDWEEsQ0FBQ0E7SUFFRFI7Ozs7T0FJR0E7SUFDSUEsMERBQStCQSxHQUF0Q0EsVUFBdUNBLEtBQXdCQTtJQUcvRFMsQ0FBQ0E7SUFFRFQ7O09BRUdBO0lBQ0lBLG9EQUF5QkEsR0FBaENBLFVBQWlDQSxvQkFBeUNBO0lBRzFFVSxDQUFDQTtJQXRIRFYsYUFBYUE7SUFDRUEsdUJBQU1BLEdBQVVBLFFBQVFBLENBQUNBO0lBQ3pCQSw2QkFBWUEsR0FBVUEsYUFBYUEsQ0FBQ0E7SUFDcENBLDhCQUFhQSxHQUFVQSxjQUFjQSxDQUFDQTtJQUVyREEsWUFBWUE7SUFDR0Esc0JBQUtBLEdBQ3BCQTtRQUNDQSxDQUFDQSxFQUFDQSxnQkFBZ0JBLENBQUNBLE1BQU1BO1FBQ3pCQSxDQUFDQSxFQUFDQSxnQkFBZ0JBLENBQUNBLFlBQVlBO1FBQy9CQSxDQUFDQSxFQUFDQSxnQkFBZ0JBLENBQUNBLGFBQWFBO0tBQ2hDQSxDQUFDQTtJQTRHSEEsdUJBQUNBO0FBQURBLENBaklBLEFBaUlDQSxFQWpJOEIsaUJBQWlCLEVBaUkvQztBQUVELEFBQTBCLGlCQUFqQixnQkFBZ0IsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvbm9kZXMvUGFydGljbGVOb2RlQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQW5pbWF0aW9uTm9kZUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9hbmltYXRvcnMvbm9kZXMvQW5pbWF0aW9uTm9kZUJhc2VcIik7XG5cbmltcG9ydCBBbmltYXRpb25SZWdpc3RlckNhY2hlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL0FuaW1hdGlvblJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcblxuaW1wb3J0IFBhcnRpY2xlQW5pbWF0aW9uU2V0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL1BhcnRpY2xlQW5pbWF0aW9uU2V0XCIpO1xuaW1wb3J0IFBhcnRpY2xlUHJvcGVydGllc1x0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1BhcnRpY2xlUHJvcGVydGllc1wiKTtcblxuLyoqXG4gKiBQcm92aWRlcyBhbiBhYnN0cmFjdCBiYXNlIGNsYXNzIGZvciBwYXJ0aWNsZSBhbmltYXRpb24gbm9kZXMuXG4gKi9cbmNsYXNzIFBhcnRpY2xlTm9kZUJhc2UgZXh0ZW5kcyBBbmltYXRpb25Ob2RlQmFzZVxue1xuXHRwcml2YXRlIF9wcmlvcml0eTpudW1iZXIgLyppbnQqLztcblxuXHRwdWJsaWMgX3BNb2RlOm51bWJlciAvKnVpbnQqLztcblx0cHVibGljIF9wRGF0YUxlbmd0aDpudW1iZXIgLyp1aW50Ki8gPSAzO1xuXHRwdWJsaWMgX3BPbmVEYXRhOkFycmF5PG51bWJlcj47XG5cblx0cHVibGljIF9pRGF0YU9mZnNldDpudW1iZXIgLyp1aW50Ki87XG5cblx0Ly9tb2RlcyBhbGlhc1xuXHRwcml2YXRlIHN0YXRpYyBHTE9CQUw6c3RyaW5nID0gJ0dsb2JhbCc7XG5cdHByaXZhdGUgc3RhdGljIExPQ0FMX1NUQVRJQzpzdHJpbmcgPSAnTG9jYWxTdGF0aWMnO1xuXHRwcml2YXRlIHN0YXRpYyBMT0NBTF9EWU5BTUlDOnN0cmluZyA9ICdMb2NhbER5bmFtaWMnO1xuXG5cdC8vbW9kZXMgbGlzdFxuXHRwcml2YXRlIHN0YXRpYyBNT0RFUzpPYmplY3QgPVxuXHR7XG5cdFx0MDpQYXJ0aWNsZU5vZGVCYXNlLkdMT0JBTCxcblx0XHQxOlBhcnRpY2xlTm9kZUJhc2UuTE9DQUxfU1RBVElDLFxuXHRcdDI6UGFydGljbGVOb2RlQmFzZS5MT0NBTF9EWU5BTUlDXG5cdH07XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHByb3BlcnR5IG1vZGUgb2YgdGhlIHBhcnRpY2xlIGFuaW1hdGlvbiBub2RlLiBUeXBpY2FsbHkgc2V0IGluIHRoZSBub2RlIGNvbnN0cnVjdG9yXG5cdCAqXG5cdCAqIEBzZWUgYXdheS5hbmltYXRvcnMuUGFydGljbGVQcm9wZXJ0aWVzTW9kZVxuXHQgKi9cblx0cHVibGljIGdldCBtb2RlKCk6bnVtYmVyIC8qdWludCovXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcE1vZGU7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgcHJpb3JpdHkgb2YgdGhlIHBhcnRpY2xlIGFuaW1hdGlvbiBub2RlLCB1c2VkIHRvIG9yZGVyIHRoZSBhZ2FsIGdlbmVyYXRlZCBpbiBhIHBhcnRpY2xlIGFuaW1hdGlvbiBzZXQuIFNldCBhdXRvbWF0aWNhbGx5IG9uIGluc3RhbnRpYXRpb24uXG5cdCAqXG5cdCAqIEBzZWUgYXdheS5hbmltYXRvcnMuUGFydGljbGVBbmltYXRpb25TZXRcblx0ICogQHNlZSAjZ2V0QUdBTFZlcnRleENvZGVcblx0ICovXG5cdHB1YmxpYyBnZXQgcHJpb3JpdHkoKTpudW1iZXIgLyppbnQqL1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3ByaW9yaXR5O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGUgZGF0YSB1c2VkIGJ5IHRoZSBub2RlIHdoZW4gaW4gPGNvZGU+TE9DQUxfU1RBVElDPC9jb2RlPiBtb2RlLiBVc2VkIHRvIGdlbmVyYXRlIHRoZSBsb2NhbCBzdGF0aWMgZGF0YSBvZiB0aGUgcGFydGljbGUgYW5pbWF0aW9uIHNldC5cblx0ICpcblx0ICogQHNlZSBhd2F5LmFuaW1hdG9ycy5QYXJ0aWNsZUFuaW1hdGlvblNldFxuXHQgKiBAc2VlICNnZXRBR0FMVmVydGV4Q29kZVxuXHQgKi9cblx0cHVibGljIGdldCBkYXRhTGVuZ3RoKCk6bnVtYmVyIC8qaW50Ki9cblx0e1xuXHRcdHJldHVybiB0aGlzLl9wRGF0YUxlbmd0aDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBnZW5lcmF0ZWQgZGF0YSB2ZWN0b3Igb2YgdGhlIG5vZGUgYWZ0ZXIgb25lIHBhcnRpY2xlIHBhc3MgZHVyaW5nIHRoZSBnZW5lcmF0aW9uIG9mIGFsbCBsb2NhbCBzdGF0aWMgZGF0YSBvZiB0aGUgcGFydGljbGUgYW5pbWF0aW9uIHNldC5cblx0ICpcblx0ICogQHNlZSBhd2F5LmFuaW1hdG9ycy5QYXJ0aWNsZUFuaW1hdGlvblNldFxuXHQgKiBAc2VlICNnZW5lcmF0ZVByb3BlcnR5T2ZPbmVQYXJ0aWNsZVxuXHQgKi9cblx0cHVibGljIGdldCBvbmVEYXRhKCk6QXJyYXk8bnVtYmVyPlxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3BPbmVEYXRhO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgPGNvZGU+UGFydGljbGVOb2RlQmFzZTwvY29kZT4gb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gICAgICAgICAgICAgICBuYW1lICAgICAgICAgICAgRGVmaW5lcyB0aGUgZ2VuZXJpYyBuYW1lIG9mIHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gbm9kZS5cblx0ICogQHBhcmFtICAgICAgICAgICAgICAgbW9kZSAgICAgICAgICAgIERlZmluZXMgd2hldGhlciB0aGUgbW9kZSBvZiBvcGVyYXRpb24gYWN0cyBvbiBsb2NhbCBwcm9wZXJ0aWVzIG9mIGEgcGFydGljbGUgb3IgZ2xvYmFsIHByb3BlcnRpZXMgb2YgdGhlIG5vZGUuXG5cdCAqIEBwYXJhbSAgICAgICAgICAgICAgIGRhdGFMZW5ndGggICAgICBEZWZpbmVzIHRoZSBsZW5ndGggb2YgdGhlIGRhdGEgdXNlZCBieSB0aGUgbm9kZSB3aGVuIGluIDxjb2RlPkxPQ0FMX1NUQVRJQzwvY29kZT4gbW9kZS5cblx0ICogQHBhcmFtICAgIFtvcHRpb25hbF0gcHJpb3JpdHkgICAgICAgIHRoZSBwcmlvcml0eSBvZiB0aGUgcGFydGljbGUgYW5pbWF0aW9uIG5vZGUsIHVzZWQgdG8gb3JkZXIgdGhlIGFnYWwgZ2VuZXJhdGVkIGluIGEgcGFydGljbGUgYW5pbWF0aW9uIHNldC4gRGVmYXVsdHMgdG8gMS5cblx0ICovXG5cdGNvbnN0cnVjdG9yKG5hbWU6c3RyaW5nLCBtb2RlOm51bWJlciAvKnVpbnQqLywgZGF0YUxlbmd0aDpudW1iZXIgLyp1aW50Ki8sIHByaW9yaXR5Om51bWJlciAvKmludCovID0gMSlcblx0e1xuXHRcdHN1cGVyKCk7XG5cblx0XHRuYW1lID0gbmFtZSArIFBhcnRpY2xlTm9kZUJhc2UuTU9ERVNbbW9kZV07XG5cblx0XHR0aGlzLm5hbWUgPSBuYW1lO1xuXHRcdHRoaXMuX3BNb2RlID0gbW9kZTtcblx0XHR0aGlzLl9wcmlvcml0eSA9IHByaW9yaXR5O1xuXHRcdHRoaXMuX3BEYXRhTGVuZ3RoID0gZGF0YUxlbmd0aDtcblxuXHRcdHRoaXMuX3BPbmVEYXRhID0gbmV3IEFycmF5PG51bWJlcj4odGhpcy5fcERhdGFMZW5ndGgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIEFHQUwgY29kZSBvZiB0aGUgcGFydGljbGUgYW5pbWF0aW9uIG5vZGUgZm9yIHVzZSBpbiB0aGUgdmVydGV4IHNoYWRlci5cblx0ICovXG5cdHB1YmxpYyBnZXRBR0FMVmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZTpBbmltYXRpb25SZWdpc3RlckNhY2hlKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIEFHQUwgY29kZSBvZiB0aGUgcGFydGljbGUgYW5pbWF0aW9uIG5vZGUgZm9yIHVzZSBpbiB0aGUgZnJhZ21lbnQgc2hhZGVyLlxuXHQgKi9cblx0cHVibGljIGdldEFHQUxGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGU6QW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBBR0FMIGNvZGUgb2YgdGhlIHBhcnRpY2xlIGFuaW1hdGlvbiBub2RlIGZvciB1c2UgaW4gdGhlIGZyYWdtZW50IHNoYWRlciB3aGVuIFVWIGNvb3JkaW5hdGVzIGFyZSByZXF1aXJlZC5cblx0ICovXG5cdHB1YmxpYyBnZXRBR0FMVVZDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBhbmltYXRpb25SZWdpc3RlckNhY2hlOkFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHQvKipcblx0ICogQ2FsbGVkIGludGVybmFsbHkgYnkgdGhlIHBhcnRpY2xlIGFuaW1hdGlvbiBzZXQgd2hlbiBhc3NpZ25pbmcgdGhlIHNldCBvZiBzdGF0aWMgcHJvcGVydGllcyBvcmlnaW5hbGx5IGRlZmluZWQgYnkgdGhlIGluaXRQYXJ0aWNsZUZ1bmMgb2YgdGhlIHNldC5cblx0ICpcblx0ICogQHNlZSBhd2F5LmFuaW1hdG9ycy5QYXJ0aWNsZUFuaW1hdGlvblNldCNpbml0UGFydGljbGVGdW5jXG5cdCAqL1xuXHRwdWJsaWMgX2lHZW5lcmF0ZVByb3BlcnR5T2ZPbmVQYXJ0aWNsZShwYXJhbTpQYXJ0aWNsZVByb3BlcnRpZXMpXG5cdHtcblxuXHR9XG5cblx0LyoqXG5cdCAqIENhbGxlZCBpbnRlcm5hbGx5IGJ5IHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gc2V0IHdoZW4gZGV0ZXJtaW5pbmcgdGhlIHJlcXVpcmVtZW50cyBvZiB0aGUgcGFydGljbGUgYW5pbWF0aW9uIG5vZGUgQUdBTC5cblx0ICovXG5cdHB1YmxpYyBfaVByb2Nlc3NBbmltYXRpb25TZXR0aW5nKHBhcnRpY2xlQW5pbWF0aW9uU2V0OlBhcnRpY2xlQW5pbWF0aW9uU2V0KVxuXHR7XG5cblx0fVxufVxuXG5leHBvcnQgPSBQYXJ0aWNsZU5vZGVCYXNlOyJdfQ==