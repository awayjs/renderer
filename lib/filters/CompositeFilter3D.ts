import {Image2D}						from "@awayjs/core/lib/image/Image2D";

import {Stage}						from "@awayjs/stage/lib/base/Stage";

import {Filter3DCompositeTask}		from "../filters/tasks/Filter3DCompositeTask";
import {Filter3DBase}					from "../filters/Filter3DBase";

export class CompositeFilter3D extends Filter3DBase
{
	private _compositeTask:Filter3DCompositeTask;
	
	/**
	 * Creates a new CompositeFilter3D object
	 * @param blurX The amount of horizontal blur to apply
	 * @param blurY The amount of vertical blur to apply
	 * @param stepSize The distance between samples. Set to -1 to autodetect with acceptable quality.
	 */
	constructor(blendMode:string, exposure:number = 1)
	{
		super();

		this._compositeTask = new Filter3DCompositeTask(blendMode, exposure);

		this.addTask(this._compositeTask);
	}
	
	public get exposure():number
	{
		return this._compositeTask.exposure;
	}
	
	public set exposure(value:number)
	{
		this._compositeTask.exposure = value;
	}


	public get overlayTexture():Image2D
	{
		return this._compositeTask.overlayTexture;
	}

	public set overlayTexture(value:Image2D)
	{
		this._compositeTask.overlayTexture = value;
	}
}