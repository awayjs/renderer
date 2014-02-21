///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

/*

 Vertex animation example in Away3d using the MD2 format

 Demonstrates:

 How to use the AssetLibrary class to load an embedded internal md2 model.
 How to clone an asset from the AssetLibrary and apply different mateirals.
 How to load animations into an animation set and apply to individual meshes.

 Code by Rob Bateman
 rob@infiniteturtles.co.uk
 http://www.infiniteturtles.co.uk

 Perelith Knight, by James Green (no email given)

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
    export class Intermediate_PerelithKnight
    {

        private _meshInitialised            : boolean = false;
        private _animationSetInitialised    : boolean = false;
        private _sceneInitialised           : boolean = false;

        //array of materials for random sampling
        private _pKnightTextures:Array<string> = new Array<string>("assets/demos/pknight1.png", "assets/demos/pknight2.png", "assets/demos/pknight3.png", "assets/demos/pknight4.png");
        private _pKnightMaterials:Array<away.materials.TextureMaterial> = new Array<away.materials.TextureMaterial>();

        //engine variables
        private _view:away.containers.View;
        private _cameraController:away.controllers.HoverController;

        //stats
        //private _stats:AwayStats;

        //light objects
        private _light:away.lights.DirectionalLight;
        private _lightPicker:away.materials.StaticLightPicker;

        //material objects
        private _floorMaterial:away.materials.TextureMaterial;
        private _shadowMapMethod:away.materials.FilteredShadowMapMethod;

        //scene objects
        private _floor:away.entities.Mesh;
        private _mesh:away.entities.Mesh;

        //navigation variables
        private _timer:away.utils.RequestAnimationFrame;
        private _time:number = 0;
        private _move:boolean = false;
        private _lastPanAngle:number;
        private _lastTiltAngle:number;
        private _lastMouseX:number;
        private _lastMouseY:number;
        private _keyUp:boolean;
        private _keyDown:boolean;
        private _keyLeft:boolean;
        private _keyRight:boolean;
        private _lookAtPosition:away.geom.Vector3D = new away.geom.Vector3D();
        private _animationSet:away.animators.VertexAnimationSet;

        /**
         * Constructor
         */
        constructor()
        {
            //setup the view
            this._view = new away.containers.View(new away.render.DefaultRenderer());

            //setup the camera for optimal rendering
            this._view.camera.projection.far = 5000;

            //setup controller to be used on the camera
            this._cameraController = new away.controllers.HoverController(this._view.camera, null, 45, 20, 2000, 5);

            //setup the help text
            /*
            var text:TextField = new TextField();
            text.defaultTextFormat = new TextFormat("Verdana", 11, 0xFFFFFF);
            text.embedFonts = true;
            text.antiAliasType = AntiAliasType.ADVANCED;
            text.gridFitType = GridFitType.PIXEL;
            text.width = 240;
            text.height = 100;
            text.selectable = false;
            text.mouseEnabled = false;
            text.text = "Click and drag - rotate\n" +
                "Cursor keys / WSAD / ZSQD - move\n" +
                "Scroll wheel - zoom";

            text.filters = [new DropShadowFilter(1, 45, 0x0, 1, 0, 0)];

            addChild(text);
            */
            
            //setup the lights for the scene
            this._light = new away.lights.DirectionalLight(-0.5, -1, -1);
            this._light.ambient = 0.4;
            this._lightPicker = new away.materials.StaticLightPicker([this._light]);
            this._view.scene.addChild(this._light);

            //setup listeners on AssetLibrary
            away.library.AssetLibrary.addEventListener(away.events.AssetEvent.ASSET_COMPLETE, away.utils.Delegate.create(this, this.onAssetComplete));
            away.library.AssetLibrary.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete));

            //load perilith knight textures
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/pknight1.png"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/pknight2.png"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/pknight3.png"));
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/pknight4.png"));

            //load floor texture
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/floor_diffuse.jpg"));

            //load perelith knight data
            away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/pknight.md2"), null, null, new away.parsers.MD2Parser());

            //create a global shadow map method
            this._shadowMapMethod = new away.materials.FilteredShadowMapMethod(this._light);
            this._shadowMapMethod.epsilon = 0.2;

            //setup floor material
            this._floorMaterial = new away.materials.TextureMaterial();
            this._floorMaterial.lightPicker = this._lightPicker;
            this._floorMaterial.specular = 0;
            this._floorMaterial.ambient = 1;
            this._floorMaterial.shadowMethod = this._shadowMapMethod;
            this._floorMaterial.repeat = true;

            //setup knight materials
            for (var i:number /*uint*/  = 0; i < this._pKnightTextures.length; i++) {
                var knightMaterial:away.materials.TextureMaterial = new away.materials.TextureMaterial();
                //knightMaterial.normalMap = Cast.bitmapTexture(BitmapFilterEffects.normalMap(bitmapData));
                //knightMaterial.specularMap = Cast.bitmapTexture(BitmapFilterEffects.outline(bitmapData));
                knightMaterial.lightPicker = this._lightPicker;
                knightMaterial.gloss = 30;
                knightMaterial.specular = 1;
                knightMaterial.ambient = 1;
                knightMaterial.shadowMethod = this._shadowMapMethod;
                this._pKnightMaterials.push(knightMaterial);
            }

            //setup the floor
            this._floor = new away.entities.Mesh(new away.primitives.PlaneGeometry(5000, 5000), this._floorMaterial);
            this._floor.geometry.scaleUV(5, 5);

            //setup the scene
            this._view.scene.addChild(this._floor);

            //add stats panel
            //addChild(_stats = new AwayStats(_view));

            //add listeners
            window.onresize  = (event) => this.onResize(event);

            document.onmousedown = (event) => this.onMouseDown(event);
            document.onmouseup = (event) => this.onMouseUp(event);
            document.onmousemove = (event) => this.onMouseMove(event);
            document.onmousewheel = (event) => this.onMouseWheel(event);
            document.onkeydown = (event) => this.onKeyDown(event);
            document.onkeyup = (event) => this.onKeyUp(event);
            this.onResize();

            this._timer = new away.utils.RequestAnimationFrame(this.onEnterFrame, this);
            this._timer.start();
        }

        /**
         * Navigation and render loop
         */
        private onEnterFrame(dt:number):void
        {
            this._time += dt;

            if (this._keyUp)
                this._lookAtPosition.x -= 10;
            if (this._keyDown)
                this._lookAtPosition.x += 10;
            if (this._keyLeft)
                this._lookAtPosition.z -= 10;
            if (this._keyRight)
                this._lookAtPosition.z += 10;

            this._cameraController.lookAtPosition = this._lookAtPosition;

            this._view.render();
        }

        /**
         * Listener for asset complete event on loader
         */
        private onAssetComplete(event:away.events.AssetEvent):void
        {
            var asset:away.library.IAsset = event.asset;

            switch (asset.assetType)
            {
                case away.library.AssetType.MESH :
                    this._mesh = <away.entities.Mesh> event.asset;

                    //adjust the mesh
                    this._mesh.y = 120;
                    this._mesh.transform.scale = new away.geom.Vector3D(5, 5, 5);

                    this._meshInitialised = true;


                    break;
                case away.library.AssetType.ANIMATION_SET :
                    this._animationSet = <away.animators.VertexAnimationSet> event.asset
                    this._animationSetInitialised = true;
                    break;
            }

            if ( this._animationSetInitialised && this._meshInitialised && ! this._sceneInitialised)
            {
                this._sceneInitialised = true;
                //create 20 x 20 different clones of the knight
                var numWide:number = 20;
                var numDeep:number = 20;
                var k:number /*uint*/ = 0;
                for (var i:number /*uint*/  = 0; i < numWide; i++) {
                    for (var j:number /*uint*/  = 0; j < numDeep; j++) {
                        //clone mesh
                        var clone:away.entities.Mesh = <away.entities.Mesh> this._mesh.clone();
                        clone.x = (i-(numWide-1)/2)*5000/numWide;
                        clone.z = (j-(numDeep-1)/2)*5000/numDeep;
                        clone.castsShadows = true;
                        clone.material = this._pKnightMaterials[Math.floor(Math.random()*this._pKnightMaterials.length)];
                        this._view.scene.addChild(clone);

                        //create animator
                        var vertexAnimator:away.animators.VertexAnimator = new away.animators.VertexAnimator(this._animationSet);

                        //play specified state
                        vertexAnimator.play(this._animationSet.animationNames[Math.floor(Math.random()*this._animationSet.animationNames.length)], null, Math.random()*1000);
                        clone.animator = vertexAnimator;
                        k++;
                    }
                }
            }

        }

        /**
         * Listener function for resource complete event on asset library
         */
        private onResourceComplete (event:away.events.LoaderEvent)
        {
            var assets:away.library.IAsset[] = event.assets;
            var length:number = assets.length;

            for ( var c : number = 0 ; c < length ; c ++ )
            {
                var asset:away.library.IAsset = assets[c];

                console.log(asset.name, event.url);

                switch (event.url)
                {
                    //floor texture
                    case "assets/demos/floor_diffuse.jpg" :
                        this._floorMaterial.texture = <away.textures.Texture2DBase> asset;
                        break;
                    
                    //knight textures
                    case "assets/demos/pknight1.png" :
                    case "assets/demos/pknight2.png" :
                    case "assets/demos/pknight3.png" :
                    case "assets/demos/pknight4.png" :
                        this._pKnightMaterials[this._pKnightTextures.indexOf(event.url)].texture = <away.textures.Texture2DBase> asset;
                        break;
                    
                    //knight data
                    case "assets/demos/pknight.md2" :

                        break;
                }
            }
        }

        /**
         * Key down listener for animation
         */
        private onKeyDown(event):void
        {
            switch (event.keyCode) {
                case 38://Keyboard.UP:
                case 87://Keyboard.W:
                case 90://Keyboard.Z: //fr
                    this._keyUp = true;
                    break;
                case 40://Keyboard.DOWN:
                case 83://Keyboard.S:
                    this._keyDown = true;
                    break;
                case 37://Keyboard.LEFT:
                case 65://Keyboard.A:
                case 81://Keyboard.Q: //fr
                    this._keyLeft = true;
                    break;
                case 39://Keyboard.RIGHT:
                case 68://Keyboard.D:
                    this._keyRight = true;
                    break;
            }
        }

        /**
         * Key up listener
         */
        private onKeyUp(event):void
        {
            switch (event.keyCode) {
                case 38://Keyboard.UP:
                case 87://Keyboard.W:
                case 90://Keyboard.Z: //fr
                    this._keyUp = false;
                    break;
                case 40://Keyboard.DOWN:
                case 83://Keyboard.S:
                    this._keyDown = false;
                    break;
                case 37://Keyboard.LEFT:
                case 65://Keyboard.A:
                case 81://Keyboard.Q: //fr
                    this._keyLeft = false;
                    break;
                case 39://Keyboard.RIGHT:
                case 68://Keyboard.D:
                    this._keyRight = false;
                    break;
            }
        }

        /**
         * Mouse down listener for navigation
         */
        private onMouseDown(event):void
        {
            this._lastPanAngle = this._cameraController.panAngle;
            this._lastTiltAngle = this._cameraController.tiltAngle;
            this._lastMouseX = event.clientX;
            this._lastMouseY = event.clientY;
            this._move = true;
        }

        /**
         * Mouse up listener for navigation
         */
        private onMouseUp(event):void
        {
            this._move = false;
        }

        private onMouseMove(event)
        {
            if (this._move) {
                this._cameraController.panAngle = 0.3*(event.clientX - this._lastMouseX) + this._lastPanAngle;
                this._cameraController.tiltAngle = 0.3*(event.clientY - this._lastMouseY) + this._lastTiltAngle;
            }
        }

        /**
         * Mouse wheel listener for navigation
         */
        private onMouseWheel(event):void
        {
            this._cameraController.distance -= event.wheelDelta * 5;

            if (this._cameraController.distance < 100)
                this._cameraController.distance = 100;
            else if (this._cameraController.distance > 2000)
                this._cameraController.distance = 2000;
        }

        /**
         * Stage listener for resize events
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
