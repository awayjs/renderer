"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AnimationSetBase_1 = require("../animators/AnimationSetBase");
var AnimationRegisterData_1 = require("../animators/data/AnimationRegisterData");
var AnimationElements_1 = require("../animators/data/AnimationElements");
var ParticleAnimationData_1 = require("../animators/data/ParticleAnimationData");
var ParticleProperties_1 = require("../animators/data/ParticleProperties");
var ParticlePropertiesMode_1 = require("../animators/data/ParticlePropertiesMode");
var ParticleTimeNode_1 = require("../animators/nodes/ParticleTimeNode");
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
        this._animationElements = new Object();
        this._particleNodes = new Array();
        this._localDynamicNodes = new Array();
        this._localStaticNodes = new Array();
        this._totalLenOfOneVertex = 0;
        /**
         *
         */
        this.shareAnimationGraphics = true;
        //automatically add a particle time node to the set
        this.addAnimation(this._timeNode = new ParticleTimeNode_1.ParticleTimeNode(usesDuration, usesLooping, usesDelay));
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
        var i;
        var n = node;
        n._iProcessAnimationSetting(this);
        if (n.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.LOCAL_STATIC) {
            n._iDataOffset = this._totalLenOfOneVertex;
            this._totalLenOfOneVertex += n.dataLength;
            this._localStaticNodes.push(n);
        }
        else if (n.mode == ParticlePropertiesMode_1.ParticlePropertiesMode.LOCAL_DYNAMIC)
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
    ParticleAnimationSet.prototype.getAGALVertexCode = function (shader, registerCache, sharedRegisters) {
        //grab animationRegisterData from the materialpassbase or create a new one if the first time
        this._iAnimationRegisterData = shader.animationRegisterData;
        if (this._iAnimationRegisterData == null)
            this._iAnimationRegisterData = shader.animationRegisterData = new AnimationRegisterData_1.AnimationRegisterData();
        //reset animationRegisterData
        this._iAnimationRegisterData.reset(registerCache, sharedRegisters, this.needVelocity);
        var code = "";
        var len = sharedRegisters.animatableAttributes.length;
        for (var i = 0; i < len; i++)
            code += "mov " + sharedRegisters.animationTargetRegisters[i] + "," + sharedRegisters.animatableAttributes[i] + "\n";
        code += "mov " + this._iAnimationRegisterData.positionTarget + ".xyz," + this._iAnimationRegisterData.vertexZeroConst + "\n";
        if (this.needVelocity)
            code += "mov " + this._iAnimationRegisterData.velocityTarget + ".xyz," + this._iAnimationRegisterData.vertexZeroConst + "\n";
        var node;
        var i;
        for (i = 0; i < this._particleNodes.length; i++) {
            node = this._particleNodes[i];
            if (node.priority < ParticleAnimationSet.POST_PRIORITY)
                code += node.getAGALVertexCode(shader, this, registerCache, this._iAnimationRegisterData);
        }
        code += "add " + this._iAnimationRegisterData.scaleAndRotateTarget + ".xyz," + this._iAnimationRegisterData.scaleAndRotateTarget + ".xyz," + this._iAnimationRegisterData.positionTarget + ".xyz\n";
        for (i = 0; i < this._particleNodes.length; i++) {
            node = this._particleNodes[i];
            if (node.priority >= ParticleAnimationSet.POST_PRIORITY && node.priority < ParticleAnimationSet.COLOR_PRIORITY)
                code += node.getAGALVertexCode(shader, this, registerCache, this._iAnimationRegisterData);
        }
        if (this.hasColorMulNode) {
            this._iAnimationRegisterData.colorMulTarget = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(this._iAnimationRegisterData.colorMulTarget, 1);
            this._iAnimationRegisterData.colorMulVary = registerCache.getFreeVarying();
            code += "mov " + this._iAnimationRegisterData.colorMulTarget + "," + this._iAnimationRegisterData.vertexOneConst + "\n";
        }
        if (this.hasColorAddNode) {
            this._iAnimationRegisterData.colorAddTarget = registerCache.getFreeVertexVectorTemp();
            registerCache.addVertexTempUsages(this._iAnimationRegisterData.colorAddTarget, 1);
            this._iAnimationRegisterData.colorAddVary = registerCache.getFreeVarying();
            code += "mov " + this._iAnimationRegisterData.colorAddTarget + "," + this._iAnimationRegisterData.vertexZeroConst + "\n";
        }
        for (i = 0; i < this._particleNodes.length; i++) {
            node = this._particleNodes[i];
            if (node.priority >= ParticleAnimationSet.COLOR_PRIORITY)
                code += node.getAGALVertexCode(shader, this, registerCache, this._iAnimationRegisterData);
        }
        if (shader.usesFragmentAnimation && (this.hasColorAddNode || this.hasColorMulNode)) {
            if (this.hasColorMulNode)
                code += "mov " + this._iAnimationRegisterData.colorMulVary + "," + this._iAnimationRegisterData.colorMulTarget + "\n";
            if (this.hasColorAddNode)
                code += "mov " + this._iAnimationRegisterData.colorAddVary + "," + this._iAnimationRegisterData.colorAddTarget + "\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.getAGALUVCode = function (shader, registerCache, sharedRegisters) {
        var code = "";
        if (this.hasUVNode) {
            this._iAnimationRegisterData.setUVSourceAndTarget(sharedRegisters);
            code += "mov " + this._iAnimationRegisterData.uvTarget + ".xy," + this._iAnimationRegisterData.uvAttribute.toString() + "\n";
            var node;
            for (var i = 0; i < this._particleNodes.length; i++)
                node = this._particleNodes[i];
            code += node.getAGALUVCode(shader, this, registerCache, this._iAnimationRegisterData);
            code += "mov " + this._iAnimationRegisterData.uvVar + "," + this._iAnimationRegisterData.uvTarget + ".xy\n";
        }
        else
            code += "mov " + sharedRegisters.uvTarget + "," + sharedRegisters.uvSource + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.getAGALFragmentCode = function (shader, registerCache, shadedTarget) {
        var code = "";
        if (shader.usesFragmentAnimation && (this.hasColorAddNode || this.hasColorMulNode)) {
            if (this.hasColorMulNode)
                code += "mul " + shadedTarget + "," + shadedTarget + "," + this._iAnimationRegisterData.colorMulVary + "\n";
            if (this.hasColorAddNode)
                code += "add " + shadedTarget + "," + shadedTarget + "," + this._iAnimationRegisterData.colorAddVary + "\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    ParticleAnimationSet.prototype.doneAGALCode = function (shader) {
        //set vertexZeroConst,vertexOneConst,vertexTwoConst
        shader.setVertexConst(this._iAnimationRegisterData.vertexZeroConst.index, 0, 1, 2, 0);
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
        for (var key in this._animationElements)
            this._animationElements[key].dispose();
        _super.prototype.dispose.call(this);
    };
    ParticleAnimationSet.prototype.getAnimationElements = function (graphic) {
        var animationElements = (this.shareAnimationGraphics) ? this._animationElements[graphic.elements.id] : this._animationElements[graphic.id];
        if (animationElements)
            return animationElements;
        this._iGenerateAnimationElements(graphic.parent);
        return (this.shareAnimationGraphics) ? this._animationElements[graphic.elements.id] : this._animationElements[graphic.id];
    };
    /** @private */
    ParticleAnimationSet.prototype._iGenerateAnimationElements = function (graphics) {
        if (this.initParticleFunc == null)
            throw (new Error("no initParticleFunc set"));
        var i, j, k;
        var animationElements;
        var newAnimationElements = false;
        var elements;
        var graphic;
        var localNode;
        for (i = 0; i < graphics.count; i++) {
            graphic = graphics.getGraphicAt(i);
            elements = graphic.elements;
            if (this.shareAnimationGraphics) {
                animationElements = this._animationElements[elements.id];
                if (animationElements)
                    continue;
            }
            animationElements = new AnimationElements_1.AnimationElements();
            if (this.shareAnimationGraphics)
                this._animationElements[elements.id] = animationElements;
            else
                this._animationElements[graphic.id] = animationElements;
            newAnimationElements = true;
            //create the vertexData vector that will be used for local node data
            animationElements.createVertexData(elements.numVertices, this._totalLenOfOneVertex);
        }
        if (!newAnimationElements)
            return;
        var particles = graphics.particles;
        var particlesLength = particles.length;
        var numParticles = graphics.numParticles;
        var particleProperties = new ParticleProperties_1.ParticleProperties();
        var particle;
        var oneDataLen;
        var oneDataOffset;
        var counterForVertex;
        var counterForOneData;
        var oneData;
        var numVertices;
        var vertexData;
        var vertexLength;
        var startingOffset;
        var vertexOffset;
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
            //create the next set of node properties for the particle
            for (k = 0; k < this._localStaticNodes.length; k++)
                this._localStaticNodes[k]._iGeneratePropertyOfOneParticle(particleProperties);
            //loop through all particle data for the curent particle
            while (j < particlesLength && (particle = particles[j]).particleIndex == i) {
                //find the target animationElements
                for (k = 0; k < graphics.count; k++) {
                    graphic = graphics.getGraphicAt(k);
                    if (graphic.elements == particle.elements) {
                        animationElements = (this.shareAnimationGraphics) ? this._animationElements[graphic.elements.id] : this._animationElements[graphic.id];
                        break;
                    }
                }
                numVertices = particle.numVertices;
                vertexData = animationElements.vertexData;
                vertexLength = numVertices * this._totalLenOfOneVertex;
                startingOffset = animationElements.numProcessedVertices * this._totalLenOfOneVertex;
                //loop through each static local node in the animation set
                for (k = 0; k < this._localStaticNodes.length; k++) {
                    localNode = this._localStaticNodes[k];
                    oneData = localNode.oneData;
                    oneDataLen = localNode.dataLength;
                    oneDataOffset = startingOffset + localNode._iDataOffset;
                    //loop through each vertex set in the vertex data
                    for (counterForVertex = 0; counterForVertex < vertexLength; counterForVertex += this._totalLenOfOneVertex) {
                        vertexOffset = oneDataOffset + counterForVertex;
                        //add the data for the local node to the vertex data
                        for (counterForOneData = 0; counterForOneData < oneDataLen; counterForOneData++)
                            vertexData[vertexOffset + counterForOneData] = oneData[counterForOneData];
                    }
                }
                //store particle properties if they need to be retreived for dynamic local nodes
                if (this._localDynamicNodes.length)
                    animationElements.animationParticles.push(new ParticleAnimationData_1.ParticleAnimationData(i, particleProperties.startTime, particleProperties.duration, particleProperties.delay, particle));
                animationElements.numProcessedVertices += numVertices;
                //next index
                j++;
            }
            //next particle
            i++;
        }
    };
    /**
     * Property used by particle nodes that require compilers at the end of the shader
     */
    ParticleAnimationSet.POST_PRIORITY = 9;
    /**
     * Property used by particle nodes that require color compilers
     */
    ParticleAnimationSet.COLOR_PRIORITY = 18;
    return ParticleAnimationSet;
}(AnimationSetBase_1.AnimationSetBase));
exports.ParticleAnimationSet = ParticleAnimationSet;
