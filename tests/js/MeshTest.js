var tests;
(function (tests) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    //<reference path="../../../src/Away3D.ts" />
    (function (entities) {
        var MeshTest = (function () {
            function MeshTest() {
                away.Debug.THROW_ERRORS = false;

                this.mat = new away.materials.MaterialBase();
                this.geom = new away.base.Geometry();
                this.mesh = new away.entities.Mesh(this.geom, this.mat);

                console.log('mat', this.mat);
                console.log('geom', this.geom);
                console.log('mesh', this.mesh);

                this.entity = new away.entities.Entity();
                this.entity.x = 10;
                this.entity.y = 10;
                this.entity.z = 10;

                this.entity.getIgnoreTransform();
            }
            return MeshTest;
        })();
        entities.MeshTest = MeshTest;
    })(tests.entities || (tests.entities = {}));
    var entities = tests.entities;
})(tests || (tests = {}));
//# sourceMappingURL=MeshTest.js.map
