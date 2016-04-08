"use strict";
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var AssetLibrary_1 = require("awayjs-core/lib/library/AssetLibrary");
var URLRequest_1 = require("awayjs-core/lib/net/URLRequest");
var LoaderEvent_1 = require("awayjs-core/lib/events/LoaderEvent");
var RequestAnimationFrame_1 = require("awayjs-core/lib/utils/RequestAnimationFrame");
var View_1 = require("awayjs-display/lib/View");
var HoverController_1 = require("awayjs-display/lib/controllers/HoverController");
var AlignmentMode_1 = require("awayjs-display/lib/base/AlignmentMode");
var OrientationMode_1 = require("awayjs-display/lib/base/OrientationMode");
var Billboard_1 = require("awayjs-display/lib/display/Billboard");
var BasicMaterial_1 = require("awayjs-display/lib/materials/BasicMaterial");
var DefaultRenderer_1 = require("awayjs-renderergl/lib/DefaultRenderer");
var BillboardTest = (function () {
    /**
     * Constructor
     */
    function BillboardTest() {
        this._time = 0;
        this._move = false;
        this.init();
    }
    /**
     * Global initialise function
     */
    BillboardTest.prototype.init = function () {
        this.initEngine();
        this.initListeners();
        this.loadTexture();
    };
    /**
     * Initialise the engine
     */
    BillboardTest.prototype.initEngine = function () {
        this._view = new View_1.default(new DefaultRenderer_1.default());
        //setup the camera for optimal shadow rendering
        this._view.camera.projection.far = 2100;
        //setup controller to be used on the camera
        this._cameraController = new HoverController_1.default(this._view.camera, null, 45, 20, 1000, 10);
    };
    /**
     * Initialise the listeners
     */
    BillboardTest.prototype.initListeners = function () {
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
     * start loading our texture
     */
    BillboardTest.prototype.loadTexture = function () {
        var _this = this;
        AssetLibrary_1.default.addEventListener(LoaderEvent_1.default.LOAD_COMPLETE, function (event) { return _this.onLoadComplete(event); });
        AssetLibrary_1.default.load(new URLRequest_1.default("assets/130909wall_big.png"));
    };
    /**
     * Navigation and render loop
     */
    BillboardTest.prototype.onEnterFrame = function (dt) {
        this._time += dt;
        this._view.render();
    };
    /**
     * Listener function for load complete event on asset library
     */
    BillboardTest.prototype.onLoadComplete = function (event) {
        var assets = event.assets;
        var length = assets.length;
        for (var c = 0; c < length; c++) {
            var asset = assets[c];
            switch (event.url) {
                case "assets/130909wall_big.png":
                    var material = new BasicMaterial_1.default(asset);
                    var s;
                    s = new Billboard_1.default(material);
                    s.pivot = new Vector3D_1.default(150, 150, 0);
                    s.width = 300;
                    s.height = 300;
                    //s.rotationX = 45;
                    s.orientationMode = OrientationMode_1.default.CAMERA_PLANE;
                    s.alignmentMode = AlignmentMode_1.default.PIVOT_POINT;
                    this._view.scene.addChild(s);
                    for (var c = 0; c < 100; c++) {
                        var size = this.getRandom(5, 50);
                        s = new Billboard_1.default(material);
                        s.pivot = new Vector3D_1.default(size / 2, size / 2, 0);
                        s.width = size;
                        s.height = size;
                        s.orientationMode = OrientationMode_1.default.CAMERA_PLANE;
                        s.alignmentMode = AlignmentMode_1.default.PIVOT_POINT;
                        s.x = this.getRandom(-400, 400);
                        s.y = this.getRandom(-400, 400);
                        s.z = this.getRandom(-400, 400);
                        this._view.scene.addChild(s);
                    }
                    this._timer.start();
                    break;
            }
        }
    };
    /**
     * Mouse down listener for navigation
     */
    BillboardTest.prototype.onMouseDown = function (event) {
        this._lastPanAngle = this._cameraController.panAngle;
        this._lastTiltAngle = this._cameraController.tiltAngle;
        this._lastMouseX = event.clientX;
        this._lastMouseY = event.clientY;
        this._move = true;
    };
    /**
     * Mouse up listener for navigation
     */
    BillboardTest.prototype.onMouseUp = function (event) {
        this._move = false;
    };
    /**
     *
     * @param event
     */
    BillboardTest.prototype.onMouseMove = function (event) {
        if (this._move) {
            this._cameraController.panAngle = 0.3 * (event.clientX - this._lastMouseX) + this._lastPanAngle;
            this._cameraController.tiltAngle = 0.3 * (event.clientY - this._lastMouseY) + this._lastTiltAngle;
        }
    };
    /**
     * stage listener for resize events
     */
    BillboardTest.prototype.onResize = function (event) {
        if (event === void 0) { event = null; }
        this._view.y = 0;
        this._view.x = 0;
        this._view.width = window.innerWidth;
        this._view.height = window.innerHeight;
    };
    /**
     * Util function - getRandom Number
     */
    BillboardTest.prototype.getRandom = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    return BillboardTest;
}());

//# sourceMappingURL=data:application/json;base64,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LE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztJQUN4QyxDQUFDO0lBRUQ7O09BRUc7SUFDSyxpQ0FBUyxHQUFqQixVQUFrQixHQUFVLEVBQUUsR0FBVTtRQUV2QyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUN4QyxDQUFDO0lBQ0Ysb0JBQUM7QUFBRCxDQXJMQSxBQXFMQyxJQUFBIiwiZmlsZSI6ImVudGl0aWVzL0JpbGxib2FyZFRlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQml0bWFwSW1hZ2UyRFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9pbWFnZS9CaXRtYXBJbWFnZTJEXCI7XG5pbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIjtcbmltcG9ydCBBc3NldExpYnJhcnlcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0Fzc2V0TGlicmFyeVwiO1xuaW1wb3J0IElBc3NldFx0XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9JQXNzZXRcIjtcbmltcG9ydCBVUkxMb2FkZXJcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMTG9hZGVyXCI7XG5pbXBvcnQgVVJMUmVxdWVzdFx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxSZXF1ZXN0XCI7XG5pbXBvcnQgTG9hZGVyRXZlbnRcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9ldmVudHMvTG9hZGVyRXZlbnRcIjtcbmltcG9ydCBSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi91dGlscy9SZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIjtcblxuaW1wb3J0IFZpZXdcdFx0XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvVmlld1wiO1xuaW1wb3J0IEhvdmVyQ29udHJvbGxlclx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi9jb250cm9sbGVycy9Ib3ZlckNvbnRyb2xsZXJcIjtcbmltcG9ydCBBbGlnbm1lbnRNb2RlXHRcdFx0XHRmcm9tIFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvQWxpZ25tZW50TW9kZVwiO1xuaW1wb3J0IE9yaWVudGF0aW9uTW9kZVx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL09yaWVudGF0aW9uTW9kZVwiO1xuaW1wb3J0IEJpbGxib2FyZFx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWRpc3BsYXkvbGliL2Rpc3BsYXkvQmlsbGJvYXJkXCI7XG5pbXBvcnQgU3ByaXRlXHRcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi9kaXNwbGF5L1Nwcml0ZVwiO1xuaW1wb3J0IEJhc2ljTWF0ZXJpYWxcdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL0Jhc2ljTWF0ZXJpYWxcIjtcbmltcG9ydCBTaW5nbGUyRFRleHR1cmVcdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvdGV4dHVyZXMvU2luZ2xlMkRUZXh0dXJlXCI7XG5cbmltcG9ydCBEZWZhdWx0UmVuZGVyZXJcdFx0XHRcdGZyb20gXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvRGVmYXVsdFJlbmRlcmVyXCI7XG5cbmNsYXNzIEJpbGxib2FyZFRlc3Rcbntcblx0Ly9lbmdpbmUgdmFyaWFibGVzXG5cdHByaXZhdGUgX3ZpZXc6Vmlldztcblx0cHJpdmF0ZSBfY2FtZXJhQ29udHJvbGxlcjpIb3ZlckNvbnRyb2xsZXI7XG5cblx0Ly9uYXZpZ2F0aW9uIHZhcmlhYmxlc1xuXHRwcml2YXRlIF90aW1lcjpSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cdHByaXZhdGUgX3RpbWU6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBfbW92ZTpib29sZWFuID0gZmFsc2U7XG5cdHByaXZhdGUgX2xhc3RQYW5BbmdsZTpudW1iZXI7XG5cdHByaXZhdGUgX2xhc3RUaWx0QW5nbGU6bnVtYmVyO1xuXHRwcml2YXRlIF9sYXN0TW91c2VYOm51bWJlcjtcblx0cHJpdmF0ZSBfbGFzdE1vdXNlWTpudW1iZXI7XG5cblx0LyoqXG5cdCAqIENvbnN0cnVjdG9yXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHR0aGlzLmluaXQoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHbG9iYWwgaW5pdGlhbGlzZSBmdW5jdGlvblxuXHQgKi9cblx0cHJpdmF0ZSBpbml0KCk6dm9pZFxuXHR7XG5cdFx0dGhpcy5pbml0RW5naW5lKCk7XG5cdFx0dGhpcy5pbml0TGlzdGVuZXJzKCk7XG5cdFx0dGhpcy5sb2FkVGV4dHVyZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpc2UgdGhlIGVuZ2luZVxuXHQgKi9cblx0cHJpdmF0ZSBpbml0RW5naW5lKCk6dm9pZFxuXHR7XG5cdFx0dGhpcy5fdmlldyA9IG5ldyBWaWV3KG5ldyBEZWZhdWx0UmVuZGVyZXIoKSk7XG5cblx0XHQvL3NldHVwIHRoZSBjYW1lcmEgZm9yIG9wdGltYWwgc2hhZG93IHJlbmRlcmluZ1xuXHRcdHRoaXMuX3ZpZXcuY2FtZXJhLnByb2plY3Rpb24uZmFyID0gMjEwMDtcblxuXHRcdC8vc2V0dXAgY29udHJvbGxlciB0byBiZSB1c2VkIG9uIHRoZSBjYW1lcmFcblx0XHR0aGlzLl9jYW1lcmFDb250cm9sbGVyID0gbmV3IEhvdmVyQ29udHJvbGxlcih0aGlzLl92aWV3LmNhbWVyYSwgbnVsbCwgNDUsIDIwLCAxMDAwLCAxMCk7XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGlzZSB0aGUgbGlzdGVuZXJzXG5cdCAqL1xuXHRwcml2YXRlIGluaXRMaXN0ZW5lcnMoKTp2b2lkXG5cdHtcblx0XHRkb2N1bWVudC5vbm1vdXNlZG93biA9IChldmVudDpNb3VzZUV2ZW50KSA9PiB0aGlzLm9uTW91c2VEb3duKGV2ZW50KTtcblx0XHRkb2N1bWVudC5vbm1vdXNldXAgPSAoZXZlbnQ6TW91c2VFdmVudCkgPT4gdGhpcy5vbk1vdXNlVXAoZXZlbnQpO1xuXHRcdGRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gKGV2ZW50Ok1vdXNlRXZlbnQpID0+IHRoaXMub25Nb3VzZU1vdmUoZXZlbnQpO1xuXG5cdFx0d2luZG93Lm9ucmVzaXplICA9IChldmVudDpVSUV2ZW50KSA9PiB0aGlzLm9uUmVzaXplKGV2ZW50KTtcblxuXHRcdHRoaXMub25SZXNpemUoKTtcblxuXHRcdHRoaXMuX3RpbWVyID0gbmV3IFJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLm9uRW50ZXJGcmFtZSwgdGhpcyk7XG5cdFx0dGhpcy5fdGltZXIuc3RhcnQoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBzdGFydCBsb2FkaW5nIG91ciB0ZXh0dXJlXG5cdCAqL1xuXHRwcml2YXRlIGxvYWRUZXh0dXJlKCk6dm9pZFxuXHR7XG5cdFx0QXNzZXRMaWJyYXJ5LmFkZEV2ZW50TGlzdGVuZXIoTG9hZGVyRXZlbnQuTE9BRF9DT01QTEVURSwgKGV2ZW50OkxvYWRlckV2ZW50KSA9PiB0aGlzLm9uTG9hZENvbXBsZXRlKGV2ZW50KSk7XG5cdFx0QXNzZXRMaWJyYXJ5LmxvYWQobmV3IFVSTFJlcXVlc3QoXCJhc3NldHMvMTMwOTA5d2FsbF9iaWcucG5nXCIpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBOYXZpZ2F0aW9uIGFuZCByZW5kZXIgbG9vcFxuXHQgKi9cblx0cHJpdmF0ZSBvbkVudGVyRnJhbWUoZHQ6bnVtYmVyKTp2b2lkXG5cdHtcblx0XHR0aGlzLl90aW1lICs9IGR0O1xuXG5cdFx0dGhpcy5fdmlldy5yZW5kZXIoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBMaXN0ZW5lciBmdW5jdGlvbiBmb3IgbG9hZCBjb21wbGV0ZSBldmVudCBvbiBhc3NldCBsaWJyYXJ5XG5cdCAqL1xuXHRwcml2YXRlIG9uTG9hZENvbXBsZXRlKGV2ZW50OkxvYWRlckV2ZW50KVxuXHR7XG5cdFx0dmFyIGFzc2V0czpBcnJheTxJQXNzZXQ+ID0gZXZlbnQuYXNzZXRzO1xuXHRcdHZhciBsZW5ndGg6bnVtYmVyID0gYXNzZXRzLmxlbmd0aDtcblxuXHRcdGZvciAodmFyIGM6bnVtYmVyID0gMDsgYyA8IGxlbmd0aDsgYyArKykge1xuXHRcdFx0dmFyIGFzc2V0OklBc3NldCA9IGFzc2V0c1tjXTtcblxuXHRcdFx0c3dpdGNoKGV2ZW50LnVybCkge1xuXG5cdFx0XHRcdGNhc2UgXCJhc3NldHMvMTMwOTA5d2FsbF9iaWcucG5nXCI6XG5cblx0XHRcdFx0XHR2YXIgbWF0ZXJpYWw6QmFzaWNNYXRlcmlhbCA9IG5ldyBCYXNpY01hdGVyaWFsKDxCaXRtYXBJbWFnZTJEPiBhc3NldCk7XG5cblx0XHRcdFx0XHR2YXIgczpCaWxsYm9hcmQ7XG5cdFx0XHRcdFx0XHRzID0gbmV3IEJpbGxib2FyZChtYXRlcmlhbCk7XG5cdFx0XHRcdFx0XHRzLnBpdm90ID0gbmV3IFZlY3RvcjNEKDE1MCwgMTUwLCAwKTtcblx0XHRcdFx0XHRcdHMud2lkdGggPSAzMDA7XG5cdFx0XHRcdFx0XHRzLmhlaWdodCA9IDMwMDtcblx0XHRcdFx0XHRcdC8vcy5yb3RhdGlvblggPSA0NTtcblx0XHRcdFx0XHRzLm9yaWVudGF0aW9uTW9kZSA9IE9yaWVudGF0aW9uTW9kZS5DQU1FUkFfUExBTkU7XG5cdFx0XHRcdFx0cy5hbGlnbm1lbnRNb2RlID0gQWxpZ25tZW50TW9kZS5QSVZPVF9QT0lOVDtcblxuXHRcdFx0XHRcdHRoaXMuX3ZpZXcuc2NlbmUuYWRkQ2hpbGQocyk7XG5cblx0XHRcdFx0XHRmb3IgKHZhciBjOm51bWJlciA9IDA7IGMgPCAxMDA7IGMgKyspIHtcblx0XHRcdFx0XHRcdHZhciBzaXplOm51bWJlciA9IHRoaXMuZ2V0UmFuZG9tKDUgLCA1MCk7XG5cdFx0XHRcdFx0XHRzID0gbmV3IEJpbGxib2FyZChtYXRlcmlhbCk7XG5cdFx0XHRcdFx0XHRzLnBpdm90ID0gbmV3IFZlY3RvcjNEKHNpemUvMiwgc2l6ZS8yLCAwKTtcblx0XHRcdFx0XHRcdHMud2lkdGggPSBzaXplO1xuXHRcdFx0XHRcdFx0cy5oZWlnaHQgPSBzaXplO1xuXHRcdFx0XHRcdFx0cy5vcmllbnRhdGlvbk1vZGUgPSBPcmllbnRhdGlvbk1vZGUuQ0FNRVJBX1BMQU5FO1xuXHRcdFx0XHRcdFx0cy5hbGlnbm1lbnRNb2RlID0gQWxpZ25tZW50TW9kZS5QSVZPVF9QT0lOVDtcblx0XHRcdFx0XHRcdFx0cy54ID0gIHRoaXMuZ2V0UmFuZG9tKC00MDAgLCA0MDApO1xuXHRcdFx0XHRcdFx0XHRzLnkgPSAgdGhpcy5nZXRSYW5kb20oLTQwMCAsIDQwMCk7XG5cdFx0XHRcdFx0XHRcdHMueiA9ICB0aGlzLmdldFJhbmRvbSgtNDAwICwgNDAwKTtcblx0XHRcdFx0XHRcdHRoaXMuX3ZpZXcuc2NlbmUuYWRkQ2hpbGQocyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dGhpcy5fdGltZXIuc3RhcnQoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogTW91c2UgZG93biBsaXN0ZW5lciBmb3IgbmF2aWdhdGlvblxuXHQgKi9cblx0cHJpdmF0ZSBvbk1vdXNlRG93bihldmVudDpNb3VzZUV2ZW50KTp2b2lkXG5cdHtcblx0XHR0aGlzLl9sYXN0UGFuQW5nbGUgPSB0aGlzLl9jYW1lcmFDb250cm9sbGVyLnBhbkFuZ2xlO1xuXHRcdHRoaXMuX2xhc3RUaWx0QW5nbGUgPSB0aGlzLl9jYW1lcmFDb250cm9sbGVyLnRpbHRBbmdsZTtcblx0XHR0aGlzLl9sYXN0TW91c2VYID0gZXZlbnQuY2xpZW50WDtcblx0XHR0aGlzLl9sYXN0TW91c2VZID0gZXZlbnQuY2xpZW50WTtcblx0XHR0aGlzLl9tb3ZlID0gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNb3VzZSB1cCBsaXN0ZW5lciBmb3IgbmF2aWdhdGlvblxuXHQgKi9cblx0cHJpdmF0ZSBvbk1vdXNlVXAoZXZlbnQ6TW91c2VFdmVudCk6dm9pZFxuXHR7XG5cdFx0dGhpcy5fbW92ZSA9IGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSBldmVudFxuXHQgKi9cblx0cHJpdmF0ZSBvbk1vdXNlTW92ZShldmVudDpNb3VzZUV2ZW50KVxuXHR7XG5cdFx0aWYgKHRoaXMuX21vdmUpIHtcblx0XHRcdHRoaXMuX2NhbWVyYUNvbnRyb2xsZXIucGFuQW5nbGUgPSAwLjMqKGV2ZW50LmNsaWVudFggLSB0aGlzLl9sYXN0TW91c2VYKSArIHRoaXMuX2xhc3RQYW5BbmdsZTtcblx0XHRcdHRoaXMuX2NhbWVyYUNvbnRyb2xsZXIudGlsdEFuZ2xlID0gMC4zKihldmVudC5jbGllbnRZIC0gdGhpcy5fbGFzdE1vdXNlWSkgKyB0aGlzLl9sYXN0VGlsdEFuZ2xlO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBzdGFnZSBsaXN0ZW5lciBmb3IgcmVzaXplIGV2ZW50c1xuXHQgKi9cblx0cHJpdmF0ZSBvblJlc2l6ZShldmVudDpVSUV2ZW50ID0gbnVsbCk6dm9pZFxuXHR7XG5cdFx0dGhpcy5fdmlldy55ID0gMDtcblx0XHR0aGlzLl92aWV3LnggPSAwO1xuXHRcdHRoaXMuX3ZpZXcud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR0aGlzLl92aWV3LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0fVxuXG5cdC8qKlxuXHQgKiBVdGlsIGZ1bmN0aW9uIC0gZ2V0UmFuZG9tIE51bWJlclxuXHQgKi9cblx0cHJpdmF0ZSBnZXRSYW5kb20obWluOm51bWJlciwgbWF4Om51bWJlcik6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gTWF0aC5yYW5kb20oKSoobWF4IC0gbWluKSArIG1pbjtcblx0fVxufSJdLCJzb3VyY2VSb290IjoiLi90ZXN0cyJ9