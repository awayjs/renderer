///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

/*

Particle explosions in Away3D using the Adobe AIR and Adobe Flash Player logos

Demonstrates:

How to split images into particles.
How to share particle geometries and animation sets between meshes and animators.
How to manually update the playhead of a particle animator using the update() function.

Code by Rob Bateman & Liao Cheng
rob@infiniteturtles.co.uk
http://www.infiniteturtles.co.uk
liaocheng210@126.com

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
	import ParticleAnimationSet			= away.animators.ParticleAnimationSet;
	import ParticleAnimator				= away.animators.ParticleAnimator;
	import ParticleBezierCurveNode		= away.animators.ParticleBezierCurveNode;
	import ParticleBillboardNode		= away.animators.ParticleBillboardNode;
	import ParticleInitialColorNode		= away.animators.ParticleInitialColorNode;
	import ParticlePositionNode			= away.animators.ParticlePositionNode;
	import ParticleProperties			= away.animators.ParticleProperties;
	import ParticlePropertiesMode		= away.animators.ParticlePropertiesMode;
	import Geometry						= away.base.Geometry;
	import ParticleGeometry				= away.base.ParticleGeometry;
	import Scene						= away.containers.Scene;
	import View							= away.containers.View;
	import HoverController				= away.controllers.HoverController;
	import BitmapData					= away.base.BitmapData;
	import Camera						= away.entities.Camera;
	import Mesh							= away.entities.Mesh;
	import LoaderEvent					= away.events.LoaderEvent;
	import ColorTransform				= away.geom.ColorTransform;
	import Vector3D						= away.geom.Vector3D;
	import AssetLibrary					= away.library.AssetLibrary;
	import PointLight					= away.lights.PointLight;
	import ColorMaterial				= away.materials.ColorMaterial;
	import StaticLightPicker			= away.materials.StaticLightPicker;
	import PlaneGeometry				= away.primitives.PlaneGeometry;
	import DefaultRenderer              = away.render.DefaultRenderer;
	import ParticleGeometryHelper		= away.tools.ParticleGeometryHelper;
	import Cast							= away.utils.Cast;
	import RequestAnimationFrame		= away.utils.RequestAnimationFrame;

	export class Intermediate_ParticleExplosions
	{
		private static PARTICLE_SIZE:number /*uint*/ = 1;
		private static NUM_ANIMATORS:number /*uint*/ = 4;
		
		//engine variables
		private scene:Scene;
		private camera:Camera;
		private view:View;
		private cameraController:HoverController;
		
		//light variables
		private greenLight:PointLight;
		private blueLight:PointLight;
		private lightPicker:StaticLightPicker;
		
		//data variables
		private chromeBitmapData:BitmapData;
		private firefoxBitmapData:BitmapData;
		private ieBitmapData:BitmapData;
		private safariBitmapData:BitmapData;
		private colorValues:Array<Vector3D> = new Array<Vector3D>();
		private colorPoints:Array<Vector3D> = new Array<Vector3D>();
		private colorChromeSeparation:number /*int*/;
		private colorFirefoxSeparation:number /*int*/;
		private colorSafariSeparation:number /*int*/;
		
		//material objects
		private colorMaterial:ColorMaterial;
		
		//particle objects
		private colorGeometry:ParticleGeometry;
		private colorAnimationSet:ParticleAnimationSet;
		
		//scene objects
		private colorParticleMesh:Mesh;
		private colorAnimators:Array<ParticleAnimator>;
		
		//navigation variables
		private timer:RequestAnimationFrame;
		private time:number = 0;
		private angle:number = 0;
		private move:Boolean = false;
		private lastPanAngle:number;
		private lastTiltAngle:number;
		private lastMouseX:number;
		private lastMouseY:number;
		
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
			this.initLights();
			this.initMaterials();
			this.initListeners();
		}
		
		/**
		 * Initialise the engine
		 */
		private initEngine():void
		{
			this.scene = new Scene();

			this.camera = new Camera();

			this.view = new View(new DefaultRenderer(), this.scene, this.camera);
			
			//setup controller to be used on the camera
			this.cameraController = new HoverController(this.camera, null, 225, 10, 1000);
		}
		
		/**
		 * Initialise the lights
		 */
		private initLights():void
		{
			//create a green point light
			this.greenLight = new PointLight();
			this.greenLight.color = 0x00FF00;
			this.greenLight.ambient = 1;
			this.greenLight.fallOff = 600;
			this.greenLight.radius = 100;
			this.greenLight.specular = 2;
			this.scene.addChild(this.greenLight);
			
			//create a red pointlight
			this.blueLight = new PointLight();
			this.blueLight.color = 0x0000FF;
			this.blueLight.fallOff = 600;
			this.blueLight.radius = 100;
			this.blueLight.specular = 2;
			this.scene.addChild(this.blueLight);
			
			//create a lightpicker for the green and red light
			this.lightPicker = new StaticLightPicker([this.greenLight, this.blueLight]);
		}
		
		/**
		 * Initialise the materials
		 */
		private initMaterials():void
		{
			//setup the particle material
			this.colorMaterial = new ColorMaterial(0xFFFFFF);
			this.colorMaterial.bothSides = true;
			this.colorMaterial.lightPicker = this.lightPicker;
		}
		
		/**
		 * Initialise the particles
		 */
		private initParticles():void
		{
			var i:number /*int*/;
			var j:number /*int*/;
			var point:Vector3D;
			var rgb:Vector3D;
			var color:number /*uint*/

			for (i = 0; i < this.chromeBitmapData.width; i++) {
				for (j = 0; j < this.chromeBitmapData.height; j++) {
					point = new Vector3D(Intermediate_ParticleExplosions.PARTICLE_SIZE*(i - this.chromeBitmapData.width / 2 - 100), Intermediate_ParticleExplosions.PARTICLE_SIZE*( -j + this.chromeBitmapData.height / 2));
					color = this.chromeBitmapData.getPixel(i, j);
					if (((color >> 24) & 0xff) > 0xb0) {
						this.colorValues.push(new Vector3D(((color & 0xff0000) >> 16)/255, ((color & 0xff00) >> 8)/255, (color & 0xff)/255));
						this.colorPoints.push(point);
					}
				}
			}
			
			//define where one logo stops and another starts
			this.colorChromeSeparation = this.colorPoints.length;

			
			for (i = 0; i < this.firefoxBitmapData.width; i++) {
				for (j = 0; j < this.firefoxBitmapData.height; j++) {
					point = new Vector3D(Intermediate_ParticleExplosions.PARTICLE_SIZE*(i - this.firefoxBitmapData.width / 2 + 100), Intermediate_ParticleExplosions.PARTICLE_SIZE*( -j + this.firefoxBitmapData.height / 2));
					color = this.firefoxBitmapData.getPixel(i, j);
					if (((color >> 24) & 0xff) > 0xb0) {
						this.colorValues.push(new Vector3D(((color & 0xff0000) >> 16)/255, ((color & 0xff00) >> 8)/255, (color & 0xff)/255));
						this.colorPoints.push(point);
					}
				}
			}

			//define where one logo stops and another starts
			this.colorFirefoxSeparation = this.colorPoints.length;


			for (i = 0; i < this.safariBitmapData.width; i++) {
				for (j = 0; j < this.safariBitmapData.height; j++) {
					point = new Vector3D(Intermediate_ParticleExplosions.PARTICLE_SIZE*(i - this.safariBitmapData.width / 2), Intermediate_ParticleExplosions.PARTICLE_SIZE*( -j + this.safariBitmapData.height / 2), -Intermediate_ParticleExplosions.PARTICLE_SIZE*100);
					color = this.safariBitmapData.getPixel(i, j);
					if (((color >> 24) & 0xff) > 0xb0) {
						this.colorValues.push(new Vector3D(((color & 0xff0000) >> 16)/255, ((color & 0xff00) >> 8)/255, (color & 0xff)/255));
						this.colorPoints.push(point);
					}
				}
			}

			//define where one logo stops and another starts
			this.colorSafariSeparation = this.colorPoints.length;


			for (i = 0; i < this.ieBitmapData.width; i++) {
				for (j = 0; j < this.ieBitmapData.height; j++) {
					point = new Vector3D(Intermediate_ParticleExplosions.PARTICLE_SIZE*(i - this.ieBitmapData.width / 2), Intermediate_ParticleExplosions.PARTICLE_SIZE*( -j + this.ieBitmapData.height / 2), Intermediate_ParticleExplosions.PARTICLE_SIZE*100);
					color = this.ieBitmapData.getPixel(i, j);
					if (((color >> 24) & 0xff) > 0xb0) {
						this.colorValues.push(new Vector3D(((color & 0xff0000) >> 16)/255, ((color & 0xff00) >> 8)/255, (color & 0xff)/255));
						this.colorPoints.push(point);
					}
				}
			}

			var num:number /*uint*/ = this.colorPoints.length;
			
			//setup the base geometry for one particle
			var plane:PlaneGeometry = new PlaneGeometry(Intermediate_ParticleExplosions.PARTICLE_SIZE, Intermediate_ParticleExplosions.PARTICLE_SIZE,1,1,false);
			
			//combine them into a list
			var colorGeometrySet:Array<Geometry> = new Array<Geometry>();
			for (i = 0; i < num; i++)
				colorGeometrySet.push(plane);
			
			//generate the particle geometries
			this.colorGeometry = ParticleGeometryHelper.generateGeometry(colorGeometrySet);

			//define the particle animations and init function
			this.colorAnimationSet = new ParticleAnimationSet();
			this.colorAnimationSet.addAnimation(new ParticleBillboardNode());
			this.colorAnimationSet.addAnimation(new ParticleBezierCurveNode(ParticlePropertiesMode.LOCAL_STATIC));
			this.colorAnimationSet.addAnimation(new ParticlePositionNode(ParticlePropertiesMode.LOCAL_STATIC));
			this.colorAnimationSet.addAnimation(new ParticleInitialColorNode(ParticlePropertiesMode.LOCAL_STATIC, true, false, new ColorTransform(0, 1, 0, 1)));
			this.colorAnimationSet.initParticleFunc = this.iniColorParticleFunc;
			this.colorAnimationSet.initParticleScope = this;
		}
		
		/**
		 * Initialise the scene objects
		 */
		private initObjects():void
		{
			//initialise animators vectors
			this.colorAnimators = new Array<ParticleAnimator>(Intermediate_ParticleExplosions.NUM_ANIMATORS);
			
			//create the particle mesh
			this.colorParticleMesh = new Mesh(this.colorGeometry, this.colorMaterial);
			
			var i:number /*uint*/ = 0;
			for (i=0; i<Intermediate_ParticleExplosions.NUM_ANIMATORS; i++) {
				//clone the particle mesh
				this.colorParticleMesh = <Mesh> this.colorParticleMesh.clone();
				this.colorParticleMesh.rotationY = 45*(i-1);
				this.scene.addChild(this.colorParticleMesh);

				//create and start the particle animator
				this.colorAnimators[i] = new ParticleAnimator(this.colorAnimationSet);
				this.colorParticleMesh.animator = this.colorAnimators[i];
				this.scene.addChild(this.colorParticleMesh);
			}
		}
		
		/**
		 * Initialise the listeners
		 */
		private initListeners():void
		{
			window.onresize  = (event) => this.onResize(event);

			document.onmousedown = (event) => this.onMouseDown(event);
			document.onmouseup = (event) => this.onMouseUp(event);
			document.onmousemove = (event) => this.onMouseMove(event);


			this.onResize();


			this.timer = new away.utils.RequestAnimationFrame(this.onEnterFrame, this);
			this.timer.start();

			away.library.AssetLibrary.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, away.utils.Delegate.create(this, this.onResourceComplete));

			//image textures
			away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/firefox.png"));
			away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/chrome.png"));
			away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/safari.png"));
			away.library.AssetLibrary.load(new away.net.URLRequest("assets/demos/ie.png"));
		}
		
		/**
		 * Initialiser for particle properties
		 */
		private iniColorParticleFunc(properties:ParticleProperties):void
		{
			properties.startTime = 0;
			properties.duration = 1;
			var degree1:number = Math.random() * Math.PI * 2;
			var degree2:number = Math.random() * Math.PI * 2;
			var r:number = 500;

			if (properties.index < this.colorChromeSeparation)
				properties[ParticleBezierCurveNode.BEZIER_END_VECTOR3D] = new Vector3D(300*Intermediate_ParticleExplosions.PARTICLE_SIZE, 0, 0);
			else if (properties.index < this.colorFirefoxSeparation)
				properties[ParticleBezierCurveNode.BEZIER_END_VECTOR3D] = new Vector3D(-300*Intermediate_ParticleExplosions.PARTICLE_SIZE, 0, 0);
			else if (properties.index < this.colorSafariSeparation)
				properties[ParticleBezierCurveNode.BEZIER_END_VECTOR3D] = new Vector3D(0, 0, 300*Intermediate_ParticleExplosions.PARTICLE_SIZE);
			else
				properties[ParticleBezierCurveNode.BEZIER_END_VECTOR3D] = new Vector3D(0, 0,-300*Intermediate_ParticleExplosions.PARTICLE_SIZE);

			var rgb:Vector3D = this.colorValues[properties.index];
			properties[ParticleInitialColorNode.COLOR_INITIAL_COLORTRANSFORM] = new ColorTransform(rgb.x, rgb.y, rgb.z, 1);

			properties[ParticleBezierCurveNode.BEZIER_CONTROL_VECTOR3D] = new Vector3D(r * Math.sin(degree1) * Math.cos(degree2), r * Math.cos(degree1) * Math.cos(degree2), r * Math.sin(degree2));
			properties[ParticlePositionNode.POSITION_VECTOR3D] = this.colorPoints[properties.index];
		}

		/**
		 * Navigation and render loop
		 */
		private onEnterFrame(dt:number):void
		{
			this.time += dt;

			//update the camera position
			this.cameraController.panAngle += 0.2;
			
			//update the particle animator playhead positions
			var i:number /*uint*/;
			var time:number /*uint*/;

			if (this.colorAnimators) {
				for (i=0; i<this.colorAnimators.length; i++) {
					time = 1000*(Math.sin(this.time/5000 + Math.PI*i/4) + 1);
					this.colorAnimators[i].update(time);
				}
			}

			//update the light positions
			this.angle += Math.PI / 180;
			this.greenLight.x = Math.sin(this.angle) * 600;
			this.greenLight.z = Math.cos(this.angle) * 600;
			this.blueLight.x = Math.sin(this.angle + Math.PI) * 600;
			this.blueLight.z = Math.cos(this.angle + Math.PI) * 600;

			this.view.render();
		}

		/**
		 * Listener function for resource complete event on asset library
		 */
		private onResourceComplete (event:LoaderEvent)
		{
			switch( event.url )
			{

				//image textures
				case "assets/demos/firefox.png" :
					this.firefoxBitmapData = Cast.bitmapData(event.assets[ 0 ]);
					break;
				case "assets/demos/chrome.png" :
					this.chromeBitmapData = Cast.bitmapData(event.assets[ 0 ]);
					break;
				case "assets/demos/ie.png" :
					this.ieBitmapData = Cast.bitmapData(event.assets[ 0 ]);
					break;
				case "assets/demos/safari.png" :
					this.safariBitmapData = Cast.bitmapData(event.assets[ 0 ]);
					break;

			}

			if (this.firefoxBitmapData != null && this.chromeBitmapData != null && this.safariBitmapData != null && this.ieBitmapData != null) {
				this.initParticles();
				this.initObjects();
			}
		}

		/**
		 * Mouse down listener for navigation
		 */
		private onMouseDown(event):void
		{
			this.lastPanAngle = this.cameraController.panAngle;
			this.lastTiltAngle = this.cameraController.tiltAngle;
			this.lastMouseX = event.clientX;
			this.lastMouseY = event.clientY;
			this.move = true;
		}

		/**
		 * Mouse up listener for navigation
		 */
		private onMouseUp(event):void
		{
			this.move = false;
		}

		/**
		 * Mouse move listener for mouseLock
		 */
		private onMouseMove(event):void
		{
			if (this.move) {
				this.cameraController.panAngle = 0.3*(event.clientX - this.lastMouseX) + this.lastPanAngle;
				this.cameraController.tiltAngle = 0.3*(event.clientY - this.lastMouseY) + this.lastTiltAngle;
			}
		}

		/**
		 * window listener for resize events
		 */
		private onResize(event = null):void
		{
			this.view.y         = 0;
			this.view.x         = 0;
			this.view.width     = window.innerWidth;
			this.view.height    = window.innerHeight;
		}
	}
}