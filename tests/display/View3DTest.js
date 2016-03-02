var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var Debug = require("awayjs-core/lib/utils/Debug");
var View = require("awayjs-display/lib/View");
var PointLight = require("awayjs-display/lib/display/PointLight");
var ElementsType = require("awayjs-display/lib/graphics/ElementsType");
var PrimitiveTorusPrefab = require("awayjs-display/lib/prefabs/PrimitiveTorusPrefab");
var BasicMaterial = require("awayjs-display/lib/materials/BasicMaterial");
var DefaultRenderer = require("awayjs-renderergl/lib/DefaultRenderer");
var View3DTest = (function () {
    function View3DTest() {
        var _this = this;
        Debug.THROW_ERRORS = false;
        Debug.LOG_PI_ERRORS = false;
        var l = 10;
        var radius = 1000;
        var matB = new BasicMaterial();
        this.meshes = new Array();
        this.light = new PointLight();
        this.view = new View(new DefaultRenderer());
        this.view.camera.z = 0;
        this.view.backgroundColor = 0x776655;
        this.torus = new PrimitiveTorusPrefab(matB, ElementsType.TRIANGLE, 150, 50, 32, 32, false);
        for (var c = 0; c < l; c++) {
            var t = Math.PI * 2 * c / l;
            var mesh = this.torus.getNewObject();
            mesh.x = Math.cos(t) * radius;
            mesh.y = 0;
            mesh.z = Math.sin(t) * radius;
            this.view.scene.addChild(mesh);
            this.meshes.push(mesh);
        }
        this.view.scene.addChild(this.light);
        this.raf = new RequestAnimationFrame(this.tick, this);
        this.raf.start();
        this.resize(null);
        window.onresize = function (e) { return _this.resize(null); };
    }
    View3DTest.prototype.tick = function (e) {
        for (var c = 0; c < this.meshes.length; c++)
            this.meshes[c].rotationY += 2;
        this.view.camera.rotationY += .5;
        this.view.render();
    };
    View3DTest.prototype.resize = function (e) {
        this.view.y = 0;
        this.view.x = 0;
        this.view.width = window.innerWidth;
        this.view.height = window.innerHeight;
    };
    return View3DTest;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpc3BsYXkvVmlldzNEVGVzdC50cyJdLCJuYW1lcyI6WyJWaWV3M0RUZXN0IiwiVmlldzNEVGVzdC5jb25zdHJ1Y3RvciIsIlZpZXczRFRlc3QudGljayIsIlZpZXczRFRlc3QucmVzaXplIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLHFCQUFxQixXQUFZLDZDQUE2QyxDQUFDLENBQUM7QUFDdkYsSUFBTyxLQUFLLFdBQWdCLDZCQUE2QixDQUFDLENBQUM7QUFFM0QsSUFBTyxJQUFJLFdBQWlCLHlCQUF5QixDQUFDLENBQUM7QUFFdkQsSUFBTyxVQUFVLFdBQWUsdUNBQXVDLENBQUMsQ0FBQztBQUN6RSxJQUFPLFlBQVksV0FBZSwwQ0FBMEMsQ0FBQyxDQUFDO0FBQzlFLElBQU8sb0JBQW9CLFdBQWEsaURBQWlELENBQUMsQ0FBQztBQUMzRixJQUFPLGFBQWEsV0FBYyw0Q0FBNEMsQ0FBQyxDQUFDO0FBRWhGLElBQU8sZUFBZSxXQUFjLHVDQUF1QyxDQUFDLENBQUM7QUFFN0UsSUFBTSxVQUFVO0lBU2ZBLFNBVEtBLFVBQVVBO1FBQWhCQyxpQkFrRUNBO1FBdkRDQSxLQUFLQSxDQUFDQSxZQUFZQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUMzQkEsS0FBS0EsQ0FBQ0EsYUFBYUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFFNUJBLElBQUlBLENBQUNBLEdBQVVBLEVBQUVBLENBQUNBO1FBQ2xCQSxJQUFJQSxNQUFNQSxHQUFVQSxJQUFJQSxDQUFDQTtRQUN6QkEsSUFBSUEsSUFBSUEsR0FBaUJBLElBQUlBLGFBQWFBLEVBQUVBLENBQUNBO1FBRTdDQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxLQUFLQSxFQUFVQSxDQUFDQTtRQUNsQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsVUFBVUEsRUFBRUEsQ0FBQ0E7UUFDOUJBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLElBQUlBLGVBQWVBLEVBQUVBLENBQUNBLENBQUNBO1FBQzVDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUN2QkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDckNBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLG9CQUFvQkEsQ0FBQ0EsSUFBSUEsRUFBRUEsWUFBWUEsQ0FBQ0EsUUFBUUEsRUFBRUEsR0FBR0EsRUFBRUEsRUFBRUEsRUFBR0EsRUFBRUEsRUFBR0EsRUFBRUEsRUFBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFFOUZBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQVVBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBRW5DQSxJQUFJQSxDQUFDQSxHQUFRQSxJQUFJQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUVqQ0EsSUFBSUEsSUFBSUEsR0FBbUJBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBO1lBQ3JEQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFDQSxNQUFNQSxDQUFDQTtZQUM1QkEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDWEEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsTUFBTUEsQ0FBQ0E7WUFFNUJBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQy9CQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUV4QkEsQ0FBQ0E7UUFFREEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFFckNBLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLElBQUlBLHFCQUFxQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDdERBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO1FBQ2pCQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFFQSxJQUFJQSxDQUFFQSxDQUFDQTtRQUVwQkEsTUFBTUEsQ0FBQ0EsUUFBUUEsR0FBR0EsVUFBQ0EsQ0FBQ0EsSUFBS0EsT0FBQUEsS0FBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBakJBLENBQWlCQSxDQUFDQTtJQUU1Q0EsQ0FBQ0E7SUFFT0QseUJBQUlBLEdBQVpBLFVBQWFBLENBQUNBO1FBRWJFLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQVVBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBO1lBQ2pEQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxTQUFTQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUUvQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsSUFBSUEsRUFBRUEsQ0FBQ0E7UUFDakNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO0lBQ3BCQSxDQUFDQTtJQUVNRiwyQkFBTUEsR0FBYkEsVUFBY0EsQ0FBQ0E7UUFFZEcsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDaEJBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBRWhCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQTtRQUNwQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7SUFDdkNBLENBQUNBO0lBQ0ZILGlCQUFDQTtBQUFEQSxDQWxFQSxBQWtFQ0EsSUFBQSIsImZpbGUiOiJkaXNwbGF5L1ZpZXczRFRlc3QuanMiLCJzb3VyY2VSb290IjoiLi90ZXN0cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL1JlcXVlc3RBbmltYXRpb25GcmFtZVwiKTtcbmltcG9ydCBEZWJ1Z1x0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9EZWJ1Z1wiKTtcblxuaW1wb3J0IFZpZXdcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9WaWV3XCIpO1xuaW1wb3J0IFNwcml0ZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9kaXNwbGF5L1Nwcml0ZVwiKTtcbmltcG9ydCBQb2ludExpZ2h0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9kaXNwbGF5L1BvaW50TGlnaHRcIik7XG5pbXBvcnQgRWxlbWVudHNUeXBlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9ncmFwaGljcy9FbGVtZW50c1R5cGVcIik7XG5pbXBvcnQgUHJpbWl0aXZlVG9ydXNQcmVmYWJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcHJlZmFicy9QcmltaXRpdmVUb3J1c1ByZWZhYlwiKTtcbmltcG9ydCBCYXNpY01hdGVyaWFsXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL0Jhc2ljTWF0ZXJpYWxcIik7XG5cbmltcG9ydCBEZWZhdWx0UmVuZGVyZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9EZWZhdWx0UmVuZGVyZXJcIik7XG5cbmNsYXNzIFZpZXczRFRlc3Rcbntcblx0cHJpdmF0ZSB2aWV3OlZpZXc7XG5cdHByaXZhdGUgdG9ydXM6UHJpbWl0aXZlVG9ydXNQcmVmYWI7XG5cblx0cHJpdmF0ZSBsaWdodDpQb2ludExpZ2h0O1xuXHRwcml2YXRlIHJhZjpSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cdHByaXZhdGUgbWVzaGVzOkFycmF5PFNwcml0ZT47XG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0RGVidWcuVEhST1dfRVJST1JTID0gZmFsc2U7XG5cdFx0RGVidWcuTE9HX1BJX0VSUk9SUyA9IGZhbHNlO1xuXG5cdFx0dmFyIGw6bnVtYmVyID0gMTA7XG5cdFx0dmFyIHJhZGl1czpudW1iZXIgPSAxMDAwO1xuXHRcdHZhciBtYXRCOkJhc2ljTWF0ZXJpYWwgPSBuZXcgQmFzaWNNYXRlcmlhbCgpO1xuXG5cdFx0dGhpcy5tZXNoZXMgPSBuZXcgQXJyYXk8U3ByaXRlPigpO1xuXHRcdHRoaXMubGlnaHQgPSBuZXcgUG9pbnRMaWdodCgpO1xuXHRcdHRoaXMudmlldyA9IG5ldyBWaWV3KG5ldyBEZWZhdWx0UmVuZGVyZXIoKSk7XG5cdFx0dGhpcy52aWV3LmNhbWVyYS56ID0gMDtcblx0XHR0aGlzLnZpZXcuYmFja2dyb3VuZENvbG9yID0gMHg3NzY2NTU7XG5cdFx0dGhpcy50b3J1cyA9IG5ldyBQcmltaXRpdmVUb3J1c1ByZWZhYihtYXRCLCBFbGVtZW50c1R5cGUuVFJJQU5HTEUsIDE1MCwgNTAgLCAzMiAsIDMyICwgZmFsc2UpO1xuXG5cdFx0Zm9yICh2YXIgYzpudW1iZXIgPSAwOyBjIDwgbDsgYysrKSB7XG5cblx0XHRcdHZhciB0Om51bWJlcj1NYXRoLlBJICogMiAqIGMgLyBsO1xuXG5cdFx0XHR2YXIgbWVzaDpTcHJpdGUgPSA8U3ByaXRlPiB0aGlzLnRvcnVzLmdldE5ld09iamVjdCgpO1xuXHRcdFx0bWVzaC54ID0gTWF0aC5jb3ModCkqcmFkaXVzO1xuXHRcdFx0bWVzaC55ID0gMDtcblx0XHRcdG1lc2gueiA9IE1hdGguc2luKHQpKnJhZGl1cztcblxuXHRcdFx0dGhpcy52aWV3LnNjZW5lLmFkZENoaWxkKG1lc2gpO1xuXHRcdFx0dGhpcy5tZXNoZXMucHVzaChtZXNoKTtcblxuXHRcdH1cblxuXHRcdHRoaXMudmlldy5zY2VuZS5hZGRDaGlsZCh0aGlzLmxpZ2h0KTtcblxuXHRcdHRoaXMucmFmID0gbmV3IFJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2ssIHRoaXMpO1xuXHRcdHRoaXMucmFmLnN0YXJ0KCk7XG5cdFx0dGhpcy5yZXNpemUoIG51bGwgKTtcblxuXHRcdHdpbmRvdy5vbnJlc2l6ZSA9IChlKSA9PiB0aGlzLnJlc2l6ZShudWxsKTtcblxuXHR9XG5cblx0cHJpdmF0ZSB0aWNrKGUpXG5cdHtcblx0XHRmb3IgKHZhciBjOm51bWJlciA9IDA7IGMgPCB0aGlzLm1lc2hlcy5sZW5ndGg7IGMrKylcblx0XHRcdHRoaXMubWVzaGVzW2NdLnJvdGF0aW9uWSArPSAyO1xuXG5cdFx0dGhpcy52aWV3LmNhbWVyYS5yb3RhdGlvblkgKz0gLjU7XG5cdFx0dGhpcy52aWV3LnJlbmRlcigpO1xuXHR9XG5cblx0cHVibGljIHJlc2l6ZShlKVxuXHR7XG5cdFx0dGhpcy52aWV3LnkgPSAwO1xuXHRcdHRoaXMudmlldy54ID0gMDtcblxuXHRcdHRoaXMudmlldy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdHRoaXMudmlldy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdH1cbn0iXX0=