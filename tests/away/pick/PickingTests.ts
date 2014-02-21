///<reference path="../../../build/Away3D.next.d.ts" />
//<reference path="../../../src/Away3D.ts" />

module tests.pick
{


    export class PickingTests //extends away.events.EventDispatcher
    {

        private mouse3DManager      : away.managers.Mouse3DManager;

        private rcPicker            : away.pick.RaycastPicker;
        private materialBaseTest    : away.materials.MaterialBase;
        private mesh              : away.entities.Mesh;
        private pickCOllVo          : away.pick.PickingCollisionVO;
        private pickCBase           : away.pick.PickingColliderBase;
        private jsPickCollider     : away.pick.JSPickingCollider;
        private shaderPicker        : away.pick.ShaderPicker;

        constructor()
        {

            away.pick.PickingColliderType.AS3_BEST_HIT;

            this.mesh = new away.entities.Mesh(null);
            this.mesh.x = 10;
            this.mesh.y = 10;
            this.mesh.z = 10;

            this.mesh.ignoreTransform = true;

            this.pickCOllVo         = new away.pick.PickingCollisionVO( this.mesh );
            this.pickCBase          = new away.pick.PickingColliderBase();
            this.jsPickCollider    = new away.pick.JSPickingCollider();

            console.log( 'away.pick.PickingCollisionVO' , this.pickCOllVo  );
            console.log( 'away.pick.PickingColliderBase' , this.pickCBase  );
            console.log( 'away.pick.AS3PickingCollider' , this.jsPickCollider  );


        }

    }

}
