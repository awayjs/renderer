import Event						= require("awayjs-core/lib/events/Event");

class ShadingMethodEvent extends Event
{
	public static SHADER_INVALIDATED:string = "ShaderInvalidated";

	constructor(type:string)
	{

		super(type);

	}
}

export = ShadingMethodEvent;