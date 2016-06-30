import {Rectangle}					from "@awayjs/core/lib/geom/Rectangle";
import {EventDispatcher}				from "@awayjs/core/lib/events/EventDispatcher";
import {ImageUtils}					from "@awayjs/core/lib/utils/ImageUtils";

import {Stage}						from "@awayjs/stage/lib/base/Stage";
import {IContextGL}					from "@awayjs/stage/lib/base/IContextGL";
import {IIndexBuffer}					from "@awayjs/stage/lib/base/IIndexBuffer";
import {IVertexBuffer}				from "@awayjs/stage/lib/base/IVertexBuffer";
import {RTTEvent}						from "../events/RTTEvent";

export class RTTBufferManager extends EventDispatcher
{
	private static _instances:Array<RTTBufferManagerVO>;

	private _renderToTextureVertexBuffer:IVertexBuffer;
	private _renderToScreenVertexBuffer:IVertexBuffer;

	private _indexBuffer:IIndexBuffer;
	private _stage:Stage;
	private _viewWidth:number = -1;
	private _viewHeight:number = -1;
	private _textureWidth:number = -1;
	private _textureHeight:number = -1;
	private _renderToTextureRect:Rectangle;
	private _buffersInvalid:boolean = true;

	private _textureRatioX:number;
	private _textureRatioY:number;

	constructor(stage:Stage)
	{
		super();

		this._renderToTextureRect = new Rectangle();

		this._stage = stage;

	}

	public static getInstance(stage:Stage):RTTBufferManager
	{
		if (!stage)
			throw new Error("stage key cannot be null!");

		if (RTTBufferManager._instances == null)
			RTTBufferManager._instances = new Array<RTTBufferManagerVO>();

		var rttBufferManager:RTTBufferManager = RTTBufferManager.getRTTBufferManagerFromStage(stage);

		if (rttBufferManager == null) {
			rttBufferManager = new RTTBufferManager(stage);

			var vo:RTTBufferManagerVO = new RTTBufferManagerVO();

			vo.stage3d = stage;
			vo.rttbfm = rttBufferManager;

			RTTBufferManager._instances.push(vo);
		}

		return rttBufferManager;

	}

	private static getRTTBufferManagerFromStage(stage:Stage):RTTBufferManager
	{

		var l:number = RTTBufferManager._instances.length;
		var r:RTTBufferManagerVO;

		for (var c:number = 0; c < l; c++) {
			r = RTTBufferManager._instances[c];

			if (r.stage3d === stage)
				return r.rttbfm;
		}

		return null;
	}

	private static deleteRTTBufferManager(stage:Stage):void
	{
		var l:number = RTTBufferManager._instances.length;
		var r:RTTBufferManagerVO;

		for (var c:number = 0; c < l; c++) {
			r = RTTBufferManager._instances[c];

			if (r.stage3d === stage) {
				RTTBufferManager._instances.splice(c, 1);
				return;
			}
		}
	}

	public get textureRatioX():number
	{
		if (this._buffersInvalid)
			this.updateRTTBuffers();

		return this._textureRatioX;
	}

	public get textureRatioY():number
	{
		if (this._buffersInvalid)
			this.updateRTTBuffers();

		return this._textureRatioY;
	}

	public get viewWidth():number
	{
		return this._viewWidth;
	}

	public set viewWidth(value:number)
	{
		if (value == this._viewWidth)
			return;

		this._viewWidth = value;

		this._buffersInvalid = true;

		this._textureWidth = ImageUtils.getBestPowerOf2(this._viewWidth);

		if (this._textureWidth > this._viewWidth) {
			this._renderToTextureRect.x = Math.floor((this._textureWidth - this._viewWidth)*.5);
			this._renderToTextureRect.width = this._viewWidth;
		} else {
			this._renderToTextureRect.x = 0;
			this._renderToTextureRect.width = this._textureWidth;
		}

		this.dispatchEvent(new RTTEvent(RTTEvent.RESIZE, this));
	}

	public get viewHeight():number
	{
		return this._viewHeight;
	}

	public set viewHeight(value:number)
	{
		if (value == this._viewHeight)
			return;

		this._viewHeight = value;

		this._buffersInvalid = true;

		this._textureHeight = ImageUtils.getBestPowerOf2(this._viewHeight);

		if (this._textureHeight > this._viewHeight) {
			this._renderToTextureRect.y = Math.floor((this._textureHeight - this._viewHeight)*.5);
			this._renderToTextureRect.height = this._viewHeight;
		} else {
			this._renderToTextureRect.y = 0;
			this._renderToTextureRect.height = this._textureHeight;
		}

		this.dispatchEvent(new RTTEvent(RTTEvent.RESIZE, this));
	}

	public get renderToTextureVertexBuffer():IVertexBuffer
	{
		if (this._buffersInvalid)
			this.updateRTTBuffers();

		return this._renderToTextureVertexBuffer;
	}

	public get renderToScreenVertexBuffer():IVertexBuffer
	{
		if (this._buffersInvalid)
			this.updateRTTBuffers();

		return this._renderToScreenVertexBuffer;

	}

	public get indexBuffer():IIndexBuffer
	{
		return this._indexBuffer;
	}

	public get renderToTextureRect():Rectangle
	{
		if (this._buffersInvalid)
			this.updateRTTBuffers();

		return this._renderToTextureRect;
	}

	public get textureWidth():number
	{
		return this._textureWidth;
	}

	public get textureHeight():number
	{
		return this._textureHeight;
	}

	public dispose():void
	{
		RTTBufferManager.deleteRTTBufferManager(this._stage);

		if (this._indexBuffer) {
			this._indexBuffer.dispose();
			this._renderToScreenVertexBuffer.dispose();
			this._renderToTextureVertexBuffer.dispose();
			this._renderToScreenVertexBuffer = null;
			this._renderToTextureVertexBuffer = null;
			this._indexBuffer = null;
		}
	}

	// todo: place all this in a separate model, since it's used all over the place
	// maybe it even has a place in the core (together with screenRect etc)?
	// needs to be stored per view of course
	private updateRTTBuffers():void
	{
		var context:IContextGL = this._stage.context;
		var textureVerts:number[];
		var screenVerts:number[];

		var x:number;
		var y:number;

		if (this._renderToTextureVertexBuffer == null)
			this._renderToTextureVertexBuffer = context.createVertexBuffer(4, 20);

		if (this._renderToScreenVertexBuffer == null)
			this._renderToScreenVertexBuffer = context.createVertexBuffer(4, 20);

		if (!this._indexBuffer) {
			this._indexBuffer = context.createIndexBuffer(6);

			this._indexBuffer.uploadFromArray([2, 1, 0, 3, 2, 0], 0, 6);
		}

		this._textureRatioX = x = Math.min(this._viewWidth/this._textureWidth, 1);
		this._textureRatioY = y = Math.min(this._viewHeight/this._textureHeight, 1);

		var u1:number = (1 - x)*.5;
		var u2:number = (x + 1)*.5;
		var v1:number = (1 - y)*.5;
		var v2:number = (y + 1)*.5;

		// last element contains indices for data per vertex that can be passed to the vertex shader if necessary (ie: frustum corners for deferred rendering)
		textureVerts = [    -x, -y, u1, v1, 0, x, -y, u2, v1, 1, x, y, u2, v2, 2, -x, y, u1, v2, 3 ];

		screenVerts = [     -1, -1, u1, v1, 0, 1, -1, u2, v1, 1, 1, 1, u2, v2, 2, -1, 1, u1, v2, 3 ];

		this._renderToTextureVertexBuffer.uploadFromArray(textureVerts, 0, 4);
		this._renderToScreenVertexBuffer.uploadFromArray(screenVerts, 0, 4);

		this._buffersInvalid = false;
	}
}

class RTTBufferManagerVO
{
	public stage3d:Stage;

	public rttbfm:RTTBufferManager;
}