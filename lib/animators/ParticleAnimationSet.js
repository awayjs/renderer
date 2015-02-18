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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvUGFydGljbGVBbmltYXRpb25TZXQudHMiXSwibmFtZXMiOlsiUGFydGljbGVBbmltYXRpb25TZXQiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5jb25zdHJ1Y3RvciIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LnBhcnRpY2xlTm9kZXMiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5hZGRBbmltYXRpb24iLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5hY3RpdmF0ZSIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LmRlYWN0aXZhdGUiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5nZXRBR0FMVmVydGV4Q29kZSIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LmdldEFHQUxVVkNvZGUiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5nZXRBR0FMRnJhZ21lbnRDb2RlIiwiUGFydGljbGVBbmltYXRpb25TZXQuZG9uZUFHQUxDb2RlIiwiUGFydGljbGVBbmltYXRpb25TZXQudXNlc0NQVSIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LmNhbmNlbEdQVUNvbXBhdGliaWxpdHkiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5kaXNwb3NlIiwiUGFydGljbGVBbmltYXRpb25TZXQuZ2V0QW5pbWF0aW9uU3ViR2VvbWV0cnkiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5faUdlbmVyYXRlQW5pbWF0aW9uU3ViR2VvbWV0cmllcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBUUEsSUFBTyxnQkFBZ0IsV0FBZSxrREFBa0QsQ0FBQyxDQUFDO0FBRTFGLElBQU8sc0JBQXNCLFdBQWEsNkRBQTZELENBQUMsQ0FBQztBQUN6RyxJQUFPLG9CQUFvQixXQUFjLDJEQUEyRCxDQUFDLENBQUM7QUFDdEcsSUFBTyxxQkFBcUIsV0FBYSw0REFBNEQsQ0FBQyxDQUFDO0FBQ3ZHLElBQU8sa0JBQWtCLFdBQWMseURBQXlELENBQUMsQ0FBQztBQUNsRyxJQUFPLHNCQUFzQixXQUFhLDZE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a0JBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsa0JBQWtCQSxDQUFDQSxTQUFTQSxFQUFFQSxrQkFBa0JBLENBQUNBLFFBQVFBLEVBQUVBLGtCQUFrQkEsQ0FBQ0EsS0FBS0EsRUFBRUEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRTNLQSxvQkFBb0JBLENBQUNBLG9CQUFvQkEsSUFBSUEsV0FBV0EsQ0FBQ0E7Z0JBRXpEQSxBQUNBQSxZQURZQTtnQkFDWkEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFFREEsQUFDQUEsZUFEZUE7WUFDZkEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7UUFDTEEsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUF6WERkOztPQUVHQTtJQUNXQSxrQ0FBYUEsR0FBa0JBLENBQUNBLENBQUNBO0lBRS9DQTs7T0FFR0E7SUFDV0EsbUNBQWNBLEdBQWtCQSxFQUFFQSxDQUFDQTtJQWtYbERBLDJCQUFDQTtBQUFEQSxDQWxZQSxBQWtZQ0EsRUFsWWtDLGdCQUFnQixFQWtZbEQ7QUFFRCxBQUE4QixpQkFBckIsb0JBQW9CLENBQUMiLCJmaWxlIjoiYW5pbWF0b3JzL1BhcnRpY2xlQW5pbWF0aW9uU2V0LmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJQW5pbWF0aW9uU2V0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9hbmltYXRvcnMvSUFuaW1hdGlvblNldFwiKTtcclxuaW1wb3J0IEFuaW1hdGlvbk5vZGVCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYW5pbWF0b3JzL25vZGVzL0FuaW1hdGlvbk5vZGVCYXNlXCIpO1xyXG5pbXBvcnQgSVN1Yk1lc2hcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL0lTdWJNZXNoXCIpO1xyXG5pbXBvcnQgU3ViR2VvbWV0cnlCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL1N1Ykdlb21ldHJ5QmFzZVwiKTtcclxuaW1wb3J0IE1lc2hcdFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL01lc2hcIik7XHJcblxyXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xyXG5cclxuaW1wb3J0IEFuaW1hdGlvblNldEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRpb25TZXRCYXNlXCIpO1xyXG5pbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XHJcbmltcG9ydCBBbmltYXRpb25SZWdpc3RlckNhY2hlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL0FuaW1hdGlvblJlZ2lzdGVyQ2FjaGVcIik7XHJcbmltcG9ydCBBbmltYXRpb25TdWJHZW9tZXRyeVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL0FuaW1hdGlvblN1Ykdlb21ldHJ5XCIpO1xyXG5pbXBvcnQgUGFydGljbGVBbmltYXRpb25EYXRhXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1BhcnRpY2xlQW5pbWF0aW9uRGF0YVwiKTtcclxuaW1wb3J0IFBhcnRpY2xlUHJvcGVydGllc1x0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1BhcnRpY2xlUHJvcGVydGllc1wiKTtcclxuaW1wb3J0IFBhcnRpY2xlUHJvcGVydGllc01vZGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvUGFydGljbGVQcm9wZXJ0aWVzTW9kZVwiKTtcclxuaW1wb3J0IFBhcnRpY2xlRGF0YVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9QYXJ0aWNsZURhdGFcIik7XHJcbmltcG9ydCBQYXJ0aWNsZU5vZGVCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvUGFydGljbGVOb2RlQmFzZVwiKTtcclxuaW1wb3J0IFBhcnRpY2xlVGltZU5vZGVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9ub2Rlcy9QYXJ0aWNsZVRpbWVOb2RlXCIpO1xyXG5pbXBvcnQgUGFydGljbGVHZW9tZXRyeVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYmFzZS9QYXJ0aWNsZUdlb21ldHJ5XCIpO1xyXG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcclxuXHJcblxyXG4vKipcclxuICogVGhlIGFuaW1hdGlvbiBkYXRhIHNldCB1c2VkIGJ5IHBhcnRpY2xlLWJhc2VkIGFuaW1hdG9ycywgY29udGFpbmluZyBwYXJ0aWNsZSBhbmltYXRpb24gZGF0YS5cclxuICpcclxuICogQHNlZSBhd2F5LmFuaW1hdG9ycy5QYXJ0aWNsZUFuaW1hdG9yXHJcbiAqL1xyXG5jbGFzcyBQYXJ0aWNsZUFuaW1hdGlvblNldCBleHRlbmRzIEFuaW1hdGlvblNldEJhc2UgaW1wbGVtZW50cyBJQW5pbWF0aW9uU2V0XHJcbntcclxuXHQvKiogQHByaXZhdGUgKi9cclxuXHRwdWJsaWMgX2lBbmltYXRpb25SZWdpc3RlckNhY2hlOkFuaW1hdGlvblJlZ2lzdGVyQ2FjaGU7XHJcblxyXG5cdC8vYWxsIG90aGVyIG5vZGVzIGRlcGVuZGVudCBvbiBpdFxyXG5cdHByaXZhdGUgX3RpbWVOb2RlOlBhcnRpY2xlVGltZU5vZGU7XHJcblxyXG5cdC8qKlxyXG5cdCAqIFByb3BlcnR5IHVzZWQgYnkgcGFydGljbGUgbm9kZXMgdGhhdCByZXF1aXJlIGNvbXBpbGF0aW9uIGF0IHRoZSBlbmQgb2YgdGhlIHNoYWRlclxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgUE9TVF9QUklPUklUWTpudW1iZXIgLyppbnQqLyA9IDk7XHJcblxyXG5cdC8qKlxyXG5cdCAqIFByb3BlcnR5IHVzZWQgYnkgcGFydGljbGUgbm9kZXMgdGhhdCByZXF1aXJlIGNvbG9yIGNvbXBpbGF0aW9uXHJcblx0ICovXHJcblx0cHVibGljIHN0YXRpYyBDT0xPUl9QUklPUklUWTpudW1iZXIgLyppbnQqLyA9IDE4O1xyXG5cclxuXHRwcml2YXRlIF9hbmltYXRpb25TdWJHZW9tZXRyaWVzOk9iamVjdCA9IG5ldyBPYmplY3QoKTtcclxuXHRwcml2YXRlIF9wYXJ0aWNsZU5vZGVzOkFycmF5PFBhcnRpY2xlTm9kZUJhc2U+ID0gbmV3IEFycmF5PFBhcnRpY2xlTm9kZUJhc2U+KCk7XHJcblx0cHJpdmF0ZSBfbG9jYWxEeW5hbWljTm9kZXM6QXJyYXk8UGFydGljbGVOb2RlQmFzZT4gPSBuZXcgQXJyYXk8UGFydGljbGVOb2RlQmFzZT4oKTtcclxuXHRwcml2YXRlIF9sb2NhbFN0YXRpY05vZGVzOkFycmF5PFBhcnRpY2xlTm9kZUJhc2U+ID0gbmV3IEFycmF5PFBhcnRpY2xlTm9kZUJhc2U+KCk7XHJcblx0cHJpdmF0ZSBfdG90YWxMZW5PZk9uZVZlcnRleDpudW1iZXIgLyppbnQqLyA9IDA7XHJcblxyXG5cdC8vc2V0IHRydWUgaWYgaGFzIGFuIG5vZGUgd2hpY2ggd2lsbCBjaGFuZ2UgVVZcclxuXHRwdWJsaWMgaGFzVVZOb2RlOmJvb2xlYW47XHJcblx0Ly9zZXQgaWYgdGhlIG90aGVyIG5vZGVzIG5lZWQgdG8gYWNjZXNzIHRoZSB2ZWxvY2l0eVxyXG5cdHB1YmxpYyBuZWVkVmVsb2NpdHk6Ym9vbGVhbjtcclxuXHQvL3NldCBpZiBoYXMgYSBiaWxsYm9hcmQgbm9kZS5cclxuXHRwdWJsaWMgaGFzQmlsbGJvYXJkOmJvb2xlYW47XHJcblx0Ly9zZXQgaWYgaGFzIGFuIG5vZGUgd2hpY2ggd2lsbCBhcHBseSBjb2xvciBtdWx0aXBsZSBvcGVyYXRpb25cclxuXHRwdWJsaWMgaGFzQ29sb3JNdWxOb2RlOmJvb2xlYW47XHJcblx0Ly9zZXQgaWYgaGFzIGFuIG5vZGUgd2hpY2ggd2lsbCBhcHBseSBjb2xvciBhZGQgb3BlcmF0aW9uXHJcblx0cHVibGljIGhhc0NvbG9yQWRkTm9kZTpib29sZWFuO1xyXG5cclxuXHQvKipcclxuXHQgKiBJbml0aWFsaXNlciBmdW5jdGlvbiBmb3Igc3RhdGljIHBhcnRpY2xlIHByb3BlcnRpZXMuIE5lZWRzIHRvIHJlZmVyZW5jZSBhIHdpdGggdGhlIGZvbGxvd2luZyBmb3JtYXRcclxuXHQgKlxyXG5cdCAqIDxjb2RlPlxyXG5cdCAqIGluaXRQYXJ0aWNsZUZ1bmMocHJvcDpQYXJ0aWNsZVByb3BlcnRpZXMpXHJcblx0ICoge1xyXG5cdCAqIFx0XHQvL2NvZGUgZm9yIHNldHRpbmdzIGxvY2FsIHByb3BlcnRpZXNcclxuXHQgKiB9XHJcblx0ICogPC9jb2RlPlxyXG5cdCAqXHJcblx0ICogQXNpZGUgZnJvbSBzZXR0aW5nIGFueSBwcm9wZXJ0aWVzIHJlcXVpcmVkIGluIHBhcnRpY2xlIGFuaW1hdGlvbiBub2RlcyB1c2luZyBsb2NhbCBzdGF0aWMgcHJvcGVydGllcywgdGhlIGluaXRQYXJ0aWNsZUZ1bmMgZnVuY3Rpb25cclxuXHQgKiBpcyByZXF1aXJlZCB0byB0aW1lIG5vZGUgcmVxdWlyZW1lbnRzIGFzIHRoZXkgbWF5IGJlIG5lZWRlZC4gVGhlc2UgcHJvcGVydGllcyBvbiB0aGUgUGFydGljbGVQcm9wZXJ0aWVzIG9iamVjdCBjYW4gaW5jbHVkZVxyXG5cdCAqIDxjb2RlPnN0YXJ0VGltZTwvY29kZT4sIDxjb2RlPmR1cmF0aW9uPC9jb2RlPiBhbmQgPGNvZGU+ZGVsYXk8L2NvZGU+LiBUaGUgdXNlIG9mIHRoZXNlIHByb3BlcnRpZXMgaXMgZGV0ZXJtaW5lZCBieSB0aGUgc2V0dGluZ1xyXG5cdCAqIGFyZ3VtZW50cyBwYXNzZWQgaW4gdGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gc2V0LiBCeSBkZWZhdWx0LCBvbmx5IHRoZSA8Y29kZT5zdGFydFRpbWU8L2NvZGU+IHByb3BlcnR5IGlzIHJlcXVpcmVkLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBpbml0UGFydGljbGVGdW5jOkZ1bmN0aW9uO1xyXG5cclxuXHQvKipcclxuXHQgKiBJbml0aWFsaXNlciBmdW5jdGlvbiBzY29wZSBmb3Igc3RhdGljIHBhcnRpY2xlIHByb3BlcnRpZXNcclxuXHQgKi9cclxuXHRwdWJsaWMgaW5pdFBhcnRpY2xlU2NvcGU6T2JqZWN0O1xyXG5cclxuXHQvKipcclxuXHQgKiBDcmVhdGVzIGEgbmV3IDxjb2RlPlBhcnRpY2xlQW5pbWF0aW9uU2V0PC9jb2RlPlxyXG5cdCAqXHJcblx0ICogQHBhcmFtICAgIFtvcHRpb25hbF0gdXNlc0R1cmF0aW9uICAgIERlZmluZXMgd2hldGhlciB0aGUgYW5pbWF0aW9uIHNldCB1c2VzIHRoZSA8Y29kZT5kdXJhdGlvbjwvY29kZT4gZGF0YSBpbiBpdHMgc3RhdGljIHByb3BlcnRpZXMgdG8gZGV0ZXJtaW5lIGhvdyBsb25nIGEgcGFydGljbGUgaXMgdmlzaWJsZSBmb3IuIERlZmF1bHRzIHRvIGZhbHNlLlxyXG5cdCAqIEBwYXJhbSAgICBbb3B0aW9uYWxdIHVzZXNMb29waW5nICAgICBEZWZpbmVzIHdoZXRoZXIgdGhlIGFuaW1hdGlvbiBzZXQgdXNlcyBhIGxvb3BpbmcgdGltZWZyYW1lIGZvciBlYWNoIHBhcnRpY2xlIGRldGVybWluZWQgYnkgdGhlIDxjb2RlPnN0YXJ0VGltZTwvY29kZT4sIDxjb2RlPmR1cmF0aW9uPC9jb2RlPiBhbmQgPGNvZGU+ZGVsYXk8L2NvZGU+IGRhdGEgaW4gaXRzIHN0YXRpYyBwcm9wZXJ0aWVzIGZ1bmN0aW9uLiBEZWZhdWx0cyB0byBmYWxzZS4gUmVxdWlyZXMgPGNvZGU+dXNlc0R1cmF0aW9uPC9jb2RlPiB0byBiZSB0cnVlLlxyXG5cdCAqIEBwYXJhbSAgICBbb3B0aW9uYWxdIHVzZXNEZWxheSAgICAgICBEZWZpbmVzIHdoZXRoZXIgdGhlIGFuaW1hdGlvbiBzZXQgdXNlcyB0aGUgPGNvZGU+ZGVsYXk8L2NvZGU+IGRhdGEgaW4gaXRzIHN0YXRpYyBwcm9wZXJ0aWVzIHRvIGRldGVybWluZSBob3cgbG9uZyBhIHBhcnRpY2xlIGlzIGhpZGRlbiBmb3IuIERlZmF1bHRzIHRvIGZhbHNlLiBSZXF1aXJlcyA8Y29kZT51c2VzTG9vcGluZzwvY29kZT4gdG8gYmUgdHJ1ZS5cclxuXHQgKi9cclxuXHRjb25zdHJ1Y3Rvcih1c2VzRHVyYXRpb246Ym9vbGVhbiA9IGZhbHNlLCB1c2VzTG9vcGluZzpib29sZWFuID0gZmFsc2UsIHVzZXNEZWxheTpib29sZWFuID0gZmFsc2UpXHJcblx0e1xyXG5cdFx0c3VwZXIoKTtcclxuXHJcblx0XHQvL2F1dG9tYXRpY2FsbHkgYWRkIGEgcGFydGljbGUgdGltZSBub2RlIHRvIHRoZSBzZXRcclxuXHRcdHRoaXMuYWRkQW5pbWF0aW9uKHRoaXMuX3RpbWVOb2RlID0gbmV3IFBhcnRpY2xlVGltZU5vZGUodXNlc0R1cmF0aW9uLCB1c2VzTG9vcGluZywgdXNlc0RlbGF5KSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBSZXR1cm5zIGEgdmVjdG9yIG9mIHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gbm9kZXMgY29udGFpbmVkIHdpdGhpbiB0aGUgc2V0LlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgcGFydGljbGVOb2RlcygpOkFycmF5PFBhcnRpY2xlTm9kZUJhc2U+XHJcblx0e1xyXG5cdFx0cmV0dXJuIHRoaXMuX3BhcnRpY2xlTm9kZXM7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBhZGRBbmltYXRpb24obm9kZTpBbmltYXRpb25Ob2RlQmFzZSlcclxuXHR7XHJcblx0XHR2YXIgaTpudW1iZXIgLyppbnQqLztcclxuXHRcdHZhciBuOlBhcnRpY2xlTm9kZUJhc2UgPSA8UGFydGljbGVOb2RlQmFzZT4gbm9kZTtcclxuXHRcdG4uX2lQcm9jZXNzQW5pbWF0aW9uU2V0dGluZyh0aGlzKTtcclxuXHRcdGlmIChuLm1vZGUgPT0gUGFydGljbGVQcm9wZXJ0aWVzTW9kZS5MT0NBTF9TVEFUSUMpIHtcclxuXHRcdFx0bi5faURhdGFPZmZzZXQgPSB0aGlzLl90b3RhbExlbk9mT25lVmVydGV4O1xyXG5cdFx0XHR0aGlzLl90b3RhbExlbk9mT25lVmVydGV4ICs9IG4uZGF0YUxlbmd0aDtcclxuXHRcdFx0dGhpcy5fbG9jYWxTdGF0aWNOb2Rlcy5wdXNoKG4pO1xyXG5cdFx0fSBlbHNlIGlmIChuLm1vZGUgPT0gUGFydGljbGVQcm9wZXJ0aWVzTW9kZS5MT0NBTF9EWU5BTUlDKVxyXG5cdFx0XHR0aGlzLl9sb2NhbER5bmFtaWNOb2Rlcy5wdXNoKG4pO1xyXG5cclxuXHRcdGZvciAoaSA9IHRoaXMuX3BhcnRpY2xlTm9kZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuXHRcdFx0aWYgKHRoaXMuX3BhcnRpY2xlTm9kZXNbaV0ucHJpb3JpdHkgPD0gbi5wcmlvcml0eSlcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9wYXJ0aWNsZU5vZGVzLnNwbGljZShpICsgMSwgMCwgbik7XHJcblxyXG5cdFx0c3VwZXIuYWRkQW5pbWF0aW9uKG5vZGUpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgYWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHN0YWdlOlN0YWdlKVxyXG5cdHtcclxuLy9cdFx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSA9IHBhc3MuYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIGRlYWN0aXZhdGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHN0YWdlOlN0YWdlKVxyXG5cdHtcclxuLy9cdFx0XHR2YXIgY29udGV4dDpJQ29udGV4dEdMID0gPElDb250ZXh0R0w+IHN0YWdlLmNvbnRleHQ7XHJcbi8vXHRcdFx0dmFyIG9mZnNldDpudW1iZXIgLyppbnQqLyA9IHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnZlcnRleEF0dHJpYnV0ZXNPZmZzZXQ7XHJcbi8vXHRcdFx0dmFyIHVzZWQ6bnVtYmVyIC8qaW50Ki8gPSB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5udW1Vc2VkU3RyZWFtcztcclxuLy9cdFx0XHRmb3IgKHZhciBpOm51bWJlciAvKmludCovID0gb2Zmc2V0OyBpIDwgdXNlZDsgaSsrKVxyXG4vL1x0XHRcdFx0Y29udGV4dC5zZXRWZXJ0ZXhCdWZmZXJBdChpLCBudWxsKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIGdldEFHQUxWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpzdHJpbmdcclxuXHR7XHJcblx0XHQvL2dyYWIgYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSBmcm9tIHRoZSBtYXRlcmlhbHBhc3NiYXNlIG9yIGNyZWF0ZSBhIG5ldyBvbmUgaWYgdGhlIGZpcnN0IHRpbWVcclxuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlID0gc2hhZGVyT2JqZWN0LmFuaW1hdGlvblJlZ2lzdGVyQ2FjaGU7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlID09IG51bGwpXHJcblx0XHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlID0gc2hhZGVyT2JqZWN0LmFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUgPSBuZXcgQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZShzaGFkZXJPYmplY3QucHJvZmlsZSk7XHJcblxyXG5cdFx0Ly9yZXNldCBhbmltYXRpb25SZWdpc3RlckNhY2hlXHJcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS52ZXJ0ZXhDb25zdGFudE9mZnNldCA9IHNoYWRlck9iamVjdC5udW1Vc2VkVmVydGV4Q29uc3RhbnRzO1xyXG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudmVydGV4QXR0cmlidXRlc09mZnNldCA9IHNoYWRlck9iamVjdC5udW1Vc2VkU3RyZWFtcztcclxuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnZhcnlpbmdzT2Zmc2V0ID0gc2hhZGVyT2JqZWN0Lm51bVVzZWRWYXJ5aW5ncztcclxuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLmZyYWdtZW50Q29uc3RhbnRPZmZzZXQgPSBzaGFkZXJPYmplY3QubnVtVXNlZEZyYWdtZW50Q29uc3RhbnRzO1xyXG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuaGFzVVZOb2RlID0gdGhpcy5oYXNVVk5vZGU7XHJcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5uZWVkVmVsb2NpdHkgPSB0aGlzLm5lZWRWZWxvY2l0eTtcclxuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLmhhc0JpbGxib2FyZCA9IHRoaXMuaGFzQmlsbGJvYXJkO1xyXG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuc291cmNlUmVnaXN0ZXJzID0gc2hhZGVyT2JqZWN0LmFuaW1hdGFibGVBdHRyaWJ1dGVzO1xyXG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudGFyZ2V0UmVnaXN0ZXJzID0gc2hhZGVyT2JqZWN0LmFuaW1hdGlvblRhcmdldFJlZ2lzdGVycztcclxuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLm5lZWRGcmFnbWVudEFuaW1hdGlvbiA9IHNoYWRlck9iamVjdC51c2VzRnJhZ21lbnRBbmltYXRpb247XHJcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5uZWVkVVZBbmltYXRpb24gPSAhc2hhZGVyT2JqZWN0LnVzZXNVVlRyYW5zZm9ybTtcclxuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLmhhc0NvbG9yQWRkTm9kZSA9IHRoaXMuaGFzQ29sb3JBZGROb2RlO1xyXG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuaGFzQ29sb3JNdWxOb2RlID0gdGhpcy5oYXNDb2xvck11bE5vZGU7XHJcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5yZXNldCgpO1xyXG5cclxuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XHJcblxyXG5cdFx0Y29kZSArPSB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5nZXRJbml0Q29kZSgpO1xyXG5cclxuXHRcdHZhciBub2RlOlBhcnRpY2xlTm9kZUJhc2U7XHJcblx0XHR2YXIgaTpudW1iZXIgLyppbnQqLztcclxuXHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgdGhpcy5fcGFydGljbGVOb2Rlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRub2RlID0gdGhpcy5fcGFydGljbGVOb2Rlc1tpXTtcclxuXHRcdFx0aWYgKG5vZGUucHJpb3JpdHkgPCBQYXJ0aWNsZUFuaW1hdGlvblNldC5QT1NUX1BSSU9SSVRZKVxyXG5cdFx0XHRcdGNvZGUgKz0gbm9kZS5nZXRBR0FMVmVydGV4Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlKTtcclxuXHRcdH1cclxuXHJcblx0XHRjb2RlICs9IHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLmdldENvbWJpbmF0aW9uQ29kZSgpO1xyXG5cclxuXHRcdGZvciAoaSA9IDA7IGkgPCB0aGlzLl9wYXJ0aWNsZU5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdG5vZGUgPSB0aGlzLl9wYXJ0aWNsZU5vZGVzW2ldO1xyXG5cdFx0XHRpZiAobm9kZS5wcmlvcml0eSA+PSBQYXJ0aWNsZUFuaW1hdGlvblNldC5QT1NUX1BSSU9SSVRZICYmIG5vZGUucHJpb3JpdHkgPCBQYXJ0aWNsZUFuaW1hdGlvblNldC5DT0xPUl9QUklPUklUWSlcclxuXHRcdFx0XHRjb2RlICs9IG5vZGUuZ2V0QUdBTFZlcnRleENvZGUoc2hhZGVyT2JqZWN0LCB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29kZSArPSB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5pbml0Q29sb3JSZWdpc3RlcnMoKTtcclxuXHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgdGhpcy5fcGFydGljbGVOb2Rlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRub2RlID0gdGhpcy5fcGFydGljbGVOb2Rlc1tpXTtcclxuXHRcdFx0aWYgKG5vZGUucHJpb3JpdHkgPj0gUGFydGljbGVBbmltYXRpb25TZXQuQ09MT1JfUFJJT1JJVFkpXHJcblx0XHRcdFx0Y29kZSArPSBub2RlLmdldEFHQUxWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUpO1xyXG5cdFx0fVxyXG5cdFx0Y29kZSArPSB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5nZXRDb2xvclBhc3NDb2RlKCk7XHJcblx0XHRyZXR1cm4gY29kZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIGdldEFHQUxVVkNvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XHJcblx0XHRpZiAodGhpcy5oYXNVVk5vZGUpIHtcclxuXHRcdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuc2V0VVZTb3VyY2VBbmRUYXJnZXQoc2hhZGVyT2JqZWN0LnV2U291cmNlLCBzaGFkZXJPYmplY3QudXZUYXJnZXQpO1xyXG5cdFx0XHRjb2RlICs9IFwibW92IFwiICsgdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudXZUYXJnZXQgKyBcIi54eSxcIiArIHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnV2QXR0cmlidXRlLnRvU3RyaW5nKCkgKyBcIlxcblwiO1xyXG5cdFx0XHR2YXIgbm9kZTpQYXJ0aWNsZU5vZGVCYXNlO1xyXG5cdFx0XHRmb3IgKHZhciBpOm51bWJlciAvKnVpbnQqLyA9IDA7IGkgPCB0aGlzLl9wYXJ0aWNsZU5vZGVzLmxlbmd0aDsgaSsrKVxyXG5cdFx0XHRcdG5vZGUgPSB0aGlzLl9wYXJ0aWNsZU5vZGVzW2ldO1xyXG5cdFx0XHRcdGNvZGUgKz0gbm9kZS5nZXRBR0FMVVZDb2RlKHNoYWRlck9iamVjdCwgdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUpO1xyXG5cdFx0XHRjb2RlICs9IFwibW92IFwiICsgdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudXZWYXIudG9TdHJpbmcoKSArIFwiLFwiICsgdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudXZUYXJnZXQgKyBcIi54eVxcblwiO1xyXG5cdFx0fSBlbHNlXHJcblx0XHRcdGNvZGUgKz0gXCJtb3YgXCIgKyBzaGFkZXJPYmplY3QudXZUYXJnZXQgKyBcIixcIiArIHNoYWRlck9iamVjdC51dlNvdXJjZSArIFwiXFxuXCI7XHJcblx0XHRyZXR1cm4gY29kZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEBpbmhlcml0RG9jXHJcblx0ICovXHJcblx0cHVibGljIGdldEFHQUxGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHNoYWRlZFRhcmdldDpzdHJpbmcpOnN0cmluZ1xyXG5cdHtcclxuXHRcdHJldHVybiB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5nZXRDb2xvckNvbWJpbmF0aW9uQ29kZShzaGFkZWRUYXJnZXQpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQGluaGVyaXREb2NcclxuXHQgKi9cclxuXHRwdWJsaWMgZG9uZUFHQUxDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKVxyXG5cdHtcclxuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnNldERhdGFMZW5ndGgoKTtcclxuXHJcblx0XHQvL3NldCB2ZXJ0ZXhaZXJvQ29uc3QsdmVydGV4T25lQ29uc3QsdmVydGV4VHdvQ29uc3RcclxuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnNldFZlcnRleENvbnN0KHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnZlcnRleFplcm9Db25zdC5pbmRleCwgMCwgMSwgMiwgMCk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBnZXQgdXNlc0NQVSgpOmJvb2xlYW5cclxuXHR7XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBAaW5oZXJpdERvY1xyXG5cdCAqL1xyXG5cdHB1YmxpYyBjYW5jZWxHUFVDb21wYXRpYmlsaXR5KClcclxuXHR7XHJcblxyXG5cdH1cclxuXHJcblx0cHVibGljIGRpc3Bvc2UoKVxyXG5cdHtcclxuXHRcdGZvciAodmFyIGtleSBpbiB0aGlzLl9hbmltYXRpb25TdWJHZW9tZXRyaWVzKVxyXG5cdFx0XHQoPEFuaW1hdGlvblN1Ykdlb21ldHJ5PiB0aGlzLl9hbmltYXRpb25TdWJHZW9tZXRyaWVzW2tleV0pLmRpc3Bvc2UoKTtcclxuXHJcblx0XHRzdXBlci5kaXNwb3NlKCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0QW5pbWF0aW9uU3ViR2VvbWV0cnkoc3ViTWVzaDpJU3ViTWVzaClcclxuXHR7XHJcblx0XHR2YXIgbWVzaDpNZXNoID0gc3ViTWVzaC5wYXJlbnRNZXNoO1xyXG5cdFx0dmFyIGFuaW1hdGlvblN1Ykdlb21ldHJ5OkFuaW1hdGlvblN1Ykdlb21ldHJ5ID0gKG1lc2guc2hhcmVBbmltYXRpb25HZW9tZXRyeSk/IHRoaXMuX2FuaW1hdGlvblN1Ykdlb21ldHJpZXNbc3ViTWVzaC5zdWJHZW9tZXRyeS5pZF0gOiB0aGlzLl9hbmltYXRpb25TdWJHZW9tZXRyaWVzW3N1Yk1lc2guaWRdO1xyXG5cclxuXHRcdGlmIChhbmltYXRpb25TdWJHZW9tZXRyeSlcclxuXHRcdFx0cmV0dXJuIGFuaW1hdGlvblN1Ykdlb21ldHJ5O1xyXG5cclxuXHRcdHRoaXMuX2lHZW5lcmF0ZUFuaW1hdGlvblN1Ykdlb21ldHJpZXMobWVzaCk7XHJcblxyXG5cdFx0cmV0dXJuIChtZXNoLnNoYXJlQW5pbWF0aW9uR2VvbWV0cnkpPyB0aGlzLl9hbmltYXRpb25TdWJHZW9tZXRyaWVzW3N1Yk1lc2guc3ViR2VvbWV0cnkuaWRdIDogdGhpcy5fYW5pbWF0aW9uU3ViR2VvbWV0cmllc1tzdWJNZXNoLmlkXTtcclxuXHR9XHJcblxyXG5cclxuXHQvKiogQHByaXZhdGUgKi9cclxuXHRwdWJsaWMgX2lHZW5lcmF0ZUFuaW1hdGlvblN1Ykdlb21ldHJpZXMobWVzaDpNZXNoKVxyXG5cdHtcclxuXHRcdGlmICh0aGlzLmluaXRQYXJ0aWNsZUZ1bmMgPT0gbnVsbClcclxuXHRcdFx0dGhyb3cobmV3IEVycm9yKFwibm8gaW5pdFBhcnRpY2xlRnVuYyBzZXRcIikpO1xyXG5cclxuXHRcdHZhciBnZW9tZXRyeTpQYXJ0aWNsZUdlb21ldHJ5ID0gPFBhcnRpY2xlR2VvbWV0cnk+IG1lc2guZ2VvbWV0cnk7XHJcblxyXG5cdFx0aWYgKCFnZW9tZXRyeSlcclxuXHRcdFx0dGhyb3cobmV3IEVycm9yKFwiUGFydGljbGUgYW5pbWF0aW9uIGNhbiBvbmx5IGJlIHBlcmZvcm1lZCBvbiBhIFBhcnRpY2xlR2VvbWV0cnkgb2JqZWN0XCIpKTtcclxuXHJcblx0XHR2YXIgaTpudW1iZXIgLyppbnQqLywgajpudW1iZXIgLyppbnQqLywgazpudW1iZXIgLyppbnQqLztcclxuXHRcdHZhciBhbmltYXRpb25TdWJHZW9tZXRyeTpBbmltYXRpb25TdWJHZW9tZXRyeTtcclxuXHRcdHZhciBuZXdBbmltYXRpb25TdWJHZW9tZXRyeTpib29sZWFuID0gZmFsc2U7XHJcblx0XHR2YXIgc3ViR2VvbWV0cnk6U3ViR2VvbWV0cnlCYXNlO1xyXG5cdFx0dmFyIHN1Yk1lc2g6SVN1Yk1lc2g7XHJcblx0XHR2YXIgbG9jYWxOb2RlOlBhcnRpY2xlTm9kZUJhc2U7XHJcblxyXG5cdFx0Zm9yIChpID0gMDsgaSA8IG1lc2guc3ViTWVzaGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHN1Yk1lc2ggPSBtZXNoLnN1Yk1lc2hlc1tpXTtcclxuXHRcdFx0c3ViR2VvbWV0cnkgPSBzdWJNZXNoLnN1Ykdlb21ldHJ5O1xyXG5cdFx0XHRpZiAobWVzaC5zaGFyZUFuaW1hdGlvbkdlb21ldHJ5KSB7XHJcblx0XHRcdFx0YW5pbWF0aW9uU3ViR2VvbWV0cnkgPSB0aGlzLl9hbmltYXRpb25TdWJHZW9tZXRyaWVzW3N1Ykdlb21ldHJ5LmlkXTtcclxuXHJcblx0XHRcdFx0aWYgKGFuaW1hdGlvblN1Ykdlb21ldHJ5KVxyXG5cdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGFuaW1hdGlvblN1Ykdlb21ldHJ5ID0gbmV3IEFuaW1hdGlvblN1Ykdlb21ldHJ5KCk7XHJcblxyXG5cdFx0XHRpZiAobWVzaC5zaGFyZUFuaW1hdGlvbkdlb21ldHJ5KVxyXG5cdFx0XHRcdHRoaXMuX2FuaW1hdGlvblN1Ykdlb21ldHJpZXNbc3ViR2VvbWV0cnkuaWRdID0gYW5pbWF0aW9uU3ViR2VvbWV0cnk7XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHR0aGlzLl9hbmltYXRpb25TdWJHZW9tZXRyaWVzW3N1Yk1lc2guaWRdID0gYW5pbWF0aW9uU3ViR2VvbWV0cnk7XHJcblxyXG5cdFx0XHRuZXdBbmltYXRpb25TdWJHZW9tZXRyeSA9IHRydWU7XHJcblxyXG5cdFx0XHQvL2NyZWF0ZSB0aGUgdmVydGV4RGF0YSB2ZWN0b3IgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIGxvY2FsIG5vZGUgZGF0YVxyXG5cdFx0XHRhbmltYXRpb25TdWJHZW9tZXRyeS5jcmVhdGVWZXJ0ZXhEYXRhKHN1Ykdlb21ldHJ5Lm51bVZlcnRpY2VzLCB0aGlzLl90b3RhbExlbk9mT25lVmVydGV4KTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIW5ld0FuaW1hdGlvblN1Ykdlb21ldHJ5KVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0dmFyIHBhcnRpY2xlczpBcnJheTxQYXJ0aWNsZURhdGE+ID0gZ2VvbWV0cnkucGFydGljbGVzO1xyXG5cdFx0dmFyIHBhcnRpY2xlc0xlbmd0aDpudW1iZXIgLyp1aW50Ki8gPSBwYXJ0aWNsZXMubGVuZ3RoO1xyXG5cdFx0dmFyIG51bVBhcnRpY2xlczpudW1iZXIgLyp1aW50Ki8gPSBnZW9tZXRyeS5udW1QYXJ0aWNsZXM7XHJcblx0XHR2YXIgcGFydGljbGVQcm9wZXJ0aWVzOlBhcnRpY2xlUHJvcGVydGllcyA9IG5ldyBQYXJ0aWNsZVByb3BlcnRpZXMoKTtcclxuXHRcdHZhciBwYXJ0aWNsZTpQYXJ0aWNsZURhdGE7XHJcblxyXG5cdFx0dmFyIG9uZURhdGFMZW46bnVtYmVyIC8qaW50Ki87XHJcblx0XHR2YXIgb25lRGF0YU9mZnNldDpudW1iZXIgLyppbnQqLztcclxuXHRcdHZhciBjb3VudGVyRm9yVmVydGV4Om51bWJlciAvKmludCovO1xyXG5cdFx0dmFyIGNvdW50ZXJGb3JPbmVEYXRhOm51bWJlciAvKmludCovO1xyXG5cdFx0dmFyIG9uZURhdGE6QXJyYXk8bnVtYmVyPjtcclxuXHRcdHZhciBudW1WZXJ0aWNlczpudW1iZXIgLyp1aW50Ki87XHJcblx0XHR2YXIgdmVydGV4RGF0YTpBcnJheTxudW1iZXI+O1xyXG5cdFx0dmFyIHZlcnRleExlbmd0aDpudW1iZXIgLyp1aW50Ki87XHJcblx0XHR2YXIgc3RhcnRpbmdPZmZzZXQ6bnVtYmVyIC8qdWludCovO1xyXG5cdFx0dmFyIHZlcnRleE9mZnNldDpudW1iZXIgLyp1aW50Ki87XHJcblxyXG5cdFx0Ly9kZWZhdWx0IHZhbHVlcyBmb3IgcGFydGljbGUgcGFyYW1cclxuXHRcdHBhcnRpY2xlUHJvcGVydGllcy50b3RhbCA9IG51bVBhcnRpY2xlcztcclxuXHRcdHBhcnRpY2xlUHJvcGVydGllcy5zdGFydFRpbWUgPSAwO1xyXG5cdFx0cGFydGljbGVQcm9wZXJ0aWVzLmR1cmF0aW9uID0gMTAwMDtcclxuXHRcdHBhcnRpY2xlUHJvcGVydGllcy5kZWxheSA9IDAuMTtcclxuXHJcblx0XHRpID0gMDtcclxuXHRcdGogPSAwO1xyXG5cdFx0d2hpbGUgKGkgPCBudW1QYXJ0aWNsZXMpIHtcclxuXHRcdFx0cGFydGljbGVQcm9wZXJ0aWVzLmluZGV4ID0gaTtcclxuXHJcblx0XHRcdC8vY2FsbCB0aGUgaW5pdCBvbiB0aGUgcGFydGljbGUgcGFyYW1ldGVyc1xyXG5cdFx0XHR0aGlzLmluaXRQYXJ0aWNsZUZ1bmMuY2FsbCh0aGlzLmluaXRQYXJ0aWNsZVNjb3BlLCBwYXJ0aWNsZVByb3BlcnRpZXMpO1xyXG5cclxuXHRcdFx0Ly9jcmVhdGUgdGhlIG5leHQgc2V0IG9mIG5vZGUgcHJvcGVydGllcyBmb3IgdGhlIHBhcnRpY2xlXHJcblx0XHRcdGZvciAoayA9IDA7IGsgPCB0aGlzLl9sb2NhbFN0YXRpY05vZGVzLmxlbmd0aDsgaysrKVxyXG5cdFx0XHRcdHRoaXMuX2xvY2FsU3RhdGljTm9kZXNba10uX2lHZW5lcmF0ZVByb3BlcnR5T2ZPbmVQYXJ0aWNsZShwYXJ0aWNsZVByb3BlcnRpZXMpO1xyXG5cclxuXHRcdFx0Ly9sb29wIHRocm91Z2ggYWxsIHBhcnRpY2xlIGRhdGEgZm9yIHRoZSBjdXJlbnQgcGFydGljbGVcclxuXHRcdFx0d2hpbGUgKGogPCBwYXJ0aWNsZXNMZW5ndGggJiYgKHBhcnRpY2xlID0gcGFydGljbGVzW2pdKS5wYXJ0aWNsZUluZGV4ID09IGkpIHtcclxuXHRcdFx0XHQvL2ZpbmQgdGhlIHRhcmdldCBhbmltYXRpb25TdWJHZW9tZXRyeVxyXG5cdFx0XHRcdGZvciAoayA9IDA7IGsgPCBtZXNoLnN1Yk1lc2hlcy5sZW5ndGg7IGsrKykge1xyXG5cdFx0XHRcdFx0c3ViTWVzaCA9IG1lc2guc3ViTWVzaGVzW2tdO1xyXG5cdFx0XHRcdFx0aWYgKHN1Yk1lc2guc3ViR2VvbWV0cnkgPT0gcGFydGljbGUuc3ViR2VvbWV0cnkpIHtcclxuXHRcdFx0XHRcdFx0YW5pbWF0aW9uU3ViR2VvbWV0cnkgPSAobWVzaC5zaGFyZUFuaW1hdGlvbkdlb21ldHJ5KT8gdGhpcy5fYW5pbWF0aW9uU3ViR2VvbWV0cmllc1tzdWJNZXNoLnN1Ykdlb21ldHJ5LmlkXSA6IHRoaXMuX2FuaW1hdGlvblN1Ykdlb21ldHJpZXNbc3ViTWVzaC5pZF07XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRudW1WZXJ0aWNlcyA9IHBhcnRpY2xlLm51bVZlcnRpY2VzO1xyXG5cdFx0XHRcdHZlcnRleERhdGEgPSBhbmltYXRpb25TdWJHZW9tZXRyeS52ZXJ0ZXhEYXRhO1xyXG5cdFx0XHRcdHZlcnRleExlbmd0aCA9IG51bVZlcnRpY2VzKnRoaXMuX3RvdGFsTGVuT2ZPbmVWZXJ0ZXg7XHJcblx0XHRcdFx0c3RhcnRpbmdPZmZzZXQgPSBhbmltYXRpb25TdWJHZW9tZXRyeS5udW1Qcm9jZXNzZWRWZXJ0aWNlcyp0aGlzLl90b3RhbExlbk9mT25lVmVydGV4O1xyXG5cclxuXHRcdFx0XHQvL2xvb3AgdGhyb3VnaCBlYWNoIHN0YXRpYyBsb2NhbCBub2RlIGluIHRoZSBhbmltYXRpb24gc2V0XHJcblx0XHRcdFx0Zm9yIChrID0gMDsgayA8IHRoaXMuX2xvY2FsU3RhdGljTm9kZXMubGVuZ3RoOyBrKyspIHtcclxuXHRcdFx0XHRcdGxvY2FsTm9kZSA9IHRoaXMuX2xvY2FsU3RhdGljTm9kZXNba107XHJcblx0XHRcdFx0XHRvbmVEYXRhID0gbG9jYWxOb2RlLm9uZURhdGE7XHJcblx0XHRcdFx0XHRvbmVEYXRhTGVuID0gbG9jYWxOb2RlLmRhdGFMZW5ndGg7XHJcblx0XHRcdFx0XHRvbmVEYXRhT2Zmc2V0ID0gc3RhcnRpbmdPZmZzZXQgKyBsb2NhbE5vZGUuX2lEYXRhT2Zmc2V0O1xyXG5cclxuXHRcdFx0XHRcdC8vbG9vcCB0aHJvdWdoIGVhY2ggdmVydGV4IHNldCBpbiB0aGUgdmVydGV4IGRhdGFcclxuXHRcdFx0XHRcdGZvciAoY291bnRlckZvclZlcnRleCA9IDA7IGNvdW50ZXJGb3JWZXJ0ZXggPCB2ZXJ0ZXhMZW5ndGg7IGNvdW50ZXJGb3JWZXJ0ZXggKz0gdGhpcy5fdG90YWxMZW5PZk9uZVZlcnRleCkge1xyXG5cdFx0XHRcdFx0XHR2ZXJ0ZXhPZmZzZXQgPSBvbmVEYXRhT2Zmc2V0ICsgY291bnRlckZvclZlcnRleDtcclxuXHJcblx0XHRcdFx0XHRcdC8vYWRkIHRoZSBkYXRhIGZvciB0aGUgbG9jYWwgbm9kZSB0byB0aGUgdmVydGV4IGRhdGFcclxuXHRcdFx0XHRcdFx0Zm9yIChjb3VudGVyRm9yT25lRGF0YSA9IDA7IGNvdW50ZXJGb3JPbmVEYXRhIDwgb25lRGF0YUxlbjsgY291bnRlckZvck9uZURhdGErKylcclxuXHRcdFx0XHRcdFx0XHR2ZXJ0ZXhEYXRhW3ZlcnRleE9mZnNldCArIGNvdW50ZXJGb3JPbmVEYXRhXSA9IG9uZURhdGFbY291bnRlckZvck9uZURhdGFdO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vc3RvcmUgcGFydGljbGUgcHJvcGVydGllcyBpZiB0aGV5IG5lZWQgdG8gYmUgcmV0cmVpdmVkIGZvciBkeW5hbWljIGxvY2FsIG5vZGVzXHJcblx0XHRcdFx0aWYgKHRoaXMuX2xvY2FsRHluYW1pY05vZGVzLmxlbmd0aClcclxuXHRcdFx0XHRcdGFuaW1hdGlvblN1Ykdlb21ldHJ5LmFuaW1hdGlvblBhcnRpY2xlcy5wdXNoKG5ldyBQYXJ0aWNsZUFuaW1hdGlvbkRhdGEoaSwgcGFydGljbGVQcm9wZXJ0aWVzLnN0YXJ0VGltZSwgcGFydGljbGVQcm9wZXJ0aWVzLmR1cmF0aW9uLCBwYXJ0aWNsZVByb3BlcnRpZXMuZGVsYXksIHBhcnRpY2xlKSk7XHJcblxyXG5cdFx0XHRcdGFuaW1hdGlvblN1Ykdlb21ldHJ5Lm51bVByb2Nlc3NlZFZlcnRpY2VzICs9IG51bVZlcnRpY2VzO1xyXG5cclxuXHRcdFx0XHQvL25leHQgaW5kZXhcclxuXHRcdFx0XHRqKys7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vbmV4dCBwYXJ0aWNsZVxyXG5cdFx0XHRpKys7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgPSBQYXJ0aWNsZUFuaW1hdGlvblNldDsiXX0=