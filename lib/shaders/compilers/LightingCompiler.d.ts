import { LightingShader } from "../../shaders/LightingShader";
import { CompilerBase } from "../../shaders/compilers/CompilerBase";
import { ShaderRegisterElement } from "../../shaders/ShaderRegisterElement";
import { ILightingPass } from "../../surfaces/passes/ILightingPass";
import { IElementsClassGL } from "../../elements/IElementsClassGL";
/**
 * CompilerBase is an abstract base class for shader compilers that use modular shader methods to assemble a
 * material. Concrete subclasses are used by the default materials.
 *
 * @see away.materials.ShadingMethodBase
 */
export declare class LightingCompiler extends CompilerBase {
    private _shaderLightingObject;
    private _lightingPass;
    _pointLightFragmentConstants: Array<ShaderRegisterElement>;
    _pointLightVertexConstants: Array<ShaderRegisterElement>;
    _dirLightFragmentConstants: Array<ShaderRegisterElement>;
    _dirLightVertexConstants: Array<ShaderRegisterElement>;
    _pNumProbeRegisters: number;
    /**
     * Creates a new CompilerBase object.
     * @param profile The compatibility profile of the renderer.
     */
    constructor(elementsClass: IElementsClassGL, lightingPass: ILightingPass, shaderLightingObject: LightingShader);
    /**
     * Compile the code for the methods.
     */
    pCompileDependencies(): void;
    /**
     * Provides the code to provide shadow mapping.
     */
    pCompileShadowCode(): void;
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
    pInitRegisterIndices(): void;
}
