///<reference path="../../_definitions.ts"/>

module away.loaders
{

	/**
	 * AWDParser provides a parser for the AWD data type.
	 */
	export class AWDParser extends away.loaders.ParserBase
	{
		//set to "true" to have some traces in the Console
		private _debug              : boolean = true;
		private _byteData           : away.utils.ByteArray;
		private _startedParsing     : boolean = false;
		private _cur_block_id       : number;
		private _blocks             : Array<AWDBlock>;
		private _newBlockBytes      : away.utils.ByteArray;
		private _version            : Array<number>;
		private _compression        : number;
		private _accuracyOnBlocks   : boolean;
		private _accuracyMatrix     : boolean;
		private _accuracyGeo        : boolean;
		private _accuracyProps      : boolean;
		private _matrixNrType       : number;
		private _geoNrType          : number;
		private _propsNrType        : number;
		private _streaming          : boolean;
		private _texture_users      : Object = {};
		private _parsed_header      : boolean = false;
		private _body               : away.utils.ByteArray;
		private _defaultTexture     : away.textures.BitmapTexture;     // HTML IMAGE TEXTURE >? !
		private _cubeTextures       : Array;
		private _defaultBitmapMaterial  : away.materials.TextureMaterial;
		//private _defaultCubeTexture : BitmapCubeTexture;              // Not yet implemented;

		public static COMPRESSIONMODE_LZMA  : string = "lzma";
		public static UNCOMPRESSED          : number = 0;
		public static DEFLATE               : number = 1;
		public static LZMA                  : number = 2;
		public static INT8                  : number = 1;
		public static INT16                 : number = 2;
		public static INT32                 : number = 3;
		public static UINT8                 : number = 4;
		public static UINT16                : number = 5;
		public static UINT32                : number = 6;
		public static FLOAT32               : number = 7;
		public static FLOAT64               : number = 8;
		public static BOOL                  : number = 21;
		public static COLOR                 : number = 22;
		public static BADDR                 : number = 23;
		public static AWDSTRING             : number = 31;
		public static AWDBYTEARRAY          : number = 32;
		public static VECTOR2x1             : number = 41;
		public static VECTOR3x1             : number = 42;
		public static VECTOR4x1             : number = 43;
		public static MTX3x2                : number = 44;
		public static MTX3x3                : number = 45;
		public static MTX4x3                : number = 46;
		public static MTX4x4                : number = 47;

		private blendModeDic                : Array<string>;
		private _depthSizeDic               : Array<number>;
		
		/**
		 * Creates a new AWDParser object.
		 * @param uri The url or id of the data or file to be parsed.
		 * @param extra The holder for extra contextual data that the parser might need.
		 */
		constructor()
		{
			super( away.loaders.ParserDataFormat.BINARY );
			
			this._blocks = new Array<AWDBlock>();
            this._blocks[0] = new AWDBlock();
            this._blocks[0].data = null; // Zero address means null in AWD
			
			this.blendModeDic = new Array<string>(); // used to translate ints to blendMode-strings
            this.blendModeDic.push(away.display.BlendMode.NORMAL);
            this.blendModeDic.push(away.display.BlendMode.ADD);
            this.blendModeDic.push(away.display.BlendMode.ALPHA);
            this.blendModeDic.push(away.display.BlendMode.DARKEN);
            this.blendModeDic.push(away.display.BlendMode.DIFFERENCE);
            this.blendModeDic.push(away.display.BlendMode.ERASE);
            this.blendModeDic.push(away.display.BlendMode.HARDLIGHT);
            this.blendModeDic.push(away.display.BlendMode.INVERT);
            this.blendModeDic.push(away.display.BlendMode.LAYER);
            this.blendModeDic.push(away.display.BlendMode.LIGHTEN);
            this.blendModeDic.push(away.display.BlendMode.MULTIPLY);
            this.blendModeDic.push(away.display.BlendMode.NORMAL);
            this.blendModeDic.push(away.display.BlendMode.OVERLAY);
            this.blendModeDic.push(away.display.BlendMode.SCREEN);
            this.blendModeDic.push(away.display.BlendMode.SHADER);
            this.blendModeDic.push(away.display.BlendMode.OVERLAY);
			
			this._depthSizeDic = new Array<number>(); // used to translate ints to depthSize-values
            this._depthSizeDic.push(256);
            this._depthSizeDic.push(512);
            this._depthSizeDic.push(2048);
            this._depthSizeDic.push(1024);
            this._version = Array<number>();//[]; // will contain 2 int (major-version, minor-version) for awd-version-check
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
			return (away.loaders.ParserUtil.toString(data, 3) == 'AWD');
		}

        /**
         * @inheritDoc
         */
        public _iResolveDependency(resourceDependency:away.loaders.ResourceDependency):void
        {
            // this function will be called when Dependency has finished loading.
            // the Assets waiting for this Bitmap, can be Texture or CubeTexture.
            // if the Bitmap is awaited by a CubeTexture, we need to check if its the last Bitmap of the CubeTexture,
            // so we know if we have to finalize the Asset (CubeTexture) or not.
            if (resourceDependency.assets.length == 1)
            {
                var isCubeTextureArray  : Array<string> = resourceDependency.id.split("#");
                var ressourceID         : string = isCubeTextureArray[0];
                var asset               : away.textures.TextureProxyBase;
                var thisBitmapTexture   : away.textures.Texture2DBase;
                var block               : AWDBlock;

                // Cube Textures not yet implemented
                /*
                if (isCubeTextureArray.length == 1)
                {
                    asset = resourceDependency.assets[0] as Texture2DBase;
                    if (asset) {
                        var mat:TextureMaterial;
                        var users:Array;
                        block = _blocks[parseInt(resourceDependency.id)];
                        block.data = asset; // Store finished asset
                        // Reset name of texture to the one defined in the AWD file,
                        // as opposed to whatever the image parser came up with.
                        asset.resetAssetPath(block.name, null, true);
                        block.name = asset.name;
                        // Finalize texture asset to dispatch texture event, which was
                        // previously suppressed while the dependency was loaded.
                        finalizeAsset(asset);
                        if (_debug) {
                            trace("Successfully loadet Bitmap for texture");
                            trace("Parsed CubeTexture: Name = " + block.name);
                        }
                    }
                }

                */

                // Cube Textures not yet implemented

                /*
                if (isCubeTextureArray.length > 1) {
                    thisBitmapTexture = resourceDependency.assets[0] as BitmapTexture;
                    _cubeTextures[uint(isCubeTextureArray[1])] = BitmapTexture(thisBitmapTexture).bitmapData;
                    _texture_users[ressourceID].push(1);

                    if (_debug)
                        trace("Successfully loadet Bitmap " + _texture_users[ressourceID].length + " / 6 for Cubetexture");
                    if (_texture_users[ressourceID].length == _cubeTextures.length) {
                        asset = new BitmapCubeTexture(_cubeTextures[0], _cubeTextures[1], _cubeTextures[2], _cubeTextures[3], _cubeTextures[4], _cubeTextures[5]);
                        block = _blocks[ressourceID];
                        block.data = asset; // Store finished asset
                        // Reset name of texture to the one defined in the AWD file,
                        // as opposed to whatever the image parser came up with.
                        asset.resetAssetPath(block.name, null, true);
                        block.name = asset.name;
                        // Finalize texture asset to dispatch texture event, which was
                        // previously suppressed while the dependency was loaded.
                        finalizeAsset(asset);
                        if (_debug)
                            trace("Parsed CubeTexture: Name = " + block.name);
                    }
                }
                */
            }
        }

        /**
         * @inheritDoc
         */
        public _iResolveDependencyFailure(resourceDependency:away.loaders.ResourceDependency):void
        {
            //not used - if a dependcy fails, the awaiting Texture or CubeTexture will never be finalized, and the default-bitmaps will be used.
            // this means, that if one Bitmap of a CubeTexture fails, the CubeTexture will have the DefaultTexture applied for all six Bitmaps.
        }

        /**
         * Resolve a dependency name
         *
         * @param resourceDependency The dependency to be resolved.
         */
        public _iResolveDependencyName(resourceDependency:away.loaders.ResourceDependency, asset:away.library.IAsset):string
        {
            var oldName:string = asset.name;

            if (asset)
            {
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

            if ( ! this._startedParsing )
            {
                this._byteData = this._pGetByteData();//getByteData();
                this._startedParsing = true;
            }

            if ( ! this._parsed_header )
            {

                //----------------------------------------------------------------------------
                // LITTLE_ENDIAN - Default for ArrayBuffer / Not implemented in ByteArray
                //----------------------------------------------------------------------------
                //this._byteData.endian = Endian.LITTLE_ENDIAN;
                //----------------------------------------------------------------------------

                //----------------------------------------------------------------------------
                // Parse header and decompress body if needed
                this.parseHeader();

                switch (this._compression)
                {

                    case AWDParser.DEFLATE:
                    case AWDParser.LZMA:
                            this._pDieWithError( 'Compressed AWD formats not yet supported');
                            break;

                    case AWDParser.UNCOMPRESSED:
                        this._body = this._byteData;
                        break;

                    //----------------------------------------------------------------------------
                    // Compressed AWD Formats not yet supported
                    /*
                    case AWDParser.DEFLATE:

                        this._body = new away.utils.ByteArray();
                        this._byteData.readBytes(this._body, 0, this._byteData.getBytesAvailable());
                        this._body.uncompress();

                        break;
                    case AWDParser.LZMA:

                        this._body = new away.utils.ByteArray();
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

            while (this._body.getBytesAvailable() > 0 && ! this.parsingPaused ) //&& this._pHasTime() )
            {
                this.parseNextBlock();

            }

            //----------------------------------------------------------------------------
            // Return complete status
            if (this._body.getBytesAvailable() == 0)
            {
                this.dispose();
                return  away.loaders.ParserBase.PARSING_DONE;
            }
            else
            {
                return  away.loaders.ParserBase.MORE_TO_PARSE;
            }

        }

        private parseNextBlock():void
        {
            var block       : AWDBlock;
            var assetData   : away.library.IAsset;
            var isParsed    : boolean = false;
            var ns          : number;
            var type        : number;
            var flags       : number;
            var len         : number;

            this._cur_block_id = this._body.readUnsignedInt();

            ns      = this._body.readUnsignedByte();
            type    = this._body.readUnsignedByte();
            flags   = this._body.readUnsignedByte();
            len     = this._body.readUnsignedInt();

            var blockCompression        :boolean        = bitFlags.test(flags, bitFlags.FLAG4);
            var blockCompressionLZMA    :boolean        = bitFlags.test(flags, bitFlags.FLAG5);

            if (this._accuracyOnBlocks)
            {
                this._accuracyMatrix        = bitFlags.test(flags, bitFlags.FLAG1);
                this._accuracyGeo           = bitFlags.test(flags, bitFlags.FLAG2);
                this._accuracyProps         = bitFlags.test(flags, bitFlags.FLAG3);
                this._geoNrType             = AWDParser.FLOAT32;

                if (this._accuracyGeo)
                {
                    this._geoNrType     = AWDParser.FLOAT64;
                }

                this._matrixNrType      = AWDParser.FLOAT32;

                if (this._accuracyMatrix)
                {
                    this._matrixNrType  = AWDParser.FLOAT64;
                }

                this._propsNrType       = AWDParser.FLOAT32;

                if (this._accuracyProps)
                {
                    this._propsNrType   = AWDParser.FLOAT64;
                }
            }

            var blockEndAll:number = this._body.position + len;

            if (len > this._body.getBytesAvailable() )
            {
                this._pDieWithError('AWD2 block length is bigger than the bytes that are available!');
                this._body.position += this._body.getBytesAvailable();
                return;
            }
            this._newBlockBytes = new away.utils.ByteArray();


            this._body.readBytes(this._newBlockBytes, 0, len);

            //----------------------------------------------------------------------------
            // Compressed AWD Formats not yet supported

            if ( blockCompression )
            {
                this._pDieWithError( 'Compressed AWD formats not yet supported');

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
            block       = new AWDBlock();
            block.len   = this._newBlockBytes.position + len;
            block.id    = this._cur_block_id;

            var blockEndBlock : number = this._newBlockBytes.position + len;

            if (blockCompression)
            {
                this._pDieWithError( 'Compressed AWD formats not yet supported');
                //blockEndBlock   = this._newBlockBytes.position + this._newBlockBytes.length;
                //block.len       = blockEndBlock;
            }

            if (this._debug)
            {
                console.log("AWDBlock:  ID = " + this._cur_block_id + " | TypeID = " + type + " | Compression = " + blockCompression + " | Matrix-Precision = " + this._accuracyMatrix + " | Geometry-Precision = " + this._accuracyGeo + " | Properties-Precision = " + this._accuracyProps);
            }

            this._blocks[this._cur_block_id] = block;

            if ((this._version[0] == 2) && (this._version[1] == 1))
            {

                console.log( 'parse version 2.1');
                /*
                switch (type) {
                    case 11:
                        this.parsePrimitves(this._cur_block_id);
                        isParsed = true;
                        break;
                    case 31:
                        this.parseSkyBoxInstance(this._cur_block_id);
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
            if (isParsed == false)
            {

                console.log( 'type' , type );


                switch (type)
                {

                    case 1:
                        //this.parseTriangleGeometrieBlock(this._cur_block_id);
                        break;
                    case 22:
                        //this.parseContainer(this._cur_block_id);
                        break;
                    case 23:
                        //this.parseMeshInstance(this._cur_block_id);
                        break;
                    case 81:
                        //this.parseMaterial(this._cur_block_id);
                        break;
                    case 82:
                        this.parseTexture(this._cur_block_id);
                        break;
                    case 101:
                        //this.parseSkeleton(this._cur_block_id);
                        break;
                    case 102:
                        //this.parseSkeletonPose(this._cur_block_id);
                        break;
                    case 103:
                        //this.parseSkeletonAnimation(this._cur_block_id);
                        break;
                    case 121:
                        //this.parseUVAnimation(this._cur_block_id);
                        break;
                    case 254:
                        //this.parseNameSpace(this._cur_block_id);
                        break;
                    case 255:
                        //this.parseMetaData(this._cur_block_id);
                        break;
                    default:
                        if (this._debug)
                        {
                            console.log("AWDBlock:   Unknown BlockType  (BlockID = " + this._cur_block_id + ") - Skip " + len + " bytes");
                        }
                        this._newBlockBytes.position += len;
                        break;
                }
            }
            //*/

            var msgCnt:number = 0;
            if (this._newBlockBytes.position == blockEndBlock)
            {
                if (this._debug)
                {
                    if (block.errorMessages)
                    {
                        while (msgCnt < block.errorMessages.length)
                        {
                            console.log("        (!) Error: " + block.errorMessages[msgCnt] + " (!)");
                            msgCnt++;
                        }
                    }
                }
                if (this._debug)
                {
                    console.log("\n");
                }
            }
            else
            {
                if (this._debug)
                {

                    console.log("  (!)(!)(!) Error while reading AWDBlock ID " + this._cur_block_id + " = skip to next block");

                    if (block.errorMessages)
                    {
                        while (msgCnt < block.errorMessages.length)
                        {
                            console.log("        (!) Error: " + block.errorMessages[msgCnt] + " (!)");
                            msgCnt++;
                        }
                    }
                }
            }

            this._body.position = blockEndAll;
            this._newBlockBytes = null;

        }

        private dispose() : void
        {

            for ( var c in this._blocks)
            {

                var b : AWDBlock = <AWDBlock> this._blocks[ c ];
                    b.dispose();

            }

        }

        private parseVarStr():string
        {

            var len:number = this._newBlockBytes.readUnsignedShort();
            return this._newBlockBytes.readUTFBytes(len);
        }


        //Block ID = 82
        private parseTexture(blockID:number):void
        {

            var asset:away.textures.Texture2DBase;

            this._blocks[blockID].name  = this.parseVarStr();
            var type:number             = this._newBlockBytes.readUnsignedByte();
            var data_len:number;

            this._texture_users[this._cur_block_id.toString()] = [];

            // External
            if (type == 0)
            {
                data_len = this._newBlockBytes.readUnsignedInt();
                var url:string;
                url = this._newBlockBytes.readUTFBytes(data_len);
                this._pAddDependency( this._cur_block_id.toString(), new away.net.URLRequest(url), false, null, true);

            }
            else
            {
                data_len = this._newBlockBytes.readUnsignedInt();

                var data:away.utils.ByteArray;
                    data = new away.utils.ByteArray();
                this._newBlockBytes.readBytes( data , 0 , data_len );

                //this._pAddDependency(this._cur_block_id.toString(), null, false, data, true);

                data.position = 0;
                away.loaders.ParserUtil.byteArrayToImage( data );

            }

            // Ignore for now
            this.parseProperties(null);
            this._blocks[blockID].extras = this.parseUserAttributes();
            this._pPauseAndRetrieveDependencies();
            this._blocks[blockID].data = asset;

            if (this._debug)
            {
                var textureStylesNames:Array = ["external", "embed"]
                console.log("Start parsing a " + textureStylesNames[type] + " Bitmap for Texture");
            }

        }

        private parseUserAttributes():Object
        {
            var attributes  :Object;
            var list_len    :number;
            var attibuteCnt :number;

            list_len = this._newBlockBytes.readUnsignedInt();

            if (list_len > 0)
            {

                var list_end:number;

                attributes = {};

                list_end = this._newBlockBytes.position + list_len;

                while (this._newBlockBytes.position < list_end)
                {
                    var ns_id:number;
                    var attr_key:string;
                    var attr_type:number;
                    var attr_len:number;
                    var attr_val:any;

                    // TODO: Properly tend to namespaces in attributes
                    ns_id       = this._newBlockBytes.readUnsignedByte();
                    attr_key    = this.parseVarStr();
                    attr_type   = this._newBlockBytes.readUnsignedByte();
                    attr_len    = this._newBlockBytes.readUnsignedInt();

                    if ((this._newBlockBytes.position + attr_len) > list_end)
                    {
                        console.log("           Error in reading attribute # " + attibuteCnt + " = skipped to end of attribute-list");
                        this._newBlockBytes.position = list_end;
                        return attributes;
                    }

                    switch (attr_type)
                    {
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

                    if (this._debug)
                    {
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
            var propertyCnt:number= 0;
            var props:AWDProperties = new AWDProperties();

            list_len = this._newBlockBytes.readUnsignedInt();
            list_end = this._newBlockBytes.position + list_len;

            if (expected)
            {

                while (this._newBlockBytes.position < list_end)
                {
                    var len:number;
                    var key:number;
                    var type:number;

                    key = this._newBlockBytes.readUnsignedShort();
                    len = this._newBlockBytes.readUnsignedInt();

                    if ((this._newBlockBytes.position + len) > list_end)
                    {
                        console.log("           Error in reading property # " + propertyCnt + " = skipped to end of propertie-list");
                        this._newBlockBytes.position = list_end;
                        return props;
                    }

                    if (expected.hasOwnProperty(key.toString()))
                    {
                        type = expected[key];
                        props.set(key, this.parseAttrValue(type, len));
                    }
                    else
                    {
                        this._newBlockBytes.position += len;
                    }

                    propertyCnt += 1;

                }
            }
            else
            {
                this._newBlockBytes.position = list_end;
            }

            return props;

        }

        private parseAttrValue(type:number, len:number):any
        {
            var elem_len:number;
            var read_func:Function;

            switch (type)
            {

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

            if (elem_len < len)
            {
                var list      : Array;
                var num_read  : number;
                var num_elems : number;

                list        = [];
                num_read    = 0;
                num_elems   = len/elem_len;

                while (num_read < num_elems)
                {
                    list.push(read_func());
                    num_read++;
                }

                return list;
            }
            else
            {
                var val:any;

                val = read_func();
                return val;
            }
        }

        private parseHeader():void
        {
            var flags       : number; /* uint */
            var body_len    : number;

            this._byteData.position = 3; // Skip magic string and parse version

            this._version[0] = this._byteData.readUnsignedByte();
            this._version[1] = this._byteData.readUnsignedByte();

            flags = this._byteData.readUnsignedShort(); // Parse bit flags

            this._streaming = bitFlags.test(flags, bitFlags.FLAG1);

            if ((this._version[0] == 2) && (this._version[1] == 1))
            {
                this._accuracyMatrix = bitFlags.test(flags, bitFlags.FLAG2);
                this._accuracyGeo = bitFlags.test(flags, bitFlags.FLAG3);
                this._accuracyProps = bitFlags.test(flags, bitFlags.FLAG4);
            }

            // if we set _accuracyOnBlocks, the precision-values are read from each block-header.

            // set storagePrecision types
            this._geoNrType = AWDParser.FLOAT32;

            if (this._accuracyGeo)
            {
                this._geoNrType = AWDParser.FLOAT64;
            }

            this._matrixNrType = AWDParser.FLOAT32;

            if (this._accuracyMatrix)
            {
                this._matrixNrType = AWDParser.FLOAT64;
            }

            this._propsNrType = AWDParser.FLOAT32;

            if (this._accuracyProps)
            {
                this._propsNrType = AWDParser.FLOAT64;
            }

            this._compression = this._byteData.readUnsignedByte(); // compression

            if (this._debug)
            {
                console.log("Import AWDFile of version = " + this._version[0] + " - " + this._version[1]);
                console.log("Global Settings = Compression = " + this._compression + " | Streaming = " + this._streaming + " | Matrix-Precision = " + this._accuracyMatrix + " | Geometry-Precision = " + this._accuracyGeo + " | Properties-Precision = " + this._accuracyProps);
            }

            // Check file integrity
            body_len = this._byteData.readUnsignedInt();
            if (!this._streaming && body_len != this._byteData.getBytesAvailable() )
            {
                this._pDieWithError('AWD2 body length does not match header integrity field');
            }

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

		if ( this.hasOwnProperty(key.toString()))
        {
			return this[key.toString()];
        }
		else
        {
			return fallback;
        }
	}
}

