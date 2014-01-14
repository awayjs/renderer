///<reference path="../../build/Away3D.next.d.ts" />
//<reference path="../../src/Away3D.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var scene;
(function (scene) {
    var RotatingTorus = (function (_super) {
        __extends(RotatingTorus, _super);
        function RotatingTorus() {
            _super.call(this);

            if (!document) {
                throw "The document root object must be avaiable";
            }
            this._stage = new away.display.Stage(800, 600);
            this.loadResources();
        }
        Object.defineProperty(RotatingTorus.prototype, "stage", {
            get: function () {
                return this._stage;
            },
            enumerable: true,
            configurable: true
        });

        RotatingTorus.prototype.loadResources = function () {
            var urlRequest = new away.net.URLRequest("assets/130909wall_big.png");
            var imgLoader = new away.net.IMGLoader();
            imgLoader.addEventListener(away.events.Event.COMPLETE, this.imageCompleteHandler, this);
            imgLoader.load(urlRequest);
        };

        RotatingTorus.prototype.imageCompleteHandler = function (e) {
            var imageLoader = e.target;
            this._image = imageLoader.image;

            this._stage.stageGLs[0].addEventListener(away.events.Event.CONTEXTGL_CREATE, this.onContextGLCreateHandler, this);
            this._stage.stageGLs[0].requestContext();
        };

        RotatingTorus.prototype.onContextGLCreateHandler = function (e) {
            this._stage.stageGLs[0].removeEventListener(away.events.Event.CONTEXTGL_CREATE, this.onContextGLCreateHandler, this);

            var stageGL = e.target;
            this._contextGL = stageGL.contextGL;

            this._texture = this._contextGL.createTexture(512, 512, away.displayGL.ContextGLTextureFormat.BGRA, true);

            // this._texture.uploadFromHTMLImageElement( this._image );
            var bitmapData = new away.display.BitmapData(512, 512, true, 0x02C3D4);
            this._texture.uploadFromBitmapData(bitmapData);

            this._contextGL.configureBackBuffer(800, 600, 0, true);
            this._contextGL.setColorMask(true, true, true, true);

            var torus = new away.primitives.TorusGeometry(1, 0.5, 16, 8, false);
            torus.iValidate();

            var vertices = torus.getSubGeometries()[0].vertexData;
            var indices = torus.getSubGeometries()[0].indexData;

            /**
            * Updates the vertex data. All vertex properties are contained in a single Vector, and the order is as follows:
            * 0 - 2: vertex position X, Y, Z
            * 3 - 5: normal X, Y, Z
            * 6 - 8: tangent X, Y, Z
            * 9 - 10: U V
            * 11 - 12: Secondary U V
            */
            var stride = 13;
            var numVertices = vertices.length / stride;
            var vBuffer = this._contextGL.createVertexBuffer(numVertices, stride);
            vBuffer.uploadFromArray(vertices, 0, numVertices);

            var numIndices = indices.length;
            this._iBuffer = this._contextGL.createIndexBuffer(numIndices);
            this._iBuffer.uploadFromArray(indices, 0, numIndices);

            this._program = this._contextGL.createProgram();

            var vProgram = "uniform mat4 mvMatrix;\n" + "uniform mat4 pMatrix;\n" + "attribute vec2 aTextureCoord;\n" + "attribute vec3 aVertexPosition;\n" + "varying vec2 vTextureCoord;\n" + "void main() {\n" + "		gl_Position = pMatrix * mvMatrix * vec4(aVertexPosition, 1.0);\n" + "		vTextureCoord = aTextureCoord;\n" + "}\n";

            var fProgram = "varying mediump vec2 vTextureCoord;\n" + "uniform sampler2D uSampler;\n" + "void main() {\n" + "		gl_FragColor = texture2D(uSampler, vTextureCoord);\n" + "}\n";

            this._program.upload(vProgram, fProgram);
            this._contextGL.setProgram(this._program);

            this._pMatrix = new away.utils.PerspectiveMatrix3D();
            this._pMatrix.perspectiveFieldOfViewLH(45, 800 / 600, 0.1, 1000);

            this._mvMatrix = new away.geom.Matrix3D();
            this._mvMatrix.appendTranslation(0, 0, 5);

            this._contextGL.setGLSLVertexBufferAt("aVertexPosition", vBuffer, 0, away.displayGL.ContextGLVertexBufferFormat.FLOAT_3);
            this._contextGL.setGLSLVertexBufferAt("aTextureCoord", vBuffer, 9, away.displayGL.ContextGLVertexBufferFormat.FLOAT_2);

            this._requestAnimationFrameTimer = new away.utils.RequestAnimationFrame(this.tick, this);
            this._requestAnimationFrameTimer.start();
        };

        RotatingTorus.prototype.tick = function (dt) {
            this._mvMatrix.appendRotation(dt * 0.1, new away.geom.Vector3D(0, 1, 0));
            this._contextGL.setProgram(this._program);
            this._contextGL.setGLSLProgramConstantsFromMatrix("pMatrix", this._pMatrix, true);
            this._contextGL.setGLSLProgramConstantsFromMatrix("mvMatrix", this._mvMatrix, true);

            this._contextGL.setGLSLTextureAt("uSampler", this._texture, 0);

            this._contextGL.clear(0.16, 0.16, 0.16, 1);
            this._contextGL.drawTriangles(this._iBuffer, 0, this._iBuffer.numIndices / 3);
            this._contextGL.present();
        };
        return RotatingTorus;
    })(away.events.EventDispatcher);
    scene.RotatingTorus = RotatingTorus;
})(scene || (scene = {}));
//# sourceMappingURL=RotatingTorus.js.map
