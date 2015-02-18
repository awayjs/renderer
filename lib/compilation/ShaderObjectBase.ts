import BlendMode					= require("awayjs-core/lib/base/BlendMode");
import Matrix						= require("awayjs-core/lib/geom/Matrix");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils				= require("awayjs-core/lib/geom/Matrix3DUtils");
import Rectangle					= require("awayjs-core/lib/geom/Rectangle");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");
import Event						= require("awayjs-core/lib/events/Event");
import ArgumentError				= require("awayjs-core/lib/errors/ArgumentError");
import Texture2DBase				= require("awayjs-core/lib/textures/Texture2DBase");

import LineSubGeometry				= require("awayjs-display/lib/base/LineSubGeometry");
import TriangleSubGeometry			= require("awayjs-display/lib/base/TriangleSubGeometry");
import Camera						= require("awayjs-display/lib/entities/Camera");

import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import ContextGLCompareMode			= require("awayjs-stagegl/lib/base/ContextGLCompareMode");
import ContextGLTriangleFace		= require("awayjs-stagegl/lib/base/ContextGLTriangleFace");
import ContextGLBlendFactor			= require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
import Stage						= require("awayjs-stagegl/lib/base/Stage");
import ProgramData					= require("awayjs-stagegl/lib/pool/ProgramData");

import AnimationSetBase				= require("awayjs-renderergl/lib/animators/AnimationSetBase");
import AnimatorBase					= require("awayjs-renderergl/lib/animators/AnimatorBase");
import AnimationRegisterCache		= require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");
import IRenderPassBase				= require("awayjs-renderergl/lib/passes/IRenderPassBase");
import ShaderCompilerBase			= require("awayjs-renderergl/lib/compilation/ShaderCompilerBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
import IRenderableClass				= require("awayjs-renderergl/lib/pool/IRenderableClass");
import RendererBase					= require("awayjs-renderergl/lib/base/RendererBase");

/**
 * ShaderObjectBase keeps track of the number of dependencies for "named registers" used across a pass.
 * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
 * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
 * each time a method has been compiled into the shader.
 *
 * @see RegisterPool.addUsage
 */
class ShaderObjectBase
{
	private _renderableClass:IRenderableClass;
	private _renderPass:IRenderPassBase;
	public _stage:Stage;
	private _programData:ProgramData;

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
	public alphaThreshold:number;
	public texture:Texture2DBase;
	public color:number;


	//set ambient values to default
	public ambientR:number = 0xFF;
	public ambientG:number = 0xFF;
	public ambientB:number = 0xFF;

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
	 * The amount of dependencies on the local position. This can be 0 while hasGlobalPosDependencies is true when
	 * the global position is used as a temporary value (fe to calculate the view direction)
	 */
	public localPosDependencies:number;

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
	public outputsNormals:boolean;

	/**
	 *
	 */
	public outputsColors:boolean;

	/**
	 * Indicates whether or not normal calculations are expected in tangent space. This is only the case if no world-space
	 * dependencies exist.
	 */
	public usesTangentSpace:boolean;

	/**
	 * Indicates whether or not normal calculations are output in tangent space.
	 */
	public outputsTangentNormals:boolean;

	/**
	 * Indicates whether there are any dependencies on the world-space position vector.
	 */
	public usesGlobalPosFragment:boolean = false;

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
	 * Creates a new MethodCompilerVO object.
	 */
	constructor(renderableClass:IRenderableClass, renderPass:IRenderPassBase, stage:Stage)
	{
		this._renderableClass = renderableClass;
		this._renderPass = renderPass;
		this._stage = stage;
		this.profile = this._stage.profile;
	}

	public _iIncludeDependencies()
	{
		this._renderPass._iIncludeDependencies(this);
	}

	/**
	 * Factory method to create a concrete compiler object for this object
	 *
	 * @param renderableClass
	 * @param renderPass
	 * @param stage
	 * @returns {ShaderCompilerBase}
	 */
	public createCompiler(renderableClass:IRenderableClass, renderPass:IRenderPassBase):ShaderCompilerBase
	{
		return new ShaderCompilerBase(renderableClass, renderPass, this);
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
		this.localPosDependencies = 0;
		this.tangentDependencies = 0;
		this.usesGlobalPosFragment = false;
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
		this.secondaryUVBufferIndex = -1;
		this.normalBufferIndex = -1;
		this.colorBufferIndex = -1;
		this.tangentBufferIndex = -1;
		this.sceneMatrixIndex = -1;
		this.sceneNormalMatrixIndex = -1;
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
		this.fragmentConstantData[this.commonsDataIndex] = .5;
		this.fragmentConstantData[this.commonsDataIndex + 1] = 0;
		this.fragmentConstantData[this.commonsDataIndex + 2] = 1/255;
		this.fragmentConstantData[this.commonsDataIndex + 3] = 1;

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

		if (this.cameraPositionIndex >= 0)
			this.vertexConstantData[this.cameraPositionIndex + 3] = 1;
	}


	/**
	 * @inheritDoc
	 */
	public _iActivate(camera:Camera)
	{
		if (this.usesAnimation)
			(<AnimationSetBase> this._renderPass.animationSet).activate(this, this._stage);

		this._stage.context.setCulling(this.useBothSides? ContextGLTriangleFace.NONE : this._defaultCulling, camera.projection.coordinateSystem);

		if (!this.usesTangentSpace && this.cameraPositionIndex >= 0) {
			var pos:Vector3D = camera.scenePosition;

			this.vertexConstantData[this.cameraPositionIndex] = pos.x;
			this.vertexConstantData[this.cameraPositionIndex + 1] = pos.y;
			this.vertexConstantData[this.cameraPositionIndex + 2] = pos.z;
		}
	}

	/**
	 * @inheritDoc
	 */
	public _iDeactivate()
	{
		if (this.usesAnimation)
			(<AnimationSetBase> this._renderPass.animationSet).deactivate(this, this._stage);

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

		if (this.uvBufferIndex >= 0)
			this._stage.activateBuffer(this.uvBufferIndex, renderable.getVertexData(TriangleSubGeometry.UV_DATA), renderable.getVertexOffset(TriangleSubGeometry.UV_DATA), TriangleSubGeometry.UV_FORMAT);

		if (this.secondaryUVBufferIndex >= 0)
			this._stage.activateBuffer(this.secondaryUVBufferIndex, renderable.getVertexData(TriangleSubGeometry.SECONDARY_UV_DATA), renderable.getVertexOffset(TriangleSubGeometry.SECONDARY_UV_DATA), TriangleSubGeometry.SECONDARY_UV_FORMAT);

		if (this.normalBufferIndex >= 0)
			this._stage.activateBuffer(this.normalBufferIndex, renderable.getVertexData(TriangleSubGeometry.NORMAL_DATA), renderable.getVertexOffset(TriangleSubGeometry.NORMAL_DATA), TriangleSubGeometry.NORMAL_FORMAT);

		if (this.tangentBufferIndex >= 0)
			this._stage.activateBuffer(this.tangentBufferIndex, renderable.getVertexData(TriangleSubGeometry.TANGENT_DATA), renderable.getVertexOffset(TriangleSubGeometry.TANGENT_DATA), TriangleSubGeometry.TANGENT_FORMAT);

		if (this.colorBufferIndex >= 0)
			this._stage.activateBuffer(this.colorBufferIndex, renderable.getVertexData(LineSubGeometry.COLOR_DATA), renderable.getVertexOffset(LineSubGeometry.COLOR_DATA), LineSubGeometry.COLOR_FORMAT);


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

		var compiler:ShaderCompilerBase;

		if (this._invalidShader) {
			this._invalidShader = false;

			compiler = this.createCompiler(this._renderableClass, this._renderPass);
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

			var animationSet:AnimationSetBase = <AnimationSetBase> this._renderPass.animationSet;

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

export = ShaderObjectBase;