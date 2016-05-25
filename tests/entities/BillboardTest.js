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
        this._view = new View_1.View(new DefaultRenderer_1.DefaultRenderer());
        //setup the camera for optimal shadow rendering
        this._view.camera.projection.far = 2100;
        //setup controller to be used on the camera
        this._cameraController = new HoverController_1.HoverController(this._view.camera, null, 45, 20, 1000, 10);
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
        this._timer = new RequestAnimationFrame_1.RequestAnimationFrame(this.onEnterFrame, this);
        this._timer.start();
    };
    /**
     * start loading our texture
     */
    BillboardTest.prototype.loadTexture = function () {
        var _this = this;
        AssetLibrary_1.AssetLibrary.addEventListener(LoaderEvent_1.LoaderEvent.LOAD_COMPLETE, function (event) { return _this.onLoadComplete(event); });
        AssetLibrary_1.AssetLibrary.load(new URLRequest_1.URLRequest("assets/130909wall_big.png"));
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
                    var material = new BasicMaterial_1.BasicMaterial(asset);
                    var s;
                    s = new Billboard_1.Billboard(material);
                    s.pivot = new Vector3D_1.Vector3D(150, 150, 0);
                    s.width = 300;
                    s.height = 300;
                    //s.rotationX = 45;
                    s.orientationMode = OrientationMode_1.OrientationMode.CAMERA_PLANE;
                    s.alignmentMode = AlignmentMode_1.AlignmentMode.PIVOT_POINT;
                    this._view.scene.addChild(s);
                    for (var c = 0; c < 100; c++) {
                        var size = this.getRandom(5, 50);
                        s = new Billboard_1.Billboard(material);
                        s.pivot = new Vector3D_1.Vector3D(size / 2, size / 2, 0);
                        s.width = size;
                        s.height = size;
                        s.orientationMode = OrientationMode_1.OrientationMode.CAMERA_PLANE;
                        s.alignmentMode = AlignmentMode_1.AlignmentMode.PIVOT_POINT;
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

//# sourceMappingURL=data:application/json;base64,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LE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDckMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztJQUN4QyxDQUFDO0lBRUQ7O09BRUc7SUFDSyxpQ0FBUyxHQUFqQixVQUFrQixHQUFVLEVBQUUsR0FBVTtRQUV2QyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUN4QyxDQUFDO0lBQ0Ysb0JBQUM7QUFBRCxDQXJMQSxBQXFMQyxJQUFBIiwiZmlsZSI6ImVudGl0aWVzL0JpbGxib2FyZFRlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0JpdG1hcEltYWdlMkR9XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL2ltYWdlL0JpdG1hcEltYWdlMkRcIjtcbmltcG9ydCB7VmVjdG9yM0R9XHRcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1ZlY3RvcjNEXCI7XG5pbXBvcnQge0Fzc2V0TGlicmFyeX1cdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0Fzc2V0TGlicmFyeVwiO1xuaW1wb3J0IHtJQXNzZXR9XHRcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0lBc3NldFwiO1xuaW1wb3J0IHtVUkxMb2FkZXJ9XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTExvYWRlclwiO1xuaW1wb3J0IHtVUkxSZXF1ZXN0fVx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxSZXF1ZXN0XCI7XG5pbXBvcnQge0xvYWRlckV2ZW50fVx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9Mb2FkZXJFdmVudFwiO1xuaW1wb3J0IHtSZXF1ZXN0QW5pbWF0aW9uRnJhbWV9XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvdXRpbHMvUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCI7XG5cbmltcG9ydCB7Vmlld31cdFx0XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvVmlld1wiO1xuaW1wb3J0IHtIb3ZlckNvbnRyb2xsZXJ9XHRcdFx0XHRmcm9tIFwiYXdheWpzLWRpc3BsYXkvbGliL2NvbnRyb2xsZXJzL0hvdmVyQ29udHJvbGxlclwiO1xuaW1wb3J0IHtBbGlnbm1lbnRNb2RlfVx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL0FsaWdubWVudE1vZGVcIjtcbmltcG9ydCB7T3JpZW50YXRpb25Nb2RlfVx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL09yaWVudGF0aW9uTW9kZVwiO1xuaW1wb3J0IHtCaWxsYm9hcmR9XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvZGlzcGxheS9CaWxsYm9hcmRcIjtcbmltcG9ydCB7U3ByaXRlfVx0XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvZGlzcGxheS9TcHJpdGVcIjtcbmltcG9ydCB7QmFzaWNNYXRlcmlhbH1cdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL0Jhc2ljTWF0ZXJpYWxcIjtcbmltcG9ydCB7U2luZ2xlMkRUZXh0dXJlfVx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi90ZXh0dXJlcy9TaW5nbGUyRFRleHR1cmVcIjtcblxuaW1wb3J0IHtEZWZhdWx0UmVuZGVyZXJ9XHRcdFx0XHRmcm9tIFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL0RlZmF1bHRSZW5kZXJlclwiO1xuXG5jbGFzcyBCaWxsYm9hcmRUZXN0XG57XG5cdC8vZW5naW5lIHZhcmlhYmxlc1xuXHRwcml2YXRlIF92aWV3OlZpZXc7XG5cdHByaXZhdGUgX2NhbWVyYUNvbnRyb2xsZXI6SG92ZXJDb250cm9sbGVyO1xuXG5cdC8vbmF2aWdhdGlvbiB2YXJpYWJsZXNcblx0cHJpdmF0ZSBfdGltZXI6UmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXHRwcml2YXRlIF90aW1lOm51bWJlciA9IDA7XG5cdHByaXZhdGUgX21vdmU6Ym9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIF9sYXN0UGFuQW5nbGU6bnVtYmVyO1xuXHRwcml2YXRlIF9sYXN0VGlsdEFuZ2xlOm51bWJlcjtcblx0cHJpdmF0ZSBfbGFzdE1vdXNlWDpudW1iZXI7XG5cdHByaXZhdGUgX2xhc3RNb3VzZVk6bnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBDb25zdHJ1Y3RvclxuXHQgKi9cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0dGhpcy5pbml0KCk7XG5cdH1cblxuXHQvKipcblx0ICogR2xvYmFsIGluaXRpYWxpc2UgZnVuY3Rpb25cblx0ICovXG5cdHByaXZhdGUgaW5pdCgpOnZvaWRcblx0e1xuXHRcdHRoaXMuaW5pdEVuZ2luZSgpO1xuXHRcdHRoaXMuaW5pdExpc3RlbmVycygpO1xuXHRcdHRoaXMubG9hZFRleHR1cmUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXNlIHRoZSBlbmdpbmVcblx0ICovXG5cdHByaXZhdGUgaW5pdEVuZ2luZSgpOnZvaWRcblx0e1xuXHRcdHRoaXMuX3ZpZXcgPSBuZXcgVmlldyhuZXcgRGVmYXVsdFJlbmRlcmVyKCkpO1xuXG5cdFx0Ly9zZXR1cCB0aGUgY2FtZXJhIGZvciBvcHRpbWFsIHNoYWRvdyByZW5kZXJpbmdcblx0XHR0aGlzLl92aWV3LmNhbWVyYS5wcm9qZWN0aW9uLmZhciA9IDIxMDA7XG5cblx0XHQvL3NldHVwIGNvbnRyb2xsZXIgdG8gYmUgdXNlZCBvbiB0aGUgY2FtZXJhXG5cdFx0dGhpcy5fY2FtZXJhQ29udHJvbGxlciA9IG5ldyBIb3ZlckNvbnRyb2xsZXIodGhpcy5fdmlldy5jYW1lcmEsIG51bGwsIDQ1LCAyMCwgMTAwMCwgMTApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpc2UgdGhlIGxpc3RlbmVyc1xuXHQgKi9cblx0cHJpdmF0ZSBpbml0TGlzdGVuZXJzKCk6dm9pZFxuXHR7XG5cdFx0ZG9jdW1lbnQub25tb3VzZWRvd24gPSAoZXZlbnQ6TW91c2VFdmVudCkgPT4gdGhpcy5vbk1vdXNlRG93bihldmVudCk7XG5cdFx0ZG9jdW1lbnQub25tb3VzZXVwID0gKGV2ZW50Ok1vdXNlRXZlbnQpID0+IHRoaXMub25Nb3VzZVVwKGV2ZW50KTtcblx0XHRkb2N1bWVudC5vbm1vdXNlbW92ZSA9IChldmVudDpNb3VzZUV2ZW50KSA9PiB0aGlzLm9uTW91c2VNb3ZlKGV2ZW50KTtcblxuXHRcdHdpbmRvdy5vbnJlc2l6ZSAgPSAoZXZlbnQ6VUlFdmVudCkgPT4gdGhpcy5vblJlc2l6ZShldmVudCk7XG5cblx0XHR0aGlzLm9uUmVzaXplKCk7XG5cblx0XHR0aGlzLl90aW1lciA9IG5ldyBSZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5vbkVudGVyRnJhbWUsIHRoaXMpO1xuXHRcdHRoaXMuX3RpbWVyLnN0YXJ0KCk7XG5cdH1cblxuXHQvKipcblx0ICogc3RhcnQgbG9hZGluZyBvdXIgdGV4dHVyZVxuXHQgKi9cblx0cHJpdmF0ZSBsb2FkVGV4dHVyZSgpOnZvaWRcblx0e1xuXHRcdEFzc2V0TGlicmFyeS5hZGRFdmVudExpc3RlbmVyKExvYWRlckV2ZW50LkxPQURfQ09NUExFVEUsIChldmVudDpMb2FkZXJFdmVudCkgPT4gdGhpcy5vbkxvYWRDb21wbGV0ZShldmVudCkpO1xuXHRcdEFzc2V0TGlicmFyeS5sb2FkKG5ldyBVUkxSZXF1ZXN0KFwiYXNzZXRzLzEzMDkwOXdhbGxfYmlnLnBuZ1wiKSk7XG5cdH1cblxuXHQvKipcblx0ICogTmF2aWdhdGlvbiBhbmQgcmVuZGVyIGxvb3Bcblx0ICovXG5cdHByaXZhdGUgb25FbnRlckZyYW1lKGR0Om51bWJlcik6dm9pZFxuXHR7XG5cdFx0dGhpcy5fdGltZSArPSBkdDtcblxuXHRcdHRoaXMuX3ZpZXcucmVuZGVyKCk7XG5cdH1cblxuXHQvKipcblx0ICogTGlzdGVuZXIgZnVuY3Rpb24gZm9yIGxvYWQgY29tcGxldGUgZXZlbnQgb24gYXNzZXQgbGlicmFyeVxuXHQgKi9cblx0cHJpdmF0ZSBvbkxvYWRDb21wbGV0ZShldmVudDpMb2FkZXJFdmVudClcblx0e1xuXHRcdHZhciBhc3NldHM6QXJyYXk8SUFzc2V0PiA9IGV2ZW50LmFzc2V0cztcblx0XHR2YXIgbGVuZ3RoOm51bWJlciA9IGFzc2V0cy5sZW5ndGg7XG5cblx0XHRmb3IgKHZhciBjOm51bWJlciA9IDA7IGMgPCBsZW5ndGg7IGMgKyspIHtcblx0XHRcdHZhciBhc3NldDpJQXNzZXQgPSBhc3NldHNbY107XG5cblx0XHRcdHN3aXRjaChldmVudC51cmwpIHtcblxuXHRcdFx0XHRjYXNlIFwiYXNzZXRzLzEzMDkwOXdhbGxfYmlnLnBuZ1wiOlxuXG5cdFx0XHRcdFx0dmFyIG1hdGVyaWFsOkJhc2ljTWF0ZXJpYWwgPSBuZXcgQmFzaWNNYXRlcmlhbCg8Qml0bWFwSW1hZ2UyRD4gYXNzZXQpO1xuXG5cdFx0XHRcdFx0dmFyIHM6QmlsbGJvYXJkO1xuXHRcdFx0XHRcdFx0cyA9IG5ldyBCaWxsYm9hcmQobWF0ZXJpYWwpO1xuXHRcdFx0XHRcdFx0cy5waXZvdCA9IG5ldyBWZWN0b3IzRCgxNTAsIDE1MCwgMCk7XG5cdFx0XHRcdFx0XHRzLndpZHRoID0gMzAwO1xuXHRcdFx0XHRcdFx0cy5oZWlnaHQgPSAzMDA7XG5cdFx0XHRcdFx0XHQvL3Mucm90YXRpb25YID0gNDU7XG5cdFx0XHRcdFx0cy5vcmllbnRhdGlvbk1vZGUgPSBPcmllbnRhdGlvbk1vZGUuQ0FNRVJBX1BMQU5FO1xuXHRcdFx0XHRcdHMuYWxpZ25tZW50TW9kZSA9IEFsaWdubWVudE1vZGUuUElWT1RfUE9JTlQ7XG5cblx0XHRcdFx0XHR0aGlzLl92aWV3LnNjZW5lLmFkZENoaWxkKHMpO1xuXG5cdFx0XHRcdFx0Zm9yICh2YXIgYzpudW1iZXIgPSAwOyBjIDwgMTAwOyBjICsrKSB7XG5cdFx0XHRcdFx0XHR2YXIgc2l6ZTpudW1iZXIgPSB0aGlzLmdldFJhbmRvbSg1ICwgNTApO1xuXHRcdFx0XHRcdFx0cyA9IG5ldyBCaWxsYm9hcmQobWF0ZXJpYWwpO1xuXHRcdFx0XHRcdFx0cy5waXZvdCA9IG5ldyBWZWN0b3IzRChzaXplLzIsIHNpemUvMiwgMCk7XG5cdFx0XHRcdFx0XHRzLndpZHRoID0gc2l6ZTtcblx0XHRcdFx0XHRcdHMuaGVpZ2h0ID0gc2l6ZTtcblx0XHRcdFx0XHRcdHMub3JpZW50YXRpb25Nb2RlID0gT3JpZW50YXRpb25Nb2RlLkNBTUVSQV9QTEFORTtcblx0XHRcdFx0XHRcdHMuYWxpZ25tZW50TW9kZSA9IEFsaWdubWVudE1vZGUuUElWT1RfUE9JTlQ7XG5cdFx0XHRcdFx0XHRcdHMueCA9ICB0aGlzLmdldFJhbmRvbSgtNDAwICwgNDAwKTtcblx0XHRcdFx0XHRcdFx0cy55ID0gIHRoaXMuZ2V0UmFuZG9tKC00MDAgLCA0MDApO1xuXHRcdFx0XHRcdFx0XHRzLnogPSAgdGhpcy5nZXRSYW5kb20oLTQwMCAsIDQwMCk7XG5cdFx0XHRcdFx0XHR0aGlzLl92aWV3LnNjZW5lLmFkZENoaWxkKHMpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHRoaXMuX3RpbWVyLnN0YXJ0KCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIE1vdXNlIGRvd24gbGlzdGVuZXIgZm9yIG5hdmlnYXRpb25cblx0ICovXG5cdHByaXZhdGUgb25Nb3VzZURvd24oZXZlbnQ6TW91c2VFdmVudCk6dm9pZFxuXHR7XG5cdFx0dGhpcy5fbGFzdFBhbkFuZ2xlID0gdGhpcy5fY2FtZXJhQ29udHJvbGxlci5wYW5BbmdsZTtcblx0XHR0aGlzLl9sYXN0VGlsdEFuZ2xlID0gdGhpcy5fY2FtZXJhQ29udHJvbGxlci50aWx0QW5nbGU7XG5cdFx0dGhpcy5fbGFzdE1vdXNlWCA9IGV2ZW50LmNsaWVudFg7XG5cdFx0dGhpcy5fbGFzdE1vdXNlWSA9IGV2ZW50LmNsaWVudFk7XG5cdFx0dGhpcy5fbW92ZSA9IHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogTW91c2UgdXAgbGlzdGVuZXIgZm9yIG5hdmlnYXRpb25cblx0ICovXG5cdHByaXZhdGUgb25Nb3VzZVVwKGV2ZW50Ok1vdXNlRXZlbnQpOnZvaWRcblx0e1xuXHRcdHRoaXMuX21vdmUgPSBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0gZXZlbnRcblx0ICovXG5cdHByaXZhdGUgb25Nb3VzZU1vdmUoZXZlbnQ6TW91c2VFdmVudClcblx0e1xuXHRcdGlmICh0aGlzLl9tb3ZlKSB7XG5cdFx0XHR0aGlzLl9jYW1lcmFDb250cm9sbGVyLnBhbkFuZ2xlID0gMC4zKihldmVudC5jbGllbnRYIC0gdGhpcy5fbGFzdE1vdXNlWCkgKyB0aGlzLl9sYXN0UGFuQW5nbGU7XG5cdFx0XHR0aGlzLl9jYW1lcmFDb250cm9sbGVyLnRpbHRBbmdsZSA9IDAuMyooZXZlbnQuY2xpZW50WSAtIHRoaXMuX2xhc3RNb3VzZVkpICsgdGhpcy5fbGFzdFRpbHRBbmdsZTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogc3RhZ2UgbGlzdGVuZXIgZm9yIHJlc2l6ZSBldmVudHNcblx0ICovXG5cdHByaXZhdGUgb25SZXNpemUoZXZlbnQ6VUlFdmVudCA9IG51bGwpOnZvaWRcblx0e1xuXHRcdHRoaXMuX3ZpZXcueSA9IDA7XG5cdFx0dGhpcy5fdmlldy54ID0gMDtcblx0XHR0aGlzLl92aWV3LndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdFx0dGhpcy5fdmlldy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdH1cblxuXHQvKipcblx0ICogVXRpbCBmdW5jdGlvbiAtIGdldFJhbmRvbSBOdW1iZXJcblx0ICovXG5cdHByaXZhdGUgZ2V0UmFuZG9tKG1pbjpudW1iZXIsIG1heDpudW1iZXIpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIE1hdGgucmFuZG9tKCkqKG1heCAtIG1pbikgKyBtaW47XG5cdH1cbn0iXSwic291cmNlUm9vdCI6Ii4vdGVzdHMifQ==
