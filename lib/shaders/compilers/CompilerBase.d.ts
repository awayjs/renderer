import { ShaderBase } from "../../shaders/ShaderBase";
import { ShaderRegisterCache } from "../../shaders/ShaderRegisterCache";
import { ShaderRegisterData } from "../../shaders/ShaderRegisterData";
import { ShaderRegisterElement } from "../../shaders/ShaderRegisterElement";
import { IPass } from "../../surfaces/passes/IPass";
import { IElementsClassGL } from "../../elements/IElementsClassGL";
/**
 * CompilerBase is an abstract base class for shader compilers that use modular shader methods to assemble a
 * material. Concrete subclasses are used by the default materials.
 *
 * @see away.materials.ShadingMethodBase
 */
export declare class CompilerBase {
    _pShader: ShaderBase;
    _pSharedRegisters: ShaderRegisterData;
    _pRegisterCache: ShaderRegisterCache;
    _pElementsClass: IElementsClassGL;
    _pRenderPass: IPass;
    _pVertexCode: string;
    _pFragmentCode: string;
    _pPostAnimationFragmentCode: string;
    /**
     * Creates a new CompilerBase object.
     * @param profile The compatibility profile of the renderer.
     */
    constructor(elementsClass: IElementsClassGL, pass: IPass, shader: ShaderBase);
    /**
     * Compiles the code after all setup on the compiler has finished.
     */
    compile(): void;
    /**
     * Calculate the transformed colours
     */
    private compileColorTransformCode();
    /**
     * Compile the code for the methods.
     */
    pCompileDependencies(): void;
    private compileGlobalPositionCode();
    private compilePositionCode();
    private compileCurvesCode();
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
    compileViewDirCode(): void;
    /**
     * Calculate the normal.
     */
    compileNormalCode(): void;
    /**
     * Reset all the indices to "unused".
     */
    pInitRegisterIndices(): void;
    /**
     * Disposes all resources used by the compiler.
     */
    dispose(): void;
    /**
     * The generated vertex code.
     */
    readonly vertexCode: string;
    /**
     * The generated fragment code.
     */
    readonly fragmentCode: string;
    /**
     * The generated fragment code.
     */
    readonly postAnimationFragmentCode: string;
    /**
     * The register containing the final shaded colour.
     */
    readonly shadedTarget: ShaderRegisterElement;
}
