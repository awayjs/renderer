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
		private _filters:Array<away.filters.Filter3DBase>;
		private _tasks:Array<away.filters.Filter3DTaskBase>;
		private _filterTasksInvalid:boolean;
		private _mainInputTexture:away.stagegl.ITexture;
		private _requireDepthRender:boolean;
		private _rttManager:away.managers.RTTBufferManager;
		private _stageGL:away.base.StageGL;
		private _filterSizesInvalid:boolean = true;
		private _onRTTResizeDelegate:Function;

		constructor(stageGL:away.base.StageGL)
		{
			this._onRTTResizeDelegate = away.utils.Delegate.create(this, this.onRTTResize);

			this._stageGL = stageGL;
			this._rttManager = away.managers.RTTBufferManager.getInstance(stageGL);
			this._rttManager.addEventListener(away.events.Event.RESIZE, this._onRTTResizeDelegate);

		}

		private onRTTResize(event:Event)
		{
			this._filterSizesInvalid = true;
		}

		public get requireDepthRender():boolean
		{
			return this._requireDepthRender;
		}

		public getMainInputTexture(stageGL:away.base.StageGL):away.stagegl.ITexture
		{
			if (this._filterTasksInvalid) {

				this.updateFilterTasks(stageGL);

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

		private updateFilterTasks(stageGL:away.base.StageGL)
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
				// filter.setRenderTargets(i == len? null : Filter3DBase(_filters[i + 1]).getMainInputTexture(stageGL), stageGL);

				filter.setRenderTargets(i == len? null : this._filters[i + 1].getMainInputTexture(stageGL), stageGL);

				this._tasks = this._tasks.concat(filter.tasks);

			}

			this._mainInputTexture = this._filters[0].getMainInputTexture(stageGL);

		}

		public render(stageGL:away.base.StageGL, camera:away.entities.Camera, depthTexture:away.stagegl.ITexture)
		{
			var len:number;
			var i:number;
			var task:away.filters.Filter3DTaskBase;
			var context:away.stagegl.IContext = stageGL.contextGL;

			var indexBuffer:away.stagegl.IIndexBuffer = this._rttManager.indexBuffer;

			var vertexBuffer:away.stagegl.IVertexBuffer = this._rttManager.renderToTextureVertexBuffer;

			if (!this._filters) {
				return;
			}

			if (this._filterSizesInvalid) {
				this.updateFilterSizes();
			}

			if (this._filterTasksInvalid) {
				this.updateFilterTasks(stageGL);
			}

			len = this._filters.length;

			for (i = 0; i < len; ++i) {
				this._filters[i].update(stageGL, camera);
			}

			len = this._tasks.length;

			if (len > 1) {
				context.setVertexBufferAt(0, vertexBuffer, 0, away.stagegl.ContextGLVertexBufferFormat.FLOAT_2);
				context.setVertexBufferAt(1, vertexBuffer, 2, away.stagegl.ContextGLVertexBufferFormat.FLOAT_2);
			}

			for (i = 0; i < len; ++i) {

				task = this._tasks[i];

				//stageGL.setRenderTarget(task.target); //TODO

				if (!task.target) {

					stageGL.scissorRect = null;
					vertexBuffer = this._rttManager.renderToScreenVertexBuffer;
					context.setVertexBufferAt(0, vertexBuffer, 0, away.stagegl.ContextGLVertexBufferFormat.FLOAT_2);
					context.setVertexBufferAt(1, vertexBuffer, 2, away.stagegl.ContextGLVertexBufferFormat.FLOAT_2);

				}

				context.setTextureAt(0, task.getMainInputTexture(stageGL));
				context.setProgram(task.getProgram(stageGL));
				context.clear(0.0, 0.0, 0.0, 0.0);

				task.activate(stageGL, camera, depthTexture);

				context.setBlendFactors(away.stagegl.ContextGLBlendFactor.ONE, away.stagegl.ContextGLBlendFactor.ZERO);
				context.drawTriangles(indexBuffer, 0, 2);

				task.deactivate(stageGL);
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
			this._rttManager.removeEventListener(away.events.Event.RESIZE, this._onRTTResizeDelegate);
			this._rttManager = null;
			this._stageGL = null;
		}
	}

}
