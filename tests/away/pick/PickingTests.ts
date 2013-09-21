///<reference path="../../../lib/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.pick
{


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

            console.log( 'away.pick.PickingCollisionVO' , this.pickCOllVo  );
            console.log( 'away.pick.PickingColliderBase' , this.pickCBase  );
            console.log( 'away.pick.AS3PickingCollider' , this.as3PickCollider  );


        }

    }

}
