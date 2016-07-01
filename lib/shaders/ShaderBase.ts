import {BlendMode}					from "@awayjs/core/lib/image/BlendMode";
import {Matrix}						from "@awayjs/core/lib/geom/Matrix";
import {Matrix3D}						from "@awayjs/core/lib/geom/Matrix3D";
import {Vector3D}						from "@awayjs/core/lib/geom/Vector3D";
import {ColorTransform}				from "@awayjs/core/lib/geom/ColorTransform";
import {ArgumentError}				from "@awayjs/core/lib/errors/ArgumentError";
import {IAssetClass}					from "@awayjs/core/lib/library/IAssetClass";
import {IAbstractionPool}				from "@awayjs/core/lib/library/IAbstractionPool";

import {Camera}						from "@awayjs/display/lib/display/Camera";
import {TextureBase}					from "@awayjs/display/lib/textures/TextureBase";

import {ContextGLBlendFactor}			from "@awayjs/stage/lib/base/ContextGLBlendFactor";
import {ContextGLCompareMode}			from "@awayjs/stage/lib/base/ContextGLCompareMode";
import {ContextGLTriangleFace}		from "@awayjs/stage/lib/base/ContextGLTriangleFace";
import {Stage}						from "@awayjs/stage/lib/base/Stage";
import {ProgramData}					from "@awayjs/stage/lib/image/ProgramData";
import {GL_IAssetClass}				from "@awayjs/stage/lib/library/GL_IAssetClass";

import {AnimationSetBase}				from "../animators/AnimationSetBase";
import {AnimatorBase}					from "../animators/AnimatorBase";
import {AnimationRegisterData}		from "../animators/data/AnimationRegisterData";
import {IPass}						from "../surfaces/passes/IPass";
import {IElementsClassGL}				from "../elements/IElementsClassGL";
import {GL_ElementsBase}				from "../elements/GL_ElementsBase";
import {GL_RenderableBase}			from "../renderables/GL_RenderableBase";
import {CompilerBase}					from "../shaders/compilers/CompilerBase";
import {ShaderRegisterCache}			from "../shaders/ShaderRegisterCache";
import {ShaderRegisterData}			from "../shaders/ShaderRegisterData";
import {ShaderRegisterElement}		from "../shaders/ShaderRegisterElement";
import {GL_TextureBase}				from "../textures/GL_TextureBase";

/**
 * ShaderBase keeps track of the number of dependencies for "named registers" used across a pass.
 * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
 * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
 * each time a method has been compiled into the shader.
 *
 * @see RegisterPool.addUsage
 */
export class ShaderBase implements IAbstractionPool
{
	public static _abstractionClassPool:Object = new Object();

	private _abstractionPool:Object = new Object();

	private _elementsClass:IElementsClassGL;
	private _pass:IPass;
	public _stage:Stage;
	private _programData:ProgramData;

	private _blendFactorSource:string = ContextGLBlendFactor.ONE;
	private _blendFactorDest:string = ContextGLBlendFactor.ZERO;
	
	private _invalidProgram:boolean = true;
	private _animationVertexCode:string = "";
	private _animationFragmentCode:string = "";
	private _numUsedVertexConstants:number;
	private _numUsedFragmentConstants:number;
	private _numUsedStreams:number;
	private _numUsedTextures:number;
	private _usesAnimation:boolean;

	public get programData():ProgramData
	{
		if (this._invalidProgram)
			this._updateProgram();

		return this._programData;
	}

	public usesBlending:boolean = false;

	public useImageRect:boolean = false;

	public usesCurves:boolean = false;

	/**
	 * The depth compare mode used to render the renderables using this material.
	 *
	 * @see away.stagegl.ContextGLCompareMode
	 */
	public depthCompareMode:string = ContextGLCompareMode.LESS;


	/**
	 * Indicate whether the shader should write to the depth buffer or not. Ignored when blending is enabled.
	 */
	public writeDepth:boolean = true;

	public profile:string;

	public get usesAnimation():boolean
	{
		return this._usesAnimation;
	}

	public set usesAnimation(value:boolean)
	{
		if (this._usesAnimation == value)
			return;

		this._usesAnimation = value;

		this.invalidateProgram();
	}

	private _defaultCulling:string = ContextGLTriangleFace.BACK;

	public _pInverseSceneMatrix:Float32Array = new Float32Array(16);

	public animationRegisterData:AnimationRegisterData;

	
	public get numUsedVertexConstants():number
	{
		if (this._invalidProgram)
			this._updateProgram();
		
		return this._numUsedVertexConstants;
	}

	public get numUsedFragmentConstants():number
	{
		if (this._invalidProgram)
			this._updateProgram();
		
		return this._numUsedFragmentConstants;
	}
	
	/**
	 * The amount of used vertex streams in the vertex code. Used by the animation code generation to know from which index on streams are available.
	 */
	public get numUsedStreams():number
	{
		if (this._invalidProgram)
			this._updateProgram();

		return this._numUsedStreams;
	}

	/**
	 *
	 */
	public get numUsedTextures():number
	{
		if (this._invalidProgram)
			this._updateProgram();

		return this._numUsedTextures;
	}

	public numLights:number;

	public useAlphaPremultiplied:boolean;
	public useBothSides:boolean;
	public usesUVTransform:boolean;
	public usesColorTransform:boolean;
	public alphaThreshold:number;


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
	public usesPositionFragment:boolean = false;

	public vertexConstantData:Float32Array;
	public fragmentConstantData:Float32Array;

	/**
	 * The index for the common data register.
	 */
	public commonsDataIndex:number;

	/**
	 * The index for the curve vertex attribute stream.
	 */
	public curvesIndex:number;

	/**
	 * The index for the UV vertex attribute stream.
	 */
	public uvIndex:number;

	/**
	 * The index for the secondary UV vertex attribute stream.
	 */
	public secondaryUVIndex:number;

	/**
	 * The index for the vertex normal attribute stream.
	 */
	public normalIndex:number;

	/**
	 * The index for the color attribute stream.
	 */
	public colorBufferIndex:number;

	/**
	 * The index for the vertex tangent attribute stream.
	 */
	public tangentIndex:number;

	/**
	 * 
	 */
	public skyboxScaleIndex:number;
	
	/**
	 * 
	 */
	public scenePositionIndex:number;
	
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
	public uvMatrixIndex:number;

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
	 *
	 */
	public imageIndices:Array<number> = new Array<number>();

	/**
	 * 
	 */
	public activeElements:GL_ElementsBase;

	/**
	 * Creates a new MethodCompilerVO object.
	 */
	constructor(elementsClass:IElementsClassGL, pass:IPass, stage:Stage)
	{
		this._elementsClass = elementsClass;
		this._pass = pass;
		this._stage = stage;

		this.profile = this._stage.profile;
	}

	public getAbstraction(texture:TextureBase):GL_TextureBase
	{
		return (this._abstractionPool[texture.id] || (this._abstractionPool[texture.id] = new (<GL_IAssetClass> ShaderBase._abstractionClassPool[texture.assetType])(texture, this)));
	}

	/**
	 *
	 * @param image
	 */
	public clearAbstraction(texture:TextureBase):void
	{
		this._abstractionPool[texture.id] = null;
	}

	/**
	 *
	 * @param imageObjectClass
	 */
	public static registerAbstraction(gl_assetClass:GL_IAssetClass, assetClass:IAssetClass):void
	{
		ShaderBase._abstractionClassPool[assetClass.assetType] = gl_assetClass;
	}

	public getImageIndex(texture:TextureBase, index:number = 0):number
	{
		return this._pass.getImageIndex(texture, index);
	}

	public _iIncludeDependencies():void
	{
		this._pass._iIncludeDependencies(this);
	}

	/**
	 * Factory method to create a concrete compiler object for this object
	 *
	 * @param elementsClass
	 * @param pass
	 * @param stage
	 * @returns {CompilerBase}
	 */
	public createCompiler(elementsClass:IElementsClassGL, pass:IPass):CompilerBase
	{
		return new CompilerBase(elementsClass, pass, this);
	}

	/**
	 * Clears dependency counts for all registers. Called when recompiling a pass.
	 */
	public reset():void
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
		this.usesPositionFragment = false;
		this.usesFragmentAnimation = false;
		this.usesTangentSpace = false;
		this.outputsNormals = false;
		this.outputsTangentNormals = false;
	}

	public pInitRegisterIndices():void
	{
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
	}

	/**
	 * Initializes the unchanging constant data for this shader object.
	 */
	public initConstantData(registerCache:ShaderRegisterCache):void
	{
		//Updates the amount of used register indices.
		this._numUsedVertexConstants = registerCache.numUsedVertexConstants;
		this._numUsedFragmentConstants = registerCache.numUsedFragmentConstants;
		this._numUsedStreams = registerCache.numUsedStreams;
		this._numUsedTextures = registerCache.numUsedTextures;

		this.vertexConstantData = new Float32Array(registerCache.numUsedVertexConstants*4);
		this.fragmentConstantData = new Float32Array(registerCache.numUsedFragmentConstants*4);

		//Initializes commonly required constant values.
		if (this.commonsDataIndex >= 0) {
			this.fragmentConstantData[this.commonsDataIndex] = .5;
			this.fragmentConstantData[this.commonsDataIndex + 1] = 0;
			this.fragmentConstantData[this.commonsDataIndex + 2] = 1/255;
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
		if (this.cameraPositionIndex >= 0)
			this.vertexConstantData[this.cameraPositionIndex + 3] = 1;
		
		// init constant data in pass
		this._pass._iInitConstantData(this);
		
		//init constant data in animation
		if (this.usesAnimation)
			this._pass.animationSet.doneAGALCode(this);
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
	public setBlendMode(value:string):void
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
	public _iActivate(camera:Camera):void
	{
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

		this.activeElements = null;
	}

	/**
	 * @inheritDoc
	 */
	public _iDeactivate():void
	{
		//For the love of god don't remove this if you want your multi-material shadows to not flicker like shit
		this._stage.context.setDepthTest(true, ContextGLCompareMode.LESS);

		this.activeElements = null;
	}


	/**
	 *
	 *
	 * @param renderable
	 * @param stage
	 * @param camera
	 */
	public _setRenderState(renderable:GL_RenderableBase, camera:Camera, viewProjection:Matrix3D):void
	{
		if (renderable.renderable.animator)
			(<AnimatorBase> renderable.renderable.animator).setRenderState(this, renderable, this._stage, camera);

		if (this.usesUVTransform) {
			var uvMatrix:Matrix = renderable.uvMatrix;

			if (uvMatrix) {
				//transpose
				var rawData:Float32Array = uvMatrix.rawData;
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

			var colorTransform:ColorTransform = renderable.sourceEntity._iAssignedColorTransform();

			if (colorTransform) {
				//TODO: AWDParser to write normalised color offsets
				this.fragmentConstantData[this.colorTransformIndex] = colorTransform.rawData[0];
				this.fragmentConstantData[this.colorTransformIndex + 1] = colorTransform.rawData[1];
				this.fragmentConstantData[this.colorTransformIndex + 2] = colorTransform.rawData[2];
				this.fragmentConstantData[this.colorTransformIndex + 3] = colorTransform.rawData[3];
				this.fragmentConstantData[this.colorTransformIndex + 4] = colorTransform.rawData[4]/255;
				this.fragmentConstantData[this.colorTransformIndex + 5] = colorTransform.rawData[5]/255;
				this.fragmentConstantData[this.colorTransformIndex + 6] = colorTransform.rawData[6]/255;
				this.fragmentConstantData[this.colorTransformIndex + 7] = colorTransform.rawData[7]/255;
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

	public invalidateProgram():void
	{
		this._invalidProgram = true;
	}

	public dispose():void
	{
		this._programData.dispose();
		this._programData = null;
	}

	private _updateProgram():void
	{
		this._invalidProgram = false;

		var compiler:CompilerBase = this.createCompiler(this._elementsClass, this._pass);
		compiler.compile();

		this._calcAnimationCode(compiler._pRegisterCache, compiler.shadedTarget, compiler._pSharedRegisters);

		//initialise the required shader constants
		this.initConstantData(compiler._pRegisterCache);
		
		var programData:ProgramData = this._stage.getProgramData(this._animationVertexCode + compiler.vertexCode, compiler.fragmentCode + this._animationFragmentCode + compiler.postAnimationFragmentCode);

		//check program data hasn't changed, keep count of program usages
		if (this._programData != programData) {
			if (this._programData)
				this._programData.dispose();

			this._programData = programData;

			programData.usages++;
		}
	}

	private _calcAnimationCode(registerCache:ShaderRegisterCache, shadedTarget:ShaderRegisterElement, sharedRegisters:ShaderRegisterData):void
	{
		//reset code
		this._animationVertexCode = "";
		this._animationFragmentCode = "";

		//check to see if GPU animation is used
		if (this.usesAnimation) {

			var animationSet:AnimationSetBase = <AnimationSetBase> this._pass.animationSet;

			this._animationVertexCode += animationSet.getAGALVertexCode(this, registerCache, sharedRegisters);

			if (this.uvDependencies > 0 && !this.usesUVTransform)
				this._animationVertexCode += animationSet.getAGALUVCode(this, registerCache, sharedRegisters);

			if (this.usesFragmentAnimation)
				this._animationFragmentCode += animationSet.getAGALFragmentCode(this, registerCache, shadedTarget);
		} else {
			// simply write attributes to targets, do not animate them
			// projection will pick up on targets[0] to do the projection
			var len:number = sharedRegisters.animatableAttributes.length;
			for (var i:number = 0; i < len; ++i)
				this._animationVertexCode += "mov " + sharedRegisters.animationTargetRegisters[i] + ", " + sharedRegisters.animatableAttributes[i] + "\n";

			if (this.uvDependencies > 0 && !this.usesUVTransform)
				this._animationVertexCode += "mov " + sharedRegisters.uvTarget + "," + sharedRegisters.uvSource + "\n";
		}
	}


	public setVertexConst(index:number, x:number = 0, y:number = 0, z:number = 0, w:number = 0):void
	{
		index *= 4;
		this.vertexConstantData[index++] = x;
		this.vertexConstantData[index++] = y;
		this.vertexConstantData[index++] = z;
		this.vertexConstantData[index] = w;
	}

	public setVertexConstFromArray(index:number, data:Float32Array):void
	{
		index *= 4;
		for (var i:number /*int*/ = 0; i < data.length; i++)
			this.vertexConstantData[index++] = data[i];
	}

	public setVertexConstFromMatrix(index:number, matrix:Matrix3D):void
	{
		index *= 4;
		var rawData:Float32Array = matrix.rawData;
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

	public setFragmentConst(index:number, x:number = 0, y:number = 0, z:number = 0, w:number = 0):void
	{
		index *= 4;
		this.fragmentConstantData[index++] = x;
		this.fragmentConstantData[index++] = y;
		this.fragmentConstantData[index++] = z;
		this.fragmentConstantData[index] = w;
	}
}