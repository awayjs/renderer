var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var Debug = require("awayjs-core/lib/utils/Debug");
var View = require("awayjs-display/lib/containers/View");
var PrimitivePolygonPrefab = require("awayjs-display/lib/prefabs/PrimitivePolygonPrefab");
var PrimitiveConePrefab = require("awayjs-display/lib/prefabs/PrimitiveConePrefab");
var PrimitiveCubePrefab = require("awayjs-display/lib/prefabs/PrimitiveCubePrefab");
var PrimitiveCylinderPrefab = require("awayjs-display/lib/prefabs/PrimitiveCylinderPrefab");
var PrimitivePlanePrefab = require("awayjs-display/lib/prefabs/PrimitivePlanePrefab");
var PrimitiveSpherePrefab = require("awayjs-display/lib/prefabs/PrimitiveSpherePrefab");
var DefaultRenderer = require("awayjs-renderergl/lib/DefaultRenderer");
var ElementsType = require("awayjs-display/lib/graphics/ElementsType");
var WireframePrimitiveTest = (function () {
    function WireframePrimitiveTest() {
        var _this = this;
        this.meshes = new Array();
        this.radius = 400;
        Debug.LOG_PI_ERRORS = false;
        Debug.THROW_ERRORS = false;
        this.view = new View(new DefaultRenderer());
        this.raf = new RequestAnimationFrame(this.render, this);
        this.view.backgroundColor = 0x222222;
        window.onresize = function (event) { return _this.onResize(event); };
        this.initMeshes();
        this.raf.start();
        this.onResize();
    }
    WireframePrimitiveTest.prototype.initMeshes = function () {
        var primitives = new Array();
        primitives.push(new PrimitivePolygonPrefab(null, ElementsType.LINE));
        primitives.push(new PrimitiveSpherePrefab(null, ElementsType.LINE));
        primitives.push(new PrimitiveSpherePrefab(null, ElementsType.LINE));
        primitives.push(new PrimitiveCylinderPrefab(null, ElementsType.LINE));
        primitives.push(new PrimitivePlanePrefab(null, ElementsType.LINE));
        primitives.push(new PrimitiveConePrefab(null, ElementsType.LINE));
        primitives.push(new PrimitiveCubePrefab(null, ElementsType.LINE));
        var mesh;
        for (var c = 0; c < primitives.length; c++) {
            var t = Math.PI * 2 * c / primitives.length;
            mesh = primitives[c].getNewObject();
            mesh.x = Math.cos(t) * this.radius;
            mesh.y = Math.sin(t) * this.radius;
            mesh.z = 0;
            mesh.transform.scaleTo(2, 2, 2);
            this.view.scene.addChild(mesh);
            this.meshes.push(mesh);
        }
    };
    WireframePrimitiveTest.prototype.render = function () {
        if (this.meshes)
            for (var c = 0; c < this.meshes.length; c++)
                this.meshes[c].rotationY += 1;
        this.view.render();
    };
    WireframePrimitiveTest.prototype.onResize = function (event) {
        if (event === void 0) { event = null; }
        this.view.y = 0;
        this.view.x = 0;
        this.view.width = window.innerWidth;
        this.view.height = window.innerHeight;
    };
    return WireframePrimitiveTest;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW1pdGl2ZXMvV2lyZWZyYW1lUHJpbWl0aXZlVGVzdC50cyJdLCJuYW1lcyI6WyJXaXJlZnJhbWVQcmltaXRpdmVUZXN0IiwiV2lyZWZyYW1lUHJpbWl0aXZlVGVzdC5jb25zdHJ1Y3RvciIsIldpcmVmcmFtZVByaW1pdGl2ZVRlc3QuaW5pdE1lc2hlcyIsIldpcmVmcmFtZVByaW1pdGl2ZVRlc3QucmVuZGVyIiwiV2lyZWZyYW1lUHJpbWl0aXZlVGVzdC5vblJlc2l6ZSJdLCJtYXBwaW5ncyI6IkFBQ0EsSUFBTyxxQkFBcUIsV0FBWSw2Q0FBNkMsQ0FBQyxDQUFDO0FBQ3ZGLElBQU8sS0FBSyxXQUFnQiw2QkFBNkIsQ0FBQyxDQUFDO0FBRTNELElBQU8sSUFBSSxXQUFpQixvQ0FBb0MsQ0FBQyxDQUFDO0FBR2xFLElBQU8sc0JBQXNCLFdBQVksbURBQW1ELENBQUMsQ0FBQztBQUM5RixJQUFPLG1CQUFtQixXQUFhLGdEQUFnRCxDQUFDLENBQUM7QUFDekYsSUFBTyxtQkFBbUIsV0FBYSxnREFBZ0QsQ0FBQyxDQUFDO0FBQ3pGLElBQU8sdUJBQXVCLFdBQVksb0RBQW9ELENBQUMsQ0FBQztBQUNoRyxJQUFPLG9CQUFvQixXQUFhLGlEQUFpRCxDQUFDLENBQUM7QUFDM0YsSUFBTyxxQkFBcUIsV0FBWSxrREFBa0QsQ0FBQyxDQUFDO0FBRTVGLElBQU8sZUFBZSxXQUFjLHVDQUF1QyxDQUFDLENBQUM7QUFDN0UsSUFBTyxZQUFZLFdBQVcsMENBQTBDLENBQUMsQ0FBQztBQUUxRSxJQUFNLHNCQUFzQjtJQVEzQkEsU0FSS0Esc0JBQXNCQTtRQUE1QkMsaUJBd0VDQTtRQXBFUUEsV0FBTUEsR0FBZUEsSUFBSUEsS0FBS0EsRUFBUUEsQ0FBQ0E7UUFFdkNBLFdBQU1BLEdBQVVBLEdBQUdBLENBQUNBO1FBSTNCQSxLQUFLQSxDQUFDQSxhQUFhQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUM1QkEsS0FBS0EsQ0FBQ0EsWUFBWUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFFM0JBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLElBQUlBLGVBQWVBLEVBQUVBLENBQUNBLENBQUNBO1FBQzVDQSxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxJQUFJQSxxQkFBcUJBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1FBRXhEQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUVyQ0EsTUFBTUEsQ0FBQ0EsUUFBUUEsR0FBR0EsVUFBQ0EsS0FBYUEsSUFBS0EsT0FBQUEsS0FBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsRUFBcEJBLENBQW9CQSxDQUFDQTtRQUUxREEsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7UUFDbEJBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO1FBQ2pCQSxJQUFJQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTtJQUNqQkEsQ0FBQ0E7SUFFT0QsMkNBQVVBLEdBQWxCQTtRQUdDRSxJQUFJQSxVQUFVQSxHQUE4QkEsSUFBSUEsS0FBS0EsRUFBdUJBLENBQUNBO1FBQzdFQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxzQkFBc0JBLENBQUNBLElBQUlBLEVBQUVBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1FBQ3JFQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxxQkFBcUJBLENBQUNBLElBQUlBLEVBQUVBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1FBQ3BFQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxxQkFBcUJBLENBQUNBLElBQUlBLEVBQUVBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1FBQ3BFQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSx1QkFBdUJBLENBQUNBLElBQUlBLEVBQUVBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1FBQ3RFQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxvQkFBb0JBLENBQUNBLElBQUlBLEVBQUVBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1FBQ25FQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxtQkFBbUJBLENBQUNBLElBQUlBLEVBQUVBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1FBQ2xFQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxtQkFBbUJBLENBQUNBLElBQUlBLEVBQUVBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1FBRWxFQSxJQUFJQSxJQUFTQSxDQUFDQTtRQUVkQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxVQUFVQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUNuREEsSUFBSUEsQ0FBQ0EsR0FBVUEsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBQ0EsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsR0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFFN0NBLElBQUlBLEdBQVVBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBO1lBQzNDQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUNqQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFDakNBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ1hBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1lBRWhDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUMvQkEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDeEJBLENBQUNBO0lBR0ZBLENBQUNBO0lBRU9GLHVDQUFNQSxHQUFkQTtRQUVDRyxFQUFFQSxDQUFBQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUNkQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQTtnQkFDakRBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFNBQVNBLElBQUlBLENBQUNBLENBQUNBO1FBRWhDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtJQUNwQkEsQ0FBQ0E7SUFFTUgseUNBQVFBLEdBQWZBLFVBQWdCQSxLQUFvQkE7UUFBcEJJLHFCQUFvQkEsR0FBcEJBLFlBQW9CQTtRQUVuQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDaEJBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBRWhCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQTtRQUNwQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7SUFDdkNBLENBQUNBO0lBQ0ZKLDZCQUFDQTtBQUFEQSxDQXhFQSxBQXdFQ0EsSUFBQSIsImZpbGUiOiJwcmltaXRpdmVzL1dpcmVmcmFtZVByaW1pdGl2ZVRlc3QuanMiLCJzb3VyY2VSb290IjoiLi90ZXN0cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWZWN0b3IzRFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1ZlY3RvcjNEXCIpO1xuaW1wb3J0IFJlcXVlc3RBbmltYXRpb25GcmFtZVx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdXRpbHMvUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCIpO1xuaW1wb3J0IERlYnVnXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL0RlYnVnXCIpO1xuXG5pbXBvcnQgVmlld1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2NvbnRhaW5lcnMvVmlld1wiKTtcbmltcG9ydCBNZXNoXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvTWVzaFwiKTtcbmltcG9ydCBQcmltaXRpdmVQcmVmYWJCYXNlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlUHJlZmFiQmFzZVwiKTtcbmltcG9ydCBQcmltaXRpdmVQb2x5Z29uUHJlZmFiXHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wcmVmYWJzL1ByaW1pdGl2ZVBvbHlnb25QcmVmYWJcIik7XG5pbXBvcnQgUHJpbWl0aXZlQ29uZVByZWZhYlx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wcmVmYWJzL1ByaW1pdGl2ZUNvbmVQcmVmYWJcIik7XG5pbXBvcnQgUHJpbWl0aXZlQ3ViZVByZWZhYlx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wcmVmYWJzL1ByaW1pdGl2ZUN1YmVQcmVmYWJcIik7XG5pbXBvcnQgUHJpbWl0aXZlQ3lsaW5kZXJQcmVmYWJcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlQ3lsaW5kZXJQcmVmYWJcIik7XG5pbXBvcnQgUHJpbWl0aXZlUGxhbmVQcmVmYWJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcHJlZmFicy9QcmltaXRpdmVQbGFuZVByZWZhYlwiKTtcbmltcG9ydCBQcmltaXRpdmVTcGhlcmVQcmVmYWJcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlU3BoZXJlUHJlZmFiXCIpO1xuXG5pbXBvcnQgRGVmYXVsdFJlbmRlcmVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvRGVmYXVsdFJlbmRlcmVyXCIpO1xuaW1wb3J0IEVsZW1lbnRzVHlwZSA9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZ3JhcGhpY3MvRWxlbWVudHNUeXBlXCIpO1xuXG5jbGFzcyBXaXJlZnJhbWVQcmltaXRpdmVUZXN0XG57XG5cdHByaXZhdGUgdmlldzpWaWV3O1xuXHRwcml2YXRlIHJhZjpSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cdHByaXZhdGUgbWVzaGVzOkFycmF5PE1lc2g+ID0gbmV3IEFycmF5PE1lc2g+KCk7XG5cblx0cHJpdmF0ZSByYWRpdXM6bnVtYmVyID0gNDAwO1xuXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdERlYnVnLkxPR19QSV9FUlJPUlMgPSBmYWxzZTtcblx0XHREZWJ1Zy5USFJPV19FUlJPUlMgPSBmYWxzZTtcblxuXHRcdHRoaXMudmlldyA9IG5ldyBWaWV3KG5ldyBEZWZhdWx0UmVuZGVyZXIoKSk7XG5cdFx0dGhpcy5yYWYgPSBuZXcgUmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVuZGVyLCB0aGlzKTtcblxuXHRcdHRoaXMudmlldy5iYWNrZ3JvdW5kQ29sb3IgPSAweDIyMjIyMjtcblxuXHRcdHdpbmRvdy5vbnJlc2l6ZSA9IChldmVudDpVSUV2ZW50KSA9PiB0aGlzLm9uUmVzaXplKGV2ZW50KTtcblxuXHRcdHRoaXMuaW5pdE1lc2hlcygpO1xuXHRcdHRoaXMucmFmLnN0YXJ0KCk7XG5cdFx0dGhpcy5vblJlc2l6ZSgpO1xuXHR9XG5cblx0cHJpdmF0ZSBpbml0TWVzaGVzKCk6dm9pZFxuXHR7XG5cblx0XHR2YXIgcHJpbWl0aXZlczpBcnJheTxQcmltaXRpdmVQcmVmYWJCYXNlPiA9IG5ldyBBcnJheTxQcmltaXRpdmVQcmVmYWJCYXNlPigpO1xuXHRcdHByaW1pdGl2ZXMucHVzaChuZXcgUHJpbWl0aXZlUG9seWdvblByZWZhYihudWxsLCBFbGVtZW50c1R5cGUuTElORSkpO1xuXHRcdHByaW1pdGl2ZXMucHVzaChuZXcgUHJpbWl0aXZlU3BoZXJlUHJlZmFiKG51bGwsIEVsZW1lbnRzVHlwZS5MSU5FKSk7XG5cdFx0cHJpbWl0aXZlcy5wdXNoKG5ldyBQcmltaXRpdmVTcGhlcmVQcmVmYWIobnVsbCwgRWxlbWVudHNUeXBlLkxJTkUpKTtcblx0XHRwcmltaXRpdmVzLnB1c2gobmV3IFByaW1pdGl2ZUN5bGluZGVyUHJlZmFiKG51bGwsIEVsZW1lbnRzVHlwZS5MSU5FKSk7XG5cdFx0cHJpbWl0aXZlcy5wdXNoKG5ldyBQcmltaXRpdmVQbGFuZVByZWZhYihudWxsLCBFbGVtZW50c1R5cGUuTElORSkpO1xuXHRcdHByaW1pdGl2ZXMucHVzaChuZXcgUHJpbWl0aXZlQ29uZVByZWZhYihudWxsLCBFbGVtZW50c1R5cGUuTElORSkpO1xuXHRcdHByaW1pdGl2ZXMucHVzaChuZXcgUHJpbWl0aXZlQ3ViZVByZWZhYihudWxsLCBFbGVtZW50c1R5cGUuTElORSkpO1xuXG5cdFx0dmFyIG1lc2g6TWVzaDtcblxuXHRcdGZvciAodmFyIGM6bnVtYmVyID0gMDsgYyA8IHByaW1pdGl2ZXMubGVuZ3RoOyBjKyspIHtcblx0XHRcdHZhciB0Om51bWJlciA9IE1hdGguUEkqMipjL3ByaW1pdGl2ZXMubGVuZ3RoO1xuXG5cdFx0XHRtZXNoID0gPE1lc2g+IHByaW1pdGl2ZXNbY10uZ2V0TmV3T2JqZWN0KCk7XG5cdFx0XHRtZXNoLnggPSBNYXRoLmNvcyh0KSp0aGlzLnJhZGl1cztcblx0XHRcdG1lc2gueSA9IE1hdGguc2luKHQpKnRoaXMucmFkaXVzO1xuXHRcdFx0bWVzaC56ID0gMDtcblx0XHRcdG1lc2gudHJhbnNmb3JtLnNjYWxlVG8oMiwgMiwgMik7XG5cblx0XHRcdHRoaXMudmlldy5zY2VuZS5hZGRDaGlsZChtZXNoKTtcblx0XHRcdHRoaXMubWVzaGVzLnB1c2gobWVzaCk7XG5cdFx0fVxuXG5cblx0fVxuXG5cdHByaXZhdGUgcmVuZGVyKClcblx0e1xuXHRcdGlmKHRoaXMubWVzaGVzKVxuXHRcdFx0Zm9yICh2YXIgYzpudW1iZXIgPSAwOyBjIDwgdGhpcy5tZXNoZXMubGVuZ3RoOyBjKyspXG5cdFx0XHRcdHRoaXMubWVzaGVzW2NdLnJvdGF0aW9uWSArPSAxO1xuXG5cdFx0dGhpcy52aWV3LnJlbmRlcigpO1xuXHR9XG5cblx0cHVibGljIG9uUmVzaXplKGV2ZW50OlVJRXZlbnQgPSBudWxsKVxuXHR7XG5cdFx0dGhpcy52aWV3LnkgPSAwO1xuXHRcdHRoaXMudmlldy54ID0gMDtcblxuXHRcdHRoaXMudmlldy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdHRoaXMudmlldy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdH1cbn0iXX0=