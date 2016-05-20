/**
 * A single register element (an entire register or a single register's component) used by the RegisterPool.
 */
export class ShaderRegisterElement
{
	private _regName:string;
	private _index:number;
	private _toStr:string;

	private static COMPONENTS = ["x", "y", "z", "w"];

	public _component:number;

	/**
	 * Creates a new ShaderRegisterElement object.
	 *
	 * @param regName The name of the register.
	 * @param index The index of the register.
	 * @param component The register's component, if not the entire register is represented.
	 */
	constructor(regName:string, index:number, component:number = -1)
	{
		this._component = component;
		this._regName = regName;
		this._index = index;

		this._toStr = this._regName;

		if (this._index >= 0)
			this._toStr += this._index;

		if (component > -1)
			this._toStr += "." + ShaderRegisterElement.COMPONENTS[component];
	}

	/**
	 * Converts the register or the components AGAL string representation.
	 */
	public toString():string
	{
		return this._toStr;
	}

	/**
	 * The register's name.
	 */
	public get regName():string
	{
		return this._regName;
	}

	/**
	 * The register's index.
	 */
	public get index():number
	{
		return this._index;
	}
}