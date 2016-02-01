import Image2D						= require("awayjs-core/lib/image/Image2D");

import Stage						= require("awayjs-stagegl/lib/base/Stage");

import Filter3DFXAATask				= require("awayjs-renderergl/lib/filters/tasks/Filter3DFXAATask");
import Filter3DBase					= require("awayjs-renderergl/lib/filters/Filter3DBase");

class FXAAFilter3D extends Filter3DBase
{
	private _fxaaTask:Filter3DFXAATask;
	
	/**
	 * Creates a new FXAAFilter3D object
	 * @param amount
	 * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
	 */
	constructor(amount:number, stepSize:number = -1)
	{
		super();

		this._fxaaTask = new Filter3DFXAATask(amount, stepSize);

		this.addTask(this._fxaaTask);
	}
	
	public get amount():number
	{
		return this._fxaaTask.amount;
	}
	
	public set amount(value:number)
	{
		this._fxaaTask.amount = value;
	}


	public get stepSize():number
	{
		return this._fxaaTask.stepSize;
	}

	public set stepSize(value:number)
	{
		this._fxaaTask.stepSize = value;
	}
}

export = FXAAFilter3D;