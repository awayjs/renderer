///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
    (function (pick) {
        var PickingTests = (function () {
            function PickingTests() {
                away.pick.PickingColliderType.AS3_BEST_HIT;

                this.mesh = new away.entities.Mesh(null);
                this.mesh.x = 10;
                this.mesh.y = 10;
                this.mesh.z = 10;

                this.mesh.ignoreTransform = true;

                this.pickCOllVo = new away.pick.PickingCollisionVO(this.mesh);
                this.pickCBase = new away.pick.PickingColliderBase();
                this.jsPickCollider = new away.pick.JSPickingCollider();

                console.log('away.pick.PickingCollisionVO', this.pickCOllVo);
                console.log('away.pick.PickingColliderBase', this.pickCBase);
                console.log('away.pick.AS3PickingCollider', this.jsPickCollider);
            }
            return PickingTests;
        })();
        pick.PickingTests = PickingTests;
    })(tests.pick || (tests.pick = {}));
    var pick = tests.pick;
})(tests || (tests = {}));
//# sourceMappingURL=PickingTests.js.map
