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
        this._view = new View_1.View(new DefaultRenderer_1.DefaultRenderer());
        //setup the camera for optimal shadow rendering
        this._view.camera.projection.far = 2100;
        //setup controller to be used on the camera
        this._cameraController = new HoverController_1.HoverController(this._view.camera, null, 45, 20, 1000, 10);
    };
    LineSegmentTest.prototype.initObjects = function () {
        var material = new BasicMaterial_1.BasicMaterial(0xFFFFFF);
        var x, y, z, s;
        for (var c = 0; c < 100; c++) {
            x = this.getRandom(-400, 400);
            y = this.getRandom(-400, 400);
            z = this.getRandom(-400, 400);
            s = new LineSegment_1.LineSegment(material, new Vector3D_1.Vector3D(0, 0, 0), new Vector3D_1.Vector3D(x, y, z), 3);
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
        this._timer = new RequestAnimationFrame_1.RequestAnimationFrame(this.onEnterFrame, this);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudGl0aWVzL0xpbmVTZWdtZW50VGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEseUJBQTRCLCtCQUErQixDQUFDLENBQUE7QUFLNUQsc0NBQXFDLDZDQUE2QyxDQUFDLENBQUE7QUFFbkYscUJBQXlCLHlCQUF5QixDQUFDLENBQUE7QUFDbkQsZ0NBQWlDLGdEQUFnRCxDQUFDLENBQUE7QUFHbEYsNEJBQThCLHdDQUF3QyxDQUFDLENBQUE7QUFDdkUsOEJBQStCLDRDQUE0QyxDQUFDLENBQUE7QUFFNUUsZ0NBQWlDLHVDQUF1QyxDQUFDLENBQUE7QUFFekU7SUFlQzs7T0FFRztJQUNIO1FBVlEsVUFBSyxHQUFVLENBQUMsQ0FBQztRQUNqQixVQUFLLEdBQVcsS0FBSyxDQUFDO1FBVzdCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNiLENBQUM7SUFFRDs7T0FFRztJQUNLLDhCQUFJLEdBQVo7UUFFQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQ7O09BRUc7SUFDSyxvQ0FBVSxHQUFsQjtRQUVDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxXQUFJLENBQUMsSUFBSSxpQ0FBZSxFQUFFLENBQUMsQ0FBQztRQUU3QywrQ0FBK0M7UUFDL0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFFeEMsMkNBQTJDO1FBQzNDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLGlDQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFFTyxxQ0FBVyxHQUFuQjtRQUVDLElBQUksUUFBUSxHQUFpQixJQUFJ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LENBQUMsUUFBUSxHQUFHLEdBQUcsR0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7WUFDOUYsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsR0FBRyxHQUFHLEdBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQ2pHLENBQUM7SUFDRixDQUFDO0lBRUQ7O09BRUc7SUFDSyxrQ0FBUSxHQUFoQixVQUFpQixLQUFvQjtRQUFwQixxQkFBb0IsR0FBcEIsWUFBb0I7UUFFcEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDeEMsQ0FBQztJQUVEOztPQUVHO0lBQ0ssbUNBQVMsR0FBakIsVUFBa0IsR0FBVSxFQUFFLEdBQVU7UUFFdkMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDeEMsQ0FBQztJQUNGLHNCQUFDO0FBQUQsQ0E1SUEsQUE0SUMsSUFBQSIsImZpbGUiOiJlbnRpdGllcy9MaW5lU2VnbWVudFRlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1ZlY3RvcjNEfVx0XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiO1xuaW1wb3J0IHtBc3NldExpYnJhcnl9XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9Bc3NldExpYnJhcnlcIjtcbmltcG9ydCB7SUFzc2V0fVx0XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9JQXNzZXRcIjtcbmltcG9ydCB7VVJMTG9hZGVyfVx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxMb2FkZXJcIjtcbmltcG9ydCB7VVJMUmVxdWVzdH1cdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMUmVxdWVzdFwiO1xuaW1wb3J0IHtSZXF1ZXN0QW5pbWF0aW9uRnJhbWV9XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvdXRpbHMvUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCI7XG5cbmltcG9ydCB7Vmlld31cdFx0XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvVmlld1wiO1xuaW1wb3J0IHtIb3ZlckNvbnRyb2xsZXJ9XHRcdFx0XHRmcm9tIFwiYXdheWpzLWRpc3BsYXkvbGliL2NvbnRyb2xsZXJzL0hvdmVyQ29udHJvbGxlclwiO1xuaW1wb3J0IHtBbGlnbm1lbnRNb2RlfVx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL0FsaWdubWVudE1vZGVcIjtcbmltcG9ydCB7T3JpZW50YXRpb25Nb2RlfVx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL09yaWVudGF0aW9uTW9kZVwiO1xuaW1wb3J0IHtMaW5lU2VnbWVudH1cdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi9kaXNwbGF5L0xpbmVTZWdtZW50XCI7XG5pbXBvcnQge0Jhc2ljTWF0ZXJpYWx9XHRcdFx0XHRmcm9tIFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9CYXNpY01hdGVyaWFsXCI7XG5cbmltcG9ydCB7RGVmYXVsdFJlbmRlcmVyfVx0XHRcdFx0ZnJvbSBcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9EZWZhdWx0UmVuZGVyZXJcIjtcblxuY2xhc3MgTGluZVNlZ21lbnRUZXN0XG57XG5cdC8vZW5naW5lIHZhcmlhYmxlc1xuXHRwcml2YXRlIF92aWV3OlZpZXc7XG5cdHByaXZhdGUgX2NhbWVyYUNvbnRyb2xsZXI6SG92ZXJDb250cm9sbGVyO1xuXG5cdC8vbmF2aWdhdGlvbiB2YXJpYWJsZXNcblx0cHJpdmF0ZSBfdGltZXI6UmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXHRwcml2YXRlIF90aW1lOm51bWJlciA9IDA7XG5cdHByaXZhdGUgX21vdmU6Ym9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIF9sYXN0UGFuQW5nbGU6bnVtYmVyO1xuXHRwcml2YXRlIF9sYXN0VGlsdEFuZ2xlOm51bWJlcjtcblx0cHJpdmF0ZSBfbGFzdE1vdXNlWDpudW1iZXI7XG5cdHByaXZhdGUgX2xhc3RNb3VzZVk6bnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBDb25zdHJ1Y3RvclxuXHQgKi9cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0dGhpcy5pbml0KCk7XG5cdH1cblxuXHQvKipcblx0ICogR2xvYmFsIGluaXRpYWxpc2UgZnVuY3Rpb25cblx0ICovXG5cdHByaXZhdGUgaW5pdCgpOnZvaWRcblx0e1xuXHRcdHRoaXMuaW5pdEVuZ2luZSgpO1xuXHRcdHRoaXMuaW5pdE9iamVjdHMoKTtcblx0XHR0aGlzLmluaXRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXNlIHRoZSBlbmdpbmVcblx0ICovXG5cdHByaXZhdGUgaW5pdEVuZ2luZSgpOnZvaWRcblx0e1xuXHRcdHRoaXMuX3ZpZXcgPSBuZXcgVmlldyhuZXcgRGVmYXVsdFJlbmRlcmVyKCkpO1xuXG5cdFx0Ly9zZXR1cCB0aGUgY2FtZXJhIGZvciBvcHRpbWFsIHNoYWRvdyByZW5kZXJpbmdcblx0XHR0aGlzLl92aWV3LmNhbWVyYS5wcm9qZWN0aW9uLmZhciA9IDIxMDA7XG5cblx0XHQvL3NldHVwIGNvbnRyb2xsZXIgdG8gYmUgdXNlZCBvbiB0aGUgY2FtZXJhXG5cdFx0dGhpcy5fY2FtZXJhQ29udHJvbGxlciA9IG5ldyBIb3ZlckNvbnRyb2xsZXIodGhpcy5fdmlldy5jYW1lcmEsIG51bGwsIDQ1LCAyMCwgMTAwMCwgMTApO1xuXHR9XG5cblx0cHJpdmF0ZSBpbml0T2JqZWN0cygpOnZvaWRcblx0e1xuXHRcdHZhciBtYXRlcmlhbDpCYXNpY01hdGVyaWFsID0gbmV3IEJhc2ljTWF0ZXJpYWwoMHhGRkZGRkYpO1xuXG5cdFx0dmFyIHg6bnVtYmVyLCB5Om51bWJlciwgejpudW1iZXIsIHM6TGluZVNlZ21lbnQ7XG5cblx0XHRmb3IgKHZhciBjOm51bWJlciA9IDA7IGMgPCAxMDA7IGMgKyspIHtcblx0XHRcdHggPSB0aGlzLmdldFJhbmRvbSgtNDAwICwgNDAwKTtcblx0XHRcdHkgPSB0aGlzLmdldFJhbmRvbSgtNDAwICwgNDAwKTtcblx0XHRcdHogPSB0aGlzLmdldFJhbmRvbSgtNDAwICwgNDAwKTtcblxuXHRcdFx0cyA9IG5ldyBMaW5lU2VnbWVudChtYXRlcmlhbCwgbmV3IFZlY3RvcjNEKDAsMCwwKSwgbmV3IFZlY3RvcjNEKHgsIHksIHopLCAzKTtcblx0XHRcdHRoaXMuX3ZpZXcuc2NlbmUuYWRkQ2hpbGQocyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpc2UgdGhlIGxpc3RlbmVyc1xuXHQgKi9cblx0cHJpdmF0ZSBpbml0TGlzdGVuZXJzKCk6dm9pZFxuXHR7XG5cdFx0ZG9jdW1lbnQub25tb3VzZWRvd24gPSAoZXZlbnQ6TW91c2VFdmVudCkgPT4gdGhpcy5vbk1vdXNlRG93bihldmVudCk7XG5cdFx0ZG9jdW1lbnQub25tb3VzZXVwID0gKGV2ZW50Ok1vdXNlRXZlbnQpID0+IHRoaXMub25Nb3VzZVVwKGV2ZW50KTtcblx0XHRkb2N1bWVudC5vbm1vdXNlbW92ZSA9IChldmVudDpNb3VzZUV2ZW50KSA9PiB0aGlzLm9uTW91c2VNb3ZlKGV2ZW50KTtcblxuXHRcdHdpbmRvdy5vbnJlc2l6ZSAgPSAoZXZlbnQ6VUlFdmVudCkgPT4gdGhpcy5vblJlc2l6ZShldmVudCk7XG5cblx0XHR0aGlzLm9uUmVzaXplKCk7XG5cblx0XHR0aGlzLl90aW1lciA9IG5ldyBSZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5vbkVudGVyRnJhbWUsIHRoaXMpO1xuXHRcdHRoaXMuX3RpbWVyLnN0YXJ0KCk7XG5cdH1cblxuXHQvKipcblx0ICogTmF2aWdhdGlvbiBhbmQgcmVuZGVyIGxvb3Bcblx0ICovXG5cdHByaXZhdGUgb25FbnRlckZyYW1lKGR0Om51bWJlcik6dm9pZFxuXHR7XG5cdFx0dGhpcy5fdGltZSArPSBkdDtcblxuXHRcdHRoaXMuX3ZpZXcucmVuZGVyKCk7XG5cdH1cblxuXHQvKipcblx0ICogTW91c2UgZG93biBsaXN0ZW5lciBmb3IgbmF2aWdhdGlvblxuXHQgKi9cblx0cHJpdmF0ZSBvbk1vdXNlRG93bihldmVudDpNb3VzZUV2ZW50KTp2b2lkXG5cdHtcblx0XHR0aGlzLl9sYXN0UGFuQW5nbGUgPSB0aGlzLl9jYW1lcmFDb250cm9sbGVyLnBhbkFuZ2xlO1xuXHRcdHRoaXMuX2xhc3RUaWx0QW5nbGUgPSB0aGlzLl9jYW1lcmFDb250cm9sbGVyLnRpbHRBbmdsZTtcblx0XHR0aGlzLl9sYXN0TW91c2VYID0gZXZlbnQuY2xpZW50WDtcblx0XHR0aGlzLl9sYXN0TW91c2VZID0gZXZlbnQuY2xpZW50WTtcblx0XHR0aGlzLl9tb3ZlID0gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNb3VzZSB1cCBsaXN0ZW5lciBmb3IgbmF2aWdhdGlvblxuXHQgKi9cblx0cHJpdmF0ZSBvbk1vdXNlVXAoZXZlbnQ6TW91c2VFdmVudCk6dm9pZFxuXHR7XG5cdFx0dGhpcy5fbW92ZSA9IGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSBldmVudFxuXHQgKi9cblx0cHJpdmF0ZSBvbk1vdXNlTW92ZShldmVudDpNb3VzZUV2ZW50KVxuXHR7XG5cdFx0aWYgKHRoaXMuX21vdmUpIHtcblx0XHRcdHRoaXMuX2NhbWVyYUNvbnRyb2xsZXIucGFuQW5nbGUgPSAwLjMqKGV2ZW50LmNsaWVudFggLSB0aGlzLl9sYXN0TW91c2VYKSArIHRoaXMuX2xhc3RQYW5BbmdsZTtcblx0XHRcdHRoaXMuX2NhbWVyYUNvbnRyb2xsZXIudGlsdEFuZ2xlID0gMC4zKihldmVudC5jbGllbnRZIC0gdGhpcy5fbGFzdE1vdXNlWSkgKyB0aGlzLl9sYXN0VGlsdEFuZ2xlO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBzdGFnZSBsaXN0ZW5lciBmb3IgcmVzaXplIGV2ZW50c1xuXHQgKi9cblx0cHJpdmF0ZSBvblJlc2l6ZShldmVudDpVSUV2ZW50ID0gbnVsbCk6dm9pZFxuXHR7XG5cdFx0dGhpcy5fdmlldy55ID0gMDtcblx0XHR0aGlzLl92aWV3LnggPSAwO1xuXHRcdHRoaXMuX3ZpZXcud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR0aGlzLl92aWV3LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0fVxuXG5cdC8qKlxuXHQgKiBVdGlsIGZ1bmN0aW9uIC0gZ2V0UmFuZG9tIE51bWJlclxuXHQgKi9cblx0cHJpdmF0ZSBnZXRSYW5kb20obWluOm51bWJlciwgbWF4Om51bWJlcik6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gTWF0aC5yYW5kb20oKSoobWF4IC0gbWluKSArIG1pbjtcblx0fVxufSJdLCJzb3VyY2VSb290IjoiLi90ZXN0cyJ9
