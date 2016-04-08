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
        this._view = new View_1.default(new DefaultRenderer_1.default());
        //setup the camera for optimal shadow rendering
        this._view.camera.projection.far = 2100;
        //setup controller to be used on the camera
        this._cameraController = new HoverController_1.default(this._view.camera, null, 45, 20, 1000, 10);
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
        this._timer = new RequestAnimationFrame_1.default(this.onEnterFrame, this);
        this._timer.start();
    };
    /**
     * start loading our texture
     */
    AtlasTest.prototype.loadTexture = function () {
        var _this = this;
        AssetLibrary_1.default.addEventListener(LoaderEvent_1.default.LOAD_COMPLETE, function (event) { return _this.onLoadComplete(event); });
        AssetLibrary_1.default.load(new URLRequest_1.default("assets/atlas.xml"));
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
                    if (asset.isAsset(BitmapImage2D_1.default)) {
                        this._material = new BasicMaterial_1.default(asset);
                        this._material.alphaBlending = true;
                        this._material.imageRect = true;
                    }
                    else if (asset.isAsset(Sampler2D_1.default)) {
                        this._samplers.push(asset);
                    }
            }
        }
        var len = this._samplers.length;
        for (var i = 0; i < len; i++) {
            //var size:number = this.getRandom(50 , 500);
            var s = new Billboard_1.default(this._material);
            var style = new Style_1.default();
            style.addSamplerAt(this._samplers[i], this._material.texture);
            s.style = style;
            s.pivot = new Vector3D_1.default(s.width / 2, s.height / 2, 0);
            //s.width = size;
            //s.height = size;
            s.orientationMode = OrientationMode_1.default.CAMERA_PLANE;
            s.alignmentMode = AlignmentMode_1.default.PIVOT_POINT;
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

//# sourceMappingURL=data:application/json;base64,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O0lBQ0ssNEJBQVEsR0FBaEIsVUFBaUIsS0FBb0I7UUFBcEIscUJBQW9CLEdBQXBCLFlBQW9CO1FBRXBDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNyQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO0lBQ3hDLENBQUM7SUFFRDs7T0FFRztJQUNLLDZCQUFTLEdBQWpCLFVBQWtCLEdBQVUsRUFBRSxHQUFVO1FBRXZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ3hDLENBQUM7SUFDRixnQkFBQztBQUFELENBdkxBLEFBdUxDLElBQUEiLCJmaWxlIjoiZW50aXRpZXMvQXRsYXNUZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJpdG1hcEltYWdlMkRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvaW1hZ2UvQml0bWFwSW1hZ2UyRFwiO1xuaW1wb3J0IFNhbXBsZXIyRFx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL2ltYWdlL1NhbXBsZXIyRFwiO1xuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1ZlY3RvcjNEXCI7XG5pbXBvcnQgQXNzZXRMaWJyYXJ5XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9Bc3NldExpYnJhcnlcIjtcbmltcG9ydCBJQXNzZXRcdFx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvSUFzc2V0XCI7XG5pbXBvcnQgVVJMTG9hZGVyXHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTExvYWRlclwiO1xuaW1wb3J0IFVSTFJlcXVlc3RcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMUmVxdWVzdFwiO1xuaW1wb3J0IExvYWRlckV2ZW50XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvZXZlbnRzL0xvYWRlckV2ZW50XCI7XG5pbXBvcnQgUmVxdWVzdEFuaW1hdGlvbkZyYW1lXHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvdXRpbHMvUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCI7XG5cbmltcG9ydCBWaWV3XHRcdFx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWRpc3BsYXkvbGliL1ZpZXdcIjtcbmltcG9ydCBIb3ZlckNvbnRyb2xsZXJcdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvY29udHJvbGxlcnMvSG92ZXJDb250cm9sbGVyXCI7XG5pbXBvcnQgQWxpZ25tZW50TW9kZVx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL0FsaWdubWVudE1vZGVcIjtcbmltcG9ydCBPcmllbnRhdGlvbk1vZGVcdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9PcmllbnRhdGlvbk1vZGVcIjtcbmltcG9ydCBCaWxsYm9hcmRcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi9kaXNwbGF5L0JpbGxib2FyZFwiO1xuaW1wb3J0IFNwcml0ZVx0XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvZGlzcGxheS9TcHJpdGVcIjtcbmltcG9ydCBCYXNpY01hdGVyaWFsXHRcdFx0XHRmcm9tIFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9CYXNpY01hdGVyaWFsXCI7XG5pbXBvcnQgU2luZ2xlMkRUZXh0dXJlXHRcdFx0XHRmcm9tIFwiYXdheWpzLWRpc3BsYXkvbGliL3RleHR1cmVzL1NpbmdsZTJEVGV4dHVyZVwiO1xuaW1wb3J0IFN0eWxlXHRcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL1N0eWxlXCI7XG5cbmltcG9ydCBEZWZhdWx0UmVuZGVyZXJcdFx0XHRcdGZyb20gXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvRGVmYXVsdFJlbmRlcmVyXCI7XG5cbmNsYXNzIEF0bGFzVGVzdFxue1xuXHQvL2VuZ2luZSB2YXJpYWJsZXNcblx0cHJpdmF0ZSBfdmlldzpWaWV3O1xuXHRwcml2YXRlIF9jYW1lcmFDb250cm9sbGVyOkhvdmVyQ29udHJvbGxlcjtcblxuXHQvL3NjZW5lIHZhcmlhYmxlc1xuXHRwcml2YXRlIF9tYXRlcmlhbDpCYXNpY01hdGVyaWFsO1xuXHRwcml2YXRlIF9zYW1wbGVyczpBcnJheTxTYW1wbGVyMkQ+ID0gbmV3IEFycmF5PFNhbXBsZXIyRD4oKTtcblxuXHQvL25hdmlnYXRpb24gdmFyaWFibGVzXG5cdHByaXZhdGUgX3RpbWVyOlJlcXVlc3RBbmltYXRpb25GcmFtZTtcblx0cHJpdmF0ZSBfdGltZTpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF9tb3ZlOmJvb2xlYW4gPSBmYWxzZTtcblx0cHJpdmF0ZSBfbGFzdFBhbkFuZ2xlOm51bWJlcjtcblx0cHJpdmF0ZSBfbGFzdFRpbHRBbmdsZTpudW1iZXI7XG5cdHByaXZhdGUgX2xhc3RNb3VzZVg6bnVtYmVyO1xuXHRwcml2YXRlIF9sYXN0TW91c2VZOm51bWJlcjtcblxuXHQvKipcblx0ICogQ29uc3RydWN0b3Jcblx0ICovXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHRoaXMuaW5pdCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdsb2JhbCBpbml0aWFsaXNlIGZ1bmN0aW9uXG5cdCAqL1xuXHRwcml2YXRlIGluaXQoKTp2b2lkXG5cdHtcblx0XHR0aGlzLmluaXRFbmdpbmUoKTtcblx0XHR0aGlzLmluaXRMaXN0ZW5lcnMoKTtcblx0XHR0aGlzLmxvYWRUZXh0dXJlKCk7XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGlzZSB0aGUgZW5naW5lXG5cdCAqL1xuXHRwcml2YXRlIGluaXRFbmdpbmUoKTp2b2lkXG5cdHtcblx0XHR0aGlzLl92aWV3ID0gbmV3IFZpZXcobmV3IERlZmF1bHRSZW5kZXJlcigpKTtcblxuXHRcdC8vc2V0dXAgdGhlIGNhbWVyYSBmb3Igb3B0aW1hbCBzaGFkb3cgcmVuZGVyaW5nXG5cdFx0dGhpcy5fdmlldy5jYW1lcmEucHJvamVjdGlvbi5mYXIgPSAyMTAwO1xuXG5cdFx0Ly9zZXR1cCBjb250cm9sbGVyIHRvIGJlIHVzZWQgb24gdGhlIGNhbWVyYVxuXHRcdHRoaXMuX2NhbWVyYUNvbnRyb2xsZXIgPSBuZXcgSG92ZXJDb250cm9sbGVyKHRoaXMuX3ZpZXcuY2FtZXJhLCBudWxsLCA0NSwgMjAsIDEwMDAsIDEwKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXNlIHRoZSBsaXN0ZW5lcnNcblx0ICovXG5cdHByaXZhdGUgaW5pdExpc3RlbmVycygpOnZvaWRcblx0e1xuXHRcdGRvY3VtZW50Lm9ubW91c2Vkb3duID0gKGV2ZW50Ok1vdXNlRXZlbnQpID0+IHRoaXMub25Nb3VzZURvd24oZXZlbnQpO1xuXHRcdGRvY3VtZW50Lm9ubW91c2V1cCA9IChldmVudDpNb3VzZUV2ZW50KSA9PiB0aGlzLm9uTW91c2VVcChldmVudCk7XG5cdFx0ZG9jdW1lbnQub25tb3VzZW1vdmUgPSAoZXZlbnQ6TW91c2VFdmVudCkgPT4gdGhpcy5vbk1vdXNlTW92ZShldmVudCk7XG5cblx0XHR3aW5kb3cub25yZXNpemUgID0gKGV2ZW50OlVJRXZlbnQpID0+IHRoaXMub25SZXNpemUoZXZlbnQpO1xuXG5cdFx0dGhpcy5vblJlc2l6ZSgpO1xuXG5cdFx0dGhpcy5fdGltZXIgPSBuZXcgUmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMub25FbnRlckZyYW1lLCB0aGlzKTtcblx0XHR0aGlzLl90aW1lci5zdGFydCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIHN0YXJ0IGxvYWRpbmcgb3VyIHRleHR1cmVcblx0ICovXG5cdHByaXZhdGUgbG9hZFRleHR1cmUoKTp2b2lkXG5cdHtcblx0XHRBc3NldExpYnJhcnkuYWRkRXZlbnRMaXN0ZW5lcihMb2FkZXJFdmVudC5MT0FEX0NPTVBMRVRFLCAoZXZlbnQ6TG9hZGVyRXZlbnQpID0+IHRoaXMub25Mb2FkQ29tcGxldGUoZXZlbnQpKTtcblx0XHRBc3NldExpYnJhcnkubG9hZChuZXcgVVJMUmVxdWVzdChcImFzc2V0cy9hdGxhcy54bWxcIikpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE5hdmlnYXRpb24gYW5kIHJlbmRlciBsb29wXG5cdCAqL1xuXHRwcml2YXRlIG9uRW50ZXJGcmFtZShkdDpudW1iZXIpOnZvaWRcblx0e1xuXHRcdHRoaXMuX3RpbWUgKz0gZHQ7XG5cblx0XHR0aGlzLl92aWV3LnJlbmRlcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIExpc3RlbmVyIGZ1bmN0aW9uIGZvciBsb2FkIGNvbXBsZXRlIGV2ZW50IG9uIGFzc2V0IGxpYnJhcnlcblx0ICovXG5cdHByaXZhdGUgb25Mb2FkQ29tcGxldGUoZXZlbnQ6TG9hZGVyRXZlbnQpXG5cdHtcblx0XHR2YXIgYXNzZXRzOkFycmF5PElBc3NldD4gPSBldmVudC5hc3NldHM7XG5cdFx0dmFyIGxlbmd0aDpudW1iZXIgPSBhc3NldHMubGVuZ3RoO1xuXG5cdFx0Zm9yICh2YXIgYzpudW1iZXIgPSAwOyBjIDwgbGVuZ3RoOyBjICsrKSB7XG5cdFx0XHR2YXIgYXNzZXQ6SUFzc2V0ID0gYXNzZXRzW2NdO1xuXG5cdFx0XHRzd2l0Y2goZXZlbnQudXJsKSB7XG5cblx0XHRcdFx0Y2FzZSBcImFzc2V0cy9hdGxhcy54bWxcIjpcblxuXHRcdFx0XHRcdGlmIChhc3NldC5pc0Fzc2V0KEJpdG1hcEltYWdlMkQpKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9tYXRlcmlhbCA9IG5ldyBCYXNpY01hdGVyaWFsKDxCaXRtYXBJbWFnZTJEPiBhc3NldCk7XG5cdFx0XHRcdFx0XHR0aGlzLl9tYXRlcmlhbC5hbHBoYUJsZW5kaW5nID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHRoaXMuX21hdGVyaWFsLmltYWdlUmVjdCA9IHRydWU7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChhc3NldC5pc0Fzc2V0KFNhbXBsZXIyRCkpIHtcblx0XHRcdFx0XHRcdHRoaXMuX3NhbXBsZXJzLnB1c2goPFNhbXBsZXIyRD4gYXNzZXQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgbGVuOm51bWJlciA9IHRoaXMuX3NhbXBsZXJzLmxlbmd0aDtcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0Ly92YXIgc2l6ZTpudW1iZXIgPSB0aGlzLmdldFJhbmRvbSg1MCAsIDUwMCk7XG5cdFx0XHR2YXIgczpCaWxsYm9hcmQgPSBuZXcgQmlsbGJvYXJkKHRoaXMuX21hdGVyaWFsKTtcblx0XHRcdHZhciBzdHlsZTpTdHlsZSA9IG5ldyBTdHlsZSgpO1xuXHRcdFx0c3R5bGUuYWRkU2FtcGxlckF0KHRoaXMuX3NhbXBsZXJzW2ldLCB0aGlzLl9tYXRlcmlhbC50ZXh0dXJlKTtcblx0XHRcdHMuc3R5bGUgPSAgc3R5bGU7XG5cdFx0XHRzLnBpdm90ID0gbmV3IFZlY3RvcjNEKHMud2lkdGgvMiwgcy5oZWlnaHQvMiwgMCk7XG5cdFx0XHQvL3Mud2lkdGggPSBzaXplO1xuXHRcdFx0Ly9zLmhlaWdodCA9IHNpemU7XG5cdFx0XHRzLm9yaWVudGF0aW9uTW9kZSA9IE9yaWVudGF0aW9uTW9kZS5DQU1FUkFfUExBTkU7XG5cdFx0XHRzLmFsaWdubWVudE1vZGUgPSBBbGlnbm1lbnRNb2RlLlBJVk9UX1BPSU5UO1xuXHRcdFx0cy54ID0gIHRoaXMuZ2V0UmFuZG9tKC00MDAgLCA0MDApO1xuXHRcdFx0cy55ID0gIHRoaXMuZ2V0UmFuZG9tKC00MDAgLCA0MDApO1xuXHRcdFx0cy56ID0gIHRoaXMuZ2V0UmFuZG9tKC00MDAgLCA0MDApO1xuXHRcdFx0dGhpcy5fdmlldy5zY2VuZS5hZGRDaGlsZChzKTtcblx0XHR9XG5cblx0XHR0aGlzLl90aW1lci5zdGFydCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1vdXNlIGRvd24gbGlzdGVuZXIgZm9yIG5hdmlnYXRpb25cblx0ICovXG5cdHByaXZhdGUgb25Nb3VzZURvd24oZXZlbnQ6TW91c2VFdmVudCk6dm9pZFxuXHR7XG5cdFx0dGhpcy5fbGFzdFBhbkFuZ2xlID0gdGhpcy5fY2FtZXJhQ29udHJvbGxlci5wYW5BbmdsZTtcblx0XHR0aGlzLl9sYXN0VGlsdEFuZ2xlID0gdGhpcy5fY2FtZXJhQ29udHJvbGxlci50aWx0QW5nbGU7XG5cdFx0dGhpcy5fbGFzdE1vdXNlWCA9IGV2ZW50LmNsaWVudFg7XG5cdFx0dGhpcy5fbGFzdE1vdXNlWSA9IGV2ZW50LmNsaWVudFk7XG5cdFx0dGhpcy5fbW92ZSA9IHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogTW91c2UgdXAgbGlzdGVuZXIgZm9yIG5hdmlnYXRpb25cblx0ICovXG5cdHByaXZhdGUgb25Nb3VzZVVwKGV2ZW50Ok1vdXNlRXZlbnQpOnZvaWRcblx0e1xuXHRcdHRoaXMuX21vdmUgPSBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKlxuXHQgKiBAcGFyYW0gZXZlbnRcblx0ICovXG5cdHByaXZhdGUgb25Nb3VzZU1vdmUoZXZlbnQ6TW91c2VFdmVudClcblx0e1xuXHRcdGlmICh0aGlzLl9tb3ZlKSB7XG5cdFx0XHR0aGlzLl9jYW1lcmFDb250cm9sbGVyLnBhbkFuZ2xlID0gMC4zKihldmVudC5jbGllbnRYIC0gdGhpcy5fbGFzdE1vdXNlWCkgKyB0aGlzLl9sYXN0UGFuQW5nbGU7XG5cdFx0XHR0aGlzLl9jYW1lcmFDb250cm9sbGVyLnRpbHRBbmdsZSA9IDAuMyooZXZlbnQuY2xpZW50WSAtIHRoaXMuX2xhc3RNb3VzZVkpICsgdGhpcy5fbGFzdFRpbHRBbmdsZTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogc3RhZ2UgbGlzdGVuZXIgZm9yIHJlc2l6ZSBldmVudHNcblx0ICovXG5cdHByaXZhdGUgb25SZXNpemUoZXZlbnQ6VUlFdmVudCA9IG51bGwpOnZvaWRcblx0e1xuXHRcdHRoaXMuX3ZpZXcueSA9IDA7XG5cdFx0dGhpcy5fdmlldy54ID0gMDtcblx0XHR0aGlzLl92aWV3LndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdFx0dGhpcy5fdmlldy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdH1cblxuXHQvKipcblx0ICogVXRpbCBmdW5jdGlvbiAtIGdldFJhbmRvbSBOdW1iZXJcblx0ICovXG5cdHByaXZhdGUgZ2V0UmFuZG9tKG1pbjpudW1iZXIsIG1heDpudW1iZXIpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIE1hdGgucmFuZG9tKCkqKG1heCAtIG1pbikgKyBtaW47XG5cdH1cbn0iXSwic291cmNlUm9vdCI6Ii4vdGVzdHMifQ==