///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />
var tests;
(function (tests) {
    (function (library) {
        var ObjLibLoaderTest = (function () {
            function ObjLibLoaderTest() {
                this.height = 0;
                away.Debug.LOG_PI_ERRORS = false;
                away.Debug.THROW_ERRORS = false;

                this.view = new away.containers.View(new away.render.DefaultRenderer());
                this.raf = new away.utils.RequestAnimationFrame(this.render, this);

                away.library.AssetLibrary.enableParser(away.parsers.OBJParser);

                this.token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/t800.obj'));
                this.token.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete));
                this.token.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, away.utils.Delegate.create(this, this.onAssetComplete));
            }
            ObjLibLoaderTest.prototype.render = function () {
                console.log('render');

                //*
                if (this.mesh) {
                    this.mesh.rotationY += 1;
                }

                this.view.render();
                //*/
            };

            ObjLibLoaderTest.prototype.onAssetComplete = function (e) {
                console.log('------------------------------------------------------------------------------');
                console.log('away.events.AssetEvent.ASSET_COMPLETE', e.asset.name, away.library.AssetLibrary.getAsset(e.asset.name));
                console.log('------------------------------------------------------------------------------');
                /*
                this.mesh = <away.entities.Mesh> away.library.AssetLibrary.getAsset(e.asset.name);
                
                this.view.scene.addChild( this.mesh );
                
                //this.render();
                
                document.onmousedown = () => this.render();
                */
                //this.raf.start();
                /*
                var htmlImageElementTexture : away.textures.HTMLImageElementTexture = <away.textures.HTMLImageElementTexture> away.library.AssetLibrary.getAsset(e.asset.name);
                
                document.body.appendChild( htmlImageElementTexture.htmlImageElement );
                
                htmlImageElementTexture.htmlImageElement.style.position = 'absolute';
                htmlImageElementTexture.htmlImageElement.style.top = this.height + 'px';
                
                
                this.height += ( htmlImageElementTexture.htmlImageElement.height + 10 ) ;
                */
            };
            ObjLibLoaderTest.prototype.onResourceComplete = function (e) {
                var _this = this;
                var loader = e.target;

                console.log('------------------------------------------------------------------------------');
                console.log('away.events.LoaderEvent.RESOURCE_COMPLETE', e);
                console.log('------------------------------------------------------------------------------');

                console.log(away.library.AssetLibrary.getAsset('Mesh_g0'));

                this.mesh = away.library.AssetLibrary.getAsset('Mesh_g0');
                this.mesh.y = -200;
                this.mesh.transform.scale = new away.geom.Vector3D(4, 4, 4);

                this.view.scene.addChild(this.mesh);

                document.onmousedown = function () {
                    return _this.render();
                };
                window.onresize = function () {
                    return _this.resize();
                };

                this.raf.start();

                this.resize();
            };

            ObjLibLoaderTest.prototype.resize = function () {
                this.view.y = 0;
                this.view.x = 0;

                this.view.width = window.innerWidth;
                this.view.height = window.innerHeight;
            };
            return ObjLibLoaderTest;
        })();
        library.ObjLibLoaderTest = ObjLibLoaderTest;
    })(tests.library || (tests.library = {}));
    var library = tests.library;
})(tests || (tests = {}));
//# sourceMappingURL=ObjLibLoaderTest.js.map
