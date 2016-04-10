import ShaderRegisterElement		from "../shaders/ShaderRegisterElement";

/**
 * ShaderRegisterData contains the "named" registers, generated by the compiler and to be passed on to the methods.
 */
class ShaderRegisterData
{
	public uvVarying:ShaderRegisterElement;
	public secondaryUVVarying:ShaderRegisterElement;
	public shadowTarget:ShaderRegisterElement;
	public shadedTarget:ShaderRegisterElement;
	public globalPositionVertex:ShaderRegisterElement;
	public globalPositionVarying:ShaderRegisterElement;

	public animatedPosition:ShaderRegisterElement;
	public positionVarying:ShaderRegisterElement;

	public curvesInput:ShaderRegisterElement;
	public curvesVarying:ShaderRegisterElement;

	public normalInput:ShaderRegisterElement;
	public animatedNormal:ShaderRegisterElement;
	public normalVarying:ShaderRegisterElement;
	public normalFragment:ShaderRegisterElement;

	public tangentInput:ShaderRegisterElement;
	public animatedTangent:ShaderRegisterElement;
	public tangentVarying:ShaderRegisterElement;
	public bitangentVarying:ShaderRegisterElement;

	public colorInput:ShaderRegisterElement;
	public colorVarying:ShaderRegisterElement;

	public commons:ShaderRegisterElement;
	public projectionFragment:ShaderRegisterElement;

	public viewDirVarying:ShaderRegisterElement;
	public viewDirFragment:ShaderRegisterElement;
	public bitangent:ShaderRegisterElement;

	public textures:Array<ShaderRegisterElement> = Array<ShaderRegisterElement>();

	constructor()
	{

	}
}

export default ShaderRegisterData;