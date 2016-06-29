import { AnimationNodeBase } from "@awayjs/display/lib/animators/nodes/AnimationNodeBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "../../shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "../../shaders/ShaderRegisterElement";
/**
 * ...
 */
export declare class AnimationRegisterData {
    weightsIndex: number;
    poseIndices: Array<number>;
    positionAttribute: ShaderRegisterElement;
    uvAttribute: ShaderRegisterElement;
    positionTarget: ShaderRegisterElement;
    scaleAndRotateTarget: ShaderRegisterElement;
    velocityTarget: ShaderRegisterElement;
    vertexTime: ShaderRegisterElement;
    vertexLife: ShaderRegisterElement;
    vertexZeroConst: ShaderRegisterElement;
    vertexOneConst: ShaderRegisterElement;
    vertexTwoConst: ShaderRegisterElement;
    uvTarget: ShaderRegisterElement;
    colorAddTarget: ShaderRegisterElement;
    colorMulTarget: ShaderRegisterElement;
    colorAddVary: ShaderRegisterElement;
    colorMulVary: ShaderRegisterElement;
    uvVar: ShaderRegisterElement;
    rotationRegisters: Array<ShaderRegisterElement>;
    private indexDictionary;
    constructor();
    reset(registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData, needVelocity: boolean): void;
    setUVSourceAndTarget(sharedRegisters: ShaderRegisterData): void;
    setRegisterIndex(node: AnimationNodeBase, parameterIndex: number, registerIndex: number): void;
    getRegisterIndex(node: AnimationNodeBase, parameterIndex: number): number;
}
