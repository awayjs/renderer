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
    var LightTorus = (function (_super) {
        __extends(LightTorus, _super);
        function LightTorus() {
            _super.call(this);

            console.log('LightTorus');
            if (!document) {
                throw "The document root object must be avaiable";
            }
            this.loadResources();
        }
        LightTorus.prototype.loadResources = function () {
            var urlRequest = new away.net.URLRequest("130909wall_big.png");
            var urlLoader = new away.net.URLLoader();
            urlLoader.dataFormat = away.net.URLLoaderDataFormat.BLOB;
            urlLoader.addEventListener(away.events.Event.COMPLETE, away.utils.Delegate.create(this, this.imageCompleteHandler));
            urlLoader.load(urlRequest);
        };

        LightTorus.prototype.imageCompleteHandler = function (e) {
            var _this = this;
            var imageLoader = e.target;
            this._image = away.parsers.ParserUtils.blobToImage(imageLoader.data);
            this._image.onload = function (event) {
                return _this.onLoadComplete(event);
            };
        };

        LightTorus.prototype.onLoadComplete = function (event) {
            this._stageGL = new away.base.StageGL(document.createElement("canvas"), 0, null);
            this._stageGL.addEventListener(away.events.StageGLEvent.CONTEXTGL_CREATED, away.utils.Delegate.create(this, this.onContextGLCreateHandler));
            this._stageGL.requestContext();
        };

        LightTorus.prototype.onContextGLCreateHandler = function (e) {
            this._stageGL.removeEventListener(away.events.StageGLEvent.CONTEXTGL_CREATED, away.utils.Delegate.create(this, this.onContextGLCreateHandler));
            this._stageGL.width = 800;
            this._stageGL.height = 600;

            document.body.appendChild(this._stageGL.canvas);

            this._contextGL = this._stageGL.contextGL;

            this._texture = this._contextGL.createTexture(512, 512, away.gl.ContextGLTextureFormat.BGRA, true);
            this._texture.uploadFromHTMLImageElement(this._image);

            //var bitmapData: away.display.BitmapData = new away.display.BitmapData( 512, 512, true, 0x02CGL4 );
            //this._texture.uploadFromBitmapData( bitmapData );
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

            var vProgram = "attribute mediump vec3 aVertexNormal;\n" + "attribute mediump vec3 aVertexPosition;\n" + "attribute mediump vec2 aTextureCoord;\n" + "uniform mediump mat4 uNormalMatrix;\n" + "uniform mediump mat4 uMVMatrix;\n" + "uniform mediump mat4 uPMatrix;\n" + "varying mediump vec2 vTextureCoord;\n" + "varying mediump vec3 vLighting;\n" + "void main() {\n" + "		gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n" + "		vTextureCoord = aTextureCoord;\n" + "		mediump vec3 ambientLight = vec3(0.6, 0.6, 0.6);\n" + "		mediump vec3 directionalLightColor = vec3(1, 0.5, 0.5);\n" + "		mediump vec3 directionalVector = vec3(0.85, 0.8, -0.75);\n" + "		mediump vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);\n" + "		mediump float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);\n" + "		vLighting = ambientLight + (directionalLightColor * directional);\n" + "}\n";

            var fProgram = "varying mediump vec2 vTextureCoord;\n" + "varying mediump vec3 vLighting;\n" + "uniform sampler2D uSampler;\n" + "void main() {\n" + "		mediump vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n" + "		gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);\n" + "}\n";

            this._program.upload(vProgram, fProgram);
            this._contextGL.setProgram(this._program);

            this._pMatrix = new away.utils.PerspectiveMatrix3D();
            this._pMatrix.perspectiveFieldOfViewLH(45, 800 / 600, 0.1, 1000);

            this._mvMatrix = new away.geom.Matrix3D();
            this._mvMatrix.appendTranslation(0, 0, 7);

            this._normalMatrix = this._mvMatrix.clone();
            this._normalMatrix.invert();
            this._normalMatrix.transpose();

            this._contextGL.setGLSLVertexBufferAt("aVertexPosition", vBuffer, 0, away.gl.ContextGLVertexBufferFormat.FLOAT_3);
            this._contextGL.setGLSLVertexBufferAt("aVertexNormal", vBuffer, 3, away.gl.ContextGLVertexBufferFormat.FLOAT_3);
            this._contextGL.setGLSLVertexBufferAt("aTextureCoord", vBuffer, 9, away.gl.ContextGLVertexBufferFormat.FLOAT_2);

            this._requestAnimationFrameTimer = new away.utils.RequestAnimationFrame(this.tick, this);
            this._requestAnimationFrameTimer.start();
        };

        LightTorus.prototype.tick = function (dt) {
            this._mvMatrix.appendRotation(dt * 0.05, new away.geom.Vector3D(0, 1, 0));
            this._contextGL.setProgram(this._program);
            this._contextGL.setGLSLProgramConstantsFromMatrix("uNormalMatrix", this._normalMatrix, true);
            this._contextGL.setGLSLProgramConstantsFromMatrix("uMVMatrix", this._mvMatrix, true);
            this._contextGL.setGLSLProgramConstantsFromMatrix("uPMatrix", this._pMatrix, true);

            this._contextGL.setGLSLTextureAt("uSampler", this._texture, 0);

            this._contextGL.clear(0.16, 0.16, 0.16, 1);
            this._contextGL.drawTriangles(this._iBuffer, 0, this._iBuffer.numIndices / 3);
            this._contextGL.present();
        };
        return LightTorus;
    })(away.events.EventDispatcher);
    scene.LightTorus = LightTorus;
})(scene || (scene = {}));
//# sourceMappingURL=LightTorus.js.map
