import { Image2D } from "@awayjs/core/lib/image/Image2D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { IProgram } from "@awayjs/stage/lib/base/IProgram";
import { RTTBufferManager } from "../../managers/RTTBufferManager";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
import { ShaderRegisterElement } from "../../shaders/ShaderRegisterElement";
export declare class Filter3DTaskBase {
    _registerCache: ShaderRegisterCache;
    _positionIndex: number;
    _uvIndex: number;
    _inputTextureIndex: number;
    _uvVarying: ShaderRegisterElement;
    private _mainInputTexture;
    _scaledTextureWidth: number;
    _scaledTextureHeight: number;
    _rttManager: RTTBufferManager;
    _textureWidth: number;
    _textureHeight: number;
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
    textureScale: number;
    target: Image2D;
    rttManager: RTTBufferManager;
    textureWidth: number;
    textureHeight: number;
    getMainInputTexture(stage: Stage): Image2D;
    dispose(): void;
    invalidateProgram(): void;
    updateProgram(stage: Stage): void;
    getVertexCode(): string;
    getFragmentCode(): string;
    updateTextures(stage: Stage): void;
    getProgram(stage: Stage): IProgram;
    activate(stage: Stage, camera: Camera, depthTexture: Image2D): void;
    deactivate(stage: Stage): void;
    readonly requireDepthRender: boolean;
}
