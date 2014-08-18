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
declare module away.events {
    /**
    * Dispatched to notify changes in an animator's state.
    */
    class AnimatorEvent extends Event {
        /**
        * Defines the value of the type property of a start event object.
        */
        static START: string;
        /**
        * Defines the value of the type property of a stop event object.
        */
        static STOP: string;
        /**
        * Defines the value of the type property of a cycle complete event object.
        */
        static CYCLE_COMPLETE: string;
        private _animator;
        /**
        * Create a new <code>AnimatorEvent</code> object.
        *
        * @param type The event type.
        * @param animator The animator object that is the subject of this event.
        */
        constructor(type: string, animator: animators.AnimatorBase);
        public animator : animators.AnimatorBase;
        /**
        * Clones the event.
        *
        * @return An exact duplicate of the current event object.
        */
        public clone(): Event;
    }
}
/**
* @module away.events
*/
declare module away.events {
    class ShadingMethodEvent extends Event {
        static SHADER_INVALIDATED: string;
        constructor(type: string);
    }
}
declare module away.errors {
    class AnimationSetError extends Error {
        constructor(message: string);
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.RenderableListItem
    */
    class RenderableBase implements IRenderable {
        private _onIndicesUpdatedDelegate;
        private _onVerticesUpdatedDelegate;
        private _subGeometry;
        private _geometryDirty;
        private _indexData;
        private _indexDataDirty;
        private _vertexData;
        public _pVertexDataDirty: Object;
        private _vertexOffset;
        private _level;
        private _indexOffset;
        private _overflow;
        private _numTriangles;
        private _concatenateArrays;
        public JOINT_INDEX_FORMAT: string;
        public JOINT_WEIGHT_FORMAT: string;
        /**
        *
        */
        public _pool: RenderablePool;
        /**
        *
        */
        public overflow : RenderableBase;
        /**
        *
        */
        public numTriangles : number;
        /**
        *
        */
        public next: RenderableBase;
        /**
        *
        */
        public materialId: number;
        /**
        *
        */
        public renderOrderId: number;
        /**
        *
        */
        public zIndex: number;
        /**
        *
        */
        public cascaded: boolean;
        /**
        *
        */
        public renderSceneTransform: geom.Matrix3D;
        /**
        *
        */
        public sourceEntity: entities.IEntity;
        /**
        *
        */
        public materialOwner: base.IMaterialOwner;
        /**
        *
        */
        public material: materials.MaterialBase;
        /**
        *
        */
        public getIndexData(): IndexData;
        /**
        *
        */
        public getVertexData(dataType: string): VertexData;
        /**
        *
        */
        public getVertexOffset(dataType: string): number;
        /**
        *
        * @param sourceEntity
        * @param materialOwner
        * @param subGeometry
        * @param animationSubGeometry
        */
        constructor(pool: RenderablePool, sourceEntity: entities.IEntity, materialOwner: base.IMaterialOwner, level?: number, indexOffset?: number);
        public dispose(): void;
        public invalidateGeometry(): void;
        /**
        *
        */
        public invalidateIndexData(): void;
        /**
        * //TODO
        *
        * @param dataType
        */
        public invalidateVertexData(dataType: string): void;
        public _pGetSubGeometry(): base.SubGeometryBase;
        /**
        * //TODO
        *
        * @param subGeometry
        * @param offset
        * @internal
        */
        public _iFillIndexData(indexOffset: number): void;
        public _pGetOverflowRenderable(pool: RenderablePool, materialOwner: base.IMaterialOwner, level: number, indexOffset: number): RenderableBase;
        /**
        * //TODO
        *
        * @private
        */
        private _updateGeometry();
        /**
        * //TODO
        *
        * @private
        */
        private _updateIndexData();
        /**
        * //TODO
        *
        * @param dataType
        * @private
        */
        private _updateVertexData(dataType);
        /**
        * //TODO
        *
        * @param event
        * @private
        */
        private _onIndicesUpdated(event);
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
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.RenderableListItem
    */
    class BillboardRenderable extends RenderableBase {
        private static _materialGeometry;
        /**
        *
        */
        static id: string;
        /**
        *
        */
        private _billboard;
        /**
        * //TODO
        *
        * @param pool
        * @param billboard
        */
        constructor(pool: RenderablePool, billboard: entities.Billboard);
        /**
        * //TODO
        *
        * @returns {away.base.TriangleSubGeometry}
        */
        public _pGetSubGeometry(): base.SubGeometryBase;
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
        public contexts: stagegl.ContextGLBase[];
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
    * @class away.pool.LineSubMeshRenderable
    */
    class LineSubMeshRenderable extends RenderableBase {
        /**
        *
        */
        static id: string;
        /**
        *
        */
        public subMesh: base.LineSubMesh;
        /**
        * //TODO
        *
        * @param pool
        * @param subMesh
        * @param level
        * @param dataOffset
        */
        constructor(pool: RenderablePool, subMesh: base.LineSubMesh, level?: number, indexOffset?: number);
        /**
        * //TODO
        *
        * @returns {base.LineSubGeometry}
        * @protected
        */
        public _pGetSubGeometry(): base.LineSubGeometry;
        /**
        * //TODO
        *
        * @param pool
        * @param materialOwner
        * @param level
        * @param indexOffset
        * @returns {away.pool.LineSubMeshRenderable}
        * @private
        */
        public _pGetOverflowRenderable(pool: RenderablePool, materialOwner: base.IMaterialOwner, level: number, indexOffset: number): RenderableBase;
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    *
    * @class away.pool.ProgramDataBase
    */
    class ProgramData {
        static PROGRAMDATA_ID_COUNT: number;
        private _pool;
        private _key;
        public context: stagegl.ContextGLBase;
        public usages: number;
        public program: stagegl.IProgram;
        public id: number;
        constructor(pool: ProgramDataPool, context: stagegl.ContextGLBase, key: string);
        /**
        *
        */
        public dispose(): void;
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.ProgramDataPool
    */
    class ProgramDataPool {
        private _pool;
        private _context;
        /**
        * //TODO
        *
        * @param textureDataClass
        */
        constructor(context: stagegl.ContextGLBase);
        /**
        * //TODO
        *
        * @param materialOwner
        * @returns ITexture
        */
        public getItem(key: string): ProgramData;
        /**
        * //TODO
        *
        * @param materialOwner
        */
        public disposeItem(key: string): void;
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.SkyboxRenderable
    */
    class SkyboxRenderable extends RenderableBase {
        /**
        *
        */
        static id: string;
        /**
        *
        */
        private static _geometry;
        /**
        * //TODO
        *
        * @param pool
        * @param skybox
        */
        constructor(pool: RenderablePool, skybox: entities.Skybox);
        /**
        * //TODO
        *
        * @returns {away.base.TriangleSubGeometry}
        * @private
        */
        public _pGetSubGeometry(): base.TriangleSubGeometry;
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    *
    * @class away.pool.RenderOrderData
    */
    class RenderOrderData implements IRenderOrderData {
        private _pool;
        public context: stagegl.ContextGLBase;
        public material: materials.MaterialBase;
        public id: number;
        public shaderObjects: ShaderObjectData[];
        public invalid: boolean;
        constructor(pool: RenderOrderDataPool, context: stagegl.ContextGLBase, material: materials.MaterialBase);
        /**
        *
        */
        public dispose(): void;
        /**
        *
        */
        public reset(): void;
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
    * @class away.pool.RenderOrderDataPool
    */
    class RenderOrderDataPool {
        private _pool;
        private _context;
        /**
        * //TODO
        *
        * @param textureDataClass
        */
        constructor(context: stagegl.ContextGLBase);
        /**
        * //TODO
        *
        * @param materialOwner
        * @returns ITexture
        */
        public getItem(material: materials.MaterialBase): RenderOrderData;
        /**
        * //TODO
        *
        * @param materialOwner
        */
        public disposeItem(material: materials.MaterialBase): void;
    }
}
/**
* @module away.pool
*/
declare module away.pool {
    /**
    *
    * @class away.pool.ShaderObjectData
    */
    class ShaderObjectData {
        private _pool;
        public context: stagegl.ContextGLBase;
        public shaderObject: materials.ShaderObjectBase;
        public materialPassVO: materials.MaterialPassVO;
        public programData: ProgramData;
        public shadedTarget: string;
        public vertexCode: string;
        public postAnimationFragmentCode: string;
        public fragmentCode: string;
        public animationVertexCode: string;
        public animationFragmentCode: string;
        public key: string;
        public invalid: boolean;
        constructor(pool: ShaderObjectDataPool, context: stagegl.ContextGLBase, materialPassVO: materials.MaterialPassVO);
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
    * @class away.pool.ShaderObjectDataPool
    */
    class ShaderObjectDataPool {
        private _pool;
        private _context;
        /**
        * //TODO
        *
        * @param textureDataClass
        */
        constructor(context: stagegl.ContextGLBase);
        /**
        * //TODO
        *
        * @param materialOwner
        * @returns ITexture
        */
        public getItem(materialPass: materials.MaterialPassVO): ShaderObjectData;
        /**
        * //TODO
        *
        * @param materialOwner
        */
        public disposeItem(materialPass: materials.MaterialPassVO): void;
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
        private _pool;
        public context: stagegl.ContextGLBase;
        public texture: stagegl.ITextureBase;
        public textureProxy: textures.TextureProxyBase;
        public invalid: boolean;
        constructor(pool: TextureDataPool, context: stagegl.ContextGLBase, textureProxy: textures.TextureProxyBase);
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
        private _context;
        /**
        * //TODO
        *
        * @param textureDataClass
        */
        constructor(context: stagegl.ContextGLBase);
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
* @module away.pool
*/
declare module away.pool {
    /**
    * @class away.pool.TriangleSubMeshRenderable
    */
    class TriangleSubMeshRenderable extends RenderableBase {
        /**
        *
        */
        static id: string;
        /**
        *
        */
        public subMesh: base.TriangleSubMesh;
        /**
        * //TODO
        *
        * @param pool
        * @param subMesh
        * @param level
        * @param indexOffset
        */
        constructor(pool: RenderablePool, subMesh: base.TriangleSubMesh, level?: number, indexOffset?: number);
        /**
        *
        * @returns {away.base.SubGeometryBase}
        * @protected
        */
        public _pGetSubGeometry(): base.TriangleSubGeometry;
        /**
        * //TODO
        *
        * @param pool
        * @param materialOwner
        * @param level
        * @param indexOffset
        * @returns {away.pool.TriangleSubMeshRenderable}
        * @protected
        */
        public _pGetOverflowRenderable(pool: RenderablePool, materialOwner: base.IMaterialOwner, level: number, indexOffset: number): RenderableBase;
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
        public contexts: stagegl.ContextGLBase[];
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
declare module away.stagegl {
    /**
    * Stage provides a proxy class to handle the creation and attachment of the Context
    * (and in turn the back buffer) it uses. Stage should never be created directly,
    * but requested through StageManager.
    *
    * @see away.managers.StageManager
    *
    */
    class ContextGLBase implements display.IContext {
        private _programData;
        private _numUsedStreams;
        private _numUsedTextures;
        public _pContainer: HTMLElement;
        private _texturePool;
        private _renderOrderPool;
        private _shaderObjectDataPool;
        private _programDataPool;
        private _width;
        private _height;
        private _stageIndex;
        private _antiAlias;
        private _enableDepthAndStencil;
        private _renderTarget;
        private _renderSurfaceSelector;
        public container : HTMLElement;
        constructor(stageIndex: number);
        public setRenderTarget(target: textures.TextureProxyBase, enableDepthAndStencil?: boolean, surfaceSelector?: number): void;
        public getRenderTexture(textureProxy: textures.RenderTexture): ITextureBase;
        public getShaderObject(materialPassVO: materials.MaterialPassVO, profile: string): pool.ShaderObjectData;
        public getProgram(shaderObjectData: pool.ShaderObjectData): pool.ProgramData;
        /**
        *
        * @param material
        */
        public getRenderOrderId(material: materials.MaterialBase, profile: string): number;
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
        public activateShaderObject(shaderObjectData: pool.ShaderObjectData, stage: base.Stage, camera: entities.Camera): void;
        public deactivateShaderObject(shaderObjectData: pool.ShaderObjectData, stage: base.Stage): void;
        public activateTexture(index: number, textureProxy: textures.Texture2DBase): void;
        public activateCubeTexture(index: number, textureProxy: textures.CubeTextureBase): void;
        /**
        * Retrieves the VertexBuffer object that contains triangle indices.
        * @param context The ContextWeb for which we request the buffer
        * @return The VertexBuffer object that contains triangle indices.
        */
        public getIndexBuffer(buffer: pool.IndexData): IIndexBuffer;
        public disposeIndexData(buffer: pool.IndexData): void;
        public clear(red?: number, green?: number, blue?: number, alpha?: number, depth?: number, stencil?: number, mask?: number): void;
        public configureBackBuffer(width: number, height: number, antiAlias: number, enableDepthAndStencil?: boolean): void;
        public createIndexBuffer(numIndices: number): IIndexBuffer;
        public createVertexBuffer(numVertices: number, data32PerVertex: number): IVertexBuffer;
        public createTexture(width: number, height: number, format: string, optimizeForRenderToTexture: boolean, streamingLevels?: number): ITexture;
        public createCubeTexture(size: number, format: string, optimizeForRenderToTexture: boolean, streamingLevels?: number): ICubeTexture;
        public createProgram(): IProgram;
        public dispose(): void;
        public present(): void;
        public setRenderToTexture(target: ITextureBase, enableDepthAndStencil?: boolean, antiAlias?: number, surfaceSelector?: number): void;
        public setRenderToBackBuffer(): void;
        public setScissorRectangle(rectangle: geom.Rectangle): void;
        public setTextureAt(sampler: number, texture: ITextureBase): void;
        public setVertexBufferAt(index: number, buffer: IVertexBuffer, bufferOffset?: number, format?: string): void;
        public setProgram(program: IProgram): void;
        public registerProgram(programData: pool.ProgramData): void;
        public unRegisterProgram(programData: pool.ProgramData): void;
        /**
        * test if animation will be able to run on gpu BEFORE compiling materials
        * test if the shader objects supports animating the animation set in the vertex shader
        * if any object using this material fails to support accelerated animations for any of the shader objects,
        * we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)
        */
        private getEnabledGPUAnimation(material, shaderObjects);
        private calcAnimationCode(material, shaderObjectData);
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
    class ContextStage3D extends ContextGLBase implements IContextStageGL {
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
        public _iCallback: (context: IContextStageGL) => void;
        public container : HTMLElement;
        public driverInfo : any;
        public errorCheckingEnabled : boolean;
        constructor(container: HTMLCanvasElement, stageIndex: number, callback: (context: IContextStageGL) => void);
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
    class ContextWebGL extends ContextGLBase implements IContextStageGL {
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
        constructor(canvas: HTMLCanvasElement, stageIndex: number);
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
    interface IContextStageGL extends display.IContext {
        setRenderTarget(target: textures.TextureProxyBase, enableDepthAndStencil?: boolean, surfaceSelector?: number): any;
        getRenderTexture(textureProxy: textures.RenderTexture): ITextureBase;
        activateBuffer(index: number, buffer: pool.VertexData, offset: number, format: string): any;
        disposeVertexData(buffer: pool.VertexData): any;
        activateShaderObject(shaderObject: pool.ShaderObjectData, stage: base.Stage, camera: entities.Camera): any;
        activateRenderTexture(index: number, textureProxy: textures.RenderTexture): any;
        activateTexture(index: number, textureProxy: textures.Texture2DBase): any;
        activateCubeTexture(index: number, textureProxy: textures.CubeTextureBase): any;
        getIndexBuffer(buffer: pool.IndexData): IIndexBuffer;
        getShaderObject(materialPassVO: materials.MaterialPassVO, profile: string): pool.ShaderObjectData;
        getRenderOrderId(material: materials.MaterialBase, profile: string): number;
        disposeIndexData(buffer: pool.IndexData): any;
        clear(red?: number, green?: number, blue?: number, alpha?: number, depth?: number, stencil?: number, mask?: number): any;
        configureBackBuffer(width: number, height: number, antiAlias: number, enableDepthAndStencil?: boolean): any;
        createCubeTexture(size: number, format: string, optimizeForRenderToTexture: boolean, streamingLevels?: number): ICubeTexture;
        createIndexBuffer(numIndices: number): IIndexBuffer;
        createProgram(): IProgram;
        createTexture(width: number, height: number, format: string, optimizeForRenderToTexture: boolean, streamingLevels?: number): ITexture;
        createVertexBuffer(numVertices: number, data32PerVertex: number): IVertexBuffer;
        deactivateShaderObject(shaderObject: pool.ShaderObjectData, stage: base.Stage): any;
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
        public upload(vertexProgram: utils.ByteArray, fragmentProgram: utils.ByteArray): void;
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
declare module away.managers {
    class AGALProgramCache {
        private static _instances;
        private _stage;
        private _program3Ds;
        private _ids;
        private _usages;
        private _keys;
        private _onContextGLDisposedDelegate;
        private static _currentId;
        constructor(stage: base.Stage, agalProgramCacheSingletonEnforcer: AGALProgramCacheSingletonEnforcer);
        static getInstance(stage: base.Stage): AGALProgramCache;
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
        private _stage;
        private _viewWidth;
        private _viewHeight;
        private _textureWidth;
        private _textureHeight;
        private _renderToTextureRect;
        private _buffersInvalid;
        private _textureRatioX;
        private _textureRatioY;
        constructor(se: SingletonEnforcer, stage: base.Stage);
        static getInstance(stage: base.Stage): RTTBufferManager;
        private static getRTTBufferManagerFromStage(stage);
        private static deleteRTTBufferManager(stage);
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
declare module away.materials {
    /**
    * ShaderObjectBase keeps track of the number of dependencies for "named registers" used across a pass.
    * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
    * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
    * each time a method has been compiled into the shader.
    *
    * @see RegisterPool.addUsage
    */
    class ShaderObjectBase {
        public _pInverseSceneMatrix: number[];
        public animationRegisterCache: animators.AnimationRegisterCache;
        public profile: string;
        /**
        * The amount of used vertex constants in the vertex code. Used by the animation code generation to know from which index on registers are available.
        */
        public numUsedVertexConstants: number;
        /**
        * The amount of used fragment constants in the fragment code. Used by the animation code generation to know from which index on registers are available.
        */
        public numUsedFragmentConstants: number;
        /**
        * The amount of used vertex streams in the vertex code. Used by the animation code generation to know from which index on streams are available.
        */
        public numUsedStreams: number;
        /**
        *
        */
        public numUsedTextures: number;
        /**
        *
        */
        public numUsedVaryings: number;
        public animatableAttributes: string[];
        public animationTargetRegisters: string[];
        public uvSource: string;
        public uvTarget: string;
        public useAlphaPremultiplied: boolean;
        public useBothSides: boolean;
        public useMipmapping: boolean;
        public useSmoothTextures: boolean;
        public repeatTextures: boolean;
        public usesAnimation: boolean;
        public usesUVTransform: boolean;
        public alphaThreshold: number;
        public ambientR: number;
        public ambientG: number;
        public ambientB: number;
        /**
        * Indicates whether the pass requires any fragment animation code.
        */
        public usesFragmentAnimation: boolean;
        /**
        * The amount of dependencies on the projected position.
        */
        public projectionDependencies: number;
        /**
        * The amount of dependencies on the normal vector.
        */
        public normalDependencies: number;
        /**
        * The amount of dependencies on the view direction.
        */
        public viewDirDependencies: number;
        /**
        * The amount of dependencies on the primary UV coordinates.
        */
        public uvDependencies: number;
        /**
        * The amount of dependencies on the secondary UV coordinates.
        */
        public secondaryUVDependencies: number;
        /**
        * The amount of dependencies on the local position. This can be 0 while hasGlobalPosDependencies is true when
        * the global position is used as a temporary value (fe to calculate the view direction)
        */
        public localPosDependencies: number;
        /**
        * The amount of dependencies on the global position. This can be 0 while hasGlobalPosDependencies is true when
        * the global position is used as a temporary value (fe to calculate the view direction)
        */
        public globalPosDependencies: number;
        /**
        * The amount of tangent vector dependencies (fragment shader).
        */
        public tangentDependencies: number;
        /**
        *
        */
        public outputsNormals: boolean;
        /**
        * Indicates whether or not normal calculations are expected in tangent space. This is only the case if no world-space
        * dependencies exist.
        */
        public usesTangentSpace: boolean;
        /**
        * Indicates whether or not normal calculations are output in tangent space.
        */
        public outputsTangentNormals: boolean;
        /**
        * Indicates whether there are any dependencies on the world-space position vector.
        */
        public usesGlobalPosFragment: boolean;
        public vertexConstantData: number[];
        public fragmentConstantData: number[];
        /**
        * The index for the common data register.
        */
        public commonsDataIndex: number;
        /**
        * The index for the UV vertex attribute stream.
        */
        public uvBufferIndex: number;
        /**
        * The index for the secondary UV vertex attribute stream.
        */
        public secondaryUVBufferIndex: number;
        /**
        * The index for the vertex normal attribute stream.
        */
        public normalBufferIndex: number;
        /**
        * The index for the vertex tangent attribute stream.
        */
        public tangentBufferIndex: number;
        /**
        * The index of the vertex constant containing the view matrix.
        */
        public viewMatrixIndex: number;
        /**
        * The index of the vertex constant containing the scene matrix.
        */
        public sceneMatrixIndex: number;
        /**
        * The index of the vertex constant containing the uniform scene matrix (the inverse transpose).
        */
        public sceneNormalMatrixIndex: number;
        /**
        * The index of the vertex constant containing the camera position.
        */
        public cameraPositionIndex: number;
        /**
        * The index for the UV transformation matrix vertex constant.
        */
        public uvTransformIndex: number;
        /**
        * Creates a new MethodCompilerVO object.
        */
        constructor(profile: any);
        /**
        * Factory method to create a concrete compiler object for this object
        *
        * @param materialPassVO
        * @returns {away.materials.ShaderCompilerBase}
        */
        public createCompiler(materialPassVO: MaterialPassVO): ShaderCompilerBase;
        /**
        * Clears dependency counts for all registers. Called when recompiling a pass.
        */
        public reset(): void;
        /**
        * Adds any external world space dependencies, used to force world space calculations.
        */
        public addWorldSpaceDependencies(fragmentLights: boolean): void;
        public pInitRegisterIndices(): void;
        /**
        * Initializes the unchanging constant data for this shader object.
        */
        public initConstantData(registerCache: ShaderRegisterCache, animatableAttributes: string[], animationTargetRegisters: string[], uvSource: string, uvTarget: string): void;
        /**
        * @inheritDoc
        */
        public iActivate(stage: base.Stage, camera: entities.Camera): void;
        /**
        * @inheritDoc
        */
        public iDeactivate(stage: base.Stage): void;
        /**
        *
        *
        * @param renderable
        * @param stage
        * @param camera
        */
        public setRenderState(renderable: pool.RenderableBase, stage: base.Stage, camera: entities.Camera, viewProjection: geom.Matrix3D): void;
        public dispose(): void;
    }
}
declare module away.materials {
    /**
    * ShaderObjectBase keeps track of the number of dependencies for "named registers" used across a pass.
    * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
    * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
    * each time a method has been compiled into the shader.
    *
    * @see RegisterPool.addUsage
    */
    class ShaderLightingObject extends ShaderObjectBase {
        /**
        * The first index for the fragment constants containing the light data.
        */
        public lightFragmentConstantIndex: number;
        /**
        * The starting index if the vertex constant to which light data needs to be uploaded.
        */
        public lightVertexConstantIndex: number;
        /**
        * Indices for the light probe diffuse textures.
        */
        public lightProbeDiffuseIndices: number[];
        /**
        * Indices for the light probe specular textures.
        */
        public lightProbeSpecularIndices: number[];
        /**
        * The index of the fragment constant containing the weights for the light probes.
        */
        public probeWeightsIndex: number;
        public numLights: number;
        public usesLightFallOff: boolean;
        public usesShadows: boolean;
        public numPointLights: number;
        public numDirectionalLights: number;
        public numLightProbes: number;
        public pointLightsOffset: number;
        public directionalLightsOffset: number;
        public lightProbesOffset: number;
        public lightPicker: LightPickerBase;
        /**
        * Indicates whether the shader uses any lights.
        */
        public usesLights: boolean;
        /**
        * Indicates whether the shader uses any light probes.
        */
        public usesProbes: boolean;
        /**
        * Indicates whether the lights uses any specular components.
        */
        public usesLightsForSpecular: boolean;
        /**
        * Indicates whether the probes uses any specular components.
        */
        public usesProbesForSpecular: boolean;
        /**
        * Indicates whether the lights uses any diffuse components.
        */
        public usesLightsForDiffuse: boolean;
        /**
        * Indicates whether the probes uses any diffuse components.
        */
        public usesProbesForDiffuse: boolean;
        /**
        * Creates a new MethodCompilerVO object.
        */
        constructor(profile: any);
        /**
        * Factory method to create a concrete compiler object for this object
        *
        * @param materialPassVO
        * @returns {away.materials.ShaderLightingCompiler}
        */
        public createCompiler(materialPassVO: MaterialPassVO): ShaderCompilerBase;
        /**
        * Clears dependency counts for all registers. Called when recompiling a pass.
        */
        public reset(): void;
        /**
        * Adds any external world space dependencies, used to force world space calculations.
        */
        public addWorldSpaceDependencies(fragmentLights: boolean): void;
        /**
        *
        *
        * @param renderable
        * @param stage
        * @param camera
        */
        public setRenderState(renderable: pool.RenderableBase, stage: base.Stage, camera: entities.Camera, viewProjection: geom.Matrix3D): void;
        /**
        * Updates constant data render state used by the lights. This method is optional for subclasses to implement.
        */
        private updateLights();
        /**
        * Updates constant data render state used by the light probes. This method is optional for subclasses to implement.
        */
        private updateProbes(stage);
    }
}
declare module away.materials {
    /**
    * MethodVO contains data for a given shader object for the use within a single material.
    * This allows shader methods to be shared across materials while their non-public state differs.
    */
    class MethodVO {
        public useMethod: boolean;
        public method: ShadingMethodBase;
        public texturesIndex: number;
        public secondaryTexturesIndex: number;
        public vertexConstantsIndex: number;
        public secondaryVertexConstantsIndex: number;
        public fragmentConstantsIndex: number;
        public secondaryFragmentConstantsIndex: number;
        public needsProjection: boolean;
        public needsView: boolean;
        public needsNormals: boolean;
        public needsTangents: boolean;
        public needsUV: boolean;
        public needsSecondaryUV: boolean;
        public needsGlobalVertexPos: boolean;
        public needsGlobalFragmentPos: boolean;
        /**
        * Creates a new MethodVO object.
        */
        constructor(method: ShadingMethodBase);
        /**
        * Resets the values of the value object to their "unused" state.
        */
        public reset(): void;
    }
}
declare module away.materials {
    /**
    * RegisterPool is used by the shader compilation process to keep track of which registers of a certain type are
    * currently used and should not be allowed to be written to. Either entire registers can be requested and locked,
    * or single components (x, y, z, w) of a single register.
    * It is used by ShaderRegisterCache to track usages of individual register types.
    *
    * @see away.materials.ShaderRegisterCache
    */
    class RegisterPool {
        private static _regPool;
        private static _regCompsPool;
        private _vectorRegisters;
        private _registerComponents;
        private _regName;
        private _usedSingleCount;
        private _usedVectorCount;
        private _regCount;
        private _persistent;
        /**
        * Creates a new RegisterPool object.
        * @param regName The base name of the register type ("ft" for fragment temporaries, "vc" for vertex constants, etc)
        * @param regCount The amount of available registers of this type.
        * @param persistent Whether or not registers, once reserved, can be freed again. For example, temporaries are not persistent, but constants are.
        */
        constructor(regName: string, regCount: number, persistent?: boolean);
        /**
        * Retrieve an entire vector register that's still available.
        */
        public requestFreeVectorReg(): ShaderRegisterElement;
        /**
        * Retrieve a single vector component that's still available.
        */
        public requestFreeRegComponent(): ShaderRegisterElement;
        /**
        * Marks a register as used, so it cannot be retrieved. The register won't be able to be used until removeUsage
        * has been called usageCount times again.
        * @param register The register to mark as used.
        * @param usageCount The amount of usages to add.
        */
        public addUsage(register: ShaderRegisterElement, usageCount: number): void;
        /**
        * Removes a usage from a register. When usages reach 0, the register is freed again.
        * @param register The register for which to remove a usage.
        */
        public removeUsage(register: ShaderRegisterElement): void;
        /**
        * Disposes any resources used by the current RegisterPool object.
        */
        public dispose(): void;
        /**
        * Indicates whether or not any registers are in use.
        */
        public hasRegisteredRegs(): boolean;
        /**
        * Initializes all registers.
        */
        private initRegisters(regName, regCount);
        private static _initPool(regName, regCount);
        /**
        * Check if the temp register is either used for single or vector use
        */
        private isRegisterUsed(index);
        private _initArray(a, val);
    }
}
declare module away.materials {
    /**
    * ShaderRegister Cache provides the usage management system for all registers during shading compilation.
    */
    class ShaderRegisterCache {
        private _fragmentTempCache;
        private _vertexTempCache;
        private _varyingCache;
        private _fragmentConstantsCache;
        private _vertexConstantsCache;
        private _textureCache;
        private _vertexAttributesCache;
        private _vertexConstantOffset;
        private _vertexAttributesOffset;
        private _varyingsOffset;
        private _fragmentConstantOffset;
        private _fragmentOutputRegister;
        private _vertexOutputRegister;
        private _numUsedVertexConstants;
        private _numUsedFragmentConstants;
        private _numUsedStreams;
        private _numUsedTextures;
        private _numUsedVaryings;
        private _profile;
        /**
        * Create a new ShaderRegisterCache object.
        *
        * @param profile The compatibility profile used by the renderer.
        */
        constructor(profile: string);
        /**
        * Resets all registers.
        */
        public reset(): void;
        /**
        * Disposes all resources used.
        */
        public dispose(): void;
        /**
        * Marks a fragment temporary register as used, so it cannot be retrieved. The register won't be able to be used until removeUsage
        * has been called usageCount times again.
        * @param register The register to mark as used.
        * @param usageCount The amount of usages to add.
        */
        public addFragmentTempUsages(register: ShaderRegisterElement, usageCount: number): void;
        /**
        * Removes a usage from a fragment temporary register. When usages reach 0, the register is freed again.
        * @param register The register for which to remove a usage.
        */
        public removeFragmentTempUsage(register: ShaderRegisterElement): void;
        /**
        * Marks a vertex temporary register as used, so it cannot be retrieved. The register won't be able to be used
        * until removeUsage has been called usageCount times again.
        * @param register The register to mark as used.
        * @param usageCount The amount of usages to add.
        */
        public addVertexTempUsages(register: ShaderRegisterElement, usageCount: number): void;
        /**
        * Removes a usage from a vertex temporary register. When usages reach 0, the register is freed again.
        * @param register The register for which to remove a usage.
        */
        public removeVertexTempUsage(register: ShaderRegisterElement): void;
        /**
        * Retrieve an entire fragment temporary register that's still available. The register won't be able to be used until removeUsage
        * has been called usageCount times again.
        */
        public getFreeFragmentVectorTemp(): ShaderRegisterElement;
        /**
        * Retrieve a single component from a fragment temporary register that's still available.
        */
        public getFreeFragmentSingleTemp(): ShaderRegisterElement;
        /**
        * Retrieve an available varying register
        */
        public getFreeVarying(): ShaderRegisterElement;
        /**
        * Retrieve an available fragment constant register
        */
        public getFreeFragmentConstant(): ShaderRegisterElement;
        /**
        * Retrieve an available vertex constant register
        */
        public getFreeVertexConstant(): ShaderRegisterElement;
        /**
        * Retrieve an entire vertex temporary register that's still available.
        */
        public getFreeVertexVectorTemp(): ShaderRegisterElement;
        /**
        * Retrieve a single component from a vertex temporary register that's still available.
        */
        public getFreeVertexSingleTemp(): ShaderRegisterElement;
        /**
        * Retrieve an available vertex attribute register
        */
        public getFreeVertexAttribute(): ShaderRegisterElement;
        /**
        * Retrieve an available texture register
        */
        public getFreeTextureReg(): ShaderRegisterElement;
        /**
        * Indicates the start index from which to retrieve vertex constants.
        */
        public vertexConstantOffset : number;
        /**
        * Indicates the start index from which to retrieve vertex attributes.
        */
        public vertexAttributesOffset : number;
        /**
        * Indicates the start index from which to retrieve varying registers.
        */
        public varyingsOffset : number;
        /**
        * Indicates the start index from which to retrieve fragment constants.
        */
        public fragmentConstantOffset : number;
        /**
        * The fragment output register.
        */
        public fragmentOutputRegister : ShaderRegisterElement;
        /**
        * The amount of used vertex constant registers.
        */
        public numUsedVertexConstants : number;
        /**
        * The amount of used fragment constant registers.
        */
        public numUsedFragmentConstants : number;
        /**
        * The amount of used vertex streams.
        */
        public numUsedStreams : number;
        /**
        * The amount of used texture slots.
        */
        public numUsedTextures : number;
        /**
        * The amount of used varying registers.
        */
        public numUsedVaryings : number;
    }
}
declare module away.materials {
    /**
    * A single register element (an entire register or a single register's component) used by the RegisterPool.
    */
    class ShaderRegisterElement {
        private _regName;
        private _index;
        private _toStr;
        private static COMPONENTS;
        public _component: number;
        /**
        * Creates a new ShaderRegisterElement object.
        *
        * @param regName The name of the register.
        * @param index The index of the register.
        * @param component The register's component, if not the entire register is represented.
        */
        constructor(regName: string, index: number, component?: number);
        /**
        * Converts the register or the components AGAL string representation.
        */
        public toString(): string;
        /**
        * The register's name.
        */
        public regName : string;
        /**
        * The register's index.
        */
        public index : number;
    }
}
declare module away.materials {
    /**
    * ShaderCompilerBase is an abstract base class for shader compilers that use modular shader methods to assemble a
    * material. Concrete subclasses are used by the default materials.
    *
    * @see away.materials.ShadingMethodBase
    */
    class ShaderCompilerBase {
        public _pShaderObject: ShaderObjectBase;
        public _pSharedRegisters: ShaderRegisterData;
        public _pRegisterCache: ShaderRegisterCache;
        public _pMaterialPass: IMaterialPassStageGL;
        public _pMaterial: MaterialBase;
        public _pVertexCode: string;
        public _pFragmentCode: string;
        public _pPostAnimationFragmentCode: string;
        public _pAnimatableAttributes: string[];
        public _pAnimationTargetRegisters: string[];
        private _uvTarget;
        private _uvSource;
        public _pProfile: string;
        /**
        * Creates a new ShaderCompilerBase object.
        * @param profile The compatibility profile of the renderer.
        */
        constructor(materialPassVO: MaterialPassVO, shaderObject: ShaderObjectBase);
        /**
        * Compiles the code after all setup on the compiler has finished.
        */
        public compile(): void;
        /**
        * Compile the code for the methods.
        */
        public pCompileDependencies(): void;
        private compileGlobalPositionCode();
        /**
        * Calculate the (possibly animated) UV coordinates.
        */
        private compileUVCode();
        /**
        * Provide the secondary UV coordinates.
        */
        private compileSecondaryUVCode();
        /**
        * Calculate the view direction.
        */
        public compileViewDirCode(): void;
        /**
        * Calculate the normal.
        */
        public compileNormalCode(): void;
        /**
        * Reset all the indices to "unused".
        */
        public pInitRegisterIndices(): void;
        /**
        * Figure out which named registers are required, and how often.
        */
        public pCalculateDependencies(): void;
        /**
        * Disposes all resources used by the compiler.
        */
        public dispose(): void;
        /**
        * The generated vertex code.
        */
        public vertexCode : string;
        /**
        * The generated fragment code.
        */
        public fragmentCode : string;
        /**
        * The generated fragment code.
        */
        public postAnimationFragmentCode : string;
        /**
        * The register name containing the final shaded colour.
        */
        public shadedTarget : string;
    }
}
declare module away.materials {
    /**
    * ShaderCompilerBase is an abstract base class for shader compilers that use modular shader methods to assemble a
    * material. Concrete subclasses are used by the default materials.
    *
    * @see away.materials.ShadingMethodBase
    */
    class ShaderLightingCompiler extends ShaderCompilerBase {
        private _materialLightingPass;
        private _shaderLightingObject;
        public _pointLightFragmentConstants: ShaderRegisterElement[];
        public _pointLightVertexConstants: ShaderRegisterElement[];
        public _dirLightFragmentConstants: ShaderRegisterElement[];
        public _dirLightVertexConstants: ShaderRegisterElement[];
        public _pNumProbeRegisters: number;
        /**
        * Creates a new ShaderCompilerBase object.
        * @param profile The compatibility profile of the renderer.
        */
        constructor(materialPassVO: MaterialPassVO, shaderObject: ShaderLightingObject);
        /**
        * Compile the code for the methods.
        */
        public pCompileDependencies(): void;
        /**
        * Provides the code to provide shadow mapping.
        */
        public pCompileShadowCode(): void;
        /**
        * Initializes constant registers to contain light data.
        */
        private initLightRegisters();
        /**
        * Compiles the shading code for directional and point lights.
        */
        private compileLightCode();
        /**
        * Compiles shading code for light probes.
        */
        private compileLightProbeCode();
        /**
        * Reset all the indices to "unused".
        */
        public pInitRegisterIndices(): void;
        /**
        * Figure out which named registers are required, and how often.
        */
        public pCalculateDependencies(): void;
    }
}
declare module away.materials {
    /**
    * ShaderRegisterData contains the "named" registers, generated by the compiler and to be passed on to the methods.
    */
    class ShaderRegisterData {
        public normalVarying: ShaderRegisterElement;
        public tangentVarying: ShaderRegisterElement;
        public bitangentVarying: ShaderRegisterElement;
        public uvVarying: ShaderRegisterElement;
        public secondaryUVVarying: ShaderRegisterElement;
        public viewDirVarying: ShaderRegisterElement;
        public shadowTarget: ShaderRegisterElement;
        public shadedTarget: ShaderRegisterElement;
        public globalPositionVertex: ShaderRegisterElement;
        public globalPositionVarying: ShaderRegisterElement;
        public localPosition: ShaderRegisterElement;
        public normalInput: ShaderRegisterElement;
        public tangentInput: ShaderRegisterElement;
        public animatedNormal: ShaderRegisterElement;
        public animatedTangent: ShaderRegisterElement;
        public commons: ShaderRegisterElement;
        public projectionFragment: ShaderRegisterElement;
        public normalFragment: ShaderRegisterElement;
        public viewDirFragment: ShaderRegisterElement;
        public bitangent: ShaderRegisterElement;
        constructor();
    }
}
declare module away.materials {
    /**
    * ShadingMethodBase provides an abstract base method for shading methods, used by compiled passes to compile
    * the final shading program.
    */
    class ShadingMethodBase extends library.NamedAssetBase {
        public _passes: MaterialPassBase[];
        /**
        * Create a new ShadingMethodBase object.
        */
        constructor();
        public iIsUsed(shaderObject: ShaderObjectBase): boolean;
        /**
        * Initializes the properties for a MethodVO, including register and texture indices.
        *
        * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
        *
        * @internal
        */
        public iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
        /**
        * Initializes unchanging shader constants using the data from a MethodVO.
        *
        * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
        *
        * @internal
        */
        public iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
        /**
        * Indicates whether or not this method expects normals in tangent space. Override for object-space normals.
        */
        public iUsesTangentSpace(): boolean;
        /**
        * Any passes required that render to a texture used by this method.
        */
        public passes : MaterialPassBase[];
        /**
        * Cleans up any resources used by the current object.
        */
        public dispose(): void;
        /**
        * Resets the compilation state of the method.
        *
        * @internal
        */
        public iReset(): void;
        /**
        * Resets the method's state for compilation.
        *
        * @internal
        */
        public iCleanCompilationData(): void;
        /**
        * Get the vertex shader code for this method.
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param regCache The register cache used during the compilation.
        *
        * @internal
        */
        public iGetVertexCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * Sets the render state for this method.
        *
        * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
        * @param stage The Stage object currently used for rendering.
        *
        * @internal
        */
        public iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: base.Stage): void;
        /**
        * Sets the render state for a single renderable.
        *
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param renderable The renderable currently being rendered.
        * @param stage The Stage object currently used for rendering.
        * @param camera The camera from which the scene is currently rendered.
        *
        * @internal
        */
        public iSetRenderState(shaderObject: ShaderObjectBase, methodVO: MethodVO, renderable: pool.RenderableBase, stage: base.Stage, camera: entities.Camera): void;
        /**
        * Clears the render state for this method.
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param stage The Stage object currently used for rendering.
        *
        * @internal
        */
        public iDeactivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: base.Stage): void;
        /**
        * Marks the shader program as invalid, so it will be recompiled before the next render.
        *
        * @internal
        */
        public iInvalidateShaderProgram(): void;
        /**
        * Copies the state from a ShadingMethodBase object into the current object.
        */
        public copyFrom(method: ShadingMethodBase): void;
    }
}
declare module away.materials {
    /**
    * LightingMethodBase provides an abstract base method for shading methods that uses lights.
    * Used for diffuse and specular shaders only.
    */
    class LightingMethodBase extends ShadingMethodBase {
        /**
        * A method that is exposed to wrappers in case the strength needs to be controlled
        */
        public _iModulateMethod: (shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData) => string;
        /**
        * Creates a new LightingMethodBase.
        */
        constructor();
        /**
        * Get the fragment shader code that will be needed before any per-light code is added.
        * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
        * @param regCache The register cache used during the compilation.
        * @private
        */
        public iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * Get the fragment shader code that will generate the code relevant to a single light.
        *
        * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
        * @param lightDirReg The register containing the light direction vector.
        * @param lightColReg The register containing the light colour.
        * @param regCache The register cache used during the compilation.
        */
        public iGetFragmentCodePerLight(shaderObject: ShaderLightingObject, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * Get the fragment shader code that will generate the code relevant to a single light probe object.
        *
        * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
        * @param cubeMapReg The register containing the cube map for the current probe
        * @param weightRegister A string representation of the register + component containing the current weight
        * @param regCache The register cache providing any necessary registers to the shader
        */
        public iGetFragmentCodePerProbe(shaderObject: ShaderLightingObject, methodVO: MethodVO, cubeMapReg: ShaderRegisterElement, weightRegister: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * Get the fragment shader code that should be added after all per-light code. Usually composits everything to the target register.
        *
        * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
        * @param regCache The register cache used during the compilation.
        * @param targetReg The register containing the final shading output.
        * @private
        */
        public iGetFragmentPostLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    }
}
declare module away.materials {
    /**
    * AmbientBasicMethod provides the default shading method for uniform ambient lighting.
    */
    class AmbientBasicMethod extends ShadingMethodBase {
        private _useTexture;
        private _texture;
        private _color;
        private _alpha;
        private _colorR;
        private _colorG;
        private _colorB;
        private _ambient;
        /**
        * Creates a new AmbientBasicMethod object.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
        /**
        * The strength of the ambient reflection of the surface.
        */
        public ambient : number;
        /**
        * The colour of the ambient reflection of the surface.
        */
        public color : number;
        /**
        * The alpha component of the surface.
        */
        public alpha : number;
        /**
        * The bitmapData to use to define the diffuse reflection color per texel.
        */
        public texture : textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        public copyFrom(method: ShadingMethodBase): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: base.Stage): void;
        /**
        * Updates the ambient color data used by the render state.
        */
        private updateColor();
    }
}
declare module away.materials {
    /**
    * DiffuseBasicMethod provides the default shading method for Lambert (dot3) diffuse lighting.
    */
    class DiffuseBasicMethod extends LightingMethodBase {
        private _multiply;
        public _pUseTexture: boolean;
        public _pTotalLightColorReg: ShaderRegisterElement;
        public _pDiffuseInputRegister: ShaderRegisterElement;
        private _texture;
        private _diffuseColor;
        private _ambientColor;
        private _diffuseR;
        private _diffuseG;
        private _diffuseB;
        private _ambientR;
        private _ambientG;
        private _ambientB;
        public _pIsFirstLight: boolean;
        /**
        * Creates a new DiffuseBasicMethod object.
        */
        constructor();
        public iIsUsed(shaderObject: ShaderLightingObject): boolean;
        /**
        * Set internally if diffuse color component multiplies or replaces the ambient color
        */
        public multiply : boolean;
        public iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
        /**
        * Forces the creation of the texture.
        * @param stage The Stage used by the renderer
        */
        public generateMip(stage: base.Stage): void;
        /**
        * The color of the diffuse reflection when not using a texture.
        */
        public diffuseColor : number;
        /**
        * The color of the ambient reflection
        */
        public ambientColor : number;
        /**
        * The bitmapData to use to define the diffuse reflection color per texel.
        */
        public texture : textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        * @inheritDoc
        */
        public copyFrom(method: ShadingMethodBase): void;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerLight(shaderObject: ShaderLightingObject, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerProbe(shaderObject: ShaderLightingObject, methodVO: MethodVO, cubeMapReg: ShaderRegisterElement, weightRegister: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentPostLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * Generate the code that applies the calculated shadow to the diffuse light
        * @param methodVO The MethodVO object for which the compilation is currently happening.
        * @param regCache The register cache the compiler is currently using for the register management.
        */
        public pApplyShadow(shaderObject: ShaderLightingObject, methodVO: MethodVO, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: base.Stage): void;
        /**
        * Updates the diffuse color data used by the render state.
        */
        private updateDiffuse();
        /**
        * Updates the ambient color data used by the render state.
        */
        private updateAmbient();
        /**
        * @inheritDoc
        */
        public iSetRenderState(shaderObject: ShaderLightingObject, methodVO: MethodVO, renderable: pool.RenderableBase, stage: base.Stage, camera: entities.Camera): void;
    }
}
declare module away.materials {
    /**
    * EffectMethodBase forms an abstract base class for shader methods that are not dependent on light sources,
    * and are in essence post-process effects on the materials.
    */
    class EffectMethodBase extends ShadingMethodBase implements library.IAsset {
        constructor();
        /**
        * @inheritDoc
        */
        public assetType : string;
        /**
        * Get the fragment shader code that should be added after all per-light code. Usually composits everything to the target register.
        * @param methodVO The MethodVO object containing the method data for the currently compiled material pass.
        * @param regCache The register cache used during the compilation.
        * @param targetReg The register that will be containing the method's output.
        * @private
        */
        public iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    }
}
declare module away.materials {
    /**
    * EffectColorTransformMethod provides a shading method that changes the colour of a material analogous to a
    * ColorTransform object.
    */
    class EffectColorTransformMethod extends EffectMethodBase {
        private _colorTransform;
        /**
        * Creates a new EffectColorTransformMethod.
        */
        constructor();
        /**
        * The ColorTransform object to transform the colour of the material with.
        */
        public colorTransform : geom.ColorTransform;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: base.Stage): void;
    }
}
declare module away.materials {
    /**
    * NormalBasicMethod is the default method for standard tangent-space normal mapping.
    */
    class NormalBasicMethod extends ShadingMethodBase {
        private _texture;
        private _useTexture;
        public _pNormalTextureRegister: ShaderRegisterElement;
        /**
        * Creates a new NormalBasicMethod object.
        */
        constructor();
        public iIsUsed(shaderObject: ShaderObjectBase): boolean;
        /**
        * @inheritDoc
        */
        public iInitVO(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
        /**
        * Indicates whether or not this method outputs normals in tangent space. Override for object-space normals.
        */
        public iOutputsTangentNormals(): boolean;
        /**
        * @inheritDoc
        */
        public copyFrom(method: ShadingMethodBase): void;
        /**
        * The texture containing the normals per pixel.
        */
        public normalMap : textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        * @inheritDoc
        */
        public iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: base.Stage): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    }
}
declare module away.materials {
    /**
    * ShadowMapMethodBase provides an abstract base method for shadow map methods.
    */
    class ShadowMapMethodBase extends ShadingMethodBase implements library.IAsset {
        public _pCastingLight: base.LightBase;
        public _pShadowMapper: ShadowMapperBase;
        public _pEpsilon: number;
        public _pAlpha: number;
        /**
        * Creates a new ShadowMapMethodBase object.
        * @param castingLight The light used to cast shadows.
        */
        constructor(castingLight: base.LightBase);
        /**
        * @inheritDoc
        */
        public assetType : string;
        /**
        * The "transparency" of the shadows. This allows making shadows less strong.
        */
        public alpha : number;
        /**
        * The light casting the shadows.
        */
        public castingLight : base.LightBase;
        /**
        * A small value to counter floating point precision errors when comparing values in the shadow map with the
        * calculated depth value. Increase this if shadow banding occurs, decrease it if the shadow seems to be too detached.
        */
        public epsilon : number;
    }
}
declare module away.materials {
    /**
    * ShadowMethodBase provides an abstract method for simple (non-wrapping) shadow map methods.
    */
    class ShadowMethodBase extends ShadowMapMethodBase {
        public _pDepthMapCoordReg: ShaderRegisterElement;
        public _pUsePoint: boolean;
        /**
        * Creates a new ShadowMethodBase object.
        * @param castingLight The light used to cast shadows.
        */
        constructor(castingLight: base.LightBase);
        /**
        * @inheritDoc
        */
        public iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
        /**
        * @inheritDoc
        */
        public iInitConstants(shaderObject: ShaderObjectBase, methodVO: MethodVO): void;
        /**
        * Wrappers that override the vertex shader need to set this explicitly
        */
        public _iDepthMapCoordReg : ShaderRegisterElement;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public iGetVertexCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * Gets the vertex code for shadow mapping with a point light.
        *
        * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
        * @param regCache The register cache used during the compilation.
        */
        public _pGetPointVertexCode(methodVO: MethodVO, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * Gets the vertex code for shadow mapping with a planar shadow map (fe: directional lights).
        *
        * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
        * @param regCache The register cache used during the compilation.
        */
        public pGetPlanarVertexCode(methodVO: MethodVO, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * Gets the fragment code for shadow mapping with a planar shadow map.
        * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
        * @param regCache The register cache used during the compilation.
        * @param targetReg The register to contain the shadow coverage
        * @return
        */
        public _pGetPlanarFragmentCode(methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * Gets the fragment code for shadow mapping with a point light.
        * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
        * @param regCache The register cache used during the compilation.
        * @param targetReg The register to contain the shadow coverage
        * @return
        */
        public _pGetPointFragmentCode(methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public iSetRenderState(shaderObject: ShaderObjectBase, methodVO: MethodVO, renderable: pool.RenderableBase, stage: base.Stage, camera: entities.Camera): void;
        /**
        * Gets the fragment code for combining this method with a cascaded shadow map method.
        * @param methodVO The MethodVO object linking this method with the pass currently being compiled.
        * @param regCache The register cache used during the compilation.
        * @param decodeRegister The register containing the data to decode the shadow map depth value.
        * @param depthTexture The texture containing the shadow map.
        * @param depthProjection The projection of the fragment relative to the light.
        * @param targetRegister The register to contain the shadow coverage
        * @return
        */
        public _iGetCascadeFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, decodeRegister: ShaderRegisterElement, depthTexture: ShaderRegisterElement, depthProjection: ShaderRegisterElement, targetRegister: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public iActivate(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: base.Stage): void;
        /**
        * Sets the method state for cascade shadow mapping.
        */
        public iActivateForCascade(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: base.Stage): void;
    }
}
declare module away.materials {
    /**
    * ShadowHardMethod provides the cheapest shadow map method by using a single tap without any filtering.
    */
    class ShadowHardMethod extends ShadowMethodBase {
        /**
        * Creates a new ShadowHardMethod object.
        */
        constructor(castingLight: base.LightBase);
        /**
        * @inheritDoc
        */
        public _pGetPlanarFragmentCode(methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public _pGetPointFragmentCode(methodVO: MethodVO, targetReg: ShaderRegisterElement, regCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public _iGetCascadeFragmentCode(shaderObject: ShaderObjectBase, methodVO: MethodVO, decodeRegister: ShaderRegisterElement, depthTexture: ShaderRegisterElement, depthProjection: ShaderRegisterElement, targetRegister: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public iActivateForCascade(shaderObject: ShaderObjectBase, methodVO: MethodVO, stage: base.Stage): void;
    }
}
declare module away.materials {
    /**
    * SpecularBasicMethod provides the default shading method for Blinn-Phong specular highlights (an optimized but approximated
    * version of Phong specularity).
    */
    class SpecularBasicMethod extends LightingMethodBase {
        public _pUseTexture: boolean;
        public _pTotalLightColorReg: ShaderRegisterElement;
        public _pSpecularTextureRegister: ShaderRegisterElement;
        public _pSpecularTexData: ShaderRegisterElement;
        public _pSpecularDataRegister: ShaderRegisterElement;
        private _texture;
        private _gloss;
        private _specular;
        private _specularColor;
        public _iSpecularR: number;
        public _iSpecularG: number;
        public _iSpecularB: number;
        public _pIsFirstLight: boolean;
        /**
        * Creates a new SpecularBasicMethod object.
        */
        constructor();
        public iIsUsed(shaderObject: ShaderLightingObject): boolean;
        /**
        * @inheritDoc
        */
        public iInitVO(shaderObject: ShaderLightingObject, methodVO: MethodVO): void;
        /**
        * The sharpness of the specular highlight.
        */
        public gloss : number;
        /**
        * The overall strength of the specular highlights.
        */
        public specular : number;
        /**
        * The colour of the specular reflection of the surface.
        */
        public specularColor : number;
        /**
        * The bitmapData that encodes the specular highlight strength per texel in the red channel, and the sharpness
        * in the green channel. You can use SpecularBitmapTexture if you want to easily set specular and gloss maps
        * from grayscale images, but prepared images are preferred.
        */
        public texture : textures.Texture2DBase;
        /**
        * @inheritDoc
        */
        public copyFrom(method: ShadingMethodBase): void;
        /**
        * @inheritDoc
        */
        public iCleanCompilationData(): void;
        /**
        * @inheritDoc
        */
        public iGetFragmentPreLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerLight(shaderObject: ShaderLightingObject, methodVO: MethodVO, lightDirReg: ShaderRegisterElement, lightColReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentCodePerProbe(shaderObject: ShaderLightingObject, methodVO: MethodVO, cubeMapReg: ShaderRegisterElement, weightRegister: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public iGetFragmentPostLightingCode(shaderObject: ShaderLightingObject, methodVO: MethodVO, targetReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public iActivate(shaderObject: ShaderLightingObject, methodVO: MethodVO, stage: base.Stage): void;
        /**
        * Updates the specular color data used by the render state.
        */
        private updateSpecular();
    }
}
declare module away.materials {
    /**
    * MaterialPassBase provides an abstract base class for material shader passes. A material pass constitutes at least
    * a render call per required renderable.
    */
    class MaterialPassBase extends events.EventDispatcher implements IMaterialPass, IMaterialPassStageGL {
        private _maxLights;
        private _includeCasters;
        private _forceSeparateMVP;
        private _directionalLightsOffset;
        private _pointLightsOffset;
        private _lightProbesOffset;
        public _pNumPointLights: number;
        public _pNumDirectionalLights: number;
        public _pNumLightProbes: number;
        public _pNumLights: number;
        private _passMode;
        public _iPasses: IMaterialPass[];
        public _iPassesDirty: boolean;
        public _pActiveShaderObject: pool.ShaderObjectData;
        /**
        * A list of material pass vos.
        */
        private _materialPassVOs;
        private _depthCompareMode;
        private _blendFactorSource;
        private _blendFactorDest;
        public _pEnableBlending: boolean;
        public _pLightPicker: LightPickerBase;
        private _defaultCulling;
        private _renderToTexture;
        private _oldTarget;
        private _oldSurface;
        private _oldDepthStencil;
        private _oldRect;
        private _writeDepth;
        private _onLightsChangeDelegate;
        /**
        * Indicates whether or not shadow casting lights need to be included.
        */
        public includeCasters : boolean;
        /**
        * Indicates whether the screen projection should be calculated by forcing a separate scene matrix and
        * view-projection matrix. This is used to prevent rounding errors when using multiple passes with different
        * projection code.
        */
        public forceSeparateMVP : boolean;
        /**
        * Indicates the offset in the light picker's directional light vector for which to start including lights.
        * This needs to be set before the light picker is assigned.
        */
        public directionalLightsOffset : number;
        /**
        * Indicates the offset in the light picker's point light vector for which to start including lights.
        * This needs to be set before the light picker is assigned.
        */
        public pointLightsOffset : number;
        /**
        * Indicates the offset in the light picker's light probes vector for which to start including lights.
        * This needs to be set before the light picker is assigned.
        */
        public lightProbesOffset : number;
        /**
        *
        */
        public passMode : number;
        /**
        * Creates a new MaterialPassBase object.
        */
        constructor(passMode?: number);
        /**
        * Factory method to create a concrete shader object for this pass.
        *
        * @param profile The compatibility profile used by the renderer.
        */
        public createShaderObject(profile: string): ShaderObjectBase;
        /**
        * Indicate whether this pass should write to the depth buffer or not. Ignored when blending is enabled.
        */
        public writeDepth : boolean;
        /**
        * The depth compare mode used to render the renderables using this material.
        *
        * @see away.stagegl.ContextGLCompareMode
        */
        public depthCompareMode : string;
        /**
        * Specifies whether this pass renders to texture
        */
        public renderToTexture : boolean;
        /**
        * Cleans up any resources used by the current object.
        * @param deep Indicates whether other resources should be cleaned up, that could potentially be shared across different instances.
        */
        public dispose(): void;
        public getMaterialPassVO(materialId: number): MaterialPassVO;
        /**
        * Renders an object to the current render target.
        *
        * @private
        */
        public iRender(renderable: pool.RenderableBase, stage: base.Stage, camera: entities.Camera, viewProjection: geom.Matrix3D): void;
        /**
        *
        *
        * @param renderable
        * @param stage
        * @param camera
        */
        public setRenderState(renderable: pool.RenderableBase, stage: base.Stage, camera: entities.Camera, viewProjection: geom.Matrix3D): void;
        /**
        * The blend mode to use when drawing this renderable. The following blend modes are supported:
        * <ul>
        * <li>BlendMode.NORMAL: No blending, unless the material inherently needs it</li>
        * <li>BlendMode.LAYER: Force blending. This will draw the object the same as NORMAL, but without writing depth writes.</li>
        * <li>BlendMode.MULTIPLY</li>
        * <li>BlendMode.ADD</li>
        * <li>BlendMode.ALPHA</li>
        * </ul>
        */
        public setBlendMode(value: string): void;
        /**
        * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
        * calling renderPass. Before activating a pass, the previously used pass needs to be deactivated.
        * @param stage The Stage object which is currently used for rendering.
        * @param camera The camera from which the scene is viewed.
        * @private
        */
        public iActivate(material: MaterialBase, stage: base.Stage, camera: entities.Camera): void;
        /**
        * Clears the render state for the pass. This needs to be called before activating another pass.
        * @param stage The Stage used for rendering
        *
        * @private
        */
        public iDeactivate(material: MaterialBase, stage: base.Stage): void;
        /**
        * Marks the shader program as invalid, so it will be recompiled before the next render.
        *
        * @param updateMaterial Indicates whether the invalidation should be performed on the entire material. Should always pass "true" unless it's called from the material itself.
        */
        public iInvalidateShaderProgram(updateMaterial?: boolean): void;
        /**
        * The light picker used by the material to provide lights to the material if it supports lighting.
        *
        * @see away.materials.LightPickerBase
        * @see away.materials.StaticLightPicker
        */
        public lightPicker : LightPickerBase;
        /**
        * Called when the light picker's configuration changes.
        */
        private onLightsChange(event);
        /**
        * Implemented by subclasses if the pass uses lights to update the shader.
        */
        public pUpdateLights(): void;
        public _iIncludeDependencies(shaderObject: ShaderObjectBase): void;
        public _iInitConstantData(shaderObject: ShaderObjectBase): void;
        /**
        * Mark an material as owner of this material pass.
        *
        * @param owner The MaterialBase that had this material pass assigned
        *
        * @internal
        */
        public _iAddOwner(owner: MaterialBase): void;
        /**
        * Removes a MaterialBase as owner.
        * @param owner
        *
        * @internal
        */
        public _iRemoveOwner(owner: MaterialBase): void;
        public _iGetPreVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        public _iGetPreFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        public _iGetVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        public _iGetFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        public _iGetNormalVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        public _iGetNormalFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * The amount of point lights that need to be supported.
        */
        public iNumPointLights : number;
        /**
        * The amount of directional lights that need to be supported.
        */
        public iNumDirectionalLights : number;
        /**
        * The amount of light probes that need to be supported.
        */
        public iNumLightProbes : number;
        /**
        * Indicates whether or not normals are calculated at all.
        */
        public _pOutputsNormals(shaderObject: ShaderObjectBase): boolean;
        /**
        * Indicates whether or not normals are calculated in tangent space.
        */
        public _pOutputsTangentNormals(shaderObject: ShaderObjectBase): boolean;
        /**
        * Indicates whether or not normals are allowed in tangent space. This is only the case if no object-space
        * dependencies exist.
        */
        public _pUsesTangentSpace(shaderObject: ShaderObjectBase): boolean;
        /**
        * Calculates the amount of directional lights this material will support.
        * @param numDirectionalLights The maximum amount of directional lights to support.
        * @return The amount of directional lights this material will support, bounded by the amount necessary.
        */
        private calculateNumDirectionalLights(numDirectionalLights);
        /**
        * Calculates the amount of point lights this material will support.
        * @param numDirectionalLights The maximum amount of point lights to support.
        * @return The amount of point lights this material will support, bounded by the amount necessary.
        */
        private calculateNumPointLights(numPointLights);
        /**
        * Calculates the amount of light probes this material will support.
        * @param numDirectionalLights The maximum amount of light probes to support.
        * @return The amount of light probes this material will support, bounded by the amount necessary.
        */
        private calculateNumProbes(numLightProbes);
    }
}
declare module away.materials {
    interface IMaterialPassStageGL extends IMaterialPass {
        _iGetPreVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        _iGetPreFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        _iGetVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        _iGetFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        _iGetNormalVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        _iGetNormalFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        forceSeparateMVP: boolean;
        passMode: number;
        _iInitConstantData(shaderObject: ShaderObjectBase): any;
        _iIncludeDependencies(shaderObject: ShaderObjectBase): any;
        /**
        * Factory method to create a concrete shader object for this pass.
        *
        * @param profile The compatibility profile used by the renderer.
        */
        createShaderObject(profile: string): ShaderObjectBase;
    }
}
declare module away.materials {
    interface ILightingPassStageGL extends IMaterialPassStageGL {
        /**
        * The amount of point lights that need to be supported.
        */
        iNumPointLights: number;
        /**
        * The amount of directional lights that need to be supported.
        */
        iNumDirectionalLights: number;
        /**
        * The amount of light probes that need to be supported.
        */
        iNumLightProbes: number;
        /**
        * Indicates the offset in the light picker's directional light vector for which to start including lights.
        * This needs to be set before the light picker is assigned.
        */
        directionalLightsOffset: number;
        /**
        * Indicates the offset in the light picker's point light vector for which to start including lights.
        * This needs to be set before the light picker is assigned.
        */
        pointLightsOffset: number;
        /**
        * Indicates the offset in the light picker's light probes vector for which to start including lights.
        * This needs to be set before the light picker is assigned.
        */
        lightProbesOffset: number;
        /**
        * The light picker used by the material to provide lights to the material if it supports lighting.
        *
        * @see away.materials.LightPickerBase
        * @see away.materials.StaticLightPicker
        */
        lightPicker: LightPickerBase;
        _iUsesSpecular(): any;
        _iUsesShadows(): any;
        _iGetPreLightingVertexCode(shaderObject: ShaderLightingObject, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        _iGetPreLightingFragmentCode(shaderObject: ShaderLightingObject, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        _iGetPerLightDiffuseFragmentCode(shaderObject: ShaderLightingObject, lightDirReg: ShaderRegisterElement, diffuseColorReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        _iGetPerLightSpecularFragmentCode(shaderObject: ShaderLightingObject, lightDirReg: ShaderRegisterElement, specularColorReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        _iGetPerProbeDiffuseFragmentCode(shaderObject: ShaderLightingObject, texReg: ShaderRegisterElement, weightReg: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        _iGetPerProbeSpecularFragmentCode(shaderObject: ShaderLightingObject, texReg: ShaderRegisterElement, weightReg: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        _iGetPostLightingVertexCode(shaderObject: ShaderLightingObject, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        _iGetPostLightingFragmentCode(shaderObject: ShaderLightingObject, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
    }
}
/**
* @module away.pool
*/
declare module away.materials {
    /**
    *
    * @class away.pool.MaterialPassDataBase
    */
    class MaterialPassVO {
        public _iRenderOrderId: number;
        private _shaderObjectData;
        static MATERIALPASS_ID_COUNT: number;
        /**
        * An id for this material pass, used to identify material passes when using animation sets.
        *
        * @private
        */
        public _iUniqueId: number;
        public material: MaterialBase;
        public materialPass: IMaterialPassStageGL;
        constructor(material: MaterialBase, materialPass: IMaterialPassStageGL);
        /**
        *
        */
        public invalidate(): void;
        /**
        *
        */
        public dispose(): void;
        public _iAddShaderObjectData(shaderObjectData: pool.ShaderObjectData): pool.ShaderObjectData;
        public _iRemoveShaderObjectData(shaderObjectData: pool.ShaderObjectData): pool.ShaderObjectData;
        private calculateID();
    }
}
declare module away.materials {
    /**
    * LineBasicPass is a material pass that draws wireframe segments.
    */
    class LineBasicPass extends MaterialPassBase {
        static pONE_VECTOR: number[];
        static pFRONT_VECTOR: number[];
        private _constants;
        private _calcMatrix;
        private _thickness;
        public thickness : number;
        /**
        * Creates a new SegmentPass object.
        *
        * @param material The material to which this pass belongs.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public _iGetVertexCode(shaderObject: ShaderObjectBase, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public _iGetFragmentCode(shaderObject: ShaderObjectBase, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData): string;
        /**
        * @inheritDoc
        * todo: keep maps in dictionary per renderable
        */
        public iRender(renderable: pool.RenderableBase, stage: base.Stage, camera: entities.Camera, viewProjection: geom.Matrix3D): void;
        /**
        * @inheritDoc
        */
        public iActivate(material: MaterialBase, stage: base.Stage, camera: entities.Camera): void;
        /**
        * @inheritDoc
        */
        public pDeactivate(material: MaterialBase, stage: base.Stage): void;
    }
}
declare module away.materials {
    /**
    * SkyboxPass provides a material pass exclusively used to render sky boxes from a cube texture.
    */
    class SkyboxPass extends MaterialPassBase {
        private _cubeTexture;
        private _texturesIndex;
        private _vertexData;
        /**
        * Creates a new SkyboxPass object.
        *
        * @param material The material to which this pass belongs.
        */
        constructor();
        /**
        * The cube texture to use as the skybox.
        */
        public cubeTexture : textures.CubeTextureBase;
        public _iIncludeDependencies(shaderObject: ShaderLightingObject): void;
        /**
        * @inheritDoc
        */
        public _iGetPreVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public _iGetFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public iRender(renderable: pool.RenderableBase, stage: base.Stage, camera: entities.Camera, viewProjection: geom.Matrix3D): void;
        /**
        * @inheritDoc
        */
        public iActivate(material: MaterialBase, stage: base.Stage, camera: entities.Camera): void;
    }
}
declare module away.materials {
    /**
    * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
    * using material methods to define their appearance.
    */
    class TrianglePassBase extends MaterialPassBase {
        public _preserveAlpha: boolean;
        /**
        * Creates a new CompiledPass object.
        */
        constructor(passMode?: number);
        /**
        * Indicates whether the output alpha value should remain unchanged compared to the material's original alpha.
        */
        public preserveAlpha : boolean;
        public _iGetPreVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public iRender(renderable: pool.RenderableBase, stage: base.Stage, camera: entities.Camera, viewProjection: geom.Matrix3D): void;
    }
}
declare module away.materials {
    /**
    * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
    * using material methods to define their appearance.
    */
    class TriangleBasicPass extends TrianglePassBase {
        public _pUseTexture: boolean;
        public _pTexture: textures.Texture2DBase;
        private _diffuseColor;
        private _diffuseR;
        private _diffuseG;
        private _diffuseB;
        private _diffuseA;
        private _fragmentConstantsIndex;
        private _texturesIndex;
        /**
        * The alpha component of the diffuse reflection.
        */
        public diffuseAlpha : number;
        /**
        * The color of the diffuse reflection when not using a texture.
        */
        public diffuseColor : number;
        /**
        * The bitmapData to use to define the diffuse reflection color per texel.
        */
        public texture : textures.Texture2DBase;
        /**
        * Creates a new CompiledPass object.
        *
        * @param material The material to which this pass belongs.
        */
        constructor();
        /**
        * @inheritDoc
        */
        public _iGetFragmentCode(shaderObject: ShaderObjectBase, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData): string;
        public _iIncludeDependencies(dependencyCounter: ShaderObjectBase): void;
        /**
        * @inheritDoc
        */
        public iActivate(material: MaterialBase, stage: base.Stage, camera: entities.Camera): void;
    }
}
declare module away.materials {
    /**
    * DepthMapPass is a pass that writes depth values to a depth map as a 32-bit value exploded over the 4 texture channels.
    * This is used to render shadow maps, depth maps, etc.
    */
    class DepthMapPass extends TrianglePassBase {
        private _fragmentConstantsIndex;
        private _texturesIndex;
        private _alphaMask;
        /**
        * Creates a new DepthMapPass object.
        *
        * @param material The material to which this pass belongs.
        */
        constructor();
        /**
        * Initializes the unchanging constant data for this material.
        */
        public _iInitConstantData(shaderObject: ShaderObjectBase): void;
        /**
        * A texture providing alpha data to be able to prevent semi-transparent pixels to write to the alpha mask.
        * Usually the diffuse texture when alphaThreshold is used.
        */
        public alphaMask : textures.Texture2DBase;
        public _iIncludeDependencies(shaderObject: ShaderObjectBase): void;
        /**
        * @inheritDoc
        */
        public _iGetFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public iActivate(material: MaterialBase, stage: base.Stage, camera: entities.Camera): void;
    }
}
declare module away.materials {
    /**
    * DistanceMapPass is a pass that writes distance values to a depth map as a 32-bit value exploded over the 4 texture channels.
    * This is used to render omnidirectional shadow maps.
    */
    class DistanceMapPass extends TrianglePassBase {
        private _fragmentConstantsIndex;
        private _texturesIndex;
        private _alphaMask;
        /**
        * Creates a new DistanceMapPass object.
        *
        * @param material The material to which this pass belongs.
        */
        constructor();
        /**
        * Initializes the unchanging constant data for this material.
        */
        public _iInitConstantData(shaderObject: ShaderObjectBase): void;
        /**
        * A texture providing alpha data to be able to prevent semi-transparent pixels to write to the alpha mask.
        * Usually the diffuse texture when alphaThreshold is used.
        */
        public alphaMask : textures.Texture2DBase;
        public _iIncludeDependencies(shaderObject: ShaderObjectBase): void;
        /**
        * @inheritDoc
        */
        public _iGetFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public iActivate(material: MaterialBase, stage: base.Stage, camera: entities.Camera): void;
    }
}
/**
*
*/
declare module away.materials {
    class MaterialPassMode {
        static EFFECTS: number;
        /**
        *
        */
        static LIGHTING: number;
        /**
        *
        */
        static SUPER_SHADER: number;
    }
}
declare module away.materials {
    /**
    * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
    * using material methods to define their appearance.
    */
    class TriangleMethodPass extends TrianglePassBase implements ILightingPassStageGL {
        public _iPassesDirty: boolean;
        public _iColorTransformMethodVO: MethodVO;
        public _iNormalMethodVO: MethodVO;
        public _iAmbientMethodVO: MethodVO;
        public _iShadowMethodVO: MethodVO;
        public _iDiffuseMethodVO: MethodVO;
        public _iSpecularMethodVO: MethodVO;
        public _iMethodVOs: MethodVO[];
        public _numEffectDependencies: number;
        private _onShaderInvalidatedDelegate;
        /**
        * Creates a new CompiledPass object.
        *
        * @param material The material to which this pass belongs.
        */
        constructor(passMode?: number);
        /**
        * Factory method to create a concrete shader object for this pass.
        *
        * @param profile The compatibility profile used by the renderer.
        */
        public createShaderObject(profile: string): ShaderObjectBase;
        /**
        * Initializes the unchanging constant data for this material.
        */
        public _iInitConstantData(shaderObject: ShaderObjectBase): void;
        /**
        * The ColorTransform object to transform the colour of the material with. Defaults to null.
        */
        public colorTransform : geom.ColorTransform;
        /**
        * The EffectColorTransformMethod object to transform the colour of the material with. Defaults to null.
        */
        public colorTransformMethod : EffectColorTransformMethod;
        private _removeDependency(methodVO, effectsDependency?);
        private _addDependency(methodVO, effectsDependency?, index?);
        /**
        * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
        * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
        * methods added prior.
        */
        public addEffectMethod(method: EffectMethodBase): void;
        /**
        * The number of "effect" methods added to the material.
        */
        public numEffectMethods : number;
        /**
        * Queries whether a given effects method was added to the material.
        *
        * @param method The method to be queried.
        * @return true if the method was added to the material, false otherwise.
        */
        public hasEffectMethod(method: EffectMethodBase): boolean;
        /**
        * Returns the method added at the given index.
        * @param index The index of the method to retrieve.
        * @return The method at the given index.
        */
        public getEffectMethodAt(index: number): EffectMethodBase;
        /**
        * Adds an effect method at the specified index amongst the methods already added to the material. Effect
        * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
        * etc. The method will be applied to the result of the methods with a lower index.
        */
        public addEffectMethodAt(method: EffectMethodBase, index: number): void;
        /**
        * Removes an effect method from the material.
        * @param method The method to be removed.
        */
        public removeEffectMethod(method: EffectMethodBase): void;
        private getDependencyForMethod(method);
        /**
        * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
        */
        public normalMethod : NormalBasicMethod;
        /**
        * The method that provides the ambient lighting contribution. Defaults to AmbientBasicMethod.
        */
        public ambientMethod : AmbientBasicMethod;
        /**
        * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
        */
        public shadowMethod : ShadowMapMethodBase;
        /**
        * The method that provides the diffuse lighting contribution. Defaults to DiffuseBasicMethod.
        */
        public diffuseMethod : DiffuseBasicMethod;
        /**
        * The method that provides the specular lighting contribution. Defaults to SpecularBasicMethod.
        */
        public specularMethod : SpecularBasicMethod;
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        * @inheritDoc
        */
        public iInvalidateShaderProgram(updateMaterial?: boolean): void;
        /**
        * Adds internal passes to the material.
        *
        * @param passes The passes to add.
        */
        public pAddPasses(methodVO: MethodVO): void;
        /**
        * Called when any method's shader code is invalidated.
        */
        private onShaderInvalidated(event);
        /**
        * @inheritDoc
        */
        public iActivate(material: MaterialBase, stage: base.Stage, camera: entities.Camera): void;
        /**
        *
        *
        * @param renderable
        * @param stage
        * @param camera
        */
        public setRenderState(renderable: pool.RenderableBase, stage: base.Stage, camera: entities.Camera, viewProjection: geom.Matrix3D): void;
        /**
        * @inheritDoc
        */
        public iDeactivate(material: MaterialBase, stage: base.Stage): void;
        public _iIncludeDependencies(shaderObject: ShaderLightingObject): void;
        /**
        * Counts the dependencies for a given method.
        * @param method The method to count the dependencies for.
        * @param methodVO The method's data for this material.
        */
        private setupAndCountDependencies(shaderObject, methodVO);
        public _iGetPreVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        public _iGetPreFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        public _iGetPreLightingVertexCode(shaderObject: ShaderLightingObject, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        public _iGetPreLightingFragmentCode(shaderObject: ShaderLightingObject, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        public _iGetPerLightDiffuseFragmentCode(shaderObject: ShaderLightingObject, lightDirReg: ShaderRegisterElement, diffuseColorReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        public _iGetPerLightSpecularFragmentCode(shaderObject: ShaderLightingObject, lightDirReg: ShaderRegisterElement, specularColorReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        public _iGetPerProbeDiffuseFragmentCode(shaderObject: ShaderLightingObject, texReg: ShaderRegisterElement, weightReg: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        public _iGetPerProbeSpecularFragmentCode(shaderObject: ShaderLightingObject, texReg: ShaderRegisterElement, weightReg: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        public _iGetPostLightingVertexCode(shaderObject: ShaderLightingObject, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        public _iGetPostLightingFragmentCode(shaderObject: ShaderLightingObject, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * Indicates whether or not normals are allowed in tangent space. This is only the case if no object-space
        * dependencies exist.
        */
        public _pUsesTangentSpace(shaderObject: ShaderLightingObject): boolean;
        /**
        * Indicates whether or not normals are output in tangent space.
        */
        public _pOutputsTangentNormals(shaderObject: ShaderObjectBase): boolean;
        /**
        * Indicates whether or not normals are output by the pass.
        */
        public _pOutputsNormals(shaderObject: ShaderObjectBase): boolean;
        public _iGetNormalVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        public _iGetNormalFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public _iGetVertexCode(shaderObject: ShaderObjectBase, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData): string;
        /**
        * @inheritDoc
        */
        public _iGetFragmentCode(shaderObject: ShaderObjectBase, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData): string;
        /**
        * Indicates whether the shader uses any shadows.
        */
        public _iUsesShadows(): boolean;
        /**
        * Indicates whether the shader uses any specular component.
        */
        public _iUsesSpecular(): boolean;
    }
}
declare module away.materials {
    /**
    * MaterialBase forms an abstract base class for any material.
    * A material consists of several passes, each of which constitutes at least one render call. Several passes could
    * be used for special effects (render lighting for many lights in several passes, render an outline in a separate
    * pass) or to provide additional render-to-texture passes (rendering diffuse light to texture for texture-space
    * subsurface scattering, or rendering a depth map for specialized self-shadowing).
    *
    * Away3D provides default materials trough SinglePassMaterialBase and TriangleMethodMaterial, which use modular
    * methods to build the shader code. MaterialBase can be extended to build specific and high-performant custom
    * shaders, or entire new material frameworks.
    */
    class DepthMaterialBase extends MaterialBase {
        public _pDepthPass: DepthMapPass;
        public _pDistancePass: DistanceMapPass;
        private _distanceBasedDepthRender;
        public _pHeight: number;
        public _pWidth: number;
        public _pRequiresBlending: boolean;
        /**
        * Creates a new MaterialBase object.
        */
        constructor();
        public pAddDepthPasses(): void;
        /**
        * Sets the render state for the depth pass that is independent of the rendered object. Used when rendering
        * depth or distances (fe: shadow maps, depth pre-pass).
        *
        * @param stage The Stage used for rendering.
        * @param camera The camera from which the scene is viewed.
        * @param distanceBased Whether or not the depth pass or distance pass should be activated. The distance pass
        * is required for shadow cube maps.
        *
        * @internal
        */
        public iActivateForDepth(stage: base.Stage, camera: entities.Camera, distanceBased?: boolean): void;
        /**
        * Clears the render state for the depth pass.
        *
        * @param stage The Stage used for rendering.
        *
        * @internal
        */
        public iDeactivateForDepth(stage: base.Stage): void;
        /**
        * Renders a renderable using the depth pass.
        *
        * @param renderable The RenderableBase instance that needs to be rendered.
        * @param stage The Stage used for rendering.
        * @param camera The camera from which the scene is viewed.
        * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
        * camera.viewProjection as it includes the scaling factors when rendering to textures.
        *
        * @internal
        */
        public iRenderDepth(renderable: pool.RenderableBase, stage: base.Stage, camera: entities.Camera, viewProjection: geom.Matrix3D): void;
    }
}
declare module away.materials {
    /**
    * LineMaterial is a material exclusively used to render wireframe objects
    *
    * @see away.entities.Lines
    */
    class LineBasicMaterial extends DepthMaterialBase {
        private _screenPass;
        /**
        * Creates a new LineMaterial object.
        *
        * @param thickness The thickness of the wireframe lines.
        */
        constructor(thickness?: number);
    }
}
declare module away.materials {
    /**
    * SkyboxMaterial is a material exclusively used to render skyboxes
    *
    * @see away3d.primitives.Skybox
    */
    class SkyboxMaterial extends MaterialBase {
        private _cubeMap;
        private _skyboxPass;
        /**
        * Creates a new SkyboxMaterial object.
        * @param cubeMap The CubeMap to use as the skybox.
        */
        constructor(cubeMap: textures.CubeTextureBase, smooth?: boolean, repeat?: boolean, mipmap?: boolean);
        /**
        * The cube texture to use as the skybox.
        */
        public cubeMap : textures.CubeTextureBase;
    }
}
declare module away.materials {
    /**
    * TriangleMaterial forms an abstract base class for the default shaded materials provided by Stage,
    * using material methods to define their appearance.
    */
    class TriangleBasicMaterial extends DepthMaterialBase {
        private _screenPass;
        private _color;
        private _texture;
        private _alphaBlending;
        private _alpha;
        private _alphaThreshold;
        private _depthCompareMode;
        /**
        * Creates a new TriangleMaterial object.
        *
        * @param texture The texture used for the material's albedo color.
        * @param smooth Indicates whether the texture should be filtered when sampled. Defaults to true.
        * @param repeat Indicates whether the texture should be tiled when sampled. Defaults to false.
        * @param mipmap Indicates whether or not any used textures should use mipmapping. Defaults to false.
        */
        constructor(texture?: textures.Texture2DBase, smooth?: boolean, repeat?: boolean, mipmap?: boolean);
        constructor(color?: number, alpha?: number);
        /**
        * The depth compare mode used to render the renderables using this material.
        *
        * @see away.stagegl.ContextGLCompareMode
        */
        public depthCompareMode : string;
        /**
        * The alpha of the surface.
        */
        public alpha : number;
        /**
        * The diffuse reflectivity color of the surface.
        */
        public color : number;
        /**
        * The texture object to use for the albedo colour.
        */
        public texture : textures.Texture2DBase;
        /**
        * Indicates whether or not the material has transparency. If binary transparency is sufficient, for
        * example when using textures of foliage, consider using alphaThreshold instead.
        */
        public alphaBlending : boolean;
        /**
        * Sets the render state for the depth pass that is independent of the rendered object. Used when rendering
        * depth or distances (fe: shadow maps, depth pre-pass).
        *
        * @param stage The Stage used for rendering.
        * @param camera The camera from which the scene is viewed.
        * @param distanceBased Whether or not the depth pass or distance pass should be activated. The distance pass
        * is required for shadow cube maps.
        *
        * @internal
        */
        public iActivateForDepth(stage: base.Stage, camera: entities.Camera, distanceBased?: boolean): void;
        /**
        * @inheritDoc
        */
        public iUpdateMaterial(): void;
        /**
        * Adds a compiled pass that renders to the screen.
        * @param pass The pass to be added.
        */
        private addScreenPass(pass);
        /**
        * Tests if any pass that renders to the screen is invalid. This would trigger a new setup of the multiple passes.
        * @return
        */
        private isAnyScreenPassInvalid();
        /**
        * @inheritDoc
        */
        public iActivatePass(index: number, stage: base.Stage, camera: entities.Camera): void;
        /**
        * @inheritDoc
        */
        public iDeactivate(stage: base.Stage): void;
        /**
        * Updates screen passes when they were found to be invalid.
        */
        public pUpdateScreenPasses(): void;
        public _pUpdateColor(): void;
        public _pUpdateTexture(): void;
        /**
        * Initializes all the passes and their dependent passes.
        */
        private initPasses();
        /**
        * Sets up the various blending modes for all screen passes, based on whether or not there are previous passes.
        */
        private setBlendAndCompareModes();
    }
}
/**
*
*/
declare module away.materials {
    class TriangleMaterialMode {
        /**
        *
        */
        static SINGLE_PASS: string;
        /**
        *
        */
        static MULTI_PASS: string;
    }
}
declare module away.materials {
    /**
    * TriangleMethodMaterial forms an abstract base class for the default shaded materials provided by Stage,
    * using material methods to define their appearance.
    */
    class TriangleMethodMaterial extends DepthMaterialBase {
        private _alphaBlending;
        private _alpha;
        private _colorTransform;
        private _materialMode;
        private _casterLightPass;
        private _nonCasterLightPasses;
        private _screenPass;
        private _ambientMethod;
        private _shadowMethod;
        private _diffuseMethod;
        private _normalMethod;
        private _specularMethod;
        private _depthCompareMode;
        /**
        * Creates a new TriangleMethodMaterial object.
        *
        * @param texture The texture used for the material's albedo color.
        * @param smooth Indicates whether the texture should be filtered when sampled. Defaults to true.
        * @param repeat Indicates whether the texture should be tiled when sampled. Defaults to false.
        * @param mipmap Indicates whether or not any used textures should use mipmapping. Defaults to false.
        */
        constructor(texture?: textures.Texture2DBase, smooth?: boolean, repeat?: boolean, mipmap?: boolean);
        constructor(color?: number, alpha?: number);
        public materialMode : string;
        /**
        * The depth compare mode used to render the renderables using this material.
        *
        * @see away.stagegl.ContextGLCompareMode
        */
        public depthCompareMode : string;
        /**
        * The alpha of the surface.
        */
        public alpha : number;
        /**
        * The ColorTransform object to transform the colour of the material with. Defaults to null.
        */
        public colorTransform : geom.ColorTransform;
        /**
        * The diffuse reflectivity color of the surface.
        */
        public color : number;
        /**
        * The texture object to use for the albedo colour.
        */
        public texture : textures.Texture2DBase;
        /**
        * The texture object to use for the ambient colour.
        */
        public diffuseTexture : textures.Texture2DBase;
        /**
        * The method that provides the ambient lighting contribution. Defaults to AmbientBasicMethod.
        */
        public ambientMethod : AmbientBasicMethod;
        /**
        * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
        */
        public shadowMethod : ShadowMapMethodBase;
        /**
        * The method that provides the diffuse lighting contribution. Defaults to DiffuseBasicMethod.
        */
        public diffuseMethod : DiffuseBasicMethod;
        /**
        * The method that provides the specular lighting contribution. Defaults to SpecularBasicMethod.
        */
        public specularMethod : SpecularBasicMethod;
        /**
        * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
        */
        public normalMethod : NormalBasicMethod;
        /**
        * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
        * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
        * methods added prior.
        */
        public addEffectMethod(method: EffectMethodBase): void;
        /**
        * The number of "effect" methods added to the material.
        */
        public numEffectMethods : number;
        /**
        * Queries whether a given effect method was added to the material.
        *
        * @param method The method to be queried.
        * @return true if the method was added to the material, false otherwise.
        */
        public hasEffectMethod(method: EffectMethodBase): boolean;
        /**
        * Returns the method added at the given index.
        * @param index The index of the method to retrieve.
        * @return The method at the given index.
        */
        public getEffectMethodAt(index: number): EffectMethodBase;
        /**
        * Adds an effect method at the specified index amongst the methods already added to the material. Effect
        * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
        * etc. The method will be applied to the result of the methods with a lower index.
        */
        public addEffectMethodAt(method: EffectMethodBase, index: number): void;
        /**
        * Removes an effect method from the material.
        * @param method The method to be removed.
        */
        public removeEffectMethod(method: EffectMethodBase): void;
        /**
        * The normal map to modulate the direction of the surface for each texel. The default normal method expects
        * tangent-space normal maps, but others could expect object-space maps.
        */
        public normalMap : textures.Texture2DBase;
        /**
        * A specular map that defines the strength of specular reflections for each texel in the red channel,
        * and the gloss factor in the green channel. You can use SpecularBitmapTexture if you want to easily set
        * specular and gloss maps from grayscale images, but correctly authored images are preferred.
        */
        public specularMap : textures.Texture2DBase;
        /**
        * The glossiness of the material (sharpness of the specular highlight).
        */
        public gloss : number;
        /**
        * The strength of the ambient reflection.
        */
        public ambient : number;
        /**
        * The overall strength of the specular reflection.
        */
        public specular : number;
        /**
        * The colour of the ambient reflection.
        */
        public ambientColor : number;
        /**
        * The colour of the diffuse reflection.
        */
        public diffuseColor : number;
        /**
        * The colour of the specular reflection.
        */
        public specularColor : number;
        /**
        * Indicates whether or not the material has transparency. If binary transparency is sufficient, for
        * example when using textures of foliage, consider using alphaThreshold instead.
        */
        public alphaBlending : boolean;
        /**
        * @inheritDoc
        */
        public iUpdateMaterial(): void;
        /**
        * Adds a compiled pass that renders to the screen.
        * @param pass The pass to be added.
        */
        private addScreenPass(pass);
        /**
        * Tests if any pass that renders to the screen is invalid. This would trigger a new setup of the multiple passes.
        * @return
        */
        private isAnyScreenPassInvalid();
        /**
        * @inheritDoc
        */
        public iActivatePass(index: number, stage: base.Stage, camera: entities.Camera): void;
        /**
        * @inheritDoc
        */
        public iDeactivate(stage: base.Stage): void;
        /**
        * Updates screen passes when they were found to be invalid.
        */
        public pUpdateScreenPasses(): void;
        /**
        * Initializes all the passes and their dependent passes.
        */
        private initPasses();
        /**
        * Sets up the various blending modes for all screen passes, based on whether or not there are previous passes.
        */
        private setBlendAndCompareModes();
        private initCasterLightPass();
        private removeCasterLightPass();
        private initNonCasterLightPasses();
        private removeNonCasterLightPasses();
        private removeEffectPass();
        private initEffectPass();
        /**
        * The maximum total number of lights provided by the light picker.
        */
        private numLights;
        /**
        * The amount of lights that don't cast shadows.
        */
        private numNonCasters;
    }
}
declare module away.materials {
    class DefaultMaterialManager {
        private static _defaultBitmapData;
        private static _defaultTriangleMaterial;
        private static _defaultLineMaterial;
        private static _defaultTexture;
        static getDefaultMaterial(materialOwner?: base.IMaterialOwner): MaterialBase;
        static getDefaultTexture(materialOwner?: base.IMaterialOwner): textures.BitmapTexture;
        private static createDefaultTexture();
        static createCheckeredBitmapData(): base.BitmapData;
        private static createDefaultTriangleMaterial();
        private static createDefaultLineMaterial();
    }
}
declare module away.materials {
    class ShaderCompilerHelper {
        /**
        * A helper method that generates standard code for sampling from a texture using the normal uv coordinates.
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param sharedReg The shared register object for the shader.
        * @param inputReg The texture stream register.
        * @param texture The texture which will be assigned to the given slot.
        * @param uvReg An optional uv register if coordinates different from the primary uv coordinates are to be used.
        * @param forceWrap If true, texture wrapping is enabled regardless of the material setting.
        * @return The fragment code that performs the sampling.
        *
        * @protected
        */
        static getTex2DSampleCode(targetReg: ShaderRegisterElement, sharedReg: ShaderRegisterData, inputReg: ShaderRegisterElement, texture: textures.TextureProxyBase, smooth: boolean, repeat: boolean, mipmaps: boolean, uvReg?: ShaderRegisterElement, forceWrap?: string): string;
        /**
        * A helper method that generates standard code for sampling from a cube texture.
        * @param vo The MethodVO object linking this method with the pass currently being compiled.
        * @param targetReg The register in which to store the sampled colour.
        * @param inputReg The texture stream register.
        * @param texture The cube map which will be assigned to the given slot.
        * @param uvReg The direction vector with which to sample the cube map.
        *
        * @protected
        */
        static getTexCubeSampleCode(targetReg: ShaderRegisterElement, inputReg: ShaderRegisterElement, texture: textures.TextureProxyBase, smooth: boolean, mipmaps: boolean, uvReg: ShaderRegisterElement): string;
        /**
        * Generates a texture format string for the sample instruction.
        * @param texture The texture for which to get the format string.
        * @return
        *
        * @protected
        */
        static getFormatStringForTexture(texture: textures.TextureProxyBase): string;
    }
}
/**
* @module away.render
*/
declare module away.render {
    /**
    * RendererBase forms an abstract base class for classes that are used in the rendering pipeline to render the
    * contents of a partition
    *
    * @class away.render.RendererBase
    */
    class RendererBase extends events.EventDispatcher {
        private _billboardRenderablePool;
        private _triangleSubMeshRenderablePool;
        private _lineSubMeshRenderablePool;
        public _pContext: stagegl.IContextStageGL;
        public _pStage: base.Stage;
        public _pCamera: entities.Camera;
        public _iEntryPoint: geom.Vector3D;
        public _pCameraForward: geom.Vector3D;
        public _pRttBufferManager: managers.RTTBufferManager;
        private _viewPort;
        private _viewportDirty;
        private _scissorDirty;
        public _pBackBufferInvalid: boolean;
        public _pDepthTextureInvalid: boolean;
        public _depthPrepass: boolean;
        private _backgroundR;
        private _backgroundG;
        private _backgroundB;
        private _backgroundAlpha;
        public _shareContext: boolean;
        public _width: number;
        public _height: number;
        public textureRatioX: number;
        public textureRatioY: number;
        private _snapshotBitmapData;
        private _snapshotRequired;
        public _pRttViewProjectionMatrix: geom.Matrix3D;
        private _localPos;
        private _globalPos;
        public _pScissorRect: geom.Rectangle;
        private _scissorUpdated;
        private _viewPortUpdated;
        private _onContextUpdateDelegate;
        private _onViewportUpdatedDelegate;
        public _pNumTriangles: number;
        public _pOpaqueRenderableHead: pool.RenderableBase;
        public _pBlendedRenderableHead: pool.RenderableBase;
        /**
        *
        */
        public numTriangles : number;
        /**
        *
        */
        public renderableSorter: sort.IEntitySorter;
        /**
        * A viewPort rectangle equivalent of the Stage size and position.
        */
        public viewPort : geom.Rectangle;
        /**
        * A scissor rectangle equivalent of the view size and position.
        */
        public scissorRect : geom.Rectangle;
        /**
        *
        */
        public x : number;
        /**
        *
        */
        public y : number;
        /**
        *
        */
        public width : number;
        /**
        *
        */
        public height : number;
        /**
        * Creates a new RendererBase object.
        */
        constructor();
        public _iCreateEntityCollector(): traverse.ICollector;
        /**
        * The background color's red component, used when clearing.
        *
        * @private
        */
        public _iBackgroundR : number;
        /**
        * The background color's green component, used when clearing.
        *
        * @private
        */
        public _iBackgroundG : number;
        /**
        * The background color's blue component, used when clearing.
        *
        * @private
        */
        public _iBackgroundB : number;
        /**
        * The Stage that will provide the ContextGL used for rendering.
        */
        public stage : base.Stage;
        public iSetStage(value: base.Stage): void;
        /**
        * Defers control of ContextGL clear() and present() calls to Stage, enabling multiple Stage frameworks
        * to share the same ContextGL object.
        */
        public shareContext : boolean;
        /**
        * Disposes the resources used by the RendererBase.
        */
        public dispose(): void;
        public render(entityCollector: traverse.ICollector): void;
        /**
        * Renders the potentially visible geometry to the back buffer or texture.
        * @param entityCollector The EntityCollector object containing the potentially visible geometry.
        * @param target An option target texture to render to.
        * @param surfaceSelector The index of a CubeTexture's face to render to.
        * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
        */
        public _iRender(entityCollector: traverse.ICollector, target?: textures.TextureProxyBase, scissorRect?: geom.Rectangle, surfaceSelector?: number): void;
        public _iRenderCascades(entityCollector: traverse.ShadowCasterCollector, target: textures.TextureProxyBase, numCascades: number, scissorRects: geom.Rectangle[], cameras: entities.Camera[]): void;
        public pCollectRenderables(entityCollector: traverse.ICollector): void;
        /**
        * Renders the potentially visible geometry to the back buffer or texture. Only executed if everything is set up.
        *
        * @param entityCollector The EntityCollector object containing the potentially visible geometry.
        * @param target An option target texture to render to.
        * @param surfaceSelector The index of a CubeTexture's face to render to.
        * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
        */
        public pExecuteRender(entityCollector: traverse.ICollector, target?: textures.TextureProxyBase, scissorRect?: geom.Rectangle, surfaceSelector?: number): void;
        public queueSnapshot(bmd: base.BitmapData): void;
        /**
        * Performs the actual drawing of geometry to the target.
        * @param entityCollector The EntityCollector object containing the potentially visible geometry.
        */
        public pDraw(entityCollector: traverse.ICollector, target: textures.TextureProxyBase): void;
        /**
        * Assign the context once retrieved
        */
        private onContextUpdate(event);
        public _iBackgroundAlpha : number;
        /**
        * @private
        */
        private notifyScissorUpdate();
        /**
        * @private
        */
        private notifyViewportUpdate();
        /**
        *
        */
        public onViewportUpdated(event: events.StageEvent): void;
        /**
        *
        */
        public updateGlobalPos(): void;
        /**
        *
        * @param billboard
        * @protected
        */
        public applyBillboard(billboard: entities.Billboard): void;
        /**
        *
        * @param triangleSubMesh
        */
        public applyTriangleSubMesh(triangleSubMesh: base.TriangleSubMesh): void;
        /**
        *
        * @param lineSubMesh
        */
        public applyLineSubMesh(lineSubMesh: base.LineSubMesh): void;
        /**
        *
        * @param renderable
        * @protected
        */
        private _applyRenderable(renderable);
    }
}
/**
* @module away.render
*/
declare module away.render {
    /**
    * The DefaultRenderer class provides the default rendering method. It renders the scene graph objects using the
    * materials assigned to them.
    *
    * @class away.render.DefaultRenderer
    */
    class DefaultRenderer extends RendererBase implements IRenderer {
        public _pRequireDepthRender: boolean;
        private _skyboxRenderablePool;
        private static RTT_PASSES;
        private static SCREEN_PASSES;
        private static ALL_PASSES;
        private _activeMaterial;
        private _pDistanceRenderer;
        private _pDepthRenderer;
        private _skyboxProjection;
        public _pFilter3DRenderer: Filter3DRenderer;
        public _pDepthRender: textures.TextureProxyBase;
        private _antiAlias;
        public antiAlias : number;
        /**
        *
        */
        public depthPrepass : boolean;
        /**
        *
        * @returns {*}
        */
        public filters3d : filters.Filter3DBase[];
        /**
        * Creates a new DefaultRenderer object.
        *
        * @param antiAlias The amount of anti-aliasing to use.
        * @param renderMode The render mode to use.
        */
        constructor(forceSoftware?: boolean, profile?: string, mode?: string);
        public render(entityCollector: traverse.ICollector): void;
        public pExecuteRender(entityCollector: traverse.EntityCollector, target?: textures.TextureProxyBase, scissorRect?: geom.Rectangle, surfaceSelector?: number): void;
        private updateLights(entityCollector);
        /**
        * @inheritDoc
        */
        public pDraw(entityCollector: traverse.EntityCollector, target: textures.TextureProxyBase): void;
        /**
        * Draw the skybox if present.
        *
        * @param entityCollector The EntityCollector containing all potentially visible information.
        */
        private drawSkybox(entityCollector);
        private updateSkyboxProjection(camera);
        /**
        * Draw a list of renderables.
        *
        * @param renderables The renderables to draw.
        * @param entityCollector The EntityCollector containing all potentially visible information.
        */
        private drawRenderables(renderable, entityCollector, which);
        public dispose(): void;
        /**
        *
        */
        public pRenderDepthPrepass(entityCollector: traverse.EntityCollector): void;
        /**
        *
        */
        public pRenderSceneDepthToTexture(entityCollector: traverse.EntityCollector): void;
        /**
        * Updates the backbuffer dimensions.
        */
        public pUpdateBackBuffer(): void;
        public iSetStage(value: base.Stage): void;
        /**
        *
        */
        private initDepthTexture(context);
    }
}
/**
* @module away.render
*/
declare module away.render {
    /**
    * The DepthRenderer class renders 32-bit depth information encoded as RGBA
    *
    * @class away.render.DepthRenderer
    */
    class DepthRenderer extends RendererBase {
        private _activeMaterial;
        private _renderBlended;
        private _distanceBased;
        private _disableColor;
        /**
        * Creates a new DepthRenderer object.
        * @param renderBlended Indicates whether semi-transparent objects should be rendered.
        * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
        */
        constructor(renderBlended?: boolean, distanceBased?: boolean);
        public disableColor : boolean;
        public _iRenderCascades(entityCollector: traverse.ShadowCasterCollector, target: textures.TextureProxyBase, numCascades: number, scissorRects: geom.Rectangle[], cameras: entities.Camera[]): void;
        private drawCascadeRenderables(renderable, camera, cullPlanes);
        /**
        * @inheritDoc
        */
        public pDraw(entityCollector: traverse.EntityCollector, target: textures.TextureProxyBase): void;
        /**
        * Draw a list of renderables.
        * @param renderables The renderables to draw.
        * @param entityCollector The EntityCollector containing all potentially visible information.
        */
        private drawRenderables(renderable, entityCollector);
    }
}
/**
* @module away.render
*/
declare module away.render {
    /**
    * @class away.render.Filter3DRenderer
    */
    class Filter3DRenderer {
        private _filters;
        private _tasks;
        private _filterTasksInvalid;
        private _mainInputTexture;
        private _requireDepthRender;
        private _rttManager;
        private _stage;
        private _filterSizesInvalid;
        private _onRTTResizeDelegate;
        constructor(stage: base.Stage);
        private onRTTResize(event);
        public requireDepthRender : boolean;
        public getMainInputTexture(stage: base.Stage): stagegl.ITexture;
        public filters : filters.Filter3DBase[];
        private updateFilterTasks(stage);
        public render(stage: base.Stage, camera: entities.Camera, depthTexture: stagegl.ITexture): void;
        private updateFilterSizes();
        public dispose(): void;
    }
}
declare module away.animators {
    /**
    * ...
    */
    class AnimationRegisterCache extends materials.ShaderRegisterCache {
        public positionAttribute: materials.ShaderRegisterElement;
        public uvAttribute: materials.ShaderRegisterElement;
        public positionTarget: materials.ShaderRegisterElement;
        public scaleAndRotateTarget: materials.ShaderRegisterElement;
        public velocityTarget: materials.ShaderRegisterElement;
        public vertexTime: materials.ShaderRegisterElement;
        public vertexLife: materials.ShaderRegisterElement;
        public vertexZeroConst: materials.ShaderRegisterElement;
        public vertexOneConst: materials.ShaderRegisterElement;
        public vertexTwoConst: materials.ShaderRegisterElement;
        public uvTarget: materials.ShaderRegisterElement;
        public colorAddTarget: materials.ShaderRegisterElement;
        public colorMulTarget: materials.ShaderRegisterElement;
        public colorAddVary: materials.ShaderRegisterElement;
        public colorMulVary: materials.ShaderRegisterElement;
        public uvVar: materials.ShaderRegisterElement;
        public rotationRegisters: materials.ShaderRegisterElement[];
        public needFragmentAnimation: boolean;
        public needUVAnimation: boolean;
        public sourceRegisters: string[];
        public targetRegisters: string[];
        private indexDictionary;
        public hasUVNode: boolean;
        public needVelocity: boolean;
        public hasBillboard: boolean;
        public hasColorMulNode: boolean;
        public hasColorAddNode: boolean;
        constructor(profile: string);
        public reset(): void;
        public setUVSourceAndTarget(UVAttribute: string, UVVaring: string): void;
        public setRegisterIndex(node: AnimationNodeBase, parameterIndex: number, registerIndex: number): void;
        public getRegisterIndex(node: AnimationNodeBase, parameterIndex: number): number;
        public getInitCode(): string;
        public getCombinationCode(): string;
        public initColorRegisters(): string;
        public getColorPassCode(): string;
        public getColorCombinationCode(shadedTarget: string): string;
        private getRegisterFromString(code);
        public vertexConstantData: number[];
        public fragmentConstantData: number[];
        private _numVertexConstant;
        private _numFragmentConstant;
        public numVertexConstant : number;
        public numFragmentConstant : number;
        public setDataLength(): void;
        public setVertexConst(index: number, x?: number, y?: number, z?: number, w?: number): void;
        public setVertexConstFromArray(index: number, data: number[]): void;
        public setVertexConstFromMatrix(index: number, matrix: geom.Matrix3D): void;
        public setFragmentConst(index: number, x?: number, y?: number, z?: number, w?: number): void;
    }
}
declare module away.animators {
    interface IAnimationState {
        positionDelta: geom.Vector3D;
        offset(startTime: number): any;
        update(time: number): any;
        /**
        * Sets the animation phase of the node.
        *
        * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
        */
        phase(value: number): any;
    }
}
declare module away.animators {
    /**
    * Provides an abstract base class for data set classes that hold animation data for use in animator classes.
    *
    * @see away.animators.AnimatorBase
    */
    class AnimationSetBase extends library.NamedAssetBase implements library.IAsset {
        private _usesCPU;
        private _animations;
        private _animationNames;
        private _animationDictionary;
        constructor();
        /**
        * Retrieves a temporary GPU register that's still free.
        *
        * @param exclude An array of non-free temporary registers.
        * @param excludeAnother An additional register that's not free.
        * @return A temporary register that can be used.
        */
        public _pFindTempReg(exclude: string[], excludeAnother?: string): string;
        /**
        * Indicates whether the properties of the animation data contained within the set combined with
        * the vertex registers already in use on shading materials allows the animation data to utilise
        * GPU calls.
        */
        public usesCPU : boolean;
        /**
        * Called by the material to reset the GPU indicator before testing whether register space in the shader
        * is available for running GPU-based animation code.
        *
        * @private
        */
        public resetGPUCompatibility(): void;
        public cancelGPUCompatibility(): void;
        /**
        * @inheritDoc
        */
        public getAGALVertexCode(shaderObject: materials.ShaderObjectBase): string;
        /**
        * @inheritDoc
        */
        public activate(shaderObject: materials.ShaderObjectBase, stage: base.Stage): void;
        /**
        * @inheritDoc
        */
        public deactivate(shaderObject: materials.ShaderObjectBase, stage: base.Stage): void;
        /**
        * @inheritDoc
        */
        public getAGALFragmentCode(shaderObject: materials.ShaderObjectBase, shadedTarget: string): string;
        /**
        * @inheritDoc
        */
        public getAGALUVCode(shaderObject: materials.ShaderObjectBase): string;
        /**
        * @inheritDoc
        */
        public doneAGALCode(shaderObject: materials.ShaderObjectBase): void;
        /**
        * @inheritDoc
        */
        public assetType : string;
        /**
        * Returns a vector of animation state objects that make up the contents of the animation data set.
        */
        public animations : AnimationNodeBase[];
        /**
        * Returns a vector of animation state objects that make up the contents of the animation data set.
        */
        public animationNames : string[];
        /**
        * Check to determine whether a state is registered in the animation set under the given name.
        *
        * @param stateName The name of the animation state object to be checked.
        */
        public hasAnimation(name: string): boolean;
        /**
        * Retrieves the animation state object registered in the animation data set under the given name.
        *
        * @param stateName The name of the animation state object to be retrieved.
        */
        public getAnimation(name: string): AnimationNodeBase;
        /**
        * Adds an animation state object to the aniamtion data set under the given name.
        *
        * @param stateName The name under which the animation state object will be stored.
        * @param animationState The animation state object to be staored in the set.
        */
        public addAnimation(node: AnimationNodeBase): void;
        /**
        * Cleans up any resources used by the current object.
        */
        public dispose(): void;
    }
}
declare module away.animators {
    /**
    * Provides an abstract base class for animator classes that control animation output from a data set subtype of <code>AnimationSetBase</code>.
    *
    * @see away.animators.AnimationSetBase
    */
    class AnimatorBase extends library.NamedAssetBase implements IAnimator {
        private _broadcaster;
        private _isPlaying;
        private _autoUpdate;
        private _startEvent;
        private _stopEvent;
        private _cycleEvent;
        private _time;
        private _playbackSpeed;
        public _pAnimationSet: IAnimationSet;
        public _pOwners: entities.Mesh[];
        public _pActiveNode: AnimationNodeBase;
        public _pActiveState: IAnimationState;
        public _pActiveAnimationName: string;
        public _pAbsoluteTime: number;
        private _animationStates;
        /**
        * Enables translation of the animated mesh from data returned per frame via the positionDelta property of the active animation node. Defaults to true.
        *
        * @see away.animators.IAnimationState#positionDelta
        */
        public updatePosition: boolean;
        public getAnimationState(node: AnimationNodeBase): IAnimationState;
        public getAnimationStateByName(name: string): IAnimationState;
        /**
        * Returns the internal absolute time of the animator, calculated by the current time and the playback speed.
        *
        * @see #time
        * @see #playbackSpeed
        */
        public absoluteTime : number;
        /**
        * Returns the animation data set in use by the animator.
        */
        public animationSet : IAnimationSet;
        /**
        * Returns the current active animation state.
        */
        public activeState : IAnimationState;
        /**
        * Returns the current active animation node.
        */
        public activeAnimation : AnimationNodeBase;
        /**
        * Returns the current active animation node.
        */
        public activeAnimationName : string;
        /**
        * Determines whether the animators internal update mechanisms are active. Used in cases
        * where manual updates are required either via the <code>time</code> property or <code>update()</code> method.
        * Defaults to true.
        *
        * @see #time
        * @see #update()
        */
        public autoUpdate : boolean;
        /**
        * Gets and sets the internal time clock of the animator.
        */
        public time : number;
        /**
        * Sets the animation phase of the current active state's animation clip(s).
        *
        * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
        */
        public phase(value: number): void;
        /**
        * Creates a new <code>AnimatorBase</code> object.
        *
        * @param animationSet The animation data set to be used by the animator object.
        */
        constructor(animationSet: IAnimationSet);
        /**
        * The amount by which passed time should be scaled. Used to slow down or speed up animations. Defaults to 1.
        */
        public playbackSpeed : number;
        public setRenderState(shaderObject: materials.ShaderObjectBase, renderable: pool.RenderableBase, stage: base.Stage, camera: entities.Camera, vertexConstantOffset: number, vertexStreamOffset: number): void;
        /**
        * Resumes the automatic playback clock controling the active state of the animator.
        */
        public start(): void;
        /**
        * Pauses the automatic playback clock of the animator, in case manual updates are required via the
        * <code>time</code> property or <code>update()</code> method.
        *
        * @see #time
        * @see #update()
        */
        public stop(): void;
        /**
        * Provides a way to manually update the active state of the animator when automatic
        * updates are disabled.
        *
        * @see #stop()
        * @see #autoUpdate
        */
        public update(time: number): void;
        public reset(name: string, offset?: number): void;
        /**
        * Used by the mesh object to which the animator is applied, registers the owner for internal use.
        *
        * @private
        */
        public addOwner(mesh: entities.Mesh): void;
        /**
        * Used by the mesh object from which the animator is removed, unregisters the owner for internal use.
        *
        * @private
        */
        public removeOwner(mesh: entities.Mesh): void;
        /**
        * Internal abstract method called when the time delta property of the animator's contents requires updating.
        *
        * @private
        */
        public _pUpdateDeltaTime(dt: number): void;
        /**
        * Enter frame event handler for automatically updating the active state of the animator.
        */
        private onEnterFrame(event?);
        private applyPositionDelta();
        /**
        *  for internal use.
        *
        * @private
        */
        public dispatchCycleEvent(): void;
        /**
        * @inheritDoc
        */
        public clone(): AnimatorBase;
        /**
        * @inheritDoc
        */
        public dispose(): void;
        /**
        * @inheritDoc
        */
        public testGPUCompatibility(shaderObject: materials.ShaderObjectBase): void;
        /**
        * @inheritDoc
        */
        public assetType : string;
        public getRenderableSubGeometry(renderable: pool.TriangleSubMeshRenderable, sourceSubGeometry: base.TriangleSubGeometry): base.TriangleSubGeometry;
    }
}
declare module away.filters {
    class Filter3DTaskBase {
        private _mainInputTexture;
        private _scaledTextureWidth;
        private _scaledTextureHeight;
        private _textureWidth;
        private _textureHeight;
        private _textureDimensionsInvalid;
        private _program3DInvalid;
        private _program3D;
        private _target;
        private _requireDepthRender;
        private _textureScale;
        constructor(requireDepthRender?: boolean);
        /**
        * The texture scale for the input of this texture. This will define the output of the previous entry in the chain
        */
        public textureScale : number;
        public target : stagegl.ITexture;
        public textureWidth : number;
        public textureHeight : number;
        public getMainInputTexture(stage: base.Stage): stagegl.ITexture;
        public dispose(): void;
        public pInvalidateProgram(): void;
        public pUpdateProgram(stage: base.Stage): void;
        public pGetVertexCode(): string;
        public pGetFragmentCode(): string;
        public pUpdateTextures(stage: base.Stage): void;
        public getProgram(stage: base.Stage): stagegl.IProgram;
        public activate(stage: base.Stage, camera: entities.Camera, depthTexture: stagegl.ITexture): void;
        public deactivate(stage: base.Stage): void;
        public requireDepthRender : boolean;
    }
}
declare module away.filters {
    class Filter3DBase {
        private _tasks;
        private _requireDepthRender;
        private _textureWidth;
        private _textureHeight;
        constructor();
        public requireDepthRender : boolean;
        public pAddTask(filter: Filter3DTaskBase): void;
        public tasks : Filter3DTaskBase[];
        public getMainInputTexture(stage: base.Stage): stagegl.ITexture;
        public textureWidth : number;
        public textureHeight : number;
        public setRenderTargets(mainTarget: stagegl.ITexture, stage: base.Stage): void;
        public dispose(): void;
        public update(stage: base.Stage, camera: entities.Camera): void;
    }
}
declare module away {
    class StageGLContext extends events.EventDispatcher {
        constructor();
    }
}
