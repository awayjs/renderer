///<reference path="../../_definitions.ts"/>

module away.loaders
{
	import JointPose                    = away.animators.JointPose;
	import SkeletonPose                 = away.animators.SkeletonPose;
	import SkeletonClipNode             = away.animators.SkeletonClipNode;
	import Quaternion                   = away.math.Quaternion;
	import Vector3D                     = away.geom.Vector3D;

	/**
	 * MD5AnimParser provides a parser for the md5anim data type, providing an animation sequence for the md5 format.
	 *
	 * todo: optimize
	 */
	export class MD5AnimParser extends ParserBase
	{
		private _textData:string;
		private _startedParsing:boolean;
		public static VERSION_TOKEN:string = "MD5Version";
		public static COMMAND_LINE_TOKEN:string = "commandline";
		public static NUM_FRAMES_TOKEN:string = "numFrames";
		public static NUM_JOINTS_TOKEN:string = "numJoints";
		public static FRAME_RATE_TOKEN:string = "frameRate";
		public static NUM_ANIMATED_COMPONENTS_TOKEN:string = "numAnimatedComponents";

		public static HIERARCHY_TOKEN:string = "hierarchy";
		public static BOUNDS_TOKEN:string = "bounds";
		public static BASE_FRAME_TOKEN:string = "baseframe";
		public static FRAME_TOKEN:string = "frame";

		public static COMMENT_TOKEN:string = "//";

		private _parseIndex:number /*int*/ = 0;
		private _reachedEOF:boolean;
		private _line:number /*int*/ = 0;
		private _charLineIndex:number /*int*/ = 0;
		private _version:number /*int*/;
		private _frameRate:number /*int*/;
		private _numFrames:number /*int*/;
		private _numJoints:number /*int*/;
		private _numAnimatedComponents:number /*int*/;

		private _hierarchy:Array<HierarchyData>;
		private _bounds:Array<BoundsData>;
		private _frameData:Array<FrameData>;
		private _baseFrameData:Array<BaseFrameData>;

		private _rotationQuat:Quaternion;
		private _clip:SkeletonClipNode;

		/**
		 * Creates a new MD5AnimParser object.
		 * @param uri The url or id of the data or file to be parsed.
		 * @param extra The holder for extra contextual data that the parser might need.
		 */
			constructor(additionalRotationAxis:Vector3D = null, additionalRotationRadians:number = 0)
		{
			super(ParserDataFormat.PLAIN_TEXT);
			this._rotationQuat = new Quaternion();
			var t1:Quaternion = new Quaternion();
			var t2:Quaternion = new Quaternion();

			t1.fromAxisAngle(Vector3D.X_AXIS, -Math.PI*.5);
			t2.fromAxisAngle(Vector3D.Y_AXIS, -Math.PI*.5);

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
		public static supportsType(extension:string):boolean
		{
			extension = extension.toLowerCase();
			return extension == "md5anim";
		}

		/**
		 * Tests whether a data block can be parsed by the parser.
		 * @param data The data block to potentially be parsed.
		 * @return Whether or not the given data is supported.
		 */
		public static supportsData(data:any):boolean
		{
			return false;
		}

		/**
		 * @inheritDoc
		 */
		public _pProceedParsing():boolean
		{
			var token:string;

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
						// can occur at the end of a file
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
						this._bounds = new Array<BoundsData>();
						this._frameData = new Array<FrameData>();
						break;
					case MD5AnimParser.NUM_JOINTS_TOKEN:
						this._numJoints = this.getNextInt();
						this._hierarchy = new Array<HierarchyData>(this._numJoints);
						this._baseFrameData = new Array<BaseFrameData>(this._numJoints);
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
		}

		/**
		 * Converts all key frame data to an SkinnedAnimationSequence.
		 */
		private translateClip():void
		{
			for (var i:number /*int*/ = 0; i < this._numFrames; ++i)
				this._clip.addFrame(this.translatePose(this._frameData[i]), 1000/this._frameRate);
		}

		/**
		 * Converts a single key frame data to a SkeletonPose.
		 * @param frameData The actual frame data.
		 * @return A SkeletonPose containing the frame data's pose.
		 */
		private translatePose(frameData:FrameData):SkeletonPose
		{
			var hierarchy:HierarchyData;
			var pose:JointPose;
			var base:BaseFrameData;
			var flags:number /*int*/;
			var j:number /*int*/;
			var translate:Vector3D = new Vector3D();
			var orientation:Quaternion = new Quaternion();
			var components:Array<number> = frameData.components;
			var skelPose:SkeletonPose = new SkeletonPose();
			var jointPoses:Array<JointPose> = skelPose.jointPoses;

			for (var i:number /*int*/ = 0; i < this._numJoints; ++i) {
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

				var w:number = 1 - orientation.x*orientation.x - orientation.y*orientation.y - orientation.z*orientation.z;
				orientation.w = w < 0? 0 : -Math.sqrt(w);

				if (hierarchy.parentIndex < 0) {
					pose.orientation.multiply(this._rotationQuat, orientation);
					pose.translation = this._rotationQuat.rotatePoint(translate);
				} else {
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
		}

		/**
		 * Parses the skeleton's hierarchy data.
		 */
		private parseHierarchy():void
		{
			var ch:string;
			var data:HierarchyData;
			var token:string = this.getNextToken();
			var i:number /*int*/ = 0;

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
		}

		/**
		 * Parses frame bounds.
		 */
		private parseBounds():void
		{
			var ch:string;
			var data:BoundsData;
			var token:string = this.getNextToken();
			var i:number /*int*/ = 0;

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
		}

		/**
		 * Parses the base frame.
		 */
		private parseBaseFrame():void
		{
			var ch:string;
			var data:BaseFrameData;
			var token:string = this.getNextToken();
			var i:number /*int*/ = 0;

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
		}

		/**
		 * Parses a single frame.
		 */
		private parseFrame():void
		{
			var ch:string;
			var data:FrameData;
			var token:string;
			var frameIndex:number /*int*/;

			frameIndex = this.getNextInt();

			token = this.getNextToken();
			if (token != "{")
				this.sendUnknownKeywordError();

			do {
				if (this._reachedEOF)
					this.sendEOFError();
				data = new FrameData();
				data.components = new Array<number>(this._numAnimatedComponents);

				for (var i:number /*int*/ = 0; i < this._numAnimatedComponents; ++i)
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
		}

		/**
		 * Puts back the last read character into the data stream.
		 */
		private putBack():void
		{
			this._parseIndex--;
			this._charLineIndex--;
			this._reachedEOF = this._parseIndex >= this._textData.length;
		}

		/**
		 * Gets the next token in the data stream.
		 */
		private getNextToken():string
		{
			var ch:string;
			var token:string = "";

			while (!this._reachedEOF) {
				ch = this.getNextChar();
				if (ch == " " || ch == "\r" || ch == "\n" || ch == "\t") {
					if (token != MD5AnimParser.COMMENT_TOKEN)
						this.skipWhiteSpace();
					if (token != "")
						return token;
				} else
					token += ch;

				if (token == MD5AnimParser.COMMENT_TOKEN)
					return token;
			}

			return token;
		}

		/**
		 * Skips all whitespace in the data stream.
		 */
		private skipWhiteSpace():void
		{
			var ch:string;

			do
				ch = this.getNextChar(); while (ch == "\n" || ch == " " || ch == "\r" || ch == "\t");

			this.putBack();
		}

		/**
		 * Skips to the next line.
		 */
		private ignoreLine():void
		{
			var ch:string;
			while (!this._reachedEOF && ch != "\n")
				ch = this.getNextChar();
		}

		/**
		 * Retrieves the next single character in the data stream.
		 */
		private getNextChar():string
		{
			var ch:string = this._textData.charAt(this._parseIndex++);

			if (ch == "\n") {
				++this._line;
				this._charLineIndex = 0;
			} else if (ch != "\r")
				++this._charLineIndex;

			if (this._parseIndex == this._textData.length)
				this._reachedEOF = true;

			return ch;
		}

		/**
		 * Retrieves the next integer in the data stream.
		 */
		private getNextInt():number /*int*/
		{
			var i:number = parseInt(this.getNextToken());
			if (isNaN(i))
				this.sendParseError("int type");
			return i;
		}

		/**
		 * Retrieves the next floating point number in the data stream.
		 */
		private getNextNumber():number
		{
			var f:number = parseFloat(this.getNextToken());
			if (isNaN(f))
				this.sendParseError("float type");
			return f;
		}

		/**
		 * Retrieves the next 3d vector in the data stream.
		 */
		private parseVector3D():Vector3D
		{
			var vec:Vector3D = new Vector3D();
			var ch:string = this.getNextToken();

			if (ch != "(")
				this.sendParseError("(");
			vec.x = this.getNextNumber();
			vec.y = this.getNextNumber();
			vec.z = this.getNextNumber();

			if (this.getNextToken() != ")")
				this.sendParseError(")");

			return vec;
		}

		/**
		 * Retrieves the next quaternion in the data stream.
		 */
		private parseQuaternion():Quaternion
		{
			var quat:Quaternion = new Quaternion();
			var ch:string = this.getNextToken();

			if (ch != "(")
				this.sendParseError("(");
			quat.x = this.getNextNumber();
			quat.y = this.getNextNumber();
			quat.z = this.getNextNumber();

			// quat supposed to be unit length
			var t:number = 1 - (quat.x*quat.x) - (quat.y*quat.y) - (quat.z*quat.z);
			quat.w = t < 0? 0 : -Math.sqrt(t);

			if (this.getNextToken() != ")")
				this.sendParseError(")");

			return quat;
		}

		/**
		 * Parses the command line data.
		 */
		private parseCMD():void
		{
			// just ignore the command line property
			this.parseLiteralstring();
		}

		/**
		 * Retrieves the next literal string in the data stream. A literal string is a sequence of characters bounded
		 * by double quotes.
		 */
		private parseLiteralstring():string
		{
			this.skipWhiteSpace();

			var ch:string = this.getNextChar();
			var str:string = "";

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
		}

		/**
		 * Throws an end-of-file error when a premature end of file was encountered.
		 */
		private sendEOFError():void
		{
			throw new Error("Unexpected end of file");
		}

		/**
		 * Throws an error when an unexpected token was encountered.
		 * @param expected The token type that was actually expected.
		 */
		private sendParseError(expected:string):void
		{
			throw new Error("Unexpected token at line " + (this._line + 1) + ", character " + this._charLineIndex + ". " + expected + " expected, but " + this._textData.charAt(this._parseIndex - 1) + " encountered");
		}

		/**
		 * Throws an error when an unknown keyword was encountered.
		 */
		private sendUnknownKeywordError():void
		{
			throw new Error("Unknown keyword at line " + (this._line + 1) + ", character " + this._charLineIndex + ". ");
		}
	}
}

// value objects

class HierarchyData
{
	public name:string;
	public parentIndex:number /*int*/;
	public flags:number /*int*/;
	public startIndex:number /*int*/;

	public HierarchyData()
	{
	}
}

class BoundsData
{
	public min:away.geom.Vector3D;
	public max:away.geom.Vector3D;

	public BoundsData()
	{
	}
}

class BaseFrameData
{
	public position:away.geom.Vector3D;
	public orientation:away.math.Quaternion;

	public BaseFrameData()
	{
	}
}

class FrameData
{
	public index:number /*int*/;
	public components:Array<number>;

	public FrameData()
	{
	}
}

