///<reference path="../../../build/Away3D.next.d.ts" />
///<reference path="../../../libs/ame.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

/*

 SkyBox example in Away3d

 Demonstrates:

 How to use a CubeTexture to create a SkyBox object.
 How to apply a CubeTexture to a material as an environment map.

 Code by Rob Bateman
 rob@infiniteturtles.co.uk
 http://www.infiniteturtles.co.uk

 This code is distributed under the MIT License

 Copyright (c) The Away Foundation http://www.theawayfoundation.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the “Software”), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 */

module examples
{
    export class Basic_SkyBox
    {

        //engine variables
        private _view:away.containers.View;

        //material objects
        private _cubeTexture:away.textures.ImageCubeTexture;
        private _torusMaterial:away.materials.ColorMaterial;

        //scene objects
        private _skyBox:away.entities.Skybox;
        private _torus:away.entities.Mesh;

        //navigation variables
        private _timer:away.utils.RequestAnimationFrame;
        private _time:number = 0;
        private _mouseX:number;
        private _mouseY:number;

        /**
         * Constructor
         */
        constructor()
        {
            this.init();
        }

        /**
         * Global initialise function
         */
        private init():void
        {
            this.initEngine();
            this.initMaterials();
            this.initObjects();
            this.initListeners();
        }

        /**
         * Initialise the engine
         */
        private initEngine():void
        {
            //setup the view
            this._view = new away.containers.View(new away.render.DefaultRenderer());

            //setup the camera
            this._view.camera.z = -600;
            this._view.camera.y = 0;
            this._view.camera.lookAt(new away.geom.Vector3D());
            this._view.camera.projection = new away.projections.PerspectiveProjection(90);
			this._view.backgroundColor = 0xFFFF00;
            this._mouseX = window.innerWidth/2;
        }

        /**
         * Initialise the materials
         */
        private initMaterials():void
        {
            //setup the torus material
            this._torusMaterial = new away.materials.ColorMaterial(0xFFFFFF, 1);
            this._torusMaterial.specular = 0.5;
            this._torusMaterial.ambient = 0.25;
            this._torusMaterial.ambientColor = 0x111199;
            this._torusMaterial.ambient = 1;
        }

        /**
         * Initialise the scene objects
         */
        private initObjects():void
        {
            this._torus = new away.entities.Mesh(new away.primitives.TorusGeometry(150, 60, 40, 20), this._torusMaterial);
            this._view.scene.addChild(this._torus);
        }

        /**
         * Initialise the listeners
         */
        private initListeners():void
        {
            document.onmousemove = (event) => this.onMouseMove(event);

            window.onresize  = (event) => this.onResize(event);

            this.onResize();

            this._timer = new away.utils.RequestAnimationFrame(this.onEnterFrame, this);
            this._timer.start();

            away.library.AssetLibrary.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete));

            //setup the url map for textures in the cubemap file
            var assetLoaderContext:away.net.AssetLoaderContext = new away.net.AssetLoaderContext();
            assetLoaderContext.dependencyBaseUrl = "assets/demos/skybox/";

            //environment texture
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/skybox/snow_texture.cube"), assetLoaderContext);
        }


        /**
         * Navigation and render loop
         */
        private onEnterFrame(dt:number):void
        {
            this._torus.rotationX += 2;
            this._torus.rotationY += 1;

            this._view.camera.transform.position = new away.geom.Vector3D();
            this._view.camera.rotationY += 0.5*(this._mouseX - window.innerWidth/2)/800;
            this._view.camera.transform.moveBackward(600);
            this._view.render();
        }

        /**
         * Listener function for resource complete event on asset library
         */
        private onResourceComplete (event:away.events.LoaderEvent)
        {
            switch( event.url )
            {
                case 'assets/demos/skybox/snow_texture.cube':
                    this._cubeTexture = <away.textures.ImageCubeTexture> event.assets[ 0 ];

                    this._skyBox = new away.entities.Skybox(this._cubeTexture);
                    this._view.scene.addChild(this._skyBox);

                    this._torusMaterial.addMethod(new away.materials.EnvMapMethod(this._cubeTexture, 1));

                    break;
            }
        }

        /**
         * Mouse move listener for navigation
         */
        private onMouseMove(event)
        {
            this._mouseX = event.clientX;
            this._mouseY = event.clientY;
        }

        /**
         * window listener for resize events
         */
        private onResize(event = null):void
        {
            this._view.y         = 0;
            this._view.x         = 0;
            this._view.width     = window.innerWidth;
            this._view.height    = window.innerHeight;
        }
    }
}
