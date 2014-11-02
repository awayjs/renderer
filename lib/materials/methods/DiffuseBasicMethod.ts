import Texture2DBase				= require("awayjs-core/lib/textures/Texture2DBase");

import Camera						= require("awayjs-display/lib/entities/Camera");

import Stage						= require("awayjs-stagegl/lib/base/Stage");
import ContextGLMipFilter			= require("awayjs-stagegl/lib/base/ContextGLMipFilter");
import ContextGLTextureFilter		= require("awayjs-stagegl/lib/base/ContextGLTextureFilter");
import ContextGLWrapMode			= require("awayjs-stagegl/lib/base/ContextGLWrapMode");

import MethodVO						= require("awayjs-renderergl/lib/materials/compilation/MethodVO");
import ShaderLightingObject			= require("awayjs-renderergl/lib/materials/compilation/ShaderLightingObject");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/materials/compilation/ShaderRegisterElement");
import ShadingMethodBase			= require("awayjs-renderergl/lib/materials/methods/ShadingMethodBase");
import LightingMethodBase			= require("awayjs-renderergl/lib/materials/methods/LightingMethodBase");
import ShaderCompilerHelper			= require("awayjs-renderergl/lib/materials/utils/ShaderCompilerHelper");
import RenderableBase				= require("awayjs-renderergl/lib/pool/RenderableBase");

/**
 * DiffuseBasicMethod provides the default shading method for Lambert (dot3) diffuse lighting.
 */
class DiffuseBasicMethod extends LightingMethodBase
{
	private _multiply:boolean = true;

	public _pUseTexture:boolean;
	public _pTotalLightColorReg:ShaderRegisterElement;
	public _pDiffuseInputRegister:ShaderRegisterElement;

	private _texture:Texture2DBase;
	private _diffuseColor:number = 0xffffff;
	private _ambientColor:number = 0xffffff;
	private _diffuseR:number = 1;
	private _diffuseG:number = 1;
	private _diffuseB:number = 1;
	private _ambientR:number = 1;
	private _ambientG:number = 1;
	private _ambientB:number = 1;

	public _pIsFirstLight:boolean;

	/**
	 * Creates a new DiffuseBasicMethod object.
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
	 * Set internally if diffuse color component multiplies or replaces the ambient color
	 */
	public get multiply():boolean
	{
		return this._multiply;
	}

	public set multiply(value:boolean)
	{
		if (this._multiply == value)
			return;

		this._multiply = value;

		this.iInvalidateShaderProgram();
	}

	public iInitVO(shaderObject:ShaderLightingObject, methodVO:MethodVO)
	{
		methodVO.needsUV = this._pUseTexture;
		methodVO.needsNormals = shaderObject.numLights > 0;
	}

	/**
	 * Forces the creation of the texture.
	 * @param stage The Stage used by the renderer
	 */
	public generateMip(stage:Stage)
	{
		if (this._pUseTexture)
			stage.context.activateTexture(0, this._texture);
	}

	/**
	 * The color of the diffuse reflection when not using a texture.
	 */
	public get diffuseColor():number
	{
		return this._diffuseColor;
	}

	public set diffuseColor(value:number)
	{
		if (this._diffuseColor == value)
			return;

		this._diffuseColor = value;

		this.updateDiffuse();
	}

	/**
	 * The color of the ambient reflection
	 */
	public get ambientColor():number
	{
		return this._ambientColor;
	}

	public set ambientColor(value:number)
	{
		if (this._ambientColor == value)
			return;

		this._ambientColor = value;

		this.updateAmbient();
	}


	/**
	 * The bitmapData to use to define the diffuse reflection color per texel.
	 */
	public get texture():Texture2DBase
	{
		return this._texture;
	}

	public set texture(value:Texture2DBase)
	{
		var b:boolean = (value != null);

		if (b != this._pUseTexture || (value && this._texture && (value.hasMipmaps != this._texture.hasMipmaps || value.format != this._texture.format)))
			this.iInvalidateShaderProgram();

		this._pUseTexture = b;
		this._texture = value;
	}

	/**
	 * @inheritDoc
	 */
	public dispose()
	{
		this._texture = null;
	}

	/**
	 * @inheritDoc
	 */
	public copyFrom(method:ShadingMethodBase)
	{
		var diff:DiffuseBasicMethod = <DiffuseBasicMethod> method;

		this.texture = diff.texture;
		this.multiply = diff.multiply;
		this.diffuseColor = diff.diffuseColor;
		this.ambientColor = diff.ambientColor;
	}

	/**
	 * @inheritDoc
	 */
	public iCleanCompilationData()
	{
		super.iCleanCompilationData();

		this._pTotalLightColorReg = null;
		this._pDiffuseInputRegister = null;
	}

	/**
	 * @inheritDoc
	 */
	public iGetFragmentPreLightingCode(shaderObject:ShaderLightingObject, methodVO:MethodVO, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		var code:string = "";

		this._pIsFirstLight = true;

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

		// write in temporary if not first light, so we can add to total diffuse colour
		if (this._pIsFirstLight) {
			t = this._pTotalLightColorReg;
		} else {
			t = registerCache.getFreeFragmentVectorTemp();
			registerCache.addFragmentTempUsages(t, 1);
		}

		code += "dp3 " + t + ".x, " + lightDirReg + ", " + sharedRegisters.normalFragment + "\n" +
				"max " + t + ".w, " + t + ".x, " + sharedRegisters.commons + ".y\n";

		if (shaderObject.usesLightFallOff)
			code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";

		if (this._iModulateMethod != null)
			code += this._iModulateMethod(shaderObject, methodVO, t, registerCache, sharedRegisters);

		code += "mul " + t + ", " + t + ".w, " + lightColReg + "\n";

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

		code += "tex " + t + ", " + sharedRegisters.normalFragment + ", " + cubeMapReg + " <cube,linear,miplinear>\n" +
				"mul " + t + ".xyz, " + t + ".xyz, " + weightRegister + "\n";

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

		var albedo:ShaderRegisterElement;
		var cutOffReg:ShaderRegisterElement;

		// incorporate input from ambient
		if (sharedRegisters.shadowTarget)
			code += this.pApplyShadow(shaderObject, methodVO, registerCache, sharedRegisters);

		albedo = registerCache.getFreeFragmentVectorTemp();
		registerCache.addFragmentTempUsages(albedo, 1);

		var ambientColorRegister:ShaderRegisterElement = registerCache.getFreeFragmentConstant();
		methodVO.fragmentConstantsIndex = ambientColorRegister.index*4;

		if (this._pUseTexture) {
			this._pDiffuseInputRegister = registerCache.getFreeTextureReg();

			methodVO.texturesIndex = this._pDiffuseInputRegister.index;

			code += ShaderCompilerHelper.getTex2DSampleCode(albedo, sharedRegisters, this._pDiffuseInputRegister, this._texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping);

		} else {
			this._pDiffuseInputRegister = registerCache.getFreeFragmentConstant();

			code += "mov " + albedo + ", " + this._pDiffuseInputRegister + "\n";
		}

		code += "sat " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + "\n" +
			"mul " + albedo + ".xyz, " + albedo + ", " + this._pTotalLightColorReg + "\n";

		if (this._multiply) {
			code += "add " + albedo + ".xyz, " + albedo + ", " + ambientColorRegister + "\n" +
				"mul " + targetReg + ".xyz, " + targetReg + ", " + albedo + "\n";
		} else {
			code += "mul " + targetReg + ".xyz, " + targetReg + ", " + ambientColorRegister + "\n" +
				"mul " + this._pTotalLightColorReg + ".xyz, " + targetReg + ", " + this._pTotalLightColorReg + "\n" +
				"sub " + targetReg + ".xyz, " + targetReg + ", " + this._pTotalLightColorReg + "\n" +
				"add " + targetReg + ".xyz, " + targetReg + ", " + albedo + "\n";
		}

		registerCache.removeFragmentTempUsage(this._pTotalLightColorReg);
		registerCache.removeFragmentTempUsage(albedo);

		return code;
	}

	/**
	 * Generate the code that applies the calculated shadow to the diffuse light
	 * @param methodVO The MethodVO object for which the compilation is currently happening.
	 * @param regCache The register cache the compiler is currently using for the register management.
	 */
	public pApplyShadow(shaderObject:ShaderLightingObject, methodVO:MethodVO, regCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + sharedRegisters.shadowTarget + ".w\n";
	}

	/**
	 * @inheritDoc
	 */
	public iActivate(shaderObject:ShaderLightingObject, methodVO:MethodVO, stage:Stage)
	{
		if (this._pUseTexture) {
			stage.context.setSamplerStateAt(methodVO.texturesIndex, shaderObject.repeatTextures? ContextGLWrapMode.REPEAT:ContextGLWrapMode.CLAMP, shaderObject.useSmoothTextures? ContextGLTextureFilter.LINEAR : ContextGLTextureFilter.NEAREST, shaderObject.useMipmapping? ContextGLMipFilter.MIPLINEAR : ContextGLMipFilter.MIPNONE);
			stage.context.activateTexture(methodVO.texturesIndex, this._texture);
		} else {
			var index:number = methodVO.fragmentConstantsIndex;
			var data:Array<number> = shaderObject.fragmentConstantData;
			data[index + 4] = this._diffuseR;
			data[index + 5] = this._diffuseG;
			data[index + 6] = this._diffuseB;
			data[index + 7] = 1;
		}
	}

	/**
	 * Updates the diffuse color data used by the render state.
	 */
	private updateDiffuse()
	{
		this._diffuseR = ((this._diffuseColor >> 16) & 0xff)/0xff;
		this._diffuseG = ((this._diffuseColor >> 8) & 0xff)/0xff;
		this._diffuseB = (this._diffuseColor & 0xff)/0xff;
	}

	/**
	 * Updates the ambient color data used by the render state.
	 */
	private updateAmbient()
	{
		this._ambientR = ((this._ambientColor >> 16) & 0xff)/0xff;
		this._ambientG = ((this._ambientColor >> 8) & 0xff)/0xff;
		this._ambientB = (this._ambientColor & 0xff)/0xff;
	}

	/**
	 * @inheritDoc
	 */
	public iSetRenderState(shaderObject:ShaderLightingObject, methodVO:MethodVO, renderable:RenderableBase, stage:Stage, camera:Camera)
	{
		//TODO move this to Activate (ambientR/G/B currently calc'd in render state)
		if (shaderObject.numLights > 0) {
			var index:number = methodVO.fragmentConstantsIndex;
			var data:Array<number> = shaderObject.fragmentConstantData;
			data[index] = shaderObject.ambientR*this._ambientR;
			data[index + 1] = shaderObject.ambientG*this._ambientG;
			data[index + 2] = shaderObject.ambientB*this._ambientB;
			data[index + 3] = 1;
		}
	}
}

export = DiffuseBasicMethod;