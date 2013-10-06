///<reference path="../../build/Away3D.next.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var scene;
(function (scene) {
    var PhongTorus = (function (_super) {
        __extends(PhongTorus, _super);
        function PhongTorus() {
            _super.call(this);

            if (!document) {
                throw "The document root object must be avaiable";
            }
            this._stage = new away.display.Stage(800, 600);
            this.loadResources();
        }
        Object.defineProperty(PhongTorus.prototype, "stage", {
            get: function () {
                return this._stage;
            },
            enumerable: true,
            configurable: true
        });

        PhongTorus.prototype.loadResources = function () {
            var urlRequest = new away.net.URLRequest("assets/130909wall_big.png");
            var imgLoader = new away.net.IMGLoader();
            imgLoader.addEventListener(away.events.Event.COMPLETE, this.imageCompleteHandler, this);
            imgLoader.load(urlRequest);
        };

        PhongTorus.prototype.imageCompleteHandler = function (e) {
            var imageLoader = e.target;
            this._image = imageLoader.image;

            this._stage.stage3Ds[0].addEventListener(away.events.Event.CONTEXT3D_CREATE, this.onContext3DCreateHandler, this);
            this._stage.stage3Ds[0].requestContext();
        };

        PhongTorus.prototype.onContext3DCreateHandler = function (e) {
            this._stage.stage3Ds[0].removeEventListener(away.events.Event.CONTEXT3D_CREATE, this.onContext3DCreateHandler, this);

            var stage3D = e.target;
            this._context3D = stage3D.context3D;

            //this._texture = this._context3D.createTexture( 512, 512, away.display3D.Context3DTextureFormat.BGRA, true );
            //this._texture.uploadFromHTMLImageElement( this._image );
            //var bitmapData: away.display.BitmapData = new away.display.BitmapData( 512, 512, true, 0x02C3D4 );
            //this._texture.uploadFromBitmapData( bitmapData );
            this._context3D.configureBackBuffer(800, 600, 0, true);
            this._context3D.setColorMask(true, true, true, true);

            var torus = new away.primitives.TorusGeometry(1, 0.5, 32, 16, false);
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
            var vBuffer = this._context3D.createVertexBuffer(numVertices, stride);
            vBuffer.uploadFromArray(vertices, 0, numVertices);

            var numIndices = indices.length;
            this._iBuffer = this._context3D.createIndexBuffer(numIndices);
            this._iBuffer.uploadFromArray(indices, 0, numIndices);

            this._program = this._context3D.createProgram();

            var vProgram = "attribute vec3 aVertexPosition;\n" + "attribute vec2 aTextureCoord;\n" + "attribute vec3 aVertexNormal;\n" + "uniform mat4 uPMatrix;\n" + "uniform mat4 uMVMatrix;\n" + "uniform mat4 uNormalMatrix;\n" + "varying vec3 vNormalInterp;\n" + "varying vec3 vVertPos;\n" + "void main(){\n" + "	gl_Position = uPMatrix * uMVMatrix * vec4( aVertexPosition, 1.0 );\n" + "	vec4 vertPos4 = uMVMatrix * vec4( aVertexPosition, 1.0 );\n" + "	vVertPos = vec3( vertPos4 ) / vertPos4.w;\n" + "	vNormalInterp = vec3( uNormalMatrix * vec4( aVertexNormal, 0.0 ) );\n" + "}\n";

            var fProgram = "precision mediump float;\n" + "varying vec3 vNormalInterp;\n" + "varying vec3 vVertPos;\n" + "const vec3 lightPos = vec3( 1.0,1.0,1.0 );\n" + "const vec3 diffuseColor = vec3( 0.3, 0.6, 0.9 );\n" + "const vec3 specColor = vec3( 1.0, 1.0, 1.0 );\n" + "void main() {\n" + "	vec3 normal = normalize( vNormalInterp );\n" + "	vec3 lightDir = normalize( lightPos - vVertPos );\n" + "	float lambertian = max( dot( lightDir,normal ), 0.0 );\n" + "	float specular = 0.0;\n" + "	if( lambertian > 0.0 ) {\n" + "		vec3 reflectDir = reflect( -lightDir, normal );\n" + "		vec3 viewDir = normalize( -vVertPos );\n" + "		float specAngle = max( dot( reflectDir, viewDir ), 0.0 );\n" + "		specular = pow( specAngle, 4.0 );\n" + "		specular *= lambertian;\n" + "	}\n" + "	gl_FragColor = vec4( lambertian * diffuseColor + specular * specColor, 1.0 );\n" + "}\n";

            this._program.upload(vProgram, fProgram);
            this._context3D.setProgram(this._program);

            this._pMatrix = new away.utils.PerspectiveMatrix3D();
            this._pMatrix.perspectiveFieldOfViewLH(45, 800 / 600, 0.1, 1000);

            this._mvMatrix = new away.geom.Matrix3D();
            this._mvMatrix.appendTranslation(0, 0, 7);

            this._normalMatrix = this._mvMatrix.clone();
            this._normalMatrix.invert();
            this._normalMatrix.transpose();

            this._context3D.setGLSLVertexBufferAt("aVertexPosition", vBuffer, 0, away.display3D.Context3DVertexBufferFormat.FLOAT_3);
            this._context3D.setGLSLVertexBufferAt("aVertexNormal", vBuffer, 3, away.display3D.Context3DVertexBufferFormat.FLOAT_3);

            this._requestAnimationFrameTimer = new away.utils.RequestAnimationFrame(this.tick, this);
            this._requestAnimationFrameTimer.start();
        };

        PhongTorus.prototype.tick = function (dt) {
            this._mvMatrix.appendRotation(dt * 0.05, new away.geom.Vector3D(0, 1, 0));
            this._context3D.setProgram(this._program);
            this._context3D.setGLSLProgramConstantsFromMatrix("uNormalMatrix", this._normalMatrix, true);
            this._context3D.setGLSLProgramConstantsFromMatrix("uMVMatrix", this._mvMatrix, true);
            this._context3D.setGLSLProgramConstantsFromMatrix("uPMatrix", this._pMatrix, true);

            this._context3D.clear(0.16, 0.16, 0.16, 1);
            this._context3D.drawTriangles(this._iBuffer, 0, this._iBuffer.numIndices / 3);
            this._context3D.present();
        };
        return PhongTorus;
    })(away.events.EventDispatcher);
    scene.PhongTorus = PhongTorus;
})(scene || (scene = {}));
//# sourceMappingURL=PhongTorus.js.map
