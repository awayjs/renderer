var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetType = require("awayjs-core/lib/library/AssetType");
var URLLoaderDataFormat = require("awayjs-core/lib/net/URLLoaderDataFormat");
var URLRequest = require("awayjs-core/lib/net/URLRequest");
var ParserBase = require("awayjs-core/lib/parsers/ParserBase");
var ParserUtils = require("awayjs-core/lib/parsers/ParserUtils");
var DisplayObjectContainer = require("awayjs-display/lib/containers/DisplayObjectContainer");
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var Geometry = require("awayjs-display/lib/base/Geometry");
var Mesh = require("awayjs-display/lib/entities/Mesh");
var DefaultMaterialManager = require("awayjs-stagegl/lib/materials/utils/DefaultMaterialManager");
var SpecularBasicMethod = require("awayjs-stagegl/lib/materials/methods/SpecularBasicMethod");
var TriangleMethodMaterial = require("awayjs-stagegl/lib/materials/TriangleMethodMaterial");
var TriangleMaterialMode = require("awayjs-stagegl/lib/materials/TriangleMaterialMode");
/**
 * OBJParser provides a parser for the OBJ data type.
 */
var OBJParser = (function (_super) {
    __extends(OBJParser, _super);
    /**
     * Creates a new OBJParser object.
     * @param uri The url or id of the data or file to be parsed.
     * @param extra The holder for extra contextual data that the parser might need.
     */
    function OBJParser(scale) {
        if (scale === void 0) { scale = 1; }
        _super.call(this, URLLoaderDataFormat.TEXT);
        this._mtlLibLoaded = true;
        this._activeMaterialID = "";
        this._scale = scale;
    }
    Object.defineProperty(OBJParser.prototype, "scale", {
        /**
         * Scaling factor applied directly to vertices data
         * @param value The scaling factor.
         */
        set: function (value) {
            this._scale = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Indicates whether or not a given file extension is supported by the parser.
     * @param extension The file extension of a potential file to be parsed.
     * @return Whether or not the given file type is supported.
     */
    OBJParser.supportsType = function (extension) {
        extension = extension.toLowerCase();
        return extension == "obj";
    };
    /**
     * Tests whether a data block can be parsed by the parser.
     * @param data The data block to potentially be parsed.
     * @return Whether or not the given data is supported.
     */
    OBJParser.supportsData = function (data) {
        var content = ParserUtils.toString(data);
        var hasV = false;
        var hasF = false;
        if (content) {
            hasV = content.indexOf("\nv ") != -1;
            hasF = content.indexOf("\nf ") != -1;
        }
        return hasV && hasF;
    };
    /**
     * @inheritDoc
     */
    OBJParser.prototype._iResolveDependency = function (resourceDependency) {
        if (resourceDependency.id == 'mtl') {
            var str = ParserUtils.toString(resourceDependency.data);
            this.parseMtl(str);
        }
        else {
            var asset;
            if (resourceDependency.assets.length != 1) {
                return;
            }
            asset = resourceDependency.assets[0];
            if (asset.assetType == AssetType.TEXTURE) {
                var lm = new LoadedMaterial();
                lm.materialID = resourceDependency.id;
                lm.texture = asset;
                this._materialLoaded.push(lm);
                if (this._meshes.length > 0) {
                    this.applyMaterial(lm);
                }
            }
        }
    };
    /**
     * @inheritDoc
     */
    OBJParser.prototype._iResolveDependencyFailure = function (resourceDependency) {
        if (resourceDependency.id == "mtl") {
            this._mtlLib = false;
            this._mtlLibLoaded = false;
        }
        else {
            var lm = new LoadedMaterial();
            lm.materialID = resourceDependency.id;
            this._materialLoaded.push(lm);
        }
        if (this._meshes.length > 0)
            this.applyMaterial(lm);
    };
    /**
     * @inheritDoc
     */
    OBJParser.prototype._pProceedParsing = function () {
        var line;
        var creturn = String.fromCharCode(10);
        var trunk;
        if (!this._startedParsing) {
            this._textData = this._pGetTextData();
            // Merge linebreaks that are immediately preceeded by
            // the "escape" backward slash into single lines.
            this._textData = this._textData.replace(/\\[\r\n]+\s*/gm, ' ');
        }
        if (this._textData.indexOf(creturn) == -1)
            creturn = String.fromCharCode(13);
        if (!this._startedParsing) {
            this._startedParsing = true;
            this._vertices = new Array();
            this._vertexNormals = new Array();
            this._materialIDs = new Array();
            this._materialLoaded = new Array();
            this._meshes = new Array();
            this._uvs = new Array();
            this._stringLength = this._textData.length;
            this._charIndex = this._textData.indexOf(creturn, 0);
            this._oldIndex = 0;
            this._objects = new Array();
            this._objectIndex = 0;
        }
        while (this._charIndex < this._stringLength && this._pHasTime()) {
            this._charIndex = this._textData.indexOf(creturn, this._oldIndex);
            if (this._charIndex == -1)
                this._charIndex = this._stringLength;
            line = this._textData.substring(this._oldIndex, this._charIndex);
            line = line.split('\r').join("");
            line = line.replace("  ", " ");
            trunk = line.split(" ");
            this._oldIndex = this._charIndex + 1;
            this.parseLine(trunk);
            // If whatever was parsed on this line resulted in the
            // parsing being paused to retrieve dependencies, break
            // here and do not continue parsing until un-paused.
            if (this.parsingPaused) {
                return ParserBase.MORE_TO_PARSE;
            }
        }
        if (this._charIndex >= this._stringLength) {
            if (this._mtlLib && !this._mtlLibLoaded) {
                return ParserBase.MORE_TO_PARSE;
            }
            this.translate();
            this.applyMaterials();
            return ParserBase.PARSING_DONE;
        }
        return ParserBase.MORE_TO_PARSE;
    };
    OBJParser.prototype._pStartParsing = function (frameLimit) {
        _super.prototype._pStartParsing.call(this, frameLimit);
        //create a content object for Loaders
        this._pContent = new DisplayObjectContainer();
    };
    /**
     * Parses a single line in the OBJ file.
     */
    OBJParser.prototype.parseLine = function (trunk) {
        switch (trunk[0]) {
            case "mtllib":
                this._mtlLib = true;
                this._mtlLibLoaded = false;
                this.loadMtl(trunk[1]);
                break;
            case "g":
                this.createGroup(trunk);
                break;
            case "o":
                this.createObject(trunk);
                break;
            case "usemtl":
                if (this._mtlLib) {
                    if (!trunk[1])
                        trunk[1] = "def000";
                    this._materialIDs.push(trunk[1]);
                    this._activeMaterialID = trunk[1];
                    if (this._currentGroup)
                        this._currentGroup.materialID = this._activeMaterialID;
                }
                break;
            case "v":
                this.parseVertex(trunk);
                break;
            case "vt":
                this.parseUV(trunk);
                break;
            case "vn":
                this.parseVertexNormal(trunk);
                break;
            case "f":
                this.parseFace(trunk);
        }
    };
    /**
     * Converts the parsed data into an Away3D scenegraph structure
     */
    OBJParser.prototype.translate = function () {
        for (var objIndex = 0; objIndex < this._objects.length; ++objIndex) {
            var groups = this._objects[objIndex].groups;
            var numGroups = groups.length;
            var materialGroups;
            var numMaterialGroups;
            var geometry;
            var mesh;
            var m;
            var sm;
            var bmMaterial;
            for (var g = 0; g < numGroups; ++g) {
                geometry = new Geometry();
                materialGroups = groups[g].materialGroups;
                numMaterialGroups = materialGroups.length;
                for (m = 0; m < numMaterialGroups; ++m)
                    this.translateMaterialGroup(materialGroups[m], geometry);
                if (geometry.subGeometries.length == 0)
                    continue;
                // Finalize and force type-based name
                this._pFinalizeAsset(geometry); //, "");
                bmMaterial = new TriangleMethodMaterial(DefaultMaterialManager.getDefaultTexture());
                //check for multipass
                if (this.materialMode >= 2)
                    bmMaterial.materialMode = TriangleMaterialMode.MULTI_PASS;
                mesh = new Mesh(geometry, bmMaterial);
                if (this._objects[objIndex].name) {
                    // this is a full independent object ('o' tag in OBJ file)
                    mesh.name = this._objects[objIndex].name;
                }
                else if (groups[g].name) {
                    // this is a group so the sub groups contain the actual mesh object names ('g' tag in OBJ file)
                    mesh.name = groups[g].name;
                }
                else {
                    // No name stored. Use empty string which will force it
                    // to be overridden by finalizeAsset() to type default.
                    mesh.name = "";
                }
                this._meshes.push(mesh);
                if (groups[g].materialID != "")
                    bmMaterial.name = groups[g].materialID + "~" + mesh.name;
                else
                    bmMaterial.name = this._lastMtlID + "~" + mesh.name;
                if (mesh.subMeshes.length > 1) {
                    for (sm = 1; sm < mesh.subMeshes.length; ++sm)
                        mesh.subMeshes[sm].material = bmMaterial;
                }
                //add to the content property
                this._pContent.addChild(mesh);
                this._pFinalizeAsset(mesh);
            }
        }
    };
    /**
     * Translates an obj's material group to a subgeometry.
     * @param materialGroup The material group data to convert.
     * @param geometry The Geometry to contain the converted SubGeometry.
     */
    OBJParser.prototype.translateMaterialGroup = function (materialGroup, geometry) {
        var faces = materialGroup.faces;
        var face;
        var numFaces = faces.length;
        var numVerts;
        var sub;
        var vertices = new Array();
        var uvs = new Array();
        var normals = new Array();
        var indices = new Array();
        this._realIndices = [];
        this._vertexIndex = 0;
        var j;
        for (var i = 0; i < numFaces; ++i) {
            face = faces[i];
            numVerts = face.indexIds.length - 1;
            for (j = 1; j < numVerts; ++j) {
                this.translateVertexData(face, j, vertices, uvs, indices, normals);
                this.translateVertexData(face, 0, vertices, uvs, indices, normals);
                this.translateVertexData(face, j + 1, vertices, uvs, indices, normals);
            }
        }
        if (vertices.length > 0) {
            sub = new TriangleSubGeometry(true);
            sub.autoDeriveNormals = normals.length ? false : true;
            sub.updateIndices(indices);
            sub.updatePositions(vertices);
            sub.updateVertexNormals(normals);
            sub.updateUVs(uvs);
            geometry.addSubGeometry(sub);
        }
    };
    OBJParser.prototype.translateVertexData = function (face, vertexIndex, vertices, uvs, indices /*uint*/, normals) {
        var index;
        var vertex;
        var vertexNormal;
        var uv;
        if (!this._realIndices[face.indexIds[vertexIndex]]) {
            index = this._vertexIndex;
            this._realIndices[face.indexIds[vertexIndex]] = ++this._vertexIndex;
            vertex = this._vertices[face.vertexIndices[vertexIndex] - 1];
            vertices.push(vertex.x * this._scale, vertex.y * this._scale, vertex.z * this._scale);
            if (face.normalIndices.length > 0) {
                vertexNormal = this._vertexNormals[face.normalIndices[vertexIndex] - 1];
                normals.push(vertexNormal.x, vertexNormal.y, vertexNormal.z);
            }
            if (face.uvIndices.length > 0) {
                try {
                    uv = this._uvs[face.uvIndices[vertexIndex] - 1];
                    uvs.push(uv.u, uv.v);
                }
                catch (e) {
                    switch (vertexIndex) {
                        case 0:
                            uvs.push(0, 1);
                            break;
                        case 1:
                            uvs.push(.5, 0);
                            break;
                        case 2:
                            uvs.push(1, 1);
                    }
                }
            }
        }
        else {
            index = this._realIndices[face.indexIds[vertexIndex]] - 1;
        }
        indices.push(index);
    };
    /**
     * Creates a new object group.
     * @param trunk The data block containing the object tag and its parameters
     */
    OBJParser.prototype.createObject = function (trunk) {
        this._currentGroup = null;
        this._currentMaterialGroup = null;
        this._objects.push(this._currentObject = new ObjectGroup());
        if (trunk)
            this._currentObject.name = trunk[1];
    };
    /**
     * Creates a new group.
     * @param trunk The data block containing the group tag and its parameters
     */
    OBJParser.prototype.createGroup = function (trunk) {
        if (!this._currentObject)
            this.createObject(null);
        this._currentGroup = new Group();
        this._currentGroup.materialID = this._activeMaterialID;
        if (trunk)
            this._currentGroup.name = trunk[1];
        this._currentObject.groups.push(this._currentGroup);
        this.createMaterialGroup(null);
    };
    /**
     * Creates a new material group.
     * @param trunk The data block containing the material tag and its parameters
     */
    OBJParser.prototype.createMaterialGroup = function (trunk) {
        this._currentMaterialGroup = new MaterialGroup();
        if (trunk)
            this._currentMaterialGroup.url = trunk[1];
        this._currentGroup.materialGroups.push(this._currentMaterialGroup);
    };
    /**
     * Reads the next vertex coordinates.
     * @param trunk The data block containing the vertex tag and its parameters
     */
    OBJParser.prototype.parseVertex = function (trunk) {
        //for the very rare cases of other delimiters/charcodes seen in some obj files
        var v1, v2, v3;
        if (trunk.length > 4) {
            var nTrunk = [];
            var val;
            for (var i = 1; i < trunk.length; ++i) {
                val = parseFloat(trunk[i]);
                if (!isNaN(val))
                    nTrunk.push(val);
            }
            v1 = nTrunk[0];
            v2 = nTrunk[1];
            v3 = -nTrunk[2];
            this._vertices.push(new Vertex(v1, v2, v3));
        }
        else {
            v1 = parseFloat(trunk[1]);
            v2 = parseFloat(trunk[2]);
            v3 = -parseFloat(trunk[3]);
            this._vertices.push(new Vertex(v1, v2, v3));
        }
    };
    /**
     * Reads the next uv coordinates.
     * @param trunk The data block containing the uv tag and its parameters
     */
    OBJParser.prototype.parseUV = function (trunk) {
        if (trunk.length > 3) {
            var nTrunk = [];
            var val;
            for (var i = 1; i < trunk.length; ++i) {
                val = parseFloat(trunk[i]);
                if (!isNaN(val))
                    nTrunk.push(val);
            }
            this._uvs.push(new UV(nTrunk[0], 1 - nTrunk[1]));
        }
        else {
            this._uvs.push(new UV(parseFloat(trunk[1]), 1 - parseFloat(trunk[2])));
        }
    };
    /**
     * Reads the next vertex normal coordinates.
     * @param trunk The data block containing the vertex normal tag and its parameters
     */
    OBJParser.prototype.parseVertexNormal = function (trunk) {
        if (trunk.length > 4) {
            var nTrunk = [];
            var val;
            for (var i = 1; i < trunk.length; ++i) {
                val = parseFloat(trunk[i]);
                if (!isNaN(val))
                    nTrunk.push(val);
            }
            this._vertexNormals.push(new Vertex(nTrunk[0], nTrunk[1], -nTrunk[2]));
        }
        else {
            this._vertexNormals.push(new Vertex(parseFloat(trunk[1]), parseFloat(trunk[2]), -parseFloat(trunk[3])));
        }
    };
    /**
     * Reads the next face's indices.
     * @param trunk The data block containing the face tag and its parameters
     */
    OBJParser.prototype.parseFace = function (trunk) {
        var len = trunk.length;
        var face = new FaceData();
        if (!this._currentGroup) {
            this.createGroup(null);
        }
        var indices;
        for (var i = 1; i < len; ++i) {
            if (trunk[i] == "") {
                continue;
            }
            indices = trunk[i].split("/");
            face.vertexIndices.push(this.parseIndex(parseInt(indices[0]), this._vertices.length));
            if (indices[1] && String(indices[1]).length > 0)
                face.uvIndices.push(this.parseIndex(parseInt(indices[1]), this._uvs.length));
            if (indices[2] && String(indices[2]).length > 0)
                face.normalIndices.push(this.parseIndex(parseInt(indices[2]), this._vertexNormals.length));
            face.indexIds.push(trunk[i]);
        }
        this._currentMaterialGroup.faces.push(face);
    };
    /**
     * This is a hack around negative face coords
     */
    OBJParser.prototype.parseIndex = function (index, length) {
        if (index < 0)
            return index + length + 1;
        else
            return index;
    };
    OBJParser.prototype.parseMtl = function (data) {
        var materialDefinitions = data.split('newmtl');
        var lines;
        var trunk;
        var j;
        var basicSpecularMethod;
        var useSpecular;
        var useColor;
        var diffuseColor;
        var color;
        var specularColor;
        var specular;
        var alpha;
        var mapkd;
        for (var i = 0; i < materialDefinitions.length; ++i) {
            lines = (materialDefinitions[i].split('\r')).join("").split('\n');
            //lines = (materialDefinitions[i].split('\r') as Array).join("").split('\n');
            if (lines.length == 1)
                lines = materialDefinitions[i].split(String.fromCharCode(13));
            diffuseColor = color = specularColor = 0xFFFFFF;
            specular = 0;
            useSpecular = false;
            useColor = false;
            alpha = 1;
            mapkd = "";
            for (j = 0; j < lines.length; ++j) {
                lines[j] = lines[j].replace(/\s+$/, "");
                if (lines[j].substring(0, 1) != "#" && (j == 0 || lines[j] != "")) {
                    trunk = lines[j].split(" ");
                    if (String(trunk[0]).charCodeAt(0) == 9 || String(trunk[0]).charCodeAt(0) == 32)
                        trunk[0] = trunk[0].substring(1, trunk[0].length);
                    if (j == 0) {
                        this._lastMtlID = trunk.join("");
                        this._lastMtlID = (this._lastMtlID == "") ? "def000" : this._lastMtlID;
                    }
                    else {
                        switch (trunk[0]) {
                            case "Ka":
                                if (trunk[1] && !isNaN(Number(trunk[1])) && trunk[2] && !isNaN(Number(trunk[2])) && trunk[3] && !isNaN(Number(trunk[3])))
                                    color = trunk[1] * 255 << 16 | trunk[2] * 255 << 8 | trunk[3] * 255;
                                break;
                            case "Ks":
                                if (trunk[1] && !isNaN(Number(trunk[1])) && trunk[2] && !isNaN(Number(trunk[2])) && trunk[3] && !isNaN(Number(trunk[3]))) {
                                    specularColor = trunk[1] * 255 << 16 | trunk[2] * 255 << 8 | trunk[3] * 255;
                                    useSpecular = true;
                                }
                                break;
                            case "Ns":
                                if (trunk[1] && !isNaN(Number(trunk[1])))
                                    specular = Number(trunk[1]) * 0.001;
                                if (specular == 0)
                                    useSpecular = false;
                                break;
                            case "Kd":
                                if (trunk[1] && !isNaN(Number(trunk[1])) && trunk[2] && !isNaN(Number(trunk[2])) && trunk[3] && !isNaN(Number(trunk[3]))) {
                                    diffuseColor = trunk[1] * 255 << 16 | trunk[2] * 255 << 8 | trunk[3] * 255;
                                    useColor = true;
                                }
                                break;
                            case "tr":
                            case "d":
                                if (trunk[1] && !isNaN(Number(trunk[1])))
                                    alpha = Number(trunk[1]);
                                break;
                            case "map_Kd":
                                mapkd = this.parseMapKdString(trunk);
                                mapkd = mapkd.replace(/\\/g, "/");
                        }
                    }
                }
            }
            if (mapkd != "") {
                if (useSpecular) {
                    basicSpecularMethod = new SpecularBasicMethod();
                    basicSpecularMethod.specularColor = specularColor;
                    basicSpecularMethod.specular = specular;
                    var specularData = new SpecularData();
                    specularData.alpha = alpha;
                    specularData.basicSpecularMethod = basicSpecularMethod;
                    specularData.materialID = this._lastMtlID;
                    if (!this._materialSpecularData)
                        this._materialSpecularData = new Array();
                    this._materialSpecularData.push(specularData);
                }
                this._pAddDependency(this._lastMtlID, new URLRequest(mapkd));
            }
            else if (useColor && !isNaN(color)) {
                var lm = new LoadedMaterial();
                lm.materialID = this._lastMtlID;
                if (alpha == 0)
                    console.log("Warning: an alpha value of 0 was found in mtl color tag (Tr or d) ref:" + this._lastMtlID + ", mesh(es) using it will be invisible!");
                var cm;
                if (this.materialMode < 2) {
                    cm = new TriangleMethodMaterial(color);
                    var colorMat = cm;
                    colorMat.alpha = alpha;
                    colorMat.diffuseColor = diffuseColor;
                    colorMat.repeat = true;
                    if (useSpecular) {
                        colorMat.specularColor = specularColor;
                        colorMat.specular = specular;
                    }
                }
                else {
                    cm = new TriangleMethodMaterial(color);
                    cm.materialMode = TriangleMaterialMode.MULTI_PASS;
                    var colorMultiMat = cm;
                    colorMultiMat.diffuseColor = diffuseColor;
                    colorMultiMat.repeat = true;
                    if (useSpecular) {
                        colorMultiMat.specularColor = specularColor;
                        colorMultiMat.specular = specular;
                    }
                }
                lm.cm = cm;
                this._materialLoaded.push(lm);
                if (this._meshes.length > 0)
                    this.applyMaterial(lm);
            }
        }
        this._mtlLibLoaded = true;
    };
    OBJParser.prototype.parseMapKdString = function (trunk) {
        var url = "";
        var i;
        var breakflag;
        for (i = 1; i < trunk.length;) {
            switch (trunk[i]) {
                case "-blendu":
                case "-blendv":
                case "-cc":
                case "-clamp":
                case "-texres":
                    i += 2; //Skip ahead 1 attribute
                    break;
                case "-mm":
                    i += 3; //Skip ahead 2 attributes
                    break;
                case "-o":
                case "-s":
                case "-t":
                    i += 4; //Skip ahead 3 attributes
                    continue;
                default:
                    breakflag = true;
                    break;
            }
            if (breakflag)
                break;
        }
        for (i; i < trunk.length; i++) {
            url += trunk[i];
            url += " ";
        }
        //Remove the extraneous space and/or newline from the right side
        url = url.replace(/\s+$/, "");
        return url;
    };
    OBJParser.prototype.loadMtl = function (mtlurl) {
        // Add raw-data dependency to queue and load dependencies now,
        // which will pause the parsing in the meantime.
        this._pAddDependency('mtl', new URLRequest(mtlurl), true);
        this._pPauseAndRetrieveDependencies(); //
    };
    OBJParser.prototype.applyMaterial = function (lm) {
        var decomposeID;
        var mesh;
        var tm;
        var j;
        var specularData;
        for (var i = 0; i < this._meshes.length; ++i) {
            mesh = this._meshes[i];
            decomposeID = mesh.material.name.split("~");
            if (decomposeID[0] == lm.materialID) {
                if (lm.cm) {
                    if (mesh.material)
                        mesh.material = null;
                    mesh.material = lm.cm;
                }
                else if (lm.texture) {
                    if (this.materialMode < 2) {
                        tm = mesh.material;
                        tm.texture = lm.texture;
                        tm.color = lm.color;
                        tm.alpha = lm.alpha;
                        tm.repeat = true;
                        if (lm.specularMethod) {
                            // By setting the specularMethod property to null before assigning
                            // the actual method instance, we avoid having the properties of
                            // the new method being overridden with the settings from the old
                            // one, which is default behavior of the setter.
                            tm.specularMethod = null;
                            tm.specularMethod = lm.specularMethod;
                        }
                        else if (this._materialSpecularData) {
                            for (j = 0; j < this._materialSpecularData.length; ++j) {
                                specularData = this._materialSpecularData[j];
                                if (specularData.materialID == lm.materialID) {
                                    tm.specularMethod = null; // Prevent property overwrite (see above)
                                    tm.specularMethod = specularData.basicSpecularMethod;
                                    tm.color = specularData.color;
                                    tm.alpha = specularData.alpha;
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        tm = mesh.material;
                        tm.materialMode = TriangleMaterialMode.MULTI_PASS;
                        tm.texture = lm.texture;
                        tm.color = lm.color;
                        tm.repeat = true;
                        if (lm.specularMethod) {
                            // By setting the specularMethod property to null before assigning
                            // the actual method instance, we avoid having the properties of
                            // the new method being overridden with the settings from the old
                            // one, which is default behavior of the setter.
                            tm.specularMethod = null;
                            tm.specularMethod = lm.specularMethod;
                        }
                        else if (this._materialSpecularData) {
                            for (j = 0; j < this._materialSpecularData.length; ++j) {
                                specularData = this._materialSpecularData[j];
                                if (specularData.materialID == lm.materialID) {
                                    tm.specularMethod = null; // Prevent property overwrite (see above)
                                    tm.specularMethod = specularData.basicSpecularMethod;
                                    tm.color = specularData.color;
                                    break;
                                }
                            }
                        }
                    }
                }
                mesh.material.name = decomposeID[1] ? decomposeID[1] : decomposeID[0];
                this._meshes.splice(i, 1);
                --i;
            }
        }
        if (lm.cm || tm)
            this._pFinalizeAsset(lm.cm || tm);
    };
    OBJParser.prototype.applyMaterials = function () {
        if (this._materialLoaded.length == 0)
            return;
        for (var i = 0; i < this._materialLoaded.length; ++i)
            this.applyMaterial(this._materialLoaded[i]);
    };
    return OBJParser;
})(ParserBase);
var ObjectGroup = (function () {
    function ObjectGroup() {
        this.groups = new Array();
    }
    return ObjectGroup;
})();
var Group = (function () {
    function Group() {
        this.materialGroups = new Array();
    }
    return Group;
})();
var MaterialGroup = (function () {
    function MaterialGroup() {
        this.faces = new Array();
    }
    return MaterialGroup;
})();
var SpecularData = (function () {
    function SpecularData() {
        this.color = 0xFFFFFF;
        this.alpha = 1;
    }
    return SpecularData;
})();
var LoadedMaterial = (function () {
    function LoadedMaterial() {
        this.color = 0xFFFFFF;
        this.alpha = 1;
    }
    return LoadedMaterial;
})();
var FaceData = (function () {
    function FaceData() {
        this.vertexIndices = new Array();
        this.uvIndices = new Array();
        this.normalIndices = new Array();
        this.indexIds = new Array(); // used for real index lookups
    }
    return FaceData;
})();
/**
* Texture coordinates value object.
*/
var UV = (function () {
    /**
     * Creates a new <code>UV</code> object.
     *
     * @param    u        [optional]    The horizontal coordinate of the texture value. Defaults to 0.
     * @param    v        [optional]    The vertical coordinate of the texture value. Defaults to 0.
     */
    function UV(u, v) {
        if (u === void 0) { u = 0; }
        if (v === void 0) { v = 0; }
        this._u = u;
        this._v = v;
    }
    Object.defineProperty(UV.prototype, "v", {
        /**
         * Defines the vertical coordinate of the texture value.
         */
        get: function () {
            return this._v;
        },
        set: function (value) {
            this._v = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UV.prototype, "u", {
        /**
         * Defines the horizontal coordinate of the texture value.
         */
        get: function () {
            return this._u;
        },
        set: function (value) {
            this._u = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * returns a new UV value Object
     */
    UV.prototype.clone = function () {
        return new UV(this._u, this._v);
    };
    /**
     * returns the value object as a string for trace/debug purpose
     */
    UV.prototype.toString = function () {
        return this._u + "," + this._v;
    };
    return UV;
})();
var Vertex = (function () {
    /**
     * Creates a new <code>Vertex</code> value object.
     *
     * @param    x            [optional]    The x value. Defaults to 0.
     * @param    y            [optional]    The y value. Defaults to 0.
     * @param    z            [optional]    The z value. Defaults to 0.
     * @param    index        [optional]    The index value. Defaults is NaN.
     */
    function Vertex(x, y, z, index) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        if (index === void 0) { index = 0; }
        this._x = x;
        this._y = y;
        this._z = z;
        this._index = index;
    }
    Object.defineProperty(Vertex.prototype, "index", {
        get: function () {
            return this._index;
        },
        /**
         * To define/store the index of value object
         * @param    ind        The index
         */
        set: function (ind) {
            this._index = ind;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vertex.prototype, "x", {
        /**
         * To define/store the x value of the value object
         * @param    value        The x value
         */
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vertex.prototype, "y", {
        /**
         * To define/store the y value of the value object
         * @param    value        The y value
         */
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vertex.prototype, "z", {
        /**
         * To define/store the z value of the value object
         * @param    value        The z value
         */
        get: function () {
            return this._z;
        },
        set: function (value) {
            this._z = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * returns a new Vertex value Object
     */
    Vertex.prototype.clone = function () {
        return new Vertex(this._x, this._y, this._z);
    };
    return Vertex;
})();
module.exports = OBJParser;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXJzZXJzL29ianBhcnNlci50cyJdLCJuYW1lcyI6WyJPQkpQYXJzZXIiLCJPQkpQYXJzZXIuY29uc3RydWN0b3IiLCJPQkpQYXJzZXIuc2NhbGUiLCJPQkpQYXJzZXIuc3VwcG9ydHNUeXBlIiwiT0JKUGFyc2VyLnN1cHBvcnRzRGF0YSIsIk9CSlBhcnNlci5faVJlc29sdmVEZXBlbmRlbmN5IiwiT0JKUGFyc2VyLl9pUmVzb2x2ZURlcGVuZGVuY3lGYWlsdXJlIiwiT0JKUGFyc2VyLl9wUHJvY2VlZFBhcnNpbmciLCJPQkpQYXJzZXIuX3BTdGFydFBhcnNpbmciLCJPQkpQYXJzZXIucGFyc2VMaW5lIiwiT0JKUGFyc2VyLnRyYW5zbGF0ZSIsIk9CSlBhcnNlci50cmFuc2xhdGVNYXRlcmlhbEdyb3VwIiwiT0JKUGFyc2VyLnRyYW5zbGF0ZVZlcnRleERhdGEiLCJPQkpQYXJzZXIuY3JlYXRlT2JqZWN0IiwiT0JKUGFyc2VyLmNyZWF0ZUdyb3VwIiwiT0JKUGFyc2VyLmNyZWF0ZU1hdGVyaWFsR3JvdXAiLCJPQkpQYXJzZXIucGFyc2VWZXJ0ZXgiLCJPQkpQYXJzZXIucGFyc2VVViIsIk9CSlBhcnNlci5wYXJzZVZlcnRleE5vcm1hbCIsIk9CSlBhcnNlci5wYXJzZUZhY2UiLCJPQkpQYXJzZXIucGFyc2VJbmRleCIsIk9CSlBhcnNlci5wYXJzZU10bCIsIk9CSlBhcnNlci5wYXJzZU1hcEtkU3RyaW5nIiwiT0JKUGFyc2VyLmxvYWRNdGwiLCJPQkpQYXJzZXIuYXBwbHlNYXRlcmlhbCIsIk9CSlBhcnNlci5hcHBseU1hdGVyaWFscyIsIk9iamVjdEdyb3VwIiwiT2JqZWN0R3JvdXAuY29uc3RydWN0b3IiLCJHcm91cCIsIkdyb3VwLmNvbnN0cnVjdG9yIiwiTWF0ZXJpYWxHcm91cCIsIk1hdGVyaWFsR3JvdXAuY29uc3RydWN0b3IiLCJTcGVjdWxhckRhdGEiLCJTcGVjdWxhckRhdGEuY29uc3RydWN0b3IiLCJMb2FkZWRNYXRlcmlhbCIsIkxvYWRlZE1hdGVyaWFsLmNvbnN0cnVjdG9yIiwiRmFjZURhdGEiLCJGYWNlRGF0YS5jb25zdHJ1Y3RvciIsIlVWIiwiVVYuY29uc3RydWN0b3IiLCJVVi52IiwiVVYudSIsIlVWLmNsb25lIiwiVVYudG9TdHJpbmciLCJWZXJ0ZXgiLCJWZXJ0ZXguY29uc3RydWN0b3IiLCJWZXJ0ZXguaW5kZXgiLCJWZXJ0ZXgueCIsIlZlcnRleC55IiwiVmVydGV4LnoiLCJWZXJ0ZXguY2xvbmUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBLElBQU8sU0FBUyxXQUFnQixtQ0FBbUMsQ0FBQyxDQUFDO0FBRXJFLElBQU8sbUJBQW1CLFdBQWMseUNBQXlDLENBQUMsQ0FBQztBQUNuRixJQUFPLFVBQVUsV0FBZ0IsZ0NBQWdDLENBQUMsQ0FBQztBQUNuRSxJQUFPLFVBQVUsV0FBZ0Isb0NBQW9DLENBQUMsQ0FBQztBQUN2RSxJQUFPLFdBQVcsV0FBZ0IscUNBQXFDLENBQUMsQ0FBQztBQUl6RSxJQUFPLHNCQUFzQixXQUFhLHNEQUFzRCxDQUFDLENBQUM7QUFDbEcsSUFBTyxtQkFBbUIsV0FBYyw2Q0FBNkMsQ0FBQyxDQUFDO0FBQ3ZGLElBQU8sUUFBUSxXQUFpQixrQ0FBa0MsQ0FBQyxDQUFDO0FBQ3BFLElBQU8sSUFBSSxXQUFrQixrQ0FBa0MsQ0FBQyxDQUFDO0FBR2pFLElBQU8sc0JBQXNCLFdBQWEsMkRBQTJELENBQUMsQ0FBQztBQUN2RyxJQUFPLG1CQUFtQixXQUFjLDBEQUEwRCxDQUFDLENBQUM7QUFDcEcsSUFBTyxzQkFBc0IsV0FBYSxxREFBcUQsQ0FBQyxDQUFDO0FBQ2pHLElBQU8sb0JBQW9CLFdBQWMsbURBQW1ELENBQUMsQ0FBQztBQUU5RixBQUdBOztHQURHO0lBQ0csU0FBUztJQUFTQSxVQUFsQkEsU0FBU0EsVUFBbUJBO0lBMkJqQ0E7Ozs7T0FJR0E7SUFDSEEsU0FoQ0tBLFNBQVNBLENBZ0NGQSxLQUFnQkE7UUFBaEJDLHFCQUFnQkEsR0FBaEJBLFNBQWdCQTtRQUUz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UUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFdEZBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLElBQUlBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBO2dCQUMvQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFOUVBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLElBQUlBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBO2dCQUMvQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFNUZBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQzlCQSxDQUFDQTtRQUVEQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0lBQzdDQSxDQUFDQTtJQUVEbkI7O09BRUdBO0lBQ0tBLDhCQUFVQSxHQUFsQkEsVUFBbUJBLEtBQVlB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QUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTt3QkFDL0VBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO29CQUVuREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ1pBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO3dCQUNqQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsSUFBSUEsRUFBRUEsQ0FBQ0EsR0FBRUEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7b0JBRXZFQSxDQUFDQTtvQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0JBRVBBLE1BQU1BLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUVsQkEsS0FBS0EsSUFBSUE7Z0NBQ1JBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29DQUN4SEEsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsR0FBR0EsSUFBSUEsRUFBRUEsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsR0FBR0EsQ0FBQ0E7Z0NBQy9EQSxLQUFLQSxDQUFDQTs0QkFFUEEsS0FBS0EsSUFBSUE7Z0NBQ1JBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29DQUMxSEEsYUFBYUEsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsR0FBR0EsSUFBSUEsRUFBRUEsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsR0FBR0EsQ0FBQ0E7b0NBQ3RFQSxXQUFXQSxHQUFHQSxJQUFJQSxDQUFDQTtnQ0FDcEJBLENBQUNBO2dDQUNEQSxLQUFLQSxDQUFDQTs0QkFFUEEsS0FBS0EsSUFBSUE7Z0NBQ1JBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29DQUN4Q0EsUUFBUUEsR0FBR0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsS0FBS0EsQ0FBQ0E7Z0NBQ25DQSxFQUFFQSxDQUFDQSxDQUFDQSxRQUFRQSxJQUFJQSxDQUFDQSxDQUFDQTtvQ0FDakJBLFdBQVdBLEdBQUdBLEtBQUtBLENBQUNBO2dDQUNyQkEsS0FBS0EsQ0FBQ0E7NEJBRVBBLEtBQUtBLElBQUlBO2dDQUNSQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQ0FDMUhBLFlBQVlBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLEdBQUNBLEdBQUdBLElBQUlBLEVBQUVBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLEdBQUNBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLEdBQUNBLEdBQUdBLENBQUNBO29DQUNyRUEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0E7Z0NBQ2pCQSxDQUFD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QUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3ZCQSxXQUFXQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUU1Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRXJDQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDWEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7d0JBQ2pCQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQTtvQkFDdEJBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBO2dCQUV2QkEsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO29CQUN2QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQzNCQSxFQUFFQSxHQUE2QkEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7d0JBRTdDQSxFQUFFQSxDQUFDQSxPQUFPQSxHQUFHQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQTt3QkFDeEJBLEVBQUVBLENBQUNBLEtBQUtBLEdBQUdBLEVBQUVBLENBQUNBLEtBQUtBLENBQUNBO3dCQUNwQkEsRUFBRUEsQ0FBQ0EsS0FBS0EsR0FBR0EsRUFBRUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7d0JBQ3BCQSxFQUFFQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQTt3QkFFakJBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBLENBQUNB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WUE7WUFFeEJJLElBQUlBLENBQUNBLEVBQUVBLEdBQUdBLEtBQUtBLENBQUNBO1FBQ2pCQSxDQUFDQTs7O09BTEFKO0lBV0RBLHNCQUFXQSxxQkFBQ0E7UUFKWkE7OztXQUdHQTthQUNIQTtZQUVDSyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQTtRQUNoQkEsQ0FBQ0E7YUFFREwsVUFBYUEsS0FBWUE7WUFFeEJLLElBQUlBLENBQUNBLEVBQUVBLEdBQUdBLEtBQUtBLENBQUNBO1FBQ2pCQSxDQUFDQTs7O09BTEFMO0lBT0RBOztPQUVHQTtJQUNJQSxzQkFBS0EsR0FBWkE7UUFFQ00sTUFBTUEsQ0FBQ0EsSUFBSUEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsRUFBRUEsSUFBSUEsQ0FBQ0EsRUFBRUEsRUFBRUEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7SUFDOUNBLENBQUNBO0lBQ0ZOLGFBQUNBO0FBQURBLENBdEZBLEFBc0ZDQSxJQUFBO0FBcE1ELGlCQUFTLFNBQVMsQ0FBQyIsImZpbGUiOiJwYXJzZXJzL09CSlBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWF0cml4M0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL01hdHJpeDNEXCIpO1xuaW1wb3J0IFF1YXRlcm5pb25cdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9RdWF0ZXJuaW9uXCIpO1xuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiKTtcbmltcG9ydCBBc3NldFR5cGVcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9Bc3NldFR5cGVcIik7XG5pbXBvcnQgSUFzc2V0XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9JQXNzZXRcIik7XG5pbXBvcnQgVVJMTG9hZGVyRGF0YUZvcm1hdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxMb2FkZXJEYXRhRm9ybWF0XCIpO1xuaW1wb3J0IFVSTFJlcXVlc3RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTFJlcXVlc3RcIik7XG5pbXBvcnQgUGFyc2VyQmFzZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wYXJzZXJzL1BhcnNlckJhc2VcIik7XG5pbXBvcnQgUGFyc2VyVXRpbHNcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcGFyc2Vycy9QYXJzZXJVdGlsc1wiKTtcbmltcG9ydCBSZXNvdXJjZURlcGVuZGVuY3lcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wYXJzZXJzL1Jlc291cmNlRGVwZW5kZW5jeVwiKTtcbmltcG9ydCBUZXh0dXJlMkRCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9UZXh0dXJlMkRCYXNlXCIpO1xuXG5pbXBvcnQgRGlzcGxheU9iamVjdENvbnRhaW5lclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9jb250YWluZXJzL0Rpc3BsYXlPYmplY3RDb250YWluZXJcIik7XG5pbXBvcnQgVHJpYW5nbGVTdWJHZW9tZXRyeVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvVHJpYW5nbGVTdWJHZW9tZXRyeVwiKTtcbmltcG9ydCBHZW9tZXRyeVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvR2VvbWV0cnlcIik7XG5pbXBvcnQgTWVzaFx0XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvTWVzaFwiKTtcbmltcG9ydCBNYXRlcmlhbEJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL01hdGVyaWFsQmFzZVwiKTtcblxuaW1wb3J0IERlZmF1bHRNYXRlcmlhbE1hbmFnZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL3V0aWxzL0RlZmF1bHRNYXRlcmlhbE1hbmFnZXJcIik7XG5pbXBvcnQgU3BlY3VsYXJCYXNpY01ldGhvZFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9tZXRob2RzL1NwZWN1bGFyQmFzaWNNZXRob2RcIik7XG5pbXBvcnQgVHJpYW5nbGVNZXRob2RNYXRlcmlhbFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvVHJpYW5nbGVNZXRob2RNYXRlcmlhbFwiKTtcbmltcG9ydCBUcmlhbmdsZU1hdGVyaWFsTW9kZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9UcmlhbmdsZU1hdGVyaWFsTW9kZVwiKTtcblxuLyoqXG4gKiBPQkpQYXJzZXIgcHJvdmlkZXMgYSBwYXJzZXIgZm9yIHRoZSBPQkogZGF0YSB0eXBlLlxuICovXG5jbGFzcyBPQkpQYXJzZXIgZXh0ZW5kcyBQYXJzZXJCYXNlXG57XG5cdHByaXZhdGUgX3RleHREYXRhOnN0cmluZztcblx0cHJpdmF0ZSBfc3RhcnRlZFBhcnNpbmc6Ym9vbGVhbjtcblx0cHJpdmF0ZSBfY2hhckluZGV4Om51bWJlcjtcblx0cHJpdmF0ZSBfb2xkSW5kZXg6bnVtYmVyO1xuXHRwcml2YXRlIF9zdHJpbmdMZW5ndGg6bnVtYmVyO1xuXHRwcml2YXRlIF9jdXJyZW50T2JqZWN0Ok9iamVjdEdyb3VwO1xuXHRwcml2YXRlIF9jdXJyZW50R3JvdXA6R3JvdXA7XG5cdHByaXZhdGUgX2N1cnJlbnRNYXRlcmlhbEdyb3VwOk1hdGVyaWFsR3JvdXA7XG5cdHByaXZhdGUgX29iamVjdHM6QXJyYXk8T2JqZWN0R3JvdXA+O1xuXHRwcml2YXRlIF9tYXRlcmlhbElEczpzdHJpbmdbXTtcblx0cHJpdmF0ZSBfbWF0ZXJpYWxMb2FkZWQ6QXJyYXk8TG9hZGVkTWF0ZXJpYWw+O1xuXHRwcml2YXRlIF9tYXRlcmlhbFNwZWN1bGFyRGF0YTpBcnJheTxTcGVjdWxhckRhdGE+O1xuXHRwcml2YXRlIF9tZXNoZXM6QXJyYXk8TWVzaD47XG5cdHByaXZhdGUgX2xhc3RNdGxJRDpzdHJpbmc7XG5cdHByaXZhdGUgX29iamVjdEluZGV4Om51bWJlcjtcblx0cHJpdmF0ZSBfcmVhbEluZGljZXM7XG5cdHByaXZhdGUgX3ZlcnRleEluZGV4Om51bWJlcjtcblx0cHJpdmF0ZSBfdmVydGljZXM6QXJyYXk8VmVydGV4Pjtcblx0cHJpdmF0ZSBfdmVydGV4Tm9ybWFsczpBcnJheTxWZXJ0ZXg+O1xuXHRwcml2YXRlIF91dnM6QXJyYXk8VVY+O1xuXHRwcml2YXRlIF9zY2FsZTpudW1iZXI7XG5cdHByaXZhdGUgX210bExpYjpib29sZWFuO1xuXHRwcml2YXRlIF9tdGxMaWJMb2FkZWQ6Ym9vbGVhbiA9IHRydWU7XG5cdHByaXZhdGUgX2FjdGl2ZU1hdGVyaWFsSUQ6c3RyaW5nID0gXCJcIjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBPQkpQYXJzZXIgb2JqZWN0LlxuXHQgKiBAcGFyYW0gdXJpIFRoZSB1cmwgb3IgaWQgb2YgdGhlIGRhdGEgb3IgZmlsZSB0byBiZSBwYXJzZWQuXG5cdCAqIEBwYXJhbSBleHRyYSBUaGUgaG9sZGVyIGZvciBleHRyYSBjb250ZXh0dWFsIGRhdGEgdGhhdCB0aGUgcGFyc2VyIG1pZ2h0IG5lZWQuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihzY2FsZTpudW1iZXIgPSAxKVxuXHR7XG5cdFx0c3VwZXIoVVJMTG9hZGVyRGF0YUZvcm1hdC5URVhUKTtcblx0XHR0aGlzLl9zY2FsZSA9IHNjYWxlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNjYWxpbmcgZmFjdG9yIGFwcGxpZWQgZGlyZWN0bHkgdG8gdmVydGljZXMgZGF0YVxuXHQgKiBAcGFyYW0gdmFsdWUgVGhlIHNjYWxpbmcgZmFjdG9yLlxuXHQgKi9cblx0cHVibGljIHNldCBzY2FsZSh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9zY2FsZSA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBhIGdpdmVuIGZpbGUgZXh0ZW5zaW9uIGlzIHN1cHBvcnRlZCBieSB0aGUgcGFyc2VyLlxuXHQgKiBAcGFyYW0gZXh0ZW5zaW9uIFRoZSBmaWxlIGV4dGVuc2lvbiBvZiBhIHBvdGVudGlhbCBmaWxlIHRvIGJlIHBhcnNlZC5cblx0ICogQHJldHVybiBXaGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gZmlsZSB0eXBlIGlzIHN1cHBvcnRlZC5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgc3VwcG9ydHNUeXBlKGV4dGVuc2lvbjpzdHJpbmcpOmJvb2xlYW5cblx0e1xuXHRcdGV4dGVuc2lvbiA9IGV4dGVuc2lvbi50b0xvd2VyQ2FzZSgpO1xuXHRcdHJldHVybiBleHRlbnNpb24gPT0gXCJvYmpcIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBUZXN0cyB3aGV0aGVyIGEgZGF0YSBibG9jayBjYW4gYmUgcGFyc2VkIGJ5IHRoZSBwYXJzZXIuXG5cdCAqIEBwYXJhbSBkYXRhIFRoZSBkYXRhIGJsb2NrIHRvIHBvdGVudGlhbGx5IGJlIHBhcnNlZC5cblx0ICogQHJldHVybiBXaGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gZGF0YSBpcyBzdXBwb3J0ZWQuXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIHN1cHBvcnRzRGF0YShkYXRhOmFueSk6Ym9vbGVhblxuXHR7XG5cdFx0dmFyIGNvbnRlbnQ6c3RyaW5nID0gUGFyc2VyVXRpbHMudG9TdHJpbmcoZGF0YSk7XG5cdFx0dmFyIGhhc1Y6Ym9vbGVhbiA9IGZhbHNlO1xuXHRcdHZhciBoYXNGOmJvb2xlYW4gPSBmYWxzZTtcblxuXHRcdGlmIChjb250ZW50KSB7XG5cdFx0XHRoYXNWID0gY29udGVudC5pbmRleE9mKFwiXFxudiBcIikgIT0gLTE7XG5cdFx0XHRoYXNGID0gY29udGVudC5pbmRleE9mKFwiXFxuZiBcIikgIT0gLTE7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGhhc1YgJiYgaGFzRjtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pUmVzb2x2ZURlcGVuZGVuY3kocmVzb3VyY2VEZXBlbmRlbmN5OlJlc291cmNlRGVwZW5kZW5jeSlcblx0e1xuXHRcdGlmIChyZXNvdXJjZURlcGVuZGVuY3kuaWQgPT0gJ210bCcpIHtcblx0XHRcdHZhciBzdHI6c3RyaW5nID0gUGFyc2VyVXRpbHMudG9TdHJpbmcocmVzb3VyY2VEZXBlbmRlbmN5LmRhdGEpO1xuXHRcdFx0dGhpcy5wYXJzZU10bChzdHIpO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBhc3NldDpJQXNzZXQ7XG5cblx0XHRcdGlmIChyZXNvdXJjZURlcGVuZGVuY3kuYXNzZXRzLmxlbmd0aCAhPSAxKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0YXNzZXQgPSByZXNvdXJjZURlcGVuZGVuY3kuYXNzZXRzWzBdO1xuXG5cdFx0XHRpZiAoYXNzZXQuYXNzZXRUeXBlID09IEFzc2V0VHlwZS5URVhUVVJFKSB7XG5cblx0XHRcdFx0dmFyIGxtOkxvYWRlZE1hdGVyaWFsID0gbmV3IExvYWRlZE1hdGVyaWFsKCk7XG5cdFx0XHRcdGxtLm1hdGVyaWFsSUQgPSByZXNvdXJjZURlcGVuZGVuY3kuaWQ7XG5cdFx0XHRcdGxtLnRleHR1cmUgPSA8VGV4dHVyZTJEQmFzZT4gYXNzZXQ7XG5cblx0XHRcdFx0dGhpcy5fbWF0ZXJpYWxMb2FkZWQucHVzaChsbSk7XG5cblx0XHRcdFx0aWYgKHRoaXMuX21lc2hlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0dGhpcy5hcHBseU1hdGVyaWFsKGxtKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pUmVzb2x2ZURlcGVuZGVuY3lGYWlsdXJlKHJlc291cmNlRGVwZW5kZW5jeTpSZXNvdXJjZURlcGVuZGVuY3kpXG5cdHtcblx0XHRpZiAocmVzb3VyY2VEZXBlbmRlbmN5LmlkID09IFwibXRsXCIpIHtcblx0XHRcdHRoaXMuX210bExpYiA9IGZhbHNlO1xuXHRcdFx0dGhpcy5fbXRsTGliTG9hZGVkID0gZmFsc2U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBsbTpMb2FkZWRNYXRlcmlhbCA9IG5ldyBMb2FkZWRNYXRlcmlhbCgpO1xuXHRcdFx0bG0ubWF0ZXJpYWxJRCA9IHJlc291cmNlRGVwZW5kZW5jeS5pZDtcblx0XHRcdHRoaXMuX21hdGVyaWFsTG9hZGVkLnB1c2gobG0pO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9tZXNoZXMubGVuZ3RoID4gMClcblx0XHRcdHRoaXMuYXBwbHlNYXRlcmlhbChsbSk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfcFByb2NlZWRQYXJzaW5nKCk6Ym9vbGVhblxuXHR7XG5cdFx0dmFyIGxpbmU6c3RyaW5nO1xuXHRcdHZhciBjcmV0dXJuOnN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMTApO1xuXHRcdHZhciB0cnVuaztcblxuXHRcdGlmICghdGhpcy5fc3RhcnRlZFBhcnNpbmcpIHtcblx0XHRcdHRoaXMuX3RleHREYXRhID0gdGhpcy5fcEdldFRleHREYXRhKCk7XG5cdFx0XHQvLyBNZXJnZSBsaW5lYnJlYWtzIHRoYXQgYXJlIGltbWVkaWF0ZWx5IHByZWNlZWRlZCBieVxuXHRcdFx0Ly8gdGhlIFwiZXNjYXBlXCIgYmFja3dhcmQgc2xhc2ggaW50byBzaW5nbGUgbGluZXMuXG5cdFx0XHR0aGlzLl90ZXh0RGF0YSA9IHRoaXMuX3RleHREYXRhLnJlcGxhY2UoL1xcXFxbXFxyXFxuXStcXHMqL2dtLCAnICcpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl90ZXh0RGF0YS5pbmRleE9mKGNyZXR1cm4pID09IC0xKVxuXHRcdFx0Y3JldHVybiA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMTMpO1xuXG5cdFx0aWYgKCF0aGlzLl9zdGFydGVkUGFyc2luZykge1xuXHRcdFx0dGhpcy5fc3RhcnRlZFBhcnNpbmcgPSB0cnVlO1xuXHRcdFx0dGhpcy5fdmVydGljZXMgPSBuZXcgQXJyYXk8VmVydGV4PigpO1xuXHRcdFx0dGhpcy5fdmVydGV4Tm9ybWFscyA9IG5ldyBBcnJheTxWZXJ0ZXg+KCk7XG5cdFx0XHR0aGlzLl9tYXRlcmlhbElEcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cdFx0XHR0aGlzLl9tYXRlcmlhbExvYWRlZCA9IG5ldyBBcnJheTxMb2FkZWRNYXRlcmlhbD4oKTtcblx0XHRcdHRoaXMuX21lc2hlcyA9IG5ldyBBcnJheTxNZXNoPigpO1xuXHRcdFx0dGhpcy5fdXZzID0gbmV3IEFycmF5PFVWPigpO1xuXHRcdFx0dGhpcy5fc3RyaW5nTGVuZ3RoID0gdGhpcy5fdGV4dERhdGEubGVuZ3RoO1xuXHRcdFx0dGhpcy5fY2hhckluZGV4ID0gdGhpcy5fdGV4dERhdGEuaW5kZXhPZihjcmV0dXJuLCAwKTtcblx0XHRcdHRoaXMuX29sZEluZGV4ID0gMDtcblx0XHRcdHRoaXMuX29iamVjdHMgPSBuZXcgQXJyYXk8T2JqZWN0R3JvdXA+KCk7XG5cdFx0XHR0aGlzLl9vYmplY3RJbmRleCA9IDA7XG5cdFx0fVxuXG5cdFx0d2hpbGUgKHRoaXMuX2NoYXJJbmRleCA8IHRoaXMuX3N0cmluZ0xlbmd0aCAmJiB0aGlzLl9wSGFzVGltZSgpKSB7XG5cdFx0XHR0aGlzLl9jaGFySW5kZXggPSB0aGlzLl90ZXh0RGF0YS5pbmRleE9mKGNyZXR1cm4sIHRoaXMuX29sZEluZGV4KTtcblxuXHRcdFx0aWYgKHRoaXMuX2NoYXJJbmRleCA9PSAtMSlcblx0XHRcdFx0dGhpcy5fY2hhckluZGV4ID0gdGhpcy5fc3RyaW5nTGVuZ3RoO1xuXG5cdFx0XHRsaW5lID0gdGhpcy5fdGV4dERhdGEuc3Vic3RyaW5nKHRoaXMuX29sZEluZGV4LCB0aGlzLl9jaGFySW5kZXgpO1xuXHRcdFx0bGluZSA9IGxpbmUuc3BsaXQoJ1xccicpLmpvaW4oXCJcIik7XG5cdFx0XHRsaW5lID0gbGluZS5yZXBsYWNlKFwiICBcIiwgXCIgXCIpO1xuXHRcdFx0dHJ1bmsgPSBsaW5lLnNwbGl0KFwiIFwiKTtcblx0XHRcdHRoaXMuX29sZEluZGV4ID0gdGhpcy5fY2hhckluZGV4ICsgMTtcblx0XHRcdHRoaXMucGFyc2VMaW5lKHRydW5rKTtcblxuXHRcdFx0Ly8gSWYgd2hhdGV2ZXIgd2FzIHBhcnNlZCBvbiB0aGlzIGxpbmUgcmVzdWx0ZWQgaW4gdGhlXG5cdFx0XHQvLyBwYXJzaW5nIGJlaW5nIHBhdXNlZCB0byByZXRyaWV2ZSBkZXBlbmRlbmNpZXMsIGJyZWFrXG5cdFx0XHQvLyBoZXJlIGFuZCBkbyBub3QgY29udGludWUgcGFyc2luZyB1bnRpbCB1bi1wYXVzZWQuXG5cdFx0XHRpZiAodGhpcy5wYXJzaW5nUGF1c2VkKSB7XG5cdFx0XHRcdHJldHVybiBQYXJzZXJCYXNlLk1PUkVfVE9fUEFSU0U7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRpZiAodGhpcy5fY2hhckluZGV4ID49IHRoaXMuX3N0cmluZ0xlbmd0aCkge1xuXG5cdFx0XHRpZiAodGhpcy5fbXRsTGliICYmICF0aGlzLl9tdGxMaWJMb2FkZWQpIHtcblx0XHRcdFx0cmV0dXJuIFBhcnNlckJhc2UuTU9SRV9UT19QQVJTRTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy50cmFuc2xhdGUoKTtcblx0XHRcdHRoaXMuYXBwbHlNYXRlcmlhbHMoKTtcblxuXHRcdFx0cmV0dXJuIFBhcnNlckJhc2UuUEFSU0lOR19ET05FO1xuXHRcdH1cblxuXHRcdHJldHVybiBQYXJzZXJCYXNlLk1PUkVfVE9fUEFSU0U7XG5cdH1cblxuXHRwdWJsaWMgX3BTdGFydFBhcnNpbmcoZnJhbWVMaW1pdDpudW1iZXIpXG5cdHtcblx0XHRzdXBlci5fcFN0YXJ0UGFyc2luZyhmcmFtZUxpbWl0KTtcblxuXHRcdC8vY3JlYXRlIGEgY29udGVudCBvYmplY3QgZm9yIExvYWRlcnNcblx0XHR0aGlzLl9wQ29udGVudCA9IG5ldyBEaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cdH1cblxuXHQvKipcblx0ICogUGFyc2VzIGEgc2luZ2xlIGxpbmUgaW4gdGhlIE9CSiBmaWxlLlxuXHQgKi9cblx0cHJpdmF0ZSBwYXJzZUxpbmUodHJ1bmspXG5cdHtcblx0XHRzd2l0Y2ggKHRydW5rWzBdKSB7XG5cblx0XHRcdGNhc2UgXCJtdGxsaWJcIjpcblxuXHRcdFx0XHR0aGlzLl9tdGxMaWIgPSB0cnVlO1xuXHRcdFx0XHR0aGlzLl9tdGxMaWJMb2FkZWQgPSBmYWxzZTtcblx0XHRcdFx0dGhpcy5sb2FkTXRsKHRydW5rWzFdKTtcblxuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcImdcIjpcblxuXHRcdFx0XHR0aGlzLmNyZWF0ZUdyb3VwKHRydW5rKTtcblxuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcIm9cIjpcblxuXHRcdFx0XHR0aGlzLmNyZWF0ZU9iamVjdCh0cnVuayk7XG5cblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJ1c2VtdGxcIjpcblxuXHRcdFx0XHRpZiAodGhpcy5fbXRsTGliKSB7XG5cblx0XHRcdFx0XHRpZiAoIXRydW5rWzFdKVxuXHRcdFx0XHRcdFx0dHJ1bmtbMV0gPSBcImRlZjAwMFwiO1xuXG5cdFx0XHRcdFx0dGhpcy5fbWF0ZXJpYWxJRHMucHVzaCh0cnVua1sxXSk7XG5cdFx0XHRcdFx0dGhpcy5fYWN0aXZlTWF0ZXJpYWxJRCA9IHRydW5rWzFdO1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMuX2N1cnJlbnRHcm91cClcblx0XHRcdFx0XHRcdHRoaXMuX2N1cnJlbnRHcm91cC5tYXRlcmlhbElEID0gdGhpcy5fYWN0aXZlTWF0ZXJpYWxJRDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwidlwiOlxuXG5cdFx0XHRcdHRoaXMucGFyc2VWZXJ0ZXgodHJ1bmspO1xuXG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwidnRcIjpcblxuXHRcdFx0XHR0aGlzLnBhcnNlVVYodHJ1bmspO1xuXG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwidm5cIjpcblxuXHRcdFx0XHR0aGlzLnBhcnNlVmVydGV4Tm9ybWFsKHRydW5rKTtcblxuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcImZcIjpcblxuXHRcdFx0XHR0aGlzLnBhcnNlRmFjZSh0cnVuayk7XG5cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgdGhlIHBhcnNlZCBkYXRhIGludG8gYW4gQXdheTNEIHNjZW5lZ3JhcGggc3RydWN0dXJlXG5cdCAqL1xuXHRwcml2YXRlIHRyYW5zbGF0ZSgpXG5cdHtcblx0XHRmb3IgKHZhciBvYmpJbmRleDpudW1iZXIgPSAwOyBvYmpJbmRleCA8IHRoaXMuX29iamVjdHMubGVuZ3RoOyArK29iakluZGV4KSB7XG5cdFx0XHR2YXIgZ3JvdXBzOkFycmF5PEdyb3VwPiA9IHRoaXMuX29iamVjdHNbb2JqSW5kZXhdLmdyb3Vwcztcblx0XHRcdHZhciBudW1Hcm91cHM6bnVtYmVyID0gZ3JvdXBzLmxlbmd0aDtcblx0XHRcdHZhciBtYXRlcmlhbEdyb3VwczpBcnJheTxNYXRlcmlhbEdyb3VwPjtcblx0XHRcdHZhciBudW1NYXRlcmlhbEdyb3VwczpudW1iZXI7XG5cdFx0XHR2YXIgZ2VvbWV0cnk6R2VvbWV0cnk7XG5cdFx0XHR2YXIgbWVzaDpNZXNoO1xuXG5cdFx0XHR2YXIgbTpudW1iZXI7XG5cdFx0XHR2YXIgc206bnVtYmVyO1xuXHRcdFx0dmFyIGJtTWF0ZXJpYWw6VHJpYW5nbGVNZXRob2RNYXRlcmlhbDtcblxuXHRcdFx0Zm9yICh2YXIgZzpudW1iZXIgPSAwOyBnIDwgbnVtR3JvdXBzOyArK2cpIHtcblx0XHRcdFx0Z2VvbWV0cnkgPSBuZXcgR2VvbWV0cnkoKTtcblx0XHRcdFx0bWF0ZXJpYWxHcm91cHMgPSBncm91cHNbZ10ubWF0ZXJpYWxHcm91cHM7XG5cdFx0XHRcdG51bU1hdGVyaWFsR3JvdXBzID0gbWF0ZXJpYWxHcm91cHMubGVuZ3RoO1xuXG5cdFx0XHRcdGZvciAobSA9IDA7IG0gPCBudW1NYXRlcmlhbEdyb3VwczsgKyttKVxuXHRcdFx0XHRcdHRoaXMudHJhbnNsYXRlTWF0ZXJpYWxHcm91cChtYXRlcmlhbEdyb3Vwc1ttXSwgZ2VvbWV0cnkpO1xuXG5cdFx0XHRcdGlmIChnZW9tZXRyeS5zdWJHZW9tZXRyaWVzLmxlbmd0aCA9PSAwKVxuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXG5cdFx0XHRcdC8vIEZpbmFsaXplIGFuZCBmb3JjZSB0eXBlLWJhc2VkIG5hbWVcblx0XHRcdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQoPElBc3NldD4gZ2VvbWV0cnkpOy8vLCBcIlwiKTtcblxuXHRcdFx0XHRibU1hdGVyaWFsID0gbmV3IFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwoRGVmYXVsdE1hdGVyaWFsTWFuYWdlci5nZXREZWZhdWx0VGV4dHVyZSgpKTtcblxuXHRcdFx0XHQvL2NoZWNrIGZvciBtdWx0aXBhc3Ncblx0XHRcdFx0aWYgKHRoaXMubWF0ZXJpYWxNb2RlID49IDIpXG5cdFx0XHRcdFx0Ym1NYXRlcmlhbC5tYXRlcmlhbE1vZGUgPSBUcmlhbmdsZU1hdGVyaWFsTW9kZS5NVUxUSV9QQVNTO1xuXG5cdFx0XHRcdG1lc2ggPSBuZXcgTWVzaChnZW9tZXRyeSwgYm1NYXRlcmlhbCk7XG5cblx0XHRcdFx0aWYgKHRoaXMuX29iamVjdHNbb2JqSW5kZXhdLm5hbWUpIHtcblx0XHRcdFx0XHQvLyB0aGlzIGlzIGEgZnVsbCBpbmRlcGVuZGVudCBvYmplY3QgKCdvJyB0YWcgaW4gT0JKIGZpbGUpXG5cdFx0XHRcdFx0bWVzaC5uYW1lID0gdGhpcy5fb2JqZWN0c1tvYmpJbmRleF0ubmFtZTtcblxuXHRcdFx0XHR9IGVsc2UgaWYgKGdyb3Vwc1tnXS5uYW1lKSB7XG5cblx0XHRcdFx0XHQvLyB0aGlzIGlzIGEgZ3JvdXAgc28gdGhlIHN1YiBncm91cHMgY29udGFpbiB0aGUgYWN0dWFsIG1lc2ggb2JqZWN0IG5hbWVzICgnZycgdGFnIGluIE9CSiBmaWxlKVxuXHRcdFx0XHRcdG1lc2gubmFtZSA9IGdyb3Vwc1tnXS5uYW1lO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gTm8gbmFtZSBzdG9yZWQuIFVzZSBlbXB0eSBzdHJpbmcgd2hpY2ggd2lsbCBmb3JjZSBpdFxuXHRcdFx0XHRcdC8vIHRvIGJlIG92ZXJyaWRkZW4gYnkgZmluYWxpemVBc3NldCgpIHRvIHR5cGUgZGVmYXVsdC5cblx0XHRcdFx0XHRtZXNoLm5hbWUgPSBcIlwiO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5fbWVzaGVzLnB1c2gobWVzaCk7XG5cblx0XHRcdFx0aWYgKGdyb3Vwc1tnXS5tYXRlcmlhbElEICE9IFwiXCIpXG5cdFx0XHRcdFx0Ym1NYXRlcmlhbC5uYW1lID0gZ3JvdXBzW2ddLm1hdGVyaWFsSUQgKyBcIn5cIiArIG1lc2gubmFtZTsgZWxzZVxuXHRcdFx0XHRcdGJtTWF0ZXJpYWwubmFtZSA9IHRoaXMuX2xhc3RNdGxJRCArIFwiflwiICsgbWVzaC5uYW1lO1xuXG5cdFx0XHRcdGlmIChtZXNoLnN1Yk1lc2hlcy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0Zm9yIChzbSA9IDE7IHNtIDwgbWVzaC5zdWJNZXNoZXMubGVuZ3RoOyArK3NtKVxuXHRcdFx0XHRcdFx0bWVzaC5zdWJNZXNoZXNbc21dLm1hdGVyaWFsID0gYm1NYXRlcmlhbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vYWRkIHRvIHRoZSBjb250ZW50IHByb3BlcnR5XG5cdFx0XHRcdCg8RGlzcGxheU9iamVjdENvbnRhaW5lcj4gdGhpcy5fcENvbnRlbnQpLmFkZENoaWxkKG1lc2gpO1xuXG5cdFx0XHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KDxJQXNzZXQ+IG1lc2gpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUcmFuc2xhdGVzIGFuIG9iaidzIG1hdGVyaWFsIGdyb3VwIHRvIGEgc3ViZ2VvbWV0cnkuXG5cdCAqIEBwYXJhbSBtYXRlcmlhbEdyb3VwIFRoZSBtYXRlcmlhbCBncm91cCBkYXRhIHRvIGNvbnZlcnQuXG5cdCAqIEBwYXJhbSBnZW9tZXRyeSBUaGUgR2VvbWV0cnkgdG8gY29udGFpbiB0aGUgY29udmVydGVkIFN1Ykdlb21ldHJ5LlxuXHQgKi9cblx0cHJpdmF0ZSB0cmFuc2xhdGVNYXRlcmlhbEdyb3VwKG1hdGVyaWFsR3JvdXA6TWF0ZXJpYWxHcm91cCwgZ2VvbWV0cnk6R2VvbWV0cnkpXG5cdHtcblx0XHR2YXIgZmFjZXM6QXJyYXk8RmFjZURhdGE+ID0gbWF0ZXJpYWxHcm91cC5mYWNlcztcblx0XHR2YXIgZmFjZTpGYWNlRGF0YTtcblx0XHR2YXIgbnVtRmFjZXM6bnVtYmVyID0gZmFjZXMubGVuZ3RoO1xuXHRcdHZhciBudW1WZXJ0czpudW1iZXI7XG5cdFx0dmFyIHN1YjpUcmlhbmdsZVN1Ykdlb21ldHJ5O1xuXG5cdFx0dmFyIHZlcnRpY2VzOkFycmF5PG51bWJlcj4gPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuXHRcdHZhciB1dnM6QXJyYXk8bnVtYmVyPiA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cdFx0dmFyIG5vcm1hbHM6QXJyYXk8bnVtYmVyPiA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cdFx0dmFyIGluZGljZXM6QXJyYXk8bnVtYmVyPiAvKnVpbnQqLyA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cblx0XHR0aGlzLl9yZWFsSW5kaWNlcyA9IFtdO1xuXHRcdHRoaXMuX3ZlcnRleEluZGV4ID0gMDtcblxuXHRcdHZhciBqOm51bWJlcjtcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBudW1GYWNlczsgKytpKSB7XG5cblx0XHRcdGZhY2UgPSBmYWNlc1tpXTtcblx0XHRcdG51bVZlcnRzID0gZmFjZS5pbmRleElkcy5sZW5ndGggLSAxO1xuXG5cdFx0XHRmb3IgKGogPSAxOyBqIDwgbnVtVmVydHM7ICsraikge1xuXG5cdFx0XHRcdHRoaXMudHJhbnNsYXRlVmVydGV4RGF0YShmYWNlLCBqLCB2ZXJ0aWNlcywgdXZzLCBpbmRpY2VzLCBub3JtYWxzKTtcblx0XHRcdFx0dGhpcy50cmFuc2xhdGVWZXJ0ZXhEYXRhKGZhY2UsIDAsIHZlcnRpY2VzLCB1dnMsIGluZGljZXMsIG5vcm1hbHMpO1xuXHRcdFx0XHR0aGlzLnRyYW5zbGF0ZVZlcnRleERhdGEoZmFjZSwgaiArIDEsIHZlcnRpY2VzLCB1dnMsIGluZGljZXMsIG5vcm1hbHMpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAodmVydGljZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0c3ViID0gbmV3IFRyaWFuZ2xlU3ViR2VvbWV0cnkodHJ1ZSk7XG5cdFx0XHRzdWIuYXV0b0Rlcml2ZU5vcm1hbHMgPSBub3JtYWxzLmxlbmd0aD8gZmFsc2UgOiB0cnVlO1xuXHRcdFx0c3ViLnVwZGF0ZUluZGljZXMoaW5kaWNlcyk7XG5cdFx0XHRzdWIudXBkYXRlUG9zaXRpb25zKHZlcnRpY2VzKTtcblx0XHRcdHN1Yi51cGRhdGVWZXJ0ZXhOb3JtYWxzKG5vcm1hbHMpO1xuXHRcdFx0c3ViLnVwZGF0ZVVWcyh1dnMpO1xuXG5cdFx0XHRnZW9tZXRyeS5hZGRTdWJHZW9tZXRyeShzdWIpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgdHJhbnNsYXRlVmVydGV4RGF0YShmYWNlOkZhY2VEYXRhLCB2ZXJ0ZXhJbmRleDpudW1iZXIsIHZlcnRpY2VzOkFycmF5PG51bWJlcj4sIHV2czpBcnJheTxudW1iZXI+LCBpbmRpY2VzOkFycmF5PG51bWJlcj4gLyp1aW50Ki8sIG5vcm1hbHM6QXJyYXk8bnVtYmVyPilcblx0e1xuXHRcdHZhciBpbmRleDpudW1iZXI7XG5cdFx0dmFyIHZlcnRleDpWZXJ0ZXg7XG5cdFx0dmFyIHZlcnRleE5vcm1hbDpWZXJ0ZXg7XG5cdFx0dmFyIHV2OlVWO1xuXG5cdFx0aWYgKCF0aGlzLl9yZWFsSW5kaWNlc1tmYWNlLmluZGV4SWRzW3ZlcnRleEluZGV4XV0pIHtcblxuXHRcdFx0aW5kZXggPSB0aGlzLl92ZXJ0ZXhJbmRleDtcblx0XHRcdHRoaXMuX3JlYWxJbmRpY2VzW2ZhY2UuaW5kZXhJZHNbdmVydGV4SW5kZXhdXSA9ICsrdGhpcy5fdmVydGV4SW5kZXg7XG5cdFx0XHR2ZXJ0ZXggPSB0aGlzLl92ZXJ0aWNlc1tmYWNlLnZlcnRleEluZGljZXNbdmVydGV4SW5kZXhdIC0gMV07XG5cdFx0XHR2ZXJ0aWNlcy5wdXNoKHZlcnRleC54KnRoaXMuX3NjYWxlLCB2ZXJ0ZXgueSp0aGlzLl9zY2FsZSwgdmVydGV4LnoqdGhpcy5fc2NhbGUpO1xuXG5cdFx0XHRpZiAoZmFjZS5ub3JtYWxJbmRpY2VzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0dmVydGV4Tm9ybWFsID0gdGhpcy5fdmVydGV4Tm9ybWFsc1tmYWNlLm5vcm1hbEluZGljZXNbdmVydGV4SW5kZXhdIC0gMV07XG5cdFx0XHRcdG5vcm1hbHMucHVzaCh2ZXJ0ZXhOb3JtYWwueCwgdmVydGV4Tm9ybWFsLnksIHZlcnRleE5vcm1hbC56KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGZhY2UudXZJbmRpY2VzLmxlbmd0aCA+IDApIHtcblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHV2ID0gdGhpcy5fdXZzW2ZhY2UudXZJbmRpY2VzW3ZlcnRleEluZGV4XSAtIDFdO1xuXHRcdFx0XHRcdHV2cy5wdXNoKHV2LnUsIHV2LnYpO1xuXG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcblxuXHRcdFx0XHRcdHN3aXRjaCAodmVydGV4SW5kZXgpIHtcblx0XHRcdFx0XHRcdGNhc2UgMDpcblx0XHRcdFx0XHRcdFx0dXZzLnB1c2goMCwgMSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdFx0XHR1dnMucHVzaCguNSwgMCk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHRcdFx0XHR1dnMucHVzaCgxLCAxKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0fSBlbHNlIHtcblx0XHRcdGluZGV4ID0gdGhpcy5fcmVhbEluZGljZXNbZmFjZS5pbmRleElkc1t2ZXJ0ZXhJbmRleF1dIC0gMTtcblx0XHR9XG5cblx0XHRpbmRpY2VzLnB1c2goaW5kZXgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgb2JqZWN0IGdyb3VwLlxuXHQgKiBAcGFyYW0gdHJ1bmsgVGhlIGRhdGEgYmxvY2sgY29udGFpbmluZyB0aGUgb2JqZWN0IHRhZyBhbmQgaXRzIHBhcmFtZXRlcnNcblx0ICovXG5cdHByaXZhdGUgY3JlYXRlT2JqZWN0KHRydW5rKVxuXHR7XG5cdFx0dGhpcy5fY3VycmVudEdyb3VwID0gbnVsbDtcblx0XHR0aGlzLl9jdXJyZW50TWF0ZXJpYWxHcm91cCA9IG51bGw7XG5cdFx0dGhpcy5fb2JqZWN0cy5wdXNoKHRoaXMuX2N1cnJlbnRPYmplY3QgPSBuZXcgT2JqZWN0R3JvdXAoKSk7XG5cblx0XHRpZiAodHJ1bmspXG5cdFx0XHR0aGlzLl9jdXJyZW50T2JqZWN0Lm5hbWUgPSB0cnVua1sxXTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IGdyb3VwLlxuXHQgKiBAcGFyYW0gdHJ1bmsgVGhlIGRhdGEgYmxvY2sgY29udGFpbmluZyB0aGUgZ3JvdXAgdGFnIGFuZCBpdHMgcGFyYW1ldGVyc1xuXHQgKi9cblx0cHJpdmF0ZSBjcmVhdGVHcm91cCh0cnVuaylcblx0e1xuXHRcdGlmICghdGhpcy5fY3VycmVudE9iamVjdClcblx0XHRcdHRoaXMuY3JlYXRlT2JqZWN0KG51bGwpO1xuXHRcdHRoaXMuX2N1cnJlbnRHcm91cCA9IG5ldyBHcm91cCgpO1xuXG5cdFx0dGhpcy5fY3VycmVudEdyb3VwLm1hdGVyaWFsSUQgPSB0aGlzLl9hY3RpdmVNYXRlcmlhbElEO1xuXG5cdFx0aWYgKHRydW5rKVxuXHRcdFx0dGhpcy5fY3VycmVudEdyb3VwLm5hbWUgPSB0cnVua1sxXTtcblx0XHR0aGlzLl9jdXJyZW50T2JqZWN0Lmdyb3Vwcy5wdXNoKHRoaXMuX2N1cnJlbnRHcm91cCk7XG5cblx0XHR0aGlzLmNyZWF0ZU1hdGVyaWFsR3JvdXAobnVsbCk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBtYXRlcmlhbCBncm91cC5cblx0ICogQHBhcmFtIHRydW5rIFRoZSBkYXRhIGJsb2NrIGNvbnRhaW5pbmcgdGhlIG1hdGVyaWFsIHRhZyBhbmQgaXRzIHBhcmFtZXRlcnNcblx0ICovXG5cdHByaXZhdGUgY3JlYXRlTWF0ZXJpYWxHcm91cCh0cnVuaylcblx0e1xuXHRcdHRoaXMuX2N1cnJlbnRNYXRlcmlhbEdyb3VwID0gbmV3IE1hdGVyaWFsR3JvdXAoKTtcblx0XHRpZiAodHJ1bmspXG5cdFx0XHR0aGlzLl9jdXJyZW50TWF0ZXJpYWxHcm91cC51cmwgPSB0cnVua1sxXTtcblx0XHR0aGlzLl9jdXJyZW50R3JvdXAubWF0ZXJpYWxHcm91cHMucHVzaCh0aGlzLl9jdXJyZW50TWF0ZXJpYWxHcm91cCk7XG5cdH1cblxuXHQvKipcblx0ICogUmVhZHMgdGhlIG5leHQgdmVydGV4IGNvb3JkaW5hdGVzLlxuXHQgKiBAcGFyYW0gdHJ1bmsgVGhlIGRhdGEgYmxvY2sgY29udGFpbmluZyB0aGUgdmVydGV4IHRhZyBhbmQgaXRzIHBhcmFtZXRlcnNcblx0ICovXG5cdHByaXZhdGUgcGFyc2VWZXJ0ZXgodHJ1bmspXG5cdHtcblx0XHQvL2ZvciB0aGUgdmVyeSByYXJlIGNhc2VzIG9mIG90aGVyIGRlbGltaXRlcnMvY2hhcmNvZGVzIHNlZW4gaW4gc29tZSBvYmogZmlsZXNcblxuXHRcdHZhciB2MTpudW1iZXIsIHYyOm51bWJlciAsIHYzOm51bWJlcjtcblx0XHRpZiAodHJ1bmsubGVuZ3RoID4gNCkge1xuXHRcdFx0dmFyIG5UcnVuayA9IFtdO1xuXHRcdFx0dmFyIHZhbDpudW1iZXI7XG5cblx0XHRcdGZvciAodmFyIGk6bnVtYmVyID0gMTsgaSA8IHRydW5rLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdHZhbCA9IHBhcnNlRmxvYXQodHJ1bmtbaV0pO1xuXHRcdFx0XHRpZiAoIWlzTmFOKHZhbCkpXG5cdFx0XHRcdFx0blRydW5rLnB1c2godmFsKTtcblx0XHRcdH1cblxuXHRcdFx0djEgPSA8bnVtYmVyPiBuVHJ1bmtbMF07XG5cdFx0XHR2MiA9IDxudW1iZXI+IG5UcnVua1sxXTtcblx0XHRcdHYzID0gPG51bWJlcj4gLW5UcnVua1syXTtcblx0XHRcdHRoaXMuX3ZlcnRpY2VzLnB1c2gobmV3IFZlcnRleCh2MSwgdjIsIHYzKSk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0djEgPSA8bnVtYmVyPiBwYXJzZUZsb2F0KHRydW5rWzFdKTtcblx0XHRcdHYyID0gPG51bWJlcj4gcGFyc2VGbG9hdCh0cnVua1syXSk7XG5cdFx0XHR2MyA9IDxudW1iZXI+IC1wYXJzZUZsb2F0KHRydW5rWzNdKTtcblxuXHRcdFx0dGhpcy5fdmVydGljZXMucHVzaChuZXcgVmVydGV4KHYxLCB2MiwgdjMpKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZWFkcyB0aGUgbmV4dCB1diBjb29yZGluYXRlcy5cblx0ICogQHBhcmFtIHRydW5rIFRoZSBkYXRhIGJsb2NrIGNvbnRhaW5pbmcgdGhlIHV2IHRhZyBhbmQgaXRzIHBhcmFtZXRlcnNcblx0ICovXG5cdHByaXZhdGUgcGFyc2VVVih0cnVuaylcblx0e1xuXHRcdGlmICh0cnVuay5sZW5ndGggPiAzKSB7XG5cdFx0XHR2YXIgblRydW5rID0gW107XG5cdFx0XHR2YXIgdmFsOm51bWJlcjtcblx0XHRcdGZvciAodmFyIGk6bnVtYmVyID0gMTsgaSA8IHRydW5rLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdHZhbCA9IHBhcnNlRmxvYXQodHJ1bmtbaV0pO1xuXHRcdFx0XHRpZiAoIWlzTmFOKHZhbCkpXG5cdFx0XHRcdFx0blRydW5rLnB1c2godmFsKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3V2cy5wdXNoKG5ldyBVVihuVHJ1bmtbMF0sIDEgLSBuVHJ1bmtbMV0pKTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl91dnMucHVzaChuZXcgVVYocGFyc2VGbG9hdCh0cnVua1sxXSksIDEgLSBwYXJzZUZsb2F0KHRydW5rWzJdKSkpO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFJlYWRzIHRoZSBuZXh0IHZlcnRleCBub3JtYWwgY29vcmRpbmF0ZXMuXG5cdCAqIEBwYXJhbSB0cnVuayBUaGUgZGF0YSBibG9jayBjb250YWluaW5nIHRoZSB2ZXJ0ZXggbm9ybWFsIHRhZyBhbmQgaXRzIHBhcmFtZXRlcnNcblx0ICovXG5cdHByaXZhdGUgcGFyc2VWZXJ0ZXhOb3JtYWwodHJ1bmspXG5cdHtcblx0XHRpZiAodHJ1bmsubGVuZ3RoID4gNCkge1xuXHRcdFx0dmFyIG5UcnVuayA9IFtdO1xuXHRcdFx0dmFyIHZhbDpudW1iZXI7XG5cdFx0XHRmb3IgKHZhciBpOm51bWJlciA9IDE7IGkgPCB0cnVuay5sZW5ndGg7ICsraSkge1xuXHRcdFx0XHR2YWwgPSBwYXJzZUZsb2F0KHRydW5rW2ldKTtcblx0XHRcdFx0aWYgKCFpc05hTih2YWwpKVxuXHRcdFx0XHRcdG5UcnVuay5wdXNoKHZhbCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl92ZXJ0ZXhOb3JtYWxzLnB1c2gobmV3IFZlcnRleChuVHJ1bmtbMF0sIG5UcnVua1sxXSwgLW5UcnVua1syXSkpO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX3ZlcnRleE5vcm1hbHMucHVzaChuZXcgVmVydGV4KHBhcnNlRmxvYXQodHJ1bmtbMV0pLCBwYXJzZUZsb2F0KHRydW5rWzJdKSwgLXBhcnNlRmxvYXQodHJ1bmtbM10pKSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFJlYWRzIHRoZSBuZXh0IGZhY2UncyBpbmRpY2VzLlxuXHQgKiBAcGFyYW0gdHJ1bmsgVGhlIGRhdGEgYmxvY2sgY29udGFpbmluZyB0aGUgZmFjZSB0YWcgYW5kIGl0cyBwYXJhbWV0ZXJzXG5cdCAqL1xuXHRwcml2YXRlIHBhcnNlRmFjZSh0cnVuaylcblx0e1xuXHRcdHZhciBsZW46bnVtYmVyID0gdHJ1bmsubGVuZ3RoO1xuXHRcdHZhciBmYWNlOkZhY2VEYXRhID0gbmV3IEZhY2VEYXRhKCk7XG5cblx0XHRpZiAoIXRoaXMuX2N1cnJlbnRHcm91cCkge1xuXHRcdFx0dGhpcy5jcmVhdGVHcm91cChudWxsKTtcblx0XHR9XG5cblx0XHR2YXIgaW5kaWNlcztcblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDE7IGkgPCBsZW47ICsraSkge1xuXG5cdFx0XHRpZiAodHJ1bmtbaV0gPT0gXCJcIikge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0aW5kaWNlcyA9IHRydW5rW2ldLnNwbGl0KFwiL1wiKTtcblx0XHRcdGZhY2UudmVydGV4SW5kaWNlcy5wdXNoKHRoaXMucGFyc2VJbmRleChwYXJzZUludChpbmRpY2VzWzBdKSwgdGhpcy5fdmVydGljZXMubGVuZ3RoKSk7XG5cblx0XHRcdGlmIChpbmRpY2VzWzFdICYmIFN0cmluZyhpbmRpY2VzWzFdKS5sZW5ndGggPiAwKVxuXHRcdFx0XHRmYWNlLnV2SW5kaWNlcy5wdXNoKHRoaXMucGFyc2VJbmRleChwYXJzZUludChpbmRpY2VzWzFdKSwgdGhpcy5fdXZzLmxlbmd0aCkpO1xuXG5cdFx0XHRpZiAoaW5kaWNlc1syXSAmJiBTdHJpbmcoaW5kaWNlc1syXSkubGVuZ3RoID4gMClcblx0XHRcdFx0ZmFjZS5ub3JtYWxJbmRpY2VzLnB1c2godGhpcy5wYXJzZUluZGV4KHBhcnNlSW50KGluZGljZXNbMl0pLCB0aGlzLl92ZXJ0ZXhOb3JtYWxzLmxlbmd0aCkpO1xuXG5cdFx0XHRmYWNlLmluZGV4SWRzLnB1c2godHJ1bmtbaV0pO1xuXHRcdH1cblxuXHRcdHRoaXMuX2N1cnJlbnRNYXRlcmlhbEdyb3VwLmZhY2VzLnB1c2goZmFjZSk7XG5cdH1cblxuXHQvKipcblx0ICogVGhpcyBpcyBhIGhhY2sgYXJvdW5kIG5lZ2F0aXZlIGZhY2UgY29vcmRzXG5cdCAqL1xuXHRwcml2YXRlIHBhcnNlSW5kZXgoaW5kZXg6bnVtYmVyLCBsZW5ndGg6bnVtYmVyKTpudW1iZXJcblx0e1xuXHRcdGlmIChpbmRleCA8IDApXG5cdFx0XHRyZXR1cm4gaW5kZXggKyBsZW5ndGggKyAxOyBlbHNlXG5cdFx0XHRyZXR1cm4gaW5kZXg7XG5cdH1cblxuXHRwcml2YXRlIHBhcnNlTXRsKGRhdGE6c3RyaW5nKVxuXHR7XG5cdFx0dmFyIG1hdGVyaWFsRGVmaW5pdGlvbnMgPSBkYXRhLnNwbGl0KCduZXdtdGwnKTtcblx0XHR2YXIgbGluZXM7XG5cdFx0dmFyIHRydW5rO1xuXHRcdHZhciBqOm51bWJlcjtcblxuXHRcdHZhciBiYXNpY1NwZWN1bGFyTWV0aG9kOlNwZWN1bGFyQmFzaWNNZXRob2Q7XG5cdFx0dmFyIHVzZVNwZWN1bGFyOmJvb2xlYW47XG5cdFx0dmFyIHVzZUNvbG9yOmJvb2xlYW47XG5cdFx0dmFyIGRpZmZ1c2VDb2xvcjpudW1iZXI7XG5cdFx0dmFyIGNvbG9yOm51bWJlcjtcblx0XHR2YXIgc3BlY3VsYXJDb2xvcjpudW1iZXI7XG5cdFx0dmFyIHNwZWN1bGFyOm51bWJlcjtcblx0XHR2YXIgYWxwaGE6bnVtYmVyO1xuXHRcdHZhciBtYXBrZDpzdHJpbmc7XG5cblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCBtYXRlcmlhbERlZmluaXRpb25zLmxlbmd0aDsgKytpKSB7XG5cblxuXHRcdFx0bGluZXMgPSAobWF0ZXJpYWxEZWZpbml0aW9uc1tpXS5zcGxpdCgnXFxyJykpLmpvaW4oXCJcIikuc3BsaXQoJ1xcbicpO1xuXHRcdFx0Ly9saW5lcyA9IChtYXRlcmlhbERlZmluaXRpb25zW2ldLnNwbGl0KCdcXHInKSBhcyBBcnJheSkuam9pbihcIlwiKS5zcGxpdCgnXFxuJyk7XG5cblx0XHRcdGlmIChsaW5lcy5sZW5ndGggPT0gMSlcblx0XHRcdFx0bGluZXMgPSBtYXRlcmlhbERlZmluaXRpb25zW2ldLnNwbGl0KFN0cmluZy5mcm9tQ2hhckNvZGUoMTMpKTtcblxuXHRcdFx0ZGlmZnVzZUNvbG9yID0gY29sb3IgPSBzcGVjdWxhckNvbG9yID0gMHhGRkZGRkY7XG5cdFx0XHRzcGVjdWxhciA9IDA7XG5cdFx0XHR1c2VTcGVjdWxhciA9IGZhbHNlO1xuXHRcdFx0dXNlQ29sb3IgPSBmYWxzZTtcblx0XHRcdGFscGhhID0gMTtcblx0XHRcdG1hcGtkID0gXCJcIjtcblxuXHRcdFx0Zm9yIChqID0gMDsgaiA8IGxpbmVzLmxlbmd0aDsgKytqKSB7XG5cblx0XHRcdFx0bGluZXNbal0gPSBsaW5lc1tqXS5yZXBsYWNlKC9cXHMrJC8sIFwiXCIpO1xuXG5cdFx0XHRcdGlmIChsaW5lc1tqXS5zdWJzdHJpbmcoMCwgMSkgIT0gXCIjXCIgJiYgKGogPT0gMCB8fCBsaW5lc1tqXSAhPSBcIlwiKSkge1xuXHRcdFx0XHRcdHRydW5rID0gbGluZXNbal0uc3BsaXQoXCIgXCIpO1xuXG5cdFx0XHRcdFx0aWYgKFN0cmluZyh0cnVua1swXSkuY2hhckNvZGVBdCgwKSA9PSA5IHx8IFN0cmluZyh0cnVua1swXSkuY2hhckNvZGVBdCgwKSA9PSAzMilcblx0XHRcdFx0XHRcdHRydW5rWzBdID0gdHJ1bmtbMF0uc3Vic3RyaW5nKDEsIHRydW5rWzBdLmxlbmd0aCk7XG5cblx0XHRcdFx0XHRpZiAoaiA9PSAwKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9sYXN0TXRsSUQgPSB0cnVuay5qb2luKFwiXCIpO1xuXHRcdFx0XHRcdFx0dGhpcy5fbGFzdE10bElEID0gKHRoaXMuX2xhc3RNdGxJRCA9PSBcIlwiKT8gXCJkZWYwMDBcIiA6IHRoaXMuX2xhc3RNdGxJRDtcblxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0XHRcdHN3aXRjaCAodHJ1bmtbMF0pIHtcblxuXHRcdFx0XHRcdFx0XHRjYXNlIFwiS2FcIjpcblx0XHRcdFx0XHRcdFx0XHRpZiAodHJ1bmtbMV0gJiYgIWlzTmFOKE51bWJlcih0cnVua1sxXSkpICYmIHRydW5rWzJdICYmICFpc05hTihOdW1iZXIodHJ1bmtbMl0pKSAmJiB0cnVua1szXSAmJiAhaXNOYU4oTnVtYmVyKHRydW5rWzNdKSkpXG5cdFx0XHRcdFx0XHRcdFx0XHRjb2xvciA9IHRydW5rWzFdKjI1NSA8PCAxNiB8IHRydW5rWzJdKjI1NSA8PCA4IHwgdHJ1bmtbM10qMjU1O1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgXCJLc1wiOlxuXHRcdFx0XHRcdFx0XHRcdGlmICh0cnVua1sxXSAmJiAhaXNOYU4oTnVtYmVyKHRydW5rWzFdKSkgJiYgdHJ1bmtbMl0gJiYgIWlzTmFOKE51bWJlcih0cnVua1syXSkpICYmIHRydW5rWzNdICYmICFpc05hTihOdW1iZXIodHJ1bmtbM10pKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0c3BlY3VsYXJDb2xvciA9IHRydW5rWzFdKjI1NSA8PCAxNiB8IHRydW5rWzJdKjI1NSA8PCA4IHwgdHJ1bmtbM10qMjU1O1xuXHRcdFx0XHRcdFx0XHRcdFx0dXNlU3BlY3VsYXIgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlIFwiTnNcIjpcblx0XHRcdFx0XHRcdFx0XHRpZiAodHJ1bmtbMV0gJiYgIWlzTmFOKE51bWJlcih0cnVua1sxXSkpKVxuXHRcdFx0XHRcdFx0XHRcdFx0c3BlY3VsYXIgPSBOdW1iZXIodHJ1bmtbMV0pKjAuMDAxO1xuXHRcdFx0XHRcdFx0XHRcdGlmIChzcGVjdWxhciA9PSAwKVxuXHRcdFx0XHRcdFx0XHRcdFx0dXNlU3BlY3VsYXIgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlIFwiS2RcIjpcblx0XHRcdFx0XHRcdFx0XHRpZiAodHJ1bmtbMV0gJiYgIWlzTmFOKE51bWJlcih0cnVua1sxXSkpICYmIHRydW5rWzJdICYmICFpc05hTihOdW1iZXIodHJ1bmtbMl0pKSAmJiB0cnVua1szXSAmJiAhaXNOYU4oTnVtYmVyKHRydW5rWzNdKSkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdGRpZmZ1c2VDb2xvciA9IHRydW5rWzFdKjI1NSA8PCAxNiB8IHRydW5rWzJdKjI1NSA8PCA4IHwgdHJ1bmtbM10qMjU1O1xuXHRcdFx0XHRcdFx0XHRcdFx0dXNlQ29sb3IgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdFx0XHRjYXNlIFwidHJcIjpcblx0XHRcdFx0XHRcdFx0Y2FzZSBcImRcIjpcblx0XHRcdFx0XHRcdFx0XHRpZiAodHJ1bmtbMV0gJiYgIWlzTmFOKE51bWJlcih0cnVua1sxXSkpKVxuXHRcdFx0XHRcdFx0XHRcdFx0YWxwaGEgPSBOdW1iZXIodHJ1bmtbMV0pO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgXCJtYXBfS2RcIjpcblx0XHRcdFx0XHRcdFx0XHRtYXBrZCA9IHRoaXMucGFyc2VNYXBLZFN0cmluZyh0cnVuayk7XG5cdFx0XHRcdFx0XHRcdFx0bWFwa2QgPSBtYXBrZC5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKG1hcGtkICE9IFwiXCIpIHtcblxuXHRcdFx0XHRpZiAodXNlU3BlY3VsYXIpIHtcblxuXHRcdFx0XHRcdGJhc2ljU3BlY3VsYXJNZXRob2QgPSBuZXcgU3BlY3VsYXJCYXNpY01ldGhvZCgpO1xuXHRcdFx0XHRcdGJhc2ljU3BlY3VsYXJNZXRob2Quc3BlY3VsYXJDb2xvciA9IHNwZWN1bGFyQ29sb3I7XG5cdFx0XHRcdFx0YmFzaWNTcGVjdWxhck1ldGhvZC5zcGVjdWxhciA9IHNwZWN1bGFyO1xuXG5cdFx0XHRcdFx0dmFyIHNwZWN1bGFyRGF0YTpTcGVjdWxhckRhdGEgPSBuZXcgU3BlY3VsYXJEYXRhKCk7XG5cdFx0XHRcdFx0c3BlY3VsYXJEYXRhLmFscGhhID0gYWxwaGE7XG5cdFx0XHRcdFx0c3BlY3VsYXJEYXRhLmJhc2ljU3BlY3VsYXJNZXRob2QgPSBiYXNpY1NwZWN1bGFyTWV0aG9kO1xuXHRcdFx0XHRcdHNwZWN1bGFyRGF0YS5tYXRlcmlhbElEID0gdGhpcy5fbGFzdE10bElEO1xuXG5cdFx0XHRcdFx0aWYgKCF0aGlzLl9tYXRlcmlhbFNwZWN1bGFyRGF0YSlcblx0XHRcdFx0XHRcdHRoaXMuX21hdGVyaWFsU3BlY3VsYXJEYXRhID0gbmV3IEFycmF5PFNwZWN1bGFyRGF0YT4oKTtcblxuXHRcdFx0XHRcdHRoaXMuX21hdGVyaWFsU3BlY3VsYXJEYXRhLnB1c2goc3BlY3VsYXJEYXRhKTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5fcEFkZERlcGVuZGVuY3kodGhpcy5fbGFzdE10bElELCBuZXcgVVJMUmVxdWVzdChtYXBrZCkpO1xuXG5cdFx0XHR9IGVsc2UgaWYgKHVzZUNvbG9yICYmICFpc05hTihjb2xvcikpIHtcblxuXHRcdFx0XHR2YXIgbG06TG9hZGVkTWF0ZXJpYWwgPSBuZXcgTG9hZGVkTWF0ZXJpYWwoKTtcblx0XHRcdFx0bG0ubWF0ZXJpYWxJRCA9IHRoaXMuX2xhc3RNdGxJRDtcblxuXHRcdFx0XHRpZiAoYWxwaGEgPT0gMClcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIldhcm5pbmc6IGFuIGFscGhhIHZhbHVlIG9mIDAgd2FzIGZvdW5kIGluIG10bCBjb2xvciB0YWcgKFRyIG9yIGQpIHJlZjpcIiArIHRoaXMuX2xhc3RNdGxJRCArIFwiLCBtZXNoKGVzKSB1c2luZyBpdCB3aWxsIGJlIGludmlzaWJsZSFcIik7XG5cblx0XHRcdFx0dmFyIGNtOlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWw7XG5cblx0XHRcdFx0aWYgKHRoaXMubWF0ZXJpYWxNb2RlIDwgMikge1xuXHRcdFx0XHRcdGNtID0gbmV3IFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwoY29sb3IpO1xuXG5cdFx0XHRcdFx0dmFyIGNvbG9yTWF0OlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwgPSA8VHJpYW5nbGVNZXRob2RNYXRlcmlhbD4gY207XG5cblx0XHRcdFx0XHRjb2xvck1hdC5hbHBoYSA9IGFscGhhO1xuXHRcdFx0XHRcdGNvbG9yTWF0LmRpZmZ1c2VDb2xvciA9IGRpZmZ1c2VDb2xvcjtcblx0XHRcdFx0XHRjb2xvck1hdC5yZXBlYXQgPSB0cnVlO1xuXG5cdFx0XHRcdFx0aWYgKHVzZVNwZWN1bGFyKSB7XG5cdFx0XHRcdFx0XHRjb2xvck1hdC5zcGVjdWxhckNvbG9yID0gc3BlY3VsYXJDb2xvcjtcblx0XHRcdFx0XHRcdGNvbG9yTWF0LnNwZWN1bGFyID0gc3BlY3VsYXI7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y20gPSBuZXcgVHJpYW5nbGVNZXRob2RNYXRlcmlhbChjb2xvcik7XG5cdFx0XHRcdFx0Y20ubWF0ZXJpYWxNb2RlID0gVHJpYW5nbGVNYXRlcmlhbE1vZGUuTVVMVElfUEFTUztcblxuXHRcdFx0XHRcdHZhciBjb2xvck11bHRpTWF0OlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwgPSA8VHJpYW5nbGVNZXRob2RNYXRlcmlhbD4gY207XG5cblxuXHRcdFx0XHRcdGNvbG9yTXVsdGlNYXQuZGlmZnVzZUNvbG9yID0gZGlmZnVzZUNvbG9yO1xuXHRcdFx0XHRcdGNvbG9yTXVsdGlNYXQucmVwZWF0ID0gdHJ1ZTtcblxuXHRcdFx0XHRcdGlmICh1c2VTcGVjdWxhcikge1xuXHRcdFx0XHRcdFx0Y29sb3JNdWx0aU1hdC5zcGVjdWxhckNvbG9yID0gc3BlY3VsYXJDb2xvcjtcblx0XHRcdFx0XHRcdGNvbG9yTXVsdGlNYXQuc3BlY3VsYXIgPSBzcGVjdWxhcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsbS5jbSA9IGNtO1xuXG5cdFx0XHRcdHRoaXMuX21hdGVyaWFsTG9hZGVkLnB1c2gobG0pO1xuXG5cdFx0XHRcdGlmICh0aGlzLl9tZXNoZXMubGVuZ3RoID4gMClcblx0XHRcdFx0XHR0aGlzLmFwcGx5TWF0ZXJpYWwobG0pO1xuXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fbXRsTGliTG9hZGVkID0gdHJ1ZTtcblx0fVxuXG5cdHByaXZhdGUgcGFyc2VNYXBLZFN0cmluZyh0cnVuayk6c3RyaW5nXG5cdHtcblx0XHR2YXIgdXJsOnN0cmluZyA9IFwiXCI7XG5cdFx0dmFyIGk6bnVtYmVyO1xuXHRcdHZhciBicmVha2ZsYWc6Ym9vbGVhbjtcblxuXHRcdGZvciAoaSA9IDE7IGkgPCB0cnVuay5sZW5ndGg7KSB7XG5cdFx0XHRzd2l0Y2ggKHRydW5rW2ldKSB7XG5cdFx0XHRcdGNhc2UgXCItYmxlbmR1XCI6XG5cdFx0XHRcdGNhc2UgXCItYmxlbmR2XCI6XG5cdFx0XHRcdGNhc2UgXCItY2NcIjpcblx0XHRcdFx0Y2FzZSBcIi1jbGFtcFwiOlxuXHRcdFx0XHRjYXNlIFwiLXRleHJlc1wiOlxuXHRcdFx0XHRcdGkgKz0gMjsgLy9Ta2lwIGFoZWFkIDEgYXR0cmlidXRlXG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCItbW1cIjpcblx0XHRcdFx0XHRpICs9IDM7IC8vU2tpcCBhaGVhZCAyIGF0dHJpYnV0ZXNcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIi1vXCI6XG5cdFx0XHRcdGNhc2UgXCItc1wiOlxuXHRcdFx0XHRjYXNlIFwiLXRcIjpcblx0XHRcdFx0XHRpICs9IDQ7IC8vU2tpcCBhaGVhZCAzIGF0dHJpYnV0ZXNcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRicmVha2ZsYWcgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoYnJlYWtmbGFnKVxuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHQvL1JlY29uc3RydWN0IFVSTC9maWxlbmFtZVxuXHRcdGZvciAoaTsgaSA8IHRydW5rLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR1cmwgKz0gdHJ1bmtbaV07XG5cdFx0XHR1cmwgKz0gXCIgXCI7XG5cdFx0fVxuXG5cdFx0Ly9SZW1vdmUgdGhlIGV4dHJhbmVvdXMgc3BhY2UgYW5kL29yIG5ld2xpbmUgZnJvbSB0aGUgcmlnaHQgc2lkZVxuXHRcdHVybCA9IHVybC5yZXBsYWNlKC9cXHMrJC8sIFwiXCIpO1xuXG5cdFx0cmV0dXJuIHVybDtcblx0fVxuXG5cdHByaXZhdGUgbG9hZE10bChtdGx1cmw6c3RyaW5nKVxuXHR7XG5cdFx0Ly8gQWRkIHJhdy1kYXRhIGRlcGVuZGVuY3kgdG8gcXVldWUgYW5kIGxvYWQgZGVwZW5kZW5jaWVzIG5vdyxcblx0XHQvLyB3aGljaCB3aWxsIHBhdXNlIHRoZSBwYXJzaW5nIGluIHRoZSBtZWFudGltZS5cblx0XHR0aGlzLl9wQWRkRGVwZW5kZW5jeSgnbXRsJywgbmV3IFVSTFJlcXVlc3QobXRsdXJsKSwgdHJ1ZSk7XG5cdFx0dGhpcy5fcFBhdXNlQW5kUmV0cmlldmVEZXBlbmRlbmNpZXMoKTsvL1xuXHR9XG5cblx0cHJpdmF0ZSBhcHBseU1hdGVyaWFsKGxtOkxvYWRlZE1hdGVyaWFsKVxuXHR7XG5cdFx0dmFyIGRlY29tcG9zZUlEO1xuXHRcdHZhciBtZXNoOk1lc2g7XG5cdFx0dmFyIHRtOlRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWw7XG5cdFx0dmFyIGo6bnVtYmVyO1xuXHRcdHZhciBzcGVjdWxhckRhdGE6U3BlY3VsYXJEYXRhO1xuXG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgdGhpcy5fbWVzaGVzLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRtZXNoID0gdGhpcy5fbWVzaGVzW2ldO1xuXHRcdFx0ZGVjb21wb3NlSUQgPSBtZXNoLm1hdGVyaWFsLm5hbWUuc3BsaXQoXCJ+XCIpO1xuXG5cdFx0XHRpZiAoZGVjb21wb3NlSURbMF0gPT0gbG0ubWF0ZXJpYWxJRCkge1xuXG5cdFx0XHRcdGlmIChsbS5jbSkge1xuXHRcdFx0XHRcdGlmIChtZXNoLm1hdGVyaWFsKVxuXHRcdFx0XHRcdFx0bWVzaC5tYXRlcmlhbCA9IG51bGw7XG5cdFx0XHRcdFx0bWVzaC5tYXRlcmlhbCA9IGxtLmNtO1xuXG5cdFx0XHRcdH0gZWxzZSBpZiAobG0udGV4dHVyZSkge1xuXHRcdFx0XHRcdGlmICh0aGlzLm1hdGVyaWFsTW9kZSA8IDIpIHsgLy8gaWYgbWF0ZXJpYWxNb2RlIGlzIDAgb3IgMSwgd2UgY3JlYXRlIGEgU2luZ2xlUGFzc1xuXHRcdFx0XHRcdFx0dG0gPSA8VHJpYW5nbGVNZXRob2RNYXRlcmlhbCA+IG1lc2gubWF0ZXJpYWw7XG5cblx0XHRcdFx0XHRcdHRtLnRleHR1cmUgPSBsbS50ZXh0dXJlO1xuXHRcdFx0XHRcdFx0dG0uY29sb3IgPSBsbS5jb2xvcjtcblx0XHRcdFx0XHRcdHRtLmFscGhhID0gbG0uYWxwaGE7XG5cdFx0XHRcdFx0XHR0bS5yZXBlYXQgPSB0cnVlO1xuXG5cdFx0XHRcdFx0XHRpZiAobG0uc3BlY3VsYXJNZXRob2QpIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBCeSBzZXR0aW5nIHRoZSBzcGVjdWxhck1ldGhvZCBwcm9wZXJ0eSB0byBudWxsIGJlZm9yZSBhc3NpZ25pbmdcblx0XHRcdFx0XHRcdFx0Ly8gdGhlIGFjdHVhbCBtZXRob2QgaW5zdGFuY2UsIHdlIGF2b2lkIGhhdmluZyB0aGUgcHJvcGVydGllcyBvZlxuXHRcdFx0XHRcdFx0XHQvLyB0aGUgbmV3IG1ldGhvZCBiZWluZyBvdmVycmlkZGVuIHdpdGggdGhlIHNldHRpbmdzIGZyb20gdGhlIG9sZFxuXHRcdFx0XHRcdFx0XHQvLyBvbmUsIHdoaWNoIGlzIGRlZmF1bHQgYmVoYXZpb3Igb2YgdGhlIHNldHRlci5cblx0XHRcdFx0XHRcdFx0dG0uc3BlY3VsYXJNZXRob2QgPSBudWxsO1xuXHRcdFx0XHRcdFx0XHR0bS5zcGVjdWxhck1ldGhvZCA9IGxtLnNwZWN1bGFyTWV0aG9kO1xuXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuX21hdGVyaWFsU3BlY3VsYXJEYXRhKSB7XG5cblx0XHRcdFx0XHRcdFx0Zm9yIChqID0gMDsgaiA8IHRoaXMuX21hdGVyaWFsU3BlY3VsYXJEYXRhLmxlbmd0aDsgKytqKSB7XG5cdFx0XHRcdFx0XHRcdFx0c3BlY3VsYXJEYXRhID0gdGhpcy5fbWF0ZXJpYWxTcGVjdWxhckRhdGFbal07XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoc3BlY3VsYXJEYXRhLm1hdGVyaWFsSUQgPT0gbG0ubWF0ZXJpYWxJRCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dG0uc3BlY3VsYXJNZXRob2QgPSBudWxsOyAvLyBQcmV2ZW50IHByb3BlcnR5IG92ZXJ3cml0ZSAoc2VlIGFib3ZlKVxuXHRcdFx0XHRcdFx0XHRcdFx0dG0uc3BlY3VsYXJNZXRob2QgPSBzcGVjdWxhckRhdGEuYmFzaWNTcGVjdWxhck1ldGhvZDtcblx0XHRcdFx0XHRcdFx0XHRcdHRtLmNvbG9yID0gc3BlY3VsYXJEYXRhLmNvbG9yO1xuXHRcdFx0XHRcdFx0XHRcdFx0dG0uYWxwaGEgPSBzcGVjdWxhckRhdGEuYWxwaGE7XG5cdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2UgeyAvL2lmIG1hdGVyaWFsTW9kZT09MiB0aGlzIGlzIGEgTXVsdGlQYXNzVGV4dHVyZVxuXHRcdFx0XHRcdFx0dG0gPSA8VHJpYW5nbGVNZXRob2RNYXRlcmlhbD4gbWVzaC5tYXRlcmlhbDtcblx0XHRcdFx0XHRcdHRtLm1hdGVyaWFsTW9kZSA9IFRyaWFuZ2xlTWF0ZXJpYWxNb2RlLk1VTFRJX1BBU1M7XG5cblx0XHRcdFx0XHRcdHRtLnRleHR1cmUgPSBsbS50ZXh0dXJlO1xuXHRcdFx0XHRcdFx0dG0uY29sb3IgPSBsbS5jb2xvcjtcblx0XHRcdFx0XHRcdHRtLnJlcGVhdCA9IHRydWU7XG5cblx0XHRcdFx0XHRcdGlmIChsbS5zcGVjdWxhck1ldGhvZCkge1xuXHRcdFx0XHRcdFx0XHQvLyBCeSBzZXR0aW5nIHRoZSBzcGVjdWxhck1ldGhvZCBwcm9wZXJ0eSB0byBudWxsIGJlZm9yZSBhc3NpZ25pbmdcblx0XHRcdFx0XHRcdFx0Ly8gdGhlIGFjdHVhbCBtZXRob2QgaW5zdGFuY2UsIHdlIGF2b2lkIGhhdmluZyB0aGUgcHJvcGVydGllcyBvZlxuXHRcdFx0XHRcdFx0XHQvLyB0aGUgbmV3IG1ldGhvZCBiZWluZyBvdmVycmlkZGVuIHdpdGggdGhlIHNldHRpbmdzIGZyb20gdGhlIG9sZFxuXHRcdFx0XHRcdFx0XHQvLyBvbmUsIHdoaWNoIGlzIGRlZmF1bHQgYmVoYXZpb3Igb2YgdGhlIHNldHRlci5cblx0XHRcdFx0XHRcdFx0dG0uc3BlY3VsYXJNZXRob2QgPSBudWxsO1xuXHRcdFx0XHRcdFx0XHR0bS5zcGVjdWxhck1ldGhvZCA9IGxtLnNwZWN1bGFyTWV0aG9kO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLl9tYXRlcmlhbFNwZWN1bGFyRGF0YSkge1xuXHRcdFx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgdGhpcy5fbWF0ZXJpYWxTcGVjdWxhckRhdGEubGVuZ3RoOyArK2opIHtcblx0XHRcdFx0XHRcdFx0XHRzcGVjdWxhckRhdGEgPSB0aGlzLl9tYXRlcmlhbFNwZWN1bGFyRGF0YVtqXTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmIChzcGVjdWxhckRhdGEubWF0ZXJpYWxJRCA9PSBsbS5tYXRlcmlhbElEKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0bS5zcGVjdWxhck1ldGhvZCA9IG51bGw7IC8vIFByZXZlbnQgcHJvcGVydHkgb3ZlcndyaXRlIChzZWUgYWJvdmUpXG5cdFx0XHRcdFx0XHRcdFx0XHR0bS5zcGVjdWxhck1ldGhvZCA9IHNwZWN1bGFyRGF0YS5iYXNpY1NwZWN1bGFyTWV0aG9kO1xuXHRcdFx0XHRcdFx0XHRcdFx0dG0uY29sb3IgPSBzcGVjdWxhckRhdGEuY29sb3I7XG5cblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0bWVzaC5tYXRlcmlhbC5uYW1lID0gZGVjb21wb3NlSURbMV0/IGRlY29tcG9zZUlEWzFdIDogZGVjb21wb3NlSURbMF07XG5cdFx0XHRcdHRoaXMuX21lc2hlcy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdC0taTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAobG0uY20gfHwgdG0pXG5cdFx0XHR0aGlzLl9wRmluYWxpemVBc3NldChsbS5jbSB8fCB0bSk7XG5cdH1cblxuXHRwcml2YXRlIGFwcGx5TWF0ZXJpYWxzKClcblx0e1xuXHRcdGlmICh0aGlzLl9tYXRlcmlhbExvYWRlZC5sZW5ndGggPT0gMClcblx0XHRcdHJldHVybjtcblxuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMuX21hdGVyaWFsTG9hZGVkLmxlbmd0aDsgKytpKVxuXHRcdFx0dGhpcy5hcHBseU1hdGVyaWFsKHRoaXMuX21hdGVyaWFsTG9hZGVkW2ldKTtcblx0fVxufVxuXG5leHBvcnQgPSBPQkpQYXJzZXI7XG5cbmNsYXNzIE9iamVjdEdyb3VwXG57XG5cdHB1YmxpYyBuYW1lOnN0cmluZztcblx0cHVibGljIGdyb3VwczpHcm91cFtdID0gbmV3IEFycmF5PEdyb3VwPigpO1xufVxuXG5jbGFzcyBHcm91cFxue1xuXHRwdWJsaWMgbmFtZTpzdHJpbmc7XG5cdHB1YmxpYyBtYXRlcmlhbElEOnN0cmluZztcblx0cHVibGljIG1hdGVyaWFsR3JvdXBzOk1hdGVyaWFsR3JvdXBbXSA9IG5ldyBBcnJheTxNYXRlcmlhbEdyb3VwPigpO1xufVxuXG5jbGFzcyBNYXRlcmlhbEdyb3VwXG57XG5cdHB1YmxpYyB1cmw6c3RyaW5nO1xuXHRwdWJsaWMgZmFjZXM6RmFjZURhdGFbXSA9IG5ldyBBcnJheTxGYWNlRGF0YT4oKTtcbn1cblxuY2xhc3MgU3BlY3VsYXJEYXRhXG57XG5cdHB1YmxpYyBtYXRlcmlhbElEOnN0cmluZztcblx0cHVibGljIGJhc2ljU3BlY3VsYXJNZXRob2Q6U3BlY3VsYXJCYXNpY01ldGhvZDtcblx0cHVibGljIGNvbG9yOm51bWJlciA9IDB4RkZGRkZGO1xuXHRwdWJsaWMgYWxwaGE6bnVtYmVyID0gMTtcbn1cblxuY2xhc3MgTG9hZGVkTWF0ZXJpYWxcbntcblx0cHVibGljIG1hdGVyaWFsSUQ6c3RyaW5nO1xuXHRwdWJsaWMgdGV4dHVyZTpUZXh0dXJlMkRCYXNlO1xuXHRwdWJsaWMgY206TWF0ZXJpYWxCYXNlO1xuXHRwdWJsaWMgc3BlY3VsYXJNZXRob2Q6U3BlY3VsYXJCYXNpY01ldGhvZDtcblx0cHVibGljIGNvbG9yOm51bWJlciA9IDB4RkZGRkZGO1xuXHRwdWJsaWMgYWxwaGE6bnVtYmVyID0gMTtcbn1cblxuY2xhc3MgRmFjZURhdGFcbntcblx0cHVibGljIHZlcnRleEluZGljZXM6QXJyYXk8bnVtYmVyPiAvKnVpbnQqLyA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cdHB1YmxpYyB1dkluZGljZXM6QXJyYXk8bnVtYmVyPiAvKnVpbnQqLyA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cdHB1YmxpYyBub3JtYWxJbmRpY2VzOkFycmF5PG51bWJlcj4gLyp1aW50Ki8gPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuXHRwdWJsaWMgaW5kZXhJZHM6c3RyaW5nW10gPSBuZXcgQXJyYXk8c3RyaW5nPigpOyAvLyB1c2VkIGZvciByZWFsIGluZGV4IGxvb2t1cHNcbn1cblxuLyoqXG4qIFRleHR1cmUgY29vcmRpbmF0ZXMgdmFsdWUgb2JqZWN0LlxuKi9cbmNsYXNzIFVWXG57XG5cdHByaXZhdGUgX3U6bnVtYmVyO1xuXHRwcml2YXRlIF92Om51bWJlcjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyA8Y29kZT5VVjwvY29kZT4gb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gICAgdSAgICAgICAgW29wdGlvbmFsXSAgICBUaGUgaG9yaXpvbnRhbCBjb29yZGluYXRlIG9mIHRoZSB0ZXh0dXJlIHZhbHVlLiBEZWZhdWx0cyB0byAwLlxuXHQgKiBAcGFyYW0gICAgdiAgICAgICAgW29wdGlvbmFsXSAgICBUaGUgdmVydGljYWwgY29vcmRpbmF0ZSBvZiB0aGUgdGV4dHVyZSB2YWx1ZS4gRGVmYXVsdHMgdG8gMC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHU6bnVtYmVyID0gMCwgdjpudW1iZXIgPSAwKVxuXHR7XG5cdFx0dGhpcy5fdSA9IHU7XG5cdFx0dGhpcy5fdiA9IHY7XG5cdH1cblxuXHQvKipcblx0ICogRGVmaW5lcyB0aGUgdmVydGljYWwgY29vcmRpbmF0ZSBvZiB0aGUgdGV4dHVyZSB2YWx1ZS5cblx0ICovXG5cdHB1YmxpYyBnZXQgdigpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3Y7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHYodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fdiA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlZmluZXMgdGhlIGhvcml6b250YWwgY29vcmRpbmF0ZSBvZiB0aGUgdGV4dHVyZSB2YWx1ZS5cblx0ICovXG5cdHB1YmxpYyBnZXQgdSgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3U7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHUodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fdSA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIHJldHVybnMgYSBuZXcgVVYgdmFsdWUgT2JqZWN0XG5cdCAqL1xuXHRwdWJsaWMgY2xvbmUoKTpVVlxuXHR7XG5cdFx0cmV0dXJuIG5ldyBVVih0aGlzLl91LCB0aGlzLl92KTtcblx0fVxuXG5cdC8qKlxuXHQgKiByZXR1cm5zIHRoZSB2YWx1ZSBvYmplY3QgYXMgYSBzdHJpbmcgZm9yIHRyYWNlL2RlYnVnIHB1cnBvc2Vcblx0ICovXG5cdHB1YmxpYyB0b1N0cmluZygpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3UgKyBcIixcIiArIHRoaXMuX3Y7XG5cdH1cbn1cblxuY2xhc3MgVmVydGV4XG57XG5cdHByaXZhdGUgX3g6bnVtYmVyO1xuXHRwcml2YXRlIF95Om51bWJlcjtcblx0cHJpdmF0ZSBfejpudW1iZXI7XG5cdHByaXZhdGUgX2luZGV4Om51bWJlcjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyA8Y29kZT5WZXJ0ZXg8L2NvZGU+IHZhbHVlIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtICAgIHggICAgICAgICAgICBbb3B0aW9uYWxdICAgIFRoZSB4IHZhbHVlLiBEZWZhdWx0cyB0byAwLlxuXHQgKiBAcGFyYW0gICAgeSAgICAgICAgICAgIFtvcHRpb25hbF0gICAgVGhlIHkgdmFsdWUuIERlZmF1bHRzIHRvIDAuXG5cdCAqIEBwYXJhbSAgICB6ICAgICAgICAgICAgW29wdGlvbmFsXSAgICBUaGUgeiB2YWx1ZS4gRGVmYXVsdHMgdG8gMC5cblx0ICogQHBhcmFtICAgIGluZGV4ICAgICAgICBbb3B0aW9uYWxdICAgIFRoZSBpbmRleCB2YWx1ZS4gRGVmYXVsdHMgaXMgTmFOLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoeDpudW1iZXIgPSAwLCB5Om51bWJlciA9IDAsIHo6bnVtYmVyID0gMCwgaW5kZXg6bnVtYmVyID0gMClcblx0e1xuXHRcdHRoaXMuX3ggPSB4O1xuXHRcdHRoaXMuX3kgPSB5O1xuXHRcdHRoaXMuX3ogPSB6O1xuXHRcdHRoaXMuX2luZGV4ID0gaW5kZXg7XG5cdH1cblxuXHQvKipcblx0ICogVG8gZGVmaW5lL3N0b3JlIHRoZSBpbmRleCBvZiB2YWx1ZSBvYmplY3Rcblx0ICogQHBhcmFtICAgIGluZCAgICAgICAgVGhlIGluZGV4XG5cdCAqL1xuXHRwdWJsaWMgc2V0IGluZGV4KGluZDpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9pbmRleCA9IGluZDtcblx0fVxuXG5cdHB1YmxpYyBnZXQgaW5kZXgoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl9pbmRleDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUbyBkZWZpbmUvc3RvcmUgdGhlIHggdmFsdWUgb2YgdGhlIHZhbHVlIG9iamVjdFxuXHQgKiBAcGFyYW0gICAgdmFsdWUgICAgICAgIFRoZSB4IHZhbHVlXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHgoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl94O1xuXHR9XG5cblx0cHVibGljIHNldCB4KHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3ggPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUbyBkZWZpbmUvc3RvcmUgdGhlIHkgdmFsdWUgb2YgdGhlIHZhbHVlIG9iamVjdFxuXHQgKiBAcGFyYW0gICAgdmFsdWUgICAgICAgIFRoZSB5IHZhbHVlXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHkoKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl95O1xuXHR9XG5cblx0cHVibGljIHNldCB5KHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3kgPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUbyBkZWZpbmUvc3RvcmUgdGhlIHogdmFsdWUgb2YgdGhlIHZhbHVlIG9iamVjdFxuXHQgKiBAcGFyYW0gICAgdmFsdWUgICAgICAgIFRoZSB6IHZhbHVlXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHooKTpudW1iZXJcblx0e1xuXHRcdHJldHVybiB0aGlzLl96O1xuXHR9XG5cblx0cHVibGljIHNldCB6KHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3ogPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiByZXR1cm5zIGEgbmV3IFZlcnRleCB2YWx1ZSBPYmplY3Rcblx0ICovXG5cdHB1YmxpYyBjbG9uZSgpOlZlcnRleFxuXHR7XG5cdFx0cmV0dXJuIG5ldyBWZXJ0ZXgodGhpcy5feCwgdGhpcy5feSwgdGhpcy5feik7XG5cdH1cbn0iXX0=