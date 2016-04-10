import IEventDispatcher				from "awayjs-core/lib/events/IEventDispatcher";
import Matrix3D						from "awayjs-core/lib/geom/Matrix3D";

import Camera						from "awayjs-display/lib/display/Camera";
import TextureBase					from "awayjs-display/lib/textures/TextureBase";

import ShaderBase					from "../../shaders/ShaderBase";
import ShaderRegisterCache			from "../../shaders/ShaderRegisterCache";
import ShaderRegisterData			from "../../shaders/ShaderRegisterData";
import GL_RenderableBase			from "../../renderables/GL_RenderableBase";
import AnimationSetBase				from "../../animators/AnimationSetBase";

/**
 *
 * @class away.pool.Passes
 */
interface IPass extends IEventDispatcher
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


	_iActivate(camera:Camera);

	_iRender(renderable:GL_RenderableBase, camera:Camera, viewProjection:Matrix3D)

	_iDeactivate();

	invalidate();

	dispose();

	getImageIndex(texture:TextureBase, index?:number):number;
}

export default IPass;