import { Matrix3D } from "@awayjs/core/lib/geom/Matrix3D";
import { Camera } from "@awayjs/display/lib/display/Camera";
import { Stage } from "@awayjs/stage/lib/base/Stage";
import { ILightingPass } from "../surfaces/passes/ILightingPass";
import { ShaderBase } from "../shaders/ShaderBase";
import { CompilerBase } from "../shaders/compilers/CompilerBase";
import { IElementsClassGL } from "../elements/IElementsClassGL";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
/**
 * ShaderBase keeps track of the number of dependencies for "named registers" used across a pass.
 * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
 * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
 * each time a method has been compiled into the shader.
 *
 * @see RegisterPool.addUsage
 */
export declare class LightingShader extends ShaderBase {
    _lightingPass: ILightingPass;
    private _includeCasters;
    /**
     * The first index for the fragment constants containing the light data.
     */
    lightFragmentConstantIndex: number;
    /**
     * The starting index if the vertex constant to which light data needs to be uploaded.
     */
    lightVertexConstantIndex: number;
    /**
     * Indices for the light probe diffuse textures.
     */
    lightProbeDiffuseIndices: Array<number>;
    /**
     * Indices for the light probe specular textures.
     */
    lightProbeSpecularIndices: Array<number>;
    /**
     * The index of the fragment constant containing the weights for the light probes.
     */
    probeWeightsIndex: number;
    numDirectionalLights: number;
    numPointLights: number;
    numLightProbes: number;
    usesLightFallOff: boolean;
    usesShadows: boolean;
    /**
     * Indicates whether the shader uses any lights.
     */
    usesLights: boolean;
    /**
     * Indicates whether the shader uses any light probes.
     */
    usesProbes: boolean;
    /**
     * Indicates whether the lights uses any specular components.
     */
    usesLightsForSpecular: boolean;
    /**
     * Indicates whether the probes uses any specular components.
     */
    usesProbesForSpecular: boolean;
    /**
     * Indicates whether the lights uses any diffuse components.
     */
    usesLightsForDiffuse: boolean;
    /**
     * Indicates whether the probes uses any diffuse components.
     */
    usesProbesForDiffuse: boolean;
    /**
     * Creates a new MethodCompilerVO object.
     */
    constructor(elementsClass: IElementsClassGL, lightingPass: ILightingPass, stage: Stage);
    _iIncludeDependencies(): void;
    /**
     * Factory method to create a concrete compiler object for this object
     *
     * @param materialPassVO
     * @returns {away.materials.LightingCompiler}
     */
    createCompiler(elementsClass: IElementsClassGL, pass: ILightingPass): CompilerBase;
    /**
     *
     *
     * @param renderable
     * @param stage
     * @param camera
     */
    _setRenderState(renderable: GL_RenderableBase, camera: Camera, viewProjection: Matrix3D): void;
    /**
     * Updates constant data render state used by the lights. This method is optional for subclasses to implement.
     */
    private updateLights();
    /**
     * Updates constant data render state used by the light probes. This method is optional for subclasses to implement.
     */
    private updateProbes();
}
