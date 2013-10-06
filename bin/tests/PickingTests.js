var tests;
(function (tests) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    //<reference path="../../../src/Away3D.ts" />
    (function (pick) {
        var PickingTests = (function () {
            function PickingTests() {
                away.pick.PickingColliderType.AS3_BEST_HIT;

                this.entity = new away.entities.Entity();
                this.entity.x = 10;
                this.entity.y = 10;
                this.entity.z = 10;

                this.entity.getIgnoreTransform();

                this.pickCOllVo = new away.pick.PickingCollisionVO(this.entity);
                this.pickCBase = new away.pick.PickingColliderBase();
                this.as3PickCollider = new away.pick.AS3PickingCollider();

                console.log('away.pick.PickingCollisionVO', this.pickCOllVo);
                console.log('away.pick.PickingColliderBase', this.pickCBase);
                console.log('away.pick.AS3PickingCollider', this.as3PickCollider);
            }
            return PickingTests;
        })();
        pick.PickingTests = PickingTests;
    })(tests.pick || (tests.pick = {}));
    var pick = tests.pick;
})(tests || (tests = {}));
//# sourceMappingURL=PickingTests.js.map
