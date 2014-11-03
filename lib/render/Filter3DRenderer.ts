import Event						= require("awayjs-core/lib/events/Event");

import Camera						= require("awayjs-display/lib/entities/Camera");

import Stage						= require("awayjs-stagegl/lib/base/Stage");
import ContextGLBlendFactor			= require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
import ContextGLVertexBufferFormat	= require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
import IContextGL				= require("awayjs-stagegl/lib/base/IContextGL");
import IIndexBuffer					= require("awayjs-stagegl/lib/base/IIndexBuffer");
import ITexture						= require("awayjs-stagegl/lib/base/ITexture");
import IVertexBuffer				= require("awayjs-stagegl/lib/base/IVertexBuffer");

import RTTBufferManager				= require("awayjs-renderergl/lib/managers/RTTBufferManager");
import Filter3DBase					= require("awayjs-renderergl/lib/filters/Filter3DBase");
import Filter3DTaskBase				= require("awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase");

/**
 * @class away.render.Filter3DRenderer
 */
class Filter3DRenderer
{
	private _filters:Array<Filter3DBase>;
	private _tasks:Array<Filter3DTaskBase>;
	private _filterTasksInvalid:boolean;
	private _mainInputTexture:ITexture;
	private _requireDepthRender:boolean;
	private _rttManager:RTTBufferManager;
	private _stage:Stage;
	private _filterSizesInvalid:boolean = true;
	private _onRTTResizeDelegate:(event:Event) => void;

	constructor(stage:Stage)
	{
		this._onRTTResizeDelegate = (event:Event) => this.onRTTResize(event);

		this._stage = stage;
		this._rttManager = RTTBufferManager.getInstance(stage);
		this._rttManager.addEventListener(Event.RESIZE, this._onRTTResizeDelegate);

	}

	private onRTTResize(event:Event)
	{
		this._filterSizesInvalid = true;
	}

	public get requireDepthRender():boolean
	{
		return this._requireDepthRender;
	}

	public getMainInputTexture(stage:Stage):ITexture
	{
		if (this._filterTasksInvalid) {

			this.updateFilterTasks(stage);

		}

		return this._mainInputTexture;
	}

	public get filters():Filter3DBase[]
	{
		return this._filters;
	}

	public set filters(value:Filter3DBase[])
	{
		this._filters = value;

		this._filterTasksInvalid = true;

		this._requireDepthRender = false;

		if (!this._filters) {

			return;

		}

		for (var i:number = 0; i < this._filters.length; ++i) {

			// TODO: check logic:
			// this._requireDepthRender ||=  Boolean ( this._filters[i].requireDepthRender )

			var s:any = this._filters[i];
			var b:boolean = <boolean> ( s.requireDepthRender == null )? false : s.requireDepthRender;

			this._requireDepthRender = this._requireDepthRender || b;

		}

		this._filterSizesInvalid = true;

	}

	private updateFilterTasks(stage:Stage)
	{
		var len:number;

		if (this._filterSizesInvalid) {

			this.updateFilterSizes();

		}

		if (!this._filters) {
			this._tasks = null;
			return;
		}

		this._tasks = new Array<Filter3DTaskBase>();

		len = this._filters.length - 1;

		var filter:Filter3DBase;

		for (var i:number = 0; i <= len; ++i) {

			// make sure all internal tasks are linked together
			filter = this._filters[i];

			// TODO: check logic
			// filter.setRenderTargets(i == len? null : Filter3DBase(_filters[i + 1]).getMainInputTexture(stage), stage);

			filter.setRenderTargets(i == len? null : this._filters[i + 1].getMainInputTexture(stage), stage);

			this._tasks = this._tasks.concat(filter.tasks);

		}

		this._mainInputTexture = this._filters[0].getMainInputTexture(stage);

	}

	public render(stage:Stage, camera:Camera, depthTexture:ITexture)
	{
		var len:number;
		var i:number;
		var task:Filter3DTaskBase;
		var context:IContextGL = <IContextGL> stage.context;

		var indexBuffer:IIndexBuffer = this._rttManager.indexBuffer;

		var vertexBuffer:IVertexBuffer = this._rttManager.renderToTextureVertexBuffer;

		if (!this._filters) {
			return;
		}

		if (this._filterSizesInvalid) {
			this.updateFilterSizes();
		}

		if (this._filterTasksInvalid) {
			this.updateFilterTasks(stage);
		}

		len = this._filters.length;

		for (i = 0; i < len; ++i) {
			this._filters[i].update(stage, camera);
		}

		len = this._tasks.length;

		if (len > 1) {
			context.setVertexBufferAt(0, vertexBuffer, 0, ContextGLVertexBufferFormat.FLOAT_2);
			context.setVertexBufferAt(1, vertexBuffer, 2, ContextGLVertexBufferFormat.FLOAT_2);
		}

		for (i = 0; i < len; ++i) {

			task = this._tasks[i];

			//stage.setRenderTarget(task.target); //TODO

			if (!task.target) {

				stage.scissorRect = null;
				vertexBuffer = this._rttManager.renderToScreenVertexBuffer;
				context.setVertexBufferAt(0, vertexBuffer, 0, ContextGLVertexBufferFormat.FLOAT_2);
				context.setVertexBufferAt(1, vertexBuffer, 2, ContextGLVertexBufferFormat.FLOAT_2);

			}

			context.setTextureAt(0, task.getMainInputTexture(stage));
			context.setProgram(task.getProgram(stage));
			context.clear(0.0, 0.0, 0.0, 0.0);

			task.activate(stage, camera, depthTexture);

			context.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);
			context.drawTriangles(indexBuffer, 0, 2);

			task.deactivate(stage);
		}

		context.setTextureAt(0, null);
		context.setVertexBufferAt(0, null);
		context.setVertexBufferAt(1, null);
	}

	private updateFilterSizes()
	{
		for (var i:number = 0; i < this._filters.length; ++i) {
			this._filters[i].textureWidth = this._rttManager.textureWidth;
			this._filters[i].textureHeight = this._rttManager.textureHeight;
		}

		this._filterSizesInvalid = true;

	}

	public dispose()
	{
		this._rttManager.removeEventListener(Event.RESIZE, this._onRTTResizeDelegate);
		this._rttManager = null;
		this._stage = null;
	}
}

export = Filter3DRenderer;