var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DisplayObjectContainer = require("awayjs-core/lib/containers/DisplayObjectContainer");
var BlendMode = require("awayjs-core/lib/core/base/BlendMode");
var Geometry = require("awayjs-core/lib/core/base/Geometry");
var TriangleSubGeometry = require("awayjs-core/lib/core/base/TriangleSubGeometry");
var ColorTransform = require("awayjs-core/lib/core/geom/ColorTransform");
var Matrix3D = require("awayjs-core/lib/core/geom/Matrix3D");
var Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
var URLLoaderDataFormat = require("awayjs-core/lib/core/net/URLLoaderDataFormat");
var URLRequest = require("awayjs-core/lib/core/net/URLRequest");
var AssetType = require("awayjs-core/lib/core/library/AssetType");
var DirectionalLight = require("awayjs-core/lib/entities/DirectionalLight");
var PointLight = require("awayjs-core/lib/entities/PointLight");
var Camera = require("awayjs-core/lib/entities/Camera");
var Mesh = require("awayjs-core/lib/entities/Mesh");
var Skybox = require("awayjs-core/lib/entities/Skybox");
var StaticLightPicker = require("awayjs-core/lib/materials/lightpickers/StaticLightPicker");
var CubeMapShadowMapper = require("awayjs-core/lib/materials/shadowmappers/CubeMapShadowMapper");
var DirectionalShadowMapper = require("awayjs-core/lib/materials/shadowmappers/DirectionalShadowMapper");
var PrefabBase = require("awayjs-core/lib/prefabs/PrefabBase");
var PrimitiveCapsulePrefab = require("awayjs-core/lib/prefabs/PrimitiveCapsulePrefab");
var PrimitiveConePrefab = require("awayjs-core/lib/prefabs/PrimitiveConePrefab");
var PrimitiveCubePrefab = require("awayjs-core/lib/prefabs/PrimitiveCubePrefab");
var PrimitiveCylinderPrefab = require("awayjs-core/lib/prefabs/PrimitiveCylinderPrefab");
var PrimitivePlanePrefab = require("awayjs-core/lib/prefabs/PrimitivePlanePrefab");
var PrimitiveSpherePrefab = require("awayjs-core/lib/prefabs/PrimitiveSpherePrefab");
var PrimitiveTorusPrefab = require("awayjs-core/lib/prefabs/PrimitiveTorusPrefab");
var ParserBase = require("awayjs-core/lib/parsers/ParserBase");
var ParserUtils = require("awayjs-core/lib/parsers/ParserUtils");
var PerspectiveProjection = require("awayjs-core/lib/projections/PerspectiveProjection");
var OrthographicProjection = require("awayjs-core/lib/projections/OrthographicProjection");
var OrthographicOffCenterProjection = require("awayjs-core/lib/projections/OrthographicOffCenterProjection");
var BitmapCubeTexture = require("awayjs-core/lib/textures/BitmapCubeTexture");
var ImageCubeTexture = require("awayjs-core/lib/textures/ImageCubeTexture");
var ImageTexture = require("awayjs-core/lib/textures/ImageTexture");
var ByteArray = require("awayjs-core/lib/utils/ByteArray");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNlcnMvYXdkcGFyc2VyLnRzIl0sIm5hbWVzIjpbIkFXRFBhcnNlciIsIkFXRFBhcnNlci5jb25zdHJ1Y3RvciIsIkFXRFBhcnNlci5zdXBwb3J0c1R5cGUiLCJBV0RQYXJzZXIuc3VwcG9ydHNEYXRhIiwiQVdEUGFyc2VyLl9pUmVzb2x2ZURlcGVuZGVuY3kiLCJBV0RQYXJzZXIuX2lSZXNvbHZlRGVwZW5kZW5jeUZhaWx1cmUiLCJBV0RQYXJzZXIuX2lSZXNvbHZlRGVwZW5kZW5jeU5hbWUiLCJBV0RQYXJzZXIuX3BQcm9jZWVkUGFyc2luZyIsIkFXRFBhcnNlci5fcFN0YXJ0UGFyc2luZyIsIkFXRFBhcnNlci5kaXNwb3NlIiwiQVdEUGFyc2VyLnBhcnNlTmV4dEJsb2NrIiwiQVdEUGFyc2VyLnBhcnNlVHJpYW5nbGVHZW9tZXRyaWVCbG9jayIsIkFXRFBhcnNlci5wYXJzZVByaW1pdHZlcyIsIkFXRFBhcnNlci5wYXJzZUNvbnRhaW5lciIsIkFXRFBhcnNlci5wYXJzZU1lc2hJbnN0YW5jZSIsIkFXRFBhcnNlci5wYXJzZVNreWJveEluc3RhbmNlIiwiQVdEUGFyc2VyLnBhcnNlTGlnaHQiLCJBV0RQYXJzZXIucGFyc2VDYW1lcmEiLCJBV0RQYXJzZXIucGFyc2VMaWdodFBpY2tlciIsIkFXRFBhcnNlci5wYXJzZU1hdGVyaWFsIiwiQVdEUGFyc2VyLnBhcnNlTWF0ZXJpYWxfdjEiLCJBV0RQYXJzZXIucGFyc2VUZXh0dXJlIiwiQVdEUGFyc2VyLnBhcnNlQ3ViZVRleHR1cmUiLCJBV0RQYXJzZXIucGFyc2VTaGFyZWRNZXRob2RCbG9jayIsIkFXRFBhcnNlci5wYXJzZVNoYWRvd01ldGhvZEJsb2NrIiwiQVdEUGFyc2VyLnBhcnNlQ29tbWFuZCIsIkFXRFBhcnNlci5wYXJzZU1ldGFEYXRhIiwiQVdEUGFyc2VyLnBhcnNlTmFtZVNwYWNlIiwiQVdEUGFyc2VyLnBhcnNlU2hhZG93TWV0aG9kTGlzdCIsIkFXRFBhcnNlci5wYXJzZVNrZWxldG9uIiwiQVdEUGFyc2VyLnBhcnNlU2tlbGV0b25Qb3NlIiwiQVdEUGFyc2VyLnBhcnNlU2tlbGV0b25BbmltYXRpb24iLCJBV0RQYXJzZXIucGFyc2VNZXNoUG9zZUFuaW1hdGlvbiIsIkFXRFBhcnNlci5wYXJzZVZlcnRleEFuaW1hdGlvblNldCIsIkFXRFBhcnNlci5wYXJzZUFuaW1hdG9yU2V0IiwiQVdEUGFyc2VyLnBhcnNlU2hhcmVkTWV0aG9kTGlzdCIsIkFXRFBhcnNlci5wYXJzZVVzZXJBdHRyaWJ1dGVzIiwiQVdEUGFyc2VyLnBhcnNlUHJvcGVydGllcyIsIkFXRFBhcnNlci5wYXJzZUF0dHJWYWx1ZSIsIkFXRFBhcnNlci5wYXJzZUhlYWRlciIsIkFXRFBhcnNlci5nZXRVVkZvclZlcnRleEFuaW1hdGlvbiIsIkFXRFBhcnNlci5wYXJzZVZhclN0ciIsIkFXRFBhcnNlci5nZXRBc3NldEJ5SUQiLCJBV0RQYXJzZXIuZ2V0RGVmYXVsdEFzc2V0IiwiQVdEUGFyc2VyLmdldERlZmF1bHRNYXRlcmlhbCIsIkFXRFBhcnNlci5nZXREZWZhdWx0VGV4dHVyZSIsIkFXRFBhcnNlci5nZXREZWZhdWx0Q3ViZVRleHR1cmUiLCJBV0RQYXJzZXIucmVhZE51bWJlciIsIkFXRFBhcnNlci5wYXJzZU1hdHJpeDNEIiwiQVdEUGFyc2VyLnBhcnNlTWF0cml4MzJSYXdEYXRhIiwiQVdEUGFyc2VyLnBhcnNlTWF0cml4NDNSYXdEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFPLHNCQUFzQixXQUFhLG1EQUFtRCxDQUFDLENBQUM7QUFFL0YsSUFBTyxTQUFTLFdBQWdCLHFDQUFxQyxDQUFDLENBQUM7QUFFdkUsSUFBTyxRQUFRLFdBQWlCLG9DQUFvQyxDQUFDLENBQUM7QUFFdEUsSUFBTyxtQkFBbUIsV0FBYywrQ0FBK0MsQ0FBQyxDQUFDO0FBQ3pGLElBQU8sY0FBYyxXQUFlLDBDQUEwQyxDQUFDLENBQUM7QUFDaEYsSUFBTyxRQUFRLFdBQWlCLG9DQUFvQyxDQUFDLENBQUM7QUFDdEUsSUFBTyxR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QTtRQUN6Q0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7UUFDN0NBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1FBQ3hDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtRQUM1Q0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDekNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1FBQ3hDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtRQUMxQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7UUFDM0NBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1FBQ3pDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtRQUMxQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDekNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1FBQ3pDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtRQUUxQ0EsSUFBSUEsQ0FBQ0EsYUFB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QUNBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUNBLFNBQVNBLENBQUNBLElBQUlBLEVBQUNBLENBQUNBLENBQUNBO1FBRTFSQSxJQUFJQSxjQUFjQSxHQUFpQkEsQ0FBQ0EscUJBQXFCQSxFQUFFQSxzQkFBc0JBLEVBQUVBLHFCQUFxQkEsRUFBRUEsdUJBQXVCQSxFQUFFQSx5QkFBeUJBLEVBQUVBLHNCQUFzQkEsRUFBRUEseUJBQXlCQSxFQUFFQSx1QkFBdUJBLENBQUNBLENBQUFBO1FBRXpPQSxNQUFNQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUdsQkEsS0FBS0EsQ0FBQ0E7Z0JBQ0xBLE1BQU1BLEdBQUdBLElBQUlBLG9CQUFvQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQy9KQSxLQUFLQSxDQUFDQTtZQUVQQSxLQUFLQSxDQUFDQTtnQkFDTEEsTUFBTUEsR0FBR0EsSUFBSUEsbUJBQW1CQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDL0tBLEtBQUtBLENBQUNBO1lBRVBBLEtBQUtBLENBQUNBO2dCQUNMQSxNQUFNQSxHQUFHQSxJQUFJQSxxQkFBcUJBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUNySEEsS0FBS0EsQ0FBQ0E7WUFFUEEsS0FBS0EsQ0FBQ0E7Z0JBQ0xBLE1BQU1BLEdBQUdBLElBQUlBLHVCQUF1QkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsRUFBRUEsdUNBQXVDQTtnQkFDbk1BLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO29CQUNDQSxNQUFPQSxDQUFDQSxTQUFTQSxHQUFHQSxLQUFLQSxDQUFDQTtnQkFDckRBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO29CQUNDQSxNQUFPQSxDQUFDQSxZQUFZQSxHQUFHQSxLQUFLQSxDQUFDQTtnQkFDeERBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO29CQUNDQSxNQUFPQSxDQUFDQSxHQUFHQSxHQUFHQSxLQUFLQSxDQUFDQTtnQkFFL0NBLEtBQUtBLENBQUNBO1lBRVBBLEtBQUtBLENBQUNBO2dCQUNMQSxNQUFNQSxHQUFHQSxJQUFJQSxtQkFBbUJBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUM3SkEsS0FBS0EsQ0FBQ0E7WUFFUEEsS0FBS0EsQ0FBQ0E7Z0JBQ0xBLE1BQU1BLEdBQUdBLElBQUlBLHNCQUFzQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzNJQSxLQUFLQSxDQUFDQTtZQUVQQSxLQUFLQSxDQUFDQTtnQkFDTEEsTUFBTUEsR0FBR0EsSUFBSUEsb0JBQW9CQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdklBLEtBQUtBLENBQUNBO1lBRVBBO2dCQUNDQSxNQUFNQSxHQUFHQSxJQUFJQSxVQUFVQSxFQUFFQSxDQUFDQTtnQkFDMUJBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLGdDQUFnQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzlDQSxLQUFLQSxDQUFDQTtRQUNSQSxDQUFDQTtRQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUczREEsQ0FBQ0E7UUFFREEsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxFQUFFQSxDQUFDQTtRQUMzQkEsTUFBTUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDbkJBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLE1BQU1BLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1FBQ25DQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxJQUFJQSxHQUFHQSxNQUFNQSxDQUFDQTtRQUVwQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDakJBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLFFBQVFBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUN0Q0EsUUFBUUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDZEEsQ0FBQ0E7WUFDREEsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsNkJBQTZCQSxHQUFHQSxJQUFJQSxHQUFHQSxXQUFXQSxHQUFHQSxjQUFjQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM1RkEsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUFFRFosZ0JBQWdCQTtJQUNSQSxrQ0FBY0EsR0FBdEJBLFVBQXVCQSxPQUFjQTtRQUVwQ2EsSUFBSUEsSUFBV0EsQ0FBQ0E7UUFDaEJBLElBQUlBLE1BQWFBLENBQUNBO1FBQ2xCQSxJQUFJQSxHQUFZQSxDQUFDQTtRQUNqQkEsSUFBSUEsR0FBMEJBLENBQUNBO1FBQy9CQSxJQUFJQSxNQUE2QkEsQ0FBQ0E7UUFFbENBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBO1FBQy9DQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQTtRQUMzQkEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7UUFFMUJBLElBQUlBLFVBQVVBLEdBQVVBLGlCQUFpQkEsQ0FBQ0E7UUFDMUNBLEdBQUdBLEdBQUdBLElBQUlBLHNCQUFzQkEsRUFBRUEsQ0FBQ0E7UUFDbkNBLEdBQUdBLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLEdBQUdBLEdBQUdBLENBQUNBO1FBRTdCQSxJQUFJQSxhQUFhQSxHQUFjQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxTQUFTQSxDQUFDQSxTQUFTQSxFQUFFQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUVqSEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdEJBLElBQUlBLEdBQUdBLEdBQTJDQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFFQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNsRkEsVUFBVUEsR0FBNkJBLGFBQWFBLENBQUNBLENBQUNBLENBQUVBLENBQUNBLElBQUlBLENBQUNBO1FBQy9EQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN2QkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBRUEsT0FBT0EsQ0FBRUEsQ0FBQ0EsUUFBUUEsQ0FBQ0Esb0RBQW9EQSxDQUFDQSxDQUFDQTtRQUN4RkEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDUEEsQUFDQUEsNkJBRDZCQTtZQUNIQSxJQUFJQSxDQUFDQSxTQUFVQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUN6REEsQ0FBQ0E7UUFFREEsQUFDQUEsc0RBRHNEQTtRQUN0REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeERBLElBQUlBLEtBQUtBLEdBQWlCQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxFQUFDQSxDQUFDQSxFQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQSxFQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQSxFQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFDQSxDQUFDQSxDQUFDQTtZQUN0SUEsR0FBR0EsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEs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QUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUM1QkEsSUFBSUEsSUFBSUEsR0FBbURBLG1CQUFtQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbEZBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ3BCQSxVQUFVQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUN4QkEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdkJBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLHVDQUF1Q0EsQ0FBQ0EsQ0FBQ0E7UUFDekVBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ1BBLEFBQ0FBLDZCQUQ2QkE7WUFDSEEsSUFBSUEsQ0FBQ0EsU0FBVUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDMURBLENBQUNBO1FBRURBLEVBQUVBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLElBQUlBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3pEQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM5QkEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDakNBLElBQUlBLENBQVFBLENBQUNBO1lBSWJBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO2dCQUM1Q0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsR0FBR0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDM0VBLENBQUNBO1FBQ0ZBLENBQUNBO1FBQ0RBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hEQSxJQUFJQSxLQUFLQSxHQUFpQkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsRUFBQ0EsQ0FBQ0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsRUFBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEpBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLFFBQVFBLENBQVNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQVVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQVdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3RHQSxJQUFJQSxDQUFDQSxZQUFZQSxHQUFHQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxD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QSxDQUFDQTtRQUMxREEsSUFBSUEsR0FBR0EsR0FBWUEsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0E7UUFDeENBLElBQUlBLElBQUlBLEdBQVVBLElBQUlBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO1FBQ3JDQSxJQUFJQSxTQUFTQSxHQUFVQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxnQkFBZ0JBLEVBQUVBLENBQUNBO1FBQzlEQSxJQUFJQSxLQUFLQSxHQUFpQkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsRUFBQ0EsQ0FBQ0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsRUFBRUEsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsRUFBRUEsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsRUFBRUEsRUFBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsRUFBRUEsRUFBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsRUFBRUEsRUFBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsRUFBRUEsRUFBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDeldBLElBQUlBLGdCQUFnQkEsR0FBVUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDOUNBLElBQUlBLFVBQVVBLEdBQVVB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Q0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzNCQSxlQUFlQSxDQUFDQSxZQUFZQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDckVBLENBQUNBO1lBQ0ZBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNQQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDM0JBLGVBQWVBLENBQUNBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNyRUEsQ0FBQ0E7WUFDRkEsQ0FBQ0E7WUFFREEsS0FBS0EsQ0FBQ0EsWUFBWUEsR0FBR0EsZUFBZUEsQ0FBQ0E7WUFDckNBLEtBQUtBLENBQUNBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBO1FBQzNCQSxDQUFDQTtRQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUVqQkEsSUFBSUEsbUJBQW1CQSxHQUFjQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxTQUFTQSxDQUFDQSxTQUFTQSxFQUFFQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFBQTtZQUV0SEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDRkEsbUJBQW1CQSxDQUFDQSxDQUFDQSxDQUFFQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDbEVBLFVBQVVBLEdBQTZCQSxtQkFBbUJBLENBQUNBLENBQUNBLENBQUVBLENBQUNBLElBQUlBLENBQUNBO1lBQ3JFQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDUEEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0Esd0NBQXdDQSxDQUFDQSxDQUFDQTtZQUMxRUEsQ0FBQ0E7UUFDRkEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDUEEsQUFDQUEsNkJBRDZCQTtZQUNIQSxJQUFJQSxDQUFDQSxTQUFVQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUMzREEsQ0FBQ0E7UUFFREEsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxFQUFFQSxDQUFDQTtRQUUzQkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBV0EsS0FBS0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFFNUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBO1FBRW5DQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUNmQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSwwQkFBMEJBLEdBQUdBLElBQUlBLEdBQUdBLGFBQWFBLEdBQUdBLFVBQVVBLENBQUNBLFNBQVNBLENBQUNBLEdBQUdBLG1CQUFtQkEsR0FBR0EsVUFBVUEsR0FBR0EseUJBQXlCQSxHQUFHQSxpQkFBaUJBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFFOUxBLENBQUNBO0lBRURoQixlQUFlQTtJQUNQQSwrQkFBV0EsR0FBbkJBLFVBQW9CQSxPQUFjQTtRQUdqQ2lCLElBQUlBLE1BQU1BLEdBQVVBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBO1FBQzFEQSxJQUFJQSxHQUFHQSxHQUFZQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQTtRQUN4Q0EsSUFBSUEsSUFBSUEsR0FBVUEsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7UUFDckNBLElBQUlBLFVBQVVBLEdBQVVBLGlCQUFpQkEsQ0FBQ0E7UUFDMUNBLElBQUlBLFVBQXlCQSxDQUFDQTtRQUU5QkEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsZ0JBQWdCQSxFQUFFQSxFQUFFQSxzQkFBc0JBO1FBQzlEQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxTQUFTQSxFQUFFQSxFQUFFQSxnQ0FBZ0NBO1FBRWpFQSxJQUFJQSxjQUFjQSxHQUFVQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQTtRQUM1REEsSUFBSUEsS0FBS0EsR0FBaUJBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLEVBQUNBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEdBQUdBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUNBLENBQUNBLENBQUNBO1FBRTdJQSxNQUFNQSxDQUFDQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsS0FBS0EsSUFBSUE7Z0JBQ1JBLFVBQVVBLEdBQUdBLElBQUlBLHFCQUFxQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzNEQSxLQUFLQSxDQUFDQTtZQUNQQSxLQUFLQSxJQUFJQTtnQkFDUkEsVUFBVUEsR0FBR0EsSUFBSUEsc0JBQXNCQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDN0RBLEtBQUtBLENBQUNBO1lBQ1BBLEtBQUtBLElBQUlBO2dCQUNSQSxVQUFVQSxHQUFHQSxJQUFJQSwrQkFBK0JBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUN2SUEsS0FBS0EsQ0FBQ0E7WUFDUEE7Z0JBQ0NBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0E7Z0JBQ25DQSxNQUFNQSxDQUFDQTtRQUNUQSxDQUFDQTtRQUVEQSxJQUFJQSxNQUFNQSxHQUFVQSxJQUFJQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtRQUMzQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsUUFBUUEsR0FBR0EsR0FBR0EsQ0FBQ0E7UUFFaENBLElBQUlBLG1CQUFtQkEsR0FBY0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsRUFBRUEsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQUE7UUFFdEhBLEVBQUVBLENBQUNBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFNUJBLElBQUlBLElBQUlBLEdBQW1EQSxtQkFBbUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2xGQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtZQUV0QkEsVUFBVUEsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFFeEJBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3ZCQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSx5Q0FBeUNBLENBQUNBLENBQUNBO1FBQzNFQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNQQSxBQUNBQSw2QkFENkJBO1lBQ0hBLElBQUlBLENBQUNBLFNBQVVBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1FBQzVEQSxDQUFDQTtRQUVEQSxNQUFNQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUNuQkEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsRUFBQ0EsQ0FBQ0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDcEhBLE1BQU1BLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQy9FQSxNQUFNQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxtQkFBbUJBLEVBQUVBLENBQUNBO1FBRTFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxNQUFNQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUVuQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsR0FBR0EsTUFBTUEsQ0FBQUE7UUFFbkNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO1lBQ2pCQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSwyQkFBMkJBLEdBQUdBLElBQUlBLEdBQUdBLHVCQUF1QkEsR0FBR0EsVUFBVUEsR0FBR0EsbUJBQW1CQSxHQUFHQSxVQUFVQSxDQUFDQSxDQUFDQTtRQUMzSEEsQ0FBQ0E7SUFFRkEsQ0FBQ0E7SUFFRGpCLGVBQWVBO0lBQ1BBLG9DQUFnQkEsR0FBeEJBLFVBQXlCQSxPQUFjQTtRQUV0Q2tCLElBQUlBLElBQUlBLEdBQVVBLElBQUlBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO1FBQ3JDQSxJQUFJQSxTQUFTQSxHQUFVQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxpQkFBaUJBLEVBQUVBLENBQUNBO1FBQy9EQSxJQUFJQSxXQUFXQSxHQUFvQkEsSUFBSUEsS0FBS0EsRUFBYUEsQ0FBQ0E7UUFDMURBLElBQUlBLENBQUNBLEdBQVVBLENBQUNBLENBQUNBO1FBQ2pCQSxJQUFJQSxPQUFPQSxHQUFVQSxDQUFDQSxDQUFDQTtRQUV2QkEsSUFBSUEsa0JBQTZCQSxDQUFDQTtRQUNsQ0EsSUFBSUEsZ0JBQWdCQSxHQUFpQkEsSUFBSUEsS0FBS0EsRUFBVUEsQ0FBQ0E7UUFFekRBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFNBQVNBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQ2hDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxlQUFlQSxFQUFFQSxDQUFDQTtZQUNoREEsa0JBQWtCQSxHQUFHQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFBQTtZQUVsRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDM0JBLFdBQVdBLENBQUNBLElBQUlBLENBQWFBLGtCQUFrQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3BEQSxnQkFBZ0JBLENBQUNBLElBQUlBLENBQWVBLGtCQUFrQkEsQ0FBQ0EsQ0FBQ0EsQ0FBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFFbEVBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNQQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSw0QkFBNEJBLEdBQUdBLENBQUNBLEdBQUdBLFNBQVNBLEdBQUdBLE9BQU9BLEdBQUdBLHlCQUF5QkEsQ0FBQ0EsQ0FBQ0E7WUFDcEhBLENBQUNBO1FBQ0ZBLENBQUNBO1FBRURBLEVBQUVBLENBQUNBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzdCQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSw4REFBOERBLENBQUNBLENBQUNBO1lBQy9GQSxJQUFJQSxDQUFDQSxtQkFBbUJBLEVBQUVBLENBQUNBO1lBQzNCQSxNQUFNQSxFQUFFQSxnREFBZ0RBO1FBQ3pEQSxDQUFDQSxHQURPQTtRQUdSQSxJQUFJQSxTQUFTQSxHQUFtQkEsSUFBSUEsaUJBQWlCQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtRQUNuRUEsU0FBU0EsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFFdEJBLElBQUlBLENBQUNBLG1CQUFtQkEsRUFBRUEsQ0FBQ0E7UUFDM0JBLElBQUlBLENBQUNBLGVBQWVBLENBQVVBLFNBQVNBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1FBRS9DQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxJQUFJQSxHQUFHQSxTQUFTQSxDQUFBQTtRQUN0Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDakJBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLHNDQUFzQ0EsR0FBR0EsSUFBSUEsR0FBR0EscUJBQXFCQSxHQUFHQSxnQkFBZ0JBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBLENBQUNBO1FBQ2xIQSxDQUFDQTtJQUNGQSxDQUFDQTtJQUVEbEIsZUFBZUE7SUFDUEEsaUNBQWFBLEdBQXJCQSxVQUFzQkEsT0FBY0E7UUFFbkNtQixBQUVBQSxpQkFGaUJBO1FBQ2pCQSw0QkFBNEJBO1lBQ3hCQSxJQUFXQSxDQUFDQTtRQUNoQkEsSUFBSUEsSUFBV0EsQ0FBQ0E7UUFDaEJBLElBQUlBLEtBQW1CQSxDQUFDQTtRQUN4QkEsSUFBSUEsR0FBMEJBLENBQUNBO1FBQy9CQSxJQUFJQSxVQUFpQkEsQ0FBQ0E7UUFDdEJBLElBQUlBLFFBQWdCQSxDQUFDQTtRQUNyQkEsSUFBSUEsV0FBa0JBLENBQUNBO1FBQ3ZCQSxJQUFJQSxjQUFxQkEsQ0FBQ0E7UUFDMUJBLElBQUlBLGFBQXdCQSxDQUFDQTtRQUU3QkEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7UUFDMUJBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGdCQUFnQkEsRUFBRUEsQ0FBQ0E7UUFDOUNBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGdCQUFnQkEsRUFBRUEsQ0FBQ0E7UUFFckRBLEFBRUFBLHFDQUZxQ0E7UUFDckNBLHNGQUFzRkE7UUFDdEZBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLEVBQUVBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEVBQUVBLEVBQUNBLFNBQVNBLENBQUNBLElBQUlBLEVBQUVBLEVBQUVBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEVBQUVBLEVBQUNBLFNBQVNBLENBQUNBLElBQUlBLEVBQUNBLENBQUNBLENBQUNBO1FBRXhKQSxjQUFjQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNuQkEsT0FBT0EsY0FBY0EsR0FBR0EsV0FBV0EsRUFBRUEsQ0FBQ0E7WUFDckNBLElBQUlBLFdBQWtCQSxDQUFDQTtZQUV2QkEsV0FBV0EsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxDQUFDQTtZQUN0REEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDM0JBLElBQUlBLENBQUNBLG1CQUFtQkEsRUFBRUEsQ0FBQ0E7WUFDM0JBLGNBQWNBLElBQUlBLENBQUNBLENBQUNBO1FBQ3JCQSxDQUFDQTtRQUNEQSxJQUFJQSxXQUFXQSxHQUFVQSxFQUFFQSxDQUFDQTtRQUM1QkEsVUFBVUEsR0FBR0EsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxFQUFFQSxDQUFDQTtRQUN4Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDaEJBLFdBQVdBLElBQUlBLDhDQUE4Q0EsR0FBR0EsSUFBSUEsR0FBR0EsTUFBTUEsQ0FBQ0E7WUFDOUVBLElBQUlBLEtBQVlBLENBQUNBO1lBQ2pCQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxRQUFRQSxDQUFDQSxDQUFDQTtZQUMvQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzNCQSxHQUFHQSxHQUFHQSxJQUFJQSxzQkFBc0JBLENBQUNBLEtBQUtBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO1lBQzdEQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDUEEsR0FBR0EsR0FBR0EsSUFBSUEsc0JBQXNCQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDeENBLEdBQUdBLENBQUNBLFlBQVlBLEdBQUdBLG9CQUFvQkEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7WUFDcERBLENBQUNBO1FBQ0ZBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3ZCQSxJQUFJQSxRQUFRQSxHQUFVQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUV0Q0EsYUFBYUEsR0FBR0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFakVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUN6Q0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsMENBQTBDQSxHQUFHQSxRQUFRQSxHQUFHQSxzQkFBc0JBLENBQUNBLENBQUNBO1lBRWhIQSxHQUFHQSxHQUFHQSxJQUFJQSxzQkFBc0JBLENBQWlCQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUVuRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzNCQSxHQUFHQSxDQUFDQSxhQUFhQSxHQUFHQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDekNBLEdBQUdBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO2dCQUMvQkEsV0FBV0EsSUFBSUEsdURBQXVEQSxHQUFHQSxJQUFJQSxHQUFHQSxxQkFBcUJBLEdBQUdBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBO1lBQ2xIQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDUEEsR0FBR0EsQ0FBQ0EsWUFBWUEsR0FBR0Esb0JBQW9CQSxDQUFDQSxVQUFVQSxDQUFDQTtnQkFDbkRBLFdBQVdBLElBQUlBLHNEQUFzREEsR0FBR0EsSUFBSUEsR0FBR0EscUJBQXFCQSxHQUFHQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQTtZQUNqSEEsQ0FBQ0E7UUFDRkEsQ0FBQ0E7UUFFREEsR0FBR0EsQ0FBQ0EsS0FBS0EsR0FBR0EsVUFBVUEsQ0FBQ0E7UUFDdkJBLEdBQUdBLENBQUNBLGNBQWNBLEdBQUdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO1FBQ3hDQSxHQUFHQSxDQUFDQSxNQUFNQSxHQUFHQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUNsQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBVUEsR0FBR0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDekNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLElBQUlBLEdBQUdBLEdBQUdBLENBQUNBO1FBRWpDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNqQkEsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0E7UUFFMUJBLENBQUNBO0lBQ0ZBLENBQUNBO0lBRURuQix1QkFBdUJBO0lBQ2ZBLG9DQUFnQkEsR0FBeEJBLFVBQXlCQSxPQUFjQTtRQUV0Q29CLElBQUlBLEdBQTBCQSxDQUFDQTtRQUMvQkEsSUFBSUEsYUFBMkJBLENBQUNBO1FBQ2hDQSxJQUFJQSxXQUF5QkEsQ0FBQ0E7UUFDOUJBLElBQUlBLGFBQXdCQSxDQUFDQTtRQUU3QkEsSUFBSUEsSUFBSUEsR0FBVUEsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7UUFDckNBLElBQUlBLElBQUlBLEdBQVVBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGdCQUFnQkEsRUFBRUEsQ0FBQ0E7UUFDekRBLElBQUlBLFdBQVdBLEdBQVVBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGdCQUFnQkEsRUFBRUEsQ0FBQ0E7UUFDaEVBLElBQUlBLEtBQUtBLEdBQWlCQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxFQUFDQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxFQUFFQSxFQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxFQUFFQSxFQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUFFQSxFQUFFQSxFQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxFQUFFQSxFQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUFFQSxFQUFFQSxFQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxFQUFFQSxFQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxFQUFFQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxFQUFFQSxFQUFDQSxJ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ZUFBZUEsR0FBVUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDOUNBLGFBQWFBLEdBQUdBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBLFNBQVNBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLENBQUFBO1lBRTVFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDOUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLHVDQUF1Q0EsR0FBR0EsZUFBZUEsR0FBR0Esb0NBQW9DQSxDQUFDQSxDQUFDQTtZQUNsSUEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ1BBLEdBQUdBLENBQUNBLFdBQVdBLEdBQXFCQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUV0REEsQ0FBQ0E7WUFFREEsR0FBR0EsQ0FBQ0EsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDaENBLEdBQUdBLENBQUNBLE1BQU1BLEdBQUdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1lBQ2hDQSxHQUFHQSxDQUFDQSxTQUFTQSxHQUFHQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUNwQ0EsR0FBR0EsQ0FBQ0Esa0JBQWtCQSxHQUFHQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUM3Q0EsR0FBR0EsQ0FBQ0EsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbkRBLEdBQUdBLENBQUNBLE1BQU1BLEdBQUdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO1lBRWxDQSxFQUFFQSxDQUFDQSxDQUFDQSxhQUFhQSxDQUFDQTtnQkFDakJBLEdBQUdBLENBQUNBLFNBQVNBLEdBQUdBLGFBQWFBLENBQUNBO1lBRS9CQSxFQUFFQSxDQUFDQSxDQUFDQSxXQUFXQSxDQUFDQTtnQkFDZkEsR0FBR0EsQ0FBQ0EsV0FBV0EsR0FBR0EsV0FBV0EsQ0FBQ0E7WUFFL0JBLEdBQUdBLENBQUNBLGNBQWNBLEdBQUdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO1lBQ3hDQSxHQUFHQSxDQUFDQSxPQUFPQSxHQUFHQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNqQ0EsR0FBR0EsQ0FBQ0EsWUFBWUEsR0FBR0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsRUFBRUEsUUFBUUEsQ0FBQ0EsQ0FBQ0E7WUFDM0NBLEdBQUdBLENBQUNBLFFBQVFBLEdBQUdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO1lBQ2xDQSxHQUFHQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUM5QkEsR0FBR0EsQ0FBQ0EsYUFBYUEsR0FBR0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsRUFBRUEsUUFBUUEsQ0FBQ0EsQ0FBQ0E7WUFFNUNBLElBQUlBLGNBQWNBLEdBQVVBLENBQUNBLENBQUNBO1lBQzlCQSxJQUFJQSxRQUFlQSxDQUFDQTtZQUVwQkEsT0FBT0EsY0FBY0EsR0FBR0EsV0FBV0EsRUFBRUEsQ0FBQ0E7Z0JBQ3JDQSxJQUFJQSxXQUFrQkEsQ0FBQ0E7Z0JBQ3ZCQSxXQUFXQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxpQkFBaUJBLEVBQUVBLENBQUNBO2dCQUV0REEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsRUFBQ0EsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsR0FBR0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsR0FBR0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsR0FBR0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRXZZQSxNQUFNQSxDQUFDQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDckJBLEtBQUtBLEdBQUdBO3dCQUVQQSxRQUFRQSxHQUFHQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxD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RUEsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDeERBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBRTlCQSxBQUNBQSxXQURXQTtZQUNYQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDZkEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0E7Z0JBQ2pEQSxJQUFJQSxHQUFVQSxDQUFDQTtnQkFDZkEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7Z0JBRWpEQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxRQUFRQSxFQUFFQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQSxFQUFFQSxJQUFJQSxVQUFVQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxLQUFLQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUN2R0EsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBRVBBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBO2dCQUNqREEsSUFBSUEsSUFBY0EsQ0FBQ0E7Z0JBQ25CQSxJQUFJQSxHQUFHQSxJQUFJQSxTQUFTQSxFQUFFQSxDQUFDQTtnQkFFdkJBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBLEVBQUVBLFFBQVFBLENBQUNBLENBQUNBO2dCQUVqREEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsUUFBUUEsRUFBRUEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsRUFBRUEsSUFBSUEsRUFBRUEsS0FBS0EsRUFBRUEsV0FBV0EsQ0FBQ0EsZ0JBQWdCQSxD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VUEsR0FBVUEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxDQUFDQTtRQUNoRUEsSUFBSUEsWUFBNkJBLENBQUNBO1FBQ2xDQSxJQUFJQSxLQUFLQSxHQUFpQkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsRUFBQ0EsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsR0FBR0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsR0FBR0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsR0FBR0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBQ0EsQ0FBQ0EsQ0FBQ0E7UUFFelpBLElBQUlBLFFBQWVBLENBQUNBO1FBQ3BCQSxJQUFJQSxhQUF3QkEsQ0FBQUE7UUFDNUJBLE1BQU1BLENBQUNBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO1lBVXBCQSxLQUFLQSxJQUFJQTtnQkFDUkEsUUFBUUEsR0FBR0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzNCQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQSxTQUFTQSxDQUFDQSxpQkFBaUJBLENBQUNBLENBQUNBLENBQUNBO2dCQUMzRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZCQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSw0Q0FBNENBLEdBQUdBLFFBQVFBLEdBQUdBLHlEQUF5REEsQ0FBQ0EsQ0FBQ0E7b0JBQ3BKQSxNQUFNQSxDQUFDQSxZQUFZQSxDQUFDQTtnQkFDckJBLENBQUNBO2dCQUNEQSxZQUFZQSxHQUFHQSxJQUFJQSxnQkFBZ0JBLENBQW9CQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDekVBLEtBQUtBLENBQUNBO1lBQ1BBLEtBQUtBLElBQUlBO2dCQUVSQSxZQUFZQSxHQUFHQSxJQUFJQSxvQkFBb0JBLENBQW9CQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDMUNBLFlBQWFBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUN4Q0EsWUFBYUEsQ0FBQ0EsT0FBT0EsR0FBR0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3RFQSxLQUFLQSxDQUFDQTtZQUVQQSxLQUFLQSxJQUFJQTtnQkFHUkEsWUFBWUEsR0FBR0EsSUFBSUEsb0JBQW9CQSxDQUFvQkEsS0FBS0EsRUFBV0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3RFQSxZQUFhQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDeENBLFlBQWFBLENBQUNBLE9BQU9BLEdBQUdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO2dCQUM5Q0EsWUFBYUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRWhFQSxLQUFLQSxDQUFDQTtZQUNQQSxLQUFLQSxJQUFJQTtnQkFFUkEsWUFBWUEsR0FBR0EsSUFBSUEsZ0JBQWdCQSxDQUFvQkEsS0FBS0EsRUFBV0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3RFQSxZQUFhQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDeENBLFlBQWFBLENBQUNBLE9BQU9BLEdBQUdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO2dCQUM5Q0EsWUFBYUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRTVEQSxLQUFLQSxDQUFDQTtZQUNQQSxLQUFLQSxJQUFJQTtnQkFDUkEsWUFBWUEsR0FBR0EsSUFBSUEsZ0JBQWdCQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtnQkFDdkJBLFlBQWFBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUN4Q0EsWUFBYUEsQ0FBQ0EsT0FBT0EsR0FBR0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2xFQSxLQUFLQSxDQUFDQTtRQUVSQSxDQUFDQTtRQUNEQSxJQUFJQSxDQUFDQSxtQkFBbUJBLEVBQUVBLENBQUNBO1FBQzNCQSxNQUFNQSxDQUFDQSxZQUFZQSxDQUFDQTtJQUNyQkEsQ0FBQ0E7SUFFRDVCLGNBQWNBO0lBQ05BLGlDQUFhQSxHQUFyQkEsVUFBc0JBLE9BQU9BLENBQVFBLFFBQURBLEFBQVNBO1FBRTVDNkIsSUFBSUEsSUFBSUEsR0FBVUEsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7UUFDckNBLElBQUlBLFVBQVVBLEdBQW1CQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxpQkFBaUJBLEVBQUVBLENBQUNBO1FBQ3pFQSxJQUFJQSxRQUFRQSxHQUFZQSxJQUFJQSxRQUFRQSxFQUFFQSxDQUFDQTtRQUN2Q0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsK0JBQStCQTtRQUUzREEsSUFBSUEsYUFBYUEsR0FBbUJBLENBQUNBLENBQUNBO1FBQ3RDQSxPQUFPQSxhQUFhQSxHQUFHQSxVQUFVQSxFQUFFQSxDQUFDQTtZQUNuQ0EsSUFBSUEsS0FBbUJBLENBQUNBO1lBQ3hCQSxJQUFJQSxHQUFZQSxDQUFDQTtZQUNqQkEsQUFDQUEsa0JBRGtCQTtZQUNsQkEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxDQUFDQTtZQUN4Q0EsS0FBS0EsR0FBR0EsSUFBSUEsYUFBYUEsRUFBRUEsQ0FBQ0E7WUFDNUJBLEtBQUtBLENBQUNBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGlCQUFpQkEsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsZ0JBQWdCQTtZQUNqRkEsS0FBS0EsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7WUFFaENBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBO1lBQzNCQSxLQUFLQSxDQUFDQSxlQUFlQSxHQUFHQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQTtZQUNwQ0EsQUFDQUEsd0NBRHdDQTtZQUN4Q0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDM0JBLElBQUlBLENBQUNBLG1CQUFtQkEsRUFBRUEsQ0FBQ0E7WUFDM0JBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1lBQzVCQSxhQUFhQSxFQUFFQSxDQUFDQTtRQUNqQkEsQ0FBQ0E7UUFFREEsQUFDQUEsNkJBRDZCQTtRQUM3QkEsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxFQUFFQSxDQUFDQTtRQUMzQkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsUUFBUUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDckNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLElBQUlBLEdBQUdBLFFBQVFBLENBQUNBO1FBQ3RDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUNmQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSw0QkFBNEJBLEdBQUdBLFFBQVFBLENBQUNBLElBQUlBLEdBQUdBLHdCQUF3QkEsR0FBR0EsYUFBYUEsQ0FBQ0EsQ0FBQ0E7SUFDdkdBLENBQUNBO0lBRUQ3QixnQkFBZ0JBO0lBQ1JBLHFDQUFpQkEsR0FBekJBLFVBQTBCQSxPQUFPQSxDQUFRQSxRQUFEQSxBQUFTQTtRQUVoRDhCLElBQUlBLElBQUlBLEdBQVVBLElBQUlBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO1FBQ3JDQSxJQUFJQSxVQUFVQSxHQUFtQkEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxDQUFDQTtRQUN6RUEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsNEJBQTRCQTtRQUV4REEsSUFBSUEsSUFBSUEsR0FBZ0JBLElBQUlBLFlBQVlBLEVBQUVBLENBQUNBO1FBRTNDQSxJQUFJQSxhQUFhQSxHQUFtQkEsQ0FBQ0EsQ0FBQ0E7UUFDdENBLE9BQU9BLGFBQWFBLEdBQUdBLFVBQVVBLEVBQUVBLENBQUNBO1lBQ25DQSxJQUFJQSxVQUFvQkEsQ0FBQ0E7WUFDekJBLElBQUlBLGFBQWFBLENBQVFBLFFBQURBLEFBQVNBLENBQUNBO1lBQ2xDQSxVQUFVQSxHQUFHQSxJQUFJQSxTQUFTQSxFQUFFQSxDQUFDQTtZQUM3QkEsYUFBYUEsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsZ0JBQWdCQSxFQUFFQSxDQUFDQTtZQUN2REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsYUFBYUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3hCQSxJQUFJQSxRQUFRQSxHQUFpQkEsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxFQUFFQSxDQUFDQTtnQkFFekRBLElBQUlBLEdBQUdBLEdBQVlBLElBQUlBLFFBQVFBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO2dCQUMxQ0EsVUFBVUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3ZDQSxVQUFVQSxDQUFDQSxXQUFXQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtnQkFFOUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLGFBQWFBLENBQUNBLEdBQUdBLFVBQVVBLENBQUNBO1lBQzdDQSxDQUFDQTtZQUNEQSxhQUFhQSxFQUFFQSxDQUFDQTtRQUNqQkEsQ0FBQ0E7UUFDREEsQUFDQUEsMEJBRDBCQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxFQUFFQSxDQUFDQTtRQUMzQkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDakNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO1FBQ2xDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUNmQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxnQ0FBZ0NBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLHdCQUF3QkEsR0FBR0EsYUFBYUEsQ0FBQ0EsQ0FBQ0E7SUFDdkdBLENBQUNBO0lBRUQ5QixhQUFhQTtJQUNMQSwwQ0FBc0JBLEdBQTlCQSxVQUErQkEsT0FBT0EsQ0FBUUEsUUFBREEsQUFBU0E7UUFFckQrQixJQUFJQSxTQUFnQkEsQ0FBQ0E7UUFDckJBLElBQUlBLFNBQVNBLENBQVFBLFFBQURBLEFBQVNBLENBQUNBO1FBQzlCQSxJQUFJQSxJQUFJQSxHQUFVQSxJQUFJQSxDQUFDQSxXQUFXQSxFQUFFQSxDQUFDQTtRQUNyQ0EsSUFBSUEsSUFBSUEsR0FBb0JBLElBQUlBLGdCQUFnQkEsRUFBRUEsQ0FBQ0E7UUFDbkRBLElBQUlBLFVBQVVBLEdBQW1CQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxpQkFBaUJBLEVBQUVBLENBQUNBO1FBQ3pFQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSw0QkFBNEJBO1FBRXhEQSxJQUFJQSxhQUFhQSxHQUFtQkEsQ0FBQ0EsQ0FBQ0E7UUFDdENBLElBQUlBLGFBQXdCQSxDQUFDQTtRQUM3QkEsT0FBT0EsYUFBYUEsR0FBR0EsVUFBVUEsRUFBRUEsQ0FBQ0E7WUFDbkNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBO1lBQ2xEQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxpQkFBaUJBLEVBQUVBLENBQUNBO1lBQ3BEQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQSxTQUFTQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4RUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3JCQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSwwQ0FBMENBLEdBQUdBLGFBQWFBLEdBQUdBLFNBQVNBLEdBQUdBLFNBQVNBLEdBQUdBLDhCQUE4QkEsQ0FBQ0EsQ0FBQ0E7WUFDckpBLElBQUlBO2dCQUNIQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFnQkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsRUFBRUEsU0FBU0EsQ0FBQ0EsQ0FBQ0E7WUFDdkVBLGFBQWFBLEVBQUVBLENBQUNBO1FBQ2pCQSxDQUFDQTtRQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUM3QkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsK0RBQStEQSxDQUFDQSxDQUFDQTtZQUNoR0EsTUFBTUEsQ0FBQ0E7UUFDUkEsQ0FBQ0E7UUFDREEsQUFDQUEsNEJBRDRCQTtRQUM1QkEsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxFQUFFQSxDQUFDQTtRQUMzQkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDakNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO1FBQ2xDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUNmQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxvQ0FBb0NBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLHdCQUF3QkEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7SUFDaEhBLENBQUNBO0lBRUQvQixrQ0FBa0NBO0lBQzFCQSwwQ0FBc0JBLEdBQTlCQSxVQUErQkEsT0FBT0EsQ0FBUUEsUUFBREEsQUFBU0EsRUFBRUEsUUFBd0JBO1FBQXhCZ0Msd0JBQXdCQSxHQUF4QkEsZ0JBQXdCQTtRQUUvRUEsSUFBSUEsVUFBVUEsR0FBbUJBLENBQUNBLENBQUNBO1FBQ25DQSxJQUFJQSxhQUFhQSxDQUFRQSxRQUFEQSxBQUFTQSxDQUFDQTtRQUNsQ0EsSUFBSUEsYUFBYUEsQ0FBUUEsUUFBREEsQUFBU0EsQ0FBQ0E7UUFDbENBLElBQUlBLGFBQWFBLENBQVFBLFFBQURBLEFBQVNBLENBQUNBO1FBQ2xDQSxJQUFJQSxTQUFnQkEsQ0FBQ0E7UUFDckJBLElBQUlBLENBQVFBLENBQUNBO1FBQ2JBLElBQUlBLENBQVFBLENBQUNBO1FBQ2JBLElBQUlBLENBQVFBLENBQUNBO1FBQ2JBLElBQUlBLE9BQWNBLENBQUNBO1FBQ25CQSxJQUFJQSxPQUFjQSxDQUFDQTtRQUNuQkEsSUFBSUEsUUFBaUJBLENBQUNBO1FBQ3RCQSxJQUFJQSxPQUEyQkEsQ0FBQ0E7UUFDaENBLElBQUlBLEdBQUdBLEdBQWtCQSxDQUFDQSxDQUFDQTtRQUMzQkEsSUFBSUEsSUFBSUEsR0FBa0JBLElBQUlBLGNBQWNBLEVBQUVBLENBQUNBO1FBQy9DQSxJQUFJQSxPQUFPQSxDQUFlQSxRQUFEQSxBQUFTQSxDQUFDQTtRQUNuQ0EsSUFBSUEsS0FBbUJBLENBQUNBO1FBQ3hCQSxJQUFJQSxXQUFXQSxHQUFrQkEsQ0FBQ0EsQ0FBQ0E7UUFDbkNBLElBQUlBLGFBQWFBLEdBQWtCQSxDQUFDQSxDQUFDQTtRQUNyQ0EsSUFBSUEsV0FBV0EsR0FBeUJBLElBQUlBLEtBQUtBLEVBQVVBLENBQUNBLE9BQURBLEFBQVFBLENBQUNBO1FBQ3BFQSxJQUFJQSxLQUFtQkEsQ0FBQ0E7UUFDeEJBLElBQUlBLE9BQWdCQSxDQUFDQTtRQUNyQkEsSUFBSUEsSUFBSUEsR0FBVUEsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7UUFDckNBLElBQUlBLFNBQVNBLEdBQWtCQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxlQUFlQSxFQUFFQSxDQUFDQTtRQUNyRUEsSUFBSUEsYUFBYUEsR0FBY0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDbEZBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3ZCQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSw0Q0FBNENBLEdBQUdBLFNBQVNBLEdBQUdBLDRCQUE0QkEsQ0FBQ0EsQ0FBQ0E7WUFDeEhBLE1BQU1BLENBQUNBO1FBQ1JBLENBQUNBO1FBQ0RBLElBQUlBLEdBQUdBLEdBQXdCQSxJQUFJQSxDQUFDQSx1QkFBdUJBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO1FBQ3ZFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQTtZQUNiQSxVQUFVQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxpQkFBaUJBLEVBQUVBLENBQUNBO1FBRXREQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxpQkFBaUJBLEVBQUVBLENBQUNBO1FBQ3hEQSxXQUFXQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxpQkFBaUJBLEVBQUVBLENBQUNBO1FBQ3REQSxhQUFhQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNsQkEsT0FBT0EsYUFBYUEsR0FBR0EsV0FBV0EsRUFBRUEsQ0FBQ0E7WUFDcENBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGlCQUFpQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDMURBLGFBQWFBLEVBQUVBLENBQUNBO1FBQ2pCQSxDQUFDQTtRQUNEQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxFQUFDQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUFDQSxDQUFDQSxDQUFDQTtRQUVuRUEsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDbENBLElBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFFNUNBLGFBQWFBLEdBQUdBLENBQUNBLENBQUNBO1FBQ2xCQSxPQUFPQSxhQUFhQSxHQUFHQSxVQUFVQSxFQUFFQSxDQUFDQTtZQUNuQ0EsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxDQUFDQTtZQUNwREEsUUFBUUEsR0FBR0EsSUFBSUEsUUFBUUEsRUFBRUEsQ0FBQ0E7WUFDMUJBLGFBQWFBLEdBQUdBLENBQUNBLENBQUNBO1lBQ2xCQSxPQUFPQSxhQUFhQSxHQUFHQSxhQUFhQSxFQUFFQSxDQUFDQTtnQkFDdENBLGFBQWFBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNsQkEsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0E7Z0JBQ2hEQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxRQUFRQSxHQUFHQSxPQUFPQSxDQUFDQTtnQkFDakRBLE9BQU9BLGFBQWFBLEdBQUdBLFdBQVdBLEVBQUVBLENBQUNBO29CQUNwQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3JDQSxPQUFPQSxHQUFlQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFFQSxDQUFDQSxhQUFhQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQTt3QkFDN0VBLEtBQUtBLEdBQUdBLElBQUlBLEtBQUtBLEVBQVVBLENBQUNBO3dCQUM1QkEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7d0JBQ1JBLE9BQU9BLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLFFBQVFBLEdBQUdBLE9BQU9BLEVBQUVBLENBQUNBOzRCQUMvQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQUE7NEJBQ3RDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFBQTs0QkFDdENBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLENBQUFBOzRCQUN0Q0EsS0FBS0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7NEJBQ2pCQSxLQUFLQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTs0QkFDakJBLEtBQUtBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO3dCQUNsQkEsQ0FBQ0E7d0JBQ0RBLE9BQU9BLEdBQUdBLElBQUlBLG1CQUFtQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0JBQ3hDQSxPQUFPQSxDQUFDQSxhQUFhQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTt3QkFDL0JBLE9BQU9BLENBQUNBLGVBQWVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO3dCQUMvQkEsT0FBT0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3RDQSxPQUFPQSxDQUFDQSxtQkFBbUJBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO3dCQUNsQ0EsT0FBT0EsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTt3QkFDbkNBLE9BQU9BLENBQUNBLGlCQUFpQkEsR0FBR0EsS0FBS0EsQ0FBQ0E7d0JBQ2xDQSxPQUFPQSxDQUFDQSxrQkFBa0JBLEdBQUdBLEtBQUtBLENBQUNBO3dCQUNuQ0EsYUFBYUEsRUFBRUEsQ0FBQ0E7d0JBQ2hCQSxRQUFRQSxDQUFDQSxjQUFjQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFBQTtvQkFDakNBLENBQUNBO29CQUFDQSxJQUFJQTt3QkFDTEEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsUUFBUUEsR0FBR0EsT0FBT0EsQ0FBQ0E7b0JBQ3hDQSxhQUFhQSxFQUFFQSxDQUFDQTtnQkFDakJBLENBQUNBO1lBQ0ZBLENBQUNBO1lBQ0RBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFFBQVFBLEVBQUVBLFNBQVNBLENBQUNBLENBQUNBO1lBQ25DQSxhQUFhQSxFQUFFQSxDQUFDQTtRQUNqQkEsQ0FBQ0E7UUFDREEsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxFQUFFQSxDQUFDQTtRQUMzQkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFFakNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO1FBQ2xDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUNmQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxrQ0FBa0NBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLDRCQUE0QkEsR0FBZUEsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBRUEsQ0FBQ0EsSUFBSUEsR0FBR0Esd0JBQXdCQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtJQUNsTEEsQ0FBQ0E7SUFFRGhDLGFBQWFBO0lBQ0xBLDJDQUF1QkEsR0FBL0JBLFVBQWdDQSxPQUFPQSxDQUFRQSxRQUFEQSxBQUFTQTtRQUV0RGlDLElBQUlBLGVBQXNCQSxFQUFDQSxPQUFEQSxBQUFRQTtRQUNsQ0EsSUFBSUEsWUFBWUEsR0FBVUEsRUFBRUEsQ0FBQ0E7UUFDN0JBLElBQUlBLElBQUlBLEdBQVVBLElBQUlBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO1FBQ3JDQSxJQUFJQSxVQUFVQSxHQUFtQkEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxDQUFDQTtRQUN6RUEsSUFBSUEsS0FBS0EsR0FBaUJBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLEVBQUNBLENBQUNBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUNBLENBQUNBLENBQUNBO1FBQ3JFQSxJQUFJQSxhQUFhQSxHQUFtQkEsQ0FBQ0EsQ0FBQ0E7UUFDdENBLElBQUlBLGNBQWNBLEdBQTJCQSxJQUFJQSxLQUFLQSxFQUFvQkEsQ0FBQ0E7UUFDM0VBLElBQUlBLFlBQVlBLEdBQXlCQSxJQUFJQSxLQUFLQSxFQUFrQkEsQ0FBQ0E7UUFDckVBLE9BQU9BLGFBQWFBLEdBQUdBLFVBQVVBLEVBQUVBLENBQUNBO1lBQ25DQSxlQUFlQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxlQUFlQSxFQUFFQSxDQUFDQTtZQUN4REEsSUFBSUEsYUFBYUEsR0FBY0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDOUZBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNyQkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsMENBQTBDQSxHQUFHQSxhQUFhQSxHQUFHQSxLQUFLQSxHQUFHQSxlQUFlQSxHQUFHQSwwQkFBMEJBLENBQUNBLENBQUNBO1lBQ25KQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDTEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsWUFBWUEsY0FBY0EsQ0FBQ0E7b0JBQy9DQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFBQTtnQkFDbkNBLEVBQUVBLENBQUNBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBLFlBQVlBLGdCQUFnQkEsQ0FBQ0E7b0JBQ2pEQSxjQUFjQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFBQTtZQUN0Q0EsQ0FBQ0E7WUFDREEsYUFBYUEsRUFBRUEsQ0FBQ0E7UUFDakJBLENBQUNBO1FBQ0RBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLFlBQVlBLENBQUNBLE1BQU1BLElBQUlBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLE1BQU1BLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hFQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSx1RUFBdUVBLENBQUNBLENBQUNBO1lBQ3hHQSxNQUFNQSxDQUFDQTtRQUNSQSxDQUFDQTtRQUNEQSxJQUFJQSxDQUFDQSxtQkFBbUJBLEVBQUVBLENBQUNBO1FBQzNCQSxFQUFFQSxDQUFDQSxDQUFDQSxZQUFZQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUM3QkEsSUFBSUEscUJBQXFCQSxHQUFzQkEsSUFBSUEsa0JBQWtCQSxFQUFFQSxDQUFDQTtZQUN4RUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBa0JBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFlBQVlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBO2dCQUMxREEscUJBQXFCQSxDQUFDQSxZQUFZQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNyREEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EscUJBQXFCQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNsREEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsR0FBR0EscUJBQXFCQSxDQUFDQTtZQUNuREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7Z0JBQ2ZBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLHNDQUFzQ0EsR0FBR0EsSUFBSUEsR0FBR0Esa0JBQWtCQSxHQUFHQSxxQkFBcUJBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLEdBQUdBLHVCQUF1QkEsR0FBR0EscUJBQXFCQSxDQUFDQSxjQUFjQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUV4TUEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdENBLGFBQWFBLEdBQUdBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBLFNBQVNBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBLENBQUNBO1lBQy9FQSxJQUFJQSx1QkFBdUJBLEdBQXdCQSxJQUFJQSxvQkFBb0JBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLGtCQUFrQkE7WUFDaEhBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQWtCQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxjQUFjQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQTtnQkFDNURBLHVCQUF1QkEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDekRBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLHVCQUF1QkEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDcERBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLElBQUlBLEdBQUdBLHVCQUF1QkEsQ0FBQ0E7WUFDckRBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO2dCQUNmQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSx3Q0FBd0NBLEdBQUdBLElBQUlBLEdBQUdBLGtCQUFrQkEsR0FBR0EsdUJBQXVCQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxHQUFHQSx1QkFBdUJBLEdBQUdBLHVCQUF1QkEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFFOU1BLENBQUNBO0lBQ0ZBLENBQUNBO0lBRURqQyxhQUFhQTtJQUNMQSxvQ0FBZ0JBLEdBQXhCQSxVQUF5QkEsT0FBT0EsQ0FBUUEsUUFBREEsQUFBU0E7UUFFL0NrQyxJQUFJQSxVQUFlQSxDQUFDQTtRQUNwQkEsSUFBSUEsa0JBQXlCQSxFQUFDQSxPQUFEQSxBQUFRQTtRQUNyQ0EsSUFBSUEsa0JBQW1DQSxDQUFDQTtRQUN4Q0EsSUFBSUEsWUFBWUEsR0FBVUEsRUFBRUEsQ0FBQ0E7UUFDN0JBLElBQUlBLElBQUlBLEdBQVVBLElBQUlBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO1FBQ3JDQSxJQUFJQSxJQUFJQSxHQUFtQkEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxDQUFDQTtRQUVuRUEsSUFBSUEsS0FBS0EsR0FBaUJBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLEVBQUNBLENBQUNBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUNBLENBQUNBLENBQUNBO1FBRXBFQSxrQkFBa0JBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBO1FBQzNEQSxJQUFJQSxnQkFBZ0JBLEdBQW1CQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxpQkFBaUJBLEVBQUVBLENBQUNBO1FBQy9FQSxJQUFJQSxZQUFZQSxHQUEwQkEsSUFBSUEsS0FBS0EsRUFBVUEsQ0FBQ0EsUUFBREEsQUFBU0EsQ0FBQ0E7UUFDdkVBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQWtCQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxnQkFBZ0JBLEVBQUVBLENBQUNBLEVBQUVBO1lBQ3ZEQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxlQUFlQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUUxREEsSUFBSUEsV0FBV0EsR0FBbUJBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGlCQUFpQkEsRUFBRUEsQ0FBQ0E7UUFDMUVBLElBQUlBLFFBQVFBLEdBQVdBLENBQUVBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGdCQUFnQkEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBRUEsQ0FBQ0E7UUFDdkVBLElBQUlBLENBQUNBLG1CQUFtQkEsRUFBRUEsQ0FBQ0E7UUFDM0JBLElBQUlBLENBQUNBLG1CQUFtQkEsRUFBRUEsQ0FBQ0E7UUFFM0JBLElBQUlBLGFBQXdCQSxDQUFDQTtRQUM3QkEsSUFBSUEsWUFBWUEsR0FBZUEsSUFBSUEsS0FBS0EsRUFBUUEsQ0FBQ0E7UUFFakRBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFlBQVlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQzFDQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNyRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3BCQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFRQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM3Q0EsQ0FBQ0E7UUFDREEsYUFBYUEsR0FBR0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0Esa0JBQWtCQSxFQUFFQSxDQUFDQSxTQUFTQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNqRkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdkJBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLG9DQUFvQ0EsR0FBR0Esa0JBQWtCQSxHQUFHQSxzQkFBc0JBLENBQUNBLENBQUNBO1lBQUFBLENBQUNBO1lBQ3BIQSxNQUFNQSxDQUFBQTtRQUNQQSxDQUFDQTtRQUNEQSxrQkFBa0JBLEdBQXNCQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUN6REEsSUFBSUEsWUFBeUJBLENBQUNBO1FBQzlCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUVmQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxTQUFTQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN6RUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3ZCQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxnQ0FBZ0NBLEdBQUdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLHNCQUFzQkEsQ0FBQ0EsQ0FBQ0E7Z0JBQzVHQSxNQUFNQSxDQUFBQTtZQUNQQSxDQUFDQTtZQUNEQSxZQUFZQSxHQUFHQSxJQUFJQSxnQkFBZ0JBLENBQXdCQSxrQkFBa0JBLEVBQWFBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBRTdHQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNwQkEsWUFBWUEsR0FBR0EsSUFBSUEsY0FBY0EsQ0FBc0JBLGtCQUFrQkEsQ0FBQ0EsQ0FBQ0E7UUFFNUVBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFlBQVlBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1FBQ3pDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxJQUFJQSxHQUFHQSxZQUFZQSxDQUFDQTtRQUMxQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsWUFBWUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7WUFDMUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLENBQUNBO2dCQUNiQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxRQUFRQSxHQUF1QkEsWUFBYUEsQ0FBQ0E7WUFDOURBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLENBQUNBO2dCQUNiQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxRQUFRQSxHQUFxQkEsWUFBYUEsQ0FBQ0E7UUFFN0RBLENBQUNBO1FBQ0RBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO1lBQ2ZBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLDRCQUE0QkEsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7SUFDbkRBLENBQUNBO0lBRURsQyxrREFBa0RBO0lBQzFDQSx5Q0FBcUJBLEdBQTdCQSxVQUE4QkEsT0FBY0E7UUFHM0NtQyxJQUFJQSxVQUFVQSxHQUFVQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxpQkFBaUJBLEVBQUVBLENBQUNBO1FBQ2hFQSxJQUFJQSxrQkFBbUNBLENBQUNBO1FBRXhDQSxJQUFJQSxLQUFLQSxHQUFpQkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsRUFBQ0EsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsR0FBR0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsR0FBR0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsR0FBR0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsR0FBR0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsR0FBR0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsR0FBR0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsR0FBR0EsRUFBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsRUFBRUEsR0FBR0EsRUFBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsRUFBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDL2RBLElBQUlBLFFBQWVBLENBQUNBO1FBQ3BCQSxJQUFJQSxhQUF3QkEsQ0FBQ0E7UUFFN0JBLE1BQU1BLENBQUNBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO1lBRXBCQSxLQUFLQSxHQUFHQTtnQkFDUEEsa0JBQWtCQSxHQUFHQSxJQUFJQSx1QkFBdUJBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLElBQUlBLEtBQUtBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUN4SUEsS0FBS0EsQ0FBQ0E7WUFDUEEsS0FBS0EsR0FBR0E7Z0JBQ1BBLGtCQUFrQkEsR0FBR0EsSUFBSUEsMEJBQTBCQSxFQUFFQSxDQUFDQTtnQkFDdERBLElBQUlBLE1BQU1BLEdBQW1CQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxVQUFVQSxDQUFDQSxDQUFDQTtnQkFDMUJBLGtCQUFtQkEsQ0FBQ0EsY0FBY0EsR0FBR0EsSUFBSUEsY0FBY0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsSUFBSUEsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsSUFBSUEsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzdQQSxLQUFLQSxDQUFDQTtZQUNQQSxLQUFLQSxHQUFHQTtnQkFFUEEsUUFBUUEsR0FBR0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzNCQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxTQUFTQSxFQUFFQSxRQUFRQSxDQUFDQSxDQUFDQTtnQkFHakNBLGFBQWFBLEdBQUdBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLFFBQVFBLEVBQUVBLENBQUVBLFNBQVNBLENBQUNBLE9BQU9BLENBQUVBLEVBQUVBLGFBQWFBLENBQUNBLENBQUNBO2dCQUNsRkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3JCQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxrQ0FBa0NBLEdBQUdBLFFBQVFBLEdBQUdBLDBCQUEwQkEsQ0FBQ0EsQ0FBQ0E7Z0JBQzVHQSxrQkFBa0JBLEdBQUdBLElBQUlBLGtCQUFrQkEsQ0FBbUJBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBLEVBQVdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUM1R0EsUUFBUUEsR0FBR0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzNCQSxFQUFFQSxDQUFDQSxDQUFDQSxRQUFRQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDbEJBLGFBQWFBLEdBQUdBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBLFNBQVNBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO29CQUNqRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3JCQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSx3Q0FBd0NBLEdBQUdBLFFBQVFBLEdBQUdBLDBCQUEwQkEsQ0FBQ0EsQ0FBQ0E7Z0JBSW5IQSxDQUFDQTtnQkFDREEsS0FBS0EsQ0FBQ0E7WUFDUEEsS0FBS0EsR0FBR0E7Z0JBQ1BBLFFBQVFBLEdBQUdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUMzQkEsYUFBYUEsR0FBR0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDckJBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLG9DQUFvQ0EsR0FBR0EsUUFBUUEsR0FBR0EsNEJBQTRCQSxDQUFDQSxDQUFDQTtnQkFDaEhBLGtCQUFrQkEsR0FBR0EsSUFBSUEsb0JBQW9CQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSx3QkFBd0JBO2dCQUNoSUEsS0FBS0EsQ0FBQ0E7WUFRUEEsS0FBS0EsR0FBR0E7Z0JBQ1BBLGtCQUFrQkEsR0FBR0EsSUFBSUEsb0JBQW9CQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxRQUFRQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxXQUFXQTtnQkFDNUhBLEtBQUtBLENBQUNBO1lBQ1BBLEtBQUtBLEdBQUdBO2dCQUNQQSxRQUFRQSxHQUFHQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDM0JBLGFBQWFBLEdBQUdBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBLFNBQVNBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO2dCQUNqRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3JCQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSx5Q0FBeUNBLEdBQUdBLFFBQVFBLEdBQUdBLDZCQUE2QkEsQ0FBQ0EsQ0FBQ0E7Z0JBQ3RIQSxrQkFBa0JBLEdBQUdBLElBQUlBLHFCQUFxQkEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3hGQSxLQUFLQSxDQUFDQTtZQVlQQSxLQUFLQSxHQUFHQTtnQkFDUEEsUUFBUUEsR0FBR0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzNCQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQSxTQUFTQSxDQUFDQSxPQUFPQSxDQUFDQSxFQUFFQSxhQUFhQSxDQUFDQSxDQUFDQTtnQkFDaEZBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUNyQkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0Esa0NBQWtDQSxHQUFHQSxRQUFRQSxHQUFHQSxpQ0FBaUNBLENBQUNBLENBQUNBO2dCQUNuSEEsa0JBQWtCQSxHQUFHQSxJQUFJQSx5QkFBeUJBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUN4RkEsS0FBS0EsQ0FBQ0E7WUFDUEEsS0FBS0EsR0FBR0E7Z0JBQ1BBLGtCQUFrQkEsR0FBR0EsSUFBSUEsZUFBZUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzVHQSxLQUFLQSxDQUFDQTtRQUVSQSxDQUFDQTtRQUNEQSxJQUFJQSxDQUFDQSxtQkFBbUJBLEVBQUVBLENBQUNBO1FBQzNCQSxNQUFNQSxDQUFDQSxrQkFBa0JBLENBQUNBO0lBRTNCQSxDQUFDQTtJQUVPbkMsdUNBQW1CQSxHQUEzQkE7UUFFQ29DLElBQUlBLFVBQWlCQSxDQUFDQTtRQUN0QkEsSUFBSUEsUUFBZUEsQ0FBQ0E7UUFDcEJBLElBQUlBLFdBQWtCQSxDQUFDQTtRQUV2QkEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0E7UUFFakRBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBRWxCQSxJQUFJQSxRQUFlQSxDQUFDQTtZQUVwQkEsVUFBVUEsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFFaEJBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLFFBQVFBLEdBQUdBLFFBQVFBLENBQUNBO1lBRW5EQSxPQUFPQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxRQUFRQSxHQUFHQSxRQUFRQSxFQUFFQSxDQUFDQTtnQkFDaERBLElBQUlBLEtBQVlBLENBQUNBO2dCQUNqQkEsSUFBSUEsUUFBZUEsQ0FBQ0E7Z0JBQ3BCQSxJQUFJQSxTQUFnQkEsQ0FBQ0E7Z0JBQ3JCQSxJQUFJQSxRQUFlQSxDQUFDQTtnQkFDcEJBLElBQUlBLFFBQVlBLENBQUNBO2dCQUVqQkEsQUFDQUEsa0RBRGtEQTtnQkFDbERBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGdCQUFnQkEsRUFBRUEsQ0FBQ0E7Z0JBQy9DQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxFQUFFQSxDQUFDQTtnQkFDOUJBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGdCQUFnQkEsRUFBRUEsQ0FBQ0E7Z0JBQ25EQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxlQUFlQSxFQUFFQSxDQUFDQTtnQkFFakRBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLFFBQVFBLEdBQUdBLFFBQVFBLENBQUNBLEdBQUdBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO29CQUMxREEsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsMENBQTBDQSxHQUFHQSxXQUFXQSxHQUFHQSxxQ0FBcUNBLENBQUNBLENBQUNBO29CQUM5R0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsUUFBUUEsR0FBR0EsUUFBUUEsQ0FBQ0E7b0JBQ3hDQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQTtnQkFDbkJBLENBQUNBO2dCQUVEQSxNQUFNQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDbkJBLEtBQUtBLFNBQVNBLENBQUNBLFNBQVNBO3dCQUN2QkEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7d0JBQ3REQSxLQUFLQSxDQUFDQTtvQkFDUEEsS0FBS0EsU0FBU0EsQ0FBQ0EsSUFBSUE7d0JBQ2xCQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTt3QkFDMUNBLEtBQUtBLENBQUNBO29CQUNQQSxLQUFLQSxTQUFTQSxDQUFDQSxLQUFLQTt3QkFDbkJBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLFNBQVNBLEVBQUVBLENBQUNBO3dCQUMzQ0EsS0FBS0EsQ0FBQ0E7b0JBQ1BBLEtBQUtBLFNBQVNBLENBQUNBLEtBQUtBO3dCQUNuQkEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7d0JBQ3pDQSxLQUFLQSxDQUFDQTtvQkFDUEEsS0FBS0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0E7b0JBQ3BCQSxLQUFLQSxTQUFTQSxDQUFDQSxLQUFLQTt3QkFDbkJBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGdCQUFnQkEsRUFBRUEsQ0FBQ0E7d0JBQ2xEQSxLQUFLQSxDQUFDQTtvQkFDUEEsS0FBS0EsU0FBU0EsQ0FBQ0EsTUFBTUE7d0JBQ3BCQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxpQkFBaUJBLEVBQUVBLENBQUNBO3dCQUNuREEsS0FBS0EsQ0FBQ0E7b0JBQ1BBLEtBQUtBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBO29CQUN0QkEsS0FBS0EsU0FBU0EsQ0FBQ0EsS0FBS0E7d0JBQ25CQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxlQUFlQSxFQUFFQSxDQUFDQTt3QkFDakRBLEtBQUtBLENBQUNBO29CQUNQQSxLQUFLQSxTQUFTQSxDQUFDQSxPQUFPQTt3QkFDckJBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLFNBQVNBLEVBQUVBLENBQUNBO3dCQUMzQ0EsS0FBS0EsQ0FBQ0E7b0JBQ1BBLEtBQUtBLFNBQVNBLENBQUNBLE9BQU9BO3dCQUNyQkEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7d0JBQzVDQSxLQUFLQSxDQUFDQTtvQkFDUEE7d0JBQ0NBLFFBQVFBLEdBQUdBLCtCQUErQkEsR0FBR0EsU0FBU0EsQ0FBQ0E7d0JBQ3ZEQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxRQUFRQSxJQUFJQSxRQUFRQSxDQUFDQTt3QkFDekNBLEtBQUtBLENBQUNBO2dCQUNSQSxDQUFDQTtnQkFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2pCQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxvQkFBb0JBLEdBQUdBLFFBQVFBLEdBQUdBLGNBQWNBLEdBQUdBLFFBQVFBLENBQUNBLENBQUNBO2dCQUMxRUEsQ0FBQ0E7Z0JBRURBLFVBQVVBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLFFBQVFBLENBQUNBO2dCQUNoQ0EsV0FBV0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDbEJBLENBQUNBO1FBQ0ZBLENBQUNBO1FBRURBLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBO0lBQ25CQSxDQUFDQTtJQUVPcEMsbUNBQWVBLEdBQXZCQSxVQUF3QkEsUUFBZUE7UUFFdENxQyxJQUFJQSxRQUFlQSxDQUFDQTtRQUNwQkEsSUFBSUEsUUFBZUEsQ0FBQ0E7UUFDcEJBLElBQUlBLFdBQVdBLEdBQVVBLENBQUNBLENBQUNBO1FBQzNCQSxJQUFJQSxLQUFLQSxHQUFpQkEsSUFBSUEsYUFBYUEsRUFBRUEsQ0FBQ0E7UUFFOUNBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBO1FBQ2pEQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxRQUFRQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUVuREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFZEEsT0FBT0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsUUFBUUEsR0FBR0EsUUFBUUEsRUFBRUEsQ0FBQ0E7Z0JBQ2hEQSxJQUFJQSxHQUFVQSxDQUFDQTtnQkFDZkEsSUFBSUEsR0FBVUEsQ0FBQ0E7Z0JBQ2ZBLElBQUlBLElBQVdBLENBQUNBO2dCQUVoQkEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxDQUFDQTtnQkFDOUNBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBO2dCQUU1Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsUUFBUUEsR0FBR0EsR0FBR0EsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3JEQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSx5Q0FBeUNBLEdBQUdBLFdBQVdBLEdBQUdBLHFDQUFxQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzdHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxRQUFRQSxHQUFHQSxRQUFRQSxDQUFDQTtvQkFDeENBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO2dCQUNkQSxDQUFDQTtnQkFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzdDQSxJQUFJQSxHQUFHQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDckJBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLElBQUlBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUNoREEsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUNQQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxRQUFRQSxJQUFJQSxHQUFHQSxDQUFDQTtnQkFDckNBLENBQUNBO2dCQUVEQSxXQUFXQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUVsQkEsQ0FBQ0E7UUFDRkEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDUEEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsUUFBUUEsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDekNBLENBQUNBO1FBRURBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO0lBRWRBLENBQUNBO0lBRU9yQyxrQ0FBY0EsR0FBdEJBLFVBQXVCQSxJQUFXQSxFQUFFQSxHQUFVQTtRQUU3Q3NDLElBQUlBLFFBQWVBLENBQUNBO1FBQ3BCQSxJQUFJQSxTQUFrQkEsQ0FBQ0E7UUFFdkJBLE1BQU1BLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO1lBRWRBLEtBQUtBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBO1lBQ3BCQSxLQUFLQSxTQUFTQSxDQUFDQSxJQUFJQTtnQkFDbEJBLFFBQVFBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNiQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxRQUFRQSxDQUFDQTtnQkFDekNBLEtBQUtBLENBQUNBO1lBRVBBLEtBQUtBLFNBQVNBLENBQUNBLEtBQUtBO2dCQUNuQkEsUUFBUUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2JBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLFNBQVNBLENBQUNBO2dCQUMxQ0EsS0FBS0EsQ0FBQ0E7WUFFUEEsS0FBS0EsU0FBU0EsQ0FBQ0EsS0FBS0E7Z0JBQ25CQSxRQUFRQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDYkEsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7Z0JBQ3hDQSxLQUFLQSxDQUFDQTtZQUVQQSxLQUFLQSxTQUFTQSxDQUFDQSxLQUFLQTtnQkFDbkJBLFFBQVFBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNiQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxnQkFBZ0JBLENBQUNBO2dCQUNqREEsS0FBS0EsQ0FBQ0E7WUFFUEEsS0FBS0EsU0FBU0EsQ0FBQ0EsTUFBTUE7Z0JBQ3BCQSxRQUFRQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDYkEsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsaUJBQWlCQSxDQUFDQTtnQkFDbERBLEtBQUtBLENBQUNBO1lBRVBBLEtBQUtBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBO1lBQ3RCQSxLQUFLQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUNyQkEsS0FBS0EsU0FBU0EsQ0FBQ0EsS0FBS0E7Z0JBQ25CQSxRQUFRQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDYkEsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsZUFBZUEsQ0FBQ0E7Z0JBQ2hEQSxLQUFLQSxDQUFDQTtZQUVQQSxLQUFLQSxTQUFTQSxDQUFDQSxPQUFPQTtnQkFDckJBLFFBQVFBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNiQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxTQUFTQSxDQUFDQTtnQkFDMUNBLEtBQUtBLENBQUNBO1lBRVBBLEtBQUtBLFNBQVNBLENBQUNBLE9BQU9BO2dCQUNyQkEsUUFBUUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2JBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLFVBQVVBLENBQUNBO2dCQUMzQ0EsS0FBS0EsQ0FBQ0E7WUFFUEEsS0FBS0EsU0FBU0EsQ0FBQ0EsU0FBU0E7Z0JBQ3ZCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxZQUFZQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUU5Q0EsS0FBS0EsU0FBU0EsQ0FBQ0EsU0FBU0EsQ0FBQ0E7WUFDekJBLEtBQUtBLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBO1lBQ3pCQSxLQUFLQSxTQUFTQSxDQUFDQSxTQUFTQSxDQUFDQTtZQUN6QkEsS0FBS0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFDdEJBLEtBQUtBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBO1lBQ3RCQSxLQUFLQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUN0QkEsS0FBS0EsU0FBU0EsQ0FBQ0EsTUFBTUE7Z0JBQ3BCQSxRQUFRQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDYkEsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsVUFBVUEsQ0FBQ0E7Z0JBQzNDQSxLQUFLQSxDQUFDQTtRQUVSQSxDQUFDQTtRQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxRQUFRQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNwQkEsSUFBSUEsSUFBSUEsR0FBY0EsRUFBRUEsQ0FBQ0E7WUFDekJBLElBQUlBLFFBQVFBLEdBQVVBLENBQUNBLENBQUNBO1lBQ3hCQSxJQUFJQSxTQUFTQSxHQUFVQSxHQUFHQSxHQUFDQSxRQUFRQSxDQUFDQTtZQUVwQ0EsT0FBT0EsUUFBUUEsR0FBR0EsU0FBU0EsRUFBRUEsQ0FBQ0E7Z0JBQzdCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQSxFQUFFQSwwQkFBMEJBO2dCQUMzRUEsUUFBUUEsRUFBRUEsQ0FBQ0E7WUFDWkEsQ0FBQ0E7WUFFREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDYkEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFFUEEsSUFBSUEsR0FBR0EsR0FBT0EsU0FBU0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsRUFBQ0EsY0FBY0E7WUFDakVBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBO1FBQ1pBLENBQUNBO0lBQ0ZBLENBQUNBO0lBRU90QywrQkFBV0EsR0FBbkJBO1FBRUN1QyxJQUFJQSxLQUFZQSxDQUFDQTtRQUNqQkEsSUFBSUEsUUFBZUEsQ0FBQ0E7UUFFcEJBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLEdBQUdBLENBQUNBLEVBQUVBLHNDQUFzQ0E7UUFFbkVBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLGdCQUFnQkEsRUFBRUEsQ0FBQ0E7UUFDckRBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLGdCQUFnQkEsRUFBRUEsQ0FBQ0E7UUFFckRBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLGlCQUFpQkEsRUFBRUEsRUFBRUEsa0JBQWtCQTtRQUU5REEsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFFdkRBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hEQSxJQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxFQUFFQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUM1REEsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFDekRBLElBQUlBLENBQUNBLGNBQWNBLEdBQUdBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEVBQUVBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1FBQzVEQSxDQUFDQTtRQUVEQSxBQUdBQSxxRkFIcUZBO1FBRXJGQSw2QkFBNkJBO1FBQzdCQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxTQUFTQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUVwQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdkJBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLFNBQVNBLENBQUNBLE9BQU9BLENBQUNBO1FBQ3JDQSxDQUFDQTtRQUVEQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxTQUFTQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUV2Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDMUJBLElBQUlBLENBQUNBLGFBQWFBLEdBQUdBLFNBQVNBLENBQUNBLE9BQU9BLENBQUNBO1FBQ3hDQSxDQUFDQTtRQUVEQSxJQUFJQSxDQUFDQSxZQUFZQSxHQUFHQSxTQUFTQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUV0Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDekJBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLFNBQVNBLENBQUNBLE9BQU9BLENBQUNBO1FBQ3ZDQSxDQUFDQTtRQUVEQSxJQUFJQSxDQUFDQSxZQUFZQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxnQkFBZ0JBLEVBQUVBLEVBQUVBLGNBQWNBO1FBRXJFQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNqQkEsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsOEJBQThCQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMxRkEsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0Esa0NBQWtDQSxHQUFHQSxJQUFJQSxDQUFDQSxZQUFZQSxHQUFHQSxpQkFBaUJBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLHdCQUF3QkEsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsMEJBQTBCQSxHQUFHQSxJQUFJQSxDQUFDQSxZQUFZQSxHQUFHQSw0QkFBNEJBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBO1FBQ25RQSxDQUFDQTtRQUVEQSxBQUNBQSx1QkFEdUJBO1FBQ3ZCQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxlQUFlQSxFQUFFQSxDQUFDQTtRQUM1Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsSUFBSUEsUUFBUUEsSUFBSUEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4RUEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0Esd0RBQXdEQSxDQUFDQSxDQUFDQTtRQUMvRUEsQ0FBQ0E7SUFFRkEsQ0FBQ0E7SUFDRHZDLHFCQUFxQkE7SUFDYkEsMkNBQXVCQSxHQUEvQkEsVUFBZ0NBLE1BQU1BLENBQVFBLFFBQURBLEFBQVNBO1FBRXJEd0MsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsWUFBWUEsSUFBSUEsQ0FBQ0E7WUFDOUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEtBQUtBLENBQUNBO1FBQ3BDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxxQkFBcUJBLENBQUNBO1lBQzlDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxxQkFBcUJBLENBQUNBO1FBQ25EQSxJQUFJQSxRQUFRQSxHQUF3QkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsSUFBS0EsQ0FBQ0E7UUFDL0RBLElBQUlBLE1BQU1BLEdBQWtCQSxDQUFDQSxDQUFDQTtRQUM5QkEsSUFBSUEsRUFBZ0JBLENBQUNBO1FBQ3JCQSxJQUFJQSxPQUFPQSxDQUFRQSxRQUFEQSxBQUFTQSxDQUFDQTtRQUM1QkEsSUFBSUEsS0FBS0EsQ0FBUUEsUUFBREEsQUFBU0EsQ0FBQ0E7UUFDMUJBLElBQUlBLFNBQVNBLENBQVFBLFFBQURBLEFBQVNBLENBQUNBO1FBQzlCQSxJQUFJQSxDQUFDQSxDQUFRQSxPQUFEQSxBQUFRQSxDQUFDQTtRQUNyQkEsSUFBSUEsTUFBb0JBLENBQUNBO1FBQ3pCQSxJQUFJQSxRQUE0QkEsQ0FBQ0E7UUFDakNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLHFCQUFxQkEsR0FBR0EsSUFBSUEsS0FBS0EsRUFBaUJBLENBQUNBO1FBQ3hFQSxPQUFPQSxNQUFNQSxHQUFHQSxRQUFRQSxDQUFDQSxhQUFhQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtZQUMvQ0EsTUFBTUEsR0FBR0EsSUFBSUEsS0FBS0EsRUFBVUEsQ0FBQ0E7WUFDN0JBLFFBQVFBLEdBQXlCQSxRQUFRQSxDQUFDQSxhQUFhQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtZQUNoRUEsU0FBU0EsR0FBR0EsUUFBUUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7WUFDakNBLEVBQUVBLEdBQUdBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBO1lBQ2xCQSxPQUFPQSxHQUFHQSxRQUFRQSxDQUFDQSxTQUFTQSxDQUFDQSxtQkFBbUJBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO1lBQzFEQSxLQUFLQSxHQUFHQSxRQUFRQSxDQUFDQSxTQUFTQSxDQUFDQSxtQkFBbUJBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO1lBQ3hEQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxTQUFTQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDaENBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLEdBQUNBLE9BQU9BLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUN2Q0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0EsR0FBQ0EsT0FBT0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeENBLENBQUNBO1lBQ0RBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7WUFDeERBLE1BQU1BLEVBQUVBLENBQUNBO1FBQ1ZBLENBQUNBO1FBQ0RBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLHFCQUFxQkEsQ0FBQ0E7SUFDbkRBLENBQUNBO0lBRU94QywrQkFBV0EsR0FBbkJBO1FBR0N5QyxJQUFJQSxHQUFHQSxHQUFVQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxpQkFBaUJBLEVBQUVBLENBQUNBO1FBQ3pEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxZQUFZQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtJQUM5Q0EsQ0FBQ0E7SUFFT3pDLGdDQUFZQSxHQUFwQkEsVUFBcUJBLE9BQWNBLEVBQUVBLGVBQTZCQSxFQUFFQSxhQUFzQ0E7UUFBdEMwQyw2QkFBc0NBLEdBQXRDQSwrQkFBc0NBO1FBRXpHQSxJQUFJQSxXQUFXQSxHQUFjQSxJQUFJQSxLQUFLQSxFQUFPQSxDQUFDQTtRQUM5Q0EsSUFBSUEsT0FBT0EsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFDdkJBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2pCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDM0JBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO29CQUNoQ0EsT0FBT0EsT0FBT0EsR0FBR0EsZUFBZUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7d0JBRXpDQSxJQUFJQSxNQUFNQSxHQUFtQkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0E7d0JBRXhEQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxJQUFJQSxlQUFlQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDbERBLEFBQ0FBLGtDQURrQ0E7NEJBQ2xDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxlQUFlQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxTQUFTQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxJQUFJQSxhQUFhQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FDekZBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLElBQUlBLFlBQVlBLGdCQUFnQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0NBQzVEQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQ0FDdkJBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO29DQUM3Q0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7Z0NBQ3BCQSxDQUFDQTs0QkFDRkEsQ0FBQ0E7NEJBQ0RBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLGVBQWVBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLFNBQVNBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLElBQUlBLGVBQWVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dDQUMzRkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsWUFBWUEsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0NBQ3hEQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQ0FDdkJBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO29DQUM3Q0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7Z0NBQ3BCQSxDQUFDQTs0QkFDRkEsQ0FBQ0E7NEJBQUNBLElBQUlBLENBQUNBLENBQUNBO2dDQUNQQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQ0FDdkJBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO2dDQUM3Q0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7NEJBRXBCQSxDQUFDQTt3QkFDRkEsQ0FBQ0E7d0JBQ0RBLEFBQ0FBLHdIQUR3SEE7d0JBQ3hIQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxlQUFlQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxTQUFTQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxJQUFJQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFFOUZBLElBQUlBLElBQUlBLEdBQWVBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLElBQUlBLENBQUFBOzRCQUVqREEsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7NEJBQ3ZCQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTs0QkFDaENBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBO3dCQUVwQkEsQ0FBQ0E7d0JBRURBLE9BQU9BLEVBQUVBLENBQUNBO29CQUNYQSxDQUFDQTtnQkFDRkEsQ0FBQ0E7WUFDRkEsQ0FBQ0E7UUFDRkEsQ0FBQ0E7UUFDREEsQUFDQUEsMEdBRDBHQTtRQUMxR0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDeEJBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLGFBQWFBLENBQUNBLENBQUNBLENBQUNBO1FBQzFFQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQTtJQUNwQkEsQ0FBQ0E7SUFFTzFDLG1DQUFlQSxHQUF2QkEsVUFBd0JBLFNBQWdCQSxFQUFFQSxhQUFvQkE7UUFFN0QyQyxNQUFNQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNkQSxLQUFLQSxDQUFDQSxTQUFTQSxJQUFJQSxTQUFTQSxDQUFDQSxPQUFPQSxDQUFDQTtnQkFDcENBLEVBQUVBLENBQUNBLENBQUNBLGFBQWFBLElBQUlBLGFBQWFBLENBQUNBO29CQUNsQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EscUJBQXFCQSxFQUFFQSxDQUFDQTtnQkFDckNBLEVBQUVBLENBQUNBLENBQUNBLGFBQWFBLElBQUlBLGVBQWVBLENBQUNBO29CQUNwQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxDQUFDQTtnQkFDakNBLEtBQUtBLENBQUNBO1lBQ1BBLEtBQUtBLENBQUNBLFNBQVNBLElBQUlBLFNBQVNBLENBQUNBLFFBQVFBLENBQUNBO2dCQUNyQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxFQUFFQSxDQUFBQTtnQkFDaENBLEtBQUtBLENBQUNBO1lBQ1BBO2dCQUNDQSxLQUFLQSxDQUFDQTtRQUNSQSxDQUFDQTtRQUVEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNiQSxDQUFDQTtJQUVPM0Msc0NBQWtCQSxHQUExQkE7UUFFQzRDLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLHNCQUFzQkEsQ0FBQ0E7WUFDaENBLElBQUlBLENBQUNBLHNCQUFzQkEsR0FBNEJBLHNCQUFzQkEsQ0FBQ0Esa0JBQWtCQSxFQUFFQSxDQUFDQTtRQUVwR0EsTUFBTUEsQ0FBWUEsSUFBSUEsQ0FBQ0Esc0JBQXNCQSxDQUFDQTtJQUMvQ0EsQ0FBQ0E7SUFFTzVDLHFDQUFpQkEsR0FBekJBO1FBRUM2QyxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQTtZQUN6QkEsSUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0Esc0JBQXNCQSxDQUFDQSxpQkFBaUJBLEVBQUVBLENBQUNBO1FBRW5FQSxNQUFNQSxDQUFVQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQTtJQUV0Q0EsQ0FBQ0E7SUFFTzdDLHlDQUFxQkEsR0FBN0JBO1FBRUM4QyxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxtQkFBbUJBLENBQUNBLENBQUNBLENBQUNBO1lBQy9CQSxJQUFJQSxhQUFhQSxHQUFjQSxzQkFBc0JBLENBQUNBLHlCQUF5QkEsRUFBRUEsQ0FBQ0E7WUFFbEZBLElBQUlBLENBQUNBLG1CQUFtQkEsR0FBR0EsSUFBSUEsaUJBQWlCQSxDQUFDQSxhQUFhQSxFQUFFQSxhQUFhQSxFQUFFQSxhQUFhQSxFQUFFQSxhQUFhQSxFQUFFQSxhQUFhQSxFQUFFQSxhQUFhQSxDQUFDQSxDQUFDQTtZQUMzSUEsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxJQUFJQSxHQUFHQSxvQkFBb0JBLENBQUNBO1FBQ3REQSxDQUFDQTtRQUVEQSxNQUFNQSxDQUFVQSxJQUFJQSxDQUFDQSxtQkFBbUJBLENBQUNBO0lBQzFDQSxDQUFDQTtJQUVPOUMsOEJBQVVBLEdBQWxCQSxVQUFtQkEsU0FBeUJBO1FBQXpCK0MseUJBQXlCQSxHQUF6QkEsaUJBQXlCQTtRQUUzQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0E7WUFDYkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7UUFDekNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLFNBQVNBLEVBQUVBLENBQUNBO0lBRXhDQSxDQUFDQTtJQUVPL0MsaUNBQWFBLEdBQXJCQTtRQUVDZ0QsTUFBTUEsQ0FBQ0EsSUFBSUEsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxFQUFFQSxDQUFDQSxDQUFDQTtJQUNsREEsQ0FBQ0E7SUFFT2hELHdDQUFvQkEsR0FBNUJBO1FBRUNpRCxJQUFJQSxDQUFRQSxDQUFDQTtRQUNiQSxJQUFJQSxPQUFPQSxHQUFpQkEsSUFBSUEsS0FBS0EsQ0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDakRBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQ3hCQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQTtRQUM5Q0EsQ0FBQ0E7UUFFREEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7SUFDaEJBLENBQUNBO0lBRU9qRCx3Q0FBb0JBLEdBQTVCQTtRQUVDa0QsSUFBSUEsT0FBT0EsR0FBaUJBLElBQUlBLEtBQUtBLENBQVNBLEVBQUVBLENBQUNBLENBQUNBO1FBRWxEQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQTtRQUNuREEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7UUFDbkRBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBQ25EQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUNqQkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7UUFDbkRBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBQ25EQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQTtRQUNuREEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7UUFDakJBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBQ25EQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQTtRQUNuREEsT0FBT0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7UUFDcERBLE9BQU9BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO1FBQ2xCQSxPQUFPQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQTtRQUNwREEsT0FBT0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7UUFDcERBLE9BQU9BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBQ3BEQSxPQUFPQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUVsQkEsQUFFQUEsMEVBRjBFQTtRQUUxRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdkJBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ2ZBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ2ZBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ2ZBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ2ZBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ2ZBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ2ZBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ2ZBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ2ZBLE9BQU9BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ2hCQSxPQUFPQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNoQkEsT0FBT0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDaEJBLE9BQU9BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBRWpCQSxDQUFDQTtRQUVEQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQTtJQUNoQkEsQ0FBQ0E7SUFob0ZhbEQsOEJBQW9CQSxHQUFVQSxNQUFNQSxDQUFDQTtJQUNyQ0Esc0JBQVlBLEdBQVVBLENBQUNBLENBQUNBO0lBQ3hCQSxpQkFBT0EsR0FBVUEsQ0FBQ0EsQ0FBQ0E7SUFDbkJBLGNBQUlBLEdBQVVBLENBQUNBLENBQUNBO0lBQ2hCQSxjQUFJQSxHQUFVQSxDQUFDQSxDQUFDQTtJQUNoQkEsZUFBS0EsR0FBVUEsQ0FBQ0EsQ0FBQ0E7SUFDakJBLGVBQUtBLEdBQVVBLENBQUNBLENBQUNBO0lBQ2pCQSxlQUFLQSxHQUFVQSxDQUFDQSxDQUFDQTtJQUNqQkEsZ0JBQU1BLEdBQVVBLENBQUNBLENBQUNBO0lBQ2xCQSxnQkFBTUEsR0FBVUEsQ0FBQ0EsQ0FBQ0E7SUFDbEJBLGlCQUFPQSxHQUFVQSxDQUFDQSxDQUFDQTtJQUNuQkEsaUJBQU9BLEdBQVVBLENBQUNBLENBQUNBO0lBQ25CQSxjQUFJQSxHQUFVQSxFQUFFQSxDQUFDQTtJQUNqQkEsZUFBS0EsR0FBVUEsRUFBRUEsQ0FBQ0E7SUFDbEJBLGVBQUtBLEdBQVVBLEVBQUVBLENBQUNBO0lBQ2xCQSxtQkFBU0EsR0FBVUEsRUFBRUEsQ0FBQ0E7SUFDdEJBLHNCQUFZQSxHQUFVQSxFQUFFQSxDQUFDQTtJQUN6QkEsbUJBQVNBLEdBQVVBLEVBQUVBLENBQUNBO0lBQ3RCQSxtQkFBU0EsR0FBVUEsRUFBRUEsQ0FBQ0E7SUFDdEJBLG1CQUFTQSxHQUFVQSxFQUFFQSxDQUFDQTtJQUN0QkEsZ0JBQU1BLEdBQVVBLEVBQUVBLENBQUNBO0lBQ25CQSxnQkFBTUEsR0FBVUEsRUFBRUEsQ0FBQ0E7SUFDbkJBLGdCQUFNQSxHQUFVQSxFQUFFQSxDQUFDQTtJQUNuQkEsZ0JBQU1BLEdBQVVBLEVBQUVBLENBQUNBO0lBMm1GbENBLGdCQUFDQTtBQUFEQSxDQTdwRkEsQUE2cEZDQSxFQTdwRnVCLFVBQVUsRUE2cEZqQztBQUVELEFBQW1CLGlCQUFWLFNBQVMsQ0FBQyIsImZpbGUiOiJwYXJzZXJzL0FXRFBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvcm9iYmF0ZW1hbi9XZWJzdG9ybVByb2plY3RzL2F3YXlqcy1yZW5kZXJlcmdsLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvbnRhaW5lcnMvRGlzcGxheU9iamVjdENvbnRhaW5lclwiKTtcbmltcG9ydCBCaXRtYXBEYXRhXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvYmFzZS9CaXRtYXBEYXRhXCIpO1xuaW1wb3J0IEJsZW5kTW9kZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2Jhc2UvQmxlbmRNb2RlXCIpO1xuaW1wb3J0IERpc3BsYXlPYmplY3RcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvYmFzZS9EaXNwbGF5T2JqZWN0XCIpO1xuaW1wb3J0IEdlb21ldHJ5XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9iYXNlL0dlb21ldHJ5XCIpO1xuaW1wb3J0IExpZ2h0QmFzZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2Jhc2UvTGlnaHRCYXNlXCIpO1xuaW1wb3J0IFRyaWFuZ2xlU3ViR2VvbWV0cnlcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2Jhc2UvVHJpYW5nbGVTdWJHZW9tZXRyeVwiKTtcbmltcG9ydCBDb2xvclRyYW5zZm9ybVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9nZW9tL0NvbG9yVHJhbnNmb3JtXCIpO1xuaW1wb3J0IE1hdHJpeDNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9nZW9tL01hdHJpeDNEXCIpO1xuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9nZW9tL1ZlY3RvcjNEXCIpO1xuaW1wb3J0IFVSTExvYWRlckRhdGFGb3JtYXRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL25ldC9VUkxMb2FkZXJEYXRhRm9ybWF0XCIpO1xuaW1wb3J0IFVSTFJlcXVlc3RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9uZXQvVVJMUmVxdWVzdFwiKTtcbmltcG9ydCBBc3NldFR5cGVcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9saWJyYXJ5L0Fzc2V0VHlwZVwiKTtcbmltcG9ydCBJQXNzZXRcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2xpYnJhcnkvSUFzc2V0XCIpO1xuaW1wb3J0IERpcmVjdGlvbmFsTGlnaHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2VudGl0aWVzL0RpcmVjdGlvbmFsTGlnaHRcIik7XG5pbXBvcnQgUG9pbnRMaWdodFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9lbnRpdGllcy9Qb2ludExpZ2h0XCIpO1xuaW1wb3J0IENhbWVyYVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2VudGl0aWVzL0NhbWVyYVwiKTtcbmltcG9ydCBNZXNoXHRcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9lbnRpdGllcy9NZXNoXCIpO1xuaW1wb3J0IFNreWJveFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2VudGl0aWVzL1NreWJveFwiKTtcbmltcG9ydCBNYXRlcmlhbEJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbWF0ZXJpYWxzL01hdGVyaWFsQmFzZVwiKTtcbmltcG9ydCBMaWdodFBpY2tlckJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL21hdGVyaWFscy9saWdodHBpY2tlcnMvTGlnaHRQaWNrZXJCYXNlXCIpO1xuaW1wb3J0IFN0YXRpY0xpZ2h0UGlja2VyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbWF0ZXJpYWxzL2xpZ2h0cGlja2Vycy9TdGF0aWNMaWdodFBpY2tlclwiKTtcbmltcG9ydCBDdWJlTWFwU2hhZG93TWFwcGVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbWF0ZXJpYWxzL3NoYWRvd21hcHBlcnMvQ3ViZU1hcFNoYWRvd01hcHBlclwiKTtcbmltcG9ydCBEaXJlY3Rpb25hbFNoYWRvd01hcHBlclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9tYXRlcmlhbHMvc2hhZG93bWFwcGVycy9EaXJlY3Rpb25hbFNoYWRvd01hcHBlclwiKTtcbmltcG9ydCBTaGFkb3dNYXBwZXJCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9tYXRlcmlhbHMvc2hhZG93bWFwcGVycy9TaGFkb3dNYXBwZXJCYXNlXCIpO1xuaW1wb3J0IFByZWZhYkJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcHJlZmFicy9QcmVmYWJCYXNlXCIpO1xuaW1wb3J0IFByaW1pdGl2ZUNhcHN1bGVQcmVmYWJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcHJlZmFicy9QcmltaXRpdmVDYXBzdWxlUHJlZmFiXCIpO1xuaW1wb3J0IFByaW1pdGl2ZUNvbmVQcmVmYWJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wcmVmYWJzL1ByaW1pdGl2ZUNvbmVQcmVmYWJcIik7XG5pbXBvcnQgUHJpbWl0aXZlQ3ViZVByZWZhYlx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3ByZWZhYnMvUHJpbWl0aXZlQ3ViZVByZWZhYlwiKTtcbmltcG9ydCBQcmltaXRpdmVDeWxpbmRlclByZWZhYlx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wcmVmYWJzL1ByaW1pdGl2ZUN5bGluZGVyUHJlZmFiXCIpO1xuaW1wb3J0IFByaW1pdGl2ZVBsYW5lUHJlZmFiXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcHJlZmFicy9QcmltaXRpdmVQbGFuZVByZWZhYlwiKTtcbmltcG9ydCBQcmltaXRpdmVTcGhlcmVQcmVmYWJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcHJlZmFicy9QcmltaXRpdmVTcGhlcmVQcmVmYWJcIik7XG5pbXBvcnQgUHJpbWl0aXZlVG9ydXNQcmVmYWJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wcmVmYWJzL1ByaW1pdGl2ZVRvcnVzUHJlZmFiXCIpO1xuaW1wb3J0IFBhcnNlckJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcGFyc2Vycy9QYXJzZXJCYXNlXCIpO1xuaW1wb3J0IFBhcnNlclV0aWxzXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3BhcnNlcnMvUGFyc2VyVXRpbHNcIik7XG5pbXBvcnQgUmVzb3VyY2VEZXBlbmRlbmN5XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcGFyc2Vycy9SZXNvdXJjZURlcGVuZGVuY3lcIik7XG5pbXBvcnQgUHJvamVjdGlvbkJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3Byb2plY3Rpb25zL1Byb2plY3Rpb25CYXNlXCIpO1xuaW1wb3J0IFBlcnNwZWN0aXZlUHJvamVjdGlvblx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wcm9qZWN0aW9ucy9QZXJzcGVjdGl2ZVByb2plY3Rpb25cIik7XG5pbXBvcnQgT3J0aG9ncmFwaGljUHJvamVjdGlvblx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wcm9qZWN0aW9ucy9PcnRob2dyYXBoaWNQcm9qZWN0aW9uXCIpO1xuaW1wb3J0IE9ydGhvZ3JhcGhpY09mZkNlbnRlclByb2plY3Rpb25cdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wcm9qZWN0aW9ucy9PcnRob2dyYXBoaWNPZmZDZW50ZXJQcm9qZWN0aW9uXCIpO1xuaW1wb3J0IEJpdG1hcEN1YmVUZXh0dXJlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvQml0bWFwQ3ViZVRleHR1cmVcIik7XG5pbXBvcnQgQml0bWFwVGV4dHVyZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvQml0bWFwVGV4dHVyZVwiKTtcbmltcG9ydCBDdWJlVGV4dHVyZUJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL0N1YmVUZXh0dXJlQmFzZVwiKTtcbmltcG9ydCBJbWFnZUN1YmVUZXh0dXJlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9JbWFnZUN1YmVUZXh0dXJlXCIpO1xuaW1wb3J0IEltYWdlVGV4dHVyZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9JbWFnZVRleHR1cmVcIik7XG5pbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZTJEQmFzZVwiKTtcbmltcG9ydCBUZXh0dXJlUHJveHlCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9UZXh0dXJlUHJveHlCYXNlXCIpO1xuaW1wb3J0IEJ5dGVBcnJheVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9CeXRlQXJyYXlcIik7XG5cbmltcG9ydCBBbmltYXRpb25TZXRCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9hbmltYXRvcnMvQW5pbWF0aW9uU2V0QmFzZVwiKTtcbmltcG9ydCBBbmltYXRvckJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYW5pbWF0b3JzL0FuaW1hdG9yQmFzZVwiKTtcbmltcG9ydCBTa3lib3hNYXRlcmlhbFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL1NreWJveE1hdGVyaWFsXCIpO1xuaW1wb3J0IFRyaWFuZ2xlTWF0ZXJpYWxNb2RlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL1RyaWFuZ2xlTWF0ZXJpYWxNb2RlXCIpO1xuaW1wb3J0IFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWxcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL1RyaWFuZ2xlTWV0aG9kTWF0ZXJpYWxcIik7XG5pbXBvcnQgRGVmYXVsdE1hdGVyaWFsTWFuYWdlclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvdXRpbHMvRGVmYXVsdE1hdGVyaWFsTWFuYWdlclwiKTtcblxuaW1wb3J0IFZlcnRleEFuaW1hdGlvblNldFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9WZXJ0ZXhBbmltYXRpb25TZXRcIik7XG5pbXBvcnQgVmVydGV4QW5pbWF0b3JcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9WZXJ0ZXhBbmltYXRvclwiKTtcbmltcG9ydCBTa2VsZXRvbkFuaW1hdGlvblNldFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9Ta2VsZXRvbkFuaW1hdGlvblNldFwiKTtcbmltcG9ydCBTa2VsZXRvbkFuaW1hdG9yXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvU2tlbGV0b25BbmltYXRvclwiKTtcbmltcG9ydCBKb2ludFBvc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvSm9pbnRQb3NlXCIpO1xuaW1wb3J0IFNrZWxldG9uXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvU2tlbGV0b25cIik7XG5pbXBvcnQgU2tlbGV0b25Qb3NlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1NrZWxldG9uUG9zZVwiKTtcbmltcG9ydCBTa2VsZXRvbkpvaW50XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Ta2VsZXRvbkpvaW50XCIpO1xuaW1wb3J0IFNrZWxldG9uQ2xpcE5vZGVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9ub2Rlcy9Ta2VsZXRvbkNsaXBOb2RlXCIpO1xuaW1wb3J0IFZlcnRleENsaXBOb2RlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvVmVydGV4Q2xpcE5vZGVcIik7XG5pbXBvcnQgQW1iaWVudEVudk1hcE1ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0FtYmllbnRFbnZNYXBNZXRob2RcIik7XG5pbXBvcnQgRGlmZnVzZURlcHRoTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRGlmZnVzZURlcHRoTWV0aG9kXCIpO1xuaW1wb3J0IERpZmZ1c2VDZWxNZXRob2RcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0RpZmZ1c2VDZWxNZXRob2RcIik7XG5pbXBvcnQgRGlmZnVzZUdyYWRpZW50TWV0aG9kXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0RpZmZ1c2VHcmFkaWVudE1ldGhvZFwiKTtcbmltcG9ydCBEaWZmdXNlTGlnaHRNYXBNZXRob2RcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRGlmZnVzZUxpZ2h0TWFwTWV0aG9kXCIpO1xuaW1wb3J0IERpZmZ1c2VXcmFwTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRGlmZnVzZVdyYXBNZXRob2RcIik7XG5pbXBvcnQgRWZmZWN0QWxwaGFNYXNrTWV0aG9kXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0VmZmVjdEFscGhhTWFza01ldGhvZFwiKTtcbmltcG9ydCBFZmZlY3RDb2xvck1hdHJpeE1ldGhvZFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9FZmZlY3RDb2xvck1hdHJpeE1ldGhvZFwiKTtcbmltcG9ydCBFZmZlY3RDb2xvclRyYW5zZm9ybU1ldGhvZFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRWZmZWN0Q29sb3JUcmFuc2Zvcm1NZXRob2RcIik7XG5pbXBvcnQgRWZmZWN0RW52TWFwTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRWZmZWN0RW52TWFwTWV0aG9kXCIpO1xuaW1wb3J0IEVmZmVjdEZvZ01ldGhvZFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRWZmZWN0Rm9nTWV0aG9kXCIpO1xuaW1wb3J0IEVmZmVjdEZyZXNuZWxFbnZNYXBNZXRob2RcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0VmZmVjdEZyZXNuZWxFbnZNYXBNZXRob2RcIik7XG5pbXBvcnQgRWZmZWN0TGlnaHRNYXBNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9FZmZlY3RMaWdodE1hcE1ldGhvZFwiKTtcbmltcG9ydCBFZmZlY3RNZXRob2RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9FZmZlY3RNZXRob2RCYXNlXCIpO1xuaW1wb3J0IEVmZmVjdFJpbUxpZ2h0TWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRWZmZWN0UmltTGlnaHRNZXRob2RcIik7XG5pbXBvcnQgTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2RcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2RcIik7XG5pbXBvcnQgU2hhZG93RGl0aGVyZWRNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9TaGFkb3dEaXRoZXJlZE1ldGhvZFwiKTtcbmltcG9ydCBTaGFkb3dGaWx0ZXJlZE1ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL1NoYWRvd0ZpbHRlcmVkTWV0aG9kXCIpO1xuaW1wb3J0IFNoYWRvd01ldGhvZEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL1NoYWRvd01ldGhvZEJhc2VcIik7XG5pbXBvcnQgU3BlY3VsYXJGcmVzbmVsTWV0aG9kXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL1NwZWN1bGFyRnJlc25lbE1ldGhvZFwiKTtcbmltcG9ydCBTaGFkb3dIYXJkTWV0aG9kXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9TaGFkb3dIYXJkTWV0aG9kXCIpO1xuaW1wb3J0IFNwZWN1bGFyQW5pc290cm9waWNNZXRob2RcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL1NwZWN1bGFyQW5pc290cm9waWNNZXRob2RcIik7XG5pbXBvcnQgU3BlY3VsYXJDZWxNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9TcGVjdWxhckNlbE1ldGhvZFwiKTtcbmltcG9ydCBTcGVjdWxhclBob25nTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvU3BlY3VsYXJQaG9uZ01ldGhvZFwiKTtcbmltcG9ydCBTaGFkb3dOZWFyTWV0aG9kXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9TaGFkb3dOZWFyTWV0aG9kXCIpO1xuaW1wb3J0IFNoYWRvd1NvZnRNZXRob2RcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL1NoYWRvd1NvZnRNZXRob2RcIik7XG5cbmltcG9ydCBBV0RCbG9ja1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3BhcnNlcnMvZGF0YS9BV0RCbG9ja1wiKTtcbmltcG9ydCBBV0RQcm9wZXJ0aWVzXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXJzZXJzL2RhdGEvQVdEUHJvcGVydGllc1wiKTtcbmltcG9ydCBCaXRGbGFnc1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3BhcnNlcnMvZGF0YS9CaXRGbGFnc1wiKTtcblxuLyoqXG4gKiBBV0RQYXJzZXIgcHJvdmlkZXMgYSBwYXJzZXIgZm9yIHRoZSBBV0QgZGF0YSB0eXBlLlxuICovXG5jbGFzcyBBV0RQYXJzZXIgZXh0ZW5kcyBQYXJzZXJCYXNlXG57XG5cdC8vc2V0IHRvIFwidHJ1ZVwiIHRvIGhhdmUgc29tZSBjb25zb2xlLmxvZ3MgaW4gdGhlIENvbnNvbGVcblx0cHJpdmF0ZSBfZGVidWc6Ym9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIF9ieXRlRGF0YTpCeXRlQXJyYXk7XG5cdHByaXZhdGUgX3N0YXJ0ZWRQYXJzaW5nOmJvb2xlYW4gPSBmYWxzZTtcblx0cHJpdmF0ZSBfY3VyX2Jsb2NrX2lkOm51bWJlcjtcblx0cHJpdmF0ZSBfYmxvY2tzOkFycmF5PEFXREJsb2NrPjtcblx0cHJpdmF0ZSBfbmV3QmxvY2tCeXRlczpCeXRlQXJyYXk7XG5cdHByaXZhdGUgX3ZlcnNpb246QXJyYXk8bnVtYmVyPjtcblx0cHJpdmF0ZSBfY29tcHJlc3Npb246bnVtYmVyO1xuXHRwcml2YXRlIF9hY2N1cmFjeU9uQmxvY2tzOmJvb2xlYW47XG5cdHByaXZhdGUgX2FjY3VyYWN5TWF0cml4OmJvb2xlYW47XG5cdHByaXZhdGUgX2FjY3VyYWN5R2VvOmJvb2xlYW47XG5cdHByaXZhdGUgX2FjY3VyYWN5UHJvcHM6Ym9vbGVhbjtcblx0cHJpdmF0ZSBfbWF0cml4TnJUeXBlOm51bWJlcjtcblx0cHJpdmF0ZSBfZ2VvTnJUeXBlOm51bWJlcjtcblx0cHJpdmF0ZSBfcHJvcHNOclR5cGU6bnVtYmVyO1xuXHRwcml2YXRlIF9zdHJlYW1pbmc6Ym9vbGVhbjtcblx0cHJpdmF0ZSBfdGV4dHVyZV91c2VyczpPYmplY3QgPSB7fTtcblx0cHJpdmF0ZSBfcGFyc2VkX2hlYWRlcjpib29sZWFuID0gZmFsc2U7XG5cdHByaXZhdGUgX2JvZHk6Qnl0ZUFycmF5O1xuXHRwcml2YXRlIF9kZWZhdWx0VGV4dHVyZTpCaXRtYXBUZXh0dXJlOyAgICAgLy8gSFRNTCBJTUFHRSBURVhUVVJFID4/ICFcblx0cHJpdmF0ZSBfY3ViZVRleHR1cmVzOkFycmF5PGFueT47XG5cdHByaXZhdGUgX2RlZmF1bHRCaXRtYXBNYXRlcmlhbDpUcmlhbmdsZU1ldGhvZE1hdGVyaWFsO1xuXHRwcml2YXRlIF9kZWZhdWx0Q3ViZVRleHR1cmU6Qml0bWFwQ3ViZVRleHR1cmU7XG5cblx0cHVibGljIHN0YXRpYyBDT01QUkVTU0lPTk1PREVfTFpNQTpzdHJpbmcgPSBcImx6bWFcIjtcblx0cHVibGljIHN0YXRpYyBVTkNPTVBSRVNTRUQ6bnVtYmVyID0gMDtcblx0cHVibGljIHN0YXRpYyBERUZMQVRFOm51bWJlciA9IDE7XG5cdHB1YmxpYyBzdGF0aWMgTFpNQTpudW1iZXIgPSAyO1xuXHRwdWJsaWMgc3RhdGljIElOVDg6bnVtYmVyID0gMTtcblx0cHVibGljIHN0YXRpYyBJTlQxNjpudW1iZXIgPSAyO1xuXHRwdWJsaWMgc3RhdGljIElOVDMyOm51bWJlciA9IDM7XG5cdHB1YmxpYyBzdGF0aWMgVUlOVDg6bnVtYmVyID0gNDtcblx0cHVibGljIHN0YXRpYyBVSU5UMTY6bnVtYmVyID0gNTtcblx0cHVibGljIHN0YXRpYyBVSU5UMzI6bnVtYmVyID0gNjtcblx0cHVibGljIHN0YXRpYyBGTE9BVDMyOm51bWJlciA9IDc7XG5cdHB1YmxpYyBzdGF0aWMgRkxPQVQ2NDpudW1iZXIgPSA4O1xuXHRwdWJsaWMgc3RhdGljIEJPT0w6bnVtYmVyID0gMjE7XG5cdHB1YmxpYyBzdGF0aWMgQ09MT1I6bnVtYmVyID0gMjI7XG5cdHB1YmxpYyBzdGF0aWMgQkFERFI6bnVtYmVyID0gMjM7XG5cdHB1YmxpYyBzdGF0aWMgQVdEU1RSSU5HOm51bWJlciA9IDMxO1xuXHRwdWJsaWMgc3RhdGljIEFXREJZVEVBUlJBWTpudW1iZXIgPSAzMjtcblx0cHVibGljIHN0YXRpYyBWRUNUT1IyeDE6bnVtYmVyID0gNDE7XG5cdHB1YmxpYyBzdGF0aWMgVkVDVE9SM3gxOm51bWJlciA9IDQyO1xuXHRwdWJsaWMgc3RhdGljIFZFQ1RPUjR4MTpudW1iZXIgPSA0Mztcblx0cHVibGljIHN0YXRpYyBNVFgzeDI6bnVtYmVyID0gNDQ7XG5cdHB1YmxpYyBzdGF0aWMgTVRYM3gzOm51bWJlciA9IDQ1O1xuXHRwdWJsaWMgc3RhdGljIE1UWDR4MzpudW1iZXIgPSA0Njtcblx0cHVibGljIHN0YXRpYyBNVFg0eDQ6bnVtYmVyID0gNDc7XG5cblx0cHJpdmF0ZSBibGVuZE1vZGVEaWM6QXJyYXk8c3RyaW5nPjtcblx0cHJpdmF0ZSBfZGVwdGhTaXplRGljOkFycmF5PG51bWJlcj47XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgQVdEUGFyc2VyIG9iamVjdC5cblx0ICogQHBhcmFtIHVyaSBUaGUgdXJsIG9yIGlkIG9mIHRoZSBkYXRhIG9yIGZpbGUgdG8gYmUgcGFyc2VkLlxuXHQgKiBAcGFyYW0gZXh0cmEgVGhlIGhvbGRlciBmb3IgZXh0cmEgY29udGV4dHVhbCBkYXRhIHRoYXQgdGhlIHBhcnNlciBtaWdodCBuZWVkLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0c3VwZXIoVVJMTG9hZGVyRGF0YUZvcm1hdC5BUlJBWV9CVUZGRVIpO1xuXG5cdFx0dGhpcy5fYmxvY2tzID0gbmV3IEFycmF5PEFXREJsb2NrPigpO1xuXHRcdHRoaXMuX2Jsb2Nrc1swXSA9IG5ldyBBV0RCbG9jaygpO1xuXHRcdHRoaXMuX2Jsb2Nrc1swXS5kYXRhID0gbnVsbDsgLy8gWmVybyBhZGRyZXNzIG1lYW5zIG51bGwgaW4gQVdEXG5cblx0XHR0aGlzLmJsZW5kTW9kZURpYyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7IC8vIHVzZWQgdG8gdHJhbnNsYXRlIGludHMgdG8gYmxlbmRNb2RlLXN0cmluZ3Ncblx0XHR0aGlzLmJsZW5kTW9kZURpYy5wdXNoKEJsZW5kTW9kZS5OT1JNQUwpO1xuXHRcdHRoaXMuYmxlbmRNb2RlRGljLnB1c2goQmxlbmRNb2RlLkFERCk7XG5cdFx0dGhpcy5ibGVuZE1vZGVEaWMucHVzaChCbGVuZE1vZGUuQUxQSEEpO1xuXHRcdHRoaXMuYmxlbmRNb2RlRGljLnB1c2goQmxlbmRNb2RlLkRBUktFTik7XG5cdFx0dGhpcy5ibGVuZE1vZGVEaWMucHVzaChCbGVuZE1vZGUuRElGRkVSRU5DRSk7XG5cdFx0dGhpcy5ibGVuZE1vZGVEaWMucHVzaChCbGVuZE1vZGUuRVJBU0UpO1xuXHRcdHRoaXMuYmxlbmRNb2RlRGljLnB1c2goQmxlbmRNb2RlLkhBUkRMSUdIVCk7XG5cdFx0dGhpcy5ibGVuZE1vZGVEaWMucHVzaChCbGVuZE1vZGUuSU5WRVJUKTtcblx0XHR0aGlzLmJsZW5kTW9kZURpYy5wdXNoKEJsZW5kTW9kZS5MQVlFUik7XG5cdFx0dGhpcy5ibGVuZE1vZGVEaWMucHVzaChCbGVuZE1vZGUuTElHSFRFTik7XG5cdFx0dGhpcy5ibGVuZE1vZGVEaWMucHVzaChCbGVuZE1vZGUuTVVMVElQTFkpO1xuXHRcdHRoaXMuYmxlbmRNb2RlRGljLnB1c2goQmxlbmRNb2RlLk5PUk1BTCk7XG5cdFx0dGhpcy5ibGVuZE1vZGVEaWMucHVzaChCbGVuZE1vZGUuT1ZFUkxBWSk7XG5cdFx0dGhpcy5ibGVuZE1vZGVEaWMucHVzaChCbGVuZE1vZGUuU0NSRUVOKTtcblx0XHR0aGlzLmJsZW5kTW9kZURpYy5wdXNoKEJsZW5kTW9kZS5TSEFERVIpO1xuXHRcdHRoaXMuYmxlbmRNb2RlRGljLnB1c2goQmxlbmRNb2RlLk9WRVJMQVkpO1xuXG5cdFx0dGhpcy5fZGVwdGhTaXplRGljID0gbmV3IEFycmF5PG51bWJlcj4oKTsgLy8gdXNlZCB0byB0cmFuc2xhdGUgaW50cyB0byBkZXB0aFNpemUtdmFsdWVzXG5cdFx0dGhpcy5fZGVwdGhTaXplRGljLnB1c2goMjU2KTtcblx0XHR0aGlzLl9kZXB0aFNpemVEaWMucHVzaCg1MTIpO1xuXHRcdHRoaXMuX2RlcHRoU2l6ZURpYy5wdXNoKDIwNDgpO1xuXHRcdHRoaXMuX2RlcHRoU2l6ZURpYy5wdXNoKDEwMjQpO1xuXHRcdHRoaXMuX3ZlcnNpb24gPSBBcnJheTxudW1iZXI+KCk7IC8vIHdpbGwgY29udGFpbiAyIGludCAobWFqb3ItdmVyc2lvbiwgbWlub3ItdmVyc2lvbikgZm9yIGF3ZC12ZXJzaW9uLWNoZWNrXG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IGEgZ2l2ZW4gZmlsZSBleHRlbnNpb24gaXMgc3VwcG9ydGVkIGJ5IHRoZSBwYXJzZXIuXG5cdCAqIEBwYXJhbSBleHRlbnNpb24gVGhlIGZpbGUgZXh0ZW5zaW9uIG9mIGEgcG90ZW50aWFsIGZpbGUgdG8gYmUgcGFyc2VkLlxuXHQgKiBAcmV0dXJuIFdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBmaWxlIHR5cGUgaXMgc3VwcG9ydGVkLlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBzdXBwb3J0c1R5cGUoZXh0ZW5zaW9uOnN0cmluZyk6Ym9vbGVhblxuXHR7XG5cdFx0ZXh0ZW5zaW9uID0gZXh0ZW5zaW9uLnRvTG93ZXJDYXNlKCk7XG5cdFx0cmV0dXJuIGV4dGVuc2lvbiA9PSBcImF3ZFwiO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRlc3RzIHdoZXRoZXIgYSBkYXRhIGJsb2NrIGNhbiBiZSBwYXJzZWQgYnkgdGhlIHBhcnNlci5cblx0ICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgYmxvY2sgdG8gcG90ZW50aWFsbHkgYmUgcGFyc2VkLlxuXHQgKiBAcmV0dXJuIFdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBkYXRhIGlzIHN1cHBvcnRlZC5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgc3VwcG9ydHNEYXRhKGRhdGE6YW55KTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gKFBhcnNlclV0aWxzLnRvU3RyaW5nKGRhdGEsIDMpID09ICdBV0QnKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pUmVzb2x2ZURlcGVuZGVuY3kocmVzb3VyY2VEZXBlbmRlbmN5OlJlc291cmNlRGVwZW5kZW5jeSk6dm9pZFxuXHR7XG5cdFx0Ly8gdGhpcyB3aWxsIGJlIGNhbGxlZCB3aGVuIERlcGVuZGVuY3kgaGFzIGZpbmlzaGVkIGxvYWRpbmcuXG5cdFx0Ly8gdGhlIEFzc2V0cyB3YWl0aW5nIGZvciB0aGlzIEJpdG1hcCwgY2FuIGJlIFRleHR1cmUgb3IgQ3ViZVRleHR1cmUuXG5cdFx0Ly8gaWYgdGhlIEJpdG1hcCBpcyBhd2FpdGVkIGJ5IGEgQ3ViZVRleHR1cmUsIHdlIG5lZWQgdG8gY2hlY2sgaWYgaXRzIHRoZSBsYXN0IEJpdG1hcCBvZiB0aGUgQ3ViZVRleHR1cmUsXG5cdFx0Ly8gc28gd2Uga25vdyBpZiB3ZSBoYXZlIHRvIGZpbmFsaXplIHRoZSBBc3NldCAoQ3ViZVRleHR1cmUpIG9yIG5vdC5cblx0XHRpZiAocmVzb3VyY2VEZXBlbmRlbmN5LmFzc2V0cy5sZW5ndGggPT0gMSkge1xuXHRcdFx0dmFyIGlzQ3ViZVRleHR1cmVBcnJheTpBcnJheTxzdHJpbmc+ID0gcmVzb3VyY2VEZXBlbmRlbmN5LmlkLnNwbGl0KFwiI1wiKTtcblx0XHRcdHZhciByZXNzb3VyY2VJRDpzdHJpbmcgPSBpc0N1YmVUZXh0dXJlQXJyYXlbMF07XG5cdFx0XHR2YXIgYXNzZXQ6VGV4dHVyZVByb3h5QmFzZTtcblx0XHRcdHZhciB0aGlzQml0bWFwVGV4dHVyZTpUZXh0dXJlMkRCYXNlO1xuXHRcdFx0dmFyIGJsb2NrOkFXREJsb2NrO1xuXG5cdFx0XHRpZiAoaXNDdWJlVGV4dHVyZUFycmF5Lmxlbmd0aCA9PSAxKSAvLyBOb3QgYSBjdWJlIHRleHR1cmVcblx0XHRcdHtcblx0XHRcdFx0YXNzZXQgPSA8VGV4dHVyZTJEQmFzZT4gcmVzb3VyY2VEZXBlbmRlbmN5LmFzc2V0c1swXTtcblx0XHRcdFx0aWYgKGFzc2V0KSB7XG5cdFx0XHRcdFx0dmFyIG1hdDpUcmlhbmdsZU1ldGhvZE1hdGVyaWFsO1xuXHRcdFx0XHRcdHZhciB1c2VyczpBcnJheTxzdHJpbmc+O1xuXG5cdFx0XHRcdFx0YmxvY2sgPSB0aGlzLl9ibG9ja3NbIHJlc291cmNlRGVwZW5kZW5jeS5pZCBdO1xuXHRcdFx0XHRcdGJsb2NrLmRhdGEgPSBhc3NldDsgLy8gU3RvcmUgZmluaXNoZWQgYXNzZXRcblxuXHRcdFx0XHRcdC8vIFJlc2V0IG5hbWUgb2YgdGV4dHVyZSB0byB0aGUgb25lIGRlZmluZWQgaW4gdGhlIEFXRCBmaWxlLFxuXHRcdFx0XHRcdC8vIGFzIG9wcG9zZWQgdG8gd2hhdGV2ZXIgdGhlIGltYWdlIHBhcnNlciBjYW1lIHVwIHdpdGguXG5cdFx0XHRcdFx0YXNzZXQucmVzZXRBc3NldFBhdGgoYmxvY2submFtZSwgbnVsbCwgdHJ1ZSk7XG5cdFx0XHRcdFx0YmxvY2submFtZSA9IGFzc2V0Lm5hbWU7XG5cdFx0XHRcdFx0Ly8gRmluYWxpemUgdGV4dHVyZSBhc3NldCB0byBkaXNwYXRjaCB0ZXh0dXJlIGV2ZW50LCB3aGljaCB3YXNcblx0XHRcdFx0XHQvLyBwcmV2aW91c2x5IHN1cHByZXNzZWQgd2hpbGUgdGhlIGRlcGVuZGVuY3kgd2FzIGxvYWRlZC5cblx0XHRcdFx0XHR0aGlzLl9wRmluYWxpemVBc3NldCg8SUFzc2V0PiBhc3NldCk7XG5cblx0XHRcdFx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiU3VjY2Vzc2Z1bGx5IGxvYWRlZCBCaXRtYXAgZm9yIHRleHR1cmVcIik7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCB0ZXh0dXJlOiBOYW1lID0gXCIgKyBibG9jay5uYW1lKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKGlzQ3ViZVRleHR1cmVBcnJheS5sZW5ndGggPiAxKSAvLyBDdWJlIFRleHR1cmVcblx0XHRcdHtcblx0XHRcdFx0dGhpc0JpdG1hcFRleHR1cmUgPSA8Qml0bWFwVGV4dHVyZT4gcmVzb3VyY2VEZXBlbmRlbmN5LmFzc2V0c1swXTtcblxuXHRcdFx0XHR2YXIgdHg6SW1hZ2VUZXh0dXJlID0gPEltYWdlVGV4dHVyZT4gdGhpc0JpdG1hcFRleHR1cmU7XG5cblx0XHRcdFx0dGhpcy5fY3ViZVRleHR1cmVzWyBpc0N1YmVUZXh0dXJlQXJyYXlbMV0gXSA9IHR4Lmh0bWxJbWFnZUVsZW1lbnQ7IC8vID9cblx0XHRcdFx0dGhpcy5fdGV4dHVyZV91c2Vyc1tyZXNzb3VyY2VJRF0ucHVzaCgxKTtcblxuXHRcdFx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIlN1Y2Nlc3NmdWxseSBsb2FkZWQgQml0bWFwIFwiICsgdGhpcy5fdGV4dHVyZV91c2Vyc1tyZXNzb3VyY2VJRF0ubGVuZ3RoICsgXCIgLyA2IGZvciBDdWJldGV4dHVyZVwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodGhpcy5fdGV4dHVyZV91c2Vyc1tyZXNzb3VyY2VJRF0ubGVuZ3RoID09IHRoaXMuX2N1YmVUZXh0dXJlcy5sZW5ndGgpIHtcblxuXHRcdFx0XHRcdHZhciBwb3NYOmFueSA9IHRoaXMuX2N1YmVUZXh0dXJlc1swXTtcblx0XHRcdFx0XHR2YXIgbmVnWDphbnkgPSB0aGlzLl9jdWJlVGV4dHVyZXNbMV07XG5cdFx0XHRcdFx0dmFyIHBvc1k6YW55ID0gdGhpcy5fY3ViZVRleHR1cmVzWzJdO1xuXHRcdFx0XHRcdHZhciBuZWdZOmFueSA9IHRoaXMuX2N1YmVUZXh0dXJlc1szXTtcblx0XHRcdFx0XHR2YXIgcG9zWjphbnkgPSB0aGlzLl9jdWJlVGV4dHVyZXNbNF07XG5cdFx0XHRcdFx0dmFyIG5lZ1o6YW55ID0gdGhpcy5fY3ViZVRleHR1cmVzWzVdO1xuXG5cdFx0XHRcdFx0YXNzZXQgPSA8VGV4dHVyZVByb3h5QmFzZT4gbmV3IEltYWdlQ3ViZVRleHR1cmUocG9zWCwgbmVnWCwgcG9zWSwgbmVnWSwgcG9zWiwgbmVnWik7XG5cdFx0XHRcdFx0YmxvY2sgPSB0aGlzLl9ibG9ja3NbcmVzc291cmNlSURdO1xuXHRcdFx0XHRcdGJsb2NrLmRhdGEgPSBhc3NldDsgLy8gU3RvcmUgZmluaXNoZWQgYXNzZXRcblxuXHRcdFx0XHRcdC8vIFJlc2V0IG5hbWUgb2YgdGV4dHVyZSB0byB0aGUgb25lIGRlZmluZWQgaW4gdGhlIEFXRCBmaWxlLFxuXHRcdFx0XHRcdC8vIGFzIG9wcG9zZWQgdG8gd2hhdGV2ZXIgdGhlIGltYWdlIHBhcnNlciBjYW1lIHVwIHdpdGguXG5cdFx0XHRcdFx0YXNzZXQucmVzZXRBc3NldFBhdGgoYmxvY2submFtZSwgbnVsbCwgdHJ1ZSk7XG5cdFx0XHRcdFx0YmxvY2submFtZSA9IGFzc2V0Lm5hbWU7XG5cdFx0XHRcdFx0Ly8gRmluYWxpemUgdGV4dHVyZSBhc3NldCB0byBkaXNwYXRjaCB0ZXh0dXJlIGV2ZW50LCB3aGljaCB3YXNcblx0XHRcdFx0XHQvLyBwcmV2aW91c2x5IHN1cHByZXNzZWQgd2hpbGUgdGhlIGRlcGVuZGVuY3kgd2FzIGxvYWRlZC5cblx0XHRcdFx0XHR0aGlzLl9wRmluYWxpemVBc3NldCg8SUFzc2V0PiBhc3NldCk7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBDdWJlVGV4dHVyZTogTmFtZSA9IFwiICsgYmxvY2submFtZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfaVJlc29sdmVEZXBlbmRlbmN5RmFpbHVyZShyZXNvdXJjZURlcGVuZGVuY3k6UmVzb3VyY2VEZXBlbmRlbmN5KTp2b2lkXG5cdHtcblx0XHQvL25vdCB1c2VkIC0gaWYgYSBkZXBlbmRjeSBmYWlscywgdGhlIGF3YWl0aW5nIFRleHR1cmUgb3IgQ3ViZVRleHR1cmUgd2lsbCBuZXZlciBiZSBmaW5hbGl6ZWQsIGFuZCB0aGUgZGVmYXVsdC1iaXRtYXBzIHdpbGwgYmUgdXNlZC5cblx0XHQvLyB0aGlzIG1lYW5zLCB0aGF0IGlmIG9uZSBCaXRtYXAgb2YgYSBDdWJlVGV4dHVyZSBmYWlscywgdGhlIEN1YmVUZXh0dXJlIHdpbGwgaGF2ZSB0aGUgRGVmYXVsdFRleHR1cmUgYXBwbGllZCBmb3IgYWxsIHNpeCBCaXRtYXBzLlxuXHR9XG5cblx0LyoqXG5cdCAqIFJlc29sdmUgYSBkZXBlbmRlbmN5IG5hbWVcblx0ICpcblx0ICogQHBhcmFtIHJlc291cmNlRGVwZW5kZW5jeSBUaGUgZGVwZW5kZW5jeSB0byBiZSByZXNvbHZlZC5cblx0ICovXG5cdHB1YmxpYyBfaVJlc29sdmVEZXBlbmRlbmN5TmFtZShyZXNvdXJjZURlcGVuZGVuY3k6UmVzb3VyY2VEZXBlbmRlbmN5LCBhc3NldDpJQXNzZXQpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIG9sZE5hbWU6c3RyaW5nID0gYXNzZXQubmFtZTtcblxuXHRcdGlmIChhc3NldCkge1xuXHRcdFx0dmFyIGJsb2NrOkFXREJsb2NrID0gdGhpcy5fYmxvY2tzW3BhcnNlSW50KHJlc291cmNlRGVwZW5kZW5jeS5pZCldO1xuXHRcdFx0Ly8gUmVzZXQgbmFtZSBvZiB0ZXh0dXJlIHRvIHRoZSBvbmUgZGVmaW5lZCBpbiB0aGUgQVdEIGZpbGUsXG5cdFx0XHQvLyBhcyBvcHBvc2VkIHRvIHdoYXRldmVyIHRoZSBpbWFnZSBwYXJzZXIgY2FtZSB1cCB3aXRoLlxuXHRcdFx0YXNzZXQucmVzZXRBc3NldFBhdGgoYmxvY2submFtZSwgbnVsbCwgdHJ1ZSk7XG5cdFx0fVxuXG5cdFx0dmFyIG5ld05hbWU6c3RyaW5nID0gYXNzZXQubmFtZTtcblxuXHRcdGFzc2V0Lm5hbWUgPSBvbGROYW1lO1xuXG5cdFx0cmV0dXJuIG5ld05hbWU7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9wUHJvY2VlZFBhcnNpbmcoKTpib29sZWFuXG5cdHtcblxuXHRcdGlmICghdGhpcy5fc3RhcnRlZFBhcnNpbmcpIHtcblx0XHRcdHRoaXMuX2J5dGVEYXRhID0gdGhpcy5fcEdldEJ5dGVEYXRhKCk7Ly9nZXRCeXRlRGF0YSgpO1xuXHRcdFx0dGhpcy5fc3RhcnRlZFBhcnNpbmcgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICghdGhpcy5fcGFyc2VkX2hlYWRlcikge1xuXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdC8vIExJVFRMRV9FTkRJQU4gLSBEZWZhdWx0IGZvciBBcnJheUJ1ZmZlciAvIE5vdCBpbXBsZW1lbnRlZCBpbiBCeXRlQXJyYXlcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFx0Ly90aGlzLl9ieXRlRGF0YS5lbmRpYW4gPSBFbmRpYW4uTElUVExFX0VORElBTjtcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdC8vIFBhcnNlIGhlYWRlciBhbmQgZGVjb21wcmVzcyBib2R5IGlmIG5lZWRlZFxuXHRcdFx0dGhpcy5wYXJzZUhlYWRlcigpO1xuXG5cdFx0XHRzd2l0Y2ggKHRoaXMuX2NvbXByZXNzaW9uKSB7XG5cblx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuREVGTEFURTpcblx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuTFpNQTpcblx0XHRcdFx0XHR0aGlzLl9wRGllV2l0aEVycm9yKCdDb21wcmVzc2VkIEFXRCBmb3JtYXRzIG5vdCB5ZXQgc3VwcG9ydGVkJyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuVU5DT01QUkVTU0VEOlxuXHRcdFx0XHRcdHRoaXMuX2JvZHkgPSB0aGlzLl9ieXRlRGF0YTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdFx0Ly8gQ29tcHJlc3NlZCBBV0QgRm9ybWF0cyBub3QgeWV0IHN1cHBvcnRlZFxuXHRcdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRcdFx0XHQvKlxuXHRcdFx0XHQgY2FzZSBBV0RQYXJzZXIuREVGTEFURTpcblxuXHRcdFx0XHQgdGhpcy5fYm9keSA9IG5ldyBCeXRlQXJyYXkoKTtcblx0XHRcdFx0IHRoaXMuX2J5dGVEYXRhLnJlYWRCeXRlcyh0aGlzLl9ib2R5LCAwLCB0aGlzLl9ieXRlRGF0YS5nZXRCeXRlc0F2YWlsYWJsZSgpKTtcblx0XHRcdFx0IHRoaXMuX2JvZHkudW5jb21wcmVzcygpO1xuXG5cdFx0XHRcdCBicmVhaztcblx0XHRcdFx0IGNhc2UgQVdEUGFyc2VyLkxaTUE6XG5cblx0XHRcdFx0IHRoaXMuX2JvZHkgPSBuZXcgQnl0ZUFycmF5KCk7XG5cdFx0XHRcdCB0aGlzLl9ieXRlRGF0YS5yZWFkQnl0ZXModGhpcy5fYm9keSwgMCwgdGhpcy5fYnl0ZURhdGEuZ2V0Qnl0ZXNBdmFpbGFibGUoKSk7XG5cdFx0XHRcdCB0aGlzLl9ib2R5LnVuY29tcHJlc3MoQ09NUFJFU1NJT05NT0RFX0xaTUEpO1xuXG5cdFx0XHRcdCBicmVhaztcblx0XHRcdFx0IC8vKi9cblxuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9wYXJzZWRfaGVhZGVyID0gdHJ1ZTtcblxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XHQvLyBMSVRUTEVfRU5ESUFOIC0gRGVmYXVsdCBmb3IgQXJyYXlCdWZmZXIgLyBOb3QgaW1wbGVtZW50ZWQgaW4gQnl0ZUFycmF5XG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdC8vdGhpcy5fYm9keS5lbmRpYW4gPSBFbmRpYW4uTElUVExFX0VORElBTjsvLyBTaG91bGQgYmUgZGVmYXVsdFxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0XHR9XG5cblx0XHRpZiAodGhpcy5fYm9keSkge1xuXG5cdFx0XHR3aGlsZSAodGhpcy5fYm9keS5nZXRCeXRlc0F2YWlsYWJsZSgpID4gMCAmJiAhdGhpcy5wYXJzaW5nUGF1c2VkKSAvLyYmIHRoaXMuX3BIYXNUaW1lKCkgKVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLnBhcnNlTmV4dEJsb2NrKCk7XG5cblx0XHRcdH1cblxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XHQvLyBSZXR1cm4gY29tcGxldGUgc3RhdHVzXG5cdFx0XHRpZiAodGhpcy5fYm9keS5nZXRCeXRlc0F2YWlsYWJsZSgpID09IDApIHtcblx0XHRcdFx0dGhpcy5kaXNwb3NlKCk7XG5cdFx0XHRcdHJldHVybiAgUGFyc2VyQmFzZS5QQVJTSU5HX0RPTkU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gIFBhcnNlckJhc2UuTU9SRV9UT19QQVJTRTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRzd2l0Y2ggKHRoaXMuX2NvbXByZXNzaW9uKSB7XG5cblx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuREVGTEFURTpcblx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuTFpNQTpcblxuXHRcdFx0XHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCIoISkgQVdEUGFyc2VyIEVycm9yOiBDb21wcmVzc2VkIEFXRCBmb3JtYXRzIG5vdCB5ZXQgc3VwcG9ydGVkICghKVwiKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0fVxuXHRcdFx0Ly8gRXJyb3IgLSBtb3N0IGxpa2VseSBfYm9keSBub3Qgc2V0IGJlY2F1c2Ugd2UgZG8gbm90IHN1cHBvcnQgY29tcHJlc3Npb24uXG5cdFx0XHRyZXR1cm4gIFBhcnNlckJhc2UuUEFSU0lOR19ET05FO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRwdWJsaWMgX3BTdGFydFBhcnNpbmcoZnJhbWVMaW1pdDpudW1iZXIpXG5cdHtcblx0XHRzdXBlci5fcFN0YXJ0UGFyc2luZyhmcmFtZUxpbWl0KTtcblxuXHRcdC8vY3JlYXRlIGEgY29udGVudCBvYmplY3QgZm9yIExvYWRlcnNcblx0XHR0aGlzLl9wQ29udGVudCA9IG5ldyBEaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cdH1cblxuXHRwcml2YXRlIGRpc3Bvc2UoKTp2b2lkXG5cdHtcblxuXHRcdGZvciAodmFyIGMgaW4gdGhpcy5fYmxvY2tzKSB7XG5cblx0XHRcdHZhciBiOkFXREJsb2NrID0gPEFXREJsb2NrPiB0aGlzLl9ibG9ja3NbIGMgXTtcblx0XHRcdGIuZGlzcG9zZSgpO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRwcml2YXRlIHBhcnNlTmV4dEJsb2NrKCk6dm9pZFxuXHR7XG5cdFx0dmFyIGJsb2NrOkFXREJsb2NrO1xuXHRcdHZhciBhc3NldERhdGE6SUFzc2V0O1xuXHRcdHZhciBpc1BhcnNlZDpib29sZWFuID0gZmFsc2U7XG5cdFx0dmFyIG5zOm51bWJlcjtcblx0XHR2YXIgdHlwZTpudW1iZXI7XG5cdFx0dmFyIGZsYWdzOm51bWJlcjtcblx0XHR2YXIgbGVuOm51bWJlcjtcblxuXHRcdHRoaXMuX2N1cl9ibG9ja19pZCA9IHRoaXMuX2JvZHkucmVhZFVuc2lnbmVkSW50KCk7XG5cblx0XHRucyA9IHRoaXMuX2JvZHkucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdHR5cGUgPSB0aGlzLl9ib2R5LnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHRmbGFncyA9IHRoaXMuX2JvZHkucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdGxlbiA9IHRoaXMuX2JvZHkucmVhZFVuc2lnbmVkSW50KCk7XG5cblx0XHR2YXIgYmxvY2tDb21wcmVzc2lvbjpib29sZWFuID0gQml0RmxhZ3MudGVzdChmbGFncywgQml0RmxhZ3MuRkxBRzQpO1xuXHRcdHZhciBibG9ja0NvbXByZXNzaW9uTFpNQTpib29sZWFuID0gQml0RmxhZ3MudGVzdChmbGFncywgQml0RmxhZ3MuRkxBRzUpO1xuXG5cdFx0aWYgKHRoaXMuX2FjY3VyYWN5T25CbG9ja3MpIHtcblx0XHRcdHRoaXMuX2FjY3VyYWN5TWF0cml4ID0gQml0RmxhZ3MudGVzdChmbGFncywgQml0RmxhZ3MuRkxBRzEpO1xuXHRcdFx0dGhpcy5fYWNjdXJhY3lHZW8gPSBCaXRGbGFncy50ZXN0KGZsYWdzLCBCaXRGbGFncy5GTEFHMik7XG5cdFx0XHR0aGlzLl9hY2N1cmFjeVByb3BzID0gQml0RmxhZ3MudGVzdChmbGFncywgQml0RmxhZ3MuRkxBRzMpO1xuXHRcdFx0dGhpcy5fZ2VvTnJUeXBlID0gQVdEUGFyc2VyLkZMT0FUMzI7XG5cblx0XHRcdGlmICh0aGlzLl9hY2N1cmFjeUdlbykge1xuXHRcdFx0XHR0aGlzLl9nZW9OclR5cGUgPSBBV0RQYXJzZXIuRkxPQVQ2NDtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fbWF0cml4TnJUeXBlID0gQVdEUGFyc2VyLkZMT0FUMzI7XG5cblx0XHRcdGlmICh0aGlzLl9hY2N1cmFjeU1hdHJpeCkge1xuXHRcdFx0XHR0aGlzLl9tYXRyaXhOclR5cGUgPSBBV0RQYXJzZXIuRkxPQVQ2NDtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fcHJvcHNOclR5cGUgPSBBV0RQYXJzZXIuRkxPQVQzMjtcblxuXHRcdFx0aWYgKHRoaXMuX2FjY3VyYWN5UHJvcHMpIHtcblx0XHRcdFx0dGhpcy5fcHJvcHNOclR5cGUgPSBBV0RQYXJzZXIuRkxPQVQ2NDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgYmxvY2tFbmRBbGw6bnVtYmVyID0gdGhpcy5fYm9keS5wb3NpdGlvbiArIGxlbjtcblxuXHRcdGlmIChsZW4gPiB0aGlzLl9ib2R5LmdldEJ5dGVzQXZhaWxhYmxlKCkpIHtcblx0XHRcdHRoaXMuX3BEaWVXaXRoRXJyb3IoJ0FXRDIgYmxvY2sgbGVuZ3RoIGlzIGJpZ2dlciB0aGFuIHRoZSBieXRlcyB0aGF0IGFyZSBhdmFpbGFibGUhJyk7XG5cdFx0XHR0aGlzLl9ib2R5LnBvc2l0aW9uICs9IHRoaXMuX2JvZHkuZ2V0Qnl0ZXNBdmFpbGFibGUoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dGhpcy5fbmV3QmxvY2tCeXRlcyA9IG5ldyBCeXRlQXJyYXkoKTtcblxuXG5cdFx0dGhpcy5fYm9keS5yZWFkQnl0ZXModGhpcy5fbmV3QmxvY2tCeXRlcywgMCwgbGVuKTtcblxuXHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdC8vIENvbXByZXNzZWQgQVdEIEZvcm1hdHMgbm90IHlldCBzdXBwb3J0ZWRcblxuXHRcdGlmIChibG9ja0NvbXByZXNzaW9uKSB7XG5cdFx0XHR0aGlzLl9wRGllV2l0aEVycm9yKCdDb21wcmVzc2VkIEFXRCBmb3JtYXRzIG5vdCB5ZXQgc3VwcG9ydGVkJyk7XG5cblx0XHRcdC8qXG5cdFx0XHQgaWYgKGJsb2NrQ29tcHJlc3Npb25MWk1BKVxuXHRcdFx0IHtcblx0XHRcdCB0aGlzLl9uZXdCbG9ja0J5dGVzLnVuY29tcHJlc3MoQVdEUGFyc2VyLkNPTVBSRVNTSU9OTU9ERV9MWk1BKTtcblx0XHRcdCB9XG5cdFx0XHQgZWxzZVxuXHRcdFx0IHtcblx0XHRcdCB0aGlzLl9uZXdCbG9ja0J5dGVzLnVuY29tcHJlc3MoKTtcblx0XHRcdCB9XG5cdFx0XHQgKi9cblxuXHRcdH1cblxuXHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdC8vIExJVFRMRV9FTkRJQU4gLSBEZWZhdWx0IGZvciBBcnJheUJ1ZmZlciAvIE5vdCBpbXBsZW1lbnRlZCBpbiBCeXRlQXJyYXlcblx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHQvL3RoaXMuX25ld0Jsb2NrQnl0ZXMuZW5kaWFuID0gRW5kaWFuLkxJVFRMRV9FTkRJQU47XG5cdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0XHR0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uID0gMDtcblx0XHRibG9jayA9IG5ldyBBV0RCbG9jaygpO1xuXHRcdGJsb2NrLmxlbiA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gKyBsZW47XG5cdFx0YmxvY2suaWQgPSB0aGlzLl9jdXJfYmxvY2tfaWQ7XG5cblx0XHR2YXIgYmxvY2tFbmRCbG9jazpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uICsgbGVuO1xuXG5cdFx0aWYgKGJsb2NrQ29tcHJlc3Npb24pIHtcblx0XHRcdHRoaXMuX3BEaWVXaXRoRXJyb3IoJ0NvbXByZXNzZWQgQVdEIGZvcm1hdHMgbm90IHlldCBzdXBwb3J0ZWQnKTtcblx0XHRcdC8vYmxvY2tFbmRCbG9jayAgID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiArIHRoaXMuX25ld0Jsb2NrQnl0ZXMubGVuZ3RoO1xuXHRcdFx0Ly9ibG9jay5sZW4gICAgICAgPSBibG9ja0VuZEJsb2NrO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJBV0RCbG9jazogIElEID0gXCIgKyB0aGlzLl9jdXJfYmxvY2tfaWQgKyBcIiB8IFR5cGVJRCA9IFwiICsgdHlwZSArIFwiIHwgQ29tcHJlc3Npb24gPSBcIiArIGJsb2NrQ29tcHJlc3Npb24gKyBcIiB8IE1hdHJpeC1QcmVjaXNpb24gPSBcIiArIHRoaXMuX2FjY3VyYWN5TWF0cml4ICsgXCIgfCBHZW9tZXRyeS1QcmVjaXNpb24gPSBcIiArIHRoaXMuX2FjY3VyYWN5R2VvICsgXCIgfCBQcm9wZXJ0aWVzLVByZWNpc2lvbiA9IFwiICsgdGhpcy5fYWNjdXJhY3lQcm9wcyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fYmxvY2tzW3RoaXMuX2N1cl9ibG9ja19pZF0gPSBibG9jaztcblxuXHRcdGlmICgodGhpcy5fdmVyc2lvblswXSA9PSAyKSAmJiAodGhpcy5fdmVyc2lvblsxXSA9PSAxKSkge1xuXG5cdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0Y2FzZSAxMTpcblx0XHRcdFx0XHR0aGlzLnBhcnNlUHJpbWl0dmVzKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0aXNQYXJzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDMxOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VTa3lib3hJbnN0YW5jZSh0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGlzUGFyc2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSA0MTpcblx0XHRcdFx0XHR0aGlzLnBhcnNlTGlnaHQodGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRpc1BhcnNlZCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgNDI6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZUNhbWVyYSh0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGlzUGFyc2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHQvLyAgY2FzZSA0Mzpcblx0XHRcdFx0Ly8gICAgICBwYXJzZVRleHR1cmVQcm9qZWN0b3IoX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdC8vICAgICAgaXNQYXJzZWQgPSB0cnVlO1xuXHRcdFx0XHQvLyAgICAgIGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgNTE6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZUxpZ2h0UGlja2VyKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0aXNQYXJzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDgxOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VNYXRlcmlhbF92MSh0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGlzUGFyc2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSA4Mzpcblx0XHRcdFx0XHR0aGlzLnBhcnNlQ3ViZVRleHR1cmUodGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRpc1BhcnNlZCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgOTE6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZVNoYXJlZE1ldGhvZEJsb2NrKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0aXNQYXJzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDkyOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VTaGFkb3dNZXRob2RCbG9jayh0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGlzUGFyc2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAxMTE6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZU1lc2hQb3NlQW5pbWF0aW9uKHRoaXMuX2N1cl9ibG9ja19pZCwgdHJ1ZSk7XG5cdFx0XHRcdFx0aXNQYXJzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDExMjpcblx0XHRcdFx0XHR0aGlzLnBhcnNlTWVzaFBvc2VBbmltYXRpb24odGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRpc1BhcnNlZCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMTEzOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VWZXJ0ZXhBbmltYXRpb25TZXQodGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRpc1BhcnNlZCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMTIyOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VBbmltYXRvclNldCh0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGlzUGFyc2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAyNTM6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZUNvbW1hbmQodGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRpc1BhcnNlZCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHQvLyovXG5cdFx0fVxuXHRcdC8vKlxuXHRcdGlmIChpc1BhcnNlZCA9PSBmYWxzZSkge1xuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cblx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VUcmlhbmdsZUdlb21ldHJpZUJsb2NrKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMjI6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZUNvbnRhaW5lcih0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDIzOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VNZXNoSW5zdGFuY2UodGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSA4MTpcblx0XHRcdFx0XHR0aGlzLnBhcnNlTWF0ZXJpYWwodGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSA4Mjpcblx0XHRcdFx0XHR0aGlzLnBhcnNlVGV4dHVyZSh0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDEwMTpcblx0XHRcdFx0XHR0aGlzLnBhcnNlU2tlbGV0b24odGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAxMDI6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZVNrZWxldG9uUG9zZSh0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDEwMzpcblx0XHRcdFx0XHR0aGlzLnBhcnNlU2tlbGV0b25BbmltYXRpb24odGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAxMjE6XG5cdFx0XHRcdFx0Ly90aGlzLnBhcnNlVVZBbmltYXRpb24odGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHQvL2JyZWFrO1xuXHRcdFx0XHRjYXNlIDI1NDpcblx0XHRcdFx0XHR0aGlzLnBhcnNlTmFtZVNwYWNlKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMjU1OlxuXHRcdFx0XHRcdHRoaXMucGFyc2VNZXRhRGF0YSh0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJBV0RCbG9jazogICBVbmtub3duIEJsb2NrVHlwZSAgKEJsb2NrSUQgPSBcIiArIHRoaXMuX2N1cl9ibG9ja19pZCArIFwiKSAtIFNraXAgXCIgKyBsZW4gKyBcIiBieXRlc1wiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiArPSBsZW47XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vKi9cblxuXHRcdHZhciBtc2dDbnQ6bnVtYmVyID0gMDtcblx0XHRpZiAodGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiA9PSBibG9ja0VuZEJsb2NrKSB7XG5cdFx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdFx0aWYgKGJsb2NrLmVycm9yTWVzc2FnZXMpIHtcblx0XHRcdFx0XHR3aGlsZSAobXNnQ250IDwgYmxvY2suZXJyb3JNZXNzYWdlcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiICAgICAgICAoISkgRXJyb3I6IFwiICsgYmxvY2suZXJyb3JNZXNzYWdlc1ttc2dDbnRdICsgXCIgKCEpXCIpO1xuXHRcdFx0XHRcdFx0bXNnQ250Kys7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJcXG5cIik7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiICAoISkoISkoISkgRXJyb3Igd2hpbGUgcmVhZGluZyBBV0RCbG9jayBJRCBcIiArIHRoaXMuX2N1cl9ibG9ja19pZCArIFwiID0gc2tpcCB0byBuZXh0IGJsb2NrXCIpO1xuXG5cdFx0XHRcdGlmIChibG9jay5lcnJvck1lc3NhZ2VzKSB7XG5cdFx0XHRcdFx0d2hpbGUgKG1zZ0NudCA8IGJsb2NrLmVycm9yTWVzc2FnZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIiAgICAgICAgKCEpIEVycm9yOiBcIiArIGJsb2NrLmVycm9yTWVzc2FnZXNbbXNnQ250XSArIFwiICghKVwiKTtcblx0XHRcdFx0XHRcdG1zZ0NudCsrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX2JvZHkucG9zaXRpb24gPSBibG9ja0VuZEFsbDtcblx0XHR0aGlzLl9uZXdCbG9ja0J5dGVzID0gbnVsbDtcblxuXHR9XG5cblxuXHQvLy0tUGFyc2VyIEJsb2Nrcy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdC8vQmxvY2sgSUQgPSAxXG5cdHByaXZhdGUgcGFyc2VUcmlhbmdsZUdlb21ldHJpZUJsb2NrKGJsb2NrSUQ6bnVtYmVyKTp2b2lkXG5cdHtcblxuXHRcdHZhciBnZW9tOkdlb21ldHJ5ID0gbmV3IEdlb21ldHJ5KCk7XG5cblx0XHQvLyBSZWFkIG5hbWUgYW5kIHN1YiBjb3VudFxuXHRcdHZhciBuYW1lOnN0cmluZyA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblx0XHR2YXIgbnVtX3N1YnM6bnVtYmVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXG5cdFx0Ly8gUmVhZCBvcHRpb25hbCBwcm9wZXJ0aWVzXG5cdFx0dmFyIHByb3BzOkFXRFByb3BlcnRpZXMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7MTp0aGlzLl9nZW9OclR5cGUsIDI6dGhpcy5fZ2VvTnJUeXBlfSk7XG5cdFx0dmFyIGdlb1NjYWxlVTpudW1iZXIgPSBwcm9wcy5nZXQoMSwgMSk7XG5cdFx0dmFyIGdlb1NjYWxlVjpudW1iZXIgPSBwcm9wcy5nZXQoMiwgMSk7XG5cblx0XHQvLyBMb29wIHRocm91Z2ggc3ViIG1lc2hlc1xuXHRcdHZhciBzdWJzX3BhcnNlZDpudW1iZXIgPSAwO1xuXHRcdHdoaWxlIChzdWJzX3BhcnNlZCA8IG51bV9zdWJzKSB7XG5cdFx0XHR2YXIgaTpudW1iZXI7XG5cdFx0XHR2YXIgc21fbGVuOm51bWJlciwgc21fZW5kOm51bWJlcjtcblx0XHRcdHZhciBzdWJfZ2VvbTpUcmlhbmdsZVN1Ykdlb21ldHJ5O1xuXHRcdFx0dmFyIHdfaW5kaWNlczpBcnJheTxudW1iZXI+O1xuXHRcdFx0dmFyIHdlaWdodHM6QXJyYXk8bnVtYmVyPjtcblxuXHRcdFx0c21fbGVuID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRcdHNtX2VuZCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gKyBzbV9sZW47XG5cblx0XHRcdC8vIElnbm9yZSBmb3Igbm93XG5cdFx0XHR2YXIgc3ViUHJvcHM6QVdEUHJvcGVydGllcyA9IHRoaXMucGFyc2VQcm9wZXJ0aWVzKHsxOnRoaXMuX2dlb05yVHlwZSwgMjp0aGlzLl9nZW9OclR5cGV9KTtcblx0XHRcdC8vIExvb3AgdGhyb3VnaCBkYXRhIHN0cmVhbXNcblx0XHRcdHdoaWxlICh0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uIDwgc21fZW5kKSB7XG5cdFx0XHRcdHZhciBpZHg6bnVtYmVyID0gMDtcblx0XHRcdFx0dmFyIHN0cl9mdHlwZTpudW1iZXIsIHN0cl90eXBlOm51bWJlciwgc3RyX2xlbjpudW1iZXIsIHN0cl9lbmQ6bnVtYmVyO1xuXG5cdFx0XHRcdC8vIFR5cGUsIGZpZWxkIHR5cGUsIGxlbmd0aFxuXHRcdFx0XHRzdHJfdHlwZSA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdFx0XHRzdHJfZnR5cGUgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHRcdFx0c3RyX2xlbiA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0XHRcdHN0cl9lbmQgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uICsgc3RyX2xlbjtcblxuXHRcdFx0XHR2YXIgeDpudW1iZXIsIHk6bnVtYmVyLCB6Om51bWJlcjtcblxuXHRcdFx0XHRpZiAoc3RyX3R5cGUgPT0gMSkge1xuXHRcdFx0XHRcdHZhciB2ZXJ0czpBcnJheTxudW1iZXI+ID0gbmV3IEFycmF5PG51bWJlcj4oKTtcblxuXHRcdFx0XHRcdHdoaWxlICh0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uIDwgc3RyX2VuZCkge1xuXHRcdFx0XHRcdFx0Ly8gVE9ETzogUmVzcGVjdCBzdHJlYW0gZmllbGQgdHlwZVxuXHRcdFx0XHRcdFx0eCA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeUdlbyk7XG5cdFx0XHRcdFx0XHR5ID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5R2VvKTtcblx0XHRcdFx0XHRcdHogPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lHZW8pO1xuXG5cdFx0XHRcdFx0XHR2ZXJ0c1tpZHgrK10gPSB4O1xuXHRcdFx0XHRcdFx0dmVydHNbaWR4KytdID0geTtcblx0XHRcdFx0XHRcdHZlcnRzW2lkeCsrXSA9IHo7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2UgaWYgKHN0cl90eXBlID09IDIpIHtcblx0XHRcdFx0XHR2YXIgaW5kaWNlczpBcnJheTxudW1iZXI+ID0gbmV3IEFycmF5PG51bWJlcj4oKTtcblxuXHRcdFx0XHRcdHdoaWxlICh0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uIDwgc3RyX2VuZCkge1xuXHRcdFx0XHRcdFx0Ly8gVE9ETzogUmVzcGVjdCBzdHJlYW0gZmllbGQgdHlwZVxuXHRcdFx0XHRcdFx0aW5kaWNlc1tpZHgrK10gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0gZWxzZSBpZiAoc3RyX3R5cGUgPT0gMykge1xuXHRcdFx0XHRcdHZhciB1dnM6QXJyYXk8bnVtYmVyPiA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cdFx0XHRcdFx0d2hpbGUgKHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPCBzdHJfZW5kKSB7XG5cdFx0XHRcdFx0XHR1dnNbaWR4KytdID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5R2VvKTtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChzdHJfdHlwZSA9PSA0KSB7XG5cblx0XHRcdFx0XHR2YXIgbm9ybWFsczpBcnJheTxudW1iZXI+ID0gbmV3IEFycmF5PG51bWJlcj4oKTtcblxuXHRcdFx0XHRcdHdoaWxlICh0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uIDwgc3RyX2VuZCkge1xuXHRcdFx0XHRcdFx0bm9ybWFsc1tpZHgrK10gPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lHZW8pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9IGVsc2UgaWYgKHN0cl90eXBlID09IDYpIHtcblx0XHRcdFx0XHR3X2luZGljZXMgPSBBcnJheTxudW1iZXI+KCk7XG5cblx0XHRcdFx0XHR3aGlsZSAodGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiA8IHN0cl9lbmQpIHtcblx0XHRcdFx0XHRcdHdfaW5kaWNlc1tpZHgrK10gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCkqMzsgLy8gVE9ETzogUmVzcGVjdCBzdHJlYW0gZmllbGQgdHlwZVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9IGVsc2UgaWYgKHN0cl90eXBlID09IDcpIHtcblxuXHRcdFx0XHRcdHdlaWdodHMgPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuXG5cdFx0XHRcdFx0d2hpbGUgKHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPCBzdHJfZW5kKSB7XG5cdFx0XHRcdFx0XHR3ZWlnaHRzW2lkeCsrXSA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeUdlbyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPSBzdHJfZW5kO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7IC8vIElnbm9yZSBzdWItbWVzaCBhdHRyaWJ1dGVzIGZvciBub3dcblxuXHRcdFx0c3ViX2dlb20gPSBuZXcgVHJpYW5nbGVTdWJHZW9tZXRyeSh0cnVlKTtcblx0XHRcdGlmICh3ZWlnaHRzKVxuXHRcdFx0XHRzdWJfZ2VvbS5qb2ludHNQZXJWZXJ0ZXggPSB3ZWlnaHRzLmxlbmd0aC8odmVydHMubGVuZ3RoLzMpO1xuXHRcdFx0aWYgKG5vcm1hbHMpXG5cdFx0XHRcdHN1Yl9nZW9tLmF1dG9EZXJpdmVOb3JtYWxzID0gZmFsc2U7XG5cdFx0XHRpZiAodXZzKVxuXHRcdFx0XHRzdWJfZ2VvbS5hdXRvRGVyaXZlVVZzID0gZmFsc2U7XG5cdFx0XHRzdWJfZ2VvbS51cGRhdGVJbmRpY2VzKGluZGljZXMpO1xuXHRcdFx0c3ViX2dlb20udXBkYXRlUG9zaXRpb25zKHZlcnRzKTtcblx0XHRcdHN1Yl9nZW9tLnVwZGF0ZVZlcnRleE5vcm1hbHMobm9ybWFscyk7XG5cdFx0XHRzdWJfZ2VvbS51cGRhdGVVVnModXZzKTtcblx0XHRcdHN1Yl9nZW9tLnVwZGF0ZVZlcnRleFRhbmdlbnRzKG51bGwpO1xuXHRcdFx0c3ViX2dlb20udXBkYXRlSm9pbnRXZWlnaHRzKHdlaWdodHMpO1xuXHRcdFx0c3ViX2dlb20udXBkYXRlSm9pbnRJbmRpY2VzKHdfaW5kaWNlcyk7XG5cblx0XHRcdHZhciBzY2FsZVU6bnVtYmVyID0gc3ViUHJvcHMuZ2V0KDEsIDEpO1xuXHRcdFx0dmFyIHNjYWxlVjpudW1iZXIgPSBzdWJQcm9wcy5nZXQoMiwgMSk7XG5cdFx0XHR2YXIgc2V0U3ViVVZzOmJvb2xlYW4gPSBmYWxzZTsgLy90aGlzIHNob3VsZCByZW1haW4gZmFsc2UgYXRtLCBiZWNhdXNlIGluIEF3YXlCdWlsZGVyIHRoZSB1diBpcyBvbmx5IHNjYWxlZCBieSB0aGUgZ2VvbWV0cnlcblxuXHRcdFx0aWYgKChnZW9TY2FsZVUgIT0gc2NhbGVVKSB8fCAoZ2VvU2NhbGVWICE9IHNjYWxlVikpIHtcblx0XHRcdFx0c2V0U3ViVVZzID0gdHJ1ZTtcblx0XHRcdFx0c2NhbGVVID0gZ2VvU2NhbGVVL3NjYWxlVTtcblx0XHRcdFx0c2NhbGVWID0gZ2VvU2NhbGVWL3NjYWxlVjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHNldFN1YlVWcylcblx0XHRcdFx0c3ViX2dlb20uc2NhbGVVVihzY2FsZVUsIHNjYWxlVik7XG5cblx0XHRcdGdlb20uYWRkU3ViR2VvbWV0cnkoc3ViX2dlb20pO1xuXG5cdFx0XHQvLyBUT0RPOiBTb21laG93IG1hcCBpbi1zdWIgdG8gb3V0LXN1YiBpbmRpY2VzIHRvIGVuYWJsZSBsb29rLXVwXG5cdFx0XHQvLyB3aGVuIGNyZWF0aW5nIG1lc2hlcyAoYW5kIHRoZWlyIG1hdGVyaWFsIGFzc2lnbm1lbnRzLilcblxuXHRcdFx0c3Vic19wYXJzZWQrKztcblx0XHR9XG5cdFx0aWYgKChnZW9TY2FsZVUgIT0gMSkgfHwgKGdlb1NjYWxlViAhPSAxKSlcblx0XHRcdGdlb20uc2NhbGVVVihnZW9TY2FsZVUsIGdlb1NjYWxlVik7XG5cdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQoPElBc3NldD4gZ2VvbSwgbmFtZSk7XG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBnZW9tO1xuXG5cdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIFRyaWFuZ2xlR2VvbWV0cnk6IE5hbWUgPSBcIiArIG5hbWUgKyBcInwgSWQgPSBcIiArIHN1Yl9nZW9tLmlkKTtcblx0XHR9XG5cblx0fVxuXG5cdC8vQmxvY2sgSUQgPSAxMVxuXHRwcml2YXRlIHBhcnNlUHJpbWl0dmVzKGJsb2NrSUQ6bnVtYmVyKTp2b2lkXG5cdHtcblx0XHR2YXIgbmFtZTpzdHJpbmc7XG5cdFx0dmFyIHByZWZhYjpQcmVmYWJCYXNlO1xuXHRcdHZhciBwcmltVHlwZTpudW1iZXI7XG5cdFx0dmFyIHN1YnNfcGFyc2VkOm51bWJlcjtcblx0XHR2YXIgcHJvcHM6QVdEUHJvcGVydGllcztcblx0XHR2YXIgYnNtOk1hdHJpeDNEO1xuXG5cdFx0Ly8gUmVhZCBuYW1lIGFuZCBzdWIgY291bnRcblx0XHRuYW1lID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXHRcdHByaW1UeXBlID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRCeXRlKCk7XG5cdFx0cHJvcHMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7MTAxOnRoaXMuX2dlb05yVHlwZSwgMTAyOnRoaXMuX2dlb05yVHlwZSwgMTAzOnRoaXMuX2dlb05yVHlwZSwgMTEwOnRoaXMuX2dlb05yVHlwZSwgMTExOnRoaXMuX2dlb05yVHlwZSwgMzAxOkFXRFBhcnNlci5VSU5UMTYsIDMwMjpBV0RQYXJzZXIuVUlOVDE2LCAzMDM6QVdEUGFyc2VyLlVJTlQxNiwgNzAxOkFXRFBhcnNlci5CT09MLCA3MDI6QVdEUGFyc2VyLkJPT0wsIDcwMzpBV0RQYXJzZXIuQk9PTCwgNzA0OkFXRFBhcnNlci5CT09MfSk7XG5cblx0XHR2YXIgcHJpbWl0aXZlVHlwZXM6QXJyYXk8c3RyaW5nPiA9IFtcIlVuc3VwcG9ydGVkIFR5cGUtSURcIiwgXCJQcmltaXRpdmVQbGFuZVByZWZhYlwiLCBcIlByaW1pdGl2ZUN1YmVQcmVmYWJcIiwgXCJQcmltaXRpdmVTcGhlcmVQcmVmYWJcIiwgXCJQcmltaXRpdmVDeWxpbmRlclByZWZhYlwiLCBcIlByaW1pdGl2ZXNDb25lUHJlZmFiXCIsIFwiUHJpbWl0aXZlc0NhcHN1bGVQcmVmYWJcIiwgXCJQcmltaXRpdmVzVG9ydXNQcmVmYWJcIl1cblxuXHRcdHN3aXRjaCAocHJpbVR5cGUpIHtcblx0XHRcdC8vIHRvIGRvLCBub3QgYWxsIHByb3BlcnRpZXMgYXJlIHNldCBvbiBhbGwgcHJpbWl0aXZlc1xuXG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHByZWZhYiA9IG5ldyBQcmltaXRpdmVQbGFuZVByZWZhYihwcm9wcy5nZXQoMTAxLCAxMDApLCBwcm9wcy5nZXQoMTAyLCAxMDApLCBwcm9wcy5nZXQoMzAxLCAxKSwgcHJvcHMuZ2V0KDMwMiwgMSksIHByb3BzLmdldCg3MDEsIHRydWUpLCBwcm9wcy5nZXQoNzAyLCBmYWxzZSkpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRwcmVmYWIgPSBuZXcgUHJpbWl0aXZlQ3ViZVByZWZhYihwcm9wcy5nZXQoMTAxLCAxMDApLCBwcm9wcy5nZXQoMTAyLCAxMDApLCBwcm9wcy5nZXQoMTAzLCAxMDApLCBwcm9wcy5nZXQoMzAxLCAxKSwgcHJvcHMuZ2V0KDMwMiwgMSksIHByb3BzLmdldCgzMDMsIDEpLCBwcm9wcy5nZXQoNzAxLCB0cnVlKSk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIDM6XG5cdFx0XHRcdHByZWZhYiA9IG5ldyBQcmltaXRpdmVTcGhlcmVQcmVmYWIocHJvcHMuZ2V0KDEwMSwgNTApLCBwcm9wcy5nZXQoMzAxLCAxNiksIHByb3BzLmdldCgzMDIsIDEyKSwgcHJvcHMuZ2V0KDcwMSwgdHJ1ZSkpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHRwcmVmYWIgPSBuZXcgUHJpbWl0aXZlQ3lsaW5kZXJQcmVmYWIocHJvcHMuZ2V0KDEwMSwgNTApLCBwcm9wcy5nZXQoMTAyLCA1MCksIHByb3BzLmdldCgxMDMsIDEwMCksIHByb3BzLmdldCgzMDEsIDE2KSwgcHJvcHMuZ2V0KDMwMiwgMSksIHRydWUsIHRydWUsIHRydWUpOyAvLyBib29sNzAxLCBib29sNzAyLCBib29sNzAzLCBib29sNzA0KTtcblx0XHRcdFx0aWYgKCFwcm9wcy5nZXQoNzAxLCB0cnVlKSlcblx0XHRcdFx0XHQoPFByaW1pdGl2ZUN5bGluZGVyUHJlZmFiPnByZWZhYikudG9wQ2xvc2VkID0gZmFsc2U7XG5cdFx0XHRcdGlmICghcHJvcHMuZ2V0KDcwMiwgdHJ1ZSkpXG5cdFx0XHRcdFx0KDxQcmltaXRpdmVDeWxpbmRlclByZWZhYj5wcmVmYWIpLmJvdHRvbUNsb3NlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZiAoIXByb3BzLmdldCg3MDMsIHRydWUpKVxuXHRcdFx0XHRcdCg8UHJpbWl0aXZlQ3lsaW5kZXJQcmVmYWI+cHJlZmFiKS55VXAgPSBmYWxzZTtcblxuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSA1OlxuXHRcdFx0XHRwcmVmYWIgPSBuZXcgUHJpbWl0aXZlQ29uZVByZWZhYihwcm9wcy5nZXQoMTAxLCA1MCksIHByb3BzLmdldCgxMDIsIDEwMCksIHByb3BzLmdldCgzMDEsIDE2KSwgcHJvcHMuZ2V0KDMwMiwgMSksIHByb3BzLmdldCg3MDEsIHRydWUpLCBwcm9wcy5nZXQoNzAyLCB0cnVlKSk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIDY6XG5cdFx0XHRcdHByZWZhYiA9IG5ldyBQcmltaXRpdmVDYXBzdWxlUHJlZmFiKHByb3BzLmdldCgxMDEsIDUwKSwgcHJvcHMuZ2V0KDEwMiwgMTAwKSwgcHJvcHMuZ2V0KDMwMSwgMTYpLCBwcm9wcy5nZXQoMzAyLCAxNSksIHByb3BzLmdldCg3MDEsIHRydWUpKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgNzpcblx0XHRcdFx0cHJlZmFiID0gbmV3IFByaW1pdGl2ZVRvcnVzUHJlZmFiKHByb3BzLmdldCgxMDEsIDUwKSwgcHJvcHMuZ2V0KDEwMiwgNTApLCBwcm9wcy5nZXQoMzAxLCAxNiksIHByb3BzLmdldCgzMDIsIDgpLCBwcm9wcy5nZXQoNzAxLCB0cnVlKSk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRwcmVmYWIgPSBuZXcgUHJlZmFiQmFzZSgpO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkVSUk9SOiBVTlNVUFBPUlRFRCBQUkVGQUJfVFlQRVwiKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0aWYgKChwcm9wcy5nZXQoMTEwLCAxKSAhPSAxKSB8fCAocHJvcHMuZ2V0KDExMSwgMSkgIT0gMSkpIHtcblx0XHRcdC8vZ2VvbS5zdWJHZW9tZXRyaWVzO1xuXHRcdFx0Ly9nZW9tLnNjYWxlVVYocHJvcHMuZ2V0KDExMCwgMSksIHByb3BzLmdldCgxMTEsIDEpKTsgLy9UT0RPIGFkZCBiYWNrIHNjYWxpbmcgdG8gcHJlZmFic1xuXHRcdH1cblxuXHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdHByZWZhYi5uYW1lID0gbmFtZTtcblx0XHR0aGlzLl9wRmluYWxpemVBc3NldChwcmVmYWIsIG5hbWUpO1xuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gcHJlZmFiO1xuXG5cdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHRpZiAoKHByaW1UeXBlIDwgMCkgfHwgKHByaW1UeXBlID4gNykpIHtcblx0XHRcdFx0cHJpbVR5cGUgPSAwO1xuXHRcdFx0fVxuXHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBQcmltaXZpdGU6IE5hbWUgPSBcIiArIG5hbWUgKyBcInwgdHlwZSA9IFwiICsgcHJpbWl0aXZlVHlwZXNbcHJpbVR5cGVdKTtcblx0XHR9XG5cdH1cblxuXHQvLyBCbG9jayBJRCA9IDIyXG5cdHByaXZhdGUgcGFyc2VDb250YWluZXIoYmxvY2tJRDpudW1iZXIpOnZvaWRcblx0e1xuXHRcdHZhciBuYW1lOnN0cmluZztcblx0XHR2YXIgcGFyX2lkOm51bWJlcjtcblx0XHR2YXIgbXR4Ok1hdHJpeDNEO1xuXHRcdHZhciBjdHI6RGlzcGxheU9iamVjdENvbnRhaW5lcjtcblx0XHR2YXIgcGFyZW50OkRpc3BsYXlPYmplY3RDb250YWluZXI7XG5cblx0XHRwYXJfaWQgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdG10eCA9IHRoaXMucGFyc2VNYXRyaXgzRCgpO1xuXHRcdG5hbWUgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cblx0XHR2YXIgcGFyZW50TmFtZTpzdHJpbmcgPSBcIlJvb3QgKFRvcExldmVsKVwiO1xuXHRcdGN0ciA9IG5ldyBEaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cdFx0Y3RyLnRyYW5zZm9ybS5tYXRyaXgzRCA9IG10eDtcblxuXHRcdHZhciByZXR1cm5lZEFycmF5OkFycmF5PGFueT4gPSB0aGlzLmdldEFzc2V0QnlJRChwYXJfaWQsIFtBc3NldFR5cGUuQ09OVEFJTkVSLCBBc3NldFR5cGUuTElHSFQsIEFzc2V0VHlwZS5NRVNIXSk7XG5cblx0XHRpZiAocmV0dXJuZWRBcnJheVswXSkge1xuXHRcdFx0dmFyIG9iajpEaXNwbGF5T2JqZWN0ID0gKDxEaXNwbGF5T2JqZWN0Q29udGFpbmVyPiByZXR1cm5lZEFycmF5WzFdKS5hZGRDaGlsZChjdHIpO1xuXHRcdFx0cGFyZW50TmFtZSA9ICg8RGlzcGxheU9iamVjdENvbnRhaW5lcj4gcmV0dXJuZWRBcnJheVsxXSkubmFtZTtcblx0XHR9IGVsc2UgaWYgKHBhcl9pZCA+IDApIHtcblx0XHRcdHRoaXMuX2Jsb2Nrc1sgYmxvY2tJRCBdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgYSBwYXJlbnQgZm9yIHRoaXMgT2JqZWN0Q29udGFpbmVyM0RcIik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vYWRkIHRvIHRoZSBjb250ZW50IHByb3BlcnR5XG5cdFx0XHQoPERpc3BsYXlPYmplY3RDb250YWluZXI+IHRoaXMuX3BDb250ZW50KS5hZGRDaGlsZChjdHIpO1xuXHRcdH1cblxuXHRcdC8vIGluIEFXRCB2ZXJzaW9uIDIuMSB3ZSByZWFkIHRoZSBDb250YWluZXIgcHJvcGVydGllc1xuXHRcdGlmICgodGhpcy5fdmVyc2lvblswXSA9PSAyKSAmJiAodGhpcy5fdmVyc2lvblsxXSA9PSAxKSkge1xuXHRcdFx0dmFyIHByb3BzOkFXRFByb3BlcnRpZXMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7MTp0aGlzLl9tYXRyaXhOclR5cGUsIDI6dGhpcy5fbWF0cml4TnJUeXBlLCAzOnRoaXMuX21hdHJpeE5yVHlwZSwgNDpBV0RQYXJzZXIuVUlOVDh9KTtcblx0XHRcdGN0ci5waXZvdCA9IG5ldyBWZWN0b3IzRChwcm9wcy5nZXQoMSwgMCksIHByb3BzLmdldCgyLCAwKSwgcHJvcHMuZ2V0KDMsIDApKTtcblx0XHR9XG5cdFx0Ly8gaW4gb3RoZXIgdmVyc2lvbnMgd2UgZG8gbm90IHJlYWQgdGhlIENvbnRhaW5lciBwcm9wZXJ0aWVzXG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLnBhcnNlUHJvcGVydGllcyhudWxsKTtcblx0XHR9XG5cblx0XHQvLyB0aGUgZXh0cmFQcm9wZXJ0aWVzIHNob3VsZCBvbmx5IGJlIHNldCBmb3IgQVdEMi4xLUZpbGVzLCBidXQgaXMgcmVhZCBmb3IgYm90aCB2ZXJzaW9uc1xuXHRcdGN0ci5leHRyYSA9IHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXG5cdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQoPElBc3NldD4gY3RyLCBuYW1lKTtcblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IGN0cjtcblxuXHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBDb250YWluZXI6IE5hbWUgPSAnXCIgKyBuYW1lICsgXCInIHwgUGFyZW50LU5hbWUgPSBcIiArIHBhcmVudE5hbWUpO1xuXHRcdH1cblx0fVxuXG5cdC8vIEJsb2NrIElEID0gMjNcblx0cHJpdmF0ZSBwYXJzZU1lc2hJbnN0YW5jZShibG9ja0lEOm51bWJlcik6dm9pZFxuXHR7XG5cdFx0dmFyIG51bV9tYXRlcmlhbHM6bnVtYmVyO1xuXHRcdHZhciBtYXRlcmlhbHNfcGFyc2VkOm51bWJlcjtcblx0XHR2YXIgcGFyZW50OkRpc3BsYXlPYmplY3RDb250YWluZXI7XG5cdFx0dmFyIHBhcl9pZDpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdHZhciBtdHg6TWF0cml4M0QgPSB0aGlzLnBhcnNlTWF0cml4M0QoKTtcblx0XHR2YXIgbmFtZTpzdHJpbmcgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0dmFyIHBhcmVudE5hbWU6c3RyaW5nID0gXCJSb290IChUb3BMZXZlbClcIjtcblx0XHR2YXIgZGF0YV9pZDpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdHZhciBnZW9tOkdlb21ldHJ5O1xuXHRcdHZhciByZXR1cm5lZEFycmF5R2VvbWV0cnk6QXJyYXk8YW55PiA9IHRoaXMuZ2V0QXNzZXRCeUlEKGRhdGFfaWQsIFtBc3NldFR5cGUuR0VPTUVUUlldKVxuXG5cdFx0aWYgKHJldHVybmVkQXJyYXlHZW9tZXRyeVswXSkge1xuXHRcdFx0Z2VvbSA9IDxHZW9tZXRyeT4gcmV0dXJuZWRBcnJheUdlb21ldHJ5WzFdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCBhIEdlb21ldHJ5IGZvciB0aGlzIE1lc2guIEEgZW1wdHkgR2VvbWV0cnkgaXMgY3JlYXRlZCFcIik7XG5cdFx0XHRnZW9tID0gbmV3IEdlb21ldHJ5KCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmdlb0lEID0gZGF0YV9pZDtcblx0XHR2YXIgbWF0ZXJpYWxzOkFycmF5PE1hdGVyaWFsQmFzZT4gPSBuZXcgQXJyYXk8TWF0ZXJpYWxCYXNlPigpO1xuXHRcdG51bV9tYXRlcmlhbHMgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cblx0XHR2YXIgbWF0ZXJpYWxOYW1lczpBcnJheTxzdHJpbmc+ID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblx0XHRtYXRlcmlhbHNfcGFyc2VkID0gMDtcblxuXHRcdHZhciByZXR1cm5lZEFycmF5TWF0ZXJpYWw6QXJyYXk8YW55PjtcblxuXHRcdHdoaWxlIChtYXRlcmlhbHNfcGFyc2VkIDwgbnVtX21hdGVyaWFscykge1xuXHRcdFx0dmFyIG1hdF9pZDpudW1iZXI7XG5cdFx0XHRtYXRfaWQgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdFx0cmV0dXJuZWRBcnJheU1hdGVyaWFsID0gdGhpcy5nZXRBc3NldEJ5SUQobWF0X2lkLCBbQXNzZXRUeXBlLk1BVEVSSUFMXSlcblx0XHRcdGlmICgoIXJldHVybmVkQXJyYXlNYXRlcmlhbFswXSkgJiYgKG1hdF9pZCA+IDApKSB7XG5cdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIE1hdGVyaWFsIE5yIFwiICsgbWF0ZXJpYWxzX3BhcnNlZCArIFwiIChJRCA9IFwiICsgbWF0X2lkICsgXCIgKSBmb3IgdGhpcyBNZXNoXCIpO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgbTpNYXRlcmlhbEJhc2UgPSA8TWF0ZXJpYWxCYXNlPiByZXR1cm5lZEFycmF5TWF0ZXJpYWxbMV07XG5cblx0XHRcdG1hdGVyaWFscy5wdXNoKG0pO1xuXHRcdFx0bWF0ZXJpYWxOYW1lcy5wdXNoKG0ubmFtZSk7XG5cblx0XHRcdG1hdGVyaWFsc19wYXJzZWQrKztcblx0XHR9XG5cblx0XHR2YXIgbWVzaDpNZXNoID0gbmV3IE1lc2goZ2VvbSwgbnVsbCk7XG5cdFx0bWVzaC50cmFuc2Zvcm0ubWF0cml4M0QgPSBtdHg7XG5cblx0XHR2YXIgcmV0dXJuZWRBcnJheVBhcmVudDpBcnJheTxhbnk+ID0gdGhpcy5nZXRBc3NldEJ5SUQocGFyX2lkLCBbQXNzZXRUeXBlLkNPTlRBSU5FUiwgQXNzZXRUeXBlLkxJR0hULCBBc3NldFR5cGUuTUVTSF0pXG5cblx0XHRpZiAocmV0dXJuZWRBcnJheVBhcmVudFswXSkge1xuXHRcdFx0dmFyIG9iakM6RGlzcGxheU9iamVjdENvbnRhaW5lciA9IDxEaXNwbGF5T2JqZWN0Q29udGFpbmVyPiByZXR1cm5lZEFycmF5UGFyZW50WzFdO1xuXHRcdFx0b2JqQy5hZGRDaGlsZChtZXNoKTtcblx0XHRcdHBhcmVudE5hbWUgPSBvYmpDLm5hbWU7XG5cdFx0fSBlbHNlIGlmIChwYXJfaWQgPiAwKSB7XG5cdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCBhIHBhcmVudCBmb3IgdGhpcyBNZXNoXCIpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvL2FkZCB0byB0aGUgY29udGVudCBwcm9wZXJ0eVxuXHRcdFx0KDxEaXNwbGF5T2JqZWN0Q29udGFpbmVyPiB0aGlzLl9wQ29udGVudCkuYWRkQ2hpbGQobWVzaCk7XG5cdFx0fVxuXG5cdFx0aWYgKG1hdGVyaWFscy5sZW5ndGggPj0gMSAmJiBtZXNoLnN1Yk1lc2hlcy5sZW5ndGggPT0gMSkge1xuXHRcdFx0bWVzaC5tYXRlcmlhbCA9IG1hdGVyaWFsc1swXTtcblx0XHR9IGVsc2UgaWYgKG1hdGVyaWFscy5sZW5ndGggPiAxKSB7XG5cdFx0XHR2YXIgaTpudW1iZXI7XG5cblx0XHRcdC8vIEFzc2lnbiBlYWNoIHN1Yi1tZXNoIGluIHRoZSBtZXNoIGEgbWF0ZXJpYWwgZnJvbSB0aGUgbGlzdC4gSWYgbW9yZSBzdWItbWVzaGVzXG5cdFx0XHQvLyB0aGFuIG1hdGVyaWFscywgcmVwZWF0IHRoZSBsYXN0IG1hdGVyaWFsIGZvciBhbGwgcmVtYWluaW5nIHN1Yi1tZXNoZXMuXG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgbWVzaC5zdWJNZXNoZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0bWVzaC5zdWJNZXNoZXNbaV0ubWF0ZXJpYWwgPSBtYXRlcmlhbHNbTWF0aC5taW4obWF0ZXJpYWxzLmxlbmd0aCAtIDEsIGkpXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKCh0aGlzLl92ZXJzaW9uWzBdID09IDIpICYmICh0aGlzLl92ZXJzaW9uWzFdID09IDEpKSB7XG5cdFx0XHR2YXIgcHJvcHM6QVdEUHJvcGVydGllcyA9IHRoaXMucGFyc2VQcm9wZXJ0aWVzKHsxOnRoaXMuX21hdHJpeE5yVHlwZSwgMjp0aGlzLl9tYXRyaXhOclR5cGUsIDM6dGhpcy5fbWF0cml4TnJUeXBlLCA0OkFXRFBhcnNlci5VSU5UOCwgNTpBV0RQYXJzZXIuQk9PTH0pO1xuXHRcdFx0bWVzaC5waXZvdCA9IG5ldyBWZWN0b3IzRCg8bnVtYmVyPnByb3BzLmdldCgxLCAwKSwgPG51bWJlcj5wcm9wcy5nZXQoMiwgMCksIDxudW1iZXI+IHByb3BzLmdldCgzLCAwKSk7XG5cdFx0XHRtZXNoLmNhc3RzU2hhZG93cyA9IHByb3BzLmdldCg1LCB0cnVlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5wYXJzZVByb3BlcnRpZXMobnVsbCk7XG5cdFx0fVxuXG5cdFx0bWVzaC5leHRyYSA9IHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXG5cdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQoPElBc3NldD4gbWVzaCwgbmFtZSk7XG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBtZXNoO1xuXG5cdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIE1lc2g6IE5hbWUgPSAnXCIgKyBuYW1lICsgXCInIHwgUGFyZW50LU5hbWUgPSBcIiArIHBhcmVudE5hbWUgKyBcInwgR2VvbWV0cnktTmFtZSA9IFwiICsgZ2VvbS5uYW1lICsgXCIgfCBTdWJNZXNoZXMgPSBcIiArIG1lc2guc3ViTWVzaGVzLmxlbmd0aCArIFwiIHwgTWF0LU5hbWVzID0gXCIgKyBtYXRlcmlhbE5hbWVzLnRvU3RyaW5nKCkpO1xuXHRcdH1cblx0fVxuXG5cblx0Ly9CbG9jayBJRCAzMVxuXHRwcml2YXRlIHBhcnNlU2t5Ym94SW5zdGFuY2UoYmxvY2tJRDpudW1iZXIpOnZvaWRcblx0e1xuXHRcdHZhciBuYW1lOnN0cmluZyA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblx0XHR2YXIgY3ViZVRleEFkZHI6bnVtYmVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblxuXHRcdHZhciByZXR1cm5lZEFycmF5Q3ViZVRleDpBcnJheTxhbnk+ID0gdGhpcy5nZXRBc3NldEJ5SUQoY3ViZVRleEFkZHIsIFtBc3NldFR5cGUuVEVYVFVSRV0sIFwiQ3ViZVRleHR1cmVcIik7XG5cdFx0aWYgKCghcmV0dXJuZWRBcnJheUN1YmVUZXhbMF0pICYmIChjdWJlVGV4QWRkciAhPSAwKSlcblx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBDdWJldGV4dHVyZSAoSUQgPSBcIiArIGN1YmVUZXhBZGRyICsgXCIgKSBmb3IgdGhpcyBTa3lib3hcIik7XG5cdFx0dmFyIGFzc2V0OlNreWJveCA9IG5ldyBTa3lib3gobmV3IFNreWJveE1hdGVyaWFsKDxJbWFnZUN1YmVUZXh0dXJlPiByZXR1cm5lZEFycmF5Q3ViZVRleFsxXSkpO1xuXG5cdFx0dGhpcy5wYXJzZVByb3BlcnRpZXMobnVsbClcblx0XHRhc3NldC5leHRyYSA9IHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KGFzc2V0LCBuYW1lKTtcblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IGFzc2V0O1xuXHRcdGlmICh0aGlzLl9kZWJ1Zylcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgU2t5Ym94OiBOYW1lID0gJ1wiICsgbmFtZSArIFwiJyB8IEN1YmVUZXh0dXJlLU5hbWUgPSBcIiArICg8SW1hZ2VDdWJlVGV4dHVyZT4gcmV0dXJuZWRBcnJheUN1YmVUZXhbMV0pLm5hbWUpO1xuXG5cdH1cblxuXHQvL0Jsb2NrIElEID0gNDFcblx0cHJpdmF0ZSBwYXJzZUxpZ2h0KGJsb2NrSUQ6bnVtYmVyKTp2b2lkXG5cdHtcblx0XHR2YXIgbGlnaHQ6TGlnaHRCYXNlO1xuXHRcdHZhciBuZXdTaGFkb3dNYXBwZXI6U2hhZG93TWFwcGVyQmFzZTtcblxuXHRcdHZhciBwYXJfaWQ6bnVtYmVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHR2YXIgbXR4Ok1hdHJpeDNEID0gdGhpcy5wYXJzZU1hdHJpeDNEKCk7XG5cdFx0dmFyIG5hbWU6c3RyaW5nID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXHRcdHZhciBsaWdodFR5cGU6bnVtYmVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRCeXRlKCk7XG5cdFx0dmFyIHByb3BzOkFXRFByb3BlcnRpZXMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7MTp0aGlzLl9wcm9wc05yVHlwZSwgMjp0aGlzLl9wcm9wc05yVHlwZSwgMzpBV0RQYXJzZXIuQ09MT1IsIDQ6dGhpcy5fcHJvcHNOclR5cGUsIDU6dGhpcy5fcHJvcHNOclR5cGUsIDY6QVdEUGFyc2VyLkJPT0wsIDc6QVdEUGFyc2VyLkNPTE9SLCA4OnRoaXMuX3Byb3BzTnJUeXBlLCA5OkFXRFBhcnNlci5VSU5UOCwgMTA6QVdEUGFyc2VyLlVJTlQ4LCAxMTp0aGlzLl9wcm9wc05yVHlwZSwgMTI6QVdEUGFyc2VyLlVJTlQxNiwgMjE6dGhpcy5fbWF0cml4TnJUeXBlLCAyMjp0aGlzLl9tYXRyaXhOclR5cGUsIDIzOnRoaXMuX21hdHJpeE5yVHlwZX0pO1xuXHRcdHZhciBzaGFkb3dNYXBwZXJUeXBlOm51bWJlciA9IHByb3BzLmdldCg5LCAwKTtcblx0XHR2YXIgcGFyZW50TmFtZTpzdHJpbmcgPSBcIlJvb3QgKFRvcExldmVsKVwiO1xuXHRcdHZhciBsaWdodFR5cGVzOkFycmF5PHN0cmluZz4gPSBbXCJVbnN1cHBvcnRlZCBMaWdodFR5cGVcIiwgXCJQb2ludExpZ2h0XCIsIFwiRGlyZWN0aW9uYWxMaWdodFwiXTtcblx0XHR2YXIgc2hhZG93TWFwcGVyVHlwZXM6QXJyYXk8c3RyaW5nPiA9IFtcIk5vIFNoYWRvd01hcHBlclwiLCBcIkRpcmVjdGlvbmFsU2hhZG93TWFwcGVyXCIsIFwiTmVhckRpcmVjdGlvbmFsU2hhZG93TWFwcGVyXCIsIFwiQ2FzY2FkZVNoYWRvd01hcHBlclwiLCBcIkN1YmVNYXBTaGFkb3dNYXBwZXJcIl07XG5cblx0XHRpZiAobGlnaHRUeXBlID09IDEpIHtcblx0XHRcdGxpZ2h0ID0gbmV3IFBvaW50TGlnaHQoKTtcblxuXHRcdFx0KDxQb2ludExpZ2h0PiBsaWdodCkucmFkaXVzID0gcHJvcHMuZ2V0KDEsIDkwMDAwKTtcblx0XHRcdCg8UG9pbnRMaWdodD4gbGlnaHQpLmZhbGxPZmYgPSBwcm9wcy5nZXQoMiwgMTAwMDAwKTtcblxuXHRcdFx0aWYgKHNoYWRvd01hcHBlclR5cGUgPiAwKSB7XG5cdFx0XHRcdGlmIChzaGFkb3dNYXBwZXJUeXBlID09IDQpIHtcblx0XHRcdFx0XHRuZXdTaGFkb3dNYXBwZXIgPSBuZXcgQ3ViZU1hcFNoYWRvd01hcHBlcigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGxpZ2h0LnRyYW5zZm9ybS5tYXRyaXgzRCA9IG10eDtcblxuXHRcdH1cblxuXHRcdGlmIChsaWdodFR5cGUgPT0gMikge1xuXG5cdFx0XHRsaWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KHByb3BzLmdldCgyMSwgMCksIHByb3BzLmdldCgyMiwgLTEpLCBwcm9wcy5nZXQoMjMsIDEpKTtcblxuXHRcdFx0aWYgKHNoYWRvd01hcHBlclR5cGUgPiAwKSB7XG5cdFx0XHRcdGlmIChzaGFkb3dNYXBwZXJUeXBlID09IDEpIHtcblx0XHRcdFx0XHRuZXdTaGFkb3dNYXBwZXIgPSBuZXcgRGlyZWN0aW9uYWxTaGFkb3dNYXBwZXIoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vaWYgKHNoYWRvd01hcHBlclR5cGUgPT0gMilcblx0XHRcdFx0Ly8gIG5ld1NoYWRvd01hcHBlciA9IG5ldyBOZWFyRGlyZWN0aW9uYWxTaGFkb3dNYXBwZXIocHJvcHMuZ2V0KDExLCAwLjUpKTtcblx0XHRcdFx0Ly9pZiAoc2hhZG93TWFwcGVyVHlwZSA9PSAzKVxuXHRcdFx0XHQvLyAgIG5ld1NoYWRvd01hcHBlciA9IG5ldyBDYXNjYWRlU2hhZG93TWFwcGVyKHByb3BzLmdldCgxMiwgMykpO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cdFx0bGlnaHQuY29sb3IgPSBwcm9wcy5nZXQoMywgMHhmZmZmZmYpO1xuXHRcdGxpZ2h0LnNwZWN1bGFyID0gcHJvcHMuZ2V0KDQsIDEuMCk7XG5cdFx0bGlnaHQuZGlmZnVzZSA9IHByb3BzLmdldCg1LCAxLjApO1xuXHRcdGxpZ2h0LmFtYmllbnRDb2xvciA9IHByb3BzLmdldCg3LCAweGZmZmZmZik7XG5cdFx0bGlnaHQuYW1iaWVudCA9IHByb3BzLmdldCg4LCAwLjApO1xuXG5cdFx0Ly8gaWYgYSBzaGFkb3dNYXBwZXIgaGFzIGJlZW4gY3JlYXRlZCwgYWRqdXN0IHRoZSBkZXB0aE1hcFNpemUgaWYgbmVlZGVkLCBhc3NpZ24gdG8gbGlnaHQgYW5kIHNldCBjYXN0U2hhZG93cyB0byB0cnVlXG5cdFx0aWYgKG5ld1NoYWRvd01hcHBlcikge1xuXHRcdFx0aWYgKG5ld1NoYWRvd01hcHBlciBpbnN0YW5jZW9mIEN1YmVNYXBTaGFkb3dNYXBwZXIpIHtcblx0XHRcdFx0aWYgKHByb3BzLmdldCgxMCwgMSkgIT0gMSkge1xuXHRcdFx0XHRcdG5ld1NoYWRvd01hcHBlci5kZXB0aE1hcFNpemUgPSB0aGlzLl9kZXB0aFNpemVEaWNbcHJvcHMuZ2V0KDEwLCAxKV07XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmIChwcm9wcy5nZXQoMTAsIDIpICE9IDIpIHtcblx0XHRcdFx0XHRuZXdTaGFkb3dNYXBwZXIuZGVwdGhNYXBTaXplID0gdGhpcy5fZGVwdGhTaXplRGljW3Byb3BzLmdldCgxMCwgMildO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGxpZ2h0LnNoYWRvd01hcHBlciA9IG5ld1NoYWRvd01hcHBlcjtcblx0XHRcdGxpZ2h0LmNhc3RzU2hhZG93cyA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKHBhcl9pZCAhPSAwKSB7XG5cblx0XHRcdHZhciByZXR1cm5lZEFycmF5UGFyZW50OkFycmF5PGFueT4gPSB0aGlzLmdldEFzc2V0QnlJRChwYXJfaWQsIFtBc3NldFR5cGUuQ09OVEFJTkVSLCBBc3NldFR5cGUuTElHSFQsIEFzc2V0VHlwZS5NRVNIXSlcblxuXHRcdFx0aWYgKHJldHVybmVkQXJyYXlQYXJlbnRbMF0pIHtcblx0XHRcdFx0KDxEaXNwbGF5T2JqZWN0Q29udGFpbmVyPiByZXR1cm5lZEFycmF5UGFyZW50WzFdKS5hZGRDaGlsZChsaWdodCk7XG5cdFx0XHRcdHBhcmVudE5hbWUgPSAoPERpc3BsYXlPYmplY3RDb250YWluZXI+IHJldHVybmVkQXJyYXlQYXJlbnRbMV0pLm5hbWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCBhIHBhcmVudCBmb3IgdGhpcyBMaWdodFwiKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly9hZGQgdG8gdGhlIGNvbnRlbnQgcHJvcGVydHlcblx0XHRcdCg8RGlzcGxheU9iamVjdENvbnRhaW5lcj4gdGhpcy5fcENvbnRlbnQpLmFkZENoaWxkKGxpZ2h0KTtcblx0XHR9XG5cblx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblxuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KDwgSUFzc2V0PiBsaWdodCwgbmFtZSk7XG5cblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IGxpZ2h0O1xuXG5cdFx0aWYgKHRoaXMuX2RlYnVnKVxuXHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBMaWdodDogTmFtZSA9ICdcIiArIG5hbWUgKyBcIicgfCBUeXBlID0gXCIgKyBsaWdodFR5cGVzW2xpZ2h0VHlwZV0gKyBcIiB8IFBhcmVudC1OYW1lID0gXCIgKyBwYXJlbnROYW1lICsgXCIgfCBTaGFkb3dNYXBwZXItVHlwZSA9IFwiICsgc2hhZG93TWFwcGVyVHlwZXNbc2hhZG93TWFwcGVyVHlwZV0pO1xuXG5cdH1cblxuXHQvL0Jsb2NrIElEID0gNDNcblx0cHJpdmF0ZSBwYXJzZUNhbWVyYShibG9ja0lEOm51bWJlcik6dm9pZFxuXHR7XG5cblx0XHR2YXIgcGFyX2lkOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0dmFyIG10eDpNYXRyaXgzRCA9IHRoaXMucGFyc2VNYXRyaXgzRCgpO1xuXHRcdHZhciBuYW1lOnN0cmluZyA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblx0XHR2YXIgcGFyZW50TmFtZTpzdHJpbmcgPSBcIlJvb3QgKFRvcExldmVsKVwiO1xuXHRcdHZhciBwcm9qZWN0aW9uOlByb2plY3Rpb25CYXNlO1xuXG5cdFx0dGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRCeXRlKCk7IC8vc2V0IGFzIGFjdGl2ZSBjYW1lcmFcblx0XHR0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRTaG9ydCgpOyAvL2xlbmd0aG9mIGxlbnNlcyAtIG5vdCB1c2VkIHlldFxuXG5cdFx0dmFyIHByb2plY3Rpb250eXBlOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFNob3J0KCk7XG5cdFx0dmFyIHByb3BzOkFXRFByb3BlcnRpZXMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7MTAxOnRoaXMuX3Byb3BzTnJUeXBlLCAxMDI6dGhpcy5fcHJvcHNOclR5cGUsIDEwMzp0aGlzLl9wcm9wc05yVHlwZSwgMTA0OnRoaXMuX3Byb3BzTnJUeXBlfSk7XG5cblx0XHRzd2l0Y2ggKHByb2plY3Rpb250eXBlKSB7XG5cdFx0XHRjYXNlIDUwMDE6XG5cdFx0XHRcdHByb2plY3Rpb24gPSBuZXcgUGVyc3BlY3RpdmVQcm9qZWN0aW9uKHByb3BzLmdldCgxMDEsIDYwKSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA1MDAyOlxuXHRcdFx0XHRwcm9qZWN0aW9uID0gbmV3IE9ydGhvZ3JhcGhpY1Byb2plY3Rpb24ocHJvcHMuZ2V0KDEwMSwgNTAwKSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA1MDAzOlxuXHRcdFx0XHRwcm9qZWN0aW9uID0gbmV3IE9ydGhvZ3JhcGhpY09mZkNlbnRlclByb2plY3Rpb24ocHJvcHMuZ2V0KDEwMSwgLTQwMCksIHByb3BzLmdldCgxMDIsIDQwMCksIHByb3BzLmdldCgxMDMsIC0zMDApLCBwcm9wcy5nZXQoMTA0LCAzMDApKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRjb25zb2xlLmxvZyhcInVuc3VwcG9ydGVkTGVuc3R5cGVcIik7XG5cdFx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgY2FtZXJhOkNhbWVyYSA9IG5ldyBDYW1lcmEocHJvamVjdGlvbik7XG5cdFx0Y2FtZXJhLnRyYW5zZm9ybS5tYXRyaXgzRCA9IG10eDtcblxuXHRcdHZhciByZXR1cm5lZEFycmF5UGFyZW50OkFycmF5PGFueT4gPSB0aGlzLmdldEFzc2V0QnlJRChwYXJfaWQsIFtBc3NldFR5cGUuQ09OVEFJTkVSLCBBc3NldFR5cGUuTElHSFQsIEFzc2V0VHlwZS5NRVNIXSlcblxuXHRcdGlmIChyZXR1cm5lZEFycmF5UGFyZW50WzBdKSB7XG5cblx0XHRcdHZhciBvYmpDOkRpc3BsYXlPYmplY3RDb250YWluZXIgPSA8RGlzcGxheU9iamVjdENvbnRhaW5lcj4gcmV0dXJuZWRBcnJheVBhcmVudFsxXTtcblx0XHRcdG9iakMuYWRkQ2hpbGQoY2FtZXJhKTtcblxuXHRcdFx0cGFyZW50TmFtZSA9IG9iakMubmFtZTtcblxuXHRcdH0gZWxzZSBpZiAocGFyX2lkID4gMCkge1xuXHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgYSBwYXJlbnQgZm9yIHRoaXMgQ2FtZXJhXCIpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvL2FkZCB0byB0aGUgY29udGVudCBwcm9wZXJ0eVxuXHRcdFx0KDxEaXNwbGF5T2JqZWN0Q29udGFpbmVyPiB0aGlzLl9wQ29udGVudCkuYWRkQ2hpbGQoY2FtZXJhKTtcblx0XHR9XG5cblx0XHRjYW1lcmEubmFtZSA9IG5hbWU7XG5cdFx0cHJvcHMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7MTp0aGlzLl9tYXRyaXhOclR5cGUsIDI6dGhpcy5fbWF0cml4TnJUeXBlLCAzOnRoaXMuX21hdHJpeE5yVHlwZSwgNDpBV0RQYXJzZXIuVUlOVDh9KTtcblx0XHRjYW1lcmEucGl2b3QgPSBuZXcgVmVjdG9yM0QocHJvcHMuZ2V0KDEsIDApLCBwcm9wcy5nZXQoMiwgMCksIHByb3BzLmdldCgzLCAwKSk7XG5cdFx0Y2FtZXJhLmV4dHJhID0gdGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cblx0XHR0aGlzLl9wRmluYWxpemVBc3NldChjYW1lcmEsIG5hbWUpO1xuXG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBjYW1lcmFcblxuXHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBDYW1lcmE6IE5hbWUgPSAnXCIgKyBuYW1lICsgXCInIHwgUHJvamVjdGlvbnR5cGUgPSBcIiArIHByb2plY3Rpb24gKyBcIiB8IFBhcmVudC1OYW1lID0gXCIgKyBwYXJlbnROYW1lKTtcblx0XHR9XG5cblx0fVxuXG5cdC8vQmxvY2sgSUQgPSA1MVxuXHRwcml2YXRlIHBhcnNlTGlnaHRQaWNrZXIoYmxvY2tJRDpudW1iZXIpOnZvaWRcblx0e1xuXHRcdHZhciBuYW1lOnN0cmluZyA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblx0XHR2YXIgbnVtTGlnaHRzOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHR2YXIgbGlnaHRzQXJyYXk6QXJyYXk8TGlnaHRCYXNlPiA9IG5ldyBBcnJheTxMaWdodEJhc2U+KCk7XG5cdFx0dmFyIGs6bnVtYmVyID0gMDtcblx0XHR2YXIgbGlnaHRJRDpudW1iZXIgPSAwO1xuXG5cdFx0dmFyIHJldHVybmVkQXJyYXlMaWdodDpBcnJheTxhbnk+O1xuXHRcdHZhciBsaWdodHNBcnJheU5hbWVzOkFycmF5PHN0cmluZz4gPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG5cdFx0Zm9yIChrID0gMDsgayA8IG51bUxpZ2h0czsgaysrKSB7XG5cdFx0XHRsaWdodElEID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRcdHJldHVybmVkQXJyYXlMaWdodCA9IHRoaXMuZ2V0QXNzZXRCeUlEKGxpZ2h0SUQsIFtBc3NldFR5cGUuTElHSFRdKVxuXG5cdFx0XHRpZiAocmV0dXJuZWRBcnJheUxpZ2h0WzBdKSB7XG5cdFx0XHRcdGxpZ2h0c0FycmF5LnB1c2goPExpZ2h0QmFzZT4gcmV0dXJuZWRBcnJheUxpZ2h0WzFdKTtcblx0XHRcdFx0bGlnaHRzQXJyYXlOYW1lcy5wdXNoKCggPExpZ2h0QmFzZT4gcmV0dXJuZWRBcnJheUxpZ2h0WzFdKS5uYW1lKTtcblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgYSBMaWdodCBOciBcIiArIGsgKyBcIiAoSUQgPSBcIiArIGxpZ2h0SUQgKyBcIiApIGZvciB0aGlzIExpZ2h0UGlja2VyXCIpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChsaWdodHNBcnJheS5sZW5ndGggPT0gMCkge1xuXHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGNyZWF0ZSB0aGlzIExpZ2h0UGlja2VyLCBjYXVzZSBubyBMaWdodCB3YXMgZm91bmQuXCIpO1xuXHRcdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0XHRyZXR1cm47IC8vcmV0dXJuIHdpdGhvdXQgYW55IG1vcmUgcGFyc2luZyBmb3IgdGhpcyBibG9ja1xuXHRcdH1cblxuXHRcdHZhciBsaWdodFBpY2s6TGlnaHRQaWNrZXJCYXNlID0gbmV3IFN0YXRpY0xpZ2h0UGlja2VyKGxpZ2h0c0FycmF5KTtcblx0XHRsaWdodFBpY2submFtZSA9IG5hbWU7XG5cblx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHR0aGlzLl9wRmluYWxpemVBc3NldCg8SUFzc2V0PiBsaWdodFBpY2ssIG5hbWUpO1xuXG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBsaWdodFBpY2tcblx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgU3RhdGljTGlnaHRQaWNrZXI6IE5hbWUgPSAnXCIgKyBuYW1lICsgXCInIHwgVGV4dHVyZS1OYW1lID0gXCIgKyBsaWdodHNBcnJheU5hbWVzLnRvU3RyaW5nKCkpO1xuXHRcdH1cblx0fVxuXG5cdC8vQmxvY2sgSUQgPSA4MVxuXHRwcml2YXRlIHBhcnNlTWF0ZXJpYWwoYmxvY2tJRDpudW1iZXIpOnZvaWRcblx0e1xuXHRcdC8vIFRPRE86IG5vdCB1c2VkXG5cdFx0Ly8vL2Jsb2NrTGVuZ3RoID0gYmxvY2subGVuO1xuXHRcdHZhciBuYW1lOnN0cmluZztcblx0XHR2YXIgdHlwZTpudW1iZXI7XG5cdFx0dmFyIHByb3BzOkFXRFByb3BlcnRpZXM7XG5cdFx0dmFyIG1hdDpUcmlhbmdsZU1ldGhvZE1hdGVyaWFsO1xuXHRcdHZhciBhdHRyaWJ1dGVzOk9iamVjdDtcblx0XHR2YXIgZmluYWxpemU6Ym9vbGVhbjtcblx0XHR2YXIgbnVtX21ldGhvZHM6bnVtYmVyO1xuXHRcdHZhciBtZXRob2RzX3BhcnNlZDpudW1iZXI7XG5cdFx0dmFyIHJldHVybmVkQXJyYXk6QXJyYXk8YW55PjtcblxuXHRcdG5hbWUgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0dHlwZSA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdG51bV9tZXRob2RzID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRCeXRlKCk7XG5cblx0XHQvLyBSZWFkIG1hdGVyaWFsIG51bWVyaWNhbCBwcm9wZXJ0aWVzXG5cdFx0Ly8gKDE9Y29sb3IsIDI9Yml0bWFwIHVybCwgMTA9YWxwaGEsIDExPWFscGhhX2JsZW5kaW5nLCAxMj1hbHBoYV90aHJlc2hvbGQsIDEzPXJlcGVhdClcblx0XHRwcm9wcyA9IHRoaXMucGFyc2VQcm9wZXJ0aWVzKHsgMTpBV0RQYXJzZXIuSU5UMzIsIDI6QVdEUGFyc2VyLkJBRERSLCAxMDp0aGlzLl9wcm9wc05yVHlwZSwgMTE6QVdEUGFyc2VyLkJPT0wsIDEyOnRoaXMuX3Byb3BzTnJUeXBlLCAxMzpBV0RQYXJzZXIuQk9PTH0pO1xuXG5cdFx0bWV0aG9kc19wYXJzZWQgPSAwO1xuXHRcdHdoaWxlIChtZXRob2RzX3BhcnNlZCA8IG51bV9tZXRob2RzKSB7XG5cdFx0XHR2YXIgbWV0aG9kX3R5cGU6bnVtYmVyO1xuXG5cdFx0XHRtZXRob2RfdHlwZSA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRcdHRoaXMucGFyc2VQcm9wZXJ0aWVzKG51bGwpO1xuXHRcdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0XHRtZXRob2RzX3BhcnNlZCArPSAxO1xuXHRcdH1cblx0XHR2YXIgZGVidWdTdHJpbmc6c3RyaW5nID0gXCJcIjtcblx0XHRhdHRyaWJ1dGVzID0gdGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0aWYgKHR5cGUgPT09IDEpIHsgLy8gQ29sb3IgbWF0ZXJpYWxcblx0XHRcdGRlYnVnU3RyaW5nICs9IFwiUGFyc2VkIGEgQ29sb3JNYXRlcmlhbChTaW5nbGVQYXNzKTogTmFtZSA9ICdcIiArIG5hbWUgKyBcIicgfCBcIjtcblx0XHRcdHZhciBjb2xvcjpudW1iZXI7XG5cdFx0XHRjb2xvciA9IHByb3BzLmdldCgxLCAweGZmZmZmZik7XG5cdFx0XHRpZiAodGhpcy5tYXRlcmlhbE1vZGUgPCAyKSB7XG5cdFx0XHRcdG1hdCA9IG5ldyBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsKGNvbG9yLCBwcm9wcy5nZXQoMTAsIDEuMCkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bWF0ID0gbmV3IFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwoY29sb3IpO1xuXHRcdFx0XHRtYXQubWF0ZXJpYWxNb2RlID0gVHJpYW5nbGVNYXRlcmlhbE1vZGUuTVVMVElfUEFTUztcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHR5cGUgPT09IDIpIHtcblx0XHRcdHZhciB0ZXhfYWRkcjpudW1iZXIgPSBwcm9wcy5nZXQoMiwgMCk7XG5cblx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRCh0ZXhfYWRkciwgW0Fzc2V0VHlwZS5URVhUVVJFXSk7XG5cblx0XHRcdGlmICgoIXJldHVybmVkQXJyYXlbMF0pICYmICh0ZXhfYWRkciA+IDApKVxuXHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgRGlmZnN1ZVRleHR1cmUgKElEID0gXCIgKyB0ZXhfYWRkciArIFwiICkgZm9yIHRoaXMgTWF0ZXJpYWxcIik7XG5cblx0XHRcdG1hdCA9IG5ldyBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsKDxUZXh0dXJlMkRCYXNlPiByZXR1cm5lZEFycmF5WzFdKTtcblxuXHRcdFx0aWYgKHRoaXMubWF0ZXJpYWxNb2RlIDwgMikge1xuXHRcdFx0XHRtYXQuYWxwaGFCbGVuZGluZyA9IHByb3BzLmdldCgxMSwgZmFsc2UpO1xuXHRcdFx0XHRtYXQuYWxwaGEgPSBwcm9wcy5nZXQoMTAsIDEuMCk7XG5cdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiUGFyc2VkIGEgVHJpYW5nbGVNZXRob2RNYXRlcmlhbChTaW5nbGVQYXNzKTogTmFtZSA9ICdcIiArIG5hbWUgKyBcIicgfCBUZXh0dXJlLU5hbWUgPSBcIiArIG1hdC5uYW1lO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bWF0Lm1hdGVyaWFsTW9kZSA9IFRyaWFuZ2xlTWF0ZXJpYWxNb2RlLk1VTFRJX1BBU1M7XG5cdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiUGFyc2VkIGEgVHJpYW5nbGVNZXRob2RNYXRlcmlhbChNdWx0aVBhc3MpOiBOYW1lID0gJ1wiICsgbmFtZSArIFwiJyB8IFRleHR1cmUtTmFtZSA9IFwiICsgbWF0Lm5hbWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bWF0LmV4dHJhID0gYXR0cmlidXRlcztcblx0XHRtYXQuYWxwaGFUaHJlc2hvbGQgPSBwcm9wcy5nZXQoMTIsIDAuMCk7XG5cdFx0bWF0LnJlcGVhdCA9IHByb3BzLmdldCgxMywgZmFsc2UpO1xuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KDxJQXNzZXQ+IG1hdCwgbmFtZSk7XG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBtYXQ7XG5cblx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKGRlYnVnU3RyaW5nKTtcblxuXHRcdH1cblx0fVxuXG5cdC8vIEJsb2NrIElEID0gODEgQVdEMi4xXG5cdHByaXZhdGUgcGFyc2VNYXRlcmlhbF92MShibG9ja0lEOm51bWJlcik6dm9pZFxuXHR7XG5cdFx0dmFyIG1hdDpUcmlhbmdsZU1ldGhvZE1hdGVyaWFsO1xuXHRcdHZhciBub3JtYWxUZXh0dXJlOlRleHR1cmUyREJhc2U7XG5cdFx0dmFyIHNwZWNUZXh0dXJlOlRleHR1cmUyREJhc2U7XG5cdFx0dmFyIHJldHVybmVkQXJyYXk6QXJyYXk8YW55PjtcblxuXHRcdHZhciBuYW1lOnN0cmluZyA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblx0XHR2YXIgdHlwZTpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHR2YXIgbnVtX21ldGhvZHM6bnVtYmVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRCeXRlKCk7XG5cdFx0dmFyIHByb3BzOkFXRFByb3BlcnRpZXMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7MTpBV0RQYXJzZXIuVUlOVDMyLCAyOkFXRFBhcnNlci5CQUREUiwgMzpBV0RQYXJzZXIuQkFERFIsIDQ6QVdEUGFyc2VyLlVJTlQ4LCA1OkFXRFBhcnNlci5CT09MLCA2OkFXRFBhcnNlci5CT09MLCA3OkFXRFBhcnNlci5CT09MLCA4OkFXRFBhcnNlci5CT09MLCA5OkFXRFBhcnNlci5VSU5UOCwgMTA6dGhpcy5fcHJvcHNOclR5cGUsIDExOkFXRFBhcnNlci5CT09MLCAxMjp0aGlzLl9wcm9wc05yVHlwZSwgMTM6QVdEUGFyc2VyLkJPT0wsIDE1OnRoaXMuX3Byb3BzTnJUeXBlLCAxNjpBV0RQYXJzZXIuVUlOVDMyLCAxNzpBV0RQYXJzZXIuQkFERFIsIDE4OnRoaXMuX3Byb3BzTnJUeXBlLCAxOTp0aGlzLl9wcm9wc05yVHlwZSwgMjA6QVdEUGFyc2VyLlVJTlQzMiwgMjE6QVdEUGFyc2VyLkJBRERSLCAyMjpBV0RQYXJzZXIuQkFERFJ9KTtcblx0XHR2YXIgc3BlemlhbFR5cGU6bnVtYmVyID0gcHJvcHMuZ2V0KDQsIDApO1xuXHRcdHZhciBkZWJ1Z1N0cmluZzpzdHJpbmcgPSBcIlwiO1xuXG5cdFx0aWYgKHNwZXppYWxUeXBlID49IDIpIHsvL3RoaXMgaXMgbm8gc3VwcG9ydGVkIG1hdGVyaWFsXG5cdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJNYXRlcmlhbC1zcGV6aWFsVHlwZSAnXCIgKyBzcGV6aWFsVHlwZSArIFwiJyBpcyBub3Qgc3VwcG9ydGVkLCBjYW4gb25seSBiZSAwOnNpbmdsZVBhc3MsIDE6TXVsdGlQYXNzICFcIik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMubWF0ZXJpYWxNb2RlID09IDEpXG5cdFx0XHRzcGV6aWFsVHlwZSA9IDA7XG5cdFx0ZWxzZSBpZiAodGhpcy5tYXRlcmlhbE1vZGUgPT0gMilcblx0XHRcdHNwZXppYWxUeXBlID0gMTtcblxuXHRcdGlmIChzcGV6aWFsVHlwZSA8IDIpIHsvL3RoaXMgaXMgU2luZ2xlUGFzcyBvciBNdWx0aVBhc3NcblxuXHRcdFx0aWYgKHR5cGUgPT0gMSkgey8vIENvbG9yIG1hdGVyaWFsXG5cdFx0XHRcdHZhciBjb2xvcjpudW1iZXIgPSBwcm9wcy5nZXQoMSwgMHhjY2NjY2MpOy8vVE9ETyB0ZW1wb3JhcmlseSBzd2FwcGVkIHNvIHRoYXQgZGlmZnVzZSBjb2xvciBnb2VzIHRvIGFtYmllbnRcblxuXHRcdFx0XHRpZiAoc3BlemlhbFR5cGUgPT0gMSkgey8vXHRNdWx0aVBhc3NNYXRlcmlhbFxuXHRcdFx0XHRcdG1hdCA9IG5ldyBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsKGNvbG9yKTtcblx0XHRcdFx0XHRtYXQubWF0ZXJpYWxNb2RlID0gVHJpYW5nbGVNYXRlcmlhbE1vZGUuTVVMVElfUEFTUztcblx0XHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIlBhcnNlZCBhIENvbG9yTWF0ZXJpYWwoTXVsdGlQYXNzKTogTmFtZSA9ICdcIiArIG5hbWUgKyBcIicgfCBcIjtcblxuXHRcdFx0XHR9IGVsc2UgeyAvL1x0U2luZ2xlUGFzc01hdGVyaWFsXG5cdFx0XHRcdFx0bWF0ID0gbmV3IFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwoY29sb3IsIHByb3BzLmdldCgxMCwgMS4wKSk7XG5cdFx0XHRcdFx0bWF0LmFscGhhQmxlbmRpbmcgPSBwcm9wcy5nZXQoMTEsIGZhbHNlKTtcblx0XHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIlBhcnNlZCBhIENvbG9yTWF0ZXJpYWwoU2luZ2xlUGFzcyk6IE5hbWUgPSAnXCIgKyBuYW1lICsgXCInIHwgXCI7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIGlmICh0eXBlID09IDIpIHsvLyB0ZXh0dXJlIG1hdGVyaWFsXG5cdFx0XHRcdHZhciB0ZXhfYWRkcjpudW1iZXIgPSBwcm9wcy5nZXQoMiwgMCk7Ly9UT0RPIHRlbXBvcmFyaWx5IHN3YXBwZWQgc28gdGhhdCBkaWZmdXNlIHRleHR1cmUgZ29lcyB0byBhbWJpZW50XG5cdFx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRCh0ZXhfYWRkciwgW0Fzc2V0VHlwZS5URVhUVVJFXSk7XG5cblx0XHRcdFx0aWYgKCghcmV0dXJuZWRBcnJheVswXSkgJiYgKHRleF9hZGRyID4gMCkpXG5cdFx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIEFtYmllbnRUZXh0dXJlIChJRCA9IFwiICsgdGV4X2FkZHIgKyBcIiApIGZvciB0aGlzIFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWxcIik7XG5cblx0XHRcdFx0dmFyIHRleHR1cmU6VGV4dHVyZTJEQmFzZSA9IHJldHVybmVkQXJyYXlbMV07XG5cblx0XHRcdFx0bWF0ID0gbmV3IFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwodGV4dHVyZSk7XG5cblx0XHRcdFx0aWYgKHNwZXppYWxUeXBlID09IDEpIHsvLyBNdWx0aVBhc3NNYXRlcmlhbFxuXHRcdFx0XHRcdG1hdC5tYXRlcmlhbE1vZGUgPSBUcmlhbmdsZU1hdGVyaWFsTW9kZS5NVUxUSV9QQVNTO1xuXG5cdFx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCJQYXJzZWQgYSBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsKE11bHRpUGFzcyk6IE5hbWUgPSAnXCIgKyBuYW1lICsgXCInIHwgVGV4dHVyZS1OYW1lID0gXCIgKyB0ZXh0dXJlLm5hbWU7XG5cdFx0XHRcdH0gZWxzZSB7Ly9cdFNpbmdsZVBhc3NNYXRlcmlhbFxuXHRcdFx0XHRcdG1hdC5hbHBoYSA9IHByb3BzLmdldCgxMCwgMS4wKTtcblx0XHRcdFx0XHRtYXQuYWxwaGFCbGVuZGluZyA9IHByb3BzLmdldCgxMSwgZmFsc2UpO1xuXG5cdFx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCJQYXJzZWQgYSBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsKFNpbmdsZVBhc3MpOiBOYW1lID0gJ1wiICsgbmFtZSArIFwiJyB8IFRleHR1cmUtTmFtZSA9IFwiICsgdGV4dHVyZS5uYW1lO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHZhciBkaWZmdXNlVGV4dHVyZTpUZXh0dXJlMkRCYXNlO1xuXHRcdFx0dmFyIGRpZmZ1c2VUZXhfYWRkcjpudW1iZXIgPSBwcm9wcy5nZXQoMTcsIDApO1xuXG5cdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQoZGlmZnVzZVRleF9hZGRyLCBbQXNzZXRUeXBlLlRFWFRVUkVdKTtcblxuXHRcdFx0aWYgKCghcmV0dXJuZWRBcnJheVswXSkgJiYgKGRpZmZ1c2VUZXhfYWRkciAhPSAwKSkge1xuXHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgRGlmZnVzZVRleHR1cmUgKElEID0gXCIgKyBkaWZmdXNlVGV4X2FkZHIgKyBcIiApIGZvciB0aGlzIFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWxcIik7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChyZXR1cm5lZEFycmF5WzBdKVxuXHRcdFx0XHRkaWZmdXNlVGV4dHVyZSA9IHJldHVybmVkQXJyYXlbMV07XG5cblx0XHRcdGlmIChkaWZmdXNlVGV4dHVyZSkge1xuXHRcdFx0XHRtYXQuZGlmZnVzZVRleHR1cmUgPSBkaWZmdXNlVGV4dHVyZTtcblx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCIgfCBEaWZmdXNlVGV4dHVyZS1OYW1lID0gXCIgKyBkaWZmdXNlVGV4dHVyZS5uYW1lO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgbm9ybWFsVGV4X2FkZHI6bnVtYmVyID0gcHJvcHMuZ2V0KDMsIDApO1xuXG5cdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQobm9ybWFsVGV4X2FkZHIsIFtBc3NldFR5cGUuVEVYVFVSRV0pO1xuXG5cdFx0XHRpZiAoKCFyZXR1cm5lZEFycmF5WzBdKSAmJiAobm9ybWFsVGV4X2FkZHIgIT0gMCkpIHtcblx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIE5vcm1hbFRleHR1cmUgKElEID0gXCIgKyBub3JtYWxUZXhfYWRkciArIFwiICkgZm9yIHRoaXMgVHJpYW5nbGVNZXRob2RNYXRlcmlhbFwiKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHJldHVybmVkQXJyYXlbMF0pIHtcblx0XHRcdFx0bm9ybWFsVGV4dHVyZSA9IHJldHVybmVkQXJyYXlbMV07XG5cdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiIHwgTm9ybWFsVGV4dHVyZS1OYW1lID0gXCIgKyBub3JtYWxUZXh0dXJlLm5hbWU7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBzcGVjVGV4X2FkZHI6bnVtYmVyID0gcHJvcHMuZ2V0KDIxLCAwKTtcblx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRChzcGVjVGV4X2FkZHIsIFtBc3NldFR5cGUuVEVYVFVSRV0pO1xuXG5cdFx0XHRpZiAoKCFyZXR1cm5lZEFycmF5WzBdKSAmJiAoc3BlY1RleF9hZGRyICE9IDApKSB7XG5cdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBTcGVjdWxhclRleHR1cmUgKElEID0gXCIgKyBzcGVjVGV4X2FkZHIgKyBcIiApIGZvciB0aGlzIFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWxcIik7XG5cdFx0XHR9XG5cdFx0XHRpZiAocmV0dXJuZWRBcnJheVswXSkge1xuXHRcdFx0XHRzcGVjVGV4dHVyZSA9IHJldHVybmVkQXJyYXlbMV07XG5cdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiIHwgU3BlY3VsYXJUZXh0dXJlLU5hbWUgPSBcIiArIHNwZWNUZXh0dXJlLm5hbWU7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBsaWdodFBpY2tlckFkZHI6bnVtYmVyID0gcHJvcHMuZ2V0KDIyLCAwKTtcblx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRChsaWdodFBpY2tlckFkZHIsIFtBc3NldFR5cGUuTElHSFRfUElDS0VSXSlcblxuXHRcdFx0aWYgKCghcmV0dXJuZWRBcnJheVswXSkgJiYgKGxpZ2h0UGlja2VyQWRkcikpIHtcblx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIExpZ2h0UGlja2VyIChJRCA9IFwiICsgbGlnaHRQaWNrZXJBZGRyICsgXCIgKSBmb3IgdGhpcyBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsXCIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bWF0LmxpZ2h0UGlja2VyID0gPExpZ2h0UGlja2VyQmFzZT4gcmV0dXJuZWRBcnJheVsxXTtcblx0XHRcdFx0Ly9kZWJ1Z1N0cmluZys9XCIgfCBMaWdodHBpY2tlci1OYW1lID0gXCIrTGlnaHRQaWNrZXJCYXNlKHJldHVybmVkQXJyYXlbMV0pLm5hbWU7XG5cdFx0XHR9XG5cblx0XHRcdG1hdC5zbW9vdGggPSBwcm9wcy5nZXQoNSwgdHJ1ZSk7XG5cdFx0XHRtYXQubWlwbWFwID0gcHJvcHMuZ2V0KDYsIHRydWUpO1xuXHRcdFx0bWF0LmJvdGhTaWRlcyA9IHByb3BzLmdldCg3LCBmYWxzZSk7XG5cdFx0XHRtYXQuYWxwaGFQcmVtdWx0aXBsaWVkID0gcHJvcHMuZ2V0KDgsIGZhbHNlKTtcblx0XHRcdG1hdC5ibGVuZE1vZGUgPSB0aGlzLmJsZW5kTW9kZURpY1twcm9wcy5nZXQoOSwgMCldO1xuXHRcdFx0bWF0LnJlcGVhdCA9IHByb3BzLmdldCgxMywgZmFsc2UpO1xuXG5cdFx0XHRpZiAobm9ybWFsVGV4dHVyZSlcblx0XHRcdFx0bWF0Lm5vcm1hbE1hcCA9IG5vcm1hbFRleHR1cmU7XG5cblx0XHRcdGlmIChzcGVjVGV4dHVyZSlcblx0XHRcdFx0bWF0LnNwZWN1bGFyTWFwID0gc3BlY1RleHR1cmU7XG5cblx0XHRcdG1hdC5hbHBoYVRocmVzaG9sZCA9IHByb3BzLmdldCgxMiwgMC4wKTtcblx0XHRcdG1hdC5hbWJpZW50ID0gcHJvcHMuZ2V0KDE1LCAxLjApO1xuXHRcdFx0bWF0LmRpZmZ1c2VDb2xvciA9IHByb3BzLmdldCgxNiwgMHhmZmZmZmYpO1xuXHRcdFx0bWF0LnNwZWN1bGFyID0gcHJvcHMuZ2V0KDE4LCAxLjApO1xuXHRcdFx0bWF0Lmdsb3NzID0gcHJvcHMuZ2V0KDE5LCA1MCk7XG5cdFx0XHRtYXQuc3BlY3VsYXJDb2xvciA9IHByb3BzLmdldCgyMCwgMHhmZmZmZmYpO1xuXG5cdFx0XHR2YXIgbWV0aG9kc19wYXJzZWQ6bnVtYmVyID0gMDtcblx0XHRcdHZhciB0YXJnZXRJRDpudW1iZXI7XG5cblx0XHRcdHdoaWxlIChtZXRob2RzX3BhcnNlZCA8IG51bV9tZXRob2RzKSB7XG5cdFx0XHRcdHZhciBtZXRob2RfdHlwZTpudW1iZXI7XG5cdFx0XHRcdG1ldGhvZF90eXBlID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXG5cdFx0XHRcdHByb3BzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoezE6QVdEUGFyc2VyLkJBRERSLCAyOkFXRFBhcnNlci5CQUREUiwgMzpBV0RQYXJzZXIuQkFERFIsIDEwMTp0aGlzLl9wcm9wc05yVHlwZSwgMTAyOnRoaXMuX3Byb3BzTnJUeXBlLCAxMDM6dGhpcy5fcHJvcHNOclR5cGUsIDIwMTpBV0RQYXJzZXIuVUlOVDMyLCAyMDI6QVdEUGFyc2VyLlVJTlQzMiwgMzAxOkFXRFBhcnNlci5VSU5UMTYsIDMwMjpBV0RQYXJzZXIuVUlOVDE2LCA0MDE6QVdEUGFyc2VyLlVJTlQ4LCA0MDI6QVdEUGFyc2VyLlVJTlQ4LCA2MDE6QVdEUGFyc2VyLkNPTE9SLCA2MDI6QVdEUGFyc2VyLkNPTE9SLCA3MDE6QVdEUGFyc2VyLkJPT0wsIDcwMjpBV0RQYXJzZXIuQk9PTCwgODAxOkFXRFBhcnNlci5NVFg0eDR9KTtcblxuXHRcdFx0XHRzd2l0Y2ggKG1ldGhvZF90eXBlKSB7XG5cdFx0XHRcdFx0Y2FzZSA5OTk6IC8vd3JhcHBlci1NZXRob2RzIHRoYXQgd2lsbCBsb2FkIGEgcHJldmlvdXMgcGFyc2VkIEVmZmVrdE1ldGhvZCByZXR1cm5lZFxuXG5cdFx0XHRcdFx0XHR0YXJnZXRJRCA9IHByb3BzLmdldCgxLCAwKTtcblx0XHRcdFx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRCh0YXJnZXRJRCwgW0Fzc2V0VHlwZS5FRkZFQ1RTX01FVEhPRF0pO1xuXG5cdFx0XHRcdFx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIEVmZmVjdE1ldGhvZCAoSUQgPSBcIiArIHRhcmdldElEICsgXCIgKSBmb3IgdGhpcyBNYXRlcmlhbFwiKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdG1hdC5hZGRFZmZlY3RNZXRob2QocmV0dXJuZWRBcnJheVsxXSk7XG5cblx0XHRcdFx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCIgfCBFZmZlY3RNZXRob2QtTmFtZSA9IFwiICsgKDxFZmZlY3RNZXRob2RCYXNlPiByZXR1cm5lZEFycmF5WzFdKS5uYW1lO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgOTk4OiAvL3dyYXBwZXItTWV0aG9kcyB0aGF0IHdpbGwgbG9hZCBhIHByZXZpb3VzIHBhcnNlZCBTaGFkb3dNYXBNZXRob2RcblxuXHRcdFx0XHRcdFx0dGFyZ2V0SUQgPSBwcm9wcy5nZXQoMSwgMCk7XG5cdFx0XHRcdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQodGFyZ2V0SUQsIFtBc3NldFR5cGUuU0hBRE9XX01BUF9NRVRIT0RdKTtcblxuXHRcdFx0XHRcdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBTaGFkb3dNZXRob2QgKElEID0gXCIgKyB0YXJnZXRJRCArIFwiICkgZm9yIHRoaXMgTWF0ZXJpYWxcIik7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRtYXQuc2hhZG93TWV0aG9kID0gcmV0dXJuZWRBcnJheVsxXTtcblx0XHRcdFx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCIgfCBTaGFkb3dNZXRob2QtTmFtZSA9IFwiICsgKDxTaGFkb3dNZXRob2RCYXNlPiByZXR1cm5lZEFycmF5WzFdKS5uYW1lO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgMTogLy9FbnZNYXBBbWJpZW50TWV0aG9kXG5cdFx0XHRcdFx0XHR0YXJnZXRJRCA9IHByb3BzLmdldCgxLCAwKTtcblx0XHRcdFx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRCh0YXJnZXRJRCwgW0Fzc2V0VHlwZS5URVhUVVJFXSwgXCJDdWJlVGV4dHVyZVwiKTtcblx0XHRcdFx0XHRcdGlmICghcmV0dXJuZWRBcnJheVswXSlcblx0XHRcdFx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIEVudk1hcCAoSUQgPSBcIiArIHRhcmdldElEICsgXCIgKSBmb3IgdGhpcyBFbnZNYXBBbWJpZW50TWV0aG9kTWF0ZXJpYWxcIik7XG5cdFx0XHRcdFx0XHRtYXQuYW1iaWVudE1ldGhvZCA9IG5ldyBBbWJpZW50RW52TWFwTWV0aG9kKHJldHVybmVkQXJyYXlbMV0pO1xuXHRcdFx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCIgfCBBbWJpZW50RW52TWFwTWV0aG9kIHwgRW52TWFwLU5hbWUgPVwiICsgKDxDdWJlVGV4dHVyZUJhc2U+IHJldHVybmVkQXJyYXlbMV0pLm5hbWU7XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgNTE6IC8vRGVwdGhEaWZmdXNlTWV0aG9kXG5cdFx0XHRcdFx0XHRtYXQuZGlmZnVzZU1ldGhvZCA9IG5ldyBEaWZmdXNlRGVwdGhNZXRob2QoKTtcblx0XHRcdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiIHwgRGlmZnVzZURlcHRoTWV0aG9kXCI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDUyOiAvL0dyYWRpZW50RGlmZnVzZU1ldGhvZFxuXHRcdFx0XHRcdFx0dGFyZ2V0SUQgPSBwcm9wcy5nZXQoMSwgMCk7XG5cdFx0XHRcdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQodGFyZ2V0SUQsIFtBc3NldFR5cGUuVEVYVFVSRV0pO1xuXHRcdFx0XHRcdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKVxuXHRcdFx0XHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgR3JhZGllbnREaWZmdXNlVGV4dHVyZSAoSUQgPSBcIiArIHRhcmdldElEICsgXCIgKSBmb3IgdGhpcyBHcmFkaWVudERpZmZ1c2VNZXRob2RcIik7XG5cdFx0XHRcdFx0XHRtYXQuZGlmZnVzZU1ldGhvZCA9IG5ldyBEaWZmdXNlR3JhZGllbnRNZXRob2QocmV0dXJuZWRBcnJheVsxXSk7XG5cdFx0XHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIiB8IERpZmZ1c2VHcmFkaWVudE1ldGhvZCB8IEdyYWRpZW50RGlmZnVzZVRleHR1cmUtTmFtZSA9XCIgKyAoPFRleHR1cmUyREJhc2U+IHJldHVybmVkQXJyYXlbMV0pLm5hbWU7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDUzOiAvL1dyYXBEaWZmdXNlTWV0aG9kXG5cdFx0XHRcdFx0XHRtYXQuZGlmZnVzZU1ldGhvZCA9IG5ldyBEaWZmdXNlV3JhcE1ldGhvZChwcm9wcy5nZXQoMTAxLCA1KSk7XG5cdFx0XHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIiB8IERpZmZ1c2VXcmFwTWV0aG9kXCI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDU0OiAvL0xpZ2h0TWFwRGlmZnVzZU1ldGhvZFxuXHRcdFx0XHRcdFx0dGFyZ2V0SUQgPSBwcm9wcy5nZXQoMSwgMCk7XG5cdFx0XHRcdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQodGFyZ2V0SUQsIFtBc3NldFR5cGUuVEVYVFVSRV0pO1xuXHRcdFx0XHRcdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKVxuXHRcdFx0XHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgTGlnaHRNYXAgKElEID0gXCIgKyB0YXJnZXRJRCArIFwiICkgZm9yIHRoaXMgTGlnaHRNYXBEaWZmdXNlTWV0aG9kXCIpO1xuXHRcdFx0XHRcdFx0bWF0LmRpZmZ1c2VNZXRob2QgPSBuZXcgRGlmZnVzZUxpZ2h0TWFwTWV0aG9kKHJldHVybmVkQXJyYXlbMV0sIHRoaXMuYmxlbmRNb2RlRGljW3Byb3BzLmdldCg0MDEsIDEwKV0sIGZhbHNlLCBtYXQuZGlmZnVzZU1ldGhvZCk7XG5cdFx0XHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIiB8IERpZmZ1c2VMaWdodE1hcE1ldGhvZCB8IExpZ2h0TWFwVGV4dHVyZS1OYW1lID1cIiArICg8VGV4dHVyZTJEQmFzZT4gcmV0dXJuZWRBcnJheVsxXSkubmFtZTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNTU6IC8vQ2VsRGlmZnVzZU1ldGhvZFxuXHRcdFx0XHRcdFx0bWF0LmRpZmZ1c2VNZXRob2QgPSBuZXcgRGlmZnVzZUNlbE1ldGhvZChwcm9wcy5nZXQoNDAxLCAzKSwgbWF0LmRpZmZ1c2VNZXRob2QpO1xuXHRcdFx0XHRcdFx0KDxEaWZmdXNlQ2VsTWV0aG9kPiBtYXQuZGlmZnVzZU1ldGhvZCkuc21vb3RobmVzcyA9IHByb3BzLmdldCgxMDEsIDAuMSk7XG5cdFx0XHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIiB8IERpZmZ1c2VDZWxNZXRob2RcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgNTY6IC8vU3ViU3VyZmFjZVNjYXR0ZXJpbmdNZXRob2Rcbi8vXHRcdFx0XHRcdFx0XHRtYXQuZGlmZnVzZU1ldGhvZCA9IG5ldyBEaWZmdXNlU3ViU3VyZmFjZU1ldGhvZCgpOyAvL2RlcHRoTWFwU2l6ZSBhbmQgZGVwdGhNYXBPZmZzZXQgP1xuLy9cdFx0XHRcdFx0XHRcdCg8RGlmZnVzZVN1YlN1cmZhY2VNZXRob2Q+IG1hdC5kaWZmdXNlTWV0aG9kKS5zY2F0dGVyaW5nID0gcHJvcHMuZ2V0KDEwMSwgMC4yKTtcbi8vXHRcdFx0XHRcdFx0XHQoPERpZmZ1c2VTdWJTdXJmYWNlTWV0aG9kPiBtYXQuZGlmZnVzZU1ldGhvZCkudHJhbnNsdWNlbmN5ID0gcHJvcHMuZ2V0KDEwMiwgMSk7XG4vL1x0XHRcdFx0XHRcdFx0KDxEaWZmdXNlU3ViU3VyZmFjZU1ldGhvZD4gbWF0LmRpZmZ1c2VNZXRob2QpLnNjYXR0ZXJDb2xvciA9IHByb3BzLmdldCg2MDEsIDB4ZmZmZmZmKTtcbi8vXHRcdFx0XHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIiB8IERpZmZ1c2VTdWJTdXJmYWNlTWV0aG9kXCI7XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgMTAxOiAvL0FuaXNvdHJvcGljU3BlY3VsYXJNZXRob2Rcblx0XHRcdFx0XHRcdG1hdC5zcGVjdWxhck1ldGhvZCA9IG5ldyBTcGVjdWxhckFuaXNvdHJvcGljTWV0aG9kKCk7XG5cdFx0XHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIiB8IFNwZWN1bGFyQW5pc290cm9waWNNZXRob2RcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMTAyOiAvL1NwZWN1bGFyUGhvbmdNZXRob2Rcblx0XHRcdFx0XHRcdG1hdC5zcGVjdWxhck1ldGhvZCA9IG5ldyBTcGVjdWxhclBob25nTWV0aG9kKCk7XG5cdFx0XHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIiB8IFNwZWN1bGFyUGhvbmdNZXRob2RcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMTAzOiAvL0NlbGxTcGVjdWxhck1ldGhvZFxuXHRcdFx0XHRcdFx0bWF0LnNwZWN1bGFyTWV0aG9kID0gbmV3IFNwZWN1bGFyQ2VsTWV0aG9kKHByb3BzLmdldCgxMDEsIDAuNSksIG1hdC5zcGVjdWxhck1ldGhvZCk7XG5cdFx0XHRcdFx0XHQoPFNwZWN1bGFyQ2VsTWV0aG9kPiBtYXQuc3BlY3VsYXJNZXRob2QpLnNtb290aG5lc3MgPSBwcm9wcy5nZXQoMTAyLCAwLjEpO1xuXHRcdFx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCIgfCBTcGVjdWxhckNlbE1ldGhvZFwiO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAxMDQ6IC8vU3BlY3VsYXJGcmVzbmVsTWV0aG9kXG5cdFx0XHRcdFx0XHRtYXQuc3BlY3VsYXJNZXRob2QgPSBuZXcgU3BlY3VsYXJGcmVzbmVsTWV0aG9kKHByb3BzLmdldCg3MDEsIHRydWUpLCBtYXQuc3BlY3VsYXJNZXRob2QpO1xuXHRcdFx0XHRcdFx0KDxTcGVjdWxhckZyZXNuZWxNZXRob2Q+IG1hdC5zcGVjdWxhck1ldGhvZCkuZnJlc25lbFBvd2VyID0gcHJvcHMuZ2V0KDEwMSwgNSk7XG5cdFx0XHRcdFx0XHQoPFNwZWN1bGFyRnJlc25lbE1ldGhvZD4gbWF0LnNwZWN1bGFyTWV0aG9kKS5ub3JtYWxSZWZsZWN0YW5jZSA9IHByb3BzLmdldCgxMDIsIDAuMSk7XG5cdFx0XHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIiB8IFNwZWN1bGFyRnJlc25lbE1ldGhvZFwiO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAxNTE6Ly9IZWlnaHRNYXBOb3JtYWxNZXRob2QgLSB0aGlvcyBpcyBub3QgaW1wbGVtZW50ZWQgZm9yIG5vdywgYnV0IG1pZ2h0IGFwcGVhciBsYXRlclxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAxNTI6IC8vU2ltcGxlV2F0ZXJOb3JtYWxNZXRob2Rcblx0XHRcdFx0XHRcdHRhcmdldElEID0gcHJvcHMuZ2V0KDEsIDApO1xuXHRcdFx0XHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKHRhcmdldElELCBbQXNzZXRUeXBlLlRFWFRVUkVdKTtcblx0XHRcdFx0XHRcdGlmICghcmV0dXJuZWRBcnJheVswXSlcblx0XHRcdFx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIFNlY291bmROb3JtYWxNYXAgKElEID0gXCIgKyB0YXJnZXRJRCArIFwiICkgZm9yIHRoaXMgU2ltcGxlV2F0ZXJOb3JtYWxNZXRob2RcIik7XG5cdFx0XHRcdFx0XHRpZiAoIW1hdC5ub3JtYWxNYXApXG5cdFx0XHRcdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIGEgbm9ybWFsIE1hcCBvbiB0aGlzIE1hdGVyaWFsIHRvIHVzZSB3aXRoIHRoaXMgU2ltcGxlV2F0ZXJOb3JtYWxNZXRob2RcIik7XG5cblx0XHRcdFx0XHRcdG1hdC5ub3JtYWxNYXAgPSByZXR1cm5lZEFycmF5WzFdO1xuXHRcdFx0XHRcdFx0bWF0Lm5vcm1hbE1ldGhvZCA9IG5ldyBOb3JtYWxTaW1wbGVXYXRlck1ldGhvZChtYXQubm9ybWFsTWFwLCByZXR1cm5lZEFycmF5WzFdKTtcblx0XHRcdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiIHwgTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QgfCBTZWNvbmQtTm9ybWFsVGV4dHVyZS1OYW1lID0gXCIgKyAoPFRleHR1cmUyREJhc2U+IHJldHVybmVkQXJyYXlbMV0pLm5hbWU7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHRcdFx0bWV0aG9kc19wYXJzZWQgKz0gMTtcblx0XHRcdH1cblx0XHR9XG5cdFx0bWF0LmV4dHJhID0gdGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQoPElBc3NldD4gbWF0LCBuYW1lKTtcblxuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gbWF0O1xuXHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coZGVidWdTdHJpbmcpO1xuXHRcdH1cblx0fVxuXG5cdC8vQmxvY2sgSUQgPSA4MlxuXHRwcml2YXRlIHBhcnNlVGV4dHVyZShibG9ja0lEOm51bWJlcik6dm9pZFxuXHR7XG5cblx0XHR2YXIgYXNzZXQ6VGV4dHVyZTJEQmFzZTtcblxuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5uYW1lID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXG5cdFx0dmFyIHR5cGU6bnVtYmVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRCeXRlKCk7XG5cdFx0dmFyIGRhdGFfbGVuOm51bWJlcjtcblxuXHRcdHRoaXMuX3RleHR1cmVfdXNlcnNbdGhpcy5fY3VyX2Jsb2NrX2lkLnRvU3RyaW5nKCldID0gW107XG5cblx0XHQvLyBFeHRlcm5hbFxuXHRcdGlmICh0eXBlID09IDApIHtcblx0XHRcdGRhdGFfbGVuID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRcdHZhciB1cmw6c3RyaW5nO1xuXHRcdFx0dXJsID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVVRGQnl0ZXMoZGF0YV9sZW4pO1xuXHRcdFx0dGhpcy5fcEFkZERlcGVuZGVuY3kodGhpcy5fY3VyX2Jsb2NrX2lkLnRvU3RyaW5nKCksIG5ldyBVUkxSZXF1ZXN0KHVybCksIGZhbHNlLCBudWxsLCB0cnVlKTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHRkYXRhX2xlbiA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cblx0XHRcdHZhciBkYXRhOkJ5dGVBcnJheTtcblx0XHRcdGRhdGEgPSBuZXcgQnl0ZUFycmF5KCk7XG5cdFx0XHR0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRCeXRlcyhkYXRhLCAwLCBkYXRhX2xlbik7XG5cblx0XHRcdC8vXG5cdFx0XHQvLyBBV0RQYXJzZXIgLSBGaXggZm9yIEZpcmVGb3ggQnVnOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD03MTUwNzUgLlxuXHRcdFx0Ly9cblx0XHRcdC8vIENvbnZlcnRpbmcgZGF0YSB0byBpbWFnZSBoZXJlIGluc3RlYWQgb2YgcGFyc2VyIC0gZml4IEZpcmVGb3ggYnVnIHdoZXJlIGltYWdlIHdpZHRoIC8gaGVpZ2h0IGlzIDAgd2hlbiBjcmVhdGVkIGZyb20gZGF0YVxuXHRcdFx0Ly8gVGhpcyBnaXZlcyB0aGUgYnJvd3NlciB0aW1lIHRvIGluaXRpYWxpc2UgaW1hZ2Ugd2lkdGggLyBoZWlnaHQuXG5cblx0XHRcdHRoaXMuX3BBZGREZXBlbmRlbmN5KHRoaXMuX2N1cl9ibG9ja19pZC50b1N0cmluZygpLCBudWxsLCBmYWxzZSwgUGFyc2VyVXRpbHMuYnl0ZUFycmF5VG9JbWFnZShkYXRhKSwgdHJ1ZSk7XG5cdFx0XHQvL3RoaXMuX3BBZGREZXBlbmRlbmN5KHRoaXMuX2N1cl9ibG9ja19pZC50b1N0cmluZygpLCBudWxsLCBmYWxzZSwgZGF0YSwgdHJ1ZSk7XG5cblx0XHR9XG5cblx0XHQvLyBJZ25vcmUgZm9yIG5vd1xuXHRcdHRoaXMucGFyc2VQcm9wZXJ0aWVzKG51bGwpO1xuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5leHRyYXMgPSB0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHR0aGlzLl9wUGF1c2VBbmRSZXRyaWV2ZURlcGVuZGVuY2llcygpO1xuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gYXNzZXQ7XG5cblx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdHZhciB0ZXh0dXJlU3R5bGVzTmFtZXM6QXJyYXk8c3RyaW5nPiA9IFtcImV4dGVybmFsXCIsIFwiZW1iZWRcIl1cblx0XHRcdGNvbnNvbGUubG9nKFwiU3RhcnQgcGFyc2luZyBhIFwiICsgdGV4dHVyZVN0eWxlc05hbWVzW3R5cGVdICsgXCIgQml0bWFwIGZvciBUZXh0dXJlXCIpO1xuXHRcdH1cblxuXHR9XG5cblx0Ly9CbG9jayBJRCA9IDgzXG5cdHByaXZhdGUgcGFyc2VDdWJlVGV4dHVyZShibG9ja0lEOm51bWJlcik6dm9pZFxuXHR7XG5cdFx0Ly9ibG9ja0xlbmd0aCA9IGJsb2NrLmxlbjtcblx0XHR2YXIgZGF0YV9sZW46bnVtYmVyO1xuXHRcdHZhciBhc3NldDpDdWJlVGV4dHVyZUJhc2U7XG5cdFx0dmFyIGk6bnVtYmVyO1xuXG5cdFx0dGhpcy5fY3ViZVRleHR1cmVzID0gbmV3IEFycmF5PGFueT4oKTtcblx0XHR0aGlzLl90ZXh0dXJlX3VzZXJzWyB0aGlzLl9jdXJfYmxvY2tfaWQudG9TdHJpbmcoKSBdID0gW107XG5cblx0XHR2YXIgdHlwZTpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblxuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5uYW1lID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IDY7IGkrKykge1xuXHRcdFx0dGhpcy5fdGV4dHVyZV91c2Vyc1t0aGlzLl9jdXJfYmxvY2tfaWQudG9TdHJpbmcoKV0gPSBbXTtcblx0XHRcdHRoaXMuX2N1YmVUZXh0dXJlcy5wdXNoKG51bGwpO1xuXG5cdFx0XHQvLyBFeHRlcm5hbFxuXHRcdFx0aWYgKHR5cGUgPT0gMCkge1xuXHRcdFx0XHRkYXRhX2xlbiA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0XHRcdHZhciB1cmw6c3RyaW5nO1xuXHRcdFx0XHR1cmwgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVVEZCeXRlcyhkYXRhX2xlbik7XG5cblx0XHRcdFx0dGhpcy5fcEFkZERlcGVuZGVuY3kodGhpcy5fY3VyX2Jsb2NrX2lkLnRvU3RyaW5nKCkgKyBcIiNcIiArIGksIG5ldyBVUkxSZXF1ZXN0KHVybCksIGZhbHNlLCBudWxsLCB0cnVlKTtcblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0ZGF0YV9sZW4gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdFx0XHR2YXIgZGF0YTpCeXRlQXJyYXk7XG5cdFx0XHRcdGRhdGEgPSBuZXcgQnl0ZUFycmF5KCk7XG5cblx0XHRcdFx0dGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkQnl0ZXMoZGF0YSwgMCwgZGF0YV9sZW4pO1xuXG5cdFx0XHRcdHRoaXMuX3BBZGREZXBlbmRlbmN5KHRoaXMuX2N1cl9ibG9ja19pZC50b1N0cmluZygpICsgXCIjXCIgKyBpLCBudWxsLCBmYWxzZSwgUGFyc2VyVXRpbHMuYnl0ZUFycmF5VG9JbWFnZShkYXRhKSwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gSWdub3JlIGZvciBub3dcblx0XHR0aGlzLnBhcnNlUHJvcGVydGllcyhudWxsKTtcblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZXh0cmFzID0gdGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0dGhpcy5fcFBhdXNlQW5kUmV0cmlldmVEZXBlbmRlbmNpZXMoKTtcblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IGFzc2V0O1xuXG5cdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHR2YXIgdGV4dHVyZVN0eWxlc05hbWVzOkFycmF5PHN0cmluZz4gPSBbXCJleHRlcm5hbFwiLCBcImVtYmVkXCJdXG5cdFx0XHRjb25zb2xlLmxvZyhcIlN0YXJ0IHBhcnNpbmcgNiBcIiArIHRleHR1cmVTdHlsZXNOYW1lc1t0eXBlXSArIFwiIEJpdG1hcHMgZm9yIEN1YmVUZXh0dXJlXCIpO1xuXHRcdH1cblx0fVxuXG5cdC8vQmxvY2sgSUQgPSA5MVxuXHRwcml2YXRlIHBhcnNlU2hhcmVkTWV0aG9kQmxvY2soYmxvY2tJRDpudW1iZXIpOnZvaWRcblx0e1xuXHRcdHZhciBhc3NldDpFZmZlY3RNZXRob2RCYXNlO1xuXG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLm5hbWUgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0YXNzZXQgPSB0aGlzLnBhcnNlU2hhcmVkTWV0aG9kTGlzdChibG9ja0lEKTtcblx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IGFzc2V0O1xuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KDxJQXNzZXQ+IGFzc2V0LCB0aGlzLl9ibG9ja3NbYmxvY2tJRF0ubmFtZSk7XG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBhc3NldDtcblxuXHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBFZmZlY3RNZXRob2Q6IE5hbWUgPSBcIiArIGFzc2V0Lm5hbWUgKyBcIiBUeXBlID0gXCIgKyBhc3NldCk7XG5cdFx0fVxuXHR9XG5cblx0Ly9CbG9jayBJRCA9IDkyXG5cdHByaXZhdGUgcGFyc2VTaGFkb3dNZXRob2RCbG9jayhibG9ja0lEOm51bWJlcik6dm9pZFxuXHR7XG5cdFx0dmFyIHR5cGU6bnVtYmVyO1xuXHRcdHZhciBkYXRhX2xlbjpudW1iZXI7XG5cdFx0dmFyIGFzc2V0OlNoYWRvd01ldGhvZEJhc2U7XG5cdFx0dmFyIHNoYWRvd0xpZ2h0SUQ6bnVtYmVyO1xuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5uYW1lID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXG5cdFx0c2hhZG93TGlnaHRJRCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0dmFyIHJldHVybmVkQXJyYXk6QXJyYXk8YW55PiA9IHRoaXMuZ2V0QXNzZXRCeUlEKHNoYWRvd0xpZ2h0SUQsIFtBc3NldFR5cGUuTElHSFRdKTtcblxuXHRcdGlmICghcmV0dXJuZWRBcnJheVswXSkge1xuXHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIFRhcmdldExpZ2h0IChJRCA9IFwiICsgc2hhZG93TGlnaHRJRCArIFwiICkgZm9yIHRoaXMgU2hhZG93TWV0aG9kIC0gU2hhZG93TWV0aG9kIG5vdCBjcmVhdGVkXCIpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGFzc2V0ID0gdGhpcy5wYXJzZVNoYWRvd01ldGhvZExpc3QoPExpZ2h0QmFzZT4gcmV0dXJuZWRBcnJheVsxXSwgYmxvY2tJRCk7XG5cblx0XHRpZiAoIWFzc2V0KVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7IC8vIElnbm9yZSBmb3Igbm93XG5cdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQoPElBc3NldD4gYXNzZXQsIHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5uYW1lKTtcblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IGFzc2V0O1xuXG5cdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIFNoYWRvd01hcE1ldGhvZE1ldGhvZDogTmFtZSA9IFwiICsgYXNzZXQubmFtZSArIFwiIHwgVHlwZSA9IFwiICsgYXNzZXQgKyBcIiB8IExpZ2h0LU5hbWUgPSBcIiwgKCA8TGlnaHRCYXNlPiByZXR1cm5lZEFycmF5WzFdICkubmFtZSk7XG5cdFx0fVxuXHR9XG5cblxuXHQvL0Jsb2NrIElEID0gMjUzXG5cdHByaXZhdGUgcGFyc2VDb21tYW5kKGJsb2NrSUQ6bnVtYmVyKTp2b2lkXG5cdHtcblx0XHR2YXIgaGFzQmxvY2tzOmJvb2xlYW4gPSAoIHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpID09IDEgKTtcblx0XHR2YXIgcGFyX2lkOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0dmFyIG10eDpNYXRyaXgzRCA9IHRoaXMucGFyc2VNYXRyaXgzRCgpO1xuXHRcdHZhciBuYW1lOnN0cmluZyA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblxuXHRcdHZhciBwYXJlbnRPYmplY3Q6RGlzcGxheU9iamVjdENvbnRhaW5lcjtcblx0XHR2YXIgdGFyZ2V0T2JqZWN0OkRpc3BsYXlPYmplY3RDb250YWluZXI7XG5cblx0XHR2YXIgcmV0dXJuZWRBcnJheTpBcnJheTxhbnk+ID0gdGhpcy5nZXRBc3NldEJ5SUQocGFyX2lkLCBbQXNzZXRUeXBlLkNPTlRBSU5FUiwgQXNzZXRUeXBlLkxJR0hULCBBc3NldFR5cGUuTUVTSF0pO1xuXG5cdFx0aWYgKHJldHVybmVkQXJyYXlbMF0pIHtcblx0XHRcdHBhcmVudE9iamVjdCA9IDxEaXNwbGF5T2JqZWN0Q29udGFpbmVyPiByZXR1cm5lZEFycmF5WzFdO1xuXHRcdH1cblxuXHRcdHZhciBudW1Db21tYW5kczpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRTaG9ydCgpO1xuXHRcdHZhciB0eXBlQ29tbWFuZDpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRTaG9ydCgpO1xuXG5cdFx0dmFyIHByb3BzOkFXRFByb3BlcnRpZXMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7MTpBV0RQYXJzZXIuQkFERFJ9KTtcblxuXHRcdHN3aXRjaCAodHlwZUNvbW1hbmQpIHtcblx0XHRcdGNhc2UgMTpcblxuXHRcdFx0XHR2YXIgdGFyZ2V0SUQ6bnVtYmVyID0gcHJvcHMuZ2V0KDEsIDApO1xuXHRcdFx0XHR2YXIgcmV0dXJuZWRBcnJheVRhcmdldDpBcnJheTxhbnk+ID0gdGhpcy5nZXRBc3NldEJ5SUQodGFyZ2V0SUQsIFtBc3NldFR5cGUuTElHSFQsIEFzc2V0VHlwZS5URVhUVVJFX1BST0pFQ1RPUl0pOyAvL2ZvciBubyBvbmx5IGxpZ2h0IGlzIHJlcXVlc3RlZCEhISFcblxuXHRcdFx0XHRpZiAoKCFyZXR1cm5lZEFycmF5VGFyZ2V0WzBdKSAmJiAodGFyZ2V0SUQgIT0gMCkpIHtcblx0XHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgbGlnaHQgKElEID0gXCIgKyB0YXJnZXRJRCArIFwiICggZm9yIHRoaXMgQ29tbWFuZEJvY2shXCIpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRhcmdldE9iamVjdCA9IHJldHVybmVkQXJyYXlUYXJnZXRbMV07XG5cblx0XHRcdFx0aWYgKHBhcmVudE9iamVjdCkge1xuXHRcdFx0XHRcdHBhcmVudE9iamVjdC5hZGRDaGlsZCh0YXJnZXRPYmplY3QpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGFyZ2V0T2JqZWN0LnRyYW5zZm9ybS5tYXRyaXgzRCA9IG10eDtcblxuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRpZiAodGFyZ2V0T2JqZWN0KSB7XG5cdFx0XHRwcm9wcyA9IHRoaXMucGFyc2VQcm9wZXJ0aWVzKHsxOnRoaXMuX21hdHJpeE5yVHlwZSwgMjp0aGlzLl9tYXRyaXhOclR5cGUsIDM6dGhpcy5fbWF0cml4TnJUeXBlLCA0OkFXRFBhcnNlci5VSU5UOH0pO1xuXG5cdFx0XHR0YXJnZXRPYmplY3QucGl2b3QgPSBuZXcgVmVjdG9yM0QocHJvcHMuZ2V0KDEsIDApLCBwcm9wcy5nZXQoMiwgMCksIHByb3BzLmdldCgzLCAwKSk7XG5cdFx0XHR0YXJnZXRPYmplY3QuZXh0cmEgPSB0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblxuXHRcdH1cblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IHRhcmdldE9iamVjdFxuXG5cdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIENvbW1hbmRCbG9jazogTmFtZSA9ICdcIiArIG5hbWUpO1xuXHRcdH1cblxuXHR9XG5cblx0Ly9ibG9ja0lEIDI1NVxuXHRwcml2YXRlIHBhcnNlTWV0YURhdGEoYmxvY2tJRDpudW1iZXIpOnZvaWRcblx0e1xuXHRcdHZhciBwcm9wczpBV0RQcm9wZXJ0aWVzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoezE6QVdEUGFyc2VyLlVJTlQzMiwgMjpBV0RQYXJzZXIuQVdEU1RSSU5HLCAzOkFXRFBhcnNlci5BV0RTVFJJTkcsIDQ6QVdEUGFyc2VyLkFXRFNUUklORywgNTpBV0RQYXJzZXIuQVdEU1RSSU5HfSk7XG5cblx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgTWV0YURhdGFCbG9jazogVGltZVN0YW1wICAgICAgICAgPSBcIiArIHByb3BzLmdldCgxLCAwKSk7XG5cdFx0XHRjb25zb2xlLmxvZyhcIiAgICAgICAgICAgICAgICAgICAgICAgIEVuY29kZXJOYW1lICAgICAgID0gXCIgKyBwcm9wcy5nZXQoMiwgXCJ1bmtub3duXCIpKTtcblx0XHRcdGNvbnNvbGUubG9nKFwiICAgICAgICAgICAgICAgICAgICAgICAgRW5jb2RlclZlcnNpb24gICAgPSBcIiArIHByb3BzLmdldCgzLCBcInVua25vd25cIikpO1xuXHRcdFx0Y29uc29sZS5sb2coXCIgICAgICAgICAgICAgICAgICAgICAgICBHZW5lcmF0b3JOYW1lICAgICA9IFwiICsgcHJvcHMuZ2V0KDQsIFwidW5rbm93blwiKSk7XG5cdFx0XHRjb25zb2xlLmxvZyhcIiAgICAgICAgICAgICAgICAgICAgICAgIEdlbmVyYXRvclZlcnNpb24gID0gXCIgKyBwcm9wcy5nZXQoNSwgXCJ1bmtub3duXCIpKTtcblx0XHR9XG5cdH1cblxuXHQvL2Jsb2NrSUQgMjU0XG5cdHByaXZhdGUgcGFyc2VOYW1lU3BhY2UoYmxvY2tJRDpudW1iZXIpOnZvaWRcblx0e1xuXHRcdHZhciBpZDpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHR2YXIgbmFtZVNwYWNlU3RyaW5nOnN0cmluZyA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblx0XHRpZiAodGhpcy5fZGVidWcpXG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIE5hbWVTcGFjZUJsb2NrOiBJRCA9IFwiICsgaWQgKyBcIiB8IFN0cmluZyA9IFwiICsgbmFtZVNwYWNlU3RyaW5nKTtcblx0fVxuXG5cdC8vLS1QYXJzZXIgVVRJTFMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHQvLyB0aGlzIGZ1bmN0aW9ucyByZWFkcyBhbmQgY3JlYXRlcyBhIFNoYWRvd01ldGhvZE1ldGhvZFxuXHRwcml2YXRlIHBhcnNlU2hhZG93TWV0aG9kTGlzdChsaWdodDpMaWdodEJhc2UsIGJsb2NrSUQ6bnVtYmVyKTpTaGFkb3dNZXRob2RCYXNlXG5cdHtcblxuXHRcdHZhciBtZXRob2RUeXBlOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHR2YXIgc2hhZG93TWV0aG9kOlNoYWRvd01ldGhvZEJhc2U7XG5cdFx0dmFyIHByb3BzOkFXRFByb3BlcnRpZXMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7MTpBV0RQYXJzZXIuQkFERFIsIDI6QVdEUGFyc2VyLkJBRERSLCAzOkFXRFBhcnNlci5CQUREUiwgMTAxOnRoaXMuX3Byb3BzTnJUeXBlLCAxMDI6dGhpcy5fcHJvcHNOclR5cGUsIDEwMzp0aGlzLl9wcm9wc05yVHlwZSwgMjAxOkFXRFBhcnNlci5VSU5UMzIsIDIwMjpBV0RQYXJzZXIuVUlOVDMyLCAzMDE6QVdEUGFyc2VyLlVJTlQxNiwgMzAyOkFXRFBhcnNlci5VSU5UMTYsIDQwMTpBV0RQYXJzZXIuVUlOVDgsIDQwMjpBV0RQYXJzZXIuVUlOVDgsIDYwMTpBV0RQYXJzZXIuQ09MT1IsIDYwMjpBV0RQYXJzZXIuQ09MT1IsIDcwMTpBV0RQYXJzZXIuQk9PTCwgNzAyOkFXRFBhcnNlci5CT09MLCA4MDE6QVdEUGFyc2VyLk1UWDR4NH0pO1xuXG5cdFx0dmFyIHRhcmdldElEOm51bWJlcjtcblx0XHR2YXIgcmV0dXJuZWRBcnJheTpBcnJheTxhbnk+XG5cdFx0c3dpdGNoIChtZXRob2RUeXBlKSB7XG5cdFx0XHQvL1x0XHRcdFx0Y2FzZSAxMDAxOiAvL0Nhc2NhZGVTaGFkb3dNYXBNZXRob2Rcblx0XHRcdC8vXHRcdFx0XHRcdHRhcmdldElEID0gcHJvcHMuZ2V0KDEsIDApO1xuXHRcdFx0Ly9cdFx0XHRcdFx0cmV0dXJuZWRBcnJheSA9IGdldEFzc2V0QnlJRCh0YXJnZXRJRCwgW0Fzc2V0VHlwZS5TSEFET1dfTUFQX01FVEhPRF0pO1xuXHRcdFx0Ly9cdFx0XHRcdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKSB7XG5cdFx0XHQvL1x0XHRcdFx0XHRcdF9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgU2hhZG93QmFzZU1ldGhvZCAoSUQgPSBcIiArIHRhcmdldElEICsgXCIgKSBmb3IgdGhpcyBDYXNjYWRlU2hhZG93TWFwTWV0aG9kIC0gU2hhZG93TWV0aG9kIG5vdCBjcmVhdGVkXCIpO1xuXHRcdFx0Ly9cdFx0XHRcdFx0XHRyZXR1cm4gc2hhZG93TWV0aG9kO1xuXHRcdFx0Ly9cdFx0XHRcdFx0fVxuXHRcdFx0Ly9cdFx0XHRcdFx0c2hhZG93TWV0aG9kID0gbmV3IENhc2NhZGVTaGFkb3dNYXBNZXRob2QocmV0dXJuZWRBcnJheVsxXSk7XG5cdFx0XHQvL1x0XHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMTAwMjogLy9TaGFkb3dOZWFyTWV0aG9kXG5cdFx0XHRcdHRhcmdldElEID0gcHJvcHMuZ2V0KDEsIDApO1xuXHRcdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQodGFyZ2V0SUQsIFtBc3NldFR5cGUuU0hBRE9XX01BUF9NRVRIT0RdKTtcblx0XHRcdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKSB7XG5cdFx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIFNoYWRvd0Jhc2VNZXRob2QgKElEID0gXCIgKyB0YXJnZXRJRCArIFwiICkgZm9yIHRoaXMgU2hhZG93TmVhck1ldGhvZCAtIFNoYWRvd01ldGhvZCBub3QgY3JlYXRlZFwiKTtcblx0XHRcdFx0XHRyZXR1cm4gc2hhZG93TWV0aG9kO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNoYWRvd01ldGhvZCA9IG5ldyBTaGFkb3dOZWFyTWV0aG9kKDxTaGFkb3dNZXRob2RCYXNlPiByZXR1cm5lZEFycmF5WzFdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDExMDE6IC8vU2hhZG93RmlsdGVyZWRNZXRob2RcblxuXHRcdFx0XHRzaGFkb3dNZXRob2QgPSBuZXcgU2hhZG93RmlsdGVyZWRNZXRob2QoPERpcmVjdGlvbmFsTGlnaHQ+IGxpZ2h0KTtcblx0XHRcdFx0KDxTaGFkb3dGaWx0ZXJlZE1ldGhvZD4gc2hhZG93TWV0aG9kKS5hbHBoYSA9IHByb3BzLmdldCgxMDEsIDEpO1xuXHRcdFx0XHQoPFNoYWRvd0ZpbHRlcmVkTWV0aG9kPiBzaGFkb3dNZXRob2QpLmVwc2lsb24gPSBwcm9wcy5nZXQoMTAyLCAwLjAwMik7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIDExMDI6IC8vU2hhZG93RGl0aGVyZWRNZXRob2RcblxuXG5cdFx0XHRcdHNoYWRvd01ldGhvZCA9IG5ldyBTaGFkb3dEaXRoZXJlZE1ldGhvZCg8RGlyZWN0aW9uYWxMaWdodD4gbGlnaHQsIDxudW1iZXI+IHByb3BzLmdldCgyMDEsIDUpKTtcblx0XHRcdFx0KDxTaGFkb3dEaXRoZXJlZE1ldGhvZD4gc2hhZG93TWV0aG9kKS5hbHBoYSA9IHByb3BzLmdldCgxMDEsIDEpO1xuXHRcdFx0XHQoPFNoYWRvd0RpdGhlcmVkTWV0aG9kPiBzaGFkb3dNZXRob2QpLmVwc2lsb24gPSBwcm9wcy5nZXQoMTAyLCAwLjAwMik7XG5cdFx0XHRcdCg8U2hhZG93RGl0aGVyZWRNZXRob2Q+IHNoYWRvd01ldGhvZCkucmFuZ2UgPSBwcm9wcy5nZXQoMTAzLCAxKTtcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMTEwMzogLy9TaGFkb3dTb2Z0TWV0aG9kXG5cblx0XHRcdFx0c2hhZG93TWV0aG9kID0gbmV3IFNoYWRvd1NvZnRNZXRob2QoPERpcmVjdGlvbmFsTGlnaHQ+IGxpZ2h0LCA8bnVtYmVyPiBwcm9wcy5nZXQoMjAxLCA1KSk7XG5cdFx0XHRcdCg8U2hhZG93U29mdE1ldGhvZD4gc2hhZG93TWV0aG9kKS5hbHBoYSA9IHByb3BzLmdldCgxMDEsIDEpO1xuXHRcdFx0XHQoPFNoYWRvd1NvZnRNZXRob2Q+IHNoYWRvd01ldGhvZCkuZXBzaWxvbiA9IHByb3BzLmdldCgxMDIsIDAuMDAyKTtcblx0XHRcdFx0KDxTaGFkb3dTb2Z0TWV0aG9kPiBzaGFkb3dNZXRob2QpLnJhbmdlID0gcHJvcHMuZ2V0KDEwMywgMSk7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDExMDQ6IC8vU2hhZG93SGFyZE1ldGhvZFxuXHRcdFx0XHRzaGFkb3dNZXRob2QgPSBuZXcgU2hhZG93SGFyZE1ldGhvZChsaWdodCk7XG5cdFx0XHRcdCg8U2hhZG93SGFyZE1ldGhvZD4gc2hhZG93TWV0aG9kKS5hbHBoYSA9IHByb3BzLmdldCgxMDEsIDEpO1xuXHRcdFx0XHQoPFNoYWRvd0hhcmRNZXRob2Q+IHNoYWRvd01ldGhvZCkuZXBzaWxvbiA9IHByb3BzLmdldCgxMDIsIDAuMDAyKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHR9XG5cdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0cmV0dXJuIHNoYWRvd01ldGhvZDtcblx0fVxuXG5cdC8vQmxvY2sgSUQgMTAxXG5cdHByaXZhdGUgcGFyc2VTa2VsZXRvbihibG9ja0lEOm51bWJlciAvKnVpbnQqLyk6dm9pZFxuXHR7XG5cdFx0dmFyIG5hbWU6c3RyaW5nID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXHRcdHZhciBudW1fam9pbnRzOm51bWJlciAvKnVpbnQqLyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHR2YXIgc2tlbGV0b246U2tlbGV0b24gPSBuZXcgU2tlbGV0b24oKTtcblx0XHR0aGlzLnBhcnNlUHJvcGVydGllcyhudWxsKTsgLy8gRGlzY2FyZCBwcm9wZXJ0aWVzIGZvciBub3dcdFx0XG5cblx0XHR2YXIgam9pbnRzX3BhcnNlZDpudW1iZXIgLyp1aW50Ki8gPSAwO1xuXHRcdHdoaWxlIChqb2ludHNfcGFyc2VkIDwgbnVtX2pvaW50cykge1xuXHRcdFx0dmFyIGpvaW50OlNrZWxldG9uSm9pbnQ7XG5cdFx0XHR2YXIgaWJwOk1hdHJpeDNEO1xuXHRcdFx0Ly8gSWdub3JlIGpvaW50IGlkXG5cdFx0XHR0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0XHRqb2ludCA9IG5ldyBTa2VsZXRvbkpvaW50KCk7XG5cdFx0XHRqb2ludC5wYXJlbnRJbmRleCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKSAtIDE7IC8vIDA9bnVsbCBpbiBBV0Rcblx0XHRcdGpvaW50Lm5hbWUgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cblx0XHRcdGlicCA9IHRoaXMucGFyc2VNYXRyaXgzRCgpO1xuXHRcdFx0am9pbnQuaW52ZXJzZUJpbmRQb3NlID0gaWJwLnJhd0RhdGE7XG5cdFx0XHQvLyBJZ25vcmUgam9pbnQgcHJvcHMvYXR0cmlidXRlcyBmb3Igbm93XG5cdFx0XHR0aGlzLnBhcnNlUHJvcGVydGllcyhudWxsKTtcblx0XHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdFx0c2tlbGV0b24uam9pbnRzLnB1c2goam9pbnQpO1xuXHRcdFx0am9pbnRzX3BhcnNlZCsrO1xuXHRcdH1cblxuXHRcdC8vIERpc2NhcmQgYXR0cmlidXRlcyBmb3Igbm93XG5cdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQoc2tlbGV0b24sIG5hbWUpO1xuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gc2tlbGV0b247XG5cdFx0aWYgKHRoaXMuX2RlYnVnKVxuXHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBTa2VsZXRvbjogTmFtZSA9IFwiICsgc2tlbGV0b24ubmFtZSArIFwiIHwgTnVtYmVyIG9mIEpvaW50cyA9IFwiICsgam9pbnRzX3BhcnNlZCk7XG5cdH1cblxuXHQvL0Jsb2NrIElEID0gMTAyXG5cdHByaXZhdGUgcGFyc2VTa2VsZXRvblBvc2UoYmxvY2tJRDpudW1iZXIgLyp1aW50Ki8pOnZvaWRcblx0e1xuXHRcdHZhciBuYW1lOnN0cmluZyA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblx0XHR2YXIgbnVtX2pvaW50czpudW1iZXIgLyp1aW50Ki8gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0dGhpcy5wYXJzZVByb3BlcnRpZXMobnVsbCk7IC8vIElnbm9yZSBwcm9wZXJ0aWVzIGZvciBub3dcblxuXHRcdHZhciBwb3NlOlNrZWxldG9uUG9zZSA9IG5ldyBTa2VsZXRvblBvc2UoKTtcblxuXHRcdHZhciBqb2ludHNfcGFyc2VkOm51bWJlciAvKnVpbnQqLyA9IDA7XG5cdFx0d2hpbGUgKGpvaW50c19wYXJzZWQgPCBudW1fam9pbnRzKSB7XG5cdFx0XHR2YXIgam9pbnRfcG9zZTpKb2ludFBvc2U7XG5cdFx0XHR2YXIgaGFzX3RyYW5zZm9ybTpudW1iZXIgLyp1aW50Ki87XG5cdFx0XHRqb2ludF9wb3NlID0gbmV3IEpvaW50UG9zZSgpO1xuXHRcdFx0aGFzX3RyYW5zZm9ybSA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdFx0aWYgKGhhc190cmFuc2Zvcm0gPT0gMSkge1xuXHRcdFx0XHR2YXIgbXR4X2RhdGE6QXJyYXk8bnVtYmVyPiA9IHRoaXMucGFyc2VNYXRyaXg0M1Jhd0RhdGEoKTtcblxuXHRcdFx0XHR2YXIgbXR4Ok1hdHJpeDNEID0gbmV3IE1hdHJpeDNEKG10eF9kYXRhKTtcblx0XHRcdFx0am9pbnRfcG9zZS5vcmllbnRhdGlvbi5mcm9tTWF0cml4KG10eCk7XG5cdFx0XHRcdGpvaW50X3Bvc2UudHJhbnNsYXRpb24uY29weUZyb20obXR4LnBvc2l0aW9uKTtcblxuXHRcdFx0XHRwb3NlLmpvaW50UG9zZXNbam9pbnRzX3BhcnNlZF0gPSBqb2ludF9wb3NlO1xuXHRcdFx0fVxuXHRcdFx0am9pbnRzX3BhcnNlZCsrO1xuXHRcdH1cblx0XHQvLyBTa2lwIGF0dHJpYnV0ZXMgZm9yIG5vd1xuXHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KHBvc2UsIG5hbWUpO1xuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gcG9zZTtcblx0XHRpZiAodGhpcy5fZGVidWcpXG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIFNrZWxldG9uUG9zZTogTmFtZSA9IFwiICsgcG9zZS5uYW1lICsgXCIgfCBOdW1iZXIgb2YgSm9pbnRzID0gXCIgKyBqb2ludHNfcGFyc2VkKTtcblx0fVxuXG5cdC8vYmxvY2tJRCAxMDNcblx0cHJpdmF0ZSBwYXJzZVNrZWxldG9uQW5pbWF0aW9uKGJsb2NrSUQ6bnVtYmVyIC8qdWludCovKTp2b2lkXG5cdHtcblx0XHR2YXIgZnJhbWVfZHVyOm51bWJlcjtcblx0XHR2YXIgcG9zZV9hZGRyOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgbmFtZTpzdHJpbmcgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0dmFyIGNsaXA6U2tlbGV0b25DbGlwTm9kZSA9IG5ldyBTa2VsZXRvbkNsaXBOb2RlKCk7XG5cdFx0dmFyIG51bV9mcmFtZXM6bnVtYmVyIC8qdWludCovID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdHRoaXMucGFyc2VQcm9wZXJ0aWVzKG51bGwpOyAvLyBJZ25vcmUgcHJvcGVydGllcyBmb3Igbm93XG5cblx0XHR2YXIgZnJhbWVzX3BhcnNlZDpudW1iZXIgLyp1aW50Ki8gPSAwO1xuXHRcdHZhciByZXR1cm5lZEFycmF5OkFycmF5PGFueT47XG5cdFx0d2hpbGUgKGZyYW1lc19wYXJzZWQgPCBudW1fZnJhbWVzKSB7XG5cdFx0XHRwb3NlX2FkZHIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdFx0ZnJhbWVfZHVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKHBvc2VfYWRkciwgW0Fzc2V0VHlwZS5TS0VMRVRPTl9QT1NFXSk7XG5cdFx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pXG5cdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBTa2VsZXRvblBvc2UgRnJhbWUgIyBcIiArIGZyYW1lc19wYXJzZWQgKyBcIiAoSUQgPSBcIiArIHBvc2VfYWRkciArIFwiICkgZm9yIHRoaXMgU2tlbGV0b25DbGlwTm9kZVwiKTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0Y2xpcC5hZGRGcmFtZSg8U2tlbGV0b25Qb3NlPiB0aGlzLl9ibG9ja3NbcG9zZV9hZGRyXS5kYXRhLCBmcmFtZV9kdXIpO1xuXHRcdFx0ZnJhbWVzX3BhcnNlZCsrO1xuXHRcdH1cblx0XHRpZiAoY2xpcC5mcmFtZXMubGVuZ3RoID09IDApIHtcblx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCB0aGlzIFNrZWxldG9uQ2xpcE5vZGUsIGJlY2F1c2Ugbm8gRnJhbWVzIHdoZXJlIHNldC5cIik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdC8vIElnbm9yZSBhdHRyaWJ1dGVzIGZvciBub3dcblx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHR0aGlzLl9wRmluYWxpemVBc3NldChjbGlwLCBuYW1lKTtcblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IGNsaXA7XG5cdFx0aWYgKHRoaXMuX2RlYnVnKVxuXHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBTa2VsZXRvbkNsaXBOb2RlOiBOYW1lID0gXCIgKyBjbGlwLm5hbWUgKyBcIiB8IE51bWJlciBvZiBGcmFtZXMgPSBcIiArIGNsaXAuZnJhbWVzLmxlbmd0aCk7XG5cdH1cblxuXHQvL0Jsb2NrIElEID0gMTExIC8gIEJsb2NrIElEID0gMTEyXG5cdHByaXZhdGUgcGFyc2VNZXNoUG9zZUFuaW1hdGlvbihibG9ja0lEOm51bWJlciAvKnVpbnQqLywgcG9zZU9ubHk6Ym9vbGVhbiA9IGZhbHNlKTp2b2lkXG5cdHtcblx0XHR2YXIgbnVtX2ZyYW1lczpudW1iZXIgLyp1aW50Ki8gPSAxO1xuXHRcdHZhciBudW1fc3VibWVzaGVzOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgZnJhbWVzX3BhcnNlZDpudW1iZXIgLyp1aW50Ki87XG5cdFx0dmFyIHN1Yk1lc2hQYXJzZWQ6bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciBmcmFtZV9kdXI6bnVtYmVyO1xuXHRcdHZhciB4Om51bWJlcjtcblx0XHR2YXIgeTpudW1iZXI7XG5cdFx0dmFyIHo6bnVtYmVyO1xuXHRcdHZhciBzdHJfbGVuOm51bWJlcjtcblx0XHR2YXIgc3RyX2VuZDpudW1iZXI7XG5cdFx0dmFyIGdlb21ldHJ5Okdlb21ldHJ5O1xuXHRcdHZhciBzdWJHZW9tOlRyaWFuZ2xlU3ViR2VvbWV0cnk7XG5cdFx0dmFyIGlkeDpudW1iZXIgLyppbnQqLyA9IDA7XG5cdFx0dmFyIGNsaXA6VmVydGV4Q2xpcE5vZGUgPSBuZXcgVmVydGV4Q2xpcE5vZGUoKTtcblx0XHR2YXIgaW5kaWNlczpBcnJheTxudW1iZXI+IC8qdWludCovO1xuXHRcdHZhciB2ZXJ0czpBcnJheTxudW1iZXI+O1xuXHRcdHZhciBudW1fU3RyZWFtczpudW1iZXIgLyppbnQqLyA9IDA7XG5cdFx0dmFyIHN0cmVhbXNQYXJzZWQ6bnVtYmVyIC8qaW50Ki8gPSAwO1xuXHRcdHZhciBzdHJlYW10eXBlczpBcnJheTxudW1iZXI+IC8qaW50Ki8gPSBuZXcgQXJyYXk8bnVtYmVyPigpIC8qaW50Ki87XG5cdFx0dmFyIHByb3BzOkFXRFByb3BlcnRpZXM7XG5cdFx0dmFyIHRoaXNHZW86R2VvbWV0cnk7XG5cdFx0dmFyIG5hbWU6c3RyaW5nID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXHRcdHZhciBnZW9BZHJlc3M6bnVtYmVyIC8qaW50Ki8gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdHZhciByZXR1cm5lZEFycmF5OkFycmF5PGFueT4gPSB0aGlzLmdldEFzc2V0QnlJRChnZW9BZHJlc3MsIFtBc3NldFR5cGUuR0VPTUVUUlldKTtcblx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pIHtcblx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSB0YXJnZXQtR2VvbWV0cnktT2JqZWN0IFwiICsgZ2VvQWRyZXNzICsgXCIgKSBmb3IgdGhpcyBWZXJ0ZXhDbGlwTm9kZVwiKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dmFyIHV2czpBcnJheTxBcnJheTxudW1iZXI+PiA9IHRoaXMuZ2V0VVZGb3JWZXJ0ZXhBbmltYXRpb24oZ2VvQWRyZXNzKTtcblx0XHRpZiAoIXBvc2VPbmx5KVxuXHRcdFx0bnVtX2ZyYW1lcyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblxuXHRcdG51bV9zdWJtZXNoZXMgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0bnVtX1N0cmVhbXMgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0c3RyZWFtc1BhcnNlZCA9IDA7XG5cdFx0d2hpbGUgKHN0cmVhbXNQYXJzZWQgPCBudW1fU3RyZWFtcykge1xuXHRcdFx0c3RyZWFtdHlwZXMucHVzaCh0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCkpO1xuXHRcdFx0c3RyZWFtc1BhcnNlZCsrO1xuXHRcdH1cblx0XHRwcm9wcyA9IHRoaXMucGFyc2VQcm9wZXJ0aWVzKHsxOkFXRFBhcnNlci5CT09MLCAyOkFXRFBhcnNlci5CT09MfSk7XG5cblx0XHRjbGlwLmxvb3BpbmcgPSBwcm9wcy5nZXQoMSwgdHJ1ZSk7XG5cdFx0Y2xpcC5zdGl0Y2hGaW5hbEZyYW1lID0gcHJvcHMuZ2V0KDIsIGZhbHNlKTtcblxuXHRcdGZyYW1lc19wYXJzZWQgPSAwO1xuXHRcdHdoaWxlIChmcmFtZXNfcGFyc2VkIDwgbnVtX2ZyYW1lcykge1xuXHRcdFx0ZnJhbWVfZHVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdFx0Z2VvbWV0cnkgPSBuZXcgR2VvbWV0cnkoKTtcblx0XHRcdHN1Yk1lc2hQYXJzZWQgPSAwO1xuXHRcdFx0d2hpbGUgKHN1Yk1lc2hQYXJzZWQgPCBudW1fc3VibWVzaGVzKSB7XG5cdFx0XHRcdHN0cmVhbXNQYXJzZWQgPSAwO1xuXHRcdFx0XHRzdHJfbGVuID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRcdFx0c3RyX2VuZCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gKyBzdHJfbGVuO1xuXHRcdFx0XHR3aGlsZSAoc3RyZWFtc1BhcnNlZCA8IG51bV9TdHJlYW1zKSB7XG5cdFx0XHRcdFx0aWYgKHN0cmVhbXR5cGVzW3N0cmVhbXNQYXJzZWRdID09IDEpIHtcblx0XHRcdFx0XHRcdGluZGljZXMgPSAoPEdlb21ldHJ5PiByZXR1cm5lZEFycmF5WzFdKS5zdWJHZW9tZXRyaWVzW3N1Yk1lc2hQYXJzZWRdLmluZGljZXM7XG5cdFx0XHRcdFx0XHR2ZXJ0cyA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cdFx0XHRcdFx0XHRpZHggPSAwO1xuXHRcdFx0XHRcdFx0d2hpbGUgKHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPCBzdHJfZW5kKSB7XG5cdFx0XHRcdFx0XHRcdHggPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lHZW8pXG5cdFx0XHRcdFx0XHRcdHkgPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lHZW8pXG5cdFx0XHRcdFx0XHRcdHogPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lHZW8pXG5cdFx0XHRcdFx0XHRcdHZlcnRzW2lkeCsrXSA9IHg7XG5cdFx0XHRcdFx0XHRcdHZlcnRzW2lkeCsrXSA9IHk7XG5cdFx0XHRcdFx0XHRcdHZlcnRzW2lkeCsrXSA9IHo7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRzdWJHZW9tID0gbmV3IFRyaWFuZ2xlU3ViR2VvbWV0cnkodHJ1ZSk7XG5cdFx0XHRcdFx0XHRzdWJHZW9tLnVwZGF0ZUluZGljZXMoaW5kaWNlcyk7XG5cdFx0XHRcdFx0XHRzdWJHZW9tLnVwZGF0ZVBvc2l0aW9ucyh2ZXJ0cyk7XG5cdFx0XHRcdFx0XHRzdWJHZW9tLnVwZGF0ZVVWcyh1dnNbc3ViTWVzaFBhcnNlZF0pO1xuXHRcdFx0XHRcdFx0c3ViR2VvbS51cGRhdGVWZXJ0ZXhOb3JtYWxzKG51bGwpO1xuXHRcdFx0XHRcdFx0c3ViR2VvbS51cGRhdGVWZXJ0ZXhUYW5nZW50cyhudWxsKTtcblx0XHRcdFx0XHRcdHN1Ykdlb20uYXV0b0Rlcml2ZU5vcm1hbHMgPSBmYWxzZTtcblx0XHRcdFx0XHRcdHN1Ykdlb20uYXV0b0Rlcml2ZVRhbmdlbnRzID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRzdWJNZXNoUGFyc2VkKys7XG5cdFx0XHRcdFx0XHRnZW9tZXRyeS5hZGRTdWJHZW9tZXRyeShzdWJHZW9tKVxuXHRcdFx0XHRcdH0gZWxzZVxuXHRcdFx0XHRcdFx0dGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiA9IHN0cl9lbmQ7XG5cdFx0XHRcdFx0c3RyZWFtc1BhcnNlZCsrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRjbGlwLmFkZEZyYW1lKGdlb21ldHJ5LCBmcmFtZV9kdXIpO1xuXHRcdFx0ZnJhbWVzX3BhcnNlZCsrO1xuXHRcdH1cblx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHR0aGlzLl9wRmluYWxpemVBc3NldChjbGlwLCBuYW1lKTtcblxuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gY2xpcDtcblx0XHRpZiAodGhpcy5fZGVidWcpXG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIFZlcnRleENsaXBOb2RlOiBOYW1lID0gXCIgKyBjbGlwLm5hbWUgKyBcIiB8IFRhcmdldC1HZW9tZXRyeS1OYW1lID0gXCIgKyAoPEdlb21ldHJ5PiByZXR1cm5lZEFycmF5WzFdKS5uYW1lICsgXCIgfCBOdW1iZXIgb2YgRnJhbWVzID0gXCIgKyBjbGlwLmZyYW1lcy5sZW5ndGgpO1xuXHR9XG5cblx0Ly9CbG9ja0lEIDExM1xuXHRwcml2YXRlIHBhcnNlVmVydGV4QW5pbWF0aW9uU2V0KGJsb2NrSUQ6bnVtYmVyIC8qdWludCovKTp2b2lkXG5cdHtcblx0XHR2YXIgcG9zZUJsb2NrQWRyZXNzOm51bWJlciAvKmludCovXG5cdFx0dmFyIG91dHB1dFN0cmluZzpzdHJpbmcgPSBcIlwiO1xuXHRcdHZhciBuYW1lOnN0cmluZyA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblx0XHR2YXIgbnVtX2ZyYW1lczpudW1iZXIgLyp1aW50Ki8gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0dmFyIHByb3BzOkFXRFByb3BlcnRpZXMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7MTpBV0RQYXJzZXIuVUlOVDE2fSk7XG5cdFx0dmFyIGZyYW1lc19wYXJzZWQ6bnVtYmVyIC8qdWludCovID0gMDtcblx0XHR2YXIgc2tlbGV0b25GcmFtZXM6QXJyYXk8U2tlbGV0b25DbGlwTm9kZT4gPSBuZXcgQXJyYXk8U2tlbGV0b25DbGlwTm9kZT4oKTtcblx0XHR2YXIgdmVydGV4RnJhbWVzOkFycmF5PFZlcnRleENsaXBOb2RlPiA9IG5ldyBBcnJheTxWZXJ0ZXhDbGlwTm9kZT4oKTtcblx0XHR3aGlsZSAoZnJhbWVzX3BhcnNlZCA8IG51bV9mcmFtZXMpIHtcblx0XHRcdHBvc2VCbG9ja0FkcmVzcyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0XHR2YXIgcmV0dXJuZWRBcnJheTpBcnJheTxhbnk+ID0gdGhpcy5nZXRBc3NldEJ5SUQocG9zZUJsb2NrQWRyZXNzLCBbQXNzZXRUeXBlLkFOSU1BVElPTl9OT0RFXSk7XG5cdFx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pXG5cdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBBbmltYXRpb25DbGlwTm9kZSBOciBcIiArIGZyYW1lc19wYXJzZWQgKyBcIiAoIFwiICsgcG9zZUJsb2NrQWRyZXNzICsgXCIgKSBmb3IgdGhpcyBBbmltYXRpb25TZXRcIik7XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYgKHJldHVybmVkQXJyYXlbMV0gaW5zdGFuY2VvZiBWZXJ0ZXhDbGlwTm9kZSlcblx0XHRcdFx0dmVydGV4RnJhbWVzLnB1c2gocmV0dXJuZWRBcnJheVsxXSlcblx0XHRcdFx0aWYgKHJldHVybmVkQXJyYXlbMV0gaW5zdGFuY2VvZiBTa2VsZXRvbkNsaXBOb2RlKVxuXHRcdFx0XHRza2VsZXRvbkZyYW1lcy5wdXNoKHJldHVybmVkQXJyYXlbMV0pXG5cdFx0XHR9XG5cdFx0XHRmcmFtZXNfcGFyc2VkKys7XG5cdFx0fVxuXHRcdGlmICgodmVydGV4RnJhbWVzLmxlbmd0aCA9PSAwKSAmJiAoc2tlbGV0b25GcmFtZXMubGVuZ3RoID09IDApKSB7XG5cdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgY3JlYXRlIHRoaXMgQW5pbWF0aW9uU2V0LCBiZWNhdXNlIGl0IGNvbnRhaW5zIG5vIGFuaW1hdGlvbnNcIik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdGlmICh2ZXJ0ZXhGcmFtZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0dmFyIG5ld1ZlcnRleEFuaW1hdGlvblNldDpWZXJ0ZXhBbmltYXRpb25TZXQgPSBuZXcgVmVydGV4QW5pbWF0aW9uU2V0KCk7XG5cdFx0XHRmb3IgKHZhciBpOm51bWJlciAvKmludCovID0gMDsgaSA8IHZlcnRleEZyYW1lcy5sZW5ndGg7IGkrKylcblx0XHRcdFx0bmV3VmVydGV4QW5pbWF0aW9uU2V0LmFkZEFuaW1hdGlvbih2ZXJ0ZXhGcmFtZXNbaV0pO1xuXHRcdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQobmV3VmVydGV4QW5pbWF0aW9uU2V0LCBuYW1lKTtcblx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gbmV3VmVydGV4QW5pbWF0aW9uU2V0O1xuXHRcdFx0aWYgKHRoaXMuX2RlYnVnKVxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIFZlcnRleEFuaW1hdGlvblNldDogTmFtZSA9IFwiICsgbmFtZSArIFwiIHwgQW5pbWF0aW9ucyA9IFwiICsgbmV3VmVydGV4QW5pbWF0aW9uU2V0LmFuaW1hdGlvbnMubGVuZ3RoICsgXCIgfCBBbmltYXRpb24tTmFtZXMgPSBcIiArIG5ld1ZlcnRleEFuaW1hdGlvblNldC5hbmltYXRpb25OYW1lcy50b1N0cmluZygpKTtcblxuXHRcdH0gZWxzZSBpZiAoc2tlbGV0b25GcmFtZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKHBvc2VCbG9ja0FkcmVzcywgW0Fzc2V0VHlwZS5BTklNQVRJT05fTk9ERV0pO1xuXHRcdFx0dmFyIG5ld1NrZWxldG9uQW5pbWF0aW9uU2V0OlNrZWxldG9uQW5pbWF0aW9uU2V0ID0gbmV3IFNrZWxldG9uQW5pbWF0aW9uU2V0KHByb3BzLmdldCgxLCA0KSk7IC8vcHJvcHMuZ2V0KDEsNCkpO1xuXHRcdFx0Zm9yICh2YXIgaTpudW1iZXIgLyppbnQqLyA9IDA7IGkgPCBza2VsZXRvbkZyYW1lcy5sZW5ndGg7IGkrKylcblx0XHRcdFx0bmV3U2tlbGV0b25BbmltYXRpb25TZXQuYWRkQW5pbWF0aW9uKHNrZWxldG9uRnJhbWVzW2ldKTtcblx0XHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KG5ld1NrZWxldG9uQW5pbWF0aW9uU2V0LCBuYW1lKTtcblx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gbmV3U2tlbGV0b25BbmltYXRpb25TZXQ7XG5cdFx0XHRpZiAodGhpcy5fZGVidWcpXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgU2tlbGV0b25BbmltYXRpb25TZXQ6IE5hbWUgPSBcIiArIG5hbWUgKyBcIiB8IEFuaW1hdGlvbnMgPSBcIiArIG5ld1NrZWxldG9uQW5pbWF0aW9uU2V0LmFuaW1hdGlvbnMubGVuZ3RoICsgXCIgfCBBbmltYXRpb24tTmFtZXMgPSBcIiArIG5ld1NrZWxldG9uQW5pbWF0aW9uU2V0LmFuaW1hdGlvbk5hbWVzLnRvU3RyaW5nKCkpO1xuXG5cdFx0fVxuXHR9XG5cblx0Ly9CbG9ja0lEIDEyMlxuXHRwcml2YXRlIHBhcnNlQW5pbWF0b3JTZXQoYmxvY2tJRDpudW1iZXIgLyp1aW50Ki8pOnZvaWRcblx0e1xuXHRcdHZhciB0YXJnZXRNZXNoOk1lc2g7XG5cdFx0dmFyIGFuaW1TZXRCbG9ja0FkcmVzczpudW1iZXIgLyppbnQqL1xuXHRcdHZhciB0YXJnZXRBbmltYXRpb25TZXQ6QW5pbWF0aW9uU2V0QmFzZTtcblx0XHR2YXIgb3V0cHV0U3RyaW5nOnN0cmluZyA9IFwiXCI7XG5cdFx0dmFyIG5hbWU6c3RyaW5nID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXHRcdHZhciB0eXBlOm51bWJlciAvKnVpbnQqLyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblxuXHRcdHZhciBwcm9wczpBV0RQcm9wZXJ0aWVzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoezE6QVdEUGFyc2VyLkJBRERSfSk7XG5cblx0XHRhbmltU2V0QmxvY2tBZHJlc3MgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdHZhciB0YXJnZXRNZXNoTGVuZ3RoOm51bWJlciAvKnVpbnQqLyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHR2YXIgbWVzaEFkcmVzc2VzOkFycmF5PG51bWJlcj4gLyp1aW50Ki8gPSBuZXcgQXJyYXk8bnVtYmVyPigpIC8qdWludCovO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyIC8qaW50Ki8gPSAwOyBpIDwgdGFyZ2V0TWVzaExlbmd0aDsgaSsrKVxuXHRcdFx0bWVzaEFkcmVzc2VzLnB1c2godGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKSk7XG5cblx0XHR2YXIgYWN0aXZlU3RhdGU6bnVtYmVyIC8qdWludCovID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdHZhciBhdXRvcGxheTpib29sZWFuID0gKCB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKSA9PSAxICk7XG5cdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cblx0XHR2YXIgcmV0dXJuZWRBcnJheTpBcnJheTxhbnk+O1xuXHRcdHZhciB0YXJnZXRNZXNoZXM6QXJyYXk8TWVzaD4gPSBuZXcgQXJyYXk8TWVzaD4oKTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCBtZXNoQWRyZXNzZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRChtZXNoQWRyZXNzZXNbaV0sIFtBc3NldFR5cGUuTUVTSF0pO1xuXHRcdFx0aWYgKHJldHVybmVkQXJyYXlbMF0pXG5cdFx0XHRcdHRhcmdldE1lc2hlcy5wdXNoKDxNZXNoPiByZXR1cm5lZEFycmF5WzFdKTtcblx0XHR9XG5cdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKGFuaW1TZXRCbG9ja0FkcmVzcywgW0Fzc2V0VHlwZS5BTklNQVRJT05fU0VUXSk7XG5cdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKSB7XG5cdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgQW5pbWF0aW9uU2V0ICggXCIgKyBhbmltU2V0QmxvY2tBZHJlc3MgKyBcIiApIGZvciB0aGlzIEFuaW1hdG9yXCIpOztcblx0XHRcdHJldHVyblxuXHRcdH1cblx0XHR0YXJnZXRBbmltYXRpb25TZXQgPSA8QW5pbWF0aW9uU2V0QmFzZT4gcmV0dXJuZWRBcnJheVsxXTtcblx0XHR2YXIgdGhpc0FuaW1hdG9yOkFuaW1hdG9yQmFzZTtcblx0XHRpZiAodHlwZSA9PSAxKSB7XG5cblx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRChwcm9wcy5nZXQoMSwgMCksIFtBc3NldFR5cGUuU0tFTEVUT05dKTtcblx0XHRcdGlmICghcmV0dXJuZWRBcnJheVswXSkge1xuXHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgU2tlbGV0b24gKCBcIiArIHByb3BzLmdldCgxLCAwKSArIFwiICkgZm9yIHRoaXMgQW5pbWF0b3JcIik7XG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXHRcdFx0dGhpc0FuaW1hdG9yID0gbmV3IFNrZWxldG9uQW5pbWF0b3IoPFNrZWxldG9uQW5pbWF0aW9uU2V0PiB0YXJnZXRBbmltYXRpb25TZXQsIDxTa2VsZXRvbj4gcmV0dXJuZWRBcnJheVsxXSk7XG5cblx0XHR9IGVsc2UgaWYgKHR5cGUgPT0gMilcblx0XHRcdHRoaXNBbmltYXRvciA9IG5ldyBWZXJ0ZXhBbmltYXRvcig8VmVydGV4QW5pbWF0aW9uU2V0PiB0YXJnZXRBbmltYXRpb25TZXQpO1xuXG5cdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQodGhpc0FuaW1hdG9yLCBuYW1lKTtcblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IHRoaXNBbmltYXRvcjtcblx0XHRmb3IgKGkgPSAwOyBpIDwgdGFyZ2V0TWVzaGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAodHlwZSA9PSAxKVxuXHRcdFx0XHR0YXJnZXRNZXNoZXNbaV0uYW5pbWF0b3IgPSAoPFNrZWxldG9uQW5pbWF0b3I+IHRoaXNBbmltYXRvcik7XG5cdFx0XHRpZiAodHlwZSA9PSAyKVxuXHRcdFx0XHR0YXJnZXRNZXNoZXNbaV0uYW5pbWF0b3IgPSAoPFZlcnRleEFuaW1hdG9yPiB0aGlzQW5pbWF0b3IpO1xuXG5cdFx0fVxuXHRcdGlmICh0aGlzLl9kZWJ1Zylcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgQW5pbWF0b3I6IE5hbWUgPSBcIiArIG5hbWUpO1xuXHR9XG5cdFxuXHQvLyB0aGlzIGZ1bmN0aW9ucyByZWFkcyBhbmQgY3JlYXRlcyBhIEVmZmVjdE1ldGhvZFxuXHRwcml2YXRlIHBhcnNlU2hhcmVkTWV0aG9kTGlzdChibG9ja0lEOm51bWJlcik6RWZmZWN0TWV0aG9kQmFzZVxuXHR7XG5cblx0XHR2YXIgbWV0aG9kVHlwZTpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0dmFyIGVmZmVjdE1ldGhvZFJldHVybjpFZmZlY3RNZXRob2RCYXNlO1xuXG5cdFx0dmFyIHByb3BzOkFXRFByb3BlcnRpZXMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7MTpBV0RQYXJzZXIuQkFERFIsIDI6QVdEUGFyc2VyLkJBRERSLCAzOkFXRFBhcnNlci5CQUREUiwgMTAxOnRoaXMuX3Byb3BzTnJUeXBlLCAxMDI6dGhpcy5fcHJvcHNOclR5cGUsIDEwMzp0aGlzLl9wcm9wc05yVHlwZSwgMTA0OnRoaXMuX3Byb3BzTnJUeXBlLCAxMDU6dGhpcy5fcHJvcHNOclR5cGUsIDEwNjp0aGlzLl9wcm9wc05yVHlwZSwgMTA3OnRoaXMuX3Byb3BzTnJUeXBlLCAyMDE6QVdEUGFyc2VyLlVJTlQzMiwgMjAyOkFXRFBhcnNlci5VSU5UMzIsIDMwMTpBV0RQYXJzZXIuVUlOVDE2LCAzMDI6QVdEUGFyc2VyLlVJTlQxNiwgNDAxOkFXRFBhcnNlci5VSU5UOCwgNDAyOkFXRFBhcnNlci5VSU5UOCwgNjAxOkFXRFBhcnNlci5DT0xPUiwgNjAyOkFXRFBhcnNlci5DT0xPUiwgNzAxOkFXRFBhcnNlci5CT09MLCA3MDI6QVdEUGFyc2VyLkJPT0x9KTtcblx0XHR2YXIgdGFyZ2V0SUQ6bnVtYmVyO1xuXHRcdHZhciByZXR1cm5lZEFycmF5OkFycmF5PGFueT47XG5cblx0XHRzd2l0Y2ggKG1ldGhvZFR5cGUpIHtcblx0XHRcdC8vIEVmZmVjdCBNZXRob2RzXG5cdFx0XHRjYXNlIDQwMTogLy9Db2xvck1hdHJpeFxuXHRcdFx0XHRlZmZlY3RNZXRob2RSZXR1cm4gPSBuZXcgRWZmZWN0Q29sb3JNYXRyaXhNZXRob2QocHJvcHMuZ2V0KDEwMSwgbmV3IEFycmF5KDAsIDAsIDAsIDEsIDEsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDEpKSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA0MDI6IC8vQ29sb3JUcmFuc2Zvcm1cblx0XHRcdFx0ZWZmZWN0TWV0aG9kUmV0dXJuID0gbmV3IEVmZmVjdENvbG9yVHJhbnNmb3JtTWV0aG9kKCk7XG5cdFx0XHRcdHZhciBvZmZDb2w6bnVtYmVyIC8qdWludCovID0gcHJvcHMuZ2V0KDYwMSwgMHgwMDAwMDAwMCk7XG5cdFx0XHRcdCg8RWZmZWN0Q29sb3JUcmFuc2Zvcm1NZXRob2Q+IGVmZmVjdE1ldGhvZFJldHVybikuY29sb3JUcmFuc2Zvcm0gPSBuZXcgQ29sb3JUcmFuc2Zvcm0ocHJvcHMuZ2V0KDEwMiwgMSksIHByb3BzLmdldCgxMDMsIDEpLCBwcm9wcy5nZXQoMTA0LCAxKSwgcHJvcHMuZ2V0KDEwMSwgMSksICgob2ZmQ29sID4+IDE2KSAmIDB4RkYpLCAoKG9mZkNvbCA+PiA4KSAmIDB4RkYpLCAob2ZmQ29sICYgMHhGRiksICgob2ZmQ29sID4+IDI0KSAmIDB4RkYpKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDQwMzogLy9FbnZNYXBcblxuXHRcdFx0XHR0YXJnZXRJRCA9IHByb3BzLmdldCgxLCAwKTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ0VOViBNQVAnLCB0YXJnZXRJRCk7XG5cblxuXHRcdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQodGFyZ2V0SUQsIFsgQXNzZXRUeXBlLlRFWFRVUkUgXSwgXCJDdWJlVGV4dHVyZVwiKTtcblx0XHRcdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKVxuXHRcdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBFbnZNYXAgKElEID0gXCIgKyB0YXJnZXRJRCArIFwiICkgZm9yIHRoaXMgRW52TWFwTWV0aG9kXCIpO1xuXHRcdFx0XHRlZmZlY3RNZXRob2RSZXR1cm4gPSBuZXcgRWZmZWN0RW52TWFwTWV0aG9kKDxDdWJlVGV4dHVyZUJhc2U+IHJldHVybmVkQXJyYXlbMV0sIDxudW1iZXI+IHByb3BzLmdldCgxMDEsIDEpKTtcblx0XHRcdFx0dGFyZ2V0SUQgPSBwcm9wcy5nZXQoMiwgMCk7XG5cdFx0XHRcdGlmICh0YXJnZXRJRCA+IDApIHtcblx0XHRcdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQodGFyZ2V0SUQsIFtBc3NldFR5cGUuVEVYVFVSRV0pO1xuXHRcdFx0XHRcdGlmICghcmV0dXJuZWRBcnJheVswXSlcblx0XHRcdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBNYXNrLXRleHR1cmUgKElEID0gXCIgKyB0YXJnZXRJRCArIFwiICkgZm9yIHRoaXMgRW52TWFwTWV0aG9kXCIpO1xuXG5cdFx0XHRcdFx0Ly8gVG9kbzogdGVzdCBtYXNrIHdpdGggRW52TWFwTWV0aG9kXG5cdFx0XHRcdFx0Ly8oPEVudk1hcE1ldGhvZD4gZWZmZWN0TWV0aG9kUmV0dXJuKS5tYXNrID0gPFRleHR1cmUyREJhc2U+IHJldHVybmVkQXJyYXlbMV07XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDQwNDogLy9MaWdodE1hcE1ldGhvZFxuXHRcdFx0XHR0YXJnZXRJRCA9IHByb3BzLmdldCgxLCAwKTtcblx0XHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKHRhcmdldElELCBbQXNzZXRUeXBlLlRFWFRVUkVdKTtcblx0XHRcdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKVxuXHRcdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBMaWdodE1hcCAoSUQgPSBcIiArIHRhcmdldElEICsgXCIgKSBmb3IgdGhpcyBMaWdodE1hcE1ldGhvZFwiKTtcblx0XHRcdFx0ZWZmZWN0TWV0aG9kUmV0dXJuID0gbmV3IEVmZmVjdExpZ2h0TWFwTWV0aG9kKHJldHVybmVkQXJyYXlbMV0sIHRoaXMuYmxlbmRNb2RlRGljW3Byb3BzLmdldCg0MDEsIDEwKV0pOyAvL3VzZXNlY29uZGFyeVVWIG5vdCBzZXRcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHQvL1x0XHRcdFx0Y2FzZSA0MDU6IC8vUHJvamVjdGl2ZVRleHR1cmVNZXRob2Rcblx0XHRcdC8vXHRcdFx0XHRcdHRhcmdldElEID0gcHJvcHMuZ2V0KDEsIDApO1xuXHRcdFx0Ly9cdFx0XHRcdFx0cmV0dXJuZWRBcnJheSA9IGdldEFzc2V0QnlJRCh0YXJnZXRJRCwgW0Fzc2V0VHlwZS5URVhUVVJFX1BST0pFQ1RPUl0pO1xuXHRcdFx0Ly9cdFx0XHRcdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKVxuXHRcdFx0Ly9cdFx0XHRcdFx0XHRfYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIFRleHR1cmVQcm9qZWN0b3IgKElEID0gXCIgKyB0YXJnZXRJRCArIFwiICkgZm9yIHRoaXMgUHJvamVjdGl2ZVRleHR1cmVNZXRob2RcIik7XG5cdFx0XHQvL1x0XHRcdFx0XHRlZmZlY3RNZXRob2RSZXR1cm4gPSBuZXcgUHJvamVjdGl2ZVRleHR1cmVNZXRob2QocmV0dXJuZWRBcnJheVsxXSwgYmxlbmRNb2RlRGljW3Byb3BzLmdldCg0MDEsIDEwKV0pO1xuXHRcdFx0Ly9cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDQwNjogLy9SaW1MaWdodE1ldGhvZFxuXHRcdFx0XHRlZmZlY3RNZXRob2RSZXR1cm4gPSBuZXcgRWZmZWN0UmltTGlnaHRNZXRob2QocHJvcHMuZ2V0KDYwMSwgMHhmZmZmZmYpLCBwcm9wcy5nZXQoMTAxLCAwLjQpLCBwcm9wcy5nZXQoMTAxLCAyKSk7IC8vYmxlbmRNb2RlXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA0MDc6IC8vQWxwaGFNYXNrTWV0aG9kXG5cdFx0XHRcdHRhcmdldElEID0gcHJvcHMuZ2V0KDEsIDApO1xuXHRcdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQodGFyZ2V0SUQsIFtBc3NldFR5cGUuVEVYVFVSRV0pO1xuXHRcdFx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pXG5cdFx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIEFscGhhLXRleHR1cmUgKElEID0gXCIgKyB0YXJnZXRJRCArIFwiICkgZm9yIHRoaXMgQWxwaGFNYXNrTWV0aG9kXCIpO1xuXHRcdFx0XHRlZmZlY3RNZXRob2RSZXR1cm4gPSBuZXcgRWZmZWN0QWxwaGFNYXNrTWV0aG9kKHJldHVybmVkQXJyYXlbMV0sIHByb3BzLmdldCg3MDEsIGZhbHNlKSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Ly9cdFx0XHRcdGNhc2UgNDA4OiAvL1JlZnJhY3Rpb25FbnZNYXBNZXRob2Rcblx0XHRcdC8vXHRcdFx0XHRcdHRhcmdldElEID0gcHJvcHMuZ2V0KDEsIDApO1xuXHRcdFx0Ly9cdFx0XHRcdFx0cmV0dXJuZWRBcnJheSA9IGdldEFzc2V0QnlJRCh0YXJnZXRJRCwgW0Fzc2V0VHlwZS5URVhUVVJFXSwgXCJDdWJlVGV4dHVyZVwiKTtcblx0XHRcdC8vXHRcdFx0XHRcdGlmICghcmV0dXJuZWRBcnJheVswXSlcblx0XHRcdC8vXHRcdFx0XHRcdFx0X2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBFbnZNYXAgKElEID0gXCIgKyB0YXJnZXRJRCArIFwiICkgZm9yIHRoaXMgUmVmcmFjdGlvbkVudk1hcE1ldGhvZFwiKTtcblx0XHRcdC8vXHRcdFx0XHRcdGVmZmVjdE1ldGhvZFJldHVybiA9IG5ldyBSZWZyYWN0aW9uRW52TWFwTWV0aG9kKHJldHVybmVkQXJyYXlbMV0sIHByb3BzLmdldCgxMDEsIDAuMSksIHByb3BzLmdldCgxMDIsIDAuMDEpLCBwcm9wcy5nZXQoMTAzLCAwLjAxKSwgcHJvcHMuZ2V0KDEwNCwgMC4wMSkpO1xuXHRcdFx0Ly9cdFx0XHRcdFx0UmVmcmFjdGlvbkVudk1hcE1ldGhvZChlZmZlY3RNZXRob2RSZXR1cm4pLmFscGhhID0gcHJvcHMuZ2V0KDEwNCwgMSk7XG5cdFx0XHQvL1x0XHRcdFx0XHRicmVhaztcblx0XHRcdC8vXHRcdFx0XHRjYXNlIDQwOTogLy9PdXRsaW5lTWV0aG9kXG5cdFx0XHQvL1x0XHRcdFx0XHRlZmZlY3RNZXRob2RSZXR1cm4gPSBuZXcgT3V0bGluZU1ldGhvZChwcm9wcy5nZXQoNjAxLCAweDAwMDAwMDAwKSwgcHJvcHMuZ2V0KDEwMSwgMSksIHByb3BzLmdldCg3MDEsIHRydWUpLCBwcm9wcy5nZXQoNzAyLCBmYWxzZSkpO1xuXHRcdFx0Ly9cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDQxMDogLy9GcmVzbmVsRW52TWFwTWV0aG9kXG5cdFx0XHRcdHRhcmdldElEID0gcHJvcHMuZ2V0KDEsIDApO1xuXHRcdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQodGFyZ2V0SUQsIFtBc3NldFR5cGUuVEVYVFVSRV0sIFwiQ3ViZVRleHR1cmVcIik7XG5cdFx0XHRcdGlmICghcmV0dXJuZWRBcnJheVswXSlcblx0XHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgRW52TWFwIChJRCA9IFwiICsgdGFyZ2V0SUQgKyBcIiApIGZvciB0aGlzIEZyZXNuZWxFbnZNYXBNZXRob2RcIik7XG5cdFx0XHRcdGVmZmVjdE1ldGhvZFJldHVybiA9IG5ldyBFZmZlY3RGcmVzbmVsRW52TWFwTWV0aG9kKHJldHVybmVkQXJyYXlbMV0sIHByb3BzLmdldCgxMDEsIDEpKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDQxMTogLy9Gb2dNZXRob2Rcblx0XHRcdFx0ZWZmZWN0TWV0aG9kUmV0dXJuID0gbmV3IEVmZmVjdEZvZ01ldGhvZChwcm9wcy5nZXQoMTAxLCAwKSwgcHJvcHMuZ2V0KDEwMiwgMTAwMCksIHByb3BzLmdldCg2MDEsIDB4ODA4MDgwKSk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0fVxuXHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdHJldHVybiBlZmZlY3RNZXRob2RSZXR1cm47XG5cblx0fVxuXG5cdHByaXZhdGUgcGFyc2VVc2VyQXR0cmlidXRlcygpOk9iamVjdFxuXHR7XG5cdFx0dmFyIGF0dHJpYnV0ZXM6T2JqZWN0O1xuXHRcdHZhciBsaXN0X2xlbjpudW1iZXI7XG5cdFx0dmFyIGF0dGlidXRlQ250Om51bWJlcjtcblxuXHRcdGxpc3RfbGVuID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblxuXHRcdGlmIChsaXN0X2xlbiA+IDApIHtcblxuXHRcdFx0dmFyIGxpc3RfZW5kOm51bWJlcjtcblxuXHRcdFx0YXR0cmlidXRlcyA9IHt9O1xuXG5cdFx0XHRsaXN0X2VuZCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gKyBsaXN0X2xlbjtcblxuXHRcdFx0d2hpbGUgKHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPCBsaXN0X2VuZCkge1xuXHRcdFx0XHR2YXIgbnNfaWQ6bnVtYmVyO1xuXHRcdFx0XHR2YXIgYXR0cl9rZXk6c3RyaW5nO1xuXHRcdFx0XHR2YXIgYXR0cl90eXBlOm51bWJlcjtcblx0XHRcdFx0dmFyIGF0dHJfbGVuOm51bWJlcjtcblx0XHRcdFx0dmFyIGF0dHJfdmFsOmFueTtcblxuXHRcdFx0XHQvLyBUT0RPOiBQcm9wZXJseSB0ZW5kIHRvIG5hbWVzcGFjZXMgaW4gYXR0cmlidXRlc1xuXHRcdFx0XHRuc19pZCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdFx0XHRhdHRyX2tleSA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblx0XHRcdFx0YXR0cl90eXBlID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRCeXRlKCk7XG5cdFx0XHRcdGF0dHJfbGVuID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblxuXHRcdFx0XHRpZiAoKHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gKyBhdHRyX2xlbikgPiBsaXN0X2VuZCkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiICAgICAgICAgICBFcnJvciBpbiByZWFkaW5nIGF0dHJpYnV0ZSAjIFwiICsgYXR0aWJ1dGVDbnQgKyBcIiA9IHNraXBwZWQgdG8gZW5kIG9mIGF0dHJpYnV0ZS1saXN0XCIpO1xuXHRcdFx0XHRcdHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPSBsaXN0X2VuZDtcblx0XHRcdFx0XHRyZXR1cm4gYXR0cmlidXRlcztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHN3aXRjaCAoYXR0cl90eXBlKSB7XG5cdFx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuQVdEU1RSSU5HOlxuXHRcdFx0XHRcdFx0YXR0cl92YWwgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVVEZCeXRlcyhhdHRyX2xlbik7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIEFXRFBhcnNlci5JTlQ4OlxuXHRcdFx0XHRcdFx0YXR0cl92YWwgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRCeXRlKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIEFXRFBhcnNlci5JTlQxNjpcblx0XHRcdFx0XHRcdGF0dHJfdmFsID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkU2hvcnQoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgQVdEUGFyc2VyLklOVDMyOlxuXHRcdFx0XHRcdFx0YXR0cl92YWwgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRJbnQoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgQVdEUGFyc2VyLkJPT0w6XG5cdFx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuVUlOVDg6XG5cdFx0XHRcdFx0XHRhdHRyX3ZhbCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuVUlOVDE2OlxuXHRcdFx0XHRcdFx0YXR0cl92YWwgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIEFXRFBhcnNlci5VSU5UMzI6XG5cdFx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuQkFERFI6XG5cdFx0XHRcdFx0XHRhdHRyX3ZhbCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIEFXRFBhcnNlci5GTE9BVDMyOlxuXHRcdFx0XHRcdFx0YXR0cl92YWwgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRGbG9hdCgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuRkxPQVQ2NDpcblx0XHRcdFx0XHRcdGF0dHJfdmFsID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkRG91YmxlKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0YXR0cl92YWwgPSAndW5pbXBsZW1lbnRlZCBhdHRyaWJ1dGUgdHlwZSAnICsgYXR0cl90eXBlO1xuXHRcdFx0XHRcdFx0dGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiArPSBhdHRyX2xlbjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJhdHRyaWJ1dGUgPSBuYW1lOiBcIiArIGF0dHJfa2V5ICsgXCIgIC8gdmFsdWUgPSBcIiArIGF0dHJfdmFsKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGF0dHJpYnV0ZXNbYXR0cl9rZXldID0gYXR0cl92YWw7XG5cdFx0XHRcdGF0dGlidXRlQ250ICs9IDE7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGF0dHJpYnV0ZXM7XG5cdH1cblxuXHRwcml2YXRlIHBhcnNlUHJvcGVydGllcyhleHBlY3RlZDpPYmplY3QpOkFXRFByb3BlcnRpZXNcblx0e1xuXHRcdHZhciBsaXN0X2VuZDpudW1iZXI7XG5cdFx0dmFyIGxpc3RfbGVuOm51bWJlcjtcblx0XHR2YXIgcHJvcGVydHlDbnQ6bnVtYmVyID0gMDtcblx0XHR2YXIgcHJvcHM6QVdEUHJvcGVydGllcyA9IG5ldyBBV0RQcm9wZXJ0aWVzKCk7XG5cblx0XHRsaXN0X2xlbiA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0bGlzdF9lbmQgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uICsgbGlzdF9sZW47XG5cblx0XHRpZiAoZXhwZWN0ZWQpIHtcblxuXHRcdFx0d2hpbGUgKHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPCBsaXN0X2VuZCkge1xuXHRcdFx0XHR2YXIgbGVuOm51bWJlcjtcblx0XHRcdFx0dmFyIGtleTpudW1iZXI7XG5cdFx0XHRcdHZhciB0eXBlOm51bWJlcjtcblxuXHRcdFx0XHRrZXkgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0XHRcdGxlbiA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cblx0XHRcdFx0aWYgKCh0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uICsgbGVuKSA+IGxpc3RfZW5kKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCIgICAgICAgICAgIEVycm9yIGluIHJlYWRpbmcgcHJvcGVydHkgIyBcIiArIHByb3BlcnR5Q250ICsgXCIgPSBza2lwcGVkIHRvIGVuZCBvZiBwcm9wZXJ0aWUtbGlzdFwiKTtcblx0XHRcdFx0XHR0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uID0gbGlzdF9lbmQ7XG5cdFx0XHRcdFx0cmV0dXJuIHByb3BzO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGV4cGVjdGVkLmhhc093blByb3BlcnR5KGtleS50b1N0cmluZygpKSkge1xuXHRcdFx0XHRcdHR5cGUgPSBleHBlY3RlZFtrZXldO1xuXHRcdFx0XHRcdHByb3BzLnNldChrZXksIHRoaXMucGFyc2VBdHRyVmFsdWUodHlwZSwgbGVuKSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiArPSBsZW47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRwcm9wZXJ0eUNudCArPSAxO1xuXG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPSBsaXN0X2VuZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcHJvcHM7XG5cblx0fVxuXG5cdHByaXZhdGUgcGFyc2VBdHRyVmFsdWUodHlwZTpudW1iZXIsIGxlbjpudW1iZXIpOmFueVxuXHR7XG5cdFx0dmFyIGVsZW1fbGVuOm51bWJlcjtcblx0XHR2YXIgcmVhZF9mdW5jOkZ1bmN0aW9uO1xuXG5cdFx0c3dpdGNoICh0eXBlKSB7XG5cblx0XHRcdGNhc2UgQVdEUGFyc2VyLkJPT0w6XG5cdFx0XHRjYXNlIEFXRFBhcnNlci5JTlQ4OlxuXHRcdFx0XHRlbGVtX2xlbiA9IDE7XG5cdFx0XHRcdHJlYWRfZnVuYyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZEJ5dGU7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIEFXRFBhcnNlci5JTlQxNjpcblx0XHRcdFx0ZWxlbV9sZW4gPSAyO1xuXHRcdFx0XHRyZWFkX2Z1bmMgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRTaG9ydDtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgQVdEUGFyc2VyLklOVDMyOlxuXHRcdFx0XHRlbGVtX2xlbiA9IDQ7XG5cdFx0XHRcdHJlYWRfZnVuYyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZEludDtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgQVdEUGFyc2VyLlVJTlQ4OlxuXHRcdFx0XHRlbGVtX2xlbiA9IDE7XG5cdFx0XHRcdHJlYWRfZnVuYyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgQVdEUGFyc2VyLlVJTlQxNjpcblx0XHRcdFx0ZWxlbV9sZW4gPSAyO1xuXHRcdFx0XHRyZWFkX2Z1bmMgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0O1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBBV0RQYXJzZXIuVUlOVDMyOlxuXHRcdFx0Y2FzZSBBV0RQYXJzZXIuQ09MT1I6XG5cdFx0XHRjYXNlIEFXRFBhcnNlci5CQUREUjpcblx0XHRcdFx0ZWxlbV9sZW4gPSA0O1xuXHRcdFx0XHRyZWFkX2Z1bmMgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludDtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgQVdEUGFyc2VyLkZMT0FUMzI6XG5cdFx0XHRcdGVsZW1fbGVuID0gNDtcblx0XHRcdFx0cmVhZF9mdW5jID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkRmxvYXQ7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIEFXRFBhcnNlci5GTE9BVDY0OlxuXHRcdFx0XHRlbGVtX2xlbiA9IDg7XG5cdFx0XHRcdHJlYWRfZnVuYyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZERvdWJsZTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgQVdEUGFyc2VyLkFXRFNUUklORzpcblx0XHRcdFx0cmV0dXJuIHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVURkJ5dGVzKGxlbik7XG5cblx0XHRcdGNhc2UgQVdEUGFyc2VyLlZFQ1RPUjJ4MTpcblx0XHRcdGNhc2UgQVdEUGFyc2VyLlZFQ1RPUjN4MTpcblx0XHRcdGNhc2UgQVdEUGFyc2VyLlZFQ1RPUjR4MTpcblx0XHRcdGNhc2UgQVdEUGFyc2VyLk1UWDN4Mjpcblx0XHRcdGNhc2UgQVdEUGFyc2VyLk1UWDN4Mzpcblx0XHRcdGNhc2UgQVdEUGFyc2VyLk1UWDR4Mzpcblx0XHRcdGNhc2UgQVdEUGFyc2VyLk1UWDR4NDpcblx0XHRcdFx0ZWxlbV9sZW4gPSA4O1xuXHRcdFx0XHRyZWFkX2Z1bmMgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWREb3VibGU7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0fVxuXG5cdFx0aWYgKGVsZW1fbGVuIDwgbGVuKSB7XG5cdFx0XHR2YXIgbGlzdDpBcnJheTxhbnk+ID0gW107XG5cdFx0XHR2YXIgbnVtX3JlYWQ6bnVtYmVyID0gMDtcblx0XHRcdHZhciBudW1fZWxlbXM6bnVtYmVyID0gbGVuL2VsZW1fbGVuO1xuXG5cdFx0XHR3aGlsZSAobnVtX3JlYWQgPCBudW1fZWxlbXMpIHtcblx0XHRcdFx0bGlzdC5wdXNoKHJlYWRfZnVuYy5hcHBseSh0aGlzLl9uZXdCbG9ja0J5dGVzKSk7IC8vIGxpc3QucHVzaChyZWFkX2Z1bmMoKSk7XG5cdFx0XHRcdG51bV9yZWFkKys7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBsaXN0O1xuXHRcdH0gZWxzZSB7XG5cblx0XHRcdHZhciB2YWw6YW55ID0gcmVhZF9mdW5jLmFwcGx5KHRoaXMuX25ld0Jsb2NrQnl0ZXMpOy8vcmVhZF9mdW5jKCk7XG5cdFx0XHRyZXR1cm4gdmFsO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgcGFyc2VIZWFkZXIoKTp2b2lkXG5cdHtcblx0XHR2YXIgZmxhZ3M6bnVtYmVyO1xuXHRcdHZhciBib2R5X2xlbjpudW1iZXI7XG5cblx0XHR0aGlzLl9ieXRlRGF0YS5wb3NpdGlvbiA9IDM7IC8vIFNraXAgbWFnaWMgc3RyaW5nIGFuZCBwYXJzZSB2ZXJzaW9uXG5cblx0XHR0aGlzLl92ZXJzaW9uWzBdID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdHRoaXMuX3ZlcnNpb25bMV0gPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRCeXRlKCk7XG5cblx0XHRmbGFncyA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZFNob3J0KCk7IC8vIFBhcnNlIGJpdCBmbGFnc1xuXG5cdFx0dGhpcy5fc3RyZWFtaW5nID0gQml0RmxhZ3MudGVzdChmbGFncywgQml0RmxhZ3MuRkxBRzEpO1xuXG5cdFx0aWYgKCh0aGlzLl92ZXJzaW9uWzBdID09IDIpICYmICh0aGlzLl92ZXJzaW9uWzFdID09IDEpKSB7XG5cdFx0XHR0aGlzLl9hY2N1cmFjeU1hdHJpeCA9IEJpdEZsYWdzLnRlc3QoZmxhZ3MsIEJpdEZsYWdzLkZMQUcyKTtcblx0XHRcdHRoaXMuX2FjY3VyYWN5R2VvID0gQml0RmxhZ3MudGVzdChmbGFncywgQml0RmxhZ3MuRkxBRzMpO1xuXHRcdFx0dGhpcy5fYWNjdXJhY3lQcm9wcyA9IEJpdEZsYWdzLnRlc3QoZmxhZ3MsIEJpdEZsYWdzLkZMQUc0KTtcblx0XHR9XG5cblx0XHQvLyBpZiB3ZSBzZXQgX2FjY3VyYWN5T25CbG9ja3MsIHRoZSBwcmVjaXNpb24tdmFsdWVzIGFyZSByZWFkIGZyb20gZWFjaCBibG9jay1oZWFkZXIuXG5cblx0XHQvLyBzZXQgc3RvcmFnZVByZWNpc2lvbiB0eXBlc1xuXHRcdHRoaXMuX2dlb05yVHlwZSA9IEFXRFBhcnNlci5GTE9BVDMyO1xuXG5cdFx0aWYgKHRoaXMuX2FjY3VyYWN5R2VvKSB7XG5cdFx0XHR0aGlzLl9nZW9OclR5cGUgPSBBV0RQYXJzZXIuRkxPQVQ2NDtcblx0XHR9XG5cblx0XHR0aGlzLl9tYXRyaXhOclR5cGUgPSBBV0RQYXJzZXIuRkxPQVQzMjtcblxuXHRcdGlmICh0aGlzLl9hY2N1cmFjeU1hdHJpeCkge1xuXHRcdFx0dGhpcy5fbWF0cml4TnJUeXBlID0gQVdEUGFyc2VyLkZMT0FUNjQ7XG5cdFx0fVxuXG5cdFx0dGhpcy5fcHJvcHNOclR5cGUgPSBBV0RQYXJzZXIuRkxPQVQzMjtcblxuXHRcdGlmICh0aGlzLl9hY2N1cmFjeVByb3BzKSB7XG5cdFx0XHR0aGlzLl9wcm9wc05yVHlwZSA9IEFXRFBhcnNlci5GTE9BVDY0O1xuXHRcdH1cblxuXHRcdHRoaXMuX2NvbXByZXNzaW9uID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkQnl0ZSgpOyAvLyBjb21wcmVzc2lvblxuXG5cdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIkltcG9ydCBBV0RGaWxlIG9mIHZlcnNpb24gPSBcIiArIHRoaXMuX3ZlcnNpb25bMF0gKyBcIiAtIFwiICsgdGhpcy5fdmVyc2lvblsxXSk7XG5cdFx0XHRjb25zb2xlLmxvZyhcIkdsb2JhbCBTZXR0aW5ncyA9IENvbXByZXNzaW9uID0gXCIgKyB0aGlzLl9jb21wcmVzc2lvbiArIFwiIHwgU3RyZWFtaW5nID0gXCIgKyB0aGlzLl9zdHJlYW1pbmcgKyBcIiB8IE1hdHJpeC1QcmVjaXNpb24gPSBcIiArIHRoaXMuX2FjY3VyYWN5TWF0cml4ICsgXCIgfCBHZW9tZXRyeS1QcmVjaXNpb24gPSBcIiArIHRoaXMuX2FjY3VyYWN5R2VvICsgXCIgfCBQcm9wZXJ0aWVzLVByZWNpc2lvbiA9IFwiICsgdGhpcy5fYWNjdXJhY3lQcm9wcyk7XG5cdFx0fVxuXG5cdFx0Ly8gQ2hlY2sgZmlsZSBpbnRlZ3JpdHlcblx0XHRib2R5X2xlbiA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdGlmICghdGhpcy5fc3RyZWFtaW5nICYmIGJvZHlfbGVuICE9IHRoaXMuX2J5dGVEYXRhLmdldEJ5dGVzQXZhaWxhYmxlKCkpIHtcblx0XHRcdHRoaXMuX3BEaWVXaXRoRXJyb3IoJ0FXRDIgYm9keSBsZW5ndGggZG9lcyBub3QgbWF0Y2ggaGVhZGVyIGludGVncml0eSBmaWVsZCcpO1xuXHRcdH1cblxuXHR9XG5cdC8vIEhlbHBlciAtIGZ1bmN0aW9uc1xuXHRwcml2YXRlIGdldFVWRm9yVmVydGV4QW5pbWF0aW9uKG1lc2hJRDpudW1iZXIgLyp1aW50Ki8pOkFycmF5PEFycmF5PG51bWJlcj4+XG5cdHtcblx0XHRpZiAodGhpcy5fYmxvY2tzW21lc2hJRF0uZGF0YSBpbnN0YW5jZW9mIE1lc2gpXG5cdFx0bWVzaElEID0gdGhpcy5fYmxvY2tzW21lc2hJRF0uZ2VvSUQ7XG5cdFx0aWYgKHRoaXMuX2Jsb2Nrc1ttZXNoSURdLnV2c0ZvclZlcnRleEFuaW1hdGlvbilcblx0XHRcdHJldHVybiB0aGlzLl9ibG9ja3NbbWVzaElEXS51dnNGb3JWZXJ0ZXhBbmltYXRpb247XG5cdFx0dmFyIGdlb21ldHJ5Okdlb21ldHJ5ID0gKDxHZW9tZXRyeT4gdGhpcy5fYmxvY2tzW21lc2hJRF0uZGF0YSk7XG5cdFx0dmFyIGdlb0NudDpudW1iZXIgLyppbnQqLyA9IDA7XG5cdFx0dmFyIHVkOkFycmF5PG51bWJlcj47XG5cdFx0dmFyIHVTdHJpZGU6bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciB1T2ZmczpudW1iZXIgLyp1aW50Ki87XG5cdFx0dmFyIG51bVBvaW50czpudW1iZXIgLyp1aW50Ki87XG5cdFx0dmFyIGk6bnVtYmVyIC8qaW50Ki87XG5cdFx0dmFyIG5ld1V2czpBcnJheTxudW1iZXI+O1xuXHRcdHZhciBzdWJfZ2VvbTpUcmlhbmdsZVN1Ykdlb21ldHJ5O1xuXHRcdHRoaXMuX2Jsb2Nrc1ttZXNoSURdLnV2c0ZvclZlcnRleEFuaW1hdGlvbiA9IG5ldyBBcnJheTxBcnJheTxudW1iZXI+PigpO1xuXHRcdHdoaWxlIChnZW9DbnQgPCBnZW9tZXRyeS5zdWJHZW9tZXRyaWVzLmxlbmd0aCkge1xuXHRcdFx0bmV3VXZzID0gbmV3IEFycmF5PG51bWJlcj4oKTtcblx0XHRcdHN1Yl9nZW9tID0gPFRyaWFuZ2xlU3ViR2VvbWV0cnk+IGdlb21ldHJ5LnN1Ykdlb21ldHJpZXNbZ2VvQ250XTtcblx0XHRcdG51bVBvaW50cyA9IHN1Yl9nZW9tLm51bVZlcnRpY2VzO1xuXHRcdFx0dWQgPSBzdWJfZ2VvbS51dnM7XG5cdFx0XHR1U3RyaWRlID0gc3ViX2dlb20uZ2V0U3RyaWRlKFRyaWFuZ2xlU3ViR2VvbWV0cnkuVVZfREFUQSk7XG5cdFx0XHR1T2ZmcyA9IHN1Yl9nZW9tLmdldE9mZnNldChUcmlhbmdsZVN1Ykdlb21ldHJ5LlVWX0RBVEEpO1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IG51bVBvaW50czsgaSsrKSB7XG5cdFx0XHRcdG5ld1V2cy5wdXNoKHVkW3VPZmZzICsgaSp1U3RyaWRlICsgMF0pO1xuXHRcdFx0XHRuZXdVdnMucHVzaCh1ZFt1T2ZmcyArIGkqdVN0cmlkZSArIDFdKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2Jsb2Nrc1ttZXNoSURdLnV2c0ZvclZlcnRleEFuaW1hdGlvbi5wdXNoKG5ld1V2cyk7XG5cdFx0XHRnZW9DbnQrKztcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX2Jsb2Nrc1ttZXNoSURdLnV2c0ZvclZlcnRleEFuaW1hdGlvbjtcblx0fVxuXHRcblx0cHJpdmF0ZSBwYXJzZVZhclN0cigpOnN0cmluZ1xuXHR7XG5cblx0XHR2YXIgbGVuOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRyZXR1cm4gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVVRGQnl0ZXMobGVuKTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0QXNzZXRCeUlEKGFzc2V0SUQ6bnVtYmVyLCBhc3NldFR5cGVzVG9HZXQ6QXJyYXk8c3RyaW5nPiwgZXh0cmFUeXBlSW5mbzpzdHJpbmcgPSBcIlNpbmdsZVRleHR1cmVcIik6QXJyYXk8YW55PlxuXHR7XG5cdFx0dmFyIHJldHVybkFycmF5OkFycmF5PGFueT4gPSBuZXcgQXJyYXk8YW55PigpO1xuXHRcdHZhciB0eXBlQ250Om51bWJlciA9IDA7XG5cdFx0aWYgKGFzc2V0SUQgPiAwKSB7XG5cdFx0XHRpZiAodGhpcy5fYmxvY2tzW2Fzc2V0SURdKSB7XG5cdFx0XHRcdGlmICh0aGlzLl9ibG9ja3NbYXNzZXRJRF0uZGF0YSkge1xuXHRcdFx0XHRcdHdoaWxlICh0eXBlQ250IDwgYXNzZXRUeXBlc1RvR2V0Lmxlbmd0aCkge1xuXG5cdFx0XHRcdFx0XHR2YXIgaWFzc2V0OklBc3NldCA9IDxJQXNzZXQ+IHRoaXMuX2Jsb2Nrc1thc3NldElEXS5kYXRhO1xuXG5cdFx0XHRcdFx0XHRpZiAoaWFzc2V0LmFzc2V0VHlwZSA9PSBhc3NldFR5cGVzVG9HZXRbdHlwZUNudF0pIHtcblx0XHRcdFx0XHRcdFx0Ly9pZiB0aGUgcmlnaHQgYXNzZXRUeXBlIHdhcyBmb3VuZFxuXHRcdFx0XHRcdFx0XHRpZiAoKGFzc2V0VHlwZXNUb0dldFt0eXBlQ250XSA9PSBBc3NldFR5cGUuVEVYVFVSRSkgJiYgKGV4dHJhVHlwZUluZm8gPT0gXCJDdWJlVGV4dHVyZVwiKSkge1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0aGlzLl9ibG9ja3NbYXNzZXRJRF0uZGF0YSBpbnN0YW5jZW9mIEltYWdlQ3ViZVRleHR1cmUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybkFycmF5LnB1c2godHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm5BcnJheS5wdXNoKHRoaXMuX2Jsb2Nrc1thc3NldElEXS5kYXRhKTtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiByZXR1cm5BcnJheTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aWYgKChhc3NldFR5cGVzVG9HZXRbdHlwZUNudF0gPT0gQXNzZXRUeXBlLlRFWFRVUkUpICYmIChleHRyYVR5cGVJbmZvID09IFwiU2luZ2xlVGV4dHVyZVwiKSkge1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0aGlzLl9ibG9ja3NbYXNzZXRJRF0uZGF0YSBpbnN0YW5jZW9mIEltYWdlVGV4dHVyZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuQXJyYXkucHVzaCh0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybkFycmF5LnB1c2godGhpcy5fYmxvY2tzW2Fzc2V0SURdLmRhdGEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHJldHVybkFycmF5O1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5BcnJheS5wdXNoKHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybkFycmF5LnB1c2godGhpcy5fYmxvY2tzW2Fzc2V0SURdLmRhdGEpO1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiByZXR1cm5BcnJheTtcblxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQvL2lmICgoYXNzZXRUeXBlc1RvR2V0W3R5cGVDbnRdID09IEFzc2V0VHlwZS5HRU9NRVRSWSkgJiYgKElBc3NldChfYmxvY2tzW2Fzc2V0SURdLmRhdGEpLmFzc2V0VHlwZSA9PSBBc3NldFR5cGUuTUVTSCkpIHtcblx0XHRcdFx0XHRcdGlmICgoYXNzZXRUeXBlc1RvR2V0W3R5cGVDbnRdID09IEFzc2V0VHlwZS5HRU9NRVRSWSkgJiYgKGlhc3NldC5hc3NldFR5cGUgPT0gQXNzZXRUeXBlLk1FU0gpKSB7XG5cblx0XHRcdFx0XHRcdFx0dmFyIG1lc2g6TWVzaCA9IDxNZXNoPiB0aGlzLl9ibG9ja3NbYXNzZXRJRF0uZGF0YVxuXG5cdFx0XHRcdFx0XHRcdHJldHVybkFycmF5LnB1c2godHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybkFycmF5LnB1c2gobWVzaC5nZW9tZXRyeSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiByZXR1cm5BcnJheTtcblxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR0eXBlQ250Kys7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIGlmIHRoZSBoYXMgbm90IHJldHVybmVkIGFueXRoaW5nIHlldCwgdGhlIGFzc2V0IGlzIG5vdCBmb3VuZCwgb3IgdGhlIGZvdW5kIGFzc2V0IGlzIG5vdCB0aGUgcmlnaHQgdHlwZS5cblx0XHRyZXR1cm5BcnJheS5wdXNoKGZhbHNlKTtcblx0XHRyZXR1cm5BcnJheS5wdXNoKHRoaXMuZ2V0RGVmYXVsdEFzc2V0KGFzc2V0VHlwZXNUb0dldFswXSwgZXh0cmFUeXBlSW5mbykpO1xuXHRcdHJldHVybiByZXR1cm5BcnJheTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0RGVmYXVsdEFzc2V0KGFzc2V0VHlwZTpzdHJpbmcsIGV4dHJhVHlwZUluZm86c3RyaW5nKTpJQXNzZXRcblx0e1xuXHRcdHN3aXRjaCAodHJ1ZSkge1xuXHRcdFx0Y2FzZSAoYXNzZXRUeXBlID09IEFzc2V0VHlwZS5URVhUVVJFKTpcblx0XHRcdFx0aWYgKGV4dHJhVHlwZUluZm8gPT0gXCJDdWJlVGV4dHVyZVwiKVxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmdldERlZmF1bHRDdWJlVGV4dHVyZSgpO1xuXHRcdFx0XHRpZiAoZXh0cmFUeXBlSW5mbyA9PSBcIlNpbmdsZVRleHR1cmVcIilcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5nZXREZWZhdWx0VGV4dHVyZSgpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgKGFzc2V0VHlwZSA9PSBBc3NldFR5cGUuTUFURVJJQUwpOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5nZXREZWZhdWx0TWF0ZXJpYWwoKVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXREZWZhdWx0TWF0ZXJpYWwoKTpJQXNzZXRcblx0e1xuXHRcdGlmICghdGhpcy5fZGVmYXVsdEJpdG1hcE1hdGVyaWFsKVxuXHRcdFx0dGhpcy5fZGVmYXVsdEJpdG1hcE1hdGVyaWFsID0gPFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWw+IERlZmF1bHRNYXRlcmlhbE1hbmFnZXIuZ2V0RGVmYXVsdE1hdGVyaWFsKCk7XG5cblx0XHRyZXR1cm4gIDxJQXNzZXQ+ICB0aGlzLl9kZWZhdWx0Qml0bWFwTWF0ZXJpYWw7XG5cdH1cblxuXHRwcml2YXRlIGdldERlZmF1bHRUZXh0dXJlKCk6SUFzc2V0XG5cdHtcblx0XHRpZiAoIXRoaXMuX2RlZmF1bHRUZXh0dXJlKVxuXHRcdFx0dGhpcy5fZGVmYXVsdFRleHR1cmUgPSBEZWZhdWx0TWF0ZXJpYWxNYW5hZ2VyLmdldERlZmF1bHRUZXh0dXJlKCk7XG5cblx0XHRyZXR1cm4gPElBc3NldD4gdGhpcy5fZGVmYXVsdFRleHR1cmU7XG5cblx0fVxuXG5cdHByaXZhdGUgZ2V0RGVmYXVsdEN1YmVUZXh0dXJlKCk6SUFzc2V0XG5cdHtcblx0XHRpZiAoIXRoaXMuX2RlZmF1bHRDdWJlVGV4dHVyZSkge1xuXHRcdFx0dmFyIGRlZmF1bHRCaXRtYXA6Qml0bWFwRGF0YSA9IERlZmF1bHRNYXRlcmlhbE1hbmFnZXIuY3JlYXRlQ2hlY2tlcmVkQml0bWFwRGF0YSgpO1xuXG5cdFx0XHR0aGlzLl9kZWZhdWx0Q3ViZVRleHR1cmUgPSBuZXcgQml0bWFwQ3ViZVRleHR1cmUoZGVmYXVsdEJpdG1hcCwgZGVmYXVsdEJpdG1hcCwgZGVmYXVsdEJpdG1hcCwgZGVmYXVsdEJpdG1hcCwgZGVmYXVsdEJpdG1hcCwgZGVmYXVsdEJpdG1hcCk7XG5cdFx0XHR0aGlzLl9kZWZhdWx0Q3ViZVRleHR1cmUubmFtZSA9IFwiZGVmYXVsdEN1YmVUZXh0dXJlXCI7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIDxJQXNzZXQ+IHRoaXMuX2RlZmF1bHRDdWJlVGV4dHVyZTtcblx0fVxuXG5cdHByaXZhdGUgcmVhZE51bWJlcihwcmVjaXNpb246Ym9vbGVhbiA9IGZhbHNlKTpudW1iZXJcblx0e1xuXHRcdGlmIChwcmVjaXNpb24pXG5cdFx0XHRyZXR1cm4gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkRG91YmxlKCk7XG5cdFx0cmV0dXJuIHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZEZsb2F0KCk7XG5cblx0fVxuXG5cdHByaXZhdGUgcGFyc2VNYXRyaXgzRCgpOk1hdHJpeDNEXG5cdHtcblx0XHRyZXR1cm4gbmV3IE1hdHJpeDNEKHRoaXMucGFyc2VNYXRyaXg0M1Jhd0RhdGEoKSk7XG5cdH1cblxuXHRwcml2YXRlIHBhcnNlTWF0cml4MzJSYXdEYXRhKCk6QXJyYXk8bnVtYmVyPlxuXHR7XG5cdFx0dmFyIGk6bnVtYmVyO1xuXHRcdHZhciBtdHhfcmF3OkFycmF5PG51bWJlcj4gPSBuZXcgQXJyYXk8bnVtYmVyPig2KTtcblx0XHRmb3IgKGkgPSAwOyBpIDwgNjsgaSsrKSB7XG5cdFx0XHRtdHhfcmF3W2ldID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkRmxvYXQoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbXR4X3Jhdztcblx0fVxuXG5cdHByaXZhdGUgcGFyc2VNYXRyaXg0M1Jhd0RhdGEoKTpBcnJheTxudW1iZXI+XG5cdHtcblx0XHR2YXIgbXR4X3JhdzpBcnJheTxudW1iZXI+ID0gbmV3IEFycmF5PG51bWJlcj4oMTYpO1xuXG5cdFx0bXR4X3Jhd1swXSA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeU1hdHJpeCk7XG5cdFx0bXR4X3Jhd1sxXSA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeU1hdHJpeCk7XG5cdFx0bXR4X3Jhd1syXSA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeU1hdHJpeCk7XG5cdFx0bXR4X3Jhd1szXSA9IDAuMDtcblx0XHRtdHhfcmF3WzRdID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5TWF0cml4KTtcblx0XHRtdHhfcmF3WzVdID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5TWF0cml4KTtcblx0XHRtdHhfcmF3WzZdID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5TWF0cml4KTtcblx0XHRtdHhfcmF3WzddID0gMC4wO1xuXHRcdG10eF9yYXdbOF0gPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lNYXRyaXgpO1xuXHRcdG10eF9yYXdbOV0gPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lNYXRyaXgpO1xuXHRcdG10eF9yYXdbMTBdID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5TWF0cml4KTtcblx0XHRtdHhfcmF3WzExXSA9IDAuMDtcblx0XHRtdHhfcmF3WzEyXSA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeU1hdHJpeCk7XG5cdFx0bXR4X3Jhd1sxM10gPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lNYXRyaXgpO1xuXHRcdG10eF9yYXdbMTRdID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5TWF0cml4KTtcblx0XHRtdHhfcmF3WzE1XSA9IDEuMDtcblxuXHRcdC8vVE9ETzogZml4IG1heCBleHBvcnRlciB0byByZW1vdmUgTmFOIHZhbHVlcyBpbiBqb2ludCAwIGludmVyc2UgYmluZCBwb3NlXG5cblx0XHRpZiAoaXNOYU4obXR4X3Jhd1swXSkpIHtcblx0XHRcdG10eF9yYXdbMF0gPSAxO1xuXHRcdFx0bXR4X3Jhd1sxXSA9IDA7XG5cdFx0XHRtdHhfcmF3WzJdID0gMDtcblx0XHRcdG10eF9yYXdbNF0gPSAwO1xuXHRcdFx0bXR4X3Jhd1s1XSA9IDE7XG5cdFx0XHRtdHhfcmF3WzZdID0gMDtcblx0XHRcdG10eF9yYXdbOF0gPSAwO1xuXHRcdFx0bXR4X3Jhd1s5XSA9IDA7XG5cdFx0XHRtdHhfcmF3WzEwXSA9IDE7XG5cdFx0XHRtdHhfcmF3WzEyXSA9IDA7XG5cdFx0XHRtdHhfcmF3WzEzXSA9IDA7XG5cdFx0XHRtdHhfcmF3WzE0XSA9IDA7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gbXR4X3Jhdztcblx0fVxuXG59XG5cbmV4cG9ydCA9IEFXRFBhcnNlcjsiXX0=