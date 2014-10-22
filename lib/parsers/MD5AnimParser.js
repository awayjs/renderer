var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Quaternion = require("awayjs-core/lib/core/geom/Quaternion");
var Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
var URLLoaderDataFormat = require("awayjs-core/lib/core/net/URLLoaderDataFormat");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNlcnMvbWQ1YW5pbXBhcnNlci50cyJdLCJuYW1lcyI6WyJNRDVBbmltUGFyc2VyIiwiTUQ1QW5pbVBhcnNlci5jb25zdHJ1Y3RvciIsIk1ENUFuaW1QYXJzZXIuc3VwcG9ydHNUeXBlIiwiTUQ1QW5pbVBhcnNlci5zdXBwb3J0c0RhdGEiLCJNRDVBbmltUGFyc2VyLl9wUHJvY2VlZFBhcnNpbmciLCJNRDVBbmltUGFyc2VyLnRyYW5zbGF0ZUNsaXAiLCJNRDVBbmltUGFyc2VyLnRyYW5zbGF0ZVBvc2UiLCJNRDVBbmltUGFyc2VyLnBhcnNlSGllcmFyY2h5IiwiTUQ1QW5pbVBhcnNlci5wYXJzZUJvdW5kcyIsIk1ENUFuaW1QYXJzZXIucGFyc2VCYXNlRnJhbWUiLCJNRDVBbmltUGFyc2VyLnBhcnNlRnJhbWUiLCJNRDVBbmltUGFyc2VyLnB1dEJhY2siLCJNRDVBbmltUGFyc2VyLmdldE5leHRUb2tlbiIsIk1ENUFuaW1QYXJzZXIuc2tpcFdoaXRlU3BhY2UiLCJNRDVBbmltUGFyc2VyLmlnbm9yZUxpbmUiLCJNRDVBbmltUGFyc2VyLmdldE5leHRDaGFyIiwiTUQ1QW5pbVBhcnNlci5nZXROZXh0SW50IiwiTUQ1QW5pbVBhcnNlci5nZXROZXh0TnVtYmVyIiwiTUQ1QW5pbVBhcnNlci5wYXJzZVZlY3RvcjNEIiwiTUQ1QW5pbVBhcnNlci5wYXJzZVF1YXRlcm5pb24iLCJNRDVBbmltUGFyc2VyLnBhcnNlQ01EIiwiTUQ1QW5pbVBhcnNlci5wYXJzZUxpdGVyYWxzdHJpbmciLCJNRDVBbmltUGFyc2VyLnNlbmRFT0ZFcnJvciIsIk1ENUFuaW1QYXJzZXIuc2VuZFBhcnNlRXJyb3IiLCJNRDVBbmltUGFyc2VyLnNlbmRVbmtub3duS2V5d29yZEVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFPLFVBQVUsV0FBZ0Isc0NBQXNDLENBQUMsQ0FBQztBQUN6RSxJQUFPLFFBQVEsV0FBaUIsb0NBQW9DLENBQUMsQ0FBQztBQUN0RSxJQUFPLG1C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QUFDQSxDQUFDQSxDQUFDQTtZQUMxREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBQ2RBLFdBQVdBLENBQUNBLENBQUNBLEdBQUdBLFVBQVVBLENBQUNBLFNBQVNBLENBQUNBLFVBQVVBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1lBRTFEQSxJQUFJQSxDQUFDQSxHQUFVQSxDQUFDQSxHQUFHQSxXQUFXQSxDQUFDQSxDQUFDQSxHQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxHQUFHQSxXQUFXQSxDQUFDQSxDQUFDQSxHQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxHQUFHQSxXQUFXQSxDQUFDQSxDQUFDQSxHQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMzR0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFekNBLEVBQUVBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLFdBQVdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUMvQkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsV0FBV0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzNEQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxXQUFXQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtZQUM5REEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ1BBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLFFBQVFBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBO2dCQUN2Q0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pDQSxJQUFJQSxDQUFDQSxXQUFX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QUFDQTtJQXlqQjNDQSxvQkFBQ0E7QUFBREEsQ0F6a0JBLEFBeWtCQ0EsRUF6a0IyQixVQUFVLEVBeWtCckM7QUFFRCxBQUF1QixpQkFBZCxhQUFhLENBQUMiLCJmaWxlIjoicGFyc2Vycy9NRDVBbmltUGFyc2VyLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFF1YXRlcm5pb25cdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9nZW9tL1F1YXRlcm5pb25cIik7XG5pbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2dlb20vVmVjdG9yM0RcIik7XG5pbXBvcnQgVVJMTG9hZGVyRGF0YUZvcm1hdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvbmV0L1VSTExvYWRlckRhdGFGb3JtYXRcIik7XG5pbXBvcnQgUGFyc2VyQmFzZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wYXJzZXJzL1BhcnNlckJhc2VcIik7XG5cbmltcG9ydCBKb2ludFBvc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvSm9pbnRQb3NlXCIpO1xuaW1wb3J0IFNrZWxldG9uUG9zZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Ta2VsZXRvblBvc2VcIik7XG5pbXBvcnQgU2tlbGV0b25DbGlwTm9kZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL25vZGVzL1NrZWxldG9uQ2xpcE5vZGVcIik7XG5pbXBvcnQgQmFzZUZyYW1lRGF0YVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcGFyc2Vycy9kYXRhL0Jhc2VGcmFtZURhdGFcIik7XG5pbXBvcnQgQm91bmRzRGF0YVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXJzZXJzL2RhdGEvQm91bmRzRGF0YVwiKTtcbmltcG9ydCBGcmFtZURhdGFcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcGFyc2Vycy9kYXRhL0ZyYW1lRGF0YVwiKTtcbmltcG9ydCBIaWVyYXJjaHlEYXRhXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXJzZXJzL2RhdGEvSGllcmFyY2h5RGF0YVwiKTtcblxuLyoqXG4gKiBNRDVBbmltUGFyc2VyIHByb3ZpZGVzIGEgcGFyc2VyIGZvciB0aGUgbWQ1YW5pbSBkYXRhIHR5cGUsIHByb3ZpZGluZyBhbiBhbmltYXRpb24gc2VxdWVuY2UgZm9yIHRoZSBtZDUgZm9ybWF0LlxuICpcbiAqIHRvZG86IG9wdGltaXplXG4gKi9cbmNsYXNzIE1ENUFuaW1QYXJzZXIgZXh0ZW5kcyBQYXJzZXJCYXNlXG57XG5cdHByaXZhdGUgX3RleHREYXRhOnN0cmluZztcblx0cHJpdmF0ZSBfc3RhcnRlZFBhcnNpbmc6Ym9vbGVhbjtcblx0cHVibGljIHN0YXRpYyBWRVJTSU9OX1RPS0VOOnN0cmluZyA9IFwiTUQ1VmVyc2lvblwiO1xuXHRwdWJsaWMgc3RhdGljIENPTU1BTkRfTElORV9UT0tFTjpzdHJpbmcgPSBcImNvbW1hbmRsaW5lXCI7XG5cdHB1YmxpYyBzdGF0aWMgTlVNX0ZSQU1FU19UT0tFTjpzdHJpbmcgPSBcIm51bUZyYW1lc1wiO1xuXHRwdWJsaWMgc3RhdGljIE5VTV9KT0lOVFNfVE9LRU46c3RyaW5nID0gXCJudW1Kb2ludHNcIjtcblx0cHVibGljIHN0YXRpYyBGUkFNRV9SQVRFX1RPS0VOOnN0cmluZyA9IFwiZnJhbWVSYXRlXCI7XG5cdHB1YmxpYyBzdGF0aWMgTlVNX0FOSU1BVEVEX0NPTVBPTkVOVFNfVE9LRU46c3RyaW5nID0gXCJudW1BbmltYXRlZENvbXBvbmVudHNcIjtcblxuXHRwdWJsaWMgc3RhdGljIEhJRVJBUkNIWV9UT0tFTjpzdHJpbmcgPSBcImhpZXJhcmNoeVwiO1xuXHRwdWJsaWMgc3RhdGljIEJPVU5EU19UT0tFTjpzdHJpbmcgPSBcImJvdW5kc1wiO1xuXHRwdWJsaWMgc3RhdGljIEJBU0VfRlJBTUVfVE9LRU46c3RyaW5nID0gXCJiYXNlZnJhbWVcIjtcblx0cHVibGljIHN0YXRpYyBGUkFNRV9UT0tFTjpzdHJpbmcgPSBcImZyYW1lXCI7XG5cblx0cHVibGljIHN0YXRpYyBDT01NRU5UX1RPS0VOOnN0cmluZyA9IFwiLy9cIjtcblxuXHRwcml2YXRlIF9wYXJzZUluZGV4Om51bWJlciAvKmludCovID0gMDtcblx0cHJpdmF0ZSBfcmVhY2hlZEVPRjpib29sZWFuO1xuXHRwcml2YXRlIF9saW5lOm51bWJlciAvKmludCovID0gMDtcblx0cHJpdmF0ZSBfY2hhckxpbmVJbmRleDpudW1iZXIgLyppbnQqLyA9IDA7XG5cdHByaXZhdGUgX3ZlcnNpb246bnVtYmVyIC8qaW50Ki87XG5cdHByaXZhdGUgX2ZyYW1lUmF0ZTpudW1iZXIgLyppbnQqLztcblx0cHJpdmF0ZSBfbnVtRnJhbWVzOm51bWJlciAvKmludCovO1xuXHRwcml2YXRlIF9udW1Kb2ludHM6bnVtYmVyIC8qaW50Ki87XG5cdHByaXZhdGUgX251bUFuaW1hdGVkQ29tcG9uZW50czpudW1iZXIgLyppbnQqLztcblxuXHRwcml2YXRlIF9oaWVyYXJjaHk6QXJyYXk8SGllcmFyY2h5RGF0YT47XG5cdHByaXZhdGUgX2JvdW5kczpBcnJheTxCb3VuZHNEYXRhPjtcblx0cHJpdmF0ZSBfZnJhbWVEYXRhOkFycmF5PEZyYW1lRGF0YT47XG5cdHByaXZhdGUgX2Jhc2VGcmFtZURhdGE6QXJyYXk8QmFzZUZyYW1lRGF0YT47XG5cblx0cHJpdmF0ZSBfcm90YXRpb25RdWF0OlF1YXRlcm5pb247XG5cdHByaXZhdGUgX2NsaXA6U2tlbGV0b25DbGlwTm9kZTtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBNRDVBbmltUGFyc2VyIG9iamVjdC5cblx0ICogQHBhcmFtIHVyaSBUaGUgdXJsIG9yIGlkIG9mIHRoZSBkYXRhIG9yIGZpbGUgdG8gYmUgcGFyc2VkLlxuXHQgKiBAcGFyYW0gZXh0cmEgVGhlIGhvbGRlciBmb3IgZXh0cmEgY29udGV4dHVhbCBkYXRhIHRoYXQgdGhlIHBhcnNlciBtaWdodCBuZWVkLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoYWRkaXRpb25hbFJvdGF0aW9uQXhpczpWZWN0b3IzRCA9IG51bGwsIGFkZGl0aW9uYWxSb3RhdGlvblJhZGlhbnM6bnVtYmVyID0gMClcblx0e1xuXHRcdHN1cGVyKFVSTExvYWRlckRhdGFGb3JtYXQuVEVYVCk7XG5cdFx0dGhpcy5fcm90YXRpb25RdWF0ID0gbmV3IFF1YXRlcm5pb24oKTtcblx0XHR2YXIgdDE6UXVhdGVybmlvbiA9IG5ldyBRdWF0ZXJuaW9uKCk7XG5cdFx0dmFyIHQyOlF1YXRlcm5pb24gPSBuZXcgUXVhdGVybmlvbigpO1xuXG5cdFx0dDEuZnJvbUF4aXNBbmdsZShWZWN0b3IzRC5YX0FYSVMsIC1NYXRoLlBJKi41KTtcblx0XHR0Mi5mcm9tQXhpc0FuZ2xlKFZlY3RvcjNELllfQVhJUywgLU1hdGguUEkqLjUpO1xuXG5cdFx0dGhpcy5fcm90YXRpb25RdWF0Lm11bHRpcGx5KHQyLCB0MSk7XG5cblx0XHRpZiAoYWRkaXRpb25hbFJvdGF0aW9uQXhpcykge1xuXHRcdFx0dGhpcy5fcm90YXRpb25RdWF0Lm11bHRpcGx5KHQyLCB0MSk7XG5cdFx0XHR0MS5mcm9tQXhpc0FuZ2xlKGFkZGl0aW9uYWxSb3RhdGlvbkF4aXMsIGFkZGl0aW9uYWxSb3RhdGlvblJhZGlhbnMpO1xuXHRcdFx0dGhpcy5fcm90YXRpb25RdWF0Lm11bHRpcGx5KHQxLCB0aGlzLl9yb3RhdGlvblF1YXQpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgYSBnaXZlbiBmaWxlIGV4dGVuc2lvbiBpcyBzdXBwb3J0ZWQgYnkgdGhlIHBhcnNlci5cblx0ICogQHBhcmFtIGV4dGVuc2lvbiBUaGUgZmlsZSBleHRlbnNpb24gb2YgYSBwb3RlbnRpYWwgZmlsZSB0byBiZSBwYXJzZWQuXG5cdCAqIEByZXR1cm4gV2hldGhlciBvciBub3QgdGhlIGdpdmVuIGZpbGUgdHlwZSBpcyBzdXBwb3J0ZWQuXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIHN1cHBvcnRzVHlwZShleHRlbnNpb246c3RyaW5nKTpib29sZWFuXG5cdHtcblx0XHRleHRlbnNpb24gPSBleHRlbnNpb24udG9Mb3dlckNhc2UoKTtcblx0XHRyZXR1cm4gZXh0ZW5zaW9uID09IFwibWQ1YW5pbVwiO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRlc3RzIHdoZXRoZXIgYSBkYXRhIGJsb2NrIGNhbiBiZSBwYXJzZWQgYnkgdGhlIHBhcnNlci5cblx0ICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgYmxvY2sgdG8gcG90ZW50aWFsbHkgYmUgcGFyc2VkLlxuXHQgKiBAcmV0dXJuIFdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBkYXRhIGlzIHN1cHBvcnRlZC5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgc3VwcG9ydHNEYXRhKGRhdGE6YW55KTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfcFByb2NlZWRQYXJzaW5nKCk6Ym9vbGVhblxuXHR7XG5cdFx0dmFyIHRva2VuOnN0cmluZztcblxuXHRcdGlmICghdGhpcy5fc3RhcnRlZFBhcnNpbmcpIHtcblx0XHRcdHRoaXMuX3RleHREYXRhID0gdGhpcy5fcEdldFRleHREYXRhKCk7XG5cdFx0XHR0aGlzLl9zdGFydGVkUGFyc2luZyA9IHRydWU7XG5cdFx0fVxuXG5cdFx0d2hpbGUgKHRoaXMuX3BIYXNUaW1lKCkpIHtcblx0XHRcdHRva2VuID0gdGhpcy5nZXROZXh0VG9rZW4oKTtcblx0XHRcdHN3aXRjaCAodG9rZW4pIHtcblx0XHRcdFx0Y2FzZSBNRDVBbmltUGFyc2VyLkNPTU1FTlRfVE9LRU46XG5cdFx0XHRcdFx0dGhpcy5pZ25vcmVMaW5lKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJcIjpcblx0XHRcdFx0XHQvLyBjYW4gb2NjdXIgYXQgdGhlIGVuZCBvZiBhIGZpbGVcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBNRDVBbmltUGFyc2VyLlZFUlNJT05fVE9LRU46XG5cdFx0XHRcdFx0dGhpcy5fdmVyc2lvbiA9IHRoaXMuZ2V0TmV4dEludCgpO1xuXHRcdFx0XHRcdGlmICh0aGlzLl92ZXJzaW9uICE9IDEwKVxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biB2ZXJzaW9uIG51bWJlciBlbmNvdW50ZXJlZCFcIik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgTUQ1QW5pbVBhcnNlci5DT01NQU5EX0xJTkVfVE9LRU46XG5cdFx0XHRcdFx0dGhpcy5wYXJzZUNNRCgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIE1ENUFuaW1QYXJzZXIuTlVNX0ZSQU1FU19UT0tFTjpcblx0XHRcdFx0XHR0aGlzLl9udW1GcmFtZXMgPSB0aGlzLmdldE5leHRJbnQoKTtcblx0XHRcdFx0XHR0aGlzLl9ib3VuZHMgPSBuZXcgQXJyYXk8Qm91bmRzRGF0YT4oKTtcblx0XHRcdFx0XHR0aGlzLl9mcmFtZURhdGEgPSBuZXcgQXJyYXk8RnJhbWVEYXRhPigpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIE1ENUFuaW1QYXJzZXIuTlVNX0pPSU5UU19UT0tFTjpcblx0XHRcdFx0XHR0aGlzLl9udW1Kb2ludHMgPSB0aGlzLmdldE5leHRJbnQoKTtcblx0XHRcdFx0XHR0aGlzLl9oaWVyYXJjaHkgPSBuZXcgQXJyYXk8SGllcmFyY2h5RGF0YT4odGhpcy5fbnVtSm9pbnRzKTtcblx0XHRcdFx0XHR0aGlzLl9iYXNlRnJhbWVEYXRhID0gbmV3IEFycmF5PEJhc2VGcmFtZURhdGE+KHRoaXMuX251bUpvaW50cyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgTUQ1QW5pbVBhcnNlci5GUkFNRV9SQVRFX1RPS0VOOlxuXHRcdFx0XHRcdHRoaXMuX2ZyYW1lUmF0ZSA9IHRoaXMuZ2V0TmV4dEludCgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIE1ENUFuaW1QYXJzZXIuTlVNX0FOSU1BVEVEX0NPTVBPTkVOVFNfVE9LRU46XG5cdFx0XHRcdFx0dGhpcy5fbnVtQW5pbWF0ZWRDb21wb25lbnRzID0gdGhpcy5nZXROZXh0SW50KCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgTUQ1QW5pbVBhcnNlci5ISUVSQVJDSFlfVE9LRU46XG5cdFx0XHRcdFx0dGhpcy5wYXJzZUhpZXJhcmNoeSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIE1ENUFuaW1QYXJzZXIuQk9VTkRTX1RPS0VOOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VCb3VuZHMoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBNRDVBbmltUGFyc2VyLkJBU0VfRlJBTUVfVE9LRU46XG5cdFx0XHRcdFx0dGhpcy5wYXJzZUJhc2VGcmFtZSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIE1ENUFuaW1QYXJzZXIuRlJBTUVfVE9LRU46XG5cdFx0XHRcdFx0dGhpcy5wYXJzZUZyYW1lKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0aWYgKCF0aGlzLl9yZWFjaGVkRU9GKVxuXHRcdFx0XHRcdFx0dGhpcy5zZW5kVW5rbm93bktleXdvcmRFcnJvcigpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5fcmVhY2hlZEVPRikge1xuXHRcdFx0XHR0aGlzLl9jbGlwID0gbmV3IFNrZWxldG9uQ2xpcE5vZGUoKTtcblx0XHRcdFx0dGhpcy50cmFuc2xhdGVDbGlwKCk7XG5cdFx0XHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KHRoaXMuX2NsaXApO1xuXHRcdFx0XHRyZXR1cm4gUGFyc2VyQmFzZS5QQVJTSU5HX0RPTkU7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBQYXJzZXJCYXNlLk1PUkVfVE9fUEFSU0U7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYWxsIGtleSBmcmFtZSBkYXRhIHRvIGFuIFNraW5uZWRBbmltYXRpb25TZXF1ZW5jZS5cblx0ICovXG5cdHByaXZhdGUgdHJhbnNsYXRlQ2xpcCgpOnZvaWRcblx0e1xuXHRcdGZvciAodmFyIGk6bnVtYmVyIC8qaW50Ki8gPSAwOyBpIDwgdGhpcy5fbnVtRnJhbWVzOyArK2kpXG5cdFx0XHR0aGlzLl9jbGlwLmFkZEZyYW1lKHRoaXMudHJhbnNsYXRlUG9zZSh0aGlzLl9mcmFtZURhdGFbaV0pLCAxMDAwL3RoaXMuX2ZyYW1lUmF0ZSk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBzaW5nbGUga2V5IGZyYW1lIGRhdGEgdG8gYSBTa2VsZXRvblBvc2UuXG5cdCAqIEBwYXJhbSBmcmFtZURhdGEgVGhlIGFjdHVhbCBmcmFtZSBkYXRhLlxuXHQgKiBAcmV0dXJuIEEgU2tlbGV0b25Qb3NlIGNvbnRhaW5pbmcgdGhlIGZyYW1lIGRhdGEncyBwb3NlLlxuXHQgKi9cblx0cHJpdmF0ZSB0cmFuc2xhdGVQb3NlKGZyYW1lRGF0YTpGcmFtZURhdGEpOlNrZWxldG9uUG9zZVxuXHR7XG5cdFx0dmFyIGhpZXJhcmNoeTpIaWVyYXJjaHlEYXRhO1xuXHRcdHZhciBwb3NlOkpvaW50UG9zZTtcblx0XHR2YXIgYmFzZTpCYXNlRnJhbWVEYXRhO1xuXHRcdHZhciBmbGFnczpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgajpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgdHJhbnNsYXRlOlZlY3RvcjNEID0gbmV3IFZlY3RvcjNEKCk7XG5cdFx0dmFyIG9yaWVudGF0aW9uOlF1YXRlcm5pb24gPSBuZXcgUXVhdGVybmlvbigpO1xuXHRcdHZhciBjb21wb25lbnRzOkFycmF5PG51bWJlcj4gPSBmcmFtZURhdGEuY29tcG9uZW50cztcblx0XHR2YXIgc2tlbFBvc2U6U2tlbGV0b25Qb3NlID0gbmV3IFNrZWxldG9uUG9zZSgpO1xuXHRcdHZhciBqb2ludFBvc2VzOkFycmF5PEpvaW50UG9zZT4gPSBza2VsUG9zZS5qb2ludFBvc2VzO1xuXG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgLyppbnQqLyA9IDA7IGkgPCB0aGlzLl9udW1Kb2ludHM7ICsraSkge1xuXHRcdFx0aiA9IDA7XG5cdFx0XHRwb3NlID0gbmV3IEpvaW50UG9zZSgpO1xuXHRcdFx0aGllcmFyY2h5ID0gdGhpcy5faGllcmFyY2h5W2ldO1xuXHRcdFx0YmFzZSA9IHRoaXMuX2Jhc2VGcmFtZURhdGFbaV07XG5cdFx0XHRmbGFncyA9IGhpZXJhcmNoeS5mbGFncztcblx0XHRcdHRyYW5zbGF0ZS54ID0gYmFzZS5wb3NpdGlvbi54O1xuXHRcdFx0dHJhbnNsYXRlLnkgPSBiYXNlLnBvc2l0aW9uLnk7XG5cdFx0XHR0cmFuc2xhdGUueiA9IGJhc2UucG9zaXRpb24uejtcblx0XHRcdG9yaWVudGF0aW9uLnggPSBiYXNlLm9yaWVudGF0aW9uLng7XG5cdFx0XHRvcmllbnRhdGlvbi55ID0gYmFzZS5vcmllbnRhdGlvbi55O1xuXHRcdFx0b3JpZW50YXRpb24ueiA9IGJhc2Uub3JpZW50YXRpb24uejtcblxuXHRcdFx0aWYgKGZsYWdzICYgMSlcblx0XHRcdFx0dHJhbnNsYXRlLnggPSBjb21wb25lbnRzW2hpZXJhcmNoeS5zdGFydEluZGV4ICsgKGorKyldO1xuXHRcdFx0aWYgKGZsYWdzICYgMilcblx0XHRcdFx0dHJhbnNsYXRlLnkgPSBjb21wb25lbnRzW2hpZXJhcmNoeS5zdGFydEluZGV4ICsgKGorKyldO1xuXHRcdFx0aWYgKGZsYWdzICYgNClcblx0XHRcdFx0dHJhbnNsYXRlLnogPSBjb21wb25lbnRzW2hpZXJhcmNoeS5zdGFydEluZGV4ICsgKGorKyldO1xuXHRcdFx0aWYgKGZsYWdzICYgOClcblx0XHRcdFx0b3JpZW50YXRpb24ueCA9IGNvbXBvbmVudHNbaGllcmFyY2h5LnN0YXJ0SW5kZXggKyAoaisrKV07XG5cdFx0XHRpZiAoZmxhZ3MgJiAxNilcblx0XHRcdFx0b3JpZW50YXRpb24ueSA9IGNvbXBvbmVudHNbaGllcmFyY2h5LnN0YXJ0SW5kZXggKyAoaisrKV07XG5cdFx0XHRpZiAoZmxhZ3MgJiAzMilcblx0XHRcdFx0b3JpZW50YXRpb24ueiA9IGNvbXBvbmVudHNbaGllcmFyY2h5LnN0YXJ0SW5kZXggKyAoaisrKV07XG5cblx0XHRcdHZhciB3Om51bWJlciA9IDEgLSBvcmllbnRhdGlvbi54Km9yaWVudGF0aW9uLnggLSBvcmllbnRhdGlvbi55Km9yaWVudGF0aW9uLnkgLSBvcmllbnRhdGlvbi56Km9yaWVudGF0aW9uLno7XG5cdFx0XHRvcmllbnRhdGlvbi53ID0gdyA8IDA/IDAgOiAtTWF0aC5zcXJ0KHcpO1xuXG5cdFx0XHRpZiAoaGllcmFyY2h5LnBhcmVudEluZGV4IDwgMCkge1xuXHRcdFx0XHRwb3NlLm9yaWVudGF0aW9uLm11bHRpcGx5KHRoaXMuX3JvdGF0aW9uUXVhdCwgb3JpZW50YXRpb24pO1xuXHRcdFx0XHRwb3NlLnRyYW5zbGF0aW9uID0gdGhpcy5fcm90YXRpb25RdWF0LnJvdGF0ZVBvaW50KHRyYW5zbGF0ZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwb3NlLm9yaWVudGF0aW9uLmNvcHlGcm9tKG9yaWVudGF0aW9uKTtcblx0XHRcdFx0cG9zZS50cmFuc2xhdGlvbi54ID0gdHJhbnNsYXRlLng7XG5cdFx0XHRcdHBvc2UudHJhbnNsYXRpb24ueSA9IHRyYW5zbGF0ZS55O1xuXHRcdFx0XHRwb3NlLnRyYW5zbGF0aW9uLnogPSB0cmFuc2xhdGUuejtcblx0XHRcdH1cblx0XHRcdHBvc2Uub3JpZW50YXRpb24ueSA9IC1wb3NlLm9yaWVudGF0aW9uLnk7XG5cdFx0XHRwb3NlLm9yaWVudGF0aW9uLnogPSAtcG9zZS5vcmllbnRhdGlvbi56O1xuXHRcdFx0cG9zZS50cmFuc2xhdGlvbi54ID0gLXBvc2UudHJhbnNsYXRpb24ueDtcblxuXHRcdFx0am9pbnRQb3Nlc1tpXSA9IHBvc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHNrZWxQb3NlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBhcnNlcyB0aGUgc2tlbGV0b24ncyBoaWVyYXJjaHkgZGF0YS5cblx0ICovXG5cdHByaXZhdGUgcGFyc2VIaWVyYXJjaHkoKTp2b2lkXG5cdHtcblx0XHR2YXIgY2g6c3RyaW5nO1xuXHRcdHZhciBkYXRhOkhpZXJhcmNoeURhdGE7XG5cdFx0dmFyIHRva2VuOnN0cmluZyA9IHRoaXMuZ2V0TmV4dFRva2VuKCk7XG5cdFx0dmFyIGk6bnVtYmVyIC8qaW50Ki8gPSAwO1xuXG5cdFx0aWYgKHRva2VuICE9IFwie1wiKVxuXHRcdFx0dGhpcy5zZW5kVW5rbm93bktleXdvcmRFcnJvcigpO1xuXG5cdFx0ZG8ge1xuXHRcdFx0aWYgKHRoaXMuX3JlYWNoZWRFT0YpXG5cdFx0XHRcdHRoaXMuc2VuZEVPRkVycm9yKCk7XG5cdFx0XHRkYXRhID0gbmV3IEhpZXJhcmNoeURhdGEoKTtcblx0XHRcdGRhdGEubmFtZSA9IHRoaXMucGFyc2VMaXRlcmFsc3RyaW5nKCk7XG5cdFx0XHRkYXRhLnBhcmVudEluZGV4ID0gdGhpcy5nZXROZXh0SW50KCk7XG5cdFx0XHRkYXRhLmZsYWdzID0gdGhpcy5nZXROZXh0SW50KCk7XG5cdFx0XHRkYXRhLnN0YXJ0SW5kZXggPSB0aGlzLmdldE5leHRJbnQoKTtcblx0XHRcdHRoaXMuX2hpZXJhcmNoeVtpKytdID0gZGF0YTtcblxuXHRcdFx0Y2ggPSB0aGlzLmdldE5leHRDaGFyKCk7XG5cblx0XHRcdGlmIChjaCA9PSBcIi9cIikge1xuXHRcdFx0XHR0aGlzLnB1dEJhY2soKTtcblx0XHRcdFx0Y2ggPSB0aGlzLmdldE5leHRUb2tlbigpO1xuXHRcdFx0XHRpZiAoY2ggPT0gTUQ1QW5pbVBhcnNlci5DT01NRU5UX1RPS0VOKVxuXHRcdFx0XHRcdHRoaXMuaWdub3JlTGluZSgpO1xuXHRcdFx0XHRjaCA9IHRoaXMuZ2V0TmV4dENoYXIoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGNoICE9IFwifVwiKVxuXHRcdFx0XHR0aGlzLnB1dEJhY2soKTtcblxuXHRcdH0gd2hpbGUgKGNoICE9IFwifVwiKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQYXJzZXMgZnJhbWUgYm91bmRzLlxuXHQgKi9cblx0cHJpdmF0ZSBwYXJzZUJvdW5kcygpOnZvaWRcblx0e1xuXHRcdHZhciBjaDpzdHJpbmc7XG5cdFx0dmFyIGRhdGE6Qm91bmRzRGF0YTtcblx0XHR2YXIgdG9rZW46c3RyaW5nID0gdGhpcy5nZXROZXh0VG9rZW4oKTtcblx0XHR2YXIgaTpudW1iZXIgLyppbnQqLyA9IDA7XG5cblx0XHRpZiAodG9rZW4gIT0gXCJ7XCIpXG5cdFx0XHR0aGlzLnNlbmRVbmtub3duS2V5d29yZEVycm9yKCk7XG5cblx0XHRkbyB7XG5cdFx0XHRpZiAodGhpcy5fcmVhY2hlZEVPRilcblx0XHRcdFx0dGhpcy5zZW5kRU9GRXJyb3IoKTtcblx0XHRcdGRhdGEgPSBuZXcgQm91bmRzRGF0YSgpO1xuXHRcdFx0ZGF0YS5taW4gPSB0aGlzLnBhcnNlVmVjdG9yM0QoKTtcblx0XHRcdGRhdGEubWF4ID0gdGhpcy5wYXJzZVZlY3RvcjNEKCk7XG5cdFx0XHR0aGlzLl9ib3VuZHNbaSsrXSA9IGRhdGE7XG5cblx0XHRcdGNoID0gdGhpcy5nZXROZXh0Q2hhcigpO1xuXG5cdFx0XHRpZiAoY2ggPT0gXCIvXCIpIHtcblx0XHRcdFx0dGhpcy5wdXRCYWNrKCk7XG5cdFx0XHRcdGNoID0gdGhpcy5nZXROZXh0VG9rZW4oKTtcblx0XHRcdFx0aWYgKGNoID09IE1ENUFuaW1QYXJzZXIuQ09NTUVOVF9UT0tFTilcblx0XHRcdFx0XHR0aGlzLmlnbm9yZUxpbmUoKTtcblx0XHRcdFx0Y2ggPSB0aGlzLmdldE5leHRDaGFyKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjaCAhPSBcIn1cIilcblx0XHRcdFx0dGhpcy5wdXRCYWNrKCk7XG5cblx0XHR9IHdoaWxlIChjaCAhPSBcIn1cIik7XG5cdH1cblxuXHQvKipcblx0ICogUGFyc2VzIHRoZSBiYXNlIGZyYW1lLlxuXHQgKi9cblx0cHJpdmF0ZSBwYXJzZUJhc2VGcmFtZSgpOnZvaWRcblx0e1xuXHRcdHZhciBjaDpzdHJpbmc7XG5cdFx0dmFyIGRhdGE6QmFzZUZyYW1lRGF0YTtcblx0XHR2YXIgdG9rZW46c3RyaW5nID0gdGhpcy5nZXROZXh0VG9rZW4oKTtcblx0XHR2YXIgaTpudW1iZXIgLyppbnQqLyA9IDA7XG5cblx0XHRpZiAodG9rZW4gIT0gXCJ7XCIpXG5cdFx0XHR0aGlzLnNlbmRVbmtub3duS2V5d29yZEVycm9yKCk7XG5cblx0XHRkbyB7XG5cdFx0XHRpZiAodGhpcy5fcmVhY2hlZEVPRilcblx0XHRcdFx0dGhpcy5zZW5kRU9GRXJyb3IoKTtcblx0XHRcdGRhdGEgPSBuZXcgQmFzZUZyYW1lRGF0YSgpO1xuXHRcdFx0ZGF0YS5wb3NpdGlvbiA9IHRoaXMucGFyc2VWZWN0b3IzRCgpO1xuXHRcdFx0ZGF0YS5vcmllbnRhdGlvbiA9IHRoaXMucGFyc2VRdWF0ZXJuaW9uKCk7XG5cdFx0XHR0aGlzLl9iYXNlRnJhbWVEYXRhW2krK10gPSBkYXRhO1xuXG5cdFx0XHRjaCA9IHRoaXMuZ2V0TmV4dENoYXIoKTtcblxuXHRcdFx0aWYgKGNoID09IFwiL1wiKSB7XG5cdFx0XHRcdHRoaXMucHV0QmFjaygpO1xuXHRcdFx0XHRjaCA9IHRoaXMuZ2V0TmV4dFRva2VuKCk7XG5cdFx0XHRcdGlmIChjaCA9PSBNRDVBbmltUGFyc2VyLkNPTU1FTlRfVE9LRU4pXG5cdFx0XHRcdFx0dGhpcy5pZ25vcmVMaW5lKCk7XG5cdFx0XHRcdGNoID0gdGhpcy5nZXROZXh0Q2hhcigpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY2ggIT0gXCJ9XCIpXG5cdFx0XHRcdHRoaXMucHV0QmFjaygpO1xuXG5cdFx0fSB3aGlsZSAoY2ggIT0gXCJ9XCIpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBhcnNlcyBhIHNpbmdsZSBmcmFtZS5cblx0ICovXG5cdHByaXZhdGUgcGFyc2VGcmFtZSgpOnZvaWRcblx0e1xuXHRcdHZhciBjaDpzdHJpbmc7XG5cdFx0dmFyIGRhdGE6RnJhbWVEYXRhO1xuXHRcdHZhciB0b2tlbjpzdHJpbmc7XG5cdFx0dmFyIGZyYW1lSW5kZXg6bnVtYmVyIC8qaW50Ki87XG5cblx0XHRmcmFtZUluZGV4ID0gdGhpcy5nZXROZXh0SW50KCk7XG5cblx0XHR0b2tlbiA9IHRoaXMuZ2V0TmV4dFRva2VuKCk7XG5cdFx0aWYgKHRva2VuICE9IFwie1wiKVxuXHRcdFx0dGhpcy5zZW5kVW5rbm93bktleXdvcmRFcnJvcigpO1xuXG5cdFx0ZG8ge1xuXHRcdFx0aWYgKHRoaXMuX3JlYWNoZWRFT0YpXG5cdFx0XHRcdHRoaXMuc2VuZEVPRkVycm9yKCk7XG5cdFx0XHRkYXRhID0gbmV3IEZyYW1lRGF0YSgpO1xuXHRcdFx0ZGF0YS5jb21wb25lbnRzID0gbmV3IEFycmF5PG51bWJlcj4odGhpcy5fbnVtQW5pbWF0ZWRDb21wb25lbnRzKTtcblxuXHRcdFx0Zm9yICh2YXIgaTpudW1iZXIgLyppbnQqLyA9IDA7IGkgPCB0aGlzLl9udW1BbmltYXRlZENvbXBvbmVudHM7ICsraSlcblx0XHRcdFx0ZGF0YS5jb21wb25lbnRzW2ldID0gdGhpcy5nZXROZXh0TnVtYmVyKCk7XG5cblx0XHRcdHRoaXMuX2ZyYW1lRGF0YVtmcmFtZUluZGV4XSA9IGRhdGE7XG5cblx0XHRcdGNoID0gdGhpcy5nZXROZXh0Q2hhcigpO1xuXG5cdFx0XHRpZiAoY2ggPT0gXCIvXCIpIHtcblx0XHRcdFx0dGhpcy5wdXRCYWNrKCk7XG5cdFx0XHRcdGNoID0gdGhpcy5nZXROZXh0VG9rZW4oKTtcblx0XHRcdFx0aWYgKGNoID09IE1ENUFuaW1QYXJzZXIuQ09NTUVOVF9UT0tFTilcblx0XHRcdFx0XHR0aGlzLmlnbm9yZUxpbmUoKTtcblx0XHRcdFx0Y2ggPSB0aGlzLmdldE5leHRDaGFyKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChjaCAhPSBcIn1cIilcblx0XHRcdFx0dGhpcy5wdXRCYWNrKCk7XG5cblx0XHR9IHdoaWxlIChjaCAhPSBcIn1cIik7XG5cdH1cblxuXHQvKipcblx0ICogUHV0cyBiYWNrIHRoZSBsYXN0IHJlYWQgY2hhcmFjdGVyIGludG8gdGhlIGRhdGEgc3RyZWFtLlxuXHQgKi9cblx0cHJpdmF0ZSBwdXRCYWNrKCk6dm9pZFxuXHR7XG5cdFx0dGhpcy5fcGFyc2VJbmRleC0tO1xuXHRcdHRoaXMuX2NoYXJMaW5lSW5kZXgtLTtcblx0XHR0aGlzLl9yZWFjaGVkRU9GID0gdGhpcy5fcGFyc2VJbmRleCA+PSB0aGlzLl90ZXh0RGF0YS5sZW5ndGg7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgbmV4dCB0b2tlbiBpbiB0aGUgZGF0YSBzdHJlYW0uXG5cdCAqL1xuXHRwcml2YXRlIGdldE5leHRUb2tlbigpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGNoOnN0cmluZztcblx0XHR2YXIgdG9rZW46c3RyaW5nID0gXCJcIjtcblxuXHRcdHdoaWxlICghdGhpcy5fcmVhY2hlZEVPRikge1xuXHRcdFx0Y2ggPSB0aGlzLmdldE5leHRDaGFyKCk7XG5cdFx0XHRpZiAoY2ggPT0gXCIgXCIgfHwgY2ggPT0gXCJcXHJcIiB8fCBjaCA9PSBcIlxcblwiIHx8IGNoID09IFwiXFx0XCIpIHtcblx0XHRcdFx0aWYgKHRva2VuICE9IE1ENUFuaW1QYXJzZXIuQ09NTUVOVF9UT0tFTilcblx0XHRcdFx0XHR0aGlzLnNraXBXaGl0ZVNwYWNlKCk7XG5cdFx0XHRcdGlmICh0b2tlbiAhPSBcIlwiKVxuXHRcdFx0XHRcdHJldHVybiB0b2tlbjtcblx0XHRcdH0gZWxzZVxuXHRcdFx0XHR0b2tlbiArPSBjaDtcblxuXHRcdFx0aWYgKHRva2VuID09IE1ENUFuaW1QYXJzZXIuQ09NTUVOVF9UT0tFTilcblx0XHRcdFx0cmV0dXJuIHRva2VuO1xuXHRcdH1cblxuXHRcdHJldHVybiB0b2tlbjtcblx0fVxuXG5cdC8qKlxuXHQgKiBTa2lwcyBhbGwgd2hpdGVzcGFjZSBpbiB0aGUgZGF0YSBzdHJlYW0uXG5cdCAqL1xuXHRwcml2YXRlIHNraXBXaGl0ZVNwYWNlKCk6dm9pZFxuXHR7XG5cdFx0dmFyIGNoOnN0cmluZztcblxuXHRcdGRvXG5cdFx0XHRjaCA9IHRoaXMuZ2V0TmV4dENoYXIoKTsgd2hpbGUgKGNoID09IFwiXFxuXCIgfHwgY2ggPT0gXCIgXCIgfHwgY2ggPT0gXCJcXHJcIiB8fCBjaCA9PSBcIlxcdFwiKTtcblxuXHRcdHRoaXMucHV0QmFjaygpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNraXBzIHRvIHRoZSBuZXh0IGxpbmUuXG5cdCAqL1xuXHRwcml2YXRlIGlnbm9yZUxpbmUoKTp2b2lkXG5cdHtcblx0XHR2YXIgY2g6c3RyaW5nO1xuXHRcdHdoaWxlICghdGhpcy5fcmVhY2hlZEVPRiAmJiBjaCAhPSBcIlxcblwiKVxuXHRcdFx0Y2ggPSB0aGlzLmdldE5leHRDaGFyKCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBuZXh0IHNpbmdsZSBjaGFyYWN0ZXIgaW4gdGhlIGRhdGEgc3RyZWFtLlxuXHQgKi9cblx0cHJpdmF0ZSBnZXROZXh0Q2hhcigpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGNoOnN0cmluZyA9IHRoaXMuX3RleHREYXRhLmNoYXJBdCh0aGlzLl9wYXJzZUluZGV4KyspO1xuXG5cdFx0aWYgKGNoID09IFwiXFxuXCIpIHtcblx0XHRcdCsrdGhpcy5fbGluZTtcblx0XHRcdHRoaXMuX2NoYXJMaW5lSW5kZXggPSAwO1xuXHRcdH0gZWxzZSBpZiAoY2ggIT0gXCJcXHJcIilcblx0XHRcdCsrdGhpcy5fY2hhckxpbmVJbmRleDtcblxuXHRcdGlmICh0aGlzLl9wYXJzZUluZGV4ID09IHRoaXMuX3RleHREYXRhLmxlbmd0aClcblx0XHRcdHRoaXMuX3JlYWNoZWRFT0YgPSB0cnVlO1xuXG5cdFx0cmV0dXJuIGNoO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgbmV4dCBpbnRlZ2VyIGluIHRoZSBkYXRhIHN0cmVhbS5cblx0ICovXG5cdHByaXZhdGUgZ2V0TmV4dEludCgpOm51bWJlciAvKmludCovXG5cdHtcblx0XHR2YXIgaTpudW1iZXIgPSBwYXJzZUludCh0aGlzLmdldE5leHRUb2tlbigpKTtcblx0XHRpZiAoaXNOYU4oaSkpXG5cdFx0XHR0aGlzLnNlbmRQYXJzZUVycm9yKFwiaW50IHR5cGVcIik7XG5cdFx0cmV0dXJuIGk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBuZXh0IGZsb2F0aW5nIHBvaW50IG51bWJlciBpbiB0aGUgZGF0YSBzdHJlYW0uXG5cdCAqL1xuXHRwcml2YXRlIGdldE5leHROdW1iZXIoKTpudW1iZXJcblx0e1xuXHRcdHZhciBmOm51bWJlciA9IHBhcnNlRmxvYXQodGhpcy5nZXROZXh0VG9rZW4oKSk7XG5cdFx0aWYgKGlzTmFOKGYpKVxuXHRcdFx0dGhpcy5zZW5kUGFyc2VFcnJvcihcImZsb2F0IHR5cGVcIik7XG5cdFx0cmV0dXJuIGY7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBuZXh0IDNkIHZlY3RvciBpbiB0aGUgZGF0YSBzdHJlYW0uXG5cdCAqL1xuXHRwcml2YXRlIHBhcnNlVmVjdG9yM0QoKTpWZWN0b3IzRFxuXHR7XG5cdFx0dmFyIHZlYzpWZWN0b3IzRCA9IG5ldyBWZWN0b3IzRCgpO1xuXHRcdHZhciBjaDpzdHJpbmcgPSB0aGlzLmdldE5leHRUb2tlbigpO1xuXG5cdFx0aWYgKGNoICE9IFwiKFwiKVxuXHRcdFx0dGhpcy5zZW5kUGFyc2VFcnJvcihcIihcIik7XG5cdFx0dmVjLnggPSB0aGlzLmdldE5leHROdW1iZXIoKTtcblx0XHR2ZWMueSA9IHRoaXMuZ2V0TmV4dE51bWJlcigpO1xuXHRcdHZlYy56ID0gdGhpcy5nZXROZXh0TnVtYmVyKCk7XG5cblx0XHRpZiAodGhpcy5nZXROZXh0VG9rZW4oKSAhPSBcIilcIilcblx0XHRcdHRoaXMuc2VuZFBhcnNlRXJyb3IoXCIpXCIpO1xuXG5cdFx0cmV0dXJuIHZlYztcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIG5leHQgcXVhdGVybmlvbiBpbiB0aGUgZGF0YSBzdHJlYW0uXG5cdCAqL1xuXHRwcml2YXRlIHBhcnNlUXVhdGVybmlvbigpOlF1YXRlcm5pb25cblx0e1xuXHRcdHZhciBxdWF0OlF1YXRlcm5pb24gPSBuZXcgUXVhdGVybmlvbigpO1xuXHRcdHZhciBjaDpzdHJpbmcgPSB0aGlzLmdldE5leHRUb2tlbigpO1xuXG5cdFx0aWYgKGNoICE9IFwiKFwiKVxuXHRcdFx0dGhpcy5zZW5kUGFyc2VFcnJvcihcIihcIik7XG5cdFx0cXVhdC54ID0gdGhpcy5nZXROZXh0TnVtYmVyKCk7XG5cdFx0cXVhdC55ID0gdGhpcy5nZXROZXh0TnVtYmVyKCk7XG5cdFx0cXVhdC56ID0gdGhpcy5nZXROZXh0TnVtYmVyKCk7XG5cblx0XHQvLyBxdWF0IHN1cHBvc2VkIHRvIGJlIHVuaXQgbGVuZ3RoXG5cdFx0dmFyIHQ6bnVtYmVyID0gMSAtIChxdWF0LngqcXVhdC54KSAtIChxdWF0LnkqcXVhdC55KSAtIChxdWF0LnoqcXVhdC56KTtcblx0XHRxdWF0LncgPSB0IDwgMD8gMCA6IC1NYXRoLnNxcnQodCk7XG5cblx0XHRpZiAodGhpcy5nZXROZXh0VG9rZW4oKSAhPSBcIilcIilcblx0XHRcdHRoaXMuc2VuZFBhcnNlRXJyb3IoXCIpXCIpO1xuXG5cdFx0cmV0dXJuIHF1YXQ7XG5cdH1cblxuXHQvKipcblx0ICogUGFyc2VzIHRoZSBjb21tYW5kIGxpbmUgZGF0YS5cblx0ICovXG5cdHByaXZhdGUgcGFyc2VDTUQoKTp2b2lkXG5cdHtcblx0XHQvLyBqdXN0IGlnbm9yZSB0aGUgY29tbWFuZCBsaW5lIHByb3BlcnR5XG5cdFx0dGhpcy5wYXJzZUxpdGVyYWxzdHJpbmcoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIG5leHQgbGl0ZXJhbCBzdHJpbmcgaW4gdGhlIGRhdGEgc3RyZWFtLiBBIGxpdGVyYWwgc3RyaW5nIGlzIGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyBib3VuZGVkXG5cdCAqIGJ5IGRvdWJsZSBxdW90ZXMuXG5cdCAqL1xuXHRwcml2YXRlIHBhcnNlTGl0ZXJhbHN0cmluZygpOnN0cmluZ1xuXHR7XG5cdFx0dGhpcy5za2lwV2hpdGVTcGFjZSgpO1xuXG5cdFx0dmFyIGNoOnN0cmluZyA9IHRoaXMuZ2V0TmV4dENoYXIoKTtcblx0XHR2YXIgc3RyOnN0cmluZyA9IFwiXCI7XG5cblx0XHRpZiAoY2ggIT0gXCJcXFwiXCIpXG5cdFx0XHR0aGlzLnNlbmRQYXJzZUVycm9yKFwiXFxcIlwiKTtcblxuXHRcdGRvIHtcblx0XHRcdGlmICh0aGlzLl9yZWFjaGVkRU9GKVxuXHRcdFx0XHR0aGlzLnNlbmRFT0ZFcnJvcigpO1xuXHRcdFx0Y2ggPSB0aGlzLmdldE5leHRDaGFyKCk7XG5cdFx0XHRpZiAoY2ggIT0gXCJcXFwiXCIpXG5cdFx0XHRcdHN0ciArPSBjaDtcblx0XHR9IHdoaWxlIChjaCAhPSBcIlxcXCJcIik7XG5cblx0XHRyZXR1cm4gc3RyO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRocm93cyBhbiBlbmQtb2YtZmlsZSBlcnJvciB3aGVuIGEgcHJlbWF0dXJlIGVuZCBvZiBmaWxlIHdhcyBlbmNvdW50ZXJlZC5cblx0ICovXG5cdHByaXZhdGUgc2VuZEVPRkVycm9yKCk6dm9pZFxuXHR7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCBlbmQgb2YgZmlsZVwiKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaHJvd3MgYW4gZXJyb3Igd2hlbiBhbiB1bmV4cGVjdGVkIHRva2VuIHdhcyBlbmNvdW50ZXJlZC5cblx0ICogQHBhcmFtIGV4cGVjdGVkIFRoZSB0b2tlbiB0eXBlIHRoYXQgd2FzIGFjdHVhbGx5IGV4cGVjdGVkLlxuXHQgKi9cblx0cHJpdmF0ZSBzZW5kUGFyc2VFcnJvcihleHBlY3RlZDpzdHJpbmcpOnZvaWRcblx0e1xuXHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhwZWN0ZWQgdG9rZW4gYXQgbGluZSBcIiArICh0aGlzLl9saW5lICsgMSkgKyBcIiwgY2hhcmFjdGVyIFwiICsgdGhpcy5fY2hhckxpbmVJbmRleCArIFwiLiBcIiArIGV4cGVjdGVkICsgXCIgZXhwZWN0ZWQsIGJ1dCBcIiArIHRoaXMuX3RleHREYXRhLmNoYXJBdCh0aGlzLl9wYXJzZUluZGV4IC0gMSkgKyBcIiBlbmNvdW50ZXJlZFwiKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaHJvd3MgYW4gZXJyb3Igd2hlbiBhbiB1bmtub3duIGtleXdvcmQgd2FzIGVuY291bnRlcmVkLlxuXHQgKi9cblx0cHJpdmF0ZSBzZW5kVW5rbm93bktleXdvcmRFcnJvcigpOnZvaWRcblx0e1xuXHRcdHRocm93IG5ldyBFcnJvcihcIlVua25vd24ga2V5d29yZCBhdCBsaW5lIFwiICsgKHRoaXMuX2xpbmUgKyAxKSArIFwiLCBjaGFyYWN0ZXIgXCIgKyB0aGlzLl9jaGFyTGluZUluZGV4ICsgXCIuIFwiKTtcblx0fVxufVxuXG5leHBvcnQgPSBNRDVBbmltUGFyc2VyOyJdfQ==