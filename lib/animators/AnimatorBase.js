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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvQW5pbWF0b3JCYXNlLnRzIl0sIm5hbWVzIjpbIkFuaW1hdG9yQmFzZSIsIkFuaW1hdG9yQmFzZS5jb25zdHJ1Y3RvciIsIkFuaW1hdG9yQmFzZS5nZXRBbmltYXRpb25TdGF0ZSIsIkFuaW1hdG9yQmFzZS5nZXRBbmltYXRpb25TdGF0ZUJ5TmFtZSIsIkFuaW1hdG9yQmFzZS5hYnNvbHV0ZVRpbWUiLCJBbmltYXRvckJhc2UuYW5pbWF0aW9uU2V0IiwiQW5pbWF0b3JCYXNlLmFjdGl2ZVN0YXRlIiwiQW5pbWF0b3JCYXNlLmFjdGl2ZUFuaW1hdGlvbiIsIkFuaW1hdG9yQmFzZS5hY3RpdmVBbmltYXRpb25OYW1lIiwiQW5pbWF0b3JCYXNlLmF1dG9VcGRhdGUiLCJBbmltYXRvckJhc2UudGltZSIsIkFuaW1hdG9yQmFzZS5waGFzZSIsIkFuaW1hdG9yQmFzZS5wbGF5YmFja1NwZWVkIiwiQW5pbWF0b3JCYXNlLnNldFJlbmRlclN0YXRlIiwiQW5pbWF0b3JCYXNlLnN0YXJ0IiwiQW5pbWF0b3JCYXNlLnN0b3AiLCJBbmltYXRvckJhc2UudXBkYXRlIiwiQW5pbWF0b3JCYXNlLnJlc2V0IiwiQW5pbWF0b3JCYXNlLmFkZE93bmVyIiwiQW5pbWF0b3JCYXNlLnJlbW92ZU93bmVyIiwiQW5pbWF0b3JCYXNlLl9wVXBkYXRlRGVsdGFUaW1lIiwiQW5pbWF0b3JCYXNlLm9uRW50ZXJGcmFtZSIsIkFuaW1hdG9yQmFzZS5hcHBseVBvc2l0aW9uRGVsdGEiLCJBbmltYXRvckJhc2UuZGlzcGF0Y2hDeWNsZUV2ZW50IiwiQW5pbWF0b3JCYXNlLmNsb25lIiwiQW5pbWF0b3JCYXNlLmRpc3Bvc2UiLCJBbmltYXRvckJhc2UudGVzdEdQVUNvbXBhdGliaWxpdHkiLCJBbmltYXRvckJhc2UuYXNzZXRUeXBlIiwiQW5pbWF0b3JCYXNlLmdldFJlbmRlcmFibGVTdWJHZW9tZXRyeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7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QSxDQUFDQSxhQUFhQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtRQUN0Q0EsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUFFRHZCOztPQUVHQTtJQUNJQSw0QkFBS0EsR0FBWkE7UUFFQ3dCLE1BQU1BLElBQUlBLG1CQUFtQkEsRUFBRUEsQ0FBQ0E7SUFDakNBLENBQUNBO0lBRUR4Qjs7T0FFR0E7SUFDSUEsOEJBQU9BLEdBQWRBO0lBRUF5QixDQUFDQTtJQUVEekI7O09BRUdBO0lBQ0lBLDJDQUFvQkEsR0FBM0JBLFVBQTRCQSxZQUE2QkE7UUFFeEQwQixNQUFNQSxJQUFJQSxtQkFBbUJBLEVBQUVBLENBQUNBO0lBQ2pDQSxDQUFDQTtJQUtEMUIsc0JBQVdBLG1DQUFTQTtRQUhwQkE7O1dBRUdBO2FBQ0hBO1lBRUMyQixNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQSxRQUFRQSxDQUFDQTtRQUMzQkEsQ0FBQ0E7OztPQUFBM0I7SUFHTUEsK0NBQXdCQSxHQUEvQkEsVUFBZ0NBLFVBQW9DQSxFQUFFQSxpQkFBcUNBO1FBRTFHNEIsQUFDQUEsb0JBRG9CQTtRQUNwQkEsTUFBTUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQTtJQUMxQkEsQ0FBQ0E7SUFDRjVCLG1CQUFDQTtBQUFEQSxDQXpWQSxBQXlWQ0EsRUF6VjBCLGNBQWMsRUF5VnhDO0FBRUQsQUFBc0IsaUJBQWIsWUFBWSxDQUFDIiwiZmlsZSI6ImFuaW1hdG9ycy9BbmltYXRvckJhc2UuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIik7XHJcbmltcG9ydCBBc3NldFR5cGVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvQXNzZXRUeXBlXCIpO1xyXG5pbXBvcnQgTmFtZWRBc3NldEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L05hbWVkQXNzZXRCYXNlXCIpO1xyXG5pbXBvcnQgQWJzdHJhY3RNZXRob2RFcnJvclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9lcnJvcnMvQWJzdHJhY3RNZXRob2RFcnJvclwiKTtcclxuaW1wb3J0IFJlcXVlc3RBbmltYXRpb25GcmFtZVx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdXRpbHMvUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCIpO1xyXG5pbXBvcnQgZ2V0VGltZXJcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdXRpbHMvZ2V0VGltZXJcIik7XHJcblxyXG5pbXBvcnQgSUFuaW1hdGlvblNldFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2FuaW1hdG9ycy9JQW5pbWF0aW9uU2V0XCIpO1xyXG5pbXBvcnQgSUFuaW1hdG9yXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9hbmltYXRvcnMvSUFuaW1hdG9yXCIpO1xyXG5pbXBvcnQgQW5pbWF0aW9uTm9kZUJhc2VcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYW5pbWF0b3JzL25vZGVzL0FuaW1hdGlvbk5vZGVCYXNlXCIpO1xyXG5pbXBvcnQgVHJpYW5nbGVTdWJHZW9tZXRyeVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL1RyaWFuZ2xlU3ViR2VvbWV0cnlcIik7XHJcbmltcG9ydCBDYW1lcmFcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvQ2FtZXJhXCIpO1xyXG5pbXBvcnQgTWVzaFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL01lc2hcIik7XHJcblxyXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcclxuXHJcbmltcG9ydCBJQW5pbWF0aW9uU3RhdGVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL0lBbmltYXRpb25TdGF0ZVwiKTtcclxuaW1wb3J0IFJlbmRlcmFibGVCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9SZW5kZXJhYmxlQmFzZVwiKTtcclxuaW1wb3J0IFRyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGVcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL1RyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGVcIik7XHJcbmltcG9ydCBBbmltYXRvckV2ZW50XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvZXZlbnRzL0FuaW1hdG9yRXZlbnRcIik7XHJcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcclxuXHJcbi8qKlxyXG4gKiBEaXNwYXRjaGVkIHdoZW4gcGxheWJhY2sgb2YgYW4gYW5pbWF0aW9uIGluc2lkZSB0aGUgYW5pbWF0b3Igb2JqZWN0IHN0YXJ0cy5cclxuICpcclxuICogQGV2ZW50VHlwZSBhd2F5M2QuZXZlbnRzLkFuaW1hdG9yRXZlbnRcclxuICovXHJcbi8vW0V2ZW50KG5hbWU9XCJzdGFydFwiLCB0eXBlPVwiYXdheTNkLmV2ZW50cy5BbmltYXRvckV2ZW50XCIpXVxyXG5cclxuLyoqXHJcbiAqIERpc3BhdGNoZWQgd2hlbiBwbGF5YmFjayBvZiBhbiBhbmltYXRpb24gaW5zaWRlIHRoZSBhbmltYXRvciBvYmplY3Qgc3RvcHMuXHJcbiAqXHJcbiAqIEBldmVudFR5cGUgYXdheTNkLmV2ZW50cy5BbmltYXRvckV2ZW50XHJcbiAqL1xyXG4vL1tFdmVudChuYW1lPVwic3RvcFwiLCB0eXBlPVwiYXdheTNkLmV2ZW50cy5BbmltYXRvckV2ZW50XCIpXVxyXG5cclxuLyoqXHJcbiAqIERpc3BhdGNoZWQgd2hlbiBwbGF5YmFjayBvZiBhbiBhbmltYXRpb24gcmVhY2hlcyB0aGUgZW5kIG9mIGFuIGFuaW1hdGlvbi5cclxuICpcclxuICogQGV2ZW50VHlwZSBhd2F5M2QuZXZlbnRzLkFuaW1hdG9yRXZlbnRcclxuICovXHJcbi8vW0V2ZW50KG5hbWU9XCJjeWNsZV9jb21wbGV0ZVwiLCB0eXBlPVwiYXdheTNkLmV2ZW50cy5BbmltYXRvckV2ZW50XCIpXVxyXG5cclxuLyoqXHJcbiAqIFByb3ZpZGVzIGFuIGFic3RyYWN0IGJhc2UgY2xhc3MgZm9yIGFuaW1hdG9yIGNsYXNzZXMgdGhhdCBjb250cm9sIGFuaW1hdGlvbiBvdXRwdXQgZnJvbSBhIGRhdGEgc2V0IHN1YnR5cGUgb2YgPGNvZGU+QW5pbWF0aW9uU2V0QmFzZTwvY29kZT4uXHJcbiAqXHJcbiAqIEBzZWUgYXdheS5hbmltYXRvcnMuQW5pbWF0aW9uU2V0QmFzZVxyXG4gKi9cclxuY2xhc3MgQW5pbWF0b3JCYXNlIGV4dGVuZHMgTmFtZWRBc3NldEJhc2UgaW1wbGVtZW50cyBJQW5pbWF0b3Jcclxue1xyXG5cdHByaXZhdGUgX2Jyb2FkY2FzdGVyOlJlcXVlc3RBbmltYXRpb25GcmFtZTtcclxuXHRwcml2YXRlIF9pc1BsYXlpbmc6Ym9vbGVhbjtcclxuXHRwcml2YXRlIF9hdXRvVXBkYXRlOmJvb2xlYW4gPSB0cnVlO1xyXG5cdHByaXZhdGUgX3N0YXJ0RXZlbnQ6QW5pbWF0b3JFdmVudDtcclxuXHRwcml2YXRlIF9zdG9wRXZlbnQ6QW5pbWF0b3JFdmVudDtcclxuXHRwcml2YXRlIF9jeWNsZUV2ZW50OkFuaW1hdG9yRXZlbnQ7XHJcblx0cHJpdmF0ZSBfdGltZTpudW1iZXIgLyppbnQqLyA9IDA7XHJcblx0cHJpdmF0ZSBfcGxheWJhY2tTcGVlZDpudW1iZXIgPSAxO1xyXG5cclxuXHRwdWJsaWMgX3BBbmltYXRpb25TZXQ6SUFuaW1hdGlvblNldDtcclxuXHRwdWJsaWMgX3BPd25lcnM6QXJyYXk8TWVzaD4gPSBuZXcgQXJyYXk8TWVzaD4oKTtcclxuXHRwdWJsaWMgX3BBY3RpdmVOb2RlOkFuaW1hdGlvbk5vZGVCYXNlO1xyXG5cdHB1YmxpYyBfcEFjdGl2ZVN0YXRlOklBbmltYXRpb25TdGF0ZTtcclxuXHRwdWJsaWMgX3BBY3RpdmVBbmltYXRpb25OYW1lOnN0cmluZztcclxuXHRwdWJsaWMgX3BBYnNvbHV0ZVRpbWU6bnVtYmVyID0gMDtcclxuXHJcblx0cHJpdmF0ZSBfYW5pbWF0aW9uU3RhdGVzOk9iamVjdCA9IG5ldyBPYmplY3QoKTtcclxuXHJcblx0LyoqXHJcblx0ICogRW5hYmxlcyB0cmFuc2xhdGlvbiBvZiB0aGUgYW5pbWF0ZWQgbWVzaCBmcm9tIGRhdGEgcmV0dXJuZWQgcGVyIGZyYW1lIHZpYSB0aGUgcG9zaXRpb25EZWx0YSBwcm9wZXJ0eSBvZiB0aGUgYWN0aXZlIGFuaW1hdGlvbiBub2RlLiBEZWZhdWx0cyB0byB0cnVlLlxyXG5cdCAqXHJcblx0ICogQHNlZSBhd2F5LmFuaW1hdG9ycy5JQW5pbWF0aW9uU3RhdGUjcG9zaXRpb25EZWx0YVxyXG5cdCAqL1xyXG5cdHB1YmxpYyB1cGRhdGVQb3NpdGlvbjpib29sZWFuID0gdHJ1ZTtcclxuXHJcblx0cHVibGljIGdldEFuaW1hdGlvblN0YXRlKG5vZGU6QW5pbWF0aW9uTm9kZUJhc2UpOklBbmltYXRpb25TdGF0ZVxyXG5cdHtcclxuXHRcdHZhciBjbGFzc05hbWU6YW55ID0gbm9kZS5zdGF0ZUNsYXNzO1xyXG5cdFx0dmFyIHVJRDpudW1iZXIgPSBub2RlLmlkO1xyXG5cclxuXHRcdGlmICh0aGlzLl9hbmltYXRpb25TdGF0ZXNbdUlEXSA9PSBudWxsKVxyXG5cdFx0XHR0aGlzLl9hbmltYXRpb25TdGF0ZXNbdUlEXSA9IG5ldyBjbGFzc05hbWUodGhpcywgbm9kZSk7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuX2FuaW1hdGlvblN0YXRlc1t1SURdO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldEFuaW1hdGlvblN0YXRlQnlOYW1lKG5hbWU6c3RyaW5nKTpJQW5pbWF0aW9uU3RhdGVcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRBbmltYXRpb25TdGF0ZSh0aGlzLl9wQW5pbWF0aW9uU2V0LmdldEFuaW1hdGlvbihuYW1lKSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBSZXR1cm5zIHRoZSBpbnRlcm5hbCBhYnNvbHV0ZSB0aW1lIG9mIHRoZSBhbmltYXRvciwgY2FsY3VsYXRlZCBieSB0aGUgY3VycmVudCB0aW1lIGFuZCB0aGUgcGxheWJhY2sgc3BlZWQuXHJcblx0ICpcclxuXHQgKiBAc2VlICN0aW1lXHJcblx0ICogQHNlZSAjcGxheWJhY2tTcGVlZFxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgYWJzb2x1dGVUaW1lKCk6bnVtYmVyXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3BBYnNvbHV0ZVRpbWU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBSZXR1cm5zIHRoZSBhbmltYXRpb24gZGF0YSBzZXQgaW4gdXNlIGJ5IHRoZSBhbmltYXRvci5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGFuaW1hdGlvblNldCgpOklBbmltYXRpb25TZXRcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fcEFuaW1hdGlvblNldDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJldHVybnMgdGhlIGN1cnJlbnQgYWN0aXZlIGFuaW1hdGlvbiBzdGF0ZS5cclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGFjdGl2ZVN0YXRlKCk6SUFuaW1hdGlvblN0YXRlXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3BBY3RpdmVTdGF0ZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJldHVybnMgdGhlIGN1cnJlbnQgYWN0aXZlIGFuaW1hdGlvbiBub2RlLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgYWN0aXZlQW5pbWF0aW9uKCk6QW5pbWF0aW9uTm9kZUJhc2VcclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fcEFuaW1hdGlvblNldC5nZXRBbmltYXRpb24odGhpcy5fcEFjdGl2ZUFuaW1hdGlvbk5hbWUpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmV0dXJucyB0aGUgY3VycmVudCBhY3RpdmUgYW5pbWF0aW9uIG5vZGUuXHJcblx0ICovXHJcblx0cHVibGljIGdldCBhY3RpdmVBbmltYXRpb25OYW1lKCk6c3RyaW5nXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3BBY3RpdmVBbmltYXRpb25OYW1lO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBhbmltYXRvcnMgaW50ZXJuYWwgdXBkYXRlIG1lY2hhbmlzbXMgYXJlIGFjdGl2ZS4gVXNlZCBpbiBjYXNlc1xyXG5cdCAqIHdoZXJlIG1hbnVhbCB1cGRhdGVzIGFyZSByZXF1aXJlZCBlaXRoZXIgdmlhIHRoZSA8Y29kZT50aW1lPC9jb2RlPiBwcm9wZXJ0eSBvciA8Y29kZT51cGRhdGUoKTwvY29kZT4gbWV0aG9kLlxyXG5cdCAqIERlZmF1bHRzIHRvIHRydWUuXHJcblx0ICpcclxuXHQgKiBAc2VlICN0aW1lXHJcblx0ICogQHNlZSAjdXBkYXRlKClcclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGF1dG9VcGRhdGUoKTpib29sZWFuXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX2F1dG9VcGRhdGU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IGF1dG9VcGRhdGUodmFsdWU6Ym9vbGVhbilcclxuXHR7XHJcblx0XHRpZiAodGhpcy5fYXV0b1VwZGF0ZSA9PSB2YWx1ZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2F1dG9VcGRhdGUgPSB2YWx1ZTtcclxuXHJcblx0XHRpZiAodGhpcy5fYXV0b1VwZGF0ZSlcclxuXHRcdFx0dGhpcy5zdGFydCgpOyBlbHNlXHJcblx0XHRcdHRoaXMuc3RvcCgpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogR2V0cyBhbmQgc2V0cyB0aGUgaW50ZXJuYWwgdGltZSBjbG9jayBvZiB0aGUgYW5pbWF0b3IuXHJcblx0ICovXHJcblx0cHVibGljIGdldCB0aW1lKCk6bnVtYmVyIC8qaW50Ki9cclxuXHR7XHJcblx0XHRyZXR1cm4gdGhpcy5fdGltZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXQgdGltZSh2YWx1ZTpudW1iZXIgLyppbnQqLylcclxuXHR7XHJcblx0XHRpZiAodGhpcy5fdGltZSA9PSB2YWx1ZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMudXBkYXRlKHZhbHVlKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFNldHMgdGhlIGFuaW1hdGlvbiBwaGFzZSBvZiB0aGUgY3VycmVudCBhY3RpdmUgc3RhdGUncyBhbmltYXRpb24gY2xpcChzKS5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB2YWx1ZSBUaGUgcGhhc2UgdmFsdWUgdG8gdXNlLiAwIHJlcHJlc2VudHMgdGhlIGJlZ2lubmluZyBvZiBhbiBhbmltYXRpb24gY2xpcCwgMSByZXByZXNlbnRzIHRoZSBlbmQuXHJcblx0ICovXHJcblx0cHVibGljIHBoYXNlKHZhbHVlOm51bWJlcilcclxuXHR7XHJcblx0XHR0aGlzLl9wQWN0aXZlU3RhdGUucGhhc2UodmFsdWUpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQ3JlYXRlcyBhIG5ldyA8Y29kZT5BbmltYXRvckJhc2U8L2NvZGU+IG9iamVjdC5cclxuXHQgKlxyXG5cdCAqIEBwYXJhbSBhbmltYXRpb25TZXQgVGhlIGFuaW1hdGlvbiBkYXRhIHNldCB0byBiZSB1c2VkIGJ5IHRoZSBhbmltYXRvciBvYmplY3QuXHJcblx0ICovXHJcblx0Y29uc3RydWN0b3IoYW5pbWF0aW9uU2V0OklBbmltYXRpb25TZXQpXHJcblx0e1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0XHR0aGlzLl9wQW5pbWF0aW9uU2V0ID0gYW5pbWF0aW9uU2V0O1xyXG5cclxuXHRcdHRoaXMuX2Jyb2FkY2FzdGVyID0gbmV3IFJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLm9uRW50ZXJGcmFtZSwgdGhpcyk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUaGUgYW1vdW50IGJ5IHdoaWNoIHBhc3NlZCB0aW1lIHNob3VsZCBiZSBzY2FsZWQuIFVzZWQgdG8gc2xvdyBkb3duIG9yIHNwZWVkIHVwIGFuaW1hdGlvbnMuIERlZmF1bHRzIHRvIDEuXHJcblx0ICovXHJcblx0cHVibGljIGdldCBwbGF5YmFja1NwZWVkKCk6bnVtYmVyXHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3BsYXliYWNrU3BlZWQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0IHBsYXliYWNrU3BlZWQodmFsdWU6bnVtYmVyKVxyXG5cdHtcclxuXHRcdHRoaXMuX3BsYXliYWNrU3BlZWQgPSB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRSZW5kZXJTdGF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSwgc3RhZ2U6U3RhZ2UsIGNhbWVyYTpDYW1lcmEsIHZlcnRleENvbnN0YW50T2Zmc2V0Om51bWJlciAvKmludCovLCB2ZXJ0ZXhTdHJlYW1PZmZzZXQ6bnVtYmVyIC8qaW50Ki8pXHJcblx0e1xyXG5cdFx0dGhyb3cgbmV3IEFic3RyYWN0TWV0aG9kRXJyb3IoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJlc3VtZXMgdGhlIGF1dG9tYXRpYyBwbGF5YmFjayBjbG9jayBjb250cm9saW5nIHRoZSBhY3RpdmUgc3RhdGUgb2YgdGhlIGFuaW1hdG9yLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdGFydCgpXHJcblx0e1xyXG5cdFx0aWYgKHRoaXMuX2lzUGxheWluZyB8fCAhdGhpcy5fYXV0b1VwZGF0ZSlcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX3RpbWUgPSB0aGlzLl9wQWJzb2x1dGVUaW1lID0gZ2V0VGltZXIoKTtcclxuXHJcblx0XHR0aGlzLl9pc1BsYXlpbmcgPSB0cnVlO1xyXG5cclxuXHRcdHRoaXMuX2Jyb2FkY2FzdGVyLnN0YXJ0KCk7XHJcblxyXG5cdFx0aWYgKCF0aGlzLmhhc0V2ZW50TGlzdGVuZXIoQW5pbWF0b3JFdmVudC5TVEFSVCkpXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHRpZiAodGhpcy5fc3RhcnRFdmVudCA9PSBudWxsKVxyXG5cdFx0XHR0aGlzLl9zdGFydEV2ZW50ID0gbmV3IEFuaW1hdG9yRXZlbnQoQW5pbWF0b3JFdmVudC5TVEFSVCwgdGhpcyk7XHJcblxyXG5cdFx0dGhpcy5kaXNwYXRjaEV2ZW50KHRoaXMuX3N0YXJ0RXZlbnQpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUGF1c2VzIHRoZSBhdXRvbWF0aWMgcGxheWJhY2sgY2xvY2sgb2YgdGhlIGFuaW1hdG9yLCBpbiBjYXNlIG1hbnVhbCB1cGRhdGVzIGFyZSByZXF1aXJlZCB2aWEgdGhlXHJcblx0ICogPGNvZGU+dGltZTwvY29kZT4gcHJvcGVydHkgb3IgPGNvZGU+dXBkYXRlKCk8L2NvZGU+IG1ldGhvZC5cclxuXHQgKlxyXG5cdCAqIEBzZWUgI3RpbWVcclxuXHQgKiBAc2VlICN1cGRhdGUoKVxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdG9wKClcclxuXHR7XHJcblx0XHRpZiAoIXRoaXMuX2lzUGxheWluZylcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2lzUGxheWluZyA9IGZhbHNlO1xyXG5cclxuXHRcdHRoaXMuX2Jyb2FkY2FzdGVyLnN0b3AoKTtcclxuXHJcblx0XHRpZiAoIXRoaXMuaGFzRXZlbnRMaXN0ZW5lcihBbmltYXRvckV2ZW50LlNUT1ApKVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0aWYgKHRoaXMuX3N0b3BFdmVudCA9PSBudWxsKVxyXG5cdFx0XHR0aGlzLl9zdG9wRXZlbnQgPSBuZXcgQW5pbWF0b3JFdmVudChBbmltYXRvckV2ZW50LlNUT1AsIHRoaXMpO1xyXG5cclxuXHRcdHRoaXMuZGlzcGF0Y2hFdmVudCh0aGlzLl9zdG9wRXZlbnQpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUHJvdmlkZXMgYSB3YXkgdG8gbWFudWFsbHkgdXBkYXRlIHRoZSBhY3RpdmUgc3RhdGUgb2YgdGhlIGFuaW1hdG9yIHdoZW4gYXV0b21hdGljXHJcblx0ICogdXBkYXRlcyBhcmUgZGlzYWJsZWQuXHJcblx0ICpcclxuXHQgKiBAc2VlICNzdG9wKClcclxuXHQgKiBAc2VlICNhdXRvVXBkYXRlXHJcblx0ICovXHJcblx0cHVibGljIHVwZGF0ZSh0aW1lOm51bWJlciAvKmludCovKVxyXG5cdHtcclxuXHRcdHZhciBkdDpudW1iZXIgPSAodGltZSAtIHRoaXMuX3RpbWUpKnRoaXMucGxheWJhY2tTcGVlZDtcclxuXHJcblx0XHR0aGlzLl9wVXBkYXRlRGVsdGFUaW1lKGR0KTtcclxuXHJcblx0XHR0aGlzLl90aW1lID0gdGltZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyByZXNldChuYW1lOnN0cmluZywgb2Zmc2V0Om51bWJlciA9IDApXHJcblx0e1xyXG5cdFx0dGhpcy5nZXRBbmltYXRpb25TdGF0ZSh0aGlzLl9wQW5pbWF0aW9uU2V0LmdldEFuaW1hdGlvbihuYW1lKSkub2Zmc2V0KG9mZnNldCArIHRoaXMuX3BBYnNvbHV0ZVRpbWUpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogVXNlZCBieSB0aGUgbWVzaCBvYmplY3QgdG8gd2hpY2ggdGhlIGFuaW1hdG9yIGlzIGFwcGxpZWQsIHJlZ2lzdGVycyB0aGUgb3duZXIgZm9yIGludGVybmFsIHVzZS5cclxuXHQgKlxyXG5cdCAqIEBwcml2YXRlXHJcblx0ICovXHJcblx0cHVibGljIGFkZE93bmVyKG1lc2g6TWVzaClcclxuXHR7XHJcblx0XHR0aGlzLl9wT3duZXJzLnB1c2gobWVzaCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBVc2VkIGJ5IHRoZSBtZXNoIG9iamVjdCBmcm9tIHdoaWNoIHRoZSBhbmltYXRvciBpcyByZW1vdmVkLCB1bnJlZ2lzdGVycyB0aGUgb3duZXIgZm9yIGludGVybmFsIHVzZS5cclxuXHQgKlxyXG5cdCAqIEBwcml2YXRlXHJcblx0ICovXHJcblx0cHVibGljIHJlbW92ZU93bmVyKG1lc2g6TWVzaClcclxuXHR7XHJcblx0XHR0aGlzLl9wT3duZXJzLnNwbGljZSh0aGlzLl9wT3duZXJzLmluZGV4T2YobWVzaCksIDEpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogSW50ZXJuYWwgYWJzdHJhY3QgbWV0aG9kIGNhbGxlZCB3aGVuIHRoZSB0aW1lIGRlbHRhIHByb3BlcnR5IG9mIHRoZSBhbmltYXRvcidzIGNvbnRlbnRzIHJlcXVpcmVzIHVwZGF0aW5nLlxyXG5cdCAqXHJcblx0ICogQHByaXZhdGVcclxuXHQgKi9cclxuXHRwdWJsaWMgX3BVcGRhdGVEZWx0YVRpbWUoZHQ6bnVtYmVyKVxyXG5cdHtcclxuXHRcdHRoaXMuX3BBYnNvbHV0ZVRpbWUgKz0gZHQ7XHJcblxyXG5cdFx0dGhpcy5fcEFjdGl2ZVN0YXRlLnVwZGF0ZSh0aGlzLl9wQWJzb2x1dGVUaW1lKTtcclxuXHJcblx0XHRpZiAodGhpcy51cGRhdGVQb3NpdGlvbilcclxuXHRcdFx0dGhpcy5hcHBseVBvc2l0aW9uRGVsdGEoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEVudGVyIGZyYW1lIGV2ZW50IGhhbmRsZXIgZm9yIGF1dG9tYXRpY2FsbHkgdXBkYXRpbmcgdGhlIGFjdGl2ZSBzdGF0ZSBvZiB0aGUgYW5pbWF0b3IuXHJcblx0ICovXHJcblx0cHJpdmF0ZSBvbkVudGVyRnJhbWUoZXZlbnQ6RXZlbnQgPSBudWxsKVxyXG5cdHtcclxuXHRcdHRoaXMudXBkYXRlKGdldFRpbWVyKCkpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBhcHBseVBvc2l0aW9uRGVsdGEoKVxyXG5cdHtcclxuXHRcdHZhciBkZWx0YTpWZWN0b3IzRCA9IHRoaXMuX3BBY3RpdmVTdGF0ZS5wb3NpdGlvbkRlbHRhO1xyXG5cdFx0dmFyIGRpc3Q6bnVtYmVyID0gZGVsdGEubGVuZ3RoO1xyXG5cdFx0dmFyIGxlbjpudW1iZXIgLyp1aW50Ki87XHJcblx0XHRpZiAoZGlzdCA+IDApIHtcclxuXHRcdFx0bGVuID0gdGhpcy5fcE93bmVycy5sZW5ndGg7XHJcblx0XHRcdGZvciAodmFyIGk6bnVtYmVyIC8qdWludCovID0gMDsgaSA8IGxlbjsgKytpKVxyXG5cdFx0XHRcdHRoaXMuX3BPd25lcnNbaV0udHJhbnNsYXRlTG9jYWwoZGVsdGEsIGRpc3QpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogIGZvciBpbnRlcm5hbCB1c2UuXHJcblx0ICpcclxuXHQgKiBAcHJpdmF0ZVxyXG5cdCAqL1xyXG5cdHB1YmxpYyBkaXNwYXRjaEN5Y2xlRXZlbnQoKVxyXG5cdHtcclxuXHRcdGlmICh0aGlzLmhhc0V2ZW50TGlzdGVuZXIoQW5pbWF0b3JFdmVudC5DWUNMRV9DT01QTEVURSkpIHtcclxuXHRcdFx0aWYgKHRoaXMuX2N5Y2xlRXZlbnQgPT0gbnVsbClcclxuXHRcdFx0XHR0aGlzLl9jeWNsZUV2ZW50ID0gbmV3IEFuaW1hdG9yRXZlbnQoQW5pbWF0b3JFdmVudC5DWUNMRV9DT01QTEVURSwgdGhpcyk7XHJcblxyXG5cdFx0XHR0aGlzLmRpc3BhdGNoRXZlbnQodGhpcy5fY3ljbGVFdmVudCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBjbG9uZSgpOkFuaW1hdG9yQmFzZVxyXG5cdHtcclxuXHRcdHRocm93IG5ldyBBYnN0cmFjdE1ldGhvZEVycm9yKCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBkaXNwb3NlKClcclxuXHR7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyB0ZXN0R1BVQ29tcGF0aWJpbGl0eShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSlcclxuXHR7XHJcblx0XHR0aHJvdyBuZXcgQWJzdHJhY3RNZXRob2RFcnJvcigpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgZ2V0IGFzc2V0VHlwZSgpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHJldHVybiBBc3NldFR5cGUuQU5JTUFUT1I7XHJcblx0fVxyXG5cclxuXHJcblx0cHVibGljIGdldFJlbmRlcmFibGVTdWJHZW9tZXRyeShyZW5kZXJhYmxlOlRyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGUsIHNvdXJjZVN1Ykdlb21ldHJ5OlRyaWFuZ2xlU3ViR2VvbWV0cnkpOlRyaWFuZ2xlU3ViR2VvbWV0cnlcclxuXHR7XHJcblx0XHQvL25vdGhpbmcgdG8gZG8gaGVyZVxyXG5cdFx0cmV0dXJuIHNvdXJjZVN1Ykdlb21ldHJ5O1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0ID0gQW5pbWF0b3JCYXNlOyJdfQ==