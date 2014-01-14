///<reference path="../../_definitions.ts"/>

/**
 * @module away.render
 */
module away.render
{
	/**
	 * @class away.render.Filter3DRenderer
	 */
	export class Filter3DRenderer
	{
		private _filters:away.filters.Filter3DBase[]; // TODO: check / changed to strongly typed array
		private _tasks:away.filters.Filter3DTaskBase[];//Vector.<Filter3DTaskBase>;
		private _filterTasksInvalid:boolean;
		private _mainInputTexture:away.displayGL.Texture;
		private _requireDepthRender:boolean;
		private _rttManager:away.managers.RTTBufferManager;
		private _stageGLProxy:away.managers.StageGLProxy;
		private _filterSizesInvalid:boolean = true;

		constructor(stageGLProxy:away.managers.StageGLProxy)
		{

			this._stageGLProxy = stageGLProxy;
			this._rttManager = away.managers.RTTBufferManager.getInstance(stageGLProxy);
			this._rttManager.addEventListener(away.events.Event.RESIZE, this.onRTTResize, this);

		}

		private onRTTResize(event:Event)
		{
			this._filterSizesInvalid = true;
		}

		public get requireDepthRender():boolean
		{
			return this._requireDepthRender;
		}

		public getMainInputTexture(stageGLProxy:away.managers.StageGLProxy):away.displayGL.Texture
		{
			if (this._filterTasksInvalid) {

				this.updateFilterTasks(stageGLProxy);

			}

			return this._mainInputTexture;
		}

		public get filters():away.filters.Filter3DBase[]
		{
			return this._filters;
		}

		public set filters(value:away.filters.Filter3DBase[])
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

		private updateFilterTasks(stageGLProxy:away.managers.StageGLProxy)
		{
			var len:number;

			if (this._filterSizesInvalid) {

				this.updateFilterSizes();

			}

			if (!this._filters) {
				this._tasks = null;
				return;
			}

			this._tasks = new Array<away.filters.Filter3DTaskBase>();

			len = this._filters.length - 1;

			var filter:away.filters.Filter3DBase;

			for (var i:number = 0; i <= len; ++i) {

				// make sure all internal tasks are linked together
				filter = this._filters[i];

				// TODO: check logic
				// filter.setRenderTargets(i == len? null : Filter3DBase(_filters[i + 1]).getMainInputTexture(stageGLProxy), stageGLProxy);

				filter.setRenderTargets(i == len? null : this._filters[i + 1].getMainInputTexture(stageGLProxy), stageGLProxy);

				this._tasks = this._tasks.concat(filter.tasks);

			}

			this._mainInputTexture = this._filters[0].getMainInputTexture(stageGLProxy);

		}

		public render(stageGLProxy:away.managers.StageGLProxy, camera3D:away.cameras.Camera3D, depthTexture:away.displayGL.Texture)
		{
			var len:number;
			var i:number;
			var task:away.filters.Filter3DTaskBase;
			var context:away.displayGL.ContextGL = stageGLProxy._iContextGL;

			var indexBuffer:away.displayGL.IndexBuffer = this._rttManager.indexBuffer;

			var vertexBuffer:away.displayGL.VertexBuffer = this._rttManager.renderToTextureVertexBuffer;

			if (!this._filters) {
				return;
			}

			if (this._filterSizesInvalid) {
				this.updateFilterSizes();
			}

			if (this._filterTasksInvalid) {
				this.updateFilterTasks(stageGLProxy);
			}

			len = this._filters.length;

			for (i = 0; i < len; ++i) {
				this._filters[i].update(stageGLProxy, camera3D);
			}

			len = this._tasks.length;

			if (len > 1) {
				context.setVertexBufferAt(0, vertexBuffer, 0, away.displayGL.ContextGLVertexBufferFormat.FLOAT_2);
				context.setVertexBufferAt(1, vertexBuffer, 2, away.displayGL.ContextGLVertexBufferFormat.FLOAT_2);
			}

			for (i = 0; i < len; ++i) {

				task = this._tasks[i];

				stageGLProxy.setRenderTarget(task.target);

				if (!task.target) {

					stageGLProxy.scissorRect = null;
					vertexBuffer = this._rttManager.renderToScreenVertexBuffer;
					context.setVertexBufferAt(0, vertexBuffer, 0, away.displayGL.ContextGLVertexBufferFormat.FLOAT_2);
					context.setVertexBufferAt(1, vertexBuffer, 2, away.displayGL.ContextGLVertexBufferFormat.FLOAT_2);

				}

				context.setTextureAt(0, task.getMainInputTexture(stageGLProxy));
				context.setProgram(task.getProgram(stageGLProxy));
				context.clear(0.0, 0.0, 0.0, 0.0);

				task.activate(stageGLProxy, camera3D, depthTexture);

				context.setBlendFactors(away.displayGL.ContextGLBlendFactor.ONE, away.displayGL.ContextGLBlendFactor.ZERO);
				context.drawTriangles(indexBuffer, 0, 2);

				task.deactivate(stageGLProxy);
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
			this._rttManager.removeEventListener(away.events.Event.RESIZE, this.onRTTResize, this);
			this._rttManager = null;
			this._stageGLProxy = null;
		}
	}

}
