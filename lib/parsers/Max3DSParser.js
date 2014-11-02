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
var DefaultMaterialManager = require("awayjs-renderergl/lib/materials/utils/DefaultMaterialManager");
var TriangleMethodMaterial = require("awayjs-renderergl/lib/materials/TriangleMethodMaterial");
var TriangleMaterialMode = require("awayjs-renderergl/lib/materials/TriangleMaterialMode");
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
/**
 *
 */
var FaceVO = (function () {
    function FaceVO() {
    }
    return FaceVO;
})();
/**
 *
 */
var MaterialVO = (function () {
    function MaterialVO() {
    }
    return MaterialVO;
})();
/**
 *
 */
var ObjectVO = (function () {
    function ObjectVO() {
    }
    return ObjectVO;
})();
/**
 *
 */
var TextureVO = (function () {
    function TextureVO() {
    }
    return TextureVO;
})();
/**
 *
 */
var VertexVO = (function () {
    function VertexVO() {
    }
    return VertexVO;
})();
module.exports = Max3DSParser;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXJzZXJzL21heDNkc3BhcnNlci50cyJdLCJuYW1lcyI6WyJNYXgzRFNQYXJzZXIiLCJNYXgzRFNQYXJzZXIuY29uc3RydWN0b3IiLCJNYXgzRFNQYXJzZXIuc3VwcG9ydHNUeXBlIiwiTWF4M0RTUGFyc2VyLnN1cHBvcnRzRGF0YSIsIk1heDNEU1BhcnNlci5faVJlc29sdmVEZXBlbmRlbmN5IiwiTWF4M0RTUGFyc2VyLl9pUmVzb2x2ZURlcGVuZGVuY3lGYWlsdXJlIiwiTWF4M0RTUGFyc2VyLl9wUHJvY2VlZFBhcnNpbmciLCJNYXgzRFNQYXJzZXIuX3BTdGFydFBhcnNpbmciLCJNYXgzRFNQYXJzZXIucGFyc2VNYXRlcmlhbCIsIk1heDNEU1BhcnNlci5wYXJzZVRleHR1cmUiLCJNYXgzRFNQYXJzZXIucGFyc2VWZXJ0ZXhMaXN0IiwiTWF4M0RTUGFyc2VyLnBhcnNlRmFjZUxpc3QiLCJNYXgzRFNQYXJzZXIucGFyc2VTbW9vdGhpbmdHcm91cHMiLCJNYXgzRFNQYXJzZXIucGFyc2VVVkxpc3QiLCJNYXgzRFNQYXJzZXIucGFyc2VGYWNlTWF0ZXJpYWxMaXN0IiwiTWF4M0RTUGFyc2VyLnBhcnNlT2JqZWN0QW5pbWF0aW9uIiwiTWF4M0RTUGFyc2VyLmNvbnN0cnVjdE9iamVjdCIsIk1heDNEU1BhcnNlci5wcmVwYXJlRGF0YSIsIk1heDNEU1BhcnNlci5hcHBseVNtb290aEdyb3VwcyIsIk1heDNEU1BhcnNlci5maW5hbGl6ZUN1cnJlbnRNYXRlcmlhbCIsIk1heDNEU1BhcnNlci5yZWFkTnVsVGVybXN0cmluZyIsIk1heDNEU1BhcnNlci5yZWFkVHJhbnNmb3JtIiwiTWF4M0RTUGFyc2VyLnJlYWRDb2xvciIsIkZhY2VWTyIsIkZhY2VWTy5jb25zdHJ1Y3RvciIsIk1hdGVyaWFsVk8iLCJNYXRlcmlhbFZPLmNvbnN0cnVjdG9yIiwiT2JqZWN0Vk8iLCJPYmplY3RWTy5jb25zdHJ1Y3RvciIsIlRleHR1cmVW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QUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDL0JBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEdBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNuQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDcENBLENBQUNBO1lBQ0RBLEdBQUdBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLEtBQUtBLENBQVNBLEtBQUtBLENBQUNBLE1BQU1BLEdBQUNBLENBQUNBLENBQUNBLENBQVVBO1lBRXpEQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDbkNBLEdBQUdBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLEdBQUNBLENBQUNBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUM5QkEsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2xDQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxHQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNuQ0EsQ0FBQ0E7WUFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2JBLEFBR0FBLDREQUg0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QUFJQSxRQUFRQSxHQUFtQkEsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDL0NBLElBQUlBLFFBQVFBLEdBQW1CQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUU1Q0EsQUFDQUEsbUNBRG1DQTtZQUMvQkEsT0FBT0EsR0FBaUNBLElBQUlBLEtBQUtBLENBQWdCQSxRQUFRQSxDQUFDQSxDQUFDQSxRQUFEQSxBQUFTQSxDQUFDQTtRQUN4RkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsUUFBUUEsRUFBRUEsQ0FBQ0EsRUFBRUE7WUFDNUJBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLEtBQUtBLEVBQVVBLENBQVVBO1FBQzNDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxRQUFRQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUMvQkEsSUFBSUEsSUFBSUEsR0FBVUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDM0JBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO2dCQUN4QkEsSUFBSUEsTUFBTUEsR0FBMEJBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLEdBQUVBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLEdBQUVBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUM1RkEsSUFBSUEsS0FBS0EsR0FBbUJBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO2dCQUM3Q0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7b0JBQ3pDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDN0JBLEtBQUtBLElBQUlBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUNuQkEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3BCQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDdkJBLENBQUNBO2dCQUNGQSxDQUFDQTtnQkFDREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFDcEJBLENBQUNBO1FBQ0ZBLENBQUNBO1FBQ0RBLEFBQ0FBLGlCQURpQkE7WUFDYkEsT0FBT0EsR0FBaUNBLElBQUlBLEtBQUtBLENBQWdCQSxRQUFRQSxDQUFDQSxDQUFDQSxRQUFEQSxBQUFTQSxDQUFDQTtRQUN4RkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsUUFBUUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7WUFDL0JBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNqQ0EsUUFBUUEsQ0FBQ0E7WUFDVkEsSUFBSUEsTUFBTUEsR0FBMEJBLElBQUlBLEtBQUtBLENBQVNBLEdBQUdBLENBQUNBLENBQUNBLFFBQURBLEFBQVNBLENBQUNBO1lBQ3BFQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQTtZQUNwQkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDZEEsSUFBSUEsRUFBRUEsR0FBWUEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDOUJBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO2dCQUMxQkEsSUFBSUEsRUFBRUEsR0FBWUEsSUFBSUEsUUFBUUEsQ0FBQ0E7Z0JBQy9CQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDWkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1pBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNaQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDWkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1pBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBO2dCQUM1QkEsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDbkJBLENBQUNBO1FBQ0ZBLENBQUNBO1FBQ0RBLFFBQVFBLEdBQUdBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBO1FBRTNCQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxRQUFRQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUMvQkEsSUFBSUEsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDaEJBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO1lBQ3pCQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDeEJBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLEdBQUVBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLEdBQUVBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNuREEsTUFBTUEsR0FBR0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3BCQSxHQUFHQSxHQUFHQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtnQkFDcEJBLE1BQU1BLEdBQUdBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNwQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsR0FBR0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7b0JBQzFCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxJQUFJQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDckVBLElBQUlBLEtBQUtBLEdBQW1CQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDdENBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUNoQkEsQUFDQUEsMkNBRDJDQTs0QkFDM0NBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBOzRCQUNw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QUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLEVBQUVBLEVBQUVBLElBQUlBO1FBQzFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxTQUFTQSxFQUFFQSxFQUFFQSxJQUFJQTtRQUMxQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsRUFBRUEsRUFBRUEsSUFBSUE7UUFDMUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBRVpBLEFBQ0FBLFNBRFNBO1FBQ1RBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLEVBQUVBLEVBQUVBLElBQUlBO1FBQzFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxTQUFTQSxFQUFFQSxFQUFFQSxJQUFJQTtRQUMzQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsRUFBRUEsRUFBRUEsSUFBSUE7UUFDMUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBRWJBLEFBQ0FBLFNBRFNBO1FBQ1RBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLEVBQUVBLEVBQUVBLElBQUlBO1FBQzFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxTQUFTQSxFQUFFQSxFQUFFQSxJQUFJQTtRQUMxQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsRUFBRUEsRUFBRUEsSUFBSUE7UUFDMUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNB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QWRBLEFBY0NBLElBQUE7QUFFRCxBQUdBOztHQURHO0lBQ0csU0FBUztJQUFmRSxTQUFNQSxTQUFTQTtJQUlmQyxDQUFDQTtJQUFERCxnQkFBQ0E7QUFBREEsQ0FKQSxBQUlDQSxJQUFBO0FBRUQsQUFHQTs7R0FERztJQUNHLFFBQVE7SUFBZEUsU0FBTUEsUUFBUUE7SUFTZEMsQ0FBQ0E7SUFBREQsZUFBQ0E7QUFBREEsQ0FUQSxBQVNDQSxJQUFBO0FBcEVELGlCQUFTLFlBQVksQ0FBQyIsImZpbGUiOiJwYXJzZXJzL01heDNEU1BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWF0cml4M0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL01hdHJpeDNEXCIpO1xuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiKTtcbmltcG9ydCBBc3NldFR5cGVcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9Bc3NldFR5cGVcIik7XG5pbXBvcnQgSUFzc2V0XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9JQXNzZXRcIik7XG5pbXBvcnQgVVJMTG9hZGVyRGF0YUZvcm1hdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxMb2FkZXJEYXRhRm9ybWF0XCIpO1xuaW1wb3J0IFVSTFJlcXVlc3RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTFJlcXVlc3RcIik7XG5pbXBvcnQgUGFyc2VyQmFzZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wYXJzZXJzL1BhcnNlckJhc2VcIik7XG5pbXBvcnQgUGFyc2VyVXRpbHNcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcGFyc2Vycy9QYXJzZXJVdGlsc1wiKTtcbmltcG9ydCBSZXNvdXJjZURlcGVuZGVuY3lcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wYXJzZXJzL1Jlc291cmNlRGVwZW5kZW5jeVwiKTtcbmltcG9ydCBUZXh0dXJlMkRCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9UZXh0dXJlMkRCYXNlXCIpO1xuaW1wb3J0IFRleHR1cmVQcm94eUJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL1RleHR1cmVQcm94eUJhc2VcIik7XG5pbXBvcnQgQnl0ZUFycmF5XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL0J5dGVBcnJheVwiKTtcblxuaW1wb3J0IERpc3BsYXlPYmplY3RDb250YWluZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvY29udGFpbmVycy9EaXNwbGF5T2JqZWN0Q29udGFpbmVyXCIpO1xuaW1wb3J0IEdlb21ldHJ5XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9HZW9tZXRyeVwiKTtcbmltcG9ydCBUcmlhbmdsZVN1Ykdlb21ldHJ5XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9UcmlhbmdsZVN1Ykdlb21ldHJ5XCIpO1xuaW1wb3J0IE1lc2hcdFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL01lc2hcIik7XG5pbXBvcnQgTWF0ZXJpYWxCYXNlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9NYXRlcmlhbEJhc2VcIik7XG5cbmltcG9ydCBEZWZhdWx0TWF0ZXJpYWxNYW5hZ2VyXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy91dGlscy9EZWZhdWx0TWF0ZXJpYWxNYW5hZ2VyXCIpO1xuaW1wb3J0IFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWxcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL1RyaWFuZ2xlTWV0aG9kTWF0ZXJpYWxcIik7XG5pbXBvcnQgVHJpYW5nbGVNYXRlcmlhbE1vZGVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvVHJpYW5nbGVNYXRlcmlhbE1vZGVcIik7XG5cbi8qKlxuICogTWF4M0RTUGFyc2VyIHByb3ZpZGVzIGEgcGFyc2VyIGZvciB0aGUgM2RzIGRhdGEgdHlwZS5cbiAqL1xuY2xhc3MgTWF4M0RTUGFyc2VyIGV4dGVuZHMgUGFyc2VyQmFzZVxue1xuXHRwcml2YXRlIF9ieXRlRGF0YTpCeXRlQXJyYXk7XG5cblx0cHJpdmF0ZSBfdGV4dHVyZXM6T2JqZWN0O1xuXHRwcml2YXRlIF9tYXRlcmlhbHM6T2JqZWN0O1xuXHRwcml2YXRlIF91bmZpbmFsaXplZF9vYmplY3RzOk9iamVjdDtcblxuXHRwcml2YXRlIF9jdXJfb2JqX2VuZDpudW1iZXI7XG5cdHByaXZhdGUgX2N1cl9vYmo6T2JqZWN0Vk87XG5cblx0cHJpdmF0ZSBfY3VyX21hdF9lbmQ6bnVtYmVyO1xuXHRwcml2YXRlIF9jdXJfbWF0Ok1hdGVyaWFsVk87XG5cdHByaXZhdGUgX3VzZVNtb290aGluZ0dyb3Vwczpib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IDxjb2RlPk1heDNEU1BhcnNlcjwvY29kZT4gb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0gdXNlU21vb3RoaW5nR3JvdXBzIERldGVybWluZXMgd2hldGhlciB0aGUgcGFyc2VyIGxvb2tzIGZvciBzbW9vdGhpbmcgZ3JvdXBzIGluIHRoZSAzZHMgZmlsZSBvciBhc3N1bWVzIHVuaWZvcm0gc21vb3RoaW5nLiBEZWZhdWx0cyB0byB0cnVlLlxuXHQgKi9cblx0Y29uc3RydWN0b3IodXNlU21vb3RoaW5nR3JvdXBzOmJvb2xlYW4gPSB0cnVlKVxuXHR7XG5cdFx0c3VwZXIoVVJMTG9hZGVyRGF0YUZvcm1hdC5BUlJBWV9CVUZGRVIpO1xuXG5cdFx0dGhpcy5fdXNlU21vb3RoaW5nR3JvdXBzID0gdXNlU21vb3RoaW5nR3JvdXBzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBhIGdpdmVuIGZpbGUgZXh0ZW5zaW9uIGlzIHN1cHBvcnRlZCBieSB0aGUgcGFyc2VyLlxuXHQgKiBAcGFyYW0gZXh0ZW5zaW9uIFRoZSBmaWxlIGV4dGVuc2lvbiBvZiBhIHBvdGVudGlhbCBmaWxlIHRvIGJlIHBhcnNlZC5cblx0ICogQHJldHVybiBXaGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gZmlsZSB0eXBlIGlzIHN1cHBvcnRlZC5cblx0ICovXG5cdHB1YmxpYyBzdGF0aWMgc3VwcG9ydHNUeXBlKGV4dGVuc2lvbjpzdHJpbmcpOmJvb2xlYW5cblx0e1xuXHRcdGV4dGVuc2lvbiA9IGV4dGVuc2lvbi50b0xvd2VyQ2FzZSgpO1xuXHRcdHJldHVybiBleHRlbnNpb24gPT0gXCIzZHNcIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBUZXN0cyB3aGV0aGVyIGEgZGF0YSBibG9jayBjYW4gYmUgcGFyc2VkIGJ5IHRoZSBwYXJzZXIuXG5cdCAqIEBwYXJhbSBkYXRhIFRoZSBkYXRhIGJsb2NrIHRvIHBvdGVudGlhbGx5IGJlIHBhcnNlZC5cblx0ICogQHJldHVybiBXaGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gZGF0YSBpcyBzdXBwb3J0ZWQuXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIHN1cHBvcnRzRGF0YShkYXRhOmFueSk6Ym9vbGVhblxuXHR7XG5cdFx0dmFyIGJhOkJ5dGVBcnJheTtcblxuXHRcdGJhID0gUGFyc2VyVXRpbHMudG9CeXRlQXJyYXkoZGF0YSk7XG5cdFx0aWYgKGJhKSB7XG5cdFx0XHRiYS5wb3NpdGlvbiA9IDA7XG5cdFx0XHRpZiAoYmEucmVhZFNob3J0KCkgPT0gMHg0ZDRkKVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfaVJlc29sdmVEZXBlbmRlbmN5KHJlc291cmNlRGVwZW5kZW5jeTpSZXNvdXJjZURlcGVuZGVuY3kpOnZvaWRcblx0e1xuXHRcdGlmIChyZXNvdXJjZURlcGVuZGVuY3kuYXNzZXRzLmxlbmd0aCA9PSAxKSB7XG5cdFx0XHR2YXIgYXNzZXQ6SUFzc2V0O1xuXG5cdFx0XHRhc3NldCA9IHJlc291cmNlRGVwZW5kZW5jeS5hc3NldHNbMF07XG5cdFx0XHRpZiAoYXNzZXQuYXNzZXRUeXBlID09IEFzc2V0VHlwZS5URVhUVVJFKSB7XG5cdFx0XHRcdHZhciB0ZXg6VGV4dHVyZVZPO1xuXG5cdFx0XHRcdHRleCA9IHRoaXMuX3RleHR1cmVzW3Jlc291cmNlRGVwZW5kZW5jeS5pZF07XG5cdFx0XHRcdHRleC50ZXh0dXJlID0gPFRleHR1cmUyREJhc2U+IGFzc2V0O1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pUmVzb2x2ZURlcGVuZGVuY3lGYWlsdXJlKHJlc291cmNlRGVwZW5kZW5jeTpSZXNvdXJjZURlcGVuZGVuY3kpOnZvaWRcblx0e1xuXHRcdC8vIFRPRE86IEltcGxlbWVudFxuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX3BQcm9jZWVkUGFyc2luZygpOmJvb2xlYW5cblx0e1xuXHRcdGlmICghdGhpcy5fYnl0ZURhdGEpIHtcblx0XHRcdHRoaXMuX2J5dGVEYXRhID0gdGhpcy5fcEdldEJ5dGVEYXRhKCk7XG5cdFx0XHR0aGlzLl9ieXRlRGF0YS5wb3NpdGlvbiA9IDA7XG5cblx0XHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFx0Ly8gTElUVExFX0VORElBTiAtIERlZmF1bHQgZm9yIEFycmF5QnVmZmVyIC8gTm90IGltcGxlbWVudGVkIGluIEJ5dGVBcnJheVxuXHRcdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XHQvL3RoaXMuX2J5dGVEYXRhLmVuZGlhbiA9IEVuZGlhbi5MSVRUTEVfRU5ESUFOOy8vIFNob3VsZCBiZSBkZWZhdWx0XG5cdFx0XHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRcdFx0dGhpcy5fdGV4dHVyZXMgPSB7fTtcblx0XHRcdHRoaXMuX21hdGVyaWFscyA9IHt9O1xuXHRcdFx0dGhpcy5fdW5maW5hbGl6ZWRfb2JqZWN0cyA9IHt9O1xuXHRcdH1cblxuXHRcdC8vIFRPRE86IFdpdGggdGhpcyBjb25zdHJ1Y3QsIHRoZSBsb29wIHdpbGwgcnVuIG5vLW9wIGZvciBhcyBsb25nXG5cdFx0Ly8gYXMgdGhlcmUgaXMgdGltZSBvbmNlIGZpbGUgaGFzIGZpbmlzaGVkIHJlYWRpbmcuIENvbnNpZGVyIGEgbmljZVxuXHRcdC8vIHdheSB0byBzdG9wIGxvb3Agd2hlbiBieXRlIGFycmF5IGlzIGVtcHR5LCB3aXRob3V0IHB1dHRpbmcgaXQgaW5cblx0XHQvLyB0aGUgd2hpbGUtY29uZGl0aW9uYWwsIHdoaWNoIHdpbGwgcHJldmVudCBmaW5hbGl6YXRpb25zIGZyb21cblx0XHQvLyBoYXBwZW5pbmcgYWZ0ZXIgdGhlIGxhc3QgY2h1bmsuXG5cdFx0d2hpbGUgKHRoaXMuX3BIYXNUaW1lKCkpIHtcblxuXHRcdFx0Ly8gSWYgd2UgYXJlIGN1cnJlbnRseSB3b3JraW5nIG9uIGFuIG9iamVjdCwgYW5kIHRoZSBtb3N0IHJlY2VudCBjaHVuayB3YXNcblx0XHRcdC8vIHRoZSBsYXN0IG9uZSBpbiB0aGF0IG9iamVjdCwgZmluYWxpemUgdGhlIGN1cnJlbnQgb2JqZWN0LlxuXHRcdFx0aWYgKHRoaXMuX2N1cl9tYXQgJiYgdGhpcy5fYnl0ZURhdGEucG9zaXRpb24gPj0gdGhpcy5fY3VyX21hdF9lbmQpXG5cdFx0XHRcdHRoaXMuZmluYWxpemVDdXJyZW50TWF0ZXJpYWwoKTtcblx0XHRcdGVsc2UgaWYgKHRoaXMuX2N1cl9vYmogJiYgdGhpcy5fYnl0ZURhdGEucG9zaXRpb24gPj0gdGhpcy5fY3VyX29ial9lbmQpIHtcblx0XHRcdFx0Ly8gQ2FuJ3QgZmluYWxpemUgYXQgdGhpcyBwb2ludCwgYmVjYXVzZSB3ZSBoYXZlIHRvIHdhaXQgdW50aWwgdGhlIGZ1bGxcblx0XHRcdFx0Ly8gYW5pbWF0aW9uIHNlY3Rpb24gaGFzIGJlZW4gcGFyc2VkIGZvciBhbnkgcG90ZW50aWFsIHBpdm90IGRlZmluaXRpb25zXG5cdFx0XHRcdHRoaXMuX3VuZmluYWxpemVkX29iamVjdHNbdGhpcy5fY3VyX29iai5uYW1lXSA9IHRoaXMuX2N1cl9vYmo7XG5cdFx0XHRcdHRoaXMuX2N1cl9vYmpfZW5kID0gTnVtYmVyLk1BWF9WQUxVRSAvKnVpbnQqLztcblx0XHRcdFx0dGhpcy5fY3VyX29iaiA9IG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLl9ieXRlRGF0YS5nZXRCeXRlc0F2YWlsYWJsZSgpID4gMCkge1xuXHRcdFx0XHR2YXIgY2lkOm51bWJlciAvKnVpbnQqLztcblx0XHRcdFx0dmFyIGxlbjpudW1iZXIgLyp1aW50Ki87XG5cdFx0XHRcdHZhciBlbmQ6bnVtYmVyIC8qdWludCovO1xuXG5cdFx0XHRcdGNpZCA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0XHRcdGxlbiA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZEludCgpO1xuXHRcdFx0XHRlbmQgPSB0aGlzLl9ieXRlRGF0YS5wb3NpdGlvbiArIChsZW4gLSA2KTtcblxuXHRcdFx0XHRzd2l0Y2ggKGNpZCkge1xuXHRcdFx0XHRcdGNhc2UgMHg0RDREOiAvLyBNQUlOM0RTXG5cdFx0XHRcdFx0Y2FzZSAweDNEM0Q6IC8vIEVESVQzRFNcblx0XHRcdFx0XHRjYXNlIDB4QjAwMDogLy8gS0VZRjNEU1xuXHRcdFx0XHRcdFx0Ly8gVGhpcyB0eXBlcyBhcmUgXCJjb250YWluZXIgY2h1bmtzXCIgYW5kIGNvbnRhaW4gb25seVxuXHRcdFx0XHRcdFx0Ly8gc3ViLWNodW5rcyAobm8gZGF0YSBvbiB0aGVpciBvd24uKSBUaGlzIG1lYW5zIHRoYXRcblx0XHRcdFx0XHRcdC8vIHRoZXJlIGlzIG5vdGhpbmcgbW9yZSB0byBwYXJzZSBhdCB0aGlzIHBvaW50LCBhbmRcblx0XHRcdFx0XHRcdC8vIGluc3RlYWQgd2Ugc2hvdWxkIHByb2dyZXNzIHRvIHRoZSBuZXh0IGNodW5rLCB3aGljaFxuXHRcdFx0XHRcdFx0Ly8gd2lsbCBiZSB0aGUgZmlyc3Qgc3ViLWNodW5rIG9mIHRoaXMgb25lLlxuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgMHhBRkZGOiAvLyBNQVRFUklBTFxuXHRcdFx0XHRcdFx0dGhpcy5fY3VyX21hdF9lbmQgPSBlbmQ7XG5cdFx0XHRcdFx0XHR0aGlzLl9jdXJfbWF0ID0gdGhpcy5wYXJzZU1hdGVyaWFsKCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgMHg0MDAwOiAvLyBFRElUX09CSkVDVFxuXHRcdFx0XHRcdFx0dGhpcy5fY3VyX29ial9lbmQgPSBlbmQ7XG5cdFx0XHRcdFx0XHR0aGlzLl9jdXJfb2JqID0gbmV3IE9iamVjdFZPKCk7XG5cdFx0XHRcdFx0XHR0aGlzLl9jdXJfb2JqLm5hbWUgPSB0aGlzLnJlYWROdWxUZXJtc3RyaW5nKCk7XG5cdFx0XHRcdFx0XHR0aGlzLl9jdXJfb2JqLm1hdGVyaWFscyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cdFx0XHRcdFx0XHR0aGlzLl9jdXJfb2JqLm1hdGVyaWFsRmFjZXMgPSB7fTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAweDQxMDA6IC8vIE9CSl9UUklNRVNIXG5cdFx0XHRcdFx0XHR0aGlzLl9jdXJfb2JqLnR5cGUgPSBBc3NldFR5cGUuTUVTSDtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAweDQxMTA6IC8vIFRSSV9WRVJURVhMXG5cdFx0XHRcdFx0XHR0aGlzLnBhcnNlVmVydGV4TGlzdCgpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlIDB4NDEyMDogLy8gVFJJX0ZBQ0VMSVNUXG5cdFx0XHRcdFx0XHR0aGlzLnBhcnNlRmFjZUxpc3QoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAweDQxNDA6IC8vIFRSSV9NQVBQSU5HQ09PUkRTXG5cdFx0XHRcdFx0XHR0aGlzLnBhcnNlVVZMaXN0KCk7XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGNhc2UgMHg0MTMwOiAvLyBGYWNlIG1hdGVyaWFsc1xuXHRcdFx0XHRcdFx0dGhpcy5wYXJzZUZhY2VNYXRlcmlhbExpc3QoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAweDQxNjA6IC8vIFRyYW5zZm9ybVxuXHRcdFx0XHRcdFx0dGhpcy5fY3VyX29iai50cmFuc2Zvcm0gPSB0aGlzLnJlYWRUcmFuc2Zvcm0oKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAweEIwMDI6IC8vIE9iamVjdCBhbmltYXRpb24gKGluY2x1ZGluZyBwaXZvdClcblx0XHRcdFx0XHRcdHRoaXMucGFyc2VPYmplY3RBbmltYXRpb24oZW5kKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSAweDQxNTA6IC8vIFNtb290aGluZyBncm91cHNcblx0XHRcdFx0XHRcdHRoaXMucGFyc2VTbW9vdGhpbmdHcm91cHMoKTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdC8vIFNraXAgdGhpcyAodW5rbm93bikgY2h1bmtcblx0XHRcdFx0XHRcdHRoaXMuX2J5dGVEYXRhLnBvc2l0aW9uICs9IChsZW4gLSA2KTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUGF1c2UgcGFyc2luZyBpZiB0aGVyZSB3ZXJlIGFueSBkZXBlbmRlbmNpZXMgZm91bmQgZHVyaW5nIHRoaXNcblx0XHRcdFx0Ly8gaXRlcmF0aW9uIChpLmUuIGlmIHRoZXJlIGFyZSBhbnkgZGVwZW5kZW5jaWVzIHRoYXQgbmVlZCB0byBiZVxuXHRcdFx0XHQvLyByZXRyaWV2ZWQgYXQgdGhpcyB0aW1lLilcblx0XHRcdFx0aWYgKHRoaXMuZGVwZW5kZW5jaWVzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHRoaXMuX3BQYXVzZUFuZFJldHJpZXZlRGVwZW5kZW5jaWVzKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBNb3JlIHBhcnNpbmcgaXMgcmVxdWlyZWQgaWYgdGhlIGVudGlyZSBieXRlIGFycmF5IGhhcyBub3QgeWV0XG5cdFx0Ly8gYmVlbiByZWFkLCBvciBpZiB0aGVyZSBpcyBhIGN1cnJlbnRseSBub24tZmluYWxpemVkIG9iamVjdCBpblxuXHRcdC8vIHRoZSBwaXBlbGluZS5cblx0XHRpZiAodGhpcy5fYnl0ZURhdGEuZ2V0Qnl0ZXNBdmFpbGFibGUoKSB8fCB0aGlzLl9jdXJfb2JqIHx8IHRoaXMuX2N1cl9tYXQpIHtcblx0XHRcdHJldHVybiBQYXJzZXJCYXNlLk1PUkVfVE9fUEFSU0U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBuYW1lOnN0cmluZztcblxuXHRcdFx0Ly8gRmluYWxpemUgYW55IHJlbWFpbmluZyBvYmplY3RzIGJlZm9yZSBlbmRpbmcuXG5cdFx0XHRmb3IgKG5hbWUgaW4gdGhpcy5fdW5maW5hbGl6ZWRfb2JqZWN0cykge1xuXHRcdFx0XHR2YXIgb2JqOkRpc3BsYXlPYmplY3RDb250YWluZXI7XG5cdFx0XHRcdG9iaiA9IHRoaXMuY29uc3RydWN0T2JqZWN0KHRoaXMuX3VuZmluYWxpemVkX29iamVjdHNbbmFtZV0pO1xuXHRcdFx0XHRpZiAob2JqKSB7XG5cdFx0XHRcdFx0Ly9hZGQgdG8gdGhlIGNvbnRlbnQgcHJvcGVydHlcblx0XHRcdFx0XHQoPERpc3BsYXlPYmplY3RDb250YWluZXI+IHRoaXMuX3BDb250ZW50KS5hZGRDaGlsZChvYmopO1xuXG5cdFx0XHRcdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQob2JqLCBuYW1lKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gUGFyc2VyQmFzZS5QQVJTSU5HX0RPTkU7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIF9wU3RhcnRQYXJzaW5nKGZyYW1lTGltaXQ6bnVtYmVyKVxuXHR7XG5cdFx0c3VwZXIuX3BTdGFydFBhcnNpbmcoZnJhbWVMaW1pdCk7XG5cblx0XHQvL2NyZWF0ZSBhIGNvbnRlbnQgb2JqZWN0IGZvciBMb2FkZXJzXG5cdFx0dGhpcy5fcENvbnRlbnQgPSBuZXcgRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZU1hdGVyaWFsKCk6TWF0ZXJpYWxWT1xuXHR7XG5cdFx0dmFyIG1hdDpNYXRlcmlhbFZPO1xuXG5cdFx0bWF0ID0gbmV3IE1hdGVyaWFsVk8oKTtcblxuXHRcdHdoaWxlICh0aGlzLl9ieXRlRGF0YS5wb3NpdGlvbiA8IHRoaXMuX2N1cl9tYXRfZW5kKSB7XG5cdFx0XHR2YXIgY2lkOm51bWJlciAvKnVpbnQqLztcblx0XHRcdHZhciBsZW46bnVtYmVyIC8qdWludCovO1xuXHRcdFx0dmFyIGVuZDpudW1iZXIgLyp1aW50Ki87XG5cblx0XHRcdGNpZCA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0XHRsZW4gPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRJbnQoKTtcblx0XHRcdGVuZCA9IHRoaXMuX2J5dGVEYXRhLnBvc2l0aW9uICsgKGxlbiAtIDYpO1xuXG5cdFx0XHRzd2l0Y2ggKGNpZCkge1xuXHRcdFx0XHRjYXNlIDB4QTAwMDogLy8gTWF0ZXJpYWwgbmFtZVxuXHRcdFx0XHRcdG1hdC5uYW1lID0gdGhpcy5yZWFkTnVsVGVybXN0cmluZygpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgMHhBMDEwOiAvLyBBbWJpZW50IGNvbG9yXG5cdFx0XHRcdFx0bWF0LmFtYmllbnRDb2xvciA9IHRoaXMucmVhZENvbG9yKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAweEEwMjA6IC8vIERpZmZ1c2UgY29sb3Jcblx0XHRcdFx0XHRtYXQuZGlmZnVzZUNvbG9yID0gdGhpcy5yZWFkQ29sb3IoKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDB4QTAzMDogLy8gU3BlY3VsYXIgY29sb3Jcblx0XHRcdFx0XHRtYXQuc3BlY3VsYXJDb2xvciA9IHRoaXMucmVhZENvbG9yKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAweEEwODE6IC8vIFR3by1zaWRlZCwgZXhpc3RlbmNlIGluZGljYXRlcyBcInRydWVcIlxuXHRcdFx0XHRcdG1hdC50d29TaWRlZCA9IHRydWU7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAweEEyMDA6IC8vIE1haW4gKGNvbG9yKSB0ZXh0dXJlXG5cdFx0XHRcdFx0bWF0LmNvbG9yTWFwID0gdGhpcy5wYXJzZVRleHR1cmUoZW5kKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIDB4QTIwNDogLy8gU3BlY3VsYXIgbWFwXG5cdFx0XHRcdFx0bWF0LnNwZWN1bGFyTWFwID0gdGhpcy5wYXJzZVRleHR1cmUoZW5kKTtcblx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRoaXMuX2J5dGVEYXRhLnBvc2l0aW9uID0gZW5kO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBtYXQ7XG5cdH1cblxuXHRwcml2YXRlIHBhcnNlVGV4dHVyZShlbmQ6bnVtYmVyIC8qdWludCovKTpUZXh0dXJlVk9cblx0e1xuXHRcdHZhciB0ZXg6VGV4dHVyZVZPO1xuXG5cdFx0dGV4ID0gbmV3IFRleHR1cmVWTygpO1xuXG5cdFx0d2hpbGUgKHRoaXMuX2J5dGVEYXRhLnBvc2l0aW9uIDwgZW5kKSB7XG5cdFx0XHR2YXIgY2lkOm51bWJlciAvKnVpbnQqLztcblx0XHRcdHZhciBsZW46bnVtYmVyIC8qdWludCovO1xuXG5cdFx0XHRjaWQgPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdFx0bGVuID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkSW50KCk7XG5cblx0XHRcdHN3aXRjaCAoY2lkKSB7XG5cdFx0XHRcdGNhc2UgMHhBMzAwOlxuXHRcdFx0XHRcdHRleC51cmwgPSB0aGlzLnJlYWROdWxUZXJtc3RyaW5nKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHQvLyBTa2lwIHRoaXMgdW5rbm93biB0ZXh0dXJlIHN1Yi1jaHVua1xuXHRcdFx0XHRcdHRoaXMuX2J5dGVEYXRhLnBvc2l0aW9uICs9IChsZW4gLSA2KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl90ZXh0dXJlc1t0ZXgudXJsXSA9IHRleDtcblx0XHR0aGlzLl9wQWRkRGVwZW5kZW5jeSh0ZXgudXJsLCBuZXcgVVJMUmVxdWVzdCh0ZXgudXJsKSk7XG5cblx0XHRyZXR1cm4gdGV4O1xuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZVZlcnRleExpc3QoKTp2b2lkXG5cdHtcblx0XHR2YXIgaTpudW1iZXIgLyp1aW50Ki87XG5cdFx0dmFyIGxlbjpudW1iZXIgLyp1aW50Ki87XG5cdFx0dmFyIGNvdW50Om51bWJlciAvKnVpbnQqLztcblxuXHRcdGNvdW50ID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHR0aGlzLl9jdXJfb2JqLnZlcnRzID0gbmV3IEFycmF5PG51bWJlcj4oY291bnQqMyk7XG5cblx0XHRpID0gMDtcblx0XHRsZW4gPSB0aGlzLl9jdXJfb2JqLnZlcnRzLmxlbmd0aDtcblx0XHR3aGlsZSAoaSA8IGxlbikge1xuXHRcdFx0dmFyIHg6bnVtYmVyLCB5Om51bWJlciwgejpudW1iZXI7XG5cblx0XHRcdHggPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKTtcblx0XHRcdHkgPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKTtcblx0XHRcdHogPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKTtcblxuXHRcdFx0dGhpcy5fY3VyX29iai52ZXJ0c1tpKytdID0geDtcblx0XHRcdHRoaXMuX2N1cl9vYmoudmVydHNbaSsrXSA9IHo7XG5cdFx0XHR0aGlzLl9jdXJfb2JqLnZlcnRzW2krK10gPSB5O1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgcGFyc2VGYWNlTGlzdCgpOnZvaWRcblx0e1xuXHRcdHZhciBpOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgbGVuOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgY291bnQ6bnVtYmVyIC8qdWludCovO1xuXG5cdFx0Y291bnQgPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdHRoaXMuX2N1cl9vYmouaW5kaWNlcyA9IG5ldyBBcnJheTxudW1iZXI+KGNvdW50KjMpIC8qdWludCovO1xuXG5cdFx0aSA9IDA7XG5cdFx0bGVuID0gdGhpcy5fY3VyX29iai5pbmRpY2VzLmxlbmd0aDtcblx0XHR3aGlsZSAoaSA8IGxlbikge1xuXHRcdFx0dmFyIGkwOm51bWJlciAvKnVpbnQqLywgaTE6bnVtYmVyIC8qdWludCovLCBpMjpudW1iZXIgLyp1aW50Ki87XG5cblx0XHRcdGkwID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRcdGkxID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkU2hvcnQoKTtcblx0XHRcdGkyID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkU2hvcnQoKTtcblxuXHRcdFx0dGhpcy5fY3VyX29iai5pbmRpY2VzW2krK10gPSBpMDtcblx0XHRcdHRoaXMuX2N1cl9vYmouaW5kaWNlc1tpKytdID0gaTI7XG5cdFx0XHR0aGlzLl9jdXJfb2JqLmluZGljZXNbaSsrXSA9IGkxO1xuXG5cdFx0XHQvLyBTa2lwIFwiZmFjZSBpbmZvXCIsIGlycmVsZXZhbnQgaW4gQXdheTNEXG5cdFx0XHR0aGlzLl9ieXRlRGF0YS5wb3NpdGlvbiArPSAyO1xuXHRcdH1cblxuXHRcdHRoaXMuX2N1cl9vYmouc21vb3RoaW5nR3JvdXBzID0gbmV3IEFycmF5PG51bWJlcj4oY291bnQpIC8qdWludCovO1xuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZVNtb290aGluZ0dyb3VwcygpOnZvaWRcblx0e1xuXHRcdHZhciBsZW46bnVtYmVyIC8qdWludCovID0gdGhpcy5fY3VyX29iai5pbmRpY2VzLmxlbmd0aC8zO1xuXHRcdHZhciBpOm51bWJlciAvKnVpbnQqLyA9IDA7XG5cdFx0d2hpbGUgKGkgPCBsZW4pIHtcblx0XHRcdHRoaXMuX2N1cl9vYmouc21vb3RoaW5nR3JvdXBzW2ldID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkSW50KCk7XG5cdFx0XHRpKys7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZVVWTGlzdCgpOnZvaWRcblx0e1xuXHRcdHZhciBpOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgbGVuOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgY291bnQ6bnVtYmVyIC8qdWludCovO1xuXG5cdFx0Y291bnQgPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdHRoaXMuX2N1cl9vYmoudXZzID0gbmV3IEFycmF5PG51bWJlcj4oY291bnQqMik7XG5cblx0XHRpID0gMDtcblx0XHRsZW4gPSB0aGlzLl9jdXJfb2JqLnV2cy5sZW5ndGg7XG5cdFx0d2hpbGUgKGkgPCBsZW4pIHtcblx0XHRcdHRoaXMuX2N1cl9vYmoudXZzW2krK10gPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKTtcblx0XHRcdHRoaXMuX2N1cl9vYmoudXZzW2krK10gPSAxLjAgLSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIHBhcnNlRmFjZU1hdGVyaWFsTGlzdCgpOnZvaWRcblx0e1xuXHRcdHZhciBtYXQ6c3RyaW5nO1xuXHRcdHZhciBjb3VudDpudW1iZXIgLyp1aW50Ki87XG5cdFx0dmFyIGk6bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciBmYWNlczpBcnJheTxudW1iZXI+IC8qdWludCovO1xuXG5cdFx0bWF0ID0gdGhpcy5yZWFkTnVsVGVybXN0cmluZygpO1xuXHRcdGNvdW50ID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkU2hvcnQoKTtcblxuXHRcdGZhY2VzID0gbmV3IEFycmF5PG51bWJlcj4oY291bnQpIC8qdWludCovO1xuXHRcdGkgPSAwO1xuXHRcdHdoaWxlIChpIDwgZmFjZXMubGVuZ3RoKVxuXHRcdFx0ZmFjZXNbaSsrXSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cblx0XHR0aGlzLl9jdXJfb2JqLm1hdGVyaWFscy5wdXNoKG1hdCk7XG5cdFx0dGhpcy5fY3VyX29iai5tYXRlcmlhbEZhY2VzW21hdF0gPSBmYWNlcztcblx0fVxuXG5cdHByaXZhdGUgcGFyc2VPYmplY3RBbmltYXRpb24oZW5kOm51bWJlcik6dm9pZFxuXHR7XG5cdFx0dmFyIHZvOk9iamVjdFZPO1xuXHRcdHZhciBvYmo6RGlzcGxheU9iamVjdENvbnRhaW5lcjtcblx0XHR2YXIgcGl2b3Q6VmVjdG9yM0Q7XG5cdFx0dmFyIG5hbWU6c3RyaW5nO1xuXHRcdHZhciBoaWVyOm51bWJlciAvKnVpbnQqLztcblxuXHRcdC8vIFBpdm90IGRlZmF1bHRzIHRvIG9yaWdpblxuXHRcdHBpdm90ID0gbmV3IFZlY3RvcjNEO1xuXG5cdFx0d2hpbGUgKHRoaXMuX2J5dGVEYXRhLnBvc2l0aW9uIDwgZW5kKSB7XG5cdFx0XHR2YXIgY2lkOm51bWJlciAvKnVpbnQqLztcblx0XHRcdHZhciBsZW46bnVtYmVyIC8qdWludCovO1xuXG5cdFx0XHRjaWQgPSB0aGlzLl9ieXRlRGF0YS5yZWFkVW5zaWduZWRTaG9ydCgpO1xuXHRcdFx0bGVuID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkSW50KCk7XG5cblx0XHRcdHN3aXRjaCAoY2lkKSB7XG5cdFx0XHRcdGNhc2UgMHhiMDEwOiAvLyBOYW1lL2hpZXJhcmNoeVxuXHRcdFx0XHRcdG5hbWUgPSB0aGlzLnJlYWROdWxUZXJtc3RyaW5nKCk7XG5cdFx0XHRcdFx0dGhpcy5fYnl0ZURhdGEucG9zaXRpb24gKz0gNDtcblx0XHRcdFx0XHRoaWVyID0gdGhpcy5fYnl0ZURhdGEucmVhZFNob3J0KCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSAweGIwMTM6IC8vIFBpdm90XG5cdFx0XHRcdFx0cGl2b3QueCA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpO1xuXHRcdFx0XHRcdHBpdm90LnogPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKTtcblx0XHRcdFx0XHRwaXZvdC55ID0gdGhpcy5fYnl0ZURhdGEucmVhZEZsb2F0KCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0aGlzLl9ieXRlRGF0YS5wb3NpdGlvbiArPSAobGVuIC0gNik7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gSWYgbmFtZSBpcyBcIiQkJERVTU1ZXCIgdGhpcyBpcyBhbiBlbXB0eSBvYmplY3QgKGUuZy4gYSBjb250YWluZXIpXG5cdFx0Ly8gYW5kIHdpbGwgYmUgaWdub3JlZCBpbiB0aGlzIHZlcnNpb24gb2YgdGhlIHBhcnNlclxuXHRcdC8vIFRPRE86IEltcGxlbWVudCBjb250YWluZXJzIGluIDNEUyBwYXJzZXIuXG5cdFx0aWYgKG5hbWUgIT0gJyQkJERVTU1ZJyAmJiB0aGlzLl91bmZpbmFsaXplZF9vYmplY3RzLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG5cdFx0XHR2byA9IHRoaXMuX3VuZmluYWxpemVkX29iamVjdHNbbmFtZV07XG5cdFx0XHRvYmogPSB0aGlzLmNvbnN0cnVjdE9iamVjdCh2bywgcGl2b3QpO1xuXG5cdFx0XHRpZiAob2JqKSB7XG5cdFx0XHRcdC8vYWRkIHRvIHRoZSBjb250ZW50IHByb3BlcnR5XG5cdFx0XHRcdCg8RGlzcGxheU9iamVjdENvbnRhaW5lcj4gdGhpcy5fcENvbnRlbnQpLmFkZENoaWxkKG9iaik7XG5cblx0XHRcdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQob2JqLCB2by5uYW1lKTtcblx0XHRcdH1cblxuXG5cdFx0XHRkZWxldGUgdGhpcy5fdW5maW5hbGl6ZWRfb2JqZWN0c1tuYW1lXTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGNvbnN0cnVjdE9iamVjdChvYmo6T2JqZWN0Vk8sIHBpdm90OlZlY3RvcjNEID0gbnVsbCk6RGlzcGxheU9iamVjdENvbnRhaW5lclxuXHR7XG5cdFx0aWYgKG9iai50eXBlID09IEFzc2V0VHlwZS5NRVNIKSB7XG5cdFx0XHR2YXIgaTpudW1iZXIgLyp1aW50Ki87XG5cdFx0XHR2YXIgc3ViOlRyaWFuZ2xlU3ViR2VvbWV0cnk7XG5cdFx0XHR2YXIgZ2VvbTpHZW9tZXRyeTtcblx0XHRcdHZhciBtYXQ6TWF0ZXJpYWxCYXNlO1xuXHRcdFx0dmFyIG1lc2g6TWVzaDtcblx0XHRcdHZhciBtdHg6TWF0cml4M0Q7XG5cdFx0XHR2YXIgdmVydGljZXM6QXJyYXk8VmVydGV4Vk8+O1xuXHRcdFx0dmFyIGZhY2VzOkFycmF5PEZhY2VWTz47XG5cblx0XHRcdGlmIChvYmoubWF0ZXJpYWxzLmxlbmd0aCA+IDEpXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiVGhlIEF3YXkzRCAzRFMgcGFyc2VyIGRvZXMgbm90IHN1cHBvcnQgbXVsdGlwbGUgbWF0ZXJpYWxzIHBlciBtZXNoIGF0IHRoaXMgcG9pbnQuXCIpO1xuXG5cdFx0XHQvLyBJZ25vcmUgZW1wdHkgb2JqZWN0c1xuXHRcdFx0aWYgKCFvYmouaW5kaWNlcyB8fCBvYmouaW5kaWNlcy5sZW5ndGggPT0gMClcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHRcdHZlcnRpY2VzID0gbmV3IEFycmF5PFZlcnRleFZPPihvYmoudmVydHMubGVuZ3RoLzMpO1xuXHRcdFx0ZmFjZXMgPSBuZXcgQXJyYXk8RmFjZVZPPihvYmouaW5kaWNlcy5sZW5ndGgvMyk7XG5cblx0XHRcdHRoaXMucHJlcGFyZURhdGEodmVydGljZXMsIGZhY2VzLCBvYmopO1xuXG5cdFx0XHRpZiAodGhpcy5fdXNlU21vb3RoaW5nR3JvdXBzKVxuXHRcdFx0XHR0aGlzLmFwcGx5U21vb3RoR3JvdXBzKHZlcnRpY2VzLCBmYWNlcyk7XG5cblx0XHRcdG9iai52ZXJ0cyA9IG5ldyBBcnJheTxudW1iZXI+KHZlcnRpY2VzLmxlbmd0aCozKTtcblx0XHRcdGZvciAoaSA9IDA7IGkgPCB2ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRvYmoudmVydHNbaSozXSA9IHZlcnRpY2VzW2ldLng7XG5cdFx0XHRcdG9iai52ZXJ0c1tpKjMgKyAxXSA9IHZlcnRpY2VzW2ldLnk7XG5cdFx0XHRcdG9iai52ZXJ0c1tpKjMgKyAyXSA9IHZlcnRpY2VzW2ldLno7XG5cdFx0XHR9XG5cdFx0XHRvYmouaW5kaWNlcyA9IG5ldyBBcnJheTxudW1iZXI+KGZhY2VzLmxlbmd0aCozKSAvKnVpbnQqLztcblxuXHRcdFx0Zm9yIChpID0gMDsgaSA8IGZhY2VzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdG9iai5pbmRpY2VzW2kqM10gPSBmYWNlc1tpXS5hO1xuXHRcdFx0XHRvYmouaW5kaWNlc1tpKjMgKyAxXSA9IGZhY2VzW2ldLmI7XG5cdFx0XHRcdG9iai5pbmRpY2VzW2kqMyArIDJdID0gZmFjZXNbaV0uYztcblx0XHRcdH1cblxuXHRcdFx0aWYgKG9iai51dnMpIHtcblx0XHRcdFx0Ly8gSWYgdGhlIG9iamVjdCBoYWQgVVZzIHRvIHN0YXJ0IHdpdGgsIHVzZSBVVnMgZ2VuZXJhdGVkIGJ5XG5cdFx0XHRcdC8vIHNtb290aGluZyBncm91cCBzcGxpdHRpbmcgYWxnb3JpdGhtLiBPdGhlcndpc2UgdGhvc2UgVVZzXG5cdFx0XHRcdC8vIHdpbGwgYmUgbm9uc2Vuc2UgYW5kIHNob3VsZCBiZSBza2lwcGVkLlxuXHRcdFx0XHRvYmoudXZzID0gbmV3IEFycmF5PG51bWJlcj4odmVydGljZXMubGVuZ3RoKjIpO1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgdmVydGljZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRvYmoudXZzW2kqMl0gPSB2ZXJ0aWNlc1tpXS51O1xuXHRcdFx0XHRcdG9iai51dnNbaSoyICsgMV0gPSB2ZXJ0aWNlc1tpXS52O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGdlb20gPSBuZXcgR2VvbWV0cnkoKTtcblxuXHRcdFx0Ly8gQ29uc3RydWN0IHN1Yi1nZW9tZXRyaWVzIChwb3RlbnRpYWxseSBzcGxpdHRpbmcgYnVmZmVycylcblx0XHRcdC8vIGFuZCBhZGQgdGhlbSB0byBnZW9tZXRyeS5cblx0XHRcdHN1YiA9IG5ldyBUcmlhbmdsZVN1Ykdlb21ldHJ5KHRydWUpO1xuXHRcdFx0c3ViLnVwZGF0ZUluZGljZXMob2JqLmluZGljZXMpO1xuXHRcdFx0c3ViLnVwZGF0ZVBvc2l0aW9ucyhvYmoudmVydHMpO1xuXHRcdFx0c3ViLnVwZGF0ZVVWcyhvYmoudXZzKTtcblxuXHRcdFx0Z2VvbS5hZGRTdWJHZW9tZXRyeShzdWIpO1xuXG5cdFx0XHRpZiAob2JqLm1hdGVyaWFscy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdHZhciBtbmFtZTpzdHJpbmc7XG5cdFx0XHRcdG1uYW1lID0gb2JqLm1hdGVyaWFsc1swXTtcblx0XHRcdFx0bWF0ID0gdGhpcy5fbWF0ZXJpYWxzW21uYW1lXS5tYXRlcmlhbDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQXBwbHkgcGl2b3QgdHJhbnNsYXRpb24gdG8gZ2VvbWV0cnkgaWYgYSBwaXZvdCB3YXNcblx0XHRcdC8vIGZvdW5kIHdoaWxlIHBhcnNpbmcgdGhlIGtleWZyYW1lIGNodW5rIGVhcmxpZXIuXG5cdFx0XHRpZiAocGl2b3QpIHtcblx0XHRcdFx0aWYgKG9iai50cmFuc2Zvcm0pIHtcblx0XHRcdFx0XHQvLyBJZiBhIHRyYW5zZm9ybSB3YXMgZm91bmQgd2hpbGUgcGFyc2luZyB0aGVcblx0XHRcdFx0XHQvLyBvYmplY3QgY2h1bmssIHVzZSBpdCB0byBmaW5kIHRoZSBsb2NhbCBwaXZvdCB2ZWN0b3Jcblx0XHRcdFx0XHR2YXIgZGF0OkFycmF5PG51bWJlcj4gPSBvYmoudHJhbnNmb3JtLmNvbmNhdCgpO1xuXHRcdFx0XHRcdGRhdFsxMl0gPSAwO1xuXHRcdFx0XHRcdGRhdFsxM10gPSAwO1xuXHRcdFx0XHRcdGRhdFsxNF0gPSAwO1xuXHRcdFx0XHRcdG10eCA9IG5ldyBNYXRyaXgzRChkYXQpO1xuXHRcdFx0XHRcdHBpdm90ID0gbXR4LnRyYW5zZm9ybVZlY3RvcihwaXZvdCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRwaXZvdC5zY2FsZUJ5KC0xKTtcblxuXHRcdFx0XHRtdHggPSBuZXcgTWF0cml4M0QoKTtcblx0XHRcdFx0bXR4LmFwcGVuZFRyYW5zbGF0aW9uKHBpdm90LngsIHBpdm90LnksIHBpdm90LnopO1xuXHRcdFx0XHRnZW9tLmFwcGx5VHJhbnNmb3JtYXRpb24obXR4KTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQXBwbHkgdHJhbnNmb3JtYXRpb24gdG8gZ2VvbWV0cnkgaWYgYSB0cmFuc2Zvcm1hdGlvblxuXHRcdFx0Ly8gd2FzIGZvdW5kIHdoaWxlIHBhcnNpbmcgdGhlIG9iamVjdCBjaHVuayBlYXJsaWVyLlxuXHRcdFx0aWYgKG9iai50cmFuc2Zvcm0pIHtcblx0XHRcdFx0bXR4ID0gbmV3IE1hdHJpeDNEKG9iai50cmFuc2Zvcm0pO1xuXHRcdFx0XHRtdHguaW52ZXJ0KCk7XG5cdFx0XHRcdGdlb20uYXBwbHlUcmFuc2Zvcm1hdGlvbihtdHgpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGaW5hbCB0cmFuc2Zvcm0gYXBwbGllZCB0byBnZW9tZXRyeS4gRmluYWxpemUgdGhlIGdlb21ldHJ5LFxuXHRcdFx0Ly8gd2hpY2ggd2lsbCBubyBsb25nZXIgYmUgbW9kaWZpZWQgYWZ0ZXIgdGhpcyBwb2ludC5cblx0XHRcdHRoaXMuX3BGaW5hbGl6ZUFzc2V0KGdlb20sIG9iai5uYW1lLmNvbmNhdCgnX2dlb20nKSk7XG5cblx0XHRcdC8vIEJ1aWxkIG1lc2ggYW5kIHJldHVybiBpdFxuXHRcdFx0bWVzaCA9IG5ldyBNZXNoKGdlb20sIG1hdCk7XG5cdFx0XHRtZXNoLnRyYW5zZm9ybS5tYXRyaXgzRCA9IG5ldyBNYXRyaXgzRChvYmoudHJhbnNmb3JtKTtcblx0XHRcdHJldHVybiBtZXNoO1xuXHRcdH1cblxuXHRcdC8vIElmIHJlYWNoZWQsIHVua25vd25cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHByaXZhdGUgcHJlcGFyZURhdGEodmVydGljZXM6QXJyYXk8VmVydGV4Vk8+LCBmYWNlczpBcnJheTxGYWNlVk8+LCBvYmo6T2JqZWN0Vk8pOnZvaWRcblx0e1xuXHRcdC8vIGNvbnZlcnQgcmF3IE9iamVjdFZPJ3MgZGF0YSB0byBzdHJ1Y3R1cmVkIFZlcnRleFZPIGFuZCBGYWNlVk9cblx0XHR2YXIgaTpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgajpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgazpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgbGVuOm51bWJlciAvKmludCovID0gb2JqLnZlcnRzLmxlbmd0aDtcblx0XHRmb3IgKGkgPSAwLCBqID0gMCwgayA9IDA7IGkgPCBsZW47KSB7XG5cdFx0XHR2YXIgdjpWZXJ0ZXhWTyA9IG5ldyBWZXJ0ZXhWTztcblx0XHRcdHYueCA9IG9iai52ZXJ0c1tpKytdO1xuXHRcdFx0di55ID0gb2JqLnZlcnRzW2krK107XG5cdFx0XHR2LnogPSBvYmoudmVydHNbaSsrXTtcblx0XHRcdGlmIChvYmoudXZzKSB7XG5cdFx0XHRcdHYudSA9IG9iai51dnNbaisrXTtcblx0XHRcdFx0di52ID0gb2JqLnV2c1tqKytdO1xuXHRcdFx0fVxuXHRcdFx0dmVydGljZXNbaysrXSA9IHY7XG5cdFx0fVxuXHRcdGxlbiA9IG9iai5pbmRpY2VzLmxlbmd0aDtcblx0XHRmb3IgKGkgPSAwLCBrID0gMDsgaSA8IGxlbjspIHtcblx0XHRcdHZhciBmOkZhY2VWTyA9IG5ldyBGYWNlVk8oKTtcblx0XHRcdGYuYSA9IG9iai5pbmRpY2VzW2krK107XG5cdFx0XHRmLmIgPSBvYmouaW5kaWNlc1tpKytdO1xuXHRcdFx0Zi5jID0gb2JqLmluZGljZXNbaSsrXTtcblx0XHRcdGYuc21vb3RoR3JvdXAgPSBvYmouc21vb3RoaW5nR3JvdXBzW2tdIHx8IDA7XG5cdFx0XHRmYWNlc1trKytdID0gZjtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGFwcGx5U21vb3RoR3JvdXBzKHZlcnRpY2VzOkFycmF5PFZlcnRleFZPPiwgZmFjZXM6QXJyYXk8RmFjZVZPPik6dm9pZFxuXHR7XG5cdFx0Ly8gY2xvbmUgdmVydGljZXMgYWNjb3JkaW5nIHRvIGZvbGxvd2luZyBydWxlOlxuXHRcdC8vIGNsb25lIGlmIHZlcnRleCdzIGluIGZhY2VzIGZyb20gZ3JvdXBzIDErMiBhbmQgM1xuXHRcdC8vIGRvbid0IGNsb25lIGlmIHZlcnRleCdzIGluIGZhY2VzIGZyb20gZ3JvdXBzIDErMiwgMyBhbmQgMSszXG5cblx0XHR2YXIgaTpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgajpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgazpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgbDpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgbGVuOm51bWJlciAvKmludCovO1xuXHRcdHZhciBudW1WZXJ0czpudW1iZXIgLyp1aW50Ki8gPSB2ZXJ0aWNlcy5sZW5ndGg7XG5cdFx0dmFyIG51bUZhY2VzOm51bWJlciAvKnVpbnQqLyA9IGZhY2VzLmxlbmd0aDtcblxuXHRcdC8vIGV4dHJhY3QgZ3JvdXBzIGRhdGEgZm9yIHZlcnRpY2VzXG5cdFx0dmFyIHZHcm91cHM6QXJyYXk8QXJyYXk8bnVtYmVyPj4gLyp1aW50Ki8gPSBuZXcgQXJyYXk8QXJyYXk8bnVtYmVyPj4obnVtVmVydHMpIC8qdWludCovO1xuXHRcdGZvciAoaSA9IDA7IGkgPCBudW1WZXJ0czsgaSsrKVxuXHRcdFx0dkdyb3Vwc1tpXSA9IG5ldyBBcnJheTxudW1iZXI+KCkgLyp1aW50Ki87XG5cdFx0Zm9yIChpID0gMDsgaSA8IG51bUZhY2VzOyBpKyspIHtcblx0XHRcdHZhciBmYWNlOkZhY2VWTyA9IGZhY2VzW2ldO1xuXHRcdFx0Zm9yIChqID0gMDsgaiA8IDM7IGorKykge1xuXHRcdFx0XHR2YXIgZ3JvdXBzOkFycmF5PG51bWJlcj4gLyp1aW50Ki8gPSB2R3JvdXBzWyhqID09IDApPyBmYWNlLmEgOiAoKGogPT0gMSk/IGZhY2UuYiA6IGZhY2UuYyldO1xuXHRcdFx0XHR2YXIgZ3JvdXA6bnVtYmVyIC8qdWludCovID0gZmFjZS5zbW9vdGhHcm91cDtcblx0XHRcdFx0Zm9yIChrID0gZ3JvdXBzLmxlbmd0aCAtIDE7IGsgPj0gMDsgay0tKSB7XG5cdFx0XHRcdFx0aWYgKChncm91cCAmIGdyb3Vwc1trXSkgPiAwKSB7XG5cdFx0XHRcdFx0XHRncm91cCB8PSBncm91cHNba107XG5cdFx0XHRcdFx0XHRncm91cHMuc3BsaWNlKGssIDEpO1xuXHRcdFx0XHRcdFx0ayA9IGdyb3Vwcy5sZW5ndGggLSAxO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRncm91cHMucHVzaChncm91cCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIGNsb25lIHZlcnRpY2VzXG5cdFx0dmFyIHZDbG9uZXM6QXJyYXk8QXJyYXk8bnVtYmVyPj4gLyp1aW50Ki8gPSBuZXcgQXJyYXk8QXJyYXk8bnVtYmVyPj4obnVtVmVydHMpIC8qdWludCovO1xuXHRcdGZvciAoaSA9IDA7IGkgPCBudW1WZXJ0czsgaSsrKSB7XG5cdFx0XHRpZiAoKGxlbiA9IHZHcm91cHNbaV0ubGVuZ3RoKSA8IDEpXG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0dmFyIGNsb25lczpBcnJheTxudW1iZXI+IC8qdWludCovID0gbmV3IEFycmF5PG51bWJlcj4obGVuKSAvKnVpbnQqLztcblx0XHRcdHZDbG9uZXNbaV0gPSBjbG9uZXM7XG5cdFx0XHRjbG9uZXNbMF0gPSBpO1xuXHRcdFx0dmFyIHYwOlZlcnRleFZPID0gdmVydGljZXNbaV07XG5cdFx0XHRmb3IgKGogPSAxOyBqIDwgbGVuOyBqKyspIHtcblx0XHRcdFx0dmFyIHYxOlZlcnRleFZPID0gbmV3IFZlcnRleFZPO1xuXHRcdFx0XHR2MS54ID0gdjAueDtcblx0XHRcdFx0djEueSA9IHYwLnk7XG5cdFx0XHRcdHYxLnogPSB2MC56O1xuXHRcdFx0XHR2MS51ID0gdjAudTtcblx0XHRcdFx0djEudiA9IHYwLnY7XG5cdFx0XHRcdGNsb25lc1tqXSA9IHZlcnRpY2VzLmxlbmd0aDtcblx0XHRcdFx0dmVydGljZXMucHVzaCh2MSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdG51bVZlcnRzID0gdmVydGljZXMubGVuZ3RoO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IG51bUZhY2VzOyBpKyspIHtcblx0XHRcdGZhY2UgPSBmYWNlc1tpXTtcblx0XHRcdGdyb3VwID0gZmFjZS5zbW9vdGhHcm91cDtcblx0XHRcdGZvciAoaiA9IDA7IGogPCAzOyBqKyspIHtcblx0XHRcdFx0ayA9IChqID09IDApPyBmYWNlLmEgOiAoKGogPT0gMSk/IGZhY2UuYiA6IGZhY2UuYyk7XG5cdFx0XHRcdGdyb3VwcyA9IHZHcm91cHNba107XG5cdFx0XHRcdGxlbiA9IGdyb3Vwcy5sZW5ndGg7XG5cdFx0XHRcdGNsb25lcyA9IHZDbG9uZXNba107XG5cdFx0XHRcdGZvciAobCA9IDA7IGwgPCBsZW47IGwrKykge1xuXHRcdFx0XHRcdGlmICgoKGdyb3VwID09IDApICYmIChncm91cHNbbF0gPT0gMCkpIHx8ICgoZ3JvdXAgJiBncm91cHNbbF0pID4gMCkpIHtcblx0XHRcdFx0XHRcdHZhciBpbmRleDpudW1iZXIgLyp1aW50Ki8gPSBjbG9uZXNbbF07XG5cdFx0XHRcdFx0XHRpZiAoZ3JvdXAgPT0gMCkge1xuXHRcdFx0XHRcdFx0XHQvLyB2ZXJ0ZXggaXMgdW5pcXVlIGlmIG5vIHNtb290aEdyb3VwIGZvdW5kXG5cdFx0XHRcdFx0XHRcdGdyb3Vwcy5zcGxpY2UobCwgMSk7XG5cdFx0XHRcdFx0XHRcdGNsb25lcy5zcGxpY2UobCwgMSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoaiA9PSAwKVxuXHRcdFx0XHRcdFx0XHRmYWNlLmEgPSBpbmRleDsgZWxzZSBpZiAoaiA9PSAxKVxuXHRcdFx0XHRcdFx0XHRmYWNlLmIgPSBpbmRleDsgZWxzZVxuXHRcdFx0XHRcdFx0XHRmYWNlLmMgPSBpbmRleDtcblx0XHRcdFx0XHRcdGwgPSBsZW47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBmaW5hbGl6ZUN1cnJlbnRNYXRlcmlhbCgpOnZvaWRcblx0e1xuXHRcdHZhciBtYXQ6VHJpYW5nbGVNZXRob2RNYXRlcmlhbDtcblxuXHRcdGlmICh0aGlzLl9jdXJfbWF0LmNvbG9yTWFwKVxuXHRcdFx0bWF0ID0gbmV3IFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwodGhpcy5fY3VyX21hdC5jb2xvck1hcC50ZXh0dXJlIHx8IERlZmF1bHRNYXRlcmlhbE1hbmFnZXIuZ2V0RGVmYXVsdFRleHR1cmUoKSk7XG5cdFx0ZWxzZVxuXHRcdFx0bWF0ID0gbmV3IFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwodGhpcy5fY3VyX21hdC5hbWJpZW50Q29sb3IpO1xuXG5cdFx0bWF0LmRpZmZ1c2VDb2xvciA9IHRoaXMuX2N1cl9tYXQuZGlmZnVzZUNvbG9yO1xuXHRcdG1hdC5zcGVjdWxhckNvbG9yID0gdGhpcy5fY3VyX21hdC5zcGVjdWxhckNvbG9yO1xuXG5cdFx0aWYgKHRoaXMubWF0ZXJpYWxNb2RlID49IDIpXG5cdFx0XHRtYXQubWF0ZXJpYWxNb2RlID0gVHJpYW5nbGVNYXRlcmlhbE1vZGUuTVVMVElfUEFTU1xuXG5cdFx0bWF0LmJvdGhTaWRlcyA9IHRoaXMuX2N1cl9tYXQudHdvU2lkZWQ7XG5cblx0XHR0aGlzLl9wRmluYWxpemVBc3NldChtYXQsIHRoaXMuX2N1cl9tYXQubmFtZSk7XG5cblx0XHR0aGlzLl9tYXRlcmlhbHNbdGhpcy5fY3VyX21hdC5uYW1lXSA9IHRoaXMuX2N1cl9tYXQ7XG5cdFx0dGhpcy5fY3VyX21hdC5tYXRlcmlhbCA9IG1hdDtcblxuXHRcdHRoaXMuX2N1cl9tYXQgPSBudWxsO1xuXHR9XG5cblx0cHJpdmF0ZSByZWFkTnVsVGVybXN0cmluZygpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGNocjpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgc3RyOnN0cmluZyA9IFwiXCI7XG5cblx0XHR3aGlsZSAoKGNociA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZEJ5dGUoKSkgPiAwKVxuXHRcdFx0c3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoY2hyKTtcblxuXHRcdHJldHVybiBzdHI7XG5cdH1cblxuXHRwcml2YXRlIHJlYWRUcmFuc2Zvcm0oKTpBcnJheTxudW1iZXI+XG5cdHtcblx0XHR2YXIgZGF0YTpBcnJheTxudW1iZXI+O1xuXG5cdFx0ZGF0YSA9IG5ldyBBcnJheTxudW1iZXI+KDE2KTtcblxuXHRcdC8vIFggYXhpc1xuXHRcdGRhdGFbMF0gPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKTsgLy8gWFxuXHRcdGRhdGFbMl0gPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKTsgLy8gWlxuXHRcdGRhdGFbMV0gPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKTsgLy8gWVxuXHRcdGRhdGFbM10gPSAwO1xuXG5cdFx0Ly8gWiBheGlzXG5cdFx0ZGF0YVs4XSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpOyAvLyBYXG5cdFx0ZGF0YVsxMF0gPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKTsgLy8gWlxuXHRcdGRhdGFbOV0gPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKTsgLy8gWVxuXHRcdGRhdGFbMTFdID0gMDtcblxuXHRcdC8vIFkgQXhpc1xuXHRcdGRhdGFbNF0gPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKTsgLy8gWFxuXHRcdGRhdGFbNl0gPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKTsgLy8gWlxuXHRcdGRhdGFbNV0gPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKTsgLy8gWVxuXHRcdGRhdGFbN10gPSAwO1xuXG5cdFx0Ly8gVHJhbnNsYXRpb25cblx0XHRkYXRhWzEyXSA9IHRoaXMuX2J5dGVEYXRhLnJlYWRGbG9hdCgpOyAvLyBYXG5cdFx0ZGF0YVsxNF0gPSB0aGlzLl9ieXRlRGF0YS5yZWFkRmxvYXQoKTsgLy8gWlxuXHRcdGRhdGFbMTNdID0gdGhpcy5fYnl0ZURhdGEucmVhZEZsb2F0KCk7IC8vIFlcblx0XHRkYXRhWzE1XSA9IDE7XG5cblx0XHRyZXR1cm4gZGF0YTtcblx0fVxuXG5cdHByaXZhdGUgcmVhZENvbG9yKCk6bnVtYmVyIC8qaW50Ki9cblx0e1xuXHRcdHZhciBjaWQ6bnVtYmVyIC8qaW50Ki87XG5cdFx0dmFyIGxlbjpudW1iZXIgLyppbnQqLztcblx0XHR2YXIgcjpudW1iZXIgLyppbnQqLywgZzpudW1iZXIgLyppbnQqLywgYjpudW1iZXIgLyppbnQqLztcblxuXHRcdGNpZCA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZFNob3J0KCk7XG5cdFx0bGVuID0gdGhpcy5fYnl0ZURhdGEucmVhZFVuc2lnbmVkSW50KCk7XG5cblx0XHRzd2l0Y2ggKGNpZCkge1xuXHRcdFx0Y2FzZSAweDAwMTA6IC8vIEZsb2F0c1xuXHRcdFx0XHRyID0gdGhpcy5fYnl0ZURhdGEucmVhZEZsb2F0KCkqMjU1O1xuXHRcdFx0XHRnID0gdGhpcy5fYnl0ZURhdGEucmVhZEZsb2F0KCkqMjU1O1xuXHRcdFx0XHRiID0gdGhpcy5fYnl0ZURhdGEucmVhZEZsb2F0KCkqMjU1O1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMHgwMDExOiAvLyAyNC1iaXQgY29sb3Jcblx0XHRcdFx0ciA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHRcdFx0ZyA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHRcdFx0YiA9IHRoaXMuX2J5dGVEYXRhLnJlYWRVbnNpZ25lZEJ5dGUoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aGlzLl9ieXRlRGF0YS5wb3NpdGlvbiArPSAobGVuIC0gNik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdHJldHVybiAociA8PCAxNikgfCAoZyA8PCA4KSB8IGI7XG5cdH1cbn1cblxuZXhwb3J0ID0gTWF4M0RTUGFyc2VyO1xuXG4vKipcbiAqXG4gKi9cbmNsYXNzIEZhY2VWT1xue1xuXHRwdWJsaWMgYTpudW1iZXIgLyppbnQqLztcblx0cHVibGljIGI6bnVtYmVyIC8qaW50Ki87XG5cdHB1YmxpYyBjOm51bWJlciAvKmludCovO1xuXHRwdWJsaWMgc21vb3RoR3JvdXA6bnVtYmVyIC8qaW50Ki87XG59XG5cbi8qKlxuICpcbiAqL1xuY2xhc3MgTWF0ZXJpYWxWT1xue1xuXHRwdWJsaWMgbmFtZTpzdHJpbmc7XG5cdHB1YmxpYyBhbWJpZW50Q29sb3I6bnVtYmVyIC8qaW50Ki87XG5cdHB1YmxpYyBkaWZmdXNlQ29sb3I6bnVtYmVyIC8qaW50Ki87XG5cdHB1YmxpYyBzcGVjdWxhckNvbG9yOm51bWJlciAvKmludCovO1xuXHRwdWJsaWMgdHdvU2lkZWQ6Ym9vbGVhbjtcblx0cHVibGljIGNvbG9yTWFwOlRleHR1cmVWTztcblx0cHVibGljIHNwZWN1bGFyTWFwOlRleHR1cmVWTztcblx0cHVibGljIG1hdGVyaWFsOk1hdGVyaWFsQmFzZTtcbn1cblxuLyoqXG4gKlxuICovXG5jbGFzcyBPYmplY3RWT1xue1xuXHRwdWJsaWMgbmFtZTpzdHJpbmc7XG5cdHB1YmxpYyB0eXBlOnN0cmluZztcblx0cHVibGljIHBpdm90WDpudW1iZXI7XG5cdHB1YmxpYyBwaXZvdFk6bnVtYmVyO1xuXHRwdWJsaWMgcGl2b3RaOm51bWJlcjtcblx0cHVibGljIHRyYW5zZm9ybTpBcnJheTxudW1iZXI+O1xuXHRwdWJsaWMgdmVydHM6QXJyYXk8bnVtYmVyPjtcblx0cHVibGljIGluZGljZXM6QXJyYXk8bnVtYmVyPiAvKmludCovO1xuXHRwdWJsaWMgdXZzOkFycmF5PG51bWJlcj47XG5cdHB1YmxpYyBtYXRlcmlhbEZhY2VzOk9iamVjdDtcblx0cHVibGljIG1hdGVyaWFsczpBcnJheTxzdHJpbmc+O1xuXHRwdWJsaWMgc21vb3RoaW5nR3JvdXBzOkFycmF5PG51bWJlcj4gLyppbnQqLztcbn1cblxuLyoqXG4gKlxuICovXG5jbGFzcyBUZXh0dXJlVk9cbntcblx0cHVibGljIHVybDpzdHJpbmc7XG5cdHB1YmxpYyB0ZXh0dXJlOlRleHR1cmUyREJhc2U7XG59XG5cbi8qKlxuICpcbiAqL1xuY2xhc3MgVmVydGV4Vk9cbntcblx0cHVibGljIHg6bnVtYmVyO1xuXHRwdWJsaWMgeTpudW1iZXI7XG5cdHB1YmxpYyB6Om51bWJlcjtcblx0cHVibGljIHU6bnVtYmVyO1xuXHRwdWJsaWMgdjpudW1iZXI7XG5cdHB1YmxpYyBub3JtYWw6VmVjdG9yM0Q7XG5cdHB1YmxpYyB0YW5nZW50OlZlY3RvcjNEO1xufSJdfQ==