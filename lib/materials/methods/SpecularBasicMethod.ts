import Texture2DBase				= require("awayjs-core/lib/textures/Texture2DBase");

import Stage						= require("awayjs-stagegl/lib/base/Stage");
import ContextGLMipFilter			= require("awayjs-stagegl/lib/base/ContextGLMipFilter");
import ContextGLTextureFilter		= require("awayjs-stagegl/lib/base/ContextGLTextureFilter");
import ContextGLWrapMode			= require("awayjs-stagegl/lib/base/ContextGLWrapMode");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");

import MethodVO						= require("awayjs-renderergl/lib/materials/compilation/MethodVO");
import ShaderLightingObject			= require("awayjs-renderergl/lib/materials/compilation/ShaderLightingObject");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterElement");
import LightingMethodBase			= require("awayjs-renderergl/lib/materials/methods/LightingMethodBase");
import ShadingMethodBase			= require("awayjs-renderergl/lib/materials/methods/ShadingMethodBase");
import ShaderCompilerHelper			= require("awayjs-renderergl/lib/materials/utils/ShaderCompilerHelper");

/**
 * SpecularBasicMethod provides the default shading method for Blinn-Phong specular highlights (an optimized but approximated
 * version of Phong specularity).
 */
class SpecularBasicMethod extends LightingMethodBase
{
	public _pUseTexture:boolean;
	public _pTotalLightColorReg:ShaderRegisterElement;
	public _pSpecularTextureRegister:ShaderRegisterElement;
	public _pSpecularTexData:ShaderRegisterElement;
	public _pSpecularDataRegister:ShaderRegisterElement;

	private _texture:Texture2DBase;

	private _gloss:number = 50;
	private _specular:number = 1;
	private _specularColor:number = 0xffffff;
	public _iSpecularR:number = 1;
	public _iSpecularG:number = 1;
	public _iSpecularB:number = 1;
	public _pIsFirstLight:boolean;

	/**
	 * Creates a new SpecularBasicMethod object.
	 */
	constructor()
	{
		super();
	}

	public iIsUsed(shaderObject:ShaderLightingObject):boolean
	{
		if (!shaderObject.numLights)
			return false;

		return true;
	}

	/**
	 * @inheritDoc
	 */
	public iInitVO(shaderObject:ShaderLightingObject, methodVO:MethodVO)
	{
		methodVO.needsUV = this._pUseTexture;
		methodVO.needsNormals = shaderObject.numLights > 0;
		methodVO.needsView = shaderObject.numLights > 0;
	}

	/**
	 * The sharpness of the specular highlight.
	 */
	public get gloss():number
	{
		return this._gloss;
	}

	public set gloss(value:number)
	{
		this._gloss = value;
	}

	/**
	 * The overall strength of the specular highlights.
	 */
	public get specular():number
	{
		return this._specular;
	}

	public set specular(value:number)
	{
		if (value == this._specular)
			return;

		this._specular = value;
		this.updateSpecular();
	}

	/**
	 * The colour of the specular reflection of the surface.
	 */
	public get specularColor():number
	{
		return this._specularColor;
	}

	public set specularColor(value:number)
	{
		if (this._specularColor == value)
			return;

		// specular is now either enabled or disabled
		if (this._specularColor == 0 || value == 0)
			this.iInvalidateShaderProgram();

		this._specularColor = value;
		this.updateSpecular();
	}

	/**
	 * The bitmapData that encodes the specular highlight strength per texel in the red channel, and the sharpness
	 * in the green channel. You can use SpecularBitmapTexture if you want to easily set specular and gloss maps
	 * from grayscale images, but prepared images are preferred.
	 */
	public get texture():Texture2DBase
	{
		return this._texture;
	}

	public set texture(value:Texture2DBase)
	{
		var b:boolean = ( value != null );

		if (b != this._pUseTexture || (value && this._texture && (value.hasMipmaps != this._texture.hasMipmaps || value.format != this._texture.format)))
			this.iInvalidateShaderProgram();

		this._pUseTexture = b;
		this._texture = value;

	}

	/**
	 * @inheritDoc
	 */
	public copyFrom(method:ShadingMethodBase)
	{

		var m:any = method;
		var bsm:SpecularBasicMethod = <SpecularBasicMethod> method;

		var spec:SpecularBasicMethod = bsm;//SpecularBasicMethod(method);
		this.texture = spec.texture;
		this.specular = spec.specular;
		this.specularColor = spec.specularColor;
		this.gloss = spec.gloss;
	}

	/**
	 * @inheritDoc
	 */
	public iCleanCompilationData()
	{
		super.iCleanCompilationData();
		this._pTotalLightColorReg = null;
		this._pSpecularTextureRegister = null;
		this._pSpecularTexData = null;
		this._pSpecularDataRegister = null;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPreLightingCode(shaderObject:ShaderLightingObject, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		this._pIsFirstLight = true;

		this._pSpecularDataRegister = registerCache.getFreeFragmentConstant();
		methodVO.fragmentConstantsIndex = this._pSpecularDataRegister.index*4;

		if (this._pUseTexture) {

			this._pSpecularTexData = registerCache.getFreeFragmentVectorTemp();
			registerCache.addFragmentTempUsages(this._pSpecularTexData, 1);
			this._pSpecularTextureRegister = registerCache.getFreeTextureReg();
			methodVO.texturesIndex = this._pSpecularTextureRegister.index;
			code = ShaderCompilerHelper.getTex2DSampleCode(this._pSpecularTexData, sharedRegisters, this._pSpecularTextureRegister, this._texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping);

		} else {

			this._pSpecularTextureRegister = null;
		}

		this._pTotalLightColorReg = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(this._pTotalLightColorReg, 1);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCodePerLight(shaderObject:ShaderLightingObject, methodVO:MethodVO, lightDirReg:ShaderRegisterElement, lightColReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var t:ShaderRegisterElement;

		if (this._pIsFirstLight) {
			t = this._pTotalLightColorReg;
		} else {
			t = registerCache.getFreeFragmentVectorTemp();
			registerCache.addFragmentTempUsages(t, 1);
		}

		var viewDirReg:ShaderRegisterElement = sharedRegisters.viewDirFragment;
		var normalReg:ShaderRegisterElement = sharedRegisters.normalFragment;

		// blinn-phong half vector model
		code += "add " + t + ", " + lightDirReg + ", " + viewDirReg + "\n" +
				"nrm " + t + ".xyz, " + t + "\n" +
				"dp3 " + t + ".w, " + normalReg + ", " + t + "\n" +
				"sat " + t + ".w, " + t + ".w\n";

		if (this._pUseTexture) {
			// apply gloss modulation from texture
			code += "mul " + this._pSpecularTexData + ".w, " + this._pSpecularTexData + ".y, " + this._pSpecularDataRegister + ".w\n" +
					"pow " + t + ".w, " + t + ".w, " + this._pSpecularTexData + ".w\n";
		} else {
			code += "pow " + t + ".w, " + t + ".w, " + this._pSpecularDataRegister + ".w\n";
		}

		// attenuate
		if (shaderObject.usesLightFallOff)
			code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";

		if (this._iModulateMethod != null)
			code += this._iModulateMethod(shaderObject, methodVO, t, registerCache, sharedRegisters);

		code += "mul " + t + ".xyz, " + lightColReg + ", " + t + ".w\n";

		if (!this._pIsFirstLight) {
			code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";
			registerCache.removeFragmentTempUsage(t);
		}

		this._pIsFirstLight = false;

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentCodePerProbe(shaderObject:ShaderLightingObject, methodVO:MethodVO, cubeMapReg:ShaderRegisterElement, weightRegister:string, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";
		var t:ShaderRegisterElement;

		// write in temporary if not first light, so we can add to total diffuse colour
		if (this._pIsFirstLight) {
			t = this._pTotalLightColorReg;
		} else {
			t = registerCache.getFreeFragmentVectorTemp();
			registerCache.addFragmentTempUsages(t, 1);
		}

		var normalReg:ShaderRegisterElement = sharedRegisters.normalFragment;
		var viewDirReg:ShaderRegisterElement = sharedRegisters.viewDirFragment;

		code += "dp3 " + t + ".w, " + normalReg + ", " + viewDirReg + "\n" +
				"add " + t + ".w, " + t + ".w, " + t + ".w\n" +
				"mul " + t + ", " + t + ".w, " + normalReg + "\n" +
				"sub " + t + ", " + t + ", " + viewDirReg + "\n" +
				"tex " + t + ", " + t + ", " + cubeMapReg + " <cube," + (shaderObject.useSmoothTextures? "linear":"nearest") + ",miplinear>\n" +
				"mul " + t + ".xyz, " + t + ", " + weightRegister + "\n";

		if (this._iModulateMethod != null)
			code += this._iModulateMethod(shaderObject, methodVO, t, registerCache, sharedRegisters);

		if (!this._pIsFirstLight) {
			code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";
			registerCache.removeFragmentTempUsage(t);
		}

		this._pIsFirstLight = false;

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPostLightingCode(shaderObject:ShaderLightingObject, methodVO:MethodVO, targetReg:ShaderRegisterElement, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		if (sharedRegisters.shadowTarget)
			code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + sharedRegisters.shadowTarget + ".w\n";

		if (this._pUseTexture) {
			// apply strength modulation from texture
			code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + this._pSpecularTexData + ".x\n";
			registerCache.removeFragmentTempUsage(this._pSpecularTexData);
		}

		// apply material's specular reflection
		code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + this._pSpecularDataRegister + "\n" +
			"add " + targetReg + ".xyz, " + targetReg + ", " + this._pTotalLightColorReg + "\n";
		registerCache.removeFragmentTempUsage(this._pTotalLightColorReg);

		return code;
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderLightingObject, methodVO:MethodVO, stage:Stage)
	{
		if (this._pUseTexture) {
			stage.context.setSamplerStateAt(methodVO.texturesIndex, shaderObject.repeatTextures? ContextGLWrapMode.REPEAT:ContextGLWrapMode.CLAMP, shaderObject.useSmoothTextures? ContextGLTextureFilter.LINEAR:ContextGLTextureFilter.NEAREST, shaderObject.useMipmapping? ContextGLMipFilter.MIPLINEAR:ContextGLMipFilter.MIPNONE);
			stage.activateTexture(methodVO.texturesIndex, this._texture);
		}

		var index:number = methodVO.fragmentConstantsIndex;
		var data:Array<number> = shaderObject.fragmentConstantData;
		data[index] = this._iSpecularR;
		data[index + 1] = this._iSpecularG;
		data[index + 2] = this._iSpecularB;
		data[index + 3] = this._gloss;
	}

	/**
	 * Updates the specular color data used by the render state.
	 */
	private updateSpecular()
	{
		this._iSpecularR = (( this._specularColor >> 16) & 0xff)/0xff*this._specular;
		this._iSpecularG = (( this._specularColor >> 8) & 0xff)/0xff*this._specular;
		this._iSpecularB = ( this._specularColor & 0xff)/0xff*this._specular;
	}
}

export = SpecularBasicMethod;