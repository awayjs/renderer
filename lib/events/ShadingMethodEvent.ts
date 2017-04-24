import {EventBase} from "@awayjs/core";

export class ShadingMethodEvent extends EventBase
{
	public static SHADER_INVALIDATED:string = "shaderInvalidated";

	constructor(type:string)
	{
		super(type);
	}
}