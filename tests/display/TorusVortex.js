"use strict";
var BlendMode_1 = require("awayjs-core/lib/image/BlendMode");
var Vector3D_1 = require("awayjs-core/lib/geom/Vector3D");
var URLLoader_1 = require("awayjs-core/lib/net/URLLoader");
var URLLoaderDataFormat_1 = require("awayjs-core/lib/net/URLLoaderDataFormat");
var URLRequest_1 = require("awayjs-core/lib/net/URLRequest");
var URLLoaderEvent_1 = require("awayjs-core/lib/events/URLLoaderEvent");
var ParserUtils_1 = require("awayjs-core/lib/parsers/ParserUtils");
var PerspectiveProjection_1 = require("awayjs-core/lib/projections/PerspectiveProjection");
var RequestAnimationFrame_1 = require("awayjs-core/lib/utils/RequestAnimationFrame");
var Debug_1 = require("awayjs-core/lib/utils/Debug");
var View_1 = require("awayjs-display/lib/View");
var ElementsType_1 = require("awayjs-display/lib/graphics/ElementsType");
var BasicMaterial_1 = require("awayjs-display/lib/materials/BasicMaterial");
var PrimitiveCubePrefab_1 = require("awayjs-display/lib/prefabs/PrimitiveCubePrefab");
var PrimitiveTorusPrefab_1 = require("awayjs-display/lib/prefabs/PrimitiveTorusPrefab");
var DefaultRenderer_1 = require("awayjs-renderergl/lib/DefaultRenderer");
var TorusVortex = (function () {
    function TorusVortex() {
        Debug_1.Debug.THROW_ERRORS = false;
        this._view = new View_1.View(new DefaultRenderer_1.DefaultRenderer());
        this._view.backgroundColor = 0x000000;
        this._view.camera.x = 130;
        this._view.camera.y = 0;
        this._view.camera.z = 0;
        this._cameraAxis = new Vector3D_1.Vector3D(0, 0, 1);
        this._view.camera.projection = new PerspectiveProjection_1.PerspectiveProjection(120);
        this._view.camera.projection.near = 0.1;
        this.loadResources();
    }
    TorusVortex.prototype.loadResources = function () {
        var _this = this;
        var urlRequest = new URLRequest_1.URLRequest("assets/130909wall_big.png");
        var urlLoader = new URLLoader_1.URLLoader();
        urlLoader.dataFormat = URLLoaderDataFormat_1.URLLoaderDataFormat.BLOB;
        urlLoader.addEventListener(URLLoaderEvent_1.URLLoaderEvent.LOAD_COMPLETE, function (event) { return _this.imageCompleteHandler(event); });
        urlLoader.load(urlRequest);
    };
    TorusVortex.prototype.imageCompleteHandler = function (event) {
        var _this = this;
        var imageLoader = event.target;
        this._image = ParserUtils_1.ParserUtils.blobToImage(imageLoader.data);
        this._image.onload = function (event) { return _this.onLoadComplete(event); };
    };
    TorusVortex.prototype.onLoadComplete = function (event) {
        var _this = this;
        var matTx = new BasicMaterial_1.BasicMaterial(ParserUtils_1.ParserUtils.imageToBitmapImage2D(this._image));
        matTx.blendMode = BlendMode_1.BlendMode.ADD;
        matTx.bothSides = true;
        var cube = new PrimitiveCubePrefab_1.PrimitiveCubePrefab(matTx, ElementsType_1.ElementsType.TRIANGLE, 20.0, 20.0, 20.0);
        var torus = new PrimitiveTorusPrefab_1.PrimitiveTorusPrefab(matTx, ElementsType_1.ElementsType.TRIANGLE, 150, 80, 32, 16, true);
        this._mesh = torus.getNewObject();
        this._mesh2 = cube.getNewObject();
        this._mesh2.x = 130;
        this._mesh2.z = 40;
        this._view.scene.addChild(this._mesh);
        this._view.scene.addChild(this._mesh2);
        this._raf = new RequestAnimationFrame_1.RequestAnimationFrame(this.render, this);
        this._raf.start();
        window.onresize = function (event) { return _this.onResize(event); };
        this.onResize();
    };
    TorusVortex.prototype.render = function (dt) {
        if (dt === void 0) { dt = null; }
        this._view.camera.transform.rotate(this._cameraAxis, 1);
        this._mesh.rotationY += 1;
        this._mesh2.rotationX += 0.4;
        this._mesh2.rotationY += 0.4;
        this._view.render();
    };
    TorusVortex.prototype.onResize = function (event) {
        if (event === void 0) { event = null; }
        this._view.y = 0;
        this._view.x = 0;
        this._view.width = window.innerWidth;
        this._view.height = window.innerHeight;
    };
    return TorusVortex;
}());

//# sourceMappingURL=data:application/json;base64,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T0FBQSxLQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFwQixDQUFvQixDQUFDO1FBRTFELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBRU0sNEJBQU0sR0FBYixVQUFjLEVBQWdCO1FBQWhCLGtCQUFnQixHQUFoQixTQUFnQjtRQUc3QixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLEdBQUcsQ0FBQztRQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsSUFBSSxHQUFHLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRU0sOEJBQVEsR0FBZixVQUFnQixLQUFvQjtRQUFwQixxQkFBb0IsR0FBcEIsWUFBb0I7UUFFbkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDeEMsQ0FBQztJQUNGLGtCQUFDO0FBQUQsQ0F4RkEsQUF3RkMsSUFBQSIsImZpbGUiOiJkaXNwbGF5L1RvcnVzVm9ydGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtCbGVuZE1vZGV9XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvaW1hZ2UvQmxlbmRNb2RlXCI7XG5pbXBvcnQge1ZlY3RvcjNEfVx0XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiO1xuaW1wb3J0IHtVUkxMb2FkZXJ9XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTExvYWRlclwiO1xuaW1wb3J0IHtVUkxMb2FkZXJEYXRhRm9ybWF0fVx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTExvYWRlckRhdGFGb3JtYXRcIjtcbmltcG9ydCB7VVJMUmVxdWVzdH1cdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMUmVxdWVzdFwiO1xuaW1wb3J0IHtVUkxMb2FkZXJFdmVudH1cdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvZXZlbnRzL1VSTExvYWRlckV2ZW50XCI7XG5pbXBvcnQge1BhcnNlclV0aWxzfVx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL3BhcnNlcnMvUGFyc2VyVXRpbHNcIjtcbmltcG9ydCB7UGVyc3BlY3RpdmVQcm9qZWN0aW9ufVx0XHRmcm9tIFwiYXdheWpzLWNvcmUvbGliL3Byb2plY3Rpb25zL1BlcnNwZWN0aXZlUHJvamVjdGlvblwiO1xuaW1wb3J0IHtSZXF1ZXN0QW5pbWF0aW9uRnJhbWV9XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvdXRpbHMvUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCI7XG5pbXBvcnQge0RlYnVnfVx0XHRcdFx0XHRcdGZyb20gXCJhd2F5anMtY29yZS9saWIvdXRpbHMvRGVidWdcIjtcblxuaW1wb3J0IHtWaWV3fVx0XHRcdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi9WaWV3XCI7XG5pbXBvcnQge1Nwcml0ZX1cdFx0XHRcdFx0XHRmcm9tIFwiYXdheWpzLWRpc3BsYXkvbGliL2Rpc3BsYXkvU3ByaXRlXCI7XG5pbXBvcnQge0VsZW1lbnRzVHlwZX1cdFx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi9ncmFwaGljcy9FbGVtZW50c1R5cGVcIjtcbmltcG9ydCB7QmFzaWNNYXRlcmlhbH1cdFx0XHRcdGZyb20gXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL0Jhc2ljTWF0ZXJpYWxcIjtcbmltcG9ydCB7UHJpbWl0aXZlQ3ViZVByZWZhYn1cdFx0XHRmcm9tIFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlQ3ViZVByZWZhYlwiO1xuaW1wb3J0IHtQcmltaXRpdmVUb3J1c1ByZWZhYn1cdFx0XHRmcm9tIFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlVG9ydXNQcmVmYWJcIjtcbmltcG9ydCB7U2luZ2xlMkRUZXh0dXJlfVx0XHRcdFx0ZnJvbSBcImF3YXlqcy1kaXNwbGF5L2xpYi90ZXh0dXJlcy9TaW5nbGUyRFRleHR1cmVcIjtcblxuaW1wb3J0IHtEZWZhdWx0UmVuZGVyZXJ9XHRcdFx0XHRmcm9tIFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL0RlZmF1bHRSZW5kZXJlclwiO1xuXG5jbGFzcyBUb3J1c1ZvcnRleFxue1xuXHRwcml2YXRlIF92aWV3OlZpZXc7XG5cdHByaXZhdGUgX21lc2g6U3ByaXRlO1xuXHRwcml2YXRlIF9tZXNoMjpTcHJpdGU7XG5cblx0cHJpdmF0ZSBfcmFmOlJlcXVlc3RBbmltYXRpb25GcmFtZTtcblx0cHJpdmF0ZSBfaW1hZ2U6SFRNTEltYWdlRWxlbWVudDtcblx0cHJpdmF0ZSBfY2FtZXJhQXhpczpWZWN0b3IzRDtcblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHREZWJ1Zy5USFJPV19FUlJPUlMgPSBmYWxzZTtcblxuXHRcdHRoaXMuX3ZpZXcgPSBuZXcgVmlldyhuZXcgRGVmYXVsdFJlbmRlcmVyKCkpO1xuXG5cdFx0dGhpcy5fdmlldy5iYWNrZ3JvdW5kQ29sb3IgPSAweDAwMDAwMDtcblx0XHR0aGlzLl92aWV3LmNhbWVyYS54ID0gMTMwO1xuXHRcdHRoaXMuX3ZpZXcuY2FtZXJhLnkgPSAwO1xuXHRcdHRoaXMuX3ZpZXcuY2FtZXJhLnogPSAwO1xuXHRcdHRoaXMuX2NhbWVyYUF4aXMgPSBuZXcgVmVjdG9yM0QoMCwgMCwgMSk7XG5cblx0XHR0aGlzLl92aWV3LmNhbWVyYS5wcm9qZWN0aW9uID0gbmV3IFBlcnNwZWN0aXZlUHJvamVjdGlvbigxMjApO1xuXHRcdHRoaXMuX3ZpZXcuY2FtZXJhLnByb2plY3Rpb24ubmVhciA9IDAuMTtcblxuXHRcdHRoaXMubG9hZFJlc291cmNlcygpO1xuXHR9XG5cblx0cHJpdmF0ZSBsb2FkUmVzb3VyY2VzKClcblx0e1xuXHRcdHZhciB1cmxSZXF1ZXN0OlVSTFJlcXVlc3QgPSBuZXcgVVJMUmVxdWVzdCggXCJhc3NldHMvMTMwOTA5d2FsbF9iaWcucG5nXCIgKTtcblx0XHR2YXIgdXJsTG9hZGVyOlVSTExvYWRlciA9IG5ldyBVUkxMb2FkZXIoKTtcblx0XHR1cmxMb2FkZXIuZGF0YUZvcm1hdCA9IFVSTExvYWRlckRhdGFGb3JtYXQuQkxPQjtcblx0XHR1cmxMb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcihVUkxMb2FkZXJFdmVudC5MT0FEX0NPTVBMRVRFLCAoZXZlbnQ6VVJMTG9hZGVyRXZlbnQpID0+IHRoaXMuaW1hZ2VDb21wbGV0ZUhhbmRsZXIoZXZlbnQpKTtcblx0XHR1cmxMb2FkZXIubG9hZCh1cmxSZXF1ZXN0KTtcblx0fVxuXG5cdHByaXZhdGUgaW1hZ2VDb21wbGV0ZUhhbmRsZXIoZXZlbnQ6VVJMTG9hZGVyRXZlbnQpXG5cdHtcblx0XHR2YXIgaW1hZ2VMb2FkZXI6VVJMTG9hZGVyID0gPFVSTExvYWRlcj4gZXZlbnQudGFyZ2V0O1xuXHRcdHRoaXMuX2ltYWdlID0gUGFyc2VyVXRpbHMuYmxvYlRvSW1hZ2UoaW1hZ2VMb2FkZXIuZGF0YSk7XG5cdFx0dGhpcy5faW1hZ2Uub25sb2FkID0gKGV2ZW50KSA9PiB0aGlzLm9uTG9hZENvbXBsZXRlKGV2ZW50KTtcblx0fVxuXG5cdHByaXZhdGUgb25Mb2FkQ29tcGxldGUoZXZlbnQpXG5cdHtcblx0XHR2YXIgbWF0VHg6QmFzaWNNYXRlcmlhbCA9IG5ldyBCYXNpY01hdGVyaWFsKFBhcnNlclV0aWxzLmltYWdlVG9CaXRtYXBJbWFnZTJEKHRoaXMuX2ltYWdlKSk7XG5cblx0XHRtYXRUeC5ibGVuZE1vZGUgPSBCbGVuZE1vZGUuQUREO1xuXHRcdG1hdFR4LmJvdGhTaWRlcyA9IHRydWU7XG5cblx0XHR2YXIgY3ViZTpQcmltaXRpdmVDdWJlUHJlZmFiID0gbmV3IFByaW1pdGl2ZUN1YmVQcmVmYWIobWF0VHgsIEVsZW1lbnRzVHlwZS5UUklBTkdMRSwgMjAuMCwgMjAuMCwgMjAuMCk7XG5cdFx0dmFyIHRvcnVzOlByaW1pdGl2ZVRvcnVzUHJlZmFiID0gbmV3IFByaW1pdGl2ZVRvcnVzUHJlZmFiKG1hdFR4LCBFbGVtZW50c1R5cGUuVFJJQU5HTEUsIDE1MCwgODAsIDMyLCAxNiwgdHJ1ZSk7XG5cblx0XHR0aGlzLl9tZXNoID0gPFNwcml0ZT4gdG9ydXMuZ2V0TmV3T2JqZWN0KCk7XG5cdFx0dGhpcy5fbWVzaDIgPSA8U3ByaXRlPiBjdWJlLmdldE5ld09iamVjdCgpO1xuXHRcdHRoaXMuX21lc2gyLnggPSAxMzA7XG5cdFx0dGhpcy5fbWVzaDIueiA9IDQwO1xuXG5cdFx0dGhpcy5fdmlldy5zY2VuZS5hZGRDaGlsZCh0aGlzLl9tZXNoKTtcblx0XHR0aGlzLl92aWV3LnNjZW5lLmFkZENoaWxkKHRoaXMuX21lc2gyKTtcblxuXHRcdHRoaXMuX3JhZiA9IG5ldyBSZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZW5kZXIsIHRoaXMpO1xuXHRcdHRoaXMuX3JhZi5zdGFydCgpO1xuXG5cdFx0d2luZG93Lm9ucmVzaXplID0gKGV2ZW50OlVJRXZlbnQpID0+IHRoaXMub25SZXNpemUoZXZlbnQpO1xuXG5cdFx0dGhpcy5vblJlc2l6ZSgpO1xuXHR9XG5cblx0cHVibGljIHJlbmRlcihkdDpudW1iZXIgPSBudWxsKTp2b2lkXG5cdHtcblxuXHRcdHRoaXMuX3ZpZXcuY2FtZXJhLnRyYW5zZm9ybS5yb3RhdGUodGhpcy5fY2FtZXJhQXhpcywgMSk7XG5cdFx0dGhpcy5fbWVzaC5yb3RhdGlvblkgKz0gMTtcblx0XHR0aGlzLl9tZXNoMi5yb3RhdGlvblggKz0gMC40O1xuXHRcdHRoaXMuX21lc2gyLnJvdGF0aW9uWSArPSAwLjQ7XG5cdFx0dGhpcy5fdmlldy5yZW5kZXIoKTtcblx0fVxuXG5cdHB1YmxpYyBvblJlc2l6ZShldmVudDpVSUV2ZW50ID0gbnVsbClcblx0e1xuXHRcdHRoaXMuX3ZpZXcueSA9IDA7XG5cdFx0dGhpcy5fdmlldy54ID0gMDtcblxuXHRcdHRoaXMuX3ZpZXcud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR0aGlzLl92aWV3LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0fVxufSJdLCJzb3VyY2VSb290IjoiLi90ZXN0cyJ9
