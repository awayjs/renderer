/// <reference path="../libs/ref/js.d.ts" />
/// <reference path="../libs/awayjs-core.next.d.ts" />
/// <reference path="../libs/swfobject.d.ts" />
declare module aglsl {
    class Sampler {
        public lodbias: number;
        public dim: number;
        public readmode: number;
        public special: number;
        public wrap: number;
        public mipmap: number;
        public filter: number;
        constructor();
    }
}
declare module aglsl {
    class Token {
        public dest: Destination;
        public opcode: number;
        public a: Destination;
        public b: Destination;
        constructor();
    }
}
declare module aglsl {
    class Header {
        public progid: number;
        public version: number;
        public type: string;
        constructor();
    }
}
declare module aglsl {
    class OpLUT {
        public s: string;
        public flags: number;
        public dest: boolean;
        public a: boolean;
        public b: boolean;
        public matrixwidth: number;
        public matrixheight: number;
        public ndwm: boolean;
        public scalar: boolean;
        public dm: boolean;
        public lod: boolean;
        constructor(s: string, flags: number, dest: boolean, a: boolean, b: boolean, matrixwidth: number, matrixheight: number, ndwm: boolean, scaler: boolean, dm: boolean, lod: boolean);
    }
}
declare module aglsl {
    class Description {
        public regread: any[];
        public regwrite: any[];
        public hasindirect: boolean;
        public writedepth: boolean;
        public hasmatrix: boolean;
        public samplers: any[];
        public tokens: Token[];
        public header: Header;
        constructor();
    }
}
declare module aglsl {
    class Destination {
        public mask: number;
        public regnum: number;
        public regtype: number;
        public dim: number;
        constructor();
    }
}
declare module aglsl {
    class Mapping {
        static agal2glsllut: OpLUT[];
    }
}
declare module aglsl.assembler {
    class Opcode {
        public dest: string;
        public a: FS;
        public b: FS;
        public opcode: number;
        public flags: Flags;
        constructor(dest: string, aformat: string, asize: number, bformat: string, bsize: number, opcode: number, simple: boolean, horizontal: boolean, fragonly: boolean, matrix: boolean);
    }
    class FS {
        public format: string;
        public size: number;
    }
    class Flags {
        public simple: boolean;
        public horizontal: boolean;
        public fragonly: boolean;
        public matrix: boolean;
    }
}
declare module aglsl.assembler {
    class OpcodeMap {
        private static _map;
        static map : Object[];
        constructor();
    }
}
declare module aglsl.assembler {
    class Part {
        public name: string;
        public version: number;
        public data: away.utils.ByteArray;
        constructor(name?: string, version?: number);
    }
}
declare module aglsl.assembler {
    class Reg {
        public code: number;
        public desc: string;
        constructor(code: number, desc: string);
    }
    class RegMap {
        private static _map;
        static map : any[];
        constructor();
    }
}
declare module aglsl.assembler {
    class Sampler {
        public shift: number;
        public mask: number;
        public value: number;
        constructor(shift: number, mask: number, value: number);
    }
    class SamplerMap {
        private static _map;
        static map : Object[];
        constructor();
    }
}
declare module aglsl.assembler {
    class AGALMiniAssembler {
        public r: Object;
        public cur: Part;
        constructor();
        public assemble(source: string, ext_part?: any, ext_version?: any): Object;
        private processLine(line, linenr);
        public emitHeader(pr: Part): void;
        public emitOpcode(pr: Part, opcode: any): void;
        public emitZeroDword(pr: Part): void;
        public emitZeroQword(pr: any): void;
        public emitDest(pr: any, token: any, opdest: any): boolean;
        public stringToMask(s: string): number;
        public stringToSwizzle(s: any): number;
        public emitSampler(pr: Part, token: any, opsrc: any, opts: any): boolean;
        public emitSource(pr: any, token: any, opsrc: any): boolean;
        public addHeader(partname: any, version: any): void;
    }
}
declare module aglsl {
    class AGALTokenizer {
        constructor();
        public decribeAGALByteArray(bytes: away.utils.ByteArray): Description;
        public readReg(s: any, mh: any, desc: any, bytes: any): void;
    }
}
declare module aglsl {
    class AGLSLParser {
        public parse(desc: Description): string;
        public regtostring(regtype: number, regnum: number, desc: Description, tag: any): string;
        public sourcetostring(s: any, subline: any, dwm: any, isscalar: any, desc: any, tag: any): string;
    }
}
declare module away.stagegl {
    class ContextGLClearMask {
        static COLOR: number;
        static DEPTH: number;
        static STENCIL: number;
        static ALL: number;
    }
}
declare module away.stagegl {
    class ContextGLTextureFormat {
        static BGRA: string;
        static BGRA_PACKED: string;
        static BGR_PACKED: string;
        static COMPRESSED: string;
        static COMPRESSED_ALPHA: string;
    }
}
declare module away.stagegl {
    class ContextGLTriangleFace {
        static BACK: string;
        static FRONT: string;
        static FRONT_AND_BACK: string;
        static NONE: string;
    }
}
declare module away.stagegl {
    class ContextGLVertexBufferFormat {
        static BYTES_4: string;
        static FLOAT_1: string;
        static FLOAT_2: string;
        static FLOAT_3: string;
        static FLOAT_4: string;
    }
}
declare module away.stagegl {
    class ContextGLProgramType {
        static FRAGMENT: string;
        static VERTEX: string;
    }
}
declare module away.stagegl {
    class ContextGLBlendFactor {
        static DESTINATION_ALPHA: string;
        static DESTINATION_COLOR: string;
        static ONE: string;
        static ONE_MINUS_DESTINATION_ALPHA: string;
        static ONE_MINUS_DESTINATION_COLOR: string;
        static ONE_MINUS_SOURCE_ALPHA: string;
        static ONE_MINUS_SOURCE_COLOR: string;
        static SOURCE_ALPHA: string;
        static SOURCE_COLOR: string;
        static ZERO: string;
    }
}
declare module away.stagegl {
    class ContextGLCompareMode {
        static ALWAYS: string;
        static EQUAL: string;
        static GREATER: string;
        static GREATER_EQUAL: string;
        static LESS: string;
        static LESS_EQUAL: string;
        static NEVER: string;
        static NOT_EQUAL: string;
    }
}
declare module away.stagegl {
    class ContextGLMipFilter {
        static MIPLINEAR: string;
        static MIPNEAREST: string;
        static MIPNONE: string;
    }
}
declare module away.stagegl {
    class ContextGLMode {
        static AUTO: string;
        static WEBGL: string;
        static FLASH: string;
        static NATIVE: string;
    }
}
declare module away.stagegl {
    class ContextGLProfile {
        static BASELINE: string;
        static BASELINE_CONSTRAINED: string;
        static BASELINE_EXTENDED: string;
    }
}
declare module away.stagegl {
    class ContextGLStencilAction {
        static DECREMENT_SATURATE: string;
        static DECREMENT_WRAP: string;
        static INCREMENT_SATURATE: string;
        static INCREMENT_WRAP: string;
        static INVERT: string;
        static KEEP: string;
        static SET: string;
        static ZERO: string;
    }
}
declare module away.stagegl {
    class ContextGLTextureFilter {
        static LINEAR: string;
        static NEAREST: string;
    }
}
declare module away.stagegl {
    class ContextGLWrapMode {
        static CLAMP: string;
        static REPEAT: string;
    }
}
declare module away.stagegl {
    class ContextStage3D implements IContext {
        private _container;
        static contexts: Object;
        static maxvertexconstants: number;
        static maxfragconstants: number;
        static maxtemp: number;
        static maxstreams: number;
        static maxtextures: number;
        static defaultsampler: aglsl.Sampler;
        public _iDriverInfo: any;
        private _cmdStream;
        private _errorCheckingEnabled;
        private _resources;
        private _oldCanvas;
        private _oldParent;
        static debug: boolean;
        static logStream: boolean;
        public _iCallback: (context: IContext) => void;
        public container : HTMLElement;
        public driverInfo : any;
        public errorCheckingEnabled : boolean;
        constructor(container: HTMLCanvasElement, callback: (context: IContext) => void);
        public _iAddResource(resource: ResourceBaseFlash): void;
        public _iRemoveResource(resource: ResourceBaseFlash): void;
        public createTexture(width: number, height: number, format: string, optimizeForRenderToTexture: boolean, streamingLevels?: number): TextureFlash;
        public createCubeTexture(size: number, format: string, optimizeForRenderToTexture: boolean, streamingLevels?: number): CubeTextureFlash;
        public setTextureAt(sampler: number, texture: ResourceBaseFlash): void;
        public setSamplerStateAt(sampler: number, wrap: string, filter: string, mipfilter: string): void;
        public setStencilActions(triangleFace?: string, compareMode?: string, actionOnBothPass?: string, actionOnDepthFail?: string, actionOnDepthPassStencilFail?: string): void;
        public setStencilReferenceValue(referenceValue: number, readMask?: number, writeMask?: number): void;
        public setCulling(triangleFaceToCull: string, coordinateSystem?: string): void;
        public drawTriangles(indexBuffer: IndexBufferFlash, firstIndex?: number, numTriangles?: number): void;
        public setProgramConstantsFromMatrix(programType: string, firstRegister: number, matrix: geom.Matrix3D, transposedMatrix?: boolean): void;
        public setProgramConstantsFromArray(programType: string, firstRegister: number, data: number[], numRegisters?: number): void;
        public setProgram(program: ProgramFlash): void;
        public present(): void;
        public clear(red?: number, green?: number, blue?: number, alpha?: number, depth?: number, stencil?: number, mask?: number): void;
        public createProgram(): ProgramFlash;
        public createVertexBuffer(numVertices: number, data32PerVertex: number): VertexBufferFlash;
        public createIndexBuffer(numIndices: number): IndexBufferFlash;
        public configureBackBuffer(width: number, height: number, antiAlias: number, enableDepthAndStencil?: boolean): void;
        public drawToBitmapData(destination: base.BitmapData): void;
        public setVertexBufferAt(index: number, buffer: VertexBufferFlash, bufferOffset?: number, format?: string): void;
        public setColorMask(red: boolean, green: boolean, blue: boolean, alpha: boolean): void;
        public setBlendFactors(sourceFactor: string, destinationFactor: string): void;
        public setRenderToTexture(target: ResourceBaseFlash, enableDepthAndStencil?: boolean, antiAlias?: number, surfaceSelector?: number): void;
        public setRenderToBackBuffer(): void;
        public setScissorRectangle(rectangle: geom.Rectangle): void;
        public setDepthTest(depthMask: boolean, passCompareMode: string): void;
        public dispose(): void;
        public addStream(stream: string): void;
        public execute(): number;
    }
}
/**
* global function for flash callback
*/
declare function mountain_js_context_available(id: any, driverInfo: any): void;
declare module away.stagegl {
    class ContextWebGL implements IContext {
        private _container;
        private _blendFactorDictionary;
        private _depthTestDictionary;
        private _textureIndexDictionary;
        private _textureTypeDictionary;
        private _wrapDictionary;
        private _filterDictionary;
        private _mipmapFilterDictionary;
        private _uniformLocationNameDictionary;
        private _vertexBufferDimensionDictionary;
        private _drawing;
        private _blendEnabled;
        private _blendSourceFactor;
        private _blendDestinationFactor;
        private _indexBufferList;
        private _vertexBufferList;
        private _textureList;
        private _programList;
        private _samplerStates;
        static MAX_SAMPLERS: number;
        public _gl: WebGLRenderingContext;
        public _currentProgram: ProgramWebGL;
        private _activeTexture;
        public container : HTMLElement;
        constructor(canvas: HTMLCanvasElement);
        public gl(): WebGLRenderingContext;
        public clear(red?: number, green?: number, blue?: number, alpha?: number, depth?: number, stencil?: number, mask?: number): void;
        public configureBackBuffer(width: number, height: number, antiAlias: number, enableDepthAndStencil?: boolean): void;
        public createCubeTexture(size: number, format: string, optimizeForRenderToTexture: boolean, streamingLevels?: number): CubeTextureWebGL;
        public createIndexBuffer(numIndices: number): IndexBufferWebGL;
        public createProgram(): ProgramWebGL;
        public createTexture(width: number, height: number, format: string, optimizeForRenderToTexture: boolean, streamingLevels?: number): TextureWebGL;
        public createVertexBuffer(numVertices: number, data32PerVertex: number): VertexBufferWebGL;
        public dispose(): void;
        public drawToBitmapData(destination: base.BitmapData): void;
        public drawTriangles(indexBuffer: IndexBufferWebGL, firstIndex?: number, numTriangles?: number): void;
        public present(): void;
        public setBlendFactors(sourceFactor: string, destinationFactor: string): void;
        public setColorMask(red: boolean, green: boolean, blue: boolean, alpha: boolean): void;
        public setCulling(triangleFaceToCull: string, coordinateSystem?: string): void;
        public setDepthTest(depthMask: boolean, passCompareMode: string): void;
        public setProgram(program: ProgramWebGL): void;
        public setProgramConstantsFromMatrix(programType: string, firstRegister: number, matrix: geom.Matrix3D, transposedMatrix?: boolean): void;
        static modulo: number;
        public setProgramConstantsFromArray(programType: string, firstRegister: number, data: number[], numRegisters?: number): void;
        public setScissorRectangle(rectangle: geom.Rectangle): void;
        public setTextureAt(sampler: number, texture: TextureBaseWebGL): void;
        public setSamplerStateAt(sampler: number, wrap: string, filter: string, mipfilter: string): void;
        public setVertexBufferAt(index: number, buffer: VertexBufferWebGL, bufferOffset?: number, format?: string): void;
        public setRenderToTexture(target: TextureBaseWebGL, enableDepthAndStencil?: boolean, antiAlias?: number, surfaceSelector?: number): void;
        public setRenderToBackBuffer(): void;
        private updateBlendStatus();
    }
}
declare module away.stagegl {
    class ResourceBaseFlash {
        public _pId: number;
        public id : number;
        public dispose(): void;
    }
}
declare module away.stagegl {
    class TextureBaseWebGL {
        public textureType: string;
        public _gl: WebGLRenderingContext;
        constructor(gl: WebGLRenderingContext);
        public dispose(): void;
        public glTexture : WebGLTexture;
    }
}
declare module away.stagegl {
    class CubeTextureFlash extends ResourceBaseFlash implements ICubeTexture {
        private _context;
        private _size;
        public size : number;
        constructor(context: ContextStage3D, size: number, format: string, forRTT: boolean, streaming?: boolean);
        public dispose(): void;
        public uploadFromData(bitmapData: base.BitmapData, side: number, miplevel?: number): any;
        public uploadFromData(image: HTMLImageElement, side: number, miplevel?: number): any;
        public uploadCompressedTextureFromByteArray(data: utils.ByteArray, byteArrayOffset: number, async?: boolean): void;
    }
}
declare module away.stagegl {
    class CubeTextureWebGL extends TextureBaseWebGL implements ICubeTexture {
        private _textureSelectorDictionary;
        public textureType: string;
        private _texture;
        private _size;
        constructor(gl: WebGLRenderingContext, size: number);
        public dispose(): void;
        public uploadFromData(bitmapData: base.BitmapData, side: number, miplevel?: number): any;
        public uploadFromData(image: HTMLImageElement, side: number, miplevel?: number): any;
        public uploadCompressedTextureFromByteArray(data: utils.ByteArray, byteArrayOffset: number, async?: boolean): void;
        public size : number;
        public glTexture : WebGLTexture;
    }
}
declare module away.stagegl {
    interface IContext {
        container: HTMLElement;
        clear(red?: number, green?: number, blue?: number, alpha?: number, depth?: number, stencil?: number, mask?: number): any;
        configureBackBuffer(width: number, height: number, antiAlias: number, enableDepthAndStencil?: boolean): any;
        createCubeTexture(size: number, format: string, optimizeForRenderToTexture: boolean, streamingLevels?: number): ICubeTexture;
        createIndexBuffer(numIndices: number): IIndexBuffer;
        createProgram(): IProgram;
        createTexture(width: number, height: number, format: string, optimizeForRenderToTexture: boolean, streamingLevels?: number): ITexture;
        createVertexBuffer(numVertices: number, data32PerVertex: number): IVertexBuffer;
        dispose(): any;
        drawToBitmapData(destination: base.BitmapData): any;
        drawTriangles(indexBuffer: IIndexBuffer, firstIndex?: number, numTriangles?: number): any;
        present(): any;
        setBlendFactors(sourceFactor: string, destinationFactor: string): any;
        setColorMask(red: boolean, green: boolean, blue: boolean, alpha: boolean): any;
        setCulling(triangleFaceToCull: string, coordinateSystem?: string): any;
        setDepthTest(depthMask: boolean, passCompareMode: string): any;
        setProgram(program: IProgram): any;
        setProgramConstantsFromMatrix(programType: string, firstRegister: number, matrix: geom.Matrix3D, transposedMatrix?: boolean): any;
        setProgramConstantsFromArray(programType: string, firstRegister: number, data: number[], numRegisters?: number): any;
        setSamplerStateAt(sampler: number, wrap: string, filter: string, mipfilter: string): any;
        setScissorRectangle(rectangle: geom.Rectangle): any;
        setTextureAt(sampler: number, texture: ITextureBase): any;
        setVertexBufferAt(index: number, buffer: IVertexBuffer, bufferOffset?: number, format?: string): any;
        setRenderToTexture(target: ITextureBase, enableDepthAndStencil?: boolean, antiAlias?: number, surfaceSelector?: number): any;
        setRenderToBackBuffer(): any;
    }
}
declare module away.stagegl {
    interface ICubeTexture extends ITextureBase {
        size: number;
        uploadFromData(bitmapData: base.BitmapData, side: number, miplevel?: number): any;
        uploadFromData(image: HTMLImageElement, side: number, miplevel?: number): any;
        uploadCompressedTextureFromByteArray(data: utils.ByteArray, byteArrayOffset: number, async: boolean): any;
    }
}
declare module away.stagegl {
    interface IIndexBuffer {
        numIndices: number;
        uploadFromArray(data: number[], startOffset: number, count: number): any;
        dispose(): any;
    }
}
declare module away.stagegl {
    class IndexBufferFlash extends ResourceBaseFlash implements IIndexBuffer {
        private _context;
        private _numIndices;
        constructor(context: ContextStage3D, numIndices: number);
        public uploadFromArray(data: number[], startOffset: number, count: number): void;
        public dispose(): void;
        public numIndices : number;
    }
}
declare module away.stagegl {
    class IndexBufferWebGL implements IIndexBuffer {
        private _gl;
        private _numIndices;
        private _buffer;
        constructor(gl: WebGLRenderingContext, numIndices: number);
        public uploadFromArray(data: number[], startOffset: number, count: number): void;
        public dispose(): void;
        public numIndices : number;
        public glBuffer : WebGLBuffer;
    }
}
declare module away.stagegl {
    interface IProgram {
        upload(vertexProgram: utils.ByteArray, fragmentProgram: utils.ByteArray): any;
        dispose(): any;
    }
}
declare module away.stagegl {
    interface ITexture extends ITextureBase {
        width: number;
        height: number;
        uploadFromData(bitmapData: base.BitmapData, miplevel?: number): any;
        uploadFromData(image: HTMLImageElement, miplevel?: number): any;
    }
}
declare module away.stagegl {
    interface ITextureBase {
        dispose(): any;
    }
}
declare module away.stagegl {
    interface IVertexBuffer {
        numVertices: number;
        data32PerVertex: number;
        uploadFromArray(data: number[], startVertex: number, numVertices: number): any;
        dispose(): any;
    }
}
declare module away.stagegl {
    class OpCodes {
        static trueValue: number;
        static falseValue: number;
        static intMask: number;
        static drawTriangles: number;
        static setProgramConstant: number;
        static setProgram: number;
        static present: number;
        static clear: number;
        static initProgram: number;
        static initVertexBuffer: number;
        static initIndexBuffer: number;
        static configureBackBuffer: number;
        static uploadArrayIndexBuffer: number;
        static uploadArrayVertexBuffer: number;
        static uploadAGALBytesProgram: number;
        static setVertexBufferAt: number;
        static uploadBytesIndexBuffer: number;
        static uploadBytesVertexBuffer: number;
        static setColorMask: number;
        static setDepthTest: number;
        static disposeProgram: number;
        static disposeContext: number;
        static disposeVertexBuffer: number;
        static disposeIndexBuffer: number;
        static initTexture: number;
        static setTextureAt: number;
        static uploadBytesTexture: number;
        static disposeTexture: number;
        static setCulling: number;
        static setScissorRect: number;
        static clearScissorRect: number;
        static setBlendFactors: number;
        static setRenderToTexture: number;
        static clearTextureAt: number;
        static clearVertexBufferAt: number;
        static setStencilActions: number;
        static setStencilReferenceValue: number;
        static initCubeTexture: number;
        static disposeCubeTexture: number;
        static uploadBytesCubeTexture: number;
        static clearRenderToTexture: number;
        static enableErrorChecking: number;
    }
}
declare module away.stagegl {
    class ProgramFlash extends ResourceBaseFlash implements IProgram {
        private _context;
        constructor(context: ContextStage3D);
        public upload(vertexProgram: utils.ByteArray, fragmentProgram: utils.ByteArray): void;
        public dispose(): void;
    }
}
declare module away.stagegl {
    class ProgramWebGL implements IProgram {
        private static _tokenizer;
        private static _aglslParser;
        private _gl;
        private _program;
        private _vertexShader;
        private _fragmentShader;
        constructor(gl: WebGLRenderingContext);
        public upload(vertexProgram: utils.ByteArray, fragmentProgram: utils.ByteArray): any;
        public dispose(): void;
        public focusProgram(): void;
        public glProgram : WebGLProgram;
    }
}
declare module away.stagegl {
    class SamplerState {
        public type: number;
        public wrap: number;
        public filter: number;
        public mipfilter: number;
    }
}
declare module away.stagegl {
    class TextureFlash extends ResourceBaseFlash implements ITexture {
        private _context;
        private _width;
        private _height;
        public width : number;
        public height : number;
        constructor(context: ContextStage3D, width: number, height: number, format: string, forRTT: boolean, streaming?: boolean);
        public dispose(): void;
        public uploadFromData(bitmapData: base.BitmapData, miplevel?: number): any;
        public uploadFromData(image: HTMLImageElement, miplevel?: number): any;
    }
}
declare module away.stagegl {
    class TextureWebGL extends TextureBaseWebGL implements ITexture {
        public textureType: string;
        private _width;
        private _height;
        private _frameBuffer;
        private _glTexture;
        constructor(gl: WebGLRenderingContext, width: number, height: number);
        public dispose(): void;
        public width : number;
        public height : number;
        public frameBuffer : WebGLFramebuffer;
        public uploadFromData(bitmapData: base.BitmapData, miplevel?: number): any;
        public uploadFromData(image: HTMLImageElement, miplevel?: number): any;
        public uploadCompressedTextureFromByteArray(data: utils.ByteArray, byteArrayOffset: number, async?: boolean): void;
        public glTexture : WebGLTexture;
        public generateMipmaps(): void;
    }
}
declare module away.stagegl {
    class VertexBufferFlash extends ResourceBaseFlash implements IVertexBuffer {
        private _context;
        private _numVertices;
        private _data32PerVertex;
        constructor(context: ContextStage3D, numVertices: number, data32PerVertex: number);
        public uploadFromArray(data: number[], startVertex: number, numVertices: number): void;
        public numVertices : number;
        public data32PerVertex : number;
        public dispose(): void;
    }
}
declare module away.stagegl {
    class VertexBufferWebGL implements IVertexBuffer {
        private _gl;
        private _numVertices;
        private _data32PerVertex;
        private _buffer;
        constructor(gl: WebGLRenderingContext, numVertices: number, data32PerVertex: number);
        public uploadFromArray(vertices: number[], startVertex: number, numVertices: number): void;
        public numVertices : number;
        public data32PerVertex : number;
        public glBuffer : WebGLBuffer;
        public dispose(): void;
    }
}
declare module away.base {
    /**
    * StageGL provides a proxy class to handle the creation and attachment of the ContextWebGL
    * (and in turn the back buffer) it uses. StageGL should never be created directly,
    * but requested through StageGLManager.
    *
    * @see away.managers.StageGLManager
    *
    * todo: consider moving all creation methods (createVertexBuffer etc) in here, so that disposal can occur here
    * along with the context, instead of scattered throughout the framework
    */
    class StageGL extends events.EventDispatcher implements IStage {
        private _texturePool;
        private _contextGL;
        private _container;
        private _width;
        private _height;
        private _x;
        private _y;
        public _iStageGLIndex: number;
        private _usesSoftwareRendering;
        private _profile;
        private _activeProgram;
        private _stageGLManager;
        private _antiAlias;
        private _enableDepthAndStencil;
        private _contextRequested;
        private _renderTarget;
        private _renderSurfaceSelector;
        private _scissorRect;
        private _color;
        private _backBufferDirty;
        private _viewPort;
        private _enterFrame;
        private _exitFrame;
        private _viewportUpdated;
        private _viewportDirty;
        private _bufferClear;
        private _initialised;
        constructor(container: HTMLCanvasElement, stageGLIndex: number, stageGLManager: managers.StageGLManager, forceSoftware?: boolean, profile?: string);
        /**
        * Requests a ContextWebGL object to attach to the managed gl canvas.
        */
        public requestContext(forceSoftware?: boolean, profile?: string, mode?: string): void;
        /**
        * The width of the gl canvas
        */
        public width : number;
        /**
        * The height of the gl canvas
        */
        public height : number;
        /**
        * The x position of the gl canvas
        */
        public x : number;
        /**
        * The y position of the gl canvas
        */
        public y : number;
        public visible : boolean;
        public container : HTMLElement;
        /**
        * The ContextWebGL object associated with the given gl canvas object.
        */
        public contextGL : stagegl.IContext;
        private notifyViewportUpdated();
        private notifyEnterFrame();
        private notifyExitFrame();
        public profile : string;
        /**
        * Disposes the StageGL object, freeing the ContextWebGL attached to the StageGL.
        */
        public dispose(): void;
        /**
        * Configures the back buffer associated with the StageGL object.
        * @param backBufferWidth The width of the backbuffer.
        * @param backBufferHeight The height of the backbuffer.
        * @param antiAlias The amount of anti-aliasing to use.
        * @param enableDepthAndStencil Indicates whether the back buffer contains a depth and stencil buffer.
        */
        public configureBackBuffer(backBufferWidth: number, backBufferHeight: number, antiAlias: number, enableDepthAndStencil: boolean): void;
        public enableDepthAndStencil : boolean;
        public renderTarget : textures.TextureProxyBase;
        public renderSurfaceSelector : number;
        public setRenderTarget(target: textures.TextureProxyBase, enableDepthAndStencil?: boolean, surfaceSelector?: number): void;
        public getRenderTexture(textureProxy: textures.RenderTexture): stagegl.ITextureBase;
        public clear(): void;
        public present(): void;
        public addEventListener(type: string, listener: Function): void;
        /**
        * Removes a listener from the EventDispatcher object. Special case for enterframe and exitframe events - will switch StageGLProxy out of automatic render mode.
        * If there is no matching listener registered with the EventDispatcher object, a call to this method has no effect.
        *
        * @param type The type of event.
        * @param listener The listener object to remove.
        * @param useCapture Specifies whether the listener was registered for the capture phase or the target and bubbling phases. If the listener was registered for both the capture phase and the target and bubbling phases, two calls to removeEventListener() are required to remove both, one call with useCapture() set to true, and another call with useCapture() set to false.
        */
        public removeEventListener(type: string, listener: Function): void;
        public scissorRect : geom.Rectangle;
        /**
        * The index of the StageGL which is managed by this instance of StageGLProxy.
        */
        public stageGLIndex : number;
        /**
        * Indicates whether the StageGL managed by this proxy is running in software mode.
        * Remember to wait for the CONTEXTGL_CREATED event before checking this property,
        * as only then will it be guaranteed to be accurate.
        */
        public usesSoftwareRendering : boolean;
        /**
        * The antiAliasing of the StageGL.
        */
        public antiAlias : number;
        /**
        * A viewPort rectangle equivalent of the StageGL size and position.
        */
        public viewPort : geom.Rectangle;
        /**
        * The background color of the StageGL.
        */
        public color : number;
        /**
        * The freshly cleared state of the backbuffer before any rendering
        */
        public bufferClear : boolean;
        /**
        * Assigns an attribute stream
        *
        * @param index The attribute stream index for the vertex shader
        * @param buffer
        * @param offset
        * @param stride
        * @param format
        */
        public activateBuffer(index: number, buffer: pool.VertexData, offset: number, format: string): void;
        public disposeVertexData(buffer: pool.VertexData): void;
        public activateRenderTexture(index: number, textureProxy: textures.RenderTexture): void;
        public activateTexture(index: number, textureProxy: textures.Texture2DBase): void;
        public activateCubeTexture(index: number, textureProxy: textures.CubeTextureBase): void;
        /**
        * Retrieves the VertexBuffer object that contains triangle indices.
        * @param context The ContextWebGL for which we request the buffer
        * @return The VertexBuffer object that contains triangle indices.
        */
        public getIndexBuffer(buffer: pool.IndexData): stagegl.IIndexBuffer;
        public disposeIndexData(buffer: pool.IndexData): void;
        /**
        * Frees the ContextWebGL associated with this StageGLProxy.
        */
        private freeContextGL();
        /**
        * The Enter_Frame handler for processing the proxy.ENTER_FRAME and proxy.EXIT_FRAME event handlers.
        * Typically the proxy.ENTER_FRAME listener would render the layers for this StageGL instance.
        */
        private onEnterFrame(event);
        public recoverFromDisposal(): boolean;
        public clearDepthBuffer(): void;
        private _callback(context);
    }
}
/**
* @module away.base
*/
declare module away.pool {
    /**
    *
    */
    class IndexData {
        private static LIMIT_VERTS;
        private static LIMIT_INDICES;
        private _dataDirty;
        public invalid: boolean[];
        public stageGLs: base.StageGL[];
        public buffers: stagegl.IIndexBuffer[];
        public data: number[];
        public indexMappings: number[];
        public originalIndices: number[];
        public offset: number;
        public level: number;
        constructor(level: number);
        public updateData(offset: number, indices: number[], numVertices: number): void;
        public invalidateData(): void;
        public dispose(): void;
        /**
        * @private
        */
        private disposeBuffers();
        /**
        * @private
        */
        private invalidateBuffers();
        /**
        *
        * @param data
        * @private
        */
        private setData(data);
    }
}
/**
* @module away.base
*/
declare module away.pool {
    /**
    *
    */
    class IndexDataPool {
        private static _pool;
        constructor();
        static getItem(subGeometry: base.SubGeometryBase, level: number, indexOffset: number): IndexData;
        static disposeItem(id: number, level: number): void;
        public disposeData(id: number): void;
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    *
    * @class away.pool.TextureDataBase
    */
    class TextureData implements ITextureData {
        public stageGL: base.StageGL;
        public texture: stagegl.ITextureBase;
        public textureProxy: textures.TextureProxyBase;
        public invalid: boolean;
        constructor(stageGL: base.StageGL, textureProxy: textures.TextureProxyBase);
        /**
        *
        */
        public dispose(): void;
        /**
        *
        */
        public invalidate(): void;
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.TextureDataPool
    */
    class TextureDataPool {
        private _pool;
        private _stage;
        /**
        * //TODO
        *
        * @param textureDataClass
        */
        constructor(stage: base.StageGL);
        /**
        * //TODO
        *
        * @param materialOwner
        * @returns ITexture
        */
        public getItem(textureProxy: textures.TextureProxyBase): TextureData;
        /**
        * //TODO
        *
        * @param materialOwner
        */
        public disposeItem(textureProxy: textures.TextureProxyBase): void;
    }
}
/**
* @module away.base
*/
declare module away.pool {
    /**
    *
    */
    class VertexData {
        private _onVerticesUpdatedDelegate;
        private _subGeometry;
        private _dataType;
        private _dataDirty;
        public invalid: boolean[];
        public buffers: stagegl.IVertexBuffer[];
        public stageGLs: base.StageGL[];
        public data: number[];
        public dataPerVertex: number;
        constructor(subGeometry: base.SubGeometryBase, dataType: string);
        public updateData(originalIndices?: number[], indexMappings?: number[]): void;
        public dispose(): void;
        /**
        * @private
        */
        private disposeBuffers();
        /**
        * @private
        */
        private invalidateBuffers();
        /**
        *
        * @param data
        * @param dataPerVertex
        * @private
        */
        private setData(data);
        /**
        * //TODO
        *
        * @param event
        * @private
        */
        private _onVerticesUpdated(event);
    }
}
/**
* @module away.base
*/
declare module away.pool {
    /**
    *
    */
    class VertexDataPool {
        private static _pool;
        constructor();
        static getItem(subGeometry: base.SubGeometryBase, indexData: IndexData, dataType: string): VertexData;
        static disposeItem(subGeometry: base.SubGeometryBase, level: number, dataType: string): void;
        public disposeData(subGeometry: base.SubGeometryBase): void;
    }
}
declare module away.managers {
    class AGALProgramCache {
        private static _instances;
        private _stageGL;
        private _program3Ds;
        private _ids;
        private _usages;
        private _keys;
        private _onContextGLDisposedDelegate;
        private static _currentId;
        constructor(stageGL: base.StageGL, agalProgramCacheSingletonEnforcer: AGALProgramCacheSingletonEnforcer);
        static getInstance(stageGL: base.StageGL): AGALProgramCache;
        static getInstanceFromIndex(index: number): AGALProgramCache;
        private static onContextGLDisposed(event);
        public dispose(): void;
        public setProgram(programIds: number[], programs: stagegl.IProgram[], vertexCode: string, fragmentCode: string): void;
        public freeProgram(programId: number): void;
        private destroyProgram(key);
        private getKey(vertexCode, fragmentCode);
    }
}
declare class AGALProgramCacheSingletonEnforcer {
}
declare module away.managers {
    class RTTBufferManager extends events.EventDispatcher {
        private static _instances;
        private _renderToTextureVertexBuffer;
        private _renderToScreenVertexBuffer;
        private _indexBuffer;
        private _stageGL;
        private _viewWidth;
        private _viewHeight;
        private _textureWidth;
        private _textureHeight;
        private _renderToTextureRect;
        private _buffersInvalid;
        private _textureRatioX;
        private _textureRatioY;
        constructor(se: SingletonEnforcer, stageGL: base.StageGL);
        static getInstance(stageGL: base.StageGL): RTTBufferManager;
        private static getRTTBufferManagerFromStageGL(stageGL);
        private static deleteRTTBufferManager(stageGL);
        public textureRatioX : number;
        public textureRatioY : number;
        public viewWidth : number;
        public viewHeight : number;
        public renderToTextureVertexBuffer : stagegl.IVertexBuffer;
        public renderToScreenVertexBuffer : stagegl.IVertexBuffer;
        public indexBuffer : stagegl.IIndexBuffer;
        public renderToTextureRect : geom.Rectangle;
        public textureWidth : number;
        public textureHeight : number;
        public dispose(): void;
        private updateRTTBuffers();
    }
}
declare class SingletonEnforcer {
}
declare module away.managers {
    /**
    * The StageGLManager class provides a multiton object that handles management for StageGL objects. StageGL objects
    * should not be requested directly, but are exposed by a StageGLProxy.
    *
    * @see away.base.StageGL
    */
    class StageGLManager extends events.EventDispatcher {
        private static STAGEGL_MAX_QUANTITY;
        private _stageGLs;
        private static _instance;
        private static _numStageGLs;
        private _onContextCreatedDelegate;
        /**
        * Creates a new StageGLManager class.
        * @param stage The Stage object that contains the StageGL objects to be managed.
        * @private
        */
        constructor(StageGLManagerSingletonEnforcer: StageGLManagerSingletonEnforcer);
        /**
        * Gets a StageGLManager instance for the given Stage object.
        * @param stage The Stage object that contains the StageGL objects to be managed.
        * @return The StageGLManager instance for the given Stage object.
        */
        static getInstance(): StageGLManager;
        /**
        * Requests the StageGL for the given index.
        *
        * @param index The index of the requested StageGL.
        * @param forceSoftware Whether to force software mode even if hardware acceleration is available.
        * @param profile The compatibility profile, an enumeration of ContextGLProfile
        * @return The StageGL for the given index.
        */
        public getStageGLAt(index: number, forceSoftware?: boolean, profile?: string, mode?: string): base.StageGL;
        /**
        * Removes a StageGL from the manager.
        * @param stageGL
        * @private
        */
        public iRemoveStageGL(stageGL: base.StageGL): void;
        /**
        * Get the next available stageGL. An error is thrown if there are no StageGLProxies available
        * @param forceSoftware Whether to force software mode even if hardware acceleration is available.
        * @param profile The compatibility profile, an enumeration of ContextGLProfile
        * @return The allocated stageGL
        */
        public getFreeStageGL(forceSoftware?: boolean, profile?: string, mode?: string): base.StageGL;
        /**
        * Checks if a new stageGL can be created and managed by the class.
        * @return true if there is one slot free for a new stageGL
        */
        public hasFreeStageGL : boolean;
        /**
        * Returns the amount of stageGL objects that can be created and managed by the class
        * @return the amount of free slots
        */
        public numSlotsFree : number;
        /**
        * Returns the amount of StageGL objects currently managed by the class.
        * @return the amount of slots used
        */
        public numSlotsUsed : number;
        /**
        * The maximum amount of StageGL objects that can be managed by the class
        */
        public numSlotsTotal : number;
        private onContextCreated(e);
    }
}
declare class StageGLManagerSingletonEnforcer {
}
declare module away {
    class StageGLContext extends events.EventDispatcher {
        constructor();
    }
}
