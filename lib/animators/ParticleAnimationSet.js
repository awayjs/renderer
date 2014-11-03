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
        //			var context:IContextGL = <IContextGL> stage.context;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvcGFydGljbGVhbmltYXRpb25zZXQudHMiXSwibmFtZXMiOlsiUGFydGljbGVBbmltYXRpb25TZXQiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5jb25zdHJ1Y3RvciIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LnBhcnRpY2xlTm9kZXMiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5hZGRBbmltYXRpb24iLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5hY3RpdmF0ZSIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LmRlYWN0aXZhdGUiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5nZXRBR0FMVmVydGV4Q29kZSIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LmdldEFHQUxVVkNvZGUiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5nZXRBR0FMRnJhZ21lbnRDb2RlIiwiUGFydGljbGVBbmltYXRpb25TZXQuZG9uZUFHQUxDb2RlIiwiUGFydGljbGVBbmltYXRpb25TZXQudXNlc0NQVSIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LmNhbmNlbEdQVUNvbXBhdGliaWxpdHkiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5kaXNwb3NlIiwiUGFydGljbGVBbmltYXRpb25TZXQuZ2V0QW5pbWF0aW9uU3ViR2VvbWV0cnkiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5faUdlbmVyYXRlQW5pbWF0aW9uU3ViR2VvbWV0cmllcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBUUEsSUFBTyxnQkFBZ0IsV0FBZSxrREFBa0QsQ0FBQyxDQUFDO0FBRTFGLElBQU8sc0JBQXNCLFdBQWEsNkRBQTZELENBQUMsQ0FBQztBQUN6RyxJQUFPLG9CQUFvQixXQUFjLDJEQUEyRCxDQUFDLENBQUM7QUFDdEcsSUFBTyxxQkFBcUIsV0FBYSw0REFBNEQsQ0FBQyxDQUFDO0FBQ3ZHLElBQU8sa0JBQWtCLFdBQWMseURBQXlELENBQUMsQ0FBQztBQUNsRyxJQUFPLHNCQUFzQixXQUFhLDZE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a0JBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsa0JBQWtCQSxDQUFDQSxTQUFTQSxFQUFFQSxrQkFBa0JBLENBQUNBLFFBQVFBLEVBQUVBLGtCQUFrQkEsQ0FBQ0EsS0FBS0EsRUFBRUEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRTNLQSxvQkFBb0JBLENBQUNBLG9CQUFvQkEsSUFBSUEsV0FBV0EsQ0FBQ0E7Z0JBRXpEQSxBQUNBQSxZQURZQTtnQkFDWkEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFFREEsQUFDQUEsZUFEZUE7WUFDZkEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7UUFDTEEsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUF6WERkOztPQUVHQTtJQUNXQSxrQ0FBYUEsR0FBa0JBLENBQUNBLENBQUNBO0lBRS9DQTs7T0FFR0E7SUFDV0EsbUNBQWNBLEdBQWtCQSxFQUFFQSxDQUFDQTtJQWtYbERBLDJCQUFDQTtBQUFEQSxDQWxZQSxBQWtZQ0EsRUFsWWtDLGdCQUFnQixFQWtZbEQ7QUFFRCxBQUE4QixpQkFBckIsb0JBQW9CLENBQUMiLCJmaWxlIjoiYW5pbWF0b3JzL1BhcnRpY2xlQW5pbWF0aW9uU2V0LmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJQW5pbWF0aW9uU2V0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9hbmltYXRvcnMvSUFuaW1hdGlvblNldFwiKTtcbmltcG9ydCBBbmltYXRpb25Ob2RlQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2FuaW1hdG9ycy9ub2Rlcy9BbmltYXRpb25Ob2RlQmFzZVwiKTtcbmltcG9ydCBJU3ViTWVzaFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvSVN1Yk1lc2hcIik7XG5pbXBvcnQgU3ViR2VvbWV0cnlCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL1N1Ykdlb21ldHJ5QmFzZVwiKTtcbmltcG9ydCBNZXNoXHRcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9NZXNoXCIpO1xuXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuXG5pbXBvcnQgQW5pbWF0aW9uU2V0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL0FuaW1hdGlvblNldEJhc2VcIik7XG5pbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XG5pbXBvcnQgQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9BbmltYXRpb25SZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IEFuaW1hdGlvblN1Ykdlb21ldHJ5XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvQW5pbWF0aW9uU3ViR2VvbWV0cnlcIik7XG5pbXBvcnQgUGFydGljbGVBbmltYXRpb25EYXRhXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1BhcnRpY2xlQW5pbWF0aW9uRGF0YVwiKTtcbmltcG9ydCBQYXJ0aWNsZVByb3BlcnRpZXNcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9QYXJ0aWNsZVByb3BlcnRpZXNcIik7XG5pbXBvcnQgUGFydGljbGVQcm9wZXJ0aWVzTW9kZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9QYXJ0aWNsZVByb3BlcnRpZXNNb2RlXCIpO1xuaW1wb3J0IFBhcnRpY2xlRGF0YVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9QYXJ0aWNsZURhdGFcIik7XG5pbXBvcnQgUGFydGljbGVOb2RlQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL25vZGVzL1BhcnRpY2xlTm9kZUJhc2VcIik7XG5pbXBvcnQgUGFydGljbGVUaW1lTm9kZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL25vZGVzL1BhcnRpY2xlVGltZU5vZGVcIik7XG5pbXBvcnQgUGFydGljbGVHZW9tZXRyeVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYmFzZS9QYXJ0aWNsZUdlb21ldHJ5XCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuXG5cbi8qKlxuICogVGhlIGFuaW1hdGlvbiBkYXRhIHNldCB1c2VkIGJ5IHBhcnRpY2xlLWJhc2VkIGFuaW1hdG9ycywgY29udGFpbmluZyBwYXJ0aWNsZSBhbmltYXRpb24gZGF0YS5cbiAqXG4gKiBAc2VlIGF3YXkuYW5pbWF0b3JzLlBhcnRpY2xlQW5pbWF0b3JcbiAqL1xuY2xhc3MgUGFydGljbGVBbmltYXRpb25TZXQgZXh0ZW5kcyBBbmltYXRpb25TZXRCYXNlIGltcGxlbWVudHMgSUFuaW1hdGlvblNldFxue1xuXHQvKiogQHByaXZhdGUgKi9cblx0cHVibGljIF9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZTpBbmltYXRpb25SZWdpc3RlckNhY2hlO1xuXG5cdC8vYWxsIG90aGVyIG5vZGVzIGRlcGVuZGVudCBvbiBpdFxuXHRwcml2YXRlIF90aW1lTm9kZTpQYXJ0aWNsZVRpbWVOb2RlO1xuXG5cdC8qKlxuXHQgKiBQcm9wZXJ0eSB1c2VkIGJ5IHBhcnRpY2xlIG5vZGVzIHRoYXQgcmVxdWlyZSBjb21waWxhdGlvbiBhdCB0aGUgZW5kIG9mIHRoZSBzaGFkZXJcblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgUE9TVF9QUklPUklUWTpudW1iZXIgLyppbnQqLyA9IDk7XG5cblx0LyoqXG5cdCAqIFByb3BlcnR5IHVzZWQgYnkgcGFydGljbGUgbm9kZXMgdGhhdCByZXF1aXJlIGNvbG9yIGNvbXBpbGF0aW9uXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIENPTE9SX1BSSU9SSVRZOm51bWJlciAvKmludCovID0gMTg7XG5cblx0cHJpdmF0ZSBfYW5pbWF0aW9uU3ViR2VvbWV0cmllczpPYmplY3QgPSBuZXcgT2JqZWN0KCk7XG5cdHByaXZhdGUgX3BhcnRpY2xlTm9kZXM6QXJyYXk8UGFydGljbGVOb2RlQmFzZT4gPSBuZXcgQXJyYXk8UGFydGljbGVOb2RlQmFzZT4oKTtcblx0cHJpdmF0ZSBfbG9jYWxEeW5hbWljTm9kZXM6QXJyYXk8UGFydGljbGVOb2RlQmFzZT4gPSBuZXcgQXJyYXk8UGFydGljbGVOb2RlQmFzZT4oKTtcblx0cHJpdmF0ZSBfbG9jYWxTdGF0aWNOb2RlczpBcnJheTxQYXJ0aWNsZU5vZGVCYXNlPiA9IG5ldyBBcnJheTxQYXJ0aWNsZU5vZGVCYXNlPigpO1xuXHRwcml2YXRlIF90b3RhbExlbk9mT25lVmVydGV4Om51bWJlciAvKmludCovID0gMDtcblxuXHQvL3NldCB0cnVlIGlmIGhhcyBhbiBub2RlIHdoaWNoIHdpbGwgY2hhbmdlIFVWXG5cdHB1YmxpYyBoYXNVVk5vZGU6Ym9vbGVhbjtcblx0Ly9zZXQgaWYgdGhlIG90aGVyIG5vZGVzIG5lZWQgdG8gYWNjZXNzIHRoZSB2ZWxvY2l0eVxuXHRwdWJsaWMgbmVlZFZlbG9jaXR5OmJvb2xlYW47XG5cdC8vc2V0IGlmIGhhcyBhIGJpbGxib2FyZCBub2RlLlxuXHRwdWJsaWMgaGFzQmlsbGJvYXJkOmJvb2xlYW47XG5cdC8vc2V0IGlmIGhhcyBhbiBub2RlIHdoaWNoIHdpbGwgYXBwbHkgY29sb3IgbXVsdGlwbGUgb3BlcmF0aW9uXG5cdHB1YmxpYyBoYXNDb2xvck11bE5vZGU6Ym9vbGVhbjtcblx0Ly9zZXQgaWYgaGFzIGFuIG5vZGUgd2hpY2ggd2lsbCBhcHBseSBjb2xvciBhZGQgb3BlcmF0aW9uXG5cdHB1YmxpYyBoYXNDb2xvckFkZE5vZGU6Ym9vbGVhbjtcblxuXHQvKipcblx0ICogSW5pdGlhbGlzZXIgZnVuY3Rpb24gZm9yIHN0YXRpYyBwYXJ0aWNsZSBwcm9wZXJ0aWVzLiBOZWVkcyB0byByZWZlcmVuY2UgYSB3aXRoIHRoZSBmb2xsb3dpbmcgZm9ybWF0XG5cdCAqXG5cdCAqIDxjb2RlPlxuXHQgKiBpbml0UGFydGljbGVGdW5jKHByb3A6UGFydGljbGVQcm9wZXJ0aWVzKVxuXHQgKiB7XG5cdCAqIFx0XHQvL2NvZGUgZm9yIHNldHRpbmdzIGxvY2FsIHByb3BlcnRpZXNcblx0ICogfVxuXHQgKiA8L2NvZGU+XG5cdCAqXG5cdCAqIEFzaWRlIGZyb20gc2V0dGluZyBhbnkgcHJvcGVydGllcyByZXF1aXJlZCBpbiBwYXJ0aWNsZSBhbmltYXRpb24gbm9kZXMgdXNpbmcgbG9jYWwgc3RhdGljIHByb3BlcnRpZXMsIHRoZSBpbml0UGFydGljbGVGdW5jIGZ1bmN0aW9uXG5cdCAqIGlzIHJlcXVpcmVkIHRvIHRpbWUgbm9kZSByZXF1aXJlbWVudHMgYXMgdGhleSBtYXkgYmUgbmVlZGVkLiBUaGVzZSBwcm9wZXJ0aWVzIG9uIHRoZSBQYXJ0aWNsZVByb3BlcnRpZXMgb2JqZWN0IGNhbiBpbmNsdWRlXG5cdCAqIDxjb2RlPnN0YXJ0VGltZTwvY29kZT4sIDxjb2RlPmR1cmF0aW9uPC9jb2RlPiBhbmQgPGNvZGU+ZGVsYXk8L2NvZGU+LiBUaGUgdXNlIG9mIHRoZXNlIHByb3BlcnRpZXMgaXMgZGV0ZXJtaW5lZCBieSB0aGUgc2V0dGluZ1xuXHQgKiBhcmd1bWVudHMgcGFzc2VkIGluIHRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgcGFydGljbGUgYW5pbWF0aW9uIHNldC4gQnkgZGVmYXVsdCwgb25seSB0aGUgPGNvZGU+c3RhcnRUaW1lPC9jb2RlPiBwcm9wZXJ0eSBpcyByZXF1aXJlZC5cblx0ICovXG5cdHB1YmxpYyBpbml0UGFydGljbGVGdW5jOkZ1bmN0aW9uO1xuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXNlciBmdW5jdGlvbiBzY29wZSBmb3Igc3RhdGljIHBhcnRpY2xlIHByb3BlcnRpZXNcblx0ICovXG5cdHB1YmxpYyBpbml0UGFydGljbGVTY29wZTpPYmplY3Q7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgPGNvZGU+UGFydGljbGVBbmltYXRpb25TZXQ8L2NvZGU+XG5cdCAqXG5cdCAqIEBwYXJhbSAgICBbb3B0aW9uYWxdIHVzZXNEdXJhdGlvbiAgICBEZWZpbmVzIHdoZXRoZXIgdGhlIGFuaW1hdGlvbiBzZXQgdXNlcyB0aGUgPGNvZGU+ZHVyYXRpb248L2NvZGU+IGRhdGEgaW4gaXRzIHN0YXRpYyBwcm9wZXJ0aWVzIHRvIGRldGVybWluZSBob3cgbG9uZyBhIHBhcnRpY2xlIGlzIHZpc2libGUgZm9yLiBEZWZhdWx0cyB0byBmYWxzZS5cblx0ICogQHBhcmFtICAgIFtvcHRpb25hbF0gdXNlc0xvb3BpbmcgICAgIERlZmluZXMgd2hldGhlciB0aGUgYW5pbWF0aW9uIHNldCB1c2VzIGEgbG9vcGluZyB0aW1lZnJhbWUgZm9yIGVhY2ggcGFydGljbGUgZGV0ZXJtaW5lZCBieSB0aGUgPGNvZGU+c3RhcnRUaW1lPC9jb2RlPiwgPGNvZGU+ZHVyYXRpb248L2NvZGU+IGFuZCA8Y29kZT5kZWxheTwvY29kZT4gZGF0YSBpbiBpdHMgc3RhdGljIHByb3BlcnRpZXMgZnVuY3Rpb24uIERlZmF1bHRzIHRvIGZhbHNlLiBSZXF1aXJlcyA8Y29kZT51c2VzRHVyYXRpb248L2NvZGU+IHRvIGJlIHRydWUuXG5cdCAqIEBwYXJhbSAgICBbb3B0aW9uYWxdIHVzZXNEZWxheSAgICAgICBEZWZpbmVzIHdoZXRoZXIgdGhlIGFuaW1hdGlvbiBzZXQgdXNlcyB0aGUgPGNvZGU+ZGVsYXk8L2NvZGU+IGRhdGEgaW4gaXRzIHN0YXRpYyBwcm9wZXJ0aWVzIHRvIGRldGVybWluZSBob3cgbG9uZyBhIHBhcnRpY2xlIGlzIGhpZGRlbiBmb3IuIERlZmF1bHRzIHRvIGZhbHNlLiBSZXF1aXJlcyA8Y29kZT51c2VzTG9vcGluZzwvY29kZT4gdG8gYmUgdHJ1ZS5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHVzZXNEdXJhdGlvbjpib29sZWFuID0gZmFsc2UsIHVzZXNMb29waW5nOmJvb2xlYW4gPSBmYWxzZSwgdXNlc0RlbGF5OmJvb2xlYW4gPSBmYWxzZSlcblx0e1xuXHRcdHN1cGVyKCk7XG5cblx0XHQvL2F1dG9tYXRpY2FsbHkgYWRkIGEgcGFydGljbGUgdGltZSBub2RlIHRvIHRoZSBzZXRcblx0XHR0aGlzLmFkZEFuaW1hdGlvbih0aGlzLl90aW1lTm9kZSA9IG5ldyBQYXJ0aWNsZVRpbWVOb2RlKHVzZXNEdXJhdGlvbiwgdXNlc0xvb3BpbmcsIHVzZXNEZWxheSkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYSB2ZWN0b3Igb2YgdGhlIHBhcnRpY2xlIGFuaW1hdGlvbiBub2RlcyBjb250YWluZWQgd2l0aGluIHRoZSBzZXQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHBhcnRpY2xlTm9kZXMoKTpBcnJheTxQYXJ0aWNsZU5vZGVCYXNlPlxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3BhcnRpY2xlTm9kZXM7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBhZGRBbmltYXRpb24obm9kZTpBbmltYXRpb25Ob2RlQmFzZSlcblx0e1xuXHRcdHZhciBpOm51bWJlciAvKmludCovO1xuXHRcdHZhciBuOlBhcnRpY2xlTm9kZUJhc2UgPSA8UGFydGljbGVOb2RlQmFzZT4gbm9kZTtcblx0XHRuLl9pUHJvY2Vzc0FuaW1hdGlvblNldHRpbmcodGhpcyk7XG5cdFx0aWYgKG4ubW9kZSA9PSBQYXJ0aWNsZVByb3BlcnRpZXNNb2RlLkxPQ0FMX1NUQVRJQykge1xuXHRcdFx0bi5faURhdGFPZmZzZXQgPSB0aGlzLl90b3RhbExlbk9mT25lVmVydGV4O1xuXHRcdFx0dGhpcy5fdG90YWxMZW5PZk9uZVZlcnRleCArPSBuLmRhdGFMZW5ndGg7XG5cdFx0XHR0aGlzLl9sb2NhbFN0YXRpY05vZGVzLnB1c2gobik7XG5cdFx0fSBlbHNlIGlmIChuLm1vZGUgPT0gUGFydGljbGVQcm9wZXJ0aWVzTW9kZS5MT0NBTF9EWU5BTUlDKVxuXHRcdFx0dGhpcy5fbG9jYWxEeW5hbWljTm9kZXMucHVzaChuKTtcblxuXHRcdGZvciAoaSA9IHRoaXMuX3BhcnRpY2xlTm9kZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdGlmICh0aGlzLl9wYXJ0aWNsZU5vZGVzW2ldLnByaW9yaXR5IDw9IG4ucHJpb3JpdHkpXG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdHRoaXMuX3BhcnRpY2xlTm9kZXMuc3BsaWNlKGkgKyAxLCAwLCBuKTtcblxuXHRcdHN1cGVyLmFkZEFuaW1hdGlvbihub2RlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBzdGFnZTpTdGFnZSlcblx0e1xuLy9cdFx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSA9IHBhc3MuYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGRlYWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHN0YWdlOlN0YWdlKVxuXHR7XG4vL1x0XHRcdHZhciBjb250ZXh0OklDb250ZXh0R0wgPSA8SUNvbnRleHRHTD4gc3RhZ2UuY29udGV4dDtcbi8vXHRcdFx0dmFyIG9mZnNldDpudW1iZXIgLyppbnQqLyA9IHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnZlcnRleEF0dHJpYnV0ZXNPZmZzZXQ7XG4vL1x0XHRcdHZhciB1c2VkOm51bWJlciAvKmludCovID0gdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUubnVtVXNlZFN0cmVhbXM7XG4vL1x0XHRcdGZvciAodmFyIGk6bnVtYmVyIC8qaW50Ki8gPSBvZmZzZXQ7IGkgPCB1c2VkOyBpKyspXG4vL1x0XHRcdFx0Y29udGV4dC5zZXRWZXJ0ZXhCdWZmZXJBdChpLCBudWxsKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldEFHQUxWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpzdHJpbmdcblx0e1xuXHRcdC8vZ3JhYiBhbmltYXRpb25SZWdpc3RlckNhY2hlIGZyb20gdGhlIG1hdGVyaWFscGFzc2Jhc2Ugb3IgY3JlYXRlIGEgbmV3IG9uZSBpZiB0aGUgZmlyc3QgdGltZVxuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlID0gc2hhZGVyT2JqZWN0LmFuaW1hdGlvblJlZ2lzdGVyQ2FjaGU7XG5cblx0XHRpZiAodGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUgPT0gbnVsbClcblx0XHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlID0gc2hhZGVyT2JqZWN0LmFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUgPSBuZXcgQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZShzaGFkZXJPYmplY3QucHJvZmlsZSk7XG5cblx0XHQvL3Jlc2V0IGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGVcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS52ZXJ0ZXhDb25zdGFudE9mZnNldCA9IHNoYWRlck9iamVjdC5udW1Vc2VkVmVydGV4Q29uc3RhbnRzO1xuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnZlcnRleEF0dHJpYnV0ZXNPZmZzZXQgPSBzaGFkZXJPYmplY3QubnVtVXNlZFN0cmVhbXM7XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudmFyeWluZ3NPZmZzZXQgPSBzaGFkZXJPYmplY3QubnVtVXNlZFZhcnlpbmdzO1xuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLmZyYWdtZW50Q29uc3RhbnRPZmZzZXQgPSBzaGFkZXJPYmplY3QubnVtVXNlZEZyYWdtZW50Q29uc3RhbnRzO1xuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLmhhc1VWTm9kZSA9IHRoaXMuaGFzVVZOb2RlO1xuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLm5lZWRWZWxvY2l0eSA9IHRoaXMubmVlZFZlbG9jaXR5O1xuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLmhhc0JpbGxib2FyZCA9IHRoaXMuaGFzQmlsbGJvYXJkO1xuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnNvdXJjZVJlZ2lzdGVycyA9IHNoYWRlck9iamVjdC5hbmltYXRhYmxlQXR0cmlidXRlcztcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS50YXJnZXRSZWdpc3RlcnMgPSBzaGFkZXJPYmplY3QuYW5pbWF0aW9uVGFyZ2V0UmVnaXN0ZXJzO1xuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLm5lZWRGcmFnbWVudEFuaW1hdGlvbiA9IHNoYWRlck9iamVjdC51c2VzRnJhZ21lbnRBbmltYXRpb247XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUubmVlZFVWQW5pbWF0aW9uID0gIXNoYWRlck9iamVjdC51c2VzVVZUcmFuc2Zvcm07XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuaGFzQ29sb3JBZGROb2RlID0gdGhpcy5oYXNDb2xvckFkZE5vZGU7XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuaGFzQ29sb3JNdWxOb2RlID0gdGhpcy5oYXNDb2xvck11bE5vZGU7XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUucmVzZXQoKTtcblxuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XG5cblx0XHRjb2RlICs9IHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLmdldEluaXRDb2RlKCk7XG5cblx0XHR2YXIgbm9kZTpQYXJ0aWNsZU5vZGVCYXNlO1xuXHRcdHZhciBpOm51bWJlciAvKmludCovO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IHRoaXMuX3BhcnRpY2xlTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdG5vZGUgPSB0aGlzLl9wYXJ0aWNsZU5vZGVzW2ldO1xuXHRcdFx0aWYgKG5vZGUucHJpb3JpdHkgPCBQYXJ0aWNsZUFuaW1hdGlvblNldC5QT1NUX1BSSU9SSVRZKVxuXHRcdFx0XHRjb2RlICs9IG5vZGUuZ2V0QUdBTFZlcnRleENvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSk7XG5cdFx0fVxuXG5cdFx0Y29kZSArPSB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5nZXRDb21iaW5hdGlvbkNvZGUoKTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCB0aGlzLl9wYXJ0aWNsZU5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRub2RlID0gdGhpcy5fcGFydGljbGVOb2Rlc1tpXTtcblx0XHRcdGlmIChub2RlLnByaW9yaXR5ID49IFBhcnRpY2xlQW5pbWF0aW9uU2V0LlBPU1RfUFJJT1JJVFkgJiYgbm9kZS5wcmlvcml0eSA8IFBhcnRpY2xlQW5pbWF0aW9uU2V0LkNPTE9SX1BSSU9SSVRZKVxuXHRcdFx0XHRjb2RlICs9IG5vZGUuZ2V0QUdBTFZlcnRleENvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSk7XG5cdFx0fVxuXG5cdFx0Y29kZSArPSB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5pbml0Q29sb3JSZWdpc3RlcnMoKTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCB0aGlzLl9wYXJ0aWNsZU5vZGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRub2RlID0gdGhpcy5fcGFydGljbGVOb2Rlc1tpXTtcblx0XHRcdGlmIChub2RlLnByaW9yaXR5ID49IFBhcnRpY2xlQW5pbWF0aW9uU2V0LkNPTE9SX1BSSU9SSVRZKVxuXHRcdFx0XHRjb2RlICs9IG5vZGUuZ2V0QUdBTFZlcnRleENvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSk7XG5cdFx0fVxuXHRcdGNvZGUgKz0gdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuZ2V0Q29sb3JQYXNzQ29kZSgpO1xuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0QUdBTFVWQ29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY29kZTpzdHJpbmcgPSBcIlwiO1xuXHRcdGlmICh0aGlzLmhhc1VWTm9kZSkge1xuXHRcdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuc2V0VVZTb3VyY2VBbmRUYXJnZXQoc2hhZGVyT2JqZWN0LnV2U291cmNlLCBzaGFkZXJPYmplY3QudXZUYXJnZXQpO1xuXHRcdFx0Y29kZSArPSBcIm1vdiBcIiArIHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnV2VGFyZ2V0ICsgXCIueHksXCIgKyB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS51dkF0dHJpYnV0ZS50b1N0cmluZygpICsgXCJcXG5cIjtcblx0XHRcdHZhciBub2RlOlBhcnRpY2xlTm9kZUJhc2U7XG5cdFx0XHRmb3IgKHZhciBpOm51bWJlciAvKnVpbnQqLyA9IDA7IGkgPCB0aGlzLl9wYXJ0aWNsZU5vZGVzLmxlbmd0aDsgaSsrKVxuXHRcdFx0XHRub2RlID0gdGhpcy5fcGFydGljbGVOb2Rlc1tpXTtcblx0XHRcdFx0Y29kZSArPSBub2RlLmdldEFHQUxVVkNvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSk7XG5cdFx0XHRjb2RlICs9IFwibW92IFwiICsgdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudXZWYXIudG9TdHJpbmcoKSArIFwiLFwiICsgdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudXZUYXJnZXQgKyBcIi54eVxcblwiO1xuXHRcdH0gZWxzZVxuXHRcdFx0Y29kZSArPSBcIm1vdiBcIiArIHNoYWRlck9iamVjdC51dlRhcmdldCArIFwiLFwiICsgc2hhZGVyT2JqZWN0LnV2U291cmNlICsgXCJcXG5cIjtcblx0XHRyZXR1cm4gY29kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGdldEFHQUxGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHNoYWRlZFRhcmdldDpzdHJpbmcpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLmdldENvbG9yQ29tYmluYXRpb25Db2RlKHNoYWRlZFRhcmdldCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBkb25lQUdBTENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpXG5cdHtcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5zZXREYXRhTGVuZ3RoKCk7XG5cblx0XHQvL3NldCB2ZXJ0ZXhaZXJvQ29uc3QsdmVydGV4T25lQ29uc3QsdmVydGV4VHdvQ29uc3Rcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5zZXRWZXJ0ZXhDb25zdCh0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS52ZXJ0ZXhaZXJvQ29uc3QuaW5kZXgsIDAsIDEsIDIsIDApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHVzZXNDUFUoKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBjYW5jZWxHUFVDb21wYXRpYmlsaXR5KClcblx0e1xuXG5cdH1cblxuXHRwdWJsaWMgZGlzcG9zZSgpXG5cdHtcblx0XHRmb3IgKHZhciBrZXkgaW4gdGhpcy5fYW5pbWF0aW9uU3ViR2VvbWV0cmllcylcblx0XHRcdCg8QW5pbWF0aW9uU3ViR2VvbWV0cnk+IHRoaXMuX2FuaW1hdGlvblN1Ykdlb21ldHJpZXNba2V5XSkuZGlzcG9zZSgpO1xuXG5cdFx0c3VwZXIuZGlzcG9zZSgpO1xuXHR9XG5cblx0cHVibGljIGdldEFuaW1hdGlvblN1Ykdlb21ldHJ5KHN1Yk1lc2g6SVN1Yk1lc2gpXG5cdHtcblx0XHR2YXIgbWVzaDpNZXNoID0gc3ViTWVzaC5wYXJlbnRNZXNoO1xuXHRcdHZhciBhbmltYXRpb25TdWJHZW9tZXRyeTpBbmltYXRpb25TdWJHZW9tZXRyeSA9IChtZXNoLnNoYXJlQW5pbWF0aW9uR2VvbWV0cnkpPyB0aGlzLl9hbmltYXRpb25TdWJHZW9tZXRyaWVzW3N1Yk1lc2guc3ViR2VvbWV0cnkuaWRdIDogdGhpcy5fYW5pbWF0aW9uU3ViR2VvbWV0cmllc1tzdWJNZXNoLmlkXTtcblxuXHRcdGlmIChhbmltYXRpb25TdWJHZW9tZXRyeSlcblx0XHRcdHJldHVybiBhbmltYXRpb25TdWJHZW9tZXRyeTtcblxuXHRcdHRoaXMuX2lHZW5lcmF0ZUFuaW1hdGlvblN1Ykdlb21ldHJpZXMobWVzaCk7XG5cblx0XHRyZXR1cm4gKG1lc2guc2hhcmVBbmltYXRpb25HZW9tZXRyeSk/IHRoaXMuX2FuaW1hdGlvblN1Ykdlb21ldHJpZXNbc3ViTWVzaC5zdWJHZW9tZXRyeS5pZF0gOiB0aGlzLl9hbmltYXRpb25TdWJHZW9tZXRyaWVzW3N1Yk1lc2guaWRdO1xuXHR9XG5cblxuXHQvKiogQHByaXZhdGUgKi9cblx0cHVibGljIF9pR2VuZXJhdGVBbmltYXRpb25TdWJHZW9tZXRyaWVzKG1lc2g6TWVzaClcblx0e1xuXHRcdGlmICh0aGlzLmluaXRQYXJ0aWNsZUZ1bmMgPT0gbnVsbClcblx0XHRcdHRocm93KG5ldyBFcnJvcihcIm5vIGluaXRQYXJ0aWNsZUZ1bmMgc2V0XCIpKTtcblxuXHRcdHZhciBnZW9tZXRyeTpQYXJ0aWNsZUdlb21ldHJ5ID0gPFBhcnRpY2xlR2VvbWV0cnk+IG1lc2guZ2VvbWV0cnk7XG5cblx0XHRpZiAoIWdlb21ldHJ5KVxuXHRcdFx0dGhyb3cobmV3IEVycm9yKFwiUGFydGljbGUgYW5pbWF0aW9uIGNhbiBvbmx5IGJlIHBlcmZvcm1lZCBvbiBhIFBhcnRpY2xlR2VvbWV0cnkgb2JqZWN0XCIpKTtcblxuXHRcdHZhciBpOm51bWJlciAvKmludCovLCBqOm51bWJlciAvKmludCovLCBrOm51bWJlciAvKmludCovO1xuXHRcdHZhciBhbmltYXRpb25TdWJHZW9tZXRyeTpBbmltYXRpb25TdWJHZW9tZXRyeTtcblx0XHR2YXIgbmV3QW5pbWF0aW9uU3ViR2VvbWV0cnk6Ym9vbGVhbiA9IGZhbHNlO1xuXHRcdHZhciBzdWJHZW9tZXRyeTpTdWJHZW9tZXRyeUJhc2U7XG5cdFx0dmFyIHN1Yk1lc2g6SVN1Yk1lc2g7XG5cdFx0dmFyIGxvY2FsTm9kZTpQYXJ0aWNsZU5vZGVCYXNlO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IG1lc2guc3ViTWVzaGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRzdWJNZXNoID0gbWVzaC5zdWJNZXNoZXNbaV07XG5cdFx0XHRzdWJHZW9tZXRyeSA9IHN1Yk1lc2guc3ViR2VvbWV0cnk7XG5cdFx0XHRpZiAobWVzaC5zaGFyZUFuaW1hdGlvbkdlb21ldHJ5KSB7XG5cdFx0XHRcdGFuaW1hdGlvblN1Ykdlb21ldHJ5ID0gdGhpcy5fYW5pbWF0aW9uU3ViR2VvbWV0cmllc1tzdWJHZW9tZXRyeS5pZF07XG5cblx0XHRcdFx0aWYgKGFuaW1hdGlvblN1Ykdlb21ldHJ5KVxuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRhbmltYXRpb25TdWJHZW9tZXRyeSA9IG5ldyBBbmltYXRpb25TdWJHZW9tZXRyeSgpO1xuXG5cdFx0XHRpZiAobWVzaC5zaGFyZUFuaW1hdGlvbkdlb21ldHJ5KVxuXHRcdFx0XHR0aGlzLl9hbmltYXRpb25TdWJHZW9tZXRyaWVzW3N1Ykdlb21ldHJ5LmlkXSA9IGFuaW1hdGlvblN1Ykdlb21ldHJ5O1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHR0aGlzLl9hbmltYXRpb25TdWJHZW9tZXRyaWVzW3N1Yk1lc2guaWRdID0gYW5pbWF0aW9uU3ViR2VvbWV0cnk7XG5cblx0XHRcdG5ld0FuaW1hdGlvblN1Ykdlb21ldHJ5ID0gdHJ1ZTtcblxuXHRcdFx0Ly9jcmVhdGUgdGhlIHZlcnRleERhdGEgdmVjdG9yIHRoYXQgd2lsbCBiZSB1c2VkIGZvciBsb2NhbCBub2RlIGRhdGFcblx0XHRcdGFuaW1hdGlvblN1Ykdlb21ldHJ5LmNyZWF0ZVZlcnRleERhdGEoc3ViR2VvbWV0cnkubnVtVmVydGljZXMsIHRoaXMuX3RvdGFsTGVuT2ZPbmVWZXJ0ZXgpO1xuXHRcdH1cblxuXHRcdGlmICghbmV3QW5pbWF0aW9uU3ViR2VvbWV0cnkpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR2YXIgcGFydGljbGVzOkFycmF5PFBhcnRpY2xlRGF0YT4gPSBnZW9tZXRyeS5wYXJ0aWNsZXM7XG5cdFx0dmFyIHBhcnRpY2xlc0xlbmd0aDpudW1iZXIgLyp1aW50Ki8gPSBwYXJ0aWNsZXMubGVuZ3RoO1xuXHRcdHZhciBudW1QYXJ0aWNsZXM6bnVtYmVyIC8qdWludCovID0gZ2VvbWV0cnkubnVtUGFydGljbGVzO1xuXHRcdHZhciBwYXJ0aWNsZVByb3BlcnRpZXM6UGFydGljbGVQcm9wZXJ0aWVzID0gbmV3IFBhcnRpY2xlUHJvcGVydGllcygpO1xuXHRcdHZhciBwYXJ0aWNsZTpQYXJ0aWNsZURhdGE7XG5cblx0XHR2YXIgb25lRGF0YUxlbjpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgb25lRGF0YU9mZnNldDpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgY291bnRlckZvclZlcnRleDpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgY291bnRlckZvck9uZURhdGE6bnVtYmVyIC8qaW50Ki87XG5cdFx0dmFyIG9uZURhdGE6QXJyYXk8bnVtYmVyPjtcblx0XHR2YXIgbnVtVmVydGljZXM6bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciB2ZXJ0ZXhEYXRhOkFycmF5PG51bWJlcj47XG5cdFx0dmFyIHZlcnRleExlbmd0aDpudW1iZXIgLyp1aW50Ki87XG5cdFx0dmFyIHN0YXJ0aW5nT2Zmc2V0Om51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgdmVydGV4T2Zmc2V0Om51bWJlciAvKnVpbnQqLztcblxuXHRcdC8vZGVmYXVsdCB2YWx1ZXMgZm9yIHBhcnRpY2xlIHBhcmFtXG5cdFx0cGFydGljbGVQcm9wZXJ0aWVzLnRvdGFsID0gbnVtUGFydGljbGVzO1xuXHRcdHBhcnRpY2xlUHJvcGVydGllcy5zdGFydFRpbWUgPSAwO1xuXHRcdHBhcnRpY2xlUHJvcGVydGllcy5kdXJhdGlvbiA9IDEwMDA7XG5cdFx0cGFydGljbGVQcm9wZXJ0aWVzLmRlbGF5ID0gMC4xO1xuXG5cdFx0aSA9IDA7XG5cdFx0aiA9IDA7XG5cdFx0d2hpbGUgKGkgPCBudW1QYXJ0aWNsZXMpIHtcblx0XHRcdHBhcnRpY2xlUHJvcGVydGllcy5pbmRleCA9IGk7XG5cblx0XHRcdC8vY2FsbCB0aGUgaW5pdCBvbiB0aGUgcGFydGljbGUgcGFyYW1ldGVyc1xuXHRcdFx0dGhpcy5pbml0UGFydGljbGVGdW5jLmNhbGwodGhpcy5pbml0UGFydGljbGVTY29wZSwgcGFydGljbGVQcm9wZXJ0aWVzKTtcblxuXHRcdFx0Ly9jcmVhdGUgdGhlIG5leHQgc2V0IG9mIG5vZGUgcHJvcGVydGllcyBmb3IgdGhlIHBhcnRpY2xlXG5cdFx0XHRmb3IgKGsgPSAwOyBrIDwgdGhpcy5fbG9jYWxTdGF0aWNOb2Rlcy5sZW5ndGg7IGsrKylcblx0XHRcdFx0dGhpcy5fbG9jYWxTdGF0aWNOb2Rlc1trXS5faUdlbmVyYXRlUHJvcGVydHlPZk9uZVBhcnRpY2xlKHBhcnRpY2xlUHJvcGVydGllcyk7XG5cblx0XHRcdC8vbG9vcCB0aHJvdWdoIGFsbCBwYXJ0aWNsZSBkYXRhIGZvciB0aGUgY3VyZW50IHBhcnRpY2xlXG5cdFx0XHR3aGlsZSAoaiA8IHBhcnRpY2xlc0xlbmd0aCAmJiAocGFydGljbGUgPSBwYXJ0aWNsZXNbal0pLnBhcnRpY2xlSW5kZXggPT0gaSkge1xuXHRcdFx0XHQvL2ZpbmQgdGhlIHRhcmdldCBhbmltYXRpb25TdWJHZW9tZXRyeVxuXHRcdFx0XHRmb3IgKGsgPSAwOyBrIDwgbWVzaC5zdWJNZXNoZXMubGVuZ3RoOyBrKyspIHtcblx0XHRcdFx0XHRzdWJNZXNoID0gbWVzaC5zdWJNZXNoZXNba107XG5cdFx0XHRcdFx0aWYgKHN1Yk1lc2guc3ViR2VvbWV0cnkgPT0gcGFydGljbGUuc3ViR2VvbWV0cnkpIHtcblx0XHRcdFx0XHRcdGFuaW1hdGlvblN1Ykdlb21ldHJ5ID0gKG1lc2guc2hhcmVBbmltYXRpb25HZW9tZXRyeSk/IHRoaXMuX2FuaW1hdGlvblN1Ykdlb21ldHJpZXNbc3ViTWVzaC5zdWJHZW9tZXRyeS5pZF0gOiB0aGlzLl9hbmltYXRpb25TdWJHZW9tZXRyaWVzW3N1Yk1lc2guaWRdO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdG51bVZlcnRpY2VzID0gcGFydGljbGUubnVtVmVydGljZXM7XG5cdFx0XHRcdHZlcnRleERhdGEgPSBhbmltYXRpb25TdWJHZW9tZXRyeS52ZXJ0ZXhEYXRhO1xuXHRcdFx0XHR2ZXJ0ZXhMZW5ndGggPSBudW1WZXJ0aWNlcyp0aGlzLl90b3RhbExlbk9mT25lVmVydGV4O1xuXHRcdFx0XHRzdGFydGluZ09mZnNldCA9IGFuaW1hdGlvblN1Ykdlb21ldHJ5Lm51bVByb2Nlc3NlZFZlcnRpY2VzKnRoaXMuX3RvdGFsTGVuT2ZPbmVWZXJ0ZXg7XG5cblx0XHRcdFx0Ly9sb29wIHRocm91Z2ggZWFjaCBzdGF0aWMgbG9jYWwgbm9kZSBpbiB0aGUgYW5pbWF0aW9uIHNldFxuXHRcdFx0XHRmb3IgKGsgPSAwOyBrIDwgdGhpcy5fbG9jYWxTdGF0aWNOb2Rlcy5sZW5ndGg7IGsrKykge1xuXHRcdFx0XHRcdGxvY2FsTm9kZSA9IHRoaXMuX2xvY2FsU3RhdGljTm9kZXNba107XG5cdFx0XHRcdFx0b25lRGF0YSA9IGxvY2FsTm9kZS5vbmVEYXRhO1xuXHRcdFx0XHRcdG9uZURhdGFMZW4gPSBsb2NhbE5vZGUuZGF0YUxlbmd0aDtcblx0XHRcdFx0XHRvbmVEYXRhT2Zmc2V0ID0gc3RhcnRpbmdPZmZzZXQgKyBsb2NhbE5vZGUuX2lEYXRhT2Zmc2V0O1xuXG5cdFx0XHRcdFx0Ly9sb29wIHRocm91Z2ggZWFjaCB2ZXJ0ZXggc2V0IGluIHRoZSB2ZXJ0ZXggZGF0YVxuXHRcdFx0XHRcdGZvciAoY291bnRlckZvclZlcnRleCA9IDA7IGNvdW50ZXJGb3JWZXJ0ZXggPCB2ZXJ0ZXhMZW5ndGg7IGNvdW50ZXJGb3JWZXJ0ZXggKz0gdGhpcy5fdG90YWxMZW5PZk9uZVZlcnRleCkge1xuXHRcdFx0XHRcdFx0dmVydGV4T2Zmc2V0ID0gb25lRGF0YU9mZnNldCArIGNvdW50ZXJGb3JWZXJ0ZXg7XG5cblx0XHRcdFx0XHRcdC8vYWRkIHRoZSBkYXRhIGZvciB0aGUgbG9jYWwgbm9kZSB0byB0aGUgdmVydGV4IGRhdGFcblx0XHRcdFx0XHRcdGZvciAoY291bnRlckZvck9uZURhdGEgPSAwOyBjb3VudGVyRm9yT25lRGF0YSA8IG9uZURhdGFMZW47IGNvdW50ZXJGb3JPbmVEYXRhKyspXG5cdFx0XHRcdFx0XHRcdHZlcnRleERhdGFbdmVydGV4T2Zmc2V0ICsgY291bnRlckZvck9uZURhdGFdID0gb25lRGF0YVtjb3VudGVyRm9yT25lRGF0YV07XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL3N0b3JlIHBhcnRpY2xlIHByb3BlcnRpZXMgaWYgdGhleSBuZWVkIHRvIGJlIHJldHJlaXZlZCBmb3IgZHluYW1pYyBsb2NhbCBub2Rlc1xuXHRcdFx0XHRpZiAodGhpcy5fbG9jYWxEeW5hbWljTm9kZXMubGVuZ3RoKVxuXHRcdFx0XHRcdGFuaW1hdGlvblN1Ykdlb21ldHJ5LmFuaW1hdGlvblBhcnRpY2xlcy5wdXNoKG5ldyBQYXJ0aWNsZUFuaW1hdGlvbkRhdGEoaSwgcGFydGljbGVQcm9wZXJ0aWVzLnN0YXJ0VGltZSwgcGFydGljbGVQcm9wZXJ0aWVzLmR1cmF0aW9uLCBwYXJ0aWNsZVByb3BlcnRpZXMuZGVsYXksIHBhcnRpY2xlKSk7XG5cblx0XHRcdFx0YW5pbWF0aW9uU3ViR2VvbWV0cnkubnVtUHJvY2Vzc2VkVmVydGljZXMgKz0gbnVtVmVydGljZXM7XG5cblx0XHRcdFx0Ly9uZXh0IGluZGV4XG5cdFx0XHRcdGorKztcblx0XHRcdH1cblxuXHRcdFx0Ly9uZXh0IHBhcnRpY2xlXG5cdFx0XHRpKys7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCA9IFBhcnRpY2xlQW5pbWF0aW9uU2V0OyJdfQ==