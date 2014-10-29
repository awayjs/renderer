var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleTimeState = (function (_super) {
    __extends(ParticleTimeState, _super);
    function ParticleTimeState(animator, particleTimeNode) {
        _super.call(this, animator, particleTimeNode, true);
        this._particleTimeNode = particleTimeNode;
    }
    ParticleTimeState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleTimeState.TIME_STREAM_INDEX), this._particleTimeNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
        var particleTime = this._pTime / 1000;
        animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleTimeState.TIME_CONSTANT_INDEX), particleTime, particleTime, particleTime, particleTime);
    };
    /** @private */
    ParticleTimeState.TIME_STREAM_INDEX = 0;
    /** @private */
    ParticleTimeState.TIME_CONSTANT_INDEX = 1;
    return ParticleTimeState;
})(ParticleStateBase);
module.exports = ParticleTimeState;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL3BhcnRpY2xldGltZXN0YXRlLnRzIl0sIm5hbWVzIjpbIlBhcnRpY2xlVGltZVN0YXRlIiwiUGFydGljbGVUaW1lU3RhdGUuY29uc3RydWN0b3IiLCJQYXJ0aWNsZVRpbWVTdGF0ZS5zZXRSZW5kZXJTdGF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBS0EsSUFBTywyQkFBMkIsV0FBWSxxREFBcUQsQ0FBQyxDQUFDO0FBTXJHLElBQU8saUJBQWlCLFdBQWMsMERBQTBELENBQUMsQ0FBQztBQUVsRyxBQUdBOztHQURHO0lBQ0csaUJBQWlCO0lBQVNBLFVBQTFCQSxpQkFBaUJBLFVBQTBCQTtJQVVoREEsU0FWS0EsaUJBQWlCQSxDQVVWQSxRQUF5QkEsRUFBRUEsZ0JBQWlDQTtRQUV2RUMsa0JBQU1BLFFBQVFBLEVBQUVBLGdCQUFnQkEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFFeENBLElBQUlBLENBQUNBLGlCQUFpQkEsR0FBR0EsZ0JBQWdCQSxDQUFDQTtJQUMzQ0EsQ0FBQ0E7SUFFTUQsMENBQWNBLEdBQXJCQSxVQUFzQkEsS0FBV0EsRUFBRUEsVUFBeUJBLEVBQUVBLG9CQUF5Q0EsRUFBRUEsc0JBQTZDQSxFQUFFQSxNQUFhQTtRQUVwS0Usb0JBQW9CQSxDQUFDQSxvQkFBb0JBLENBQUNBLHNCQUFzQkEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxFQUFFQSxpQkFBaUJBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxZQUFZQSxFQUFFQSxLQUFLQSxFQUFFQSwyQkFBMkJBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO1FBRS9OQSxJQUFJQSxZQUFZQSxHQUFVQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFDQSxJQUFJQSxDQUFDQTtRQUMzQ0Esc0JBQXNCQSxDQUFDQSxjQUFjQSxDQUFDQSxzQkFBc0JBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsRUFBRUEsaUJBQWlCQSxDQUFDQSxtQkFBbUJBLENBQUNBLEVBQUVBLFlBQVlBLEVBQUVBLFlBQVlBLEVBQUVBLFlBQVlBLEVBQUVBLFlBQVlBLENBQUNBLENBQUNBO0lBQ3JNQSxDQUFDQTtJQXJCREYsZUFBZUE7SUFDREEsbUNBQWlCQSxHQUFtQkEsQ0FBQ0EsQ0FBQ0E7SUFFcERBLGVBQWVBO0lBQ0RBLHFDQUFtQkEsR0FBbUJBLENBQUNBLENBQUNBO0lBbUJ2REEsd0JBQUNBO0FBQURBLENBekJBLEFBeUJDQSxFQXpCK0IsaUJBQWlCLEVBeUJoRDtBQUVELEFBQTJCLGlCQUFsQixpQkFBaUIsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvc3RhdGVzL1BhcnRpY2xlVGltZVN0YXRlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDYW1lcmFcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9DYW1lcmFcIik7XG5cbmltcG9ydCBBbmltYXRpb25SZWdpc3RlckNhY2hlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2FuaW1hdG9ycy9kYXRhL0FuaW1hdGlvblJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuaW1wb3J0IFJlbmRlcmFibGVCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9wb29sL1JlbmRlcmFibGVCYXNlXCIpO1xuaW1wb3J0IENvbnRleHRHTFZlcnRleEJ1ZmZlckZvcm1hdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9Db250ZXh0R0xWZXJ0ZXhCdWZmZXJGb3JtYXRcIik7XG5cbmltcG9ydCBQYXJ0aWNsZUFuaW1hdG9yXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvUGFydGljbGVBbmltYXRvclwiKTtcbmltcG9ydCBBbmltYXRpb25TdWJHZW9tZXRyeVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL0FuaW1hdGlvblN1Ykdlb21ldHJ5XCIpO1xuaW1wb3J0IFBhcnRpY2xlUHJvcGVydGllc01vZGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvUGFydGljbGVQcm9wZXJ0aWVzTW9kZVwiKTtcbmltcG9ydCBQYXJ0aWNsZVRpbWVOb2RlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvUGFydGljbGVUaW1lTm9kZVwiKTtcbmltcG9ydCBQYXJ0aWNsZVN0YXRlQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9zdGF0ZXMvUGFydGljbGVTdGF0ZUJhc2VcIik7XG5cbi8qKlxuICogLi4uXG4gKi9cbmNsYXNzIFBhcnRpY2xlVGltZVN0YXRlIGV4dGVuZHMgUGFydGljbGVTdGF0ZUJhc2Vcbntcblx0LyoqIEBwcml2YXRlICovXG5cdHB1YmxpYyBzdGF0aWMgVElNRV9TVFJFQU1fSU5ERVg6bnVtYmVyIC8qdWludCovID0gMDtcblxuXHQvKiogQHByaXZhdGUgKi9cblx0cHVibGljIHN0YXRpYyBUSU1FX0NPTlNUQU5UX0lOREVYOm51bWJlciAvKnVpbnQqLyA9IDE7XG5cblx0cHJpdmF0ZSBfcGFydGljbGVUaW1lTm9kZTpQYXJ0aWNsZVRpbWVOb2RlO1xuXG5cdGNvbnN0cnVjdG9yKGFuaW1hdG9yOlBhcnRpY2xlQW5pbWF0b3IsIHBhcnRpY2xlVGltZU5vZGU6UGFydGljbGVUaW1lTm9kZSlcblx0e1xuXHRcdHN1cGVyKGFuaW1hdG9yLCBwYXJ0aWNsZVRpbWVOb2RlLCB0cnVlKTtcblxuXHRcdHRoaXMuX3BhcnRpY2xlVGltZU5vZGUgPSBwYXJ0aWNsZVRpbWVOb2RlO1xuXHR9XG5cblx0cHVibGljIHNldFJlbmRlclN0YXRlKHN0YWdlOlN0YWdlLCByZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCBhbmltYXRpb25TdWJHZW9tZXRyeTpBbmltYXRpb25TdWJHZW9tZXRyeSwgYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZTpBbmltYXRpb25SZWdpc3RlckNhY2hlLCBjYW1lcmE6Q2FtZXJhKVxuXHR7XG5cdFx0YW5pbWF0aW9uU3ViR2VvbWV0cnkuYWN0aXZhdGVWZXJ0ZXhCdWZmZXIoYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5nZXRSZWdpc3RlckluZGV4KHRoaXMuX3BBbmltYXRpb25Ob2RlLCBQYXJ0aWNsZVRpbWVTdGF0ZS5USU1FX1NUUkVBTV9JTkRFWCksIHRoaXMuX3BhcnRpY2xlVGltZU5vZGUuX2lEYXRhT2Zmc2V0LCBzdGFnZSwgQ29udGV4dEdMVmVydGV4QnVmZmVyRm9ybWF0LkZMT0FUXzQpO1xuXG5cdFx0dmFyIHBhcnRpY2xlVGltZTpudW1iZXIgPSB0aGlzLl9wVGltZS8xMDAwO1xuXHRcdGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuc2V0VmVydGV4Q29uc3QoYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5nZXRSZWdpc3RlckluZGV4KHRoaXMuX3BBbmltYXRpb25Ob2RlLCBQYXJ0aWNsZVRpbWVTdGF0ZS5USU1FX0NPTlNUQU5UX0lOREVYKSwgcGFydGljbGVUaW1lLCBwYXJ0aWNsZVRpbWUsIHBhcnRpY2xlVGltZSwgcGFydGljbGVUaW1lKTtcblx0fVxuXG59XG5cbmV4cG9ydCA9IFBhcnRpY2xlVGltZVN0YXRlOyJdfQ==