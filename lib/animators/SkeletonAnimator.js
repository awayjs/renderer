var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var SubGeometryEvent = require("awayjs-display/lib/events/SubGeometryEvent");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
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
        stage.activateBuffer(vertexStreamOffset, renderable.getVertexData(TriangleSubGeometry.JOINT_INDEX_DATA), renderable.getVertexOffset(TriangleSubGeometry.JOINT_INDEX_DATA), renderable.JOINT_INDEX_FORMAT);
        stage.activateBuffer(vertexStreamOffset + 1, renderable.getVertexData(TriangleSubGeometry.JOINT_WEIGHT_DATA), renderable.getVertexOffset(TriangleSubGeometry.JOINT_WEIGHT_DATA), renderable.JOINT_WEIGHT_FORMAT);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc2tlbGV0b25hbmltYXRvci50cyJdLCJuYW1lcyI6WyJTa2VsZXRvbkFuaW1hdG9yIiwiU2tlbGV0b25BbmltYXRvci5jb25zdHJ1Y3RvciIsIlNrZWxldG9uQW5pbWF0b3IuZ2xvYmFsTWF0cmljZXMiLCJTa2VsZXRvbkFuaW1hdG9yLmdsb2JhbFBvc2UiLCJTa2VsZXRvbkFuaW1hdG9yLnNrZWxldG9uIiwiU2tlbGV0b25BbmltYXRvci5mb3JjZUNQVSIsIlNrZWxldG9uQW5pbWF0b3IudXNlQ29uZGVuc2VkSW5kaWNlcyIsIlNrZWxldG9uQW5pbWF0b3IuY2xvbmUiLCJTa2VsZXRvbkFuaW1hdG9yLnBsYXkiLCJTa2VsZXRvbkFuaW1hdG9yLnNldFJlbmRlclN0YXRlIiwiU2tlbGV0b25BbmltYXRvci50ZXN0R1BVQ29tcGF0aWJpbGl0eSIsIlNrZWxldG9uQW5pbWF0b3IuX3BVcGRhdGVEZWx0YVRpbWUiLCJTa2VsZXRvbkFuaW1hdG9yLnVwZGF0ZUNvbmRlbnNlZE1hdHJpY2VzIiwiU2tlbGV0b25BbmltYXRvci51cGRhdGVHbG9iYWxQcm9wZXJ0aWVzIiwiU2tlbGV0b25BbmltYXRvci5nZXRSZW5kZXJhYmxlU3ViR2VvbWV0cnkiLCJTa2VsZXRvbkFuaW1hdG9yLm1vcnBoU3ViR2VvbWV0cnkiLCJTa2VsZXRvbkFuaW1hdG9yLmxvY2FsVG9HbG9iYWxQb3NlIiwiU2tlbGV0b25BbmltYXRvci5vblRyYW5zaXRpb25Db21wbGV0ZSIsIlNrZWxldG9uQW5pbWF0b3Iub25JbmRpY2VzVXBkYXRlIiwiU2tlbGV0b25BbmltYXRvci5vblZlcnRpY2VzVXBkYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFJQSxJQUFPLG1CQUFtQixXQUFjLDZDQUE2QyxDQUFDLENBQUM7QUFHdkYsSUFBTyxnQkFBZ0IsV0FBZSw0Q0FBNEMsQ0FBQyxDQUFDO0FBRXBGLElBQU8sb0JBQW9CLFdBQWMsOENBQThDLENBQUMsQ0FBQztBQUd6RixJQUFPLFlBQVksV0FBZ0IsOENBQThDLENBQUMsQ0FBQztBQUVuRixJQUFPLFNBQVMsV0FBZ0IsZ0RBQWdELENBQUMsQ0FBQztBQUdsRixJQUFPLFlBQVksV0FBZ0IsbURBQW1ELENBQUMsQ0FBQztBQUd4RixJQUFPLG1CQUFtQixXQUFjLGtEQUFrRCxDQUFDLENBQUM7QUFLNUYsQUFLQTs7OztHQURHO0lBQ0csZ0JBQWdCO0lBQVNBLFVBQXpCQSxnQkFBZ0JBLFVBQXFCQTtJQStFMUNBOzs7Ozs7T0FNR0E7SUFDSEEsU0F0RktBLGdCQUFnQkEsQ0FzRlRBLFlBQWlDQSxFQUFFQSxRQUFpQkEsRUFBRUEsUUFBd0JBO1FBdEYzRkMsaUJBcWxCQ0E7UUEvZmtFQSx3QkFBd0JBLEdBQXhCQSxnQkFBd0JBO1FBRXpGQSxrQkFBTUEsWUFBWUEsQ0FBQ0EsQ0FBQ0E7UUFyRmJBLGdCQUFXQSxHQUFnQkEsSUFBSUEsWUFBWUEsRUFBRUEsQ0FBQ0E7UUFHOUNBLHdCQUFtQkEsR0FBVUEsSUFBSUEsTUFBTUEsRUFBRUEsQ0FBQ0E7UUFDMUNBLDZCQUF3QkEsR0FBVUEsSUFBSUEsTUFBTUEsRUFBRUEsQ0FBQ0E7UUFtRnREQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDMUJBLElBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0EsWUFBWUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7UUFFckRBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBO1FBQzNDQSxJQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFTQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUU3REEsSUFBSUEsQ0FBQ0EsR0FBa0JBLENBQUNBLENBQUNBO1FBQ3pCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFtQkEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDMURBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQzlCQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUM5QkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDOUJBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQzlCQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUM5QkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDOUJBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQzlCQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUM5QkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDOUJBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQzlCQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUM5QkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDL0JBLENBQUNBO1FB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RUEsR0FBVUEsQ0FBQ0E7UUFDdkNBLElBQUlBLEdBQVVBLEVBQUVBLEdBQVVBLEVBQUVBLEdBQVVBLENBQUNBO1FBQ3ZDQSxJQUFJQSxHQUFVQSxFQUFFQSxHQUFVQSxFQUFFQSxHQUFVQSxFQUFFQSxHQUFVQSxDQUFDQTtRQUNuREEsSUFBSUEsR0FBVUEsRUFBRUEsR0FBVUEsRUFBRUEsR0FBVUEsRUFBRUEsR0FBVUEsQ0FBQ0E7UUFDbkRBLElBQUlBLEdBQVVBLEVBQUVBLEdBQVVBLEVBQUVBLEdBQVVBLEVBQUVBLEdBQVVBLENBQUNBO1FBQ25EQSxJQUFJQSxNQUFNQSxHQUF3QkEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDeERBLElBQUlBLElBQWNBLENBQUNBO1FBQ25CQSxJQUFJQSxJQUFlQSxDQUFDQTtRQUNwQkEsSUFBSUEsR0FBWUEsQ0FBQ0E7UUFDakJBLElBQUlBLENBQVFBLENBQUNBO1FBRWJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQW1CQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtZQUMxREEsSUFBSUEsR0FBR0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdEJBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO1lBQ3hCQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQTtZQUN2QkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDWkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDWkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDWkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFWkEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDdEJBLEdBQUdBLEdBQUdBLENBQUNBLEdBQUNBLEVBQUVBLENBQUNBO1lBQ1hBLEdBQUdBLEdBQUdBLENBQUNBLEdBQUNBLEVBQUVBLENBQUNBO1lBQ1hBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUNBLEVBQUVBLENBQUNBLEdBQUNBLEVBQUVBLENBQUNBO1lBQ3RCQSxHQUFHQSxHQUFHQSxDQUFDQSxHQUFDQSxFQUFFQSxDQUFDQTtZQUNYQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFDQSxFQUFFQSxHQUFDQSxFQUFFQSxDQUFDQTtZQUVoQkEsR0FBR0EsR0FBR0EsR0FBR0EsR0FBQ0EsRUFBRUEsR0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDaEJBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUNBLEVBQUVBLEdBQUNBLEVBQUVBLENBQUNBO1lBQ2hCQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFDQSxFQUFFQSxHQUFDQSxFQUFFQSxDQUFDQTtZQUNoQkEsRUFBRUEsSUFBSUEsRUFBRUEsQ0FBQ0E7WUFDVEEsRUFBRUEsSUFBSUEsRUFBRUEsQ0FBQ0E7WUFDVEEsRUFBRUEsSUFBSUEsRUFBRUEsQ0FBQ0E7WUFDVEEsRUFBRUEsSUFBSUEsRUFBRUEsQ0FBQ0E7WUFFVEEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDOUJBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBO1lBQ2hCQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQTtZQUNoQkEsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0E7WUFDaEJBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ25CQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQTtZQUNoQkEsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0E7WUFDaEJBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBO1lBQ2hCQSxHQUFHQSxHQUFHQSxDQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUV6QkEsQUFDQUEsNEJBRDRCQTtZQUM1QkEsR0FBR0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsZUFBZUEsQ0FBQ0E7WUFDaENBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2JBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2JBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2JBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO1lBQ2RBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2JBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2JBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2JBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO1lBQ2RBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2JBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2JBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO1lBQ2RBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO1lBRWRBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFNBQVNBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLENBQUNBO1lBQzlEQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxHQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFDQSxHQUFHQSxDQUFDQTtZQUNsRUEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsQ0FBQ0E7WUFDbEVBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFNBQVNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO1lBQzFFQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxHQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFDQSxHQUFHQSxDQUFDQTtZQUNsRUEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsQ0FBQ0E7WUFDbEVBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFNBQVNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLENBQUNBO1lBQ2xFQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFH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LGVBQWVBLENBQUNBLFNBQVNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO29CQUMxQ0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzFDQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDMUNBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFNBQVNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO29CQUMxQ0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzFDQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxTQUFTQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQTtvQkFDM0NBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFNBQVNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBO29CQUMzQ0EsRUFBRUEsSUFBSUEsTUFBTUEsR0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZEQSxFQUFFQSxJQUFJQSxNQUFNQSxHQUFDQSxDQUFDQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDdkRBLEVBQUVBLElBQUlBLE1BQU1BLEdBQUNBLENBQUNBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBO29CQUN2REEsRUFBRUEsSUFBSUEsTUFBTUEsR0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsR0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2pEQSxFQUFFQSxJQUFJQSxNQUFNQSxHQUFDQSxDQUFDQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxHQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtvQkFDakRBLEVBQUVBLElBQUlBLE1BQU1BLEdBQUNBLENBQUNBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUNBLEtBQUtBLENBQUNBLENBQUNBO29CQUNqREEsRUFBRUEsSUFBSUEsTUFBTUEsR0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsR0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2pEQSxFQUFFQSxJQUFJQSxNQUFNQSxHQUFDQSxDQUFDQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxHQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtvQkFDakRBLEVBQUVBLElBQUlBLE1BQU1BLEdBQUNBLENBQUNBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUNBLEtBQUtBLENBQUNBLENBQUNBO29CQUNqREEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ0xBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDUEEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDakNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0E7Z0JBQzNCQSxDQUFDQTtZQUNGQSxDQUFDQTtZQUVEQSxlQUFlQSxDQUFDQSxLQUFLQSxDQUFD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S0FBS0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbEJBLFdBQVdBLEdBQUdBLEtBQUtBLENBQUNBLFdBQVdBLENBQUNBO1lBQ2hDQSxJQUFJQSxHQUFHQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUVyQkEsQ0FBQ0EsR0FBR0EsZUFBZUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7WUFDaENBLENBQUNBLEdBQUdBLGVBQWVBLENBQUNBLFdBQVdBLENBQUNBO1lBRWhDQSxFQUFFQSxDQUFDQSxDQUFDQSxXQUFXQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDckJBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO2dCQUN0QkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7Z0JBQ3RCQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDWEEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1hBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNYQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDWEEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1hBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNYQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNaQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDUEEsQUFDQUEscUJBRHFCQTtnQkFDckJBLFVBQVVBLEdBQUdBLFdBQVdBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBO2dCQUV0Q0EsQUFDQUEsZUFEZUE7Z0JBQ2ZBLEVBQUVBLEdBQUdBLFVBQVVBLENBQUNBLFdBQVdBLENBQUNBO2dCQUM1QkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7Z0JBQ3RCQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDVkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1ZBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNWQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDVkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1ZBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNWQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFFVkEsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsQ0FBQ0E7Z0JBQzVCQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxDQUFDQTtnQkFDM0JBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLENBQUNBO2dCQUMzQkEsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsQ0FBQ0E7Z0JBRTNCQSxBQUNBQSw0QkFENEJBO2dCQUM1QkEsRUFBRUEsR0FBR0EsVUFBVUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7Z0JBQzVCQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDNUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUM1Q0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRTVDQSxBQUNBQSw0QkFENEJBO2dCQUM1QkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1ZBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNWQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDVkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1ZBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO2dCQUN0QkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1ZBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNWQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDVkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRVZBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVB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IiwiZmlsZSI6ImFuaW1hdG9ycy9Ta2VsZXRvbkFuaW1hdG9yLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBRdWF0ZXJuaW9uXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vUXVhdGVybmlvblwiKTtcbmltcG9ydCBWZWN0b3IzRFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIik7XG5cbmltcG9ydCBJU3ViTWVzaFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvSVN1Yk1lc2hcIik7XG5pbXBvcnQgVHJpYW5nbGVTdWJHZW9tZXRyeVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvVHJpYW5nbGVTdWJHZW9tZXRyeVwiKTtcbmltcG9ydCBUcmlhbmdsZVN1Yk1lc2hcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvVHJpYW5nbGVTdWJNZXNoXCIpO1xuaW1wb3J0IENhbWVyYVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL0NhbWVyYVwiKTtcbmltcG9ydCBTdWJHZW9tZXRyeUV2ZW50XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9ldmVudHMvU3ViR2VvbWV0cnlFdmVudFwiKTtcblxuaW1wb3J0IENvbnRleHRHTFByb2dyYW1UeXBlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9Db250ZXh0R0xQcm9ncmFtVHlwZVwiKTtcbmltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIik7XG5cbmltcG9ydCBBbmltYXRvckJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL0FuaW1hdG9yQmFzZVwiKTtcbmltcG9ydCBTa2VsZXRvbkFuaW1hdGlvblNldFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9Ta2VsZXRvbkFuaW1hdGlvblNldFwiKTtcbmltcG9ydCBKb2ludFBvc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvSm9pbnRQb3NlXCIpO1xuaW1wb3J0IFNrZWxldG9uXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvU2tlbGV0b25cIik7XG5pbXBvcnQgU2tlbGV0b25Kb2ludFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvU2tlbGV0b25Kb2ludFwiKTtcbmltcG9ydCBTa2VsZXRvblBvc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvU2tlbGV0b25Qb3NlXCIpO1xuaW1wb3J0IElTa2VsZXRvbkFuaW1hdGlvblN0YXRlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9zdGF0ZXMvSVNrZWxldG9uQW5pbWF0aW9uU3RhdGVcIik7XG5pbXBvcnQgSUFuaW1hdGlvblRyYW5zaXRpb25cdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvdHJhbnNpdGlvbnMvSUFuaW1hdGlvblRyYW5zaXRpb25cIik7XG5pbXBvcnQgQW5pbWF0aW9uU3RhdGVFdmVudFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2V2ZW50cy9BbmltYXRpb25TdGF0ZUV2ZW50XCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFJlbmRlcmFibGVCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL1JlbmRlcmFibGVCYXNlXCIpO1xuaW1wb3J0IFRyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGVcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvVHJpYW5nbGVTdWJNZXNoUmVuZGVyYWJsZVwiKTtcblxuLyoqXG4gKiBQcm92aWRlcyBhbiBpbnRlcmZhY2UgZm9yIGFzc2lnbmluZyBza2VsZXRvbi1iYXNlZCBhbmltYXRpb24gZGF0YSBzZXRzIHRvIG1lc2gtYmFzZWQgZW50aXR5IG9iamVjdHNcbiAqIGFuZCBjb250cm9sbGluZyB0aGUgdmFyaW91cyBhdmFpbGFibGUgc3RhdGVzIG9mIGFuaW1hdGlvbiB0aHJvdWdoIGFuIGludGVyYXRpdmUgcGxheWhlYWQgdGhhdCBjYW4gYmVcbiAqIGF1dG9tYXRpY2FsbHkgdXBkYXRlZCBvciBtYW51YWxseSB0cmlnZ2VyZWQuXG4gKi9cbmNsYXNzIFNrZWxldG9uQW5pbWF0b3IgZXh0ZW5kcyBBbmltYXRvckJhc2Vcbntcblx0cHJpdmF0ZSBfZ2xvYmFsTWF0cmljZXM6QXJyYXk8bnVtYmVyPjtcblx0cHJpdmF0ZSBfZ2xvYmFsUG9zZTpTa2VsZXRvblBvc2UgPSBuZXcgU2tlbGV0b25Qb3NlKCk7XG5cdHByaXZhdGUgX2dsb2JhbFByb3BlcnRpZXNEaXJ0eTpib29sZWFuO1xuXHRwcml2YXRlIF9udW1Kb2ludHM6bnVtYmVyIC8qdWludCovO1xuXHRwcml2YXRlIF9tb3JwaGVkU3ViR2VvbWV0cnk6T2JqZWN0ID0gbmV3IE9iamVjdCgpO1xuXHRwcml2YXRlIF9tb3JwaGVkU3ViR2VvbWV0cnlEaXJ0eTpPYmplY3QgPSBuZXcgT2JqZWN0KCk7XG5cdHByaXZhdGUgX2NvbmRlbnNlZE1hdHJpY2VzOkFycmF5PG51bWJlcj47XG5cblx0cHJpdmF0ZSBfc2tlbGV0b246U2tlbGV0b247XG5cdHByaXZhdGUgX2ZvcmNlQ1BVOmJvb2xlYW47XG5cdHByaXZhdGUgX3VzZUNvbmRlbnNlZEluZGljZXM6Ym9vbGVhbjtcblx0cHJpdmF0ZSBfam9pbnRzUGVyVmVydGV4Om51bWJlciAvKnVpbnQqLztcblx0cHJpdmF0ZSBfYWN0aXZlU2tlbGV0b25TdGF0ZTpJU2tlbGV0b25BbmltYXRpb25TdGF0ZTtcblx0cHJpdmF0ZSBfb25UcmFuc2l0aW9uQ29tcGxldGVEZWxlZ2F0ZTooZXZlbnQ6QW5pbWF0aW9uU3RhdGVFdmVudCkgPT4gdm9pZDtcblxuXHRwcml2YXRlIF9vbkluZGljZXNVcGRhdGVEZWxlZ2F0ZTooZXZlbnQ6U3ViR2VvbWV0cnlFdmVudCkgPT4gdm9pZDtcblx0cHJpdmF0ZSBfb25WZXJ0aWNlc1VwZGF0ZURlbGVnYXRlOihldmVudDpTdWJHZW9tZXRyeUV2ZW50KSA9PiB2b2lkO1xuXG5cdC8qKlxuXHQgKiByZXR1cm5zIHRoZSBjYWxjdWxhdGVkIGdsb2JhbCBtYXRyaWNlcyBvZiB0aGUgY3VycmVudCBza2VsZXRvbiBwb3NlLlxuXHQgKlxuXHQgKiBAc2VlICNnbG9iYWxQb3NlXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGdsb2JhbE1hdHJpY2VzKCk6QXJyYXk8bnVtYmVyPlxuXHR7XG5cdFx0aWYgKHRoaXMuX2dsb2JhbFByb3BlcnRpZXNEaXJ0eSlcblx0XHRcdHRoaXMudXBkYXRlR2xvYmFsUHJvcGVydGllcygpO1xuXG5cdFx0cmV0dXJuIHRoaXMuX2dsb2JhbE1hdHJpY2VzO1xuXHR9XG5cblx0LyoqXG5cdCAqIHJldHVybnMgdGhlIGN1cnJlbnQgc2tlbGV0b24gcG9zZSBvdXRwdXQgZnJvbSB0aGUgYW5pbWF0b3IuXG5cdCAqXG5cdCAqIEBzZWUgYXdheS5hbmltYXRvcnMuZGF0YS5Ta2VsZXRvblBvc2Vcblx0ICovXG5cdHB1YmxpYyBnZXQgZ2xvYmFsUG9zZSgpOlNrZWxldG9uUG9zZVxuXHR7XG5cdFx0aWYgKHRoaXMuX2dsb2JhbFByb3BlcnRpZXNEaXJ0eSlcblx0XHRcdHRoaXMudXBkYXRlR2xvYmFsUHJvcGVydGllcygpO1xuXG5cdFx0cmV0dXJuIHRoaXMuX2dsb2JhbFBvc2U7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgc2tlbGV0b24gb2JqZWN0IGluIHVzZSBieSB0aGUgYW5pbWF0b3IgLSB0aGlzIGRlZmluZXMgdGhlIG51bWJlciBhbmQgaGVpcmFyY2h5IG9mIGpvaW50cyB1c2VkIGJ5IHRoZVxuXHQgKiBza2lubmVkIGdlb2VtdHJ5IHRvIHdoaWNoIHNrZWxlb24gYW5pbWF0b3IgaXMgYXBwbGllZC5cblx0ICovXG5cdHB1YmxpYyBnZXQgc2tlbGV0b24oKTpTa2VsZXRvblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3NrZWxldG9uO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBza2VsZXRvbiBhbmltYXRvciBpcyBkaXNhYmxlZCBieSBkZWZhdWx0IGZvciBHUFUgcmVuZGVyaW5nLCBzb21ldGhpbmcgdGhhdCBhbGxvd3MgdGhlIGFuaW1hdG9yIHRvIHBlcmZvcm0gY2FsY3VsYXRpb24gb24gdGhlIEdQVS5cblx0ICogRGVmYXVsdHMgdG8gZmFsc2UuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGZvcmNlQ1BVKCk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2ZvcmNlQ1BVO1xuXHR9XG5cblx0LyoqXG5cdCAqIE9mZmVycyB0aGUgb3B0aW9uIG9mIGVuYWJsaW5nIEdQVSBhY2NlbGVyYXRlZCBhbmltYXRpb24gb24gc2tlbGV0b25zIGxhcmdlciB0aGFuIDMyIGpvaW50c1xuXHQgKiBieSBjb25kZW5zaW5nIHRoZSBudW1iZXIgb2Ygam9pbnQgaW5kZXggdmFsdWVzIHJlcXVpcmVkIHBlciBtZXNoLiBPbmx5IGFwcGxpY2FibGUgdG9cblx0ICogc2tlbGV0b24gYW5pbWF0aW9ucyB0aGF0IHV0aWxpc2UgbW9yZSB0aGFuIG9uZSBtZXNoIG9iamVjdC4gRGVmYXVsdHMgdG8gZmFsc2UuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHVzZUNvbmRlbnNlZEluZGljZXMoKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fdXNlQ29uZGVuc2VkSW5kaWNlcztcblx0fVxuXG5cdHB1YmxpYyBzZXQgdXNlQ29uZGVuc2VkSW5kaWNlcyh2YWx1ZTpib29sZWFuKVxuXHR7XG5cdFx0dGhpcy5fdXNlQ29uZGVuc2VkSW5kaWNlcyA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgPGNvZGU+U2tlbGV0b25BbmltYXRvcjwvY29kZT4gb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gc2tlbGV0b25BbmltYXRpb25TZXQgVGhlIGFuaW1hdGlvbiBkYXRhIHNldCBjb250YWluaW5nIHRoZSBza2VsZXRvbiBhbmltYXRpb25zIHVzZWQgYnkgdGhlIGFuaW1hdG9yLlxuXHQgKiBAcGFyYW0gc2tlbGV0b24gVGhlIHNrZWxldG9uIG9iamVjdCB1c2VkIGZvciBjYWxjdWxhdGluZyB0aGUgcmVzdWx0aW5nIGdsb2JhbCBtYXRyaWNlcyBmb3IgdHJhbnNmb3JtaW5nIHNraW5uZWQgbWVzaCBkYXRhLlxuXHQgKiBAcGFyYW0gZm9yY2VDUFUgT3B0aW9uYWwgdmFsdWUgdGhhdCBvbmx5IGFsbG93cyB0aGUgYW5pbWF0b3IgdG8gcGVyZm9ybSBjYWxjdWxhdGlvbiBvbiB0aGUgQ1BVLiBEZWZhdWx0cyB0byBmYWxzZS5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGFuaW1hdGlvblNldDpTa2VsZXRvbkFuaW1hdGlvblNldCwgc2tlbGV0b246U2tlbGV0b24sIGZvcmNlQ1BVOmJvb2xlYW4gPSBmYWxzZSlcblx0e1xuXHRcdHN1cGVyKGFuaW1hdGlvblNldCk7XG5cblx0XHR0aGlzLl9za2VsZXRvbiA9IHNrZWxldG9uO1xuXHRcdHRoaXMuX2ZvcmNlQ1BVID0gZm9yY2VDUFU7XG5cdFx0dGhpcy5fam9pbnRzUGVyVmVydGV4ID0gYW5pbWF0aW9uU2V0LmpvaW50c1BlclZlcnRleDtcblxuXHRcdHRoaXMuX251bUpvaW50cyA9IHRoaXMuX3NrZWxldG9uLm51bUpvaW50cztcblx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlcyA9IG5ldyBBcnJheTxudW1iZXI+KHRoaXMuX251bUpvaW50cyoxMik7XG5cblx0XHR2YXIgajpudW1iZXIgLyppbnQqLyA9IDA7XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgLyp1aW50Ki8gPSAwOyBpIDwgdGhpcy5fbnVtSm9pbnRzOyArK2kpIHtcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW2orK10gPSAxO1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbaisrXSA9IDA7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1tqKytdID0gMDtcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW2orK10gPSAwO1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbaisrXSA9IDA7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1tqKytdID0gMTtcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW2orK10gPSAwO1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbaisrXSA9IDA7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1tqKytdID0gMDtcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW2orK10gPSAwO1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbaisrXSA9IDE7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1tqKytdID0gMDtcblx0XHR9XG5cblx0XHR0aGlzLl9vblRyYW5zaXRpb25Db21wbGV0ZURlbGVnYXRlID0gKGV2ZW50OkFuaW1hdGlvblN0YXRlRXZlbnQpID0+IHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUoZXZlbnQpO1xuXHRcdHRoaXMuX29uSW5kaWNlc1VwZGF0ZURlbGVnYXRlID0gKGV2ZW50OlN1Ykdlb21ldHJ5RXZlbnQpID0+IHRoaXMub25JbmRpY2VzVXBkYXRlKGV2ZW50KTtcblx0XHR0aGlzLl9vblZlcnRpY2VzVXBkYXRlRGVsZWdhdGUgPSAoZXZlbnQ6U3ViR2VvbWV0cnlFdmVudCkgPT4gdGhpcy5vblZlcnRpY2VzVXBkYXRlKGV2ZW50KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGNsb25lKCk6QW5pbWF0b3JCYXNlXG5cdHtcblx0XHQvKiBUaGUgY2FzdCB0byBTa2VsZXRvbkFuaW1hdGlvblNldCBzaG91bGQgbmV2ZXIgZmFpbCwgYXMgX2FuaW1hdGlvblNldCBjYW4gb25seSBiZSBzZXRcblx0XHQgdGhyb3VnaCB0aGUgY29uc3RydWN0b3IsIHdoaWNoIHdpbGwgb25seSBhY2NlcHQgYSBTa2VsZXRvbkFuaW1hdGlvblNldC4gKi9cblx0XHRyZXR1cm4gbmV3IFNrZWxldG9uQW5pbWF0b3IoPFNrZWxldG9uQW5pbWF0aW9uU2V0PiB0aGlzLl9wQW5pbWF0aW9uU2V0LCB0aGlzLl9za2VsZXRvbiwgdGhpcy5fZm9yY2VDUFUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBsYXlzIGFuIGFuaW1hdGlvbiBzdGF0ZSByZWdpc3RlcmVkIHdpdGggdGhlIGdpdmVuIG5hbWUgaW4gdGhlIGFuaW1hdGlvbiBkYXRhIHNldC5cblx0ICpcblx0ICogQHBhcmFtIG5hbWUgVGhlIGRhdGEgc2V0IG5hbWUgb2YgdGhlIGFuaW1hdGlvbiBzdGF0ZSB0byBiZSBwbGF5ZWQuXG5cdCAqIEBwYXJhbSB0cmFuc2l0aW9uIEFuIG9wdGlvbmFsIHRyYW5zaXRpb24gb2JqZWN0IHRoYXQgZGV0ZXJtaW5lcyBob3cgdGhlIGFuaW1hdG9yIHdpbGwgdHJhbnNpdGlvbiBmcm9tIHRoZSBjdXJyZW50bHkgYWN0aXZlIGFuaW1hdGlvbiBzdGF0ZS5cblx0ICogQHBhcmFtIG9mZnNldCBBbiBvcHRpb24gb2Zmc2V0IHRpbWUgKGluIG1pbGxpc2Vjb25kcykgdGhhdCByZXNldHMgdGhlIHN0YXRlJ3MgaW50ZXJuYWwgY2xvY2sgdG8gdGhlIGFic29sdXRlIHRpbWUgb2YgdGhlIGFuaW1hdG9yIHBsdXMgdGhlIG9mZnNldCB2YWx1ZS4gUmVxdWlyZWQgZm9yIG5vbi1sb29waW5nIGFuaW1hdGlvbiBzdGF0ZXMuXG5cdCAqL1xuXHRwdWJsaWMgcGxheShuYW1lOnN0cmluZywgdHJhbnNpdGlvbjpJQW5pbWF0aW9uVHJhbnNpdGlvbiA9IG51bGwsIG9mZnNldDpudW1iZXIgPSBOYU4pXG5cdHtcblx0XHRpZiAodGhpcy5fcEFjdGl2ZUFuaW1hdGlvbk5hbWUgPT0gbmFtZSlcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMuX3BBY3RpdmVBbmltYXRpb25OYW1lID0gbmFtZTtcblxuXHRcdGlmICghdGhpcy5fcEFuaW1hdGlvblNldC5oYXNBbmltYXRpb24obmFtZSkpXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJBbmltYXRpb24gcm9vdCBub2RlIFwiICsgbmFtZSArIFwiIG5vdCBmb3VuZCFcIik7XG5cblx0XHRpZiAodHJhbnNpdGlvbiAmJiB0aGlzLl9wQWN0aXZlTm9kZSkge1xuXHRcdFx0Ly9zZXR1cCB0aGUgdHJhbnNpdGlvblxuXHRcdFx0dGhpcy5fcEFjdGl2ZU5vZGUgPSB0cmFuc2l0aW9uLmdldEFuaW1hdGlvbk5vZGUodGhpcywgdGhpcy5fcEFjdGl2ZU5vZGUsIHRoaXMuX3BBbmltYXRpb25TZXQuZ2V0QW5pbWF0aW9uKG5hbWUpLCB0aGlzLl9wQWJzb2x1dGVUaW1lKTtcblx0XHRcdHRoaXMuX3BBY3RpdmVOb2RlLmFkZEV2ZW50TGlzdGVuZXIoQW5pbWF0aW9uU3RhdGVFdmVudC5UUkFOU0lUSU9OX0NPTVBMRVRFLCB0aGlzLl9vblRyYW5zaXRpb25Db21wbGV0ZURlbGVnYXRlKTtcblx0XHR9IGVsc2Vcblx0XHRcdHRoaXMuX3BBY3RpdmVOb2RlID0gdGhpcy5fcEFuaW1hdGlvblNldC5nZXRBbmltYXRpb24obmFtZSk7XG5cblx0XHR0aGlzLl9wQWN0aXZlU3RhdGUgPSB0aGlzLmdldEFuaW1hdGlvblN0YXRlKHRoaXMuX3BBY3RpdmVOb2RlKTtcblxuXHRcdGlmICh0aGlzLnVwZGF0ZVBvc2l0aW9uKSB7XG5cdFx0XHQvL3VwZGF0ZSBzdHJhaWdodCBhd2F5IHRvIHJlc2V0IHBvc2l0aW9uIGRlbHRhc1xuXHRcdFx0dGhpcy5fcEFjdGl2ZVN0YXRlLnVwZGF0ZSh0aGlzLl9wQWJzb2x1dGVUaW1lKTtcblx0XHRcdHRoaXMuX3BBY3RpdmVTdGF0ZS5wb3NpdGlvbkRlbHRhO1xuXHRcdH1cblxuXHRcdHRoaXMuX2FjdGl2ZVNrZWxldG9uU3RhdGUgPSA8SVNrZWxldG9uQW5pbWF0aW9uU3RhdGU+IHRoaXMuX3BBY3RpdmVTdGF0ZTtcblxuXHRcdHRoaXMuc3RhcnQoKTtcblxuXHRcdC8vYXBwbHkgYSB0aW1lIG9mZnNldCBpZiBzcGVjaWZpZWRcblx0XHRpZiAoIWlzTmFOKG9mZnNldCkpXG5cdFx0XHR0aGlzLnJlc2V0KG5hbWUsIG9mZnNldCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBzZXRSZW5kZXJTdGF0ZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSwgc3RhZ2U6U3RhZ2UsIGNhbWVyYTpDYW1lcmEsIHZlcnRleENvbnN0YW50T2Zmc2V0Om51bWJlciAvKmludCovLCB2ZXJ0ZXhTdHJlYW1PZmZzZXQ6bnVtYmVyIC8qaW50Ki8pXG5cdHtcblx0XHQvLyBkbyBvbiByZXF1ZXN0IG9mIGdsb2JhbFByb3BlcnRpZXNcblx0XHRpZiAodGhpcy5fZ2xvYmFsUHJvcGVydGllc0RpcnR5KVxuXHRcdFx0dGhpcy51cGRhdGVHbG9iYWxQcm9wZXJ0aWVzKCk7XG5cblx0XHR2YXIgc3ViR2VvbWV0cnk6VHJpYW5nbGVTdWJHZW9tZXRyeSA9IDxUcmlhbmdsZVN1Ykdlb21ldHJ5PiAoPFRyaWFuZ2xlU3ViTWVzaD4gKDxUcmlhbmdsZVN1Yk1lc2hSZW5kZXJhYmxlPiByZW5kZXJhYmxlKS5zdWJNZXNoKS5zdWJHZW9tZXRyeTtcblxuXHRcdHN1Ykdlb21ldHJ5LnVzZUNvbmRlbnNlZEluZGljZXMgPSB0aGlzLl91c2VDb25kZW5zZWRJbmRpY2VzO1xuXG5cdFx0aWYgKHRoaXMuX3VzZUNvbmRlbnNlZEluZGljZXMpIHtcblx0XHRcdC8vIHVzaW5nIGEgY29uZGVuc2VkIGRhdGEgc2V0XG5cdFx0XHR0aGlzLnVwZGF0ZUNvbmRlbnNlZE1hdHJpY2VzKHN1Ykdlb21ldHJ5LmNvbmRlbnNlZEluZGV4TG9va1VwLCBzdWJHZW9tZXRyeS5udW1Db25kZW5zZWRKb2ludHMpO1xuXHRcdFx0c3RhZ2UuY29udGV4dC5zZXRQcm9ncmFtQ29uc3RhbnRzRnJvbUFycmF5KENvbnRleHRHTFByb2dyYW1UeXBlLlZFUlRFWCwgdmVydGV4Q29uc3RhbnRPZmZzZXQsIHRoaXMuX2NvbmRlbnNlZE1hdHJpY2VzLCBzdWJHZW9tZXRyeS5udW1Db25kZW5zZWRKb2ludHMqMyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICh0aGlzLl9wQW5pbWF0aW9uU2V0LnVzZXNDUFUpIHtcblx0XHRcdFx0aWYgKHRoaXMuX21vcnBoZWRTdWJHZW9tZXRyeURpcnR5W3N1Ykdlb21ldHJ5LmlkXSlcblx0XHRcdFx0XHR0aGlzLm1vcnBoU3ViR2VvbWV0cnkoPFRyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGU+IHJlbmRlcmFibGUsIHN1Ykdlb21ldHJ5KTtcblxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblx0XHRcdHN0YWdlLmNvbnRleHQuc2V0UHJvZ3JhbUNvbnN0YW50c0Zyb21BcnJheShDb250ZXh0R0xQcm9ncmFtVHlwZS5WRVJURVgsIHZlcnRleENvbnN0YW50T2Zmc2V0LCB0aGlzLl9nbG9iYWxNYXRyaWNlcywgdGhpcy5fbnVtSm9pbnRzKjMpO1xuXHRcdH1cblxuXHRcdHN0YWdlLmFjdGl2YXRlQnVmZmVyKHZlcnRleFN0cmVhbU9mZnNldCwgcmVuZGVyYWJsZS5nZXRWZXJ0ZXhEYXRhKFRyaWFuZ2xlU3ViR2VvbWV0cnkuSk9JTlRfSU5ERVhfREFUQSksIHJlbmRlcmFibGUuZ2V0VmVydGV4T2Zmc2V0KFRyaWFuZ2xlU3ViR2VvbWV0cnkuSk9JTlRfSU5ERVhfREFUQSksIHJlbmRlcmFibGUuSk9JTlRfSU5ERVhfRk9STUFUKTtcblx0XHRzdGFnZS5hY3RpdmF0ZUJ1ZmZlcih2ZXJ0ZXhTdHJlYW1PZmZzZXQgKyAxLCByZW5kZXJhYmxlLmdldFZlcnRleERhdGEoVHJpYW5nbGVTdWJHZW9tZXRyeS5KT0lOVF9XRUlHSFRfREFUQSksIHJlbmRlcmFibGUuZ2V0VmVydGV4T2Zmc2V0KFRyaWFuZ2xlU3ViR2VvbWV0cnkuSk9JTlRfV0VJR0hUX0RBVEEpLCByZW5kZXJhYmxlLkpPSU5UX1dFSUdIVF9GT1JNQVQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgdGVzdEdQVUNvbXBhdGliaWxpdHkoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpXG5cdHtcblx0XHRpZiAoIXRoaXMuX3VzZUNvbmRlbnNlZEluZGljZXMgJiYgKHRoaXMuX2ZvcmNlQ1BVIHx8IHRoaXMuX2pvaW50c1BlclZlcnRleCA+IDQgfHwgc2hhZGVyT2JqZWN0Lm51bVVzZWRWZXJ0ZXhDb25zdGFudHMgKyB0aGlzLl9udW1Kb2ludHMqMyA+IDEyOCkpXG5cdFx0XHR0aGlzLl9wQW5pbWF0aW9uU2V0LmNhbmNlbEdQVUNvbXBhdGliaWxpdHkoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBcHBsaWVzIHRoZSBjYWxjdWxhdGVkIHRpbWUgZGVsdGEgdG8gdGhlIGFjdGl2ZSBhbmltYXRpb24gc3RhdGUgbm9kZSBvciBzdGF0ZSB0cmFuc2l0aW9uIG9iamVjdC5cblx0ICovXG5cdHB1YmxpYyBfcFVwZGF0ZURlbHRhVGltZShkdDpudW1iZXIpXG5cdHtcblx0XHRzdXBlci5fcFVwZGF0ZURlbHRhVGltZShkdCk7XG5cblx0XHQvL2ludmFsaWRhdGUgcG9zZSBtYXRyaWNlc1xuXHRcdHRoaXMuX2dsb2JhbFByb3BlcnRpZXNEaXJ0eSA9IHRydWU7XG5cblx0XHQvL3RyaWdnZXIgZ2VvbWV0cnkgaW52YWxpZGF0aW9uIGlmIHVzaW5nIENQVSBhbmltYXRpb25cblx0XHRpZiAodGhpcy5fcEFuaW1hdGlvblNldC51c2VzQ1BVKVxuXHRcdFx0Zm9yICh2YXIga2V5IGluIHRoaXMuX21vcnBoZWRTdWJHZW9tZXRyeURpcnR5KVxuXHRcdFx0XHR0aGlzLl9tb3JwaGVkU3ViR2VvbWV0cnlEaXJ0eVtrZXldID0gdHJ1ZTtcblx0fVxuXG5cdHByaXZhdGUgdXBkYXRlQ29uZGVuc2VkTWF0cmljZXMoY29uZGVuc2VkSW5kZXhMb29rVXA6QXJyYXk8bnVtYmVyPiAvKnVpbnQqLywgbnVtSm9pbnRzOm51bWJlciAvKnVpbnQqLylcblx0e1xuXHRcdHZhciBpOm51bWJlciAvKnVpbnQqLyA9IDAsIGo6bnVtYmVyIC8qdWludCovID0gMDtcblx0XHR2YXIgbGVuOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgc3JjSW5kZXg6bnVtYmVyIC8qdWludCovO1xuXG5cdFx0dGhpcy5fY29uZGVuc2VkTWF0cmljZXMgPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuXG5cdFx0ZG8ge1xuXHRcdFx0c3JjSW5kZXggPSBjb25kZW5zZWRJbmRleExvb2tVcFtpXSo0O1xuXHRcdFx0bGVuID0gc3JjSW5kZXggKyAxMjtcblx0XHRcdC8vIGNvcHkgaW50byBjb25kZW5zZWRcblx0XHRcdHdoaWxlIChzcmNJbmRleCA8IGxlbilcblx0XHRcdFx0dGhpcy5fY29uZGVuc2VkTWF0cmljZXNbaisrXSA9IHRoaXMuX2dsb2JhbE1hdHJpY2VzW3NyY0luZGV4KytdO1xuXHRcdH0gd2hpbGUgKCsraSA8IG51bUpvaW50cyk7XG5cdH1cblxuXHRwcml2YXRlIHVwZGF0ZUdsb2JhbFByb3BlcnRpZXMoKVxuXHR7XG5cdFx0dGhpcy5fZ2xvYmFsUHJvcGVydGllc0RpcnR5ID0gZmFsc2U7XG5cblx0XHQvL2dldCBnbG9iYWwgcG9zZVxuXHRcdHRoaXMubG9jYWxUb0dsb2JhbFBvc2UodGhpcy5fYWN0aXZlU2tlbGV0b25TdGF0ZS5nZXRTa2VsZXRvblBvc2UodGhpcy5fc2tlbGV0b24pLCB0aGlzLl9nbG9iYWxQb3NlLCB0aGlzLl9za2VsZXRvbik7XG5cblx0XHQvLyBjb252ZXJ0IHBvc2UgdG8gbWF0cml4XG5cdFx0dmFyIG10eE9mZnNldDpudW1iZXIgLyp1aW50Ki8gPSAwO1xuXHRcdHZhciBnbG9iYWxQb3NlczpBcnJheTxKb2ludFBvc2U+ID0gdGhpcy5fZ2xvYmFsUG9zZS5qb2ludFBvc2VzO1xuXHRcdHZhciByYXc6QXJyYXk8bnVtYmVyPjtcblx0XHR2YXIgb3g6bnVtYmVyLCBveTpudW1iZXIsIG96Om51bWJlciwgb3c6bnVtYmVyO1xuXHRcdHZhciB4eTI6bnVtYmVyLCB4ejI6bnVtYmVyLCB4dzI6bnVtYmVyO1xuXHRcdHZhciB5ejI6bnVtYmVyLCB5dzI6bnVtYmVyLCB6dzI6bnVtYmVyO1xuXHRcdHZhciBuMTE6bnVtYmVyLCBuMTI6bnVtYmVyLCBuMTM6bnVtYmVyO1xuXHRcdHZhciBuMjE6bnVtYmVyLCBuMjI6bnVtYmVyLCBuMjM6bnVtYmVyO1xuXHRcdHZhciBuMzE6bnVtYmVyLCBuMzI6bnVtYmVyLCBuMzM6bnVtYmVyO1xuXHRcdHZhciBtMTE6bnVtYmVyLCBtMTI6bnVtYmVyLCBtMTM6bnVtYmVyLCBtMTQ6bnVtYmVyO1xuXHRcdHZhciBtMjE6bnVtYmVyLCBtMjI6bnVtYmVyLCBtMjM6bnVtYmVyLCBtMjQ6bnVtYmVyO1xuXHRcdHZhciBtMzE6bnVtYmVyLCBtMzI6bnVtYmVyLCBtMzM6bnVtYmVyLCBtMzQ6bnVtYmVyO1xuXHRcdHZhciBqb2ludHM6QXJyYXk8U2tlbGV0b25Kb2ludD4gPSB0aGlzLl9za2VsZXRvbi5qb2ludHM7XG5cdFx0dmFyIHBvc2U6Sm9pbnRQb3NlO1xuXHRcdHZhciBxdWF0OlF1YXRlcm5pb247XG5cdFx0dmFyIHZlYzpWZWN0b3IzRDtcblx0XHR2YXIgdDpudW1iZXI7XG5cblx0XHRmb3IgKHZhciBpOm51bWJlciAvKnVpbnQqLyA9IDA7IGkgPCB0aGlzLl9udW1Kb2ludHM7ICsraSkge1xuXHRcdFx0cG9zZSA9IGdsb2JhbFBvc2VzW2ldO1xuXHRcdFx0cXVhdCA9IHBvc2Uub3JpZW50YXRpb247XG5cdFx0XHR2ZWMgPSBwb3NlLnRyYW5zbGF0aW9uO1xuXHRcdFx0b3ggPSBxdWF0Lng7XG5cdFx0XHRveSA9IHF1YXQueTtcblx0XHRcdG96ID0gcXVhdC56O1xuXHRcdFx0b3cgPSBxdWF0Lnc7XG5cblx0XHRcdHh5MiA9ICh0ID0gMi4wKm94KSpveTtcblx0XHRcdHh6MiA9IHQqb3o7XG5cdFx0XHR4dzIgPSB0Km93O1xuXHRcdFx0eXoyID0gKHQgPSAyLjAqb3kpKm96O1xuXHRcdFx0eXcyID0gdCpvdztcblx0XHRcdHp3MiA9IDIuMCpveipvdztcblxuXHRcdFx0eXoyID0gMi4wKm95Km96O1xuXHRcdFx0eXcyID0gMi4wKm95Km93O1xuXHRcdFx0encyID0gMi4wKm96Km93O1xuXHRcdFx0b3ggKj0gb3g7XG5cdFx0XHRveSAqPSBveTtcblx0XHRcdG96ICo9IG96O1xuXHRcdFx0b3cgKj0gb3c7XG5cblx0XHRcdG4xMSA9ICh0ID0gb3ggLSBveSkgLSBveiArIG93O1xuXHRcdFx0bjEyID0geHkyIC0gencyO1xuXHRcdFx0bjEzID0geHoyICsgeXcyO1xuXHRcdFx0bjIxID0geHkyICsgencyO1xuXHRcdFx0bjIyID0gLXQgLSBveiArIG93O1xuXHRcdFx0bjIzID0geXoyIC0geHcyO1xuXHRcdFx0bjMxID0geHoyIC0geXcyO1xuXHRcdFx0bjMyID0geXoyICsgeHcyO1xuXHRcdFx0bjMzID0gLW94IC0gb3kgKyBveiArIG93O1xuXG5cdFx0XHQvLyBwcmVwZW5kIGludmVyc2UgYmluZCBwb3NlXG5cdFx0XHRyYXcgPSBqb2ludHNbaV0uaW52ZXJzZUJpbmRQb3NlO1xuXHRcdFx0bTExID0gcmF3WzBdO1xuXHRcdFx0bTEyID0gcmF3WzRdO1xuXHRcdFx0bTEzID0gcmF3WzhdO1xuXHRcdFx0bTE0ID0gcmF3WzEyXTtcblx0XHRcdG0yMSA9IHJhd1sxXTtcblx0XHRcdG0yMiA9IHJhd1s1XTtcblx0XHRcdG0yMyA9IHJhd1s5XTtcblx0XHRcdG0yNCA9IHJhd1sxM107XG5cdFx0XHRtMzEgPSByYXdbMl07XG5cdFx0XHRtMzIgPSByYXdbNl07XG5cdFx0XHRtMzMgPSByYXdbMTBdO1xuXHRcdFx0bTM0ID0gcmF3WzE0XTtcblxuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0XSA9IG4xMSptMTEgKyBuMTIqbTIxICsgbjEzKm0zMTtcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDFdID0gbjExKm0xMiArIG4xMiptMjIgKyBuMTMqbTMyO1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgMl0gPSBuMTEqbTEzICsgbjEyKm0yMyArIG4xMyptMzM7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyAzXSA9IG4xMSptMTQgKyBuMTIqbTI0ICsgbjEzKm0zNCArIHZlYy54O1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgNF0gPSBuMjEqbTExICsgbjIyKm0yMSArIG4yMyptMzE7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyA1XSA9IG4yMSptMTIgKyBuMjIqbTIyICsgbjIzKm0zMjtcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDZdID0gbjIxKm0xMyArIG4yMiptMjMgKyBuMjMqbTMzO1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgN10gPSBuMjEqbTE0ICsgbjIyKm0yNCArIG4yMyptMzQgKyB2ZWMueTtcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDhdID0gbjMxKm0xMSArIG4zMiptMjEgKyBuMzMqbTMxO1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgOV0gPSBuMzEqbTEyICsgbjMyKm0yMiArIG4zMyptMzI7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyAxMF0gPSBuMzEqbTEzICsgbjMyKm0yMyArIG4zMyptMzM7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyAxMV0gPSBuMzEqbTE0ICsgbjMyKm0yNCArIG4zMyptMzQgKyB2ZWMuejtcblxuXHRcdFx0bXR4T2Zmc2V0ID0gbXR4T2Zmc2V0ICsgMTI7XG5cdFx0fVxuXHR9XG5cblxuXHRwdWJsaWMgZ2V0UmVuZGVyYWJsZVN1Ykdlb21ldHJ5KHJlbmRlcmFibGU6VHJpYW5nbGVTdWJNZXNoUmVuZGVyYWJsZSwgc291cmNlU3ViR2VvbWV0cnk6VHJpYW5nbGVTdWJHZW9tZXRyeSk6VHJpYW5nbGVTdWJHZW9tZXRyeVxuXHR7XG5cdFx0dGhpcy5fbW9ycGhlZFN1Ykdlb21ldHJ5RGlydHlbc291cmNlU3ViR2VvbWV0cnkuaWRdID0gdHJ1ZTtcblxuXHRcdC8vZWFybHkgb3V0IGZvciBHUFUgYW5pbWF0aW9uc1xuXHRcdGlmICghdGhpcy5fcEFuaW1hdGlvblNldC51c2VzQ1BVKVxuXHRcdFx0cmV0dXJuIHNvdXJjZVN1Ykdlb21ldHJ5O1xuXG5cdFx0dmFyIHRhcmdldFN1Ykdlb21ldHJ5OlRyaWFuZ2xlU3ViR2VvbWV0cnk7XG5cblx0XHRpZiAoISh0YXJnZXRTdWJHZW9tZXRyeSA9IHRoaXMuX21vcnBoZWRTdWJHZW9tZXRyeVtzb3VyY2VTdWJHZW9tZXRyeS5pZF0pKSB7XG5cdFx0XHQvL25vdCB5ZXQgc3RvcmVkXG5cdFx0XHR0YXJnZXRTdWJHZW9tZXRyeSA9IHRoaXMuX21vcnBoZWRTdWJHZW9tZXRyeVtzb3VyY2VTdWJHZW9tZXRyeS5pZF0gPSBzb3VyY2VTdWJHZW9tZXRyeS5jbG9uZSgpO1xuXHRcdFx0Ly90dXJuIG9mZiBhdXRvIGNhbGN1bGF0aW9ucyBvbiB0aGUgbW9ycGhlZCBnZW9tZXRyeVxuXHRcdFx0dGFyZ2V0U3ViR2VvbWV0cnkuYXV0b0Rlcml2ZU5vcm1hbHMgPSBmYWxzZTtcblx0XHRcdHRhcmdldFN1Ykdlb21ldHJ5LmF1dG9EZXJpdmVUYW5nZW50cyA9IGZhbHNlO1xuXHRcdFx0dGFyZ2V0U3ViR2VvbWV0cnkuYXV0b0Rlcml2ZVVWcyA9IGZhbHNlO1xuXHRcdFx0Ly9hZGQgZXZlbnQgbGlzdGVuZXJzIGZvciBhbnkgY2hhbmdlcyBpbiBVViB2YWx1ZXMgb24gdGhlIHNvdXJjZSBnZW9tZXRyeVxuXHRcdFx0c291cmNlU3ViR2VvbWV0cnkuYWRkRXZlbnRMaXN0ZW5lcihTdWJHZW9tZXRyeUV2ZW50LklORElDRVNfVVBEQVRFRCwgdGhpcy5fb25JbmRpY2VzVXBkYXRlRGVsZWdhdGUpO1xuXHRcdFx0c291cmNlU3ViR2VvbWV0cnkuYWRkRXZlbnRMaXN0ZW5lcihTdWJHZW9tZXRyeUV2ZW50LlZFUlRJQ0VTX1VQREFURUQsIHRoaXMuX29uVmVydGljZXNVcGRhdGVEZWxlZ2F0ZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRhcmdldFN1Ykdlb21ldHJ5O1xuXHR9XG5cblx0LyoqXG5cdCAqIElmIHRoZSBhbmltYXRpb24gY2FuJ3QgYmUgcGVyZm9ybWVkIG9uIEdQVSwgdHJhbnNmb3JtIHZlcnRpY2VzIG1hbnVhbGx5XG5cdCAqIEBwYXJhbSBzdWJHZW9tIFRoZSBzdWJnZW9tZXRyeSBjb250YWluaW5nIHRoZSB3ZWlnaHRzIGFuZCBqb2ludCBpbmRleCBkYXRhIHBlciB2ZXJ0ZXguXG5cdCAqIEBwYXJhbSBwYXNzIFRoZSBtYXRlcmlhbCBwYXNzIGZvciB3aGljaCB3ZSBuZWVkIHRvIHRyYW5zZm9ybSB0aGUgdmVydGljZXNcblx0ICovXG5cdHB1YmxpYyBtb3JwaFN1Ykdlb21ldHJ5KHJlbmRlcmFibGU6VHJpYW5nbGVTdWJNZXNoUmVuZGVyYWJsZSwgc291cmNlU3ViR2VvbWV0cnk6VHJpYW5nbGVTdWJHZW9tZXRyeSlcblx0e1xuXHRcdHRoaXMuX21vcnBoZWRTdWJHZW9tZXRyeURpcnR5W3NvdXJjZVN1Ykdlb21ldHJ5LmlkXSA9IGZhbHNlO1xuXG5cdFx0dmFyIHNvdXJjZVBvc2l0aW9uczpBcnJheTxudW1iZXI+ID0gc291cmNlU3ViR2VvbWV0cnkucG9zaXRpb25zO1xuXHRcdHZhciBzb3VyY2VOb3JtYWxzOkFycmF5PG51bWJlcj4gPSBzb3VyY2VTdWJHZW9tZXRyeS52ZXJ0ZXhOb3JtYWxzO1xuXHRcdHZhciBzb3VyY2VUYW5nZW50czpBcnJheTxudW1iZXI+ID0gc291cmNlU3ViR2VvbWV0cnkudmVydGV4VGFuZ2VudHM7XG5cblx0XHR2YXIgam9pbnRJbmRpY2VzOkFycmF5PG51bWJlcj4gPSBzb3VyY2VTdWJHZW9tZXRyeS5qb2ludEluZGljZXM7XG5cdFx0dmFyIGpvaW50V2VpZ2h0czpBcnJheTxudW1iZXI+ID0gc291cmNlU3ViR2VvbWV0cnkuam9pbnRXZWlnaHRzO1xuXG5cdFx0dmFyIHRhcmdldFN1Ykdlb21ldHJ5ID0gdGhpcy5fbW9ycGhlZFN1Ykdlb21ldHJ5W3NvdXJjZVN1Ykdlb21ldHJ5LmlkXTtcblxuXHRcdHZhciB0YXJnZXRQb3NpdGlvbnM6QXJyYXk8bnVtYmVyPiA9IHRhcmdldFN1Ykdlb21ldHJ5LnBvc2l0aW9ucztcblx0XHR2YXIgdGFyZ2V0Tm9ybWFsczpBcnJheTxudW1iZXI+ID0gdGFyZ2V0U3ViR2VvbWV0cnkudmVydGV4Tm9ybWFscztcblx0XHR2YXIgdGFyZ2V0VGFuZ2VudHM6QXJyYXk8bnVtYmVyPiA9IHRhcmdldFN1Ykdlb21ldHJ5LnZlcnRleFRhbmdlbnRzO1xuXG5cdFx0dmFyIGluZGV4Om51bWJlciAvKnVpbnQqLyA9IDA7XG5cdFx0dmFyIGo6bnVtYmVyIC8qdWludCovID0gMDtcblx0XHR2YXIgazpudW1iZXIgLyp1aW50Ki87XG5cdFx0dmFyIHZ4Om51bWJlciwgdnk6bnVtYmVyLCB2ejpudW1iZXI7XG5cdFx0dmFyIG54Om51bWJlciwgbnk6bnVtYmVyLCBuejpudW1iZXI7XG5cdFx0dmFyIHR4Om51bWJlciwgdHk6bnVtYmVyLCB0ejpudW1iZXI7XG5cdFx0dmFyIGxlbjpudW1iZXIgLyppbnQqLyA9IHNvdXJjZVBvc2l0aW9ucy5sZW5ndGg7XG5cdFx0dmFyIHdlaWdodDpudW1iZXI7XG5cdFx0dmFyIHZlcnRYOm51bWJlciwgdmVydFk6bnVtYmVyLCB2ZXJ0WjpudW1iZXI7XG5cdFx0dmFyIG5vcm1YOm51bWJlciwgbm9ybVk6bnVtYmVyLCBub3JtWjpudW1iZXI7XG5cdFx0dmFyIHRhbmdYOm51bWJlciwgdGFuZ1k6bnVtYmVyLCB0YW5nWjpudW1iZXI7XG5cdFx0dmFyIG0xMTpudW1iZXIsIG0xMjpudW1iZXIsIG0xMzpudW1iZXIsIG0xNDpudW1iZXI7XG5cdFx0dmFyIG0yMTpudW1iZXIsIG0yMjpudW1iZXIsIG0yMzpudW1iZXIsIG0yNDpudW1iZXI7XG5cdFx0dmFyIG0zMTpudW1iZXIsIG0zMjpudW1iZXIsIG0zMzpudW1iZXIsIG0zNDpudW1iZXI7XG5cblx0XHR3aGlsZSAoaW5kZXggPCBsZW4pIHtcblx0XHRcdHZlcnRYID0gc291cmNlUG9zaXRpb25zW2luZGV4XTtcblx0XHRcdHZlcnRZID0gc291cmNlUG9zaXRpb25zW2luZGV4ICsgMV07XG5cdFx0XHR2ZXJ0WiA9IHNvdXJjZVBvc2l0aW9uc1tpbmRleCArIDJdO1xuXHRcdFx0bm9ybVggPSBzb3VyY2VOb3JtYWxzW2luZGV4XTtcblx0XHRcdG5vcm1ZID0gc291cmNlTm9ybWFsc1tpbmRleCArIDFdO1xuXHRcdFx0bm9ybVogPSBzb3VyY2VOb3JtYWxzW2luZGV4ICsgMl07XG5cdFx0XHR0YW5nWCA9IHNvdXJjZVRhbmdlbnRzW2luZGV4XTtcblx0XHRcdHRhbmdZID0gc291cmNlVGFuZ2VudHNbaW5kZXggKyAxXTtcblx0XHRcdHRhbmdaID0gc291cmNlVGFuZ2VudHNbaW5kZXggKyAyXTtcblx0XHRcdHZ4ID0gMDtcblx0XHRcdHZ5ID0gMDtcblx0XHRcdHZ6ID0gMDtcblx0XHRcdG54ID0gMDtcblx0XHRcdG55ID0gMDtcblx0XHRcdG56ID0gMDtcblx0XHRcdHR4ID0gMDtcblx0XHRcdHR5ID0gMDtcblx0XHRcdHR6ID0gMDtcblx0XHRcdGsgPSAwO1xuXHRcdFx0d2hpbGUgKGsgPCB0aGlzLl9qb2ludHNQZXJWZXJ0ZXgpIHtcblx0XHRcdFx0d2VpZ2h0ID0gam9pbnRXZWlnaHRzW2pdO1xuXHRcdFx0XHRpZiAod2VpZ2h0ID4gMCkge1xuXHRcdFx0XHRcdC8vIGltcGxpY2l0IC8zKjEyICgvMyBiZWNhdXNlIGluZGljZXMgYXJlIG11bHRpcGxpZWQgYnkgMyBmb3IgZ3B1IG1hdHJpeCBhY2Nlc3MsICoxMiBiZWNhdXNlIGl0J3MgdGhlIG1hdHJpeCBzaXplKVxuXHRcdFx0XHRcdHZhciBtdHhPZmZzZXQ6bnVtYmVyIC8qdWludCovID0gam9pbnRJbmRpY2VzW2orK10gPDwgMjtcblx0XHRcdFx0XHRtMTEgPSB0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXRdO1xuXHRcdFx0XHRcdG0xMiA9IHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDFdO1xuXHRcdFx0XHRcdG0xMyA9IHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDJdO1xuXHRcdFx0XHRcdG0xNCA9IHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDNdO1xuXHRcdFx0XHRcdG0yMSA9IHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDRdO1xuXHRcdFx0XHRcdG0yMiA9IHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDVdO1xuXHRcdFx0XHRcdG0yMyA9IHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDZdO1xuXHRcdFx0XHRcdG0yNCA9IHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDddO1xuXHRcdFx0XHRcdG0zMSA9IHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDhdO1xuXHRcdFx0XHRcdG0zMiA9IHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDldO1xuXHRcdFx0XHRcdG0zMyA9IHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDEwXTtcblx0XHRcdFx0XHRtMzQgPSB0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyAxMV07XG5cdFx0XHRcdFx0dnggKz0gd2VpZ2h0KihtMTEqdmVydFggKyBtMTIqdmVydFkgKyBtMTMqdmVydFogKyBtMTQpO1xuXHRcdFx0XHRcdHZ5ICs9IHdlaWdodCoobTIxKnZlcnRYICsgbTIyKnZlcnRZICsgbTIzKnZlcnRaICsgbTI0KTtcblx0XHRcdFx0XHR2eiArPSB3ZWlnaHQqKG0zMSp2ZXJ0WCArIG0zMip2ZXJ0WSArIG0zMyp2ZXJ0WiArIG0zNCk7XG5cdFx0XHRcdFx0bnggKz0gd2VpZ2h0KihtMTEqbm9ybVggKyBtMTIqbm9ybVkgKyBtMTMqbm9ybVopO1xuXHRcdFx0XHRcdG55ICs9IHdlaWdodCoobTIxKm5vcm1YICsgbTIyKm5vcm1ZICsgbTIzKm5vcm1aKTtcblx0XHRcdFx0XHRueiArPSB3ZWlnaHQqKG0zMSpub3JtWCArIG0zMipub3JtWSArIG0zMypub3JtWik7XG5cdFx0XHRcdFx0dHggKz0gd2VpZ2h0KihtMTEqdGFuZ1ggKyBtMTIqdGFuZ1kgKyBtMTMqdGFuZ1opO1xuXHRcdFx0XHRcdHR5ICs9IHdlaWdodCoobTIxKnRhbmdYICsgbTIyKnRhbmdZICsgbTIzKnRhbmdaKTtcblx0XHRcdFx0XHR0eiArPSB3ZWlnaHQqKG0zMSp0YW5nWCArIG0zMip0YW5nWSArIG0zMyp0YW5nWik7XG5cdFx0XHRcdFx0KytrO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGogKz0gKHRoaXMuX2pvaW50c1BlclZlcnRleCAtIGspO1xuXHRcdFx0XHRcdGsgPSB0aGlzLl9qb2ludHNQZXJWZXJ0ZXg7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dGFyZ2V0UG9zaXRpb25zW2luZGV4XSA9IHZ4O1xuXHRcdFx0dGFyZ2V0UG9zaXRpb25zW2luZGV4ICsgMV0gPSB2eTtcblx0XHRcdHRhcmdldFBvc2l0aW9uc1tpbmRleCArIDJdID0gdno7XG5cdFx0XHR0YXJnZXROb3JtYWxzW2luZGV4XSA9IG54O1xuXHRcdFx0dGFyZ2V0Tm9ybWFsc1tpbmRleCArIDFdID0gbnk7XG5cdFx0XHR0YXJnZXROb3JtYWxzW2luZGV4ICsgMl0gPSBuejtcblx0XHRcdHRhcmdldFRhbmdlbnRzW2luZGV4XSA9IHR4O1xuXHRcdFx0dGFyZ2V0VGFuZ2VudHNbaW5kZXggKyAxXSA9IHR5O1xuXHRcdFx0dGFyZ2V0VGFuZ2VudHNbaW5kZXggKyAyXSA9IHR6O1xuXG5cdFx0XHRpbmRleCArPSAzO1xuXHRcdH1cblxuXHRcdHRhcmdldFN1Ykdlb21ldHJ5LnVwZGF0ZVBvc2l0aW9ucyh0YXJnZXRQb3NpdGlvbnMpO1xuXHRcdHRhcmdldFN1Ykdlb21ldHJ5LnVwZGF0ZVZlcnRleE5vcm1hbHModGFyZ2V0Tm9ybWFscyk7XG5cdFx0dGFyZ2V0U3ViR2VvbWV0cnkudXBkYXRlVmVydGV4VGFuZ2VudHModGFyZ2V0VGFuZ2VudHMpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIGEgbG9jYWwgaGllcmFyY2hpY2FsIHNrZWxldG9uIHBvc2UgdG8gYSBnbG9iYWwgcG9zZVxuXHQgKiBAcGFyYW0gdGFyZ2V0UG9zZSBUaGUgU2tlbGV0b25Qb3NlIG9iamVjdCB0aGF0IHdpbGwgY29udGFpbiB0aGUgZ2xvYmFsIHBvc2UuXG5cdCAqIEBwYXJhbSBza2VsZXRvbiBUaGUgc2tlbGV0b24gY29udGFpbmluZyB0aGUgam9pbnRzLCBhbmQgYXMgc3VjaCwgdGhlIGhpZXJhcmNoaWNhbCBkYXRhIHRvIHRyYW5zZm9ybSB0byBnbG9iYWwgcG9zZXMuXG5cdCAqL1xuXHRwcml2YXRlIGxvY2FsVG9HbG9iYWxQb3NlKHNvdXJjZVBvc2U6U2tlbGV0b25Qb3NlLCB0YXJnZXRQb3NlOlNrZWxldG9uUG9zZSwgc2tlbGV0b246U2tlbGV0b24pXG5cdHtcblx0XHR2YXIgZ2xvYmFsUG9zZXM6QXJyYXk8Sm9pbnRQb3NlPiA9IHRhcmdldFBvc2Uuam9pbnRQb3Nlcztcblx0XHR2YXIgZ2xvYmFsSm9pbnRQb3NlOkpvaW50UG9zZTtcblx0XHR2YXIgam9pbnRzOkFycmF5PFNrZWxldG9uSm9pbnQ+ID0gc2tlbGV0b24uam9pbnRzO1xuXHRcdHZhciBsZW46bnVtYmVyIC8qdWludCovID0gc291cmNlUG9zZS5udW1Kb2ludFBvc2VzO1xuXHRcdHZhciBqb2ludFBvc2VzOkFycmF5PEpvaW50UG9zZT4gPSBzb3VyY2VQb3NlLmpvaW50UG9zZXM7XG5cdFx0dmFyIHBhcmVudEluZGV4Om51bWJlciAvKmludCovO1xuXHRcdHZhciBqb2ludDpTa2VsZXRvbkpvaW50O1xuXHRcdHZhciBwYXJlbnRQb3NlOkpvaW50UG9zZTtcblx0XHR2YXIgcG9zZTpKb2ludFBvc2U7XG5cdFx0dmFyIG9yOlF1YXRlcm5pb247XG5cdFx0dmFyIHRyOlZlY3RvcjNEO1xuXHRcdHZhciB0OlZlY3RvcjNEO1xuXHRcdHZhciBxOlF1YXRlcm5pb247XG5cblx0XHR2YXIgeDE6bnVtYmVyLCB5MTpudW1iZXIsIHoxOm51bWJlciwgdzE6bnVtYmVyO1xuXHRcdHZhciB4MjpudW1iZXIsIHkyOm51bWJlciwgejI6bnVtYmVyLCB3MjpudW1iZXI7XG5cdFx0dmFyIHgzOm51bWJlciwgeTM6bnVtYmVyLCB6MzpudW1iZXI7XG5cblx0XHQvLyA6c1xuXHRcdGlmIChnbG9iYWxQb3Nlcy5sZW5ndGggIT0gbGVuKVxuXHRcdFx0Z2xvYmFsUG9zZXMubGVuZ3RoID0gbGVuO1xuXG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgLyp1aW50Ki8gPSAwOyBpIDwgbGVuOyArK2kpIHtcblx0XHRcdGdsb2JhbEpvaW50UG9zZSA9IGdsb2JhbFBvc2VzW2ldO1xuXG5cdFx0XHRpZiAoZ2xvYmFsSm9pbnRQb3NlID09IG51bGwpXG5cdFx0XHRcdGdsb2JhbEpvaW50UG9zZSA9IGdsb2JhbFBvc2VzW2ldID0gbmV3IEpvaW50UG9zZSgpO1xuXG5cdFx0XHRqb2ludCA9IGpvaW50c1tpXTtcblx0XHRcdHBhcmVudEluZGV4ID0gam9pbnQucGFyZW50SW5kZXg7XG5cdFx0XHRwb3NlID0gam9pbnRQb3Nlc1tpXTtcblxuXHRcdFx0cSA9IGdsb2JhbEpvaW50UG9zZS5vcmllbnRhdGlvbjtcblx0XHRcdHQgPSBnbG9iYWxKb2ludFBvc2UudHJhbnNsYXRpb247XG5cblx0XHRcdGlmIChwYXJlbnRJbmRleCA8IDApIHtcblx0XHRcdFx0dHIgPSBwb3NlLnRyYW5zbGF0aW9uO1xuXHRcdFx0XHRvciA9IHBvc2Uub3JpZW50YXRpb247XG5cdFx0XHRcdHEueCA9IG9yLng7XG5cdFx0XHRcdHEueSA9IG9yLnk7XG5cdFx0XHRcdHEueiA9IG9yLno7XG5cdFx0XHRcdHEudyA9IG9yLnc7XG5cdFx0XHRcdHQueCA9IHRyLng7XG5cdFx0XHRcdHQueSA9IHRyLnk7XG5cdFx0XHRcdHQueiA9IHRyLno7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBhcHBlbmQgcGFyZW50IHBvc2Vcblx0XHRcdFx0cGFyZW50UG9zZSA9IGdsb2JhbFBvc2VzW3BhcmVudEluZGV4XTtcblxuXHRcdFx0XHQvLyByb3RhdGUgcG9pbnRcblx0XHRcdFx0b3IgPSBwYXJlbnRQb3NlLm9yaWVudGF0aW9uO1xuXHRcdFx0XHR0ciA9IHBvc2UudHJhbnNsYXRpb247XG5cdFx0XHRcdHgyID0gb3IueDtcblx0XHRcdFx0eTIgPSBvci55O1xuXHRcdFx0XHR6MiA9IG9yLno7XG5cdFx0XHRcdHcyID0gb3Iudztcblx0XHRcdFx0eDMgPSB0ci54O1xuXHRcdFx0XHR5MyA9IHRyLnk7XG5cdFx0XHRcdHozID0gdHIuejtcblxuXHRcdFx0XHR3MSA9IC14Mip4MyAtIHkyKnkzIC0gejIqejM7XG5cdFx0XHRcdHgxID0gdzIqeDMgKyB5Mip6MyAtIHoyKnkzO1xuXHRcdFx0XHR5MSA9IHcyKnkzIC0geDIqejMgKyB6Mip4Mztcblx0XHRcdFx0ejEgPSB3Mip6MyArIHgyKnkzIC0geTIqeDM7XG5cblx0XHRcdFx0Ly8gYXBwZW5kIHBhcmVudCB0cmFuc2xhdGlvblxuXHRcdFx0XHR0ciA9IHBhcmVudFBvc2UudHJhbnNsYXRpb247XG5cdFx0XHRcdHQueCA9IC13MSp4MiArIHgxKncyIC0geTEqejIgKyB6MSp5MiArIHRyLng7XG5cdFx0XHRcdHQueSA9IC13MSp5MiArIHgxKnoyICsgeTEqdzIgLSB6MSp4MiArIHRyLnk7XG5cdFx0XHRcdHQueiA9IC13MSp6MiAtIHgxKnkyICsgeTEqeDIgKyB6MSp3MiArIHRyLno7XG5cblx0XHRcdFx0Ly8gYXBwZW5kIHBhcmVudCBvcmllbnRhdGlvblxuXHRcdFx0XHR4MSA9IG9yLng7XG5cdFx0XHRcdHkxID0gb3IueTtcblx0XHRcdFx0ejEgPSBvci56O1xuXHRcdFx0XHR3MSA9IG9yLnc7XG5cdFx0XHRcdG9yID0gcG9zZS5vcmllbnRhdGlvbjtcblx0XHRcdFx0eDIgPSBvci54O1xuXHRcdFx0XHR5MiA9IG9yLnk7XG5cdFx0XHRcdHoyID0gb3Iuejtcblx0XHRcdFx0dzIgPSBvci53O1xuXG5cdFx0XHRcdHEudyA9IHcxKncyIC0geDEqeDIgLSB5MSp5MiAtIHoxKnoyO1xuXHRcdFx0XHRxLnggPSB3MSp4MiArIHgxKncyICsgeTEqejIgLSB6MSp5Mjtcblx0XHRcdFx0cS55ID0gdzEqeTIgLSB4MSp6MiArIHkxKncyICsgejEqeDI7XG5cdFx0XHRcdHEueiA9IHcxKnoyICsgeDEqeTIgLSB5MSp4MiArIHoxKncyO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgb25UcmFuc2l0aW9uQ29tcGxldGUoZXZlbnQ6QW5pbWF0aW9uU3RhdGVFdmVudClcblx0e1xuXHRcdGlmIChldmVudC50eXBlID09IEFuaW1hdGlvblN0YXRlRXZlbnQuVFJBTlNJVElPTl9DT01QTEVURSkge1xuXHRcdFx0ZXZlbnQuYW5pbWF0aW9uTm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKEFuaW1hdGlvblN0YXRlRXZlbnQuVFJBTlNJVElPTl9DT01QTEVURSwgdGhpcy5fb25UcmFuc2l0aW9uQ29tcGxldGVEZWxlZ2F0ZSk7XG5cdFx0XHQvL2lmIHRoaXMgaXMgdGhlIGN1cnJlbnQgYWN0aXZlIHN0YXRlIHRyYW5zaXRpb24sIHJldmVydCBjb250cm9sIHRvIHRoZSBhY3RpdmUgbm9kZVxuXHRcdFx0aWYgKHRoaXMuX3BBY3RpdmVTdGF0ZSA9PSBldmVudC5hbmltYXRpb25TdGF0ZSkge1xuXHRcdFx0XHR0aGlzLl9wQWN0aXZlTm9kZSA9IHRoaXMuX3BBbmltYXRpb25TZXQuZ2V0QW5pbWF0aW9uKHRoaXMuX3BBY3RpdmVBbmltYXRpb25OYW1lKTtcblx0XHRcdFx0dGhpcy5fcEFjdGl2ZVN0YXRlID0gdGhpcy5nZXRBbmltYXRpb25TdGF0ZSh0aGlzLl9wQWN0aXZlTm9kZSk7XG5cdFx0XHRcdHRoaXMuX2FjdGl2ZVNrZWxldG9uU3RhdGUgPSA8SVNrZWxldG9uQW5pbWF0aW9uU3RhdGU+IHRoaXMuX3BBY3RpdmVTdGF0ZTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIG9uSW5kaWNlc1VwZGF0ZShldmVudDpTdWJHZW9tZXRyeUV2ZW50KVxuXHR7XG5cdFx0dmFyIHN1Ykdlb21ldHJ5OlRyaWFuZ2xlU3ViR2VvbWV0cnkgPSA8VHJpYW5nbGVTdWJHZW9tZXRyeT4gZXZlbnQudGFyZ2V0O1xuXG5cdFx0KDxUcmlhbmdsZVN1Ykdlb21ldHJ5PiB0aGlzLl9tb3JwaGVkU3ViR2VvbWV0cnlbc3ViR2VvbWV0cnkuaWRdKS51cGRhdGVJbmRpY2VzKHN1Ykdlb21ldHJ5LmluZGljZXMpO1xuXHR9XG5cblx0cHJpdmF0ZSBvblZlcnRpY2VzVXBkYXRlKGV2ZW50OlN1Ykdlb21ldHJ5RXZlbnQpXG5cdHtcblx0XHR2YXIgc3ViR2VvbWV0cnk6VHJpYW5nbGVTdWJHZW9tZXRyeSA9IDxUcmlhbmdsZVN1Ykdlb21ldHJ5PiBldmVudC50YXJnZXQ7XG5cdFx0dmFyIG1vcnBoR2VvbWV0cnk6VHJpYW5nbGVTdWJHZW9tZXRyeSA9IDxUcmlhbmdsZVN1Ykdlb21ldHJ5PiB0aGlzLl9tb3JwaGVkU3ViR2VvbWV0cnlbc3ViR2VvbWV0cnkuaWRdO1xuXG5cdFx0c3dpdGNoKGV2ZW50LmRhdGFUeXBlKSB7XG5cdFx0XHRjYXNlIFRyaWFuZ2xlU3ViR2VvbWV0cnkuVVZfREFUQTpcblx0XHRcdFx0bW9ycGhHZW9tZXRyeS51cGRhdGVVVnMoc3ViR2VvbWV0cnkudXZzKTtcblx0XHRcdGNhc2UgVHJpYW5nbGVTdWJHZW9tZXRyeS5TRUNPTkRBUllfVVZfREFUQTpcblx0XHRcdFx0bW9ycGhHZW9tZXRyeS51cGRhdGVVVnMoc3ViR2VvbWV0cnkuc2Vjb25kYXJ5VVZzKTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0ID0gU2tlbGV0b25BbmltYXRvcjsiXX0=