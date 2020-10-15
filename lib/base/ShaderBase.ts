import { AssetBase, AbstractionBase, Matrix, Matrix3D, Vector3D, ColorTransform, ArgumentError, IAssetClass, IAbstractionPool, ProjectionBase, ByteArray, IAbstractionClass } from '@awayjs/core';

import { AGALMiniAssembler, ContextGLProfile, ContextGLBlendFactor, ContextGLCompareMode, ContextGLTriangleFace, ProgramData, Stage, BlendMode, ShaderRegisterCache, ShaderRegisterData, ShaderRegisterElement, RegisterPool } from '@awayjs/stage';

import { _Render_RenderableBase } from './_Render_RenderableBase';
import { _Render_ElementsBase } from './_Render_ElementsBase';
import { IAnimationSet } from './IAnimationSet';
import { IAnimator } from './IAnimator';
import { AnimationRegisterData } from './AnimationRegisterData';
import { IPass } from './IPass';
import { _Render_MaterialBase } from './_Render_MaterialBase';
import { _Stage_ElementsBase } from './_Stage_ElementsBase';
import { View } from '@awayjs/view';

/**
 * ShaderBase keeps track of the number of dependencies for "named registers" used across a pass.
 * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
 * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
 * each time a method has been compiled into the shader.
 *
 * @see RegisterPool.addUsage
 */
export class ShaderBase implements IAbstractionPool {
	public static _abstractionClassPool: Object = new Object();

	private _abstractionPool: Object = new Object();

	private _renderElements: _Render_ElementsBase;
	private _renderMaterial: _Render_MaterialBase;
	private _view: View;
	private _pass: IPass;
	public _stage: Stage;
	private _programData: ProgramData;

	private _blendFactorSource: ContextGLBlendFactor = ContextGLBlendFactor.ONE;
	private _blendFactorDest: ContextGLBlendFactor = ContextGLBlendFactor.ZERO;

	private _invalidProgram: boolean = true;
	private _animationVertexCode: string = '';
	private _animationFragmentCode: string = '';
	private _numUsedVertexConstants: number;
	private _numUsedFragmentConstants: number;
	private _numUsedStreams: number;
	private _numUsedTextures: number;
	private _usesAnimation: boolean;

	protected _sharedRegisters: ShaderRegisterData;
	protected _registerCache: ShaderRegisterCache;
	protected _vertexCode: string = '';
	protected _fragmentCode: string = '';
	protected _postAnimationFragmentCode: string = '';

	public get view(): View {
		return this._view;
	}

	public get stage(): Stage {
		return this._stage;
	}

	public get pass(): IPass {
		return this._pass;
	}

	public get renderMaterial(): _Render_MaterialBase {
		return this._renderMaterial;
	}

	public get programData(): ProgramData {
		if (this._invalidProgram)
			this._updateProgram();

		return this._programData;
	}

	public usesBlending: boolean = false;

	public useImageRect: boolean = false;

	public usesCurves: boolean = false;

	/**
     *
     */
	public activeElements: _Stage_ElementsBase;

	/**
	 * The depth compare mode used to render the renderables using this material.
	 *
	 * @see away.stagegl.ContextGLCompareMode
	 */
	public depthCompareMode: ContextGLCompareMode = ContextGLCompareMode.LESS_EQUAL;

	/**
	 * Indicate whether the shader should write to the depth buffer or not. Ignored when blending is enabled.
	 */
	public writeDepth: boolean = true;

	public profile: ContextGLProfile;

	public get usesAnimation(): boolean {
		return this._usesAnimation;
	}

	public set usesAnimation(value: boolean) {
		if (this._usesAnimation == value)
			return;

		this._usesAnimation = value;

		this.invalidateProgram();
	}

	private _defaultCulling: ContextGLTriangleFace = ContextGLTriangleFace.BACK;

	public _pInverseSceneMatrix: Float32Array = new Float32Array(16);

	public animationRegisterData: AnimationRegisterData;

	public get numUsedVertexConstants(): number {
		if (this._invalidProgram)
			this._updateProgram();

		return this._numUsedVertexConstants;
	}

	public get numUsedFragmentConstants(): number {
		if (this._invalidProgram)
			this._updateProgram();

		return this._numUsedFragmentConstants;
	}

	/**
	 * The amount of used vertex streams in the vertex code. Used by the animation code generation to know from which index on streams are available.
	 */
	public get numUsedStreams(): number {
		if (this._invalidProgram)
			this._updateProgram();

		return this._numUsedStreams;
	}

	/**
	 *
	 */
	public get numUsedTextures(): number {
		if (this._invalidProgram)
			this._updateProgram();

		return this._numUsedTextures;
	}

	public numLights: number;

	public usesPremultipliedAlpha: boolean;
	public useBothSides: boolean;
	public usesUVTransform: boolean;
	public usesColorTransform: boolean;
	public alphaThreshold: number;

	//set ambient values to default
	public ambientR: number = 0xFF;
	public ambientG: number = 0xFF;
	public ambientB: number = 0xFF;

	/**
	 *
	 */
	public usesCommonData: boolean;

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
	 * The amount of dependencies on the vertex color.
	 */
	public colorDependencies: number;

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
	public outputsColors: boolean;

	/**
	 * Indicates whether or not normals are output.
	 */
	public outputsNormals: boolean;

	/**
	 * Indicates whether or not normal calculations are output in tangent space.
	 */
	public outputsTangentNormals: boolean;

	/**
	 * Indicates whether or not normal calculations are expected in tangent space. This is only the case if no world-space
	 * dependencies exist and normals are being output.
	 */
	public usesTangentSpace: boolean;

	/**
	 * Indicates whether there are any dependencies on the world-space position vector.
	 */
	public usesGlobalPosFragment: boolean = false;

	/**
	 * Indicates whether there are any dependencies on the local position vector.
	 */
	public usesPositionFragment: boolean = false;

	public vertexConstantData: Float32Array;
	public fragmentConstantData: Float32Array;

	public viewMatrix: Matrix3D;
	public sceneMatrix: Matrix3D;
	public sceneNormalMatrix: Matrix3D;

	/**
	 * The index for the common data register.
	 */
	public commonsDataIndex: number;

	/**
	 * The index for the curve vertex attribute stream.
	 */
	public curvesIndex: number;

	/**
	 * The index for the UV vertex attribute stream.
	 */
	public uvIndex: number;

	/**
	 * The index for the secondary UV vertex attribute stream.
	 */
	public secondaryUVIndex: number;

	/**
	 * The index for the vertex normal attribute stream.
	 */
	public normalIndex: number;

	/**
	 * The index for the color attribute stream.
	 */
	public colorBufferIndex: number;

	/**
	 * The index for the vertex tangent attribute stream.
	 */
	public tangentIndex: number;

	/**
	 *
	 */
	public skyboxScaleIndex: number;

	/**
	 *
	 */
	public scenePositionIndex: number;

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
	public uvMatrixIndex: number;

	/**
	 * The index for the color transform fragment constant.
	 */
	public colorTransformIndex: number;

	/**
	 *
	 */
	public jointIndexIndex: number;

	/**
	 *
	 */
	public jointWeightIndex: number;

	/**
	 *
	 */
	public imageIndices: Array<number> = new Array<number>();

	/**
	 * Creates a new MethodCompilerVO object.
	 */
	constructor(renderElements: _Render_ElementsBase, renderMaterial: _Render_MaterialBase, pass: IPass, stage: Stage) {
		this._renderElements = renderElements;
		this._renderMaterial = renderMaterial;
		this._pass = pass;
		this._stage = stage;
		this._view = renderElements.renderGroup.view;

		this.profile = this._stage.profile;
	}

	public getAbstraction(asset: AssetBase): AbstractionBase {
		return (this._abstractionPool[asset.id] || (this._abstractionPool[asset.id] = new (<IAbstractionClass> ShaderBase._abstractionClassPool[asset.assetType])(asset, this)));
	}

	/**
	 *
	 * @param image
	 */
	public clearAbstraction(asset: AssetBase): void {
		delete this._abstractionPool[asset.id];
	}

	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerAbstraction(abstractionClass: IAbstractionClass, assetClass: IAssetClass): void {
		ShaderBase._abstractionClassPool[assetClass.assetType] = abstractionClass;
	}

	public _includeDependencies(): void {
		this._renderMaterial.renderElements._includeDependencies(this);

		this._pass._includeDependencies(this);

		//this.usesCommonData = this.usesCurves || this.usesCommonData;
	}

	/**
	 * Clears dependency counts for all registers. Called when recompiling a pass.
	 */
	public reset(): void {
		this.projectionDependencies = 0;
		this.normalDependencies = 0;
		this.colorDependencies = 0;
		this.viewDirDependencies = 0;
		this.uvDependencies = 0;
		this.secondaryUVDependencies = 0;
		this.globalPosDependencies = 0;
		this.tangentDependencies = 0;
		this.usesCommonData = false;
		this.usesGlobalPosFragment = false;
		this.usesPositionFragment = false;
		this.usesFragmentAnimation = false;
		this.usesTangentSpace = false;
		this.outputsNormals = false;
		this.outputsTangentNormals = false;
	}

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
	public setBlendMode(value: string): void {
		switch (value) {
			case BlendMode.NORMAL:
				this._blendFactorSource = ContextGLBlendFactor.ONE;
				this._blendFactorDest = ContextGLBlendFactor.ZERO;
				this.usesBlending = false;
				this.usesPremultipliedAlpha = false;
				break;

			case BlendMode.LAYER:
				this._blendFactorSource = ContextGLBlendFactor.ONE;
				this._blendFactorDest = ContextGLBlendFactor.ONE_MINUS_SOURCE_ALPHA;
				this.usesBlending = true;
				this.usesPremultipliedAlpha = true;
				break;

			case BlendMode.MULTIPLY:
				this._blendFactorSource = ContextGLBlendFactor.ZERO;
				this._blendFactorDest = ContextGLBlendFactor.SOURCE_COLOR;
				this.usesBlending = true;
				this.usesPremultipliedAlpha = true;
				break;

			case BlendMode.ADD:
				this._blendFactorSource = ContextGLBlendFactor.ONE;
				this._blendFactorDest = ContextGLBlendFactor.ONE;
				this.usesBlending = true;
				this.usesPremultipliedAlpha = true;
				break;

			case BlendMode.ALPHA:
				this._blendFactorSource = ContextGLBlendFactor.ZERO;
				this._blendFactorDest = ContextGLBlendFactor.SOURCE_ALPHA;
				this.usesBlending = true;
				this.usesPremultipliedAlpha = false;
				break;

			default:
				throw new ArgumentError('Unsupported blend mode!');
		}
	}

	/**
	 * @inheritDoc
	 */
	public _activate(): void {
		if (!this.programData.program) {
			this.programData.program = this._stage.context.createProgram();
			const vertexByteCode: ByteArray = (new AGALMiniAssembler().assemble('part vertex 1\n' + this.programData.vertexString + 'endpart'))['vertex'].data;
			const fragmentByteCode: ByteArray = (new AGALMiniAssembler().assemble('part fragment 1\n' + this.programData.fragmentString + 'endpart'))['fragment'].data;
			this.programData.program.upload(vertexByteCode, fragmentByteCode);
		}

		//set program data
		this._stage.context.setProgram(this.programData.program);
		this._stage.context.setCulling(this.useBothSides ? ContextGLTriangleFace.NONE : this._defaultCulling, this._view.projection.coordinateSystem);

		if (!this.usesTangentSpace && this.cameraPositionIndex >= 0) {
			const pos: Vector3D = this._view.projection.transform.concatenatedMatrix3D.position;

			this.vertexConstantData[this.cameraPositionIndex] = pos.x;
			this.vertexConstantData[this.cameraPositionIndex + 1] = pos.y;
			this.vertexConstantData[this.cameraPositionIndex + 2] = pos.z;
		}

		this._stage.context.setDepthTest((this.writeDepth && !this.usesBlending), this.depthCompareMode);

		this._stage.context.setBlendFactors(this._blendFactorSource, this._blendFactorDest);

		this.activeElements = null;
	}

	/**
	 * @inheritDoc
	 */
	public _deactivate(): void {
		//For the love of god don't remove this if you want your multi-material shadows to not flicker like shit
		this._stage.context.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL);

		this.activeElements = null;
	}

	/**
	 *
	 *
	 * @param renderable
	 * @param stage
	 * @param camera
	 */
	public _setRenderState(renderState: _Render_RenderableBase): void {
		if (renderState.sourceEntity.animator)
			(<IAnimator> renderState.sourceEntity.animator).setRenderState(this, renderState);

		let rawData: Float32Array;

		if (this.usesUVTransform) {
			const uvMatrix: Matrix = renderState.uvMatrix;

			if (uvMatrix) {
				//transpose
				rawData = uvMatrix.rawData;
				this.vertexConstantData[this.uvMatrixIndex] = rawData[0];
				this.vertexConstantData[this.uvMatrixIndex + 1] = rawData[2];
				this.vertexConstantData[this.uvMatrixIndex + 3] = rawData[4];
				this.vertexConstantData[this.uvMatrixIndex + 4] = rawData[1];
				this.vertexConstantData[this.uvMatrixIndex + 5] = rawData[3];
				this.vertexConstantData[this.uvMatrixIndex + 7] = rawData[5];
			} else {
				this.vertexConstantData[this.uvMatrixIndex] = 1;
				this.vertexConstantData[this.uvMatrixIndex + 1] = 0;
				this.vertexConstantData[this.uvMatrixIndex + 3] = 0;
				this.vertexConstantData[this.uvMatrixIndex + 4] = 0;
				this.vertexConstantData[this.uvMatrixIndex + 5] = 1;
				this.vertexConstantData[this.uvMatrixIndex + 7] = 0;
			}
		}
		if (this.usesColorTransform) {

			const colorTransform: ColorTransform = renderState.sourceEntity._iAssignedColorTransform();

			if (colorTransform) {
				//TODO: AWDParser to write normalised color offsets
				rawData = colorTransform._rawData;
				this.fragmentConstantData[this.colorTransformIndex] = rawData[0];
				this.fragmentConstantData[this.colorTransformIndex + 1] = rawData[1];
				this.fragmentConstantData[this.colorTransformIndex + 2] = rawData[2];
				this.fragmentConstantData[this.colorTransformIndex + 3] = rawData[3];
				this.fragmentConstantData[this.colorTransformIndex + 4] = rawData[4] / 255;
				this.fragmentConstantData[this.colorTransformIndex + 5] = rawData[5] / 255;
				this.fragmentConstantData[this.colorTransformIndex + 6] = rawData[6] / 255;
				this.fragmentConstantData[this.colorTransformIndex + 7] = rawData[7] / 255;
			} else {
				this.fragmentConstantData[this.colorTransformIndex] = 1;
				this.fragmentConstantData[this.colorTransformIndex + 1] = 1;
				this.fragmentConstantData[this.colorTransformIndex + 2] = 1;
				this.fragmentConstantData[this.colorTransformIndex + 3] = 1;
				this.fragmentConstantData[this.colorTransformIndex + 4] = 0;
				this.fragmentConstantData[this.colorTransformIndex + 5] = 0;
				this.fragmentConstantData[this.colorTransformIndex + 6] = 0;
				this.fragmentConstantData[this.colorTransformIndex + 7] = 0;
			}
		}
		if (this.sceneNormalMatrixIndex >= 0) {
			this.sceneNormalMatrix.copyFrom(renderState.sourceEntity.transform.inverseConcatenatedMatrix3D);
		}

		if (this.usesTangentSpace && this.cameraPositionIndex >= 0) {

			renderState.sourceEntity.transform.inverseConcatenatedMatrix3D.copyRawDataTo(this._pInverseSceneMatrix);
			const pos: Vector3D = this._view.projection.transform.concatenatedMatrix3D.position;
			const x: number = pos.x;
			const y: number = pos.y;
			const z: number = pos.z;

			this.vertexConstantData[this.cameraPositionIndex] = this._pInverseSceneMatrix[0] * x + this._pInverseSceneMatrix[4] * y + this._pInverseSceneMatrix[8] * z + this._pInverseSceneMatrix[12];
			this.vertexConstantData[this.cameraPositionIndex + 1] = this._pInverseSceneMatrix[1] * x + this._pInverseSceneMatrix[5] * y + this._pInverseSceneMatrix[9] * z + this._pInverseSceneMatrix[13];
			this.vertexConstantData[this.cameraPositionIndex + 2] = this._pInverseSceneMatrix[2] * x + this._pInverseSceneMatrix[6] * y + this._pInverseSceneMatrix[10] * z + this._pInverseSceneMatrix[14];
		}
	}

	public invalidateProgram(): void {
		this._invalidProgram = true;
	}

	public dispose(): void {
		this._programData.dispose();
		this._programData = null;

		this._registerCache.dispose();
		this._registerCache = null;
		this._sharedRegisters = null;
	}

	private _updateProgram(): void {
		this._invalidProgram = false;

		this._sharedRegisters = new ShaderRegisterData();
		this._registerCache = new ShaderRegisterCache(this.profile);

		this.reset();

		this._includeDependencies();

		this._initRegisterIndices();

		this._compileDependencies();

		//compile custom vertex & fragment codes from pass
		this._vertexCode += this._pass._getVertexCode(this._registerCache, this._sharedRegisters);
		this._fragmentCode += this._pass._getFragmentCode(this._registerCache, this._sharedRegisters);
		this._postAnimationFragmentCode += this._pass._getPostAnimationFragmentCode(this._registerCache, this._sharedRegisters);

		//check if alpha needs to be pre-multipled
		if (this.usesPremultipliedAlpha)
			this._postAnimationFragmentCode += 'mul ' + this._sharedRegisters.shadedTarget + '.xyz, ' + this._sharedRegisters.shadedTarget + ', ' + this._sharedRegisters.shadedTarget + '.w\n';

		//assign the final output color to the output register
		this._postAnimationFragmentCode += 'mov ' + this._registerCache.fragmentOutputRegister + ', ' + this._sharedRegisters.shadedTarget + '\n';
		this._registerCache.removeFragmentTempUsage(this._sharedRegisters.shadedTarget);

		this._compileAnimationCode();

		//initialise the required shader constants
		this._initConstantData();

		const programData: ProgramData = this._stage.getProgramData(this._animationVertexCode + this._vertexCode, this._fragmentCode + this._animationFragmentCode + this._postAnimationFragmentCode);

		//check program data hasn't changed, keep count of program usages
		if (this._programData != programData) {
			if (this._programData)
				this._programData.dispose();

			this._programData = programData;

			programData.usages++;
		}
	}

	/**
     * Reset all the indices to "unused".
     */
	protected _initRegisterIndices(): void {
		this.commonsDataIndex = -1;
		this.cameraPositionIndex = -1;
		this.curvesIndex = -1;
		this.uvIndex = -1;
		this.uvMatrixIndex = -1;
		this.colorTransformIndex = -1;
		this.secondaryUVIndex = -1;
		this.normalIndex = -1;
		this.colorBufferIndex = -1;
		this.tangentIndex = -1;
		this.sceneMatrixIndex = -1;
		this.sceneNormalMatrixIndex = -1;
		this.jointIndexIndex = -1;
		this.jointWeightIndex = -1;
		this.imageIndices.length = 0;

		this._sharedRegisters.animatedPosition = this._registerCache.getFreeVertexVectorTemp();
		this._registerCache.addVertexTempUsages(this._sharedRegisters.animatedPosition, 1);

		this._sharedRegisters.animatableAttributes.push(this._registerCache.getFreeVertexAttribute());
		this._sharedRegisters.animationTargetRegisters.push(this._sharedRegisters.animatedPosition);
		this._vertexCode = '';
		this._fragmentCode = '';
		this._postAnimationFragmentCode = '';

		//create commonly shared constant registers
		if (this.usesCommonData || this.normalDependencies > 0) {
			this._sharedRegisters.commons = this._registerCache.getFreeFragmentConstant();
			this.commonsDataIndex = this._sharedRegisters.commons.index * 4;
		}

		//Creates the registers to contain the tangent data.
		//Needs to be created FIRST and in this order (for when using tangent space)
		if (this.tangentDependencies > 0 || this.outputsNormals) {
			this._sharedRegisters.tangentInput = this._registerCache.getFreeVertexAttribute();
			this.tangentIndex = this._sharedRegisters.tangentInput.index;

			this._sharedRegisters.animatedTangent = this._registerCache.getFreeVertexVectorTemp();
			this._registerCache.addVertexTempUsages(this._sharedRegisters.animatedTangent, 1);

			if (this.usesTangentSpace) {
				this._sharedRegisters.bitangent = this._registerCache.getFreeVertexVectorTemp();
				this._registerCache.addVertexTempUsages(this._sharedRegisters.bitangent, 1);
			}

			this._sharedRegisters.animatableAttributes.push(this._sharedRegisters.tangentInput);
			this._sharedRegisters.animationTargetRegisters.push(this._sharedRegisters.animatedTangent);
		}

		if (this.normalDependencies > 0) {
			this._sharedRegisters.normalInput = this._registerCache.getFreeVertexAttribute();
			this.normalIndex = this._sharedRegisters.normalInput.index;

			this._sharedRegisters.animatedNormal = this._registerCache.getFreeVertexVectorTemp();
			this._registerCache.addVertexTempUsages(this._sharedRegisters.animatedNormal, 1);

			this._sharedRegisters.animatableAttributes.push(this._sharedRegisters.normalInput);
			this._sharedRegisters.animationTargetRegisters.push(this._sharedRegisters.animatedNormal);
		}

		if (this.uvDependencies > 0) {
			this._sharedRegisters.uvInput = this._registerCache.getFreeVertexAttribute();
			this.uvIndex = this._sharedRegisters.uvInput.index;

			if (!this.usesUVTransform) {
				this._sharedRegisters.animatedUV = this._registerCache.getFreeVertexVectorTemp();
				this._registerCache.addVertexTempUsages(this._sharedRegisters.animatedUV, 1);
			}
		}

		this._sharedRegisters.shadedTarget = this._registerCache.getFreeFragmentVectorTemp();
		this._registerCache.addFragmentTempUsages(this._sharedRegisters.shadedTarget, 1);
	}

	/**
     * Compile the code for the methods.
     */
	protected _compileDependencies(): void {
		if (this.colorDependencies > 0)
        	this._compileColorCode();

		//compile the world-space position if required
		if (this.globalPosDependencies > 0)
			this._compileGlobalPositionCode();

		//compile the local-space position if required
		if (this.usesPositionFragment)
			this._compilePositionCode();

		if (this.usesCurves)
			this._compileCurvesCode();

		if (this.usesColorTransform)
			this._compileColorTransformCode();

		//Calculate the (possibly animated) UV coordinates.
		if (this.uvDependencies > 0)
			this._compileUVCode();

		if (this.secondaryUVDependencies > 0)
			this._compileSecondaryUVCode();

		if (this.normalDependencies > 0)
			this._compileNormalCode();

		if (this.viewDirDependencies > 0)
			this._compileViewDirCode();

		//collect code from elements
		this._vertexCode += this._renderElements._getVertexCode(this, this._registerCache, this._sharedRegisters);
		this._fragmentCode += this._renderElements._getFragmentCode(this, this._registerCache, this._sharedRegisters);
	}

	/**
     * Initializes the unchanging constant data for this shader object.
     */
	protected _initConstantData(): void {
		const rc = this._registerCache;

		//Updates the amount of used register indices.
		const usedVC = this._numUsedVertexConstants = rc.numUsedVertexConstants;
		const usedFC = this._numUsedFragmentConstants = rc.numUsedFragmentConstants;
		this._numUsedStreams = rc.numUsedStreams;
		this._numUsedTextures = rc.numUsedTextures;

		if (!this.vertexConstantData || this.vertexConstantData.length !== usedVC * 4)
			this.vertexConstantData = new Float32Array(usedVC * 4);

		if (!this.fragmentConstantData || this.fragmentConstantData.length !== usedFC * 4)
        	this.fragmentConstantData = new Float32Array(this._registerCache.numUsedFragmentConstants * 4);

		//Initialies viewMatrix
		if (this.viewMatrixIndex >= 0) {

			const data = new Float32Array(this.vertexConstantData.buffer, this.viewMatrixIndex * 4, 16);

			if (!this.viewMatrix) {
				this.viewMatrix = new Matrix3D(data);
			} else {
				this.viewMatrix._rawData = data;
			}

		} else if (this.viewMatrix) {
			this.viewMatrix = null;
		}

		//Initialies sceneMatrix
		if (this.sceneMatrixIndex >= 0) {

			const data = new Float32Array(this.vertexConstantData.buffer, this.sceneMatrixIndex * 4, 16);

			if (!this.sceneMatrix) {
				this.sceneMatrix = new Matrix3D(data);
			} else {
				this.sceneMatrix._rawData = data;
			}

		} else if (this.sceneMatrix) {
			this.sceneMatrix = null;
		}

		//Initializes commonly required constant values.
		if (this.commonsDataIndex >= 0) {
			this.fragmentConstantData[this.commonsDataIndex] = .5;
			this.fragmentConstantData[this.commonsDataIndex + 1] = 0;
			this.fragmentConstantData[this.commonsDataIndex + 2] = 1 / 255;
			this.fragmentConstantData[this.commonsDataIndex + 3] = 1;
		}

		//Initializes the default UV transformation matrix.
		if (this.uvMatrixIndex >= 0) {
			this.vertexConstantData[this.uvMatrixIndex] = 1;
			this.vertexConstantData[this.uvMatrixIndex + 1] = 0;
			this.vertexConstantData[this.uvMatrixIndex + 2] = 0;
			this.vertexConstantData[this.uvMatrixIndex + 3] = 0;
			this.vertexConstantData[this.uvMatrixIndex + 4] = 0;
			this.vertexConstantData[this.uvMatrixIndex + 5] = 1;
			this.vertexConstantData[this.uvMatrixIndex + 6] = 0;
			this.vertexConstantData[this.uvMatrixIndex + 7] = 0;
		}

		//Initializes the default colorTransform.
		if (this.colorTransformIndex >= 0) {
			this.fragmentConstantData[this.colorTransformIndex] = 1;
			this.fragmentConstantData[this.colorTransformIndex + 1] = 1;
			this.fragmentConstantData[this.colorTransformIndex + 2] = 1;
			this.fragmentConstantData[this.colorTransformIndex + 3] = 1;
			this.fragmentConstantData[this.colorTransformIndex + 4] = 0;
			this.fragmentConstantData[this.colorTransformIndex + 5] = 0;
			this.fragmentConstantData[this.colorTransformIndex + 6] = 0;
			this.fragmentConstantData[this.colorTransformIndex + 7] = 0;
		}

		if (this.sceneNormalMatrixIndex >= 0) {
			const data = new Float32Array(this.vertexConstantData.buffer, this.sceneNormalMatrixIndex * 4, 16);

			if (!this.sceneNormalMatrix) {
				this.sceneNormalMatrix = new Matrix3D(data);
			} else {
				this.sceneNormalMatrix._rawData = data;
			}

		} else if (this.sceneNormalMatrix) {
			this.sceneNormalMatrix = null;
		}

		if (this.cameraPositionIndex >= 0)
			this.vertexConstantData[this.cameraPositionIndex + 3] = 1;

		// init constant data in pass
		this._pass._initConstantData();

		//init constant data in animation
		if (this._usesAnimation)
			this._renderMaterial.animationSet.doneAGALCode(this);
	}

	private _compileColorCode(): void {
		this._sharedRegisters.colorInput = this._registerCache.getFreeVertexAttribute();
		this.colorBufferIndex = this._sharedRegisters.colorInput.index;

		this._sharedRegisters.colorVarying = this._registerCache.getFreeVarying();
		this._vertexCode += 'mov ' + this._sharedRegisters.colorVarying + ', ' + this._sharedRegisters.colorInput + '\n';
	}

	private _compileGlobalPositionCode(): void {
		this._registerCache.addVertexTempUsages(this._sharedRegisters.globalPositionVertex = this._registerCache.getFreeVertexVectorTemp(), this.globalPosDependencies);

		const sceneMatrixReg: ShaderRegisterElement = this._registerCache.getFreeVertexConstant();
		this._registerCache.getFreeVertexConstant();
		this._registerCache.getFreeVertexConstant();
		this._registerCache.getFreeVertexConstant();

		this.sceneMatrixIndex = sceneMatrixReg.index * 4;

		this._vertexCode += 'm44 ' + this._sharedRegisters.globalPositionVertex + ', ' + this._sharedRegisters.animatedPosition + ', ' + sceneMatrixReg + '\n';

		if (this.usesGlobalPosFragment) {
			this._sharedRegisters.globalPositionVarying = this._registerCache.getFreeVarying();
			this._vertexCode += 'mov ' + this._sharedRegisters.globalPositionVarying + ', ' + this._sharedRegisters.globalPositionVertex + '\n';
		}
	}

	private _compilePositionCode() {
		this._sharedRegisters.positionVarying = this._registerCache.getFreeVarying();
		this._vertexCode += 'mov ' + this._sharedRegisters.positionVarying + ', ' + this._sharedRegisters.animatedPosition + '\n';
	}

	private _compileCurvesCode(): void {
		this._sharedRegisters.curvesInput = this._registerCache.getFreeVertexAttribute();
		this.curvesIndex = this._sharedRegisters.curvesInput.index;

		this._sharedRegisters.curvesVarying = this._registerCache.getFreeVarying();
		this._vertexCode += 'mov ' + this._sharedRegisters.curvesVarying + ', ' + this._sharedRegisters.curvesInput + '\n';

		const temp: ShaderRegisterElement = this._registerCache.getFreeFragmentSingleTemp();

		this._fragmentCode += 'mul ' + temp + ', ' + this._sharedRegisters.curvesVarying + '.y, ' + this._sharedRegisters.curvesVarying + '.y\n' +
            'sub ' + temp + ', ' + temp + ', ' + this._sharedRegisters.curvesVarying + '.z\n' +
            'mul ' + temp + ', ' + temp + ', ' + this._sharedRegisters.curvesVarying + '.x\n' +
            'kil ' + temp + '\n';

		// var temp:ShaderRegisterElement = this._registerCache.getFreeFragmentVectorTemp();
		//
		// this._postAnimationFragmentCode += "mul " + temp + ".x, " + this._sharedRegisters.curvesVarying + ".y, " + this._sharedRegisters.curvesVarying + ".y\n" +
		// 					"sub " + temp + ".x, " + temp + ".x, " + this._sharedRegisters.curvesVarying + ".z\n" +
		// 					"mul " + temp + ".x, " + temp + ".x, " + this._sharedRegisters.curvesVarying + ".x\n" +
		// 					"ddx " + temp + ".y," + temp + ".x\n" +
		// 					"ddy " + temp + ".z," + temp + ".x\n" +
		// 					"mul " + temp + ".y, " + temp + ".y, " + temp + ".y\n" +
		// 					"mul " + temp + ".z, " + temp + ".z, " + temp + ".z\n" +
		// 					"add " + this._sharedRegisters.shadedTarget + ".w, " + temp + ".y, " + temp + ".z\n" +
		// 					"sqt " + this._sharedRegisters.shadedTarget + ".w, " + this._sharedRegisters.shadedTarget + ".w\n" +
		// 					"div " + this._sharedRegisters.shadedTarget + ".w, " + temp + ".x, " + this._sharedRegisters.shadedTarget + ".w\n" +
		// 					"max " + this._sharedRegisters.shadedTarget + ".w, " + this._sharedRegisters.shadedTarget + ".w, " + this._sharedRegisters.commons + ".y\n" +
		// 					"min " + this._sharedRegisters.shadedTarget + ".w, " + this._sharedRegisters.shadedTarget + ".w, " + this._sharedRegisters.commons + ".w\n";
	}

	/**
     * Calculate the transformed colours
     */
	private _compileColorTransformCode(): void {
		// rm, gm, bm, am - multiplier
		// ro, go, bo, ao - offset
		const ct1: ShaderRegisterElement = this._registerCache.getFreeFragmentConstant();
		const ct2: ShaderRegisterElement = this._registerCache.getFreeFragmentConstant();
		this.colorTransformIndex = ct1.index * 4;
		this._postAnimationFragmentCode += 'mul ' + this._sharedRegisters.shadedTarget + ', ' + this._sharedRegisters.shadedTarget + ', ' + ct1 + '\n';
		this._postAnimationFragmentCode += 'add ' + this._sharedRegisters.shadedTarget + ', ' + this._sharedRegisters.shadedTarget + ', ' + ct2 + '\n';
	}

	/**
     * Calculate the (possibly animated) UV coordinates.
     */
	private _compileUVCode(): void {
		this._sharedRegisters.uvVarying = this._registerCache.getFreeVarying();

		if (this.usesUVTransform) {
			// a, b, 0, tx
			// c, d, 0, ty
			const uvTransform1: ShaderRegisterElement = this._registerCache.getFreeVertexConstant();
			const uvTransform2: ShaderRegisterElement = this._registerCache.getFreeVertexConstant();
			this.uvMatrixIndex = uvTransform1.index * 4;

			this._vertexCode += 'dp4 ' + this._sharedRegisters.uvVarying + '.x, ' +  this._sharedRegisters.uvInput + ', ' + uvTransform1 + '\n' +
                'dp4 ' + this._sharedRegisters.uvVarying + '.y, ' +  this._sharedRegisters.uvInput + ', ' + uvTransform2 + '\n' +
                'mov ' + this._sharedRegisters.uvVarying + '.zw, ' +  this._sharedRegisters.uvInput + '.zw \n';
		} else {
			this._vertexCode += 'mov ' + this._sharedRegisters.uvVarying + ', ' + this._sharedRegisters.animatedUV + '\n';
		}
	}

	/**
     * Provide the secondary UV coordinates.
     */
	private _compileSecondaryUVCode(): void {
		const uvAttributeReg: ShaderRegisterElement = this._registerCache.getFreeVertexAttribute();
		this.secondaryUVIndex = uvAttributeReg.index;
		this._sharedRegisters.secondaryUVVarying = this._registerCache.getFreeVarying();
		this._vertexCode += 'mov ' + this._sharedRegisters.secondaryUVVarying + ', ' + uvAttributeReg + '\n';
	}

	/**
     * Calculate the view direction.
     */
	private _compileViewDirCode(): void {
		const cameraPositionReg: ShaderRegisterElement = this._registerCache.getFreeVertexConstant();
		this._sharedRegisters.viewDirVarying = this._registerCache.getFreeVarying();
		this._sharedRegisters.viewDirFragment = this._registerCache.getFreeFragmentVectorTemp();
		this._registerCache.addFragmentTempUsages(this._sharedRegisters.viewDirFragment, this.viewDirDependencies);

		this.cameraPositionIndex = cameraPositionReg.index * 4;

		if (this.usesTangentSpace) {
			const temp: ShaderRegisterElement = this._registerCache.getFreeVertexVectorTemp();
			this._vertexCode += 'sub ' + temp + ', ' + cameraPositionReg + ', ' + this._sharedRegisters.animatedPosition + '\n' +
                'm33 ' + this._sharedRegisters.viewDirVarying + '.xyz, ' + temp + ', ' + this._sharedRegisters.animatedTangent + '\n' +
                'mov ' + this._sharedRegisters.viewDirVarying + '.w, ' + this._sharedRegisters.animatedPosition + '.w\n';
		} else {
			this._vertexCode += 'sub ' + this._sharedRegisters.viewDirVarying + ', ' + cameraPositionReg + ', ' + this._sharedRegisters.globalPositionVertex + '\n';
			this._registerCache.removeVertexTempUsage(this._sharedRegisters.globalPositionVertex);
		}

		//TODO is this required in all cases? (re: distancemappass)
		this._fragmentCode += 'nrm ' + this._sharedRegisters.viewDirFragment + '.xyz, ' + this._sharedRegisters.viewDirVarying + '\n' +
            'mov ' + this._sharedRegisters.viewDirFragment + '.w,   ' + this._sharedRegisters.viewDirVarying + '.w\n';
	}

	/**
     * Calculate the normal.
     */
	private _compileNormalCode(): void {
		this._sharedRegisters.normalFragment = this._registerCache.getFreeFragmentVectorTemp();
		this._registerCache.addFragmentTempUsages(this._sharedRegisters.normalFragment, this.normalDependencies);

		//simple normal aquisition if no tangent space is being used
		if (this.outputsNormals && !this.outputsTangentNormals) {
			this._vertexCode += this._pass._getNormalVertexCode(this._registerCache, this._sharedRegisters);
			this._fragmentCode += this._pass._getNormalFragmentCode(this._registerCache, this._sharedRegisters);

			return;
		}

		let normalMatrix: Array<ShaderRegisterElement>;

		if (!this.outputsNormals || !this.usesTangentSpace) {
			normalMatrix = new Array<ShaderRegisterElement>(3);
			normalMatrix[0] = this._registerCache.getFreeVertexConstant();
			normalMatrix[1] = this._registerCache.getFreeVertexConstant();
			normalMatrix[2] = this._registerCache.getFreeVertexConstant();

			this._registerCache.getFreeVertexConstant();

			this.sceneNormalMatrixIndex = normalMatrix[0].index * 4;

			this._sharedRegisters.normalVarying = this._registerCache.getFreeVarying();
		}

		if (this.outputsNormals) {
			if (this.usesTangentSpace) {
				// normalize normal + tangent vector and generate (approximated) bitangent used in m33 operation for view
				this._vertexCode += 'nrm ' + this._sharedRegisters.animatedNormal + '.xyz, ' + this._sharedRegisters.animatedNormal + '\n' +
                    'nrm ' + this._sharedRegisters.animatedTangent + '.xyz, ' + this._sharedRegisters.animatedTangent + '\n' +
                    'crs ' + this._sharedRegisters.bitangent + '.xyz, ' + this._sharedRegisters.animatedNormal + ', ' + this._sharedRegisters.animatedTangent + '\n';

				this._fragmentCode += this._pass._getNormalFragmentCode(this._registerCache, this._sharedRegisters);
			} else {
				//Compiles the vertex shader code for tangent-space normal maps.
				this._sharedRegisters.tangentVarying = this._registerCache.getFreeVarying();
				this._sharedRegisters.bitangentVarying = this._registerCache.getFreeVarying();
				const temp: ShaderRegisterElement = this._registerCache.getFreeVertexVectorTemp();

				this._vertexCode += 'm33 ' + temp + '.xyz, ' + this._sharedRegisters.animatedNormal + ', ' + normalMatrix[0] + '\n' +
                    'nrm ' + this._sharedRegisters.animatedNormal + '.xyz, ' + temp + '\n' +
                    'm33 ' + temp + '.xyz, ' + this._sharedRegisters.animatedTangent + ', ' + normalMatrix[0] + '\n' +
                    'nrm ' + this._sharedRegisters.animatedTangent + '.xyz, ' + temp + '\n' +
                    'mov ' + this._sharedRegisters.tangentVarying + '.x, ' + this._sharedRegisters.animatedTangent + '.x  \n' +
                    'mov ' + this._sharedRegisters.tangentVarying + '.z, ' + this._sharedRegisters.animatedNormal + '.x  \n' +
                    'mov ' + this._sharedRegisters.tangentVarying + '.w, ' + this._sharedRegisters.normalInput + '.w  \n' +
                    'mov ' + this._sharedRegisters.bitangentVarying + '.x, ' + this._sharedRegisters.animatedTangent + '.y  \n' +
                    'mov ' + this._sharedRegisters.bitangentVarying + '.z, ' + this._sharedRegisters.animatedNormal + '.y  \n' +
                    'mov ' + this._sharedRegisters.bitangentVarying + '.w, ' + this._sharedRegisters.normalInput + '.w  \n' +
                    'mov ' + this._sharedRegisters.normalVarying + '.x, ' + this._sharedRegisters.animatedTangent + '.z  \n' +
                    'mov ' + this._sharedRegisters.normalVarying + '.z, ' + this._sharedRegisters.animatedNormal + '.z  \n' +
                    'mov ' + this._sharedRegisters.normalVarying + '.w, ' + this._sharedRegisters.normalInput + '.w  \n' +
                    'crs ' + temp + '.xyz, ' + this._sharedRegisters.animatedNormal + ', ' + this._sharedRegisters.animatedTangent + '\n' +
                    'mov ' + this._sharedRegisters.tangentVarying + '.y, ' + temp + '.x    \n' +
                    'mov ' + this._sharedRegisters.bitangentVarying + '.y, ' + temp + '.y  \n' +
                    'mov ' + this._sharedRegisters.normalVarying + '.y, ' + temp + '.z    \n';

				this._registerCache.removeVertexTempUsage(this._sharedRegisters.animatedTangent);

				//Compiles the fragment shader code for tangent-space normal maps.
				let t: ShaderRegisterElement;
				let b: ShaderRegisterElement;
				let n: ShaderRegisterElement;

				t = this._registerCache.getFreeFragmentVectorTemp();
				this._registerCache.addFragmentTempUsages(t, 1);
				b = this._registerCache.getFreeFragmentVectorTemp();
				this._registerCache.addFragmentTempUsages(b, 1);
				n = this._registerCache.getFreeFragmentVectorTemp();
				this._registerCache.addFragmentTempUsages(n, 1);

				this._fragmentCode += 'nrm ' + t + '.xyz, ' + this._sharedRegisters.tangentVarying + '\n' +
                    'mov ' + t + '.w, ' + this._sharedRegisters.tangentVarying + '.w	\n' +
                    'nrm ' + b + '.xyz, ' + this._sharedRegisters.bitangentVarying + '\n' +
                    'nrm ' + n + '.xyz, ' + this._sharedRegisters.normalVarying + '\n';

				//compile custom fragment code for normal calcs
				this._fragmentCode += this._pass._getNormalFragmentCode(this._registerCache, this._sharedRegisters) +
                    'm33 ' + this._sharedRegisters.normalFragment + '.xyz, ' + this._sharedRegisters.normalFragment + ', ' + t + '\n' +
                    'mov ' + this._sharedRegisters.normalFragment + '.w, ' + this._sharedRegisters.normalVarying + '.w\n';

				this._registerCache.removeFragmentTempUsage(b);
				this._registerCache.removeFragmentTempUsage(t);
				this._registerCache.removeFragmentTempUsage(n);
			}
		} else {
			// no output, world space is enough
			this._vertexCode += 'm33 ' + this._sharedRegisters.normalVarying + '.xyz, ' + this._sharedRegisters.animatedNormal + ', ' + normalMatrix[0] + '\n' +
                'mov ' + this._sharedRegisters.normalVarying + '.w, ' + this._sharedRegisters.animatedNormal + '.w\n';

			this._fragmentCode += 'nrm ' + this._sharedRegisters.normalFragment + '.xyz, ' + this._sharedRegisters.normalVarying + '\n' +
                'mov ' + this._sharedRegisters.normalFragment + '.w, ' + this._sharedRegisters.normalVarying + '.w\n';

			if (this.tangentDependencies > 0) {
				this._sharedRegisters.tangentVarying = this._registerCache.getFreeVarying();

				this._vertexCode += 'm33 ' + this._sharedRegisters.tangentVarying + '.xyz, ' + this._sharedRegisters.animatedTangent + ', ' + normalMatrix[0] + '\n' +
                    'mov ' + this._sharedRegisters.tangentVarying + '.w, ' + this._sharedRegisters.animatedTangent + '.w\n';
			}
		}

		if (!this.usesTangentSpace)
			this._registerCache.removeVertexTempUsage(this._sharedRegisters.animatedNormal);
	}

	private _compileAnimationCode(): void {
		//reset code
		this._animationVertexCode = '';
		this._animationFragmentCode = '';

		//check to see if GPU animation is used
		if (this._usesAnimation) {

			const animationSet: IAnimationSet = <IAnimationSet> this._renderMaterial.animationSet;

			this._animationVertexCode += animationSet.getAGALVertexCode(this, this._registerCache, this._sharedRegisters);

			if (this.uvDependencies > 0 && !this.usesUVTransform)
				this._animationVertexCode += animationSet.getAGALUVCode(this, this._registerCache, this._sharedRegisters);

			if (this.usesFragmentAnimation)
				this._animationFragmentCode += animationSet.getAGALFragmentCode(this, this._registerCache, this._sharedRegisters.shadedTarget);
		} else {
			// simply write attributes to targets, do not animate them
			// projection will pick up on targets[0] to do the projection
			const len: number = this._sharedRegisters.animatableAttributes.length;
			for (let i: number = 0; i < len; ++i)
				this._animationVertexCode += 'mov ' + this._sharedRegisters.animationTargetRegisters[i] + ', ' + this._sharedRegisters.animatableAttributes[i] + '\n';

			if (this.uvDependencies > 0 && !this.usesUVTransform)
				this._animationVertexCode += 'mov ' + this._sharedRegisters.animatedUV + ',' + this._sharedRegisters.uvInput + '\n';
		}
	}

	public setVertexConst(index: number, x: number = 0, y: number = 0, z: number = 0, w: number = 0): void {
		index *= 4;
		this.vertexConstantData[index++] = x;
		this.vertexConstantData[index++] = y;
		this.vertexConstantData[index++] = z;
		this.vertexConstantData[index] = w;
	}

	public setVertexConstFromArray(index: number, data: Float32Array): void {
		index *= 4;
		for (let i: number /*int*/ = 0; i < data.length; i++)
			this.vertexConstantData[index++] = data[i];
	}

	public setVertexConstFromMatrix(index: number, matrix: Matrix3D): void {
		index *= 4;
		const rawData: Float32Array = matrix._rawData;
		this.vertexConstantData[index++] = rawData[0];
		this.vertexConstantData[index++] = rawData[4];
		this.vertexConstantData[index++] = rawData[8];
		this.vertexConstantData[index++] = rawData[12];
		this.vertexConstantData[index++] = rawData[1];
		this.vertexConstantData[index++] = rawData[5];
		this.vertexConstantData[index++] = rawData[9];
		this.vertexConstantData[index++] = rawData[13];
		this.vertexConstantData[index++] = rawData[2];
		this.vertexConstantData[index++] = rawData[6];
		this.vertexConstantData[index++] = rawData[10];
		this.vertexConstantData[index++] = rawData[14];
		this.vertexConstantData[index++] = rawData[3];
		this.vertexConstantData[index++] = rawData[7];
		this.vertexConstantData[index++] = rawData[11];
		this.vertexConstantData[index] = rawData[15];

	}

	public setFragmentConst(index: number, x: number = 0, y: number = 0, z: number = 0, w: number = 0): void {
		index *= 4;
		this.fragmentConstantData[index++] = x;
		this.fragmentConstantData[index++] = y;
		this.fragmentConstantData[index++] = z;
		this.fragmentConstantData[index] = w;
	}
}