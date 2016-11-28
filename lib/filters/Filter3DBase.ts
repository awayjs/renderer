import {Image2D} from "@awayjs/graphics";

import {Camera} from "@awayjs/scene";

import {Stage} from "@awayjs/stage";

import {RTTBufferManager} from "../managers/RTTBufferManager";

import {Filter3DTaskBase} from "./tasks/Filter3DTaskBase";

export class Filter3DBase
{
	private _tasks:Array<Filter3DTaskBase>;
	private _requireDepthRender:boolean;
	private _rttManager:RTTBufferManager;
	private _textureWidth:number;
	private _textureHeight:number;
	private _textureScale:number = 1;

	constructor()
	{
		this._tasks = new Array<Filter3DTaskBase>();
	}

	public get requireDepthRender():boolean
	{
		return this._requireDepthRender;
	}

	public addTask(filter:Filter3DTaskBase):void
	{
		this._tasks.push(filter);

		if (this._requireDepthRender == null)
			this._requireDepthRender = filter.requireDepthRender;
	}

	public get tasks():Filter3DTaskBase[]
	{
		return this._tasks;
	}

	public getMainInputTexture(stage:Stage):Image2D
	{
		return this._tasks[0].getMainInputTexture(stage);
	}

	public get textureWidth():number
	{
		return this._textureWidth;
	}

	public set textureWidth(value:number)
	{
		this._textureWidth = value;

		for (var i:number = 0; i < this._tasks.length; ++i)
			this._tasks[i].textureWidth = value;
	}


	public get rttManager():RTTBufferManager
	{
		return this._rttManager;
	}

	public set rttManager(value:RTTBufferManager)
	{
		this._rttManager = value;

		for (var i:number = 0; i < this._tasks.length; ++i)
			this._tasks[i].rttManager = value;
	}

	public get textureHeight():number
	{
		return this._textureHeight;
	}

	public set textureHeight(value:number)
	{
		this._textureHeight = value;

		for (var i:number = 0; i < this._tasks.length; ++i)
			this._tasks[i].textureHeight = value;
	}


	public get textureScale():number
	{
		return this._textureScale;
	}

	public set textureScale(value:number)
	{
		this._textureScale = value;

		for (var i:number = 0; i < this._tasks.length; ++i)
			this._tasks[i].textureScale = value;
	}

	// link up the filters correctly with the next filter
	public setRenderTargets(mainTarget:Image2D, stage:Stage):void
	{
		this._tasks[this._tasks.length - 1].target = mainTarget;
	}

	public dispose():void
	{
		for (var i:number = 0; i < this._tasks.length; ++i)
			this._tasks[i].dispose();
	}

	public update(stage:Stage, camera:Camera):void
	{

	}
}