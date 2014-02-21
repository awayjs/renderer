///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module demos.materials
{

    export class MaterialAlphaTest//extends away.events.EventDispatcher
    {

        private height : number = 0;

        private token   : away.net.AssetLoaderToken;
        private view    : away.containers.View;
        private raf     : away.utils.RequestAnimationFrame;
        private mesh    : away.entities.Mesh;
        private meshes  : Array<away.entities.Mesh> = new Array<away.entities.Mesh>();
        private loadedMeshMaterial     : away.materials.TextureMaterial;
        private multiMat: away.materials.TextureMultiPassMaterial;
        private light   : away.lights.DirectionalLight;
        private lightB  : away.lights.DirectionalLight;
        private t800M   : away.entities.Mesh;

        private aValues : number[] = [0 , .1,.5 ,.8 ,.9 ,.99,1];
        private aValuesP : number = 0 ;

        constructor()
        {

            //away.Debug.LOG_PI_ERRORS    = false;
            away.Debug.THROW_ERRORS     = false;

            this.view                  = new away.containers.View( new away.render.DefaultRenderer());
            this.raf                    = new away.utils.RequestAnimationFrame( this.render , this );

            this.light                  = new away.lights.DirectionalLight();
            this.light.color            = 0xFFFFFF;
            this.light.direction        = new away.geom.Vector3D( 1 , 1 ,0 );
            this.light.ambient          = 0;//0.05;//.4;
            this.light.ambientColor     = 0xFFFFFF;
            this.light.diffuse          = 1;
            this.light.specular         = 1;

            this.lightB                  = new away.lights.DirectionalLight();
            this.lightB.color            = 0xFF0000;
            this.lightB.direction        = new away.geom.Vector3D( -1 , 0 ,1 );
            this.lightB.ambient          = 0;//0.05;//.4;
            this.lightB.ambientColor     = 0xFFFFFF;
            this.lightB.diffuse          = 1;
            this.lightB.specular         = 1;

            this.view.scene.addChild( this.light );
            this.view.scene.addChild( this.lightB );

            this.view.backgroundColor   = 0x222222;

            away.library.AssetLibrary.enableParser( away.parsers.OBJParser ) ;

            this.token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/platonic.obj') );
            this.token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE , away.utils.Delegate.create(this, this.onResourceComplete) );

            this.token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/dots.png') );
            this.token.addEventListener( away.events.LoaderEvent.RESOURCE_COMPLETE , away.utils.Delegate.create(this, this.onResourceComplete) );

            window.onresize = () => this.resize();

            document.onmousedown = () => this.mouseDown();


        }

        private mouseDown()
        {

            this.torusColorMaterial.alpha = this.torusTextureMaterial.alpha = this.loadedMeshMaterial.alpha = this.aValues[this.aValuesP];

            //this.torusColorMaterial.alpha =this.aValues[this.aValuesP];
            alert( 'Alpha: ' + this.aValues[this.aValuesP]);

            this.aValuesP ++;

            if ( this.aValuesP > this.aValues.length -1 )
                this.aValuesP  = 0;

            this.render();

        }

        private t : number = 0;

        private render()
        {
            if( this.meshes )
            {
                for ( var c : number = 0 ; c < this.meshes.length ; c++ )
                {
                    this.meshes[c].rotationY += .35;
                }
            }

            this.view.render();

        }

        private torusTextureMaterial    : away.materials.TextureMaterial;
        private torusColorMaterial      : away.materials.ColorMaterial;
        private staticLightPicker       : away.materials.StaticLightPicker;

        public onResourceComplete ( e : away.events.LoaderEvent )
        {

            var loader  : away.net.AssetLoader   = <away.net.AssetLoader> e.target;
            var l       : number                     = loader.baseDependency.assets.length//dependencies.length;

            for ( var c : number = 0 ; c < l ; c ++ )
            {

                var d : away.library.IAsset = loader.baseDependency.assets[c];

                console.log( d.name);

                switch (d.assetType)
                {

                    case away.library.AssetType.MESH:

                        var mesh : away.entities.Mesh = <away.entities.Mesh> away.library.AssetLibrary.getAsset( d.name );
							
                        this.t800M = mesh;

                        if (d.name == 'Mesh_g0')
                        {
                            this.t800M = mesh;
                            mesh.y = -400;
                            mesh.transform.scale = new away.geom.Vector3D( 5, 5, 5 );
                        }
                        else
                        {
                            mesh.transform.scale = new away.geom.Vector3D( 3.5, 3.5, 3.5 );

                        }

                        if ( this.loadedMeshMaterial )
                            mesh.material = this.loadedMeshMaterial;
							mesh.material.bothSides = true;
                        this.view.scene.addChild( mesh );
                        this.meshes.push( mesh );

                        this.raf.start();
                        break;


                    case away.library.AssetType.TEXTURE :

                        // Loaded Texture
                        var tx  : away.textures.ImageTexture     = <away.textures.ImageTexture> away.library.AssetLibrary.getAsset( d.name );

                        // Light Picker
                        this.staticLightPicker                              = new away.materials.StaticLightPicker( [this.light , this.lightB ] );

                        // Material for loaded mesh
                        this.loadedMeshMaterial                             = new away.materials.TextureMaterial( tx, true, true, false );
                        this.loadedMeshMaterial.lightPicker                 = this.staticLightPicker
                        this.loadedMeshMaterial.alpha                       = 1;
						this.loadedMeshMaterial.bothSides = true;
						
                        if ( this.t800M )
                        {
                            this.t800M.material = this.loadedMeshMaterial;

                        }
                        // MultiMaterial
                        this.multiMat                                       = new away.materials.TextureMultiPassMaterial( tx, true, true, false );
                        this.multiMat.lightPicker                           = this.staticLightPicker

                        // Torus
                        var torus : away.primitives.TorusGeometry           = new away.primitives.TorusGeometry( 150 , 50 , 64 , 64 );

                        // Torus Texture Material
                        this.torusTextureMaterial                           = new away.materials.TextureMaterial( tx, true, true, false );
                        this.torusTextureMaterial.lightPicker               = this.staticLightPicker ;
						this.torusTextureMaterial.bothSides					= true;
                        this.torusTextureMaterial.alpha                     = .8;
						
                        // Torus Mesh ( left )
                        var torusMesh : away.entities.Mesh                  = new away.entities.Mesh( torus , this.torusTextureMaterial );
                            torusMesh.rotationX                             = 90;
                            torusMesh.x                                     = 600;
                        this.meshes.push( torusMesh );
                        this.view.scene.addChild( torusMesh );

                        // Torus Color Material
                        this.torusColorMaterial                             = new away.materials.ColorMaterial( 0x0090ff );
                        this.torusColorMaterial.lightPicker                 = this.staticLightPicker ;
                        this.torusColorMaterial.alpha                       = .8;
						this.torusColorMaterial.bothSides					= true;

                        var cube : away.primitives.CubeGeometry             = new away.primitives.CubeGeometry( 300 , 300 , 300 , 20 , 20 , 20 );
                        // Torus Mesh ( right )
                        torusMesh                                         = new away.entities.Mesh( cube , this.torusColorMaterial );
                        torusMesh.rotationX                               = 90;
                        torusMesh.x                                       = -600;
                        this.meshes.push( torusMesh );
                        this.view.scene.addChild( torusMesh );


                        this.capsuleColorMAterial = new away.materials.ColorMaterial( 0x00ffff );
                        this.capsuleColorMAterial.lightPicker = this.staticLightPicker;

                        var caps : away.primitives.CapsuleGeometry        = new away.primitives.CapsuleGeometry( 100 , 200 );
                        // Torus Mesh ( right )
                        torusMesh                                         = new away.entities.Mesh( caps , this.capsuleColorMAterial );
                        //torusMesh.rotationX                               = 90;
                        //torusMesh.scale( 2 );

                        this.meshes.push( torusMesh );
                        this.view.scene.addChild( torusMesh );


                        this.torusColorMaterial.alpha = this.torusTextureMaterial.alpha = this.loadedMeshMaterial.alpha = 1;

                        break;

                }

            }

            this.render();
            this.resize();

        }

        public capsuleColorMAterial : away.materials.ColorMaterial;

        public resize()
        {
            this.view.y         = 0;
            this.view.x         = 0;

            this.view.width     = window.innerWidth;
            this.view.height    = window.innerHeight;


        }

    }

}
