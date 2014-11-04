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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvYW5pbWF0b3JiYXNlLnRzIl0sIm5hbWVzIjpbIkFuaW1hdG9yQmFzZSIsIkFuaW1hdG9yQmFzZS5jb25zdHJ1Y3RvciIsIkFuaW1hdG9yQmFzZS5nZXRBbmltYXRpb25TdGF0ZSIsIkFuaW1hdG9yQmFzZS5nZXRBbmltYXRpb25TdGF0ZUJ5TmFtZSIsIkFuaW1hdG9yQmFzZS5hYnNvbHV0ZVRpbWUiLCJBbmltYXRvckJhc2UuYW5pbWF0aW9uU2V0IiwiQW5pbWF0b3JCYXNlLmFjdGl2ZVN0YXRlIiwiQW5pbWF0b3JCYXNlLmFjdGl2ZUFuaW1hdGlvbiIsIkFuaW1hdG9yQmFzZS5hY3RpdmVBbmltYXRpb25OYW1lIiwiQW5pbWF0b3JCYXNlLmF1dG9VcGRhdGUiLCJBbmltYXRvckJhc2UudGltZSIsIkFuaW1hdG9yQmFzZS5waGFzZSIsIkFuaW1hdG9yQmFzZS5wbGF5YmFja1NwZWVkIiwiQW5pbWF0b3JCYXNlLnNldFJlbmRlclN0YXRlIiwiQW5pbWF0b3JCYXNlLnN0YXJ0IiwiQW5pbWF0b3JCYXNlLnN0b3AiLCJBbmltYXRvckJhc2UudXBkYXRlIiwiQW5pbWF0b3JCYXNlLnJlc2V0IiwiQW5pbWF0b3JCYXNlLmFkZE93bmVyIiwiQW5pbWF0b3JCYXNlLnJlbW92ZU93bmVyIiwiQW5pbWF0b3JCYXNlLl9wVXBkYXRlRGVsdGFUaW1lIiwiQW5pbWF0b3JCYXNlLm9uRW50ZXJGcmFtZSIsIkFuaW1hdG9yQmFzZS5hcHBseVBvc2l0aW9uRGVsdGEiLCJBbmltYXRvckJhc2UuZGlzcGF0Y2hDeWNsZUV2ZW50IiwiQW5pbWF0b3JCYXNlLmNsb25lIiwiQW5pbWF0b3JCYXNlLmRpc3Bvc2UiLCJBbmltYXRvckJhc2UudGVzdEdQVUNvbXBhdGliaWxpdHkiLCJBbmltYXRvckJhc2UuYXNzZXRUeXBlIiwiQW5pbWF0b3JCYXNlLmdldFJlbmRlcmFibGVTdWJHZW9tZXRyeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7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QSxDQUFDQSxhQUFhQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtRQUN0Q0EsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUFFRHZCOztPQUVHQTtJQUNJQSw0QkFBS0EsR0FBWkE7UUFFQ3dCLE1BQU1BLElBQUlBLG1CQUFtQkEsRUFBRUEsQ0FBQ0E7SUFDakNBLENBQUNBO0lBRUR4Qjs7T0FFR0E7SUFDSUEsOEJBQU9BLEdBQWRBO0lBRUF5QixDQUFDQTtJQUVEekI7O09BRUdBO0lBQ0lBLDJDQUFvQkEsR0FBM0JBLFVBQTRCQSxZQUE2QkE7UUFFeEQwQixNQUFNQSxJQUFJQSxtQkFBbUJBLEVBQUVBLENBQUNBO0lBQ2pDQSxDQUFDQTtJQUtEMUIsc0JBQVdBLG1DQUFTQTtRQUhwQkE7O1dBRUdBO2FBQ0hBO1lBRUMyQixNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQSxRQUFRQSxDQUFDQTtRQUMzQkEsQ0FBQ0E7OztPQUFBM0I7SUFHTUEsK0NBQXdCQSxHQUEvQkEsVUFBZ0NBLFVBQW9DQSxFQUFFQSxpQkFBcUNBO1FBRTFHNEIsQUFDQUEsb0JBRG9CQTtRQUNwQkEsTUFBTUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQTtJQUMxQkEsQ0FBQ0E7SUFDRjVCLG1CQUFDQTtBQUFEQSxDQXpWQSxBQXlWQ0EsRUF6VjBCLGNBQWMsRUF5VnhDO0FBRUQsQUFBc0IsaUJBQWIsWUFBWSxDQUFDIiwiZmlsZSI6ImFuaW1hdG9ycy9BbmltYXRvckJhc2UuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIik7XG5pbXBvcnQgQXNzZXRUeXBlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0Fzc2V0VHlwZVwiKTtcbmltcG9ydCBOYW1lZEFzc2V0QmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvTmFtZWRBc3NldEJhc2VcIik7XG5pbXBvcnQgQWJzdHJhY3RNZXRob2RFcnJvclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9lcnJvcnMvQWJzdHJhY3RNZXRob2RFcnJvclwiKTtcbmltcG9ydCBSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL1JlcXVlc3RBbmltYXRpb25GcmFtZVwiKTtcbmltcG9ydCBnZXRUaW1lclx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9nZXRUaW1lclwiKTtcblxuaW1wb3J0IElBbmltYXRpb25TZXRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9hbmltYXRvcnMvSUFuaW1hdGlvblNldFwiKTtcbmltcG9ydCBJQW5pbWF0b3JcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2FuaW1hdG9ycy9JQW5pbWF0b3JcIik7XG5pbXBvcnQgQW5pbWF0aW9uTm9kZUJhc2VcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYW5pbWF0b3JzL25vZGVzL0FuaW1hdGlvbk5vZGVCYXNlXCIpO1xuaW1wb3J0IFRyaWFuZ2xlU3ViR2VvbWV0cnlcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9UcmlhbmdsZVN1Ykdlb21ldHJ5XCIpO1xuaW1wb3J0IENhbWVyYVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9DYW1lcmFcIik7XG5pbXBvcnQgTWVzaFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL01lc2hcIik7XG5cbmltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuXG5pbXBvcnQgSUFuaW1hdGlvblN0YXRlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL3N0YXRlcy9JQW5pbWF0aW9uU3RhdGVcIik7XG5pbXBvcnQgUmVuZGVyYWJsZUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL1JlbmRlcmFibGVCYXNlXCIpO1xuaW1wb3J0IFRyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGVcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL1RyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGVcIik7XG5pbXBvcnQgQW5pbWF0b3JFdmVudFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2V2ZW50cy9BbmltYXRvckV2ZW50XCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuXG4vKipcbiAqIERpc3BhdGNoZWQgd2hlbiBwbGF5YmFjayBvZiBhbiBhbmltYXRpb24gaW5zaWRlIHRoZSBhbmltYXRvciBvYmplY3Qgc3RhcnRzLlxuICpcbiAqIEBldmVudFR5cGUgYXdheTNkLmV2ZW50cy5BbmltYXRvckV2ZW50XG4gKi9cbi8vW0V2ZW50KG5hbWU9XCJzdGFydFwiLCB0eXBlPVwiYXdheTNkLmV2ZW50cy5BbmltYXRvckV2ZW50XCIpXVxuXG4vKipcbiAqIERpc3BhdGNoZWQgd2hlbiBwbGF5YmFjayBvZiBhbiBhbmltYXRpb24gaW5zaWRlIHRoZSBhbmltYXRvciBvYmplY3Qgc3RvcHMuXG4gKlxuICogQGV2ZW50VHlwZSBhd2F5M2QuZXZlbnRzLkFuaW1hdG9yRXZlbnRcbiAqL1xuLy9bRXZlbnQobmFtZT1cInN0b3BcIiwgdHlwZT1cImF3YXkzZC5ldmVudHMuQW5pbWF0b3JFdmVudFwiKV1cblxuLyoqXG4gKiBEaXNwYXRjaGVkIHdoZW4gcGxheWJhY2sgb2YgYW4gYW5pbWF0aW9uIHJlYWNoZXMgdGhlIGVuZCBvZiBhbiBhbmltYXRpb24uXG4gKlxuICogQGV2ZW50VHlwZSBhd2F5M2QuZXZlbnRzLkFuaW1hdG9yRXZlbnRcbiAqL1xuLy9bRXZlbnQobmFtZT1cImN5Y2xlX2NvbXBsZXRlXCIsIHR5cGU9XCJhd2F5M2QuZXZlbnRzLkFuaW1hdG9yRXZlbnRcIildXG5cbi8qKlxuICogUHJvdmlkZXMgYW4gYWJzdHJhY3QgYmFzZSBjbGFzcyBmb3IgYW5pbWF0b3IgY2xhc3NlcyB0aGF0IGNvbnRyb2wgYW5pbWF0aW9uIG91dHB1dCBmcm9tIGEgZGF0YSBzZXQgc3VidHlwZSBvZiA8Y29kZT5BbmltYXRpb25TZXRCYXNlPC9jb2RlPi5cbiAqXG4gKiBAc2VlIGF3YXkuYW5pbWF0b3JzLkFuaW1hdGlvblNldEJhc2VcbiAqL1xuY2xhc3MgQW5pbWF0b3JCYXNlIGV4dGVuZHMgTmFtZWRBc3NldEJhc2UgaW1wbGVtZW50cyBJQW5pbWF0b3Jcbntcblx0cHJpdmF0ZSBfYnJvYWRjYXN0ZXI6UmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXHRwcml2YXRlIF9pc1BsYXlpbmc6Ym9vbGVhbjtcblx0cHJpdmF0ZSBfYXV0b1VwZGF0ZTpib29sZWFuID0gdHJ1ZTtcblx0cHJpdmF0ZSBfc3RhcnRFdmVudDpBbmltYXRvckV2ZW50O1xuXHRwcml2YXRlIF9zdG9wRXZlbnQ6QW5pbWF0b3JFdmVudDtcblx0cHJpdmF0ZSBfY3ljbGVFdmVudDpBbmltYXRvckV2ZW50O1xuXHRwcml2YXRlIF90aW1lOm51bWJlciAvKmludCovID0gMDtcblx0cHJpdmF0ZSBfcGxheWJhY2tTcGVlZDpudW1iZXIgPSAxO1xuXG5cdHB1YmxpYyBfcEFuaW1hdGlvblNldDpJQW5pbWF0aW9uU2V0O1xuXHRwdWJsaWMgX3BPd25lcnM6QXJyYXk8TWVzaD4gPSBuZXcgQXJyYXk8TWVzaD4oKTtcblx0cHVibGljIF9wQWN0aXZlTm9kZTpBbmltYXRpb25Ob2RlQmFzZTtcblx0cHVibGljIF9wQWN0aXZlU3RhdGU6SUFuaW1hdGlvblN0YXRlO1xuXHRwdWJsaWMgX3BBY3RpdmVBbmltYXRpb25OYW1lOnN0cmluZztcblx0cHVibGljIF9wQWJzb2x1dGVUaW1lOm51bWJlciA9IDA7XG5cblx0cHJpdmF0ZSBfYW5pbWF0aW9uU3RhdGVzOk9iamVjdCA9IG5ldyBPYmplY3QoKTtcblxuXHQvKipcblx0ICogRW5hYmxlcyB0cmFuc2xhdGlvbiBvZiB0aGUgYW5pbWF0ZWQgbWVzaCBmcm9tIGRhdGEgcmV0dXJuZWQgcGVyIGZyYW1lIHZpYSB0aGUgcG9zaXRpb25EZWx0YSBwcm9wZXJ0eSBvZiB0aGUgYWN0aXZlIGFuaW1hdGlvbiBub2RlLiBEZWZhdWx0cyB0byB0cnVlLlxuXHQgKlxuXHQgKiBAc2VlIGF3YXkuYW5pbWF0b3JzLklBbmltYXRpb25TdGF0ZSNwb3NpdGlvbkRlbHRhXG5cdCAqL1xuXHRwdWJsaWMgdXBkYXRlUG9zaXRpb246Ym9vbGVhbiA9IHRydWU7XG5cblx0cHVibGljIGdldEFuaW1hdGlvblN0YXRlKG5vZGU6QW5pbWF0aW9uTm9kZUJhc2UpOklBbmltYXRpb25TdGF0ZVxuXHR7XG5cdFx0dmFyIGNsYXNzTmFtZTphbnkgPSBub2RlLnN0YXRlQ2xhc3M7XG5cdFx0dmFyIHVJRDpudW1iZXIgPSBub2RlLmlkO1xuXG5cdFx0aWYgKHRoaXMuX2FuaW1hdGlvblN0YXRlc1t1SURdID09IG51bGwpXG5cdFx0XHR0aGlzLl9hbmltYXRpb25TdGF0ZXNbdUlEXSA9IG5ldyBjbGFzc05hbWUodGhpcywgbm9kZSk7XG5cblx0XHRyZXR1cm4gdGhpcy5fYW5pbWF0aW9uU3RhdGVzW3VJRF07XG5cdH1cblxuXHRwdWJsaWMgZ2V0QW5pbWF0aW9uU3RhdGVCeU5hbWUobmFtZTpzdHJpbmcpOklBbmltYXRpb25TdGF0ZVxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0QW5pbWF0aW9uU3RhdGUodGhpcy5fcEFuaW1hdGlvblNldC5nZXRBbmltYXRpb24obmFtZSkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGludGVybmFsIGFic29sdXRlIHRpbWUgb2YgdGhlIGFuaW1hdG9yLCBjYWxjdWxhdGVkIGJ5IHRoZSBjdXJyZW50IHRpbWUgYW5kIHRoZSBwbGF5YmFjayBzcGVlZC5cblx0ICpcblx0ICogQHNlZSAjdGltZVxuXHQgKiBAc2VlICNwbGF5YmFja1NwZWVkXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFic29sdXRlVGltZSgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3BBYnNvbHV0ZVRpbWU7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgYW5pbWF0aW9uIGRhdGEgc2V0IGluIHVzZSBieSB0aGUgYW5pbWF0b3IuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFuaW1hdGlvblNldCgpOklBbmltYXRpb25TZXRcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wQW5pbWF0aW9uU2V0O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGN1cnJlbnQgYWN0aXZlIGFuaW1hdGlvbiBzdGF0ZS5cblx0ICovXG5cdHB1YmxpYyBnZXQgYWN0aXZlU3RhdGUoKTpJQW5pbWF0aW9uU3RhdGVcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wQWN0aXZlU3RhdGU7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgY3VycmVudCBhY3RpdmUgYW5pbWF0aW9uIG5vZGUuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGFjdGl2ZUFuaW1hdGlvbigpOkFuaW1hdGlvbk5vZGVCYXNlXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcEFuaW1hdGlvblNldC5nZXRBbmltYXRpb24odGhpcy5fcEFjdGl2ZUFuaW1hdGlvbk5hbWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGN1cnJlbnQgYWN0aXZlIGFuaW1hdGlvbiBub2RlLlxuXHQgKi9cblx0cHVibGljIGdldCBhY3RpdmVBbmltYXRpb25OYW1lKCk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcEFjdGl2ZUFuaW1hdGlvbk5hbWU7XG5cdH1cblxuXHQvKipcblx0ICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBhbmltYXRvcnMgaW50ZXJuYWwgdXBkYXRlIG1lY2hhbmlzbXMgYXJlIGFjdGl2ZS4gVXNlZCBpbiBjYXNlc1xuXHQgKiB3aGVyZSBtYW51YWwgdXBkYXRlcyBhcmUgcmVxdWlyZWQgZWl0aGVyIHZpYSB0aGUgPGNvZGU+dGltZTwvY29kZT4gcHJvcGVydHkgb3IgPGNvZGU+dXBkYXRlKCk8L2NvZGU+IG1ldGhvZC5cblx0ICogRGVmYXVsdHMgdG8gdHJ1ZS5cblx0ICpcblx0ICogQHNlZSAjdGltZVxuXHQgKiBAc2VlICN1cGRhdGUoKVxuXHQgKi9cblx0cHVibGljIGdldCBhdXRvVXBkYXRlKCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2F1dG9VcGRhdGU7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGF1dG9VcGRhdGUodmFsdWU6Ym9vbGVhbilcblx0e1xuXHRcdGlmICh0aGlzLl9hdXRvVXBkYXRlID09IHZhbHVlKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fYXV0b1VwZGF0ZSA9IHZhbHVlO1xuXG5cdFx0aWYgKHRoaXMuX2F1dG9VcGRhdGUpXG5cdFx0XHR0aGlzLnN0YXJ0KCk7IGVsc2Vcblx0XHRcdHRoaXMuc3RvcCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgYW5kIHNldHMgdGhlIGludGVybmFsIHRpbWUgY2xvY2sgb2YgdGhlIGFuaW1hdG9yLlxuXHQgKi9cblx0cHVibGljIGdldCB0aW1lKCk6bnVtYmVyIC8qaW50Ki9cblx0e1xuXHRcdHJldHVybiB0aGlzLl90aW1lO1xuXHR9XG5cblx0cHVibGljIHNldCB0aW1lKHZhbHVlOm51bWJlciAvKmludCovKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3RpbWUgPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLnVwZGF0ZSh2YWx1ZSk7XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgYW5pbWF0aW9uIHBoYXNlIG9mIHRoZSBjdXJyZW50IGFjdGl2ZSBzdGF0ZSdzIGFuaW1hdGlvbiBjbGlwKHMpLlxuXHQgKlxuXHQgKiBAcGFyYW0gdmFsdWUgVGhlIHBoYXNlIHZhbHVlIHRvIHVzZS4gMCByZXByZXNlbnRzIHRoZSBiZWdpbm5pbmcgb2YgYW4gYW5pbWF0aW9uIGNsaXAsIDEgcmVwcmVzZW50cyB0aGUgZW5kLlxuXHQgKi9cblx0cHVibGljIHBoYXNlKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3BBY3RpdmVTdGF0ZS5waGFzZSh2YWx1ZSk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyA8Y29kZT5BbmltYXRvckJhc2U8L2NvZGU+IG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIGFuaW1hdGlvblNldCBUaGUgYW5pbWF0aW9uIGRhdGEgc2V0IHRvIGJlIHVzZWQgYnkgdGhlIGFuaW1hdG9yIG9iamVjdC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGFuaW1hdGlvblNldDpJQW5pbWF0aW9uU2V0KVxuXHR7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuX3BBbmltYXRpb25TZXQgPSBhbmltYXRpb25TZXQ7XG5cblx0XHR0aGlzLl9icm9hZGNhc3RlciA9IG5ldyBSZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5vbkVudGVyRnJhbWUsIHRoaXMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSBhbW91bnQgYnkgd2hpY2ggcGFzc2VkIHRpbWUgc2hvdWxkIGJlIHNjYWxlZC4gVXNlZCB0byBzbG93IGRvd24gb3Igc3BlZWQgdXAgYW5pbWF0aW9ucy4gRGVmYXVsdHMgdG8gMS5cblx0ICovXG5cdHB1YmxpYyBnZXQgcGxheWJhY2tTcGVlZCgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3BsYXliYWNrU3BlZWQ7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHBsYXliYWNrU3BlZWQodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fcGxheWJhY2tTcGVlZCA9IHZhbHVlO1xuXHR9XG5cblx0cHVibGljIHNldFJlbmRlclN0YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCBzdGFnZTpTdGFnZSwgY2FtZXJhOkNhbWVyYSwgdmVydGV4Q29uc3RhbnRPZmZzZXQ6bnVtYmVyIC8qaW50Ki8sIHZlcnRleFN0cmVhbU9mZnNldDpudW1iZXIgLyppbnQqLylcblx0e1xuXHRcdHRocm93IG5ldyBBYnN0cmFjdE1ldGhvZEVycm9yKCk7XG5cdH1cblxuXHQvKipcblx0ICogUmVzdW1lcyB0aGUgYXV0b21hdGljIHBsYXliYWNrIGNsb2NrIGNvbnRyb2xpbmcgdGhlIGFjdGl2ZSBzdGF0ZSBvZiB0aGUgYW5pbWF0b3IuXG5cdCAqL1xuXHRwdWJsaWMgc3RhcnQoKVxuXHR7XG5cdFx0aWYgKHRoaXMuX2lzUGxheWluZyB8fCAhdGhpcy5fYXV0b1VwZGF0ZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX3RpbWUgPSB0aGlzLl9wQWJzb2x1dGVUaW1lID0gZ2V0VGltZXIoKTtcblxuXHRcdHRoaXMuX2lzUGxheWluZyA9IHRydWU7XG5cblx0XHR0aGlzLl9icm9hZGNhc3Rlci5zdGFydCgpO1xuXG5cdFx0aWYgKCF0aGlzLmhhc0V2ZW50TGlzdGVuZXIoQW5pbWF0b3JFdmVudC5TVEFSVCkpXG5cdFx0XHRyZXR1cm47XG5cblx0XHRpZiAodGhpcy5fc3RhcnRFdmVudCA9PSBudWxsKVxuXHRcdFx0dGhpcy5fc3RhcnRFdmVudCA9IG5ldyBBbmltYXRvckV2ZW50KEFuaW1hdG9yRXZlbnQuU1RBUlQsIHRoaXMpO1xuXG5cdFx0dGhpcy5kaXNwYXRjaEV2ZW50KHRoaXMuX3N0YXJ0RXZlbnQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBhdXNlcyB0aGUgYXV0b21hdGljIHBsYXliYWNrIGNsb2NrIG9mIHRoZSBhbmltYXRvciwgaW4gY2FzZSBtYW51YWwgdXBkYXRlcyBhcmUgcmVxdWlyZWQgdmlhIHRoZVxuXHQgKiA8Y29kZT50aW1lPC9jb2RlPiBwcm9wZXJ0eSBvciA8Y29kZT51cGRhdGUoKTwvY29kZT4gbWV0aG9kLlxuXHQgKlxuXHQgKiBAc2VlICN0aW1lXG5cdCAqIEBzZWUgI3VwZGF0ZSgpXG5cdCAqL1xuXHRwdWJsaWMgc3RvcCgpXG5cdHtcblx0XHRpZiAoIXRoaXMuX2lzUGxheWluZylcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX2lzUGxheWluZyA9IGZhbHNlO1xuXG5cdFx0dGhpcy5fYnJvYWRjYXN0ZXIuc3RvcCgpO1xuXG5cdFx0aWYgKCF0aGlzLmhhc0V2ZW50TGlzdGVuZXIoQW5pbWF0b3JFdmVudC5TVE9QKSlcblx0XHRcdHJldHVybjtcblxuXHRcdGlmICh0aGlzLl9zdG9wRXZlbnQgPT0gbnVsbClcblx0XHRcdHRoaXMuX3N0b3BFdmVudCA9IG5ldyBBbmltYXRvckV2ZW50KEFuaW1hdG9yRXZlbnQuU1RPUCwgdGhpcyk7XG5cblx0XHR0aGlzLmRpc3BhdGNoRXZlbnQodGhpcy5fc3RvcEV2ZW50KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQcm92aWRlcyBhIHdheSB0byBtYW51YWxseSB1cGRhdGUgdGhlIGFjdGl2ZSBzdGF0ZSBvZiB0aGUgYW5pbWF0b3Igd2hlbiBhdXRvbWF0aWNcblx0ICogdXBkYXRlcyBhcmUgZGlzYWJsZWQuXG5cdCAqXG5cdCAqIEBzZWUgI3N0b3AoKVxuXHQgKiBAc2VlICNhdXRvVXBkYXRlXG5cdCAqL1xuXHRwdWJsaWMgdXBkYXRlKHRpbWU6bnVtYmVyIC8qaW50Ki8pXG5cdHtcblx0XHR2YXIgZHQ6bnVtYmVyID0gKHRpbWUgLSB0aGlzLl90aW1lKSp0aGlzLnBsYXliYWNrU3BlZWQ7XG5cblx0XHR0aGlzLl9wVXBkYXRlRGVsdGFUaW1lKGR0KTtcblxuXHRcdHRoaXMuX3RpbWUgPSB0aW1lO1xuXHR9XG5cblx0cHVibGljIHJlc2V0KG5hbWU6c3RyaW5nLCBvZmZzZXQ6bnVtYmVyID0gMClcblx0e1xuXHRcdHRoaXMuZ2V0QW5pbWF0aW9uU3RhdGUodGhpcy5fcEFuaW1hdGlvblNldC5nZXRBbmltYXRpb24obmFtZSkpLm9mZnNldChvZmZzZXQgKyB0aGlzLl9wQWJzb2x1dGVUaW1lKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBVc2VkIGJ5IHRoZSBtZXNoIG9iamVjdCB0byB3aGljaCB0aGUgYW5pbWF0b3IgaXMgYXBwbGllZCwgcmVnaXN0ZXJzIHRoZSBvd25lciBmb3IgaW50ZXJuYWwgdXNlLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHVibGljIGFkZE93bmVyKG1lc2g6TWVzaClcblx0e1xuXHRcdHRoaXMuX3BPd25lcnMucHVzaChtZXNoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBVc2VkIGJ5IHRoZSBtZXNoIG9iamVjdCBmcm9tIHdoaWNoIHRoZSBhbmltYXRvciBpcyByZW1vdmVkLCB1bnJlZ2lzdGVycyB0aGUgb3duZXIgZm9yIGludGVybmFsIHVzZS5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHB1YmxpYyByZW1vdmVPd25lcihtZXNoOk1lc2gpXG5cdHtcblx0XHR0aGlzLl9wT3duZXJzLnNwbGljZSh0aGlzLl9wT3duZXJzLmluZGV4T2YobWVzaCksIDEpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEludGVybmFsIGFic3RyYWN0IG1ldGhvZCBjYWxsZWQgd2hlbiB0aGUgdGltZSBkZWx0YSBwcm9wZXJ0eSBvZiB0aGUgYW5pbWF0b3IncyBjb250ZW50cyByZXF1aXJlcyB1cGRhdGluZy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHB1YmxpYyBfcFVwZGF0ZURlbHRhVGltZShkdDpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9wQWJzb2x1dGVUaW1lICs9IGR0O1xuXG5cdFx0dGhpcy5fcEFjdGl2ZVN0YXRlLnVwZGF0ZSh0aGlzLl9wQWJzb2x1dGVUaW1lKTtcblxuXHRcdGlmICh0aGlzLnVwZGF0ZVBvc2l0aW9uKVxuXHRcdFx0dGhpcy5hcHBseVBvc2l0aW9uRGVsdGEoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBFbnRlciBmcmFtZSBldmVudCBoYW5kbGVyIGZvciBhdXRvbWF0aWNhbGx5IHVwZGF0aW5nIHRoZSBhY3RpdmUgc3RhdGUgb2YgdGhlIGFuaW1hdG9yLlxuXHQgKi9cblx0cHJpdmF0ZSBvbkVudGVyRnJhbWUoZXZlbnQ6RXZlbnQgPSBudWxsKVxuXHR7XG5cdFx0dGhpcy51cGRhdGUoZ2V0VGltZXIoKSk7XG5cdH1cblxuXHRwcml2YXRlIGFwcGx5UG9zaXRpb25EZWx0YSgpXG5cdHtcblx0XHR2YXIgZGVsdGE6VmVjdG9yM0QgPSB0aGlzLl9wQWN0aXZlU3RhdGUucG9zaXRpb25EZWx0YTtcblx0XHR2YXIgZGlzdDpudW1iZXIgPSBkZWx0YS5sZW5ndGg7XG5cdFx0dmFyIGxlbjpudW1iZXIgLyp1aW50Ki87XG5cdFx0aWYgKGRpc3QgPiAwKSB7XG5cdFx0XHRsZW4gPSB0aGlzLl9wT3duZXJzLmxlbmd0aDtcblx0XHRcdGZvciAodmFyIGk6bnVtYmVyIC8qdWludCovID0gMDsgaSA8IGxlbjsgKytpKVxuXHRcdFx0XHR0aGlzLl9wT3duZXJzW2ldLnRyYW5zbGF0ZUxvY2FsKGRlbHRhLCBkaXN0KTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogIGZvciBpbnRlcm5hbCB1c2UuXG5cdCAqXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwdWJsaWMgZGlzcGF0Y2hDeWNsZUV2ZW50KClcblx0e1xuXHRcdGlmICh0aGlzLmhhc0V2ZW50TGlzdGVuZXIoQW5pbWF0b3JFdmVudC5DWUNMRV9DT01QTEVURSkpIHtcblx0XHRcdGlmICh0aGlzLl9jeWNsZUV2ZW50ID09IG51bGwpXG5cdFx0XHRcdHRoaXMuX2N5Y2xlRXZlbnQgPSBuZXcgQW5pbWF0b3JFdmVudChBbmltYXRvckV2ZW50LkNZQ0xFX0NPTVBMRVRFLCB0aGlzKTtcblxuXHRcdFx0dGhpcy5kaXNwYXRjaEV2ZW50KHRoaXMuX2N5Y2xlRXZlbnQpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGNsb25lKCk6QW5pbWF0b3JCYXNlXG5cdHtcblx0XHR0aHJvdyBuZXcgQWJzdHJhY3RNZXRob2RFcnJvcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZGlzcG9zZSgpXG5cdHtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIHRlc3RHUFVDb21wYXRpYmlsaXR5KHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKVxuXHR7XG5cdFx0dGhyb3cgbmV3IEFic3RyYWN0TWV0aG9kRXJyb3IoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldCBhc3NldFR5cGUoKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiBBc3NldFR5cGUuQU5JTUFUT1I7XG5cdH1cblxuXG5cdHB1YmxpYyBnZXRSZW5kZXJhYmxlU3ViR2VvbWV0cnkocmVuZGVyYWJsZTpUcmlhbmdsZVN1Yk1lc2hSZW5kZXJhYmxlLCBzb3VyY2VTdWJHZW9tZXRyeTpUcmlhbmdsZVN1Ykdlb21ldHJ5KTpUcmlhbmdsZVN1Ykdlb21ldHJ5XG5cdHtcblx0XHQvL25vdGhpbmcgdG8gZG8gaGVyZVxuXHRcdHJldHVybiBzb3VyY2VTdWJHZW9tZXRyeTtcblx0fVxufVxuXG5leHBvcnQgPSBBbmltYXRvckJhc2U7Il19