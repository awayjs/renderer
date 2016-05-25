"use strict";
var BitmapImage2D_1 = require("awayjs-core/lib/image/BitmapImage2D");
var Sampler2D_1 = require("awayjs-core/lib/image/Sampler2D");
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
var Style_1 = require("awayjs-display/lib/base/Style");
var DefaultRenderer_1 = require("awayjs-renderergl/lib/DefaultRenderer");
var AtlasTest = (function () {
    /**
     * Constructor
     */
    function AtlasTest() {
        this._samplers = new Array();
        this._time = 0;
        this._move = false;
        this.init();
    }
    /**
     * Global initialise function
     */
    AtlasTest.prototype.init = function () {
        this.initEngine();
        this.initListeners();
        this.loadTexture();
    };
    /**
     * Initialise the engine
     */
    AtlasTest.prototype.initEngine = function () {
        this._view = new View_1.View(new DefaultRenderer_1.DefaultRenderer());
        //setup the camera for optimal shadow rendering
        this._view.camera.projection.far = 2100;
        //setup controller to be used on the camera
        this._cameraController = new HoverController_1.HoverController(this._view.camera, null, 45, 20, 1000, 10);
    };
    /**
     * Initialise the listeners
     */
    AtlasTest.prototype.initListeners = function () {
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
    AtlasTest.prototype.loadTexture = function () {
        var _this = this;
        AssetLibrary_1.AssetLibrary.addEventListener(LoaderEvent_1.LoaderEvent.LOAD_COMPLETE, function (event) { return _this.onLoadComplete(event); });
        AssetLibrary_1.AssetLibrary.load(new URLRequest_1.URLRequest("assets/atlas.xml"));
    };
    /**
     * Navigation and render loop
     */
    AtlasTest.prototype.onEnterFrame = function (dt) {
        this._time += dt;
        this._view.render();
    };
    /**
     * Listener function for load complete event on asset library
     */
    AtlasTest.prototype.onLoadComplete = function (event) {
        var assets = event.assets;
        var length = assets.length;
        for (var c = 0; c < length; c++) {
            var asset = assets[c];
            switch (event.url) {
                case "assets/atlas.xml":
                    if (asset.isAsset(BitmapImage2D_1.BitmapImage2D)) {
                        this._material = new BasicMaterial_1.BasicMaterial(asset);
                        this._material.alphaBlending = true;
                        this._material.imageRect = true;
                    }
                    else if (asset.isAsset(Sampler2D_1.Sampler2D)) {
                        this._samplers.push(asset);
                    }
            }
        }
        var len = this._samplers.length;
        for (var i = 0; i < len; i++) {
            //var size:number = this.getRandom(50 , 500);
            var s = new Billboard_1.Billboard(this._material);
            var style = new Style_1.Style();
            style.addSamplerAt(this._samplers[i], this._material.texture);
            s.style = style;
            s.pivot = new Vector3D_1.Vector3D(s.width / 2, s.height / 2, 0);
            //s.width = size;
            //s.height = size;
            s.orientationMode = OrientationMode_1.OrientationMode.CAMERA_PLANE;
            s.alignmentMode = AlignmentMode_1.AlignmentMode.PIVOT_POINT;
            s.x = this.getRandom(-400, 400);
            s.y = this.getRandom(-400, 400);
            s.z = this.getRandom(-400, 400);
            this._view.scene.addChild(s);
        }
        this._timer.start();
    };
    /**
     * Mouse down listener for navigation
     */
    AtlasTest.prototype.onMouseDown = function (event) {
        this._lastPanAngle = this._cameraController.panAngle;
        this._lastTiltAngle = this._cameraController.tiltAngle;
        this._lastMouseX = event.clientX;
        this._lastMouseY = event.clientY;
        this._move = true;
    };
    /**
     * Mouse up listener for navigation
     */
    AtlasTest.prototype.onMouseUp = function (event) {
        this._move = false;
    };
    /**
     *
     * @param event
     */
    AtlasTest.prototype.onMouseMove = function (event) {
        if (this._move) {
            this._cameraController.panAngle = 0.3 * (event.clientX - this._lastMouseX) + this._lastPanAngle;
            this._cameraController.tiltAngle = 0.3 * (event.clientY - this._lastMouseY) + this._lastTiltAngle;
        }
    };
    /**
     * stage listener for resize events
     */
    AtlasTest.prototype.onResize = function (event) {
        if (event === void 0) { event = null; }
        this._view.y = 0;
        this._view.x = 0;
        this._view.width = window.innerWidth;
        this._view.height = window.innerHeight;
    };
    /**
     * Util function - getRandom Number
     */
    AtlasTest.prototype.getRandom = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    return AtlasTest;
}());

//# sourceMappingURL=data:application/json;base64,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O0lBQ0ssNEJBQVEsR0FBaEIsVUFBaUIsS0FBb0I7UUFBcEIscUJBQW9CLEdBQXBCLFlBQW9CO1FBRXBDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO0lBQ3hDLENBQUM7SUFFRDs7T0FFRztJQUNLLDZCQUFTLEdBQWpCLFVBQWtCLEdBQVUsRUFBRSxHQUFVO1FBRXZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ3hDLENBQUM7SUFDRixnQkFBQztBQUFELENBdkxBLEFBdUxDLElBQUEiLCJmaWxlIjoiZW50aXRpZXMvQXRsYXNUZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtCaXRtYXBJbWFnZTJEfVx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9pbWFnZS9CaXRtYXBJbWFnZTJEXCI7XG5pbXBvcnQge1NhbXBsZXIyRH1cdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9pbWFnZS9TYW1wbGVyMkRcIjtcbmltcG9ydCB7VmVjdG9yM0R9XHRcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1ZlY3RvcjNEXCI7XG5pbXBvcnQge0Fzc2V0TGlicmFyeX1cdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0Fzc2V0TGlicmFyeVwiO1xuaW1wb3J0IHtJQXNzZXR9XHRcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0lBc3NldFwiO1xuaW1wb3J0IHtVUkxMb2FkZXJ9XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTExvYWRlclwiO1xuaW1wb3J0IHtVUkxSZXF1ZXN0fVx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxSZXF1ZXN0XCI7XG5pbXBvcnQge0xvYWRlckV2ZW50fVx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9Mb2FkZXJFdmVudFwiO1xuaW1wb3J0IHtSZXF1ZXN0QW5pbWF0aW9uRnJhbWV9XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvdXRpbHMvUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCI7XG5cbmltcG9ydCB7Vmlld31cdFx0XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvVmlld1wiO1xuaW1wb3J0IHtIb3ZlckNvbnRyb2xsZXJ9XHRcdFx0XHRmcm9tIFwiYXdheWpzLWRpc3BsYXkvbGliL2NvbnRyb2xsZXJzL0hvdmVyQ29udHJvbGxlclwiO1xuaW1wb3J0IHtBbGlnbm1lbnRNb2RlfVx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL0FsaWdubWVudE1vZGVcIjtcbmltcG9ydCB7T3JpZW50YXRpb25Nb2RlfVx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL09yaWVudGF0aW9uTW9kZVwiO1xuaW1wb3J0IHtCaWxsYm9hcmR9XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvZGlzcGxheS9CaWxsYm9hcmRcIjtcbmltcG9ydCB7U3ByaXRlfVx0XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvZGlzcGxheS9TcHJpdGVcIjtcbmltcG9ydCB7QmFzaWNNYXRlcmlhbH1cdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL0Jhc2ljTWF0ZXJpYWxcIjtcbmltcG9ydCB7U2luZ2xlMkRUZXh0dXJlfVx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi90ZXh0dXJlcy9TaW5nbGUyRFRleHR1cmVcIjtcbmltcG9ydCB7U3R5bGV9XHRcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL1N0eWxlXCI7XG5cbmltcG9ydCB7RGVmYXVsdFJlbmRlcmVyfVx0XHRcdFx0ZnJvbSBcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9EZWZhdWx0UmVuZGVyZXJcIjtcblxuY2xhc3MgQXRsYXNUZXN0XG57XG5cdC8vZW5naW5lIHZhcmlhYmxlc1xuXHRwcml2YXRlIF92aWV3OlZpZXc7XG5cdHByaXZhdGUgX2NhbWVyYUNvbnRyb2xsZXI6SG92ZXJDb250cm9sbGVyO1xuXG5cdC8vc2NlbmUgdmFyaWFibGVzXG5cdHByaXZhdGUgX21hdGVyaWFsOkJhc2ljTWF0ZXJpYWw7XG5cdHByaXZhdGUgX3NhbXBsZXJzOkFycmF5PFNhbXBsZXIyRD4gPSBuZXcgQXJyYXk8U2FtcGxlcjJEPigpO1xuXG5cdC8vbmF2aWdhdGlvbiB2YXJpYWJsZXNcblx0cHJpdmF0ZSBfdGltZXI6UmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXHRwcml2YXRlIF90aW1lOm51bWJlciA9IDA7XG5cdHByaXZhdGUgX21vdmU6Ym9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIF9sYXN0UGFuQW5nbGU6bnVtYmVyO1xuXHRwcml2YXRlIF9sYXN0VGlsdEFuZ2xlOm51bWJlcjtcblx0cHJpdmF0ZSBfbGFzdE1vdXNlWDpudW1iZXI7XG5cdHByaXZhdGUgX2xhc3RNb3VzZVk6bnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBDb25zdHJ1Y3RvclxuXHQgKi9cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0dGhpcy5pbml0KCk7XG5cdH1cblxuXHQvKipcblx0ICogR2xvYmFsIGluaXRpYWxpc2UgZnVuY3Rpb25cblx0ICovXG5cdHByaXZhdGUgaW5pdCgpOnZvaWRcblx0e1xuXHRcdHRoaXMuaW5pdEVuZ2luZSgpO1xuXHRcdHRoaXMuaW5pdExpc3RlbmVycygpO1xuXHRcdHRoaXMubG9hZFRleHR1cmUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXNlIHRoZSBlbmdpbmVcblx0ICovXG5cdHByaXZhdGUgaW5pdEVuZ2luZSgpOnZvaWRcblx0e1xuXHRcdHRoaXMuX3ZpZXcgPSBuZXcgVmlldyhuZXcgRGVmYXVsdFJlbmRlcmVyKCkpO1xuXG5cdFx0Ly9zZXR1cCB0aGUgY2FtZXJhIGZvciBvcHRpbWFsIHNoYWRvdyByZW5kZXJpbmdcblx0XHR0aGlzLl92aWV3LmNhbWVyYS5wcm9qZWN0aW9uLmZhciA9IDIxMDA7XG5cblx0XHQvL3NldHVwIGNvbnRyb2xsZXIgdG8gYmUgdXNlZCBvbiB0aGUgY2FtZXJhXG5cdFx0dGhpcy5fY2FtZXJhQ29udHJvbGxlciA9IG5ldyBIb3ZlckNvbnRyb2xsZXIodGhpcy5fdmlldy5jYW1lcmEsIG51bGwsIDQ1LCAyMCwgMTAwMCwgMTApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpc2UgdGhlIGxpc3RlbmVyc1xuXHQgKi9cblx0cHJpdmF0ZSBpbml0TGlzdGVuZXJzKCk6dm9pZFxuXHR7XG5cdFx0ZG9jdW1lbnQub25tb3VzZWRvd24gPSAoZXZlbnQ6TW91c2VFdmVudCkgPT4gdGhpcy5vbk1vdXNlRG93bihldmVudCk7XG5cdFx0ZG9jdW1lbnQub25tb3VzZXVwID0gKGV2ZW50Ok1vdXNlRXZlbnQpID0+IHRoaXMub25Nb3VzZVVwKGV2ZW50KTtcblx0XHRkb2N1bWVudC5vbm1vdXNlbW92ZSA9IChldmVudDpNb3VzZUV2ZW50KSA9PiB0aGlzLm9uTW91c2VNb3ZlKGV2ZW50KTtcblxuXHRcdHdpbmRvdy5vbnJlc2l6ZSAgPSAoZXZlbnQ6VUlFdmVudCkgPT4gdGhpcy5vblJlc2l6ZShldmVudCk7XG5cblx0XHR0aGlzLm9uUmVzaXplKCk7XG5cblx0XHR0aGlzLl90aW1lciA9IG5ldyBSZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5vbkVudGVyRnJhbWUsIHRoaXMpO1xuXHRcdHRoaXMuX3RpbWVyLnN0YXJ0KCk7XG5cdH1cblxuXHQvKipcblx0ICogc3RhcnQgbG9hZGluZyBvdXIgdGV4dHVyZVxuXHQgKi9cblx0cHJpdmF0ZSBsb2FkVGV4dHVyZSgpOnZvaWRcblx0e1xuXHRcdEFzc2V0TGlicmFyeS5hZGRFdmVudExpc3RlbmVyKExvYWRlckV2ZW50LkxPQURfQ09NUExFVEUsIChldmVudDpMb2FkZXJFdmVudCkgPT4gdGhpcy5vbkxvYWRDb21wbGV0ZShldmVudCkpO1xuXHRcdEFzc2V0TGlicmFyeS5sb2FkKG5ldyBVUkxSZXF1ZXN0KFwiYXNzZXRzL2F0bGFzLnhtbFwiKSk7XG5cdH1cblxuXHQvKipcblx0ICogTmF2aWdhdGlvbiBhbmQgcmVuZGVyIGxvb3Bcblx0ICovXG5cdHByaXZhdGUgb25FbnRlckZyYW1lKGR0Om51bWJlcik6dm9pZFxuXHR7XG5cdFx0dGhpcy5fdGltZSArPSBkdDtcblxuXHRcdHRoaXMuX3ZpZXcucmVuZGVyKCk7XG5cdH1cblxuXHQvKipcblx0ICogTGlzdGVuZXIgZnVuY3Rpb24gZm9yIGxvYWQgY29tcGxldGUgZXZlbnQgb24gYXNzZXQgbGlicmFyeVxuXHQgKi9cblx0cHJpdmF0ZSBvbkxvYWRDb21wbGV0ZShldmVudDpMb2FkZXJFdmVudClcblx0e1xuXHRcdHZhciBhc3NldHM6QXJyYXk8SUFzc2V0PiA9IGV2ZW50LmFzc2V0cztcblx0XHR2YXIgbGVuZ3RoOm51bWJlciA9IGFzc2V0cy5sZW5ndGg7XG5cblx0XHRmb3IgKHZhciBjOm51bWJlciA9IDA7IGMgPCBsZW5ndGg7IGMgKyspIHtcblx0XHRcdHZhciBhc3NldDpJQXNzZXQgPSBhc3NldHNbY107XG5cblx0XHRcdHN3aXRjaChldmVudC51cmwpIHtcblxuXHRcdFx0XHRjYXNlIFwiYXNzZXRzL2F0bGFzLnhtbFwiOlxuXG5cdFx0XHRcdFx0aWYgKGFzc2V0LmlzQXNzZXQoQml0bWFwSW1hZ2UyRCkpIHtcblx0XHRcdFx0XHRcdHRoaXMuX21hdGVyaWFsID0gbmV3IEJhc2ljTWF0ZXJpYWwoPEJpdG1hcEltYWdlMkQ+IGFzc2V0KTtcblx0XHRcdFx0XHRcdHRoaXMuX21hdGVyaWFsLmFscGhhQmxlbmRpbmcgPSB0cnVlO1xuXHRcdFx0XHRcdFx0dGhpcy5fbWF0ZXJpYWwuaW1hZ2VSZWN0ID0gdHJ1ZTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGFzc2V0LmlzQXNzZXQoU2FtcGxlcjJEKSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fc2FtcGxlcnMucHVzaCg8U2FtcGxlcjJEPiBhc3NldCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciBsZW46bnVtYmVyID0gdGhpcy5fc2FtcGxlcnMubGVuZ3RoO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHQvL3ZhciBzaXplOm51bWJlciA9IHRoaXMuZ2V0UmFuZG9tKDUwICwgNTAwKTtcblx0XHRcdHZhciBzOkJpbGxib2FyZCA9IG5ldyBCaWxsYm9hcmQodGhpcy5fbWF0ZXJpYWwpO1xuXHRcdFx0dmFyIHN0eWxlOlN0eWxlID0gbmV3IFN0eWxlKCk7XG5cdFx0XHRzdHlsZS5hZGRTYW1wbGVyQXQodGhpcy5fc2FtcGxlcnNbaV0sIHRoaXMuX21hdGVyaWFsLnRleHR1cmUpO1xuXHRcdFx0cy5zdHlsZSA9ICBzdHlsZTtcblx0XHRcdHMucGl2b3QgPSBuZXcgVmVjdG9yM0Qocy53aWR0aC8yLCBzLmhlaWdodC8yLCAwKTtcblx0XHRcdC8vcy53aWR0aCA9IHNpemU7XG5cdFx0XHQvL3MuaGVpZ2h0ID0gc2l6ZTtcblx0XHRcdHMub3JpZW50YXRpb25Nb2RlID0gT3JpZW50YXRpb25Nb2RlLkNBTUVSQV9QTEFORTtcblx0XHRcdHMuYWxpZ25tZW50TW9kZSA9IEFsaWdubWVudE1vZGUuUElWT1RfUE9JTlQ7XG5cdFx0XHRzLnggPSAgdGhpcy5nZXRSYW5kb20oLTQwMCAsIDQwMCk7XG5cdFx0XHRzLnkgPSAgdGhpcy5nZXRSYW5kb20oLTQwMCAsIDQwMCk7XG5cdFx0XHRzLnogPSAgdGhpcy5nZXRSYW5kb20oLTQwMCAsIDQwMCk7XG5cdFx0XHR0aGlzLl92aWV3LnNjZW5lLmFkZENoaWxkKHMpO1xuXHRcdH1cblxuXHRcdHRoaXMuX3RpbWVyLnN0YXJ0KCk7XG5cdH1cblxuXHQvKipcblx0ICogTW91c2UgZG93biBsaXN0ZW5lciBmb3IgbmF2aWdhdGlvblxuXHQgKi9cblx0cHJpdmF0ZSBvbk1vdXNlRG93bihldmVudDpNb3VzZUV2ZW50KTp2b2lkXG5cdHtcblx0XHR0aGlzLl9sYXN0UGFuQW5nbGUgPSB0aGlzLl9jYW1lcmFDb250cm9sbGVyLnBhbkFuZ2xlO1xuXHRcdHRoaXMuX2xhc3RUaWx0QW5nbGUgPSB0aGlzLl9jYW1lcmFDb250cm9sbGVyLnRpbHRBbmdsZTtcblx0XHR0aGlzLl9sYXN0TW91c2VYID0gZXZlbnQuY2xpZW50WDtcblx0XHR0aGlzLl9sYXN0TW91c2VZID0gZXZlbnQuY2xpZW50WTtcblx0XHR0aGlzLl9tb3ZlID0gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNb3VzZSB1cCBsaXN0ZW5lciBmb3IgbmF2aWdhdGlvblxuXHQgKi9cblx0cHJpdmF0ZSBvbk1vdXNlVXAoZXZlbnQ6TW91c2VFdmVudCk6dm9pZFxuXHR7XG5cdFx0dGhpcy5fbW92ZSA9IGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSBldmVudFxuXHQgKi9cblx0cHJpdmF0ZSBvbk1vdXNlTW92ZShldmVudDpNb3VzZUV2ZW50KVxuXHR7XG5cdFx0aWYgKHRoaXMuX21vdmUpIHtcblx0XHRcdHRoaXMuX2NhbWVyYUNvbnRyb2xsZXIucGFuQW5nbGUgPSAwLjMqKGV2ZW50LmNsaWVudFggLSB0aGlzLl9sYXN0TW91c2VYKSArIHRoaXMuX2xhc3RQYW5BbmdsZTtcblx0XHRcdHRoaXMuX2NhbWVyYUNvbnRyb2xsZXIudGlsdEFuZ2xlID0gMC4zKihldmVudC5jbGllbnRZIC0gdGhpcy5fbGFzdE1vdXNlWSkgKyB0aGlzLl9sYXN0VGlsdEFuZ2xlO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBzdGFnZSBsaXN0ZW5lciBmb3IgcmVzaXplIGV2ZW50c1xuXHQgKi9cblx0cHJpdmF0ZSBvblJlc2l6ZShldmVudDpVSUV2ZW50ID0gbnVsbCk6dm9pZFxuXHR7XG5cdFx0dGhpcy5fdmlldy55ID0gMDtcblx0XHR0aGlzLl92aWV3LnggPSAwO1xuXHRcdHRoaXMuX3ZpZXcud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR0aGlzLl92aWV3LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0fVxuXG5cdC8qKlxuXHQgKiBVdGlsIGZ1bmN0aW9uIC0gZ2V0UmFuZG9tIE51bWJlclxuXHQgKi9cblx0cHJpdmF0ZSBnZXRSYW5kb20obWluOm51bWJlciwgbWF4Om51bWJlcik6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gTWF0aC5yYW5kb20oKSoobWF4IC0gbWluKSArIG1pbjtcblx0fVxufSJdLCJzb3VyY2VSb290IjoiLi90ZXN0cyJ9
