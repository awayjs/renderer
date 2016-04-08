"use strict";
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var RequestAnimationFrame_1 = require("awayjs-core/lib/utils/RequestAnimationFrame");
var View_1 = require("awayjs-display/lib/View");
var HoverController_1 = require("awayjs-display/lib/controllers/HoverController");
var LineSegment_1 = require("awayjs-display/lib/display/LineSegment");
var BasicMaterial_1 = require("awayjs-display/lib/materials/BasicMaterial");
var DefaultRenderer_1 = require("awayjs-renderergl/lib/DefaultRenderer");
var LineSegmentTest = (function () {
    /**
     * Constructor
     */
    function LineSegmentTest() {
        this._time = 0;
        this._move = false;
        this.init();
    }
    /**
     * Global initialise function
     */
    LineSegmentTest.prototype.init = function () {
        this.initEngine();
        this.initObjects();
        this.initListeners();
    };
    /**
     * Initialise the engine
     */
    LineSegmentTest.prototype.initEngine = function () {
        this._view = new View_1.default(new DefaultRenderer_1.default());
        //setup the camera for optimal shadow rendering
        this._view.camera.projection.far = 2100;
        //setup controller to be used on the camera
        this._cameraController = new HoverController_1.default(this._view.camera, null, 45, 20, 1000, 10);
    };
    LineSegmentTest.prototype.initObjects = function () {
        var material = new BasicMaterial_1.default(0xFFFFFF);
        var x, y, z, s;
        for (var c = 0; c < 100; c++) {
            x = this.getRandom(-400, 400);
            y = this.getRandom(-400, 400);
            z = this.getRandom(-400, 400);
            s = new LineSegment_1.default(material, new Vector3D_1.default(0, 0, 0), new Vector3D_1.default(x, y, z), 3);
            this._view.scene.addChild(s);
        }
    };
    /**
     * Initialise the listeners
     */
    LineSegmentTest.prototype.initListeners = function () {
        var _this = this;
        document.onmousedown = function (event) { return _this.onMouseDown(event); };
        document.onmouseup = function (event) { return _this.onMouseUp(event); };
        document.onmousemove = function (event) { return _this.onMouseMove(event); };
        window.onresize = function (event) { return _this.onResize(event); };
        this.onResize();
        this._timer = new RequestAnimationFrame_1.default(this.onEnterFrame, this);
        this._timer.start();
    };
    /**
     * Navigation and render loop
     */
    LineSegmentTest.prototype.onEnterFrame = function (dt) {
        this._time += dt;
        this._view.render();
    };
    /**
     * Mouse down listener for navigation
     */
    LineSegmentTest.prototype.onMouseDown = function (event) {
        this._lastPanAngle = this._cameraController.panAngle;
        this._lastTiltAngle = this._cameraController.tiltAngle;
        this._lastMouseX = event.clientX;
        this._lastMouseY = event.clientY;
        this._move = true;
    };
    /**
     * Mouse up listener for navigation
     */
    LineSegmentTest.prototype.onMouseUp = function (event) {
        this._move = false;
    };
    /**
     *
     * @param event
     */
    LineSegmentTest.prototype.onMouseMove = function (event) {
        if (this._move) {
            this._cameraController.panAngle = 0.3 * (event.clientX - this._lastMouseX) + this._lastPanAngle;
            this._cameraController.tiltAngle = 0.3 * (event.clientY - this._lastMouseY) + this._lastTiltAngle;
        }
    };
    /**
     * stage listener for resize events
     */
    LineSegmentTest.prototype.onResize = function (event) {
        if (event === void 0) { event = null; }
        this._view.y = 0;
        this._view.x = 0;
        this._view.width = window.innerWidth;
        this._view.height = window.innerHeight;
    };
    /**
     * Util function - getRandom Number
     */
    LineSegmentTest.prototype.getRandom = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    return LineSegmentTest;
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudGl0aWVzL0xpbmVTZWdtZW50VGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEseUJBQTBCLCtCQUErQixDQUFDLENBQUE7QUFLMUQsc0NBQW1DLDZDQUE2QyxDQUFDLENBQUE7QUFFakYscUJBQXVCLHlCQUF5QixDQUFDLENBQUE7QUFDakQsZ0NBQStCLGdEQUFnRCxDQUFDLENBQUE7QUFHaEYsNEJBQTRCLHdDQUF3QyxDQUFDLENBQUE7QUFDckUsOEJBQTZCLDRDQUE0QyxDQUFDLENBQUE7QUFFMUUsZ0NBQStCLHVDQUF1QyxDQUFDLENBQUE7QUFFdkU7SUFlQzs7T0FFRztJQUNIO1FBVlEsVUFBSyxHQUFVLENBQUMsQ0FBQztRQUNqQixVQUFLLEdBQVcsS0FBSyxDQUFDO1FBVzdCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNiLENBQUM7SUFFRDs7T0FFRztJQUNLLDhCQUFJLEdBQVo7UUFFQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQ7O09BRUc7SUFDSyxvQ0FBVSxHQUFsQjtRQUVDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxjQUFJLENBQUMsSUFBSSx5QkFBZSxFQUFFLENBQUMsQ0FBQztRQUU3QywrQ0FBK0M7UUFDL0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFFeEMsMkNBQTJDO1FBQzNDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLHlCQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFFTyxxQ0FBVyxHQUFuQjtRQUVDLElBQUksUUFBUSxHQUFpQixJQUFJ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LENBQUMsUUFBUSxHQUFHLEdBQUcsR0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7WUFDOUYsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsR0FBRyxHQUFHLEdBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQ2pHLENBQUM7SUFDRixDQUFDO0lBRUQ7O09BRUc7SUFDSyxrQ0FBUSxHQUFoQixVQUFpQixLQUFvQjtRQUFwQixxQkFBb0IsR0FBcEIsWUFBb0I7UUFFcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDeEMsQ0FBQztJQUVEOztPQUVHO0lBQ0ssbUNBQVMsR0FBakIsVUFBa0IsR0FBVSxFQUFFLEdBQVU7UUFFdkMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDeEMsQ0FBQztJQUNGLHNCQUFDO0FBQUQsQ0E1SUEsQUE0SUMsSUFBQSIsImZpbGUiOiJlbnRpdGllcy9MaW5lU2VnbWVudFRlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIjtcbmltcG9ydCBBc3NldExpYnJhcnlcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0Fzc2V0TGlicmFyeVwiO1xuaW1wb3J0IElBc3NldFx0XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9JQXNzZXRcIjtcbmltcG9ydCBVUkxMb2FkZXJcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMTG9hZGVyXCI7XG5pbXBvcnQgVVJMUmVxdWVzdFx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxSZXF1ZXN0XCI7XG5pbXBvcnQgUmVxdWVzdEFuaW1hdGlvbkZyYW1lXHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvdXRpbHMvUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCI7XG5cbmltcG9ydCBWaWV3XHRcdFx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWRpc3BsYXkvbGliL1ZpZXdcIjtcbmltcG9ydCBIb3ZlckNvbnRyb2xsZXJcdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvY29udHJvbGxlcnMvSG92ZXJDb250cm9sbGVyXCI7XG5pbXBvcnQgQWxpZ25tZW50TW9kZVx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL0FsaWdubWVudE1vZGVcIjtcbmltcG9ydCBPcmllbnRhdGlvbk1vZGVcdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9PcmllbnRhdGlvbk1vZGVcIjtcbmltcG9ydCBMaW5lU2VnbWVudFx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWRpc3BsYXkvbGliL2Rpc3BsYXkvTGluZVNlZ21lbnRcIjtcbmltcG9ydCBCYXNpY01hdGVyaWFsXHRcdFx0XHRmcm9tIFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9CYXNpY01hdGVyaWFsXCI7XG5cbmltcG9ydCBEZWZhdWx0UmVuZGVyZXJcdFx0XHRcdGZyb20gXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvRGVmYXVsdFJlbmRlcmVyXCI7XG5cbmNsYXNzIExpbmVTZWdtZW50VGVzdFxue1xuXHQvL2VuZ2luZSB2YXJpYWJsZXNcblx0cHJpdmF0ZSBfdmlldzpWaWV3O1xuXHRwcml2YXRlIF9jYW1lcmFDb250cm9sbGVyOkhvdmVyQ29udHJvbGxlcjtcblxuXHQvL25hdmlnYXRpb24gdmFyaWFibGVzXG5cdHByaXZhdGUgX3RpbWVyOlJlcXVlc3RBbmltYXRpb25GcmFtZTtcblx0cHJpdmF0ZSBfdGltZTpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF9tb3ZlOmJvb2xlYW4gPSBmYWxzZTtcblx0cHJpdmF0ZSBfbGFzdFBhbkFuZ2xlOm51bWJlcjtcblx0cHJpdmF0ZSBfbGFzdFRpbHRBbmdsZTpudW1iZXI7XG5cdHByaXZhdGUgX2xhc3RNb3VzZVg6bnVtYmVyO1xuXHRwcml2YXRlIF9sYXN0TW91c2VZOm51bWJlcjtcblxuXHQvKipcblx0ICogQ29uc3RydWN0b3Jcblx0ICovXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHRoaXMuaW5pdCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdsb2JhbCBpbml0aWFsaXNlIGZ1bmN0aW9uXG5cdCAqL1xuXHRwcml2YXRlIGluaXQoKTp2b2lkXG5cdHtcblx0XHR0aGlzLmluaXRFbmdpbmUoKTtcblx0XHR0aGlzLmluaXRPYmplY3RzKCk7XG5cdFx0dGhpcy5pbml0TGlzdGVuZXJzKCk7XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGlzZSB0aGUgZW5naW5lXG5cdCAqL1xuXHRwcml2YXRlIGluaXRFbmdpbmUoKTp2b2lkXG5cdHtcblx0XHR0aGlzLl92aWV3ID0gbmV3IFZpZXcobmV3IERlZmF1bHRSZW5kZXJlcigpKTtcblxuXHRcdC8vc2V0dXAgdGhlIGNhbWVyYSBmb3Igb3B0aW1hbCBzaGFkb3cgcmVuZGVyaW5nXG5cdFx0dGhpcy5fdmlldy5jYW1lcmEucHJvamVjdGlvbi5mYXIgPSAyMTAwO1xuXG5cdFx0Ly9zZXR1cCBjb250cm9sbGVyIHRvIGJlIHVzZWQgb24gdGhlIGNhbWVyYVxuXHRcdHRoaXMuX2NhbWVyYUNvbnRyb2xsZXIgPSBuZXcgSG92ZXJDb250cm9sbGVyKHRoaXMuX3ZpZXcuY2FtZXJhLCBudWxsLCA0NSwgMjAsIDEwMDAsIDEwKTtcblx0fVxuXG5cdHByaXZhdGUgaW5pdE9iamVjdHMoKTp2b2lkXG5cdHtcblx0XHR2YXIgbWF0ZXJpYWw6QmFzaWNNYXRlcmlhbCA9IG5ldyBCYXNpY01hdGVyaWFsKDB4RkZGRkZGKTtcblxuXHRcdHZhciB4Om51bWJlciwgeTpudW1iZXIsIHo6bnVtYmVyLCBzOkxpbmVTZWdtZW50O1xuXG5cdFx0Zm9yICh2YXIgYzpudW1iZXIgPSAwOyBjIDwgMTAwOyBjICsrKSB7XG5cdFx0XHR4ID0gdGhpcy5nZXRSYW5kb20oLTQwMCAsIDQwMCk7XG5cdFx0XHR5ID0gdGhpcy5nZXRSYW5kb20oLTQwMCAsIDQwMCk7XG5cdFx0XHR6ID0gdGhpcy5nZXRSYW5kb20oLTQwMCAsIDQwMCk7XG5cblx0XHRcdHMgPSBuZXcgTGluZVNlZ21lbnQobWF0ZXJpYWwsIG5ldyBWZWN0b3IzRCgwLDAsMCksIG5ldyBWZWN0b3IzRCh4LCB5LCB6KSwgMyk7XG5cdFx0XHR0aGlzLl92aWV3LnNjZW5lLmFkZENoaWxkKHMpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXNlIHRoZSBsaXN0ZW5lcnNcblx0ICovXG5cdHByaXZhdGUgaW5pdExpc3RlbmVycygpOnZvaWRcblx0e1xuXHRcdGRvY3VtZW50Lm9ubW91c2Vkb3duID0gKGV2ZW50Ok1vdXNlRXZlbnQpID0+IHRoaXMub25Nb3VzZURvd24oZXZlbnQpO1xuXHRcdGRvY3VtZW50Lm9ubW91c2V1cCA9IChldmVudDpNb3VzZUV2ZW50KSA9PiB0aGlzLm9uTW91c2VVcChldmVudCk7XG5cdFx0ZG9jdW1lbnQub25tb3VzZW1vdmUgPSAoZXZlbnQ6TW91c2VFdmVudCkgPT4gdGhpcy5vbk1vdXNlTW92ZShldmVudCk7XG5cblx0XHR3aW5kb3cub25yZXNpemUgID0gKGV2ZW50OlVJRXZlbnQpID0+IHRoaXMub25SZXNpemUoZXZlbnQpO1xuXG5cdFx0dGhpcy5vblJlc2l6ZSgpO1xuXG5cdFx0dGhpcy5fdGltZXIgPSBuZXcgUmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMub25FbnRlckZyYW1lLCB0aGlzKTtcblx0XHR0aGlzLl90aW1lci5zdGFydCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE5hdmlnYXRpb24gYW5kIHJlbmRlciBsb29wXG5cdCAqL1xuXHRwcml2YXRlIG9uRW50ZXJGcmFtZShkdDpudW1iZXIpOnZvaWRcblx0e1xuXHRcdHRoaXMuX3RpbWUgKz0gZHQ7XG5cblx0XHR0aGlzLl92aWV3LnJlbmRlcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1vdXNlIGRvd24gbGlzdGVuZXIgZm9yIG5hdmlnYXRpb25cblx0ICovXG5cdHByaXZhdGUgb25Nb3VzZURvd24oZXZlbnQ6TW91c2VFdmVudCk6dm9pZFxuXHR7XG5cdFx0dGhpcy5fbGFzdFBhbkFuZ2xlID0gdGhpcy5fY2FtZXJhQ29udHJvbGxlci5wYW5BbmdsZTtcblx0XHR0aGlzLl9sYXN0VGlsdEFuZ2xlID0gdGhpcy5fY2FtZXJhQ29udHJvbGxlci50aWx0QW5nbGU7XG5cdFx0dGhpcy5fbGFzdE1vdXNlWCA9IGV2ZW50LmNsaWVudFg7XG5cdFx0dGhpcy5fbGFzdE1vdXNlWSA9IGV2ZW50LmNsaWVudFk7XG5cdFx0dGhpcy5fbW92ZSA9IHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogTW91c2UgdXAgbGlzdGVuZXIgZm9yIG5hdmlnYXRpb25cblx0ICovXG5cdHByaXZhdGUgb25Nb3VzZVVwKGV2ZW50Ok1vdXNlRXZlbnQpOnZvaWRcblx0e1xuXHRcdHRoaXMuX21vdmUgPSBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0gZXZlbnRcblx0ICovXG5cdHByaXZhdGUgb25Nb3VzZU1vdmUoZXZlbnQ6TW91c2VFdmVudClcblx0e1xuXHRcdGlmICh0aGlzLl9tb3ZlKSB7XG5cdFx0XHR0aGlzLl9jYW1lcmFDb250cm9sbGVyLnBhbkFuZ2xlID0gMC4zKihldmVudC5jbGllbnRYIC0gdGhpcy5fbGFzdE1vdXNlWCkgKyB0aGlzLl9sYXN0UGFuQW5nbGU7XG5cdFx0XHR0aGlzLl9jYW1lcmFDb250cm9sbGVyLnRpbHRBbmdsZSA9IDAuMyooZXZlbnQuY2xpZW50WSAtIHRoaXMuX2xhc3RNb3VzZVkpICsgdGhpcy5fbGFzdFRpbHRBbmdsZTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogc3RhZ2UgbGlzdGVuZXIgZm9yIHJlc2l6ZSBldmVudHNcblx0ICovXG5cdHByaXZhdGUgb25SZXNpemUoZXZlbnQ6VUlFdmVudCA9IG51bGwpOnZvaWRcblx0e1xuXHRcdHRoaXMuX3ZpZXcueSA9IDA7XG5cdFx0dGhpcy5fdmlldy54ID0gMDtcblx0XHR0aGlzLl92aWV3LndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdFx0dGhpcy5fdmlldy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdH1cblxuXHQvKipcblx0ICogVXRpbCBmdW5jdGlvbiAtIGdldFJhbmRvbSBOdW1iZXJcblx0ICovXG5cdHByaXZhdGUgZ2V0UmFuZG9tKG1pbjpudW1iZXIsIG1heDpudW1iZXIpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIE1hdGgucmFuZG9tKCkqKG1heCAtIG1pbikgKyBtaW47XG5cdH1cbn0iXSwic291cmNlUm9vdCI6Ii4vdGVzdHMifQ==