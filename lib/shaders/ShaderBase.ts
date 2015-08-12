import BlendMode					= require("awayjs-core/lib/data/BlendMode");
import Matrix						= require("awayjs-core/lib/geom/Matrix");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils				= require("awayjs-core/lib/geom/Matrix3DUtils");
import Rectangle					= require("awayjs-core/lib/geom/Rectangle");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import ColorTransform				= require("awayjs-core/lib/geom/ColorTransform");
import Event						= require("awayjs-core/lib/events/Event");
import ArgumentError				= require("awayjs-core/lib/errors/ArgumentError");

import LineSubGeometry				= require("awayjs-display/lib/base/LineSubGeometry");
import TriangleSubGeometry			= require("awayjs-display/lib/base/TriangleSubGeometry");
import Camera						= require("awayjs-display/lib/entities/Camera");
import TextureBase					= require("awayjs-display/lib/textures/TextureBase");

import ContextGLBlendFactor			= require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");
import ContextGLTriangleFace		= require("awayjs-stagegl/lib/base/ContextGLTriangleFace");
import Stage						= require("awayjs-stagegl/lib/base/Stage");
import ProgramData					= require("awayjs-stagegl/lib/pool/ProgramData");

import AnimationSetBase				= require("awayjs-renderergl/lib/animators/AnimationSetBase");
import AnimatorBase					= require("awayjs-renderergl/lib/animators/AnimatorBase");
import AnimationRegisterCache		= require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
import IPass						= require("awayjs-renderergl/lib/render/passes/IPass");
import IRenderableClass				= require("awayjs-renderergl/lib/renderables/IRenderableClass");
import RenderableBase				= require("awayjs-renderergl/lib/renderables/RenderableBase");
import CompilerBase					= require("awayjs-renderergl/lib/shaders/compilers/CompilerBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import TextureVOPool				= require("awayjs-renderergl/lib/vos/TextureVOPool");
import TextureVOBase				= require("awayjs-renderergl/lib/vos/TextureVOBase");

/**
 * ShaderBase keeps track of the number of dependencies for "named registers" used across a pass.
 * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
 * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
 * each time a method has been compiled into the shader.
 *
 * @see RegisterPool.addUsage
 */
class ShaderBase
{
	private _textureVOPool:TextureVOPool;
	private _renderableClass:IRenderableClass;
	private _pass:IPass;
	public _stage:Stage;
	private _programData:ProgramData;

	private _blendFactorSource:string = ContextGLBlendFactor.ONE;
	private _blendFactorDest:string = ContextGLBlendFactor.ZERO;

	private _invalidShader:boolean = true;
	private _invalidProgram:boolean = true;
	private _animationVertexCode:string = "";
	private _animationFragmentCode:string = "";

	public get programData():ProgramData
	{
		if (this._invalidProgram)
			this._updateProgram();

		return this._programData;
	}

	public usesBlending:boolean = false;

	/**
	 * The depth compare mode used to render the renderables using this material.
	 *
	 * @see away.stagegl.ContextGLCompareMode
	 */
	public depthCompareMode:string = ContextGLCompareMode.LESS_EQUAL;


	/**
	 * Indicate whether the shader should write to the depth buffer or not. Ignored when blending is enabled.
	 */
	public writeDepth:boolean = true;

	public profile:string;

	public usesAnimation:boolean;

	private _defaultCulling:string = ContextGLTriangleFace.BACK;

	public _pInverseSceneMatrix:Array<number> = new Array<number>();

	public animationRegisterCache:AnimationRegisterCache;

	/**
	 * The amount of used vertex constants in the vertex code. Used by the animation code generation to know from which index on registers are available.
	 */
	public numUsedVertexConstants:number;

	/**
	 * The amount of used fragment constants in the fragment code. Used by the animation code generation to know from which index on registers are available.
	 */
	public numUsedFragmentConstants:number;

	/**
	 * The amount of used vertex streams in the vertex code. Used by the animation code generation to know from which index on streams are available.
	 */
	public numUsedStreams:number;

	/**
	 *
	 */
	public numUsedTextures:number;

	/**
	 *
	 */
	public numUsedVaryings:number;

	public animatableAttributes:Array<string>;
	public animationTargetRegisters:Array<string>;
	public uvSource:string;
	public uvTarget:string;

	public useAlphaPremultiplied:boolean;
	public useBothSides:boolean;
	public useMipmapping:boolean;
	public useSmoothTextures:boolean;
	public repeatTextures:boolean;
	public usesUVTransform:boolean;
	public usesColorTransform:boolean;
	public alphaThreshold:number;
	public texture:TextureVOBase;
	public color:number;


	//set ambient values to default
	public ambientR:number = 0xFF;
	public ambientG:number = 0xFF;
	public ambientB:number = 0xFF;

	/**
	 *
	 */
	public usesCommonData:boolean;

	/**
	 * Indicates whether the pass requires any fragment animation code.
	 */
	public usesFragmentAnimation:boolean;

	/**
	 * The amount of dependencies on the projected position.
	 */
	public projectionDependencies:number;

	/**
	 * The amount of dependencies on the normal vector.
	 */
	public normalDependencies:number;

	/**
	 * The amount of dependencies on the vertex color.
	 */
	public colorDependencies:number;

	/**
	 * The amount of dependencies on the view direction.
	 */
	public viewDirDependencies:number;

	/**
	 * The amount of dependencies on the primary UV coordinates.
	 */
	public uvDependencies:number;

	/**
	 * The amount of dependencies on the secondary UV coordinates.
	 */
	public secondaryUVDependencies:number;

	/**
	 * The amount of dependencies on the global position. This can be 0 while hasGlobalPosDependencies is true when
	 * the global position is used as a temporary value (fe to calculate the view direction)
	 */
	public globalPosDependencies:number;

	/**
	 * The amount of tangent vector dependencies (fragment shader).
	 */
	public tangentDependencies:number;

	/**
	 *
	 */
	public outputsColors:boolean;

	/**
	 * Indicates whether or not normals are output.
	 */
	public outputsNormals:boolean;

	/**
	 * Indicates whether or not normal calculations are output in tangent space.
	 */
	public outputsTangentNormals:boolean;

	/**
	 * Indicates whether or not normal calculations are expected in tangent space. This is only the case if no world-space
	 * dependencies exist and normals are being output.
	 */
	public usesTangentSpace:boolean;

	/**
	 * Indicates whether there are any dependencies on the world-space position vector.
	 */
	public usesGlobalPosFragment:boolean = false;

	/**
	 * Indicates whether there are any dependencies on the local position vector.
	 */
	public usesLocalPosFragment:boolean = false;

	public vertexConstantData:Array<number> = new Array<number>();
	public fragmentConstantData:Array<number> = new Array<number>();

	/**
	 * The index for the common data register.
	 */
	public commonsDataIndex:number;

	/**
	 * The index for the UV vertex attribute stream.
	 */
	public uvBufferIndex:number;

	/**
	 * The index for the secondary UV vertex attribute stream.
	 */
	public secondaryUVBufferIndex:number;

	/**
	 * The index for the vertex normal attribute stream.
	 */
	public normalBufferIndex:number;

	/**
	 * The index for the color attribute stream.
	 */
	public colorBufferIndex:number;

	/**
	 * The index for the vertex tangent attribute stream.
	 */
	public tangentBufferIndex:number;

	/**
	 * The index of the vertex constant containing the view matrix.
	 */
	public viewMatrixIndex:number;

	/**
	 * The index of the vertex constant containing the scene matrix.
	 */
	public sceneMatrixIndex:number;

	/**
	 * The index of the vertex constant containing the uniform scene matrix (the inverse transpose).
	 */
	public sceneNormalMatrixIndex:number;

	/**
	 * The index of the vertex constant containing the camera position.
	 */
	public cameraPositionIndex:number;

	/**
	 * The index for the UV transformation matrix vertex constant.
	 */
	public uvTransformIndex:number;

	/**
	 * The index for the color transform fragment constant.
	 */
	public colorTransformIndex:number;

	/**
	 *
	 */
	public jointIndexIndex:number;

	/**
	 *
	 */
	public jointWeightIndex:number;

	/**
	 * Creates a new MethodCompilerVO object.
	 */
	constructor(renderableClass:IRenderableClass, pass:IPass, stage:Stage)
	{
		this._renderableClass = renderableClass;
		this._pass = pass;
		this._stage = stage;
		this.profile = this._stage.profile;

		this._textureVOPool = new TextureVOPool(this._stage);
	}

	public getTextureVO(texture:TextureBase):TextureVOBase
	{
		return this._textureVOPool.getItem(texture);
	}

	public _iIncludeDependencies()
	{
		this._pass._iIncludeDependencies(this);
	}

	/**
	 * Factory method to create a concrete compiler object for this object
	 *
	 * @param renderableClass
	 * @param pass
	 * @param stage
	 * @returns {CompilerBase}
	 */
	public createCompiler(renderableClass:IRenderableClass, pass:IPass):CompilerBase
	{
		return new CompilerBase(renderableClass, pass, this);
	}

	/**
	 * Clears dependency counts for all registers. Called when recompiling a pass.
	 */
	public reset()
	{
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
		this.usesLocalPosFragment = false;
		this.usesFragmentAnimation = false;
		this.usesTangentSpace = false;
		this.outputsNormals = false;
		this.outputsTangentNormals = false;
	}

	public pInitRegisterIndices()
	{
		this.commonsDataIndex = -1;
		this.cameraPositionIndex = -1;
		this.uvBufferIndex = -1;
		this.uvTransformIndex = -1;
		this.colorTransformIndex = -1;
		this.secondaryUVBufferIndex = -1;
		this.normalBufferIndex = -1;
		this.colorBufferIndex = -1;
		this.tangentBufferIndex = -1;
		this.sceneMatrixIndex = -1;
		this.sceneNormalMatrixIndex = -1;
		this.jointIndexIndex = -1;
		this.jointWeightIndex = -1;
	}

	/**
	 * Initializes the unchanging constant data for this shader object.
	 */
	public initConstantData(registerCache:ShaderRegisterCache, animatableAttributes:Array<string>, animationTargetRegisters:Array<string>, uvSource:string, uvTarget:string)
	{
		//Updates the amount of used register indices.
		this.numUsedVertexConstants = registerCache.numUsedVertexConstants;
		this.numUsedFragmentConstants = registerCache.numUsedFragmentConstants;
		this.numUsedStreams = registerCache.numUsedStreams;
		this.numUsedTextures = registerCache.numUsedTextures;
		this.numUsedVaryings = registerCache.numUsedVaryings;
		this.numUsedFragmentConstants = registerCache.numUsedFragmentConstants;

		this.animatableAttributes = animatableAttributes;
		this.animationTargetRegisters = animationTargetRegisters;
		this.uvSource = uvSource;
		this.uvTarget = uvTarget;

		this.vertexConstantData.length = this.numUsedVertexConstants*4;
		this.fragmentConstantData.length = this.numUsedFragmentConstants*4;

		//Initializes commonly required constant values.
		if (this.commonsDataIndex >= 0) {
			this.fragmentConstantData[this.commonsDataIndex] = .5;
			this.fragmentConstantData[this.commonsDataIndex + 1] = 0;
			this.fragmentConstantData[this.commonsDataIndex + 2] = 1/255;
			this.fragmentConstantData[this.commonsDataIndex + 3] = 1;
		}

		//Initializes the default UV transformation matrix.
		if (this.uvTransformIndex >= 0) {
			this.vertexConstantData[this.uvTransformIndex] = 1;
			this.vertexConstantData[this.uvTransformIndex + 1] = 0;
			this.vertexConstantData[this.uvTransformIndex + 2] = 0;
			this.vertexConstantData[this.uvTransformIndex + 3] = 0;
			this.vertexConstantData[this.uvTransformIndex + 4] = 0;
			this.vertexConstantData[this.uvTransformIndex + 5] = 1;
			this.vertexConstantData[this.uvTransformIndex + 6] = 0;
			this.vertexConstantData[this.uvTransformIndex + 7] = 0;
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
		if (this.cameraPositionIndex >= 0)
			this.vertexConstantData[this.cameraPositionIndex + 3] = 1;
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
	public setBlendMode(value:string)
	{
		switch (value) {
			case BlendMode.NORMAL:
				this._blendFactorSource = ContextGLBlendFactor.ONE;
				this._blendFactorDest = ContextGLBlendFactor.ZERO;
				this.usesBlending = false;
				break;

			case BlendMode.LAYER:
				this._blendFactorSource = ContextGLBlendFactor.SOURCE_ALPHA;
				this._blendFactorDest = ContextGLBlendFactor.ONE_MINUS_SOURCE_ALPHA;
				this.usesBlending = true;
				break;

			case BlendMode.MULTIPLY:
				this._blendFactorSource = ContextGLBlendFactor.ZERO;
				this._blendFactorDest = ContextGLBlendFactor.SOURCE_COLOR;
				this.usesBlending = true;
				break;

			case BlendMode.ADD:
				this._blendFactorSource = ContextGLBlendFactor.SOURCE_ALPHA;
				this._blendFactorDest = ContextGLBlendFactor.ONE;
				this.usesBlending = true;
				break;

			case BlendMode.ALPHA:
				this._blendFactorSource = ContextGLBlendFactor.ZERO;
				this._blendFactorDest = ContextGLBlendFactor.SOURCE_ALPHA;
				this.usesBlending = true;
				break;

			default:
				throw new ArgumentError("Unsupported blend mode!");
		}
	}


	/**
	 * @inheritDoc
	 */
	public _iActivate(camera:Camera)
	{
		if (this.usesAnimation)
			(<AnimationSetBase> this._pass.animationSet).activate(this, this._stage);

		this._stage.context.setCulling(this.useBothSides? ContextGLTriangleFace.NONE : this._defaultCulling, camera.projection.coordinateSystem);

		if (!this.usesTangentSpace && this.cameraPositionIndex >= 0) {
			var pos:Vector3D = camera.scenePosition;

			this.vertexConstantData[this.cameraPositionIndex] = pos.x;
			this.vertexConstantData[this.cameraPositionIndex + 1] = pos.y;
			this.vertexConstantData[this.cameraPositionIndex + 2] = pos.z;
		}

		this._stage.context.setDepthTest(( this.writeDepth && !this.usesBlending ), this.depthCompareMode);

		if (this.usesBlending)
			this._stage.context.setBlendFactors(this._blendFactorSource, this._blendFactorDest);
	}

	/**
	 * @inheritDoc
	 */
	public _iDeactivate()
	{
		if (this.usesAnimation)
			(<AnimationSetBase> this._pass.animationSet).deactivate(this, this._stage);

		//For the love of god don't remove this if you want your multi-material shadows to not flicker like shit
		this._stage.context.setDepthTest(true, ContextGLCompareMode.LESS_EQUAL);
	}


	/**
	 *
	 *
	 * @param renderable
	 * @param stage
	 * @param camera
	 */
	public _iRender(renderable:RenderableBase, camera:Camera, viewProjection:Matrix3D)
	{
		if (renderable.renderableOwner.animator)
			(<AnimatorBase> renderable.renderableOwner.animator).setRenderState(this, renderable, this._stage, camera, this.numUsedVertexConstants, this.numUsedStreams);

		if (this.usesUVTransform) {
			var uvTransform:Matrix = renderable.renderableOwner.uvTransform.matrix;

			if (uvTransform) {
				this.vertexConstantData[this.uvTransformIndex] = uvTransform.a;
				this.vertexConstantData[this.uvTransformIndex + 1] = uvTransform.b;
				this.vertexConstantData[this.uvTransformIndex + 3] = uvTransform.tx;
				this.vertexConstantData[this.uvTransformIndex + 4] = uvTransform.c;
				this.vertexConstantData[this.uvTransformIndex + 5] = uvTransform.d;
				this.vertexConstantData[this.uvTransformIndex + 7] = uvTransform.ty;
			} else {
				this.vertexConstantData[this.uvTransformIndex] = 1;
				this.vertexConstantData[this.uvTransformIndex + 1] = 0;
				this.vertexConstantData[this.uvTransformIndex + 3] = 0;
				this.vertexConstantData[this.uvTransformIndex + 4] = 0;
				this.vertexConstantData[this.uvTransformIndex + 5] = 1;
				this.vertexConstantData[this.uvTransformIndex + 7] = 0;
			}
		}
		if (this.usesColorTransform) {

			var colorTransform:ColorTransform = renderable.renderableOwner.colorTransform;

			if (colorTransform) {
				this.fragmentConstantData[this.colorTransformIndex] = colorTransform.redMultiplier;
				this.fragmentConstantData[this.colorTransformIndex + 1] = colorTransform.greenMultiplier;
				this.fragmentConstantData[this.colorTransformIndex + 2] = colorTransform.blueMultiplier;
				this.fragmentConstantData[this.colorTransformIndex + 3] = colorTransform.alphaMultiplier;
				this.fragmentConstantData[this.colorTransformIndex + 4] = colorTransform.redOffset/255;
				this.fragmentConstantData[this.colorTransformIndex + 5] = colorTransform.greenOffset/255;
				this.fragmentConstantData[this.colorTransformIndex + 6] = colorTransform.blueOffset/255;
				this.fragmentConstantData[this.colorTransformIndex + 7] = colorTransform.alphaOffset/255;
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
		if (this.sceneNormalMatrixIndex >= 0)
			renderable.sourceEntity.inverseSceneTransform.copyRawDataTo(this.vertexConstantData, this.sceneNormalMatrixIndex, false);

		if (this.usesTangentSpace && this.cameraPositionIndex >= 0) {

			renderable.sourceEntity.inverseSceneTransform.copyRawDataTo(this._pInverseSceneMatrix);
			var pos:Vector3D = camera.scenePosition;
			var x:number = pos.x;
			var y:number = pos.y;
			var z:number = pos.z;

			this.vertexConstantData[this.cameraPositionIndex] = this._pInverseSceneMatrix[0]*x + this._pInverseSceneMatrix[4]*y + this._pInverseSceneMatrix[8]*z + this._pInverseSceneMatrix[12];
			this.vertexConstantData[this.cameraPositionIndex + 1] = this._pInverseSceneMatrix[1]*x + this._pInverseSceneMatrix[5]*y + this._pInverseSceneMatrix[9]*z + this._pInverseSceneMatrix[13];
			this.vertexConstantData[this.cameraPositionIndex + 2] = this._pInverseSceneMatrix[2]*x + this._pInverseSceneMatrix[6]*y + this._pInverseSceneMatrix[10]*z + this._pInverseSceneMatrix[14];
		}
	}
	
	public invalidateProgram()
	{
		this._invalidProgram = true;
	}

	public invalidateShader()
	{
		this._invalidShader = true;
		this._invalidProgram = true;
	}

	public dispose()
	{
		this._programData.dispose();
		this._programData = null;
	}

	private _updateProgram()
	{
		this._invalidProgram = false;

		var compiler:CompilerBase;

		if (this._invalidShader) {
			this._invalidShader = false;

			compiler = this.createCompiler(this._renderableClass, this._pass);
			compiler.compile();
		}

		this._calcAnimationCode(compiler.shadedTarget);

		var programData:ProgramData = this._stage.getProgramData(this._animationVertexCode + compiler.vertexCode, compiler.fragmentCode + this._animationFragmentCode + compiler.postAnimationFragmentCode);

		//check program data hasn't changed, keep count of program usages
		if (this._programData != programData) {
			if (this._programData)
				this._programData.dispose();

			this._programData = programData;

			programData.usages++;
		}
	}

	private _calcAnimationCode(shadedTarget:string)
	{
		//reset code
		this._animationVertexCode = "";
		this._animationFragmentCode = "";

		//check to see if GPU animation is used
		if (this.usesAnimation) {

			var animationSet:AnimationSetBase = <AnimationSetBase> this._pass.animationSet;

			this._animationVertexCode += animationSet.getAGALVertexCode(this);

			if (this.uvDependencies > 0 && !this.usesUVTransform)
				this._animationVertexCode += animationSet.getAGALUVCode(this);

			if (this.usesFragmentAnimation)
				this._animationFragmentCode += animationSet.getAGALFragmentCode(this, shadedTarget);

			animationSet.doneAGALCode(this);

		} else {
			// simply write attributes to targets, do not animate them
			// projection will pick up on targets[0] to do the projection
			var len:number = this.animatableAttributes.length;
			for (var i:number = 0; i < len; ++i)
				this._animationVertexCode += "mov " + this.animationTargetRegisters[i] + ", " + this.animatableAttributes[i] + "\n";

			if (this.uvDependencies > 0 && !this.usesUVTransform)
				this._animationVertexCode += "mov " + this.uvTarget + "," + this.uvSource + "\n";
		}
	}
}

export = ShaderBase;