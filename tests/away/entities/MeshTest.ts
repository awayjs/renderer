///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.entities {

    export class MeshTest //extends away.events.EventDispatcher
    {

        private mesh    : away.entities.Mesh;
        private geom    : away.base.Geometry;
        private mat     : away.materials.MaterialBase;


        constructor()
        {

            away.Debug.THROW_ERRORS = false;

            this.mat    = new away.materials.MaterialBase();
            this.geom   = new away.base.Geometry();
            this.mesh   = new away.entities.Mesh( this.geom , this.mat );

            console.log( 'mat' , this.mat );
            console.log( 'geom' , this.geom );
            console.log( 'mesh' , this.mesh );
        }

    }

}
