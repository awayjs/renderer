///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
    (function (materials) {
        var ColorMaterialTest = (function () {
            function ColorMaterialTest() {
                away.Debug.THROW_ERRORS = false;

                var mipUrlRequest = new away.net.URLRequest('assets/1024x1024.png');

                this.urlLoader = new away.net.URLLoader();
                this.urlLoader.dataFormat = away.net.URLLoaderDataFormat.BLOB;
                this.urlLoader.load(mipUrlRequest);
                this.urlLoader.addEventListener(away.events.Event.COMPLETE, away.utils.Delegate.create(this, this.imgLoaded));

                this.cm = new away.materials.ColorMaterial();
                this.sManager = away.managers.StageGLManager.getInstance();
                this.stageGL = this.sManager.getFreeStageGL();

                this.cm.iInvalidatePasses(null);

                console.log('-----------------------------------------------------------------------------');
                console.log('- ColorMaterial');
                console.log('-----------------------------------------------------------------------------');
                console.log('this.cm ', this.cm);
                console.log('iUpdateProgram', this.cm._pScreenPass.iUpdateProgram(this.stageGL));
                console.log('iGetVertexCode', this.cm._pScreenPass.iGetVertexCode());
                console.log('iGetFragmentCode', this.cm._pScreenPass.iGetFragmentCode(''));
            }
            ColorMaterialTest.prototype.imgLoaded = function (e) {
                var _this = this;
                var imageLoader = e.target;
                this._image = away.parsers.ParserUtils.blobToImage(imageLoader.data);
                this._image.onload = function (event) {
                    return _this.onLoadComplete(event);
                };
            };

            ColorMaterialTest.prototype.onLoadComplete = function (event) {
                this.imgTx = new away.textures.ImageTexture(this._image);
                this.matTx = new away.materials.TextureMaterial(this.imgTx);
                this.matTx.colorTransform = new away.geom.ColorTransform(1, 1, 1, 1);

                this.specM = new away.materials.BasicSpecularMethod();
                this.specM.texture = this.imgTx;
                this.specM.gloss = 3;
                this.specM.specularColor = 0xff0000;

                this.matTx.specularMethod = this.specM;
                this.matTx.ambientTexture = this.imgTx;
                this.matTx.alpha = .5;
                this.matTx.blendMode = away.base.BlendMode.MULTIPLY;

                console.log('-----------------------------------------------------------------------------');
                console.log('- TextureMaterial');
                console.log('-----------------------------------------------------------------------------');
                console.log('this.matTx ', this.matTx);

                this.matTx._pScreenPass.iUpdateProgram(this.stageGL);

                console.log('iGetVertexCode', this.matTx._pScreenPass.iGetVertexCode());
                console.log('iGetFragmentCode', this.matTx._pScreenPass.iGetFragmentCode(''));
            };
            return ColorMaterialTest;
        })();
        materials.ColorMaterialTest = ColorMaterialTest;
    })(tests.materials || (tests.materials = {}));
    var materials = tests.materials;
})(tests || (tests = {}));
//# sourceMappingURL=ColorMaterialTest.js.map
