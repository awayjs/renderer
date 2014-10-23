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
var JointPose = require("awayjs-renderergl/lib/animators/data/JointPose");
var SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
var SkeletonClipNode = require("awayjs-renderergl/lib/animators/nodes/SkeletonClipNode");
var BaseFrameData = require("awayjs-renderergl/lib/parsers/data/BaseFrameData");
var BoundsData = require("awayjs-renderergl/lib/parsers/data/BoundsData");
var FrameData = require("awayjs-renderergl/lib/parsers/data/FrameData");
var HierarchyData = require("awayjs-renderergl/lib/parsers/data/HierarchyData");
/**
 * MD5AnimParser provides a parser for the md5anim data type, providing an animation sequence for the md5 format.
 *
 * todo: optimize
 */
var MD5AnimParser = (function (_super) {
    __extends(MD5AnimParser, _super);
    /**
     * Creates a new MD5AnimParser object.
     * @param uri The url or id of the data or file to be parsed.
     * @param extra The holder for extra contextual data that the parser might need.
     */
    function MD5AnimParser(additionalRotationAxis, additionalRotationRadians) {
        if (additionalRotationAxis === void 0) { additionalRotationAxis = null; }
        if (additionalRotationRadians === void 0) { additionalRotationRadians = 0; }
        _super.call(this, URLLoaderDataFormat.TEXT);
        this._parseIndex = 0;
        this._line = 0;
        this._charLineIndex = 0;
        this._rotationQuat = new Quaternion();
        var t1 = new Quaternion();
        var t2 = new Quaternion();
        t1.fromAxisAngle(Vector3D.X_AXIS, -Math.PI * .5);
        t2.fromAxisAngle(Vector3D.Y_AXIS, -Math.PI * .5);
        this._rotationQuat.multiply(t2, t1);
        if (additionalRotationAxis) {
            this._rotationQuat.multiply(t2, t1);
            t1.fromAxisAngle(additionalRotationAxis, additionalRotationRadians);
            this._rotationQuat.multiply(t1, this._rotationQuat);
        }
    }
    /**
     * Indicates whether or not a given file extension is supported by the parser.
     * @param extension The file extension of a potential file to be parsed.
     * @return Whether or not the given file type is supported.
     */
    MD5AnimParser.supportsType = function (extension) {
        extension = extension.toLowerCase();
        return extension == "md5anim";
    };
    /**
     * Tests whether a data block can be parsed by the parser.
     * @param data The data block to potentially be parsed.
     * @return Whether or not the given data is supported.
     */
    MD5AnimParser.supportsData = function (data) {
        return false;
    };
    /**
     * @inheritDoc
     */
    MD5AnimParser.prototype._pProceedParsing = function () {
        var token;
        if (!this._startedParsing) {
            this._textData = this._pGetTextData();
            this._startedParsing = true;
        }
        while (this._pHasTime()) {
            token = this.getNextToken();
            switch (token) {
                case MD5AnimParser.COMMENT_TOKEN:
                    this.ignoreLine();
                    break;
                case "":
                    break;
                case MD5AnimParser.VERSION_TOKEN:
                    this._version = this.getNextInt();
                    if (this._version != 10)
                        throw new Error("Unknown version number encountered!");
                    break;
                case MD5AnimParser.COMMAND_LINE_TOKEN:
                    this.parseCMD();
                    break;
                case MD5AnimParser.NUM_FRAMES_TOKEN:
                    this._numFrames = this.getNextInt();
                    this._bounds = new Array();
                    this._frameData = new Array();
                    break;
                case MD5AnimParser.NUM_JOINTS_TOKEN:
                    this._numJoints = this.getNextInt();
                    this._hierarchy = new Array(this._numJoints);
                    this._baseFrameData = new Array(this._numJoints);
                    break;
                case MD5AnimParser.FRAME_RATE_TOKEN:
                    this._frameRate = this.getNextInt();
                    break;
                case MD5AnimParser.NUM_ANIMATED_COMPONENTS_TOKEN:
                    this._numAnimatedComponents = this.getNextInt();
                    break;
                case MD5AnimParser.HIERARCHY_TOKEN:
                    this.parseHierarchy();
                    break;
                case MD5AnimParser.BOUNDS_TOKEN:
                    this.parseBounds();
                    break;
                case MD5AnimParser.BASE_FRAME_TOKEN:
                    this.parseBaseFrame();
                    break;
                case MD5AnimParser.FRAME_TOKEN:
                    this.parseFrame();
                    break;
                default:
                    if (!this._reachedEOF)
                        this.sendUnknownKeywordError();
            }
            if (this._reachedEOF) {
                this._clip = new SkeletonClipNode();
                this.translateClip();
                this._pFinalizeAsset(this._clip);
                return ParserBase.PARSING_DONE;
            }
        }
        return ParserBase.MORE_TO_PARSE;
    };
    /**
     * Converts all key frame data to an SkinnedAnimationSequence.
     */
    MD5AnimParser.prototype.translateClip = function () {
        for (var i = 0; i < this._numFrames; ++i)
            this._clip.addFrame(this.translatePose(this._frameData[i]), 1000 / this._frameRate);
    };
    /**
     * Converts a single key frame data to a SkeletonPose.
     * @param frameData The actual frame data.
     * @return A SkeletonPose containing the frame data's pose.
     */
    MD5AnimParser.prototype.translatePose = function (frameData) {
        var hierarchy;
        var pose;
        var base;
        var flags /*int*/;
        var j /*int*/;
        var translate = new Vector3D();
        var orientation = new Quaternion();
        var components = frameData.components;
        var skelPose = new SkeletonPose();
        var jointPoses = skelPose.jointPoses;
        for (var i = 0; i < this._numJoints; ++i) {
            j = 0;
            pose = new JointPose();
            hierarchy = this._hierarchy[i];
            base = this._baseFrameData[i];
            flags = hierarchy.flags;
            translate.x = base.position.x;
            translate.y = base.position.y;
            translate.z = base.position.z;
            orientation.x = base.orientation.x;
            orientation.y = base.orientation.y;
            orientation.z = base.orientation.z;
            if (flags & 1)
                translate.x = components[hierarchy.startIndex + (j++)];
            if (flags & 2)
                translate.y = components[hierarchy.startIndex + (j++)];
            if (flags & 4)
                translate.z = components[hierarchy.startIndex + (j++)];
            if (flags & 8)
                orientation.x = components[hierarchy.startIndex + (j++)];
            if (flags & 16)
                orientation.y = components[hierarchy.startIndex + (j++)];
            if (flags & 32)
                orientation.z = components[hierarchy.startIndex + (j++)];
            var w = 1 - orientation.x * orientation.x - orientation.y * orientation.y - orientation.z * orientation.z;
            orientation.w = w < 0 ? 0 : -Math.sqrt(w);
            if (hierarchy.parentIndex < 0) {
                pose.orientation.multiply(this._rotationQuat, orientation);
                pose.translation = this._rotationQuat.rotatePoint(translate);
            }
            else {
                pose.orientation.copyFrom(orientation);
                pose.translation.x = translate.x;
                pose.translation.y = translate.y;
                pose.translation.z = translate.z;
            }
            pose.orientation.y = -pose.orientation.y;
            pose.orientation.z = -pose.orientation.z;
            pose.translation.x = -pose.translation.x;
            jointPoses[i] = pose;
        }
        return skelPose;
    };
    /**
     * Parses the skeleton's hierarchy data.
     */
    MD5AnimParser.prototype.parseHierarchy = function () {
        var ch;
        var data;
        var token = this.getNextToken();
        var i = 0;
        if (token != "{")
            this.sendUnknownKeywordError();
        do {
            if (this._reachedEOF)
                this.sendEOFError();
            data = new HierarchyData();
            data.name = this.parseLiteralstring();
            data.parentIndex = this.getNextInt();
            data.flags = this.getNextInt();
            data.startIndex = this.getNextInt();
            this._hierarchy[i++] = data;
            ch = this.getNextChar();
            if (ch == "/") {
                this.putBack();
                ch = this.getNextToken();
                if (ch == MD5AnimParser.COMMENT_TOKEN)
                    this.ignoreLine();
                ch = this.getNextChar();
            }
            if (ch != "}")
                this.putBack();
        } while (ch != "}");
    };
    /**
     * Parses frame bounds.
     */
    MD5AnimParser.prototype.parseBounds = function () {
        var ch;
        var data;
        var token = this.getNextToken();
        var i = 0;
        if (token != "{")
            this.sendUnknownKeywordError();
        do {
            if (this._reachedEOF)
                this.sendEOFError();
            data = new BoundsData();
            data.min = this.parseVector3D();
            data.max = this.parseVector3D();
            this._bounds[i++] = data;
            ch = this.getNextChar();
            if (ch == "/") {
                this.putBack();
                ch = this.getNextToken();
                if (ch == MD5AnimParser.COMMENT_TOKEN)
                    this.ignoreLine();
                ch = this.getNextChar();
            }
            if (ch != "}")
                this.putBack();
        } while (ch != "}");
    };
    /**
     * Parses the base frame.
     */
    MD5AnimParser.prototype.parseBaseFrame = function () {
        var ch;
        var data;
        var token = this.getNextToken();
        var i = 0;
        if (token != "{")
            this.sendUnknownKeywordError();
        do {
            if (this._reachedEOF)
                this.sendEOFError();
            data = new BaseFrameData();
            data.position = this.parseVector3D();
            data.orientation = this.parseQuaternion();
            this._baseFrameData[i++] = data;
            ch = this.getNextChar();
            if (ch == "/") {
                this.putBack();
                ch = this.getNextToken();
                if (ch == MD5AnimParser.COMMENT_TOKEN)
                    this.ignoreLine();
                ch = this.getNextChar();
            }
            if (ch != "}")
                this.putBack();
        } while (ch != "}");
    };
    /**
     * Parses a single frame.
     */
    MD5AnimParser.prototype.parseFrame = function () {
        var ch;
        var data;
        var token;
        var frameIndex /*int*/;
        frameIndex = this.getNextInt();
        token = this.getNextToken();
        if (token != "{")
            this.sendUnknownKeywordError();
        do {
            if (this._reachedEOF)
                this.sendEOFError();
            data = new FrameData();
            data.components = new Array(this._numAnimatedComponents);
            for (var i = 0; i < this._numAnimatedComponents; ++i)
                data.components[i] = this.getNextNumber();
            this._frameData[frameIndex] = data;
            ch = this.getNextChar();
            if (ch == "/") {
                this.putBack();
                ch = this.getNextToken();
                if (ch == MD5AnimParser.COMMENT_TOKEN)
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
    MD5AnimParser.prototype.putBack = function () {
        this._parseIndex--;
        this._charLineIndex--;
        this._reachedEOF = this._parseIndex >= this._textData.length;
    };
    /**
     * Gets the next token in the data stream.
     */
    MD5AnimParser.prototype.getNextToken = function () {
        var ch;
        var token = "";
        while (!this._reachedEOF) {
            ch = this.getNextChar();
            if (ch == " " || ch == "\r" || ch == "\n" || ch == "\t") {
                if (token != MD5AnimParser.COMMENT_TOKEN)
                    this.skipWhiteSpace();
                if (token != "")
                    return token;
            }
            else
                token += ch;
            if (token == MD5AnimParser.COMMENT_TOKEN)
                return token;
        }
        return token;
    };
    /**
     * Skips all whitespace in the data stream.
     */
    MD5AnimParser.prototype.skipWhiteSpace = function () {
        var ch;
        do
            ch = this.getNextChar();
        while (ch == "\n" || ch == " " || ch == "\r" || ch == "\t");
        this.putBack();
    };
    /**
     * Skips to the next line.
     */
    MD5AnimParser.prototype.ignoreLine = function () {
        var ch;
        while (!this._reachedEOF && ch != "\n")
            ch = this.getNextChar();
    };
    /**
     * Retrieves the next single character in the data stream.
     */
    MD5AnimParser.prototype.getNextChar = function () {
        var ch = this._textData.charAt(this._parseIndex++);
        if (ch == "\n") {
            ++this._line;
            this._charLineIndex = 0;
        }
        else if (ch != "\r")
            ++this._charLineIndex;
        if (this._parseIndex == this._textData.length)
            this._reachedEOF = true;
        return ch;
    };
    /**
     * Retrieves the next integer in the data stream.
     */
    MD5AnimParser.prototype.getNextInt = function () {
        var i = parseInt(this.getNextToken());
        if (isNaN(i))
            this.sendParseError("int type");
        return i;
    };
    /**
     * Retrieves the next floating point number in the data stream.
     */
    MD5AnimParser.prototype.getNextNumber = function () {
        var f = parseFloat(this.getNextToken());
        if (isNaN(f))
            this.sendParseError("float type");
        return f;
    };
    /**
     * Retrieves the next 3d vector in the data stream.
     */
    MD5AnimParser.prototype.parseVector3D = function () {
        var vec = new Vector3D();
        var ch = this.getNextToken();
        if (ch != "(")
            this.sendParseError("(");
        vec.x = this.getNextNumber();
        vec.y = this.getNextNumber();
        vec.z = this.getNextNumber();
        if (this.getNextToken() != ")")
            this.sendParseError(")");
        return vec;
    };
    /**
     * Retrieves the next quaternion in the data stream.
     */
    MD5AnimParser.prototype.parseQuaternion = function () {
        var quat = new Quaternion();
        var ch = this.getNextToken();
        if (ch != "(")
            this.sendParseError("(");
        quat.x = this.getNextNumber();
        quat.y = this.getNextNumber();
        quat.z = this.getNextNumber();
        // quat supposed to be unit length
        var t = 1 - (quat.x * quat.x) - (quat.y * quat.y) - (quat.z * quat.z);
        quat.w = t < 0 ? 0 : -Math.sqrt(t);
        if (this.getNextToken() != ")")
            this.sendParseError(")");
        return quat;
    };
    /**
     * Parses the command line data.
     */
    MD5AnimParser.prototype.parseCMD = function () {
        // just ignore the command line property
        this.parseLiteralstring();
    };
    /**
     * Retrieves the next literal string in the data stream. A literal string is a sequence of characters bounded
     * by double quotes.
     */
    MD5AnimParser.prototype.parseLiteralstring = function () {
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
    MD5AnimParser.prototype.sendEOFError = function () {
        throw new Error("Unexpected end of file");
    };
    /**
     * Throws an error when an unexpected token was encountered.
     * @param expected The token type that was actually expected.
     */
    MD5AnimParser.prototype.sendParseError = function (expected) {
        throw new Error("Unexpected token at line " + (this._line + 1) + ", character " + this._charLineIndex + ". " + expected + " expected, but " + this._textData.charAt(this._parseIndex - 1) + " encountered");
    };
    /**
     * Throws an error when an unknown keyword was encountered.
     */
    MD5AnimParser.prototype.sendUnknownKeywordError = function () {
        throw new Error("Unknown keyword at line " + (this._line + 1) + ", character " + this._charLineIndex + ". ");
    };
    MD5AnimParser.VERSION_TOKEN = "MD5Version";
    MD5AnimParser.COMMAND_LINE_TOKEN = "commandline";
    MD5AnimParser.NUM_FRAMES_TOKEN = "numFrames";
    MD5AnimParser.NUM_JOINTS_TOKEN = "numJoints";
    MD5AnimParser.FRAME_RATE_TOKEN = "frameRate";
    MD5AnimParser.NUM_ANIMATED_COMPONENTS_TOKEN = "numAnimatedComponents";
    MD5AnimParser.HIERARCHY_TOKEN = "hierarchy";
    MD5AnimParser.BOUNDS_TOKEN = "bounds";
    MD5AnimParser.BASE_FRAME_TOKEN = "baseframe";
    MD5AnimParser.FRAME_TOKEN = "frame";
    MD5AnimParser.COMMENT_TOKEN = "//";
    return MD5AnimParser;
})(ParserBase);
module.exports = MD5AnimParser;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXJzZXJzL21kNWFuaW1wYXJzZXIudHMiXSwibmFtZXMiOlsiTUQ1QW5pbVBhcnNlciIsIk1ENUFuaW1QYXJzZXIuY29uc3RydWN0b3IiLCJNRDVBbmltUGFyc2VyLnN1cHBvcnRzVHlwZSIsIk1ENUFuaW1QYXJzZXIuc3VwcG9ydHNEYXRhIiwiTUQ1QW5pbVBhcnNlci5fcFByb2NlZWRQYXJzaW5nIiwiTUQ1QW5pbVBhcnNlci50cmFuc2xhdGVDbGlwIiwiTUQ1QW5pbVBhcnNlci50cmFuc2xhdGVQb3NlIiwiTUQ1QW5pbVBhcnNlci5wYXJzZUhpZXJhcmNoeSIsIk1ENUFuaW1QYXJzZXIucGFyc2VCb3VuZHMiLCJNRDVBbmltUGFyc2VyLnBhcnNlQmFzZUZyYW1lIiwiTUQ1QW5pbVBhcnNlci5wYXJzZUZyYW1lIiwiTUQ1QW5pbVBhcnNlci5wdXRCYWNrIiwiTUQ1QW5pbVBhcnNlci5nZXROZXh0VG9rZW4iLCJNRDVBbmltUGFyc2VyLnNraXBXaGl0ZVNwYWNlIiwiTUQ1QW5pbVBhcnNlci5pZ25vcmVMaW5lIiwiTUQ1QW5pbVBhcnNlci5nZXROZXh0Q2hhciIsIk1ENUFuaW1QYXJzZXIuZ2V0TmV4dEludCIsIk1ENUFuaW1QYXJzZXIuZ2V0TmV4dE51bWJlciIsIk1ENUFuaW1QYXJzZXIucGFyc2VWZWN0b3IzRCIsIk1ENUFuaW1QYXJzZXIucGFyc2VRdWF0ZXJuaW9uIiwiTUQ1QW5pbVBhcnNlci5wYXJzZUNNRCIsIk1ENUFuaW1QYXJzZXIucGFyc2VMaXRlcmFsc3RyaW5nIiwiTUQ1QW5pbVBhcnNlci5zZW5kRU9GRXJyb3IiLCJNRDVBbmltUGFyc2VyLnNlbmRQYXJzZUVycm9yIiwiTUQ1QW5pbVBhcnNlci5zZW5kVW5rbm93bktleXdvcmRFcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTyxVQUFVLFdBQWdCLGlDQUFpQyxDQUFDLENBQUM7QUFDcEUsSUFBTyxRQUFRLFdBQWlCLCtCQUErQixD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R0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDMURBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLEdBQUdBLEVBQUVBLENBQUNBO2dCQUNkQSxXQUFXQSxDQUFDQSxDQUFDQSxHQUFHQSxVQUFVQSxDQUFDQSxTQUFTQSxDQUFDQSxVQUFVQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUUxREEsSUFBSUEsQ0FBQ0EsR0FBVUEsQ0FBQ0EsR0FBR0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDM0dBLFdBQVdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLEdBQUVBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBRXpDQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxXQUFXQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDL0JBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLFdBQVdBLENBQUNBLENBQUNBO2dCQUMzREEsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7WUFDOURBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNQQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtnQkFDdkNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLEdBQUdBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO2dC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QSwyQkFBYUEsR0FBVUEsSUFBSUEsQ0FBQ0E7SUF5akIzQ0Esb0JBQUNBO0FBQURBLENBemtCQSxBQXlrQkNBLEVBemtCMkIsVUFBVSxFQXlrQnJDO0FBRUQsQUFBdUIsaUJBQWQsYUFBYSxDQUFDIiwiZmlsZSI6InBhcnNlcnMvTUQ1QW5pbVBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUXVhdGVybmlvblx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1F1YXRlcm5pb25cIik7XG5pbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1ZlY3RvcjNEXCIpO1xuaW1wb3J0IFVSTExvYWRlckRhdGFGb3JtYXRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMTG9hZGVyRGF0YUZvcm1hdFwiKTtcbmltcG9ydCBQYXJzZXJCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3BhcnNlcnMvUGFyc2VyQmFzZVwiKTtcblxuaW1wb3J0IEpvaW50UG9zZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Kb2ludFBvc2VcIik7XG5pbXBvcnQgU2tlbGV0b25Qb3NlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1NrZWxldG9uUG9zZVwiKTtcbmltcG9ydCBTa2VsZXRvbkNsaXBOb2RlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvU2tlbGV0b25DbGlwTm9kZVwiKTtcbmltcG9ydCBCYXNlRnJhbWVEYXRhXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXJzZXJzL2RhdGEvQmFzZUZyYW1lRGF0YVwiKTtcbmltcG9ydCBCb3VuZHNEYXRhXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3BhcnNlcnMvZGF0YS9Cb3VuZHNEYXRhXCIpO1xuaW1wb3J0IEZyYW1lRGF0YVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXJzZXJzL2RhdGEvRnJhbWVEYXRhXCIpO1xuaW1wb3J0IEhpZXJhcmNoeURhdGFcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3BhcnNlcnMvZGF0YS9IaWVyYXJjaHlEYXRhXCIpO1xuXG4vKipcbiAqIE1ENUFuaW1QYXJzZXIgcHJvdmlkZXMgYSBwYXJzZXIgZm9yIHRoZSBtZDVhbmltIGRhdGEgdHlwZSwgcHJvdmlkaW5nIGFuIGFuaW1hdGlvbiBzZXF1ZW5jZSBmb3IgdGhlIG1kNSBmb3JtYXQuXG4gKlxuICogdG9kbzogb3B0aW1pemVcbiAqL1xuY2xhc3MgTUQ1QW5pbVBhcnNlciBleHRlbmRzIFBhcnNlckJhc2Vcbntcblx0cHJpdmF0ZSBfdGV4dERhdGE6c3RyaW5nO1xuXHRwcml2YXRlIF9zdGFydGVkUGFyc2luZzpib29sZWFuO1xuXHRwdWJsaWMgc3RhdGljIFZFUlNJT05fVE9LRU46c3RyaW5nID0gXCJNRDVWZXJzaW9uXCI7XG5cdHB1YmxpYyBzdGF0aWMgQ09NTUFORF9MSU5FX1RPS0VOOnN0cmluZyA9IFwiY29tbWFuZGxpbmVcIjtcblx0cHVibGljIHN0YXRpYyBOVU1fRlJBTUVTX1RPS0VOOnN0cmluZyA9IFwibnVtRnJhbWVzXCI7XG5cdHB1YmxpYyBzdGF0aWMgTlVNX0pPSU5UU19UT0tFTjpzdHJpbmcgPSBcIm51bUpvaW50c1wiO1xuXHRwdWJsaWMgc3RhdGljIEZSQU1FX1JBVEVfVE9LRU46c3RyaW5nID0gXCJmcmFtZVJhdGVcIjtcblx0cHVibGljIHN0YXRpYyBOVU1fQU5JTUFURURfQ09NUE9ORU5UU19UT0tFTjpzdHJpbmcgPSBcIm51bUFuaW1hdGVkQ29tcG9uZW50c1wiO1xuXG5cdHB1YmxpYyBzdGF0aWMgSElFUkFSQ0hZX1RPS0VOOnN0cmluZyA9IFwiaGllcmFyY2h5XCI7XG5cdHB1YmxpYyBzdGF0aWMgQk9VTkRTX1RPS0VOOnN0cmluZyA9IFwiYm91bmRzXCI7XG5cdHB1YmxpYyBzdGF0aWMgQkFTRV9GUkFNRV9UT0tFTjpzdHJpbmcgPSBcImJhc2VmcmFtZVwiO1xuXHRwdWJsaWMgc3RhdGljIEZSQU1FX1RPS0VOOnN0cmluZyA9IFwiZnJhbWVcIjtcblxuXHRwdWJsaWMgc3RhdGljIENPTU1FTlRfVE9LRU46c3RyaW5nID0gXCIvL1wiO1xuXG5cdHByaXZhdGUgX3BhcnNlSW5kZXg6bnVtYmVyIC8qaW50Ki8gPSAwO1xuXHRwcml2YXRlIF9yZWFjaGVkRU9GOmJvb2xlYW47XG5cdHByaXZhdGUgX2xpbmU6bnVtYmVyIC8qaW50Ki8gPSAwO1xuXHRwcml2YXRlIF9jaGFyTGluZUluZGV4Om51bWJlciAvKmludCovID0gMDtcblx0cHJpdmF0ZSBfdmVyc2lvbjpudW1iZXIgLyppbnQqLztcblx0cHJpdmF0ZSBfZnJhbWVSYXRlOm51bWJlciAvKmludCovO1xuXHRwcml2YXRlIF9udW1GcmFtZXM6bnVtYmVyIC8qaW50Ki87XG5cdHByaXZhdGUgX251bUpvaW50czpudW1iZXIgLyppbnQqLztcblx0cHJpdmF0ZSBfbnVtQW5pbWF0ZWRDb21wb25lbnRzOm51bWJlciAvKmludCovO1xuXG5cdHByaXZhdGUgX2hpZXJhcmNoeTpBcnJheTxIaWVyYXJjaHlEYXRhPjtcblx0cHJpdmF0ZSBfYm91bmRzOkFycmF5PEJvdW5kc0RhdGE+O1xuXHRwcml2YXRlIF9mcmFtZURhdGE6QXJyYXk8RnJhbWVEYXRhPjtcblx0cHJpdmF0ZSBfYmFzZUZyYW1lRGF0YTpBcnJheTxCYXNlRnJhbWVEYXRhPjtcblxuXHRwcml2YXRlIF9yb3RhdGlvblF1YXQ6UXVhdGVybmlvbjtcblx0cHJpdmF0ZSBfY2xpcDpTa2VsZXRvbkNsaXBOb2RlO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IE1ENUFuaW1QYXJzZXIgb2JqZWN0LlxuXHQgKiBAcGFyYW0gdXJpIFRoZSB1cmwgb3IgaWQgb2YgdGhlIGRhdGEgb3IgZmlsZSB0byBiZSBwYXJzZWQuXG5cdCAqIEBwYXJhbSBleHRyYSBUaGUgaG9sZGVyIGZvciBleHRyYSBjb250ZXh0dWFsIGRhdGEgdGhhdCB0aGUgcGFyc2VyIG1pZ2h0IG5lZWQuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihhZGRpdGlvbmFsUm90YXRpb25BeGlzOlZlY3RvcjNEID0gbnVsbCwgYWRkaXRpb25hbFJvdGF0aW9uUmFkaWFuczpudW1iZXIgPSAwKVxuXHR7XG5cdFx0c3VwZXIoVVJMTG9hZGVyRGF0YUZvcm1hdC5URVhUKTtcblx0XHR0aGlzLl9yb3RhdGlvblF1YXQgPSBuZXcgUXVhdGVybmlvbigpO1xuXHRcdHZhciB0MTpRdWF0ZXJuaW9uID0gbmV3IFF1YXRlcm5pb24oKTtcblx0XHR2YXIgdDI6UXVhdGVybmlvbiA9IG5ldyBRdWF0ZXJuaW9uKCk7XG5cblx0XHR0MS5mcm9tQXhpc0FuZ2xlKFZlY3RvcjNELlhfQVhJUywgLU1hdGguUEkqLjUpO1xuXHRcdHQyLmZyb21BeGlzQW5nbGUoVmVjdG9yM0QuWV9BWElTLCAtTWF0aC5QSSouNSk7XG5cblx0XHR0aGlzLl9yb3RhdGlvblF1YXQubXVsdGlwbHkodDIsIHQxKTtcblxuXHRcdGlmIChhZGRpdGlvbmFsUm90YXRpb25BeGlzKSB7XG5cdFx0XHR0aGlzLl9yb3RhdGlvblF1YXQubXVsdGlwbHkodDIsIHQxKTtcblx0XHRcdHQxLmZyb21BeGlzQW5nbGUoYWRkaXRpb25hbFJvdGF0aW9uQXhpcywgYWRkaXRpb25hbFJvdGF0aW9uUmFkaWFucyk7XG5cdFx0XHR0aGlzLl9yb3RhdGlvblF1YXQubXVsdGlwbHkodDEsIHRoaXMuX3JvdGF0aW9uUXVhdCk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBhIGdpdmVuIGZpbGUgZXh0ZW5zaW9uIGlzIHN1cHBvcnRlZCBieSB0aGUgcGFyc2VyLlxuXHQgKiBAcGFyYW0gZXh0ZW5zaW9uIFRoZSBmaWxlIGV4dGVuc2lvbiBvZiBhIHBvdGVudGlhbCBmaWxlIHRvIGJlIHBhcnNlZC5cblx0ICogQHJldHVybiBXaGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gZmlsZSB0eXBlIGlzIHN1cHBvcnRlZC5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgc3VwcG9ydHNUeXBlKGV4dGVuc2lvbjpzdHJpbmcpOmJvb2xlYW5cblx0e1xuXHRcdGV4dGVuc2lvbiA9IGV4dGVuc2lvbi50b0xvd2VyQ2FzZSgpO1xuXHRcdHJldHVybiBleHRlbnNpb24gPT0gXCJtZDVhbmltXCI7XG5cdH1cblxuXHQvKipcblx0ICogVGVzdHMgd2hldGhlciBhIGRhdGEgYmxvY2sgY2FuIGJlIHBhcnNlZCBieSB0aGUgcGFyc2VyLlxuXHQgKiBAcGFyYW0gZGF0YSBUaGUgZGF0YSBibG9jayB0byBwb3RlbnRpYWxseSBiZSBwYXJzZWQuXG5cdCAqIEByZXR1cm4gV2hldGhlciBvciBub3QgdGhlIGdpdmVuIGRhdGEgaXMgc3VwcG9ydGVkLlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBzdXBwb3J0c0RhdGEoZGF0YTphbnkpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9wUHJvY2VlZFBhcnNpbmcoKTpib29sZWFuXG5cdHtcblx0XHR2YXIgdG9rZW46c3RyaW5nO1xuXG5cdFx0aWYgKCF0aGlzLl9zdGFydGVkUGFyc2luZykge1xuXHRcdFx0dGhpcy5fdGV4dERhdGEgPSB0aGlzLl9wR2V0VGV4dERhdGEoKTtcblx0XHRcdHRoaXMuX3N0YXJ0ZWRQYXJzaW5nID0gdHJ1ZTtcblx0XHR9XG5cblx0XHR3aGlsZSAodGhpcy5fcEhhc1RpbWUoKSkge1xuXHRcdFx0dG9rZW4gPSB0aGlzLmdldE5leHRUb2tlbigpO1xuXHRcdFx0c3dpdGNoICh0b2tlbikge1xuXHRcdFx0XHRjYXNlIE1ENUFuaW1QYXJzZXIuQ09NTUVOVF9UT0tFTjpcblx0XHRcdFx0XHR0aGlzLmlnbm9yZUxpbmUoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIlwiOlxuXHRcdFx0XHRcdC8vIGNhbiBvY2N1ciBhdCB0aGUgZW5kIG9mIGEgZmlsZVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIE1ENUFuaW1QYXJzZXIuVkVSU0lPTl9UT0tFTjpcblx0XHRcdFx0XHR0aGlzLl92ZXJzaW9uID0gdGhpcy5nZXROZXh0SW50KCk7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX3ZlcnNpb24gIT0gMTApXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIHZlcnNpb24gbnVtYmVyIGVuY291bnRlcmVkIVwiKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBNRDVBbmltUGFyc2VyLkNPTU1BTkRfTElORV9UT0tFTjpcblx0XHRcdFx0XHR0aGlzLnBhcnNlQ01EKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgTUQ1QW5pbVBhcnNlci5OVU1fRlJBTUVTX1RPS0VOOlxuXHRcdFx0XHRcdHRoaXMuX251bUZyYW1lcyA9IHRoaXMuZ2V0TmV4dEludCgpO1xuXHRcdFx0XHRcdHRoaXMuX2JvdW5kcyA9IG5ldyBBcnJheTxCb3VuZHNEYXRhPigpO1xuXHRcdFx0XHRcdHRoaXMuX2ZyYW1lRGF0YSA9IG5ldyBBcnJheTxGcmFtZURhdGE+KCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgTUQ1QW5pbVBhcnNlci5OVU1fSk9JTlRTX1RPS0VOOlxuXHRcdFx0XHRcdHRoaXMuX251bUpvaW50cyA9IHRoaXMuZ2V0TmV4dEludCgpO1xuXHRcdFx0XHRcdHRoaXMuX2hpZXJhcmNoeSA9IG5ldyBBcnJheTxIaWVyYXJjaHlEYXRhPih0aGlzLl9udW1Kb2ludHMpO1xuXHRcdFx0XHRcdHRoaXMuX2Jhc2VGcmFtZURhdGEgPSBuZXcgQXJyYXk8QmFzZUZyYW1lRGF0YT4odGhpcy5fbnVtSm9pbnRzKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBNRDVBbmltUGFyc2VyLkZSQU1FX1JBVEVfVE9LRU46XG5cdFx0XHRcdFx0dGhpcy5fZnJhbWVSYXRlID0gdGhpcy5nZXROZXh0SW50KCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgTUQ1QW5pbVBhcnNlci5OVU1fQU5JTUFURURfQ09NUE9ORU5UU19UT0tFTjpcblx0XHRcdFx0XHR0aGlzLl9udW1BbmltYXRlZENvbXBvbmVudHMgPSB0aGlzLmdldE5leHRJbnQoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBNRDVBbmltUGFyc2VyLkhJRVJBUkNIWV9UT0tFTjpcblx0XHRcdFx0XHR0aGlzLnBhcnNlSGllcmFyY2h5KCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgTUQ1QW5pbVBhcnNlci5CT1VORFNfVE9LRU46XG5cdFx0XHRcdFx0dGhpcy5wYXJzZUJvdW5kcygpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIE1ENUFuaW1QYXJzZXIuQkFTRV9GUkFNRV9UT0tFTjpcblx0XHRcdFx0XHR0aGlzLnBhcnNlQmFzZUZyYW1lKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgTUQ1QW5pbVBhcnNlci5GUkFNRV9UT0tFTjpcblx0XHRcdFx0XHR0aGlzLnBhcnNlRnJhbWUoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRpZiAoIXRoaXMuX3JlYWNoZWRFT0YpXG5cdFx0XHRcdFx0XHR0aGlzLnNlbmRVbmtub3duS2V5d29yZEVycm9yKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLl9yZWFjaGVkRU9GKSB7XG5cdFx0XHRcdHRoaXMuX2NsaXAgPSBuZXcgU2tlbGV0b25DbGlwTm9kZSgpO1xuXHRcdFx0XHR0aGlzLnRyYW5zbGF0ZUNsaXAoKTtcblx0XHRcdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQodGhpcy5fY2xpcCk7XG5cdFx0XHRcdHJldHVybiBQYXJzZXJCYXNlLlBBUlNJTkdfRE9ORTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIFBhcnNlckJhc2UuTU9SRV9UT19QQVJTRTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhbGwga2V5IGZyYW1lIGRhdGEgdG8gYW4gU2tpbm5lZEFuaW1hdGlvblNlcXVlbmNlLlxuXHQgKi9cblx0cHJpdmF0ZSB0cmFuc2xhdGVDbGlwKCk6dm9pZFxuXHR7XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgLyppbnQqLyA9IDA7IGkgPCB0aGlzLl9udW1GcmFtZXM7ICsraSlcblx0XHRcdHRoaXMuX2NsaXAuYWRkRnJhbWUodGhpcy50cmFuc2xhdGVQb3NlKHRoaXMuX2ZyYW1lRGF0YVtpXSksIDEwMDAvdGhpcy5fZnJhbWVSYXRlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhIHNpbmdsZSBrZXkgZnJhbWUgZGF0YSB0byBhIFNrZWxldG9uUG9zZS5cblx0ICogQHBhcmFtIGZyYW1lRGF0YSBUaGUgYWN0dWFsIGZyYW1lIGRhdGEuXG5cdCAqIEByZXR1cm4gQSBTa2VsZXRvblBvc2UgY29udGFpbmluZyB0aGUgZnJhbWUgZGF0YSdzIHBvc2UuXG5cdCAqL1xuXHRwcml2YXRlIHRyYW5zbGF0ZVBvc2UoZnJhbWVEYXRhOkZyYW1lRGF0YSk6U2tlbGV0b25Qb3NlXG5cdHtcblx0XHR2YXIgaGllcmFyY2h5OkhpZXJhcmNoeURhdGE7XG5cdFx0dmFyIHBvc2U6Sm9pbnRQb3NlO1xuXHRcdHZhciBiYXNlOkJhc2VGcmFtZURhdGE7XG5cdFx0dmFyIGZsYWdzOm51bWJlciAvKmludCovO1xuXHRcdHZhciBqOm51bWJlciAvKmludCovO1xuXHRcdHZhciB0cmFuc2xhdGU6VmVjdG9yM0QgPSBuZXcgVmVjdG9yM0QoKTtcblx0XHR2YXIgb3JpZW50YXRpb246UXVhdGVybmlvbiA9IG5ldyBRdWF0ZXJuaW9uKCk7XG5cdFx0dmFyIGNvbXBvbmVudHM6QXJyYXk8bnVtYmVyPiA9IGZyYW1lRGF0YS5jb21wb25lbnRzO1xuXHRcdHZhciBza2VsUG9zZTpTa2VsZXRvblBvc2UgPSBuZXcgU2tlbGV0b25Qb3NlKCk7XG5cdFx0dmFyIGpvaW50UG9zZXM6QXJyYXk8Sm9pbnRQb3NlPiA9IHNrZWxQb3NlLmpvaW50UG9zZXM7XG5cblx0XHRmb3IgKHZhciBpOm51bWJlciAvKmludCovID0gMDsgaSA8IHRoaXMuX251bUpvaW50czsgKytpKSB7XG5cdFx0XHRqID0gMDtcblx0XHRcdHBvc2UgPSBuZXcgSm9pbnRQb3NlKCk7XG5cdFx0XHRoaWVyYXJjaHkgPSB0aGlzLl9oaWVyYXJjaHlbaV07XG5cdFx0XHRiYXNlID0gdGhpcy5fYmFzZUZyYW1lRGF0YVtpXTtcblx0XHRcdGZsYWdzID0gaGllcmFyY2h5LmZsYWdzO1xuXHRcdFx0dHJhbnNsYXRlLnggPSBiYXNlLnBvc2l0aW9uLng7XG5cdFx0XHR0cmFuc2xhdGUueSA9IGJhc2UucG9zaXRpb24ueTtcblx0XHRcdHRyYW5zbGF0ZS56ID0gYmFzZS5wb3NpdGlvbi56O1xuXHRcdFx0b3JpZW50YXRpb24ueCA9IGJhc2Uub3JpZW50YXRpb24ueDtcblx0XHRcdG9yaWVudGF0aW9uLnkgPSBiYXNlLm9yaWVudGF0aW9uLnk7XG5cdFx0XHRvcmllbnRhdGlvbi56ID0gYmFzZS5vcmllbnRhdGlvbi56O1xuXG5cdFx0XHRpZiAoZmxhZ3MgJiAxKVxuXHRcdFx0XHR0cmFuc2xhdGUueCA9IGNvbXBvbmVudHNbaGllcmFyY2h5LnN0YXJ0SW5kZXggKyAoaisrKV07XG5cdFx0XHRpZiAoZmxhZ3MgJiAyKVxuXHRcdFx0XHR0cmFuc2xhdGUueSA9IGNvbXBvbmVudHNbaGllcmFyY2h5LnN0YXJ0SW5kZXggKyAoaisrKV07XG5cdFx0XHRpZiAoZmxhZ3MgJiA0KVxuXHRcdFx0XHR0cmFuc2xhdGUueiA9IGNvbXBvbmVudHNbaGllcmFyY2h5LnN0YXJ0SW5kZXggKyAoaisrKV07XG5cdFx0XHRpZiAoZmxhZ3MgJiA4KVxuXHRcdFx0XHRvcmllbnRhdGlvbi54ID0gY29tcG9uZW50c1toaWVyYXJjaHkuc3RhcnRJbmRleCArIChqKyspXTtcblx0XHRcdGlmIChmbGFncyAmIDE2KVxuXHRcdFx0XHRvcmllbnRhdGlvbi55ID0gY29tcG9uZW50c1toaWVyYXJjaHkuc3RhcnRJbmRleCArIChqKyspXTtcblx0XHRcdGlmIChmbGFncyAmIDMyKVxuXHRcdFx0XHRvcmllbnRhdGlvbi56ID0gY29tcG9uZW50c1toaWVyYXJjaHkuc3RhcnRJbmRleCArIChqKyspXTtcblxuXHRcdFx0dmFyIHc6bnVtYmVyID0gMSAtIG9yaWVudGF0aW9uLngqb3JpZW50YXRpb24ueCAtIG9yaWVudGF0aW9uLnkqb3JpZW50YXRpb24ueSAtIG9yaWVudGF0aW9uLnoqb3JpZW50YXRpb24uejtcblx0XHRcdG9yaWVudGF0aW9uLncgPSB3IDwgMD8gMCA6IC1NYXRoLnNxcnQodyk7XG5cblx0XHRcdGlmIChoaWVyYXJjaHkucGFyZW50SW5kZXggPCAwKSB7XG5cdFx0XHRcdHBvc2Uub3JpZW50YXRpb24ubXVsdGlwbHkodGhpcy5fcm90YXRpb25RdWF0LCBvcmllbnRhdGlvbik7XG5cdFx0XHRcdHBvc2UudHJhbnNsYXRpb24gPSB0aGlzLl9yb3RhdGlvblF1YXQucm90YXRlUG9pbnQodHJhbnNsYXRlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHBvc2Uub3JpZW50YXRpb24uY29weUZyb20ob3JpZW50YXRpb24pO1xuXHRcdFx0XHRwb3NlLnRyYW5zbGF0aW9uLnggPSB0cmFuc2xhdGUueDtcblx0XHRcdFx0cG9zZS50cmFuc2xhdGlvbi55ID0gdHJhbnNsYXRlLnk7XG5cdFx0XHRcdHBvc2UudHJhbnNsYXRpb24ueiA9IHRyYW5zbGF0ZS56O1xuXHRcdFx0fVxuXHRcdFx0cG9zZS5vcmllbnRhdGlvbi55ID0gLXBvc2Uub3JpZW50YXRpb24ueTtcblx0XHRcdHBvc2Uub3JpZW50YXRpb24ueiA9IC1wb3NlLm9yaWVudGF0aW9uLno7XG5cdFx0XHRwb3NlLnRyYW5zbGF0aW9uLnggPSAtcG9zZS50cmFuc2xhdGlvbi54O1xuXG5cdFx0XHRqb2ludFBvc2VzW2ldID0gcG9zZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gc2tlbFBvc2U7XG5cdH1cblxuXHQvKipcblx0ICogUGFyc2VzIHRoZSBza2VsZXRvbidzIGhpZXJhcmNoeSBkYXRhLlxuXHQgKi9cblx0cHJpdmF0ZSBwYXJzZUhpZXJhcmNoeSgpOnZvaWRcblx0e1xuXHRcdHZhciBjaDpzdHJpbmc7XG5cdFx0dmFyIGRhdGE6SGllcmFyY2h5RGF0YTtcblx0XHR2YXIgdG9rZW46c3RyaW5nID0gdGhpcy5nZXROZXh0VG9rZW4oKTtcblx0XHR2YXIgaTpudW1iZXIgLyppbnQqLyA9IDA7XG5cblx0XHRpZiAodG9rZW4gIT0gXCJ7XCIpXG5cdFx0XHR0aGlzLnNlbmRVbmtub3duS2V5d29yZEVycm9yKCk7XG5cblx0XHRkbyB7XG5cdFx0XHRpZiAodGhpcy5fcmVhY2hlZEVPRilcblx0XHRcdFx0dGhpcy5zZW5kRU9GRXJyb3IoKTtcblx0XHRcdGRhdGEgPSBuZXcgSGllcmFyY2h5RGF0YSgpO1xuXHRcdFx0ZGF0YS5uYW1lID0gdGhpcy5wYXJzZUxpdGVyYWxzdHJpbmcoKTtcblx0XHRcdGRhdGEucGFyZW50SW5kZXggPSB0aGlzLmdldE5leHRJbnQoKTtcblx0XHRcdGRhdGEuZmxhZ3MgPSB0aGlzLmdldE5leHRJbnQoKTtcblx0XHRcdGRhdGEuc3RhcnRJbmRleCA9IHRoaXMuZ2V0TmV4dEludCgpO1xuXHRcdFx0dGhpcy5faGllcmFyY2h5W2krK10gPSBkYXRhO1xuXG5cdFx0XHRjaCA9IHRoaXMuZ2V0TmV4dENoYXIoKTtcblxuXHRcdFx0aWYgKGNoID09IFwiL1wiKSB7XG5cdFx0XHRcdHRoaXMucHV0QmFjaygpO1xuXHRcdFx0XHRjaCA9IHRoaXMuZ2V0TmV4dFRva2VuKCk7XG5cdFx0XHRcdGlmIChjaCA9PSBNRDVBbmltUGFyc2VyLkNPTU1FTlRfVE9LRU4pXG5cdFx0XHRcdFx0dGhpcy5pZ25vcmVMaW5lKCk7XG5cdFx0XHRcdGNoID0gdGhpcy5nZXROZXh0Q2hhcigpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY2ggIT0gXCJ9XCIpXG5cdFx0XHRcdHRoaXMucHV0QmFjaygpO1xuXG5cdFx0fSB3aGlsZSAoY2ggIT0gXCJ9XCIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBhcnNlcyBmcmFtZSBib3VuZHMuXG5cdCAqL1xuXHRwcml2YXRlIHBhcnNlQm91bmRzKCk6dm9pZFxuXHR7XG5cdFx0dmFyIGNoOnN0cmluZztcblx0XHR2YXIgZGF0YTpCb3VuZHNEYXRhO1xuXHRcdHZhciB0b2tlbjpzdHJpbmcgPSB0aGlzLmdldE5leHRUb2tlbigpO1xuXHRcdHZhciBpOm51bWJlciAvKmludCovID0gMDtcblxuXHRcdGlmICh0b2tlbiAhPSBcIntcIilcblx0XHRcdHRoaXMuc2VuZFVua25vd25LZXl3b3JkRXJyb3IoKTtcblxuXHRcdGRvIHtcblx0XHRcdGlmICh0aGlzLl9yZWFjaGVkRU9GKVxuXHRcdFx0XHR0aGlzLnNlbmRFT0ZFcnJvcigpO1xuXHRcdFx0ZGF0YSA9IG5ldyBCb3VuZHNEYXRhKCk7XG5cdFx0XHRkYXRhLm1pbiA9IHRoaXMucGFyc2VWZWN0b3IzRCgpO1xuXHRcdFx0ZGF0YS5tYXggPSB0aGlzLnBhcnNlVmVjdG9yM0QoKTtcblx0XHRcdHRoaXMuX2JvdW5kc1tpKytdID0gZGF0YTtcblxuXHRcdFx0Y2ggPSB0aGlzLmdldE5leHRDaGFyKCk7XG5cblx0XHRcdGlmIChjaCA9PSBcIi9cIikge1xuXHRcdFx0XHR0aGlzLnB1dEJhY2soKTtcblx0XHRcdFx0Y2ggPSB0aGlzLmdldE5leHRUb2tlbigpO1xuXHRcdFx0XHRpZiAoY2ggPT0gTUQ1QW5pbVBhcnNlci5DT01NRU5UX1RPS0VOKVxuXHRcdFx0XHRcdHRoaXMuaWdub3JlTGluZSgpO1xuXHRcdFx0XHRjaCA9IHRoaXMuZ2V0TmV4dENoYXIoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNoICE9IFwifVwiKVxuXHRcdFx0XHR0aGlzLnB1dEJhY2soKTtcblxuXHRcdH0gd2hpbGUgKGNoICE9IFwifVwiKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQYXJzZXMgdGhlIGJhc2UgZnJhbWUuXG5cdCAqL1xuXHRwcml2YXRlIHBhcnNlQmFzZUZyYW1lKCk6dm9pZFxuXHR7XG5cdFx0dmFyIGNoOnN0cmluZztcblx0XHR2YXIgZGF0YTpCYXNlRnJhbWVEYXRhO1xuXHRcdHZhciB0b2tlbjpzdHJpbmcgPSB0aGlzLmdldE5leHRUb2tlbigpO1xuXHRcdHZhciBpOm51bWJlciAvKmludCovID0gMDtcblxuXHRcdGlmICh0b2tlbiAhPSBcIntcIilcblx0XHRcdHRoaXMuc2VuZFVua25vd25LZXl3b3JkRXJyb3IoKTtcblxuXHRcdGRvIHtcblx0XHRcdGlmICh0aGlzLl9yZWFjaGVkRU9GKVxuXHRcdFx0XHR0aGlzLnNlbmRFT0ZFcnJvcigpO1xuXHRcdFx0ZGF0YSA9IG5ldyBCYXNlRnJhbWVEYXRhKCk7XG5cdFx0XHRkYXRhLnBvc2l0aW9uID0gdGhpcy5wYXJzZVZlY3RvcjNEKCk7XG5cdFx0XHRkYXRhLm9yaWVudGF0aW9uID0gdGhpcy5wYXJzZVF1YXRlcm5pb24oKTtcblx0XHRcdHRoaXMuX2Jhc2VGcmFtZURhdGFbaSsrXSA9IGRhdGE7XG5cblx0XHRcdGNoID0gdGhpcy5nZXROZXh0Q2hhcigpO1xuXG5cdFx0XHRpZiAoY2ggPT0gXCIvXCIpIHtcblx0XHRcdFx0dGhpcy5wdXRCYWNrKCk7XG5cdFx0XHRcdGNoID0gdGhpcy5nZXROZXh0VG9rZW4oKTtcblx0XHRcdFx0aWYgKGNoID09IE1ENUFuaW1QYXJzZXIuQ09NTUVOVF9UT0tFTilcblx0XHRcdFx0XHR0aGlzLmlnbm9yZUxpbmUoKTtcblx0XHRcdFx0Y2ggPSB0aGlzLmdldE5leHRDaGFyKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjaCAhPSBcIn1cIilcblx0XHRcdFx0dGhpcy5wdXRCYWNrKCk7XG5cblx0XHR9IHdoaWxlIChjaCAhPSBcIn1cIik7XG5cdH1cblxuXHQvKipcblx0ICogUGFyc2VzIGEgc2luZ2xlIGZyYW1lLlxuXHQgKi9cblx0cHJpdmF0ZSBwYXJzZUZyYW1lKCk6dm9pZFxuXHR7XG5cdFx0dmFyIGNoOnN0cmluZztcblx0XHR2YXIgZGF0YTpGcmFtZURhdGE7XG5cdFx0dmFyIHRva2VuOnN0cmluZztcblx0XHR2YXIgZnJhbWVJbmRleDpudW1iZXIgLyppbnQqLztcblxuXHRcdGZyYW1lSW5kZXggPSB0aGlzLmdldE5leHRJbnQoKTtcblxuXHRcdHRva2VuID0gdGhpcy5nZXROZXh0VG9rZW4oKTtcblx0XHRpZiAodG9rZW4gIT0gXCJ7XCIpXG5cdFx0XHR0aGlzLnNlbmRVbmtub3duS2V5d29yZEVycm9yKCk7XG5cblx0XHRkbyB7XG5cdFx0XHRpZiAodGhpcy5fcmVhY2hlZEVPRilcblx0XHRcdFx0dGhpcy5zZW5kRU9GRXJyb3IoKTtcblx0XHRcdGRhdGEgPSBuZXcgRnJhbWVEYXRhKCk7XG5cdFx0XHRkYXRhLmNvbXBvbmVudHMgPSBuZXcgQXJyYXk8bnVtYmVyPih0aGlzLl9udW1BbmltYXRlZENvbXBvbmVudHMpO1xuXG5cdFx0XHRmb3IgKHZhciBpOm51bWJlciAvKmludCovID0gMDsgaSA8IHRoaXMuX251bUFuaW1hdGVkQ29tcG9uZW50czsgKytpKVxuXHRcdFx0XHRkYXRhLmNvbXBvbmVudHNbaV0gPSB0aGlzLmdldE5leHROdW1iZXIoKTtcblxuXHRcdFx0dGhpcy5fZnJhbWVEYXRhW2ZyYW1lSW5kZXhdID0gZGF0YTtcblxuXHRcdFx0Y2ggPSB0aGlzLmdldE5leHRDaGFyKCk7XG5cblx0XHRcdGlmIChjaCA9PSBcIi9cIikge1xuXHRcdFx0XHR0aGlzLnB1dEJhY2soKTtcblx0XHRcdFx0Y2ggPSB0aGlzLmdldE5leHRUb2tlbigpO1xuXHRcdFx0XHRpZiAoY2ggPT0gTUQ1QW5pbVBhcnNlci5DT01NRU5UX1RPS0VOKVxuXHRcdFx0XHRcdHRoaXMuaWdub3JlTGluZSgpO1xuXHRcdFx0XHRjaCA9IHRoaXMuZ2V0TmV4dENoYXIoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNoICE9IFwifVwiKVxuXHRcdFx0XHR0aGlzLnB1dEJhY2soKTtcblxuXHRcdH0gd2hpbGUgKGNoICE9IFwifVwiKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQdXRzIGJhY2sgdGhlIGxhc3QgcmVhZCBjaGFyYWN0ZXIgaW50byB0aGUgZGF0YSBzdHJlYW0uXG5cdCAqL1xuXHRwcml2YXRlIHB1dEJhY2soKTp2b2lkXG5cdHtcblx0XHR0aGlzLl9wYXJzZUluZGV4LS07XG5cdFx0dGhpcy5fY2hhckxpbmVJbmRleC0tO1xuXHRcdHRoaXMuX3JlYWNoZWRFT0YgPSB0aGlzLl9wYXJzZUluZGV4ID49IHRoaXMuX3RleHREYXRhLmxlbmd0aDtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXRzIHRoZSBuZXh0IHRva2VuIGluIHRoZSBkYXRhIHN0cmVhbS5cblx0ICovXG5cdHByaXZhdGUgZ2V0TmV4dFRva2VuKCk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY2g6c3RyaW5nO1xuXHRcdHZhciB0b2tlbjpzdHJpbmcgPSBcIlwiO1xuXG5cdFx0d2hpbGUgKCF0aGlzLl9yZWFjaGVkRU9GKSB7XG5cdFx0XHRjaCA9IHRoaXMuZ2V0TmV4dENoYXIoKTtcblx0XHRcdGlmIChjaCA9PSBcIiBcIiB8fCBjaCA9PSBcIlxcclwiIHx8IGNoID09IFwiXFxuXCIgfHwgY2ggPT0gXCJcXHRcIikge1xuXHRcdFx0XHRpZiAodG9rZW4gIT0gTUQ1QW5pbVBhcnNlci5DT01NRU5UX1RPS0VOKVxuXHRcdFx0XHRcdHRoaXMuc2tpcFdoaXRlU3BhY2UoKTtcblx0XHRcdFx0aWYgKHRva2VuICE9IFwiXCIpXG5cdFx0XHRcdFx0cmV0dXJuIHRva2VuO1xuXHRcdFx0fSBlbHNlXG5cdFx0XHRcdHRva2VuICs9IGNoO1xuXG5cdFx0XHRpZiAodG9rZW4gPT0gTUQ1QW5pbVBhcnNlci5DT01NRU5UX1RPS0VOKVxuXHRcdFx0XHRyZXR1cm4gdG9rZW47XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRva2VuO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNraXBzIGFsbCB3aGl0ZXNwYWNlIGluIHRoZSBkYXRhIHN0cmVhbS5cblx0ICovXG5cdHByaXZhdGUgc2tpcFdoaXRlU3BhY2UoKTp2b2lkXG5cdHtcblx0XHR2YXIgY2g6c3RyaW5nO1xuXG5cdFx0ZG9cblx0XHRcdGNoID0gdGhpcy5nZXROZXh0Q2hhcigpOyB3aGlsZSAoY2ggPT0gXCJcXG5cIiB8fCBjaCA9PSBcIiBcIiB8fCBjaCA9PSBcIlxcclwiIHx8IGNoID09IFwiXFx0XCIpO1xuXG5cdFx0dGhpcy5wdXRCYWNrKCk7XG5cdH1cblxuXHQvKipcblx0ICogU2tpcHMgdG8gdGhlIG5leHQgbGluZS5cblx0ICovXG5cdHByaXZhdGUgaWdub3JlTGluZSgpOnZvaWRcblx0e1xuXHRcdHZhciBjaDpzdHJpbmc7XG5cdFx0d2hpbGUgKCF0aGlzLl9yZWFjaGVkRU9GICYmIGNoICE9IFwiXFxuXCIpXG5cdFx0XHRjaCA9IHRoaXMuZ2V0TmV4dENoYXIoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIG5leHQgc2luZ2xlIGNoYXJhY3RlciBpbiB0aGUgZGF0YSBzdHJlYW0uXG5cdCAqL1xuXHRwcml2YXRlIGdldE5leHRDaGFyKCk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY2g6c3RyaW5nID0gdGhpcy5fdGV4dERhdGEuY2hhckF0KHRoaXMuX3BhcnNlSW5kZXgrKyk7XG5cblx0XHRpZiAoY2ggPT0gXCJcXG5cIikge1xuXHRcdFx0Kyt0aGlzLl9saW5lO1xuXHRcdFx0dGhpcy5fY2hhckxpbmVJbmRleCA9IDA7XG5cdFx0fSBlbHNlIGlmIChjaCAhPSBcIlxcclwiKVxuXHRcdFx0Kyt0aGlzLl9jaGFyTGluZUluZGV4O1xuXG5cdFx0aWYgKHRoaXMuX3BhcnNlSW5kZXggPT0gdGhpcy5fdGV4dERhdGEubGVuZ3RoKVxuXHRcdFx0dGhpcy5fcmVhY2hlZEVPRiA9IHRydWU7XG5cblx0XHRyZXR1cm4gY2g7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBuZXh0IGludGVnZXIgaW4gdGhlIGRhdGEgc3RyZWFtLlxuXHQgKi9cblx0cHJpdmF0ZSBnZXROZXh0SW50KCk6bnVtYmVyIC8qaW50Ki9cblx0e1xuXHRcdHZhciBpOm51bWJlciA9IHBhcnNlSW50KHRoaXMuZ2V0TmV4dFRva2VuKCkpO1xuXHRcdGlmIChpc05hTihpKSlcblx0XHRcdHRoaXMuc2VuZFBhcnNlRXJyb3IoXCJpbnQgdHlwZVwiKTtcblx0XHRyZXR1cm4gaTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIG5leHQgZmxvYXRpbmcgcG9pbnQgbnVtYmVyIGluIHRoZSBkYXRhIHN0cmVhbS5cblx0ICovXG5cdHByaXZhdGUgZ2V0TmV4dE51bWJlcigpOm51bWJlclxuXHR7XG5cdFx0dmFyIGY6bnVtYmVyID0gcGFyc2VGbG9hdCh0aGlzLmdldE5leHRUb2tlbigpKTtcblx0XHRpZiAoaXNOYU4oZikpXG5cdFx0XHR0aGlzLnNlbmRQYXJzZUVycm9yKFwiZmxvYXQgdHlwZVwiKTtcblx0XHRyZXR1cm4gZjtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIG5leHQgM2QgdmVjdG9yIGluIHRoZSBkYXRhIHN0cmVhbS5cblx0ICovXG5cdHByaXZhdGUgcGFyc2VWZWN0b3IzRCgpOlZlY3RvcjNEXG5cdHtcblx0XHR2YXIgdmVjOlZlY3RvcjNEID0gbmV3IFZlY3RvcjNEKCk7XG5cdFx0dmFyIGNoOnN0cmluZyA9IHRoaXMuZ2V0TmV4dFRva2VuKCk7XG5cblx0XHRpZiAoY2ggIT0gXCIoXCIpXG5cdFx0XHR0aGlzLnNlbmRQYXJzZUVycm9yKFwiKFwiKTtcblx0XHR2ZWMueCA9IHRoaXMuZ2V0TmV4dE51bWJlcigpO1xuXHRcdHZlYy55ID0gdGhpcy5nZXROZXh0TnVtYmVyKCk7XG5cdFx0dmVjLnogPSB0aGlzLmdldE5leHROdW1iZXIoKTtcblxuXHRcdGlmICh0aGlzLmdldE5leHRUb2tlbigpICE9IFwiKVwiKVxuXHRcdFx0dGhpcy5zZW5kUGFyc2VFcnJvcihcIilcIik7XG5cblx0XHRyZXR1cm4gdmVjO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgbmV4dCBxdWF0ZXJuaW9uIGluIHRoZSBkYXRhIHN0cmVhbS5cblx0ICovXG5cdHByaXZhdGUgcGFyc2VRdWF0ZXJuaW9uKCk6UXVhdGVybmlvblxuXHR7XG5cdFx0dmFyIHF1YXQ6UXVhdGVybmlvbiA9IG5ldyBRdWF0ZXJuaW9uKCk7XG5cdFx0dmFyIGNoOnN0cmluZyA9IHRoaXMuZ2V0TmV4dFRva2VuKCk7XG5cblx0XHRpZiAoY2ggIT0gXCIoXCIpXG5cdFx0XHR0aGlzLnNlbmRQYXJzZUVycm9yKFwiKFwiKTtcblx0XHRxdWF0LnggPSB0aGlzLmdldE5leHROdW1iZXIoKTtcblx0XHRxdWF0LnkgPSB0aGlzLmdldE5leHROdW1iZXIoKTtcblx0XHRxdWF0LnogPSB0aGlzLmdldE5leHROdW1iZXIoKTtcblxuXHRcdC8vIHF1YXQgc3VwcG9zZWQgdG8gYmUgdW5pdCBsZW5ndGhcblx0XHR2YXIgdDpudW1iZXIgPSAxIC0gKHF1YXQueCpxdWF0LngpIC0gKHF1YXQueSpxdWF0LnkpIC0gKHF1YXQueipxdWF0LnopO1xuXHRcdHF1YXQudyA9IHQgPCAwPyAwIDogLU1hdGguc3FydCh0KTtcblxuXHRcdGlmICh0aGlzLmdldE5leHRUb2tlbigpICE9IFwiKVwiKVxuXHRcdFx0dGhpcy5zZW5kUGFyc2VFcnJvcihcIilcIik7XG5cblx0XHRyZXR1cm4gcXVhdDtcblx0fVxuXG5cdC8qKlxuXHQgKiBQYXJzZXMgdGhlIGNvbW1hbmQgbGluZSBkYXRhLlxuXHQgKi9cblx0cHJpdmF0ZSBwYXJzZUNNRCgpOnZvaWRcblx0e1xuXHRcdC8vIGp1c3QgaWdub3JlIHRoZSBjb21tYW5kIGxpbmUgcHJvcGVydHlcblx0XHR0aGlzLnBhcnNlTGl0ZXJhbHN0cmluZygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgbmV4dCBsaXRlcmFsIHN0cmluZyBpbiB0aGUgZGF0YSBzdHJlYW0uIEEgbGl0ZXJhbCBzdHJpbmcgaXMgYSBzZXF1ZW5jZSBvZiBjaGFyYWN0ZXJzIGJvdW5kZWRcblx0ICogYnkgZG91YmxlIHF1b3Rlcy5cblx0ICovXG5cdHByaXZhdGUgcGFyc2VMaXRlcmFsc3RyaW5nKCk6c3RyaW5nXG5cdHtcblx0XHR0aGlzLnNraXBXaGl0ZVNwYWNlKCk7XG5cblx0XHR2YXIgY2g6c3RyaW5nID0gdGhpcy5nZXROZXh0Q2hhcigpO1xuXHRcdHZhciBzdHI6c3RyaW5nID0gXCJcIjtcblxuXHRcdGlmIChjaCAhPSBcIlxcXCJcIilcblx0XHRcdHRoaXMuc2VuZFBhcnNlRXJyb3IoXCJcXFwiXCIpO1xuXG5cdFx0ZG8ge1xuXHRcdFx0aWYgKHRoaXMuX3JlYWNoZWRFT0YpXG5cdFx0XHRcdHRoaXMuc2VuZEVPRkVycm9yKCk7XG5cdFx0XHRjaCA9IHRoaXMuZ2V0TmV4dENoYXIoKTtcblx0XHRcdGlmIChjaCAhPSBcIlxcXCJcIilcblx0XHRcdFx0c3RyICs9IGNoO1xuXHRcdH0gd2hpbGUgKGNoICE9IFwiXFxcIlwiKTtcblxuXHRcdHJldHVybiBzdHI7XG5cdH1cblxuXHQvKipcblx0ICogVGhyb3dzIGFuIGVuZC1vZi1maWxlIGVycm9yIHdoZW4gYSBwcmVtYXR1cmUgZW5kIG9mIGZpbGUgd2FzIGVuY291bnRlcmVkLlxuXHQgKi9cblx0cHJpdmF0ZSBzZW5kRU9GRXJyb3IoKTp2b2lkXG5cdHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmV4cGVjdGVkIGVuZCBvZiBmaWxlXCIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRocm93cyBhbiBlcnJvciB3aGVuIGFuIHVuZXhwZWN0ZWQgdG9rZW4gd2FzIGVuY291bnRlcmVkLlxuXHQgKiBAcGFyYW0gZXhwZWN0ZWQgVGhlIHRva2VuIHR5cGUgdGhhdCB3YXMgYWN0dWFsbHkgZXhwZWN0ZWQuXG5cdCAqL1xuXHRwcml2YXRlIHNlbmRQYXJzZUVycm9yKGV4cGVjdGVkOnN0cmluZyk6dm9pZFxuXHR7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCB0b2tlbiBhdCBsaW5lIFwiICsgKHRoaXMuX2xpbmUgKyAxKSArIFwiLCBjaGFyYWN0ZXIgXCIgKyB0aGlzLl9jaGFyTGluZUluZGV4ICsgXCIuIFwiICsgZXhwZWN0ZWQgKyBcIiBleHBlY3RlZCwgYnV0IFwiICsgdGhpcy5fdGV4dERhdGEuY2hhckF0KHRoaXMuX3BhcnNlSW5kZXggLSAxKSArIFwiIGVuY291bnRlcmVkXCIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRocm93cyBhbiBlcnJvciB3aGVuIGFuIHVua25vd24ga2V5d29yZCB3YXMgZW5jb3VudGVyZWQuXG5cdCAqL1xuXHRwcml2YXRlIHNlbmRVbmtub3duS2V5d29yZEVycm9yKCk6dm9pZFxuXHR7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBrZXl3b3JkIGF0IGxpbmUgXCIgKyAodGhpcy5fbGluZSArIDEpICsgXCIsIGNoYXJhY3RlciBcIiArIHRoaXMuX2NoYXJMaW5lSW5kZXggKyBcIi4gXCIpO1xuXHR9XG59XG5cbmV4cG9ydCA9IE1ENUFuaW1QYXJzZXI7Il19