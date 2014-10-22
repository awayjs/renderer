var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationSetBase = require("awayjs-stagegl/lib/animators/AnimationSetBase");
var AnimationRegisterCache = require("awayjs-stagegl/lib/animators/data/AnimationRegisterCache");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdG9ycy9wYXJ0aWNsZWFuaW1hdGlvbnNldC50cyJdLCJuYW1lcyI6WyJQYXJ0aWNsZUFuaW1hdGlvblNldCIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LmNvbnN0cnVjdG9yIiwiUGFydGljbGVBbmltYXRpb25TZXQucGFydGljbGVOb2RlcyIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LmFkZEFuaW1hdGlvbiIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LmFjdGl2YXRlIiwiUGFydGljbGVBbmltYXRpb25TZXQuZGVhY3RpdmF0ZSIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LmdldEFHQUxWZXJ0ZXhDb2RlIiwiUGFydGljbGVBbmltYXRpb25TZXQuZ2V0QUdBTFVWQ29kZSIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LmdldEFHQUxGcmFnbWVudENvZGUiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5kb25lQUdBTENvZGUiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC51c2VzQ1BVIiwiUGFydGljbGVBbmltYXRpb25TZXQuY2FuY2VsR1BVQ29tcGF0aWJpbGl0eSIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0LmRpc3Bvc2UiLCJQYXJ0aWNsZUFuaW1hdGlvblNldC5nZXRBbmltYXRpb25TdWJHZW9tZXRyeSIsIlBhcnRpY2xlQW5pbWF0aW9uU2V0Ll9pR2VuZXJhdGVBbmltYXRpb25TdWJHZW9tZXRyaWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFNQSxJQUFPLGdCQUFnQixXQUFlLCtDQUErQyxDQUFDLENBQUM7QUFFdkYsSUFBTyxzQkFBc0IsV0FBYSwwREFBMEQsQ0FBQyxDQUFDO0FBSXRHLElBQU8sb0JBQW9CLFdBQWMsMkRBQTJELENBQUMsQ0FBQztBQUN0RyxJQUFPLHFCQUFxQixXQUFhLDREQUE0RCxDQUFDLENBQUM7QUFDdkcsSUFBTyxrQkFBa0IsV0FBYyx5REFBeUQsQ0FBQyxDQUFDO0FBQ2xHLElBQU8sc0JBQXNCLFdBQWEsNkRBQTZELENBQUMsQ0FBQztBQUd6RyxJ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O1FBQ3pEQSxJQUFJQSxDQUFDQSx3QkFBd0JBLENBQUNBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBO1FBQy9EQSxJQUFJQSxDQUFDQSx3QkFBd0JBLENBQUNBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBO1FBQy9EQSxJQUFJQSxDQUFDQSx3QkFBd0JBLENBQUNBLGVBQWVBLEdBQUdBLFlBQVlBLENBQUNBLG9CQUFvQkEsQ0FBQ0E7UUFDbEZBLElBQUlBLENBQUNBLHdCQUF3QkEsQ0FBQ0EsZUFBZUEsR0FBR0EsWUFBWUEsQ0FBQ0Esd0JBQXdCQSxDQUFDQTtRQUN0RkEsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxDQUFDQSxxQkFBcUJBLEdBQUdBLFlBQVlBLENBQUNBLHFCQUFxQkEsQ0FBQ0E7UUFDekZBLElBQUlBLENBQUNBLHdCQUF3QkEsQ0FBQ0EsZUFBZUEsR0FBR0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7UUFDOUVBLElBQUlBLENBQUNBLHdCQUF3QkEsQ0FBQ0EsZUFBZUEsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7UUFDckVBLElBQUlBLENBQUNBLHdCQUF3QkEsQ0FBQ0EsZUFBZUEsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7UUFDckVBLElBQUlBLENBQUNBLHdCQUF3QkEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFFdENBLElBQUlBLElBQUlBLEdBQVVBLEVBQUVBLENBQUNBO1FBRXJCQSxJQUFJQSxJQUFJQSxJQUFJQSxDQUFDQSx3QkFBd0JBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO1FBRXBEQSxJQUFJQSxJQUFxQkEsQ0FBQ0E7UUFDMUJBLElBQUlBLENBQUNBLENBQVFBLE9BQURBLEFBQVFBLENBQUNBO1FBRXJCQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUNqREEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDOUJBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLG9CQUFvQkEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7Z0JBQ3REQSxJQUFJQSxJQUFJQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLFlBQVlBLEVBQUVBLElBQUlBLENBQUNBLHdCQUF3QkEsQ0FBQ0EsQ0FBQ0E7UUFDOUVBLENBQUNBO1FBRURBLElBQUlBLElBQUlBLElBQUlBLENBQUNBLHdCQUF3QkEsQ0FBQ0Esa0JBQWtCQSxFQUFFQSxDQUFDQTtRQUUzREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7WUFDakRBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzlCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxJQUFJQSxvQkFBb0JBLENBQUNBLGFBQWFBLElBQUlBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLG9CQUFvQkEsQ0FBQ0EsY0FBY0EsQ0FBQ0E7Z0JBQzlHQSxJQUFJQSxJQUFJQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLFlBQVlBLEVBQUVBLElBQUlBLENBQUNBLHdCQUF3QkEsQ0FBQ0EsQ0FBQ0E7UUFDOUVBLENBQUNBO1FBRURBLElBQUlBLElBQUlBLElBQUlBLENBQUNBLHdCQUF3QkEsQ0FBQ0Esa0JBQWtCQSxFQUFFQSxDQUFDQTtRQUUzREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEs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SUFBSUEscUJBQXFCQSxDQUFDQSxDQUFDQSxFQUFFQSxrQkFBa0JBLENBQUNBLFNBQVNBLEVBQUVBLGtCQUFrQkEsQ0FBQ0EsUUFBUUEsRUFBRUEsa0JBQWtCQSxDQUFDQSxLQUFLQSxFQUFFQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFFM0tBLG9CQUFvQkEsQ0FBQ0Esb0JBQW9CQSxJQUFJQSxXQUFXQSxDQUFDQTtnQkFFekRBLEFBQ0FBLFlBRFlBO2dCQUNaQSxDQUFDQSxFQUFFQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUVEQSxBQUNBQSxlQURlQTtZQUNmQSxDQUFDQSxFQUFFQSxDQUFDQTtRQUNMQSxDQUFDQTtJQUNGQSxDQUFDQTtJQXpYRGQ7O09BRUdBO0lBQ1dBLGtDQUFhQSxHQUFrQkEsQ0FBQ0EsQ0FBQ0E7SUFFL0NBOztPQUVHQTtJQUNXQSxtQ0FBY0EsR0FBa0JBLEVBQUVBLENBQUNBO0lBa1hsREEsMkJBQUNBO0FBQURBLENBbFlBLEFBa1lDQSxFQWxZa0MsZ0JBQWdCLEVBa1lsRDtBQUVELEFBQThCLGlCQUFyQixvQkFBb0IsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvUGFydGljbGVBbmltYXRpb25TZXQuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3JvYmJhdGVtYW4vV2Vic3Rvcm1Qcm9qZWN0cy9hd2F5anMtcmVuZGVyZXJnbC8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSUFuaW1hdGlvblNldFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvYW5pbWF0b3JzL0lBbmltYXRpb25TZXRcIik7XG5pbXBvcnQgQW5pbWF0aW9uTm9kZUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9hbmltYXRvcnMvbm9kZXMvQW5pbWF0aW9uTm9kZUJhc2VcIik7XG5pbXBvcnQgSVN1Yk1lc2hcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2Jhc2UvSVN1Yk1lc2hcIik7XG5pbXBvcnQgU3ViR2VvbWV0cnlCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2Jhc2UvU3ViR2VvbWV0cnlCYXNlXCIpO1xuaW1wb3J0IE1lc2hcdFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2VudGl0aWVzL01lc2hcIik7XG5cbmltcG9ydCBBbmltYXRpb25TZXRCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9hbmltYXRvcnMvQW5pbWF0aW9uU2V0QmFzZVwiKTtcbmltcG9ydCBBbmltYXRvckJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYW5pbWF0b3JzL0FuaW1hdG9yQmFzZVwiKTtcbmltcG9ydCBBbmltYXRpb25SZWdpc3RlckNhY2hlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2FuaW1hdG9ycy9kYXRhL0FuaW1hdGlvblJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL2Jhc2UvU3RhZ2VcIik7XG5pbXBvcnQgU2hhZGVyT2JqZWN0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5cbmltcG9ydCBBbmltYXRpb25TdWJHZW9tZXRyeVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL0FuaW1hdGlvblN1Ykdlb21ldHJ5XCIpO1xuaW1wb3J0IFBhcnRpY2xlQW5pbWF0aW9uRGF0YVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9QYXJ0aWNsZUFuaW1hdGlvbkRhdGFcIik7XG5pbXBvcnQgUGFydGljbGVQcm9wZXJ0aWVzXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvUGFydGljbGVQcm9wZXJ0aWVzXCIpO1xuaW1wb3J0IFBhcnRpY2xlUHJvcGVydGllc01vZGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvUGFydGljbGVQcm9wZXJ0aWVzTW9kZVwiKTtcbmltcG9ydCBQYXJ0aWNsZURhdGFcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvUGFydGljbGVEYXRhXCIpO1xuaW1wb3J0IFBhcnRpY2xlTm9kZUJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9ub2Rlcy9QYXJ0aWNsZU5vZGVCYXNlXCIpO1xuaW1wb3J0IFBhcnRpY2xlVGltZU5vZGVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9ub2Rlcy9QYXJ0aWNsZVRpbWVOb2RlXCIpO1xuaW1wb3J0IFBhcnRpY2xlR2VvbWV0cnlcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvcmUvYmFzZS9QYXJ0aWNsZUdlb21ldHJ5XCIpO1xuXG4vKipcbiAqIFRoZSBhbmltYXRpb24gZGF0YSBzZXQgdXNlZCBieSBwYXJ0aWNsZS1iYXNlZCBhbmltYXRvcnMsIGNvbnRhaW5pbmcgcGFydGljbGUgYW5pbWF0aW9uIGRhdGEuXG4gKlxuICogQHNlZSBhd2F5LmFuaW1hdG9ycy5QYXJ0aWNsZUFuaW1hdG9yXG4gKi9cbmNsYXNzIFBhcnRpY2xlQW5pbWF0aW9uU2V0IGV4dGVuZHMgQW5pbWF0aW9uU2V0QmFzZSBpbXBsZW1lbnRzIElBbmltYXRpb25TZXRcbntcblx0LyoqIEBwcml2YXRlICovXG5cdHB1YmxpYyBfaUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGU6QW5pbWF0aW9uUmVnaXN0ZXJDYWNoZTtcblxuXHQvL2FsbCBvdGhlciBub2RlcyBkZXBlbmRlbnQgb24gaXRcblx0cHJpdmF0ZSBfdGltZU5vZGU6UGFydGljbGVUaW1lTm9kZTtcblxuXHQvKipcblx0ICogUHJvcGVydHkgdXNlZCBieSBwYXJ0aWNsZSBub2RlcyB0aGF0IHJlcXVpcmUgY29tcGlsYXRpb24gYXQgdGhlIGVuZCBvZiB0aGUgc2hhZGVyXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIFBPU1RfUFJJT1JJVFk6bnVtYmVyIC8qaW50Ki8gPSA5O1xuXG5cdC8qKlxuXHQgKiBQcm9wZXJ0eSB1c2VkIGJ5IHBhcnRpY2xlIG5vZGVzIHRoYXQgcmVxdWlyZSBjb2xvciBjb21waWxhdGlvblxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBDT0xPUl9QUklPUklUWTpudW1iZXIgLyppbnQqLyA9IDE4O1xuXG5cdHByaXZhdGUgX2FuaW1hdGlvblN1Ykdlb21ldHJpZXM6T2JqZWN0ID0gbmV3IE9iamVjdCgpO1xuXHRwcml2YXRlIF9wYXJ0aWNsZU5vZGVzOkFycmF5PFBhcnRpY2xlTm9kZUJhc2U+ID0gbmV3IEFycmF5PFBhcnRpY2xlTm9kZUJhc2U+KCk7XG5cdHByaXZhdGUgX2xvY2FsRHluYW1pY05vZGVzOkFycmF5PFBhcnRpY2xlTm9kZUJhc2U+ID0gbmV3IEFycmF5PFBhcnRpY2xlTm9kZUJhc2U+KCk7XG5cdHByaXZhdGUgX2xvY2FsU3RhdGljTm9kZXM6QXJyYXk8UGFydGljbGVOb2RlQmFzZT4gPSBuZXcgQXJyYXk8UGFydGljbGVOb2RlQmFzZT4oKTtcblx0cHJpdmF0ZSBfdG90YWxMZW5PZk9uZVZlcnRleDpudW1iZXIgLyppbnQqLyA9IDA7XG5cblx0Ly9zZXQgdHJ1ZSBpZiBoYXMgYW4gbm9kZSB3aGljaCB3aWxsIGNoYW5nZSBVVlxuXHRwdWJsaWMgaGFzVVZOb2RlOmJvb2xlYW47XG5cdC8vc2V0IGlmIHRoZSBvdGhlciBub2RlcyBuZWVkIHRvIGFjY2VzcyB0aGUgdmVsb2NpdHlcblx0cHVibGljIG5lZWRWZWxvY2l0eTpib29sZWFuO1xuXHQvL3NldCBpZiBoYXMgYSBiaWxsYm9hcmQgbm9kZS5cblx0cHVibGljIGhhc0JpbGxib2FyZDpib29sZWFuO1xuXHQvL3NldCBpZiBoYXMgYW4gbm9kZSB3aGljaCB3aWxsIGFwcGx5IGNvbG9yIG11bHRpcGxlIG9wZXJhdGlvblxuXHRwdWJsaWMgaGFzQ29sb3JNdWxOb2RlOmJvb2xlYW47XG5cdC8vc2V0IGlmIGhhcyBhbiBub2RlIHdoaWNoIHdpbGwgYXBwbHkgY29sb3IgYWRkIG9wZXJhdGlvblxuXHRwdWJsaWMgaGFzQ29sb3JBZGROb2RlOmJvb2xlYW47XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpc2VyIGZ1bmN0aW9uIGZvciBzdGF0aWMgcGFydGljbGUgcHJvcGVydGllcy4gTmVlZHMgdG8gcmVmZXJlbmNlIGEgd2l0aCB0aGUgZm9sbG93aW5nIGZvcm1hdFxuXHQgKlxuXHQgKiA8Y29kZT5cblx0ICogaW5pdFBhcnRpY2xlRnVuYyhwcm9wOlBhcnRpY2xlUHJvcGVydGllcylcblx0ICoge1xuXHQgKiBcdFx0Ly9jb2RlIGZvciBzZXR0aW5ncyBsb2NhbCBwcm9wZXJ0aWVzXG5cdCAqIH1cblx0ICogPC9jb2RlPlxuXHQgKlxuXHQgKiBBc2lkZSBmcm9tIHNldHRpbmcgYW55IHByb3BlcnRpZXMgcmVxdWlyZWQgaW4gcGFydGljbGUgYW5pbWF0aW9uIG5vZGVzIHVzaW5nIGxvY2FsIHN0YXRpYyBwcm9wZXJ0aWVzLCB0aGUgaW5pdFBhcnRpY2xlRnVuYyBmdW5jdGlvblxuXHQgKiBpcyByZXF1aXJlZCB0byB0aW1lIG5vZGUgcmVxdWlyZW1lbnRzIGFzIHRoZXkgbWF5IGJlIG5lZWRlZC4gVGhlc2UgcHJvcGVydGllcyBvbiB0aGUgUGFydGljbGVQcm9wZXJ0aWVzIG9iamVjdCBjYW4gaW5jbHVkZVxuXHQgKiA8Y29kZT5zdGFydFRpbWU8L2NvZGU+LCA8Y29kZT5kdXJhdGlvbjwvY29kZT4gYW5kIDxjb2RlPmRlbGF5PC9jb2RlPi4gVGhlIHVzZSBvZiB0aGVzZSBwcm9wZXJ0aWVzIGlzIGRldGVybWluZWQgYnkgdGhlIHNldHRpbmdcblx0ICogYXJndW1lbnRzIHBhc3NlZCBpbiB0aGUgY29uc3RydWN0b3Igb2YgdGhlIHBhcnRpY2xlIGFuaW1hdGlvbiBzZXQuIEJ5IGRlZmF1bHQsIG9ubHkgdGhlIDxjb2RlPnN0YXJ0VGltZTwvY29kZT4gcHJvcGVydHkgaXMgcmVxdWlyZWQuXG5cdCAqL1xuXHRwdWJsaWMgaW5pdFBhcnRpY2xlRnVuYzpGdW5jdGlvbjtcblxuXHQvKipcblx0ICogSW5pdGlhbGlzZXIgZnVuY3Rpb24gc2NvcGUgZm9yIHN0YXRpYyBwYXJ0aWNsZSBwcm9wZXJ0aWVzXG5cdCAqL1xuXHRwdWJsaWMgaW5pdFBhcnRpY2xlU2NvcGU6T2JqZWN0O1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IDxjb2RlPlBhcnRpY2xlQW5pbWF0aW9uU2V0PC9jb2RlPlxuXHQgKlxuXHQgKiBAcGFyYW0gICAgW29wdGlvbmFsXSB1c2VzRHVyYXRpb24gICAgRGVmaW5lcyB3aGV0aGVyIHRoZSBhbmltYXRpb24gc2V0IHVzZXMgdGhlIDxjb2RlPmR1cmF0aW9uPC9jb2RlPiBkYXRhIGluIGl0cyBzdGF0aWMgcHJvcGVydGllcyB0byBkZXRlcm1pbmUgaG93IGxvbmcgYSBwYXJ0aWNsZSBpcyB2aXNpYmxlIGZvci4gRGVmYXVsdHMgdG8gZmFsc2UuXG5cdCAqIEBwYXJhbSAgICBbb3B0aW9uYWxdIHVzZXNMb29waW5nICAgICBEZWZpbmVzIHdoZXRoZXIgdGhlIGFuaW1hdGlvbiBzZXQgdXNlcyBhIGxvb3BpbmcgdGltZWZyYW1lIGZvciBlYWNoIHBhcnRpY2xlIGRldGVybWluZWQgYnkgdGhlIDxjb2RlPnN0YXJ0VGltZTwvY29kZT4sIDxjb2RlPmR1cmF0aW9uPC9jb2RlPiBhbmQgPGNvZGU+ZGVsYXk8L2NvZGU+IGRhdGEgaW4gaXRzIHN0YXRpYyBwcm9wZXJ0aWVzIGZ1bmN0aW9uLiBEZWZhdWx0cyB0byBmYWxzZS4gUmVxdWlyZXMgPGNvZGU+dXNlc0R1cmF0aW9uPC9jb2RlPiB0byBiZSB0cnVlLlxuXHQgKiBAcGFyYW0gICAgW29wdGlvbmFsXSB1c2VzRGVsYXkgICAgICAgRGVmaW5lcyB3aGV0aGVyIHRoZSBhbmltYXRpb24gc2V0IHVzZXMgdGhlIDxjb2RlPmRlbGF5PC9jb2RlPiBkYXRhIGluIGl0cyBzdGF0aWMgcHJvcGVydGllcyB0byBkZXRlcm1pbmUgaG93IGxvbmcgYSBwYXJ0aWNsZSBpcyBoaWRkZW4gZm9yLiBEZWZhdWx0cyB0byBmYWxzZS4gUmVxdWlyZXMgPGNvZGU+dXNlc0xvb3Bpbmc8L2NvZGU+IHRvIGJlIHRydWUuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcih1c2VzRHVyYXRpb246Ym9vbGVhbiA9IGZhbHNlLCB1c2VzTG9vcGluZzpib29sZWFuID0gZmFsc2UsIHVzZXNEZWxheTpib29sZWFuID0gZmFsc2UpXG5cdHtcblx0XHRzdXBlcigpO1xuXG5cdFx0Ly9hdXRvbWF0aWNhbGx5IGFkZCBhIHBhcnRpY2xlIHRpbWUgbm9kZSB0byB0aGUgc2V0XG5cdFx0dGhpcy5hZGRBbmltYXRpb24odGhpcy5fdGltZU5vZGUgPSBuZXcgUGFydGljbGVUaW1lTm9kZSh1c2VzRHVyYXRpb24sIHVzZXNMb29waW5nLCB1c2VzRGVsYXkpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgdmVjdG9yIG9mIHRoZSBwYXJ0aWNsZSBhbmltYXRpb24gbm9kZXMgY29udGFpbmVkIHdpdGhpbiB0aGUgc2V0LlxuXHQgKi9cblx0cHVibGljIGdldCBwYXJ0aWNsZU5vZGVzKCk6QXJyYXk8UGFydGljbGVOb2RlQmFzZT5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9wYXJ0aWNsZU5vZGVzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgYWRkQW5pbWF0aW9uKG5vZGU6QW5pbWF0aW9uTm9kZUJhc2UpXG5cdHtcblx0XHR2YXIgaTpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgbjpQYXJ0aWNsZU5vZGVCYXNlID0gPFBhcnRpY2xlTm9kZUJhc2U+IG5vZGU7XG5cdFx0bi5faVByb2Nlc3NBbmltYXRpb25TZXR0aW5nKHRoaXMpO1xuXHRcdGlmIChuLm1vZGUgPT0gUGFydGljbGVQcm9wZXJ0aWVzTW9kZS5MT0NBTF9TVEFUSUMpIHtcblx0XHRcdG4uX2lEYXRhT2Zmc2V0ID0gdGhpcy5fdG90YWxMZW5PZk9uZVZlcnRleDtcblx0XHRcdHRoaXMuX3RvdGFsTGVuT2ZPbmVWZXJ0ZXggKz0gbi5kYXRhTGVuZ3RoO1xuXHRcdFx0dGhpcy5fbG9jYWxTdGF0aWNOb2Rlcy5wdXNoKG4pO1xuXHRcdH0gZWxzZSBpZiAobi5tb2RlID09IFBhcnRpY2xlUHJvcGVydGllc01vZGUuTE9DQUxfRFlOQU1JQylcblx0XHRcdHRoaXMuX2xvY2FsRHluYW1pY05vZGVzLnB1c2gobik7XG5cblx0XHRmb3IgKGkgPSB0aGlzLl9wYXJ0aWNsZU5vZGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRpZiAodGhpcy5fcGFydGljbGVOb2Rlc1tpXS5wcmlvcml0eSA8PSBuLnByaW9yaXR5KVxuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHR0aGlzLl9wYXJ0aWNsZU5vZGVzLnNwbGljZShpICsgMSwgMCwgbik7XG5cblx0XHRzdXBlci5hZGRBbmltYXRpb24obm9kZSk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBhY3RpdmF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgc3RhZ2U6U3RhZ2UpXG5cdHtcbi8vXHRcdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUgPSBwYXNzLmFuaW1hdGlvblJlZ2lzdGVyQ2FjaGU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBkZWFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBzdGFnZTpTdGFnZSlcblx0e1xuLy9cdFx0XHR2YXIgY29udGV4dDpJQ29udGV4dFN0YWdlR0wgPSA8SUNvbnRleHRTdGFnZUdMPiBzdGFnZS5jb250ZXh0O1xuLy9cdFx0XHR2YXIgb2Zmc2V0Om51bWJlciAvKmludCovID0gdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudmVydGV4QXR0cmlidXRlc09mZnNldDtcbi8vXHRcdFx0dmFyIHVzZWQ6bnVtYmVyIC8qaW50Ki8gPSB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5udW1Vc2VkU3RyZWFtcztcbi8vXHRcdFx0Zm9yICh2YXIgaTpudW1iZXIgLyppbnQqLyA9IG9mZnNldDsgaSA8IHVzZWQ7IGkrKylcbi8vXHRcdFx0XHRjb250ZXh0LnNldFZlcnRleEJ1ZmZlckF0KGksIG51bGwpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0QUdBTFZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpOnN0cmluZ1xuXHR7XG5cdFx0Ly9ncmFiIGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUgZnJvbSB0aGUgbWF0ZXJpYWxwYXNzYmFzZSBvciBjcmVhdGUgYSBuZXcgb25lIGlmIHRoZSBmaXJzdCB0aW1lXG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUgPSBzaGFkZXJPYmplY3QuYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZTtcblxuXHRcdGlmICh0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSA9PSBudWxsKVxuXHRcdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUgPSBzaGFkZXJPYmplY3QuYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSA9IG5ldyBBbmltYXRpb25SZWdpc3RlckNhY2hlKHNoYWRlck9iamVjdC5wcm9maWxlKTtcblxuXHRcdC8vcmVzZXQgYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZVxuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnZlcnRleENvbnN0YW50T2Zmc2V0ID0gc2hhZGVyT2JqZWN0Lm51bVVzZWRWZXJ0ZXhDb25zdGFudHM7XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudmVydGV4QXR0cmlidXRlc09mZnNldCA9IHNoYWRlck9iamVjdC5udW1Vc2VkU3RyZWFtcztcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS52YXJ5aW5nc09mZnNldCA9IHNoYWRlck9iamVjdC5udW1Vc2VkVmFyeWluZ3M7XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuZnJhZ21lbnRDb25zdGFudE9mZnNldCA9IHNoYWRlck9iamVjdC5udW1Vc2VkRnJhZ21lbnRDb25zdGFudHM7XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuaGFzVVZOb2RlID0gdGhpcy5oYXNVVk5vZGU7XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUubmVlZFZlbG9jaXR5ID0gdGhpcy5uZWVkVmVsb2NpdHk7XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuaGFzQmlsbGJvYXJkID0gdGhpcy5oYXNCaWxsYm9hcmQ7XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuc291cmNlUmVnaXN0ZXJzID0gc2hhZGVyT2JqZWN0LmFuaW1hdGFibGVBdHRyaWJ1dGVzO1xuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnRhcmdldFJlZ2lzdGVycyA9IHNoYWRlck9iamVjdC5hbmltYXRpb25UYXJnZXRSZWdpc3RlcnM7XG5cdFx0dGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUubmVlZEZyYWdtZW50QW5pbWF0aW9uID0gc2hhZGVyT2JqZWN0LnVzZXNGcmFnbWVudEFuaW1hdGlvbjtcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5uZWVkVVZBbmltYXRpb24gPSAhc2hhZGVyT2JqZWN0LnVzZXNVVlRyYW5zZm9ybTtcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5oYXNDb2xvckFkZE5vZGUgPSB0aGlzLmhhc0NvbG9yQWRkTm9kZTtcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5oYXNDb2xvck11bE5vZGUgPSB0aGlzLmhhc0NvbG9yTXVsTm9kZTtcblx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5yZXNldCgpO1xuXG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gXCJcIjtcblxuXHRcdGNvZGUgKz0gdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuZ2V0SW5pdENvZGUoKTtcblxuXHRcdHZhciBub2RlOlBhcnRpY2xlTm9kZUJhc2U7XG5cdFx0dmFyIGk6bnVtYmVyIC8qaW50Ki87XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgdGhpcy5fcGFydGljbGVOb2Rlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0bm9kZSA9IHRoaXMuX3BhcnRpY2xlTm9kZXNbaV07XG5cdFx0XHRpZiAobm9kZS5wcmlvcml0eSA8IFBhcnRpY2xlQW5pbWF0aW9uU2V0LlBPU1RfUFJJT1JJVFkpXG5cdFx0XHRcdGNvZGUgKz0gbm9kZS5nZXRBR0FMVmVydGV4Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlKTtcblx0XHR9XG5cblx0XHRjb2RlICs9IHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLmdldENvbWJpbmF0aW9uQ29kZSgpO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IHRoaXMuX3BhcnRpY2xlTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdG5vZGUgPSB0aGlzLl9wYXJ0aWNsZU5vZGVzW2ldO1xuXHRcdFx0aWYgKG5vZGUucHJpb3JpdHkgPj0gUGFydGljbGVBbmltYXRpb25TZXQuUE9TVF9QUklPUklUWSAmJiBub2RlLnByaW9yaXR5IDwgUGFydGljbGVBbmltYXRpb25TZXQuQ09MT1JfUFJJT1JJVFkpXG5cdFx0XHRcdGNvZGUgKz0gbm9kZS5nZXRBR0FMVmVydGV4Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlKTtcblx0XHR9XG5cblx0XHRjb2RlICs9IHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLmluaXRDb2xvclJlZ2lzdGVycygpO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IHRoaXMuX3BhcnRpY2xlTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdG5vZGUgPSB0aGlzLl9wYXJ0aWNsZU5vZGVzW2ldO1xuXHRcdFx0aWYgKG5vZGUucHJpb3JpdHkgPj0gUGFydGljbGVBbmltYXRpb25TZXQuQ09MT1JfUFJJT1JJVFkpXG5cdFx0XHRcdGNvZGUgKz0gbm9kZS5nZXRBR0FMVmVydGV4Q29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlKTtcblx0XHR9XG5cdFx0Y29kZSArPSB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5nZXRDb2xvclBhc3NDb2RlKCk7XG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBnZXRBR0FMVVZDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKTpzdHJpbmdcblx0e1xuXHRcdHZhciBjb2RlOnN0cmluZyA9IFwiXCI7XG5cdFx0aWYgKHRoaXMuaGFzVVZOb2RlKSB7XG5cdFx0XHR0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5zZXRVVlNvdXJjZUFuZFRhcmdldChzaGFkZXJPYmplY3QudXZTb3VyY2UsIHNoYWRlck9iamVjdC51dlRhcmdldCk7XG5cdFx0XHRjb2RlICs9IFwibW92IFwiICsgdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudXZUYXJnZXQgKyBcIi54eSxcIiArIHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnV2QXR0cmlidXRlLnRvU3RyaW5nKCkgKyBcIlxcblwiO1xuXHRcdFx0dmFyIG5vZGU6UGFydGljbGVOb2RlQmFzZTtcblx0XHRcdGZvciAodmFyIGk6bnVtYmVyIC8qdWludCovID0gMDsgaSA8IHRoaXMuX3BhcnRpY2xlTm9kZXMubGVuZ3RoOyBpKyspXG5cdFx0XHRcdG5vZGUgPSB0aGlzLl9wYXJ0aWNsZU5vZGVzW2ldO1xuXHRcdFx0XHRjb2RlICs9IG5vZGUuZ2V0QUdBTFVWQ29kZShzaGFkZXJPYmplY3QsIHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlKTtcblx0XHRcdGNvZGUgKz0gXCJtb3YgXCIgKyB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS51dlZhci50b1N0cmluZygpICsgXCIsXCIgKyB0aGlzLl9pQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS51dlRhcmdldCArIFwiLnh5XFxuXCI7XG5cdFx0fSBlbHNlXG5cdFx0XHRjb2RlICs9IFwibW92IFwiICsgc2hhZGVyT2JqZWN0LnV2VGFyZ2V0ICsgXCIsXCIgKyBzaGFkZXJPYmplY3QudXZTb3VyY2UgKyBcIlxcblwiO1xuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgZ2V0QUdBTEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgc2hhZGVkVGFyZ2V0OnN0cmluZyk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuZ2V0Q29sb3JDb21iaW5hdGlvbkNvZGUoc2hhZGVkVGFyZ2V0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGRvbmVBR0FMQ29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSlcblx0e1xuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnNldERhdGFMZW5ndGgoKTtcblxuXHRcdC8vc2V0IHZlcnRleFplcm9Db25zdCx2ZXJ0ZXhPbmVDb25zdCx2ZXJ0ZXhUd29Db25zdFxuXHRcdHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnNldFZlcnRleENvbnN0KHRoaXMuX2lBbmltYXRpb25SZWdpc3RlckNhY2hlLnZlcnRleFplcm9Db25zdC5pbmRleCwgMCwgMSwgMiwgMCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBnZXQgdXNlc0NQVSgpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGNhbmNlbEdQVUNvbXBhdGliaWxpdHkoKVxuXHR7XG5cblx0fVxuXG5cdHB1YmxpYyBkaXNwb3NlKClcblx0e1xuXHRcdGZvciAodmFyIGtleSBpbiB0aGlzLl9hbmltYXRpb25TdWJHZW9tZXRyaWVzKVxuXHRcdFx0KDxBbmltYXRpb25TdWJHZW9tZXRyeT4gdGhpcy5fYW5pbWF0aW9uU3ViR2VvbWV0cmllc1trZXldKS5kaXNwb3NlKCk7XG5cblx0XHRzdXBlci5kaXNwb3NlKCk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0QW5pbWF0aW9uU3ViR2VvbWV0cnkoc3ViTWVzaDpJU3ViTWVzaClcblx0e1xuXHRcdHZhciBtZXNoOk1lc2ggPSBzdWJNZXNoLnBhcmVudE1lc2g7XG5cdFx0dmFyIGFuaW1hdGlvblN1Ykdlb21ldHJ5OkFuaW1hdGlvblN1Ykdlb21ldHJ5ID0gKG1lc2guc2hhcmVBbmltYXRpb25HZW9tZXRyeSk/IHRoaXMuX2FuaW1hdGlvblN1Ykdlb21ldHJpZXNbc3ViTWVzaC5zdWJHZW9tZXRyeS5pZF0gOiB0aGlzLl9hbmltYXRpb25TdWJHZW9tZXRyaWVzW3N1Yk1lc2guaWRdO1xuXG5cdFx0aWYgKGFuaW1hdGlvblN1Ykdlb21ldHJ5KVxuXHRcdFx0cmV0dXJuIGFuaW1hdGlvblN1Ykdlb21ldHJ5O1xuXG5cdFx0dGhpcy5faUdlbmVyYXRlQW5pbWF0aW9uU3ViR2VvbWV0cmllcyhtZXNoKTtcblxuXHRcdHJldHVybiAobWVzaC5zaGFyZUFuaW1hdGlvbkdlb21ldHJ5KT8gdGhpcy5fYW5pbWF0aW9uU3ViR2VvbWV0cmllc1tzdWJNZXNoLnN1Ykdlb21ldHJ5LmlkXSA6IHRoaXMuX2FuaW1hdGlvblN1Ykdlb21ldHJpZXNbc3ViTWVzaC5pZF07XG5cdH1cblxuXG5cdC8qKiBAcHJpdmF0ZSAqL1xuXHRwdWJsaWMgX2lHZW5lcmF0ZUFuaW1hdGlvblN1Ykdlb21ldHJpZXMobWVzaDpNZXNoKVxuXHR7XG5cdFx0aWYgKHRoaXMuaW5pdFBhcnRpY2xlRnVuYyA9PSBudWxsKVxuXHRcdFx0dGhyb3cobmV3IEVycm9yKFwibm8gaW5pdFBhcnRpY2xlRnVuYyBzZXRcIikpO1xuXG5cdFx0dmFyIGdlb21ldHJ5OlBhcnRpY2xlR2VvbWV0cnkgPSA8UGFydGljbGVHZW9tZXRyeT4gbWVzaC5nZW9tZXRyeTtcblxuXHRcdGlmICghZ2VvbWV0cnkpXG5cdFx0XHR0aHJvdyhuZXcgRXJyb3IoXCJQYXJ0aWNsZSBhbmltYXRpb24gY2FuIG9ubHkgYmUgcGVyZm9ybWVkIG9uIGEgUGFydGljbGVHZW9tZXRyeSBvYmplY3RcIikpO1xuXG5cdFx0dmFyIGk6bnVtYmVyIC8qaW50Ki8sIGo6bnVtYmVyIC8qaW50Ki8sIGs6bnVtYmVyIC8qaW50Ki87XG5cdFx0dmFyIGFuaW1hdGlvblN1Ykdlb21ldHJ5OkFuaW1hdGlvblN1Ykdlb21ldHJ5O1xuXHRcdHZhciBuZXdBbmltYXRpb25TdWJHZW9tZXRyeTpib29sZWFuID0gZmFsc2U7XG5cdFx0dmFyIHN1Ykdlb21ldHJ5OlN1Ykdlb21ldHJ5QmFzZTtcblx0XHR2YXIgc3ViTWVzaDpJU3ViTWVzaDtcblx0XHR2YXIgbG9jYWxOb2RlOlBhcnRpY2xlTm9kZUJhc2U7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgbWVzaC5zdWJNZXNoZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHN1Yk1lc2ggPSBtZXNoLnN1Yk1lc2hlc1tpXTtcblx0XHRcdHN1Ykdlb21ldHJ5ID0gc3ViTWVzaC5zdWJHZW9tZXRyeTtcblx0XHRcdGlmIChtZXNoLnNoYXJlQW5pbWF0aW9uR2VvbWV0cnkpIHtcblx0XHRcdFx0YW5pbWF0aW9uU3ViR2VvbWV0cnkgPSB0aGlzLl9hbmltYXRpb25TdWJHZW9tZXRyaWVzW3N1Ykdlb21ldHJ5LmlkXTtcblxuXHRcdFx0XHRpZiAoYW5pbWF0aW9uU3ViR2VvbWV0cnkpXG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGFuaW1hdGlvblN1Ykdlb21ldHJ5ID0gbmV3IEFuaW1hdGlvblN1Ykdlb21ldHJ5KCk7XG5cblx0XHRcdGlmIChtZXNoLnNoYXJlQW5pbWF0aW9uR2VvbWV0cnkpXG5cdFx0XHRcdHRoaXMuX2FuaW1hdGlvblN1Ykdlb21ldHJpZXNbc3ViR2VvbWV0cnkuaWRdID0gYW5pbWF0aW9uU3ViR2VvbWV0cnk7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRoaXMuX2FuaW1hdGlvblN1Ykdlb21ldHJpZXNbc3ViTWVzaC5pZF0gPSBhbmltYXRpb25TdWJHZW9tZXRyeTtcblxuXHRcdFx0bmV3QW5pbWF0aW9uU3ViR2VvbWV0cnkgPSB0cnVlO1xuXG5cdFx0XHQvL2NyZWF0ZSB0aGUgdmVydGV4RGF0YSB2ZWN0b3IgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIGxvY2FsIG5vZGUgZGF0YVxuXHRcdFx0YW5pbWF0aW9uU3ViR2VvbWV0cnkuY3JlYXRlVmVydGV4RGF0YShzdWJHZW9tZXRyeS5udW1WZXJ0aWNlcywgdGhpcy5fdG90YWxMZW5PZk9uZVZlcnRleCk7XG5cdFx0fVxuXG5cdFx0aWYgKCFuZXdBbmltYXRpb25TdWJHZW9tZXRyeSlcblx0XHRcdHJldHVybjtcblxuXHRcdHZhciBwYXJ0aWNsZXM6QXJyYXk8UGFydGljbGVEYXRhPiA9IGdlb21ldHJ5LnBhcnRpY2xlcztcblx0XHR2YXIgcGFydGljbGVzTGVuZ3RoOm51bWJlciAvKnVpbnQqLyA9IHBhcnRpY2xlcy5sZW5ndGg7XG5cdFx0dmFyIG51bVBhcnRpY2xlczpudW1iZXIgLyp1aW50Ki8gPSBnZW9tZXRyeS5udW1QYXJ0aWNsZXM7XG5cdFx0dmFyIHBhcnRpY2xlUHJvcGVydGllczpQYXJ0aWNsZVByb3BlcnRpZXMgPSBuZXcgUGFydGljbGVQcm9wZXJ0aWVzKCk7XG5cdFx0dmFyIHBhcnRpY2xlOlBhcnRpY2xlRGF0YTtcblxuXHRcdHZhciBvbmVEYXRhTGVuOm51bWJlciAvKmludCovO1xuXHRcdHZhciBvbmVEYXRhT2Zmc2V0Om51bWJlciAvKmludCovO1xuXHRcdHZhciBjb3VudGVyRm9yVmVydGV4Om51bWJlciAvKmludCovO1xuXHRcdHZhciBjb3VudGVyRm9yT25lRGF0YTpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgb25lRGF0YTpBcnJheTxudW1iZXI+O1xuXHRcdHZhciBudW1WZXJ0aWNlczpudW1iZXIgLyp1aW50Ki87XG5cdFx0dmFyIHZlcnRleERhdGE6QXJyYXk8bnVtYmVyPjtcblx0XHR2YXIgdmVydGV4TGVuZ3RoOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgc3RhcnRpbmdPZmZzZXQ6bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciB2ZXJ0ZXhPZmZzZXQ6bnVtYmVyIC8qdWludCovO1xuXG5cdFx0Ly9kZWZhdWx0IHZhbHVlcyBmb3IgcGFydGljbGUgcGFyYW1cblx0XHRwYXJ0aWNsZVByb3BlcnRpZXMudG90YWwgPSBudW1QYXJ0aWNsZXM7XG5cdFx0cGFydGljbGVQcm9wZXJ0aWVzLnN0YXJ0VGltZSA9IDA7XG5cdFx0cGFydGljbGVQcm9wZXJ0aWVzLmR1cmF0aW9uID0gMTAwMDtcblx0XHRwYXJ0aWNsZVByb3BlcnRpZXMuZGVsYXkgPSAwLjE7XG5cblx0XHRpID0gMDtcblx0XHRqID0gMDtcblx0XHR3aGlsZSAoaSA8IG51bVBhcnRpY2xlcykge1xuXHRcdFx0cGFydGljbGVQcm9wZXJ0aWVzLmluZGV4ID0gaTtcblxuXHRcdFx0Ly9jYWxsIHRoZSBpbml0IG9uIHRoZSBwYXJ0aWNsZSBwYXJhbWV0ZXJzXG5cdFx0XHR0aGlzLmluaXRQYXJ0aWNsZUZ1bmMuY2FsbCh0aGlzLmluaXRQYXJ0aWNsZVNjb3BlLCBwYXJ0aWNsZVByb3BlcnRpZXMpO1xuXG5cdFx0XHQvL2NyZWF0ZSB0aGUgbmV4dCBzZXQgb2Ygbm9kZSBwcm9wZXJ0aWVzIGZvciB0aGUgcGFydGljbGVcblx0XHRcdGZvciAoayA9IDA7IGsgPCB0aGlzLl9sb2NhbFN0YXRpY05vZGVzLmxlbmd0aDsgaysrKVxuXHRcdFx0XHR0aGlzLl9sb2NhbFN0YXRpY05vZGVzW2tdLl9pR2VuZXJhdGVQcm9wZXJ0eU9mT25lUGFydGljbGUocGFydGljbGVQcm9wZXJ0aWVzKTtcblxuXHRcdFx0Ly9sb29wIHRocm91Z2ggYWxsIHBhcnRpY2xlIGRhdGEgZm9yIHRoZSBjdXJlbnQgcGFydGljbGVcblx0XHRcdHdoaWxlIChqIDwgcGFydGljbGVzTGVuZ3RoICYmIChwYXJ0aWNsZSA9IHBhcnRpY2xlc1tqXSkucGFydGljbGVJbmRleCA9PSBpKSB7XG5cdFx0XHRcdC8vZmluZCB0aGUgdGFyZ2V0IGFuaW1hdGlvblN1Ykdlb21ldHJ5XG5cdFx0XHRcdGZvciAoayA9IDA7IGsgPCBtZXNoLnN1Yk1lc2hlcy5sZW5ndGg7IGsrKykge1xuXHRcdFx0XHRcdHN1Yk1lc2ggPSBtZXNoLnN1Yk1lc2hlc1trXTtcblx0XHRcdFx0XHRpZiAoc3ViTWVzaC5zdWJHZW9tZXRyeSA9PSBwYXJ0aWNsZS5zdWJHZW9tZXRyeSkge1xuXHRcdFx0XHRcdFx0YW5pbWF0aW9uU3ViR2VvbWV0cnkgPSAobWVzaC5zaGFyZUFuaW1hdGlvbkdlb21ldHJ5KT8gdGhpcy5fYW5pbWF0aW9uU3ViR2VvbWV0cmllc1tzdWJNZXNoLnN1Ykdlb21ldHJ5LmlkXSA6IHRoaXMuX2FuaW1hdGlvblN1Ykdlb21ldHJpZXNbc3ViTWVzaC5pZF07XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0bnVtVmVydGljZXMgPSBwYXJ0aWNsZS5udW1WZXJ0aWNlcztcblx0XHRcdFx0dmVydGV4RGF0YSA9IGFuaW1hdGlvblN1Ykdlb21ldHJ5LnZlcnRleERhdGE7XG5cdFx0XHRcdHZlcnRleExlbmd0aCA9IG51bVZlcnRpY2VzKnRoaXMuX3RvdGFsTGVuT2ZPbmVWZXJ0ZXg7XG5cdFx0XHRcdHN0YXJ0aW5nT2Zmc2V0ID0gYW5pbWF0aW9uU3ViR2VvbWV0cnkubnVtUHJvY2Vzc2VkVmVydGljZXMqdGhpcy5fdG90YWxMZW5PZk9uZVZlcnRleDtcblxuXHRcdFx0XHQvL2xvb3AgdGhyb3VnaCBlYWNoIHN0YXRpYyBsb2NhbCBub2RlIGluIHRoZSBhbmltYXRpb24gc2V0XG5cdFx0XHRcdGZvciAoayA9IDA7IGsgPCB0aGlzLl9sb2NhbFN0YXRpY05vZGVzLmxlbmd0aDsgaysrKSB7XG5cdFx0XHRcdFx0bG9jYWxOb2RlID0gdGhpcy5fbG9jYWxTdGF0aWNOb2Rlc1trXTtcblx0XHRcdFx0XHRvbmVEYXRhID0gbG9jYWxOb2RlLm9uZURhdGE7XG5cdFx0XHRcdFx0b25lRGF0YUxlbiA9IGxvY2FsTm9kZS5kYXRhTGVuZ3RoO1xuXHRcdFx0XHRcdG9uZURhdGFPZmZzZXQgPSBzdGFydGluZ09mZnNldCArIGxvY2FsTm9kZS5faURhdGFPZmZzZXQ7XG5cblx0XHRcdFx0XHQvL2xvb3AgdGhyb3VnaCBlYWNoIHZlcnRleCBzZXQgaW4gdGhlIHZlcnRleCBkYXRhXG5cdFx0XHRcdFx0Zm9yIChjb3VudGVyRm9yVmVydGV4ID0gMDsgY291bnRlckZvclZlcnRleCA8IHZlcnRleExlbmd0aDsgY291bnRlckZvclZlcnRleCArPSB0aGlzLl90b3RhbExlbk9mT25lVmVydGV4KSB7XG5cdFx0XHRcdFx0XHR2ZXJ0ZXhPZmZzZXQgPSBvbmVEYXRhT2Zmc2V0ICsgY291bnRlckZvclZlcnRleDtcblxuXHRcdFx0XHRcdFx0Ly9hZGQgdGhlIGRhdGEgZm9yIHRoZSBsb2NhbCBub2RlIHRvIHRoZSB2ZXJ0ZXggZGF0YVxuXHRcdFx0XHRcdFx0Zm9yIChjb3VudGVyRm9yT25lRGF0YSA9IDA7IGNvdW50ZXJGb3JPbmVEYXRhIDwgb25lRGF0YUxlbjsgY291bnRlckZvck9uZURhdGErKylcblx0XHRcdFx0XHRcdFx0dmVydGV4RGF0YVt2ZXJ0ZXhPZmZzZXQgKyBjb3VudGVyRm9yT25lRGF0YV0gPSBvbmVEYXRhW2NvdW50ZXJGb3JPbmVEYXRhXTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vc3RvcmUgcGFydGljbGUgcHJvcGVydGllcyBpZiB0aGV5IG5lZWQgdG8gYmUgcmV0cmVpdmVkIGZvciBkeW5hbWljIGxvY2FsIG5vZGVzXG5cdFx0XHRcdGlmICh0aGlzLl9sb2NhbER5bmFtaWNOb2Rlcy5sZW5ndGgpXG5cdFx0XHRcdFx0YW5pbWF0aW9uU3ViR2VvbWV0cnkuYW5pbWF0aW9uUGFydGljbGVzLnB1c2gobmV3IFBhcnRpY2xlQW5pbWF0aW9uRGF0YShpLCBwYXJ0aWNsZVByb3BlcnRpZXMuc3RhcnRUaW1lLCBwYXJ0aWNsZVByb3BlcnRpZXMuZHVyYXRpb24sIHBhcnRpY2xlUHJvcGVydGllcy5kZWxheSwgcGFydGljbGUpKTtcblxuXHRcdFx0XHRhbmltYXRpb25TdWJHZW9tZXRyeS5udW1Qcm9jZXNzZWRWZXJ0aWNlcyArPSBudW1WZXJ0aWNlcztcblxuXHRcdFx0XHQvL25leHQgaW5kZXhcblx0XHRcdFx0aisrO1xuXHRcdFx0fVxuXG5cdFx0XHQvL25leHQgcGFydGljbGVcblx0XHRcdGkrKztcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0ID0gUGFydGljbGVBbmltYXRpb25TZXQ7Il19