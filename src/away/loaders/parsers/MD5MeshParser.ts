///<reference path="../../_definitions.ts"/>

module away.loaders
{
	import SkeletonAnimationSet         = away.animators.SkeletonAnimationSet;
	import Skeleton                     = away.animators.Skeleton;
	import SkeletonJoint                = away.animators.SkeletonJoint;
	import Geometry                     = away.base.Geometry;
	import SkinnedSubGeometry           = away.base.SkinnedSubGeometry;
	import Quaternion                   = away.math.Quaternion;
	import Mesh                         = away.entities.Mesh;
	
	import Matrix3D                     = away.geom.Matrix3D;
	import Vector3D                     = away.geom.Vector3D;
	
	// todo: create animation system, parse skeleton
	
	/**
	 * MD5MeshParser provides a parser for the md5mesh data type, providing the geometry of the md5 format.
	 *
	 * todo: optimize
	 */
	export class MD5MeshParser extends ParserBase
	{
		private _textData:string;
		private _startedParsing:boolean;
		public static VERSION_TOKEN:string = "MD5Version";
		public static COMMAND_LINE_TOKEN:string = "commandline";
		public static NUM_JOINTS_TOKEN:string = "numJoints";
		public static NUM_MESHES_TOKEN:string = "numMeshes";
		public static COMMENT_TOKEN:string = "//";
		public static JOINTS_TOKEN:string = "joints";
		public static MESH_TOKEN:string = "mesh";
		
		public static MESH_SHADER_TOKEN:string = "shader";
		public static MESH_NUM_VERTS_TOKEN:string = "numverts";
		public static MESH_VERT_TOKEN:string = "vert";
		public static MESH_NUM_TRIS_TOKEN:string = "numtris";
		public static MESH_TRI_TOKEN:string = "tri";
		public static MESH_NUM_WEIGHTS_TOKEN:string = "numweights";
		public static MESH_WEIGHT_TOKEN:string = "weight";
		
		private _parseIndex:number /*int*/ = 0;
		private _reachedEOF:boolean;
		private _line:number /*int*/ = 0;
		private _charLineIndex:number /*int*/ = 0;
		private _version:number /*int*/;
		private _numJoints:number /*int*/;
		private _numMeshes:number /*int*/;
		
		private _mesh:Mesh;
		private _shaders:Array<string>;
		
		private _maxJointCount:number /*int*/;
		private _meshData:Array<MeshData>;
		private _bindPoses:Array<Matrix3D>;
		private _geometry:Geometry;
		
		private _skeleton:Skeleton;
		private _animationSet:SkeletonAnimationSet;
		
		private _rotationQuat:Quaternion;
		
		/**
		 * Creates a new MD5MeshParser object.
		 */
		constructor(additionalRotationAxis:Vector3D = null, additionalRotationRadians:number = 0)
		{
			super(ParserDataFormat.PLAIN_TEXT);
			this._rotationQuat = new Quaternion();
			
			this._rotationQuat.fromAxisAngle(Vector3D.X_AXIS, -Math.PI*.5);
			
			if (additionalRotationAxis) {
				var quat:Quaternion = new Quaternion();
				quat.fromAxisAngle(additionalRotationAxis, additionalRotationRadians);
				this._rotationQuat.multiply(this._rotationQuat, quat);
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
			return extension == "md5mesh";
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
                        this._bindPoses = new Array<Matrix3D>(this._numJoints);
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
					
					for (var i:number /*int*/ = 0; i < this._meshData.length; ++i)
						this._geometry.addSubGeometry(this.translateGeom(this._meshData[i].vertexData, this._meshData[i].weightData, this._meshData[i].indices));
					
					//_geometry.animation = _animation;
					//					_mesh.animationController = _animationController;

                    this._pFinalizeAsset(this._geometry);
                    this._pFinalizeAsset(this._mesh);
                    this._pFinalizeAsset(this._skeleton);
                    this._pFinalizeAsset(this._animationSet);
					return ParserBase.PARSING_DONE;
				}
			}
			return ParserBase.MORE_TO_PARSE;
		}
		
		private calculateMaxJointCount():void
		{
            this._maxJointCount = 0;
			
			var numMeshData:number /*int*/ = this._meshData.length;
			for (var i:number /*int*/ = 0; i < numMeshData; ++i) {
				var meshData:MeshData = this._meshData[i];
				var vertexData:Array<VertexData> = meshData.vertexData;
				var numVerts:number /*int*/ = vertexData.length;
				
				for (var j:number /*int*/ = 0; j < numVerts; ++j) {
					var zeroWeights:number /*int*/ = this.countZeroWeightJoints(vertexData[j], meshData.weightData);
					var totalJoints:number /*int*/ = vertexData[j].countWeight - zeroWeights;
					if (totalJoints > this._maxJointCount)
                        this._maxJointCount = totalJoints;
				}
			}
		}
		
		private countZeroWeightJoints(vertex:VertexData, weights:Array<JointData>):number /*int*/
		{
			var start:number /*int*/ = vertex.startWeight;
			var end:number /*int*/ = vertex.startWeight + vertex.countWeight;
			var count:number /*int*/ = 0;
			var weight:number;
			
			for (var i:number /*int*/ = start; i < end; ++i) {
				weight = weights[i].bias;
				if (weight == 0)
					++count;
			}
			
			return count;
		}
		
		/**
		 * Parses the skeleton's joints.
		 */
		private parseJoints():void
		{
			var ch:string;
			var joint:SkeletonJoint;
			var pos:Vector3D;
			var quat:Quaternion;
			var i:number /*int*/ = 0;
			var token:string = this.getNextToken();
			
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
				var inv:Matrix3D = this._bindPoses[i].clone();
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
		 * Parses the mesh geometry.
		 */
		private parseMesh():void
		{
			var token:string = this.getNextToken();
			var ch:string;
			var vertexData:Array<VertexData>;
			var weights:Array<JointData>;
			var indices:Array<number> /*uint*/;
			
			if (token != "{")
                this.sendUnknownKeywordError();
            
            if (this._shaders == null)
                this._shaders = new Array<string>();
			
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
						vertexData = new Array<VertexData>(this.getNextInt());
						break;
					case MD5MeshParser.MESH_NUM_TRIS_TOKEN:
						indices = new Array<number>(this.getNextInt()*3) /*uint*/;
						break;
					case MD5MeshParser.MESH_NUM_WEIGHTS_TOKEN:
						weights = new Array<JointData>(this.getNextInt());
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
                this._meshData = new Array<MeshData>();
            
			var i:number /*uint*/ = this._meshData.length;
            this._meshData[i] = new MeshData();
            this._meshData[i].vertexData = vertexData;
            this._meshData[i].weightData = weights;
            this._meshData[i].indices = indices;
		}
		
		/**
		 * Converts the mesh data to a SkinnedSub instance.
		 * @param vertexData The mesh's vertices.
		 * @param weights The joint weights per vertex.
		 * @param indices The indices for the faces.
		 * @return A SkinnedSubGeometry instance containing all geometrical data for the current mesh.
		 */
		private translateGeom(vertexData:Array<VertexData>, weights:Array<JointData>, indices:Array<number> /*uint*/):SkinnedSubGeometry
		{
			var len:number /*int*/ = vertexData.length;
			var v1:number /*int*/, v2:number /*int*/, v3:number /*int*/;
			var vertex:VertexData;
			var weight:JointData;
			var bindPose:Matrix3D;
			var pos:Vector3D;
			var subGeom:SkinnedSubGeometry = new SkinnedSubGeometry(this._maxJointCount);
			var uvs:Array<number> = new Array<number>(len*2);
			var vertices:Array<number> = new Array<number>(len*3);
			var jointIndices:Array<number> = new Array<number>(len*this._maxJointCount);
			var jointWeights:Array<number> = new Array<number>(len*this._maxJointCount);
			var l:number /*int*/ = 0;
			var nonZeroWeights:number /*int*/;
			
			for (var i:number /*int*/ = 0; i < len; ++i) {
				vertex = vertexData[i];
				v1 = vertex.index*3;
				v2 = v1 + 1;
				v3 = v1 + 2;
				vertices[v1] = vertices[v2] = vertices[v3] = 0;
				
				nonZeroWeights = 0;
				for (var j:number /*int*/ = 0; j < vertex.countWeight; ++j) {
					weight = weights[vertex.startWeight + j];
					if (weight.bias > 0) {
						bindPose = this._bindPoses[weight.joint];
						pos = bindPose.transformVector(weight.pos);
						vertices[v1] += pos.x*weight.bias;
						vertices[v2] += pos.y*weight.bias;
						vertices[v3] += pos.z*weight.bias;
						
						// indices need to be multiplied by 3 (amount of matrix registers)
						jointIndices[l] = weight.joint*3;
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
			
			subGeom.updateIndexData(indices);
			subGeom.fromVectors(vertices, uvs, null, null);
			// cause explicit updates
			subGeom.vertexNormalData;
			subGeom.vertexTangentData;
			// turn auto updates off because they may be animated and set explicitly
			subGeom.autoDeriveVertexTangents = false;
			subGeom.autoDeriveVertexNormals = false;
			subGeom.iUpdateJointIndexData(jointIndices);
			subGeom.iUpdateJointWeightsData(jointWeights);
			
			return subGeom;
		}
		
		/**
		 * Retrieve the next triplet of vertex indices that form a face.
		 * @param indices The index list in which to store the read data.
		 */
		private parseTri(indices:Array<number> /*uint*/):void
		{
			var index:number /*int*/ = this.getNextInt()*3;
			indices[index] = this.getNextInt();
			indices[index + 1] = this.getNextInt();
			indices[index + 2] = this.getNextInt();
		}
		
		/**
		 * Reads a new joint data set for a single joint.
		 * @param weights the target list to contain the weight data.
		 */
		private parseJoint(weights:Array<JointData>):void
		{
			var weight:JointData = new JointData();
			weight.index = this.getNextInt();
			weight.joint = this.getNextInt();
			weight.bias = this.getNextNumber();
			weight.pos = this.parseVector3D();
			weights[weight.index] = weight;
		}
		
		/**
		 * Reads the data for a single vertex.
		 * @param vertexData The list to contain the vertex data.
		 */
		private parseVertex(vertexData:Array<VertexData>):void
		{
			var vertex:VertexData = new VertexData();
			vertex.index = this.getNextInt();
            this.parseUV(vertex);
			vertex.startWeight = this.getNextInt();
			vertex.countWeight = this.getNextInt();
			//			if (vertex.countWeight > _maxJointCount) _maxJointCount = vertex.countWeight;
			vertexData[vertex.index] = vertex;
		}
		
		/**
		 * Reads the next uv coordinate.
		 * @param vertexData The vertexData to contain the UV coordinates.
		 */
		private parseUV(vertexData:VertexData):void
		{
			var ch:string = this.getNextToken();
			if (ch != "(")
                this.sendParseError("(");
			vertexData.s = this.getNextNumber();
			vertexData.t = this.getNextNumber();
			
			if (this.getNextToken() != ")")
                this.sendParseError(")");
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
					if (token != MD5MeshParser.COMMENT_TOKEN)
                        this.skipWhiteSpace();
					if (token != "")
						return token;
				} else
					token += ch;
				
				if (token == MD5MeshParser.COMMENT_TOKEN)
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
				ch = this.getNextChar();
			while (ch == "\n" || ch == " " || ch == "\r" || ch == "\t");

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
			
			if (this._parseIndex >= this._textData.length)
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
			vec.x = -this.getNextNumber();
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
			quat.y = -this.getNextNumber();
			quat.z = -this.getNextNumber();
			
			// quat supposed to be unit length
			var t:number = 1 - quat.x*quat.x - quat.y*quat.y - quat.z*quat.z;
			quat.w = t < 0? 0 : -Math.sqrt(t);
			
			if (this.getNextToken() != ")")
                this.sendParseError(")");
			
			var rotQuat:Quaternion = new Quaternion();
			rotQuat.multiply(this._rotationQuat, quat);
			return rotQuat;
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


class VertexData
{
	public index:number /*int*/;
	public s:number;
	public t:number;
	public startWeight:number /*int*/;
	public countWeight:number /*int*/;
}

class JointData
{
	public index:number /*int*/;
	public joint:number /*int*/;
	public bias:number;
	public pos:away.geom.Vector3D;
}

class MeshData
{
	public vertexData:Array<VertexData>;
	public weightData:Array<JointData>;
	public indices:Array<number> /*uint*/;
}
