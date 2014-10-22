import ByteArray						= require("awayjs-core/lib/utils/ByteArray");

/**
 *
 */
class AWDBlock
{
	public id:number;
	public name:string;
	public data:any;
	public len:any;
	public geoID:number;
	public extras:Object;
	public bytes:ByteArray;
	public errorMessages:Array<string>;
	public uvsForVertexAnimation:Array<Array<number>>;

	constructor()
	{
	}

	public dispose()
	{

		this.id = null;
		this.bytes = null;
		this.errorMessages = null;
		this.uvsForVertexAnimation = null;

	}

	public addError(errorMsg:string):void
	{
		if (!this.errorMessages)
			this.errorMessages = new Array<string>();

		this.errorMessages.push(errorMsg);
	}
}

export = AWDBlock;