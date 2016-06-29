"use strict";
var BlendMode_1 = require("@awayjs/core/lib/image/BlendMode");
var ArgumentError_1 = require("@awayjs/core/lib/errors/ArgumentError");
var ContextGLBlendFactor_1 = require("@awayjs/stage/lib/base/ContextGLBlendFactor");
var ContextGLCompareMode_1 = require("@awayjs/stage/lib/base/ContextGLCompareMode");
var ContextGLTriangleFace_1 = require("@awayjs/stage/lib/base/ContextGLTriangleFace");
var CompilerBase_1 = require("../shaders/compilers/CompilerBase");
/**
 * ShaderBase keeps track of the number of dependencies for "named registers" used across a pass.
 * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
 * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
 * each time a method has been compiled into the shader.
 *
 * @see RegisterPool.addUsage
 */
var ShaderBase = (function () {
    /**
     * Creates a new MethodCompilerVO object.
     */
    function ShaderBase(elementsClass, pass, stage) {
        this._abstractionPool = new Object();
        this._blendFactorSource = ContextGLBlendFactor_1.ContextGLBlendFactor.ONE;
        this._blendFactorDest = ContextGLBlendFactor_1.ContextGLBlendFactor.ZERO;
        this._invalidProgram = true;
        this._animationVertexCode = "";
        this._animationFragmentCode = "";
        this.usesBlending = false;
        this.useImageRect = false;
        this.usesCurves = false;
        /**
         * The depth compare mode used to render the renderables using this material.
         *
         * @see away.stagegl.ContextGLCompareMode
         */
        this.depthCompareMode = ContextGLCompareMode_1.ContextGLCompareMode.LESS;
        /**
         * Indicate whether the shader should write to the depth buffer or not. Ignored when blending is enabled.
         */
        this.writeDepth = true;
        this._defaultCulling = ContextGLTriangleFace_1.ContextGLTriangleFace.BACK;
        this._pInverseSceneMatrix = new Float32Array(16);
        //set ambient values to default
        this.ambientR = 0xFF;
        this.ambientG = 0xFF;
        this.ambientB = 0xFF;
        /**
         * Indicates whether there are any dependencies on the world-space position vector.
         */
        this.usesGlobalPosFragment = false;
        /**
         * Indicates whether there are any dependencies on the local position vector.
         */
        this.usesPositionFragment = false;
        /**
         *
         */
        this.imageIndices = new Array();
        this._elementsClass = elementsClass;
        this._pass = pass;
        this._stage = stage;
        this.profile = this._stage.profile;
    }
    Object.defineProperty(ShaderBase.prototype, "programData", {
        get: function () {
            if (this._invalidProgram)
                this._updateProgram();
            return this._programData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderBase.prototype, "usesAnimation", {
        get: function () {
            return this._usesAnimation;
        },
        set: function (value) {
            if (this._usesAnimation == value)
                return;
            this._usesAnimation = value;
            this.invalidateProgram();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderBase.prototype, "numUsedVertexConstants", {
        get: function () {
            if (this._invalidProgram)
                this._updateProgram();
            return this._numUsedVertexConstants;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderBase.prototype, "numUsedFragmentConstants", {
        get: function () {
            if (this._invalidProgram)
                this._updateProgram();
            return this._numUsedFragmentConstants;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderBase.prototype, "numUsedStreams", {
        /**
         * The amount of used vertex streams in the vertex code. Used by the animation code generation to know from which index on streams are available.
         */
        get: function () {
            if (this._invalidProgram)
                this._updateProgram();
            return this._numUsedStreams;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ShaderBase.prototype, "numUsedTextures", {
        /**
         *
         */
        get: function () {
            if (this._invalidProgram)
                this._updateProgram();
            return this._numUsedTextures;
        },
        enumerable: true,
        configurable: true
    });
    ShaderBase.prototype.getAbstraction = function (texture) {
        return (this._abstractionPool[texture.id] || (this._abstractionPool[texture.id] = new ShaderBase._abstractionClassPool[texture.assetType](texture, this)));
    };
    /**
     *
     * @param image
     */
    ShaderBase.prototype.clearAbstraction = function (texture) {
        this._abstractionPool[texture.id] = null;
    };
    /**
     *
     * @param imageObjectClass
     */
    ShaderBase.registerAbstraction = function (gl_assetClass, assetClass) {
        ShaderBase._abstractionClassPool[assetClass.assetType] = gl_assetClass;
    };
    ShaderBase.prototype.getImageIndex = function (texture, index) {
        if (index === void 0) { index = 0; }
        return this._pass.getImageIndex(texture, index);
    };
    ShaderBase.prototype._iIncludeDependencies = function () {
        this._pass._iIncludeDependencies(this);
    };
    /**
     * Factory method to create a concrete compiler object for this object
     *
     * @param elementsClass
     * @param pass
     * @param stage
     * @returns {CompilerBase}
     */
    ShaderBase.prototype.createCompiler = function (elementsClass, pass) {
        return new CompilerBase_1.CompilerBase(elementsClass, pass, this);
    };
    /**
     * Clears dependency counts for all registers. Called when recompiling a pass.
     */
    ShaderBase.prototype.reset = function () {
        this.projectionDependencies = 0;
        this.normalDependencies = 0;
        this.colorDependencies = 0;
        this.viewDirDependencies = 0;
        this.uvDependencies = 0;
        this.secondaryUVDependencies = 0;
        this.globalPosDependencies = 0;
        this.tangentDependencies = 0;
        this.usesCommonData = false;
        this.usesGlobalPosFragment = false;
        this.usesPositionFragment = false;
        this.usesFragmentAnimation = false;
        this.usesTangentSpace = false;
        this.outputsNormals = false;
        this.outputsTangentNormals = false;
    };
    ShaderBase.prototype.pInitRegisterIndices = function () {
        this.commonsDataIndex = -1;
        this.cameraPositionIndex = -1;
        this.curvesIndex = -1;
        this.uvIndex = -1;
        this.uvMatrixIndex = -1;
        this.colorTransformIndex = -1;
        this.secondaryUVIndex = -1;
        this.normalIndex = -1;
        this.colorBufferIndex = -1;
        this.tangentIndex = -1;
        this.sceneMatrixIndex = -1;
        this.sceneNormalMatrixIndex = -1;
        this.jointIndexIndex = -1;
        this.jointWeightIndex = -1;
        this.imageIndices.length = 0;
    };
    /**
     * Initializes the unchanging constant data for this shader object.
     */
    ShaderBase.prototype.initConstantData = function (registerCache) {
        //Updates the amount of used register indices.
        this._numUsedVertexConstants = registerCache.numUsedVertexConstants;
        this._numUsedFragmentConstants = registerCache.numUsedFragmentConstants;
        this._numUsedStreams = registerCache.numUsedStreams;
        this._numUsedTextures = registerCache.numUsedTextures;
        this.vertexConstantData = new Float32Array(registerCache.numUsedVertexConstants * 4);
        this.fragmentConstantData = new Float32Array(registerCache.numUsedFragmentConstants * 4);
        //Initializes commonly required constant values.
        if (this.commonsDataIndex >= 0) {
            this.fragmentConstantData[this.commonsDataIndex] = .5;
            this.fragmentConstantData[this.commonsDataIndex + 1] = 0;
            this.fragmentConstantData[this.commonsDataIndex + 2] = 1 / 255;
            this.fragmentConstantData[this.commonsDataIndex + 3] = 1;
        }
        //Initializes the default UV transformation matrix.
        if (this.uvMatrixIndex >= 0) {
            this.vertexConstantData[this.uvMatrixIndex] = 1;
            this.vertexConstantData[this.uvMatrixIndex + 1] = 0;
            this.vertexConstantData[this.uvMatrixIndex + 2] = 0;
            this.vertexConstantData[this.uvMatrixIndex + 3] = 0;
            this.vertexConstantData[this.uvMatrixIndex + 4] = 0;
            this.vertexConstantData[this.uvMatrixIndex + 5] = 1;
            this.vertexConstantData[this.uvMatrixIndex + 6] = 0;
            this.vertexConstantData[this.uvMatrixIndex + 7] = 0;
        }
        //Initializes the default colorTransform.
        if (this.colorTransformIndex >= 0) {
            this.fragmentConstantData[this.colorTransformIndex] = 1;
            this.fragmentConstantData[this.colorTransformIndex + 1] = 1;
            this.fragmentConstantData[this.colorTransformIndex + 2] = 1;
            this.fragmentConstantData[this.colorTransformIndex + 3] = 1;
            this.fragmentConstantData[this.colorTransformIndex + 4] = 0;
            this.fragmentConstantData[this.colorTransformIndex + 5] = 0;
            this.fragmentConstantData[this.colorTransformIndex + 6] = 0;
            this.fragmentConstantData[this.colorTransformIndex + 7] = 0;
        }
        if (this.cameraPositionIndex >= 0)
            this.vertexConstantData[this.cameraPositionIndex + 3] = 1;
        // init constant data in pass
        this._pass._iInitConstantData(this);
        //init constant data in animation
        if (this.usesAnimation)
            this._pass.animationSet.doneAGALCode(this);
    };
    /**
     * The blend mode to use when drawing this renderable. The following blend modes are supported:
     * <ul>
     * <li>BlendMode.NORMAL: No blending, unless the material inherently needs it</li>
     * <li>BlendMode.LAYER: Force blending. This will draw the object the same as NORMAL, but without writing depth writes.</li>
     * <li>BlendMode.MULTIPLY</li>
     * <li>BlendMode.ADD</li>
     * <li>BlendMode.ALPHA</li>
     * </ul>
     */
    ShaderBase.prototype.setBlendMode = function (value) {
        switch (value) {
            case BlendMode_1.BlendMode.NORMAL:
                this._blendFactorSource = ContextGLBlendFactor_1.ContextGLBlendFactor.ONE;
                this._blendFactorDest = ContextGLBlendFactor_1.ContextGLBlendFactor.ZERO;
                this.usesBlending = false;
                break;
            case BlendMode_1.BlendMode.LAYER:
                this._blendFactorSource = ContextGLBlendFactor_1.ContextGLBlendFactor.SOURCE_ALPHA;
                this._blendFactorDest = ContextGLBlendFactor_1.ContextGLBlendFactor.ONE_MINUS_SOURCE_ALPHA;
                this.usesBlending = true;
                break;
            case BlendMode_1.BlendMode.MULTIPLY:
                this._blendFactorSource = ContextGLBlendFactor_1.ContextGLBlendFactor.ZERO;
                this._blendFactorDest = ContextGLBlendFactor_1.ContextGLBlendFactor.SOURCE_COLOR;
                this.usesBlending = true;
                break;
            case BlendMode_1.BlendMode.ADD:
                this._blendFactorSource = ContextGLBlendFactor_1.ContextGLBlendFactor.SOURCE_ALPHA;
                this._blendFactorDest = ContextGLBlendFactor_1.ContextGLBlendFactor.ONE;
                this.usesBlending = true;
                break;
            case BlendMode_1.BlendMode.ALPHA:
                this._blendFactorSource = ContextGLBlendFactor_1.ContextGLBlendFactor.ZERO;
                this._blendFactorDest = ContextGLBlendFactor_1.ContextGLBlendFactor.SOURCE_ALPHA;
                this.usesBlending = true;
                break;
            default:
                throw new ArgumentError_1.ArgumentError("Unsupported blend mode!");
        }
    };
    /**
     * @inheritDoc
     */
    ShaderBase.prototype._iActivate = function (camera) {
        this._stage.context.setCulling(this.useBothSides ? ContextGLTriangleFace_1.ContextGLTriangleFace.NONE : this._defaultCulling, camera.projection.coordinateSystem);
        if (!this.usesTangentSpace && this.cameraPositionIndex >= 0) {
            var pos = camera.scenePosition;
            this.vertexConstantData[this.cameraPositionIndex] = pos.x;
            this.vertexConstantData[this.cameraPositionIndex + 1] = pos.y;
            this.vertexConstantData[this.cameraPositionIndex + 2] = pos.z;
        }
        this._stage.context.setDepthTest((this.writeDepth && !this.usesBlending), this.depthCompareMode);
        if (this.usesBlending)
            this._stage.context.setBlendFactors(this._blendFactorSource, this._blendFactorDest);
        this.activeElements = null;
    };
    /**
     * @inheritDoc
     */
    ShaderBase.prototype._iDeactivate = function () {
        //For the love of god don't remove this if you want your multi-material shadows to not flicker like shit
        this._stage.context.setDepthTest(true, ContextGLCompareMode_1.ContextGLCompareMode.LESS);
        this.activeElements = null;
    };
    /**
     *
     *
     * @param renderable
     * @param stage
     * @param camera
     */
    ShaderBase.prototype._setRenderState = function (renderable, camera, viewProjection) {
        if (renderable.renderable.animator)
            renderable.renderable.animator.setRenderState(this, renderable, this._stage, camera);
        if (this.usesUVTransform) {
            var uvMatrix = renderable.uvMatrix;
            if (uvMatrix) {
                //transpose
                var rawData = uvMatrix.rawData;
                this.vertexConstantData[this.uvMatrixIndex] = rawData[0];
                this.vertexConstantData[this.uvMatrixIndex + 1] = rawData[2];
                this.vertexConstantData[this.uvMatrixIndex + 3] = rawData[4];
                this.vertexConstantData[this.uvMatrixIndex + 4] = rawData[1];
                this.vertexConstantData[this.uvMatrixIndex + 5] = rawData[3];
                this.vertexConstantData[this.uvMatrixIndex + 7] = rawData[5];
            }
            else {
                this.vertexConstantData[this.uvMatrixIndex] = 1;
                this.vertexConstantData[this.uvMatrixIndex + 1] = 0;
                this.vertexConstantData[this.uvMatrixIndex + 3] = 0;
                this.vertexConstantData[this.uvMatrixIndex + 4] = 0;
                this.vertexConstantData[this.uvMatrixIndex + 5] = 1;
                this.vertexConstantData[this.uvMatrixIndex + 7] = 0;
            }
        }
        if (this.usesColorTransform) {
            var colorTransform = renderable.sourceEntity._iAssignedColorTransform();
            if (colorTransform) {
                //TODO: AWDParser to write normalised color offsets
                this.fragmentConstantData[this.colorTransformIndex] = colorTransform.rawData[0];
                this.fragmentConstantData[this.colorTransformIndex + 1] = colorTransform.rawData[1];
                this.fragmentConstantData[this.colorTransformIndex + 2] = colorTransform.rawData[2];
                this.fragmentConstantData[this.colorTransformIndex + 3] = colorTransform.rawData[3];
                this.fragmentConstantData[this.colorTransformIndex + 4] = colorTransform.rawData[4] / 255;
                this.fragmentConstantData[this.colorTransformIndex + 5] = colorTransform.rawData[5] / 255;
                this.fragmentConstantData[this.colorTransformIndex + 6] = colorTransform.rawData[6] / 255;
                this.fragmentConstantData[this.colorTransformIndex + 7] = colorTransform.rawData[7] / 255;
            }
            else {
                this.fragmentConstantData[this.colorTransformIndex] = 1;
                this.fragmentConstantData[this.colorTransformIndex + 1] = 1;
                this.fragmentConstantData[this.colorTransformIndex + 2] = 1;
                this.fragmentConstantData[this.colorTransformIndex + 3] = 1;
                this.fragmentConstantData[this.colorTransformIndex + 4] = 0;
                this.fragmentConstantData[this.colorTransformIndex + 5] = 0;
                this.fragmentConstantData[this.colorTransformIndex + 6] = 0;
                this.fragmentConstantData[this.colorTransformIndex + 7] = 0;
            }
        }
        if (this.sceneNormalMatrixIndex >= 0)
            renderable.sourceEntity.inverseSceneTransform.copyRawDataTo(this.vertexConstantData, this.sceneNormalMatrixIndex, false);
        if (this.usesTangentSpace && this.cameraPositionIndex >= 0) {
            renderable.sourceEntity.inverseSceneTransform.copyRawDataTo(this._pInverseSceneMatrix);
            var pos = camera.scenePosition;
            var x = pos.x;
            var y = pos.y;
            var z = pos.z;
            this.vertexConstantData[this.cameraPositionIndex] = this._pInverseSceneMatrix[0] * x + this._pInverseSceneMatrix[4] * y + this._pInverseSceneMatrix[8] * z + this._pInverseSceneMatrix[12];
            this.vertexConstantData[this.cameraPositionIndex + 1] = this._pInverseSceneMatrix[1] * x + this._pInverseSceneMatrix[5] * y + this._pInverseSceneMatrix[9] * z + this._pInverseSceneMatrix[13];
            this.vertexConstantData[this.cameraPositionIndex + 2] = this._pInverseSceneMatrix[2] * x + this._pInverseSceneMatrix[6] * y + this._pInverseSceneMatrix[10] * z + this._pInverseSceneMatrix[14];
        }
    };
    ShaderBase.prototype.invalidateProgram = function () {
        this._invalidProgram = true;
    };
    ShaderBase.prototype.dispose = function () {
        this._programData.dispose();
        this._programData = null;
    };
    ShaderBase.prototype._updateProgram = function () {
        this._invalidProgram = false;
        var compiler = this.createCompiler(this._elementsClass, this._pass);
        compiler.compile();
        this._calcAnimationCode(compiler._pRegisterCache, compiler.shadedTarget, compiler._pSharedRegisters);
        //initialise the required shader constants
        this.initConstantData(compiler._pRegisterCache);
        var programData = this._stage.getProgramData(this._animationVertexCode + compiler.vertexCode, compiler.fragmentCode + this._animationFragmentCode + compiler.postAnimationFragmentCode);
        //check program data hasn't changed, keep count of program usages
        if (this._programData != programData) {
            if (this._programData)
                this._programData.dispose();
            this._programData = programData;
            programData.usages++;
        }
    };
    ShaderBase.prototype._calcAnimationCode = function (registerCache, shadedTarget, sharedRegisters) {
        //reset code
        this._animationVertexCode = "";
        this._animationFragmentCode = "";
        //check to see if GPU animation is used
        if (this.usesAnimation) {
            var animationSet = this._pass.animationSet;
            this._animationVertexCode += animationSet.getAGALVertexCode(this, registerCache, sharedRegisters);
            if (this.uvDependencies > 0 && !this.usesUVTransform)
                this._animationVertexCode += animationSet.getAGALUVCode(this, registerCache, sharedRegisters);
            if (this.usesFragmentAnimation)
                this._animationFragmentCode += animationSet.getAGALFragmentCode(this, registerCache, shadedTarget);
        }
        else {
            // simply write attributes to targets, do not animate them
            // projection will pick up on targets[0] to do the projection
            var len = sharedRegisters.animatableAttributes.length;
            for (var i = 0; i < len; ++i)
                this._animationVertexCode += "mov " + sharedRegisters.animationTargetRegisters[i] + ", " + sharedRegisters.animatableAttributes[i] + "\n";
            if (this.uvDependencies > 0 && !this.usesUVTransform)
                this._animationVertexCode += "mov " + sharedRegisters.uvTarget + "," + sharedRegisters.uvSource + "\n";
        }
    };
    ShaderBase.prototype.setVertexConst = function (index, x, y, z, w) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        if (w === void 0) { w = 0; }
        index *= 4;
        this.vertexConstantData[index++] = x;
        this.vertexConstantData[index++] = y;
        this.vertexConstantData[index++] = z;
        this.vertexConstantData[index] = w;
    };
    ShaderBase.prototype.setVertexConstFromArray = function (index, data) {
        index *= 4;
        for (var i = 0; i < data.length; i++)
            this.vertexConstantData[index++] = data[i];
    };
    ShaderBase.prototype.setVertexConstFromMatrix = function (index, matrix) {
        index *= 4;
        var rawData = matrix.rawData;
        this.vertexConstantData[index++] = rawData[0];
        this.vertexConstantData[index++] = rawData[4];
        this.vertexConstantData[index++] = rawData[8];
        this.vertexConstantData[index++] = rawData[12];
        this.vertexConstantData[index++] = rawData[1];
        this.vertexConstantData[index++] = rawData[5];
        this.vertexConstantData[index++] = rawData[9];
        this.vertexConstantData[index++] = rawData[13];
        this.vertexConstantData[index++] = rawData[2];
        this.vertexConstantData[index++] = rawData[6];
        this.vertexConstantData[index++] = rawData[10];
        this.vertexConstantData[index++] = rawData[14];
        this.vertexConstantData[index++] = rawData[3];
        this.vertexConstantData[index++] = rawData[7];
        this.vertexConstantData[index++] = rawData[11];
        this.vertexConstantData[index] = rawData[15];
    };
    ShaderBase.prototype.setFragmentConst = function (index, x, y, z, w) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        if (w === void 0) { w = 0; }
        index *= 4;
        this.fragmentConstantData[index++] = x;
        this.fragmentConstantData[index++] = y;
        this.fragmentConstantData[index++] = z;
        this.fragmentConstantData[index] = w;
    };
    ShaderBase._abstractionClassPool = new Object();
    return ShaderBase;
}());
exports.ShaderBase = ShaderBase;
