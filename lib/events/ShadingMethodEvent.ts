import {EventBase} from "@awayjs/core";

export class ShadingMethodEvent extends EventBase
{
	public static SHADER_INVALIDATED:string = "ShaderInvalidated";

	constructor(type:string)
	{
		super(type);
	}
}