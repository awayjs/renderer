///<reference path="../../../build/stagegl-renderer.next.d.ts" />

module demos.object3d
{
	import PerspectiveProjection		= away.projections.PerspectiveProjection;
	import View							= away.containers.View;
	import Mesh							= away.entities.Mesh;
	import PointLight					= away.lights.PointLight;
	import URLLoader					= away.net.URLLoader;
	import URLRequest					= away.net.URLRequest;
	import StaticLightPicker			= away.materials.StaticLightPicker;
	import TextureMaterial				= away.materials.TextureMaterial;
	import PrimitiveTorusPrefab			= away.prefabs.PrimitiveTorusPrefab;
	import DefaultRenderer				= away.render.DefaultRenderer;
	import ImageTexture					= away.textures.ImageTexture;
	import RequestAnimationFrame		= away.utils.RequestAnimationFrame;

    export class TorusObject3DDemo
    {

        private view:View;
        private torus:PrimitiveTorusPrefab;

        private light:PointLight;
        private raf:RequestAnimationFrame;
        private meshes:Mesh[];

        private t:number = 0;
        private tPos:number = 0;
        private radius:number = 1000;
        private follow:boolean = true;

        private pointLight:PointLight;
        private lightPicker:StaticLightPicker;

        private _image:HTMLImageElement;

        constructor()
        {
            away.Debug.THROW_ERRORS = false;
            away.Debug.LOG_PI_ERRORS = false;

            this.meshes = new Array<Mesh>();
            this.light = new PointLight();
            this.view = new View(new DefaultRenderer(false, away.stagegl.ContextGLProfile.BASELINE, away.stagegl.ContextGLMode.FLASH));
            this.pointLight = new PointLight();
            this.lightPicker = new StaticLightPicker([this.pointLight])

            this.view.scene.addChild(this.pointLight);

            var perspectiveLens:PerspectiveProjection = <PerspectiveProjection> this.view.camera.projection;
            perspectiveLens.fieldOfView = 75;

            this.view.camera.z = 0;
            this.view.backgroundColor = 0x000000;
            this.view.backgroundAlpha = 1;
            this.torus = new PrimitiveTorusPrefab(150, 50, 32, 32, false);

            var l:number = 10;
            //var radius:number = 1000;

            for (var c : number = 0; c < l ; c++) {

                var t : number=Math.PI * 2 * c / l;

                var mesh:Mesh = <Mesh> this.torus.getNewObject();
				mesh.x = Math.cos(t)*this.radius;
				mesh.y = 0;
				mesh.z = Math.sin(t)*this.radius;

                this.view.scene.addChild(mesh);
                this.meshes.push(mesh);

            }

            this.view.scene.addChild(this.light);

            this.raf = new RequestAnimationFrame(this.tick, this);
            this.raf.start();
            this.onResize();

            document.onmousedown = (event:MouseEvent) => this.followObject(event);

			window.onresize = (event:UIEvent) => this.onResize(event);

            this.loadResources();
        }

        private loadResources()
        {
            var urlRequest:URLRequest = new URLRequest("assets/custom_uv_horizontal.png");
            var urlLoader:URLLoader = new URLLoader();
			urlLoader.dataFormat = away.net.URLLoaderDataFormat.BLOB;
            urlLoader.addEventListener(away.events.Event.COMPLETE, (event:away.events.Event) => this.imageCompleteHandler(event));
            urlLoader.load(urlRequest);
        }

        private imageCompleteHandler(event:away.events.Event)
        {
            var urlLoader:URLLoader = <URLLoader> event.target;

			this._image = away.parsers.ParserUtils.blobToImage(urlLoader.data);
			this._image.onload = (event:Event) => this.onImageLoadComplete(event);

        }

		private onImageLoadComplete(event:Event)
		{
			var matTx: TextureMaterial = new TextureMaterial(new ImageTexture(this._image, false), true, true, false);
			matTx.lightPicker =  this.lightPicker;

			for (var c:number = 0; c < this.meshes.length; c ++)
				this.meshes[c].material = matTx;
		}

        private tick(dt:number)
        {
            this.tPos += .02;

            for (var c:number = 0 ; c < this.meshes.length ; c ++) {
                var objPos:number=Math.PI*2*c/this.meshes.length;

                this.t += .005;
                var s:number = 1.2 + Math.sin(this.t + objPos);

                this.meshes[c].rotationY += 2*(c/this.meshes.length);
                this.meshes[c].rotationX += 2*(c/this.meshes.length);
                this.meshes[c].rotationZ += 2*(c/this.meshes.length);
                this.meshes[c].scaleX = this.meshes[c].scaleY = this.meshes[c].scaleZ = s;
                this.meshes[c].x = Math.cos(objPos + this.tPos)*this.radius;
                this.meshes[c].y = Math.sin(this.t)*500;
                this.meshes[c].z = Math.sin(objPos + this.tPos)*this.radius;
            }

            //this.view.camera.y = Math.sin( this.tPos ) * 1500;

            if (this.follow)
                this.view.camera.lookAt(this.meshes[0].transform.position);

            this.view.camera.y = Math.sin(this.tPos) * 1500;

            this.view.render();
        }

        public onResize(event:UIEvent = null)
        {
            this.view.y = 0;
            this.view.x = 0;

            this.view.width = window.innerWidth;
            this.view.height = window.innerHeight;
        }

        public followObject(e)
        {
            this.follow = !this.follow;
        }
    }
}