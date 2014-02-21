///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
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
            }
            return MeshTest;
        })();
        entities.MeshTest = MeshTest;
    })(tests.entities || (tests.entities = {}));
    var entities = tests.entities;
})(tests || (tests = {}));
//# sourceMappingURL=MeshTest.js.map
