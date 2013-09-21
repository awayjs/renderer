///<reference path="../../../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/entities/MeshTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/entities/MeshTest.js
//------------------------------------------------------------------------------------------------

module tests.entities {

    export class EntityTest //extends away.events.EventDispatcher
    {

        private entity  : away.entities.Entity;
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

            this.entity = new away.entities.Entity();
            this.entity.x = 10;
            this.entity.y = 10;
            this.entity.z = 10;

            this.entity.getIgnoreTransform();
        }

    }

}
