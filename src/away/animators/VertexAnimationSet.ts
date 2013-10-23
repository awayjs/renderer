///<reference path="../_definitions.ts"/>

module away.animators
{
    /**
     * The animation data set used by vertex-based animators, containing vertex animation state data.
     *
     * @see away.animators.VertexAnimator
     */
    export class VertexAnimationSet extends AnimationSetBase implements IAnimationSet
    {
        private _numPoses:number /*uint*/;
        private _blendMode:string;
        private _streamIndices:Object = new Object(); //Dictionary
        private _useNormals:Object = new Object(); //Dictionary
        private _useTangents:Object = new Object(); //Dictionary
        private _uploadNormals:boolean;
        private _uploadTangents:boolean;

        /**
         * Returns the number of poses made available at once to the GPU animation code.
         */
        public get numPoses():number /*uint*/
        {
            return this._numPoses;
        }

        /**
         * Returns the active blend mode of the vertex animator object.
         */
        public get blendMode():string
        {
            return this._blendMode;
        }

        /**
         * Returns whether or not normal data is used in last set GPU pass of the vertex shader.
         */
        public get useNormals():boolean
        {
            return this._uploadNormals;
        }

        /**
         * Creates a new <code>VertexAnimationSet</code> object.
         *
         * @param numPoses The number of poses made available at once to the GPU animation code.
         * @param blendMode Optional value for setting the animation mode of the vertex animator object.
         *
         * @see away3d.animators.data.VertexAnimationMode
         */
        constructor(numPoses:number /*uint*/ = 2, blendMode:string = "absolute")
        {
            super();
            this._numPoses = numPoses;
            this._blendMode = blendMode;
    
        }
    
        /**
         * @inheritDoc
         */
        public getAGALVertexCode(pass:away.materials.MaterialPassBase, sourceRegisters:Array<string>, targetRegisters:Array<string>, profile:string):string
        {
            if (this._blendMode == away.animators.VertexAnimationMode.ABSOLUTE)
                return this.getAbsoluteAGALCode(pass, sourceRegisters, targetRegisters);
            else
                return this.getAdditiveAGALCode(pass, sourceRegisters, targetRegisters);
        }

        /**
         * @inheritDoc
         */
        public activate(stage3DProxy:away.managers.Stage3DProxy, pass:away.materials.MaterialPassBase):void
        {
            var uID:number = pass._iUniqueId;
            this._uploadNormals = <boolean> this._useNormals[uID];
            this._uploadTangents = <boolean> this._useTangents[uID];
        }

        /**
         * @inheritDoc
         */
        public deactivate(stage3DProxy:away.managers.Stage3DProxy, pass:away.materials.MaterialPassBase):void
        {
            var uID:number = pass._iUniqueId;
            var index:number /*uint*/ = this._streamIndices[uID];
            var context:away.display3D.Context3D = stage3DProxy._iContext3D;
            context.setVertexBufferAt(index, null);
            if (this._uploadNormals)
                context.setVertexBufferAt(index + 1, null);
            if (this._uploadTangents)
                context.setVertexBufferAt(index + 2, null);
        }

        /**
         * @inheritDoc
         */
        public getAGALFragmentCode(pass:away.materials.MaterialPassBase, shadedTarget:string, profile:string):string
        {
            return "";
        }

        /**
         * @inheritDoc
         */
        public getAGALUVCode(pass:away.materials.MaterialPassBase, UVSource:string, UVTarget:string):string
        {
            return "mov " + UVTarget + "," + UVSource + "\n";
        }

        /**
         * @inheritDoc
         */
        public doneAGALCode(pass:away.materials.MaterialPassBase):void
        {

        }

        /**
         * Generates the vertex AGAL code for absolute blending.
         */
        private getAbsoluteAGALCode(pass:away.materials.MaterialPassBase, sourceRegisters:Array<string>, targetRegisters:Array<string>):string
        {
            var code:string = "";
            var uID:number = pass._iUniqueId;
            var temp1:string = this._pFindTempReg(targetRegisters);
            var temp2:string = this._pFindTempReg(targetRegisters, temp1);
            var regs:Array<string> = new Array<string>("x", "y", "z", "w");
            var len:number /*uint*/ = sourceRegisters.length;
            var constantReg:string = "vc" + pass.numUsedVertexConstants;
            var useTangents:boolean = this._useTangents[uID] = <boolean> (len > 2);
            this._useNormals[uID] = <boolean> (len > 1);

            if (len > 2)
                len = 2;
            var streamIndex:number /*uint*/ = this._streamIndices[uID] = pass.numUsedStreams;

            for (var i:number /*uint*/ = 0; i < len; ++i) {
                code += "mul " + temp1 + ", " + sourceRegisters[i] + ", " + constantReg + "." + regs[0] + "\n";

                for (var j:number /*uint*/ = 1; j < this._numPoses; ++j) {
                    code += "mul " + temp2 + ", va" + streamIndex + ", " + constantReg + "." + regs[j] + "\n";

                    if (j < this._numPoses - 1)
                        code += "add " + temp1 + ", " + temp1 + ", " + temp2 + "\n";

                    ++streamIndex;
                }

                code += "add " + targetRegisters[i] + ", " + temp1 + ", " + temp2 + "\n";
            }

            // add code for bitangents if tangents are used
            if (useTangents) {
                code += "dp3 " + temp1 + ".x, " + sourceRegisters[2] + ", " + targetRegisters[1] + "\n" +
                    "mul " + temp1 + ", " + targetRegisters[1] + ", " + temp1 + ".x			 \n" +
                    "sub " + targetRegisters[2] + ", " + sourceRegisters[2] + ", " + temp1 + "\n";
            }
            return code;
        }

        /**
         * Generates the vertex AGAL code for additive blending.
         */
        private getAdditiveAGALCode(pass:away.materials.MaterialPassBase, sourceRegisters:Array<string>, targetRegisters:Array<string>):string
        {
            var code:string = "";
            var uID:number = pass._iUniqueId;
            var len:number /*uint*/ = sourceRegisters.length;
            var regs:Array = ["x", "y", "z", "w"];
            var temp1:string = this._pFindTempReg(targetRegisters);
            var k:number /*uint*/;
            var useTangents:boolean = this._useTangents[uID] = <boolean> (len > 2);
            var useNormals:boolean = this._useNormals[uID] = <boolean> (len > 1);
            var streamIndex:number /*uint*/ = this._streamIndices[uID] = pass.numUsedStreams;

            if (len > 2)
                len = 2;

            code += "mov  " + targetRegisters[0] + ", " + sourceRegisters[0] + "\n";
            if (useNormals)
                code += "mov " + targetRegisters[1] + ", " + sourceRegisters[1] + "\n";

            for (var i:number /*uint*/ = 0; i < len; ++i) {
                for (var j:number /*uint*/ = 0; j < this._numPoses; ++j) {
                    code += "mul " + temp1 + ", va" + (streamIndex + k) + ", vc" + pass.numUsedVertexConstants + "." + regs[j] + "\n" +
                        "add " + targetRegisters[i] + ", " + targetRegisters[i] + ", " + temp1 + "\n";
                    k++;
                }
            }

            if (useTangents) {
                code += "dp3 " + temp1 + ".x, " + sourceRegisters[2] + ", " + targetRegisters[1] + "\n" +
                    "mul " + temp1 + ", " + targetRegisters[1] + ", " + temp1 + ".x			 \n" +
                    "sub " + targetRegisters[2] + ", " + sourceRegisters[2] + ", " + temp1 + "\n";
            }

            return code;
        }
    }
}
