///<reference path="../_definitions.ts"/>

module away.parsers
{
	import AnimationSetBase					= away.animators.AnimationSetBase;
	import AnimatorBase						= away.animators.AnimatorBase;
	import JointPose						= away.animators.JointPose;
	import Skeleton							= away.animators.Skeleton;
	import SkeletonAnimationSet				= away.animators.SkeletonAnimationSet;
	import SkeletonAnimator					= away.animators.SkeletonAnimator;
	import SkeletonClipNode					= away.animators.SkeletonClipNode;
	import SkeletonPose						= away.animators.SkeletonPose;
	import SkeletonJoint					= away.animators.SkeletonJoint;
	import VertexAnimationSet				= away.animators.VertexAnimationSet;
	import VertexAnimator					= away.animators.VertexAnimator;
	import VertexClipNode					= away.animators.VertexClipNode;
	import BlendMode						= away.base.BlendMode;
	import Geometry							= away.base.Geometry;
	import LightBase						= away.base.LightBase;
	import TriangleSubGeometry				= away.base.TriangleSubGeometry;
	import Mesh								= away.entities.Mesh;
	import DirectionalLight					= away.entities.DirectionalLight;
	import PointLight						= away.entities.PointLight;
	import ColorTransform					= away.geom.ColorTransform;
	import Matrix3D							= away.geom.Matrix3D;
	import AssetType						= away.library.AssetType;
	import AmbientEnvMapMethod				= away.materials.AmbientEnvMapMethod;
	import DefaultMaterialManager			= away.materials.DefaultMaterialManager;
	import DiffuseDepthMethod				= away.materials.DiffuseDepthMethod;
	import DiffuseCelMethod					= away.materials.DiffuseCelMethod;
//	import DiffuseSubSurfaceMethod			= away.materials.DiffuseSubSurfaceMethod;
	import DiffuseGradientMethod			= away.materials.DiffuseGradientMethod;
	import DiffuseLightMapMethod			= away.materials.DiffuseLightMapMethod;
	import DiffuseWrapMethod				= away.materials.DiffuseWrapMethod;
	import EffectAlphaMaskMethod			= away.materials.EffectAlphaMaskMethod;
	import EffectColorMatrixMethod			= away.materials.EffectColorMatrixMethod;
	import EffectColorTransformMethod		= away.materials.EffectColorTransformMethod;
	import EffectEnvMapMethod				= away.materials.EffectEnvMapMethod;
	import EffectFogMethod					= away.materials.EffectFogMethod;
	import EffectFresnelEnvMapMethod		= away.materials.EffectFresnelEnvMapMethod;
	import EffectLightMapMethod				= away.materials.EffectLightMapMethod;
	import EffectMethodBase					= away.materials.EffectMethodBase;
	import EffectRimLightMethod				= away.materials.EffectRimLightMethod;
	import LightPickerBase					= away.materials.LightPickerBase;
	import MaterialBase						= away.materials.MaterialBase;
	import NormalSimpleWaterMethod			= away.materials.NormalSimpleWaterMethod;
	import TriangleMethodMaterial			= away.materials.TriangleMethodMaterial;
	import TriangleMaterialMode				= away.materials.TriangleMaterialMode;
	import ShadowDitheredMethod				= away.materials.ShadowDitheredMethod;
	import ShadowFilteredMethod				= away.materials.ShadowFilteredMethod;
	import SkyboxMaterial					= away.materials.SkyboxMaterial;
	import SpecularFresnelMethod			= away.materials.SpecularFresnelMethod;
	import ShadowHardMethod					= away.materials.ShadowHardMethod;
	import SpecularAnisotropicMethod		= away.materials.SpecularAnisotropicMethod;
	import SpecularCelMethod				= away.materials.SpecularCelMethod;
	import SpecularPhongMethod				= away.materials.SpecularPhongMethod;
	import ShadowNearMethod					= away.materials.ShadowNearMethod;
	import CubeMapShadowMapper				= away.materials.CubeMapShadowMapper;
	import DirectionalShadowMapper			= away.materials.DirectionalShadowMapper;
	import ShadowMapperBase					= away.materials.ShadowMapperBase;
	import ShadowMethodBase					= away.materials.ShadowMethodBase;
	import ShadowSoftMethod					= away.materials.ShadowSoftMethod;
	import StaticLightPicker				= away.materials.StaticLightPicker;
	import URLLoaderDataFormat				= away.net.URLLoaderDataFormat;
	import ParserBase						= away.parsers.ParserBase;
	import ParserUtils						= away.parsers.ParserUtils;
	import ResourceDependency				= away.parsers.ResourceDependency;
	import BitmapCubeTexture				= away.textures.BitmapCubeTexture;
	import BitmapTexture					= away.textures.BitmapTexture;
	import CubeTextureBase					= away.textures.CubeTextureBase;
	import ImageCubeTexture					= away.textures.ImageCubeTexture;
	import ImageTexture						= away.textures.ImageTexture;
	import Texture2DBase					= away.textures.Texture2DBase;
	import TextureProxyBase					= away.textures.TextureProxyBase;
	import ByteArray						= away.utils.ByteArray;

	/**
	 * AWDParser provides a parser for the AWD data type.
	 */
	export class AWDParser extends away.parsers.ParserBase
	{
		//set to "true" to have some console.logs in the Console
		private _debug:boolean = false;
		private _byteData:ByteArray;
		private _startedParsing:boolean = false;
		private _cur_block_id:number;
		private _blocks:Array<AWDBlock>;
		private _newBlockBytes:ByteArray;
		private _version:Array<number>;
		private _compression:number;
		private _accuracyOnBlocks:boolean;
		private _accuracyMatrix:boolean;
		private _accuracyGeo:boolean;
		private _accuracyProps:boolean;
		private _matrixNrType:number;
		private _geoNrType:number;
		private _propsNrType:number;
		private _streaming:boolean;
		private _texture_users:Object = {};
		private _parsed_header:boolean = false;
		private _body:ByteArray;
		private _defaultTexture:BitmapTexture;     // HTML IMAGE TEXTURE >? !
		private _cubeTextures:Array<any>;
		private _defaultBitmapMaterial:TriangleMethodMaterial;
		private _defaultCubeTexture:BitmapCubeTexture;

		public static COMPRESSIONMODE_LZMA:string = "lzma";
		public static UNCOMPRESSED:number = 0;
		public static DEFLATE:number = 1;
		public static LZMA:number = 2;
		public static INT8:number = 1;
		public static INT16:number = 2;
		public static INT32:number = 3;
		public static UINT8:number = 4;
		public static UINT16:number = 5;
		public static UINT32:number = 6;
		public static FLOAT32:number = 7;
		public static FLOAT64:number = 8;
		public static BOOL:number = 21;
		public static COLOR:number = 22;
		public static BADDR:number = 23;
		public static AWDSTRING:number = 31;
		public static AWDBYTEARRAY:number = 32;
		public static VECTOR2x1:number = 41;
		public static VECTOR3x1:number = 42;
		public static VECTOR4x1:number = 43;
		public static MTX3x2:number = 44;
		public static MTX3x3:number = 45;
		public static MTX4x3:number = 46;
		public static MTX4x4:number = 47;

		private blendModeDic:Array<string>;
		private _depthSizeDic:Array<number>;

		/**
		 * Creates a new AWDParser object.
		 * @param uri The url or id of the data or file to be parsed.
		 * @param extra The holder for extra contextual data that the parser might need.
		 */
		constructor()
		{
			super(URLLoaderDataFormat.ARRAY_BUFFER);

			this._blocks = new Array<AWDBlock>();
			this._blocks[0] = new AWDBlock();
			this._blocks[0].data = null; // Zero address means null in AWD

			this.blendModeDic = new Array<string>(); // used to translate ints to blendMode-strings
			this.blendModeDic.push(BlendMode.NORMAL);
			this.blendModeDic.push(BlendMode.ADD);
			this.blendModeDic.push(BlendMode.ALPHA);
			this.blendModeDic.push(BlendMode.DARKEN);
			this.blendModeDic.push(BlendMode.DIFFERENCE);
			this.blendModeDic.push(BlendMode.ERASE);
			this.blendModeDic.push(BlendMode.HARDLIGHT);
			this.blendModeDic.push(BlendMode.INVERT);
			this.blendModeDic.push(BlendMode.LAYER);
			this.blendModeDic.push(BlendMode.LIGHTEN);
			this.blendModeDic.push(BlendMode.MULTIPLY);
			this.blendModeDic.push(BlendMode.NORMAL);
			this.blendModeDic.push(BlendMode.OVERLAY);
			this.blendModeDic.push(BlendMode.SCREEN);
			this.blendModeDic.push(BlendMode.SHADER);
			this.blendModeDic.push(BlendMode.OVERLAY);

			this._depthSizeDic = new Array<number>(); // used to translate ints to depthSize-values
			this._depthSizeDic.push(256);
			this._depthSizeDic.push(512);
			this._depthSizeDic.push(2048);
			this._depthSizeDic.push(1024);
			this._version = Array<number>(); // will contain 2 int (major-version, minor-version) for awd-version-check
		}

		/**
		 * Indicates whether or not a given file extension is supported by the parser.
		 * @param extension The file extension of a potential file to be parsed.
		 * @return Whether or not the given file type is supported.
		 */
		public static supportsType(extension:string):boolean
		{
			extension = extension.toLowerCase();
			return extension == "awd";
		}

		/**
		 * Tests whether a data block can be parsed by the parser.
		 * @param data The data block to potentially be parsed.
		 * @return Whether or not the given data is supported.
		 */
		public static supportsData(data:any):boolean
		{
			return (away.parsers.ParserUtils.toString(data, 3) == 'AWD');
		}

		/**
		 * @inheritDoc
		 */
		public _iResolveDependency(resourceDependency:ResourceDependency):void
		{
			// this will be called when Dependency has finished loading.
			// the Assets waiting for this Bitmap, can be Texture or CubeTexture.
			// if the Bitmap is awaited by a CubeTexture, we need to check if its the last Bitmap of the CubeTexture,
			// so we know if we have to finalize the Asset (CubeTexture) or not.
			if (resourceDependency.assets.length == 1) {
				var isCubeTextureArray:Array<string> = resourceDependency.id.split("#");
				var ressourceID:string = isCubeTextureArray[0];
				var asset:TextureProxyBase;
				var thisBitmapTexture:Texture2DBase;
				var block:AWDBlock;

				if (isCubeTextureArray.length == 1) // Not a cube texture
				{
					asset = <Texture2DBase> resourceDependency.assets[0];
					if (asset) {
						var mat:TriangleMethodMaterial;
						var users:Array<string>;

						block = this._blocks[ resourceDependency.id ];
						block.data = asset; // Store finished asset

						// Reset name of texture to the one defined in the AWD file,
						// as opposed to whatever the image parser came up with.
						asset.resetAssetPath(block.name, null, true);
						block.name = asset.name;
						// Finalize texture asset to dispatch texture event, which was
						// previously suppressed while the dependency was loaded.
						this._pFinalizeAsset(<away.library.IAsset> asset);

						if (this._debug) {
							console.log("Successfully loaded Bitmap for texture");
							console.log("Parsed texture: Name = " + block.name);
						}
					}
				}

				if (isCubeTextureArray.length > 1) // Cube Texture
				{
					thisBitmapTexture = <BitmapTexture> resourceDependency.assets[0];

					var tx:ImageTexture = <ImageTexture> thisBitmapTexture;

					this._cubeTextures[ isCubeTextureArray[1] ] = tx.htmlImageElement; // ?
					this._texture_users[ressourceID].push(1);

					if (this._debug) {
						console.log("Successfully loaded Bitmap " + this._texture_users[ressourceID].length + " / 6 for Cubetexture");
					}
					if (this._texture_users[ressourceID].length == this._cubeTextures.length) {

						var posX:any = this._cubeTextures[0];
						var negX:any = this._cubeTextures[1];
						var posY:any = this._cubeTextures[2];
						var negY:any = this._cubeTextures[3];
						var posZ:any = this._cubeTextures[4];
						var negZ:any = this._cubeTextures[5];

						asset = <TextureProxyBase> new ImageCubeTexture(posX, negX, posY, negY, posZ, negZ);
						block = this._blocks[ressourceID];
						block.data = asset; // Store finished asset

						// Reset name of texture to the one defined in the AWD file,
						// as opposed to whatever the image parser came up with.
						asset.resetAssetPath(block.name, null, true);
						block.name = asset.name;
						// Finalize texture asset to dispatch texture event, which was
						// previously suppressed while the dependency was loaded.
						this._pFinalizeAsset(<away.library.IAsset> asset);
						if (this._debug) {
							console.log("Parsed CubeTexture: Name = " + block.name);
						}
					}
				}

			}
		}

		/**
		 * @inheritDoc
		 */
		public _iResolveDependencyFailure(resourceDependency:ResourceDependency):void
		{
			//not used - if a dependcy fails, the awaiting Texture or CubeTexture will never be finalized, and the default-bitmaps will be used.
			// this means, that if one Bitmap of a CubeTexture fails, the CubeTexture will have the DefaultTexture applied for all six Bitmaps.
		}

		/**
		 * Resolve a dependency name
		 *
		 * @param resourceDependency The dependency to be resolved.
		 */
		public _iResolveDependencyName(resourceDependency:ResourceDependency, asset:away.library.IAsset):string
		{
			var oldName:string = asset.name;

			if (asset) {
				var block:AWDBlock = this._blocks[parseInt(resourceDependency.id)];
				// Reset name of texture to the one defined in the AWD file,
				// as opposed to whatever the image parser came up with.
				asset.resetAssetPath(block.name, null, true);
			}

			var newName:string = asset.name;

			asset.name = oldName;

			return newName;

		}

		/**
		 * @inheritDoc
		 */
		public _pProceedParsing():boolean
		{

			if (!this._startedParsing) {
				this._byteData = this._pGetByteData();//getByteData();
				this._startedParsing = true;
			}

			if (!this._parsed_header) {

				//----------------------------------------------------------------------------
				// LITTLE_ENDIAN - Default for ArrayBuffer / Not implemented in ByteArray
				//----------------------------------------------------------------------------
				//this._byteData.endian = Endian.LITTLE_ENDIAN;
				//----------------------------------------------------------------------------

				//----------------------------------------------------------------------------
				// Parse header and decompress body if needed
				this.parseHeader();

				switch (this._compression) {

					case AWDParser.DEFLATE:
					case AWDParser.LZMA:
						this._pDieWithError('Compressed AWD formats not yet supported');
						break;

					case AWDParser.UNCOMPRESSED:
						this._body = this._byteData;
						break;

					//----------------------------------------------------------------------------
					// Compressed AWD Formats not yet supported
					//----------------------------------------------------------------------------

					/*
					 case AWDParser.DEFLATE:

					 this._body = new ByteArray();
					 this._byteData.readBytes(this._body, 0, this._byteData.getBytesAvailable());
					 this._body.uncompress();

					 break;
					 case AWDParser.LZMA:

					 this._body = new ByteArray();
					 this._byteData.readBytes(this._body, 0, this._byteData.getBytesAvailable());
					 this._body.uncompress(COMPRESSIONMODE_LZMA);

					 break;
					 //*/

				}

				this._parsed_header = true;

				//----------------------------------------------------------------------------
				// LITTLE_ENDIAN - Default for ArrayBuffer / Not implemented in ByteArray
				//----------------------------------------------------------------------------
				//this._body.endian = Endian.LITTLE_ENDIAN;// Should be default
				//----------------------------------------------------------------------------

			}

			if (this._body) {

				while (this._body.getBytesAvailable() > 0 && !this.parsingPaused) //&& this._pHasTime() )
				{
					this.parseNextBlock();

				}

				//----------------------------------------------------------------------------
				// Return complete status
				if (this._body.getBytesAvailable() == 0) {
					this.dispose();
					return  ParserBase.PARSING_DONE;
				} else {
					return  ParserBase.MORE_TO_PARSE;
				}
			} else {

				switch (this._compression) {

					case AWDParser.DEFLATE:
					case AWDParser.LZMA:

						if (this._debug) {
							console.log("(!) AWDParser Error: Compressed AWD formats not yet supported (!)");
						}

						break;

				}
				// Error - most likely _body not set because we do not support compression.
				return  ParserBase.PARSING_DONE;

			}

		}

		public _pStartParsing(frameLimit:number)
		{
			super._pStartParsing(frameLimit);

			//create a content object for Loaders
			this._pContent = new away.containers.DisplayObjectContainer();
		}

		private dispose():void
		{

			for (var c in this._blocks) {

				var b:AWDBlock = <AWDBlock> this._blocks[ c ];
				b.dispose();

			}

		}

		private parseNextBlock():void
		{
			var block:AWDBlock;
			var assetData:away.library.IAsset;
			var isParsed:boolean = false;
			var ns:number;
			var type:number;
			var flags:number;
			var len:number;

			this._cur_block_id = this._body.readUnsignedInt();

			ns = this._body.readUnsignedByte();
			type = this._body.readUnsignedByte();
			flags = this._body.readUnsignedByte();
			len = this._body.readUnsignedInt();

			var blockCompression:boolean = bitFlags.test(flags, bitFlags.FLAG4);
			var blockCompressionLZMA:boolean = bitFlags.test(flags, bitFlags.FLAG5);

			if (this._accuracyOnBlocks) {
				this._accuracyMatrix = bitFlags.test(flags, bitFlags.FLAG1);
				this._accuracyGeo = bitFlags.test(flags, bitFlags.FLAG2);
				this._accuracyProps = bitFlags.test(flags, bitFlags.FLAG3);
				this._geoNrType = AWDParser.FLOAT32;

				if (this._accuracyGeo) {
					this._geoNrType = AWDParser.FLOAT64;
				}

				this._matrixNrType = AWDParser.FLOAT32;

				if (this._accuracyMatrix) {
					this._matrixNrType = AWDParser.FLOAT64;
				}

				this._propsNrType = AWDParser.FLOAT32;

				if (this._accuracyProps) {
					this._propsNrType = AWDParser.FLOAT64;
				}
			}

			var blockEndAll:number = this._body.position + len;

			if (len > this._body.getBytesAvailable()) {
				this._pDieWithError('AWD2 block length is bigger than the bytes that are available!');
				this._body.position += this._body.getBytesAvailable();
				return;
			}
			this._newBlockBytes = new ByteArray();


			this._body.readBytes(this._newBlockBytes, 0, len);

			//----------------------------------------------------------------------------
			// Compressed AWD Formats not yet supported

			if (blockCompression) {
				this._pDieWithError('Compressed AWD formats not yet supported');

				/*
				 if (blockCompressionLZMA)
				 {
				 this._newBlockBytes.uncompress(AWDParser.COMPRESSIONMODE_LZMA);
				 }
				 else
				 {
				 this._newBlockBytes.uncompress();
				 }
				 */

			}

			//----------------------------------------------------------------------------
			// LITTLE_ENDIAN - Default for ArrayBuffer / Not implemented in ByteArray
			//----------------------------------------------------------------------------
			//this._newBlockBytes.endian = Endian.LITTLE_ENDIAN;
			//----------------------------------------------------------------------------

			this._newBlockBytes.position = 0;
			block = new AWDBlock();
			block.len = this._newBlockBytes.position + len;
			block.id = this._cur_block_id;

			var blockEndBlock:number = this._newBlockBytes.position + len;

			if (blockCompression) {
				this._pDieWithError('Compressed AWD formats not yet supported');
				//blockEndBlock   = this._newBlockBytes.position + this._newBlockBytes.length;
				//block.len       = blockEndBlock;
			}

			if (this._debug) {
				console.log("AWDBlock:  ID = " + this._cur_block_id + " | TypeID = " + type + " | Compression = " + blockCompression + " | Matrix-Precision = " + this._accuracyMatrix + " | Geometry-Precision = " + this._accuracyGeo + " | Properties-Precision = " + this._accuracyProps);
			}

			this._blocks[this._cur_block_id] = block;
            if ((this._version[0] == 3) && (this._version[1] == 0)) {
                switch (type) {
                    case 2:// just because i used blockID 2 in first exporter earlier
                    case 131:
                        this.parseShape2D(this._cur_block_id);
                        isParsed = true;
                        break;
                    case 3:// just because i used blockID 3 in first exporter earlier
                    case 132:
                        this.parseShape2DFill(this._cur_block_id);
                        isParsed = true;
                        break;
                    case 4:// just because i used blockID 4 in first exporter earlier
                    case 133:
                        this.parseTimeLine(this._cur_block_id);
                        isParsed = true;
                        break;
                }
            }
			else if ((this._version[0] == 2) && (this._version[1] == 1)) {

				switch (type) {
					case 11:
						this.parsePrimitves(this._cur_block_id);
						isParsed = true;
						break;
					case 31:
						this.parseSkyboxInstance(this._cur_block_id);
						isParsed = true;
						break;
					case 41:
						this.parseLight(this._cur_block_id);
						isParsed = true;
						break;
					case 42:
						this.parseCamera(this._cur_block_id);
						isParsed = true;
						break;

					//  case 43:
					//      parseTextureProjector(_cur_block_id);
					//      isParsed = true;
					//      break;

					case 51:
						this.parseLightPicker(this._cur_block_id);
						isParsed = true;
						break;
					case 81:
						this.parseMaterial_v1(this._cur_block_id);
						isParsed = true;
						break;
					case 83:
						this.parseCubeTexture(this._cur_block_id);
						isParsed = true;
						break;
					case 91:
						this.parseSharedMethodBlock(this._cur_block_id);
						isParsed = true;
						break;
					case 92:
						this.parseShadowMethodBlock(this._cur_block_id);
						isParsed = true;
						break;
					case 111:
						this.parseMeshPoseAnimation(this._cur_block_id, true);
						isParsed = true;
						break;
					case 112:
						this.parseMeshPoseAnimation(this._cur_block_id);
						isParsed = true;
						break;
					case 113:
						this.parseVertexAnimationSet(this._cur_block_id);
						isParsed = true;
						break;
					case 122:
						this.parseAnimatorSet(this._cur_block_id);
						isParsed = true;
						break;
					case 253:
						this.parseCommand(this._cur_block_id);
						isParsed = true;
						break;
				}
				//*/
			}
			//*
			if (isParsed == false) {
				switch (type) {

					case 1:
						this.parseTriangleGeometrieBlock(this._cur_block_id);
						break;
					case 22:
						this.parseContainer(this._cur_block_id);
						break;
					case 23:
						this.parseMeshInstance(this._cur_block_id);
						break;
					case 81:
						this.parseMaterial(this._cur_block_id);
						break;
					case 82:
						this.parseTexture(this._cur_block_id);
						break;
					case 101:
						this.parseSkeleton(this._cur_block_id);
						break;
					case 102:
						this.parseSkeletonPose(this._cur_block_id);
						break;
					case 103:
						this.parseSkeletonAnimation(this._cur_block_id);
						break;
					case 121:
						//this.parseUVAnimation(this._cur_block_id);
						//break;
					case 254:
						this.parseNameSpace(this._cur_block_id);
						break;
					case 255:
						this.parseMetaData(this._cur_block_id);
						break;
					default:
						if (this._debug) {
							console.log("AWDBlock:   Unknown BlockType  (BlockID = " + this._cur_block_id + ") - Skip " + len + " bytes");
						}
						this._newBlockBytes.position += len;
						break;
				}
			}
			//*/

			var msgCnt:number = 0;
			if (this._newBlockBytes.position == blockEndBlock) {
				if (this._debug) {
					if (block.errorMessages) {
						while (msgCnt < block.errorMessages.length) {
							console.log("        (!) Error: " + block.errorMessages[msgCnt] + " (!)");
							msgCnt++;
						}
					}
				}
				if (this._debug) {
					console.log("\n");
				}
			} else {
				if (this._debug) {

					console.log("  (!)(!)(!) Error while reading AWDBlock ID " + this._cur_block_id + " = skip to next block");

					if (block.errorMessages) {
						while (msgCnt < block.errorMessages.length) {
							console.log("        (!) Error: " + block.errorMessages[msgCnt] + " (!)");
							msgCnt++;
						}
					}
				}
			}

			this._body.position = blockEndAll;
			this._newBlockBytes = null;

		}


		//--Parser Blocks---------------------------------------------------------------------------

        //Block ID = 2
        private parseShape2D(blockID:number):void
        {

            var geom:away.base.Geometry = new away.base.Geometry();

            // Read name and sub count
            var name:string = this.parseVarStr();
            var num_subs:number = this._newBlockBytes.readUnsignedShort();

            // Read optional properties
            var props:AWDProperties = this.parseProperties({1:this._geoNrType, 2:this._geoNrType});


            // Loop through sub meshes
            var subs_parsed:number = 0;
            while (subs_parsed < num_subs) {
                var i:number;
                var sm_len:number, sm_end:number;
                var sub_geom:TriangleSubGeometry;
                var w_indices:Array<number>;
                var weights:Array<number>;

                sm_len = this._newBlockBytes.readUnsignedInt();
                sm_end = this._newBlockBytes.position + sm_len;

                // Ignore for now (read uv for subshapes later)"
                var subProps:AWDProperties = this.parseProperties({1:this._geoNrType, 2:this._geoNrType});
                // Loop through data streams
                var indices:Array<number> = new Array<number>();
                var i_idx:number = 0;
                while (this._newBlockBytes.position < sm_end) {
                    var idx:number = 0;
                    var uv_idx:number = 0;
                    var n_idx:number = 0;
                    var t_idx:number = 0;
                    var str_ftype:number, str_type:number, str_len:number, str_end:number;

                    // Type, field type, length
                    str_type = this._newBlockBytes.readUnsignedByte();
                    str_ftype = this._newBlockBytes.readUnsignedByte();
                    str_len = this._newBlockBytes.readUnsignedInt();
                    str_end = this._newBlockBytes.position + str_len;

                    var x:number, y:number, z:number;
                    var type:number;
                    var r:number, g:number, b:number,a:number;
                    var u:number, v:number;

                    if (str_type == 1) {
                        var verts:Array<number> = new Array<number>();
                        var uvs:Array<number> = new Array<number>();
                        var normals:Array<number> = new Array<number>();
                        var tangents:Array<number> = new Array<number>();

                        while (this._newBlockBytes.position < str_end) {

                            x = this.readNumber(this._accuracyGeo);
                            y = this.readNumber(this._accuracyGeo);
                            z = this.readNumber(this._accuracyGeo);
                            //z = subs_parsed;
                            //z = (blockID*0.001) + subs_parsed
                            type = this.readNumber(this._accuracyGeo);
                            this.readNumber(this._accuracyGeo);
                            this.readNumber(this._accuracyGeo);
                            u = this.readNumber(this._accuracyGeo);
                            v = this.readNumber(this._accuracyGeo);
                            r = this.readNumber(this._accuracyGeo);
                            g = this.readNumber(this._accuracyGeo);
                            b = this.readNumber(this._accuracyGeo);
                            a = this.readNumber(this._accuracyGeo);

                            // while this is true, be parse the vertex-data, so it can be rendered as "normal" 3d-geometry
                            if (true) {
                                uvs[idx] = 0.0;
                                normals[idx] = 0.0;
                                verts[idx++] = x;
                                uvs[idx] = 0.0;
                                normals[idx] = 0.0;
                                verts[idx++] = y;
                                normals[idx] = 1.0;
                                verts[idx++] = z;
                            }
                            else{
                                // parse and set-data, so the 3d-geometry contains all data (but is no longer valid for normal 3d-render)
                                // away3d-vertexdata    |   awayJS-shape-data
                                // -----------------------------------------------------------------------
                                // pos.x                |   pos.x
                                // pos.y                |   pos.y
                                // pos.z                |   not used
                                // normal.x             |   curve-type (0:notCurved, 1: convex, 2:concave)
                                // normal.y             |   alpha
                                // normal.z             |   not used
                                // uv.u                 |   curve.u
                                // uv.v                 |   curve.v
                                // tangent.x            |   red
                                // tangent.y            |   green
                                // tangent.z            |   blue
                                verts[idx++] = x;
                                //uv2[idx] = x;
                                verts[idx++] = y;
                                //uv2[idx] = y;
                                verts[idx++] = z;
                                uvs[uv_idx++] = u;
                                uvs[uv_idx++] = v;
                                normals[n_idx++] = type;
                                normals[n_idx++] = a;
                                normals[n_idx++] = 0;
                                // trace("r=" + r + " g=" + g + " b=" + b + " a=" + a);
                                tangents[t_idx++] = r;
                                tangents[t_idx++] = g;
                                tangents[t_idx++] = b;
                            }
                        }
                    }
                    // in future we will only have one stream for all face-indicies
                    // only keeping it split up for the moment,
                    // so we can debug by choosing what kind of triangles are added to subGeo.
                    else if (str_type == 2) {
                        while (this._newBlockBytes.position < str_end) {
                            var thisVal:number= this._newBlockBytes.readUnsignedShort();
                            indices[i_idx++] = thisVal;
                        }

                    } else if (str_type == 3) {

                        while (this._newBlockBytes.position < str_end) {
                            var thisVal:number= this._newBlockBytes.readUnsignedShort();
                            indices[i_idx++] = thisVal;
                        }

                    }else if (str_type == 4) {

                        while (this._newBlockBytes.position < str_end) {
                            var thisVal:number= this._newBlockBytes.readUnsignedShort();
                            indices[i_idx++] = thisVal;
                        }

                    }else if (str_type == 5) {

                        while (this._newBlockBytes.position < str_end) {
                            var thisVal:number= this._newBlockBytes.readUnsignedShort();
                            indices[i_idx++] = thisVal;
                        }

                    }
                    else {
                        this._newBlockBytes.position = str_end;
                    }

                }

                this.parseUserAttributes(); // Ignore sub-mesh attributes for now

                sub_geom = new TriangleSubGeometry(true);
                sub_geom.autoDeriveNormals = false;
                // when rendering as "normal" 3d-geometry, we need to autoDerive tangents
                if(true){
                    sub_geom.autoDeriveTangents = true;
                }
                // if using the geometry as data-holder, we explicit set tangents (as they contain color)
                else{
                    sub_geom.updateVertexTangents(tangents);
                }
                sub_geom.updateIndices(indices);
                sub_geom.updatePositions(verts);
                sub_geom.updateUVs(uvs);
                sub_geom.updateVertexNormals(normals);

                geom.addSubGeometry(sub_geom);

                subs_parsed++;
            }
            this.parseUserAttributes();
            this._pFinalizeAsset(<away.library.IAsset> geom, name);
            this._blocks[blockID].data = geom;

            if (this._debug) {
                console.log("Parsed a TriangleGeometry: Name = " + name + "| Id = " + sub_geom.id);
            }

        }
        //Block ID = 3
        private parseShape2DFill(blockID:number):void {

            var name:string = this.parseVarStr();
            var fill_type:number = this._newBlockBytes.readUnsignedByte();
            var fill_props:AWDProperties = this.parseProperties({1:AWDParser.UINT32});// { 1:UINT32, 6:AWDSTRING }  ); //; , 2:UINT32, 3:UINT32, 5:BOOL } );

            switch (fill_type) {
                // to do, not all properties are set on all primitives

                case 0:
                    console.log("Parsed a Solid FILL: Name = " + name);
                    var material:TriangleMethodMaterial=new TriangleMethodMaterial(fill_props.get(1, 0xcccccc));
                    material.bothSides=true;
                    this._pFinalizeAsset(<away.library.IAsset> material, name);
                    this._blocks[blockID].data = material;
                    //prefab = new away.prefabs.PrimitivePlanePrefab(props.get(101, 100), props.get(102, 100), props.get(301, 1), props.get(302, 1), props.get(701, true), props.get(702, false));
                    break;

                case 1:
                    console.log("Parsed a bitmap FILL: Name = " + name);
                    break;
                case 2:
                    console.log("Parsed a linear gradient FILL: Name = " + name);
                    break;
                case 3:
                    console.log("Parsed a radial gradient FILL: Name = " + name);
                    break;
                default:
                    console.log("Parsed a unknown fillstyle: Name = " + name);
                    break;
            }
            this.parseUserAttributes();
        }
        //Block ID = 4
        private parseTimeLine(blockID:number):void {

            // every Timeline gets parsed into a ObjectContainer3D for now.
            // only the Commands for the first frame are executed for now.
            var timeLineContainer:away.containers.DisplayObjectContainer=new away.containers.DisplayObjectContainer();
            var frame_name:string;
            var name:string = this.parseVarStr();
            var isScene:Boolean = Boolean(this._newBlockBytes.readUnsignedByte());
            var sceneID:number = this._newBlockBytes.readUnsignedByte();
            var num_frames:number = this._newBlockBytes.readUnsignedShort();
            var i:number, k:number;
            // var fill_props:AWDProperties = this.parseProperties({1:AWDParser.UINT32});// { 1:UINT32, 6:AWDSTRING }  ); //; , 2:UINT32, 3:UINT32, 5:BOOL } );

            if (this._debug)
                console.log("Parsed a TIMELINE: Name = " + name + "| isScene = " + isScene + "| sceneID = " + sceneID + "| num_frames = " + num_frames);


            i = 0;
            while (i < num_frames) {
                var traceString:string = "frame = " + i;
                var frame_duration:number = this._newBlockBytes.readUnsignedInt();
                var num_labels:number = this._newBlockBytes.readUnsignedShort();
                k=0;
                while (k < num_labels) {
                    var label_type:number = this._newBlockBytes.readUnsignedByte();
                    var frame_name:string = this.parseVarStr();
                    traceString += "\n     frame_name = " + frame_name + " - label_type = " + label_type;
                    k++;
                }
                var num_commands:number = this._newBlockBytes.readUnsignedShort();
                var commandString:string = "\n      Commands " + num_commands;
                for (k = 0; k < num_commands; k++) {
                    var command_type:number = this._newBlockBytes.readUnsignedShort();
                    if (command_type == 1) {
                        var z:number;
                        var hasRessource:Boolean = Boolean(this._newBlockBytes.readByte());
                        var hasDisplayMatrix:Boolean = Boolean(this._newBlockBytes.readByte());
                        var hasColorMatrix:Boolean = Boolean(this._newBlockBytes.readByte());
                        var hasDepthChange:Boolean = Boolean(this._newBlockBytes.readByte());
                        var hasFilterChange:Boolean = Boolean(this._newBlockBytes.readByte());
                        var hasBlendModeChange:Boolean = Boolean(this._newBlockBytes.readByte());
                        var hasDepthClipChange:Boolean = Boolean(this._newBlockBytes.readByte());
                        var hasVisiblityChange:Boolean = Boolean(this._newBlockBytes.readByte());

                        var objectID:number = this._newBlockBytes.readUnsignedInt();

                        if (hasRessource) {
                            var ressourceID:number = this._newBlockBytes.readUnsignedInt();
                            commandString += "\n      - Add new Ressource = " + ressourceID + " as object_id = " + objectID;
                        }
                        else {
                            commandString += "\n      - Update object_id = " + objectID;
                        }
                        var transformArray:Array<number> = new Array<number>();
                        if (hasDisplayMatrix) {
                            transformArray = new Array<number>();
                            for (z = 0; z < 6; z++) {
                                transformArray.push(this._newBlockBytes.readFloat());
                            }
                            commandString += "\n                transformArray = " + transformArray;
                        }
                        var colorArray:Array<number> = new Array<number>();
                        if (hasColorMatrix) {
                            for (z = 0; z < 20; z++) {
                                colorArray.push(this._newBlockBytes.readFloat());
                            }
                            commandString += "\n                colorArray = " + colorArray;
                        }
                        if (hasDepthChange) {
                            var newDepth:number = this._newBlockBytes.readUnsignedInt();
                            commandString += "\n                Depth = " + newDepth;
                        }
                        if (hasFilterChange) {
                            //TODO:ADD FILTER
                        }
                        if (hasBlendModeChange) {
                            var newBlendMode:number = this._newBlockBytes.readUnsignedByte();
                            commandString += "\n                BlendMode = " + newBlendMode;
                        }
                        if (hasDepthClipChange) {
                            var newClipDepth:number = this._newBlockBytes.readUnsignedInt();
                            commandString += "\n                ClipDepth = " + newClipDepth;
                        }
                        if (hasVisiblityChange) {
                            var newVisibitily:boolean = Boolean(this._newBlockBytes.readByte());
                            commandString += "\n                Visibitily = " + newVisibitily;
                        }

                        var numFills:number = this._newBlockBytes.readUnsignedShort();
                        var s:number = 0;
                        commandString += "\n                number of fills = " + numFills;
                        var fillsIDs:Array<number> = new Array<number>();
                        for (s = 0; s < numFills; s++) {
                            fillsIDs.push(this._newBlockBytes.readUnsignedInt());
                            commandString += "\n                    id of fill = " + fillsIDs[s];
                        }
                        var instanceName:string = this.parseVarStr();
                        commandString += "\n                instanceName = " + instanceName;

                        // if this is a "ADD NEW OBJECT"-command,
                        // we need to lookup the new object by AWD ID.
                        // For now, we only do this for first frame (i==0)
                        if ((hasRessource)&&(i==0)) {
                            // sound is added to timeline with dedicated Command, as it is no display-object (has no matrix etc)

                            // check if a Geometry can be found at the ressourceID (AWD-ID)
                            var returnedArray:Array<any> = this.getAssetByID(ressourceID, [AssetType.GEOMETRY]);
                            if(returnedArray[0]==true) {
                                // create a mesh, and add it to the timeLine-Container
                                // adding the fill-colors as normal ColorMaterials...
                                var newMesh:Mesh = new Mesh(returnedArray[1]);
                                newMesh.name=instanceName;
                                s = 0;
                                while (s < numFills) {
                                    var returnedArray2:Array<any> = this.getAssetByID(fillsIDs[s], [AssetType.MATERIAL]);
                                    if (returnedArray[0]) {
                                        if (returnedArray2[0]) {
                                            if (newMesh.subMeshes.length > s) {
                                                newMesh.subMeshes[s].material = returnedArray2[1];
                                            }
                                        }
                                    }
                                    s++;
                                }
                                timeLineContainer.addChild(newMesh);
                            }
                            else{
                                // no geometry found, so we check for Container (already parsed Timeline)
                                var returnedArray:Array<any> = this.getAssetByID(ressourceID, [AssetType.CONTAINER]);
                                if(returnedArray[0]==true) {
                                    var newContainer:away.containers.DisplayObjectContainer = <away.containers.DisplayObjectContainer>returnedArray[1];
                                    var newContainerClone:away.containers.DisplayObjectContainer =  <away.containers.DisplayObjectContainer>newContainer.clone();
                                    if(newContainerClone){
                                        newContainerClone.name=instanceName;
                                        timeLineContainer.addChild(newContainerClone);
                                    }
                                }
                            }
                        }
                    }
                    else if (command_type == 2) {
                        // Remove Command
                        var objectID:number = this._newBlockBytes.readUnsignedInt();
                        commandString += "\n       - Remove object with ID: " + objectID;
                    }
                    else if (command_type == 3) {
                        // add sound
                        var objectID:number = this._newBlockBytes.readUnsignedInt();
                        var ressourceID:number = this._newBlockBytes.readUnsignedInt();
                        commandString += "\n      - Add new Sound AWD-ID = " + ressourceID.toString() + " as object_id = " + objectID.toString();
                    }
                    else {
                        commandString += "\n       - Unknown Command Type = " + command_type;
                    }
                }
                var frame_code:string = "";
                var length_code:number = this._newBlockBytes.readUnsignedInt();
                if (length_code > 0) {
                    frame_code = this._newBlockBytes.readUTFBytes(length_code);
                    traceString += "\nframe-code = " + frame_code;
                }
                traceString += commandString;
                //trace("length_code = "+length_code+" frame_code = "+frame_code);
                this._newBlockBytes.readUnsignedInt();
                //this.parseUserAttributes(); // Ignore sub-mesh attributes for now
                i++;
                console.log(traceString);

            }

            this._pFinalizeAsset(<away.library.IAsset> timeLineContainer, name);
            this._blocks[blockID].data = timeLineContainer;
            var timeLineProps:AWDProperties = this.parseProperties(null);
            this.parseUserAttributes();
        }

		//Block ID = 1
		private parseTriangleGeometrieBlock(blockID:number):void
		{

			var geom:away.base.Geometry = new away.base.Geometry();

			// Read name and sub count
			var name:string = this.parseVarStr();
			var num_subs:number = this._newBlockBytes.readUnsignedShort();

			// Read optional properties
			var props:AWDProperties = this.parseProperties({1:this._geoNrType, 2:this._geoNrType});
			var geoScaleU:number = props.get(1, 1);
			var geoScaleV:number = props.get(2, 1);

			// Loop through sub meshes
			var subs_parsed:number = 0;
			while (subs_parsed < num_subs) {
				var i:number;
				var sm_len:number, sm_end:number;
				var sub_geom:TriangleSubGeometry;
				var w_indices:Array<number>;
				var weights:Array<number>;

				sm_len = this._newBlockBytes.readUnsignedInt();
				sm_end = this._newBlockBytes.position + sm_len;

				// Ignore for now
				var subProps:AWDProperties = this.parseProperties({1:this._geoNrType, 2:this._geoNrType});
				// Loop through data streams
				while (this._newBlockBytes.position < sm_end) {
					var idx:number = 0;
					var str_ftype:number, str_type:number, str_len:number, str_end:number;

					// Type, field type, length
					str_type = this._newBlockBytes.readUnsignedByte();
					str_ftype = this._newBlockBytes.readUnsignedByte();
					str_len = this._newBlockBytes.readUnsignedInt();
					str_end = this._newBlockBytes.position + str_len;

					var x:number, y:number, z:number;

					if (str_type == 1) {
						var verts:Array<number> = new Array<number>();

						while (this._newBlockBytes.position < str_end) {
							// TODO: Respect stream field type
							x = this.readNumber(this._accuracyGeo);
							y = this.readNumber(this._accuracyGeo);
							z = this.readNumber(this._accuracyGeo);

							verts[idx++] = x;
							verts[idx++] = y;
							verts[idx++] = z;
						}
					} else if (str_type == 2) {
						var indices:Array<number> = new Array<number>();

						while (this._newBlockBytes.position < str_end) {
							// TODO: Respect stream field type
							indices[idx++] = this._newBlockBytes.readUnsignedShort();
						}

					} else if (str_type == 3) {
						var uvs:Array<number> = new Array<number>();
						while (this._newBlockBytes.position < str_end) {
							uvs[idx++] = this.readNumber(this._accuracyGeo);

						}
					} else if (str_type == 4) {

						var normals:Array<number> = new Array<number>();

						while (this._newBlockBytes.position < str_end) {
							normals[idx++] = this.readNumber(this._accuracyGeo);
						}

					} else if (str_type == 6) {
						w_indices = Array<number>();

						while (this._newBlockBytes.position < str_end) {
							w_indices[idx++] = this._newBlockBytes.readUnsignedShort()*3; // TODO: Respect stream field type
						}

					} else if (str_type == 7) {

						weights = new Array<number>();

						while (this._newBlockBytes.position < str_end) {
							weights[idx++] = this.readNumber(this._accuracyGeo);
						}
					} else {
						this._newBlockBytes.position = str_end;
					}

				}

				this.parseUserAttributes(); // Ignore sub-mesh attributes for now

				sub_geom = new TriangleSubGeometry(true);
				if (weights)
					sub_geom.jointsPerVertex = weights.length/(verts.length/3);
				if (normals)
					sub_geom.autoDeriveNormals = false;
				if (uvs)
					sub_geom.autoDeriveUVs = false;
				sub_geom.updateIndices(indices);
				sub_geom.updatePositions(verts);
				sub_geom.updateVertexNormals(normals);
				sub_geom.updateUVs(uvs);
				sub_geom.updateVertexTangents(null);
				sub_geom.updateJointWeights(weights);
				sub_geom.updateJointIndices(w_indices);

				var scaleU:number = subProps.get(1, 1);
				var scaleV:number = subProps.get(2, 1);
				var setSubUVs:boolean = false; //this should remain false atm, because in AwayBuilder the uv is only scaled by the geometry

				if ((geoScaleU != scaleU) || (geoScaleV != scaleV)) {
					setSubUVs = true;
					scaleU = geoScaleU/scaleU;
					scaleV = geoScaleV/scaleV;
				}

				if (setSubUVs)
					sub_geom.scaleUV(scaleU, scaleV);

				geom.addSubGeometry(sub_geom);

				// TODO: Somehow map in-sub to out-sub indices to enable look-up
				// when creating meshes (and their material assignments.)

				subs_parsed++;
			}
			if ((geoScaleU != 1) || (geoScaleV != 1))
				geom.scaleUV(geoScaleU, geoScaleV);
			this.parseUserAttributes();
			this._pFinalizeAsset(<away.library.IAsset> geom, name);
			this._blocks[blockID].data = geom;

			if (this._debug) {
				console.log("Parsed a TriangleGeometry: Name = " + name + "| Id = " + sub_geom.id);
			}

		}

		//Block ID = 11
		private parsePrimitves(blockID:number):void
		{
			var name:string;
			var prefab:away.prefabs.PrefabBase;
			var primType:number;
			var subs_parsed:number;
			var props:AWDProperties;
			var bsm:Matrix3D;

			// Read name and sub count
			name = this.parseVarStr();
			primType = this._newBlockBytes.readUnsignedByte();
			props = this.parseProperties({101:this._geoNrType, 102:this._geoNrType, 103:this._geoNrType, 110:this._geoNrType, 111:this._geoNrType, 301:AWDParser.UINT16, 302:AWDParser.UINT16, 303:AWDParser.UINT16, 701:AWDParser.BOOL, 702:AWDParser.BOOL, 703:AWDParser.BOOL, 704:AWDParser.BOOL});

			var primitiveTypes:Array<string> = ["Unsupported Type-ID", "PrimitivePlanePrefab", "PrimitiveCubePrefab", "PrimitiveSpherePrefab", "PrimitiveCylinderPrefab", "PrimitivesConePrefab", "PrimitivesCapsulePrefab", "PrimitivesTorusPrefab"]

			switch (primType) {
				// to do, not all properties are set on all primitives

				case 1:
					prefab = new away.prefabs.PrimitivePlanePrefab(props.get(101, 100), props.get(102, 100), props.get(301, 1), props.get(302, 1), props.get(701, true), props.get(702, false));
					break;

				case 2:
					prefab = new away.prefabs.PrimitiveCubePrefab(props.get(101, 100), props.get(102, 100), props.get(103, 100), props.get(301, 1), props.get(302, 1), props.get(303, 1), props.get(701, true));
					break;

				case 3:
					prefab = new away.prefabs.PrimitiveSpherePrefab(props.get(101, 50), props.get(301, 16), props.get(302, 12), props.get(701, true));
					break;

				case 4:
					prefab = new away.prefabs.PrimitiveCylinderPrefab(props.get(101, 50), props.get(102, 50), props.get(103, 100), props.get(301, 16), props.get(302, 1), true, true, true); // bool701, bool702, bool703, bool704);
					if (!props.get(701, true))
						(<away.prefabs.PrimitiveCylinderPrefab>prefab).topClosed = false;
					if (!props.get(702, true))
						(<away.prefabs.PrimitiveCylinderPrefab>prefab).bottomClosed = false;
					if (!props.get(703, true))
						(<away.prefabs.PrimitiveCylinderPrefab>prefab).yUp = false;

					break;

				case 5:
					prefab = new away.prefabs.PrimitiveConePrefab(props.get(101, 50), props.get(102, 100), props.get(301, 16), props.get(302, 1), props.get(701, true), props.get(702, true));
					break;

				case 6:
					prefab = new away.prefabs.PrimitiveCapsulePrefab(props.get(101, 50), props.get(102, 100), props.get(301, 16), props.get(302, 15), props.get(701, true));
					break;

				case 7:
					prefab = new away.prefabs.PrimitiveTorusPrefab(props.get(101, 50), props.get(102, 50), props.get(301, 16), props.get(302, 8), props.get(701, true));
					break;

				default:
					prefab = new away.prefabs.PrefabBase();
					console.log("ERROR: UNSUPPORTED PREFAB_TYPE");
					break;
			}

			if ((props.get(110, 1) != 1) || (props.get(111, 1) != 1)) {
				//geom.subGeometries;
				//geom.scaleUV(props.get(110, 1), props.get(111, 1)); //TODO add back scaling to prefabs
			}

			this.parseUserAttributes();
			prefab.name = name;
			this._pFinalizeAsset(prefab, name);
			this._blocks[blockID].data = prefab;

			if (this._debug) {
				if ((primType < 0) || (primType > 7)) {
					primType = 0;
				}
				console.log("Parsed a Primivite: Name = " + name + "| type = " + primitiveTypes[primType]);
			}
		}

		// Block ID = 22
		private parseContainer(blockID:number):void
		{
			var name:string;
			var par_id:number;
			var mtx:Matrix3D;
			var ctr:away.containers.DisplayObjectContainer;
			var parent:away.containers.DisplayObjectContainer;

			par_id = this._newBlockBytes.readUnsignedInt();
			mtx = this.parseMatrix3D();
			name = this.parseVarStr();

			var parentName:string = "Root (TopLevel)";
			ctr = new away.containers.DisplayObjectContainer();
			ctr.transform.matrix3D = mtx;

			var returnedArray:Array<any> = this.getAssetByID(par_id, [AssetType.CONTAINER, AssetType.LIGHT, AssetType.MESH]);

			if (returnedArray[0]) {
				var obj:away.base.DisplayObject = (<away.containers.DisplayObjectContainer> returnedArray[1]).addChild(ctr);
				parentName = (<away.containers.DisplayObjectContainer> returnedArray[1]).name;
			} else if (par_id > 0) {
				this._blocks[ blockID ].addError("Could not find a parent for this ObjectContainer3D");
			} else {
				//add to the content property
				(<away.containers.DisplayObjectContainer> this._pContent).addChild(ctr);
			}

			// in AWD version 2.1 we read the Container properties
			if ((this._version[0] == 2) && (this._version[1] == 1)) {
				var props:AWDProperties = this.parseProperties({1:this._matrixNrType, 2:this._matrixNrType, 3:this._matrixNrType, 4:AWDParser.UINT8});
				ctr.pivot = new away.geom.Vector3D(props.get(1, 0), props.get(2, 0), props.get(3, 0));
			}
			// in other versions we do not read the Container properties
			else {
				this.parseProperties(null);
			}

			// the extraProperties should only be set for AWD2.1-Files, but is read for both versions
			ctr.extra = this.parseUserAttributes();

			this._pFinalizeAsset(<away.library.IAsset> ctr, name);
			this._blocks[blockID].data = ctr;

			if (this._debug) {
				console.log("Parsed a Container: Name = '" + name + "' | Parent-Name = " + parentName);
			}
		}

		// Block ID = 23
		private parseMeshInstance(blockID:number):void
		{
			var num_materials:number;
			var materials_parsed:number;
			var parent:away.containers.DisplayObjectContainer;
			var par_id:number = this._newBlockBytes.readUnsignedInt();
			var mtx:Matrix3D = this.parseMatrix3D();
			var name:string = this.parseVarStr();
			var parentName:string = "Root (TopLevel)";
			var data_id:number = this._newBlockBytes.readUnsignedInt();
			var geom:away.base.Geometry;
			var returnedArrayGeometry:Array<any> = this.getAssetByID(data_id, [AssetType.GEOMETRY])

			if (returnedArrayGeometry[0]) {
				geom = <away.base.Geometry> returnedArrayGeometry[1];
			} else {
				this._blocks[blockID].addError("Could not find a Geometry for this Mesh. A empty Geometry is created!");
				geom = new away.base.Geometry();
			}

			this._blocks[blockID].geoID = data_id;
			var materials:Array<MaterialBase> = new Array<MaterialBase>();
			num_materials = this._newBlockBytes.readUnsignedShort();

			var materialNames:Array<string> = new Array<string>();
			materials_parsed = 0;

			var returnedArrayMaterial:Array<any>;

			while (materials_parsed < num_materials) {
				var mat_id:number;
				mat_id = this._newBlockBytes.readUnsignedInt();
				returnedArrayMaterial = this.getAssetByID(mat_id, [AssetType.MATERIAL])
				if ((!returnedArrayMaterial[0]) && (mat_id > 0)) {
					this._blocks[blockID].addError("Could not find Material Nr " + materials_parsed + " (ID = " + mat_id + " ) for this Mesh");
				}

				var m:MaterialBase = <MaterialBase> returnedArrayMaterial[1];

				materials.push(m);
				materialNames.push(m.name);

				materials_parsed++;
			}

			var mesh:Mesh = new Mesh(geom, null);
			mesh.transform.matrix3D = mtx;

			var returnedArrayParent:Array<any> = this.getAssetByID(par_id, [AssetType.CONTAINER, AssetType.LIGHT, AssetType.MESH])

			if (returnedArrayParent[0]) {
				var objC:away.containers.DisplayObjectContainer = <away.containers.DisplayObjectContainer> returnedArrayParent[1];
				objC.addChild(mesh);
				parentName = objC.name;
			} else if (par_id > 0) {
				this._blocks[blockID].addError("Could not find a parent for this Mesh");
			} else {
				//add to the content property
				(<away.containers.DisplayObjectContainer> this._pContent).addChild(mesh);
			}

			if (materials.length >= 1 && mesh.subMeshes.length == 1) {
				mesh.material = materials[0];
			} else if (materials.length > 1) {
				var i:number;

				// Assign each sub-mesh in the mesh a material from the list. If more sub-meshes
				// than materials, repeat the last material for all remaining sub-meshes.
				for (i = 0; i < mesh.subMeshes.length; i++) {
					mesh.subMeshes[i].material = materials[Math.min(materials.length - 1, i)];
				}
			}
			if ((this._version[0] == 2) && (this._version[1] == 1)) {
				var props:AWDProperties = this.parseProperties({1:this._matrixNrType, 2:this._matrixNrType, 3:this._matrixNrType, 4:AWDParser.UINT8, 5:AWDParser.BOOL});
				mesh.pivot = new away.geom.Vector3D(<number>props.get(1, 0), <number>props.get(2, 0), <number> props.get(3, 0));
				mesh.castsShadows = props.get(5, true);
			} else {
				this.parseProperties(null);
			}

			mesh.extra = this.parseUserAttributes();

			this._pFinalizeAsset(<away.library.IAsset> mesh, name);
			this._blocks[blockID].data = mesh;

			if (this._debug) {
				console.log("Parsed a Mesh: Name = '" + name + "' | Parent-Name = " + parentName + "| Geometry-Name = " + geom.name + " | SubMeshes = " + mesh.subMeshes.length + " | Mat-Names = " + materialNames.toString());
			}
		}


		//Block ID 31
		private parseSkyboxInstance(blockID:number):void
		{
			var name:string = this.parseVarStr();
			var cubeTexAddr:number = this._newBlockBytes.readUnsignedInt();

			var returnedArrayCubeTex:Array<any> = this.getAssetByID(cubeTexAddr, [AssetType.TEXTURE], "CubeTexture");
			if ((!returnedArrayCubeTex[0]) && (cubeTexAddr != 0))
				this._blocks[blockID].addError("Could not find the Cubetexture (ID = " + cubeTexAddr + " ) for this Skybox");
			var asset:away.entities.Skybox = new away.entities.Skybox(new SkyboxMaterial(<ImageCubeTexture> returnedArrayCubeTex[1]));

			this.parseProperties(null)
			asset.extra = this.parseUserAttributes();
			this._pFinalizeAsset(asset, name);
			this._blocks[blockID].data = asset;
			if (this._debug)
				console.log("Parsed a Skybox: Name = '" + name + "' | CubeTexture-Name = " + (<ImageCubeTexture> returnedArrayCubeTex[1]).name);

		}

		//Block ID = 41
		private parseLight(blockID:number):void
		{
			var light:LightBase;
			var newShadowMapper:ShadowMapperBase;

			var par_id:number = this._newBlockBytes.readUnsignedInt();
			var mtx:Matrix3D = this.parseMatrix3D();
			var name:string = this.parseVarStr();
			var lightType:number = this._newBlockBytes.readUnsignedByte();
			var props:AWDProperties = this.parseProperties({1:this._propsNrType, 2:this._propsNrType, 3:AWDParser.COLOR, 4:this._propsNrType, 5:this._propsNrType, 6:AWDParser.BOOL, 7:AWDParser.COLOR, 8:this._propsNrType, 9:AWDParser.UINT8, 10:AWDParser.UINT8, 11:this._propsNrType, 12:AWDParser.UINT16, 21:this._matrixNrType, 22:this._matrixNrType, 23:this._matrixNrType});
			var shadowMapperType:number = props.get(9, 0);
			var parentName:string = "Root (TopLevel)";
			var lightTypes:Array<string> = ["Unsupported LightType", "PointLight", "DirectionalLight"];
			var shadowMapperTypes:Array<string> = ["No ShadowMapper", "DirectionalShadowMapper", "NearDirectionalShadowMapper", "CascadeShadowMapper", "CubeMapShadowMapper"];

			if (lightType == 1) {
				light = new PointLight();

				(<PointLight> light).radius = props.get(1, 90000);
				(<PointLight> light).fallOff = props.get(2, 100000);

				if (shadowMapperType > 0) {
					if (shadowMapperType == 4) {
						newShadowMapper = new CubeMapShadowMapper();
					}
				}

				light.transform.matrix3D = mtx;

			}

			if (lightType == 2) {

				light = new DirectionalLight(props.get(21, 0), props.get(22, -1), props.get(23, 1));

				if (shadowMapperType > 0) {
					if (shadowMapperType == 1) {
						newShadowMapper = new DirectionalShadowMapper();
					}

					//if (shadowMapperType == 2)
					//  newShadowMapper = new NearDirectionalShadowMapper(props.get(11, 0.5));
					//if (shadowMapperType == 3)
					//   newShadowMapper = new CascadeShadowMapper(props.get(12, 3));

				}

			}
			light.color = props.get(3, 0xffffff);
			light.specular = props.get(4, 1.0);
			light.diffuse = props.get(5, 1.0);
			light.ambientColor = props.get(7, 0xffffff);
			light.ambient = props.get(8, 0.0);

			// if a shadowMapper has been created, adjust the depthMapSize if needed, assign to light and set castShadows to true
			if (newShadowMapper) {
				if (newShadowMapper instanceof CubeMapShadowMapper) {
					if (props.get(10, 1) != 1) {
						newShadowMapper.depthMapSize = this._depthSizeDic[props.get(10, 1)];
					}
				} else {
					if (props.get(10, 2) != 2) {
						newShadowMapper.depthMapSize = this._depthSizeDic[props.get(10, 2)];
					}
				}

				light.shadowMapper = newShadowMapper;
				light.castsShadows = true;
			}

			if (par_id != 0) {

				var returnedArrayParent:Array<any> = this.getAssetByID(par_id, [AssetType.CONTAINER, AssetType.LIGHT, AssetType.MESH])

				if (returnedArrayParent[0]) {
					(<away.containers.DisplayObjectContainer> returnedArrayParent[1]).addChild(light);
					parentName = (<away.containers.DisplayObjectContainer> returnedArrayParent[1]).name;
				} else {
					this._blocks[blockID].addError("Could not find a parent for this Light");
				}
			} else {
				//add to the content property
				(<away.containers.DisplayObjectContainer> this._pContent).addChild(light);
			}

			this.parseUserAttributes();

			this._pFinalizeAsset(< away.library.IAsset> light, name);

			this._blocks[blockID].data = light;

			if (this._debug)
				console.log("Parsed a Light: Name = '" + name + "' | Type = " + lightTypes[lightType] + " | Parent-Name = " + parentName + " | ShadowMapper-Type = " + shadowMapperTypes[shadowMapperType]);

		}

		//Block ID = 43
		private parseCamera(blockID:number):void
		{

			var par_id:number = this._newBlockBytes.readUnsignedInt();
			var mtx:Matrix3D = this.parseMatrix3D();
			var name:string = this.parseVarStr();
			var parentName:string = "Root (TopLevel)";
			var projection:away.projections.ProjectionBase;

			this._newBlockBytes.readUnsignedByte(); //set as active camera
			this._newBlockBytes.readShort(); //lengthof lenses - not used yet

			var projectiontype:number = this._newBlockBytes.readShort();
			var props:AWDProperties = this.parseProperties({101:this._propsNrType, 102:this._propsNrType, 103:this._propsNrType, 104:this._propsNrType});

			switch (projectiontype) {
				case 5001:
					projection = new away.projections.PerspectiveProjection(props.get(101, 60));
					break;
				case 5002:
					projection = new away.projections.OrthographicProjection(props.get(101, 500));
					break;
				case 5003:
					projection = new away.projections.OrthographicOffCenterProjection(props.get(101, -400), props.get(102, 400), props.get(103, -300), props.get(104, 300));
					break;
				default:
					console.log("unsupportedLenstype");
					return;
			}

			var camera:away.entities.Camera = new away.entities.Camera(projection);
			camera.transform.matrix3D = mtx;

			var returnedArrayParent:Array<any> = this.getAssetByID(par_id, [AssetType.CONTAINER, AssetType.LIGHT, AssetType.MESH])

			if (returnedArrayParent[0]) {

				var objC:away.containers.DisplayObjectContainer = <away.containers.DisplayObjectContainer> returnedArrayParent[1];
				objC.addChild(camera);

				parentName = objC.name;

			} else if (par_id > 0) {
				this._blocks[blockID].addError("Could not find a parent for this Camera");
			} else {
				//add to the content property
				(<away.containers.DisplayObjectContainer> this._pContent).addChild(camera);
			}

			camera.name = name;
			props = this.parseProperties({1:this._matrixNrType, 2:this._matrixNrType, 3:this._matrixNrType, 4:AWDParser.UINT8});
			camera.pivot = new away.geom.Vector3D(props.get(1, 0), props.get(2, 0), props.get(3, 0));
			camera.extra = this.parseUserAttributes();

			this._pFinalizeAsset(camera, name);

			this._blocks[blockID].data = camera

			if (this._debug) {
				console.log("Parsed a Camera: Name = '" + name + "' | Projectiontype = " + projection + " | Parent-Name = " + parentName);
			}

		}

		//Block ID = 51
		private parseLightPicker(blockID:number):void
		{
			var name:string = this.parseVarStr();
			var numLights:number = this._newBlockBytes.readUnsignedShort();
			var lightsArray:Array<LightBase> = new Array<LightBase>();
			var k:number = 0;
			var lightID:number = 0;

			var returnedArrayLight:Array<any>;
			var lightsArrayNames:Array<string> = new Array<string>();

			for (k = 0; k < numLights; k++) {
				lightID = this._newBlockBytes.readUnsignedInt();
				returnedArrayLight = this.getAssetByID(lightID, [AssetType.LIGHT])

				if (returnedArrayLight[0]) {
					lightsArray.push(<LightBase> returnedArrayLight[1]);
					lightsArrayNames.push(( <LightBase> returnedArrayLight[1]).name);

				} else {
					this._blocks[blockID].addError("Could not find a Light Nr " + k + " (ID = " + lightID + " ) for this LightPicker");
				}
			}

			if (lightsArray.length == 0) {
				this._blocks[blockID].addError("Could not create this LightPicker, cause no Light was found.");
				this.parseUserAttributes();
				return; //return without any more parsing for this block
			}

			var lightPick:LightPickerBase = new StaticLightPicker(lightsArray);
			lightPick.name = name;

			this.parseUserAttributes();
			this._pFinalizeAsset(<away.library.IAsset> lightPick, name);

			this._blocks[blockID].data = lightPick
			if (this._debug) {
				console.log("Parsed a StaticLightPicker: Name = '" + name + "' | Texture-Name = " + lightsArrayNames.toString());
			}
		}

		//Block ID = 81
		private parseMaterial(blockID:number):void
		{
			// TODO: not used
			////blockLength = block.len;
			var name:string;
			var type:number;
			var props:AWDProperties;
			var mat:TriangleMethodMaterial;
			var attributes:Object;
			var finalize:boolean;
			var num_methods:number;
			var methods_parsed:number;
			var returnedArray:Array<any>;

			name = this.parseVarStr();
			type = this._newBlockBytes.readUnsignedByte();
			num_methods = this._newBlockBytes.readUnsignedByte();

			// Read material numerical properties
			// (1=color, 2=bitmap url, 10=alpha, 11=alpha_blending, 12=alpha_threshold, 13=repeat)
			props = this.parseProperties({ 1:AWDParser.INT32, 2:AWDParser.BADDR, 10:this._propsNrType, 11:AWDParser.BOOL, 12:this._propsNrType, 13:AWDParser.BOOL});

			methods_parsed = 0;
			while (methods_parsed < num_methods) {
				var method_type:number;

				method_type = this._newBlockBytes.readUnsignedShort();
				this.parseProperties(null);
				this.parseUserAttributes();
				methods_parsed += 1;
			}
			var debugString:string = "";
			attributes = this.parseUserAttributes();
			if (type === 1) { // Color material
				debugString += "Parsed a ColorMaterial(SinglePass): Name = '" + name + "' | ";
				var color:number;
				color = props.get(1, 0xffffff);
				if (this.materialMode < 2) {
					mat = new TriangleMethodMaterial(color, props.get(10, 1.0));
				} else {
					mat = new TriangleMethodMaterial(color);
					mat.materialMode = TriangleMaterialMode.MULTI_PASS;
				}
			} else if (type === 2) {
				var tex_addr:number = props.get(2, 0);

				returnedArray = this.getAssetByID(tex_addr, [AssetType.TEXTURE]);

				if ((!returnedArray[0]) && (tex_addr > 0))
					this._blocks[blockID].addError("Could not find the DiffsueTexture (ID = " + tex_addr + " ) for this Material");

				mat = new TriangleMethodMaterial(<Texture2DBase> returnedArray[1]);

				if (this.materialMode < 2) {
					mat.alphaBlending = props.get(11, false);
					mat.alpha = props.get(10, 1.0);
					debugString += "Parsed a TriangleMethodMaterial(SinglePass): Name = '" + name + "' | Texture-Name = " + mat.name;
				} else {
					mat.materialMode = TriangleMaterialMode.MULTI_PASS;
					debugString += "Parsed a TriangleMethodMaterial(MultiPass): Name = '" + name + "' | Texture-Name = " + mat.name;
				}
			}

			mat.extra = attributes;
			mat.alphaThreshold = props.get(12, 0.0);
			mat.repeat = props.get(13, false);
			this._pFinalizeAsset(<away.library.IAsset> mat, name);
			this._blocks[blockID].data = mat;

			if (this._debug) {
				console.log(debugString);

			}
		}

		// Block ID = 81 AWD2.1
		private parseMaterial_v1(blockID:number):void
		{
			var mat:TriangleMethodMaterial;
			var normalTexture:Texture2DBase;
			var specTexture:Texture2DBase;
			var returnedArray:Array<any>;

			var name:string = this.parseVarStr();
			var type:number = this._newBlockBytes.readUnsignedByte();
			var num_methods:number = this._newBlockBytes.readUnsignedByte();
			var props:AWDProperties = this.parseProperties({1:AWDParser.UINT32, 2:AWDParser.BADDR, 3:AWDParser.BADDR, 4:AWDParser.UINT8, 5:AWDParser.BOOL, 6:AWDParser.BOOL, 7:AWDParser.BOOL, 8:AWDParser.BOOL, 9:AWDParser.UINT8, 10:this._propsNrType, 11:AWDParser.BOOL, 12:this._propsNrType, 13:AWDParser.BOOL, 15:this._propsNrType, 16:AWDParser.UINT32, 17:AWDParser.BADDR, 18:this._propsNrType, 19:this._propsNrType, 20:AWDParser.UINT32, 21:AWDParser.BADDR, 22:AWDParser.BADDR});
			var spezialType:number = props.get(4, 0);
			var debugString:string = "";

			if (spezialType >= 2) {//this is no supported material
				this._blocks[blockID].addError("Material-spezialType '" + spezialType + "' is not supported, can only be 0:singlePass, 1:MultiPass !");
				return;
			}

			if (this.materialMode == 1)
				spezialType = 0;
			else if (this.materialMode == 2)
				spezialType = 1;

			if (spezialType < 2) {//this is SinglePass or MultiPass

				if (type == 1) {// Color material
					var color:number = props.get(1, 0xcccccc);//TODO temporarily swapped so that diffuse color goes to ambient

					if (spezialType == 1) {//	MultiPassMaterial
						mat = new TriangleMethodMaterial(color);
						mat.materialMode = TriangleMaterialMode.MULTI_PASS;
						debugString += "Parsed a ColorMaterial(MultiPass): Name = '" + name + "' | ";

					} else { //	SinglePassMaterial
						mat = new TriangleMethodMaterial(color, props.get(10, 1.0));
						mat.alphaBlending = props.get(11, false);
						debugString += "Parsed a ColorMaterial(SinglePass): Name = '" + name + "' | ";
					}

				} else if (type == 2) {// texture material
					var tex_addr:number = props.get(2, 0);//TODO temporarily swapped so that diffuse texture goes to ambient
					returnedArray = this.getAssetByID(tex_addr, [AssetType.TEXTURE]);

					if ((!returnedArray[0]) && (tex_addr > 0))
						this._blocks[blockID].addError("Could not find the AmbientTexture (ID = " + tex_addr + " ) for this TriangleMethodMaterial");

					var texture:Texture2DBase = returnedArray[1];

					mat = new TriangleMethodMaterial(texture);

					if (spezialType == 1) {// MultiPassMaterial
						mat.materialMode = TriangleMaterialMode.MULTI_PASS;

						debugString += "Parsed a TriangleMethodMaterial(MultiPass): Name = '" + name + "' | Texture-Name = " + texture.name;
					} else {//	SinglePassMaterial
						mat.alpha = props.get(10, 1.0);
						mat.alphaBlending = props.get(11, false);

						debugString += "Parsed a TriangleMethodMaterial(SinglePass): Name = '" + name + "' | Texture-Name = " + texture.name;
					}
				}

				var diffuseTexture:Texture2DBase;
				var diffuseTex_addr:number = props.get(17, 0);

				returnedArray = this.getAssetByID(diffuseTex_addr, [AssetType.TEXTURE]);

				if ((!returnedArray[0]) && (diffuseTex_addr != 0)) {
					this._blocks[blockID].addError("Could not find the DiffuseTexture (ID = " + diffuseTex_addr + " ) for this TriangleMethodMaterial");
				}

				if (returnedArray[0])
					diffuseTexture = returnedArray[1];

				if (diffuseTexture) {
					mat.diffuseTexture = diffuseTexture;
					debugString += " | DiffuseTexture-Name = " + diffuseTexture.name;
				}

				var normalTex_addr:number = props.get(3, 0);

				returnedArray = this.getAssetByID(normalTex_addr, [AssetType.TEXTURE]);

				if ((!returnedArray[0]) && (normalTex_addr != 0)) {
					this._blocks[blockID].addError("Could not find the NormalTexture (ID = " + normalTex_addr + " ) for this TriangleMethodMaterial");
				}

				if (returnedArray[0]) {
					normalTexture = returnedArray[1];
					debugString += " | NormalTexture-Name = " + normalTexture.name;
				}

				var specTex_addr:number = props.get(21, 0);
				returnedArray = this.getAssetByID(specTex_addr, [AssetType.TEXTURE]);

				if ((!returnedArray[0]) && (specTex_addr != 0)) {
					this._blocks[blockID].addError("Could not find the SpecularTexture (ID = " + specTex_addr + " ) for this TriangleMethodMaterial");
				}
				if (returnedArray[0]) {
					specTexture = returnedArray[1];
					debugString += " | SpecularTexture-Name = " + specTexture.name;
				}

				var lightPickerAddr:number = props.get(22, 0);
				returnedArray = this.getAssetByID(lightPickerAddr, [AssetType.LIGHT_PICKER])

				if ((!returnedArray[0]) && (lightPickerAddr)) {
					this._blocks[blockID].addError("Could not find the LightPicker (ID = " + lightPickerAddr + " ) for this TriangleMethodMaterial");
				} else {
					mat.lightPicker = <LightPickerBase> returnedArray[1];
					//debugString+=" | Lightpicker-Name = "+LightPickerBase(returnedArray[1]).name;
				}

				mat.smooth = props.get(5, true);
				mat.mipmap = props.get(6, true);
				mat.bothSides = props.get(7, false);
				mat.alphaPremultiplied = props.get(8, false);
				mat.blendMode = this.blendModeDic[props.get(9, 0)];
				mat.repeat = props.get(13, false);

				if (normalTexture)
					mat.normalMap = normalTexture;

				if (specTexture)
					mat.specularMap = specTexture;

				mat.alphaThreshold = props.get(12, 0.0);
				mat.ambient = props.get(15, 1.0);
				mat.diffuseColor = props.get(16, 0xffffff);
				mat.specular = props.get(18, 1.0);
				mat.gloss = props.get(19, 50);
				mat.specularColor = props.get(20, 0xffffff);

				var methods_parsed:number = 0;
				var targetID:number;

				while (methods_parsed < num_methods) {
					var method_type:number;
					method_type = this._newBlockBytes.readUnsignedShort();

					props = this.parseProperties({1:AWDParser.BADDR, 2:AWDParser.BADDR, 3:AWDParser.BADDR, 101:this._propsNrType, 102:this._propsNrType, 103:this._propsNrType, 201:AWDParser.UINT32, 202:AWDParser.UINT32, 301:AWDParser.UINT16, 302:AWDParser.UINT16, 401:AWDParser.UINT8, 402:AWDParser.UINT8, 601:AWDParser.COLOR, 602:AWDParser.COLOR, 701:AWDParser.BOOL, 702:AWDParser.BOOL, 801:AWDParser.MTX4x4});

					switch (method_type) {
						case 999: //wrapper-Methods that will load a previous parsed EffektMethod returned

							targetID = props.get(1, 0);
							returnedArray = this.getAssetByID(targetID, [AssetType.EFFECTS_METHOD]);

							if (!returnedArray[0]) {
								this._blocks[blockID].addError("Could not find the EffectMethod (ID = " + targetID + " ) for this Material");
							} else {
								mat.addEffectMethod(returnedArray[1]);

								debugString += " | EffectMethod-Name = " + (<EffectMethodBase> returnedArray[1]).name;
							}

							break;

						case 998: //wrapper-Methods that will load a previous parsed ShadowMapMethod

							targetID = props.get(1, 0);
							returnedArray = this.getAssetByID(targetID, [AssetType.SHADOW_MAP_METHOD]);

							if (!returnedArray[0]) {
								this._blocks[blockID].addError("Could not find the ShadowMethod (ID = " + targetID + " ) for this Material");
							} else {
								mat.shadowMethod = returnedArray[1];
								debugString += " | ShadowMethod-Name = " + (<ShadowMethodBase> returnedArray[1]).name;
							}

							break;

						case 1: //EnvMapAmbientMethod
							targetID = props.get(1, 0);
							returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE], "CubeTexture");
							if (!returnedArray[0])
								this._blocks[blockID].addError("Could not find the EnvMap (ID = " + targetID + " ) for this EnvMapAmbientMethodMaterial");
							mat.ambientMethod = new AmbientEnvMapMethod(returnedArray[1]);
							debugString += " | AmbientEnvMapMethod | EnvMap-Name =" + (<CubeTextureBase> returnedArray[1]).name;
							break;

						case 51: //DepthDiffuseMethod
							mat.diffuseMethod = new DiffuseDepthMethod();
							debugString += " | DiffuseDepthMethod";
							break;
						case 52: //GradientDiffuseMethod
							targetID = props.get(1, 0);
							returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE]);
							if (!returnedArray[0])
								this._blocks[blockID].addError("Could not find the GradientDiffuseTexture (ID = " + targetID + " ) for this GradientDiffuseMethod");
							mat.diffuseMethod = new DiffuseGradientMethod(returnedArray[1]);
							debugString += " | DiffuseGradientMethod | GradientDiffuseTexture-Name =" + (<Texture2DBase> returnedArray[1]).name;
							break;
						case 53: //WrapDiffuseMethod
							mat.diffuseMethod = new DiffuseWrapMethod(props.get(101, 5));
							debugString += " | DiffuseWrapMethod";
							break;
						case 54: //LightMapDiffuseMethod
							targetID = props.get(1, 0);
							returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE]);
							if (!returnedArray[0])
								this._blocks[blockID].addError("Could not find the LightMap (ID = " + targetID + " ) for this LightMapDiffuseMethod");
							mat.diffuseMethod = new DiffuseLightMapMethod(returnedArray[1], this.blendModeDic[props.get(401, 10)], false, mat.diffuseMethod);
							debugString += " | DiffuseLightMapMethod | LightMapTexture-Name =" + (<Texture2DBase> returnedArray[1]).name;
							break;
						case 55: //CelDiffuseMethod
							mat.diffuseMethod = new DiffuseCelMethod(props.get(401, 3), mat.diffuseMethod);
							(<DiffuseCelMethod> mat.diffuseMethod).smoothness = props.get(101, 0.1);
							debugString += " | DiffuseCelMethod";
							break;
						case 56: //SubSurfaceScatteringMethod
//							mat.diffuseMethod = new DiffuseSubSurfaceMethod(); //depthMapSize and depthMapOffset ?
//							(<DiffuseSubSurfaceMethod> mat.diffuseMethod).scattering = props.get(101, 0.2);
//							(<DiffuseSubSurfaceMethod> mat.diffuseMethod).translucency = props.get(102, 1);
//							(<DiffuseSubSurfaceMethod> mat.diffuseMethod).scatterColor = props.get(601, 0xffffff);
//							debugString += " | DiffuseSubSurfaceMethod";
							break;

						case 101: //AnisotropicSpecularMethod
							mat.specularMethod = new SpecularAnisotropicMethod();
							debugString += " | SpecularAnisotropicMethod";
							break;
						case 102: //SpecularPhongMethod
							mat.specularMethod = new SpecularPhongMethod();
							debugString += " | SpecularPhongMethod";
							break;
						case 103: //CellSpecularMethod
							mat.specularMethod = new SpecularCelMethod(props.get(101, 0.5), mat.specularMethod);
							(<SpecularCelMethod> mat.specularMethod).smoothness = props.get(102, 0.1);
							debugString += " | SpecularCelMethod";
							break;
						case 104: //SpecularFresnelMethod
							mat.specularMethod = new SpecularFresnelMethod(props.get(701, true), mat.specularMethod);
							(<SpecularFresnelMethod> mat.specularMethod).fresnelPower = props.get(101, 5);
							(<SpecularFresnelMethod> mat.specularMethod).normalReflectance = props.get(102, 0.1);
							debugString += " | SpecularFresnelMethod";
							break;
						case 151://HeightMapNormalMethod - thios is not implemented for now, but might appear later
							break;
						case 152: //SimpleWaterNormalMethod
							targetID = props.get(1, 0);
							returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE]);
							if (!returnedArray[0])
								this._blocks[blockID].addError("Could not find the SecoundNormalMap (ID = " + targetID + " ) for this SimpleWaterNormalMethod");
							if (!mat.normalMap)
								this._blocks[blockID].addError("Could not find a normal Map on this Material to use with this SimpleWaterNormalMethod");

							mat.normalMap = returnedArray[1];
							mat.normalMethod = new NormalSimpleWaterMethod(mat.normalMap, returnedArray[1]);
							debugString += " | NormalSimpleWaterMethod | Second-NormalTexture-Name = " + (<Texture2DBase> returnedArray[1]).name;
							break;
					}
					this.parseUserAttributes();
					methods_parsed += 1;
				}
			}
			mat.extra = this.parseUserAttributes();
			this._pFinalizeAsset(<away.library.IAsset> mat, name);

			this._blocks[blockID].data = mat;
			if (this._debug) {
				console.log(debugString);
			}
		}

		//Block ID = 82
		private parseTexture(blockID:number):void
		{

			var asset:Texture2DBase;

			this._blocks[blockID].name = this.parseVarStr();

			var type:number = this._newBlockBytes.readUnsignedByte();
			var data_len:number;

			this._texture_users[this._cur_block_id.toString()] = [];

			// External
			if (type == 0) {
				data_len = this._newBlockBytes.readUnsignedInt();
				var url:string;
				url = this._newBlockBytes.readUTFBytes(data_len);
				this._pAddDependency(this._cur_block_id.toString(), new away.net.URLRequest(url), false, null, true);

			} else {
				data_len = this._newBlockBytes.readUnsignedInt();

				var data:ByteArray;
				data = new ByteArray();
				this._newBlockBytes.readBytes(data, 0, data_len);

				//
				// AWDParser - Fix for FireFox Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=715075 .
				//
				// Converting data to image here instead of parser - fix FireFox bug where image width / height is 0 when created from data
				// This gives the browser time to initialise image width / height.

				this._pAddDependency(this._cur_block_id.toString(), null, false, ParserUtils.byteArrayToImage(data), true);
				//this._pAddDependency(this._cur_block_id.toString(), null, false, data, true);

			}

			// Ignore for now
			this.parseProperties(null);
			this._blocks[blockID].extras = this.parseUserAttributes();
			this._pPauseAndRetrieveDependencies();
			this._blocks[blockID].data = asset;

			if (this._debug) {
				var textureStylesNames:Array<string> = ["external", "embed"]
				console.log("Start parsing a " + textureStylesNames[type] + " Bitmap for Texture");
			}

		}

		//Block ID = 83
		private parseCubeTexture(blockID:number):void
		{
			//blockLength = block.len;
			var data_len:number;
			var asset:CubeTextureBase;
			var i:number;

			this._cubeTextures = new Array<any>();
			this._texture_users[ this._cur_block_id.toString() ] = [];

			var type:number = this._newBlockBytes.readUnsignedByte();

			this._blocks[blockID].name = this.parseVarStr();

			for (i = 0; i < 6; i++) {
				this._texture_users[this._cur_block_id.toString()] = [];
				this._cubeTextures.push(null);

				// External
				if (type == 0) {
					data_len = this._newBlockBytes.readUnsignedInt();
					var url:string;
					url = this._newBlockBytes.readUTFBytes(data_len);

					this._pAddDependency(this._cur_block_id.toString() + "#" + i, new away.net.URLRequest(url), false, null, true);
				} else {

					data_len = this._newBlockBytes.readUnsignedInt();
					var data:ByteArray;
					data = new ByteArray();

					this._newBlockBytes.readBytes(data, 0, data_len);

					this._pAddDependency(this._cur_block_id.toString() + "#" + i, null, false, ParserUtils.byteArrayToImage(data), true);
				}
			}

			// Ignore for now
			this.parseProperties(null);
			this._blocks[blockID].extras = this.parseUserAttributes();
			this._pPauseAndRetrieveDependencies();
			this._blocks[blockID].data = asset;

			if (this._debug) {
				var textureStylesNames:Array<string> = ["external", "embed"]
				console.log("Start parsing 6 " + textureStylesNames[type] + " Bitmaps for CubeTexture");
			}
		}

		//Block ID = 91
		private parseSharedMethodBlock(blockID:number):void
		{
			var asset:EffectMethodBase;

			this._blocks[blockID].name = this.parseVarStr();
			asset = this.parseSharedMethodList(blockID);
			this.parseUserAttributes();
			this._blocks[blockID].data = asset;
			this._pFinalizeAsset(<away.library.IAsset> asset, this._blocks[blockID].name);
			this._blocks[blockID].data = asset;

			if (this._debug) {
				console.log("Parsed a EffectMethod: Name = " + asset.name + " Type = " + asset);
			}
		}

		//Block ID = 92
		private parseShadowMethodBlock(blockID:number):void
		{
			var type:number;
			var data_len:number;
			var asset:ShadowMethodBase;
			var shadowLightID:number;
			this._blocks[blockID].name = this.parseVarStr();

			shadowLightID = this._newBlockBytes.readUnsignedInt();
			var returnedArray:Array<any> = this.getAssetByID(shadowLightID, [AssetType.LIGHT]);

			if (!returnedArray[0]) {
				this._blocks[blockID].addError("Could not find the TargetLight (ID = " + shadowLightID + " ) for this ShadowMethod - ShadowMethod not created");
				return;
			}

			asset = this.parseShadowMethodList(<LightBase> returnedArray[1], blockID);

			if (!asset)
				return;

			this.parseUserAttributes(); // Ignore for now
			this._pFinalizeAsset(<away.library.IAsset> asset, this._blocks[blockID].name);
			this._blocks[blockID].data = asset;

			if (this._debug) {
				console.log("Parsed a ShadowMapMethodMethod: Name = " + asset.name + " | Type = " + asset + " | Light-Name = ", ( <LightBase> returnedArray[1] ).name);
			}
		}


		//Block ID = 253
		private parseCommand(blockID:number):void
		{
			var hasBlocks:boolean = ( this._newBlockBytes.readUnsignedByte() == 1 );
			var par_id:number = this._newBlockBytes.readUnsignedInt();
			var mtx:Matrix3D = this.parseMatrix3D();
			var name:string = this.parseVarStr();

			var parentObject:away.containers.DisplayObjectContainer;
			var targetObject:away.containers.DisplayObjectContainer;

			var returnedArray:Array<any> = this.getAssetByID(par_id, [AssetType.CONTAINER, AssetType.LIGHT, AssetType.MESH]);

			if (returnedArray[0]) {
				parentObject = <away.containers.DisplayObjectContainer> returnedArray[1];
			}

			var numCommands:number = this._newBlockBytes.readShort();
			var typeCommand:number = this._newBlockBytes.readShort();

			var props:AWDProperties = this.parseProperties({1:AWDParser.BADDR});

			switch (typeCommand) {
				case 1:

					var targetID:number = props.get(1, 0);
					var returnedArrayTarget:Array<any> = this.getAssetByID(targetID, [AssetType.LIGHT, AssetType.TEXTURE_PROJECTOR]); //for no only light is requested!!!!

					if ((!returnedArrayTarget[0]) && (targetID != 0)) {
						this._blocks[blockID].addError("Could not find the light (ID = " + targetID + " ( for this CommandBock!");
						return;
					}

					targetObject = returnedArrayTarget[1];

					if (parentObject) {
						parentObject.addChild(targetObject);
					}

					targetObject.transform.matrix3D = mtx;

					break;
			}

			if (targetObject) {
				props = this.parseProperties({1:this._matrixNrType, 2:this._matrixNrType, 3:this._matrixNrType, 4:AWDParser.UINT8});

				targetObject.pivot = new away.geom.Vector3D(props.get(1, 0), props.get(2, 0), props.get(3, 0));
				targetObject.extra = this.parseUserAttributes();

			}
			this._blocks[blockID].data = targetObject

			if (this._debug) {
				console.log("Parsed a CommandBlock: Name = '" + name);
			}

		}

		//blockID 255
		private parseMetaData(blockID:number):void
		{
			var props:AWDProperties = this.parseProperties({1:AWDParser.UINT32, 2:AWDParser.AWDSTRING, 3:AWDParser.AWDSTRING, 4:AWDParser.AWDSTRING, 5:AWDParser.AWDSTRING});

			if (this._debug) {
				console.log("Parsed a MetaDataBlock: TimeStamp         = " + props.get(1, 0));
				console.log("                        EncoderName       = " + props.get(2, "unknown"));
				console.log("                        EncoderVersion    = " + props.get(3, "unknown"));
				console.log("                        GeneratorName     = " + props.get(4, "unknown"));
				console.log("                        GeneratorVersion  = " + props.get(5, "unknown"));
			}
		}

		//blockID 254
		private parseNameSpace(blockID:number):void
		{
			var id:number = this._newBlockBytes.readUnsignedByte();
			var nameSpaceString:string = this.parseVarStr();
			if (this._debug)
				console.log("Parsed a NameSpaceBlock: ID = " + id + " | String = " + nameSpaceString);
		}

		//--Parser UTILS---------------------------------------------------------------------------

		// this functions reads and creates a ShadowMethodMethod
		private parseShadowMethodList(light:LightBase, blockID:number):ShadowMethodBase
		{

			var methodType:number = this._newBlockBytes.readUnsignedShort();
			var shadowMethod:ShadowMethodBase;
			var props:AWDProperties = this.parseProperties({1:AWDParser.BADDR, 2:AWDParser.BADDR, 3:AWDParser.BADDR, 101:this._propsNrType, 102:this._propsNrType, 103:this._propsNrType, 201:AWDParser.UINT32, 202:AWDParser.UINT32, 301:AWDParser.UINT16, 302:AWDParser.UINT16, 401:AWDParser.UINT8, 402:AWDParser.UINT8, 601:AWDParser.COLOR, 602:AWDParser.COLOR, 701:AWDParser.BOOL, 702:AWDParser.BOOL, 801:AWDParser.MTX4x4});

			var targetID:number;
			var returnedArray:Array<any>
			switch (methodType) {
				//				case 1001: //CascadeShadowMapMethod
				//					targetID = props.get(1, 0);
				//					returnedArray = getAssetByID(targetID, [AssetType.SHADOW_MAP_METHOD]);
				//					if (!returnedArray[0]) {
				//						_blocks[blockID].addError("Could not find the ShadowBaseMethod (ID = " + targetID + " ) for this CascadeShadowMapMethod - ShadowMethod not created");
				//						return shadowMethod;
				//					}
				//					shadowMethod = new CascadeShadowMapMethod(returnedArray[1]);
				//					break;
				case 1002: //ShadowNearMethod
					targetID = props.get(1, 0);
					returnedArray = this.getAssetByID(targetID, [AssetType.SHADOW_MAP_METHOD]);
					if (!returnedArray[0]) {
						this._blocks[blockID].addError("Could not find the ShadowBaseMethod (ID = " + targetID + " ) for this ShadowNearMethod - ShadowMethod not created");
						return shadowMethod;
					}
					shadowMethod = new ShadowNearMethod(<ShadowMethodBase> returnedArray[1]);
					break;
				case 1101: //ShadowFilteredMethod

					shadowMethod = new ShadowFilteredMethod(<DirectionalLight> light);
					(<ShadowFilteredMethod> shadowMethod).alpha = props.get(101, 1);
					(<ShadowFilteredMethod> shadowMethod).epsilon = props.get(102, 0.002);
					break;

				case 1102: //ShadowDitheredMethod


					shadowMethod = new ShadowDitheredMethod(<DirectionalLight> light, <number> props.get(201, 5));
					(<ShadowDitheredMethod> shadowMethod).alpha = props.get(101, 1);
					(<ShadowDitheredMethod> shadowMethod).epsilon = props.get(102, 0.002);
					(<ShadowDitheredMethod> shadowMethod).range = props.get(103, 1);

					break;
				case 1103: //ShadowSoftMethod

					shadowMethod = new ShadowSoftMethod(<DirectionalLight> light, <number> props.get(201, 5));
					(<ShadowSoftMethod> shadowMethod).alpha = props.get(101, 1);
					(<ShadowSoftMethod> shadowMethod).epsilon = props.get(102, 0.002);
					(<ShadowSoftMethod> shadowMethod).range = props.get(103, 1);

					break;
				case 1104: //ShadowHardMethod
					shadowMethod = new ShadowHardMethod(light);
					(<ShadowHardMethod> shadowMethod).alpha = props.get(101, 1);
					(<ShadowHardMethod> shadowMethod).epsilon = props.get(102, 0.002);
					break;

			}
			this.parseUserAttributes();
			return shadowMethod;
		}

		//Block ID 101
		private parseSkeleton(blockID:number /*uint*/):void
		{
			var name:string = this.parseVarStr();
			var num_joints:number /*uint*/ = this._newBlockBytes.readUnsignedShort();
			var skeleton:Skeleton = new Skeleton();
			this.parseProperties(null); // Discard properties for now		
	
			var joints_parsed:number /*uint*/ = 0;
			while (joints_parsed < num_joints) {
				var joint:SkeletonJoint;
				var ibp:Matrix3D;
				// Ignore joint id
				this._newBlockBytes.readUnsignedShort();
				joint = new SkeletonJoint();
				joint.parentIndex = this._newBlockBytes.readUnsignedShort() - 1; // 0=null in AWD
				joint.name = this.parseVarStr();
	
				ibp = this.parseMatrix3D();
				joint.inverseBindPose = ibp.rawData;
				// Ignore joint props/attributes for now
				this.parseProperties(null);
				this.parseUserAttributes();
				skeleton.joints.push(joint);
				joints_parsed++;
			}
	
			// Discard attributes for now
			this.parseUserAttributes();
			this._pFinalizeAsset(skeleton, name);
			this._blocks[blockID].data = skeleton;
			if (this._debug)
				console.log("Parsed a Skeleton: Name = " + skeleton.name + " | Number of Joints = " + joints_parsed);
		}

		//Block ID = 102
		private parseSkeletonPose(blockID:number /*uint*/):void
		{
			var name:string = this.parseVarStr();
			var num_joints:number /*uint*/ = this._newBlockBytes.readUnsignedShort();
			this.parseProperties(null); // Ignore properties for now

			var pose:SkeletonPose = new SkeletonPose();

			var joints_parsed:number /*uint*/ = 0;
			while (joints_parsed < num_joints) {
				var joint_pose:JointPose;
				var has_transform:number /*uint*/;
				joint_pose = new JointPose();
				has_transform = this._newBlockBytes.readUnsignedByte();
				if (has_transform == 1) {
					var mtx_data:Array<number> = this.parseMatrix43RawData();

					var mtx:Matrix3D = new Matrix3D(mtx_data);
					joint_pose.orientation.fromMatrix(mtx);
					joint_pose.translation.copyFrom(mtx.position);

					pose.jointPoses[joints_parsed] = joint_pose;
				}
				joints_parsed++;
			}
			// Skip attributes for now
			this.parseUserAttributes();
			this._pFinalizeAsset(pose, name);
			this._blocks[blockID].data = pose;
			if (this._debug)
				console.log("Parsed a SkeletonPose: Name = " + pose.name + " | Number of Joints = " + joints_parsed);
		}

		//blockID 103
		private parseSkeletonAnimation(blockID:number /*uint*/):void
		{
			var frame_dur:number;
			var pose_addr:number /*uint*/;
			var name:string = this.parseVarStr();
			var clip:SkeletonClipNode = new SkeletonClipNode();
			var num_frames:number /*uint*/ = this._newBlockBytes.readUnsignedShort();
			this.parseProperties(null); // Ignore properties for now

			var frames_parsed:number /*uint*/ = 0;
			var returnedArray:Array<any>;
			while (frames_parsed < num_frames) {
				pose_addr = this._newBlockBytes.readUnsignedInt();
				frame_dur = this._newBlockBytes.readUnsignedShort();
				returnedArray = this.getAssetByID(pose_addr, [AssetType.SKELETON_POSE]);
				if (!returnedArray[0])
					this._blocks[blockID].addError("Could not find the SkeletonPose Frame # " + frames_parsed + " (ID = " + pose_addr + " ) for this SkeletonClipNode");
				else
					clip.addFrame(<SkeletonPose> this._blocks[pose_addr].data, frame_dur);
				frames_parsed++;
			}
			if (clip.frames.length == 0) {
				this._blocks[blockID].addError("Could not this SkeletonClipNode, because no Frames where set.");
				return;
			}
			// Ignore attributes for now
			this.parseUserAttributes();
			this._pFinalizeAsset(clip, name);
			this._blocks[blockID].data = clip;
			if (this._debug)
				console.log("Parsed a SkeletonClipNode: Name = " + clip.name + " | Number of Frames = " + clip.frames.length);
		}

		//Block ID = 111 /  Block ID = 112
		private parseMeshPoseAnimation(blockID:number /*uint*/, poseOnly:boolean = false):void
		{
			var num_frames:number /*uint*/ = 1;
			var num_submeshes:number /*uint*/;
			var frames_parsed:number /*uint*/;
			var subMeshParsed:number /*uint*/;
			var frame_dur:number;
			var x:number;
			var y:number;
			var z:number;
			var str_len:number;
			var str_end:number;
			var geometry:Geometry;
			var subGeom:TriangleSubGeometry;
			var idx:number /*int*/ = 0;
			var clip:VertexClipNode = new VertexClipNode();
			var indices:Array<number> /*uint*/;
			var verts:Array<number>;
			var num_Streams:number /*int*/ = 0;
			var streamsParsed:number /*int*/ = 0;
			var streamtypes:Array<number> /*int*/ = new Array<number>() /*int*/;
			var props:AWDProperties;
			var thisGeo:Geometry;
			var name:string = this.parseVarStr();
			var geoAdress:number /*int*/ = this._newBlockBytes.readUnsignedInt();
			var returnedArray:Array<any> = this.getAssetByID(geoAdress, [AssetType.GEOMETRY]);
			if (!returnedArray[0]) {
				this._blocks[blockID].addError("Could not find the target-Geometry-Object " + geoAdress + " ) for this VertexClipNode");
				return;
			}
			var uvs:Array<Array<number>> = this.getUVForVertexAnimation(geoAdress);
			if (!poseOnly)
				num_frames = this._newBlockBytes.readUnsignedShort();
	
			num_submeshes = this._newBlockBytes.readUnsignedShort();
			num_Streams = this._newBlockBytes.readUnsignedShort();
			streamsParsed = 0;
			while (streamsParsed < num_Streams) {
				streamtypes.push(this._newBlockBytes.readUnsignedShort());
				streamsParsed++;
			}
			props = this.parseProperties({1:AWDParser.BOOL, 2:AWDParser.BOOL});
	
			clip.looping = props.get(1, true);
			clip.stitchFinalFrame = props.get(2, false);
	
			frames_parsed = 0;
			while (frames_parsed < num_frames) {
				frame_dur = this._newBlockBytes.readUnsignedShort();
				geometry = new Geometry();
				subMeshParsed = 0;
				while (subMeshParsed < num_submeshes) {
					streamsParsed = 0;
					str_len = this._newBlockBytes.readUnsignedInt();
					str_end = this._newBlockBytes.position + str_len;
					while (streamsParsed < num_Streams) {
						if (streamtypes[streamsParsed] == 1) {
							indices = (<Geometry> returnedArray[1]).subGeometries[subMeshParsed].indices;
							verts = new Array<number>();
							idx = 0;
							while (this._newBlockBytes.position < str_end) {
								x = this.readNumber(this._accuracyGeo)
								y = this.readNumber(this._accuracyGeo)
								z = this.readNumber(this._accuracyGeo)
								verts[idx++] = x;
								verts[idx++] = y;
								verts[idx++] = z;
							}
							subGeom = new TriangleSubGeometry(true);
							subGeom.updateIndices(indices);
							subGeom.updatePositions(verts);
							subGeom.updateUVs(uvs[subMeshParsed]);
							subGeom.updateVertexNormals(null);
							subGeom.updateVertexTangents(null);
							subGeom.autoDeriveNormals = false;
							subGeom.autoDeriveTangents = false;
							subMeshParsed++;
							geometry.addSubGeometry(subGeom)
						} else
							this._newBlockBytes.position = str_end;
						streamsParsed++;
					}
				}
				clip.addFrame(geometry, frame_dur);
				frames_parsed++;
			}
			this.parseUserAttributes();
			this._pFinalizeAsset(clip, name);
	
			this._blocks[blockID].data = clip;
			if (this._debug)
				console.log("Parsed a VertexClipNode: Name = " + clip.name + " | Target-Geometry-Name = " + (<Geometry> returnedArray[1]).name + " | Number of Frames = " + clip.frames.length);
		}

		//BlockID 113
		private parseVertexAnimationSet(blockID:number /*uint*/):void
		{
			var poseBlockAdress:number /*int*/
			var outputString:string = "";
			var name:string = this.parseVarStr();
			var num_frames:number /*uint*/ = this._newBlockBytes.readUnsignedShort();
			var props:AWDProperties = this.parseProperties({1:AWDParser.UINT16});
			var frames_parsed:number /*uint*/ = 0;
			var skeletonFrames:Array<SkeletonClipNode> = new Array<SkeletonClipNode>();
			var vertexFrames:Array<VertexClipNode> = new Array<VertexClipNode>();
			while (frames_parsed < num_frames) {
				poseBlockAdress = this._newBlockBytes.readUnsignedInt();
				var returnedArray:Array<any> = this.getAssetByID(poseBlockAdress, [AssetType.ANIMATION_NODE]);
				if (!returnedArray[0])
					this._blocks[blockID].addError("Could not find the AnimationClipNode Nr " + frames_parsed + " ( " + poseBlockAdress + " ) for this AnimationSet");
				else {
					if (returnedArray[1] instanceof VertexClipNode)
					vertexFrames.push(returnedArray[1])
					if (returnedArray[1] instanceof SkeletonClipNode)
					skeletonFrames.push(returnedArray[1])
				}
				frames_parsed++;
			}
			if ((vertexFrames.length == 0) && (skeletonFrames.length == 0)) {
				this._blocks[blockID].addError("Could not create this AnimationSet, because it contains no animations");
				return;
			}
			this.parseUserAttributes();
			if (vertexFrames.length > 0) {
				var newVertexAnimationSet:VertexAnimationSet = new VertexAnimationSet();
				for (var i:number /*int*/ = 0; i < vertexFrames.length; i++)
					newVertexAnimationSet.addAnimation(vertexFrames[i]);
				this._pFinalizeAsset(newVertexAnimationSet, name);
				this._blocks[blockID].data = newVertexAnimationSet;
				if (this._debug)
					console.log("Parsed a VertexAnimationSet: Name = " + name + " | Animations = " + newVertexAnimationSet.animations.length + " | Animation-Names = " + newVertexAnimationSet.animationNames.toString());
	
			} else if (skeletonFrames.length > 0) {
				returnedArray = this.getAssetByID(poseBlockAdress, [AssetType.ANIMATION_NODE]);
				var newSkeletonAnimationSet:SkeletonAnimationSet = new SkeletonAnimationSet(props.get(1, 4)); //props.get(1,4));
				for (var i:number /*int*/ = 0; i < skeletonFrames.length; i++)
					newSkeletonAnimationSet.addAnimation(skeletonFrames[i]);
				this._pFinalizeAsset(newSkeletonAnimationSet, name);
				this._blocks[blockID].data = newSkeletonAnimationSet;
				if (this._debug)
					console.log("Parsed a SkeletonAnimationSet: Name = " + name + " | Animations = " + newSkeletonAnimationSet.animations.length + " | Animation-Names = " + newSkeletonAnimationSet.animationNames.toString());
	
			}
		}

		//BlockID 122
		private parseAnimatorSet(blockID:number /*uint*/):void
		{
			var targetMesh:Mesh;
			var animSetBlockAdress:number /*int*/
			var targetAnimationSet:AnimationSetBase;
			var outputString:string = "";
			var name:string = this.parseVarStr();
			var type:number /*uint*/ = this._newBlockBytes.readUnsignedShort();
	
			var props:AWDProperties = this.parseProperties({1:AWDParser.BADDR});
	
			animSetBlockAdress = this._newBlockBytes.readUnsignedInt();
			var targetMeshLength:number /*uint*/ = this._newBlockBytes.readUnsignedShort();
			var meshAdresses:Array<number> /*uint*/ = new Array<number>() /*uint*/;
			for (var i:number /*int*/ = 0; i < targetMeshLength; i++)
				meshAdresses.push(this._newBlockBytes.readUnsignedInt());
	
			var activeState:number /*uint*/ = this._newBlockBytes.readUnsignedShort();
			var autoplay:boolean = ( this._newBlockBytes.readUnsignedByte() == 1 );
			this.parseUserAttributes();
			this.parseUserAttributes();
	
			var returnedArray:Array<any>;
			var targetMeshes:Array<Mesh> = new Array<Mesh>();
	
			for (i = 0; i < meshAdresses.length; i++) {
				returnedArray = this.getAssetByID(meshAdresses[i], [AssetType.MESH]);
				if (returnedArray[0])
					targetMeshes.push(<Mesh> returnedArray[1]);
			}
			returnedArray = this.getAssetByID(animSetBlockAdress, [AssetType.ANIMATION_SET]);
			if (!returnedArray[0]) {
				this._blocks[blockID].addError("Could not find the AnimationSet ( " + animSetBlockAdress + " ) for this Animator");;
				return
			}
			targetAnimationSet = <AnimationSetBase> returnedArray[1];
			var thisAnimator:AnimatorBase;
			if (type == 1) {
	
				returnedArray = this.getAssetByID(props.get(1, 0), [AssetType.SKELETON]);
				if (!returnedArray[0]) {
					this._blocks[blockID].addError("Could not find the Skeleton ( " + props.get(1, 0) + " ) for this Animator");
					return
				}
				thisAnimator = new SkeletonAnimator(<SkeletonAnimationSet> targetAnimationSet, <Skeleton> returnedArray[1]);
	
			} else if (type == 2)
				thisAnimator = new VertexAnimator(<VertexAnimationSet> targetAnimationSet);

			this._pFinalizeAsset(thisAnimator, name);
			this._blocks[blockID].data = thisAnimator;
			for (i = 0; i < targetMeshes.length; i++) {
				if (type == 1)
					targetMeshes[i].animator = (<SkeletonAnimator> thisAnimator);
				if (type == 2)
					targetMeshes[i].animator = (<VertexAnimator> thisAnimator);
	
			}
			if (this._debug)
				console.log("Parsed a Animator: Name = " + name);
		}
		
		// this functions reads and creates a EffectMethod
		private parseSharedMethodList(blockID:number):EffectMethodBase
		{

			var methodType:number = this._newBlockBytes.readUnsignedShort();
			var effectMethodReturn:EffectMethodBase;

			var props:AWDProperties = this.parseProperties({1:AWDParser.BADDR, 2:AWDParser.BADDR, 3:AWDParser.BADDR, 101:this._propsNrType, 102:this._propsNrType, 103:this._propsNrType, 104:this._propsNrType, 105:this._propsNrType, 106:this._propsNrType, 107:this._propsNrType, 201:AWDParser.UINT32, 202:AWDParser.UINT32, 301:AWDParser.UINT16, 302:AWDParser.UINT16, 401:AWDParser.UINT8, 402:AWDParser.UINT8, 601:AWDParser.COLOR, 602:AWDParser.COLOR, 701:AWDParser.BOOL, 702:AWDParser.BOOL});
			var targetID:number;
			var returnedArray:Array<any>;

			switch (methodType) {
				// Effect Methods
				case 401: //ColorMatrix
					effectMethodReturn = new EffectColorMatrixMethod(props.get(101, new Array(0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)));
					break;
				case 402: //ColorTransform
					effectMethodReturn = new EffectColorTransformMethod();
					var offCol:number /*uint*/ = props.get(601, 0x00000000);
					(<EffectColorTransformMethod> effectMethodReturn).colorTransform = new ColorTransform(props.get(102, 1), props.get(103, 1), props.get(104, 1), props.get(101, 1), ((offCol >> 16) & 0xFF), ((offCol >> 8) & 0xFF), (offCol & 0xFF), ((offCol >> 24) & 0xFF));
					break;
				case 403: //EnvMap

					targetID = props.get(1, 0);
					console.log('ENV MAP', targetID);


					returnedArray = this.getAssetByID(targetID, [ AssetType.TEXTURE ], "CubeTexture");
					if (!returnedArray[0])
						this._blocks[blockID].addError("Could not find the EnvMap (ID = " + targetID + " ) for this EnvMapMethod");
					effectMethodReturn = new EffectEnvMapMethod(<CubeTextureBase> returnedArray[1], <number> props.get(101, 1));
					targetID = props.get(2, 0);
					if (targetID > 0) {
						returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE]);
						if (!returnedArray[0])
							this._blocks[blockID].addError("Could not find the Mask-texture (ID = " + targetID + " ) for this EnvMapMethod");

						// Todo: test mask with EnvMapMethod
						//(<EnvMapMethod> effectMethodReturn).mask = <Texture2DBase> returnedArray[1];
					}
					break;
				case 404: //LightMapMethod
					targetID = props.get(1, 0);
					returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE]);
					if (!returnedArray[0])
						this._blocks[blockID].addError("Could not find the LightMap (ID = " + targetID + " ) for this LightMapMethod");
					effectMethodReturn = new EffectLightMapMethod(returnedArray[1], this.blendModeDic[props.get(401, 10)]); //usesecondaryUV not set
					break;
				//				case 405: //ProjectiveTextureMethod
				//					targetID = props.get(1, 0);
				//					returnedArray = getAssetByID(targetID, [AssetType.TEXTURE_PROJECTOR]);
				//					if (!returnedArray[0])
				//						_blocks[blockID].addError("Could not find the TextureProjector (ID = " + targetID + " ) for this ProjectiveTextureMethod");
				//					effectMethodReturn = new ProjectiveTextureMethod(returnedArray[1], blendModeDic[props.get(401, 10)]);
				//					break;
				case 406: //RimLightMethod
					effectMethodReturn = new EffectRimLightMethod(props.get(601, 0xffffff), props.get(101, 0.4), props.get(101, 2)); //blendMode
					break;
				case 407: //AlphaMaskMethod
					targetID = props.get(1, 0);
					returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE]);
					if (!returnedArray[0])
						this._blocks[blockID].addError("Could not find the Alpha-texture (ID = " + targetID + " ) for this AlphaMaskMethod");
					effectMethodReturn = new EffectAlphaMaskMethod(returnedArray[1], props.get(701, false));
					break;
				//				case 408: //RefractionEnvMapMethod
				//					targetID = props.get(1, 0);
				//					returnedArray = getAssetByID(targetID, [AssetType.TEXTURE], "CubeTexture");
				//					if (!returnedArray[0])
				//						_blocks[blockID].addError("Could not find the EnvMap (ID = " + targetID + " ) for this RefractionEnvMapMethod");
				//					effectMethodReturn = new RefractionEnvMapMethod(returnedArray[1], props.get(101, 0.1), props.get(102, 0.01), props.get(103, 0.01), props.get(104, 0.01));
				//					RefractionEnvMapMethod(effectMethodReturn).alpha = props.get(104, 1);
				//					break;
				//				case 409: //OutlineMethod
				//					effectMethodReturn = new OutlineMethod(props.get(601, 0x00000000), props.get(101, 1), props.get(701, true), props.get(702, false));
				//					break;
				case 410: //FresnelEnvMapMethod
					targetID = props.get(1, 0);
					returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE], "CubeTexture");
					if (!returnedArray[0])
						this._blocks[blockID].addError("Could not find the EnvMap (ID = " + targetID + " ) for this FresnelEnvMapMethod");
					effectMethodReturn = new EffectFresnelEnvMapMethod(returnedArray[1], props.get(101, 1));
					break;
				case 411: //FogMethod
					effectMethodReturn = new EffectFogMethod(props.get(101, 0), props.get(102, 1000), props.get(601, 0x808080));
					break;

			}
			this.parseUserAttributes();
			return effectMethodReturn;

		}

		private parseUserAttributes():Object
		{
			var attributes:Object;
			var list_len:number;
			var attibuteCnt:number;

			list_len = this._newBlockBytes.readUnsignedInt();

			if (list_len > 0) {

				var list_end:number;

				attributes = {};

				list_end = this._newBlockBytes.position + list_len;

				while (this._newBlockBytes.position < list_end) {
					var ns_id:number;
					var attr_key:string;
					var attr_type:number;
					var attr_len:number;
					var attr_val:any;

					// TODO: Properly tend to namespaces in attributes
					ns_id = this._newBlockBytes.readUnsignedByte();
					attr_key = this.parseVarStr();
					attr_type = this._newBlockBytes.readUnsignedByte();
					attr_len = this._newBlockBytes.readUnsignedInt();

					if ((this._newBlockBytes.position + attr_len) > list_end) {
						console.log("           Error in reading attribute # " + attibuteCnt + " = skipped to end of attribute-list");
						this._newBlockBytes.position = list_end;
						return attributes;
					}

					switch (attr_type) {
						case AWDParser.AWDSTRING:
							attr_val = this._newBlockBytes.readUTFBytes(attr_len);
							break;
						case AWDParser.INT8:
							attr_val = this._newBlockBytes.readByte();
							break;
						case AWDParser.INT16:
							attr_val = this._newBlockBytes.readShort();
							break;
						case AWDParser.INT32:
							attr_val = this._newBlockBytes.readInt();
							break;
						case AWDParser.BOOL:
						case AWDParser.UINT8:
							attr_val = this._newBlockBytes.readUnsignedByte();
							break;
						case AWDParser.UINT16:
							attr_val = this._newBlockBytes.readUnsignedShort();
							break;
						case AWDParser.UINT32:
						case AWDParser.BADDR:
							attr_val = this._newBlockBytes.readUnsignedInt();
							break;
						case AWDParser.FLOAT32:
							attr_val = this._newBlockBytes.readFloat();
							break;
						case AWDParser.FLOAT64:
							attr_val = this._newBlockBytes.readDouble();
							break;
						default:
							attr_val = 'unimplemented attribute type ' + attr_type;
							this._newBlockBytes.position += attr_len;
							break;
					}

					if (this._debug) {
						console.log("attribute = name: " + attr_key + "  / value = " + attr_val);
					}

					attributes[attr_key] = attr_val;
					attibuteCnt += 1;
				}
			}

			return attributes;
		}

		private parseProperties(expected:Object):AWDProperties
		{
			var list_end:number;
			var list_len:number;
			var propertyCnt:number = 0;
			var props:AWDProperties = new AWDProperties();

			list_len = this._newBlockBytes.readUnsignedInt();
			list_end = this._newBlockBytes.position + list_len;

			if (expected) {

				while (this._newBlockBytes.position < list_end) {
					var len:number;
					var key:number;
					var type:number;

					key = this._newBlockBytes.readUnsignedShort();
					len = this._newBlockBytes.readUnsignedInt();

					if ((this._newBlockBytes.position + len) > list_end) {
						console.log("           Error in reading property # " + propertyCnt + " = skipped to end of propertie-list");
						this._newBlockBytes.position = list_end;
						return props;
					}

					if (expected.hasOwnProperty(key.toString())) {
						type = expected[key];
						props.set(key, this.parseAttrValue(type, len));
					} else {
						this._newBlockBytes.position += len;
					}

					propertyCnt += 1;

				}
			} else {
				this._newBlockBytes.position = list_end;
			}

			return props;

		}

		private parseAttrValue(type:number, len:number):any
		{
			var elem_len:number;
			var read_func:Function;

			switch (type) {

				case AWDParser.BOOL:
				case AWDParser.INT8:
					elem_len = 1;
					read_func = this._newBlockBytes.readByte;
					break;

				case AWDParser.INT16:
					elem_len = 2;
					read_func = this._newBlockBytes.readShort;
					break;

				case AWDParser.INT32:
					elem_len = 4;
					read_func = this._newBlockBytes.readInt;
					break;

				case AWDParser.UINT8:
					elem_len = 1;
					read_func = this._newBlockBytes.readUnsignedByte;
					break;

				case AWDParser.UINT16:
					elem_len = 2;
					read_func = this._newBlockBytes.readUnsignedShort;
					break;

				case AWDParser.UINT32:
				case AWDParser.COLOR:
				case AWDParser.BADDR:
					elem_len = 4;
					read_func = this._newBlockBytes.readUnsignedInt;
					break;

				case AWDParser.FLOAT32:
					elem_len = 4;
					read_func = this._newBlockBytes.readFloat;
					break;

				case AWDParser.FLOAT64:
					elem_len = 8;
					read_func = this._newBlockBytes.readDouble;
					break;

				case AWDParser.AWDSTRING:
					return this._newBlockBytes.readUTFBytes(len);

				case AWDParser.VECTOR2x1:
				case AWDParser.VECTOR3x1:
				case AWDParser.VECTOR4x1:
				case AWDParser.MTX3x2:
				case AWDParser.MTX3x3:
				case AWDParser.MTX4x3:
				case AWDParser.MTX4x4:
					elem_len = 8;
					read_func = this._newBlockBytes.readDouble;
					break;

			}

			if (elem_len < len) {
				var list:Array<any> = [];
				var num_read:number = 0;
				var num_elems:number = len/elem_len;

				while (num_read < num_elems) {
					list.push(read_func.apply(this._newBlockBytes)); // list.push(read_func());
					num_read++;
				}

				return list;
			} else {

				var val:any = read_func.apply(this._newBlockBytes);//read_func();
				return val;
			}
		}

		private parseHeader():void
		{
			var flags:number;
			var body_len:number;

			this._byteData.position = 3; // Skip magic string and parse version

			this._version[0] = this._byteData.readUnsignedByte();
			this._version[1] = this._byteData.readUnsignedByte();

			flags = this._byteData.readUnsignedShort(); // Parse bit flags

			this._streaming = bitFlags.test(flags, bitFlags.FLAG1);

			if ((this._version[0] == 2) && (this._version[1] == 1)) {
				this._accuracyMatrix = bitFlags.test(flags, bitFlags.FLAG2);
				this._accuracyGeo = bitFlags.test(flags, bitFlags.FLAG3);
				this._accuracyProps = bitFlags.test(flags, bitFlags.FLAG4);
			}

			// if we set _accuracyOnBlocks, the precision-values are read from each block-header.

			// set storagePrecision types
			this._geoNrType = AWDParser.FLOAT32;

			if (this._accuracyGeo) {
				this._geoNrType = AWDParser.FLOAT64;
			}

			this._matrixNrType = AWDParser.FLOAT32;

			if (this._accuracyMatrix) {
				this._matrixNrType = AWDParser.FLOAT64;
			}

			this._propsNrType = AWDParser.FLOAT32;

			if (this._accuracyProps) {
				this._propsNrType = AWDParser.FLOAT64;
			}

			this._compression = this._byteData.readUnsignedByte(); // compression

			if (this._debug) {
				console.log("Import AWDFile of version = " + this._version[0] + " - " + this._version[1]);
				console.log("Global Settings = Compression = " + this._compression + " | Streaming = " + this._streaming + " | Matrix-Precision = " + this._accuracyMatrix + " | Geometry-Precision = " + this._accuracyGeo + " | Properties-Precision = " + this._accuracyProps);
			}

			// Check file integrity
			body_len = this._byteData.readUnsignedInt();
			if (!this._streaming && body_len != this._byteData.getBytesAvailable()) {
				this._pDieWithError('AWD2 body length does not match header integrity field');
			}

		}
		// Helper - functions
		private getUVForVertexAnimation(meshID:number /*uint*/):Array<Array<number>>
		{
			if (this._blocks[meshID].data instanceof Mesh)
			meshID = this._blocks[meshID].geoID;
			if (this._blocks[meshID].uvsForVertexAnimation)
				return this._blocks[meshID].uvsForVertexAnimation;
			var geometry:Geometry = (<Geometry> this._blocks[meshID].data);
			var geoCnt:number /*int*/ = 0;
			var ud:Array<number>;
			var uStride:number /*uint*/;
			var uOffs:number /*uint*/;
			var numPoints:number /*uint*/;
			var i:number /*int*/;
			var newUvs:Array<number>;
			var sub_geom:TriangleSubGeometry;
			this._blocks[meshID].uvsForVertexAnimation = new Array<Array<number>>();
			while (geoCnt < geometry.subGeometries.length) {
				newUvs = new Array<number>();
				sub_geom = <TriangleSubGeometry> geometry.subGeometries[geoCnt];
				numPoints = sub_geom.numVertices;
				ud = sub_geom.uvs;
				uStride = sub_geom.getStride(TriangleSubGeometry.UV_DATA);
				uOffs = sub_geom.getOffset(TriangleSubGeometry.UV_DATA);
				for (i = 0; i < numPoints; i++) {
					newUvs.push(ud[uOffs + i*uStride + 0]);
					newUvs.push(ud[uOffs + i*uStride + 1]);
				}
				this._blocks[meshID].uvsForVertexAnimation.push(newUvs);
				geoCnt++;
			}
			return this._blocks[meshID].uvsForVertexAnimation;
		}
		
		private parseVarStr():string
		{

			var len:number = this._newBlockBytes.readUnsignedShort();
			return this._newBlockBytes.readUTFBytes(len);
		}

		private getAssetByID(assetID:number, assetTypesToGet:Array<string>, extraTypeInfo:string = "SingleTexture"):Array<any>
		{
			var returnArray:Array<any> = new Array<any>();
			var typeCnt:number = 0;
			if (assetID > 0) {
				if (this._blocks[assetID]) {
					if (this._blocks[assetID].data) {
						while (typeCnt < assetTypesToGet.length) {

							var iasset:away.library.IAsset = <away.library.IAsset> this._blocks[assetID].data;

							if (iasset.assetType == assetTypesToGet[typeCnt]) {
								//if the right assetType was found
								if ((assetTypesToGet[typeCnt] == AssetType.TEXTURE) && (extraTypeInfo == "CubeTexture")) {
									if (this._blocks[assetID].data instanceof ImageCubeTexture) {
										returnArray.push(true);
										returnArray.push(this._blocks[assetID].data);
										return returnArray;
									}
								}
								if ((assetTypesToGet[typeCnt] == AssetType.TEXTURE) && (extraTypeInfo == "SingleTexture")) {
									if (this._blocks[assetID].data instanceof ImageTexture) {
										returnArray.push(true);
										returnArray.push(this._blocks[assetID].data);
										return returnArray;
									}
								} else {
									returnArray.push(true);
									returnArray.push(this._blocks[assetID].data);
									return returnArray;

								}
							}
							//if ((assetTypesToGet[typeCnt] == AssetType.GEOMETRY) && (IAsset(_blocks[assetID].data).assetType == AssetType.MESH)) {
							if ((assetTypesToGet[typeCnt] == AssetType.GEOMETRY) && (iasset.assetType == AssetType.MESH)) {

								var mesh:Mesh = <Mesh> this._blocks[assetID].data

								returnArray.push(true);
								returnArray.push(mesh.geometry);
								return returnArray;

							}

							typeCnt++;
						}
					}
				}
			}
			// if the has not returned anything yet, the asset is not found, or the found asset is not the right type.
			returnArray.push(false);
			returnArray.push(this.getDefaultAsset(assetTypesToGet[0], extraTypeInfo));
			return returnArray;
		}

		private getDefaultAsset(assetType:string, extraTypeInfo:string):away.library.IAsset
		{
			switch (true) {
				case (assetType == AssetType.TEXTURE):
					if (extraTypeInfo == "CubeTexture")
						return this.getDefaultCubeTexture();
					if (extraTypeInfo == "SingleTexture")
						return this.getDefaultTexture();
					break;
				case (assetType == AssetType.MATERIAL):
					return this.getDefaultMaterial()
					break;
				default:
					break;
			}

			return null;
		}

		private getDefaultMaterial():away.library.IAsset
		{
			if (!this._defaultBitmapMaterial)
				this._defaultBitmapMaterial = <TriangleMethodMaterial> DefaultMaterialManager.getDefaultMaterial();

			return  <away.library.IAsset>  this._defaultBitmapMaterial;
		}

		private getDefaultTexture():away.library.IAsset
		{
			if (!this._defaultTexture)
				this._defaultTexture = DefaultMaterialManager.getDefaultTexture();

			return <away.library.IAsset> this._defaultTexture;

		}

		private getDefaultCubeTexture():away.library.IAsset
		{
			if (!this._defaultCubeTexture) {
				var defaultBitmap:away.base.BitmapData = DefaultMaterialManager.createCheckeredBitmapData();

				this._defaultCubeTexture = new BitmapCubeTexture(defaultBitmap, defaultBitmap, defaultBitmap, defaultBitmap, defaultBitmap, defaultBitmap);
				this._defaultCubeTexture.name = "defaultCubeTexture";
			}

			return <away.library.IAsset> this._defaultCubeTexture;
		}

		private readNumber(precision:boolean = false):number
		{
			if (precision)
				return this._newBlockBytes.readDouble();
			return this._newBlockBytes.readFloat();

		}

		private parseMatrix3D():Matrix3D
		{
			return new Matrix3D(this.parseMatrix43RawData());
		}

		private parseMatrix32RawData():Array<number>
		{
			var i:number;
			var mtx_raw:Array<number> = new Array<number>(6);
			for (i = 0; i < 6; i++) {
				mtx_raw[i] = this._newBlockBytes.readFloat();
			}

			return mtx_raw;
		}

		private parseMatrix43RawData():Array<number>
		{
			var mtx_raw:Array<number> = new Array<number>(16);

			mtx_raw[0] = this.readNumber(this._accuracyMatrix);
			mtx_raw[1] = this.readNumber(this._accuracyMatrix);
			mtx_raw[2] = this.readNumber(this._accuracyMatrix);
			mtx_raw[3] = 0.0;
			mtx_raw[4] = this.readNumber(this._accuracyMatrix);
			mtx_raw[5] = this.readNumber(this._accuracyMatrix);
			mtx_raw[6] = this.readNumber(this._accuracyMatrix);
			mtx_raw[7] = 0.0;
			mtx_raw[8] = this.readNumber(this._accuracyMatrix);
			mtx_raw[9] = this.readNumber(this._accuracyMatrix);
			mtx_raw[10] = this.readNumber(this._accuracyMatrix);
			mtx_raw[11] = 0.0;
			mtx_raw[12] = this.readNumber(this._accuracyMatrix);
			mtx_raw[13] = this.readNumber(this._accuracyMatrix);
			mtx_raw[14] = this.readNumber(this._accuracyMatrix);
			mtx_raw[15] = 1.0;

			//TODO: fix max exporter to remove NaN values in joint 0 inverse bind pose

			if (isNaN(mtx_raw[0])) {
				mtx_raw[0] = 1;
				mtx_raw[1] = 0;
				mtx_raw[2] = 0;
				mtx_raw[4] = 0;
				mtx_raw[5] = 1;
				mtx_raw[6] = 0;
				mtx_raw[8] = 0;
				mtx_raw[9] = 0;
				mtx_raw[10] = 1;
				mtx_raw[12] = 0;
				mtx_raw[13] = 0;
				mtx_raw[14] = 0;

			}

			return mtx_raw;
		}

	}

}

class AWDBlock
{
	public id:number;
	public name:string;
	public data:any;
	public len:any;
	public geoID:number;
	public extras:Object;
	public bytes:away.utils.ByteArray;
	public errorMessages:Array<string>;
	public uvsForVertexAnimation:Array<Array<number>>;

	constructor()
	{
	}

	public dispose()
	{

		this.id = null;
		this.bytes = null;
		this.errorMessages = null;
		this.uvsForVertexAnimation = null;

	}

	public addError(errorMsg:string):void
	{
		if (!this.errorMessages)
			this.errorMessages = new Array<string>();
		this.errorMessages.push(errorMsg);
	}
}

class bitFlags
{
	public static FLAG1:number = 1;
	public static FLAG2:number = 2;
	public static FLAG3:number = 4;
	public static FLAG4:number = 8;
	public static FLAG5:number = 16;
	public static FLAG6:number = 32;
	public static FLAG7:number = 64;
	public static FLAG8:number = 128;
	public static FLAG9:number = 256;
	public static FLAG10:number = 512;
	public static FLAG11:number = 1024;
	public static FLAG12:number = 2048;
	public static FLAG13:number = 4096;
	public static FLAG14:number = 8192;
	public static FLAG15:number = 16384;
	public static FLAG16:number = 32768;

	public static test(flags:number, testFlag:number):boolean
	{
		return (flags & testFlag) == testFlag;
	}
}

class AWDProperties
{
	public set(key:number, value:any):void
	{
		this[ key.toString() ] = value;
	}

	public get(key:number, fallback:any):any
	{
		if (this.hasOwnProperty(key.toString())) {
			return this[key.toString()];
		} else {
			return fallback;
		}
	}
}

