var BlendMode = require("awayjs-core/lib/image/BlendMode");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var URLLoader = require("awayjs-core/lib/net/URLLoader");
var URLLoaderDataFormat = require("awayjs-core/lib/net/URLLoaderDataFormat");
var URLRequest = require("awayjs-core/lib/net/URLRequest");
var URLLoaderEvent = require("awayjs-core/lib/events/URLLoaderEvent");
var ParserUtils = require("awayjs-core/lib/parsers/ParserUtils");
var PerspectiveProjection = require("awayjs-core/lib/projections/PerspectiveProjection");
var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var Debug = require("awayjs-core/lib/utils/Debug");
var View = require("awayjs-display/lib/containers/View");
var BasicMaterial = require("awayjs-display/lib/materials/BasicMaterial");
var PrimitiveCubePrefab = require("awayjs-display/lib/prefabs/PrimitiveCubePrefab");
var PrimitiveTorusPrefab = require("awayjs-display/lib/prefabs/PrimitiveTorusPrefab");
var DefaultRenderer = require("awayjs-renderergl/lib/DefaultRenderer");
var ElementsType = require("awayjs-display/lib/graphics/ElementsType");
var TorusVortex = (function () {
    function TorusVortex() {
        Debug.THROW_ERRORS = false;
        this._view = new View(new DefaultRenderer());
        this._view.backgroundColor = 0x000000;
        this._view.camera.x = 130;
        this._view.camera.y = 0;
        this._view.camera.z = 0;
        this._cameraAxis = new Vector3D(0, 0, 1);
        this._view.camera.projection = new PerspectiveProjection(120);
        this._view.camera.projection.near = 0.1;
        this.loadResources();
    }
    TorusVortex.prototype.loadResources = function () {
        var _this = this;
        var urlRequest = new URLRequest("assets/130909wall_big.png");
        var urlLoader = new URLLoader();
        urlLoader.dataFormat = URLLoaderDataFormat.BLOB;
        urlLoader.addEventListener(URLLoaderEvent.LOAD_COMPLETE, function (event) { return _this.imageCompleteHandler(event); });
        urlLoader.load(urlRequest);
    };
    TorusVortex.prototype.imageCompleteHandler = function (event) {
        var _this = this;
        var imageLoader = event.target;
        this._image = ParserUtils.blobToImage(imageLoader.data);
        this._image.onload = function (event) { return _this.onLoadComplete(event); };
    };
    TorusVortex.prototype.onLoadComplete = function (event) {
        var _this = this;
        var matTx = new BasicMaterial(ParserUtils.imageToBitmapImage2D(this._image));
        matTx.blendMode = BlendMode.ADD;
        matTx.bothSides = true;
        var cube = new PrimitiveCubePrefab(matTx, ElementsType.TRIANGLE, 20.0, 20.0, 20.0);
        var torus = new PrimitiveTorusPrefab(matTx, ElementsType.TRIANGLE, 150, 80, 32, 16, true);
        this._mesh = torus.getNewObject();
        this._mesh2 = cube.getNewObject();
        this._mesh2.x = 130;
        this._mesh2.z = 40;
        this._view.scene.addChild(this._mesh);
        this._view.scene.addChild(this._mesh2);
        this._raf = new RequestAnimationFrame(this.render, this);
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
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9iamVjdDNkL1RvcnVzVm9ydGV4LnRzIl0sIm5hbWVzIjpbIlRvcnVzVm9ydGV4IiwiVG9ydXNWb3J0ZXguY29uc3RydWN0b3IiLCJUb3J1c1ZvcnRleC5sb2FkUmVzb3VyY2VzIiwiVG9ydXNWb3J0ZXguaW1hZ2VDb21wbGV0ZUhhbmRsZXIiLCJUb3J1c1ZvcnRleC5vbkxvYWRDb21wbGV0ZSIsIlRvcnVzVm9ydGV4LnJlbmRlciIsIlRvcnVzVm9ydGV4Lm9uUmVzaXplIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLFNBQVMsV0FBZSxpQ0FBaUMsQ0FBQyxDQUFDO0FBQ2xFLElBQU8sUUFBUSxXQUFnQiwrQkFBK0IsQ0FBQyxDQUFDO0FBQ2hFLElBQU8sU0FBUyxXQUFlLCtCQUErQixDQUFDLENBQUM7QUFDaEUsSUFBTyxtQkFBbUIsV0FBYSx5Q0FBeUMsQ0FBQyxDQUFDO0FBQ2xGLElBQU8sVUFBVSxXQUFlLGdDQUFnQyxDQUFDLENBQUM7QUFDbEUsSUFBTyxjQUFjLFdBQWMsdUNBQXVDLENBQUMsQ0FBQztBQUM1RSxJQUFPLFdBQVcsV0FBZSxxQ0FBcUMsQ0FBQyxDQUFDO0FBQ3hFLElBQU8scUJBQXFCLFdBQVksbURBQW1ELENBQUMsQ0FBQztBQUM3RixJQUFPLHFCQUFxQixXQUFZLDZDQUE2QyxDQUFDLENBQUM7QUFDdkYsSUFBTyxLQUFLLFdBQWdCLDZCQUE2QixDQUFDLENBQUM7QUFFM0QsSUFBTyxJQUFJLFdBQWlCLG9DQUFvQyxDQUFDLENBQUM7QUFFbEUsSUFBTyxhQUFhLFdBQWMsNENBQTRDLENBQUMsQ0FBQztBQUNoRixJQUFPLG1CQUFtQixXQUFhLGdEQUFnRCxDQUFDLENBQUM7QUFDekYsSUFBTyxvQkFBb0IsV0FBYSxpREFBaUQsQ0FBQyxDQUFDO0FBRzNGLElBQU8sZUFBZSxXQUFjLHVDQUF1QyxDQUFDLENBQUM7QUFDN0UsSUFBTyxZQUFZLFdBQVcsMENBQTBDLENBQUMsQ0FBQztBQUUxRSxJQUFNLFdBQVc7SUFVaEJBLFNBVktBLFdB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QWhCQSxTQUFnQkE7UUFHN0JBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1FBQ3hEQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxTQUFTQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsSUFBSUEsR0FBR0EsQ0FBQ0E7UUFDN0JBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLElBQUlBLEdBQUdBLENBQUNBO1FBQzdCQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtJQUNyQkEsQ0FBQ0E7SUFFTUwsOEJBQVFBLEdBQWZBLFVBQWdCQSxLQUFvQkE7UUFBcEJNLHFCQUFvQkEsR0FBcEJBLFlBQW9CQTtRQUVuQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDakJBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBRWpCQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxHQUFHQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQTtRQUNyQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7SUFDeENBLENBQUNBO0lBQ0ZOLGtCQUFDQTtBQUFEQSxDQXhGQSxBQXdGQ0EsSUFBQSIsImZpbGUiOiJvYmplY3QzZC9Ub3J1c1ZvcnRleC5qcyIsInNvdXJjZVJvb3QiOiIuL3Rlc3RzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJsZW5kTW9kZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvaW1hZ2UvQmxlbmRNb2RlXCIpO1xuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIik7XG5pbXBvcnQgVVJMTG9hZGVyXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMTG9hZGVyXCIpO1xuaW1wb3J0IFVSTExvYWRlckRhdGFGb3JtYXRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTExvYWRlckRhdGFGb3JtYXRcIik7XG5pbXBvcnQgVVJMUmVxdWVzdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTFJlcXVlc3RcIik7XG5pbXBvcnQgVVJMTG9hZGVyRXZlbnRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9ldmVudHMvVVJMTG9hZGVyRXZlbnRcIik7XG5pbXBvcnQgUGFyc2VyVXRpbHNcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3BhcnNlcnMvUGFyc2VyVXRpbHNcIik7XG5pbXBvcnQgUGVyc3BlY3RpdmVQcm9qZWN0aW9uXHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wcm9qZWN0aW9ucy9QZXJzcGVjdGl2ZVByb2plY3Rpb25cIik7XG5pbXBvcnQgUmVxdWVzdEFuaW1hdGlvbkZyYW1lXHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9SZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIik7XG5pbXBvcnQgRGVidWdcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdXRpbHMvRGVidWdcIik7XG5cbmltcG9ydCBWaWV3XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvY29udGFpbmVycy9WaWV3XCIpO1xuaW1wb3J0IE1lc2hcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9NZXNoXCIpO1xuaW1wb3J0IEJhc2ljTWF0ZXJpYWxcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9tYXRlcmlhbHMvQmFzaWNNYXRlcmlhbFwiKTtcbmltcG9ydCBQcmltaXRpdmVDdWJlUHJlZmFiXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlQ3ViZVByZWZhYlwiKTtcbmltcG9ydCBQcmltaXRpdmVUb3J1c1ByZWZhYlx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wcmVmYWJzL1ByaW1pdGl2ZVRvcnVzUHJlZmFiXCIpO1xuaW1wb3J0IFNpbmdsZTJEVGV4dHVyZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3RleHR1cmVzL1NpbmdsZTJEVGV4dHVyZVwiKTtcblxuaW1wb3J0IERlZmF1bHRSZW5kZXJlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL0RlZmF1bHRSZW5kZXJlclwiKTtcbmltcG9ydCBFbGVtZW50c1R5cGUgPSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2dyYXBoaWNzL0VsZW1lbnRzVHlwZVwiKTtcblxuY2xhc3MgVG9ydXNWb3J0ZXhcbntcblx0cHJpdmF0ZSBfdmlldzpWaWV3O1xuXHRwcml2YXRlIF9tZXNoOk1lc2g7XG5cdHByaXZhdGUgX21lc2gyOk1lc2g7XG5cblx0cHJpdmF0ZSBfcmFmOlJlcXVlc3RBbmltYXRpb25GcmFtZTtcblx0cHJpdmF0ZSBfaW1hZ2U6SFRNTEltYWdlRWxlbWVudDtcblx0cHJpdmF0ZSBfY2FtZXJhQXhpczpWZWN0b3IzRDtcblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHREZWJ1Zy5USFJPV19FUlJPUlMgPSBmYWxzZTtcblxuXHRcdHRoaXMuX3ZpZXcgPSBuZXcgVmlldyhuZXcgRGVmYXVsdFJlbmRlcmVyKCkpO1xuXG5cdFx0dGhpcy5fdmlldy5iYWNrZ3JvdW5kQ29sb3IgPSAweDAwMDAwMDtcblx0XHR0aGlzLl92aWV3LmNhbWVyYS54ID0gMTMwO1xuXHRcdHRoaXMuX3ZpZXcuY2FtZXJhLnkgPSAwO1xuXHRcdHRoaXMuX3ZpZXcuY2FtZXJhLnogPSAwO1xuXHRcdHRoaXMuX2NhbWVyYUF4aXMgPSBuZXcgVmVjdG9yM0QoMCwgMCwgMSk7XG5cblx0XHR0aGlzLl92aWV3LmNhbWVyYS5wcm9qZWN0aW9uID0gbmV3IFBlcnNwZWN0aXZlUHJvamVjdGlvbigxMjApO1xuXHRcdHRoaXMuX3ZpZXcuY2FtZXJhLnByb2plY3Rpb24ubmVhciA9IDAuMTtcblxuXHRcdHRoaXMubG9hZFJlc291cmNlcygpO1xuXHR9XG5cblx0cHJpdmF0ZSBsb2FkUmVzb3VyY2VzKClcblx0e1xuXHRcdHZhciB1cmxSZXF1ZXN0OlVSTFJlcXVlc3QgPSBuZXcgVVJMUmVxdWVzdCggXCJhc3NldHMvMTMwOTA5d2FsbF9iaWcucG5nXCIgKTtcblx0XHR2YXIgdXJsTG9hZGVyOlVSTExvYWRlciA9IG5ldyBVUkxMb2FkZXIoKTtcblx0XHR1cmxMb2FkZXIuZGF0YUZvcm1hdCA9IFVSTExvYWRlckRhdGFGb3JtYXQuQkxPQjtcblx0XHR1cmxMb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcihVUkxMb2FkZXJFdmVudC5MT0FEX0NPTVBMRVRFLCAoZXZlbnQ6VVJMTG9hZGVyRXZlbnQpID0+IHRoaXMuaW1hZ2VDb21wbGV0ZUhhbmRsZXIoZXZlbnQpKTtcblx0XHR1cmxMb2FkZXIubG9hZCh1cmxSZXF1ZXN0KTtcblx0fVxuXG5cdHByaXZhdGUgaW1hZ2VDb21wbGV0ZUhhbmRsZXIoZXZlbnQ6VVJMTG9hZGVyRXZlbnQpXG5cdHtcblx0XHR2YXIgaW1hZ2VMb2FkZXI6VVJMTG9hZGVyID0gPFVSTExvYWRlcj4gZXZlbnQudGFyZ2V0O1xuXHRcdHRoaXMuX2ltYWdlID0gUGFyc2VyVXRpbHMuYmxvYlRvSW1hZ2UoaW1hZ2VMb2FkZXIuZGF0YSk7XG5cdFx0dGhpcy5faW1hZ2Uub25sb2FkID0gKGV2ZW50KSA9PiB0aGlzLm9uTG9hZENvbXBsZXRlKGV2ZW50KTtcblx0fVxuXG5cdHByaXZhdGUgb25Mb2FkQ29tcGxldGUoZXZlbnQpXG5cdHtcblx0XHR2YXIgbWF0VHg6QmFzaWNNYXRlcmlhbCA9IG5ldyBCYXNpY01hdGVyaWFsKFBhcnNlclV0aWxzLmltYWdlVG9CaXRtYXBJbWFnZTJEKHRoaXMuX2ltYWdlKSk7XG5cblx0XHRtYXRUeC5ibGVuZE1vZGUgPSBCbGVuZE1vZGUuQUREO1xuXHRcdG1hdFR4LmJvdGhTaWRlcyA9IHRydWU7XG5cblx0XHR2YXIgY3ViZTpQcmltaXRpdmVDdWJlUHJlZmFiID0gbmV3IFByaW1pdGl2ZUN1YmVQcmVmYWIobWF0VHgsIEVsZW1lbnRzVHlwZS5UUklBTkdMRSwgMjAuMCwgMjAuMCwgMjAuMCk7XG5cdFx0dmFyIHRvcnVzOlByaW1pdGl2ZVRvcnVzUHJlZmFiID0gbmV3IFByaW1pdGl2ZVRvcnVzUHJlZmFiKG1hdFR4LCBFbGVtZW50c1R5cGUuVFJJQU5HTEUsIDE1MCwgODAsIDMyLCAxNiwgdHJ1ZSk7XG5cblx0XHR0aGlzLl9tZXNoID0gPE1lc2g+IHRvcnVzLmdldE5ld09iamVjdCgpO1xuXHRcdHRoaXMuX21lc2gyID0gPE1lc2g+IGN1YmUuZ2V0TmV3T2JqZWN0KCk7XG5cdFx0dGhpcy5fbWVzaDIueCA9IDEzMDtcblx0XHR0aGlzLl9tZXNoMi56ID0gNDA7XG5cblx0XHR0aGlzLl92aWV3LnNjZW5lLmFkZENoaWxkKHRoaXMuX21lc2gpO1xuXHRcdHRoaXMuX3ZpZXcuc2NlbmUuYWRkQ2hpbGQodGhpcy5fbWVzaDIpO1xuXG5cdFx0dGhpcy5fcmFmID0gbmV3IFJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlbmRlciwgdGhpcyk7XG5cdFx0dGhpcy5fcmFmLnN0YXJ0KCk7XG5cblx0XHR3aW5kb3cub25yZXNpemUgPSAoZXZlbnQ6VUlFdmVudCkgPT4gdGhpcy5vblJlc2l6ZShldmVudCk7XG5cblx0XHR0aGlzLm9uUmVzaXplKCk7XG5cdH1cblxuXHRwdWJsaWMgcmVuZGVyKGR0Om51bWJlciA9IG51bGwpOnZvaWRcblx0e1xuXG5cdFx0dGhpcy5fdmlldy5jYW1lcmEudHJhbnNmb3JtLnJvdGF0ZSh0aGlzLl9jYW1lcmFBeGlzLCAxKTtcblx0XHR0aGlzLl9tZXNoLnJvdGF0aW9uWSArPSAxO1xuXHRcdHRoaXMuX21lc2gyLnJvdGF0aW9uWCArPSAwLjQ7XG5cdFx0dGhpcy5fbWVzaDIucm90YXRpb25ZICs9IDAuNDtcblx0XHR0aGlzLl92aWV3LnJlbmRlcigpO1xuXHR9XG5cblx0cHVibGljIG9uUmVzaXplKGV2ZW50OlVJRXZlbnQgPSBudWxsKVxuXHR7XG5cdFx0dGhpcy5fdmlldy55ID0gMDtcblx0XHR0aGlzLl92aWV3LnggPSAwO1xuXG5cdFx0dGhpcy5fdmlldy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdHRoaXMuX3ZpZXcuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHR9XG59Il19