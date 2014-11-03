import Debug							= require("awayjs-core/lib/utils/Debug");
import BitmapData						= require("awayjs-core/lib/base/BitmapData");
import Box								= require("awayjs-core/lib/geom/Box");
import Matrix3D							= require("awayjs-core/lib/geom/Matrix3D");
import Matrix3DUtils					= require("awayjs-core/lib/geom/Matrix3DUtils");
import Point							= require("awayjs-core/lib/geom/Point");
import Rectangle						= require("awayjs-core/lib/geom/Rectangle");
import Vector3D							= require("awayjs-core/lib/geom/Vector3D");
import ByteArray						= require("awayjs-core/lib/utils/ByteArray");

import TriangleSubGeometry				= require("awayjs-display/lib/base/TriangleSubGeometry");
import Scene							= require("awayjs-display/lib/containers/Scene");
import View								= require("awayjs-display/lib/containers/View");
import IPicker							= require("awayjs-display/lib/pick/IPicker");
import PickingCollisionVO				= require("awayjs-display/lib/pick/PickingCollisionVO");
import EntityCollector					= require("awayjs-display/lib/traverse/EntityCollector");
import Camera							= require("awayjs-display/lib/entities/Camera");
import IEntity							= require("awayjs-display/lib/entities/IEntity");
import MaterialBase						= require("awayjs-display/lib/materials/MaterialBase");

import AGALMiniAssembler				= require("awayjs-stagegl/lib/aglsl/assembler/AGALMiniAssembler");
import Stage							= require("awayjs-stagegl/lib/base/Stage");
import ContextGLBlendFactor				= require("awayjs-stagegl/lib/base/ContextGLBlendFactor");
import ContextGLClearMask				= require("awayjs-stagegl/lib/base/ContextGLClearMask");
import ContextGLCompareMode				= require("awayjs-stagegl/lib/base/ContextGLCompareMode");
import ContextGLProgramType				= require("awayjs-stagegl/lib/base/ContextGLProgramType");
import ContextGLTriangleFace			= require("awayjs-stagegl/lib/base/ContextGLTriangleFace");
import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import IProgram							= require("awayjs-stagegl/lib/base/IProgram");
import ITextureBase						= require("awayjs-stagegl/lib/base/ITextureBase");

import RenderableBase					= require("awayjs-renderergl/lib/pool/RenderableBase");
import DefaultRenderer					= require("awayjs-renderergl/lib/render/DefaultRenderer");

/**
 * Picks a 3d object from a view or scene by performing a separate render pass on the scene around the area being picked using key color values,
 * then reading back the color value of the pixel in the render representing the picking ray. Requires multiple passes and readbacks for retriving details
 * on an entity that has its shaderPickingDetails property set to true.
 *
 * A read-back operation from any GPU is not a very efficient process, and the amount of processing used can vary significantly between different hardware.
 *
 * @see away.entities.Entity#shaderPickingDetails
 *
 * @class away.pick.ShaderPicker
 */
class ShaderPicker implements IPicker
{
	private _opaqueRenderableHead:RenderableBase;
	private _blendedRenderableHead:RenderableBase;

	private _stage:Stage;
	private _context:IContextGL;
	private _onlyMouseEnabled:boolean = true;

	private _objectProgram:IProgram;
	private _triangleProgram:IProgram;
	private _bitmapData:BitmapData;
	private _viewportData:Array<number>;
	private _boundOffsetScale:Array<number>;
	private _id:Array<number>;

	private _interactives:Array<RenderableBase> = new Array<RenderableBase>();
	private _interactiveId:number;
	private _hitColor:number;
	private _projX:number;
	private _projY:number;

	private _hitRenderable:RenderableBase;
	private _hitEntity:IEntity;
	private _localHitPosition:Vector3D = new Vector3D();
	private _hitUV:Point = new Point();
	private _faceIndex:number;
	private _subGeometryIndex:number;

	private _localHitNormal:Vector3D = new Vector3D();

	private _rayPos:Vector3D = new Vector3D();
	private _rayDir:Vector3D = new Vector3D();
	private _potentialFound:boolean;
	private static MOUSE_SCISSOR_RECT:Rectangle = new Rectangle(0, 0, 1, 1);

	private _shaderPickingDetails:boolean;

	/**
	 * @inheritDoc
	 */
	public get onlyMouseEnabled():boolean
	{
		return this._onlyMouseEnabled;
	}

	public set onlyMouseEnabled(value:boolean)
	{
		this._onlyMouseEnabled = value;
	}

	/**
	 * Creates a new <code>ShaderPicker</code> object.
	 *
	 * @param shaderPickingDetails Determines whether the picker includes a second pass to calculate extra
	 * properties such as uv and normal coordinates.
	 */
	constructor(shaderPickingDetails:boolean = false)
	{
		this._shaderPickingDetails = shaderPickingDetails;

		this._id = new Array<number>(4);
		this._viewportData = new Array<number>(4); // first 2 contain scale, last 2 translation
		this._boundOffsetScale = new Array<number>(8); // first 2 contain scale, last 2 translation
		this._boundOffsetScale[3] = 0;
		this._boundOffsetScale[7] = 1;
	}

	/**
	 * @inheritDoc
	 */
	public getViewCollision(x:number, y:number, view:View):PickingCollisionVO
	{
		var collector:EntityCollector = <EntityCollector> view.iEntityCollector;

		this._stage = (<DefaultRenderer> view.renderer).stage;

		if (!this._stage)
			return null;

		this._context = <IContextGL> this._stage.context;

		this._viewportData[0] = view.width;
		this._viewportData[1] = view.height;
		this._viewportData[2] = -(this._projX = 2*x/view.width - 1);
		this._viewportData[3] = this._projY = 2*y/view.height - 1;

		// _potentialFound will be set to true if any object is actually rendered
		this._potentialFound = false;

		//reset head values
		this._blendedRenderableHead = null;
		this._opaqueRenderableHead = null;

		this.pDraw(collector, null);

		// clear buffers
		this._context.setVertexBufferAt(0, null);

		if (!this._context || !this._potentialFound)
			return null;

		if (!this._bitmapData)
			this._bitmapData = new BitmapData(1, 1, false, 0);

		this._context.drawToBitmapData(this._bitmapData);
		this._hitColor = this._bitmapData.getPixel(0, 0);

		if (!this._hitColor) {
			this._context.present();
			return null;
		}

		this._hitRenderable = this._interactives[this._hitColor - 1];
		this._hitEntity = this._hitRenderable.sourceEntity;

		if (this._onlyMouseEnabled && !this._hitEntity._iIsMouseEnabled())
			return null;

		var _collisionVO:PickingCollisionVO = this._hitEntity._iPickingCollisionVO;
		if (this._shaderPickingDetails) {
			this.getHitDetails(view.camera);
			_collisionVO.localPosition = this._localHitPosition;
			_collisionVO.localNormal = this._localHitNormal;
			_collisionVO.uv = this._hitUV;
			_collisionVO.index = this._faceIndex;
			//_collisionVO.subGeometryIndex = this._subGeometryIndex;

		} else {
			_collisionVO.localPosition = null;
			_collisionVO.localNormal = null;
			_collisionVO.uv = null;
			_collisionVO.index = 0;
			//_collisionVO.subGeometryIndex = 0;
		}

		return _collisionVO;
	}

	//*/
	/**
	 * @inheritDoc
	 */
	public getSceneCollision(position:Vector3D, direction:Vector3D, scene:Scene):PickingCollisionVO
	{
		return null;
	}

	/**
	 * @inheritDoc
	 */
	public pDraw(entityCollector:EntityCollector, target:ITextureBase)
	{

		var camera:Camera = entityCollector.camera;

		this._context.clear(0, 0, 0, 1);
		this._stage.scissorRect = ShaderPicker.MOUSE_SCISSOR_RECT;

		this._interactives.length = this._interactiveId = 0;

		if (!this._objectProgram)
			this.initObjectProgram();

		this._context.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);
		this._context.setDepthTest(true, ContextGLCompareMode.LESS);
		this._context.setProgram(this._objectProgram);
		this._context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 4, this._viewportData, 1);
		//this.drawRenderables(entityCollector.opaqueRenderableHead, camera);
		//this.drawRenderables(entityCollector.blendedRenderableHead, camera);
		//TODO: reimplement ShaderPicker inheriting from RendererBase
	}

	/**
	 * Draw a list of renderables.
	 * @param renderables The renderables to draw.
	 * @param camera The camera for which to render.
	 */
	private drawRenderables(renderable:RenderableBase, camera:Camera)
	{
		var matrix:Matrix3D = Matrix3DUtils.CALCULATION_MATRIX;
		var viewProjection:Matrix3D = camera.viewProjection;

		while (renderable) {
			// it's possible that the renderable was already removed from the scene
			if (!renderable.sourceEntity.scene || !renderable.sourceEntity._iIsMouseEnabled()) {
				renderable = renderable.next;
				continue;
			}

			this._potentialFound = true;

			this._context.setCulling((<MaterialBase> renderable.materialOwner.material).bothSides? ContextGLTriangleFace.NONE : ContextGLTriangleFace.BACK, camera.projection.coordinateSystem);

			this._interactives[this._interactiveId++] = renderable;
			// color code so that reading from bitmapdata will contain the correct value
			this._id[1] = (this._interactiveId >> 8)/255; // on green channel
			this._id[2] = (this._interactiveId & 0xff)/255; // on blue channel

			matrix.copyFrom(renderable.sourceEntity.getRenderSceneTransform(camera));
			matrix.append(viewProjection);
			this._context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, matrix, true);
			this._context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, this._id, 1);
			this._context.activateBuffer(0, renderable.getVertexData(TriangleSubGeometry.POSITION_DATA), renderable.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);
			this._context.drawTriangles(this._context.getIndexBuffer(renderable.getIndexData()), 0, renderable.numTriangles);

			renderable = renderable.next;
		}

	}

	private updateRay(camera:Camera)
	{
		this._rayPos = camera.scenePosition;

		this._rayDir = camera.getRay(this._projX, this._projY, 1);
		this._rayDir.normalize();
	}

	/**
	 * Creates the Program that color-codes objects.
	 */
	private initObjectProgram()
	{
		var vertexCode:string;
		var fragmentCode:string;

		this._objectProgram = this._context.createProgram();

		vertexCode = "m44 vt0, va0, vc0			\n" + "mul vt1.xy, vt0.w, vc4.zw	\n" + "add vt0.xy, vt0.xy, vt1.xy	\n" + "mul vt0.xy, vt0.xy, vc4.xy	\n" + "mov op, vt0	\n";
		fragmentCode = "mov oc, fc0"; // write identifier

		Debug.throwPIR('ShaderPicker', 'initTriangleProgram', 'Dependency: initObjectProgram')
		//_objectProgram.upload(new AGALMiniAssembler().assemble(ContextGLProgramType.VERTEX, vertexCode),new AGALMiniAssembler().assemble(ContextGLProgramType.FRAGMENT, fragmentCode));
	}

	/**
	 * Creates the Program that renders positions.
	 */

	private initTriangleProgram()
	{
		var vertexCode:string;
		var fragmentCode:string;

		this._triangleProgram = this._context.createProgram();

		// todo: add animation code
		vertexCode = "add vt0, va0, vc5 			\n" + "mul vt0, vt0, vc6 			\n" + "mov v0, vt0				\n" + "m44 vt0, va0, vc0			\n" + "mul vt1.xy, vt0.w, vc4.zw	\n" + "add vt0.xy, vt0.xy, vt1.xy	\n" + "mul vt0.xy, vt0.xy, vc4.xy	\n" + "mov op, vt0	\n";
		fragmentCode = "mov oc, v0"; // write identifier

		var vertexByteCode:ByteArray = (new AGALMiniAssembler().assemble("part vertex 1\n" + vertexCode + "endpart"))['vertex'].data;
		var fragmentByteCode:ByteArray = (new AGALMiniAssembler().assemble("part fragment 1\n" + fragmentCode + "endpart"))['fragment'].data;
		this._triangleProgram.upload(vertexByteCode, fragmentByteCode);
	}

	/**
	 * Gets more detailed information about the hir position, if required.
	 * @param camera The camera used to view the hit object.
	 */
	private getHitDetails(camera:Camera)
	{
		this.getApproximatePosition(camera);
		this.getPreciseDetails(camera);
	}

	/**
	 * Finds a first-guess approximate position about the hit position.
	 *
	 * @param camera The camera used to view the hit object.
	 */
	private getApproximatePosition(camera:Camera)
	{
		var bounds:Box = this._hitRenderable.sourceEntity.bounds.aabb;
		var col:number;
		var scX:number, scY:number, scZ:number;
		var offsX:number, offsY:number, offsZ:number;
		var localViewProjection:Matrix3D = Matrix3DUtils.CALCULATION_MATRIX;

		localViewProjection.copyFrom(this._hitRenderable.sourceEntity.getRenderSceneTransform(camera));
		localViewProjection.append(camera.viewProjection);
		if (!this._triangleProgram) {
			this.initTriangleProgram();
		}

		this._boundOffsetScale[4] = 1/(scX = bounds.width);
		this._boundOffsetScale[5] = 1/(scY = bounds.height);
		this._boundOffsetScale[6] = 1/(scZ = bounds.depth);
		this._boundOffsetScale[0] = offsX = -bounds.x;
		this._boundOffsetScale[1] = offsY = -bounds.y;
		this._boundOffsetScale[2] = offsZ = -bounds.z;

		this._context.setProgram(this._triangleProgram);
		this._context.clear(0, 0, 0, 0, 1, 0, ContextGLClearMask.DEPTH);
		this._context.setScissorRectangle(ShaderPicker.MOUSE_SCISSOR_RECT);
		this._context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, localViewProjection, true);
		this._context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 5, this._boundOffsetScale, 2);

		this._context.activateBuffer(0, this._hitRenderable.getVertexData(TriangleSubGeometry.POSITION_DATA), this._hitRenderable.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);
		this._context.drawTriangles(this._context.getIndexBuffer(this._hitRenderable.getIndexData()), 0, this._hitRenderable.numTriangles);

		this._context.drawToBitmapData(this._bitmapData);

		col = this._bitmapData.getPixel(0, 0);

		this._localHitPosition.x = ((col >> 16) & 0xff)*scX/255 - offsX;
		this._localHitPosition.y = ((col >> 8) & 0xff)*scY/255 - offsY;
		this._localHitPosition.z = (col & 0xff)*scZ/255 - offsZ;
	}

	/**
	 * Use the approximate position info to find the face under the mouse position from which we can derive the precise
	 * ray-face intersection point, then use barycentric coordinates to figure out the uv coordinates, etc.
	 * @param camera The camera used to view the hit object.
	 */
	private getPreciseDetails(camera:Camera)
	{
		var len:number = indices.length;
		var x1:number, y1:number, z1:number;
		var x2:number, y2:number, z2:number;
		var x3:number, y3:number, z3:number;
		var i:number = 0, j:number = 1, k:number = 2;
		var t1:number, t2:number, t3:number;
		var v0x:number, v0y:number, v0z:number;
		var v1x:number, v1y:number, v1z:number;
		var v2x:number, v2y:number, v2z:number;
		var ni1:number, ni2:number, ni3:number;
		var n1:number, n2:number, n3:number, nLength:number;
		var dot00:number, dot01:number, dot02:number, dot11:number, dot12:number;
		var s:number, t:number, invDenom:number;
		var x:number = this._localHitPosition.x, y:number = this._localHitPosition.y, z:number = this._localHitPosition.z;
		var u:number, v:number;
		var ui1:number, ui2:number, ui3:number;
		var s0x:number, s0y:number, s0z:number;
		var s1x:number, s1y:number, s1z:number;
		var nl:number;
		var indices:Array<number> = this._hitRenderable.getIndexData().data;

		var positions:Array<number> = this._hitRenderable.getVertexData(TriangleSubGeometry.POSITION_DATA).data;
		var positionStride:number = this._hitRenderable.getVertexData(TriangleSubGeometry.POSITION_DATA).dataPerVertex;
		var positionOffset:number = this._hitRenderable.getVertexOffset(TriangleSubGeometry.POSITION_DATA);

		var uvs:Array<number> = this._hitRenderable.getVertexData(TriangleSubGeometry.UV_DATA).data;
		var uvStride:number = this._hitRenderable.getVertexData(TriangleSubGeometry.UV_DATA).dataPerVertex;
		var uvOffset:number = this._hitRenderable.getVertexOffset(TriangleSubGeometry.UV_DATA);

		var normals:Array<number> = this._hitRenderable.getVertexData(TriangleSubGeometry.NORMAL_DATA).data;
		var normalStride:number = this._hitRenderable.getVertexData(TriangleSubGeometry.NORMAL_DATA).dataPerVertex;
		var normalOffset:number = this._hitRenderable.getVertexOffset(TriangleSubGeometry.NORMAL_DATA);

		this.updateRay(camera);

		while (i < len) {
			t1 = positionOffset + indices[i]*positionStride;
			t2 = positionOffset + indices[j]*positionStride;
			t3 = positionOffset + indices[k]*positionStride;
			x1 = positions[t1];
			y1 = positions[t1 + 1];
			z1 = positions[t1 + 2];
			x2 = positions[t2];
			y2 = positions[t2 + 1];
			z2 = positions[t2 + 2];
			x3 = positions[t3];
			y3 = positions[t3 + 1];
			z3 = positions[t3 + 2];

			// if within bounds
			if (!(    (x < x1 && x < x2 && x < x3) || (y < y1 && y < y2 && y < y3) || (z < z1 && z < z2 && z < z3) || (x > x1 && x > x2 && x > x3) || (y > y1 && y > y2 && y > y3) || (z > z1 && z > z2 && z > z3))) {

				// calculate barycentric coords for approximated position
				v0x = x3 - x1;
				v0y = y3 - y1;
				v0z = z3 - z1;
				v1x = x2 - x1;
				v1y = y2 - y1;
				v1z = z2 - z1;
				v2x = x - x1;
				v2y = y - y1;
				v2z = z - z1;
				dot00 = v0x*v0x + v0y*v0y + v0z*v0z;
				dot01 = v0x*v1x + v0y*v1y + v0z*v1z;
				dot02 = v0x*v2x + v0y*v2y + v0z*v2z;
				dot11 = v1x*v1x + v1y*v1y + v1z*v1z;
				dot12 = v1x*v2x + v1y*v2y + v1z*v2z;
				invDenom = 1/(dot00*dot11 - dot01*dot01);
				s = (dot11*dot02 - dot01*dot12)*invDenom;
				t = (dot00*dot12 - dot01*dot02)*invDenom;

				// if inside the current triangle, fetch details hit information
				if (s >= 0 && t >= 0 && (s + t) <= 1) {

					ni1 = normalOffset + indices[i]*normalStride;
					ni2 = normalOffset + indices[j]*normalStride;
					ni3 = normalOffset + indices[k]*normalStride;

					n1 = indices[ni1] + indices[ni2] + indices[ni3];
					n2 = indices[ni1 + 1] + indices[ni2 + 1] + indices[ni3 + 1];
					n3 = indices[ni1 + 2] + indices[ni2 + 2] + indices[ni3 + 2];

					nLength = Math.sqrt(n1*n1 + n2*n2 + n3*n3);

					n1 /= nLength;
					n2 /= nLength;
					n3 /= nLength;

					// this is def the triangle, now calculate precise coords
					this.getPrecisePosition(this._hitRenderable.sourceEntity.inverseSceneTransform, n1, n2, n3, x1, y1, z1);

					v2x = this._localHitPosition.x - x1;
					v2y = this._localHitPosition.y - y1;
					v2z = this._localHitPosition.z - z1;

					s0x = x2 - x1; // s0 = p1 - p0
					s0y = y2 - y1;
					s0z = z2 - z1;
					s1x = x3 - x1; // s1 = p2 - p0
					s1y = y3 - y1;
					s1z = z3 - z1;
					this._localHitNormal.x = s0y*s1z - s0z*s1y; // n = s0 x s1
					this._localHitNormal.y = s0z*s1x - s0x*s1z;
					this._localHitNormal.z = s0x*s1y - s0y*s1x;
					nl = 1/Math.sqrt(this._localHitNormal.x*this._localHitNormal.x + this._localHitNormal.y*this._localHitNormal.y + this._localHitNormal.z*this._localHitNormal.z); // normalize n
					this._localHitNormal.x *= nl;
					this._localHitNormal.y *= nl;
					this._localHitNormal.z *= nl;

					dot02 = v0x*v2x + v0y*v2y + v0z*v2z;
					dot12 = v1x*v2x + v1y*v2y + v1z*v2z;
					s = (dot11*dot02 - dot01*dot12)*invDenom;
					t = (dot00*dot12 - dot01*dot02)*invDenom;

					ui1 = uvOffset + indices[i]*uvStride
					ui2 = uvOffset + indices[j]*uvStride
					ui3 = uvOffset + indices[k]*uvStride

					u = uvs[ui1];
					v = uvs[ui1 + 1];
					this._hitUV.x = u + t*(uvs[ui2] - u) + s*(uvs[ui3] - u);
					this._hitUV.y = v + t*(uvs[ui2 + 1] - v) + s*(uvs[ui3 + 1] - v);

					this._faceIndex = i;
					//TODO add back subGeometryIndex value
					//this._subGeometryIndex = away.utils.GeometryUtils.getMeshSubGeometryIndex(subGeom);

					return;
				}
			}

			i += 3;
			j += 3;
			k += 3;
		}
	}

	/**
	 * Finds the precise hit position by unprojecting the screen coordinate back unto the hit face's plane and
	 * calculating the intersection point.
	 * @param camera The camera used to render the object.
	 * @param invSceneTransform The inverse scene transformation of the hit object.
	 * @param nx The x-coordinate of the face's plane normal.
	 * @param ny The y-coordinate of the face plane normal.
	 * @param nz The z-coordinate of the face plane normal.
	 * @param px The x-coordinate of a point on the face's plane (ie a face vertex)
	 * @param py The y-coordinate of a point on the face's plane (ie a face vertex)
	 * @param pz The z-coordinate of a point on the face's plane (ie a face vertex)
	 */

	private getPrecisePosition(invSceneTransform:Matrix3D, nx:number, ny:number, nz:number, px:number, py:number, pz:number)
	{
		// calculate screen ray and find exact intersection position with triangle
		var rx:number, ry:number, rz:number;
		var ox:number, oy:number, oz:number;
		var t:number;
		var raw:Array<number> = Matrix3DUtils.RAW_DATA_CONTAINER;
		var cx:number = this._rayPos.x, cy:number = this._rayPos.y, cz:number = this._rayPos.z;

		// unprojected projection point, gives ray dir in cam space
		ox = this._rayDir.x;
		oy = this._rayDir.y;
		oz = this._rayDir.z;

		// transform ray dir and origin (cam pos) to object space
		//invSceneTransform.copyRawDataTo( raw  );
		invSceneTransform.copyRawDataTo(raw);
		rx = raw[0]*ox + raw[4]*oy + raw[8]*oz;
		ry = raw[1]*ox + raw[5]*oy + raw[9]*oz;
		rz = raw[2]*ox + raw[6]*oy + raw[10]*oz;

		ox = raw[0]*cx + raw[4]*cy + raw[8]*cz + raw[12];
		oy = raw[1]*cx + raw[5]*cy + raw[9]*cz + raw[13];
		oz = raw[2]*cx + raw[6]*cy + raw[10]*cz + raw[14];

		t = ((px - ox)*nx + (py - oy)*ny + (pz - oz)*nz)/(rx*nx + ry*ny + rz*nz);

		this._localHitPosition.x = ox + rx*t;
		this._localHitPosition.y = oy + ry*t;
		this._localHitPosition.z = oz + rz*t;
	}

	public dispose()
	{
		this._bitmapData.dispose();
		if (this._triangleProgram)
			this._triangleProgram.dispose();

		if (this._objectProgram)
			this._objectProgram.dispose();

		this._triangleProgram = null;
		this._objectProgram = null;
		this._bitmapData = null;
		this._hitRenderable = null;
		this._hitEntity = null;
	}
}

export = ShaderPicker;