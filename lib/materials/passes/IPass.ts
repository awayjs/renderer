import {IEventDispatcher, Matrix3D, ProjectionBase} from "@awayjs/core";

import {TextureBase} from "@awayjs/graphics";

import {GL_RenderableBase} from "../../renderables/GL_RenderableBase";
import {AnimationSetBase} from "../../animators/AnimationSetBase";
import {ShaderBase} from "../../shaders/ShaderBase";
import {ShaderRegisterCache} from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterData} from "../../shaders/ShaderRegisterData";

/**
 *
 * @class away.pool.Passes
 */
export interface IPass extends IEventDispatcher
{
	shader:ShaderBase;

	animationSet:AnimationSetBase;
	
	_iIncludeDependencies(shader:ShaderBase);

	_iInitConstantData(shader:ShaderBase);

	_iGetPreLightingVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetPreLightingFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetNormalVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;

	_iGetNormalFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string;


	/**
	 * Sets the material state for the pass that is independent of the rendered object. This needs to be called before
	 * calling pass. Before activating a pass, the previously used pass needs to be deactivated.
	 * @param stage The Stage object which is currently used for rendering.
	 * @param camera The camera from which the scene is viewed.
	 * @private
	 */
	_iActivate(projection:ProjectionBase);

	_setRenderState(renderable:GL_RenderableBase, projection:ProjectionBase)

	/**
	 * Clears the surface state for the pass. This needs to be called before activating another pass.
	 * @param stage The Stage used for rendering
	 *
	 * @private
	 */
	_iDeactivate();

	invalidate();

	dispose();

	getImageIndex(texture:TextureBase, index?:number):number;
}