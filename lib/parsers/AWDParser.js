var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var URLLoaderDataFormat = require("awayjs-core/lib/net/URLLoaderDataFormat");
var URLRequest = require("awayjs-core/lib/net/URLRequest");
var AssetType = require("awayjs-core/lib/library/AssetType");
var ParserBase = require("awayjs-core/lib/parsers/ParserBase");
var ParserUtils = require("awayjs-core/lib/parsers/ParserUtils");
var PerspectiveProjection = require("awayjs-core/lib/projections/PerspectiveProjection");
var OrthographicProjection = require("awayjs-core/lib/projections/OrthographicProjection");
var OrthographicOffCenterProjection = require("awayjs-core/lib/projections/OrthographicOffCenterProjection");
var BitmapCubeTexture = require("awayjs-core/lib/textures/BitmapCubeTexture");
var ImageCubeTexture = require("awayjs-core/lib/textures/ImageCubeTexture");
var ImageTexture = require("awayjs-core/lib/textures/ImageTexture");
var ByteArray = require("awayjs-core/lib/utils/ByteArray");
var DisplayObjectContainer = require("awayjs-display/lib/containers/DisplayObjectContainer");
var BlendMode = require("awayjs-display/lib/base/BlendMode");
var Geometry = require("awayjs-display/lib/base/Geometry");
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var DirectionalLight = require("awayjs-display/lib/entities/DirectionalLight");
var PointLight = require("awayjs-display/lib/entities/PointLight");
var Camera = require("awayjs-display/lib/entities/Camera");
var Mesh = require("awayjs-display/lib/entities/Mesh");
var Skybox = require("awayjs-display/lib/entities/Skybox");
var StaticLightPicker = require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
var CubeMapShadowMapper = require("awayjs-display/lib/materials/shadowmappers/CubeMapShadowMapper");
var DirectionalShadowMapper = require("awayjs-display/lib/materials/shadowmappers/DirectionalShadowMapper");
var PrefabBase = require("awayjs-display/lib/prefabs/PrefabBase");
var PrimitiveCapsulePrefab = require("awayjs-display/lib/prefabs/PrimitiveCapsulePrefab");
var PrimitiveConePrefab = require("awayjs-display/lib/prefabs/PrimitiveConePrefab");
var PrimitiveCubePrefab = require("awayjs-display/lib/prefabs/PrimitiveCubePrefab");
var PrimitiveCylinderPrefab = require("awayjs-display/lib/prefabs/PrimitiveCylinderPrefab");
var PrimitivePlanePrefab = require("awayjs-display/lib/prefabs/PrimitivePlanePrefab");
var PrimitiveSpherePrefab = require("awayjs-display/lib/prefabs/PrimitiveSpherePrefab");
var PrimitiveTorusPrefab = require("awayjs-display/lib/prefabs/PrimitiveTorusPrefab");
var SkyboxMaterial = require("awayjs-stagegl/lib/materials/SkyboxMaterial");
var TriangleMaterialMode = require("awayjs-stagegl/lib/materials/TriangleMaterialMode");
var TriangleMethodMaterial = require("awayjs-stagegl/lib/materials/TriangleMethodMaterial");
var DefaultMaterialManager = require("awayjs-stagegl/lib/materials/utils/DefaultMaterialManager");
var VertexAnimationSet = require("awayjs-renderergl/lib/animators/VertexAnimationSet");
var VertexAnimator = require("awayjs-renderergl/lib/animators/VertexAnimator");
var SkeletonAnimationSet = require("awayjs-renderergl/lib/animators/SkeletonAnimationSet");
var SkeletonAnimator = require("awayjs-renderergl/lib/animators/SkeletonAnimator");
var JointPose = require("awayjs-renderergl/lib/animators/data/JointPose");
var Skeleton = require("awayjs-renderergl/lib/animators/data/Skeleton");
var SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
var SkeletonJoint = require("awayjs-renderergl/lib/animators/data/SkeletonJoint");
var SkeletonClipNode = require("awayjs-renderergl/lib/animators/nodes/SkeletonClipNode");
var VertexClipNode = require("awayjs-renderergl/lib/animators/nodes/VertexClipNode");
var AmbientEnvMapMethod = require("awayjs-renderergl/lib/materials/methods/AmbientEnvMapMethod");
var DiffuseDepthMethod = require("awayjs-renderergl/lib/materials/methods/DiffuseDepthMethod");
var DiffuseCelMethod = require("awayjs-renderergl/lib/materials/methods/DiffuseCelMethod");
var DiffuseGradientMethod = require("awayjs-renderergl/lib/materials/methods/DiffuseGradientMethod");
var DiffuseLightMapMethod = require("awayjs-renderergl/lib/materials/methods/DiffuseLightMapMethod");
var DiffuseWrapMethod = require("awayjs-renderergl/lib/materials/methods/DiffuseWrapMethod");
var EffectAlphaMaskMethod = require("awayjs-renderergl/lib/materials/methods/EffectAlphaMaskMethod");
var EffectColorMatrixMethod = require("awayjs-renderergl/lib/materials/methods/EffectColorMatrixMethod");
var EffectColorTransformMethod = require("awayjs-stagegl/lib/materials/methods/EffectColorTransformMethod");
var EffectEnvMapMethod = require("awayjs-renderergl/lib/materials/methods/EffectEnvMapMethod");
var EffectFogMethod = require("awayjs-renderergl/lib/materials/methods/EffectFogMethod");
var EffectFresnelEnvMapMethod = require("awayjs-renderergl/lib/materials/methods/EffectFresnelEnvMapMethod");
var EffectLightMapMethod = require("awayjs-renderergl/lib/materials/methods/EffectLightMapMethod");
var EffectRimLightMethod = require("awayjs-renderergl/lib/materials/methods/EffectRimLightMethod");
var NormalSimpleWaterMethod = require("awayjs-renderergl/lib/materials/methods/NormalSimpleWaterMethod");
var ShadowDitheredMethod = require("awayjs-renderergl/lib/materials/methods/ShadowDitheredMethod");
var ShadowFilteredMethod = require("awayjs-renderergl/lib/materials/methods/ShadowFilteredMethod");
var SpecularFresnelMethod = require("awayjs-renderergl/lib/materials/methods/SpecularFresnelMethod");
var ShadowHardMethod = require("awayjs-stagegl/lib/materials/methods/ShadowHardMethod");
var SpecularAnisotropicMethod = require("awayjs-renderergl/lib/materials/methods/SpecularAnisotropicMethod");
var SpecularCelMethod = require("awayjs-renderergl/lib/materials/methods/SpecularCelMethod");
var SpecularPhongMethod = require("awayjs-renderergl/lib/materials/methods/SpecularPhongMethod");
var ShadowNearMethod = require("awayjs-renderergl/lib/materials/methods/ShadowNearMethod");
var ShadowSoftMethod = require("awayjs-renderergl/lib/materials/methods/ShadowSoftMethod");
var AWDBlock = require("awayjs-renderergl/lib/parsers/data/AWDBlock");
var AWDProperties = require("awayjs-renderergl/lib/parsers/data/AWDProperties");
var BitFlags = require("awayjs-renderergl/lib/parsers/data/BitFlags");
/**
 * AWDParser provides a parser for the AWD data type.
 */
var AWDParser = (function (_super) {
    __extends(AWDParser, _super);
    /**
     * Creates a new AWDParser object.
     * @param uri The url or id of the data or file to be parsed.
     * @param extra The holder for extra contextual data that the parser might need.
     */
    function AWDParser() {
        _super.call(this, URLLoaderDataFormat.ARRAY_BUFFER);
        //set to "true" to have some console.logs in the Console
        this._debug = false;
        this._startedParsing = false;
        this._texture_users = {};
        this._parsed_header = false;
        this._blocks = new Array();
        this._blocks[0] = new AWDBlock();
        this._blocks[0].data = null; // Zero address means null in AWD
        this.blendModeDic = new Array(); // used to translate ints to blendMode-strings
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
        this._depthSizeDic = new Array(); // used to translate ints to depthSize-values
        this._depthSizeDic.push(256);
        this._depthSizeDic.push(512);
        this._depthSizeDic.push(2048);
        this._depthSizeDic.push(1024);
        this._version = Array(); // will contain 2 int (major-version, minor-version) for awd-version-check
    }
    /**
     * Indicates whether or not a given file extension is supported by the parser.
     * @param extension The file extension of a potential file to be parsed.
     * @return Whether or not the given file type is supported.
     */
    AWDParser.supportsType = function (extension) {
        extension = extension.toLowerCase();
        return extension == "awd";
    };
    /**
     * Tests whether a data block can be parsed by the parser.
     * @param data The data block to potentially be parsed.
     * @return Whether or not the given data is supported.
     */
    AWDParser.supportsData = function (data) {
        return (ParserUtils.toString(data, 3) == 'AWD');
    };
    /**
     * @inheritDoc
     */
    AWDParser.prototype._iResolveDependency = function (resourceDependency) {
        // this will be called when Dependency has finished loading.
        // the Assets waiting for this Bitmap, can be Texture or CubeTexture.
        // if the Bitmap is awaited by a CubeTexture, we need to check if its the last Bitmap of the CubeTexture,
        // so we know if we have to finalize the Asset (CubeTexture) or not.
        if (resourceDependency.assets.length == 1) {
            var isCubeTextureArray = resourceDependency.id.split("#");
            var ressourceID = isCubeTextureArray[0];
            var asset;
            var thisBitmapTexture;
            var block;
            if (isCubeTextureArray.length == 1) {
                asset = resourceDependency.assets[0];
                if (asset) {
                    var mat;
                    var users;
                    block = this._blocks[resourceDependency.id];
                    block.data = asset; // Store finished asset
                    // Reset name of texture to the one defined in the AWD file,
                    // as opposed to whatever the image parser came up with.
                    asset.resetAssetPath(block.name, null, true);
                    block.name = asset.name;
                    // Finalize texture asset to dispatch texture event, which was
                    // previously suppressed while the dependency was loaded.
                    this._pFinalizeAsset(asset);
                    if (this._debug) {
                        console.log("Successfully loaded Bitmap for texture");
                        console.log("Parsed texture: Name = " + block.name);
                    }
                }
            }
            if (isCubeTextureArray.length > 1) {
                thisBitmapTexture = resourceDependency.assets[0];
                var tx = thisBitmapTexture;
                this._cubeTextures[isCubeTextureArray[1]] = tx.htmlImageElement; // ?
                this._texture_users[ressourceID].push(1);
                if (this._debug) {
                    console.log("Successfully loaded Bitmap " + this._texture_users[ressourceID].length + " / 6 for Cubetexture");
                }
                if (this._texture_users[ressourceID].length == this._cubeTextures.length) {
                    var posX = this._cubeTextures[0];
                    var negX = this._cubeTextures[1];
                    var posY = this._cubeTextures[2];
                    var negY = this._cubeTextures[3];
                    var posZ = this._cubeTextures[4];
                    var negZ = this._cubeTextures[5];
                    asset = new ImageCubeTexture(posX, negX, posY, negY, posZ, negZ);
                    block = this._blocks[ressourceID];
                    block.data = asset; // Store finished asset
                    // Reset name of texture to the one defined in the AWD file,
                    // as opposed to whatever the image parser came up with.
                    asset.resetAssetPath(block.name, null, true);
                    block.name = asset.name;
                    // Finalize texture asset to dispatch texture event, which was
                    // previously suppressed while the dependency was loaded.
                    this._pFinalizeAsset(asset);
                    if (this._debug) {
                        console.log("Parsed CubeTexture: Name = " + block.name);
                    }
                }
            }
        }
    };
    /**
     * @inheritDoc
     */
    AWDParser.prototype._iResolveDependencyFailure = function (resourceDependency) {
        //not used - if a dependcy fails, the awaiting Texture or CubeTexture will never be finalized, and the default-bitmaps will be used.
        // this means, that if one Bitmap of a CubeTexture fails, the CubeTexture will have the DefaultTexture applied for all six Bitmaps.
    };
    /**
     * Resolve a dependency name
     *
     * @param resourceDependency The dependency to be resolved.
     */
    AWDParser.prototype._iResolveDependencyName = function (resourceDependency, asset) {
        var oldName = asset.name;
        if (asset) {
            var block = this._blocks[parseInt(resourceDependency.id)];
            // Reset name of texture to the one defined in the AWD file,
            // as opposed to whatever the image parser came up with.
            asset.resetAssetPath(block.name, null, true);
        }
        var newName = asset.name;
        asset.name = oldName;
        return newName;
    };
    /**
     * @inheritDoc
     */
    AWDParser.prototype._pProceedParsing = function () {
        if (!this._startedParsing) {
            this._byteData = this._pGetByteData(); //getByteData();
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
            }
            this._parsed_header = true;
        }
        if (this._body) {
            while (this._body.getBytesAvailable() > 0 && !this.parsingPaused) {
                this.parseNextBlock();
            }
            //----------------------------------------------------------------------------
            // Return complete status
            if (this._body.getBytesAvailable() == 0) {
                this.dispose();
                return ParserBase.PARSING_DONE;
            }
            else {
                return ParserBase.MORE_TO_PARSE;
            }
        }
        else {
            switch (this._compression) {
                case AWDParser.DEFLATE:
                case AWDParser.LZMA:
                    if (this._debug) {
                        console.log("(!) AWDParser Error: Compressed AWD formats not yet supported (!)");
                    }
                    break;
            }
            // Error - most likely _body not set because we do not support compression.
            return ParserBase.PARSING_DONE;
        }
    };
    AWDParser.prototype._pStartParsing = function (frameLimit) {
        _super.prototype._pStartParsing.call(this, frameLimit);
        //create a content object for Loaders
        this._pContent = new DisplayObjectContainer();
    };
    AWDParser.prototype.dispose = function () {
        for (var c in this._blocks) {
            var b = this._blocks[c];
            b.dispose();
        }
    };
    AWDParser.prototype.parseNextBlock = function () {
        var block;
        var assetData;
        var isParsed = false;
        var ns;
        var type;
        var flags;
        var len;
        this._cur_block_id = this._body.readUnsignedInt();
        ns = this._body.readUnsignedByte();
        type = this._body.readUnsignedByte();
        flags = this._body.readUnsignedByte();
        len = this._body.readUnsignedInt();
        var blockCompression = BitFlags.test(flags, BitFlags.FLAG4);
        var blockCompressionLZMA = BitFlags.test(flags, BitFlags.FLAG5);
        if (this._accuracyOnBlocks) {
            this._accuracyMatrix = BitFlags.test(flags, BitFlags.FLAG1);
            this._accuracyGeo = BitFlags.test(flags, BitFlags.FLAG2);
            this._accuracyProps = BitFlags.test(flags, BitFlags.FLAG3);
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
        var blockEndAll = this._body.position + len;
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
        var blockEndBlock = this._newBlockBytes.position + len;
        if (blockCompression) {
            this._pDieWithError('Compressed AWD formats not yet supported');
        }
        if (this._debug) {
            console.log("AWDBlock:  ID = " + this._cur_block_id + " | TypeID = " + type + " | Compression = " + blockCompression + " | Matrix-Precision = " + this._accuracyMatrix + " | Geometry-Precision = " + this._accuracyGeo + " | Properties-Precision = " + this._accuracyProps);
        }
        this._blocks[this._cur_block_id] = block;
        if ((this._version[0] == 2) && (this._version[1] == 1)) {
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
        var msgCnt = 0;
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
        }
        else {
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
    };
    //--Parser Blocks---------------------------------------------------------------------------
    //Block ID = 1
    AWDParser.prototype.parseTriangleGeometrieBlock = function (blockID) {
        var geom = new Geometry();
        // Read name and sub count
        var name = this.parseVarStr();
        var num_subs = this._newBlockBytes.readUnsignedShort();
        // Read optional properties
        var props = this.parseProperties({ 1: this._geoNrType, 2: this._geoNrType });
        var geoScaleU = props.get(1, 1);
        var geoScaleV = props.get(2, 1);
        // Loop through sub meshes
        var subs_parsed = 0;
        while (subs_parsed < num_subs) {
            var i;
            var sm_len, sm_end;
            var sub_geom;
            var w_indices;
            var weights;
            sm_len = this._newBlockBytes.readUnsignedInt();
            sm_end = this._newBlockBytes.position + sm_len;
            // Ignore for now
            var subProps = this.parseProperties({ 1: this._geoNrType, 2: this._geoNrType });
            while (this._newBlockBytes.position < sm_end) {
                var idx = 0;
                var str_ftype, str_type, str_len, str_end;
                // Type, field type, length
                str_type = this._newBlockBytes.readUnsignedByte();
                str_ftype = this._newBlockBytes.readUnsignedByte();
                str_len = this._newBlockBytes.readUnsignedInt();
                str_end = this._newBlockBytes.position + str_len;
                var x, y, z;
                if (str_type == 1) {
                    var verts = new Array();
                    while (this._newBlockBytes.position < str_end) {
                        // TODO: Respect stream field type
                        x = this.readNumber(this._accuracyGeo);
                        y = this.readNumber(this._accuracyGeo);
                        z = this.readNumber(this._accuracyGeo);
                        verts[idx++] = x;
                        verts[idx++] = y;
                        verts[idx++] = z;
                    }
                }
                else if (str_type == 2) {
                    var indices = new Array();
                    while (this._newBlockBytes.position < str_end) {
                        // TODO: Respect stream field type
                        indices[idx++] = this._newBlockBytes.readUnsignedShort();
                    }
                }
                else if (str_type == 3) {
                    var uvs = new Array();
                    while (this._newBlockBytes.position < str_end) {
                        uvs[idx++] = this.readNumber(this._accuracyGeo);
                    }
                }
                else if (str_type == 4) {
                    var normals = new Array();
                    while (this._newBlockBytes.position < str_end) {
                        normals[idx++] = this.readNumber(this._accuracyGeo);
                    }
                }
                else if (str_type == 6) {
                    w_indices = Array();
                    while (this._newBlockBytes.position < str_end) {
                        w_indices[idx++] = this._newBlockBytes.readUnsignedShort() * 3; // TODO: Respect stream field type
                    }
                }
                else if (str_type == 7) {
                    weights = new Array();
                    while (this._newBlockBytes.position < str_end) {
                        weights[idx++] = this.readNumber(this._accuracyGeo);
                    }
                }
                else {
                    this._newBlockBytes.position = str_end;
                }
            }
            this.parseUserAttributes(); // Ignore sub-mesh attributes for now
            sub_geom = new TriangleSubGeometry(true);
            if (weights)
                sub_geom.jointsPerVertex = weights.length / (verts.length / 3);
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
            var scaleU = subProps.get(1, 1);
            var scaleV = subProps.get(2, 1);
            var setSubUVs = false; //this should remain false atm, because in AwayBuilder the uv is only scaled by the geometry
            if ((geoScaleU != scaleU) || (geoScaleV != scaleV)) {
                setSubUVs = true;
                scaleU = geoScaleU / scaleU;
                scaleV = geoScaleV / scaleV;
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
        this._pFinalizeAsset(geom, name);
        this._blocks[blockID].data = geom;
        if (this._debug) {
            console.log("Parsed a TriangleGeometry: Name = " + name + "| Id = " + sub_geom.id);
        }
    };
    //Block ID = 11
    AWDParser.prototype.parsePrimitves = function (blockID) {
        var name;
        var prefab;
        var primType;
        var subs_parsed;
        var props;
        var bsm;
        // Read name and sub count
        name = this.parseVarStr();
        primType = this._newBlockBytes.readUnsignedByte();
        props = this.parseProperties({ 101: this._geoNrType, 102: this._geoNrType, 103: this._geoNrType, 110: this._geoNrType, 111: this._geoNrType, 301: AWDParser.UINT16, 302: AWDParser.UINT16, 303: AWDParser.UINT16, 701: AWDParser.BOOL, 702: AWDParser.BOOL, 703: AWDParser.BOOL, 704: AWDParser.BOOL });
        var primitiveTypes = ["Unsupported Type-ID", "PrimitivePlanePrefab", "PrimitiveCubePrefab", "PrimitiveSpherePrefab", "PrimitiveCylinderPrefab", "PrimitivesConePrefab", "PrimitivesCapsulePrefab", "PrimitivesTorusPrefab"];
        switch (primType) {
            case 1:
                prefab = new PrimitivePlanePrefab(props.get(101, 100), props.get(102, 100), props.get(301, 1), props.get(302, 1), props.get(701, true), props.get(702, false));
                break;
            case 2:
                prefab = new PrimitiveCubePrefab(props.get(101, 100), props.get(102, 100), props.get(103, 100), props.get(301, 1), props.get(302, 1), props.get(303, 1), props.get(701, true));
                break;
            case 3:
                prefab = new PrimitiveSpherePrefab(props.get(101, 50), props.get(301, 16), props.get(302, 12), props.get(701, true));
                break;
            case 4:
                prefab = new PrimitiveCylinderPrefab(props.get(101, 50), props.get(102, 50), props.get(103, 100), props.get(301, 16), props.get(302, 1), true, true, true); // bool701, bool702, bool703, bool704);
                if (!props.get(701, true))
                    prefab.topClosed = false;
                if (!props.get(702, true))
                    prefab.bottomClosed = false;
                if (!props.get(703, true))
                    prefab.yUp = false;
                break;
            case 5:
                prefab = new PrimitiveConePrefab(props.get(101, 50), props.get(102, 100), props.get(301, 16), props.get(302, 1), props.get(701, true), props.get(702, true));
                break;
            case 6:
                prefab = new PrimitiveCapsulePrefab(props.get(101, 50), props.get(102, 100), props.get(301, 16), props.get(302, 15), props.get(701, true));
                break;
            case 7:
                prefab = new PrimitiveTorusPrefab(props.get(101, 50), props.get(102, 50), props.get(301, 16), props.get(302, 8), props.get(701, true));
                break;
            default:
                prefab = new PrefabBase();
                console.log("ERROR: UNSUPPORTED PREFAB_TYPE");
                break;
        }
        if ((props.get(110, 1) != 1) || (props.get(111, 1) != 1)) {
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
    };
    // Block ID = 22
    AWDParser.prototype.parseContainer = function (blockID) {
        var name;
        var par_id;
        var mtx;
        var ctr;
        var parent;
        par_id = this._newBlockBytes.readUnsignedInt();
        mtx = this.parseMatrix3D();
        name = this.parseVarStr();
        var parentName = "Root (TopLevel)";
        ctr = new DisplayObjectContainer();
        ctr.transform.matrix3D = mtx;
        var returnedArray = this.getAssetByID(par_id, [AssetType.CONTAINER, AssetType.LIGHT, AssetType.MESH]);
        if (returnedArray[0]) {
            var obj = returnedArray[1].addChild(ctr);
            parentName = returnedArray[1].name;
        }
        else if (par_id > 0) {
            this._blocks[blockID].addError("Could not find a parent for this ObjectContainer3D");
        }
        else {
            //add to the content property
            this._pContent.addChild(ctr);
        }
        // in AWD version 2.1 we read the Container properties
        if ((this._version[0] == 2) && (this._version[1] == 1)) {
            var props = this.parseProperties({ 1: this._matrixNrType, 2: this._matrixNrType, 3: this._matrixNrType, 4: AWDParser.UINT8 });
            ctr.pivot = new Vector3D(props.get(1, 0), props.get(2, 0), props.get(3, 0));
        }
        else {
            this.parseProperties(null);
        }
        // the extraProperties should only be set for AWD2.1-Files, but is read for both versions
        ctr.extra = this.parseUserAttributes();
        this._pFinalizeAsset(ctr, name);
        this._blocks[blockID].data = ctr;
        if (this._debug) {
            console.log("Parsed a Container: Name = '" + name + "' | Parent-Name = " + parentName);
        }
    };
    // Block ID = 23
    AWDParser.prototype.parseMeshInstance = function (blockID) {
        var num_materials;
        var materials_parsed;
        var parent;
        var par_id = this._newBlockBytes.readUnsignedInt();
        var mtx = this.parseMatrix3D();
        var name = this.parseVarStr();
        var parentName = "Root (TopLevel)";
        var data_id = this._newBlockBytes.readUnsignedInt();
        var geom;
        var returnedArrayGeometry = this.getAssetByID(data_id, [AssetType.GEOMETRY]);
        if (returnedArrayGeometry[0]) {
            geom = returnedArrayGeometry[1];
        }
        else {
            this._blocks[blockID].addError("Could not find a Geometry for this Mesh. A empty Geometry is created!");
            geom = new Geometry();
        }
        this._blocks[blockID].geoID = data_id;
        var materials = new Array();
        num_materials = this._newBlockBytes.readUnsignedShort();
        var materialNames = new Array();
        materials_parsed = 0;
        var returnedArrayMaterial;
        while (materials_parsed < num_materials) {
            var mat_id;
            mat_id = this._newBlockBytes.readUnsignedInt();
            returnedArrayMaterial = this.getAssetByID(mat_id, [AssetType.MATERIAL]);
            if ((!returnedArrayMaterial[0]) && (mat_id > 0)) {
                this._blocks[blockID].addError("Could not find Material Nr " + materials_parsed + " (ID = " + mat_id + " ) for this Mesh");
            }
            var m = returnedArrayMaterial[1];
            materials.push(m);
            materialNames.push(m.name);
            materials_parsed++;
        }
        var mesh = new Mesh(geom, null);
        mesh.transform.matrix3D = mtx;
        var returnedArrayParent = this.getAssetByID(par_id, [AssetType.CONTAINER, AssetType.LIGHT, AssetType.MESH]);
        if (returnedArrayParent[0]) {
            var objC = returnedArrayParent[1];
            objC.addChild(mesh);
            parentName = objC.name;
        }
        else if (par_id > 0) {
            this._blocks[blockID].addError("Could not find a parent for this Mesh");
        }
        else {
            //add to the content property
            this._pContent.addChild(mesh);
        }
        if (materials.length >= 1 && mesh.subMeshes.length == 1) {
            mesh.material = materials[0];
        }
        else if (materials.length > 1) {
            var i;
            for (i = 0; i < mesh.subMeshes.length; i++) {
                mesh.subMeshes[i].material = materials[Math.min(materials.length - 1, i)];
            }
        }
        if ((this._version[0] == 2) && (this._version[1] == 1)) {
            var props = this.parseProperties({ 1: this._matrixNrType, 2: this._matrixNrType, 3: this._matrixNrType, 4: AWDParser.UINT8, 5: AWDParser.BOOL });
            mesh.pivot = new Vector3D(props.get(1, 0), props.get(2, 0), props.get(3, 0));
            mesh.castsShadows = props.get(5, true);
        }
        else {
            this.parseProperties(null);
        }
        mesh.extra = this.parseUserAttributes();
        this._pFinalizeAsset(mesh, name);
        this._blocks[blockID].data = mesh;
        if (this._debug) {
            console.log("Parsed a Mesh: Name = '" + name + "' | Parent-Name = " + parentName + "| Geometry-Name = " + geom.name + " | SubMeshes = " + mesh.subMeshes.length + " | Mat-Names = " + materialNames.toString());
        }
    };
    //Block ID 31
    AWDParser.prototype.parseSkyboxInstance = function (blockID) {
        var name = this.parseVarStr();
        var cubeTexAddr = this._newBlockBytes.readUnsignedInt();
        var returnedArrayCubeTex = this.getAssetByID(cubeTexAddr, [AssetType.TEXTURE], "CubeTexture");
        if ((!returnedArrayCubeTex[0]) && (cubeTexAddr != 0))
            this._blocks[blockID].addError("Could not find the Cubetexture (ID = " + cubeTexAddr + " ) for this Skybox");
        var asset = new Skybox(new SkyboxMaterial(returnedArrayCubeTex[1]));
        this.parseProperties(null);
        asset.extra = this.parseUserAttributes();
        this._pFinalizeAsset(asset, name);
        this._blocks[blockID].data = asset;
        if (this._debug)
            console.log("Parsed a Skybox: Name = '" + name + "' | CubeTexture-Name = " + returnedArrayCubeTex[1].name);
    };
    //Block ID = 41
    AWDParser.prototype.parseLight = function (blockID) {
        var light;
        var newShadowMapper;
        var par_id = this._newBlockBytes.readUnsignedInt();
        var mtx = this.parseMatrix3D();
        var name = this.parseVarStr();
        var lightType = this._newBlockBytes.readUnsignedByte();
        var props = this.parseProperties({ 1: this._propsNrType, 2: this._propsNrType, 3: AWDParser.COLOR, 4: this._propsNrType, 5: this._propsNrType, 6: AWDParser.BOOL, 7: AWDParser.COLOR, 8: this._propsNrType, 9: AWDParser.UINT8, 10: AWDParser.UINT8, 11: this._propsNrType, 12: AWDParser.UINT16, 21: this._matrixNrType, 22: this._matrixNrType, 23: this._matrixNrType });
        var shadowMapperType = props.get(9, 0);
        var parentName = "Root (TopLevel)";
        var lightTypes = ["Unsupported LightType", "PointLight", "DirectionalLight"];
        var shadowMapperTypes = ["No ShadowMapper", "DirectionalShadowMapper", "NearDirectionalShadowMapper", "CascadeShadowMapper", "CubeMapShadowMapper"];
        if (lightType == 1) {
            light = new PointLight();
            light.radius = props.get(1, 90000);
            light.fallOff = props.get(2, 100000);
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
            }
            else {
                if (props.get(10, 2) != 2) {
                    newShadowMapper.depthMapSize = this._depthSizeDic[props.get(10, 2)];
                }
            }
            light.shadowMapper = newShadowMapper;
            light.castsShadows = true;
        }
        if (par_id != 0) {
            var returnedArrayParent = this.getAssetByID(par_id, [AssetType.CONTAINER, AssetType.LIGHT, AssetType.MESH]);
            if (returnedArrayParent[0]) {
                returnedArrayParent[1].addChild(light);
                parentName = returnedArrayParent[1].name;
            }
            else {
                this._blocks[blockID].addError("Could not find a parent for this Light");
            }
        }
        else {
            //add to the content property
            this._pContent.addChild(light);
        }
        this.parseUserAttributes();
        this._pFinalizeAsset(light, name);
        this._blocks[blockID].data = light;
        if (this._debug)
            console.log("Parsed a Light: Name = '" + name + "' | Type = " + lightTypes[lightType] + " | Parent-Name = " + parentName + " | ShadowMapper-Type = " + shadowMapperTypes[shadowMapperType]);
    };
    //Block ID = 43
    AWDParser.prototype.parseCamera = function (blockID) {
        var par_id = this._newBlockBytes.readUnsignedInt();
        var mtx = this.parseMatrix3D();
        var name = this.parseVarStr();
        var parentName = "Root (TopLevel)";
        var projection;
        this._newBlockBytes.readUnsignedByte(); //set as active camera
        this._newBlockBytes.readShort(); //lengthof lenses - not used yet
        var projectiontype = this._newBlockBytes.readShort();
        var props = this.parseProperties({ 101: this._propsNrType, 102: this._propsNrType, 103: this._propsNrType, 104: this._propsNrType });
        switch (projectiontype) {
            case 5001:
                projection = new PerspectiveProjection(props.get(101, 60));
                break;
            case 5002:
                projection = new OrthographicProjection(props.get(101, 500));
                break;
            case 5003:
                projection = new OrthographicOffCenterProjection(props.get(101, -400), props.get(102, 400), props.get(103, -300), props.get(104, 300));
                break;
            default:
                console.log("unsupportedLenstype");
                return;
        }
        var camera = new Camera(projection);
        camera.transform.matrix3D = mtx;
        var returnedArrayParent = this.getAssetByID(par_id, [AssetType.CONTAINER, AssetType.LIGHT, AssetType.MESH]);
        if (returnedArrayParent[0]) {
            var objC = returnedArrayParent[1];
            objC.addChild(camera);
            parentName = objC.name;
        }
        else if (par_id > 0) {
            this._blocks[blockID].addError("Could not find a parent for this Camera");
        }
        else {
            //add to the content property
            this._pContent.addChild(camera);
        }
        camera.name = name;
        props = this.parseProperties({ 1: this._matrixNrType, 2: this._matrixNrType, 3: this._matrixNrType, 4: AWDParser.UINT8 });
        camera.pivot = new Vector3D(props.get(1, 0), props.get(2, 0), props.get(3, 0));
        camera.extra = this.parseUserAttributes();
        this._pFinalizeAsset(camera, name);
        this._blocks[blockID].data = camera;
        if (this._debug) {
            console.log("Parsed a Camera: Name = '" + name + "' | Projectiontype = " + projection + " | Parent-Name = " + parentName);
        }
    };
    //Block ID = 51
    AWDParser.prototype.parseLightPicker = function (blockID) {
        var name = this.parseVarStr();
        var numLights = this._newBlockBytes.readUnsignedShort();
        var lightsArray = new Array();
        var k = 0;
        var lightID = 0;
        var returnedArrayLight;
        var lightsArrayNames = new Array();
        for (k = 0; k < numLights; k++) {
            lightID = this._newBlockBytes.readUnsignedInt();
            returnedArrayLight = this.getAssetByID(lightID, [AssetType.LIGHT]);
            if (returnedArrayLight[0]) {
                lightsArray.push(returnedArrayLight[1]);
                lightsArrayNames.push(returnedArrayLight[1].name);
            }
            else {
                this._blocks[blockID].addError("Could not find a Light Nr " + k + " (ID = " + lightID + " ) for this LightPicker");
            }
        }
        if (lightsArray.length == 0) {
            this._blocks[blockID].addError("Could not create this LightPicker, cause no Light was found.");
            this.parseUserAttributes();
            return; //return without any more parsing for this block
        }
        var lightPick = new StaticLightPicker(lightsArray);
        lightPick.name = name;
        this.parseUserAttributes();
        this._pFinalizeAsset(lightPick, name);
        this._blocks[blockID].data = lightPick;
        if (this._debug) {
            console.log("Parsed a StaticLightPicker: Name = '" + name + "' | Texture-Name = " + lightsArrayNames.toString());
        }
    };
    //Block ID = 81
    AWDParser.prototype.parseMaterial = function (blockID) {
        // TODO: not used
        ////blockLength = block.len;
        var name;
        var type;
        var props;
        var mat;
        var attributes;
        var finalize;
        var num_methods;
        var methods_parsed;
        var returnedArray;
        name = this.parseVarStr();
        type = this._newBlockBytes.readUnsignedByte();
        num_methods = this._newBlockBytes.readUnsignedByte();
        // Read material numerical properties
        // (1=color, 2=bitmap url, 10=alpha, 11=alpha_blending, 12=alpha_threshold, 13=repeat)
        props = this.parseProperties({ 1: AWDParser.INT32, 2: AWDParser.BADDR, 10: this._propsNrType, 11: AWDParser.BOOL, 12: this._propsNrType, 13: AWDParser.BOOL });
        methods_parsed = 0;
        while (methods_parsed < num_methods) {
            var method_type;
            method_type = this._newBlockBytes.readUnsignedShort();
            this.parseProperties(null);
            this.parseUserAttributes();
            methods_parsed += 1;
        }
        var debugString = "";
        attributes = this.parseUserAttributes();
        if (type === 1) {
            debugString += "Parsed a ColorMaterial(SinglePass): Name = '" + name + "' | ";
            var color;
            color = props.get(1, 0xffffff);
            if (this.materialMode < 2) {
                mat = new TriangleMethodMaterial(color, props.get(10, 1.0));
            }
            else {
                mat = new TriangleMethodMaterial(color);
                mat.materialMode = TriangleMaterialMode.MULTI_PASS;
            }
        }
        else if (type === 2) {
            var tex_addr = props.get(2, 0);
            returnedArray = this.getAssetByID(tex_addr, [AssetType.TEXTURE]);
            if ((!returnedArray[0]) && (tex_addr > 0))
                this._blocks[blockID].addError("Could not find the DiffsueTexture (ID = " + tex_addr + " ) for this Material");
            mat = new TriangleMethodMaterial(returnedArray[1]);
            if (this.materialMode < 2) {
                mat.alphaBlending = props.get(11, false);
                mat.alpha = props.get(10, 1.0);
                debugString += "Parsed a TriangleMethodMaterial(SinglePass): Name = '" + name + "' | Texture-Name = " + mat.name;
            }
            else {
                mat.materialMode = TriangleMaterialMode.MULTI_PASS;
                debugString += "Parsed a TriangleMethodMaterial(MultiPass): Name = '" + name + "' | Texture-Name = " + mat.name;
            }
        }
        mat.extra = attributes;
        mat.alphaThreshold = props.get(12, 0.0);
        mat.repeat = props.get(13, false);
        this._pFinalizeAsset(mat, name);
        this._blocks[blockID].data = mat;
        if (this._debug) {
            console.log(debugString);
        }
    };
    // Block ID = 81 AWD2.1
    AWDParser.prototype.parseMaterial_v1 = function (blockID) {
        var mat;
        var normalTexture;
        var specTexture;
        var returnedArray;
        var name = this.parseVarStr();
        var type = this._newBlockBytes.readUnsignedByte();
        var num_methods = this._newBlockBytes.readUnsignedByte();
        var props = this.parseProperties({ 1: AWDParser.UINT32, 2: AWDParser.BADDR, 3: AWDParser.BADDR, 4: AWDParser.UINT8, 5: AWDParser.BOOL, 6: AWDParser.BOOL, 7: AWDParser.BOOL, 8: AWDParser.BOOL, 9: AWDParser.UINT8, 10: this._propsNrType, 11: AWDParser.BOOL, 12: this._propsNrType, 13: AWDParser.BOOL, 15: this._propsNrType, 16: AWDParser.UINT32, 17: AWDParser.BADDR, 18: this._propsNrType, 19: this._propsNrType, 20: AWDParser.UINT32, 21: AWDParser.BADDR, 22: AWDParser.BADDR });
        var spezialType = props.get(4, 0);
        var debugString = "";
        if (spezialType >= 2) {
            this._blocks[blockID].addError("Material-spezialType '" + spezialType + "' is not supported, can only be 0:singlePass, 1:MultiPass !");
            return;
        }
        if (this.materialMode == 1)
            spezialType = 0;
        else if (this.materialMode == 2)
            spezialType = 1;
        if (spezialType < 2) {
            if (type == 1) {
                var color = props.get(1, 0xcccccc); //TODO temporarily swapped so that diffuse color goes to ambient
                if (spezialType == 1) {
                    mat = new TriangleMethodMaterial(color);
                    mat.materialMode = TriangleMaterialMode.MULTI_PASS;
                    debugString += "Parsed a ColorMaterial(MultiPass): Name = '" + name + "' | ";
                }
                else {
                    mat = new TriangleMethodMaterial(color, props.get(10, 1.0));
                    mat.alphaBlending = props.get(11, false);
                    debugString += "Parsed a ColorMaterial(SinglePass): Name = '" + name + "' | ";
                }
            }
            else if (type == 2) {
                var tex_addr = props.get(2, 0); //TODO temporarily swapped so that diffuse texture goes to ambient
                returnedArray = this.getAssetByID(tex_addr, [AssetType.TEXTURE]);
                if ((!returnedArray[0]) && (tex_addr > 0))
                    this._blocks[blockID].addError("Could not find the AmbientTexture (ID = " + tex_addr + " ) for this TriangleMethodMaterial");
                var texture = returnedArray[1];
                mat = new TriangleMethodMaterial(texture);
                if (spezialType == 1) {
                    mat.materialMode = TriangleMaterialMode.MULTI_PASS;
                    debugString += "Parsed a TriangleMethodMaterial(MultiPass): Name = '" + name + "' | Texture-Name = " + texture.name;
                }
                else {
                    mat.alpha = props.get(10, 1.0);
                    mat.alphaBlending = props.get(11, false);
                    debugString += "Parsed a TriangleMethodMaterial(SinglePass): Name = '" + name + "' | Texture-Name = " + texture.name;
                }
            }
            var diffuseTexture;
            var diffuseTex_addr = props.get(17, 0);
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
            var normalTex_addr = props.get(3, 0);
            returnedArray = this.getAssetByID(normalTex_addr, [AssetType.TEXTURE]);
            if ((!returnedArray[0]) && (normalTex_addr != 0)) {
                this._blocks[blockID].addError("Could not find the NormalTexture (ID = " + normalTex_addr + " ) for this TriangleMethodMaterial");
            }
            if (returnedArray[0]) {
                normalTexture = returnedArray[1];
                debugString += " | NormalTexture-Name = " + normalTexture.name;
            }
            var specTex_addr = props.get(21, 0);
            returnedArray = this.getAssetByID(specTex_addr, [AssetType.TEXTURE]);
            if ((!returnedArray[0]) && (specTex_addr != 0)) {
                this._blocks[blockID].addError("Could not find the SpecularTexture (ID = " + specTex_addr + " ) for this TriangleMethodMaterial");
            }
            if (returnedArray[0]) {
                specTexture = returnedArray[1];
                debugString += " | SpecularTexture-Name = " + specTexture.name;
            }
            var lightPickerAddr = props.get(22, 0);
            returnedArray = this.getAssetByID(lightPickerAddr, [AssetType.LIGHT_PICKER]);
            if ((!returnedArray[0]) && (lightPickerAddr)) {
                this._blocks[blockID].addError("Could not find the LightPicker (ID = " + lightPickerAddr + " ) for this TriangleMethodMaterial");
            }
            else {
                mat.lightPicker = returnedArray[1];
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
            var methods_parsed = 0;
            var targetID;
            while (methods_parsed < num_methods) {
                var method_type;
                method_type = this._newBlockBytes.readUnsignedShort();
                props = this.parseProperties({ 1: AWDParser.BADDR, 2: AWDParser.BADDR, 3: AWDParser.BADDR, 101: this._propsNrType, 102: this._propsNrType, 103: this._propsNrType, 201: AWDParser.UINT32, 202: AWDParser.UINT32, 301: AWDParser.UINT16, 302: AWDParser.UINT16, 401: AWDParser.UINT8, 402: AWDParser.UINT8, 601: AWDParser.COLOR, 602: AWDParser.COLOR, 701: AWDParser.BOOL, 702: AWDParser.BOOL, 801: AWDParser.MTX4x4 });
                switch (method_type) {
                    case 999:
                        targetID = props.get(1, 0);
                        returnedArray = this.getAssetByID(targetID, [AssetType.EFFECTS_METHOD]);
                        if (!returnedArray[0]) {
                            this._blocks[blockID].addError("Could not find the EffectMethod (ID = " + targetID + " ) for this Material");
                        }
                        else {
                            mat.addEffectMethod(returnedArray[1]);
                            debugString += " | EffectMethod-Name = " + returnedArray[1].name;
                        }
                        break;
                    case 998:
                        targetID = props.get(1, 0);
                        returnedArray = this.getAssetByID(targetID, [AssetType.SHADOW_MAP_METHOD]);
                        if (!returnedArray[0]) {
                            this._blocks[blockID].addError("Could not find the ShadowMethod (ID = " + targetID + " ) for this Material");
                        }
                        else {
                            mat.shadowMethod = returnedArray[1];
                            debugString += " | ShadowMethod-Name = " + returnedArray[1].name;
                        }
                        break;
                    case 1:
                        targetID = props.get(1, 0);
                        returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE], "CubeTexture");
                        if (!returnedArray[0])
                            this._blocks[blockID].addError("Could not find the EnvMap (ID = " + targetID + " ) for this EnvMapAmbientMethodMaterial");
                        mat.ambientMethod = new AmbientEnvMapMethod(returnedArray[1]);
                        debugString += " | AmbientEnvMapMethod | EnvMap-Name =" + returnedArray[1].name;
                        break;
                    case 51:
                        mat.diffuseMethod = new DiffuseDepthMethod();
                        debugString += " | DiffuseDepthMethod";
                        break;
                    case 52:
                        targetID = props.get(1, 0);
                        returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE]);
                        if (!returnedArray[0])
                            this._blocks[blockID].addError("Could not find the GradientDiffuseTexture (ID = " + targetID + " ) for this GradientDiffuseMethod");
                        mat.diffuseMethod = new DiffuseGradientMethod(returnedArray[1]);
                        debugString += " | DiffuseGradientMethod | GradientDiffuseTexture-Name =" + returnedArray[1].name;
                        break;
                    case 53:
                        mat.diffuseMethod = new DiffuseWrapMethod(props.get(101, 5));
                        debugString += " | DiffuseWrapMethod";
                        break;
                    case 54:
                        targetID = props.get(1, 0);
                        returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE]);
                        if (!returnedArray[0])
                            this._blocks[blockID].addError("Could not find the LightMap (ID = " + targetID + " ) for this LightMapDiffuseMethod");
                        mat.diffuseMethod = new DiffuseLightMapMethod(returnedArray[1], this.blendModeDic[props.get(401, 10)], false, mat.diffuseMethod);
                        debugString += " | DiffuseLightMapMethod | LightMapTexture-Name =" + returnedArray[1].name;
                        break;
                    case 55:
                        mat.diffuseMethod = new DiffuseCelMethod(props.get(401, 3), mat.diffuseMethod);
                        mat.diffuseMethod.smoothness = props.get(101, 0.1);
                        debugString += " | DiffuseCelMethod";
                        break;
                    case 56:
                        break;
                    case 101:
                        mat.specularMethod = new SpecularAnisotropicMethod();
                        debugString += " | SpecularAnisotropicMethod";
                        break;
                    case 102:
                        mat.specularMethod = new SpecularPhongMethod();
                        debugString += " | SpecularPhongMethod";
                        break;
                    case 103:
                        mat.specularMethod = new SpecularCelMethod(props.get(101, 0.5), mat.specularMethod);
                        mat.specularMethod.smoothness = props.get(102, 0.1);
                        debugString += " | SpecularCelMethod";
                        break;
                    case 104:
                        mat.specularMethod = new SpecularFresnelMethod(props.get(701, true), mat.specularMethod);
                        mat.specularMethod.fresnelPower = props.get(101, 5);
                        mat.specularMethod.normalReflectance = props.get(102, 0.1);
                        debugString += " | SpecularFresnelMethod";
                        break;
                    case 151:
                        break;
                    case 152:
                        targetID = props.get(1, 0);
                        returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE]);
                        if (!returnedArray[0])
                            this._blocks[blockID].addError("Could not find the SecoundNormalMap (ID = " + targetID + " ) for this SimpleWaterNormalMethod");
                        if (!mat.normalMap)
                            this._blocks[blockID].addError("Could not find a normal Map on this Material to use with this SimpleWaterNormalMethod");
                        mat.normalMap = returnedArray[1];
                        mat.normalMethod = new NormalSimpleWaterMethod(mat.normalMap, returnedArray[1]);
                        debugString += " | NormalSimpleWaterMethod | Second-NormalTexture-Name = " + returnedArray[1].name;
                        break;
                }
                this.parseUserAttributes();
                methods_parsed += 1;
            }
        }
        mat.extra = this.parseUserAttributes();
        this._pFinalizeAsset(mat, name);
        this._blocks[blockID].data = mat;
        if (this._debug) {
            console.log(debugString);
        }
    };
    //Block ID = 82
    AWDParser.prototype.parseTexture = function (blockID) {
        var asset;
        this._blocks[blockID].name = this.parseVarStr();
        var type = this._newBlockBytes.readUnsignedByte();
        var data_len;
        this._texture_users[this._cur_block_id.toString()] = [];
        // External
        if (type == 0) {
            data_len = this._newBlockBytes.readUnsignedInt();
            var url;
            url = this._newBlockBytes.readUTFBytes(data_len);
            this._pAddDependency(this._cur_block_id.toString(), new URLRequest(url), false, null, true);
        }
        else {
            data_len = this._newBlockBytes.readUnsignedInt();
            var data;
            data = new ByteArray();
            this._newBlockBytes.readBytes(data, 0, data_len);
            //
            // AWDParser - Fix for FireFox Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=715075 .
            //
            // Converting data to image here instead of parser - fix FireFox bug where image width / height is 0 when created from data
            // This gives the browser time to initialise image width / height.
            this._pAddDependency(this._cur_block_id.toString(), null, false, ParserUtils.byteArrayToImage(data), true);
        }
        // Ignore for now
        this.parseProperties(null);
        this._blocks[blockID].extras = this.parseUserAttributes();
        this._pPauseAndRetrieveDependencies();
        this._blocks[blockID].data = asset;
        if (this._debug) {
            var textureStylesNames = ["external", "embed"];
            console.log("Start parsing a " + textureStylesNames[type] + " Bitmap for Texture");
        }
    };
    //Block ID = 83
    AWDParser.prototype.parseCubeTexture = function (blockID) {
        //blockLength = block.len;
        var data_len;
        var asset;
        var i;
        this._cubeTextures = new Array();
        this._texture_users[this._cur_block_id.toString()] = [];
        var type = this._newBlockBytes.readUnsignedByte();
        this._blocks[blockID].name = this.parseVarStr();
        for (i = 0; i < 6; i++) {
            this._texture_users[this._cur_block_id.toString()] = [];
            this._cubeTextures.push(null);
            // External
            if (type == 0) {
                data_len = this._newBlockBytes.readUnsignedInt();
                var url;
                url = this._newBlockBytes.readUTFBytes(data_len);
                this._pAddDependency(this._cur_block_id.toString() + "#" + i, new URLRequest(url), false, null, true);
            }
            else {
                data_len = this._newBlockBytes.readUnsignedInt();
                var data;
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
            var textureStylesNames = ["external", "embed"];
            console.log("Start parsing 6 " + textureStylesNames[type] + " Bitmaps for CubeTexture");
        }
    };
    //Block ID = 91
    AWDParser.prototype.parseSharedMethodBlock = function (blockID) {
        var asset;
        this._blocks[blockID].name = this.parseVarStr();
        asset = this.parseSharedMethodList(blockID);
        this.parseUserAttributes();
        this._blocks[blockID].data = asset;
        this._pFinalizeAsset(asset, this._blocks[blockID].name);
        this._blocks[blockID].data = asset;
        if (this._debug) {
            console.log("Parsed a EffectMethod: Name = " + asset.name + " Type = " + asset);
        }
    };
    //Block ID = 92
    AWDParser.prototype.parseShadowMethodBlock = function (blockID) {
        var type;
        var data_len;
        var asset;
        var shadowLightID;
        this._blocks[blockID].name = this.parseVarStr();
        shadowLightID = this._newBlockBytes.readUnsignedInt();
        var returnedArray = this.getAssetByID(shadowLightID, [AssetType.LIGHT]);
        if (!returnedArray[0]) {
            this._blocks[blockID].addError("Could not find the TargetLight (ID = " + shadowLightID + " ) for this ShadowMethod - ShadowMethod not created");
            return;
        }
        asset = this.parseShadowMethodList(returnedArray[1], blockID);
        if (!asset)
            return;
        this.parseUserAttributes(); // Ignore for now
        this._pFinalizeAsset(asset, this._blocks[blockID].name);
        this._blocks[blockID].data = asset;
        if (this._debug) {
            console.log("Parsed a ShadowMapMethodMethod: Name = " + asset.name + " | Type = " + asset + " | Light-Name = ", returnedArray[1].name);
        }
    };
    //Block ID = 253
    AWDParser.prototype.parseCommand = function (blockID) {
        var hasBlocks = (this._newBlockBytes.readUnsignedByte() == 1);
        var par_id = this._newBlockBytes.readUnsignedInt();
        var mtx = this.parseMatrix3D();
        var name = this.parseVarStr();
        var parentObject;
        var targetObject;
        var returnedArray = this.getAssetByID(par_id, [AssetType.CONTAINER, AssetType.LIGHT, AssetType.MESH]);
        if (returnedArray[0]) {
            parentObject = returnedArray[1];
        }
        var numCommands = this._newBlockBytes.readShort();
        var typeCommand = this._newBlockBytes.readShort();
        var props = this.parseProperties({ 1: AWDParser.BADDR });
        switch (typeCommand) {
            case 1:
                var targetID = props.get(1, 0);
                var returnedArrayTarget = this.getAssetByID(targetID, [AssetType.LIGHT, AssetType.TEXTURE_PROJECTOR]); //for no only light is requested!!!!
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
            props = this.parseProperties({ 1: this._matrixNrType, 2: this._matrixNrType, 3: this._matrixNrType, 4: AWDParser.UINT8 });
            targetObject.pivot = new Vector3D(props.get(1, 0), props.get(2, 0), props.get(3, 0));
            targetObject.extra = this.parseUserAttributes();
        }
        this._blocks[blockID].data = targetObject;
        if (this._debug) {
            console.log("Parsed a CommandBlock: Name = '" + name);
        }
    };
    //blockID 255
    AWDParser.prototype.parseMetaData = function (blockID) {
        var props = this.parseProperties({ 1: AWDParser.UINT32, 2: AWDParser.AWDSTRING, 3: AWDParser.AWDSTRING, 4: AWDParser.AWDSTRING, 5: AWDParser.AWDSTRING });
        if (this._debug) {
            console.log("Parsed a MetaDataBlock: TimeStamp         = " + props.get(1, 0));
            console.log("                        EncoderName       = " + props.get(2, "unknown"));
            console.log("                        EncoderVersion    = " + props.get(3, "unknown"));
            console.log("                        GeneratorName     = " + props.get(4, "unknown"));
            console.log("                        GeneratorVersion  = " + props.get(5, "unknown"));
        }
    };
    //blockID 254
    AWDParser.prototype.parseNameSpace = function (blockID) {
        var id = this._newBlockBytes.readUnsignedByte();
        var nameSpaceString = this.parseVarStr();
        if (this._debug)
            console.log("Parsed a NameSpaceBlock: ID = " + id + " | String = " + nameSpaceString);
    };
    //--Parser UTILS---------------------------------------------------------------------------
    // this functions reads and creates a ShadowMethodMethod
    AWDParser.prototype.parseShadowMethodList = function (light, blockID) {
        var methodType = this._newBlockBytes.readUnsignedShort();
        var shadowMethod;
        var props = this.parseProperties({ 1: AWDParser.BADDR, 2: AWDParser.BADDR, 3: AWDParser.BADDR, 101: this._propsNrType, 102: this._propsNrType, 103: this._propsNrType, 201: AWDParser.UINT32, 202: AWDParser.UINT32, 301: AWDParser.UINT16, 302: AWDParser.UINT16, 401: AWDParser.UINT8, 402: AWDParser.UINT8, 601: AWDParser.COLOR, 602: AWDParser.COLOR, 701: AWDParser.BOOL, 702: AWDParser.BOOL, 801: AWDParser.MTX4x4 });
        var targetID;
        var returnedArray;
        switch (methodType) {
            case 1002:
                targetID = props.get(1, 0);
                returnedArray = this.getAssetByID(targetID, [AssetType.SHADOW_MAP_METHOD]);
                if (!returnedArray[0]) {
                    this._blocks[blockID].addError("Could not find the ShadowBaseMethod (ID = " + targetID + " ) for this ShadowNearMethod - ShadowMethod not created");
                    return shadowMethod;
                }
                shadowMethod = new ShadowNearMethod(returnedArray[1]);
                break;
            case 1101:
                shadowMethod = new ShadowFilteredMethod(light);
                shadowMethod.alpha = props.get(101, 1);
                shadowMethod.epsilon = props.get(102, 0.002);
                break;
            case 1102:
                shadowMethod = new ShadowDitheredMethod(light, props.get(201, 5));
                shadowMethod.alpha = props.get(101, 1);
                shadowMethod.epsilon = props.get(102, 0.002);
                shadowMethod.range = props.get(103, 1);
                break;
            case 1103:
                shadowMethod = new ShadowSoftMethod(light, props.get(201, 5));
                shadowMethod.alpha = props.get(101, 1);
                shadowMethod.epsilon = props.get(102, 0.002);
                shadowMethod.range = props.get(103, 1);
                break;
            case 1104:
                shadowMethod = new ShadowHardMethod(light);
                shadowMethod.alpha = props.get(101, 1);
                shadowMethod.epsilon = props.get(102, 0.002);
                break;
        }
        this.parseUserAttributes();
        return shadowMethod;
    };
    //Block ID 101
    AWDParser.prototype.parseSkeleton = function (blockID /*uint*/) {
        var name = this.parseVarStr();
        var num_joints = this._newBlockBytes.readUnsignedShort();
        var skeleton = new Skeleton();
        this.parseProperties(null); // Discard properties for now		
        var joints_parsed = 0;
        while (joints_parsed < num_joints) {
            var joint;
            var ibp;
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
    };
    //Block ID = 102
    AWDParser.prototype.parseSkeletonPose = function (blockID /*uint*/) {
        var name = this.parseVarStr();
        var num_joints = this._newBlockBytes.readUnsignedShort();
        this.parseProperties(null); // Ignore properties for now
        var pose = new SkeletonPose();
        var joints_parsed = 0;
        while (joints_parsed < num_joints) {
            var joint_pose;
            var has_transform /*uint*/;
            joint_pose = new JointPose();
            has_transform = this._newBlockBytes.readUnsignedByte();
            if (has_transform == 1) {
                var mtx_data = this.parseMatrix43RawData();
                var mtx = new Matrix3D(mtx_data);
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
    };
    //blockID 103
    AWDParser.prototype.parseSkeletonAnimation = function (blockID /*uint*/) {
        var frame_dur;
        var pose_addr /*uint*/;
        var name = this.parseVarStr();
        var clip = new SkeletonClipNode();
        var num_frames = this._newBlockBytes.readUnsignedShort();
        this.parseProperties(null); // Ignore properties for now
        var frames_parsed = 0;
        var returnedArray;
        while (frames_parsed < num_frames) {
            pose_addr = this._newBlockBytes.readUnsignedInt();
            frame_dur = this._newBlockBytes.readUnsignedShort();
            returnedArray = this.getAssetByID(pose_addr, [AssetType.SKELETON_POSE]);
            if (!returnedArray[0])
                this._blocks[blockID].addError("Could not find the SkeletonPose Frame # " + frames_parsed + " (ID = " + pose_addr + " ) for this SkeletonClipNode");
            else
                clip.addFrame(this._blocks[pose_addr].data, frame_dur);
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
    };
    //Block ID = 111 /  Block ID = 112
    AWDParser.prototype.parseMeshPoseAnimation = function (blockID /*uint*/, poseOnly) {
        if (poseOnly === void 0) { poseOnly = false; }
        var num_frames = 1;
        var num_submeshes /*uint*/;
        var frames_parsed /*uint*/;
        var subMeshParsed /*uint*/;
        var frame_dur;
        var x;
        var y;
        var z;
        var str_len;
        var str_end;
        var geometry;
        var subGeom;
        var idx = 0;
        var clip = new VertexClipNode();
        var indices /*uint*/;
        var verts;
        var num_Streams = 0;
        var streamsParsed = 0;
        var streamtypes = new Array() /*int*/;
        var props;
        var thisGeo;
        var name = this.parseVarStr();
        var geoAdress = this._newBlockBytes.readUnsignedInt();
        var returnedArray = this.getAssetByID(geoAdress, [AssetType.GEOMETRY]);
        if (!returnedArray[0]) {
            this._blocks[blockID].addError("Could not find the target-Geometry-Object " + geoAdress + " ) for this VertexClipNode");
            return;
        }
        var uvs = this.getUVForVertexAnimation(geoAdress);
        if (!poseOnly)
            num_frames = this._newBlockBytes.readUnsignedShort();
        num_submeshes = this._newBlockBytes.readUnsignedShort();
        num_Streams = this._newBlockBytes.readUnsignedShort();
        streamsParsed = 0;
        while (streamsParsed < num_Streams) {
            streamtypes.push(this._newBlockBytes.readUnsignedShort());
            streamsParsed++;
        }
        props = this.parseProperties({ 1: AWDParser.BOOL, 2: AWDParser.BOOL });
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
                        indices = returnedArray[1].subGeometries[subMeshParsed].indices;
                        verts = new Array();
                        idx = 0;
                        while (this._newBlockBytes.position < str_end) {
                            x = this.readNumber(this._accuracyGeo);
                            y = this.readNumber(this._accuracyGeo);
                            z = this.readNumber(this._accuracyGeo);
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
                        geometry.addSubGeometry(subGeom);
                    }
                    else
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
            console.log("Parsed a VertexClipNode: Name = " + clip.name + " | Target-Geometry-Name = " + returnedArray[1].name + " | Number of Frames = " + clip.frames.length);
    };
    //BlockID 113
    AWDParser.prototype.parseVertexAnimationSet = function (blockID /*uint*/) {
        var poseBlockAdress; /*int*/
        var outputString = "";
        var name = this.parseVarStr();
        var num_frames = this._newBlockBytes.readUnsignedShort();
        var props = this.parseProperties({ 1: AWDParser.UINT16 });
        var frames_parsed = 0;
        var skeletonFrames = new Array();
        var vertexFrames = new Array();
        while (frames_parsed < num_frames) {
            poseBlockAdress = this._newBlockBytes.readUnsignedInt();
            var returnedArray = this.getAssetByID(poseBlockAdress, [AssetType.ANIMATION_NODE]);
            if (!returnedArray[0])
                this._blocks[blockID].addError("Could not find the AnimationClipNode Nr " + frames_parsed + " ( " + poseBlockAdress + " ) for this AnimationSet");
            else {
                if (returnedArray[1] instanceof VertexClipNode)
                    vertexFrames.push(returnedArray[1]);
                if (returnedArray[1] instanceof SkeletonClipNode)
                    skeletonFrames.push(returnedArray[1]);
            }
            frames_parsed++;
        }
        if ((vertexFrames.length == 0) && (skeletonFrames.length == 0)) {
            this._blocks[blockID].addError("Could not create this AnimationSet, because it contains no animations");
            return;
        }
        this.parseUserAttributes();
        if (vertexFrames.length > 0) {
            var newVertexAnimationSet = new VertexAnimationSet();
            for (var i = 0; i < vertexFrames.length; i++)
                newVertexAnimationSet.addAnimation(vertexFrames[i]);
            this._pFinalizeAsset(newVertexAnimationSet, name);
            this._blocks[blockID].data = newVertexAnimationSet;
            if (this._debug)
                console.log("Parsed a VertexAnimationSet: Name = " + name + " | Animations = " + newVertexAnimationSet.animations.length + " | Animation-Names = " + newVertexAnimationSet.animationNames.toString());
        }
        else if (skeletonFrames.length > 0) {
            returnedArray = this.getAssetByID(poseBlockAdress, [AssetType.ANIMATION_NODE]);
            var newSkeletonAnimationSet = new SkeletonAnimationSet(props.get(1, 4)); //props.get(1,4));
            for (var i = 0; i < skeletonFrames.length; i++)
                newSkeletonAnimationSet.addAnimation(skeletonFrames[i]);
            this._pFinalizeAsset(newSkeletonAnimationSet, name);
            this._blocks[blockID].data = newSkeletonAnimationSet;
            if (this._debug)
                console.log("Parsed a SkeletonAnimationSet: Name = " + name + " | Animations = " + newSkeletonAnimationSet.animations.length + " | Animation-Names = " + newSkeletonAnimationSet.animationNames.toString());
        }
    };
    //BlockID 122
    AWDParser.prototype.parseAnimatorSet = function (blockID /*uint*/) {
        var targetMesh;
        var animSetBlockAdress; /*int*/
        var targetAnimationSet;
        var outputString = "";
        var name = this.parseVarStr();
        var type = this._newBlockBytes.readUnsignedShort();
        var props = this.parseProperties({ 1: AWDParser.BADDR });
        animSetBlockAdress = this._newBlockBytes.readUnsignedInt();
        var targetMeshLength = this._newBlockBytes.readUnsignedShort();
        var meshAdresses = new Array() /*uint*/;
        for (var i = 0; i < targetMeshLength; i++)
            meshAdresses.push(this._newBlockBytes.readUnsignedInt());
        var activeState = this._newBlockBytes.readUnsignedShort();
        var autoplay = (this._newBlockBytes.readUnsignedByte() == 1);
        this.parseUserAttributes();
        this.parseUserAttributes();
        var returnedArray;
        var targetMeshes = new Array();
        for (i = 0; i < meshAdresses.length; i++) {
            returnedArray = this.getAssetByID(meshAdresses[i], [AssetType.MESH]);
            if (returnedArray[0])
                targetMeshes.push(returnedArray[1]);
        }
        returnedArray = this.getAssetByID(animSetBlockAdress, [AssetType.ANIMATION_SET]);
        if (!returnedArray[0]) {
            this._blocks[blockID].addError("Could not find the AnimationSet ( " + animSetBlockAdress + " ) for this Animator");
            ;
            return;
        }
        targetAnimationSet = returnedArray[1];
        var thisAnimator;
        if (type == 1) {
            returnedArray = this.getAssetByID(props.get(1, 0), [AssetType.SKELETON]);
            if (!returnedArray[0]) {
                this._blocks[blockID].addError("Could not find the Skeleton ( " + props.get(1, 0) + " ) for this Animator");
                return;
            }
            thisAnimator = new SkeletonAnimator(targetAnimationSet, returnedArray[1]);
        }
        else if (type == 2)
            thisAnimator = new VertexAnimator(targetAnimationSet);
        this._pFinalizeAsset(thisAnimator, name);
        this._blocks[blockID].data = thisAnimator;
        for (i = 0; i < targetMeshes.length; i++) {
            if (type == 1)
                targetMeshes[i].animator = thisAnimator;
            if (type == 2)
                targetMeshes[i].animator = thisAnimator;
        }
        if (this._debug)
            console.log("Parsed a Animator: Name = " + name);
    };
    // this functions reads and creates a EffectMethod
    AWDParser.prototype.parseSharedMethodList = function (blockID) {
        var methodType = this._newBlockBytes.readUnsignedShort();
        var effectMethodReturn;
        var props = this.parseProperties({ 1: AWDParser.BADDR, 2: AWDParser.BADDR, 3: AWDParser.BADDR, 101: this._propsNrType, 102: this._propsNrType, 103: this._propsNrType, 104: this._propsNrType, 105: this._propsNrType, 106: this._propsNrType, 107: this._propsNrType, 201: AWDParser.UINT32, 202: AWDParser.UINT32, 301: AWDParser.UINT16, 302: AWDParser.UINT16, 401: AWDParser.UINT8, 402: AWDParser.UINT8, 601: AWDParser.COLOR, 602: AWDParser.COLOR, 701: AWDParser.BOOL, 702: AWDParser.BOOL });
        var targetID;
        var returnedArray;
        switch (methodType) {
            case 401:
                effectMethodReturn = new EffectColorMatrixMethod(props.get(101, new Array(0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)));
                break;
            case 402:
                effectMethodReturn = new EffectColorTransformMethod();
                var offCol = props.get(601, 0x00000000);
                effectMethodReturn.colorTransform = new ColorTransform(props.get(102, 1), props.get(103, 1), props.get(104, 1), props.get(101, 1), ((offCol >> 16) & 0xFF), ((offCol >> 8) & 0xFF), (offCol & 0xFF), ((offCol >> 24) & 0xFF));
                break;
            case 403:
                targetID = props.get(1, 0);
                console.log('ENV MAP', targetID);
                returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE], "CubeTexture");
                if (!returnedArray[0])
                    this._blocks[blockID].addError("Could not find the EnvMap (ID = " + targetID + " ) for this EnvMapMethod");
                effectMethodReturn = new EffectEnvMapMethod(returnedArray[1], props.get(101, 1));
                targetID = props.get(2, 0);
                if (targetID > 0) {
                    returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE]);
                    if (!returnedArray[0])
                        this._blocks[blockID].addError("Could not find the Mask-texture (ID = " + targetID + " ) for this EnvMapMethod");
                }
                break;
            case 404:
                targetID = props.get(1, 0);
                returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE]);
                if (!returnedArray[0])
                    this._blocks[blockID].addError("Could not find the LightMap (ID = " + targetID + " ) for this LightMapMethod");
                effectMethodReturn = new EffectLightMapMethod(returnedArray[1], this.blendModeDic[props.get(401, 10)]); //usesecondaryUV not set
                break;
            case 406:
                effectMethodReturn = new EffectRimLightMethod(props.get(601, 0xffffff), props.get(101, 0.4), props.get(101, 2)); //blendMode
                break;
            case 407:
                targetID = props.get(1, 0);
                returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE]);
                if (!returnedArray[0])
                    this._blocks[blockID].addError("Could not find the Alpha-texture (ID = " + targetID + " ) for this AlphaMaskMethod");
                effectMethodReturn = new EffectAlphaMaskMethod(returnedArray[1], props.get(701, false));
                break;
            case 410:
                targetID = props.get(1, 0);
                returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE], "CubeTexture");
                if (!returnedArray[0])
                    this._blocks[blockID].addError("Could not find the EnvMap (ID = " + targetID + " ) for this FresnelEnvMapMethod");
                effectMethodReturn = new EffectFresnelEnvMapMethod(returnedArray[1], props.get(101, 1));
                break;
            case 411:
                effectMethodReturn = new EffectFogMethod(props.get(101, 0), props.get(102, 1000), props.get(601, 0x808080));
                break;
        }
        this.parseUserAttributes();
        return effectMethodReturn;
    };
    AWDParser.prototype.parseUserAttributes = function () {
        var attributes;
        var list_len;
        var attibuteCnt;
        list_len = this._newBlockBytes.readUnsignedInt();
        if (list_len > 0) {
            var list_end;
            attributes = {};
            list_end = this._newBlockBytes.position + list_len;
            while (this._newBlockBytes.position < list_end) {
                var ns_id;
                var attr_key;
                var attr_type;
                var attr_len;
                var attr_val;
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
    };
    AWDParser.prototype.parseProperties = function (expected) {
        var list_end;
        var list_len;
        var propertyCnt = 0;
        var props = new AWDProperties();
        list_len = this._newBlockBytes.readUnsignedInt();
        list_end = this._newBlockBytes.position + list_len;
        if (expected) {
            while (this._newBlockBytes.position < list_end) {
                var len;
                var key;
                var type;
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
                }
                else {
                    this._newBlockBytes.position += len;
                }
                propertyCnt += 1;
            }
        }
        else {
            this._newBlockBytes.position = list_end;
        }
        return props;
    };
    AWDParser.prototype.parseAttrValue = function (type, len) {
        var elem_len;
        var read_func;
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
            var list = [];
            var num_read = 0;
            var num_elems = len / elem_len;
            while (num_read < num_elems) {
                list.push(read_func.apply(this._newBlockBytes)); // list.push(read_func());
                num_read++;
            }
            return list;
        }
        else {
            var val = read_func.apply(this._newBlockBytes); //read_func();
            return val;
        }
    };
    AWDParser.prototype.parseHeader = function () {
        var flags;
        var body_len;
        this._byteData.position = 3; // Skip magic string and parse version
        this._version[0] = this._byteData.readUnsignedByte();
        this._version[1] = this._byteData.readUnsignedByte();
        flags = this._byteData.readUnsignedShort(); // Parse bit flags
        this._streaming = BitFlags.test(flags, BitFlags.FLAG1);
        if ((this._version[0] == 2) && (this._version[1] == 1)) {
            this._accuracyMatrix = BitFlags.test(flags, BitFlags.FLAG2);
            this._accuracyGeo = BitFlags.test(flags, BitFlags.FLAG3);
            this._accuracyProps = BitFlags.test(flags, BitFlags.FLAG4);
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
    };
    // Helper - functions
    AWDParser.prototype.getUVForVertexAnimation = function (meshID /*uint*/) {
        if (this._blocks[meshID].data instanceof Mesh)
            meshID = this._blocks[meshID].geoID;
        if (this._blocks[meshID].uvsForVertexAnimation)
            return this._blocks[meshID].uvsForVertexAnimation;
        var geometry = this._blocks[meshID].data;
        var geoCnt = 0;
        var ud;
        var uStride /*uint*/;
        var uOffs /*uint*/;
        var numPoints /*uint*/;
        var i /*int*/;
        var newUvs;
        var sub_geom;
        this._blocks[meshID].uvsForVertexAnimation = new Array();
        while (geoCnt < geometry.subGeometries.length) {
            newUvs = new Array();
            sub_geom = geometry.subGeometries[geoCnt];
            numPoints = sub_geom.numVertices;
            ud = sub_geom.uvs;
            uStride = sub_geom.getStride(TriangleSubGeometry.UV_DATA);
            uOffs = sub_geom.getOffset(TriangleSubGeometry.UV_DATA);
            for (i = 0; i < numPoints; i++) {
                newUvs.push(ud[uOffs + i * uStride + 0]);
                newUvs.push(ud[uOffs + i * uStride + 1]);
            }
            this._blocks[meshID].uvsForVertexAnimation.push(newUvs);
            geoCnt++;
        }
        return this._blocks[meshID].uvsForVertexAnimation;
    };
    AWDParser.prototype.parseVarStr = function () {
        var len = this._newBlockBytes.readUnsignedShort();
        return this._newBlockBytes.readUTFBytes(len);
    };
    AWDParser.prototype.getAssetByID = function (assetID, assetTypesToGet, extraTypeInfo) {
        if (extraTypeInfo === void 0) { extraTypeInfo = "SingleTexture"; }
        var returnArray = new Array();
        var typeCnt = 0;
        if (assetID > 0) {
            if (this._blocks[assetID]) {
                if (this._blocks[assetID].data) {
                    while (typeCnt < assetTypesToGet.length) {
                        var iasset = this._blocks[assetID].data;
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
                            }
                            else {
                                returnArray.push(true);
                                returnArray.push(this._blocks[assetID].data);
                                return returnArray;
                            }
                        }
                        //if ((assetTypesToGet[typeCnt] == AssetType.GEOMETRY) && (IAsset(_blocks[assetID].data).assetType == AssetType.MESH)) {
                        if ((assetTypesToGet[typeCnt] == AssetType.GEOMETRY) && (iasset.assetType == AssetType.MESH)) {
                            var mesh = this._blocks[assetID].data;
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
    };
    AWDParser.prototype.getDefaultAsset = function (assetType, extraTypeInfo) {
        switch (true) {
            case (assetType == AssetType.TEXTURE):
                if (extraTypeInfo == "CubeTexture")
                    return this.getDefaultCubeTexture();
                if (extraTypeInfo == "SingleTexture")
                    return this.getDefaultTexture();
                break;
            case (assetType == AssetType.MATERIAL):
                return this.getDefaultMaterial();
                break;
            default:
                break;
        }
        return null;
    };
    AWDParser.prototype.getDefaultMaterial = function () {
        if (!this._defaultBitmapMaterial)
            this._defaultBitmapMaterial = DefaultMaterialManager.getDefaultMaterial();
        return this._defaultBitmapMaterial;
    };
    AWDParser.prototype.getDefaultTexture = function () {
        if (!this._defaultTexture)
            this._defaultTexture = DefaultMaterialManager.getDefaultTexture();
        return this._defaultTexture;
    };
    AWDParser.prototype.getDefaultCubeTexture = function () {
        if (!this._defaultCubeTexture) {
            var defaultBitmap = DefaultMaterialManager.createCheckeredBitmapData();
            this._defaultCubeTexture = new BitmapCubeTexture(defaultBitmap, defaultBitmap, defaultBitmap, defaultBitmap, defaultBitmap, defaultBitmap);
            this._defaultCubeTexture.name = "defaultCubeTexture";
        }
        return this._defaultCubeTexture;
    };
    AWDParser.prototype.readNumber = function (precision) {
        if (precision === void 0) { precision = false; }
        if (precision)
            return this._newBlockBytes.readDouble();
        return this._newBlockBytes.readFloat();
    };
    AWDParser.prototype.parseMatrix3D = function () {
        return new Matrix3D(this.parseMatrix43RawData());
    };
    AWDParser.prototype.parseMatrix32RawData = function () {
        var i;
        var mtx_raw = new Array(6);
        for (i = 0; i < 6; i++) {
            mtx_raw[i] = this._newBlockBytes.readFloat();
        }
        return mtx_raw;
    };
    AWDParser.prototype.parseMatrix43RawData = function () {
        var mtx_raw = new Array(16);
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
    };
    AWDParser.COMPRESSIONMODE_LZMA = "lzma";
    AWDParser.UNCOMPRESSED = 0;
    AWDParser.DEFLATE = 1;
    AWDParser.LZMA = 2;
    AWDParser.INT8 = 1;
    AWDParser.INT16 = 2;
    AWDParser.INT32 = 3;
    AWDParser.UINT8 = 4;
    AWDParser.UINT16 = 5;
    AWDParser.UINT32 = 6;
    AWDParser.FLOAT32 = 7;
    AWDParser.FLOAT64 = 8;
    AWDParser.BOOL = 21;
    AWDParser.COLOR = 22;
    AWDParser.BADDR = 23;
    AWDParser.AWDSTRING = 31;
    AWDParser.AWDBYTEARRAY = 32;
    AWDParser.VECTOR2x1 = 41;
    AWDParser.VECTOR3x1 = 42;
    AWDParser.VECTOR4x1 = 43;
    AWDParser.MTX3x2 = 44;
    AWDParser.MTX3x3 = 45;
    AWDParser.MTX4x3 = 46;
    AWDParser.MTX4x4 = 47;
    return AWDParser;
})(ParserBase);
module.exports = AWDParser;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXJzZXJzL2F3ZHBhcnNlci50cyJdLCJuYW1lcyI6WyJBV0RQYXJzZXIiLCJBV0RQYXJzZXIuY29uc3RydWN0b3IiLCJBV0RQYXJzZXIuc3VwcG9ydHNUeXBlIiwiQVdEUGFyc2VyLnN1cHBvcnRzRGF0YSIsIkFXRFBhcnNlci5faVJlc29sdmVEZXBlbmRlbmN5IiwiQVdEUGFyc2VyLl9pUmVzb2x2ZURlcGVuZGVuY3lGYWlsdXJlIiwiQVdEUGFyc2VyLl9pUmVzb2x2ZURlcGVuZGVuY3lOYW1lIiwiQVdEUGFyc2VyLl9wUHJvY2VlZFBhcnNpbmciLCJBV0RQYXJzZXIuX3BTdGFydFBhcnNpbmciLCJBV0RQYXJzZXIuZGlzcG9zZSIsIkFXRFBhcnNlci5wYXJzZU5leHRCbG9jayIsIkFXRFBhcnNlci5wYXJzZVRyaWFuZ2xlR2VvbWV0cmllQmxvY2siLCJBV0RQYXJzZXIucGFyc2VQcmltaXR2ZXMiLCJBV0RQYXJzZXIucGFyc2VDb250YWluZXIiLCJBV0RQYXJzZXIucGFyc2VNZXNoSW5zdGFuY2UiLCJBV0RQYXJzZXIucGFyc2VTa3lib3hJbnN0YW5jZSIsIkFXRFBhcnNlci5wYXJzZUxpZ2h0IiwiQVdEUGFyc2VyLnBhcnNlQ2FtZXJhIiwiQVdEUGFyc2VyLnBhcnNlTGlnaHRQaWNrZXIiLCJBV0RQYXJzZXIucGFyc2VNYXRlcmlhbCIsIkFXRFBhcnNlci5wYXJzZU1hdGVyaWFsX3YxIiwiQVdEUGFyc2VyLnBhcnNlVGV4dHVyZSIsIkFXRFBhcnNlci5wYXJzZUN1YmVUZXh0dXJlIiwiQVdEUGFyc2VyLnBhcnNlU2hhcmVkTWV0aG9kQmxvY2siLCJBV0RQYXJzZXIucGFyc2VTaGFkb3dNZXRob2RCbG9jayIsIkFXRFBhcnNlci5wYXJzZUNvbW1hbmQiLCJBV0RQYXJzZXIucGFyc2VNZXRhRGF0YSIsIkFXRFBhcnNlci5wYXJzZU5hbWVTcGFjZSIsIkFXRFBhcnNlci5wYXJzZVNoYWRvd01ldGhvZExpc3QiLCJBV0RQYXJzZXIucGFyc2VTa2VsZXRvbiIsIkFXRFBhcnNlci5wYXJzZVNrZWxldG9uUG9zZSIsIkFXRFBhcnNlci5wYXJzZVNrZWxldG9uQW5pbWF0aW9uIiwiQVdEUGFyc2VyLnBhcnNlTWVzaFBvc2VBbmltYXRpb24iLCJBV0RQYXJzZXIucGFyc2VWZXJ0ZXhBbmltYXRpb25TZXQiLCJBV0RQYXJzZXIucGFyc2VBbmltYXRvclNldCIsIkFXRFBhcnNlci5wYXJzZVNoYXJlZE1ldGhvZExpc3QiLCJBV0RQYXJzZXIucGFyc2VVc2VyQXR0cmlidXRlcyIsIkFXRFBhcnNlci5wYXJzZVByb3BlcnRpZXMiLCJBV0RQYXJzZXIucGFyc2VBdHRyVmFsdWUiLCJBV0RQYXJzZXIucGFyc2VIZWFkZXIiLCJBV0RQYXJzZXIuZ2V0VVZGb3JWZXJ0ZXhBbmltYXRpb24iLCJBV0RQYXJzZXIucGFyc2VWYXJTdHIiLCJBV0RQYXJzZXIuZ2V0QXNzZXRCeUlEIiwiQVdEUGFyc2VyLmdldERlZmF1bHRBc3NldCIsIkFXRFBhcnNlci5nZXREZWZhdWx0TWF0ZXJpYWwiLCJBV0RQYXJzZXIuZ2V0RGVmYXVsdFRleHR1cmUiLCJBV0RQYXJzZXIuZ2V0RGVmYXVsdEN1YmVUZXh0dXJlIiwiQVdEUGFyc2VyLnJlYWROdW1iZXIiLCJBV0RQYXJzZXIucGFyc2VNYXRyaXgzRCIsIkFXRFBhcnNlci5wYXJzZU1hdHJpeDMyUmF3RGF0YSIsIkFXRFBhcnNlci5wYXJzZU1hdHJpeDQzUmF3RGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsSUFBTyxjQUFjLFdBQWUscUNBQXFDLENBQUMsQ0FBQztBQUMzRSxJQUFPLFFBQVEsV0FBaUIsK0JBQStCLENBQUMsQ0FBQztBQUNqRSxJQUFPLFFBQVEsV0FBaUIsK0JBQStCLENBQUMsQ0FBQztBQUNqRSxJQUFPLG1CQUFtQixXQUFjLHlDQUF5QyxDQUFDLENBQUM7QUFDbkYsSUFBTyxVQUFVLFdBQWdCLGdDQUFnQyxDQUFDLENBQUM7QUFDbkUsSUFBTyxTQUFTLFdBQWdCLG1DQUFtQyxDQUFDLENBQUM7QUFFckUsSUFBTyxVQUFVLFdBQWdCLG9DQUFvQyxDQUFDLENBQUM7QUFDdkUsSUFBTyxXQUFXLFdBQWdCLHFDQUFxQyxDQUFDLENBQUM7QUFHekUsSUFBTyxxQkFBcUIsV0FBYSxtREFBbUQsQ0FBQyxDQUFDO0FBQzlGLElBQU8sc0JBQXNCLFdBQWEsb0RBQW9ELENBQUMsQ0FBQztBQUNoRyxJQUFPLCtCQUErQixXQUFXLDZEQUE2RCxDQUFDLENBQUM7QUFDaEgsSUFBTyxpQkFBaUIsV0FBYyw0Q0FBNEMsQ0FBQyxDQUFDO0FBR3BGLElBQU8sZ0JBQWdCLFdBQWUsMkNBQTJDLENBQUMsQ0FBQztBQUNuRixJQUFPLFlBQVksV0FBZ0IsdUNBQXVDLENBQUMsQ0FBQztBQUc1RSxJQUFPLFNBQVMsV0FBZ0IsaUNBQWlDLENBQUMsQ0FBQztBQUVuRSxJQUFPLHNCQUFzQixXQUFhLHNEQUFzRCxDQUFDLENBQUM7QUFDbEcsSUFBTyxTQUFTLFdBQWdCLG1DQUFtQyxDQUFDLENBQUM7QUFFckUsSUFBTyxRQUFRLFdBQWlCLGtDQUFrQyxDQUFDLENBQUM7QUFFcEUsSUFBTyxtQkFBbUIsV0FBYyw2Q0FBNkMsQ0FBQyxDQUFDO0FBQ3ZGLElBQU8sZ0JBQWdCLFdBQWUsOENBQThDLENBQUMsQ0FBQztBQUN0RixJQUFPLFVBQVUsV0FBZ0Isd0NBQXdDLENBQUMsQ0FBQztBQUMzRSxJQUFPLE1BQU0sV0FBaUIsb0NBQW9DLENBQUMsQ0FBQztBQUNwRSxJQUFPLElBQUksV0FBa0Isa0NBQWtDLENBQUMsQ0FBQztBQUNqRSxJQUFPLE1BQU0sV0FBaUIsb0NBQW9DLENBQUMsQ0FBQztBQUdwRSxJQUFPLGlCQUFpQixXQUFjLDZEQUE2RCxDQUFDLENBQUM7QUFDckcsSUFBTyxtQkFBbUIsV0FBYyxnRUFBZ0UsQ0FBQyxDQUFDO0FBQzFHLElBQU8sdUJBQXVCLFdBQWEsb0VBQW9FLENBQUMsQ0FBQztBQUVqSCxJQUFPLFVBQVUsV0FBZ0IsdUNBQXVDLENBQUMsQ0FBQztBQUMxRSxJQUFPLHNCQUFzQixXQUFhLG1EQUFtRCxDQUFDLENBQUM7QUFDL0YsSUFBTyxtQkFBbUIsV0FBYyxnREFBZ0QsQ0FBQyxDQUFDO0FBQzFGLElBQU8sbUJBQW1CLFdBQWMsZ0RBQWdELENBQUMsQ0FBQztBQUMxRixJQUFPLHVCQUF1QixXQUFhLG9EQUFvRCxDQUFDLENBQUM7QUFDakcsSUFBTyxvQkFBb0IsV0FBYyxpREFBaUQsQ0FBQyxDQUFDO0FBQzVGLElBQU8scUJBQXFCLFdBQWEsa0RBQWtELENBQUMsQ0FBQztBQUM3RixJQUFPLG9CQUFvQixXQUFjLGlEQUFpRCxDQUFDLENBQUM7QUFJNUYsSUFBTyxjQUFjLFdBQWUsNkNBQTZDLENBQUMsQ0FBQztBQUNuRixJQUFPLG9CQUFvQixXQUFjLG1EQUFtRCxDQUFDLENBQUM7QUFDOUYsSUFBTyxzQkFBc0IsV0FBYSxxREFBcUQsQ0FBQyxDQUFDO0FBQ2pHLElBQU8sc0JBQXNCLFdBQWEsMkRBQTJELENBQUMsQ0FBQztBQUV2RyxJQUFPLGtCQUFrQixXQUFjLG9EQUFvRCxDQUFDLENBQUM7QUFDN0YsSUFBTyxjQUFjLFdBQWUsZ0RBQWdELENBQUMsQ0FBQztBQUN0RixJQUFPLG9CQUFvQixXQUFjLHNEQUFzRCxDQUFDLENBQUM7QUFDakcsSUFBTyxnQkFBZ0IsV0FBZSxrREFBa0QsQ0FBQyxDQUFDO0FBQzFGLElBQU8sU0FBUyxXQUFnQixnREFBZ0QsQ0FBQyxDQUFDO0FBQ2xGLElBQU8sUUFBUSxXQUFpQiwrQ0FBK0MsQ0FBQyxDQUFDO0FBQ2pGLElBQU8sWUFBWSxXQUFnQixtREFBbUQsQ0FBQyxDQUFDO0FBQ3hGLElBQU8sYUFBYSxXQUFlLG9EQUFvRCxDQUFDLENBQUM7QUFDekYsSUFBTyxnQkFBZ0IsV0FBZSx3REFBd0QsQ0FBQyxDQUFDO0FBQ2hHLElBQU8sY0FBYyxXQUFlLHNEQUFzRCxDQUFDLENBQUM7QUFDNUYsSUFBTyxtQkFBbUIsV0FBYyw2REFBNkQsQ0FBQyxDQUFDO0FBQ3ZHLElBQU8sa0JBQWtCLFdBQWMsNERBQTRELENBQUMsQ0FBQztBQUNyRyxJQUFPLGdCQUFnQixXQUFlLDBEQUEwRCxDQUFDLENBQUM7QUFDbEcsSUFBTyxxQkFBcUIsV0FBYSwrREFBK0QsQ0FBQyxDQUFDO0FBQzFHLElBQU8scUJBQXFCLFdBQWEsK0RBQStELENBQUMsQ0FBQztBQUMxRyxJQUFPLGlCQUFpQixXQUFjLDJEQUEyRCxDQUFDLENBQUM7QUFDbkcsSUFBTyxxQkFBcUIsV0FBYSwrREFBK0QsQ0FBQyxDQUFDO0FBQzFHLElBQU8sdUJBQXVCLFdBQWEsaUVBQWlFLENBQUMsQ0FBQztBQUM5RyxJQUFPLDBCQUEwQixXQUFZLGlFQUFpRSxDQUFDLENBQUM7QUFDaEgsSUFBTyxrQkFBa0IsV0FBYyw0REFBNEQsQ0FBQyxDQUFDO0FBQ3JHLElBQU8sZUFBZSxXQUFlLHlEQUF5RCxDQUFDLENBQUM7QUFDaEcsSUFBTyx5QkFBeUIsV0FBWSxtRUFBbUUsQ0FBQyxDQUFDO0FBQ2pILElBQU8sb0JBQW9CLFdBQWMsOERBQThELENBQUMsQ0FBQztBQUV6RyxJQUFPLG9CQUFvQixXQUFjLDhEQUE4RCxDQUFDLENBQUM7QUFDekcsSUFBTyx1QkFBdUIsV0FBYSxpRUFBaUUsQ0FBQyxDQUFDO0FBQzlHLElBQU8sb0JBQW9CLFdBQWMsOERBQThELENBQUMsQ0FBQztBQUN6RyxJQUFPLG9CQUFvQixXQUFjLDhEQUE4RCxDQUFDLENBQUM7QUFFekcsSUFBTyxxQkFBcUIsV0FBYSwrREFBK0QsQ0FBQyxDQUFDO0FBQzFHLElBQU8sZ0JBQWdCLFdBQWUsdURBQXVELENBQUMsQ0FBQztBQUMvRixJQUFPLHlCQUF5QixXQUFZLG1FQUFtRSxDQUFDLENBQUM7QUFDakgsSUFBTyxpQkFBaUIsV0FBYywyREFBMkQsQ0FBQyxDQUFDO0FBQ25HLElBQU8sbUJBQW1CLFdBQWMsNkRBQTZELENBQUMsQ0FBQztBQUN2RyxJQUFPLGdCQUFnQixXQUFlLDBEQUEwRCxDQUFDLENBQUM7QUFDbEcsSUFBTyxnQkFBZ0IsV0FBZSwwREFBMEQsQ0FBQyxDQUFDO0FBRWxHLElBQU8sUUFBUSxXQUFpQiw2Q0FBNkMsQ0FBQyxDQUFDO0FBQy9FLElBQU8sYUFBYSxXQUFlLGtEQUFrRCxDQUFDLENBQUM7QUFDdkYsSUFBTyxRQUFRLFdBQWlCLDZDQUE2QyxDQUFDLENBQUM7QUFFL0UsQUFHQTs7R0FERztJQUNHLFNBQVM7SUFBU0EsVUFBbEJBLFNBQVNBLFVBQW1CQTtJQXVEakNBOzs7O09BSUdBO0lBQ0hBLFNBNURLQSxTQUFTQTtRQThEYkMsa0JBQU1BLG1CQUFtQkEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7UUE1RHpDQSx3REFBd0RBO1FBQ2hEQSxXQUFNQSxHQUFXQSxLQUFLQSxDQUFDQTtRQUV2QkEsb0JBQWVBLEdBQVdBLEtBQUtBLENBQUNBO1FBY2hDQSxtQkFBY0EsR0FBVUEsRUFBRUEsQ0FBQ0E7UUFDM0JBLG1CQUFjQSxHQUFXQSxLQUFLQSxDQUFDQTtRQTRDdENBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLEtBQUtBLEVBQVlBLENBQUNBO1FBQ3JDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxRQUFRQSxFQUFFQSxDQUFDQTtRQUNqQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsRUFBRUEsaUNBQWlDQTtRQUU5REEsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsSUFBSUEsS0FBS0EsRUFBVUEsRUFBRUEsOENBQThDQTtRQUN2RkEsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDekNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ3RDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUN4Q0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDekNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO1FBQzdDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUN4Q0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFDNUNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1FBQ3pDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUN4Q0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDMUNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1FBQzNDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUN6Q0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDMUNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1FBQ3pDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUN6Q0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7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QSxDQUFDQSxlQUFlQSxDQUFDQSxFQUFDQSxHQUFHQSxFQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxHQUFHQSxFQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxHQUFHQSxFQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxHQUFHQSxFQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxHQUFHQSxFQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUFDQSxDQUFDQSxDQUFDQTtRQUUxUkEsSUFBSUEsY0FBY0EsR0FBaUJBLENBQUNBLHFCQUFxQkEsRUFBRUEsc0JBQXNCQSxFQUFFQSxxQkFBcUJBLEVBQUVBLHVCQUF1QkEsRUFBRUEseUJBQXlCQSxFQUFFQSxzQkFBc0JBLEVBQUVBLHlCQUF5QkEsRUFBRUEsdUJBQXVCQSxDQUFDQSxDQUFBQTtRQUV6T0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFHbEJBLEtBQUtBLENBQUNBO2dCQUNMQSxNQUFNQSxHQUFHQSxJQUFJQSxvQkFBb0JBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO2dCQUMvSkEsS0FBS0EsQ0FBQ0E7WUFFUEEsS0FBS0EsQ0FBQ0E7Z0JBQ0xBLE1BQU1BLEdBQUdBLElBQUlBLG1CQUFtQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQy9LQSxLQUFLQSxDQUFDQTtZQUVQQSxLQUFLQSxDQUFDQTtnQkFDTEEsTUFBTUEsR0FBR0EsSUFBSUEscUJBQXFCQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDckhBLEtBQUtBLENBQUNBO1lBRVBBLEtBQUtBLENBQUNBO2dCQUNMQSxNQUFNQSxHQUFHQSxJQUFJQSx1QkFBdUJBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLEVBQUVBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLEVBQUVBLHVDQUF1Q0E7Z0JBQ25NQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDQ0EsTUFBT0EsQ0FBQ0EsU0FBU0EsR0FBR0EsS0FBS0EsQ0FBQ0E7Z0JBQ3JEQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDQ0EsTUFBT0EsQ0FBQ0EsWUFBWUEsR0FBR0EsS0FBS0EsQ0FBQ0E7Z0JBQ3hEQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDQ0EsTUFBT0EsQ0FBQ0EsR0FBR0EsR0FBR0EsS0FBS0EsQ0FBQ0E7Z0JBRS9DQSxLQUFLQSxDQUFDQTtZQUVQQSxLQUFLQSxDQUFDQTtnQkFDTEEsTUFBTUEsR0FBR0EsSUFBSUEsbUJBQW1CQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDN0pBLEtBQUtBLENBQUNBO1lBRVBBLEtBQUtBLENBQUNBO2dCQUNMQSxNQUFNQSxHQUFHQSxJQUFJQSxzQkFBc0JBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUMzSUEsS0FBS0EsQ0FBQ0E7WUFFUEEsS0FBS0EsQ0FBQ0E7Z0JBQ0xBLE1BQU1BLEdBQUdBLElBQUlBLG9CQUFvQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3ZJQSxLQUFLQSxDQUFDQTtZQUVQQTtnQkFDQ0EsTUFBTUEsR0FBR0EsSUFBSUEsVUFBVUEsRUFBRUEsQ0FBQ0E7Z0JBQzFCQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxnQ0FBZ0NBLENBQUNBLENBQUNBO2dCQUM5Q0EsS0FBS0EsQ0FBQ0E7UUFDUkEsQ0FBQ0E7UUFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFHM0RBLENBQUNBO1FBRURBLElBQUlBLENBQUNBLG1CQUFtQkEsRUFBRUEsQ0FBQ0E7UUFDM0JBLE1BQU1BLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO1FBQ25CQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxNQUFNQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUNuQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsR0FBR0EsTUFBTUEsQ0FBQ0E7UUFFcENBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQ2pCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxRQUFRQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdENBLFFBQVFBLEdBQUdBLENBQUNBLENBQUNBO1lBQ2RBLENBQUNBO1lBQ0RBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLDZCQUE2QkEsR0FBR0EsSUFBSUEsR0FBR0EsV0FBV0EsR0FBR0EsY0FBY0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDNUZBLENBQUNBO0lBQ0ZBLENBQUNBO0lBRURaLGdCQUFnQkE7SUFDUkEsa0NBQWNBLEdBQXRCQSxVQUF1QkEsT0FBY0E7UUFFcENhLElBQUlBLElBQVdBLENBQUNBO1FBQ2hCQSxJQUFJQSxNQUFhQSxDQUFDQTtRQUNsQkEsSUFBSUEsR0FBWUEsQ0FBQ0E7UUFDakJBLElBQUlBLEdBQTBCQSxDQUFDQTtRQUMvQkEsSUFBSUEsTUFBNkJBLENBQUNBO1FBRWxDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxlQUFlQSxFQUFFQSxDQUFDQTtRQUMvQ0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0E7UUFDM0JBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO1FBRTFCQSxJQUFJQSxVQUFVQSxHQUFVQSxpQkFBaUJBLENBQUNBO1FBQzFDQSxHQUFHQSxHQUFHQSxJQUFJQSxzQkFBc0JBLEVBQUVBLENBQUNBO1FBQ25DQSxHQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxRQUFRQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUU3QkEsSUFBSUEsYUFBYUEsR0FBY0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsRUFBRUEsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFFakhBLEVBQUVBLENBQUNBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3RCQSxJQUFJQSxHQUFHQSxHQUEyQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBRUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDbEZBLFVBQVVBLEdBQTZCQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFFQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUMvREEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdkJBLElBQUlBLENBQUNBLE9BQU9BLENBQUVBLE9BQU9BLENBQUVBLENBQUNBLFFBQVFBLENBQUNBLG9EQUFvREEsQ0FBQ0EsQ0FBQ0E7UUFDeEZBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ1BBLEFBQ0FBLDZCQUQ2QkE7WUFDSEEsSUFBSUEsQ0FBQ0EsU0FBVUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDekRBLENBQUNBO1FBRURBLEFBQ0FBLHNEQURzREE7UUFDdERBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hEQSxJQUFJQSxLQUFLQSxHQUFpQkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsRUFBQ0EsQ0FBQ0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdElBLEdBQUdBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEVB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LENBQUNBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDNUJBLElBQUlBLElBQUlBLEdBQW1EQSxtQkFBbUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2xGQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNwQkEsVUFBVUEsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDeEJBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3ZCQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSx1Q0FBdUNBLENBQUNBLENBQUNBO1FBQ3pFQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNQQSxBQUNBQSw2QkFENkJBO1lBQ0hBLElBQUlBLENBQUNBLFNBQVVBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBQzFEQSxDQUFDQTtRQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxJQUFJQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN6REEsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDOUJBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2pDQSxJQUFJQSxDQUFRQSxDQUFDQTtZQUliQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDNUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFFBQVFBLEdBQUdBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzNFQSxDQUFDQTtRQUNGQSxDQUFDQTtRQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4REEsSUFBSUEsS0FBS0EsR0FBaUJBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLEVBQUNBLENBQUNBLEVBQUNBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBLEVBQUNBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBLEVBQUNBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBLEVBQUNBLFNBQVNBLENBQUNBLElBQUlBLEVBQUNBLENBQUNBLENBQUNBO1lBQ3hKQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxRQUFRQSxDQUFTQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFVQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFXQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN0R0EsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FB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Y0FBY0EsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0E7UUFDMURBLElBQUlBLEdBQUdBLEdBQVlBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBO1FBQ3hDQSxJQUFJQSxJQUFJQSxHQUFVQSxJQUFJQSxDQUFDQSxXQUFXQSxFQUFFQSxDQUFDQTtRQUNyQ0EsSUFBSUEsU0FBU0EsR0FBVUEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsZ0JBQWdCQSxFQUFFQSxDQUFDQTtRQUM5REEsSUFBSUEsS0FBS0EsR0FBaUJBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLEVBQUNBLENBQUNBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBLEVBQUNBLFNBQVNBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLEVBQUVBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLEVBQUVBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEVBQUVBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEVBQUVBLEVBQUNBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLEVBQUVBLEVBQUNBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLEVBQUVBLEVBQUNBLElBQUlBLENBQUNBLGFBQWFBLEVBQUNBLENBQUNBLENBQUNBO1FBQ3pXQSxJQUFJQSxnQkFBZ0JBLEdBQVVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1FB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QUFDQTtnQkFDcERBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUMzQkEsZUFBZUEsQ0FBQ0EsWUFBWUEsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3JFQSxDQUFDQTtZQUNGQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDUEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzNCQSxlQUFlQSxDQUFDQSxZQUFZQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDckVBLENBQUNBO1lBQ0ZBLENBQUNBO1lBRURBLEtBQUtBLENBQUNBLFlBQVlBLEdBQUdBLGVBQWVBLENBQUNBO1lBQ3JDQSxLQUFLQSxDQUFDQSxZQUFZQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUMzQkEsQ0FBQ0E7UUFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFakJBLElBQUlBLG1CQUFtQkEsR0FBY0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsRUFBRUEsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQUE7WUFFdEhBLEVBQUVBLENBQUNBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7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QSxLQUFLQSxDQUFDQTtZQUNQQSxLQUFLQSxJQUFJQTtnQkFDUkEsVUFBVUEsR0FBR0EsSUFBSUEsK0JBQStCQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdklBLEtBQUtBLENBQUNBO1lBQ1BBO2dCQUNDQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxxQkFBcUJBLENBQUNBLENBQUNBO2dCQUNuQ0EsTUFBTUEsQ0FBQ0E7UUFDVEEsQ0FBQ0E7UUFFREEsSUFBSUEsTUFBTUEsR0FBVUEsSUFBSUEsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7UUFDM0NBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLEdBQUdBLEdBQUdBLENBQUNBO1FBRWhDQSxJQUFJQSxtQkFBbUJBLEdBQWNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLEVBQUVBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUFBO1FBRXRIQSxFQUFFQSxDQUFDQSxDQUFDQSxtQkFBbUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBRTVCQSxJQUFJQSxJQUFJQSxHQUFtREEsbUJBQW1CQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNsRkEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7WUFFdEJBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBO1FBRXhCQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN2QkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EseUNBQXlDQSxDQUFDQSxDQUFDQTtRQUMzRUEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDUEEsQUFDQUEsNkJBRDZCQTtZQUNIQSxJQUFJQSxDQUFDQSxTQUFVQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUM1REEsQ0FBQ0E7UUFFREEsTUFBTUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDbkJBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLEVBQUNBLENBQUNBLEVBQUNBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBLEVBQUNBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBLEVBQUNBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUNBLENBQUNBLENBQUNBO1FBQ3BIQSxNQUFNQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMvRUEsTUFBTUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxFQUFFQSxDQUFDQTtRQUUxQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFFbkNBLElBQUlBLENB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Q0FBQ0E7UUFDL0JBLElBQUlBLGFBQTJCQSxDQUFDQTtRQUNoQ0EsSUFBSUEsV0FBeUJBLENBQUNBO1FBQzlCQSxJQUFJQSxhQUF3QkEsQ0FBQ0E7UUFFN0JBLElBQUlBLElBQUlBLEdBQVVBLElBQUlBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO1FBQ3JDQSxJQUFJQSxJQUFJQSxHQUFVQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxnQkFBZ0JBLEVBQUVBLENBQUNBO1FBQ3pEQSxJQUFJQSxXQUFXQSxHQUFVQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxnQkFBZ0JBLEVBQUVBLENBQUNBO1FBQ2hFQSxJQUFJQSxLQUFLQSxHQUFpQkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsRUFBQ0EsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsRUFBRUEsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsRUFBRUEsRUFBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsRUFBRUEsRUFBRUEsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsRUFBRUEsRUFBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsRUFBRUEsRUFBRUEsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsRUFBRUEsRUFBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsRUFBRUEsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsRUFBRUEsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsRUFBRUEsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsRUFBRUEsRUFBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsRUFBRUEsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsRUFBRUEsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDbmRBLElBQUlBLFdBQVdBLEdBQVVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1FBQ3pDQSxJQUFJQSxXQUFXQSxHQUFVQSxFQUFFQSxDQUFDQTtRQUU1QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsV0FBV0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdEJBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLHdCQUF3QkEsR0FBR0EsV0FBV0EsR0FBR0EsNkRBQTZEQSxDQUFDQSxDQUFDQTtZQUN2SUEsTUFBTUEsQ0FBQ0E7UUFDUkEsQ0FBQ0E7UUFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDMUJBLFdBQVdBLEdBQUdBLENBQUNBLENBQUNBO1FBQ2pCQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUMvQkEsV0FBV0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFFakJBLEVBQUVBLENBQUNBLENBQUNBLFdBQVdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBRXJCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDZkEsSUFBSUEsS0FBS0EsR0FBVUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsUUFBUUEs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LGNBQWNBLEdBQUdBLFdBQVdBLEVBQUVBLENBQUNBO2dCQUNyQ0EsSUFBSUEsV0FBa0JBLENBQUNBO2dCQUN2QkEsV0FBV0EsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxDQUFDQTtnQkFFdERBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLEVBQUNBLENBQUNBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUNBLENBQUNBLENBQUNBO2dCQUV2WUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3JCQSxLQUFLQSxHQUFHQTt3QkFFUEEsUUFBUUEsR0FBR0EsS0FBS0EsQ0FBQ0EsR0FB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LGFBQWFBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ3hEQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUU5QkEsQUFDQUEsV0FEV0E7WUFDWEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2ZBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBO2dCQUNqREEsSUFBSUEsR0FBVUEsQ0FBQ0E7Z0JBQ2ZBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLFlBQVlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO2dCQUVqREEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsUUFBUUEsRUFBRUEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsRUFBRUEsSUFBSUEsVUFBVUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsS0FBS0EsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDdkdBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUVQQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxlQUFlQSxFQUFFQSxDQUFDQTtnQkFDakRBLElBQUlBLElBQWNBLENBQUNBO2dCQUNuQkEsSUFBSUEsR0FBR0EsSUFBSUEsU0FBU0EsRUFBRUEsQ0FBQ0E7Z0JBRXZCQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQSxFQUFFQSxRQUFRQSxDQUFDQSxDQUFDQTtnQkFFakRBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLFFBQVFBLEVBQUVBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLEVBQUVBLElBQUlBLEVBQUVBLEtBQUtBLEVBQUVB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QUFjQTtRQUc1RDRCLElBQUlBLFVBQVVBLEdBQVVBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGlCQUFpQkEsRUFBRUEsQ0FBQ0E7UUFDaEVBLElBQUlBLFlBQTZCQSxDQUFDQTtRQUNsQ0EsSUFBSUEsS0FBS0EsR0FBaUJBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLEVBQUNBLENBQUNBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUNBLENBQUNBLENBQUNBO1FBRXpaQSxJQUFJQSxRQUFlQSxDQUFDQTtRQUNwQkEsSUFBSUEsYUFBd0JBLENBQUFBO1FBQzVCQSxNQUFNQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtZQVVwQkEsS0FBS0EsSUFBSUE7Z0JBQ1JBLFFBQVFBLEdBQUdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUMzQkEsYUFBYUEsR0FBR0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDM0VBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUN2QkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsNENBQTRDQSxHQUFHQSxRQUFRQSxHQUFHQSx5REFBeURBLENBQUNBLENBQUNBO29CQUNwSkEsTUFBTUEsQ0FBQ0EsWUFBWUEsQ0FBQ0E7Z0JBQ3JCQSxDQUFDQTtnQkFDREEsWUFBWUEsR0FBR0EsSUFBSUEsZ0JBQWdCQSxDQUFvQkEsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3pFQSxLQUFLQSxDQUFDQTtZQUNQQSxLQUFLQSxJQUFJQTtnQkFFUkEsWUFBWUEsR0FBR0EsSUFBSUEsb0JBQW9CQSxDQUFvQkEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzFDQSxZQUFhQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDeENBLFlBQWFBLENBQUNBLE9BQU9BLEdBQUdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO2dCQUN0RUEsS0FBS0EsQ0FBQ0E7WUFFUEEsS0FBS0EsSUFBSUE7Z0JBR1JBLFlBQVlBLEdBQUdBLElBQUlBLG9CQUFvQkEsQ0FBb0JBLEtBQUtBLEVBQVdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUN0RUEsWUFBYUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3hDQSxZQUFhQSxDQUFDQSxPQUFPQSxHQUFHQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDOUNBLFlBQWFBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUVoRUEsS0FBS0EsQ0FBQ0E7WUFDUEEsS0FBS0EsSUFBSUE7Z0JBRVJBLFlBQVlBLEdBQUdBLElBQUlBLGdCQUFnQkEsQ0FBb0JBLEtBQUtBLEVBQVdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUN0RUEsWUFBYUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3hDQSxZQUFhQSxDQUFDQSxPQUFPQSxHQUFHQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDOUNBLFlBQWFBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUU1REEsS0FBS0EsQ0FBQ0E7WUFDUEEsS0FBS0EsSUFBSUE7Z0JBQ1JBLFlBQVlBLEdBQUdBLElBQUlBLGdCQUFnQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3ZCQSxZQUFhQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDeENBLFlBQWFBLENBQUNBLE9BQU9BLEdBQUdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdB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QUNBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLElBQUlBLEVBQUNBLENBQUNBLENBQUNBO1FBQy9kQSxJQUFJQSxRQUFlQSxDQUFDQTtRQUNwQkEsSUFBSUEsYUFBd0JBLENBQUNBO1FBRTdCQSxNQUFNQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUVwQkEsS0FBS0EsR0FBR0E7Z0JBQ1BBLGtCQUFrQkEsR0FBR0EsSUFBSUEsdUJBQXVCQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxJQUFJQSxLQUFLQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDeElBLEtBQUtBLENBQUNBO1lBQ1BBLEtBQUtBLEdBQUdBO2dCQUNQQSxrQkFBa0JBLEdBQUdBLElBQUlBLDBCQUEwQkEsRUFBRUEsQ0FBQ0E7Z0JBQ3REQSxJQUFJQSxNQUFNQSxHQUFtQkEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsVUFBVUEsQ0FBQ0EsQ0FBQ0E7Z0JBQzFCQSxrQkFBbUJBLENBQUNBLGNBQWNBLEdBQUdBLElBQUlBLGNBQWNBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLElBQUlBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENB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LENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBQ25EQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQTtRQUNuREEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7UUFDakJBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBQ25EQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQTtRQUNuREEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7UUFDbkRBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO1FBQ2pCQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQTtRQUNuREEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7UUFDbkRBLE9BQU9BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBQ3BEQSxPQUFPQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUNsQkEsT0FBT0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7UUFDcERBLE9BQU9BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBQ3BEQSxPQUFPQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQTtRQUNwREEsT0FBT0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7UUFFbEJBLEFBRUFBLDBFQUYwRUE7UUFFMUVBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3ZCQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNmQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNmQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNmQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNmQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNmQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNmQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNmQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNmQSxPQUFPQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNoQkEsT0FBT0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDaEJBLE9BQU9BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ2hCQSxPQUFPQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUVqQkEsQ0FBQ0E7UUFFREEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7SUFDaEJBLENBQUNBO0lBaG9GYWxELDhCQUFvQkEsR0FBVUEsTUFBTUEsQ0FBQ0E7SUFDckNBLHNCQUFZQSxHQUFVQSxDQUFDQSxDQUFDQTtJQUN4QkEsaUJBQU9BLEdBQVVBLENBQUNBLENBQUNBO0lBQ25CQSxjQUFJQSxHQUFVQSxDQUFDQSxDQUFDQTtJQUNoQkEsY0FBSUEsR0FBVUEsQ0FBQ0EsQ0FBQ0E7SUFDaEJBLGVBQUtBLEdBQVVBLENBQUNBLENBQUNBO0lBQ2pCQSxlQUFLQSxHQUFVQSxDQUFDQSxDQUFDQTtJQUNqQkEsZUFBS0EsR0FBVUEsQ0FBQ0EsQ0FBQ0E7SUFDakJBLGdCQUFNQSxHQUFVQSxDQUFDQSxDQUFDQTtJQUNsQkEsZ0JBQU1BLEdBQVVBLENBQUNBLENBQUNBO0lBQ2xCQSxpQkFBT0EsR0FBVUEsQ0FBQ0EsQ0FBQ0E7SUFDbkJBLGlCQUFPQSxHQUFVQSxDQUFDQSxDQUFDQTtJQUNuQkEsY0FBSUEsR0FBVUEsRUFBRUEsQ0FBQ0E7SUFDakJBLGVBQUtBLEdBQVVBLEVBQUVBLENBQUNBO0lBQ2xCQSxlQUFLQSxHQUFVQSxFQUFFQSxDQUFDQTtJQUNsQkEsbUJBQVNBLEdBQVVBLEVBQUVBLENBQUNBO0lBQ3RCQSxzQkFBWUEsR0FBVUEsRUFBRUEsQ0FBQ0E7SUFDekJBLG1CQUFTQSxHQUFVQSxFQUFFQSxDQUFDQTtJQUN0QkEsbUJBQVNBLEdBQVVBLEVBQUVBLENBQUNBO0lBQ3RCQSxtQkFBU0EsR0FBVUEsRUFBRUEsQ0FBQ0E7SUFDdEJBLGdCQUFNQSxHQUFVQSxFQUFFQSxDQUFDQTtJQUNuQkEsZ0JBQU1BLEdBQVVBLEVBQUVBLENBQUNBO0lBQ25CQSxnQkFBTUEsR0FBVUEsRUFBRUEsQ0FBQ0E7SUFDbkJBLGdCQUFNQSxHQUFVQSxFQUFFQSxDQUFDQTtJQTJtRmxDQSxnQkFBQ0E7QUFBREEsQ0E3cEZBLEFBNnBGQ0EsRUE3cEZ1QixVQUFVLEVBNnBGakM7QUFFRCxBQUFtQixpQkFBVixTQUFTLENBQUMiLCJmaWxlIjoicGFyc2Vycy9BV0RQYXJzZXIuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJpdG1hcERhdGFcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvYmFzZS9CaXRtYXBEYXRhXCIpO1xuaW1wb3J0IENvbG9yVHJhbnNmb3JtXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL0NvbG9yVHJhbnNmb3JtXCIpO1xuaW1wb3J0IE1hdHJpeDNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFwiKTtcbmltcG9ydCBWZWN0b3IzRFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIik7XG5pbXBvcnQgVVJMTG9hZGVyRGF0YUZvcm1hdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxMb2FkZXJEYXRhRm9ybWF0XCIpO1xuaW1wb3J0IFVSTFJlcXVlc3RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTFJlcXVlc3RcIik7XG5pbXBvcnQgQXNzZXRUeXBlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvQXNzZXRUeXBlXCIpO1xuaW1wb3J0IElBc3NldFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvSUFzc2V0XCIpO1xuaW1wb3J0IFBhcnNlckJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcGFyc2Vycy9QYXJzZXJCYXNlXCIpO1xuaW1wb3J0IFBhcnNlclV0aWxzXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3BhcnNlcnMvUGFyc2VyVXRpbHNcIik7XG5pbXBvcnQgUmVzb3VyY2VEZXBlbmRlbmN5XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcGFyc2Vycy9SZXNvdXJjZURlcGVuZGVuY3lcIik7XG5pbXBvcnQgUHJvamVjdGlvbkJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3Byb2plY3Rpb25zL1Byb2plY3Rpb25CYXNlXCIpO1xuaW1wb3J0IFBlcnNwZWN0aXZlUHJvamVjdGlvblx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wcm9qZWN0aW9ucy9QZXJzcGVjdGl2ZVByb2plY3Rpb25cIik7XG5pbXBvcnQgT3J0aG9ncmFwaGljUHJvamVjdGlvblx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wcm9qZWN0aW9ucy9PcnRob2dyYXBoaWNQcm9qZWN0aW9uXCIpO1xuaW1wb3J0IE9ydGhvZ3JhcGhpY09mZkNlbnRlclByb2plY3Rpb25cdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wcm9qZWN0aW9ucy9PcnRob2dyYXBoaWNPZmZDZW50ZXJQcm9qZWN0aW9uXCIpO1xuaW1wb3J0IEJpdG1hcEN1YmVUZXh0dXJlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvQml0bWFwQ3ViZVRleHR1cmVcIik7XG5pbXBvcnQgQml0bWFwVGV4dHVyZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvQml0bWFwVGV4dHVyZVwiKTtcbmltcG9ydCBDdWJlVGV4dHVyZUJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL0N1YmVUZXh0dXJlQmFzZVwiKTtcbmltcG9ydCBJbWFnZUN1YmVUZXh0dXJlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9JbWFnZUN1YmVUZXh0dXJlXCIpO1xuaW1wb3J0IEltYWdlVGV4dHVyZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9JbWFnZVRleHR1cmVcIik7XG5pbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZTJEQmFzZVwiKTtcbmltcG9ydCBUZXh0dXJlUHJveHlCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9UZXh0dXJlUHJveHlCYXNlXCIpO1xuaW1wb3J0IEJ5dGVBcnJheVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9CeXRlQXJyYXlcIik7XG5cbmltcG9ydCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2NvbnRhaW5lcnMvRGlzcGxheU9iamVjdENvbnRhaW5lclwiKTtcbmltcG9ydCBCbGVuZE1vZGVcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9CbGVuZE1vZGVcIik7XG5pbXBvcnQgRGlzcGxheU9iamVjdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9EaXNwbGF5T2JqZWN0XCIpO1xuaW1wb3J0IEdlb21ldHJ5XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9HZW9tZXRyeVwiKTtcbmltcG9ydCBMaWdodEJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9MaWdodEJhc2VcIik7XG5pbXBvcnQgVHJpYW5nbGVTdWJHZW9tZXRyeVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvVHJpYW5nbGVTdWJHZW9tZXRyeVwiKTtcbmltcG9ydCBEaXJlY3Rpb25hbExpZ2h0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9EaXJlY3Rpb25hbExpZ2h0XCIpO1xuaW1wb3J0IFBvaW50TGlnaHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvUG9pbnRMaWdodFwiKTtcbmltcG9ydCBDYW1lcmFcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9DYW1lcmFcIik7XG5pbXBvcnQgTWVzaFx0XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvTWVzaFwiKTtcbmltcG9ydCBTa3lib3hcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9Ta3lib3hcIik7XG5pbXBvcnQgTWF0ZXJpYWxCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9NYXRlcmlhbEJhc2VcIik7XG5pbXBvcnQgTGlnaHRQaWNrZXJCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9tYXRlcmlhbHMvbGlnaHRwaWNrZXJzL0xpZ2h0UGlja2VyQmFzZVwiKTtcbmltcG9ydCBTdGF0aWNMaWdodFBpY2tlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9saWdodHBpY2tlcnMvU3RhdGljTGlnaHRQaWNrZXJcIik7XG5pbXBvcnQgQ3ViZU1hcFNoYWRvd01hcHBlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9zaGFkb3dtYXBwZXJzL0N1YmVNYXBTaGFkb3dNYXBwZXJcIik7XG5pbXBvcnQgRGlyZWN0aW9uYWxTaGFkb3dNYXBwZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL3NoYWRvd21hcHBlcnMvRGlyZWN0aW9uYWxTaGFkb3dNYXBwZXJcIik7XG5pbXBvcnQgU2hhZG93TWFwcGVyQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL3NoYWRvd21hcHBlcnMvU2hhZG93TWFwcGVyQmFzZVwiKTtcbmltcG9ydCBQcmVmYWJCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJlZmFiQmFzZVwiKTtcbmltcG9ydCBQcmltaXRpdmVDYXBzdWxlUHJlZmFiXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlQ2Fwc3VsZVByZWZhYlwiKTtcbmltcG9ydCBQcmltaXRpdmVDb25lUHJlZmFiXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcHJlZmFicy9QcmltaXRpdmVDb25lUHJlZmFiXCIpO1xuaW1wb3J0IFByaW1pdGl2ZUN1YmVQcmVmYWJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wcmVmYWJzL1ByaW1pdGl2ZUN1YmVQcmVmYWJcIik7XG5pbXBvcnQgUHJpbWl0aXZlQ3lsaW5kZXJQcmVmYWJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcHJlZmFicy9QcmltaXRpdmVDeWxpbmRlclByZWZhYlwiKTtcbmltcG9ydCBQcmltaXRpdmVQbGFuZVByZWZhYlx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlUGxhbmVQcmVmYWJcIik7XG5pbXBvcnQgUHJpbWl0aXZlU3BoZXJlUHJlZmFiXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlU3BoZXJlUHJlZmFiXCIpO1xuaW1wb3J0IFByaW1pdGl2ZVRvcnVzUHJlZmFiXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcHJlZmFicy9QcmltaXRpdmVUb3J1c1ByZWZhYlwiKTtcblxuaW1wb3J0IEFuaW1hdGlvblNldEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRpb25TZXRCYXNlXCIpO1xuaW1wb3J0IEFuaW1hdG9yQmFzZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9hbmltYXRvcnMvQW5pbWF0b3JCYXNlXCIpO1xuaW1wb3J0IFNreWJveE1hdGVyaWFsXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvU2t5Ym94TWF0ZXJpYWxcIik7XG5pbXBvcnQgVHJpYW5nbGVNYXRlcmlhbE1vZGVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvVHJpYW5nbGVNYXRlcmlhbE1vZGVcIik7XG5pbXBvcnQgVHJpYW5nbGVNZXRob2RNYXRlcmlhbFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvVHJpYW5nbGVNZXRob2RNYXRlcmlhbFwiKTtcbmltcG9ydCBEZWZhdWx0TWF0ZXJpYWxNYW5hZ2VyXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy91dGlscy9EZWZhdWx0TWF0ZXJpYWxNYW5hZ2VyXCIpO1xuXG5pbXBvcnQgVmVydGV4QW5pbWF0aW9uU2V0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL1ZlcnRleEFuaW1hdGlvblNldFwiKTtcbmltcG9ydCBWZXJ0ZXhBbmltYXRvclx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL1ZlcnRleEFuaW1hdG9yXCIpO1xuaW1wb3J0IFNrZWxldG9uQW5pbWF0aW9uU2V0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL1NrZWxldG9uQW5pbWF0aW9uU2V0XCIpO1xuaW1wb3J0IFNrZWxldG9uQW5pbWF0b3JcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9Ta2VsZXRvbkFuaW1hdG9yXCIpO1xuaW1wb3J0IEpvaW50UG9zZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Kb2ludFBvc2VcIik7XG5pbXBvcnQgU2tlbGV0b25cdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Ta2VsZXRvblwiKTtcbmltcG9ydCBTa2VsZXRvblBvc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvU2tlbGV0b25Qb3NlXCIpO1xuaW1wb3J0IFNrZWxldG9uSm9pbnRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1NrZWxldG9uSm9pbnRcIik7XG5pbXBvcnQgU2tlbGV0b25DbGlwTm9kZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL25vZGVzL1NrZWxldG9uQ2xpcE5vZGVcIik7XG5pbXBvcnQgVmVydGV4Q2xpcE5vZGVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9ub2Rlcy9WZXJ0ZXhDbGlwTm9kZVwiKTtcbmltcG9ydCBBbWJpZW50RW52TWFwTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvQW1iaWVudEVudk1hcE1ldGhvZFwiKTtcbmltcG9ydCBEaWZmdXNlRGVwdGhNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9EaWZmdXNlRGVwdGhNZXRob2RcIik7XG5pbXBvcnQgRGlmZnVzZUNlbE1ldGhvZFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRGlmZnVzZUNlbE1ldGhvZFwiKTtcbmltcG9ydCBEaWZmdXNlR3JhZGllbnRNZXRob2RcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRGlmZnVzZUdyYWRpZW50TWV0aG9kXCIpO1xuaW1wb3J0IERpZmZ1c2VMaWdodE1hcE1ldGhvZFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9EaWZmdXNlTGlnaHRNYXBNZXRob2RcIik7XG5pbXBvcnQgRGlmZnVzZVdyYXBNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9EaWZmdXNlV3JhcE1ldGhvZFwiKTtcbmltcG9ydCBFZmZlY3RBbHBoYU1hc2tNZXRob2RcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRWZmZWN0QWxwaGFNYXNrTWV0aG9kXCIpO1xuaW1wb3J0IEVmZmVjdENvbG9yTWF0cml4TWV0aG9kXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0VmZmVjdENvbG9yTWF0cml4TWV0aG9kXCIpO1xuaW1wb3J0IEVmZmVjdENvbG9yVHJhbnNmb3JtTWV0aG9kXHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9FZmZlY3RDb2xvclRyYW5zZm9ybU1ldGhvZFwiKTtcbmltcG9ydCBFZmZlY3RFbnZNYXBNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9FZmZlY3RFbnZNYXBNZXRob2RcIik7XG5pbXBvcnQgRWZmZWN0Rm9nTWV0aG9kXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9FZmZlY3RGb2dNZXRob2RcIik7XG5pbXBvcnQgRWZmZWN0RnJlc25lbEVudk1hcE1ldGhvZFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRWZmZWN0RnJlc25lbEVudk1hcE1ldGhvZFwiKTtcbmltcG9ydCBFZmZlY3RMaWdodE1hcE1ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0VmZmVjdExpZ2h0TWFwTWV0aG9kXCIpO1xuaW1wb3J0IEVmZmVjdE1ldGhvZEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0VmZmVjdE1ldGhvZEJhc2VcIik7XG5pbXBvcnQgRWZmZWN0UmltTGlnaHRNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9FZmZlY3RSaW1MaWdodE1ldGhvZFwiKTtcbmltcG9ydCBOb3JtYWxTaW1wbGVXYXRlck1ldGhvZFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9Ob3JtYWxTaW1wbGVXYXRlck1ldGhvZFwiKTtcbmltcG9ydCBTaGFkb3dEaXRoZXJlZE1ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL1NoYWRvd0RpdGhlcmVkTWV0aG9kXCIpO1xuaW1wb3J0IFNoYWRvd0ZpbHRlcmVkTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvU2hhZG93RmlsdGVyZWRNZXRob2RcIik7XG5pbXBvcnQgU2hhZG93TWV0aG9kQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvU2hhZG93TWV0aG9kQmFzZVwiKTtcbmltcG9ydCBTcGVjdWxhckZyZXNuZWxNZXRob2RcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvU3BlY3VsYXJGcmVzbmVsTWV0aG9kXCIpO1xuaW1wb3J0IFNoYWRvd0hhcmRNZXRob2RcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL1NoYWRvd0hhcmRNZXRob2RcIik7XG5pbXBvcnQgU3BlY3VsYXJBbmlzb3Ryb3BpY01ldGhvZFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvU3BlY3VsYXJBbmlzb3Ryb3BpY01ldGhvZFwiKTtcbmltcG9ydCBTcGVjdWxhckNlbE1ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL1NwZWN1bGFyQ2VsTWV0aG9kXCIpO1xuaW1wb3J0IFNwZWN1bGFyUGhvbmdNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9TcGVjdWxhclBob25nTWV0aG9kXCIpO1xuaW1wb3J0IFNoYWRvd05lYXJNZXRob2RcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL1NoYWRvd05lYXJNZXRob2RcIik7XG5pbXBvcnQgU2hhZG93U29mdE1ldGhvZFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvU2hhZG93U29mdE1ldGhvZFwiKTtcblxuaW1wb3J0IEFXREJsb2NrXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcGFyc2Vycy9kYXRhL0FXREJsb2NrXCIpO1xuaW1wb3J0IEFXRFByb3BlcnRpZXNcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3BhcnNlcnMvZGF0YS9BV0RQcm9wZXJ0aWVzXCIpO1xuaW1wb3J0IEJpdEZsYWdzXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcGFyc2Vycy9kYXRhL0JpdEZsYWdzXCIpO1xuXG4vKipcbiAqIEFXRFBhcnNlciBwcm92aWRlcyBhIHBhcnNlciBmb3IgdGhlIEFXRCBkYXRhIHR5cGUuXG4gKi9cbmNsYXNzIEFXRFBhcnNlciBleHRlbmRzIFBhcnNlckJhc2Vcbntcblx0Ly9zZXQgdG8gXCJ0cnVlXCIgdG8gaGF2ZSBzb21lIGNvbnNvbGUubG9ncyBpbiB0aGUgQ29uc29sZVxuXHRwcml2YXRlIF9kZWJ1Zzpib29sZWFuID0gZmFsc2U7XG5cdHByaXZhdGUgX2J5dGVEYXRhOkJ5dGVBcnJheTtcblx0cHJpdmF0ZSBfc3RhcnRlZFBhcnNpbmc6Ym9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIF9jdXJfYmxvY2tfaWQ6bnVtYmVyO1xuXHRwcml2YXRlIF9ibG9ja3M6QXJyYXk8QVdEQmxvY2s+O1xuXHRwcml2YXRlIF9uZXdCbG9ja0J5dGVzOkJ5dGVBcnJheTtcblx0cHJpdmF0ZSBfdmVyc2lvbjpBcnJheTxudW1iZXI+O1xuXHRwcml2YXRlIF9jb21wcmVzc2lvbjpudW1iZXI7XG5cdHByaXZhdGUgX2FjY3VyYWN5T25CbG9ja3M6Ym9vbGVhbjtcblx0cHJpdmF0ZSBfYWNjdXJhY3lNYXRyaXg6Ym9vbGVhbjtcblx0cHJpdmF0ZSBfYWNjdXJhY3lHZW86Ym9vbGVhbjtcblx0cHJpdmF0ZSBfYWNjdXJhY3lQcm9wczpib29sZWFuO1xuXHRwcml2YXRlIF9tYXRyaXhOclR5cGU6bnVtYmVyO1xuXHRwcml2YXRlIF9nZW9OclR5cGU6bnVtYmVyO1xuXHRwcml2YXRlIF9wcm9wc05yVHlwZTpudW1iZXI7XG5cdHByaXZhdGUgX3N0cmVhbWluZzpib29sZWFuO1xuXHRwcml2YXRlIF90ZXh0dXJlX3VzZXJzOk9iamVjdCA9IHt9O1xuXHRwcml2YXRlIF9wYXJzZWRfaGVhZGVyOmJvb2xlYW4gPSBmYWxzZTtcblx0cHJpdmF0ZSBfYm9keTpCeXRlQXJyYXk7XG5cdHByaXZhdGUgX2RlZmF1bHRUZXh0dXJlOkJpdG1hcFRleHR1cmU7ICAgICAvLyBIVE1MIElNQUdFIFRFWFRVUkUgPj8gIVxuXHRwcml2YXRlIF9jdWJlVGV4dHVyZXM6QXJyYXk8YW55Pjtcblx0cHJpdmF0ZSBfZGVmYXVsdEJpdG1hcE1hdGVyaWFsOlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWw7XG5cdHByaXZhdGUgX2RlZmF1bHRDdWJlVGV4dHVyZTpCaXRtYXBDdWJlVGV4dHVyZTtcblxuXHRwdWJsaWMgc3RhdGljIENPTVBSRVNTSU9OTU9ERV9MWk1BOnN0cmluZyA9IFwibHptYVwiO1xuXHRwdWJsaWMgc3RhdGljIFVOQ09NUFJFU1NFRDpudW1iZXIgPSAwO1xuXHRwdWJsaWMgc3RhdGljIERFRkxBVEU6bnVtYmVyID0gMTtcblx0cHVibGljIHN0YXRpYyBMWk1BOm51bWJlciA9IDI7XG5cdHB1YmxpYyBzdGF0aWMgSU5UODpudW1iZXIgPSAxO1xuXHRwdWJsaWMgc3RhdGljIElOVDE2Om51bWJlciA9IDI7XG5cdHB1YmxpYyBzdGF0aWMgSU5UMzI6bnVtYmVyID0gMztcblx0cHVibGljIHN0YXRpYyBVSU5UODpudW1iZXIgPSA0O1xuXHRwdWJsaWMgc3RhdGljIFVJTlQxNjpudW1iZXIgPSA1O1xuXHRwdWJsaWMgc3RhdGljIFVJTlQzMjpudW1iZXIgPSA2O1xuXHRwdWJsaWMgc3RhdGljIEZMT0FUMzI6bnVtYmVyID0gNztcblx0cHVibGljIHN0YXRpYyBGTE9BVDY0Om51bWJlciA9IDg7XG5cdHB1YmxpYyBzdGF0aWMgQk9PTDpudW1iZXIgPSAyMTtcblx0cHVibGljIHN0YXRpYyBDT0xPUjpudW1iZXIgPSAyMjtcblx0cHVibGljIHN0YXRpYyBCQUREUjpudW1iZXIgPSAyMztcblx0cHVibGljIHN0YXRpYyBBV0RTVFJJTkc6bnVtYmVyID0gMzE7XG5cdHB1YmxpYyBzdGF0aWMgQVdEQllURUFSUkFZOm51bWJlciA9IDMyO1xuXHRwdWJsaWMgc3RhdGljIFZFQ1RPUjJ4MTpudW1iZXIgPSA0MTtcblx0cHVibGljIHN0YXRpYyBWRUNUT1IzeDE6bnVtYmVyID0gNDI7XG5cdHB1YmxpYyBzdGF0aWMgVkVDVE9SNHgxOm51bWJlciA9IDQzO1xuXHRwdWJsaWMgc3RhdGljIE1UWDN4MjpudW1iZXIgPSA0NDtcblx0cHVibGljIHN0YXRpYyBNVFgzeDM6bnVtYmVyID0gNDU7XG5cdHB1YmxpYyBzdGF0aWMgTVRYNHgzOm51bWJlciA9IDQ2O1xuXHRwdWJsaWMgc3RhdGljIE1UWDR4NDpudW1iZXIgPSA0NztcblxuXHRwcml2YXRlIGJsZW5kTW9kZURpYzpBcnJheTxzdHJpbmc+O1xuXHRwcml2YXRlIF9kZXB0aFNpemVEaWM6QXJyYXk8bnVtYmVyPjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBBV0RQYXJzZXIgb2JqZWN0LlxuXHQgKiBAcGFyYW0gdXJpIFRoZSB1cmwgb3IgaWQgb2YgdGhlIGRhdGEgb3IgZmlsZSB0byBiZSBwYXJzZWQuXG5cdCAqIEBwYXJhbSBleHRyYSBUaGUgaG9sZGVyIGZvciBleHRyYSBjb250ZXh0dWFsIGRhdGEgdGhhdCB0aGUgcGFyc2VyIG1pZ2h0IG5lZWQuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcihVUkxMb2FkZXJEYXRhRm9ybWF0LkFSUkFZX0JVRkZFUik7XG5cblx0XHR0aGlzLl9ibG9ja3MgPSBuZXcgQXJyYXk8QVdEQmxvY2s+KCk7XG5cdFx0dGhpcy5fYmxvY2tzWzBdID0gbmV3IEFXREJsb2NrKCk7XG5cdFx0dGhpcy5fYmxvY2tzWzBdLmRhdGEgPSBudWxsOyAvLyBaZXJvIGFkZHJlc3MgbWVhbnMgbnVsbCBpbiBBV0RcblxuXHRcdHRoaXMuYmxlbmRNb2RlRGljID0gbmV3IEFycmF5PHN0cmluZz4oKTsgLy8gdXNlZCB0byB0cmFuc2xhdGUgaW50cyB0byBibGVuZE1vZGUtc3RyaW5nc1xuXHRcdHRoaXMuYmxlbmRNb2RlRGljLnB1c2goQmxlbmRNb2RlLk5PUk1BTCk7XG5cdFx0dGhpcy5ibGVuZE1vZGVEaWMucHVzaChCbGVuZE1vZGUuQUREKTtcblx0XHR0aGlzLmJsZW5kTW9kZURpYy5wdXNoKEJsZW5kTW9kZS5BTFBIQSk7XG5cdFx0dGhpcy5ibGVuZE1vZGVEaWMucHVzaChCbGVuZE1vZGUuREFSS0VOKTtcblx0XHR0aGlzLmJsZW5kTW9kZURpYy5wdXNoKEJsZW5kTW9kZS5ESUZGRVJFTkNFKTtcblx0XHR0aGlzLmJsZW5kTW9kZURpYy5wdXNoKEJsZW5kTW9kZS5FUkFTRSk7XG5cdFx0dGhpcy5ibGVuZE1vZGVEaWMucHVzaChCbGVuZE1vZGUuSEFSRExJR0hUKTtcblx0XHR0aGlzLmJsZW5kTW9kZURpYy5wdXNoKEJsZW5kTW9kZS5JTlZFUlQpO1xuXHRcdHRoaXMuYmxlbmRNb2RlRGljLnB1c2goQmxlbmRNb2RlLkxBWUVSKTtcblx0XHR0aGlzLmJsZW5kTW9kZURpYy5wdXNoKEJsZW5kTW9kZS5MSUdIVEVOKTtcblx0XHR0aGlzLmJsZW5kTW9kZURpYy5wdXNoKEJsZW5kTW9kZS5NVUxUSVBMWSk7XG5cdFx0dGhpcy5ibGVuZE1vZGVEaWMucHVzaChCbGVuZE1vZGUuTk9STUFMKTtcblx0XHR0aGlzLmJsZW5kTW9kZURpYy5wdXNoKEJsZW5kTW9kZS5PVkVSTEFZKTtcblx0XHR0aGlzLmJsZW5kTW9kZURpYy5wdXNoKEJsZW5kTW9kZS5TQ1JFRU4pO1xuXHRcdHRoaXMuYmxlbmRNb2RlRGljLnB1c2goQmxlbmRNb2RlLlNIQURFUik7XG5cdFx0dGhpcy5ibGVuZE1vZGVEaWMucHVzaChCbGVuZE1vZGUuT1ZFUkxBWSk7XG5cblx0XHR0aGlzLl9kZXB0aFNpemVEaWMgPSBuZXcgQXJyYXk8bnVtYmVyPigpOyAvLyB1c2VkIHRvIHRyYW5zbGF0ZSBpbnRzIHRvIGRlcHRoU2l6ZS12YWx1ZXNcblx0XHR0aGlzLl9kZXB0aFNpemVEaWMucHVzaCgyNTYpO1xuXHRcdHRoaXMuX2RlcHRoU2l6ZURpYy5wdXNoKDUxMik7XG5cdFx0dGhpcy5fZGVwdGhTaXplRGljLnB1c2goMjA0OCk7XG5cdFx0dGhpcy5fZGVwdGhTaXplRGljLnB1c2goMTAyNCk7XG5cdFx0dGhpcy5fdmVyc2lvbiA9IEFycmF5PG51bWJlcj4oKTsgLy8gd2lsbCBjb250YWluIDIgaW50IChtYWpvci12ZXJzaW9uLCBtaW5vci12ZXJzaW9uKSBmb3IgYXdkLXZlcnNpb24tY2hlY2tcblx0fVxuXG5cdC8qKlxuXHQgKiBJbmRpY2F0ZXMgd2hldGhlciBvciBub3QgYSBnaXZlbiBmaWxlIGV4dGVuc2lvbiBpcyBzdXBwb3J0ZWQgYnkgdGhlIHBhcnNlci5cblx0ICogQHBhcmFtIGV4dGVuc2lvbiBUaGUgZmlsZSBleHRlbnNpb24gb2YgYSBwb3RlbnRpYWwgZmlsZSB0byBiZSBwYXJzZWQuXG5cdCAqIEByZXR1cm4gV2hldGhlciBvciBub3QgdGhlIGdpdmVuIGZpbGUgdHlwZSBpcyBzdXBwb3J0ZWQuXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIHN1cHBvcnRzVHlwZShleHRlbnNpb246c3RyaW5nKTpib29sZWFuXG5cdHtcblx0XHRleHRlbnNpb24gPSBleHRlbnNpb24udG9Mb3dlckNhc2UoKTtcblx0XHRyZXR1cm4gZXh0ZW5zaW9uID09IFwiYXdkXCI7XG5cdH1cblxuXHQvKipcblx0ICogVGVzdHMgd2hldGhlciBhIGRhdGEgYmxvY2sgY2FuIGJlIHBhcnNlZCBieSB0aGUgcGFyc2VyLlxuXHQgKiBAcGFyYW0gZGF0YSBUaGUgZGF0YSBibG9jayB0byBwb3RlbnRpYWxseSBiZSBwYXJzZWQuXG5cdCAqIEByZXR1cm4gV2hldGhlciBvciBub3QgdGhlIGdpdmVuIGRhdGEgaXMgc3VwcG9ydGVkLlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBzdXBwb3J0c0RhdGEoZGF0YTphbnkpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiAoUGFyc2VyVXRpbHMudG9TdHJpbmcoZGF0YSwgMykgPT0gJ0FXRCcpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX2lSZXNvbHZlRGVwZW5kZW5jeShyZXNvdXJjZURlcGVuZGVuY3k6UmVzb3VyY2VEZXBlbmRlbmN5KTp2b2lkXG5cdHtcblx0XHQvLyB0aGlzIHdpbGwgYmUgY2FsbGVkIHdoZW4gRGVwZW5kZW5jeSBoYXMgZmluaXNoZWQgbG9hZGluZy5cblx0XHQvLyB0aGUgQXNzZXRzIHdhaXRpbmcgZm9yIHRoaXMgQml0bWFwLCBjYW4gYmUgVGV4dHVyZSBvciBDdWJlVGV4dHVyZS5cblx0XHQvLyBpZiB0aGUgQml0bWFwIGlzIGF3YWl0ZWQgYnkgYSBDdWJlVGV4dHVyZSwgd2UgbmVlZCB0byBjaGVjayBpZiBpdHMgdGhlIGxhc3QgQml0bWFwIG9mIHRoZSBDdWJlVGV4dHVyZSxcblx0XHQvLyBzbyB3ZSBrbm93IGlmIHdlIGhhdmUgdG8gZmluYWxpemUgdGhlIEFzc2V0IChDdWJlVGV4dHVyZSkgb3Igbm90LlxuXHRcdGlmIChyZXNvdXJjZURlcGVuZGVuY3kuYXNzZXRzLmxlbmd0aCA9PSAxKSB7XG5cdFx0XHR2YXIgaXNDdWJlVGV4dHVyZUFycmF5OkFycmF5PHN0cmluZz4gPSByZXNvdXJjZURlcGVuZGVuY3kuaWQuc3BsaXQoXCIjXCIpO1xuXHRcdFx0dmFyIHJlc3NvdXJjZUlEOnN0cmluZyA9IGlzQ3ViZVRleHR1cmVBcnJheVswXTtcblx0XHRcdHZhciBhc3NldDpUZXh0dXJlUHJveHlCYXNlO1xuXHRcdFx0dmFyIHRoaXNCaXRtYXBUZXh0dXJlOlRleHR1cmUyREJhc2U7XG5cdFx0XHR2YXIgYmxvY2s6QVdEQmxvY2s7XG5cblx0XHRcdGlmIChpc0N1YmVUZXh0dXJlQXJyYXkubGVuZ3RoID09IDEpIC8vIE5vdCBhIGN1YmUgdGV4dHVyZVxuXHRcdFx0e1xuXHRcdFx0XHRhc3NldCA9IDxUZXh0dXJlMkRCYXNlPiByZXNvdXJjZURlcGVuZGVuY3kuYXNzZXRzWzBdO1xuXHRcdFx0XHRpZiAoYXNzZXQpIHtcblx0XHRcdFx0XHR2YXIgbWF0OlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWw7XG5cdFx0XHRcdFx0dmFyIHVzZXJzOkFycmF5PHN0cmluZz47XG5cblx0XHRcdFx0XHRibG9jayA9IHRoaXMuX2Jsb2Nrc1sgcmVzb3VyY2VEZXBlbmRlbmN5LmlkIF07XG5cdFx0XHRcdFx0YmxvY2suZGF0YSA9IGFzc2V0OyAvLyBTdG9yZSBmaW5pc2hlZCBhc3NldFxuXG5cdFx0XHRcdFx0Ly8gUmVzZXQgbmFtZSBvZiB0ZXh0dXJlIHRvIHRoZSBvbmUgZGVmaW5lZCBpbiB0aGUgQVdEIGZpbGUsXG5cdFx0XHRcdFx0Ly8gYXMgb3Bwb3NlZCB0byB3aGF0ZXZlciB0aGUgaW1hZ2UgcGFyc2VyIGNhbWUgdXAgd2l0aC5cblx0XHRcdFx0XHRhc3NldC5yZXNldEFzc2V0UGF0aChibG9jay5uYW1lLCBudWxsLCB0cnVlKTtcblx0XHRcdFx0XHRibG9jay5uYW1lID0gYXNzZXQubmFtZTtcblx0XHRcdFx0XHQvLyBGaW5hbGl6ZSB0ZXh0dXJlIGFzc2V0IHRvIGRpc3BhdGNoIHRleHR1cmUgZXZlbnQsIHdoaWNoIHdhc1xuXHRcdFx0XHRcdC8vIHByZXZpb3VzbHkgc3VwcHJlc3NlZCB3aGlsZSB0aGUgZGVwZW5kZW5jeSB3YXMgbG9hZGVkLlxuXHRcdFx0XHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KDxJQXNzZXQ+IGFzc2V0KTtcblxuXHRcdFx0XHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJTdWNjZXNzZnVsbHkgbG9hZGVkIEJpdG1hcCBmb3IgdGV4dHVyZVwiKTtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIHRleHR1cmU6IE5hbWUgPSBcIiArIGJsb2NrLm5hbWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoaXNDdWJlVGV4dHVyZUFycmF5Lmxlbmd0aCA+IDEpIC8vIEN1YmUgVGV4dHVyZVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzQml0bWFwVGV4dHVyZSA9IDxCaXRtYXBUZXh0dXJlPiByZXNvdXJjZURlcGVuZGVuY3kuYXNzZXRzWzBdO1xuXG5cdFx0XHRcdHZhciB0eDpJbWFnZVRleHR1cmUgPSA8SW1hZ2VUZXh0dXJlPiB0aGlzQml0bWFwVGV4dHVyZTtcblxuXHRcdFx0XHR0aGlzLl9jdWJlVGV4dHVyZXNbIGlzQ3ViZVRleHR1cmVBcnJheVsxXSBdID0gdHguaHRtbEltYWdlRWxlbWVudDsgLy8gP1xuXHRcdFx0XHR0aGlzLl90ZXh0dXJlX3VzZXJzW3Jlc3NvdXJjZUlEXS5wdXNoKDEpO1xuXG5cdFx0XHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiU3VjY2Vzc2Z1bGx5IGxvYWRlZCBCaXRtYXAgXCIgKyB0aGlzLl90ZXh0dXJlX3VzZXJzW3Jlc3NvdXJjZUlEXS5sZW5ndGggKyBcIiAvIDYgZm9yIEN1YmV0ZXh0dXJlXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLl90ZXh0dXJlX3VzZXJzW3Jlc3NvdXJjZUlEXS5sZW5ndGggPT0gdGhpcy5fY3ViZVRleHR1cmVzLmxlbmd0aCkge1xuXG5cdFx0XHRcdFx0dmFyIHBvc1g6YW55ID0gdGhpcy5fY3ViZVRleHR1cmVzWzBdO1xuXHRcdFx0XHRcdHZhciBuZWdYOmFueSA9IHRoaXMuX2N1YmVUZXh0dXJlc1sxXTtcblx0XHRcdFx0XHR2YXIgcG9zWTphbnkgPSB0aGlzLl9jdWJlVGV4dHVyZXNbMl07XG5cdFx0XHRcdFx0dmFyIG5lZ1k6YW55ID0gdGhpcy5fY3ViZVRleHR1cmVzWzNdO1xuXHRcdFx0XHRcdHZhciBwb3NaOmFueSA9IHRoaXMuX2N1YmVUZXh0dXJlc1s0XTtcblx0XHRcdFx0XHR2YXIgbmVnWjphbnkgPSB0aGlzLl9jdWJlVGV4dHVyZXNbNV07XG5cblx0XHRcdFx0XHRhc3NldCA9IDxUZXh0dXJlUHJveHlCYXNlPiBuZXcgSW1hZ2VDdWJlVGV4dHVyZShwb3NYLCBuZWdYLCBwb3NZLCBuZWdZLCBwb3NaLCBuZWdaKTtcblx0XHRcdFx0XHRibG9jayA9IHRoaXMuX2Jsb2Nrc1tyZXNzb3VyY2VJRF07XG5cdFx0XHRcdFx0YmxvY2suZGF0YSA9IGFzc2V0OyAvLyBTdG9yZSBmaW5pc2hlZCBhc3NldFxuXG5cdFx0XHRcdFx0Ly8gUmVzZXQgbmFtZSBvZiB0ZXh0dXJlIHRvIHRoZSBvbmUgZGVmaW5lZCBpbiB0aGUgQVdEIGZpbGUsXG5cdFx0XHRcdFx0Ly8gYXMgb3Bwb3NlZCB0byB3aGF0ZXZlciB0aGUgaW1hZ2UgcGFyc2VyIGNhbWUgdXAgd2l0aC5cblx0XHRcdFx0XHRhc3NldC5yZXNldEFzc2V0UGF0aChibG9jay5uYW1lLCBudWxsLCB0cnVlKTtcblx0XHRcdFx0XHRibG9jay5uYW1lID0gYXNzZXQubmFtZTtcblx0XHRcdFx0XHQvLyBGaW5hbGl6ZSB0ZXh0dXJlIGFzc2V0IHRvIGRpc3BhdGNoIHRleHR1cmUgZXZlbnQsIHdoaWNoIHdhc1xuXHRcdFx0XHRcdC8vIHByZXZpb3VzbHkgc3VwcHJlc3NlZCB3aGlsZSB0aGUgZGVwZW5kZW5jeSB3YXMgbG9hZGVkLlxuXHRcdFx0XHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KDxJQXNzZXQ+IGFzc2V0KTtcblx0XHRcdFx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIEN1YmVUZXh0dXJlOiBOYW1lID0gXCIgKyBibG9jay5uYW1lKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pUmVzb2x2ZURlcGVuZGVuY3lGYWlsdXJlKHJlc291cmNlRGVwZW5kZW5jeTpSZXNvdXJjZURlcGVuZGVuY3kpOnZvaWRcblx0e1xuXHRcdC8vbm90IHVzZWQgLSBpZiBhIGRlcGVuZGN5IGZhaWxzLCB0aGUgYXdhaXRpbmcgVGV4dHVyZSBvciBDdWJlVGV4dHVyZSB3aWxsIG5ldmVyIGJlIGZpbmFsaXplZCwgYW5kIHRoZSBkZWZhdWx0LWJpdG1hcHMgd2lsbCBiZSB1c2VkLlxuXHRcdC8vIHRoaXMgbWVhbnMsIHRoYXQgaWYgb25lIEJpdG1hcCBvZiBhIEN1YmVUZXh0dXJlIGZhaWxzLCB0aGUgQ3ViZVRleHR1cmUgd2lsbCBoYXZlIHRoZSBEZWZhdWx0VGV4dHVyZSBhcHBsaWVkIGZvciBhbGwgc2l4IEJpdG1hcHMuXG5cdH1cblxuXHQvKipcblx0ICogUmVzb2x2ZSBhIGRlcGVuZGVuY3kgbmFtZVxuXHQgKlxuXHQgKiBAcGFyYW0gcmVzb3VyY2VEZXBlbmRlbmN5IFRoZSBkZXBlbmRlbmN5IHRvIGJlIHJlc29sdmVkLlxuXHQgKi9cblx0cHVibGljIF9pUmVzb2x2ZURlcGVuZGVuY3lOYW1lKHJlc291cmNlRGVwZW5kZW5jeTpSZXNvdXJjZURlcGVuZGVuY3ksIGFzc2V0OklBc3NldCk6c3RyaW5nXG5cdHtcblx0XHR2YXIgb2xkTmFtZTpzdHJpbmcgPSBhc3NldC5uYW1lO1xuXG5cdFx0aWYgKGFzc2V0KSB7XG5cdFx0XHR2YXIgYmxvY2s6QVdEQmxvY2sgPSB0aGlzLl9ibG9ja3NbcGFyc2VJbnQocmVzb3VyY2VEZXBlbmRlbmN5LmlkKV07XG5cdFx0XHQvLyBSZXNldCBuYW1lIG9mIHRleHR1cmUgdG8gdGhlIG9uZSBkZWZpbmVkIGluIHRoZSBBV0QgZmlsZSxcblx0XHRcdC8vIGFzIG9wcG9zZWQgdG8gd2hhdGV2ZXIgdGhlIGltYWdlIHBhcnNlciBjYW1lIHVwIHdpdGguXG5cdFx0XHRhc3NldC5yZXNldEFzc2V0UGF0aChibG9jay5uYW1lLCBudWxsLCB0cnVlKTtcblx0XHR9XG5cblx0XHR2YXIgbmV3TmFtZTpzdHJpbmcgPSBhc3NldC5uYW1lO1xuXG5cdFx0YXNzZXQubmFtZSA9IG9sZE5hbWU7XG5cblx0XHRyZXR1cm4gbmV3TmFtZTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX3BQcm9jZWVkUGFyc2luZygpOmJvb2xlYW5cblx0e1xuXG5cdFx0aWYgKCF0aGlzLl9zdGFydGVkUGFyc2luZykge1xuXHRcdFx0dGhpcy5fYnl0ZURhdGEgPSB0aGlzLl9wR2V0Qnl0ZURhdGEoKTsvL2dldEJ5dGVEYXRhKCk7XG5cdFx0XHR0aGlzLl9zdGFydGVkUGFyc2luZyA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKCF0aGlzLl9wYXJzZWRfaGVhZGVyKSB7XG5cblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFx0Ly8gTElUVExFX0VORElBTiAtIERlZmF1bHQgZm9yIEFycmF5QnVmZmVyIC8gTm90IGltcGxlbWVudGVkIGluIEJ5dGVBcnJheVxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XHQvL3RoaXMuX2J5dGVEYXRhLmVuZGlhbiA9IEVuZGlhbi5MSVRUTEVfRU5ESUFOO1xuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFx0Ly8gUGFyc2UgaGVhZGVyIGFuZCBkZWNvbXByZXNzIGJvZHkgaWYgbmVlZGVkXG5cdFx0XHR0aGlzLnBhcnNlSGVhZGVyKCk7XG5cblx0XHRcdHN3aXRjaCAodGhpcy5fY29tcHJlc3Npb24pIHtcblxuXHRcdFx0XHRjYXNlIEFXRFBhcnNlci5ERUZMQVRFOlxuXHRcdFx0XHRjYXNlIEFXRFBhcnNlci5MWk1BOlxuXHRcdFx0XHRcdHRoaXMuX3BEaWVXaXRoRXJyb3IoJ0NvbXByZXNzZWQgQVdEIGZvcm1hdHMgbm90IHlldCBzdXBwb3J0ZWQnKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIEFXRFBhcnNlci5VTkNPTVBSRVNTRUQ6XG5cdFx0XHRcdFx0dGhpcy5fYm9keSA9IHRoaXMuX2J5dGVEYXRhO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFx0XHQvLyBDb21wcmVzc2VkIEFXRCBGb3JtYXRzIG5vdCB5ZXQgc3VwcG9ydGVkXG5cdFx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFx0XHRcdC8qXG5cdFx0XHRcdCBjYXNlIEFXRFBhcnNlci5ERUZMQVRFOlxuXG5cdFx0XHRcdCB0aGlzLl9ib2R5ID0gbmV3IEJ5dGVBcnJheSgpO1xuXHRcdFx0XHQgdGhpcy5fYnl0ZURhdGEucmVhZEJ5dGVzKHRoaXMuX2JvZHksIDAsIHRoaXMuX2J5dGVEYXRhLmdldEJ5dGVzQXZhaWxhYmxlKCkpO1xuXHRcdFx0XHQgdGhpcy5fYm9keS51bmNvbXByZXNzKCk7XG5cblx0XHRcdFx0IGJyZWFrO1xuXHRcdFx0XHQgY2FzZSBBV0RQYXJzZXIuTFpNQTpcblxuXHRcdFx0XHQgdGhpcy5fYm9keSA9IG5ldyBCeXRlQXJyYXkoKTtcblx0XHRcdFx0IHRoaXMuX2J5dGVEYXRhLnJlYWRCeXRlcyh0aGlzLl9ib2R5LCAwLCB0aGlzLl9ieXRlRGF0YS5nZXRCeXRlc0F2YWlsYWJsZSgpKTtcblx0XHRcdFx0IHRoaXMuX2JvZHkudW5jb21wcmVzcyhDT01QUkVTU0lPTk1PREVfTFpNQSk7XG5cblx0XHRcdFx0IGJyZWFrO1xuXHRcdFx0XHQgLy8qL1xuXG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX3BhcnNlZF9oZWFkZXIgPSB0cnVlO1xuXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdC8vIExJVFRMRV9FTkRJQU4gLSBEZWZhdWx0IGZvciBBcnJheUJ1ZmZlciAvIE5vdCBpbXBsZW1lbnRlZCBpbiBCeXRlQXJyYXlcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFx0Ly90aGlzLl9ib2R5LmVuZGlhbiA9IEVuZGlhbi5MSVRUTEVfRU5ESUFOOy8vIFNob3VsZCBiZSBkZWZhdWx0XG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9ib2R5KSB7XG5cblx0XHRcdHdoaWxlICh0aGlzLl9ib2R5LmdldEJ5dGVzQXZhaWxhYmxlKCkgPiAwICYmICF0aGlzLnBhcnNpbmdQYXVzZWQpIC8vJiYgdGhpcy5fcEhhc1RpbWUoKSApXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMucGFyc2VOZXh0QmxvY2soKTtcblxuXHRcdFx0fVxuXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdC8vIFJldHVybiBjb21wbGV0ZSBzdGF0dXNcblx0XHRcdGlmICh0aGlzLl9ib2R5LmdldEJ5dGVzQXZhaWxhYmxlKCkgPT0gMCkge1xuXHRcdFx0XHR0aGlzLmRpc3Bvc2UoKTtcblx0XHRcdFx0cmV0dXJuICBQYXJzZXJCYXNlLlBBUlNJTkdfRE9ORTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiAgUGFyc2VyQmFzZS5NT1JFX1RPX1BBUlNFO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHN3aXRjaCAodGhpcy5fY29tcHJlc3Npb24pIHtcblxuXHRcdFx0XHRjYXNlIEFXRFBhcnNlci5ERUZMQVRFOlxuXHRcdFx0XHRjYXNlIEFXRFBhcnNlci5MWk1BOlxuXG5cdFx0XHRcdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIighKSBBV0RQYXJzZXIgRXJyb3I6IENvbXByZXNzZWQgQVdEIGZvcm1hdHMgbm90IHlldCBzdXBwb3J0ZWQgKCEpXCIpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHR9XG5cdFx0XHQvLyBFcnJvciAtIG1vc3QgbGlrZWx5IF9ib2R5IG5vdCBzZXQgYmVjYXVzZSB3ZSBkbyBub3Qgc3VwcG9ydCBjb21wcmVzc2lvbi5cblx0XHRcdHJldHVybiAgUGFyc2VyQmFzZS5QQVJTSU5HX0RPTkU7XG5cblx0XHR9XG5cblx0fVxuXG5cdHB1YmxpYyBfcFN0YXJ0UGFyc2luZyhmcmFtZUxpbWl0Om51bWJlcilcblx0e1xuXHRcdHN1cGVyLl9wU3RhcnRQYXJzaW5nKGZyYW1lTGltaXQpO1xuXG5cdFx0Ly9jcmVhdGUgYSBjb250ZW50IG9iamVjdCBmb3IgTG9hZGVyc1xuXHRcdHRoaXMuX3BDb250ZW50ID0gbmV3IERpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblx0fVxuXG5cdHByaXZhdGUgZGlzcG9zZSgpOnZvaWRcblx0e1xuXG5cdFx0Zm9yICh2YXIgYyBpbiB0aGlzLl9ibG9ja3MpIHtcblxuXHRcdFx0dmFyIGI6QVdEQmxvY2sgPSA8QVdEQmxvY2s+IHRoaXMuX2Jsb2Nrc1sgYyBdO1xuXHRcdFx0Yi5kaXNwb3NlKCk7XG5cblx0XHR9XG5cblx0fVxuXG5cdHByaXZhdGUgcGFyc2VOZXh0QmxvY2soKTp2b2lkXG5cdHtcblx0XHR2YXIgYmxvY2s6QVdEQmxvY2s7XG5cdFx0dmFyIGFzc2V0RGF0YTpJQXNzZXQ7XG5cdFx0dmFyIGlzUGFyc2VkOmJvb2xlYW4gPSBmYWxzZTtcblx0XHR2YXIgbnM6bnVtYmVyO1xuXHRcdHZhciB0eXBlOm51bWJlcjtcblx0XHR2YXIgZmxhZ3M6bnVtYmVyO1xuXHRcdHZhciBsZW46bnVtYmVyO1xuXG5cdFx0dGhpcy5fY3VyX2Jsb2NrX2lkID0gdGhpcy5fYm9keS5yZWFkVW5zaWduZWRJbnQoKTtcblxuXHRcdG5zID0gdGhpcy5fYm9keS5yZWFkVW5zaWduZWRCeXRlKCk7XG5cdFx0dHlwZSA9IHRoaXMuX2JvZHkucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdGZsYWdzID0gdGhpcy5fYm9keS5yZWFkVW5zaWduZWRCeXRlKCk7XG5cdFx0bGVuID0gdGhpcy5fYm9keS5yZWFkVW5zaWduZWRJbnQoKTtcblxuXHRcdHZhciBibG9ja0NvbXByZXNzaW9uOmJvb2xlYW4gPSBCaXRGbGFncy50ZXN0KGZsYWdzLCBCaXRGbGFncy5GTEFHNCk7XG5cdFx0dmFyIGJsb2NrQ29tcHJlc3Npb25MWk1BOmJvb2xlYW4gPSBCaXRGbGFncy50ZXN0KGZsYWdzLCBCaXRGbGFncy5GTEFHNSk7XG5cblx0XHRpZiAodGhpcy5fYWNjdXJhY3lPbkJsb2Nrcykge1xuXHRcdFx0dGhpcy5fYWNjdXJhY3lNYXRyaXggPSBCaXRGbGFncy50ZXN0KGZsYWdzLCBCaXRGbGFncy5GTEFHMSk7XG5cdFx0XHR0aGlzLl9hY2N1cmFjeUdlbyA9IEJpdEZsYWdzLnRlc3QoZmxhZ3MsIEJpdEZsYWdzLkZMQUcyKTtcblx0XHRcdHRoaXMuX2FjY3VyYWN5UHJvcHMgPSBCaXRGbGFncy50ZXN0KGZsYWdzLCBCaXRGbGFncy5GTEFHMyk7XG5cdFx0XHR0aGlzLl9nZW9OclR5cGUgPSBBV0RQYXJzZXIuRkxPQVQzMjtcblxuXHRcdFx0aWYgKHRoaXMuX2FjY3VyYWN5R2VvKSB7XG5cdFx0XHRcdHRoaXMuX2dlb05yVHlwZSA9IEFXRFBhcnNlci5GTE9BVDY0O1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9tYXRyaXhOclR5cGUgPSBBV0RQYXJzZXIuRkxPQVQzMjtcblxuXHRcdFx0aWYgKHRoaXMuX2FjY3VyYWN5TWF0cml4KSB7XG5cdFx0XHRcdHRoaXMuX21hdHJpeE5yVHlwZSA9IEFXRFBhcnNlci5GTE9BVDY0O1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9wcm9wc05yVHlwZSA9IEFXRFBhcnNlci5GTE9BVDMyO1xuXG5cdFx0XHRpZiAodGhpcy5fYWNjdXJhY3lQcm9wcykge1xuXHRcdFx0XHR0aGlzLl9wcm9wc05yVHlwZSA9IEFXRFBhcnNlci5GTE9BVDY0O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciBibG9ja0VuZEFsbDpudW1iZXIgPSB0aGlzLl9ib2R5LnBvc2l0aW9uICsgbGVuO1xuXG5cdFx0aWYgKGxlbiA+IHRoaXMuX2JvZHkuZ2V0Qnl0ZXNBdmFpbGFibGUoKSkge1xuXHRcdFx0dGhpcy5fcERpZVdpdGhFcnJvcignQVdEMiBibG9jayBsZW5ndGggaXMgYmlnZ2VyIHRoYW4gdGhlIGJ5dGVzIHRoYXQgYXJlIGF2YWlsYWJsZSEnKTtcblx0XHRcdHRoaXMuX2JvZHkucG9zaXRpb24gKz0gdGhpcy5fYm9keS5nZXRCeXRlc0F2YWlsYWJsZSgpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLl9uZXdCbG9ja0J5dGVzID0gbmV3IEJ5dGVBcnJheSgpO1xuXG5cblx0XHR0aGlzLl9ib2R5LnJlYWRCeXRlcyh0aGlzLl9uZXdCbG9ja0J5dGVzLCAwLCBsZW4pO1xuXG5cdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0Ly8gQ29tcHJlc3NlZCBBV0QgRm9ybWF0cyBub3QgeWV0IHN1cHBvcnRlZFxuXG5cdFx0aWYgKGJsb2NrQ29tcHJlc3Npb24pIHtcblx0XHRcdHRoaXMuX3BEaWVXaXRoRXJyb3IoJ0NvbXByZXNzZWQgQVdEIGZvcm1hdHMgbm90IHlldCBzdXBwb3J0ZWQnKTtcblxuXHRcdFx0Lypcblx0XHRcdCBpZiAoYmxvY2tDb21wcmVzc2lvbkxaTUEpXG5cdFx0XHQge1xuXHRcdFx0IHRoaXMuX25ld0Jsb2NrQnl0ZXMudW5jb21wcmVzcyhBV0RQYXJzZXIuQ09NUFJFU1NJT05NT0RFX0xaTUEpO1xuXHRcdFx0IH1cblx0XHRcdCBlbHNlXG5cdFx0XHQge1xuXHRcdFx0IHRoaXMuX25ld0Jsb2NrQnl0ZXMudW5jb21wcmVzcygpO1xuXHRcdFx0IH1cblx0XHRcdCAqL1xuXG5cdFx0fVxuXG5cdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0Ly8gTElUVExFX0VORElBTiAtIERlZmF1bHQgZm9yIEFycmF5QnVmZmVyIC8gTm90IGltcGxlbWVudGVkIGluIEJ5dGVBcnJheVxuXHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdC8vdGhpcy5fbmV3QmxvY2tCeXRlcy5lbmRpYW4gPSBFbmRpYW4uTElUVExFX0VORElBTjtcblx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRcdHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPSAwO1xuXHRcdGJsb2NrID0gbmV3IEFXREJsb2NrKCk7XG5cdFx0YmxvY2subGVuID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiArIGxlbjtcblx0XHRibG9jay5pZCA9IHRoaXMuX2N1cl9ibG9ja19pZDtcblxuXHRcdHZhciBibG9ja0VuZEJsb2NrOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gKyBsZW47XG5cblx0XHRpZiAoYmxvY2tDb21wcmVzc2lvbikge1xuXHRcdFx0dGhpcy5fcERpZVdpdGhFcnJvcignQ29tcHJlc3NlZCBBV0QgZm9ybWF0cyBub3QgeWV0IHN1cHBvcnRlZCcpO1xuXHRcdFx0Ly9ibG9ja0VuZEJsb2NrICAgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uICsgdGhpcy5fbmV3QmxvY2tCeXRlcy5sZW5ndGg7XG5cdFx0XHQvL2Jsb2NrLmxlbiAgICAgICA9IGJsb2NrRW5kQmxvY2s7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIkFXREJsb2NrOiAgSUQgPSBcIiArIHRoaXMuX2N1cl9ibG9ja19pZCArIFwiIHwgVHlwZUlEID0gXCIgKyB0eXBlICsgXCIgfCBDb21wcmVzc2lvbiA9IFwiICsgYmxvY2tDb21wcmVzc2lvbiArIFwiIHwgTWF0cml4LVByZWNpc2lvbiA9IFwiICsgdGhpcy5fYWNjdXJhY3lNYXRyaXggKyBcIiB8IEdlb21ldHJ5LVByZWNpc2lvbiA9IFwiICsgdGhpcy5fYWNjdXJhY3lHZW8gKyBcIiB8IFByb3BlcnRpZXMtUHJlY2lzaW9uID0gXCIgKyB0aGlzLl9hY2N1cmFjeVByb3BzKTtcblx0XHR9XG5cblx0XHR0aGlzLl9ibG9ja3NbdGhpcy5fY3VyX2Jsb2NrX2lkXSA9IGJsb2NrO1xuXG5cdFx0aWYgKCh0aGlzLl92ZXJzaW9uWzBdID09IDIpICYmICh0aGlzLl92ZXJzaW9uWzFdID09IDEpKSB7XG5cblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXHRcdFx0XHRjYXNlIDExOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VQcmltaXR2ZXModGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRpc1BhcnNlZCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMzE6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZVNreWJveEluc3RhbmNlKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0aXNQYXJzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDQxOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VMaWdodCh0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGlzUGFyc2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSA0Mjpcblx0XHRcdFx0XHR0aGlzLnBhcnNlQ2FtZXJhKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0aXNQYXJzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdC8vICBjYXNlIDQzOlxuXHRcdFx0XHQvLyAgICAgIHBhcnNlVGV4dHVyZVByb2plY3RvcihfY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0Ly8gICAgICBpc1BhcnNlZCA9IHRydWU7XG5cdFx0XHRcdC8vICAgICAgYnJlYWs7XG5cblx0XHRcdFx0Y2FzZSA1MTpcblx0XHRcdFx0XHR0aGlzLnBhcnNlTGlnaHRQaWNrZXIodGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRpc1BhcnNlZCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgODE6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZU1hdGVyaWFsX3YxKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0aXNQYXJzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDgzOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VDdWJlVGV4dHVyZSh0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGlzUGFyc2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSA5MTpcblx0XHRcdFx0XHR0aGlzLnBhcnNlU2hhcmVkTWV0aG9kQmxvY2sodGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRpc1BhcnNlZCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgOTI6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZVNoYWRvd01ldGhvZEJsb2NrKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0aXNQYXJzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDExMTpcblx0XHRcdFx0XHR0aGlzLnBhcnNlTWVzaFBvc2VBbmltYXRpb24odGhpcy5fY3VyX2Jsb2NrX2lkLCB0cnVlKTtcblx0XHRcdFx0XHRpc1BhcnNlZCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMTEyOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VNZXNoUG9zZUFuaW1hdGlvbih0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGlzUGFyc2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAxMTM6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZVZlcnRleEFuaW1hdGlvblNldCh0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGlzUGFyc2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAxMjI6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZUFuaW1hdG9yU2V0KHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0aXNQYXJzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDI1Mzpcblx0XHRcdFx0XHR0aGlzLnBhcnNlQ29tbWFuZCh0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGlzUGFyc2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdC8vKi9cblx0XHR9XG5cdFx0Ly8qXG5cdFx0aWYgKGlzUGFyc2VkID09IGZhbHNlKSB7XG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblxuXHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZVRyaWFuZ2xlR2VvbWV0cmllQmxvY2sodGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAyMjpcblx0XHRcdFx0XHR0aGlzLnBhcnNlQ29udGFpbmVyKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMjM6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZU1lc2hJbnN0YW5jZSh0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDgxOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VNYXRlcmlhbCh0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDgyOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VUZXh0dXJlKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMTAxOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VTa2VsZXRvbih0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDEwMjpcblx0XHRcdFx0XHR0aGlzLnBhcnNlU2tlbGV0b25Qb3NlKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMTAzOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VTa2VsZXRvbkFuaW1hdGlvbih0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDEyMTpcblx0XHRcdFx0XHQvL3RoaXMucGFyc2VVVkFuaW1hdGlvbih0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdC8vYnJlYWs7XG5cdFx0XHRcdGNhc2UgMjU0OlxuXHRcdFx0XHRcdHRoaXMucGFyc2VOYW1lU3BhY2UodGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAyNTU6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZU1ldGFEYXRhKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkFXREJsb2NrOiAgIFVua25vd24gQmxvY2tUeXBlICAoQmxvY2tJRCA9IFwiICsgdGhpcy5fY3VyX2Jsb2NrX2lkICsgXCIpIC0gU2tpcCBcIiArIGxlbiArIFwiIGJ5dGVzXCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uICs9IGxlbjtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8qL1xuXG5cdFx0dmFyIG1zZ0NudDpudW1iZXIgPSAwO1xuXHRcdGlmICh0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uID09IGJsb2NrRW5kQmxvY2spIHtcblx0XHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0XHRpZiAoYmxvY2suZXJyb3JNZXNzYWdlcykge1xuXHRcdFx0XHRcdHdoaWxlIChtc2dDbnQgPCBibG9jay5lcnJvck1lc3NhZ2VzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCIgICAgICAgICghKSBFcnJvcjogXCIgKyBibG9jay5lcnJvck1lc3NhZ2VzW21zZ0NudF0gKyBcIiAoISlcIik7XG5cdFx0XHRcdFx0XHRtc2dDbnQrKztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcIlxcblwiKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cblx0XHRcdFx0Y29uc29sZS5sb2coXCIgICghKSghKSghKSBFcnJvciB3aGlsZSByZWFkaW5nIEFXREJsb2NrIElEIFwiICsgdGhpcy5fY3VyX2Jsb2NrX2lkICsgXCIgPSBza2lwIHRvIG5leHQgYmxvY2tcIik7XG5cblx0XHRcdFx0aWYgKGJsb2NrLmVycm9yTWVzc2FnZXMpIHtcblx0XHRcdFx0XHR3aGlsZSAobXNnQ250IDwgYmxvY2suZXJyb3JNZXNzYWdlcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiICAgICAgICAoISkgRXJyb3I6IFwiICsgYmxvY2suZXJyb3JNZXNzYWdlc1ttc2dDbnRdICsgXCIgKCEpXCIpO1xuXHRcdFx0XHRcdFx0bXNnQ250Kys7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fYm9keS5wb3NpdGlvbiA9IGJsb2NrRW5kQWxsO1xuXHRcdHRoaXMuX25ld0Jsb2NrQnl0ZXMgPSBudWxsO1xuXG5cdH1cblxuXG5cdC8vLS1QYXJzZXIgQmxvY2tzLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0Ly9CbG9jayBJRCA9IDFcblx0cHJpdmF0ZSBwYXJzZVRyaWFuZ2xlR2VvbWV0cmllQmxvY2soYmxvY2tJRDpudW1iZXIpOnZvaWRcblx0e1xuXG5cdFx0dmFyIGdlb206R2VvbWV0cnkgPSBuZXcgR2VvbWV0cnkoKTtcblxuXHRcdC8vIFJlYWQgbmFtZSBhbmQgc3ViIGNvdW50XG5cdFx0dmFyIG5hbWU6c3RyaW5nID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXHRcdHZhciBudW1fc3ViczpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cblx0XHQvLyBSZWFkIG9wdGlvbmFsIHByb3BlcnRpZXNcblx0XHR2YXIgcHJvcHM6QVdEUHJvcGVydGllcyA9IHRoaXMucGFyc2VQcm9wZXJ0aWVzKHsxOnRoaXMuX2dlb05yVHlwZSwgMjp0aGlzLl9nZW9OclR5cGV9KTtcblx0XHR2YXIgZ2VvU2NhbGVVOm51bWJlciA9IHByb3BzLmdldCgxLCAxKTtcblx0XHR2YXIgZ2VvU2NhbGVWOm51bWJlciA9IHByb3BzLmdldCgyLCAxKTtcblxuXHRcdC8vIExvb3AgdGhyb3VnaCBzdWIgbWVzaGVzXG5cdFx0dmFyIHN1YnNfcGFyc2VkOm51bWJlciA9IDA7XG5cdFx0d2hpbGUgKHN1YnNfcGFyc2VkIDwgbnVtX3N1YnMpIHtcblx0XHRcdHZhciBpOm51bWJlcjtcblx0XHRcdHZhciBzbV9sZW46bnVtYmVyLCBzbV9lbmQ6bnVtYmVyO1xuXHRcdFx0dmFyIHN1Yl9nZW9tOlRyaWFuZ2xlU3ViR2VvbWV0cnk7XG5cdFx0XHR2YXIgd19pbmRpY2VzOkFycmF5PG51bWJlcj47XG5cdFx0XHR2YXIgd2VpZ2h0czpBcnJheTxudW1iZXI+O1xuXG5cdFx0XHRzbV9sZW4gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdFx0c21fZW5kID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiArIHNtX2xlbjtcblxuXHRcdFx0Ly8gSWdub3JlIGZvciBub3dcblx0XHRcdHZhciBzdWJQcm9wczpBV0RQcm9wZXJ0aWVzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoezE6dGhpcy5fZ2VvTnJUeXBlLCAyOnRoaXMuX2dlb05yVHlwZX0pO1xuXHRcdFx0Ly8gTG9vcCB0aHJvdWdoIGRhdGEgc3RyZWFtc1xuXHRcdFx0d2hpbGUgKHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPCBzbV9lbmQpIHtcblx0XHRcdFx0dmFyIGlkeDpudW1iZXIgPSAwO1xuXHRcdFx0XHR2YXIgc3RyX2Z0eXBlOm51bWJlciwgc3RyX3R5cGU6bnVtYmVyLCBzdHJfbGVuOm51bWJlciwgc3RyX2VuZDpudW1iZXI7XG5cblx0XHRcdFx0Ly8gVHlwZSwgZmllbGQgdHlwZSwgbGVuZ3RoXG5cdFx0XHRcdHN0cl90eXBlID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRCeXRlKCk7XG5cdFx0XHRcdHN0cl9mdHlwZSA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdFx0XHRzdHJfbGVuID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRcdFx0c3RyX2VuZCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gKyBzdHJfbGVuO1xuXG5cdFx0XHRcdHZhciB4Om51bWJlciwgeTpudW1iZXIsIHo6bnVtYmVyO1xuXG5cdFx0XHRcdGlmIChzdHJfdHlwZSA9PSAxKSB7XG5cdFx0XHRcdFx0dmFyIHZlcnRzOkFycmF5PG51bWJlcj4gPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuXG5cdFx0XHRcdFx0d2hpbGUgKHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPCBzdHJfZW5kKSB7XG5cdFx0XHRcdFx0XHQvLyBUT0RPOiBSZXNwZWN0IHN0cmVhbSBmaWVsZCB0eXBlXG5cdFx0XHRcdFx0XHR4ID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5R2VvKTtcblx0XHRcdFx0XHRcdHkgPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lHZW8pO1xuXHRcdFx0XHRcdFx0eiA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeUdlbyk7XG5cblx0XHRcdFx0XHRcdHZlcnRzW2lkeCsrXSA9IHg7XG5cdFx0XHRcdFx0XHR2ZXJ0c1tpZHgrK10gPSB5O1xuXHRcdFx0XHRcdFx0dmVydHNbaWR4KytdID0gejtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoc3RyX3R5cGUgPT0gMikge1xuXHRcdFx0XHRcdHZhciBpbmRpY2VzOkFycmF5PG51bWJlcj4gPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuXG5cdFx0XHRcdFx0d2hpbGUgKHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPCBzdHJfZW5kKSB7XG5cdFx0XHRcdFx0XHQvLyBUT0RPOiBSZXNwZWN0IHN0cmVhbSBmaWVsZCB0eXBlXG5cdFx0XHRcdFx0XHRpbmRpY2VzW2lkeCsrXSA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBlbHNlIGlmIChzdHJfdHlwZSA9PSAzKSB7XG5cdFx0XHRcdFx0dmFyIHV2czpBcnJheTxudW1iZXI+ID0gbmV3IEFycmF5PG51bWJlcj4oKTtcblx0XHRcdFx0XHR3aGlsZSAodGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiA8IHN0cl9lbmQpIHtcblx0XHRcdFx0XHRcdHV2c1tpZHgrK10gPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lHZW8pO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKHN0cl90eXBlID09IDQpIHtcblxuXHRcdFx0XHRcdHZhciBub3JtYWxzOkFycmF5PG51bWJlcj4gPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuXG5cdFx0XHRcdFx0d2hpbGUgKHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPCBzdHJfZW5kKSB7XG5cdFx0XHRcdFx0XHRub3JtYWxzW2lkeCsrXSA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeUdlbyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0gZWxzZSBpZiAoc3RyX3R5cGUgPT0gNikge1xuXHRcdFx0XHRcdHdfaW5kaWNlcyA9IEFycmF5PG51bWJlcj4oKTtcblxuXHRcdFx0XHRcdHdoaWxlICh0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uIDwgc3RyX2VuZCkge1xuXHRcdFx0XHRcdFx0d19pbmRpY2VzW2lkeCsrXSA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKSozOyAvLyBUT0RPOiBSZXNwZWN0IHN0cmVhbSBmaWVsZCB0eXBlXG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0gZWxzZSBpZiAoc3RyX3R5cGUgPT0gNykge1xuXG5cdFx0XHRcdFx0d2VpZ2h0cyA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cblx0XHRcdFx0XHR3aGlsZSAodGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiA8IHN0cl9lbmQpIHtcblx0XHRcdFx0XHRcdHdlaWdodHNbaWR4KytdID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5R2VvKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiA9IHN0cl9lbmQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTsgLy8gSWdub3JlIHN1Yi1tZXNoIGF0dHJpYnV0ZXMgZm9yIG5vd1xuXG5cdFx0XHRzdWJfZ2VvbSA9IG5ldyBUcmlhbmdsZVN1Ykdlb21ldHJ5KHRydWUpO1xuXHRcdFx0aWYgKHdlaWdodHMpXG5cdFx0XHRcdHN1Yl9nZW9tLmpvaW50c1BlclZlcnRleCA9IHdlaWdodHMubGVuZ3RoLyh2ZXJ0cy5sZW5ndGgvMyk7XG5cdFx0XHRpZiAobm9ybWFscylcblx0XHRcdFx0c3ViX2dlb20uYXV0b0Rlcml2ZU5vcm1hbHMgPSBmYWxzZTtcblx0XHRcdGlmICh1dnMpXG5cdFx0XHRcdHN1Yl9nZW9tLmF1dG9EZXJpdmVVVnMgPSBmYWxzZTtcblx0XHRcdHN1Yl9nZW9tLnVwZGF0ZUluZGljZXMoaW5kaWNlcyk7XG5cdFx0XHRzdWJfZ2VvbS51cGRhdGVQb3NpdGlvbnModmVydHMpO1xuXHRcdFx0c3ViX2dlb20udXBkYXRlVmVydGV4Tm9ybWFscyhub3JtYWxzKTtcblx0XHRcdHN1Yl9nZW9tLnVwZGF0ZVVWcyh1dnMpO1xuXHRcdFx0c3ViX2dlb20udXBkYXRlVmVydGV4VGFuZ2VudHMobnVsbCk7XG5cdFx0XHRzdWJfZ2VvbS51cGRhdGVKb2ludFdlaWdodHMod2VpZ2h0cyk7XG5cdFx0XHRzdWJfZ2VvbS51cGRhdGVKb2ludEluZGljZXMod19pbmRpY2VzKTtcblxuXHRcdFx0dmFyIHNjYWxlVTpudW1iZXIgPSBzdWJQcm9wcy5nZXQoMSwgMSk7XG5cdFx0XHR2YXIgc2NhbGVWOm51bWJlciA9IHN1YlByb3BzLmdldCgyLCAxKTtcblx0XHRcdHZhciBzZXRTdWJVVnM6Ym9vbGVhbiA9IGZhbHNlOyAvL3RoaXMgc2hvdWxkIHJlbWFpbiBmYWxzZSBhdG0sIGJlY2F1c2UgaW4gQXdheUJ1aWxkZXIgdGhlIHV2IGlzIG9ubHkgc2NhbGVkIGJ5IHRoZSBnZW9tZXRyeVxuXG5cdFx0XHRpZiAoKGdlb1NjYWxlVSAhPSBzY2FsZVUpIHx8IChnZW9TY2FsZVYgIT0gc2NhbGVWKSkge1xuXHRcdFx0XHRzZXRTdWJVVnMgPSB0cnVlO1xuXHRcdFx0XHRzY2FsZVUgPSBnZW9TY2FsZVUvc2NhbGVVO1xuXHRcdFx0XHRzY2FsZVYgPSBnZW9TY2FsZVYvc2NhbGVWO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoc2V0U3ViVVZzKVxuXHRcdFx0XHRzdWJfZ2VvbS5zY2FsZVVWKHNjYWxlVSwgc2NhbGVWKTtcblxuXHRcdFx0Z2VvbS5hZGRTdWJHZW9tZXRyeShzdWJfZ2VvbSk7XG5cblx0XHRcdC8vIFRPRE86IFNvbWVob3cgbWFwIGluLXN1YiB0byBvdXQtc3ViIGluZGljZXMgdG8gZW5hYmxlIGxvb2stdXBcblx0XHRcdC8vIHdoZW4gY3JlYXRpbmcgbWVzaGVzIChhbmQgdGhlaXIgbWF0ZXJpYWwgYXNzaWdubWVudHMuKVxuXG5cdFx0XHRzdWJzX3BhcnNlZCsrO1xuXHRcdH1cblx0XHRpZiAoKGdlb1NjYWxlVSAhPSAxKSB8fCAoZ2VvU2NhbGVWICE9IDEpKVxuXHRcdFx0Z2VvbS5zY2FsZVVWKGdlb1NjYWxlVSwgZ2VvU2NhbGVWKTtcblx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHR0aGlzLl9wRmluYWxpemVBc3NldCg8SUFzc2V0PiBnZW9tLCBuYW1lKTtcblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IGdlb207XG5cblx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgVHJpYW5nbGVHZW9tZXRyeTogTmFtZSA9IFwiICsgbmFtZSArIFwifCBJZCA9IFwiICsgc3ViX2dlb20uaWQpO1xuXHRcdH1cblxuXHR9XG5cblx0Ly9CbG9jayBJRCA9IDExXG5cdHByaXZhdGUgcGFyc2VQcmltaXR2ZXMoYmxvY2tJRDpudW1iZXIpOnZvaWRcblx0e1xuXHRcdHZhciBuYW1lOnN0cmluZztcblx0XHR2YXIgcHJlZmFiOlByZWZhYkJhc2U7XG5cdFx0dmFyIHByaW1UeXBlOm51bWJlcjtcblx0XHR2YXIgc3Vic19wYXJzZWQ6bnVtYmVyO1xuXHRcdHZhciBwcm9wczpBV0RQcm9wZXJ0aWVzO1xuXHRcdHZhciBic206TWF0cml4M0Q7XG5cblx0XHQvLyBSZWFkIG5hbWUgYW5kIHN1YiBjb3VudFxuXHRcdG5hbWUgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0cHJpbVR5cGUgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHRwcm9wcyA9IHRoaXMucGFyc2VQcm9wZXJ0aWVzKHsxMDE6dGhpcy5fZ2VvTnJUeXBlLCAxMDI6dGhpcy5fZ2VvTnJUeXBlLCAxMDM6dGhpcy5fZ2VvTnJUeXBlLCAxMTA6dGhpcy5fZ2VvTnJUeXBlLCAxMTE6dGhpcy5fZ2VvTnJUeXBlLCAzMDE6QVdEUGFyc2VyLlVJTlQxNiwgMzAyOkFXRFBhcnNlci5VSU5UMTYsIDMwMzpBV0RQYXJzZXIuVUlOVDE2LCA3MDE6QVdEUGFyc2VyLkJPT0wsIDcwMjpBV0RQYXJzZXIuQk9PTCwgNzAzOkFXRFBhcnNlci5CT09MLCA3MDQ6QVdEUGFyc2VyLkJPT0x9KTtcblxuXHRcdHZhciBwcmltaXRpdmVUeXBlczpBcnJheTxzdHJpbmc+ID0gW1wiVW5zdXBwb3J0ZWQgVHlwZS1JRFwiLCBcIlByaW1pdGl2ZVBsYW5lUHJlZmFiXCIsIFwiUHJpbWl0aXZlQ3ViZVByZWZhYlwiLCBcIlByaW1pdGl2ZVNwaGVyZVByZWZhYlwiLCBcIlByaW1pdGl2ZUN5bGluZGVyUHJlZmFiXCIsIFwiUHJpbWl0aXZlc0NvbmVQcmVmYWJcIiwgXCJQcmltaXRpdmVzQ2Fwc3VsZVByZWZhYlwiLCBcIlByaW1pdGl2ZXNUb3J1c1ByZWZhYlwiXVxuXG5cdFx0c3dpdGNoIChwcmltVHlwZSkge1xuXHRcdFx0Ly8gdG8gZG8sIG5vdCBhbGwgcHJvcGVydGllcyBhcmUgc2V0IG9uIGFsbCBwcmltaXRpdmVzXG5cblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0cHJlZmFiID0gbmV3IFByaW1pdGl2ZVBsYW5lUHJlZmFiKHByb3BzLmdldCgxMDEsIDEwMCksIHByb3BzLmdldCgxMDIsIDEwMCksIHByb3BzLmdldCgzMDEsIDEpLCBwcm9wcy5nZXQoMzAyLCAxKSwgcHJvcHMuZ2V0KDcwMSwgdHJ1ZSksIHByb3BzLmdldCg3MDIsIGZhbHNlKSk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHByZWZhYiA9IG5ldyBQcmltaXRpdmVDdWJlUHJlZmFiKHByb3BzLmdldCgxMDEsIDEwMCksIHByb3BzLmdldCgxMDIsIDEwMCksIHByb3BzLmdldCgxMDMsIDEwMCksIHByb3BzLmdldCgzMDEsIDEpLCBwcm9wcy5nZXQoMzAyLCAxKSwgcHJvcHMuZ2V0KDMwMywgMSksIHByb3BzLmdldCg3MDEsIHRydWUpKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgMzpcblx0XHRcdFx0cHJlZmFiID0gbmV3IFByaW1pdGl2ZVNwaGVyZVByZWZhYihwcm9wcy5nZXQoMTAxLCA1MCksIHByb3BzLmdldCgzMDEsIDE2KSwgcHJvcHMuZ2V0KDMwMiwgMTIpLCBwcm9wcy5nZXQoNzAxLCB0cnVlKSk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdHByZWZhYiA9IG5ldyBQcmltaXRpdmVDeWxpbmRlclByZWZhYihwcm9wcy5nZXQoMTAxLCA1MCksIHByb3BzLmdldCgxMDIsIDUwKSwgcHJvcHMuZ2V0KDEwMywgMTAwKSwgcHJvcHMuZ2V0KDMwMSwgMTYpLCBwcm9wcy5nZXQoMzAyLCAxKSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSk7IC8vIGJvb2w3MDEsIGJvb2w3MDIsIGJvb2w3MDMsIGJvb2w3MDQpO1xuXHRcdFx0XHRpZiAoIXByb3BzLmdldCg3MDEsIHRydWUpKVxuXHRcdFx0XHRcdCg8UHJpbWl0aXZlQ3lsaW5kZXJQcmVmYWI+cHJlZmFiKS50b3BDbG9zZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYgKCFwcm9wcy5nZXQoNzAyLCB0cnVlKSlcblx0XHRcdFx0XHQoPFByaW1pdGl2ZUN5bGluZGVyUHJlZmFiPnByZWZhYikuYm90dG9tQ2xvc2VkID0gZmFsc2U7XG5cdFx0XHRcdGlmICghcHJvcHMuZ2V0KDcwMywgdHJ1ZSkpXG5cdFx0XHRcdFx0KDxQcmltaXRpdmVDeWxpbmRlclByZWZhYj5wcmVmYWIpLnlVcCA9IGZhbHNlO1xuXG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIDU6XG5cdFx0XHRcdHByZWZhYiA9IG5ldyBQcmltaXRpdmVDb25lUHJlZmFiKHByb3BzLmdldCgxMDEsIDUwKSwgcHJvcHMuZ2V0KDEwMiwgMTAwKSwgcHJvcHMuZ2V0KDMwMSwgMTYpLCBwcm9wcy5nZXQoMzAyLCAxKSwgcHJvcHMuZ2V0KDcwMSwgdHJ1ZSksIHByb3BzLmdldCg3MDIsIHRydWUpKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgNjpcblx0XHRcdFx0cHJlZmFiID0gbmV3IFByaW1pdGl2ZUNhcHN1bGVQcmVmYWIocHJvcHMuZ2V0KDEwMSwgNTApLCBwcm9wcy5nZXQoMTAyLCAxMDApLCBwcm9wcy5nZXQoMzAxLCAxNiksIHByb3BzLmdldCgzMDIsIDE1KSwgcHJvcHMuZ2V0KDcwMSwgdHJ1ZSkpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSA3OlxuXHRcdFx0XHRwcmVmYWIgPSBuZXcgUHJpbWl0aXZlVG9ydXNQcmVmYWIocHJvcHMuZ2V0KDEwMSwgNTApLCBwcm9wcy5nZXQoMTAyLCA1MCksIHByb3BzLmdldCgzMDEsIDE2KSwgcHJvcHMuZ2V0KDMwMiwgOCksIHByb3BzLmdldCg3MDEsIHRydWUpKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHByZWZhYiA9IG5ldyBQcmVmYWJCYXNlKCk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiRVJST1I6IFVOU1VQUE9SVEVEIFBSRUZBQl9UWVBFXCIpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRpZiAoKHByb3BzLmdldCgxMTAsIDEpICE9IDEpIHx8IChwcm9wcy5nZXQoMTExLCAxKSAhPSAxKSkge1xuXHRcdFx0Ly9nZW9tLnN1Ykdlb21ldHJpZXM7XG5cdFx0XHQvL2dlb20uc2NhbGVVVihwcm9wcy5nZXQoMTEwLCAxKSwgcHJvcHMuZ2V0KDExMSwgMSkpOyAvL1RPRE8gYWRkIGJhY2sgc2NhbGluZyB0byBwcmVmYWJzXG5cdFx0fVxuXG5cdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0cHJlZmFiLm5hbWUgPSBuYW1lO1xuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KHByZWZhYiwgbmFtZSk7XG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBwcmVmYWI7XG5cblx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdGlmICgocHJpbVR5cGUgPCAwKSB8fCAocHJpbVR5cGUgPiA3KSkge1xuXHRcdFx0XHRwcmltVHlwZSA9IDA7XG5cdFx0XHR9XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIFByaW1pdml0ZTogTmFtZSA9IFwiICsgbmFtZSArIFwifCB0eXBlID0gXCIgKyBwcmltaXRpdmVUeXBlc1twcmltVHlwZV0pO1xuXHRcdH1cblx0fVxuXG5cdC8vIEJsb2NrIElEID0gMjJcblx0cHJpdmF0ZSBwYXJzZUNvbnRhaW5lcihibG9ja0lEOm51bWJlcik6dm9pZFxuXHR7XG5cdFx0dmFyIG5hbWU6c3RyaW5nO1xuXHRcdHZhciBwYXJfaWQ6bnVtYmVyO1xuXHRcdHZhciBtdHg6TWF0cml4M0Q7XG5cdFx0dmFyIGN0cjpEaXNwbGF5T2JqZWN0Q29udGFpbmVyO1xuXHRcdHZhciBwYXJlbnQ6RGlzcGxheU9iamVjdENvbnRhaW5lcjtcblxuXHRcdHBhcl9pZCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0bXR4ID0gdGhpcy5wYXJzZU1hdHJpeDNEKCk7XG5cdFx0bmFtZSA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblxuXHRcdHZhciBwYXJlbnROYW1lOnN0cmluZyA9IFwiUm9vdCAoVG9wTGV2ZWwpXCI7XG5cdFx0Y3RyID0gbmV3IERpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblx0XHRjdHIudHJhbnNmb3JtLm1hdHJpeDNEID0gbXR4O1xuXG5cdFx0dmFyIHJldHVybmVkQXJyYXk6QXJyYXk8YW55PiA9IHRoaXMuZ2V0QXNzZXRCeUlEKHBhcl9pZCwgW0Fzc2V0VHlwZS5DT05UQUlORVIsIEFzc2V0VHlwZS5MSUdIVCwgQXNzZXRUeXBlLk1FU0hdKTtcblxuXHRcdGlmIChyZXR1cm5lZEFycmF5WzBdKSB7XG5cdFx0XHR2YXIgb2JqOkRpc3BsYXlPYmplY3QgPSAoPERpc3BsYXlPYmplY3RDb250YWluZXI+IHJldHVybmVkQXJyYXlbMV0pLmFkZENoaWxkKGN0cik7XG5cdFx0XHRwYXJlbnROYW1lID0gKDxEaXNwbGF5T2JqZWN0Q29udGFpbmVyPiByZXR1cm5lZEFycmF5WzFdKS5uYW1lO1xuXHRcdH0gZWxzZSBpZiAocGFyX2lkID4gMCkge1xuXHRcdFx0dGhpcy5fYmxvY2tzWyBibG9ja0lEIF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCBhIHBhcmVudCBmb3IgdGhpcyBPYmplY3RDb250YWluZXIzRFwiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly9hZGQgdG8gdGhlIGNvbnRlbnQgcHJvcGVydHlcblx0XHRcdCg8RGlzcGxheU9iamVjdENvbnRhaW5lcj4gdGhpcy5fcENvbnRlbnQpLmFkZENoaWxkKGN0cik7XG5cdFx0fVxuXG5cdFx0Ly8gaW4gQVdEIHZlcnNpb24gMi4xIHdlIHJlYWQgdGhlIENvbnRhaW5lciBwcm9wZXJ0aWVzXG5cdFx0aWYgKCh0aGlzLl92ZXJzaW9uWzBdID09IDIpICYmICh0aGlzLl92ZXJzaW9uWzFdID09IDEpKSB7XG5cdFx0XHR2YXIgcHJvcHM6QVdEUHJvcGVydGllcyA9IHRoaXMucGFyc2VQcm9wZXJ0aWVzKHsxOnRoaXMuX21hdHJpeE5yVHlwZSwgMjp0aGlzLl9tYXRyaXhOclR5cGUsIDM6dGhpcy5fbWF0cml4TnJUeXBlLCA0OkFXRFBhcnNlci5VSU5UOH0pO1xuXHRcdFx0Y3RyLnBpdm90ID0gbmV3IFZlY3RvcjNEKHByb3BzLmdldCgxLCAwKSwgcHJvcHMuZ2V0KDIsIDApLCBwcm9wcy5nZXQoMywgMCkpO1xuXHRcdH1cblx0XHQvLyBpbiBvdGhlciB2ZXJzaW9ucyB3ZSBkbyBub3QgcmVhZCB0aGUgQ29udGFpbmVyIHByb3BlcnRpZXNcblx0XHRlbHNlIHtcblx0XHRcdHRoaXMucGFyc2VQcm9wZXJ0aWVzKG51bGwpO1xuXHRcdH1cblxuXHRcdC8vIHRoZSBleHRyYVByb3BlcnRpZXMgc2hvdWxkIG9ubHkgYmUgc2V0IGZvciBBV0QyLjEtRmlsZXMsIGJ1dCBpcyByZWFkIGZvciBib3RoIHZlcnNpb25zXG5cdFx0Y3RyLmV4dHJhID0gdGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cblx0XHR0aGlzLl9wRmluYWxpemVBc3NldCg8SUFzc2V0PiBjdHIsIG5hbWUpO1xuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gY3RyO1xuXG5cdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIENvbnRhaW5lcjogTmFtZSA9ICdcIiArIG5hbWUgKyBcIicgfCBQYXJlbnQtTmFtZSA9IFwiICsgcGFyZW50TmFtZSk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gQmxvY2sgSUQgPSAyM1xuXHRwcml2YXRlIHBhcnNlTWVzaEluc3RhbmNlKGJsb2NrSUQ6bnVtYmVyKTp2b2lkXG5cdHtcblx0XHR2YXIgbnVtX21hdGVyaWFsczpudW1iZXI7XG5cdFx0dmFyIG1hdGVyaWFsc19wYXJzZWQ6bnVtYmVyO1xuXHRcdHZhciBwYXJlbnQ6RGlzcGxheU9iamVjdENvbnRhaW5lcjtcblx0XHR2YXIgcGFyX2lkOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0dmFyIG10eDpNYXRyaXgzRCA9IHRoaXMucGFyc2VNYXRyaXgzRCgpO1xuXHRcdHZhciBuYW1lOnN0cmluZyA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblx0XHR2YXIgcGFyZW50TmFtZTpzdHJpbmcgPSBcIlJvb3QgKFRvcExldmVsKVwiO1xuXHRcdHZhciBkYXRhX2lkOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0dmFyIGdlb206R2VvbWV0cnk7XG5cdFx0dmFyIHJldHVybmVkQXJyYXlHZW9tZXRyeTpBcnJheTxhbnk+ID0gdGhpcy5nZXRBc3NldEJ5SUQoZGF0YV9pZCwgW0Fzc2V0VHlwZS5HRU9NRVRSWV0pXG5cblx0XHRpZiAocmV0dXJuZWRBcnJheUdlb21ldHJ5WzBdKSB7XG5cdFx0XHRnZW9tID0gPEdlb21ldHJ5PiByZXR1cm5lZEFycmF5R2VvbWV0cnlbMV07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIGEgR2VvbWV0cnkgZm9yIHRoaXMgTWVzaC4gQSBlbXB0eSBHZW9tZXRyeSBpcyBjcmVhdGVkIVwiKTtcblx0XHRcdGdlb20gPSBuZXcgR2VvbWV0cnkoKTtcblx0XHR9XG5cblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZ2VvSUQgPSBkYXRhX2lkO1xuXHRcdHZhciBtYXRlcmlhbHM6QXJyYXk8TWF0ZXJpYWxCYXNlPiA9IG5ldyBBcnJheTxNYXRlcmlhbEJhc2U+KCk7XG5cdFx0bnVtX21hdGVyaWFscyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblxuXHRcdHZhciBtYXRlcmlhbE5hbWVzOkFycmF5PHN0cmluZz4gPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXHRcdG1hdGVyaWFsc19wYXJzZWQgPSAwO1xuXG5cdFx0dmFyIHJldHVybmVkQXJyYXlNYXRlcmlhbDpBcnJheTxhbnk+O1xuXG5cdFx0d2hpbGUgKG1hdGVyaWFsc19wYXJzZWQgPCBudW1fbWF0ZXJpYWxzKSB7XG5cdFx0XHR2YXIgbWF0X2lkOm51bWJlcjtcblx0XHRcdG1hdF9pZCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0XHRyZXR1cm5lZEFycmF5TWF0ZXJpYWwgPSB0aGlzLmdldEFzc2V0QnlJRChtYXRfaWQsIFtBc3NldFR5cGUuTUFURVJJQUxdKVxuXHRcdFx0aWYgKCghcmV0dXJuZWRBcnJheU1hdGVyaWFsWzBdKSAmJiAobWF0X2lkID4gMCkpIHtcblx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgTWF0ZXJpYWwgTnIgXCIgKyBtYXRlcmlhbHNfcGFyc2VkICsgXCIgKElEID0gXCIgKyBtYXRfaWQgKyBcIiApIGZvciB0aGlzIE1lc2hcIik7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBtOk1hdGVyaWFsQmFzZSA9IDxNYXRlcmlhbEJhc2U+IHJldHVybmVkQXJyYXlNYXRlcmlhbFsxXTtcblxuXHRcdFx0bWF0ZXJpYWxzLnB1c2gobSk7XG5cdFx0XHRtYXRlcmlhbE5hbWVzLnB1c2gobS5uYW1lKTtcblxuXHRcdFx0bWF0ZXJpYWxzX3BhcnNlZCsrO1xuXHRcdH1cblxuXHRcdHZhciBtZXNoOk1lc2ggPSBuZXcgTWVzaChnZW9tLCBudWxsKTtcblx0XHRtZXNoLnRyYW5zZm9ybS5tYXRyaXgzRCA9IG10eDtcblxuXHRcdHZhciByZXR1cm5lZEFycmF5UGFyZW50OkFycmF5PGFueT4gPSB0aGlzLmdldEFzc2V0QnlJRChwYXJfaWQsIFtBc3NldFR5cGUuQ09OVEFJTkVSLCBBc3NldFR5cGUuTElHSFQsIEFzc2V0VHlwZS5NRVNIXSlcblxuXHRcdGlmIChyZXR1cm5lZEFycmF5UGFyZW50WzBdKSB7XG5cdFx0XHR2YXIgb2JqQzpEaXNwbGF5T2JqZWN0Q29udGFpbmVyID0gPERpc3BsYXlPYmplY3RDb250YWluZXI+IHJldHVybmVkQXJyYXlQYXJlbnRbMV07XG5cdFx0XHRvYmpDLmFkZENoaWxkKG1lc2gpO1xuXHRcdFx0cGFyZW50TmFtZSA9IG9iakMubmFtZTtcblx0XHR9IGVsc2UgaWYgKHBhcl9pZCA+IDApIHtcblx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIGEgcGFyZW50IGZvciB0aGlzIE1lc2hcIik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vYWRkIHRvIHRoZSBjb250ZW50IHByb3BlcnR5XG5cdFx0XHQoPERpc3BsYXlPYmplY3RDb250YWluZXI+IHRoaXMuX3BDb250ZW50KS5hZGRDaGlsZChtZXNoKTtcblx0XHR9XG5cblx0XHRpZiAobWF0ZXJpYWxzLmxlbmd0aCA+PSAxICYmIG1lc2guc3ViTWVzaGVzLmxlbmd0aCA9PSAxKSB7XG5cdFx0XHRtZXNoLm1hdGVyaWFsID0gbWF0ZXJpYWxzWzBdO1xuXHRcdH0gZWxzZSBpZiAobWF0ZXJpYWxzLmxlbmd0aCA+IDEpIHtcblx0XHRcdHZhciBpOm51bWJlcjtcblxuXHRcdFx0Ly8gQXNzaWduIGVhY2ggc3ViLW1lc2ggaW4gdGhlIG1lc2ggYSBtYXRlcmlhbCBmcm9tIHRoZSBsaXN0LiBJZiBtb3JlIHN1Yi1tZXNoZXNcblx0XHRcdC8vIHRoYW4gbWF0ZXJpYWxzLCByZXBlYXQgdGhlIGxhc3QgbWF0ZXJpYWwgZm9yIGFsbCByZW1haW5pbmcgc3ViLW1lc2hlcy5cblx0XHRcdGZvciAoaSA9IDA7IGkgPCBtZXNoLnN1Yk1lc2hlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRtZXNoLnN1Yk1lc2hlc1tpXS5tYXRlcmlhbCA9IG1hdGVyaWFsc1tNYXRoLm1pbihtYXRlcmlhbHMubGVuZ3RoIC0gMSwgaSldO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoKHRoaXMuX3ZlcnNpb25bMF0gPT0gMikgJiYgKHRoaXMuX3ZlcnNpb25bMV0gPT0gMSkpIHtcblx0XHRcdHZhciBwcm9wczpBV0RQcm9wZXJ0aWVzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoezE6dGhpcy5fbWF0cml4TnJUeXBlLCAyOnRoaXMuX21hdHJpeE5yVHlwZSwgMzp0aGlzLl9tYXRyaXhOclR5cGUsIDQ6QVdEUGFyc2VyLlVJTlQ4LCA1OkFXRFBhcnNlci5CT09MfSk7XG5cdFx0XHRtZXNoLnBpdm90ID0gbmV3IFZlY3RvcjNEKDxudW1iZXI+cHJvcHMuZ2V0KDEsIDApLCA8bnVtYmVyPnByb3BzLmdldCgyLCAwKSwgPG51bWJlcj4gcHJvcHMuZ2V0KDMsIDApKTtcblx0XHRcdG1lc2guY2FzdHNTaGFkb3dzID0gcHJvcHMuZ2V0KDUsIHRydWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnBhcnNlUHJvcGVydGllcyhudWxsKTtcblx0XHR9XG5cblx0XHRtZXNoLmV4dHJhID0gdGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cblx0XHR0aGlzLl9wRmluYWxpemVBc3NldCg8SUFzc2V0PiBtZXNoLCBuYW1lKTtcblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IG1lc2g7XG5cblx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgTWVzaDogTmFtZSA9ICdcIiArIG5hbWUgKyBcIicgfCBQYXJlbnQtTmFtZSA9IFwiICsgcGFyZW50TmFtZSArIFwifCBHZW9tZXRyeS1OYW1lID0gXCIgKyBnZW9tLm5hbWUgKyBcIiB8IFN1Yk1lc2hlcyA9IFwiICsgbWVzaC5zdWJNZXNoZXMubGVuZ3RoICsgXCIgfCBNYXQtTmFtZXMgPSBcIiArIG1hdGVyaWFsTmFtZXMudG9TdHJpbmcoKSk7XG5cdFx0fVxuXHR9XG5cblxuXHQvL0Jsb2NrIElEIDMxXG5cdHByaXZhdGUgcGFyc2VTa3lib3hJbnN0YW5jZShibG9ja0lEOm51bWJlcik6dm9pZFxuXHR7XG5cdFx0dmFyIG5hbWU6c3RyaW5nID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXHRcdHZhciBjdWJlVGV4QWRkcjpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXG5cdFx0dmFyIHJldHVybmVkQXJyYXlDdWJlVGV4OkFycmF5PGFueT4gPSB0aGlzLmdldEFzc2V0QnlJRChjdWJlVGV4QWRkciwgW0Fzc2V0VHlwZS5URVhUVVJFXSwgXCJDdWJlVGV4dHVyZVwiKTtcblx0XHRpZiAoKCFyZXR1cm5lZEFycmF5Q3ViZVRleFswXSkgJiYgKGN1YmVUZXhBZGRyICE9IDApKVxuXHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIEN1YmV0ZXh0dXJlIChJRCA9IFwiICsgY3ViZVRleEFkZHIgKyBcIiApIGZvciB0aGlzIFNreWJveFwiKTtcblx0XHR2YXIgYXNzZXQ6U2t5Ym94ID0gbmV3IFNreWJveChuZXcgU2t5Ym94TWF0ZXJpYWwoPEltYWdlQ3ViZVRleHR1cmU+IHJldHVybmVkQXJyYXlDdWJlVGV4WzFdKSk7XG5cblx0XHR0aGlzLnBhcnNlUHJvcGVydGllcyhudWxsKVxuXHRcdGFzc2V0LmV4dHJhID0gdGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQoYXNzZXQsIG5hbWUpO1xuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gYXNzZXQ7XG5cdFx0aWYgKHRoaXMuX2RlYnVnKVxuXHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBTa3lib3g6IE5hbWUgPSAnXCIgKyBuYW1lICsgXCInIHwgQ3ViZVRleHR1cmUtTmFtZSA9IFwiICsgKDxJbWFnZUN1YmVUZXh0dXJlPiByZXR1cm5lZEFycmF5Q3ViZVRleFsxXSkubmFtZSk7XG5cblx0fVxuXG5cdC8vQmxvY2sgSUQgPSA0MVxuXHRwcml2YXRlIHBhcnNlTGlnaHQoYmxvY2tJRDpudW1iZXIpOnZvaWRcblx0e1xuXHRcdHZhciBsaWdodDpMaWdodEJhc2U7XG5cdFx0dmFyIG5ld1NoYWRvd01hcHBlcjpTaGFkb3dNYXBwZXJCYXNlO1xuXG5cdFx0dmFyIHBhcl9pZDpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdHZhciBtdHg6TWF0cml4M0QgPSB0aGlzLnBhcnNlTWF0cml4M0QoKTtcblx0XHR2YXIgbmFtZTpzdHJpbmcgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0dmFyIGxpZ2h0VHlwZTpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHR2YXIgcHJvcHM6QVdEUHJvcGVydGllcyA9IHRoaXMucGFyc2VQcm9wZXJ0aWVzKHsxOnRoaXMuX3Byb3BzTnJUeXBlLCAyOnRoaXMuX3Byb3BzTnJUeXBlLCAzOkFXRFBhcnNlci5DT0xPUiwgNDp0aGlzLl9wcm9wc05yVHlwZSwgNTp0aGlzLl9wcm9wc05yVHlwZSwgNjpBV0RQYXJzZXIuQk9PTCwgNzpBV0RQYXJzZXIuQ09MT1IsIDg6dGhpcy5fcHJvcHNOclR5cGUsIDk6QVdEUGFyc2VyLlVJTlQ4LCAxMDpBV0RQYXJzZXIuVUlOVDgsIDExOnRoaXMuX3Byb3BzTnJUeXBlLCAxMjpBV0RQYXJzZXIuVUlOVDE2LCAyMTp0aGlzLl9tYXRyaXhOclR5cGUsIDIyOnRoaXMuX21hdHJpeE5yVHlwZSwgMjM6dGhpcy5fbWF0cml4TnJUeXBlfSk7XG5cdFx0dmFyIHNoYWRvd01hcHBlclR5cGU6bnVtYmVyID0gcHJvcHMuZ2V0KDksIDApO1xuXHRcdHZhciBwYXJlbnROYW1lOnN0cmluZyA9IFwiUm9vdCAoVG9wTGV2ZWwpXCI7XG5cdFx0dmFyIGxpZ2h0VHlwZXM6QXJyYXk8c3RyaW5nPiA9IFtcIlVuc3VwcG9ydGVkIExpZ2h0VHlwZVwiLCBcIlBvaW50TGlnaHRcIiwgXCJEaXJlY3Rpb25hbExpZ2h0XCJdO1xuXHRcdHZhciBzaGFkb3dNYXBwZXJUeXBlczpBcnJheTxzdHJpbmc+ID0gW1wiTm8gU2hhZG93TWFwcGVyXCIsIFwiRGlyZWN0aW9uYWxTaGFkb3dNYXBwZXJcIiwgXCJOZWFyRGlyZWN0aW9uYWxTaGFkb3dNYXBwZXJcIiwgXCJDYXNjYWRlU2hhZG93TWFwcGVyXCIsIFwiQ3ViZU1hcFNoYWRvd01hcHBlclwiXTtcblxuXHRcdGlmIChsaWdodFR5cGUgPT0gMSkge1xuXHRcdFx0bGlnaHQgPSBuZXcgUG9pbnRMaWdodCgpO1xuXG5cdFx0XHQoPFBvaW50TGlnaHQ+IGxpZ2h0KS5yYWRpdXMgPSBwcm9wcy5nZXQoMSwgOTAwMDApO1xuXHRcdFx0KDxQb2ludExpZ2h0PiBsaWdodCkuZmFsbE9mZiA9IHByb3BzLmdldCgyLCAxMDAwMDApO1xuXG5cdFx0XHRpZiAoc2hhZG93TWFwcGVyVHlwZSA+IDApIHtcblx0XHRcdFx0aWYgKHNoYWRvd01hcHBlclR5cGUgPT0gNCkge1xuXHRcdFx0XHRcdG5ld1NoYWRvd01hcHBlciA9IG5ldyBDdWJlTWFwU2hhZG93TWFwcGVyKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0bGlnaHQudHJhbnNmb3JtLm1hdHJpeDNEID0gbXR4O1xuXG5cdFx0fVxuXG5cdFx0aWYgKGxpZ2h0VHlwZSA9PSAyKSB7XG5cblx0XHRcdGxpZ2h0ID0gbmV3IERpcmVjdGlvbmFsTGlnaHQocHJvcHMuZ2V0KDIxLCAwKSwgcHJvcHMuZ2V0KDIyLCAtMSksIHByb3BzLmdldCgyMywgMSkpO1xuXG5cdFx0XHRpZiAoc2hhZG93TWFwcGVyVHlwZSA+IDApIHtcblx0XHRcdFx0aWYgKHNoYWRvd01hcHBlclR5cGUgPT0gMSkge1xuXHRcdFx0XHRcdG5ld1NoYWRvd01hcHBlciA9IG5ldyBEaXJlY3Rpb25hbFNoYWRvd01hcHBlcigpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9pZiAoc2hhZG93TWFwcGVyVHlwZSA9PSAyKVxuXHRcdFx0XHQvLyAgbmV3U2hhZG93TWFwcGVyID0gbmV3IE5lYXJEaXJlY3Rpb25hbFNoYWRvd01hcHBlcihwcm9wcy5nZXQoMTEsIDAuNSkpO1xuXHRcdFx0XHQvL2lmIChzaGFkb3dNYXBwZXJUeXBlID09IDMpXG5cdFx0XHRcdC8vICAgbmV3U2hhZG93TWFwcGVyID0gbmV3IENhc2NhZGVTaGFkb3dNYXBwZXIocHJvcHMuZ2V0KDEyLCAzKSk7XG5cblx0XHRcdH1cblxuXHRcdH1cblx0XHRsaWdodC5jb2xvciA9IHByb3BzLmdldCgzLCAweGZmZmZmZik7XG5cdFx0bGlnaHQuc3BlY3VsYXIgPSBwcm9wcy5nZXQoNCwgMS4wKTtcblx0XHRsaWdodC5kaWZmdXNlID0gcHJvcHMuZ2V0KDUsIDEuMCk7XG5cdFx0bGlnaHQuYW1iaWVudENvbG9yID0gcHJvcHMuZ2V0KDcsIDB4ZmZmZmZmKTtcblx0XHRsaWdodC5hbWJpZW50ID0gcHJvcHMuZ2V0KDgsIDAuMCk7XG5cblx0XHQvLyBpZiBhIHNoYWRvd01hcHBlciBoYXMgYmVlbiBjcmVhdGVkLCBhZGp1c3QgdGhlIGRlcHRoTWFwU2l6ZSBpZiBuZWVkZWQsIGFzc2lnbiB0byBsaWdodCBhbmQgc2V0IGNhc3RTaGFkb3dzIHRvIHRydWVcblx0XHRpZiAobmV3U2hhZG93TWFwcGVyKSB7XG5cdFx0XHRpZiAobmV3U2hhZG93TWFwcGVyIGluc3RhbmNlb2YgQ3ViZU1hcFNoYWRvd01hcHBlcikge1xuXHRcdFx0XHRpZiAocHJvcHMuZ2V0KDEwLCAxKSAhPSAxKSB7XG5cdFx0XHRcdFx0bmV3U2hhZG93TWFwcGVyLmRlcHRoTWFwU2l6ZSA9IHRoaXMuX2RlcHRoU2l6ZURpY1twcm9wcy5nZXQoMTAsIDEpXTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKHByb3BzLmdldCgxMCwgMikgIT0gMikge1xuXHRcdFx0XHRcdG5ld1NoYWRvd01hcHBlci5kZXB0aE1hcFNpemUgPSB0aGlzLl9kZXB0aFNpemVEaWNbcHJvcHMuZ2V0KDEwLCAyKV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0bGlnaHQuc2hhZG93TWFwcGVyID0gbmV3U2hhZG93TWFwcGVyO1xuXHRcdFx0bGlnaHQuY2FzdHNTaGFkb3dzID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRpZiAocGFyX2lkICE9IDApIHtcblxuXHRcdFx0dmFyIHJldHVybmVkQXJyYXlQYXJlbnQ6QXJyYXk8YW55PiA9IHRoaXMuZ2V0QXNzZXRCeUlEKHBhcl9pZCwgW0Fzc2V0VHlwZS5DT05UQUlORVIsIEFzc2V0VHlwZS5MSUdIVCwgQXNzZXRUeXBlLk1FU0hdKVxuXG5cdFx0XHRpZiAocmV0dXJuZWRBcnJheVBhcmVudFswXSkge1xuXHRcdFx0XHQoPERpc3BsYXlPYmplY3RDb250YWluZXI+IHJldHVybmVkQXJyYXlQYXJlbnRbMV0pLmFkZENoaWxkKGxpZ2h0KTtcblx0XHRcdFx0cGFyZW50TmFtZSA9ICg8RGlzcGxheU9iamVjdENvbnRhaW5lcj4gcmV0dXJuZWRBcnJheVBhcmVudFsxXSkubmFtZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIGEgcGFyZW50IGZvciB0aGlzIExpZ2h0XCIpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvL2FkZCB0byB0aGUgY29udGVudCBwcm9wZXJ0eVxuXHRcdFx0KDxEaXNwbGF5T2JqZWN0Q29udGFpbmVyPiB0aGlzLl9wQ29udGVudCkuYWRkQ2hpbGQobGlnaHQpO1xuXHRcdH1cblxuXHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXG5cdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQoPCBJQXNzZXQ+IGxpZ2h0LCBuYW1lKTtcblxuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gbGlnaHQ7XG5cblx0XHRpZiAodGhpcy5fZGVidWcpXG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIExpZ2h0OiBOYW1lID0gJ1wiICsgbmFtZSArIFwiJyB8IFR5cGUgPSBcIiArIGxpZ2h0VHlwZXNbbGlnaHRUeXBlXSArIFwiIHwgUGFyZW50LU5hbWUgPSBcIiArIHBhcmVudE5hbWUgKyBcIiB8IFNoYWRvd01hcHBlci1UeXBlID0gXCIgKyBzaGFkb3dNYXBwZXJUeXBlc1tzaGFkb3dNYXBwZXJUeXBlXSk7XG5cblx0fVxuXG5cdC8vQmxvY2sgSUQgPSA0M1xuXHRwcml2YXRlIHBhcnNlQ2FtZXJhKGJsb2NrSUQ6bnVtYmVyKTp2b2lkXG5cdHtcblxuXHRcdHZhciBwYXJfaWQ6bnVtYmVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHR2YXIgbXR4Ok1hdHJpeDNEID0gdGhpcy5wYXJzZU1hdHJpeDNEKCk7XG5cdFx0dmFyIG5hbWU6c3RyaW5nID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXHRcdHZhciBwYXJlbnROYW1lOnN0cmluZyA9IFwiUm9vdCAoVG9wTGV2ZWwpXCI7XG5cdFx0dmFyIHByb2plY3Rpb246UHJvamVjdGlvbkJhc2U7XG5cblx0XHR0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKTsgLy9zZXQgYXMgYWN0aXZlIGNhbWVyYVxuXHRcdHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFNob3J0KCk7IC8vbGVuZ3Rob2YgbGVuc2VzIC0gbm90IHVzZWQgeWV0XG5cblx0XHR2YXIgcHJvamVjdGlvbnR5cGU6bnVtYmVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkU2hvcnQoKTtcblx0XHR2YXIgcHJvcHM6QVdEUHJvcGVydGllcyA9IHRoaXMucGFyc2VQcm9wZXJ0aWVzKHsxMDE6dGhpcy5fcHJvcHNOclR5cGUsIDEwMjp0aGlzLl9wcm9wc05yVHlwZSwgMTAzOnRoaXMuX3Byb3BzTnJUeXBlLCAxMDQ6dGhpcy5fcHJvcHNOclR5cGV9KTtcblxuXHRcdHN3aXRjaCAocHJvamVjdGlvbnR5cGUpIHtcblx0XHRcdGNhc2UgNTAwMTpcblx0XHRcdFx0cHJvamVjdGlvbiA9IG5ldyBQZXJzcGVjdGl2ZVByb2plY3Rpb24ocHJvcHMuZ2V0KDEwMSwgNjApKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDUwMDI6XG5cdFx0XHRcdHByb2plY3Rpb24gPSBuZXcgT3J0aG9ncmFwaGljUHJvamVjdGlvbihwcm9wcy5nZXQoMTAxLCA1MDApKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDUwMDM6XG5cdFx0XHRcdHByb2plY3Rpb24gPSBuZXcgT3J0aG9ncmFwaGljT2ZmQ2VudGVyUHJvamVjdGlvbihwcm9wcy5nZXQoMTAxLCAtNDAwKSwgcHJvcHMuZ2V0KDEwMiwgNDAwKSwgcHJvcHMuZ2V0KDEwMywgLTMwMCksIHByb3BzLmdldCgxMDQsIDMwMCkpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwidW5zdXBwb3J0ZWRMZW5zdHlwZVwiKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBjYW1lcmE6Q2FtZXJhID0gbmV3IENhbWVyYShwcm9qZWN0aW9uKTtcblx0XHRjYW1lcmEudHJhbnNmb3JtLm1hdHJpeDNEID0gbXR4O1xuXG5cdFx0dmFyIHJldHVybmVkQXJyYXlQYXJlbnQ6QXJyYXk8YW55PiA9IHRoaXMuZ2V0QXNzZXRCeUlEKHBhcl9pZCwgW0Fzc2V0VHlwZS5DT05UQUlORVIsIEFzc2V0VHlwZS5MSUdIVCwgQXNzZXRUeXBlLk1FU0hdKVxuXG5cdFx0aWYgKHJldHVybmVkQXJyYXlQYXJlbnRbMF0pIHtcblxuXHRcdFx0dmFyIG9iakM6RGlzcGxheU9iamVjdENvbnRhaW5lciA9IDxEaXNwbGF5T2JqZWN0Q29udGFpbmVyPiByZXR1cm5lZEFycmF5UGFyZW50WzFdO1xuXHRcdFx0b2JqQy5hZGRDaGlsZChjYW1lcmEpO1xuXG5cdFx0XHRwYXJlbnROYW1lID0gb2JqQy5uYW1lO1xuXG5cdFx0fSBlbHNlIGlmIChwYXJfaWQgPiAwKSB7XG5cdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCBhIHBhcmVudCBmb3IgdGhpcyBDYW1lcmFcIik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vYWRkIHRvIHRoZSBjb250ZW50IHByb3BlcnR5XG5cdFx0XHQoPERpc3BsYXlPYmplY3RDb250YWluZXI+IHRoaXMuX3BDb250ZW50KS5hZGRDaGlsZChjYW1lcmEpO1xuXHRcdH1cblxuXHRcdGNhbWVyYS5uYW1lID0gbmFtZTtcblx0XHRwcm9wcyA9IHRoaXMucGFyc2VQcm9wZXJ0aWVzKHsxOnRoaXMuX21hdHJpeE5yVHlwZSwgMjp0aGlzLl9tYXRyaXhOclR5cGUsIDM6dGhpcy5fbWF0cml4TnJUeXBlLCA0OkFXRFBhcnNlci5VSU5UOH0pO1xuXHRcdGNhbWVyYS5waXZvdCA9IG5ldyBWZWN0b3IzRChwcm9wcy5nZXQoMSwgMCksIHByb3BzLmdldCgyLCAwKSwgcHJvcHMuZ2V0KDMsIDApKTtcblx0XHRjYW1lcmEuZXh0cmEgPSB0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblxuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KGNhbWVyYSwgbmFtZSk7XG5cblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IGNhbWVyYVxuXG5cdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIENhbWVyYTogTmFtZSA9ICdcIiArIG5hbWUgKyBcIicgfCBQcm9qZWN0aW9udHlwZSA9IFwiICsgcHJvamVjdGlvbiArIFwiIHwgUGFyZW50LU5hbWUgPSBcIiArIHBhcmVudE5hbWUpO1xuXHRcdH1cblxuXHR9XG5cblx0Ly9CbG9jayBJRCA9IDUxXG5cdHByaXZhdGUgcGFyc2VMaWdodFBpY2tlcihibG9ja0lEOm51bWJlcik6dm9pZFxuXHR7XG5cdFx0dmFyIG5hbWU6c3RyaW5nID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXHRcdHZhciBudW1MaWdodHM6bnVtYmVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdHZhciBsaWdodHNBcnJheTpBcnJheTxMaWdodEJhc2U+ID0gbmV3IEFycmF5PExpZ2h0QmFzZT4oKTtcblx0XHR2YXIgazpudW1iZXIgPSAwO1xuXHRcdHZhciBsaWdodElEOm51bWJlciA9IDA7XG5cblx0XHR2YXIgcmV0dXJuZWRBcnJheUxpZ2h0OkFycmF5PGFueT47XG5cdFx0dmFyIGxpZ2h0c0FycmF5TmFtZXM6QXJyYXk8c3RyaW5nPiA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cblx0XHRmb3IgKGsgPSAwOyBrIDwgbnVtTGlnaHRzOyBrKyspIHtcblx0XHRcdGxpZ2h0SUQgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdFx0cmV0dXJuZWRBcnJheUxpZ2h0ID0gdGhpcy5nZXRBc3NldEJ5SUQobGlnaHRJRCwgW0Fzc2V0VHlwZS5MSUdIVF0pXG5cblx0XHRcdGlmIChyZXR1cm5lZEFycmF5TGlnaHRbMF0pIHtcblx0XHRcdFx0bGlnaHRzQXJyYXkucHVzaCg8TGlnaHRCYXNlPiByZXR1cm5lZEFycmF5TGlnaHRbMV0pO1xuXHRcdFx0XHRsaWdodHNBcnJheU5hbWVzLnB1c2goKCA8TGlnaHRCYXNlPiByZXR1cm5lZEFycmF5TGlnaHRbMV0pLm5hbWUpO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCBhIExpZ2h0IE5yIFwiICsgayArIFwiIChJRCA9IFwiICsgbGlnaHRJRCArIFwiICkgZm9yIHRoaXMgTGlnaHRQaWNrZXJcIik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGxpZ2h0c0FycmF5Lmxlbmd0aCA9PSAwKSB7XG5cdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgY3JlYXRlIHRoaXMgTGlnaHRQaWNrZXIsIGNhdXNlIG5vIExpZ2h0IHdhcyBmb3VuZC5cIik7XG5cdFx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHRcdHJldHVybjsgLy9yZXR1cm4gd2l0aG91dCBhbnkgbW9yZSBwYXJzaW5nIGZvciB0aGlzIGJsb2NrXG5cdFx0fVxuXG5cdFx0dmFyIGxpZ2h0UGljazpMaWdodFBpY2tlckJhc2UgPSBuZXcgU3RhdGljTGlnaHRQaWNrZXIobGlnaHRzQXJyYXkpO1xuXHRcdGxpZ2h0UGljay5uYW1lID0gbmFtZTtcblxuXHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KDxJQXNzZXQ+IGxpZ2h0UGljaywgbmFtZSk7XG5cblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IGxpZ2h0UGlja1xuXHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBTdGF0aWNMaWdodFBpY2tlcjogTmFtZSA9ICdcIiArIG5hbWUgKyBcIicgfCBUZXh0dXJlLU5hbWUgPSBcIiArIGxpZ2h0c0FycmF5TmFtZXMudG9TdHJpbmcoKSk7XG5cdFx0fVxuXHR9XG5cblx0Ly9CbG9jayBJRCA9IDgxXG5cdHByaXZhdGUgcGFyc2VNYXRlcmlhbChibG9ja0lEOm51bWJlcik6dm9pZFxuXHR7XG5cdFx0Ly8gVE9ETzogbm90IHVzZWRcblx0XHQvLy8vYmxvY2tMZW5ndGggPSBibG9jay5sZW47XG5cdFx0dmFyIG5hbWU6c3RyaW5nO1xuXHRcdHZhciB0eXBlOm51bWJlcjtcblx0XHR2YXIgcHJvcHM6QVdEUHJvcGVydGllcztcblx0XHR2YXIgbWF0OlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWw7XG5cdFx0dmFyIGF0dHJpYnV0ZXM6T2JqZWN0O1xuXHRcdHZhciBmaW5hbGl6ZTpib29sZWFuO1xuXHRcdHZhciBudW1fbWV0aG9kczpudW1iZXI7XG5cdFx0dmFyIG1ldGhvZHNfcGFyc2VkOm51bWJlcjtcblx0XHR2YXIgcmV0dXJuZWRBcnJheTpBcnJheTxhbnk+O1xuXG5cdFx0bmFtZSA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblx0XHR0eXBlID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRCeXRlKCk7XG5cdFx0bnVtX21ldGhvZHMgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblxuXHRcdC8vIFJlYWQgbWF0ZXJpYWwgbnVtZXJpY2FsIHByb3BlcnRpZXNcblx0XHQvLyAoMT1jb2xvciwgMj1iaXRtYXAgdXJsLCAxMD1hbHBoYSwgMTE9YWxwaGFfYmxlbmRpbmcsIDEyPWFscGhhX3RocmVzaG9sZCwgMTM9cmVwZWF0KVxuXHRcdHByb3BzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoeyAxOkFXRFBhcnNlci5JTlQzMiwgMjpBV0RQYXJzZXIuQkFERFIsIDEwOnRoaXMuX3Byb3BzTnJUeXBlLCAxMTpBV0RQYXJzZXIuQk9PTCwgMTI6dGhpcy5fcHJvcHNOclR5cGUsIDEzOkFXRFBhcnNlci5CT09MfSk7XG5cblx0XHRtZXRob2RzX3BhcnNlZCA9IDA7XG5cdFx0d2hpbGUgKG1ldGhvZHNfcGFyc2VkIDwgbnVtX21ldGhvZHMpIHtcblx0XHRcdHZhciBtZXRob2RfdHlwZTpudW1iZXI7XG5cblx0XHRcdG1ldGhvZF90eXBlID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdFx0dGhpcy5wYXJzZVByb3BlcnRpZXMobnVsbCk7XG5cdFx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHRcdG1ldGhvZHNfcGFyc2VkICs9IDE7XG5cdFx0fVxuXHRcdHZhciBkZWJ1Z1N0cmluZzpzdHJpbmcgPSBcIlwiO1xuXHRcdGF0dHJpYnV0ZXMgPSB0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHRpZiAodHlwZSA9PT0gMSkgeyAvLyBDb2xvciBtYXRlcmlhbFxuXHRcdFx0ZGVidWdTdHJpbmcgKz0gXCJQYXJzZWQgYSBDb2xvck1hdGVyaWFsKFNpbmdsZVBhc3MpOiBOYW1lID0gJ1wiICsgbmFtZSArIFwiJyB8IFwiO1xuXHRcdFx0dmFyIGNvbG9yOm51bWJlcjtcblx0XHRcdGNvbG9yID0gcHJvcHMuZ2V0KDEsIDB4ZmZmZmZmKTtcblx0XHRcdGlmICh0aGlzLm1hdGVyaWFsTW9kZSA8IDIpIHtcblx0XHRcdFx0bWF0ID0gbmV3IFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwoY29sb3IsIHByb3BzLmdldCgxMCwgMS4wKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtYXQgPSBuZXcgVHJpYW5nbGVNZXRob2RNYXRlcmlhbChjb2xvcik7XG5cdFx0XHRcdG1hdC5tYXRlcmlhbE1vZGUgPSBUcmlhbmdsZU1hdGVyaWFsTW9kZS5NVUxUSV9QQVNTO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gMikge1xuXHRcdFx0dmFyIHRleF9hZGRyOm51bWJlciA9IHByb3BzLmdldCgyLCAwKTtcblxuXHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKHRleF9hZGRyLCBbQXNzZXRUeXBlLlRFWFRVUkVdKTtcblxuXHRcdFx0aWYgKCghcmV0dXJuZWRBcnJheVswXSkgJiYgKHRleF9hZGRyID4gMCkpXG5cdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBEaWZmc3VlVGV4dHVyZSAoSUQgPSBcIiArIHRleF9hZGRyICsgXCIgKSBmb3IgdGhpcyBNYXRlcmlhbFwiKTtcblxuXHRcdFx0bWF0ID0gbmV3IFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwoPFRleHR1cmUyREJhc2U+IHJldHVybmVkQXJyYXlbMV0pO1xuXG5cdFx0XHRpZiAodGhpcy5tYXRlcmlhbE1vZGUgPCAyKSB7XG5cdFx0XHRcdG1hdC5hbHBoYUJsZW5kaW5nID0gcHJvcHMuZ2V0KDExLCBmYWxzZSk7XG5cdFx0XHRcdG1hdC5hbHBoYSA9IHByb3BzLmdldCgxMCwgMS4wKTtcblx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCJQYXJzZWQgYSBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsKFNpbmdsZVBhc3MpOiBOYW1lID0gJ1wiICsgbmFtZSArIFwiJyB8IFRleHR1cmUtTmFtZSA9IFwiICsgbWF0Lm5hbWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtYXQubWF0ZXJpYWxNb2RlID0gVHJpYW5nbGVNYXRlcmlhbE1vZGUuTVVMVElfUEFTUztcblx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCJQYXJzZWQgYSBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsKE11bHRpUGFzcyk6IE5hbWUgPSAnXCIgKyBuYW1lICsgXCInIHwgVGV4dHVyZS1OYW1lID0gXCIgKyBtYXQubmFtZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRtYXQuZXh0cmEgPSBhdHRyaWJ1dGVzO1xuXHRcdG1hdC5hbHBoYVRocmVzaG9sZCA9IHByb3BzLmdldCgxMiwgMC4wKTtcblx0XHRtYXQucmVwZWF0ID0gcHJvcHMuZ2V0KDEzLCBmYWxzZSk7XG5cdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQoPElBc3NldD4gbWF0LCBuYW1lKTtcblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IG1hdDtcblxuXHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coZGVidWdTdHJpbmcpO1xuXG5cdFx0fVxuXHR9XG5cblx0Ly8gQmxvY2sgSUQgPSA4MSBBV0QyLjFcblx0cHJpdmF0ZSBwYXJzZU1hdGVyaWFsX3YxKGJsb2NrSUQ6bnVtYmVyKTp2b2lkXG5cdHtcblx0XHR2YXIgbWF0OlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWw7XG5cdFx0dmFyIG5vcm1hbFRleHR1cmU6VGV4dHVyZTJEQmFzZTtcblx0XHR2YXIgc3BlY1RleHR1cmU6VGV4dHVyZTJEQmFzZTtcblx0XHR2YXIgcmV0dXJuZWRBcnJheTpBcnJheTxhbnk+O1xuXG5cdFx0dmFyIG5hbWU6c3RyaW5nID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXHRcdHZhciB0eXBlOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdHZhciBudW1fbWV0aG9kczpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHR2YXIgcHJvcHM6QVdEUHJvcGVydGllcyA9IHRoaXMucGFyc2VQcm9wZXJ0aWVzKHsxOkFXRFBhcnNlci5VSU5UMzIsIDI6QVdEUGFyc2VyLkJBRERSLCAzOkFXRFBhcnNlci5CQUREUiwgNDpBV0RQYXJzZXIuVUlOVDgsIDU6QVdEUGFyc2VyLkJPT0wsIDY6QVdEUGFyc2VyLkJPT0wsIDc6QVdEUGFyc2VyLkJPT0wsIDg6QVdEUGFyc2VyLkJPT0wsIDk6QVdEUGFyc2VyLlVJTlQ4LCAxMDp0aGlzLl9wcm9wc05yVHlwZSwgMTE6QVdEUGFyc2VyLkJPT0wsIDEyOnRoaXMuX3Byb3BzTnJUeXBlLCAxMzpBV0RQYXJzZXIuQk9PTCwgMTU6dGhpcy5fcHJvcHNOclR5cGUsIDE2OkFXRFBhcnNlci5VSU5UMzIsIDE3OkFXRFBhcnNlci5CQUREUiwgMTg6dGhpcy5fcHJvcHNOclR5cGUsIDE5OnRoaXMuX3Byb3BzTnJUeXBlLCAyMDpBV0RQYXJzZXIuVUlOVDMyLCAyMTpBV0RQYXJzZXIuQkFERFIsIDIyOkFXRFBhcnNlci5CQUREUn0pO1xuXHRcdHZhciBzcGV6aWFsVHlwZTpudW1iZXIgPSBwcm9wcy5nZXQoNCwgMCk7XG5cdFx0dmFyIGRlYnVnU3RyaW5nOnN0cmluZyA9IFwiXCI7XG5cblx0XHRpZiAoc3BlemlhbFR5cGUgPj0gMikgey8vdGhpcyBpcyBubyBzdXBwb3J0ZWQgbWF0ZXJpYWxcblx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIk1hdGVyaWFsLXNwZXppYWxUeXBlICdcIiArIHNwZXppYWxUeXBlICsgXCInIGlzIG5vdCBzdXBwb3J0ZWQsIGNhbiBvbmx5IGJlIDA6c2luZ2xlUGFzcywgMTpNdWx0aVBhc3MgIVwiKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5tYXRlcmlhbE1vZGUgPT0gMSlcblx0XHRcdHNwZXppYWxUeXBlID0gMDtcblx0XHRlbHNlIGlmICh0aGlzLm1hdGVyaWFsTW9kZSA9PSAyKVxuXHRcdFx0c3BlemlhbFR5cGUgPSAxO1xuXG5cdFx0aWYgKHNwZXppYWxUeXBlIDwgMikgey8vdGhpcyBpcyBTaW5nbGVQYXNzIG9yIE11bHRpUGFzc1xuXG5cdFx0XHRpZiAodHlwZSA9PSAxKSB7Ly8gQ29sb3IgbWF0ZXJpYWxcblx0XHRcdFx0dmFyIGNvbG9yOm51bWJlciA9IHByb3BzLmdldCgxLCAweGNjY2NjYyk7Ly9UT0RPIHRlbXBvcmFyaWx5IHN3YXBwZWQgc28gdGhhdCBkaWZmdXNlIGNvbG9yIGdvZXMgdG8gYW1iaWVudFxuXG5cdFx0XHRcdGlmIChzcGV6aWFsVHlwZSA9PSAxKSB7Ly9cdE11bHRpUGFzc01hdGVyaWFsXG5cdFx0XHRcdFx0bWF0ID0gbmV3IFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwoY29sb3IpO1xuXHRcdFx0XHRcdG1hdC5tYXRlcmlhbE1vZGUgPSBUcmlhbmdsZU1hdGVyaWFsTW9kZS5NVUxUSV9QQVNTO1xuXHRcdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiUGFyc2VkIGEgQ29sb3JNYXRlcmlhbChNdWx0aVBhc3MpOiBOYW1lID0gJ1wiICsgbmFtZSArIFwiJyB8IFwiO1xuXG5cdFx0XHRcdH0gZWxzZSB7IC8vXHRTaW5nbGVQYXNzTWF0ZXJpYWxcblx0XHRcdFx0XHRtYXQgPSBuZXcgVHJpYW5nbGVNZXRob2RNYXRlcmlhbChjb2xvciwgcHJvcHMuZ2V0KDEwLCAxLjApKTtcblx0XHRcdFx0XHRtYXQuYWxwaGFCbGVuZGluZyA9IHByb3BzLmdldCgxMSwgZmFsc2UpO1xuXHRcdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiUGFyc2VkIGEgQ29sb3JNYXRlcmlhbChTaW5nbGVQYXNzKTogTmFtZSA9ICdcIiArIG5hbWUgKyBcIicgfCBcIjtcblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2UgaWYgKHR5cGUgPT0gMikgey8vIHRleHR1cmUgbWF0ZXJpYWxcblx0XHRcdFx0dmFyIHRleF9hZGRyOm51bWJlciA9IHByb3BzLmdldCgyLCAwKTsvL1RPRE8gdGVtcG9yYXJpbHkgc3dhcHBlZCBzbyB0aGF0IGRpZmZ1c2UgdGV4dHVyZSBnb2VzIHRvIGFtYmllbnRcblx0XHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKHRleF9hZGRyLCBbQXNzZXRUeXBlLlRFWFRVUkVdKTtcblxuXHRcdFx0XHRpZiAoKCFyZXR1cm5lZEFycmF5WzBdKSAmJiAodGV4X2FkZHIgPiAwKSlcblx0XHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgQW1iaWVudFRleHR1cmUgKElEID0gXCIgKyB0ZXhfYWRkciArIFwiICkgZm9yIHRoaXMgVHJpYW5nbGVNZXRob2RNYXRlcmlhbFwiKTtcblxuXHRcdFx0XHR2YXIgdGV4dHVyZTpUZXh0dXJlMkRCYXNlID0gcmV0dXJuZWRBcnJheVsxXTtcblxuXHRcdFx0XHRtYXQgPSBuZXcgVHJpYW5nbGVNZXRob2RNYXRlcmlhbCh0ZXh0dXJlKTtcblxuXHRcdFx0XHRpZiAoc3BlemlhbFR5cGUgPT0gMSkgey8vIE11bHRpUGFzc01hdGVyaWFsXG5cdFx0XHRcdFx0bWF0Lm1hdGVyaWFsTW9kZSA9IFRyaWFuZ2xlTWF0ZXJpYWxNb2RlLk1VTFRJX1BBU1M7XG5cblx0XHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIlBhcnNlZCBhIFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwoTXVsdGlQYXNzKTogTmFtZSA9ICdcIiArIG5hbWUgKyBcIicgfCBUZXh0dXJlLU5hbWUgPSBcIiArIHRleHR1cmUubmFtZTtcblx0XHRcdFx0fSBlbHNlIHsvL1x0U2luZ2xlUGFzc01hdGVyaWFsXG5cdFx0XHRcdFx0bWF0LmFscGhhID0gcHJvcHMuZ2V0KDEwLCAxLjApO1xuXHRcdFx0XHRcdG1hdC5hbHBoYUJsZW5kaW5nID0gcHJvcHMuZ2V0KDExLCBmYWxzZSk7XG5cblx0XHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIlBhcnNlZCBhIFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwoU2luZ2xlUGFzcyk6IE5hbWUgPSAnXCIgKyBuYW1lICsgXCInIHwgVGV4dHVyZS1OYW1lID0gXCIgKyB0ZXh0dXJlLm5hbWU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dmFyIGRpZmZ1c2VUZXh0dXJlOlRleHR1cmUyREJhc2U7XG5cdFx0XHR2YXIgZGlmZnVzZVRleF9hZGRyOm51bWJlciA9IHByb3BzLmdldCgxNywgMCk7XG5cblx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRChkaWZmdXNlVGV4X2FkZHIsIFtBc3NldFR5cGUuVEVYVFVSRV0pO1xuXG5cdFx0XHRpZiAoKCFyZXR1cm5lZEFycmF5WzBdKSAmJiAoZGlmZnVzZVRleF9hZGRyICE9IDApKSB7XG5cdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBEaWZmdXNlVGV4dHVyZSAoSUQgPSBcIiArIGRpZmZ1c2VUZXhfYWRkciArIFwiICkgZm9yIHRoaXMgVHJpYW5nbGVNZXRob2RNYXRlcmlhbFwiKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHJldHVybmVkQXJyYXlbMF0pXG5cdFx0XHRcdGRpZmZ1c2VUZXh0dXJlID0gcmV0dXJuZWRBcnJheVsxXTtcblxuXHRcdFx0aWYgKGRpZmZ1c2VUZXh0dXJlKSB7XG5cdFx0XHRcdG1hdC5kaWZmdXNlVGV4dHVyZSA9IGRpZmZ1c2VUZXh0dXJlO1xuXHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIiB8IERpZmZ1c2VUZXh0dXJlLU5hbWUgPSBcIiArIGRpZmZ1c2VUZXh0dXJlLm5hbWU7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBub3JtYWxUZXhfYWRkcjpudW1iZXIgPSBwcm9wcy5nZXQoMywgMCk7XG5cblx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRChub3JtYWxUZXhfYWRkciwgW0Fzc2V0VHlwZS5URVhUVVJFXSk7XG5cblx0XHRcdGlmICgoIXJldHVybmVkQXJyYXlbMF0pICYmIChub3JtYWxUZXhfYWRkciAhPSAwKSkge1xuXHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgTm9ybWFsVGV4dHVyZSAoSUQgPSBcIiArIG5vcm1hbFRleF9hZGRyICsgXCIgKSBmb3IgdGhpcyBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsXCIpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAocmV0dXJuZWRBcnJheVswXSkge1xuXHRcdFx0XHRub3JtYWxUZXh0dXJlID0gcmV0dXJuZWRBcnJheVsxXTtcblx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCIgfCBOb3JtYWxUZXh0dXJlLU5hbWUgPSBcIiArIG5vcm1hbFRleHR1cmUubmFtZTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHNwZWNUZXhfYWRkcjpudW1iZXIgPSBwcm9wcy5nZXQoMjEsIDApO1xuXHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKHNwZWNUZXhfYWRkciwgW0Fzc2V0VHlwZS5URVhUVVJFXSk7XG5cblx0XHRcdGlmICgoIXJldHVybmVkQXJyYXlbMF0pICYmIChzcGVjVGV4X2FkZHIgIT0gMCkpIHtcblx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIFNwZWN1bGFyVGV4dHVyZSAoSUQgPSBcIiArIHNwZWNUZXhfYWRkciArIFwiICkgZm9yIHRoaXMgVHJpYW5nbGVNZXRob2RNYXRlcmlhbFwiKTtcblx0XHRcdH1cblx0XHRcdGlmIChyZXR1cm5lZEFycmF5WzBdKSB7XG5cdFx0XHRcdHNwZWNUZXh0dXJlID0gcmV0dXJuZWRBcnJheVsxXTtcblx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCIgfCBTcGVjdWxhclRleHR1cmUtTmFtZSA9IFwiICsgc3BlY1RleHR1cmUubmFtZTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGxpZ2h0UGlja2VyQWRkcjpudW1iZXIgPSBwcm9wcy5nZXQoMjIsIDApO1xuXHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKGxpZ2h0UGlja2VyQWRkciwgW0Fzc2V0VHlwZS5MSUdIVF9QSUNLRVJdKVxuXG5cdFx0XHRpZiAoKCFyZXR1cm5lZEFycmF5WzBdKSAmJiAobGlnaHRQaWNrZXJBZGRyKSkge1xuXHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgTGlnaHRQaWNrZXIgKElEID0gXCIgKyBsaWdodFBpY2tlckFkZHIgKyBcIiApIGZvciB0aGlzIFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWxcIik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtYXQubGlnaHRQaWNrZXIgPSA8TGlnaHRQaWNrZXJCYXNlPiByZXR1cm5lZEFycmF5WzFdO1xuXHRcdFx0XHQvL2RlYnVnU3RyaW5nKz1cIiB8IExpZ2h0cGlja2VyLU5hbWUgPSBcIitMaWdodFBpY2tlckJhc2UocmV0dXJuZWRBcnJheVsxXSkubmFtZTtcblx0XHRcdH1cblxuXHRcdFx0bWF0LnNtb290aCA9IHByb3BzLmdldCg1LCB0cnVlKTtcblx0XHRcdG1hdC5taXBtYXAgPSBwcm9wcy5nZXQoNiwgdHJ1ZSk7XG5cdFx0XHRtYXQuYm90aFNpZGVzID0gcHJvcHMuZ2V0KDcsIGZhbHNlKTtcblx0XHRcdG1hdC5hbHBoYVByZW11bHRpcGxpZWQgPSBwcm9wcy5nZXQoOCwgZmFsc2UpO1xuXHRcdFx0bWF0LmJsZW5kTW9kZSA9IHRoaXMuYmxlbmRNb2RlRGljW3Byb3BzLmdldCg5LCAwKV07XG5cdFx0XHRtYXQucmVwZWF0ID0gcHJvcHMuZ2V0KDEzLCBmYWxzZSk7XG5cblx0XHRcdGlmIChub3JtYWxUZXh0dXJlKVxuXHRcdFx0XHRtYXQubm9ybWFsTWFwID0gbm9ybWFsVGV4dHVyZTtcblxuXHRcdFx0aWYgKHNwZWNUZXh0dXJlKVxuXHRcdFx0XHRtYXQuc3BlY3VsYXJNYXAgPSBzcGVjVGV4dHVyZTtcblxuXHRcdFx0bWF0LmFscGhhVGhyZXNob2xkID0gcHJvcHMuZ2V0KDEyLCAwLjApO1xuXHRcdFx0bWF0LmFtYmllbnQgPSBwcm9wcy5nZXQoMTUsIDEuMCk7XG5cdFx0XHRtYXQuZGlmZnVzZUNvbG9yID0gcHJvcHMuZ2V0KDE2LCAweGZmZmZmZik7XG5cdFx0XHRtYXQuc3BlY3VsYXIgPSBwcm9wcy5nZXQoMTgsIDEuMCk7XG5cdFx0XHRtYXQuZ2xvc3MgPSBwcm9wcy5nZXQoMTksIDUwKTtcblx0XHRcdG1hdC5zcGVjdWxhckNvbG9yID0gcHJvcHMuZ2V0KDIwLCAweGZmZmZmZik7XG5cblx0XHRcdHZhciBtZXRob2RzX3BhcnNlZDpudW1iZXIgPSAwO1xuXHRcdFx0dmFyIHRhcmdldElEOm51bWJlcjtcblxuXHRcdFx0d2hpbGUgKG1ldGhvZHNfcGFyc2VkIDwgbnVtX21ldGhvZHMpIHtcblx0XHRcdFx0dmFyIG1ldGhvZF90eXBlOm51bWJlcjtcblx0XHRcdFx0bWV0aG9kX3R5cGUgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cblx0XHRcdFx0cHJvcHMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7MTpBV0RQYXJzZXIuQkFERFIsIDI6QVdEUGFyc2VyLkJBRERSLCAzOkFXRFBhcnNlci5CQUREUiwgMTAxOnRoaXMuX3Byb3BzTnJUeXBlLCAxMDI6dGhpcy5fcHJvcHNOclR5cGUsIDEwMzp0aGlzLl9wcm9wc05yVHlwZSwgMjAxOkFXRFBhcnNlci5VSU5UMzIsIDIwMjpBV0RQYXJzZXIuVUlOVDMyLCAzMDE6QVdEUGFyc2VyLlVJTlQxNiwgMzAyOkFXRFBhcnNlci5VSU5UMTYsIDQwMTpBV0RQYXJzZXIuVUlOVDgsIDQwMjpBV0RQYXJzZXIuVUlOVDgsIDYwMTpBV0RQYXJzZXIuQ09MT1IsIDYwMjpBV0RQYXJzZXIuQ09MT1IsIDcwMTpBV0RQYXJzZXIuQk9PTCwgNzAyOkFXRFBhcnNlci5CT09MLCA4MDE6QVdEUGFyc2VyLk1UWDR4NH0pO1xuXG5cdFx0XHRcdHN3aXRjaCAobWV0aG9kX3R5cGUpIHtcblx0XHRcdFx0XHRjYXNlIDk5OTogLy93cmFwcGVyLU1ldGhvZHMgdGhhdCB3aWxsIGxvYWQgYSBwcmV2aW91cyBwYXJzZWQgRWZmZWt0TWV0aG9kIHJldHVybmVkXG5cblx0XHRcdFx0XHRcdHRhcmdldElEID0gcHJvcHMuZ2V0KDEsIDApO1xuXHRcdFx0XHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKHRhcmdldElELCBbQXNzZXRUeXBlLkVGRkVDVFNfTUVUSE9EXSk7XG5cblx0XHRcdFx0XHRcdGlmICghcmV0dXJuZWRBcnJheVswXSkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgRWZmZWN0TWV0aG9kIChJRCA9IFwiICsgdGFyZ2V0SUQgKyBcIiApIGZvciB0aGlzIE1hdGVyaWFsXCIpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0bWF0LmFkZEVmZmVjdE1ldGhvZChyZXR1cm5lZEFycmF5WzFdKTtcblxuXHRcdFx0XHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIiB8IEVmZmVjdE1ldGhvZC1OYW1lID0gXCIgKyAoPEVmZmVjdE1ldGhvZEJhc2U+IHJldHVybmVkQXJyYXlbMV0pLm5hbWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSA5OTg6IC8vd3JhcHBlci1NZXRob2RzIHRoYXQgd2lsbCBsb2FkIGEgcHJldmlvdXMgcGFyc2VkIFNoYWRvd01hcE1ldGhvZFxuXG5cdFx0XHRcdFx0XHR0YXJnZXRJRCA9IHByb3BzLmdldCgxLCAwKTtcblx0XHRcdFx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRCh0YXJnZXRJRCwgW0Fzc2V0VHlwZS5TSEFET1dfTUFQX01FVEhPRF0pO1xuXG5cdFx0XHRcdFx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIFNoYWRvd01ldGhvZCAoSUQgPSBcIiArIHRhcmdldElEICsgXCIgKSBmb3IgdGhpcyBNYXRlcmlhbFwiKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdG1hdC5zaGFkb3dNZXRob2QgPSByZXR1cm5lZEFycmF5WzFdO1xuXHRcdFx0XHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIiB8IFNoYWRvd01ldGhvZC1OYW1lID0gXCIgKyAoPFNoYWRvd01ldGhvZEJhc2U+IHJldHVybmVkQXJyYXlbMV0pLm5hbWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAxOiAvL0Vudk1hcEFtYmllbnRNZXRob2Rcblx0XHRcdFx0XHRcdHRhcmdldElEID0gcHJvcHMuZ2V0KDEsIDApO1xuXHRcdFx0XHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKHRhcmdldElELCBbQXNzZXRUeXBlLlRFWFRVUkVdLCBcIkN1YmVUZXh0dXJlXCIpO1xuXHRcdFx0XHRcdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKVxuXHRcdFx0XHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgRW52TWFwIChJRCA9IFwiICsgdGFyZ2V0SUQgKyBcIiApIGZvciB0aGlzIEVudk1hcEFtYmllbnRNZXRob2RNYXRlcmlhbFwiKTtcblx0XHRcdFx0XHRcdG1hdC5hbWJpZW50TWV0aG9kID0gbmV3IEFtYmllbnRFbnZNYXBNZXRob2QocmV0dXJuZWRBcnJheVsxXSk7XG5cdFx0XHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIiB8IEFtYmllbnRFbnZNYXBNZXRob2QgfCBFbnZNYXAtTmFtZSA9XCIgKyAoPEN1YmVUZXh0dXJlQmFzZT4gcmV0dXJuZWRBcnJheVsxXSkubmFtZTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSA1MTogLy9EZXB0aERpZmZ1c2VNZXRob2Rcblx0XHRcdFx0XHRcdG1hdC5kaWZmdXNlTWV0aG9kID0gbmV3IERpZmZ1c2VEZXB0aE1ldGhvZCgpO1xuXHRcdFx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCIgfCBEaWZmdXNlRGVwdGhNZXRob2RcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNTI6IC8vR3JhZGllbnREaWZmdXNlTWV0aG9kXG5cdFx0XHRcdFx0XHR0YXJnZXRJRCA9IHByb3BzLmdldCgxLCAwKTtcblx0XHRcdFx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRCh0YXJnZXRJRCwgW0Fzc2V0VHlwZS5URVhUVVJFXSk7XG5cdFx0XHRcdFx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pXG5cdFx0XHRcdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBHcmFkaWVudERpZmZ1c2VUZXh0dXJlIChJRCA9IFwiICsgdGFyZ2V0SUQgKyBcIiApIGZvciB0aGlzIEdyYWRpZW50RGlmZnVzZU1ldGhvZFwiKTtcblx0XHRcdFx0XHRcdG1hdC5kaWZmdXNlTWV0aG9kID0gbmV3IERpZmZ1c2VHcmFkaWVudE1ldGhvZChyZXR1cm5lZEFycmF5WzFdKTtcblx0XHRcdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiIHwgRGlmZnVzZUdyYWRpZW50TWV0aG9kIHwgR3JhZGllbnREaWZmdXNlVGV4dHVyZS1OYW1lID1cIiArICg8VGV4dHVyZTJEQmFzZT4gcmV0dXJuZWRBcnJheVsxXSkubmFtZTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNTM6IC8vV3JhcERpZmZ1c2VNZXRob2Rcblx0XHRcdFx0XHRcdG1hdC5kaWZmdXNlTWV0aG9kID0gbmV3IERpZmZ1c2VXcmFwTWV0aG9kKHByb3BzLmdldCgxMDEsIDUpKTtcblx0XHRcdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiIHwgRGlmZnVzZVdyYXBNZXRob2RcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNTQ6IC8vTGlnaHRNYXBEaWZmdXNlTWV0aG9kXG5cdFx0XHRcdFx0XHR0YXJnZXRJRCA9IHByb3BzLmdldCgxLCAwKTtcblx0XHRcdFx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRCh0YXJnZXRJRCwgW0Fzc2V0VHlwZS5URVhUVVJFXSk7XG5cdFx0XHRcdFx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pXG5cdFx0XHRcdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBMaWdodE1hcCAoSUQgPSBcIiArIHRhcmdldElEICsgXCIgKSBmb3IgdGhpcyBMaWdodE1hcERpZmZ1c2VNZXRob2RcIik7XG5cdFx0XHRcdFx0XHRtYXQuZGlmZnVzZU1ldGhvZCA9IG5ldyBEaWZmdXNlTGlnaHRNYXBNZXRob2QocmV0dXJuZWRBcnJheVsxXSwgdGhpcy5ibGVuZE1vZGVEaWNbcHJvcHMuZ2V0KDQwMSwgMTApXSwgZmFsc2UsIG1hdC5kaWZmdXNlTWV0aG9kKTtcblx0XHRcdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiIHwgRGlmZnVzZUxpZ2h0TWFwTWV0aG9kIHwgTGlnaHRNYXBUZXh0dXJlLU5hbWUgPVwiICsgKDxUZXh0dXJlMkRCYXNlPiByZXR1cm5lZEFycmF5WzFdKS5uYW1lO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA1NTogLy9DZWxEaWZmdXNlTWV0aG9kXG5cdFx0XHRcdFx0XHRtYXQuZGlmZnVzZU1ldGhvZCA9IG5ldyBEaWZmdXNlQ2VsTWV0aG9kKHByb3BzLmdldCg0MDEsIDMpLCBtYXQuZGlmZnVzZU1ldGhvZCk7XG5cdFx0XHRcdFx0XHQoPERpZmZ1c2VDZWxNZXRob2Q+IG1hdC5kaWZmdXNlTWV0aG9kKS5zbW9vdGhuZXNzID0gcHJvcHMuZ2V0KDEwMSwgMC4xKTtcblx0XHRcdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiIHwgRGlmZnVzZUNlbE1ldGhvZFwiO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA1NjogLy9TdWJTdXJmYWNlU2NhdHRlcmluZ01ldGhvZFxuLy9cdFx0XHRcdFx0XHRcdG1hdC5kaWZmdXNlTWV0aG9kID0gbmV3IERpZmZ1c2VTdWJTdXJmYWNlTWV0aG9kKCk7IC8vZGVwdGhNYXBTaXplIGFuZCBkZXB0aE1hcE9mZnNldCA/XG4vL1x0XHRcdFx0XHRcdFx0KDxEaWZmdXNlU3ViU3VyZmFjZU1ldGhvZD4gbWF0LmRpZmZ1c2VNZXRob2QpLnNjYXR0ZXJpbmcgPSBwcm9wcy5nZXQoMTAxLCAwLjIpO1xuLy9cdFx0XHRcdFx0XHRcdCg8RGlmZnVzZVN1YlN1cmZhY2VNZXRob2Q+IG1hdC5kaWZmdXNlTWV0aG9kKS50cmFuc2x1Y2VuY3kgPSBwcm9wcy5nZXQoMTAyLCAxKTtcbi8vXHRcdFx0XHRcdFx0XHQoPERpZmZ1c2VTdWJTdXJmYWNlTWV0aG9kPiBtYXQuZGlmZnVzZU1ldGhvZCkuc2NhdHRlckNvbG9yID0gcHJvcHMuZ2V0KDYwMSwgMHhmZmZmZmYpO1xuLy9cdFx0XHRcdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiIHwgRGlmZnVzZVN1YlN1cmZhY2VNZXRob2RcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAxMDE6IC8vQW5pc290cm9waWNTcGVjdWxhck1ldGhvZFxuXHRcdFx0XHRcdFx0bWF0LnNwZWN1bGFyTWV0aG9kID0gbmV3IFNwZWN1bGFyQW5pc290cm9waWNNZXRob2QoKTtcblx0XHRcdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiIHwgU3BlY3VsYXJBbmlzb3Ryb3BpY01ldGhvZFwiO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAxMDI6IC8vU3BlY3VsYXJQaG9uZ01ldGhvZFxuXHRcdFx0XHRcdFx0bWF0LnNwZWN1bGFyTWV0aG9kID0gbmV3IFNwZWN1bGFyUGhvbmdNZXRob2QoKTtcblx0XHRcdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiIHwgU3BlY3VsYXJQaG9uZ01ldGhvZFwiO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAxMDM6IC8vQ2VsbFNwZWN1bGFyTWV0aG9kXG5cdFx0XHRcdFx0XHRtYXQuc3BlY3VsYXJNZXRob2QgPSBuZXcgU3BlY3VsYXJDZWxNZXRob2QocHJvcHMuZ2V0KDEwMSwgMC41KSwgbWF0LnNwZWN1bGFyTWV0aG9kKTtcblx0XHRcdFx0XHRcdCg8U3BlY3VsYXJDZWxNZXRob2Q+IG1hdC5zcGVjdWxhck1ldGhvZCkuc21vb3RobmVzcyA9IHByb3BzLmdldCgxMDIsIDAuMSk7XG5cdFx0XHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIiB8IFNwZWN1bGFyQ2VsTWV0aG9kXCI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDEwNDogLy9TcGVjdWxhckZyZXNuZWxNZXRob2Rcblx0XHRcdFx0XHRcdG1hdC5zcGVjdWxhck1ldGhvZCA9IG5ldyBTcGVjdWxhckZyZXNuZWxNZXRob2QocHJvcHMuZ2V0KDcwMSwgdHJ1ZSksIG1hdC5zcGVjdWxhck1ldGhvZCk7XG5cdFx0XHRcdFx0XHQoPFNwZWN1bGFyRnJlc25lbE1ldGhvZD4gbWF0LnNwZWN1bGFyTWV0aG9kKS5mcmVzbmVsUG93ZXIgPSBwcm9wcy5nZXQoMTAxLCA1KTtcblx0XHRcdFx0XHRcdCg8U3BlY3VsYXJGcmVzbmVsTWV0aG9kPiBtYXQuc3BlY3VsYXJNZXRob2QpLm5vcm1hbFJlZmxlY3RhbmNlID0gcHJvcHMuZ2V0KDEwMiwgMC4xKTtcblx0XHRcdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiIHwgU3BlY3VsYXJGcmVzbmVsTWV0aG9kXCI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDE1MTovL0hlaWdodE1hcE5vcm1hbE1ldGhvZCAtIHRoaW9zIGlzIG5vdCBpbXBsZW1lbnRlZCBmb3Igbm93LCBidXQgbWlnaHQgYXBwZWFyIGxhdGVyXG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDE1MjogLy9TaW1wbGVXYXRlck5vcm1hbE1ldGhvZFxuXHRcdFx0XHRcdFx0dGFyZ2V0SUQgPSBwcm9wcy5nZXQoMSwgMCk7XG5cdFx0XHRcdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQodGFyZ2V0SUQsIFtBc3NldFR5cGUuVEVYVFVSRV0pO1xuXHRcdFx0XHRcdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKVxuXHRcdFx0XHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgU2Vjb3VuZE5vcm1hbE1hcCAoSUQgPSBcIiArIHRhcmdldElEICsgXCIgKSBmb3IgdGhpcyBTaW1wbGVXYXRlck5vcm1hbE1ldGhvZFwiKTtcblx0XHRcdFx0XHRcdGlmICghbWF0Lm5vcm1hbE1hcClcblx0XHRcdFx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgYSBub3JtYWwgTWFwIG9uIHRoaXMgTWF0ZXJpYWwgdG8gdXNlIHdpdGggdGhpcyBTaW1wbGVXYXRlck5vcm1hbE1ldGhvZFwiKTtcblxuXHRcdFx0XHRcdFx0bWF0Lm5vcm1hbE1hcCA9IHJldHVybmVkQXJyYXlbMV07XG5cdFx0XHRcdFx0XHRtYXQubm9ybWFsTWV0aG9kID0gbmV3IE5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kKG1hdC5ub3JtYWxNYXAsIHJldHVybmVkQXJyYXlbMV0pO1xuXHRcdFx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCIgfCBOb3JtYWxTaW1wbGVXYXRlck1ldGhvZCB8IFNlY29uZC1Ob3JtYWxUZXh0dXJlLU5hbWUgPSBcIiArICg8VGV4dHVyZTJEQmFzZT4gcmV0dXJuZWRBcnJheVsxXSkubmFtZTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdFx0XHRtZXRob2RzX3BhcnNlZCArPSAxO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRtYXQuZXh0cmEgPSB0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHR0aGlzLl9wRmluYWxpemVBc3NldCg8SUFzc2V0PiBtYXQsIG5hbWUpO1xuXG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBtYXQ7XG5cdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhkZWJ1Z1N0cmluZyk7XG5cdFx0fVxuXHR9XG5cblx0Ly9CbG9jayBJRCA9IDgyXG5cdHByaXZhdGUgcGFyc2VUZXh0dXJlKGJsb2NrSUQ6bnVtYmVyKTp2b2lkXG5cdHtcblxuXHRcdHZhciBhc3NldDpUZXh0dXJlMkRCYXNlO1xuXG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLm5hbWUgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cblx0XHR2YXIgdHlwZTpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHR2YXIgZGF0YV9sZW46bnVtYmVyO1xuXG5cdFx0dGhpcy5fdGV4dHVyZV91c2Vyc1t0aGlzLl9jdXJfYmxvY2tfaWQudG9TdHJpbmcoKV0gPSBbXTtcblxuXHRcdC8vIEV4dGVybmFsXG5cdFx0aWYgKHR5cGUgPT0gMCkge1xuXHRcdFx0ZGF0YV9sZW4gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdFx0dmFyIHVybDpzdHJpbmc7XG5cdFx0XHR1cmwgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVVEZCeXRlcyhkYXRhX2xlbik7XG5cdFx0XHR0aGlzLl9wQWRkRGVwZW5kZW5jeSh0aGlzLl9jdXJfYmxvY2tfaWQudG9TdHJpbmcoKSwgbmV3IFVSTFJlcXVlc3QodXJsKSwgZmFsc2UsIG51bGwsIHRydWUpO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdGRhdGFfbGVuID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblxuXHRcdFx0dmFyIGRhdGE6Qnl0ZUFycmF5O1xuXHRcdFx0ZGF0YSA9IG5ldyBCeXRlQXJyYXkoKTtcblx0XHRcdHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZEJ5dGVzKGRhdGEsIDAsIGRhdGFfbGVuKTtcblxuXHRcdFx0Ly9cblx0XHRcdC8vIEFXRFBhcnNlciAtIEZpeCBmb3IgRmlyZUZveCBCdWc6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTcxNTA3NSAuXG5cdFx0XHQvL1xuXHRcdFx0Ly8gQ29udmVydGluZyBkYXRhIHRvIGltYWdlIGhlcmUgaW5zdGVhZCBvZiBwYXJzZXIgLSBmaXggRmlyZUZveCBidWcgd2hlcmUgaW1hZ2Ugd2lkdGggLyBoZWlnaHQgaXMgMCB3aGVuIGNyZWF0ZWQgZnJvbSBkYXRhXG5cdFx0XHQvLyBUaGlzIGdpdmVzIHRoZSBicm93c2VyIHRpbWUgdG8gaW5pdGlhbGlzZSBpbWFnZSB3aWR0aCAvIGhlaWdodC5cblxuXHRcdFx0dGhpcy5fcEFkZERlcGVuZGVuY3kodGhpcy5fY3VyX2Jsb2NrX2lkLnRvU3RyaW5nKCksIG51bGwsIGZhbHNlLCBQYXJzZXJVdGlscy5ieXRlQXJyYXlUb0ltYWdlKGRhdGEpLCB0cnVlKTtcblx0XHRcdC8vdGhpcy5fcEFkZERlcGVuZGVuY3kodGhpcy5fY3VyX2Jsb2NrX2lkLnRvU3RyaW5nKCksIG51bGwsIGZhbHNlLCBkYXRhLCB0cnVlKTtcblxuXHRcdH1cblxuXHRcdC8vIElnbm9yZSBmb3Igbm93XG5cdFx0dGhpcy5wYXJzZVByb3BlcnRpZXMobnVsbCk7XG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmV4dHJhcyA9IHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdHRoaXMuX3BQYXVzZUFuZFJldHJpZXZlRGVwZW5kZW5jaWVzKCk7XG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBhc3NldDtcblxuXHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0dmFyIHRleHR1cmVTdHlsZXNOYW1lczpBcnJheTxzdHJpbmc+ID0gW1wiZXh0ZXJuYWxcIiwgXCJlbWJlZFwiXVxuXHRcdFx0Y29uc29sZS5sb2coXCJTdGFydCBwYXJzaW5nIGEgXCIgKyB0ZXh0dXJlU3R5bGVzTmFtZXNbdHlwZV0gKyBcIiBCaXRtYXAgZm9yIFRleHR1cmVcIik7XG5cdFx0fVxuXG5cdH1cblxuXHQvL0Jsb2NrIElEID0gODNcblx0cHJpdmF0ZSBwYXJzZUN1YmVUZXh0dXJlKGJsb2NrSUQ6bnVtYmVyKTp2b2lkXG5cdHtcblx0XHQvL2Jsb2NrTGVuZ3RoID0gYmxvY2subGVuO1xuXHRcdHZhciBkYXRhX2xlbjpudW1iZXI7XG5cdFx0dmFyIGFzc2V0OkN1YmVUZXh0dXJlQmFzZTtcblx0XHR2YXIgaTpudW1iZXI7XG5cblx0XHR0aGlzLl9jdWJlVGV4dHVyZXMgPSBuZXcgQXJyYXk8YW55PigpO1xuXHRcdHRoaXMuX3RleHR1cmVfdXNlcnNbIHRoaXMuX2N1cl9ibG9ja19pZC50b1N0cmluZygpIF0gPSBbXTtcblxuXHRcdHZhciB0eXBlOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLm5hbWUgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgNjsgaSsrKSB7XG5cdFx0XHR0aGlzLl90ZXh0dXJlX3VzZXJzW3RoaXMuX2N1cl9ibG9ja19pZC50b1N0cmluZygpXSA9IFtdO1xuXHRcdFx0dGhpcy5fY3ViZVRleHR1cmVzLnB1c2gobnVsbCk7XG5cblx0XHRcdC8vIEV4dGVybmFsXG5cdFx0XHRpZiAodHlwZSA9PSAwKSB7XG5cdFx0XHRcdGRhdGFfbGVuID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRcdFx0dmFyIHVybDpzdHJpbmc7XG5cdFx0XHRcdHVybCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVURkJ5dGVzKGRhdGFfbGVuKTtcblxuXHRcdFx0XHR0aGlzLl9wQWRkRGVwZW5kZW5jeSh0aGlzLl9jdXJfYmxvY2tfaWQudG9TdHJpbmcoKSArIFwiI1wiICsgaSwgbmV3IFVSTFJlcXVlc3QodXJsKSwgZmFsc2UsIG51bGwsIHRydWUpO1xuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRkYXRhX2xlbiA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0XHRcdHZhciBkYXRhOkJ5dGVBcnJheTtcblx0XHRcdFx0ZGF0YSA9IG5ldyBCeXRlQXJyYXkoKTtcblxuXHRcdFx0XHR0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRCeXRlcyhkYXRhLCAwLCBkYXRhX2xlbik7XG5cblx0XHRcdFx0dGhpcy5fcEFkZERlcGVuZGVuY3kodGhpcy5fY3VyX2Jsb2NrX2lkLnRvU3RyaW5nKCkgKyBcIiNcIiArIGksIG51bGwsIGZhbHNlLCBQYXJzZXJVdGlscy5ieXRlQXJyYXlUb0ltYWdlKGRhdGEpLCB0cnVlKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBJZ25vcmUgZm9yIG5vd1xuXHRcdHRoaXMucGFyc2VQcm9wZXJ0aWVzKG51bGwpO1xuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5leHRyYXMgPSB0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHR0aGlzLl9wUGF1c2VBbmRSZXRyaWV2ZURlcGVuZGVuY2llcygpO1xuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gYXNzZXQ7XG5cblx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdHZhciB0ZXh0dXJlU3R5bGVzTmFtZXM6QXJyYXk8c3RyaW5nPiA9IFtcImV4dGVybmFsXCIsIFwiZW1iZWRcIl1cblx0XHRcdGNvbnNvbGUubG9nKFwiU3RhcnQgcGFyc2luZyA2IFwiICsgdGV4dHVyZVN0eWxlc05hbWVzW3R5cGVdICsgXCIgQml0bWFwcyBmb3IgQ3ViZVRleHR1cmVcIik7XG5cdFx0fVxuXHR9XG5cblx0Ly9CbG9jayBJRCA9IDkxXG5cdHByaXZhdGUgcGFyc2VTaGFyZWRNZXRob2RCbG9jayhibG9ja0lEOm51bWJlcik6dm9pZFxuXHR7XG5cdFx0dmFyIGFzc2V0OkVmZmVjdE1ldGhvZEJhc2U7XG5cblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0ubmFtZSA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblx0XHRhc3NldCA9IHRoaXMucGFyc2VTaGFyZWRNZXRob2RMaXN0KGJsb2NrSUQpO1xuXHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gYXNzZXQ7XG5cdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQoPElBc3NldD4gYXNzZXQsIHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5uYW1lKTtcblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IGFzc2V0O1xuXG5cdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIEVmZmVjdE1ldGhvZDogTmFtZSA9IFwiICsgYXNzZXQubmFtZSArIFwiIFR5cGUgPSBcIiArIGFzc2V0KTtcblx0XHR9XG5cdH1cblxuXHQvL0Jsb2NrIElEID0gOTJcblx0cHJpdmF0ZSBwYXJzZVNoYWRvd01ldGhvZEJsb2NrKGJsb2NrSUQ6bnVtYmVyKTp2b2lkXG5cdHtcblx0XHR2YXIgdHlwZTpudW1iZXI7XG5cdFx0dmFyIGRhdGFfbGVuOm51bWJlcjtcblx0XHR2YXIgYXNzZXQ6U2hhZG93TWV0aG9kQmFzZTtcblx0XHR2YXIgc2hhZG93TGlnaHRJRDpudW1iZXI7XG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLm5hbWUgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cblx0XHRzaGFkb3dMaWdodElEID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHR2YXIgcmV0dXJuZWRBcnJheTpBcnJheTxhbnk+ID0gdGhpcy5nZXRBc3NldEJ5SUQoc2hhZG93TGlnaHRJRCwgW0Fzc2V0VHlwZS5MSUdIVF0pO1xuXG5cdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKSB7XG5cdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgVGFyZ2V0TGlnaHQgKElEID0gXCIgKyBzaGFkb3dMaWdodElEICsgXCIgKSBmb3IgdGhpcyBTaGFkb3dNZXRob2QgLSBTaGFkb3dNZXRob2Qgbm90IGNyZWF0ZWRcIik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0YXNzZXQgPSB0aGlzLnBhcnNlU2hhZG93TWV0aG9kTGlzdCg8TGlnaHRCYXNlPiByZXR1cm5lZEFycmF5WzFdLCBibG9ja0lEKTtcblxuXHRcdGlmICghYXNzZXQpXG5cdFx0XHRyZXR1cm47XG5cblx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTsgLy8gSWdub3JlIGZvciBub3dcblx0XHR0aGlzLl9wRmluYWxpemVBc3NldCg8SUFzc2V0PiBhc3NldCwgdGhpcy5fYmxvY2tzW2Jsb2NrSURdLm5hbWUpO1xuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gYXNzZXQ7XG5cblx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgU2hhZG93TWFwTWV0aG9kTWV0aG9kOiBOYW1lID0gXCIgKyBhc3NldC5uYW1lICsgXCIgfCBUeXBlID0gXCIgKyBhc3NldCArIFwiIHwgTGlnaHQtTmFtZSA9IFwiLCAoIDxMaWdodEJhc2U+IHJldHVybmVkQXJyYXlbMV0gKS5uYW1lKTtcblx0XHR9XG5cdH1cblxuXG5cdC8vQmxvY2sgSUQgPSAyNTNcblx0cHJpdmF0ZSBwYXJzZUNvbW1hbmQoYmxvY2tJRDpudW1iZXIpOnZvaWRcblx0e1xuXHRcdHZhciBoYXNCbG9ja3M6Ym9vbGVhbiA9ICggdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRCeXRlKCkgPT0gMSApO1xuXHRcdHZhciBwYXJfaWQ6bnVtYmVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHR2YXIgbXR4Ok1hdHJpeDNEID0gdGhpcy5wYXJzZU1hdHJpeDNEKCk7XG5cdFx0dmFyIG5hbWU6c3RyaW5nID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXG5cdFx0dmFyIHBhcmVudE9iamVjdDpEaXNwbGF5T2JqZWN0Q29udGFpbmVyO1xuXHRcdHZhciB0YXJnZXRPYmplY3Q6RGlzcGxheU9iamVjdENvbnRhaW5lcjtcblxuXHRcdHZhciByZXR1cm5lZEFycmF5OkFycmF5PGFueT4gPSB0aGlzLmdldEFzc2V0QnlJRChwYXJfaWQsIFtBc3NldFR5cGUuQ09OVEFJTkVSLCBBc3NldFR5cGUuTElHSFQsIEFzc2V0VHlwZS5NRVNIXSk7XG5cblx0XHRpZiAocmV0dXJuZWRBcnJheVswXSkge1xuXHRcdFx0cGFyZW50T2JqZWN0ID0gPERpc3BsYXlPYmplY3RDb250YWluZXI+IHJldHVybmVkQXJyYXlbMV07XG5cdFx0fVxuXG5cdFx0dmFyIG51bUNvbW1hbmRzOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFNob3J0KCk7XG5cdFx0dmFyIHR5cGVDb21tYW5kOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFNob3J0KCk7XG5cblx0XHR2YXIgcHJvcHM6QVdEUHJvcGVydGllcyA9IHRoaXMucGFyc2VQcm9wZXJ0aWVzKHsxOkFXRFBhcnNlci5CQUREUn0pO1xuXG5cdFx0c3dpdGNoICh0eXBlQ29tbWFuZCkge1xuXHRcdFx0Y2FzZSAxOlxuXG5cdFx0XHRcdHZhciB0YXJnZXRJRDpudW1iZXIgPSBwcm9wcy5nZXQoMSwgMCk7XG5cdFx0XHRcdHZhciByZXR1cm5lZEFycmF5VGFyZ2V0OkFycmF5PGFueT4gPSB0aGlzLmdldEFzc2V0QnlJRCh0YXJnZXRJRCwgW0Fzc2V0VHlwZS5MSUdIVCwgQXNzZXRUeXBlLlRFWFRVUkVfUFJPSkVDVE9SXSk7IC8vZm9yIG5vIG9ubHkgbGlnaHQgaXMgcmVxdWVzdGVkISEhIVxuXG5cdFx0XHRcdGlmICgoIXJldHVybmVkQXJyYXlUYXJnZXRbMF0pICYmICh0YXJnZXRJRCAhPSAwKSkge1xuXHRcdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBsaWdodCAoSUQgPSBcIiArIHRhcmdldElEICsgXCIgKCBmb3IgdGhpcyBDb21tYW5kQm9jayFcIik7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGFyZ2V0T2JqZWN0ID0gcmV0dXJuZWRBcnJheVRhcmdldFsxXTtcblxuXHRcdFx0XHRpZiAocGFyZW50T2JqZWN0KSB7XG5cdFx0XHRcdFx0cGFyZW50T2JqZWN0LmFkZENoaWxkKHRhcmdldE9iamVjdCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0YXJnZXRPYmplY3QudHJhbnNmb3JtLm1hdHJpeDNEID0gbXR4O1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdGlmICh0YXJnZXRPYmplY3QpIHtcblx0XHRcdHByb3BzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoezE6dGhpcy5fbWF0cml4TnJUeXBlLCAyOnRoaXMuX21hdHJpeE5yVHlwZSwgMzp0aGlzLl9tYXRyaXhOclR5cGUsIDQ6QVdEUGFyc2VyLlVJTlQ4fSk7XG5cblx0XHRcdHRhcmdldE9iamVjdC5waXZvdCA9IG5ldyBWZWN0b3IzRChwcm9wcy5nZXQoMSwgMCksIHByb3BzLmdldCgyLCAwKSwgcHJvcHMuZ2V0KDMsIDApKTtcblx0XHRcdHRhcmdldE9iamVjdC5leHRyYSA9IHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXG5cdFx0fVxuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gdGFyZ2V0T2JqZWN0XG5cblx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgQ29tbWFuZEJsb2NrOiBOYW1lID0gJ1wiICsgbmFtZSk7XG5cdFx0fVxuXG5cdH1cblxuXHQvL2Jsb2NrSUQgMjU1XG5cdHByaXZhdGUgcGFyc2VNZXRhRGF0YShibG9ja0lEOm51bWJlcik6dm9pZFxuXHR7XG5cdFx0dmFyIHByb3BzOkFXRFByb3BlcnRpZXMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7MTpBV0RQYXJzZXIuVUlOVDMyLCAyOkFXRFBhcnNlci5BV0RTVFJJTkcsIDM6QVdEUGFyc2VyLkFXRFNUUklORywgNDpBV0RQYXJzZXIuQVdEU1RSSU5HLCA1OkFXRFBhcnNlci5BV0RTVFJJTkd9KTtcblxuXHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBNZXRhRGF0YUJsb2NrOiBUaW1lU3RhbXAgICAgICAgICA9IFwiICsgcHJvcHMuZ2V0KDEsIDApKTtcblx0XHRcdGNvbnNvbGUubG9nKFwiICAgICAgICAgICAgICAgICAgICAgICAgRW5jb2Rlck5hbWUgICAgICAgPSBcIiArIHByb3BzLmdldCgyLCBcInVua25vd25cIikpO1xuXHRcdFx0Y29uc29sZS5sb2coXCIgICAgICAgICAgICAgICAgICAgICAgICBFbmNvZGVyVmVyc2lvbiAgICA9IFwiICsgcHJvcHMuZ2V0KDMsIFwidW5rbm93blwiKSk7XG5cdFx0XHRjb25zb2xlLmxvZyhcIiAgICAgICAgICAgICAgICAgICAgICAgIEdlbmVyYXRvck5hbWUgICAgID0gXCIgKyBwcm9wcy5nZXQoNCwgXCJ1bmtub3duXCIpKTtcblx0XHRcdGNvbnNvbGUubG9nKFwiICAgICAgICAgICAgICAgICAgICAgICAgR2VuZXJhdG9yVmVyc2lvbiAgPSBcIiArIHByb3BzLmdldCg1LCBcInVua25vd25cIikpO1xuXHRcdH1cblx0fVxuXG5cdC8vYmxvY2tJRCAyNTRcblx0cHJpdmF0ZSBwYXJzZU5hbWVTcGFjZShibG9ja0lEOm51bWJlcik6dm9pZFxuXHR7XG5cdFx0dmFyIGlkOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdHZhciBuYW1lU3BhY2VTdHJpbmc6c3RyaW5nID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXHRcdGlmICh0aGlzLl9kZWJ1Zylcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgTmFtZVNwYWNlQmxvY2s6IElEID0gXCIgKyBpZCArIFwiIHwgU3RyaW5nID0gXCIgKyBuYW1lU3BhY2VTdHJpbmcpO1xuXHR9XG5cblx0Ly8tLVBhcnNlciBVVElMUy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdC8vIHRoaXMgZnVuY3Rpb25zIHJlYWRzIGFuZCBjcmVhdGVzIGEgU2hhZG93TWV0aG9kTWV0aG9kXG5cdHByaXZhdGUgcGFyc2VTaGFkb3dNZXRob2RMaXN0KGxpZ2h0OkxpZ2h0QmFzZSwgYmxvY2tJRDpudW1iZXIpOlNoYWRvd01ldGhvZEJhc2Vcblx0e1xuXG5cdFx0dmFyIG1ldGhvZFR5cGU6bnVtYmVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdHZhciBzaGFkb3dNZXRob2Q6U2hhZG93TWV0aG9kQmFzZTtcblx0XHR2YXIgcHJvcHM6QVdEUHJvcGVydGllcyA9IHRoaXMucGFyc2VQcm9wZXJ0aWVzKHsxOkFXRFBhcnNlci5CQUREUiwgMjpBV0RQYXJzZXIuQkFERFIsIDM6QVdEUGFyc2VyLkJBRERSLCAxMDE6dGhpcy5fcHJvcHNOclR5cGUsIDEwMjp0aGlzLl9wcm9wc05yVHlwZSwgMTAzOnRoaXMuX3Byb3BzTnJUeXBlLCAyMDE6QVdEUGFyc2VyLlVJTlQzMiwgMjAyOkFXRFBhcnNlci5VSU5UMzIsIDMwMTpBV0RQYXJzZXIuVUlOVDE2LCAzMDI6QVdEUGFyc2VyLlVJTlQxNiwgNDAxOkFXRFBhcnNlci5VSU5UOCwgNDAyOkFXRFBhcnNlci5VSU5UOCwgNjAxOkFXRFBhcnNlci5DT0xPUiwgNjAyOkFXRFBhcnNlci5DT0xPUiwgNzAxOkFXRFBhcnNlci5CT09MLCA3MDI6QVdEUGFyc2VyLkJPT0wsIDgwMTpBV0RQYXJzZXIuTVRYNHg0fSk7XG5cblx0XHR2YXIgdGFyZ2V0SUQ6bnVtYmVyO1xuXHRcdHZhciByZXR1cm5lZEFycmF5OkFycmF5PGFueT5cblx0XHRzd2l0Y2ggKG1ldGhvZFR5cGUpIHtcblx0XHRcdC8vXHRcdFx0XHRjYXNlIDEwMDE6IC8vQ2FzY2FkZVNoYWRvd01hcE1ldGhvZFxuXHRcdFx0Ly9cdFx0XHRcdFx0dGFyZ2V0SUQgPSBwcm9wcy5nZXQoMSwgMCk7XG5cdFx0XHQvL1x0XHRcdFx0XHRyZXR1cm5lZEFycmF5ID0gZ2V0QXNzZXRCeUlEKHRhcmdldElELCBbQXNzZXRUeXBlLlNIQURPV19NQVBfTUVUSE9EXSk7XG5cdFx0XHQvL1x0XHRcdFx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pIHtcblx0XHRcdC8vXHRcdFx0XHRcdFx0X2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBTaGFkb3dCYXNlTWV0aG9kIChJRCA9IFwiICsgdGFyZ2V0SUQgKyBcIiApIGZvciB0aGlzIENhc2NhZGVTaGFkb3dNYXBNZXRob2QgLSBTaGFkb3dNZXRob2Qgbm90IGNyZWF0ZWRcIik7XG5cdFx0XHQvL1x0XHRcdFx0XHRcdHJldHVybiBzaGFkb3dNZXRob2Q7XG5cdFx0XHQvL1x0XHRcdFx0XHR9XG5cdFx0XHQvL1x0XHRcdFx0XHRzaGFkb3dNZXRob2QgPSBuZXcgQ2FzY2FkZVNoYWRvd01hcE1ldGhvZChyZXR1cm5lZEFycmF5WzFdKTtcblx0XHRcdC8vXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAxMDAyOiAvL1NoYWRvd05lYXJNZXRob2Rcblx0XHRcdFx0dGFyZ2V0SUQgPSBwcm9wcy5nZXQoMSwgMCk7XG5cdFx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRCh0YXJnZXRJRCwgW0Fzc2V0VHlwZS5TSEFET1dfTUFQX01FVEhPRF0pO1xuXHRcdFx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pIHtcblx0XHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgU2hhZG93QmFzZU1ldGhvZCAoSUQgPSBcIiArIHRhcmdldElEICsgXCIgKSBmb3IgdGhpcyBTaGFkb3dOZWFyTWV0aG9kIC0gU2hhZG93TWV0aG9kIG5vdCBjcmVhdGVkXCIpO1xuXHRcdFx0XHRcdHJldHVybiBzaGFkb3dNZXRob2Q7XG5cdFx0XHRcdH1cblx0XHRcdFx0c2hhZG93TWV0aG9kID0gbmV3IFNoYWRvd05lYXJNZXRob2QoPFNoYWRvd01ldGhvZEJhc2U+IHJldHVybmVkQXJyYXlbMV0pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMTEwMTogLy9TaGFkb3dGaWx0ZXJlZE1ldGhvZFxuXG5cdFx0XHRcdHNoYWRvd01ldGhvZCA9IG5ldyBTaGFkb3dGaWx0ZXJlZE1ldGhvZCg8RGlyZWN0aW9uYWxMaWdodD4gbGlnaHQpO1xuXHRcdFx0XHQoPFNoYWRvd0ZpbHRlcmVkTWV0aG9kPiBzaGFkb3dNZXRob2QpLmFscGhhID0gcHJvcHMuZ2V0KDEwMSwgMSk7XG5cdFx0XHRcdCg8U2hhZG93RmlsdGVyZWRNZXRob2Q+IHNoYWRvd01ldGhvZCkuZXBzaWxvbiA9IHByb3BzLmdldCgxMDIsIDAuMDAyKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgMTEwMjogLy9TaGFkb3dEaXRoZXJlZE1ldGhvZFxuXG5cblx0XHRcdFx0c2hhZG93TWV0aG9kID0gbmV3IFNoYWRvd0RpdGhlcmVkTWV0aG9kKDxEaXJlY3Rpb25hbExpZ2h0PiBsaWdodCwgPG51bWJlcj4gcHJvcHMuZ2V0KDIwMSwgNSkpO1xuXHRcdFx0XHQoPFNoYWRvd0RpdGhlcmVkTWV0aG9kPiBzaGFkb3dNZXRob2QpLmFscGhhID0gcHJvcHMuZ2V0KDEwMSwgMSk7XG5cdFx0XHRcdCg8U2hhZG93RGl0aGVyZWRNZXRob2Q+IHNoYWRvd01ldGhvZCkuZXBzaWxvbiA9IHByb3BzLmdldCgxMDIsIDAuMDAyKTtcblx0XHRcdFx0KDxTaGFkb3dEaXRoZXJlZE1ldGhvZD4gc2hhZG93TWV0aG9kKS5yYW5nZSA9IHByb3BzLmdldCgxMDMsIDEpO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAxMTAzOiAvL1NoYWRvd1NvZnRNZXRob2RcblxuXHRcdFx0XHRzaGFkb3dNZXRob2QgPSBuZXcgU2hhZG93U29mdE1ldGhvZCg8RGlyZWN0aW9uYWxMaWdodD4gbGlnaHQsIDxudW1iZXI+IHByb3BzLmdldCgyMDEsIDUpKTtcblx0XHRcdFx0KDxTaGFkb3dTb2Z0TWV0aG9kPiBzaGFkb3dNZXRob2QpLmFscGhhID0gcHJvcHMuZ2V0KDEwMSwgMSk7XG5cdFx0XHRcdCg8U2hhZG93U29mdE1ldGhvZD4gc2hhZG93TWV0aG9kKS5lcHNpbG9uID0gcHJvcHMuZ2V0KDEwMiwgMC4wMDIpO1xuXHRcdFx0XHQoPFNoYWRvd1NvZnRNZXRob2Q+IHNoYWRvd01ldGhvZCkucmFuZ2UgPSBwcm9wcy5nZXQoMTAzLCAxKTtcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMTEwNDogLy9TaGFkb3dIYXJkTWV0aG9kXG5cdFx0XHRcdHNoYWRvd01ldGhvZCA9IG5ldyBTaGFkb3dIYXJkTWV0aG9kKGxpZ2h0KTtcblx0XHRcdFx0KDxTaGFkb3dIYXJkTWV0aG9kPiBzaGFkb3dNZXRob2QpLmFscGhhID0gcHJvcHMuZ2V0KDEwMSwgMSk7XG5cdFx0XHRcdCg8U2hhZG93SGFyZE1ldGhvZD4gc2hhZG93TWV0aG9kKS5lcHNpbG9uID0gcHJvcHMuZ2V0KDEwMiwgMC4wMDIpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdH1cblx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHRyZXR1cm4gc2hhZG93TWV0aG9kO1xuXHR9XG5cblx0Ly9CbG9jayBJRCAxMDFcblx0cHJpdmF0ZSBwYXJzZVNrZWxldG9uKGJsb2NrSUQ6bnVtYmVyIC8qdWludCovKTp2b2lkXG5cdHtcblx0XHR2YXIgbmFtZTpzdHJpbmcgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0dmFyIG51bV9qb2ludHM6bnVtYmVyIC8qdWludCovID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdHZhciBza2VsZXRvbjpTa2VsZXRvbiA9IG5ldyBTa2VsZXRvbigpO1xuXHRcdHRoaXMucGFyc2VQcm9wZXJ0aWVzKG51bGwpOyAvLyBEaXNjYXJkIHByb3BlcnRpZXMgZm9yIG5vd1x0XHRcblxuXHRcdHZhciBqb2ludHNfcGFyc2VkOm51bWJlciAvKnVpbnQqLyA9IDA7XG5cdFx0d2hpbGUgKGpvaW50c19wYXJzZWQgPCBudW1fam9pbnRzKSB7XG5cdFx0XHR2YXIgam9pbnQ6U2tlbGV0b25Kb2ludDtcblx0XHRcdHZhciBpYnA6TWF0cml4M0Q7XG5cdFx0XHQvLyBJZ25vcmUgam9pbnQgaWRcblx0XHRcdHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRcdGpvaW50ID0gbmV3IFNrZWxldG9uSm9pbnQoKTtcblx0XHRcdGpvaW50LnBhcmVudEluZGV4ID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpIC0gMTsgLy8gMD1udWxsIGluIEFXRFxuXHRcdFx0am9pbnQubmFtZSA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblxuXHRcdFx0aWJwID0gdGhpcy5wYXJzZU1hdHJpeDNEKCk7XG5cdFx0XHRqb2ludC5pbnZlcnNlQmluZFBvc2UgPSBpYnAucmF3RGF0YTtcblx0XHRcdC8vIElnbm9yZSBqb2ludCBwcm9wcy9hdHRyaWJ1dGVzIGZvciBub3dcblx0XHRcdHRoaXMucGFyc2VQcm9wZXJ0aWVzKG51bGwpO1xuXHRcdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0XHRza2VsZXRvbi5qb2ludHMucHVzaChqb2ludCk7XG5cdFx0XHRqb2ludHNfcGFyc2VkKys7XG5cdFx0fVxuXG5cdFx0Ly8gRGlzY2FyZCBhdHRyaWJ1dGVzIGZvciBub3dcblx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHR0aGlzLl9wRmluYWxpemVBc3NldChza2VsZXRvbiwgbmFtZSk7XG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBza2VsZXRvbjtcblx0XHRpZiAodGhpcy5fZGVidWcpXG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIFNrZWxldG9uOiBOYW1lID0gXCIgKyBza2VsZXRvbi5uYW1lICsgXCIgfCBOdW1iZXIgb2YgSm9pbnRzID0gXCIgKyBqb2ludHNfcGFyc2VkKTtcblx0fVxuXG5cdC8vQmxvY2sgSUQgPSAxMDJcblx0cHJpdmF0ZSBwYXJzZVNrZWxldG9uUG9zZShibG9ja0lEOm51bWJlciAvKnVpbnQqLyk6dm9pZFxuXHR7XG5cdFx0dmFyIG5hbWU6c3RyaW5nID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXHRcdHZhciBudW1fam9pbnRzOm51bWJlciAvKnVpbnQqLyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHR0aGlzLnBhcnNlUHJvcGVydGllcyhudWxsKTsgLy8gSWdub3JlIHByb3BlcnRpZXMgZm9yIG5vd1xuXG5cdFx0dmFyIHBvc2U6U2tlbGV0b25Qb3NlID0gbmV3IFNrZWxldG9uUG9zZSgpO1xuXG5cdFx0dmFyIGpvaW50c19wYXJzZWQ6bnVtYmVyIC8qdWludCovID0gMDtcblx0XHR3aGlsZSAoam9pbnRzX3BhcnNlZCA8IG51bV9qb2ludHMpIHtcblx0XHRcdHZhciBqb2ludF9wb3NlOkpvaW50UG9zZTtcblx0XHRcdHZhciBoYXNfdHJhbnNmb3JtOm51bWJlciAvKnVpbnQqLztcblx0XHRcdGpvaW50X3Bvc2UgPSBuZXcgSm9pbnRQb3NlKCk7XG5cdFx0XHRoYXNfdHJhbnNmb3JtID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRCeXRlKCk7XG5cdFx0XHRpZiAoaGFzX3RyYW5zZm9ybSA9PSAxKSB7XG5cdFx0XHRcdHZhciBtdHhfZGF0YTpBcnJheTxudW1iZXI+ID0gdGhpcy5wYXJzZU1hdHJpeDQzUmF3RGF0YSgpO1xuXG5cdFx0XHRcdHZhciBtdHg6TWF0cml4M0QgPSBuZXcgTWF0cml4M0QobXR4X2RhdGEpO1xuXHRcdFx0XHRqb2ludF9wb3NlLm9yaWVudGF0aW9uLmZyb21NYXRyaXgobXR4KTtcblx0XHRcdFx0am9pbnRfcG9zZS50cmFuc2xhdGlvbi5jb3B5RnJvbShtdHgucG9zaXRpb24pO1xuXG5cdFx0XHRcdHBvc2Uuam9pbnRQb3Nlc1tqb2ludHNfcGFyc2VkXSA9IGpvaW50X3Bvc2U7XG5cdFx0XHR9XG5cdFx0XHRqb2ludHNfcGFyc2VkKys7XG5cdFx0fVxuXHRcdC8vIFNraXAgYXR0cmlidXRlcyBmb3Igbm93XG5cdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQocG9zZSwgbmFtZSk7XG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBwb3NlO1xuXHRcdGlmICh0aGlzLl9kZWJ1Zylcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgU2tlbGV0b25Qb3NlOiBOYW1lID0gXCIgKyBwb3NlLm5hbWUgKyBcIiB8IE51bWJlciBvZiBKb2ludHMgPSBcIiArIGpvaW50c19wYXJzZWQpO1xuXHR9XG5cblx0Ly9ibG9ja0lEIDEwM1xuXHRwcml2YXRlIHBhcnNlU2tlbGV0b25BbmltYXRpb24oYmxvY2tJRDpudW1iZXIgLyp1aW50Ki8pOnZvaWRcblx0e1xuXHRcdHZhciBmcmFtZV9kdXI6bnVtYmVyO1xuXHRcdHZhciBwb3NlX2FkZHI6bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciBuYW1lOnN0cmluZyA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblx0XHR2YXIgY2xpcDpTa2VsZXRvbkNsaXBOb2RlID0gbmV3IFNrZWxldG9uQ2xpcE5vZGUoKTtcblx0XHR2YXIgbnVtX2ZyYW1lczpudW1iZXIgLyp1aW50Ki8gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0dGhpcy5wYXJzZVByb3BlcnRpZXMobnVsbCk7IC8vIElnbm9yZSBwcm9wZXJ0aWVzIGZvciBub3dcblxuXHRcdHZhciBmcmFtZXNfcGFyc2VkOm51bWJlciAvKnVpbnQqLyA9IDA7XG5cdFx0dmFyIHJldHVybmVkQXJyYXk6QXJyYXk8YW55Pjtcblx0XHR3aGlsZSAoZnJhbWVzX3BhcnNlZCA8IG51bV9mcmFtZXMpIHtcblx0XHRcdHBvc2VfYWRkciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0XHRmcmFtZV9kdXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQocG9zZV9hZGRyLCBbQXNzZXRUeXBlLlNLRUxFVE9OX1BPU0VdKTtcblx0XHRcdGlmICghcmV0dXJuZWRBcnJheVswXSlcblx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIFNrZWxldG9uUG9zZSBGcmFtZSAjIFwiICsgZnJhbWVzX3BhcnNlZCArIFwiIChJRCA9IFwiICsgcG9zZV9hZGRyICsgXCIgKSBmb3IgdGhpcyBTa2VsZXRvbkNsaXBOb2RlXCIpO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRjbGlwLmFkZEZyYW1lKDxTa2VsZXRvblBvc2U+IHRoaXMuX2Jsb2Nrc1twb3NlX2FkZHJdLmRhdGEsIGZyYW1lX2R1cik7XG5cdFx0XHRmcmFtZXNfcGFyc2VkKys7XG5cdFx0fVxuXHRcdGlmIChjbGlwLmZyYW1lcy5sZW5ndGggPT0gMCkge1xuXHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IHRoaXMgU2tlbGV0b25DbGlwTm9kZSwgYmVjYXVzZSBubyBGcmFtZXMgd2hlcmUgc2V0LlwiKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Ly8gSWdub3JlIGF0dHJpYnV0ZXMgZm9yIG5vd1xuXHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KGNsaXAsIG5hbWUpO1xuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gY2xpcDtcblx0XHRpZiAodGhpcy5fZGVidWcpXG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIFNrZWxldG9uQ2xpcE5vZGU6IE5hbWUgPSBcIiArIGNsaXAubmFtZSArIFwiIHwgTnVtYmVyIG9mIEZyYW1lcyA9IFwiICsgY2xpcC5mcmFtZXMubGVuZ3RoKTtcblx0fVxuXG5cdC8vQmxvY2sgSUQgPSAxMTEgLyAgQmxvY2sgSUQgPSAxMTJcblx0cHJpdmF0ZSBwYXJzZU1lc2hQb3NlQW5pbWF0aW9uKGJsb2NrSUQ6bnVtYmVyIC8qdWludCovLCBwb3NlT25seTpib29sZWFuID0gZmFsc2UpOnZvaWRcblx0e1xuXHRcdHZhciBudW1fZnJhbWVzOm51bWJlciAvKnVpbnQqLyA9IDE7XG5cdFx0dmFyIG51bV9zdWJtZXNoZXM6bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciBmcmFtZXNfcGFyc2VkOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgc3ViTWVzaFBhcnNlZDpudW1iZXIgLyp1aW50Ki87XG5cdFx0dmFyIGZyYW1lX2R1cjpudW1iZXI7XG5cdFx0dmFyIHg6bnVtYmVyO1xuXHRcdHZhciB5Om51bWJlcjtcblx0XHR2YXIgejpudW1iZXI7XG5cdFx0dmFyIHN0cl9sZW46bnVtYmVyO1xuXHRcdHZhciBzdHJfZW5kOm51bWJlcjtcblx0XHR2YXIgZ2VvbWV0cnk6R2VvbWV0cnk7XG5cdFx0dmFyIHN1Ykdlb206VHJpYW5nbGVTdWJHZW9tZXRyeTtcblx0XHR2YXIgaWR4Om51bWJlciAvKmludCovID0gMDtcblx0XHR2YXIgY2xpcDpWZXJ0ZXhDbGlwTm9kZSA9IG5ldyBWZXJ0ZXhDbGlwTm9kZSgpO1xuXHRcdHZhciBpbmRpY2VzOkFycmF5PG51bWJlcj4gLyp1aW50Ki87XG5cdFx0dmFyIHZlcnRzOkFycmF5PG51bWJlcj47XG5cdFx0dmFyIG51bV9TdHJlYW1zOm51bWJlciAvKmludCovID0gMDtcblx0XHR2YXIgc3RyZWFtc1BhcnNlZDpudW1iZXIgLyppbnQqLyA9IDA7XG5cdFx0dmFyIHN0cmVhbXR5cGVzOkFycmF5PG51bWJlcj4gLyppbnQqLyA9IG5ldyBBcnJheTxudW1iZXI+KCkgLyppbnQqLztcblx0XHR2YXIgcHJvcHM6QVdEUHJvcGVydGllcztcblx0XHR2YXIgdGhpc0dlbzpHZW9tZXRyeTtcblx0XHR2YXIgbmFtZTpzdHJpbmcgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0dmFyIGdlb0FkcmVzczpudW1iZXIgLyppbnQqLyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0dmFyIHJldHVybmVkQXJyYXk6QXJyYXk8YW55PiA9IHRoaXMuZ2V0QXNzZXRCeUlEKGdlb0FkcmVzcywgW0Fzc2V0VHlwZS5HRU9NRVRSWV0pO1xuXHRcdGlmICghcmV0dXJuZWRBcnJheVswXSkge1xuXHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIHRhcmdldC1HZW9tZXRyeS1PYmplY3QgXCIgKyBnZW9BZHJlc3MgKyBcIiApIGZvciB0aGlzIFZlcnRleENsaXBOb2RlXCIpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR2YXIgdXZzOkFycmF5PEFycmF5PG51bWJlcj4+ID0gdGhpcy5nZXRVVkZvclZlcnRleEFuaW1hdGlvbihnZW9BZHJlc3MpO1xuXHRcdGlmICghcG9zZU9ubHkpXG5cdFx0XHRudW1fZnJhbWVzID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXG5cdFx0bnVtX3N1Ym1lc2hlcyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRudW1fU3RyZWFtcyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRzdHJlYW1zUGFyc2VkID0gMDtcblx0XHR3aGlsZSAoc3RyZWFtc1BhcnNlZCA8IG51bV9TdHJlYW1zKSB7XG5cdFx0XHRzdHJlYW10eXBlcy5wdXNoKHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKSk7XG5cdFx0XHRzdHJlYW1zUGFyc2VkKys7XG5cdFx0fVxuXHRcdHByb3BzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoezE6QVdEUGFyc2VyLkJPT0wsIDI6QVdEUGFyc2VyLkJPT0x9KTtcblxuXHRcdGNsaXAubG9vcGluZyA9IHByb3BzLmdldCgxLCB0cnVlKTtcblx0XHRjbGlwLnN0aXRjaEZpbmFsRnJhbWUgPSBwcm9wcy5nZXQoMiwgZmFsc2UpO1xuXG5cdFx0ZnJhbWVzX3BhcnNlZCA9IDA7XG5cdFx0d2hpbGUgKGZyYW1lc19wYXJzZWQgPCBudW1fZnJhbWVzKSB7XG5cdFx0XHRmcmFtZV9kdXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0XHRnZW9tZXRyeSA9IG5ldyBHZW9tZXRyeSgpO1xuXHRcdFx0c3ViTWVzaFBhcnNlZCA9IDA7XG5cdFx0XHR3aGlsZSAoc3ViTWVzaFBhcnNlZCA8IG51bV9zdWJtZXNoZXMpIHtcblx0XHRcdFx0c3RyZWFtc1BhcnNlZCA9IDA7XG5cdFx0XHRcdHN0cl9sZW4gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdFx0XHRzdHJfZW5kID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiArIHN0cl9sZW47XG5cdFx0XHRcdHdoaWxlIChzdHJlYW1zUGFyc2VkIDwgbnVtX1N0cmVhbXMpIHtcblx0XHRcdFx0XHRpZiAoc3RyZWFtdHlwZXNbc3RyZWFtc1BhcnNlZF0gPT0gMSkge1xuXHRcdFx0XHRcdFx0aW5kaWNlcyA9ICg8R2VvbWV0cnk+IHJldHVybmVkQXJyYXlbMV0pLnN1Ykdlb21ldHJpZXNbc3ViTWVzaFBhcnNlZF0uaW5kaWNlcztcblx0XHRcdFx0XHRcdHZlcnRzID0gbmV3IEFycmF5PG51bWJlcj4oKTtcblx0XHRcdFx0XHRcdGlkeCA9IDA7XG5cdFx0XHRcdFx0XHR3aGlsZSAodGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiA8IHN0cl9lbmQpIHtcblx0XHRcdFx0XHRcdFx0eCA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeUdlbylcblx0XHRcdFx0XHRcdFx0eSA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeUdlbylcblx0XHRcdFx0XHRcdFx0eiA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeUdlbylcblx0XHRcdFx0XHRcdFx0dmVydHNbaWR4KytdID0geDtcblx0XHRcdFx0XHRcdFx0dmVydHNbaWR4KytdID0geTtcblx0XHRcdFx0XHRcdFx0dmVydHNbaWR4KytdID0gejtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHN1Ykdlb20gPSBuZXcgVHJpYW5nbGVTdWJHZW9tZXRyeSh0cnVlKTtcblx0XHRcdFx0XHRcdHN1Ykdlb20udXBkYXRlSW5kaWNlcyhpbmRpY2VzKTtcblx0XHRcdFx0XHRcdHN1Ykdlb20udXBkYXRlUG9zaXRpb25zKHZlcnRzKTtcblx0XHRcdFx0XHRcdHN1Ykdlb20udXBkYXRlVVZzKHV2c1tzdWJNZXNoUGFyc2VkXSk7XG5cdFx0XHRcdFx0XHRzdWJHZW9tLnVwZGF0ZVZlcnRleE5vcm1hbHMobnVsbCk7XG5cdFx0XHRcdFx0XHRzdWJHZW9tLnVwZGF0ZVZlcnRleFRhbmdlbnRzKG51bGwpO1xuXHRcdFx0XHRcdFx0c3ViR2VvbS5hdXRvRGVyaXZlTm9ybWFscyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0c3ViR2VvbS5hdXRvRGVyaXZlVGFuZ2VudHMgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHN1Yk1lc2hQYXJzZWQrKztcblx0XHRcdFx0XHRcdGdlb21ldHJ5LmFkZFN1Ykdlb21ldHJ5KHN1Ykdlb20pXG5cdFx0XHRcdFx0fSBlbHNlXG5cdFx0XHRcdFx0XHR0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uID0gc3RyX2VuZDtcblx0XHRcdFx0XHRzdHJlYW1zUGFyc2VkKys7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGNsaXAuYWRkRnJhbWUoZ2VvbWV0cnksIGZyYW1lX2R1cik7XG5cdFx0XHRmcmFtZXNfcGFyc2VkKys7XG5cdFx0fVxuXHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KGNsaXAsIG5hbWUpO1xuXG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBjbGlwO1xuXHRcdGlmICh0aGlzLl9kZWJ1Zylcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgVmVydGV4Q2xpcE5vZGU6IE5hbWUgPSBcIiArIGNsaXAubmFtZSArIFwiIHwgVGFyZ2V0LUdlb21ldHJ5LU5hbWUgPSBcIiArICg8R2VvbWV0cnk+IHJldHVybmVkQXJyYXlbMV0pLm5hbWUgKyBcIiB8IE51bWJlciBvZiBGcmFtZXMgPSBcIiArIGNsaXAuZnJhbWVzLmxlbmd0aCk7XG5cdH1cblxuXHQvL0Jsb2NrSUQgMTEzXG5cdHByaXZhdGUgcGFyc2VWZXJ0ZXhBbmltYXRpb25TZXQoYmxvY2tJRDpudW1iZXIgLyp1aW50Ki8pOnZvaWRcblx0e1xuXHRcdHZhciBwb3NlQmxvY2tBZHJlc3M6bnVtYmVyIC8qaW50Ki9cblx0XHR2YXIgb3V0cHV0U3RyaW5nOnN0cmluZyA9IFwiXCI7XG5cdFx0dmFyIG5hbWU6c3RyaW5nID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXHRcdHZhciBudW1fZnJhbWVzOm51bWJlciAvKnVpbnQqLyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHR2YXIgcHJvcHM6QVdEUHJvcGVydGllcyA9IHRoaXMucGFyc2VQcm9wZXJ0aWVzKHsxOkFXRFBhcnNlci5VSU5UMTZ9KTtcblx0XHR2YXIgZnJhbWVzX3BhcnNlZDpudW1iZXIgLyp1aW50Ki8gPSAwO1xuXHRcdHZhciBza2VsZXRvbkZyYW1lczpBcnJheTxTa2VsZXRvbkNsaXBOb2RlPiA9IG5ldyBBcnJheTxTa2VsZXRvbkNsaXBOb2RlPigpO1xuXHRcdHZhciB2ZXJ0ZXhGcmFtZXM6QXJyYXk8VmVydGV4Q2xpcE5vZGU+ID0gbmV3IEFycmF5PFZlcnRleENsaXBOb2RlPigpO1xuXHRcdHdoaWxlIChmcmFtZXNfcGFyc2VkIDwgbnVtX2ZyYW1lcykge1xuXHRcdFx0cG9zZUJsb2NrQWRyZXNzID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRcdHZhciByZXR1cm5lZEFycmF5OkFycmF5PGFueT4gPSB0aGlzLmdldEFzc2V0QnlJRChwb3NlQmxvY2tBZHJlc3MsIFtBc3NldFR5cGUuQU5JTUFUSU9OX05PREVdKTtcblx0XHRcdGlmICghcmV0dXJuZWRBcnJheVswXSlcblx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIEFuaW1hdGlvbkNsaXBOb2RlIE5yIFwiICsgZnJhbWVzX3BhcnNlZCArIFwiICggXCIgKyBwb3NlQmxvY2tBZHJlc3MgKyBcIiApIGZvciB0aGlzIEFuaW1hdGlvblNldFwiKTtcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRpZiAocmV0dXJuZWRBcnJheVsxXSBpbnN0YW5jZW9mIFZlcnRleENsaXBOb2RlKVxuXHRcdFx0XHR2ZXJ0ZXhGcmFtZXMucHVzaChyZXR1cm5lZEFycmF5WzFdKVxuXHRcdFx0XHRpZiAocmV0dXJuZWRBcnJheVsxXSBpbnN0YW5jZW9mIFNrZWxldG9uQ2xpcE5vZGUpXG5cdFx0XHRcdHNrZWxldG9uRnJhbWVzLnB1c2gocmV0dXJuZWRBcnJheVsxXSlcblx0XHRcdH1cblx0XHRcdGZyYW1lc19wYXJzZWQrKztcblx0XHR9XG5cdFx0aWYgKCh2ZXJ0ZXhGcmFtZXMubGVuZ3RoID09IDApICYmIChza2VsZXRvbkZyYW1lcy5sZW5ndGggPT0gMCkpIHtcblx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBjcmVhdGUgdGhpcyBBbmltYXRpb25TZXQsIGJlY2F1c2UgaXQgY29udGFpbnMgbm8gYW5pbWF0aW9uc1wiKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0aWYgKHZlcnRleEZyYW1lcy5sZW5ndGggPiAwKSB7XG5cdFx0XHR2YXIgbmV3VmVydGV4QW5pbWF0aW9uU2V0OlZlcnRleEFuaW1hdGlvblNldCA9IG5ldyBWZXJ0ZXhBbmltYXRpb25TZXQoKTtcblx0XHRcdGZvciAodmFyIGk6bnVtYmVyIC8qaW50Ki8gPSAwOyBpIDwgdmVydGV4RnJhbWVzLmxlbmd0aDsgaSsrKVxuXHRcdFx0XHRuZXdWZXJ0ZXhBbmltYXRpb25TZXQuYWRkQW5pbWF0aW9uKHZlcnRleEZyYW1lc1tpXSk7XG5cdFx0XHR0aGlzLl9wRmluYWxpemVBc3NldChuZXdWZXJ0ZXhBbmltYXRpb25TZXQsIG5hbWUpO1xuXHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBuZXdWZXJ0ZXhBbmltYXRpb25TZXQ7XG5cdFx0XHRpZiAodGhpcy5fZGVidWcpXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgVmVydGV4QW5pbWF0aW9uU2V0OiBOYW1lID0gXCIgKyBuYW1lICsgXCIgfCBBbmltYXRpb25zID0gXCIgKyBuZXdWZXJ0ZXhBbmltYXRpb25TZXQuYW5pbWF0aW9ucy5sZW5ndGggKyBcIiB8IEFuaW1hdGlvbi1OYW1lcyA9IFwiICsgbmV3VmVydGV4QW5pbWF0aW9uU2V0LmFuaW1hdGlvbk5hbWVzLnRvU3RyaW5nKCkpO1xuXG5cdFx0fSBlbHNlIGlmIChza2VsZXRvbkZyYW1lcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQocG9zZUJsb2NrQWRyZXNzLCBbQXNzZXRUeXBlLkFOSU1BVElPTl9OT0RFXSk7XG5cdFx0XHR2YXIgbmV3U2tlbGV0b25BbmltYXRpb25TZXQ6U2tlbGV0b25BbmltYXRpb25TZXQgPSBuZXcgU2tlbGV0b25BbmltYXRpb25TZXQocHJvcHMuZ2V0KDEsIDQpKTsgLy9wcm9wcy5nZXQoMSw0KSk7XG5cdFx0XHRmb3IgKHZhciBpOm51bWJlciAvKmludCovID0gMDsgaSA8IHNrZWxldG9uRnJhbWVzLmxlbmd0aDsgaSsrKVxuXHRcdFx0XHRuZXdTa2VsZXRvbkFuaW1hdGlvblNldC5hZGRBbmltYXRpb24oc2tlbGV0b25GcmFtZXNbaV0pO1xuXHRcdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQobmV3U2tlbGV0b25BbmltYXRpb25TZXQsIG5hbWUpO1xuXHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBuZXdTa2VsZXRvbkFuaW1hdGlvblNldDtcblx0XHRcdGlmICh0aGlzLl9kZWJ1Zylcblx0XHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBTa2VsZXRvbkFuaW1hdGlvblNldDogTmFtZSA9IFwiICsgbmFtZSArIFwiIHwgQW5pbWF0aW9ucyA9IFwiICsgbmV3U2tlbGV0b25BbmltYXRpb25TZXQuYW5pbWF0aW9ucy5sZW5ndGggKyBcIiB8IEFuaW1hdGlvbi1OYW1lcyA9IFwiICsgbmV3U2tlbGV0b25BbmltYXRpb25TZXQuYW5pbWF0aW9uTmFtZXMudG9TdHJpbmcoKSk7XG5cblx0XHR9XG5cdH1cblxuXHQvL0Jsb2NrSUQgMTIyXG5cdHByaXZhdGUgcGFyc2VBbmltYXRvclNldChibG9ja0lEOm51bWJlciAvKnVpbnQqLyk6dm9pZFxuXHR7XG5cdFx0dmFyIHRhcmdldE1lc2g6TWVzaDtcblx0XHR2YXIgYW5pbVNldEJsb2NrQWRyZXNzOm51bWJlciAvKmludCovXG5cdFx0dmFyIHRhcmdldEFuaW1hdGlvblNldDpBbmltYXRpb25TZXRCYXNlO1xuXHRcdHZhciBvdXRwdXRTdHJpbmc6c3RyaW5nID0gXCJcIjtcblx0XHR2YXIgbmFtZTpzdHJpbmcgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0dmFyIHR5cGU6bnVtYmVyIC8qdWludCovID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXG5cdFx0dmFyIHByb3BzOkFXRFByb3BlcnRpZXMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7MTpBV0RQYXJzZXIuQkFERFJ9KTtcblxuXHRcdGFuaW1TZXRCbG9ja0FkcmVzcyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0dmFyIHRhcmdldE1lc2hMZW5ndGg6bnVtYmVyIC8qdWludCovID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdHZhciBtZXNoQWRyZXNzZXM6QXJyYXk8bnVtYmVyPiAvKnVpbnQqLyA9IG5ldyBBcnJheTxudW1iZXI+KCkgLyp1aW50Ki87XG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgLyppbnQqLyA9IDA7IGkgPCB0YXJnZXRNZXNoTGVuZ3RoOyBpKyspXG5cdFx0XHRtZXNoQWRyZXNzZXMucHVzaCh0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpKTtcblxuXHRcdHZhciBhY3RpdmVTdGF0ZTpudW1iZXIgLyp1aW50Ki8gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0dmFyIGF1dG9wbGF5OmJvb2xlYW4gPSAoIHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpID09IDEgKTtcblx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblxuXHRcdHZhciByZXR1cm5lZEFycmF5OkFycmF5PGFueT47XG5cdFx0dmFyIHRhcmdldE1lc2hlczpBcnJheTxNZXNoPiA9IG5ldyBBcnJheTxNZXNoPigpO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IG1lc2hBZHJlc3Nlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKG1lc2hBZHJlc3Nlc1tpXSwgW0Fzc2V0VHlwZS5NRVNIXSk7XG5cdFx0XHRpZiAocmV0dXJuZWRBcnJheVswXSlcblx0XHRcdFx0dGFyZ2V0TWVzaGVzLnB1c2goPE1lc2g+IHJldHVybmVkQXJyYXlbMV0pO1xuXHRcdH1cblx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQoYW5pbVNldEJsb2NrQWRyZXNzLCBbQXNzZXRUeXBlLkFOSU1BVElPTl9TRVRdKTtcblx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pIHtcblx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBBbmltYXRpb25TZXQgKCBcIiArIGFuaW1TZXRCbG9ja0FkcmVzcyArIFwiICkgZm9yIHRoaXMgQW5pbWF0b3JcIik7O1xuXHRcdFx0cmV0dXJuXG5cdFx0fVxuXHRcdHRhcmdldEFuaW1hdGlvblNldCA9IDxBbmltYXRpb25TZXRCYXNlPiByZXR1cm5lZEFycmF5WzFdO1xuXHRcdHZhciB0aGlzQW5pbWF0b3I6QW5pbWF0b3JCYXNlO1xuXHRcdGlmICh0eXBlID09IDEpIHtcblxuXHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKHByb3BzLmdldCgxLCAwKSwgW0Fzc2V0VHlwZS5TS0VMRVRPTl0pO1xuXHRcdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKSB7XG5cdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBTa2VsZXRvbiAoIFwiICsgcHJvcHMuZ2V0KDEsIDApICsgXCIgKSBmb3IgdGhpcyBBbmltYXRvclwiKTtcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHR9XG5cdFx0XHR0aGlzQW5pbWF0b3IgPSBuZXcgU2tlbGV0b25BbmltYXRvcig8U2tlbGV0b25BbmltYXRpb25TZXQ+IHRhcmdldEFuaW1hdGlvblNldCwgPFNrZWxldG9uPiByZXR1cm5lZEFycmF5WzFdKTtcblxuXHRcdH0gZWxzZSBpZiAodHlwZSA9PSAyKVxuXHRcdFx0dGhpc0FuaW1hdG9yID0gbmV3IFZlcnRleEFuaW1hdG9yKDxWZXJ0ZXhBbmltYXRpb25TZXQ+IHRhcmdldEFuaW1hdGlvblNldCk7XG5cblx0XHR0aGlzLl9wRmluYWxpemVBc3NldCh0aGlzQW5pbWF0b3IsIG5hbWUpO1xuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gdGhpc0FuaW1hdG9yO1xuXHRcdGZvciAoaSA9IDA7IGkgPCB0YXJnZXRNZXNoZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmICh0eXBlID09IDEpXG5cdFx0XHRcdHRhcmdldE1lc2hlc1tpXS5hbmltYXRvciA9ICg8U2tlbGV0b25BbmltYXRvcj4gdGhpc0FuaW1hdG9yKTtcblx0XHRcdGlmICh0eXBlID09IDIpXG5cdFx0XHRcdHRhcmdldE1lc2hlc1tpXS5hbmltYXRvciA9ICg8VmVydGV4QW5pbWF0b3I+IHRoaXNBbmltYXRvcik7XG5cblx0XHR9XG5cdFx0aWYgKHRoaXMuX2RlYnVnKVxuXHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBBbmltYXRvcjogTmFtZSA9IFwiICsgbmFtZSk7XG5cdH1cblx0XG5cdC8vIHRoaXMgZnVuY3Rpb25zIHJlYWRzIGFuZCBjcmVhdGVzIGEgRWZmZWN0TWV0aG9kXG5cdHByaXZhdGUgcGFyc2VTaGFyZWRNZXRob2RMaXN0KGJsb2NrSUQ6bnVtYmVyKTpFZmZlY3RNZXRob2RCYXNlXG5cdHtcblxuXHRcdHZhciBtZXRob2RUeXBlOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHR2YXIgZWZmZWN0TWV0aG9kUmV0dXJuOkVmZmVjdE1ldGhvZEJhc2U7XG5cblx0XHR2YXIgcHJvcHM6QVdEUHJvcGVydGllcyA9IHRoaXMucGFyc2VQcm9wZXJ0aWVzKHsxOkFXRFBhcnNlci5CQUREUiwgMjpBV0RQYXJzZXIuQkFERFIsIDM6QVdEUGFyc2VyLkJBRERSLCAxMDE6dGhpcy5fcHJvcHNOclR5cGUsIDEwMjp0aGlzLl9wcm9wc05yVHlwZSwgMTAzOnRoaXMuX3Byb3BzTnJUeXBlLCAxMDQ6dGhpcy5fcHJvcHNOclR5cGUsIDEwNTp0aGlzLl9wcm9wc05yVHlwZSwgMTA2OnRoaXMuX3Byb3BzTnJUeXBlLCAxMDc6dGhpcy5fcHJvcHNOclR5cGUsIDIwMTpBV0RQYXJzZXIuVUlOVDMyLCAyMDI6QVdEUGFyc2VyLlVJTlQzMiwgMzAxOkFXRFBhcnNlci5VSU5UMTYsIDMwMjpBV0RQYXJzZXIuVUlOVDE2LCA0MDE6QVdEUGFyc2VyLlVJTlQ4LCA0MDI6QVdEUGFyc2VyLlVJTlQ4LCA2MDE6QVdEUGFyc2VyLkNPTE9SLCA2MDI6QVdEUGFyc2VyLkNPTE9SLCA3MDE6QVdEUGFyc2VyLkJPT0wsIDcwMjpBV0RQYXJzZXIuQk9PTH0pO1xuXHRcdHZhciB0YXJnZXRJRDpudW1iZXI7XG5cdFx0dmFyIHJldHVybmVkQXJyYXk6QXJyYXk8YW55PjtcblxuXHRcdHN3aXRjaCAobWV0aG9kVHlwZSkge1xuXHRcdFx0Ly8gRWZmZWN0IE1ldGhvZHNcblx0XHRcdGNhc2UgNDAxOiAvL0NvbG9yTWF0cml4XG5cdFx0XHRcdGVmZmVjdE1ldGhvZFJldHVybiA9IG5ldyBFZmZlY3RDb2xvck1hdHJpeE1ldGhvZChwcm9wcy5nZXQoMTAxLCBuZXcgQXJyYXkoMCwgMCwgMCwgMSwgMSwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMSkpKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDQwMjogLy9Db2xvclRyYW5zZm9ybVxuXHRcdFx0XHRlZmZlY3RNZXRob2RSZXR1cm4gPSBuZXcgRWZmZWN0Q29sb3JUcmFuc2Zvcm1NZXRob2QoKTtcblx0XHRcdFx0dmFyIG9mZkNvbDpudW1iZXIgLyp1aW50Ki8gPSBwcm9wcy5nZXQoNjAxLCAweDAwMDAwMDAwKTtcblx0XHRcdFx0KDxFZmZlY3RDb2xvclRyYW5zZm9ybU1ldGhvZD4gZWZmZWN0TWV0aG9kUmV0dXJuKS5jb2xvclRyYW5zZm9ybSA9IG5ldyBDb2xvclRyYW5zZm9ybShwcm9wcy5nZXQoMTAyLCAxKSwgcHJvcHMuZ2V0KDEwMywgMSksIHByb3BzLmdldCgxMDQsIDEpLCBwcm9wcy5nZXQoMTAxLCAxKSwgKChvZmZDb2wgPj4gMTYpICYgMHhGRiksICgob2ZmQ29sID4+IDgpICYgMHhGRiksIChvZmZDb2wgJiAweEZGKSwgKChvZmZDb2wgPj4gMjQpICYgMHhGRikpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNDAzOiAvL0Vudk1hcFxuXG5cdFx0XHRcdHRhcmdldElEID0gcHJvcHMuZ2V0KDEsIDApO1xuXHRcdFx0XHRjb25zb2xlLmxvZygnRU5WIE1BUCcsIHRhcmdldElEKTtcblxuXG5cdFx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRCh0YXJnZXRJRCwgWyBBc3NldFR5cGUuVEVYVFVSRSBdLCBcIkN1YmVUZXh0dXJlXCIpO1xuXHRcdFx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pXG5cdFx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIEVudk1hcCAoSUQgPSBcIiArIHRhcmdldElEICsgXCIgKSBmb3IgdGhpcyBFbnZNYXBNZXRob2RcIik7XG5cdFx0XHRcdGVmZmVjdE1ldGhvZFJldHVybiA9IG5ldyBFZmZlY3RFbnZNYXBNZXRob2QoPEN1YmVUZXh0dXJlQmFzZT4gcmV0dXJuZWRBcnJheVsxXSwgPG51bWJlcj4gcHJvcHMuZ2V0KDEwMSwgMSkpO1xuXHRcdFx0XHR0YXJnZXRJRCA9IHByb3BzLmdldCgyLCAwKTtcblx0XHRcdFx0aWYgKHRhcmdldElEID4gMCkge1xuXHRcdFx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRCh0YXJnZXRJRCwgW0Fzc2V0VHlwZS5URVhUVVJFXSk7XG5cdFx0XHRcdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKVxuXHRcdFx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIE1hc2stdGV4dHVyZSAoSUQgPSBcIiArIHRhcmdldElEICsgXCIgKSBmb3IgdGhpcyBFbnZNYXBNZXRob2RcIik7XG5cblx0XHRcdFx0XHQvLyBUb2RvOiB0ZXN0IG1hc2sgd2l0aCBFbnZNYXBNZXRob2Rcblx0XHRcdFx0XHQvLyg8RW52TWFwTWV0aG9kPiBlZmZlY3RNZXRob2RSZXR1cm4pLm1hc2sgPSA8VGV4dHVyZTJEQmFzZT4gcmV0dXJuZWRBcnJheVsxXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNDA0OiAvL0xpZ2h0TWFwTWV0aG9kXG5cdFx0XHRcdHRhcmdldElEID0gcHJvcHMuZ2V0KDEsIDApO1xuXHRcdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQodGFyZ2V0SUQsIFtBc3NldFR5cGUuVEVYVFVSRV0pO1xuXHRcdFx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pXG5cdFx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIExpZ2h0TWFwIChJRCA9IFwiICsgdGFyZ2V0SUQgKyBcIiApIGZvciB0aGlzIExpZ2h0TWFwTWV0aG9kXCIpO1xuXHRcdFx0XHRlZmZlY3RNZXRob2RSZXR1cm4gPSBuZXcgRWZmZWN0TGlnaHRNYXBNZXRob2QocmV0dXJuZWRBcnJheVsxXSwgdGhpcy5ibGVuZE1vZGVEaWNbcHJvcHMuZ2V0KDQwMSwgMTApXSk7IC8vdXNlc2Vjb25kYXJ5VVYgbm90IHNldFxuXHRcdFx0XHRicmVhaztcblx0XHRcdC8vXHRcdFx0XHRjYXNlIDQwNTogLy9Qcm9qZWN0aXZlVGV4dHVyZU1ldGhvZFxuXHRcdFx0Ly9cdFx0XHRcdFx0dGFyZ2V0SUQgPSBwcm9wcy5nZXQoMSwgMCk7XG5cdFx0XHQvL1x0XHRcdFx0XHRyZXR1cm5lZEFycmF5ID0gZ2V0QXNzZXRCeUlEKHRhcmdldElELCBbQXNzZXRUeXBlLlRFWFRVUkVfUFJPSkVDVE9SXSk7XG5cdFx0XHQvL1x0XHRcdFx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pXG5cdFx0XHQvL1x0XHRcdFx0XHRcdF9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgVGV4dHVyZVByb2plY3RvciAoSUQgPSBcIiArIHRhcmdldElEICsgXCIgKSBmb3IgdGhpcyBQcm9qZWN0aXZlVGV4dHVyZU1ldGhvZFwiKTtcblx0XHRcdC8vXHRcdFx0XHRcdGVmZmVjdE1ldGhvZFJldHVybiA9IG5ldyBQcm9qZWN0aXZlVGV4dHVyZU1ldGhvZChyZXR1cm5lZEFycmF5WzFdLCBibGVuZE1vZGVEaWNbcHJvcHMuZ2V0KDQwMSwgMTApXSk7XG5cdFx0XHQvL1x0XHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNDA2OiAvL1JpbUxpZ2h0TWV0aG9kXG5cdFx0XHRcdGVmZmVjdE1ldGhvZFJldHVybiA9IG5ldyBFZmZlY3RSaW1MaWdodE1ldGhvZChwcm9wcy5nZXQoNjAxLCAweGZmZmZmZiksIHByb3BzLmdldCgxMDEsIDAuNCksIHByb3BzLmdldCgxMDEsIDIpKTsgLy9ibGVuZE1vZGVcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDQwNzogLy9BbHBoYU1hc2tNZXRob2Rcblx0XHRcdFx0dGFyZ2V0SUQgPSBwcm9wcy5nZXQoMSwgMCk7XG5cdFx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRCh0YXJnZXRJRCwgW0Fzc2V0VHlwZS5URVhUVVJFXSk7XG5cdFx0XHRcdGlmICghcmV0dXJuZWRBcnJheVswXSlcblx0XHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgQWxwaGEtdGV4dHVyZSAoSUQgPSBcIiArIHRhcmdldElEICsgXCIgKSBmb3IgdGhpcyBBbHBoYU1hc2tNZXRob2RcIik7XG5cdFx0XHRcdGVmZmVjdE1ldGhvZFJldHVybiA9IG5ldyBFZmZlY3RBbHBoYU1hc2tNZXRob2QocmV0dXJuZWRBcnJheVsxXSwgcHJvcHMuZ2V0KDcwMSwgZmFsc2UpKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHQvL1x0XHRcdFx0Y2FzZSA0MDg6IC8vUmVmcmFjdGlvbkVudk1hcE1ldGhvZFxuXHRcdFx0Ly9cdFx0XHRcdFx0dGFyZ2V0SUQgPSBwcm9wcy5nZXQoMSwgMCk7XG5cdFx0XHQvL1x0XHRcdFx0XHRyZXR1cm5lZEFycmF5ID0gZ2V0QXNzZXRCeUlEKHRhcmdldElELCBbQXNzZXRUeXBlLlRFWFRVUkVdLCBcIkN1YmVUZXh0dXJlXCIpO1xuXHRcdFx0Ly9cdFx0XHRcdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKVxuXHRcdFx0Ly9cdFx0XHRcdFx0XHRfYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIEVudk1hcCAoSUQgPSBcIiArIHRhcmdldElEICsgXCIgKSBmb3IgdGhpcyBSZWZyYWN0aW9uRW52TWFwTWV0aG9kXCIpO1xuXHRcdFx0Ly9cdFx0XHRcdFx0ZWZmZWN0TWV0aG9kUmV0dXJuID0gbmV3IFJlZnJhY3Rpb25FbnZNYXBNZXRob2QocmV0dXJuZWRBcnJheVsxXSwgcHJvcHMuZ2V0KDEwMSwgMC4xKSwgcHJvcHMuZ2V0KDEwMiwgMC4wMSksIHByb3BzLmdldCgxMDMsIDAuMDEpLCBwcm9wcy5nZXQoMTA0LCAwLjAxKSk7XG5cdFx0XHQvL1x0XHRcdFx0XHRSZWZyYWN0aW9uRW52TWFwTWV0aG9kKGVmZmVjdE1ldGhvZFJldHVybikuYWxwaGEgPSBwcm9wcy5nZXQoMTA0LCAxKTtcblx0XHRcdC8vXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0Ly9cdFx0XHRcdGNhc2UgNDA5OiAvL091dGxpbmVNZXRob2Rcblx0XHRcdC8vXHRcdFx0XHRcdGVmZmVjdE1ldGhvZFJldHVybiA9IG5ldyBPdXRsaW5lTWV0aG9kKHByb3BzLmdldCg2MDEsIDB4MDAwMDAwMDApLCBwcm9wcy5nZXQoMTAxLCAxKSwgcHJvcHMuZ2V0KDcwMSwgdHJ1ZSksIHByb3BzLmdldCg3MDIsIGZhbHNlKSk7XG5cdFx0XHQvL1x0XHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNDEwOiAvL0ZyZXNuZWxFbnZNYXBNZXRob2Rcblx0XHRcdFx0dGFyZ2V0SUQgPSBwcm9wcy5nZXQoMSwgMCk7XG5cdFx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRCh0YXJnZXRJRCwgW0Fzc2V0VHlwZS5URVhUVVJFXSwgXCJDdWJlVGV4dHVyZVwiKTtcblx0XHRcdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKVxuXHRcdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBFbnZNYXAgKElEID0gXCIgKyB0YXJnZXRJRCArIFwiICkgZm9yIHRoaXMgRnJlc25lbEVudk1hcE1ldGhvZFwiKTtcblx0XHRcdFx0ZWZmZWN0TWV0aG9kUmV0dXJuID0gbmV3IEVmZmVjdEZyZXNuZWxFbnZNYXBNZXRob2QocmV0dXJuZWRBcnJheVsxXSwgcHJvcHMuZ2V0KDEwMSwgMSkpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNDExOiAvL0ZvZ01ldGhvZFxuXHRcdFx0XHRlZmZlY3RNZXRob2RSZXR1cm4gPSBuZXcgRWZmZWN0Rm9nTWV0aG9kKHByb3BzLmdldCgxMDEsIDApLCBwcm9wcy5nZXQoMTAyLCAxMDAwKSwgcHJvcHMuZ2V0KDYwMSwgMHg4MDgwODApKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHR9XG5cdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0cmV0dXJuIGVmZmVjdE1ldGhvZFJldHVybjtcblxuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZVVzZXJBdHRyaWJ1dGVzKCk6T2JqZWN0XG5cdHtcblx0XHR2YXIgYXR0cmlidXRlczpPYmplY3Q7XG5cdFx0dmFyIGxpc3RfbGVuOm51bWJlcjtcblx0XHR2YXIgYXR0aWJ1dGVDbnQ6bnVtYmVyO1xuXG5cdFx0bGlzdF9sZW4gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXG5cdFx0aWYgKGxpc3RfbGVuID4gMCkge1xuXG5cdFx0XHR2YXIgbGlzdF9lbmQ6bnVtYmVyO1xuXG5cdFx0XHRhdHRyaWJ1dGVzID0ge307XG5cblx0XHRcdGxpc3RfZW5kID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiArIGxpc3RfbGVuO1xuXG5cdFx0XHR3aGlsZSAodGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiA8IGxpc3RfZW5kKSB7XG5cdFx0XHRcdHZhciBuc19pZDpudW1iZXI7XG5cdFx0XHRcdHZhciBhdHRyX2tleTpzdHJpbmc7XG5cdFx0XHRcdHZhciBhdHRyX3R5cGU6bnVtYmVyO1xuXHRcdFx0XHR2YXIgYXR0cl9sZW46bnVtYmVyO1xuXHRcdFx0XHR2YXIgYXR0cl92YWw6YW55O1xuXG5cdFx0XHRcdC8vIFRPRE86IFByb3Blcmx5IHRlbmQgdG8gbmFtZXNwYWNlcyBpbiBhdHRyaWJ1dGVzXG5cdFx0XHRcdG5zX2lkID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRCeXRlKCk7XG5cdFx0XHRcdGF0dHJfa2V5ID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXHRcdFx0XHRhdHRyX3R5cGUgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHRcdFx0YXR0cl9sZW4gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXG5cdFx0XHRcdGlmICgodGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiArIGF0dHJfbGVuKSA+IGxpc3RfZW5kKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCIgICAgICAgICAgIEVycm9yIGluIHJlYWRpbmcgYXR0cmlidXRlICMgXCIgKyBhdHRpYnV0ZUNudCArIFwiID0gc2tpcHBlZCB0byBlbmQgb2YgYXR0cmlidXRlLWxpc3RcIik7XG5cdFx0XHRcdFx0dGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiA9IGxpc3RfZW5kO1xuXHRcdFx0XHRcdHJldHVybiBhdHRyaWJ1dGVzO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0c3dpdGNoIChhdHRyX3R5cGUpIHtcblx0XHRcdFx0XHRjYXNlIEFXRFBhcnNlci5BV0RTVFJJTkc6XG5cdFx0XHRcdFx0XHRhdHRyX3ZhbCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVURkJ5dGVzKGF0dHJfbGVuKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgQVdEUGFyc2VyLklOVDg6XG5cdFx0XHRcdFx0XHRhdHRyX3ZhbCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZEJ5dGUoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgQVdEUGFyc2VyLklOVDE2OlxuXHRcdFx0XHRcdFx0YXR0cl92YWwgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRTaG9ydCgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuSU5UMzI6XG5cdFx0XHRcdFx0XHRhdHRyX3ZhbCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZEludCgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuQk9PTDpcblx0XHRcdFx0XHRjYXNlIEFXRFBhcnNlci5VSU5UODpcblx0XHRcdFx0XHRcdGF0dHJfdmFsID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRCeXRlKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIEFXRFBhcnNlci5VSU5UMTY6XG5cdFx0XHRcdFx0XHRhdHRyX3ZhbCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgQVdEUGFyc2VyLlVJTlQzMjpcblx0XHRcdFx0XHRjYXNlIEFXRFBhcnNlci5CQUREUjpcblx0XHRcdFx0XHRcdGF0dHJfdmFsID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgQVdEUGFyc2VyLkZMT0FUMzI6XG5cdFx0XHRcdFx0XHRhdHRyX3ZhbCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZEZsb2F0KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIEFXRFBhcnNlci5GTE9BVDY0OlxuXHRcdFx0XHRcdFx0YXR0cl92YWwgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWREb3VibGUoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRhdHRyX3ZhbCA9ICd1bmltcGxlbWVudGVkIGF0dHJpYnV0ZSB0eXBlICcgKyBhdHRyX3R5cGU7XG5cdFx0XHRcdFx0XHR0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uICs9IGF0dHJfbGVuO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcImF0dHJpYnV0ZSA9IG5hbWU6IFwiICsgYXR0cl9rZXkgKyBcIiAgLyB2YWx1ZSA9IFwiICsgYXR0cl92YWwpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YXR0cmlidXRlc1thdHRyX2tleV0gPSBhdHRyX3ZhbDtcblx0XHRcdFx0YXR0aWJ1dGVDbnQgKz0gMTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gYXR0cmlidXRlcztcblx0fVxuXG5cdHByaXZhdGUgcGFyc2VQcm9wZXJ0aWVzKGV4cGVjdGVkOk9iamVjdCk6QVdEUHJvcGVydGllc1xuXHR7XG5cdFx0dmFyIGxpc3RfZW5kOm51bWJlcjtcblx0XHR2YXIgbGlzdF9sZW46bnVtYmVyO1xuXHRcdHZhciBwcm9wZXJ0eUNudDpudW1iZXIgPSAwO1xuXHRcdHZhciBwcm9wczpBV0RQcm9wZXJ0aWVzID0gbmV3IEFXRFByb3BlcnRpZXMoKTtcblxuXHRcdGxpc3RfbGVuID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRsaXN0X2VuZCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gKyBsaXN0X2xlbjtcblxuXHRcdGlmIChleHBlY3RlZCkge1xuXG5cdFx0XHR3aGlsZSAodGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiA8IGxpc3RfZW5kKSB7XG5cdFx0XHRcdHZhciBsZW46bnVtYmVyO1xuXHRcdFx0XHR2YXIga2V5Om51bWJlcjtcblx0XHRcdFx0dmFyIHR5cGU6bnVtYmVyO1xuXG5cdFx0XHRcdGtleSA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRcdFx0bGVuID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblxuXHRcdFx0XHRpZiAoKHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gKyBsZW4pID4gbGlzdF9lbmQpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIiAgICAgICAgICAgRXJyb3IgaW4gcmVhZGluZyBwcm9wZXJ0eSAjIFwiICsgcHJvcGVydHlDbnQgKyBcIiA9IHNraXBwZWQgdG8gZW5kIG9mIHByb3BlcnRpZS1saXN0XCIpO1xuXHRcdFx0XHRcdHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPSBsaXN0X2VuZDtcblx0XHRcdFx0XHRyZXR1cm4gcHJvcHM7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoZXhwZWN0ZWQuaGFzT3duUHJvcGVydHkoa2V5LnRvU3RyaW5nKCkpKSB7XG5cdFx0XHRcdFx0dHlwZSA9IGV4cGVjdGVkW2tleV07XG5cdFx0XHRcdFx0cHJvcHMuc2V0KGtleSwgdGhpcy5wYXJzZUF0dHJWYWx1ZSh0eXBlLCBsZW4pKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uICs9IGxlbjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHByb3BlcnR5Q250ICs9IDE7XG5cblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiA9IGxpc3RfZW5kO1xuXHRcdH1cblxuXHRcdHJldHVybiBwcm9wcztcblxuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZUF0dHJWYWx1ZSh0eXBlOm51bWJlciwgbGVuOm51bWJlcik6YW55XG5cdHtcblx0XHR2YXIgZWxlbV9sZW46bnVtYmVyO1xuXHRcdHZhciByZWFkX2Z1bmM6RnVuY3Rpb247XG5cblx0XHRzd2l0Y2ggKHR5cGUpIHtcblxuXHRcdFx0Y2FzZSBBV0RQYXJzZXIuQk9PTDpcblx0XHRcdGNhc2UgQVdEUGFyc2VyLklOVDg6XG5cdFx0XHRcdGVsZW1fbGVuID0gMTtcblx0XHRcdFx0cmVhZF9mdW5jID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkQnl0ZTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgQVdEUGFyc2VyLklOVDE2OlxuXHRcdFx0XHRlbGVtX2xlbiA9IDI7XG5cdFx0XHRcdHJlYWRfZnVuYyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFNob3J0O1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBBV0RQYXJzZXIuSU5UMzI6XG5cdFx0XHRcdGVsZW1fbGVuID0gNDtcblx0XHRcdFx0cmVhZF9mdW5jID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkSW50O1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBBV0RQYXJzZXIuVUlOVDg6XG5cdFx0XHRcdGVsZW1fbGVuID0gMTtcblx0XHRcdFx0cmVhZF9mdW5jID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRCeXRlO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBBV0RQYXJzZXIuVUlOVDE2OlxuXHRcdFx0XHRlbGVtX2xlbiA9IDI7XG5cdFx0XHRcdHJlYWRfZnVuYyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQ7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIEFXRFBhcnNlci5VSU5UMzI6XG5cdFx0XHRjYXNlIEFXRFBhcnNlci5DT0xPUjpcblx0XHRcdGNhc2UgQVdEUGFyc2VyLkJBRERSOlxuXHRcdFx0XHRlbGVtX2xlbiA9IDQ7XG5cdFx0XHRcdHJlYWRfZnVuYyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50O1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBBV0RQYXJzZXIuRkxPQVQzMjpcblx0XHRcdFx0ZWxlbV9sZW4gPSA0O1xuXHRcdFx0XHRyZWFkX2Z1bmMgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRGbG9hdDtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgQVdEUGFyc2VyLkZMT0FUNjQ6XG5cdFx0XHRcdGVsZW1fbGVuID0gODtcblx0XHRcdFx0cmVhZF9mdW5jID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkRG91YmxlO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBBV0RQYXJzZXIuQVdEU1RSSU5HOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVVRGQnl0ZXMobGVuKTtcblxuXHRcdFx0Y2FzZSBBV0RQYXJzZXIuVkVDVE9SMngxOlxuXHRcdFx0Y2FzZSBBV0RQYXJzZXIuVkVDVE9SM3gxOlxuXHRcdFx0Y2FzZSBBV0RQYXJzZXIuVkVDVE9SNHgxOlxuXHRcdFx0Y2FzZSBBV0RQYXJzZXIuTVRYM3gyOlxuXHRcdFx0Y2FzZSBBV0RQYXJzZXIuTVRYM3gzOlxuXHRcdFx0Y2FzZSBBV0RQYXJzZXIuTVRYNHgzOlxuXHRcdFx0Y2FzZSBBV0RQYXJzZXIuTVRYNHg0OlxuXHRcdFx0XHRlbGVtX2xlbiA9IDg7XG5cdFx0XHRcdHJlYWRfZnVuYyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZERvdWJsZTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHR9XG5cblx0XHRpZiAoZWxlbV9sZW4gPCBsZW4pIHtcblx0XHRcdHZhciBsaXN0OkFycmF5PGFueT4gPSBbXTtcblx0XHRcdHZhciBudW1fcmVhZDpudW1iZXIgPSAwO1xuXHRcdFx0dmFyIG51bV9lbGVtczpudW1iZXIgPSBsZW4vZWxlbV9sZW47XG5cblx0XHRcdHdoaWxlIChudW1fcmVhZCA8IG51bV9lbGVtcykge1xuXHRcdFx0XHRsaXN0LnB1c2gocmVhZF9mdW5jLmFwcGx5KHRoaXMuX25ld0Jsb2NrQnl0ZXMpKTsgLy8gbGlzdC5wdXNoKHJlYWRfZnVuYygpKTtcblx0XHRcdFx0bnVtX3JlYWQrKztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGxpc3Q7XG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0dmFyIHZhbDphbnkgPSByZWFkX2Z1bmMuYXBwbHkodGhpcy5fbmV3QmxvY2tCeXRlcyk7Ly9yZWFkX2Z1bmMoKTtcblx0XHRcdHJldHVybiB2YWw7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZUhlYWRlcigpOnZvaWRcblx0e1xuXHRcdHZhciBmbGFnczpudW1iZXI7XG5cdFx0dmFyIGJvZHlfbGVuOm51bWJlcjtcblxuXHRcdHRoaXMuX2J5dGVEYXRhLnBvc2l0aW9uID0gMzsgLy8gU2tpcCBtYWdpYyBzdHJpbmcgYW5kIHBhcnNlIHZlcnNpb25cblxuXHRcdHRoaXMuX3ZlcnNpb25bMF0gPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRCeXRlKCk7XG5cdFx0dGhpcy5fdmVyc2lvblsxXSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblxuXHRcdGZsYWdzID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkU2hvcnQoKTsgLy8gUGFyc2UgYml0IGZsYWdzXG5cblx0XHR0aGlzLl9zdHJlYW1pbmcgPSBCaXRGbGFncy50ZXN0KGZsYWdzLCBCaXRGbGFncy5GTEFHMSk7XG5cblx0XHRpZiAoKHRoaXMuX3ZlcnNpb25bMF0gPT0gMikgJiYgKHRoaXMuX3ZlcnNpb25bMV0gPT0gMSkpIHtcblx0XHRcdHRoaXMuX2FjY3VyYWN5TWF0cml4ID0gQml0RmxhZ3MudGVzdChmbGFncywgQml0RmxhZ3MuRkxBRzIpO1xuXHRcdFx0dGhpcy5fYWNjdXJhY3lHZW8gPSBCaXRGbGFncy50ZXN0KGZsYWdzLCBCaXRGbGFncy5GTEFHMyk7XG5cdFx0XHR0aGlzLl9hY2N1cmFjeVByb3BzID0gQml0RmxhZ3MudGVzdChmbGFncywgQml0RmxhZ3MuRkxBRzQpO1xuXHRcdH1cblxuXHRcdC8vIGlmIHdlIHNldCBfYWNjdXJhY3lPbkJsb2NrcywgdGhlIHByZWNpc2lvbi12YWx1ZXMgYXJlIHJlYWQgZnJvbSBlYWNoIGJsb2NrLWhlYWRlci5cblxuXHRcdC8vIHNldCBzdG9yYWdlUHJlY2lzaW9uIHR5cGVzXG5cdFx0dGhpcy5fZ2VvTnJUeXBlID0gQVdEUGFyc2VyLkZMT0FUMzI7XG5cblx0XHRpZiAodGhpcy5fYWNjdXJhY3lHZW8pIHtcblx0XHRcdHRoaXMuX2dlb05yVHlwZSA9IEFXRFBhcnNlci5GTE9BVDY0O1xuXHRcdH1cblxuXHRcdHRoaXMuX21hdHJpeE5yVHlwZSA9IEFXRFBhcnNlci5GTE9BVDMyO1xuXG5cdFx0aWYgKHRoaXMuX2FjY3VyYWN5TWF0cml4KSB7XG5cdFx0XHR0aGlzLl9tYXRyaXhOclR5cGUgPSBBV0RQYXJzZXIuRkxPQVQ2NDtcblx0XHR9XG5cblx0XHR0aGlzLl9wcm9wc05yVHlwZSA9IEFXRFBhcnNlci5GTE9BVDMyO1xuXG5cdFx0aWYgKHRoaXMuX2FjY3VyYWN5UHJvcHMpIHtcblx0XHRcdHRoaXMuX3Byb3BzTnJUeXBlID0gQVdEUGFyc2VyLkZMT0FUNjQ7XG5cdFx0fVxuXG5cdFx0dGhpcy5fY29tcHJlc3Npb24gPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRCeXRlKCk7IC8vIGNvbXByZXNzaW9uXG5cblx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiSW1wb3J0IEFXREZpbGUgb2YgdmVyc2lvbiA9IFwiICsgdGhpcy5fdmVyc2lvblswXSArIFwiIC0gXCIgKyB0aGlzLl92ZXJzaW9uWzFdKTtcblx0XHRcdGNvbnNvbGUubG9nKFwiR2xvYmFsIFNldHRpbmdzID0gQ29tcHJlc3Npb24gPSBcIiArIHRoaXMuX2NvbXByZXNzaW9uICsgXCIgfCBTdHJlYW1pbmcgPSBcIiArIHRoaXMuX3N0cmVhbWluZyArIFwiIHwgTWF0cml4LVByZWNpc2lvbiA9IFwiICsgdGhpcy5fYWNjdXJhY3lNYXRyaXggKyBcIiB8IEdlb21ldHJ5LVByZWNpc2lvbiA9IFwiICsgdGhpcy5fYWNjdXJhY3lHZW8gKyBcIiB8IFByb3BlcnRpZXMtUHJlY2lzaW9uID0gXCIgKyB0aGlzLl9hY2N1cmFjeVByb3BzKTtcblx0XHR9XG5cblx0XHQvLyBDaGVjayBmaWxlIGludGVncml0eVxuXHRcdGJvZHlfbGVuID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0aWYgKCF0aGlzLl9zdHJlYW1pbmcgJiYgYm9keV9sZW4gIT0gdGhpcy5fYnl0ZURhdGEuZ2V0Qnl0ZXNBdmFpbGFibGUoKSkge1xuXHRcdFx0dGhpcy5fcERpZVdpdGhFcnJvcignQVdEMiBib2R5IGxlbmd0aCBkb2VzIG5vdCBtYXRjaCBoZWFkZXIgaW50ZWdyaXR5IGZpZWxkJyk7XG5cdFx0fVxuXG5cdH1cblx0Ly8gSGVscGVyIC0gZnVuY3Rpb25zXG5cdHByaXZhdGUgZ2V0VVZGb3JWZXJ0ZXhBbmltYXRpb24obWVzaElEOm51bWJlciAvKnVpbnQqLyk6QXJyYXk8QXJyYXk8bnVtYmVyPj5cblx0e1xuXHRcdGlmICh0aGlzLl9ibG9ja3NbbWVzaElEXS5kYXRhIGluc3RhbmNlb2YgTWVzaClcblx0XHRtZXNoSUQgPSB0aGlzLl9ibG9ja3NbbWVzaElEXS5nZW9JRDtcblx0XHRpZiAodGhpcy5fYmxvY2tzW21lc2hJRF0udXZzRm9yVmVydGV4QW5pbWF0aW9uKVxuXHRcdFx0cmV0dXJuIHRoaXMuX2Jsb2Nrc1ttZXNoSURdLnV2c0ZvclZlcnRleEFuaW1hdGlvbjtcblx0XHR2YXIgZ2VvbWV0cnk6R2VvbWV0cnkgPSAoPEdlb21ldHJ5PiB0aGlzLl9ibG9ja3NbbWVzaElEXS5kYXRhKTtcblx0XHR2YXIgZ2VvQ250Om51bWJlciAvKmludCovID0gMDtcblx0XHR2YXIgdWQ6QXJyYXk8bnVtYmVyPjtcblx0XHR2YXIgdVN0cmlkZTpudW1iZXIgLyp1aW50Ki87XG5cdFx0dmFyIHVPZmZzOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgbnVtUG9pbnRzOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgaTpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgbmV3VXZzOkFycmF5PG51bWJlcj47XG5cdFx0dmFyIHN1Yl9nZW9tOlRyaWFuZ2xlU3ViR2VvbWV0cnk7XG5cdFx0dGhpcy5fYmxvY2tzW21lc2hJRF0udXZzRm9yVmVydGV4QW5pbWF0aW9uID0gbmV3IEFycmF5PEFycmF5PG51bWJlcj4+KCk7XG5cdFx0d2hpbGUgKGdlb0NudCA8IGdlb21ldHJ5LnN1Ykdlb21ldHJpZXMubGVuZ3RoKSB7XG5cdFx0XHRuZXdVdnMgPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuXHRcdFx0c3ViX2dlb20gPSA8VHJpYW5nbGVTdWJHZW9tZXRyeT4gZ2VvbWV0cnkuc3ViR2VvbWV0cmllc1tnZW9DbnRdO1xuXHRcdFx0bnVtUG9pbnRzID0gc3ViX2dlb20ubnVtVmVydGljZXM7XG5cdFx0XHR1ZCA9IHN1Yl9nZW9tLnV2cztcblx0XHRcdHVTdHJpZGUgPSBzdWJfZ2VvbS5nZXRTdHJpZGUoVHJpYW5nbGVTdWJHZW9tZXRyeS5VVl9EQVRBKTtcblx0XHRcdHVPZmZzID0gc3ViX2dlb20uZ2V0T2Zmc2V0KFRyaWFuZ2xlU3ViR2VvbWV0cnkuVVZfREFUQSk7XG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgbnVtUG9pbnRzOyBpKyspIHtcblx0XHRcdFx0bmV3VXZzLnB1c2godWRbdU9mZnMgKyBpKnVTdHJpZGUgKyAwXSk7XG5cdFx0XHRcdG5ld1V2cy5wdXNoKHVkW3VPZmZzICsgaSp1U3RyaWRlICsgMV0pO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fYmxvY2tzW21lc2hJRF0udXZzRm9yVmVydGV4QW5pbWF0aW9uLnB1c2gobmV3VXZzKTtcblx0XHRcdGdlb0NudCsrO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fYmxvY2tzW21lc2hJRF0udXZzRm9yVmVydGV4QW5pbWF0aW9uO1xuXHR9XG5cdFxuXHRwcml2YXRlIHBhcnNlVmFyU3RyKCk6c3RyaW5nXG5cdHtcblxuXHRcdHZhciBsZW46bnVtYmVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdHJldHVybiB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVVEZCeXRlcyhsZW4pO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXRBc3NldEJ5SUQoYXNzZXRJRDpudW1iZXIsIGFzc2V0VHlwZXNUb0dldDpBcnJheTxzdHJpbmc+LCBleHRyYVR5cGVJbmZvOnN0cmluZyA9IFwiU2luZ2xlVGV4dHVyZVwiKTpBcnJheTxhbnk+XG5cdHtcblx0XHR2YXIgcmV0dXJuQXJyYXk6QXJyYXk8YW55PiA9IG5ldyBBcnJheTxhbnk+KCk7XG5cdFx0dmFyIHR5cGVDbnQ6bnVtYmVyID0gMDtcblx0XHRpZiAoYXNzZXRJRCA+IDApIHtcblx0XHRcdGlmICh0aGlzLl9ibG9ja3NbYXNzZXRJRF0pIHtcblx0XHRcdFx0aWYgKHRoaXMuX2Jsb2Nrc1thc3NldElEXS5kYXRhKSB7XG5cdFx0XHRcdFx0d2hpbGUgKHR5cGVDbnQgPCBhc3NldFR5cGVzVG9HZXQubGVuZ3RoKSB7XG5cblx0XHRcdFx0XHRcdHZhciBpYXNzZXQ6SUFzc2V0ID0gPElBc3NldD4gdGhpcy5fYmxvY2tzW2Fzc2V0SURdLmRhdGE7XG5cblx0XHRcdFx0XHRcdGlmIChpYXNzZXQuYXNzZXRUeXBlID09IGFzc2V0VHlwZXNUb0dldFt0eXBlQ250XSkge1xuXHRcdFx0XHRcdFx0XHQvL2lmIHRoZSByaWdodCBhc3NldFR5cGUgd2FzIGZvdW5kXG5cdFx0XHRcdFx0XHRcdGlmICgoYXNzZXRUeXBlc1RvR2V0W3R5cGVDbnRdID09IEFzc2V0VHlwZS5URVhUVVJFKSAmJiAoZXh0cmFUeXBlSW5mbyA9PSBcIkN1YmVUZXh0dXJlXCIpKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHRoaXMuX2Jsb2Nrc1thc3NldElEXS5kYXRhIGluc3RhbmNlb2YgSW1hZ2VDdWJlVGV4dHVyZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuQXJyYXkucHVzaCh0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybkFycmF5LnB1c2godGhpcy5fYmxvY2tzW2Fzc2V0SURdLmRhdGEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHJldHVybkFycmF5O1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAoKGFzc2V0VHlwZXNUb0dldFt0eXBlQ250XSA9PSBBc3NldFR5cGUuVEVYVFVSRSkgJiYgKGV4dHJhVHlwZUluZm8gPT0gXCJTaW5nbGVUZXh0dXJlXCIpKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHRoaXMuX2Jsb2Nrc1thc3NldElEXS5kYXRhIGluc3RhbmNlb2YgSW1hZ2VUZXh0dXJlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm5BcnJheS5wdXNoKHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuQXJyYXkucHVzaCh0aGlzLl9ibG9ja3NbYXNzZXRJRF0uZGF0YSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcmV0dXJuQXJyYXk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybkFycmF5LnB1c2godHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuQXJyYXkucHVzaCh0aGlzLl9ibG9ja3NbYXNzZXRJRF0uZGF0YSk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHJldHVybkFycmF5O1xuXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC8vaWYgKChhc3NldFR5cGVzVG9HZXRbdHlwZUNudF0gPT0gQXNzZXRUeXBlLkdFT01FVFJZKSAmJiAoSUFzc2V0KF9ibG9ja3NbYXNzZXRJRF0uZGF0YSkuYXNzZXRUeXBlID09IEFzc2V0VHlwZS5NRVNIKSkge1xuXHRcdFx0XHRcdFx0aWYgKChhc3NldFR5cGVzVG9HZXRbdHlwZUNudF0gPT0gQXNzZXRUeXBlLkdFT01FVFJZKSAmJiAoaWFzc2V0LmFzc2V0VHlwZSA9PSBBc3NldFR5cGUuTUVTSCkpIHtcblxuXHRcdFx0XHRcdFx0XHR2YXIgbWVzaDpNZXNoID0gPE1lc2g+IHRoaXMuX2Jsb2Nrc1thc3NldElEXS5kYXRhXG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuQXJyYXkucHVzaCh0cnVlKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuQXJyYXkucHVzaChtZXNoLmdlb21ldHJ5KTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJldHVybkFycmF5O1xuXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdHR5cGVDbnQrKztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gaWYgdGhlIGhhcyBub3QgcmV0dXJuZWQgYW55dGhpbmcgeWV0LCB0aGUgYXNzZXQgaXMgbm90IGZvdW5kLCBvciB0aGUgZm91bmQgYXNzZXQgaXMgbm90IHRoZSByaWdodCB0eXBlLlxuXHRcdHJldHVybkFycmF5LnB1c2goZmFsc2UpO1xuXHRcdHJldHVybkFycmF5LnB1c2godGhpcy5nZXREZWZhdWx0QXNzZXQoYXNzZXRUeXBlc1RvR2V0WzBdLCBleHRyYVR5cGVJbmZvKSk7XG5cdFx0cmV0dXJuIHJldHVybkFycmF5O1xuXHR9XG5cblx0cHJpdmF0ZSBnZXREZWZhdWx0QXNzZXQoYXNzZXRUeXBlOnN0cmluZywgZXh0cmFUeXBlSW5mbzpzdHJpbmcpOklBc3NldFxuXHR7XG5cdFx0c3dpdGNoICh0cnVlKSB7XG5cdFx0XHRjYXNlIChhc3NldFR5cGUgPT0gQXNzZXRUeXBlLlRFWFRVUkUpOlxuXHRcdFx0XHRpZiAoZXh0cmFUeXBlSW5mbyA9PSBcIkN1YmVUZXh0dXJlXCIpXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0RGVmYXVsdEN1YmVUZXh0dXJlKCk7XG5cdFx0XHRcdGlmIChleHRyYVR5cGVJbmZvID09IFwiU2luZ2xlVGV4dHVyZVwiKVxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmdldERlZmF1bHRUZXh0dXJlKCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAoYXNzZXRUeXBlID09IEFzc2V0VHlwZS5NQVRFUklBTCk6XG5cdFx0XHRcdHJldHVybiB0aGlzLmdldERlZmF1bHRNYXRlcmlhbCgpXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRwcml2YXRlIGdldERlZmF1bHRNYXRlcmlhbCgpOklBc3NldFxuXHR7XG5cdFx0aWYgKCF0aGlzLl9kZWZhdWx0Qml0bWFwTWF0ZXJpYWwpXG5cdFx0XHR0aGlzLl9kZWZhdWx0Qml0bWFwTWF0ZXJpYWwgPSA8VHJpYW5nbGVNZXRob2RNYXRlcmlhbD4gRGVmYXVsdE1hdGVyaWFsTWFuYWdlci5nZXREZWZhdWx0TWF0ZXJpYWwoKTtcblxuXHRcdHJldHVybiAgPElBc3NldD4gIHRoaXMuX2RlZmF1bHRCaXRtYXBNYXRlcmlhbDtcblx0fVxuXG5cdHByaXZhdGUgZ2V0RGVmYXVsdFRleHR1cmUoKTpJQXNzZXRcblx0e1xuXHRcdGlmICghdGhpcy5fZGVmYXVsdFRleHR1cmUpXG5cdFx0XHR0aGlzLl9kZWZhdWx0VGV4dHVyZSA9IERlZmF1bHRNYXRlcmlhbE1hbmFnZXIuZ2V0RGVmYXVsdFRleHR1cmUoKTtcblxuXHRcdHJldHVybiA8SUFzc2V0PiB0aGlzLl9kZWZhdWx0VGV4dHVyZTtcblxuXHR9XG5cblx0cHJpdmF0ZSBnZXREZWZhdWx0Q3ViZVRleHR1cmUoKTpJQXNzZXRcblx0e1xuXHRcdGlmICghdGhpcy5fZGVmYXVsdEN1YmVUZXh0dXJlKSB7XG5cdFx0XHR2YXIgZGVmYXVsdEJpdG1hcDpCaXRtYXBEYXRhID0gRGVmYXVsdE1hdGVyaWFsTWFuYWdlci5jcmVhdGVDaGVja2VyZWRCaXRtYXBEYXRhKCk7XG5cblx0XHRcdHRoaXMuX2RlZmF1bHRDdWJlVGV4dHVyZSA9IG5ldyBCaXRtYXBDdWJlVGV4dHVyZShkZWZhdWx0Qml0bWFwLCBkZWZhdWx0Qml0bWFwLCBkZWZhdWx0Qml0bWFwLCBkZWZhdWx0Qml0bWFwLCBkZWZhdWx0Qml0bWFwLCBkZWZhdWx0Qml0bWFwKTtcblx0XHRcdHRoaXMuX2RlZmF1bHRDdWJlVGV4dHVyZS5uYW1lID0gXCJkZWZhdWx0Q3ViZVRleHR1cmVcIjtcblx0XHR9XG5cblx0XHRyZXR1cm4gPElBc3NldD4gdGhpcy5fZGVmYXVsdEN1YmVUZXh0dXJlO1xuXHR9XG5cblx0cHJpdmF0ZSByZWFkTnVtYmVyKHByZWNpc2lvbjpib29sZWFuID0gZmFsc2UpOm51bWJlclxuXHR7XG5cdFx0aWYgKHByZWNpc2lvbilcblx0XHRcdHJldHVybiB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWREb3VibGUoKTtcblx0XHRyZXR1cm4gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkRmxvYXQoKTtcblxuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZU1hdHJpeDNEKCk6TWF0cml4M0Rcblx0e1xuXHRcdHJldHVybiBuZXcgTWF0cml4M0QodGhpcy5wYXJzZU1hdHJpeDQzUmF3RGF0YSgpKTtcblx0fVxuXG5cdHByaXZhdGUgcGFyc2VNYXRyaXgzMlJhd0RhdGEoKTpBcnJheTxudW1iZXI+XG5cdHtcblx0XHR2YXIgaTpudW1iZXI7XG5cdFx0dmFyIG10eF9yYXc6QXJyYXk8bnVtYmVyPiA9IG5ldyBBcnJheTxudW1iZXI+KDYpO1xuXHRcdGZvciAoaSA9IDA7IGkgPCA2OyBpKyspIHtcblx0XHRcdG10eF9yYXdbaV0gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRGbG9hdCgpO1xuXHRcdH1cblxuXHRcdHJldHVybiBtdHhfcmF3O1xuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZU1hdHJpeDQzUmF3RGF0YSgpOkFycmF5PG51bWJlcj5cblx0e1xuXHRcdHZhciBtdHhfcmF3OkFycmF5PG51bWJlcj4gPSBuZXcgQXJyYXk8bnVtYmVyPigxNik7XG5cblx0XHRtdHhfcmF3WzBdID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5TWF0cml4KTtcblx0XHRtdHhfcmF3WzFdID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5TWF0cml4KTtcblx0XHRtdHhfcmF3WzJdID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5TWF0cml4KTtcblx0XHRtdHhfcmF3WzNdID0gMC4wO1xuXHRcdG10eF9yYXdbNF0gPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lNYXRyaXgpO1xuXHRcdG10eF9yYXdbNV0gPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lNYXRyaXgpO1xuXHRcdG10eF9yYXdbNl0gPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lNYXRyaXgpO1xuXHRcdG10eF9yYXdbN10gPSAwLjA7XG5cdFx0bXR4X3Jhd1s4XSA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeU1hdHJpeCk7XG5cdFx0bXR4X3Jhd1s5XSA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeU1hdHJpeCk7XG5cdFx0bXR4X3Jhd1sxMF0gPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lNYXRyaXgpO1xuXHRcdG10eF9yYXdbMTFdID0gMC4wO1xuXHRcdG10eF9yYXdbMTJdID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5TWF0cml4KTtcblx0XHRtdHhfcmF3WzEzXSA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeU1hdHJpeCk7XG5cdFx0bXR4X3Jhd1sxNF0gPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lNYXRyaXgpO1xuXHRcdG10eF9yYXdbMTVdID0gMS4wO1xuXG5cdFx0Ly9UT0RPOiBmaXggbWF4IGV4cG9ydGVyIHRvIHJlbW92ZSBOYU4gdmFsdWVzIGluIGpvaW50IDAgaW52ZXJzZSBiaW5kIHBvc2VcblxuXHRcdGlmIChpc05hTihtdHhfcmF3WzBdKSkge1xuXHRcdFx0bXR4X3Jhd1swXSA9IDE7XG5cdFx0XHRtdHhfcmF3WzFdID0gMDtcblx0XHRcdG10eF9yYXdbMl0gPSAwO1xuXHRcdFx0bXR4X3Jhd1s0XSA9IDA7XG5cdFx0XHRtdHhfcmF3WzVdID0gMTtcblx0XHRcdG10eF9yYXdbNl0gPSAwO1xuXHRcdFx0bXR4X3Jhd1s4XSA9IDA7XG5cdFx0XHRtdHhfcmF3WzldID0gMDtcblx0XHRcdG10eF9yYXdbMTBdID0gMTtcblx0XHRcdG10eF9yYXdbMTJdID0gMDtcblx0XHRcdG10eF9yYXdbMTNdID0gMDtcblx0XHRcdG10eF9yYXdbMTRdID0gMDtcblxuXHRcdH1cblxuXHRcdHJldHVybiBtdHhfcmF3O1xuXHR9XG5cbn1cblxuZXhwb3J0ID0gQVdEUGFyc2VyOyJdfQ==