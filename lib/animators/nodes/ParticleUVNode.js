var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
var ShaderRegisterElement = require("awayjs-stagegl/lib/materials/compilation/ShaderRegisterElement");
var ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
var ParticleUVState = require("awayjs-renderergl/lib/animators/states/ParticleUVState");
/**
 * A particle animation node used to control the UV offset and scale of a particle over time.
 */
var ParticleUVNode = (function (_super) {
    __extends(ParticleUVNode, _super);
    /**
     * Creates a new <code>ParticleTimeNode</code>
     *
     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
     * @param    [optional] cycle           Defines whether the time track is in loop mode. Defaults to false.
     * @param    [optional] scale           Defines whether the time track is in loop mode. Defaults to false.
     * @param    [optional] axis            Defines whether the time track is in loop mode. Defaults to false.
     */
    function ParticleUVNode(mode /*uint*/, cycle, scale, axis) {
        if (cycle === void 0) { cycle = 1; }
        if (scale === void 0) { scale = 1; }
        if (axis === void 0) { axis = "x"; }
        //because of the stage3d register limitation, it only support the global mode
        _super.call(this, "ParticleUV", ParticlePropertiesMode.GLOBAL, 4, ParticleAnimationSet.POST_PRIORITY + 1);
        this._pStateClass = ParticleUVState;
        this._cycle = cycle;
        this._scale = scale;
        this._axis = axis;
        this.updateUVData();
    }
    Object.defineProperty(ParticleUVNode.prototype, "cycle", {
        /**
         *
         */
        get: function () {
            return this._cycle;
        },
        set: function (value) {
            this._cycle = value;
            this.updateUVData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleUVNode.prototype, "scale", {
        /**
         *
         */
        get: function () {
            return this._scale;
        },
        set: function (value) {
            this._scale = value;
            this.updateUVData();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParticleUVNode.prototype, "axis", {
        /**
         *
         */
        get: function () {
            return this._axis;
        },
        set: function (value) {
            this._axis = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ParticleUVNode.prototype.getAGALUVCode = function (shaderObject, animationRegisterCache) {
        var code = "";
        var uvConst = animationRegisterCache.getFreeVertexConstant();
        animationRegisterCache.setRegisterIndex(this, ParticleUVState.UV_INDEX, uvConst.index);
        var axisIndex = this._axis == "x" ? 0 : (this._axis == "y" ? 1 : 2);
        var target = new ShaderRegisterElement(animationRegisterCache.uvTarget.regName, animationRegisterCache.uvTarget.index, axisIndex);
        var sin = animationRegisterCache.getFreeVertexSingleTemp();
        if (this._scale != 1)
            code += "mul " + target + "," + target + "," + uvConst + ".y\n";
        code += "mul " + sin + "," + animationRegisterCache.vertexTime + "," + uvConst + ".x\n";
        code += "sin " + sin + "," + sin + "\n";
        code += "add " + target + "," + target + "," + sin + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleUVNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    ParticleUVNode.prototype.updateUVData = function () {
        this._iUvData = new Vector3D(Math.PI * 2 / this._cycle, this._scale, 0, 0);
    };
    /**
     * @inheritDoc
     */
    ParticleUVNode.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
        particleAnimationSet.hasUVNode = true;
    };
    /**
     *
     */
    ParticleUVNode.U_AXIS = "x";
    /**
     *
     */
    ParticleUVNode.V_AXIS = "y";
    return ParticleUVNode;
})(ParticleNodeBase);
module.exports = ParticleUVNode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy9ub2Rlcy9wYXJ0aWNsZXV2bm9kZS50cyJdLCJuYW1lcyI6WyJQYXJ0aWNsZVVWTm9kZSIsIlBhcnRpY2xlVVZOb2RlLmNvbnN0cnVjdG9yIiwiUGFydGljbGVVVk5vZGUuY3ljbGUiLCJQYXJ0aWNsZVVWTm9kZS5zY2FsZSIsIlBhcnRpY2xlVVZOb2RlLmF4aXMiLCJQYXJ0aWNsZVVWTm9kZS5nZXRBR0FMVVZDb2RlIiwiUGFydGljbGVVVk5vZGUuZ2V0QW5pbWF0aW9uU3RhdGUiLCJQYXJ0aWNsZVVWTm9kZS51cGRhdGVVVkRhdGEiLCJQYXJ0aWNsZVVWTm9kZS5faVByb2Nlc3NBbmltYXRpb25TZXR0aW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFPLFFBQVEsV0FBaUIsb0NBQW9DLENBQUMsQ0FBQztBQUt0RSxJQUFPLHFCQUFxQixXQUFhLGdFQUFnRSxDQUFDLENBQUM7QUFFM0csSUFBTyxvQkFBb0IsV0FBYyxzREFBc0QsQ0FBQyxDQUFDO0FBRWpHLElBQU8sc0JBQXNCLFdBQWEsNkRBQTZELENBQUMsQ0FBQztBQUN6RyxJQUFPLGdCQUFnQixXQUFlLHdEQUF3RCxDQUFDLENBQUM7QUFDaEcsSUFBTyxlQUFlLFdBQWUsd0RBQXdELENBQUMsQ0FBQztBQUUvRixBQUdBOztHQURHO0lBQ0csY0FBYztJQUFTQSxVQUF2QkEsY0FBY0EsVUFBeUJBO0lBbUI1Q0E7Ozs7Ozs7T0FPR0E7SUFDSEEsU0EzQktBLGNBQWNBLENBMkJQQSxJQUFJQSxDQUFRQSxRQUFEQSxBQUFTQSxFQUFFQSxLQUFnQkEsRUFBRUEsS0FBZ0JBLEVBQUVBLElBQWlCQTtRQUFyREMscUJBQWdCQSxHQUFoQkEsU0FBZ0JBO1FBQUVBLHFCQUFnQkEsR0FBaEJBLFNBQWdCQTtRQUFFQSxvQkFBaUJBLEdBQWpCQSxVQUFpQkE7UUFFdEZBLEFBQ0FBLDZFQUQ2RUE7UUFDN0VBLGtCQUFNQSxZQUFZQSxFQUFFQSxzQkFBc0JBLENBQUNBLE1BQU1BLEVBQUVBLENB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QUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUN4Q0EsSUFBSUEsSUFBSUEsTUFBTUEsR0FBR0EsTUFBTUEsR0FBR0EsR0FBR0EsR0FBR0EsTUFBTUEsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFFMURBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO0lBQ2JBLENBQUNBO0lBRURMOztPQUVHQTtJQUNJQSwwQ0FBaUJBLEdBQXhCQSxVQUF5QkEsUUFBcUJBO1FBRTdDTSxNQUFNQSxDQUFtQkEsUUFBUUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtJQUMzREEsQ0FBQ0E7SUFFT04scUNBQVlBLEdBQXBCQTtRQUVDTyxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxJQUFJQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxHQUFDQSxDQUFDQSxHQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUN4RUEsQ0FBQ0E7SUFFRFA7O09BRUdBO0lBQ0lBLGtEQUF5QkEsR0FBaENBLFVBQWlDQSxvQkFBeUNBO1FBRXpFUSxvQkFBb0JBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBO0lBQ3ZDQSxDQUFDQTtJQTVIRFI7O09BRUdBO0lBQ1dBLHFCQUFNQSxHQUFVQSxHQUFHQSxDQUFDQTtJQUVsQ0E7O09BRUdBO0lBQ1dBLHFCQUFNQSxHQUFVQSxHQUFHQSxDQUFDQTtJQXFIbkNBLHFCQUFDQTtBQUFEQSxDQWxJQSxBQWtJQ0EsRUFsSTRCLGdCQUFnQixFQWtJNUM7QUFFRCxBQUF3QixpQkFBZixjQUFjLENBQUMiLCJmaWxlIjoiYW5pbWF0b3JzL25vZGVzL1BhcnRpY2xlVVZOb2RlLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9nZW9tL1ZlY3RvcjNEXCIpO1xuXG5pbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XG5pbXBvcnQgQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9hbmltYXRvcnMvZGF0YS9BbmltYXRpb25SZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuXG5pbXBvcnQgUGFydGljbGVBbmltYXRpb25TZXRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvUGFydGljbGVBbmltYXRpb25TZXRcIik7XG5pbXBvcnQgUGFydGljbGVQcm9wZXJ0aWVzXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvUGFydGljbGVQcm9wZXJ0aWVzXCIpO1xuaW1wb3J0IFBhcnRpY2xlUHJvcGVydGllc01vZGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvUGFydGljbGVQcm9wZXJ0aWVzTW9kZVwiKTtcbmltcG9ydCBQYXJ0aWNsZU5vZGVCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvUGFydGljbGVOb2RlQmFzZVwiKTtcbmltcG9ydCBQYXJ0aWNsZVVWU3RhdGVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9zdGF0ZXMvUGFydGljbGVVVlN0YXRlXCIpO1xuXG4vKipcbiAqIEEgcGFydGljbGUgYW5pbWF0aW9uIG5vZGUgdXNlZCB0byBjb250cm9sIHRoZSBVViBvZmZzZXQgYW5kIHNjYWxlIG9mIGEgcGFydGljbGUgb3ZlciB0aW1lLlxuICovXG5jbGFzcyBQYXJ0aWNsZVVWTm9kZSBleHRlbmRzIFBhcnRpY2xlTm9kZUJhc2Vcbntcblx0LyoqIEBwcml2YXRlICovXG5cdHB1YmxpYyBfaVV2RGF0YTpWZWN0b3IzRDtcblxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgVV9BWElTOnN0cmluZyA9IFwieFwiO1xuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBWX0FYSVM6c3RyaW5nID0gXCJ5XCI7XG5cblx0cHJpdmF0ZSBfY3ljbGU6bnVtYmVyO1xuXHRwcml2YXRlIF9zY2FsZTpudW1iZXI7XG5cdHByaXZhdGUgX2F4aXM6c3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IDxjb2RlPlBhcnRpY2xlVGltZU5vZGU8L2NvZGU+XG5cdCAqXG5cdCAqIEBwYXJhbSAgICAgICAgICAgICAgIG1vZGUgICAgICAgICAgICBEZWZpbmVzIHdoZXRoZXIgdGhlIG1vZGUgb2Ygb3BlcmF0aW9uIGFjdHMgb24gbG9jYWwgcHJvcGVydGllcyBvZiBhIHBhcnRpY2xlIG9yIGdsb2JhbCBwcm9wZXJ0aWVzIG9mIHRoZSBub2RlLlxuXHQgKiBAcGFyYW0gICAgW29wdGlvbmFsXSBjeWNsZSAgICAgICAgICAgRGVmaW5lcyB3aGV0aGVyIHRoZSB0aW1lIHRyYWNrIGlzIGluIGxvb3AgbW9kZS4gRGVmYXVsdHMgdG8gZmFsc2UuXG5cdCAqIEBwYXJhbSAgICBbb3B0aW9uYWxdIHNjYWxlICAgICAgICAgICBEZWZpbmVzIHdoZXRoZXIgdGhlIHRpbWUgdHJhY2sgaXMgaW4gbG9vcCBtb2RlLiBEZWZhdWx0cyB0byBmYWxzZS5cblx0ICogQHBhcmFtICAgIFtvcHRpb25hbF0gYXhpcyAgICAgICAgICAgIERlZmluZXMgd2hldGhlciB0aGUgdGltZSB0cmFjayBpcyBpbiBsb29wIG1vZGUuIERlZmF1bHRzIHRvIGZhbHNlLlxuXHQgKi9cblx0Y29uc3RydWN0b3IobW9kZTpudW1iZXIgLyp1aW50Ki8sIGN5Y2xlOm51bWJlciA9IDEsIHNjYWxlOm51bWJlciA9IDEsIGF4aXM6c3RyaW5nID0gXCJ4XCIpXG5cdHtcblx0XHQvL2JlY2F1c2Ugb2YgdGhlIHN0YWdlM2QgcmVnaXN0ZXIgbGltaXRhdGlvbiwgaXQgb25seSBzdXBwb3J0IHRoZSBnbG9iYWwgbW9kZVxuXHRcdHN1cGVyKFwiUGFydGljbGVVVlwiLCBQYXJ0aWNsZVByb3BlcnRpZXNNb2RlLkdMT0JBTCwgNCwgUGFydGljbGVBbmltYXRpb25TZXQuUE9TVF9QUklPUklUWSArIDEpO1xuXG5cdFx0dGhpcy5fcFN0YXRlQ2xhc3MgPSBQYXJ0aWNsZVVWU3RhdGU7XG5cblx0XHR0aGlzLl9jeWNsZSA9IGN5Y2xlO1xuXHRcdHRoaXMuX3NjYWxlID0gc2NhbGU7XG5cdFx0dGhpcy5fYXhpcyA9IGF4aXM7XG5cblx0XHR0aGlzLnVwZGF0ZVVWRGF0YSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGN5Y2xlKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fY3ljbGU7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGN5Y2xlKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX2N5Y2xlID0gdmFsdWU7XG5cblx0XHR0aGlzLnVwZGF0ZVVWRGF0YSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHNjYWxlKCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fc2NhbGU7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHNjYWxlKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3NjYWxlID0gdmFsdWU7XG5cblx0XHR0aGlzLnVwZGF0ZVVWRGF0YSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGF4aXMoKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiB0aGlzLl9heGlzO1xuXHR9XG5cblx0cHVibGljIHNldCBheGlzKHZhbHVlOnN0cmluZylcblx0e1xuXHRcdHRoaXMuX2F4aXMgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldEFHQUxVVkNvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGU6QW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY29kZTpzdHJpbmcgPSBcIlwiO1xuXG5cdFx0dmFyIHV2Q29uc3Q6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5nZXRGcmVlVmVydGV4Q29uc3RhbnQoKTtcblx0XHRhbmltYXRpb25SZWdpc3RlckNhY2hlLnNldFJlZ2lzdGVySW5kZXgodGhpcywgUGFydGljbGVVVlN0YXRlLlVWX0lOREVYLCB1dkNvbnN0LmluZGV4KTtcblxuXHRcdHZhciBheGlzSW5kZXg6bnVtYmVyID0gdGhpcy5fYXhpcyA9PSBcInhcIj8gMCA6ICh0aGlzLl9heGlzID09IFwieVwiPyAxIDogMik7XG5cblx0XHR2YXIgdGFyZ2V0OlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IG5ldyBTaGFkZXJSZWdpc3RlckVsZW1lbnQoYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS51dlRhcmdldC5yZWdOYW1lLCBhbmltYXRpb25SZWdpc3RlckNhY2hlLnV2VGFyZ2V0LmluZGV4LCBheGlzSW5kZXgpO1xuXG5cdFx0dmFyIHNpbjpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSBhbmltYXRpb25SZWdpc3RlckNhY2hlLmdldEZyZWVWZXJ0ZXhTaW5nbGVUZW1wKCk7XG5cblx0XHRpZiAodGhpcy5fc2NhbGUgIT0gMSlcblx0XHRcdGNvZGUgKz0gXCJtdWwgXCIgKyB0YXJnZXQgKyBcIixcIiArIHRhcmdldCArIFwiLFwiICsgdXZDb25zdCArIFwiLnlcXG5cIjtcblxuXHRcdGNvZGUgKz0gXCJtdWwgXCIgKyBzaW4gKyBcIixcIiArIGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudmVydGV4VGltZSArIFwiLFwiICsgdXZDb25zdCArIFwiLnhcXG5cIjtcblx0XHRjb2RlICs9IFwic2luIFwiICsgc2luICsgXCIsXCIgKyBzaW4gKyBcIlxcblwiO1xuXHRcdGNvZGUgKz0gXCJhZGQgXCIgKyB0YXJnZXQgKyBcIixcIiArIHRhcmdldCArIFwiLFwiICsgc2luICsgXCJcXG5cIjtcblxuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0QW5pbWF0aW9uU3RhdGUoYW5pbWF0b3I6QW5pbWF0b3JCYXNlKTpQYXJ0aWNsZVVWU3RhdGVcblx0e1xuXHRcdHJldHVybiA8UGFydGljbGVVVlN0YXRlPiBhbmltYXRvci5nZXRBbmltYXRpb25TdGF0ZSh0aGlzKTtcblx0fVxuXG5cdHByaXZhdGUgdXBkYXRlVVZEYXRhKClcblx0e1xuXHRcdHRoaXMuX2lVdkRhdGEgPSBuZXcgVmVjdG9yM0QoTWF0aC5QSSoyL3RoaXMuX2N5Y2xlLCB0aGlzLl9zY2FsZSwgMCwgMCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfaVByb2Nlc3NBbmltYXRpb25TZXR0aW5nKHBhcnRpY2xlQW5pbWF0aW9uU2V0OlBhcnRpY2xlQW5pbWF0aW9uU2V0KVxuXHR7XG5cdFx0cGFydGljbGVBbmltYXRpb25TZXQuaGFzVVZOb2RlID0gdHJ1ZTtcblx0fVxufVxuXG5leHBvcnQgPSBQYXJ0aWNsZVVWTm9kZTsiXX0=