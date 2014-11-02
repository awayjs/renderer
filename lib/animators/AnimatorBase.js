var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetType = require("awayjs-core/lib/library/AssetType");
var NamedAssetBase = require("awayjs-core/lib/library/NamedAssetBase");
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var getTimer = require("awayjs-core/lib/utils/getTimer");
var AnimatorEvent = require("awayjs-renderergl/lib/events/AnimatorEvent");
/**
 * Dispatched when playback of an animation inside the animator object starts.
 *
 * @eventType away3d.events.AnimatorEvent
 */
//[Event(name="start", type="away3d.events.AnimatorEvent")]
/**
 * Dispatched when playback of an animation inside the animator object stops.
 *
 * @eventType away3d.events.AnimatorEvent
 */
//[Event(name="stop", type="away3d.events.AnimatorEvent")]
/**
 * Dispatched when playback of an animation reaches the end of an animation.
 *
 * @eventType away3d.events.AnimatorEvent
 */
//[Event(name="cycle_complete", type="away3d.events.AnimatorEvent")]
/**
 * Provides an abstract base class for animator classes that control animation output from a data set subtype of <code>AnimationSetBase</code>.
 *
 * @see away.animators.AnimationSetBase
 */
var AnimatorBase = (function (_super) {
    __extends(AnimatorBase, _super);
    /**
     * Creates a new <code>AnimatorBase</code> object.
     *
     * @param animationSet The animation data set to be used by the animator object.
     */
    function AnimatorBase(animationSet) {
        _super.call(this);
        this._autoUpdate = true;
        this._time = 0;
        this._playbackSpeed = 1;
        this._pOwners = new Array();
        this._pAbsoluteTime = 0;
        this._animationStates = new Object();
        /**
         * Enables translation of the animated mesh from data returned per frame via the positionDelta property of the active animation node. Defaults to true.
         *
         * @see away.animators.IAnimationState#positionDelta
         */
        this.updatePosition = true;
        this._pAnimationSet = animationSet;
        this._broadcaster = new RequestAnimationFrame(this.onEnterFrame, this);
    }
    AnimatorBase.prototype.getAnimationState = function (node) {
        var className = node.stateClass;
        var uID = node.id;
        if (this._animationStates[uID] == null)
            this._animationStates[uID] = new className(this, node);
        return this._animationStates[uID];
    };
    AnimatorBase.prototype.getAnimationStateByName = function (name) {
        return this.getAnimationState(this._pAnimationSet.getAnimation(name));
    };
    Object.defineProperty(AnimatorBase.prototype, "absoluteTime", {
        /**
         * Returns the internal absolute time of the animator, calculated by the current time and the playback speed.
         *
         * @see #time
         * @see #playbackSpeed
         */
        get: function () {
            return this._pAbsoluteTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimatorBase.prototype, "animationSet", {
        /**
         * Returns the animation data set in use by the animator.
         */
        get: function () {
            return this._pAnimationSet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimatorBase.prototype, "activeState", {
        /**
         * Returns the current active animation state.
         */
        get: function () {
            return this._pActiveState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimatorBase.prototype, "activeAnimation", {
        /**
         * Returns the current active animation node.
         */
        get: function () {
            return this._pAnimationSet.getAnimation(this._pActiveAnimationName);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimatorBase.prototype, "activeAnimationName", {
        /**
         * Returns the current active animation node.
         */
        get: function () {
            return this._pActiveAnimationName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimatorBase.prototype, "autoUpdate", {
        /**
         * Determines whether the animators internal update mechanisms are active. Used in cases
         * where manual updates are required either via the <code>time</code> property or <code>update()</code> method.
         * Defaults to true.
         *
         * @see #time
         * @see #update()
         */
        get: function () {
            return this._autoUpdate;
        },
        set: function (value) {
            if (this._autoUpdate == value)
                return;
            this._autoUpdate = value;
            if (this._autoUpdate)
                this.start();
            else
                this.stop();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimatorBase.prototype, "time", {
        /**
         * Gets and sets the internal time clock of the animator.
         */
        get: function () {
            return this._time;
        },
        set: function (value /*int*/) {
            if (this._time == value)
                return;
            this.update(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the animation phase of the current active state's animation clip(s).
     *
     * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
     */
    AnimatorBase.prototype.phase = function (value) {
        this._pActiveState.phase(value);
    };
    Object.defineProperty(AnimatorBase.prototype, "playbackSpeed", {
        /**
         * The amount by which passed time should be scaled. Used to slow down or speed up animations. Defaults to 1.
         */
        get: function () {
            return this._playbackSpeed;
        },
        set: function (value) {
            this._playbackSpeed = value;
        },
        enumerable: true,
        configurable: true
    });
    AnimatorBase.prototype.setRenderState = function (shaderObject, renderable, stage, camera, vertexConstantOffset /*int*/, vertexStreamOffset /*int*/) {
        throw new AbstractMethodError();
    };
    /**
     * Resumes the automatic playback clock controling the active state of the animator.
     */
    AnimatorBase.prototype.start = function () {
        if (this._isPlaying || !this._autoUpdate)
            return;
        this._time = this._pAbsoluteTime = getTimer();
        this._isPlaying = true;
        this._broadcaster.start();
        if (!this.hasEventListener(AnimatorEvent.START))
            return;
        if (this._startEvent == null)
            this._startEvent = new AnimatorEvent(AnimatorEvent.START, this);
        this.dispatchEvent(this._startEvent);
    };
    /**
     * Pauses the automatic playback clock of the animator, in case manual updates are required via the
     * <code>time</code> property or <code>update()</code> method.
     *
     * @see #time
     * @see #update()
     */
    AnimatorBase.prototype.stop = function () {
        if (!this._isPlaying)
            return;
        this._isPlaying = false;
        this._broadcaster.stop();
        if (!this.hasEventListener(AnimatorEvent.STOP))
            return;
        if (this._stopEvent == null)
            this._stopEvent = new AnimatorEvent(AnimatorEvent.STOP, this);
        this.dispatchEvent(this._stopEvent);
    };
    /**
     * Provides a way to manually update the active state of the animator when automatic
     * updates are disabled.
     *
     * @see #stop()
     * @see #autoUpdate
     */
    AnimatorBase.prototype.update = function (time /*int*/) {
        var dt = (time - this._time) * this.playbackSpeed;
        this._pUpdateDeltaTime(dt);
        this._time = time;
    };
    AnimatorBase.prototype.reset = function (name, offset) {
        if (offset === void 0) { offset = 0; }
        this.getAnimationState(this._pAnimationSet.getAnimation(name)).offset(offset + this._pAbsoluteTime);
    };
    /**
     * Used by the mesh object to which the animator is applied, registers the owner for internal use.
     *
     * @private
     */
    AnimatorBase.prototype.addOwner = function (mesh) {
        this._pOwners.push(mesh);
    };
    /**
     * Used by the mesh object from which the animator is removed, unregisters the owner for internal use.
     *
     * @private
     */
    AnimatorBase.prototype.removeOwner = function (mesh) {
        this._pOwners.splice(this._pOwners.indexOf(mesh), 1);
    };
    /**
     * Internal abstract method called when the time delta property of the animator's contents requires updating.
     *
     * @private
     */
    AnimatorBase.prototype._pUpdateDeltaTime = function (dt) {
        this._pAbsoluteTime += dt;
        this._pActiveState.update(this._pAbsoluteTime);
        if (this.updatePosition)
            this.applyPositionDelta();
    };
    /**
     * Enter frame event handler for automatically updating the active state of the animator.
     */
    AnimatorBase.prototype.onEnterFrame = function (event) {
        if (event === void 0) { event = null; }
        this.update(getTimer());
    };
    AnimatorBase.prototype.applyPositionDelta = function () {
        var delta = this._pActiveState.positionDelta;
        var dist = delta.length;
        var len /*uint*/;
        if (dist > 0) {
            len = this._pOwners.length;
            for (var i = 0; i < len; ++i)
                this._pOwners[i].translateLocal(delta, dist);
        }
    };
    /**
     *  for internal use.
     *
     * @private
     */
    AnimatorBase.prototype.dispatchCycleEvent = function () {
        if (this.hasEventListener(AnimatorEvent.CYCLE_COMPLETE)) {
            if (this._cycleEvent == null)
                this._cycleEvent = new AnimatorEvent(AnimatorEvent.CYCLE_COMPLETE, this);
            this.dispatchEvent(this._cycleEvent);
        }
    };
    /**
     * @inheritDoc
     */
    AnimatorBase.prototype.clone = function () {
        throw new AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    AnimatorBase.prototype.dispose = function () {
    };
    /**
     * @inheritDoc
     */
    AnimatorBase.prototype.testGPUCompatibility = function (shaderObject) {
        throw new AbstractMethodError();
    };
    Object.defineProperty(AnimatorBase.prototype, "assetType", {
        /**
         * @inheritDoc
         */
        get: function () {
            return AssetType.ANIMATOR;
        },
        enumerable: true,
        configurable: true
    });
    AnimatorBase.prototype.getRenderableSubGeometry = function (renderable, sourceSubGeometry) {
        //nothing to do here
        return sourceSubGeometry;
    };
    return AnimatorBase;
})(NamedAssetBase);
module.exports = AnimatorBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvYW5pbWF0b3JiYXNlLnRzIl0sIm5hbWVzIjpbIkFuaW1hdG9yQmFzZSIsIkFuaW1hdG9yQmFzZS5jb25zdHJ1Y3RvciIsIkFuaW1hdG9yQmFzZS5nZXRBbmltYXRpb25TdGF0ZSIsIkFuaW1hdG9yQmFzZS5nZXRBbmltYXRpb25TdGF0ZUJ5TmFtZSIsIkFuaW1hdG9yQmFzZS5hYnNvbHV0ZVRpbWUiLCJBbmltYXRvckJhc2UuYW5pbWF0aW9uU2V0IiwiQW5pbWF0b3JCYXNlLmFjdGl2ZVN0YXRlIiwiQW5pbWF0b3JCYXNlLmFjdGl2ZUFuaW1hdGlvbiIsIkFuaW1hdG9yQmFzZS5hY3RpdmVBbmltYXRpb25OYW1lIiwiQW5pbWF0b3JCYXNlLmF1dG9VcGRhdGUiLCJBbmltYXRvckJhc2UudGltZSIsIkFuaW1hdG9yQmFzZS5waGFzZSIsIkFuaW1hdG9yQmFzZS5wbGF5YmFja1NwZWVkIiwiQW5pbWF0b3JCYXNlLnNldFJlbmRlclN0YXRlIiwiQW5pbWF0b3JCYXNlLnN0YXJ0IiwiQW5pbWF0b3JCYXNlLnN0b3AiLCJBbmltYXRvckJhc2UudXBkYXRlIiwiQW5pbWF0b3JCYXNlLnJlc2V0IiwiQW5pbWF0b3JCYXNlLmFkZE93bmVyIiwiQW5pbWF0b3JCYXNlLnJlbW92ZU93bmVyIiwiQW5pbWF0b3JCYXNlLl9wVXBkYXRlRGVsdGFUaW1lIiwiQW5pbWF0b3JCYXNlLm9uRW50ZXJGcmFtZSIsIkFuaW1hdG9yQmFzZS5hcHBseVBvc2l0aW9uRGVsdGEiLCJBbmltYXRvckJhc2UuZGlzcGF0Y2hDeWNsZUV2ZW50IiwiQW5pbWF0b3JCYXNlLmNsb25lIiwiQW5pbWF0b3JCYXNlLmRpc3Bvc2UiLCJBbmltYXRvckJhc2UudGVzdEdQVUNvbXBhdGliaWxpdHkiLCJBbmltYXRvckJhc2UuYXNzZXRUeXBlIiwiQW5pbWF0b3JCYXNlLmdldFJlbmRlcmFibGVTdWJHZW9tZXRyeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7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QSxDQUFDQSxhQUFhQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtRQUN0Q0EsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUFFRHZCOztPQUVHQTtJQUNJQSw0QkFBS0EsR0FBWkE7UUFFQ3dCLE1BQU1BLElBQUlBLG1CQUFtQkEsRUFBRUEsQ0FBQ0E7SUFDakNBLENBQUNBO0lBRUR4Qjs7T0FFR0E7SUFDSUEsOEJBQU9BLEdBQWRBO0lBRUF5QixDQUFDQTtJQUVEekI7O09BRUdBO0lBQ0lBLDJDQUFvQkEsR0FBM0JBLFVBQTRCQSxZQUE2QkE7UUFFeEQwQixNQUFNQSxJQUFJQSxtQkFBbUJBLEVBQUVBLENBQUNBO0lBQ2pDQSxDQUFDQTtJQUtEMUIsc0JBQVdBLG1DQUFTQTtRQUhwQkE7O1dBRUdBO2FBQ0hBO1lBRUMyQixNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQSxRQUFRQSxDQUFDQTtRQUMzQkEsQ0FBQ0E7OztPQUFBM0I7SUFHTUEsK0NBQXdCQSxHQUEvQkEsVUFBZ0NBLFVBQW9DQSxFQUFFQSxpQkFBcUNBO1FBRTFHNEIsQUFDQUEsb0JBRG9CQTtRQUNwQkEsTUFBTUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQTtJQUMxQkEsQ0FBQ0E7SUFDRjVCLG1CQUFDQTtBQUFEQSxDQXpWQSxBQXlWQ0EsRUF6VjBCLGNBQWMsRUF5VnhDO0FBRUQsQUFBc0IsaUJBQWIsWUFBWSxDQUFDIiwiZmlsZSI6ImFuaW1hdG9ycy9BbmltYXRvckJhc2UuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIik7XG5pbXBvcnQgQXNzZXRUeXBlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0Fzc2V0VHlwZVwiKTtcbmltcG9ydCBOYW1lZEFzc2V0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvTmFtZWRBc3NldEJhc2VcIik7XG5pbXBvcnQgQWJzdHJhY3RNZXRob2RFcnJvclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9lcnJvcnMvQWJzdHJhY3RNZXRob2RFcnJvclwiKTtcbmltcG9ydCBSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL1JlcXVlc3RBbmltYXRpb25GcmFtZVwiKTtcbmltcG9ydCBnZXRUaW1lclx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9nZXRUaW1lclwiKTtcblxuaW1wb3J0IElBbmltYXRpb25TZXRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9hbmltYXRvcnMvSUFuaW1hdGlvblNldFwiKTtcbmltcG9ydCBJQW5pbWF0b3JcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2FuaW1hdG9ycy9JQW5pbWF0b3JcIik7XG5pbXBvcnQgQW5pbWF0aW9uTm9kZUJhc2VcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYW5pbWF0b3JzL25vZGVzL0FuaW1hdGlvbk5vZGVCYXNlXCIpO1xuaW1wb3J0IFRyaWFuZ2xlU3ViR2VvbWV0cnlcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9UcmlhbmdsZVN1Ykdlb21ldHJ5XCIpO1xuaW1wb3J0IENhbWVyYVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9DYW1lcmFcIik7XG5pbXBvcnQgTWVzaFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL01lc2hcIik7XG5cbmltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuXG5pbXBvcnQgSUFuaW1hdGlvblN0YXRlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL3N0YXRlcy9JQW5pbWF0aW9uU3RhdGVcIik7XG5pbXBvcnQgUmVuZGVyYWJsZUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL1JlbmRlcmFibGVCYXNlXCIpO1xuaW1wb3J0IFRyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGVcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL1RyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGVcIik7XG5pbXBvcnQgQW5pbWF0b3JFdmVudFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2V2ZW50cy9BbmltYXRvckV2ZW50XCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcblxuLyoqXG4gKiBEaXNwYXRjaGVkIHdoZW4gcGxheWJhY2sgb2YgYW4gYW5pbWF0aW9uIGluc2lkZSB0aGUgYW5pbWF0b3Igb2JqZWN0IHN0YXJ0cy5cbiAqXG4gKiBAZXZlbnRUeXBlIGF3YXkzZC5ldmVudHMuQW5pbWF0b3JFdmVudFxuICovXG4vL1tFdmVudChuYW1lPVwic3RhcnRcIiwgdHlwZT1cImF3YXkzZC5ldmVudHMuQW5pbWF0b3JFdmVudFwiKV1cblxuLyoqXG4gKiBEaXNwYXRjaGVkIHdoZW4gcGxheWJhY2sgb2YgYW4gYW5pbWF0aW9uIGluc2lkZSB0aGUgYW5pbWF0b3Igb2JqZWN0IHN0b3BzLlxuICpcbiAqIEBldmVudFR5cGUgYXdheTNkLmV2ZW50cy5BbmltYXRvckV2ZW50XG4gKi9cbi8vW0V2ZW50KG5hbWU9XCJzdG9wXCIsIHR5cGU9XCJhd2F5M2QuZXZlbnRzLkFuaW1hdG9yRXZlbnRcIildXG5cbi8qKlxuICogRGlzcGF0Y2hlZCB3aGVuIHBsYXliYWNrIG9mIGFuIGFuaW1hdGlvbiByZWFjaGVzIHRoZSBlbmQgb2YgYW4gYW5pbWF0aW9uLlxuICpcbiAqIEBldmVudFR5cGUgYXdheTNkLmV2ZW50cy5BbmltYXRvckV2ZW50XG4gKi9cbi8vW0V2ZW50KG5hbWU9XCJjeWNsZV9jb21wbGV0ZVwiLCB0eXBlPVwiYXdheTNkLmV2ZW50cy5BbmltYXRvckV2ZW50XCIpXVxuXG4vKipcbiAqIFByb3ZpZGVzIGFuIGFic3RyYWN0IGJhc2UgY2xhc3MgZm9yIGFuaW1hdG9yIGNsYXNzZXMgdGhhdCBjb250cm9sIGFuaW1hdGlvbiBvdXRwdXQgZnJvbSBhIGRhdGEgc2V0IHN1YnR5cGUgb2YgPGNvZGU+QW5pbWF0aW9uU2V0QmFzZTwvY29kZT4uXG4gKlxuICogQHNlZSBhd2F5LmFuaW1hdG9ycy5BbmltYXRpb25TZXRCYXNlXG4gKi9cbmNsYXNzIEFuaW1hdG9yQmFzZSBleHRlbmRzIE5hbWVkQXNzZXRCYXNlIGltcGxlbWVudHMgSUFuaW1hdG9yXG57XG5cdHByaXZhdGUgX2Jyb2FkY2FzdGVyOlJlcXVlc3RBbmltYXRpb25GcmFtZTtcblx0cHJpdmF0ZSBfaXNQbGF5aW5nOmJvb2xlYW47XG5cdHByaXZhdGUgX2F1dG9VcGRhdGU6Ym9vbGVhbiA9IHRydWU7XG5cdHByaXZhdGUgX3N0YXJ0RXZlbnQ6QW5pbWF0b3JFdmVudDtcblx0cHJpdmF0ZSBfc3RvcEV2ZW50OkFuaW1hdG9yRXZlbnQ7XG5cdHByaXZhdGUgX2N5Y2xlRXZlbnQ6QW5pbWF0b3JFdmVudDtcblx0cHJpdmF0ZSBfdGltZTpudW1iZXIgLyppbnQqLyA9IDA7XG5cdHByaXZhdGUgX3BsYXliYWNrU3BlZWQ6bnVtYmVyID0gMTtcblxuXHRwdWJsaWMgX3BBbmltYXRpb25TZXQ6SUFuaW1hdGlvblNldDtcblx0cHVibGljIF9wT3duZXJzOkFycmF5PE1lc2g+ID0gbmV3IEFycmF5PE1lc2g+KCk7XG5cdHB1YmxpYyBfcEFjdGl2ZU5vZGU6QW5pbWF0aW9uTm9kZUJhc2U7XG5cdHB1YmxpYyBfcEFjdGl2ZVN0YXRlOklBbmltYXRpb25TdGF0ZTtcblx0cHVibGljIF9wQWN0aXZlQW5pbWF0aW9uTmFtZTpzdHJpbmc7XG5cdHB1YmxpYyBfcEFic29sdXRlVGltZTpudW1iZXIgPSAwO1xuXG5cdHByaXZhdGUgX2FuaW1hdGlvblN0YXRlczpPYmplY3QgPSBuZXcgT2JqZWN0KCk7XG5cblx0LyoqXG5cdCAqIEVuYWJsZXMgdHJhbnNsYXRpb24gb2YgdGhlIGFuaW1hdGVkIG1lc2ggZnJvbSBkYXRhIHJldHVybmVkIHBlciBmcmFtZSB2aWEgdGhlIHBvc2l0aW9uRGVsdGEgcHJvcGVydHkgb2YgdGhlIGFjdGl2ZSBhbmltYXRpb24gbm9kZS4gRGVmYXVsdHMgdG8gdHJ1ZS5cblx0ICpcblx0ICogQHNlZSBhd2F5LmFuaW1hdG9ycy5JQW5pbWF0aW9uU3RhdGUjcG9zaXRpb25EZWx0YVxuXHQgKi9cblx0cHVibGljIHVwZGF0ZVBvc2l0aW9uOmJvb2xlYW4gPSB0cnVlO1xuXG5cdHB1YmxpYyBnZXRBbmltYXRpb25TdGF0ZShub2RlOkFuaW1hdGlvbk5vZGVCYXNlKTpJQW5pbWF0aW9uU3RhdGVcblx0e1xuXHRcdHZhciBjbGFzc05hbWU6YW55ID0gbm9kZS5zdGF0ZUNsYXNzO1xuXHRcdHZhciB1SUQ6bnVtYmVyID0gbm9kZS5pZDtcblxuXHRcdGlmICh0aGlzLl9hbmltYXRpb25TdGF0ZXNbdUlEXSA9PSBudWxsKVxuXHRcdFx0dGhpcy5fYW5pbWF0aW9uU3RhdGVzW3VJRF0gPSBuZXcgY2xhc3NOYW1lKHRoaXMsIG5vZGUpO1xuXG5cdFx0cmV0dXJuIHRoaXMuX2FuaW1hdGlvblN0YXRlc1t1SURdO1xuXHR9XG5cblx0cHVibGljIGdldEFuaW1hdGlvblN0YXRlQnlOYW1lKG5hbWU6c3RyaW5nKTpJQW5pbWF0aW9uU3RhdGVcblx0e1xuXHRcdHJldHVybiB0aGlzLmdldEFuaW1hdGlvblN0YXRlKHRoaXMuX3BBbmltYXRpb25TZXQuZ2V0QW5pbWF0aW9uKG5hbWUpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBpbnRlcm5hbCBhYnNvbHV0ZSB0aW1lIG9mIHRoZSBhbmltYXRvciwgY2FsY3VsYXRlZCBieSB0aGUgY3VycmVudCB0aW1lIGFuZCB0aGUgcGxheWJhY2sgc3BlZWQuXG5cdCAqXG5cdCAqIEBzZWUgI3RpbWVcblx0ICogQHNlZSAjcGxheWJhY2tTcGVlZFxuXHQgKi9cblx0cHVibGljIGdldCBhYnNvbHV0ZVRpbWUoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wQWJzb2x1dGVUaW1lO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGFuaW1hdGlvbiBkYXRhIHNldCBpbiB1c2UgYnkgdGhlIGFuaW1hdG9yLlxuXHQgKi9cblx0cHVibGljIGdldCBhbmltYXRpb25TZXQoKTpJQW5pbWF0aW9uU2V0XG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcEFuaW1hdGlvblNldDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBjdXJyZW50IGFjdGl2ZSBhbmltYXRpb24gc3RhdGUuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFjdGl2ZVN0YXRlKCk6SUFuaW1hdGlvblN0YXRlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcEFjdGl2ZVN0YXRlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGN1cnJlbnQgYWN0aXZlIGFuaW1hdGlvbiBub2RlLlxuXHQgKi9cblx0cHVibGljIGdldCBhY3RpdmVBbmltYXRpb24oKTpBbmltYXRpb25Ob2RlQmFzZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3BBbmltYXRpb25TZXQuZ2V0QW5pbWF0aW9uKHRoaXMuX3BBY3RpdmVBbmltYXRpb25OYW1lKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBjdXJyZW50IGFjdGl2ZSBhbmltYXRpb24gbm9kZS5cblx0ICovXG5cdHB1YmxpYyBnZXQgYWN0aXZlQW5pbWF0aW9uTmFtZSgpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3BBY3RpdmVBbmltYXRpb25OYW1lO1xuXHR9XG5cblx0LyoqXG5cdCAqIERldGVybWluZXMgd2hldGhlciB0aGUgYW5pbWF0b3JzIGludGVybmFsIHVwZGF0ZSBtZWNoYW5pc21zIGFyZSBhY3RpdmUuIFVzZWQgaW4gY2FzZXNcblx0ICogd2hlcmUgbWFudWFsIHVwZGF0ZXMgYXJlIHJlcXVpcmVkIGVpdGhlciB2aWEgdGhlIDxjb2RlPnRpbWU8L2NvZGU+IHByb3BlcnR5IG9yIDxjb2RlPnVwZGF0ZSgpPC9jb2RlPiBtZXRob2QuXG5cdCAqIERlZmF1bHRzIHRvIHRydWUuXG5cdCAqXG5cdCAqIEBzZWUgI3RpbWVcblx0ICogQHNlZSAjdXBkYXRlKClcblx0ICovXG5cdHB1YmxpYyBnZXQgYXV0b1VwZGF0ZSgpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9hdXRvVXBkYXRlO1xuXHR9XG5cblx0cHVibGljIHNldCBhdXRvVXBkYXRlKHZhbHVlOmJvb2xlYW4pXG5cdHtcblx0XHRpZiAodGhpcy5fYXV0b1VwZGF0ZSA9PSB2YWx1ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2F1dG9VcGRhdGUgPSB2YWx1ZTtcblxuXHRcdGlmICh0aGlzLl9hdXRvVXBkYXRlKVxuXHRcdFx0dGhpcy5zdGFydCgpOyBlbHNlXG5cdFx0XHR0aGlzLnN0b3AoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIGFuZCBzZXRzIHRoZSBpbnRlcm5hbCB0aW1lIGNsb2NrIG9mIHRoZSBhbmltYXRvci5cblx0ICovXG5cdHB1YmxpYyBnZXQgdGltZSgpOm51bWJlciAvKmludCovXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fdGltZTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgdGltZSh2YWx1ZTpudW1iZXIgLyppbnQqLylcblx0e1xuXHRcdGlmICh0aGlzLl90aW1lID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy51cGRhdGUodmFsdWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIGFuaW1hdGlvbiBwaGFzZSBvZiB0aGUgY3VycmVudCBhY3RpdmUgc3RhdGUncyBhbmltYXRpb24gY2xpcChzKS5cblx0ICpcblx0ICogQHBhcmFtIHZhbHVlIFRoZSBwaGFzZSB2YWx1ZSB0byB1c2UuIDAgcmVwcmVzZW50cyB0aGUgYmVnaW5uaW5nIG9mIGFuIGFuaW1hdGlvbiBjbGlwLCAxIHJlcHJlc2VudHMgdGhlIGVuZC5cblx0ICovXG5cdHB1YmxpYyBwaGFzZSh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9wQWN0aXZlU3RhdGUucGhhc2UodmFsdWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgPGNvZGU+QW5pbWF0b3JCYXNlPC9jb2RlPiBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSBhbmltYXRpb25TZXQgVGhlIGFuaW1hdGlvbiBkYXRhIHNldCB0byBiZSB1c2VkIGJ5IHRoZSBhbmltYXRvciBvYmplY3QuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihhbmltYXRpb25TZXQ6SUFuaW1hdGlvblNldClcblx0e1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLl9wQW5pbWF0aW9uU2V0ID0gYW5pbWF0aW9uU2V0O1xuXG5cdFx0dGhpcy5fYnJvYWRjYXN0ZXIgPSBuZXcgUmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMub25FbnRlckZyYW1lLCB0aGlzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgYW1vdW50IGJ5IHdoaWNoIHBhc3NlZCB0aW1lIHNob3VsZCBiZSBzY2FsZWQuIFVzZWQgdG8gc2xvdyBkb3duIG9yIHNwZWVkIHVwIGFuaW1hdGlvbnMuIERlZmF1bHRzIHRvIDEuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHBsYXliYWNrU3BlZWQoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wbGF5YmFja1NwZWVkO1xuXHR9XG5cblx0cHVibGljIHNldCBwbGF5YmFja1NwZWVkKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3BsYXliYWNrU3BlZWQgPSB2YWx1ZTtcblx0fVxuXG5cdHB1YmxpYyBzZXRSZW5kZXJTdGF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSwgc3RhZ2U6U3RhZ2UsIGNhbWVyYTpDYW1lcmEsIHZlcnRleENvbnN0YW50T2Zmc2V0Om51bWJlciAvKmludCovLCB2ZXJ0ZXhTdHJlYW1PZmZzZXQ6bnVtYmVyIC8qaW50Ki8pXG5cdHtcblx0XHR0aHJvdyBuZXcgQWJzdHJhY3RNZXRob2RFcnJvcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlc3VtZXMgdGhlIGF1dG9tYXRpYyBwbGF5YmFjayBjbG9jayBjb250cm9saW5nIHRoZSBhY3RpdmUgc3RhdGUgb2YgdGhlIGFuaW1hdG9yLlxuXHQgKi9cblx0cHVibGljIHN0YXJ0KClcblx0e1xuXHRcdGlmICh0aGlzLl9pc1BsYXlpbmcgfHwgIXRoaXMuX2F1dG9VcGRhdGUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl90aW1lID0gdGhpcy5fcEFic29sdXRlVGltZSA9IGdldFRpbWVyKCk7XG5cblx0XHR0aGlzLl9pc1BsYXlpbmcgPSB0cnVlO1xuXG5cdFx0dGhpcy5fYnJvYWRjYXN0ZXIuc3RhcnQoKTtcblxuXHRcdGlmICghdGhpcy5oYXNFdmVudExpc3RlbmVyKEFuaW1hdG9yRXZlbnQuU1RBUlQpKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0aWYgKHRoaXMuX3N0YXJ0RXZlbnQgPT0gbnVsbClcblx0XHRcdHRoaXMuX3N0YXJ0RXZlbnQgPSBuZXcgQW5pbWF0b3JFdmVudChBbmltYXRvckV2ZW50LlNUQVJULCB0aGlzKTtcblxuXHRcdHRoaXMuZGlzcGF0Y2hFdmVudCh0aGlzLl9zdGFydEV2ZW50KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQYXVzZXMgdGhlIGF1dG9tYXRpYyBwbGF5YmFjayBjbG9jayBvZiB0aGUgYW5pbWF0b3IsIGluIGNhc2UgbWFudWFsIHVwZGF0ZXMgYXJlIHJlcXVpcmVkIHZpYSB0aGVcblx0ICogPGNvZGU+dGltZTwvY29kZT4gcHJvcGVydHkgb3IgPGNvZGU+dXBkYXRlKCk8L2NvZGU+IG1ldGhvZC5cblx0ICpcblx0ICogQHNlZSAjdGltZVxuXHQgKiBAc2VlICN1cGRhdGUoKVxuXHQgKi9cblx0cHVibGljIHN0b3AoKVxuXHR7XG5cdFx0aWYgKCF0aGlzLl9pc1BsYXlpbmcpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9pc1BsYXlpbmcgPSBmYWxzZTtcblxuXHRcdHRoaXMuX2Jyb2FkY2FzdGVyLnN0b3AoKTtcblxuXHRcdGlmICghdGhpcy5oYXNFdmVudExpc3RlbmVyKEFuaW1hdG9yRXZlbnQuU1RPUCkpXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpZiAodGhpcy5fc3RvcEV2ZW50ID09IG51bGwpXG5cdFx0XHR0aGlzLl9zdG9wRXZlbnQgPSBuZXcgQW5pbWF0b3JFdmVudChBbmltYXRvckV2ZW50LlNUT1AsIHRoaXMpO1xuXG5cdFx0dGhpcy5kaXNwYXRjaEV2ZW50KHRoaXMuX3N0b3BFdmVudCk7XG5cdH1cblxuXHQvKipcblx0ICogUHJvdmlkZXMgYSB3YXkgdG8gbWFudWFsbHkgdXBkYXRlIHRoZSBhY3RpdmUgc3RhdGUgb2YgdGhlIGFuaW1hdG9yIHdoZW4gYXV0b21hdGljXG5cdCAqIHVwZGF0ZXMgYXJlIGRpc2FibGVkLlxuXHQgKlxuXHQgKiBAc2VlICNzdG9wKClcblx0ICogQHNlZSAjYXV0b1VwZGF0ZVxuXHQgKi9cblx0cHVibGljIHVwZGF0ZSh0aW1lOm51bWJlciAvKmludCovKVxuXHR7XG5cdFx0dmFyIGR0Om51bWJlciA9ICh0aW1lIC0gdGhpcy5fdGltZSkqdGhpcy5wbGF5YmFja1NwZWVkO1xuXG5cdFx0dGhpcy5fcFVwZGF0ZURlbHRhVGltZShkdCk7XG5cblx0XHR0aGlzLl90aW1lID0gdGltZTtcblx0fVxuXG5cdHB1YmxpYyByZXNldChuYW1lOnN0cmluZywgb2Zmc2V0Om51bWJlciA9IDApXG5cdHtcblx0XHR0aGlzLmdldEFuaW1hdGlvblN0YXRlKHRoaXMuX3BBbmltYXRpb25TZXQuZ2V0QW5pbWF0aW9uKG5hbWUpKS5vZmZzZXQob2Zmc2V0ICsgdGhpcy5fcEFic29sdXRlVGltZSk7XG5cdH1cblxuXHQvKipcblx0ICogVXNlZCBieSB0aGUgbWVzaCBvYmplY3QgdG8gd2hpY2ggdGhlIGFuaW1hdG9yIGlzIGFwcGxpZWQsIHJlZ2lzdGVycyB0aGUgb3duZXIgZm9yIGludGVybmFsIHVzZS5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHB1YmxpYyBhZGRPd25lcihtZXNoOk1lc2gpXG5cdHtcblx0XHR0aGlzLl9wT3duZXJzLnB1c2gobWVzaCk7XG5cdH1cblxuXHQvKipcblx0ICogVXNlZCBieSB0aGUgbWVzaCBvYmplY3QgZnJvbSB3aGljaCB0aGUgYW5pbWF0b3IgaXMgcmVtb3ZlZCwgdW5yZWdpc3RlcnMgdGhlIG93bmVyIGZvciBpbnRlcm5hbCB1c2UuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwdWJsaWMgcmVtb3ZlT3duZXIobWVzaDpNZXNoKVxuXHR7XG5cdFx0dGhpcy5fcE93bmVycy5zcGxpY2UodGhpcy5fcE93bmVycy5pbmRleE9mKG1lc2gpLCAxKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbnRlcm5hbCBhYnN0cmFjdCBtZXRob2QgY2FsbGVkIHdoZW4gdGhlIHRpbWUgZGVsdGEgcHJvcGVydHkgb2YgdGhlIGFuaW1hdG9yJ3MgY29udGVudHMgcmVxdWlyZXMgdXBkYXRpbmcuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwdWJsaWMgX3BVcGRhdGVEZWx0YVRpbWUoZHQ6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fcEFic29sdXRlVGltZSArPSBkdDtcblxuXHRcdHRoaXMuX3BBY3RpdmVTdGF0ZS51cGRhdGUodGhpcy5fcEFic29sdXRlVGltZSk7XG5cblx0XHRpZiAodGhpcy51cGRhdGVQb3NpdGlvbilcblx0XHRcdHRoaXMuYXBwbHlQb3NpdGlvbkRlbHRhKCk7XG5cdH1cblxuXHQvKipcblx0ICogRW50ZXIgZnJhbWUgZXZlbnQgaGFuZGxlciBmb3IgYXV0b21hdGljYWxseSB1cGRhdGluZyB0aGUgYWN0aXZlIHN0YXRlIG9mIHRoZSBhbmltYXRvci5cblx0ICovXG5cdHByaXZhdGUgb25FbnRlckZyYW1lKGV2ZW50OkV2ZW50ID0gbnVsbClcblx0e1xuXHRcdHRoaXMudXBkYXRlKGdldFRpbWVyKCkpO1xuXHR9XG5cblx0cHJpdmF0ZSBhcHBseVBvc2l0aW9uRGVsdGEoKVxuXHR7XG5cdFx0dmFyIGRlbHRhOlZlY3RvcjNEID0gdGhpcy5fcEFjdGl2ZVN0YXRlLnBvc2l0aW9uRGVsdGE7XG5cdFx0dmFyIGRpc3Q6bnVtYmVyID0gZGVsdGEubGVuZ3RoO1xuXHRcdHZhciBsZW46bnVtYmVyIC8qdWludCovO1xuXHRcdGlmIChkaXN0ID4gMCkge1xuXHRcdFx0bGVuID0gdGhpcy5fcE93bmVycy5sZW5ndGg7XG5cdFx0XHRmb3IgKHZhciBpOm51bWJlciAvKnVpbnQqLyA9IDA7IGkgPCBsZW47ICsraSlcblx0XHRcdFx0dGhpcy5fcE93bmVyc1tpXS50cmFuc2xhdGVMb2NhbChkZWx0YSwgZGlzdCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqICBmb3IgaW50ZXJuYWwgdXNlLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHVibGljIGRpc3BhdGNoQ3ljbGVFdmVudCgpXG5cdHtcblx0XHRpZiAodGhpcy5oYXNFdmVudExpc3RlbmVyKEFuaW1hdG9yRXZlbnQuQ1lDTEVfQ09NUExFVEUpKSB7XG5cdFx0XHRpZiAodGhpcy5fY3ljbGVFdmVudCA9PSBudWxsKVxuXHRcdFx0XHR0aGlzLl9jeWNsZUV2ZW50ID0gbmV3IEFuaW1hdG9yRXZlbnQoQW5pbWF0b3JFdmVudC5DWUNMRV9DT01QTEVURSwgdGhpcyk7XG5cblx0XHRcdHRoaXMuZGlzcGF0Y2hFdmVudCh0aGlzLl9jeWNsZUV2ZW50KTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBjbG9uZSgpOkFuaW1hdG9yQmFzZVxuXHR7XG5cdFx0dGhyb3cgbmV3IEFic3RyYWN0TWV0aG9kRXJyb3IoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGRpc3Bvc2UoKVxuXHR7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyB0ZXN0R1BVQ29tcGF0aWJpbGl0eShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSlcblx0e1xuXHRcdHRocm93IG5ldyBBYnN0cmFjdE1ldGhvZEVycm9yKCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBnZXQgYXNzZXRUeXBlKCk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gQXNzZXRUeXBlLkFOSU1BVE9SO1xuXHR9XG5cblxuXHRwdWJsaWMgZ2V0UmVuZGVyYWJsZVN1Ykdlb21ldHJ5KHJlbmRlcmFibGU6VHJpYW5nbGVTdWJNZXNoUmVuZGVyYWJsZSwgc291cmNlU3ViR2VvbWV0cnk6VHJpYW5nbGVTdWJHZW9tZXRyeSk6VHJpYW5nbGVTdWJHZW9tZXRyeVxuXHR7XG5cdFx0Ly9ub3RoaW5nIHRvIGRvIGhlcmVcblx0XHRyZXR1cm4gc291cmNlU3ViR2VvbWV0cnk7XG5cdH1cbn1cblxuZXhwb3J0ID0gQW5pbWF0b3JCYXNlOyJdfQ==