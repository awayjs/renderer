import ColorTransform					= require("awayjs-core/lib/geom/ColorTransform");
import Matrix							= require("awayjs-core/lib/geom/Matrix");
import Matrix3D							= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils					= require("awayjs-core/lib/geom/Matrix3DUtils");
import Vector3D							= require("awayjs-core/lib/geom/Vector3D");
import AbstractMethodError				= require("awayjs-core/lib/errors/AbstractMethodError");
import Texture2DBase					= require("awayjs-core/lib/textures/Texture2DBase");

import TriangleSubGeometry				= require("awayjs-display/lib/base/TriangleSubGeometry");
import Camera							= require("awayjs-display/lib/entities/Camera");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import MaterialPassData					= require("awayjs-renderergl/lib/pool/MaterialPassData");
import RenderableBase					= require("awayjs-renderergl/lib/pool/RenderableBase");
import ShadingMethodEvent				= require("awayjs-renderergl/lib/events/ShadingMethodEvent");
import MethodVO							= require("awayjs-renderergl/lib/materials/compilation/MethodVO");
import ShaderLightingObject				= require("awayjs-renderergl/lib/materials/compilation/ShaderLightingObject");
import ShaderObjectBase					= require("awayjs-renderergl/lib/materials/compilation/ShaderObjectBase");
import ShaderRegisterCache				= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData				= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterElement");
import AmbientBasicMethod				= require("awayjs-renderergl/lib/materials/methods/AmbientBasicMethod");
import DiffuseBasicMethod				= require("awayjs-renderergl/lib/materials/methods/DiffuseBasicMethod");
import EffectColorTransformMethod		= require("awayjs-renderergl/lib/materials/methods/EffectColorTransformMethod");
import EffectMethodBase					= require("awayjs-renderergl/lib/materials/methods/EffectMethodBase");
import LightingMethodBase				= require("awayjs-renderergl/lib/materials/methods/LightingMethodBase");
import NormalBasicMethod				= require("awayjs-renderergl/lib/materials/methods/NormalBasicMethod");
import ShadowMapMethodBase				= require("awayjs-renderergl/lib/materials/methods/ShadowMapMethodBase");
import SpecularBasicMethod				= require("awayjs-renderergl/lib/materials/methods/SpecularBasicMethod");
import ILightingPassStageGL				= require("awayjs-renderergl/lib/materials/passes/ILightingPassStageGL");
import MaterialPassBase					= require("awayjs-renderergl/lib/materials/passes/MaterialPassBase");
import MaterialPassMode					= require("awayjs-renderergl/lib/materials/passes/MaterialPassMode");
import RendererBase						= require("awayjs-renderergl/lib/render/RendererBase");

/**
 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
 * using material methods to define their appearance.
 */
class TriangleMethodPass extends MaterialPassBase implements ILightingPassStageGL
{
	public _iColorTransformMethodVO:MethodVO;
	public _iNormalMethodVO:MethodVO;
	public _iAmbientMethodVO:MethodVO;
	public _iShadowMethodVO:MethodVO;
	public _iDiffuseMethodVO:MethodVO;
	public _iSpecularMethodVO:MethodVO;
	public _iMethodVOs:Array<MethodVO> = new Array<MethodVO>();

	public _numEffectDependencies:number = 0;

	private _onShaderInvalidatedDelegate:(event:ShadingMethodEvent) => void;

	/**
	 * Creates a new CompiledPass object.
	 *
	 * @param material The material to which this pass belongs.
	 */
	constructor(passMode:number = 0x03)
	{
		super(passMode);

		this._onShaderInvalidatedDelegate = (event:ShadingMethodEvent) => this.onShaderInvalidated(event);
	}

	/**
	 * Factory method to create a concrete shader object for this pass.
	 *
	 * @param profile The compatibility profile used by the renderer.
	 */
	public createShaderObject(profile:string):ShaderObjectBase
	{
		if (this._pLightPicker && (this.passMode & MaterialPassMode.LIGHTING))
			return new ShaderLightingObject(profile);

		return new ShaderObjectBase(profile);
	}

	/**
	 * Initializes the unchanging constant data for this material.
	 */
	public _iInitConstantData(shaderObject:ShaderObjectBase)
	{
		super._iInitConstantData(shaderObject);

		//Updates method constants if they have changed.
		var len:number = this._iMethodVOs.length;
		for (var i:number = 0; i < len; ++i)
			this._iMethodVOs[i].method.iInitConstants(shaderObject, this._iMethodVOs[i]);
	}

	/**
	 * The ColorTransform object to transform the colour of the material with. Defaults to null.
	 */
	public get colorTransform():ColorTransform
	{
		return this.colorTransformMethod? this.colorTransformMethod.colorTransform : null;
	}

	public set colorTransform(value:ColorTransform)
	{
		if (value) {
			if (this.colorTransformMethod == null)
				this.colorTransformMethod = new EffectColorTransformMethod();

			this.colorTransformMethod.colorTransform = value;

		} else if (!value) {
			if (this.colorTransformMethod)
				this.colorTransformMethod = null;
		}
	}

	/**
	 * The EffectColorTransformMethod object to transform the colour of the material with. Defaults to null.
	 */
	public get colorTransformMethod():EffectColorTransformMethod
	{
		return this._iColorTransformMethodVO? <EffectColorTransformMethod> this._iColorTransformMethodVO.method : null;
	}

	public set colorTransformMethod(value:EffectColorTransformMethod)
	{
		if (this._iColorTransformMethodVO && this._iColorTransformMethodVO.method == value)
			return;

		if (this._iColorTransformMethodVO) {
			this._removeDependency(this._iColorTransformMethodVO);
			this._iColorTransformMethodVO = null;
		}

		if (value) {
			this._iColorTransformMethodVO = new MethodVO(value);
			this._addDependency(this._iColorTransformMethodVO);
		}
	}

	private _removeDependency(methodVO:MethodVO, effectsDependency:boolean = false)
	{
		var index:number = this._iMethodVOs.indexOf(methodVO);

		if (!effectsDependency)
			this._numEffectDependencies--;

		methodVO.method.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
		this._iMethodVOs.splice(index, 1);

		this._pInvalidatePass();
	}

	private _addDependency(methodVO:MethodVO, effectsDependency:boolean = false, index:number = -1)
	{
		methodVO.method.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);

		if (effectsDependency) {
			if (index != -1)
				this._iMethodVOs.splice(index + this._iMethodVOs.length - this._numEffectDependencies, 0, methodVO);
			else
				this._iMethodVOs.push(methodVO);
			this._numEffectDependencies++;
		} else {
			this._iMethodVOs.splice(this._iMethodVOs.length - this._numEffectDependencies, 0, methodVO);
		}

		this._pInvalidatePass();
	}

	/**
	 * Appends an "effect" shading method to the shader. Effect methods are those that do not influence the lighting
	 * but modulate the shaded colour, used for fog, outlines, etc. The method will be applied to the result of the
	 * methods added prior.
	 */
	public addEffectMethod(method:EffectMethodBase)
	{
		this._addDependency(new MethodVO(method), true);
	}

	/**
	 * The number of "effect" methods added to the material.
	 */
	public get numEffectMethods():number
	{
		return this._numEffectDependencies;
	}

	/**
	 * Queries whether a given effects method was added to the material.
	 *
	 * @param method The method to be queried.
	 * @return true if the method was added to the material, false otherwise.
	 */
	public hasEffectMethod(method:EffectMethodBase):boolean
	{
		return this.getDependencyForMethod(method) != null;
	}

	/**
	 * Returns the method added at the given index.
	 * @param index The index of the method to retrieve.
	 * @return The method at the given index.
	 */
	public getEffectMethodAt(index:number):EffectMethodBase
	{
		if (index < 0 || index > this._numEffectDependencies - 1)
			return null;

		return <EffectMethodBase> this._iMethodVOs[index + this._iMethodVOs.length - this._numEffectDependencies].method;
	}

	/**
	 * Adds an effect method at the specified index amongst the methods already added to the material. Effect
	 * methods are those that do not influence the lighting but modulate the shaded colour, used for fog, outlines,
	 * etc. The method will be applied to the result of the methods with a lower index.
	 */
	public addEffectMethodAt(method:EffectMethodBase, index:number)
	{
		this._addDependency(new MethodVO(method), true, index);
	}

	/**
	 * Removes an effect method from the material.
	 * @param method The method to be removed.
	 */
	public removeEffectMethod(method:EffectMethodBase)
	{
		var methodVO:MethodVO = this.getDependencyForMethod(method);

		if (methodVO != null)
			this._removeDependency(methodVO, true);
	}


	private getDependencyForMethod(method:EffectMethodBase):MethodVO
	{
		var len:number = this._iMethodVOs.length;
		for (var i:number = 0; i < len; ++i)
			if (this._iMethodVOs[i].method == method)
				return this._iMethodVOs[i];

		return null;
	}

	/**
	 * The method used to generate the per-pixel normals. Defaults to NormalBasicMethod.
	 */
	public get normalMethod():NormalBasicMethod
	{
		return this._iNormalMethodVO? <NormalBasicMethod> this._iNormalMethodVO.method : null;
	}

	public set normalMethod(value:NormalBasicMethod)
	{
		if (this._iNormalMethodVO && this._iNormalMethodVO.method == value)
			return;

		if (this._iNormalMethodVO) {
			this._removeDependency(this._iNormalMethodVO);
			this._iNormalMethodVO = null;
		}

		if (value) {
			this._iNormalMethodVO = new MethodVO(value);
			this._addDependency(this._iNormalMethodVO);
		}
	}

	/**
	 * The method that provides the ambient lighting contribution. Defaults to AmbientBasicMethod.
	 */
	public get ambientMethod():AmbientBasicMethod
	{
		return this._iAmbientMethodVO? <AmbientBasicMethod> this._iAmbientMethodVO.method : null;
	}

	public set ambientMethod(value:AmbientBasicMethod)
	{
		if (this._iAmbientMethodVO && this._iAmbientMethodVO.method == value)
			return;

		if (this._iAmbientMethodVO) {
			this._removeDependency(this._iAmbientMethodVO);
			this._iAmbientMethodVO = null;
		}

		if (value) {
			this._iAmbientMethodVO = new MethodVO(value);
			this._addDependency(this._iAmbientMethodVO);
		}
	}

	/**
	 * The method used to render shadows cast on this surface, or null if no shadows are to be rendered. Defaults to null.
	 */
	public get shadowMethod():ShadowMapMethodBase
	{
		return this._iShadowMethodVO? <ShadowMapMethodBase> this._iShadowMethodVO.method : null;
	}

	public set shadowMethod(value:ShadowMapMethodBase)
	{
		if (this._iShadowMethodVO && this._iShadowMethodVO.method == value)
			return;

		if (this._iShadowMethodVO) {
			this._removeDependency(this._iShadowMethodVO);
			this._iShadowMethodVO = null;
		}

		if (value) {
			this._iShadowMethodVO = new MethodVO(value);
			this._addDependency(this._iShadowMethodVO);
		}
	}

	/**
	 * The method that provides the diffuse lighting contribution. Defaults to DiffuseBasicMethod.
	 */
	public get diffuseMethod():DiffuseBasicMethod
	{
		return this._iDiffuseMethodVO? <DiffuseBasicMethod> this._iDiffuseMethodVO.method : null;
	}

	public set diffuseMethod(value:DiffuseBasicMethod)
	{
		if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.method == value)
			return;

		if (this._iDiffuseMethodVO) {
			this._removeDependency(this._iDiffuseMethodVO);
			this._iDiffuseMethodVO = null;
		}

		if (value) {
			this._iDiffuseMethodVO = new MethodVO(value);
			this._addDependency(this._iDiffuseMethodVO);
		}
	}

	/**
	 * The method that provides the specular lighting contribution. Defaults to SpecularBasicMethod.
	 */
	public get specularMethod():SpecularBasicMethod
	{
		return this._iSpecularMethodVO? <SpecularBasicMethod> this._iSpecularMethodVO.method : null;
	}

	public set specularMethod(value:SpecularBasicMethod)
	{
		if (this._iSpecularMethodVO && this._iSpecularMethodVO.method == value)
			return;

		if (this._iSpecularMethodVO) {
			this._removeDependency(this._iSpecularMethodVO);
			this._iSpecularMethodVO = null;
		}

		if (value) {
			this._iSpecularMethodVO = new MethodVO(value);
			this._addDependency(this._iSpecularMethodVO);
		}
	}

	/**
	 * @inheritDoc
	 */
	public dispose()
	{
		super.dispose();

		while (this._iMethodVOs.length)
			this._removeDependency(this._iMethodVOs[0]);

		this._iMethodVOs = null;
	}

	/**
	 * Called when any method's shader code is invalidated.
	 */
	private onShaderInvalidated(event:ShadingMethodEvent)
	{
		this._pInvalidatePass();
	}

	// RENDER LOOP

	/**
	 * @inheritDoc
	 */
	public _iActivate(pass:MaterialPassData, renderer:RendererBase, camera:Camera)
	{
		super._iActivate(pass, renderer, camera);

		var methodVO:MethodVO;
		var len:number = this._iMethodVOs.length;
		for (var i:number = 0; i < len; ++i) {
			methodVO = this._iMethodVOs[i];
			if (methodVO.useMethod)
				methodVO.method.iActivate(pass.shaderObject, methodVO, renderer.stage);
		}
	}

	/**
	 *
	 *
	 * @param renderable
	 * @param stage
	 * @param camera
	 */
	public setRenderState(pass:MaterialPassData, renderable:RenderableBase, stage:Stage, camera:Camera, viewProjection:Matrix3D)
	{
		super.setRenderState(pass, renderable, stage, camera, viewProjection);

		var methodVO:MethodVO;
		var len:number = this._iMethodVOs.length;
		for (var i:number = 0; i < len; ++i) {
			methodVO = this._iMethodVOs[i];
			if (methodVO.useMethod)
				methodVO.method.iSetRenderState(pass.shaderObject, methodVO, renderable, stage, camera);
		}
	}

	/**
	 * @inheritDoc
	 */
	public _iDeactivate(pass:MaterialPassData, renderer:RendererBase)
	{
		super._iDeactivate(pass, renderer);

		var methodVO:MethodVO;
		var len:number = this._iMethodVOs.length;
		for (var i:number = 0; i < len; ++i) {
			methodVO = this._iMethodVOs[i];
			if (methodVO.useMethod)
				methodVO.method.iDeactivate(pass.shaderObject, methodVO, renderer.stage);
		}
	}

	public _iIncludeDependencies(shaderObject:ShaderLightingObject)
	{
		var i:number;
		var len:number = this._iMethodVOs.length;
		for (i = 0; i < len; ++i)
			this.setupAndCountDependencies(shaderObject, this._iMethodVOs[i]);

		for (i = 0; i < len; ++i)
			this._iMethodVOs[i].useMethod = this._iMethodVOs[i].method.iIsUsed(shaderObject);

		super._iIncludeDependencies(shaderObject);
	}


	/**
	 * Counts the dependencies for a given method.
	 * @param method The method to count the dependencies for.
	 * @param methodVO The method's data for this material.
	 */
	private setupAndCountDependencies(shaderObject:ShaderObjectBase, methodVO:MethodVO)
	{
		methodVO.reset();

		methodVO.method.iInitVO(shaderObject, methodVO);

		if (methodVO.needsProjection)
			shaderObject.projectionDependencies++;

		if (methodVO.needsGlobalVertexPos) {

			shaderObject.globalPosDependencies++;

			if (methodVO.needsGlobalFragmentPos)
				shaderObject.usesGlobalPosFragment = true;

		} else if (methodVO.needsGlobalFragmentPos) {
			shaderObject.globalPosDependencies++;
			shaderObject.usesGlobalPosFragment = true;
		}

		if (methodVO.needsNormals)
			shaderObject.normalDependencies++;

		if (methodVO.needsTangents)
			shaderObject.tangentDependencies++;

		if (methodVO.needsView)
			shaderObject.viewDirDependencies++;

		if (methodVO.needsUV)
			shaderObject.uvDependencies++;

		if (methodVO.needsSecondaryUV)
			shaderObject.secondaryUVDependencies++;
	}

	public _iGetPreLightingVertexCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (this._iAmbientMethodVO && this._iAmbientMethodVO.useMethod)
			code += this._iAmbientMethodVO.method.iGetVertexCode(shaderObject, this._iAmbientMethodVO, registerCache, sharedRegisters);

		if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.useMethod)
			code += this._iDiffuseMethodVO.method.iGetVertexCode(shaderObject, this._iDiffuseMethodVO, registerCache, sharedRegisters);

		if (this._iSpecularMethodVO && this._iSpecularMethodVO.useMethod)
			code += this._iSpecularMethodVO.method.iGetVertexCode(shaderObject, this._iSpecularMethodVO, registerCache, sharedRegisters);

		return code;
	}

	public _iGetPreLightingFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (this._iAmbientMethodVO && this._iAmbientMethodVO.useMethod) {
			code += this._iAmbientMethodVO.method.iGetFragmentCode(shaderObject, this._iAmbientMethodVO, sharedRegisters.shadedTarget, registerCache, sharedRegisters);

			if (this._iAmbientMethodVO.needsNormals)
				registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);

			if (this._iAmbientMethodVO.needsView)
				registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
		}

		if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.useMethod)
			code += (<LightingMethodBase> this._iDiffuseMethodVO.method).iGetFragmentPreLightingCode(<ShaderLightingObject> shaderObject, this._iDiffuseMethodVO, registerCache, sharedRegisters);

		if (this._iSpecularMethodVO && this._iSpecularMethodVO.useMethod)
			code += (<LightingMethodBase> this._iSpecularMethodVO.method).iGetFragmentPreLightingCode(<ShaderLightingObject> shaderObject, this._iSpecularMethodVO, registerCache, sharedRegisters);

		return code;
	}

	public _iGetPerLightDiffuseFragmentCode(shaderObject:ShaderLightingObject, lightDirReg:ShaderRegisterElement, diffuseColorReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return (<LightingMethodBase> this._iDiffuseMethodVO.method).iGetFragmentCodePerLight(shaderObject, this._iDiffuseMethodVO, lightDirReg, diffuseColorReg, registerCache, sharedRegisters);
	}

	public _iGetPerLightSpecularFragmentCode(shaderObject:ShaderLightingObject, lightDirReg:ShaderRegisterElement, specularColorReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return (<LightingMethodBase> this._iSpecularMethodVO.method).iGetFragmentCodePerLight(shaderObject, this._iSpecularMethodVO, lightDirReg, specularColorReg, registerCache, sharedRegisters);
	}

	public _iGetPerProbeDiffuseFragmentCode(shaderObject:ShaderLightingObject, texReg:ShaderRegisterElement, weightReg:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return (<LightingMethodBase> this._iDiffuseMethodVO.method).iGetFragmentCodePerProbe(shaderObject, this._iDiffuseMethodVO, texReg, weightReg, registerCache, sharedRegisters);
	}

	public _iGetPerProbeSpecularFragmentCode(shaderObject:ShaderLightingObject, texReg:ShaderRegisterElement, weightReg:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return (<LightingMethodBase> this._iSpecularMethodVO.method).iGetFragmentCodePerProbe(shaderObject, this._iSpecularMethodVO, texReg, weightReg, registerCache, sharedRegisters);
	}

	public _iGetPostLightingVertexCode(shaderObject:ShaderLightingObject, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (this._iShadowMethodVO)
			code += this._iShadowMethodVO.method.iGetVertexCode(shaderObject, this._iShadowMethodVO, registerCache, sharedRegisters);

		return code;
	}

	public _iGetPostLightingFragmentCode(shaderObject:ShaderLightingObject, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (shaderObject.useAlphaPremultiplied && this._pEnableBlending) {
			code += "add " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.commons + ".z\n" +
				"div " + sharedRegisters.shadedTarget + ".xyz, " + sharedRegisters.shadedTarget + ", " + sharedRegisters.shadedTarget + ".w\n" +
				"sub " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.shadedTarget + ".w, " + sharedRegisters.commons + ".z\n" +
				"sat " + sharedRegisters.shadedTarget + ".xyz, " + sharedRegisters.shadedTarget + "\n";
		}

		if (this._iShadowMethodVO)
			code += this._iShadowMethodVO.method.iGetFragmentCode(shaderObject, this._iShadowMethodVO, sharedRegisters.shadowTarget, registerCache, sharedRegisters);

		if (this._iDiffuseMethodVO && this._iDiffuseMethodVO.useMethod) {
			code += (<LightingMethodBase> this._iDiffuseMethodVO.method).iGetFragmentPostLightingCode(shaderObject, this._iDiffuseMethodVO, sharedRegisters.shadedTarget, registerCache, sharedRegisters);

			// resolve other dependencies as well?
			if (this._iDiffuseMethodVO.needsNormals)
				registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);

			if (this._iDiffuseMethodVO.needsView)
				registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
		}

		if (this._iSpecularMethodVO && this._iSpecularMethodVO.useMethod) {
			code += (<LightingMethodBase> this._iSpecularMethodVO.method).iGetFragmentPostLightingCode(shaderObject, this._iSpecularMethodVO, sharedRegisters.shadedTarget, registerCache, sharedRegisters);
			if (this._iSpecularMethodVO.needsNormals)
				registerCache.removeFragmentTempUsage(sharedRegisters.normalFragment);
			if (this._iSpecularMethodVO.needsView)
				registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);
		}

		if (this._iShadowMethodVO)
			registerCache.removeFragmentTempUsage(sharedRegisters.shadowTarget);

		return code;
	}

	/**
	 * Indicates whether or not normals are allowed in tangent space. This is only the case if no object-space
	 * dependencies exist.
	 */
	public _pUsesTangentSpace(shaderObject:ShaderLightingObject):boolean
	{
		if (shaderObject.usesProbes)
			return false;

		var methodVO:MethodVO;
		var len:number = this._iMethodVOs.length;
		for (var i:number = 0; i < len; ++i) {
			methodVO = this._iMethodVOs[i];
			if (methodVO.useMethod && !methodVO.method.iUsesTangentSpace())
				return false;
		}

		return true;
	}

	/**
	 * Indicates whether or not normals are output in tangent space.
	 */
	public _pOutputsTangentNormals(shaderObject:ShaderObjectBase):boolean
	{
		return (<NormalBasicMethod> this._iNormalMethodVO.method).iOutputsTangentNormals();
	}

	/**
	 * Indicates whether or not normals are output by the pass.
	 */
	public _pOutputsNormals(shaderObject:ShaderObjectBase):boolean
	{
		return this._iNormalMethodVO && this._iNormalMethodVO.useMethod;
	}


	public _iGetNormalVertexCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._iNormalMethodVO.method.iGetVertexCode(shaderObject, this._iNormalMethodVO, registerCache, sharedRegisters);
	}

	public _iGetNormalFragmentCode(shaderObject:ShaderObjectBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = this._iNormalMethodVO.method.iGetFragmentCode(shaderObject, this._iNormalMethodVO, sharedRegisters.normalFragment, registerCache, sharedRegisters);

		if (this._iNormalMethodVO.needsView)
			registerCache.removeFragmentTempUsage(sharedRegisters.viewDirFragment);

		if (this._iNormalMethodVO.needsGlobalFragmentPos || this._iNormalMethodVO.needsGlobalVertexPos)
			registerCache.removeVertexTempUsage(sharedRegisters.globalPositionVertex);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetVertexCode(shaderObject:ShaderObjectBase, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData):string
	{
		var code:string = "";
		var methodVO:MethodVO;
		var len:number = this._iMethodVOs.length;
		for (var i:number = len - this._numEffectDependencies; i < len; i++) {
			methodVO = this._iMethodVOs[i];
			if (methodVO.useMethod) {
				code += methodVO.method.iGetVertexCode(shaderObject, methodVO, regCache, sharedReg);

				if (methodVO.needsGlobalVertexPos || methodVO.needsGlobalFragmentPos)
					regCache.removeVertexTempUsage(sharedReg.globalPositionVertex);
			}
		}

		if (this._iColorTransformMethodVO && this._iColorTransformMethodVO.useMethod)
			code += this._iColorTransformMethodVO.method.iGetVertexCode(shaderObject, this._iColorTransformMethodVO, regCache, sharedReg);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetFragmentCode(shaderObject:ShaderObjectBase, regCache:ShaderRegisterCache, sharedReg:ShaderRegisterData):string
	{
		var code:string = "";
		var alphaReg:ShaderRegisterElement;

		if (this.preserveAlpha && this._numEffectDependencies > 0) {
			alphaReg = regCache.getFreeFragmentSingleTemp();
			regCache.addFragmentTempUsages(alphaReg, 1);
			code += "mov " + alphaReg + ", " + sharedReg.shadedTarget + ".w\n";
		}

		var methodVO:MethodVO;
		var len:number = this._iMethodVOs.length;
		for (var i:number = len - this._numEffectDependencies; i < len; i++) {
			methodVO = this._iMethodVOs[i];
			if (methodVO.useMethod) {
				code += methodVO.method.iGetFragmentCode(shaderObject, methodVO, sharedReg.shadedTarget, regCache, sharedReg);

				if (methodVO.needsNormals)
					regCache.removeFragmentTempUsage(sharedReg.normalFragment);

				if (methodVO.needsView)
					regCache.removeFragmentTempUsage(sharedReg.viewDirFragment);

			}
		}

		if (this.preserveAlpha && this._numEffectDependencies > 0) {
			code += "mov " + sharedReg.shadedTarget + ".w, " + alphaReg + "\n";
			regCache.removeFragmentTempUsage(alphaReg);
		}

		if (this._iColorTransformMethodVO && this._iColorTransformMethodVO.useMethod)
			code += this._iColorTransformMethodVO.method.iGetFragmentCode(shaderObject, this._iColorTransformMethodVO, sharedReg.shadedTarget, regCache, sharedReg);

		return code;
	}
	/**
	 * Indicates whether the shader uses any shadows.
	 */
	public _iUsesShadows():boolean
	{
		return Boolean(this._iShadowMethodVO || this.lightPicker.castingDirectionalLights.length > 0 || this.lightPicker.castingPointLights.length > 0);
	}

	/**
	 * Indicates whether the shader uses any specular component.
	 */
	public _iUsesSpecular():boolean
	{
		return Boolean(this._iSpecularMethodVO);
	}
}

export = TriangleMethodPass;