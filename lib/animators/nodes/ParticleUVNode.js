var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvUGFydGljbGVVVk5vZGUudHMiXSwibmFtZXMiOlsiUGFydGljbGVVVk5vZGUiLCJQYXJ0aWNsZVVWTm9kZS5jb25zdHJ1Y3RvciIsIlBhcnRpY2xlVVZOb2RlLmN5Y2xlIiwiUGFydGljbGVVVk5vZGUuc2NhbGUiLCJQYXJ0aWNsZVVWTm9kZS5heGlzIiwiUGFydGljbGVVVk5vZGUuZ2V0QUdBTFVWQ29kZSIsIlBhcnRpY2xlVVZOb2RlLmdldEFuaW1hdGlvblN0YXRlIiwiUGFydGljbGVVVk5vZGUudXBkYXRlVVZEYXRhIiwiUGFydGljbGVVVk5vZGUuX2lQcm9jZXNzQW5pbWF0aW9uU2V0dGluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTyxRQUFRLFdBQWlCLCtCQUErQixDQUFDLENBQUM7QUFLakUsSUFBTyxxQkFBcUIsV0FBYSx5REFBeUQsQ0FBQyxDQUFDO0FBRXBHLElBQU8sb0JBQW9CLFdBQWMsc0RBQXNELENBQUMsQ0FBQztBQUVqRyxJQUFPLHNCQUFzQixXQUFhLDZEQUE2RCxDQUFDLENBQUM7QUFDekcsSUFBTyxnQkFBZ0IsV0FBZSx3REFBd0QsQ0FBQyxDQUFDO0FBQ2hHLElBQU8sZUFBZSxXQUFlLHdEQUF3RCxDQUFDLENBQUM7QUFFL0YsQUFHQTs7R0FERztJQUNHLGNBQWM7SUFBU0EsVUFBdkJBLGNBQWNBLFVBQXlCQTtJQW1CNUNBOzs7Ozs7O09BT0dBO0lBQ0hBLFNBM0JLQSxjQUFjQSxDQTJCUEEsSUFBSUEsQ0FBUUEsUUFBREEsQUFBU0EsRUFBRUEsS0FBZ0JBLEVBQUVBLEtBQWdCQSxFQUFFQSxJQUFpQkE7UUFBckRDLHFCQUFnQkEsR0FBaEJBLFNBQWdCQTtRQUFFQSxxQkFBZ0JBLEdBQWhCQSxTQUFnQkE7UUFBRUEsb0JBQWlCQSxHQUFqQkEsVUFBaUJBO1FBRXRGQSxBQUNBQSw2RUFENkVBO1FBQzdFQSxrQkFBTUEsWUFBWUEsRUFBRUEsc0JBQXNCQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxvQkFBb0JBLENBQUNBLGFBQWFBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO1FBRTlGQSxJQUFJQSxDQUFDQSxZQUFZQSxHQUFHQSxlQUFlQSxDQUFDQTtRQUVwQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDcEJBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLEtBQUtBLENBQUNBO1FBQ3BCQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUVsQkEsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0E7SUFDckJBLENBQUNBO0lBS0RELHNCQUFXQSxpQ0FBS0E7UUFIaEJBOztXQUVHQTthQUNIQTtZQUVDRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUNwQkEsQ0FBQ0E7YUFFREYsVUFBaUJBLEtBQVlBO1lBRTVCRSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUVwQkEsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0E7UUFDckJBLENBQUNBOzs7T0FQQUY7SUFZREEsc0JBQVdBLGlDQUFLQTtRQUhoQkE7O1dBRUdBO2FBQ0hBO1lBRUNHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO1FBQ3BCQSxDQUFDQTthQUVESCxVQUFpQkEsS0FBWUE7WUFFNUJHLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLEtBQUtBLENBQUNBO1lBRXBCQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxDQUFDQTtRQUNyQkEsQ0FBQ0E7OztPQVBBSDtJQVlEQSxzQkFBV0EsZ0NBQUlBO1FBSGZBOztXQUVHQTthQUNIQTtZQUVDSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQTtRQUNuQkEsQ0FBQ0E7YUFFREosVUFBZ0JBLEtBQVlBO1lBRTNCSSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUNwQkEsQ0FBQ0E7OztPQUxBSjtJQU9EQTs7T0FFR0E7SUFDSUEsc0NBQWFBLEdBQXBCQSxVQUFxQkEsWUFBNkJBLEVBQUVBLHNCQUE2Q0E7UUFFaEdLLElBQUlBLElBQUlBLEdBQVVBLEVBQUVBLENBQUNBO1FBRXJCQSxJQUFJQSxPQUFPQSxHQUF5QkEsc0JBQXNCQSxDQUFDQSxxQkFBcUJBLEVBQUVBLENBQUNBO1FBQ25GQSxzQkFBc0JBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsSUFBSUEsRUFBRUEsZUFBZUEsQ0FBQ0EsUUFBUUEsRUFBRUEsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFFdkZBLElBQUlBLFNBQVNBLEdBQVVBLElBQUlBLENBQUNBLEtBQUtBLElBQUlBLEdBQUdBLEdBQUVBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLElBQUlBLEdBQUdBLEdBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO1FBRXpFQSxJQUFJQSxNQUFNQSxHQUF5QkEsSUFBSUEscUJBQXFCQSxDQUFDQSxzQkFBc0JBLENBQUNBLFFBQVFBLENBQUNBLE9BQU9BLEVBQUVBLHNCQUFzQkEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsRUFBRUEsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFFeEpBLElBQUlBLEdBQUdBLEdBQXlCQSxzQkFBc0JBLENBQUNBLHVCQUF1QkEsRUFBRUEsQ0FBQ0E7UUFFakZBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLElBQUlBLENBQUNBLENBQUNBO1lBQ3BCQSxJQUFJQSxJQUFJQSxNQUFNQSxHQUFHQSxNQUFNQSxHQUFHQSxHQUFHQSxHQUFHQSxNQUFNQSxHQUFHQSxHQUFHQSxHQUFHQSxPQUFPQSxHQUFHQSxNQUFNQSxDQUFDQTtRQUVqRUEsSUFBSUEsSUFBSUEsTUFBTUEsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0Esc0JBQXNCQSxDQUFDQSxVQUFVQSxHQUFHQSxHQUFHQSxHQUFHQSxPQUFPQSxHQUFHQSxNQUFNQSxDQUFDQTtRQUN4RkEsSUFBSUEsSUFBSUEsTUFBTUEsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDeENBLElBQUlBLElBQUlBLE1BQU1BLEdBQUdBLE1BQU1BLEdBQUdBLEdBQUdBLEdBQUdBLE1BQU1BLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBO1FBRTFEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNiQSxDQUFDQTtJQUVETDs7T0FFR0E7SUFDSUEsMENBQWlCQSxHQUF4QkEsVUFBeUJBLFFBQXFCQTtRQUU3Q00sTUFBTUEsQ0FBbUJBLFFBQVFBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7SUFDM0RBLENBQUNBO0lBRU9OLHFDQUFZQSxHQUFwQkE7UUFFQ08sSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsSUFBSUEsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBQ0EsQ0FBQ0EsR0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDeEVBLENBQUNBO0lBRURQOztPQUVHQTtJQUNJQSxrREFBeUJBLEdBQWhDQSxVQUFpQ0Esb0JBQXlDQTtRQUV6RVEsb0JBQW9CQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQTtJQUN2Q0EsQ0FBQ0E7SUE1SERSOztPQUVHQTtJQUNXQSxxQkFBTUEsR0FBVUEsR0FBR0EsQ0FBQ0E7SUFFbENBOztPQUVHQTtJQUNXQSxxQkFBTUEsR0FBVUEsR0FBR0EsQ0FBQ0E7SUFxSG5DQSxxQkFBQ0E7QUFBREEsQ0FsSUEsQUFrSUNBLEVBbEk0QixnQkFBZ0IsRUFrSTVDO0FBRUQsQUFBd0IsaUJBQWYsY0FBYyxDQUFDIiwiZmlsZSI6ImFuaW1hdG9ycy9ub2Rlcy9QYXJ0aWNsZVVWTm9kZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1ZlY3RvcjNEXCIpO1xyXG5cclxuaW1wb3J0IEFuaW1hdG9yQmFzZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvQW5pbWF0b3JCYXNlXCIpO1xyXG5pbXBvcnQgQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9BbmltYXRpb25SZWdpc3RlckNhY2hlXCIpO1xyXG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcclxuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckVsZW1lbnRcIik7XHJcblxyXG5pbXBvcnQgUGFydGljbGVBbmltYXRpb25TZXRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvUGFydGljbGVBbmltYXRpb25TZXRcIik7XHJcbmltcG9ydCBQYXJ0aWNsZVByb3BlcnRpZXNcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9QYXJ0aWNsZVByb3BlcnRpZXNcIik7XHJcbmltcG9ydCBQYXJ0aWNsZVByb3BlcnRpZXNNb2RlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1BhcnRpY2xlUHJvcGVydGllc01vZGVcIik7XHJcbmltcG9ydCBQYXJ0aWNsZU5vZGVCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvUGFydGljbGVOb2RlQmFzZVwiKTtcclxuaW1wb3J0IFBhcnRpY2xlVVZTdGF0ZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL3N0YXRlcy9QYXJ0aWNsZVVWU3RhdGVcIik7XHJcblxyXG4vKipcclxuICogQSBwYXJ0aWNsZSBhbmltYXRpb24gbm9kZSB1c2VkIHRvIGNvbnRyb2wgdGhlIFVWIG9mZnNldCBhbmQgc2NhbGUgb2YgYSBwYXJ0aWNsZSBvdmVyIHRpbWUuXHJcbiAqL1xyXG5jbGFzcyBQYXJ0aWNsZVVWTm9kZSBleHRlbmRzIFBhcnRpY2xlTm9kZUJhc2Vcclxue1xyXG5cdC8qKiBAcHJpdmF0ZSAqL1xyXG5cdHB1YmxpYyBfaVV2RGF0YTpWZWN0b3IzRDtcclxuXHJcblx0LyoqXHJcblx0ICpcclxuXHQgKi9cclxuXHRwdWJsaWMgc3RhdGljIFVfQVhJUzpzdHJpbmcgPSBcInhcIjtcclxuXHJcblx0LyoqXHJcblx0ICpcclxuXHQgKi9cclxuXHRwdWJsaWMgc3RhdGljIFZfQVhJUzpzdHJpbmcgPSBcInlcIjtcclxuXHJcblx0cHJpdmF0ZSBfY3ljbGU6bnVtYmVyO1xyXG5cdHByaXZhdGUgX3NjYWxlOm51bWJlcjtcclxuXHRwcml2YXRlIF9heGlzOnN0cmluZztcclxuXHJcblx0LyoqXHJcblx0ICogQ3JlYXRlcyBhIG5ldyA8Y29kZT5QYXJ0aWNsZVRpbWVOb2RlPC9jb2RlPlxyXG5cdCAqXHJcblx0ICogQHBhcmFtICAgICAgICAgICAgICAgbW9kZSAgICAgICAgICAgIERlZmluZXMgd2hldGhlciB0aGUgbW9kZSBvZiBvcGVyYXRpb24gYWN0cyBvbiBsb2NhbCBwcm9wZXJ0aWVzIG9mIGEgcGFydGljbGUgb3IgZ2xvYmFsIHByb3BlcnRpZXMgb2YgdGhlIG5vZGUuXHJcblx0ICogQHBhcmFtICAgIFtvcHRpb25hbF0gY3ljbGUgICAgICAgICAgIERlZmluZXMgd2hldGhlciB0aGUgdGltZSB0cmFjayBpcyBpbiBsb29wIG1vZGUuIERlZmF1bHRzIHRvIGZhbHNlLlxyXG5cdCAqIEBwYXJhbSAgICBbb3B0aW9uYWxdIHNjYWxlICAgICAgICAgICBEZWZpbmVzIHdoZXRoZXIgdGhlIHRpbWUgdHJhY2sgaXMgaW4gbG9vcCBtb2RlLiBEZWZhdWx0cyB0byBmYWxzZS5cclxuXHQgKiBAcGFyYW0gICAgW29wdGlvbmFsXSBheGlzICAgICAgICAgICAgRGVmaW5lcyB3aGV0aGVyIHRoZSB0aW1lIHRyYWNrIGlzIGluIGxvb3AgbW9kZS4gRGVmYXVsdHMgdG8gZmFsc2UuXHJcblx0ICovXHJcblx0Y29uc3RydWN0b3IobW9kZTpudW1iZXIgLyp1aW50Ki8sIGN5Y2xlOm51bWJlciA9IDEsIHNjYWxlOm51bWJlciA9IDEsIGF4aXM6c3RyaW5nID0gXCJ4XCIpXHJcblx0e1xyXG5cdFx0Ly9iZWNhdXNlIG9mIHRoZSBzdGFnZTNkIHJlZ2lzdGVyIGxpbWl0YXRpb24sIGl0IG9ubHkgc3VwcG9ydCB0aGUgZ2xvYmFsIG1vZGVcclxuXHRcdHN1cGVyKFwiUGFydGljbGVVVlwiLCBQYXJ0aWNsZVByb3BlcnRpZXNNb2RlLkdMT0JBTCwgNCwgUGFydGljbGVBbmltYXRpb25TZXQuUE9TVF9QUklPUklUWSArIDEpO1xyXG5cclxuXHRcdHRoaXMuX3BTdGF0ZUNsYXNzID0gUGFydGljbGVVVlN0YXRlO1xyXG5cclxuXHRcdHRoaXMuX2N5Y2xlID0gY3ljbGU7XHJcblx0XHR0aGlzLl9zY2FsZSA9IHNjYWxlO1xyXG5cdFx0dGhpcy5fYXhpcyA9IGF4aXM7XHJcblxyXG5cdFx0dGhpcy51cGRhdGVVVkRhdGEoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICovXHJcblx0cHVibGljIGdldCBjeWNsZSgpOm51bWJlclxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9jeWNsZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgY3ljbGUodmFsdWU6bnVtYmVyKVxyXG5cdHtcclxuXHRcdHRoaXMuX2N5Y2xlID0gdmFsdWU7XHJcblxyXG5cdFx0dGhpcy51cGRhdGVVVkRhdGEoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICovXHJcblx0cHVibGljIGdldCBzY2FsZSgpOm51bWJlclxyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9zY2FsZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgc2NhbGUodmFsdWU6bnVtYmVyKVxyXG5cdHtcclxuXHRcdHRoaXMuX3NjYWxlID0gdmFsdWU7XHJcblxyXG5cdFx0dGhpcy51cGRhdGVVVkRhdGEoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICovXHJcblx0cHVibGljIGdldCBheGlzKCk6c3RyaW5nXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2F4aXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGF4aXModmFsdWU6c3RyaW5nKVxyXG5cdHtcclxuXHRcdHRoaXMuX2F4aXMgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIGdldEFHQUxVVkNvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGU6QW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSk6c3RyaW5nXHJcblx0e1xyXG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gXCJcIjtcclxuXHJcblx0XHR2YXIgdXZDb25zdDpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSBhbmltYXRpb25SZWdpc3RlckNhY2hlLmdldEZyZWVWZXJ0ZXhDb25zdGFudCgpO1xyXG5cdFx0YW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5zZXRSZWdpc3RlckluZGV4KHRoaXMsIFBhcnRpY2xlVVZTdGF0ZS5VVl9JTkRFWCwgdXZDb25zdC5pbmRleCk7XHJcblxyXG5cdFx0dmFyIGF4aXNJbmRleDpudW1iZXIgPSB0aGlzLl9heGlzID09IFwieFwiPyAwIDogKHRoaXMuX2F4aXMgPT0gXCJ5XCI/IDEgOiAyKTtcclxuXHJcblx0XHR2YXIgdGFyZ2V0OlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IG5ldyBTaGFkZXJSZWdpc3RlckVsZW1lbnQoYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS51dlRhcmdldC5yZWdOYW1lLCBhbmltYXRpb25SZWdpc3RlckNhY2hlLnV2VGFyZ2V0LmluZGV4LCBheGlzSW5kZXgpO1xyXG5cclxuXHRcdHZhciBzaW46U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5nZXRGcmVlVmVydGV4U2luZ2xlVGVtcCgpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9zY2FsZSAhPSAxKVxyXG5cdFx0XHRjb2RlICs9IFwibXVsIFwiICsgdGFyZ2V0ICsgXCIsXCIgKyB0YXJnZXQgKyBcIixcIiArIHV2Q29uc3QgKyBcIi55XFxuXCI7XHJcblxyXG5cdFx0Y29kZSArPSBcIm11bCBcIiArIHNpbiArIFwiLFwiICsgYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS52ZXJ0ZXhUaW1lICsgXCIsXCIgKyB1dkNvbnN0ICsgXCIueFxcblwiO1xyXG5cdFx0Y29kZSArPSBcInNpbiBcIiArIHNpbiArIFwiLFwiICsgc2luICsgXCJcXG5cIjtcclxuXHRcdGNvZGUgKz0gXCJhZGQgXCIgKyB0YXJnZXQgKyBcIixcIiArIHRhcmdldCArIFwiLFwiICsgc2luICsgXCJcXG5cIjtcclxuXHJcblx0XHRyZXR1cm4gY29kZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIGdldEFuaW1hdGlvblN0YXRlKGFuaW1hdG9yOkFuaW1hdG9yQmFzZSk6UGFydGljbGVVVlN0YXRlXHJcblx0e1xyXG5cdFx0cmV0dXJuIDxQYXJ0aWNsZVVWU3RhdGU+IGFuaW1hdG9yLmdldEFuaW1hdGlvblN0YXRlKHRoaXMpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSB1cGRhdGVVVkRhdGEoKVxyXG5cdHtcclxuXHRcdHRoaXMuX2lVdkRhdGEgPSBuZXcgVmVjdG9yM0QoTWF0aC5QSSoyL3RoaXMuX2N5Y2xlLCB0aGlzLl9zY2FsZSwgMCwgMCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBfaVByb2Nlc3NBbmltYXRpb25TZXR0aW5nKHBhcnRpY2xlQW5pbWF0aW9uU2V0OlBhcnRpY2xlQW5pbWF0aW9uU2V0KVxyXG5cdHtcclxuXHRcdHBhcnRpY2xlQW5pbWF0aW9uU2V0Lmhhc1VWTm9kZSA9IHRydWU7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgPSBQYXJ0aWNsZVVWTm9kZTsiXX0=