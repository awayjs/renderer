var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DisplayObjectContainer = require("awayjs-core/lib/containers/DisplayObjectContainer");
var Geometry = require("awayjs-core/lib/core/base/Geometry");
var TriangleSubGeometry = require("awayjs-core/lib/core/base/TriangleSubGeometry");
var Matrix3D = require("awayjs-core/lib/core/geom/Matrix3D");
var Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
var AssetType = require("awayjs-core/lib/core/library/AssetType");
var URLLoaderDataFormat = require("awayjs-core/lib/core/net/URLLoaderDataFormat");
var URLRequest = require("awayjs-core/lib/core/net/URLRequest");
var Mesh = require("awayjs-core/lib/entities/Mesh");
var ParserBase = require("awayjs-core/lib/parsers/ParserBase");
var ParserUtils = require("awayjs-core/lib/parsers/ParserUtils");
var DefaultMaterialManager = require("awayjs-stagegl/lib/materials/utils/DefaultMaterialManager");
var TriangleMethodMaterial = require("awayjs-stagegl/lib/materials/TriangleMethodMaterial");
var TriangleMaterialMode = require("awayjs-stagegl/lib/materials/TriangleMaterialMode");
var FaceVO = require("awayjs-renderergl/lib/parsers/data/FaceVO");
var MaterialVO = require("awayjs-renderergl/lib/parsers/data/MaterialVO");
var ObjectVO = require("awayjs-renderergl/lib/parsers/data/ObjectVO");
var TextureVO = require("awayjs-renderergl/lib/parsers/data/TextureVO");
var VertexVO = require("awayjs-renderergl/lib/parsers/data/VertexVO");
/**
 * Max3DSParser provides a parser for the 3ds data type.
 */
var Max3DSParser = (function (_super) {
    __extends(Max3DSParser, _super);
    /**
     * Creates a new <code>Max3DSParser</code> object.
     *
     * @param useSmoothingGroups Determines whether the parser looks for smoothing groups in the 3ds file or assumes uniform smoothing. Defaults to true.
     */
    function Max3DSParser(useSmoothingGroups) {
        if (useSmoothingGroups === void 0) { useSmoothingGroups = true; }
        _super.call(this, URLLoaderDataFormat.ARRAY_BUFFER);
        this._useSmoothingGroups = useSmoothingGroups;
    }
    /**
     * Indicates whether or not a given file extension is supported by the parser.
     * @param extension The file extension of a potential file to be parsed.
     * @return Whether or not the given file type is supported.
     */
    Max3DSParser.supportsType = function (extension) {
        extension = extension.toLowerCase();
        return extension == "3ds";
    };
    /**
     * Tests whether a data block can be parsed by the parser.
     * @param data The data block to potentially be parsed.
     * @return Whether or not the given data is supported.
     */
    Max3DSParser.supportsData = function (data) {
        var ba;
        ba = ParserUtils.toByteArray(data);
        if (ba) {
            ba.position = 0;
            if (ba.readShort() == 0x4d4d)
                return true;
        }
        return false;
    };
    /**
     * @inheritDoc
     */
    Max3DSParser.prototype._iResolveDependency = function (resourceDependency) {
        if (resourceDependency.assets.length == 1) {
            var asset;
            asset = resourceDependency.assets[0];
            if (asset.assetType == AssetType.TEXTURE) {
                var tex;
                tex = this._textures[resourceDependency.id];
                tex.texture = asset;
            }
        }
    };
    /**
     * @inheritDoc
     */
    Max3DSParser.prototype._iResolveDependencyFailure = function (resourceDependency) {
        // TODO: Implement
    };
    /**
     * @inheritDoc
     */
    Max3DSParser.prototype._pProceedParsing = function () {
        if (!this._byteData) {
            this._byteData = this._pGetByteData();
            this._byteData.position = 0;
            //----------------------------------------------------------------------------
            // LITTLE_ENDIAN - Default for ArrayBuffer / Not implemented in ByteArray
            //----------------------------------------------------------------------------
            //this._byteData.endian = Endian.LITTLE_ENDIAN;// Should be default
            //----------------------------------------------------------------------------
            this._textures = {};
            this._materials = {};
            this._unfinalized_objects = {};
        }
        while (this._pHasTime()) {
            // If we are currently working on an object, and the most recent chunk was
            // the last one in that object, finalize the current object.
            if (this._cur_mat && this._byteData.position >= this._cur_mat_end)
                this.finalizeCurrentMaterial();
            else if (this._cur_obj && this._byteData.position >= this._cur_obj_end) {
                // Can't finalize at this point, because we have to wait until the full
                // animation section has been parsed for any potential pivot definitions
                this._unfinalized_objects[this._cur_obj.name] = this._cur_obj;
                this._cur_obj_end = Number.MAX_VALUE;
                this._cur_obj = null;
            }
            if (this._byteData.getBytesAvailable() > 0) {
                var cid /*uint*/;
                var len /*uint*/;
                var end /*uint*/;
                cid = this._byteData.readUnsignedShort();
                len = this._byteData.readUnsignedInt();
                end = this._byteData.position + (len - 6);
                switch (cid) {
                    case 0x4D4D:
                    case 0x3D3D:
                    case 0xB000:
                        continue;
                        break;
                    case 0xAFFF:
                        this._cur_mat_end = end;
                        this._cur_mat = this.parseMaterial();
                        break;
                    case 0x4000:
                        this._cur_obj_end = end;
                        this._cur_obj = new ObjectVO();
                        this._cur_obj.name = this.readNulTermstring();
                        this._cur_obj.materials = new Array();
                        this._cur_obj.materialFaces = {};
                        break;
                    case 0x4100:
                        this._cur_obj.type = AssetType.MESH;
                        break;
                    case 0x4110:
                        this.parseVertexList();
                        break;
                    case 0x4120:
                        this.parseFaceList();
                        break;
                    case 0x4140:
                        this.parseUVList();
                        break;
                    case 0x4130:
                        this.parseFaceMaterialList();
                        break;
                    case 0x4160:
                        this._cur_obj.transform = this.readTransform();
                        break;
                    case 0xB002:
                        this.parseObjectAnimation(end);
                        break;
                    case 0x4150:
                        this.parseSmoothingGroups();
                        break;
                    default:
                        // Skip this (unknown) chunk
                        this._byteData.position += (len - 6);
                        break;
                }
                // Pause parsing if there were any dependencies found during this
                // iteration (i.e. if there are any dependencies that need to be
                // retrieved at this time.)
                if (this.dependencies.length) {
                    this._pPauseAndRetrieveDependencies();
                    break;
                }
            }
        }
        // More parsing is required if the entire byte array has not yet
        // been read, or if there is a currently non-finalized object in
        // the pipeline.
        if (this._byteData.getBytesAvailable() || this._cur_obj || this._cur_mat) {
            return ParserBase.MORE_TO_PARSE;
        }
        else {
            var name;
            for (name in this._unfinalized_objects) {
                var obj;
                obj = this.constructObject(this._unfinalized_objects[name]);
                if (obj) {
                    //add to the content property
                    this._pContent.addChild(obj);
                    this._pFinalizeAsset(obj, name);
                }
            }
            return ParserBase.PARSING_DONE;
        }
    };
    Max3DSParser.prototype._pStartParsing = function (frameLimit) {
        _super.prototype._pStartParsing.call(this, frameLimit);
        //create a content object for Loaders
        this._pContent = new DisplayObjectContainer();
    };
    Max3DSParser.prototype.parseMaterial = function () {
        var mat;
        mat = new MaterialVO();
        while (this._byteData.position < this._cur_mat_end) {
            var cid /*uint*/;
            var len /*uint*/;
            var end /*uint*/;
            cid = this._byteData.readUnsignedShort();
            len = this._byteData.readUnsignedInt();
            end = this._byteData.position + (len - 6);
            switch (cid) {
                case 0xA000:
                    mat.name = this.readNulTermstring();
                    break;
                case 0xA010:
                    mat.ambientColor = this.readColor();
                    break;
                case 0xA020:
                    mat.diffuseColor = this.readColor();
                    break;
                case 0xA030:
                    mat.specularColor = this.readColor();
                    break;
                case 0xA081:
                    mat.twoSided = true;
                    break;
                case 0xA200:
                    mat.colorMap = this.parseTexture(end);
                    break;
                case 0xA204:
                    mat.specularMap = this.parseTexture(end);
                    break;
                default:
                    this._byteData.position = end;
                    break;
            }
        }
        return mat;
    };
    Max3DSParser.prototype.parseTexture = function (end /*uint*/) {
        var tex;
        tex = new TextureVO();
        while (this._byteData.position < end) {
            var cid /*uint*/;
            var len /*uint*/;
            cid = this._byteData.readUnsignedShort();
            len = this._byteData.readUnsignedInt();
            switch (cid) {
                case 0xA300:
                    tex.url = this.readNulTermstring();
                    break;
                default:
                    // Skip this unknown texture sub-chunk
                    this._byteData.position += (len - 6);
                    break;
            }
        }
        this._textures[tex.url] = tex;
        this._pAddDependency(tex.url, new URLRequest(tex.url));
        return tex;
    };
    Max3DSParser.prototype.parseVertexList = function () {
        var i /*uint*/;
        var len /*uint*/;
        var count /*uint*/;
        count = this._byteData.readUnsignedShort();
        this._cur_obj.verts = new Array(count * 3);
        i = 0;
        len = this._cur_obj.verts.length;
        while (i < len) {
            var x, y, z;
            x = this._byteData.readFloat();
            y = this._byteData.readFloat();
            z = this._byteData.readFloat();
            this._cur_obj.verts[i++] = x;
            this._cur_obj.verts[i++] = z;
            this._cur_obj.verts[i++] = y;
        }
    };
    Max3DSParser.prototype.parseFaceList = function () {
        var i /*uint*/;
        var len /*uint*/;
        var count /*uint*/;
        count = this._byteData.readUnsignedShort();
        this._cur_obj.indices = new Array(count * 3);
        i = 0;
        len = this._cur_obj.indices.length;
        while (i < len) {
            var i0 /*uint*/, i1 /*uint*/, i2 /*uint*/;
            i0 = this._byteData.readUnsignedShort();
            i1 = this._byteData.readUnsignedShort();
            i2 = this._byteData.readUnsignedShort();
            this._cur_obj.indices[i++] = i0;
            this._cur_obj.indices[i++] = i2;
            this._cur_obj.indices[i++] = i1;
            // Skip "face info", irrelevant in Away3D
            this._byteData.position += 2;
        }
        this._cur_obj.smoothingGroups = new Array(count);
    };
    Max3DSParser.prototype.parseSmoothingGroups = function () {
        var len = this._cur_obj.indices.length / 3;
        var i = 0;
        while (i < len) {
            this._cur_obj.smoothingGroups[i] = this._byteData.readUnsignedInt();
            i++;
        }
    };
    Max3DSParser.prototype.parseUVList = function () {
        var i /*uint*/;
        var len /*uint*/;
        var count /*uint*/;
        count = this._byteData.readUnsignedShort();
        this._cur_obj.uvs = new Array(count * 2);
        i = 0;
        len = this._cur_obj.uvs.length;
        while (i < len) {
            this._cur_obj.uvs[i++] = this._byteData.readFloat();
            this._cur_obj.uvs[i++] = 1.0 - this._byteData.readFloat();
        }
    };
    Max3DSParser.prototype.parseFaceMaterialList = function () {
        var mat;
        var count /*uint*/;
        var i /*uint*/;
        var faces /*uint*/;
        mat = this.readNulTermstring();
        count = this._byteData.readUnsignedShort();
        faces = new Array(count);
        i = 0;
        while (i < faces.length)
            faces[i++] = this._byteData.readUnsignedShort();
        this._cur_obj.materials.push(mat);
        this._cur_obj.materialFaces[mat] = faces;
    };
    Max3DSParser.prototype.parseObjectAnimation = function (end) {
        var vo;
        var obj;
        var pivot;
        var name;
        var hier /*uint*/;
        // Pivot defaults to origin
        pivot = new Vector3D;
        while (this._byteData.position < end) {
            var cid /*uint*/;
            var len /*uint*/;
            cid = this._byteData.readUnsignedShort();
            len = this._byteData.readUnsignedInt();
            switch (cid) {
                case 0xb010:
                    name = this.readNulTermstring();
                    this._byteData.position += 4;
                    hier = this._byteData.readShort();
                    break;
                case 0xb013:
                    pivot.x = this._byteData.readFloat();
                    pivot.z = this._byteData.readFloat();
                    pivot.y = this._byteData.readFloat();
                    break;
                default:
                    this._byteData.position += (len - 6);
                    break;
            }
        }
        // If name is "$$$DUMMY" this is an empty object (e.g. a container)
        // and will be ignored in this version of the parser
        // TODO: Implement containers in 3DS parser.
        if (name != '$$$DUMMY' && this._unfinalized_objects.hasOwnProperty(name)) {
            vo = this._unfinalized_objects[name];
            obj = this.constructObject(vo, pivot);
            if (obj) {
                //add to the content property
                this._pContent.addChild(obj);
                this._pFinalizeAsset(obj, vo.name);
            }
            delete this._unfinalized_objects[name];
        }
    };
    Max3DSParser.prototype.constructObject = function (obj, pivot) {
        if (pivot === void 0) { pivot = null; }
        if (obj.type == AssetType.MESH) {
            var i /*uint*/;
            var sub;
            var geom;
            var mat;
            var mesh;
            var mtx;
            var vertices;
            var faces;
            if (obj.materials.length > 1)
                console.log("The Away3D 3DS parser does not support multiple materials per mesh at this point.");
            // Ignore empty objects
            if (!obj.indices || obj.indices.length == 0)
                return null;
            vertices = new Array(obj.verts.length / 3);
            faces = new Array(obj.indices.length / 3);
            this.prepareData(vertices, faces, obj);
            if (this._useSmoothingGroups)
                this.applySmoothGroups(vertices, faces);
            obj.verts = new Array(vertices.length * 3);
            for (i = 0; i < vertices.length; i++) {
                obj.verts[i * 3] = vertices[i].x;
                obj.verts[i * 3 + 1] = vertices[i].y;
                obj.verts[i * 3 + 2] = vertices[i].z;
            }
            obj.indices = new Array(faces.length * 3);
            for (i = 0; i < faces.length; i++) {
                obj.indices[i * 3] = faces[i].a;
                obj.indices[i * 3 + 1] = faces[i].b;
                obj.indices[i * 3 + 2] = faces[i].c;
            }
            if (obj.uvs) {
                // If the object had UVs to start with, use UVs generated by
                // smoothing group splitting algorithm. Otherwise those UVs
                // will be nonsense and should be skipped.
                obj.uvs = new Array(vertices.length * 2);
                for (i = 0; i < vertices.length; i++) {
                    obj.uvs[i * 2] = vertices[i].u;
                    obj.uvs[i * 2 + 1] = vertices[i].v;
                }
            }
            geom = new Geometry();
            // Construct sub-geometries (potentially splitting buffers)
            // and add them to geometry.
            sub = new TriangleSubGeometry(true);
            sub.updateIndices(obj.indices);
            sub.updatePositions(obj.verts);
            sub.updateUVs(obj.uvs);
            geom.addSubGeometry(sub);
            if (obj.materials.length > 0) {
                var mname;
                mname = obj.materials[0];
                mat = this._materials[mname].material;
            }
            // Apply pivot translation to geometry if a pivot was
            // found while parsing the keyframe chunk earlier.
            if (pivot) {
                if (obj.transform) {
                    // If a transform was found while parsing the
                    // object chunk, use it to find the local pivot vector
                    var dat = obj.transform.concat();
                    dat[12] = 0;
                    dat[13] = 0;
                    dat[14] = 0;
                    mtx = new Matrix3D(dat);
                    pivot = mtx.transformVector(pivot);
                }
                pivot.scaleBy(-1);
                mtx = new Matrix3D();
                mtx.appendTranslation(pivot.x, pivot.y, pivot.z);
                geom.applyTransformation(mtx);
            }
            // Apply transformation to geometry if a transformation
            // was found while parsing the object chunk earlier.
            if (obj.transform) {
                mtx = new Matrix3D(obj.transform);
                mtx.invert();
                geom.applyTransformation(mtx);
            }
            // Final transform applied to geometry. Finalize the geometry,
            // which will no longer be modified after this point.
            this._pFinalizeAsset(geom, obj.name.concat('_geom'));
            // Build mesh and return it
            mesh = new Mesh(geom, mat);
            mesh.transform.matrix3D = new Matrix3D(obj.transform);
            return mesh;
        }
        // If reached, unknown
        return null;
    };
    Max3DSParser.prototype.prepareData = function (vertices, faces, obj) {
        // convert raw ObjectVO's data to structured VertexVO and FaceVO
        var i /*int*/;
        var j /*int*/;
        var k /*int*/;
        var len = obj.verts.length;
        for (i = 0, j = 0, k = 0; i < len;) {
            var v = new VertexVO;
            v.x = obj.verts[i++];
            v.y = obj.verts[i++];
            v.z = obj.verts[i++];
            if (obj.uvs) {
                v.u = obj.uvs[j++];
                v.v = obj.uvs[j++];
            }
            vertices[k++] = v;
        }
        len = obj.indices.length;
        for (i = 0, k = 0; i < len;) {
            var f = new FaceVO();
            f.a = obj.indices[i++];
            f.b = obj.indices[i++];
            f.c = obj.indices[i++];
            f.smoothGroup = obj.smoothingGroups[k] || 0;
            faces[k++] = f;
        }
    };
    Max3DSParser.prototype.applySmoothGroups = function (vertices, faces) {
        // clone vertices according to following rule:
        // clone if vertex's in faces from groups 1+2 and 3
        // don't clone if vertex's in faces from groups 1+2, 3 and 1+3
        var i /*int*/;
        var j /*int*/;
        var k /*int*/;
        var l /*int*/;
        var len /*int*/;
        var numVerts = vertices.length;
        var numFaces = faces.length;
        // extract groups data for vertices
        var vGroups = new Array(numVerts) /*uint*/;
        for (i = 0; i < numVerts; i++)
            vGroups[i] = new Array();
        for (i = 0; i < numFaces; i++) {
            var face = faces[i];
            for (j = 0; j < 3; j++) {
                var groups = vGroups[(j == 0) ? face.a : ((j == 1) ? face.b : face.c)];
                var group = face.smoothGroup;
                for (k = groups.length - 1; k >= 0; k--) {
                    if ((group & groups[k]) > 0) {
                        group |= groups[k];
                        groups.splice(k, 1);
                        k = groups.length - 1;
                    }
                }
                groups.push(group);
            }
        }
        // clone vertices
        var vClones = new Array(numVerts) /*uint*/;
        for (i = 0; i < numVerts; i++) {
            if ((len = vGroups[i].length) < 1)
                continue;
            var clones = new Array(len) /*uint*/;
            vClones[i] = clones;
            clones[0] = i;
            var v0 = vertices[i];
            for (j = 1; j < len; j++) {
                var v1 = new VertexVO;
                v1.x = v0.x;
                v1.y = v0.y;
                v1.z = v0.z;
                v1.u = v0.u;
                v1.v = v0.v;
                clones[j] = vertices.length;
                vertices.push(v1);
            }
        }
        numVerts = vertices.length;
        for (i = 0; i < numFaces; i++) {
            face = faces[i];
            group = face.smoothGroup;
            for (j = 0; j < 3; j++) {
                k = (j == 0) ? face.a : ((j == 1) ? face.b : face.c);
                groups = vGroups[k];
                len = groups.length;
                clones = vClones[k];
                for (l = 0; l < len; l++) {
                    if (((group == 0) && (groups[l] == 0)) || ((group & groups[l]) > 0)) {
                        var index = clones[l];
                        if (group == 0) {
                            // vertex is unique if no smoothGroup found
                            groups.splice(l, 1);
                            clones.splice(l, 1);
                        }
                        if (j == 0)
                            face.a = index;
                        else if (j == 1)
                            face.b = index;
                        else
                            face.c = index;
                        l = len;
                    }
                }
            }
        }
    };
    Max3DSParser.prototype.finalizeCurrentMaterial = function () {
        var mat;
        if (this._cur_mat.colorMap)
            mat = new TriangleMethodMaterial(this._cur_mat.colorMap.texture || DefaultMaterialManager.getDefaultTexture());
        else
            mat = new TriangleMethodMaterial(this._cur_mat.ambientColor);
        mat.diffuseColor = this._cur_mat.diffuseColor;
        mat.specularColor = this._cur_mat.specularColor;
        if (this.materialMode >= 2)
            mat.materialMode = TriangleMaterialMode.MULTI_PASS;
        mat.bothSides = this._cur_mat.twoSided;
        this._pFinalizeAsset(mat, this._cur_mat.name);
        this._materials[this._cur_mat.name] = this._cur_mat;
        this._cur_mat.material = mat;
        this._cur_mat = null;
    };
    Max3DSParser.prototype.readNulTermstring = function () {
        var chr /*int*/;
        var str = "";
        while ((chr = this._byteData.readUnsignedByte()) > 0)
            str += String.fromCharCode(chr);
        return str;
    };
    Max3DSParser.prototype.readTransform = function () {
        var data;
        data = new Array(16);
        // X axis
        data[0] = this._byteData.readFloat(); // X
        data[2] = this._byteData.readFloat(); // Z
        data[1] = this._byteData.readFloat(); // Y
        data[3] = 0;
        // Z axis
        data[8] = this._byteData.readFloat(); // X
        data[10] = this._byteData.readFloat(); // Z
        data[9] = this._byteData.readFloat(); // Y
        data[11] = 0;
        // Y Axis
        data[4] = this._byteData.readFloat(); // X
        data[6] = this._byteData.readFloat(); // Z
        data[5] = this._byteData.readFloat(); // Y
        data[7] = 0;
        // Translation
        data[12] = this._byteData.readFloat(); // X
        data[14] = this._byteData.readFloat(); // Z
        data[13] = this._byteData.readFloat(); // Y
        data[15] = 1;
        return data;
    };
    Max3DSParser.prototype.readColor = function () {
        var cid /*int*/;
        var len /*int*/;
        var r /*int*/, g /*int*/, b /*int*/;
        cid = this._byteData.readUnsignedShort();
        len = this._byteData.readUnsignedInt();
        switch (cid) {
            case 0x0010:
                r = this._byteData.readFloat() * 255;
                g = this._byteData.readFloat() * 255;
                b = this._byteData.readFloat() * 255;
                break;
            case 0x0011:
                r = this._byteData.readUnsignedByte();
                g = this._byteData.readUnsignedByte();
                b = this._byteData.readUnsignedByte();
                break;
            default:
                this._byteData.position += (len - 6);
                break;
        }
        return (r << 16) | (g << 8) | b;
    };
    return Max3DSParser;
})(ParserBase);
module.exports = Max3DSParser;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNlcnMvbWF4M2RzcGFyc2VyLnRzIl0sIm5hbWVzIjpbIk1heDNEU1BhcnNlciIsIk1heDNEU1BhcnNlci5jb25zdHJ1Y3RvciIsIk1heDNEU1BhcnNlci5zdXBwb3J0c1R5cGUiLCJNYXgzRFNQYXJzZXIuc3VwcG9ydHNEYXRhIiwiTWF4M0RTUGFyc2VyLl9pUmVzb2x2ZURlcGVuZGVuY3kiLCJNYXgzRFNQYXJzZXIuX2lSZXNvbHZlRGVwZW5kZW5jeUZhaWx1cmUiLCJNYXgzRFNQYXJzZXIuX3BQcm9jZWVkUGFyc2luZyIsIk1heDNEU1BhcnNlci5fcFN0YXJ0UGFyc2luZyIsIk1heDNEU1BhcnNlci5wYXJzZU1hdGVyaWFsIiwiTWF4M0RTUGFyc2VyLnBhcnNlVGV4dHVyZSIsIk1heDNEU1BhcnNlci5wYXJzZVZlcnRleExpc3QiLCJNYXgzRFNQYXJzZXIucGFyc2VGYWNlTGlzdCIsIk1heDNEU1BhcnNlci5wYXJzZVNtb290aGluZ0dyb3VwcyIsIk1heDNEU1BhcnNlci5wYXJzZVVWTGlzdCIsIk1heDNEU1BhcnNlci5wYXJzZUZhY2VNYXRlcmlhbExpc3QiLCJNYXgzRFNQYXJzZXIucGFyc2VPYmplY3RBbmltYXRpb24iLCJNYXgzRFNQYXJzZXIuY29uc3RydWN0T2JqZWN0IiwiTWF4M0RTUGFyc2VyLnByZXBhcmVEYXRhIiwiTWF4M0RTUGFyc2VyLmFwcGx5U21vb3RoR3JvdXBzIiwiTWF4M0RTUGFyc2VyLmZpbmFsaXplQ3VycmVudE1hdGVyaWFsIiwiTWF4M0RTUGFyc2VyLnJlYWROdWxUZXJtc3RyaW5nIiwiTWF4M0RTUGFyc2VyLnJlYWRUcmFuc2Zvcm0iLCJNYXgzRFNQYXJzZXIucmVhZENvbG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFPLHNCQUFzQixXQUFhLG1EQUFtRCxDQUFDLENBQUM7QUFDL0YsSUFBTyxRQUFRLFdBQWlCLG9DQUFvQyxDQUFDLENBQUM7QUFDdEUsSUFBTyxtQkFBbUIsV0FBYywrQ0FBK0MsQ0FBQyxD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LEdBQUdBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBO2dCQUM1QkEsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsbUZBQW1GQSxDQUFDQSxDQUFDQTtZQUVsR0EsQUFDQUEsdUJBRHVCQTtZQUN2QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsSUFBSUEsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQzNDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtZQUViQSxRQUFRQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFXQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxHQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNuREEsS0FBS0EsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBU0EsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFaERBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLFFBQVFBLEVBQUVBLEtBQUtBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO1lBRXZDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxtQkFBbUJBLENBQUNBO2dCQUM1QkEsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxRQUFRQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUV6Q0EsR0FBR0EsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBU0EsUUFBUUEsQ0FBQ0EsTUFBTUEsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDakRBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFFBQVFBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO2dCQUN0Q0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQy9CQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxHQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbkNBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEdBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3BDQSxDQUFDQTtZQUNEQSxHQUFHQSxDQUFDQSxPQUFPQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFTQSxLQUFLQSxDQUFDQSxNQUFNQSxHQUFDQSxDQUFDQSxDQUFDQSxDQUFVQTtZQUV6REEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7Z0JBQ25DQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxHQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDOUJBLEdBQUdBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLEdBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNsQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbkNBLENBQUNBO1lBRURBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUNiQSxBQUdBQSw0REFI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QSxPQUFEQSxBQUFRQSxDQUFDQTtRQUNyQkEsSUFBSUEsQ0FBQ0EsQ0FBUUEsT0FBREEsQUFBUUEsQ0FBQ0E7UUFDckJBLElBQUlBLENBQUNBLENBQVFBLE9BQURBLEFBQVFBLENBQUNBO1FBQ3JCQSxJQUFJQSxHQUFHQSxHQUFrQkEsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDMUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBO1lBQ3BDQSxJQUFJQSxDQUFDQSxHQUFZQSxJQUFJQSxRQUFRQSxDQUFDQTtZQUM5QkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDckJBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO1lBQ3JCQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUNyQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2JBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO2dCQUNuQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDcEJBLENBQUNBO1lBQ0RBLFFBQVFBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ25CQSxDQUFDQTtRQUNEQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUN6QkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0E7WUFDN0JBLElBQUlBLENBQUNBLEdBQVVBLElBQUlBLE1BQU1BLEVBQUVBLENBQUNBO1lBQzVCQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUN2QkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDdkJBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO1lBQ3ZCQSxDQUFDQSxDQUFDQSxXQUFXQSxHQUFHQSxHQUFHQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUM1Q0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDaEJBLENBQUNBO0lBQ0ZBLENBQUNBO0lBRU9qQix3Q0FBaUJBLEdBQXpCQSxVQUEwQkEsUUFBd0JBLEVBQUVBLEtBQW1CQTtRQUV0RWtCLDhDQUE4Q0E7UUFDOUNBLG1EQUFtREE7UUFDbkRBLDhEQUE4REE7UUFFOURBLElBQUlBLENBQUNBLENBQVFBLE9BQURBLEFBQVFBLENBQUNBO1FBQ3JCQSxJQUFJQSxDQUFDQSxDQUFRQSxPQUFEQSxBQUFRQSxDQUFDQTtRQUNyQkEsSUFBSUEsQ0FBQ0EsQ0FBUUEsT0FBREEsQUFBUUEsQ0FBQ0E7UUFDckJBLElBQUlBLENBQUNBLENBQVFBLE9BQURBLEFBQVFBLENBQUNBO1FBQ3JCQSxJQUFJQSxHQUFHQSxDQUFRQSxPQUFEQSxBQUFRQSxDQUFDQTtRQUN2QkEsSUFBSUEsUUFBUUEsR0FBbUJBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBO1FBQy9DQSxJQUFJQSxRQUFRQSxHQUFtQkEsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFFNUNBLEFBQ0FBLG1DQURtQ0E7WUFDL0JBLE9BQU9BLEdBQWlDQSxJQUFJQSxLQUFLQSxDQUFnQkEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsUUFBREEsQUFBU0EsQ0FBQ0E7UUFDeEZBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFFBQVFBLEVBQUVBLENBQUNBLEVBQUVBO1lBQzVCQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxLQUFLQSxFQUFVQSxDQUFVQTtRQUMzQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsUUFBUUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7WUFDL0JBLElBQUlBLElBQUlBLEdBQVVBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzNCQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDeEJBLElBQUlBLE1BQU1BLEdBQTBCQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDNUZBLElBQUlBLEtBQUtBLEdBQW1CQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQTtnQkFDN0NBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO29CQUN6Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQzdCQSxLQUFLQSxJQUFJQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDbkJBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO3dCQUNwQkEsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZCQSxDQUFDQTtnQkFDRkEsQ0FBQ0E7Z0JBQ0RBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1lBQ3BCQSxDQUFDQTtRQUNGQSxDQUFDQTtRQUNEQSxBQUNBQSxpQkFEaUJBO1lBQ2JBLE9BQU9BLEdBQWlDQSxJQUFJQSxLQUFLQSxDQUFnQkEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsUUFBREEsQUFBU0EsQ0FBQ0E7UUFDeEZBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFFBQVFBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQy9CQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDakNBLFFBQVFBLENBQUNBO1lBQ1ZBLElBQUlBLE1BQU1BLEdBQTBCQSxJQUFJQSxLQUFLQSxDQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxRQUFEQSxBQUFTQSxDQUFDQTtZQUNwRUEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0E7WUFDcEJBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ2RBLElBQUlBLEVBQUVBLEdBQVlBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzlCQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxHQUFHQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDMUJBLElBQUlBLEVBQUVBLEdBQVlBLElBQUlBLFFBQVFBLENBQUNBO2dCQUMvQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1pBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNaQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDWkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1pBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNaQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQTtnQkFDNUJBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO1lBQ25CQSxDQUFDQTtRQUNGQSxDQUFDQTtRQUNEQSxRQUFRQSxHQUFHQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUUzQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsUUFBUUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7WUFDL0JBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hCQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQTtZQUN6QkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7Z0JBQ3hCQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFFQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbkRBLE1BQU1BLEdBQUdBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNwQkEsR0FBR0EsR0FBR0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7Z0JBQ3BCQSxNQUFNQSxHQUFHQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDcEJBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO29CQUMxQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3JFQSxJQUFJQSxLQUFLQSxHQUFtQkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3RDQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDaEJBLEFBQ0FBLDJDQUQyQ0E7NEJBQzNDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFD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QUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxTQUFTQSxFQUFFQSxFQUFFQSxJQUFJQTtRQUMxQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsRUFBRUEsRUFBRUEsSUFBSUE7UUFDMUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLEVBQUVBLEVBQUVBLElBQUlBO1FBQzFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUVaQSxBQUNBQSxTQURTQTtRQUNUQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxTQUFTQSxFQUFFQSxFQUFFQSxJQUFJQTtRQUMxQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsRUFBRUEsRUFBRUEsSUFBSUE7UUFDM0NBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLEVBQUVBLEVBQUVBLElBQUlBO1FBQzFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUViQSxBQUNBQSxTQURTQTtRQUNUQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxTQUFTQSxFQUFFQSxFQUFFQSxJQUFJQTtRQUMxQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsRUFBRUEsRUFBRUEsSUFBSUE7UUFDMUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLEVBQUVBLEVBQUVBLElBQUlBO1FBQzFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUVaQSxBQUNBQSxjQURjQTtRQUNkQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxTQUFTQSxFQUFFQSxFQUFFQSxJQUFJQTtRQUMzQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsRUFBRUEsRUFBRUEsSUFBSUE7UUFDM0NBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLEVBQUVBLEVBQUVBLElBQUlBO1FBQzNDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUViQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNiQSxDQUFDQTtJQUVPckIsZ0NBQVNBLEdBQWpCQTtRQUVDc0IsSUFBSUEsR0FBR0EsQ0FBUUEsT0FBREEsQUFBUUEsQ0FBQ0E7UUFDdkJBLElBQUlBLEdBQUdBLENBQVFBLE9BQURBLEFBQVFBLENBQUNBO1FBQ3ZCQSxJQUFJQSxDQUFDQSxDQUFRQSxPQUFEQSxBQUFRQSxFQUFFQSxDQUFDQSxDQUFRQSxPQUFEQSxBQUFRQSxFQUFFQSxDQUFDQSxDQUFRQSxPQUFEQSxBQUFRQSxDQUFDQTtRQUV6REEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxDQUFDQTtRQUN6Q0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0E7UUFFdkNBLE1BQU1BLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO1lBQ2JBLEtBQUtBLE1BQU1BO2dCQUNWQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxTQUFTQSxFQUFFQSxHQUFDQSxHQUFHQSxDQUFDQTtnQkFDbkNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLEVBQUVBLEdBQUNBLEdBQUdBLENBQUNBO2dCQUNuQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsRUFBRUEsR0FBQ0EsR0FBR0EsQ0FBQ0E7Z0JBQ25DQSxLQUFLQSxDQUFDQTtZQUNQQSxLQUFLQSxNQUFNQTtnQkFDVkEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsZ0JBQWdCQSxFQUFFQSxDQUFDQTtnQkFDdENBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLGdCQUFnQkEsRUFBRUEsQ0FBQ0E7Z0JBQ3RDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxnQkFBZ0JBLEVBQUVBLENBQUNBO2dCQUN0Q0EsS0FBS0EsQ0FBQ0E7WUFDUEE7Z0JBQ0NBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUNyQ0EsS0FBS0EsQ0FBQ0E7UUFDUkEsQ0FBQ0E7UUFFREEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7SUFDakNBLENBQUNBO0lBQ0Z0QixtQkFBQ0E7QUFBREEsQ0ExeEJBLEFBMHhCQ0EsRUExeEIwQixVQUFVLEVBMHhCcEM7QUFFRCxBQUFzQixpQkFBYixZQUFZLENBQUMiLCJmaWxlIjoicGFyc2Vycy9NYXgzRFNQYXJzZXIuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL3JvYmJhdGVtYW4vV2Vic3Rvcm1Qcm9qZWN0cy9hd2F5anMtcmVuZGVyZXJnbC8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGlzcGxheU9iamVjdENvbnRhaW5lclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb250YWluZXJzL0Rpc3BsYXlPYmplY3RDb250YWluZXJcIik7XG5pbXBvcnQgR2VvbWV0cnlcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2Jhc2UvR2VvbWV0cnlcIik7XG5pbXBvcnQgVHJpYW5nbGVTdWJHZW9tZXRyeVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvYmFzZS9UcmlhbmdsZVN1Ykdlb21ldHJ5XCIpO1xuaW1wb3J0IE1hdHJpeDNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9nZW9tL01hdHJpeDNEXCIpO1xuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9nZW9tL1ZlY3RvcjNEXCIpO1xuaW1wb3J0IEFzc2V0VHlwZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2xpYnJhcnkvQXNzZXRUeXBlXCIpO1xuaW1wb3J0IElBc3NldFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvbGlicmFyeS9JQXNzZXRcIik7XG5pbXBvcnQgVVJMTG9hZGVyRGF0YUZvcm1hdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvbmV0L1VSTExvYWRlckRhdGFGb3JtYXRcIik7XG5pbXBvcnQgVVJMUmVxdWVzdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL25ldC9VUkxSZXF1ZXN0XCIpO1xuaW1wb3J0IE1lc2hcdFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2VudGl0aWVzL01lc2hcIik7XG5pbXBvcnQgUGFyc2VyQmFzZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wYXJzZXJzL1BhcnNlckJhc2VcIik7XG5pbXBvcnQgUGFyc2VyVXRpbHNcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcGFyc2Vycy9QYXJzZXJVdGlsc1wiKTtcbmltcG9ydCBSZXNvdXJjZURlcGVuZGVuY3lcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wYXJzZXJzL1Jlc291cmNlRGVwZW5kZW5jeVwiKTtcbmltcG9ydCBUZXh0dXJlMkRCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9UZXh0dXJlMkRCYXNlXCIpO1xuaW1wb3J0IFRleHR1cmVQcm94eUJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL1RleHR1cmVQcm94eUJhc2VcIik7XG5pbXBvcnQgQnl0ZUFycmF5XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL0J5dGVBcnJheVwiKTtcbmltcG9ydCBNYXRlcmlhbEJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbWF0ZXJpYWxzL01hdGVyaWFsQmFzZVwiKTtcblxuaW1wb3J0IERlZmF1bHRNYXRlcmlhbE1hbmFnZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL3V0aWxzL0RlZmF1bHRNYXRlcmlhbE1hbmFnZXJcIik7XG5pbXBvcnQgVHJpYW5nbGVNZXRob2RNYXRlcmlhbFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvVHJpYW5nbGVNZXRob2RNYXRlcmlhbFwiKTtcbmltcG9ydCBUcmlhbmdsZU1hdGVyaWFsTW9kZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9UcmlhbmdsZU1hdGVyaWFsTW9kZVwiKTtcblxuaW1wb3J0IEZhY2VWT1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3BhcnNlcnMvZGF0YS9GYWNlVk9cIik7XG5pbXBvcnQgTWF0ZXJpYWxWT1x0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXJzZXJzL2RhdGEvTWF0ZXJpYWxWT1wiKTtcbmltcG9ydCBPYmplY3RWT1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3BhcnNlcnMvZGF0YS9PYmplY3RWT1wiKTtcbmltcG9ydCBUZXh0dXJlVk9cdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcGFyc2Vycy9kYXRhL1RleHR1cmVWT1wiKTtcbmltcG9ydCBWZXJ0ZXhWT1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3BhcnNlcnMvZGF0YS9WZXJ0ZXhWT1wiKTtcblxuLyoqXG4gKiBNYXgzRFNQYXJzZXIgcHJvdmlkZXMgYSBwYXJzZXIgZm9yIHRoZSAzZHMgZGF0YSB0eXBlLlxuICovXG5jbGFzcyBNYXgzRFNQYXJzZXIgZXh0ZW5kcyBQYXJzZXJCYXNlXG57XG5cdHByaXZhdGUgX2J5dGVEYXRhOkJ5dGVBcnJheTtcblxuXHRwcml2YXRlIF90ZXh0dXJlczpPYmplY3Q7XG5cdHByaXZhdGUgX21hdGVyaWFsczpPYmplY3Q7XG5cdHByaXZhdGUgX3VuZmluYWxpemVkX29iamVjdHM6T2JqZWN0O1xuXG5cdHByaXZhdGUgX2N1cl9vYmpfZW5kOm51bWJlcjtcblx0cHJpdmF0ZSBfY3VyX29iajpPYmplY3RWTztcblxuXHRwcml2YXRlIF9jdXJfbWF0X2VuZDpudW1iZXI7XG5cdHByaXZhdGUgX2N1cl9tYXQ6TWF0ZXJpYWxWTztcblx0cHJpdmF0ZSBfdXNlU21vb3RoaW5nR3JvdXBzOmJvb2xlYW47XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgPGNvZGU+TWF4M0RTUGFyc2VyPC9jb2RlPiBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB1c2VTbW9vdGhpbmdHcm91cHMgRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXJzZXIgbG9va3MgZm9yIHNtb290aGluZyBncm91cHMgaW4gdGhlIDNkcyBmaWxlIG9yIGFzc3VtZXMgdW5pZm9ybSBzbW9vdGhpbmcuIERlZmF1bHRzIHRvIHRydWUuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcih1c2VTbW9vdGhpbmdHcm91cHM6Ym9vbGVhbiA9IHRydWUpXG5cdHtcblx0XHRzdXBlcihVUkxMb2FkZXJEYXRhRm9ybWF0LkFSUkFZX0JVRkZFUik7XG5cblx0XHR0aGlzLl91c2VTbW9vdGhpbmdHcm91cHMgPSB1c2VTbW9vdGhpbmdHcm91cHM7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IGEgZ2l2ZW4gZmlsZSBleHRlbnNpb24gaXMgc3VwcG9ydGVkIGJ5IHRoZSBwYXJzZXIuXG5cdCAqIEBwYXJhbSBleHRlbnNpb24gVGhlIGZpbGUgZXh0ZW5zaW9uIG9mIGEgcG90ZW50aWFsIGZpbGUgdG8gYmUgcGFyc2VkLlxuXHQgKiBAcmV0dXJuIFdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBmaWxlIHR5cGUgaXMgc3VwcG9ydGVkLlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBzdXBwb3J0c1R5cGUoZXh0ZW5zaW9uOnN0cmluZyk6Ym9vbGVhblxuXHR7XG5cdFx0ZXh0ZW5zaW9uID0gZXh0ZW5zaW9uLnRvTG93ZXJDYXNlKCk7XG5cdFx0cmV0dXJuIGV4dGVuc2lvbiA9PSBcIjNkc1wiO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRlc3RzIHdoZXRoZXIgYSBkYXRhIGJsb2NrIGNhbiBiZSBwYXJzZWQgYnkgdGhlIHBhcnNlci5cblx0ICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgYmxvY2sgdG8gcG90ZW50aWFsbHkgYmUgcGFyc2VkLlxuXHQgKiBAcmV0dXJuIFdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBkYXRhIGlzIHN1cHBvcnRlZC5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgc3VwcG9ydHNEYXRhKGRhdGE6YW55KTpib29sZWFuXG5cdHtcblx0XHR2YXIgYmE6Qnl0ZUFycmF5O1xuXG5cdFx0YmEgPSBQYXJzZXJVdGlscy50b0J5dGVBcnJheShkYXRhKTtcblx0XHRpZiAoYmEpIHtcblx0XHRcdGJhLnBvc2l0aW9uID0gMDtcblx0XHRcdGlmIChiYS5yZWFkU2hvcnQoKSA9PSAweDRkNGQpXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pUmVzb2x2ZURlcGVuZGVuY3kocmVzb3VyY2VEZXBlbmRlbmN5OlJlc291cmNlRGVwZW5kZW5jeSk6dm9pZFxuXHR7XG5cdFx0aWYgKHJlc291cmNlRGVwZW5kZW5jeS5hc3NldHMubGVuZ3RoID09IDEpIHtcblx0XHRcdHZhciBhc3NldDpJQXNzZXQ7XG5cblx0XHRcdGFzc2V0ID0gcmVzb3VyY2VEZXBlbmRlbmN5LmFzc2V0c1swXTtcblx0XHRcdGlmIChhc3NldC5hc3NldFR5cGUgPT0gQXNzZXRUeXBlLlRFWFRVUkUpIHtcblx0XHRcdFx0dmFyIHRleDpUZXh0dXJlVk87XG5cblx0XHRcdFx0dGV4ID0gdGhpcy5fdGV4dHVyZXNbcmVzb3VyY2VEZXBlbmRlbmN5LmlkXTtcblx0XHRcdFx0dGV4LnRleHR1cmUgPSA8VGV4dHVyZTJEQmFzZT4gYXNzZXQ7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX2lSZXNvbHZlRGVwZW5kZW5jeUZhaWx1cmUocmVzb3VyY2VEZXBlbmRlbmN5OlJlc291cmNlRGVwZW5kZW5jeSk6dm9pZFxuXHR7XG5cdFx0Ly8gVE9ETzogSW1wbGVtZW50XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfcFByb2NlZWRQYXJzaW5nKCk6Ym9vbGVhblxuXHR7XG5cdFx0aWYgKCF0aGlzLl9ieXRlRGF0YSkge1xuXHRcdFx0dGhpcy5fYnl0ZURhdGEgPSB0aGlzLl9wR2V0Qnl0ZURhdGEoKTtcblx0XHRcdHRoaXMuX2J5dGVEYXRhLnBvc2l0aW9uID0gMDtcblxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XHQvLyBMSVRUTEVfRU5ESUFOIC0gRGVmYXVsdCBmb3IgQXJyYXlCdWZmZXIgLyBOb3QgaW1wbGVtZW50ZWQgaW4gQnl0ZUFycmF5XG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdC8vdGhpcy5fYnl0ZURhdGEuZW5kaWFuID0gRW5kaWFuLkxJVFRMRV9FTkRJQU47Ly8gU2hvdWxkIGJlIGRlZmF1bHRcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFx0XHR0aGlzLl90ZXh0dXJlcyA9IHt9O1xuXHRcdFx0dGhpcy5fbWF0ZXJpYWxzID0ge307XG5cdFx0XHR0aGlzLl91bmZpbmFsaXplZF9vYmplY3RzID0ge307XG5cdFx0fVxuXG5cdFx0Ly8gVE9ETzogV2l0aCB0aGlzIGNvbnN0cnVjdCwgdGhlIGxvb3Agd2lsbCBydW4gbm8tb3AgZm9yIGFzIGxvbmdcblx0XHQvLyBhcyB0aGVyZSBpcyB0aW1lIG9uY2UgZmlsZSBoYXMgZmluaXNoZWQgcmVhZGluZy4gQ29uc2lkZXIgYSBuaWNlXG5cdFx0Ly8gd2F5IHRvIHN0b3AgbG9vcCB3aGVuIGJ5dGUgYXJyYXkgaXMgZW1wdHksIHdpdGhvdXQgcHV0dGluZyBpdCBpblxuXHRcdC8vIHRoZSB3aGlsZS1jb25kaXRpb25hbCwgd2hpY2ggd2lsbCBwcmV2ZW50IGZpbmFsaXphdGlvbnMgZnJvbVxuXHRcdC8vIGhhcHBlbmluZyBhZnRlciB0aGUgbGFzdCBjaHVuay5cblx0XHR3aGlsZSAodGhpcy5fcEhhc1RpbWUoKSkge1xuXG5cdFx0XHQvLyBJZiB3ZSBhcmUgY3VycmVudGx5IHdvcmtpbmcgb24gYW4gb2JqZWN0LCBhbmQgdGhlIG1vc3QgcmVjZW50IGNodW5rIHdhc1xuXHRcdFx0Ly8gdGhlIGxhc3Qgb25lIGluIHRoYXQgb2JqZWN0LCBmaW5hbGl6ZSB0aGUgY3VycmVudCBvYmplY3QuXG5cdFx0XHRpZiAodGhpcy5fY3VyX21hdCAmJiB0aGlzLl9ieXRlRGF0YS5wb3NpdGlvbiA+PSB0aGlzLl9jdXJfbWF0X2VuZClcblx0XHRcdFx0dGhpcy5maW5hbGl6ZUN1cnJlbnRNYXRlcmlhbCgpO1xuXHRcdFx0ZWxzZSBpZiAodGhpcy5fY3VyX29iaiAmJiB0aGlzLl9ieXRlRGF0YS5wb3NpdGlvbiA+PSB0aGlzLl9jdXJfb2JqX2VuZCkge1xuXHRcdFx0XHQvLyBDYW4ndCBmaW5hbGl6ZSBhdCB0aGlzIHBvaW50LCBiZWNhdXNlIHdlIGhhdmUgdG8gd2FpdCB1bnRpbCB0aGUgZnVsbFxuXHRcdFx0XHQvLyBhbmltYXRpb24gc2VjdGlvbiBoYXMgYmVlbiBwYXJzZWQgZm9yIGFueSBwb3RlbnRpYWwgcGl2b3QgZGVmaW5pdGlvbnNcblx0XHRcdFx0dGhpcy5fdW5maW5hbGl6ZWRfb2JqZWN0c1t0aGlzLl9jdXJfb2JqLm5hbWVdID0gdGhpcy5fY3VyX29iajtcblx0XHRcdFx0dGhpcy5fY3VyX29ial9lbmQgPSBOdW1iZXIuTUFYX1ZBTFVFIC8qdWludCovO1xuXHRcdFx0XHR0aGlzLl9jdXJfb2JqID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuX2J5dGVEYXRhLmdldEJ5dGVzQXZhaWxhYmxlKCkgPiAwKSB7XG5cdFx0XHRcdHZhciBjaWQ6bnVtYmVyIC8qdWludCovO1xuXHRcdFx0XHR2YXIgbGVuOm51bWJlciAvKnVpbnQqLztcblx0XHRcdFx0dmFyIGVuZDpudW1iZXIgLyp1aW50Ki87XG5cblx0XHRcdFx0Y2lkID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRcdFx0bGVuID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0XHRcdGVuZCA9IHRoaXMuX2J5dGVEYXRhLnBvc2l0aW9uICsgKGxlbiAtIDYpO1xuXG5cdFx0XHRcdHN3aXRjaCAoY2lkKSB7XG5cdFx0XHRcdFx0Y2FzZSAweDRENEQ6IC8vIE1BSU4zRFNcblx0XHRcdFx0XHRjYXNlIDB4M0QzRDogLy8gRURJVDNEU1xuXHRcdFx0XHRcdGNhc2UgMHhCMDAwOiAvLyBLRVlGM0RTXG5cdFx0XHRcdFx0XHQvLyBUaGlzIHR5cGVzIGFyZSBcImNvbnRhaW5lciBjaHVua3NcIiBhbmQgY29udGFpbiBvbmx5XG5cdFx0XHRcdFx0XHQvLyBzdWItY2h1bmtzIChubyBkYXRhIG9uIHRoZWlyIG93bi4pIFRoaXMgbWVhbnMgdGhhdFxuXHRcdFx0XHRcdFx0Ly8gdGhlcmUgaXMgbm90aGluZyBtb3JlIHRvIHBhcnNlIGF0IHRoaXMgcG9pbnQsIGFuZFxuXHRcdFx0XHRcdFx0Ly8gaW5zdGVhZCB3ZSBzaG91bGQgcHJvZ3Jlc3MgdG8gdGhlIG5leHQgY2h1bmssIHdoaWNoXG5cdFx0XHRcdFx0XHQvLyB3aWxsIGJlIHRoZSBmaXJzdCBzdWItY2h1bmsgb2YgdGhpcyBvbmUuXG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAweEFGRkY6IC8vIE1BVEVSSUFMXG5cdFx0XHRcdFx0XHR0aGlzLl9jdXJfbWF0X2VuZCA9IGVuZDtcblx0XHRcdFx0XHRcdHRoaXMuX2N1cl9tYXQgPSB0aGlzLnBhcnNlTWF0ZXJpYWwoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAweDQwMDA6IC8vIEVESVRfT0JKRUNUXG5cdFx0XHRcdFx0XHR0aGlzLl9jdXJfb2JqX2VuZCA9IGVuZDtcblx0XHRcdFx0XHRcdHRoaXMuX2N1cl9vYmogPSBuZXcgT2JqZWN0Vk8oKTtcblx0XHRcdFx0XHRcdHRoaXMuX2N1cl9vYmoubmFtZSA9IHRoaXMucmVhZE51bFRlcm1zdHJpbmcoKTtcblx0XHRcdFx0XHRcdHRoaXMuX2N1cl9vYmoubWF0ZXJpYWxzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblx0XHRcdFx0XHRcdHRoaXMuX2N1cl9vYmoubWF0ZXJpYWxGYWNlcyA9IHt9O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlIDB4NDEwMDogLy8gT0JKX1RSSU1FU0hcblx0XHRcdFx0XHRcdHRoaXMuX2N1cl9vYmoudHlwZSA9IEFzc2V0VHlwZS5NRVNIO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlIDB4NDExMDogLy8gVFJJX1ZFUlRFWExcblx0XHRcdFx0XHRcdHRoaXMucGFyc2VWZXJ0ZXhMaXN0KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgMHg0MTIwOiAvLyBUUklfRkFDRUxJU1Rcblx0XHRcdFx0XHRcdHRoaXMucGFyc2VGYWNlTGlzdCgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlIDB4NDE0MDogLy8gVFJJX01BUFBJTkdDT09SRFNcblx0XHRcdFx0XHRcdHRoaXMucGFyc2VVVkxpc3QoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAweDQxMzA6IC8vIEZhY2UgbWF0ZXJpYWxzXG5cdFx0XHRcdFx0XHR0aGlzLnBhcnNlRmFjZU1hdGVyaWFsTGlzdCgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlIDB4NDE2MDogLy8gVHJhbnNmb3JtXG5cdFx0XHRcdFx0XHR0aGlzLl9jdXJfb2JqLnRyYW5zZm9ybSA9IHRoaXMucmVhZFRyYW5zZm9ybSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlIDB4QjAwMjogLy8gT2JqZWN0IGFuaW1hdGlvbiAoaW5jbHVkaW5nIHBpdm90KVxuXHRcdFx0XHRcdFx0dGhpcy5wYXJzZU9iamVjdEFuaW1hdGlvbihlbmQpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlIDB4NDE1MDogLy8gU21vb3RoaW5nIGdyb3Vwc1xuXHRcdFx0XHRcdFx0dGhpcy5wYXJzZVNtb290aGluZ0dyb3VwcygpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0Ly8gU2tpcCB0aGlzICh1bmtub3duKSBjaHVua1xuXHRcdFx0XHRcdFx0dGhpcy5fYnl0ZURhdGEucG9zaXRpb24gKz0gKGxlbiAtIDYpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBQYXVzZSBwYXJzaW5nIGlmIHRoZXJlIHdlcmUgYW55IGRlcGVuZGVuY2llcyBmb3VuZCBkdXJpbmcgdGhpc1xuXHRcdFx0XHQvLyBpdGVyYXRpb24gKGkuZS4gaWYgdGhlcmUgYXJlIGFueSBkZXBlbmRlbmNpZXMgdGhhdCBuZWVkIHRvIGJlXG5cdFx0XHRcdC8vIHJldHJpZXZlZCBhdCB0aGlzIHRpbWUuKVxuXHRcdFx0XHRpZiAodGhpcy5kZXBlbmRlbmNpZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0dGhpcy5fcFBhdXNlQW5kUmV0cmlldmVEZXBlbmRlbmNpZXMoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIE1vcmUgcGFyc2luZyBpcyByZXF1aXJlZCBpZiB0aGUgZW50aXJlIGJ5dGUgYXJyYXkgaGFzIG5vdCB5ZXRcblx0XHQvLyBiZWVuIHJlYWQsIG9yIGlmIHRoZXJlIGlzIGEgY3VycmVudGx5IG5vbi1maW5hbGl6ZWQgb2JqZWN0IGluXG5cdFx0Ly8gdGhlIHBpcGVsaW5lLlxuXHRcdGlmICh0aGlzLl9ieXRlRGF0YS5nZXRCeXRlc0F2YWlsYWJsZSgpIHx8IHRoaXMuX2N1cl9vYmogfHwgdGhpcy5fY3VyX21hdCkge1xuXHRcdFx0cmV0dXJuIFBhcnNlckJhc2UuTU9SRV9UT19QQVJTRTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIG5hbWU6c3RyaW5nO1xuXG5cdFx0XHQvLyBGaW5hbGl6ZSBhbnkgcmVtYWluaW5nIG9iamVjdHMgYmVmb3JlIGVuZGluZy5cblx0XHRcdGZvciAobmFtZSBpbiB0aGlzLl91bmZpbmFsaXplZF9vYmplY3RzKSB7XG5cdFx0XHRcdHZhciBvYmo6RGlzcGxheU9iamVjdENvbnRhaW5lcjtcblx0XHRcdFx0b2JqID0gdGhpcy5jb25zdHJ1Y3RPYmplY3QodGhpcy5fdW5maW5hbGl6ZWRfb2JqZWN0c1tuYW1lXSk7XG5cdFx0XHRcdGlmIChvYmopIHtcblx0XHRcdFx0XHQvL2FkZCB0byB0aGUgY29udGVudCBwcm9wZXJ0eVxuXHRcdFx0XHRcdCg8RGlzcGxheU9iamVjdENvbnRhaW5lcj4gdGhpcy5fcENvbnRlbnQpLmFkZENoaWxkKG9iaik7XG5cblx0XHRcdFx0XHR0aGlzLl9wRmluYWxpemVBc3NldChvYmosIG5hbWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBQYXJzZXJCYXNlLlBBUlNJTkdfRE9ORTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgX3BTdGFydFBhcnNpbmcoZnJhbWVMaW1pdDpudW1iZXIpXG5cdHtcblx0XHRzdXBlci5fcFN0YXJ0UGFyc2luZyhmcmFtZUxpbWl0KTtcblxuXHRcdC8vY3JlYXRlIGEgY29udGVudCBvYmplY3QgZm9yIExvYWRlcnNcblx0XHR0aGlzLl9wQ29udGVudCA9IG5ldyBEaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cdH1cblxuXHRwcml2YXRlIHBhcnNlTWF0ZXJpYWwoKTpNYXRlcmlhbFZPXG5cdHtcblx0XHR2YXIgbWF0Ok1hdGVyaWFsVk87XG5cblx0XHRtYXQgPSBuZXcgTWF0ZXJpYWxWTygpO1xuXG5cdFx0d2hpbGUgKHRoaXMuX2J5dGVEYXRhLnBvc2l0aW9uIDwgdGhpcy5fY3VyX21hdF9lbmQpIHtcblx0XHRcdHZhciBjaWQ6bnVtYmVyIC8qdWludCovO1xuXHRcdFx0dmFyIGxlbjpudW1iZXIgLyp1aW50Ki87XG5cdFx0XHR2YXIgZW5kOm51bWJlciAvKnVpbnQqLztcblxuXHRcdFx0Y2lkID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRcdGxlbiA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdFx0ZW5kID0gdGhpcy5fYnl0ZURhdGEucG9zaXRpb24gKyAobGVuIC0gNik7XG5cblx0XHRcdHN3aXRjaCAoY2lkKSB7XG5cdFx0XHRcdGNhc2UgMHhBMDAwOiAvLyBNYXRlcmlhbCBuYW1lXG5cdFx0XHRcdFx0bWF0Lm5hbWUgPSB0aGlzLnJlYWROdWxUZXJtc3RyaW5nKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAweEEwMTA6IC8vIEFtYmllbnQgY29sb3Jcblx0XHRcdFx0XHRtYXQuYW1iaWVudENvbG9yID0gdGhpcy5yZWFkQ29sb3IoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDB4QTAyMDogLy8gRGlmZnVzZSBjb2xvclxuXHRcdFx0XHRcdG1hdC5kaWZmdXNlQ29sb3IgPSB0aGlzLnJlYWRDb2xvcigpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgMHhBMDMwOiAvLyBTcGVjdWxhciBjb2xvclxuXHRcdFx0XHRcdG1hdC5zcGVjdWxhckNvbG9yID0gdGhpcy5yZWFkQ29sb3IoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDB4QTA4MTogLy8gVHdvLXNpZGVkLCBleGlzdGVuY2UgaW5kaWNhdGVzIFwidHJ1ZVwiXG5cdFx0XHRcdFx0bWF0LnR3b1NpZGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDB4QTIwMDogLy8gTWFpbiAoY29sb3IpIHRleHR1cmVcblx0XHRcdFx0XHRtYXQuY29sb3JNYXAgPSB0aGlzLnBhcnNlVGV4dHVyZShlbmQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgMHhBMjA0OiAvLyBTcGVjdWxhciBtYXBcblx0XHRcdFx0XHRtYXQuc3BlY3VsYXJNYXAgPSB0aGlzLnBhcnNlVGV4dHVyZShlbmQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhpcy5fYnl0ZURhdGEucG9zaXRpb24gPSBlbmQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG1hdDtcblx0fVxuXG5cdHByaXZhdGUgcGFyc2VUZXh0dXJlKGVuZDpudW1iZXIgLyp1aW50Ki8pOlRleHR1cmVWT1xuXHR7XG5cdFx0dmFyIHRleDpUZXh0dXJlVk87XG5cblx0XHR0ZXggPSBuZXcgVGV4dHVyZVZPKCk7XG5cblx0XHR3aGlsZSAodGhpcy5fYnl0ZURhdGEucG9zaXRpb24gPCBlbmQpIHtcblx0XHRcdHZhciBjaWQ6bnVtYmVyIC8qdWludCovO1xuXHRcdFx0dmFyIGxlbjpudW1iZXIgLyp1aW50Ki87XG5cblx0XHRcdGNpZCA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0XHRsZW4gPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRJbnQoKTtcblxuXHRcdFx0c3dpdGNoIChjaWQpIHtcblx0XHRcdFx0Y2FzZSAweEEzMDA6XG5cdFx0XHRcdFx0dGV4LnVybCA9IHRoaXMucmVhZE51bFRlcm1zdHJpbmcoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdC8vIFNraXAgdGhpcyB1bmtub3duIHRleHR1cmUgc3ViLWNodW5rXG5cdFx0XHRcdFx0dGhpcy5fYnl0ZURhdGEucG9zaXRpb24gKz0gKGxlbiAtIDYpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX3RleHR1cmVzW3RleC51cmxdID0gdGV4O1xuXHRcdHRoaXMuX3BBZGREZXBlbmRlbmN5KHRleC51cmwsIG5ldyBVUkxSZXF1ZXN0KHRleC51cmwpKTtcblxuXHRcdHJldHVybiB0ZXg7XG5cdH1cblxuXHRwcml2YXRlIHBhcnNlVmVydGV4TGlzdCgpOnZvaWRcblx0e1xuXHRcdHZhciBpOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgbGVuOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgY291bnQ6bnVtYmVyIC8qdWludCovO1xuXG5cdFx0Y291bnQgPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdHRoaXMuX2N1cl9vYmoudmVydHMgPSBuZXcgQXJyYXk8bnVtYmVyPihjb3VudCozKTtcblxuXHRcdGkgPSAwO1xuXHRcdGxlbiA9IHRoaXMuX2N1cl9vYmoudmVydHMubGVuZ3RoO1xuXHRcdHdoaWxlIChpIDwgbGVuKSB7XG5cdFx0XHR2YXIgeDpudW1iZXIsIHk6bnVtYmVyLCB6Om51bWJlcjtcblxuXHRcdFx0eCA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpO1xuXHRcdFx0eSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpO1xuXHRcdFx0eiA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpO1xuXG5cdFx0XHR0aGlzLl9jdXJfb2JqLnZlcnRzW2krK10gPSB4O1xuXHRcdFx0dGhpcy5fY3VyX29iai52ZXJ0c1tpKytdID0gejtcblx0XHRcdHRoaXMuX2N1cl9vYmoudmVydHNbaSsrXSA9IHk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZUZhY2VMaXN0KCk6dm9pZFxuXHR7XG5cdFx0dmFyIGk6bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciBsZW46bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciBjb3VudDpudW1iZXIgLyp1aW50Ki87XG5cblx0XHRjb3VudCA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0dGhpcy5fY3VyX29iai5pbmRpY2VzID0gbmV3IEFycmF5PG51bWJlcj4oY291bnQqMykgLyp1aW50Ki87XG5cblx0XHRpID0gMDtcblx0XHRsZW4gPSB0aGlzLl9jdXJfb2JqLmluZGljZXMubGVuZ3RoO1xuXHRcdHdoaWxlIChpIDwgbGVuKSB7XG5cdFx0XHR2YXIgaTA6bnVtYmVyIC8qdWludCovLCBpMTpudW1iZXIgLyp1aW50Ki8sIGkyOm51bWJlciAvKnVpbnQqLztcblxuXHRcdFx0aTAgPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdFx0aTEgPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdFx0aTIgPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXG5cdFx0XHR0aGlzLl9jdXJfb2JqLmluZGljZXNbaSsrXSA9IGkwO1xuXHRcdFx0dGhpcy5fY3VyX29iai5pbmRpY2VzW2krK10gPSBpMjtcblx0XHRcdHRoaXMuX2N1cl9vYmouaW5kaWNlc1tpKytdID0gaTE7XG5cblx0XHRcdC8vIFNraXAgXCJmYWNlIGluZm9cIiwgaXJyZWxldmFudCBpbiBBd2F5M0Rcblx0XHRcdHRoaXMuX2J5dGVEYXRhLnBvc2l0aW9uICs9IDI7XG5cdFx0fVxuXG5cdFx0dGhpcy5fY3VyX29iai5zbW9vdGhpbmdHcm91cHMgPSBuZXcgQXJyYXk8bnVtYmVyPihjb3VudCkgLyp1aW50Ki87XG5cdH1cblxuXHRwcml2YXRlIHBhcnNlU21vb3RoaW5nR3JvdXBzKCk6dm9pZFxuXHR7XG5cdFx0dmFyIGxlbjpudW1iZXIgLyp1aW50Ki8gPSB0aGlzLl9jdXJfb2JqLmluZGljZXMubGVuZ3RoLzM7XG5cdFx0dmFyIGk6bnVtYmVyIC8qdWludCovID0gMDtcblx0XHR3aGlsZSAoaSA8IGxlbikge1xuXHRcdFx0dGhpcy5fY3VyX29iai5zbW9vdGhpbmdHcm91cHNbaV0gPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRcdGkrKztcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHBhcnNlVVZMaXN0KCk6dm9pZFxuXHR7XG5cdFx0dmFyIGk6bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciBsZW46bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciBjb3VudDpudW1iZXIgLyp1aW50Ki87XG5cblx0XHRjb3VudCA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0dGhpcy5fY3VyX29iai51dnMgPSBuZXcgQXJyYXk8bnVtYmVyPihjb3VudCoyKTtcblxuXHRcdGkgPSAwO1xuXHRcdGxlbiA9IHRoaXMuX2N1cl9vYmoudXZzLmxlbmd0aDtcblx0XHR3aGlsZSAoaSA8IGxlbikge1xuXHRcdFx0dGhpcy5fY3VyX29iai51dnNbaSsrXSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpO1xuXHRcdFx0dGhpcy5fY3VyX29iai51dnNbaSsrXSA9IDEuMCAtIHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgcGFyc2VGYWNlTWF0ZXJpYWxMaXN0KCk6dm9pZFxuXHR7XG5cdFx0dmFyIG1hdDpzdHJpbmc7XG5cdFx0dmFyIGNvdW50Om51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgaTpudW1iZXIgLyp1aW50Ki87XG5cdFx0dmFyIGZhY2VzOkFycmF5PG51bWJlcj4gLyp1aW50Ki87XG5cblx0XHRtYXQgPSB0aGlzLnJlYWROdWxUZXJtc3RyaW5nKCk7XG5cdFx0Y291bnQgPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXG5cdFx0ZmFjZXMgPSBuZXcgQXJyYXk8bnVtYmVyPihjb3VudCkgLyp1aW50Ki87XG5cdFx0aSA9IDA7XG5cdFx0d2hpbGUgKGkgPCBmYWNlcy5sZW5ndGgpXG5cdFx0XHRmYWNlc1tpKytdID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkU2hvcnQoKTtcblxuXHRcdHRoaXMuX2N1cl9vYmoubWF0ZXJpYWxzLnB1c2gobWF0KTtcblx0XHR0aGlzLl9jdXJfb2JqLm1hdGVyaWFsRmFjZXNbbWF0XSA9IGZhY2VzO1xuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZU9iamVjdEFuaW1hdGlvbihlbmQ6bnVtYmVyKTp2b2lkXG5cdHtcblx0XHR2YXIgdm86T2JqZWN0Vk87XG5cdFx0dmFyIG9iajpEaXNwbGF5T2JqZWN0Q29udGFpbmVyO1xuXHRcdHZhciBwaXZvdDpWZWN0b3IzRDtcblx0XHR2YXIgbmFtZTpzdHJpbmc7XG5cdFx0dmFyIGhpZXI6bnVtYmVyIC8qdWludCovO1xuXG5cdFx0Ly8gUGl2b3QgZGVmYXVsdHMgdG8gb3JpZ2luXG5cdFx0cGl2b3QgPSBuZXcgVmVjdG9yM0Q7XG5cblx0XHR3aGlsZSAodGhpcy5fYnl0ZURhdGEucG9zaXRpb24gPCBlbmQpIHtcblx0XHRcdHZhciBjaWQ6bnVtYmVyIC8qdWludCovO1xuXHRcdFx0dmFyIGxlbjpudW1iZXIgLyp1aW50Ki87XG5cblx0XHRcdGNpZCA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0XHRsZW4gPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRJbnQoKTtcblxuXHRcdFx0c3dpdGNoIChjaWQpIHtcblx0XHRcdFx0Y2FzZSAweGIwMTA6IC8vIE5hbWUvaGllcmFyY2h5XG5cdFx0XHRcdFx0bmFtZSA9IHRoaXMucmVhZE51bFRlcm1zdHJpbmcoKTtcblx0XHRcdFx0XHR0aGlzLl9ieXRlRGF0YS5wb3NpdGlvbiArPSA0O1xuXHRcdFx0XHRcdGhpZXIgPSB0aGlzLl9ieXRlRGF0YS5yZWFkU2hvcnQoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDB4YjAxMzogLy8gUGl2b3Rcblx0XHRcdFx0XHRwaXZvdC54ID0gdGhpcy5fYnl0ZURhdGEucmVhZEZsb2F0KCk7XG5cdFx0XHRcdFx0cGl2b3QueiA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpO1xuXHRcdFx0XHRcdHBpdm90LnkgPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRoaXMuX2J5dGVEYXRhLnBvc2l0aW9uICs9IChsZW4gLSA2KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBJZiBuYW1lIGlzIFwiJCQkRFVNTVlcIiB0aGlzIGlzIGFuIGVtcHR5IG9iamVjdCAoZS5nLiBhIGNvbnRhaW5lcilcblx0XHQvLyBhbmQgd2lsbCBiZSBpZ25vcmVkIGluIHRoaXMgdmVyc2lvbiBvZiB0aGUgcGFyc2VyXG5cdFx0Ly8gVE9ETzogSW1wbGVtZW50IGNvbnRhaW5lcnMgaW4gM0RTIHBhcnNlci5cblx0XHRpZiAobmFtZSAhPSAnJCQkRFVNTVknICYmIHRoaXMuX3VuZmluYWxpemVkX29iamVjdHMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcblx0XHRcdHZvID0gdGhpcy5fdW5maW5hbGl6ZWRfb2JqZWN0c1tuYW1lXTtcblx0XHRcdG9iaiA9IHRoaXMuY29uc3RydWN0T2JqZWN0KHZvLCBwaXZvdCk7XG5cblx0XHRcdGlmIChvYmopIHtcblx0XHRcdFx0Ly9hZGQgdG8gdGhlIGNvbnRlbnQgcHJvcGVydHlcblx0XHRcdFx0KDxEaXNwbGF5T2JqZWN0Q29udGFpbmVyPiB0aGlzLl9wQ29udGVudCkuYWRkQ2hpbGQob2JqKTtcblxuXHRcdFx0XHR0aGlzLl9wRmluYWxpemVBc3NldChvYmosIHZvLm5hbWUpO1xuXHRcdFx0fVxuXG5cblx0XHRcdGRlbGV0ZSB0aGlzLl91bmZpbmFsaXplZF9vYmplY3RzW25hbWVdO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgY29uc3RydWN0T2JqZWN0KG9iajpPYmplY3RWTywgcGl2b3Q6VmVjdG9yM0QgPSBudWxsKTpEaXNwbGF5T2JqZWN0Q29udGFpbmVyXG5cdHtcblx0XHRpZiAob2JqLnR5cGUgPT0gQXNzZXRUeXBlLk1FU0gpIHtcblx0XHRcdHZhciBpOm51bWJlciAvKnVpbnQqLztcblx0XHRcdHZhciBzdWI6VHJpYW5nbGVTdWJHZW9tZXRyeTtcblx0XHRcdHZhciBnZW9tOkdlb21ldHJ5O1xuXHRcdFx0dmFyIG1hdDpNYXRlcmlhbEJhc2U7XG5cdFx0XHR2YXIgbWVzaDpNZXNoO1xuXHRcdFx0dmFyIG10eDpNYXRyaXgzRDtcblx0XHRcdHZhciB2ZXJ0aWNlczpBcnJheTxWZXJ0ZXhWTz47XG5cdFx0XHR2YXIgZmFjZXM6QXJyYXk8RmFjZVZPPjtcblxuXHRcdFx0aWYgKG9iai5tYXRlcmlhbHMubGVuZ3RoID4gMSlcblx0XHRcdFx0Y29uc29sZS5sb2coXCJUaGUgQXdheTNEIDNEUyBwYXJzZXIgZG9lcyBub3Qgc3VwcG9ydCBtdWx0aXBsZSBtYXRlcmlhbHMgcGVyIG1lc2ggYXQgdGhpcyBwb2ludC5cIik7XG5cblx0XHRcdC8vIElnbm9yZSBlbXB0eSBvYmplY3RzXG5cdFx0XHRpZiAoIW9iai5pbmRpY2VzIHx8IG9iai5pbmRpY2VzLmxlbmd0aCA9PSAwKVxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdFx0dmVydGljZXMgPSBuZXcgQXJyYXk8VmVydGV4Vk8+KG9iai52ZXJ0cy5sZW5ndGgvMyk7XG5cdFx0XHRmYWNlcyA9IG5ldyBBcnJheTxGYWNlVk8+KG9iai5pbmRpY2VzLmxlbmd0aC8zKTtcblxuXHRcdFx0dGhpcy5wcmVwYXJlRGF0YSh2ZXJ0aWNlcywgZmFjZXMsIG9iaik7XG5cblx0XHRcdGlmICh0aGlzLl91c2VTbW9vdGhpbmdHcm91cHMpXG5cdFx0XHRcdHRoaXMuYXBwbHlTbW9vdGhHcm91cHModmVydGljZXMsIGZhY2VzKTtcblxuXHRcdFx0b2JqLnZlcnRzID0gbmV3IEFycmF5PG51bWJlcj4odmVydGljZXMubGVuZ3RoKjMpO1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdG9iai52ZXJ0c1tpKjNdID0gdmVydGljZXNbaV0ueDtcblx0XHRcdFx0b2JqLnZlcnRzW2kqMyArIDFdID0gdmVydGljZXNbaV0ueTtcblx0XHRcdFx0b2JqLnZlcnRzW2kqMyArIDJdID0gdmVydGljZXNbaV0uejtcblx0XHRcdH1cblx0XHRcdG9iai5pbmRpY2VzID0gbmV3IEFycmF5PG51bWJlcj4oZmFjZXMubGVuZ3RoKjMpIC8qdWludCovO1xuXG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgZmFjZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0b2JqLmluZGljZXNbaSozXSA9IGZhY2VzW2ldLmE7XG5cdFx0XHRcdG9iai5pbmRpY2VzW2kqMyArIDFdID0gZmFjZXNbaV0uYjtcblx0XHRcdFx0b2JqLmluZGljZXNbaSozICsgMl0gPSBmYWNlc1tpXS5jO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAob2JqLnV2cykge1xuXHRcdFx0XHQvLyBJZiB0aGUgb2JqZWN0IGhhZCBVVnMgdG8gc3RhcnQgd2l0aCwgdXNlIFVWcyBnZW5lcmF0ZWQgYnlcblx0XHRcdFx0Ly8gc21vb3RoaW5nIGdyb3VwIHNwbGl0dGluZyBhbGdvcml0aG0uIE90aGVyd2lzZSB0aG9zZSBVVnNcblx0XHRcdFx0Ly8gd2lsbCBiZSBub25zZW5zZSBhbmQgc2hvdWxkIGJlIHNraXBwZWQuXG5cdFx0XHRcdG9iai51dnMgPSBuZXcgQXJyYXk8bnVtYmVyPih2ZXJ0aWNlcy5sZW5ndGgqMik7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCB2ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdG9iai51dnNbaSoyXSA9IHZlcnRpY2VzW2ldLnU7XG5cdFx0XHRcdFx0b2JqLnV2c1tpKjIgKyAxXSA9IHZlcnRpY2VzW2ldLnY7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Z2VvbSA9IG5ldyBHZW9tZXRyeSgpO1xuXG5cdFx0XHQvLyBDb25zdHJ1Y3Qgc3ViLWdlb21ldHJpZXMgKHBvdGVudGlhbGx5IHNwbGl0dGluZyBidWZmZXJzKVxuXHRcdFx0Ly8gYW5kIGFkZCB0aGVtIHRvIGdlb21ldHJ5LlxuXHRcdFx0c3ViID0gbmV3IFRyaWFuZ2xlU3ViR2VvbWV0cnkodHJ1ZSk7XG5cdFx0XHRzdWIudXBkYXRlSW5kaWNlcyhvYmouaW5kaWNlcyk7XG5cdFx0XHRzdWIudXBkYXRlUG9zaXRpb25zKG9iai52ZXJ0cyk7XG5cdFx0XHRzdWIudXBkYXRlVVZzKG9iai51dnMpO1xuXG5cdFx0XHRnZW9tLmFkZFN1Ykdlb21ldHJ5KHN1Yik7XG5cblx0XHRcdGlmIChvYmoubWF0ZXJpYWxzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0dmFyIG1uYW1lOnN0cmluZztcblx0XHRcdFx0bW5hbWUgPSBvYmoubWF0ZXJpYWxzWzBdO1xuXHRcdFx0XHRtYXQgPSB0aGlzLl9tYXRlcmlhbHNbbW5hbWVdLm1hdGVyaWFsO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBcHBseSBwaXZvdCB0cmFuc2xhdGlvbiB0byBnZW9tZXRyeSBpZiBhIHBpdm90IHdhc1xuXHRcdFx0Ly8gZm91bmQgd2hpbGUgcGFyc2luZyB0aGUga2V5ZnJhbWUgY2h1bmsgZWFybGllci5cblx0XHRcdGlmIChwaXZvdCkge1xuXHRcdFx0XHRpZiAob2JqLnRyYW5zZm9ybSkge1xuXHRcdFx0XHRcdC8vIElmIGEgdHJhbnNmb3JtIHdhcyBmb3VuZCB3aGlsZSBwYXJzaW5nIHRoZVxuXHRcdFx0XHRcdC8vIG9iamVjdCBjaHVuaywgdXNlIGl0IHRvIGZpbmQgdGhlIGxvY2FsIHBpdm90IHZlY3RvclxuXHRcdFx0XHRcdHZhciBkYXQ6QXJyYXk8bnVtYmVyPiA9IG9iai50cmFuc2Zvcm0uY29uY2F0KCk7XG5cdFx0XHRcdFx0ZGF0WzEyXSA9IDA7XG5cdFx0XHRcdFx0ZGF0WzEzXSA9IDA7XG5cdFx0XHRcdFx0ZGF0WzE0XSA9IDA7XG5cdFx0XHRcdFx0bXR4ID0gbmV3IE1hdHJpeDNEKGRhdCk7XG5cdFx0XHRcdFx0cGl2b3QgPSBtdHgudHJhbnNmb3JtVmVjdG9yKHBpdm90KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHBpdm90LnNjYWxlQnkoLTEpO1xuXG5cdFx0XHRcdG10eCA9IG5ldyBNYXRyaXgzRCgpO1xuXHRcdFx0XHRtdHguYXBwZW5kVHJhbnNsYXRpb24ocGl2b3QueCwgcGl2b3QueSwgcGl2b3Queik7XG5cdFx0XHRcdGdlb20uYXBwbHlUcmFuc2Zvcm1hdGlvbihtdHgpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBcHBseSB0cmFuc2Zvcm1hdGlvbiB0byBnZW9tZXRyeSBpZiBhIHRyYW5zZm9ybWF0aW9uXG5cdFx0XHQvLyB3YXMgZm91bmQgd2hpbGUgcGFyc2luZyB0aGUgb2JqZWN0IGNodW5rIGVhcmxpZXIuXG5cdFx0XHRpZiAob2JqLnRyYW5zZm9ybSkge1xuXHRcdFx0XHRtdHggPSBuZXcgTWF0cml4M0Qob2JqLnRyYW5zZm9ybSk7XG5cdFx0XHRcdG10eC5pbnZlcnQoKTtcblx0XHRcdFx0Z2VvbS5hcHBseVRyYW5zZm9ybWF0aW9uKG10eCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZpbmFsIHRyYW5zZm9ybSBhcHBsaWVkIHRvIGdlb21ldHJ5LiBGaW5hbGl6ZSB0aGUgZ2VvbWV0cnksXG5cdFx0XHQvLyB3aGljaCB3aWxsIG5vIGxvbmdlciBiZSBtb2RpZmllZCBhZnRlciB0aGlzIHBvaW50LlxuXHRcdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQoZ2VvbSwgb2JqLm5hbWUuY29uY2F0KCdfZ2VvbScpKTtcblxuXHRcdFx0Ly8gQnVpbGQgbWVzaCBhbmQgcmV0dXJuIGl0XG5cdFx0XHRtZXNoID0gbmV3IE1lc2goZ2VvbSwgbWF0KTtcblx0XHRcdG1lc2gudHJhbnNmb3JtLm1hdHJpeDNEID0gbmV3IE1hdHJpeDNEKG9iai50cmFuc2Zvcm0pO1xuXHRcdFx0cmV0dXJuIG1lc2g7XG5cdFx0fVxuXG5cdFx0Ly8gSWYgcmVhY2hlZCwgdW5rbm93blxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0cHJpdmF0ZSBwcmVwYXJlRGF0YSh2ZXJ0aWNlczpBcnJheTxWZXJ0ZXhWTz4sIGZhY2VzOkFycmF5PEZhY2VWTz4sIG9iajpPYmplY3RWTyk6dm9pZFxuXHR7XG5cdFx0Ly8gY29udmVydCByYXcgT2JqZWN0Vk8ncyBkYXRhIHRvIHN0cnVjdHVyZWQgVmVydGV4Vk8gYW5kIEZhY2VWT1xuXHRcdHZhciBpOm51bWJlciAvKmludCovO1xuXHRcdHZhciBqOm51bWJlciAvKmludCovO1xuXHRcdHZhciBrOm51bWJlciAvKmludCovO1xuXHRcdHZhciBsZW46bnVtYmVyIC8qaW50Ki8gPSBvYmoudmVydHMubGVuZ3RoO1xuXHRcdGZvciAoaSA9IDAsIGogPSAwLCBrID0gMDsgaSA8IGxlbjspIHtcblx0XHRcdHZhciB2OlZlcnRleFZPID0gbmV3IFZlcnRleFZPO1xuXHRcdFx0di54ID0gb2JqLnZlcnRzW2krK107XG5cdFx0XHR2LnkgPSBvYmoudmVydHNbaSsrXTtcblx0XHRcdHYueiA9IG9iai52ZXJ0c1tpKytdO1xuXHRcdFx0aWYgKG9iai51dnMpIHtcblx0XHRcdFx0di51ID0gb2JqLnV2c1tqKytdO1xuXHRcdFx0XHR2LnYgPSBvYmoudXZzW2orK107XG5cdFx0XHR9XG5cdFx0XHR2ZXJ0aWNlc1trKytdID0gdjtcblx0XHR9XG5cdFx0bGVuID0gb2JqLmluZGljZXMubGVuZ3RoO1xuXHRcdGZvciAoaSA9IDAsIGsgPSAwOyBpIDwgbGVuOykge1xuXHRcdFx0dmFyIGY6RmFjZVZPID0gbmV3IEZhY2VWTygpO1xuXHRcdFx0Zi5hID0gb2JqLmluZGljZXNbaSsrXTtcblx0XHRcdGYuYiA9IG9iai5pbmRpY2VzW2krK107XG5cdFx0XHRmLmMgPSBvYmouaW5kaWNlc1tpKytdO1xuXHRcdFx0Zi5zbW9vdGhHcm91cCA9IG9iai5zbW9vdGhpbmdHcm91cHNba10gfHwgMDtcblx0XHRcdGZhY2VzW2srK10gPSBmO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgYXBwbHlTbW9vdGhHcm91cHModmVydGljZXM6QXJyYXk8VmVydGV4Vk8+LCBmYWNlczpBcnJheTxGYWNlVk8+KTp2b2lkXG5cdHtcblx0XHQvLyBjbG9uZSB2ZXJ0aWNlcyBhY2NvcmRpbmcgdG8gZm9sbG93aW5nIHJ1bGU6XG5cdFx0Ly8gY2xvbmUgaWYgdmVydGV4J3MgaW4gZmFjZXMgZnJvbSBncm91cHMgMSsyIGFuZCAzXG5cdFx0Ly8gZG9uJ3QgY2xvbmUgaWYgdmVydGV4J3MgaW4gZmFjZXMgZnJvbSBncm91cHMgMSsyLCAzIGFuZCAxKzNcblxuXHRcdHZhciBpOm51bWJlciAvKmludCovO1xuXHRcdHZhciBqOm51bWJlciAvKmludCovO1xuXHRcdHZhciBrOm51bWJlciAvKmludCovO1xuXHRcdHZhciBsOm51bWJlciAvKmludCovO1xuXHRcdHZhciBsZW46bnVtYmVyIC8qaW50Ki87XG5cdFx0dmFyIG51bVZlcnRzOm51bWJlciAvKnVpbnQqLyA9IHZlcnRpY2VzLmxlbmd0aDtcblx0XHR2YXIgbnVtRmFjZXM6bnVtYmVyIC8qdWludCovID0gZmFjZXMubGVuZ3RoO1xuXG5cdFx0Ly8gZXh0cmFjdCBncm91cHMgZGF0YSBmb3IgdmVydGljZXNcblx0XHR2YXIgdkdyb3VwczpBcnJheTxBcnJheTxudW1iZXI+PiAvKnVpbnQqLyA9IG5ldyBBcnJheTxBcnJheTxudW1iZXI+PihudW1WZXJ0cykgLyp1aW50Ki87XG5cdFx0Zm9yIChpID0gMDsgaSA8IG51bVZlcnRzOyBpKyspXG5cdFx0XHR2R3JvdXBzW2ldID0gbmV3IEFycmF5PG51bWJlcj4oKSAvKnVpbnQqLztcblx0XHRmb3IgKGkgPSAwOyBpIDwgbnVtRmFjZXM7IGkrKykge1xuXHRcdFx0dmFyIGZhY2U6RmFjZVZPID0gZmFjZXNbaV07XG5cdFx0XHRmb3IgKGogPSAwOyBqIDwgMzsgaisrKSB7XG5cdFx0XHRcdHZhciBncm91cHM6QXJyYXk8bnVtYmVyPiAvKnVpbnQqLyA9IHZHcm91cHNbKGogPT0gMCk/IGZhY2UuYSA6ICgoaiA9PSAxKT8gZmFjZS5iIDogZmFjZS5jKV07XG5cdFx0XHRcdHZhciBncm91cDpudW1iZXIgLyp1aW50Ki8gPSBmYWNlLnNtb290aEdyb3VwO1xuXHRcdFx0XHRmb3IgKGsgPSBncm91cHMubGVuZ3RoIC0gMTsgayA+PSAwOyBrLS0pIHtcblx0XHRcdFx0XHRpZiAoKGdyb3VwICYgZ3JvdXBzW2tdKSA+IDApIHtcblx0XHRcdFx0XHRcdGdyb3VwIHw9IGdyb3Vwc1trXTtcblx0XHRcdFx0XHRcdGdyb3Vwcy5zcGxpY2UoaywgMSk7XG5cdFx0XHRcdFx0XHRrID0gZ3JvdXBzLmxlbmd0aCAtIDE7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGdyb3Vwcy5wdXNoKGdyb3VwKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gY2xvbmUgdmVydGljZXNcblx0XHR2YXIgdkNsb25lczpBcnJheTxBcnJheTxudW1iZXI+PiAvKnVpbnQqLyA9IG5ldyBBcnJheTxBcnJheTxudW1iZXI+PihudW1WZXJ0cykgLyp1aW50Ki87XG5cdFx0Zm9yIChpID0gMDsgaSA8IG51bVZlcnRzOyBpKyspIHtcblx0XHRcdGlmICgobGVuID0gdkdyb3Vwc1tpXS5sZW5ndGgpIDwgMSlcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR2YXIgY2xvbmVzOkFycmF5PG51bWJlcj4gLyp1aW50Ki8gPSBuZXcgQXJyYXk8bnVtYmVyPihsZW4pIC8qdWludCovO1xuXHRcdFx0dkNsb25lc1tpXSA9IGNsb25lcztcblx0XHRcdGNsb25lc1swXSA9IGk7XG5cdFx0XHR2YXIgdjA6VmVydGV4Vk8gPSB2ZXJ0aWNlc1tpXTtcblx0XHRcdGZvciAoaiA9IDE7IGogPCBsZW47IGorKykge1xuXHRcdFx0XHR2YXIgdjE6VmVydGV4Vk8gPSBuZXcgVmVydGV4Vk87XG5cdFx0XHRcdHYxLnggPSB2MC54O1xuXHRcdFx0XHR2MS55ID0gdjAueTtcblx0XHRcdFx0djEueiA9IHYwLno7XG5cdFx0XHRcdHYxLnUgPSB2MC51O1xuXHRcdFx0XHR2MS52ID0gdjAudjtcblx0XHRcdFx0Y2xvbmVzW2pdID0gdmVydGljZXMubGVuZ3RoO1xuXHRcdFx0XHR2ZXJ0aWNlcy5wdXNoKHYxKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0bnVtVmVydHMgPSB2ZXJ0aWNlcy5sZW5ndGg7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgbnVtRmFjZXM7IGkrKykge1xuXHRcdFx0ZmFjZSA9IGZhY2VzW2ldO1xuXHRcdFx0Z3JvdXAgPSBmYWNlLnNtb290aEdyb3VwO1xuXHRcdFx0Zm9yIChqID0gMDsgaiA8IDM7IGorKykge1xuXHRcdFx0XHRrID0gKGogPT0gMCk/IGZhY2UuYSA6ICgoaiA9PSAxKT8gZmFjZS5iIDogZmFjZS5jKTtcblx0XHRcdFx0Z3JvdXBzID0gdkdyb3Vwc1trXTtcblx0XHRcdFx0bGVuID0gZ3JvdXBzLmxlbmd0aDtcblx0XHRcdFx0Y2xvbmVzID0gdkNsb25lc1trXTtcblx0XHRcdFx0Zm9yIChsID0gMDsgbCA8IGxlbjsgbCsrKSB7XG5cdFx0XHRcdFx0aWYgKCgoZ3JvdXAgPT0gMCkgJiYgKGdyb3Vwc1tsXSA9PSAwKSkgfHwgKChncm91cCAmIGdyb3Vwc1tsXSkgPiAwKSkge1xuXHRcdFx0XHRcdFx0dmFyIGluZGV4Om51bWJlciAvKnVpbnQqLyA9IGNsb25lc1tsXTtcblx0XHRcdFx0XHRcdGlmIChncm91cCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdC8vIHZlcnRleCBpcyB1bmlxdWUgaWYgbm8gc21vb3RoR3JvdXAgZm91bmRcblx0XHRcdFx0XHRcdFx0Z3JvdXBzLnNwbGljZShsLCAxKTtcblx0XHRcdFx0XHRcdFx0Y2xvbmVzLnNwbGljZShsLCAxKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChqID09IDApXG5cdFx0XHRcdFx0XHRcdGZhY2UuYSA9IGluZGV4OyBlbHNlIGlmIChqID09IDEpXG5cdFx0XHRcdFx0XHRcdGZhY2UuYiA9IGluZGV4OyBlbHNlXG5cdFx0XHRcdFx0XHRcdGZhY2UuYyA9IGluZGV4O1xuXHRcdFx0XHRcdFx0bCA9IGxlbjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGZpbmFsaXplQ3VycmVudE1hdGVyaWFsKCk6dm9pZFxuXHR7XG5cdFx0dmFyIG1hdDpUcmlhbmdsZU1ldGhvZE1hdGVyaWFsO1xuXG5cdFx0aWYgKHRoaXMuX2N1cl9tYXQuY29sb3JNYXApXG5cdFx0XHRtYXQgPSBuZXcgVHJpYW5nbGVNZXRob2RNYXRlcmlhbCh0aGlzLl9jdXJfbWF0LmNvbG9yTWFwLnRleHR1cmUgfHwgRGVmYXVsdE1hdGVyaWFsTWFuYWdlci5nZXREZWZhdWx0VGV4dHVyZSgpKTtcblx0XHRlbHNlXG5cdFx0XHRtYXQgPSBuZXcgVHJpYW5nbGVNZXRob2RNYXRlcmlhbCh0aGlzLl9jdXJfbWF0LmFtYmllbnRDb2xvcik7XG5cblx0XHRtYXQuZGlmZnVzZUNvbG9yID0gdGhpcy5fY3VyX21hdC5kaWZmdXNlQ29sb3I7XG5cdFx0bWF0LnNwZWN1bGFyQ29sb3IgPSB0aGlzLl9jdXJfbWF0LnNwZWN1bGFyQ29sb3I7XG5cblx0XHRpZiAodGhpcy5tYXRlcmlhbE1vZGUgPj0gMilcblx0XHRcdG1hdC5tYXRlcmlhbE1vZGUgPSBUcmlhbmdsZU1hdGVyaWFsTW9kZS5NVUxUSV9QQVNTXG5cblx0XHRtYXQuYm90aFNpZGVzID0gdGhpcy5fY3VyX21hdC50d29TaWRlZDtcblxuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KG1hdCwgdGhpcy5fY3VyX21hdC5uYW1lKTtcblxuXHRcdHRoaXMuX21hdGVyaWFsc1t0aGlzLl9jdXJfbWF0Lm5hbWVdID0gdGhpcy5fY3VyX21hdDtcblx0XHR0aGlzLl9jdXJfbWF0Lm1hdGVyaWFsID0gbWF0O1xuXG5cdFx0dGhpcy5fY3VyX21hdCA9IG51bGw7XG5cdH1cblxuXHRwcml2YXRlIHJlYWROdWxUZXJtc3RyaW5nKCk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY2hyOm51bWJlciAvKmludCovO1xuXHRcdHZhciBzdHI6c3RyaW5nID0gXCJcIjtcblxuXHRcdHdoaWxlICgoY2hyID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkQnl0ZSgpKSA+IDApXG5cdFx0XHRzdHIgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjaHIpO1xuXG5cdFx0cmV0dXJuIHN0cjtcblx0fVxuXG5cdHByaXZhdGUgcmVhZFRyYW5zZm9ybSgpOkFycmF5PG51bWJlcj5cblx0e1xuXHRcdHZhciBkYXRhOkFycmF5PG51bWJlcj47XG5cblx0XHRkYXRhID0gbmV3IEFycmF5PG51bWJlcj4oMTYpO1xuXG5cdFx0Ly8gWCBheGlzXG5cdFx0ZGF0YVswXSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpOyAvLyBYXG5cdFx0ZGF0YVsyXSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpOyAvLyBaXG5cdFx0ZGF0YVsxXSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpOyAvLyBZXG5cdFx0ZGF0YVszXSA9IDA7XG5cblx0XHQvLyBaIGF4aXNcblx0XHRkYXRhWzhdID0gdGhpcy5fYnl0ZURhdGEucmVhZEZsb2F0KCk7IC8vIFhcblx0XHRkYXRhWzEwXSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpOyAvLyBaXG5cdFx0ZGF0YVs5XSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpOyAvLyBZXG5cdFx0ZGF0YVsxMV0gPSAwO1xuXG5cdFx0Ly8gWSBBeGlzXG5cdFx0ZGF0YVs0XSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpOyAvLyBYXG5cdFx0ZGF0YVs2XSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpOyAvLyBaXG5cdFx0ZGF0YVs1XSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpOyAvLyBZXG5cdFx0ZGF0YVs3XSA9IDA7XG5cblx0XHQvLyBUcmFuc2xhdGlvblxuXHRcdGRhdGFbMTJdID0gdGhpcy5fYnl0ZURhdGEucmVhZEZsb2F0KCk7IC8vIFhcblx0XHRkYXRhWzE0XSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpOyAvLyBaXG5cdFx0ZGF0YVsxM10gPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKTsgLy8gWVxuXHRcdGRhdGFbMTVdID0gMTtcblxuXHRcdHJldHVybiBkYXRhO1xuXHR9XG5cblx0cHJpdmF0ZSByZWFkQ29sb3IoKTpudW1iZXIgLyppbnQqL1xuXHR7XG5cdFx0dmFyIGNpZDpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgbGVuOm51bWJlciAvKmludCovO1xuXHRcdHZhciByOm51bWJlciAvKmludCovLCBnOm51bWJlciAvKmludCovLCBiOm51bWJlciAvKmludCovO1xuXG5cdFx0Y2lkID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRsZW4gPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRJbnQoKTtcblxuXHRcdHN3aXRjaCAoY2lkKSB7XG5cdFx0XHRjYXNlIDB4MDAxMDogLy8gRmxvYXRzXG5cdFx0XHRcdHIgPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKSoyNTU7XG5cdFx0XHRcdGcgPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKSoyNTU7XG5cdFx0XHRcdGIgPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKSoyNTU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAweDAwMTE6IC8vIDI0LWJpdCBjb2xvclxuXHRcdFx0XHRyID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdFx0XHRnID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdFx0XHRiID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRoaXMuX2J5dGVEYXRhLnBvc2l0aW9uICs9IChsZW4gLSA2KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIChyIDw8IDE2KSB8IChnIDw8IDgpIHwgYjtcblx0fVxufVxuXG5leHBvcnQgPSBNYXgzRFNQYXJzZXI7XG5cblxuIl19