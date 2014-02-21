///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module demos.object3d
{
	import Event						= away.events.Event;
	import URLLoader					= away.net.URLLoader;
	import URLRequest					= away.net.URLRequest;
	import RequestAnimationFrame		= away.utils.RequestAnimationFrame;
	import Delegate						= away.utils.Delegate;

	import PerspectiveProjection		= away.projections.PerspectiveProjection;
	import View						= away.containers.View;
	import Mesh							= away.entities.Mesh;
	import PointLight					= away.lights.PointLight;
	import StaticLightPicker			= away.materials.StaticLightPicker;
	import TextureMaterial				= away.materials.TextureMaterial;
	import TorusGeometry				= away.primitives.TorusGeometry;
	import DefaultRenderer				= away.render.DefaultRenderer;
	import ImageTexture					= away.textures.ImageTexture;

    export class TorusObject3DDemo
    {

        private view:View;
        private torus:TorusGeometry;

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
            this.view = new View(new DefaultRenderer());
            this.pointLight = new PointLight();
            this.lightPicker = new StaticLightPicker([this.pointLight])

            this.view.scene.addChild(this.pointLight);

            var perspectiveLens:PerspectiveProjection = <PerspectiveProjection> this.view.camera.projection;
            perspectiveLens.fieldOfView = 75;

            this.view.camera.z = 0;
            this.view.backgroundColor = 0x000000;
            this.view.backgroundAlpha = 1;
            this.torus = new TorusGeometry(150 , 50 , 32 , 32 , false);

            var l:number = 10;
            //var radius:number = 1000;

            for (var c : number = 0; c < l ; c++) {

                var t : number=Math.PI * 2 * c / l;

                var m : Mesh = new Mesh(this.torus);
                    m.x = Math.cos(t)*this.radius;
                    m.y = 0;
                    m.z = Math.sin(t)*this.radius;

                this.view.scene.addChild(m);
                this.meshes.push(m);

            }

            this.view.scene.addChild(this.light);

            this.raf = new RequestAnimationFrame(this.tick , this);
            this.raf.start();
            this.resize(null);

            document.onmousedown = (e) => this.followObject(e);

            this.loadResources();
        }

        private loadResources()
        {
            var urlRequest:URLRequest = new URLRequest("assets/custom_uv_horizontal.png");
            var urlLoader:URLLoader = new URLLoader();
			urlLoader.dataFormat = away.net.URLLoaderDataFormat.BLOB;
            urlLoader.addEventListener(Event.COMPLETE, Delegate.create(this, this.imageCompleteHandler));
            urlLoader.load(urlRequest);
        }

        private imageCompleteHandler(e)
        {
            var urlLoader:URLLoader = <URLLoader> e.target;

			this._image = away.parsers.ParserUtils.blobToImage(urlLoader.data);
			this._image.onload = (event) => this.onImageLoadComplete(event);

        }

		private onImageLoadComplete(event)
		{
			var ts : ImageTexture = new ImageTexture(this._image, false);

			var matTx: TextureMaterial = new TextureMaterial(ts, true, true, false);
			matTx.lightPicker =  this.lightPicker;

			for (var c : number = 0 ; c < this.meshes.length ; c ++)
				this.meshes[c].material = matTx;
		}

        private tick( e )
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

            window.onresize = () => this.resize(null);
            this.resize(null);
        }

        public resize(e)
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