

///<reference path="../_definitions.ts"/>

module away.pick
{
	//import away3d.arcane;
	//import away3d.cameras.*;
	//import away3d.containers.*;
	//import away3d.core.base.*;
	//import away3d.core.data.*;
	//import away3d.managers.*;
	//import away3d.core.math.*;
	//import away3d.core.traverse.*;
	//import away3d.entities.*;
	//import away3d.utils.GeometryUtils;
	
	//import flash.display.*;
	//import flash.display3D.*;
	//import flash.display3D.textures.*;
	//import flash.geom.*;
	
	//import com.adobe.utils.*;
	
	//use namespace arcane;
	
	/**
	 * Picks a 3d object from a view or scene by performing a separate render pass on the scene around the area being picked using key color values,
	 * then reading back the color value of the pixel in the render representing the picking ray. Requires multiple passes and readbacks for retriving details
	 * on an entity that has its shaderPickingDetails property set to true.
	 *
	 * A read-back operation from any GPU is not a very efficient process, and the amount of processing used can vary significantly between different hardware.
	 *
	 * @see away3d.entities.Entity#shaderPickingDetails
	 */

    // TODO: Dependencies needed to before implementing IPicker - EntityCollector
	export class ShaderPicker implements away.pick.IPicker
	{
        // TODO: Stage3DProxy - Implement and Integrate
		private _stage3DProxy:away.managers.Stage3DProxy;
		private _context:away.display3D.Context3D;
		private _onlyMouseEnabled:boolean = true;
		
		private _objectProgram3D:away.display3D.Program3D;
		private _triangleProgram3D:away.display3D.Program3D;
		private _bitmapData:away.display.BitmapData;
		private _viewportData:number[];
		private _boundOffsetScale:number[];
		private _id:number[];
		
		private _interactives:away.base.IRenderable[] = new Array<away.base.IRenderable>();//Vector.<IRenderable> = new Vector.<IRenderable>();
		private _interactiveId:number;
		private _hitColor:number;
		private _projX:number;
		private _projY:number;
		
		private _hitRenderable:away.base.IRenderable;
		private _hitEntity:away.entities.Entity;
		private _localHitPosition:away.geom.Vector3D = new away.geom.Vector3D();
		private _hitUV:away.geom.Point = new away.geom.Point();
		private _faceIndex:number;
		private _subGeometryIndex:number;
		
		private _localHitNormal:away.geom.Vector3D = new away.geom.Vector3D();
		
		private _rayPos:away.geom.Vector3D = new away.geom.Vector3D();
		private _rayDir:away.geom.Vector3D = new away.geom.Vector3D();
		private _potentialFound:boolean;
		private static MOUSE_SCISSOR_RECT:away.geom.Rectangle = new away.geom.Rectangle(0, 0, 1, 1);
		
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
		 */
		constructor()
		{
			this._id = new Array<number>( 4 );//new Vector.<Number>(4, true);
			this._viewportData = new Array<number>( 4 );//new Vector.<Number>(4, true); // first 2 contain scale, last 2 translation
			this._boundOffsetScale = new Array<number>( 8 );//new Vector.<Number>(8, true); // first 2 contain scale, last 2 translation
			this._boundOffsetScale[3] = 0;
			this._boundOffsetScale[7] = 1;
		}
		
		/**
		 * @inheritDoc
		 */
        // TODO implement dependency : EntityCollector
        // TODO: GLSL implementation / conversion
		public getViewCollision(x:number, y:number, view:away.containers.View3D):away.pick.PickingCollisionVO
		{

            away.Debug.throwPIR( 'ShaderPicker' , 'getViewCollision' , 'implement' );

            return null;

            /*
			var collector:EntityCollector = view.entityCollector;
			
			_stage3DProxy = view.stage3DProxy;
			
			if (!_stage3DProxy)
				return null;
			
			_context = _stage3DProxy._context3D;
			
			_viewportData[0] = view.width;
			_viewportData[1] = view.height;
			_viewportData[2] = -(_projX = 2*x/view.width - 1);
			_viewportData[3] = _projY = 2*y/view.height - 1;
			
			// _potentialFound will be set to true if any object is actually rendered
			_potentialFound = false;
			
			draw(collector, null);
			
			// clear buffers
			_context.setVertexBufferAt(0, null);
			
			if (!_context || !_potentialFound)
				return null;
			
			if (!_bitmapData)
				_bitmapData = new BitmapData(1, 1, false, 0);
			
			_context.drawToBitmapData(_bitmapData);
			_hitColor = _bitmapData.getPixel(0, 0);
			
			if (!_hitColor) {
				_context.present();
				return null;
			}
			
			_hitRenderable = _interactives[_hitColor - 1];
			_hitEntity = _hitRenderable.sourceEntity;
			if (_onlyMouseEnabled && (!_hitEntity._ancestorsAllowMouseEnabled || !_hitEntity.mouseEnabled))
				return null;
			
			var _collisionVO:PickingCollisionVO = _hitEntity.pickingCollisionVO;
			if (_hitRenderable.shaderPickingDetails) {
				getHitDetails(view.camera);
				_collisionVO.localPosition = _localHitPosition;
				_collisionVO.localNormal = _localHitNormal;
				_collisionVO.uv = _hitUV;
				_collisionVO.index = _faceIndex;
				_collisionVO.subGeometryIndex = _subGeometryIndex;
				
			} else {
				_collisionVO.localPosition = null;
				_collisionVO.localNormal = null;
				_collisionVO.uv = null;
				_collisionVO.index = 0;
				_collisionVO.subGeometryIndex = 0;
			}
			
			return _collisionVO;
			*/
		}
		//*/
		/**
		 * @inheritDoc
		 */
		public getSceneCollision(position:away.geom.Vector3D, direction:away.geom.Vector3D, scene:away.containers.Scene3D):away.pick.PickingCollisionVO
		{
			return null;
		}
		
		/**
		 * @inheritDoc
		 */
        // TODO: GLSL implementation / conversion
		public pDraw(entityCollector:away.traverse.EntityCollector, target:away.display3D.TextureBase)
		{

            away.Debug.throwPIR( 'ShaderPicker' , 'pDraw' , 'implement' );
            /*
			var camera:away.cameras.Camera3D = entityCollector.camera;
			
			this._context.clear(0, 0, 0, 1);
			this._stage3DProxy.scissorRect = ShaderPicker.MOUSE_SCISSOR_RECT;
			
			this._interactives.length = this._interactiveId = 0;
			
			if (!this._objectProgram3D)
            {

                this.initObjectProgram3D();

            }

			this._context.setBlendFactors(away.display3D.Context3DBlendFactor.ONE, away.display3D.Context3DBlendFactor.ZERO);
			this._context.setDepthTest(true, away.display3D.Context3DCompareMode.LESS);
			this._context.setProgram(this._objectProgram3D);
			this._context.setProgramConstantsFromArray(away.display3D.Context3DProgramType.VERTEX, 4, this._viewportData, 1);
			this.drawRenderables(entityCollector.opaqueRenderableHead, camera);
			this.drawRenderables(entityCollector.blendedRenderableHead, camera);
			*/
		}

		/**
		 * Draw a list of renderables.
		 * @param renderables The renderables to draw.
		 * @param camera The camera for which to render.
		 */
		private drawRenderables(item:away.data.RenderableListItem, camera:away.cameras.Camera3D)
		{

            away.Debug.throwPIR( 'ShaderPicker' , 'drawRenderables' , 'implement' );

            /*
			var matrix:Matrix3D = away3d.math.Matrix3DUtils.CALCULATION_MATRIX;
			var renderable:IRenderable;
			var viewProjection:Matrix3D = camera.viewProjection;
			
			while (item) {
				renderable = item.renderable;
				
				// it's possible that the renderable was already removed from the scene
				if (!renderable.sourceEntity.scene || (!renderable.mouseEnabled && _onlyMouseEnabled)) {
					item = item.next;
					continue;
				}
				
				_potentialFound = true;
				
				_context.setCulling(renderable.material.bothSides? Context3DTriangleFace.NONE : Context3DTriangleFace.BACK);
				
				_interactives[_interactiveId++] = renderable;
				// color code so that reading from bitmapdata will contain the correct value
				_id[1] = (_interactiveId >> 8)/255; // on green channel
				_id[2] = (_interactiveId & 0xff)/255; // on blue channel
				
				matrix.copyFrom(renderable.getRenderSceneTransform(camera));
				matrix.append(viewProjection);
				_context.setProgramConstantsFromMatrix(Context3DProgramType.VERTEX, 0, matrix, true);
				_context.setProgramConstantsFromVector(Context3DProgramType.FRAGMENT, 0, _id, 1);
				renderable.activateVertexBuffer(0, _stage3DProxy);
				_context.drawTriangles(renderable.getIndexBuffer(_stage3DProxy), 0, renderable.numTriangles);
				
				item = item.next;
			}
			*/
		}

		private updateRay(camera:away.cameras.Camera3D)
		{
            /*
			_rayPos = camera.scenePosition;
			_rayDir = camera.getRay(_projX, _projY, 1);
			_rayDir.normalize();
			*/
		}

		/**
		 * Creates the Program3D that color-codes objects.
		 */
        /* TODO AGAL <> GLSL conversion.
		private initObjectProgram3D()
		{
			var vertexCode:string;
			var fragmentCode:string;
			
			_objectProgram3D = _context.createProgram();
			
			vertexCode = "m44 vt0, va0, vc0			\n" +
				"mul vt1.xy, vt0.w, vc4.zw	\n" +
				"add vt0.xy, vt0.xy, vt1.xy	\n" +
				"mul vt0.xy, vt0.xy, vc4.xy	\n" +
				"mov op, vt0	\n";
			fragmentCode = "mov oc, fc0"; // write identifier
			
			_objectProgram3D.upload(new AGALMiniAssembler().assemble(Context3DProgramType.VERTEX, vertexCode),
				new AGALMiniAssembler().assemble(Context3DProgramType.FRAGMENT, fragmentCode));
		}
		*/
		/**
		 * Creates the Program3D that renders positions.
		 */
        /* TODO AGAL <> GLSL conversion.
		private initTriangleProgram3D()
		{
			var vertexCode:string;
			var fragmentCode:string;
			
			this._triangleProgram3D = this._context.createProgram();
			
			// todo: add animation code
			vertexCode = "add vt0, va0, vc5 			\n" +
				"mul vt0, vt0, vc6 			\n" +
				"mov v0, vt0				\n" +
				"m44 vt0, va0, vc0			\n" +
				"mul vt1.xy, vt0.w, vc4.zw	\n" +
				"add vt0.xy, vt0.xy, vt1.xy	\n" +
				"mul vt0.xy, vt0.xy, vc4.xy	\n" +
				"mov op, vt0	\n";
			fragmentCode = "mov oc, v0"; // write identifier
			
			_triangleProgram3D.upload(new AGALMiniAssembler().assemble(Context3DProgramType.VERTEX, vertexCode),
				new AGALMiniAssembler().assemble(Context3DProgramType.FRAGMENT, fragmentCode));
		}
		*/
		/**
		 * Gets more detailed information about the hir position, if required.
		 * @param camera The camera used to view the hit object.
		 */
        /* TODO implement dependencies: Camera3D
		private getHitDetails(camera:Camera3D)
		{
			getApproximatePosition(camera);
			getPreciseDetails(camera);
		}
		*/
		/**
		 * Finds a first-guess approximate position about the hit position.
		 * @param camera The camera used to view the hit object.
		 */
        /* TODO implement dependencies: Camera3D
		private getApproximatePosition(camera:Camera3D)
		{
			var entity:Entity = _hitRenderable.sourceEntity;
			var col:number;
			var scX:number, scY:number, scZ:number;
			var offsX:number, offsY:number, offsZ:number;
			var localViewProjection:Matrix3D = away3d.math.Matrix3DUtils.CALCULATION_MATRIX;
			localViewProjection.copyFrom(_hitRenderable.getRenderSceneTransform(camera));
			localViewProjection.append(camera.viewProjection);
			if (!_triangleProgram3D)
				initTriangleProgram3D();
			
			_boundOffsetScale[4] = 1/(scX = entity.maxX - entity.minX);
			_boundOffsetScale[5] = 1/(scY = entity.maxY - entity.minY);
			_boundOffsetScale[6] = 1/(scZ = entity.maxZ - entity.minZ);
			_boundOffsetScale[0] = offsX = -entity.minX;
			_boundOffsetScale[1] = offsY = -entity.minY;
			_boundOffsetScale[2] = offsZ = -entity.minZ;
			
			_context.setProgram(_triangleProgram3D);
			_context.clear(0, 0, 0, 0, 1, 0, Context3DClearMask.DEPTH);
			_context.setScissorRectangle(ShaderPicker.MOUSE_SCISSOR_RECT);
			_context.setProgramConstantsFromMatrix(Context3DProgramType.VERTEX, 0, localViewProjection, true);
			_context.setProgramConstantsFromVector(Context3DProgramType.VERTEX, 5, _boundOffsetScale, 2);
			_hitRenderable.activateVertexBuffer(0, _stage3DProxy);
			_context.drawTriangles(_hitRenderable.getIndexBuffer(_stage3DProxy), 0, _hitRenderable.numTriangles);
			_context.drawToBitmapData(_bitmapData);
			
			col = _bitmapData.getPixel(0, 0);
			
			_localHitPosition.x = ((col >> 16) & 0xff)*scX/255 - offsX;
			_localHitPosition.y = ((col >> 8) & 0xff)*scY/255 - offsY;
			_localHitPosition.z = (col & 0xff)*scZ/255 - offsZ;
		}
		*/
		/**
		 * Use the approximate position info to find the face under the mouse position from which we can derive the precise
		 * ray-face intersection point, then use barycentric coordinates to figure out the uv coordinates, etc.
		 * @param camera The camera used to view the hit object.
		 */
        /* TODO implement dependencies: Camera3D
		private getPreciseDetails(camera:Camera3D)
		{
			
			var subGeom:ISubGeometry = SubMesh(_hitRenderable).subGeometry;
			var indices:number[] = subGeom.indexData;
			var vertices:number[] = subGeom.vertexData;
			var len:number = indices.length;
			var x1:number, y1:number, z1:number;
			var x2:number, y2:number, z2:number;
			var x3:number, y3:number, z3:number;
			var i:number = 0, j:number = 1, k:number = 2;
			var t1:number, t2:number, t3:number;
			var v0x:number, v0y:number, v0z:number;
			var v1x:number, v1y:number, v1z:number;
			var v2x:number, v2y:number, v2z:number;
			var dot00:number, dot01:number, dot02:number, dot11:number, dot12:number;
			var s:number, t:number, invDenom:number;
			var uvs:number[] = subGeom.UVData;
			var normals:number[] = subGeom.faceNormals;
			var x:number = _localHitPosition.x, y:number = _localHitPosition.y, z:number = _localHitPosition.z;
			var u:number, v:number;
			var ui1:number, ui2:number, ui3:number;
			var s0x:number, s0y:number, s0z:number;
			var s1x:number, s1y:number, s1z:number;
			var nl:number;
			var stride:number = subGeom.vertexStride;
			var vertexOffset:number = subGeom.vertexOffset;
			
			updateRay(camera);
			
			while (i < len) {
				t1 = vertexOffset + indices[i]*stride;
				t2 = vertexOffset + indices[j]*stride;
				t3 = vertexOffset + indices[k]*stride;
				x1 = vertices[t1];
				y1 = vertices[t1 + 1];
				z1 = vertices[t1 + 2];
				x2 = vertices[t2];
				y2 = vertices[t2 + 1];
				z2 = vertices[t2 + 2];
				x3 = vertices[t3];
				y3 = vertices[t3 + 1];
				z3 = vertices[t3 + 2];
				
				// if within bounds
				if (!(    (x < x1 && x < x2 && x < x3) ||
					(y < y1 && y < y2 && y < y3) ||
					(z < z1 && z < z2 && z < z3) ||
					(x > x1 && x > x2 && x > x3) ||
					(y > y1 && y > y2 && y > y3) ||
					(z > z1 && z > z2 && z > z3))) {
					
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
						
						// this is def the triangle, now calculate precise coords
						getPrecisePosition(_hitRenderable.inverseSceneTransform, normals[i], normals[i + 1], normals[i + 2], x1, y1, z1);
						
						v2x = _localHitPosition.x - x1;
						v2y = _localHitPosition.y - y1;
						v2z = _localHitPosition.z - z1;
						
						s0x = x2 - x1; // s0 = p1 - p0
						s0y = y2 - y1;
						s0z = z2 - z1;
						s1x = x3 - x1; // s1 = p2 - p0
						s1y = y3 - y1;
						s1z = z3 - z1;
						_localHitNormal.x = s0y*s1z - s0z*s1y; // n = s0 x s1
						_localHitNormal.y = s0z*s1x - s0x*s1z;
						_localHitNormal.z = s0x*s1y - s0y*s1x;
						nl = 1/Math.sqrt(
							_localHitNormal.x*_localHitNormal.x +
							_localHitNormal.y*_localHitNormal.y +
							_localHitNormal.z*_localHitNormal.z
							); // normalize n
						_localHitNormal.x *= nl;
						_localHitNormal.y *= nl;
						_localHitNormal.z *= nl;
						
						dot02 = v0x*v2x + v0y*v2y + v0z*v2z;
						dot12 = v1x*v2x + v1y*v2y + v1z*v2z;
						s = (dot11*dot02 - dot01*dot12)*invDenom;
						t = (dot00*dot12 - dot01*dot02)*invDenom;
						
						ui1 = indices[i] << 1;
						ui2 = indices[j] << 1;
						ui3 = indices[k] << 1;
						
						u = uvs[ui1];
						v = uvs[ui1 + 1];
						_hitUV.x = u + t*(uvs[ui2] - u) + s*(uvs[ui3] - u);
						_hitUV.y = v + t*(uvs[ui2 + 1] - v) + s*(uvs[ui3 + 1] - v);
						
						_faceIndex = i;
						_subGeometryIndex = GeometryUtils.getMeshSubMeshIndex(SubMesh(_hitRenderable));
						
						return;
					}
				}
				
				i += 3;
				j += 3;
				k += 3;
			}
		}
		*/
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

		private getPrecisePosition(invSceneTransform:away.geom.Matrix3D, nx:number, ny:number, nz:number, px:number, py:number, pz:number)
		{
			// calculate screen ray and find exact intersection position with triangle
			var rx:number, ry:number, rz:number;
			var ox:number, oy:number, oz:number;
			var t:number;
			var raw:number[] = away.math.Matrix3DUtils.RAW_DATA_CONTAINER;
			var cx:number = this._rayPos.x, cy:number = this._rayPos.y, cz:number = this._rayPos.z;
			
			// unprojected projection point, gives ray dir in cam space
			ox = this._rayDir.x;
			oy = this._rayDir.y;
			oz = this._rayDir.z;
			
			// transform ray dir and origin (cam pos) to object space
            //invSceneTransform.copyRawDataTo( raw  );
            invSceneTransform.copyRawDataTo( raw );
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
			if (this._triangleProgram3D)
            {

                this._triangleProgram3D.dispose();

            }

			if (this._objectProgram3D)
            {

                this._objectProgram3D.dispose();

            }

            this._triangleProgram3D = null;
            this._objectProgram3D = null;
            this._bitmapData = null;
            this._hitRenderable = null;
            this._hitEntity = null;
		}
	}
}
