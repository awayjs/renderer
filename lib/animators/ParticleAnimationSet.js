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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvUGFydGljbGVBbmltYXRpb25TZXQudHMiXSwibmFtZXMiOlsiUGFydGljbGVBbmltYXRpb25TZXQiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5jb25zdHJ1Y3RvciIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LnBhcnRpY2xlTm9kZXMiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5hZGRBbmltYXRpb24iLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5hY3RpdmF0ZSIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LmRlYWN0aXZhdGUiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5nZXRBR0FMVmVydGV4Q29kZSIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LmdldEFHQUxVVkNvZGUiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5nZXRBR0FMRnJhZ21lbnRDb2RlIiwiUGFydGljbGVBbmltYXRpb25TZXQuZG9uZUFHQUxDb2RlIiwiUGFydGljbGVBbmltYXRpb25TZXQudXNlc0NQVSIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LmNhbmNlbEdQVUNvbXBhdGliaWxpdHkiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5kaXNwb3NlIiwiUGFydGljbGVBbmltYXRpb25TZXQuZ2V0QW5pbWF0aW9uU3ViR2VvbWV0cnkiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5faUdlbmVyYXRlQW5pbWF0aW9uU3ViR2VvbWV0cmllcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBUUEsSUFBTyxnQkFBZ0IsV0FBZSxrREFBa0QsQ0FBQyxDQUFDO0FBRTFGLElBQU8sc0JBQXNCLFdBQWEsNkRBQTZELENBQUMsQ0FBQztBQUN6RyxJQUFPLG9CQUFvQixXQUFjLDJEQUEyRCxDQUFDLENBQUM7QUFDdEcsSUFBTyxxQkFBcUIsV0FBYSw0REFBNEQsQ0FBQyxDQUFDO0FBQ3ZHLElBQU8sa0JBQWtCLFdBQWMseURBQXlELENBQUMsQ0FBQztBQUNsRyxJQUFPLHNCQUFzQixXQUFhLDZE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a0JBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsa0JBQWtCQSxDQUFDQSxTQUFTQSxFQUFFQSxrQkFBa0JBLENBQUNBLFFBQVFBLEVBQUVBLGtCQUFrQkEsQ0FBQ0EsS0FBS0EsRUFBRUEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRTNLQSxvQkFBb0JBLENBQUNBLG9CQUFvQkEsSUFBSUEsV0FBV0EsQ0FBQ0E7Z0JBRXpEQSxBQUNBQSxZQURZQTtnQkFDWkEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFFREEsQUFDQUEsZUFEZUE7WUFDZkEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7UUFDTEEsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUF6WERkOztPQUVHQTtJQUNXQSxrQ0FBYUEsR0FBa0JBLENBQUNBLENBQUNBO0lBRS9DQTs7T0FFR0E7SUFDV0EsbUNBQWNBLEdBQWtCQSxFQUFFQSxDQUFDQTtJQWtYbERBLDJCQUFDQTtBQUFEQSxDQWxZQSxBQWtZQ0EsRUFsWWtDLGdCQUFnQixFQWtZbEQ7QUFFRCxBQUE4QixpQkFBckIsb0JBQW9CLENBQUMiLCJmaWxlIjoiYW5pbWF0b3JzL1BhcnRpY2xlQW5pbWF0aW9uU2V0LmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJQW5pbWF0aW9uU2V0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9hbmltYXRvcnMvSUFuaW1hdGlvblNldFwiKTtcbmltcG9ydCBBbmltYXRpb25Ob2RlQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2FuaW1hdG9ycy9ub2Rlcy9BbmltYXRpb25Ob2RlQmFzZVwiKTtcbmltcG9ydCBJU3ViTWVzaFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvSVN1Yk1lc2hcIik7XG5pbXBvcnQgU3ViR2VvbWV0cnlCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL1N1Ykdlb21ldHJ5QmFzZVwiKTtcbmltcG9ydCBNZXNoXHRcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9NZXNoXCIpO1xuXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuXG5pbXBvcnQgQW5pbWF0aW9uU2V0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL0FuaW1hdGlvblNldEJhc2VcIik7XG5pbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XG5pbXBvcnQgQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9BbmltYXRpb25SZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IEFuaW1hdGlvblN1Ykdlb21ldHJ5XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvQW5pbWF0aW9uU3ViR2VvbWV0cnlcIik7XG5pbXBvcnQgUGFydGljbGVBbmltYXRpb25EYXRhXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1BhcnRpY2xlQW5pbWF0aW9uRGF0YVwiKTtcbmltcG9ydCBQYXJ0aWNsZVByb3BlcnRpZXNcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9QYXJ0aWNsZVByb3BlcnRpZXNcIik7XG5pbXBvcnQgUGFydGljbGVQcm9wZXJ0aWVzTW9kZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9QYXJ0aWNsZVByb3BlcnRpZXNNb2RlXCIpO1xuaW1wb3J0IFBhcnRpY2xlRGF0YVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9QYXJ0aWNsZURhdGFcIik7XG5pbXBvcnQgUGFydGljbGVOb2RlQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL25vZGVzL1BhcnRpY2xlTm9kZUJhc2VcIik7XG5pbXBvcnQgUGFydGljbGVUaW1lTm9kZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL25vZGVzL1BhcnRpY2xlVGltZU5vZGVcIik7XG5pbXBvcnQgUGFydGljbGVHZW9tZXRyeVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYmFzZS9QYXJ0aWNsZUdlb21ldHJ5XCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5cblxuLyoqXG4gKiBUaGUgYW5pbWF0aW9uIGRhdGEgc2V0IHVzZWQgYnkgcGFydGljbGUtYmFzZWQgYW5pbWF0b3JzLCBjb250YWluaW5nIHBhcnRpY2xlIGFuaW1hdGlvbiBkYXRhLlxuICpcbiAqIEBzZWUgYXdheS5hbmltYXRvcnMuUGFydGljbGVBbmltYXRvclxuICovXG5jbGFzcyBQYXJ0aWNsZUFuaW1hdGlvblNldCBleHRlbmRzIEFuaW1hdGlvblNldEJhc2UgaW1wbGVtZW50cyBJQW5pbWF0aW9uU2V0XG57XG5cdC8qKiBAcHJpdmF0ZSAqL1xuXHRwdWJsaWMgX2lBbmltYXRpb25SZWdpc3RlckNhY2hlOkFuaW1hdGlvblJlZ2lzdGVyQ2FjaGU7XG5cblx0Ly9hbGwgb3RoZXIgbm9kZXMgZGVwZW5kZW50IG9uIGl0XG5cdHByaXZhdGUgX3RpbWVOb2RlOlBhcnRpY2xlVGltZU5vZGU7XG5cblx0LyoqXG5cdCAqIFByb3BlcnR5IHVzZWQgYnkgcGFydGljbGUgbm9kZXMgdGhhdCByZXF1aXJlIGNvbXBpbGF0aW9uIGF0IHRoZSBlbmQgb2YgdGhlIHNoYWRlclxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBQT1NUX1BSSU9SSVRZOm51bWJlciAvKmludCovID0gOTtcblxuXHQvKipcblx0ICogUHJvcGVydHkgdXNlZCBieSBwYXJ0aWNsZSBub2RlcyB0aGF0IHJlcXVpcmUgY29sb3IgY29tcGlsYXRpb25cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgQ09MT1JfUFJJT1JJVFk6bnVtYmVyIC8qaW50Ki8gPSAxODtcblxuXHRwcml2YXRlIF9hbmltYXRpb25TdWJHZW9tZXRyaWVzOk9iamVjdCA9IG5ldyBPYmplY3QoKTtcblx0cHJpdmF0ZSBfcGFydGljbGVOb2RlczpBcnJheTxQYXJ0aWNsZU5vZGVCYXNlPiA9IG5ldyBBcnJheTxQYXJ0aWNsZU5vZGVCYXNlPigpO1xuXHRwcml2YXRlIF9sb2NhbER5bmFtaWNOb2RlczpBcnJheTxQYXJ0aWNsZU5vZGVCYXNlPiA9IG5ldyBBcnJheTxQYXJ0aWNsZU5vZGVCYXNlPigpO1xuXHRwcml2YXRlIF9sb2NhbFN0YXRpY05vZGVzOkFycmF5PFBhcnRpY2xlTm9kZUJhc2U+ID0gbmV3IEFycmF5PFBhcnRpY2xlTm9kZUJhc2U+KCk7XG5cdHByaXZhdGUgX3RvdGFsTGVuT2ZPbmVWZXJ0ZXg6bnVtYmVyIC8qaW50Ki8gPSAwO1xuXG5cdC8vc2V0IHRydWUgaWYgaGFzIGFuIG5vZGUgd2hpY2ggd2lsbCBjaGFuZ2UgVVZcblx0cHVibGljIGhhc1VWTm9kZTpib29sZWFuO1xuXHQvL3NldCBpZiB0aGUgb3RoZXIgbm9kZXMgbmVlZCB0byBhY2Nlc3MgdGhlIHZlbG9jaXR5XG5cdHB1YmxpYyBuZWVkVmVsb2NpdHk6Ym9vbGVhbjtcblx0Ly9zZXQgaWYgaGFzIGEgYmlsbGJvYXJkIG5vZGUuXG5cdHB1YmxpYyBoYXNCaWxsYm9hcmQ6Ym9vbGVhbjtcblx0Ly9zZXQgaWYgaGFzIGFuIG5vZGUgd2hpY2ggd2lsbCBhcHBseSBjb2xvciBtdWx0aXBsZSBvcGVyYXRpb25cblx0cHVibGljIGhhc0NvbG9yTXVsTm9kZTpib29sZWFuO1xuXHQvL3NldCBpZiBoYXMgYW4gbm9kZSB3aGljaCB3aWxsIGFwcGx5IGNvbG9yIGFkZCBvcGVyYXRpb25cblx0cHVibGljIGhhc0NvbG9yQWRkTm9kZTpib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXNlciBmdW5jdGlvbiBmb3Igc3RhdGljIHBhcnRpY2xlIHByb3BlcnRpZXMuIE5lZWRzIHRvIHJlZmVyZW5jZSBhIHdpdGggdGhlIGZvbGxvd2luZyBmb3JtYXRcblx0ICpcblx0ICogPGNvZGU+XG5cdCAqIGluaXRQYXJ0aWNsZUZ1bmMocHJvcDpQYXJ0aWNsZVByb3BlcnRpZXMpXG5cdCAqIHtcblx0ICogXHRcdC8vY29kZSBmb3Igc2V0dGluZ3MgbG9jYWwgcHJvcGVydGllc1xuXHQgKiB9XG5cdCAqIDwvY29kZT5cblx0ICpcblx0ICogQXNpZGUgZnJvbSBzZXR0aW5nIGFueSBwcm9wZXJ0aWVzIHJlcXVpcmVkIGluIHBhcnRpY2xlIGFuaW1hdGlvbiBub2RlcyB1c2luZyBsb2NhbCBzdGF0aWMgcHJvcGVydGllcywgdGhlIGluaXRQYXJ0aWNsZUZ1bmMgZnVuY3Rpb25cblx0ICogaXMgcmVxdWlyZWQgdG8gdGltZSBub2RlIHJlcXVpcmVtZW50cyBhcyB0aGV5IG1heSBiZSBuZWVkZWQuIFRoZXNlIHByb3BlcnRpZXMgb24gdGhlIFBhcnRpY2xlUHJvcGVydGllcyBvYmplY3QgY2FuIGluY2x1ZGVcblx0ICogPGNvZGU+c3RhcnRUaW1lPC9jb2RlPiwgPGNvZGU+ZHVyYXRpb248L2NvZGU+IGFuZCA8Y29kZT5kZWxheTwvY29kZT4uIFRoZSB1c2Ugb2YgdGhlc2UgcHJvcGVydGllcyBpcyBkZXRlcm1pbmVkIGJ5IHRoZSBzZXR0aW5nXG5cdCAqIGFyZ3VtZW50cyBwYXNzZWQgaW4gdGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gc2V0LiBCeSBkZWZhdWx0LCBvbmx5IHRoZSA8Y29kZT5zdGFydFRpbWU8L2NvZGU+IHByb3BlcnR5IGlzIHJlcXVpcmVkLlxuXHQgKi9cblx0cHVibGljIGluaXRQYXJ0aWNsZUZ1bmM6RnVuY3Rpb247XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpc2VyIGZ1bmN0aW9uIHNjb3BlIGZvciBzdGF0aWMgcGFydGljbGUgcHJvcGVydGllc1xuXHQgKi9cblx0cHVibGljIGluaXRQYXJ0aWNsZVNjb3BlOk9iamVjdDtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyA8Y29kZT5QYXJ0aWNsZUFuaW1hdGlvblNldDwvY29kZT5cblx0ICpcblx0ICogQHBhcmFtICAgIFtvcHRpb25hbF0gdXNlc0R1cmF0aW9uICAgIERlZmluZXMgd2hldGhlciB0aGUgYW5pbWF0aW9uIHNldCB1c2VzIHRoZSA8Y29kZT5kdXJhdGlvbjwvY29kZT4gZGF0YSBpbiBpdHMgc3RhdGljIHByb3BlcnRpZXMgdG8gZGV0ZXJtaW5lIGhvdyBsb25nIGEgcGFydGljbGUgaXMgdmlzaWJsZSBmb3IuIERlZmF1bHRzIHRvIGZhbHNlLlxuXHQgKiBAcGFyYW0gICAgW29wdGlvbmFsXSB1c2VzTG9vcGluZyAgICAgRGVmaW5lcyB3aGV0aGVyIHRoZSBhbmltYXRpb24gc2V0IHVzZXMgYSBsb29waW5nIHRpbWVmcmFtZSBmb3IgZWFjaCBwYXJ0aWNsZSBkZXRlcm1pbmVkIGJ5IHRoZSA8Y29kZT5zdGFydFRpbWU8L2NvZGU+LCA8Y29kZT5kdXJhdGlvbjwvY29kZT4gYW5kIDxjb2RlPmRlbGF5PC9jb2RlPiBkYXRhIGluIGl0cyBzdGF0aWMgcHJvcGVydGllcyBmdW5jdGlvbi4gRGVmYXVsdHMgdG8gZmFsc2UuIFJlcXVpcmVzIDxjb2RlPnVzZXNEdXJhdGlvbjwvY29kZT4gdG8gYmUgdHJ1ZS5cblx0ICogQHBhcmFtICAgIFtvcHRpb25hbF0gdXNlc0RlbGF5ICAgICAgIERlZmluZXMgd2hldGhlciB0aGUgYW5pbWF0aW9uIHNldCB1c2VzIHRoZSA8Y29kZT5kZWxheTwvY29kZT4gZGF0YSBpbiBpdHMgc3RhdGljIHByb3BlcnRpZXMgdG8gZGV0ZXJtaW5lIGhvdyBsb25nIGEgcGFydGljbGUgaXMgaGlkZGVuIGZvci4gRGVmYXVsdHMgdG8gZmFsc2UuIFJlcXVpcmVzIDxjb2RlPnVzZXNMb29waW5nPC9jb2RlPiB0byBiZSB0cnVlLlxuXHQgKi9cblx0Y29uc3RydWN0b3IodXNlc0R1cmF0aW9uOmJvb2xlYW4gPSBmYWxzZSwgdXNlc0xvb3Bpbmc6Ym9vbGVhbiA9IGZhbHNlLCB1c2VzRGVsYXk6Ym9vbGVhbiA9IGZhbHNlKVxuXHR7XG5cdFx0c3VwZXIoKTtcblxuXHRcdC8vYXV0b21hdGljYWxseSBhZGQgYSBwYXJ0aWNsZSB0aW1lIG5vZGUgdG8gdGhlIHNldFxuXHRcdHRoaXMuYWRkQW5pbWF0aW9uKHRoaXMuX3RpbWVOb2RlID0gbmV3IFBhcnRpY2xlVGltZU5vZGUodXNlc0R1cmF0aW9uLCB1c2VzTG9vcGluZywgdXNlc0RlbGF5KSk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBhIHZlY3RvciBvZiB0aGUgcGFydGljbGUgYW5pbWF0aW9uIG5vZGVzIGNvbnRhaW5lZCB3aXRoaW4gdGhlIHNldC5cblx0ICovXG5cdHB1YmxpYyBnZXQgcGFydGljbGVOb2RlcygpOkFycmF5PFBhcnRpY2xlTm9kZUJhc2U+XG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fcGFydGljbGVOb2Rlcztcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGFkZEFuaW1hdGlvbihub2RlOkFuaW1hdGlvbk5vZGVCYXNlKVxuXHR7XG5cdFx0dmFyIGk6bnVtYmVyIC8qaW50Ki87XG5cdFx0dmFyIG46UGFydGljbGVOb2RlQmFzZSA9IDxQYXJ0aWNsZU5vZGVCYXNlPiBub2RlO1xuXHRcdG4uX2lQcm9jZXNzQW5pbWF0aW9uU2V0dGluZyh0aGlzKTtcblx0XHRpZiAobi5tb2RlID09IFBhcnRpY2xlUHJvcGVydGllc01vZGUuTE9DQUxfU1RBVElDKSB7XG5cdFx0XHRuLl9pRGF0YU9mZnNldCA9IHRoaXMuX3RvdGFsTGVuT2ZPbmVWZXJ0ZXg7XG5cdFx0XHR0aGlzLl90b3RhbExlbk9mT25lVmVydGV4ICs9IG4uZGF0YUxlbmd0aDtcblx0XHRcdHRoaXMuX2xvY2FsU3RhdGljTm9kZXMucHVzaChuKTtcblx0XHR9IGVsc2UgaWYgKG4ubW9kZSA9PSBQYXJ0aWNsZVByb3BlcnRpZXNNb2RlLkxPQ0FMX0RZTkFNSUMpXG5cdFx0XHR0aGlzLl9sb2NhbER5bmFtaWNOb2Rlcy5wdXNoKG4pO1xuXG5cdFx0Zm9yIChpID0gdGhpcy5fcGFydGljbGVOb2Rlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0aWYgKHRoaXMuX3BhcnRpY2xlTm9kZXNbaV0ucHJpb3JpdHkgPD0gbi5wcmlvcml0eSlcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0dGhpcy5fcGFydGljbGVOb2Rlcy5zcGxpY2UoaSArIDEsIDAsIG4pO1xuXG5cdFx0c3VwZXIuYWRkQW5pbWF0aW9uKG5vZGUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgYWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHN0YWdlOlN0YWdlKVxuXHR7XG4vL1x0XHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlID0gcGFzcy5hbmltYXRpb25SZWdpc3RlckNhY2hlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZGVhY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgc3RhZ2U6U3RhZ2UpXG5cdHtcbi8vXHRcdFx0dmFyIGNvbnRleHQ6SUNvbnRleHRHTCA9IDxJQ29udGV4dEdMPiBzdGFnZS5jb250ZXh0O1xuLy9cdFx0XHR2YXIgb2Zmc2V0Om51bWJlciAvKmludCovID0gdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudmVydGV4QXR0cmlidXRlc09mZnNldDtcbi8vXHRcdFx0dmFyIHVzZWQ6bnVtYmVyIC8qaW50Ki8gPSB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5udW1Vc2VkU3RyZWFtcztcbi8vXHRcdFx0Zm9yICh2YXIgaTpudW1iZXIgLyppbnQqLyA9IG9mZnNldDsgaSA8IHVzZWQ7IGkrKylcbi8vXHRcdFx0XHRjb250ZXh0LnNldFZlcnRleEJ1ZmZlckF0KGksIG51bGwpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0QUdBTFZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOnN0cmluZ1xuXHR7XG5cdFx0Ly9ncmFiIGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUgZnJvbSB0aGUgbWF0ZXJpYWxwYXNzYmFzZSBvciBjcmVhdGUgYSBuZXcgb25lIGlmIHRoZSBmaXJzdCB0aW1lXG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUgPSBzaGFkZXJPYmplY3QuYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZTtcblxuXHRcdGlmICh0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSA9PSBudWxsKVxuXHRcdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUgPSBzaGFkZXJPYmplY3QuYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSA9IG5ldyBBbmltYXRpb25SZWdpc3RlckNhY2hlKHNoYWRlck9iamVjdC5wcm9maWxlKTtcblxuXHRcdC8vcmVzZXQgYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZVxuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnZlcnRleENvbnN0YW50T2Zmc2V0ID0gc2hhZGVyT2JqZWN0Lm51bVVzZWRWZXJ0ZXhDb25zdGFudHM7XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudmVydGV4QXR0cmlidXRlc09mZnNldCA9IHNoYWRlck9iamVjdC5udW1Vc2VkU3RyZWFtcztcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS52YXJ5aW5nc09mZnNldCA9IHNoYWRlck9iamVjdC5udW1Vc2VkVmFyeWluZ3M7XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuZnJhZ21lbnRDb25zdGFudE9mZnNldCA9IHNoYWRlck9iamVjdC5udW1Vc2VkRnJhZ21lbnRDb25zdGFudHM7XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuaGFzVVZOb2RlID0gdGhpcy5oYXNVVk5vZGU7XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUubmVlZFZlbG9jaXR5ID0gdGhpcy5uZWVkVmVsb2NpdHk7XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuaGFzQmlsbGJvYXJkID0gdGhpcy5oYXNCaWxsYm9hcmQ7XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuc291cmNlUmVnaXN0ZXJzID0gc2hhZGVyT2JqZWN0LmFuaW1hdGFibGVBdHRyaWJ1dGVzO1xuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnRhcmdldFJlZ2lzdGVycyA9IHNoYWRlck9iamVjdC5hbmltYXRpb25UYXJnZXRSZWdpc3RlcnM7XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUubmVlZEZyYWdtZW50QW5pbWF0aW9uID0gc2hhZGVyT2JqZWN0LnVzZXNGcmFnbWVudEFuaW1hdGlvbjtcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5uZWVkVVZBbmltYXRpb24gPSAhc2hhZGVyT2JqZWN0LnVzZXNVVlRyYW5zZm9ybTtcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5oYXNDb2xvckFkZE5vZGUgPSB0aGlzLmhhc0NvbG9yQWRkTm9kZTtcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5oYXNDb2xvck11bE5vZGUgPSB0aGlzLmhhc0NvbG9yTXVsTm9kZTtcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5yZXNldCgpO1xuXG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gXCJcIjtcblxuXHRcdGNvZGUgKz0gdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuZ2V0SW5pdENvZGUoKTtcblxuXHRcdHZhciBub2RlOlBhcnRpY2xlTm9kZUJhc2U7XG5cdFx0dmFyIGk6bnVtYmVyIC8qaW50Ki87XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgdGhpcy5fcGFydGljbGVOb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0bm9kZSA9IHRoaXMuX3BhcnRpY2xlTm9kZXNbaV07XG5cdFx0XHRpZiAobm9kZS5wcmlvcml0eSA8IFBhcnRpY2xlQW5pbWF0aW9uU2V0LlBPU1RfUFJJT1JJVFkpXG5cdFx0XHRcdGNvZGUgKz0gbm9kZS5nZXRBR0FMVmVydGV4Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlKTtcblx0XHR9XG5cblx0XHRjb2RlICs9IHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLmdldENvbWJpbmF0aW9uQ29kZSgpO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IHRoaXMuX3BhcnRpY2xlTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdG5vZGUgPSB0aGlzLl9wYXJ0aWNsZU5vZGVzW2ldO1xuXHRcdFx0aWYgKG5vZGUucHJpb3JpdHkgPj0gUGFydGljbGVBbmltYXRpb25TZXQuUE9TVF9QUklPUklUWSAmJiBub2RlLnByaW9yaXR5IDwgUGFydGljbGVBbmltYXRpb25TZXQuQ09MT1JfUFJJT1JJVFkpXG5cdFx0XHRcdGNvZGUgKz0gbm9kZS5nZXRBR0FMVmVydGV4Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlKTtcblx0XHR9XG5cblx0XHRjb2RlICs9IHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLmluaXRDb2xvclJlZ2lzdGVycygpO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IHRoaXMuX3BhcnRpY2xlTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdG5vZGUgPSB0aGlzLl9wYXJ0aWNsZU5vZGVzW2ldO1xuXHRcdFx0aWYgKG5vZGUucHJpb3JpdHkgPj0gUGFydGljbGVBbmltYXRpb25TZXQuQ09MT1JfUFJJT1JJVFkpXG5cdFx0XHRcdGNvZGUgKz0gbm9kZS5nZXRBR0FMVmVydGV4Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlKTtcblx0XHR9XG5cdFx0Y29kZSArPSB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5nZXRDb2xvclBhc3NDb2RlKCk7XG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBnZXRBR0FMVVZDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpzdHJpbmdcblx0e1xuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XG5cdFx0aWYgKHRoaXMuaGFzVVZOb2RlKSB7XG5cdFx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5zZXRVVlNvdXJjZUFuZFRhcmdldChzaGFkZXJPYmplY3QudXZTb3VyY2UsIHNoYWRlck9iamVjdC51dlRhcmdldCk7XG5cdFx0XHRjb2RlICs9IFwibW92IFwiICsgdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudXZUYXJnZXQgKyBcIi54eSxcIiArIHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnV2QXR0cmlidXRlLnRvU3RyaW5nKCkgKyBcIlxcblwiO1xuXHRcdFx0dmFyIG5vZGU6UGFydGljbGVOb2RlQmFzZTtcblx0XHRcdGZvciAodmFyIGk6bnVtYmVyIC8qdWludCovID0gMDsgaSA8IHRoaXMuX3BhcnRpY2xlTm9kZXMubGVuZ3RoOyBpKyspXG5cdFx0XHRcdG5vZGUgPSB0aGlzLl9wYXJ0aWNsZU5vZGVzW2ldO1xuXHRcdFx0XHRjb2RlICs9IG5vZGUuZ2V0QUdBTFVWQ29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlKTtcblx0XHRcdGNvZGUgKz0gXCJtb3YgXCIgKyB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS51dlZhci50b1N0cmluZygpICsgXCIsXCIgKyB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS51dlRhcmdldCArIFwiLnh5XFxuXCI7XG5cdFx0fSBlbHNlXG5cdFx0XHRjb2RlICs9IFwibW92IFwiICsgc2hhZGVyT2JqZWN0LnV2VGFyZ2V0ICsgXCIsXCIgKyBzaGFkZXJPYmplY3QudXZTb3VyY2UgKyBcIlxcblwiO1xuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0QUdBTEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgc2hhZGVkVGFyZ2V0OnN0cmluZyk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuZ2V0Q29sb3JDb21iaW5hdGlvbkNvZGUoc2hhZGVkVGFyZ2V0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGRvbmVBR0FMQ29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSlcblx0e1xuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnNldERhdGFMZW5ndGgoKTtcblxuXHRcdC8vc2V0IHZlcnRleFplcm9Db25zdCx2ZXJ0ZXhPbmVDb25zdCx2ZXJ0ZXhUd29Db25zdFxuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnNldFZlcnRleENvbnN0KHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnZlcnRleFplcm9Db25zdC5pbmRleCwgMCwgMSwgMiwgMCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBnZXQgdXNlc0NQVSgpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGNhbmNlbEdQVUNvbXBhdGliaWxpdHkoKVxuXHR7XG5cblx0fVxuXG5cdHB1YmxpYyBkaXNwb3NlKClcblx0e1xuXHRcdGZvciAodmFyIGtleSBpbiB0aGlzLl9hbmltYXRpb25TdWJHZW9tZXRyaWVzKVxuXHRcdFx0KDxBbmltYXRpb25TdWJHZW9tZXRyeT4gdGhpcy5fYW5pbWF0aW9uU3ViR2VvbWV0cmllc1trZXldKS5kaXNwb3NlKCk7XG5cblx0XHRzdXBlci5kaXNwb3NlKCk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0QW5pbWF0aW9uU3ViR2VvbWV0cnkoc3ViTWVzaDpJU3ViTWVzaClcblx0e1xuXHRcdHZhciBtZXNoOk1lc2ggPSBzdWJNZXNoLnBhcmVudE1lc2g7XG5cdFx0dmFyIGFuaW1hdGlvblN1Ykdlb21ldHJ5OkFuaW1hdGlvblN1Ykdlb21ldHJ5ID0gKG1lc2guc2hhcmVBbmltYXRpb25HZW9tZXRyeSk/IHRoaXMuX2FuaW1hdGlvblN1Ykdlb21ldHJpZXNbc3ViTWVzaC5zdWJHZW9tZXRyeS5pZF0gOiB0aGlzLl9hbmltYXRpb25TdWJHZW9tZXRyaWVzW3N1Yk1lc2guaWRdO1xuXG5cdFx0aWYgKGFuaW1hdGlvblN1Ykdlb21ldHJ5KVxuXHRcdFx0cmV0dXJuIGFuaW1hdGlvblN1Ykdlb21ldHJ5O1xuXG5cdFx0dGhpcy5faUdlbmVyYXRlQW5pbWF0aW9uU3ViR2VvbWV0cmllcyhtZXNoKTtcblxuXHRcdHJldHVybiAobWVzaC5zaGFyZUFuaW1hdGlvbkdlb21ldHJ5KT8gdGhpcy5fYW5pbWF0aW9uU3ViR2VvbWV0cmllc1tzdWJNZXNoLnN1Ykdlb21ldHJ5LmlkXSA6IHRoaXMuX2FuaW1hdGlvblN1Ykdlb21ldHJpZXNbc3ViTWVzaC5pZF07XG5cdH1cblxuXG5cdC8qKiBAcHJpdmF0ZSAqL1xuXHRwdWJsaWMgX2lHZW5lcmF0ZUFuaW1hdGlvblN1Ykdlb21ldHJpZXMobWVzaDpNZXNoKVxuXHR7XG5cdFx0aWYgKHRoaXMuaW5pdFBhcnRpY2xlRnVuYyA9PSBudWxsKVxuXHRcdFx0dGhyb3cobmV3IEVycm9yKFwibm8gaW5pdFBhcnRpY2xlRnVuYyBzZXRcIikpO1xuXG5cdFx0dmFyIGdlb21ldHJ5OlBhcnRpY2xlR2VvbWV0cnkgPSA8UGFydGljbGVHZW9tZXRyeT4gbWVzaC5nZW9tZXRyeTtcblxuXHRcdGlmICghZ2VvbWV0cnkpXG5cdFx0XHR0aHJvdyhuZXcgRXJyb3IoXCJQYXJ0aWNsZSBhbmltYXRpb24gY2FuIG9ubHkgYmUgcGVyZm9ybWVkIG9uIGEgUGFydGljbGVHZW9tZXRyeSBvYmplY3RcIikpO1xuXG5cdFx0dmFyIGk6bnVtYmVyIC8qaW50Ki8sIGo6bnVtYmVyIC8qaW50Ki8sIGs6bnVtYmVyIC8qaW50Ki87XG5cdFx0dmFyIGFuaW1hdGlvblN1Ykdlb21ldHJ5OkFuaW1hdGlvblN1Ykdlb21ldHJ5O1xuXHRcdHZhciBuZXdBbmltYXRpb25TdWJHZW9tZXRyeTpib29sZWFuID0gZmFsc2U7XG5cdFx0dmFyIHN1Ykdlb21ldHJ5OlN1Ykdlb21ldHJ5QmFzZTtcblx0XHR2YXIgc3ViTWVzaDpJU3ViTWVzaDtcblx0XHR2YXIgbG9jYWxOb2RlOlBhcnRpY2xlTm9kZUJhc2U7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgbWVzaC5zdWJNZXNoZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHN1Yk1lc2ggPSBtZXNoLnN1Yk1lc2hlc1tpXTtcblx0XHRcdHN1Ykdlb21ldHJ5ID0gc3ViTWVzaC5zdWJHZW9tZXRyeTtcblx0XHRcdGlmIChtZXNoLnNoYXJlQW5pbWF0aW9uR2VvbWV0cnkpIHtcblx0XHRcdFx0YW5pbWF0aW9uU3ViR2VvbWV0cnkgPSB0aGlzLl9hbmltYXRpb25TdWJHZW9tZXRyaWVzW3N1Ykdlb21ldHJ5LmlkXTtcblxuXHRcdFx0XHRpZiAoYW5pbWF0aW9uU3ViR2VvbWV0cnkpXG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGFuaW1hdGlvblN1Ykdlb21ldHJ5ID0gbmV3IEFuaW1hdGlvblN1Ykdlb21ldHJ5KCk7XG5cblx0XHRcdGlmIChtZXNoLnNoYXJlQW5pbWF0aW9uR2VvbWV0cnkpXG5cdFx0XHRcdHRoaXMuX2FuaW1hdGlvblN1Ykdlb21ldHJpZXNbc3ViR2VvbWV0cnkuaWRdID0gYW5pbWF0aW9uU3ViR2VvbWV0cnk7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRoaXMuX2FuaW1hdGlvblN1Ykdlb21ldHJpZXNbc3ViTWVzaC5pZF0gPSBhbmltYXRpb25TdWJHZW9tZXRyeTtcblxuXHRcdFx0bmV3QW5pbWF0aW9uU3ViR2VvbWV0cnkgPSB0cnVlO1xuXG5cdFx0XHQvL2NyZWF0ZSB0aGUgdmVydGV4RGF0YSB2ZWN0b3IgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIGxvY2FsIG5vZGUgZGF0YVxuXHRcdFx0YW5pbWF0aW9uU3ViR2VvbWV0cnkuY3JlYXRlVmVydGV4RGF0YShzdWJHZW9tZXRyeS5udW1WZXJ0aWNlcywgdGhpcy5fdG90YWxMZW5PZk9uZVZlcnRleCk7XG5cdFx0fVxuXG5cdFx0aWYgKCFuZXdBbmltYXRpb25TdWJHZW9tZXRyeSlcblx0XHRcdHJldHVybjtcblxuXHRcdHZhciBwYXJ0aWNsZXM6QXJyYXk8UGFydGljbGVEYXRhPiA9IGdlb21ldHJ5LnBhcnRpY2xlcztcblx0XHR2YXIgcGFydGljbGVzTGVuZ3RoOm51bWJlciAvKnVpbnQqLyA9IHBhcnRpY2xlcy5sZW5ndGg7XG5cdFx0dmFyIG51bVBhcnRpY2xlczpudW1iZXIgLyp1aW50Ki8gPSBnZW9tZXRyeS5udW1QYXJ0aWNsZXM7XG5cdFx0dmFyIHBhcnRpY2xlUHJvcGVydGllczpQYXJ0aWNsZVByb3BlcnRpZXMgPSBuZXcgUGFydGljbGVQcm9wZXJ0aWVzKCk7XG5cdFx0dmFyIHBhcnRpY2xlOlBhcnRpY2xlRGF0YTtcblxuXHRcdHZhciBvbmVEYXRhTGVuOm51bWJlciAvKmludCovO1xuXHRcdHZhciBvbmVEYXRhT2Zmc2V0Om51bWJlciAvKmludCovO1xuXHRcdHZhciBjb3VudGVyRm9yVmVydGV4Om51bWJlciAvKmludCovO1xuXHRcdHZhciBjb3VudGVyRm9yT25lRGF0YTpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgb25lRGF0YTpBcnJheTxudW1iZXI+O1xuXHRcdHZhciBudW1WZXJ0aWNlczpudW1iZXIgLyp1aW50Ki87XG5cdFx0dmFyIHZlcnRleERhdGE6QXJyYXk8bnVtYmVyPjtcblx0XHR2YXIgdmVydGV4TGVuZ3RoOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgc3RhcnRpbmdPZmZzZXQ6bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciB2ZXJ0ZXhPZmZzZXQ6bnVtYmVyIC8qdWludCovO1xuXG5cdFx0Ly9kZWZhdWx0IHZhbHVlcyBmb3IgcGFydGljbGUgcGFyYW1cblx0XHRwYXJ0aWNsZVByb3BlcnRpZXMudG90YWwgPSBudW1QYXJ0aWNsZXM7XG5cdFx0cGFydGljbGVQcm9wZXJ0aWVzLnN0YXJ0VGltZSA9IDA7XG5cdFx0cGFydGljbGVQcm9wZXJ0aWVzLmR1cmF0aW9uID0gMTAwMDtcblx0XHRwYXJ0aWNsZVByb3BlcnRpZXMuZGVsYXkgPSAwLjE7XG5cblx0XHRpID0gMDtcblx0XHRqID0gMDtcblx0XHR3aGlsZSAoaSA8IG51bVBhcnRpY2xlcykge1xuXHRcdFx0cGFydGljbGVQcm9wZXJ0aWVzLmluZGV4ID0gaTtcblxuXHRcdFx0Ly9jYWxsIHRoZSBpbml0IG9uIHRoZSBwYXJ0aWNsZSBwYXJhbWV0ZXJzXG5cdFx0XHR0aGlzLmluaXRQYXJ0aWNsZUZ1bmMuY2FsbCh0aGlzLmluaXRQYXJ0aWNsZVNjb3BlLCBwYXJ0aWNsZVByb3BlcnRpZXMpO1xuXG5cdFx0XHQvL2NyZWF0ZSB0aGUgbmV4dCBzZXQgb2Ygbm9kZSBwcm9wZXJ0aWVzIGZvciB0aGUgcGFydGljbGVcblx0XHRcdGZvciAoayA9IDA7IGsgPCB0aGlzLl9sb2NhbFN0YXRpY05vZGVzLmxlbmd0aDsgaysrKVxuXHRcdFx0XHR0aGlzLl9sb2NhbFN0YXRpY05vZGVzW2tdLl9pR2VuZXJhdGVQcm9wZXJ0eU9mT25lUGFydGljbGUocGFydGljbGVQcm9wZXJ0aWVzKTtcblxuXHRcdFx0Ly9sb29wIHRocm91Z2ggYWxsIHBhcnRpY2xlIGRhdGEgZm9yIHRoZSBjdXJlbnQgcGFydGljbGVcblx0XHRcdHdoaWxlIChqIDwgcGFydGljbGVzTGVuZ3RoICYmIChwYXJ0aWNsZSA9IHBhcnRpY2xlc1tqXSkucGFydGljbGVJbmRleCA9PSBpKSB7XG5cdFx0XHRcdC8vZmluZCB0aGUgdGFyZ2V0IGFuaW1hdGlvblN1Ykdlb21ldHJ5XG5cdFx0XHRcdGZvciAoayA9IDA7IGsgPCBtZXNoLnN1Yk1lc2hlcy5sZW5ndGg7IGsrKykge1xuXHRcdFx0XHRcdHN1Yk1lc2ggPSBtZXNoLnN1Yk1lc2hlc1trXTtcblx0XHRcdFx0XHRpZiAoc3ViTWVzaC5zdWJHZW9tZXRyeSA9PSBwYXJ0aWNsZS5zdWJHZW9tZXRyeSkge1xuXHRcdFx0XHRcdFx0YW5pbWF0aW9uU3ViR2VvbWV0cnkgPSAobWVzaC5zaGFyZUFuaW1hdGlvbkdlb21ldHJ5KT8gdGhpcy5fYW5pbWF0aW9uU3ViR2VvbWV0cmllc1tzdWJNZXNoLnN1Ykdlb21ldHJ5LmlkXSA6IHRoaXMuX2FuaW1hdGlvblN1Ykdlb21ldHJpZXNbc3ViTWVzaC5pZF07XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0bnVtVmVydGljZXMgPSBwYXJ0aWNsZS5udW1WZXJ0aWNlcztcblx0XHRcdFx0dmVydGV4RGF0YSA9IGFuaW1hdGlvblN1Ykdlb21ldHJ5LnZlcnRleERhdGE7XG5cdFx0XHRcdHZlcnRleExlbmd0aCA9IG51bVZlcnRpY2VzKnRoaXMuX3RvdGFsTGVuT2ZPbmVWZXJ0ZXg7XG5cdFx0XHRcdHN0YXJ0aW5nT2Zmc2V0ID0gYW5pbWF0aW9uU3ViR2VvbWV0cnkubnVtUHJvY2Vzc2VkVmVydGljZXMqdGhpcy5fdG90YWxMZW5PZk9uZVZlcnRleDtcblxuXHRcdFx0XHQvL2xvb3AgdGhyb3VnaCBlYWNoIHN0YXRpYyBsb2NhbCBub2RlIGluIHRoZSBhbmltYXRpb24gc2V0XG5cdFx0XHRcdGZvciAoayA9IDA7IGsgPCB0aGlzLl9sb2NhbFN0YXRpY05vZGVzLmxlbmd0aDsgaysrKSB7XG5cdFx0XHRcdFx0bG9jYWxOb2RlID0gdGhpcy5fbG9jYWxTdGF0aWNOb2Rlc1trXTtcblx0XHRcdFx0XHRvbmVEYXRhID0gbG9jYWxOb2RlLm9uZURhdGE7XG5cdFx0XHRcdFx0b25lRGF0YUxlbiA9IGxvY2FsTm9kZS5kYXRhTGVuZ3RoO1xuXHRcdFx0XHRcdG9uZURhdGFPZmZzZXQgPSBzdGFydGluZ09mZnNldCArIGxvY2FsTm9kZS5faURhdGFPZmZzZXQ7XG5cblx0XHRcdFx0XHQvL2xvb3AgdGhyb3VnaCBlYWNoIHZlcnRleCBzZXQgaW4gdGhlIHZlcnRleCBkYXRhXG5cdFx0XHRcdFx0Zm9yIChjb3VudGVyRm9yVmVydGV4ID0gMDsgY291bnRlckZvclZlcnRleCA8IHZlcnRleExlbmd0aDsgY291bnRlckZvclZlcnRleCArPSB0aGlzLl90b3RhbExlbk9mT25lVmVydGV4KSB7XG5cdFx0XHRcdFx0XHR2ZXJ0ZXhPZmZzZXQgPSBvbmVEYXRhT2Zmc2V0ICsgY291bnRlckZvclZlcnRleDtcblxuXHRcdFx0XHRcdFx0Ly9hZGQgdGhlIGRhdGEgZm9yIHRoZSBsb2NhbCBub2RlIHRvIHRoZSB2ZXJ0ZXggZGF0YVxuXHRcdFx0XHRcdFx0Zm9yIChjb3VudGVyRm9yT25lRGF0YSA9IDA7IGNvdW50ZXJGb3JPbmVEYXRhIDwgb25lRGF0YUxlbjsgY291bnRlckZvck9uZURhdGErKylcblx0XHRcdFx0XHRcdFx0dmVydGV4RGF0YVt2ZXJ0ZXhPZmZzZXQgKyBjb3VudGVyRm9yT25lRGF0YV0gPSBvbmVEYXRhW2NvdW50ZXJGb3JPbmVEYXRhXTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vc3RvcmUgcGFydGljbGUgcHJvcGVydGllcyBpZiB0aGV5IG5lZWQgdG8gYmUgcmV0cmVpdmVkIGZvciBkeW5hbWljIGxvY2FsIG5vZGVzXG5cdFx0XHRcdGlmICh0aGlzLl9sb2NhbER5bmFtaWNOb2Rlcy5sZW5ndGgpXG5cdFx0XHRcdFx0YW5pbWF0aW9uU3ViR2VvbWV0cnkuYW5pbWF0aW9uUGFydGljbGVzLnB1c2gobmV3IFBhcnRpY2xlQW5pbWF0aW9uRGF0YShpLCBwYXJ0aWNsZVByb3BlcnRpZXMuc3RhcnRUaW1lLCBwYXJ0aWNsZVByb3BlcnRpZXMuZHVyYXRpb24sIHBhcnRpY2xlUHJvcGVydGllcy5kZWxheSwgcGFydGljbGUpKTtcblxuXHRcdFx0XHRhbmltYXRpb25TdWJHZW9tZXRyeS5udW1Qcm9jZXNzZWRWZXJ0aWNlcyArPSBudW1WZXJ0aWNlcztcblxuXHRcdFx0XHQvL25leHQgaW5kZXhcblx0XHRcdFx0aisrO1xuXHRcdFx0fVxuXG5cdFx0XHQvL25leHQgcGFydGljbGVcblx0XHRcdGkrKztcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0ID0gUGFydGljbGVBbmltYXRpb25TZXQ7Il19