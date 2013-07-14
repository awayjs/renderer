///<reference path="../src/away/materials/MaterialBase.ts"/>
///<reference path="../src/away/entities/Entity.ts"/>
///<reference path="../src/away/pick/PickingCollisionVO.ts"/>
///<reference path="../src/away/pick/PickingColliderBase.ts"/>
///<reference path="../src/away/pick/IPicker.ts"/>
///<reference path="../src/away/pick/PickingType.ts"/>
///<reference path="../src/away/pick/AS3PickingCollider.ts"/>
///<reference path="../src/away/pick/PickingColliderType.ts"/>
///<reference path="../src/away/pick/RaycastPicker.ts"/>
///<reference path="../src/away/pick/ShaderPicker.ts"/>
///<reference path="../src/away/base/IRenderable.ts"/>
///<reference path="../src/away/base/IMaterialOwner.ts"/>
///<reference path="../src/away/managers/Mouse3DManager.ts"/>


//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/PickingTests.ts --target ES5 --comments --out $ProjectFileDir$/tests/PickingTests.js
//------------------------------------------------------------------------------------------------


module tests {

    export class PickingTests //extends away.events.EventDispatcher
    {

        private mouse3DManager      : away.managers.Mouse3DManager;

        private rcPicker            : away.pick.RaycastPicker;
        private materialBaseTest    : away.materials.MaterialBase;
        private entity              : away.entities.Entity;
        private pickCOllVo          : away.pick.PickingCollisionVO;
        private pickCBase           : away.pick.PickingColliderBase;
        private as3PickCollider     : away.pick.AS3PickingCollider;
        private shaderPicker        : away.pick.ShaderPicker;

        constructor()
        {

            away.pick.PickingColliderType.AS3_BEST_HIT;

            this.entity = new away.entities.Entity();
            this.entity.x = 10;
            this.entity.y = 10;
            this.entity.z = 10;

            this.entity.getIgnoreTransform();

            this.pickCOllVo         = new away.pick.PickingCollisionVO( this.entity );
            this.pickCBase          = new away.pick.PickingColliderBase();
            this.as3PickCollider    = new away.pick.AS3PickingCollider();

            var arr : Array = new Array( 10 );
                arr.length = 5;

            console.log( arr );

        }

    }

}

var GL = null;//: WebGLRenderingContext;

var test

window.onload = function ()
{

    test = new tests.PickingTests();

    var canvas : HTMLCanvasElement = document.createElement('canvas');
    GL = canvas.getContext("experimental-webgl");

}

