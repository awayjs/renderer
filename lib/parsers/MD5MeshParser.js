var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Quaternion = require("awayjs-core/lib/geom/Quaternion");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var URLLoaderDataFormat = require("awayjs-core/lib/net/URLLoaderDataFormat");
var ParserBase = require("awayjs-core/lib/parsers/ParserBase");
var DisplayObjectContainer = require("awayjs-display/lib/containers/DisplayObjectContainer");
var Geometry = require("awayjs-display/lib/base/Geometry");
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var Mesh = require("awayjs-display/lib/entities/Mesh");
var SkeletonAnimationSet = require("awayjs-renderergl/lib/animators/SkeletonAnimationSet");
var Skeleton = require("awayjs-renderergl/lib/animators/data/Skeleton");
var SkeletonJoint = require("awayjs-renderergl/lib/animators/data/SkeletonJoint");
// todo: create animation system, parse skeleton
/**
 * MD5MeshParser provides a parser for the md5mesh data type, providing the geometry of the md5 format.
 *
 * todo: optimize
 */
var MD5MeshParser = (function (_super) {
    __extends(MD5MeshParser, _super);
    /**
     * Creates a new MD5MeshParser object.
     */
    function MD5MeshParser(additionalRotationAxis, additionalRotationRadians) {
        if (additionalRotationAxis === void 0) { additionalRotationAxis = null; }
        if (additionalRotationRadians === void 0) { additionalRotationRadians = 0; }
        _super.call(this, URLLoaderDataFormat.TEXT);
        this._parseIndex = 0;
        this._line = 0;
        this._charLineIndex = 0;
        this._rotationQuat = new Quaternion();
        this._rotationQuat.fromAxisAngle(Vector3D.X_AXIS, -Math.PI * .5);
        if (additionalRotationAxis) {
            var quat = new Quaternion();
            quat.fromAxisAngle(additionalRotationAxis, additionalRotationRadians);
            this._rotationQuat.multiply(this._rotationQuat, quat);
        }
    }
    /**
     * Indicates whether or not a given file extension is supported by the parser.
     * @param extension The file extension of a potential file to be parsed.
     * @return Whether or not the given file type is supported.
     */
    MD5MeshParser.supportsType = function (extension) {
        extension = extension.toLowerCase();
        return extension == "md5mesh";
    };
    /**
     * Tests whether a data block can be parsed by the parser.
     * @param data The data block to potentially be parsed.
     * @return Whether or not the given data is supported.
     */
    MD5MeshParser.supportsData = function (data) {
        return false;
    };
    /**
     * @inheritDoc
     */
    MD5MeshParser.prototype._pProceedParsing = function () {
        var token;
        if (!this._startedParsing) {
            this._textData = this._pGetTextData();
            this._startedParsing = true;
        }
        while (this._pHasTime()) {
            token = this.getNextToken();
            switch (token) {
                case MD5MeshParser.COMMENT_TOKEN:
                    this.ignoreLine();
                    break;
                case MD5MeshParser.VERSION_TOKEN:
                    this._version = this.getNextInt();
                    if (this._version != 10)
                        throw new Error("Unknown version number encountered!");
                    break;
                case MD5MeshParser.COMMAND_LINE_TOKEN:
                    this.parseCMD();
                    break;
                case MD5MeshParser.NUM_JOINTS_TOKEN:
                    this._numJoints = this.getNextInt();
                    this._bindPoses = new Array(this._numJoints);
                    break;
                case MD5MeshParser.NUM_MESHES_TOKEN:
                    this._numMeshes = this.getNextInt();
                    break;
                case MD5MeshParser.JOINTS_TOKEN:
                    this.parseJoints();
                    break;
                case MD5MeshParser.MESH_TOKEN:
                    this.parseMesh();
                    break;
                default:
                    if (!this._reachedEOF)
                        this.sendUnknownKeywordError();
            }
            if (this._reachedEOF) {
                this.calculateMaxJointCount();
                this._animationSet = new SkeletonAnimationSet(this._maxJointCount);
                this._mesh = new Mesh(new Geometry(), null);
                this._geometry = this._mesh.geometry;
                for (var i = 0; i < this._meshData.length; ++i)
                    this._geometry.addSubGeometry(this.translateGeom(this._meshData[i].vertexData, this._meshData[i].weightData, this._meshData[i].indices));
                //_geometry.animation = _animation;
                //					_mesh.animationController = _animationController;
                //add to the content property
                this._pContent.addChild(this._mesh);
                this._pFinalizeAsset(this._geometry);
                this._pFinalizeAsset(this._mesh);
                this._pFinalizeAsset(this._skeleton);
                this._pFinalizeAsset(this._animationSet);
                return ParserBase.PARSING_DONE;
            }
        }
        return ParserBase.MORE_TO_PARSE;
    };
    MD5MeshParser.prototype._pStartParsing = function (frameLimit) {
        _super.prototype._pStartParsing.call(this, frameLimit);
        //create a content object for Loaders
        this._pContent = new DisplayObjectContainer();
    };
    MD5MeshParser.prototype.calculateMaxJointCount = function () {
        this._maxJointCount = 0;
        var numMeshData = this._meshData.length;
        for (var i = 0; i < numMeshData; ++i) {
            var meshData = this._meshData[i];
            var vertexData = meshData.vertexData;
            var numVerts = vertexData.length;
            for (var j = 0; j < numVerts; ++j) {
                var zeroWeights = this.countZeroWeightJoints(vertexData[j], meshData.weightData);
                var totalJoints = vertexData[j].countWeight - zeroWeights;
                if (totalJoints > this._maxJointCount)
                    this._maxJointCount = totalJoints;
            }
        }
    };
    MD5MeshParser.prototype.countZeroWeightJoints = function (vertex, weights) {
        var start = vertex.startWeight;
        var end = vertex.startWeight + vertex.countWeight;
        var count = 0;
        var weight;
        for (var i = start; i < end; ++i) {
            weight = weights[i].bias;
            if (weight == 0)
                ++count;
        }
        return count;
    };
    /**
     * Parses the skeleton's joints.
     */
    MD5MeshParser.prototype.parseJoints = function () {
        var ch;
        var joint;
        var pos;
        var quat;
        var i = 0;
        var token = this.getNextToken();
        if (token != "{")
            this.sendUnknownKeywordError();
        this._skeleton = new Skeleton();
        do {
            if (this._reachedEOF)
                this.sendEOFError();
            joint = new SkeletonJoint();
            joint.name = this.parseLiteralstring();
            joint.parentIndex = this.getNextInt();
            pos = this.parseVector3D();
            pos = this._rotationQuat.rotatePoint(pos);
            quat = this.parseQuaternion();
            // todo: check if this is correct, or maybe we want to actually store it as quats?
            this._bindPoses[i] = quat.toMatrix3D();
            this._bindPoses[i].appendTranslation(pos.x, pos.y, pos.z);
            var inv = this._bindPoses[i].clone();
            inv.invert();
            joint.inverseBindPose = inv.rawData;
            this._skeleton.joints[i++] = joint;
            ch = this.getNextChar();
            if (ch == "/") {
                this.putBack();
                ch = this.getNextToken();
                if (ch == MD5MeshParser.COMMENT_TOKEN)
                    this.ignoreLine();
                ch = this.getNextChar();
            }
            if (ch != "}")
                this.putBack();
        } while (ch != "}");
    };
    /**
     * Puts back the last read character into the data stream.
     */
    MD5MeshParser.prototype.putBack = function () {
        this._parseIndex--;
        this._charLineIndex--;
        this._reachedEOF = this._parseIndex >= this._textData.length;
    };
    /**
     * Parses the mesh geometry.
     */
    MD5MeshParser.prototype.parseMesh = function () {
        var token = this.getNextToken();
        var ch;
        var vertexData;
        var weights;
        var indices /*uint*/;
        if (token != "{")
            this.sendUnknownKeywordError();
        if (this._shaders == null)
            this._shaders = new Array();
        while (ch != "}") {
            ch = this.getNextToken();
            switch (ch) {
                case MD5MeshParser.COMMENT_TOKEN:
                    this.ignoreLine();
                    break;
                case MD5MeshParser.MESH_SHADER_TOKEN:
                    this._shaders.push(this.parseLiteralstring());
                    break;
                case MD5MeshParser.MESH_NUM_VERTS_TOKEN:
                    vertexData = new Array(this.getNextInt());
                    break;
                case MD5MeshParser.MESH_NUM_TRIS_TOKEN:
                    indices = new Array(this.getNextInt() * 3);
                    break;
                case MD5MeshParser.MESH_NUM_WEIGHTS_TOKEN:
                    weights = new Array(this.getNextInt());
                    break;
                case MD5MeshParser.MESH_VERT_TOKEN:
                    this.parseVertex(vertexData);
                    break;
                case MD5MeshParser.MESH_TRI_TOKEN:
                    this.parseTri(indices);
                    break;
                case MD5MeshParser.MESH_WEIGHT_TOKEN:
                    this.parseJoint(weights);
                    break;
            }
        }
        if (this._meshData == null)
            this._meshData = new Array();
        var i = this._meshData.length;
        this._meshData[i] = new MeshData();
        this._meshData[i].vertexData = vertexData;
        this._meshData[i].weightData = weights;
        this._meshData[i].indices = indices;
    };
    /**
     * Converts the mesh data to a SkinnedSub instance.
     * @param vertexData The mesh's vertices.
     * @param weights The joint weights per vertex.
     * @param indices The indices for the faces.
     * @return A SubGeometry instance containing all geometrical data for the current mesh.
     */
    MD5MeshParser.prototype.translateGeom = function (vertexData, weights, indices /*uint*/) {
        var len = vertexData.length;
        var v1 /*int*/, v2 /*int*/, v3 /*int*/;
        var vertex;
        var weight;
        var bindPose;
        var pos;
        var subGeom = new TriangleSubGeometry(true);
        var uvs = new Array(len * 2);
        var vertices = new Array(len * 3);
        var jointIndices = new Array(len * this._maxJointCount);
        var jointWeights = new Array(len * this._maxJointCount);
        var l = 0;
        var nonZeroWeights /*int*/;
        for (var i = 0; i < len; ++i) {
            vertex = vertexData[i];
            v1 = vertex.index * 3;
            v2 = v1 + 1;
            v3 = v1 + 2;
            vertices[v1] = vertices[v2] = vertices[v3] = 0;
            nonZeroWeights = 0;
            for (var j = 0; j < vertex.countWeight; ++j) {
                weight = weights[vertex.startWeight + j];
                if (weight.bias > 0) {
                    bindPose = this._bindPoses[weight.joint];
                    pos = bindPose.transformVector(weight.pos);
                    vertices[v1] += pos.x * weight.bias;
                    vertices[v2] += pos.y * weight.bias;
                    vertices[v3] += pos.z * weight.bias;
                    // indices need to be multiplied by 3 (amount of matrix registers)
                    jointIndices[l] = weight.joint * 3;
                    jointWeights[l++] = weight.bias;
                    ++nonZeroWeights;
                }
            }
            for (j = nonZeroWeights; j < this._maxJointCount; ++j) {
                jointIndices[l] = 0;
                jointWeights[l++] = 0;
            }
            v1 = vertex.index << 1;
            uvs[v1++] = vertex.s;
            uvs[v1] = vertex.t;
        }
        subGeom.jointsPerVertex = this._maxJointCount;
        subGeom.updateIndices(indices);
        subGeom.updatePositions(vertices);
        subGeom.updateUVs(uvs);
        subGeom.updateJointIndices(jointIndices);
        subGeom.updateJointWeights(jointWeights);
        // cause explicit updates
        subGeom.vertexNormals;
        subGeom.vertexTangents;
        // turn auto updates off because they may be animated and set explicitly
        subGeom.autoDeriveTangents = false;
        subGeom.autoDeriveNormals = false;
        return subGeom;
    };
    /**
     * Retrieve the next triplet of vertex indices that form a face.
     * @param indices The index list in which to store the read data.
     */
    MD5MeshParser.prototype.parseTri = function (indices /*uint*/) {
        var index = this.getNextInt() * 3;
        indices[index] = this.getNextInt();
        indices[index + 1] = this.getNextInt();
        indices[index + 2] = this.getNextInt();
    };
    /**
     * Reads a new joint data set for a single joint.
     * @param weights the target list to contain the weight data.
     */
    MD5MeshParser.prototype.parseJoint = function (weights) {
        var weight = new JointData();
        weight.index = this.getNextInt();
        weight.joint = this.getNextInt();
        weight.bias = this.getNextNumber();
        weight.pos = this.parseVector3D();
        weights[weight.index] = weight;
    };
    /**
     * Reads the data for a single vertex.
     * @param vertexData The list to contain the vertex data.
     */
    MD5MeshParser.prototype.parseVertex = function (vertexData) {
        var vertex = new VertexData();
        vertex.index = this.getNextInt();
        this.parseUV(vertex);
        vertex.startWeight = this.getNextInt();
        vertex.countWeight = this.getNextInt();
        //			if (vertex.countWeight > _maxJointCount) _maxJointCount = vertex.countWeight;
        vertexData[vertex.index] = vertex;
    };
    /**
     * Reads the next uv coordinate.
     * @param vertexData The vertexData to contain the UV coordinates.
     */
    MD5MeshParser.prototype.parseUV = function (vertexData) {
        var ch = this.getNextToken();
        if (ch != "(")
            this.sendParseError("(");
        vertexData.s = this.getNextNumber();
        vertexData.t = this.getNextNumber();
        if (this.getNextToken() != ")")
            this.sendParseError(")");
    };
    /**
     * Gets the next token in the data stream.
     */
    MD5MeshParser.prototype.getNextToken = function () {
        var ch;
        var token = "";
        while (!this._reachedEOF) {
            ch = this.getNextChar();
            if (ch == " " || ch == "\r" || ch == "\n" || ch == "\t") {
                if (token != MD5MeshParser.COMMENT_TOKEN)
                    this.skipWhiteSpace();
                if (token != "")
                    return token;
            }
            else
                token += ch;
            if (token == MD5MeshParser.COMMENT_TOKEN)
                return token;
        }
        return token;
    };
    /**
     * Skips all whitespace in the data stream.
     */
    MD5MeshParser.prototype.skipWhiteSpace = function () {
        var ch;
        do
            ch = this.getNextChar();
        while (ch == "\n" || ch == " " || ch == "\r" || ch == "\t");
        this.putBack();
    };
    /**
     * Skips to the next line.
     */
    MD5MeshParser.prototype.ignoreLine = function () {
        var ch;
        while (!this._reachedEOF && ch != "\n")
            ch = this.getNextChar();
    };
    /**
     * Retrieves the next single character in the data stream.
     */
    MD5MeshParser.prototype.getNextChar = function () {
        var ch = this._textData.charAt(this._parseIndex++);
        if (ch == "\n") {
            ++this._line;
            this._charLineIndex = 0;
        }
        else if (ch != "\r")
            ++this._charLineIndex;
        if (this._parseIndex >= this._textData.length)
            this._reachedEOF = true;
        return ch;
    };
    /**
     * Retrieves the next integer in the data stream.
     */
    MD5MeshParser.prototype.getNextInt = function () {
        var i = parseInt(this.getNextToken());
        if (isNaN(i))
            this.sendParseError("int type");
        return i;
    };
    /**
     * Retrieves the next floating point number in the data stream.
     */
    MD5MeshParser.prototype.getNextNumber = function () {
        var f = parseFloat(this.getNextToken());
        if (isNaN(f))
            this.sendParseError("float type");
        return f;
    };
    /**
     * Retrieves the next 3d vector in the data stream.
     */
    MD5MeshParser.prototype.parseVector3D = function () {
        var vec = new Vector3D();
        var ch = this.getNextToken();
        if (ch != "(")
            this.sendParseError("(");
        vec.x = -this.getNextNumber();
        vec.y = this.getNextNumber();
        vec.z = this.getNextNumber();
        if (this.getNextToken() != ")")
            this.sendParseError(")");
        return vec;
    };
    /**
     * Retrieves the next quaternion in the data stream.
     */
    MD5MeshParser.prototype.parseQuaternion = function () {
        var quat = new Quaternion();
        var ch = this.getNextToken();
        if (ch != "(")
            this.sendParseError("(");
        quat.x = this.getNextNumber();
        quat.y = -this.getNextNumber();
        quat.z = -this.getNextNumber();
        // quat supposed to be unit length
        var t = 1 - quat.x * quat.x - quat.y * quat.y - quat.z * quat.z;
        quat.w = t < 0 ? 0 : -Math.sqrt(t);
        if (this.getNextToken() != ")")
            this.sendParseError(")");
        var rotQuat = new Quaternion();
        rotQuat.multiply(this._rotationQuat, quat);
        return rotQuat;
    };
    /**
     * Parses the command line data.
     */
    MD5MeshParser.prototype.parseCMD = function () {
        // just ignore the command line property
        this.parseLiteralstring();
    };
    /**
     * Retrieves the next literal string in the data stream. A literal string is a sequence of characters bounded
     * by double quotes.
     */
    MD5MeshParser.prototype.parseLiteralstring = function () {
        this.skipWhiteSpace();
        var ch = this.getNextChar();
        var str = "";
        if (ch != "\"")
            this.sendParseError("\"");
        do {
            if (this._reachedEOF)
                this.sendEOFError();
            ch = this.getNextChar();
            if (ch != "\"")
                str += ch;
        } while (ch != "\"");
        return str;
    };
    /**
     * Throws an end-of-file error when a premature end of file was encountered.
     */
    MD5MeshParser.prototype.sendEOFError = function () {
        throw new Error("Unexpected end of file");
    };
    /**
     * Throws an error when an unexpected token was encountered.
     * @param expected The token type that was actually expected.
     */
    MD5MeshParser.prototype.sendParseError = function (expected) {
        throw new Error("Unexpected token at line " + (this._line + 1) + ", character " + this._charLineIndex + ". " + expected + " expected, but " + this._textData.charAt(this._parseIndex - 1) + " encountered");
    };
    /**
     * Throws an error when an unknown keyword was encountered.
     */
    MD5MeshParser.prototype.sendUnknownKeywordError = function () {
        throw new Error("Unknown keyword at line " + (this._line + 1) + ", character " + this._charLineIndex + ". ");
    };
    MD5MeshParser.VERSION_TOKEN = "MD5Version";
    MD5MeshParser.COMMAND_LINE_TOKEN = "commandline";
    MD5MeshParser.NUM_JOINTS_TOKEN = "numJoints";
    MD5MeshParser.NUM_MESHES_TOKEN = "numMeshes";
    MD5MeshParser.COMMENT_TOKEN = "//";
    MD5MeshParser.JOINTS_TOKEN = "joints";
    MD5MeshParser.MESH_TOKEN = "mesh";
    MD5MeshParser.MESH_SHADER_TOKEN = "shader";
    MD5MeshParser.MESH_NUM_VERTS_TOKEN = "numverts";
    MD5MeshParser.MESH_VERT_TOKEN = "vert";
    MD5MeshParser.MESH_NUM_TRIS_TOKEN = "numtris";
    MD5MeshParser.MESH_TRI_TOKEN = "tri";
    MD5MeshParser.MESH_NUM_WEIGHTS_TOKEN = "numweights";
    MD5MeshParser.MESH_WEIGHT_TOKEN = "weight";
    return MD5MeshParser;
})(ParserBase);
var VertexData = (function () {
    function VertexData() {
    }
    return VertexData;
})();
var JointData = (function () {
    function JointData() {
    }
    return JointData;
})();
var MeshData = (function () {
    function MeshData() {
    }
    return MeshData;
})();
module.exports = MD5MeshParser;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXJzZXJzL21kNW1lc2hwYXJzZXIudHMiXSwibmFtZXMiOlsiTUQ1TWVzaFBhcnNlciIsIk1ENU1lc2hQYXJzZXIuY29uc3RydWN0b3IiLCJNRDVNZXNoUGFyc2VyLnN1cHBvcnRzVHlwZSIsIk1ENU1lc2hQYXJzZXIuc3VwcG9ydHNEYXRhIiwiTUQ1TWVzaFBhcnNlci5fcFByb2NlZWRQYXJzaW5nIiwiTUQ1TWVzaFBhcnNlci5fcFN0YXJ0UGFyc2luZyIsIk1ENU1lc2hQYXJzZXIuY2FsY3VsYXRlTWF4Sm9pbnRDb3VudCIsIk1ENU1lc2hQYXJzZXIuY291bnRaZXJvV2VpZ2h0Sm9pbnRzIiwiTUQ1TWVzaFBhcnNlci5wYXJzZUpvaW50cyIsIk1ENU1lc2hQYXJzZXIucHV0QmFjayIsIk1ENU1lc2hQYXJzZXIucGFyc2VNZXNoIiwiTUQ1TWVzaFBhcnNlci50cmFuc2xhdGVHZW9tIiwiTUQ1TWVzaFBhcnNlci5wYXJzZVRyaSIsIk1ENU1lc2hQYXJzZXIucGFyc2VKb2ludCIsIk1ENU1lc2hQYXJzZXIucGFyc2VWZXJ0ZXgiLCJNRDVNZXNoUGFyc2VyLnBhcnNlVVYiLCJNRDVNZXNoUGFyc2VyLmdldE5leHRUb2tlbiIsIk1ENU1lc2hQYXJzZXIuc2tpcFdoaXRlU3BhY2UiLCJNRDVNZXNoUGFyc2VyLmlnbm9yZUxpbmUiLCJNRDVNZXNoUGFyc2VyLmdldE5leHRDaGFyIiwiTUQ1TWVzaFBhcnNlci5nZXROZXh0SW50IiwiTUQ1TWVzaFBhcnNlci5nZXROZXh0TnVtYmVyIiwiTUQ1TWVzaFBhcnNlci5wYXJzZVZlY3RvcjNEIiwiTUQ1TWVzaFBhcnNlci5wYXJzZVF1YXRlcm5pb24iLCJNRDVNZXNoUGFyc2VyLnBhcnNlQ01EIiwiTUQ1TWVzaFBhcnNlci5wYXJzZUxpdGVyYWxzdHJpbmciLCJNRDVNZXNoUGFyc2VyLnNlbmRFT0ZFcnJvciIsIk1ENU1lc2hQYXJzZXIuc2VuZFBhcnNlRXJyb3IiLCJNRDVNZXNoUGFyc2VyLnNlbmRVbmtub3duS2V5d29yZEVycm9yIiwiVmVydGV4RGF0YSIsIlZlcnRleERhdGEuY29uc3RydWN0b3IiLCJKb2ludERhdGEiLCJKb2ludERhdGEuY29uc3RydWN0b3IiLCJNZXNoRGF0YSIsIk1lc2hEYXRhLmNvbnN0cnVjdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxJQUFPLFVBQVUsV0FBZ0IsaUNBQWlDLENBQUMsQ0FBQztBQUNwRSxJQUFPLFFBQVEsV0FBaUIsK0JBQStCLENBQUMsQ0FBQztBQUNqRSxJQUFPLG1CQUFtQixXQUFjLHlDQUF5QyxDQUFDLENBQUM7QUFDbkYsSUFBTyxVQUFVLFdBQWdCLG9DQUFvQyxDQUFDLENBQUM7QUFFdkUsSUFBTyxzQkFBc0IsV0FBYSxzREFBc0QsQ0FBQyxDQUFDO0FBQ2xHLElBQU8sUUFBUSxXQUFpQixrQ0FBa0MsQ0FBQyxDQUFDO0FBQ3BFLElBQU8sbUJBQW1CLFdBQWMsNkNBQTZDLENBQUMsQ0FBQztBQUN2RixJQUFPLElBQUksV0FBa0Isa0NBQWtDLENBQUMsQ0FBQztBQUVqRSxJQUFPLG9CQUFvQixXQUFjLHNEQUFzRCxDQUFDLENBQUM7QUFDakcsSUFBTyxRQUFRLFdBQWlCLCtDQUErQyxDQUFDLENBQUM7QUFDakYsSUFBTyxhQUFhLFdBQWUsb0RBQW9ELENBQUMsQ0FBQztBQUV6RixBQU9BLGdEQVBnRDtBQUVoRDs7OztHQUlHO0lBQ0csYUFBYTtJQUFTQSxVQUF0QkEsYUFBYUEsVUFBbUJBO0lBeUNyQ0E7O09BRUdBO0lBQ0hBLFNBNUNLQSxhQUFhQSxDQTRDTkEsc0JBQXNDQSxFQUFFQSx5QkFBb0NBO1FBQTVFQyxzQ0FBc0NBLEdBQXRDQSw2QkFBc0NBO1FBQUVBLHlDQUFvQ0EsR0FBcENBLDZCQUFvQ0E7UUFFdkZBLGtCQUFNQSxtQkFBbUJBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBMUJ6QkEsZ0JBQVdBLEdBQWtCQSxDQUFDQSxDQUFDQTtRQUUvQkEsVUFBS0EsR0FBa0JBLENBQUNBLENBQUNBO1FBQ3pCQSxtQkFBY0EsR0FBa0JBLENBQUNBLENBQUNBO1FBd0J6Q0EsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsSUFBSUEsVUFBVUEsRUFBRUEsQ0FBQ0E7UUFFdENBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLGFBQWFBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEdBQUNBLEVBQUVBLENBQUNBLENBQUNBO1FBRS9EQSxFQUFFQSxDQUFDQSxDQUFDQSxzQkFBc0JBLENBQUNBLENBQUNBLENBQUNBO1lBQzVCQSxJQUFJQSxJQUFJQSxHQUFjQSxJQUFJQSxVQUFVQSxFQUFFQSxDQUFDQTtZQUN2Q0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0Esc0JBQXNCQSxFQUFFQSx5QkFBeUJBLENBQUNBLENBQUNBO1lBQ3RFQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUN2REEsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUFFREQ7Ozs7T0FJR0E7SUFDV0EsMEJBQVlBLEdBQTFCQSxVQUEyQkEsU0FBZ0JBO1FBRTFDRSxTQUFTQSxHQUFHQSxTQUFTQSxDQUFDQSxXQUFXQSxFQUFFQSxDQUFDQTtRQUNwQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsSUFBSUEsU0FBU0EsQ0FBQ0E7SUFDL0JBLENBQUNBO0lBRURGOzs7O09BSUdBO0lBQ1dBLDBCQUFZQSxHQUExQkEsVUFBMkJBLElBQVFBO1FBRWxDRyxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtJQUNkQSxDQUFDQTtJQUVESDs7T0FFR0E7SUFDSUEsd0NBQWdCQSxHQUF2QkE7UUFFQ0ksSUFBSUEsS0FBWUEsQ0FBQ0E7UUFFakJBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLENBQUNBO1lBQzNCQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQTtZQUN0Q0EsSUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDN0JBLENBQUNBO1FBRURBLE9BQU9BLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQ3pCQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxDQUFDQTtZQUM1QkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2ZBLEtBQUtBLGFBQWFBLENBQUNBLGFBQWFBO29CQUMvQkEsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7b0JBQ2xCQSxLQUFLQSxDQUFDQTtnQkFDUEEsS0FBS0EsYUFBYUEsQ0FBQ0EsYUFBYUE7b0JBQy9CQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQTtvQkFDbENBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLElBQUlBLEVBQUVBLENBQUNBO3dCQUN2QkEsTUFBTUEsSUFBSUEsS0FBS0EsQ0FBQ0EscUNBQXFDQSxDQUFDQSxDQUFDQTtvQkFDeERBLEtBQUtBLENBQUNBO2dCQUNQQSxLQUFLQSxhQUFhQSxDQUFDQSxrQkFBa0JBO29CQUNwQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0E7b0JBQ2hCQSxLQUFLQSxDQUFDQTtnQkFDUEEsS0FBS0EsYUFBYUEsQ0FBQ0EsZ0JBQWdCQTtvQkFDbENBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBO29CQUNwQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBV0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZEQSxLQUFLQSxDQUFDQTtnQkFDUEEsS0FBS0EsYUFBYUEsQ0FBQ0EsZ0JBQWdCQTtvQkFDbENBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBO29CQUNwQ0EsS0FBS0EsQ0FBQ0E7Z0JBQ1BBLEtBQUtBLGFBQWFBLENBQUNBLFlBQVlBO29CQUM5QkEsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7b0JBQ25CQSxLQUFLQSxDQUFDQTtnQkFDUEEsS0FBS0EsYUFBYUEsQ0FBQ0EsVUFBVUE7b0JBQzVCQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQTtvQkFDakJBLEtBQUtBLENBQUNBO2dCQUNQQTtvQkFDQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7d0JBQ3JCQSxJQUFJQSxDQUFDQSx1QkFBdUJBLEVBQUVBLENBQUNBO1lBQ2xDQSxDQUFDQTtZQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdEJBLElBQUlBLENBQUNBLHNCQUFzQkEsRUFBRUEsQ0FBQ0E7Z0JBQzlCQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxJQUFJQSxvQkFBb0JBLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBO2dCQUVuRUEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsSUFBSUEsUUFBUUEsRUFBRUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQzVDQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQTtnQkFFckNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQWtCQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxFQUFFQSxDQUFDQTtvQkFDNURBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLGNBQWNBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFVBQVVBLEVBQUVBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFVBQVVBLEVBQUVBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO2dCQUUxSUEsQUFJQUEsbUNBSm1DQTtnQkFDbkNBLHdEQUF3REE7Z0JBRXhEQSw2QkFBNkJBO2dCQUNIQSxJQUFJQSxDQUFDQSxTQUFVQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFFL0RBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO2dCQUNyQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtnQkFDckNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBO2dCQUN6Q0EsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsWUFBWUEsQ0FBQ0E7WUFDaENBLENBQUNBO1FBQ0ZBLENBQUNBO1FBQ0RBLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBLGFBQWFBLENBQUNBO0lBQ2pDQSxDQUFDQTtJQUVNSixzQ0FBY0EsR0FBckJBLFVBQXNCQSxVQUFpQkE7UUFFdENLLGdCQUFLQSxDQUFDQSxjQUFjQSxZQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtRQUVqQ0EsQUFDQUEscUNBRHFDQTtRQUNyQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsSUFBSUEsc0JBQXNCQSxFQUFFQSxDQUFDQTtJQUMvQ0EsQ0FBQ0E7SUFFT0wsOENBQXNCQSxHQUE5QkE7UUFFQ00sSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFFeEJBLElBQUlBLFdBQVdBLEdBQWtCQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUN2REEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBa0JBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFdBQVdBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBO1lBQ3JEQSxJQUFJQSxRQUFRQSxHQUFZQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMxQ0EsSUFBSUEsVUFBVUEsR0FBcUJBLFFBQVFBLENBQUNBLFVBQVVBLENBQUNBO1lBQ3ZEQSxJQUFJQSxRQUFRQSxHQUFrQkEsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFFaERBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQWtCQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxRQUFRQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtnQkFDbERBLElBQUlBLFdBQVdBLEdBQWtCQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLFFBQVFBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO2dCQUNoR0EsSUFBSUEsV0FBV0EsR0FBa0JBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFdBQVdBLEdBQUdBLFdBQVdBLENBQUNBO2dCQUN6RUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsV0FBV0EsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0E7b0JBQ3JDQSxJQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxXQUFXQSxDQUFDQTtZQUNwQ0EsQ0FBQ0E7UUFDRkEsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUFFT04sNkNBQXFCQSxHQUE3QkEsVUFBOEJBLE1BQWlCQSxFQUFFQSxPQUF3QkE7UUFFeEVPLElBQUlBLEtBQUtBLEdBQWtCQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQTtRQUM5Q0EsSUFBSUEsR0FBR0EsR0FBa0JBLE1BQU1BLENBQUNBLFdBQVdBLEdBQUdBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBO1FBQ2pFQSxJQUFJQSxLQUFLQSxHQUFrQkEsQ0FBQ0EsQ0FBQ0E7UUFDN0JBLElBQUlBLE1BQWFBLENBQUNBO1FBRWxCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFrQkEsS0FBS0EsRUFBRUEsQ0FBQ0EsR0FBR0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDakRBLE1BQU1BLEdBQUdBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBO1lBQ3pCQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDZkEsRUFBRUEsS0FBS0EsQ0FBQ0E7UUFDVkEsQ0FBQ0E7UUFFREEsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7SUFDZEEsQ0FBQ0E7SUFFRFA7O09BRUdBO0lBQ0tBLG1DQUFXQSxHQUFuQkE7UUFFQ1EsSUFBSUEsRUFBU0EsQ0FBQ0E7UUFDZEEsSUFBSUEsS0FBbUJBLENBQUNBO1FBQ3hCQSxJQUFJQSxHQUFZQSxDQUFDQTtRQUNqQkEsSUFBSUEsSUFBZUEsQ0FBQ0E7UUFDcEJBLElBQUlBLENBQUNBLEdBQWtCQSxDQUFDQSxDQUFDQTtRQUN6QkEsSUFBSUEsS0FBS0EsR0FBVUEsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0E7UUFFdkNBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLElBQUlBLEdBQUdBLENBQUNBO1lBQ2hCQSxJQUFJQSxDQUFDQSx1QkFBdUJBLEVBQUVBLENBQUNBO1FBRWhDQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxRQUFRQSxFQUFFQSxDQUFDQTtRQUVoQ0EsR0FBR0EsQ0FBQ0E7WUFDSEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7Z0JBQ3BCQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxDQUFDQTtZQUNyQkEsS0FBS0EsR0FBR0EsSUFBSUEsYUFBYUEsRUFBRUEsQ0FBQ0E7WUFDNUJBLEtBQUtBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLGtCQUFrQkEsRUFBRUEsQ0FBQ0E7WUFDdkNBLEtBQUtBLENBQUNBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBO1lBQ3RDQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQTtZQUMzQkEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDMUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBO1lBRTlCQSxBQUNBQSxrRkFEa0ZBO1lBQ2xGQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQTtZQUN2Q0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMxREEsSUFBSUEsR0FBR0EsR0FBWUEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7WUFDOUNBLEdBQUdBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1lBQ2JBLEtBQUtBLENBQUNBLGVBQWVBLEdBQUdBLEdBQUdBLENBQUNBLE9BQU9BLENBQUNBO1lBRXBDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUVuQ0EsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7WUFFeEJBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUNmQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtnQkFDZkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0E7Z0JBQ3pCQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxhQUFhQSxDQUFDQSxhQUFhQSxDQUFDQTtvQkFDckNBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBO2dCQUNuQkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7WUFFekJBLENBQUNBO1lBRURBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLENBQUNBO2dCQUNiQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtRQUNqQkEsQ0FBQ0EsUUFBUUEsRUFBRUEsSUFBSUEsR0FBR0EsRUFBRUE7SUFDckJBLENBQUNBO0lBRURSOztPQUVHQTtJQUNLQSwrQkFBT0EsR0FBZkE7UUFFQ1MsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7UUFDbkJBLElBQUlBLENBQUNBLGNBQWNBLEVBQUVBLENBQUNBO1FBQ3RCQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxJQUFJQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQTtJQUM5REEsQ0FBQ0E7SUFFRFQ7O09BRUdBO0lBQ0tBLGlDQUFTQSxHQUFqQkE7UUFFQ1UsSUFBSUEsS0FBS0EsR0FBVUEsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0E7UUFDdkNBLElBQUlBLEVBQVNBLENBQUNBO1FBQ2RBLElBQUlBLFVBQTRCQSxDQUFDQTtRQUNqQ0EsSUFBSUEsT0FBd0JBLENBQUNBO1FBQzdCQSxJQUFJQSxPQUFPQSxDQUFlQSxRQUFEQSxBQUFTQSxDQUFDQTtRQUVuQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsSUFBSUEsR0FBR0EsQ0FBQ0E7WUFDaEJBLElBQUlBLENBQUNBLHVCQUF1QkEsRUFBRUEsQ0FBQ0E7UUFFaENBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLElBQUlBLElBQUlBLENBQUNBO1lBQ3pCQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxJQUFJQSxLQUFLQSxFQUFVQSxDQUFDQTtRQUVyQ0EsT0FBT0EsRUFBRUEsSUFBSUEsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDbEJBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBO1lBQ3pCQSxNQUFNQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDWkEsS0FBS0EsYUFBYUEsQ0FBQ0EsYUFBYUE7b0JBQy9CQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQTtvQkFDbEJBLEtBQUtBLENBQUNBO2dCQUNQQSxLQUFLQSxhQUFhQSxDQUFDQSxpQkFBaUJBO29CQUNuQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxFQUFFQSxDQUFDQSxDQUFDQTtvQkFDOUNBLEtBQUtBLENBQUNBO2dCQUNQQSxLQUFLQSxhQUFhQSxDQUFDQSxvQkFBb0JBO29CQUN0Q0EsVUFBVUEsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBYUEsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7b0JBQ3REQSxLQUFLQSxDQUFDQTtnQkFDUEEsS0FBS0EsYUFBYUEsQ0FBQ0EsbUJBQW1CQTtvQkFDckNBLE9BQU9BLEdBQUdBLElBQUlBLEtBQUtBLENBQVNBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLEdBQUNBLENBQUNBLENBQUNBLENBQVVBO29CQUMxREEsS0FBS0EsQ0FBQ0E7Z0JBQ1BBLEtBQUtBLGFBQWFBLENBQUNBLHNCQUFzQkE7b0JBQ3hDQSxPQUFPQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFZQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQSxDQUFDQTtvQkFDbERBLEtBQUtBLENBQUNBO2dCQUNQQSxLQUFLQSxhQUFhQSxDQUFDQSxlQUFlQTtvQkFDakNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO29CQUM3QkEsS0FBS0EsQ0FBQ0E7Z0JBQ1BBLEtBQUtBLGFBQWFBLENBQUNBLGNBQWNBO29CQUNoQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZCQSxLQUFLQSxDQUFDQTtnQkFDUEEsS0FBS0EsYUFBYUEsQ0FBQ0EsaUJBQWlCQTtvQkFDbkNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO29CQUN6QkEsS0FBS0EsQ0FBQ0E7WUFDUkEsQ0FBQ0E7UUFDRkEsQ0FBQ0E7UUFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsSUFBSUEsSUFBSUEsQ0FBQ0E7WUFDMUJBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLEtBQUtBLEVBQVlBLENBQUNBO1FBRXhDQSxJQUFJQSxDQUFDQSxHQUFtQkEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDOUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLFFBQVFBLEVBQUVBLENBQUNBO1FBQ25DQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxVQUFVQSxHQUFHQSxVQUFVQSxDQUFDQTtRQUMxQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsVUFBVUEsR0FBR0EsT0FBT0EsQ0FBQ0E7UUFDdkNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLE9BQU9BLEdBQUdBLE9BQU9BLENBQUNBO0lBQ3JDQSxDQUFDQTtJQUVEVjs7Ozs7O09BTUdBO0lBQ0tBLHFDQUFhQSxHQUFyQkEsVUFBc0JBLFVBQTRCQSxFQUFFQSxPQUF3QkEsRUFBRUEsT0FBT0EsQ0FBZUEsUUFBREEsQUFBU0E7UUFFM0dXLElBQUlBLEdBQUdBLEdBQWtCQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUMzQ0EsSUFBSUEsRUFBRUEsQ0FBUUEsT0FBREEsQUFBUUEsRUFBRUEsRUFBRUEsQ0FBUUEsT0FBREEsQUFBUUEsRUFBRUEsRUFBRUEsQ0FBUUEsT0FBREEsQUFBUUEsQ0FBQ0E7UUFDNURBLElBQUlBLE1BQWlCQSxDQUFDQTtRQUN0QkEsSUFBSUEsTUFBZ0JBLENBQUNBO1FBQ3JCQSxJQUFJQSxRQUFpQkEsQ0FBQ0E7UUFDdEJBLElBQUlBLEdBQVlBLENBQUNBO1FBQ2pCQSxJQUFJQSxPQUFPQSxHQUF1QkEsSUFBSUEsbUJBQW1CQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUNoRUEsSUFBSUEsR0FBR0EsR0FBaUJBLElBQUlBLEtBQUtBLENBQVNBLEdBQUdBLEdBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQ2pEQSxJQUFJQSxRQUFRQSxHQUFpQkEsSUFBSUEsS0FBS0EsQ0FBU0EsR0FBR0EsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDdERBLElBQUlBLFlBQVlBLEdBQWlCQSxJQUFJQSxLQUFLQSxDQUFTQSxHQUFHQSxHQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtRQUM1RUEsSUFBSUEsWUFBWUEsR0FBaUJBLElBQUlBLEtBQUtBLENBQVNBLEdBQUdBLEdBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBO1FBQzVFQSxJQUFJQSxDQUFDQSxHQUFrQkEsQ0FBQ0EsQ0FBQ0E7UUFDekJBLElBQUlBLGNBQWNBLENBQVFBLE9BQURBLEFBQVFBLENBQUNBO1FBRWxDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFrQkEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDN0NBLE1BQU1BLEdBQUdBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3ZCQSxFQUFFQSxHQUFHQSxNQUFNQSxDQUFDQSxLQUFLQSxHQUFDQSxDQUFDQSxDQUFDQTtZQUNwQkEsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDWkEsRUFBRUEsR0FBR0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDWkEsUUFBUUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFFL0NBLGNBQWNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ25CQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFrQkEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsV0FBV0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7Z0JBQzVEQSxNQUFNQSxHQUFHQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxXQUFXQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDekNBLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUNyQkEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3pDQSxHQUFHQSxHQUFHQSxRQUFRQSxDQUFDQSxlQUFlQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDM0NBLFFBQVFBLENBQUNBLEVBQUVBLENBQUNBLElBQUlBLEdBQUdBLENBQUNBLENBQUNBLEdBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO29CQUNsQ0EsUUFBUUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsSUFBSUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7b0JBQ2xDQSxRQUFRQSxDQUFDQSxFQUFFQSxDQUFDQSxJQUFJQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtvQkFFbENBLEFBQ0FBLGtFQURrRUE7b0JBQ2xFQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxLQUFLQSxHQUFDQSxDQUFDQSxDQUFDQTtvQkFDakNBLFlBQVlBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO29CQUNoQ0EsRUFBRUEsY0FBY0EsQ0FBQ0E7Z0JBQ2xCQSxDQUFDQTtZQUNGQSxDQUFDQTtZQUVEQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxjQUFjQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtnQkFDdkRBLFlBQVlBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNwQkEsWUFBWUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDdkJBLENBQUNBO1lBRURBLEVBQUVBLEdBQUdBLE1BQU1BLENBQUNBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBO1lBQ3ZCQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNyQkEsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDcEJBLENBQUNBO1FBRURBLE9BQU9BLENBQUNBLGVBQWVBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBO1FBQzlDQSxPQUFPQSxDQUFDQSxhQUFhQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtRQUMvQkEsT0FBT0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7UUFDbENBLE9BQU9BLENBQUNBLFNBQVNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ3ZCQSxPQUFPQSxDQUFDQSxrQkFBa0JBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBO1FBQ3pDQSxPQUFPQSxDQUFDQSxrQkFBa0JBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBO1FBQ3pDQSxBQUNBQSx5QkFEeUJBO1FBQ3pCQSxPQUFPQSxDQUFDQSxhQUFhQSxDQUFDQTtRQUN0QkEsT0FBT0EsQ0FBQ0EsY0FBY0EsQ0FBQ0E7UUFDdkJBLEFBQ0FBLHdFQUR3RUE7UUFDeEVBLE9BQU9BLENBQUNBLGtCQUFrQkEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDbkNBLE9BQU9BLENBQUNBLGlCQUFpQkEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFFbENBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBO0lBQ2hCQSxDQUFDQTtJQUVEWDs7O09BR0dBO0lBQ0tBLGdDQUFRQSxHQUFoQkEsVUFBaUJBLE9BQU9BLENBQWVBLFFBQURBLEFBQVNBO1FBRTlDWSxJQUFJQSxLQUFLQSxHQUFrQkEsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsR0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDL0NBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBO1FBQ25DQSxPQUFPQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQTtRQUN2Q0EsT0FBT0EsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7SUFDeENBLENBQUNBO0lBRURaOzs7T0FHR0E7SUFDS0Esa0NBQVVBLEdBQWxCQSxVQUFtQkEsT0FBd0JBO1FBRTFDYSxJQUFJQSxNQUFNQSxHQUFhQSxJQUFJQSxTQUFTQSxFQUFFQSxDQUFDQTtRQUN2Q0EsTUFBTUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7UUFDakNBLE1BQU1BLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBO1FBQ2pDQSxNQUFNQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQTtRQUNuQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0E7UUFDbENBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBO0lBQ2hDQSxDQUFDQTtJQUVEYjs7O09BR0dBO0lBQ0tBLG1DQUFXQSxHQUFuQkEsVUFBb0JBLFVBQTRCQTtRQUUvQ2MsSUFBSUEsTUFBTUEsR0FBY0EsSUFBSUEsVUFBVUEsRUFBRUEsQ0FBQ0E7UUFDekNBLE1BQU1BLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBO1FBQ2pDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUNyQkEsTUFBTUEsQ0FBQ0EsV0FBV0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7UUFDdkNBLE1BQU1BLENBQUNBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBO1FBQ3ZDQSxBQUNBQSxrRkFEa0ZBO1FBQ2xGQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQTtJQUNuQ0EsQ0FBQ0E7SUFFRGQ7OztPQUdHQTtJQUNLQSwrQkFBT0EsR0FBZkEsVUFBZ0JBLFVBQXFCQTtRQUVwQ2UsSUFBSUEsRUFBRUEsR0FBVUEsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0E7UUFDcENBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLENBQUNBO1lBQ2JBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQzFCQSxVQUFVQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQTtRQUNwQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0E7UUFFcENBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLElBQUlBLEdBQUdBLENBQUNBO1lBQzlCQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtJQUMzQkEsQ0FBQ0E7SUFFRGY7O09BRUdBO0lBQ0tBLG9DQUFZQSxHQUFwQkE7UUFFQ2dCLElBQUlBLEVBQVNBLENBQUNBO1FBQ2RBLElBQUlBLEtBQUtBLEdBQVVBLEVBQUVBLENBQUNBO1FBRXRCQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxFQUFFQSxDQUFDQTtZQUMxQkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7WUFDeEJBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLElBQUlBLEVBQUVBLElBQUlBLElBQUlBLElBQUlBLEVBQUVBLElBQUlBLElBQUlBLElBQUlBLEVBQUVBLElBQUlBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUN6REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsSUFBSUEsYUFBYUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7b0JBQ3hDQSxJQUFJQSxDQUFDQSxjQUFjQSxFQUFFQSxDQUFDQTtnQkFDdkJBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLElBQUlBLEVBQUVBLENBQUNBO29CQUNmQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUNmQSxDQUFDQTtZQUFDQSxJQUFJQTtnQkFDTEEsS0FBS0EsSUFBSUEsRUFBRUEsQ0FBQ0E7WUFFYkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsSUFBSUEsYUFBYUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7Z0JBQ3hDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtRQUNmQSxDQUFDQTtRQUVEQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtJQUNkQSxDQUFDQTtJQUVEaEI7O09BRUdBO0lBQ0tBLHNDQUFjQSxHQUF0QkE7UUFFQ2lCLElBQUlBLEVBQVNBLENBQUNBO1FBRWRBO1lBQ0NBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO2VBQVFBLEVBQUVBLElBQUlBLElBQUlBLElBQUlBLEVBQUVBLElBQUlBLEdBQUdBLElBQUlBLEVBQUVBLElBQUlBLElBQUlBLElBQUlBLEVBQUVBLElBQUlBLElBQUlBLEVBQUVBO1FBRXRGQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtJQUNoQkEsQ0FBQ0E7SUFFRGpCOztPQUVHQTtJQUNLQSxrQ0FBVUEsR0FBbEJBO1FBRUNrQixJQUFJQSxFQUFTQSxDQUFDQTtRQUNkQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxJQUFJQSxFQUFFQSxJQUFJQSxJQUFJQTtZQUNyQ0EsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7SUFDMUJBLENBQUNBO0lBRURsQjs7T0FFR0E7SUFDS0EsbUNBQVdBLEdBQW5CQTtRQUVDbUIsSUFBSUEsRUFBRUEsR0FBVUEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFFMURBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hCQSxFQUFFQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUNiQSxJQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUN6QkEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsSUFBSUEsQ0FBQ0E7WUFDckJBLEVBQUVBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBO1FBRXZCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxJQUFJQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUM3Q0EsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFFekJBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBO0lBQ1hBLENBQUNBO0lBRURuQjs7T0FFR0E7SUFDS0Esa0NBQVVBLEdBQWxCQTtRQUVDb0IsSUFBSUEsQ0FBQ0EsR0FBVUEsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFDN0NBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ1pBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO1FBQ2pDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUNWQSxDQUFDQTtJQUVEcEI7O09BRUdBO0lBQ0tBLHFDQUFhQSxHQUFyQkE7UUFFQ3FCLElBQUlBLENBQUNBLEdBQVVBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBLENBQUNBO1FBQy9DQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNaQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTtRQUNuQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDVkEsQ0FBQ0E7SUFFRHJCOztPQUVHQTtJQUNLQSxxQ0FBYUEsR0FBckJBO1FBRUNzQixJQUFJQSxHQUFHQSxHQUFZQSxJQUFJQSxRQUFRQSxFQUFFQSxDQUFDQTtRQUNsQ0EsSUFBSUEsRUFBRUEsR0FBVUEsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0E7UUFFcENBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLENBQUNBO1lBQ2JBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQzFCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQTtRQUM5QkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0E7UUFDN0JBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBO1FBRTdCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxJQUFJQSxHQUFHQSxDQUFDQTtZQUM5QkEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFFMUJBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBO0lBQ1pBLENBQUNBO0lBRUR0Qjs7T0FFR0E7SUFDS0EsdUNBQWVBLEdBQXZCQTtRQUVDdUIsSUFBSUEsSUFBSUEsR0FBY0EsSUFBSUEsVUFBVUEsRUFBRUEsQ0FBQ0E7UUFDdkNBLElBQUlBLEVBQUVBLEdBQVVBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBO1FBRXBDQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxHQUFHQSxDQUFDQTtZQUNiQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0E7UUFDOUJBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBO1FBQy9CQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQTtRQUUvQkEsQUFDQUEsa0NBRGtDQTtZQUM5QkEsQ0FBQ0EsR0FBVUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDakVBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLEdBQUVBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBRWxDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxJQUFJQSxHQUFHQSxDQUFDQTtZQUM5QkEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFFMUJBLElBQUlBLE9BQU9BLEdBQWNBLElBQUlBLFVBQVVBLEVBQUVBLENBQUNBO1FBQzFDQSxPQUFPQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUMzQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7SUFDaEJBLENBQUNBO0lBRUR2Qjs7T0FFR0E7SUFDS0EsZ0NBQVFBLEdBQWhCQTtRQUVDd0IsQUFDQUEsd0NBRHdDQTtRQUN4Q0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxFQUFFQSxDQUFDQTtJQUMzQkEsQ0FBQ0E7SUFFRHhCOzs7T0FHR0E7SUFDS0EsMENBQWtCQSxHQUExQkE7UUFFQ3lCLElBQUlBLENBQUNBLGNBQWNBLEVBQUVBLENBQUNBO1FBRXRCQSxJQUFJQSxFQUFFQSxHQUFVQSxJQUFJQSxDQUFDQSxXQUFXQSxFQUFFQSxDQUFDQTtRQUNuQ0EsSUFBSUEsR0FBR0EsR0FBVUEsRUFBRUEsQ0FBQ0E7UUFFcEJBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLElBQUlBLENBQUNBO1lBQ2RBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBRTNCQSxHQUFHQSxDQUFDQTtZQUNIQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQTtnQkFDcEJBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBO1lBQ3JCQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxFQUFFQSxDQUFDQTtZQUN4QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsSUFBSUEsQ0FBQ0E7Z0JBQ2RBLEdBQUdBLElBQUlBLEVBQUVBLENBQUNBO1FBQ1pBLENBQUNBLFFBQVFBLEVBQUVBLElBQUlBLElBQUlBLEVBQUVBO1FBRXJCQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQTtJQUNaQSxDQUFDQTtJQUVEekI7O09BRUdBO0lBQ0tBLG9DQUFZQSxHQUFwQkE7UUFFQzBCLE1BQU1BLElBQUlBLEtBQUtBLENBQUNBLHdCQUF3QkEsQ0FBQ0EsQ0FBQ0E7SUFDM0NBLENBQUNBO0lBRUQxQjs7O09BR0dBO0lBQ0tBLHNDQUFjQSxHQUF0QkEsVUFBdUJBLFFBQWVBO1FBRXJDMkIsTUFBTUEsSUFBSUEsS0FBS0EsQ0FBQ0EsMkJBQTJCQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxjQUFjQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxJQUFJQSxHQUFHQSxRQUFRQSxHQUFHQSxpQkFBaUJBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLGNBQWNBLENBQUNBLENBQUNBO0lBQzdNQSxDQUFDQTtJQUVEM0I7O09BRUdBO0lBQ0tBLCtDQUF1QkEsR0FBL0JBO1FBRUM0QixNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQSwwQkFBMEJBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLGNBQWNBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLEdBQUdBLElBQUlBLENBQUNBLENBQUNBO0lBQzlHQSxDQUFDQTtJQXJuQmE1QiwyQkFBYUEsR0FBVUEsWUFBWUEsQ0FBQ0E7SUFDcENBLGdDQUFrQkEsR0FBVUEsYUFBYUEsQ0FBQ0E7SUFDMUNBLDhCQUFnQkEsR0FBVUEsV0FBV0EsQ0FBQ0E7SUFDdENBLDhCQUFnQkEsR0FBVUEsV0FBV0EsQ0FBQ0E7SUFDdENBLDJCQUFhQSxHQUFVQSxJQUFJQSxDQUFDQTtJQUM1QkEsMEJBQVlBLEdBQVVBLFFBQVFBLENBQUNBO0lBQy9CQSx3QkFBVUEsR0FBVUEsTUFBTUEsQ0FBQ0E7SUFFM0JBLCtCQUFpQkEsR0FBVUEsUUFBUUEsQ0FBQ0E7SUFDcENBLGtDQUFvQkEsR0FBVUEsVUFBVUEsQ0FBQ0E7SUFDekNBLDZCQUFlQSxHQUFVQSxNQUFNQSxDQUFDQTtJQUNoQ0EsaUNBQW1CQSxHQUFVQSxTQUFTQSxDQUFDQTtJQUN2Q0EsNEJBQWNBLEdBQVVBLEtBQUtBLENBQUNBO0lBQzlCQSxvQ0FBc0JBLEdBQVVBLFlBQVlBLENBQUNBO0lBQzdDQSwrQkFBaUJBLEdBQVVBLFFBQVFBLENBQUNBO0lBd21CbkRBLG9CQUFDQTtBQUFEQSxDQTFuQkEsQUEwbkJDQSxFQTFuQjJCLFVBQVUsRUEwbkJyQztBQUtELElBQU0sVUFBVTtJQUFoQjZCLFNBQU1BLFVBQVVBO0lBT2hCQyxDQUFDQTtJQUFERCxpQkFBQ0E7QUFBREEsQ0FQQSxBQU9DQSxJQUFBO0FBRUQsSUFBTSxTQUFTO0lBQWZFLFNBQU1BLFNBQVNBO0lBTWZDLENBQUNBO0lBQURELGdCQUFDQTtBQUFEQSxDQU5BLEFBTUNBLElBQUE7QUFFRCxJQUFNLFFBQVE7SUFBZEUsU0FBTUEsUUFBUUE7SUFLZEMsQ0FBQ0E7SUFBREQsZUFBQ0E7QUFBREEsQ0FMQSxBQUtDQSxJQUFBO0FBekJELGlCQUFTLGFBQWEsQ0FBQyIsImZpbGUiOiJwYXJzZXJzL01ENU1lc2hQYXJzZXIuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1hdHJpeDNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFwiKTtcbmltcG9ydCBRdWF0ZXJuaW9uXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vUXVhdGVybmlvblwiKTtcbmltcG9ydCBWZWN0b3IzRFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIik7XG5pbXBvcnQgVVJMTG9hZGVyRGF0YUZvcm1hdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxMb2FkZXJEYXRhRm9ybWF0XCIpO1xuaW1wb3J0IFBhcnNlckJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcGFyc2Vycy9QYXJzZXJCYXNlXCIpO1xuXG5pbXBvcnQgRGlzcGxheU9iamVjdENvbnRhaW5lclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9jb250YWluZXJzL0Rpc3BsYXlPYmplY3RDb250YWluZXJcIik7XG5pbXBvcnQgR2VvbWV0cnlcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL0dlb21ldHJ5XCIpO1xuaW1wb3J0IFRyaWFuZ2xlU3ViR2VvbWV0cnlcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL1RyaWFuZ2xlU3ViR2VvbWV0cnlcIik7XG5pbXBvcnQgTWVzaFx0XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvTWVzaFwiKTtcblxuaW1wb3J0IFNrZWxldG9uQW5pbWF0aW9uU2V0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL1NrZWxldG9uQW5pbWF0aW9uU2V0XCIpO1xuaW1wb3J0IFNrZWxldG9uXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvU2tlbGV0b25cIik7XG5pbXBvcnQgU2tlbGV0b25Kb2ludFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvU2tlbGV0b25Kb2ludFwiKTtcblxuLy8gdG9kbzogY3JlYXRlIGFuaW1hdGlvbiBzeXN0ZW0sIHBhcnNlIHNrZWxldG9uXG5cbi8qKlxuICogTUQ1TWVzaFBhcnNlciBwcm92aWRlcyBhIHBhcnNlciBmb3IgdGhlIG1kNW1lc2ggZGF0YSB0eXBlLCBwcm92aWRpbmcgdGhlIGdlb21ldHJ5IG9mIHRoZSBtZDUgZm9ybWF0LlxuICpcbiAqIHRvZG86IG9wdGltaXplXG4gKi9cbmNsYXNzIE1ENU1lc2hQYXJzZXIgZXh0ZW5kcyBQYXJzZXJCYXNlXG57XG5cdHByaXZhdGUgX3RleHREYXRhOnN0cmluZztcblx0cHJpdmF0ZSBfc3RhcnRlZFBhcnNpbmc6Ym9vbGVhbjtcblx0cHVibGljIHN0YXRpYyBWRVJTSU9OX1RPS0VOOnN0cmluZyA9IFwiTUQ1VmVyc2lvblwiO1xuXHRwdWJsaWMgc3RhdGljIENPTU1BTkRfTElORV9UT0tFTjpzdHJpbmcgPSBcImNvbW1hbmRsaW5lXCI7XG5cdHB1YmxpYyBzdGF0aWMgTlVNX0pPSU5UU19UT0tFTjpzdHJpbmcgPSBcIm51bUpvaW50c1wiO1xuXHRwdWJsaWMgc3RhdGljIE5VTV9NRVNIRVNfVE9LRU46c3RyaW5nID0gXCJudW1NZXNoZXNcIjtcblx0cHVibGljIHN0YXRpYyBDT01NRU5UX1RPS0VOOnN0cmluZyA9IFwiLy9cIjtcblx0cHVibGljIHN0YXRpYyBKT0lOVFNfVE9LRU46c3RyaW5nID0gXCJqb2ludHNcIjtcblx0cHVibGljIHN0YXRpYyBNRVNIX1RPS0VOOnN0cmluZyA9IFwibWVzaFwiO1xuXG5cdHB1YmxpYyBzdGF0aWMgTUVTSF9TSEFERVJfVE9LRU46c3RyaW5nID0gXCJzaGFkZXJcIjtcblx0cHVibGljIHN0YXRpYyBNRVNIX05VTV9WRVJUU19UT0tFTjpzdHJpbmcgPSBcIm51bXZlcnRzXCI7XG5cdHB1YmxpYyBzdGF0aWMgTUVTSF9WRVJUX1RPS0VOOnN0cmluZyA9IFwidmVydFwiO1xuXHRwdWJsaWMgc3RhdGljIE1FU0hfTlVNX1RSSVNfVE9LRU46c3RyaW5nID0gXCJudW10cmlzXCI7XG5cdHB1YmxpYyBzdGF0aWMgTUVTSF9UUklfVE9LRU46c3RyaW5nID0gXCJ0cmlcIjtcblx0cHVibGljIHN0YXRpYyBNRVNIX05VTV9XRUlHSFRTX1RPS0VOOnN0cmluZyA9IFwibnVtd2VpZ2h0c1wiO1xuXHRwdWJsaWMgc3RhdGljIE1FU0hfV0VJR0hUX1RPS0VOOnN0cmluZyA9IFwid2VpZ2h0XCI7XG5cblx0cHJpdmF0ZSBfcGFyc2VJbmRleDpudW1iZXIgLyppbnQqLyA9IDA7XG5cdHByaXZhdGUgX3JlYWNoZWRFT0Y6Ym9vbGVhbjtcblx0cHJpdmF0ZSBfbGluZTpudW1iZXIgLyppbnQqLyA9IDA7XG5cdHByaXZhdGUgX2NoYXJMaW5lSW5kZXg6bnVtYmVyIC8qaW50Ki8gPSAwO1xuXHRwcml2YXRlIF92ZXJzaW9uOm51bWJlciAvKmludCovO1xuXHRwcml2YXRlIF9udW1Kb2ludHM6bnVtYmVyIC8qaW50Ki87XG5cdHByaXZhdGUgX251bU1lc2hlczpudW1iZXIgLyppbnQqLztcblxuXHRwcml2YXRlIF9tZXNoOk1lc2g7XG5cdHByaXZhdGUgX3NoYWRlcnM6QXJyYXk8c3RyaW5nPjtcblxuXHRwcml2YXRlIF9tYXhKb2ludENvdW50Om51bWJlciAvKmludCovO1xuXHRwcml2YXRlIF9tZXNoRGF0YTpBcnJheTxNZXNoRGF0YT47XG5cdHByaXZhdGUgX2JpbmRQb3NlczpBcnJheTxNYXRyaXgzRD47XG5cdHByaXZhdGUgX2dlb21ldHJ5Okdlb21ldHJ5O1xuXG5cdHByaXZhdGUgX3NrZWxldG9uOlNrZWxldG9uO1xuXHRwcml2YXRlIF9hbmltYXRpb25TZXQ6U2tlbGV0b25BbmltYXRpb25TZXQ7XG5cblx0cHJpdmF0ZSBfcm90YXRpb25RdWF0OlF1YXRlcm5pb247XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgTUQ1TWVzaFBhcnNlciBvYmplY3QuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihhZGRpdGlvbmFsUm90YXRpb25BeGlzOlZlY3RvcjNEID0gbnVsbCwgYWRkaXRpb25hbFJvdGF0aW9uUmFkaWFuczpudW1iZXIgPSAwKVxuXHR7XG5cdFx0c3VwZXIoVVJMTG9hZGVyRGF0YUZvcm1hdC5URVhUKTtcblx0XHR0aGlzLl9yb3RhdGlvblF1YXQgPSBuZXcgUXVhdGVybmlvbigpO1xuXG5cdFx0dGhpcy5fcm90YXRpb25RdWF0LmZyb21BeGlzQW5nbGUoVmVjdG9yM0QuWF9BWElTLCAtTWF0aC5QSSouNSk7XG5cblx0XHRpZiAoYWRkaXRpb25hbFJvdGF0aW9uQXhpcykge1xuXHRcdFx0dmFyIHF1YXQ6UXVhdGVybmlvbiA9IG5ldyBRdWF0ZXJuaW9uKCk7XG5cdFx0XHRxdWF0LmZyb21BeGlzQW5nbGUoYWRkaXRpb25hbFJvdGF0aW9uQXhpcywgYWRkaXRpb25hbFJvdGF0aW9uUmFkaWFucyk7XG5cdFx0XHR0aGlzLl9yb3RhdGlvblF1YXQubXVsdGlwbHkodGhpcy5fcm90YXRpb25RdWF0LCBxdWF0KTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IGEgZ2l2ZW4gZmlsZSBleHRlbnNpb24gaXMgc3VwcG9ydGVkIGJ5IHRoZSBwYXJzZXIuXG5cdCAqIEBwYXJhbSBleHRlbnNpb24gVGhlIGZpbGUgZXh0ZW5zaW9uIG9mIGEgcG90ZW50aWFsIGZpbGUgdG8gYmUgcGFyc2VkLlxuXHQgKiBAcmV0dXJuIFdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBmaWxlIHR5cGUgaXMgc3VwcG9ydGVkLlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBzdXBwb3J0c1R5cGUoZXh0ZW5zaW9uOnN0cmluZyk6Ym9vbGVhblxuXHR7XG5cdFx0ZXh0ZW5zaW9uID0gZXh0ZW5zaW9uLnRvTG93ZXJDYXNlKCk7XG5cdFx0cmV0dXJuIGV4dGVuc2lvbiA9PSBcIm1kNW1lc2hcIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBUZXN0cyB3aGV0aGVyIGEgZGF0YSBibG9jayBjYW4gYmUgcGFyc2VkIGJ5IHRoZSBwYXJzZXIuXG5cdCAqIEBwYXJhbSBkYXRhIFRoZSBkYXRhIGJsb2NrIHRvIHBvdGVudGlhbGx5IGJlIHBhcnNlZC5cblx0ICogQHJldHVybiBXaGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gZGF0YSBpcyBzdXBwb3J0ZWQuXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIHN1cHBvcnRzRGF0YShkYXRhOmFueSk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX3BQcm9jZWVkUGFyc2luZygpOmJvb2xlYW5cblx0e1xuXHRcdHZhciB0b2tlbjpzdHJpbmc7XG5cblx0XHRpZiAoIXRoaXMuX3N0YXJ0ZWRQYXJzaW5nKSB7XG5cdFx0XHR0aGlzLl90ZXh0RGF0YSA9IHRoaXMuX3BHZXRUZXh0RGF0YSgpO1xuXHRcdFx0dGhpcy5fc3RhcnRlZFBhcnNpbmcgPSB0cnVlO1xuXHRcdH1cblxuXHRcdHdoaWxlICh0aGlzLl9wSGFzVGltZSgpKSB7XG5cdFx0XHR0b2tlbiA9IHRoaXMuZ2V0TmV4dFRva2VuKCk7XG5cdFx0XHRzd2l0Y2ggKHRva2VuKSB7XG5cdFx0XHRcdGNhc2UgTUQ1TWVzaFBhcnNlci5DT01NRU5UX1RPS0VOOlxuXHRcdFx0XHRcdHRoaXMuaWdub3JlTGluZSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIE1ENU1lc2hQYXJzZXIuVkVSU0lPTl9UT0tFTjpcblx0XHRcdFx0XHR0aGlzLl92ZXJzaW9uID0gdGhpcy5nZXROZXh0SW50KCk7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX3ZlcnNpb24gIT0gMTApXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIHZlcnNpb24gbnVtYmVyIGVuY291bnRlcmVkIVwiKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBNRDVNZXNoUGFyc2VyLkNPTU1BTkRfTElORV9UT0tFTjpcblx0XHRcdFx0XHR0aGlzLnBhcnNlQ01EKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgTUQ1TWVzaFBhcnNlci5OVU1fSk9JTlRTX1RPS0VOOlxuXHRcdFx0XHRcdHRoaXMuX251bUpvaW50cyA9IHRoaXMuZ2V0TmV4dEludCgpO1xuXHRcdFx0XHRcdHRoaXMuX2JpbmRQb3NlcyA9IG5ldyBBcnJheTxNYXRyaXgzRD4odGhpcy5fbnVtSm9pbnRzKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBNRDVNZXNoUGFyc2VyLk5VTV9NRVNIRVNfVE9LRU46XG5cdFx0XHRcdFx0dGhpcy5fbnVtTWVzaGVzID0gdGhpcy5nZXROZXh0SW50KCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgTUQ1TWVzaFBhcnNlci5KT0lOVFNfVE9LRU46XG5cdFx0XHRcdFx0dGhpcy5wYXJzZUpvaW50cygpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIE1ENU1lc2hQYXJzZXIuTUVTSF9UT0tFTjpcblx0XHRcdFx0XHR0aGlzLnBhcnNlTWVzaCgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGlmICghdGhpcy5fcmVhY2hlZEVPRilcblx0XHRcdFx0XHRcdHRoaXMuc2VuZFVua25vd25LZXl3b3JkRXJyb3IoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuX3JlYWNoZWRFT0YpIHtcblx0XHRcdFx0dGhpcy5jYWxjdWxhdGVNYXhKb2ludENvdW50KCk7XG5cdFx0XHRcdHRoaXMuX2FuaW1hdGlvblNldCA9IG5ldyBTa2VsZXRvbkFuaW1hdGlvblNldCh0aGlzLl9tYXhKb2ludENvdW50KTtcblxuXHRcdFx0XHR0aGlzLl9tZXNoID0gbmV3IE1lc2gobmV3IEdlb21ldHJ5KCksIG51bGwpO1xuXHRcdFx0XHR0aGlzLl9nZW9tZXRyeSA9IHRoaXMuX21lc2guZ2VvbWV0cnk7XG5cblx0XHRcdFx0Zm9yICh2YXIgaTpudW1iZXIgLyppbnQqLyA9IDA7IGkgPCB0aGlzLl9tZXNoRGF0YS5sZW5ndGg7ICsraSlcblx0XHRcdFx0XHR0aGlzLl9nZW9tZXRyeS5hZGRTdWJHZW9tZXRyeSh0aGlzLnRyYW5zbGF0ZUdlb20odGhpcy5fbWVzaERhdGFbaV0udmVydGV4RGF0YSwgdGhpcy5fbWVzaERhdGFbaV0ud2VpZ2h0RGF0YSwgdGhpcy5fbWVzaERhdGFbaV0uaW5kaWNlcykpO1xuXG5cdFx0XHRcdC8vX2dlb21ldHJ5LmFuaW1hdGlvbiA9IF9hbmltYXRpb247XG5cdFx0XHRcdC8vXHRcdFx0XHRcdF9tZXNoLmFuaW1hdGlvbkNvbnRyb2xsZXIgPSBfYW5pbWF0aW9uQ29udHJvbGxlcjtcblxuXHRcdFx0XHQvL2FkZCB0byB0aGUgY29udGVudCBwcm9wZXJ0eVxuXHRcdFx0XHQoPERpc3BsYXlPYmplY3RDb250YWluZXI+IHRoaXMuX3BDb250ZW50KS5hZGRDaGlsZCh0aGlzLl9tZXNoKTtcblxuXHRcdFx0XHR0aGlzLl9wRmluYWxpemVBc3NldCh0aGlzLl9nZW9tZXRyeSk7XG5cdFx0XHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KHRoaXMuX21lc2gpO1xuXHRcdFx0XHR0aGlzLl9wRmluYWxpemVBc3NldCh0aGlzLl9za2VsZXRvbik7XG5cdFx0XHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KHRoaXMuX2FuaW1hdGlvblNldCk7XG5cdFx0XHRcdHJldHVybiBQYXJzZXJCYXNlLlBBUlNJTkdfRE9ORTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIFBhcnNlckJhc2UuTU9SRV9UT19QQVJTRTtcblx0fVxuXG5cdHB1YmxpYyBfcFN0YXJ0UGFyc2luZyhmcmFtZUxpbWl0Om51bWJlcilcblx0e1xuXHRcdHN1cGVyLl9wU3RhcnRQYXJzaW5nKGZyYW1lTGltaXQpO1xuXG5cdFx0Ly9jcmVhdGUgYSBjb250ZW50IG9iamVjdCBmb3IgTG9hZGVyc1xuXHRcdHRoaXMuX3BDb250ZW50ID0gbmV3IERpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblx0fVxuXG5cdHByaXZhdGUgY2FsY3VsYXRlTWF4Sm9pbnRDb3VudCgpOnZvaWRcblx0e1xuXHRcdHRoaXMuX21heEpvaW50Q291bnQgPSAwO1xuXG5cdFx0dmFyIG51bU1lc2hEYXRhOm51bWJlciAvKmludCovID0gdGhpcy5fbWVzaERhdGEubGVuZ3RoO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyIC8qaW50Ki8gPSAwOyBpIDwgbnVtTWVzaERhdGE7ICsraSkge1xuXHRcdFx0dmFyIG1lc2hEYXRhOk1lc2hEYXRhID0gdGhpcy5fbWVzaERhdGFbaV07XG5cdFx0XHR2YXIgdmVydGV4RGF0YTpBcnJheTxWZXJ0ZXhEYXRhPiA9IG1lc2hEYXRhLnZlcnRleERhdGE7XG5cdFx0XHR2YXIgbnVtVmVydHM6bnVtYmVyIC8qaW50Ki8gPSB2ZXJ0ZXhEYXRhLmxlbmd0aDtcblxuXHRcdFx0Zm9yICh2YXIgajpudW1iZXIgLyppbnQqLyA9IDA7IGogPCBudW1WZXJ0czsgKytqKSB7XG5cdFx0XHRcdHZhciB6ZXJvV2VpZ2h0czpudW1iZXIgLyppbnQqLyA9IHRoaXMuY291bnRaZXJvV2VpZ2h0Sm9pbnRzKHZlcnRleERhdGFbal0sIG1lc2hEYXRhLndlaWdodERhdGEpO1xuXHRcdFx0XHR2YXIgdG90YWxKb2ludHM6bnVtYmVyIC8qaW50Ki8gPSB2ZXJ0ZXhEYXRhW2pdLmNvdW50V2VpZ2h0IC0gemVyb1dlaWdodHM7XG5cdFx0XHRcdGlmICh0b3RhbEpvaW50cyA+IHRoaXMuX21heEpvaW50Q291bnQpXG5cdFx0XHRcdFx0dGhpcy5fbWF4Sm9pbnRDb3VudCA9IHRvdGFsSm9pbnRzO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgY291bnRaZXJvV2VpZ2h0Sm9pbnRzKHZlcnRleDpWZXJ0ZXhEYXRhLCB3ZWlnaHRzOkFycmF5PEpvaW50RGF0YT4pOm51bWJlciAvKmludCovXG5cdHtcblx0XHR2YXIgc3RhcnQ6bnVtYmVyIC8qaW50Ki8gPSB2ZXJ0ZXguc3RhcnRXZWlnaHQ7XG5cdFx0dmFyIGVuZDpudW1iZXIgLyppbnQqLyA9IHZlcnRleC5zdGFydFdlaWdodCArIHZlcnRleC5jb3VudFdlaWdodDtcblx0XHR2YXIgY291bnQ6bnVtYmVyIC8qaW50Ki8gPSAwO1xuXHRcdHZhciB3ZWlnaHQ6bnVtYmVyO1xuXG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgLyppbnQqLyA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcblx0XHRcdHdlaWdodCA9IHdlaWdodHNbaV0uYmlhcztcblx0XHRcdGlmICh3ZWlnaHQgPT0gMClcblx0XHRcdFx0Kytjb3VudDtcblx0XHR9XG5cblx0XHRyZXR1cm4gY291bnQ7XG5cdH1cblxuXHQvKipcblx0ICogUGFyc2VzIHRoZSBza2VsZXRvbidzIGpvaW50cy5cblx0ICovXG5cdHByaXZhdGUgcGFyc2VKb2ludHMoKTp2b2lkXG5cdHtcblx0XHR2YXIgY2g6c3RyaW5nO1xuXHRcdHZhciBqb2ludDpTa2VsZXRvbkpvaW50O1xuXHRcdHZhciBwb3M6VmVjdG9yM0Q7XG5cdFx0dmFyIHF1YXQ6UXVhdGVybmlvbjtcblx0XHR2YXIgaTpudW1iZXIgLyppbnQqLyA9IDA7XG5cdFx0dmFyIHRva2VuOnN0cmluZyA9IHRoaXMuZ2V0TmV4dFRva2VuKCk7XG5cblx0XHRpZiAodG9rZW4gIT0gXCJ7XCIpXG5cdFx0XHR0aGlzLnNlbmRVbmtub3duS2V5d29yZEVycm9yKCk7XG5cblx0XHR0aGlzLl9za2VsZXRvbiA9IG5ldyBTa2VsZXRvbigpO1xuXG5cdFx0ZG8ge1xuXHRcdFx0aWYgKHRoaXMuX3JlYWNoZWRFT0YpXG5cdFx0XHRcdHRoaXMuc2VuZEVPRkVycm9yKCk7XG5cdFx0XHRqb2ludCA9IG5ldyBTa2VsZXRvbkpvaW50KCk7XG5cdFx0XHRqb2ludC5uYW1lID0gdGhpcy5wYXJzZUxpdGVyYWxzdHJpbmcoKTtcblx0XHRcdGpvaW50LnBhcmVudEluZGV4ID0gdGhpcy5nZXROZXh0SW50KCk7XG5cdFx0XHRwb3MgPSB0aGlzLnBhcnNlVmVjdG9yM0QoKTtcblx0XHRcdHBvcyA9IHRoaXMuX3JvdGF0aW9uUXVhdC5yb3RhdGVQb2ludChwb3MpO1xuXHRcdFx0cXVhdCA9IHRoaXMucGFyc2VRdWF0ZXJuaW9uKCk7XG5cblx0XHRcdC8vIHRvZG86IGNoZWNrIGlmIHRoaXMgaXMgY29ycmVjdCwgb3IgbWF5YmUgd2Ugd2FudCB0byBhY3R1YWxseSBzdG9yZSBpdCBhcyBxdWF0cz9cblx0XHRcdHRoaXMuX2JpbmRQb3Nlc1tpXSA9IHF1YXQudG9NYXRyaXgzRCgpO1xuXHRcdFx0dGhpcy5fYmluZFBvc2VzW2ldLmFwcGVuZFRyYW5zbGF0aW9uKHBvcy54LCBwb3MueSwgcG9zLnopO1xuXHRcdFx0dmFyIGludjpNYXRyaXgzRCA9IHRoaXMuX2JpbmRQb3Nlc1tpXS5jbG9uZSgpO1xuXHRcdFx0aW52LmludmVydCgpO1xuXHRcdFx0am9pbnQuaW52ZXJzZUJpbmRQb3NlID0gaW52LnJhd0RhdGE7XG5cblx0XHRcdHRoaXMuX3NrZWxldG9uLmpvaW50c1tpKytdID0gam9pbnQ7XG5cblx0XHRcdGNoID0gdGhpcy5nZXROZXh0Q2hhcigpO1xuXG5cdFx0XHRpZiAoY2ggPT0gXCIvXCIpIHtcblx0XHRcdFx0dGhpcy5wdXRCYWNrKCk7XG5cdFx0XHRcdGNoID0gdGhpcy5nZXROZXh0VG9rZW4oKTtcblx0XHRcdFx0aWYgKGNoID09IE1ENU1lc2hQYXJzZXIuQ09NTUVOVF9UT0tFTilcblx0XHRcdFx0XHR0aGlzLmlnbm9yZUxpbmUoKTtcblx0XHRcdFx0Y2ggPSB0aGlzLmdldE5leHRDaGFyKCk7XG5cblx0XHRcdH1cblxuXHRcdFx0aWYgKGNoICE9IFwifVwiKVxuXHRcdFx0XHR0aGlzLnB1dEJhY2soKTtcblx0XHR9IHdoaWxlIChjaCAhPSBcIn1cIik7XG5cdH1cblxuXHQvKipcblx0ICogUHV0cyBiYWNrIHRoZSBsYXN0IHJlYWQgY2hhcmFjdGVyIGludG8gdGhlIGRhdGEgc3RyZWFtLlxuXHQgKi9cblx0cHJpdmF0ZSBwdXRCYWNrKCk6dm9pZFxuXHR7XG5cdFx0dGhpcy5fcGFyc2VJbmRleC0tO1xuXHRcdHRoaXMuX2NoYXJMaW5lSW5kZXgtLTtcblx0XHR0aGlzLl9yZWFjaGVkRU9GID0gdGhpcy5fcGFyc2VJbmRleCA+PSB0aGlzLl90ZXh0RGF0YS5sZW5ndGg7XG5cdH1cblxuXHQvKipcblx0ICogUGFyc2VzIHRoZSBtZXNoIGdlb21ldHJ5LlxuXHQgKi9cblx0cHJpdmF0ZSBwYXJzZU1lc2goKTp2b2lkXG5cdHtcblx0XHR2YXIgdG9rZW46c3RyaW5nID0gdGhpcy5nZXROZXh0VG9rZW4oKTtcblx0XHR2YXIgY2g6c3RyaW5nO1xuXHRcdHZhciB2ZXJ0ZXhEYXRhOkFycmF5PFZlcnRleERhdGE+O1xuXHRcdHZhciB3ZWlnaHRzOkFycmF5PEpvaW50RGF0YT47XG5cdFx0dmFyIGluZGljZXM6QXJyYXk8bnVtYmVyPiAvKnVpbnQqLztcblxuXHRcdGlmICh0b2tlbiAhPSBcIntcIilcblx0XHRcdHRoaXMuc2VuZFVua25vd25LZXl3b3JkRXJyb3IoKTtcblxuXHRcdGlmICh0aGlzLl9zaGFkZXJzID09IG51bGwpXG5cdFx0XHR0aGlzLl9zaGFkZXJzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblxuXHRcdHdoaWxlIChjaCAhPSBcIn1cIikge1xuXHRcdFx0Y2ggPSB0aGlzLmdldE5leHRUb2tlbigpO1xuXHRcdFx0c3dpdGNoIChjaCkge1xuXHRcdFx0XHRjYXNlIE1ENU1lc2hQYXJzZXIuQ09NTUVOVF9UT0tFTjpcblx0XHRcdFx0XHR0aGlzLmlnbm9yZUxpbmUoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBNRDVNZXNoUGFyc2VyLk1FU0hfU0hBREVSX1RPS0VOOlxuXHRcdFx0XHRcdHRoaXMuX3NoYWRlcnMucHVzaCh0aGlzLnBhcnNlTGl0ZXJhbHN0cmluZygpKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBNRDVNZXNoUGFyc2VyLk1FU0hfTlVNX1ZFUlRTX1RPS0VOOlxuXHRcdFx0XHRcdHZlcnRleERhdGEgPSBuZXcgQXJyYXk8VmVydGV4RGF0YT4odGhpcy5nZXROZXh0SW50KCkpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIE1ENU1lc2hQYXJzZXIuTUVTSF9OVU1fVFJJU19UT0tFTjpcblx0XHRcdFx0XHRpbmRpY2VzID0gbmV3IEFycmF5PG51bWJlcj4odGhpcy5nZXROZXh0SW50KCkqMykgLyp1aW50Ki87XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgTUQ1TWVzaFBhcnNlci5NRVNIX05VTV9XRUlHSFRTX1RPS0VOOlxuXHRcdFx0XHRcdHdlaWdodHMgPSBuZXcgQXJyYXk8Sm9pbnREYXRhPih0aGlzLmdldE5leHRJbnQoKSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgTUQ1TWVzaFBhcnNlci5NRVNIX1ZFUlRfVE9LRU46XG5cdFx0XHRcdFx0dGhpcy5wYXJzZVZlcnRleCh2ZXJ0ZXhEYXRhKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBNRDVNZXNoUGFyc2VyLk1FU0hfVFJJX1RPS0VOOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VUcmkoaW5kaWNlcyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgTUQ1TWVzaFBhcnNlci5NRVNIX1dFSUdIVF9UT0tFTjpcblx0XHRcdFx0XHR0aGlzLnBhcnNlSm9pbnQod2VpZ2h0cyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX21lc2hEYXRhID09IG51bGwpXG5cdFx0XHR0aGlzLl9tZXNoRGF0YSA9IG5ldyBBcnJheTxNZXNoRGF0YT4oKTtcblxuXHRcdHZhciBpOm51bWJlciAvKnVpbnQqLyA9IHRoaXMuX21lc2hEYXRhLmxlbmd0aDtcblx0XHR0aGlzLl9tZXNoRGF0YVtpXSA9IG5ldyBNZXNoRGF0YSgpO1xuXHRcdHRoaXMuX21lc2hEYXRhW2ldLnZlcnRleERhdGEgPSB2ZXJ0ZXhEYXRhO1xuXHRcdHRoaXMuX21lc2hEYXRhW2ldLndlaWdodERhdGEgPSB3ZWlnaHRzO1xuXHRcdHRoaXMuX21lc2hEYXRhW2ldLmluZGljZXMgPSBpbmRpY2VzO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIHRoZSBtZXNoIGRhdGEgdG8gYSBTa2lubmVkU3ViIGluc3RhbmNlLlxuXHQgKiBAcGFyYW0gdmVydGV4RGF0YSBUaGUgbWVzaCdzIHZlcnRpY2VzLlxuXHQgKiBAcGFyYW0gd2VpZ2h0cyBUaGUgam9pbnQgd2VpZ2h0cyBwZXIgdmVydGV4LlxuXHQgKiBAcGFyYW0gaW5kaWNlcyBUaGUgaW5kaWNlcyBmb3IgdGhlIGZhY2VzLlxuXHQgKiBAcmV0dXJuIEEgU3ViR2VvbWV0cnkgaW5zdGFuY2UgY29udGFpbmluZyBhbGwgZ2VvbWV0cmljYWwgZGF0YSBmb3IgdGhlIGN1cnJlbnQgbWVzaC5cblx0ICovXG5cdHByaXZhdGUgdHJhbnNsYXRlR2VvbSh2ZXJ0ZXhEYXRhOkFycmF5PFZlcnRleERhdGE+LCB3ZWlnaHRzOkFycmF5PEpvaW50RGF0YT4sIGluZGljZXM6QXJyYXk8bnVtYmVyPiAvKnVpbnQqLyk6VHJpYW5nbGVTdWJHZW9tZXRyeVxuXHR7XG5cdFx0dmFyIGxlbjpudW1iZXIgLyppbnQqLyA9IHZlcnRleERhdGEubGVuZ3RoO1xuXHRcdHZhciB2MTpudW1iZXIgLyppbnQqLywgdjI6bnVtYmVyIC8qaW50Ki8sIHYzOm51bWJlciAvKmludCovO1xuXHRcdHZhciB2ZXJ0ZXg6VmVydGV4RGF0YTtcblx0XHR2YXIgd2VpZ2h0OkpvaW50RGF0YTtcblx0XHR2YXIgYmluZFBvc2U6TWF0cml4M0Q7XG5cdFx0dmFyIHBvczpWZWN0b3IzRDtcblx0XHR2YXIgc3ViR2VvbTpUcmlhbmdsZVN1Ykdlb21ldHJ5ID0gbmV3IFRyaWFuZ2xlU3ViR2VvbWV0cnkodHJ1ZSk7XG5cdFx0dmFyIHV2czpBcnJheTxudW1iZXI+ID0gbmV3IEFycmF5PG51bWJlcj4obGVuKjIpO1xuXHRcdHZhciB2ZXJ0aWNlczpBcnJheTxudW1iZXI+ID0gbmV3IEFycmF5PG51bWJlcj4obGVuKjMpO1xuXHRcdHZhciBqb2ludEluZGljZXM6QXJyYXk8bnVtYmVyPiA9IG5ldyBBcnJheTxudW1iZXI+KGxlbip0aGlzLl9tYXhKb2ludENvdW50KTtcblx0XHR2YXIgam9pbnRXZWlnaHRzOkFycmF5PG51bWJlcj4gPSBuZXcgQXJyYXk8bnVtYmVyPihsZW4qdGhpcy5fbWF4Sm9pbnRDb3VudCk7XG5cdFx0dmFyIGw6bnVtYmVyIC8qaW50Ki8gPSAwO1xuXHRcdHZhciBub25aZXJvV2VpZ2h0czpudW1iZXIgLyppbnQqLztcblxuXHRcdGZvciAodmFyIGk6bnVtYmVyIC8qaW50Ki8gPSAwOyBpIDwgbGVuOyArK2kpIHtcblx0XHRcdHZlcnRleCA9IHZlcnRleERhdGFbaV07XG5cdFx0XHR2MSA9IHZlcnRleC5pbmRleCozO1xuXHRcdFx0djIgPSB2MSArIDE7XG5cdFx0XHR2MyA9IHYxICsgMjtcblx0XHRcdHZlcnRpY2VzW3YxXSA9IHZlcnRpY2VzW3YyXSA9IHZlcnRpY2VzW3YzXSA9IDA7XG5cblx0XHRcdG5vblplcm9XZWlnaHRzID0gMDtcblx0XHRcdGZvciAodmFyIGo6bnVtYmVyIC8qaW50Ki8gPSAwOyBqIDwgdmVydGV4LmNvdW50V2VpZ2h0OyArK2opIHtcblx0XHRcdFx0d2VpZ2h0ID0gd2VpZ2h0c1t2ZXJ0ZXguc3RhcnRXZWlnaHQgKyBqXTtcblx0XHRcdFx0aWYgKHdlaWdodC5iaWFzID4gMCkge1xuXHRcdFx0XHRcdGJpbmRQb3NlID0gdGhpcy5fYmluZFBvc2VzW3dlaWdodC5qb2ludF07XG5cdFx0XHRcdFx0cG9zID0gYmluZFBvc2UudHJhbnNmb3JtVmVjdG9yKHdlaWdodC5wb3MpO1xuXHRcdFx0XHRcdHZlcnRpY2VzW3YxXSArPSBwb3MueCp3ZWlnaHQuYmlhcztcblx0XHRcdFx0XHR2ZXJ0aWNlc1t2Ml0gKz0gcG9zLnkqd2VpZ2h0LmJpYXM7XG5cdFx0XHRcdFx0dmVydGljZXNbdjNdICs9IHBvcy56KndlaWdodC5iaWFzO1xuXG5cdFx0XHRcdFx0Ly8gaW5kaWNlcyBuZWVkIHRvIGJlIG11bHRpcGxpZWQgYnkgMyAoYW1vdW50IG9mIG1hdHJpeCByZWdpc3RlcnMpXG5cdFx0XHRcdFx0am9pbnRJbmRpY2VzW2xdID0gd2VpZ2h0LmpvaW50KjM7XG5cdFx0XHRcdFx0am9pbnRXZWlnaHRzW2wrK10gPSB3ZWlnaHQuYmlhcztcblx0XHRcdFx0XHQrK25vblplcm9XZWlnaHRzO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGZvciAoaiA9IG5vblplcm9XZWlnaHRzOyBqIDwgdGhpcy5fbWF4Sm9pbnRDb3VudDsgKytqKSB7XG5cdFx0XHRcdGpvaW50SW5kaWNlc1tsXSA9IDA7XG5cdFx0XHRcdGpvaW50V2VpZ2h0c1tsKytdID0gMDtcblx0XHRcdH1cblxuXHRcdFx0djEgPSB2ZXJ0ZXguaW5kZXggPDwgMTtcblx0XHRcdHV2c1t2MSsrXSA9IHZlcnRleC5zO1xuXHRcdFx0dXZzW3YxXSA9IHZlcnRleC50O1xuXHRcdH1cblxuXHRcdHN1Ykdlb20uam9pbnRzUGVyVmVydGV4ID0gdGhpcy5fbWF4Sm9pbnRDb3VudDtcblx0XHRzdWJHZW9tLnVwZGF0ZUluZGljZXMoaW5kaWNlcyk7XG5cdFx0c3ViR2VvbS51cGRhdGVQb3NpdGlvbnModmVydGljZXMpO1xuXHRcdHN1Ykdlb20udXBkYXRlVVZzKHV2cyk7XG5cdFx0c3ViR2VvbS51cGRhdGVKb2ludEluZGljZXMoam9pbnRJbmRpY2VzKTtcblx0XHRzdWJHZW9tLnVwZGF0ZUpvaW50V2VpZ2h0cyhqb2ludFdlaWdodHMpO1xuXHRcdC8vIGNhdXNlIGV4cGxpY2l0IHVwZGF0ZXNcblx0XHRzdWJHZW9tLnZlcnRleE5vcm1hbHM7XG5cdFx0c3ViR2VvbS52ZXJ0ZXhUYW5nZW50cztcblx0XHQvLyB0dXJuIGF1dG8gdXBkYXRlcyBvZmYgYmVjYXVzZSB0aGV5IG1heSBiZSBhbmltYXRlZCBhbmQgc2V0IGV4cGxpY2l0bHlcblx0XHRzdWJHZW9tLmF1dG9EZXJpdmVUYW5nZW50cyA9IGZhbHNlO1xuXHRcdHN1Ykdlb20uYXV0b0Rlcml2ZU5vcm1hbHMgPSBmYWxzZTtcblxuXHRcdHJldHVybiBzdWJHZW9tO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlIHRoZSBuZXh0IHRyaXBsZXQgb2YgdmVydGV4IGluZGljZXMgdGhhdCBmb3JtIGEgZmFjZS5cblx0ICogQHBhcmFtIGluZGljZXMgVGhlIGluZGV4IGxpc3QgaW4gd2hpY2ggdG8gc3RvcmUgdGhlIHJlYWQgZGF0YS5cblx0ICovXG5cdHByaXZhdGUgcGFyc2VUcmkoaW5kaWNlczpBcnJheTxudW1iZXI+IC8qdWludCovKTp2b2lkXG5cdHtcblx0XHR2YXIgaW5kZXg6bnVtYmVyIC8qaW50Ki8gPSB0aGlzLmdldE5leHRJbnQoKSozO1xuXHRcdGluZGljZXNbaW5kZXhdID0gdGhpcy5nZXROZXh0SW50KCk7XG5cdFx0aW5kaWNlc1tpbmRleCArIDFdID0gdGhpcy5nZXROZXh0SW50KCk7XG5cdFx0aW5kaWNlc1tpbmRleCArIDJdID0gdGhpcy5nZXROZXh0SW50KCk7XG5cdH1cblxuXHQvKipcblx0ICogUmVhZHMgYSBuZXcgam9pbnQgZGF0YSBzZXQgZm9yIGEgc2luZ2xlIGpvaW50LlxuXHQgKiBAcGFyYW0gd2VpZ2h0cyB0aGUgdGFyZ2V0IGxpc3QgdG8gY29udGFpbiB0aGUgd2VpZ2h0IGRhdGEuXG5cdCAqL1xuXHRwcml2YXRlIHBhcnNlSm9pbnQod2VpZ2h0czpBcnJheTxKb2ludERhdGE+KTp2b2lkXG5cdHtcblx0XHR2YXIgd2VpZ2h0OkpvaW50RGF0YSA9IG5ldyBKb2ludERhdGEoKTtcblx0XHR3ZWlnaHQuaW5kZXggPSB0aGlzLmdldE5leHRJbnQoKTtcblx0XHR3ZWlnaHQuam9pbnQgPSB0aGlzLmdldE5leHRJbnQoKTtcblx0XHR3ZWlnaHQuYmlhcyA9IHRoaXMuZ2V0TmV4dE51bWJlcigpO1xuXHRcdHdlaWdodC5wb3MgPSB0aGlzLnBhcnNlVmVjdG9yM0QoKTtcblx0XHR3ZWlnaHRzW3dlaWdodC5pbmRleF0gPSB3ZWlnaHQ7XG5cdH1cblxuXHQvKipcblx0ICogUmVhZHMgdGhlIGRhdGEgZm9yIGEgc2luZ2xlIHZlcnRleC5cblx0ICogQHBhcmFtIHZlcnRleERhdGEgVGhlIGxpc3QgdG8gY29udGFpbiB0aGUgdmVydGV4IGRhdGEuXG5cdCAqL1xuXHRwcml2YXRlIHBhcnNlVmVydGV4KHZlcnRleERhdGE6QXJyYXk8VmVydGV4RGF0YT4pOnZvaWRcblx0e1xuXHRcdHZhciB2ZXJ0ZXg6VmVydGV4RGF0YSA9IG5ldyBWZXJ0ZXhEYXRhKCk7XG5cdFx0dmVydGV4LmluZGV4ID0gdGhpcy5nZXROZXh0SW50KCk7XG5cdFx0dGhpcy5wYXJzZVVWKHZlcnRleCk7XG5cdFx0dmVydGV4LnN0YXJ0V2VpZ2h0ID0gdGhpcy5nZXROZXh0SW50KCk7XG5cdFx0dmVydGV4LmNvdW50V2VpZ2h0ID0gdGhpcy5nZXROZXh0SW50KCk7XG5cdFx0Ly9cdFx0XHRpZiAodmVydGV4LmNvdW50V2VpZ2h0ID4gX21heEpvaW50Q291bnQpIF9tYXhKb2ludENvdW50ID0gdmVydGV4LmNvdW50V2VpZ2h0O1xuXHRcdHZlcnRleERhdGFbdmVydGV4LmluZGV4XSA9IHZlcnRleDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWFkcyB0aGUgbmV4dCB1diBjb29yZGluYXRlLlxuXHQgKiBAcGFyYW0gdmVydGV4RGF0YSBUaGUgdmVydGV4RGF0YSB0byBjb250YWluIHRoZSBVViBjb29yZGluYXRlcy5cblx0ICovXG5cdHByaXZhdGUgcGFyc2VVVih2ZXJ0ZXhEYXRhOlZlcnRleERhdGEpOnZvaWRcblx0e1xuXHRcdHZhciBjaDpzdHJpbmcgPSB0aGlzLmdldE5leHRUb2tlbigpO1xuXHRcdGlmIChjaCAhPSBcIihcIilcblx0XHRcdHRoaXMuc2VuZFBhcnNlRXJyb3IoXCIoXCIpO1xuXHRcdHZlcnRleERhdGEucyA9IHRoaXMuZ2V0TmV4dE51bWJlcigpO1xuXHRcdHZlcnRleERhdGEudCA9IHRoaXMuZ2V0TmV4dE51bWJlcigpO1xuXG5cdFx0aWYgKHRoaXMuZ2V0TmV4dFRva2VuKCkgIT0gXCIpXCIpXG5cdFx0XHR0aGlzLnNlbmRQYXJzZUVycm9yKFwiKVwiKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBuZXh0IHRva2VuIGluIHRoZSBkYXRhIHN0cmVhbS5cblx0ICovXG5cdHByaXZhdGUgZ2V0TmV4dFRva2VuKCk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY2g6c3RyaW5nO1xuXHRcdHZhciB0b2tlbjpzdHJpbmcgPSBcIlwiO1xuXG5cdFx0d2hpbGUgKCF0aGlzLl9yZWFjaGVkRU9GKSB7XG5cdFx0XHRjaCA9IHRoaXMuZ2V0TmV4dENoYXIoKTtcblx0XHRcdGlmIChjaCA9PSBcIiBcIiB8fCBjaCA9PSBcIlxcclwiIHx8IGNoID09IFwiXFxuXCIgfHwgY2ggPT0gXCJcXHRcIikge1xuXHRcdFx0XHRpZiAodG9rZW4gIT0gTUQ1TWVzaFBhcnNlci5DT01NRU5UX1RPS0VOKVxuXHRcdFx0XHRcdHRoaXMuc2tpcFdoaXRlU3BhY2UoKTtcblx0XHRcdFx0aWYgKHRva2VuICE9IFwiXCIpXG5cdFx0XHRcdFx0cmV0dXJuIHRva2VuO1xuXHRcdFx0fSBlbHNlXG5cdFx0XHRcdHRva2VuICs9IGNoO1xuXG5cdFx0XHRpZiAodG9rZW4gPT0gTUQ1TWVzaFBhcnNlci5DT01NRU5UX1RPS0VOKVxuXHRcdFx0XHRyZXR1cm4gdG9rZW47XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRva2VuO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNraXBzIGFsbCB3aGl0ZXNwYWNlIGluIHRoZSBkYXRhIHN0cmVhbS5cblx0ICovXG5cdHByaXZhdGUgc2tpcFdoaXRlU3BhY2UoKTp2b2lkXG5cdHtcblx0XHR2YXIgY2g6c3RyaW5nO1xuXG5cdFx0ZG9cblx0XHRcdGNoID0gdGhpcy5nZXROZXh0Q2hhcigpOyB3aGlsZSAoY2ggPT0gXCJcXG5cIiB8fCBjaCA9PSBcIiBcIiB8fCBjaCA9PSBcIlxcclwiIHx8IGNoID09IFwiXFx0XCIpO1xuXG5cdFx0dGhpcy5wdXRCYWNrKCk7XG5cdH1cblxuXHQvKipcblx0ICogU2tpcHMgdG8gdGhlIG5leHQgbGluZS5cblx0ICovXG5cdHByaXZhdGUgaWdub3JlTGluZSgpOnZvaWRcblx0e1xuXHRcdHZhciBjaDpzdHJpbmc7XG5cdFx0d2hpbGUgKCF0aGlzLl9yZWFjaGVkRU9GICYmIGNoICE9IFwiXFxuXCIpXG5cdFx0XHRjaCA9IHRoaXMuZ2V0TmV4dENoYXIoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIG5leHQgc2luZ2xlIGNoYXJhY3RlciBpbiB0aGUgZGF0YSBzdHJlYW0uXG5cdCAqL1xuXHRwcml2YXRlIGdldE5leHRDaGFyKCk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY2g6c3RyaW5nID0gdGhpcy5fdGV4dERhdGEuY2hhckF0KHRoaXMuX3BhcnNlSW5kZXgrKyk7XG5cblx0XHRpZiAoY2ggPT0gXCJcXG5cIikge1xuXHRcdFx0Kyt0aGlzLl9saW5lO1xuXHRcdFx0dGhpcy5fY2hhckxpbmVJbmRleCA9IDA7XG5cdFx0fSBlbHNlIGlmIChjaCAhPSBcIlxcclwiKVxuXHRcdFx0Kyt0aGlzLl9jaGFyTGluZUluZGV4O1xuXG5cdFx0aWYgKHRoaXMuX3BhcnNlSW5kZXggPj0gdGhpcy5fdGV4dERhdGEubGVuZ3RoKVxuXHRcdFx0dGhpcy5fcmVhY2hlZEVPRiA9IHRydWU7XG5cblx0XHRyZXR1cm4gY2g7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBuZXh0IGludGVnZXIgaW4gdGhlIGRhdGEgc3RyZWFtLlxuXHQgKi9cblx0cHJpdmF0ZSBnZXROZXh0SW50KCk6bnVtYmVyIC8qaW50Ki9cblx0e1xuXHRcdHZhciBpOm51bWJlciA9IHBhcnNlSW50KHRoaXMuZ2V0TmV4dFRva2VuKCkpO1xuXHRcdGlmIChpc05hTihpKSlcblx0XHRcdHRoaXMuc2VuZFBhcnNlRXJyb3IoXCJpbnQgdHlwZVwiKTtcblx0XHRyZXR1cm4gaTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIG5leHQgZmxvYXRpbmcgcG9pbnQgbnVtYmVyIGluIHRoZSBkYXRhIHN0cmVhbS5cblx0ICovXG5cdHByaXZhdGUgZ2V0TmV4dE51bWJlcigpOm51bWJlclxuXHR7XG5cdFx0dmFyIGY6bnVtYmVyID0gcGFyc2VGbG9hdCh0aGlzLmdldE5leHRUb2tlbigpKTtcblx0XHRpZiAoaXNOYU4oZikpXG5cdFx0XHR0aGlzLnNlbmRQYXJzZUVycm9yKFwiZmxvYXQgdHlwZVwiKTtcblx0XHRyZXR1cm4gZjtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIG5leHQgM2QgdmVjdG9yIGluIHRoZSBkYXRhIHN0cmVhbS5cblx0ICovXG5cdHByaXZhdGUgcGFyc2VWZWN0b3IzRCgpOlZlY3RvcjNEXG5cdHtcblx0XHR2YXIgdmVjOlZlY3RvcjNEID0gbmV3IFZlY3RvcjNEKCk7XG5cdFx0dmFyIGNoOnN0cmluZyA9IHRoaXMuZ2V0TmV4dFRva2VuKCk7XG5cblx0XHRpZiAoY2ggIT0gXCIoXCIpXG5cdFx0XHR0aGlzLnNlbmRQYXJzZUVycm9yKFwiKFwiKTtcblx0XHR2ZWMueCA9IC10aGlzLmdldE5leHROdW1iZXIoKTtcblx0XHR2ZWMueSA9IHRoaXMuZ2V0TmV4dE51bWJlcigpO1xuXHRcdHZlYy56ID0gdGhpcy5nZXROZXh0TnVtYmVyKCk7XG5cblx0XHRpZiAodGhpcy5nZXROZXh0VG9rZW4oKSAhPSBcIilcIilcblx0XHRcdHRoaXMuc2VuZFBhcnNlRXJyb3IoXCIpXCIpO1xuXG5cdFx0cmV0dXJuIHZlYztcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIG5leHQgcXVhdGVybmlvbiBpbiB0aGUgZGF0YSBzdHJlYW0uXG5cdCAqL1xuXHRwcml2YXRlIHBhcnNlUXVhdGVybmlvbigpOlF1YXRlcm5pb25cblx0e1xuXHRcdHZhciBxdWF0OlF1YXRlcm5pb24gPSBuZXcgUXVhdGVybmlvbigpO1xuXHRcdHZhciBjaDpzdHJpbmcgPSB0aGlzLmdldE5leHRUb2tlbigpO1xuXG5cdFx0aWYgKGNoICE9IFwiKFwiKVxuXHRcdFx0dGhpcy5zZW5kUGFyc2VFcnJvcihcIihcIik7XG5cdFx0cXVhdC54ID0gdGhpcy5nZXROZXh0TnVtYmVyKCk7XG5cdFx0cXVhdC55ID0gLXRoaXMuZ2V0TmV4dE51bWJlcigpO1xuXHRcdHF1YXQueiA9IC10aGlzLmdldE5leHROdW1iZXIoKTtcblxuXHRcdC8vIHF1YXQgc3VwcG9zZWQgdG8gYmUgdW5pdCBsZW5ndGhcblx0XHR2YXIgdDpudW1iZXIgPSAxIC0gcXVhdC54KnF1YXQueCAtIHF1YXQueSpxdWF0LnkgLSBxdWF0LnoqcXVhdC56O1xuXHRcdHF1YXQudyA9IHQgPCAwPyAwIDogLU1hdGguc3FydCh0KTtcblxuXHRcdGlmICh0aGlzLmdldE5leHRUb2tlbigpICE9IFwiKVwiKVxuXHRcdFx0dGhpcy5zZW5kUGFyc2VFcnJvcihcIilcIik7XG5cblx0XHR2YXIgcm90UXVhdDpRdWF0ZXJuaW9uID0gbmV3IFF1YXRlcm5pb24oKTtcblx0XHRyb3RRdWF0Lm11bHRpcGx5KHRoaXMuX3JvdGF0aW9uUXVhdCwgcXVhdCk7XG5cdFx0cmV0dXJuIHJvdFF1YXQ7XG5cdH1cblxuXHQvKipcblx0ICogUGFyc2VzIHRoZSBjb21tYW5kIGxpbmUgZGF0YS5cblx0ICovXG5cdHByaXZhdGUgcGFyc2VDTUQoKTp2b2lkXG5cdHtcblx0XHQvLyBqdXN0IGlnbm9yZSB0aGUgY29tbWFuZCBsaW5lIHByb3BlcnR5XG5cdFx0dGhpcy5wYXJzZUxpdGVyYWxzdHJpbmcoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIG5leHQgbGl0ZXJhbCBzdHJpbmcgaW4gdGhlIGRhdGEgc3RyZWFtLiBBIGxpdGVyYWwgc3RyaW5nIGlzIGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyBib3VuZGVkXG5cdCAqIGJ5IGRvdWJsZSBxdW90ZXMuXG5cdCAqL1xuXHRwcml2YXRlIHBhcnNlTGl0ZXJhbHN0cmluZygpOnN0cmluZ1xuXHR7XG5cdFx0dGhpcy5za2lwV2hpdGVTcGFjZSgpO1xuXG5cdFx0dmFyIGNoOnN0cmluZyA9IHRoaXMuZ2V0TmV4dENoYXIoKTtcblx0XHR2YXIgc3RyOnN0cmluZyA9IFwiXCI7XG5cblx0XHRpZiAoY2ggIT0gXCJcXFwiXCIpXG5cdFx0XHR0aGlzLnNlbmRQYXJzZUVycm9yKFwiXFxcIlwiKTtcblxuXHRcdGRvIHtcblx0XHRcdGlmICh0aGlzLl9yZWFjaGVkRU9GKVxuXHRcdFx0XHR0aGlzLnNlbmRFT0ZFcnJvcigpO1xuXHRcdFx0Y2ggPSB0aGlzLmdldE5leHRDaGFyKCk7XG5cdFx0XHRpZiAoY2ggIT0gXCJcXFwiXCIpXG5cdFx0XHRcdHN0ciArPSBjaDtcblx0XHR9IHdoaWxlIChjaCAhPSBcIlxcXCJcIik7XG5cblx0XHRyZXR1cm4gc3RyO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRocm93cyBhbiBlbmQtb2YtZmlsZSBlcnJvciB3aGVuIGEgcHJlbWF0dXJlIGVuZCBvZiBmaWxlIHdhcyBlbmNvdW50ZXJlZC5cblx0ICovXG5cdHByaXZhdGUgc2VuZEVPRkVycm9yKCk6dm9pZFxuXHR7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCBlbmQgb2YgZmlsZVwiKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaHJvd3MgYW4gZXJyb3Igd2hlbiBhbiB1bmV4cGVjdGVkIHRva2VuIHdhcyBlbmNvdW50ZXJlZC5cblx0ICogQHBhcmFtIGV4cGVjdGVkIFRoZSB0b2tlbiB0eXBlIHRoYXQgd2FzIGFjdHVhbGx5IGV4cGVjdGVkLlxuXHQgKi9cblx0cHJpdmF0ZSBzZW5kUGFyc2VFcnJvcihleHBlY3RlZDpzdHJpbmcpOnZvaWRcblx0e1xuXHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhwZWN0ZWQgdG9rZW4gYXQgbGluZSBcIiArICh0aGlzLl9saW5lICsgMSkgKyBcIiwgY2hhcmFjdGVyIFwiICsgdGhpcy5fY2hhckxpbmVJbmRleCArIFwiLiBcIiArIGV4cGVjdGVkICsgXCIgZXhwZWN0ZWQsIGJ1dCBcIiArIHRoaXMuX3RleHREYXRhLmNoYXJBdCh0aGlzLl9wYXJzZUluZGV4IC0gMSkgKyBcIiBlbmNvdW50ZXJlZFwiKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaHJvd3MgYW4gZXJyb3Igd2hlbiBhbiB1bmtub3duIGtleXdvcmQgd2FzIGVuY291bnRlcmVkLlxuXHQgKi9cblx0cHJpdmF0ZSBzZW5kVW5rbm93bktleXdvcmRFcnJvcigpOnZvaWRcblx0e1xuXHRcdHRocm93IG5ldyBFcnJvcihcIlVua25vd24ga2V5d29yZCBhdCBsaW5lIFwiICsgKHRoaXMuX2xpbmUgKyAxKSArIFwiLCBjaGFyYWN0ZXIgXCIgKyB0aGlzLl9jaGFyTGluZUluZGV4ICsgXCIuIFwiKTtcblx0fVxufVxuXG5leHBvcnQgPSBNRDVNZXNoUGFyc2VyO1xuXG5cbmNsYXNzIFZlcnRleERhdGFcbntcblx0cHVibGljIGluZGV4Om51bWJlciAvKmludCovO1xuXHRwdWJsaWMgczpudW1iZXI7XG5cdHB1YmxpYyB0Om51bWJlcjtcblx0cHVibGljIHN0YXJ0V2VpZ2h0Om51bWJlciAvKmludCovO1xuXHRwdWJsaWMgY291bnRXZWlnaHQ6bnVtYmVyIC8qaW50Ki87XG59XG5cbmNsYXNzIEpvaW50RGF0YVxue1xuXHRwdWJsaWMgaW5kZXg6bnVtYmVyIC8qaW50Ki87XG5cdHB1YmxpYyBqb2ludDpudW1iZXIgLyppbnQqLztcblx0cHVibGljIGJpYXM6bnVtYmVyO1xuXHRwdWJsaWMgcG9zOlZlY3RvcjNEO1xufVxuXG5jbGFzcyBNZXNoRGF0YVxue1xuXHRwdWJsaWMgdmVydGV4RGF0YTpBcnJheTxWZXJ0ZXhEYXRhPjtcblx0cHVibGljIHdlaWdodERhdGE6QXJyYXk8Sm9pbnREYXRhPjtcblx0cHVibGljIGluZGljZXM6QXJyYXk8bnVtYmVyPiAvKnVpbnQqLztcbn1cbiJdfQ==