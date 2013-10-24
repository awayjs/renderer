///<reference path="../_definitions.ts"/>

module away.animators
{
    /**
     * Provides an interface for assigning vertex-based animation data sets to mesh-based entity objects
     * and controlling the various available states of animation through an interative playhead that can be
     * automatically updated or manually triggered.
     */
    export class VertexAnimator extends AnimatorBase implements IAnimator
    {
        private _vertexAnimationSet:VertexAnimationSet;
        private _poses:Array<away.base.Geometry> = new Array<away.base.Geometry>();
        private _weights:Array<number> = Array<number>(1, 0, 0, 0);
        private _numPoses:number /*uint*/;
        private _blendMode:string;
        private _activeVertexState:IVertexAnimationState;

        /**
         * Creates a new <code>VertexAnimator</code> object.
         *
         * @param vertexAnimationSet The animation data set containing the vertex animations used by the animator.
         */
        constructor(vertexAnimationSet:VertexAnimationSet)
        {
            super(vertexAnimationSet);

            this._vertexAnimationSet = vertexAnimationSet;
            this._numPoses = vertexAnimationSet.numPoses;
            this._blendMode = vertexAnimationSet.blendMode;
        }

        /**
         * @inheritDoc
         */
        public clone():IAnimator
        {
            return new VertexAnimator(this._vertexAnimationSet);
        }

        /**
         * Plays a sequence with a given name. If the sequence is not found, it may not be loaded yet, and it will retry every frame.
         * @param sequenceName The name of the clip to be played.
         */
        public play(name:string, transition:IAnimationTransition = null, offset:number = NaN):void
        {
            if (this._pActiveAnimationName == name)
                return;
    
            this._pActiveAnimationName = name;
    
            //TODO: implement transitions in vertex animator
    
            if (!this._pAnimationSet.hasAnimation(name))
                throw new Error("Animation root node " + name + " not found!");
    
            this._pActiveNode = this._pAnimationSet.getAnimation(name);
    
            this._pActiveState = this.getAnimationState(this._pActiveNode);
    
            if (this.updatePosition) {
                //update straight away to reset position deltas
                this._pActiveState.update(this._pAbsoluteTime);
                this._pActiveState.positionDelta;
            }
    
            this._activeVertexState = <IVertexAnimationState> this._pActiveState;
    
            this.start();
    
            //apply a time offset if specified
            if (!isNaN(offset))
                this.reset(name, offset);
        }

        /**
         * @inheritDoc
         */
        public _pUpdateDeltaTime(dt:number):void
        {
            super._pUpdateDeltaTime(dt);

            this._poses[0] = this._activeVertexState.currentGeometry;
            this._poses[1] = this._activeVertexState.nextGeometry;
            this._weights[0] = 1 - (this._weights[1] = this._activeVertexState.blendWeight);
        }

        /**
         * @inheritDoc
         */
        public setRenderState(stage3DProxy:away.managers.Stage3DProxy, renderable:away.base.IRenderable, vertexConstantOffset:number /*int*/, vertexStreamOffset:number /*int*/, camera:away.cameras.Camera3D):void
        {
            // todo: add code for when running on cpu

            // if no poses defined, set temp data
            if (!this._poses.length) {
                this.setNullPose(stage3DProxy, renderable, vertexConstantOffset, vertexStreamOffset);
                return;
            }

            // this type of animation can only be SubMesh
            var subMesh:away.base.SubMesh = <away.base.SubMesh> renderable;
            var subGeom:away.base.ISubGeometry;
            var i:number /*uint*/;
            var len:number /*uint*/ = this._numPoses;

            stage3DProxy._iContext3D.setProgramConstantsFromArray(away.display3D.Context3DProgramType.VERTEX, vertexConstantOffset, this._weights, 1);

            if (this._blendMode == VertexAnimationMode.ABSOLUTE) {
                i = 1;
                subGeom = this._poses[0].subGeometries[subMesh._iIndex];
                // set the base sub-geometry so the material can simply pick up on this data
                if (subGeom)
                    subMesh.subGeometry = subGeom;
            } else
                i = 0;

            for (; i < len; ++i) {
                subGeom = this._poses[i].subGeometries[subMesh._iIndex] || subMesh.subGeometry;

                subGeom.activateVertexBuffer(vertexStreamOffset++, stage3DProxy);

                if (this._vertexAnimationSet.useNormals)
                    subGeom.activateVertexNormalBuffer(vertexStreamOffset++, stage3DProxy);

            }
        }

        private setNullPose(stage3DProxy:away.managers.Stage3DProxy, renderable:away.base.IRenderable, vertexConstantOffset:number /*int*/, vertexStreamOffset:number /*int*/):void
        {
            stage3DProxy._iContext3D.setProgramConstantsFromArray(away.display3D.Context3DProgramType.VERTEX, vertexConstantOffset, this._weights, 1);

            if (this._blendMode == VertexAnimationMode.ABSOLUTE) {
                var len:number /*uint*/ = this._numPoses;
                for (var i:number /*uint*/ = 1; i < len; ++i) {
                    renderable.activateVertexBuffer(vertexStreamOffset++, stage3DProxy);

                    if (this._vertexAnimationSet.useNormals)
                        renderable.activateVertexNormalBuffer(vertexStreamOffset++, stage3DProxy);
                }
            }
            // todo: set temp data for additive?
        }

        /**
         * Verifies if the animation will be used on cpu. Needs to be true for all passes for a material to be able to use it on gpu.
         * Needs to be called if gpu code is potentially required.
         */
        public testGPUCompatibility(pass:away.materials.MaterialPassBase):void
        {
        }
    }
}
