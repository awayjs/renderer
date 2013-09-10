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
		private _defaultCubeTexture     : away.textures.BitmapCubeTexture;

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

                if (isCubeTextureArray.length == 1) // Not a cube texture
                {
                    asset = <away.textures.Texture2DBase> resourceDependency.assets[0] ;
                    if (asset)
                    {
                        var mat     : away.materials.TextureMaterial;
                        var users   : Array;

                        block       = this._blocks[ resourceDependency.id ];
                        block.data  = asset; // Store finished asset

                        // Reset name of texture to the one defined in the AWD file,
                        // as opposed to whatever the image parser came up with.
                        asset.resetAssetPath(block.name, null, true);
                        block.name = asset.name;
                        // Finalize texture asset to dispatch texture event, which was
                        // previously suppressed while the dependency was loaded.
                        this._pFinalizeAsset( <away.library.IAsset> asset );

                        if (this._debug)
                        {
                            console.log("Successfully loaded Bitmap for texture");
                            console.log("Parsed texture: Name = " + block.name);
                        }
                    }
                }

                if (isCubeTextureArray.length > 1) // Cube Texture
                {
                    thisBitmapTexture = <away.textures.BitmapTexture> resourceDependency.assets[0] ;

                    var tx : away.textures.HTMLImageElementTexture = <away.textures.HTMLImageElementTexture> thisBitmapTexture;

                    this._cubeTextures[ isCubeTextureArray[1] ] = tx.htmlImageElement; // ?
                    this._texture_users[ressourceID].push(1);

                    if (this._debug)
                    {
                        console.log("Successfully loaded Bitmap " + this._texture_users[ressourceID].length + " / 6 for Cubetexture");
                    }
                    if (this._texture_users[ressourceID].length == this._cubeTextures.length)
                    {

                        var posX : any = this._cubeTextures[0];
                        var negX : any = this._cubeTextures[1];
                        var posY : any = this._cubeTextures[2];
                        var negY : any = this._cubeTextures[3];
                        var posZ : any = this._cubeTextures[4];
                        var negZ : any = this._cubeTextures[5];

                        asset       = new away.textures.HTMLImageElementCubeTexture( posX , negX , posY , negY , posZ , negZ ) ;
                        block       = this._blocks[ressourceID];
                        block.data  = asset; // Store finished asset

                        // Reset name of texture to the one defined in the AWD file,
                        // as opposed to whatever the image parser came up with.
                        asset.resetAssetPath(block.name, null, true);
                        block.name = asset.name;
                        // Finalize texture asset to dispatch texture event, which was
                        // previously suppressed while the dependency was loaded.
                        this._pFinalizeAsset(  <away.library.IAsset> asset );
                        if (this._debug)
                        {
                            console.log("Parsed CubeTexture: Name = " + block.name);
                        }
                    }
                }

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

        private dispose() : void
        {

            for ( var c in this._blocks)
            {

                var b : AWDBlock = <AWDBlock> this._blocks[ c ];
                    b.dispose();

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

                 switch (type)
                 {
                     case 11:
                         this.parsePrimitves(this._cur_block_id);
                         isParsed = true;
                         break;
                     case 31:
                         //this.parseSkyBoxInstance(this._cur_block_id);
                         //isParsed = true;
                         break;
                     case 41:
                         this.parseLight(this._cur_block_id);
                         //isParsed = true;
                         break;
                     case 42:
                         //this.parseCamera(this._cur_block_id);
                         //isParsed = true;
                         break;

                     //  case 43:
                     //      parseTextureProjector(_cur_block_id);
                     //      isParsed = true;
                     //      break;

                     case 51:
                         //this.parseLightPicker(this._cur_block_id);
                         //isParsed = true;
                         break;
                     case 81:
                         //this.parseMaterial_v1(this._cur_block_id);
                         //isParsed = true;
                         break;
                     case 83:
                         //this.parseCubeTexture(this._cur_block_id);
                         //isParsed = true;
                         break;
                     case 91:
                         //this.parseSharedMethodBlock(this._cur_block_id);
                         //isParsed = true;
                         break;
                     case 92:
                         //this.parseShadowMethodBlock(this._cur_block_id);
                         //isParsed = true;
                         break;
                     case 111:
                         //this.parseMeshPoseAnimation(this._cur_block_id, true);
                         //isParsed = true;
                         break;
                     case 112:
                         //this.parseMeshPoseAnimation(this._cur_block_id);
                         //isParsed = true;
                         break;
                     case 113:
                         //this.parseVertexAnimationSet(this._cur_block_id);
                         //isParsed = true;
                         break;
                     case 122:
                         //this.parseAnimatorSet(this._cur_block_id);
                         //isParsed = true;
                         break;
                     case 253:
                         //this.parseCommand(this._cur_block_id);
                         //isParsed = true;
                         break;
                 }
                 //*/
            }
            //*
            if (isParsed == false)
            {
                switch (type)
                {

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

                        //------------------------------------------------------------------
                        // Not yet supported - animation packages are not yet implemented
                        //------------------------------------------------------------------

                        //this.parseSkeleton(this._cur_block_id);

                        break;
                    case 102:

                        //------------------------------------------------------------------
                        // Not yet supported - animation packages are not yet implemented
                        //------------------------------------------------------------------

                        //this.parseSkeletonPose(this._cur_block_id);
                        break;
                    case 103:

                        //------------------------------------------------------------------
                        // Not yet supported - animation packages are not yet implemented
                        //------------------------------------------------------------------

                        //this.parseSkeletonAnimation(this._cur_block_id);
                        break;
                    case 121:

                        //------------------------------------------------------------------
                        // Not yet supported - animation packages are not yet implemented
                        //------------------------------------------------------------------

                        //this.parseUVAnimation(this._cur_block_id);
                        break;
                    case 254:
                        this.parseNameSpace(this._cur_block_id);
                        break;
                    case 255:
                        this.parseMetaData(this._cur_block_id);
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


        //--Parser Blocks---------------------------------------------------------------------------

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
            while (subs_parsed < num_subs)
            {
                var i:number;
                var sm_len:number, sm_end:number;
                var sub_geoms:Array<away.base.ISubGeometry>;
                var w_indices:Array<number>;
                var weights:Array<number>;

                sm_len = this._newBlockBytes.readUnsignedInt();
                sm_end = this._newBlockBytes.position + sm_len;

                // Ignore for now
                var subProps:AWDProperties = this.parseProperties({1:this._geoNrType, 2:this._geoNrType});
                // Loop through data streams
                while (this._newBlockBytes.position < sm_end) {
                    var idx:number= 0;
                    var str_ftype:number, str_type:number, str_len:number, str_end:number;

                    // Type, field type, length
                    str_type = this._newBlockBytes.readUnsignedByte();
                    str_ftype = this._newBlockBytes.readUnsignedByte();
                    str_len = this._newBlockBytes.readUnsignedInt();
                    str_end = this._newBlockBytes.position + str_len;

                    var x:number, y:number, z:number;

                    if (str_type == 1)
                    {
                        var verts:Array<number> = new Array<number>();

                        while (this._newBlockBytes.position < str_end)
                        {
                            // TODO: Respect stream field type
                            x = this.readNumber(this._accuracyGeo);
                            y = this.readNumber(this._accuracyGeo);
                            z = this.readNumber(this._accuracyGeo);

                            verts[idx++] = x;
                            verts[idx++] = y;
                            verts[idx++] = z;
                        }
                    }
                    else if (str_type == 2)
                    {
                        var indices:Array<number> = new Array<number>();

                        while (this._newBlockBytes.position < str_end)
                        {
                            // TODO: Respect stream field type
                            indices[idx++] = this._newBlockBytes.readUnsignedShort();
                        }

                    }
                    else if (str_type == 3)
                    {
                        var uvs:Array<number> = new Array<number>();
                        while (this._newBlockBytes.position < str_end)
                        {
                            uvs[idx++] = this.readNumber(this._accuracyGeo);

                        }
                    }
                    else if (str_type == 4)
                    {

                        var normals:Array<number> = new Array<number>();

                        while (this._newBlockBytes.position < str_end)
                        {
                            normals[idx++] = this.readNumber(this._accuracyGeo);
                        }

                    }
                    else if (str_type == 6)
                    {
                        w_indices = Array<number>();

                        while (this._newBlockBytes.position < str_end)
                        {
                            w_indices[idx++] = this._newBlockBytes.readUnsignedShort()*3; // TODO: Respect stream field type
                        }

                    }
                    else if (str_type == 7)
                    {

                        weights = new Array<number>();

                        while (this._newBlockBytes.position < str_end)
                        {
                            weights[idx++] = this.readNumber(this._accuracyGeo);
                        }
                    }
                    else
                    {
                        this._newBlockBytes.position = str_end;
                    }

                }

                this.parseUserAttributes(); // Ignore sub-mesh attributes for now

                sub_geoms = away.utils.GeometryUtils.fromVectors(verts, indices, uvs, normals, null, weights, w_indices);

                var scaleU:number = subProps.get(1, 1);
                var scaleV:number = subProps.get(2, 1);
                var setSubUVs:boolean = false; //this should remain false atm, because in AwayBuilder the uv is only scaled by the geometry

                if ((geoScaleU != scaleU) || (geoScaleV != scaleV))
                {
                    setSubUVs = true;
                    scaleU = geoScaleU/scaleU;
                    scaleV = geoScaleV/scaleV;
                }

                for (i = 0; i < sub_geoms.length; i++) {
                    if (setSubUVs)
                        sub_geoms[i].scaleUV(scaleU, scaleV);
                    geom.addSubGeometry(sub_geoms[i]);
                    // TODO: Somehow map in-sub to out-sub indices to enable look-up
                    // when creating meshes (and their material assignments.)
                }
                subs_parsed++;
            }
            if ((geoScaleU != 1) || (geoScaleV != 1))
                geom.scaleUV(geoScaleU, geoScaleV);
            this.parseUserAttributes();
            this._pFinalizeAsset(geom, name);
            this._blocks[blockID].data = geom;

            if (this._debug)
            {
                console.log("Parsed a TriangleGeometry: Name = " + name + "| SubGeometries = " + sub_geoms.length);
            }

        }

        //Block ID = 11
        private parsePrimitves(blockID:number):void
        {
            var name        : string;
            var geom        : away.base.Geometry;
            var primType    : number;
            var subs_parsed : number;
            var props       : AWDProperties;
            var bsm         : away.geom.Matrix3D;

            // Read name and sub count
            name        = this.parseVarStr();
            primType    = this._newBlockBytes.readUnsignedByte();
            props       = this.parseProperties({101:this._geoNrType, 102:this._geoNrType, 103:this._geoNrType, 110:this._geoNrType, 111:this._geoNrType, 301:AWDParser.UINT16, 302:AWDParser.UINT16, 303:AWDParser.UINT16, 701:AWDParser.BOOL, 702:AWDParser.BOOL, 703:AWDParser.BOOL, 704:AWDParser.BOOL});

            var primitveTypes:Array<string> = ["Unsupported Type-ID", "PlaneGeometry", "CubeGeometry", "SphereGeometry", "CylinderGeometry", "ConeGeometry", "CapsuleGeometry", "TorusGeometry"]

            switch (primType)
            {
                // to do, not all properties are set on all primitives

                case 1:
                    geom = new away.primitives.PlaneGeometry(props.get(101, 100), props.get(102, 100), props.get(301, 1), props.get(302, 1), props.get(701, true), props.get(702, false));
                    break;

                case 2:
                    geom = new away.primitives.CubeGeometry(props.get(101, 100), props.get(102, 100), props.get(103, 100), props.get(301, 1), props.get(302, 1), props.get(303, 1), props.get(701, true));
                    break;

                case 3:
                    geom = new away.primitives.SphereGeometry(props.get(101, 50), props.get(301, 16), props.get(302, 12), props.get(701, true));
                    break;

                case 4:
                    geom = new away.primitives.CylinderGeometry(props.get(101, 50), props.get(102, 50), props.get(103, 100), props.get(301, 16), props.get(302, 1), true, true, true); // bool701, bool702, bool703, bool704);
                    if (!props.get(701, true))
                        (<away.primitives.CylinderGeometry>geom).topClosed = false;
                    if (!props.get(702, true))
                        (<away.primitives.CylinderGeometry>geom).bottomClosed = false;
                    if (!props.get(703, true))
                        (<away.primitives.CylinderGeometry>geom).yUp = false;

                    break;

                case 5:
                    geom = new away.primitives.ConeGeometry(props.get(101, 50), props.get(102, 100), props.get(301, 16), props.get(302, 1), props.get(701, true), props.get(702, true));
                    break;

                case 6:
                    geom = new away.primitives.CapsuleGeometry(props.get(101, 50), props.get(102, 100), props.get(301, 16), props.get(302, 15), props.get(701, true));
                    break;

                case 7:
                    geom = new away.primitives.TorusGeometry(props.get(101, 50), props.get(102, 50), props.get(301, 16), props.get(302, 8), props.get(701, true));
                    break;

                default:
                    geom = new away.base.Geometry();
                    console.log("ERROR: UNSUPPORTED PRIMITIVE_TYPE");
                    break;
            }

            if ((props.get(110, 1) != 1) || (props.get(111, 1) != 1))
            {
                geom.subGeometries;
                geom.scaleUV(props.get(110, 1), props.get(111, 1));
            }

            this.parseUserAttributes();
            geom.name = name;
            this._pFinalizeAsset(geom, name);
            this._blocks[blockID].data = geom;

            if (this._debug)
            {
                if ((primType < 0) || (primType > 7))
                {
                    primType = 0;
                }
                console.log("Parsed a Primivite: Name = " + name + "| type = " + primitveTypes[primType]);
            }
        }

        // Block ID = 22
        private parseContainer(blockID:number):void
        {
            var name    : string;
            var par_id  : number;
            var mtx     : away.geom.Matrix3D;
            var ctr     : away.containers.ObjectContainer3D;
            var parent  : away.containers.ObjectContainer3D;

            par_id  = this._newBlockBytes.readUnsignedInt();
            mtx     = this.parseMatrix3D();
            name    = this.parseVarStr();

            var parentName:string   = "Root (TopLevel)";
            ctr                     = new away.containers.ObjectContainer3D();
            ctr.transform           = mtx;

            var returnedArray:Array<any> = this.getAssetByID(par_id, [away.library.AssetType.CONTAINER, away.library.AssetType.LIGHT, away.library.AssetType.MESH, away.library.AssetType.ENTITY, away.library.AssetType.SEGMENT_SET]);

            if (returnedArray[0])
            {
                var obj : away.containers.ObjectContainer3D = ( <away.containers.ObjectContainer3D> returnedArray[1] ).addChild(ctr);
                parentName = (<away.containers.ObjectContainer3D> returnedArray[1]).name;
            }
            else if (par_id > 0)
            {
                this._blocks[ blockID ].addError("Could not find a parent for this ObjectContainer3D");
            }

            // in AWD version 2.1 we read the Container properties
            if ((this._version[0] == 2) && (this._version[1] == 1))
            {
                var props:AWDProperties = this.parseProperties({1:this._matrixNrType, 2:this._matrixNrType, 3:this._matrixNrType, 4:AWDParser.UINT8});
                ctr.pivotPoint = new away.geom.Vector3D(props.get(1, 0), props.get(2, 0), props.get(3, 0));
            }
            // in other versions we do not read the Container properties
            else
            {
                this.parseProperties(null);
            }

            // the extraProperties should only be set for AWD2.1-Files, but is read for both versions
            ctr.extra = this.parseUserAttributes();

            this._pFinalizeAsset( <away.library.IAsset> ctr, name);
            this._blocks[blockID].data = ctr;

            if (this._debug)
            {
                console.log("Parsed a Container: Name = '" + name + "' | Parent-Name = " + parentName);
            }
        }

        // Block ID = 23
        private parseMeshInstance(blockID:number):void
        {
            var num_materials:number;
            var materials_parsed:number;
            var parent:away.containers.ObjectContainer3D;
            var par_id:number = this._newBlockBytes.readUnsignedInt();
            var mtx:away.geom.Matrix3D = this.parseMatrix3D();
            var name:string = this.parseVarStr();
            var parentName:string = "Root (TopLevel)";
            var data_id:number = this._newBlockBytes.readUnsignedInt();
            var geom:away.base.Geometry;
            var returnedArrayGeometry:Array<any> = this.getAssetByID(data_id, [away.library.AssetType.GEOMETRY])

            if (returnedArrayGeometry[0])
            {
                geom = <away.base.Geometry> returnedArrayGeometry[1];
            }
            else
            {
                this._blocks[blockID].addError("Could not find a Geometry for this Mesh. A empty Geometry is created!");
                geom = new away.base.Geometry();
            }

            this._blocks[blockID].geoID = data_id;
            var materials:Array<away.materials.MaterialBase> = new Array<away.materials.MaterialBase>();
            num_materials = this._newBlockBytes.readUnsignedShort();

            var materialNames:Array<string> = new Array<string>();
            materials_parsed = 0;

            var returnedArrayMaterial:Array<any>;

            while (materials_parsed < num_materials)
            {
                var mat_id:number;
                mat_id = this._newBlockBytes.readUnsignedInt();
                returnedArrayMaterial = this.getAssetByID(mat_id, [away.library.AssetType.MATERIAL])
                if ((!returnedArrayMaterial[0]) && (mat_id > 0))
                {
                    this._blocks[blockID].addError("Could not find Material Nr " + materials_parsed + " (ID = " + mat_id + " ) for this Mesh");
                }

                var m : away.materials.MaterialBase = <away.materials.MaterialBase> returnedArrayMaterial[1];

                materials.push(m);
                materialNames.push(m.name);

                materials_parsed++;
            }

            var mesh:away.entities.Mesh = new away.entities.Mesh(geom, null);
                mesh.transform = mtx;

            var returnedArrayParent:Array<any> = this.getAssetByID(par_id, [away.library.AssetType.CONTAINER, away.library.AssetType.LIGHT, away.library.AssetType.MESH, away.library.AssetType.ENTITY, away.library.AssetType.SEGMENT_SET])

            if (returnedArrayParent[0])
            {
                var objC : away.containers.ObjectContainer3D = <away.containers.ObjectContainer3D> returnedArrayParent[1];
                    objC.addChild(mesh);
                parentName = objC.name;
            }
            else if (par_id > 0)
            {
                this._blocks[blockID].addError("Could not find a parent for this Mesh");
            }

            if (materials.length >= 1 && mesh.subMeshes.length == 1)
            {
                mesh.material = materials[0];
            }
            else if (materials.length > 1)
            {
                var i:number;

                // Assign each sub-mesh in the mesh a material from the list. If more sub-meshes
                // than materials, repeat the last material for all remaining sub-meshes.
                for (i = 0; i < mesh.subMeshes.length; i++)
                {
                    mesh.subMeshes[i].material = materials[Math.min(materials.length - 1, i)];
                }
            }
            if ((this._version[0] == 2) && (this._version[1] == 1))
            {
                var props:AWDProperties = this.parseProperties({1:this._matrixNrType, 2:this._matrixNrType, 3:this._matrixNrType, 4:AWDParser.UINT8, 5:AWDParser.BOOL});
                mesh.pivotPoint = new away.geom.Vector3D(<number>props.get(1, 0), <number>props.get(2, 0), <number> props.get(3, 0));
                mesh.castsShadows = props.get(5, true);
            }
            else
            {
                this.parseProperties(null);
            }

            mesh.extra = this.parseUserAttributes();

            this._pFinalizeAsset( <away.library.IAsset> mesh, name);
            this._blocks[blockID].data = mesh;

            if (this._debug)
            {
                console.log("Parsed a Mesh: Name = '" + name + "' | Parent-Name = " + parentName + "| Geometry-Name = " + geom.name + " | SubMeshes = " + mesh.subMeshes.length + " | Mat-Names = " + materialNames.toString());
            }
        }


        //Block ID = 41
        private parseLight(blockID:number):void
        {
            var light           : away.lights.LightBase;
            var newShadowMapper : away.lights.ShadowMapperBase;

            var par_id          : number                = this._newBlockBytes.readUnsignedInt();
            var mtx             : away.geom.Matrix3D    = this.parseMatrix3D();
            var name            : string                = this.parseVarStr();
            var lightType       : number                = this._newBlockBytes.readUnsignedByte();
            var props           : AWDProperties         = this.parseProperties({1:this._propsNrType, 2:this._propsNrType, 3:AWDParser.COLOR, 4:this._propsNrType, 5:this._propsNrType, 6:AWDParser.BOOL, 7:AWDParser.COLOR, 8:this._propsNrType, 9:AWDParser.UINT8, 10:AWDParser.UINT8, 11:this._propsNrType, 12:AWDParser.UINT16, 21:this._matrixNrType, 22:this._matrixNrType, 23:this._matrixNrType});
            var shadowMapperType: number                = props.get(9, 0);
            var parentName      : string                = "Root (TopLevel)";
            var lightTypes      : Array<string>         = ["Unsupported LightType", "PointLight", "DirectionalLight"];
            var shadowMapperTypes : Array<string>       = ["No ShadowMapper", "DirectionalShadowMapper", "NearDirectionalShadowMapper", "CascadeShadowMapper", "CubeMapShadowMapper"];

            if (lightType == 1)
            {
                light = new away.lights.PointLight();

                (<away.lights.PointLight> light).radius     = props.get(1, 90000);
                (<away.lights.PointLight> light).fallOff    = props.get(2, 100000);

                if (shadowMapperType > 0)
                {
                    if (shadowMapperType == 4)
                    {
                        newShadowMapper = new away.lights.CubeMapShadowMapper();
                    }
                }

                light.transform = mtx;

            }

            if (lightType == 2)
            {

                light = new away.lights.DirectionalLight(props.get(21, 0), props.get(22, -1), props.get(23, 1));

                if (shadowMapperType > 0)
                {
                    if (shadowMapperType == 1)
                    {
                        newShadowMapper = new away.lights.DirectionalShadowMapper();
                    }

                    //if (shadowMapperType == 2)
                    //  newShadowMapper = new NearDirectionalShadowMapper(props.get(11, 0.5));
                    //if (shadowMapperType == 3)
                    //   newShadowMapper = new CascadeShadowMapper(props.get(12, 3));

                }

            }
            light.color         = props.get(3, 0xffffff);
            light.specular      = props.get(4, 1.0);
            light.diffuse       = props.get(5, 1.0);
            light.ambientColor  = props.get(7, 0xffffff);
            light.ambient       = props.get(8, 0.0);

            // if a shadowMapper has been created, adjust the depthMapSize if needed, assign to light and set castShadows to true
            if (newShadowMapper)
            {
                if (newShadowMapper instanceof away.lights.CubeMapShadowMapper )
                {
                    if (props.get(10, 1) != 1)
                    {
                        newShadowMapper.depthMapSize = this._depthSizeDic[props.get(10, 1)];
                    }
                }
                else
                {
                    if (props.get(10, 2) != 2)
                    {
                        newShadowMapper.depthMapSize = this._depthSizeDic[props.get(10, 2)];
                    }
                }

                light.shadowMapper = newShadowMapper;
                light.castsShadows = true;
            }

            if (par_id != 0)
            {

                var returnedArrayParent : Array<any> = this.getAssetByID(par_id, [away.library.AssetType.CONTAINER, away.library.AssetType.LIGHT, away.library.AssetType.MESH, away.library.AssetType.ENTITY, away.library.AssetType.SEGMENT_SET])

                if (returnedArrayParent[0])
                {
                    (<away.containers.ObjectContainer3D> returnedArrayParent[1]).addChild(light);
                    parentName = (<away.containers.ObjectContainer3D> returnedArrayParent[1]).name;
                }
                else
                {
                    this._blocks[blockID].addError("Could not find a parent for this Light");
                }
            }

            this.parseUserAttributes();

            this._pFinalizeAsset( < away.library.IAsset> light, name);

            this._blocks[blockID].data = light;

            if (this._debug)
                console.log("Parsed a Light: Name = '" + name + "' | Type = " + lightTypes[lightType] + " | Parent-Name = " + parentName + " | ShadowMapper-Type = " + shadowMapperTypes[shadowMapperType]);

        }


        //Block ID = 81
        private parseMaterial(blockID:number):void
        {
            // TODO: not used
            ////blockLength = block.len;
            var name:string;
            var type:number;
            var props:AWDProperties;
            var mat:away.materials.MaterialBase;
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
            props = this.parseProperties( { 1:AWDParser.INT32, 2:AWDParser.BADDR, 10:this._propsNrType, 11:AWDParser.BOOL, 12:this._propsNrType, 13:AWDParser.BOOL});

            methods_parsed = 0;
            while (methods_parsed < num_methods)
            {
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
                color = props.get(1, 0xcccccc);
                if (this.materialMode < 2)
                    mat = new away.materials.ColorMaterial(color, props.get(10, 1.0));
                else
                    mat = new away.materials.ColorMultiPassMaterial(color);

            }
            else if (type === 2)
            {
                var tex_addr:number = props.get(2, 0);

                returnedArray = this.getAssetByID(tex_addr, [away.library.AssetType.TEXTURE])
                if ((!returnedArray[0]) && (tex_addr > 0))
                {
                    this._blocks[blockID].addError("Could not find the DiffsueTexture (ID = " + tex_addr + " ) for this Material");
                }

                if (this.materialMode < 2)
                {
                    mat = <away.materials.MaterialBase> new away.materials.TextureMaterial( <away.textures.Texture2DBase> returnedArray[1]);

                    var txMaterial : away.materials.TextureMaterial = <away.materials.TextureMaterial> mat;

                    txMaterial.alphaBlending = props.get(11, false);
                    txMaterial.alpha = props.get(10, 1.0);
                    debugString += "Parsed a TextureMaterial(SinglePass): Name = '" + name + "' | Texture-Name = " + mat.name;
                }
                else
                {
                    mat = <away.materials.MaterialBase> new away.materials.TextureMultiPassMaterial(returnedArray[1]);
                    debugString += "Parsed a TextureMaterial(MultipAss): Name = '" + name + "' | Texture-Name = " + mat.name;
                }
            }

            mat.extra = attributes;
            if (this.materialMode < 2)
            {

                var spmb : away.materials.SinglePassMaterialBase = <away.materials.SinglePassMaterialBase> mat;
                spmb.alphaThreshold = props.get(12, 0.0);

            }
            else
            {
                var mpmb : away.materials.MultiPassMaterialBase = <away.materials.MultiPassMaterialBase> mat;
                mpmb.alphaThreshold = props.get(12, 0.0);
            }


            mat.repeat = props.get(13, false);
            this._pFinalizeAsset( <away.library.IAsset> mat, name);
            this._blocks[blockID].data = mat;

            if (this._debug)
            {
                console.log(debugString);

            }
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

                this._pAddDependency(this._cur_block_id.toString(), null, false, data, true);

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

        //blockID 255
        private parseMetaData(blockID:number):void
        {
            var props:AWDProperties = this.parseProperties({1:AWDParser.UINT32, 2:AWDParser.AWDSTRING, 3:AWDParser.AWDSTRING, 4:AWDParser.AWDSTRING, 5:AWDParser.AWDSTRING});

            if (this._debug)
            {
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
            var id:number               = this._newBlockBytes.readUnsignedByte();
            var nameSpaceString:string  = this.parseVarStr();
            if (this._debug)
                console.log("Parsed a NameSpaceBlock: ID = " + id + " | String = " + nameSpaceString);
        }

        //--Parser UTILS---------------------------------------------------------------------------

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
                var list      : Array<any>   = [];
                var num_read  : number       = 0;
                var num_elems : number       = len/elem_len;

                while (num_read < num_elems)
                {
                    list.push( read_func.apply( this._newBlockBytes ) ); // list.push(read_func());
                    num_read++;
                }

                return list;
            }
            else
            {

                var val:any = read_func.apply( this._newBlockBytes );//read_func();
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

        private parseVarStr():string
        {

            var len:number = this._newBlockBytes.readUnsignedShort();
            return this._newBlockBytes.readUTFBytes(len);
        }

        private getAssetByID(assetID:number, assetTypesToGet:Array<string>, extraTypeInfo:string = "SingleTexture"):Array<any>
        {
            var returnArray:Array<any> = new Array();
            var typeCnt:number = 0;
            if (assetID > 0)
            {
                if (this._blocks[assetID])
                {
                    if (this._blocks[assetID].data)
                    {
                        while (typeCnt < assetTypesToGet.length)
                        {

                            var iasset : away.library.IAsset = <away.library.IAsset> this._blocks[assetID].data;

                            if ( iasset.assetType == assetTypesToGet[typeCnt]) {
                                //if the right assetType was found
                                if ((assetTypesToGet[typeCnt] == away.library.AssetType.TEXTURE) && (extraTypeInfo == "CubeTexture"))
                                {
                                    if (this._blocks[assetID].data instanceof away.textures.HTMLImageElementCubeTexture )
                                    {
                                        returnArray.push(true);
                                        returnArray.push(this._blocks[assetID].data);
                                        return returnArray;
                                    }
                                }
                                if ((assetTypesToGet[typeCnt] == away.library.AssetType.TEXTURE) && (extraTypeInfo == "SingleTexture"))
                                {
                                    if (this._blocks[assetID].data instanceof away.textures.HTMLImageElementTexture )
                                    {
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
                            //if ((assetTypesToGet[typeCnt] == away.library.AssetType.GEOMETRY) && (IAsset(_blocks[assetID].data).assetType == AssetType.MESH)) {
                            if ((assetTypesToGet[typeCnt] == away.library.AssetType.GEOMETRY) && (iasset.assetType == away.library.AssetType.MESH))
                            {

                                var mesh : away.entities.Mesh = <away.entities.Mesh> this._blocks[assetID].data

                                returnArray.push(true);
                                returnArray.push( mesh.geometry );
                                return returnArray;

                            }

                            typeCnt++;
                        }
                    }
                }
            }
            // if the function has not returned anything yet, the asset is not found, or the found asset is not the right type.
            returnArray.push(false);
            returnArray.push(this.getDefaultAsset(assetTypesToGet[0], extraTypeInfo));
            return returnArray;
        }

        private getDefaultAsset(assetType:string, extraTypeInfo:string):away.library.IAsset
        {
            switch (true)
            {

                case (assetType == away.library.AssetType.TEXTURE):

                    if (extraTypeInfo == "CubeTexture")
                        return this.getDefaultCubeTexture();
                    if (extraTypeInfo == "SingleTexture")
                        return this.getDefaultTexture();
                    break;

                case (assetType == away.library.AssetType.MATERIAL):

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
                this._defaultBitmapMaterial = away.materials.DefaultMaterialManager.getDefaultMaterial();
            return  <away.library.IAsset>  this._defaultBitmapMaterial;
        }

        private getDefaultTexture():away.library.IAsset
        {

            if (!this._defaultTexture)
            {
                this._defaultTexture = away.materials.DefaultMaterialManager.getDefaultTexture();
            }

            return <away.library.IAsset> this._defaultTexture;

        }

        private getDefaultCubeTexture():away.library.IAsset
        {
            if (!this._defaultCubeTexture)
            {

                var defaultBitmap:away.display.BitmapData = away.materials.DefaultMaterialManager.createCheckeredBitmapData();//this._defaultTexture.bitmapData;

                this._defaultCubeTexture = new away.textures.BitmapCubeTexture(defaultBitmap, defaultBitmap, defaultBitmap, defaultBitmap, defaultBitmap, defaultBitmap);
                this._defaultCubeTexture.name = "defaultTexture";
            }

            return <away.library.IAsset> this._defaultCubeTexture;
        }

        private readNumber(precision:boolean = false):number
        {
            if (precision)
                return this._newBlockBytes.readDouble();
            return this._newBlockBytes.readFloat();

        }

        private parseMatrix3D():away.geom.Matrix3D
        {
            return new away.geom.Matrix3D(this.parseMatrix43RawData());
        }

        private parseMatrix32RawData():Array<number>
        {
            var i:number;
            var mtx_raw:Array<number> = new Array<number>(6);
            for (i = 0; i < 6; i++)
            {
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

            if (isNaN(mtx_raw[0]))
            {
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

        console.log ( 'this.hasOwnProperty(key.toString());' , key , fallback , this.hasOwnProperty(key.toString()) );

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

