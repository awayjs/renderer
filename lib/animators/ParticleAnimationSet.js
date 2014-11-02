var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationSetBase = require("awayjs-renderergl/lib/animators/AnimationSetBase");
var AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
var AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
var ParticleAnimationData = require("awayjs-renderergl/lib/animators/data/ParticleAnimationData");
var ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleTimeNode = require("awayjs-renderergl/lib/animators/nodes/ParticleTimeNode");
/**
 * The animation data set used by particle-based animators, containing particle animation data.
 *
 * @see away.animators.ParticleAnimator
 */
var ParticleAnimationSet = (function (_super) {
    __extends(ParticleAnimationSet, _super);
    /**
     * Creates a new <code>ParticleAnimationSet</code>
     *
     * @param    [optional] usesDuration    Defines whether the animation set uses the <code>duration</code> data in its static properties to determine how long a particle is visible for. Defaults to false.
     * @param    [optional] usesLooping     Defines whether the animation set uses a looping timeframe for each particle determined by the <code>startTime</code>, <code>duration</code> and <code>delay</code> data in its static properties function. Defaults to false. Requires <code>usesDuration</code> to be true.
     * @param    [optional] usesDelay       Defines whether the animation set uses the <code>delay</code> data in its static properties to determine how long a particle is hidden for. Defaults to false. Requires <code>usesLooping</code> to be true.
     */
    function ParticleAnimationSet(usesDuration, usesLooping, usesDelay) {
        if (usesDuration === void 0) { usesDuration = false; }
        if (usesLooping === void 0) { usesLooping = false; }
        if (usesDelay === void 0) { usesDelay = false; }
        _super.call(this);
        this._animationSubGeometries = new Object();
        this._particleNodes = new Array();
        this._localDynamicNodes = new Array();
        this._localStaticNodes = new Array();
        this._totalLenOfOneVertex = 0;
        //automatically add a particle time node to the set
        this.addAnimation(this._timeNode = new ParticleTimeNode(usesDuration, usesLooping, usesDelay));
    }
    Object.defineProperty(ParticleAnimationSet.prototype, "particleNodes", {
        /**
         * Returns a vector of the particle animation nodes contained within the set.
         */
        get: function () {
            return this._particleNodes;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.addAnimation = function (node) {
        var i /*int*/;
        var n = node;
        n._iProcessAnimationSetting(this);
        if (n.mode == ParticlePropertiesMode.LOCAL_STATIC) {
            n._iDataOffset = this._totalLenOfOneVertex;
            this._totalLenOfOneVertex += n.dataLength;
            this._localStaticNodes.push(n);
        }
        else if (n.mode == ParticlePropertiesMode.LOCAL_DYNAMIC)
            this._localDynamicNodes.push(n);
        for (i = this._particleNodes.length - 1; i >= 0; i--) {
            if (this._particleNodes[i].priority <= n.priority)
                break;
        }
        this._particleNodes.splice(i + 1, 0, n);
        _super.prototype.addAnimation.call(this, node);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.activate = function (shaderObject, stage) {
        //			this._iAnimationRegisterCache = pass.animationRegisterCache;
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.deactivate = function (shaderObject, stage) {
        //			var context:IContextStageGL = <IContextStageGL> stage.context;
        //			var offset:number /*int*/ = this._iAnimationRegisterCache.vertexAttributesOffset;
        //			var used:number /*int*/ = this._iAnimationRegisterCache.numUsedStreams;
        //			for (var i:number /*int*/ = offset; i < used; i++)
        //				context.setVertexBufferAt(i, null);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.getAGALVertexCode = function (shaderObject) {
        //grab animationRegisterCache from the materialpassbase or create a new one if the first time
        this._iAnimationRegisterCache = shaderObject.animationRegisterCache;
        if (this._iAnimationRegisterCache == null)
            this._iAnimationRegisterCache = shaderObject.animationRegisterCache = new AnimationRegisterCache(shaderObject.profile);
        //reset animationRegisterCache
        this._iAnimationRegisterCache.vertexConstantOffset = shaderObject.numUsedVertexConstants;
        this._iAnimationRegisterCache.vertexAttributesOffset = shaderObject.numUsedStreams;
        this._iAnimationRegisterCache.varyingsOffset = shaderObject.numUsedVaryings;
        this._iAnimationRegisterCache.fragmentConstantOffset = shaderObject.numUsedFragmentConstants;
        this._iAnimationRegisterCache.hasUVNode = this.hasUVNode;
        this._iAnimationRegisterCache.needVelocity = this.needVelocity;
        this._iAnimationRegisterCache.hasBillboard = this.hasBillboard;
        this._iAnimationRegisterCache.sourceRegisters = shaderObject.animatableAttributes;
        this._iAnimationRegisterCache.targetRegisters = shaderObject.animationTargetRegisters;
        this._iAnimationRegisterCache.needFragmentAnimation = shaderObject.usesFragmentAnimation;
        this._iAnimationRegisterCache.needUVAnimation = !shaderObject.usesUVTransform;
        this._iAnimationRegisterCache.hasColorAddNode = this.hasColorAddNode;
        this._iAnimationRegisterCache.hasColorMulNode = this.hasColorMulNode;
        this._iAnimationRegisterCache.reset();
        var code = "";
        code += this._iAnimationRegisterCache.getInitCode();
        var node;
        var i /*int*/;
        for (i = 0; i < this._particleNodes.length; i++) {
            node = this._particleNodes[i];
            if (node.priority < ParticleAnimationSet.POST_PRIORITY)
                code += node.getAGALVertexCode(shaderObject, this._iAnimationRegisterCache);
        }
        code += this._iAnimationRegisterCache.getCombinationCode();
        for (i = 0; i < this._particleNodes.length; i++) {
            node = this._particleNodes[i];
            if (node.priority >= ParticleAnimationSet.POST_PRIORITY && node.priority < ParticleAnimationSet.COLOR_PRIORITY)
                code += node.getAGALVertexCode(shaderObject, this._iAnimationRegisterCache);
        }
        code += this._iAnimationRegisterCache.initColorRegisters();
        for (i = 0; i < this._particleNodes.length; i++) {
            node = this._particleNodes[i];
            if (node.priority >= ParticleAnimationSet.COLOR_PRIORITY)
                code += node.getAGALVertexCode(shaderObject, this._iAnimationRegisterCache);
        }
        code += this._iAnimationRegisterCache.getColorPassCode();
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.getAGALUVCode = function (shaderObject) {
        var code = "";
        if (this.hasUVNode) {
            this._iAnimationRegisterCache.setUVSourceAndTarget(shaderObject.uvSource, shaderObject.uvTarget);
            code += "mov " + this._iAnimationRegisterCache.uvTarget + ".xy," + this._iAnimationRegisterCache.uvAttribute.toString() + "\n";
            var node;
            for (var i = 0; i < this._particleNodes.length; i++)
                node = this._particleNodes[i];
            code += node.getAGALUVCode(shaderObject, this._iAnimationRegisterCache);
            code += "mov " + this._iAnimationRegisterCache.uvVar.toString() + "," + this._iAnimationRegisterCache.uvTarget + ".xy\n";
        }
        else
            code += "mov " + shaderObject.uvTarget + "," + shaderObject.uvSource + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.getAGALFragmentCode = function (shaderObject, shadedTarget) {
        return this._iAnimationRegisterCache.getColorCombinationCode(shadedTarget);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.doneAGALCode = function (shaderObject) {
        this._iAnimationRegisterCache.setDataLength();
        //set vertexZeroConst,vertexOneConst,vertexTwoConst
        this._iAnimationRegisterCache.setVertexConst(this._iAnimationRegisterCache.vertexZeroConst.index, 0, 1, 2, 0);
    };
    Object.defineProperty(ParticleAnimationSet.prototype, "usesCPU", {
        /**
         * @inheritDoc
         */
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.cancelGPUCompatibility = function () {
    };
    ParticleAnimationSet.prototype.dispose = function () {
        for (var key in this._animationSubGeometries)
            this._animationSubGeometries[key].dispose();
        _super.prototype.dispose.call(this);
    };
    ParticleAnimationSet.prototype.getAnimationSubGeometry = function (subMesh) {
        var mesh = subMesh.parentMesh;
        var animationSubGeometry = (mesh.shareAnimationGeometry) ? this._animationSubGeometries[subMesh.subGeometry.id] : this._animationSubGeometries[subMesh.id];
        if (animationSubGeometry)
            return animationSubGeometry;
        this._iGenerateAnimationSubGeometries(mesh);
        return (mesh.shareAnimationGeometry) ? this._animationSubGeometries[subMesh.subGeometry.id] : this._animationSubGeometries[subMesh.id];
    };
    /** @private */
    ParticleAnimationSet.prototype._iGenerateAnimationSubGeometries = function (mesh) {
        if (this.initParticleFunc == null)
            throw (new Error("no initParticleFunc set"));
        var geometry = mesh.geometry;
        if (!geometry)
            throw (new Error("Particle animation can only be performed on a ParticleGeometry object"));
        var i /*int*/, j /*int*/, k /*int*/;
        var animationSubGeometry;
        var newAnimationSubGeometry = false;
        var subGeometry;
        var subMesh;
        var localNode;
        for (i = 0; i < mesh.subMeshes.length; i++) {
            subMesh = mesh.subMeshes[i];
            subGeometry = subMesh.subGeometry;
            if (mesh.shareAnimationGeometry) {
                animationSubGeometry = this._animationSubGeometries[subGeometry.id];
                if (animationSubGeometry)
                    continue;
            }
            animationSubGeometry = new AnimationSubGeometry();
            if (mesh.shareAnimationGeometry)
                this._animationSubGeometries[subGeometry.id] = animationSubGeometry;
            else
                this._animationSubGeometries[subMesh.id] = animationSubGeometry;
            newAnimationSubGeometry = true;
            //create the vertexData vector that will be used for local node data
            animationSubGeometry.createVertexData(subGeometry.numVertices, this._totalLenOfOneVertex);
        }
        if (!newAnimationSubGeometry)
            return;
        var particles = geometry.particles;
        var particlesLength = particles.length;
        var numParticles = geometry.numParticles;
        var particleProperties = new ParticleProperties();
        var particle;
        var oneDataLen /*int*/;
        var oneDataOffset /*int*/;
        var counterForVertex /*int*/;
        var counterForOneData /*int*/;
        var oneData;
        var numVertices /*uint*/;
        var vertexData;
        var vertexLength /*uint*/;
        var startingOffset /*uint*/;
        var vertexOffset /*uint*/;
        //default values for particle param
        particleProperties.total = numParticles;
        particleProperties.startTime = 0;
        particleProperties.duration = 1000;
        particleProperties.delay = 0.1;
        i = 0;
        j = 0;
        while (i < numParticles) {
            particleProperties.index = i;
            //call the init on the particle parameters
            this.initParticleFunc.call(this.initParticleScope, particleProperties);
            for (k = 0; k < this._localStaticNodes.length; k++)
                this._localStaticNodes[k]._iGeneratePropertyOfOneParticle(particleProperties);
            while (j < particlesLength && (particle = particles[j]).particleIndex == i) {
                for (k = 0; k < mesh.subMeshes.length; k++) {
                    subMesh = mesh.subMeshes[k];
                    if (subMesh.subGeometry == particle.subGeometry) {
                        animationSubGeometry = (mesh.shareAnimationGeometry) ? this._animationSubGeometries[subMesh.subGeometry.id] : this._animationSubGeometries[subMesh.id];
                        break;
                    }
                }
                numVertices = particle.numVertices;
                vertexData = animationSubGeometry.vertexData;
                vertexLength = numVertices * this._totalLenOfOneVertex;
                startingOffset = animationSubGeometry.numProcessedVertices * this._totalLenOfOneVertex;
                for (k = 0; k < this._localStaticNodes.length; k++) {
                    localNode = this._localStaticNodes[k];
                    oneData = localNode.oneData;
                    oneDataLen = localNode.dataLength;
                    oneDataOffset = startingOffset + localNode._iDataOffset;
                    for (counterForVertex = 0; counterForVertex < vertexLength; counterForVertex += this._totalLenOfOneVertex) {
                        vertexOffset = oneDataOffset + counterForVertex;
                        for (counterForOneData = 0; counterForOneData < oneDataLen; counterForOneData++)
                            vertexData[vertexOffset + counterForOneData] = oneData[counterForOneData];
                    }
                }
                //store particle properties if they need to be retreived for dynamic local nodes
                if (this._localDynamicNodes.length)
                    animationSubGeometry.animationParticles.push(new ParticleAnimationData(i, particleProperties.startTime, particleProperties.duration, particleProperties.delay, particle));
                animationSubGeometry.numProcessedVertices += numVertices;
                //next index
                j++;
            }
            //next particle
            i++;
        }
    };
    /**
     * Property used by particle nodes that require compilation at the end of the shader
     */
    ParticleAnimationSet.POST_PRIORITY = 9;
    /**
     * Property used by particle nodes that require color compilation
     */
    ParticleAnimationSet.COLOR_PRIORITY = 18;
    return ParticleAnimationSet;
})(AnimationSetBase);
module.exports = ParticleAnimationSet;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvcGFydGljbGVhbmltYXRpb25zZXQudHMiXSwibmFtZXMiOlsiUGFydGljbGVBbmltYXRpb25TZXQiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5jb25zdHJ1Y3RvciIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LnBhcnRpY2xlTm9kZXMiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5hZGRBbmltYXRpb24iLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5hY3RpdmF0ZSIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LmRlYWN0aXZhdGUiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5nZXRBR0FMVmVydGV4Q29kZSIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LmdldEFHQUxVVkNvZGUiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5nZXRBR0FMRnJhZ21lbnRDb2RlIiwiUGFydGljbGVBbmltYXRpb25TZXQuZG9uZUFHQUxDb2RlIiwiUGFydGljbGVBbmltYXRpb25TZXQudXNlc0NQVSIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LmNhbmNlbEdQVUNvbXBhdGliaWxpdHkiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5kaXNwb3NlIiwiUGFydGljbGVBbmltYXRpb25TZXQuZ2V0QW5pbWF0aW9uU3ViR2VvbWV0cnkiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5faUdlbmVyYXRlQW5pbWF0aW9uU3ViR2VvbWV0cmllcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBUUEsSUFBTyxnQkFBZ0IsV0FBZSxrREFBa0QsQ0FBQyxDQUFDO0FBRTFGLElBQU8sc0JBQXNCLFdBQWEsNkRBQTZELENBQUMsQ0FBQztBQUN6RyxJQUFPLG9CQUFvQixXQUFjLDJEQUEyRCxDQUFDLENBQUM7QUFDdEcsSUFBTyxxQkFBcUIsV0FBYSw0REFBNEQsQ0FBQyxDQUFDO0FBQ3ZHLElBQU8sa0JBQWtCLFdBQWMseURBQXlELENBQUMsQ0FBQztBQUNsRyxJQUFPLHNCQUFzQixXQUFhLDZE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a0JBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsa0JBQWtCQSxDQUFDQSxTQUFTQSxFQUFFQSxrQkFBa0JBLENBQUNBLFFBQVFBLEVBQUVBLGtCQUFrQkEsQ0FBQ0EsS0FBS0EsRUFBRUEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRTNLQSxvQkFBb0JBLENBQUNBLG9CQUFvQkEsSUFBSUEsV0FBV0EsQ0FBQ0E7Z0JBRXpEQSxBQUNBQSxZQURZQTtnQkFDWkEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFFREEsQUFDQUEsZUFEZUE7WUFDZkEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7UUFDTEEsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUF6WERkOztPQUVHQTtJQUNXQSxrQ0FBYUEsR0FBa0JBLENBQUNBLENBQUNBO0lBRS9DQTs7T0FFR0E7SUFDV0EsbUNBQWNBLEdBQWtCQSxFQUFFQSxDQUFDQTtJQWtYbERBLDJCQUFDQTtBQUFEQSxDQWxZQSxBQWtZQ0EsRUFsWWtDLGdCQUFnQixFQWtZbEQ7QUFFRCxBQUE4QixpQkFBckIsb0JBQW9CLENBQUMiLCJmaWxlIjoiYW5pbWF0b3JzL1BhcnRpY2xlQW5pbWF0aW9uU2V0LmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJQW5pbWF0aW9uU2V0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9hbmltYXRvcnMvSUFuaW1hdGlvblNldFwiKTtcbmltcG9ydCBBbmltYXRpb25Ob2RlQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2FuaW1hdG9ycy9ub2Rlcy9BbmltYXRpb25Ob2RlQmFzZVwiKTtcbmltcG9ydCBJU3ViTWVzaFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvSVN1Yk1lc2hcIik7XG5pbXBvcnQgU3ViR2VvbWV0cnlCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL1N1Ykdlb21ldHJ5QmFzZVwiKTtcbmltcG9ydCBNZXNoXHRcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9NZXNoXCIpO1xuXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuXG5pbXBvcnQgQW5pbWF0aW9uU2V0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL0FuaW1hdGlvblNldEJhc2VcIik7XG5pbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XG5pbXBvcnQgQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9BbmltYXRpb25SZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IEFuaW1hdGlvblN1Ykdlb21ldHJ5XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvQW5pbWF0aW9uU3ViR2VvbWV0cnlcIik7XG5pbXBvcnQgUGFydGljbGVBbmltYXRpb25EYXRhXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1BhcnRpY2xlQW5pbWF0aW9uRGF0YVwiKTtcbmltcG9ydCBQYXJ0aWNsZVByb3BlcnRpZXNcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9QYXJ0aWNsZVByb3BlcnRpZXNcIik7XG5pbXBvcnQgUGFydGljbGVQcm9wZXJ0aWVzTW9kZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9QYXJ0aWNsZVByb3BlcnRpZXNNb2RlXCIpO1xuaW1wb3J0IFBhcnRpY2xlRGF0YVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9QYXJ0aWNsZURhdGFcIik7XG5pbXBvcnQgUGFydGljbGVOb2RlQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL25vZGVzL1BhcnRpY2xlTm9kZUJhc2VcIik7XG5pbXBvcnQgUGFydGljbGVUaW1lTm9kZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL25vZGVzL1BhcnRpY2xlVGltZU5vZGVcIik7XG5pbXBvcnQgUGFydGljbGVHZW9tZXRyeVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYmFzZS9QYXJ0aWNsZUdlb21ldHJ5XCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuXG5cbi8qKlxuICogVGhlIGFuaW1hdGlvbiBkYXRhIHNldCB1c2VkIGJ5IHBhcnRpY2xlLWJhc2VkIGFuaW1hdG9ycywgY29udGFpbmluZyBwYXJ0aWNsZSBhbmltYXRpb24gZGF0YS5cbiAqXG4gKiBAc2VlIGF3YXkuYW5pbWF0b3JzLlBhcnRpY2xlQW5pbWF0b3JcbiAqL1xuY2xhc3MgUGFydGljbGVBbmltYXRpb25TZXQgZXh0ZW5kcyBBbmltYXRpb25TZXRCYXNlIGltcGxlbWVudHMgSUFuaW1hdGlvblNldFxue1xuXHQvKiogQHByaXZhdGUgKi9cblx0cHVibGljIF9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZTpBbmltYXRpb25SZWdpc3RlckNhY2hlO1xuXG5cdC8vYWxsIG90aGVyIG5vZGVzIGRlcGVuZGVudCBvbiBpdFxuXHRwcml2YXRlIF90aW1lTm9kZTpQYXJ0aWNsZVRpbWVOb2RlO1xuXG5cdC8qKlxuXHQgKiBQcm9wZXJ0eSB1c2VkIGJ5IHBhcnRpY2xlIG5vZGVzIHRoYXQgcmVxdWlyZSBjb21waWxhdGlvbiBhdCB0aGUgZW5kIG9mIHRoZSBzaGFkZXJcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgUE9TVF9QUklPUklUWTpudW1iZXIgLyppbnQqLyA9IDk7XG5cblx0LyoqXG5cdCAqIFByb3BlcnR5IHVzZWQgYnkgcGFydGljbGUgbm9kZXMgdGhhdCByZXF1aXJlIGNvbG9yIGNvbXBpbGF0aW9uXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIENPTE9SX1BSSU9SSVRZOm51bWJlciAvKmludCovID0gMTg7XG5cblx0cHJpdmF0ZSBfYW5pbWF0aW9uU3ViR2VvbWV0cmllczpPYmplY3QgPSBuZXcgT2JqZWN0KCk7XG5cdHByaXZhdGUgX3BhcnRpY2xlTm9kZXM6QXJyYXk8UGFydGljbGVOb2RlQmFzZT4gPSBuZXcgQXJyYXk8UGFydGljbGVOb2RlQmFzZT4oKTtcblx0cHJpdmF0ZSBfbG9jYWxEeW5hbWljTm9kZXM6QXJyYXk8UGFydGljbGVOb2RlQmFzZT4gPSBuZXcgQXJyYXk8UGFydGljbGVOb2RlQmFzZT4oKTtcblx0cHJpdmF0ZSBfbG9jYWxTdGF0aWNOb2RlczpBcnJheTxQYXJ0aWNsZU5vZGVCYXNlPiA9IG5ldyBBcnJheTxQYXJ0aWNsZU5vZGVCYXNlPigpO1xuXHRwcml2YXRlIF90b3RhbExlbk9mT25lVmVydGV4Om51bWJlciAvKmludCovID0gMDtcblxuXHQvL3NldCB0cnVlIGlmIGhhcyBhbiBub2RlIHdoaWNoIHdpbGwgY2hhbmdlIFVWXG5cdHB1YmxpYyBoYXNVVk5vZGU6Ym9vbGVhbjtcblx0Ly9zZXQgaWYgdGhlIG90aGVyIG5vZGVzIG5lZWQgdG8gYWNjZXNzIHRoZSB2ZWxvY2l0eVxuXHRwdWJsaWMgbmVlZFZlbG9jaXR5OmJvb2xlYW47XG5cdC8vc2V0IGlmIGhhcyBhIGJpbGxib2FyZCBub2RlLlxuXHRwdWJsaWMgaGFzQmlsbGJvYXJkOmJvb2xlYW47XG5cdC8vc2V0IGlmIGhhcyBhbiBub2RlIHdoaWNoIHdpbGwgYXBwbHkgY29sb3IgbXVsdGlwbGUgb3BlcmF0aW9uXG5cdHB1YmxpYyBoYXNDb2xvck11bE5vZGU6Ym9vbGVhbjtcblx0Ly9zZXQgaWYgaGFzIGFuIG5vZGUgd2hpY2ggd2lsbCBhcHBseSBjb2xvciBhZGQgb3BlcmF0aW9uXG5cdHB1YmxpYyBoYXNDb2xvckFkZE5vZGU6Ym9vbGVhbjtcblxuXHQvKipcblx0ICogSW5pdGlhbGlzZXIgZnVuY3Rpb24gZm9yIHN0YXRpYyBwYXJ0aWNsZSBwcm9wZXJ0aWVzLiBOZWVkcyB0byByZWZlcmVuY2UgYSB3aXRoIHRoZSBmb2xsb3dpbmcgZm9ybWF0XG5cdCAqXG5cdCAqIDxjb2RlPlxuXHQgKiBpbml0UGFydGljbGVGdW5jKHByb3A6UGFydGljbGVQcm9wZXJ0aWVzKVxuXHQgKiB7XG5cdCAqIFx0XHQvL2NvZGUgZm9yIHNldHRpbmdzIGxvY2FsIHByb3BlcnRpZXNcblx0ICogfVxuXHQgKiA8L2NvZGU+XG5cdCAqXG5cdCAqIEFzaWRlIGZyb20gc2V0dGluZyBhbnkgcHJvcGVydGllcyByZXF1aXJlZCBpbiBwYXJ0aWNsZSBhbmltYXRpb24gbm9kZXMgdXNpbmcgbG9jYWwgc3RhdGljIHByb3BlcnRpZXMsIHRoZSBpbml0UGFydGljbGVGdW5jIGZ1bmN0aW9uXG5cdCAqIGlzIHJlcXVpcmVkIHRvIHRpbWUgbm9kZSByZXF1aXJlbWVudHMgYXMgdGhleSBtYXkgYmUgbmVlZGVkLiBUaGVzZSBwcm9wZXJ0aWVzIG9uIHRoZSBQYXJ0aWNsZVByb3BlcnRpZXMgb2JqZWN0IGNhbiBpbmNsdWRlXG5cdCAqIDxjb2RlPnN0YXJ0VGltZTwvY29kZT4sIDxjb2RlPmR1cmF0aW9uPC9jb2RlPiBhbmQgPGNvZGU+ZGVsYXk8L2NvZGU+LiBUaGUgdXNlIG9mIHRoZXNlIHByb3BlcnRpZXMgaXMgZGV0ZXJtaW5lZCBieSB0aGUgc2V0dGluZ1xuXHQgKiBhcmd1bWVudHMgcGFzc2VkIGluIHRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgcGFydGljbGUgYW5pbWF0aW9uIHNldC4gQnkgZGVmYXVsdCwgb25seSB0aGUgPGNvZGU+c3RhcnRUaW1lPC9jb2RlPiBwcm9wZXJ0eSBpcyByZXF1aXJlZC5cblx0ICovXG5cdHB1YmxpYyBpbml0UGFydGljbGVGdW5jOkZ1bmN0aW9uO1xuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXNlciBmdW5jdGlvbiBzY29wZSBmb3Igc3RhdGljIHBhcnRpY2xlIHByb3BlcnRpZXNcblx0ICovXG5cdHB1YmxpYyBpbml0UGFydGljbGVTY29wZTpPYmplY3Q7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgPGNvZGU+UGFydGljbGVBbmltYXRpb25TZXQ8L2NvZGU+XG5cdCAqXG5cdCAqIEBwYXJhbSAgICBbb3B0aW9uYWxdIHVzZXNEdXJhdGlvbiAgICBEZWZpbmVzIHdoZXRoZXIgdGhlIGFuaW1hdGlvbiBzZXQgdXNlcyB0aGUgPGNvZGU+ZHVyYXRpb248L2NvZGU+IGRhdGEgaW4gaXRzIHN0YXRpYyBwcm9wZXJ0aWVzIHRvIGRldGVybWluZSBob3cgbG9uZyBhIHBhcnRpY2xlIGlzIHZpc2libGUgZm9yLiBEZWZhdWx0cyB0byBmYWxzZS5cblx0ICogQHBhcmFtICAgIFtvcHRpb25hbF0gdXNlc0xvb3BpbmcgICAgIERlZmluZXMgd2hldGhlciB0aGUgYW5pbWF0aW9uIHNldCB1c2VzIGEgbG9vcGluZyB0aW1lZnJhbWUgZm9yIGVhY2ggcGFydGljbGUgZGV0ZXJtaW5lZCBieSB0aGUgPGNvZGU+c3RhcnRUaW1lPC9jb2RlPiwgPGNvZGU+ZHVyYXRpb248L2NvZGU+IGFuZCA8Y29kZT5kZWxheTwvY29kZT4gZGF0YSBpbiBpdHMgc3RhdGljIHByb3BlcnRpZXMgZnVuY3Rpb24uIERlZmF1bHRzIHRvIGZhbHNlLiBSZXF1aXJlcyA8Y29kZT51c2VzRHVyYXRpb248L2NvZGU+IHRvIGJlIHRydWUuXG5cdCAqIEBwYXJhbSAgICBbb3B0aW9uYWxdIHVzZXNEZWxheSAgICAgICBEZWZpbmVzIHdoZXRoZXIgdGhlIGFuaW1hdGlvbiBzZXQgdXNlcyB0aGUgPGNvZGU+ZGVsYXk8L2NvZGU+IGRhdGEgaW4gaXRzIHN0YXRpYyBwcm9wZXJ0aWVzIHRvIGRldGVybWluZSBob3cgbG9uZyBhIHBhcnRpY2xlIGlzIGhpZGRlbiBmb3IuIERlZmF1bHRzIHRvIGZhbHNlLiBSZXF1aXJlcyA8Y29kZT51c2VzTG9vcGluZzwvY29kZT4gdG8gYmUgdHJ1ZS5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHVzZXNEdXJhdGlvbjpib29sZWFuID0gZmFsc2UsIHVzZXNMb29waW5nOmJvb2xlYW4gPSBmYWxzZSwgdXNlc0RlbGF5OmJvb2xlYW4gPSBmYWxzZSlcblx0e1xuXHRcdHN1cGVyKCk7XG5cblx0XHQvL2F1dG9tYXRpY2FsbHkgYWRkIGEgcGFydGljbGUgdGltZSBub2RlIHRvIHRoZSBzZXRcblx0XHR0aGlzLmFkZEFuaW1hdGlvbih0aGlzLl90aW1lTm9kZSA9IG5ldyBQYXJ0aWNsZVRpbWVOb2RlKHVzZXNEdXJhdGlvbiwgdXNlc0xvb3BpbmcsIHVzZXNEZWxheSkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYSB2ZWN0b3Igb2YgdGhlIHBhcnRpY2xlIGFuaW1hdGlvbiBub2RlcyBjb250YWluZWQgd2l0aGluIHRoZSBzZXQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHBhcnRpY2xlTm9kZXMoKTpBcnJheTxQYXJ0aWNsZU5vZGVCYXNlPlxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3BhcnRpY2xlTm9kZXM7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBhZGRBbmltYXRpb24obm9kZTpBbmltYXRpb25Ob2RlQmFzZSlcblx0e1xuXHRcdHZhciBpOm51bWJlciAvKmludCovO1xuXHRcdHZhciBuOlBhcnRpY2xlTm9kZUJhc2UgPSA8UGFydGljbGVOb2RlQmFzZT4gbm9kZTtcblx0XHRuLl9pUHJvY2Vzc0FuaW1hdGlvblNldHRpbmcodGhpcyk7XG5cdFx0aWYgKG4ubW9kZSA9PSBQYXJ0aWNsZVByb3BlcnRpZXNNb2RlLkxPQ0FMX1NUQVRJQykge1xuXHRcdFx0bi5faURhdGFPZmZzZXQgPSB0aGlzLl90b3RhbExlbk9mT25lVmVydGV4O1xuXHRcdFx0dGhpcy5fdG90YWxMZW5PZk9uZVZlcnRleCArPSBuLmRhdGFMZW5ndGg7XG5cdFx0XHR0aGlzLl9sb2NhbFN0YXRpY05vZGVzLnB1c2gobik7XG5cdFx0fSBlbHNlIGlmIChuLm1vZGUgPT0gUGFydGljbGVQcm9wZXJ0aWVzTW9kZS5MT0NBTF9EWU5BTUlDKVxuXHRcdFx0dGhpcy5fbG9jYWxEeW5hbWljTm9kZXMucHVzaChuKTtcblxuXHRcdGZvciAoaSA9IHRoaXMuX3BhcnRpY2xlTm9kZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdGlmICh0aGlzLl9wYXJ0aWNsZU5vZGVzW2ldLnByaW9yaXR5IDw9IG4ucHJpb3JpdHkpXG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdHRoaXMuX3BhcnRpY2xlTm9kZXMuc3BsaWNlKGkgKyAxLCAwLCBuKTtcblxuXHRcdHN1cGVyLmFkZEFuaW1hdGlvbihub2RlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBzdGFnZTpTdGFnZSlcblx0e1xuLy9cdFx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSA9IHBhc3MuYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGRlYWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHN0YWdlOlN0YWdlKVxuXHR7XG4vL1x0XHRcdHZhciBjb250ZXh0OklDb250ZXh0U3RhZ2VHTCA9IDxJQ29udGV4dFN0YWdlR0w+IHN0YWdlLmNvbnRleHQ7XG4vL1x0XHRcdHZhciBvZmZzZXQ6bnVtYmVyIC8qaW50Ki8gPSB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS52ZXJ0ZXhBdHRyaWJ1dGVzT2Zmc2V0O1xuLy9cdFx0XHR2YXIgdXNlZDpudW1iZXIgLyppbnQqLyA9IHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLm51bVVzZWRTdHJlYW1zO1xuLy9cdFx0XHRmb3IgKHZhciBpOm51bWJlciAvKmludCovID0gb2Zmc2V0OyBpIDwgdXNlZDsgaSsrKVxuLy9cdFx0XHRcdGNvbnRleHQuc2V0VmVydGV4QnVmZmVyQXQoaSwgbnVsbCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBnZXRBR0FMVmVydGV4Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSk6c3RyaW5nXG5cdHtcblx0XHQvL2dyYWIgYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSBmcm9tIHRoZSBtYXRlcmlhbHBhc3NiYXNlIG9yIGNyZWF0ZSBhIG5ldyBvbmUgaWYgdGhlIGZpcnN0IHRpbWVcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSA9IHNoYWRlck9iamVjdC5hbmltYXRpb25SZWdpc3RlckNhY2hlO1xuXG5cdFx0aWYgKHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlID09IG51bGwpXG5cdFx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSA9IHNoYWRlck9iamVjdC5hbmltYXRpb25SZWdpc3RlckNhY2hlID0gbmV3IEFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUoc2hhZGVyT2JqZWN0LnByb2ZpbGUpO1xuXG5cdFx0Ly9yZXNldCBhbmltYXRpb25SZWdpc3RlckNhY2hlXG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudmVydGV4Q29uc3RhbnRPZmZzZXQgPSBzaGFkZXJPYmplY3QubnVtVXNlZFZlcnRleENvbnN0YW50cztcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS52ZXJ0ZXhBdHRyaWJ1dGVzT2Zmc2V0ID0gc2hhZGVyT2JqZWN0Lm51bVVzZWRTdHJlYW1zO1xuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnZhcnlpbmdzT2Zmc2V0ID0gc2hhZGVyT2JqZWN0Lm51bVVzZWRWYXJ5aW5ncztcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5mcmFnbWVudENvbnN0YW50T2Zmc2V0ID0gc2hhZGVyT2JqZWN0Lm51bVVzZWRGcmFnbWVudENvbnN0YW50cztcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5oYXNVVk5vZGUgPSB0aGlzLmhhc1VWTm9kZTtcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5uZWVkVmVsb2NpdHkgPSB0aGlzLm5lZWRWZWxvY2l0eTtcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5oYXNCaWxsYm9hcmQgPSB0aGlzLmhhc0JpbGxib2FyZDtcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5zb3VyY2VSZWdpc3RlcnMgPSBzaGFkZXJPYmplY3QuYW5pbWF0YWJsZUF0dHJpYnV0ZXM7XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudGFyZ2V0UmVnaXN0ZXJzID0gc2hhZGVyT2JqZWN0LmFuaW1hdGlvblRhcmdldFJlZ2lzdGVycztcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5uZWVkRnJhZ21lbnRBbmltYXRpb24gPSBzaGFkZXJPYmplY3QudXNlc0ZyYWdtZW50QW5pbWF0aW9uO1xuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLm5lZWRVVkFuaW1hdGlvbiA9ICFzaGFkZXJPYmplY3QudXNlc1VWVHJhbnNmb3JtO1xuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLmhhc0NvbG9yQWRkTm9kZSA9IHRoaXMuaGFzQ29sb3JBZGROb2RlO1xuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLmhhc0NvbG9yTXVsTm9kZSA9IHRoaXMuaGFzQ29sb3JNdWxOb2RlO1xuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnJlc2V0KCk7XG5cblx0XHR2YXIgY29kZTpzdHJpbmcgPSBcIlwiO1xuXG5cdFx0Y29kZSArPSB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5nZXRJbml0Q29kZSgpO1xuXG5cdFx0dmFyIG5vZGU6UGFydGljbGVOb2RlQmFzZTtcblx0XHR2YXIgaTpudW1iZXIgLyppbnQqLztcblxuXHRcdGZvciAoaSA9IDA7IGkgPCB0aGlzLl9wYXJ0aWNsZU5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRub2RlID0gdGhpcy5fcGFydGljbGVOb2Rlc1tpXTtcblx0XHRcdGlmIChub2RlLnByaW9yaXR5IDwgUGFydGljbGVBbmltYXRpb25TZXQuUE9TVF9QUklPUklUWSlcblx0XHRcdFx0Y29kZSArPSBub2RlLmdldEFHQUxWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUpO1xuXHRcdH1cblxuXHRcdGNvZGUgKz0gdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuZ2V0Q29tYmluYXRpb25Db2RlKCk7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgdGhpcy5fcGFydGljbGVOb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0bm9kZSA9IHRoaXMuX3BhcnRpY2xlTm9kZXNbaV07XG5cdFx0XHRpZiAobm9kZS5wcmlvcml0eSA+PSBQYXJ0aWNsZUFuaW1hdGlvblNldC5QT1NUX1BSSU9SSVRZICYmIG5vZGUucHJpb3JpdHkgPCBQYXJ0aWNsZUFuaW1hdGlvblNldC5DT0xPUl9QUklPUklUWSlcblx0XHRcdFx0Y29kZSArPSBub2RlLmdldEFHQUxWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUpO1xuXHRcdH1cblxuXHRcdGNvZGUgKz0gdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuaW5pdENvbG9yUmVnaXN0ZXJzKCk7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgdGhpcy5fcGFydGljbGVOb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0bm9kZSA9IHRoaXMuX3BhcnRpY2xlTm9kZXNbaV07XG5cdFx0XHRpZiAobm9kZS5wcmlvcml0eSA+PSBQYXJ0aWNsZUFuaW1hdGlvblNldC5DT0xPUl9QUklPUklUWSlcblx0XHRcdFx0Y29kZSArPSBub2RlLmdldEFHQUxWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUpO1xuXHRcdH1cblx0XHRjb2RlICs9IHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLmdldENvbG9yUGFzc0NvZGUoKTtcblx0XHRyZXR1cm4gY29kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldEFHQUxVVkNvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gXCJcIjtcblx0XHRpZiAodGhpcy5oYXNVVk5vZGUpIHtcblx0XHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnNldFVWU291cmNlQW5kVGFyZ2V0KHNoYWRlck9iamVjdC51dlNvdXJjZSwgc2hhZGVyT2JqZWN0LnV2VGFyZ2V0KTtcblx0XHRcdGNvZGUgKz0gXCJtb3YgXCIgKyB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS51dlRhcmdldCArIFwiLnh5LFwiICsgdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudXZBdHRyaWJ1dGUudG9TdHJpbmcoKSArIFwiXFxuXCI7XG5cdFx0XHR2YXIgbm9kZTpQYXJ0aWNsZU5vZGVCYXNlO1xuXHRcdFx0Zm9yICh2YXIgaTpudW1iZXIgLyp1aW50Ki8gPSAwOyBpIDwgdGhpcy5fcGFydGljbGVOb2Rlcy5sZW5ndGg7IGkrKylcblx0XHRcdFx0bm9kZSA9IHRoaXMuX3BhcnRpY2xlTm9kZXNbaV07XG5cdFx0XHRcdGNvZGUgKz0gbm9kZS5nZXRBR0FMVVZDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUpO1xuXHRcdFx0Y29kZSArPSBcIm1vdiBcIiArIHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnV2VmFyLnRvU3RyaW5nKCkgKyBcIixcIiArIHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnV2VGFyZ2V0ICsgXCIueHlcXG5cIjtcblx0XHR9IGVsc2Vcblx0XHRcdGNvZGUgKz0gXCJtb3YgXCIgKyBzaGFkZXJPYmplY3QudXZUYXJnZXQgKyBcIixcIiArIHNoYWRlck9iamVjdC51dlNvdXJjZSArIFwiXFxuXCI7XG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBnZXRBR0FMRnJhZ21lbnRDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBzaGFkZWRUYXJnZXQ6c3RyaW5nKTpzdHJpbmdcblx0e1xuXHRcdHJldHVybiB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5nZXRDb2xvckNvbWJpbmF0aW9uQ29kZShzaGFkZWRUYXJnZXQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZG9uZUFHQUxDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKVxuXHR7XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuc2V0RGF0YUxlbmd0aCgpO1xuXG5cdFx0Ly9zZXQgdmVydGV4WmVyb0NvbnN0LHZlcnRleE9uZUNvbnN0LHZlcnRleFR3b0NvbnN0XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuc2V0VmVydGV4Q29uc3QodGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudmVydGV4WmVyb0NvbnN0LmluZGV4LCAwLCAxLCAyLCAwKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldCB1c2VzQ1BVKCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgY2FuY2VsR1BVQ29tcGF0aWJpbGl0eSgpXG5cdHtcblxuXHR9XG5cblx0cHVibGljIGRpc3Bvc2UoKVxuXHR7XG5cdFx0Zm9yICh2YXIga2V5IGluIHRoaXMuX2FuaW1hdGlvblN1Ykdlb21ldHJpZXMpXG5cdFx0XHQoPEFuaW1hdGlvblN1Ykdlb21ldHJ5PiB0aGlzLl9hbmltYXRpb25TdWJHZW9tZXRyaWVzW2tleV0pLmRpc3Bvc2UoKTtcblxuXHRcdHN1cGVyLmRpc3Bvc2UoKTtcblx0fVxuXG5cdHB1YmxpYyBnZXRBbmltYXRpb25TdWJHZW9tZXRyeShzdWJNZXNoOklTdWJNZXNoKVxuXHR7XG5cdFx0dmFyIG1lc2g6TWVzaCA9IHN1Yk1lc2gucGFyZW50TWVzaDtcblx0XHR2YXIgYW5pbWF0aW9uU3ViR2VvbWV0cnk6QW5pbWF0aW9uU3ViR2VvbWV0cnkgPSAobWVzaC5zaGFyZUFuaW1hdGlvbkdlb21ldHJ5KT8gdGhpcy5fYW5pbWF0aW9uU3ViR2VvbWV0cmllc1tzdWJNZXNoLnN1Ykdlb21ldHJ5LmlkXSA6IHRoaXMuX2FuaW1hdGlvblN1Ykdlb21ldHJpZXNbc3ViTWVzaC5pZF07XG5cblx0XHRpZiAoYW5pbWF0aW9uU3ViR2VvbWV0cnkpXG5cdFx0XHRyZXR1cm4gYW5pbWF0aW9uU3ViR2VvbWV0cnk7XG5cblx0XHR0aGlzLl9pR2VuZXJhdGVBbmltYXRpb25TdWJHZW9tZXRyaWVzKG1lc2gpO1xuXG5cdFx0cmV0dXJuIChtZXNoLnNoYXJlQW5pbWF0aW9uR2VvbWV0cnkpPyB0aGlzLl9hbmltYXRpb25TdWJHZW9tZXRyaWVzW3N1Yk1lc2guc3ViR2VvbWV0cnkuaWRdIDogdGhpcy5fYW5pbWF0aW9uU3ViR2VvbWV0cmllc1tzdWJNZXNoLmlkXTtcblx0fVxuXG5cblx0LyoqIEBwcml2YXRlICovXG5cdHB1YmxpYyBfaUdlbmVyYXRlQW5pbWF0aW9uU3ViR2VvbWV0cmllcyhtZXNoOk1lc2gpXG5cdHtcblx0XHRpZiAodGhpcy5pbml0UGFydGljbGVGdW5jID09IG51bGwpXG5cdFx0XHR0aHJvdyhuZXcgRXJyb3IoXCJubyBpbml0UGFydGljbGVGdW5jIHNldFwiKSk7XG5cblx0XHR2YXIgZ2VvbWV0cnk6UGFydGljbGVHZW9tZXRyeSA9IDxQYXJ0aWNsZUdlb21ldHJ5PiBtZXNoLmdlb21ldHJ5O1xuXG5cdFx0aWYgKCFnZW9tZXRyeSlcblx0XHRcdHRocm93KG5ldyBFcnJvcihcIlBhcnRpY2xlIGFuaW1hdGlvbiBjYW4gb25seSBiZSBwZXJmb3JtZWQgb24gYSBQYXJ0aWNsZUdlb21ldHJ5IG9iamVjdFwiKSk7XG5cblx0XHR2YXIgaTpudW1iZXIgLyppbnQqLywgajpudW1iZXIgLyppbnQqLywgazpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgYW5pbWF0aW9uU3ViR2VvbWV0cnk6QW5pbWF0aW9uU3ViR2VvbWV0cnk7XG5cdFx0dmFyIG5ld0FuaW1hdGlvblN1Ykdlb21ldHJ5OmJvb2xlYW4gPSBmYWxzZTtcblx0XHR2YXIgc3ViR2VvbWV0cnk6U3ViR2VvbWV0cnlCYXNlO1xuXHRcdHZhciBzdWJNZXNoOklTdWJNZXNoO1xuXHRcdHZhciBsb2NhbE5vZGU6UGFydGljbGVOb2RlQmFzZTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCBtZXNoLnN1Yk1lc2hlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0c3ViTWVzaCA9IG1lc2guc3ViTWVzaGVzW2ldO1xuXHRcdFx0c3ViR2VvbWV0cnkgPSBzdWJNZXNoLnN1Ykdlb21ldHJ5O1xuXHRcdFx0aWYgKG1lc2guc2hhcmVBbmltYXRpb25HZW9tZXRyeSkge1xuXHRcdFx0XHRhbmltYXRpb25TdWJHZW9tZXRyeSA9IHRoaXMuX2FuaW1hdGlvblN1Ykdlb21ldHJpZXNbc3ViR2VvbWV0cnkuaWRdO1xuXG5cdFx0XHRcdGlmIChhbmltYXRpb25TdWJHZW9tZXRyeSlcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0YW5pbWF0aW9uU3ViR2VvbWV0cnkgPSBuZXcgQW5pbWF0aW9uU3ViR2VvbWV0cnkoKTtcblxuXHRcdFx0aWYgKG1lc2guc2hhcmVBbmltYXRpb25HZW9tZXRyeSlcblx0XHRcdFx0dGhpcy5fYW5pbWF0aW9uU3ViR2VvbWV0cmllc1tzdWJHZW9tZXRyeS5pZF0gPSBhbmltYXRpb25TdWJHZW9tZXRyeTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0dGhpcy5fYW5pbWF0aW9uU3ViR2VvbWV0cmllc1tzdWJNZXNoLmlkXSA9IGFuaW1hdGlvblN1Ykdlb21ldHJ5O1xuXG5cdFx0XHRuZXdBbmltYXRpb25TdWJHZW9tZXRyeSA9IHRydWU7XG5cblx0XHRcdC8vY3JlYXRlIHRoZSB2ZXJ0ZXhEYXRhIHZlY3RvciB0aGF0IHdpbGwgYmUgdXNlZCBmb3IgbG9jYWwgbm9kZSBkYXRhXG5cdFx0XHRhbmltYXRpb25TdWJHZW9tZXRyeS5jcmVhdGVWZXJ0ZXhEYXRhKHN1Ykdlb21ldHJ5Lm51bVZlcnRpY2VzLCB0aGlzLl90b3RhbExlbk9mT25lVmVydGV4KTtcblx0XHR9XG5cblx0XHRpZiAoIW5ld0FuaW1hdGlvblN1Ykdlb21ldHJ5KVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dmFyIHBhcnRpY2xlczpBcnJheTxQYXJ0aWNsZURhdGE+ID0gZ2VvbWV0cnkucGFydGljbGVzO1xuXHRcdHZhciBwYXJ0aWNsZXNMZW5ndGg6bnVtYmVyIC8qdWludCovID0gcGFydGljbGVzLmxlbmd0aDtcblx0XHR2YXIgbnVtUGFydGljbGVzOm51bWJlciAvKnVpbnQqLyA9IGdlb21ldHJ5Lm51bVBhcnRpY2xlcztcblx0XHR2YXIgcGFydGljbGVQcm9wZXJ0aWVzOlBhcnRpY2xlUHJvcGVydGllcyA9IG5ldyBQYXJ0aWNsZVByb3BlcnRpZXMoKTtcblx0XHR2YXIgcGFydGljbGU6UGFydGljbGVEYXRhO1xuXG5cdFx0dmFyIG9uZURhdGFMZW46bnVtYmVyIC8qaW50Ki87XG5cdFx0dmFyIG9uZURhdGFPZmZzZXQ6bnVtYmVyIC8qaW50Ki87XG5cdFx0dmFyIGNvdW50ZXJGb3JWZXJ0ZXg6bnVtYmVyIC8qaW50Ki87XG5cdFx0dmFyIGNvdW50ZXJGb3JPbmVEYXRhOm51bWJlciAvKmludCovO1xuXHRcdHZhciBvbmVEYXRhOkFycmF5PG51bWJlcj47XG5cdFx0dmFyIG51bVZlcnRpY2VzOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgdmVydGV4RGF0YTpBcnJheTxudW1iZXI+O1xuXHRcdHZhciB2ZXJ0ZXhMZW5ndGg6bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciBzdGFydGluZ09mZnNldDpudW1iZXIgLyp1aW50Ki87XG5cdFx0dmFyIHZlcnRleE9mZnNldDpudW1iZXIgLyp1aW50Ki87XG5cblx0XHQvL2RlZmF1bHQgdmFsdWVzIGZvciBwYXJ0aWNsZSBwYXJhbVxuXHRcdHBhcnRpY2xlUHJvcGVydGllcy50b3RhbCA9IG51bVBhcnRpY2xlcztcblx0XHRwYXJ0aWNsZVByb3BlcnRpZXMuc3RhcnRUaW1lID0gMDtcblx0XHRwYXJ0aWNsZVByb3BlcnRpZXMuZHVyYXRpb24gPSAxMDAwO1xuXHRcdHBhcnRpY2xlUHJvcGVydGllcy5kZWxheSA9IDAuMTtcblxuXHRcdGkgPSAwO1xuXHRcdGogPSAwO1xuXHRcdHdoaWxlIChpIDwgbnVtUGFydGljbGVzKSB7XG5cdFx0XHRwYXJ0aWNsZVByb3BlcnRpZXMuaW5kZXggPSBpO1xuXG5cdFx0XHQvL2NhbGwgdGhlIGluaXQgb24gdGhlIHBhcnRpY2xlIHBhcmFtZXRlcnNcblx0XHRcdHRoaXMuaW5pdFBhcnRpY2xlRnVuYy5jYWxsKHRoaXMuaW5pdFBhcnRpY2xlU2NvcGUsIHBhcnRpY2xlUHJvcGVydGllcyk7XG5cblx0XHRcdC8vY3JlYXRlIHRoZSBuZXh0IHNldCBvZiBub2RlIHByb3BlcnRpZXMgZm9yIHRoZSBwYXJ0aWNsZVxuXHRcdFx0Zm9yIChrID0gMDsgayA8IHRoaXMuX2xvY2FsU3RhdGljTm9kZXMubGVuZ3RoOyBrKyspXG5cdFx0XHRcdHRoaXMuX2xvY2FsU3RhdGljTm9kZXNba10uX2lHZW5lcmF0ZVByb3BlcnR5T2ZPbmVQYXJ0aWNsZShwYXJ0aWNsZVByb3BlcnRpZXMpO1xuXG5cdFx0XHQvL2xvb3AgdGhyb3VnaCBhbGwgcGFydGljbGUgZGF0YSBmb3IgdGhlIGN1cmVudCBwYXJ0aWNsZVxuXHRcdFx0d2hpbGUgKGogPCBwYXJ0aWNsZXNMZW5ndGggJiYgKHBhcnRpY2xlID0gcGFydGljbGVzW2pdKS5wYXJ0aWNsZUluZGV4ID09IGkpIHtcblx0XHRcdFx0Ly9maW5kIHRoZSB0YXJnZXQgYW5pbWF0aW9uU3ViR2VvbWV0cnlcblx0XHRcdFx0Zm9yIChrID0gMDsgayA8IG1lc2guc3ViTWVzaGVzLmxlbmd0aDsgaysrKSB7XG5cdFx0XHRcdFx0c3ViTWVzaCA9IG1lc2guc3ViTWVzaGVzW2tdO1xuXHRcdFx0XHRcdGlmIChzdWJNZXNoLnN1Ykdlb21ldHJ5ID09IHBhcnRpY2xlLnN1Ykdlb21ldHJ5KSB7XG5cdFx0XHRcdFx0XHRhbmltYXRpb25TdWJHZW9tZXRyeSA9IChtZXNoLnNoYXJlQW5pbWF0aW9uR2VvbWV0cnkpPyB0aGlzLl9hbmltYXRpb25TdWJHZW9tZXRyaWVzW3N1Yk1lc2guc3ViR2VvbWV0cnkuaWRdIDogdGhpcy5fYW5pbWF0aW9uU3ViR2VvbWV0cmllc1tzdWJNZXNoLmlkXTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRudW1WZXJ0aWNlcyA9IHBhcnRpY2xlLm51bVZlcnRpY2VzO1xuXHRcdFx0XHR2ZXJ0ZXhEYXRhID0gYW5pbWF0aW9uU3ViR2VvbWV0cnkudmVydGV4RGF0YTtcblx0XHRcdFx0dmVydGV4TGVuZ3RoID0gbnVtVmVydGljZXMqdGhpcy5fdG90YWxMZW5PZk9uZVZlcnRleDtcblx0XHRcdFx0c3RhcnRpbmdPZmZzZXQgPSBhbmltYXRpb25TdWJHZW9tZXRyeS5udW1Qcm9jZXNzZWRWZXJ0aWNlcyp0aGlzLl90b3RhbExlbk9mT25lVmVydGV4O1xuXG5cdFx0XHRcdC8vbG9vcCB0aHJvdWdoIGVhY2ggc3RhdGljIGxvY2FsIG5vZGUgaW4gdGhlIGFuaW1hdGlvbiBzZXRcblx0XHRcdFx0Zm9yIChrID0gMDsgayA8IHRoaXMuX2xvY2FsU3RhdGljTm9kZXMubGVuZ3RoOyBrKyspIHtcblx0XHRcdFx0XHRsb2NhbE5vZGUgPSB0aGlzLl9sb2NhbFN0YXRpY05vZGVzW2tdO1xuXHRcdFx0XHRcdG9uZURhdGEgPSBsb2NhbE5vZGUub25lRGF0YTtcblx0XHRcdFx0XHRvbmVEYXRhTGVuID0gbG9jYWxOb2RlLmRhdGFMZW5ndGg7XG5cdFx0XHRcdFx0b25lRGF0YU9mZnNldCA9IHN0YXJ0aW5nT2Zmc2V0ICsgbG9jYWxOb2RlLl9pRGF0YU9mZnNldDtcblxuXHRcdFx0XHRcdC8vbG9vcCB0aHJvdWdoIGVhY2ggdmVydGV4IHNldCBpbiB0aGUgdmVydGV4IGRhdGFcblx0XHRcdFx0XHRmb3IgKGNvdW50ZXJGb3JWZXJ0ZXggPSAwOyBjb3VudGVyRm9yVmVydGV4IDwgdmVydGV4TGVuZ3RoOyBjb3VudGVyRm9yVmVydGV4ICs9IHRoaXMuX3RvdGFsTGVuT2ZPbmVWZXJ0ZXgpIHtcblx0XHRcdFx0XHRcdHZlcnRleE9mZnNldCA9IG9uZURhdGFPZmZzZXQgKyBjb3VudGVyRm9yVmVydGV4O1xuXG5cdFx0XHRcdFx0XHQvL2FkZCB0aGUgZGF0YSBmb3IgdGhlIGxvY2FsIG5vZGUgdG8gdGhlIHZlcnRleCBkYXRhXG5cdFx0XHRcdFx0XHRmb3IgKGNvdW50ZXJGb3JPbmVEYXRhID0gMDsgY291bnRlckZvck9uZURhdGEgPCBvbmVEYXRhTGVuOyBjb3VudGVyRm9yT25lRGF0YSsrKVxuXHRcdFx0XHRcdFx0XHR2ZXJ0ZXhEYXRhW3ZlcnRleE9mZnNldCArIGNvdW50ZXJGb3JPbmVEYXRhXSA9IG9uZURhdGFbY291bnRlckZvck9uZURhdGFdO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9zdG9yZSBwYXJ0aWNsZSBwcm9wZXJ0aWVzIGlmIHRoZXkgbmVlZCB0byBiZSByZXRyZWl2ZWQgZm9yIGR5bmFtaWMgbG9jYWwgbm9kZXNcblx0XHRcdFx0aWYgKHRoaXMuX2xvY2FsRHluYW1pY05vZGVzLmxlbmd0aClcblx0XHRcdFx0XHRhbmltYXRpb25TdWJHZW9tZXRyeS5hbmltYXRpb25QYXJ0aWNsZXMucHVzaChuZXcgUGFydGljbGVBbmltYXRpb25EYXRhKGksIHBhcnRpY2xlUHJvcGVydGllcy5zdGFydFRpbWUsIHBhcnRpY2xlUHJvcGVydGllcy5kdXJhdGlvbiwgcGFydGljbGVQcm9wZXJ0aWVzLmRlbGF5LCBwYXJ0aWNsZSkpO1xuXG5cdFx0XHRcdGFuaW1hdGlvblN1Ykdlb21ldHJ5Lm51bVByb2Nlc3NlZFZlcnRpY2VzICs9IG51bVZlcnRpY2VzO1xuXG5cdFx0XHRcdC8vbmV4dCBpbmRleFxuXHRcdFx0XHRqKys7XG5cdFx0XHR9XG5cblx0XHRcdC8vbmV4dCBwYXJ0aWNsZVxuXHRcdFx0aSsrO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgPSBQYXJ0aWNsZUFuaW1hdGlvblNldDsiXX0=