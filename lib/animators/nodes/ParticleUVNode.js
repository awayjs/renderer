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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvcGFydGljbGV1dm5vZGUudHMiXSwibmFtZXMiOlsiUGFydGljbGVVVk5vZGUiLCJQYXJ0aWNsZVVWTm9kZS5jb25zdHJ1Y3RvciIsIlBhcnRpY2xlVVZOb2RlLmN5Y2xlIiwiUGFydGljbGVVVk5vZGUuc2NhbGUiLCJQYXJ0aWNsZVVWTm9kZS5heGlzIiwiUGFydGljbGVVVk5vZGUuZ2V0QUdBTFVWQ29kZSIsIlBhcnRpY2xlVVZOb2RlLmdldEFuaW1hdGlvblN0YXRlIiwiUGFydGljbGVVVk5vZGUudXBkYXRlVVZEYXRhIiwiUGFydGljbGVVVk5vZGUuX2lQcm9jZXNzQW5pbWF0aW9uU2V0dGluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTyxRQUFRLFdBQWlCLCtCQUErQixDQUFDLENBQUM7QUFLakUsSUFBTyxxQkFBcUIsV0FBYSx5REFBeUQsQ0FBQyxDQUFDO0FBRXBHLElBQU8sb0JBQW9CLFdBQWMsc0RBQXNELENBQUMsQ0FBQztBQUVqRyxJQUFPLHNCQUFzQixXQUFhLDZEQUE2RCxDQUFDLENBQUM7QUFDekcsSUFBTyxnQkFBZ0IsV0FBZSx3REFBd0QsQ0FBQyxDQUFDO0FBQ2hHLElBQU8sZUFBZSxXQUFlLHdEQUF3RCxDQUFDLENBQUM7QUFFL0YsQUFHQTs7R0FERztJQUNHLGNBQWM7SUFBU0EsVUFBdkJBLGNBQWNBLFVBQXlCQTtJQW1CNUNBOzs7Ozs7O09BT0dBO0lBQ0hBLFNBM0JLQSxjQUFjQSxDQTJCUEEsSUFBSUEsQ0FBUUEsUUFBREEsQUFBU0EsRUFBRUEsS0FBZ0JBLEVBQUVBLEtBQWdCQSxFQUFFQSxJQUFpQkE7UUFBckRDLHFCQUFnQkEsR0FBaEJBLFNBQWdCQTtRQUFFQSxxQkFBZ0JBLEdBQWhCQSxTQUFnQkE7UUFBRUEsb0JBQWlCQSxHQUFqQkEsVUFBaUJBO1FBRXRGQSxBQUNBQSw2RUFENkVBO1FBQzdFQSxrQkFBTUEsWUFBWUEsRUFBRUEsc0JBQXNC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SUEsSUFBSUEsTUFBTUEsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDeENBLElBQUlBLElBQUlBLE1BQU1BLEdBQUdBLE1BQU1BLEdBQUdBLEdBQUdBLEdBQUdBLE1BQU1BLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBO1FBRTFEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNiQSxDQUFDQTtJQUVETDs7T0FFR0E7SUFDSUEsMENBQWlCQSxHQUF4QkEsVUFBeUJBLFFBQXFCQTtRQUU3Q00sTUFBTUEsQ0FBbUJBLFFBQVFBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7SUFDM0RBLENBQUNBO0lBRU9OLHFDQUFZQSxHQUFwQkE7UUFFQ08sSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsSUFBSUEsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBQ0EsQ0FBQ0EsR0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDeEVBLENBQUNBO0lBRURQOztPQUVHQTtJQUNJQSxrREFBeUJBLEdBQWhDQSxVQUFpQ0Esb0JBQXlDQTtRQUV6RVEsb0JBQW9CQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQTtJQUN2Q0EsQ0FBQ0E7SUE1SERSOztPQUVHQTtJQUNXQSxxQkFBTUEsR0FBVUEsR0FBR0EsQ0FBQ0E7SUFFbENBOztPQUVHQTtJQUNXQSxxQkFBTUEsR0FBVUEsR0FBR0EsQ0FBQ0E7SUFxSG5DQSxxQkFBQ0E7QUFBREEsQ0FsSUEsQUFrSUNBLEVBbEk0QixnQkFBZ0IsRUFrSTVDO0FBRUQsQUFBd0IsaUJBQWYsY0FBYyxDQUFDIiwiZmlsZSI6ImFuaW1hdG9ycy9ub2Rlcy9QYXJ0aWNsZVVWTm9kZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1ZlY3RvcjNEXCIpO1xuXG5pbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XG5pbXBvcnQgQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9BbmltYXRpb25SZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJFbGVtZW50XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRWxlbWVudFwiKTtcblxuaW1wb3J0IFBhcnRpY2xlQW5pbWF0aW9uU2V0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL1BhcnRpY2xlQW5pbWF0aW9uU2V0XCIpO1xuaW1wb3J0IFBhcnRpY2xlUHJvcGVydGllc1x0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1BhcnRpY2xlUHJvcGVydGllc1wiKTtcbmltcG9ydCBQYXJ0aWNsZVByb3BlcnRpZXNNb2RlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1BhcnRpY2xlUHJvcGVydGllc01vZGVcIik7XG5pbXBvcnQgUGFydGljbGVOb2RlQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL25vZGVzL1BhcnRpY2xlTm9kZUJhc2VcIik7XG5pbXBvcnQgUGFydGljbGVVVlN0YXRlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL1BhcnRpY2xlVVZTdGF0ZVwiKTtcblxuLyoqXG4gKiBBIHBhcnRpY2xlIGFuaW1hdGlvbiBub2RlIHVzZWQgdG8gY29udHJvbCB0aGUgVVYgb2Zmc2V0IGFuZCBzY2FsZSBvZiBhIHBhcnRpY2xlIG92ZXIgdGltZS5cbiAqL1xuY2xhc3MgUGFydGljbGVVVk5vZGUgZXh0ZW5kcyBQYXJ0aWNsZU5vZGVCYXNlXG57XG5cdC8qKiBAcHJpdmF0ZSAqL1xuXHRwdWJsaWMgX2lVdkRhdGE6VmVjdG9yM0Q7XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIFVfQVhJUzpzdHJpbmcgPSBcInhcIjtcblxuXHQvKipcblx0ICpcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgVl9BWElTOnN0cmluZyA9IFwieVwiO1xuXG5cdHByaXZhdGUgX2N5Y2xlOm51bWJlcjtcblx0cHJpdmF0ZSBfc2NhbGU6bnVtYmVyO1xuXHRwcml2YXRlIF9heGlzOnN0cmluZztcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyA8Y29kZT5QYXJ0aWNsZVRpbWVOb2RlPC9jb2RlPlxuXHQgKlxuXHQgKiBAcGFyYW0gICAgICAgICAgICAgICBtb2RlICAgICAgICAgICAgRGVmaW5lcyB3aGV0aGVyIHRoZSBtb2RlIG9mIG9wZXJhdGlvbiBhY3RzIG9uIGxvY2FsIHByb3BlcnRpZXMgb2YgYSBwYXJ0aWNsZSBvciBnbG9iYWwgcHJvcGVydGllcyBvZiB0aGUgbm9kZS5cblx0ICogQHBhcmFtICAgIFtvcHRpb25hbF0gY3ljbGUgICAgICAgICAgIERlZmluZXMgd2hldGhlciB0aGUgdGltZSB0cmFjayBpcyBpbiBsb29wIG1vZGUuIERlZmF1bHRzIHRvIGZhbHNlLlxuXHQgKiBAcGFyYW0gICAgW29wdGlvbmFsXSBzY2FsZSAgICAgICAgICAgRGVmaW5lcyB3aGV0aGVyIHRoZSB0aW1lIHRyYWNrIGlzIGluIGxvb3AgbW9kZS4gRGVmYXVsdHMgdG8gZmFsc2UuXG5cdCAqIEBwYXJhbSAgICBbb3B0aW9uYWxdIGF4aXMgICAgICAgICAgICBEZWZpbmVzIHdoZXRoZXIgdGhlIHRpbWUgdHJhY2sgaXMgaW4gbG9vcCBtb2RlLiBEZWZhdWx0cyB0byBmYWxzZS5cblx0ICovXG5cdGNvbnN0cnVjdG9yKG1vZGU6bnVtYmVyIC8qdWludCovLCBjeWNsZTpudW1iZXIgPSAxLCBzY2FsZTpudW1iZXIgPSAxLCBheGlzOnN0cmluZyA9IFwieFwiKVxuXHR7XG5cdFx0Ly9iZWNhdXNlIG9mIHRoZSBzdGFnZTNkIHJlZ2lzdGVyIGxpbWl0YXRpb24sIGl0IG9ubHkgc3VwcG9ydCB0aGUgZ2xvYmFsIG1vZGVcblx0XHRzdXBlcihcIlBhcnRpY2xlVVZcIiwgUGFydGljbGVQcm9wZXJ0aWVzTW9kZS5HTE9CQUwsIDQsIFBhcnRpY2xlQW5pbWF0aW9uU2V0LlBPU1RfUFJJT1JJVFkgKyAxKTtcblxuXHRcdHRoaXMuX3BTdGF0ZUNsYXNzID0gUGFydGljbGVVVlN0YXRlO1xuXG5cdFx0dGhpcy5fY3ljbGUgPSBjeWNsZTtcblx0XHR0aGlzLl9zY2FsZSA9IHNjYWxlO1xuXHRcdHRoaXMuX2F4aXMgPSBheGlzO1xuXG5cdFx0dGhpcy51cGRhdGVVVkRhdGEoKTtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIGdldCBjeWNsZSgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2N5Y2xlO1xuXHR9XG5cblx0cHVibGljIHNldCBjeWNsZSh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9jeWNsZSA9IHZhbHVlO1xuXG5cdFx0dGhpcy51cGRhdGVVVkRhdGEoKTtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIGdldCBzY2FsZSgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3NjYWxlO1xuXHR9XG5cblx0cHVibGljIHNldCBzY2FsZSh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9zY2FsZSA9IHZhbHVlO1xuXG5cdFx0dGhpcy51cGRhdGVVVkRhdGEoKTtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKi9cblx0cHVibGljIGdldCBheGlzKCk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYXhpcztcblx0fVxuXG5cdHB1YmxpYyBzZXQgYXhpcyh2YWx1ZTpzdHJpbmcpXG5cdHtcblx0XHR0aGlzLl9heGlzID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBnZXRBR0FMVVZDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBhbmltYXRpb25SZWdpc3RlckNhY2hlOkFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gXCJcIjtcblxuXHRcdHZhciB1dkNvbnN0OlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZVZlcnRleENvbnN0YW50KCk7XG5cdFx0YW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5zZXRSZWdpc3RlckluZGV4KHRoaXMsIFBhcnRpY2xlVVZTdGF0ZS5VVl9JTkRFWCwgdXZDb25zdC5pbmRleCk7XG5cblx0XHR2YXIgYXhpc0luZGV4Om51bWJlciA9IHRoaXMuX2F4aXMgPT0gXCJ4XCI/IDAgOiAodGhpcy5fYXhpcyA9PSBcInlcIj8gMSA6IDIpO1xuXG5cdFx0dmFyIHRhcmdldDpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSBuZXcgU2hhZGVyUmVnaXN0ZXJFbGVtZW50KGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudXZUYXJnZXQucmVnTmFtZSwgYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS51dlRhcmdldC5pbmRleCwgYXhpc0luZGV4KTtcblxuXHRcdHZhciBzaW46U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5nZXRGcmVlVmVydGV4U2luZ2xlVGVtcCgpO1xuXG5cdFx0aWYgKHRoaXMuX3NjYWxlICE9IDEpXG5cdFx0XHRjb2RlICs9IFwibXVsIFwiICsgdGFyZ2V0ICsgXCIsXCIgKyB0YXJnZXQgKyBcIixcIiArIHV2Q29uc3QgKyBcIi55XFxuXCI7XG5cblx0XHRjb2RlICs9IFwibXVsIFwiICsgc2luICsgXCIsXCIgKyBhbmltYXRpb25SZWdpc3RlckNhY2hlLnZlcnRleFRpbWUgKyBcIixcIiArIHV2Q29uc3QgKyBcIi54XFxuXCI7XG5cdFx0Y29kZSArPSBcInNpbiBcIiArIHNpbiArIFwiLFwiICsgc2luICsgXCJcXG5cIjtcblx0XHRjb2RlICs9IFwiYWRkIFwiICsgdGFyZ2V0ICsgXCIsXCIgKyB0YXJnZXQgKyBcIixcIiArIHNpbiArIFwiXFxuXCI7XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldEFuaW1hdGlvblN0YXRlKGFuaW1hdG9yOkFuaW1hdG9yQmFzZSk6UGFydGljbGVVVlN0YXRlXG5cdHtcblx0XHRyZXR1cm4gPFBhcnRpY2xlVVZTdGF0ZT4gYW5pbWF0b3IuZ2V0QW5pbWF0aW9uU3RhdGUodGhpcyk7XG5cdH1cblxuXHRwcml2YXRlIHVwZGF0ZVVWRGF0YSgpXG5cdHtcblx0XHR0aGlzLl9pVXZEYXRhID0gbmV3IFZlY3RvcjNEKE1hdGguUEkqMi90aGlzLl9jeWNsZSwgdGhpcy5fc2NhbGUsIDAsIDApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX2lQcm9jZXNzQW5pbWF0aW9uU2V0dGluZyhwYXJ0aWNsZUFuaW1hdGlvblNldDpQYXJ0aWNsZUFuaW1hdGlvblNldClcblx0e1xuXHRcdHBhcnRpY2xlQW5pbWF0aW9uU2V0Lmhhc1VWTm9kZSA9IHRydWU7XG5cdH1cbn1cblxuZXhwb3J0ID0gUGFydGljbGVVVk5vZGU7Il19