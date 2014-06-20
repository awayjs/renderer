///<reference path="../../_definitions.ts"/>

module away.materials
{
	import LightBase								= away.base.LightBase;
	import Stage									= away.base.Stage;
	import Camera									= away.entities.Camera;
	import DirectionalLight							= away.entities.DirectionalLight;
	import PointLight								= away.entities.PointLight;
	import AbstractMethodError						= away.errors.AbstractMethodError;
	import RenderableBase							= away.pool.RenderableBase;
	import IContextStageGL							= away.stagegl.IContextStageGL;
	import CubeTextureBase							= away.textures.CubeTextureBase;
	import Texture2DBase							= away.textures.Texture2DBase;

	/**
	 * ShadowMethodBase provides an abstract method for simple (non-wrapping) shadow map methods.
	 */
	export class ShadowMethodBase extends ShadowMapMethodBase
	{
		public _pDepthMapCoordReg:ShaderRegisterElement;
		public _pUsePoint:boolean;

		/**
		 * Creates a new ShadowMethodBase object.
		 * @param castingLight The light used to cast shadows.
		 */
		constructor(castingLight:LightBase)
		{
			this._pUsePoint = (castingLight instanceof PointLight);

			super(castingLight);
		}

		/**
		 * @inheritDoc
		 */
		public iInitVO(vo:MethodVO)
		{
			vo.needsView = true;
			vo.needsGlobalVertexPos = true;
			vo.needsGlobalFragmentPos = this._pUsePoint;
			vo.needsNormals = vo.numLights > 0;
		}

		/**
		 * @inheritDoc
		 */
		public iInitConstants(vo:MethodVO)
		{
			var fragmentData:Array<number> = vo.fragmentData;
			var vertexData:Array<number> = vo.vertexData;
			var index:number /*int*/ = vo.fragmentConstantsIndex;
			fragmentData[index] = 1.0;
			fragmentData[index + 1] = 1/255.0;
			fragmentData[index + 2] = 1/65025.0;
			fragmentData[index + 3] = 1/16581375.0;

			fragmentData[index + 6] = 0;
			fragmentData[index + 7] = 1;

			if (this._pUsePoint) {
				fragmentData[index + 8] = 0;
				fragmentData[index + 9] = 0;
				fragmentData[index + 10] = 0;
				fragmentData[index + 11] = 1;
			}

			index = vo.vertexConstantsIndex;
			if (index != -1) {
				vertexData[index] = .5;
				vertexData[index + 1] = .5;
				vertexData[index + 2] = 0.0;
				vertexData[index + 3] = 1.0;
			}
		}

		/**
		 * Wrappers that override the vertex shader need to set this explicitly
		 */
		public get _iDepthMapCoordReg():ShaderRegisterElement
		{
			return this._pDepthMapCoordReg;
		}

		public set _iDepthMapCoordReg(value:ShaderRegisterElement)
		{
			this._pDepthMapCoordReg = value;
		}

		/**
		 * @inheritDoc
		 */
		public iCleanCompilationData()
		{
			super.iCleanCompilationData();

			this._pDepthMapCoordReg = null;
		}

		/**
		 * @inheritDoc
		 */
		public iGetVertexCode(vo:MethodVO, regCache:ShaderRegisterCache):string
		{
			return this._pUsePoint? this._pGetPointVertexCode(vo, regCache):this.pGetPlanarVertexCode(vo, regCache);
		}

		/**
		 * Gets the vertex code for shadow mapping with a point light.
		 *
		 * @param vo The MethodVO object linking this method with the pass currently being compiled.
		 * @param regCache The register cache used during the compilation.
		 */
		public _pGetPointVertexCode(vo:MethodVO, regCache:ShaderRegisterCache):string
		{
			vo.vertexConstantsIndex = -1;
			return "";
		}

		/**
		 * Gets the vertex code for shadow mapping with a planar shadow map (fe: directional lights).
		 *
		 * @param vo The MethodVO object linking this method with the pass currently being compiled.
		 * @param regCache The register cache used during the compilation.
		 */
		public pGetPlanarVertexCode(vo:MethodVO, regCache:ShaderRegisterCache):string
		{
			var code:string = "";
			var temp:ShaderRegisterElement = regCache.getFreeVertexVectorTemp();
			var dataReg:ShaderRegisterElement = regCache.getFreeVertexConstant();
			var depthMapProj:ShaderRegisterElement = regCache.getFreeVertexConstant();
			regCache.getFreeVertexConstant();
			regCache.getFreeVertexConstant();
			regCache.getFreeVertexConstant();
			this._pDepthMapCoordReg = regCache.getFreeVarying();
			vo.vertexConstantsIndex = dataReg.index*4;

			// todo: can epsilon be applied here instead of fragment shader?

			code += "m44 " + temp + ", " + this._sharedRegisters.globalPositionVertex + ", " + depthMapProj + "\n" + "div " + temp + ", " + temp + ", " + temp + ".w\n" + "mul " + temp + ".xy, " + temp + ".xy, " + dataReg + ".xy\n" + "add " + this._pDepthMapCoordReg + ", " + temp + ", " + dataReg + ".xxwz\n";
			//"sub " + this._pDepthMapCoordReg + ".z, " + this._pDepthMapCoordReg + ".z, " + this._pDepthMapCoordReg + ".w\n";

			return code;
		}

		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			var code:string = this._pUsePoint? this._pGetPointFragmentCode(vo, regCache, targetReg):this._pGetPlanarFragmentCode(vo, regCache, targetReg);
			code += "add " + targetReg + ".w, " + targetReg + ".w, fc" + (vo.fragmentConstantsIndex/4 + 1) + ".y\n" + "sat " + targetReg + ".w, " + targetReg + ".w\n";
			return code;
		}

		/**
		 * Gets the fragment code for shadow mapping with a planar shadow map.
		 * @param vo The MethodVO object linking this method with the pass currently being compiled.
		 * @param regCache The register cache used during the compilation.
		 * @param targetReg The register to contain the shadow coverage
		 * @return
		 */
		public _pGetPlanarFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			throw new AbstractMethodError();
			return "";
		}

		/**
		 * Gets the fragment code for shadow mapping with a point light.
		 * @param vo The MethodVO object linking this method with the pass currently being compiled.
		 * @param regCache The register cache used during the compilation.
		 * @param targetReg The register to contain the shadow coverage
		 * @return
		 */
		public _pGetPointFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, targetReg:ShaderRegisterElement):string
		{
			throw new AbstractMethodError();
			return "";
		}

		/**
		 * @inheritDoc
		 */
		public iSetRenderState(vo:MethodVO, renderable:RenderableBase, stage:Stage, camera:Camera)
		{
			if (!this._pUsePoint)
				(<DirectionalShadowMapper> this._pShadowMapper).iDepthProjection.copyRawDataTo(vo.vertexData, vo.vertexConstantsIndex + 4, true);
		}

		/**
		 * Gets the fragment code for combining this method with a cascaded shadow map method.
		 * @param vo The MethodVO object linking this method with the pass currently being compiled.
		 * @param regCache The register cache used during the compilation.
		 * @param decodeRegister The register containing the data to decode the shadow map depth value.
		 * @param depthTexture The texture containing the shadow map.
		 * @param depthProjection The projection of the fragment relative to the light.
		 * @param targetRegister The register to contain the shadow coverage
		 * @return
		 */
		public _iGetCascadeFragmentCode(vo:MethodVO, regCache:ShaderRegisterCache, decodeRegister:ShaderRegisterElement, depthTexture:ShaderRegisterElement, depthProjection:ShaderRegisterElement, targetRegister:ShaderRegisterElement):string
		{
			throw new Error("This shadow method is incompatible with cascade shadows");
		}

		/**
		 * @inheritDoc
		 */
		public iActivate(vo:MethodVO, stage:Stage)
		{
			var fragmentData:Array<number> = vo.fragmentData;
			var index:number /*int*/ = vo.fragmentConstantsIndex;

			if (this._pUsePoint)
				fragmentData[index + 4] = -Math.pow(1/((<PointLight> this._pCastingLight).fallOff*this._pEpsilon), 2);
			else
				vo.vertexData[vo.vertexConstantsIndex + 3] = -1/((<DirectionalShadowMapper> this._pShadowMapper).depth*this._pEpsilon);

			fragmentData[index + 5] = 1 - this._pAlpha;

			if (this._pUsePoint) {
				var pos:away.geom.Vector3D = this._pCastingLight.scenePosition;
				fragmentData[index + 8] = pos.x;
				fragmentData[index + 9] = pos.y;
				fragmentData[index + 10] = pos.z;
				// used to decompress distance
				var f:number = (<PointLight> this._pCastingLight).fallOff;
				fragmentData[index + 11] = 1/(2*f*f);
			}

			if (this._pCastingLight.shadowMapper.depthMap instanceof Texture2DBase)
				(<IContextStageGL> stage.context).activateTexture(vo.texturesIndex, <Texture2DBase> this._pCastingLight.shadowMapper.depthMap);
			else if (this._pCastingLight.shadowMapper.depthMap instanceof CubeTextureBase)
				(<IContextStageGL> stage.context).activateCubeTexture(vo.texturesIndex, <CubeTextureBase> this._pCastingLight.shadowMapper.depthMap);
		}

		/**
		 * Sets the method state for cascade shadow mapping.
		 */
		public iActivateForCascade(vo:MethodVO, stage:Stage)
		{
			throw new Error("This shadow method is incompatible with cascade shadows");
		}
	}
}
