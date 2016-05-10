import EventBase					from "awayjs-core/lib/events/EventBase";

class ShadingMethodEvent extends EventBase
{
	public static SHADER_INVALIDATED:string = "ShaderInvalidated";

	constructor(type:string)
	{
		super(type);
	}
}

export default ShadingMethodEvent;