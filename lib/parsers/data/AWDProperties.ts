class AWDProperties
{
	public set(key:number, value:any):void
	{
		this[ key.toString() ] = value;
	}

	public get(key:number, fallback:any):any
	{
		if (this.hasOwnProperty(key.toString())) {
			return this[key.toString()];
		} else {
			return fallback;
		}
	}
}

export = AWDProperties;