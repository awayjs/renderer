var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DisplayObjectContainer = require("awayjs-core/lib/containers/DisplayObjectContainer");
var TriangleSubGeometry = require("awayjs-core/lib/core/base/TriangleSubGeometry");
var Geometry = require("awayjs-core/lib/core/base/Geometry");
var AssetType = require("awayjs-core/lib/core/library/AssetType");
var URLLoaderDataFormat = require("awayjs-core/lib/core/net/URLLoaderDataFormat");
var URLRequest = require("awayjs-core/lib/core/net/URLRequest");
var Mesh = require("awayjs-core/lib/entities/Mesh");
var ParserBase = require("awayjs-core/lib/parsers/ParserBase");
var ParserUtils = require("awayjs-core/lib/parsers/ParserUtils");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNlcnMvb2JqcGFyc2VyLnRzIl0sIm5hbWVzIjpbIk9CSlBhcnNlciIsIk9CSlBhcnNlci5jb25zdHJ1Y3RvciIsIk9CSlBhcnNlci5zY2FsZSIsIk9CSlBhcnNlci5zdXBwb3J0c1R5cGUiLCJPQkpQYXJzZXIuc3VwcG9ydHNEYXRhIiwiT0JKUGFyc2VyLl9pUmVzb2x2ZURlcGVuZGVuY3kiLCJPQkpQYXJzZXIuX2lSZXNvbHZlRGVwZW5kZW5jeUZhaWx1cmUiLCJPQkpQYXJzZXIuX3BQcm9jZWVkUGFyc2luZyIsIk9CSlBhcnNlci5fcFN0YXJ0UGFyc2luZyIsIk9CSlBhcnNlci5wYXJzZUxpbmUiLCJPQkpQYXJzZXIudHJhbnNsYXRlIiwiT0JKUGFyc2VyLnRyYW5zbGF0ZU1hdGVyaWFsR3JvdXAiLCJPQkpQYXJzZXIudHJhbnNsYXRlVmVydGV4RGF0YSIsIk9CSlBhcnNlci5jcmVhdGVPYmplY3QiLCJPQkpQYXJzZXIuY3JlYXRlR3JvdXAiLCJPQkpQYXJzZXIuY3JlYXRlTWF0ZXJpYWxHcm91cCIsIk9CSlBhcnNlci5wYXJzZVZlcnRleCIsIk9CSlBhcnNlci5wYXJzZVVWIiwiT0JKUGFyc2VyLnBhcnNlVmVydGV4Tm9ybWFsIiwiT0JKUGFyc2VyLnBhcnNlRmFjZSIsIk9CSlBhcnNlci5wYXJzZUluZGV4IiwiT0JKUGFyc2VyLnBhcnNlTXRsIiwiT0JKUGFyc2VyLnBhcnNlTWFwS2RTdHJpbmciLCJPQkpQYXJzZXIubG9hZE10bCIsIk9CSlBhcnNlci5hcHBseU1hdGVyaWFsIiwiT0JKUGFyc2VyLmFwcGx5TWF0ZXJpYWxzIiwiT2JqZWN0R3JvdXAiLCJPYmplY3RHcm91cC5jb25zdHJ1Y3RvciIsIkdyb3VwIiwiR3JvdXAuY29uc3RydWN0b3IiLCJNYXRlcmlhbEdyb3VwIiwiTWF0ZXJpYWxHcm91cC5jb25zdHJ1Y3RvciIsIlNwZWN1bGFyRGF0YSIsIlNwZWN1bGFyRGF0YS5jb25zdHJ1Y3RvciIsIkxvYWRlZE1hdGVyaWFsIiwiTG9hZGVkTWF0ZXJpYWwuY29uc3RydWN0b3IiLCJGYWNlRGF0YSIsIkZhY2VEYXRhLmNvbnN0cnVjdG9yIiwiVVYiLCJVVi5jb25zdHJ1Y3RvciIsIlVWLnYiLCJVVi51IiwiVVYuY2xvbmUiLCJVVi50b1N0cmluZyIsIlZlcnRleCIsIlZlcnRleC5jb25zdHJ1Y3RvciIsIlZlcnRleC5pbmRleCIsIlZlcnRleC54IiwiVmVydGV4LnkiLCJWZXJ0ZXgueiIsIlZlcnRleC5jbG9uZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTyxzQkFBc0IsV0FBYSxtREFBbUQsQ0FBQyxDQUFDO0FBQy9GLElBQU8sbUJBQW1CLFdBQWMsK0NBQStDLENBQUMsQ0FBQztBQUN6RixJQUFPLFFBQVEsV0FBaUIsb0NBQW9DLENBQUMsQ0FBQztBQUl0RSxJQUFPLFNBQVMsV0FBZ0Isd0NBQXdDLENBQUMsQ0FBQztBQUUxRSxJQUFPLG1CQUFtQixXQUFjLDhDQUE4QyxDQUFDLENBQUM7QUFDeEYsSUFBTyxVQUFVLFdBQWdCLHFDQUFxQyxDQUFDLENBQUM7QUFDeEUsSUFBTyxJQUFJLFdBQWtCLCtCQUErQixDQUFDLENBQUM7QUFFOUQsSUFBTyxVQUFVLFdBQWdCLG9DQUFvQyxDQUFDLENBQUM7QUFDdkUsSUFBTyxXQUFXLFdBQWdCLHFDQUFxQyxDQUFDLENBQUM7QUFJekUsSUFBTyxzQkFBc0IsV0FBYSwyREFBMkQsQ0FBQyxDQUFDO0FBQ3ZHLElBQU8sbUJBQW1CLFdBQWMsMERBQTBELENBQUMsQ0FBQztBQUNwRyxJQUFPLHNCQUFzQixXQUFhLHFEQUFxRCxDQUFDLENBQUM7QUFDakcsSUFBTyxvQkFBb0IsV0FBYyxtREFBbUQsQ0FBQyxDQUFDO0FBRTlGLEFBR0E7O0dBREc7SUFDRyxTQUFTO0lBQVNBLFVBQWxCQSxTQUFTQSxVQUFtQkE7SUEyQmpDQTs7OztPQUlHQTtJQUNIQSxTQWhDS0EsU0FBU0EsQ0FnQ0ZBLEtBQWdCQTtRQUFoQkMscUJBQWdCQSxHQUFoQkEsU0FBZ0JBO1FBRTNCQSxrQkFBTUEsbUJBQW1CQSxDQUFD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LENBQUNBO1lBQ3JEQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNuQkEsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsSUFBSUEsS0FBS0EsRUFBZUEsQ0FBQ0E7WUFDekNBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLENBQUNBLENBQUNBO1FBQ3ZCQSxDQUFDQTtRQUVEQSxPQUFPQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxJQUFJQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUNqRUEsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsRUFBRUEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7WUFFbEVBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUN6QkEsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7WUFFdENBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO1lBQ2pFQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUNqQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ3hCQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNyQ0EsSUFB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QUEsMERBRDBEQTtvQkFDMURBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLElBQUlBLENBQUNBO2dCQUUxQ0EsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO29CQUUzQkEsQUFDQUEsK0ZBRCtGQTtvQkFDL0ZBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBO2dCQUU1QkEsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUNQQSxBQUVBQSx1REFGdURBO29CQUN2REEsdURBQXVEQTtvQkFDdkRBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLEVBQUVBLENBQUNBO2dCQUNoQkEsQ0FBQ0E7Z0JBRURBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUV4QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsVUFBVUEsSUFBSUEsRUFBRUEsQ0FBQ0E7b0JBQzlCQSxVQUFVQSxDQUFDQSxJQUFJQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxVQUFVQSxHQUFHQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQTtnQkFBQ0EsSUFBSUE7b0JBQzlEQSxVQUFVQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQTtnQkFFckRBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUMvQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0Es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LEdBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLEdBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBLEdBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1lBRWhGQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbkNBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLFdBQVdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUN4RUEsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsWUFBWUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDOURBLENBQUNBO1lBRURBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUUvQkEsSUFBQUEsQ0FBQ0E7b0JBQ0FBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFdBQVdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO29CQUNoREEsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRXRCQSxDQUFFQTtnQkFBQUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBVEEsQ0FBQ0E7b0JBRUZBLE1BQU1BLENBQUNBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBO3dCQUNyQkEsS0FBS0EsQ0FBQ0E7NEJBQ0xBLEdBQUdBLENBQUNBLElBQUlBLENBQUNB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Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdEJBLElBQUlBLE1BQU1BLEdBQUdBLEVBQUVBLENBQUNBO1lBQ2hCQSxJQUFJQSxHQUFVQSxDQUFDQTtZQUVmQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxNQUFNQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtnQkFDOUNBLEdBQUdBLEdBQUdBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUMzQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ25CQSxDQUFDQTtZQUVEQSxFQUFFQSxHQUFZQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN4QkEsRUFBRUEsR0FBWUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLEVBQUVBLEdBQVlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3pCQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxNQUFNQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUU3Q0EsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDUEEsRUFBRUEsR0FBWUEsVUFBVUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbkNBLEVBQUVBLEdBQVlBLFVBQVVBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ25DQSxFQUFFQSxHQUFZQSxDQUFDQSxV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QUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUV0RkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQy9DQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUU5RUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQy9DQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUU1RkEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDOUJBLENBQUNBO1FBRURBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7SUFDN0NBLENBQUNBO0lBRURuQjs7T0FFR0E7SUFDS0EsOEJBQVVBLEdBQWxCQSxVQUFtQkEsS0FBWUEsRUFBRUEsTUFBYUE7UUFFN0NvQixF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LENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBO3dCQUMvRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7b0JBRW5EQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDWkEsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7d0JBQ2pDQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxJQUFJQSxFQUFFQSxDQUFDQSxHQUFFQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQTtvQkFFdkVBLENBQUNBO29CQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTt3QkFFUEEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBRWxCQSxLQUFLQSxJQUFJQTtnQ0FDUkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0NBQ3hIQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFDQSxHQUFHQSxJQUFJQSxFQUFFQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFDQSxHQUFHQSxDQUFDQTtnQ0FDL0RBLEtBQUtBLENBQUNBOzRCQUVQQSxLQUFLQSxJQUFJQTtnQ0FDUkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0NBQzFIQSxhQUFhQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFDQSxHQUFHQSxJQUFJQSxFQUFFQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFDQSxHQUFHQSxDQUFDQTtvQ0FDdEVBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBO2dDQUNwQkEsQ0FBQ0E7Z0NBQ0RBLEtBQUtBLENBQUNBOzRCQUVQQSxLQUFLQSxJQUFJQTtnQ0FDUkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0NBQ3hDQSxRQUFRQSxHQUFHQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFDQSxLQUFLQSxDQUFDQTtnQ0FDbkNBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLElBQUlBLENBQUNBLENBQUNBO29DQUNqQkEsV0FBV0EsR0FBR0EsS0FBS0EsQ0FBQ0E7Z0NBQ3JCQSxLQUFLQSxDQUFDQTs0QkFFUEEsS0FBS0EsSUFBSUE7Z0NBQ1JBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29DQUMxSEEsWUFBWUEsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsR0FBR0EsSUFBSUEsRUFBRUEsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsR0FBR0EsQ0FBQ0E7b0NBQ3JFQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQTtnQ0FDakJBLENBQUNBO2dDQUNEQSxLQUFLQSxDQUFDQTs0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QUNBO29CQUN2QkEsUUFBUUEsQ0FBQ0EsWUFBWUEsR0FBR0EsWUFBWUEsQ0FBQ0E7b0JBQ3JDQSxRQUFRQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQTtvQkFFdkJBLEVBQUVBLENBQUNBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBO3dCQUNqQkEsUUFBUUEsQ0FBQ0EsYUFBYUEsR0FBR0EsYUFBYUEsQ0FBQ0E7d0JBQ3ZDQSxRQUFRQSxDQUFDQSxRQUFRQSxHQUFHQSxRQUFRQSxDQUFDQTtvQkFDOUJBLENBQUNBO2dCQUVGQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ1BBLEVBQUVBLEdBQUdBLElBQUlBLHNCQUFzQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZDQSxFQUFFQSxDQUFDQSxZQUFZQSxHQUFHQSxvQkFBb0JBLENBQUNBLFVBQVVBLENBQUNBO29CQUVsREEsSUFBSUEsYUFBYUEsR0FBbURBLEVBQUVBLENBQUNBO29CQUd2RUEsYUFBYUEsQ0FBQ0EsWUFBWUEsR0FBR0EsWUFBWUEsQ0FBQ0E7b0JBQzFDQSxhQUFhQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQTtvQkFFNUJBLEVBQUVBLENBQUNBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBO3dCQUNqQkEsYUFBYUEsQ0FBQ0EsYUFBYUEsR0FBR0EsYUFBYUEsQ0FBQ0E7d0JBQzVDQSxhQUFhQSxDQUFDQSxRQUFRQSxHQUFHQSxRQUFRQSxDQUFDQTtvQkFDbkNBLENBQUNBO2dCQUNGQSxDQUFDQTtnQkFFREEsRUFBRUEsQ0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBRVhBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO2dCQUU5QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQzNCQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUV6QkEsQ0FBQ0E7UUFDRkEsQ0FBQ0E7UUFFREEsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsSUFBSUEsQ0FBQ0E7SUFDM0JBLENBQUNBO0lBRU9yQixvQ0FBZ0JBLEdBQXhCQSxVQUF5QkEsS0FBS0E7UUFFN0JzQixJQUFJQSxHQUFHQSxHQUFVQSxFQUFFQSxDQUFDQTtRQUNwQkEsSUFBSUEsQ0FBUUEsQ0FBQ0E7UUFDYkEsSUFBSUEsU0FBaUJBLENBQUNBO1FBRXRCQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQTtZQUMvQkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2xCQSxLQUFLQSxTQUFTQSxDQUFDQTtnQkFDZkEsS0FBS0EsU0FBU0EsQ0FBQ0E7Z0JBQ2ZBLEtBQUtBLEtBQUtBLENBQUNBO2dCQUNYQSxLQUFLQSxRQUFRQSxDQUFDQTtnQkFDZEEsS0FBS0EsU0FBU0E7b0JBQ2JBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLHdCQUF3QkE7b0JBQ2hDQSxLQUFLQSxDQUFDQTtnQkFDUEEsS0FBS0EsS0FBS0E7b0JBQ1RBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLHlCQUF5QkE7b0JBQ2pDQSxLQUFLQSxDQUFDQTtnQkFDUEEsS0FBS0EsSUFBSUEsQ0FBQ0E7Z0JBQ1ZBLEtBQUtBLElBQUlBLENBQUNBO2dCQUNWQSxLQUFLQSxJQUFJQTtvQkFDUkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEseUJBQXlCQTtvQkFDakNBLFFBQVFBLENBQUNBO2dCQUNWQTtvQkFDQ0EsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0E7b0JBQ2pCQSxLQUFLQSxDQUFDQTtZQUNSQSxDQUFDQTtZQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQTtnQkFDYkEsS0FBS0EsQ0FBQ0E7UUFDUkEsQ0FBQ0E7UUFHREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7WUFDL0JBLEdBQUdBLElBQUlBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hCQSxHQUFHQSxJQUFJQSxHQUFHQSxDQUFDQTtRQUNaQSxDQUFDQTtRQUVEQSxBQUNBQSxnRUFEZ0VBO1FBQ2hFQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUU5QkEsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7SUFDWkEsQ0FBQ0E7SUFFT3RCLDJCQUFPQSxHQUFmQSxVQUFnQkEsTUFBYUE7UUFFNUJ1QixBQUVBQSw4REFGOERBO1FBQzlEQSxnREFBZ0RBO1FBQ2hEQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxLQUFLQSxFQUFFQSxJQUFJQSxVQUFVQSxDQUFDQSxNQUFNQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUMxREEsSUFBSUEsQ0FBQ0EsOEJBQThCQSxFQUFFQSxFQUFDQSxFQUFFQTtJQUN6Q0EsQ0FBQ0EsR0FEc0NBO0lBRy9CdkIsaUNBQWFBLEdBQXJCQSxVQUFzQkEsRUFBaUJBO1FBRXRDd0IsSUFBSUEsV0FBV0EsQ0FBQ0E7UUFDaEJBLElBQUlBLElBQVNBLENBQUNBO1FBQ2RBLElBQUlBLEVBQXlCQSxDQUFDQTtRQUM5QkEsSUFBSUEsQ0FBUUEsQ0FBQ0E7UUFDYkEsSUFBSUEsWUFBeUJBLENBQUNBO1FBRTlCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtZQUNyREEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdkJBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBRTVDQSxFQUFFQSxDQUFDQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFFckNBLEVBQUVBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO29CQUNYQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQTt3QkFDakJBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBO29CQUN0QkEsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7Z0JBRXZCQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDM0JBLEVBQUVBLEdBQTZCQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQTt3QkFFN0NBLEVBQUVBLENBQUNBLE9BQU9BLEdBQUdBLEVBQUVBLENBQUNBLE9BQU9BLENBQUNBO3dCQUN4QkEsRUFBRUEsQ0FBQ0EsS0FBS0EsR0FBR0EsRUFBRUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7d0JBQ3BCQSxFQUFFQSxDQUFDQSxLQUFLQSxHQUFHQSxFQUFFQSxDQUFDQSxLQUFLQSxDQUFDQTt3QkFDcEJBLEVBQUVBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBO3dCQUVqQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBRXZCQSxBQUlBQSxrRUFKa0VBOzRCQUNsRUEsZ0VBQWdFQTs0QkFDaEVBLGlFQUFpRUE7NEJBQ2pFQSxnREFBZ0RBOzRCQUNoREEsRUFBRUEsQ0FBQ0EsY0FBY0EsR0FBR0EsSUFBSUEsQ0FBQ0E7NEJBQ3pCQSxFQUFFQSxDQUFDQSxjQUFjQSxHQUFHQSxFQUFFQSxDQUFDQSxjQUFjQSxDQUFDQTt3QkFFdkNBLENBQUNBO3dCQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLENBQUNBLENBQUNBOzRCQUV2Q0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EscUJBQXFCQSxDQUFDQSxNQUFNQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtnQ0FDeERBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBRTdDQSxFQUFFQSxDQUFDQSxDQUFDQSxZQUFZQSxDQUFDQSxVQUFVQSxJQUFJQSxFQUFFQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtvQ0FDOUNBLEVBQUVBLENBQUNBLGNBQWNBLEdBQUdBLElBQUlBLEVBQUVBLHlDQUF5Q0E7b0NBQ25FQSxFQUFFQSxDQUFDQSxjQUFjQSxHQUFHQSxZQUFZQSxDQUFDQSxtQkFBbUJBLENBQUNBO29DQUNyREEsRUFBRUEsQ0FBQ0EsS0FBS0EsR0FBR0EsWUFBWUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7b0NBQzlCQSxFQUFFQSxDQUFDQSxLQUFLQSxHQUFHQSxZQUFZQSxDQUFDQSxLQUFLQSxDQUFDQTtvQ0FDOUJBLEtBQUtBLENBQUNBO2dDQUNQQSxDQUFDQTs0QkFDRkEsQ0FBQ0E7d0JBQ0ZBLENBQUNBO29CQUNGQSxDQUFDQTtvQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0JBQ1BBLEVBQUVBLEdBQTRCQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQTt3QkFDNUNBLEVBQUVBLENBQUNBLFlBQVlBLEdBQUdBLG9CQUFvQkEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7d0JBRWxEQSxFQUFFQSxDQUFDQSxPQUFPQSxHQUFHQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQTt3QkFDeEJBLEVBQUVBLENBQUNBLEtBQUtBLEdBQUdBLEVBQUVBLENBQUNBLEtBQUtBLENBQUNBO3dCQUNwQkEsRUFBRUEsQ0FBQ0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0E7d0JBRWpCQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDdkJBLEFBSUFBLGtFQUprRUE7NEJBQ2xFQSxnRUFBZ0VBOzRCQUNoRUEsaUVBQWlFQTs0QkFDakVBLGdEQUFnREE7NEJBQ2hEQSxFQUFFQSxDQUFDQSxjQUFjQSxHQUFHQSxJQUFJQSxDQUFDQTs0QkFDekJBLEVBQUVBLENBQUNBLGNBQWNBLEdBQUdBLEVBQUVBLENBQUNBLGNBQWNBLENBQUNBO3dCQUN2Q0EsQ0FBQ0E7d0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ3ZDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLE1BQU1BLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBO2dDQUN4REEsWUFBWUEsR0FBR0EsSUFBSUEsQ0FBQ0EscUJBQXFCQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FFN0NBLEVBQUVBLENBQUNBLENBQUNBLFlBQVlBLENBQUNBLFVBQVVBLElBQUlBLEVBQUVBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO29DQUM5Q0EsRUFBRUEsQ0FBQ0EsY0FBY0EsR0FBR0EsSUFBSUEsRUFBRUEseUNBQXlDQTtvQ0FDbkVBLEVBQUVBLENBQUNBLGNBQWNBLEdBQUdBLFlBQVlBLENBQUNBLG1CQUFtQkEsQ0FBQ0E7b0NBQ3JEQSxFQUFFQSxDQUFDQSxLQUFLQSxHQUFHQSxZQUFZQSxDQUFDQSxLQUFLQSxDQUFDQTtvQ0FFOUJBLEtBQUtBLENBQUNBO2dDQUVQQSxDQUFDQTs0QkFDRkEsQ0FBQ0E7d0JBQ0ZBLENBQUNBO29CQUNGQSxDQUFDQTtnQkFDRkEsQ0FBQ0E7Z0JBRURBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLEdBQUdBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBLEdBQUVBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNyRUEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzFCQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUNMQSxDQUFDQTtRQUNGQSxDQUFDQTtRQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxJQUFJQSxFQUFFQSxDQUFDQTtZQUNmQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxJQUFJQSxFQUFFQSxDQUFDQSxDQUFDQTtJQUNwQ0EsQ0FBQ0E7SUFFT3hCLGtDQUFjQSxHQUF0QkE7UUFFQ3lCLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLE1BQU1BLElBQUlBLENBQUNBLENBQUNBO1lBQ3BDQSxNQUFNQSxDQUFDQTtRQUVSQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxNQUFNQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUMxREEsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDOUNBLENBQUNBO0lBQ0Z6QixnQkFBQ0E7QUFBREEsQ0FoNkJBLEFBZzZCQ0EsRUFoNkJ1QixVQUFVLEVBZzZCakM7QUFJRCxJQUFNLFdBQVc7SUFBakIwQixTQUFNQSxXQUFXQTtRQUdUQyxXQUFNQSxHQUFXQSxJQUFJQSxLQUFLQSxFQUFTQSxDQUFDQTtJQUM1Q0EsQ0FBQ0E7SUFBREQsa0JBQUNBO0FBQURBLENBSkEsQUFJQ0EsSUFBQTtBQUVELElBQU0sS0FBSztJQUFYRSxTQUFNQSxLQUFLQTtRQUlIQyxtQkFBY0EsR0FBbUJBLElBQUlBLEtBQUtBLEVBQWlCQSxDQUFDQTtJQUNwRUEsQ0FBQ0E7SUFBREQsWUFBQ0E7QUFBREEsQ0FMQSxBQUtDQSxJQUFBO0FBRUQsSUFBTSxhQUFhO0lBQW5CRSxTQUFNQSxhQUFhQTtRQUdYQyxVQUFLQSxHQUFjQSxJQUFJQSxLQUFLQSxFQUFZQSxDQUFDQTtJQUNqREEsQ0FBQ0E7SUFBREQsb0JBQUNBO0FBQURBLENBSkEsQUFJQ0EsSUFBQTtBQUVELElBQU0sWUFBWTtJQUFsQkUsU0FBTUEsWUFBWUE7UUFJVkMsVUFBS0EsR0FBVUEsUUFBUUEsQ0FBQ0E7UUFDeEJBLFVBQUtBLEdBQVVBLENBQUNBLENBQUNBO0lBQ3pCQSxDQUFDQTtJQUFERCxtQkFBQ0E7QUFBREEsQ0FOQSxBQU1DQSxJQUFBO0FBRUQsSUFBTSxjQUFjO0lBQXBCRSxTQUFNQSxjQUFjQTtRQU1aQyxVQUFLQSxHQUFVQSxRQUFRQSxDQUFDQTtRQUN4QkEsVUFBS0EsR0FBVUEsQ0FBQ0EsQ0FBQ0E7SUFDekJBLENBQUNBO0lBQURELHFCQUFDQTtBQUFEQSxDQVJBLEFBUUNBLElBQUE7QUFFRCxJQUFNLFFBQVE7SUFBZEUsU0FBTUEsUUFBUUE7UUFFTkMsa0JBQWFBLEdBQTBCQSxJQUFJQSxLQUFLQSxFQUFVQSxDQUFDQTtRQUMzREEsY0FBU0EsR0FBMEJBLElBQUlBLEtBQUtBLEVBQVVBLENBQUNBO1FBQ3ZEQSxrQkFBYUEsR0FBMEJBLElBQUlBLEtBQUtBLEVBQVVBLENBQUNBO1FBQzNEQSxhQUFRQSxHQUFZQSxJQUFJQSxLQUFLQSxFQUFVQSxDQUFDQSxDQUFDQSw4QkFBOEJBO0lBQy9FQSxDQUFDQTtJQUFERCxlQUFDQTtBQUFEQSxDQU5BLEFBTUNBLElBQUE7QUFFRCxBQUdBOztFQURFO0lBQ0ksRUFBRTtJQUtQRTs7Ozs7T0FLR0E7SUFDSEEsU0FYS0EsRUFBRUEsQ0FXS0EsQ0FBWUEsRUFBRUEsQ0FBWUE7UUFBMUJDLGlCQUFZQSxHQUFaQSxLQUFZQTtRQUFFQSxpQkFBWUEsR0FBWkEsS0FBWUE7UUFFckNBLElBQUlBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO1FBQ1pBLElBQUlBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO0lBQ2JBLENBQUNBO0lBS0RELHNCQUFXQSxpQkFBQ0E7UUFIWkE7O1dBRUdBO2FBQ0hBO1lBRUNFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBO1FBQ2hCQSxDQUFDQTthQUVERixVQUFhQSxLQUFZQTtZQUV4QkUsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDakJBLENBQUNBOzs7T0FMQUY7SUFVREEsc0JBQVdBLGlCQUFDQTtRQUhaQTs7V0FFR0E7YUFDSEE7WUFFQ0csTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7UUFDaEJBLENBQUNBO2FBRURILFVBQWFBLEtBQVlBO1lBRXhCRyxJQUFJQSxDQUFDQSxFQUFFQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUNqQkEsQ0FBQ0E7OztPQUxBSDtJQU9EQTs7T0FFR0E7SUFDSUEsa0JBQUtBLEdBQVpBO1FBRUNJLE1BQU1BLENBQUNBLElBQUlBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEVBQUVBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO0lBQ2pDQSxDQUFDQTtJQUVESjs7T0FFR0E7SUFDSUEscUJBQVFBLEdBQWZBO1FBRUNLLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEdBQUdBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBO0lBQ2hDQSxDQUFDQTtJQUNGTCxTQUFDQTtBQUFEQSxDQTFEQSxBQTBEQ0EsSUFBQTtBQUVELElBQU0sTUFBTTtJQU9YTTs7Ozs7OztPQU9HQTtJQUNIQSxTQWZLQSxNQUFNQSxDQWVDQSxDQUFZQSxFQUFFQSxDQUFZQSxFQUFFQSxDQUFZQSxFQUFFQSxLQUFnQkE7UUFBMURDLGlCQUFZQSxHQUFaQSxLQUFZQTtRQUFFQSxpQkFBWUEsR0FBWkEsS0FBWUE7UUFBRUEsaUJBQVlBLEdBQVpBLEtBQVlBO1FBQUVBLHFCQUFnQkEsR0FBaEJBLFNBQWdCQTtRQUVyRUEsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDWkEsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDWkEsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDWkEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0E7SUFDckJBLENBQUNBO0lBTURELHNCQUFXQSx5QkFBS0E7YUFLaEJBO1lBRUNFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO1FBQ3BCQSxDQUFDQTtRQVpERjs7O1dBR0dBO2FBQ0hBLFVBQWlCQSxHQUFVQTtZQUUxQkUsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsR0FBR0EsQ0FBQ0E7UUFDbkJBLENBQUNBOzs7T0FBQUY7SUFXREEsc0JBQVdBLHFCQUFDQTtRQUpaQTs7O1dBR0dBO2FBQ0hBO1lBRUNHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBO1FBQ2hCQSxDQUFDQTthQUVESCxVQUFhQSxLQUFZQTtZQUV4QkcsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDakJBLENBQUNBOzs7T0FMQUg7SUFXREEsc0JBQVdBLHFCQUFDQTtRQUpaQTs7O1dBR0dBO2FBQ0hBO1lBRUNJLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBO1FBQ2hCQSxDQUFDQTthQUVESixVQUFhQSxLQUFZQTtZQUV4QkksSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDakJBLENBQUNBOzs7T0FMQUo7SUFXREEsc0JBQVdBLHFCQUFDQTtRQUpaQTs7O1dBR0dBO2FBQ0hBO1lBRUNLLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBO1FBQ2hCQSxDQUFDQTthQUVETCxVQUFhQSxLQUFZQTtZQUV4QkssSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDakJBLENBQUNBOzs7T0FMQUw7SUFPREE7O09BRUdBO0lBQ0lBLHNCQUFLQSxHQUFaQTtRQUVDTSxNQUFNQSxDQUFDQSxJQUFJQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxFQUFFQSxJQUFJQSxDQUFDQSxFQUFFQSxFQUFFQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtJQUM5Q0EsQ0FBQ0E7SUFDRk4sYUFBQ0E7QUFBREEsQ0F0RkEsQUFzRkNBLElBQUE7QUFwTUQsaUJBQVMsU0FBUyxDQUFDIiwiZmlsZSI6InBhcnNlcnMvT0JKUGFyc2VyLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERpc3BsYXlPYmplY3RDb250YWluZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29udGFpbmVycy9EaXNwbGF5T2JqZWN0Q29udGFpbmVyXCIpO1xuaW1wb3J0IFRyaWFuZ2xlU3ViR2VvbWV0cnlcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2Jhc2UvVHJpYW5nbGVTdWJHZW9tZXRyeVwiKTtcbmltcG9ydCBHZW9tZXRyeVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvYmFzZS9HZW9tZXRyeVwiKTtcbmltcG9ydCBNYXRyaXgzRFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvZ2VvbS9NYXRyaXgzRFwiKTtcbmltcG9ydCBRdWF0ZXJuaW9uXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvZ2VvbS9RdWF0ZXJuaW9uXCIpO1xuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9nZW9tL1ZlY3RvcjNEXCIpO1xuaW1wb3J0IEFzc2V0VHlwZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2xpYnJhcnkvQXNzZXRUeXBlXCIpO1xuaW1wb3J0IElBc3NldFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvbGlicmFyeS9JQXNzZXRcIik7XG5pbXBvcnQgVVJMTG9hZGVyRGF0YUZvcm1hdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvbmV0L1VSTExvYWRlckRhdGFGb3JtYXRcIik7XG5pbXBvcnQgVVJMUmVxdWVzdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL25ldC9VUkxSZXF1ZXN0XCIpO1xuaW1wb3J0IE1lc2hcdFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2VudGl0aWVzL01lc2hcIik7XG5pbXBvcnQgTWF0ZXJpYWxCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL21hdGVyaWFscy9NYXRlcmlhbEJhc2VcIik7XG5pbXBvcnQgUGFyc2VyQmFzZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wYXJzZXJzL1BhcnNlckJhc2VcIik7XG5pbXBvcnQgUGFyc2VyVXRpbHNcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcGFyc2Vycy9QYXJzZXJVdGlsc1wiKTtcbmltcG9ydCBSZXNvdXJjZURlcGVuZGVuY3lcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wYXJzZXJzL1Jlc291cmNlRGVwZW5kZW5jeVwiKTtcbmltcG9ydCBUZXh0dXJlMkRCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9UZXh0dXJlMkRCYXNlXCIpO1xuXG5pbXBvcnQgRGVmYXVsdE1hdGVyaWFsTWFuYWdlclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvdXRpbHMvRGVmYXVsdE1hdGVyaWFsTWFuYWdlclwiKTtcbmltcG9ydCBTcGVjdWxhckJhc2ljTWV0aG9kXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvU3BlY3VsYXJCYXNpY01ldGhvZFwiKTtcbmltcG9ydCBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9UcmlhbmdsZU1ldGhvZE1hdGVyaWFsXCIpO1xuaW1wb3J0IFRyaWFuZ2xlTWF0ZXJpYWxNb2RlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL1RyaWFuZ2xlTWF0ZXJpYWxNb2RlXCIpO1xuXG4vKipcbiAqIE9CSlBhcnNlciBwcm92aWRlcyBhIHBhcnNlciBmb3IgdGhlIE9CSiBkYXRhIHR5cGUuXG4gKi9cbmNsYXNzIE9CSlBhcnNlciBleHRlbmRzIFBhcnNlckJhc2Vcbntcblx0cHJpdmF0ZSBfdGV4dERhdGE6c3RyaW5nO1xuXHRwcml2YXRlIF9zdGFydGVkUGFyc2luZzpib29sZWFuO1xuXHRwcml2YXRlIF9jaGFySW5kZXg6bnVtYmVyO1xuXHRwcml2YXRlIF9vbGRJbmRleDpudW1iZXI7XG5cdHByaXZhdGUgX3N0cmluZ0xlbmd0aDpudW1iZXI7XG5cdHByaXZhdGUgX2N1cnJlbnRPYmplY3Q6T2JqZWN0R3JvdXA7XG5cdHByaXZhdGUgX2N1cnJlbnRHcm91cDpHcm91cDtcblx0cHJpdmF0ZSBfY3VycmVudE1hdGVyaWFsR3JvdXA6TWF0ZXJpYWxHcm91cDtcblx0cHJpdmF0ZSBfb2JqZWN0czpBcnJheTxPYmplY3RHcm91cD47XG5cdHByaXZhdGUgX21hdGVyaWFsSURzOnN0cmluZ1tdO1xuXHRwcml2YXRlIF9tYXRlcmlhbExvYWRlZDpBcnJheTxMb2FkZWRNYXRlcmlhbD47XG5cdHByaXZhdGUgX21hdGVyaWFsU3BlY3VsYXJEYXRhOkFycmF5PFNwZWN1bGFyRGF0YT47XG5cdHByaXZhdGUgX21lc2hlczpBcnJheTxNZXNoPjtcblx0cHJpdmF0ZSBfbGFzdE10bElEOnN0cmluZztcblx0cHJpdmF0ZSBfb2JqZWN0SW5kZXg6bnVtYmVyO1xuXHRwcml2YXRlIF9yZWFsSW5kaWNlcztcblx0cHJpdmF0ZSBfdmVydGV4SW5kZXg6bnVtYmVyO1xuXHRwcml2YXRlIF92ZXJ0aWNlczpBcnJheTxWZXJ0ZXg+O1xuXHRwcml2YXRlIF92ZXJ0ZXhOb3JtYWxzOkFycmF5PFZlcnRleD47XG5cdHByaXZhdGUgX3V2czpBcnJheTxVVj47XG5cdHByaXZhdGUgX3NjYWxlOm51bWJlcjtcblx0cHJpdmF0ZSBfbXRsTGliOmJvb2xlYW47XG5cdHByaXZhdGUgX210bExpYkxvYWRlZDpib29sZWFuID0gdHJ1ZTtcblx0cHJpdmF0ZSBfYWN0aXZlTWF0ZXJpYWxJRDpzdHJpbmcgPSBcIlwiO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IE9CSlBhcnNlciBvYmplY3QuXG5cdCAqIEBwYXJhbSB1cmkgVGhlIHVybCBvciBpZCBvZiB0aGUgZGF0YSBvciBmaWxlIHRvIGJlIHBhcnNlZC5cblx0ICogQHBhcmFtIGV4dHJhIFRoZSBob2xkZXIgZm9yIGV4dHJhIGNvbnRleHR1YWwgZGF0YSB0aGF0IHRoZSBwYXJzZXIgbWlnaHQgbmVlZC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHNjYWxlOm51bWJlciA9IDEpXG5cdHtcblx0XHRzdXBlcihVUkxMb2FkZXJEYXRhRm9ybWF0LlRFWFQpO1xuXHRcdHRoaXMuX3NjYWxlID0gc2NhbGU7XG5cdH1cblxuXHQvKipcblx0ICogU2NhbGluZyBmYWN0b3IgYXBwbGllZCBkaXJlY3RseSB0byB2ZXJ0aWNlcyBkYXRhXG5cdCAqIEBwYXJhbSB2YWx1ZSBUaGUgc2NhbGluZyBmYWN0b3IuXG5cdCAqL1xuXHRwdWJsaWMgc2V0IHNjYWxlKHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX3NjYWxlID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IGEgZ2l2ZW4gZmlsZSBleHRlbnNpb24gaXMgc3VwcG9ydGVkIGJ5IHRoZSBwYXJzZXIuXG5cdCAqIEBwYXJhbSBleHRlbnNpb24gVGhlIGZpbGUgZXh0ZW5zaW9uIG9mIGEgcG90ZW50aWFsIGZpbGUgdG8gYmUgcGFyc2VkLlxuXHQgKiBAcmV0dXJuIFdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBmaWxlIHR5cGUgaXMgc3VwcG9ydGVkLlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBzdXBwb3J0c1R5cGUoZXh0ZW5zaW9uOnN0cmluZyk6Ym9vbGVhblxuXHR7XG5cdFx0ZXh0ZW5zaW9uID0gZXh0ZW5zaW9uLnRvTG93ZXJDYXNlKCk7XG5cdFx0cmV0dXJuIGV4dGVuc2lvbiA9PSBcIm9ialwiO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRlc3RzIHdoZXRoZXIgYSBkYXRhIGJsb2NrIGNhbiBiZSBwYXJzZWQgYnkgdGhlIHBhcnNlci5cblx0ICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgYmxvY2sgdG8gcG90ZW50aWFsbHkgYmUgcGFyc2VkLlxuXHQgKiBAcmV0dXJuIFdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBkYXRhIGlzIHN1cHBvcnRlZC5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgc3VwcG9ydHNEYXRhKGRhdGE6YW55KTpib29sZWFuXG5cdHtcblx0XHR2YXIgY29udGVudDpzdHJpbmcgPSBQYXJzZXJVdGlscy50b1N0cmluZyhkYXRhKTtcblx0XHR2YXIgaGFzVjpib29sZWFuID0gZmFsc2U7XG5cdFx0dmFyIGhhc0Y6Ym9vbGVhbiA9IGZhbHNlO1xuXG5cdFx0aWYgKGNvbnRlbnQpIHtcblx0XHRcdGhhc1YgPSBjb250ZW50LmluZGV4T2YoXCJcXG52IFwiKSAhPSAtMTtcblx0XHRcdGhhc0YgPSBjb250ZW50LmluZGV4T2YoXCJcXG5mIFwiKSAhPSAtMTtcblx0XHR9XG5cblx0XHRyZXR1cm4gaGFzViAmJiBoYXNGO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX2lSZXNvbHZlRGVwZW5kZW5jeShyZXNvdXJjZURlcGVuZGVuY3k6UmVzb3VyY2VEZXBlbmRlbmN5KVxuXHR7XG5cdFx0aWYgKHJlc291cmNlRGVwZW5kZW5jeS5pZCA9PSAnbXRsJykge1xuXHRcdFx0dmFyIHN0cjpzdHJpbmcgPSBQYXJzZXJVdGlscy50b1N0cmluZyhyZXNvdXJjZURlcGVuZGVuY3kuZGF0YSk7XG5cdFx0XHR0aGlzLnBhcnNlTXRsKHN0cik7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIGFzc2V0OklBc3NldDtcblxuXHRcdFx0aWYgKHJlc291cmNlRGVwZW5kZW5jeS5hc3NldHMubGVuZ3RoICE9IDEpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRhc3NldCA9IHJlc291cmNlRGVwZW5kZW5jeS5hc3NldHNbMF07XG5cblx0XHRcdGlmIChhc3NldC5hc3NldFR5cGUgPT0gQXNzZXRUeXBlLlRFWFRVUkUpIHtcblxuXHRcdFx0XHR2YXIgbG06TG9hZGVkTWF0ZXJpYWwgPSBuZXcgTG9hZGVkTWF0ZXJpYWwoKTtcblx0XHRcdFx0bG0ubWF0ZXJpYWxJRCA9IHJlc291cmNlRGVwZW5kZW5jeS5pZDtcblx0XHRcdFx0bG0udGV4dHVyZSA9IDxUZXh0dXJlMkRCYXNlPiBhc3NldDtcblxuXHRcdFx0XHR0aGlzLl9tYXRlcmlhbExvYWRlZC5wdXNoKGxtKTtcblxuXHRcdFx0XHRpZiAodGhpcy5fbWVzaGVzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHR0aGlzLmFwcGx5TWF0ZXJpYWwobG0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX2lSZXNvbHZlRGVwZW5kZW5jeUZhaWx1cmUocmVzb3VyY2VEZXBlbmRlbmN5OlJlc291cmNlRGVwZW5kZW5jeSlcblx0e1xuXHRcdGlmIChyZXNvdXJjZURlcGVuZGVuY3kuaWQgPT0gXCJtdGxcIikge1xuXHRcdFx0dGhpcy5fbXRsTGliID0gZmFsc2U7XG5cdFx0XHR0aGlzLl9tdGxMaWJMb2FkZWQgPSBmYWxzZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIGxtOkxvYWRlZE1hdGVyaWFsID0gbmV3IExvYWRlZE1hdGVyaWFsKCk7XG5cdFx0XHRsbS5tYXRlcmlhbElEID0gcmVzb3VyY2VEZXBlbmRlbmN5LmlkO1xuXHRcdFx0dGhpcy5fbWF0ZXJpYWxMb2FkZWQucHVzaChsbSk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX21lc2hlcy5sZW5ndGggPiAwKVxuXHRcdFx0dGhpcy5hcHBseU1hdGVyaWFsKGxtKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9wUHJvY2VlZFBhcnNpbmcoKTpib29sZWFuXG5cdHtcblx0XHR2YXIgbGluZTpzdHJpbmc7XG5cdFx0dmFyIGNyZXR1cm46c3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZSgxMCk7XG5cdFx0dmFyIHRydW5rO1xuXG5cdFx0aWYgKCF0aGlzLl9zdGFydGVkUGFyc2luZykge1xuXHRcdFx0dGhpcy5fdGV4dERhdGEgPSB0aGlzLl9wR2V0VGV4dERhdGEoKTtcblx0XHRcdC8vIE1lcmdlIGxpbmVicmVha3MgdGhhdCBhcmUgaW1tZWRpYXRlbHkgcHJlY2VlZGVkIGJ5XG5cdFx0XHQvLyB0aGUgXCJlc2NhcGVcIiBiYWNrd2FyZCBzbGFzaCBpbnRvIHNpbmdsZSBsaW5lcy5cblx0XHRcdHRoaXMuX3RleHREYXRhID0gdGhpcy5fdGV4dERhdGEucmVwbGFjZSgvXFxcXFtcXHJcXG5dK1xccyovZ20sICcgJyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX3RleHREYXRhLmluZGV4T2YoY3JldHVybikgPT0gLTEpXG5cdFx0XHRjcmV0dXJuID0gU3RyaW5nLmZyb21DaGFyQ29kZSgxMyk7XG5cblx0XHRpZiAoIXRoaXMuX3N0YXJ0ZWRQYXJzaW5nKSB7XG5cdFx0XHR0aGlzLl9zdGFydGVkUGFyc2luZyA9IHRydWU7XG5cdFx0XHR0aGlzLl92ZXJ0aWNlcyA9IG5ldyBBcnJheTxWZXJ0ZXg+KCk7XG5cdFx0XHR0aGlzLl92ZXJ0ZXhOb3JtYWxzID0gbmV3IEFycmF5PFZlcnRleD4oKTtcblx0XHRcdHRoaXMuX21hdGVyaWFsSURzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblx0XHRcdHRoaXMuX21hdGVyaWFsTG9hZGVkID0gbmV3IEFycmF5PExvYWRlZE1hdGVyaWFsPigpO1xuXHRcdFx0dGhpcy5fbWVzaGVzID0gbmV3IEFycmF5PE1lc2g+KCk7XG5cdFx0XHR0aGlzLl91dnMgPSBuZXcgQXJyYXk8VVY+KCk7XG5cdFx0XHR0aGlzLl9zdHJpbmdMZW5ndGggPSB0aGlzLl90ZXh0RGF0YS5sZW5ndGg7XG5cdFx0XHR0aGlzLl9jaGFySW5kZXggPSB0aGlzLl90ZXh0RGF0YS5pbmRleE9mKGNyZXR1cm4sIDApO1xuXHRcdFx0dGhpcy5fb2xkSW5kZXggPSAwO1xuXHRcdFx0dGhpcy5fb2JqZWN0cyA9IG5ldyBBcnJheTxPYmplY3RHcm91cD4oKTtcblx0XHRcdHRoaXMuX29iamVjdEluZGV4ID0gMDtcblx0XHR9XG5cblx0XHR3aGlsZSAodGhpcy5fY2hhckluZGV4IDwgdGhpcy5fc3RyaW5nTGVuZ3RoICYmIHRoaXMuX3BIYXNUaW1lKCkpIHtcblx0XHRcdHRoaXMuX2NoYXJJbmRleCA9IHRoaXMuX3RleHREYXRhLmluZGV4T2YoY3JldHVybiwgdGhpcy5fb2xkSW5kZXgpO1xuXG5cdFx0XHRpZiAodGhpcy5fY2hhckluZGV4ID09IC0xKVxuXHRcdFx0XHR0aGlzLl9jaGFySW5kZXggPSB0aGlzLl9zdHJpbmdMZW5ndGg7XG5cblx0XHRcdGxpbmUgPSB0aGlzLl90ZXh0RGF0YS5zdWJzdHJpbmcodGhpcy5fb2xkSW5kZXgsIHRoaXMuX2NoYXJJbmRleCk7XG5cdFx0XHRsaW5lID0gbGluZS5zcGxpdCgnXFxyJykuam9pbihcIlwiKTtcblx0XHRcdGxpbmUgPSBsaW5lLnJlcGxhY2UoXCIgIFwiLCBcIiBcIik7XG5cdFx0XHR0cnVuayA9IGxpbmUuc3BsaXQoXCIgXCIpO1xuXHRcdFx0dGhpcy5fb2xkSW5kZXggPSB0aGlzLl9jaGFySW5kZXggKyAxO1xuXHRcdFx0dGhpcy5wYXJzZUxpbmUodHJ1bmspO1xuXG5cdFx0XHQvLyBJZiB3aGF0ZXZlciB3YXMgcGFyc2VkIG9uIHRoaXMgbGluZSByZXN1bHRlZCBpbiB0aGVcblx0XHRcdC8vIHBhcnNpbmcgYmVpbmcgcGF1c2VkIHRvIHJldHJpZXZlIGRlcGVuZGVuY2llcywgYnJlYWtcblx0XHRcdC8vIGhlcmUgYW5kIGRvIG5vdCBjb250aW51ZSBwYXJzaW5nIHVudGlsIHVuLXBhdXNlZC5cblx0XHRcdGlmICh0aGlzLnBhcnNpbmdQYXVzZWQpIHtcblx0XHRcdFx0cmV0dXJuIFBhcnNlckJhc2UuTU9SRV9UT19QQVJTRTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9jaGFySW5kZXggPj0gdGhpcy5fc3RyaW5nTGVuZ3RoKSB7XG5cblx0XHRcdGlmICh0aGlzLl9tdGxMaWIgJiYgIXRoaXMuX210bExpYkxvYWRlZCkge1xuXHRcdFx0XHRyZXR1cm4gUGFyc2VyQmFzZS5NT1JFX1RPX1BBUlNFO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnRyYW5zbGF0ZSgpO1xuXHRcdFx0dGhpcy5hcHBseU1hdGVyaWFscygpO1xuXG5cdFx0XHRyZXR1cm4gUGFyc2VyQmFzZS5QQVJTSU5HX0RPTkU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFBhcnNlckJhc2UuTU9SRV9UT19QQVJTRTtcblx0fVxuXG5cdHB1YmxpYyBfcFN0YXJ0UGFyc2luZyhmcmFtZUxpbWl0Om51bWJlcilcblx0e1xuXHRcdHN1cGVyLl9wU3RhcnRQYXJzaW5nKGZyYW1lTGltaXQpO1xuXG5cdFx0Ly9jcmVhdGUgYSBjb250ZW50IG9iamVjdCBmb3IgTG9hZGVyc1xuXHRcdHRoaXMuX3BDb250ZW50ID0gbmV3IERpc3BsYXlPYmplY3RDb250YWluZXIoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQYXJzZXMgYSBzaW5nbGUgbGluZSBpbiB0aGUgT0JKIGZpbGUuXG5cdCAqL1xuXHRwcml2YXRlIHBhcnNlTGluZSh0cnVuaylcblx0e1xuXHRcdHN3aXRjaCAodHJ1bmtbMF0pIHtcblxuXHRcdFx0Y2FzZSBcIm10bGxpYlwiOlxuXG5cdFx0XHRcdHRoaXMuX210bExpYiA9IHRydWU7XG5cdFx0XHRcdHRoaXMuX210bExpYkxvYWRlZCA9IGZhbHNlO1xuXHRcdFx0XHR0aGlzLmxvYWRNdGwodHJ1bmtbMV0pO1xuXG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwiZ1wiOlxuXG5cdFx0XHRcdHRoaXMuY3JlYXRlR3JvdXAodHJ1bmspO1xuXG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwib1wiOlxuXG5cdFx0XHRcdHRoaXMuY3JlYXRlT2JqZWN0KHRydW5rKTtcblxuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcInVzZW10bFwiOlxuXG5cdFx0XHRcdGlmICh0aGlzLl9tdGxMaWIpIHtcblxuXHRcdFx0XHRcdGlmICghdHJ1bmtbMV0pXG5cdFx0XHRcdFx0XHR0cnVua1sxXSA9IFwiZGVmMDAwXCI7XG5cblx0XHRcdFx0XHR0aGlzLl9tYXRlcmlhbElEcy5wdXNoKHRydW5rWzFdKTtcblx0XHRcdFx0XHR0aGlzLl9hY3RpdmVNYXRlcmlhbElEID0gdHJ1bmtbMV07XG5cblx0XHRcdFx0XHRpZiAodGhpcy5fY3VycmVudEdyb3VwKVxuXHRcdFx0XHRcdFx0dGhpcy5fY3VycmVudEdyb3VwLm1hdGVyaWFsSUQgPSB0aGlzLl9hY3RpdmVNYXRlcmlhbElEO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJ2XCI6XG5cblx0XHRcdFx0dGhpcy5wYXJzZVZlcnRleCh0cnVuayk7XG5cblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJ2dFwiOlxuXG5cdFx0XHRcdHRoaXMucGFyc2VVVih0cnVuayk7XG5cblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJ2blwiOlxuXG5cdFx0XHRcdHRoaXMucGFyc2VWZXJ0ZXhOb3JtYWwodHJ1bmspO1xuXG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwiZlwiOlxuXG5cdFx0XHRcdHRoaXMucGFyc2VGYWNlKHRydW5rKTtcblxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyB0aGUgcGFyc2VkIGRhdGEgaW50byBhbiBBd2F5M0Qgc2NlbmVncmFwaCBzdHJ1Y3R1cmVcblx0ICovXG5cdHByaXZhdGUgdHJhbnNsYXRlKClcblx0e1xuXHRcdGZvciAodmFyIG9iakluZGV4Om51bWJlciA9IDA7IG9iakluZGV4IDwgdGhpcy5fb2JqZWN0cy5sZW5ndGg7ICsrb2JqSW5kZXgpIHtcblx0XHRcdHZhciBncm91cHM6QXJyYXk8R3JvdXA+ID0gdGhpcy5fb2JqZWN0c1tvYmpJbmRleF0uZ3JvdXBzO1xuXHRcdFx0dmFyIG51bUdyb3VwczpudW1iZXIgPSBncm91cHMubGVuZ3RoO1xuXHRcdFx0dmFyIG1hdGVyaWFsR3JvdXBzOkFycmF5PE1hdGVyaWFsR3JvdXA+O1xuXHRcdFx0dmFyIG51bU1hdGVyaWFsR3JvdXBzOm51bWJlcjtcblx0XHRcdHZhciBnZW9tZXRyeTpHZW9tZXRyeTtcblx0XHRcdHZhciBtZXNoOk1lc2g7XG5cblx0XHRcdHZhciBtOm51bWJlcjtcblx0XHRcdHZhciBzbTpudW1iZXI7XG5cdFx0XHR2YXIgYm1NYXRlcmlhbDpUcmlhbmdsZU1ldGhvZE1hdGVyaWFsO1xuXG5cdFx0XHRmb3IgKHZhciBnOm51bWJlciA9IDA7IGcgPCBudW1Hcm91cHM7ICsrZykge1xuXHRcdFx0XHRnZW9tZXRyeSA9IG5ldyBHZW9tZXRyeSgpO1xuXHRcdFx0XHRtYXRlcmlhbEdyb3VwcyA9IGdyb3Vwc1tnXS5tYXRlcmlhbEdyb3Vwcztcblx0XHRcdFx0bnVtTWF0ZXJpYWxHcm91cHMgPSBtYXRlcmlhbEdyb3Vwcy5sZW5ndGg7XG5cblx0XHRcdFx0Zm9yIChtID0gMDsgbSA8IG51bU1hdGVyaWFsR3JvdXBzOyArK20pXG5cdFx0XHRcdFx0dGhpcy50cmFuc2xhdGVNYXRlcmlhbEdyb3VwKG1hdGVyaWFsR3JvdXBzW21dLCBnZW9tZXRyeSk7XG5cblx0XHRcdFx0aWYgKGdlb21ldHJ5LnN1Ykdlb21ldHJpZXMubGVuZ3RoID09IDApXG5cdFx0XHRcdFx0Y29udGludWU7XG5cblx0XHRcdFx0Ly8gRmluYWxpemUgYW5kIGZvcmNlIHR5cGUtYmFzZWQgbmFtZVxuXHRcdFx0XHR0aGlzLl9wRmluYWxpemVBc3NldCg8SUFzc2V0PiBnZW9tZXRyeSk7Ly8sIFwiXCIpO1xuXG5cdFx0XHRcdGJtTWF0ZXJpYWwgPSBuZXcgVHJpYW5nbGVNZXRob2RNYXRlcmlhbChEZWZhdWx0TWF0ZXJpYWxNYW5hZ2VyLmdldERlZmF1bHRUZXh0dXJlKCkpO1xuXG5cdFx0XHRcdC8vY2hlY2sgZm9yIG11bHRpcGFzc1xuXHRcdFx0XHRpZiAodGhpcy5tYXRlcmlhbE1vZGUgPj0gMilcblx0XHRcdFx0XHRibU1hdGVyaWFsLm1hdGVyaWFsTW9kZSA9IFRyaWFuZ2xlTWF0ZXJpYWxNb2RlLk1VTFRJX1BBU1M7XG5cblx0XHRcdFx0bWVzaCA9IG5ldyBNZXNoKGdlb21ldHJ5LCBibU1hdGVyaWFsKTtcblxuXHRcdFx0XHRpZiAodGhpcy5fb2JqZWN0c1tvYmpJbmRleF0ubmFtZSkge1xuXHRcdFx0XHRcdC8vIHRoaXMgaXMgYSBmdWxsIGluZGVwZW5kZW50IG9iamVjdCAoJ28nIHRhZyBpbiBPQkogZmlsZSlcblx0XHRcdFx0XHRtZXNoLm5hbWUgPSB0aGlzLl9vYmplY3RzW29iakluZGV4XS5uYW1lO1xuXG5cdFx0XHRcdH0gZWxzZSBpZiAoZ3JvdXBzW2ddLm5hbWUpIHtcblxuXHRcdFx0XHRcdC8vIHRoaXMgaXMgYSBncm91cCBzbyB0aGUgc3ViIGdyb3VwcyBjb250YWluIHRoZSBhY3R1YWwgbWVzaCBvYmplY3QgbmFtZXMgKCdnJyB0YWcgaW4gT0JKIGZpbGUpXG5cdFx0XHRcdFx0bWVzaC5uYW1lID0gZ3JvdXBzW2ddLm5hbWU7XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyBObyBuYW1lIHN0b3JlZC4gVXNlIGVtcHR5IHN0cmluZyB3aGljaCB3aWxsIGZvcmNlIGl0XG5cdFx0XHRcdFx0Ly8gdG8gYmUgb3ZlcnJpZGRlbiBieSBmaW5hbGl6ZUFzc2V0KCkgdG8gdHlwZSBkZWZhdWx0LlxuXHRcdFx0XHRcdG1lc2gubmFtZSA9IFwiXCI7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLl9tZXNoZXMucHVzaChtZXNoKTtcblxuXHRcdFx0XHRpZiAoZ3JvdXBzW2ddLm1hdGVyaWFsSUQgIT0gXCJcIilcblx0XHRcdFx0XHRibU1hdGVyaWFsLm5hbWUgPSBncm91cHNbZ10ubWF0ZXJpYWxJRCArIFwiflwiICsgbWVzaC5uYW1lOyBlbHNlXG5cdFx0XHRcdFx0Ym1NYXRlcmlhbC5uYW1lID0gdGhpcy5fbGFzdE10bElEICsgXCJ+XCIgKyBtZXNoLm5hbWU7XG5cblx0XHRcdFx0aWYgKG1lc2guc3ViTWVzaGVzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRmb3IgKHNtID0gMTsgc20gPCBtZXNoLnN1Yk1lc2hlcy5sZW5ndGg7ICsrc20pXG5cdFx0XHRcdFx0XHRtZXNoLnN1Yk1lc2hlc1tzbV0ubWF0ZXJpYWwgPSBibU1hdGVyaWFsO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9hZGQgdG8gdGhlIGNvbnRlbnQgcHJvcGVydHlcblx0XHRcdFx0KDxEaXNwbGF5T2JqZWN0Q29udGFpbmVyPiB0aGlzLl9wQ29udGVudCkuYWRkQ2hpbGQobWVzaCk7XG5cblx0XHRcdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQoPElBc3NldD4gbWVzaCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRyYW5zbGF0ZXMgYW4gb2JqJ3MgbWF0ZXJpYWwgZ3JvdXAgdG8gYSBzdWJnZW9tZXRyeS5cblx0ICogQHBhcmFtIG1hdGVyaWFsR3JvdXAgVGhlIG1hdGVyaWFsIGdyb3VwIGRhdGEgdG8gY29udmVydC5cblx0ICogQHBhcmFtIGdlb21ldHJ5IFRoZSBHZW9tZXRyeSB0byBjb250YWluIHRoZSBjb252ZXJ0ZWQgU3ViR2VvbWV0cnkuXG5cdCAqL1xuXHRwcml2YXRlIHRyYW5zbGF0ZU1hdGVyaWFsR3JvdXAobWF0ZXJpYWxHcm91cDpNYXRlcmlhbEdyb3VwLCBnZW9tZXRyeTpHZW9tZXRyeSlcblx0e1xuXHRcdHZhciBmYWNlczpBcnJheTxGYWNlRGF0YT4gPSBtYXRlcmlhbEdyb3VwLmZhY2VzO1xuXHRcdHZhciBmYWNlOkZhY2VEYXRhO1xuXHRcdHZhciBudW1GYWNlczpudW1iZXIgPSBmYWNlcy5sZW5ndGg7XG5cdFx0dmFyIG51bVZlcnRzOm51bWJlcjtcblx0XHR2YXIgc3ViOlRyaWFuZ2xlU3ViR2VvbWV0cnk7XG5cblx0XHR2YXIgdmVydGljZXM6QXJyYXk8bnVtYmVyPiA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cdFx0dmFyIHV2czpBcnJheTxudW1iZXI+ID0gbmV3IEFycmF5PG51bWJlcj4oKTtcblx0XHR2YXIgbm9ybWFsczpBcnJheTxudW1iZXI+ID0gbmV3IEFycmF5PG51bWJlcj4oKTtcblx0XHR2YXIgaW5kaWNlczpBcnJheTxudW1iZXI+IC8qdWludCovID0gbmV3IEFycmF5PG51bWJlcj4oKTtcblxuXHRcdHRoaXMuX3JlYWxJbmRpY2VzID0gW107XG5cdFx0dGhpcy5fdmVydGV4SW5kZXggPSAwO1xuXG5cdFx0dmFyIGo6bnVtYmVyO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IG51bUZhY2VzOyArK2kpIHtcblxuXHRcdFx0ZmFjZSA9IGZhY2VzW2ldO1xuXHRcdFx0bnVtVmVydHMgPSBmYWNlLmluZGV4SWRzLmxlbmd0aCAtIDE7XG5cblx0XHRcdGZvciAoaiA9IDE7IGogPCBudW1WZXJ0czsgKytqKSB7XG5cblx0XHRcdFx0dGhpcy50cmFuc2xhdGVWZXJ0ZXhEYXRhKGZhY2UsIGosIHZlcnRpY2VzLCB1dnMsIGluZGljZXMsIG5vcm1hbHMpO1xuXHRcdFx0XHR0aGlzLnRyYW5zbGF0ZVZlcnRleERhdGEoZmFjZSwgMCwgdmVydGljZXMsIHV2cywgaW5kaWNlcywgbm9ybWFscyk7XG5cdFx0XHRcdHRoaXMudHJhbnNsYXRlVmVydGV4RGF0YShmYWNlLCBqICsgMSwgdmVydGljZXMsIHV2cywgaW5kaWNlcywgbm9ybWFscyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICh2ZXJ0aWNlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRzdWIgPSBuZXcgVHJpYW5nbGVTdWJHZW9tZXRyeSh0cnVlKTtcblx0XHRcdHN1Yi5hdXRvRGVyaXZlTm9ybWFscyA9IG5vcm1hbHMubGVuZ3RoPyBmYWxzZSA6IHRydWU7XG5cdFx0XHRzdWIudXBkYXRlSW5kaWNlcyhpbmRpY2VzKTtcblx0XHRcdHN1Yi51cGRhdGVQb3NpdGlvbnModmVydGljZXMpO1xuXHRcdFx0c3ViLnVwZGF0ZVZlcnRleE5vcm1hbHMobm9ybWFscyk7XG5cdFx0XHRzdWIudXBkYXRlVVZzKHV2cyk7XG5cblx0XHRcdGdlb21ldHJ5LmFkZFN1Ykdlb21ldHJ5KHN1Yik7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSB0cmFuc2xhdGVWZXJ0ZXhEYXRhKGZhY2U6RmFjZURhdGEsIHZlcnRleEluZGV4Om51bWJlciwgdmVydGljZXM6QXJyYXk8bnVtYmVyPiwgdXZzOkFycmF5PG51bWJlcj4sIGluZGljZXM6QXJyYXk8bnVtYmVyPiAvKnVpbnQqLywgbm9ybWFsczpBcnJheTxudW1iZXI+KVxuXHR7XG5cdFx0dmFyIGluZGV4Om51bWJlcjtcblx0XHR2YXIgdmVydGV4OlZlcnRleDtcblx0XHR2YXIgdmVydGV4Tm9ybWFsOlZlcnRleDtcblx0XHR2YXIgdXY6VVY7XG5cblx0XHRpZiAoIXRoaXMuX3JlYWxJbmRpY2VzW2ZhY2UuaW5kZXhJZHNbdmVydGV4SW5kZXhdXSkge1xuXG5cdFx0XHRpbmRleCA9IHRoaXMuX3ZlcnRleEluZGV4O1xuXHRcdFx0dGhpcy5fcmVhbEluZGljZXNbZmFjZS5pbmRleElkc1t2ZXJ0ZXhJbmRleF1dID0gKyt0aGlzLl92ZXJ0ZXhJbmRleDtcblx0XHRcdHZlcnRleCA9IHRoaXMuX3ZlcnRpY2VzW2ZhY2UudmVydGV4SW5kaWNlc1t2ZXJ0ZXhJbmRleF0gLSAxXTtcblx0XHRcdHZlcnRpY2VzLnB1c2godmVydGV4LngqdGhpcy5fc2NhbGUsIHZlcnRleC55KnRoaXMuX3NjYWxlLCB2ZXJ0ZXgueip0aGlzLl9zY2FsZSk7XG5cblx0XHRcdGlmIChmYWNlLm5vcm1hbEluZGljZXMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHR2ZXJ0ZXhOb3JtYWwgPSB0aGlzLl92ZXJ0ZXhOb3JtYWxzW2ZhY2Uubm9ybWFsSW5kaWNlc1t2ZXJ0ZXhJbmRleF0gLSAxXTtcblx0XHRcdFx0bm9ybWFscy5wdXNoKHZlcnRleE5vcm1hbC54LCB2ZXJ0ZXhOb3JtYWwueSwgdmVydGV4Tm9ybWFsLnopO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZmFjZS51dkluZGljZXMubGVuZ3RoID4gMCkge1xuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0dXYgPSB0aGlzLl91dnNbZmFjZS51dkluZGljZXNbdmVydGV4SW5kZXhdIC0gMV07XG5cdFx0XHRcdFx0dXZzLnB1c2godXYudSwgdXYudik7XG5cblx0XHRcdFx0fSBjYXRjaCAoZSkge1xuXG5cdFx0XHRcdFx0c3dpdGNoICh2ZXJ0ZXhJbmRleCkge1xuXHRcdFx0XHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHRcdFx0XHR1dnMucHVzaCgwLCAxKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0XHRcdHV2cy5wdXNoKC41LCAwKTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRjYXNlIDI6XG5cdFx0XHRcdFx0XHRcdHV2cy5wdXNoKDEsIDEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0aW5kZXggPSB0aGlzLl9yZWFsSW5kaWNlc1tmYWNlLmluZGV4SWRzW3ZlcnRleEluZGV4XV0gLSAxO1xuXHRcdH1cblxuXHRcdGluZGljZXMucHVzaChpbmRleCk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBvYmplY3QgZ3JvdXAuXG5cdCAqIEBwYXJhbSB0cnVuayBUaGUgZGF0YSBibG9jayBjb250YWluaW5nIHRoZSBvYmplY3QgdGFnIGFuZCBpdHMgcGFyYW1ldGVyc1xuXHQgKi9cblx0cHJpdmF0ZSBjcmVhdGVPYmplY3QodHJ1bmspXG5cdHtcblx0XHR0aGlzLl9jdXJyZW50R3JvdXAgPSBudWxsO1xuXHRcdHRoaXMuX2N1cnJlbnRNYXRlcmlhbEdyb3VwID0gbnVsbDtcblx0XHR0aGlzLl9vYmplY3RzLnB1c2godGhpcy5fY3VycmVudE9iamVjdCA9IG5ldyBPYmplY3RHcm91cCgpKTtcblxuXHRcdGlmICh0cnVuaylcblx0XHRcdHRoaXMuX2N1cnJlbnRPYmplY3QubmFtZSA9IHRydW5rWzFdO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgZ3JvdXAuXG5cdCAqIEBwYXJhbSB0cnVuayBUaGUgZGF0YSBibG9jayBjb250YWluaW5nIHRoZSBncm91cCB0YWcgYW5kIGl0cyBwYXJhbWV0ZXJzXG5cdCAqL1xuXHRwcml2YXRlIGNyZWF0ZUdyb3VwKHRydW5rKVxuXHR7XG5cdFx0aWYgKCF0aGlzLl9jdXJyZW50T2JqZWN0KVxuXHRcdFx0dGhpcy5jcmVhdGVPYmplY3QobnVsbCk7XG5cdFx0dGhpcy5fY3VycmVudEdyb3VwID0gbmV3IEdyb3VwKCk7XG5cblx0XHR0aGlzLl9jdXJyZW50R3JvdXAubWF0ZXJpYWxJRCA9IHRoaXMuX2FjdGl2ZU1hdGVyaWFsSUQ7XG5cblx0XHRpZiAodHJ1bmspXG5cdFx0XHR0aGlzLl9jdXJyZW50R3JvdXAubmFtZSA9IHRydW5rWzFdO1xuXHRcdHRoaXMuX2N1cnJlbnRPYmplY3QuZ3JvdXBzLnB1c2godGhpcy5fY3VycmVudEdyb3VwKTtcblxuXHRcdHRoaXMuY3JlYXRlTWF0ZXJpYWxHcm91cChudWxsKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IG1hdGVyaWFsIGdyb3VwLlxuXHQgKiBAcGFyYW0gdHJ1bmsgVGhlIGRhdGEgYmxvY2sgY29udGFpbmluZyB0aGUgbWF0ZXJpYWwgdGFnIGFuZCBpdHMgcGFyYW1ldGVyc1xuXHQgKi9cblx0cHJpdmF0ZSBjcmVhdGVNYXRlcmlhbEdyb3VwKHRydW5rKVxuXHR7XG5cdFx0dGhpcy5fY3VycmVudE1hdGVyaWFsR3JvdXAgPSBuZXcgTWF0ZXJpYWxHcm91cCgpO1xuXHRcdGlmICh0cnVuaylcblx0XHRcdHRoaXMuX2N1cnJlbnRNYXRlcmlhbEdyb3VwLnVybCA9IHRydW5rWzFdO1xuXHRcdHRoaXMuX2N1cnJlbnRHcm91cC5tYXRlcmlhbEdyb3Vwcy5wdXNoKHRoaXMuX2N1cnJlbnRNYXRlcmlhbEdyb3VwKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWFkcyB0aGUgbmV4dCB2ZXJ0ZXggY29vcmRpbmF0ZXMuXG5cdCAqIEBwYXJhbSB0cnVuayBUaGUgZGF0YSBibG9jayBjb250YWluaW5nIHRoZSB2ZXJ0ZXggdGFnIGFuZCBpdHMgcGFyYW1ldGVyc1xuXHQgKi9cblx0cHJpdmF0ZSBwYXJzZVZlcnRleCh0cnVuaylcblx0e1xuXHRcdC8vZm9yIHRoZSB2ZXJ5IHJhcmUgY2FzZXMgb2Ygb3RoZXIgZGVsaW1pdGVycy9jaGFyY29kZXMgc2VlbiBpbiBzb21lIG9iaiBmaWxlc1xuXG5cdFx0dmFyIHYxOm51bWJlciwgdjI6bnVtYmVyICwgdjM6bnVtYmVyO1xuXHRcdGlmICh0cnVuay5sZW5ndGggPiA0KSB7XG5cdFx0XHR2YXIgblRydW5rID0gW107XG5cdFx0XHR2YXIgdmFsOm51bWJlcjtcblxuXHRcdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAxOyBpIDwgdHJ1bmsubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0dmFsID0gcGFyc2VGbG9hdCh0cnVua1tpXSk7XG5cdFx0XHRcdGlmICghaXNOYU4odmFsKSlcblx0XHRcdFx0XHRuVHJ1bmsucHVzaCh2YWwpO1xuXHRcdFx0fVxuXG5cdFx0XHR2MSA9IDxudW1iZXI+IG5UcnVua1swXTtcblx0XHRcdHYyID0gPG51bWJlcj4gblRydW5rWzFdO1xuXHRcdFx0djMgPSA8bnVtYmVyPiAtblRydW5rWzJdO1xuXHRcdFx0dGhpcy5fdmVydGljZXMucHVzaChuZXcgVmVydGV4KHYxLCB2MiwgdjMpKTtcblxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2MSA9IDxudW1iZXI+IHBhcnNlRmxvYXQodHJ1bmtbMV0pO1xuXHRcdFx0djIgPSA8bnVtYmVyPiBwYXJzZUZsb2F0KHRydW5rWzJdKTtcblx0XHRcdHYzID0gPG51bWJlcj4gLXBhcnNlRmxvYXQodHJ1bmtbM10pO1xuXG5cdFx0XHR0aGlzLl92ZXJ0aWNlcy5wdXNoKG5ldyBWZXJ0ZXgodjEsIHYyLCB2MykpO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFJlYWRzIHRoZSBuZXh0IHV2IGNvb3JkaW5hdGVzLlxuXHQgKiBAcGFyYW0gdHJ1bmsgVGhlIGRhdGEgYmxvY2sgY29udGFpbmluZyB0aGUgdXYgdGFnIGFuZCBpdHMgcGFyYW1ldGVyc1xuXHQgKi9cblx0cHJpdmF0ZSBwYXJzZVVWKHRydW5rKVxuXHR7XG5cdFx0aWYgKHRydW5rLmxlbmd0aCA+IDMpIHtcblx0XHRcdHZhciBuVHJ1bmsgPSBbXTtcblx0XHRcdHZhciB2YWw6bnVtYmVyO1xuXHRcdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAxOyBpIDwgdHJ1bmsubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0dmFsID0gcGFyc2VGbG9hdCh0cnVua1tpXSk7XG5cdFx0XHRcdGlmICghaXNOYU4odmFsKSlcblx0XHRcdFx0XHRuVHJ1bmsucHVzaCh2YWwpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fdXZzLnB1c2gobmV3IFVWKG5UcnVua1swXSwgMSAtIG5UcnVua1sxXSkpO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX3V2cy5wdXNoKG5ldyBVVihwYXJzZUZsb2F0KHRydW5rWzFdKSwgMSAtIHBhcnNlRmxvYXQodHJ1bmtbMl0pKSk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogUmVhZHMgdGhlIG5leHQgdmVydGV4IG5vcm1hbCBjb29yZGluYXRlcy5cblx0ICogQHBhcmFtIHRydW5rIFRoZSBkYXRhIGJsb2NrIGNvbnRhaW5pbmcgdGhlIHZlcnRleCBub3JtYWwgdGFnIGFuZCBpdHMgcGFyYW1ldGVyc1xuXHQgKi9cblx0cHJpdmF0ZSBwYXJzZVZlcnRleE5vcm1hbCh0cnVuaylcblx0e1xuXHRcdGlmICh0cnVuay5sZW5ndGggPiA0KSB7XG5cdFx0XHR2YXIgblRydW5rID0gW107XG5cdFx0XHR2YXIgdmFsOm51bWJlcjtcblx0XHRcdGZvciAodmFyIGk6bnVtYmVyID0gMTsgaSA8IHRydW5rLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdHZhbCA9IHBhcnNlRmxvYXQodHJ1bmtbaV0pO1xuXHRcdFx0XHRpZiAoIWlzTmFOKHZhbCkpXG5cdFx0XHRcdFx0blRydW5rLnB1c2godmFsKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3ZlcnRleE5vcm1hbHMucHVzaChuZXcgVmVydGV4KG5UcnVua1swXSwgblRydW5rWzFdLCAtblRydW5rWzJdKSk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fdmVydGV4Tm9ybWFscy5wdXNoKG5ldyBWZXJ0ZXgocGFyc2VGbG9hdCh0cnVua1sxXSksIHBhcnNlRmxvYXQodHJ1bmtbMl0pLCAtcGFyc2VGbG9hdCh0cnVua1szXSkpKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUmVhZHMgdGhlIG5leHQgZmFjZSdzIGluZGljZXMuXG5cdCAqIEBwYXJhbSB0cnVuayBUaGUgZGF0YSBibG9jayBjb250YWluaW5nIHRoZSBmYWNlIHRhZyBhbmQgaXRzIHBhcmFtZXRlcnNcblx0ICovXG5cdHByaXZhdGUgcGFyc2VGYWNlKHRydW5rKVxuXHR7XG5cdFx0dmFyIGxlbjpudW1iZXIgPSB0cnVuay5sZW5ndGg7XG5cdFx0dmFyIGZhY2U6RmFjZURhdGEgPSBuZXcgRmFjZURhdGEoKTtcblxuXHRcdGlmICghdGhpcy5fY3VycmVudEdyb3VwKSB7XG5cdFx0XHR0aGlzLmNyZWF0ZUdyb3VwKG51bGwpO1xuXHRcdH1cblxuXHRcdHZhciBpbmRpY2VzO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMTsgaSA8IGxlbjsgKytpKSB7XG5cblx0XHRcdGlmICh0cnVua1tpXSA9PSBcIlwiKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpbmRpY2VzID0gdHJ1bmtbaV0uc3BsaXQoXCIvXCIpO1xuXHRcdFx0ZmFjZS52ZXJ0ZXhJbmRpY2VzLnB1c2godGhpcy5wYXJzZUluZGV4KHBhcnNlSW50KGluZGljZXNbMF0pLCB0aGlzLl92ZXJ0aWNlcy5sZW5ndGgpKTtcblxuXHRcdFx0aWYgKGluZGljZXNbMV0gJiYgU3RyaW5nKGluZGljZXNbMV0pLmxlbmd0aCA+IDApXG5cdFx0XHRcdGZhY2UudXZJbmRpY2VzLnB1c2godGhpcy5wYXJzZUluZGV4KHBhcnNlSW50KGluZGljZXNbMV0pLCB0aGlzLl91dnMubGVuZ3RoKSk7XG5cblx0XHRcdGlmIChpbmRpY2VzWzJdICYmIFN0cmluZyhpbmRpY2VzWzJdKS5sZW5ndGggPiAwKVxuXHRcdFx0XHRmYWNlLm5vcm1hbEluZGljZXMucHVzaCh0aGlzLnBhcnNlSW5kZXgocGFyc2VJbnQoaW5kaWNlc1syXSksIHRoaXMuX3ZlcnRleE5vcm1hbHMubGVuZ3RoKSk7XG5cblx0XHRcdGZhY2UuaW5kZXhJZHMucHVzaCh0cnVua1tpXSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fY3VycmVudE1hdGVyaWFsR3JvdXAuZmFjZXMucHVzaChmYWNlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGlzIGlzIGEgaGFjayBhcm91bmQgbmVnYXRpdmUgZmFjZSBjb29yZHNcblx0ICovXG5cdHByaXZhdGUgcGFyc2VJbmRleChpbmRleDpudW1iZXIsIGxlbmd0aDpudW1iZXIpOm51bWJlclxuXHR7XG5cdFx0aWYgKGluZGV4IDwgMClcblx0XHRcdHJldHVybiBpbmRleCArIGxlbmd0aCArIDE7IGVsc2Vcblx0XHRcdHJldHVybiBpbmRleDtcblx0fVxuXG5cdHByaXZhdGUgcGFyc2VNdGwoZGF0YTpzdHJpbmcpXG5cdHtcblx0XHR2YXIgbWF0ZXJpYWxEZWZpbml0aW9ucyA9IGRhdGEuc3BsaXQoJ25ld210bCcpO1xuXHRcdHZhciBsaW5lcztcblx0XHR2YXIgdHJ1bms7XG5cdFx0dmFyIGo6bnVtYmVyO1xuXG5cdFx0dmFyIGJhc2ljU3BlY3VsYXJNZXRob2Q6U3BlY3VsYXJCYXNpY01ldGhvZDtcblx0XHR2YXIgdXNlU3BlY3VsYXI6Ym9vbGVhbjtcblx0XHR2YXIgdXNlQ29sb3I6Ym9vbGVhbjtcblx0XHR2YXIgZGlmZnVzZUNvbG9yOm51bWJlcjtcblx0XHR2YXIgY29sb3I6bnVtYmVyO1xuXHRcdHZhciBzcGVjdWxhckNvbG9yOm51bWJlcjtcblx0XHR2YXIgc3BlY3VsYXI6bnVtYmVyO1xuXHRcdHZhciBhbHBoYTpudW1iZXI7XG5cdFx0dmFyIG1hcGtkOnN0cmluZztcblxuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IG1hdGVyaWFsRGVmaW5pdGlvbnMubGVuZ3RoOyArK2kpIHtcblxuXG5cdFx0XHRsaW5lcyA9IChtYXRlcmlhbERlZmluaXRpb25zW2ldLnNwbGl0KCdcXHInKSkuam9pbihcIlwiKS5zcGxpdCgnXFxuJyk7XG5cdFx0XHQvL2xpbmVzID0gKG1hdGVyaWFsRGVmaW5pdGlvbnNbaV0uc3BsaXQoJ1xccicpIGFzIEFycmF5KS5qb2luKFwiXCIpLnNwbGl0KCdcXG4nKTtcblxuXHRcdFx0aWYgKGxpbmVzLmxlbmd0aCA9PSAxKVxuXHRcdFx0XHRsaW5lcyA9IG1hdGVyaWFsRGVmaW5pdGlvbnNbaV0uc3BsaXQoU3RyaW5nLmZyb21DaGFyQ29kZSgxMykpO1xuXG5cdFx0XHRkaWZmdXNlQ29sb3IgPSBjb2xvciA9IHNwZWN1bGFyQ29sb3IgPSAweEZGRkZGRjtcblx0XHRcdHNwZWN1bGFyID0gMDtcblx0XHRcdHVzZVNwZWN1bGFyID0gZmFsc2U7XG5cdFx0XHR1c2VDb2xvciA9IGZhbHNlO1xuXHRcdFx0YWxwaGEgPSAxO1xuXHRcdFx0bWFwa2QgPSBcIlwiO1xuXG5cdFx0XHRmb3IgKGogPSAwOyBqIDwgbGluZXMubGVuZ3RoOyArK2opIHtcblxuXHRcdFx0XHRsaW5lc1tqXSA9IGxpbmVzW2pdLnJlcGxhY2UoL1xccyskLywgXCJcIik7XG5cblx0XHRcdFx0aWYgKGxpbmVzW2pdLnN1YnN0cmluZygwLCAxKSAhPSBcIiNcIiAmJiAoaiA9PSAwIHx8IGxpbmVzW2pdICE9IFwiXCIpKSB7XG5cdFx0XHRcdFx0dHJ1bmsgPSBsaW5lc1tqXS5zcGxpdChcIiBcIik7XG5cblx0XHRcdFx0XHRpZiAoU3RyaW5nKHRydW5rWzBdKS5jaGFyQ29kZUF0KDApID09IDkgfHwgU3RyaW5nKHRydW5rWzBdKS5jaGFyQ29kZUF0KDApID09IDMyKVxuXHRcdFx0XHRcdFx0dHJ1bmtbMF0gPSB0cnVua1swXS5zdWJzdHJpbmcoMSwgdHJ1bmtbMF0ubGVuZ3RoKTtcblxuXHRcdFx0XHRcdGlmIChqID09IDApIHtcblx0XHRcdFx0XHRcdHRoaXMuX2xhc3RNdGxJRCA9IHRydW5rLmpvaW4oXCJcIik7XG5cdFx0XHRcdFx0XHR0aGlzLl9sYXN0TXRsSUQgPSAodGhpcy5fbGFzdE10bElEID09IFwiXCIpPyBcImRlZjAwMFwiIDogdGhpcy5fbGFzdE10bElEO1xuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRcdFx0c3dpdGNoICh0cnVua1swXSkge1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgXCJLYVwiOlxuXHRcdFx0XHRcdFx0XHRcdGlmICh0cnVua1sxXSAmJiAhaXNOYU4oTnVtYmVyKHRydW5rWzFdKSkgJiYgdHJ1bmtbMl0gJiYgIWlzTmFOKE51bWJlcih0cnVua1syXSkpICYmIHRydW5rWzNdICYmICFpc05hTihOdW1iZXIodHJ1bmtbM10pKSlcblx0XHRcdFx0XHRcdFx0XHRcdGNvbG9yID0gdHJ1bmtbMV0qMjU1IDw8IDE2IHwgdHJ1bmtbMl0qMjU1IDw8IDggfCB0cnVua1szXSoyNTU7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSBcIktzXCI6XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHRydW5rWzFdICYmICFpc05hTihOdW1iZXIodHJ1bmtbMV0pKSAmJiB0cnVua1syXSAmJiAhaXNOYU4oTnVtYmVyKHRydW5rWzJdKSkgJiYgdHJ1bmtbM10gJiYgIWlzTmFOKE51bWJlcih0cnVua1szXSkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzcGVjdWxhckNvbG9yID0gdHJ1bmtbMV0qMjU1IDw8IDE2IHwgdHJ1bmtbMl0qMjU1IDw8IDggfCB0cnVua1szXSoyNTU7XG5cdFx0XHRcdFx0XHRcdFx0XHR1c2VTcGVjdWxhciA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgXCJOc1wiOlxuXHRcdFx0XHRcdFx0XHRcdGlmICh0cnVua1sxXSAmJiAhaXNOYU4oTnVtYmVyKHRydW5rWzFdKSkpXG5cdFx0XHRcdFx0XHRcdFx0XHRzcGVjdWxhciA9IE51bWJlcih0cnVua1sxXSkqMC4wMDE7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHNwZWN1bGFyID09IDApXG5cdFx0XHRcdFx0XHRcdFx0XHR1c2VTcGVjdWxhciA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgXCJLZFwiOlxuXHRcdFx0XHRcdFx0XHRcdGlmICh0cnVua1sxXSAmJiAhaXNOYU4oTnVtYmVyKHRydW5rWzFdKSkgJiYgdHJ1bmtbMl0gJiYgIWlzTmFOKE51bWJlcih0cnVua1syXSkpICYmIHRydW5rWzNdICYmICFpc05hTihOdW1iZXIodHJ1bmtbM10pKSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0ZGlmZnVzZUNvbG9yID0gdHJ1bmtbMV0qMjU1IDw8IDE2IHwgdHJ1bmtbMl0qMjU1IDw8IDggfCB0cnVua1szXSoyNTU7XG5cdFx0XHRcdFx0XHRcdFx0XHR1c2VDb2xvciA9IHRydWU7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0XHRcdGNhc2UgXCJ0clwiOlxuXHRcdFx0XHRcdFx0XHRjYXNlIFwiZFwiOlxuXHRcdFx0XHRcdFx0XHRcdGlmICh0cnVua1sxXSAmJiAhaXNOYU4oTnVtYmVyKHRydW5rWzFdKSkpXG5cdFx0XHRcdFx0XHRcdFx0XHRhbHBoYSA9IE51bWJlcih0cnVua1sxXSk7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0Y2FzZSBcIm1hcF9LZFwiOlxuXHRcdFx0XHRcdFx0XHRcdG1hcGtkID0gdGhpcy5wYXJzZU1hcEtkU3RyaW5nKHRydW5rKTtcblx0XHRcdFx0XHRcdFx0XHRtYXBrZCA9IG1hcGtkLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAobWFwa2QgIT0gXCJcIikge1xuXG5cdFx0XHRcdGlmICh1c2VTcGVjdWxhcikge1xuXG5cdFx0XHRcdFx0YmFzaWNTcGVjdWxhck1ldGhvZCA9IG5ldyBTcGVjdWxhckJhc2ljTWV0aG9kKCk7XG5cdFx0XHRcdFx0YmFzaWNTcGVjdWxhck1ldGhvZC5zcGVjdWxhckNvbG9yID0gc3BlY3VsYXJDb2xvcjtcblx0XHRcdFx0XHRiYXNpY1NwZWN1bGFyTWV0aG9kLnNwZWN1bGFyID0gc3BlY3VsYXI7XG5cblx0XHRcdFx0XHR2YXIgc3BlY3VsYXJEYXRhOlNwZWN1bGFyRGF0YSA9IG5ldyBTcGVjdWxhckRhdGEoKTtcblx0XHRcdFx0XHRzcGVjdWxhckRhdGEuYWxwaGEgPSBhbHBoYTtcblx0XHRcdFx0XHRzcGVjdWxhckRhdGEuYmFzaWNTcGVjdWxhck1ldGhvZCA9IGJhc2ljU3BlY3VsYXJNZXRob2Q7XG5cdFx0XHRcdFx0c3BlY3VsYXJEYXRhLm1hdGVyaWFsSUQgPSB0aGlzLl9sYXN0TXRsSUQ7XG5cblx0XHRcdFx0XHRpZiAoIXRoaXMuX21hdGVyaWFsU3BlY3VsYXJEYXRhKVxuXHRcdFx0XHRcdFx0dGhpcy5fbWF0ZXJpYWxTcGVjdWxhckRhdGEgPSBuZXcgQXJyYXk8U3BlY3VsYXJEYXRhPigpO1xuXG5cdFx0XHRcdFx0dGhpcy5fbWF0ZXJpYWxTcGVjdWxhckRhdGEucHVzaChzcGVjdWxhckRhdGEpO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLl9wQWRkRGVwZW5kZW5jeSh0aGlzLl9sYXN0TXRsSUQsIG5ldyBVUkxSZXF1ZXN0KG1hcGtkKSk7XG5cblx0XHRcdH0gZWxzZSBpZiAodXNlQ29sb3IgJiYgIWlzTmFOKGNvbG9yKSkge1xuXG5cdFx0XHRcdHZhciBsbTpMb2FkZWRNYXRlcmlhbCA9IG5ldyBMb2FkZWRNYXRlcmlhbCgpO1xuXHRcdFx0XHRsbS5tYXRlcmlhbElEID0gdGhpcy5fbGFzdE10bElEO1xuXG5cdFx0XHRcdGlmIChhbHBoYSA9PSAwKVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiV2FybmluZzogYW4gYWxwaGEgdmFsdWUgb2YgMCB3YXMgZm91bmQgaW4gbXRsIGNvbG9yIHRhZyAoVHIgb3IgZCkgcmVmOlwiICsgdGhpcy5fbGFzdE10bElEICsgXCIsIG1lc2goZXMpIHVzaW5nIGl0IHdpbGwgYmUgaW52aXNpYmxlIVwiKTtcblxuXHRcdFx0XHR2YXIgY206VHJpYW5nbGVNZXRob2RNYXRlcmlhbDtcblxuXHRcdFx0XHRpZiAodGhpcy5tYXRlcmlhbE1vZGUgPCAyKSB7XG5cdFx0XHRcdFx0Y20gPSBuZXcgVHJpYW5nbGVNZXRob2RNYXRlcmlhbChjb2xvcik7XG5cblx0XHRcdFx0XHR2YXIgY29sb3JNYXQ6VHJpYW5nbGVNZXRob2RNYXRlcmlhbCA9IDxUcmlhbmdsZU1ldGhvZE1hdGVyaWFsPiBjbTtcblxuXHRcdFx0XHRcdGNvbG9yTWF0LmFscGhhID0gYWxwaGE7XG5cdFx0XHRcdFx0Y29sb3JNYXQuZGlmZnVzZUNvbG9yID0gZGlmZnVzZUNvbG9yO1xuXHRcdFx0XHRcdGNvbG9yTWF0LnJlcGVhdCA9IHRydWU7XG5cblx0XHRcdFx0XHRpZiAodXNlU3BlY3VsYXIpIHtcblx0XHRcdFx0XHRcdGNvbG9yTWF0LnNwZWN1bGFyQ29sb3IgPSBzcGVjdWxhckNvbG9yO1xuXHRcdFx0XHRcdFx0Y29sb3JNYXQuc3BlY3VsYXIgPSBzcGVjdWxhcjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjbSA9IG5ldyBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsKGNvbG9yKTtcblx0XHRcdFx0XHRjbS5tYXRlcmlhbE1vZGUgPSBUcmlhbmdsZU1hdGVyaWFsTW9kZS5NVUxUSV9QQVNTO1xuXG5cdFx0XHRcdFx0dmFyIGNvbG9yTXVsdGlNYXQ6VHJpYW5nbGVNZXRob2RNYXRlcmlhbCA9IDxUcmlhbmdsZU1ldGhvZE1hdGVyaWFsPiBjbTtcblxuXG5cdFx0XHRcdFx0Y29sb3JNdWx0aU1hdC5kaWZmdXNlQ29sb3IgPSBkaWZmdXNlQ29sb3I7XG5cdFx0XHRcdFx0Y29sb3JNdWx0aU1hdC5yZXBlYXQgPSB0cnVlO1xuXG5cdFx0XHRcdFx0aWYgKHVzZVNwZWN1bGFyKSB7XG5cdFx0XHRcdFx0XHRjb2xvck11bHRpTWF0LnNwZWN1bGFyQ29sb3IgPSBzcGVjdWxhckNvbG9yO1xuXHRcdFx0XHRcdFx0Y29sb3JNdWx0aU1hdC5zcGVjdWxhciA9IHNwZWN1bGFyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxtLmNtID0gY207XG5cblx0XHRcdFx0dGhpcy5fbWF0ZXJpYWxMb2FkZWQucHVzaChsbSk7XG5cblx0XHRcdFx0aWYgKHRoaXMuX21lc2hlcy5sZW5ndGggPiAwKVxuXHRcdFx0XHRcdHRoaXMuYXBwbHlNYXRlcmlhbChsbSk7XG5cblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl9tdGxMaWJMb2FkZWQgPSB0cnVlO1xuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZU1hcEtkU3RyaW5nKHRydW5rKTpzdHJpbmdcblx0e1xuXHRcdHZhciB1cmw6c3RyaW5nID0gXCJcIjtcblx0XHR2YXIgaTpudW1iZXI7XG5cdFx0dmFyIGJyZWFrZmxhZzpib29sZWFuO1xuXG5cdFx0Zm9yIChpID0gMTsgaSA8IHRydW5rLmxlbmd0aDspIHtcblx0XHRcdHN3aXRjaCAodHJ1bmtbaV0pIHtcblx0XHRcdFx0Y2FzZSBcIi1ibGVuZHVcIjpcblx0XHRcdFx0Y2FzZSBcIi1ibGVuZHZcIjpcblx0XHRcdFx0Y2FzZSBcIi1jY1wiOlxuXHRcdFx0XHRjYXNlIFwiLWNsYW1wXCI6XG5cdFx0XHRcdGNhc2UgXCItdGV4cmVzXCI6XG5cdFx0XHRcdFx0aSArPSAyOyAvL1NraXAgYWhlYWQgMSBhdHRyaWJ1dGVcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIi1tbVwiOlxuXHRcdFx0XHRcdGkgKz0gMzsgLy9Ta2lwIGFoZWFkIDIgYXR0cmlidXRlc1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiLW9cIjpcblx0XHRcdFx0Y2FzZSBcIi1zXCI6XG5cdFx0XHRcdGNhc2UgXCItdFwiOlxuXHRcdFx0XHRcdGkgKz0gNDsgLy9Ta2lwIGFoZWFkIDMgYXR0cmlidXRlc1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGJyZWFrZmxhZyA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChicmVha2ZsYWcpXG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdC8vUmVjb25zdHJ1Y3QgVVJML2ZpbGVuYW1lXG5cdFx0Zm9yIChpOyBpIDwgdHJ1bmsubGVuZ3RoOyBpKyspIHtcblx0XHRcdHVybCArPSB0cnVua1tpXTtcblx0XHRcdHVybCArPSBcIiBcIjtcblx0XHR9XG5cblx0XHQvL1JlbW92ZSB0aGUgZXh0cmFuZW91cyBzcGFjZSBhbmQvb3IgbmV3bGluZSBmcm9tIHRoZSByaWdodCBzaWRlXG5cdFx0dXJsID0gdXJsLnJlcGxhY2UoL1xccyskLywgXCJcIik7XG5cblx0XHRyZXR1cm4gdXJsO1xuXHR9XG5cblx0cHJpdmF0ZSBsb2FkTXRsKG10bHVybDpzdHJpbmcpXG5cdHtcblx0XHQvLyBBZGQgcmF3LWRhdGEgZGVwZW5kZW5jeSB0byBxdWV1ZSBhbmQgbG9hZCBkZXBlbmRlbmNpZXMgbm93LFxuXHRcdC8vIHdoaWNoIHdpbGwgcGF1c2UgdGhlIHBhcnNpbmcgaW4gdGhlIG1lYW50aW1lLlxuXHRcdHRoaXMuX3BBZGREZXBlbmRlbmN5KCdtdGwnLCBuZXcgVVJMUmVxdWVzdChtdGx1cmwpLCB0cnVlKTtcblx0XHR0aGlzLl9wUGF1c2VBbmRSZXRyaWV2ZURlcGVuZGVuY2llcygpOy8vXG5cdH1cblxuXHRwcml2YXRlIGFwcGx5TWF0ZXJpYWwobG06TG9hZGVkTWF0ZXJpYWwpXG5cdHtcblx0XHR2YXIgZGVjb21wb3NlSUQ7XG5cdFx0dmFyIG1lc2g6TWVzaDtcblx0XHR2YXIgdG06VHJpYW5nbGVNZXRob2RNYXRlcmlhbDtcblx0XHR2YXIgajpudW1iZXI7XG5cdFx0dmFyIHNwZWN1bGFyRGF0YTpTcGVjdWxhckRhdGE7XG5cblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCB0aGlzLl9tZXNoZXMubGVuZ3RoOyArK2kpIHtcblx0XHRcdG1lc2ggPSB0aGlzLl9tZXNoZXNbaV07XG5cdFx0XHRkZWNvbXBvc2VJRCA9IG1lc2gubWF0ZXJpYWwubmFtZS5zcGxpdChcIn5cIik7XG5cblx0XHRcdGlmIChkZWNvbXBvc2VJRFswXSA9PSBsbS5tYXRlcmlhbElEKSB7XG5cblx0XHRcdFx0aWYgKGxtLmNtKSB7XG5cdFx0XHRcdFx0aWYgKG1lc2gubWF0ZXJpYWwpXG5cdFx0XHRcdFx0XHRtZXNoLm1hdGVyaWFsID0gbnVsbDtcblx0XHRcdFx0XHRtZXNoLm1hdGVyaWFsID0gbG0uY207XG5cblx0XHRcdFx0fSBlbHNlIGlmIChsbS50ZXh0dXJlKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMubWF0ZXJpYWxNb2RlIDwgMikgeyAvLyBpZiBtYXRlcmlhbE1vZGUgaXMgMCBvciAxLCB3ZSBjcmVhdGUgYSBTaW5nbGVQYXNzXG5cdFx0XHRcdFx0XHR0bSA9IDxUcmlhbmdsZU1ldGhvZE1hdGVyaWFsID4gbWVzaC5tYXRlcmlhbDtcblxuXHRcdFx0XHRcdFx0dG0udGV4dHVyZSA9IGxtLnRleHR1cmU7XG5cdFx0XHRcdFx0XHR0bS5jb2xvciA9IGxtLmNvbG9yO1xuXHRcdFx0XHRcdFx0dG0uYWxwaGEgPSBsbS5hbHBoYTtcblx0XHRcdFx0XHRcdHRtLnJlcGVhdCA9IHRydWU7XG5cblx0XHRcdFx0XHRcdGlmIChsbS5zcGVjdWxhck1ldGhvZCkge1xuXG5cdFx0XHRcdFx0XHRcdC8vIEJ5IHNldHRpbmcgdGhlIHNwZWN1bGFyTWV0aG9kIHByb3BlcnR5IHRvIG51bGwgYmVmb3JlIGFzc2lnbmluZ1xuXHRcdFx0XHRcdFx0XHQvLyB0aGUgYWN0dWFsIG1ldGhvZCBpbnN0YW5jZSwgd2UgYXZvaWQgaGF2aW5nIHRoZSBwcm9wZXJ0aWVzIG9mXG5cdFx0XHRcdFx0XHRcdC8vIHRoZSBuZXcgbWV0aG9kIGJlaW5nIG92ZXJyaWRkZW4gd2l0aCB0aGUgc2V0dGluZ3MgZnJvbSB0aGUgb2xkXG5cdFx0XHRcdFx0XHRcdC8vIG9uZSwgd2hpY2ggaXMgZGVmYXVsdCBiZWhhdmlvciBvZiB0aGUgc2V0dGVyLlxuXHRcdFx0XHRcdFx0XHR0bS5zcGVjdWxhck1ldGhvZCA9IG51bGw7XG5cdFx0XHRcdFx0XHRcdHRtLnNwZWN1bGFyTWV0aG9kID0gbG0uc3BlY3VsYXJNZXRob2Q7XG5cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fbWF0ZXJpYWxTcGVjdWxhckRhdGEpIHtcblxuXHRcdFx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgdGhpcy5fbWF0ZXJpYWxTcGVjdWxhckRhdGEubGVuZ3RoOyArK2opIHtcblx0XHRcdFx0XHRcdFx0XHRzcGVjdWxhckRhdGEgPSB0aGlzLl9tYXRlcmlhbFNwZWN1bGFyRGF0YVtqXTtcblxuXHRcdFx0XHRcdFx0XHRcdGlmIChzcGVjdWxhckRhdGEubWF0ZXJpYWxJRCA9PSBsbS5tYXRlcmlhbElEKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0bS5zcGVjdWxhck1ldGhvZCA9IG51bGw7IC8vIFByZXZlbnQgcHJvcGVydHkgb3ZlcndyaXRlIChzZWUgYWJvdmUpXG5cdFx0XHRcdFx0XHRcdFx0XHR0bS5zcGVjdWxhck1ldGhvZCA9IHNwZWN1bGFyRGF0YS5iYXNpY1NwZWN1bGFyTWV0aG9kO1xuXHRcdFx0XHRcdFx0XHRcdFx0dG0uY29sb3IgPSBzcGVjdWxhckRhdGEuY29sb3I7XG5cdFx0XHRcdFx0XHRcdFx0XHR0bS5hbHBoYSA9IHNwZWN1bGFyRGF0YS5hbHBoYTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7IC8vaWYgbWF0ZXJpYWxNb2RlPT0yIHRoaXMgaXMgYSBNdWx0aVBhc3NUZXh0dXJlXG5cdFx0XHRcdFx0XHR0bSA9IDxUcmlhbmdsZU1ldGhvZE1hdGVyaWFsPiBtZXNoLm1hdGVyaWFsO1xuXHRcdFx0XHRcdFx0dG0ubWF0ZXJpYWxNb2RlID0gVHJpYW5nbGVNYXRlcmlhbE1vZGUuTVVMVElfUEFTUztcblxuXHRcdFx0XHRcdFx0dG0udGV4dHVyZSA9IGxtLnRleHR1cmU7XG5cdFx0XHRcdFx0XHR0bS5jb2xvciA9IGxtLmNvbG9yO1xuXHRcdFx0XHRcdFx0dG0ucmVwZWF0ID0gdHJ1ZTtcblxuXHRcdFx0XHRcdFx0aWYgKGxtLnNwZWN1bGFyTWV0aG9kKSB7XG5cdFx0XHRcdFx0XHRcdC8vIEJ5IHNldHRpbmcgdGhlIHNwZWN1bGFyTWV0aG9kIHByb3BlcnR5IHRvIG51bGwgYmVmb3JlIGFzc2lnbmluZ1xuXHRcdFx0XHRcdFx0XHQvLyB0aGUgYWN0dWFsIG1ldGhvZCBpbnN0YW5jZSwgd2UgYXZvaWQgaGF2aW5nIHRoZSBwcm9wZXJ0aWVzIG9mXG5cdFx0XHRcdFx0XHRcdC8vIHRoZSBuZXcgbWV0aG9kIGJlaW5nIG92ZXJyaWRkZW4gd2l0aCB0aGUgc2V0dGluZ3MgZnJvbSB0aGUgb2xkXG5cdFx0XHRcdFx0XHRcdC8vIG9uZSwgd2hpY2ggaXMgZGVmYXVsdCBiZWhhdmlvciBvZiB0aGUgc2V0dGVyLlxuXHRcdFx0XHRcdFx0XHR0bS5zcGVjdWxhck1ldGhvZCA9IG51bGw7XG5cdFx0XHRcdFx0XHRcdHRtLnNwZWN1bGFyTWV0aG9kID0gbG0uc3BlY3VsYXJNZXRob2Q7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuX21hdGVyaWFsU3BlY3VsYXJEYXRhKSB7XG5cdFx0XHRcdFx0XHRcdGZvciAoaiA9IDA7IGogPCB0aGlzLl9tYXRlcmlhbFNwZWN1bGFyRGF0YS5sZW5ndGg7ICsraikge1xuXHRcdFx0XHRcdFx0XHRcdHNwZWN1bGFyRGF0YSA9IHRoaXMuX21hdGVyaWFsU3BlY3VsYXJEYXRhW2pdO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKHNwZWN1bGFyRGF0YS5tYXRlcmlhbElEID09IGxtLm1hdGVyaWFsSUQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRtLnNwZWN1bGFyTWV0aG9kID0gbnVsbDsgLy8gUHJldmVudCBwcm9wZXJ0eSBvdmVyd3JpdGUgKHNlZSBhYm92ZSlcblx0XHRcdFx0XHRcdFx0XHRcdHRtLnNwZWN1bGFyTWV0aG9kID0gc3BlY3VsYXJEYXRhLmJhc2ljU3BlY3VsYXJNZXRob2Q7XG5cdFx0XHRcdFx0XHRcdFx0XHR0bS5jb2xvciA9IHNwZWN1bGFyRGF0YS5jb2xvcjtcblxuXHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRtZXNoLm1hdGVyaWFsLm5hbWUgPSBkZWNvbXBvc2VJRFsxXT8gZGVjb21wb3NlSURbMV0gOiBkZWNvbXBvc2VJRFswXTtcblx0XHRcdFx0dGhpcy5fbWVzaGVzLnNwbGljZShpLCAxKTtcblx0XHRcdFx0LS1pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChsbS5jbSB8fCB0bSlcblx0XHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KGxtLmNtIHx8IHRtKTtcblx0fVxuXG5cdHByaXZhdGUgYXBwbHlNYXRlcmlhbHMoKVxuXHR7XG5cdFx0aWYgKHRoaXMuX21hdGVyaWFsTG9hZGVkLmxlbmd0aCA9PSAwKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgdGhpcy5fbWF0ZXJpYWxMb2FkZWQubGVuZ3RoOyArK2kpXG5cdFx0XHR0aGlzLmFwcGx5TWF0ZXJpYWwodGhpcy5fbWF0ZXJpYWxMb2FkZWRbaV0pO1xuXHR9XG59XG5cbmV4cG9ydCA9IE9CSlBhcnNlcjtcblxuY2xhc3MgT2JqZWN0R3JvdXBcbntcblx0cHVibGljIG5hbWU6c3RyaW5nO1xuXHRwdWJsaWMgZ3JvdXBzOkdyb3VwW10gPSBuZXcgQXJyYXk8R3JvdXA+KCk7XG59XG5cbmNsYXNzIEdyb3VwXG57XG5cdHB1YmxpYyBuYW1lOnN0cmluZztcblx0cHVibGljIG1hdGVyaWFsSUQ6c3RyaW5nO1xuXHRwdWJsaWMgbWF0ZXJpYWxHcm91cHM6TWF0ZXJpYWxHcm91cFtdID0gbmV3IEFycmF5PE1hdGVyaWFsR3JvdXA+KCk7XG59XG5cbmNsYXNzIE1hdGVyaWFsR3JvdXBcbntcblx0cHVibGljIHVybDpzdHJpbmc7XG5cdHB1YmxpYyBmYWNlczpGYWNlRGF0YVtdID0gbmV3IEFycmF5PEZhY2VEYXRhPigpO1xufVxuXG5jbGFzcyBTcGVjdWxhckRhdGFcbntcblx0cHVibGljIG1hdGVyaWFsSUQ6c3RyaW5nO1xuXHRwdWJsaWMgYmFzaWNTcGVjdWxhck1ldGhvZDpTcGVjdWxhckJhc2ljTWV0aG9kO1xuXHRwdWJsaWMgY29sb3I6bnVtYmVyID0gMHhGRkZGRkY7XG5cdHB1YmxpYyBhbHBoYTpudW1iZXIgPSAxO1xufVxuXG5jbGFzcyBMb2FkZWRNYXRlcmlhbFxue1xuXHRwdWJsaWMgbWF0ZXJpYWxJRDpzdHJpbmc7XG5cdHB1YmxpYyB0ZXh0dXJlOlRleHR1cmUyREJhc2U7XG5cdHB1YmxpYyBjbTpNYXRlcmlhbEJhc2U7XG5cdHB1YmxpYyBzcGVjdWxhck1ldGhvZDpTcGVjdWxhckJhc2ljTWV0aG9kO1xuXHRwdWJsaWMgY29sb3I6bnVtYmVyID0gMHhGRkZGRkY7XG5cdHB1YmxpYyBhbHBoYTpudW1iZXIgPSAxO1xufVxuXG5jbGFzcyBGYWNlRGF0YVxue1xuXHRwdWJsaWMgdmVydGV4SW5kaWNlczpBcnJheTxudW1iZXI+IC8qdWludCovID0gbmV3IEFycmF5PG51bWJlcj4oKTtcblx0cHVibGljIHV2SW5kaWNlczpBcnJheTxudW1iZXI+IC8qdWludCovID0gbmV3IEFycmF5PG51bWJlcj4oKTtcblx0cHVibGljIG5vcm1hbEluZGljZXM6QXJyYXk8bnVtYmVyPiAvKnVpbnQqLyA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cdHB1YmxpYyBpbmRleElkczpzdHJpbmdbXSA9IG5ldyBBcnJheTxzdHJpbmc+KCk7IC8vIHVzZWQgZm9yIHJlYWwgaW5kZXggbG9va3Vwc1xufVxuXG4vKipcbiogVGV4dHVyZSBjb29yZGluYXRlcyB2YWx1ZSBvYmplY3QuXG4qL1xuY2xhc3MgVVZcbntcblx0cHJpdmF0ZSBfdTpudW1iZXI7XG5cdHByaXZhdGUgX3Y6bnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IDxjb2RlPlVWPC9jb2RlPiBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSAgICB1ICAgICAgICBbb3B0aW9uYWxdICAgIFRoZSBob3Jpem9udGFsIGNvb3JkaW5hdGUgb2YgdGhlIHRleHR1cmUgdmFsdWUuIERlZmF1bHRzIHRvIDAuXG5cdCAqIEBwYXJhbSAgICB2ICAgICAgICBbb3B0aW9uYWxdICAgIFRoZSB2ZXJ0aWNhbCBjb29yZGluYXRlIG9mIHRoZSB0ZXh0dXJlIHZhbHVlLiBEZWZhdWx0cyB0byAwLlxuXHQgKi9cblx0Y29uc3RydWN0b3IodTpudW1iZXIgPSAwLCB2Om51bWJlciA9IDApXG5cdHtcblx0XHR0aGlzLl91ID0gdTtcblx0XHR0aGlzLl92ID0gdjtcblx0fVxuXG5cdC8qKlxuXHQgKiBEZWZpbmVzIHRoZSB2ZXJ0aWNhbCBjb29yZGluYXRlIG9mIHRoZSB0ZXh0dXJlIHZhbHVlLlxuXHQgKi9cblx0cHVibGljIGdldCB2KCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fdjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgdih2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl92ID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogRGVmaW5lcyB0aGUgaG9yaXpvbnRhbCBjb29yZGluYXRlIG9mIHRoZSB0ZXh0dXJlIHZhbHVlLlxuXHQgKi9cblx0cHVibGljIGdldCB1KCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fdTtcblx0fVxuXG5cdHB1YmxpYyBzZXQgdSh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl91ID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogcmV0dXJucyBhIG5ldyBVViB2YWx1ZSBPYmplY3Rcblx0ICovXG5cdHB1YmxpYyBjbG9uZSgpOlVWXG5cdHtcblx0XHRyZXR1cm4gbmV3IFVWKHRoaXMuX3UsIHRoaXMuX3YpO1xuXHR9XG5cblx0LyoqXG5cdCAqIHJldHVybnMgdGhlIHZhbHVlIG9iamVjdCBhcyBhIHN0cmluZyBmb3IgdHJhY2UvZGVidWcgcHVycG9zZVxuXHQgKi9cblx0cHVibGljIHRvU3RyaW5nKCk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fdSArIFwiLFwiICsgdGhpcy5fdjtcblx0fVxufVxuXG5jbGFzcyBWZXJ0ZXhcbntcblx0cHJpdmF0ZSBfeDpudW1iZXI7XG5cdHByaXZhdGUgX3k6bnVtYmVyO1xuXHRwcml2YXRlIF96Om51bWJlcjtcblx0cHJpdmF0ZSBfaW5kZXg6bnVtYmVyO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IDxjb2RlPlZlcnRleDwvY29kZT4gdmFsdWUgb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gICAgeCAgICAgICAgICAgIFtvcHRpb25hbF0gICAgVGhlIHggdmFsdWUuIERlZmF1bHRzIHRvIDAuXG5cdCAqIEBwYXJhbSAgICB5ICAgICAgICAgICAgW29wdGlvbmFsXSAgICBUaGUgeSB2YWx1ZS4gRGVmYXVsdHMgdG8gMC5cblx0ICogQHBhcmFtICAgIHogICAgICAgICAgICBbb3B0aW9uYWxdICAgIFRoZSB6IHZhbHVlLiBEZWZhdWx0cyB0byAwLlxuXHQgKiBAcGFyYW0gICAgaW5kZXggICAgICAgIFtvcHRpb25hbF0gICAgVGhlIGluZGV4IHZhbHVlLiBEZWZhdWx0cyBpcyBOYU4uXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcih4Om51bWJlciA9IDAsIHk6bnVtYmVyID0gMCwgejpudW1iZXIgPSAwLCBpbmRleDpudW1iZXIgPSAwKVxuXHR7XG5cdFx0dGhpcy5feCA9IHg7XG5cdFx0dGhpcy5feSA9IHk7XG5cdFx0dGhpcy5feiA9IHo7XG5cdFx0dGhpcy5faW5kZXggPSBpbmRleDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUbyBkZWZpbmUvc3RvcmUgdGhlIGluZGV4IG9mIHZhbHVlIG9iamVjdFxuXHQgKiBAcGFyYW0gICAgaW5kICAgICAgICBUaGUgaW5kZXhcblx0ICovXG5cdHB1YmxpYyBzZXQgaW5kZXgoaW5kOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX2luZGV4ID0gaW5kO1xuXHR9XG5cblx0cHVibGljIGdldCBpbmRleCgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX2luZGV4O1xuXHR9XG5cblx0LyoqXG5cdCAqIFRvIGRlZmluZS9zdG9yZSB0aGUgeCB2YWx1ZSBvZiB0aGUgdmFsdWUgb2JqZWN0XG5cdCAqIEBwYXJhbSAgICB2YWx1ZSAgICAgICAgVGhlIHggdmFsdWVcblx0ICovXG5cdHB1YmxpYyBnZXQgeCgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3g7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHgodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5feCA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRvIGRlZmluZS9zdG9yZSB0aGUgeSB2YWx1ZSBvZiB0aGUgdmFsdWUgb2JqZWN0XG5cdCAqIEBwYXJhbSAgICB2YWx1ZSAgICAgICAgVGhlIHkgdmFsdWVcblx0ICovXG5cdHB1YmxpYyBnZXQgeSgpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3k7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHkodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5feSA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRvIGRlZmluZS9zdG9yZSB0aGUgeiB2YWx1ZSBvZiB0aGUgdmFsdWUgb2JqZWN0XG5cdCAqIEBwYXJhbSAgICB2YWx1ZSAgICAgICAgVGhlIHogdmFsdWVcblx0ICovXG5cdHB1YmxpYyBnZXQgeigpOm51bWJlclxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuX3o7XG5cdH1cblxuXHRwdWJsaWMgc2V0IHoodmFsdWU6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5feiA9IHZhbHVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIHJldHVybnMgYSBuZXcgVmVydGV4IHZhbHVlIE9iamVjdFxuXHQgKi9cblx0cHVibGljIGNsb25lKCk6VmVydGV4XG5cdHtcblx0XHRyZXR1cm4gbmV3IFZlcnRleCh0aGlzLl94LCB0aGlzLl95LCB0aGlzLl96KTtcblx0fVxufSJdfQ==