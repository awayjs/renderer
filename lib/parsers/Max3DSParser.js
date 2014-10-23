var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var AssetType = require("awayjs-core/lib/library/AssetType");
var URLLoaderDataFormat = require("awayjs-core/lib/net/URLLoaderDataFormat");
var URLRequest = require("awayjs-core/lib/net/URLRequest");
var ParserBase = require("awayjs-core/lib/parsers/ParserBase");
var ParserUtils = require("awayjs-core/lib/parsers/ParserUtils");
var DisplayObjectContainer = require("awayjs-display/lib/containers/DisplayObjectContainer");
var Geometry = require("awayjs-display/lib/base/Geometry");
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var Mesh = require("awayjs-display/lib/entities/Mesh");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXJzZXJzL21heDNkc3BhcnNlci50cyJdLCJuYW1lcyI6WyJNYXgzRFNQYXJzZXIiLCJNYXgzRFNQYXJzZXIuY29uc3RydWN0b3IiLCJNYXgzRFNQYXJzZXIuc3VwcG9ydHNUeXBlIiwiTWF4M0RTUGFyc2VyLnN1cHBvcnRzRGF0YSIsIk1heDNEU1BhcnNlci5faVJlc29sdmVEZXBlbmRlbmN5IiwiTWF4M0RTUGFyc2VyLl9pUmVzb2x2ZURlcGVuZGVuY3lGYWlsdXJlIiwiTWF4M0RTUGFyc2VyLl9wUHJvY2VlZFBhcnNpbmciLCJNYXgzRFNQYXJzZXIuX3BTdGFydFBhcnNpbmciLCJNYXgzRFNQYXJzZXIucGFyc2VNYXRlcmlhbCIsIk1heDNEU1BhcnNlci5wYXJzZVRleHR1cmUiLCJNYXgzRFNQYXJzZXIucGFyc2VWZXJ0ZXhMaXN0IiwiTWF4M0RTUGFyc2VyLnBhcnNlRmFjZUxpc3QiLCJNYXgzRFNQYXJzZXIucGFyc2VTbW9vdGhpbmdHcm91cHMiLCJNYXgzRFNQYXJzZXIucGFyc2VVVkxpc3QiLCJNYXgzRFNQYXJzZXIucGFyc2VGYWNlTWF0ZXJpYWxMaXN0IiwiTWF4M0RTUGFyc2VyLnBhcnNlT2JqZWN0QW5pbWF0aW9uIiwiTWF4M0RTUGFyc2VyLmNvbnN0cnVjdE9iamVjdCIsIk1heDNEU1BhcnNlci5wcmVwYXJlRGF0YSIsIk1heDNEU1BhcnNlci5hcHBseVNtb290aEdyb3VwcyIsIk1heDNEU1BhcnNlci5maW5hbGl6ZUN1cnJlbnRNYXRlcmlhbCIsIk1heDNEU1BhcnNlci5yZWFkTnVsVGVybXN0cmluZyIsIk1heDNEU1BhcnNlci5yZWFkVHJhbnNmb3JtIiwiTWF4M0RTUGFyc2VyLnJlYWRDb2xvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTyxRQUFRLFdBQWlCLCtCQUErQixDQUFDLENBQUM7QUFDakUsSUFBTyxRQUFRLFdBQWlCLCtCQUErQixDQUFDLENBQUM7QUFDakUsSUFBTyxTQUFT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RXhCQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDNUJBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLG1GQUFtRkEsQ0FBQ0EsQ0FBQ0E7WUFFbEdBLEFBQ0FBLHVCQUR1QkE7WUFDdkJBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLElBQUlBLEdBQUdBLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLElBQUlBLENBQUNBLENBQUNBO2dCQUMzQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7WUFFYkEsUUFBUUEsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBV0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbkRBLEtBQUtBLEdBQUdBLElBQUlBLEtBQUtBLENBQVNBLEdBQUdBLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLEdBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBRWhEQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxRQUFRQSxFQUFFQSxLQUFLQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUV2Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQTtnQkFDNUJBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsUUFBUUEsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFFekNBLEdBQUdBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLEtBQUtBLENBQVNBLFFBQVFBLENBQUNBLE1BQU1BLEdBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2pEQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxRQUFRQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDdENBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEdBQUNBLENBQUNBLENBQUNBLEdBQUdBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUMvQkEsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ25DQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxHQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNwQ0EsQ0FBQ0E7WUFDREEsR0FBR0EsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsS0FBS0EsQ0FBU0EsS0FBS0EsQ0FBQ0EsTUFBTUEsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBVUE7WUFFekRBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO2dCQUNuQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzlCQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxHQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbENBLEdBQUdBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLEdBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ25DQSxDQUFDQTtZQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxD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REEsQUFBUUEsQ0FBQ0E7UUFDdkJBLElBQUlBLFFBQVFBLEdBQW1CQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUMvQ0EsSUFBSUEsUUFBUUEsR0FBbUJBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBO1FBRTVDQSxBQUNBQSxtQ0FEbUNBO1lBQy9CQSxPQUFPQSxHQUFpQ0EsSUFBSUEsS0FBS0EsQ0FBZ0JBLFFBQVFBLENBQUNBLENBQUNBLFFBQURBLEFBQVNBLENBQUNBO1FBQ3hGQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxRQUFRQSxFQUFFQSxDQUFDQSxFQUFFQTtZQUM1QkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsS0FBS0EsRUFBVUEsQ0FBVUE7UUFDM0NBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFFBQVFBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQy9CQSxJQUFJQSxJQUFJQSxHQUFVQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMzQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7Z0JBQ3hCQSxJQUFJQSxNQUFNQSxHQUEwQkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzVGQSxJQUFJQSxLQUFLQSxHQUFtQkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7Z0JBQzdDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtvQkFDekNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLEdBQUdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUM3QkEsS0FBS0EsSUFBSUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ25CQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDcEJBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBO29CQUN2QkEsQ0FBQ0E7Z0JBQ0ZBLENBQUNBO2dCQUNEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUNwQkEsQ0FBQ0E7UUFDRkEsQ0FBQ0E7UUFDREEsQUFDQUEsaUJBRGlCQTtZQUNiQSxPQUFPQSxHQUFpQ0EsSUFBSUEsS0FBS0EsQ0FBZ0JBLFFBQVFBLENBQUNBLENBQUNBLFFBQURBLEFBQVNBLENBQUNBO1FBQ3hGQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxRQUFRQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUMvQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pDQSxRQUFRQSxDQUFDQTtZQUNWQSxJQUFJQSxNQUFNQSxHQUEwQkEsSUFBSUEsS0FBS0EsQ0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsUUFBREEsQUFBU0EsQ0FBQ0E7WUFDcEVBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBO1lBQ3BCQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNkQSxJQUFJQSxFQUFFQSxHQUFZQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUM5QkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsR0FBR0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7Z0JBQzFCQSxJQUFJQSxFQUFFQSxHQUFZQSxJQUFJQSxRQUFRQSxDQUFDQTtnQkFDL0JBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNaQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDWkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1pBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNaQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDWkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7Z0JBQzVCQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUNuQkEsQ0FBQ0E7UUFDRkEsQ0FBQ0E7UUFDREEsUUFBUUEsR0FBR0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFFM0JBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFFBQVFBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQy9CQSxJQUFJQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNoQkEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7WUFDekJBLEdBQUdBLENBQUNB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VEEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsRUFBRUEsRUFBRUEsSUFBSUE7UUFDMUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLEVBQUVBLEVBQUVBLElBQUlBO1FBQzFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxTQUFTQSxFQUFFQSxFQUFFQSxJQUFJQTtRQUMxQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFFWkEsQUFDQUEsU0FEU0E7UUFDVEEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsRUFBRUEsRUFBRUEsSUFBSUE7UUFDMUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLEVBQUVBLEVBQUVBLElBQUlBO1FBQzNDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxTQUFTQSxFQUFFQSxFQUFFQSxJQUFJQTtRQUMxQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFFYkEsQUFDQUEsU0FEU0E7UUFDVEEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsRUFBRUEsRUFBRUEsSUFBSUE7UUFDMUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLEVBQUVBLEVBQUVBLElBQUlBO1FBQzFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxTQUFTQSxFQUFFQSxFQUFFQSxJQUFJQTtRQUMxQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFFWkEsQUFDQUEsY0FEY0E7UUFDZEEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsRUFBRUEsRUFBRUEsSUFBSUE7UUFDM0NBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLEVBQUVBLEVBQUVBLElBQUlBO1FBQzNDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxTQUFTQSxFQUFFQSxFQUFFQSxJQUFJQTtRQUMzQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFFYkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDYkEsQ0FBQ0E7SUFFT3JCLGdDQUFTQSxHQUFqQkE7UUFFQ3NCLElBQUlBLEdBQUdBLENBQVFBLE9BQURBLEFBQVFBLENBQUNBO1FBQ3ZCQSxJQUFJQSxHQUFHQSxDQUFRQSxPQUFEQSxBQUFRQSxDQUFDQTtRQUN2QkEsSUFBSUEsQ0FBQ0EsQ0FBUUEsT0FBREEsQUFBUUEsRUFBRUEsQ0FBQ0EsQ0FBUUEsT0FBREEsQUFBUUEsRUFBRUEsQ0FBQ0EsQ0FBUUEsT0FBREEsQUFBUUEsQ0FBQ0E7UUFFekRBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLGlCQUFpQkEsRUFBRUEsQ0FBQ0E7UUFDekNBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBO1FBRXZDQSxNQUFNQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNiQSxLQUFLQSxNQUFNQTtnQkFDVkEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsRUFBRUEsR0FBQ0EsR0FBR0EsQ0FBQ0E7Z0JBQ25DQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxTQUFTQSxFQUFFQSxHQUFDQSxHQUFHQSxDQUFDQTtnQkFDbkNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLEVBQUVBLEdBQUNBLEdBQUdBLENBQUNBO2dCQUNuQ0EsS0FBS0EsQ0FBQ0E7WUFDUEEsS0FBS0EsTUFBTUE7Z0JBQ1ZBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLGdCQUFnQkEsRUFBRUEsQ0FBQ0E7Z0JBQ3RDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxnQkFBZ0JBLEVBQUVBLENBQUNBO2dCQUN0Q0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsZ0JBQWdCQSxFQUFFQSxDQUFDQTtnQkFDdENBLEtBQUtBLENBQUNBO1lBQ1BBO2dCQUNDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxRQUFRQSxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDckNBLEtBQUtBLENBQUNBO1FBQ1JBLENBQUNBO1FBRURBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO0lBQ2pDQSxDQUFDQTtJQUNGdEIsbUJBQUNBO0FBQURBLENBMXhCQSxBQTB4QkNBLEVBMXhCMEIsVUFBVSxFQTB4QnBDO0FBRUQsQUFBc0IsaUJBQWIsWUFBWSxDQUFDIiwiZmlsZSI6InBhcnNlcnMvTWF4M0RTUGFyc2VyLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNYXRyaXgzRFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vTWF0cml4M0RcIik7XG5pbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1ZlY3RvcjNEXCIpO1xuaW1wb3J0IEFzc2V0VHlwZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0Fzc2V0VHlwZVwiKTtcbmltcG9ydCBJQXNzZXRcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0lBc3NldFwiKTtcbmltcG9ydCBVUkxMb2FkZXJEYXRhRm9ybWF0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTExvYWRlckRhdGFGb3JtYXRcIik7XG5pbXBvcnQgVVJMUmVxdWVzdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMUmVxdWVzdFwiKTtcbmltcG9ydCBQYXJzZXJCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3BhcnNlcnMvUGFyc2VyQmFzZVwiKTtcbmltcG9ydCBQYXJzZXJVdGlsc1x0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wYXJzZXJzL1BhcnNlclV0aWxzXCIpO1xuaW1wb3J0IFJlc291cmNlRGVwZW5kZW5jeVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3BhcnNlcnMvUmVzb3VyY2VEZXBlbmRlbmN5XCIpO1xuaW1wb3J0IFRleHR1cmUyREJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL1RleHR1cmUyREJhc2VcIik7XG5pbXBvcnQgVGV4dHVyZVByb3h5QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZVByb3h5QmFzZVwiKTtcbmltcG9ydCBCeXRlQXJyYXlcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdXRpbHMvQnl0ZUFycmF5XCIpO1xuXG5pbXBvcnQgRGlzcGxheU9iamVjdENvbnRhaW5lclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9jb250YWluZXJzL0Rpc3BsYXlPYmplY3RDb250YWluZXJcIik7XG5pbXBvcnQgR2VvbWV0cnlcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL0dlb21ldHJ5XCIpO1xuaW1wb3J0IFRyaWFuZ2xlU3ViR2VvbWV0cnlcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL1RyaWFuZ2xlU3ViR2VvbWV0cnlcIik7XG5pbXBvcnQgTWVzaFx0XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvTWVzaFwiKTtcbmltcG9ydCBNYXRlcmlhbEJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvbWF0ZXJpYWxzL01hdGVyaWFsQmFzZVwiKTtcblxuaW1wb3J0IERlZmF1bHRNYXRlcmlhbE1hbmFnZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL3V0aWxzL0RlZmF1bHRNYXRlcmlhbE1hbmFnZXJcIik7XG5pbXBvcnQgVHJpYW5nbGVNZXRob2RNYXRlcmlhbFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9tYXRlcmlhbHMvVHJpYW5nbGVNZXRob2RNYXRlcmlhbFwiKTtcbmltcG9ydCBUcmlhbmdsZU1hdGVyaWFsTW9kZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9UcmlhbmdsZU1hdGVyaWFsTW9kZVwiKTtcblxuaW1wb3J0IEZhY2VWT1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3BhcnNlcnMvZGF0YS9GYWNlVk9cIik7XG5pbXBvcnQgTWF0ZXJpYWxWT1x0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXJzZXJzL2RhdGEvTWF0ZXJpYWxWT1wiKTtcbmltcG9ydCBPYmplY3RWT1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3BhcnNlcnMvZGF0YS9PYmplY3RWT1wiKTtcbmltcG9ydCBUZXh0dXJlVk9cdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcGFyc2Vycy9kYXRhL1RleHR1cmVWT1wiKTtcbmltcG9ydCBWZXJ0ZXhWT1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3BhcnNlcnMvZGF0YS9WZXJ0ZXhWT1wiKTtcblxuLyoqXG4gKiBNYXgzRFNQYXJzZXIgcHJvdmlkZXMgYSBwYXJzZXIgZm9yIHRoZSAzZHMgZGF0YSB0eXBlLlxuICovXG5jbGFzcyBNYXgzRFNQYXJzZXIgZXh0ZW5kcyBQYXJzZXJCYXNlXG57XG5cdHByaXZhdGUgX2J5dGVEYXRhOkJ5dGVBcnJheTtcblxuXHRwcml2YXRlIF90ZXh0dXJlczpPYmplY3Q7XG5cdHByaXZhdGUgX21hdGVyaWFsczpPYmplY3Q7XG5cdHByaXZhdGUgX3VuZmluYWxpemVkX29iamVjdHM6T2JqZWN0O1xuXG5cdHByaXZhdGUgX2N1cl9vYmpfZW5kOm51bWJlcjtcblx0cHJpdmF0ZSBfY3VyX29iajpPYmplY3RWTztcblxuXHRwcml2YXRlIF9jdXJfbWF0X2VuZDpudW1iZXI7XG5cdHByaXZhdGUgX2N1cl9tYXQ6TWF0ZXJpYWxWTztcblx0cHJpdmF0ZSBfdXNlU21vb3RoaW5nR3JvdXBzOmJvb2xlYW47XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgPGNvZGU+TWF4M0RTUGFyc2VyPC9jb2RlPiBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB1c2VTbW9vdGhpbmdHcm91cHMgRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXJzZXIgbG9va3MgZm9yIHNtb290aGluZyBncm91cHMgaW4gdGhlIDNkcyBmaWxlIG9yIGFzc3VtZXMgdW5pZm9ybSBzbW9vdGhpbmcuIERlZmF1bHRzIHRvIHRydWUuXG5cdCAqL1xuXHRjb25zdHJ1Y3Rvcih1c2VTbW9vdGhpbmdHcm91cHM6Ym9vbGVhbiA9IHRydWUpXG5cdHtcblx0XHRzdXBlcihVUkxMb2FkZXJEYXRhRm9ybWF0LkFSUkFZX0JVRkZFUik7XG5cblx0XHR0aGlzLl91c2VTbW9vdGhpbmdHcm91cHMgPSB1c2VTbW9vdGhpbmdHcm91cHM7XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IGEgZ2l2ZW4gZmlsZSBleHRlbnNpb24gaXMgc3VwcG9ydGVkIGJ5IHRoZSBwYXJzZXIuXG5cdCAqIEBwYXJhbSBleHRlbnNpb24gVGhlIGZpbGUgZXh0ZW5zaW9uIG9mIGEgcG90ZW50aWFsIGZpbGUgdG8gYmUgcGFyc2VkLlxuXHQgKiBAcmV0dXJuIFdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBmaWxlIHR5cGUgaXMgc3VwcG9ydGVkLlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBzdXBwb3J0c1R5cGUoZXh0ZW5zaW9uOnN0cmluZyk6Ym9vbGVhblxuXHR7XG5cdFx0ZXh0ZW5zaW9uID0gZXh0ZW5zaW9uLnRvTG93ZXJDYXNlKCk7XG5cdFx0cmV0dXJuIGV4dGVuc2lvbiA9PSBcIjNkc1wiO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRlc3RzIHdoZXRoZXIgYSBkYXRhIGJsb2NrIGNhbiBiZSBwYXJzZWQgYnkgdGhlIHBhcnNlci5cblx0ICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgYmxvY2sgdG8gcG90ZW50aWFsbHkgYmUgcGFyc2VkLlxuXHQgKiBAcmV0dXJuIFdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBkYXRhIGlzIHN1cHBvcnRlZC5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgc3VwcG9ydHNEYXRhKGRhdGE6YW55KTpib29sZWFuXG5cdHtcblx0XHR2YXIgYmE6Qnl0ZUFycmF5O1xuXG5cdFx0YmEgPSBQYXJzZXJVdGlscy50b0J5dGVBcnJheShkYXRhKTtcblx0XHRpZiAoYmEpIHtcblx0XHRcdGJhLnBvc2l0aW9uID0gMDtcblx0XHRcdGlmIChiYS5yZWFkU2hvcnQoKSA9PSAweDRkNGQpXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pUmVzb2x2ZURlcGVuZGVuY3kocmVzb3VyY2VEZXBlbmRlbmN5OlJlc291cmNlRGVwZW5kZW5jeSk6dm9pZFxuXHR7XG5cdFx0aWYgKHJlc291cmNlRGVwZW5kZW5jeS5hc3NldHMubGVuZ3RoID09IDEpIHtcblx0XHRcdHZhciBhc3NldDpJQXNzZXQ7XG5cblx0XHRcdGFzc2V0ID0gcmVzb3VyY2VEZXBlbmRlbmN5LmFzc2V0c1swXTtcblx0XHRcdGlmIChhc3NldC5hc3NldFR5cGUgPT0gQXNzZXRUeXBlLlRFWFRVUkUpIHtcblx0XHRcdFx0dmFyIHRleDpUZXh0dXJlVk87XG5cblx0XHRcdFx0dGV4ID0gdGhpcy5fdGV4dHVyZXNbcmVzb3VyY2VEZXBlbmRlbmN5LmlkXTtcblx0XHRcdFx0dGV4LnRleHR1cmUgPSA8VGV4dHVyZTJEQmFzZT4gYXNzZXQ7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX2lSZXNvbHZlRGVwZW5kZW5jeUZhaWx1cmUocmVzb3VyY2VEZXBlbmRlbmN5OlJlc291cmNlRGVwZW5kZW5jeSk6dm9pZFxuXHR7XG5cdFx0Ly8gVE9ETzogSW1wbGVtZW50XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfcFByb2NlZWRQYXJzaW5nKCk6Ym9vbGVhblxuXHR7XG5cdFx0aWYgKCF0aGlzLl9ieXRlRGF0YSkge1xuXHRcdFx0dGhpcy5fYnl0ZURhdGEgPSB0aGlzLl9wR2V0Qnl0ZURhdGEoKTtcblx0XHRcdHRoaXMuX2J5dGVEYXRhLnBvc2l0aW9uID0gMDtcblxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XHQvLyBMSVRUTEVfRU5ESUFOIC0gRGVmYXVsdCBmb3IgQXJyYXlCdWZmZXIgLyBOb3QgaW1wbGVtZW50ZWQgaW4gQnl0ZUFycmF5XG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdC8vdGhpcy5fYnl0ZURhdGEuZW5kaWFuID0gRW5kaWFuLkxJVFRMRV9FTkRJQU47Ly8gU2hvdWxkIGJlIGRlZmF1bHRcblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFx0XHR0aGlzLl90ZXh0dXJlcyA9IHt9O1xuXHRcdFx0dGhpcy5fbWF0ZXJpYWxzID0ge307XG5cdFx0XHR0aGlzLl91bmZpbmFsaXplZF9vYmplY3RzID0ge307XG5cdFx0fVxuXG5cdFx0Ly8gVE9ETzogV2l0aCB0aGlzIGNvbnN0cnVjdCwgdGhlIGxvb3Agd2lsbCBydW4gbm8tb3AgZm9yIGFzIGxvbmdcblx0XHQvLyBhcyB0aGVyZSBpcyB0aW1lIG9uY2UgZmlsZSBoYXMgZmluaXNoZWQgcmVhZGluZy4gQ29uc2lkZXIgYSBuaWNlXG5cdFx0Ly8gd2F5IHRvIHN0b3AgbG9vcCB3aGVuIGJ5dGUgYXJyYXkgaXMgZW1wdHksIHdpdGhvdXQgcHV0dGluZyBpdCBpblxuXHRcdC8vIHRoZSB3aGlsZS1jb25kaXRpb25hbCwgd2hpY2ggd2lsbCBwcmV2ZW50IGZpbmFsaXphdGlvbnMgZnJvbVxuXHRcdC8vIGhhcHBlbmluZyBhZnRlciB0aGUgbGFzdCBjaHVuay5cblx0XHR3aGlsZSAodGhpcy5fcEhhc1RpbWUoKSkge1xuXG5cdFx0XHQvLyBJZiB3ZSBhcmUgY3VycmVudGx5IHdvcmtpbmcgb24gYW4gb2JqZWN0LCBhbmQgdGhlIG1vc3QgcmVjZW50IGNodW5rIHdhc1xuXHRcdFx0Ly8gdGhlIGxhc3Qgb25lIGluIHRoYXQgb2JqZWN0LCBmaW5hbGl6ZSB0aGUgY3VycmVudCBvYmplY3QuXG5cdFx0XHRpZiAodGhpcy5fY3VyX21hdCAmJiB0aGlzLl9ieXRlRGF0YS5wb3NpdGlvbiA+PSB0aGlzLl9jdXJfbWF0X2VuZClcblx0XHRcdFx0dGhpcy5maW5hbGl6ZUN1cnJlbnRNYXRlcmlhbCgpO1xuXHRcdFx0ZWxzZSBpZiAodGhpcy5fY3VyX29iaiAmJiB0aGlzLl9ieXRlRGF0YS5wb3NpdGlvbiA+PSB0aGlzLl9jdXJfb2JqX2VuZCkge1xuXHRcdFx0XHQvLyBDYW4ndCBmaW5hbGl6ZSBhdCB0aGlzIHBvaW50LCBiZWNhdXNlIHdlIGhhdmUgdG8gd2FpdCB1bnRpbCB0aGUgZnVsbFxuXHRcdFx0XHQvLyBhbmltYXRpb24gc2VjdGlvbiBoYXMgYmVlbiBwYXJzZWQgZm9yIGFueSBwb3RlbnRpYWwgcGl2b3QgZGVmaW5pdGlvbnNcblx0XHRcdFx0dGhpcy5fdW5maW5hbGl6ZWRfb2JqZWN0c1t0aGlzLl9jdXJfb2JqLm5hbWVdID0gdGhpcy5fY3VyX29iajtcblx0XHRcdFx0dGhpcy5fY3VyX29ial9lbmQgPSBOdW1iZXIuTUFYX1ZBTFVFIC8qdWludCovO1xuXHRcdFx0XHR0aGlzLl9jdXJfb2JqID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuX2J5dGVEYXRhLmdldEJ5dGVzQXZhaWxhYmxlKCkgPiAwKSB7XG5cdFx0XHRcdHZhciBjaWQ6bnVtYmVyIC8qdWludCovO1xuXHRcdFx0XHR2YXIgbGVuOm51bWJlciAvKnVpbnQqLztcblx0XHRcdFx0dmFyIGVuZDpudW1iZXIgLyp1aW50Ki87XG5cblx0XHRcdFx0Y2lkID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRcdFx0bGVuID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0XHRcdGVuZCA9IHRoaXMuX2J5dGVEYXRhLnBvc2l0aW9uICsgKGxlbiAtIDYpO1xuXG5cdFx0XHRcdHN3aXRjaCAoY2lkKSB7XG5cdFx0XHRcdFx0Y2FzZSAweDRENEQ6IC8vIE1BSU4zRFNcblx0XHRcdFx0XHRjYXNlIDB4M0QzRDogLy8gRURJVDNEU1xuXHRcdFx0XHRcdGNhc2UgMHhCMDAwOiAvLyBLRVlGM0RTXG5cdFx0XHRcdFx0XHQvLyBUaGlzIHR5cGVzIGFyZSBcImNvbnRhaW5lciBjaHVua3NcIiBhbmQgY29udGFpbiBvbmx5XG5cdFx0XHRcdFx0XHQvLyBzdWItY2h1bmtzIChubyBkYXRhIG9uIHRoZWlyIG93bi4pIFRoaXMgbWVhbnMgdGhhdFxuXHRcdFx0XHRcdFx0Ly8gdGhlcmUgaXMgbm90aGluZyBtb3JlIHRvIHBhcnNlIGF0IHRoaXMgcG9pbnQsIGFuZFxuXHRcdFx0XHRcdFx0Ly8gaW5zdGVhZCB3ZSBzaG91bGQgcHJvZ3Jlc3MgdG8gdGhlIG5leHQgY2h1bmssIHdoaWNoXG5cdFx0XHRcdFx0XHQvLyB3aWxsIGJlIHRoZSBmaXJzdCBzdWItY2h1bmsgb2YgdGhpcyBvbmUuXG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAweEFGRkY6IC8vIE1BVEVSSUFMXG5cdFx0XHRcdFx0XHR0aGlzLl9jdXJfbWF0X2VuZCA9IGVuZDtcblx0XHRcdFx0XHRcdHRoaXMuX2N1cl9tYXQgPSB0aGlzLnBhcnNlTWF0ZXJpYWwoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAweDQwMDA6IC8vIEVESVRfT0JKRUNUXG5cdFx0XHRcdFx0XHR0aGlzLl9jdXJfb2JqX2VuZCA9IGVuZDtcblx0XHRcdFx0XHRcdHRoaXMuX2N1cl9vYmogPSBuZXcgT2JqZWN0Vk8oKTtcblx0XHRcdFx0XHRcdHRoaXMuX2N1cl9vYmoubmFtZSA9IHRoaXMucmVhZE51bFRlcm1zdHJpbmcoKTtcblx0XHRcdFx0XHRcdHRoaXMuX2N1cl9vYmoubWF0ZXJpYWxzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblx0XHRcdFx0XHRcdHRoaXMuX2N1cl9vYmoubWF0ZXJpYWxGYWNlcyA9IHt9O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlIDB4NDEwMDogLy8gT0JKX1RSSU1FU0hcblx0XHRcdFx0XHRcdHRoaXMuX2N1cl9vYmoudHlwZSA9IEFzc2V0VHlwZS5NRVNIO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlIDB4NDExMDogLy8gVFJJX1ZFUlRFWExcblx0XHRcdFx0XHRcdHRoaXMucGFyc2VWZXJ0ZXhMaXN0KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgMHg0MTIwOiAvLyBUUklfRkFDRUxJU1Rcblx0XHRcdFx0XHRcdHRoaXMucGFyc2VGYWNlTGlzdCgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlIDB4NDE0MDogLy8gVFJJX01BUFBJTkdDT09SRFNcblx0XHRcdFx0XHRcdHRoaXMucGFyc2VVVkxpc3QoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAweDQxMzA6IC8vIEZhY2UgbWF0ZXJpYWxzXG5cdFx0XHRcdFx0XHR0aGlzLnBhcnNlRmFjZU1hdGVyaWFsTGlzdCgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlIDB4NDE2MDogLy8gVHJhbnNmb3JtXG5cdFx0XHRcdFx0XHR0aGlzLl9jdXJfb2JqLnRyYW5zZm9ybSA9IHRoaXMucmVhZFRyYW5zZm9ybSgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlIDB4QjAwMjogLy8gT2JqZWN0IGFuaW1hdGlvbiAoaW5jbHVkaW5nIHBpdm90KVxuXHRcdFx0XHRcdFx0dGhpcy5wYXJzZU9iamVjdEFuaW1hdGlvbihlbmQpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlIDB4NDE1MDogLy8gU21vb3RoaW5nIGdyb3Vwc1xuXHRcdFx0XHRcdFx0dGhpcy5wYXJzZVNtb290aGluZ0dyb3VwcygpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0Ly8gU2tpcCB0aGlzICh1bmtub3duKSBjaHVua1xuXHRcdFx0XHRcdFx0dGhpcy5fYnl0ZURhdGEucG9zaXRpb24gKz0gKGxlbiAtIDYpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBQYXVzZSBwYXJzaW5nIGlmIHRoZXJlIHdlcmUgYW55IGRlcGVuZGVuY2llcyBmb3VuZCBkdXJpbmcgdGhpc1xuXHRcdFx0XHQvLyBpdGVyYXRpb24gKGkuZS4gaWYgdGhlcmUgYXJlIGFueSBkZXBlbmRlbmNpZXMgdGhhdCBuZWVkIHRvIGJlXG5cdFx0XHRcdC8vIHJldHJpZXZlZCBhdCB0aGlzIHRpbWUuKVxuXHRcdFx0XHRpZiAodGhpcy5kZXBlbmRlbmNpZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0dGhpcy5fcFBhdXNlQW5kUmV0cmlldmVEZXBlbmRlbmNpZXMoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIE1vcmUgcGFyc2luZyBpcyByZXF1aXJlZCBpZiB0aGUgZW50aXJlIGJ5dGUgYXJyYXkgaGFzIG5vdCB5ZXRcblx0XHQvLyBiZWVuIHJlYWQsIG9yIGlmIHRoZXJlIGlzIGEgY3VycmVudGx5IG5vbi1maW5hbGl6ZWQgb2JqZWN0IGluXG5cdFx0Ly8gdGhlIHBpcGVsaW5lLlxuXHRcdGlmICh0aGlzLl9ieXRlRGF0YS5nZXRCeXRlc0F2YWlsYWJsZSgpIHx8IHRoaXMuX2N1cl9vYmogfHwgdGhpcy5fY3VyX21hdCkge1xuXHRcdFx0cmV0dXJuIFBhcnNlckJhc2UuTU9SRV9UT19QQVJTRTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIG5hbWU6c3RyaW5nO1xuXG5cdFx0XHQvLyBGaW5hbGl6ZSBhbnkgcmVtYWluaW5nIG9iamVjdHMgYmVmb3JlIGVuZGluZy5cblx0XHRcdGZvciAobmFtZSBpbiB0aGlzLl91bmZpbmFsaXplZF9vYmplY3RzKSB7XG5cdFx0XHRcdHZhciBvYmo6RGlzcGxheU9iamVjdENvbnRhaW5lcjtcblx0XHRcdFx0b2JqID0gdGhpcy5jb25zdHJ1Y3RPYmplY3QodGhpcy5fdW5maW5hbGl6ZWRfb2JqZWN0c1tuYW1lXSk7XG5cdFx0XHRcdGlmIChvYmopIHtcblx0XHRcdFx0XHQvL2FkZCB0byB0aGUgY29udGVudCBwcm9wZXJ0eVxuXHRcdFx0XHRcdCg8RGlzcGxheU9iamVjdENvbnRhaW5lcj4gdGhpcy5fcENvbnRlbnQpLmFkZENoaWxkKG9iaik7XG5cblx0XHRcdFx0XHR0aGlzLl9wRmluYWxpemVBc3NldChvYmosIG5hbWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBQYXJzZXJCYXNlLlBBUlNJTkdfRE9ORTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgX3BTdGFydFBhcnNpbmcoZnJhbWVMaW1pdDpudW1iZXIpXG5cdHtcblx0XHRzdXBlci5fcFN0YXJ0UGFyc2luZyhmcmFtZUxpbWl0KTtcblxuXHRcdC8vY3JlYXRlIGEgY29udGVudCBvYmplY3QgZm9yIExvYWRlcnNcblx0XHR0aGlzLl9wQ29udGVudCA9IG5ldyBEaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG5cdH1cblxuXHRwcml2YXRlIHBhcnNlTWF0ZXJpYWwoKTpNYXRlcmlhbFZPXG5cdHtcblx0XHR2YXIgbWF0Ok1hdGVyaWFsVk87XG5cblx0XHRtYXQgPSBuZXcgTWF0ZXJpYWxWTygpO1xuXG5cdFx0d2hpbGUgKHRoaXMuX2J5dGVEYXRhLnBvc2l0aW9uIDwgdGhpcy5fY3VyX21hdF9lbmQpIHtcblx0XHRcdHZhciBjaWQ6bnVtYmVyIC8qdWludCovO1xuXHRcdFx0dmFyIGxlbjpudW1iZXIgLyp1aW50Ki87XG5cdFx0XHR2YXIgZW5kOm51bWJlciAvKnVpbnQqLztcblxuXHRcdFx0Y2lkID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRcdGxlbiA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdFx0ZW5kID0gdGhpcy5fYnl0ZURhdGEucG9zaXRpb24gKyAobGVuIC0gNik7XG5cblx0XHRcdHN3aXRjaCAoY2lkKSB7XG5cdFx0XHRcdGNhc2UgMHhBMDAwOiAvLyBNYXRlcmlhbCBuYW1lXG5cdFx0XHRcdFx0bWF0Lm5hbWUgPSB0aGlzLnJlYWROdWxUZXJtc3RyaW5nKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAweEEwMTA6IC8vIEFtYmllbnQgY29sb3Jcblx0XHRcdFx0XHRtYXQuYW1iaWVudENvbG9yID0gdGhpcy5yZWFkQ29sb3IoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDB4QTAyMDogLy8gRGlmZnVzZSBjb2xvclxuXHRcdFx0XHRcdG1hdC5kaWZmdXNlQ29sb3IgPSB0aGlzLnJlYWRDb2xvcigpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgMHhBMDMwOiAvLyBTcGVjdWxhciBjb2xvclxuXHRcdFx0XHRcdG1hdC5zcGVjdWxhckNvbG9yID0gdGhpcy5yZWFkQ29sb3IoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDB4QTA4MTogLy8gVHdvLXNpZGVkLCBleGlzdGVuY2UgaW5kaWNhdGVzIFwidHJ1ZVwiXG5cdFx0XHRcdFx0bWF0LnR3b1NpZGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDB4QTIwMDogLy8gTWFpbiAoY29sb3IpIHRleHR1cmVcblx0XHRcdFx0XHRtYXQuY29sb3JNYXAgPSB0aGlzLnBhcnNlVGV4dHVyZShlbmQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgMHhBMjA0OiAvLyBTcGVjdWxhciBtYXBcblx0XHRcdFx0XHRtYXQuc3BlY3VsYXJNYXAgPSB0aGlzLnBhcnNlVGV4dHVyZShlbmQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dGhpcy5fYnl0ZURhdGEucG9zaXRpb24gPSBlbmQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG1hdDtcblx0fVxuXG5cdHByaXZhdGUgcGFyc2VUZXh0dXJlKGVuZDpudW1iZXIgLyp1aW50Ki8pOlRleHR1cmVWT1xuXHR7XG5cdFx0dmFyIHRleDpUZXh0dXJlVk87XG5cblx0XHR0ZXggPSBuZXcgVGV4dHVyZVZPKCk7XG5cblx0XHR3aGlsZSAodGhpcy5fYnl0ZURhdGEucG9zaXRpb24gPCBlbmQpIHtcblx0XHRcdHZhciBjaWQ6bnVtYmVyIC8qdWludCovO1xuXHRcdFx0dmFyIGxlbjpudW1iZXIgLyp1aW50Ki87XG5cblx0XHRcdGNpZCA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0XHRsZW4gPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRJbnQoKTtcblxuXHRcdFx0c3dpdGNoIChjaWQpIHtcblx0XHRcdFx0Y2FzZSAweEEzMDA6XG5cdFx0XHRcdFx0dGV4LnVybCA9IHRoaXMucmVhZE51bFRlcm1zdHJpbmcoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdC8vIFNraXAgdGhpcyB1bmtub3duIHRleHR1cmUgc3ViLWNodW5rXG5cdFx0XHRcdFx0dGhpcy5fYnl0ZURhdGEucG9zaXRpb24gKz0gKGxlbiAtIDYpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuX3RleHR1cmVzW3RleC51cmxdID0gdGV4O1xuXHRcdHRoaXMuX3BBZGREZXBlbmRlbmN5KHRleC51cmwsIG5ldyBVUkxSZXF1ZXN0KHRleC51cmwpKTtcblxuXHRcdHJldHVybiB0ZXg7XG5cdH1cblxuXHRwcml2YXRlIHBhcnNlVmVydGV4TGlzdCgpOnZvaWRcblx0e1xuXHRcdHZhciBpOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgbGVuOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgY291bnQ6bnVtYmVyIC8qdWludCovO1xuXG5cdFx0Y291bnQgPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdHRoaXMuX2N1cl9vYmoudmVydHMgPSBuZXcgQXJyYXk8bnVtYmVyPihjb3VudCozKTtcblxuXHRcdGkgPSAwO1xuXHRcdGxlbiA9IHRoaXMuX2N1cl9vYmoudmVydHMubGVuZ3RoO1xuXHRcdHdoaWxlIChpIDwgbGVuKSB7XG5cdFx0XHR2YXIgeDpudW1iZXIsIHk6bnVtYmVyLCB6Om51bWJlcjtcblxuXHRcdFx0eCA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpO1xuXHRcdFx0eSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpO1xuXHRcdFx0eiA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpO1xuXG5cdFx0XHR0aGlzLl9jdXJfb2JqLnZlcnRzW2krK10gPSB4O1xuXHRcdFx0dGhpcy5fY3VyX29iai52ZXJ0c1tpKytdID0gejtcblx0XHRcdHRoaXMuX2N1cl9vYmoudmVydHNbaSsrXSA9IHk7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZUZhY2VMaXN0KCk6dm9pZFxuXHR7XG5cdFx0dmFyIGk6bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciBsZW46bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciBjb3VudDpudW1iZXIgLyp1aW50Ki87XG5cblx0XHRjb3VudCA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0dGhpcy5fY3VyX29iai5pbmRpY2VzID0gbmV3IEFycmF5PG51bWJlcj4oY291bnQqMykgLyp1aW50Ki87XG5cblx0XHRpID0gMDtcblx0XHRsZW4gPSB0aGlzLl9jdXJfb2JqLmluZGljZXMubGVuZ3RoO1xuXHRcdHdoaWxlIChpIDwgbGVuKSB7XG5cdFx0XHR2YXIgaTA6bnVtYmVyIC8qdWludCovLCBpMTpudW1iZXIgLyp1aW50Ki8sIGkyOm51bWJlciAvKnVpbnQqLztcblxuXHRcdFx0aTAgPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdFx0aTEgPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdFx0aTIgPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXG5cdFx0XHR0aGlzLl9jdXJfb2JqLmluZGljZXNbaSsrXSA9IGkwO1xuXHRcdFx0dGhpcy5fY3VyX29iai5pbmRpY2VzW2krK10gPSBpMjtcblx0XHRcdHRoaXMuX2N1cl9vYmouaW5kaWNlc1tpKytdID0gaTE7XG5cblx0XHRcdC8vIFNraXAgXCJmYWNlIGluZm9cIiwgaXJyZWxldmFudCBpbiBBd2F5M0Rcblx0XHRcdHRoaXMuX2J5dGVEYXRhLnBvc2l0aW9uICs9IDI7XG5cdFx0fVxuXG5cdFx0dGhpcy5fY3VyX29iai5zbW9vdGhpbmdHcm91cHMgPSBuZXcgQXJyYXk8bnVtYmVyPihjb3VudCkgLyp1aW50Ki87XG5cdH1cblxuXHRwcml2YXRlIHBhcnNlU21vb3RoaW5nR3JvdXBzKCk6dm9pZFxuXHR7XG5cdFx0dmFyIGxlbjpudW1iZXIgLyp1aW50Ki8gPSB0aGlzLl9jdXJfb2JqLmluZGljZXMubGVuZ3RoLzM7XG5cdFx0dmFyIGk6bnVtYmVyIC8qdWludCovID0gMDtcblx0XHR3aGlsZSAoaSA8IGxlbikge1xuXHRcdFx0dGhpcy5fY3VyX29iai5zbW9vdGhpbmdHcm91cHNbaV0gPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRcdGkrKztcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHBhcnNlVVZMaXN0KCk6dm9pZFxuXHR7XG5cdFx0dmFyIGk6bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciBsZW46bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciBjb3VudDpudW1iZXIgLyp1aW50Ki87XG5cblx0XHRjb3VudCA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0dGhpcy5fY3VyX29iai51dnMgPSBuZXcgQXJyYXk8bnVtYmVyPihjb3VudCoyKTtcblxuXHRcdGkgPSAwO1xuXHRcdGxlbiA9IHRoaXMuX2N1cl9vYmoudXZzLmxlbmd0aDtcblx0XHR3aGlsZSAoaSA8IGxlbikge1xuXHRcdFx0dGhpcy5fY3VyX29iai51dnNbaSsrXSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpO1xuXHRcdFx0dGhpcy5fY3VyX29iai51dnNbaSsrXSA9IDEuMCAtIHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgcGFyc2VGYWNlTWF0ZXJpYWxMaXN0KCk6dm9pZFxuXHR7XG5cdFx0dmFyIG1hdDpzdHJpbmc7XG5cdFx0dmFyIGNvdW50Om51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgaTpudW1iZXIgLyp1aW50Ki87XG5cdFx0dmFyIGZhY2VzOkFycmF5PG51bWJlcj4gLyp1aW50Ki87XG5cblx0XHRtYXQgPSB0aGlzLnJlYWROdWxUZXJtc3RyaW5nKCk7XG5cdFx0Y291bnQgPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXG5cdFx0ZmFjZXMgPSBuZXcgQXJyYXk8bnVtYmVyPihjb3VudCkgLyp1aW50Ki87XG5cdFx0aSA9IDA7XG5cdFx0d2hpbGUgKGkgPCBmYWNlcy5sZW5ndGgpXG5cdFx0XHRmYWNlc1tpKytdID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkU2hvcnQoKTtcblxuXHRcdHRoaXMuX2N1cl9vYmoubWF0ZXJpYWxzLnB1c2gobWF0KTtcblx0XHR0aGlzLl9jdXJfb2JqLm1hdGVyaWFsRmFjZXNbbWF0XSA9IGZhY2VzO1xuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZU9iamVjdEFuaW1hdGlvbihlbmQ6bnVtYmVyKTp2b2lkXG5cdHtcblx0XHR2YXIgdm86T2JqZWN0Vk87XG5cdFx0dmFyIG9iajpEaXNwbGF5T2JqZWN0Q29udGFpbmVyO1xuXHRcdHZhciBwaXZvdDpWZWN0b3IzRDtcblx0XHR2YXIgbmFtZTpzdHJpbmc7XG5cdFx0dmFyIGhpZXI6bnVtYmVyIC8qdWludCovO1xuXG5cdFx0Ly8gUGl2b3QgZGVmYXVsdHMgdG8gb3JpZ2luXG5cdFx0cGl2b3QgPSBuZXcgVmVjdG9yM0Q7XG5cblx0XHR3aGlsZSAodGhpcy5fYnl0ZURhdGEucG9zaXRpb24gPCBlbmQpIHtcblx0XHRcdHZhciBjaWQ6bnVtYmVyIC8qdWludCovO1xuXHRcdFx0dmFyIGxlbjpudW1iZXIgLyp1aW50Ki87XG5cblx0XHRcdGNpZCA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0XHRsZW4gPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRJbnQoKTtcblxuXHRcdFx0c3dpdGNoIChjaWQpIHtcblx0XHRcdFx0Y2FzZSAweGIwMTA6IC8vIE5hbWUvaGllcmFyY2h5XG5cdFx0XHRcdFx0bmFtZSA9IHRoaXMucmVhZE51bFRlcm1zdHJpbmcoKTtcblx0XHRcdFx0XHR0aGlzLl9ieXRlRGF0YS5wb3NpdGlvbiArPSA0O1xuXHRcdFx0XHRcdGhpZXIgPSB0aGlzLl9ieXRlRGF0YS5yZWFkU2hvcnQoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDB4YjAxMzogLy8gUGl2b3Rcblx0XHRcdFx0XHRwaXZvdC54ID0gdGhpcy5fYnl0ZURhdGEucmVhZEZsb2F0KCk7XG5cdFx0XHRcdFx0cGl2b3QueiA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpO1xuXHRcdFx0XHRcdHBpdm90LnkgPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRoaXMuX2J5dGVEYXRhLnBvc2l0aW9uICs9IChsZW4gLSA2KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBJZiBuYW1lIGlzIFwiJCQkRFVNTVlcIiB0aGlzIGlzIGFuIGVtcHR5IG9iamVjdCAoZS5nLiBhIGNvbnRhaW5lcilcblx0XHQvLyBhbmQgd2lsbCBiZSBpZ25vcmVkIGluIHRoaXMgdmVyc2lvbiBvZiB0aGUgcGFyc2VyXG5cdFx0Ly8gVE9ETzogSW1wbGVtZW50IGNvbnRhaW5lcnMgaW4gM0RTIHBhcnNlci5cblx0XHRpZiAobmFtZSAhPSAnJCQkRFVNTVknICYmIHRoaXMuX3VuZmluYWxpemVkX29iamVjdHMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcblx0XHRcdHZvID0gdGhpcy5fdW5maW5hbGl6ZWRfb2JqZWN0c1tuYW1lXTtcblx0XHRcdG9iaiA9IHRoaXMuY29uc3RydWN0T2JqZWN0KHZvLCBwaXZvdCk7XG5cblx0XHRcdGlmIChvYmopIHtcblx0XHRcdFx0Ly9hZGQgdG8gdGhlIGNvbnRlbnQgcHJvcGVydHlcblx0XHRcdFx0KDxEaXNwbGF5T2JqZWN0Q29udGFpbmVyPiB0aGlzLl9wQ29udGVudCkuYWRkQ2hpbGQob2JqKTtcblxuXHRcdFx0XHR0aGlzLl9wRmluYWxpemVBc3NldChvYmosIHZvLm5hbWUpO1xuXHRcdFx0fVxuXG5cblx0XHRcdGRlbGV0ZSB0aGlzLl91bmZpbmFsaXplZF9vYmplY3RzW25hbWVdO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgY29uc3RydWN0T2JqZWN0KG9iajpPYmplY3RWTywgcGl2b3Q6VmVjdG9yM0QgPSBudWxsKTpEaXNwbGF5T2JqZWN0Q29udGFpbmVyXG5cdHtcblx0XHRpZiAob2JqLnR5cGUgPT0gQXNzZXRUeXBlLk1FU0gpIHtcblx0XHRcdHZhciBpOm51bWJlciAvKnVpbnQqLztcblx0XHRcdHZhciBzdWI6VHJpYW5nbGVTdWJHZW9tZXRyeTtcblx0XHRcdHZhciBnZW9tOkdlb21ldHJ5O1xuXHRcdFx0dmFyIG1hdDpNYXRlcmlhbEJhc2U7XG5cdFx0XHR2YXIgbWVzaDpNZXNoO1xuXHRcdFx0dmFyIG10eDpNYXRyaXgzRDtcblx0XHRcdHZhciB2ZXJ0aWNlczpBcnJheTxWZXJ0ZXhWTz47XG5cdFx0XHR2YXIgZmFjZXM6QXJyYXk8RmFjZVZPPjtcblxuXHRcdFx0aWYgKG9iai5tYXRlcmlhbHMubGVuZ3RoID4gMSlcblx0XHRcdFx0Y29uc29sZS5sb2coXCJUaGUgQXdheTNEIDNEUyBwYXJzZXIgZG9lcyBub3Qgc3VwcG9ydCBtdWx0aXBsZSBtYXRlcmlhbHMgcGVyIG1lc2ggYXQgdGhpcyBwb2ludC5cIik7XG5cblx0XHRcdC8vIElnbm9yZSBlbXB0eSBvYmplY3RzXG5cdFx0XHRpZiAoIW9iai5pbmRpY2VzIHx8IG9iai5pbmRpY2VzLmxlbmd0aCA9PSAwKVxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdFx0dmVydGljZXMgPSBuZXcgQXJyYXk8VmVydGV4Vk8+KG9iai52ZXJ0cy5sZW5ndGgvMyk7XG5cdFx0XHRmYWNlcyA9IG5ldyBBcnJheTxGYWNlVk8+KG9iai5pbmRpY2VzLmxlbmd0aC8zKTtcblxuXHRcdFx0dGhpcy5wcmVwYXJlRGF0YSh2ZXJ0aWNlcywgZmFjZXMsIG9iaik7XG5cblx0XHRcdGlmICh0aGlzLl91c2VTbW9vdGhpbmdHcm91cHMpXG5cdFx0XHRcdHRoaXMuYXBwbHlTbW9vdGhHcm91cHModmVydGljZXMsIGZhY2VzKTtcblxuXHRcdFx0b2JqLnZlcnRzID0gbmV3IEFycmF5PG51bWJlcj4odmVydGljZXMubGVuZ3RoKjMpO1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdG9iai52ZXJ0c1tpKjNdID0gdmVydGljZXNbaV0ueDtcblx0XHRcdFx0b2JqLnZlcnRzW2kqMyArIDFdID0gdmVydGljZXNbaV0ueTtcblx0XHRcdFx0b2JqLnZlcnRzW2kqMyArIDJdID0gdmVydGljZXNbaV0uejtcblx0XHRcdH1cblx0XHRcdG9iai5pbmRpY2VzID0gbmV3IEFycmF5PG51bWJlcj4oZmFjZXMubGVuZ3RoKjMpIC8qdWludCovO1xuXG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgZmFjZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0b2JqLmluZGljZXNbaSozXSA9IGZhY2VzW2ldLmE7XG5cdFx0XHRcdG9iai5pbmRpY2VzW2kqMyArIDFdID0gZmFjZXNbaV0uYjtcblx0XHRcdFx0b2JqLmluZGljZXNbaSozICsgMl0gPSBmYWNlc1tpXS5jO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAob2JqLnV2cykge1xuXHRcdFx0XHQvLyBJZiB0aGUgb2JqZWN0IGhhZCBVVnMgdG8gc3RhcnQgd2l0aCwgdXNlIFVWcyBnZW5lcmF0ZWQgYnlcblx0XHRcdFx0Ly8gc21vb3RoaW5nIGdyb3VwIHNwbGl0dGluZyBhbGdvcml0aG0uIE90aGVyd2lzZSB0aG9zZSBVVnNcblx0XHRcdFx0Ly8gd2lsbCBiZSBub25zZW5zZSBhbmQgc2hvdWxkIGJlIHNraXBwZWQuXG5cdFx0XHRcdG9iai51dnMgPSBuZXcgQXJyYXk8bnVtYmVyPih2ZXJ0aWNlcy5sZW5ndGgqMik7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCB2ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdG9iai51dnNbaSoyXSA9IHZlcnRpY2VzW2ldLnU7XG5cdFx0XHRcdFx0b2JqLnV2c1tpKjIgKyAxXSA9IHZlcnRpY2VzW2ldLnY7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Z2VvbSA9IG5ldyBHZW9tZXRyeSgpO1xuXG5cdFx0XHQvLyBDb25zdHJ1Y3Qgc3ViLWdlb21ldHJpZXMgKHBvdGVudGlhbGx5IHNwbGl0dGluZyBidWZmZXJzKVxuXHRcdFx0Ly8gYW5kIGFkZCB0aGVtIHRvIGdlb21ldHJ5LlxuXHRcdFx0c3ViID0gbmV3IFRyaWFuZ2xlU3ViR2VvbWV0cnkodHJ1ZSk7XG5cdFx0XHRzdWIudXBkYXRlSW5kaWNlcyhvYmouaW5kaWNlcyk7XG5cdFx0XHRzdWIudXBkYXRlUG9zaXRpb25zKG9iai52ZXJ0cyk7XG5cdFx0XHRzdWIudXBkYXRlVVZzKG9iai51dnMpO1xuXG5cdFx0XHRnZW9tLmFkZFN1Ykdlb21ldHJ5KHN1Yik7XG5cblx0XHRcdGlmIChvYmoubWF0ZXJpYWxzLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0dmFyIG1uYW1lOnN0cmluZztcblx0XHRcdFx0bW5hbWUgPSBvYmoubWF0ZXJpYWxzWzBdO1xuXHRcdFx0XHRtYXQgPSB0aGlzLl9tYXRlcmlhbHNbbW5hbWVdLm1hdGVyaWFsO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBcHBseSBwaXZvdCB0cmFuc2xhdGlvbiB0byBnZW9tZXRyeSBpZiBhIHBpdm90IHdhc1xuXHRcdFx0Ly8gZm91bmQgd2hpbGUgcGFyc2luZyB0aGUga2V5ZnJhbWUgY2h1bmsgZWFybGllci5cblx0XHRcdGlmIChwaXZvdCkge1xuXHRcdFx0XHRpZiAob2JqLnRyYW5zZm9ybSkge1xuXHRcdFx0XHRcdC8vIElmIGEgdHJhbnNmb3JtIHdhcyBmb3VuZCB3aGlsZSBwYXJzaW5nIHRoZVxuXHRcdFx0XHRcdC8vIG9iamVjdCBjaHVuaywgdXNlIGl0IHRvIGZpbmQgdGhlIGxvY2FsIHBpdm90IHZlY3RvclxuXHRcdFx0XHRcdHZhciBkYXQ6QXJyYXk8bnVtYmVyPiA9IG9iai50cmFuc2Zvcm0uY29uY2F0KCk7XG5cdFx0XHRcdFx0ZGF0WzEyXSA9IDA7XG5cdFx0XHRcdFx0ZGF0WzEzXSA9IDA7XG5cdFx0XHRcdFx0ZGF0WzE0XSA9IDA7XG5cdFx0XHRcdFx0bXR4ID0gbmV3IE1hdHJpeDNEKGRhdCk7XG5cdFx0XHRcdFx0cGl2b3QgPSBtdHgudHJhbnNmb3JtVmVjdG9yKHBpdm90KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHBpdm90LnNjYWxlQnkoLTEpO1xuXG5cdFx0XHRcdG10eCA9IG5ldyBNYXRyaXgzRCgpO1xuXHRcdFx0XHRtdHguYXBwZW5kVHJhbnNsYXRpb24ocGl2b3QueCwgcGl2b3QueSwgcGl2b3Queik7XG5cdFx0XHRcdGdlb20uYXBwbHlUcmFuc2Zvcm1hdGlvbihtdHgpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBcHBseSB0cmFuc2Zvcm1hdGlvbiB0byBnZW9tZXRyeSBpZiBhIHRyYW5zZm9ybWF0aW9uXG5cdFx0XHQvLyB3YXMgZm91bmQgd2hpbGUgcGFyc2luZyB0aGUgb2JqZWN0IGNodW5rIGVhcmxpZXIuXG5cdFx0XHRpZiAob2JqLnRyYW5zZm9ybSkge1xuXHRcdFx0XHRtdHggPSBuZXcgTWF0cml4M0Qob2JqLnRyYW5zZm9ybSk7XG5cdFx0XHRcdG10eC5pbnZlcnQoKTtcblx0XHRcdFx0Z2VvbS5hcHBseVRyYW5zZm9ybWF0aW9uKG10eCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEZpbmFsIHRyYW5zZm9ybSBhcHBsaWVkIHRvIGdlb21ldHJ5LiBGaW5hbGl6ZSB0aGUgZ2VvbWV0cnksXG5cdFx0XHQvLyB3aGljaCB3aWxsIG5vIGxvbmdlciBiZSBtb2RpZmllZCBhZnRlciB0aGlzIHBvaW50LlxuXHRcdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQoZ2VvbSwgb2JqLm5hbWUuY29uY2F0KCdfZ2VvbScpKTtcblxuXHRcdFx0Ly8gQnVpbGQgbWVzaCBhbmQgcmV0dXJuIGl0XG5cdFx0XHRtZXNoID0gbmV3IE1lc2goZ2VvbSwgbWF0KTtcblx0XHRcdG1lc2gudHJhbnNmb3JtLm1hdHJpeDNEID0gbmV3IE1hdHJpeDNEKG9iai50cmFuc2Zvcm0pO1xuXHRcdFx0cmV0dXJuIG1lc2g7XG5cdFx0fVxuXG5cdFx0Ly8gSWYgcmVhY2hlZCwgdW5rbm93blxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0cHJpdmF0ZSBwcmVwYXJlRGF0YSh2ZXJ0aWNlczpBcnJheTxWZXJ0ZXhWTz4sIGZhY2VzOkFycmF5PEZhY2VWTz4sIG9iajpPYmplY3RWTyk6dm9pZFxuXHR7XG5cdFx0Ly8gY29udmVydCByYXcgT2JqZWN0Vk8ncyBkYXRhIHRvIHN0cnVjdHVyZWQgVmVydGV4Vk8gYW5kIEZhY2VWT1xuXHRcdHZhciBpOm51bWJlciAvKmludCovO1xuXHRcdHZhciBqOm51bWJlciAvKmludCovO1xuXHRcdHZhciBrOm51bWJlciAvKmludCovO1xuXHRcdHZhciBsZW46bnVtYmVyIC8qaW50Ki8gPSBvYmoudmVydHMubGVuZ3RoO1xuXHRcdGZvciAoaSA9IDAsIGogPSAwLCBrID0gMDsgaSA8IGxlbjspIHtcblx0XHRcdHZhciB2OlZlcnRleFZPID0gbmV3IFZlcnRleFZPO1xuXHRcdFx0di54ID0gb2JqLnZlcnRzW2krK107XG5cdFx0XHR2LnkgPSBvYmoudmVydHNbaSsrXTtcblx0XHRcdHYueiA9IG9iai52ZXJ0c1tpKytdO1xuXHRcdFx0aWYgKG9iai51dnMpIHtcblx0XHRcdFx0di51ID0gb2JqLnV2c1tqKytdO1xuXHRcdFx0XHR2LnYgPSBvYmoudXZzW2orK107XG5cdFx0XHR9XG5cdFx0XHR2ZXJ0aWNlc1trKytdID0gdjtcblx0XHR9XG5cdFx0bGVuID0gb2JqLmluZGljZXMubGVuZ3RoO1xuXHRcdGZvciAoaSA9IDAsIGsgPSAwOyBpIDwgbGVuOykge1xuXHRcdFx0dmFyIGY6RmFjZVZPID0gbmV3IEZhY2VWTygpO1xuXHRcdFx0Zi5hID0gb2JqLmluZGljZXNbaSsrXTtcblx0XHRcdGYuYiA9IG9iai5pbmRpY2VzW2krK107XG5cdFx0XHRmLmMgPSBvYmouaW5kaWNlc1tpKytdO1xuXHRcdFx0Zi5zbW9vdGhHcm91cCA9IG9iai5zbW9vdGhpbmdHcm91cHNba10gfHwgMDtcblx0XHRcdGZhY2VzW2srK10gPSBmO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgYXBwbHlTbW9vdGhHcm91cHModmVydGljZXM6QXJyYXk8VmVydGV4Vk8+LCBmYWNlczpBcnJheTxGYWNlVk8+KTp2b2lkXG5cdHtcblx0XHQvLyBjbG9uZSB2ZXJ0aWNlcyBhY2NvcmRpbmcgdG8gZm9sbG93aW5nIHJ1bGU6XG5cdFx0Ly8gY2xvbmUgaWYgdmVydGV4J3MgaW4gZmFjZXMgZnJvbSBncm91cHMgMSsyIGFuZCAzXG5cdFx0Ly8gZG9uJ3QgY2xvbmUgaWYgdmVydGV4J3MgaW4gZmFjZXMgZnJvbSBncm91cHMgMSsyLCAzIGFuZCAxKzNcblxuXHRcdHZhciBpOm51bWJlciAvKmludCovO1xuXHRcdHZhciBqOm51bWJlciAvKmludCovO1xuXHRcdHZhciBrOm51bWJlciAvKmludCovO1xuXHRcdHZhciBsOm51bWJlciAvKmludCovO1xuXHRcdHZhciBsZW46bnVtYmVyIC8qaW50Ki87XG5cdFx0dmFyIG51bVZlcnRzOm51bWJlciAvKnVpbnQqLyA9IHZlcnRpY2VzLmxlbmd0aDtcblx0XHR2YXIgbnVtRmFjZXM6bnVtYmVyIC8qdWludCovID0gZmFjZXMubGVuZ3RoO1xuXG5cdFx0Ly8gZXh0cmFjdCBncm91cHMgZGF0YSBmb3IgdmVydGljZXNcblx0XHR2YXIgdkdyb3VwczpBcnJheTxBcnJheTxudW1iZXI+PiAvKnVpbnQqLyA9IG5ldyBBcnJheTxBcnJheTxudW1iZXI+PihudW1WZXJ0cykgLyp1aW50Ki87XG5cdFx0Zm9yIChpID0gMDsgaSA8IG51bVZlcnRzOyBpKyspXG5cdFx0XHR2R3JvdXBzW2ldID0gbmV3IEFycmF5PG51bWJlcj4oKSAvKnVpbnQqLztcblx0XHRmb3IgKGkgPSAwOyBpIDwgbnVtRmFjZXM7IGkrKykge1xuXHRcdFx0dmFyIGZhY2U6RmFjZVZPID0gZmFjZXNbaV07XG5cdFx0XHRmb3IgKGogPSAwOyBqIDwgMzsgaisrKSB7XG5cdFx0XHRcdHZhciBncm91cHM6QXJyYXk8bnVtYmVyPiAvKnVpbnQqLyA9IHZHcm91cHNbKGogPT0gMCk/IGZhY2UuYSA6ICgoaiA9PSAxKT8gZmFjZS5iIDogZmFjZS5jKV07XG5cdFx0XHRcdHZhciBncm91cDpudW1iZXIgLyp1aW50Ki8gPSBmYWNlLnNtb290aEdyb3VwO1xuXHRcdFx0XHRmb3IgKGsgPSBncm91cHMubGVuZ3RoIC0gMTsgayA+PSAwOyBrLS0pIHtcblx0XHRcdFx0XHRpZiAoKGdyb3VwICYgZ3JvdXBzW2tdKSA+IDApIHtcblx0XHRcdFx0XHRcdGdyb3VwIHw9IGdyb3Vwc1trXTtcblx0XHRcdFx0XHRcdGdyb3Vwcy5zcGxpY2UoaywgMSk7XG5cdFx0XHRcdFx0XHRrID0gZ3JvdXBzLmxlbmd0aCAtIDE7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGdyb3Vwcy5wdXNoKGdyb3VwKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gY2xvbmUgdmVydGljZXNcblx0XHR2YXIgdkNsb25lczpBcnJheTxBcnJheTxudW1iZXI+PiAvKnVpbnQqLyA9IG5ldyBBcnJheTxBcnJheTxudW1iZXI+PihudW1WZXJ0cykgLyp1aW50Ki87XG5cdFx0Zm9yIChpID0gMDsgaSA8IG51bVZlcnRzOyBpKyspIHtcblx0XHRcdGlmICgobGVuID0gdkdyb3Vwc1tpXS5sZW5ndGgpIDwgMSlcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR2YXIgY2xvbmVzOkFycmF5PG51bWJlcj4gLyp1aW50Ki8gPSBuZXcgQXJyYXk8bnVtYmVyPihsZW4pIC8qdWludCovO1xuXHRcdFx0dkNsb25lc1tpXSA9IGNsb25lcztcblx0XHRcdGNsb25lc1swXSA9IGk7XG5cdFx0XHR2YXIgdjA6VmVydGV4Vk8gPSB2ZXJ0aWNlc1tpXTtcblx0XHRcdGZvciAoaiA9IDE7IGogPCBsZW47IGorKykge1xuXHRcdFx0XHR2YXIgdjE6VmVydGV4Vk8gPSBuZXcgVmVydGV4Vk87XG5cdFx0XHRcdHYxLnggPSB2MC54O1xuXHRcdFx0XHR2MS55ID0gdjAueTtcblx0XHRcdFx0djEueiA9IHYwLno7XG5cdFx0XHRcdHYxLnUgPSB2MC51O1xuXHRcdFx0XHR2MS52ID0gdjAudjtcblx0XHRcdFx0Y2xvbmVzW2pdID0gdmVydGljZXMubGVuZ3RoO1xuXHRcdFx0XHR2ZXJ0aWNlcy5wdXNoKHYxKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0bnVtVmVydHMgPSB2ZXJ0aWNlcy5sZW5ndGg7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgbnVtRmFjZXM7IGkrKykge1xuXHRcdFx0ZmFjZSA9IGZhY2VzW2ldO1xuXHRcdFx0Z3JvdXAgPSBmYWNlLnNtb290aEdyb3VwO1xuXHRcdFx0Zm9yIChqID0gMDsgaiA8IDM7IGorKykge1xuXHRcdFx0XHRrID0gKGogPT0gMCk/IGZhY2UuYSA6ICgoaiA9PSAxKT8gZmFjZS5iIDogZmFjZS5jKTtcblx0XHRcdFx0Z3JvdXBzID0gdkdyb3Vwc1trXTtcblx0XHRcdFx0bGVuID0gZ3JvdXBzLmxlbmd0aDtcblx0XHRcdFx0Y2xvbmVzID0gdkNsb25lc1trXTtcblx0XHRcdFx0Zm9yIChsID0gMDsgbCA8IGxlbjsgbCsrKSB7XG5cdFx0XHRcdFx0aWYgKCgoZ3JvdXAgPT0gMCkgJiYgKGdyb3Vwc1tsXSA9PSAwKSkgfHwgKChncm91cCAmIGdyb3Vwc1tsXSkgPiAwKSkge1xuXHRcdFx0XHRcdFx0dmFyIGluZGV4Om51bWJlciAvKnVpbnQqLyA9IGNsb25lc1tsXTtcblx0XHRcdFx0XHRcdGlmIChncm91cCA9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdC8vIHZlcnRleCBpcyB1bmlxdWUgaWYgbm8gc21vb3RoR3JvdXAgZm91bmRcblx0XHRcdFx0XHRcdFx0Z3JvdXBzLnNwbGljZShsLCAxKTtcblx0XHRcdFx0XHRcdFx0Y2xvbmVzLnNwbGljZShsLCAxKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChqID09IDApXG5cdFx0XHRcdFx0XHRcdGZhY2UuYSA9IGluZGV4OyBlbHNlIGlmIChqID09IDEpXG5cdFx0XHRcdFx0XHRcdGZhY2UuYiA9IGluZGV4OyBlbHNlXG5cdFx0XHRcdFx0XHRcdGZhY2UuYyA9IGluZGV4O1xuXHRcdFx0XHRcdFx0bCA9IGxlbjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGZpbmFsaXplQ3VycmVudE1hdGVyaWFsKCk6dm9pZFxuXHR7XG5cdFx0dmFyIG1hdDpUcmlhbmdsZU1ldGhvZE1hdGVyaWFsO1xuXG5cdFx0aWYgKHRoaXMuX2N1cl9tYXQuY29sb3JNYXApXG5cdFx0XHRtYXQgPSBuZXcgVHJpYW5nbGVNZXRob2RNYXRlcmlhbCh0aGlzLl9jdXJfbWF0LmNvbG9yTWFwLnRleHR1cmUgfHwgRGVmYXVsdE1hdGVyaWFsTWFuYWdlci5nZXREZWZhdWx0VGV4dHVyZSgpKTtcblx0XHRlbHNlXG5cdFx0XHRtYXQgPSBuZXcgVHJpYW5nbGVNZXRob2RNYXRlcmlhbCh0aGlzLl9jdXJfbWF0LmFtYmllbnRDb2xvcik7XG5cblx0XHRtYXQuZGlmZnVzZUNvbG9yID0gdGhpcy5fY3VyX21hdC5kaWZmdXNlQ29sb3I7XG5cdFx0bWF0LnNwZWN1bGFyQ29sb3IgPSB0aGlzLl9jdXJfbWF0LnNwZWN1bGFyQ29sb3I7XG5cblx0XHRpZiAodGhpcy5tYXRlcmlhbE1vZGUgPj0gMilcblx0XHRcdG1hdC5tYXRlcmlhbE1vZGUgPSBUcmlhbmdsZU1hdGVyaWFsTW9kZS5NVUxUSV9QQVNTXG5cblx0XHRtYXQuYm90aFNpZGVzID0gdGhpcy5fY3VyX21hdC50d29TaWRlZDtcblxuXHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KG1hdCwgdGhpcy5fY3VyX21hdC5uYW1lKTtcblxuXHRcdHRoaXMuX21hdGVyaWFsc1t0aGlzLl9jdXJfbWF0Lm5hbWVdID0gdGhpcy5fY3VyX21hdDtcblx0XHR0aGlzLl9jdXJfbWF0Lm1hdGVyaWFsID0gbWF0O1xuXG5cdFx0dGhpcy5fY3VyX21hdCA9IG51bGw7XG5cdH1cblxuXHRwcml2YXRlIHJlYWROdWxUZXJtc3RyaW5nKCk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY2hyOm51bWJlciAvKmludCovO1xuXHRcdHZhciBzdHI6c3RyaW5nID0gXCJcIjtcblxuXHRcdHdoaWxlICgoY2hyID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkQnl0ZSgpKSA+IDApXG5cdFx0XHRzdHIgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjaHIpO1xuXG5cdFx0cmV0dXJuIHN0cjtcblx0fVxuXG5cdHByaXZhdGUgcmVhZFRyYW5zZm9ybSgpOkFycmF5PG51bWJlcj5cblx0e1xuXHRcdHZhciBkYXRhOkFycmF5PG51bWJlcj47XG5cblx0XHRkYXRhID0gbmV3IEFycmF5PG51bWJlcj4oMTYpO1xuXG5cdFx0Ly8gWCBheGlzXG5cdFx0ZGF0YVswXSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpOyAvLyBYXG5cdFx0ZGF0YVsyXSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpOyAvLyBaXG5cdFx0ZGF0YVsxXSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpOyAvLyBZXG5cdFx0ZGF0YVszXSA9IDA7XG5cblx0XHQvLyBaIGF4aXNcblx0XHRkYXRhWzhdID0gdGhpcy5fYnl0ZURhdGEucmVhZEZsb2F0KCk7IC8vIFhcblx0XHRkYXRhWzEwXSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpOyAvLyBaXG5cdFx0ZGF0YVs5XSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpOyAvLyBZXG5cdFx0ZGF0YVsxMV0gPSAwO1xuXG5cdFx0Ly8gWSBBeGlzXG5cdFx0ZGF0YVs0XSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpOyAvLyBYXG5cdFx0ZGF0YVs2XSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpOyAvLyBaXG5cdFx0ZGF0YVs1XSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpOyAvLyBZXG5cdFx0ZGF0YVs3XSA9IDA7XG5cblx0XHQvLyBUcmFuc2xhdGlvblxuXHRcdGRhdGFbMTJdID0gdGhpcy5fYnl0ZURhdGEucmVhZEZsb2F0KCk7IC8vIFhcblx0XHRkYXRhWzE0XSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpOyAvLyBaXG5cdFx0ZGF0YVsxM10gPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKTsgLy8gWVxuXHRcdGRhdGFbMTVdID0gMTtcblxuXHRcdHJldHVybiBkYXRhO1xuXHR9XG5cblx0cHJpdmF0ZSByZWFkQ29sb3IoKTpudW1iZXIgLyppbnQqL1xuXHR7XG5cdFx0dmFyIGNpZDpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgbGVuOm51bWJlciAvKmludCovO1xuXHRcdHZhciByOm51bWJlciAvKmludCovLCBnOm51bWJlciAvKmludCovLCBiOm51bWJlciAvKmludCovO1xuXG5cdFx0Y2lkID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRsZW4gPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRJbnQoKTtcblxuXHRcdHN3aXRjaCAoY2lkKSB7XG5cdFx0XHRjYXNlIDB4MDAxMDogLy8gRmxvYXRzXG5cdFx0XHRcdHIgPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKSoyNTU7XG5cdFx0XHRcdGcgPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKSoyNTU7XG5cdFx0XHRcdGIgPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKSoyNTU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAweDAwMTE6IC8vIDI0LWJpdCBjb2xvclxuXHRcdFx0XHRyID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdFx0XHRnID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdFx0XHRiID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkQnl0ZSgpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRoaXMuX2J5dGVEYXRhLnBvc2l0aW9uICs9IChsZW4gLSA2KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIChyIDw8IDE2KSB8IChnIDw8IDgpIHwgYjtcblx0fVxufVxuXG5leHBvcnQgPSBNYXgzRFNQYXJzZXI7XG5cblxuIl19