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
var SkyboxMaterial = require("awayjs-renderergl/lib/materials/SkyboxMaterial");
var TriangleMaterialMode = require("awayjs-renderergl/lib/materials/TriangleMaterialMode");
var TriangleMethodMaterial = require("awayjs-renderergl/lib/materials/TriangleMethodMaterial");
var DefaultMaterialManager = require("awayjs-renderergl/lib/materials/utils/DefaultMaterialManager");
var AmbientEnvMapMethod = require("awayjs-renderergl/lib/materials/methods/AmbientEnvMapMethod");
var DiffuseDepthMethod = require("awayjs-renderergl/lib/materials/methods/DiffuseDepthMethod");
var DiffuseCelMethod = require("awayjs-renderergl/lib/materials/methods/DiffuseCelMethod");
var DiffuseGradientMethod = require("awayjs-renderergl/lib/materials/methods/DiffuseGradientMethod");
var DiffuseLightMapMethod = require("awayjs-renderergl/lib/materials/methods/DiffuseLightMapMethod");
var DiffuseWrapMethod = require("awayjs-renderergl/lib/materials/methods/DiffuseWrapMethod");
var EffectAlphaMaskMethod = require("awayjs-renderergl/lib/materials/methods/EffectAlphaMaskMethod");
var EffectColorMatrixMethod = require("awayjs-renderergl/lib/materials/methods/EffectColorMatrixMethod");
var EffectColorTransformMethod = require("awayjs-renderergl/lib/materials/methods/EffectColorTransformMethod");
var EffectEnvMapMethod = require("awayjs-renderergl/lib/materials/methods/EffectEnvMapMethod");
var EffectFogMethod = require("awayjs-renderergl/lib/materials/methods/EffectFogMethod");
var EffectFresnelEnvMapMethod = require("awayjs-renderergl/lib/materials/methods/EffectFresnelEnvMapMethod");
var EffectLightMapMethod = require("awayjs-renderergl/lib/materials/methods/EffectLightMapMethod");
var EffectRimLightMethod = require("awayjs-renderergl/lib/materials/methods/EffectRimLightMethod");
var NormalSimpleWaterMethod = require("awayjs-renderergl/lib/materials/methods/NormalSimpleWaterMethod");
var ShadowDitheredMethod = require("awayjs-renderergl/lib/materials/methods/ShadowDitheredMethod");
var ShadowFilteredMethod = require("awayjs-renderergl/lib/materials/methods/ShadowFilteredMethod");
var SpecularFresnelMethod = require("awayjs-renderergl/lib/materials/methods/SpecularFresnelMethod");
var ShadowHardMethod = require("awayjs-renderergl/lib/materials/methods/ShadowHardMethod");
var SpecularAnisotropicMethod = require("awayjs-renderergl/lib/materials/methods/SpecularAnisotropicMethod");
var SpecularCelMethod = require("awayjs-renderergl/lib/materials/methods/SpecularCelMethod");
var SpecularPhongMethod = require("awayjs-renderergl/lib/materials/methods/SpecularPhongMethod");
var ShadowNearMethod = require("awayjs-renderergl/lib/materials/methods/ShadowNearMethod");
var ShadowSoftMethod = require("awayjs-renderergl/lib/materials/methods/ShadowSoftMethod");
var TimeLine = require("awayjs-display/lib/entities/TimeLine");
var TimeLineFrame = require("awayjs-display/lib/entities/timelinedata/TimeLineFrame");
var TimeLineObject = require("awayjs-display/lib/entities/timelinedata/TimeLineObject");
var FrameCommand = require("awayjs-display/lib/entities/timelinedata/FrameCommand");
var CommandPropsDisplayObject = require("awayjs-display/lib/entities/timelinedata/CommandPropsDisplayObject");
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
        if ((this._version[0] == 3) && (this._version[1] == 0)) {
            switch (type) {
                case 2:
                case 131:
                    this.parseShape2D(this._cur_block_id);
                    isParsed = true;
                    break;
                case 3:
                case 132:
                    this.parseShape2DFill(this._cur_block_id);
                    isParsed = true;
                    break;
                case 4:
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
    //Block ID = 2
    AWDParser.prototype.parseShape2D = function (blockID) {
        var geom = new Geometry();
        // Read name and sub count
        var name = this.parseVarStr();
        var num_subs = this._newBlockBytes.readUnsignedShort();
        // Read optional properties
        var props = this.parseProperties({ 1: this._geoNrType, 2: this._geoNrType });
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
            //console.log("        (!) PARSE SUBMESH");
            // Ignore for now (read uv for subshapes later)"
            var subProps = this.parseProperties({ 1: this._geoNrType, 2: this._geoNrType });
            // Loop through data streams
            var indices = new Array();
            var i_idx = 0;
            while (this._newBlockBytes.position < sm_end) {
                var idx = 0;
                var uv_idx = 0;
                var n_idx = 0;
                var t_idx = 0;
                var str_ftype, str_type, str_len, str_end;
                // Type, field type, length
                str_type = this._newBlockBytes.readUnsignedByte();
                str_ftype = this._newBlockBytes.readUnsignedByte();
                str_len = this._newBlockBytes.readUnsignedInt();
                str_end = this._newBlockBytes.position + str_len;
                var x, y, z;
                var type;
                var r, g, b, a;
                var u, v;
                if (str_type == 1) {
                    var verts = new Array();
                    var uvs = new Array();
                    var normals = new Array();
                    var tangents = new Array();
                    while (this._newBlockBytes.position < str_end) {
                        x = this.readNumber(this._accuracyGeo);
                        y = this.readNumber(this._accuracyGeo);
                        z = -0.1 * subs_parsed;
                        //z = subs_parsed;
                        //z = (blockID*0.001) + subs_parsed
                        type = this.readNumber(this._accuracyGeo);
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
                        else {
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
                else if (str_type == 2) {
                    while (this._newBlockBytes.position < str_end) {
                        var thisVal = this._newBlockBytes.readUnsignedShort();
                        indices[i_idx++] = thisVal;
                    }
                }
                else if (str_type == 3) {
                    while (this._newBlockBytes.position < str_end) {
                        var thisVal = this._newBlockBytes.readUnsignedShort();
                        indices[i_idx++] = thisVal;
                    }
                }
                else if (str_type == 4) {
                    while (this._newBlockBytes.position < str_end) {
                        var thisVal = this._newBlockBytes.readUnsignedShort();
                        indices[i_idx++] = thisVal;
                    }
                }
                else if (str_type == 5) {
                    while (this._newBlockBytes.position < str_end) {
                        var thisVal = this._newBlockBytes.readUnsignedShort();
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
            if (true) {
                sub_geom.autoDeriveTangents = true;
            }
            else {
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
        this._pFinalizeAsset(geom, name);
        this._blocks[blockID].data = geom;
        if (this._debug)
            console.log("Parsed a TriangleGeometry: Name = " + name + "| Id = " + sub_geom.id);
    };
    //Block ID = 3
    AWDParser.prototype.parseShape2DFill = function (blockID) {
        var name = this.parseVarStr();
        var fill_type = this._newBlockBytes.readUnsignedByte();
        var fill_props = this.parseProperties({ 1: AWDParser.UINT32 }); // { 1:UINT32, 6:AWDSTRING }  ); //; , 2:UINT32, 3:UINT32, 5:BOOL } );
        switch (fill_type) {
            case 0:
                //console.log("Parsed a Solid FILL: Name = " + name);
                var material = new TriangleMethodMaterial(fill_props.get(1, 0xcccccc));
                material.bothSides = true;
                this._pFinalizeAsset(material, name);
                this._blocks[blockID].data = material;
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
    };
    //Block ID = 4
    AWDParser.prototype.parseTimeLine = function (blockID) {
        var i;
        var j;
        var k;
        var timeLineContainer = new TimeLine();
        var name = this.parseVarStr();
        var isScene = !!this._newBlockBytes.readUnsignedByte();
        var sceneID = this._newBlockBytes.readUnsignedByte();
        var numFrames = this._newBlockBytes.readUnsignedShort();
        // var previousTimeLine:TimeLineFrame;
        // var fill_props:AWDProperties = this.parseProperties({1:AWDParser.UINT32});// { 1:UINT32, 6:AWDSTRING }  ); //; , 2:UINT32, 3:UINT32, 5:BOOL } );
        if (this._debug)
            console.log("Parsed a TIMELINE: Name = " + name + "| isScene = " + isScene + "| sceneID = " + sceneID + "| numFrames = " + numFrames);
        var totalDuration = 0;
        for (i = 0; i < numFrames; i++) {
            var frame = new TimeLineFrame();
            var traceString = "frame = " + i;
            var frameDuration = this._newBlockBytes.readUnsignedInt();
            frame.setFrameTime(totalDuration, frameDuration);
            totalDuration += frameDuration;
            //console.log("duration = " + frameDuration);
            var numLabels = this._newBlockBytes.readUnsignedShort();
            for (j = 0; j < numLabels; j++) {
                var labelType = this._newBlockBytes.readUnsignedByte();
                var label = this.parseVarStr();
                frame.addLabel(label, labelType);
                traceString += "\n     label = " + label + " - labelType = " + labelType;
            }
            var numCommands = this._newBlockBytes.readUnsignedShort();
            var commandString = "\n      Commands " + numCommands;
            for (j = 0; j < numCommands; j++) {
                var objectID;
                var resourceID;
                var commandType = this._newBlockBytes.readUnsignedShort();
                switch (commandType) {
                    case 1:
                    case 2:
                        // Place Object Command
                        var newObjectProps = new CommandPropsDisplayObject();
                        var hasResource = !!this._newBlockBytes.readByte();
                        var hasDisplayMatrix = !!this._newBlockBytes.readByte();
                        var hasColorMatrix = !!this._newBlockBytes.readByte();
                        var hasDepthChange = !!this._newBlockBytes.readByte();
                        var hasFilterChange = !!this._newBlockBytes.readByte();
                        var hasBlendModeChange = !!this._newBlockBytes.readByte();
                        var hasDepthClipChange = !!this._newBlockBytes.readByte();
                        var hasVisibilityChange = !!this._newBlockBytes.readByte();
                        objectID = this._newBlockBytes.readUnsignedInt();
                        if (hasResource) {
                            resourceID = this._newBlockBytes.readUnsignedInt();
                            commandString += "\n      - Add new Resource = " + resourceID + " as object_id = " + objectID;
                        }
                        else {
                            commandString += "\n      - Update object_id = " + objectID;
                        }
                        if (hasDisplayMatrix) {
                            var transformArray = [];
                            var thisMatrix = new Matrix3D();
                            // TODO: implement this in exporter (make transform optional 3d):
                            var is3d = false; // !!this._newBlockBytes.readByte();
                            if (is3d) {
                                thisMatrix = this.parseMatrix3D();
                            }
                            else {
                                for (k = 0; k < 6; k++) {
                                    transformArray.push(this._newBlockBytes.readFloat());
                                }
                                // TODO: set rotation and scale
                                thisMatrix.position = new Vector3D(transformArray[4], transformArray[5], 0);
                            }
                            newObjectProps.setDisplaymatrix(thisMatrix);
                            commandString += "\n                transformArray = " + transformArray;
                        }
                        if (hasColorMatrix) {
                            var colorMatrix = [];
                            for (k = 0; k < 20; k++) {
                                colorMatrix.push(this._newBlockBytes.readFloat());
                            }
                            // TODO: set ColorTransform on objectProps
                            commandString += "\n                colorMatrix = " + colorMatrix;
                        }
                        if (hasDepthChange) {
                            var newDepth = this._newBlockBytes.readUnsignedInt();
                            commandString += "\n                Depth = " + newDepth;
                        }
                        if (hasFilterChange) {
                        }
                        if (hasBlendModeChange) {
                            var newBlendMode = this._newBlockBytes.readUnsignedByte();
                            commandString += "\n                BlendMode = " + newBlendMode;
                        }
                        if (hasDepthClipChange) {
                            var newClipDepth = this._newBlockBytes.readUnsignedInt();
                            commandString += "\n                ClipDepth = " + newClipDepth;
                        }
                        if (hasVisibilityChange) {
                            var newVisibility = Boolean(this._newBlockBytes.readByte());
                            commandString += "\n                Visibitily = " + newVisibility;
                        }
                        var numFills = this._newBlockBytes.readUnsignedShort();
                        commandString += "\n                number of fills = " + numFills;
                        var fillsIDs = [];
                        for (k = 0; k < numFills; k++) {
                            fillsIDs.push(this._newBlockBytes.readUnsignedInt());
                            commandString += "\n                    id of fill = " + fillsIDs[k];
                        }
                        var instanceName = this.parseVarStr();
                        if (instanceName.length) {
                            newObjectProps.setInstancename(instanceName);
                            commandString += "\n                instanceName = " + instanceName;
                        }
                        // if this is a "ADD NEW OBJECT"-command,
                        // we need to lookup the new object by AWD ID.
                        if (hasResource) {
                            // sound is added to timeline with dedicated Command, as it is no display-object (has no matrix etc)
                            // check if a Geometry can be found at the resourceID (AWD-ID)
                            var returnedArray = this.getAssetByID(resourceID, [AssetType.GEOMETRY]);
                            if (returnedArray[0]) {
                                var geom = returnedArray[1];
                                var newMesh = new Mesh(geom);
                                for (k = 0; k < numFills; k++) {
                                    var returnedArray2 = this.getAssetByID(fillsIDs[k], [AssetType.MATERIAL]);
                                    if (returnedArray2[0]) {
                                        if (newMesh.subMeshes.length > k) {
                                            newMesh.subMeshes[k].material = returnedArray2[1];
                                        }
                                    }
                                }
                                var newTimeLineMesh = new TimeLineObject(newMesh, objectID, new CommandPropsDisplayObject());
                                timeLineContainer.addTimeLineObject(newTimeLineMesh);
                                var newCommandaddMesh = new FrameCommand(newTimeLineMesh);
                                newCommandaddMesh.commandProps = newObjectProps;
                                frame.addCommand(newCommandaddMesh);
                            }
                            else {
                                // no geometry found, so we check for TIMELINE.
                                var returnedArray = this.getAssetByID(resourceID, [AssetType.TIMELINE]);
                                if (returnedArray[0]) {
                                    // timeline found. create command and add it to the frame
                                    var newTimeLineTimeLine = new TimeLineObject(returnedArray[1], objectID, new CommandPropsDisplayObject());
                                    timeLineContainer.addTimeLineObject(newTimeLineTimeLine);
                                    var newCommandAddTimeLine = new FrameCommand(newTimeLineTimeLine);
                                    newCommandAddTimeLine.commandProps = newObjectProps;
                                    frame.addCommand(newCommandAddTimeLine);
                                }
                            }
                        }
                        else {
                            // get the existing TimeLineobject fronm the timeline
                            var newTimeLineUpdate = timeLineContainer.getTimeLineObjectByID(objectID);
                            var newCommandupdate = new FrameCommand(newTimeLineUpdate);
                            //newCommandupdate.commandProps=newObjectProps;
                            // TODO:
                            frame.addCommand(newCommandupdate);
                        }
                        break;
                    case 3:
                        // Remove Object Command
                        objectID = this._newBlockBytes.readUnsignedInt();
                        var newTimeLineUpdate = timeLineContainer.getTimeLineObjectByID(objectID);
                        var newCommandupdate = new FrameCommand(newTimeLineUpdate);
                        newCommandupdate.activateObj = false;
                        frame.addCommand(newCommandupdate);
                        //newCommandupdate.commandProps=newObjectProps;
                        commandString += "\n       - Remove object with ID: " + objectID;
                        break;
                    case 4:
                        // Add Sound Command
                        // TODO: create CommandPropsSound and check which asset to use
                        objectID = this._newBlockBytes.readUnsignedInt();
                        resourceID = this._newBlockBytes.readUnsignedInt();
                        // TODO: implement sound in timeline
                        commandString += "\n      - Add new Sound AWD-ID = " + resourceID.toString() + " as object_id = " + objectID.toString();
                        break;
                    default:
                        commandString += "\n       - Unknown Command Type = " + commandType;
                        break;
                }
            }
            var length_code = this._newBlockBytes.readUnsignedInt();
            if (length_code > 0) {
                var frame_code = this._newBlockBytes.readUTFBytes(length_code);
                frame.addToScript(frame_code);
                traceString += "\nframe-code = " + frame_code;
            }
            traceString += commandString;
            //trace("length_code = "+length_code+" frame_code = "+frame_code);
            this._newBlockBytes.readUnsignedInt(); // user attributes - skip for now
            //this.parseUserAttributes(); // Ignore sub-mesh attributes for now
            //console.log(traceString);
            timeLineContainer.addFrame(frame);
        }
        this._pFinalizeAsset(timeLineContainer, name);
        this._blocks[blockID].data = timeLineContainer;
        this.parseProperties(null);
        this.parseUserAttributes();
    };
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
var AWDBlock = (function () {
    function AWDBlock() {
    }
    AWDBlock.prototype.dispose = function () {
        this.id = null;
        this.bytes = null;
        this.errorMessages = null;
        this.uvsForVertexAnimation = null;
    };
    AWDBlock.prototype.addError = function (errorMsg) {
        if (!this.errorMessages)
            this.errorMessages = new Array();
        this.errorMessages.push(errorMsg);
    };
    return AWDBlock;
})();
var AWDProperties = (function () {
    function AWDProperties() {
    }
    AWDProperties.prototype.set = function (key, value) {
        this[key.toString()] = value;
    };
    AWDProperties.prototype.get = function (key, fallback) {
        if (this.hasOwnProperty(key.toString())) {
            return this[key.toString()];
        }
        else {
            return fallback;
        }
    };
    return AWDProperties;
})();
/**
 *
 */
var BitFlags = (function () {
    function BitFlags() {
    }
    BitFlags.test = function (flags, testFlag) {
        return (flags & testFlag) == testFlag;
    };
    BitFlags.FLAG1 = 1;
    BitFlags.FLAG2 = 2;
    BitFlags.FLAG3 = 4;
    BitFlags.FLAG4 = 8;
    BitFlags.FLAG5 = 16;
    BitFlags.FLAG6 = 32;
    BitFlags.FLAG7 = 64;
    BitFlags.FLAG8 = 128;
    BitFlags.FLAG9 = 256;
    BitFlags.FLAG10 = 512;
    BitFlags.FLAG11 = 1024;
    BitFlags.FLAG12 = 2048;
    BitFlags.FLAG13 = 4096;
    BitFlags.FLAG14 = 8192;
    BitFlags.FLAG15 = 16384;
    BitFlags.FLAG16 = 32768;
    return BitFlags;
})();
module.exports = AWDParser;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXJzZXJzL0FXRFBhcnNlci50cyJdLCJuYW1lcyI6WyJBV0RQYXJzZXIiLCJBV0RQYXJzZXIuY29uc3RydWN0b3IiLCJBV0RQYXJzZXIuc3VwcG9ydHNUeXBlIiwiQVdEUGFyc2VyLnN1cHBvcnRzRGF0YSIsIkFXRFBhcnNlci5faVJlc29sdmVEZXBlbmRlbmN5IiwiQVdEUGFyc2VyLl9pUmVzb2x2ZURlcGVuZGVuY3lGYWlsdXJlIiwiQVdEUGFyc2VyLl9pUmVzb2x2ZURlcGVuZGVuY3lOYW1lIiwiQVdEUGFyc2VyLl9wUHJvY2VlZFBhcnNpbmciLCJBV0RQYXJzZXIuX3BTdGFydFBhcnNpbmciLCJBV0RQYXJzZXIuZGlzcG9zZSIsIkFXRFBhcnNlci5wYXJzZU5leHRCbG9jayIsIkFXRFBhcnNlci5wYXJzZVNoYXBlMkQiLCJBV0RQYXJzZXIucGFyc2VTaGFwZTJERmlsbCIsIkFXRFBhcnNlci5wYXJzZVRpbWVMaW5lIiwiQVdEUGFyc2VyLnBhcnNlVHJpYW5nbGVHZW9tZXRyaWVCbG9jayIsIkFXRFBhcnNlci5wYXJzZVByaW1pdHZlcyIsIkFXRFBhcnNlci5wYXJzZUNvbnRhaW5lciIsIkFXRFBhcnNlci5wYXJzZU1lc2hJbnN0YW5jZSIsIkFXRFBhcnNlci5wYXJzZVNreWJveEluc3RhbmNlIiwiQVdEUGFyc2VyLnBhcnNlTGlnaHQiLCJBV0RQYXJzZXIucGFyc2VDYW1lcmEiLCJBV0RQYXJzZXIucGFyc2VMaWdodFBpY2tlciIsIkFXRFBhcnNlci5wYXJzZU1hdGVyaWFsIiwiQVdEUGFyc2VyLnBhcnNlTWF0ZXJpYWxfdjEiLCJBV0RQYXJzZXIucGFyc2VUZXh0dXJlIiwiQVdEUGFyc2VyLnBhcnNlQ3ViZVRleHR1cmUiLCJBV0RQYXJzZXIucGFyc2VTaGFyZWRNZXRob2RCbG9jayIsIkFXRFBhcnNlci5wYXJzZVNoYWRvd01ldGhvZEJsb2NrIiwiQVdEUGFyc2VyLnBhcnNlQ29tbWFuZCIsIkFXRFBhcnNlci5wYXJzZU1ldGFEYXRhIiwiQVdEUGFyc2VyLnBhcnNlTmFtZVNwYWNlIiwiQVdEUGFyc2VyLnBhcnNlU2hhZG93TWV0aG9kTGlzdCIsIkFXRFBhcnNlci5wYXJzZVNrZWxldG9uIiwiQVdEUGFyc2VyLnBhcnNlU2tlbGV0b25Qb3NlIiwiQVdEUGFyc2VyLnBhcnNlU2tlbGV0b25BbmltYXRpb24iLCJBV0RQYXJzZXIucGFyc2VNZXNoUG9zZUFuaW1hdGlvbiIsIkFXRFBhcnNlci5wYXJzZVZlcnRleEFuaW1hdGlvblNldCIsIkFXRFBhcnNlci5wYXJzZUFuaW1hdG9yU2V0IiwiQVdEUGFyc2VyLnBhcnNlU2hhcmVkTWV0aG9kTGlzdCIsIkFXRFBhcnNlci5wYXJzZVVzZXJBdHRyaWJ1dGVzIiwiQVdEUGFyc2VyLnBhcnNlUHJvcGVydGllcyIsIkFXRFBhcnNlci5wYXJzZUF0dHJWYWx1ZSIsIkFXRFBhcnNlci5wYXJzZUhlYWRlciIsIkFXRFBhcnNlci5nZXRVVkZvclZlcnRleEFuaW1hdGlvbiIsIkFXRFBhcnNlci5wYXJzZVZhclN0ciIsIkFXRFBhcnNlci5nZXRBc3NldEJ5SUQiLCJBV0RQYXJzZXIuZ2V0RGVmYXVsdEFzc2V0IiwiQVdEUGFyc2VyLmdldERlZmF1bHRNYXRlcmlhbCIsIkFXRFBhcnNlci5nZXREZWZhdWx0VGV4dHVyZSIsIkFXRFBhcnNlci5nZXREZWZhdWx0Q3ViZVRleHR1cmUiLCJBV0RQYXJzZXIucmVhZE51bWJlciIsIkFXRFBhcnNlci5wYXJzZU1hdHJpeDNEIiwiQVdEUGFyc2VyLnBhcnNlTWF0cml4MzJSYXdEYXRhIiwiQVdEUGFyc2VyLnBhcnNlTWF0cml4NDNSYXdEYXRhIiwiQVdEQmxvY2siLCJBV0RCbG9jay5jb25zdHJ1Y3RvciIsIkFXREJsb2NrLmRpc3Bvc2UiLCJBV0RCbG9jay5hZGRFcnJvciIsIkFXRFByb3BlcnRpZXMiLCJBV0RQcm9wZXJ0aWVzLmNvbnN0cnVjdG9yIiwiQVdEUHJvcGVydGllcy5zZXQiLCJBV0RQcm9wZXJ0aWVzLmdldCIsIkJpdEZs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SUFBSUEsR0FBR0EsSUFBSUEsRUFBRUEsaUNBQWlDQTtRQUU5REEsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsSUFBSUEsS0FBS0EsRUFBVUEsRUFBRUEsOENBQThDQTtRQUN2RkEsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDekNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ3RDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUN4Q0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDekNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO1FBQzdDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUN4Q0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7UUFDNUNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1FBQ3pDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUN4Q0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDMUNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1FB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QUFDQSxZQUFZQSxDQUFDQSxDQUFDQTt3QkFDMUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBO3dCQUN2Q0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7d0JBQ3ZDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTt3QkFDdkNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBO3dCQUN2Q0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7d0JBQ3ZDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTt3QkFFdkNBLEFBQ0FBLDhGQUQ4RkE7d0JBQzlGQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDVkEsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7NEJBQ2ZBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBOzRCQUNuQkEsS0FBS0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7NEJBQ2pCQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTs0QkFDZkEsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7NEJBQ25CQSxLQUFLQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTs0QkFDakJBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBOzRC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QUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDL0pBLEtBQUtBLENBQUNBO1lBRVBBLEtBQUtBLENBQUNBO2dCQUNMQSxNQUFNQSxHQUFHQSxJQUFJQSxtQkFBbUJBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUMvS0EsS0FBS0EsQ0FBQ0E7WUFFUEEsS0FBS0EsQ0FBQ0E7Z0JBQ0xBLE1BQU1BLEdBQUdBLElBQUlBLHFCQUFxQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3JIQSxLQUFLQSxDQUFDQTtZQUVQQSxLQUFLQSxDQUFDQTtnQkFDTEEsTUFBTUEsR0FBR0EsSUFBSUEsdUJBQXVCQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxFQUFFQSx1Q0FBdUNBO2dCQUNuTUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ0NBLE1BQU9BLENBQUNBLFNBQVNBLEdBQUdBLEtBQUtBLENBQUNBO2dCQUNyREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ0NBLE1BQU9BLENBQUNBLFlBQVlBLEdBQUdBLEtBQUtBLENBQUNBO2dCQUN4REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ0NBLE1BQU9BLENBQUNBLEdBQUdBLEdBQUdBLEtBQUtBLENBQUNBO2dCQUUvQ0EsS0FBS0EsQ0FBQ0E7WUFFUEEsS0FBS0EsQ0FBQ0E7Z0JBQ0xBLE1BQU1BLEdBQUdBLElBQUlBLG1CQUFtQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzdKQSxLQUFLQSxDQUFDQTtZQUVQQSxLQUFLQSxDQUFDQTtnQkFDTEEsTUFBTUEsR0FBR0EsSUFBSUEsc0JBQXNCQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxHQUFHQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDM0lBLEtBQUtBLENBQUNBO1lBRVBBLEtBQUtBLENBQUNBO2dCQUNMQSxNQUFNQSxHQUFHQSxJQUFJQSxvQkFBb0JBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUN2SUEsS0FBS0EsQ0FBQ0E7WUFFUEE7Z0JBQ0NBLE1BQU1BLEdBQUdBLElBQUlBLFVBQVVBLEVBQUVBLENBQUNBO2dCQUMxQkEsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsZ0NBQWdDQSxDQUFDQSxDQUFDQTtnQkFDOUNBLEtBQUtBLENBQUNBO1FBQ1JBLENBQUNBO1FBRURBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBRzNEQSxDQUFDQTtRQUVEQSxJQUFJQSxDQUFDQSxtQkFBbUJBLEVBQUVBLENBQUNBO1FBQzNCQSxNQUFNQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUNuQkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDbkNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLElBQUlBLEdBQUdBLE1BQU1BLENBQUNBO1FBRXBDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFD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QUNBO1FBRTlCQSxJQUFJQSxtQkFBbUJBLEdBQWNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLEVBQUVBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUFBO1FBRXRIQSxFQUFFQSxDQUFDQSxDQUFDQSxtQkFBbUJBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzVCQSxJQUFJQSxJQUFJQSxHQUFtREEsbUJBQW1CQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNsRkEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDcEJBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBO1FBQ3hCQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN2QkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsdUNBQXVDQSxDQUFDQSxDQUFDQTtRQUN6RUEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDUEEsQUFDQUEsNkJBRDZCQTtZQUNIQSxJQUFJQSxDQUFDQSxTQUFVQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUMxREEsQ0FBQ0E7UUFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsSUFBSUEsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDekRBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQzlCQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNqQ0EsSUFBSUEsQ0FBUUEsQ0FBQ0E7WUFJYkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7Z0JBQzVDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxRQUFRQSxHQUFHQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMzRUEsQ0FBQ0E7UUFDRkEsQ0FBQ0E7UUFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeERBLElBQUlBLEtBQUtBLEdBQWlCQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxFQUFDQSxDQUFDQSxFQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQSxFQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQSxFQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUFDQSxDQUFDQSxDQUFDQTtZQUN4SkEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsUUFBUUEsQ0FBU0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBVUEsS0FB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QUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDM0RBLEtBQUtBLENBQUNBO1lBQ1BBLEtBQUtBLElBQUlBO2dCQUNSQSxVQUFVQSxHQUFHQSxJQUFJQSxzQkFBc0JBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUM3REEsS0FBS0EsQ0FBQ0E7WUFDUEEsS0FBS0EsSUFBSUE7Z0JBQ1JBLFVBQVVBLEdBQUdBLElBQUlBLCtCQUErQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3ZJQSxLQUFLQSxDQUFDQTtZQUNQQTtnQkFDQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EscUJBQXFCQSxDQUFDQSxDQUFDQTtnQkFDbkNBLE1BQU1BLENBQUNBO1FBQ1RBLENBQUNBO1FBRURBLElBQUlBLE1BQU1BLEdBQVVBLElBQUlBLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO1FBQzNDQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQSxRQUFRQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUVoQ0EsSUFBSUEsbUJBQW1CQSxHQUFjQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxTQUFTQSxDQUFDQSxTQUFTQSxFQUFFQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFBQTtRQUV0SEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUU1QkEsSUFBSUEsSUFBSUEsR0FBbURBLG1CQUFtQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbEZBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1lBRXRCQSxVQUFVQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUV4QkEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdkJBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLHlDQUF5Q0EsQ0FBQ0EsQ0FBQ0E7UUFDM0VBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ1BBLEFBQ0FBLDZCQUQ2QkE7WUFDSEEsSUFBSUEsQ0FBQ0EsU0FBVUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDNURBLENBQUNBO1FBRURBLE1BQU1BLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO1FBQ25CQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxFQUFDQSxDQUFDQSxFQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQSxFQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQSxFQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFDQSxDQUFDQSxDQUFDQTtRQUNwSEEsTUFBTUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FB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LEVBQUVBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEVBQUVBLEVBQUNBLFNBQVNBLENBQUNBLElBQUlBLEVBQUVBLEVBQUVBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEVBQUVBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEVBQUVBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLEVBQUVBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEVBQUVBLEVBQUNBLElBQUlBLENBQUNBLFlBQVlBLEVBQUVBLEVBQUVBLEVBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLEVBQUVBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUVBLEVBQUVBLEVBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEVBQUNBLENBQUNBLENBQUNBO1FBQ25kQSxJQUFJQSxXQUFXQSxHQUFVQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUN6Q0EsSUFBSUEsV0FBV0EsR0FBVUEsRUFBRUEsQ0FBQ0E7UUFFNUJBLEVBQUVBLENBQUNBLENBQUNBLFdBQVdBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3RCQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSx3QkFBd0JBLEdBQUdBLFdBQVdBLEdBQUdBLDZEQUE2REEsQ0FBQ0EsQ0FBQ0E7WUFDdklBLE1BQU1BLENBQUNBO1FBQ1JBLENBQUNBO1FBRURBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLElBQUlBLENBQUNBLENBQUNBO1lBQzFCQSxXQUFXQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNqQkEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLFdBQVdBLEdBQUdBLENBQUNBLENBQUNBO1FBRWpCQSxFQUFFQSxDQUFD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LENBQUNBLENBQUNBO1lBQzlCQSxHQUFHQSxDQUFDQSxhQUFhQSxHQUFHQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxRQUFRQSxDQUFDQSxDQUFDQTtZQUU1Q0EsSUFBSUEsY0FBY0EsR0FBVUEsQ0FBQ0EsQ0FBQ0E7WUFDOUJBLElBQUlBLFFBQWVBLENBQUNBO1lBRXBCQSxPQUFPQSxjQUFjQSxHQUFHQSxXQUFXQSxFQUFFQSxDQUFDQTtnQkFDckNBLElBQUlBLFdBQWtCQSxDQUFDQTtnQkFDdkJBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGlCQUFpQkEsRUFBRUEsQ0FBQ0E7Z0JBRXREQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxFQUFDQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxHQUFHQSxFQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxHQUFHQSxFQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxHQUFHQSxFQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFT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R0EsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7UUFFaERBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQ3hCQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUN4REEsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFFOUJBLEFBQ0FBLFdBRFdBO1lBQ1hBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNmQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxlQUFlQSxFQUFFQSxDQUFDQTtnQkFDakRBLElBQUlBLEdBQVVBLENBQUNBO2dCQUNmQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxZQUFZQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtnQkFFakRBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLFFBQVFBLEVBQUVBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLEVBQUVBLElBQUlBLFVBQVVBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEtBQUtBLEVBQUVBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1lBQ3ZHQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFFUEEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0E7Z0JBQ2pEQSxJQUFJQSxJQUFjQSxDQUFDQTtnQkFDbkJBLElBQUlBLEdBQUdBLElBQUlBLFNBQVNBLEVBQUVBLENBQUNBO2dCQUV2QkEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsU0FB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QUFLQSxDQUFDQSxDQUFDQTtnQkFDdEVBLEtBQUtBLENBQUNBO1lBRVBBLEtBQUtBLElBQUlBO2dCQUdSQSxZQUFZQSxHQUFHQSxJQUFJQSxvQkFBb0JBLENBQW9CQSxLQUFLQSxFQUFXQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdEVBLFlBQWFBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUN4Q0EsWUFBYUEsQ0FBQ0EsT0FBT0EsR0FBR0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzlDQSxZQUFhQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFFaEVBLEtBQUtBLENBQUNBO1lBQ1BBLEtBQUtBLElBQUlBO2dCQUVSQSxZQUFZQSxHQUFHQSxJQUFJQSxnQkFBZ0JBLENBQW9CQSxLQUFLQSxFQUFXQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdEVBLFlBQWFBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUN4Q0EsWUFBYUEsQ0FBQ0EsT0FBT0EsR0FBR0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzlDQSxZQUFhQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFFNURBLEtBQUtBLENBQUNBO1lBQ1BBLEtBQUtBLElBQUlBO2dCQUNSQSxZQUFZQSxHQUFHQSxJQUFJQSxnQkFB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N0JBLFVBQThCQSxPQUFjQTtRQUczQ3NDLElBQUlBLFVBQVVBLEdBQVVBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGlCQUFpQkEsRUFBRUEsQ0FBQ0E7UUFDaEVBLElBQUlBLGtCQUFtQ0EsQ0FBQ0E7UUFFeENBLElBQUlBLEtBQUtBLEdBQWlCQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxFQUFDQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxHQUFHQSxFQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxHQUFHQSxFQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxHQUFHQSxFQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxHQUFHQSxFQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxHQUFHQSxFQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxHQUFHQSxFQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxHQUFHQSxFQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUFFQSxHQUFHQSxFQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxFQUFDQSxDQUFDQSxDQUFD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R0FBNUJBO1FBRUNxRCxJQUFJQSxPQUFPQSxHQUFpQkEsSUFBSUEsS0FBS0EsQ0FBU0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7UUFFbERBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBQ25EQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQTtRQUNuREEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7UUFDbkRBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO1FBQ2pCQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQTtRQUNuREEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7UUFDbkRBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBQ25EQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUNqQkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7UUFDbkRBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBQ25EQSxPQUFPQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQTtRQUNwREEsT0FBT0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7UUFDbEJBLE9BQU9BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBQ3BEQSxPQUFPQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQTtRQUNwREEsT0FBT0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7UUFDcERBLE9BQU9BLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO1FBRWxCQSxBQUVBQSwwRUFGMEVBO1FBRTFFQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN2QkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDZkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDZkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDZkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDZkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDZkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDZkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7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QUlBLENBQUNBO0lBQ3JCQSxlQUFNQSxHQUFVQSxJQUFJQSxDQUFDQTtJQUNyQkEsZUFBTUEsR0FBVUEsS0FBS0EsQ0FBQ0E7SUFDdEJBLGVBQU1BLEdBQVVBLEtBQUtBLENBQUNBO0lBTXJDQSxlQUFDQTtBQUFEQSxDQXZCQSxBQXVCQ0EsSUFBQTtBQWhGRCxpQkFBUyxTQUFTLENBQUMiLCJmaWxlIjoicGFyc2Vycy9BV0RQYXJzZXIuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJpdG1hcERhdGFcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvYmFzZS9CaXRtYXBEYXRhXCIpO1xuaW1wb3J0IENvbG9yVHJhbnNmb3JtXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL0NvbG9yVHJhbnNmb3JtXCIpO1xuaW1wb3J0IE1hdHJpeDNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFwiKTtcbmltcG9ydCBWZWN0b3IzRFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIik7XG5pbXBvcnQgVVJMTG9hZGVyRGF0YUZvcm1hdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxMb2FkZXJEYXRhRm9ybWF0XCIpO1xuaW1wb3J0IFVSTFJlcXVlc3RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTFJlcXVlc3RcIik7XG5pbXBvcnQgQXNzZXRUeXBlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvQXNzZXRUeXBlXCIpO1xuaW1wb3J0IElBc3NldFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvSUFzc2V0XCIpO1xuaW1wb3J0IFBhcnNlckJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcGFyc2Vycy9QYXJzZXJCYXNlXCIpO1xuaW1wb3J0IFBhcnNlclV0aWxzXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3BhcnNlcnMvUGFyc2VyVXRpbHNcIik7XG5pbXBvcnQgUmVzb3VyY2VEZXBlbmRlbmN5XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcGFyc2Vycy9SZXNvdXJjZURlcGVuZGVuY3lcIik7XG5pbXBvcnQgUHJvamVjdGlvbkJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3Byb2plY3Rpb25zL1Byb2plY3Rpb25CYXNlXCIpO1xuaW1wb3J0IFBlcnNwZWN0aXZlUHJvamVjdGlvblx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wcm9qZWN0aW9ucy9QZXJzcGVjdGl2ZVByb2plY3Rpb25cIik7XG5pbXBvcnQgT3J0aG9ncmFwaGljUHJvamVjdGlvblx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wcm9qZWN0aW9ucy9PcnRob2dyYXBoaWNQcm9qZWN0aW9uXCIpO1xuaW1wb3J0IE9ydGhvZ3JhcGhpY09mZkNlbnRlclByb2plY3Rpb25cdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wcm9qZWN0aW9ucy9PcnRob2dyYXBoaWNPZmZDZW50ZXJQcm9qZWN0aW9uXCIpO1xuaW1wb3J0IEJpdG1hcEN1YmVUZXh0dXJlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvQml0bWFwQ3ViZVRleHR1cmVcIik7XG5pbXBvcnQgQml0bWFwVGV4dHVyZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvQml0bWFwVGV4dHVyZVwiKTtcbmltcG9ydCBDdWJlVGV4dHVyZUJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL0N1YmVUZXh0dXJlQmFzZVwiKTtcbmltcG9ydCBJbWFnZUN1YmVUZXh0dXJlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9JbWFnZUN1YmVUZXh0dXJlXCIpO1xuaW1wb3J0IEltYWdlVGV4dHVyZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9JbWFnZVRleHR1cmVcIik7XG5pbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZTJEQmFzZVwiKTtcbmltcG9ydCBUZXh0dXJlUHJveHlCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9UZXh0dXJlUHJveHlCYXNlXCIpO1xuaW1wb3J0IEJ5dGVBcnJheVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9CeXRlQXJyYXlcIik7XG5cbmltcG9ydCBEaXNwbGF5T2JqZWN0Q29udGFpbmVyXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2NvbnRhaW5lcnMvRGlzcGxheU9iamVjdENvbnRhaW5lclwiKTtcbmltcG9ydCBCbGVuZE1vZGVcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9CbGVuZE1vZGVcIik7XG5pbXBvcnQgRGlzcGxheU9iamVjdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9EaXNwbGF5T2JqZWN0XCIpO1xuaW1wb3J0IEdlb21ldHJ5XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9HZW9tZXRyeVwiKTtcbmltcG9ydCBMaWdodEJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9MaWdodEJhc2VcIik7XG5pbXBvcnQgVHJpYW5nbGVTdWJHZW9tZXRyeVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvVHJpYW5nbGVTdWJHZW9tZXRyeVwiKTtcbmltcG9ydCBEaXJlY3Rpb25hbExpZ2h0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9EaXJlY3Rpb25hbExpZ2h0XCIpO1xuaW1wb3J0IFBvaW50TGlnaHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvUG9pbnRMaWdodFwiKTtcbmltcG9ydCBDYW1lcmFcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9DYW1lcmFcIik7XG5pbXBvcnQgTWVzaFx0XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvTWVzaFwiKTtcbmltcG9ydCBTa3lib3hcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9Ta3lib3hcIik7XG5pbXBvcnQgTWF0ZXJpYWxCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9NYXRlcmlhbEJhc2VcIik7XG5pbXBvcnQgTGlnaHRQaWNrZXJCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9tYXRlcmlhbHMvbGlnaHRwaWNrZXJzL0xpZ2h0UGlja2VyQmFzZVwiKTtcbmltcG9ydCBTdGF0aWNMaWdodFBpY2tlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9saWdodHBpY2tlcnMvU3RhdGljTGlnaHRQaWNrZXJcIik7XG5pbXBvcnQgQ3ViZU1hcFNoYWRvd01hcHBlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9zaGFkb3dtYXBwZXJzL0N1YmVNYXBTaGFkb3dNYXBwZXJcIik7XG5pbXBvcnQgRGlyZWN0aW9uYWxTaGFkb3dNYXBwZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL3NoYWRvd21hcHBlcnMvRGlyZWN0aW9uYWxTaGFkb3dNYXBwZXJcIik7XG5pbXBvcnQgU2hhZG93TWFwcGVyQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL3NoYWRvd21hcHBlcnMvU2hhZG93TWFwcGVyQmFzZVwiKTtcbmltcG9ydCBQcmVmYWJCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJlZmFiQmFzZVwiKTtcbmltcG9ydCBQcmltaXRpdmVDYXBzdWxlUHJlZmFiXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlQ2Fwc3VsZVByZWZhYlwiKTtcbmltcG9ydCBQcmltaXRpdmVDb25lUHJlZmFiXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcHJlZmFicy9QcmltaXRpdmVDb25lUHJlZmFiXCIpO1xuaW1wb3J0IFByaW1pdGl2ZUN1YmVQcmVmYWJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wcmVmYWJzL1ByaW1pdGl2ZUN1YmVQcmVmYWJcIik7XG5pbXBvcnQgUHJpbWl0aXZlQ3lsaW5kZXJQcmVmYWJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcHJlZmFicy9QcmltaXRpdmVDeWxpbmRlclByZWZhYlwiKTtcbmltcG9ydCBQcmltaXRpdmVQbGFuZVByZWZhYlx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlUGxhbmVQcmVmYWJcIik7XG5pbXBvcnQgUHJpbWl0aXZlU3BoZXJlUHJlZmFiXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlU3BoZXJlUHJlZmFiXCIpO1xuaW1wb3J0IFByaW1pdGl2ZVRvcnVzUHJlZmFiXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcHJlZmFicy9QcmltaXRpdmVUb3J1c1ByZWZhYlwiKTtcblxuaW1wb3J0IEFuaW1hdGlvblNldEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9BbmltYXRpb25TZXRCYXNlXCIpO1xuaW1wb3J0IEFuaW1hdG9yQmFzZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvQW5pbWF0b3JCYXNlXCIpO1xuaW1wb3J0IFZlcnRleEFuaW1hdGlvblNldFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9WZXJ0ZXhBbmltYXRpb25TZXRcIik7XG5pbXBvcnQgVmVydGV4QW5pbWF0b3JcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9WZXJ0ZXhBbmltYXRvclwiKTtcbmltcG9ydCBTa2VsZXRvbkFuaW1hdGlvblNldFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9Ta2VsZXRvbkFuaW1hdGlvblNldFwiKTtcbmltcG9ydCBTa2VsZXRvbkFuaW1hdG9yXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvU2tlbGV0b25BbmltYXRvclwiKTtcbmltcG9ydCBKb2ludFBvc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvSm9pbnRQb3NlXCIpO1xuaW1wb3J0IFNrZWxldG9uXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvU2tlbGV0b25cIik7XG5pbXBvcnQgU2tlbGV0b25Qb3NlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1NrZWxldG9uUG9zZVwiKTtcbmltcG9ydCBTa2VsZXRvbkpvaW50XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Ta2VsZXRvbkpvaW50XCIpO1xuaW1wb3J0IFNrZWxldG9uQ2xpcE5vZGVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9ub2Rlcy9Ta2VsZXRvbkNsaXBOb2RlXCIpO1xuaW1wb3J0IFZlcnRleENsaXBOb2RlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvVmVydGV4Q2xpcE5vZGVcIik7XG5pbXBvcnQgU2t5Ym94TWF0ZXJpYWxcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9Ta3lib3hNYXRlcmlhbFwiKTtcbmltcG9ydCBUcmlhbmdsZU1hdGVyaWFsTW9kZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9UcmlhbmdsZU1hdGVyaWFsTW9kZVwiKTtcbmltcG9ydCBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9UcmlhbmdsZU1ldGhvZE1hdGVyaWFsXCIpO1xuaW1wb3J0IERlZmF1bHRNYXRlcmlhbE1hbmFnZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL3V0aWxzL0RlZmF1bHRNYXRlcmlhbE1hbmFnZXJcIik7XG5pbXBvcnQgQW1iaWVudEVudk1hcE1ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0FtYmllbnRFbnZNYXBNZXRob2RcIik7XG5pbXBvcnQgRGlmZnVzZURlcHRoTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRGlmZnVzZURlcHRoTWV0aG9kXCIpO1xuaW1wb3J0IERpZmZ1c2VDZWxNZXRob2RcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0RpZmZ1c2VDZWxNZXRob2RcIik7XG5pbXBvcnQgRGlmZnVzZUdyYWRpZW50TWV0aG9kXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0RpZmZ1c2VHcmFkaWVudE1ldGhvZFwiKTtcbmltcG9ydCBEaWZmdXNlTGlnaHRNYXBNZXRob2RcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRGlmZnVzZUxpZ2h0TWFwTWV0aG9kXCIpO1xuaW1wb3J0IERpZmZ1c2VXcmFwTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRGlmZnVzZVdyYXBNZXRob2RcIik7XG5pbXBvcnQgRWZmZWN0QWxwaGFNYXNrTWV0aG9kXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0VmZmVjdEFscGhhTWFza01ldGhvZFwiKTtcbmltcG9ydCBFZmZlY3RDb2xvck1hdHJpeE1ldGhvZFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9FZmZlY3RDb2xvck1hdHJpeE1ldGhvZFwiKTtcbmltcG9ydCBFZmZlY3RDb2xvclRyYW5zZm9ybU1ldGhvZFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRWZmZWN0Q29sb3JUcmFuc2Zvcm1NZXRob2RcIik7XG5pbXBvcnQgRWZmZWN0RW52TWFwTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRWZmZWN0RW52TWFwTWV0aG9kXCIpO1xuaW1wb3J0IEVmZmVjdEZvZ01ldGhvZFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRWZmZWN0Rm9nTWV0aG9kXCIpO1xuaW1wb3J0IEVmZmVjdEZyZXNuZWxFbnZNYXBNZXRob2RcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL0VmZmVjdEZyZXNuZWxFbnZNYXBNZXRob2RcIik7XG5pbXBvcnQgRWZmZWN0TGlnaHRNYXBNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9FZmZlY3RMaWdodE1hcE1ldGhvZFwiKTtcbmltcG9ydCBFZmZlY3RNZXRob2RCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9FZmZlY3RNZXRob2RCYXNlXCIpO1xuaW1wb3J0IEVmZmVjdFJpbUxpZ2h0TWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRWZmZWN0UmltTGlnaHRNZXRob2RcIik7XG5pbXBvcnQgTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2RcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2RcIik7XG5pbXBvcnQgU2hhZG93RGl0aGVyZWRNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9TaGFkb3dEaXRoZXJlZE1ldGhvZFwiKTtcbmltcG9ydCBTaGFkb3dGaWx0ZXJlZE1ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL1NoYWRvd0ZpbHRlcmVkTWV0aG9kXCIpO1xuaW1wb3J0IFNoYWRvd01ldGhvZEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL1NoYWRvd01ldGhvZEJhc2VcIik7XG5pbXBvcnQgU3BlY3VsYXJGcmVzbmVsTWV0aG9kXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL1NwZWN1bGFyRnJlc25lbE1ldGhvZFwiKTtcbmltcG9ydCBTaGFkb3dIYXJkTWV0aG9kXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9TaGFkb3dIYXJkTWV0aG9kXCIpO1xuaW1wb3J0IFNwZWN1bGFyQW5pc290cm9waWNNZXRob2RcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL1NwZWN1bGFyQW5pc290cm9waWNNZXRob2RcIik7XG5pbXBvcnQgU3BlY3VsYXJDZWxNZXRob2RcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9TcGVjdWxhckNlbE1ldGhvZFwiKTtcbmltcG9ydCBTcGVjdWxhclBob25nTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvU3BlY3VsYXJQaG9uZ01ldGhvZFwiKTtcbmltcG9ydCBTaGFkb3dOZWFyTWV0aG9kXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9TaGFkb3dOZWFyTWV0aG9kXCIpO1xuaW1wb3J0IFNoYWRvd1NvZnRNZXRob2RcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL1NoYWRvd1NvZnRNZXRob2RcIik7XG5cbmltcG9ydCBUaW1lTGluZSA9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvVGltZUxpbmVcIik7XG5pbXBvcnQgVGltZUxpbmVGcmFtZSA9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvdGltZWxpbmVkYXRhL1RpbWVMaW5lRnJhbWVcIik7XG5pbXBvcnQgVGltZUxpbmVPYmplY3QgPSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL3RpbWVsaW5lZGF0YS9UaW1lTGluZU9iamVjdFwiKTtcbmltcG9ydCBGcmFtZUNvbW1hbmQgPSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL3RpbWVsaW5lZGF0YS9GcmFtZUNvbW1hbmRcIik7XG5pbXBvcnQgQ29tbWFuZFByb3BzRGlzcGxheU9iamVjdCA9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvdGltZWxpbmVkYXRhL0NvbW1hbmRQcm9wc0Rpc3BsYXlPYmplY3RcIik7XG5cbi8qKlxuICogQVdEUGFyc2VyIHByb3ZpZGVzIGEgcGFyc2VyIGZvciB0aGUgQVdEIGRhdGEgdHlwZS5cbiAqL1xuY2xhc3MgQVdEUGFyc2VyIGV4dGVuZHMgUGFyc2VyQmFzZVxue1xuXHQvL3NldCB0byBcInRydWVcIiB0byBoYXZlIHNvbWUgY29uc29sZS5sb2dzIGluIHRoZSBDb25zb2xlXG5cdHByaXZhdGUgX2RlYnVnOmJvb2xlYW4gPSBmYWxzZTtcblx0cHJpdmF0ZSBfYnl0ZURhdGE6Qnl0ZUFycmF5O1xuXHRwcml2YXRlIF9zdGFydGVkUGFyc2luZzpib29sZWFuID0gZmFsc2U7XG5cdHByaXZhdGUgX2N1cl9ibG9ja19pZDpudW1iZXI7XG5cdHByaXZhdGUgX2Jsb2NrczpBcnJheTxBV0RCbG9jaz47XG5cdHByaXZhdGUgX25ld0Jsb2NrQnl0ZXM6Qnl0ZUFycmF5O1xuXHRwcml2YXRlIF92ZXJzaW9uOkFycmF5PG51bWJlcj47XG5cdHByaXZhdGUgX2NvbXByZXNzaW9uOm51bWJlcjtcblx0cHJpdmF0ZSBfYWNjdXJhY3lPbkJsb2Nrczpib29sZWFuO1xuXHRwcml2YXRlIF9hY2N1cmFjeU1hdHJpeDpib29sZWFuO1xuXHRwcml2YXRlIF9hY2N1cmFjeUdlbzpib29sZWFuO1xuXHRwcml2YXRlIF9hY2N1cmFjeVByb3BzOmJvb2xlYW47XG5cdHByaXZhdGUgX21hdHJpeE5yVHlwZTpudW1iZXI7XG5cdHByaXZhdGUgX2dlb05yVHlwZTpudW1iZXI7XG5cdHByaXZhdGUgX3Byb3BzTnJUeXBlOm51bWJlcjtcblx0cHJpdmF0ZSBfc3RyZWFtaW5nOmJvb2xlYW47XG5cdHByaXZhdGUgX3RleHR1cmVfdXNlcnM6T2JqZWN0ID0ge307XG5cdHByaXZhdGUgX3BhcnNlZF9oZWFkZXI6Ym9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIF9ib2R5OkJ5dGVBcnJheTtcblx0cHJpdmF0ZSBfZGVmYXVsdFRleHR1cmU6Qml0bWFwVGV4dHVyZTsgICAgIC8vIEhUTUwgSU1BR0UgVEVYVFVSRSA+PyAhXG5cdHByaXZhdGUgX2N1YmVUZXh0dXJlczpBcnJheTxhbnk+O1xuXHRwcml2YXRlIF9kZWZhdWx0Qml0bWFwTWF0ZXJpYWw6VHJpYW5nbGVNZXRob2RNYXRlcmlhbDtcblx0cHJpdmF0ZSBfZGVmYXVsdEN1YmVUZXh0dXJlOkJpdG1hcEN1YmVUZXh0dXJlO1xuXG5cdHB1YmxpYyBzdGF0aWMgQ09NUFJFU1NJT05NT0RFX0xaTUE6c3RyaW5nID0gXCJsem1hXCI7XG5cdHB1YmxpYyBzdGF0aWMgVU5DT01QUkVTU0VEOm51bWJlciA9IDA7XG5cdHB1YmxpYyBzdGF0aWMgREVGTEFURTpudW1iZXIgPSAxO1xuXHRwdWJsaWMgc3RhdGljIExaTUE6bnVtYmVyID0gMjtcblx0cHVibGljIHN0YXRpYyBJTlQ4Om51bWJlciA9IDE7XG5cdHB1YmxpYyBzdGF0aWMgSU5UMTY6bnVtYmVyID0gMjtcblx0cHVibGljIHN0YXRpYyBJTlQzMjpudW1iZXIgPSAzO1xuXHRwdWJsaWMgc3RhdGljIFVJTlQ4Om51bWJlciA9IDQ7XG5cdHB1YmxpYyBzdGF0aWMgVUlOVDE2Om51bWJlciA9IDU7XG5cdHB1YmxpYyBzdGF0aWMgVUlOVDMyOm51bWJlciA9IDY7XG5cdHB1YmxpYyBzdGF0aWMgRkxPQVQzMjpudW1iZXIgPSA3O1xuXHRwdWJsaWMgc3RhdGljIEZMT0FUNjQ6bnVtYmVyID0gODtcblx0cHVibGljIHN0YXRpYyBCT09MOm51bWJlciA9IDIxO1xuXHRwdWJsaWMgc3RhdGljIENPTE9SOm51bWJlciA9IDIyO1xuXHRwdWJsaWMgc3RhdGljIEJBRERSOm51bWJlciA9IDIzO1xuXHRwdWJsaWMgc3RhdGljIEFXRFNUUklORzpudW1iZXIgPSAzMTtcblx0cHVibGljIHN0YXRpYyBBV0RCWVRFQVJSQVk6bnVtYmVyID0gMzI7XG5cdHB1YmxpYyBzdGF0aWMgVkVDVE9SMngxOm51bWJlciA9IDQxO1xuXHRwdWJsaWMgc3RhdGljIFZFQ1RPUjN4MTpudW1iZXIgPSA0Mjtcblx0cHVibGljIHN0YXRpYyBWRUNUT1I0eDE6bnVtYmVyID0gNDM7XG5cdHB1YmxpYyBzdGF0aWMgTVRYM3gyOm51bWJlciA9IDQ0O1xuXHRwdWJsaWMgc3RhdGljIE1UWDN4MzpudW1iZXIgPSA0NTtcblx0cHVibGljIHN0YXRpYyBNVFg0eDM6bnVtYmVyID0gNDY7XG5cdHB1YmxpYyBzdGF0aWMgTVRYNHg0Om51bWJlciA9IDQ3O1xuXG5cdHByaXZhdGUgYmxlbmRNb2RlRGljOkFycmF5PHN0cmluZz47XG5cdHByaXZhdGUgX2RlcHRoU2l6ZURpYzpBcnJheTxudW1iZXI+O1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IEFXRFBhcnNlciBvYmplY3QuXG5cdCAqIEBwYXJhbSB1cmkgVGhlIHVybCBvciBpZCBvZiB0aGUgZGF0YSBvciBmaWxlIHRvIGJlIHBhcnNlZC5cblx0ICogQHBhcmFtIGV4dHJhIFRoZSBob2xkZXIgZm9yIGV4dHJhIGNvbnRleHR1YWwgZGF0YSB0aGF0IHRoZSBwYXJzZXIgbWlnaHQgbmVlZC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKFVSTExvYWRlckRhdGFGb3JtYXQuQVJSQVlfQlVGRkVSKTtcblxuXHRcdHRoaXMuX2Jsb2NrcyA9IG5ldyBBcnJheTxBV0RCbG9jaz4oKTtcblx0XHR0aGlzLl9ibG9ja3NbMF0gPSBuZXcgQVdEQmxvY2soKTtcblx0XHR0aGlzLl9ibG9ja3NbMF0uZGF0YSA9IG51bGw7IC8vIFplcm8gYWRkcmVzcyBtZWFucyBudWxsIGluIEFXRFxuXG5cdFx0dGhpcy5ibGVuZE1vZGVEaWMgPSBuZXcgQXJyYXk8c3RyaW5nPigpOyAvLyB1c2VkIHRvIHRyYW5zbGF0ZSBpbnRzIHRvIGJsZW5kTW9kZS1zdHJpbmdzXG5cdFx0dGhpcy5ibGVuZE1vZGVEaWMucHVzaChCbGVuZE1vZGUuTk9STUFMKTtcblx0XHR0aGlzLmJsZW5kTW9kZURpYy5wdXNoKEJsZW5kTW9kZS5BREQpO1xuXHRcdHRoaXMuYmxlbmRNb2RlRGljLnB1c2goQmxlbmRNb2RlLkFMUEhBKTtcblx0XHR0aGlzLmJsZW5kTW9kZURpYy5wdXNoKEJsZW5kTW9kZS5EQVJLRU4pO1xuXHRcdHRoaXMuYmxlbmRNb2RlRGljLnB1c2goQmxlbmRNb2RlLkRJRkZFUkVOQ0UpO1xuXHRcdHRoaXMuYmxlbmRNb2RlRGljLnB1c2goQmxlbmRNb2RlLkVSQVNFKTtcblx0XHR0aGlzLmJsZW5kTW9kZURpYy5wdXNoKEJsZW5kTW9kZS5IQVJETElHSFQpO1xuXHRcdHRoaXMuYmxlbmRNb2RlRGljLnB1c2goQmxlbmRNb2RlLklOVkVSVCk7XG5cdFx0dGhpcy5ibGVuZE1vZGVEaWMucHVzaChCbGVuZE1vZGUuTEFZRVIpO1xuXHRcdHRoaXMuYmxlbmRNb2RlRGljLnB1c2goQmxlbmRNb2RlLkxJR0hURU4pO1xuXHRcdHRoaXMuYmxlbmRNb2RlRGljLnB1c2goQmxlbmRNb2RlLk1VTFRJUExZKTtcblx0XHR0aGlzLmJsZW5kTW9kZURpYy5wdXNoKEJsZW5kTW9kZS5OT1JNQUwpO1xuXHRcdHRoaXMuYmxlbmRNb2RlRGljLnB1c2goQmxlbmRNb2RlLk9WRVJMQVkpO1xuXHRcdHRoaXMuYmxlbmRNb2RlRGljLnB1c2goQmxlbmRNb2RlLlNDUkVFTik7XG5cdFx0dGhpcy5ibGVuZE1vZGVEaWMucHVzaChCbGVuZE1vZGUuU0hBREVSKTtcblx0XHR0aGlzLmJsZW5kTW9kZURpYy5wdXNoKEJsZW5kTW9kZS5PVkVSTEFZKTtcblxuXHRcdHRoaXMuX2RlcHRoU2l6ZURpYyA9IG5ldyBBcnJheTxudW1iZXI+KCk7IC8vIHVzZWQgdG8gdHJhbnNsYXRlIGludHMgdG8gZGVwdGhTaXplLXZhbHVlc1xuXHRcdHRoaXMuX2RlcHRoU2l6ZURpYy5wdXNoKDI1Nik7XG5cdFx0dGhpcy5fZGVwdGhTaXplRGljLnB1c2goNTEyKTtcblx0XHR0aGlzLl9kZXB0aFNpemVEaWMucHVzaCgyMDQ4KTtcblx0XHR0aGlzLl9kZXB0aFNpemVEaWMucHVzaCgxMDI0KTtcblx0XHR0aGlzLl92ZXJzaW9uID0gQXJyYXk8bnVtYmVyPigpOyAvLyB3aWxsIGNvbnRhaW4gMiBpbnQgKG1ham9yLXZlcnNpb24sIG1pbm9yLXZlcnNpb24pIGZvciBhd2QtdmVyc2lvbi1jaGVja1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBhIGdpdmVuIGZpbGUgZXh0ZW5zaW9uIGlzIHN1cHBvcnRlZCBieSB0aGUgcGFyc2VyLlxuXHQgKiBAcGFyYW0gZXh0ZW5zaW9uIFRoZSBmaWxlIGV4dGVuc2lvbiBvZiBhIHBvdGVudGlhbCBmaWxlIHRvIGJlIHBhcnNlZC5cblx0ICogQHJldHVybiBXaGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gZmlsZSB0eXBlIGlzIHN1cHBvcnRlZC5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgc3VwcG9ydHNUeXBlKGV4dGVuc2lvbjpzdHJpbmcpOmJvb2xlYW5cblx0e1xuXHRcdGV4dGVuc2lvbiA9IGV4dGVuc2lvbi50b0xvd2VyQ2FzZSgpO1xuXHRcdHJldHVybiBleHRlbnNpb24gPT0gXCJhd2RcIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBUZXN0cyB3aGV0aGVyIGEgZGF0YSBibG9jayBjYW4gYmUgcGFyc2VkIGJ5IHRoZSBwYXJzZXIuXG5cdCAqIEBwYXJhbSBkYXRhIFRoZSBkYXRhIGJsb2NrIHRvIHBvdGVudGlhbGx5IGJlIHBhcnNlZC5cblx0ICogQHJldHVybiBXaGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gZGF0YSBpcyBzdXBwb3J0ZWQuXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIHN1cHBvcnRzRGF0YShkYXRhOmFueSk6Ym9vbGVhblxuXHR7XG5cdFx0cmV0dXJuIChQYXJzZXJVdGlscy50b1N0cmluZyhkYXRhLCAzKSA9PSAnQVdEJyk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfaVJlc29sdmVEZXBlbmRlbmN5KHJlc291cmNlRGVwZW5kZW5jeTpSZXNvdXJjZURlcGVuZGVuY3kpXG5cdHtcblx0XHQvLyB0aGlzIHdpbGwgYmUgY2FsbGVkIHdoZW4gRGVwZW5kZW5jeSBoYXMgZmluaXNoZWQgbG9hZGluZy5cblx0XHQvLyB0aGUgQXNzZXRzIHdhaXRpbmcgZm9yIHRoaXMgQml0bWFwLCBjYW4gYmUgVGV4dHVyZSBvciBDdWJlVGV4dHVyZS5cblx0XHQvLyBpZiB0aGUgQml0bWFwIGlzIGF3YWl0ZWQgYnkgYSBDdWJlVGV4dHVyZSwgd2UgbmVlZCB0byBjaGVjayBpZiBpdHMgdGhlIGxhc3QgQml0bWFwIG9mIHRoZSBDdWJlVGV4dHVyZSxcblx0XHQvLyBzbyB3ZSBrbm93IGlmIHdlIGhhdmUgdG8gZmluYWxpemUgdGhlIEFzc2V0IChDdWJlVGV4dHVyZSkgb3Igbm90LlxuXHRcdGlmIChyZXNvdXJjZURlcGVuZGVuY3kuYXNzZXRzLmxlbmd0aCA9PSAxKSB7XG5cdFx0XHR2YXIgaXNDdWJlVGV4dHVyZUFycmF5OkFycmF5PHN0cmluZz4gPSByZXNvdXJjZURlcGVuZGVuY3kuaWQuc3BsaXQoXCIjXCIpO1xuXHRcdFx0dmFyIHJlc3NvdXJjZUlEOnN0cmluZyA9IGlzQ3ViZVRleHR1cmVBcnJheVswXTtcblx0XHRcdHZhciBhc3NldDpUZXh0dXJlUHJveHlCYXNlO1xuXHRcdFx0dmFyIHRoaXNCaXRtYXBUZXh0dXJlOlRleHR1cmUyREJhc2U7XG5cdFx0XHR2YXIgYmxvY2s6QVdEQmxvY2s7XG5cblx0XHRcdGlmIChpc0N1YmVUZXh0dXJlQXJyYXkubGVuZ3RoID09IDEpIC8vIE5vdCBhIGN1YmUgdGV4dHVyZVxuXHRcdFx0e1xuXHRcdFx0XHRhc3NldCA9IDxUZXh0dXJlMkRCYXNlPiByZXNvdXJjZURlcGVuZGVuY3kuYXNzZXRzWzBdO1xuXHRcdFx0XHRpZiAoYXNzZXQpIHtcblx0XHRcdFx0XHR2YXIgbWF0OlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWw7XG5cdFx0XHRcdFx0dmFyIHVzZXJzOkFycmF5PHN0cmluZz47XG5cblx0XHRcdFx0XHRibG9jayA9IHRoaXMuX2Jsb2Nrc1sgcmVzb3VyY2VEZXBlbmRlbmN5LmlkIF07XG5cdFx0XHRcdFx0YmxvY2suZGF0YSA9IGFzc2V0OyAvLyBTdG9yZSBmaW5pc2hlZCBhc3NldFxuXG5cdFx0XHRcdFx0Ly8gUmVzZXQgbmFtZSBvZiB0ZXh0dXJlIHRvIHRoZSBvbmUgZGVmaW5lZCBpbiB0aGUgQVdEIGZpbGUsXG5cdFx0XHRcdFx0Ly8gYXMgb3Bwb3NlZCB0byB3aGF0ZXZlciB0aGUgaW1hZ2UgcGFyc2VyIGNhbWUgdXAgd2l0aC5cblx0XHRcdFx0XHRhc3NldC5yZXNldEFzc2V0UGF0aChibG9jay5uYW1lLCBudWxsLCB0cnVlKTtcblx0XHRcdFx0XHRibG9jay5uYW1lID0gYXNzZXQubmFtZTtcblx0XHRcdFx0XHQvLyBGaW5hbGl6ZSB0ZXh0dXJlIGFzc2V0IHRvIGRpc3BhdGNoIHRleHR1cmUgZXZlbnQsIHdoaWNoIHdhc1xuXHRcdFx0XHRcdC8vIHByZXZpb3VzbHkgc3VwcHJlc3NlZCB3aGlsZSB0aGUgZGVwZW5kZW5jeSB3YXMgbG9hZGVkLlxuXHRcdFx0XHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KDxJQXNzZXQ+IGFzc2V0KTtcblxuXHRcdFx0XHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJTdWNjZXNzZnVsbHkgbG9hZGVkIEJpdG1hcCBmb3IgdGV4dHVyZVwiKTtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIHRleHR1cmU6IE5hbWUgPSBcIiArIGJsb2NrLm5hbWUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoaXNDdWJlVGV4dHVyZUFycmF5Lmxlbmd0aCA+IDEpIC8vIEN1YmUgVGV4dHVyZVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzQml0bWFwVGV4dHVyZSA9IDxCaXRtYXBUZXh0dXJlPiByZXNvdXJjZURlcGVuZGVuY3kuYXNzZXRzWzBdO1xuXG5cdFx0XHRcdHZhciB0eDpJbWFnZVRleHR1cmUgPSA8SW1hZ2VUZXh0dXJlPiB0aGlzQml0bWFwVGV4dHVyZTtcblxuXHRcdFx0XHR0aGlzLl9jdWJlVGV4dHVyZXNbIGlzQ3ViZVRleHR1cmVBcnJheVsxXSBdID0gdHguaHRtbEltYWdlRWxlbWVudDsgLy8gP1xuXHRcdFx0XHR0aGlzLl90ZXh0dXJlX3VzZXJzW3Jlc3NvdXJjZUlEXS5wdXNoKDEpO1xuXG5cdFx0XHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiU3VjY2Vzc2Z1bGx5IGxvYWRlZCBCaXRtYXAgXCIgKyB0aGlzLl90ZXh0dXJlX3VzZXJzW3Jlc3NvdXJjZUlEXS5sZW5ndGggKyBcIiAvIDYgZm9yIEN1YmV0ZXh0dXJlXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLl90ZXh0dXJlX3VzZXJzW3Jlc3NvdXJjZUlEXS5sZW5ndGggPT0gdGhpcy5fY3ViZVRleHR1cmVzLmxlbmd0aCkge1xuXG5cdFx0XHRcdFx0dmFyIHBvc1g6YW55ID0gdGhpcy5fY3ViZVRleHR1cmVzWzBdO1xuXHRcdFx0XHRcdHZhciBuZWdYOmFueSA9IHRoaXMuX2N1YmVUZXh0dXJlc1sxXTtcblx0XHRcdFx0XHR2YXIgcG9zWTphbnkgPSB0aGlzLl9jdWJlVGV4dHVyZXNbMl07XG5cdFx0XHRcdFx0dmFyIG5lZ1k6YW55ID0gdGhpcy5fY3ViZVRleHR1cmVzWzNdO1xuXHRcdFx0XHRcdHZhciBwb3NaOmFueSA9IHRoaXMuX2N1YmVUZXh0dXJlc1s0XTtcblx0XHRcdFx0XHR2YXIgbmVnWjphbnkgPSB0aGlzLl9jdWJlVGV4dHVyZXNbNV07XG5cblx0XHRcdFx0XHRhc3NldCA9IDxUZXh0dXJlUHJveHlCYXNlPiBuZXcgSW1hZ2VDdWJlVGV4dHVyZShwb3NYLCBuZWdYLCBwb3NZLCBuZWdZLCBwb3NaLCBuZWdaKTtcblx0XHRcdFx0XHRibG9jayA9IHRoaXMuX2Jsb2Nrc1tyZXNzb3VyY2VJRF07XG5cdFx0XHRcdFx0YmxvY2suZGF0YSA9IGFzc2V0OyAvLyBTdG9yZSBmaW5pc2hlZCBhc3NldFxuXG5cdFx0XHRcdFx0Ly8gUmVzZXQgbmFtZSBvZiB0ZXh0dXJlIHRvIHRoZSBvbmUgZGVmaW5lZCBpbiB0aGUgQVdEIGZpbGUsXG5cdFx0XHRcdFx0Ly8gYXMgb3Bwb3NlZCB0byB3aGF0ZXZlciB0aGUgaW1hZ2UgcGFyc2VyIGNhbWUgdXAgd2l0aC5cblx0XHRcdFx0XHRhc3NldC5yZXNldEFzc2V0UGF0aChibG9jay5uYW1lLCBudWxsLCB0cnVlKTtcblx0XHRcdFx0XHRibG9jay5uYW1lID0gYXNzZXQubmFtZTtcblx0XHRcdFx0XHQvLyBGaW5hbGl6ZSB0ZXh0dXJlIGFzc2V0IHRvIGRpc3BhdGNoIHRleHR1cmUgZXZlbnQsIHdoaWNoIHdhc1xuXHRcdFx0XHRcdC8vIHByZXZpb3VzbHkgc3VwcHJlc3NlZCB3aGlsZSB0aGUgZGVwZW5kZW5jeSB3YXMgbG9hZGVkLlxuXHRcdFx0XHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KDxJQXNzZXQ+IGFzc2V0KTtcblx0XHRcdFx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIEN1YmVUZXh0dXJlOiBOYW1lID0gXCIgKyBibG9jay5uYW1lKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pUmVzb2x2ZURlcGVuZGVuY3lGYWlsdXJlKHJlc291cmNlRGVwZW5kZW5jeTpSZXNvdXJjZURlcGVuZGVuY3kpXG5cdHtcblx0XHQvL25vdCB1c2VkIC0gaWYgYSBkZXBlbmRjeSBmYWlscywgdGhlIGF3YWl0aW5nIFRleHR1cmUgb3IgQ3ViZVRleHR1cmUgd2lsbCBuZXZlciBiZSBmaW5hbGl6ZWQsIGFuZCB0aGUgZGVmYXVsdC1iaXRtYXBzIHdpbGwgYmUgdXNlZC5cblx0XHQvLyB0aGlzIG1lYW5zLCB0aGF0IGlmIG9uZSBCaXRtYXAgb2YgYSBDdWJlVGV4dHVyZSBmYWlscywgdGhlIEN1YmVUZXh0dXJlIHdpbGwgaGF2ZSB0aGUgRGVmYXVsdFRleHR1cmUgYXBwbGllZCBmb3IgYWxsIHNpeCBCaXRtYXBzLlxuXHR9XG5cblx0LyoqXG5cdCAqIFJlc29sdmUgYSBkZXBlbmRlbmN5IG5hbWVcblx0ICpcblx0ICogQHBhcmFtIHJlc291cmNlRGVwZW5kZW5jeSBUaGUgZGVwZW5kZW5jeSB0byBiZSByZXNvbHZlZC5cblx0ICovXG5cdHB1YmxpYyBfaVJlc29sdmVEZXBlbmRlbmN5TmFtZShyZXNvdXJjZURlcGVuZGVuY3k6UmVzb3VyY2VEZXBlbmRlbmN5LCBhc3NldDpJQXNzZXQpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIG9sZE5hbWU6c3RyaW5nID0gYXNzZXQubmFtZTtcblxuXHRcdGlmIChhc3NldCkge1xuXHRcdFx0dmFyIGJsb2NrOkFXREJsb2NrID0gdGhpcy5fYmxvY2tzW3BhcnNlSW50KHJlc291cmNlRGVwZW5kZW5jeS5pZCldO1xuXHRcdFx0Ly8gUmVzZXQgbmFtZSBvZiB0ZXh0dXJlIHRvIHRoZSBvbmUgZGVmaW5lZCBpbiB0aGUgQVdEIGZpbGUsXG5cdFx0XHQvLyBhcyBvcHBvc2VkIHRvIHdoYXRldmVyIHRoZSBpbWFnZSBwYXJzZXIgY2FtZSB1cCB3aXRoLlxuXHRcdFx0YXNzZXQucmVzZXRBc3NldFBhdGgoYmxvY2submFtZSwgbnVsbCwgdHJ1ZSk7XG5cdFx0fVxuXG5cdFx0dmFyIG5ld05hbWU6c3RyaW5nID0gYXNzZXQubmFtZTtcblxuXHRcdGFzc2V0Lm5hbWUgPSBvbGROYW1lO1xuXG5cdFx0cmV0dXJuIG5ld05hbWU7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9wUHJvY2VlZFBhcnNpbmcoKTpib29sZWFuXG5cdHtcblxuXHRcdGlmICghdGhpcy5fc3RhcnRlZFBhcnNpbmcpIHtcblx0XHRcdHRoaXMuX2J5dGVEYXRhID0gdGhpcy5fcEdldEJ5dGVEYXRhKCk7Ly9nZXRCeXRlRGF0YSgpO1xuXHRcdFx0dGhpcy5fc3RhcnRlZFBhcnNpbmcgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICghdGhpcy5fcGFyc2VkX2hlYWRlcikge1xuXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdC8vIExJVFRMRV9FTkRJQU4gLSBEZWZhdWx0IGZvciBBcnJheUJ1ZmZlciAvIE5vdCBpbXBsZW1lbnRlZCBpbiBCeXRlQXJyYXlcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFx0Ly90aGlzLl9ieXRlRGF0YS5lbmRpYW4gPSBFbmRpYW4uTElUVExFX0VORElBTjtcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdC8vIFBhcnNlIGhlYWRlciBhbmQgZGVjb21wcmVzcyBib2R5IGlmIG5lZWRlZFxuXHRcdFx0dGhpcy5wYXJzZUhlYWRlcigpO1xuXG5cdFx0XHRzd2l0Y2ggKHRoaXMuX2NvbXByZXNzaW9uKSB7XG5cblx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuREVGTEFURTpcblx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuTFpNQTpcblx0XHRcdFx0XHR0aGlzLl9wRGllV2l0aEVycm9yKCdDb21wcmVzc2VkIEFXRCBmb3JtYXRzIG5vdCB5ZXQgc3VwcG9ydGVkJyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuVU5DT01QUkVTU0VEOlxuXHRcdFx0XHRcdHRoaXMuX2JvZHkgPSB0aGlzLl9ieXRlRGF0YTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdFx0Ly8gQ29tcHJlc3NlZCBBV0QgRm9ybWF0cyBub3QgeWV0IHN1cHBvcnRlZFxuXHRcdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRcdFx0XHQvKlxuXHRcdFx0XHQgY2FzZSBBV0RQYXJzZXIuREVGTEFURTpcblxuXHRcdFx0XHQgdGhpcy5fYm9keSA9IG5ldyBCeXRlQXJyYXkoKTtcblx0XHRcdFx0IHRoaXMuX2J5dGVEYXRhLnJlYWRCeXRlcyh0aGlzLl9ib2R5LCAwLCB0aGlzLl9ieXRlRGF0YS5nZXRCeXRlc0F2YWlsYWJsZSgpKTtcblx0XHRcdFx0IHRoaXMuX2JvZHkudW5jb21wcmVzcygpO1xuXG5cdFx0XHRcdCBicmVhaztcblx0XHRcdFx0IGNhc2UgQVdEUGFyc2VyLkxaTUE6XG5cblx0XHRcdFx0IHRoaXMuX2JvZHkgPSBuZXcgQnl0ZUFycmF5KCk7XG5cdFx0XHRcdCB0aGlzLl9ieXRlRGF0YS5yZWFkQnl0ZXModGhpcy5fYm9keSwgMCwgdGhpcy5fYnl0ZURhdGEuZ2V0Qnl0ZXNBdmFpbGFibGUoKSk7XG5cdFx0XHRcdCB0aGlzLl9ib2R5LnVuY29tcHJlc3MoQ09NUFJFU1NJT05NT0RFX0xaTUEpO1xuXG5cdFx0XHRcdCBicmVhaztcblx0XHRcdFx0IC8vKi9cblxuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9wYXJzZWRfaGVhZGVyID0gdHJ1ZTtcblxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XHQvLyBMSVRUTEVfRU5ESUFOIC0gRGVmYXVsdCBmb3IgQXJyYXlCdWZmZXIgLyBOb3QgaW1wbGVtZW50ZWQgaW4gQnl0ZUFycmF5XG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdC8vdGhpcy5fYm9keS5lbmRpYW4gPSBFbmRpYW4uTElUVExFX0VORElBTjsvLyBTaG91bGQgYmUgZGVmYXVsdFxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0XHR9XG5cblx0XHRpZiAodGhpcy5fYm9keSkge1xuXG5cdFx0XHR3aGlsZSAodGhpcy5fYm9keS5nZXRCeXRlc0F2YWlsYWJsZSgpID4gMCAmJiAhdGhpcy5wYXJzaW5nUGF1c2VkKSAvLyYmIHRoaXMuX3BIYXNUaW1lKCkgKVxuXHRcdFx0e1xuXHRcdFx0XHR0aGlzLnBhcnNlTmV4dEJsb2NrKCk7XG5cblx0XHRcdH1cblxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XHQvLyBSZXR1cm4gY29tcGxldGUgc3RhdHVzXG5cdFx0XHRpZiAodGhpcy5fYm9keS5nZXRCeXRlc0F2YWlsYWJsZSgpID09IDApIHtcblx0XHRcdFx0dGhpcy5kaXNwb3NlKCk7XG5cdFx0XHRcdHJldHVybiAgUGFyc2VyQmFzZS5QQVJTSU5HX0RPTkU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gIFBhcnNlckJhc2UuTU9SRV9UT19QQVJTRTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRzd2l0Y2ggKHRoaXMuX2NvbXByZXNzaW9uKSB7XG5cblx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuREVGTEFURTpcblx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuTFpNQTpcblxuXHRcdFx0XHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCIoISkgQVdEUGFyc2VyIEVycm9yOiBDb21wcmVzc2VkIEFXRCBmb3JtYXRzIG5vdCB5ZXQgc3VwcG9ydGVkICghKVwiKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0fVxuXHRcdFx0Ly8gRXJyb3IgLSBtb3N0IGxpa2VseSBfYm9keSBub3Qgc2V0IGJlY2F1c2Ugd2UgZG8gbm90IHN1cHBvcnQgY29tcHJlc3Npb24uXG5cdFx0XHRyZXR1cm4gIFBhcnNlckJhc2UuUEFSU0lOR19ET05FO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRwdWJsaWMgX3BTdGFydFBhcnNpbmcoZnJhbWVMaW1pdDpudW1iZXIpXG5cdHtcblx0XHRzdXBlci5fcFN0YXJ0UGFyc2luZyhmcmFtZUxpbWl0KTtcblxuXHRcdC8vY3JlYXRlIGEgY29udGVudCBvYmplY3QgZm9yIExvYWRlcnNcblx0XHR0aGlzLl9wQ29udGVudCA9IG5ldyBEaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cdH1cblxuXHRwcml2YXRlIGRpc3Bvc2UoKTp2b2lkXG5cdHtcblxuXHRcdGZvciAodmFyIGMgaW4gdGhpcy5fYmxvY2tzKSB7XG5cblx0XHRcdHZhciBiOkFXREJsb2NrID0gPEFXREJsb2NrPiB0aGlzLl9ibG9ja3NbIGMgXTtcblx0XHRcdGIuZGlzcG9zZSgpO1xuXG5cdFx0fVxuXG5cdH1cblxuXHRwcml2YXRlIHBhcnNlTmV4dEJsb2NrKCk6dm9pZFxuXHR7XG5cdFx0dmFyIGJsb2NrOkFXREJsb2NrO1xuXHRcdHZhciBhc3NldERhdGE6SUFzc2V0O1xuXHRcdHZhciBpc1BhcnNlZDpib29sZWFuID0gZmFsc2U7XG5cdFx0dmFyIG5zOm51bWJlcjtcblx0XHR2YXIgdHlwZTpudW1iZXI7XG5cdFx0dmFyIGZsYWdzOm51bWJlcjtcblx0XHR2YXIgbGVuOm51bWJlcjtcblxuXHRcdHRoaXMuX2N1cl9ibG9ja19pZCA9IHRoaXMuX2JvZHkucmVhZFVuc2lnbmVkSW50KCk7XG5cblx0XHRucyA9IHRoaXMuX2JvZHkucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdHR5cGUgPSB0aGlzLl9ib2R5LnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHRmbGFncyA9IHRoaXMuX2JvZHkucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdGxlbiA9IHRoaXMuX2JvZHkucmVhZFVuc2lnbmVkSW50KCk7XG5cblx0XHR2YXIgYmxvY2tDb21wcmVzc2lvbjpib29sZWFuID0gQml0RmxhZ3MudGVzdChmbGFncywgQml0RmxhZ3MuRkxBRzQpO1xuXHRcdHZhciBibG9ja0NvbXByZXNzaW9uTFpNQTpib29sZWFuID0gQml0RmxhZ3MudGVzdChmbGFncywgQml0RmxhZ3MuRkxBRzUpO1xuXG5cdFx0aWYgKHRoaXMuX2FjY3VyYWN5T25CbG9ja3MpIHtcblx0XHRcdHRoaXMuX2FjY3VyYWN5TWF0cml4ID0gQml0RmxhZ3MudGVzdChmbGFncywgQml0RmxhZ3MuRkxBRzEpO1xuXHRcdFx0dGhpcy5fYWNjdXJhY3lHZW8gPSBCaXRGbGFncy50ZXN0KGZsYWdzLCBCaXRGbGFncy5GTEFHMik7XG5cdFx0XHR0aGlzLl9hY2N1cmFjeVByb3BzID0gQml0RmxhZ3MudGVzdChmbGFncywgQml0RmxhZ3MuRkxBRzMpO1xuXHRcdFx0dGhpcy5fZ2VvTnJUeXBlID0gQVdEUGFyc2VyLkZMT0FUMzI7XG5cblx0XHRcdGlmICh0aGlzLl9hY2N1cmFjeUdlbykge1xuXHRcdFx0XHR0aGlzLl9nZW9OclR5cGUgPSBBV0RQYXJzZXIuRkxPQVQ2NDtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fbWF0cml4TnJUeXBlID0gQVdEUGFyc2VyLkZMT0FUMzI7XG5cblx0XHRcdGlmICh0aGlzLl9hY2N1cmFjeU1hdHJpeCkge1xuXHRcdFx0XHR0aGlzLl9tYXRyaXhOclR5cGUgPSBBV0RQYXJzZXIuRkxPQVQ2NDtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fcHJvcHNOclR5cGUgPSBBV0RQYXJzZXIuRkxPQVQzMjtcblxuXHRcdFx0aWYgKHRoaXMuX2FjY3VyYWN5UHJvcHMpIHtcblx0XHRcdFx0dGhpcy5fcHJvcHNOclR5cGUgPSBBV0RQYXJzZXIuRkxPQVQ2NDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgYmxvY2tFbmRBbGw6bnVtYmVyID0gdGhpcy5fYm9keS5wb3NpdGlvbiArIGxlbjtcblxuXHRcdGlmIChsZW4gPiB0aGlzLl9ib2R5LmdldEJ5dGVzQXZhaWxhYmxlKCkpIHtcblx0XHRcdHRoaXMuX3BEaWVXaXRoRXJyb3IoJ0FXRDIgYmxvY2sgbGVuZ3RoIGlzIGJpZ2dlciB0aGFuIHRoZSBieXRlcyB0aGF0IGFyZSBhdmFpbGFibGUhJyk7XG5cdFx0XHR0aGlzLl9ib2R5LnBvc2l0aW9uICs9IHRoaXMuX2JvZHkuZ2V0Qnl0ZXNBdmFpbGFibGUoKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dGhpcy5fbmV3QmxvY2tCeXRlcyA9IG5ldyBCeXRlQXJyYXkoKTtcblxuXG5cdFx0dGhpcy5fYm9keS5yZWFkQnl0ZXModGhpcy5fbmV3QmxvY2tCeXRlcywgMCwgbGVuKTtcblxuXHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdC8vIENvbXByZXNzZWQgQVdEIEZvcm1hdHMgbm90IHlldCBzdXBwb3J0ZWRcblxuXHRcdGlmIChibG9ja0NvbXByZXNzaW9uKSB7XG5cdFx0XHR0aGlzLl9wRGllV2l0aEVycm9yKCdDb21wcmVzc2VkIEFXRCBmb3JtYXRzIG5vdCB5ZXQgc3VwcG9ydGVkJyk7XG5cblx0XHRcdC8qXG5cdFx0XHQgaWYgKGJsb2NrQ29tcHJlc3Npb25MWk1BKVxuXHRcdFx0IHtcblx0XHRcdCB0aGlzLl9uZXdCbG9ja0J5dGVzLnVuY29tcHJlc3MoQVdEUGFyc2VyLkNPTVBSRVNTSU9OTU9ERV9MWk1BKTtcblx0XHRcdCB9XG5cdFx0XHQgZWxzZVxuXHRcdFx0IHtcblx0XHRcdCB0aGlzLl9uZXdCbG9ja0J5dGVzLnVuY29tcHJlc3MoKTtcblx0XHRcdCB9XG5cdFx0XHQgKi9cblxuXHRcdH1cblxuXHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdC8vIExJVFRMRV9FTkRJQU4gLSBEZWZhdWx0IGZvciBBcnJheUJ1ZmZlciAvIE5vdCBpbXBsZW1lbnRlZCBpbiBCeXRlQXJyYXlcblx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHQvL3RoaXMuX25ld0Jsb2NrQnl0ZXMuZW5kaWFuID0gRW5kaWFuLkxJVFRMRV9FTkRJQU47XG5cdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0XHR0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uID0gMDtcblx0XHRibG9jayA9IG5ldyBBV0RCbG9jaygpO1xuXHRcdGJsb2NrLmxlbiA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gKyBsZW47XG5cdFx0YmxvY2suaWQgPSB0aGlzLl9jdXJfYmxvY2tfaWQ7XG5cblx0XHR2YXIgYmxvY2tFbmRCbG9jazpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uICsgbGVuO1xuXG5cdFx0aWYgKGJsb2NrQ29tcHJlc3Npb24pIHtcblx0XHRcdHRoaXMuX3BEaWVXaXRoRXJyb3IoJ0NvbXByZXNzZWQgQVdEIGZvcm1hdHMgbm90IHlldCBzdXBwb3J0ZWQnKTtcblx0XHRcdC8vYmxvY2tFbmRCbG9jayAgID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiArIHRoaXMuX25ld0Jsb2NrQnl0ZXMubGVuZ3RoO1xuXHRcdFx0Ly9ibG9jay5sZW4gICAgICAgPSBibG9ja0VuZEJsb2NrO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJBV0RCbG9jazogIElEID0gXCIgKyB0aGlzLl9jdXJfYmxvY2tfaWQgKyBcIiB8IFR5cGVJRCA9IFwiICsgdHlwZSArIFwiIHwgQ29tcHJlc3Npb24gPSBcIiArIGJsb2NrQ29tcHJlc3Npb24gKyBcIiB8IE1hdHJpeC1QcmVjaXNpb24gPSBcIiArIHRoaXMuX2FjY3VyYWN5TWF0cml4ICsgXCIgfCBHZW9tZXRyeS1QcmVjaXNpb24gPSBcIiArIHRoaXMuX2FjY3VyYWN5R2VvICsgXCIgfCBQcm9wZXJ0aWVzLVByZWNpc2lvbiA9IFwiICsgdGhpcy5fYWNjdXJhY3lQcm9wcyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fYmxvY2tzW3RoaXMuX2N1cl9ibG9ja19pZF0gPSBibG9jaztcblxuXHRcdGlmICgodGhpcy5fdmVyc2lvblswXSA9PSAzKSAmJiAodGhpcy5fdmVyc2lvblsxXSA9PSAwKSkge1xuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdGNhc2UgMjovLyBqdXN0IGJlY2F1c2UgaSB1c2VkIGJsb2NrSUQgMiBpbiBmaXJzdCBleHBvcnRlciBlYXJsaWVyXG5cdFx0XHRcdGNhc2UgMTMxOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VTaGFwZTJEKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0aXNQYXJzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDM6Ly8ganVzdCBiZWNhdXNlIGkgdXNlZCBibG9ja0lEIDMgaW4gZmlyc3QgZXhwb3J0ZXIgZWFybGllclxuXHRcdFx0XHRjYXNlIDEzMjpcblx0XHRcdFx0XHR0aGlzLnBhcnNlU2hhcGUyREZpbGwodGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRpc1BhcnNlZCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgNDovLyBqdXN0IGJlY2F1c2UgaSB1c2VkIGJsb2NrSUQgNCBpbiBmaXJzdCBleHBvcnRlciBlYXJsaWVyXG5cdFx0XHRcdGNhc2UgMTMzOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VUaW1lTGluZSh0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGlzUGFyc2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoKHRoaXMuX3ZlcnNpb25bMF0gPT0gMikgJiYgKHRoaXMuX3ZlcnNpb25bMV0gPT0gMSkpIHtcblxuXHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdGNhc2UgMTE6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZVByaW1pdHZlcyh0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGlzUGFyc2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAzMTpcblx0XHRcdFx0XHR0aGlzLnBhcnNlU2t5Ym94SW5zdGFuY2UodGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRpc1BhcnNlZCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgNDE6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZUxpZ2h0KHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0aXNQYXJzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDQyOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VDYW1lcmEodGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRpc1BhcnNlZCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Ly8gIGNhc2UgNDM6XG5cdFx0XHRcdC8vICAgICAgcGFyc2VUZXh0dXJlUHJvamVjdG9yKF9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHQvLyAgICAgIGlzUGFyc2VkID0gdHJ1ZTtcblx0XHRcdFx0Ly8gICAgICBicmVhaztcblxuXHRcdFx0XHRjYXNlIDUxOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VMaWdodFBpY2tlcih0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGlzUGFyc2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSA4MTpcblx0XHRcdFx0XHR0aGlzLnBhcnNlTWF0ZXJpYWxfdjEodGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRpc1BhcnNlZCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgODM6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZUN1YmVUZXh0dXJlKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0aXNQYXJzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDkxOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VTaGFyZWRNZXRob2RCbG9jayh0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGlzUGFyc2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSA5Mjpcblx0XHRcdFx0XHR0aGlzLnBhcnNlU2hhZG93TWV0aG9kQmxvY2sodGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRpc1BhcnNlZCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMTExOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VNZXNoUG9zZUFuaW1hdGlvbih0aGlzLl9jdXJfYmxvY2tfaWQsIHRydWUpO1xuXHRcdFx0XHRcdGlzUGFyc2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAxMTI6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZU1lc2hQb3NlQW5pbWF0aW9uKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0aXNQYXJzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDExMzpcblx0XHRcdFx0XHR0aGlzLnBhcnNlVmVydGV4QW5pbWF0aW9uU2V0KHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0aXNQYXJzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDEyMjpcblx0XHRcdFx0XHR0aGlzLnBhcnNlQW5pbWF0b3JTZXQodGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRpc1BhcnNlZCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMjUzOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VDb21tYW5kKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0aXNQYXJzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0Ly8qL1xuXHRcdH1cblx0XHQvLypcblx0XHRpZiAoaXNQYXJzZWQgPT0gZmFsc2UpIHtcblx0XHRcdHN3aXRjaCAodHlwZSkge1xuXG5cdFx0XHRcdGNhc2UgMTpcblx0XHRcdFx0XHR0aGlzLnBhcnNlVHJpYW5nbGVHZW9tZXRyaWVCbG9jayh0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDIyOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VDb250YWluZXIodGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAyMzpcblx0XHRcdFx0XHR0aGlzLnBhcnNlTWVzaEluc3RhbmNlKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgODE6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZU1hdGVyaWFsKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgODI6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZVRleHR1cmUodGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAxMDE6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZVNrZWxldG9uKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMTAyOlxuXHRcdFx0XHRcdHRoaXMucGFyc2VTa2VsZXRvblBvc2UodGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAxMDM6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZVNrZWxldG9uQW5pbWF0aW9uKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgMTIxOlxuXHRcdFx0XHRcdC8vdGhpcy5wYXJzZVVWQW5pbWF0aW9uKHRoaXMuX2N1cl9ibG9ja19pZCk7XG5cdFx0XHRcdFx0Ly9icmVhaztcblx0XHRcdFx0Y2FzZSAyNTQ6XG5cdFx0XHRcdFx0dGhpcy5wYXJzZU5hbWVTcGFjZSh0aGlzLl9jdXJfYmxvY2tfaWQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDI1NTpcblx0XHRcdFx0XHR0aGlzLnBhcnNlTWV0YURhdGEodGhpcy5fY3VyX2Jsb2NrX2lkKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiQVdEQmxvY2s6ICAgVW5rbm93biBCbG9ja1R5cGUgIChCbG9ja0lEID0gXCIgKyB0aGlzLl9jdXJfYmxvY2tfaWQgKyBcIikgLSBTa2lwIFwiICsgbGVuICsgXCIgYnl0ZXNcIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gKz0gbGVuO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyovXG5cblx0XHR2YXIgbXNnQ250Om51bWJlciA9IDA7XG5cdFx0aWYgKHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPT0gYmxvY2tFbmRCbG9jaykge1xuXHRcdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHRcdGlmIChibG9jay5lcnJvck1lc3NhZ2VzKSB7XG5cdFx0XHRcdFx0d2hpbGUgKG1zZ0NudCA8IGJsb2NrLmVycm9yTWVzc2FnZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIiAgICAgICAgKCEpIEVycm9yOiBcIiArIGJsb2NrLmVycm9yTWVzc2FnZXNbbXNnQ250XSArIFwiICghKVwiKTtcblx0XHRcdFx0XHRcdG1zZ0NudCsrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiXFxuXCIpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAodGhpcy5fZGVidWcpIHtcblxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIiAgKCEpKCEpKCEpIEVycm9yIHdoaWxlIHJlYWRpbmcgQVdEQmxvY2sgSUQgXCIgKyB0aGlzLl9jdXJfYmxvY2tfaWQgKyBcIiA9IHNraXAgdG8gbmV4dCBibG9ja1wiKTtcblxuXHRcdFx0XHRpZiAoYmxvY2suZXJyb3JNZXNzYWdlcykge1xuXHRcdFx0XHRcdHdoaWxlIChtc2dDbnQgPCBibG9jay5lcnJvck1lc3NhZ2VzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCIgICAgICAgICghKSBFcnJvcjogXCIgKyBibG9jay5lcnJvck1lc3NhZ2VzW21zZ0NudF0gKyBcIiAoISlcIik7XG5cdFx0XHRcdFx0XHRtc2dDbnQrKztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl9ib2R5LnBvc2l0aW9uID0gYmxvY2tFbmRBbGw7XG5cdFx0dGhpcy5fbmV3QmxvY2tCeXRlcyA9IG51bGw7XG5cblx0fVxuXG5cblx0Ly8tLVBhcnNlciBCbG9ja3MtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHQvL0Jsb2NrIElEID0gMlxuXHRwcml2YXRlIHBhcnNlU2hhcGUyRChibG9ja0lEOm51bWJlcik6dm9pZFxuXHR7XG5cblx0XHR2YXIgZ2VvbTpHZW9tZXRyeSA9IG5ldyBHZW9tZXRyeSgpO1xuXG5cdFx0Ly8gUmVhZCBuYW1lIGFuZCBzdWIgY291bnRcblx0XHR2YXIgbmFtZTpzdHJpbmcgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0dmFyIG51bV9zdWJzOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblxuXHRcdC8vIFJlYWQgb3B0aW9uYWwgcHJvcGVydGllc1xuXHRcdHZhciBwcm9wczpBV0RQcm9wZXJ0aWVzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoezE6dGhpcy5fZ2VvTnJUeXBlLCAyOnRoaXMuX2dlb05yVHlwZX0pO1xuXG5cblx0XHQvLyBMb29wIHRocm91Z2ggc3ViIG1lc2hlc1xuXHRcdHZhciBzdWJzX3BhcnNlZDpudW1iZXIgPSAwO1xuXHRcdHdoaWxlIChzdWJzX3BhcnNlZCA8IG51bV9zdWJzKSB7XG5cdFx0XHR2YXIgaTpudW1iZXI7XG5cdFx0XHR2YXIgc21fbGVuOm51bWJlciwgc21fZW5kOm51bWJlcjtcblx0XHRcdHZhciBzdWJfZ2VvbTpUcmlhbmdsZVN1Ykdlb21ldHJ5O1xuXHRcdFx0dmFyIHdfaW5kaWNlczpBcnJheTxudW1iZXI+O1xuXHRcdFx0dmFyIHdlaWdodHM6QXJyYXk8bnVtYmVyPjtcblxuXHRcdFx0c21fbGVuID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRcdHNtX2VuZCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gKyBzbV9sZW47XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwiICAgICAgICAoISkgUEFSU0UgU1VCTUVTSFwiKTtcblxuXHRcdFx0Ly8gSWdub3JlIGZvciBub3cgKHJlYWQgdXYgZm9yIHN1YnNoYXBlcyBsYXRlcilcIlxuXHRcdFx0dmFyIHN1YlByb3BzOkFXRFByb3BlcnRpZXMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7MTp0aGlzLl9nZW9OclR5cGUsIDI6dGhpcy5fZ2VvTnJUeXBlfSk7XG5cdFx0XHQvLyBMb29wIHRocm91Z2ggZGF0YSBzdHJlYW1zXG5cdFx0XHR2YXIgaW5kaWNlczpBcnJheTxudW1iZXI+ID0gbmV3IEFycmF5PG51bWJlcj4oKTtcblx0XHRcdHZhciBpX2lkeDpudW1iZXIgPSAwO1xuXHRcdFx0d2hpbGUgKHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPCBzbV9lbmQpIHtcblx0XHRcdFx0dmFyIGlkeDpudW1iZXIgPSAwO1xuXHRcdFx0XHR2YXIgdXZfaWR4Om51bWJlciA9IDA7XG5cdFx0XHRcdHZhciBuX2lkeDpudW1iZXIgPSAwO1xuXHRcdFx0XHR2YXIgdF9pZHg6bnVtYmVyID0gMDtcblx0XHRcdFx0dmFyIHN0cl9mdHlwZTpudW1iZXIsIHN0cl90eXBlOm51bWJlciwgc3RyX2xlbjpudW1iZXIsIHN0cl9lbmQ6bnVtYmVyO1xuXG5cdFx0XHRcdC8vIFR5cGUsIGZpZWxkIHR5cGUsIGxlbmd0aFxuXHRcdFx0XHRzdHJfdHlwZSA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdFx0XHRzdHJfZnR5cGUgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHRcdFx0c3RyX2xlbiA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0XHRcdHN0cl9lbmQgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uICsgc3RyX2xlbjtcblxuXHRcdFx0XHR2YXIgeDpudW1iZXIsIHk6bnVtYmVyLCB6Om51bWJlcjtcblx0XHRcdFx0dmFyIHR5cGU6bnVtYmVyO1xuXHRcdFx0XHR2YXIgcjpudW1iZXIsIGc6bnVtYmVyLCBiOm51bWJlcixhOm51bWJlcjtcblx0XHRcdFx0dmFyIHU6bnVtYmVyLCB2Om51bWJlcjtcblxuXHRcdFx0XHRpZiAoc3RyX3R5cGUgPT0gMSkge1xuXHRcdFx0XHRcdHZhciB2ZXJ0czpBcnJheTxudW1iZXI+ID0gbmV3IEFycmF5PG51bWJlcj4oKTtcblx0XHRcdFx0XHR2YXIgdXZzOkFycmF5PG51bWJlcj4gPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuXHRcdFx0XHRcdHZhciBub3JtYWxzOkFycmF5PG51bWJlcj4gPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuXHRcdFx0XHRcdHZhciB0YW5nZW50czpBcnJheTxudW1iZXI+ID0gbmV3IEFycmF5PG51bWJlcj4oKTtcblxuXHRcdFx0XHRcdHdoaWxlICh0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uIDwgc3RyX2VuZCkge1xuXG5cdFx0XHRcdFx0XHR4ID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5R2VvKTtcblx0XHRcdFx0XHRcdHkgPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lHZW8pO1xuXHRcdFx0XHRcdFx0eiA9IC0wLjEgKiBzdWJzX3BhcnNlZDtcblx0XHRcdFx0XHRcdC8veiA9IHN1YnNfcGFyc2VkO1xuXHRcdFx0XHRcdFx0Ly96ID0gKGJsb2NrSUQqMC4wMDEpICsgc3Vic19wYXJzZWRcblx0XHRcdFx0XHRcdHR5cGUgPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lHZW8pO1xuXHRcdFx0XHRcdFx0dSA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeUdlbyk7XG5cdFx0XHRcdFx0XHR2ID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5R2VvKTtcblx0XHRcdFx0XHRcdHIgPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lHZW8pO1xuXHRcdFx0XHRcdFx0ZyA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeUdlbyk7XG5cdFx0XHRcdFx0XHRiID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5R2VvKTtcblx0XHRcdFx0XHRcdGEgPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lHZW8pO1xuXG5cdFx0XHRcdFx0XHQvLyB3aGlsZSB0aGlzIGlzIHRydWUsIGJlIHBhcnNlIHRoZSB2ZXJ0ZXgtZGF0YSwgc28gaXQgY2FuIGJlIHJlbmRlcmVkIGFzIFwibm9ybWFsXCIgM2QtZ2VvbWV0cnlcblx0XHRcdFx0XHRcdGlmICh0cnVlKSB7XG5cdFx0XHRcdFx0XHRcdHV2c1tpZHhdID0gMC4wO1xuXHRcdFx0XHRcdFx0XHRub3JtYWxzW2lkeF0gPSAwLjA7XG5cdFx0XHRcdFx0XHRcdHZlcnRzW2lkeCsrXSA9IHg7XG5cdFx0XHRcdFx0XHRcdHV2c1tpZHhdID0gMC4wO1xuXHRcdFx0XHRcdFx0XHRub3JtYWxzW2lkeF0gPSAwLjA7XG5cdFx0XHRcdFx0XHRcdHZlcnRzW2lkeCsrXSA9IHk7XG5cdFx0XHRcdFx0XHRcdG5vcm1hbHNbaWR4XSA9IDEuMDtcblx0XHRcdFx0XHRcdFx0dmVydHNbaWR4KytdID0gejtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2V7XG5cdFx0XHRcdFx0XHRcdC8vIHBhcnNlIGFuZCBzZXQtZGF0YSwgc28gdGhlIDNkLWdlb21ldHJ5IGNvbnRhaW5zIGFsbCBkYXRhIChidXQgaXMgbm8gbG9uZ2VyIHZhbGlkIGZvciBub3JtYWwgM2QtcmVuZGVyKVxuXHRcdFx0XHRcdFx0XHQvLyBhd2F5M2QtdmVydGV4ZGF0YSAgICB8ICAgYXdheUpTLXNoYXBlLWRhdGFcblx0XHRcdFx0XHRcdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdFx0XHRcdFx0Ly8gcG9zLnggICAgICAgICAgICAgICAgfCAgIHBvcy54XG5cdFx0XHRcdFx0XHRcdC8vIHBvcy55ICAgICAgICAgICAgICAgIHwgICBwb3MueVxuXHRcdFx0XHRcdFx0XHQvLyBwb3MueiAgICAgICAgICAgICAgICB8ICAgbm90IHVzZWRcblx0XHRcdFx0XHRcdFx0Ly8gbm9ybWFsLnggICAgICAgICAgICAgfCAgIGN1cnZlLXR5cGUgKDA6bm90Q3VydmVkLCAxOiBjb252ZXgsIDI6Y29uY2F2ZSlcblx0XHRcdFx0XHRcdFx0Ly8gbm9ybWFsLnkgICAgICAgICAgICAgfCAgIGFscGhhXG5cdFx0XHRcdFx0XHRcdC8vIG5vcm1hbC56ICAgICAgICAgICAgIHwgICBub3QgdXNlZFxuXHRcdFx0XHRcdFx0XHQvLyB1di51ICAgICAgICAgICAgICAgICB8ICAgY3VydmUudVxuXHRcdFx0XHRcdFx0XHQvLyB1di52ICAgICAgICAgICAgICAgICB8ICAgY3VydmUudlxuXHRcdFx0XHRcdFx0XHQvLyB0YW5nZW50LnggICAgICAgICAgICB8ICAgcmVkXG5cdFx0XHRcdFx0XHRcdC8vIHRhbmdlbnQueSAgICAgICAgICAgIHwgICBncmVlblxuXHRcdFx0XHRcdFx0XHQvLyB0YW5nZW50LnogICAgICAgICAgICB8ICAgYmx1ZVxuXHRcdFx0XHRcdFx0XHR2ZXJ0c1tpZHgrK10gPSB4O1xuXHRcdFx0XHRcdFx0XHQvL3V2MltpZHhdID0geDtcblx0XHRcdFx0XHRcdFx0dmVydHNbaWR4KytdID0geTtcblx0XHRcdFx0XHRcdFx0Ly91djJbaWR4XSA9IHk7XG5cdFx0XHRcdFx0XHRcdHZlcnRzW2lkeCsrXSA9IHo7XG5cdFx0XHRcdFx0XHRcdHV2c1t1dl9pZHgrK10gPSB1O1xuXHRcdFx0XHRcdFx0XHR1dnNbdXZfaWR4KytdID0gdjtcblx0XHRcdFx0XHRcdFx0bm9ybWFsc1tuX2lkeCsrXSA9IHR5cGU7XG5cdFx0XHRcdFx0XHRcdG5vcm1hbHNbbl9pZHgrK10gPSBhO1xuXHRcdFx0XHRcdFx0XHRub3JtYWxzW25faWR4KytdID0gMDtcblx0XHRcdFx0XHRcdFx0Ly8gdHJhY2UoXCJyPVwiICsgciArIFwiIGc9XCIgKyBnICsgXCIgYj1cIiArIGIgKyBcIiBhPVwiICsgYSk7XG5cdFx0XHRcdFx0XHRcdHRhbmdlbnRzW3RfaWR4KytdID0gcjtcblx0XHRcdFx0XHRcdFx0dGFuZ2VudHNbdF9pZHgrK10gPSBnO1xuXHRcdFx0XHRcdFx0XHR0YW5nZW50c1t0X2lkeCsrXSA9IGI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIGluIGZ1dHVyZSB3ZSB3aWxsIG9ubHkgaGF2ZSBvbmUgc3RyZWFtIGZvciBhbGwgZmFjZS1pbmRpY2llc1xuXHRcdFx0XHQvLyBvbmx5IGtlZXBpbmcgaXQgc3BsaXQgdXAgZm9yIHRoZSBtb21lbnQsXG5cdFx0XHRcdC8vIHNvIHdlIGNhbiBkZWJ1ZyBieSBjaG9vc2luZyB3aGF0IGtpbmQgb2YgdHJpYW5nbGVzIGFyZSBhZGRlZCB0byBzdWJHZW8uXG5cdFx0XHRcdGVsc2UgaWYgKHN0cl90eXBlID09IDIpIHtcblx0XHRcdFx0XHR3aGlsZSAodGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiA8IHN0cl9lbmQpIHtcblx0XHRcdFx0XHRcdHZhciB0aGlzVmFsOm51bWJlcj0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdFx0XHRcdFx0aW5kaWNlc1tpX2lkeCsrXSA9IHRoaXNWYWw7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0gZWxzZSBpZiAoc3RyX3R5cGUgPT0gMykge1xuXG5cdFx0XHRcdFx0d2hpbGUgKHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPCBzdHJfZW5kKSB7XG5cdFx0XHRcdFx0XHR2YXIgdGhpc1ZhbDpudW1iZXI9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRcdFx0XHRcdGluZGljZXNbaV9pZHgrK10gPSB0aGlzVmFsO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9ZWxzZSBpZiAoc3RyX3R5cGUgPT0gNCkge1xuXG5cdFx0XHRcdFx0d2hpbGUgKHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPCBzdHJfZW5kKSB7XG5cdFx0XHRcdFx0XHR2YXIgdGhpc1ZhbDpudW1iZXI9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRcdFx0XHRcdGluZGljZXNbaV9pZHgrK10gPSB0aGlzVmFsO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9ZWxzZSBpZiAoc3RyX3R5cGUgPT0gNSkge1xuXG5cdFx0XHRcdFx0d2hpbGUgKHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPCBzdHJfZW5kKSB7XG5cdFx0XHRcdFx0XHR2YXIgdGhpc1ZhbDpudW1iZXI9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRcdFx0XHRcdGluZGljZXNbaV9pZHgrK10gPSB0aGlzVmFsO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPSBzdHJfZW5kO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7IC8vIElnbm9yZSBzdWItbWVzaCBhdHRyaWJ1dGVzIGZvciBub3dcblxuXHRcdFx0c3ViX2dlb20gPSBuZXcgVHJpYW5nbGVTdWJHZW9tZXRyeSh0cnVlKTtcblx0XHRcdHN1Yl9nZW9tLmF1dG9EZXJpdmVOb3JtYWxzID0gZmFsc2U7XG5cdFx0XHQvLyB3aGVuIHJlbmRlcmluZyBhcyBcIm5vcm1hbFwiIDNkLWdlb21ldHJ5LCB3ZSBuZWVkIHRvIGF1dG9EZXJpdmUgdGFuZ2VudHNcblx0XHRcdGlmKHRydWUpe1xuXHRcdFx0XHRzdWJfZ2VvbS5hdXRvRGVyaXZlVGFuZ2VudHMgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdFx0Ly8gaWYgdXNpbmcgYSBuZXcgTWF0ZXJpYWwsXG5cdFx0XHRlbHNle1xuXHRcdFx0XHRzdWJfZ2VvbS51cGRhdGVWZXJ0ZXhUYW5nZW50cyh0YW5nZW50cyk7XG5cdFx0XHR9XG5cdFx0XHRzdWJfZ2VvbS51cGRhdGVJbmRpY2VzKGluZGljZXMpO1xuXHRcdFx0c3ViX2dlb20udXBkYXRlUG9zaXRpb25zKHZlcnRzKTtcblx0XHRcdHN1Yl9nZW9tLnVwZGF0ZVVWcyh1dnMpO1xuXHRcdFx0c3ViX2dlb20udXBkYXRlVmVydGV4Tm9ybWFscyhub3JtYWxzKTtcblxuXHRcdFx0Z2VvbS5hZGRTdWJHZW9tZXRyeShzdWJfZ2VvbSk7XG5cblx0XHRcdHN1YnNfcGFyc2VkKys7XG5cdFx0fVxuXHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KDxJQXNzZXQ+IGdlb20sIG5hbWUpO1xuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gZ2VvbTtcblxuXHRcdGlmICh0aGlzLl9kZWJ1Zylcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgVHJpYW5nbGVHZW9tZXRyeTogTmFtZSA9IFwiICsgbmFtZSArIFwifCBJZCA9IFwiICsgc3ViX2dlb20uaWQpO1xuXG5cblx0fVxuXG5cdC8vQmxvY2sgSUQgPSAzXG5cdHByaXZhdGUgcGFyc2VTaGFwZTJERmlsbChibG9ja0lEOm51bWJlcik6dm9pZCB7XG5cblx0XHR2YXIgbmFtZTpzdHJpbmcgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0dmFyIGZpbGxfdHlwZTpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHR2YXIgZmlsbF9wcm9wczpBV0RQcm9wZXJ0aWVzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoezE6QVdEUGFyc2VyLlVJTlQzMn0pOy8vIHsgMTpVSU5UMzIsIDY6QVdEU1RSSU5HIH0gICk7IC8vOyAsIDI6VUlOVDMyLCAzOlVJTlQzMiwgNTpCT09MIH0gKTtcblxuXHRcdC8vY29uc29sZS5sb2coXCJQYXJzZWQgYSBmaWxsXCIpO1xuXHRcdHN3aXRjaCAoZmlsbF90eXBlKSB7XG5cdFx0XHQvLyB0byBkbywgbm90IGFsbCBwcm9wZXJ0aWVzIGFyZSBzZXQgb24gYWxsIHByaW1pdGl2ZXNcblxuXHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiUGFyc2VkIGEgU29saWQgRklMTDogTmFtZSA9IFwiICsgbmFtZSk7XG5cdFx0XHRcdHZhciBtYXRlcmlhbDpUcmlhbmdsZU1ldGhvZE1hdGVyaWFsPW5ldyBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsKGZpbGxfcHJvcHMuZ2V0KDEsIDB4Y2NjY2NjKSk7XG5cdFx0XHRcdG1hdGVyaWFsLmJvdGhTaWRlcz10cnVlO1xuXHRcdFx0XHR0aGlzLl9wRmluYWxpemVBc3NldCg8SUFzc2V0PiBtYXRlcmlhbCwgbmFtZSk7XG5cdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gbWF0ZXJpYWw7XG5cdFx0XHRcdC8vcHJlZmFiID0gbmV3IGF3YXkucHJlZmFicy5QcmltaXRpdmVQbGFuZVByZWZhYihwcm9wcy5nZXQoMTAxLCAxMDApLCBwcm9wcy5nZXQoMTAyLCAxMDApLCBwcm9wcy5nZXQoMzAxLCAxKSwgcHJvcHMuZ2V0KDMwMiwgMSksIHByb3BzLmdldCg3MDEsIHRydWUpLCBwcm9wcy5nZXQoNzAyLCBmYWxzZSkpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIGJpdG1hcCBGSUxMOiBOYW1lID0gXCIgKyBuYW1lKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgbGluZWFyIGdyYWRpZW50IEZJTEw6IE5hbWUgPSBcIiArIG5hbWUpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMzpcblx0XHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSByYWRpYWwgZ3JhZGllbnQgRklMTDogTmFtZSA9IFwiICsgbmFtZSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSB1bmtub3duIGZpbGxzdHlsZTogTmFtZSA9IFwiICsgbmFtZSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0fVxuXG5cdC8vQmxvY2sgSUQgPSA0XG5cdHByaXZhdGUgcGFyc2VUaW1lTGluZShibG9ja0lEOm51bWJlcik6dm9pZCB7XG5cblx0XHR2YXIgaTpudW1iZXI7XG5cdFx0dmFyIGo6bnVtYmVyO1xuXHRcdHZhciBrOm51bWJlcjtcblxuXHRcdHZhciB0aW1lTGluZUNvbnRhaW5lciA9IG5ldyBUaW1lTGluZSgpO1xuXHRcdHZhciBuYW1lID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXHRcdHZhciBpc1NjZW5lID0gISF0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHR2YXIgc2NlbmVJRCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdHZhciBudW1GcmFtZXMgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cblx0XHQvLyB2YXIgcHJldmlvdXNUaW1lTGluZTpUaW1lTGluZUZyYW1lO1xuXHRcdC8vIHZhciBmaWxsX3Byb3BzOkFXRFByb3BlcnRpZXMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7MTpBV0RQYXJzZXIuVUlOVDMyfSk7Ly8geyAxOlVJTlQzMiwgNjpBV0RTVFJJTkcgfSAgKTsgLy87ICwgMjpVSU5UMzIsIDM6VUlOVDMyLCA1OkJPT0wgfSApO1xuXG5cdFx0aWYgKHRoaXMuX2RlYnVnKVxuXHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBUSU1FTElORTogTmFtZSA9IFwiICsgbmFtZSArIFwifCBpc1NjZW5lID0gXCIgKyBpc1NjZW5lICsgXCJ8IHNjZW5lSUQgPSBcIiArIHNjZW5lSUQgKyBcInwgbnVtRnJhbWVzID0gXCIgKyBudW1GcmFtZXMpO1xuXG5cdFx0dmFyIHRvdGFsRHVyYXRpb24gPSAwO1xuXHRcdGZvciAoaSA9IDA7IGkgPCBudW1GcmFtZXM7IGkrKykge1xuXHRcdFx0dmFyIGZyYW1lID0gbmV3IFRpbWVMaW5lRnJhbWUoKTtcblx0XHRcdHZhciB0cmFjZVN0cmluZyA9IFwiZnJhbWUgPSBcIiArIGk7XG5cblx0XHRcdHZhciBmcmFtZUR1cmF0aW9uID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRcdGZyYW1lLnNldEZyYW1lVGltZSh0b3RhbER1cmF0aW9uLCBmcmFtZUR1cmF0aW9uKTtcblx0XHRcdHRvdGFsRHVyYXRpb24gKz0gZnJhbWVEdXJhdGlvbjtcblx0XHRcdC8vY29uc29sZS5sb2coXCJkdXJhdGlvbiA9IFwiICsgZnJhbWVEdXJhdGlvbik7XG5cblx0XHRcdHZhciBudW1MYWJlbHMgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0XHRmb3IgKGogPSAwOyBqIDwgbnVtTGFiZWxzOyBqKyspIHtcblx0XHRcdFx0dmFyIGxhYmVsVHlwZSA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdFx0XHR2YXIgbGFiZWwgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0XHRcdGZyYW1lLmFkZExhYmVsKGxhYmVsLCBsYWJlbFR5cGUpO1xuXHRcdFx0XHR0cmFjZVN0cmluZyArPSBcIlxcbiAgICAgbGFiZWwgPSBcIiArIGxhYmVsICsgXCIgLSBsYWJlbFR5cGUgPSBcIiArIGxhYmVsVHlwZTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIG51bUNvbW1hbmRzID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdFx0dmFyIGNvbW1hbmRTdHJpbmcgPSBcIlxcbiAgICAgIENvbW1hbmRzIFwiICsgbnVtQ29tbWFuZHM7XG5cdFx0XHRmb3IgKGogPSAwOyBqIDwgbnVtQ29tbWFuZHM7IGorKykge1xuXHRcdFx0XHR2YXIgb2JqZWN0SUQ6bnVtYmVyO1xuXHRcdFx0XHR2YXIgcmVzb3VyY2VJRDpudW1iZXI7XG5cdFx0XHRcdHZhciBjb21tYW5kVHlwZSA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblxuXHRcdFx0XHRzd2l0Y2ggKGNvbW1hbmRUeXBlKSB7XG5cblx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0Y2FzZSAyOlxuXG5cdFx0XHRcdFx0XHQvLyBQbGFjZSBPYmplY3QgQ29tbWFuZFxuXHRcdFx0XHRcdFx0dmFyIG5ld09iamVjdFByb3BzID0gbmV3IENvbW1hbmRQcm9wc0Rpc3BsYXlPYmplY3QoKTtcblx0XHRcdFx0XHRcdHZhciBoYXNSZXNvdXJjZSA9ICEhdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkQnl0ZSgpO1xuXHRcdFx0XHRcdFx0dmFyIGhhc0Rpc3BsYXlNYXRyaXggPSAhIXRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZEJ5dGUoKTtcblx0XHRcdFx0XHRcdHZhciBoYXNDb2xvck1hdHJpeCA9ICEhdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkQnl0ZSgpO1xuXHRcdFx0XHRcdFx0dmFyIGhhc0RlcHRoQ2hhbmdlID0gISF0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRCeXRlKCk7XG5cdFx0XHRcdFx0XHR2YXIgaGFzRmlsdGVyQ2hhbmdlID0gISF0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRCeXRlKCk7XG5cdFx0XHRcdFx0XHR2YXIgaGFzQmxlbmRNb2RlQ2hhbmdlID0gISF0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRCeXRlKCk7XG5cdFx0XHRcdFx0XHR2YXIgaGFzRGVwdGhDbGlwQ2hhbmdlID0gISF0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRCeXRlKCk7XG5cdFx0XHRcdFx0XHR2YXIgaGFzVmlzaWJpbGl0eUNoYW5nZSA9ICEhdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkQnl0ZSgpO1xuXG5cdFx0XHRcdFx0XHRvYmplY3RJRCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cblx0XHRcdFx0XHRcdGlmIChoYXNSZXNvdXJjZSkge1xuXHRcdFx0XHRcdFx0XHRyZXNvdXJjZUlEID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRcdFx0XHRcdFx0Y29tbWFuZFN0cmluZyArPSBcIlxcbiAgICAgIC0gQWRkIG5ldyBSZXNvdXJjZSA9IFwiICsgcmVzb3VyY2VJRCArIFwiIGFzIG9iamVjdF9pZCA9IFwiICsgb2JqZWN0SUQ7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRjb21tYW5kU3RyaW5nICs9IFwiXFxuICAgICAgLSBVcGRhdGUgb2JqZWN0X2lkID0gXCIgKyBvYmplY3RJRDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKGhhc0Rpc3BsYXlNYXRyaXgpIHtcblx0XHRcdFx0XHRcdFx0dmFyIHRyYW5zZm9ybUFycmF5Om51bWJlcltdID0gW107XG5cdFx0XHRcdFx0XHRcdHZhciB0aGlzTWF0cml4ID0gbmV3IE1hdHJpeDNEKCk7XG5cdFx0XHRcdFx0XHRcdC8vIFRPRE86IGltcGxlbWVudCB0aGlzIGluIGV4cG9ydGVyIChtYWtlIHRyYW5zZm9ybSBvcHRpb25hbCAzZCk6XG5cdFx0XHRcdFx0XHRcdHZhciBpczNkID0gZmFsc2U7IC8vICEhdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkQnl0ZSgpO1xuXHRcdFx0XHRcdFx0XHRpZiAoaXMzZCkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXNNYXRyaXggPSB0aGlzLnBhcnNlTWF0cml4M0QoKTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGsgPSAwOyBrIDwgNjsgaysrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2Zvcm1BcnJheS5wdXNoKHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZEZsb2F0KCkpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHQvLyBUT0RPOiBzZXQgcm90YXRpb24gYW5kIHNjYWxlXG5cdFx0XHRcdFx0XHRcdFx0dGhpc01hdHJpeC5wb3NpdGlvbiA9IG5ldyBWZWN0b3IzRCh0cmFuc2Zvcm1BcnJheVs0XSwgdHJhbnNmb3JtQXJyYXlbNV0sIDApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdG5ld09iamVjdFByb3BzLnNldERpc3BsYXltYXRyaXgodGhpc01hdHJpeCk7XG5cdFx0XHRcdFx0XHRcdGNvbW1hbmRTdHJpbmcgKz0gXCJcXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtQXJyYXkgPSBcIiArIHRyYW5zZm9ybUFycmF5O1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoaGFzQ29sb3JNYXRyaXgpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGNvbG9yTWF0cml4Om51bWJlcltdID0gW107XG5cdFx0XHRcdFx0XHRcdGZvciAoayA9IDA7IGsgPCAyMDsgaysrKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29sb3JNYXRyaXgucHVzaCh0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRGbG9hdCgpKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHQvLyBUT0RPOiBzZXQgQ29sb3JUcmFuc2Zvcm0gb24gb2JqZWN0UHJvcHNcblx0XHRcdFx0XHRcdFx0Y29tbWFuZFN0cmluZyArPSBcIlxcbiAgICAgICAgICAgICAgICBjb2xvck1hdHJpeCA9IFwiICsgY29sb3JNYXRyaXg7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChoYXNEZXB0aENoYW5nZSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgbmV3RGVwdGggPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdFx0XHRcdFx0XHRjb21tYW5kU3RyaW5nICs9IFwiXFxuICAgICAgICAgICAgICAgIERlcHRoID0gXCIgKyBuZXdEZXB0aDtcblx0XHRcdFx0XHRcdFx0Ly8gVE9ETzogc2V0IGRlcHRoIG9uIG9iamVjdFByb3BzXG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChoYXNGaWx0ZXJDaGFuZ2UpIHtcblx0XHRcdFx0XHRcdFx0Ly8gVE9ETzogYWRkIGZpbHRlclxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoaGFzQmxlbmRNb2RlQ2hhbmdlKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBuZXdCbGVuZE1vZGUgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHRcdFx0XHRcdFx0Y29tbWFuZFN0cmluZyArPSBcIlxcbiAgICAgICAgICAgICAgICBCbGVuZE1vZGUgPSBcIiArIG5ld0JsZW5kTW9kZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKGhhc0RlcHRoQ2xpcENoYW5nZSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgbmV3Q2xpcERlcHRoID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRcdFx0XHRcdFx0Y29tbWFuZFN0cmluZyArPSBcIlxcbiAgICAgICAgICAgICAgICBDbGlwRGVwdGggPSBcIiArIG5ld0NsaXBEZXB0aDtcblx0XHRcdFx0XHRcdFx0Ly8gVE9ETzogc2V0IGRlcHRoQ2xpcENoYW5nZSBvbiBvYmplY3RQcm9wc1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoaGFzVmlzaWJpbGl0eUNoYW5nZSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgbmV3VmlzaWJpbGl0eSA9IEJvb2xlYW4odGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkQnl0ZSgpKTtcblx0XHRcdFx0XHRcdFx0Y29tbWFuZFN0cmluZyArPSBcIlxcbiAgICAgICAgICAgICAgICBWaXNpYml0aWx5ID0gXCIgKyBuZXdWaXNpYmlsaXR5O1xuXHRcdFx0XHRcdFx0XHQvLyBUT0RPOiBzZXQgdmlzaWJpbGl0eUNoYW5nZSBvbiBvYmplY3RQcm9wc1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR2YXIgbnVtRmlsbHMgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0XHRcdFx0XHRjb21tYW5kU3RyaW5nICs9IFwiXFxuICAgICAgICAgICAgICAgIG51bWJlciBvZiBmaWxscyA9IFwiICsgbnVtRmlsbHM7XG5cdFx0XHRcdFx0XHR2YXIgZmlsbHNJRHM6bnVtYmVyW10gPSBbXTtcblx0XHRcdFx0XHRcdGZvciAoayA9IDA7IGsgPCBudW1GaWxsczsgaysrKSB7XG5cdFx0XHRcdFx0XHRcdGZpbGxzSURzLnB1c2godGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKSk7XG5cdFx0XHRcdFx0XHRcdGNvbW1hbmRTdHJpbmcgKz0gXCJcXG4gICAgICAgICAgICAgICAgICAgIGlkIG9mIGZpbGwgPSBcIiArIGZpbGxzSURzW2tdO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHR2YXIgaW5zdGFuY2VOYW1lID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXHRcdFx0XHRcdFx0aWYgKGluc3RhbmNlTmFtZS5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdFx0bmV3T2JqZWN0UHJvcHMuc2V0SW5zdGFuY2VuYW1lKGluc3RhbmNlTmFtZSk7XG5cdFx0XHRcdFx0XHRcdGNvbW1hbmRTdHJpbmcgKz0gXCJcXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VOYW1lID0gXCIgKyBpbnN0YW5jZU5hbWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIGlmIHRoaXMgaXMgYSBcIkFERCBORVcgT0JKRUNUXCItY29tbWFuZCxcblx0XHRcdFx0XHRcdC8vIHdlIG5lZWQgdG8gbG9va3VwIHRoZSBuZXcgb2JqZWN0IGJ5IEFXRCBJRC5cblx0XHRcdFx0XHRcdGlmIChoYXNSZXNvdXJjZSkge1xuXHRcdFx0XHRcdFx0XHQvLyBzb3VuZCBpcyBhZGRlZCB0byB0aW1lbGluZSB3aXRoIGRlZGljYXRlZCBDb21tYW5kLCBhcyBpdCBpcyBubyBkaXNwbGF5LW9iamVjdCAoaGFzIG5vIG1hdHJpeCBldGMpXG5cdFx0XHRcdFx0XHRcdC8vIGNoZWNrIGlmIGEgR2VvbWV0cnkgY2FuIGJlIGZvdW5kIGF0IHRoZSByZXNvdXJjZUlEIChBV0QtSUQpXG5cdFx0XHRcdFx0XHRcdHZhciByZXR1cm5lZEFycmF5OmFueVtdID0gdGhpcy5nZXRBc3NldEJ5SUQocmVzb3VyY2VJRCwgWyBBc3NldFR5cGUuR0VPTUVUUlkgXSk7XG5cdFx0XHRcdFx0XHRcdGlmIChyZXR1cm5lZEFycmF5WzBdKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGdlb20gPSA8R2VvbWV0cnk+cmV0dXJuZWRBcnJheVsxXTtcblx0XHRcdFx0XHRcdFx0XHR2YXIgbmV3TWVzaCA9IG5ldyBNZXNoKGdlb20pO1xuXHRcdFx0XHRcdFx0XHRcdC8vIGdlb21ldHJ5IGZvdW5kLiBjcmVhdGUgbmV3IENvbW1hbmQsIGFkZCB0aGUgcHJvcHMgYW5kIHRoZSBtYXRlcmlhbHMgdG8gaXRcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGsgPSAwOyBrIDwgbnVtRmlsbHM7IGsrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIHJldHVybmVkQXJyYXkyOmFueVtdID0gdGhpcy5nZXRBc3NldEJ5SUQoZmlsbHNJRHNba10sIFsgQXNzZXRUeXBlLk1BVEVSSUFMIF0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKHJldHVybmVkQXJyYXkyWzBdKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChuZXdNZXNoLnN1Yk1lc2hlcy5sZW5ndGggPiBrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bmV3TWVzaC5zdWJNZXNoZXNba10ubWF0ZXJpYWwgPSByZXR1cm5lZEFycmF5MlsxXTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR2YXIgbmV3VGltZUxpbmVNZXNoID0gbmV3IFRpbWVMaW5lT2JqZWN0KDxJQXNzZXQ+bmV3TWVzaCwgb2JqZWN0SUQsIG5ldyBDb21tYW5kUHJvcHNEaXNwbGF5T2JqZWN0KCkpO1xuXHRcdFx0XHRcdFx0XHRcdHRpbWVMaW5lQ29udGFpbmVyLmFkZFRpbWVMaW5lT2JqZWN0KG5ld1RpbWVMaW5lTWVzaCk7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIG5ld0NvbW1hbmRhZGRNZXNoID0gbmV3IEZyYW1lQ29tbWFuZChuZXdUaW1lTGluZU1lc2gpO1xuXHRcdFx0XHRcdFx0XHRcdG5ld0NvbW1hbmRhZGRNZXNoLmNvbW1hbmRQcm9wcyA9IG5ld09iamVjdFByb3BzO1xuXHRcdFx0XHRcdFx0XHRcdGZyYW1lLmFkZENvbW1hbmQobmV3Q29tbWFuZGFkZE1lc2gpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdC8vIG5vIGdlb21ldHJ5IGZvdW5kLCBzbyB3ZSBjaGVjayBmb3IgVElNRUxJTkUuXG5cdFx0XHRcdFx0XHRcdFx0dmFyIHJldHVybmVkQXJyYXk6YW55W10gPSB0aGlzLmdldEFzc2V0QnlJRChyZXNvdXJjZUlELCBbIEFzc2V0VHlwZS5USU1FTElORSBdKTtcblx0XHRcdFx0XHRcdFx0XHRpZiAocmV0dXJuZWRBcnJheVswXSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0Ly8gdGltZWxpbmUgZm91bmQuIGNyZWF0ZSBjb21tYW5kIGFuZCBhZGQgaXQgdG8gdGhlIGZyYW1lXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgbmV3VGltZUxpbmVUaW1lTGluZSA9IG5ldyBUaW1lTGluZU9iamVjdCg8VGltZUxpbmU+cmV0dXJuZWRBcnJheVsxXSwgb2JqZWN0SUQsIG5ldyBDb21tYW5kUHJvcHNEaXNwbGF5T2JqZWN0KCkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0dGltZUxpbmVDb250YWluZXIuYWRkVGltZUxpbmVPYmplY3QobmV3VGltZUxpbmVUaW1lTGluZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgbmV3Q29tbWFuZEFkZFRpbWVMaW5lID0gbmV3IEZyYW1lQ29tbWFuZChuZXdUaW1lTGluZVRpbWVMaW5lKTtcblx0XHRcdFx0XHRcdFx0XHRcdG5ld0NvbW1hbmRBZGRUaW1lTGluZS5jb21tYW5kUHJvcHMgPSBuZXdPYmplY3RQcm9wcztcblx0XHRcdFx0XHRcdFx0XHRcdGZyYW1lLmFkZENvbW1hbmQobmV3Q29tbWFuZEFkZFRpbWVMaW5lKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZXtcblx0XHRcdFx0XHRcdFx0Ly8gZ2V0IHRoZSBleGlzdGluZyBUaW1lTGluZW9iamVjdCBmcm9ubSB0aGUgdGltZWxpbmVcblx0XHRcdFx0XHRcdFx0dmFyIG5ld1RpbWVMaW5lVXBkYXRlID0gdGltZUxpbmVDb250YWluZXIuZ2V0VGltZUxpbmVPYmplY3RCeUlEKG9iamVjdElEKTtcblx0XHRcdFx0XHRcdFx0dmFyIG5ld0NvbW1hbmR1cGRhdGUgPSBuZXcgRnJhbWVDb21tYW5kKG5ld1RpbWVMaW5lVXBkYXRlKTtcblx0XHRcdFx0XHRcdFx0Ly9uZXdDb21tYW5kdXBkYXRlLmNvbW1hbmRQcm9wcz1uZXdPYmplY3RQcm9wcztcblx0XHRcdFx0XHRcdFx0Ly8gVE9ETzpcblx0XHRcdFx0XHRcdFx0ZnJhbWUuYWRkQ29tbWFuZChuZXdDb21tYW5kdXBkYXRlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAzOlxuXG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgT2JqZWN0IENvbW1hbmRcblx0XHRcdFx0XHRcdG9iamVjdElEID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRcdFx0XHRcdHZhciBuZXdUaW1lTGluZVVwZGF0ZSA9IHRpbWVMaW5lQ29udGFpbmVyLmdldFRpbWVMaW5lT2JqZWN0QnlJRChvYmplY3RJRCk7XG5cdFx0XHRcdFx0XHR2YXIgbmV3Q29tbWFuZHVwZGF0ZSA9IG5ldyBGcmFtZUNvbW1hbmQobmV3VGltZUxpbmVVcGRhdGUpO1xuXHRcdFx0XHRcdFx0bmV3Q29tbWFuZHVwZGF0ZS5hY3RpdmF0ZU9iaiA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0ZnJhbWUuYWRkQ29tbWFuZChuZXdDb21tYW5kdXBkYXRlKTtcblx0XHRcdFx0XHRcdC8vbmV3Q29tbWFuZHVwZGF0ZS5jb21tYW5kUHJvcHM9bmV3T2JqZWN0UHJvcHM7XG5cdFx0XHRcdFx0XHRjb21tYW5kU3RyaW5nICs9IFwiXFxuICAgICAgIC0gUmVtb3ZlIG9iamVjdCB3aXRoIElEOiBcIiArIG9iamVjdElEO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlIDQ6XG5cblx0XHRcdFx0XHRcdC8vIEFkZCBTb3VuZCBDb21tYW5kXG5cdFx0XHRcdFx0XHQvLyBUT0RPOiBjcmVhdGUgQ29tbWFuZFByb3BzU291bmQgYW5kIGNoZWNrIHdoaWNoIGFzc2V0IHRvIHVzZVxuXHRcdFx0XHRcdFx0b2JqZWN0SUQgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdFx0XHRcdFx0cmVzb3VyY2VJRCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0XHRcdFx0XHQvLyBUT0RPOiBpbXBsZW1lbnQgc291bmQgaW4gdGltZWxpbmVcblx0XHRcdFx0XHRcdGNvbW1hbmRTdHJpbmcgKz0gXCJcXG4gICAgICAtIEFkZCBuZXcgU291bmQgQVdELUlEID0gXCIgKyByZXNvdXJjZUlELnRvU3RyaW5nKCkgKyBcIiBhcyBvYmplY3RfaWQgPSBcIiArIG9iamVjdElELnRvU3RyaW5nKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cblx0XHRcdFx0XHRcdGNvbW1hbmRTdHJpbmcgKz0gXCJcXG4gICAgICAgLSBVbmtub3duIENvbW1hbmQgVHlwZSA9IFwiICsgY29tbWFuZFR5cGU7XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHZhciBsZW5ndGhfY29kZSA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0XHRpZiAobGVuZ3RoX2NvZGUgPiAwKSB7XG5cdFx0XHRcdHZhciBmcmFtZV9jb2RlID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVVRGQnl0ZXMobGVuZ3RoX2NvZGUpO1xuXHRcdFx0XHRmcmFtZS5hZGRUb1NjcmlwdChmcmFtZV9jb2RlKTtcblx0XHRcdFx0dHJhY2VTdHJpbmcgKz0gXCJcXG5mcmFtZS1jb2RlID0gXCIgKyBmcmFtZV9jb2RlO1xuXHRcdFx0fVxuXHRcdFx0dHJhY2VTdHJpbmcgKz0gY29tbWFuZFN0cmluZztcblx0XHRcdC8vdHJhY2UoXCJsZW5ndGhfY29kZSA9IFwiK2xlbmd0aF9jb2RlK1wiIGZyYW1lX2NvZGUgPSBcIitmcmFtZV9jb2RlKTtcblx0XHRcdHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7Ly8gdXNlciBhdHRyaWJ1dGVzIC0gc2tpcCBmb3Igbm93XG5cdFx0XHQvL3RoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpOyAvLyBJZ25vcmUgc3ViLW1lc2ggYXR0cmlidXRlcyBmb3Igbm93XG5cdFx0XHQvL2NvbnNvbGUubG9nKHRyYWNlU3RyaW5nKTtcblx0XHRcdHRpbWVMaW5lQ29udGFpbmVyLmFkZEZyYW1lKGZyYW1lKTtcblxuXHRcdH1cblxuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KDxJQXNzZXQ+dGltZUxpbmVDb250YWluZXIsIG5hbWUpO1xuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gdGltZUxpbmVDb250YWluZXI7XG5cdFx0dGhpcy5wYXJzZVByb3BlcnRpZXMobnVsbCk7XG5cdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdH1cblxuXHQvL0Jsb2NrIElEID0gMVxuXHRwcml2YXRlIHBhcnNlVHJpYW5nbGVHZW9tZXRyaWVCbG9jayhibG9ja0lEOm51bWJlcik6dm9pZFxuXHR7XG5cblx0XHR2YXIgZ2VvbTpHZW9tZXRyeSA9IG5ldyBHZW9tZXRyeSgpO1xuXG5cdFx0Ly8gUmVhZCBuYW1lIGFuZCBzdWIgY291bnRcblx0XHR2YXIgbmFtZTpzdHJpbmcgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0dmFyIG51bV9zdWJzOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblxuXHRcdC8vIFJlYWQgb3B0aW9uYWwgcHJvcGVydGllc1xuXHRcdHZhciBwcm9wczpBV0RQcm9wZXJ0aWVzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoezE6dGhpcy5fZ2VvTnJUeXBlLCAyOnRoaXMuX2dlb05yVHlwZX0pO1xuXHRcdHZhciBnZW9TY2FsZVU6bnVtYmVyID0gcHJvcHMuZ2V0KDEsIDEpO1xuXHRcdHZhciBnZW9TY2FsZVY6bnVtYmVyID0gcHJvcHMuZ2V0KDIsIDEpO1xuXG5cdFx0Ly8gTG9vcCB0aHJvdWdoIHN1YiBtZXNoZXNcblx0XHR2YXIgc3Vic19wYXJzZWQ6bnVtYmVyID0gMDtcblx0XHR3aGlsZSAoc3Vic19wYXJzZWQgPCBudW1fc3Vicykge1xuXHRcdFx0dmFyIGk6bnVtYmVyO1xuXHRcdFx0dmFyIHNtX2xlbjpudW1iZXIsIHNtX2VuZDpudW1iZXI7XG5cdFx0XHR2YXIgc3ViX2dlb206VHJpYW5nbGVTdWJHZW9tZXRyeTtcblx0XHRcdHZhciB3X2luZGljZXM6QXJyYXk8bnVtYmVyPjtcblx0XHRcdHZhciB3ZWlnaHRzOkFycmF5PG51bWJlcj47XG5cblx0XHRcdHNtX2xlbiA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0XHRzbV9lbmQgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uICsgc21fbGVuO1xuXG5cdFx0XHQvLyBJZ25vcmUgZm9yIG5vd1xuXHRcdFx0dmFyIHN1YlByb3BzOkFXRFByb3BlcnRpZXMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7MTp0aGlzLl9nZW9OclR5cGUsIDI6dGhpcy5fZ2VvTnJUeXBlfSk7XG5cdFx0XHQvLyBMb29wIHRocm91Z2ggZGF0YSBzdHJlYW1zXG5cdFx0XHR3aGlsZSAodGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiA8IHNtX2VuZCkge1xuXHRcdFx0XHR2YXIgaWR4Om51bWJlciA9IDA7XG5cdFx0XHRcdHZhciBzdHJfZnR5cGU6bnVtYmVyLCBzdHJfdHlwZTpudW1iZXIsIHN0cl9sZW46bnVtYmVyLCBzdHJfZW5kOm51bWJlcjtcblxuXHRcdFx0XHQvLyBUeXBlLCBmaWVsZCB0eXBlLCBsZW5ndGhcblx0XHRcdFx0c3RyX3R5cGUgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHRcdFx0c3RyX2Z0eXBlID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRCeXRlKCk7XG5cdFx0XHRcdHN0cl9sZW4gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdFx0XHRzdHJfZW5kID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiArIHN0cl9sZW47XG5cblx0XHRcdFx0dmFyIHg6bnVtYmVyLCB5Om51bWJlciwgejpudW1iZXI7XG5cblx0XHRcdFx0aWYgKHN0cl90eXBlID09IDEpIHtcblx0XHRcdFx0XHR2YXIgdmVydHM6QXJyYXk8bnVtYmVyPiA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cblx0XHRcdFx0XHR3aGlsZSAodGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiA8IHN0cl9lbmQpIHtcblx0XHRcdFx0XHRcdC8vIFRPRE86IFJlc3BlY3Qgc3RyZWFtIGZpZWxkIHR5cGVcblx0XHRcdFx0XHRcdHggPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lHZW8pO1xuXHRcdFx0XHRcdFx0eSA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeUdlbyk7XG5cdFx0XHRcdFx0XHR6ID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5R2VvKTtcblxuXHRcdFx0XHRcdFx0dmVydHNbaWR4KytdID0geDtcblx0XHRcdFx0XHRcdHZlcnRzW2lkeCsrXSA9IHk7XG5cdFx0XHRcdFx0XHR2ZXJ0c1tpZHgrK10gPSB6O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmIChzdHJfdHlwZSA9PSAyKSB7XG5cdFx0XHRcdFx0dmFyIGluZGljZXM6QXJyYXk8bnVtYmVyPiA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cblx0XHRcdFx0XHR3aGlsZSAodGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiA8IHN0cl9lbmQpIHtcblx0XHRcdFx0XHRcdC8vIFRPRE86IFJlc3BlY3Qgc3RyZWFtIGZpZWxkIHR5cGVcblx0XHRcdFx0XHRcdGluZGljZXNbaWR4KytdID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9IGVsc2UgaWYgKHN0cl90eXBlID09IDMpIHtcblx0XHRcdFx0XHR2YXIgdXZzOkFycmF5PG51bWJlcj4gPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuXHRcdFx0XHRcdHdoaWxlICh0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uIDwgc3RyX2VuZCkge1xuXHRcdFx0XHRcdFx0dXZzW2lkeCsrXSA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeUdlbyk7XG5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoc3RyX3R5cGUgPT0gNCkge1xuXG5cdFx0XHRcdFx0dmFyIG5vcm1hbHM6QXJyYXk8bnVtYmVyPiA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cblx0XHRcdFx0XHR3aGlsZSAodGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiA8IHN0cl9lbmQpIHtcblx0XHRcdFx0XHRcdG5vcm1hbHNbaWR4KytdID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5R2VvKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBlbHNlIGlmIChzdHJfdHlwZSA9PSA2KSB7XG5cdFx0XHRcdFx0d19pbmRpY2VzID0gQXJyYXk8bnVtYmVyPigpO1xuXG5cdFx0XHRcdFx0d2hpbGUgKHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPCBzdHJfZW5kKSB7XG5cdFx0XHRcdFx0XHR3X2luZGljZXNbaWR4KytdID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpKjM7IC8vIFRPRE86IFJlc3BlY3Qgc3RyZWFtIGZpZWxkIHR5cGVcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBlbHNlIGlmIChzdHJfdHlwZSA9PSA3KSB7XG5cblx0XHRcdFx0XHR3ZWlnaHRzID0gbmV3IEFycmF5PG51bWJlcj4oKTtcblxuXHRcdFx0XHRcdHdoaWxlICh0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uIDwgc3RyX2VuZCkge1xuXHRcdFx0XHRcdFx0d2VpZ2h0c1tpZHgrK10gPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lHZW8pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uID0gc3RyX2VuZDtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpOyAvLyBJZ25vcmUgc3ViLW1lc2ggYXR0cmlidXRlcyBmb3Igbm93XG5cblx0XHRcdHN1Yl9nZW9tID0gbmV3IFRyaWFuZ2xlU3ViR2VvbWV0cnkodHJ1ZSk7XG5cdFx0XHRpZiAod2VpZ2h0cylcblx0XHRcdFx0c3ViX2dlb20uam9pbnRzUGVyVmVydGV4ID0gd2VpZ2h0cy5sZW5ndGgvKHZlcnRzLmxlbmd0aC8zKTtcblx0XHRcdGlmIChub3JtYWxzKVxuXHRcdFx0XHRzdWJfZ2VvbS5hdXRvRGVyaXZlTm9ybWFscyA9IGZhbHNlO1xuXHRcdFx0aWYgKHV2cylcblx0XHRcdFx0c3ViX2dlb20uYXV0b0Rlcml2ZVVWcyA9IGZhbHNlO1xuXHRcdFx0c3ViX2dlb20udXBkYXRlSW5kaWNlcyhpbmRpY2VzKTtcblx0XHRcdHN1Yl9nZW9tLnVwZGF0ZVBvc2l0aW9ucyh2ZXJ0cyk7XG5cdFx0XHRzdWJfZ2VvbS51cGRhdGVWZXJ0ZXhOb3JtYWxzKG5vcm1hbHMpO1xuXHRcdFx0c3ViX2dlb20udXBkYXRlVVZzKHV2cyk7XG5cdFx0XHRzdWJfZ2VvbS51cGRhdGVWZXJ0ZXhUYW5nZW50cyhudWxsKTtcblx0XHRcdHN1Yl9nZW9tLnVwZGF0ZUpvaW50V2VpZ2h0cyh3ZWlnaHRzKTtcblx0XHRcdHN1Yl9nZW9tLnVwZGF0ZUpvaW50SW5kaWNlcyh3X2luZGljZXMpO1xuXG5cdFx0XHR2YXIgc2NhbGVVOm51bWJlciA9IHN1YlByb3BzLmdldCgxLCAxKTtcblx0XHRcdHZhciBzY2FsZVY6bnVtYmVyID0gc3ViUHJvcHMuZ2V0KDIsIDEpO1xuXHRcdFx0dmFyIHNldFN1YlVWczpib29sZWFuID0gZmFsc2U7IC8vdGhpcyBzaG91bGQgcmVtYWluIGZhbHNlIGF0bSwgYmVjYXVzZSBpbiBBd2F5QnVpbGRlciB0aGUgdXYgaXMgb25seSBzY2FsZWQgYnkgdGhlIGdlb21ldHJ5XG5cblx0XHRcdGlmICgoZ2VvU2NhbGVVICE9IHNjYWxlVSkgfHwgKGdlb1NjYWxlViAhPSBzY2FsZVYpKSB7XG5cdFx0XHRcdHNldFN1YlVWcyA9IHRydWU7XG5cdFx0XHRcdHNjYWxlVSA9IGdlb1NjYWxlVS9zY2FsZVU7XG5cdFx0XHRcdHNjYWxlViA9IGdlb1NjYWxlVi9zY2FsZVY7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChzZXRTdWJVVnMpXG5cdFx0XHRcdHN1Yl9nZW9tLnNjYWxlVVYoc2NhbGVVLCBzY2FsZVYpO1xuXG5cdFx0XHRnZW9tLmFkZFN1Ykdlb21ldHJ5KHN1Yl9nZW9tKTtcblxuXHRcdFx0Ly8gVE9ETzogU29tZWhvdyBtYXAgaW4tc3ViIHRvIG91dC1zdWIgaW5kaWNlcyB0byBlbmFibGUgbG9vay11cFxuXHRcdFx0Ly8gd2hlbiBjcmVhdGluZyBtZXNoZXMgKGFuZCB0aGVpciBtYXRlcmlhbCBhc3NpZ25tZW50cy4pXG5cblx0XHRcdHN1YnNfcGFyc2VkKys7XG5cdFx0fVxuXHRcdGlmICgoZ2VvU2NhbGVVICE9IDEpIHx8IChnZW9TY2FsZVYgIT0gMSkpXG5cdFx0XHRnZW9tLnNjYWxlVVYoZ2VvU2NhbGVVLCBnZW9TY2FsZVYpO1xuXHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KDxJQXNzZXQ+IGdlb20sIG5hbWUpO1xuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gZ2VvbTtcblxuXHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBUcmlhbmdsZUdlb21ldHJ5OiBOYW1lID0gXCIgKyBuYW1lICsgXCJ8IElkID0gXCIgKyBzdWJfZ2VvbS5pZCk7XG5cdFx0fVxuXG5cdH1cblxuXHQvL0Jsb2NrIElEID0gMTFcblx0cHJpdmF0ZSBwYXJzZVByaW1pdHZlcyhibG9ja0lEOm51bWJlcik6dm9pZFxuXHR7XG5cdFx0dmFyIG5hbWU6c3RyaW5nO1xuXHRcdHZhciBwcmVmYWI6UHJlZmFiQmFzZTtcblx0XHR2YXIgcHJpbVR5cGU6bnVtYmVyO1xuXHRcdHZhciBzdWJzX3BhcnNlZDpudW1iZXI7XG5cdFx0dmFyIHByb3BzOkFXRFByb3BlcnRpZXM7XG5cdFx0dmFyIGJzbTpNYXRyaXgzRDtcblxuXHRcdC8vIFJlYWQgbmFtZSBhbmQgc3ViIGNvdW50XG5cdFx0bmFtZSA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblx0XHRwcmltVHlwZSA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdHByb3BzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoezEwMTp0aGlzLl9nZW9OclR5cGUsIDEwMjp0aGlzLl9nZW9OclR5cGUsIDEwMzp0aGlzLl9nZW9OclR5cGUsIDExMDp0aGlzLl9nZW9OclR5cGUsIDExMTp0aGlzLl9nZW9OclR5cGUsIDMwMTpBV0RQYXJzZXIuVUlOVDE2LCAzMDI6QVdEUGFyc2VyLlVJTlQxNiwgMzAzOkFXRFBhcnNlci5VSU5UMTYsIDcwMTpBV0RQYXJzZXIuQk9PTCwgNzAyOkFXRFBhcnNlci5CT09MLCA3MDM6QVdEUGFyc2VyLkJPT0wsIDcwNDpBV0RQYXJzZXIuQk9PTH0pO1xuXG5cdFx0dmFyIHByaW1pdGl2ZVR5cGVzOkFycmF5PHN0cmluZz4gPSBbXCJVbnN1cHBvcnRlZCBUeXBlLUlEXCIsIFwiUHJpbWl0aXZlUGxhbmVQcmVmYWJcIiwgXCJQcmltaXRpdmVDdWJlUHJlZmFiXCIsIFwiUHJpbWl0aXZlU3BoZXJlUHJlZmFiXCIsIFwiUHJpbWl0aXZlQ3lsaW5kZXJQcmVmYWJcIiwgXCJQcmltaXRpdmVzQ29uZVByZWZhYlwiLCBcIlByaW1pdGl2ZXNDYXBzdWxlUHJlZmFiXCIsIFwiUHJpbWl0aXZlc1RvcnVzUHJlZmFiXCJdXG5cblx0XHRzd2l0Y2ggKHByaW1UeXBlKSB7XG5cdFx0XHQvLyB0byBkbywgbm90IGFsbCBwcm9wZXJ0aWVzIGFyZSBzZXQgb24gYWxsIHByaW1pdGl2ZXNcblxuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRwcmVmYWIgPSBuZXcgUHJpbWl0aXZlUGxhbmVQcmVmYWIocHJvcHMuZ2V0KDEwMSwgMTAwKSwgcHJvcHMuZ2V0KDEwMiwgMTAwKSwgcHJvcHMuZ2V0KDMwMSwgMSksIHByb3BzLmdldCgzMDIsIDEpLCBwcm9wcy5nZXQoNzAxLCB0cnVlKSwgcHJvcHMuZ2V0KDcwMiwgZmFsc2UpKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0cHJlZmFiID0gbmV3IFByaW1pdGl2ZUN1YmVQcmVmYWIocHJvcHMuZ2V0KDEwMSwgMTAwKSwgcHJvcHMuZ2V0KDEwMiwgMTAwKSwgcHJvcHMuZ2V0KDEwMywgMTAwKSwgcHJvcHMuZ2V0KDMwMSwgMSksIHByb3BzLmdldCgzMDIsIDEpLCBwcm9wcy5nZXQoMzAzLCAxKSwgcHJvcHMuZ2V0KDcwMSwgdHJ1ZSkpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRwcmVmYWIgPSBuZXcgUHJpbWl0aXZlU3BoZXJlUHJlZmFiKHByb3BzLmdldCgxMDEsIDUwKSwgcHJvcHMuZ2V0KDMwMSwgMTYpLCBwcm9wcy5nZXQoMzAyLCAxMiksIHByb3BzLmdldCg3MDEsIHRydWUpKTtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgNDpcblx0XHRcdFx0cHJlZmFiID0gbmV3IFByaW1pdGl2ZUN5bGluZGVyUHJlZmFiKHByb3BzLmdldCgxMDEsIDUwKSwgcHJvcHMuZ2V0KDEwMiwgNTApLCBwcm9wcy5nZXQoMTAzLCAxMDApLCBwcm9wcy5nZXQoMzAxLCAxNiksIHByb3BzLmdldCgzMDIsIDEpLCB0cnVlLCB0cnVlLCB0cnVlKTsgLy8gYm9vbDcwMSwgYm9vbDcwMiwgYm9vbDcwMywgYm9vbDcwNCk7XG5cdFx0XHRcdGlmICghcHJvcHMuZ2V0KDcwMSwgdHJ1ZSkpXG5cdFx0XHRcdFx0KDxQcmltaXRpdmVDeWxpbmRlclByZWZhYj5wcmVmYWIpLnRvcENsb3NlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZiAoIXByb3BzLmdldCg3MDIsIHRydWUpKVxuXHRcdFx0XHRcdCg8UHJpbWl0aXZlQ3lsaW5kZXJQcmVmYWI+cHJlZmFiKS5ib3R0b21DbG9zZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYgKCFwcm9wcy5nZXQoNzAzLCB0cnVlKSlcblx0XHRcdFx0XHQoPFByaW1pdGl2ZUN5bGluZGVyUHJlZmFiPnByZWZhYikueVVwID0gZmFsc2U7XG5cblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgNTpcblx0XHRcdFx0cHJlZmFiID0gbmV3IFByaW1pdGl2ZUNvbmVQcmVmYWIocHJvcHMuZ2V0KDEwMSwgNTApLCBwcm9wcy5nZXQoMTAyLCAxMDApLCBwcm9wcy5nZXQoMzAxLCAxNiksIHByb3BzLmdldCgzMDIsIDEpLCBwcm9wcy5nZXQoNzAxLCB0cnVlKSwgcHJvcHMuZ2V0KDcwMiwgdHJ1ZSkpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSA2OlxuXHRcdFx0XHRwcmVmYWIgPSBuZXcgUHJpbWl0aXZlQ2Fwc3VsZVByZWZhYihwcm9wcy5nZXQoMTAxLCA1MCksIHByb3BzLmdldCgxMDIsIDEwMCksIHByb3BzLmdldCgzMDEsIDE2KSwgcHJvcHMuZ2V0KDMwMiwgMTUpLCBwcm9wcy5nZXQoNzAxLCB0cnVlKSk7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIDc6XG5cdFx0XHRcdHByZWZhYiA9IG5ldyBQcmltaXRpdmVUb3J1c1ByZWZhYihwcm9wcy5nZXQoMTAxLCA1MCksIHByb3BzLmdldCgxMDIsIDUwKSwgcHJvcHMuZ2V0KDMwMSwgMTYpLCBwcm9wcy5nZXQoMzAyLCA4KSwgcHJvcHMuZ2V0KDcwMSwgdHJ1ZSkpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cHJlZmFiID0gbmV3IFByZWZhYkJhc2UoKTtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJFUlJPUjogVU5TVVBQT1JURUQgUFJFRkFCX1RZUEVcIik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdGlmICgocHJvcHMuZ2V0KDExMCwgMSkgIT0gMSkgfHwgKHByb3BzLmdldCgxMTEsIDEpICE9IDEpKSB7XG5cdFx0XHQvL2dlb20uc3ViR2VvbWV0cmllcztcblx0XHRcdC8vZ2VvbS5zY2FsZVVWKHByb3BzLmdldCgxMTAsIDEpLCBwcm9wcy5nZXQoMTExLCAxKSk7IC8vVE9ETyBhZGQgYmFjayBzY2FsaW5nIHRvIHByZWZhYnNcblx0XHR9XG5cblx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHRwcmVmYWIubmFtZSA9IG5hbWU7XG5cdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQocHJlZmFiLCBuYW1lKTtcblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IHByZWZhYjtcblxuXHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0aWYgKChwcmltVHlwZSA8IDApIHx8IChwcmltVHlwZSA+IDcpKSB7XG5cdFx0XHRcdHByaW1UeXBlID0gMDtcblx0XHRcdH1cblx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgUHJpbWl2aXRlOiBOYW1lID0gXCIgKyBuYW1lICsgXCJ8IHR5cGUgPSBcIiArIHByaW1pdGl2ZVR5cGVzW3ByaW1UeXBlXSk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gQmxvY2sgSUQgPSAyMlxuXHRwcml2YXRlIHBhcnNlQ29udGFpbmVyKGJsb2NrSUQ6bnVtYmVyKTp2b2lkXG5cdHtcblx0XHR2YXIgbmFtZTpzdHJpbmc7XG5cdFx0dmFyIHBhcl9pZDpudW1iZXI7XG5cdFx0dmFyIG10eDpNYXRyaXgzRDtcblx0XHR2YXIgY3RyOkRpc3BsYXlPYmplY3RDb250YWluZXI7XG5cdFx0dmFyIHBhcmVudDpEaXNwbGF5T2JqZWN0Q29udGFpbmVyO1xuXG5cdFx0cGFyX2lkID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRtdHggPSB0aGlzLnBhcnNlTWF0cml4M0QoKTtcblx0XHRuYW1lID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXG5cdFx0dmFyIHBhcmVudE5hbWU6c3RyaW5nID0gXCJSb290IChUb3BMZXZlbClcIjtcblx0XHRjdHIgPSBuZXcgRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuXHRcdGN0ci50cmFuc2Zvcm0ubWF0cml4M0QgPSBtdHg7XG5cblx0XHR2YXIgcmV0dXJuZWRBcnJheTpBcnJheTxhbnk+ID0gdGhpcy5nZXRBc3NldEJ5SUQocGFyX2lkLCBbQXNzZXRUeXBlLkNPTlRBSU5FUiwgQXNzZXRUeXBlLkxJR0hULCBBc3NldFR5cGUuTUVTSF0pO1xuXG5cdFx0aWYgKHJldHVybmVkQXJyYXlbMF0pIHtcblx0XHRcdHZhciBvYmo6RGlzcGxheU9iamVjdCA9ICg8RGlzcGxheU9iamVjdENvbnRhaW5lcj4gcmV0dXJuZWRBcnJheVsxXSkuYWRkQ2hpbGQoY3RyKTtcblx0XHRcdHBhcmVudE5hbWUgPSAoPERpc3BsYXlPYmplY3RDb250YWluZXI+IHJldHVybmVkQXJyYXlbMV0pLm5hbWU7XG5cdFx0fSBlbHNlIGlmIChwYXJfaWQgPiAwKSB7XG5cdFx0XHR0aGlzLl9ibG9ja3NbIGJsb2NrSUQgXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIGEgcGFyZW50IGZvciB0aGlzIE9iamVjdENvbnRhaW5lcjNEXCIpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvL2FkZCB0byB0aGUgY29udGVudCBwcm9wZXJ0eVxuXHRcdFx0KDxEaXNwbGF5T2JqZWN0Q29udGFpbmVyPiB0aGlzLl9wQ29udGVudCkuYWRkQ2hpbGQoY3RyKTtcblx0XHR9XG5cblx0XHQvLyBpbiBBV0QgdmVyc2lvbiAyLjEgd2UgcmVhZCB0aGUgQ29udGFpbmVyIHByb3BlcnRpZXNcblx0XHRpZiAoKHRoaXMuX3ZlcnNpb25bMF0gPT0gMikgJiYgKHRoaXMuX3ZlcnNpb25bMV0gPT0gMSkpIHtcblx0XHRcdHZhciBwcm9wczpBV0RQcm9wZXJ0aWVzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoezE6dGhpcy5fbWF0cml4TnJUeXBlLCAyOnRoaXMuX21hdHJpeE5yVHlwZSwgMzp0aGlzLl9tYXRyaXhOclR5cGUsIDQ6QVdEUGFyc2VyLlVJTlQ4fSk7XG5cdFx0XHRjdHIucGl2b3QgPSBuZXcgVmVjdG9yM0QocHJvcHMuZ2V0KDEsIDApLCBwcm9wcy5nZXQoMiwgMCksIHByb3BzLmdldCgzLCAwKSk7XG5cdFx0fVxuXHRcdC8vIGluIG90aGVyIHZlcnNpb25zIHdlIGRvIG5vdCByZWFkIHRoZSBDb250YWluZXIgcHJvcGVydGllc1xuXHRcdGVsc2Uge1xuXHRcdFx0dGhpcy5wYXJzZVByb3BlcnRpZXMobnVsbCk7XG5cdFx0fVxuXG5cdFx0Ly8gdGhlIGV4dHJhUHJvcGVydGllcyBzaG91bGQgb25seSBiZSBzZXQgZm9yIEFXRDIuMS1GaWxlcywgYnV0IGlzIHJlYWQgZm9yIGJvdGggdmVyc2lvbnNcblx0XHRjdHIuZXh0cmEgPSB0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblxuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KDxJQXNzZXQ+IGN0ciwgbmFtZSk7XG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBjdHI7XG5cblx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgQ29udGFpbmVyOiBOYW1lID0gJ1wiICsgbmFtZSArIFwiJyB8IFBhcmVudC1OYW1lID0gXCIgKyBwYXJlbnROYW1lKTtcblx0XHR9XG5cdH1cblxuXHQvLyBCbG9jayBJRCA9IDIzXG5cdHByaXZhdGUgcGFyc2VNZXNoSW5zdGFuY2UoYmxvY2tJRDpudW1iZXIpOnZvaWRcblx0e1xuXHRcdHZhciBudW1fbWF0ZXJpYWxzOm51bWJlcjtcblx0XHR2YXIgbWF0ZXJpYWxzX3BhcnNlZDpudW1iZXI7XG5cdFx0dmFyIHBhcmVudDpEaXNwbGF5T2JqZWN0Q29udGFpbmVyO1xuXHRcdHZhciBwYXJfaWQ6bnVtYmVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHR2YXIgbXR4Ok1hdHJpeDNEID0gdGhpcy5wYXJzZU1hdHJpeDNEKCk7XG5cdFx0dmFyIG5hbWU6c3RyaW5nID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXHRcdHZhciBwYXJlbnROYW1lOnN0cmluZyA9IFwiUm9vdCAoVG9wTGV2ZWwpXCI7XG5cdFx0dmFyIGRhdGFfaWQ6bnVtYmVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHR2YXIgZ2VvbTpHZW9tZXRyeTtcblx0XHR2YXIgcmV0dXJuZWRBcnJheUdlb21ldHJ5OkFycmF5PGFueT4gPSB0aGlzLmdldEFzc2V0QnlJRChkYXRhX2lkLCBbQXNzZXRUeXBlLkdFT01FVFJZXSlcblxuXHRcdGlmIChyZXR1cm5lZEFycmF5R2VvbWV0cnlbMF0pIHtcblx0XHRcdGdlb20gPSA8R2VvbWV0cnk+IHJldHVybmVkQXJyYXlHZW9tZXRyeVsxXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgYSBHZW9tZXRyeSBmb3IgdGhpcyBNZXNoLiBBIGVtcHR5IEdlb21ldHJ5IGlzIGNyZWF0ZWQhXCIpO1xuXHRcdFx0Z2VvbSA9IG5ldyBHZW9tZXRyeSgpO1xuXHRcdH1cblxuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5nZW9JRCA9IGRhdGFfaWQ7XG5cdFx0dmFyIG1hdGVyaWFsczpBcnJheTxNYXRlcmlhbEJhc2U+ID0gbmV3IEFycmF5PE1hdGVyaWFsQmFzZT4oKTtcblx0XHRudW1fbWF0ZXJpYWxzID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXG5cdFx0dmFyIG1hdGVyaWFsTmFtZXM6QXJyYXk8c3RyaW5nPiA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cdFx0bWF0ZXJpYWxzX3BhcnNlZCA9IDA7XG5cblx0XHR2YXIgcmV0dXJuZWRBcnJheU1hdGVyaWFsOkFycmF5PGFueT47XG5cblx0XHR3aGlsZSAobWF0ZXJpYWxzX3BhcnNlZCA8IG51bV9tYXRlcmlhbHMpIHtcblx0XHRcdHZhciBtYXRfaWQ6bnVtYmVyO1xuXHRcdFx0bWF0X2lkID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRcdHJldHVybmVkQXJyYXlNYXRlcmlhbCA9IHRoaXMuZ2V0QXNzZXRCeUlEKG1hdF9pZCwgW0Fzc2V0VHlwZS5NQVRFUklBTF0pXG5cdFx0XHRpZiAoKCFyZXR1cm5lZEFycmF5TWF0ZXJpYWxbMF0pICYmIChtYXRfaWQgPiAwKSkge1xuXHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCBNYXRlcmlhbCBOciBcIiArIG1hdGVyaWFsc19wYXJzZWQgKyBcIiAoSUQgPSBcIiArIG1hdF9pZCArIFwiICkgZm9yIHRoaXMgTWVzaFwiKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIG06TWF0ZXJpYWxCYXNlID0gPE1hdGVyaWFsQmFzZT4gcmV0dXJuZWRBcnJheU1hdGVyaWFsWzFdO1xuXG5cdFx0XHRtYXRlcmlhbHMucHVzaChtKTtcblx0XHRcdG1hdGVyaWFsTmFtZXMucHVzaChtLm5hbWUpO1xuXG5cdFx0XHRtYXRlcmlhbHNfcGFyc2VkKys7XG5cdFx0fVxuXG5cdFx0dmFyIG1lc2g6TWVzaCA9IG5ldyBNZXNoKGdlb20sIG51bGwpO1xuXHRcdG1lc2gudHJhbnNmb3JtLm1hdHJpeDNEID0gbXR4O1xuXG5cdFx0dmFyIHJldHVybmVkQXJyYXlQYXJlbnQ6QXJyYXk8YW55PiA9IHRoaXMuZ2V0QXNzZXRCeUlEKHBhcl9pZCwgW0Fzc2V0VHlwZS5DT05UQUlORVIsIEFzc2V0VHlwZS5MSUdIVCwgQXNzZXRUeXBlLk1FU0hdKVxuXG5cdFx0aWYgKHJldHVybmVkQXJyYXlQYXJlbnRbMF0pIHtcblx0XHRcdHZhciBvYmpDOkRpc3BsYXlPYmplY3RDb250YWluZXIgPSA8RGlzcGxheU9iamVjdENvbnRhaW5lcj4gcmV0dXJuZWRBcnJheVBhcmVudFsxXTtcblx0XHRcdG9iakMuYWRkQ2hpbGQobWVzaCk7XG5cdFx0XHRwYXJlbnROYW1lID0gb2JqQy5uYW1lO1xuXHRcdH0gZWxzZSBpZiAocGFyX2lkID4gMCkge1xuXHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgYSBwYXJlbnQgZm9yIHRoaXMgTWVzaFwiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly9hZGQgdG8gdGhlIGNvbnRlbnQgcHJvcGVydHlcblx0XHRcdCg8RGlzcGxheU9iamVjdENvbnRhaW5lcj4gdGhpcy5fcENvbnRlbnQpLmFkZENoaWxkKG1lc2gpO1xuXHRcdH1cblxuXHRcdGlmIChtYXRlcmlhbHMubGVuZ3RoID49IDEgJiYgbWVzaC5zdWJNZXNoZXMubGVuZ3RoID09IDEpIHtcblx0XHRcdG1lc2gubWF0ZXJpYWwgPSBtYXRlcmlhbHNbMF07XG5cdFx0fSBlbHNlIGlmIChtYXRlcmlhbHMubGVuZ3RoID4gMSkge1xuXHRcdFx0dmFyIGk6bnVtYmVyO1xuXG5cdFx0XHQvLyBBc3NpZ24gZWFjaCBzdWItbWVzaCBpbiB0aGUgbWVzaCBhIG1hdGVyaWFsIGZyb20gdGhlIGxpc3QuIElmIG1vcmUgc3ViLW1lc2hlc1xuXHRcdFx0Ly8gdGhhbiBtYXRlcmlhbHMsIHJlcGVhdCB0aGUgbGFzdCBtYXRlcmlhbCBmb3IgYWxsIHJlbWFpbmluZyBzdWItbWVzaGVzLlxuXHRcdFx0Zm9yIChpID0gMDsgaSA8IG1lc2guc3ViTWVzaGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdG1lc2guc3ViTWVzaGVzW2ldLm1hdGVyaWFsID0gbWF0ZXJpYWxzW01hdGgubWluKG1hdGVyaWFscy5sZW5ndGggLSAxLCBpKV07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICgodGhpcy5fdmVyc2lvblswXSA9PSAyKSAmJiAodGhpcy5fdmVyc2lvblsxXSA9PSAxKSkge1xuXHRcdFx0dmFyIHByb3BzOkFXRFByb3BlcnRpZXMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7MTp0aGlzLl9tYXRyaXhOclR5cGUsIDI6dGhpcy5fbWF0cml4TnJUeXBlLCAzOnRoaXMuX21hdHJpeE5yVHlwZSwgNDpBV0RQYXJzZXIuVUlOVDgsIDU6QVdEUGFyc2VyLkJPT0x9KTtcblx0XHRcdG1lc2gucGl2b3QgPSBuZXcgVmVjdG9yM0QoPG51bWJlcj5wcm9wcy5nZXQoMSwgMCksIDxudW1iZXI+cHJvcHMuZ2V0KDIsIDApLCA8bnVtYmVyPiBwcm9wcy5nZXQoMywgMCkpO1xuXHRcdFx0bWVzaC5jYXN0c1NoYWRvd3MgPSBwcm9wcy5nZXQoNSwgdHJ1ZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMucGFyc2VQcm9wZXJ0aWVzKG51bGwpO1xuXHRcdH1cblxuXHRcdG1lc2guZXh0cmEgPSB0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblxuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KDxJQXNzZXQ+IG1lc2gsIG5hbWUpO1xuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gbWVzaDtcblxuXHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBNZXNoOiBOYW1lID0gJ1wiICsgbmFtZSArIFwiJyB8IFBhcmVudC1OYW1lID0gXCIgKyBwYXJlbnROYW1lICsgXCJ8IEdlb21ldHJ5LU5hbWUgPSBcIiArIGdlb20ubmFtZSArIFwiIHwgU3ViTWVzaGVzID0gXCIgKyBtZXNoLnN1Yk1lc2hlcy5sZW5ndGggKyBcIiB8IE1hdC1OYW1lcyA9IFwiICsgbWF0ZXJpYWxOYW1lcy50b1N0cmluZygpKTtcblx0XHR9XG5cdH1cblxuXG5cdC8vQmxvY2sgSUQgMzFcblx0cHJpdmF0ZSBwYXJzZVNreWJveEluc3RhbmNlKGJsb2NrSUQ6bnVtYmVyKTp2b2lkXG5cdHtcblx0XHR2YXIgbmFtZTpzdHJpbmcgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0dmFyIGN1YmVUZXhBZGRyOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cblx0XHR2YXIgcmV0dXJuZWRBcnJheUN1YmVUZXg6QXJyYXk8YW55PiA9IHRoaXMuZ2V0QXNzZXRCeUlEKGN1YmVUZXhBZGRyLCBbQXNzZXRUeXBlLlRFWFRVUkVdLCBcIkN1YmVUZXh0dXJlXCIpO1xuXHRcdGlmICgoIXJldHVybmVkQXJyYXlDdWJlVGV4WzBdKSAmJiAoY3ViZVRleEFkZHIgIT0gMCkpXG5cdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgQ3ViZXRleHR1cmUgKElEID0gXCIgKyBjdWJlVGV4QWRkciArIFwiICkgZm9yIHRoaXMgU2t5Ym94XCIpO1xuXHRcdHZhciBhc3NldDpTa3lib3ggPSBuZXcgU2t5Ym94KG5ldyBTa3lib3hNYXRlcmlhbCg8SW1hZ2VDdWJlVGV4dHVyZT4gcmV0dXJuZWRBcnJheUN1YmVUZXhbMV0pKTtcblxuXHRcdHRoaXMucGFyc2VQcm9wZXJ0aWVzKG51bGwpXG5cdFx0YXNzZXQuZXh0cmEgPSB0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHR0aGlzLl9wRmluYWxpemVBc3NldChhc3NldCwgbmFtZSk7XG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBhc3NldDtcblx0XHRpZiAodGhpcy5fZGVidWcpXG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIFNreWJveDogTmFtZSA9ICdcIiArIG5hbWUgKyBcIicgfCBDdWJlVGV4dHVyZS1OYW1lID0gXCIgKyAoPEltYWdlQ3ViZVRleHR1cmU+IHJldHVybmVkQXJyYXlDdWJlVGV4WzFdKS5uYW1lKTtcblxuXHR9XG5cblx0Ly9CbG9jayBJRCA9IDQxXG5cdHByaXZhdGUgcGFyc2VMaWdodChibG9ja0lEOm51bWJlcik6dm9pZFxuXHR7XG5cdFx0dmFyIGxpZ2h0OkxpZ2h0QmFzZTtcblx0XHR2YXIgbmV3U2hhZG93TWFwcGVyOlNoYWRvd01hcHBlckJhc2U7XG5cblx0XHR2YXIgcGFyX2lkOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0dmFyIG10eDpNYXRyaXgzRCA9IHRoaXMucGFyc2VNYXRyaXgzRCgpO1xuXHRcdHZhciBuYW1lOnN0cmluZyA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblx0XHR2YXIgbGlnaHRUeXBlOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdHZhciBwcm9wczpBV0RQcm9wZXJ0aWVzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoezE6dGhpcy5fcHJvcHNOclR5cGUsIDI6dGhpcy5fcHJvcHNOclR5cGUsIDM6QVdEUGFyc2VyLkNPTE9SLCA0OnRoaXMuX3Byb3BzTnJUeXBlLCA1OnRoaXMuX3Byb3BzTnJUeXBlLCA2OkFXRFBhcnNlci5CT09MLCA3OkFXRFBhcnNlci5DT0xPUiwgODp0aGlzLl9wcm9wc05yVHlwZSwgOTpBV0RQYXJzZXIuVUlOVDgsIDEwOkFXRFBhcnNlci5VSU5UOCwgMTE6dGhpcy5fcHJvcHNOclR5cGUsIDEyOkFXRFBhcnNlci5VSU5UMTYsIDIxOnRoaXMuX21hdHJpeE5yVHlwZSwgMjI6dGhpcy5fbWF0cml4TnJUeXBlLCAyMzp0aGlzLl9tYXRyaXhOclR5cGV9KTtcblx0XHR2YXIgc2hhZG93TWFwcGVyVHlwZTpudW1iZXIgPSBwcm9wcy5nZXQoOSwgMCk7XG5cdFx0dmFyIHBhcmVudE5hbWU6c3RyaW5nID0gXCJSb290IChUb3BMZXZlbClcIjtcblx0XHR2YXIgbGlnaHRUeXBlczpBcnJheTxzdHJpbmc+ID0gW1wiVW5zdXBwb3J0ZWQgTGlnaHRUeXBlXCIsIFwiUG9pbnRMaWdodFwiLCBcIkRpcmVjdGlvbmFsTGlnaHRcIl07XG5cdFx0dmFyIHNoYWRvd01hcHBlclR5cGVzOkFycmF5PHN0cmluZz4gPSBbXCJObyBTaGFkb3dNYXBwZXJcIiwgXCJEaXJlY3Rpb25hbFNoYWRvd01hcHBlclwiLCBcIk5lYXJEaXJlY3Rpb25hbFNoYWRvd01hcHBlclwiLCBcIkNhc2NhZGVTaGFkb3dNYXBwZXJcIiwgXCJDdWJlTWFwU2hhZG93TWFwcGVyXCJdO1xuXG5cdFx0aWYgKGxpZ2h0VHlwZSA9PSAxKSB7XG5cdFx0XHRsaWdodCA9IG5ldyBQb2ludExpZ2h0KCk7XG5cblx0XHRcdCg8UG9pbnRMaWdodD4gbGlnaHQpLnJhZGl1cyA9IHByb3BzLmdldCgxLCA5MDAwMCk7XG5cdFx0XHQoPFBvaW50TGlnaHQ+IGxpZ2h0KS5mYWxsT2ZmID0gcHJvcHMuZ2V0KDIsIDEwMDAwMCk7XG5cblx0XHRcdGlmIChzaGFkb3dNYXBwZXJUeXBlID4gMCkge1xuXHRcdFx0XHRpZiAoc2hhZG93TWFwcGVyVHlwZSA9PSA0KSB7XG5cdFx0XHRcdFx0bmV3U2hhZG93TWFwcGVyID0gbmV3IEN1YmVNYXBTaGFkb3dNYXBwZXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRsaWdodC50cmFuc2Zvcm0ubWF0cml4M0QgPSBtdHg7XG5cblx0XHR9XG5cblx0XHRpZiAobGlnaHRUeXBlID09IDIpIHtcblxuXHRcdFx0bGlnaHQgPSBuZXcgRGlyZWN0aW9uYWxMaWdodChwcm9wcy5nZXQoMjEsIDApLCBwcm9wcy5nZXQoMjIsIC0xKSwgcHJvcHMuZ2V0KDIzLCAxKSk7XG5cblx0XHRcdGlmIChzaGFkb3dNYXBwZXJUeXBlID4gMCkge1xuXHRcdFx0XHRpZiAoc2hhZG93TWFwcGVyVHlwZSA9PSAxKSB7XG5cdFx0XHRcdFx0bmV3U2hhZG93TWFwcGVyID0gbmV3IERpcmVjdGlvbmFsU2hhZG93TWFwcGVyKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL2lmIChzaGFkb3dNYXBwZXJUeXBlID09IDIpXG5cdFx0XHRcdC8vICBuZXdTaGFkb3dNYXBwZXIgPSBuZXcgTmVhckRpcmVjdGlvbmFsU2hhZG93TWFwcGVyKHByb3BzLmdldCgxMSwgMC41KSk7XG5cdFx0XHRcdC8vaWYgKHNoYWRvd01hcHBlclR5cGUgPT0gMylcblx0XHRcdFx0Ly8gICBuZXdTaGFkb3dNYXBwZXIgPSBuZXcgQ2FzY2FkZVNoYWRvd01hcHBlcihwcm9wcy5nZXQoMTIsIDMpKTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXHRcdGxpZ2h0LmNvbG9yID0gcHJvcHMuZ2V0KDMsIDB4ZmZmZmZmKTtcblx0XHRsaWdodC5zcGVjdWxhciA9IHByb3BzLmdldCg0LCAxLjApO1xuXHRcdGxpZ2h0LmRpZmZ1c2UgPSBwcm9wcy5nZXQoNSwgMS4wKTtcblx0XHRsaWdodC5hbWJpZW50Q29sb3IgPSBwcm9wcy5nZXQoNywgMHhmZmZmZmYpO1xuXHRcdGxpZ2h0LmFtYmllbnQgPSBwcm9wcy5nZXQoOCwgMC4wKTtcblxuXHRcdC8vIGlmIGEgc2hhZG93TWFwcGVyIGhhcyBiZWVuIGNyZWF0ZWQsIGFkanVzdCB0aGUgZGVwdGhNYXBTaXplIGlmIG5lZWRlZCwgYXNzaWduIHRvIGxpZ2h0IGFuZCBzZXQgY2FzdFNoYWRvd3MgdG8gdHJ1ZVxuXHRcdGlmIChuZXdTaGFkb3dNYXBwZXIpIHtcblx0XHRcdGlmIChuZXdTaGFkb3dNYXBwZXIgaW5zdGFuY2VvZiBDdWJlTWFwU2hhZG93TWFwcGVyKSB7XG5cdFx0XHRcdGlmIChwcm9wcy5nZXQoMTAsIDEpICE9IDEpIHtcblx0XHRcdFx0XHRuZXdTaGFkb3dNYXBwZXIuZGVwdGhNYXBTaXplID0gdGhpcy5fZGVwdGhTaXplRGljW3Byb3BzLmdldCgxMCwgMSldO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAocHJvcHMuZ2V0KDEwLCAyKSAhPSAyKSB7XG5cdFx0XHRcdFx0bmV3U2hhZG93TWFwcGVyLmRlcHRoTWFwU2l6ZSA9IHRoaXMuX2RlcHRoU2l6ZURpY1twcm9wcy5nZXQoMTAsIDIpXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRsaWdodC5zaGFkb3dNYXBwZXIgPSBuZXdTaGFkb3dNYXBwZXI7XG5cdFx0XHRsaWdodC5jYXN0c1NoYWRvd3MgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmIChwYXJfaWQgIT0gMCkge1xuXG5cdFx0XHR2YXIgcmV0dXJuZWRBcnJheVBhcmVudDpBcnJheTxhbnk+ID0gdGhpcy5nZXRBc3NldEJ5SUQocGFyX2lkLCBbQXNzZXRUeXBlLkNPTlRBSU5FUiwgQXNzZXRUeXBlLkxJR0hULCBBc3NldFR5cGUuTUVTSF0pXG5cblx0XHRcdGlmIChyZXR1cm5lZEFycmF5UGFyZW50WzBdKSB7XG5cdFx0XHRcdCg8RGlzcGxheU9iamVjdENvbnRhaW5lcj4gcmV0dXJuZWRBcnJheVBhcmVudFsxXSkuYWRkQ2hpbGQobGlnaHQpO1xuXHRcdFx0XHRwYXJlbnROYW1lID0gKDxEaXNwbGF5T2JqZWN0Q29udGFpbmVyPiByZXR1cm5lZEFycmF5UGFyZW50WzFdKS5uYW1lO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgYSBwYXJlbnQgZm9yIHRoaXMgTGlnaHRcIik7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vYWRkIHRvIHRoZSBjb250ZW50IHByb3BlcnR5XG5cdFx0XHQoPERpc3BsYXlPYmplY3RDb250YWluZXI+IHRoaXMuX3BDb250ZW50KS5hZGRDaGlsZChsaWdodCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cblx0XHR0aGlzLl9wRmluYWxpemVBc3NldCg8IElBc3NldD4gbGlnaHQsIG5hbWUpO1xuXG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBsaWdodDtcblxuXHRcdGlmICh0aGlzLl9kZWJ1Zylcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgTGlnaHQ6IE5hbWUgPSAnXCIgKyBuYW1lICsgXCInIHwgVHlwZSA9IFwiICsgbGlnaHRUeXBlc1tsaWdodFR5cGVdICsgXCIgfCBQYXJlbnQtTmFtZSA9IFwiICsgcGFyZW50TmFtZSArIFwiIHwgU2hhZG93TWFwcGVyLVR5cGUgPSBcIiArIHNoYWRvd01hcHBlclR5cGVzW3NoYWRvd01hcHBlclR5cGVdKTtcblxuXHR9XG5cblx0Ly9CbG9jayBJRCA9IDQzXG5cdHByaXZhdGUgcGFyc2VDYW1lcmEoYmxvY2tJRDpudW1iZXIpOnZvaWRcblx0e1xuXG5cdFx0dmFyIHBhcl9pZDpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdHZhciBtdHg6TWF0cml4M0QgPSB0aGlzLnBhcnNlTWF0cml4M0QoKTtcblx0XHR2YXIgbmFtZTpzdHJpbmcgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0dmFyIHBhcmVudE5hbWU6c3RyaW5nID0gXCJSb290IChUb3BMZXZlbClcIjtcblx0XHR2YXIgcHJvamVjdGlvbjpQcm9qZWN0aW9uQmFzZTtcblxuXHRcdHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpOyAvL3NldCBhcyBhY3RpdmUgY2FtZXJhXG5cdFx0dGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkU2hvcnQoKTsgLy9sZW5ndGhvZiBsZW5zZXMgLSBub3QgdXNlZCB5ZXRcblxuXHRcdHZhciBwcm9qZWN0aW9udHlwZTpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRTaG9ydCgpO1xuXHRcdHZhciBwcm9wczpBV0RQcm9wZXJ0aWVzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoezEwMTp0aGlzLl9wcm9wc05yVHlwZSwgMTAyOnRoaXMuX3Byb3BzTnJUeXBlLCAxMDM6dGhpcy5fcHJvcHNOclR5cGUsIDEwNDp0aGlzLl9wcm9wc05yVHlwZX0pO1xuXG5cdFx0c3dpdGNoIChwcm9qZWN0aW9udHlwZSkge1xuXHRcdFx0Y2FzZSA1MDAxOlxuXHRcdFx0XHRwcm9qZWN0aW9uID0gbmV3IFBlcnNwZWN0aXZlUHJvamVjdGlvbihwcm9wcy5nZXQoMTAxLCA2MCkpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNTAwMjpcblx0XHRcdFx0cHJvamVjdGlvbiA9IG5ldyBPcnRob2dyYXBoaWNQcm9qZWN0aW9uKHByb3BzLmdldCgxMDEsIDUwMCkpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNTAwMzpcblx0XHRcdFx0cHJvamVjdGlvbiA9IG5ldyBPcnRob2dyYXBoaWNPZmZDZW50ZXJQcm9qZWN0aW9uKHByb3BzLmdldCgxMDEsIC00MDApLCBwcm9wcy5nZXQoMTAyLCA0MDApLCBwcm9wcy5nZXQoMTAzLCAtMzAwKSwgcHJvcHMuZ2V0KDEwNCwgMzAwKSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Y29uc29sZS5sb2coXCJ1bnN1cHBvcnRlZExlbnN0eXBlXCIpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGNhbWVyYTpDYW1lcmEgPSBuZXcgQ2FtZXJhKHByb2plY3Rpb24pO1xuXHRcdGNhbWVyYS50cmFuc2Zvcm0ubWF0cml4M0QgPSBtdHg7XG5cblx0XHR2YXIgcmV0dXJuZWRBcnJheVBhcmVudDpBcnJheTxhbnk+ID0gdGhpcy5nZXRBc3NldEJ5SUQocGFyX2lkLCBbQXNzZXRUeXBlLkNPTlRBSU5FUiwgQXNzZXRUeXBlLkxJR0hULCBBc3NldFR5cGUuTUVTSF0pXG5cblx0XHRpZiAocmV0dXJuZWRBcnJheVBhcmVudFswXSkge1xuXG5cdFx0XHR2YXIgb2JqQzpEaXNwbGF5T2JqZWN0Q29udGFpbmVyID0gPERpc3BsYXlPYmplY3RDb250YWluZXI+IHJldHVybmVkQXJyYXlQYXJlbnRbMV07XG5cdFx0XHRvYmpDLmFkZENoaWxkKGNhbWVyYSk7XG5cblx0XHRcdHBhcmVudE5hbWUgPSBvYmpDLm5hbWU7XG5cblx0XHR9IGVsc2UgaWYgKHBhcl9pZCA+IDApIHtcblx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIGEgcGFyZW50IGZvciB0aGlzIENhbWVyYVwiKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly9hZGQgdG8gdGhlIGNvbnRlbnQgcHJvcGVydHlcblx0XHRcdCg8RGlzcGxheU9iamVjdENvbnRhaW5lcj4gdGhpcy5fcENvbnRlbnQpLmFkZENoaWxkKGNhbWVyYSk7XG5cdFx0fVxuXG5cdFx0Y2FtZXJhLm5hbWUgPSBuYW1lO1xuXHRcdHByb3BzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoezE6dGhpcy5fbWF0cml4TnJUeXBlLCAyOnRoaXMuX21hdHJpeE5yVHlwZSwgMzp0aGlzLl9tYXRyaXhOclR5cGUsIDQ6QVdEUGFyc2VyLlVJTlQ4fSk7XG5cdFx0Y2FtZXJhLnBpdm90ID0gbmV3IFZlY3RvcjNEKHByb3BzLmdldCgxLCAwKSwgcHJvcHMuZ2V0KDIsIDApLCBwcm9wcy5nZXQoMywgMCkpO1xuXHRcdGNhbWVyYS5leHRyYSA9IHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXG5cdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQoY2FtZXJhLCBuYW1lKTtcblxuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gY2FtZXJhXG5cblx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgQ2FtZXJhOiBOYW1lID0gJ1wiICsgbmFtZSArIFwiJyB8IFByb2plY3Rpb250eXBlID0gXCIgKyBwcm9qZWN0aW9uICsgXCIgfCBQYXJlbnQtTmFtZSA9IFwiICsgcGFyZW50TmFtZSk7XG5cdFx0fVxuXG5cdH1cblxuXHQvL0Jsb2NrIElEID0gNTFcblx0cHJpdmF0ZSBwYXJzZUxpZ2h0UGlja2VyKGJsb2NrSUQ6bnVtYmVyKTp2b2lkXG5cdHtcblx0XHR2YXIgbmFtZTpzdHJpbmcgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0dmFyIG51bUxpZ2h0czpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0dmFyIGxpZ2h0c0FycmF5OkFycmF5PExpZ2h0QmFzZT4gPSBuZXcgQXJyYXk8TGlnaHRCYXNlPigpO1xuXHRcdHZhciBrOm51bWJlciA9IDA7XG5cdFx0dmFyIGxpZ2h0SUQ6bnVtYmVyID0gMDtcblxuXHRcdHZhciByZXR1cm5lZEFycmF5TGlnaHQ6QXJyYXk8YW55Pjtcblx0XHR2YXIgbGlnaHRzQXJyYXlOYW1lczpBcnJheTxzdHJpbmc+ID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblxuXHRcdGZvciAoayA9IDA7IGsgPCBudW1MaWdodHM7IGsrKykge1xuXHRcdFx0bGlnaHRJRCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0XHRyZXR1cm5lZEFycmF5TGlnaHQgPSB0aGlzLmdldEFzc2V0QnlJRChsaWdodElELCBbQXNzZXRUeXBlLkxJR0hUXSlcblxuXHRcdFx0aWYgKHJldHVybmVkQXJyYXlMaWdodFswXSkge1xuXHRcdFx0XHRsaWdodHNBcnJheS5wdXNoKDxMaWdodEJhc2U+IHJldHVybmVkQXJyYXlMaWdodFsxXSk7XG5cdFx0XHRcdGxpZ2h0c0FycmF5TmFtZXMucHVzaCgoIDxMaWdodEJhc2U+IHJldHVybmVkQXJyYXlMaWdodFsxXSkubmFtZSk7XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIGEgTGlnaHQgTnIgXCIgKyBrICsgXCIgKElEID0gXCIgKyBsaWdodElEICsgXCIgKSBmb3IgdGhpcyBMaWdodFBpY2tlclwiKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAobGlnaHRzQXJyYXkubGVuZ3RoID09IDApIHtcblx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBjcmVhdGUgdGhpcyBMaWdodFBpY2tlciwgY2F1c2Ugbm8gTGlnaHQgd2FzIGZvdW5kLlwiKTtcblx0XHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdFx0cmV0dXJuOyAvL3JldHVybiB3aXRob3V0IGFueSBtb3JlIHBhcnNpbmcgZm9yIHRoaXMgYmxvY2tcblx0XHR9XG5cblx0XHR2YXIgbGlnaHRQaWNrOkxpZ2h0UGlja2VyQmFzZSA9IG5ldyBTdGF0aWNMaWdodFBpY2tlcihsaWdodHNBcnJheSk7XG5cdFx0bGlnaHRQaWNrLm5hbWUgPSBuYW1lO1xuXG5cdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQoPElBc3NldD4gbGlnaHRQaWNrLCBuYW1lKTtcblxuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gbGlnaHRQaWNrXG5cdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIFN0YXRpY0xpZ2h0UGlja2VyOiBOYW1lID0gJ1wiICsgbmFtZSArIFwiJyB8IFRleHR1cmUtTmFtZSA9IFwiICsgbGlnaHRzQXJyYXlOYW1lcy50b1N0cmluZygpKTtcblx0XHR9XG5cdH1cblxuXHQvL0Jsb2NrIElEID0gODFcblx0cHJpdmF0ZSBwYXJzZU1hdGVyaWFsKGJsb2NrSUQ6bnVtYmVyKTp2b2lkXG5cdHtcblx0XHQvLyBUT0RPOiBub3QgdXNlZFxuXHRcdC8vLy9ibG9ja0xlbmd0aCA9IGJsb2NrLmxlbjtcblx0XHR2YXIgbmFtZTpzdHJpbmc7XG5cdFx0dmFyIHR5cGU6bnVtYmVyO1xuXHRcdHZhciBwcm9wczpBV0RQcm9wZXJ0aWVzO1xuXHRcdHZhciBtYXQ6VHJpYW5nbGVNZXRob2RNYXRlcmlhbDtcblx0XHR2YXIgYXR0cmlidXRlczpPYmplY3Q7XG5cdFx0dmFyIGZpbmFsaXplOmJvb2xlYW47XG5cdFx0dmFyIG51bV9tZXRob2RzOm51bWJlcjtcblx0XHR2YXIgbWV0aG9kc19wYXJzZWQ6bnVtYmVyO1xuXHRcdHZhciByZXR1cm5lZEFycmF5OkFycmF5PGFueT47XG5cblx0XHRuYW1lID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXHRcdHR5cGUgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHRudW1fbWV0aG9kcyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXG5cdFx0Ly8gUmVhZCBtYXRlcmlhbCBudW1lcmljYWwgcHJvcGVydGllc1xuXHRcdC8vICgxPWNvbG9yLCAyPWJpdG1hcCB1cmwsIDEwPWFscGhhLCAxMT1hbHBoYV9ibGVuZGluZywgMTI9YWxwaGFfdGhyZXNob2xkLCAxMz1yZXBlYXQpXG5cdFx0cHJvcHMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7IDE6QVdEUGFyc2VyLklOVDMyLCAyOkFXRFBhcnNlci5CQUREUiwgMTA6dGhpcy5fcHJvcHNOclR5cGUsIDExOkFXRFBhcnNlci5CT09MLCAxMjp0aGlzLl9wcm9wc05yVHlwZSwgMTM6QVdEUGFyc2VyLkJPT0x9KTtcblxuXHRcdG1ldGhvZHNfcGFyc2VkID0gMDtcblx0XHR3aGlsZSAobWV0aG9kc19wYXJzZWQgPCBudW1fbWV0aG9kcykge1xuXHRcdFx0dmFyIG1ldGhvZF90eXBlOm51bWJlcjtcblxuXHRcdFx0bWV0aG9kX3R5cGUgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0XHR0aGlzLnBhcnNlUHJvcGVydGllcyhudWxsKTtcblx0XHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdFx0bWV0aG9kc19wYXJzZWQgKz0gMTtcblx0XHR9XG5cdFx0dmFyIGRlYnVnU3RyaW5nOnN0cmluZyA9IFwiXCI7XG5cdFx0YXR0cmlidXRlcyA9IHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdGlmICh0eXBlID09PSAxKSB7IC8vIENvbG9yIG1hdGVyaWFsXG5cdFx0XHRkZWJ1Z1N0cmluZyArPSBcIlBhcnNlZCBhIENvbG9yTWF0ZXJpYWwoU2luZ2xlUGFzcyk6IE5hbWUgPSAnXCIgKyBuYW1lICsgXCInIHwgXCI7XG5cdFx0XHR2YXIgY29sb3I6bnVtYmVyO1xuXHRcdFx0Y29sb3IgPSBwcm9wcy5nZXQoMSwgMHhmZmZmZmYpO1xuXHRcdFx0aWYgKHRoaXMubWF0ZXJpYWxNb2RlIDwgMikge1xuXHRcdFx0XHRtYXQgPSBuZXcgVHJpYW5nbGVNZXRob2RNYXRlcmlhbChjb2xvciwgcHJvcHMuZ2V0KDEwLCAxLjApKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1hdCA9IG5ldyBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsKGNvbG9yKTtcblx0XHRcdFx0bWF0Lm1hdGVyaWFsTW9kZSA9IFRyaWFuZ2xlTWF0ZXJpYWxNb2RlLk1VTFRJX1BBU1M7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh0eXBlID09PSAyKSB7XG5cdFx0XHR2YXIgdGV4X2FkZHI6bnVtYmVyID0gcHJvcHMuZ2V0KDIsIDApO1xuXG5cdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQodGV4X2FkZHIsIFtBc3NldFR5cGUuVEVYVFVSRV0pO1xuXG5cdFx0XHRpZiAoKCFyZXR1cm5lZEFycmF5WzBdKSAmJiAodGV4X2FkZHIgPiAwKSlcblx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIERpZmZzdWVUZXh0dXJlIChJRCA9IFwiICsgdGV4X2FkZHIgKyBcIiApIGZvciB0aGlzIE1hdGVyaWFsXCIpO1xuXG5cdFx0XHRtYXQgPSBuZXcgVHJpYW5nbGVNZXRob2RNYXRlcmlhbCg8VGV4dHVyZTJEQmFzZT4gcmV0dXJuZWRBcnJheVsxXSk7XG5cblx0XHRcdGlmICh0aGlzLm1hdGVyaWFsTW9kZSA8IDIpIHtcblx0XHRcdFx0bWF0LmFscGhhQmxlbmRpbmcgPSBwcm9wcy5nZXQoMTEsIGZhbHNlKTtcblx0XHRcdFx0bWF0LmFscGhhID0gcHJvcHMuZ2V0KDEwLCAxLjApO1xuXHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIlBhcnNlZCBhIFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwoU2luZ2xlUGFzcyk6IE5hbWUgPSAnXCIgKyBuYW1lICsgXCInIHwgVGV4dHVyZS1OYW1lID0gXCIgKyBtYXQubmFtZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1hdC5tYXRlcmlhbE1vZGUgPSBUcmlhbmdsZU1hdGVyaWFsTW9kZS5NVUxUSV9QQVNTO1xuXHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIlBhcnNlZCBhIFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwoTXVsdGlQYXNzKTogTmFtZSA9ICdcIiArIG5hbWUgKyBcIicgfCBUZXh0dXJlLU5hbWUgPSBcIiArIG1hdC5uYW1lO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdG1hdC5leHRyYSA9IGF0dHJpYnV0ZXM7XG5cdFx0bWF0LmFscGhhVGhyZXNob2xkID0gcHJvcHMuZ2V0KDEyLCAwLjApO1xuXHRcdG1hdC5yZXBlYXQgPSBwcm9wcy5nZXQoMTMsIGZhbHNlKTtcblx0XHR0aGlzLl9wRmluYWxpemVBc3NldCg8SUFzc2V0PiBtYXQsIG5hbWUpO1xuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gbWF0O1xuXG5cdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhkZWJ1Z1N0cmluZyk7XG5cblx0XHR9XG5cdH1cblxuXHQvLyBCbG9jayBJRCA9IDgxIEFXRDIuMVxuXHRwcml2YXRlIHBhcnNlTWF0ZXJpYWxfdjEoYmxvY2tJRDpudW1iZXIpOnZvaWRcblx0e1xuXHRcdHZhciBtYXQ6VHJpYW5nbGVNZXRob2RNYXRlcmlhbDtcblx0XHR2YXIgbm9ybWFsVGV4dHVyZTpUZXh0dXJlMkRCYXNlO1xuXHRcdHZhciBzcGVjVGV4dHVyZTpUZXh0dXJlMkRCYXNlO1xuXHRcdHZhciByZXR1cm5lZEFycmF5OkFycmF5PGFueT47XG5cblx0XHR2YXIgbmFtZTpzdHJpbmcgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0dmFyIHR5cGU6bnVtYmVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRCeXRlKCk7XG5cdFx0dmFyIG51bV9tZXRob2RzOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdHZhciBwcm9wczpBV0RQcm9wZXJ0aWVzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoezE6QVdEUGFyc2VyLlVJTlQzMiwgMjpBV0RQYXJzZXIuQkFERFIsIDM6QVdEUGFyc2VyLkJBRERSLCA0OkFXRFBhcnNlci5VSU5UOCwgNTpBV0RQYXJzZXIuQk9PTCwgNjpBV0RQYXJzZXIuQk9PTCwgNzpBV0RQYXJzZXIuQk9PTCwgODpBV0RQYXJzZXIuQk9PTCwgOTpBV0RQYXJzZXIuVUlOVDgsIDEwOnRoaXMuX3Byb3BzTnJUeXBlLCAxMTpBV0RQYXJzZXIuQk9PTCwgMTI6dGhpcy5fcHJvcHNOclR5cGUsIDEzOkFXRFBhcnNlci5CT09MLCAxNTp0aGlzLl9wcm9wc05yVHlwZSwgMTY6QVdEUGFyc2VyLlVJTlQzMiwgMTc6QVdEUGFyc2VyLkJBRERSLCAxODp0aGlzLl9wcm9wc05yVHlwZSwgMTk6dGhpcy5fcHJvcHNOclR5cGUsIDIwOkFXRFBhcnNlci5VSU5UMzIsIDIxOkFXRFBhcnNlci5CQUREUiwgMjI6QVdEUGFyc2VyLkJBRERSfSk7XG5cdFx0dmFyIHNwZXppYWxUeXBlOm51bWJlciA9IHByb3BzLmdldCg0LCAwKTtcblx0XHR2YXIgZGVidWdTdHJpbmc6c3RyaW5nID0gXCJcIjtcblxuXHRcdGlmIChzcGV6aWFsVHlwZSA+PSAyKSB7Ly90aGlzIGlzIG5vIHN1cHBvcnRlZCBtYXRlcmlhbFxuXHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiTWF0ZXJpYWwtc3BlemlhbFR5cGUgJ1wiICsgc3BlemlhbFR5cGUgKyBcIicgaXMgbm90IHN1cHBvcnRlZCwgY2FuIG9ubHkgYmUgMDpzaW5nbGVQYXNzLCAxOk11bHRpUGFzcyAhXCIpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLm1hdGVyaWFsTW9kZSA9PSAxKVxuXHRcdFx0c3BlemlhbFR5cGUgPSAwO1xuXHRcdGVsc2UgaWYgKHRoaXMubWF0ZXJpYWxNb2RlID09IDIpXG5cdFx0XHRzcGV6aWFsVHlwZSA9IDE7XG5cblx0XHRpZiAoc3BlemlhbFR5cGUgPCAyKSB7Ly90aGlzIGlzIFNpbmdsZVBhc3Mgb3IgTXVsdGlQYXNzXG5cblx0XHRcdGlmICh0eXBlID09IDEpIHsvLyBDb2xvciBtYXRlcmlhbFxuXHRcdFx0XHR2YXIgY29sb3I6bnVtYmVyID0gcHJvcHMuZ2V0KDEsIDB4Y2NjY2NjKTsvL1RPRE8gdGVtcG9yYXJpbHkgc3dhcHBlZCBzbyB0aGF0IGRpZmZ1c2UgY29sb3IgZ29lcyB0byBhbWJpZW50XG5cblx0XHRcdFx0aWYgKHNwZXppYWxUeXBlID09IDEpIHsvL1x0TXVsdGlQYXNzTWF0ZXJpYWxcblx0XHRcdFx0XHRtYXQgPSBuZXcgVHJpYW5nbGVNZXRob2RNYXRlcmlhbChjb2xvcik7XG5cdFx0XHRcdFx0bWF0Lm1hdGVyaWFsTW9kZSA9IFRyaWFuZ2xlTWF0ZXJpYWxNb2RlLk1VTFRJX1BBU1M7XG5cdFx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCJQYXJzZWQgYSBDb2xvck1hdGVyaWFsKE11bHRpUGFzcyk6IE5hbWUgPSAnXCIgKyBuYW1lICsgXCInIHwgXCI7XG5cblx0XHRcdFx0fSBlbHNlIHsgLy9cdFNpbmdsZVBhc3NNYXRlcmlhbFxuXHRcdFx0XHRcdG1hdCA9IG5ldyBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsKGNvbG9yLCBwcm9wcy5nZXQoMTAsIDEuMCkpO1xuXHRcdFx0XHRcdG1hdC5hbHBoYUJsZW5kaW5nID0gcHJvcHMuZ2V0KDExLCBmYWxzZSk7XG5cdFx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCJQYXJzZWQgYSBDb2xvck1hdGVyaWFsKFNpbmdsZVBhc3MpOiBOYW1lID0gJ1wiICsgbmFtZSArIFwiJyB8IFwiO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSBpZiAodHlwZSA9PSAyKSB7Ly8gdGV4dHVyZSBtYXRlcmlhbFxuXHRcdFx0XHR2YXIgdGV4X2FkZHI6bnVtYmVyID0gcHJvcHMuZ2V0KDIsIDApOy8vVE9ETyB0ZW1wb3JhcmlseSBzd2FwcGVkIHNvIHRoYXQgZGlmZnVzZSB0ZXh0dXJlIGdvZXMgdG8gYW1iaWVudFxuXHRcdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQodGV4X2FkZHIsIFtBc3NldFR5cGUuVEVYVFVSRV0pO1xuXG5cdFx0XHRcdGlmICgoIXJldHVybmVkQXJyYXlbMF0pICYmICh0ZXhfYWRkciA+IDApKVxuXHRcdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBBbWJpZW50VGV4dHVyZSAoSUQgPSBcIiArIHRleF9hZGRyICsgXCIgKSBmb3IgdGhpcyBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsXCIpO1xuXG5cdFx0XHRcdHZhciB0ZXh0dXJlOlRleHR1cmUyREJhc2UgPSByZXR1cm5lZEFycmF5WzFdO1xuXG5cdFx0XHRcdG1hdCA9IG5ldyBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsKHRleHR1cmUpO1xuXG5cdFx0XHRcdGlmIChzcGV6aWFsVHlwZSA9PSAxKSB7Ly8gTXVsdGlQYXNzTWF0ZXJpYWxcblx0XHRcdFx0XHRtYXQubWF0ZXJpYWxNb2RlID0gVHJpYW5nbGVNYXRlcmlhbE1vZGUuTVVMVElfUEFTUztcblxuXHRcdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiUGFyc2VkIGEgVHJpYW5nbGVNZXRob2RNYXRlcmlhbChNdWx0aVBhc3MpOiBOYW1lID0gJ1wiICsgbmFtZSArIFwiJyB8IFRleHR1cmUtTmFtZSA9IFwiICsgdGV4dHVyZS5uYW1lO1xuXHRcdFx0XHR9IGVsc2Ugey8vXHRTaW5nbGVQYXNzTWF0ZXJpYWxcblx0XHRcdFx0XHRtYXQuYWxwaGEgPSBwcm9wcy5nZXQoMTAsIDEuMCk7XG5cdFx0XHRcdFx0bWF0LmFscGhhQmxlbmRpbmcgPSBwcm9wcy5nZXQoMTEsIGZhbHNlKTtcblxuXHRcdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiUGFyc2VkIGEgVHJpYW5nbGVNZXRob2RNYXRlcmlhbChTaW5nbGVQYXNzKTogTmFtZSA9ICdcIiArIG5hbWUgKyBcIicgfCBUZXh0dXJlLU5hbWUgPSBcIiArIHRleHR1cmUubmFtZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR2YXIgZGlmZnVzZVRleHR1cmU6VGV4dHVyZTJEQmFzZTtcblx0XHRcdHZhciBkaWZmdXNlVGV4X2FkZHI6bnVtYmVyID0gcHJvcHMuZ2V0KDE3LCAwKTtcblxuXHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKGRpZmZ1c2VUZXhfYWRkciwgW0Fzc2V0VHlwZS5URVhUVVJFXSk7XG5cblx0XHRcdGlmICgoIXJldHVybmVkQXJyYXlbMF0pICYmIChkaWZmdXNlVGV4X2FkZHIgIT0gMCkpIHtcblx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIERpZmZ1c2VUZXh0dXJlIChJRCA9IFwiICsgZGlmZnVzZVRleF9hZGRyICsgXCIgKSBmb3IgdGhpcyBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsXCIpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAocmV0dXJuZWRBcnJheVswXSlcblx0XHRcdFx0ZGlmZnVzZVRleHR1cmUgPSByZXR1cm5lZEFycmF5WzFdO1xuXG5cdFx0XHRpZiAoZGlmZnVzZVRleHR1cmUpIHtcblx0XHRcdFx0bWF0LmRpZmZ1c2VUZXh0dXJlID0gZGlmZnVzZVRleHR1cmU7XG5cdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiIHwgRGlmZnVzZVRleHR1cmUtTmFtZSA9IFwiICsgZGlmZnVzZVRleHR1cmUubmFtZTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIG5vcm1hbFRleF9hZGRyOm51bWJlciA9IHByb3BzLmdldCgzLCAwKTtcblxuXHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKG5vcm1hbFRleF9hZGRyLCBbQXNzZXRUeXBlLlRFWFRVUkVdKTtcblxuXHRcdFx0aWYgKCghcmV0dXJuZWRBcnJheVswXSkgJiYgKG5vcm1hbFRleF9hZGRyICE9IDApKSB7XG5cdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBOb3JtYWxUZXh0dXJlIChJRCA9IFwiICsgbm9ybWFsVGV4X2FkZHIgKyBcIiApIGZvciB0aGlzIFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWxcIik7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChyZXR1cm5lZEFycmF5WzBdKSB7XG5cdFx0XHRcdG5vcm1hbFRleHR1cmUgPSByZXR1cm5lZEFycmF5WzFdO1xuXHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIiB8IE5vcm1hbFRleHR1cmUtTmFtZSA9IFwiICsgbm9ybWFsVGV4dHVyZS5uYW1lO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgc3BlY1RleF9hZGRyOm51bWJlciA9IHByb3BzLmdldCgyMSwgMCk7XG5cdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQoc3BlY1RleF9hZGRyLCBbQXNzZXRUeXBlLlRFWFRVUkVdKTtcblxuXHRcdFx0aWYgKCghcmV0dXJuZWRBcnJheVswXSkgJiYgKHNwZWNUZXhfYWRkciAhPSAwKSkge1xuXHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgU3BlY3VsYXJUZXh0dXJlIChJRCA9IFwiICsgc3BlY1RleF9hZGRyICsgXCIgKSBmb3IgdGhpcyBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsXCIpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHJldHVybmVkQXJyYXlbMF0pIHtcblx0XHRcdFx0c3BlY1RleHR1cmUgPSByZXR1cm5lZEFycmF5WzFdO1xuXHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIiB8IFNwZWN1bGFyVGV4dHVyZS1OYW1lID0gXCIgKyBzcGVjVGV4dHVyZS5uYW1lO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgbGlnaHRQaWNrZXJBZGRyOm51bWJlciA9IHByb3BzLmdldCgyMiwgMCk7XG5cdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQobGlnaHRQaWNrZXJBZGRyLCBbQXNzZXRUeXBlLkxJR0hUX1BJQ0tFUl0pXG5cblx0XHRcdGlmICgoIXJldHVybmVkQXJyYXlbMF0pICYmIChsaWdodFBpY2tlckFkZHIpKSB7XG5cdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBMaWdodFBpY2tlciAoSUQgPSBcIiArIGxpZ2h0UGlja2VyQWRkciArIFwiICkgZm9yIHRoaXMgVHJpYW5nbGVNZXRob2RNYXRlcmlhbFwiKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1hdC5saWdodFBpY2tlciA9IDxMaWdodFBpY2tlckJhc2U+IHJldHVybmVkQXJyYXlbMV07XG5cdFx0XHRcdC8vZGVidWdTdHJpbmcrPVwiIHwgTGlnaHRwaWNrZXItTmFtZSA9IFwiK0xpZ2h0UGlja2VyQmFzZShyZXR1cm5lZEFycmF5WzFdKS5uYW1lO1xuXHRcdFx0fVxuXG5cdFx0XHRtYXQuc21vb3RoID0gcHJvcHMuZ2V0KDUsIHRydWUpO1xuXHRcdFx0bWF0Lm1pcG1hcCA9IHByb3BzLmdldCg2LCB0cnVlKTtcblx0XHRcdG1hdC5ib3RoU2lkZXMgPSBwcm9wcy5nZXQoNywgZmFsc2UpO1xuXHRcdFx0bWF0LmFscGhhUHJlbXVsdGlwbGllZCA9IHByb3BzLmdldCg4LCBmYWxzZSk7XG5cdFx0XHRtYXQuYmxlbmRNb2RlID0gdGhpcy5ibGVuZE1vZGVEaWNbcHJvcHMuZ2V0KDksIDApXTtcblx0XHRcdG1hdC5yZXBlYXQgPSBwcm9wcy5nZXQoMTMsIGZhbHNlKTtcblxuXHRcdFx0aWYgKG5vcm1hbFRleHR1cmUpXG5cdFx0XHRcdG1hdC5ub3JtYWxNYXAgPSBub3JtYWxUZXh0dXJlO1xuXG5cdFx0XHRpZiAoc3BlY1RleHR1cmUpXG5cdFx0XHRcdG1hdC5zcGVjdWxhck1hcCA9IHNwZWNUZXh0dXJlO1xuXG5cdFx0XHRtYXQuYWxwaGFUaHJlc2hvbGQgPSBwcm9wcy5nZXQoMTIsIDAuMCk7XG5cdFx0XHRtYXQuYW1iaWVudCA9IHByb3BzLmdldCgxNSwgMS4wKTtcblx0XHRcdG1hdC5kaWZmdXNlQ29sb3IgPSBwcm9wcy5nZXQoMTYsIDB4ZmZmZmZmKTtcblx0XHRcdG1hdC5zcGVjdWxhciA9IHByb3BzLmdldCgxOCwgMS4wKTtcblx0XHRcdG1hdC5nbG9zcyA9IHByb3BzLmdldCgxOSwgNTApO1xuXHRcdFx0bWF0LnNwZWN1bGFyQ29sb3IgPSBwcm9wcy5nZXQoMjAsIDB4ZmZmZmZmKTtcblxuXHRcdFx0dmFyIG1ldGhvZHNfcGFyc2VkOm51bWJlciA9IDA7XG5cdFx0XHR2YXIgdGFyZ2V0SUQ6bnVtYmVyO1xuXG5cdFx0XHR3aGlsZSAobWV0aG9kc19wYXJzZWQgPCBudW1fbWV0aG9kcykge1xuXHRcdFx0XHR2YXIgbWV0aG9kX3R5cGU6bnVtYmVyO1xuXHRcdFx0XHRtZXRob2RfdHlwZSA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblxuXHRcdFx0XHRwcm9wcyA9IHRoaXMucGFyc2VQcm9wZXJ0aWVzKHsxOkFXRFBhcnNlci5CQUREUiwgMjpBV0RQYXJzZXIuQkFERFIsIDM6QVdEUGFyc2VyLkJBRERSLCAxMDE6dGhpcy5fcHJvcHNOclR5cGUsIDEwMjp0aGlzLl9wcm9wc05yVHlwZSwgMTAzOnRoaXMuX3Byb3BzTnJUeXBlLCAyMDE6QVdEUGFyc2VyLlVJTlQzMiwgMjAyOkFXRFBhcnNlci5VSU5UMzIsIDMwMTpBV0RQYXJzZXIuVUlOVDE2LCAzMDI6QVdEUGFyc2VyLlVJTlQxNiwgNDAxOkFXRFBhcnNlci5VSU5UOCwgNDAyOkFXRFBhcnNlci5VSU5UOCwgNjAxOkFXRFBhcnNlci5DT0xPUiwgNjAyOkFXRFBhcnNlci5DT0xPUiwgNzAxOkFXRFBhcnNlci5CT09MLCA3MDI6QVdEUGFyc2VyLkJPT0wsIDgwMTpBV0RQYXJzZXIuTVRYNHg0fSk7XG5cblx0XHRcdFx0c3dpdGNoIChtZXRob2RfdHlwZSkge1xuXHRcdFx0XHRcdGNhc2UgOTk5OiAvL3dyYXBwZXItTWV0aG9kcyB0aGF0IHdpbGwgbG9hZCBhIHByZXZpb3VzIHBhcnNlZCBFZmZla3RNZXRob2QgcmV0dXJuZWRcblxuXHRcdFx0XHRcdFx0dGFyZ2V0SUQgPSBwcm9wcy5nZXQoMSwgMCk7XG5cdFx0XHRcdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQodGFyZ2V0SUQsIFtBc3NldFR5cGUuRUZGRUNUU19NRVRIT0RdKTtcblxuXHRcdFx0XHRcdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBFZmZlY3RNZXRob2QgKElEID0gXCIgKyB0YXJnZXRJRCArIFwiICkgZm9yIHRoaXMgTWF0ZXJpYWxcIik7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRtYXQuYWRkRWZmZWN0TWV0aG9kKHJldHVybmVkQXJyYXlbMV0pO1xuXG5cdFx0XHRcdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiIHwgRWZmZWN0TWV0aG9kLU5hbWUgPSBcIiArICg8RWZmZWN0TWV0aG9kQmFzZT4gcmV0dXJuZWRBcnJheVsxXSkubmFtZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlIDk5ODogLy93cmFwcGVyLU1ldGhvZHMgdGhhdCB3aWxsIGxvYWQgYSBwcmV2aW91cyBwYXJzZWQgU2hhZG93TWFwTWV0aG9kXG5cblx0XHRcdFx0XHRcdHRhcmdldElEID0gcHJvcHMuZ2V0KDEsIDApO1xuXHRcdFx0XHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKHRhcmdldElELCBbQXNzZXRUeXBlLlNIQURPV19NQVBfTUVUSE9EXSk7XG5cblx0XHRcdFx0XHRcdGlmICghcmV0dXJuZWRBcnJheVswXSkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgU2hhZG93TWV0aG9kIChJRCA9IFwiICsgdGFyZ2V0SUQgKyBcIiApIGZvciB0aGlzIE1hdGVyaWFsXCIpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0bWF0LnNoYWRvd01ldGhvZCA9IHJldHVybmVkQXJyYXlbMV07XG5cdFx0XHRcdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiIHwgU2hhZG93TWV0aG9kLU5hbWUgPSBcIiArICg8U2hhZG93TWV0aG9kQmFzZT4gcmV0dXJuZWRBcnJheVsxXSkubmFtZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlIDE6IC8vRW52TWFwQW1iaWVudE1ldGhvZFxuXHRcdFx0XHRcdFx0dGFyZ2V0SUQgPSBwcm9wcy5nZXQoMSwgMCk7XG5cdFx0XHRcdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQodGFyZ2V0SUQsIFtBc3NldFR5cGUuVEVYVFVSRV0sIFwiQ3ViZVRleHR1cmVcIik7XG5cdFx0XHRcdFx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pXG5cdFx0XHRcdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBFbnZNYXAgKElEID0gXCIgKyB0YXJnZXRJRCArIFwiICkgZm9yIHRoaXMgRW52TWFwQW1iaWVudE1ldGhvZE1hdGVyaWFsXCIpO1xuXHRcdFx0XHRcdFx0bWF0LmFtYmllbnRNZXRob2QgPSBuZXcgQW1iaWVudEVudk1hcE1ldGhvZChyZXR1cm5lZEFycmF5WzFdKTtcblx0XHRcdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiIHwgQW1iaWVudEVudk1hcE1ldGhvZCB8IEVudk1hcC1OYW1lID1cIiArICg8Q3ViZVRleHR1cmVCYXNlPiByZXR1cm5lZEFycmF5WzFdKS5uYW1lO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlIDUxOiAvL0RlcHRoRGlmZnVzZU1ldGhvZFxuXHRcdFx0XHRcdFx0bWF0LmRpZmZ1c2VNZXRob2QgPSBuZXcgRGlmZnVzZURlcHRoTWV0aG9kKCk7XG5cdFx0XHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIiB8IERpZmZ1c2VEZXB0aE1ldGhvZFwiO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA1MjogLy9HcmFkaWVudERpZmZ1c2VNZXRob2Rcblx0XHRcdFx0XHRcdHRhcmdldElEID0gcHJvcHMuZ2V0KDEsIDApO1xuXHRcdFx0XHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKHRhcmdldElELCBbQXNzZXRUeXBlLlRFWFRVUkVdKTtcblx0XHRcdFx0XHRcdGlmICghcmV0dXJuZWRBcnJheVswXSlcblx0XHRcdFx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIEdyYWRpZW50RGlmZnVzZVRleHR1cmUgKElEID0gXCIgKyB0YXJnZXRJRCArIFwiICkgZm9yIHRoaXMgR3JhZGllbnREaWZmdXNlTWV0aG9kXCIpO1xuXHRcdFx0XHRcdFx0bWF0LmRpZmZ1c2VNZXRob2QgPSBuZXcgRGlmZnVzZUdyYWRpZW50TWV0aG9kKHJldHVybmVkQXJyYXlbMV0pO1xuXHRcdFx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCIgfCBEaWZmdXNlR3JhZGllbnRNZXRob2QgfCBHcmFkaWVudERpZmZ1c2VUZXh0dXJlLU5hbWUgPVwiICsgKDxUZXh0dXJlMkRCYXNlPiByZXR1cm5lZEFycmF5WzFdKS5uYW1lO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA1MzogLy9XcmFwRGlmZnVzZU1ldGhvZFxuXHRcdFx0XHRcdFx0bWF0LmRpZmZ1c2VNZXRob2QgPSBuZXcgRGlmZnVzZVdyYXBNZXRob2QocHJvcHMuZ2V0KDEwMSwgNSkpO1xuXHRcdFx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCIgfCBEaWZmdXNlV3JhcE1ldGhvZFwiO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSA1NDogLy9MaWdodE1hcERpZmZ1c2VNZXRob2Rcblx0XHRcdFx0XHRcdHRhcmdldElEID0gcHJvcHMuZ2V0KDEsIDApO1xuXHRcdFx0XHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKHRhcmdldElELCBbQXNzZXRUeXBlLlRFWFRVUkVdKTtcblx0XHRcdFx0XHRcdGlmICghcmV0dXJuZWRBcnJheVswXSlcblx0XHRcdFx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIExpZ2h0TWFwIChJRCA9IFwiICsgdGFyZ2V0SUQgKyBcIiApIGZvciB0aGlzIExpZ2h0TWFwRGlmZnVzZU1ldGhvZFwiKTtcblx0XHRcdFx0XHRcdG1hdC5kaWZmdXNlTWV0aG9kID0gbmV3IERpZmZ1c2VMaWdodE1hcE1ldGhvZChyZXR1cm5lZEFycmF5WzFdLCB0aGlzLmJsZW5kTW9kZURpY1twcm9wcy5nZXQoNDAxLCAxMCldLCBmYWxzZSwgbWF0LmRpZmZ1c2VNZXRob2QpO1xuXHRcdFx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCIgfCBEaWZmdXNlTGlnaHRNYXBNZXRob2QgfCBMaWdodE1hcFRleHR1cmUtTmFtZSA9XCIgKyAoPFRleHR1cmUyREJhc2U+IHJldHVybmVkQXJyYXlbMV0pLm5hbWU7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDU1OiAvL0NlbERpZmZ1c2VNZXRob2Rcblx0XHRcdFx0XHRcdG1hdC5kaWZmdXNlTWV0aG9kID0gbmV3IERpZmZ1c2VDZWxNZXRob2QocHJvcHMuZ2V0KDQwMSwgMyksIG1hdC5kaWZmdXNlTWV0aG9kKTtcblx0XHRcdFx0XHRcdCg8RGlmZnVzZUNlbE1ldGhvZD4gbWF0LmRpZmZ1c2VNZXRob2QpLnNtb290aG5lc3MgPSBwcm9wcy5nZXQoMTAxLCAwLjEpO1xuXHRcdFx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCIgfCBEaWZmdXNlQ2VsTWV0aG9kXCI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDU2OiAvL1N1YlN1cmZhY2VTY2F0dGVyaW5nTWV0aG9kXG4vL1x0XHRcdFx0XHRcdFx0bWF0LmRpZmZ1c2VNZXRob2QgPSBuZXcgRGlmZnVzZVN1YlN1cmZhY2VNZXRob2QoKTsgLy9kZXB0aE1hcFNpemUgYW5kIGRlcHRoTWFwT2Zmc2V0ID9cbi8vXHRcdFx0XHRcdFx0XHQoPERpZmZ1c2VTdWJTdXJmYWNlTWV0aG9kPiBtYXQuZGlmZnVzZU1ldGhvZCkuc2NhdHRlcmluZyA9IHByb3BzLmdldCgxMDEsIDAuMik7XG4vL1x0XHRcdFx0XHRcdFx0KDxEaWZmdXNlU3ViU3VyZmFjZU1ldGhvZD4gbWF0LmRpZmZ1c2VNZXRob2QpLnRyYW5zbHVjZW5jeSA9IHByb3BzLmdldCgxMDIsIDEpO1xuLy9cdFx0XHRcdFx0XHRcdCg8RGlmZnVzZVN1YlN1cmZhY2VNZXRob2Q+IG1hdC5kaWZmdXNlTWV0aG9kKS5zY2F0dGVyQ29sb3IgPSBwcm9wcy5nZXQoNjAxLCAweGZmZmZmZik7XG4vL1x0XHRcdFx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCIgfCBEaWZmdXNlU3ViU3VyZmFjZU1ldGhvZFwiO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlIDEwMTogLy9Bbmlzb3Ryb3BpY1NwZWN1bGFyTWV0aG9kXG5cdFx0XHRcdFx0XHRtYXQuc3BlY3VsYXJNZXRob2QgPSBuZXcgU3BlY3VsYXJBbmlzb3Ryb3BpY01ldGhvZCgpO1xuXHRcdFx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCIgfCBTcGVjdWxhckFuaXNvdHJvcGljTWV0aG9kXCI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDEwMjogLy9TcGVjdWxhclBob25nTWV0aG9kXG5cdFx0XHRcdFx0XHRtYXQuc3BlY3VsYXJNZXRob2QgPSBuZXcgU3BlY3VsYXJQaG9uZ01ldGhvZCgpO1xuXHRcdFx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCIgfCBTcGVjdWxhclBob25nTWV0aG9kXCI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIDEwMzogLy9DZWxsU3BlY3VsYXJNZXRob2Rcblx0XHRcdFx0XHRcdG1hdC5zcGVjdWxhck1ldGhvZCA9IG5ldyBTcGVjdWxhckNlbE1ldGhvZChwcm9wcy5nZXQoMTAxLCAwLjUpLCBtYXQuc3BlY3VsYXJNZXRob2QpO1xuXHRcdFx0XHRcdFx0KDxTcGVjdWxhckNlbE1ldGhvZD4gbWF0LnNwZWN1bGFyTWV0aG9kKS5zbW9vdGhuZXNzID0gcHJvcHMuZ2V0KDEwMiwgMC4xKTtcblx0XHRcdFx0XHRcdGRlYnVnU3RyaW5nICs9IFwiIHwgU3BlY3VsYXJDZWxNZXRob2RcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMTA0OiAvL1NwZWN1bGFyRnJlc25lbE1ldGhvZFxuXHRcdFx0XHRcdFx0bWF0LnNwZWN1bGFyTWV0aG9kID0gbmV3IFNwZWN1bGFyRnJlc25lbE1ldGhvZChwcm9wcy5nZXQoNzAxLCB0cnVlKSwgbWF0LnNwZWN1bGFyTWV0aG9kKTtcblx0XHRcdFx0XHRcdCg8U3BlY3VsYXJGcmVzbmVsTWV0aG9kPiBtYXQuc3BlY3VsYXJNZXRob2QpLmZyZXNuZWxQb3dlciA9IHByb3BzLmdldCgxMDEsIDUpO1xuXHRcdFx0XHRcdFx0KDxTcGVjdWxhckZyZXNuZWxNZXRob2Q+IG1hdC5zcGVjdWxhck1ldGhvZCkubm9ybWFsUmVmbGVjdGFuY2UgPSBwcm9wcy5nZXQoMTAyLCAwLjEpO1xuXHRcdFx0XHRcdFx0ZGVidWdTdHJpbmcgKz0gXCIgfCBTcGVjdWxhckZyZXNuZWxNZXRob2RcIjtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMTUxOi8vSGVpZ2h0TWFwTm9ybWFsTWV0aG9kIC0gdGhpb3MgaXMgbm90IGltcGxlbWVudGVkIGZvciBub3csIGJ1dCBtaWdodCBhcHBlYXIgbGF0ZXJcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgMTUyOiAvL1NpbXBsZVdhdGVyTm9ybWFsTWV0aG9kXG5cdFx0XHRcdFx0XHR0YXJnZXRJRCA9IHByb3BzLmdldCgxLCAwKTtcblx0XHRcdFx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRCh0YXJnZXRJRCwgW0Fzc2V0VHlwZS5URVhUVVJFXSk7XG5cdFx0XHRcdFx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pXG5cdFx0XHRcdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBTZWNvdW5kTm9ybWFsTWFwIChJRCA9IFwiICsgdGFyZ2V0SUQgKyBcIiApIGZvciB0aGlzIFNpbXBsZVdhdGVyTm9ybWFsTWV0aG9kXCIpO1xuXHRcdFx0XHRcdFx0aWYgKCFtYXQubm9ybWFsTWFwKVxuXHRcdFx0XHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCBhIG5vcm1hbCBNYXAgb24gdGhpcyBNYXRlcmlhbCB0byB1c2Ugd2l0aCB0aGlzIFNpbXBsZVdhdGVyTm9ybWFsTWV0aG9kXCIpO1xuXG5cdFx0XHRcdFx0XHRtYXQubm9ybWFsTWFwID0gcmV0dXJuZWRBcnJheVsxXTtcblx0XHRcdFx0XHRcdG1hdC5ub3JtYWxNZXRob2QgPSBuZXcgTm9ybWFsU2ltcGxlV2F0ZXJNZXRob2QobWF0Lm5vcm1hbE1hcCwgcmV0dXJuZWRBcnJheVsxXSk7XG5cdFx0XHRcdFx0XHRkZWJ1Z1N0cmluZyArPSBcIiB8IE5vcm1hbFNpbXBsZVdhdGVyTWV0aG9kIHwgU2Vjb25kLU5vcm1hbFRleHR1cmUtTmFtZSA9IFwiICsgKDxUZXh0dXJlMkRCYXNlPiByZXR1cm5lZEFycmF5WzFdKS5uYW1lO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0XHRcdG1ldGhvZHNfcGFyc2VkICs9IDE7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdG1hdC5leHRyYSA9IHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KDxJQXNzZXQ+IG1hdCwgbmFtZSk7XG5cblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IG1hdDtcblx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKGRlYnVnU3RyaW5nKTtcblx0XHR9XG5cdH1cblxuXHQvL0Jsb2NrIElEID0gODJcblx0cHJpdmF0ZSBwYXJzZVRleHR1cmUoYmxvY2tJRDpudW1iZXIpOnZvaWRcblx0e1xuXG5cdFx0dmFyIGFzc2V0OlRleHR1cmUyREJhc2U7XG5cblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0ubmFtZSA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblxuXHRcdHZhciB0eXBlOm51bWJlciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdHZhciBkYXRhX2xlbjpudW1iZXI7XG5cblx0XHR0aGlzLl90ZXh0dXJlX3VzZXJzW3RoaXMuX2N1cl9ibG9ja19pZC50b1N0cmluZygpXSA9IFtdO1xuXG5cdFx0Ly8gRXh0ZXJuYWxcblx0XHRpZiAodHlwZSA9PSAwKSB7XG5cdFx0XHRkYXRhX2xlbiA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0XHR2YXIgdXJsOnN0cmluZztcblx0XHRcdHVybCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVURkJ5dGVzKGRhdGFfbGVuKTtcblx0XHRcdHRoaXMuX3BBZGREZXBlbmRlbmN5KHRoaXMuX2N1cl9ibG9ja19pZC50b1N0cmluZygpLCBuZXcgVVJMUmVxdWVzdCh1cmwpLCBmYWxzZSwgbnVsbCwgdHJ1ZSk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGF0YV9sZW4gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXG5cdFx0XHR2YXIgZGF0YTpCeXRlQXJyYXk7XG5cdFx0XHRkYXRhID0gbmV3IEJ5dGVBcnJheSgpO1xuXHRcdFx0dGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkQnl0ZXMoZGF0YSwgMCwgZGF0YV9sZW4pO1xuXG5cdFx0XHQvL1xuXHRcdFx0Ly8gQVdEUGFyc2VyIC0gRml4IGZvciBGaXJlRm94IEJ1ZzogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NzE1MDc1IC5cblx0XHRcdC8vXG5cdFx0XHQvLyBDb252ZXJ0aW5nIGRhdGEgdG8gaW1hZ2UgaGVyZSBpbnN0ZWFkIG9mIHBhcnNlciAtIGZpeCBGaXJlRm94IGJ1ZyB3aGVyZSBpbWFnZSB3aWR0aCAvIGhlaWdodCBpcyAwIHdoZW4gY3JlYXRlZCBmcm9tIGRhdGFcblx0XHRcdC8vIFRoaXMgZ2l2ZXMgdGhlIGJyb3dzZXIgdGltZSB0byBpbml0aWFsaXNlIGltYWdlIHdpZHRoIC8gaGVpZ2h0LlxuXG5cdFx0XHR0aGlzLl9wQWRkRGVwZW5kZW5jeSh0aGlzLl9jdXJfYmxvY2tfaWQudG9TdHJpbmcoKSwgbnVsbCwgZmFsc2UsIFBhcnNlclV0aWxzLmJ5dGVBcnJheVRvSW1hZ2UoZGF0YSksIHRydWUpO1xuXHRcdFx0Ly90aGlzLl9wQWRkRGVwZW5kZW5jeSh0aGlzLl9jdXJfYmxvY2tfaWQudG9TdHJpbmcoKSwgbnVsbCwgZmFsc2UsIGRhdGEsIHRydWUpO1xuXG5cdFx0fVxuXG5cdFx0Ly8gSWdub3JlIGZvciBub3dcblx0XHR0aGlzLnBhcnNlUHJvcGVydGllcyhudWxsKTtcblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZXh0cmFzID0gdGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0dGhpcy5fcFBhdXNlQW5kUmV0cmlldmVEZXBlbmRlbmNpZXMoKTtcblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IGFzc2V0O1xuXG5cdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHR2YXIgdGV4dHVyZVN0eWxlc05hbWVzOkFycmF5PHN0cmluZz4gPSBbXCJleHRlcm5hbFwiLCBcImVtYmVkXCJdXG5cdFx0XHRjb25zb2xlLmxvZyhcIlN0YXJ0IHBhcnNpbmcgYSBcIiArIHRleHR1cmVTdHlsZXNOYW1lc1t0eXBlXSArIFwiIEJpdG1hcCBmb3IgVGV4dHVyZVwiKTtcblx0XHR9XG5cblx0fVxuXG5cdC8vQmxvY2sgSUQgPSA4M1xuXHRwcml2YXRlIHBhcnNlQ3ViZVRleHR1cmUoYmxvY2tJRDpudW1iZXIpOnZvaWRcblx0e1xuXHRcdC8vYmxvY2tMZW5ndGggPSBibG9jay5sZW47XG5cdFx0dmFyIGRhdGFfbGVuOm51bWJlcjtcblx0XHR2YXIgYXNzZXQ6Q3ViZVRleHR1cmVCYXNlO1xuXHRcdHZhciBpOm51bWJlcjtcblxuXHRcdHRoaXMuX2N1YmVUZXh0dXJlcyA9IG5ldyBBcnJheTxhbnk+KCk7XG5cdFx0dGhpcy5fdGV4dHVyZV91c2Vyc1sgdGhpcy5fY3VyX2Jsb2NrX2lkLnRvU3RyaW5nKCkgXSA9IFtdO1xuXG5cdFx0dmFyIHR5cGU6bnVtYmVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRCeXRlKCk7XG5cblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0ubmFtZSA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCA2OyBpKyspIHtcblx0XHRcdHRoaXMuX3RleHR1cmVfdXNlcnNbdGhpcy5fY3VyX2Jsb2NrX2lkLnRvU3RyaW5nKCldID0gW107XG5cdFx0XHR0aGlzLl9jdWJlVGV4dHVyZXMucHVzaChudWxsKTtcblxuXHRcdFx0Ly8gRXh0ZXJuYWxcblx0XHRcdGlmICh0eXBlID09IDApIHtcblx0XHRcdFx0ZGF0YV9sZW4gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdFx0XHR2YXIgdXJsOnN0cmluZztcblx0XHRcdFx0dXJsID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVVRGQnl0ZXMoZGF0YV9sZW4pO1xuXG5cdFx0XHRcdHRoaXMuX3BBZGREZXBlbmRlbmN5KHRoaXMuX2N1cl9ibG9ja19pZC50b1N0cmluZygpICsgXCIjXCIgKyBpLCBuZXcgVVJMUmVxdWVzdCh1cmwpLCBmYWxzZSwgbnVsbCwgdHJ1ZSk7XG5cdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdGRhdGFfbGVuID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRcdFx0dmFyIGRhdGE6Qnl0ZUFycmF5O1xuXHRcdFx0XHRkYXRhID0gbmV3IEJ5dGVBcnJheSgpO1xuXG5cdFx0XHRcdHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZEJ5dGVzKGRhdGEsIDAsIGRhdGFfbGVuKTtcblxuXHRcdFx0XHR0aGlzLl9wQWRkRGVwZW5kZW5jeSh0aGlzLl9jdXJfYmxvY2tfaWQudG9TdHJpbmcoKSArIFwiI1wiICsgaSwgbnVsbCwgZmFsc2UsIFBhcnNlclV0aWxzLmJ5dGVBcnJheVRvSW1hZ2UoZGF0YSksIHRydWUpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIElnbm9yZSBmb3Igbm93XG5cdFx0dGhpcy5wYXJzZVByb3BlcnRpZXMobnVsbCk7XG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmV4dHJhcyA9IHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdHRoaXMuX3BQYXVzZUFuZFJldHJpZXZlRGVwZW5kZW5jaWVzKCk7XG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBhc3NldDtcblxuXHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0dmFyIHRleHR1cmVTdHlsZXNOYW1lczpBcnJheTxzdHJpbmc+ID0gW1wiZXh0ZXJuYWxcIiwgXCJlbWJlZFwiXVxuXHRcdFx0Y29uc29sZS5sb2coXCJTdGFydCBwYXJzaW5nIDYgXCIgKyB0ZXh0dXJlU3R5bGVzTmFtZXNbdHlwZV0gKyBcIiBCaXRtYXBzIGZvciBDdWJlVGV4dHVyZVwiKTtcblx0XHR9XG5cdH1cblxuXHQvL0Jsb2NrIElEID0gOTFcblx0cHJpdmF0ZSBwYXJzZVNoYXJlZE1ldGhvZEJsb2NrKGJsb2NrSUQ6bnVtYmVyKTp2b2lkXG5cdHtcblx0XHR2YXIgYXNzZXQ6RWZmZWN0TWV0aG9kQmFzZTtcblxuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5uYW1lID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXHRcdGFzc2V0ID0gdGhpcy5wYXJzZVNoYXJlZE1ldGhvZExpc3QoYmxvY2tJRCk7XG5cdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBhc3NldDtcblx0XHR0aGlzLl9wRmluYWxpemVBc3NldCg8SUFzc2V0PiBhc3NldCwgdGhpcy5fYmxvY2tzW2Jsb2NrSURdLm5hbWUpO1xuXHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5kYXRhID0gYXNzZXQ7XG5cblx0XHRpZiAodGhpcy5fZGVidWcpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgRWZmZWN0TWV0aG9kOiBOYW1lID0gXCIgKyBhc3NldC5uYW1lICsgXCIgVHlwZSA9IFwiICsgYXNzZXQpO1xuXHRcdH1cblx0fVxuXG5cdC8vQmxvY2sgSUQgPSA5MlxuXHRwcml2YXRlIHBhcnNlU2hhZG93TWV0aG9kQmxvY2soYmxvY2tJRDpudW1iZXIpOnZvaWRcblx0e1xuXHRcdHZhciB0eXBlOm51bWJlcjtcblx0XHR2YXIgZGF0YV9sZW46bnVtYmVyO1xuXHRcdHZhciBhc3NldDpTaGFkb3dNZXRob2RCYXNlO1xuXHRcdHZhciBzaGFkb3dMaWdodElEOm51bWJlcjtcblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0ubmFtZSA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblxuXHRcdHNoYWRvd0xpZ2h0SUQgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdHZhciByZXR1cm5lZEFycmF5OkFycmF5PGFueT4gPSB0aGlzLmdldEFzc2V0QnlJRChzaGFkb3dMaWdodElELCBbQXNzZXRUeXBlLkxJR0hUXSk7XG5cblx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pIHtcblx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBUYXJnZXRMaWdodCAoSUQgPSBcIiArIHNoYWRvd0xpZ2h0SUQgKyBcIiApIGZvciB0aGlzIFNoYWRvd01ldGhvZCAtIFNoYWRvd01ldGhvZCBub3QgY3JlYXRlZFwiKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRhc3NldCA9IHRoaXMucGFyc2VTaGFkb3dNZXRob2RMaXN0KDxMaWdodEJhc2U+IHJldHVybmVkQXJyYXlbMV0sIGJsb2NrSUQpO1xuXG5cdFx0aWYgKCFhc3NldClcblx0XHRcdHJldHVybjtcblxuXHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpOyAvLyBJZ25vcmUgZm9yIG5vd1xuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KDxJQXNzZXQ+IGFzc2V0LCB0aGlzLl9ibG9ja3NbYmxvY2tJRF0ubmFtZSk7XG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBhc3NldDtcblxuXHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBTaGFkb3dNYXBNZXRob2RNZXRob2Q6IE5hbWUgPSBcIiArIGFzc2V0Lm5hbWUgKyBcIiB8IFR5cGUgPSBcIiArIGFzc2V0ICsgXCIgfCBMaWdodC1OYW1lID0gXCIsICggPExpZ2h0QmFzZT4gcmV0dXJuZWRBcnJheVsxXSApLm5hbWUpO1xuXHRcdH1cblx0fVxuXG5cblx0Ly9CbG9jayBJRCA9IDI1M1xuXHRwcml2YXRlIHBhcnNlQ29tbWFuZChibG9ja0lEOm51bWJlcik6dm9pZFxuXHR7XG5cdFx0dmFyIGhhc0Jsb2Nrczpib29sZWFuID0gKCB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKSA9PSAxICk7XG5cdFx0dmFyIHBhcl9pZDpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdHZhciBtdHg6TWF0cml4M0QgPSB0aGlzLnBhcnNlTWF0cml4M0QoKTtcblx0XHR2YXIgbmFtZTpzdHJpbmcgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cblx0XHR2YXIgcGFyZW50T2JqZWN0OkRpc3BsYXlPYmplY3RDb250YWluZXI7XG5cdFx0dmFyIHRhcmdldE9iamVjdDpEaXNwbGF5T2JqZWN0Q29udGFpbmVyO1xuXG5cdFx0dmFyIHJldHVybmVkQXJyYXk6QXJyYXk8YW55PiA9IHRoaXMuZ2V0QXNzZXRCeUlEKHBhcl9pZCwgW0Fzc2V0VHlwZS5DT05UQUlORVIsIEFzc2V0VHlwZS5MSUdIVCwgQXNzZXRUeXBlLk1FU0hdKTtcblxuXHRcdGlmIChyZXR1cm5lZEFycmF5WzBdKSB7XG5cdFx0XHRwYXJlbnRPYmplY3QgPSA8RGlzcGxheU9iamVjdENvbnRhaW5lcj4gcmV0dXJuZWRBcnJheVsxXTtcblx0XHR9XG5cblx0XHR2YXIgbnVtQ29tbWFuZHM6bnVtYmVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkU2hvcnQoKTtcblx0XHR2YXIgdHlwZUNvbW1hbmQ6bnVtYmVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkU2hvcnQoKTtcblxuXHRcdHZhciBwcm9wczpBV0RQcm9wZXJ0aWVzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoezE6QVdEUGFyc2VyLkJBRERSfSk7XG5cblx0XHRzd2l0Y2ggKHR5cGVDb21tYW5kKSB7XG5cdFx0XHRjYXNlIDE6XG5cblx0XHRcdFx0dmFyIHRhcmdldElEOm51bWJlciA9IHByb3BzLmdldCgxLCAwKTtcblx0XHRcdFx0dmFyIHJldHVybmVkQXJyYXlUYXJnZXQ6QXJyYXk8YW55PiA9IHRoaXMuZ2V0QXNzZXRCeUlEKHRhcmdldElELCBbQXNzZXRUeXBlLkxJR0hULCBBc3NldFR5cGUuVEVYVFVSRV9QUk9KRUNUT1JdKTsgLy9mb3Igbm8gb25seSBsaWdodCBpcyByZXF1ZXN0ZWQhISEhXG5cblx0XHRcdFx0aWYgKCghcmV0dXJuZWRBcnJheVRhcmdldFswXSkgJiYgKHRhcmdldElEICE9IDApKSB7XG5cdFx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIGxpZ2h0IChJRCA9IFwiICsgdGFyZ2V0SUQgKyBcIiAoIGZvciB0aGlzIENvbW1hbmRCb2NrIVwiKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0YXJnZXRPYmplY3QgPSByZXR1cm5lZEFycmF5VGFyZ2V0WzFdO1xuXG5cdFx0XHRcdGlmIChwYXJlbnRPYmplY3QpIHtcblx0XHRcdFx0XHRwYXJlbnRPYmplY3QuYWRkQ2hpbGQodGFyZ2V0T2JqZWN0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRhcmdldE9iamVjdC50cmFuc2Zvcm0ubWF0cml4M0QgPSBtdHg7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0aWYgKHRhcmdldE9iamVjdCkge1xuXHRcdFx0cHJvcHMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7MTp0aGlzLl9tYXRyaXhOclR5cGUsIDI6dGhpcy5fbWF0cml4TnJUeXBlLCAzOnRoaXMuX21hdHJpeE5yVHlwZSwgNDpBV0RQYXJzZXIuVUlOVDh9KTtcblxuXHRcdFx0dGFyZ2V0T2JqZWN0LnBpdm90ID0gbmV3IFZlY3RvcjNEKHByb3BzLmdldCgxLCAwKSwgcHJvcHMuZ2V0KDIsIDApLCBwcm9wcy5nZXQoMywgMCkpO1xuXHRcdFx0dGFyZ2V0T2JqZWN0LmV4dHJhID0gdGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cblx0XHR9XG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSB0YXJnZXRPYmplY3RcblxuXHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBDb21tYW5kQmxvY2s6IE5hbWUgPSAnXCIgKyBuYW1lKTtcblx0XHR9XG5cblx0fVxuXG5cdC8vYmxvY2tJRCAyNTVcblx0cHJpdmF0ZSBwYXJzZU1ldGFEYXRhKGJsb2NrSUQ6bnVtYmVyKTp2b2lkXG5cdHtcblx0XHR2YXIgcHJvcHM6QVdEUHJvcGVydGllcyA9IHRoaXMucGFyc2VQcm9wZXJ0aWVzKHsxOkFXRFBhcnNlci5VSU5UMzIsIDI6QVdEUGFyc2VyLkFXRFNUUklORywgMzpBV0RQYXJzZXIuQVdEU1RSSU5HLCA0OkFXRFBhcnNlci5BV0RTVFJJTkcsIDU6QVdEUGFyc2VyLkFXRFNUUklOR30pO1xuXG5cdFx0aWYgKHRoaXMuX2RlYnVnKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIE1ldGFEYXRhQmxvY2s6IFRpbWVTdGFtcCAgICAgICAgID0gXCIgKyBwcm9wcy5nZXQoMSwgMCkpO1xuXHRcdFx0Y29uc29sZS5sb2coXCIgICAgICAgICAgICAgICAgICAgICAgICBFbmNvZGVyTmFtZSAgICAgICA9IFwiICsgcHJvcHMuZ2V0KDIsIFwidW5rbm93blwiKSk7XG5cdFx0XHRjb25zb2xlLmxvZyhcIiAgICAgICAgICAgICAgICAgICAgICAgIEVuY29kZXJWZXJzaW9uICAgID0gXCIgKyBwcm9wcy5nZXQoMywgXCJ1bmtub3duXCIpKTtcblx0XHRcdGNvbnNvbGUubG9nKFwiICAgICAgICAgICAgICAgICAgICAgICAgR2VuZXJhdG9yTmFtZSAgICAgPSBcIiArIHByb3BzLmdldCg0LCBcInVua25vd25cIikpO1xuXHRcdFx0Y29uc29sZS5sb2coXCIgICAgICAgICAgICAgICAgICAgICAgICBHZW5lcmF0b3JWZXJzaW9uICA9IFwiICsgcHJvcHMuZ2V0KDUsIFwidW5rbm93blwiKSk7XG5cdFx0fVxuXHR9XG5cblx0Ly9ibG9ja0lEIDI1NFxuXHRwcml2YXRlIHBhcnNlTmFtZVNwYWNlKGJsb2NrSUQ6bnVtYmVyKTp2b2lkXG5cdHtcblx0XHR2YXIgaWQ6bnVtYmVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRCeXRlKCk7XG5cdFx0dmFyIG5hbWVTcGFjZVN0cmluZzpzdHJpbmcgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0aWYgKHRoaXMuX2RlYnVnKVxuXHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBOYW1lU3BhY2VCbG9jazogSUQgPSBcIiArIGlkICsgXCIgfCBTdHJpbmcgPSBcIiArIG5hbWVTcGFjZVN0cmluZyk7XG5cdH1cblxuXHQvLy0tUGFyc2VyIFVUSUxTLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0Ly8gdGhpcyBmdW5jdGlvbnMgcmVhZHMgYW5kIGNyZWF0ZXMgYSBTaGFkb3dNZXRob2RNZXRob2Rcblx0cHJpdmF0ZSBwYXJzZVNoYWRvd01ldGhvZExpc3QobGlnaHQ6TGlnaHRCYXNlLCBibG9ja0lEOm51bWJlcik6U2hhZG93TWV0aG9kQmFzZVxuXHR7XG5cblx0XHR2YXIgbWV0aG9kVHlwZTpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0dmFyIHNoYWRvd01ldGhvZDpTaGFkb3dNZXRob2RCYXNlO1xuXHRcdHZhciBwcm9wczpBV0RQcm9wZXJ0aWVzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoezE6QVdEUGFyc2VyLkJBRERSLCAyOkFXRFBhcnNlci5CQUREUiwgMzpBV0RQYXJzZXIuQkFERFIsIDEwMTp0aGlzLl9wcm9wc05yVHlwZSwgMTAyOnRoaXMuX3Byb3BzTnJUeXBlLCAxMDM6dGhpcy5fcHJvcHNOclR5cGUsIDIwMTpBV0RQYXJzZXIuVUlOVDMyLCAyMDI6QVdEUGFyc2VyLlVJTlQzMiwgMzAxOkFXRFBhcnNlci5VSU5UMTYsIDMwMjpBV0RQYXJzZXIuVUlOVDE2LCA0MDE6QVdEUGFyc2VyLlVJTlQ4LCA0MDI6QVdEUGFyc2VyLlVJTlQ4LCA2MDE6QVdEUGFyc2VyLkNPTE9SLCA2MDI6QVdEUGFyc2VyLkNPTE9SLCA3MDE6QVdEUGFyc2VyLkJPT0wsIDcwMjpBV0RQYXJzZXIuQk9PTCwgODAxOkFXRFBhcnNlci5NVFg0eDR9KTtcblxuXHRcdHZhciB0YXJnZXRJRDpudW1iZXI7XG5cdFx0dmFyIHJldHVybmVkQXJyYXk6QXJyYXk8YW55PlxuXHRcdHN3aXRjaCAobWV0aG9kVHlwZSkge1xuXHRcdFx0Ly9cdFx0XHRcdGNhc2UgMTAwMTogLy9DYXNjYWRlU2hhZG93TWFwTWV0aG9kXG5cdFx0XHQvL1x0XHRcdFx0XHR0YXJnZXRJRCA9IHByb3BzLmdldCgxLCAwKTtcblx0XHRcdC8vXHRcdFx0XHRcdHJldHVybmVkQXJyYXkgPSBnZXRBc3NldEJ5SUQodGFyZ2V0SUQsIFtBc3NldFR5cGUuU0hBRE9XX01BUF9NRVRIT0RdKTtcblx0XHRcdC8vXHRcdFx0XHRcdGlmICghcmV0dXJuZWRBcnJheVswXSkge1xuXHRcdFx0Ly9cdFx0XHRcdFx0XHRfYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIFNoYWRvd0Jhc2VNZXRob2QgKElEID0gXCIgKyB0YXJnZXRJRCArIFwiICkgZm9yIHRoaXMgQ2FzY2FkZVNoYWRvd01hcE1ldGhvZCAtIFNoYWRvd01ldGhvZCBub3QgY3JlYXRlZFwiKTtcblx0XHRcdC8vXHRcdFx0XHRcdFx0cmV0dXJuIHNoYWRvd01ldGhvZDtcblx0XHRcdC8vXHRcdFx0XHRcdH1cblx0XHRcdC8vXHRcdFx0XHRcdHNoYWRvd01ldGhvZCA9IG5ldyBDYXNjYWRlU2hhZG93TWFwTWV0aG9kKHJldHVybmVkQXJyYXlbMV0pO1xuXHRcdFx0Ly9cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDEwMDI6IC8vU2hhZG93TmVhck1ldGhvZFxuXHRcdFx0XHR0YXJnZXRJRCA9IHByb3BzLmdldCgxLCAwKTtcblx0XHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKHRhcmdldElELCBbQXNzZXRUeXBlLlNIQURPV19NQVBfTUVUSE9EXSk7XG5cdFx0XHRcdGlmICghcmV0dXJuZWRBcnJheVswXSkge1xuXHRcdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBTaGFkb3dCYXNlTWV0aG9kIChJRCA9IFwiICsgdGFyZ2V0SUQgKyBcIiApIGZvciB0aGlzIFNoYWRvd05lYXJNZXRob2QgLSBTaGFkb3dNZXRob2Qgbm90IGNyZWF0ZWRcIik7XG5cdFx0XHRcdFx0cmV0dXJuIHNoYWRvd01ldGhvZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRzaGFkb3dNZXRob2QgPSBuZXcgU2hhZG93TmVhck1ldGhvZCg8U2hhZG93TWV0aG9kQmFzZT4gcmV0dXJuZWRBcnJheVsxXSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAxMTAxOiAvL1NoYWRvd0ZpbHRlcmVkTWV0aG9kXG5cblx0XHRcdFx0c2hhZG93TWV0aG9kID0gbmV3IFNoYWRvd0ZpbHRlcmVkTWV0aG9kKDxEaXJlY3Rpb25hbExpZ2h0PiBsaWdodCk7XG5cdFx0XHRcdCg8U2hhZG93RmlsdGVyZWRNZXRob2Q+IHNoYWRvd01ldGhvZCkuYWxwaGEgPSBwcm9wcy5nZXQoMTAxLCAxKTtcblx0XHRcdFx0KDxTaGFkb3dGaWx0ZXJlZE1ldGhvZD4gc2hhZG93TWV0aG9kKS5lcHNpbG9uID0gcHJvcHMuZ2V0KDEwMiwgMC4wMDIpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAxMTAyOiAvL1NoYWRvd0RpdGhlcmVkTWV0aG9kXG5cblxuXHRcdFx0XHRzaGFkb3dNZXRob2QgPSBuZXcgU2hhZG93RGl0aGVyZWRNZXRob2QoPERpcmVjdGlvbmFsTGlnaHQ+IGxpZ2h0LCA8bnVtYmVyPiBwcm9wcy5nZXQoMjAxLCA1KSk7XG5cdFx0XHRcdCg8U2hhZG93RGl0aGVyZWRNZXRob2Q+IHNoYWRvd01ldGhvZCkuYWxwaGEgPSBwcm9wcy5nZXQoMTAxLCAxKTtcblx0XHRcdFx0KDxTaGFkb3dEaXRoZXJlZE1ldGhvZD4gc2hhZG93TWV0aG9kKS5lcHNpbG9uID0gcHJvcHMuZ2V0KDEwMiwgMC4wMDIpO1xuXHRcdFx0XHQoPFNoYWRvd0RpdGhlcmVkTWV0aG9kPiBzaGFkb3dNZXRob2QpLnJhbmdlID0gcHJvcHMuZ2V0KDEwMywgMSk7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDExMDM6IC8vU2hhZG93U29mdE1ldGhvZFxuXG5cdFx0XHRcdHNoYWRvd01ldGhvZCA9IG5ldyBTaGFkb3dTb2Z0TWV0aG9kKDxEaXJlY3Rpb25hbExpZ2h0PiBsaWdodCwgPG51bWJlcj4gcHJvcHMuZ2V0KDIwMSwgNSkpO1xuXHRcdFx0XHQoPFNoYWRvd1NvZnRNZXRob2Q+IHNoYWRvd01ldGhvZCkuYWxwaGEgPSBwcm9wcy5nZXQoMTAxLCAxKTtcblx0XHRcdFx0KDxTaGFkb3dTb2Z0TWV0aG9kPiBzaGFkb3dNZXRob2QpLmVwc2lsb24gPSBwcm9wcy5nZXQoMTAyLCAwLjAwMik7XG5cdFx0XHRcdCg8U2hhZG93U29mdE1ldGhvZD4gc2hhZG93TWV0aG9kKS5yYW5nZSA9IHByb3BzLmdldCgxMDMsIDEpO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAxMTA0OiAvL1NoYWRvd0hhcmRNZXRob2Rcblx0XHRcdFx0c2hhZG93TWV0aG9kID0gbmV3IFNoYWRvd0hhcmRNZXRob2QobGlnaHQpO1xuXHRcdFx0XHQoPFNoYWRvd0hhcmRNZXRob2Q+IHNoYWRvd01ldGhvZCkuYWxwaGEgPSBwcm9wcy5nZXQoMTAxLCAxKTtcblx0XHRcdFx0KDxTaGFkb3dIYXJkTWV0aG9kPiBzaGFkb3dNZXRob2QpLmVwc2lsb24gPSBwcm9wcy5nZXQoMTAyLCAwLjAwMik7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0fVxuXHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdHJldHVybiBzaGFkb3dNZXRob2Q7XG5cdH1cblxuXHQvL0Jsb2NrIElEIDEwMVxuXHRwcml2YXRlIHBhcnNlU2tlbGV0b24oYmxvY2tJRDpudW1iZXIgLyp1aW50Ki8pOnZvaWRcblx0e1xuXHRcdHZhciBuYW1lOnN0cmluZyA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblx0XHR2YXIgbnVtX2pvaW50czpudW1iZXIgLyp1aW50Ki8gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0dmFyIHNrZWxldG9uOlNrZWxldG9uID0gbmV3IFNrZWxldG9uKCk7XG5cdFx0dGhpcy5wYXJzZVByb3BlcnRpZXMobnVsbCk7IC8vIERpc2NhcmQgcHJvcGVydGllcyBmb3Igbm93XHRcdFxuXG5cdFx0dmFyIGpvaW50c19wYXJzZWQ6bnVtYmVyIC8qdWludCovID0gMDtcblx0XHR3aGlsZSAoam9pbnRzX3BhcnNlZCA8IG51bV9qb2ludHMpIHtcblx0XHRcdHZhciBqb2ludDpTa2VsZXRvbkpvaW50O1xuXHRcdFx0dmFyIGlicDpNYXRyaXgzRDtcblx0XHRcdC8vIElnbm9yZSBqb2ludCBpZFxuXHRcdFx0dGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdFx0am9pbnQgPSBuZXcgU2tlbGV0b25Kb2ludCgpO1xuXHRcdFx0am9pbnQucGFyZW50SW5kZXggPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCkgLSAxOyAvLyAwPW51bGwgaW4gQVdEXG5cdFx0XHRqb2ludC5uYW1lID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXG5cdFx0XHRpYnAgPSB0aGlzLnBhcnNlTWF0cml4M0QoKTtcblx0XHRcdGpvaW50LmludmVyc2VCaW5kUG9zZSA9IGlicC5yYXdEYXRhO1xuXHRcdFx0Ly8gSWdub3JlIGpvaW50IHByb3BzL2F0dHJpYnV0ZXMgZm9yIG5vd1xuXHRcdFx0dGhpcy5wYXJzZVByb3BlcnRpZXMobnVsbCk7XG5cdFx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHRcdHNrZWxldG9uLmpvaW50cy5wdXNoKGpvaW50KTtcblx0XHRcdGpvaW50c19wYXJzZWQrKztcblx0XHR9XG5cblx0XHQvLyBEaXNjYXJkIGF0dHJpYnV0ZXMgZm9yIG5vd1xuXHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KHNrZWxldG9uLCBuYW1lKTtcblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IHNrZWxldG9uO1xuXHRcdGlmICh0aGlzLl9kZWJ1Zylcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgU2tlbGV0b246IE5hbWUgPSBcIiArIHNrZWxldG9uLm5hbWUgKyBcIiB8IE51bWJlciBvZiBKb2ludHMgPSBcIiArIGpvaW50c19wYXJzZWQpO1xuXHR9XG5cblx0Ly9CbG9jayBJRCA9IDEwMlxuXHRwcml2YXRlIHBhcnNlU2tlbGV0b25Qb3NlKGJsb2NrSUQ6bnVtYmVyIC8qdWludCovKTp2b2lkXG5cdHtcblx0XHR2YXIgbmFtZTpzdHJpbmcgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0dmFyIG51bV9qb2ludHM6bnVtYmVyIC8qdWludCovID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdHRoaXMucGFyc2VQcm9wZXJ0aWVzKG51bGwpOyAvLyBJZ25vcmUgcHJvcGVydGllcyBmb3Igbm93XG5cblx0XHR2YXIgcG9zZTpTa2VsZXRvblBvc2UgPSBuZXcgU2tlbGV0b25Qb3NlKCk7XG5cblx0XHR2YXIgam9pbnRzX3BhcnNlZDpudW1iZXIgLyp1aW50Ki8gPSAwO1xuXHRcdHdoaWxlIChqb2ludHNfcGFyc2VkIDwgbnVtX2pvaW50cykge1xuXHRcdFx0dmFyIGpvaW50X3Bvc2U6Sm9pbnRQb3NlO1xuXHRcdFx0dmFyIGhhc190cmFuc2Zvcm06bnVtYmVyIC8qdWludCovO1xuXHRcdFx0am9pbnRfcG9zZSA9IG5ldyBKb2ludFBvc2UoKTtcblx0XHRcdGhhc190cmFuc2Zvcm0gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHRcdGlmIChoYXNfdHJhbnNmb3JtID09IDEpIHtcblx0XHRcdFx0dmFyIG10eF9kYXRhOkFycmF5PG51bWJlcj4gPSB0aGlzLnBhcnNlTWF0cml4NDNSYXdEYXRhKCk7XG5cblx0XHRcdFx0dmFyIG10eDpNYXRyaXgzRCA9IG5ldyBNYXRyaXgzRChtdHhfZGF0YSk7XG5cdFx0XHRcdGpvaW50X3Bvc2Uub3JpZW50YXRpb24uZnJvbU1hdHJpeChtdHgpO1xuXHRcdFx0XHRqb2ludF9wb3NlLnRyYW5zbGF0aW9uLmNvcHlGcm9tKG10eC5wb3NpdGlvbik7XG5cblx0XHRcdFx0cG9zZS5qb2ludFBvc2VzW2pvaW50c19wYXJzZWRdID0gam9pbnRfcG9zZTtcblx0XHRcdH1cblx0XHRcdGpvaW50c19wYXJzZWQrKztcblx0XHR9XG5cdFx0Ly8gU2tpcCBhdHRyaWJ1dGVzIGZvciBub3dcblx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHR0aGlzLl9wRmluYWxpemVBc3NldChwb3NlLCBuYW1lKTtcblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IHBvc2U7XG5cdFx0aWYgKHRoaXMuX2RlYnVnKVxuXHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBTa2VsZXRvblBvc2U6IE5hbWUgPSBcIiArIHBvc2UubmFtZSArIFwiIHwgTnVtYmVyIG9mIEpvaW50cyA9IFwiICsgam9pbnRzX3BhcnNlZCk7XG5cdH1cblxuXHQvL2Jsb2NrSUQgMTAzXG5cdHByaXZhdGUgcGFyc2VTa2VsZXRvbkFuaW1hdGlvbihibG9ja0lEOm51bWJlciAvKnVpbnQqLyk6dm9pZFxuXHR7XG5cdFx0dmFyIGZyYW1lX2R1cjpudW1iZXI7XG5cdFx0dmFyIHBvc2VfYWRkcjpudW1iZXIgLyp1aW50Ki87XG5cdFx0dmFyIG5hbWU6c3RyaW5nID0gdGhpcy5wYXJzZVZhclN0cigpO1xuXHRcdHZhciBjbGlwOlNrZWxldG9uQ2xpcE5vZGUgPSBuZXcgU2tlbGV0b25DbGlwTm9kZSgpO1xuXHRcdHZhciBudW1fZnJhbWVzOm51bWJlciAvKnVpbnQqLyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHR0aGlzLnBhcnNlUHJvcGVydGllcyhudWxsKTsgLy8gSWdub3JlIHByb3BlcnRpZXMgZm9yIG5vd1xuXG5cdFx0dmFyIGZyYW1lc19wYXJzZWQ6bnVtYmVyIC8qdWludCovID0gMDtcblx0XHR2YXIgcmV0dXJuZWRBcnJheTpBcnJheTxhbnk+O1xuXHRcdHdoaWxlIChmcmFtZXNfcGFyc2VkIDwgbnVtX2ZyYW1lcykge1xuXHRcdFx0cG9zZV9hZGRyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRcdGZyYW1lX2R1ciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRChwb3NlX2FkZHIsIFtBc3NldFR5cGUuU0tFTEVUT05fUE9TRV0pO1xuXHRcdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKVxuXHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgU2tlbGV0b25Qb3NlIEZyYW1lICMgXCIgKyBmcmFtZXNfcGFyc2VkICsgXCIgKElEID0gXCIgKyBwb3NlX2FkZHIgKyBcIiApIGZvciB0aGlzIFNrZWxldG9uQ2xpcE5vZGVcIik7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGNsaXAuYWRkRnJhbWUoPFNrZWxldG9uUG9zZT4gdGhpcy5fYmxvY2tzW3Bvc2VfYWRkcl0uZGF0YSwgZnJhbWVfZHVyKTtcblx0XHRcdGZyYW1lc19wYXJzZWQrKztcblx0XHR9XG5cdFx0aWYgKGNsaXAuZnJhbWVzLmxlbmd0aCA9PSAwKSB7XG5cdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgdGhpcyBTa2VsZXRvbkNsaXBOb2RlLCBiZWNhdXNlIG5vIEZyYW1lcyB3aGVyZSBzZXQuXCIpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvLyBJZ25vcmUgYXR0cmlidXRlcyBmb3Igbm93XG5cdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQoY2xpcCwgbmFtZSk7XG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSBjbGlwO1xuXHRcdGlmICh0aGlzLl9kZWJ1Zylcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFyc2VkIGEgU2tlbGV0b25DbGlwTm9kZTogTmFtZSA9IFwiICsgY2xpcC5uYW1lICsgXCIgfCBOdW1iZXIgb2YgRnJhbWVzID0gXCIgKyBjbGlwLmZyYW1lcy5sZW5ndGgpO1xuXHR9XG5cblx0Ly9CbG9jayBJRCA9IDExMSAvICBCbG9jayBJRCA9IDExMlxuXHRwcml2YXRlIHBhcnNlTWVzaFBvc2VBbmltYXRpb24oYmxvY2tJRDpudW1iZXIgLyp1aW50Ki8sIHBvc2VPbmx5OmJvb2xlYW4gPSBmYWxzZSk6dm9pZFxuXHR7XG5cdFx0dmFyIG51bV9mcmFtZXM6bnVtYmVyIC8qdWludCovID0gMTtcblx0XHR2YXIgbnVtX3N1Ym1lc2hlczpudW1iZXIgLyp1aW50Ki87XG5cdFx0dmFyIGZyYW1lc19wYXJzZWQ6bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciBzdWJNZXNoUGFyc2VkOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgZnJhbWVfZHVyOm51bWJlcjtcblx0XHR2YXIgeDpudW1iZXI7XG5cdFx0dmFyIHk6bnVtYmVyO1xuXHRcdHZhciB6Om51bWJlcjtcblx0XHR2YXIgc3RyX2xlbjpudW1iZXI7XG5cdFx0dmFyIHN0cl9lbmQ6bnVtYmVyO1xuXHRcdHZhciBnZW9tZXRyeTpHZW9tZXRyeTtcblx0XHR2YXIgc3ViR2VvbTpUcmlhbmdsZVN1Ykdlb21ldHJ5O1xuXHRcdHZhciBpZHg6bnVtYmVyIC8qaW50Ki8gPSAwO1xuXHRcdHZhciBjbGlwOlZlcnRleENsaXBOb2RlID0gbmV3IFZlcnRleENsaXBOb2RlKCk7XG5cdFx0dmFyIGluZGljZXM6QXJyYXk8bnVtYmVyPiAvKnVpbnQqLztcblx0XHR2YXIgdmVydHM6QXJyYXk8bnVtYmVyPjtcblx0XHR2YXIgbnVtX1N0cmVhbXM6bnVtYmVyIC8qaW50Ki8gPSAwO1xuXHRcdHZhciBzdHJlYW1zUGFyc2VkOm51bWJlciAvKmludCovID0gMDtcblx0XHR2YXIgc3RyZWFtdHlwZXM6QXJyYXk8bnVtYmVyPiAvKmludCovID0gbmV3IEFycmF5PG51bWJlcj4oKSAvKmludCovO1xuXHRcdHZhciBwcm9wczpBV0RQcm9wZXJ0aWVzO1xuXHRcdHZhciB0aGlzR2VvOkdlb21ldHJ5O1xuXHRcdHZhciBuYW1lOnN0cmluZyA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblx0XHR2YXIgZ2VvQWRyZXNzOm51bWJlciAvKmludCovID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHR2YXIgcmV0dXJuZWRBcnJheTpBcnJheTxhbnk+ID0gdGhpcy5nZXRBc3NldEJ5SUQoZ2VvQWRyZXNzLCBbQXNzZXRUeXBlLkdFT01FVFJZXSk7XG5cdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKSB7XG5cdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgdGFyZ2V0LUdlb21ldHJ5LU9iamVjdCBcIiArIGdlb0FkcmVzcyArIFwiICkgZm9yIHRoaXMgVmVydGV4Q2xpcE5vZGVcIik7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHZhciB1dnM6QXJyYXk8QXJyYXk8bnVtYmVyPj4gPSB0aGlzLmdldFVWRm9yVmVydGV4QW5pbWF0aW9uKGdlb0FkcmVzcyk7XG5cdFx0aWYgKCFwb3NlT25seSlcblx0XHRcdG51bV9mcmFtZXMgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cblx0XHRudW1fc3VibWVzaGVzID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdG51bV9TdHJlYW1zID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdHN0cmVhbXNQYXJzZWQgPSAwO1xuXHRcdHdoaWxlIChzdHJlYW1zUGFyc2VkIDwgbnVtX1N0cmVhbXMpIHtcblx0XHRcdHN0cmVhbXR5cGVzLnB1c2godGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpKTtcblx0XHRcdHN0cmVhbXNQYXJzZWQrKztcblx0XHR9XG5cdFx0cHJvcHMgPSB0aGlzLnBhcnNlUHJvcGVydGllcyh7MTpBV0RQYXJzZXIuQk9PTCwgMjpBV0RQYXJzZXIuQk9PTH0pO1xuXG5cdFx0Y2xpcC5sb29waW5nID0gcHJvcHMuZ2V0KDEsIHRydWUpO1xuXHRcdGNsaXAuc3RpdGNoRmluYWxGcmFtZSA9IHByb3BzLmdldCgyLCBmYWxzZSk7XG5cblx0XHRmcmFtZXNfcGFyc2VkID0gMDtcblx0XHR3aGlsZSAoZnJhbWVzX3BhcnNlZCA8IG51bV9mcmFtZXMpIHtcblx0XHRcdGZyYW1lX2R1ciA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRcdGdlb21ldHJ5ID0gbmV3IEdlb21ldHJ5KCk7XG5cdFx0XHRzdWJNZXNoUGFyc2VkID0gMDtcblx0XHRcdHdoaWxlIChzdWJNZXNoUGFyc2VkIDwgbnVtX3N1Ym1lc2hlcykge1xuXHRcdFx0XHRzdHJlYW1zUGFyc2VkID0gMDtcblx0XHRcdFx0c3RyX2xlbiA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0XHRcdHN0cl9lbmQgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uICsgc3RyX2xlbjtcblx0XHRcdFx0d2hpbGUgKHN0cmVhbXNQYXJzZWQgPCBudW1fU3RyZWFtcykge1xuXHRcdFx0XHRcdGlmIChzdHJlYW10eXBlc1tzdHJlYW1zUGFyc2VkXSA9PSAxKSB7XG5cdFx0XHRcdFx0XHRpbmRpY2VzID0gKDxHZW9tZXRyeT4gcmV0dXJuZWRBcnJheVsxXSkuc3ViR2VvbWV0cmllc1tzdWJNZXNoUGFyc2VkXS5pbmRpY2VzO1xuXHRcdFx0XHRcdFx0dmVydHMgPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuXHRcdFx0XHRcdFx0aWR4ID0gMDtcblx0XHRcdFx0XHRcdHdoaWxlICh0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uIDwgc3RyX2VuZCkge1xuXHRcdFx0XHRcdFx0XHR4ID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5R2VvKVxuXHRcdFx0XHRcdFx0XHR5ID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5R2VvKVxuXHRcdFx0XHRcdFx0XHR6ID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5R2VvKVxuXHRcdFx0XHRcdFx0XHR2ZXJ0c1tpZHgrK10gPSB4O1xuXHRcdFx0XHRcdFx0XHR2ZXJ0c1tpZHgrK10gPSB5O1xuXHRcdFx0XHRcdFx0XHR2ZXJ0c1tpZHgrK10gPSB6O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0c3ViR2VvbSA9IG5ldyBUcmlhbmdsZVN1Ykdlb21ldHJ5KHRydWUpO1xuXHRcdFx0XHRcdFx0c3ViR2VvbS51cGRhdGVJbmRpY2VzKGluZGljZXMpO1xuXHRcdFx0XHRcdFx0c3ViR2VvbS51cGRhdGVQb3NpdGlvbnModmVydHMpO1xuXHRcdFx0XHRcdFx0c3ViR2VvbS51cGRhdGVVVnModXZzW3N1Yk1lc2hQYXJzZWRdKTtcblx0XHRcdFx0XHRcdHN1Ykdlb20udXBkYXRlVmVydGV4Tm9ybWFscyhudWxsKTtcblx0XHRcdFx0XHRcdHN1Ykdlb20udXBkYXRlVmVydGV4VGFuZ2VudHMobnVsbCk7XG5cdFx0XHRcdFx0XHRzdWJHZW9tLmF1dG9EZXJpdmVOb3JtYWxzID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRzdWJHZW9tLmF1dG9EZXJpdmVUYW5nZW50cyA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0c3ViTWVzaFBhcnNlZCsrO1xuXHRcdFx0XHRcdFx0Z2VvbWV0cnkuYWRkU3ViR2VvbWV0cnkoc3ViR2VvbSlcblx0XHRcdFx0XHR9IGVsc2Vcblx0XHRcdFx0XHRcdHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gPSBzdHJfZW5kO1xuXHRcdFx0XHRcdHN0cmVhbXNQYXJzZWQrKztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Y2xpcC5hZGRGcmFtZShnZW9tZXRyeSwgZnJhbWVfZHVyKTtcblx0XHRcdGZyYW1lc19wYXJzZWQrKztcblx0XHR9XG5cdFx0dGhpcy5wYXJzZVVzZXJBdHRyaWJ1dGVzKCk7XG5cdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQoY2xpcCwgbmFtZSk7XG5cblx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IGNsaXA7XG5cdFx0aWYgKHRoaXMuX2RlYnVnKVxuXHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBWZXJ0ZXhDbGlwTm9kZTogTmFtZSA9IFwiICsgY2xpcC5uYW1lICsgXCIgfCBUYXJnZXQtR2VvbWV0cnktTmFtZSA9IFwiICsgKDxHZW9tZXRyeT4gcmV0dXJuZWRBcnJheVsxXSkubmFtZSArIFwiIHwgTnVtYmVyIG9mIEZyYW1lcyA9IFwiICsgY2xpcC5mcmFtZXMubGVuZ3RoKTtcblx0fVxuXG5cdC8vQmxvY2tJRCAxMTNcblx0cHJpdmF0ZSBwYXJzZVZlcnRleEFuaW1hdGlvblNldChibG9ja0lEOm51bWJlciAvKnVpbnQqLyk6dm9pZFxuXHR7XG5cdFx0dmFyIHBvc2VCbG9ja0FkcmVzczpudW1iZXIgLyppbnQqL1xuXHRcdHZhciBvdXRwdXRTdHJpbmc6c3RyaW5nID0gXCJcIjtcblx0XHR2YXIgbmFtZTpzdHJpbmcgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0dmFyIG51bV9mcmFtZXM6bnVtYmVyIC8qdWludCovID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdHZhciBwcm9wczpBV0RQcm9wZXJ0aWVzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoezE6QVdEUGFyc2VyLlVJTlQxNn0pO1xuXHRcdHZhciBmcmFtZXNfcGFyc2VkOm51bWJlciAvKnVpbnQqLyA9IDA7XG5cdFx0dmFyIHNrZWxldG9uRnJhbWVzOkFycmF5PFNrZWxldG9uQ2xpcE5vZGU+ID0gbmV3IEFycmF5PFNrZWxldG9uQ2xpcE5vZGU+KCk7XG5cdFx0dmFyIHZlcnRleEZyYW1lczpBcnJheTxWZXJ0ZXhDbGlwTm9kZT4gPSBuZXcgQXJyYXk8VmVydGV4Q2xpcE5vZGU+KCk7XG5cdFx0d2hpbGUgKGZyYW1lc19wYXJzZWQgPCBudW1fZnJhbWVzKSB7XG5cdFx0XHRwb3NlQmxvY2tBZHJlc3MgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdFx0dmFyIHJldHVybmVkQXJyYXk6QXJyYXk8YW55PiA9IHRoaXMuZ2V0QXNzZXRCeUlEKHBvc2VCbG9ja0FkcmVzcywgW0Fzc2V0VHlwZS5BTklNQVRJT05fTk9ERV0pO1xuXHRcdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKVxuXHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgQW5pbWF0aW9uQ2xpcE5vZGUgTnIgXCIgKyBmcmFtZXNfcGFyc2VkICsgXCIgKCBcIiArIHBvc2VCbG9ja0FkcmVzcyArIFwiICkgZm9yIHRoaXMgQW5pbWF0aW9uU2V0XCIpO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmIChyZXR1cm5lZEFycmF5WzFdIGluc3RhbmNlb2YgVmVydGV4Q2xpcE5vZGUpXG5cdFx0XHRcdHZlcnRleEZyYW1lcy5wdXNoKHJldHVybmVkQXJyYXlbMV0pXG5cdFx0XHRcdGlmIChyZXR1cm5lZEFycmF5WzFdIGluc3RhbmNlb2YgU2tlbGV0b25DbGlwTm9kZSlcblx0XHRcdFx0c2tlbGV0b25GcmFtZXMucHVzaChyZXR1cm5lZEFycmF5WzFdKVxuXHRcdFx0fVxuXHRcdFx0ZnJhbWVzX3BhcnNlZCsrO1xuXHRcdH1cblx0XHRpZiAoKHZlcnRleEZyYW1lcy5sZW5ndGggPT0gMCkgJiYgKHNrZWxldG9uRnJhbWVzLmxlbmd0aCA9PSAwKSkge1xuXHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGNyZWF0ZSB0aGlzIEFuaW1hdGlvblNldCwgYmVjYXVzZSBpdCBjb250YWlucyBubyBhbmltYXRpb25zXCIpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHRpZiAodmVydGV4RnJhbWVzLmxlbmd0aCA+IDApIHtcblx0XHRcdHZhciBuZXdWZXJ0ZXhBbmltYXRpb25TZXQ6VmVydGV4QW5pbWF0aW9uU2V0ID0gbmV3IFZlcnRleEFuaW1hdGlvblNldCgpO1xuXHRcdFx0Zm9yICh2YXIgaTpudW1iZXIgLyppbnQqLyA9IDA7IGkgPCB2ZXJ0ZXhGcmFtZXMubGVuZ3RoOyBpKyspXG5cdFx0XHRcdG5ld1ZlcnRleEFuaW1hdGlvblNldC5hZGRBbmltYXRpb24odmVydGV4RnJhbWVzW2ldKTtcblx0XHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KG5ld1ZlcnRleEFuaW1hdGlvblNldCwgbmFtZSk7XG5cdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IG5ld1ZlcnRleEFuaW1hdGlvblNldDtcblx0XHRcdGlmICh0aGlzLl9kZWJ1Zylcblx0XHRcdFx0Y29uc29sZS5sb2coXCJQYXJzZWQgYSBWZXJ0ZXhBbmltYXRpb25TZXQ6IE5hbWUgPSBcIiArIG5hbWUgKyBcIiB8IEFuaW1hdGlvbnMgPSBcIiArIG5ld1ZlcnRleEFuaW1hdGlvblNldC5hbmltYXRpb25zLmxlbmd0aCArIFwiIHwgQW5pbWF0aW9uLU5hbWVzID0gXCIgKyBuZXdWZXJ0ZXhBbmltYXRpb25TZXQuYW5pbWF0aW9uTmFtZXMudG9TdHJpbmcoKSk7XG5cblx0XHR9IGVsc2UgaWYgKHNrZWxldG9uRnJhbWVzLmxlbmd0aCA+IDApIHtcblx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRChwb3NlQmxvY2tBZHJlc3MsIFtBc3NldFR5cGUuQU5JTUFUSU9OX05PREVdKTtcblx0XHRcdHZhciBuZXdTa2VsZXRvbkFuaW1hdGlvblNldDpTa2VsZXRvbkFuaW1hdGlvblNldCA9IG5ldyBTa2VsZXRvbkFuaW1hdGlvblNldChwcm9wcy5nZXQoMSwgNCkpOyAvL3Byb3BzLmdldCgxLDQpKTtcblx0XHRcdGZvciAodmFyIGk6bnVtYmVyIC8qaW50Ki8gPSAwOyBpIDwgc2tlbGV0b25GcmFtZXMubGVuZ3RoOyBpKyspXG5cdFx0XHRcdG5ld1NrZWxldG9uQW5pbWF0aW9uU2V0LmFkZEFuaW1hdGlvbihza2VsZXRvbkZyYW1lc1tpXSk7XG5cdFx0XHR0aGlzLl9wRmluYWxpemVBc3NldChuZXdTa2VsZXRvbkFuaW1hdGlvblNldCwgbmFtZSk7XG5cdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uZGF0YSA9IG5ld1NrZWxldG9uQW5pbWF0aW9uU2V0O1xuXHRcdFx0aWYgKHRoaXMuX2RlYnVnKVxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIFNrZWxldG9uQW5pbWF0aW9uU2V0OiBOYW1lID0gXCIgKyBuYW1lICsgXCIgfCBBbmltYXRpb25zID0gXCIgKyBuZXdTa2VsZXRvbkFuaW1hdGlvblNldC5hbmltYXRpb25zLmxlbmd0aCArIFwiIHwgQW5pbWF0aW9uLU5hbWVzID0gXCIgKyBuZXdTa2VsZXRvbkFuaW1hdGlvblNldC5hbmltYXRpb25OYW1lcy50b1N0cmluZygpKTtcblxuXHRcdH1cblx0fVxuXG5cdC8vQmxvY2tJRCAxMjJcblx0cHJpdmF0ZSBwYXJzZUFuaW1hdG9yU2V0KGJsb2NrSUQ6bnVtYmVyIC8qdWludCovKTp2b2lkXG5cdHtcblx0XHR2YXIgdGFyZ2V0TWVzaDpNZXNoO1xuXHRcdHZhciBhbmltU2V0QmxvY2tBZHJlc3M6bnVtYmVyIC8qaW50Ki9cblx0XHR2YXIgdGFyZ2V0QW5pbWF0aW9uU2V0OkFuaW1hdGlvblNldEJhc2U7XG5cdFx0dmFyIG91dHB1dFN0cmluZzpzdHJpbmcgPSBcIlwiO1xuXHRcdHZhciBuYW1lOnN0cmluZyA9IHRoaXMucGFyc2VWYXJTdHIoKTtcblx0XHR2YXIgdHlwZTpudW1iZXIgLyp1aW50Ki8gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cblx0XHR2YXIgcHJvcHM6QVdEUHJvcGVydGllcyA9IHRoaXMucGFyc2VQcm9wZXJ0aWVzKHsxOkFXRFBhcnNlci5CQUREUn0pO1xuXG5cdFx0YW5pbVNldEJsb2NrQWRyZXNzID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHR2YXIgdGFyZ2V0TWVzaExlbmd0aDpudW1iZXIgLyp1aW50Ki8gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0dmFyIG1lc2hBZHJlc3NlczpBcnJheTxudW1iZXI+IC8qdWludCovID0gbmV3IEFycmF5PG51bWJlcj4oKSAvKnVpbnQqLztcblx0XHRmb3IgKHZhciBpOm51bWJlciAvKmludCovID0gMDsgaSA8IHRhcmdldE1lc2hMZW5ndGg7IGkrKylcblx0XHRcdG1lc2hBZHJlc3Nlcy5wdXNoKHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCkpO1xuXG5cdFx0dmFyIGFjdGl2ZVN0YXRlOm51bWJlciAvKnVpbnQqLyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHR2YXIgYXV0b3BsYXk6Ym9vbGVhbiA9ICggdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRCeXRlKCkgPT0gMSApO1xuXHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXHRcdHRoaXMucGFyc2VVc2VyQXR0cmlidXRlcygpO1xuXG5cdFx0dmFyIHJldHVybmVkQXJyYXk6QXJyYXk8YW55Pjtcblx0XHR2YXIgdGFyZ2V0TWVzaGVzOkFycmF5PE1lc2g+ID0gbmV3IEFycmF5PE1lc2g+KCk7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgbWVzaEFkcmVzc2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQobWVzaEFkcmVzc2VzW2ldLCBbQXNzZXRUeXBlLk1FU0hdKTtcblx0XHRcdGlmIChyZXR1cm5lZEFycmF5WzBdKVxuXHRcdFx0XHR0YXJnZXRNZXNoZXMucHVzaCg8TWVzaD4gcmV0dXJuZWRBcnJheVsxXSk7XG5cdFx0fVxuXHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRChhbmltU2V0QmxvY2tBZHJlc3MsIFtBc3NldFR5cGUuQU5JTUFUSU9OX1NFVF0pO1xuXHRcdGlmICghcmV0dXJuZWRBcnJheVswXSkge1xuXHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIEFuaW1hdGlvblNldCAoIFwiICsgYW5pbVNldEJsb2NrQWRyZXNzICsgXCIgKSBmb3IgdGhpcyBBbmltYXRvclwiKTs7XG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cdFx0dGFyZ2V0QW5pbWF0aW9uU2V0ID0gPEFuaW1hdGlvblNldEJhc2U+IHJldHVybmVkQXJyYXlbMV07XG5cdFx0dmFyIHRoaXNBbmltYXRvcjpBbmltYXRvckJhc2U7XG5cdFx0aWYgKHR5cGUgPT0gMSkge1xuXG5cdFx0XHRyZXR1cm5lZEFycmF5ID0gdGhpcy5nZXRBc3NldEJ5SUQocHJvcHMuZ2V0KDEsIDApLCBbQXNzZXRUeXBlLlNLRUxFVE9OXSk7XG5cdFx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pIHtcblx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIFNrZWxldG9uICggXCIgKyBwcm9wcy5nZXQoMSwgMCkgKyBcIiApIGZvciB0aGlzIEFuaW1hdG9yXCIpO1xuXHRcdFx0XHRyZXR1cm5cblx0XHRcdH1cblx0XHRcdHRoaXNBbmltYXRvciA9IG5ldyBTa2VsZXRvbkFuaW1hdG9yKDxTa2VsZXRvbkFuaW1hdGlvblNldD4gdGFyZ2V0QW5pbWF0aW9uU2V0LCA8U2tlbGV0b24+IHJldHVybmVkQXJyYXlbMV0pO1xuXG5cdFx0fSBlbHNlIGlmICh0eXBlID09IDIpXG5cdFx0XHR0aGlzQW5pbWF0b3IgPSBuZXcgVmVydGV4QW5pbWF0b3IoPFZlcnRleEFuaW1hdGlvblNldD4gdGFyZ2V0QW5pbWF0aW9uU2V0KTtcblxuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KHRoaXNBbmltYXRvciwgbmFtZSk7XG5cdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmRhdGEgPSB0aGlzQW5pbWF0b3I7XG5cdFx0Zm9yIChpID0gMDsgaSA8IHRhcmdldE1lc2hlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKHR5cGUgPT0gMSlcblx0XHRcdFx0dGFyZ2V0TWVzaGVzW2ldLmFuaW1hdG9yID0gKDxTa2VsZXRvbkFuaW1hdG9yPiB0aGlzQW5pbWF0b3IpO1xuXHRcdFx0aWYgKHR5cGUgPT0gMilcblx0XHRcdFx0dGFyZ2V0TWVzaGVzW2ldLmFuaW1hdG9yID0gKDxWZXJ0ZXhBbmltYXRvcj4gdGhpc0FuaW1hdG9yKTtcblxuXHRcdH1cblx0XHRpZiAodGhpcy5fZGVidWcpXG5cdFx0XHRjb25zb2xlLmxvZyhcIlBhcnNlZCBhIEFuaW1hdG9yOiBOYW1lID0gXCIgKyBuYW1lKTtcblx0fVxuXHRcblx0Ly8gdGhpcyBmdW5jdGlvbnMgcmVhZHMgYW5kIGNyZWF0ZXMgYSBFZmZlY3RNZXRob2Rcblx0cHJpdmF0ZSBwYXJzZVNoYXJlZE1ldGhvZExpc3QoYmxvY2tJRDpudW1iZXIpOkVmZmVjdE1ldGhvZEJhc2Vcblx0e1xuXG5cdFx0dmFyIG1ldGhvZFR5cGU6bnVtYmVyID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdHZhciBlZmZlY3RNZXRob2RSZXR1cm46RWZmZWN0TWV0aG9kQmFzZTtcblxuXHRcdHZhciBwcm9wczpBV0RQcm9wZXJ0aWVzID0gdGhpcy5wYXJzZVByb3BlcnRpZXMoezE6QVdEUGFyc2VyLkJBRERSLCAyOkFXRFBhcnNlci5CQUREUiwgMzpBV0RQYXJzZXIuQkFERFIsIDEwMTp0aGlzLl9wcm9wc05yVHlwZSwgMTAyOnRoaXMuX3Byb3BzTnJUeXBlLCAxMDM6dGhpcy5fcHJvcHNOclR5cGUsIDEwNDp0aGlzLl9wcm9wc05yVHlwZSwgMTA1OnRoaXMuX3Byb3BzTnJUeXBlLCAxMDY6dGhpcy5fcHJvcHNOclR5cGUsIDEwNzp0aGlzLl9wcm9wc05yVHlwZSwgMjAxOkFXRFBhcnNlci5VSU5UMzIsIDIwMjpBV0RQYXJzZXIuVUlOVDMyLCAzMDE6QVdEUGFyc2VyLlVJTlQxNiwgMzAyOkFXRFBhcnNlci5VSU5UMTYsIDQwMTpBV0RQYXJzZXIuVUlOVDgsIDQwMjpBV0RQYXJzZXIuVUlOVDgsIDYwMTpBV0RQYXJzZXIuQ09MT1IsIDYwMjpBV0RQYXJzZXIuQ09MT1IsIDcwMTpBV0RQYXJzZXIuQk9PTCwgNzAyOkFXRFBhcnNlci5CT09MfSk7XG5cdFx0dmFyIHRhcmdldElEOm51bWJlcjtcblx0XHR2YXIgcmV0dXJuZWRBcnJheTpBcnJheTxhbnk+O1xuXG5cdFx0c3dpdGNoIChtZXRob2RUeXBlKSB7XG5cdFx0XHQvLyBFZmZlY3QgTWV0aG9kc1xuXHRcdFx0Y2FzZSA0MDE6IC8vQ29sb3JNYXRyaXhcblx0XHRcdFx0ZWZmZWN0TWV0aG9kUmV0dXJuID0gbmV3IEVmZmVjdENvbG9yTWF0cml4TWV0aG9kKHByb3BzLmdldCgxMDEsIG5ldyBBcnJheSgwLCAwLCAwLCAxLCAxLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAxKSkpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNDAyOiAvL0NvbG9yVHJhbnNmb3JtXG5cdFx0XHRcdGVmZmVjdE1ldGhvZFJldHVybiA9IG5ldyBFZmZlY3RDb2xvclRyYW5zZm9ybU1ldGhvZCgpO1xuXHRcdFx0XHR2YXIgb2ZmQ29sOm51bWJlciAvKnVpbnQqLyA9IHByb3BzLmdldCg2MDEsIDB4MDAwMDAwMDApO1xuXHRcdFx0XHQoPEVmZmVjdENvbG9yVHJhbnNmb3JtTWV0aG9kPiBlZmZlY3RNZXRob2RSZXR1cm4pLmNvbG9yVHJhbnNmb3JtID0gbmV3IENvbG9yVHJhbnNmb3JtKHByb3BzLmdldCgxMDIsIDEpLCBwcm9wcy5nZXQoMTAzLCAxKSwgcHJvcHMuZ2V0KDEwNCwgMSksIHByb3BzLmdldCgxMDEsIDEpLCAoKG9mZkNvbCA+PiAxNikgJiAweEZGKSwgKChvZmZDb2wgPj4gOCkgJiAweEZGKSwgKG9mZkNvbCAmIDB4RkYpLCAoKG9mZkNvbCA+PiAyNCkgJiAweEZGKSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA0MDM6IC8vRW52TWFwXG5cblx0XHRcdFx0dGFyZ2V0SUQgPSBwcm9wcy5nZXQoMSwgMCk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdFTlYgTUFQJywgdGFyZ2V0SUQpO1xuXG5cblx0XHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKHRhcmdldElELCBbIEFzc2V0VHlwZS5URVhUVVJFIF0sIFwiQ3ViZVRleHR1cmVcIik7XG5cdFx0XHRcdGlmICghcmV0dXJuZWRBcnJheVswXSlcblx0XHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgRW52TWFwIChJRCA9IFwiICsgdGFyZ2V0SUQgKyBcIiApIGZvciB0aGlzIEVudk1hcE1ldGhvZFwiKTtcblx0XHRcdFx0ZWZmZWN0TWV0aG9kUmV0dXJuID0gbmV3IEVmZmVjdEVudk1hcE1ldGhvZCg8Q3ViZVRleHR1cmVCYXNlPiByZXR1cm5lZEFycmF5WzFdLCA8bnVtYmVyPiBwcm9wcy5nZXQoMTAxLCAxKSk7XG5cdFx0XHRcdHRhcmdldElEID0gcHJvcHMuZ2V0KDIsIDApO1xuXHRcdFx0XHRpZiAodGFyZ2V0SUQgPiAwKSB7XG5cdFx0XHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKHRhcmdldElELCBbQXNzZXRUeXBlLlRFWFRVUkVdKTtcblx0XHRcdFx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pXG5cdFx0XHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgTWFzay10ZXh0dXJlIChJRCA9IFwiICsgdGFyZ2V0SUQgKyBcIiApIGZvciB0aGlzIEVudk1hcE1ldGhvZFwiKTtcblxuXHRcdFx0XHRcdC8vIFRvZG86IHRlc3QgbWFzayB3aXRoIEVudk1hcE1ldGhvZFxuXHRcdFx0XHRcdC8vKDxFbnZNYXBNZXRob2Q+IGVmZmVjdE1ldGhvZFJldHVybikubWFzayA9IDxUZXh0dXJlMkRCYXNlPiByZXR1cm5lZEFycmF5WzFdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA0MDQ6IC8vTGlnaHRNYXBNZXRob2Rcblx0XHRcdFx0dGFyZ2V0SUQgPSBwcm9wcy5nZXQoMSwgMCk7XG5cdFx0XHRcdHJldHVybmVkQXJyYXkgPSB0aGlzLmdldEFzc2V0QnlJRCh0YXJnZXRJRCwgW0Fzc2V0VHlwZS5URVhUVVJFXSk7XG5cdFx0XHRcdGlmICghcmV0dXJuZWRBcnJheVswXSlcblx0XHRcdFx0XHR0aGlzLl9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgTGlnaHRNYXAgKElEID0gXCIgKyB0YXJnZXRJRCArIFwiICkgZm9yIHRoaXMgTGlnaHRNYXBNZXRob2RcIik7XG5cdFx0XHRcdGVmZmVjdE1ldGhvZFJldHVybiA9IG5ldyBFZmZlY3RMaWdodE1hcE1ldGhvZChyZXR1cm5lZEFycmF5WzFdLCB0aGlzLmJsZW5kTW9kZURpY1twcm9wcy5nZXQoNDAxLCAxMCldKTsgLy91c2VzZWNvbmRhcnlVViBub3Qgc2V0XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Ly9cdFx0XHRcdGNhc2UgNDA1OiAvL1Byb2plY3RpdmVUZXh0dXJlTWV0aG9kXG5cdFx0XHQvL1x0XHRcdFx0XHR0YXJnZXRJRCA9IHByb3BzLmdldCgxLCAwKTtcblx0XHRcdC8vXHRcdFx0XHRcdHJldHVybmVkQXJyYXkgPSBnZXRBc3NldEJ5SUQodGFyZ2V0SUQsIFtBc3NldFR5cGUuVEVYVFVSRV9QUk9KRUNUT1JdKTtcblx0XHRcdC8vXHRcdFx0XHRcdGlmICghcmV0dXJuZWRBcnJheVswXSlcblx0XHRcdC8vXHRcdFx0XHRcdFx0X2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBUZXh0dXJlUHJvamVjdG9yIChJRCA9IFwiICsgdGFyZ2V0SUQgKyBcIiApIGZvciB0aGlzIFByb2plY3RpdmVUZXh0dXJlTWV0aG9kXCIpO1xuXHRcdFx0Ly9cdFx0XHRcdFx0ZWZmZWN0TWV0aG9kUmV0dXJuID0gbmV3IFByb2plY3RpdmVUZXh0dXJlTWV0aG9kKHJldHVybmVkQXJyYXlbMV0sIGJsZW5kTW9kZURpY1twcm9wcy5nZXQoNDAxLCAxMCldKTtcblx0XHRcdC8vXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA0MDY6IC8vUmltTGlnaHRNZXRob2Rcblx0XHRcdFx0ZWZmZWN0TWV0aG9kUmV0dXJuID0gbmV3IEVmZmVjdFJpbUxpZ2h0TWV0aG9kKHByb3BzLmdldCg2MDEsIDB4ZmZmZmZmKSwgcHJvcHMuZ2V0KDEwMSwgMC40KSwgcHJvcHMuZ2V0KDEwMSwgMikpOyAvL2JsZW5kTW9kZVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNDA3OiAvL0FscGhhTWFza01ldGhvZFxuXHRcdFx0XHR0YXJnZXRJRCA9IHByb3BzLmdldCgxLCAwKTtcblx0XHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKHRhcmdldElELCBbQXNzZXRUeXBlLlRFWFRVUkVdKTtcblx0XHRcdFx0aWYgKCFyZXR1cm5lZEFycmF5WzBdKVxuXHRcdFx0XHRcdHRoaXMuX2Jsb2Nrc1tibG9ja0lEXS5hZGRFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoZSBBbHBoYS10ZXh0dXJlIChJRCA9IFwiICsgdGFyZ2V0SUQgKyBcIiApIGZvciB0aGlzIEFscGhhTWFza01ldGhvZFwiKTtcblx0XHRcdFx0ZWZmZWN0TWV0aG9kUmV0dXJuID0gbmV3IEVmZmVjdEFscGhhTWFza01ldGhvZChyZXR1cm5lZEFycmF5WzFdLCBwcm9wcy5nZXQoNzAxLCBmYWxzZSkpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdC8vXHRcdFx0XHRjYXNlIDQwODogLy9SZWZyYWN0aW9uRW52TWFwTWV0aG9kXG5cdFx0XHQvL1x0XHRcdFx0XHR0YXJnZXRJRCA9IHByb3BzLmdldCgxLCAwKTtcblx0XHRcdC8vXHRcdFx0XHRcdHJldHVybmVkQXJyYXkgPSBnZXRBc3NldEJ5SUQodGFyZ2V0SUQsIFtBc3NldFR5cGUuVEVYVFVSRV0sIFwiQ3ViZVRleHR1cmVcIik7XG5cdFx0XHQvL1x0XHRcdFx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pXG5cdFx0XHQvL1x0XHRcdFx0XHRcdF9ibG9ja3NbYmxvY2tJRF0uYWRkRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGUgRW52TWFwIChJRCA9IFwiICsgdGFyZ2V0SUQgKyBcIiApIGZvciB0aGlzIFJlZnJhY3Rpb25FbnZNYXBNZXRob2RcIik7XG5cdFx0XHQvL1x0XHRcdFx0XHRlZmZlY3RNZXRob2RSZXR1cm4gPSBuZXcgUmVmcmFjdGlvbkVudk1hcE1ldGhvZChyZXR1cm5lZEFycmF5WzFdLCBwcm9wcy5nZXQoMTAxLCAwLjEpLCBwcm9wcy5nZXQoMTAyLCAwLjAxKSwgcHJvcHMuZ2V0KDEwMywgMC4wMSksIHByb3BzLmdldCgxMDQsIDAuMDEpKTtcblx0XHRcdC8vXHRcdFx0XHRcdFJlZnJhY3Rpb25FbnZNYXBNZXRob2QoZWZmZWN0TWV0aG9kUmV0dXJuKS5hbHBoYSA9IHByb3BzLmdldCgxMDQsIDEpO1xuXHRcdFx0Ly9cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHQvL1x0XHRcdFx0Y2FzZSA0MDk6IC8vT3V0bGluZU1ldGhvZFxuXHRcdFx0Ly9cdFx0XHRcdFx0ZWZmZWN0TWV0aG9kUmV0dXJuID0gbmV3IE91dGxpbmVNZXRob2QocHJvcHMuZ2V0KDYwMSwgMHgwMDAwMDAwMCksIHByb3BzLmdldCgxMDEsIDEpLCBwcm9wcy5nZXQoNzAxLCB0cnVlKSwgcHJvcHMuZ2V0KDcwMiwgZmFsc2UpKTtcblx0XHRcdC8vXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA0MTA6IC8vRnJlc25lbEVudk1hcE1ldGhvZFxuXHRcdFx0XHR0YXJnZXRJRCA9IHByb3BzLmdldCgxLCAwKTtcblx0XHRcdFx0cmV0dXJuZWRBcnJheSA9IHRoaXMuZ2V0QXNzZXRCeUlEKHRhcmdldElELCBbQXNzZXRUeXBlLlRFWFRVUkVdLCBcIkN1YmVUZXh0dXJlXCIpO1xuXHRcdFx0XHRpZiAoIXJldHVybmVkQXJyYXlbMF0pXG5cdFx0XHRcdFx0dGhpcy5fYmxvY2tzW2Jsb2NrSURdLmFkZEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhlIEVudk1hcCAoSUQgPSBcIiArIHRhcmdldElEICsgXCIgKSBmb3IgdGhpcyBGcmVzbmVsRW52TWFwTWV0aG9kXCIpO1xuXHRcdFx0XHRlZmZlY3RNZXRob2RSZXR1cm4gPSBuZXcgRWZmZWN0RnJlc25lbEVudk1hcE1ldGhvZChyZXR1cm5lZEFycmF5WzFdLCBwcm9wcy5nZXQoMTAxLCAxKSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA0MTE6IC8vRm9nTWV0aG9kXG5cdFx0XHRcdGVmZmVjdE1ldGhvZFJldHVybiA9IG5ldyBFZmZlY3RGb2dNZXRob2QocHJvcHMuZ2V0KDEwMSwgMCksIHByb3BzLmdldCgxMDIsIDEwMDApLCBwcm9wcy5nZXQoNjAxLCAweDgwODA4MCkpO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdH1cblx0XHR0aGlzLnBhcnNlVXNlckF0dHJpYnV0ZXMoKTtcblx0XHRyZXR1cm4gZWZmZWN0TWV0aG9kUmV0dXJuO1xuXG5cdH1cblxuXHRwcml2YXRlIHBhcnNlVXNlckF0dHJpYnV0ZXMoKTpPYmplY3Rcblx0e1xuXHRcdHZhciBhdHRyaWJ1dGVzOk9iamVjdDtcblx0XHR2YXIgbGlzdF9sZW46bnVtYmVyO1xuXHRcdHZhciBhdHRpYnV0ZUNudDpudW1iZXI7XG5cblx0XHRsaXN0X2xlbiA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cblx0XHRpZiAobGlzdF9sZW4gPiAwKSB7XG5cblx0XHRcdHZhciBsaXN0X2VuZDpudW1iZXI7XG5cblx0XHRcdGF0dHJpYnV0ZXMgPSB7fTtcblxuXHRcdFx0bGlzdF9lbmQgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uICsgbGlzdF9sZW47XG5cblx0XHRcdHdoaWxlICh0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uIDwgbGlzdF9lbmQpIHtcblx0XHRcdFx0dmFyIG5zX2lkOm51bWJlcjtcblx0XHRcdFx0dmFyIGF0dHJfa2V5OnN0cmluZztcblx0XHRcdFx0dmFyIGF0dHJfdHlwZTpudW1iZXI7XG5cdFx0XHRcdHZhciBhdHRyX2xlbjpudW1iZXI7XG5cdFx0XHRcdHZhciBhdHRyX3ZhbDphbnk7XG5cblx0XHRcdFx0Ly8gVE9ETzogUHJvcGVybHkgdGVuZCB0byBuYW1lc3BhY2VzIGluIGF0dHJpYnV0ZXNcblx0XHRcdFx0bnNfaWQgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHRcdFx0YXR0cl9rZXkgPSB0aGlzLnBhcnNlVmFyU3RyKCk7XG5cdFx0XHRcdGF0dHJfdHlwZSA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdFx0XHRhdHRyX2xlbiA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVuc2lnbmVkSW50KCk7XG5cblx0XHRcdFx0aWYgKCh0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uICsgYXR0cl9sZW4pID4gbGlzdF9lbmQpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIiAgICAgICAgICAgRXJyb3IgaW4gcmVhZGluZyBhdHRyaWJ1dGUgIyBcIiArIGF0dGlidXRlQ250ICsgXCIgPSBza2lwcGVkIHRvIGVuZCBvZiBhdHRyaWJ1dGUtbGlzdFwiKTtcblx0XHRcdFx0XHR0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uID0gbGlzdF9lbmQ7XG5cdFx0XHRcdFx0cmV0dXJuIGF0dHJpYnV0ZXM7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRzd2l0Y2ggKGF0dHJfdHlwZSkge1xuXHRcdFx0XHRcdGNhc2UgQVdEUGFyc2VyLkFXRFNUUklORzpcblx0XHRcdFx0XHRcdGF0dHJfdmFsID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVVRGQnl0ZXMoYXR0cl9sZW4pO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuSU5UODpcblx0XHRcdFx0XHRcdGF0dHJfdmFsID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkQnl0ZSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuSU5UMTY6XG5cdFx0XHRcdFx0XHRhdHRyX3ZhbCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFNob3J0KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIEFXRFBhcnNlci5JTlQzMjpcblx0XHRcdFx0XHRcdGF0dHJfdmFsID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkSW50KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIEFXRFBhcnNlci5CT09MOlxuXHRcdFx0XHRcdGNhc2UgQVdEUGFyc2VyLlVJTlQ4OlxuXHRcdFx0XHRcdFx0YXR0cl92YWwgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgQVdEUGFyc2VyLlVJTlQxNjpcblx0XHRcdFx0XHRcdGF0dHJfdmFsID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuVUlOVDMyOlxuXHRcdFx0XHRcdGNhc2UgQVdEUGFyc2VyLkJBRERSOlxuXHRcdFx0XHRcdFx0YXR0cl92YWwgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBBV0RQYXJzZXIuRkxPQVQzMjpcblx0XHRcdFx0XHRcdGF0dHJfdmFsID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkRmxvYXQoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgQVdEUGFyc2VyLkZMT0FUNjQ6XG5cdFx0XHRcdFx0XHRhdHRyX3ZhbCA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZERvdWJsZSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdGF0dHJfdmFsID0gJ3VuaW1wbGVtZW50ZWQgYXR0cmlidXRlIHR5cGUgJyArIGF0dHJfdHlwZTtcblx0XHRcdFx0XHRcdHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gKz0gYXR0cl9sZW47XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiYXR0cmlidXRlID0gbmFtZTogXCIgKyBhdHRyX2tleSArIFwiICAvIHZhbHVlID0gXCIgKyBhdHRyX3ZhbCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhdHRyaWJ1dGVzW2F0dHJfa2V5XSA9IGF0dHJfdmFsO1xuXHRcdFx0XHRhdHRpYnV0ZUNudCArPSAxO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBhdHRyaWJ1dGVzO1xuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZVByb3BlcnRpZXMoZXhwZWN0ZWQ6T2JqZWN0KTpBV0RQcm9wZXJ0aWVzXG5cdHtcblx0XHR2YXIgbGlzdF9lbmQ6bnVtYmVyO1xuXHRcdHZhciBsaXN0X2xlbjpudW1iZXI7XG5cdFx0dmFyIHByb3BlcnR5Q250Om51bWJlciA9IDA7XG5cdFx0dmFyIHByb3BzOkFXRFByb3BlcnRpZXMgPSBuZXcgQVdEUHJvcGVydGllcygpO1xuXG5cdFx0bGlzdF9sZW4gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdGxpc3RfZW5kID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiArIGxpc3RfbGVuO1xuXG5cdFx0aWYgKGV4cGVjdGVkKSB7XG5cblx0XHRcdHdoaWxlICh0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uIDwgbGlzdF9lbmQpIHtcblx0XHRcdFx0dmFyIGxlbjpudW1iZXI7XG5cdFx0XHRcdHZhciBrZXk6bnVtYmVyO1xuXHRcdFx0XHR2YXIgdHlwZTpudW1iZXI7XG5cblx0XHRcdFx0a2V5ID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdFx0XHRsZW4gPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEludCgpO1xuXG5cdFx0XHRcdGlmICgodGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiArIGxlbikgPiBsaXN0X2VuZCkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiICAgICAgICAgICBFcnJvciBpbiByZWFkaW5nIHByb3BlcnR5ICMgXCIgKyBwcm9wZXJ0eUNudCArIFwiID0gc2tpcHBlZCB0byBlbmQgb2YgcHJvcGVydGllLWxpc3RcIik7XG5cdFx0XHRcdFx0dGhpcy5fbmV3QmxvY2tCeXRlcy5wb3NpdGlvbiA9IGxpc3RfZW5kO1xuXHRcdFx0XHRcdHJldHVybiBwcm9wcztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChleHBlY3RlZC5oYXNPd25Qcm9wZXJ0eShrZXkudG9TdHJpbmcoKSkpIHtcblx0XHRcdFx0XHR0eXBlID0gZXhwZWN0ZWRba2V5XTtcblx0XHRcdFx0XHRwcm9wcy5zZXQoa2V5LCB0aGlzLnBhcnNlQXR0clZhbHVlKHR5cGUsIGxlbikpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX25ld0Jsb2NrQnl0ZXMucG9zaXRpb24gKz0gbGVuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cHJvcGVydHlDbnQgKz0gMTtcblxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9uZXdCbG9ja0J5dGVzLnBvc2l0aW9uID0gbGlzdF9lbmQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHByb3BzO1xuXG5cdH1cblxuXHRwcml2YXRlIHBhcnNlQXR0clZhbHVlKHR5cGU6bnVtYmVyLCBsZW46bnVtYmVyKTphbnlcblx0e1xuXHRcdHZhciBlbGVtX2xlbjpudW1iZXI7XG5cdFx0dmFyIHJlYWRfZnVuYzpGdW5jdGlvbjtcblxuXHRcdHN3aXRjaCAodHlwZSkge1xuXG5cdFx0XHRjYXNlIEFXRFBhcnNlci5CT09MOlxuXHRcdFx0Y2FzZSBBV0RQYXJzZXIuSU5UODpcblx0XHRcdFx0ZWxlbV9sZW4gPSAxO1xuXHRcdFx0XHRyZWFkX2Z1bmMgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRCeXRlO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBBV0RQYXJzZXIuSU5UMTY6XG5cdFx0XHRcdGVsZW1fbGVuID0gMjtcblx0XHRcdFx0cmVhZF9mdW5jID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkU2hvcnQ7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIEFXRFBhcnNlci5JTlQzMjpcblx0XHRcdFx0ZWxlbV9sZW4gPSA0O1xuXHRcdFx0XHRyZWFkX2Z1bmMgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRJbnQ7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIEFXRFBhcnNlci5VSU5UODpcblx0XHRcdFx0ZWxlbV9sZW4gPSAxO1xuXHRcdFx0XHRyZWFkX2Z1bmMgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZEJ5dGU7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIEFXRFBhcnNlci5VSU5UMTY6XG5cdFx0XHRcdGVsZW1fbGVuID0gMjtcblx0XHRcdFx0cmVhZF9mdW5jID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRTaG9ydDtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgQVdEUGFyc2VyLlVJTlQzMjpcblx0XHRcdGNhc2UgQVdEUGFyc2VyLkNPTE9SOlxuXHRcdFx0Y2FzZSBBV0RQYXJzZXIuQkFERFI6XG5cdFx0XHRcdGVsZW1fbGVuID0gNDtcblx0XHRcdFx0cmVhZF9mdW5jID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkVW5zaWduZWRJbnQ7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIEFXRFBhcnNlci5GTE9BVDMyOlxuXHRcdFx0XHRlbGVtX2xlbiA9IDQ7XG5cdFx0XHRcdHJlYWRfZnVuYyA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZEZsb2F0O1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBBV0RQYXJzZXIuRkxPQVQ2NDpcblx0XHRcdFx0ZWxlbV9sZW4gPSA4O1xuXHRcdFx0XHRyZWFkX2Z1bmMgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWREb3VibGU7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIEFXRFBhcnNlci5BV0RTVFJJTkc6XG5cdFx0XHRcdHJldHVybiB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVVEZCeXRlcyhsZW4pO1xuXG5cdFx0XHRjYXNlIEFXRFBhcnNlci5WRUNUT1IyeDE6XG5cdFx0XHRjYXNlIEFXRFBhcnNlci5WRUNUT1IzeDE6XG5cdFx0XHRjYXNlIEFXRFBhcnNlci5WRUNUT1I0eDE6XG5cdFx0XHRjYXNlIEFXRFBhcnNlci5NVFgzeDI6XG5cdFx0XHRjYXNlIEFXRFBhcnNlci5NVFgzeDM6XG5cdFx0XHRjYXNlIEFXRFBhcnNlci5NVFg0eDM6XG5cdFx0XHRjYXNlIEFXRFBhcnNlci5NVFg0eDQ6XG5cdFx0XHRcdGVsZW1fbGVuID0gODtcblx0XHRcdFx0cmVhZF9mdW5jID0gdGhpcy5fbmV3QmxvY2tCeXRlcy5yZWFkRG91YmxlO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdH1cblxuXHRcdGlmIChlbGVtX2xlbiA8IGxlbikge1xuXHRcdFx0dmFyIGxpc3Q6QXJyYXk8YW55PiA9IFtdO1xuXHRcdFx0dmFyIG51bV9yZWFkOm51bWJlciA9IDA7XG5cdFx0XHR2YXIgbnVtX2VsZW1zOm51bWJlciA9IGxlbi9lbGVtX2xlbjtcblxuXHRcdFx0d2hpbGUgKG51bV9yZWFkIDwgbnVtX2VsZW1zKSB7XG5cdFx0XHRcdGxpc3QucHVzaChyZWFkX2Z1bmMuYXBwbHkodGhpcy5fbmV3QmxvY2tCeXRlcykpOyAvLyBsaXN0LnB1c2gocmVhZF9mdW5jKCkpO1xuXHRcdFx0XHRudW1fcmVhZCsrO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbGlzdDtcblx0XHR9IGVsc2Uge1xuXG5cdFx0XHR2YXIgdmFsOmFueSA9IHJlYWRfZnVuYy5hcHBseSh0aGlzLl9uZXdCbG9ja0J5dGVzKTsvL3JlYWRfZnVuYygpO1xuXHRcdFx0cmV0dXJuIHZhbDtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHBhcnNlSGVhZGVyKCk6dm9pZFxuXHR7XG5cdFx0dmFyIGZsYWdzOm51bWJlcjtcblx0XHR2YXIgYm9keV9sZW46bnVtYmVyO1xuXG5cdFx0dGhpcy5fYnl0ZURhdGEucG9zaXRpb24gPSAzOyAvLyBTa2lwIG1hZ2ljIHN0cmluZyBhbmQgcGFyc2UgdmVyc2lvblxuXG5cdFx0dGhpcy5fdmVyc2lvblswXSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHR0aGlzLl92ZXJzaW9uWzFdID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXG5cdFx0ZmxhZ3MgPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRTaG9ydCgpOyAvLyBQYXJzZSBiaXQgZmxhZ3NcblxuXHRcdHRoaXMuX3N0cmVhbWluZyA9IEJpdEZsYWdzLnRlc3QoZmxhZ3MsIEJpdEZsYWdzLkZMQUcxKTtcblxuXHRcdGlmICgodGhpcy5fdmVyc2lvblswXSA9PSAyKSAmJiAodGhpcy5fdmVyc2lvblsxXSA9PSAxKSkge1xuXHRcdFx0dGhpcy5fYWNjdXJhY3lNYXRyaXggPSBCaXRGbGFncy50ZXN0KGZsYWdzLCBCaXRGbGFncy5GTEFHMik7XG5cdFx0XHR0aGlzLl9hY2N1cmFjeUdlbyA9IEJpdEZsYWdzLnRlc3QoZmxhZ3MsIEJpdEZsYWdzLkZMQUczKTtcblx0XHRcdHRoaXMuX2FjY3VyYWN5UHJvcHMgPSBCaXRGbGFncy50ZXN0KGZsYWdzLCBCaXRGbGFncy5GTEFHNCk7XG5cdFx0fVxuXG5cdFx0Ly8gaWYgd2Ugc2V0IF9hY2N1cmFjeU9uQmxvY2tzLCB0aGUgcHJlY2lzaW9uLXZhbHVlcyBhcmUgcmVhZCBmcm9tIGVhY2ggYmxvY2staGVhZGVyLlxuXG5cdFx0Ly8gc2V0IHN0b3JhZ2VQcmVjaXNpb24gdHlwZXNcblx0XHR0aGlzLl9nZW9OclR5cGUgPSBBV0RQYXJzZXIuRkxPQVQzMjtcblxuXHRcdGlmICh0aGlzLl9hY2N1cmFjeUdlbykge1xuXHRcdFx0dGhpcy5fZ2VvTnJUeXBlID0gQVdEUGFyc2VyLkZMT0FUNjQ7XG5cdFx0fVxuXG5cdFx0dGhpcy5fbWF0cml4TnJUeXBlID0gQVdEUGFyc2VyLkZMT0FUMzI7XG5cblx0XHRpZiAodGhpcy5fYWNjdXJhY3lNYXRyaXgpIHtcblx0XHRcdHRoaXMuX21hdHJpeE5yVHlwZSA9IEFXRFBhcnNlci5GTE9BVDY0O1xuXHRcdH1cblxuXHRcdHRoaXMuX3Byb3BzTnJUeXBlID0gQVdEUGFyc2VyLkZMT0FUMzI7XG5cblx0XHRpZiAodGhpcy5fYWNjdXJhY3lQcm9wcykge1xuXHRcdFx0dGhpcy5fcHJvcHNOclR5cGUgPSBBV0RQYXJzZXIuRkxPQVQ2NDtcblx0XHR9XG5cblx0XHR0aGlzLl9jb21wcmVzc2lvbiA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZEJ5dGUoKTsgLy8gY29tcHJlc3Npb25cblxuXHRcdGlmICh0aGlzLl9kZWJ1Zykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJJbXBvcnQgQVdERmlsZSBvZiB2ZXJzaW9uID0gXCIgKyB0aGlzLl92ZXJzaW9uWzBdICsgXCIgLSBcIiArIHRoaXMuX3ZlcnNpb25bMV0pO1xuXHRcdFx0Y29uc29sZS5sb2coXCJHbG9iYWwgU2V0dGluZ3MgPSBDb21wcmVzc2lvbiA9IFwiICsgdGhpcy5fY29tcHJlc3Npb24gKyBcIiB8IFN0cmVhbWluZyA9IFwiICsgdGhpcy5fc3RyZWFtaW5nICsgXCIgfCBNYXRyaXgtUHJlY2lzaW9uID0gXCIgKyB0aGlzLl9hY2N1cmFjeU1hdHJpeCArIFwiIHwgR2VvbWV0cnktUHJlY2lzaW9uID0gXCIgKyB0aGlzLl9hY2N1cmFjeUdlbyArIFwiIHwgUHJvcGVydGllcy1QcmVjaXNpb24gPSBcIiArIHRoaXMuX2FjY3VyYWN5UHJvcHMpO1xuXHRcdH1cblxuXHRcdC8vIENoZWNrIGZpbGUgaW50ZWdyaXR5XG5cdFx0Ym9keV9sZW4gPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRpZiAoIXRoaXMuX3N0cmVhbWluZyAmJiBib2R5X2xlbiAhPSB0aGlzLl9ieXRlRGF0YS5nZXRCeXRlc0F2YWlsYWJsZSgpKSB7XG5cdFx0XHR0aGlzLl9wRGllV2l0aEVycm9yKCdBV0QyIGJvZHkgbGVuZ3RoIGRvZXMgbm90IG1hdGNoIGhlYWRlciBpbnRlZ3JpdHkgZmllbGQnKTtcblx0XHR9XG5cblx0fVxuXHQvLyBIZWxwZXIgLSBmdW5jdGlvbnNcblx0cHJpdmF0ZSBnZXRVVkZvclZlcnRleEFuaW1hdGlvbihtZXNoSUQ6bnVtYmVyIC8qdWludCovKTpBcnJheTxBcnJheTxudW1iZXI+PlxuXHR7XG5cdFx0aWYgKHRoaXMuX2Jsb2Nrc1ttZXNoSURdLmRhdGEgaW5zdGFuY2VvZiBNZXNoKVxuXHRcdG1lc2hJRCA9IHRoaXMuX2Jsb2Nrc1ttZXNoSURdLmdlb0lEO1xuXHRcdGlmICh0aGlzLl9ibG9ja3NbbWVzaElEXS51dnNGb3JWZXJ0ZXhBbmltYXRpb24pXG5cdFx0XHRyZXR1cm4gdGhpcy5fYmxvY2tzW21lc2hJRF0udXZzRm9yVmVydGV4QW5pbWF0aW9uO1xuXHRcdHZhciBnZW9tZXRyeTpHZW9tZXRyeSA9ICg8R2VvbWV0cnk+IHRoaXMuX2Jsb2Nrc1ttZXNoSURdLmRhdGEpO1xuXHRcdHZhciBnZW9DbnQ6bnVtYmVyIC8qaW50Ki8gPSAwO1xuXHRcdHZhciB1ZDpBcnJheTxudW1iZXI+O1xuXHRcdHZhciB1U3RyaWRlOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgdU9mZnM6bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciBudW1Qb2ludHM6bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciBpOm51bWJlciAvKmludCovO1xuXHRcdHZhciBuZXdVdnM6QXJyYXk8bnVtYmVyPjtcblx0XHR2YXIgc3ViX2dlb206VHJpYW5nbGVTdWJHZW9tZXRyeTtcblx0XHR0aGlzLl9ibG9ja3NbbWVzaElEXS51dnNGb3JWZXJ0ZXhBbmltYXRpb24gPSBuZXcgQXJyYXk8QXJyYXk8bnVtYmVyPj4oKTtcblx0XHR3aGlsZSAoZ2VvQ250IDwgZ2VvbWV0cnkuc3ViR2VvbWV0cmllcy5sZW5ndGgpIHtcblx0XHRcdG5ld1V2cyA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cdFx0XHRzdWJfZ2VvbSA9IDxUcmlhbmdsZVN1Ykdlb21ldHJ5PiBnZW9tZXRyeS5zdWJHZW9tZXRyaWVzW2dlb0NudF07XG5cdFx0XHRudW1Qb2ludHMgPSBzdWJfZ2VvbS5udW1WZXJ0aWNlcztcblx0XHRcdHVkID0gc3ViX2dlb20udXZzO1xuXHRcdFx0dVN0cmlkZSA9IHN1Yl9nZW9tLmdldFN0cmlkZShUcmlhbmdsZVN1Ykdlb21ldHJ5LlVWX0RBVEEpO1xuXHRcdFx0dU9mZnMgPSBzdWJfZ2VvbS5nZXRPZmZzZXQoVHJpYW5nbGVTdWJHZW9tZXRyeS5VVl9EQVRBKTtcblx0XHRcdGZvciAoaSA9IDA7IGkgPCBudW1Qb2ludHM7IGkrKykge1xuXHRcdFx0XHRuZXdVdnMucHVzaCh1ZFt1T2ZmcyArIGkqdVN0cmlkZSArIDBdKTtcblx0XHRcdFx0bmV3VXZzLnB1c2godWRbdU9mZnMgKyBpKnVTdHJpZGUgKyAxXSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9ibG9ja3NbbWVzaElEXS51dnNGb3JWZXJ0ZXhBbmltYXRpb24ucHVzaChuZXdVdnMpO1xuXHRcdFx0Z2VvQ250Kys7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9ibG9ja3NbbWVzaElEXS51dnNGb3JWZXJ0ZXhBbmltYXRpb247XG5cdH1cblx0XG5cdHByaXZhdGUgcGFyc2VWYXJTdHIoKTpzdHJpbmdcblx0e1xuXG5cdFx0dmFyIGxlbjpudW1iZXIgPSB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0cmV0dXJuIHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZFVURkJ5dGVzKGxlbik7XG5cdH1cblxuXHRwcml2YXRlIGdldEFzc2V0QnlJRChhc3NldElEOm51bWJlciwgYXNzZXRUeXBlc1RvR2V0OkFycmF5PHN0cmluZz4sIGV4dHJhVHlwZUluZm86c3RyaW5nID0gXCJTaW5nbGVUZXh0dXJlXCIpOkFycmF5PGFueT5cblx0e1xuXHRcdHZhciByZXR1cm5BcnJheTpBcnJheTxhbnk+ID0gbmV3IEFycmF5PGFueT4oKTtcblx0XHR2YXIgdHlwZUNudDpudW1iZXIgPSAwO1xuXHRcdGlmIChhc3NldElEID4gMCkge1xuXHRcdFx0aWYgKHRoaXMuX2Jsb2Nrc1thc3NldElEXSkge1xuXHRcdFx0XHRpZiAodGhpcy5fYmxvY2tzW2Fzc2V0SURdLmRhdGEpIHtcblx0XHRcdFx0XHR3aGlsZSAodHlwZUNudCA8IGFzc2V0VHlwZXNUb0dldC5sZW5ndGgpIHtcblxuXHRcdFx0XHRcdFx0dmFyIGlhc3NldDpJQXNzZXQgPSA8SUFzc2V0PiB0aGlzLl9ibG9ja3NbYXNzZXRJRF0uZGF0YTtcblxuXHRcdFx0XHRcdFx0aWYgKGlhc3NldC5hc3NldFR5cGUgPT0gYXNzZXRUeXBlc1RvR2V0W3R5cGVDbnRdKSB7XG5cdFx0XHRcdFx0XHRcdC8vaWYgdGhlIHJpZ2h0IGFzc2V0VHlwZSB3YXMgZm91bmRcblx0XHRcdFx0XHRcdFx0aWYgKChhc3NldFR5cGVzVG9HZXRbdHlwZUNudF0gPT0gQXNzZXRUeXBlLlRFWFRVUkUpICYmIChleHRyYVR5cGVJbmZvID09IFwiQ3ViZVRleHR1cmVcIikpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodGhpcy5fYmxvY2tzW2Fzc2V0SURdLmRhdGEgaW5zdGFuY2VvZiBJbWFnZUN1YmVUZXh0dXJlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm5BcnJheS5wdXNoKHRydWUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuQXJyYXkucHVzaCh0aGlzLl9ibG9ja3NbYXNzZXRJRF0uZGF0YSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcmV0dXJuQXJyYXk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmICgoYXNzZXRUeXBlc1RvR2V0W3R5cGVDbnRdID09IEFzc2V0VHlwZS5URVhUVVJFKSAmJiAoZXh0cmFUeXBlSW5mbyA9PSBcIlNpbmdsZVRleHR1cmVcIikpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAodGhpcy5fYmxvY2tzW2Fzc2V0SURdLmRhdGEgaW5zdGFuY2VvZiBJbWFnZVRleHR1cmUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybkFycmF5LnB1c2godHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm5BcnJheS5wdXNoKHRoaXMuX2Jsb2Nrc1thc3NldElEXS5kYXRhKTtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiByZXR1cm5BcnJheTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuQXJyYXkucHVzaCh0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm5BcnJheS5wdXNoKHRoaXMuX2Jsb2Nrc1thc3NldElEXS5kYXRhKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcmV0dXJuQXJyYXk7XG5cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Ly9pZiAoKGFzc2V0VHlwZXNUb0dldFt0eXBlQ250XSA9PSBBc3NldFR5cGUuR0VPTUVUUlkpICYmIChJQXNzZXQoX2Jsb2Nrc1thc3NldElEXS5kYXRhKS5hc3NldFR5cGUgPT0gQXNzZXRUeXBlLk1FU0gpKSB7XG5cdFx0XHRcdFx0XHRpZiAoKGFzc2V0VHlwZXNUb0dldFt0eXBlQ250XSA9PSBBc3NldFR5cGUuR0VPTUVUUlkpICYmIChpYXNzZXQuYXNzZXRUeXBlID09IEFzc2V0VHlwZS5NRVNIKSkge1xuXG5cdFx0XHRcdFx0XHRcdHZhciBtZXNoOk1lc2ggPSA8TWVzaD4gdGhpcy5fYmxvY2tzW2Fzc2V0SURdLmRhdGFcblxuXHRcdFx0XHRcdFx0XHRyZXR1cm5BcnJheS5wdXNoKHRydWUpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm5BcnJheS5wdXNoKG1lc2guZ2VvbWV0cnkpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcmV0dXJuQXJyYXk7XG5cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dHlwZUNudCsrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBpZiB0aGUgaGFzIG5vdCByZXR1cm5lZCBhbnl0aGluZyB5ZXQsIHRoZSBhc3NldCBpcyBub3QgZm91bmQsIG9yIHRoZSBmb3VuZCBhc3NldCBpcyBub3QgdGhlIHJpZ2h0IHR5cGUuXG5cdFx0cmV0dXJuQXJyYXkucHVzaChmYWxzZSk7XG5cdFx0cmV0dXJuQXJyYXkucHVzaCh0aGlzLmdldERlZmF1bHRBc3NldChhc3NldFR5cGVzVG9HZXRbMF0sIGV4dHJhVHlwZUluZm8pKTtcblx0XHRyZXR1cm4gcmV0dXJuQXJyYXk7XG5cdH1cblxuXHRwcml2YXRlIGdldERlZmF1bHRBc3NldChhc3NldFR5cGU6c3RyaW5nLCBleHRyYVR5cGVJbmZvOnN0cmluZyk6SUFzc2V0XG5cdHtcblx0XHRzd2l0Y2ggKHRydWUpIHtcblx0XHRcdGNhc2UgKGFzc2V0VHlwZSA9PSBBc3NldFR5cGUuVEVYVFVSRSk6XG5cdFx0XHRcdGlmIChleHRyYVR5cGVJbmZvID09IFwiQ3ViZVRleHR1cmVcIilcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5nZXREZWZhdWx0Q3ViZVRleHR1cmUoKTtcblx0XHRcdFx0aWYgKGV4dHJhVHlwZUluZm8gPT0gXCJTaW5nbGVUZXh0dXJlXCIpXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0RGVmYXVsdFRleHR1cmUoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIChhc3NldFR5cGUgPT0gQXNzZXRUeXBlLk1BVEVSSUFMKTpcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0RGVmYXVsdE1hdGVyaWFsKClcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHByaXZhdGUgZ2V0RGVmYXVsdE1hdGVyaWFsKCk6SUFzc2V0XG5cdHtcblx0XHRpZiAoIXRoaXMuX2RlZmF1bHRCaXRtYXBNYXRlcmlhbClcblx0XHRcdHRoaXMuX2RlZmF1bHRCaXRtYXBNYXRlcmlhbCA9IDxUcmlhbmdsZU1ldGhvZE1hdGVyaWFsPiBEZWZhdWx0TWF0ZXJpYWxNYW5hZ2VyLmdldERlZmF1bHRNYXRlcmlhbCgpO1xuXG5cdFx0cmV0dXJuICA8SUFzc2V0PiAgdGhpcy5fZGVmYXVsdEJpdG1hcE1hdGVyaWFsO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXREZWZhdWx0VGV4dHVyZSgpOklBc3NldFxuXHR7XG5cdFx0aWYgKCF0aGlzLl9kZWZhdWx0VGV4dHVyZSlcblx0XHRcdHRoaXMuX2RlZmF1bHRUZXh0dXJlID0gRGVmYXVsdE1hdGVyaWFsTWFuYWdlci5nZXREZWZhdWx0VGV4dHVyZSgpO1xuXG5cdFx0cmV0dXJuIDxJQXNzZXQ+IHRoaXMuX2RlZmF1bHRUZXh0dXJlO1xuXG5cdH1cblxuXHRwcml2YXRlIGdldERlZmF1bHRDdWJlVGV4dHVyZSgpOklBc3NldFxuXHR7XG5cdFx0aWYgKCF0aGlzLl9kZWZhdWx0Q3ViZVRleHR1cmUpIHtcblx0XHRcdHZhciBkZWZhdWx0Qml0bWFwOkJpdG1hcERhdGEgPSBEZWZhdWx0TWF0ZXJpYWxNYW5hZ2VyLmNyZWF0ZUNoZWNrZXJlZEJpdG1hcERhdGEoKTtcblxuXHRcdFx0dGhpcy5fZGVmYXVsdEN1YmVUZXh0dXJlID0gbmV3IEJpdG1hcEN1YmVUZXh0dXJlKGRlZmF1bHRCaXRtYXAsIGRlZmF1bHRCaXRtYXAsIGRlZmF1bHRCaXRtYXAsIGRlZmF1bHRCaXRtYXAsIGRlZmF1bHRCaXRtYXAsIGRlZmF1bHRCaXRtYXApO1xuXHRcdFx0dGhpcy5fZGVmYXVsdEN1YmVUZXh0dXJlLm5hbWUgPSBcImRlZmF1bHRDdWJlVGV4dHVyZVwiO1xuXHRcdH1cblxuXHRcdHJldHVybiA8SUFzc2V0PiB0aGlzLl9kZWZhdWx0Q3ViZVRleHR1cmU7XG5cdH1cblxuXHRwcml2YXRlIHJlYWROdW1iZXIocHJlY2lzaW9uOmJvb2xlYW4gPSBmYWxzZSk6bnVtYmVyXG5cdHtcblx0XHRpZiAocHJlY2lzaW9uKVxuXHRcdFx0cmV0dXJuIHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZERvdWJsZSgpO1xuXHRcdHJldHVybiB0aGlzLl9uZXdCbG9ja0J5dGVzLnJlYWRGbG9hdCgpO1xuXG5cdH1cblxuXHRwcml2YXRlIHBhcnNlTWF0cml4M0QoKTpNYXRyaXgzRFxuXHR7XG5cdFx0cmV0dXJuIG5ldyBNYXRyaXgzRCh0aGlzLnBhcnNlTWF0cml4NDNSYXdEYXRhKCkpO1xuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZU1hdHJpeDMyUmF3RGF0YSgpOkFycmF5PG51bWJlcj5cblx0e1xuXHRcdHZhciBpOm51bWJlcjtcblx0XHR2YXIgbXR4X3JhdzpBcnJheTxudW1iZXI+ID0gbmV3IEFycmF5PG51bWJlcj4oNik7XG5cdFx0Zm9yIChpID0gMDsgaSA8IDY7IGkrKykge1xuXHRcdFx0bXR4X3Jhd1tpXSA9IHRoaXMuX25ld0Jsb2NrQnl0ZXMucmVhZEZsb2F0KCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG10eF9yYXc7XG5cdH1cblxuXHRwcml2YXRlIHBhcnNlTWF0cml4NDNSYXdEYXRhKCk6QXJyYXk8bnVtYmVyPlxuXHR7XG5cdFx0dmFyIG10eF9yYXc6QXJyYXk8bnVtYmVyPiA9IG5ldyBBcnJheTxudW1iZXI+KDE2KTtcblxuXHRcdG10eF9yYXdbMF0gPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lNYXRyaXgpO1xuXHRcdG10eF9yYXdbMV0gPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lNYXRyaXgpO1xuXHRcdG10eF9yYXdbMl0gPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lNYXRyaXgpO1xuXHRcdG10eF9yYXdbM10gPSAwLjA7XG5cdFx0bXR4X3Jhd1s0XSA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeU1hdHJpeCk7XG5cdFx0bXR4X3Jhd1s1XSA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeU1hdHJpeCk7XG5cdFx0bXR4X3Jhd1s2XSA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeU1hdHJpeCk7XG5cdFx0bXR4X3Jhd1s3XSA9IDAuMDtcblx0XHRtdHhfcmF3WzhdID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5TWF0cml4KTtcblx0XHRtdHhfcmF3WzldID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5TWF0cml4KTtcblx0XHRtdHhfcmF3WzEwXSA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeU1hdHJpeCk7XG5cdFx0bXR4X3Jhd1sxMV0gPSAwLjA7XG5cdFx0bXR4X3Jhd1sxMl0gPSB0aGlzLnJlYWROdW1iZXIodGhpcy5fYWNjdXJhY3lNYXRyaXgpO1xuXHRcdG10eF9yYXdbMTNdID0gdGhpcy5yZWFkTnVtYmVyKHRoaXMuX2FjY3VyYWN5TWF0cml4KTtcblx0XHRtdHhfcmF3WzE0XSA9IHRoaXMucmVhZE51bWJlcih0aGlzLl9hY2N1cmFjeU1hdHJpeCk7XG5cdFx0bXR4X3Jhd1sxNV0gPSAxLjA7XG5cblx0XHQvL1RPRE86IGZpeCBtYXggZXhwb3J0ZXIgdG8gcmVtb3ZlIE5hTiB2YWx1ZXMgaW4gam9pbnQgMCBpbnZlcnNlIGJpbmQgcG9zZVxuXG5cdFx0aWYgKGlzTmFOKG10eF9yYXdbMF0pKSB7XG5cdFx0XHRtdHhfcmF3WzBdID0gMTtcblx0XHRcdG10eF9yYXdbMV0gPSAwO1xuXHRcdFx0bXR4X3Jhd1syXSA9IDA7XG5cdFx0XHRtdHhfcmF3WzRdID0gMDtcblx0XHRcdG10eF9yYXdbNV0gPSAxO1xuXHRcdFx0bXR4X3Jhd1s2XSA9IDA7XG5cdFx0XHRtdHhfcmF3WzhdID0gMDtcblx0XHRcdG10eF9yYXdbOV0gPSAwO1xuXHRcdFx0bXR4X3Jhd1sxMF0gPSAxO1xuXHRcdFx0bXR4X3Jhd1sxMl0gPSAwO1xuXHRcdFx0bXR4X3Jhd1sxM10gPSAwO1xuXHRcdFx0bXR4X3Jhd1sxNF0gPSAwO1xuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIG10eF9yYXc7XG5cdH1cblxufVxuXG5leHBvcnQgPSBBV0RQYXJzZXI7XG5cbmNsYXNzIEFXREJsb2NrXG57XG5cdHB1YmxpYyBpZDpudW1iZXI7XG5cdHB1YmxpYyBuYW1lOnN0cmluZztcblx0cHVibGljIGRhdGE6YW55O1xuXHRwdWJsaWMgbGVuOmFueTtcblx0cHVibGljIGdlb0lEOm51bWJlcjtcblx0cHVibGljIGV4dHJhczpPYmplY3Q7XG5cdHB1YmxpYyBieXRlczpCeXRlQXJyYXk7XG5cdHB1YmxpYyBlcnJvck1lc3NhZ2VzOkFycmF5PHN0cmluZz47XG5cdHB1YmxpYyB1dnNGb3JWZXJ0ZXhBbmltYXRpb246QXJyYXk8QXJyYXk8bnVtYmVyPj47XG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdH1cblxuXHRwdWJsaWMgZGlzcG9zZSgpXG5cdHtcblxuXHRcdHRoaXMuaWQgPSBudWxsO1xuXHRcdHRoaXMuYnl0ZXMgPSBudWxsO1xuXHRcdHRoaXMuZXJyb3JNZXNzYWdlcyA9IG51bGw7XG5cdFx0dGhpcy51dnNGb3JWZXJ0ZXhBbmltYXRpb24gPSBudWxsO1xuXG5cdH1cblxuXHRwdWJsaWMgYWRkRXJyb3IoZXJyb3JNc2c6c3RyaW5nKTp2b2lkXG5cdHtcblx0XHRpZiAoIXRoaXMuZXJyb3JNZXNzYWdlcylcblx0XHRcdHRoaXMuZXJyb3JNZXNzYWdlcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cblx0XHR0aGlzLmVycm9yTWVzc2FnZXMucHVzaChlcnJvck1zZyk7XG5cdH1cbn1cblxuY2xhc3MgQVdEUHJvcGVydGllc1xue1xuXHRwdWJsaWMgc2V0KGtleTpudW1iZXIsIHZhbHVlOmFueSk6dm9pZFxuXHR7XG5cdFx0dGhpc1sga2V5LnRvU3RyaW5nKCkgXSA9IHZhbHVlO1xuXHR9XG5cblx0cHVibGljIGdldChrZXk6bnVtYmVyLCBmYWxsYmFjazphbnkpOmFueVxuXHR7XG5cdFx0aWYgKHRoaXMuaGFzT3duUHJvcGVydHkoa2V5LnRvU3RyaW5nKCkpKSB7XG5cdFx0XHRyZXR1cm4gdGhpc1trZXkudG9TdHJpbmcoKV07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBmYWxsYmFjaztcblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKlxuICovXG5jbGFzcyBCaXRGbGFnc1xue1xuXHRwdWJsaWMgc3RhdGljIEZMQUcxOm51bWJlciA9IDE7XG5cdHB1YmxpYyBzdGF0aWMgRkxBRzI6bnVtYmVyID0gMjtcblx0cHVibGljIHN0YXRpYyBGTEFHMzpudW1iZXIgPSA0O1xuXHRwdWJsaWMgc3RhdGljIEZMQUc0Om51bWJlciA9IDg7XG5cdHB1YmxpYyBzdGF0aWMgRkxBRzU6bnVtYmVyID0gMTY7XG5cdHB1YmxpYyBzdGF0aWMgRkxBRzY6bnVtYmVyID0gMzI7XG5cdHB1YmxpYyBzdGF0aWMgRkxBRzc6bnVtYmVyID0gNjQ7XG5cdHB1YmxpYyBzdGF0aWMgRkxBRzg6bnVtYmVyID0gMTI4O1xuXHRwdWJsaWMgc3RhdGljIEZMQUc5Om51bWJlciA9IDI1Njtcblx0cHVibGljIHN0YXRpYyBGTEFHMTA6bnVtYmVyID0gNTEyO1xuXHRwdWJsaWMgc3RhdGljIEZMQUcxMTpudW1iZXIgPSAxMDI0O1xuXHRwdWJsaWMgc3RhdGljIEZMQUcxMjpudW1iZXIgPSAyMDQ4O1xuXHRwdWJsaWMgc3RhdGljIEZMQUcxMzpudW1iZXIgPSA0MDk2O1xuXHRwdWJsaWMgc3RhdGljIEZMQUcxNDpudW1iZXIgPSA4MTkyO1xuXHRwdWJsaWMgc3RhdGljIEZMQUcxNTpudW1iZXIgPSAxNjM4NDtcblx0cHVibGljIHN0YXRpYyBGTEFHMTY6bnVtYmVyID0gMzI3Njg7XG5cblx0cHVibGljIHN0YXRpYyB0ZXN0KGZsYWdzOm51bWJlciwgdGVzdEZsYWc6bnVtYmVyKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gKGZsYWdzICYgdGVzdEZsYWcpID09IHRlc3RGbGFnO1xuXHR9XG59XG4iXX0=