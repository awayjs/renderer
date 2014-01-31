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
    var MaterialTorus = (function (_super) {
        __extends(MaterialTorus, _super);
        function MaterialTorus() {
            _super.call(this);

            away.Debug.THROW_ERRORS = false;

            if (!document) {
                throw "The document root object must be avaiable";
            }

            this.loadResources();
        }
        MaterialTorus.prototype.loadResources = function () {
            var urlRequest = new away.net.URLRequest("130909wall_big.png");
            var urlLoader = new away.net.URLLoader();
            urlLoader.dataFormat = away.net.URLLoaderDataFormat.BLOB;
            urlLoader.addEventListener(away.events.Event.COMPLETE, away.utils.Delegate.create(this, this.imageCompleteHandler));
            urlLoader.load(urlRequest);
        };

        MaterialTorus.prototype.imageCompleteHandler = function (e) {
            var _this = this;
            var imageLoader = e.target;
            this._image = away.parsers.ParserUtils.blobToImage(imageLoader.data);
            this._image.onload = function (event) {
                return _this.onLoadComplete(event);
            };
        };

        MaterialTorus.prototype.onLoadComplete = function (event) {
            this._stageGL = new away.base.StageGL(document.createElement("canvas"), 0, null);
            this._stageGL.addEventListener(away.events.StageGLEvent.CONTEXTGL_CREATED, away.utils.Delegate.create(this, this.onContextGLCreateHandler));
            this._stageGL.requestContext();
        };

        MaterialTorus.prototype.onContextGLCreateHandler = function (e) {
            this._stageGL.removeEventListener(away.events.StageGLEvent.CONTEXTGL_CREATED, away.utils.Delegate.create(this, this.onContextGLCreateHandler));
            this._stageGL.width = 800;
            this._stageGL.height = 600;

            document.body.appendChild(this._stageGL.canvas);

            //constructor(stageGLIndex:number, stageGL:away.display.StageGL, stageGLManager:away.managers.StageGLManager, forceSoftware:boolean = false, profile:string = "baseline")
            this._contextGL = this._stageGL.contextGL;

            //this._texture = this._contextGL.createTexture( 512, 512, away.gl.ContextGLTextureFormat.BGRA, true );
            //this._texture.uploadFromHTMLImageElement( this._image );
            //var bitmapData: away.display.BitmapData = new away.display.BitmapData( 512, 512, true, 0x02CGL4 );
            //this._texture.uploadFromBitmapData( bitmapData );
            this._contextGL.configureBackBuffer(800, 600, 0, true);
            this._contextGL.setColorMask(true, true, true, true);

            //var torus: away.primitives.TorusGeometry = new away.primitives.TorusGeometry( 1, 0.5, 32, 16, false );
            //var torus: away.primitives.CubeGeometry= new away.primitives.CubeGeometry( 1 , 1 , 1 , 32 , 32 , 32 );
            //var torus: away.primitives.CapsuleGeometry= new away.primitives.CapsuleGeometry( 1 , 1 , 32 , 32 );
            var torus = new away.primitives.CylinderGeometry(0, 2, 3, 32, 32);

            //var torus: away.primitives.SphereGeometry= new away.primitives.SphereGeometry( 2 , 32 , 32 );
            //var torus: away.primitives.RegularPolygonGeometry= new away.primitives.RegularPolygonGeometry( 4 );// NOT WORKING
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

            this._material = new away.materials.ColorMaterial();
            this._material._pScreenPass.iUpdateProgram(this._stageGL);

            console.log(this._material._pScreenPass.iGetVertexCode());

            var vProgram = "attribute vec3 aVertexPosition;\n" + "attribute vec2 aTextureCoord;\n" + "attribute vec3 aVertexNormal;\n" + "uniform mat4 uPMatrix;\n" + "uniform mat4 uMVMatrix;\n" + "uniform mat4 uNormalMatrix;\n" + "varying vec3 vNormalInterp;\n" + "varying vec3 vVertPos;\n" + "void main(){\n" + "	gl_Position = uPMatrix * uMVMatrix * vec4( aVertexPosition, 1.0 );\n" + "	vec4 vertPos4 = uMVMatrix * vec4( aVertexPosition, 1.0 );\n" + "	vVertPos = vec3( vertPos4 ) / vertPos4.w;\n" + "	vNormalInterp = vec3( uNormalMatrix * vec4( aVertexNormal, 0.0 ) );\n" + "}\n";

            var fProgram = "precision mediump float;\n" + "varying vec3 vNormalInterp;\n" + "varying vec3 vVertPos;\n" + "const vec3 lightPos = vec3( 1.0,1.0,1.0 );\n" + "const vec3 diffuseColor = vec3( 0.3, 0.6, 0.9 );\n" + "const vec3 specColor = vec3( 1.0, 1.0, 1.0 );\n" + "void main() {\n" + "	vec3 normal = normalize( vNormalInterp );\n" + "	vec3 lightDir = normalize( lightPos - vVertPos );\n" + "	float lambertian = max( dot( lightDir,normal ), 0.0 );\n" + "	float specular = 0.0;\n" + "	if( lambertian > 0.0 ) {\n" + "		vec3 reflectDir = reflect( -lightDir, normal );\n" + "		vec3 viewDir = normalize( -vVertPos );\n" + "		float specAngle = max( dot( reflectDir, viewDir ), 0.0 );\n" + "		specular = pow( specAngle, 4.0 );\n" + "		specular *= lambertian;\n" + "	}\n" + "	gl_FragColor = vec4( lambertian * diffuseColor + specular * specColor, 1.0 );\n" + "}\n";

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

            this._requestAnimationFrameTimer = new away.utils.RequestAnimationFrame(this.tick, this);
            this._requestAnimationFrameTimer.start();
        };

        MaterialTorus.prototype.tick = function (dt) {
            this._mvMatrix.appendRotation(dt * 0.05, new away.geom.Vector3D(0, 1, 0));
            this._mvMatrix.position = new away.geom.Vector3D(0, 0, 5);

            this._contextGL.setProgram(this._program);
            this._contextGL.setGLSLProgramConstantsFromMatrix("uNormalMatrix", this._normalMatrix, true);
            this._contextGL.setGLSLProgramConstantsFromMatrix("uMVMatrix", this._mvMatrix, true);
            this._contextGL.setGLSLProgramConstantsFromMatrix("uPMatrix", this._pMatrix, true);

            this._contextGL.clear(0.16, 0.16, 0.16, 1);
            this._contextGL.drawTriangles(this._iBuffer, 0, this._iBuffer.numIndices / 3);
            this._contextGL.present();
        };
        return MaterialTorus;
    })(away.events.EventDispatcher);
    scene.MaterialTorus = MaterialTorus;
})(scene || (scene = {}));
//# sourceMappingURL=MaterialTorus.js.map
