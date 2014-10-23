var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var SubGeometryEvent = require("awayjs-display/lib/events/SubGeometryEvent");
var AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var JointPose = require("awayjs-renderergl/lib/animators/data/JointPose");
var SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
var AnimationStateEvent = require("awayjs-renderergl/lib/events/AnimationStateEvent");
/**
 * Provides an interface for assigning skeleton-based animation data sets to mesh-based entity objects
 * and controlling the various available states of animation through an interative playhead that can be
 * automatically updated or manually triggered.
 */
var SkeletonAnimator = (function (_super) {
    __extends(SkeletonAnimator, _super);
    /**
     * Creates a new <code>SkeletonAnimator</code> object.
     *
     * @param skeletonAnimationSet The animation data set containing the skeleton animations used by the animator.
     * @param skeleton The skeleton object used for calculating the resulting global matrices for transforming skinned mesh data.
     * @param forceCPU Optional value that only allows the animator to perform calculation on the CPU. Defaults to false.
     */
    function SkeletonAnimator(animationSet, skeleton, forceCPU) {
        var _this = this;
        if (forceCPU === void 0) { forceCPU = false; }
        _super.call(this, animationSet);
        this._globalPose = new SkeletonPose();
        this._morphedSubGeometry = new Object();
        this._morphedSubGeometryDirty = new Object();
        this._skeleton = skeleton;
        this._forceCPU = forceCPU;
        this._jointsPerVertex = animationSet.jointsPerVertex;
        this._numJoints = this._skeleton.numJoints;
        this._globalMatrices = new Array(this._numJoints * 12);
        var j = 0;
        for (var i = 0; i < this._numJoints; ++i) {
            this._globalMatrices[j++] = 1;
            this._globalMatrices[j++] = 0;
            this._globalMatrices[j++] = 0;
            this._globalMatrices[j++] = 0;
            this._globalMatrices[j++] = 0;
            this._globalMatrices[j++] = 1;
            this._globalMatrices[j++] = 0;
            this._globalMatrices[j++] = 0;
            this._globalMatrices[j++] = 0;
            this._globalMatrices[j++] = 0;
            this._globalMatrices[j++] = 1;
            this._globalMatrices[j++] = 0;
        }
        this._onTransitionCompleteDelegate = function (event) { return _this.onTransitionComplete(event); };
        this._onIndicesUpdateDelegate = function (event) { return _this.onIndicesUpdate(event); };
        this._onVerticesUpdateDelegate = function (event) { return _this.onVerticesUpdate(event); };
    }
    Object.defineProperty(SkeletonAnimator.prototype, "globalMatrices", {
        /**
         * returns the calculated global matrices of the current skeleton pose.
         *
         * @see #globalPose
         */
        get: function () {
            if (this._globalPropertiesDirty)
                this.updateGlobalProperties();
            return this._globalMatrices;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkeletonAnimator.prototype, "globalPose", {
        /**
         * returns the current skeleton pose output from the animator.
         *
         * @see away.animators.data.SkeletonPose
         */
        get: function () {
            if (this._globalPropertiesDirty)
                this.updateGlobalProperties();
            return this._globalPose;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkeletonAnimator.prototype, "skeleton", {
        /**
         * Returns the skeleton object in use by the animator - this defines the number and heirarchy of joints used by the
         * skinned geoemtry to which skeleon animator is applied.
         */
        get: function () {
            return this._skeleton;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkeletonAnimator.prototype, "forceCPU", {
        /**
         * Indicates whether the skeleton animator is disabled by default for GPU rendering, something that allows the animator to perform calculation on the GPU.
         * Defaults to false.
         */
        get: function () {
            return this._forceCPU;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkeletonAnimator.prototype, "useCondensedIndices", {
        /**
         * Offers the option of enabling GPU accelerated animation on skeletons larger than 32 joints
         * by condensing the number of joint index values required per mesh. Only applicable to
         * skeleton animations that utilise more than one mesh object. Defaults to false.
         */
        get: function () {
            return this._useCondensedIndices;
        },
        set: function (value) {
            this._useCondensedIndices = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SkeletonAnimator.prototype.clone = function () {
        /* The cast to SkeletonAnimationSet should never fail, as _animationSet can only be set
         through the constructor, which will only accept a SkeletonAnimationSet. */
        return new SkeletonAnimator(this._pAnimationSet, this._skeleton, this._forceCPU);
    };
    /**
     * Plays an animation state registered with the given name in the animation data set.
     *
     * @param name The data set name of the animation state to be played.
     * @param transition An optional transition object that determines how the animator will transition from the currently active animation state.
     * @param offset An option offset time (in milliseconds) that resets the state's internal clock to the absolute time of the animator plus the offset value. Required for non-looping animation states.
     */
    SkeletonAnimator.prototype.play = function (name, transition, offset) {
        if (transition === void 0) { transition = null; }
        if (offset === void 0) { offset = NaN; }
        if (this._pActiveAnimationName == name)
            return;
        this._pActiveAnimationName = name;
        if (!this._pAnimationSet.hasAnimation(name))
            throw new Error("Animation root node " + name + " not found!");
        if (transition && this._pActiveNode) {
            //setup the transition
            this._pActiveNode = transition.getAnimationNode(this, this._pActiveNode, this._pAnimationSet.getAnimation(name), this._pAbsoluteTime);
            this._pActiveNode.addEventListener(AnimationStateEvent.TRANSITION_COMPLETE, this._onTransitionCompleteDelegate);
        }
        else
            this._pActiveNode = this._pAnimationSet.getAnimation(name);
        this._pActiveState = this.getAnimationState(this._pActiveNode);
        if (this.updatePosition) {
            //update straight away to reset position deltas
            this._pActiveState.update(this._pAbsoluteTime);
            this._pActiveState.positionDelta;
        }
        this._activeSkeletonState = this._pActiveState;
        this.start();
        //apply a time offset if specified
        if (!isNaN(offset))
            this.reset(name, offset);
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimator.prototype.setRenderState = function (shaderObject, renderable, stage, camera, vertexConstantOffset /*int*/, vertexStreamOffset /*int*/) {
        // do on request of globalProperties
        if (this._globalPropertiesDirty)
            this.updateGlobalProperties();
        var subGeometry = renderable.subMesh.subGeometry;
        subGeometry.useCondensedIndices = this._useCondensedIndices;
        if (this._useCondensedIndices) {
            // using a condensed data set
            this.updateCondensedMatrices(subGeometry.condensedIndexLookUp, subGeometry.numCondensedJoints);
            stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, vertexConstantOffset, this._condensedMatrices, subGeometry.numCondensedJoints * 3);
        }
        else {
            if (this._pAnimationSet.usesCPU) {
                if (this._morphedSubGeometryDirty[subGeometry.id])
                    this.morphSubGeometry(renderable, subGeometry);
                return;
            }
            stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, vertexConstantOffset, this._globalMatrices, this._numJoints * 3);
        }
        stage.context.activateBuffer(vertexStreamOffset, renderable.getVertexData(TriangleSubGeometry.JOINT_INDEX_DATA), renderable.getVertexOffset(TriangleSubGeometry.JOINT_INDEX_DATA), renderable.JOINT_INDEX_FORMAT);
        stage.context.activateBuffer(vertexStreamOffset + 1, renderable.getVertexData(TriangleSubGeometry.JOINT_WEIGHT_DATA), renderable.getVertexOffset(TriangleSubGeometry.JOINT_WEIGHT_DATA), renderable.JOINT_WEIGHT_FORMAT);
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimator.prototype.testGPUCompatibility = function (shaderObject) {
        if (!this._useCondensedIndices && (this._forceCPU || this._jointsPerVertex > 4 || shaderObject.numUsedVertexConstants + this._numJoints * 3 > 128))
            this._pAnimationSet.cancelGPUCompatibility();
    };
    /**
     * Applies the calculated time delta to the active animation state node or state transition object.
     */
    SkeletonAnimator.prototype._pUpdateDeltaTime = function (dt) {
        _super.prototype._pUpdateDeltaTime.call(this, dt);
        //invalidate pose matrices
        this._globalPropertiesDirty = true;
        //trigger geometry invalidation if using CPU animation
        if (this._pAnimationSet.usesCPU)
            for (var key in this._morphedSubGeometryDirty)
                this._morphedSubGeometryDirty[key] = true;
    };
    SkeletonAnimator.prototype.updateCondensedMatrices = function (condensedIndexLookUp /*uint*/, numJoints /*uint*/) {
        var i = 0, j = 0;
        var len /*uint*/;
        var srcIndex /*uint*/;
        this._condensedMatrices = new Array();
        do {
            srcIndex = condensedIndexLookUp[i] * 4;
            len = srcIndex + 12;
            while (srcIndex < len)
                this._condensedMatrices[j++] = this._globalMatrices[srcIndex++];
        } while (++i < numJoints);
    };
    SkeletonAnimator.prototype.updateGlobalProperties = function () {
        this._globalPropertiesDirty = false;
        //get global pose
        this.localToGlobalPose(this._activeSkeletonState.getSkeletonPose(this._skeleton), this._globalPose, this._skeleton);
        // convert pose to matrix
        var mtxOffset = 0;
        var globalPoses = this._globalPose.jointPoses;
        var raw;
        var ox, oy, oz, ow;
        var xy2, xz2, xw2;
        var yz2, yw2, zw2;
        var n11, n12, n13;
        var n21, n22, n23;
        var n31, n32, n33;
        var m11, m12, m13, m14;
        var m21, m22, m23, m24;
        var m31, m32, m33, m34;
        var joints = this._skeleton.joints;
        var pose;
        var quat;
        var vec;
        var t;
        for (var i = 0; i < this._numJoints; ++i) {
            pose = globalPoses[i];
            quat = pose.orientation;
            vec = pose.translation;
            ox = quat.x;
            oy = quat.y;
            oz = quat.z;
            ow = quat.w;
            xy2 = (t = 2.0 * ox) * oy;
            xz2 = t * oz;
            xw2 = t * ow;
            yz2 = (t = 2.0 * oy) * oz;
            yw2 = t * ow;
            zw2 = 2.0 * oz * ow;
            yz2 = 2.0 * oy * oz;
            yw2 = 2.0 * oy * ow;
            zw2 = 2.0 * oz * ow;
            ox *= ox;
            oy *= oy;
            oz *= oz;
            ow *= ow;
            n11 = (t = ox - oy) - oz + ow;
            n12 = xy2 - zw2;
            n13 = xz2 + yw2;
            n21 = xy2 + zw2;
            n22 = -t - oz + ow;
            n23 = yz2 - xw2;
            n31 = xz2 - yw2;
            n32 = yz2 + xw2;
            n33 = -ox - oy + oz + ow;
            // prepend inverse bind pose
            raw = joints[i].inverseBindPose;
            m11 = raw[0];
            m12 = raw[4];
            m13 = raw[8];
            m14 = raw[12];
            m21 = raw[1];
            m22 = raw[5];
            m23 = raw[9];
            m24 = raw[13];
            m31 = raw[2];
            m32 = raw[6];
            m33 = raw[10];
            m34 = raw[14];
            this._globalMatrices[mtxOffset] = n11 * m11 + n12 * m21 + n13 * m31;
            this._globalMatrices[mtxOffset + 1] = n11 * m12 + n12 * m22 + n13 * m32;
            this._globalMatrices[mtxOffset + 2] = n11 * m13 + n12 * m23 + n13 * m33;
            this._globalMatrices[mtxOffset + 3] = n11 * m14 + n12 * m24 + n13 * m34 + vec.x;
            this._globalMatrices[mtxOffset + 4] = n21 * m11 + n22 * m21 + n23 * m31;
            this._globalMatrices[mtxOffset + 5] = n21 * m12 + n22 * m22 + n23 * m32;
            this._globalMatrices[mtxOffset + 6] = n21 * m13 + n22 * m23 + n23 * m33;
            this._globalMatrices[mtxOffset + 7] = n21 * m14 + n22 * m24 + n23 * m34 + vec.y;
            this._globalMatrices[mtxOffset + 8] = n31 * m11 + n32 * m21 + n33 * m31;
            this._globalMatrices[mtxOffset + 9] = n31 * m12 + n32 * m22 + n33 * m32;
            this._globalMatrices[mtxOffset + 10] = n31 * m13 + n32 * m23 + n33 * m33;
            this._globalMatrices[mtxOffset + 11] = n31 * m14 + n32 * m24 + n33 * m34 + vec.z;
            mtxOffset = mtxOffset + 12;
        }
    };
    SkeletonAnimator.prototype.getRenderableSubGeometry = function (renderable, sourceSubGeometry) {
        this._morphedSubGeometryDirty[sourceSubGeometry.id] = true;
        //early out for GPU animations
        if (!this._pAnimationSet.usesCPU)
            return sourceSubGeometry;
        var targetSubGeometry;
        if (!(targetSubGeometry = this._morphedSubGeometry[sourceSubGeometry.id])) {
            //not yet stored
            targetSubGeometry = this._morphedSubGeometry[sourceSubGeometry.id] = sourceSubGeometry.clone();
            //turn off auto calculations on the morphed geometry
            targetSubGeometry.autoDeriveNormals = false;
            targetSubGeometry.autoDeriveTangents = false;
            targetSubGeometry.autoDeriveUVs = false;
            //add event listeners for any changes in UV values on the source geometry
            sourceSubGeometry.addEventListener(SubGeometryEvent.INDICES_UPDATED, this._onIndicesUpdateDelegate);
            sourceSubGeometry.addEventListener(SubGeometryEvent.VERTICES_UPDATED, this._onVerticesUpdateDelegate);
        }
        return targetSubGeometry;
    };
    /**
     * If the animation can't be performed on GPU, transform vertices manually
     * @param subGeom The subgeometry containing the weights and joint index data per vertex.
     * @param pass The material pass for which we need to transform the vertices
     */
    SkeletonAnimator.prototype.morphSubGeometry = function (renderable, sourceSubGeometry) {
        this._morphedSubGeometryDirty[sourceSubGeometry.id] = false;
        var sourcePositions = sourceSubGeometry.positions;
        var sourceNormals = sourceSubGeometry.vertexNormals;
        var sourceTangents = sourceSubGeometry.vertexTangents;
        var jointIndices = sourceSubGeometry.jointIndices;
        var jointWeights = sourceSubGeometry.jointWeights;
        var targetSubGeometry = this._morphedSubGeometry[sourceSubGeometry.id];
        var targetPositions = targetSubGeometry.positions;
        var targetNormals = targetSubGeometry.vertexNormals;
        var targetTangents = targetSubGeometry.vertexTangents;
        var index = 0;
        var j = 0;
        var k /*uint*/;
        var vx, vy, vz;
        var nx, ny, nz;
        var tx, ty, tz;
        var len = sourcePositions.length;
        var weight;
        var vertX, vertY, vertZ;
        var normX, normY, normZ;
        var tangX, tangY, tangZ;
        var m11, m12, m13, m14;
        var m21, m22, m23, m24;
        var m31, m32, m33, m34;
        while (index < len) {
            vertX = sourcePositions[index];
            vertY = sourcePositions[index + 1];
            vertZ = sourcePositions[index + 2];
            normX = sourceNormals[index];
            normY = sourceNormals[index + 1];
            normZ = sourceNormals[index + 2];
            tangX = sourceTangents[index];
            tangY = sourceTangents[index + 1];
            tangZ = sourceTangents[index + 2];
            vx = 0;
            vy = 0;
            vz = 0;
            nx = 0;
            ny = 0;
            nz = 0;
            tx = 0;
            ty = 0;
            tz = 0;
            k = 0;
            while (k < this._jointsPerVertex) {
                weight = jointWeights[j];
                if (weight > 0) {
                    // implicit /3*12 (/3 because indices are multiplied by 3 for gpu matrix access, *12 because it's the matrix size)
                    var mtxOffset = jointIndices[j++] << 2;
                    m11 = this._globalMatrices[mtxOffset];
                    m12 = this._globalMatrices[mtxOffset + 1];
                    m13 = this._globalMatrices[mtxOffset + 2];
                    m14 = this._globalMatrices[mtxOffset + 3];
                    m21 = this._globalMatrices[mtxOffset + 4];
                    m22 = this._globalMatrices[mtxOffset + 5];
                    m23 = this._globalMatrices[mtxOffset + 6];
                    m24 = this._globalMatrices[mtxOffset + 7];
                    m31 = this._globalMatrices[mtxOffset + 8];
                    m32 = this._globalMatrices[mtxOffset + 9];
                    m33 = this._globalMatrices[mtxOffset + 10];
                    m34 = this._globalMatrices[mtxOffset + 11];
                    vx += weight * (m11 * vertX + m12 * vertY + m13 * vertZ + m14);
                    vy += weight * (m21 * vertX + m22 * vertY + m23 * vertZ + m24);
                    vz += weight * (m31 * vertX + m32 * vertY + m33 * vertZ + m34);
                    nx += weight * (m11 * normX + m12 * normY + m13 * normZ);
                    ny += weight * (m21 * normX + m22 * normY + m23 * normZ);
                    nz += weight * (m31 * normX + m32 * normY + m33 * normZ);
                    tx += weight * (m11 * tangX + m12 * tangY + m13 * tangZ);
                    ty += weight * (m21 * tangX + m22 * tangY + m23 * tangZ);
                    tz += weight * (m31 * tangX + m32 * tangY + m33 * tangZ);
                    ++k;
                }
                else {
                    j += (this._jointsPerVertex - k);
                    k = this._jointsPerVertex;
                }
            }
            targetPositions[index] = vx;
            targetPositions[index + 1] = vy;
            targetPositions[index + 2] = vz;
            targetNormals[index] = nx;
            targetNormals[index + 1] = ny;
            targetNormals[index + 2] = nz;
            targetTangents[index] = tx;
            targetTangents[index + 1] = ty;
            targetTangents[index + 2] = tz;
            index += 3;
        }
        targetSubGeometry.updatePositions(targetPositions);
        targetSubGeometry.updateVertexNormals(targetNormals);
        targetSubGeometry.updateVertexTangents(targetTangents);
    };
    /**
     * Converts a local hierarchical skeleton pose to a global pose
     * @param targetPose The SkeletonPose object that will contain the global pose.
     * @param skeleton The skeleton containing the joints, and as such, the hierarchical data to transform to global poses.
     */
    SkeletonAnimator.prototype.localToGlobalPose = function (sourcePose, targetPose, skeleton) {
        var globalPoses = targetPose.jointPoses;
        var globalJointPose;
        var joints = skeleton.joints;
        var len = sourcePose.numJointPoses;
        var jointPoses = sourcePose.jointPoses;
        var parentIndex /*int*/;
        var joint;
        var parentPose;
        var pose;
        var or;
        var tr;
        var t;
        var q;
        var x1, y1, z1, w1;
        var x2, y2, z2, w2;
        var x3, y3, z3;
        // :s
        if (globalPoses.length != len)
            globalPoses.length = len;
        for (var i = 0; i < len; ++i) {
            globalJointPose = globalPoses[i];
            if (globalJointPose == null)
                globalJointPose = globalPoses[i] = new JointPose();
            joint = joints[i];
            parentIndex = joint.parentIndex;
            pose = jointPoses[i];
            q = globalJointPose.orientation;
            t = globalJointPose.translation;
            if (parentIndex < 0) {
                tr = pose.translation;
                or = pose.orientation;
                q.x = or.x;
                q.y = or.y;
                q.z = or.z;
                q.w = or.w;
                t.x = tr.x;
                t.y = tr.y;
                t.z = tr.z;
            }
            else {
                // append parent pose
                parentPose = globalPoses[parentIndex];
                // rotate point
                or = parentPose.orientation;
                tr = pose.translation;
                x2 = or.x;
                y2 = or.y;
                z2 = or.z;
                w2 = or.w;
                x3 = tr.x;
                y3 = tr.y;
                z3 = tr.z;
                w1 = -x2 * x3 - y2 * y3 - z2 * z3;
                x1 = w2 * x3 + y2 * z3 - z2 * y3;
                y1 = w2 * y3 - x2 * z3 + z2 * x3;
                z1 = w2 * z3 + x2 * y3 - y2 * x3;
                // append parent translation
                tr = parentPose.translation;
                t.x = -w1 * x2 + x1 * w2 - y1 * z2 + z1 * y2 + tr.x;
                t.y = -w1 * y2 + x1 * z2 + y1 * w2 - z1 * x2 + tr.y;
                t.z = -w1 * z2 - x1 * y2 + y1 * x2 + z1 * w2 + tr.z;
                // append parent orientation
                x1 = or.x;
                y1 = or.y;
                z1 = or.z;
                w1 = or.w;
                or = pose.orientation;
                x2 = or.x;
                y2 = or.y;
                z2 = or.z;
                w2 = or.w;
                q.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
                q.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
                q.y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
                q.z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;
            }
        }
    };
    SkeletonAnimator.prototype.onTransitionComplete = function (event) {
        if (event.type == AnimationStateEvent.TRANSITION_COMPLETE) {
            event.animationNode.removeEventListener(AnimationStateEvent.TRANSITION_COMPLETE, this._onTransitionCompleteDelegate);
            //if this is the current active state transition, revert control to the active node
            if (this._pActiveState == event.animationState) {
                this._pActiveNode = this._pAnimationSet.getAnimation(this._pActiveAnimationName);
                this._pActiveState = this.getAnimationState(this._pActiveNode);
                this._activeSkeletonState = this._pActiveState;
            }
        }
    };
    SkeletonAnimator.prototype.onIndicesUpdate = function (event) {
        var subGeometry = event.target;
        this._morphedSubGeometry[subGeometry.id].updateIndices(subGeometry.indices);
    };
    SkeletonAnimator.prototype.onVerticesUpdate = function (event) {
        var subGeometry = event.target;
        var morphGeometry = this._morphedSubGeometry[subGeometry.id];
        switch (event.dataType) {
            case TriangleSubGeometry.UV_DATA:
                morphGeometry.updateUVs(subGeometry.uvs);
            case TriangleSubGeometry.SECONDARY_UV_DATA:
                morphGeometry.updateUVs(subGeometry.secondaryUVs);
        }
    };
    return SkeletonAnimator;
})(AnimatorBase);
module.exports = SkeletonAnimator;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc2tlbGV0b25hbmltYXRvci50cyJdLCJuYW1lcyI6WyJTa2VsZXRvbkFuaW1hdG9yIiwiU2tlbGV0b25BbmltYXRvci5jb25zdHJ1Y3RvciIsIlNrZWxldG9uQW5pbWF0b3IuZ2xvYmFsTWF0cmljZXMiLCJTa2VsZXRvbkFuaW1hdG9yLmdsb2JhbFBvc2UiLCJTa2VsZXRvbkFuaW1hdG9yLnNrZWxldG9uIiwiU2tlbGV0b25BbmltYXRvci5mb3JjZUNQVSIsIlNrZWxldG9uQW5pbWF0b3IudXNlQ29uZGVuc2VkSW5kaWNlcyIsIlNrZWxldG9uQW5pbWF0b3IuY2xvbmUiLCJTa2VsZXRvbkFuaW1hdG9yLnBsYXkiLCJTa2VsZXRvbkFuaW1hdG9yLnNldFJlbmRlclN0YXRlIiwiU2tlbGV0b25BbmltYXRvci50ZXN0R1BVQ29tcGF0aWJpbGl0eSIsIlNrZWxldG9uQW5pbWF0b3IuX3BVcGRhdGVEZWx0YVRpbWUiLCJTa2VsZXRvbkFuaW1hdG9yLnVwZGF0ZUNvbmRlbnNlZE1hdHJpY2VzIiwiU2tlbGV0b25BbmltYXRvci51cGRhdGVHbG9iYWxQcm9wZXJ0aWVzIiwiU2tlbGV0b25BbmltYXRvci5nZXRSZW5kZXJhYmxlU3ViR2VvbWV0cnkiLCJTa2VsZXRvbkFuaW1hdG9yLm1vcnBoU3ViR2VvbWV0cnkiLCJTa2VsZXRvbkFuaW1hdG9yLmxvY2FsVG9HbG9iYWxQb3NlIiwiU2tlbGV0b25BbmltYXRvci5vblRyYW5zaXRpb25Db21wbGV0ZSIsIlNrZWxldG9uQW5pbWF0b3Iub25JbmRpY2VzVXBkYXRlIiwiU2tlbGV0b25BbmltYXRvci5vblZlcnRpY2VzVXBkYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFJQSxJQUFPLG1CQUFtQixXQUFjLDZDQUE2QyxDQUFDLENBQUM7QUFHdkYsSUFBTyxnQkFBZ0IsV0FBZSw0Q0FBNEMsQ0FBQyxDQUFDO0FBRXBGLElBQU8sWUFBWSxXQUFnQiwyQ0FBMkMsQ0FBQyxDQUFDO0FBSWhGLElBQU8sb0JBQW9CLFdBQWMsOENBQThDLENBQUMsQ0FBQztBQUt6RixJQUFPLFNBQVMsV0FBZ0IsZ0RBQWdELENBQUMsQ0FBQztBQUdsRixJQUFPLFlBQVksV0FBZ0IsbURBQW1ELENBQUMsQ0FBQztBQUd4RixJQUFPLG1CQUFtQixXQUFjLGtEQUFrRCxDQUFDLENBQUM7QUFFNUYsQUFLQTs7OztHQURHO0lBQ0csZ0JBQWdCO0lBQVNBLFVBQXpCQSxnQkFBZ0JBLFVBQXFCQTtJQStFMUNBOzs7Ozs7T0FNR0E7SUFDSEEsU0F0RktBLGdCQUFnQkEsQ0FzRlRBLFlBQWlDQSxFQUFFQSxRQUFpQkEsRUFBRUEsUUFBd0JBO1FBdEYzRkMsaUJBcWxCQ0E7UUEvZmtFQSx3QkFBd0JBLEdBQXhCQSxnQkFBd0JBO1FBRXpGQSxrQkFBTUEsWUFBWUEsQ0FBQ0EsQ0FBQ0E7UUFyRmJBLGdCQUFXQSxHQUFnQkEsSUFBSUEsWUFBWUEsRUFBRUEsQ0FBQ0E7UUFHOUNBLHdCQUFtQkEsR0FBVUEsSUFBSUEsTUFBTUEsRUFBRUEsQ0FBQ0E7UUFDMUNBLDZCQUF3QkEsR0FBVUEsSUFBSUEsTUFBTUEsRUFBRUEsQ0FBQ0E7UUFtRnREQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDMUJBLElBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0EsWUFBWUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7UUFFckRBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBO1FBQzNDQSxJQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFTQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUU3REEsSUFBSUEsQ0FBQ0EsR0FBa0JBLENBQUNBLENBQUNBO1FBQ3pCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFtQkEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDMURBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQzlCQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUM5QkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDOUJBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQzlCQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUM5QkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDOUJBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQzlCQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUM5QkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDOUJBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQzlCQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUM5QkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDL0JBLENBQUNBO1FBRURBLElBQUlBLENBQUNBLDZCQUE2QkEsR0FBR0EsVUFBQ0EsS0FBeUJBLElBQUtBLE9BQUFBLEtBQUlBLENBQUNBLG9CQUFvQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsRUFBaENBLENBQWdDQSxDQUFDQTtRQUNyR0EsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxHQUFHQSxVQUFDQSxLQUFzQkEsSUFBS0EsT0FBQUEsS0FBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsRUFBM0JBLENBQTJCQSxDQUFDQTtRQUN4RkEsSUFBSUEsQ0FBQ0EseUJBQXlCQSxHQUFHQSxVQUFDQSxLQUFzQkEsSUFBS0EsT0FBQUEsS0FBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxLQUFLQSxDQUFDQSxFQUE1QkEsQ0FBNEJBLENBQUNBO0lBQzNGQSxDQUFDQTtJQTNGREQsc0JBQVdBLDRDQUFjQTtRQUx6QkE7Ozs7V0FJR0E7YUFDSEE7WUFFQ0UsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0Esc0JBQXNCQSxDQUFDQTtnQkFDL0JBLElBQUlBLENBQUNBLHNCQUFzQkEsRUFBRUEsQ0FBQ0E7WUFFL0JBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBO1FBQzdCQSxDQUFDQTs7O09BQUFGO0lBT0RBLHNCQUFXQSx3Q0FBVUE7UUFMckJBOzs7O1dBSUdBO2FBQ0hBO1lBRUNHLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLHNCQUFzQkEsQ0FBQ0E7Z0JBQy9CQSxJQUFJQSxDQUFDQSxzQkFBc0JBLEVBQUVBLENBQUNBO1lBRS9CQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQTtRQUN6QkEsQ0FBQ0E7OztPQUFBSDtJQU1EQSxzQkFBV0Esc0NBQVFBO1FBSm5CQTs7O1dBR0dBO2FBQ0hBO1lBRUNJLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBO1FBQ3ZCQSxDQUFDQTs7O09BQUFKO0lBTURBLHNCQUFXQSxzQ0FBUUE7UUFKbkJBOzs7V0FHR0E7YUFDSEE7WUFFQ0ssTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDdkJBLENBQUNBOzs7T0FBQUw7SUFPREEsc0JBQVdBLGlEQUFtQkE7UUFMOUJBOzs7O1dBSUdBO2FBQ0hBO1lBRUNNLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLG9CQUFvQkEsQ0FBQ0E7UUFDbENBLENBQUNBO2FBRUROLFVBQStCQSxLQUFhQTtZQUUzQ00sSUFBSUEsQ0FBQ0Esb0JBQW9CQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUNuQ0EsQ0FBQ0E7OztPQUxBTjtJQThDREE7O09BRUdBO0lBQ0lBLGdDQUFLQSxHQUFaQTtRQUVDTyxBQUVBQTttRkFEMkVBO1FBQzNFQSxNQUFNQSxDQUFDQSxJQUFJQSxnQkFBZ0JBLENBQXdCQSxJQUFJQSxDQUFDQSxjQUFjQSxFQUFFQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtJQUN6R0EsQ0FBQ0E7SUFFRFA7Ozs7OztPQU1HQTtJQUNJQSwrQkFBSUEsR0FBWEEsVUFBWUEsSUFBV0EsRUFBRUEsVUFBc0NBLEVBQUVBLE1BQW1CQTtRQUEzRFEsMEJBQXNDQSxHQUF0Q0EsaUJBQXNDQTtRQUFFQSxzQkFBbUJBLEdBQW5CQSxZQUFtQkE7UUFFbkZBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLHFCQUFxQkEsSUFBSUEsSUFBSUEsQ0FBQ0E7WUFDdENBLE1BQU1BLENBQUNBO1FBRVJBLElBQUlBLENBQUNBLHFCQUFxQkEsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFFbENBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQzNDQSxNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQSxzQkFBc0JBLEdBQUdBLElBQUlBLEdBQUdBLGFBQWFBLENBQUNBLENBQUNBO1FBRWhFQSxFQUFFQSxDQUFDQSxDQUFDQSxVQUFVQSxJQUFJQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNyQ0EsQUFDQUEsc0JBRHNCQTtZQUN0QkEsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsVUFBVUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtZQUN0SUEsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxtQkFBbUJBLENBQUNBLG1CQUFtQkEsRUFBRUEsSUFBSUEsQ0FBQ0EsNkJBQTZCQSxDQUFDQSxDQUFDQTtRQUNqSEEsQ0FBQ0E7UUFBQ0EsSUFBSUE7WUFDTEEsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFFNURBLElBQUlBLENBQUNBLGFBQWFBLEdBQUdBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7UUFFL0RBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3pCQSxBQUNBQSwrQ0FEK0NBO1lBQy9DQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtZQUMvQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7UUFDbENBLENBQUNBO1FBRURBLElBQUlBLENBQUNBLG9CQUFvQkEsR0FBNkJBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBO1FBRXpFQSxJQUFJQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtRQUViQSxBQUNBQSxrQ0FEa0NBO1FBQ2xDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtZQUNsQkEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0E7SUFDM0JBLENBQUNBO0lBRURSOztPQUVHQTtJQUNJQSx5Q0FBY0EsR0FBckJBLFVBQXNCQSxZQUE2QkEsRUFBRUEsVUFBeUJBLEVBQUVBLEtBQVdBLEVBQUVBLE1BQWFBLEVBQUVBLG9CQUFvQkEsQ0FBUUEsT0FBREEsQUFBUUEsRUFBRUEsa0JBQWtCQSxDQUFRQSxPQUFEQSxBQUFRQTtRQUVqTFMsQUFDQUEsb0NBRG9DQTtRQUNwQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0Esc0JBQXNCQSxDQUFDQTtZQUMvQkEsSUFBSUEsQ0FBQ0Esc0JBQXNCQSxFQUFFQSxDQUFDQTtRQUUvQkEsSUFBSUEsV0FBV0EsR0FBNkZBLFVBQVdBLENBQUNBLE9BQVFBLENBQUNBLFdBQVdBLENBQUNBO1FBRTdJQSxXQUFXQSxDQUFDQSxtQkFBbUJBLEdBQUdBLElBQUlBLENBQUNBLG9CQUFvQkEsQ0FBQ0E7UUFFNURBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLG9CQUFvQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLEFBQ0FBLDZCQUQ2QkE7WUFDN0JBLElBQUlBLENBQUNBLHVCQUF1QkEsQ0FBQ0EsV0FBV0EsQ0FBQ0Esb0JBQW9CQSxFQUFFQSxXQUFXQSxDQUFDQSxrQkFBa0JBLENBQUNBLENBQUNBO1lBQzVFQSxLQUFLQSxDQUFDQSxPQUFRQSxDQUFDQSw0QkFBNEJBLENBQUNBLG9CQUFvQkEsQ0FBQ0EsTUFBTUEsRUFBRUEsb0JBQW9CQSxFQUFFQSxJQUFJQSxDQUFDQSxrQkFBa0JBLEVBQUVBLFdBQVdBLENBQUNBLGtCQUFrQkEsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDOUtBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ1BBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO2dCQUNqQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxDQUFDQSxXQUFXQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtvQkFDakRBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBNkJBLFVBQVVBLEVBQUVBLFdBQVdBLENBQUNBLENBQUNBO2dCQUU1RUEsTUFBTUEsQ0FBQUE7WUFDUEEsQ0FBQ0E7WUFDa0JBLEtBQUtBLENBQUNBLE9BQVFBLENBQUNBLDRCQUE0QkEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxNQUFNQSxFQUFFQSxvQkFBb0JBLEVBQUVBLElBQUlBLENBQUNBLGVBQWVBLEVBQUVBLElBQUlBLENBQUNBLFVBQVVBLEdBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQzVKQSxDQUFDQTtRQUVrQkEsS0FBS0EsQ0FBQ0EsT0FBUUEsQ0FBQ0EsY0FBY0EsQ0FBQ0Esa0JBQWtCQSxFQUFFQSxVQUFVQSxDQUFDQSxhQUFhQSxDQUFDQSxtQkFBbUJBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsRUFBRUEsVUFBVUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxnQkFBZ0JBLENBQUNBLEVBQUVBLFVBQVVBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsQ0FBQ0E7UUFDbk5BLEtBQUtBLENBQUNBLE9BQVFBLENBQUNBLGNBQWNBLENBQUNBLGtCQUFrQkEsR0FBR0EsQ0FBQ0EsRUFBRUEsVUFBVUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxpQkFBaUJBLENBQUNBLEVBQUVBLFVBQVVBLENBQUNBLGVBQWVBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxFQUFFQSxVQUFVQSxDQUFDQSxtQkFBbUJBLENBQUNBLENBQUNBO0lBQzlPQSxDQUFDQTtJQUVEVDs7T0FFR0E7SUFDSUEsK0NBQW9CQSxHQUEzQkEsVUFBNEJBLFlBQTZCQTtRQUV4RFUsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxJQUFJQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLENBQUNBLElBQUlBLFlBQVlBLENBQUNBLHNCQUFzQkEsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDaEpBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLHNCQUFzQkEsRUFBRUEsQ0FBQ0E7SUFDL0NBLENBQUNBO0lBRURWOztPQUVHQTtJQUNJQSw0Q0FBaUJBLEdBQXhCQSxVQUF5QkEsRUFBU0E7UUFFakNXLGdCQUFLQSxDQUFDQSxpQkFBaUJBLFlBQUNBLEVBQUVBLENBQUNBLENBQUNBO1FBRTVCQSxBQUNBQSwwQkFEMEJBO1FBQzFCQSxJQUFJQSxDQUFDQSxzQkFBc0JBLEdBQUdBLElBQUlBLENBQUNBO1FBRW5DQSxBQUNBQSxzREFEc0RBO1FBQ3REQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxPQUFPQSxDQUFDQTtZQUMvQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxDQUFDQTtnQkFDN0NBLElBQUlBLENBQUNBLHdCQUF3QkEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0E7SUFDN0NBLENBQUNBO0lBRU9YLGtEQUF1QkEsR0FBL0JBLFVBQWdDQSxvQkFBb0JBLENBQWVBLFFBQURBLEFBQVNBLEVBQUVBLFNBQVNBLENBQVFBLFFBQURBLEFBQVNBO1FBRXJHWSxJQUFJQSxDQUFDQSxHQUFtQkEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBbUJBLENBQUNBLENBQUNBO1FBQ2pEQSxJQUFJQSxHQUFHQSxDQUFRQSxRQUFEQSxBQUFTQSxDQUFDQTtRQUN4QkEsSUFBSUEsUUFBUUEsQ0FBUUEsUUFBREEsQUFBU0EsQ0FBQ0E7UUFFN0JBLElBQUlBLENBQUNBLGtCQUFrQkEsR0FBR0EsSUFBSUEsS0FBS0EsRUFBVUEsQ0FBQ0E7UUFFOUNBLEdBQUdBLENBQUNBO1lBQ0hBLFFBQVFBLEdBQUdBLG9CQUFvQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDckNBLEdBQUdBLEdBQUdBLFFBQVFBLEdBQUdBLEVBQUVBLENBQUNBO1lBRXBCQSxPQUFPQSxRQUFRQSxHQUFHQSxHQUFHQTtnQkFDcEJBLElBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFDbEVBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBLEdBQUdBLFNBQVNBLEVBQUVBO0lBQzNCQSxDQUFDQTtJQUVPWixpREFBc0JBLEdBQTlCQTtRQUVDYSxJQUFJQSxDQUFDQSxzQkFBc0JBLEdBQUdBLEtBQUtBLENBQUNBO1FBRXBDQSxBQUNBQSxpQkFEaUJBO1FBQ2pCQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLElBQUlBLENBQUNBLG9CQUFvQkEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFFcEhBLEFBQ0FBLHlCQUR5QkE7WUFDckJBLFNBQVNBLEdBQW1CQSxDQUFDQSxDQUFDQTtRQUNsQ0EsSUFBSUEsV0FBV0EsR0FBb0JBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLFVBQVVBLENBQUNBO1FBQy9EQSxJQUFJQSxHQUFpQkEsQ0FBQ0E7UUFDdEJBLElBQUlBLEVBQVNBLEVBQUVBLEVBQVNBLEVBQUVBLEVBQVNBLEVBQUVBLEVBQVNBLENBQUNBO1FBQy9DQSxJQUFJQSxHQUFVQSxFQUFFQSxHQUFVQSxFQUFFQSxHQUFVQSxDQUFDQTtRQUN2Q0EsSUFBSUEsR0FBVUEsRUFBRUEsR0FBVUEsRUFBRUEsR0FBVUEsQ0FBQ0E7UUFDdkNBLElBQUlBLEdBQVVBLEVBQUVBLEdBQVVBLEVBQUVBLEdBQVVBLENBQUNBO1FBQ3ZDQSxJQUFJQSxHQUFVQSxFQUFFQSxHQUFVQSxFQUFFQSxHQUFVQSxDQUFDQTtRQUN2Q0EsSUFBSUEsR0FBVUEsRUFBRUEsR0FBVUEsRUFBRUEsR0FBVUEsQ0FBQ0E7UUFDdkNBLElBQUlBLEdBQVVBLEVBQUVBLEdBQVVBLEVBQUVBLEdBQVVBLEVBQUVBLEdBQVVBLENBQUNBO1FBQ25EQSxJQUFJQSxHQUFVQSxFQUFFQSxHQUFVQSxFQUFFQSxHQUFVQSxFQUFFQSxHQUFVQSxDQUFDQTtRQUNuREEsSUFBSUEsR0FBVUEsRUFBRUEsR0FBVUEsRUFBRUEsR0FBVUEsRUFBRUEsR0FBVUEsQ0FBQ0E7UUFDbkRBLElBQUlBLE1BQU1BLEdBQXdCQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUN4REEsSUFBSUEsSUFBY0EsQ0FBQ0E7UUFDbkJBLElBQUlBLElBQWVBLENBQUNBO1FBQ3BCQSxJQUFJQSxHQUFZQSxDQUFDQTtRQUNqQkEsSUFBSUEsQ0FBUUEsQ0FBQ0E7UUFFYkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBbUJBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBO1lBQzFEQSxJQUFJQSxHQUFHQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN0QkEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7WUFDeEJBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO1lBQ3ZCQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNaQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNaQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNaQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUVaQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxHQUFDQSxFQUFFQSxDQUFDQSxHQUFDQSxFQUFFQSxDQUFDQTtZQUN0QkEsR0FBR0EsR0FBR0EsQ0FBQ0EsR0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDWEEsR0FBR0EsR0FBR0EsQ0FBQ0EsR0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDWEEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDdEJBLEdBQUdBLEdBQUdBLENBQUNBLEdBQUNBLEVBQUVBLENBQUNBO1lBQ1hBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUNBLEVBQUVBLEdBQUNBLEVBQUVBLENBQUNBO1lBRWhCQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFDQSxFQUFFQSxHQUFDQSxFQUFFQSxDQUFDQTtZQUNoQkEsR0FBR0EsR0FBR0EsR0FBR0EsR0FBQ0EsRUFBRUEsR0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDaEJBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUNBLEVBQUVBLEdBQUNBLEVBQUVBLENBQUNBO1lBQ2hCQSxFQUFFQSxJQUFJQSxFQUFFQSxDQUFDQTtZQUNUQSxFQUFFQSxJQUFJQSxFQUFFQSxDQUFDQTtZQUNUQSxFQUFFQSxJQUFJQSxFQUFFQSxDQUFDQTtZQUNUQSxFQUFFQSxJQUFJQSxFQUFFQSxDQUFDQTtZQUVUQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUM5QkEsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0E7WUFDaEJBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBO1lBQ2hCQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQTtZQUNoQkEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDbkJBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBO1lBQ2hCQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQTtZQUNoQkEsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0E7WUFDaEJBLEdBQUdBLEdBQUdBLENBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBO1lBRXpCQSxBQUNBQSw0QkFENEJBO1lBQzVCQSxHQUFHQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxlQUFlQSxDQUFDQTtZQUNoQ0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDYkEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDYkEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDYkEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDZEEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDYkEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDYkEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDYkEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDZEEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDYkEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDYkEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDZEEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFFZEEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsQ0FBQ0E7WUFDOURBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFNBQVNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLENBQUNBO1lBQ2xFQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxHQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFDQSxHQUFHQSxDQUFDQTtZQUNsRUEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDMUVBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFNBQVNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLENBQUNBO1lBQ2xFQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxHQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFDQSxHQUFHQSxDQUFDQTtZQUNsRUEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsQ0FBQ0E7WUFDbEVBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFNB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QUFDQSxpQkFBaUJBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBO1FBRTVEQSxJQUFJQSxlQUFlQSxHQUFpQkEsaUJBQWlCQSxDQUFDQSxTQUFTQSxDQUFDQTtRQUNoRUEsSUFBSUEsYUFBYUEsR0FBaUJBLGlCQUFpQkEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7UUFDbEVBLElBQUlBLGNBQWNBLEdBQWlCQSxpQkFBaUJBLENBQUNBLGNBQWNBLENBQUNBO1FBRXBFQSxJQUFJQSxZQUFZQSxHQUFpQkEsaUJBQWlCQSxDQUFDQSxZQUFZQSxDQUFDQTtRQUNoRUEsSUFBSUEsWUFBWUEsR0FBaUJBLGlCQUFpQkEsQ0FBQ0EsWUFBWUEsQ0FBQ0E7UUFFaEVBLElBQUlBLGlCQUFpQkEsR0FBR0EsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxpQkFBaUJBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO1FBRXZFQSxJQUFJQSxlQUFlQSxHQUFpQkEsaUJBQWlCQSxDQUFDQSxTQUFTQSxDQUFDQTtRQUNoRUEsSUFBSUEsYUFBYUEsR0FBaUJBLGlCQUFpQkEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7UUFDbEVBLElBQUlBLGNBQWNBLEdBQWlCQSxpQkFBaUJBLENBQUNBLGNBQWNBLENBQUNBO1FBRXBFQSxJQUFJQSxLQUFLQSxHQUFtQkEsQ0FBQ0EsQ0FBQ0E7UUFDOUJBLElBQUlBLENBQUNBLEdBQW1CQSxDQUFDQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsQ0FBUUEsUUFBREEsQUFBU0EsQ0FBQ0E7UUFDdEJBLElBQUlBLEVBQVNBLEVBQUVBLEVBQVNBLEVBQUVBLEVBQVNBLENBQUNBO1FBQ3BDQSxJQUFJQSxFQUFTQSxFQUFFQSxFQUFTQSxFQUFFQSxFQUFTQSxDQUFDQTtRQUNwQ0EsSUFBSUEsRUFBU0EsRUFBRUEsRUFBU0EsRUFBRUEsRUFBU0EsQ0FBQ0E7UUFDcENBLElBQUlBLEdBQUdBLEdBQWtCQSxlQUFlQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUNoREEsSUFBSUEsTUFBYUEsQ0FBQ0E7UUFDbEJBLElB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Q0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzFDQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDMUNBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFNBQVNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO29CQUMxQ0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzFDQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDMUNBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFNBQVNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBO29CQUMzQ0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsU0FBU0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7b0JBQzNDQSxFQUFFQSxJQUFJQSxNQUFNQSxHQUFDQSxDQUFDQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDdkRBLEVBQUVBLElBQUlBLE1BQU1BLEdBQUNBLENBQUNBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBO29CQUN2REEsRUFBRUEsSUFBSUEsTUFBTUEsR0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZEQSxFQUFFQSxJQUFJQSxNQUFNQSxHQUFDQSxDQUFDQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxHQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtvQkFDakRBLEVBQUVBLElBQUlBLE1BQU1BLEdBQUNBLENBQUNBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUNBLEtBQUtBLENBQUNBLENBQUNBO29CQUNqREEsRUFBRUEsSUFBSUEsTUFBTUEsR0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsR0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2pEQSxFQUFFQSxJQUFJQSxNQUFNQSxHQUFDQSxDQUFDQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxHQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtvQkFDakRBLEVBQUVBLElBQUlBLE1BQU1BLEdBQUNBLENBQUNBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUNBLEtBQUtBLENBQUNBLENBQUNBO29CQUNqREEsRUFBRUEsSUFBSUEsTUFBTUEsR0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsR0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2pEQSxFQUFFQSxDQUFDQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUNQQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO29CQUNqQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQTtnQkFDM0JBLENBQUNBO1lBQ0ZBLENBQUNBO1lB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LFNBQVNBLEVBQUVBLENBQUNBO1lBRXBEQSxLQUFLQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNsQkEsV0FBV0EsR0FBR0EsS0FBS0EsQ0FBQ0EsV0FBV0EsQ0FBQ0E7WUFDaENBLElBQUlBLEdBQUdBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBRXJCQSxDQUFDQSxHQUFHQSxlQUFlQSxDQUFDQSxXQUFXQSxDQUFDQTtZQUNoQ0EsQ0FBQ0EsR0FBR0EsZUFBZUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7WUFFaENBLEVBQUVBLENBQUNBLENBQUNBLFdBQVdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNyQkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7Z0JBQ3RCQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQTtnQkFDdEJBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNYQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDWEEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1hBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNYQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDWEEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1hBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1lBQ1pBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNQQSxBQUNBQSxxQkFEcUJBO2dCQUNyQkEsVUFBVUEsR0FBR0EsV0FBV0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0E7Z0JBRXRDQSxBQUNBQSxlQURlQTtnQkFDZkEsRUFBRUEsR0FBR0EsVUFBVUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7Z0JBQzVCQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQTtnQkFDdEJBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNWQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDVkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1ZBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNWQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDVkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1ZBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUVWQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxDQUFDQTtnQkFDNUJBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLENBQUNBO2dCQUMzQkEsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsQ0FBQ0E7Z0JBQzNCQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxDQUFDQTtnQkFFM0JBLEFBQ0FBLDRCQUQ0QkE7Z0JBQzVCQSxFQUFFQSxHQUFHQSxVQUFVQSxDQUFDQSxXQUFXQSxDQUFDQTtnQkFDNUJBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUM1Q0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzVDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFFNUNBLEFBQ0FBLDRCQUQ0QkE7Z0JBQzVCQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDVkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1ZBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNWQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDVkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7Z0JBQ3RCQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDVkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1ZBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNWQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFFVkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0Es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RCxBQUEwQixpQkFBakIsZ0JBQWdCLENBQUMiLCJmaWxlIjoiYW5pbWF0b3JzL1NrZWxldG9uQW5pbWF0b3IuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFF1YXRlcm5pb25cdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9RdWF0ZXJuaW9uXCIpO1xuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiKTtcblxuaW1wb3J0IElTdWJNZXNoXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9JU3ViTWVzaFwiKTtcbmltcG9ydCBUcmlhbmdsZVN1Ykdlb21ldHJ5XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9UcmlhbmdsZVN1Ykdlb21ldHJ5XCIpO1xuaW1wb3J0IFRyaWFuZ2xlU3ViTWVzaFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9UcmlhbmdsZVN1Yk1lc2hcIik7XG5pbXBvcnQgQ2FtZXJhXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvQ2FtZXJhXCIpO1xuaW1wb3J0IFN1Ykdlb21ldHJ5RXZlbnRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2V2ZW50cy9TdWJHZW9tZXRyeUV2ZW50XCIpO1xuXG5pbXBvcnQgQW5pbWF0b3JCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRvckJhc2VcIik7XG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuaW1wb3J0IFJlbmRlcmFibGVCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9wb29sL1JlbmRlcmFibGVCYXNlXCIpO1xuaW1wb3J0IFRyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGVcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL3Bvb2wvVHJpYW5nbGVTdWJNZXNoUmVuZGVyYWJsZVwiKTtcbmltcG9ydCBDb250ZXh0R0xQcm9ncmFtVHlwZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvQ29udGV4dEdMUHJvZ3JhbVR5cGVcIik7XG5pbXBvcnQgSUNvbnRleHRTdGFnZUdMXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0lDb250ZXh0U3RhZ2VHTFwiKTtcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcblxuaW1wb3J0IFNrZWxldG9uQW5pbWF0aW9uU2V0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL1NrZWxldG9uQW5pbWF0aW9uU2V0XCIpO1xuaW1wb3J0IEpvaW50UG9zZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Kb2ludFBvc2VcIik7XG5pbXBvcnQgU2tlbGV0b25cdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Ta2VsZXRvblwiKTtcbmltcG9ydCBTa2VsZXRvbkpvaW50XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Ta2VsZXRvbkpvaW50XCIpO1xuaW1wb3J0IFNrZWxldG9uUG9zZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Ta2VsZXRvblBvc2VcIik7XG5pbXBvcnQgSVNrZWxldG9uQW5pbWF0aW9uU3RhdGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL3N0YXRlcy9JU2tlbGV0b25BbmltYXRpb25TdGF0ZVwiKTtcbmltcG9ydCBJQW5pbWF0aW9uVHJhbnNpdGlvblx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy90cmFuc2l0aW9ucy9JQW5pbWF0aW9uVHJhbnNpdGlvblwiKTtcbmltcG9ydCBBbmltYXRpb25TdGF0ZUV2ZW50XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvZXZlbnRzL0FuaW1hdGlvblN0YXRlRXZlbnRcIik7XG5cbi8qKlxuICogUHJvdmlkZXMgYW4gaW50ZXJmYWNlIGZvciBhc3NpZ25pbmcgc2tlbGV0b24tYmFzZWQgYW5pbWF0aW9uIGRhdGEgc2V0cyB0byBtZXNoLWJhc2VkIGVudGl0eSBvYmplY3RzXG4gKiBhbmQgY29udHJvbGxpbmcgdGhlIHZhcmlvdXMgYXZhaWxhYmxlIHN0YXRlcyBvZiBhbmltYXRpb24gdGhyb3VnaCBhbiBpbnRlcmF0aXZlIHBsYXloZWFkIHRoYXQgY2FuIGJlXG4gKiBhdXRvbWF0aWNhbGx5IHVwZGF0ZWQgb3IgbWFudWFsbHkgdHJpZ2dlcmVkLlxuICovXG5jbGFzcyBTa2VsZXRvbkFuaW1hdG9yIGV4dGVuZHMgQW5pbWF0b3JCYXNlXG57XG5cdHByaXZhdGUgX2dsb2JhbE1hdHJpY2VzOkFycmF5PG51bWJlcj47XG5cdHByaXZhdGUgX2dsb2JhbFBvc2U6U2tlbGV0b25Qb3NlID0gbmV3IFNrZWxldG9uUG9zZSgpO1xuXHRwcml2YXRlIF9nbG9iYWxQcm9wZXJ0aWVzRGlydHk6Ym9vbGVhbjtcblx0cHJpdmF0ZSBfbnVtSm9pbnRzOm51bWJlciAvKnVpbnQqLztcblx0cHJpdmF0ZSBfbW9ycGhlZFN1Ykdlb21ldHJ5Ok9iamVjdCA9IG5ldyBPYmplY3QoKTtcblx0cHJpdmF0ZSBfbW9ycGhlZFN1Ykdlb21ldHJ5RGlydHk6T2JqZWN0ID0gbmV3IE9iamVjdCgpO1xuXHRwcml2YXRlIF9jb25kZW5zZWRNYXRyaWNlczpBcnJheTxudW1iZXI+O1xuXG5cdHByaXZhdGUgX3NrZWxldG9uOlNrZWxldG9uO1xuXHRwcml2YXRlIF9mb3JjZUNQVTpib29sZWFuO1xuXHRwcml2YXRlIF91c2VDb25kZW5zZWRJbmRpY2VzOmJvb2xlYW47XG5cdHByaXZhdGUgX2pvaW50c1BlclZlcnRleDpudW1iZXIgLyp1aW50Ki87XG5cdHByaXZhdGUgX2FjdGl2ZVNrZWxldG9uU3RhdGU6SVNrZWxldG9uQW5pbWF0aW9uU3RhdGU7XG5cdHByaXZhdGUgX29uVHJhbnNpdGlvbkNvbXBsZXRlRGVsZWdhdGU6KGV2ZW50OkFuaW1hdGlvblN0YXRlRXZlbnQpID0+IHZvaWQ7XG5cblx0cHJpdmF0ZSBfb25JbmRpY2VzVXBkYXRlRGVsZWdhdGU6KGV2ZW50OlN1Ykdlb21ldHJ5RXZlbnQpID0+IHZvaWQ7XG5cdHByaXZhdGUgX29uVmVydGljZXNVcGRhdGVEZWxlZ2F0ZTooZXZlbnQ6U3ViR2VvbWV0cnlFdmVudCkgPT4gdm9pZDtcblxuXHQvKipcblx0ICogcmV0dXJucyB0aGUgY2FsY3VsYXRlZCBnbG9iYWwgbWF0cmljZXMgb2YgdGhlIGN1cnJlbnQgc2tlbGV0b24gcG9zZS5cblx0ICpcblx0ICogQHNlZSAjZ2xvYmFsUG9zZVxuXHQgKi9cblx0cHVibGljIGdldCBnbG9iYWxNYXRyaWNlcygpOkFycmF5PG51bWJlcj5cblx0e1xuXHRcdGlmICh0aGlzLl9nbG9iYWxQcm9wZXJ0aWVzRGlydHkpXG5cdFx0XHR0aGlzLnVwZGF0ZUdsb2JhbFByb3BlcnRpZXMoKTtcblxuXHRcdHJldHVybiB0aGlzLl9nbG9iYWxNYXRyaWNlcztcblx0fVxuXG5cdC8qKlxuXHQgKiByZXR1cm5zIHRoZSBjdXJyZW50IHNrZWxldG9uIHBvc2Ugb3V0cHV0IGZyb20gdGhlIGFuaW1hdG9yLlxuXHQgKlxuXHQgKiBAc2VlIGF3YXkuYW5pbWF0b3JzLmRhdGEuU2tlbGV0b25Qb3NlXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGdsb2JhbFBvc2UoKTpTa2VsZXRvblBvc2Vcblx0e1xuXHRcdGlmICh0aGlzLl9nbG9iYWxQcm9wZXJ0aWVzRGlydHkpXG5cdFx0XHR0aGlzLnVwZGF0ZUdsb2JhbFByb3BlcnRpZXMoKTtcblxuXHRcdHJldHVybiB0aGlzLl9nbG9iYWxQb3NlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHNrZWxldG9uIG9iamVjdCBpbiB1c2UgYnkgdGhlIGFuaW1hdG9yIC0gdGhpcyBkZWZpbmVzIHRoZSBudW1iZXIgYW5kIGhlaXJhcmNoeSBvZiBqb2ludHMgdXNlZCBieSB0aGVcblx0ICogc2tpbm5lZCBnZW9lbXRyeSB0byB3aGljaCBza2VsZW9uIGFuaW1hdG9yIGlzIGFwcGxpZWQuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHNrZWxldG9uKCk6U2tlbGV0b25cblx0e1xuXHRcdHJldHVybiB0aGlzLl9za2VsZXRvbjtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgc2tlbGV0b24gYW5pbWF0b3IgaXMgZGlzYWJsZWQgYnkgZGVmYXVsdCBmb3IgR1BVIHJlbmRlcmluZywgc29tZXRoaW5nIHRoYXQgYWxsb3dzIHRoZSBhbmltYXRvciB0byBwZXJmb3JtIGNhbGN1bGF0aW9uIG9uIHRoZSBHUFUuXG5cdCAqIERlZmF1bHRzIHRvIGZhbHNlLlxuXHQgKi9cblx0cHVibGljIGdldCBmb3JjZUNQVSgpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9mb3JjZUNQVTtcblx0fVxuXG5cdC8qKlxuXHQgKiBPZmZlcnMgdGhlIG9wdGlvbiBvZiBlbmFibGluZyBHUFUgYWNjZWxlcmF0ZWQgYW5pbWF0aW9uIG9uIHNrZWxldG9ucyBsYXJnZXIgdGhhbiAzMiBqb2ludHNcblx0ICogYnkgY29uZGVuc2luZyB0aGUgbnVtYmVyIG9mIGpvaW50IGluZGV4IHZhbHVlcyByZXF1aXJlZCBwZXIgbWVzaC4gT25seSBhcHBsaWNhYmxlIHRvXG5cdCAqIHNrZWxldG9uIGFuaW1hdGlvbnMgdGhhdCB1dGlsaXNlIG1vcmUgdGhhbiBvbmUgbWVzaCBvYmplY3QuIERlZmF1bHRzIHRvIGZhbHNlLlxuXHQgKi9cblx0cHVibGljIGdldCB1c2VDb25kZW5zZWRJbmRpY2VzKCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3VzZUNvbmRlbnNlZEluZGljZXM7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHVzZUNvbmRlbnNlZEluZGljZXModmFsdWU6Ym9vbGVhbilcblx0e1xuXHRcdHRoaXMuX3VzZUNvbmRlbnNlZEluZGljZXMgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IDxjb2RlPlNrZWxldG9uQW5pbWF0b3I8L2NvZGU+IG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHNrZWxldG9uQW5pbWF0aW9uU2V0IFRoZSBhbmltYXRpb24gZGF0YSBzZXQgY29udGFpbmluZyB0aGUgc2tlbGV0b24gYW5pbWF0aW9ucyB1c2VkIGJ5IHRoZSBhbmltYXRvci5cblx0ICogQHBhcmFtIHNrZWxldG9uIFRoZSBza2VsZXRvbiBvYmplY3QgdXNlZCBmb3IgY2FsY3VsYXRpbmcgdGhlIHJlc3VsdGluZyBnbG9iYWwgbWF0cmljZXMgZm9yIHRyYW5zZm9ybWluZyBza2lubmVkIG1lc2ggZGF0YS5cblx0ICogQHBhcmFtIGZvcmNlQ1BVIE9wdGlvbmFsIHZhbHVlIHRoYXQgb25seSBhbGxvd3MgdGhlIGFuaW1hdG9yIHRvIHBlcmZvcm0gY2FsY3VsYXRpb24gb24gdGhlIENQVS4gRGVmYXVsdHMgdG8gZmFsc2UuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihhbmltYXRpb25TZXQ6U2tlbGV0b25BbmltYXRpb25TZXQsIHNrZWxldG9uOlNrZWxldG9uLCBmb3JjZUNQVTpib29sZWFuID0gZmFsc2UpXG5cdHtcblx0XHRzdXBlcihhbmltYXRpb25TZXQpO1xuXG5cdFx0dGhpcy5fc2tlbGV0b24gPSBza2VsZXRvbjtcblx0XHR0aGlzLl9mb3JjZUNQVSA9IGZvcmNlQ1BVO1xuXHRcdHRoaXMuX2pvaW50c1BlclZlcnRleCA9IGFuaW1hdGlvblNldC5qb2ludHNQZXJWZXJ0ZXg7XG5cblx0XHR0aGlzLl9udW1Kb2ludHMgPSB0aGlzLl9za2VsZXRvbi5udW1Kb2ludHM7XG5cdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXMgPSBuZXcgQXJyYXk8bnVtYmVyPih0aGlzLl9udW1Kb2ludHMqMTIpO1xuXG5cdFx0dmFyIGo6bnVtYmVyIC8qaW50Ki8gPSAwO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyIC8qdWludCovID0gMDsgaSA8IHRoaXMuX251bUpvaW50czsgKytpKSB7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1tqKytdID0gMTtcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW2orK10gPSAwO1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbaisrXSA9IDA7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1tqKytdID0gMDtcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW2orK10gPSAwO1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbaisrXSA9IDE7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1tqKytdID0gMDtcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW2orK10gPSAwO1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbaisrXSA9IDA7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1tqKytdID0gMDtcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW2orK10gPSAxO1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbaisrXSA9IDA7XG5cdFx0fVxuXG5cdFx0dGhpcy5fb25UcmFuc2l0aW9uQ29tcGxldGVEZWxlZ2F0ZSA9IChldmVudDpBbmltYXRpb25TdGF0ZUV2ZW50KSA9PiB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKGV2ZW50KTtcblx0XHR0aGlzLl9vbkluZGljZXNVcGRhdGVEZWxlZ2F0ZSA9IChldmVudDpTdWJHZW9tZXRyeUV2ZW50KSA9PiB0aGlzLm9uSW5kaWNlc1VwZGF0ZShldmVudCk7XG5cdFx0dGhpcy5fb25WZXJ0aWNlc1VwZGF0ZURlbGVnYXRlID0gKGV2ZW50OlN1Ykdlb21ldHJ5RXZlbnQpID0+IHRoaXMub25WZXJ0aWNlc1VwZGF0ZShldmVudCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBjbG9uZSgpOkFuaW1hdG9yQmFzZVxuXHR7XG5cdFx0LyogVGhlIGNhc3QgdG8gU2tlbGV0b25BbmltYXRpb25TZXQgc2hvdWxkIG5ldmVyIGZhaWwsIGFzIF9hbmltYXRpb25TZXQgY2FuIG9ubHkgYmUgc2V0XG5cdFx0IHRocm91Z2ggdGhlIGNvbnN0cnVjdG9yLCB3aGljaCB3aWxsIG9ubHkgYWNjZXB0IGEgU2tlbGV0b25BbmltYXRpb25TZXQuICovXG5cdFx0cmV0dXJuIG5ldyBTa2VsZXRvbkFuaW1hdG9yKDxTa2VsZXRvbkFuaW1hdGlvblNldD4gdGhpcy5fcEFuaW1hdGlvblNldCwgdGhpcy5fc2tlbGV0b24sIHRoaXMuX2ZvcmNlQ1BVKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQbGF5cyBhbiBhbmltYXRpb24gc3RhdGUgcmVnaXN0ZXJlZCB3aXRoIHRoZSBnaXZlbiBuYW1lIGluIHRoZSBhbmltYXRpb24gZGF0YSBzZXQuXG5cdCAqXG5cdCAqIEBwYXJhbSBuYW1lIFRoZSBkYXRhIHNldCBuYW1lIG9mIHRoZSBhbmltYXRpb24gc3RhdGUgdG8gYmUgcGxheWVkLlxuXHQgKiBAcGFyYW0gdHJhbnNpdGlvbiBBbiBvcHRpb25hbCB0cmFuc2l0aW9uIG9iamVjdCB0aGF0IGRldGVybWluZXMgaG93IHRoZSBhbmltYXRvciB3aWxsIHRyYW5zaXRpb24gZnJvbSB0aGUgY3VycmVudGx5IGFjdGl2ZSBhbmltYXRpb24gc3RhdGUuXG5cdCAqIEBwYXJhbSBvZmZzZXQgQW4gb3B0aW9uIG9mZnNldCB0aW1lIChpbiBtaWxsaXNlY29uZHMpIHRoYXQgcmVzZXRzIHRoZSBzdGF0ZSdzIGludGVybmFsIGNsb2NrIHRvIHRoZSBhYnNvbHV0ZSB0aW1lIG9mIHRoZSBhbmltYXRvciBwbHVzIHRoZSBvZmZzZXQgdmFsdWUuIFJlcXVpcmVkIGZvciBub24tbG9vcGluZyBhbmltYXRpb24gc3RhdGVzLlxuXHQgKi9cblx0cHVibGljIHBsYXkobmFtZTpzdHJpbmcsIHRyYW5zaXRpb246SUFuaW1hdGlvblRyYW5zaXRpb24gPSBudWxsLCBvZmZzZXQ6bnVtYmVyID0gTmFOKVxuXHR7XG5cdFx0aWYgKHRoaXMuX3BBY3RpdmVBbmltYXRpb25OYW1lID09IG5hbWUpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLl9wQWN0aXZlQW5pbWF0aW9uTmFtZSA9IG5hbWU7XG5cblx0XHRpZiAoIXRoaXMuX3BBbmltYXRpb25TZXQuaGFzQW5pbWF0aW9uKG5hbWUpKVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQW5pbWF0aW9uIHJvb3Qgbm9kZSBcIiArIG5hbWUgKyBcIiBub3QgZm91bmQhXCIpO1xuXG5cdFx0aWYgKHRyYW5zaXRpb24gJiYgdGhpcy5fcEFjdGl2ZU5vZGUpIHtcblx0XHRcdC8vc2V0dXAgdGhlIHRyYW5zaXRpb25cblx0XHRcdHRoaXMuX3BBY3RpdmVOb2RlID0gdHJhbnNpdGlvbi5nZXRBbmltYXRpb25Ob2RlKHRoaXMsIHRoaXMuX3BBY3RpdmVOb2RlLCB0aGlzLl9wQW5pbWF0aW9uU2V0LmdldEFuaW1hdGlvbihuYW1lKSwgdGhpcy5fcEFic29sdXRlVGltZSk7XG5cdFx0XHR0aGlzLl9wQWN0aXZlTm9kZS5hZGRFdmVudExpc3RlbmVyKEFuaW1hdGlvblN0YXRlRXZlbnQuVFJBTlNJVElPTl9DT01QTEVURSwgdGhpcy5fb25UcmFuc2l0aW9uQ29tcGxldGVEZWxlZ2F0ZSk7XG5cdFx0fSBlbHNlXG5cdFx0XHR0aGlzLl9wQWN0aXZlTm9kZSA9IHRoaXMuX3BBbmltYXRpb25TZXQuZ2V0QW5pbWF0aW9uKG5hbWUpO1xuXG5cdFx0dGhpcy5fcEFjdGl2ZVN0YXRlID0gdGhpcy5nZXRBbmltYXRpb25TdGF0ZSh0aGlzLl9wQWN0aXZlTm9kZSk7XG5cblx0XHRpZiAodGhpcy51cGRhdGVQb3NpdGlvbikge1xuXHRcdFx0Ly91cGRhdGUgc3RyYWlnaHQgYXdheSB0byByZXNldCBwb3NpdGlvbiBkZWx0YXNcblx0XHRcdHRoaXMuX3BBY3RpdmVTdGF0ZS51cGRhdGUodGhpcy5fcEFic29sdXRlVGltZSk7XG5cdFx0XHR0aGlzLl9wQWN0aXZlU3RhdGUucG9zaXRpb25EZWx0YTtcblx0XHR9XG5cblx0XHR0aGlzLl9hY3RpdmVTa2VsZXRvblN0YXRlID0gPElTa2VsZXRvbkFuaW1hdGlvblN0YXRlPiB0aGlzLl9wQWN0aXZlU3RhdGU7XG5cblx0XHR0aGlzLnN0YXJ0KCk7XG5cblx0XHQvL2FwcGx5IGEgdGltZSBvZmZzZXQgaWYgc3BlY2lmaWVkXG5cdFx0aWYgKCFpc05hTihvZmZzZXQpKVxuXHRcdFx0dGhpcy5yZXNldChuYW1lLCBvZmZzZXQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgc2V0UmVuZGVyU3RhdGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlbmRlcmFibGU6UmVuZGVyYWJsZUJhc2UsIHN0YWdlOlN0YWdlLCBjYW1lcmE6Q2FtZXJhLCB2ZXJ0ZXhDb25zdGFudE9mZnNldDpudW1iZXIgLyppbnQqLywgdmVydGV4U3RyZWFtT2Zmc2V0Om51bWJlciAvKmludCovKVxuXHR7XG5cdFx0Ly8gZG8gb24gcmVxdWVzdCBvZiBnbG9iYWxQcm9wZXJ0aWVzXG5cdFx0aWYgKHRoaXMuX2dsb2JhbFByb3BlcnRpZXNEaXJ0eSlcblx0XHRcdHRoaXMudXBkYXRlR2xvYmFsUHJvcGVydGllcygpO1xuXG5cdFx0dmFyIHN1Ykdlb21ldHJ5OlRyaWFuZ2xlU3ViR2VvbWV0cnkgPSA8VHJpYW5nbGVTdWJHZW9tZXRyeT4gKDxUcmlhbmdsZVN1Yk1lc2g+ICg8VHJpYW5nbGVTdWJNZXNoUmVuZGVyYWJsZT4gcmVuZGVyYWJsZSkuc3ViTWVzaCkuc3ViR2VvbWV0cnk7XG5cblx0XHRzdWJHZW9tZXRyeS51c2VDb25kZW5zZWRJbmRpY2VzID0gdGhpcy5fdXNlQ29uZGVuc2VkSW5kaWNlcztcblxuXHRcdGlmICh0aGlzLl91c2VDb25kZW5zZWRJbmRpY2VzKSB7XG5cdFx0XHQvLyB1c2luZyBhIGNvbmRlbnNlZCBkYXRhIHNldFxuXHRcdFx0dGhpcy51cGRhdGVDb25kZW5zZWRNYXRyaWNlcyhzdWJHZW9tZXRyeS5jb25kZW5zZWRJbmRleExvb2tVcCwgc3ViR2VvbWV0cnkubnVtQ29uZGVuc2VkSm9pbnRzKTtcblx0XHRcdCg8SUNvbnRleHRTdGFnZUdMPiBzdGFnZS5jb250ZXh0KS5zZXRQcm9ncmFtQ29uc3RhbnRzRnJvbUFycmF5KENvbnRleHRHTFByb2dyYW1UeXBlLlZFUlRFWCwgdmVydGV4Q29uc3RhbnRPZmZzZXQsIHRoaXMuX2NvbmRlbnNlZE1hdHJpY2VzLCBzdWJHZW9tZXRyeS5udW1Db25kZW5zZWRKb2ludHMqMyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICh0aGlzLl9wQW5pbWF0aW9uU2V0LnVzZXNDUFUpIHtcblx0XHRcdFx0aWYgKHRoaXMuX21vcnBoZWRTdWJHZW9tZXRyeURpcnR5W3N1Ykdlb21ldHJ5LmlkXSlcblx0XHRcdFx0XHR0aGlzLm1vcnBoU3ViR2VvbWV0cnkoPFRyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGU+IHJlbmRlcmFibGUsIHN1Ykdlb21ldHJ5KTtcblxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblx0XHRcdCg8SUNvbnRleHRTdGFnZUdMPiBzdGFnZS5jb250ZXh0KS5zZXRQcm9ncmFtQ29uc3RhbnRzRnJvbUFycmF5KENvbnRleHRHTFByb2dyYW1UeXBlLlZFUlRFWCwgdmVydGV4Q29uc3RhbnRPZmZzZXQsIHRoaXMuX2dsb2JhbE1hdHJpY2VzLCB0aGlzLl9udW1Kb2ludHMqMyk7XG5cdFx0fVxuXG5cdFx0KDxJQ29udGV4dFN0YWdlR0w+IHN0YWdlLmNvbnRleHQpLmFjdGl2YXRlQnVmZmVyKHZlcnRleFN0cmVhbU9mZnNldCwgcmVuZGVyYWJsZS5nZXRWZXJ0ZXhEYXRhKFRyaWFuZ2xlU3ViR2VvbWV0cnkuSk9JTlRfSU5ERVhfREFUQSksIHJlbmRlcmFibGUuZ2V0VmVydGV4T2Zmc2V0KFRyaWFuZ2xlU3ViR2VvbWV0cnkuSk9JTlRfSU5ERVhfREFUQSksIHJlbmRlcmFibGUuSk9JTlRfSU5ERVhfRk9STUFUKTtcblx0XHQoPElDb250ZXh0U3RhZ2VHTD4gc3RhZ2UuY29udGV4dCkuYWN0aXZhdGVCdWZmZXIodmVydGV4U3RyZWFtT2Zmc2V0ICsgMSwgcmVuZGVyYWJsZS5nZXRWZXJ0ZXhEYXRhKFRyaWFuZ2xlU3ViR2VvbWV0cnkuSk9JTlRfV0VJR0hUX0RBVEEpLCByZW5kZXJhYmxlLmdldFZlcnRleE9mZnNldChUcmlhbmdsZVN1Ykdlb21ldHJ5LkpPSU5UX1dFSUdIVF9EQVRBKSwgcmVuZGVyYWJsZS5KT0lOVF9XRUlHSFRfRk9STUFUKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIHRlc3RHUFVDb21wYXRpYmlsaXR5KHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKVxuXHR7XG5cdFx0aWYgKCF0aGlzLl91c2VDb25kZW5zZWRJbmRpY2VzICYmICh0aGlzLl9mb3JjZUNQVSB8fCB0aGlzLl9qb2ludHNQZXJWZXJ0ZXggPiA0IHx8IHNoYWRlck9iamVjdC5udW1Vc2VkVmVydGV4Q29uc3RhbnRzICsgdGhpcy5fbnVtSm9pbnRzKjMgPiAxMjgpKVxuXHRcdFx0dGhpcy5fcEFuaW1hdGlvblNldC5jYW5jZWxHUFVDb21wYXRpYmlsaXR5KCk7XG5cdH1cblxuXHQvKipcblx0ICogQXBwbGllcyB0aGUgY2FsY3VsYXRlZCB0aW1lIGRlbHRhIHRvIHRoZSBhY3RpdmUgYW5pbWF0aW9uIHN0YXRlIG5vZGUgb3Igc3RhdGUgdHJhbnNpdGlvbiBvYmplY3QuXG5cdCAqL1xuXHRwdWJsaWMgX3BVcGRhdGVEZWx0YVRpbWUoZHQ6bnVtYmVyKVxuXHR7XG5cdFx0c3VwZXIuX3BVcGRhdGVEZWx0YVRpbWUoZHQpO1xuXG5cdFx0Ly9pbnZhbGlkYXRlIHBvc2UgbWF0cmljZXNcblx0XHR0aGlzLl9nbG9iYWxQcm9wZXJ0aWVzRGlydHkgPSB0cnVlO1xuXG5cdFx0Ly90cmlnZ2VyIGdlb21ldHJ5IGludmFsaWRhdGlvbiBpZiB1c2luZyBDUFUgYW5pbWF0aW9uXG5cdFx0aWYgKHRoaXMuX3BBbmltYXRpb25TZXQudXNlc0NQVSlcblx0XHRcdGZvciAodmFyIGtleSBpbiB0aGlzLl9tb3JwaGVkU3ViR2VvbWV0cnlEaXJ0eSlcblx0XHRcdFx0dGhpcy5fbW9ycGhlZFN1Ykdlb21ldHJ5RGlydHlba2V5XSA9IHRydWU7XG5cdH1cblxuXHRwcml2YXRlIHVwZGF0ZUNvbmRlbnNlZE1hdHJpY2VzKGNvbmRlbnNlZEluZGV4TG9va1VwOkFycmF5PG51bWJlcj4gLyp1aW50Ki8sIG51bUpvaW50czpudW1iZXIgLyp1aW50Ki8pXG5cdHtcblx0XHR2YXIgaTpudW1iZXIgLyp1aW50Ki8gPSAwLCBqOm51bWJlciAvKnVpbnQqLyA9IDA7XG5cdFx0dmFyIGxlbjpudW1iZXIgLyp1aW50Ki87XG5cdFx0dmFyIHNyY0luZGV4Om51bWJlciAvKnVpbnQqLztcblxuXHRcdHRoaXMuX2NvbmRlbnNlZE1hdHJpY2VzID0gbmV3IEFycmF5PG51bWJlcj4oKTtcblxuXHRcdGRvIHtcblx0XHRcdHNyY0luZGV4ID0gY29uZGVuc2VkSW5kZXhMb29rVXBbaV0qNDtcblx0XHRcdGxlbiA9IHNyY0luZGV4ICsgMTI7XG5cdFx0XHQvLyBjb3B5IGludG8gY29uZGVuc2VkXG5cdFx0XHR3aGlsZSAoc3JjSW5kZXggPCBsZW4pXG5cdFx0XHRcdHRoaXMuX2NvbmRlbnNlZE1hdHJpY2VzW2orK10gPSB0aGlzLl9nbG9iYWxNYXRyaWNlc1tzcmNJbmRleCsrXTtcblx0XHR9IHdoaWxlICgrK2kgPCBudW1Kb2ludHMpO1xuXHR9XG5cblx0cHJpdmF0ZSB1cGRhdGVHbG9iYWxQcm9wZXJ0aWVzKClcblx0e1xuXHRcdHRoaXMuX2dsb2JhbFByb3BlcnRpZXNEaXJ0eSA9IGZhbHNlO1xuXG5cdFx0Ly9nZXQgZ2xvYmFsIHBvc2Vcblx0XHR0aGlzLmxvY2FsVG9HbG9iYWxQb3NlKHRoaXMuX2FjdGl2ZVNrZWxldG9uU3RhdGUuZ2V0U2tlbGV0b25Qb3NlKHRoaXMuX3NrZWxldG9uKSwgdGhpcy5fZ2xvYmFsUG9zZSwgdGhpcy5fc2tlbGV0b24pO1xuXG5cdFx0Ly8gY29udmVydCBwb3NlIHRvIG1hdHJpeFxuXHRcdHZhciBtdHhPZmZzZXQ6bnVtYmVyIC8qdWludCovID0gMDtcblx0XHR2YXIgZ2xvYmFsUG9zZXM6QXJyYXk8Sm9pbnRQb3NlPiA9IHRoaXMuX2dsb2JhbFBvc2Uuam9pbnRQb3Nlcztcblx0XHR2YXIgcmF3OkFycmF5PG51bWJlcj47XG5cdFx0dmFyIG94Om51bWJlciwgb3k6bnVtYmVyLCBvejpudW1iZXIsIG93Om51bWJlcjtcblx0XHR2YXIgeHkyOm51bWJlciwgeHoyOm51bWJlciwgeHcyOm51bWJlcjtcblx0XHR2YXIgeXoyOm51bWJlciwgeXcyOm51bWJlciwgencyOm51bWJlcjtcblx0XHR2YXIgbjExOm51bWJlciwgbjEyOm51bWJlciwgbjEzOm51bWJlcjtcblx0XHR2YXIgbjIxOm51bWJlciwgbjIyOm51bWJlciwgbjIzOm51bWJlcjtcblx0XHR2YXIgbjMxOm51bWJlciwgbjMyOm51bWJlciwgbjMzOm51bWJlcjtcblx0XHR2YXIgbTExOm51bWJlciwgbTEyOm51bWJlciwgbTEzOm51bWJlciwgbTE0Om51bWJlcjtcblx0XHR2YXIgbTIxOm51bWJlciwgbTIyOm51bWJlciwgbTIzOm51bWJlciwgbTI0Om51bWJlcjtcblx0XHR2YXIgbTMxOm51bWJlciwgbTMyOm51bWJlciwgbTMzOm51bWJlciwgbTM0Om51bWJlcjtcblx0XHR2YXIgam9pbnRzOkFycmF5PFNrZWxldG9uSm9pbnQ+ID0gdGhpcy5fc2tlbGV0b24uam9pbnRzO1xuXHRcdHZhciBwb3NlOkpvaW50UG9zZTtcblx0XHR2YXIgcXVhdDpRdWF0ZXJuaW9uO1xuXHRcdHZhciB2ZWM6VmVjdG9yM0Q7XG5cdFx0dmFyIHQ6bnVtYmVyO1xuXG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgLyp1aW50Ki8gPSAwOyBpIDwgdGhpcy5fbnVtSm9pbnRzOyArK2kpIHtcblx0XHRcdHBvc2UgPSBnbG9iYWxQb3Nlc1tpXTtcblx0XHRcdHF1YXQgPSBwb3NlLm9yaWVudGF0aW9uO1xuXHRcdFx0dmVjID0gcG9zZS50cmFuc2xhdGlvbjtcblx0XHRcdG94ID0gcXVhdC54O1xuXHRcdFx0b3kgPSBxdWF0Lnk7XG5cdFx0XHRveiA9IHF1YXQuejtcblx0XHRcdG93ID0gcXVhdC53O1xuXG5cdFx0XHR4eTIgPSAodCA9IDIuMCpveCkqb3k7XG5cdFx0XHR4ejIgPSB0Km96O1xuXHRcdFx0eHcyID0gdCpvdztcblx0XHRcdHl6MiA9ICh0ID0gMi4wKm95KSpvejtcblx0XHRcdHl3MiA9IHQqb3c7XG5cdFx0XHR6dzIgPSAyLjAqb3oqb3c7XG5cblx0XHRcdHl6MiA9IDIuMCpveSpvejtcblx0XHRcdHl3MiA9IDIuMCpveSpvdztcblx0XHRcdHp3MiA9IDIuMCpveipvdztcblx0XHRcdG94ICo9IG94O1xuXHRcdFx0b3kgKj0gb3k7XG5cdFx0XHRveiAqPSBvejtcblx0XHRcdG93ICo9IG93O1xuXG5cdFx0XHRuMTEgPSAodCA9IG94IC0gb3kpIC0gb3ogKyBvdztcblx0XHRcdG4xMiA9IHh5MiAtIHp3Mjtcblx0XHRcdG4xMyA9IHh6MiArIHl3Mjtcblx0XHRcdG4yMSA9IHh5MiArIHp3Mjtcblx0XHRcdG4yMiA9IC10IC0gb3ogKyBvdztcblx0XHRcdG4yMyA9IHl6MiAtIHh3Mjtcblx0XHRcdG4zMSA9IHh6MiAtIHl3Mjtcblx0XHRcdG4zMiA9IHl6MiArIHh3Mjtcblx0XHRcdG4zMyA9IC1veCAtIG95ICsgb3ogKyBvdztcblxuXHRcdFx0Ly8gcHJlcGVuZCBpbnZlcnNlIGJpbmQgcG9zZVxuXHRcdFx0cmF3ID0gam9pbnRzW2ldLmludmVyc2VCaW5kUG9zZTtcblx0XHRcdG0xMSA9IHJhd1swXTtcblx0XHRcdG0xMiA9IHJhd1s0XTtcblx0XHRcdG0xMyA9IHJhd1s4XTtcblx0XHRcdG0xNCA9IHJhd1sxMl07XG5cdFx0XHRtMjEgPSByYXdbMV07XG5cdFx0XHRtMjIgPSByYXdbNV07XG5cdFx0XHRtMjMgPSByYXdbOV07XG5cdFx0XHRtMjQgPSByYXdbMTNdO1xuXHRcdFx0bTMxID0gcmF3WzJdO1xuXHRcdFx0bTMyID0gcmF3WzZdO1xuXHRcdFx0bTMzID0gcmF3WzEwXTtcblx0XHRcdG0zNCA9IHJhd1sxNF07XG5cblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldF0gPSBuMTEqbTExICsgbjEyKm0yMSArIG4xMyptMzE7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyAxXSA9IG4xMSptMTIgKyBuMTIqbTIyICsgbjEzKm0zMjtcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDJdID0gbjExKm0xMyArIG4xMiptMjMgKyBuMTMqbTMzO1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgM10gPSBuMTEqbTE0ICsgbjEyKm0yNCArIG4xMyptMzQgKyB2ZWMueDtcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDRdID0gbjIxKm0xMSArIG4yMiptMjEgKyBuMjMqbTMxO1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgNV0gPSBuMjEqbTEyICsgbjIyKm0yMiArIG4yMyptMzI7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyA2XSA9IG4yMSptMTMgKyBuMjIqbTIzICsgbjIzKm0zMztcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDddID0gbjIxKm0xNCArIG4yMiptMjQgKyBuMjMqbTM0ICsgdmVjLnk7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyA4XSA9IG4zMSptMTEgKyBuMzIqbTIxICsgbjMzKm0zMTtcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDldID0gbjMxKm0xMiArIG4zMiptMjIgKyBuMzMqbTMyO1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgMTBdID0gbjMxKm0xMyArIG4zMiptMjMgKyBuMzMqbTMzO1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgMTFdID0gbjMxKm0xNCArIG4zMiptMjQgKyBuMzMqbTM0ICsgdmVjLno7XG5cblx0XHRcdG10eE9mZnNldCA9IG10eE9mZnNldCArIDEyO1xuXHRcdH1cblx0fVxuXG5cblx0cHVibGljIGdldFJlbmRlcmFibGVTdWJHZW9tZXRyeShyZW5kZXJhYmxlOlRyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGUsIHNvdXJjZVN1Ykdlb21ldHJ5OlRyaWFuZ2xlU3ViR2VvbWV0cnkpOlRyaWFuZ2xlU3ViR2VvbWV0cnlcblx0e1xuXHRcdHRoaXMuX21vcnBoZWRTdWJHZW9tZXRyeURpcnR5W3NvdXJjZVN1Ykdlb21ldHJ5LmlkXSA9IHRydWU7XG5cblx0XHQvL2Vhcmx5IG91dCBmb3IgR1BVIGFuaW1hdGlvbnNcblx0XHRpZiAoIXRoaXMuX3BBbmltYXRpb25TZXQudXNlc0NQVSlcblx0XHRcdHJldHVybiBzb3VyY2VTdWJHZW9tZXRyeTtcblxuXHRcdHZhciB0YXJnZXRTdWJHZW9tZXRyeTpUcmlhbmdsZVN1Ykdlb21ldHJ5O1xuXG5cdFx0aWYgKCEodGFyZ2V0U3ViR2VvbWV0cnkgPSB0aGlzLl9tb3JwaGVkU3ViR2VvbWV0cnlbc291cmNlU3ViR2VvbWV0cnkuaWRdKSkge1xuXHRcdFx0Ly9ub3QgeWV0IHN0b3JlZFxuXHRcdFx0dGFyZ2V0U3ViR2VvbWV0cnkgPSB0aGlzLl9tb3JwaGVkU3ViR2VvbWV0cnlbc291cmNlU3ViR2VvbWV0cnkuaWRdID0gc291cmNlU3ViR2VvbWV0cnkuY2xvbmUoKTtcblx0XHRcdC8vdHVybiBvZmYgYXV0byBjYWxjdWxhdGlvbnMgb24gdGhlIG1vcnBoZWQgZ2VvbWV0cnlcblx0XHRcdHRhcmdldFN1Ykdlb21ldHJ5LmF1dG9EZXJpdmVOb3JtYWxzID0gZmFsc2U7XG5cdFx0XHR0YXJnZXRTdWJHZW9tZXRyeS5hdXRvRGVyaXZlVGFuZ2VudHMgPSBmYWxzZTtcblx0XHRcdHRhcmdldFN1Ykdlb21ldHJ5LmF1dG9EZXJpdmVVVnMgPSBmYWxzZTtcblx0XHRcdC8vYWRkIGV2ZW50IGxpc3RlbmVycyBmb3IgYW55IGNoYW5nZXMgaW4gVVYgdmFsdWVzIG9uIHRoZSBzb3VyY2UgZ2VvbWV0cnlcblx0XHRcdHNvdXJjZVN1Ykdlb21ldHJ5LmFkZEV2ZW50TGlzdGVuZXIoU3ViR2VvbWV0cnlFdmVudC5JTkRJQ0VTX1VQREFURUQsIHRoaXMuX29uSW5kaWNlc1VwZGF0ZURlbGVnYXRlKTtcblx0XHRcdHNvdXJjZVN1Ykdlb21ldHJ5LmFkZEV2ZW50TGlzdGVuZXIoU3ViR2VvbWV0cnlFdmVudC5WRVJUSUNFU19VUERBVEVELCB0aGlzLl9vblZlcnRpY2VzVXBkYXRlRGVsZWdhdGUpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0YXJnZXRTdWJHZW9tZXRyeTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJZiB0aGUgYW5pbWF0aW9uIGNhbid0IGJlIHBlcmZvcm1lZCBvbiBHUFUsIHRyYW5zZm9ybSB2ZXJ0aWNlcyBtYW51YWxseVxuXHQgKiBAcGFyYW0gc3ViR2VvbSBUaGUgc3ViZ2VvbWV0cnkgY29udGFpbmluZyB0aGUgd2VpZ2h0cyBhbmQgam9pbnQgaW5kZXggZGF0YSBwZXIgdmVydGV4LlxuXHQgKiBAcGFyYW0gcGFzcyBUaGUgbWF0ZXJpYWwgcGFzcyBmb3Igd2hpY2ggd2UgbmVlZCB0byB0cmFuc2Zvcm0gdGhlIHZlcnRpY2VzXG5cdCAqL1xuXHRwdWJsaWMgbW9ycGhTdWJHZW9tZXRyeShyZW5kZXJhYmxlOlRyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGUsIHNvdXJjZVN1Ykdlb21ldHJ5OlRyaWFuZ2xlU3ViR2VvbWV0cnkpXG5cdHtcblx0XHR0aGlzLl9tb3JwaGVkU3ViR2VvbWV0cnlEaXJ0eVtzb3VyY2VTdWJHZW9tZXRyeS5pZF0gPSBmYWxzZTtcblxuXHRcdHZhciBzb3VyY2VQb3NpdGlvbnM6QXJyYXk8bnVtYmVyPiA9IHNvdXJjZVN1Ykdlb21ldHJ5LnBvc2l0aW9ucztcblx0XHR2YXIgc291cmNlTm9ybWFsczpBcnJheTxudW1iZXI+ID0gc291cmNlU3ViR2VvbWV0cnkudmVydGV4Tm9ybWFscztcblx0XHR2YXIgc291cmNlVGFuZ2VudHM6QXJyYXk8bnVtYmVyPiA9IHNvdXJjZVN1Ykdlb21ldHJ5LnZlcnRleFRhbmdlbnRzO1xuXG5cdFx0dmFyIGpvaW50SW5kaWNlczpBcnJheTxudW1iZXI+ID0gc291cmNlU3ViR2VvbWV0cnkuam9pbnRJbmRpY2VzO1xuXHRcdHZhciBqb2ludFdlaWdodHM6QXJyYXk8bnVtYmVyPiA9IHNvdXJjZVN1Ykdlb21ldHJ5LmpvaW50V2VpZ2h0cztcblxuXHRcdHZhciB0YXJnZXRTdWJHZW9tZXRyeSA9IHRoaXMuX21vcnBoZWRTdWJHZW9tZXRyeVtzb3VyY2VTdWJHZW9tZXRyeS5pZF07XG5cblx0XHR2YXIgdGFyZ2V0UG9zaXRpb25zOkFycmF5PG51bWJlcj4gPSB0YXJnZXRTdWJHZW9tZXRyeS5wb3NpdGlvbnM7XG5cdFx0dmFyIHRhcmdldE5vcm1hbHM6QXJyYXk8bnVtYmVyPiA9IHRhcmdldFN1Ykdlb21ldHJ5LnZlcnRleE5vcm1hbHM7XG5cdFx0dmFyIHRhcmdldFRhbmdlbnRzOkFycmF5PG51bWJlcj4gPSB0YXJnZXRTdWJHZW9tZXRyeS52ZXJ0ZXhUYW5nZW50cztcblxuXHRcdHZhciBpbmRleDpudW1iZXIgLyp1aW50Ki8gPSAwO1xuXHRcdHZhciBqOm51bWJlciAvKnVpbnQqLyA9IDA7XG5cdFx0dmFyIGs6bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciB2eDpudW1iZXIsIHZ5Om51bWJlciwgdno6bnVtYmVyO1xuXHRcdHZhciBueDpudW1iZXIsIG55Om51bWJlciwgbno6bnVtYmVyO1xuXHRcdHZhciB0eDpudW1iZXIsIHR5Om51bWJlciwgdHo6bnVtYmVyO1xuXHRcdHZhciBsZW46bnVtYmVyIC8qaW50Ki8gPSBzb3VyY2VQb3NpdGlvbnMubGVuZ3RoO1xuXHRcdHZhciB3ZWlnaHQ6bnVtYmVyO1xuXHRcdHZhciB2ZXJ0WDpudW1iZXIsIHZlcnRZOm51bWJlciwgdmVydFo6bnVtYmVyO1xuXHRcdHZhciBub3JtWDpudW1iZXIsIG5vcm1ZOm51bWJlciwgbm9ybVo6bnVtYmVyO1xuXHRcdHZhciB0YW5nWDpudW1iZXIsIHRhbmdZOm51bWJlciwgdGFuZ1o6bnVtYmVyO1xuXHRcdHZhciBtMTE6bnVtYmVyLCBtMTI6bnVtYmVyLCBtMTM6bnVtYmVyLCBtMTQ6bnVtYmVyO1xuXHRcdHZhciBtMjE6bnVtYmVyLCBtMjI6bnVtYmVyLCBtMjM6bnVtYmVyLCBtMjQ6bnVtYmVyO1xuXHRcdHZhciBtMzE6bnVtYmVyLCBtMzI6bnVtYmVyLCBtMzM6bnVtYmVyLCBtMzQ6bnVtYmVyO1xuXG5cdFx0d2hpbGUgKGluZGV4IDwgbGVuKSB7XG5cdFx0XHR2ZXJ0WCA9IHNvdXJjZVBvc2l0aW9uc1tpbmRleF07XG5cdFx0XHR2ZXJ0WSA9IHNvdXJjZVBvc2l0aW9uc1tpbmRleCArIDFdO1xuXHRcdFx0dmVydFogPSBzb3VyY2VQb3NpdGlvbnNbaW5kZXggKyAyXTtcblx0XHRcdG5vcm1YID0gc291cmNlTm9ybWFsc1tpbmRleF07XG5cdFx0XHRub3JtWSA9IHNvdXJjZU5vcm1hbHNbaW5kZXggKyAxXTtcblx0XHRcdG5vcm1aID0gc291cmNlTm9ybWFsc1tpbmRleCArIDJdO1xuXHRcdFx0dGFuZ1ggPSBzb3VyY2VUYW5nZW50c1tpbmRleF07XG5cdFx0XHR0YW5nWSA9IHNvdXJjZVRhbmdlbnRzW2luZGV4ICsgMV07XG5cdFx0XHR0YW5nWiA9IHNvdXJjZVRhbmdlbnRzW2luZGV4ICsgMl07XG5cdFx0XHR2eCA9IDA7XG5cdFx0XHR2eSA9IDA7XG5cdFx0XHR2eiA9IDA7XG5cdFx0XHRueCA9IDA7XG5cdFx0XHRueSA9IDA7XG5cdFx0XHRueiA9IDA7XG5cdFx0XHR0eCA9IDA7XG5cdFx0XHR0eSA9IDA7XG5cdFx0XHR0eiA9IDA7XG5cdFx0XHRrID0gMDtcblx0XHRcdHdoaWxlIChrIDwgdGhpcy5fam9pbnRzUGVyVmVydGV4KSB7XG5cdFx0XHRcdHdlaWdodCA9IGpvaW50V2VpZ2h0c1tqXTtcblx0XHRcdFx0aWYgKHdlaWdodCA+IDApIHtcblx0XHRcdFx0XHQvLyBpbXBsaWNpdCAvMyoxMiAoLzMgYmVjYXVzZSBpbmRpY2VzIGFyZSBtdWx0aXBsaWVkIGJ5IDMgZm9yIGdwdSBtYXRyaXggYWNjZXNzLCAqMTIgYmVjYXVzZSBpdCdzIHRoZSBtYXRyaXggc2l6ZSlcblx0XHRcdFx0XHR2YXIgbXR4T2Zmc2V0Om51bWJlciAvKnVpbnQqLyA9IGpvaW50SW5kaWNlc1tqKytdIDw8IDI7XG5cdFx0XHRcdFx0bTExID0gdGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0XTtcblx0XHRcdFx0XHRtMTIgPSB0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyAxXTtcblx0XHRcdFx0XHRtMTMgPSB0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyAyXTtcblx0XHRcdFx0XHRtMTQgPSB0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyAzXTtcblx0XHRcdFx0XHRtMjEgPSB0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyA0XTtcblx0XHRcdFx0XHRtMjIgPSB0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyA1XTtcblx0XHRcdFx0XHRtMjMgPSB0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyA2XTtcblx0XHRcdFx0XHRtMjQgPSB0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyA3XTtcblx0XHRcdFx0XHRtMzEgPSB0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyA4XTtcblx0XHRcdFx0XHRtMzIgPSB0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyA5XTtcblx0XHRcdFx0XHRtMzMgPSB0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyAxMF07XG5cdFx0XHRcdFx0bTM0ID0gdGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgMTFdO1xuXHRcdFx0XHRcdHZ4ICs9IHdlaWdodCoobTExKnZlcnRYICsgbTEyKnZlcnRZICsgbTEzKnZlcnRaICsgbTE0KTtcblx0XHRcdFx0XHR2eSArPSB3ZWlnaHQqKG0yMSp2ZXJ0WCArIG0yMip2ZXJ0WSArIG0yMyp2ZXJ0WiArIG0yNCk7XG5cdFx0XHRcdFx0dnogKz0gd2VpZ2h0KihtMzEqdmVydFggKyBtMzIqdmVydFkgKyBtMzMqdmVydFogKyBtMzQpO1xuXHRcdFx0XHRcdG54ICs9IHdlaWdodCoobTExKm5vcm1YICsgbTEyKm5vcm1ZICsgbTEzKm5vcm1aKTtcblx0XHRcdFx0XHRueSArPSB3ZWlnaHQqKG0yMSpub3JtWCArIG0yMipub3JtWSArIG0yMypub3JtWik7XG5cdFx0XHRcdFx0bnogKz0gd2VpZ2h0KihtMzEqbm9ybVggKyBtMzIqbm9ybVkgKyBtMzMqbm9ybVopO1xuXHRcdFx0XHRcdHR4ICs9IHdlaWdodCoobTExKnRhbmdYICsgbTEyKnRhbmdZICsgbTEzKnRhbmdaKTtcblx0XHRcdFx0XHR0eSArPSB3ZWlnaHQqKG0yMSp0YW5nWCArIG0yMip0YW5nWSArIG0yMyp0YW5nWik7XG5cdFx0XHRcdFx0dHogKz0gd2VpZ2h0KihtMzEqdGFuZ1ggKyBtMzIqdGFuZ1kgKyBtMzMqdGFuZ1opO1xuXHRcdFx0XHRcdCsraztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRqICs9ICh0aGlzLl9qb2ludHNQZXJWZXJ0ZXggLSBrKTtcblx0XHRcdFx0XHRrID0gdGhpcy5fam9pbnRzUGVyVmVydGV4O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHRhcmdldFBvc2l0aW9uc1tpbmRleF0gPSB2eDtcblx0XHRcdHRhcmdldFBvc2l0aW9uc1tpbmRleCArIDFdID0gdnk7XG5cdFx0XHR0YXJnZXRQb3NpdGlvbnNbaW5kZXggKyAyXSA9IHZ6O1xuXHRcdFx0dGFyZ2V0Tm9ybWFsc1tpbmRleF0gPSBueDtcblx0XHRcdHRhcmdldE5vcm1hbHNbaW5kZXggKyAxXSA9IG55O1xuXHRcdFx0dGFyZ2V0Tm9ybWFsc1tpbmRleCArIDJdID0gbno7XG5cdFx0XHR0YXJnZXRUYW5nZW50c1tpbmRleF0gPSB0eDtcblx0XHRcdHRhcmdldFRhbmdlbnRzW2luZGV4ICsgMV0gPSB0eTtcblx0XHRcdHRhcmdldFRhbmdlbnRzW2luZGV4ICsgMl0gPSB0ejtcblxuXHRcdFx0aW5kZXggKz0gMztcblx0XHR9XG5cblx0XHR0YXJnZXRTdWJHZW9tZXRyeS51cGRhdGVQb3NpdGlvbnModGFyZ2V0UG9zaXRpb25zKTtcblx0XHR0YXJnZXRTdWJHZW9tZXRyeS51cGRhdGVWZXJ0ZXhOb3JtYWxzKHRhcmdldE5vcm1hbHMpO1xuXHRcdHRhcmdldFN1Ykdlb21ldHJ5LnVwZGF0ZVZlcnRleFRhbmdlbnRzKHRhcmdldFRhbmdlbnRzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIGxvY2FsIGhpZXJhcmNoaWNhbCBza2VsZXRvbiBwb3NlIHRvIGEgZ2xvYmFsIHBvc2Vcblx0ICogQHBhcmFtIHRhcmdldFBvc2UgVGhlIFNrZWxldG9uUG9zZSBvYmplY3QgdGhhdCB3aWxsIGNvbnRhaW4gdGhlIGdsb2JhbCBwb3NlLlxuXHQgKiBAcGFyYW0gc2tlbGV0b24gVGhlIHNrZWxldG9uIGNvbnRhaW5pbmcgdGhlIGpvaW50cywgYW5kIGFzIHN1Y2gsIHRoZSBoaWVyYXJjaGljYWwgZGF0YSB0byB0cmFuc2Zvcm0gdG8gZ2xvYmFsIHBvc2VzLlxuXHQgKi9cblx0cHJpdmF0ZSBsb2NhbFRvR2xvYmFsUG9zZShzb3VyY2VQb3NlOlNrZWxldG9uUG9zZSwgdGFyZ2V0UG9zZTpTa2VsZXRvblBvc2UsIHNrZWxldG9uOlNrZWxldG9uKVxuXHR7XG5cdFx0dmFyIGdsb2JhbFBvc2VzOkFycmF5PEpvaW50UG9zZT4gPSB0YXJnZXRQb3NlLmpvaW50UG9zZXM7XG5cdFx0dmFyIGdsb2JhbEpvaW50UG9zZTpKb2ludFBvc2U7XG5cdFx0dmFyIGpvaW50czpBcnJheTxTa2VsZXRvbkpvaW50PiA9IHNrZWxldG9uLmpvaW50cztcblx0XHR2YXIgbGVuOm51bWJlciAvKnVpbnQqLyA9IHNvdXJjZVBvc2UubnVtSm9pbnRQb3Nlcztcblx0XHR2YXIgam9pbnRQb3NlczpBcnJheTxKb2ludFBvc2U+ID0gc291cmNlUG9zZS5qb2ludFBvc2VzO1xuXHRcdHZhciBwYXJlbnRJbmRleDpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgam9pbnQ6U2tlbGV0b25Kb2ludDtcblx0XHR2YXIgcGFyZW50UG9zZTpKb2ludFBvc2U7XG5cdFx0dmFyIHBvc2U6Sm9pbnRQb3NlO1xuXHRcdHZhciBvcjpRdWF0ZXJuaW9uO1xuXHRcdHZhciB0cjpWZWN0b3IzRDtcblx0XHR2YXIgdDpWZWN0b3IzRDtcblx0XHR2YXIgcTpRdWF0ZXJuaW9uO1xuXG5cdFx0dmFyIHgxOm51bWJlciwgeTE6bnVtYmVyLCB6MTpudW1iZXIsIHcxOm51bWJlcjtcblx0XHR2YXIgeDI6bnVtYmVyLCB5MjpudW1iZXIsIHoyOm51bWJlciwgdzI6bnVtYmVyO1xuXHRcdHZhciB4MzpudW1iZXIsIHkzOm51bWJlciwgejM6bnVtYmVyO1xuXG5cdFx0Ly8gOnNcblx0XHRpZiAoZ2xvYmFsUG9zZXMubGVuZ3RoICE9IGxlbilcblx0XHRcdGdsb2JhbFBvc2VzLmxlbmd0aCA9IGxlbjtcblxuXHRcdGZvciAodmFyIGk6bnVtYmVyIC8qdWludCovID0gMDsgaSA8IGxlbjsgKytpKSB7XG5cdFx0XHRnbG9iYWxKb2ludFBvc2UgPSBnbG9iYWxQb3Nlc1tpXTtcblxuXHRcdFx0aWYgKGdsb2JhbEpvaW50UG9zZSA9PSBudWxsKVxuXHRcdFx0XHRnbG9iYWxKb2ludFBvc2UgPSBnbG9iYWxQb3Nlc1tpXSA9IG5ldyBKb2ludFBvc2UoKTtcblxuXHRcdFx0am9pbnQgPSBqb2ludHNbaV07XG5cdFx0XHRwYXJlbnRJbmRleCA9IGpvaW50LnBhcmVudEluZGV4O1xuXHRcdFx0cG9zZSA9IGpvaW50UG9zZXNbaV07XG5cblx0XHRcdHEgPSBnbG9iYWxKb2ludFBvc2Uub3JpZW50YXRpb247XG5cdFx0XHR0ID0gZ2xvYmFsSm9pbnRQb3NlLnRyYW5zbGF0aW9uO1xuXG5cdFx0XHRpZiAocGFyZW50SW5kZXggPCAwKSB7XG5cdFx0XHRcdHRyID0gcG9zZS50cmFuc2xhdGlvbjtcblx0XHRcdFx0b3IgPSBwb3NlLm9yaWVudGF0aW9uO1xuXHRcdFx0XHRxLnggPSBvci54O1xuXHRcdFx0XHRxLnkgPSBvci55O1xuXHRcdFx0XHRxLnogPSBvci56O1xuXHRcdFx0XHRxLncgPSBvci53O1xuXHRcdFx0XHR0LnggPSB0ci54O1xuXHRcdFx0XHR0LnkgPSB0ci55O1xuXHRcdFx0XHR0LnogPSB0ci56O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gYXBwZW5kIHBhcmVudCBwb3NlXG5cdFx0XHRcdHBhcmVudFBvc2UgPSBnbG9iYWxQb3Nlc1twYXJlbnRJbmRleF07XG5cblx0XHRcdFx0Ly8gcm90YXRlIHBvaW50XG5cdFx0XHRcdG9yID0gcGFyZW50UG9zZS5vcmllbnRhdGlvbjtcblx0XHRcdFx0dHIgPSBwb3NlLnRyYW5zbGF0aW9uO1xuXHRcdFx0XHR4MiA9IG9yLng7XG5cdFx0XHRcdHkyID0gb3IueTtcblx0XHRcdFx0ejIgPSBvci56O1xuXHRcdFx0XHR3MiA9IG9yLnc7XG5cdFx0XHRcdHgzID0gdHIueDtcblx0XHRcdFx0eTMgPSB0ci55O1xuXHRcdFx0XHR6MyA9IHRyLno7XG5cblx0XHRcdFx0dzEgPSAteDIqeDMgLSB5Mip5MyAtIHoyKnozO1xuXHRcdFx0XHR4MSA9IHcyKngzICsgeTIqejMgLSB6Mip5Mztcblx0XHRcdFx0eTEgPSB3Mip5MyAtIHgyKnozICsgejIqeDM7XG5cdFx0XHRcdHoxID0gdzIqejMgKyB4Mip5MyAtIHkyKngzO1xuXG5cdFx0XHRcdC8vIGFwcGVuZCBwYXJlbnQgdHJhbnNsYXRpb25cblx0XHRcdFx0dHIgPSBwYXJlbnRQb3NlLnRyYW5zbGF0aW9uO1xuXHRcdFx0XHR0LnggPSAtdzEqeDIgKyB4MSp3MiAtIHkxKnoyICsgejEqeTIgKyB0ci54O1xuXHRcdFx0XHR0LnkgPSAtdzEqeTIgKyB4MSp6MiArIHkxKncyIC0gejEqeDIgKyB0ci55O1xuXHRcdFx0XHR0LnogPSAtdzEqejIgLSB4MSp5MiArIHkxKngyICsgejEqdzIgKyB0ci56O1xuXG5cdFx0XHRcdC8vIGFwcGVuZCBwYXJlbnQgb3JpZW50YXRpb25cblx0XHRcdFx0eDEgPSBvci54O1xuXHRcdFx0XHR5MSA9IG9yLnk7XG5cdFx0XHRcdHoxID0gb3Iuejtcblx0XHRcdFx0dzEgPSBvci53O1xuXHRcdFx0XHRvciA9IHBvc2Uub3JpZW50YXRpb247XG5cdFx0XHRcdHgyID0gb3IueDtcblx0XHRcdFx0eTIgPSBvci55O1xuXHRcdFx0XHR6MiA9IG9yLno7XG5cdFx0XHRcdHcyID0gb3IudztcblxuXHRcdFx0XHRxLncgPSB3MSp3MiAtIHgxKngyIC0geTEqeTIgLSB6MSp6Mjtcblx0XHRcdFx0cS54ID0gdzEqeDIgKyB4MSp3MiArIHkxKnoyIC0gejEqeTI7XG5cdFx0XHRcdHEueSA9IHcxKnkyIC0geDEqejIgKyB5MSp3MiArIHoxKngyO1xuXHRcdFx0XHRxLnogPSB3MSp6MiArIHgxKnkyIC0geTEqeDIgKyB6MSp3Mjtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIG9uVHJhbnNpdGlvbkNvbXBsZXRlKGV2ZW50OkFuaW1hdGlvblN0YXRlRXZlbnQpXG5cdHtcblx0XHRpZiAoZXZlbnQudHlwZSA9PSBBbmltYXRpb25TdGF0ZUV2ZW50LlRSQU5TSVRJT05fQ09NUExFVEUpIHtcblx0XHRcdGV2ZW50LmFuaW1hdGlvbk5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihBbmltYXRpb25TdGF0ZUV2ZW50LlRSQU5TSVRJT05fQ09NUExFVEUsIHRoaXMuX29uVHJhbnNpdGlvbkNvbXBsZXRlRGVsZWdhdGUpO1xuXHRcdFx0Ly9pZiB0aGlzIGlzIHRoZSBjdXJyZW50IGFjdGl2ZSBzdGF0ZSB0cmFuc2l0aW9uLCByZXZlcnQgY29udHJvbCB0byB0aGUgYWN0aXZlIG5vZGVcblx0XHRcdGlmICh0aGlzLl9wQWN0aXZlU3RhdGUgPT0gZXZlbnQuYW5pbWF0aW9uU3RhdGUpIHtcblx0XHRcdFx0dGhpcy5fcEFjdGl2ZU5vZGUgPSB0aGlzLl9wQW5pbWF0aW9uU2V0LmdldEFuaW1hdGlvbih0aGlzLl9wQWN0aXZlQW5pbWF0aW9uTmFtZSk7XG5cdFx0XHRcdHRoaXMuX3BBY3RpdmVTdGF0ZSA9IHRoaXMuZ2V0QW5pbWF0aW9uU3RhdGUodGhpcy5fcEFjdGl2ZU5vZGUpO1xuXHRcdFx0XHR0aGlzLl9hY3RpdmVTa2VsZXRvblN0YXRlID0gPElTa2VsZXRvbkFuaW1hdGlvblN0YXRlPiB0aGlzLl9wQWN0aXZlU3RhdGU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBvbkluZGljZXNVcGRhdGUoZXZlbnQ6U3ViR2VvbWV0cnlFdmVudClcblx0e1xuXHRcdHZhciBzdWJHZW9tZXRyeTpUcmlhbmdsZVN1Ykdlb21ldHJ5ID0gPFRyaWFuZ2xlU3ViR2VvbWV0cnk+IGV2ZW50LnRhcmdldDtcblxuXHRcdCg8VHJpYW5nbGVTdWJHZW9tZXRyeT4gdGhpcy5fbW9ycGhlZFN1Ykdlb21ldHJ5W3N1Ykdlb21ldHJ5LmlkXSkudXBkYXRlSW5kaWNlcyhzdWJHZW9tZXRyeS5pbmRpY2VzKTtcblx0fVxuXG5cdHByaXZhdGUgb25WZXJ0aWNlc1VwZGF0ZShldmVudDpTdWJHZW9tZXRyeUV2ZW50KVxuXHR7XG5cdFx0dmFyIHN1Ykdlb21ldHJ5OlRyaWFuZ2xlU3ViR2VvbWV0cnkgPSA8VHJpYW5nbGVTdWJHZW9tZXRyeT4gZXZlbnQudGFyZ2V0O1xuXHRcdHZhciBtb3JwaEdlb21ldHJ5OlRyaWFuZ2xlU3ViR2VvbWV0cnkgPSA8VHJpYW5nbGVTdWJHZW9tZXRyeT4gdGhpcy5fbW9ycGhlZFN1Ykdlb21ldHJ5W3N1Ykdlb21ldHJ5LmlkXTtcblxuXHRcdHN3aXRjaChldmVudC5kYXRhVHlwZSkge1xuXHRcdFx0Y2FzZSBUcmlhbmdsZVN1Ykdlb21ldHJ5LlVWX0RBVEE6XG5cdFx0XHRcdG1vcnBoR2VvbWV0cnkudXBkYXRlVVZzKHN1Ykdlb21ldHJ5LnV2cyk7XG5cdFx0XHRjYXNlIFRyaWFuZ2xlU3ViR2VvbWV0cnkuU0VDT05EQVJZX1VWX0RBVEE6XG5cdFx0XHRcdG1vcnBoR2VvbWV0cnkudXBkYXRlVVZzKHN1Ykdlb21ldHJ5LnNlY29uZGFyeVVWcyk7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCA9IFNrZWxldG9uQW5pbWF0b3I7Il19