///<reference path="../../../src/away/_definitions.ts" />

//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/away/entities/EntityTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/away/entities/EntityTest.js
//------------------------------------------------------------------------------------------------

module tests.entities {

    export class EntityTest //extends away.events.EventDispatcher
    {

        private entity : away.entities.Entity;

        constructor()
        {

            this.entity = new away.entities.Entity();
            this.entity.x = 10;
            this.entity.y = 10;
            this.entity.z = 10;

            this.entity.getIgnoreTransform();
        }

    }

}