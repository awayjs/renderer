var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationNodeBase = require("awayjs-core/lib/animators/nodes/AnimationNodeBase");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy9ub2Rlcy9wYXJ0aWNsZW5vZGViYXNlLnRzIl0sIm5hbWVzIjpbIlBhcnRpY2xlTm9kZUJhc2UiLCJQYXJ0aWNsZU5vZGVCYXNlLmNvbnN0cnVjdG9yIiwiUGFydGljbGVOb2RlQmFzZS5tb2RlIiwiUGFydGljbGVOb2RlQmFzZS5wcmlvcml0eSIsIlBhcnRpY2xlTm9kZUJhc2UuZGF0YUxlbmd0aCIsIlBhcnRpY2xlTm9kZUJhc2Uub25lRGF0YSIsIlBhcnRpY2xlTm9kZUJhc2UuZ2V0QUdBTFZlcnRleENvZGUiLCJQYXJ0aWNsZU5vZGVCYXNlLmdldEFHQUxGcmFnbWVudENvZGUiLCJQYXJ0aWNsZU5vZGVCYXNlLmdldEFHQUxVVkNvZGUiLCJQYXJ0aWNsZU5vZGVCYXNlLl9pR2VuZXJhdGVQcm9wZXJ0eU9mT25lUGFydGljbGUiLCJQYXJ0aWNsZU5vZGVCYXNlLl9pUHJvY2Vzc0FuaW1hdGlvblNldHRpbmciXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU8saUJBQWlCLFdBQWMsbURBQW1ELENBQUMsQ0FBQztBQVEzRixBQUdBOztHQURHO0lBQ0csZ0JBQWdCO0lBQVNBLFVBQXpCQSxnQkFBZ0JBLFVBQTBCQTtJQWtFL0NBOzs7Ozs7O09BT0dBO0lBQ0hBLFNBMUVLQSxnQkFBZ0JBLENBMEVUQSxJQUFXQSxFQUFFQSxJQUFJQSxDQUFRQSxRQUFEQSxBQUFTQSxFQUFFQSxVQUFVQSxDQUFRQSxRQUFEQSxBQUFTQSxFQUFFQSxRQUEyQkE7UUFBM0JDLHdCQUEyQkEsR0FBM0JBLFlBQTJCQTtRQUVyR0EsaUJBQU9BLENBQUNBO1FBdkVGQSxpQkFBWUEsR0FBbUJBLENBQUNBLENBQUNBO1FBeUV2Q0EsSUFBSUEsR0FBR0EsSUFBSUEsR0FBR0EsZ0JBQWdCQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUUzQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDakJBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBO1FBQ25CQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsVUFBVUEsQ0FBQ0E7UUFFL0JBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLEtBQUtBLENBQVNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBO0lBQ3ZEQSxDQUFDQTtJQTFEREQsc0JBQVdBLGtDQUFJQTtRQUxmQTs7OztXQUlHQTthQUNIQTtZQUVDRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUNwQkEsQ0FBQ0E7OztPQUFBRjtJQVFEQSxzQkFBV0Esc0NBQVFBO1FBTm5CQTs7Ozs7V0FLR0E7YUFDSEE7WUFFQ0csTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDdkJBLENBQUNBOzs7T0FBQUg7SUFRREEsc0JBQVdBLHdDQUFVQTtRQU5yQkE7Ozs7O1dBS0dBO2FBQ0hBO1lBRUNJLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBO1FBQzFCQSxDQUFDQTs7O09BQUFKO0lBUURBLHNCQUFXQSxxQ0FBT0E7UUFObEJBOzs7OztXQUtHQTthQUNIQTtZQUVDSyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQTtRQUN2QkEsQ0FBQ0E7OztPQUFBTDtJQXdCREE7O09BRUdBO0lBQ0lBLDRDQUFpQkEsR0FBeEJBLFVBQXlCQSxZQUE2QkEsRUFBRUEsc0JBQTZDQTtRQUVwR00sTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7SUFDWEEsQ0FBQ0E7SUFFRE47O09BRUdBO0lBQ0lBLDhDQUFtQkEsR0FBMUJBLFVBQTJCQSxZQUE2QkEsRUFBRUEsc0JBQTZDQTtRQUV0R08sTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7SUFDWEEsQ0FBQ0E7SUFFRFA7O09BRUdBO0lBQ0lBLHdDQUFhQSxHQUFwQkEsVUFBcUJBLFlBQTZCQSxFQUFFQSxzQkFBNkNBO1FBRWhHUSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQTtJQUNYQSxDQUFDQTtJQUVEUjs7OztPQUlHQTtJQUNJQSwwREFBK0JBLEdBQXRDQSxVQUF1Q0EsS0FBd0JBO0lBRy9EUyxDQUFDQTtJQUVEVDs7T0FFR0E7SUFDSUEsb0RBQXlCQSxHQUFoQ0EsVUFBaUNBLG9CQUF5Q0E7SUFHMUVVLENBQUNBO0lBdEhEVixhQUFhQTtJQUNFQSx1QkFBTUEsR0FBVUEsUUFBUUEsQ0FBQ0E7SUFDekJBLDZCQUFZQSxHQUFVQSxhQUFhQSxDQUFDQTtJQUNwQ0EsOEJBQWFBLEdBQVVBLGNBQWNBLENBQUNBO0lBRXJEQSxZQUFZQTtJQUNHQSxzQkFBS0EsR0FDcEJBO1FBQ0NBLENBQUNBLEVBQUNBLGdCQUFnQkEsQ0FBQ0EsTUFBTUE7UUFDekJBLENBQUNBLEVBQUNBLGdCQUFnQkEsQ0FBQ0EsWUFBWUE7UUFDL0JBLENBQUNBLEVBQUNBLGdCQUFnQkEsQ0FBQ0EsYUFBYUE7S0FDaENBLENBQUNBO0lBNEdIQSx1QkFBQ0E7QUFBREEsQ0FqSUEsQUFpSUNBLEVBakk4QixpQkFBaUIsRUFpSS9DO0FBRUQsQUFBMEIsaUJBQWpCLGdCQUFnQixDQUFDIiwiZmlsZSI6ImFuaW1hdG9ycy9ub2Rlcy9QYXJ0aWNsZU5vZGVCYXNlLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFuaW1hdGlvbk5vZGVCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvYW5pbWF0b3JzL25vZGVzL0FuaW1hdGlvbk5vZGVCYXNlXCIpO1xuXG5pbXBvcnQgQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9hbmltYXRvcnMvZGF0YS9BbmltYXRpb25SZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuXG5pbXBvcnQgUGFydGljbGVBbmltYXRpb25TZXRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvUGFydGljbGVBbmltYXRpb25TZXRcIik7XG5pbXBvcnQgUGFydGljbGVQcm9wZXJ0aWVzXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvUGFydGljbGVQcm9wZXJ0aWVzXCIpO1xuXG4vKipcbiAqIFByb3ZpZGVzIGFuIGFic3RyYWN0IGJhc2UgY2xhc3MgZm9yIHBhcnRpY2xlIGFuaW1hdGlvbiBub2Rlcy5cbiAqL1xuY2xhc3MgUGFydGljbGVOb2RlQmFzZSBleHRlbmRzIEFuaW1hdGlvbk5vZGVCYXNlXG57XG5cdHByaXZhdGUgX3ByaW9yaXR5Om51bWJlciAvKmludCovO1xuXG5cdHB1YmxpYyBfcE1vZGU6bnVtYmVyIC8qdWludCovO1xuXHRwdWJsaWMgX3BEYXRhTGVuZ3RoOm51bWJlciAvKnVpbnQqLyA9IDM7XG5cdHB1YmxpYyBfcE9uZURhdGE6QXJyYXk8bnVtYmVyPjtcblxuXHRwdWJsaWMgX2lEYXRhT2Zmc2V0Om51bWJlciAvKnVpbnQqLztcblxuXHQvL21vZGVzIGFsaWFzXG5cdHByaXZhdGUgc3RhdGljIEdMT0JBTDpzdHJpbmcgPSAnR2xvYmFsJztcblx0cHJpdmF0ZSBzdGF0aWMgTE9DQUxfU1RBVElDOnN0cmluZyA9ICdMb2NhbFN0YXRpYyc7XG5cdHByaXZhdGUgc3RhdGljIExPQ0FMX0RZTkFNSUM6c3RyaW5nID0gJ0xvY2FsRHluYW1pYyc7XG5cblx0Ly9tb2RlcyBsaXN0XG5cdHByaXZhdGUgc3RhdGljIE1PREVTOk9iamVjdCA9XG5cdHtcblx0XHQwOlBhcnRpY2xlTm9kZUJhc2UuR0xPQkFMLFxuXHRcdDE6UGFydGljbGVOb2RlQmFzZS5MT0NBTF9TVEFUSUMsXG5cdFx0MjpQYXJ0aWNsZU5vZGVCYXNlLkxPQ0FMX0RZTkFNSUNcblx0fTtcblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgcHJvcGVydHkgbW9kZSBvZiB0aGUgcGFydGljbGUgYW5pbWF0aW9uIG5vZGUuIFR5cGljYWxseSBzZXQgaW4gdGhlIG5vZGUgY29uc3RydWN0b3Jcblx0ICpcblx0ICogQHNlZSBhd2F5LmFuaW1hdG9ycy5QYXJ0aWNsZVByb3BlcnRpZXNNb2RlXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG1vZGUoKTpudW1iZXIgLyp1aW50Ki9cblx0e1xuXHRcdHJldHVybiB0aGlzLl9wTW9kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBwcmlvcml0eSBvZiB0aGUgcGFydGljbGUgYW5pbWF0aW9uIG5vZGUsIHVzZWQgdG8gb3JkZXIgdGhlIGFnYWwgZ2VuZXJhdGVkIGluIGEgcGFydGljbGUgYW5pbWF0aW9uIHNldC4gU2V0IGF1dG9tYXRpY2FsbHkgb24gaW5zdGFudGlhdGlvbi5cblx0ICpcblx0ICogQHNlZSBhd2F5LmFuaW1hdG9ycy5QYXJ0aWNsZUFuaW1hdGlvblNldFxuXHQgKiBAc2VlICNnZXRBR0FMVmVydGV4Q29kZVxuXHQgKi9cblx0cHVibGljIGdldCBwcmlvcml0eSgpOm51bWJlciAvKmludCovXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcHJpb3JpdHk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgbGVuZ3RoIG9mIHRoZSBkYXRhIHVzZWQgYnkgdGhlIG5vZGUgd2hlbiBpbiA8Y29kZT5MT0NBTF9TVEFUSUM8L2NvZGU+IG1vZGUuIFVzZWQgdG8gZ2VuZXJhdGUgdGhlIGxvY2FsIHN0YXRpYyBkYXRhIG9mIHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gc2V0LlxuXHQgKlxuXHQgKiBAc2VlIGF3YXkuYW5pbWF0b3JzLlBhcnRpY2xlQW5pbWF0aW9uU2V0XG5cdCAqIEBzZWUgI2dldEFHQUxWZXJ0ZXhDb2RlXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGRhdGFMZW5ndGgoKTpudW1iZXIgLyppbnQqL1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3BEYXRhTGVuZ3RoO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGdlbmVyYXRlZCBkYXRhIHZlY3RvciBvZiB0aGUgbm9kZSBhZnRlciBvbmUgcGFydGljbGUgcGFzcyBkdXJpbmcgdGhlIGdlbmVyYXRpb24gb2YgYWxsIGxvY2FsIHN0YXRpYyBkYXRhIG9mIHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gc2V0LlxuXHQgKlxuXHQgKiBAc2VlIGF3YXkuYW5pbWF0b3JzLlBhcnRpY2xlQW5pbWF0aW9uU2V0XG5cdCAqIEBzZWUgI2dlbmVyYXRlUHJvcGVydHlPZk9uZVBhcnRpY2xlXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IG9uZURhdGEoKTpBcnJheTxudW1iZXI+XG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcE9uZURhdGE7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyA8Y29kZT5QYXJ0aWNsZU5vZGVCYXNlPC9jb2RlPiBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSAgICAgICAgICAgICAgIG5hbWUgICAgICAgICAgICBEZWZpbmVzIHRoZSBnZW5lcmljIG5hbWUgb2YgdGhlIHBhcnRpY2xlIGFuaW1hdGlvbiBub2RlLlxuXHQgKiBAcGFyYW0gICAgICAgICAgICAgICBtb2RlICAgICAgICAgICAgRGVmaW5lcyB3aGV0aGVyIHRoZSBtb2RlIG9mIG9wZXJhdGlvbiBhY3RzIG9uIGxvY2FsIHByb3BlcnRpZXMgb2YgYSBwYXJ0aWNsZSBvciBnbG9iYWwgcHJvcGVydGllcyBvZiB0aGUgbm9kZS5cblx0ICogQHBhcmFtICAgICAgICAgICAgICAgZGF0YUxlbmd0aCAgICAgIERlZmluZXMgdGhlIGxlbmd0aCBvZiB0aGUgZGF0YSB1c2VkIGJ5IHRoZSBub2RlIHdoZW4gaW4gPGNvZGU+TE9DQUxfU1RBVElDPC9jb2RlPiBtb2RlLlxuXHQgKiBAcGFyYW0gICAgW29wdGlvbmFsXSBwcmlvcml0eSAgICAgICAgdGhlIHByaW9yaXR5IG9mIHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gbm9kZSwgdXNlZCB0byBvcmRlciB0aGUgYWdhbCBnZW5lcmF0ZWQgaW4gYSBwYXJ0aWNsZSBhbmltYXRpb24gc2V0LiBEZWZhdWx0cyB0byAxLlxuXHQgKi9cblx0Y29uc3RydWN0b3IobmFtZTpzdHJpbmcsIG1vZGU6bnVtYmVyIC8qdWludCovLCBkYXRhTGVuZ3RoOm51bWJlciAvKnVpbnQqLywgcHJpb3JpdHk6bnVtYmVyIC8qaW50Ki8gPSAxKVxuXHR7XG5cdFx0c3VwZXIoKTtcblxuXHRcdG5hbWUgPSBuYW1lICsgUGFydGljbGVOb2RlQmFzZS5NT0RFU1ttb2RlXTtcblxuXHRcdHRoaXMubmFtZSA9IG5hbWU7XG5cdFx0dGhpcy5fcE1vZGUgPSBtb2RlO1xuXHRcdHRoaXMuX3ByaW9yaXR5ID0gcHJpb3JpdHk7XG5cdFx0dGhpcy5fcERhdGFMZW5ndGggPSBkYXRhTGVuZ3RoO1xuXG5cdFx0dGhpcy5fcE9uZURhdGEgPSBuZXcgQXJyYXk8bnVtYmVyPih0aGlzLl9wRGF0YUxlbmd0aCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgQUdBTCBjb2RlIG9mIHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gbm9kZSBmb3IgdXNlIGluIHRoZSB2ZXJ0ZXggc2hhZGVyLlxuXHQgKi9cblx0cHVibGljIGdldEFHQUxWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBhbmltYXRpb25SZWdpc3RlckNhY2hlOkFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgQUdBTCBjb2RlIG9mIHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gbm9kZSBmb3IgdXNlIGluIHRoZSBmcmFnbWVudCBzaGFkZXIuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0QUdBTEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZTpBbmltYXRpb25SZWdpc3RlckNhY2hlKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIEFHQUwgY29kZSBvZiB0aGUgcGFydGljbGUgYW5pbWF0aW9uIG5vZGUgZm9yIHVzZSBpbiB0aGUgZnJhZ21lbnQgc2hhZGVyIHdoZW4gVVYgY29vcmRpbmF0ZXMgYXJlIHJlcXVpcmVkLlxuXHQgKi9cblx0cHVibGljIGdldEFHQUxVVkNvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGU6QW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxsZWQgaW50ZXJuYWxseSBieSB0aGUgcGFydGljbGUgYW5pbWF0aW9uIHNldCB3aGVuIGFzc2lnbmluZyB0aGUgc2V0IG9mIHN0YXRpYyBwcm9wZXJ0aWVzIG9yaWdpbmFsbHkgZGVmaW5lZCBieSB0aGUgaW5pdFBhcnRpY2xlRnVuYyBvZiB0aGUgc2V0LlxuXHQgKlxuXHQgKiBAc2VlIGF3YXkuYW5pbWF0b3JzLlBhcnRpY2xlQW5pbWF0aW9uU2V0I2luaXRQYXJ0aWNsZUZ1bmNcblx0ICovXG5cdHB1YmxpYyBfaUdlbmVyYXRlUHJvcGVydHlPZk9uZVBhcnRpY2xlKHBhcmFtOlBhcnRpY2xlUHJvcGVydGllcylcblx0e1xuXG5cdH1cblxuXHQvKipcblx0ICogQ2FsbGVkIGludGVybmFsbHkgYnkgdGhlIHBhcnRpY2xlIGFuaW1hdGlvbiBzZXQgd2hlbiBkZXRlcm1pbmluZyB0aGUgcmVxdWlyZW1lbnRzIG9mIHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gbm9kZSBBR0FMLlxuXHQgKi9cblx0cHVibGljIF9pUHJvY2Vzc0FuaW1hdGlvblNldHRpbmcocGFydGljbGVBbmltYXRpb25TZXQ6UGFydGljbGVBbmltYXRpb25TZXQpXG5cdHtcblxuXHR9XG59XG5cbmV4cG9ydCA9IFBhcnRpY2xlTm9kZUJhc2U7Il19