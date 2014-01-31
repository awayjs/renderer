///<reference path="../../build/Away3D.next.d.ts" />
//<reference path="../../src/Away3D.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RotatingBluePlane = (function (_super) {
    __extends(RotatingBluePlane, _super);
    function RotatingBluePlane() {
        _super.call(this);

        if (!document) {
            throw "The document root object must be avaiable";
        }
        this.loadResources();
    }
    RotatingBluePlane.prototype.loadResources = function () {
        var urlRequest = new away.net.URLRequest("130909wall_big.png");
        var urlLoader = new away.net.URLLoader();
        urlLoader.dataFormat = away.net.URLLoaderDataFormat.BLOB;
        urlLoader.addEventListener(away.events.Event.COMPLETE, away.utils.Delegate.create(this, this.imageCompleteHandler));
        urlLoader.load(urlRequest);
    };

    RotatingBluePlane.prototype.imageCompleteHandler = function (e) {
        var _this = this;
        var imageLoader = e.target;
        this._image = away.parsers.ParserUtils.blobToImage(imageLoader.data);
        this._image.onload = function (event) {
            return _this.onLoadComplete(event);
        };
    };

    RotatingBluePlane.prototype.onLoadComplete = function (event) {
        this._stageGL = new away.base.StageGL(document.createElement("canvas"), 0, null);
        this._stageGL.addEventListener(away.events.StageGLEvent.CONTEXTGL_CREATED, away.utils.Delegate.create(this, this.onContextGLCreateHandler));
        this._stageGL.requestContext();
    };

    RotatingBluePlane.prototype.onContextGLCreateHandler = function (e) {
        this._stageGL.removeEventListener(away.events.StageGLEvent.CONTEXTGL_CREATED, away.utils.Delegate.create(this, this.onContextGLCreateHandler));
        this._stageGL.width = 800;
        this._stageGL.height = 600;

        document.body.appendChild(this._stageGL.canvas);

        this._contextGL = this._stageGL.contextGL;

        this._texture = this._contextGL.createTexture(512, 512, away.gl.ContextGLTextureFormat.BGRA, true);

        // this._texture.uploadFromHTMLImageElement( this._image );
        var bitmapData = new away.base.BitmapData(512, 512, true, 0x02C3D4);
        this._texture.uploadFromBitmapData(bitmapData);

        this._contextGL.configureBackBuffer(800, 600, 0, true);
        this._contextGL.setColorMask(true, true, true, true);

        this._geometry = new away.base.Geometry();

        var vertices = [
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0,
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0
        ];

        var uvCoords = [
            0, 0,
            1, 0,
            1, 1,
            0, 1
        ];

        var indices = [
            0, 1, 2,
            0, 2, 3
        ];

        var vBuffer = this._contextGL.createVertexBuffer(4, 3);
        vBuffer.uploadFromArray(vertices, 0, 4);

        var tCoordBuffer = this._contextGL.createVertexBuffer(4, 2);
        tCoordBuffer.uploadFromArray(uvCoords, 0, 4);

        this._iBuffer = this._contextGL.createIndexBuffer(6);
        this._iBuffer.uploadFromArray(indices, 0, 6);

        this._program = this._contextGL.createProgram();

        var vProgram = "uniform mat4 mvMatrix;\n" + "uniform mat4 pMatrix;\n" + "attribute vec2 aTextureCoord;\n" + "attribute vec3 aVertexPosition;\n" + "varying vec2 vTextureCoord;\n" + "void main() {\n" + "		gl_Position = pMatrix * mvMatrix * vec4(aVertexPosition, 1.0);\n" + "		vTextureCoord = aTextureCoord;\n" + "}\n";

        var fProgram = "varying mediump vec2 vTextureCoord;\n" + "uniform sampler2D uSampler;\n" + "void main() {\n" + "		gl_FragColor = texture2D(uSampler, vTextureCoord);\n" + "}\n";

        this._program.upload(vProgram, fProgram);
        this._contextGL.setProgram(this._program);

        this._pMatrix = new away.utils.PerspectiveMatrix3D();
        this._pMatrix.perspectiveFieldOfViewLH(45, 800 / 600, 0.1, 1000);

        this._mvMatrix = new away.geom.Matrix3D();
        this._mvMatrix.appendTranslation(0, 0, 3);

        this._contextGL.setGLSLVertexBufferAt("aVertexPosition", vBuffer, 0, away.gl.ContextGLVertexBufferFormat.FLOAT_3);
        this._contextGL.setGLSLVertexBufferAt("aTextureCoord", tCoordBuffer, 0, away.gl.ContextGLVertexBufferFormat.FLOAT_2);

        this._requestAnimationFrameTimer = new away.utils.RequestAnimationFrame(this.tick, this);
        this._requestAnimationFrameTimer.start();
    };

    RotatingBluePlane.prototype.tick = function (dt) {
        this._mvMatrix.appendRotation(dt * 0.1, new away.geom.Vector3D(0, 1, 0));
        this._contextGL.setProgram(this._program);
        this._contextGL.setGLSLProgramConstantsFromMatrix("pMatrix", this._pMatrix, true);
        this._contextGL.setGLSLProgramConstantsFromMatrix("mvMatrix", this._mvMatrix, true);

        this._contextGL.setGLSLTextureAt("uSampler", this._texture, 0);

        this._contextGL.clear(0.16, 0.16, 0.16, 1);
        this._contextGL.drawTriangles(this._iBuffer, 0, 2);
        this._contextGL.present();
    };
    return RotatingBluePlane;
})(away.events.EventDispatcher);
//# sourceMappingURL=RotatingBluePlane.js.map
