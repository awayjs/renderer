var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DisplayObjectContainer = require("awayjs-core/lib/containers/DisplayObjectContainer");
var Geometry = require("awayjs-core/lib/core/base/Geometry");
var TriangleSubGeometry = require("awayjs-core/lib/core/base/TriangleSubGeometry");
var Quaternion = require("awayjs-core/lib/core/geom/Quaternion");
var Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
var URLLoaderDataFormat = require("awayjs-core/lib/core/net/URLLoaderDataFormat");
var Mesh = require("awayjs-core/lib/entities/Mesh");
var ParserBase = require("awayjs-core/lib/parsers/ParserBase");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNlcnMvbWQ1bWVzaHBhcnNlci50cyJdLCJuYW1lcyI6WyJNRDVNZXNoUGFyc2VyIiwiTUQ1TWVzaFBhcnNlci5jb25zdHJ1Y3RvciIsIk1ENU1lc2hQYXJzZXIuc3VwcG9ydHNUeXBlIiwiTUQ1TWVzaFBhcnNlci5zdXBwb3J0c0RhdGEiLCJNRDVNZXNoUGFyc2VyLl9wUHJvY2VlZFBhcnNpbmciLCJNRDVNZXNoUGFyc2VyLl9wU3RhcnRQYXJzaW5nIiwiTUQ1TWVzaFBhcnNlci5jYWxjdWxhdGVNYXhKb2ludENvdW50IiwiTUQ1TWVzaFBhcnNlci5jb3VudFplcm9XZWlnaHRKb2ludHMiLCJNRDVNZXNoUGFyc2VyLnBhcnNlSm9pbnRzIiwiTUQ1TWVzaFBhcnNlci5wdXRCYWNrIiwiTUQ1TWVzaFBhcnNlci5wYXJzZU1lc2giLCJNRDVNZXNoUGFyc2VyLnRyYW5zbGF0ZUdlb20iLCJNRDVNZXNoUGFyc2VyLnBhcnNlVHJpIiwiTUQ1TWVzaFBhcnNlci5wYXJzZUpvaW50IiwiTUQ1TWVzaFBhcnNlci5wYXJzZVZlcnRleCIsIk1ENU1lc2hQYXJzZXIucGFyc2VVViIsIk1ENU1lc2hQYXJzZXIuZ2V0TmV4dFRva2VuIiwiTUQ1TWVzaFBhcnNlci5za2lwV2hpdGVTcGFjZSIsIk1ENU1lc2hQYXJzZXIuaWdub3JlTGluZSIsIk1ENU1lc2hQYXJzZXIuZ2V0TmV4dENoYXIiLCJNRDVNZXNoUGFyc2VyLmdldE5leHRJbnQiLCJNRDVNZXNoUGFyc2VyLmdldE5leHROdW1iZXIiLCJNRDVNZXNoUGFyc2VyLnBhcnNlVmVjdG9yM0QiLCJNRDVNZXNoUGFyc2VyLnBhcnNlUXVhdGVybmlvbiIsIk1ENU1lc2hQYXJzZXIucGFyc2VDTUQiLCJNRDVNZXNoUGFyc2VyLnBhcnNlTGl0ZXJhbHN0cmluZyIsIk1ENU1lc2hQYXJzZXIuc2VuZEVPRkVycm9yIiwiTUQ1TWVzaFBhcnNlci5zZW5kUGFyc2VFcnJvciIsIk1ENU1lc2hQYXJzZXIuc2VuZFVua25vd25LZXl3b3JkRXJyb3IiLCJWZXJ0ZXhEYXRhIiwiVmVydGV4RGF0YS5jb25zdHJ1Y3RvciIsIkpvaW50RGF0YSIsIkpvaW50RGF0YS5jb25zdHJ1Y3RvciIsIk1lc2hEYXRhIiwiTWVzaERhdGEuY29uc3RydWN0b3IiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU8sc0JBQXNCLFdBQWEsbURBQW1ELENBQUMsQ0FBQztBQUMvRixJQUFPLFFBQVEsV0FBaUIsb0NBQW9DLENBQUMsQ0FBQztBQUN0RSxJQUFPLG1CQUFtQixXQUFjLCtDQUErQyxDQUFDLENBQUM7QUFFekYsSUFBTyxVQUFVLFdBQWdCLHNDQUFzQyxDQUFDLENBQUM7QUFDekUsSUFBTyxRQUFRLFdBQWlCLG9DQUFvQyxDQUFDLENBQUM7QUFDdEUsSUFBTyxtQkFBbUIsV0FBYyw4Q0FBOEMsQ0FBQyxDQUFDO0FBQ3hGLElBQU8sSUFBSSxXQUFrQiwrQkFBK0IsQ0FBQyxDQUFDO0FBQzlELElBQU8sVUFBVSxXQUFnQixvQ0FBb0MsQ0FBQyxDQUFDO0FBRXZFLElBQU8sb0JBQW9CLFdBQWMsc0RBQXNELENBQUMsQ0FBQztBQUNqRyxJQUFPLFFBQVEsV0FBaUIsK0NBQStDLENBQUMsQ0FBQztBQUNqRixJQUFPLGFBQWEsV0FBZSxvREFBb0QsQ0FBQyxDQUFDO0FBRXpGLEFBT0EsZ0RBUGdEO0FBRWhEOzs7O0dBSUc7SUFDRyxhQUFhO0lBQVNBLFVBQXRCQSxhQUFhQSxVQUFtQkE7SUF5Q3JDQTs7T0FFR0E7SUFDSEEsU0E1Q0tBLGFBQWFBLENBNENOQSxzQkFBc0NBLEVBQUVBLHlCQUFvQ0E7UUFBNUVDLHNDQUFzQ0EsR0FBdENBLDZCQUFzQ0E7UUFBRUEseUNBQW9DQSxHQUFwQ0EsNkJBQW9DQTtRQUV2RkEsa0JBQU1BLG1CQUFtQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUExQnpCQSxnQkFBV0EsR0FBa0JBLENBQUNBLENBQUNBO1FBRS9CQSxVQUFLQSxHQUFrQkEsQ0FBQ0EsQ0FBQ0E7UUFDekJBLG1CQUFjQSxHQUFrQkEsQ0FBQ0EsQ0FB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LENBQUNBO0lBQzVCQSwwQkFBWUEsR0FBVUEsUUFBUUEsQ0FBQ0E7SUFDL0JBLHdCQUFVQSxHQUFVQSxNQUFNQSxDQUFDQTtJQUUzQkEsK0JBQWlCQSxHQUFVQSxRQUFRQSxDQUFDQTtJQUNwQ0Esa0NBQW9CQSxHQUFVQSxVQUFVQSxDQUFDQTtJQUN6Q0EsNkJBQWVBLEdBQVVBLE1BQU1BLENBQUNBO0lBQ2hDQSxpQ0FBbUJBLEdBQVVBLFNBQVNBLENBQUNBO0lBQ3ZDQSw0QkFBY0EsR0FBVUEsS0FBS0EsQ0FBQ0E7SUFDOUJBLG9DQUFzQkEsR0FBVUEsWUFBWUEsQ0FBQ0E7SUFDN0NBLCtCQUFpQkEsR0FBVUEsUUFBUUEsQ0FBQ0E7SUF3bUJuREEsb0JBQUNBO0FBQURBLENBMW5CQSxBQTBuQkNBLEVBMW5CMkIsVUFBVSxFQTBuQnJDO0FBS0QsSUFBTSxVQUFVO0lBQWhCNkIsU0FBTUEsVUFBVUE7SUFPaEJDLENBQUNBO0lBQURELGlCQUFDQTtBQUFEQSxDQVBBLEFBT0NBLElBQUE7QUFFRCxJQUFNLFNBQVM7SUFBZkUsU0FBTUEsU0FBU0E7SUFNZkMsQ0FBQ0E7SUFBREQsZ0JBQUNBO0FBQURBLENBTkEsQUFNQ0EsSUFBQTtBQUVELElBQU0sUUFBUTtJQUFkRSxTQUFNQSxRQUFRQTtJQUtkQyxDQUFDQTtJQUFERCxlQUFDQTtBQUFEQSxDQUxBLEFBS0NBLElBQUE7QUF6QkQsaUJBQVMsYUFBYSxDQUFDIiwiZmlsZSI6InBhcnNlcnMvTUQ1TWVzaFBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvcm9iYmF0ZW1hbi9XZWJzdG9ybVByb2plY3RzL2F3YXlqcy1yZW5kZXJlcmdsLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvbnRhaW5lcnMvRGlzcGxheU9iamVjdENvbnRhaW5lclwiKTtcbmltcG9ydCBHZW9tZXRyeVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvYmFzZS9HZW9tZXRyeVwiKTtcbmltcG9ydCBUcmlhbmdsZVN1Ykdlb21ldHJ5XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9iYXNlL1RyaWFuZ2xlU3ViR2VvbWV0cnlcIik7XG5pbXBvcnQgTWF0cml4M0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2dlb20vTWF0cml4M0RcIik7XG5pbXBvcnQgUXVhdGVybmlvblx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2dlb20vUXVhdGVybmlvblwiKTtcbmltcG9ydCBWZWN0b3IzRFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvZ2VvbS9WZWN0b3IzRFwiKTtcbmltcG9ydCBVUkxMb2FkZXJEYXRhRm9ybWF0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9uZXQvVVJMTG9hZGVyRGF0YUZvcm1hdFwiKTtcbmltcG9ydCBNZXNoXHRcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9lbnRpdGllcy9NZXNoXCIpO1xuaW1wb3J0IFBhcnNlckJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcGFyc2Vycy9QYXJzZXJCYXNlXCIpO1xuXG5pbXBvcnQgU2tlbGV0b25BbmltYXRpb25TZXRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvU2tlbGV0b25BbmltYXRpb25TZXRcIik7XG5pbXBvcnQgU2tlbGV0b25cdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Ta2VsZXRvblwiKTtcbmltcG9ydCBTa2VsZXRvbkpvaW50XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Ta2VsZXRvbkpvaW50XCIpO1xuXG4vLyB0b2RvOiBjcmVhdGUgYW5pbWF0aW9uIHN5c3RlbSwgcGFyc2Ugc2tlbGV0b25cblxuLyoqXG4gKiBNRDVNZXNoUGFyc2VyIHByb3ZpZGVzIGEgcGFyc2VyIGZvciB0aGUgbWQ1bWVzaCBkYXRhIHR5cGUsIHByb3ZpZGluZyB0aGUgZ2VvbWV0cnkgb2YgdGhlIG1kNSBmb3JtYXQuXG4gKlxuICogdG9kbzogb3B0aW1pemVcbiAqL1xuY2xhc3MgTUQ1TWVzaFBhcnNlciBleHRlbmRzIFBhcnNlckJhc2Vcbntcblx0cHJpdmF0ZSBfdGV4dERhdGE6c3RyaW5nO1xuXHRwcml2YXRlIF9zdGFydGVkUGFyc2luZzpib29sZWFuO1xuXHRwdWJsaWMgc3RhdGljIFZFUlNJT05fVE9LRU46c3RyaW5nID0gXCJNRDVWZXJzaW9uXCI7XG5cdHB1YmxpYyBzdGF0aWMgQ09NTUFORF9MSU5FX1RPS0VOOnN0cmluZyA9IFwiY29tbWFuZGxpbmVcIjtcblx0cHVibGljIHN0YXRpYyBOVU1fSk9JTlRTX1RPS0VOOnN0cmluZyA9IFwibnVtSm9pbnRzXCI7XG5cdHB1YmxpYyBzdGF0aWMgTlVNX01FU0hFU19UT0tFTjpzdHJpbmcgPSBcIm51bU1lc2hlc1wiO1xuXHRwdWJsaWMgc3RhdGljIENPTU1FTlRfVE9LRU46c3RyaW5nID0gXCIvL1wiO1xuXHRwdWJsaWMgc3RhdGljIEpPSU5UU19UT0tFTjpzdHJpbmcgPSBcImpvaW50c1wiO1xuXHRwdWJsaWMgc3RhdGljIE1FU0hfVE9LRU46c3RyaW5nID0gXCJtZXNoXCI7XG5cblx0cHVibGljIHN0YXRpYyBNRVNIX1NIQURFUl9UT0tFTjpzdHJpbmcgPSBcInNoYWRlclwiO1xuXHRwdWJsaWMgc3RhdGljIE1FU0hfTlVNX1ZFUlRTX1RPS0VOOnN0cmluZyA9IFwibnVtdmVydHNcIjtcblx0cHVibGljIHN0YXRpYyBNRVNIX1ZFUlRfVE9LRU46c3RyaW5nID0gXCJ2ZXJ0XCI7XG5cdHB1YmxpYyBzdGF0aWMgTUVTSF9OVU1fVFJJU19UT0tFTjpzdHJpbmcgPSBcIm51bXRyaXNcIjtcblx0cHVibGljIHN0YXRpYyBNRVNIX1RSSV9UT0tFTjpzdHJpbmcgPSBcInRyaVwiO1xuXHRwdWJsaWMgc3RhdGljIE1FU0hfTlVNX1dFSUdIVFNfVE9LRU46c3RyaW5nID0gXCJudW13ZWlnaHRzXCI7XG5cdHB1YmxpYyBzdGF0aWMgTUVTSF9XRUlHSFRfVE9LRU46c3RyaW5nID0gXCJ3ZWlnaHRcIjtcblxuXHRwcml2YXRlIF9wYXJzZUluZGV4Om51bWJlciAvKmludCovID0gMDtcblx0cHJpdmF0ZSBfcmVhY2hlZEVPRjpib29sZWFuO1xuXHRwcml2YXRlIF9saW5lOm51bWJlciAvKmludCovID0gMDtcblx0cHJpdmF0ZSBfY2hhckxpbmVJbmRleDpudW1iZXIgLyppbnQqLyA9IDA7XG5cdHByaXZhdGUgX3ZlcnNpb246bnVtYmVyIC8qaW50Ki87XG5cdHByaXZhdGUgX251bUpvaW50czpudW1iZXIgLyppbnQqLztcblx0cHJpdmF0ZSBfbnVtTWVzaGVzOm51bWJlciAvKmludCovO1xuXG5cdHByaXZhdGUgX21lc2g6TWVzaDtcblx0cHJpdmF0ZSBfc2hhZGVyczpBcnJheTxzdHJpbmc+O1xuXG5cdHByaXZhdGUgX21heEpvaW50Q291bnQ6bnVtYmVyIC8qaW50Ki87XG5cdHByaXZhdGUgX21lc2hEYXRhOkFycmF5PE1lc2hEYXRhPjtcblx0cHJpdmF0ZSBfYmluZFBvc2VzOkFycmF5PE1hdHJpeDNEPjtcblx0cHJpdmF0ZSBfZ2VvbWV0cnk6R2VvbWV0cnk7XG5cblx0cHJpdmF0ZSBfc2tlbGV0b246U2tlbGV0b247XG5cdHByaXZhdGUgX2FuaW1hdGlvblNldDpTa2VsZXRvbkFuaW1hdGlvblNldDtcblxuXHRwcml2YXRlIF9yb3RhdGlvblF1YXQ6UXVhdGVybmlvbjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBNRDVNZXNoUGFyc2VyIG9iamVjdC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGFkZGl0aW9uYWxSb3RhdGlvbkF4aXM6VmVjdG9yM0QgPSBudWxsLCBhZGRpdGlvbmFsUm90YXRpb25SYWRpYW5zOm51bWJlciA9IDApXG5cdHtcblx0XHRzdXBlcihVUkxMb2FkZXJEYXRhRm9ybWF0LlRFWFQpO1xuXHRcdHRoaXMuX3JvdGF0aW9uUXVhdCA9IG5ldyBRdWF0ZXJuaW9uKCk7XG5cblx0XHR0aGlzLl9yb3RhdGlvblF1YXQuZnJvbUF4aXNBbmdsZShWZWN0b3IzRC5YX0FYSVMsIC1NYXRoLlBJKi41KTtcblxuXHRcdGlmIChhZGRpdGlvbmFsUm90YXRpb25BeGlzKSB7XG5cdFx0XHR2YXIgcXVhdDpRdWF0ZXJuaW9uID0gbmV3IFF1YXRlcm5pb24oKTtcblx0XHRcdHF1YXQuZnJvbUF4aXNBbmdsZShhZGRpdGlvbmFsUm90YXRpb25BeGlzLCBhZGRpdGlvbmFsUm90YXRpb25SYWRpYW5zKTtcblx0XHRcdHRoaXMuX3JvdGF0aW9uUXVhdC5tdWx0aXBseSh0aGlzLl9yb3RhdGlvblF1YXQsIHF1YXQpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgYSBnaXZlbiBmaWxlIGV4dGVuc2lvbiBpcyBzdXBwb3J0ZWQgYnkgdGhlIHBhcnNlci5cblx0ICogQHBhcmFtIGV4dGVuc2lvbiBUaGUgZmlsZSBleHRlbnNpb24gb2YgYSBwb3RlbnRpYWwgZmlsZSB0byBiZSBwYXJzZWQuXG5cdCAqIEByZXR1cm4gV2hldGhlciBvciBub3QgdGhlIGdpdmVuIGZpbGUgdHlwZSBpcyBzdXBwb3J0ZWQuXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIHN1cHBvcnRzVHlwZShleHRlbnNpb246c3RyaW5nKTpib29sZWFuXG5cdHtcblx0XHRleHRlbnNpb24gPSBleHRlbnNpb24udG9Mb3dlckNhc2UoKTtcblx0XHRyZXR1cm4gZXh0ZW5zaW9uID09IFwibWQ1bWVzaFwiO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRlc3RzIHdoZXRoZXIgYSBkYXRhIGJsb2NrIGNhbiBiZSBwYXJzZWQgYnkgdGhlIHBhcnNlci5cblx0ICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgYmxvY2sgdG8gcG90ZW50aWFsbHkgYmUgcGFyc2VkLlxuXHQgKiBAcmV0dXJuIFdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBkYXRhIGlzIHN1cHBvcnRlZC5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgc3VwcG9ydHNEYXRhKGRhdGE6YW55KTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfcFByb2NlZWRQYXJzaW5nKCk6Ym9vbGVhblxuXHR7XG5cdFx0dmFyIHRva2VuOnN0cmluZztcblxuXHRcdGlmICghdGhpcy5fc3RhcnRlZFBhcnNpbmcpIHtcblx0XHRcdHRoaXMuX3RleHREYXRhID0gdGhpcy5fcEdldFRleHREYXRhKCk7XG5cdFx0XHR0aGlzLl9zdGFydGVkUGFyc2luZyA9IHRydWU7XG5cdFx0fVxuXG5cdFx0d2hpbGUgKHRoaXMuX3BIYXNUaW1lKCkpIHtcblx0XHRcdHRva2VuID0gdGhpcy5nZXROZXh0VG9rZW4oKTtcblx0XHRcdHN3aXRjaCAodG9rZW4pIHtcblx0XHRcdFx0Y2FzZSBNRDVNZXNoUGFyc2VyLkNPTU1FTlRfVE9LRU46XG5cdFx0XHRcdFx0dGhpcy5pZ25vcmVMaW5lKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgTUQ1TWVzaFBhcnNlci5WRVJTSU9OX1RPS0VOOlxuXHRcdFx0XHRcdHRoaXMuX3ZlcnNpb24gPSB0aGlzLmdldE5leHRJbnQoKTtcblx0XHRcdFx0XHRpZiAodGhpcy5fdmVyc2lvbiAhPSAxMClcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVua25vd24gdmVyc2lvbiBudW1iZXIgZW5jb3VudGVyZWQhXCIpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIE1ENU1lc2hQYXJzZXIuQ09NTUFORF9MSU5FX1RPS0VOOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VDTUQoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBNRDVNZXNoUGFyc2VyLk5VTV9KT0lOVFNfVE9LRU46XG5cdFx0XHRcdFx0dGhpcy5fbnVtSm9pbnRzID0gdGhpcy5nZXROZXh0SW50KCk7XG5cdFx0XHRcdFx0dGhpcy5fYmluZFBvc2VzID0gbmV3IEFycmF5PE1hdHJpeDNEPih0aGlzLl9udW1Kb2ludHMpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIE1ENU1lc2hQYXJzZXIuTlVNX01FU0hFU19UT0tFTjpcblx0XHRcdFx0XHR0aGlzLl9udW1NZXNoZXMgPSB0aGlzLmdldE5leHRJbnQoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBNRDVNZXNoUGFyc2VyLkpPSU5UU19UT0tFTjpcblx0XHRcdFx0XHR0aGlzLnBhcnNlSm9pbnRzKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgTUQ1TWVzaFBhcnNlci5NRVNIX1RPS0VOOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VNZXNoKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0aWYgKCF0aGlzLl9yZWFjaGVkRU9GKVxuXHRcdFx0XHRcdFx0dGhpcy5zZW5kVW5rbm93bktleXdvcmRFcnJvcigpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5fcmVhY2hlZEVPRikge1xuXHRcdFx0XHR0aGlzLmNhbGN1bGF0ZU1heEpvaW50Q291bnQoKTtcblx0XHRcdFx0dGhpcy5fYW5pbWF0aW9uU2V0ID0gbmV3IFNrZWxldG9uQW5pbWF0aW9uU2V0KHRoaXMuX21heEpvaW50Q291bnQpO1xuXG5cdFx0XHRcdHRoaXMuX21lc2ggPSBuZXcgTWVzaChuZXcgR2VvbWV0cnkoKSwgbnVsbCk7XG5cdFx0XHRcdHRoaXMuX2dlb21ldHJ5ID0gdGhpcy5fbWVzaC5nZW9tZXRyeTtcblxuXHRcdFx0XHRmb3IgKHZhciBpOm51bWJlciAvKmludCovID0gMDsgaSA8IHRoaXMuX21lc2hEYXRhLmxlbmd0aDsgKytpKVxuXHRcdFx0XHRcdHRoaXMuX2dlb21ldHJ5LmFkZFN1Ykdlb21ldHJ5KHRoaXMudHJhbnNsYXRlR2VvbSh0aGlzLl9tZXNoRGF0YVtpXS52ZXJ0ZXhEYXRhLCB0aGlzLl9tZXNoRGF0YVtpXS53ZWlnaHREYXRhLCB0aGlzLl9tZXNoRGF0YVtpXS5pbmRpY2VzKSk7XG5cblx0XHRcdFx0Ly9fZ2VvbWV0cnkuYW5pbWF0aW9uID0gX2FuaW1hdGlvbjtcblx0XHRcdFx0Ly9cdFx0XHRcdFx0X21lc2guYW5pbWF0aW9uQ29udHJvbGxlciA9IF9hbmltYXRpb25Db250cm9sbGVyO1xuXG5cdFx0XHRcdC8vYWRkIHRvIHRoZSBjb250ZW50IHByb3BlcnR5XG5cdFx0XHRcdCg8RGlzcGxheU9iamVjdENvbnRhaW5lcj4gdGhpcy5fcENvbnRlbnQpLmFkZENoaWxkKHRoaXMuX21lc2gpO1xuXG5cdFx0XHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KHRoaXMuX2dlb21ldHJ5KTtcblx0XHRcdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQodGhpcy5fbWVzaCk7XG5cdFx0XHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KHRoaXMuX3NrZWxldG9uKTtcblx0XHRcdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQodGhpcy5fYW5pbWF0aW9uU2V0KTtcblx0XHRcdFx0cmV0dXJuIFBhcnNlckJhc2UuUEFSU0lOR19ET05FO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gUGFyc2VyQmFzZS5NT1JFX1RPX1BBUlNFO1xuXHR9XG5cblx0cHVibGljIF9wU3RhcnRQYXJzaW5nKGZyYW1lTGltaXQ6bnVtYmVyKVxuXHR7XG5cdFx0c3VwZXIuX3BTdGFydFBhcnNpbmcoZnJhbWVMaW1pdCk7XG5cblx0XHQvL2NyZWF0ZSBhIGNvbnRlbnQgb2JqZWN0IGZvciBMb2FkZXJzXG5cdFx0dGhpcy5fcENvbnRlbnQgPSBuZXcgRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuXHR9XG5cblx0cHJpdmF0ZSBjYWxjdWxhdGVNYXhKb2ludENvdW50KCk6dm9pZFxuXHR7XG5cdFx0dGhpcy5fbWF4Sm9pbnRDb3VudCA9IDA7XG5cblx0XHR2YXIgbnVtTWVzaERhdGE6bnVtYmVyIC8qaW50Ki8gPSB0aGlzLl9tZXNoRGF0YS5sZW5ndGg7XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgLyppbnQqLyA9IDA7IGkgPCBudW1NZXNoRGF0YTsgKytpKSB7XG5cdFx0XHR2YXIgbWVzaERhdGE6TWVzaERhdGEgPSB0aGlzLl9tZXNoRGF0YVtpXTtcblx0XHRcdHZhciB2ZXJ0ZXhEYXRhOkFycmF5PFZlcnRleERhdGE+ID0gbWVzaERhdGEudmVydGV4RGF0YTtcblx0XHRcdHZhciBudW1WZXJ0czpudW1iZXIgLyppbnQqLyA9IHZlcnRleERhdGEubGVuZ3RoO1xuXG5cdFx0XHRmb3IgKHZhciBqOm51bWJlciAvKmludCovID0gMDsgaiA8IG51bVZlcnRzOyArK2opIHtcblx0XHRcdFx0dmFyIHplcm9XZWlnaHRzOm51bWJlciAvKmludCovID0gdGhpcy5jb3VudFplcm9XZWlnaHRKb2ludHModmVydGV4RGF0YVtqXSwgbWVzaERhdGEud2VpZ2h0RGF0YSk7XG5cdFx0XHRcdHZhciB0b3RhbEpvaW50czpudW1iZXIgLyppbnQqLyA9IHZlcnRleERhdGFbal0uY291bnRXZWlnaHQgLSB6ZXJvV2VpZ2h0cztcblx0XHRcdFx0aWYgKHRvdGFsSm9pbnRzID4gdGhpcy5fbWF4Sm9pbnRDb3VudClcblx0XHRcdFx0XHR0aGlzLl9tYXhKb2ludENvdW50ID0gdG90YWxKb2ludHM7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBjb3VudFplcm9XZWlnaHRKb2ludHModmVydGV4OlZlcnRleERhdGEsIHdlaWdodHM6QXJyYXk8Sm9pbnREYXRhPik6bnVtYmVyIC8qaW50Ki9cblx0e1xuXHRcdHZhciBzdGFydDpudW1iZXIgLyppbnQqLyA9IHZlcnRleC5zdGFydFdlaWdodDtcblx0XHR2YXIgZW5kOm51bWJlciAvKmludCovID0gdmVydGV4LnN0YXJ0V2VpZ2h0ICsgdmVydGV4LmNvdW50V2VpZ2h0O1xuXHRcdHZhciBjb3VudDpudW1iZXIgLyppbnQqLyA9IDA7XG5cdFx0dmFyIHdlaWdodDpudW1iZXI7XG5cblx0XHRmb3IgKHZhciBpOm51bWJlciAvKmludCovID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuXHRcdFx0d2VpZ2h0ID0gd2VpZ2h0c1tpXS5iaWFzO1xuXHRcdFx0aWYgKHdlaWdodCA9PSAwKVxuXHRcdFx0XHQrK2NvdW50O1xuXHRcdH1cblxuXHRcdHJldHVybiBjb3VudDtcblx0fVxuXG5cdC8qKlxuXHQgKiBQYXJzZXMgdGhlIHNrZWxldG9uJ3Mgam9pbnRzLlxuXHQgKi9cblx0cHJpdmF0ZSBwYXJzZUpvaW50cygpOnZvaWRcblx0e1xuXHRcdHZhciBjaDpzdHJpbmc7XG5cdFx0dmFyIGpvaW50OlNrZWxldG9uSm9pbnQ7XG5cdFx0dmFyIHBvczpWZWN0b3IzRDtcblx0XHR2YXIgcXVhdDpRdWF0ZXJuaW9uO1xuXHRcdHZhciBpOm51bWJlciAvKmludCovID0gMDtcblx0XHR2YXIgdG9rZW46c3RyaW5nID0gdGhpcy5nZXROZXh0VG9rZW4oKTtcblxuXHRcdGlmICh0b2tlbiAhPSBcIntcIilcblx0XHRcdHRoaXMuc2VuZFVua25vd25LZXl3b3JkRXJyb3IoKTtcblxuXHRcdHRoaXMuX3NrZWxldG9uID0gbmV3IFNrZWxldG9uKCk7XG5cblx0XHRkbyB7XG5cdFx0XHRpZiAodGhpcy5fcmVhY2hlZEVPRilcblx0XHRcdFx0dGhpcy5zZW5kRU9GRXJyb3IoKTtcblx0XHRcdGpvaW50ID0gbmV3IFNrZWxldG9uSm9pbnQoKTtcblx0XHRcdGpvaW50Lm5hbWUgPSB0aGlzLnBhcnNlTGl0ZXJhbHN0cmluZygpO1xuXHRcdFx0am9pbnQucGFyZW50SW5kZXggPSB0aGlzLmdldE5leHRJbnQoKTtcblx0XHRcdHBvcyA9IHRoaXMucGFyc2VWZWN0b3IzRCgpO1xuXHRcdFx0cG9zID0gdGhpcy5fcm90YXRpb25RdWF0LnJvdGF0ZVBvaW50KHBvcyk7XG5cdFx0XHRxdWF0ID0gdGhpcy5wYXJzZVF1YXRlcm5pb24oKTtcblxuXHRcdFx0Ly8gdG9kbzogY2hlY2sgaWYgdGhpcyBpcyBjb3JyZWN0LCBvciBtYXliZSB3ZSB3YW50IHRvIGFjdHVhbGx5IHN0b3JlIGl0IGFzIHF1YXRzP1xuXHRcdFx0dGhpcy5fYmluZFBvc2VzW2ldID0gcXVhdC50b01hdHJpeDNEKCk7XG5cdFx0XHR0aGlzLl9iaW5kUG9zZXNbaV0uYXBwZW5kVHJhbnNsYXRpb24ocG9zLngsIHBvcy55LCBwb3Mueik7XG5cdFx0XHR2YXIgaW52Ok1hdHJpeDNEID0gdGhpcy5fYmluZFBvc2VzW2ldLmNsb25lKCk7XG5cdFx0XHRpbnYuaW52ZXJ0KCk7XG5cdFx0XHRqb2ludC5pbnZlcnNlQmluZFBvc2UgPSBpbnYucmF3RGF0YTtcblxuXHRcdFx0dGhpcy5fc2tlbGV0b24uam9pbnRzW2krK10gPSBqb2ludDtcblxuXHRcdFx0Y2ggPSB0aGlzLmdldE5leHRDaGFyKCk7XG5cblx0XHRcdGlmIChjaCA9PSBcIi9cIikge1xuXHRcdFx0XHR0aGlzLnB1dEJhY2soKTtcblx0XHRcdFx0Y2ggPSB0aGlzLmdldE5leHRUb2tlbigpO1xuXHRcdFx0XHRpZiAoY2ggPT0gTUQ1TWVzaFBhcnNlci5DT01NRU5UX1RPS0VOKVxuXHRcdFx0XHRcdHRoaXMuaWdub3JlTGluZSgpO1xuXHRcdFx0XHRjaCA9IHRoaXMuZ2V0TmV4dENoYXIoKTtcblxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY2ggIT0gXCJ9XCIpXG5cdFx0XHRcdHRoaXMucHV0QmFjaygpO1xuXHRcdH0gd2hpbGUgKGNoICE9IFwifVwiKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQdXRzIGJhY2sgdGhlIGxhc3QgcmVhZCBjaGFyYWN0ZXIgaW50byB0aGUgZGF0YSBzdHJlYW0uXG5cdCAqL1xuXHRwcml2YXRlIHB1dEJhY2soKTp2b2lkXG5cdHtcblx0XHR0aGlzLl9wYXJzZUluZGV4LS07XG5cdFx0dGhpcy5fY2hhckxpbmVJbmRleC0tO1xuXHRcdHRoaXMuX3JlYWNoZWRFT0YgPSB0aGlzLl9wYXJzZUluZGV4ID49IHRoaXMuX3RleHREYXRhLmxlbmd0aDtcblx0fVxuXG5cdC8qKlxuXHQgKiBQYXJzZXMgdGhlIG1lc2ggZ2VvbWV0cnkuXG5cdCAqL1xuXHRwcml2YXRlIHBhcnNlTWVzaCgpOnZvaWRcblx0e1xuXHRcdHZhciB0b2tlbjpzdHJpbmcgPSB0aGlzLmdldE5leHRUb2tlbigpO1xuXHRcdHZhciBjaDpzdHJpbmc7XG5cdFx0dmFyIHZlcnRleERhdGE6QXJyYXk8VmVydGV4RGF0YT47XG5cdFx0dmFyIHdlaWdodHM6QXJyYXk8Sm9pbnREYXRhPjtcblx0XHR2YXIgaW5kaWNlczpBcnJheTxudW1iZXI+IC8qdWludCovO1xuXG5cdFx0aWYgKHRva2VuICE9IFwie1wiKVxuXHRcdFx0dGhpcy5zZW5kVW5rbm93bktleXdvcmRFcnJvcigpO1xuXG5cdFx0aWYgKHRoaXMuX3NoYWRlcnMgPT0gbnVsbClcblx0XHRcdHRoaXMuX3NoYWRlcnMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG5cdFx0d2hpbGUgKGNoICE9IFwifVwiKSB7XG5cdFx0XHRjaCA9IHRoaXMuZ2V0TmV4dFRva2VuKCk7XG5cdFx0XHRzd2l0Y2ggKGNoKSB7XG5cdFx0XHRcdGNhc2UgTUQ1TWVzaFBhcnNlci5DT01NRU5UX1RPS0VOOlxuXHRcdFx0XHRcdHRoaXMuaWdub3JlTGluZSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIE1ENU1lc2hQYXJzZXIuTUVTSF9TSEFERVJfVE9LRU46XG5cdFx0XHRcdFx0dGhpcy5fc2hhZGVycy5wdXNoKHRoaXMucGFyc2VMaXRlcmFsc3RyaW5nKCkpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIE1ENU1lc2hQYXJzZXIuTUVTSF9OVU1fVkVSVFNfVE9LRU46XG5cdFx0XHRcdFx0dmVydGV4RGF0YSA9IG5ldyBBcnJheTxWZXJ0ZXhEYXRhPih0aGlzLmdldE5leHRJbnQoKSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgTUQ1TWVzaFBhcnNlci5NRVNIX05VTV9UUklTX1RPS0VOOlxuXHRcdFx0XHRcdGluZGljZXMgPSBuZXcgQXJyYXk8bnVtYmVyPih0aGlzLmdldE5leHRJbnQoKSozKSAvKnVpbnQqLztcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBNRDVNZXNoUGFyc2VyLk1FU0hfTlVNX1dFSUdIVFNfVE9LRU46XG5cdFx0XHRcdFx0d2VpZ2h0cyA9IG5ldyBBcnJheTxKb2ludERhdGE+KHRoaXMuZ2V0TmV4dEludCgpKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBNRDVNZXNoUGFyc2VyLk1FU0hfVkVSVF9UT0tFTjpcblx0XHRcdFx0XHR0aGlzLnBhcnNlVmVydGV4KHZlcnRleERhdGEpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIE1ENU1lc2hQYXJzZXIuTUVTSF9UUklfVE9LRU46XG5cdFx0XHRcdFx0dGhpcy5wYXJzZVRyaShpbmRpY2VzKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBNRDVNZXNoUGFyc2VyLk1FU0hfV0VJR0hUX1RPS0VOOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VKb2ludCh3ZWlnaHRzKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5fbWVzaERhdGEgPT0gbnVsbClcblx0XHRcdHRoaXMuX21lc2hEYXRhID0gbmV3IEFycmF5PE1lc2hEYXRhPigpO1xuXG5cdFx0dmFyIGk6bnVtYmVyIC8qdWludCovID0gdGhpcy5fbWVzaERhdGEubGVuZ3RoO1xuXHRcdHRoaXMuX21lc2hEYXRhW2ldID0gbmV3IE1lc2hEYXRhKCk7XG5cdFx0dGhpcy5fbWVzaERhdGFbaV0udmVydGV4RGF0YSA9IHZlcnRleERhdGE7XG5cdFx0dGhpcy5fbWVzaERhdGFbaV0ud2VpZ2h0RGF0YSA9IHdlaWdodHM7XG5cdFx0dGhpcy5fbWVzaERhdGFbaV0uaW5kaWNlcyA9IGluZGljZXM7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgdGhlIG1lc2ggZGF0YSB0byBhIFNraW5uZWRTdWIgaW5zdGFuY2UuXG5cdCAqIEBwYXJhbSB2ZXJ0ZXhEYXRhIFRoZSBtZXNoJ3MgdmVydGljZXMuXG5cdCAqIEBwYXJhbSB3ZWlnaHRzIFRoZSBqb2ludCB3ZWlnaHRzIHBlciB2ZXJ0ZXguXG5cdCAqIEBwYXJhbSBpbmRpY2VzIFRoZSBpbmRpY2VzIGZvciB0aGUgZmFjZXMuXG5cdCAqIEByZXR1cm4gQSBTdWJHZW9tZXRyeSBpbnN0YW5jZSBjb250YWluaW5nIGFsbCBnZW9tZXRyaWNhbCBkYXRhIGZvciB0aGUgY3VycmVudCBtZXNoLlxuXHQgKi9cblx0cHJpdmF0ZSB0cmFuc2xhdGVHZW9tKHZlcnRleERhdGE6QXJyYXk8VmVydGV4RGF0YT4sIHdlaWdodHM6QXJyYXk8Sm9pbnREYXRhPiwgaW5kaWNlczpBcnJheTxudW1iZXI+IC8qdWludCovKTpUcmlhbmdsZVN1Ykdlb21ldHJ5XG5cdHtcblx0XHR2YXIgbGVuOm51bWJlciAvKmludCovID0gdmVydGV4RGF0YS5sZW5ndGg7XG5cdFx0dmFyIHYxOm51bWJlciAvKmludCovLCB2MjpudW1iZXIgLyppbnQqLywgdjM6bnVtYmVyIC8qaW50Ki87XG5cdFx0dmFyIHZlcnRleDpWZXJ0ZXhEYXRhO1xuXHRcdHZhciB3ZWlnaHQ6Sm9pbnREYXRhO1xuXHRcdHZhciBiaW5kUG9zZTpNYXRyaXgzRDtcblx0XHR2YXIgcG9zOlZlY3RvcjNEO1xuXHRcdHZhciBzdWJHZW9tOlRyaWFuZ2xlU3ViR2VvbWV0cnkgPSBuZXcgVHJpYW5nbGVTdWJHZW9tZXRyeSh0cnVlKTtcblx0XHR2YXIgdXZzOkFycmF5PG51bWJlcj4gPSBuZXcgQXJyYXk8bnVtYmVyPihsZW4qMik7XG5cdFx0dmFyIHZlcnRpY2VzOkFycmF5PG51bWJlcj4gPSBuZXcgQXJyYXk8bnVtYmVyPihsZW4qMyk7XG5cdFx0dmFyIGpvaW50SW5kaWNlczpBcnJheTxudW1iZXI+ID0gbmV3IEFycmF5PG51bWJlcj4obGVuKnRoaXMuX21heEpvaW50Q291bnQpO1xuXHRcdHZhciBqb2ludFdlaWdodHM6QXJyYXk8bnVtYmVyPiA9IG5ldyBBcnJheTxudW1iZXI+KGxlbip0aGlzLl9tYXhKb2ludENvdW50KTtcblx0XHR2YXIgbDpudW1iZXIgLyppbnQqLyA9IDA7XG5cdFx0dmFyIG5vblplcm9XZWlnaHRzOm51bWJlciAvKmludCovO1xuXG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgLyppbnQqLyA9IDA7IGkgPCBsZW47ICsraSkge1xuXHRcdFx0dmVydGV4ID0gdmVydGV4RGF0YVtpXTtcblx0XHRcdHYxID0gdmVydGV4LmluZGV4KjM7XG5cdFx0XHR2MiA9IHYxICsgMTtcblx0XHRcdHYzID0gdjEgKyAyO1xuXHRcdFx0dmVydGljZXNbdjFdID0gdmVydGljZXNbdjJdID0gdmVydGljZXNbdjNdID0gMDtcblxuXHRcdFx0bm9uWmVyb1dlaWdodHMgPSAwO1xuXHRcdFx0Zm9yICh2YXIgajpudW1iZXIgLyppbnQqLyA9IDA7IGogPCB2ZXJ0ZXguY291bnRXZWlnaHQ7ICsraikge1xuXHRcdFx0XHR3ZWlnaHQgPSB3ZWlnaHRzW3ZlcnRleC5zdGFydFdlaWdodCArIGpdO1xuXHRcdFx0XHRpZiAod2VpZ2h0LmJpYXMgPiAwKSB7XG5cdFx0XHRcdFx0YmluZFBvc2UgPSB0aGlzLl9iaW5kUG9zZXNbd2VpZ2h0LmpvaW50XTtcblx0XHRcdFx0XHRwb3MgPSBiaW5kUG9zZS50cmFuc2Zvcm1WZWN0b3Iod2VpZ2h0LnBvcyk7XG5cdFx0XHRcdFx0dmVydGljZXNbdjFdICs9IHBvcy54KndlaWdodC5iaWFzO1xuXHRcdFx0XHRcdHZlcnRpY2VzW3YyXSArPSBwb3MueSp3ZWlnaHQuYmlhcztcblx0XHRcdFx0XHR2ZXJ0aWNlc1t2M10gKz0gcG9zLnoqd2VpZ2h0LmJpYXM7XG5cblx0XHRcdFx0XHQvLyBpbmRpY2VzIG5lZWQgdG8gYmUgbXVsdGlwbGllZCBieSAzIChhbW91bnQgb2YgbWF0cml4IHJlZ2lzdGVycylcblx0XHRcdFx0XHRqb2ludEluZGljZXNbbF0gPSB3ZWlnaHQuam9pbnQqMztcblx0XHRcdFx0XHRqb2ludFdlaWdodHNbbCsrXSA9IHdlaWdodC5iaWFzO1xuXHRcdFx0XHRcdCsrbm9uWmVyb1dlaWdodHM7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Zm9yIChqID0gbm9uWmVyb1dlaWdodHM7IGogPCB0aGlzLl9tYXhKb2ludENvdW50OyArK2opIHtcblx0XHRcdFx0am9pbnRJbmRpY2VzW2xdID0gMDtcblx0XHRcdFx0am9pbnRXZWlnaHRzW2wrK10gPSAwO1xuXHRcdFx0fVxuXG5cdFx0XHR2MSA9IHZlcnRleC5pbmRleCA8PCAxO1xuXHRcdFx0dXZzW3YxKytdID0gdmVydGV4LnM7XG5cdFx0XHR1dnNbdjFdID0gdmVydGV4LnQ7XG5cdFx0fVxuXG5cdFx0c3ViR2VvbS5qb2ludHNQZXJWZXJ0ZXggPSB0aGlzLl9tYXhKb2ludENvdW50O1xuXHRcdHN1Ykdlb20udXBkYXRlSW5kaWNlcyhpbmRpY2VzKTtcblx0XHRzdWJHZW9tLnVwZGF0ZVBvc2l0aW9ucyh2ZXJ0aWNlcyk7XG5cdFx0c3ViR2VvbS51cGRhdGVVVnModXZzKTtcblx0XHRzdWJHZW9tLnVwZGF0ZUpvaW50SW5kaWNlcyhqb2ludEluZGljZXMpO1xuXHRcdHN1Ykdlb20udXBkYXRlSm9pbnRXZWlnaHRzKGpvaW50V2VpZ2h0cyk7XG5cdFx0Ly8gY2F1c2UgZXhwbGljaXQgdXBkYXRlc1xuXHRcdHN1Ykdlb20udmVydGV4Tm9ybWFscztcblx0XHRzdWJHZW9tLnZlcnRleFRhbmdlbnRzO1xuXHRcdC8vIHR1cm4gYXV0byB1cGRhdGVzIG9mZiBiZWNhdXNlIHRoZXkgbWF5IGJlIGFuaW1hdGVkIGFuZCBzZXQgZXhwbGljaXRseVxuXHRcdHN1Ykdlb20uYXV0b0Rlcml2ZVRhbmdlbnRzID0gZmFsc2U7XG5cdFx0c3ViR2VvbS5hdXRvRGVyaXZlTm9ybWFscyA9IGZhbHNlO1xuXG5cdFx0cmV0dXJuIHN1Ykdlb207XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmUgdGhlIG5leHQgdHJpcGxldCBvZiB2ZXJ0ZXggaW5kaWNlcyB0aGF0IGZvcm0gYSBmYWNlLlxuXHQgKiBAcGFyYW0gaW5kaWNlcyBUaGUgaW5kZXggbGlzdCBpbiB3aGljaCB0byBzdG9yZSB0aGUgcmVhZCBkYXRhLlxuXHQgKi9cblx0cHJpdmF0ZSBwYXJzZVRyaShpbmRpY2VzOkFycmF5PG51bWJlcj4gLyp1aW50Ki8pOnZvaWRcblx0e1xuXHRcdHZhciBpbmRleDpudW1iZXIgLyppbnQqLyA9IHRoaXMuZ2V0TmV4dEludCgpKjM7XG5cdFx0aW5kaWNlc1tpbmRleF0gPSB0aGlzLmdldE5leHRJbnQoKTtcblx0XHRpbmRpY2VzW2luZGV4ICsgMV0gPSB0aGlzLmdldE5leHRJbnQoKTtcblx0XHRpbmRpY2VzW2luZGV4ICsgMl0gPSB0aGlzLmdldE5leHRJbnQoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWFkcyBhIG5ldyBqb2ludCBkYXRhIHNldCBmb3IgYSBzaW5nbGUgam9pbnQuXG5cdCAqIEBwYXJhbSB3ZWlnaHRzIHRoZSB0YXJnZXQgbGlzdCB0byBjb250YWluIHRoZSB3ZWlnaHQgZGF0YS5cblx0ICovXG5cdHByaXZhdGUgcGFyc2VKb2ludCh3ZWlnaHRzOkFycmF5PEpvaW50RGF0YT4pOnZvaWRcblx0e1xuXHRcdHZhciB3ZWlnaHQ6Sm9pbnREYXRhID0gbmV3IEpvaW50RGF0YSgpO1xuXHRcdHdlaWdodC5pbmRleCA9IHRoaXMuZ2V0TmV4dEludCgpO1xuXHRcdHdlaWdodC5qb2ludCA9IHRoaXMuZ2V0TmV4dEludCgpO1xuXHRcdHdlaWdodC5iaWFzID0gdGhpcy5nZXROZXh0TnVtYmVyKCk7XG5cdFx0d2VpZ2h0LnBvcyA9IHRoaXMucGFyc2VWZWN0b3IzRCgpO1xuXHRcdHdlaWdodHNbd2VpZ2h0LmluZGV4XSA9IHdlaWdodDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWFkcyB0aGUgZGF0YSBmb3IgYSBzaW5nbGUgdmVydGV4LlxuXHQgKiBAcGFyYW0gdmVydGV4RGF0YSBUaGUgbGlzdCB0byBjb250YWluIHRoZSB2ZXJ0ZXggZGF0YS5cblx0ICovXG5cdHByaXZhdGUgcGFyc2VWZXJ0ZXgodmVydGV4RGF0YTpBcnJheTxWZXJ0ZXhEYXRhPik6dm9pZFxuXHR7XG5cdFx0dmFyIHZlcnRleDpWZXJ0ZXhEYXRhID0gbmV3IFZlcnRleERhdGEoKTtcblx0XHR2ZXJ0ZXguaW5kZXggPSB0aGlzLmdldE5leHRJbnQoKTtcblx0XHR0aGlzLnBhcnNlVVYodmVydGV4KTtcblx0XHR2ZXJ0ZXguc3RhcnRXZWlnaHQgPSB0aGlzLmdldE5leHRJbnQoKTtcblx0XHR2ZXJ0ZXguY291bnRXZWlnaHQgPSB0aGlzLmdldE5leHRJbnQoKTtcblx0XHQvL1x0XHRcdGlmICh2ZXJ0ZXguY291bnRXZWlnaHQgPiBfbWF4Sm9pbnRDb3VudCkgX21heEpvaW50Q291bnQgPSB2ZXJ0ZXguY291bnRXZWlnaHQ7XG5cdFx0dmVydGV4RGF0YVt2ZXJ0ZXguaW5kZXhdID0gdmVydGV4O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJlYWRzIHRoZSBuZXh0IHV2IGNvb3JkaW5hdGUuXG5cdCAqIEBwYXJhbSB2ZXJ0ZXhEYXRhIFRoZSB2ZXJ0ZXhEYXRhIHRvIGNvbnRhaW4gdGhlIFVWIGNvb3JkaW5hdGVzLlxuXHQgKi9cblx0cHJpdmF0ZSBwYXJzZVVWKHZlcnRleERhdGE6VmVydGV4RGF0YSk6dm9pZFxuXHR7XG5cdFx0dmFyIGNoOnN0cmluZyA9IHRoaXMuZ2V0TmV4dFRva2VuKCk7XG5cdFx0aWYgKGNoICE9IFwiKFwiKVxuXHRcdFx0dGhpcy5zZW5kUGFyc2VFcnJvcihcIihcIik7XG5cdFx0dmVydGV4RGF0YS5zID0gdGhpcy5nZXROZXh0TnVtYmVyKCk7XG5cdFx0dmVydGV4RGF0YS50ID0gdGhpcy5nZXROZXh0TnVtYmVyKCk7XG5cblx0XHRpZiAodGhpcy5nZXROZXh0VG9rZW4oKSAhPSBcIilcIilcblx0XHRcdHRoaXMuc2VuZFBhcnNlRXJyb3IoXCIpXCIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIG5leHQgdG9rZW4gaW4gdGhlIGRhdGEgc3RyZWFtLlxuXHQgKi9cblx0cHJpdmF0ZSBnZXROZXh0VG9rZW4oKTpzdHJpbmdcblx0e1xuXHRcdHZhciBjaDpzdHJpbmc7XG5cdFx0dmFyIHRva2VuOnN0cmluZyA9IFwiXCI7XG5cblx0XHR3aGlsZSAoIXRoaXMuX3JlYWNoZWRFT0YpIHtcblx0XHRcdGNoID0gdGhpcy5nZXROZXh0Q2hhcigpO1xuXHRcdFx0aWYgKGNoID09IFwiIFwiIHx8IGNoID09IFwiXFxyXCIgfHwgY2ggPT0gXCJcXG5cIiB8fCBjaCA9PSBcIlxcdFwiKSB7XG5cdFx0XHRcdGlmICh0b2tlbiAhPSBNRDVNZXNoUGFyc2VyLkNPTU1FTlRfVE9LRU4pXG5cdFx0XHRcdFx0dGhpcy5za2lwV2hpdGVTcGFjZSgpO1xuXHRcdFx0XHRpZiAodG9rZW4gIT0gXCJcIilcblx0XHRcdFx0XHRyZXR1cm4gdG9rZW47XG5cdFx0XHR9IGVsc2Vcblx0XHRcdFx0dG9rZW4gKz0gY2g7XG5cblx0XHRcdGlmICh0b2tlbiA9PSBNRDVNZXNoUGFyc2VyLkNPTU1FTlRfVE9LRU4pXG5cdFx0XHRcdHJldHVybiB0b2tlbjtcblx0XHR9XG5cblx0XHRyZXR1cm4gdG9rZW47XG5cdH1cblxuXHQvKipcblx0ICogU2tpcHMgYWxsIHdoaXRlc3BhY2UgaW4gdGhlIGRhdGEgc3RyZWFtLlxuXHQgKi9cblx0cHJpdmF0ZSBza2lwV2hpdGVTcGFjZSgpOnZvaWRcblx0e1xuXHRcdHZhciBjaDpzdHJpbmc7XG5cblx0XHRkb1xuXHRcdFx0Y2ggPSB0aGlzLmdldE5leHRDaGFyKCk7IHdoaWxlIChjaCA9PSBcIlxcblwiIHx8IGNoID09IFwiIFwiIHx8IGNoID09IFwiXFxyXCIgfHwgY2ggPT0gXCJcXHRcIik7XG5cblx0XHR0aGlzLnB1dEJhY2soKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTa2lwcyB0byB0aGUgbmV4dCBsaW5lLlxuXHQgKi9cblx0cHJpdmF0ZSBpZ25vcmVMaW5lKCk6dm9pZFxuXHR7XG5cdFx0dmFyIGNoOnN0cmluZztcblx0XHR3aGlsZSAoIXRoaXMuX3JlYWNoZWRFT0YgJiYgY2ggIT0gXCJcXG5cIilcblx0XHRcdGNoID0gdGhpcy5nZXROZXh0Q2hhcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgbmV4dCBzaW5nbGUgY2hhcmFjdGVyIGluIHRoZSBkYXRhIHN0cmVhbS5cblx0ICovXG5cdHByaXZhdGUgZ2V0TmV4dENoYXIoKTpzdHJpbmdcblx0e1xuXHRcdHZhciBjaDpzdHJpbmcgPSB0aGlzLl90ZXh0RGF0YS5jaGFyQXQodGhpcy5fcGFyc2VJbmRleCsrKTtcblxuXHRcdGlmIChjaCA9PSBcIlxcblwiKSB7XG5cdFx0XHQrK3RoaXMuX2xpbmU7XG5cdFx0XHR0aGlzLl9jaGFyTGluZUluZGV4ID0gMDtcblx0XHR9IGVsc2UgaWYgKGNoICE9IFwiXFxyXCIpXG5cdFx0XHQrK3RoaXMuX2NoYXJMaW5lSW5kZXg7XG5cblx0XHRpZiAodGhpcy5fcGFyc2VJbmRleCA+PSB0aGlzLl90ZXh0RGF0YS5sZW5ndGgpXG5cdFx0XHR0aGlzLl9yZWFjaGVkRU9GID0gdHJ1ZTtcblxuXHRcdHJldHVybiBjaDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIG5leHQgaW50ZWdlciBpbiB0aGUgZGF0YSBzdHJlYW0uXG5cdCAqL1xuXHRwcml2YXRlIGdldE5leHRJbnQoKTpudW1iZXIgLyppbnQqL1xuXHR7XG5cdFx0dmFyIGk6bnVtYmVyID0gcGFyc2VJbnQodGhpcy5nZXROZXh0VG9rZW4oKSk7XG5cdFx0aWYgKGlzTmFOKGkpKVxuXHRcdFx0dGhpcy5zZW5kUGFyc2VFcnJvcihcImludCB0eXBlXCIpO1xuXHRcdHJldHVybiBpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgbmV4dCBmbG9hdGluZyBwb2ludCBudW1iZXIgaW4gdGhlIGRhdGEgc3RyZWFtLlxuXHQgKi9cblx0cHJpdmF0ZSBnZXROZXh0TnVtYmVyKCk6bnVtYmVyXG5cdHtcblx0XHR2YXIgZjpudW1iZXIgPSBwYXJzZUZsb2F0KHRoaXMuZ2V0TmV4dFRva2VuKCkpO1xuXHRcdGlmIChpc05hTihmKSlcblx0XHRcdHRoaXMuc2VuZFBhcnNlRXJyb3IoXCJmbG9hdCB0eXBlXCIpO1xuXHRcdHJldHVybiBmO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgbmV4dCAzZCB2ZWN0b3IgaW4gdGhlIGRhdGEgc3RyZWFtLlxuXHQgKi9cblx0cHJpdmF0ZSBwYXJzZVZlY3RvcjNEKCk6VmVjdG9yM0Rcblx0e1xuXHRcdHZhciB2ZWM6VmVjdG9yM0QgPSBuZXcgVmVjdG9yM0QoKTtcblx0XHR2YXIgY2g6c3RyaW5nID0gdGhpcy5nZXROZXh0VG9rZW4oKTtcblxuXHRcdGlmIChjaCAhPSBcIihcIilcblx0XHRcdHRoaXMuc2VuZFBhcnNlRXJyb3IoXCIoXCIpO1xuXHRcdHZlYy54ID0gLXRoaXMuZ2V0TmV4dE51bWJlcigpO1xuXHRcdHZlYy55ID0gdGhpcy5nZXROZXh0TnVtYmVyKCk7XG5cdFx0dmVjLnogPSB0aGlzLmdldE5leHROdW1iZXIoKTtcblxuXHRcdGlmICh0aGlzLmdldE5leHRUb2tlbigpICE9IFwiKVwiKVxuXHRcdFx0dGhpcy5zZW5kUGFyc2VFcnJvcihcIilcIik7XG5cblx0XHRyZXR1cm4gdmVjO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgbmV4dCBxdWF0ZXJuaW9uIGluIHRoZSBkYXRhIHN0cmVhbS5cblx0ICovXG5cdHByaXZhdGUgcGFyc2VRdWF0ZXJuaW9uKCk6UXVhdGVybmlvblxuXHR7XG5cdFx0dmFyIHF1YXQ6UXVhdGVybmlvbiA9IG5ldyBRdWF0ZXJuaW9uKCk7XG5cdFx0dmFyIGNoOnN0cmluZyA9IHRoaXMuZ2V0TmV4dFRva2VuKCk7XG5cblx0XHRpZiAoY2ggIT0gXCIoXCIpXG5cdFx0XHR0aGlzLnNlbmRQYXJzZUVycm9yKFwiKFwiKTtcblx0XHRxdWF0LnggPSB0aGlzLmdldE5leHROdW1iZXIoKTtcblx0XHRxdWF0LnkgPSAtdGhpcy5nZXROZXh0TnVtYmVyKCk7XG5cdFx0cXVhdC56ID0gLXRoaXMuZ2V0TmV4dE51bWJlcigpO1xuXG5cdFx0Ly8gcXVhdCBzdXBwb3NlZCB0byBiZSB1bml0IGxlbmd0aFxuXHRcdHZhciB0Om51bWJlciA9IDEgLSBxdWF0LngqcXVhdC54IC0gcXVhdC55KnF1YXQueSAtIHF1YXQueipxdWF0Lno7XG5cdFx0cXVhdC53ID0gdCA8IDA/IDAgOiAtTWF0aC5zcXJ0KHQpO1xuXG5cdFx0aWYgKHRoaXMuZ2V0TmV4dFRva2VuKCkgIT0gXCIpXCIpXG5cdFx0XHR0aGlzLnNlbmRQYXJzZUVycm9yKFwiKVwiKTtcblxuXHRcdHZhciByb3RRdWF0OlF1YXRlcm5pb24gPSBuZXcgUXVhdGVybmlvbigpO1xuXHRcdHJvdFF1YXQubXVsdGlwbHkodGhpcy5fcm90YXRpb25RdWF0LCBxdWF0KTtcblx0XHRyZXR1cm4gcm90UXVhdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBQYXJzZXMgdGhlIGNvbW1hbmQgbGluZSBkYXRhLlxuXHQgKi9cblx0cHJpdmF0ZSBwYXJzZUNNRCgpOnZvaWRcblx0e1xuXHRcdC8vIGp1c3QgaWdub3JlIHRoZSBjb21tYW5kIGxpbmUgcHJvcGVydHlcblx0XHR0aGlzLnBhcnNlTGl0ZXJhbHN0cmluZygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgbmV4dCBsaXRlcmFsIHN0cmluZyBpbiB0aGUgZGF0YSBzdHJlYW0uIEEgbGl0ZXJhbCBzdHJpbmcgaXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJvdW5kZWRcblx0ICogYnkgZG91YmxlIHF1b3Rlcy5cblx0ICovXG5cdHByaXZhdGUgcGFyc2VMaXRlcmFsc3RyaW5nKCk6c3RyaW5nXG5cdHtcblx0XHR0aGlzLnNraXBXaGl0ZVNwYWNlKCk7XG5cblx0XHR2YXIgY2g6c3RyaW5nID0gdGhpcy5nZXROZXh0Q2hhcigpO1xuXHRcdHZhciBzdHI6c3RyaW5nID0gXCJcIjtcblxuXHRcdGlmIChjaCAhPSBcIlxcXCJcIilcblx0XHRcdHRoaXMuc2VuZFBhcnNlRXJyb3IoXCJcXFwiXCIpO1xuXG5cdFx0ZG8ge1xuXHRcdFx0aWYgKHRoaXMuX3JlYWNoZWRFT0YpXG5cdFx0XHRcdHRoaXMuc2VuZEVPRkVycm9yKCk7XG5cdFx0XHRjaCA9IHRoaXMuZ2V0TmV4dENoYXIoKTtcblx0XHRcdGlmIChjaCAhPSBcIlxcXCJcIilcblx0XHRcdFx0c3RyICs9IGNoO1xuXHRcdH0gd2hpbGUgKGNoICE9IFwiXFxcIlwiKTtcblxuXHRcdHJldHVybiBzdHI7XG5cdH1cblxuXHQvKipcblx0ICogVGhyb3dzIGFuIGVuZC1vZi1maWxlIGVycm9yIHdoZW4gYSBwcmVtYXR1cmUgZW5kIG9mIGZpbGUgd2FzIGVuY291bnRlcmVkLlxuXHQgKi9cblx0cHJpdmF0ZSBzZW5kRU9GRXJyb3IoKTp2b2lkXG5cdHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmV4cGVjdGVkIGVuZCBvZiBmaWxlXCIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRocm93cyBhbiBlcnJvciB3aGVuIGFuIHVuZXhwZWN0ZWQgdG9rZW4gd2FzIGVuY291bnRlcmVkLlxuXHQgKiBAcGFyYW0gZXhwZWN0ZWQgVGhlIHRva2VuIHR5cGUgdGhhdCB3YXMgYWN0dWFsbHkgZXhwZWN0ZWQuXG5cdCAqL1xuXHRwcml2YXRlIHNlbmRQYXJzZUVycm9yKGV4cGVjdGVkOnN0cmluZyk6dm9pZFxuXHR7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCB0b2tlbiBhdCBsaW5lIFwiICsgKHRoaXMuX2xpbmUgKyAxKSArIFwiLCBjaGFyYWN0ZXIgXCIgKyB0aGlzLl9jaGFyTGluZUluZGV4ICsgXCIuIFwiICsgZXhwZWN0ZWQgKyBcIiBleHBlY3RlZCwgYnV0IFwiICsgdGhpcy5fdGV4dERhdGEuY2hhckF0KHRoaXMuX3BhcnNlSW5kZXggLSAxKSArIFwiIGVuY291bnRlcmVkXCIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRocm93cyBhbiBlcnJvciB3aGVuIGFuIHVua25vd24ga2V5d29yZCB3YXMgZW5jb3VudGVyZWQuXG5cdCAqL1xuXHRwcml2YXRlIHNlbmRVbmtub3duS2V5d29yZEVycm9yKCk6dm9pZFxuXHR7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBrZXl3b3JkIGF0IGxpbmUgXCIgKyAodGhpcy5fbGluZSArIDEpICsgXCIsIGNoYXJhY3RlciBcIiArIHRoaXMuX2NoYXJMaW5lSW5kZXggKyBcIi4gXCIpO1xuXHR9XG59XG5cbmV4cG9ydCA9IE1ENU1lc2hQYXJzZXI7XG5cblxuY2xhc3MgVmVydGV4RGF0YVxue1xuXHRwdWJsaWMgaW5kZXg6bnVtYmVyIC8qaW50Ki87XG5cdHB1YmxpYyBzOm51bWJlcjtcblx0cHVibGljIHQ6bnVtYmVyO1xuXHRwdWJsaWMgc3RhcnRXZWlnaHQ6bnVtYmVyIC8qaW50Ki87XG5cdHB1YmxpYyBjb3VudFdlaWdodDpudW1iZXIgLyppbnQqLztcbn1cblxuY2xhc3MgSm9pbnREYXRhXG57XG5cdHB1YmxpYyBpbmRleDpudW1iZXIgLyppbnQqLztcblx0cHVibGljIGpvaW50Om51bWJlciAvKmludCovO1xuXHRwdWJsaWMgYmlhczpudW1iZXI7XG5cdHB1YmxpYyBwb3M6VmVjdG9yM0Q7XG59XG5cbmNsYXNzIE1lc2hEYXRhXG57XG5cdHB1YmxpYyB2ZXJ0ZXhEYXRhOkFycmF5PFZlcnRleERhdGE+O1xuXHRwdWJsaWMgd2VpZ2h0RGF0YTpBcnJheTxKb2ludERhdGE+O1xuXHRwdWJsaWMgaW5kaWNlczpBcnJheTxudW1iZXI+IC8qdWludCovO1xufVxuIl19