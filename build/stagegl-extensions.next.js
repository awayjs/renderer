///<reference path="../_definitions.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var away;
(function (away) {
    (function (events) {
        /**
        * Dispatched to notify changes in an animation state's state.
        */
        var AnimationStateEvent = (function (_super) {
            __extends(AnimationStateEvent, _super);
            /**
            * Create a new <code>AnimatonStateEvent</code>
            *
            * @param type The event type.
            * @param animator The animation state object that is the subject of this event.
            * @param animationNode The animation node inside the animation state from which the event originated.
            */
            function AnimationStateEvent(type, animator, animationState, animationNode) {
                _super.call(this, type);

                this._animator = animator;
                this._animationState = animationState;
                this._animationNode = animationNode;
            }
            Object.defineProperty(AnimationStateEvent.prototype, "animator", {
                /**
                * The animator object that is the subject of this event.
                */
                get: function () {
                    return this._animator;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AnimationStateEvent.prototype, "animationState", {
                /**
                * The animation state object that is the subject of this event.
                */
                get: function () {
                    return this._animationState;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AnimationStateEvent.prototype, "animationNode", {
                /**
                * The animation node inside the animation state from which the event originated.
                */
                get: function () {
                    return this._animationNode;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Clones the event.
            *
            * @return An exact duplicate of the current object.
            */
            AnimationStateEvent.prototype.clone = function () {
                return new AnimationStateEvent(this.type, this._animator, this._animationState, this._animationNode);
            };
            AnimationStateEvent.PLAYBACK_COMPLETE = "playbackComplete";

            AnimationStateEvent.TRANSITION_COMPLETE = "transitionComplete";
            return AnimationStateEvent;
        })(events.Event);
        events.AnimationStateEvent = AnimationStateEvent;
    })(away.events || (away.events = {}));
    var events = away.events;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    /**
    * @module away.base
    */
    (function (base) {
        /**
        * @class away.base.ParticleGeometry
        */
        var ParticleGeometry = (function (_super) {
            __extends(ParticleGeometry, _super);
            function ParticleGeometry() {
                _super.apply(this, arguments);
            }
            return ParticleGeometry;
        })(base.Geometry);
        base.ParticleGeometry = ParticleGeometry;
    })(away.base || (away.base = {}));
    var base = away.base;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    /**
    * @module away.pick
    */
    (function (pick) {
        /**
        * An abstract base class for all picking collider classes. It should not be instantiated directly.
        *
        * @class away.pick.PickingColliderBase
        */
        var PickingColliderBase = (function () {
            function PickingColliderBase() {
                this._billboardRenderablePool = away.pool.RenderablePool.getPool(away.pool.BillboardRenderable);
                this._subMeshRenderablePool = away.pool.RenderablePool.getPool(away.pool.TriangleSubMeshRenderable);
            }
            PickingColliderBase.prototype._pPetCollisionNormal = function (indexData /*uint*/ , vertexData, triangleIndex) {
                var normal = new away.geom.Vector3D();
                var i0 = indexData[triangleIndex] * 3;
                var i1 = indexData[triangleIndex + 1] * 3;
                var i2 = indexData[triangleIndex + 2] * 3;
                var p0 = new away.geom.Vector3D(vertexData[i0], vertexData[i0 + 1], vertexData[i0 + 2]);
                var p1 = new away.geom.Vector3D(vertexData[i1], vertexData[i1 + 1], vertexData[i1 + 2]);
                var p2 = new away.geom.Vector3D(vertexData[i2], vertexData[i2 + 1], vertexData[i2 + 2]);
                var side0 = p1.subtract(p0);
                var side1 = p2.subtract(p0);
                normal = side0.crossProduct(side1);
                normal.normalize();
                return normal;
            };

            PickingColliderBase.prototype._pGetCollisionUV = function (indexData /*uint*/ , uvData, triangleIndex, v, w, u, uvOffset, uvStride) {
                var uv = new away.geom.Point();
                var uIndex = indexData[triangleIndex] * uvStride + uvOffset;
                var uv0 = new away.geom.Vector3D(uvData[uIndex], uvData[uIndex + 1]);
                uIndex = indexData[triangleIndex + 1] * uvStride + uvOffset;
                var uv1 = new away.geom.Vector3D(uvData[uIndex], uvData[uIndex + 1]);
                uIndex = indexData[triangleIndex + 2] * uvStride + uvOffset;
                var uv2 = new away.geom.Vector3D(uvData[uIndex], uvData[uIndex + 1]);
                uv.x = u * uv0.x + v * uv1.x + w * uv2.x;
                uv.y = u * uv0.y + v * uv1.y + w * uv2.y;
                return uv;
            };

            /**
            * @inheritDoc
            */
            PickingColliderBase.prototype._pTestRenderableCollision = function (renderable, pickingCollisionVO, shortestCollisionDistance) {
                throw new away.errors.AbstractMethodError();
            };

            /**
            * @inheritDoc
            */
            PickingColliderBase.prototype.setLocalRay = function (localPosition, localDirection) {
                this.rayPosition = localPosition;
                this.rayDirection = localDirection;
            };

            /**
            * Tests a <code>Billboard</code> object for a collision with the picking ray.
            *
            * @param billboard The billboard instance to be tested.
            * @param pickingCollisionVO The collision object used to store the collision results
            * @param shortestCollisionDistance The current value of the shortest distance to a detected collision along the ray.
            * @param findClosest
            */
            PickingColliderBase.prototype.testBillboardCollision = function (billboard, pickingCollisionVO, shortestCollisionDistance) {
                this.setLocalRay(pickingCollisionVO.localRayPosition, pickingCollisionVO.localRayDirection);
                pickingCollisionVO.materialOwner = null;

                if (this._pTestRenderableCollision(this._billboardRenderablePool.getItem(billboard), pickingCollisionVO, shortestCollisionDistance)) {
                    shortestCollisionDistance = pickingCollisionVO.rayEntryDistance;

                    pickingCollisionVO.materialOwner = billboard;

                    return true;
                }

                return false;
            };

            /**
            * Tests a <code>Mesh</code> object for a collision with the picking ray.
            *
            * @param mesh The mesh instance to be tested.
            * @param pickingCollisionVO The collision object used to store the collision results
            * @param shortestCollisionDistance The current value of the shortest distance to a detected collision along the ray.
            * @param findClosest
            */
            PickingColliderBase.prototype.testMeshCollision = function (mesh, pickingCollisionVO, shortestCollisionDistance, findClosest) {
                this.setLocalRay(pickingCollisionVO.localRayPosition, pickingCollisionVO.localRayDirection);
                pickingCollisionVO.materialOwner = null;

                var subMesh;

                var len = mesh.subMeshes.length;
                for (var i = 0; i < len; ++i) {
                    subMesh = mesh.subMeshes[i];

                    if (this._pTestRenderableCollision(this._subMeshRenderablePool.getItem(subMesh), pickingCollisionVO, shortestCollisionDistance)) {
                        shortestCollisionDistance = pickingCollisionVO.rayEntryDistance;

                        pickingCollisionVO.materialOwner = subMesh;

                        if (!findClosest)
                            return true;
                    }
                }

                return pickingCollisionVO.materialOwner != null;
            };
            return PickingColliderBase;
        })();
        pick.PickingColliderBase = PickingColliderBase;
    })(away.pick || (away.pick = {}));
    var pick = away.pick;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    /**
    * @module away.pick
    */
    (function (pick) {
        var SubGeometry = away.base.TriangleSubGeometry;

        /**
        * Pure JS picking collider for display objects. Used with the <code>RaycastPicker</code> picking object.
        *
        * @see away.base.DisplayObject#pickingCollider
        * @see away.pick.RaycastPicker
        *
        * @class away.pick.JSPickingCollider
        */
        var JSPickingCollider = (function (_super) {
            __extends(JSPickingCollider, _super);
            /**
            * Creates a new <code>JSPickingCollider</code> object.
            *
            * @param findClosestCollision Determines whether the picking collider searches for the closest collision along the ray. Defaults to false.
            */
            function JSPickingCollider(findClosestCollision) {
                if (typeof findClosestCollision === "undefined") { findClosestCollision = false; }
                _super.call(this);

                this._findClosestCollision = findClosestCollision;
            }
            /**
            * @inheritDoc
            */
            JSPickingCollider.prototype._pTestRenderableCollision = function (renderable, pickingCollisionVO, shortestCollisionDistance) {
                var t;
                var i0, i1, i2;
                var rx, ry, rz;
                var nx, ny, nz;
                var cx, cy, cz;
                var coeff, u, v, w;
                var p0x, p0y, p0z;
                var p1x, p1y, p1z;
                var p2x, p2y, p2z;
                var s0x, s0y, s0z;
                var s1x, s1y, s1z;
                var nl, nDotV, D, disToPlane;
                var Q1Q2, Q1Q1, Q2Q2, RQ1, RQ2;
                var indexData = renderable.getIndexData().data;
                var collisionTriangleIndex = -1;
                var bothSides = renderable.materialOwner.material.bothSides;

                var positionData = renderable.getVertexData(SubGeometry.POSITION_DATA).data;
                var positionStride = renderable.getVertexData(SubGeometry.POSITION_DATA).dataPerVertex;
                var positionOffset = renderable.getVertexOffset(SubGeometry.POSITION_DATA);
                var uvData = renderable.getVertexData(SubGeometry.UV_DATA).data;
                var uvStride = renderable.getVertexData(SubGeometry.UV_DATA).dataPerVertex;
                var uvOffset = renderable.getVertexOffset(SubGeometry.UV_DATA);
                var numIndices = indexData.length;

                for (var index = 0; index < numIndices; index += 3) {
                    // evaluate triangle indices
                    i0 = positionOffset + indexData[index] * positionStride;
                    i1 = positionOffset + indexData[(index + 1)] * positionStride;
                    i2 = positionOffset + indexData[(index + 2)] * positionStride;

                    // evaluate triangle positions
                    p0x = positionData[i0];
                    p0y = positionData[(i0 + 1)];
                    p0z = positionData[(i0 + 2)];
                    p1x = positionData[i1];
                    p1y = positionData[(i1 + 1)];
                    p1z = positionData[(i1 + 2)];
                    p2x = positionData[i2];
                    p2y = positionData[(i2 + 1)];
                    p2z = positionData[(i2 + 2)];

                    // evaluate sides and triangle normal
                    s0x = p1x - p0x; // s0 = p1 - p0
                    s0y = p1y - p0y;
                    s0z = p1z - p0z;
                    s1x = p2x - p0x; // s1 = p2 - p0
                    s1y = p2y - p0y;
                    s1z = p2z - p0z;
                    nx = s0y * s1z - s0z * s1y; // n = s0 x s1
                    ny = s0z * s1x - s0x * s1z;
                    nz = s0x * s1y - s0y * s1x;
                    nl = 1 / Math.sqrt(nx * nx + ny * ny + nz * nz); // normalize n
                    nx *= nl;
                    ny *= nl;
                    nz *= nl;

                    // -- plane intersection test --
                    nDotV = nx * this.rayDirection.x + ny * +this.rayDirection.y + nz * this.rayDirection.z; // rayDirection . normal
                    if ((!bothSides && nDotV < 0.0) || (bothSides && nDotV != 0.0)) {
                        // find collision t
                        D = -(nx * p0x + ny * p0y + nz * p0z);
                        disToPlane = -(nx * this.rayPosition.x + ny * this.rayPosition.y + nz * this.rayPosition.z + D);
                        t = disToPlane / nDotV;

                        // find collision point
                        cx = this.rayPosition.x + t * this.rayDirection.x;
                        cy = this.rayPosition.y + t * this.rayDirection.y;
                        cz = this.rayPosition.z + t * this.rayDirection.z;

                        // collision point inside triangle? ( using barycentric coordinates )
                        Q1Q2 = s0x * s1x + s0y * s1y + s0z * s1z;
                        Q1Q1 = s0x * s0x + s0y * s0y + s0z * s0z;
                        Q2Q2 = s1x * s1x + s1y * s1y + s1z * s1z;
                        rx = cx - p0x;
                        ry = cy - p0y;
                        rz = cz - p0z;
                        RQ1 = rx * s0x + ry * s0y + rz * s0z;
                        RQ2 = rx * s1x + ry * s1y + rz * s1z;
                        coeff = 1 / (Q1Q1 * Q2Q2 - Q1Q2 * Q1Q2);
                        v = coeff * (Q2Q2 * RQ1 - Q1Q2 * RQ2);
                        w = coeff * (-Q1Q2 * RQ1 + Q1Q1 * RQ2);
                        if (v < 0)
                            continue;
                        if (w < 0)
                            continue;
                        u = 1 - v - w;
                        if (!(u < 0) && t > 0 && t < shortestCollisionDistance) {
                            shortestCollisionDistance = t;
                            collisionTriangleIndex = index / 3;
                            pickingCollisionVO.rayEntryDistance = t;
                            pickingCollisionVO.localPosition = new away.geom.Vector3D(cx, cy, cz);
                            pickingCollisionVO.localNormal = new away.geom.Vector3D(nx, ny, nz);
                            pickingCollisionVO.uv = this._pGetCollisionUV(indexData, uvData, index, v, w, u, uvOffset, uvStride);
                            pickingCollisionVO.index = index;

                            //						pickingCollisionVO.subGeometryIndex = this.pGetMeshSubMeshIndex(renderable);
                            // if not looking for best hit, first found will do...
                            if (!this._findClosestCollision)
                                return true;
                        }
                    }
                }

                if (collisionTriangleIndex >= 0)
                    return true;

                return false;
            };
            return JSPickingCollider;
        })(pick.PickingColliderBase);
        pick.JSPickingCollider = JSPickingCollider;
    })(away.pick || (away.pick = {}));
    var pick = away.pick;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    /**
    * @module away.pick
    */
    (function (pick) {
        var BitmapData = away.base.BitmapData;

        var TriangleSubGeometry = away.base.TriangleSubGeometry;

        var Matrix3DUtils = away.geom.Matrix3DUtils;
        var Point = away.geom.Point;
        var Rectangle = away.geom.Rectangle;
        var Vector3D = away.geom.Vector3D;

        var ContextGLBlendFactor = away.stagegl.ContextGLBlendFactor;
        var ContextGLClearMask = away.stagegl.ContextGLClearMask;
        var ContextGLCompareMode = away.stagegl.ContextGLCompareMode;
        var ContextGLProgramType = away.stagegl.ContextGLProgramType;
        var ContextGLTriangleFace = away.stagegl.ContextGLTriangleFace;

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
        var ShaderPicker = (function () {
            /**
            * Creates a new <code>ShaderPicker</code> object.
            *
            * @param shaderPickingDetails Determines whether the picker includes a second pass to calculate extra
            * properties such as uv and normal coordinates.
            */
            function ShaderPicker(shaderPickingDetails) {
                if (typeof shaderPickingDetails === "undefined") { shaderPickingDetails = false; }
                this._onlyMouseEnabled = true;
                this._interactives = new Array();
                this._localHitPosition = new Vector3D();
                this._hitUV = new Point();
                this._localHitNormal = new Vector3D();
                this._rayPos = new Vector3D();
                this._rayDir = new Vector3D();
                this._shaderPickingDetails = shaderPickingDetails;

                this._id = new Array(4);
                this._viewportData = new Array(4); // first 2 contain scale, last 2 translation
                this._boundOffsetScale = new Array(8); // first 2 contain scale, last 2 translation
                this._boundOffsetScale[3] = 0;
                this._boundOffsetScale[7] = 1;
            }
            Object.defineProperty(ShaderPicker.prototype, "onlyMouseEnabled", {
                /**
                * @inheritDoc
                */
                get: function () {
                    return this._onlyMouseEnabled;
                },
                set: function (value) {
                    this._onlyMouseEnabled = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            ShaderPicker.prototype.getViewCollision = function (x, y, view) {
                var collector = view.iEntityCollector;

                this._stage = view.renderer.stage;

                if (!this._stage)
                    return null;

                this._context = this._stage.context;

                this._viewportData[0] = view.width;
                this._viewportData[1] = view.height;
                this._viewportData[2] = -(this._projX = 2 * x / view.width - 1);
                this._viewportData[3] = this._projY = 2 * y / view.height - 1;

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

                var _collisionVO = this._hitEntity._iPickingCollisionVO;
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
            };

            //*/
            /**
            * @inheritDoc
            */
            ShaderPicker.prototype.getSceneCollision = function (position, direction, scene) {
                return null;
            };

            /**
            * @inheritDoc
            */
            ShaderPicker.prototype.pDraw = function (entityCollector, target) {
                var camera = entityCollector.camera;

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
            };

            /**
            * Draw a list of renderables.
            * @param renderables The renderables to draw.
            * @param camera The camera for which to render.
            */
            ShaderPicker.prototype.drawRenderables = function (renderable, camera) {
                var matrix = Matrix3DUtils.CALCULATION_MATRIX;
                var viewProjection = camera.viewProjection;

                while (renderable) {
                    // it's possible that the renderable was already removed from the scene
                    if (!renderable.sourceEntity.scene || !renderable.sourceEntity._iIsMouseEnabled()) {
                        renderable = renderable.next;
                        continue;
                    }

                    this._potentialFound = true;

                    this._context.setCulling(renderable.materialOwner.material.bothSides ? ContextGLTriangleFace.NONE : ContextGLTriangleFace.BACK, camera.projection.coordinateSystem);

                    this._interactives[this._interactiveId++] = renderable;

                    // color code so that reading from bitmapdata will contain the correct value
                    this._id[1] = (this._interactiveId >> 8) / 255; // on green channel
                    this._id[2] = (this._interactiveId & 0xff) / 255; // on blue channel

                    matrix.copyFrom(renderable.sourceEntity.getRenderSceneTransform(camera));
                    matrix.append(viewProjection);
                    this._context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, matrix, true);
                    this._context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, this._id, 1);
                    this._context.activateBuffer(0, renderable.getVertexData(TriangleSubGeometry.POSITION_DATA), renderable.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);
                    this._context.drawTriangles(this._context.getIndexBuffer(renderable.getIndexData()), 0, renderable.numTriangles);

                    renderable = renderable.next;
                }
            };

            ShaderPicker.prototype.updateRay = function (camera) {
                this._rayPos = camera.scenePosition;

                this._rayDir = camera.getRay(this._projX, this._projY, 1);
                this._rayDir.normalize();
            };

            /**
            * Creates the Program that color-codes objects.
            */
            ShaderPicker.prototype.initObjectProgram = function () {
                var vertexCode;
                var fragmentCode;

                this._objectProgram = this._context.createProgram();

                vertexCode = "m44 vt0, va0, vc0			\n" + "mul vt1.xy, vt0.w, vc4.zw	\n" + "add vt0.xy, vt0.xy, vt1.xy	\n" + "mul vt0.xy, vt0.xy, vc4.xy	\n" + "mov op, vt0	\n";
                fragmentCode = "mov oc, fc0"; // write identifier

                away.Debug.throwPIR('ShaderPicker', 'initTriangleProgram', 'Dependency: initObjectProgram');
                //_objectProgram.upload(new AGALMiniAssembler().assemble(ContextGLProgramType.VERTEX, vertexCode),new AGALMiniAssembler().assemble(ContextGLProgramType.FRAGMENT, fragmentCode));
            };

            /**
            * Creates the Program that renders positions.
            */
            ShaderPicker.prototype.initTriangleProgram = function () {
                var vertexCode;
                var fragmentCode;

                this._triangleProgram = this._context.createProgram();

                // todo: add animation code
                vertexCode = "add vt0, va0, vc5 			\n" + "mul vt0, vt0, vc6 			\n" + "mov v0, vt0				\n" + "m44 vt0, va0, vc0			\n" + "mul vt1.xy, vt0.w, vc4.zw	\n" + "add vt0.xy, vt0.xy, vt1.xy	\n" + "mul vt0.xy, vt0.xy, vc4.xy	\n" + "mov op, vt0	\n";
                fragmentCode = "mov oc, v0"; // write identifier

                var vertexByteCode = (new aglsl.assembler.AGALMiniAssembler().assemble("part vertex 1\n" + vertexCode + "endpart"))['vertex'].data;
                var fragmentByteCode = (new aglsl.assembler.AGALMiniAssembler().assemble("part fragment 1\n" + fragmentCode + "endpart"))['fragment'].data;
                this._triangleProgram.upload(vertexByteCode, fragmentByteCode);
            };

            /**
            * Gets more detailed information about the hir position, if required.
            * @param camera The camera used to view the hit object.
            */
            ShaderPicker.prototype.getHitDetails = function (camera) {
                this.getApproximatePosition(camera);
                this.getPreciseDetails(camera);
            };

            /**
            * Finds a first-guess approximate position about the hit position.
            *
            * @param camera The camera used to view the hit object.
            */
            ShaderPicker.prototype.getApproximatePosition = function (camera) {
                var bounds = this._hitRenderable.sourceEntity.bounds.aabb;
                var col;
                var scX, scY, scZ;
                var offsX, offsY, offsZ;
                var localViewProjection = Matrix3DUtils.CALCULATION_MATRIX;

                localViewProjection.copyFrom(this._hitRenderable.sourceEntity.getRenderSceneTransform(camera));
                localViewProjection.append(camera.viewProjection);
                if (!this._triangleProgram) {
                    this.initTriangleProgram();
                }

                this._boundOffsetScale[4] = 1 / (scX = bounds.width);
                this._boundOffsetScale[5] = 1 / (scY = bounds.height);
                this._boundOffsetScale[6] = 1 / (scZ = bounds.depth);
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

                this._localHitPosition.x = ((col >> 16) & 0xff) * scX / 255 - offsX;
                this._localHitPosition.y = ((col >> 8) & 0xff) * scY / 255 - offsY;
                this._localHitPosition.z = (col & 0xff) * scZ / 255 - offsZ;
            };

            /**
            * Use the approximate position info to find the face under the mouse position from which we can derive the precise
            * ray-face intersection point, then use barycentric coordinates to figure out the uv coordinates, etc.
            * @param camera The camera used to view the hit object.
            */
            ShaderPicker.prototype.getPreciseDetails = function (camera) {
                var len = indices.length;
                var x1, y1, z1;
                var x2, y2, z2;
                var x3, y3, z3;
                var i = 0, j = 1, k = 2;
                var t1, t2, t3;
                var v0x, v0y, v0z;
                var v1x, v1y, v1z;
                var v2x, v2y, v2z;
                var ni1, ni2, ni3;
                var n1, n2, n3, nLength;
                var dot00, dot01, dot02, dot11, dot12;
                var s, t, invDenom;
                var x = this._localHitPosition.x, y = this._localHitPosition.y, z = this._localHitPosition.z;
                var u, v;
                var ui1, ui2, ui3;
                var s0x, s0y, s0z;
                var s1x, s1y, s1z;
                var nl;
                var indices = this._hitRenderable.getIndexData().data;

                var positions = this._hitRenderable.getVertexData(TriangleSubGeometry.POSITION_DATA).data;
                var positionStride = this._hitRenderable.getVertexData(TriangleSubGeometry.POSITION_DATA).dataPerVertex;
                var positionOffset = this._hitRenderable.getVertexOffset(TriangleSubGeometry.POSITION_DATA);

                var uvs = this._hitRenderable.getVertexData(TriangleSubGeometry.UV_DATA).data;
                var uvStride = this._hitRenderable.getVertexData(TriangleSubGeometry.UV_DATA).dataPerVertex;
                var uvOffset = this._hitRenderable.getVertexOffset(TriangleSubGeometry.UV_DATA);

                var normals = this._hitRenderable.getVertexData(TriangleSubGeometry.NORMAL_DATA).data;
                var normalStride = this._hitRenderable.getVertexData(TriangleSubGeometry.NORMAL_DATA).dataPerVertex;
                var normalOffset = this._hitRenderable.getVertexOffset(TriangleSubGeometry.NORMAL_DATA);

                this.updateRay(camera);

                while (i < len) {
                    t1 = positionOffset + indices[i] * positionStride;
                    t2 = positionOffset + indices[j] * positionStride;
                    t3 = positionOffset + indices[k] * positionStride;
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
                    if (!((x < x1 && x < x2 && x < x3) || (y < y1 && y < y2 && y < y3) || (z < z1 && z < z2 && z < z3) || (x > x1 && x > x2 && x > x3) || (y > y1 && y > y2 && y > y3) || (z > z1 && z > z2 && z > z3))) {
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
                        dot00 = v0x * v0x + v0y * v0y + v0z * v0z;
                        dot01 = v0x * v1x + v0y * v1y + v0z * v1z;
                        dot02 = v0x * v2x + v0y * v2y + v0z * v2z;
                        dot11 = v1x * v1x + v1y * v1y + v1z * v1z;
                        dot12 = v1x * v2x + v1y * v2y + v1z * v2z;
                        invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
                        s = (dot11 * dot02 - dot01 * dot12) * invDenom;
                        t = (dot00 * dot12 - dot01 * dot02) * invDenom;

                        // if inside the current triangle, fetch details hit information
                        if (s >= 0 && t >= 0 && (s + t) <= 1) {
                            ni1 = normalOffset + indices[i] * normalStride;
                            ni2 = normalOffset + indices[j] * normalStride;
                            ni3 = normalOffset + indices[k] * normalStride;

                            n1 = indices[ni1] + indices[ni2] + indices[ni3];
                            n2 = indices[ni1 + 1] + indices[ni2 + 1] + indices[ni3 + 1];
                            n3 = indices[ni1 + 2] + indices[ni2 + 2] + indices[ni3 + 2];

                            nLength = Math.sqrt(n1 * n1 + n2 * n2 + n3 * n3);

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
                            this._localHitNormal.x = s0y * s1z - s0z * s1y; // n = s0 x s1
                            this._localHitNormal.y = s0z * s1x - s0x * s1z;
                            this._localHitNormal.z = s0x * s1y - s0y * s1x;
                            nl = 1 / Math.sqrt(this._localHitNormal.x * this._localHitNormal.x + this._localHitNormal.y * this._localHitNormal.y + this._localHitNormal.z * this._localHitNormal.z); // normalize n
                            this._localHitNormal.x *= nl;
                            this._localHitNormal.y *= nl;
                            this._localHitNormal.z *= nl;

                            dot02 = v0x * v2x + v0y * v2y + v0z * v2z;
                            dot12 = v1x * v2x + v1y * v2y + v1z * v2z;
                            s = (dot11 * dot02 - dot01 * dot12) * invDenom;
                            t = (dot00 * dot12 - dot01 * dot02) * invDenom;

                            ui1 = uvOffset + indices[i] * uvStride;
                            ui2 = uvOffset + indices[j] * uvStride;
                            ui3 = uvOffset + indices[k] * uvStride;

                            u = uvs[ui1];
                            v = uvs[ui1 + 1];
                            this._hitUV.x = u + t * (uvs[ui2] - u) + s * (uvs[ui3] - u);
                            this._hitUV.y = v + t * (uvs[ui2 + 1] - v) + s * (uvs[ui3 + 1] - v);

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
            };

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
            ShaderPicker.prototype.getPrecisePosition = function (invSceneTransform, nx, ny, nz, px, py, pz) {
                // calculate screen ray and find exact intersection position with triangle
                var rx, ry, rz;
                var ox, oy, oz;
                var t;
                var raw = Matrix3DUtils.RAW_DATA_CONTAINER;
                var cx = this._rayPos.x, cy = this._rayPos.y, cz = this._rayPos.z;

                // unprojected projection point, gives ray dir in cam space
                ox = this._rayDir.x;
                oy = this._rayDir.y;
                oz = this._rayDir.z;

                // transform ray dir and origin (cam pos) to object space
                //invSceneTransform.copyRawDataTo( raw  );
                invSceneTransform.copyRawDataTo(raw);
                rx = raw[0] * ox + raw[4] * oy + raw[8] * oz;
                ry = raw[1] * ox + raw[5] * oy + raw[9] * oz;
                rz = raw[2] * ox + raw[6] * oy + raw[10] * oz;

                ox = raw[0] * cx + raw[4] * cy + raw[8] * cz + raw[12];
                oy = raw[1] * cx + raw[5] * cy + raw[9] * cz + raw[13];
                oz = raw[2] * cx + raw[6] * cy + raw[10] * cz + raw[14];

                t = ((px - ox) * nx + (py - oy) * ny + (pz - oz) * nz) / (rx * nx + ry * ny + rz * nz);

                this._localHitPosition.x = ox + rx * t;
                this._localHitPosition.y = oy + ry * t;
                this._localHitPosition.z = oz + rz * t;
            };

            ShaderPicker.prototype.dispose = function () {
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
            };
            ShaderPicker.MOUSE_SCISSOR_RECT = new Rectangle(0, 0, 1, 1);
            return ShaderPicker;
        })();
        pick.ShaderPicker = ShaderPicker;
    })(away.pick || (away.pick = {}));
    var pick = away.pick;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * AmbientEnvMapMethod provides a diffuse shading method that uses a diffuse irradiance environment map to
        * approximate global lighting rather than lights.
        */
        var AmbientEnvMapMethod = (function (_super) {
            __extends(AmbientEnvMapMethod, _super);
            /**
            * Creates a new <code>AmbientEnvMapMethod</code> object.
            *
            * @param envMap The cube environment map to use for the ambient lighting.
            */
            function AmbientEnvMapMethod(envMap) {
                _super.call(this);
                this._cubeTexture = envMap;
            }
            /**
            * @inheritDoc
            */
            AmbientEnvMapMethod.prototype.iInitVO = function (shaderObject, methodVO) {
                _super.prototype.iInitVO.call(this, shaderObject, methodVO);

                methodVO.needsNormals = true;
            };

            Object.defineProperty(AmbientEnvMapMethod.prototype, "envMap", {
                /**
                * The cube environment map to use for the diffuse lighting.
                */
                get: function () {
                    return this._cubeTexture;
                },
                set: function (value) {
                    this._cubeTexture = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            AmbientEnvMapMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);

                stage.context.activateCubeTexture(methodVO.texturesIndex, this._cubeTexture);
            };

            /**
            * @inheritDoc
            */
            AmbientEnvMapMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, regCache, sharedRegisters) {
                var code = "";
                var ambientInputRegister;
                var cubeMapReg = regCache.getFreeTextureReg();
                methodVO.texturesIndex = cubeMapReg.index;

                code += materials.ShaderCompilerHelper.getTexCubeSampleCode(targetReg, cubeMapReg, this._cubeTexture, shaderObject.useSmoothTextures, shaderObject.useMipmapping, sharedRegisters.normalFragment);

                ambientInputRegister = regCache.getFreeFragmentConstant();
                methodVO.fragmentConstantsIndex = ambientInputRegister.index;

                code += "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + ambientInputRegister + ".xyz\n";

                return code;
            };
            return AmbientEnvMapMethod;
        })(materials.AmbientBasicMethod);
        materials.AmbientEnvMapMethod = AmbientEnvMapMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (materials) {
        var ShadingMethodEvent = away.events.ShadingMethodEvent;

        /**
        * DiffuseCompositeMethod provides a base class for diffuse methods that wrap a diffuse method to alter the
        * calculated diffuse reflection strength.
        */
        var DiffuseCompositeMethod = (function (_super) {
            __extends(DiffuseCompositeMethod, _super);
            /**
            * Creates a new <code>DiffuseCompositeMethod</code> object.
            *
            * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature clampDiffuse(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the diffuse strength.
            * @param baseMethod The base diffuse method on which this method's shading is based.
            */
            function DiffuseCompositeMethod(modulateMethod, baseMethod) {
                if (typeof baseMethod === "undefined") { baseMethod = null; }
                var _this = this;
                _super.call(this);

                this._onShaderInvalidatedDelegate = function (event) {
                    return _this.onShaderInvalidated(event);
                };

                this.pBaseMethod = baseMethod || new materials.DiffuseBasicMethod();
                this.pBaseMethod._iModulateMethod = modulateMethod;
                this.pBaseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
            }
            Object.defineProperty(DiffuseCompositeMethod.prototype, "baseMethod", {
                /**
                * The base diffuse method on which this method's shading is based.
                */
                get: function () {
                    return this.pBaseMethod;
                },
                set: function (value) {
                    if (this.pBaseMethod == value)
                        return;

                    this.pBaseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
                    this.pBaseMethod = value;
                    this.pBaseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
                    this.iInvalidateShaderProgram();
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            DiffuseCompositeMethod.prototype.iInitVO = function (shaderObject, methodVO) {
                this.pBaseMethod.iInitVO(shaderObject, methodVO);
            };

            /**
            * @inheritDoc
            */
            DiffuseCompositeMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
                this.pBaseMethod.iInitConstants(shaderObject, methodVO);
            };

            /**
            * @inheritDoc
            */
            DiffuseCompositeMethod.prototype.dispose = function () {
                this.pBaseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
                this.pBaseMethod.dispose();
            };

            Object.defineProperty(DiffuseCompositeMethod.prototype, "texture", {
                /**
                * @inheritDoc
                */
                get: function () {
                    return this.pBaseMethod.texture;
                },
                /**
                * @inheritDoc
                */
                set: function (value) {
                    this.pBaseMethod.texture = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DiffuseCompositeMethod.prototype, "diffuseColor", {
                /**
                * @inheritDoc
                */
                get: function () {
                    return this.pBaseMethod.diffuseColor;
                },
                /**
                * @inheritDoc
                */
                set: function (value) {
                    this.pBaseMethod.diffuseColor = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DiffuseCompositeMethod.prototype, "ambientColor", {
                /**
                * @inheritDoc
                */
                get: function () {
                    return this.pBaseMethod.ambientColor;
                },
                /**
                * @inheritDoc
                */
                set: function (value) {
                    this.pBaseMethod.ambientColor = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            DiffuseCompositeMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
                return this.pBaseMethod.iGetFragmentPreLightingCode(shaderObject, methodVO, registerCache, sharedRegisters);
            };

            /**
            * @inheritDoc
            */
            DiffuseCompositeMethod.prototype.iGetFragmentCodePerLight = function (shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
                var code = this.pBaseMethod.iGetFragmentCodePerLight(shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters);
                this._pTotalLightColorReg = this.pBaseMethod._pTotalLightColorReg;
                return code;
            };

            /**
            * @inheritDoc
            */
            DiffuseCompositeMethod.prototype.iGetFragmentCodePerProbe = function (shaderObject, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters) {
                var code = this.pBaseMethod.iGetFragmentCodePerProbe(shaderObject, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters);
                this._pTotalLightColorReg = this.pBaseMethod._pTotalLightColorReg;
                return code;
            };

            /**
            * @inheritDoc
            */
            DiffuseCompositeMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                this.pBaseMethod.iActivate(shaderObject, methodVO, stage);
            };

            /**
            * @inheritDoc
            */
            DiffuseCompositeMethod.prototype.iSetRenderState = function (shaderObject, methodVO, renderable, stage, camera) {
                this.pBaseMethod.iSetRenderState(shaderObject, methodVO, renderable, stage, camera);
            };

            /**
            * @inheritDoc
            */
            DiffuseCompositeMethod.prototype.iDeactivate = function (shaderObject, methodVO, stage) {
                this.pBaseMethod.iDeactivate(shaderObject, methodVO, stage);
            };

            /**
            * @inheritDoc
            */
            DiffuseCompositeMethod.prototype.iGetVertexCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
                return this.pBaseMethod.iGetVertexCode(shaderObject, methodVO, registerCache, sharedRegisters);
            };

            /**
            * @inheritDoc
            */
            DiffuseCompositeMethod.prototype.iGetFragmentPostLightingCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                return this.pBaseMethod.iGetFragmentPostLightingCode(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
            };

            /**
            * @inheritDoc
            */
            DiffuseCompositeMethod.prototype.iReset = function () {
                this.pBaseMethod.iReset();
            };

            /**
            * @inheritDoc
            */
            DiffuseCompositeMethod.prototype.iCleanCompilationData = function () {
                _super.prototype.iCleanCompilationData.call(this);
                this.pBaseMethod.iCleanCompilationData();
            };

            /**
            * Called when the base method's shader code is invalidated.
            */
            DiffuseCompositeMethod.prototype.onShaderInvalidated = function (event) {
                this.iInvalidateShaderProgram();
            };
            return DiffuseCompositeMethod;
        })(materials.DiffuseBasicMethod);
        materials.DiffuseCompositeMethod = DiffuseCompositeMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * DiffuseCelMethod provides a shading method to add diffuse cel (cartoon) shading.
        */
        var DiffuseCelMethod = (function (_super) {
            __extends(DiffuseCelMethod, _super);
            /**
            * Creates a new DiffuseCelMethod object.
            * @param levels The amount of shadow gradations.
            * @param baseMethod An optional diffuse method on which the cartoon shading is based. If omitted, DiffuseBasicMethod is used.
            */
            function DiffuseCelMethod(levels, baseMethod) {
                if (typeof levels === "undefined") { levels = 3; }
                if (typeof baseMethod === "undefined") { baseMethod = null; }
                var _this = this;
                _super.call(this, null, baseMethod);
                this._smoothness = .1;

                this.baseMethod._iModulateMethod = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                    return _this.clampDiffuse(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
                };

                this._levels = levels;
            }
            /**
            * @inheritDoc
            */
            DiffuseCelMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
                var data = shaderObject.fragmentConstantData;
                var index = methodVO.secondaryFragmentConstantsIndex;
                _super.prototype.iInitConstants.call(this, shaderObject, methodVO);
                data[index + 1] = 1;
                data[index + 2] = 0;
            };

            Object.defineProperty(DiffuseCelMethod.prototype, "levels", {
                /**
                * The amount of shadow gradations.
                */
                get: function () {
                    return this._levels;
                },
                set: function (value /*uint*/ ) {
                    this._levels = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DiffuseCelMethod.prototype, "smoothness", {
                /**
                * The smoothness of the edge between 2 shading levels.
                */
                get: function () {
                    return this._smoothness;
                },
                set: function (value) {
                    this._smoothness = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            DiffuseCelMethod.prototype.iCleanCompilationData = function () {
                _super.prototype.iCleanCompilationData.call(this);
                this._dataReg = null;
            };

            /**
            * @inheritDoc
            */
            DiffuseCelMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
                this._dataReg = registerCache.getFreeFragmentConstant();
                methodVO.secondaryFragmentConstantsIndex = this._dataReg.index * 4;

                return _super.prototype.iGetFragmentPreLightingCode.call(this, shaderObject, methodVO, registerCache, sharedRegisters);
            };

            /**
            * @inheritDoc
            */
            DiffuseCelMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
                var data = shaderObject.fragmentConstantData;
                var index = methodVO.secondaryFragmentConstantsIndex;
                data[index] = this._levels;
                data[index + 3] = this._smoothness;
            };

            /**
            * Snaps the diffuse shading of the wrapped method to one of the levels.
            * @param vo The MethodVO used to compile the current shader.
            * @param t The register containing the diffuse strength in the "w" component.
            * @param regCache The register cache used for the shader compilation.
            * @param sharedRegisters The shared register data for this shader.
            * @return The AGAL fragment code for the method.
            */
            DiffuseCelMethod.prototype.clampDiffuse = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                return "mul " + targetReg + ".w, " + targetReg + ".w, " + this._dataReg + ".x\n" + "frc " + targetReg + ".z, " + targetReg + ".w\n" + "sub " + targetReg + ".y, " + targetReg + ".w, " + targetReg + ".z\n" + "mov " + targetReg + ".x, " + this._dataReg + ".x\n" + "sub " + targetReg + ".x, " + targetReg + ".x, " + this._dataReg + ".y\n" + "rcp " + targetReg + ".x," + targetReg + ".x\n" + "mul " + targetReg + ".w, " + targetReg + ".y, " + targetReg + ".x\n" + "sub " + targetReg + ".y, " + targetReg + ".w, " + targetReg + ".x\n" + "div " + targetReg + ".z, " + targetReg + ".z, " + this._dataReg + ".w\n" + "sat " + targetReg + ".z, " + targetReg + ".z\n" + "mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".z\n" + "sub " + targetReg + ".z, " + this._dataReg + ".y, " + targetReg + ".z\n" + "mul " + targetReg + ".y, " + targetReg + ".y, " + targetReg + ".z\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n" + "sat " + targetReg + ".w, " + targetReg + ".w\n";
            };
            return DiffuseCelMethod;
        })(materials.DiffuseCompositeMethod);
        materials.DiffuseCelMethod = DiffuseCelMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * DiffuseDepthMethod provides a debug method to visualise depth maps
        */
        var DiffuseDepthMethod = (function (_super) {
            __extends(DiffuseDepthMethod, _super);
            /**
            * Creates a new DiffuseBasicMethod object.
            */
            function DiffuseDepthMethod() {
                _super.call(this);
            }
            /**
            * @inheritDoc
            */
            DiffuseDepthMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
                var data = shaderObject.fragmentConstantData;
                var index = methodVO.fragmentConstantsIndex;
                data[index] = 1.0;
                data[index + 1] = 1 / 255.0;
                data[index + 2] = 1 / 65025.0;
                data[index + 3] = 1 / 16581375.0;
            };

            /**
            * @inheritDoc
            */
            DiffuseDepthMethod.prototype.iGetFragmentPostLightingCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                var code = "";
                var temp;
                var decReg;

                if (!this._pUseTexture)
                    throw new Error("DiffuseDepthMethod requires texture!");

                // incorporate input from ambient
                if (shaderObject.numLights > 0) {
                    if (sharedRegisters.shadowTarget)
                        code += "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + sharedRegisters.shadowTarget + ".w\n";
                    code += "add " + targetReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + targetReg + ".xyz\n" + "sat " + targetReg + ".xyz, " + targetReg + ".xyz\n";
                    registerCache.removeFragmentTempUsage(this._pTotalLightColorReg);
                }

                temp = shaderObject.numLights > 0 ? registerCache.getFreeFragmentVectorTemp() : targetReg;

                this._pDiffuseInputRegister = registerCache.getFreeTextureReg();
                methodVO.texturesIndex = this._pDiffuseInputRegister.index;
                decReg = registerCache.getFreeFragmentConstant();
                methodVO.fragmentConstantsIndex = decReg.index * 4;
                code += materials.ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, this._pDiffuseInputRegister, this.texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping) + "dp4 " + temp + ".x, " + temp + ", " + decReg + "\n" + "mov " + temp + ".yz, " + temp + ".xx			\n" + "mov " + temp + ".w, " + decReg + ".x\n" + "sub " + temp + ".xyz, " + decReg + ".xxx, " + temp + ".xyz\n";

                if (shaderObject.numLights == 0)
                    return code;

                code += "mul " + targetReg + ".xyz, " + temp + ".xyz, " + targetReg + ".xyz\n" + "mov " + targetReg + ".w, " + temp + ".w\n";

                return code;
            };
            return DiffuseDepthMethod;
        })(materials.DiffuseBasicMethod);
        materials.DiffuseDepthMethod = DiffuseDepthMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * DiffuseGradientMethod is an alternative to DiffuseBasicMethod in which the shading can be modulated with a gradient
        * to introduce color-tinted shading as opposed to the single-channel diffuse strength. This can be used as a crude
        * approximation to subsurface scattering (for instance, the mid-range shading for skin can be tinted red to similate
        * scattered light within the skin attributing to the final colour)
        */
        var DiffuseGradientMethod = (function (_super) {
            __extends(DiffuseGradientMethod, _super);
            /**
            * Creates a new DiffuseGradientMethod object.
            * @param gradient A texture that contains the light colour based on the angle. This can be used to change
            * the light colour due to subsurface scattering when the surface faces away from the light.
            */
            function DiffuseGradientMethod(gradient) {
                _super.call(this);

                this._gradient = gradient;
            }
            Object.defineProperty(DiffuseGradientMethod.prototype, "gradient", {
                /**
                * A texture that contains the light colour based on the angle. This can be used to change the light colour
                * due to subsurface scattering when the surface faces away from the light.
                */
                get: function () {
                    return this._gradient;
                },
                set: function (value) {
                    if (value.hasMipmaps != this._gradient.hasMipmaps || value.format != this._gradient.format)
                        this.iInvalidateShaderProgram();
                    this._gradient = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            DiffuseGradientMethod.prototype.iCleanCompilationData = function () {
                _super.prototype.iCleanCompilationData.call(this);
                this._gradientTextureRegister = null;
            };

            /**
            * @inheritDoc
            */
            DiffuseGradientMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
                var code = _super.prototype.iGetFragmentPreLightingCode.call(this, shaderObject, methodVO, registerCache, sharedRegisters);
                this._pIsFirstLight = true;

                if (shaderObject.numLights > 0) {
                    this._gradientTextureRegister = registerCache.getFreeTextureReg();
                    methodVO.secondaryTexturesIndex = this._gradientTextureRegister.index;
                }
                return code;
            };

            /**
            * @inheritDoc
            */
            DiffuseGradientMethod.prototype.iGetFragmentCodePerLight = function (shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
                var code = "";
                var t;

                // write in temporary if not first light, so we can add to total diffuse colour
                if (this._pIsFirstLight)
                    t = this._pTotalLightColorReg;
                else {
                    t = registerCache.getFreeFragmentVectorTemp();
                    registerCache.addFragmentTempUsages(t, 1);
                }

                code += "dp3 " + t + ".w, " + lightDirReg + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" + "mul " + t + ".w, " + t + ".w, " + sharedRegisters.commons + ".x\n" + "add " + t + ".w, " + t + ".w, " + sharedRegisters.commons + ".x\n" + "mul " + t + ".xyz, " + t + ".w, " + lightDirReg + ".w\n";

                if (this._iModulateMethod != null)
                    code += this._iModulateMethod(shaderObject, methodVO, t, registerCache, sharedRegisters);

                code += materials.ShaderCompilerHelper.getTex2DSampleCode(t, sharedRegisters, this._gradientTextureRegister, this._gradient, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, t, "clamp") + "mul " + t + ".xyz, " + t + ".xyz, " + lightColReg + ".xyz\n";

                if (!this._pIsFirstLight) {
                    code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + t + ".xyz\n";
                    registerCache.removeFragmentTempUsage(t);
                }

                this._pIsFirstLight = false;

                return code;
            };

            /**
            * @inheritDoc
            */
            DiffuseGradientMethod.prototype.pApplyShadow = function (shaderObject, methodVO, regCache, sharedRegisters) {
                var t = regCache.getFreeFragmentVectorTemp();

                return "mov " + t + ", " + sharedRegisters.shadowTarget + ".wwww\n" + materials.ShaderCompilerHelper.getTex2DSampleCode(t, sharedRegisters, this._gradientTextureRegister, this._gradient, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, t, "clamp") + "mul " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ", " + t + "\n";
            };

            /**
            * @inheritDoc
            */
            DiffuseGradientMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);

                stage.context.activateTexture(methodVO.secondaryTexturesIndex, this._gradient);
            };
            return DiffuseGradientMethod;
        })(materials.DiffuseBasicMethod);
        materials.DiffuseGradientMethod = DiffuseGradientMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * DiffuseLightMapMethod provides a diffuse shading method that uses a light map to modulate the calculated diffuse
        * lighting. It is different from EffectLightMapMethod in that the latter modulates the entire calculated pixel color, rather
        * than only the diffuse lighting value.
        */
        var DiffuseLightMapMethod = (function (_super) {
            __extends(DiffuseLightMapMethod, _super);
            /**
            * Creates a new DiffuseLightMapMethod method.
            *
            * @param lightMap The texture containing the light map.
            * @param blendMode The blend mode with which the light map should be applied to the lighting result.
            * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
            * @param baseMethod The diffuse method used to calculate the regular diffuse-based lighting.
            */
            function DiffuseLightMapMethod(lightMap, blendMode, useSecondaryUV, baseMethod) {
                if (typeof blendMode === "undefined") { blendMode = "multiply"; }
                if (typeof useSecondaryUV === "undefined") { useSecondaryUV = false; }
                if (typeof baseMethod === "undefined") { baseMethod = null; }
                _super.call(this, null, baseMethod);

                this._useSecondaryUV = useSecondaryUV;
                this._lightMapTexture = lightMap;
                this.blendMode = blendMode;
            }
            /**
            * @inheritDoc
            */
            DiffuseLightMapMethod.prototype.iInitVO = function (shaderObject, methodVO) {
                methodVO.needsSecondaryUV = this._useSecondaryUV;
                methodVO.needsUV = !this._useSecondaryUV;
            };

            Object.defineProperty(DiffuseLightMapMethod.prototype, "blendMode", {
                /**
                * The blend mode with which the light map should be applied to the lighting result.
                *
                * @see DiffuseLightMapMethod.ADD
                * @see DiffuseLightMapMethod.MULTIPLY
                */
                get: function () {
                    return this._blendMode;
                },
                set: function (value) {
                    if (value != DiffuseLightMapMethod.ADD && value != DiffuseLightMapMethod.MULTIPLY)
                        throw new Error("Unknown blendmode!");

                    if (this._blendMode == value)
                        return;

                    this._blendMode = value;

                    this.iInvalidateShaderProgram();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DiffuseLightMapMethod.prototype, "lightMapTexture", {
                /**
                * The texture containing the light map data.
                */
                get: function () {
                    return this._lightMapTexture;
                },
                set: function (value) {
                    this._lightMapTexture = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            DiffuseLightMapMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                stage.context.activateTexture(methodVO.secondaryTexturesIndex, this._lightMapTexture);

                _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
            };

            /**
            * @inheritDoc
            */
            DiffuseLightMapMethod.prototype.iGetFragmentPostLightingCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                var code;
                var lightMapReg = registerCache.getFreeTextureReg();
                var temp = registerCache.getFreeFragmentVectorTemp();
                methodVO.secondaryTexturesIndex = lightMapReg.index;

                code = materials.ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, lightMapReg, this._lightMapTexture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, sharedRegisters.secondaryUVVarying);

                switch (this._blendMode) {
                    case DiffuseLightMapMethod.MULTIPLY:
                        code += "mul " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + ", " + temp + "\n";
                        break;
                    case DiffuseLightMapMethod.ADD:
                        code += "add " + this._pTotalLightColorReg + ", " + this._pTotalLightColorReg + ", " + temp + "\n";
                        break;
                }

                code += _super.prototype.iGetFragmentPostLightingCode.call(this, shaderObject, methodVO, targetReg, registerCache, sharedRegisters);

                return code;
            };
            DiffuseLightMapMethod.MULTIPLY = "multiply";

            DiffuseLightMapMethod.ADD = "add";
            return DiffuseLightMapMethod;
        })(materials.DiffuseCompositeMethod);
        materials.DiffuseLightMapMethod = DiffuseLightMapMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * DiffuseWrapMethod is an alternative to DiffuseBasicMethod in which the light is allowed to be "wrapped around" the normally dark area, to some extent.
        * It can be used as a crude approximation to Oren-Nayar or simple subsurface scattering.
        */
        var DiffuseWrapMethod = (function (_super) {
            __extends(DiffuseWrapMethod, _super);
            /**
            * Creates a new DiffuseWrapMethod object.
            * @param wrapFactor A factor to indicate the amount by which the light is allowed to wrap
            */
            function DiffuseWrapMethod(wrapFactor) {
                if (typeof wrapFactor === "undefined") { wrapFactor = .5; }
                _super.call(this);

                this.wrapFactor = wrapFactor;
            }
            /**
            * @inheritDoc
            */
            DiffuseWrapMethod.prototype.iCleanCompilationData = function () {
                _super.prototype.iCleanCompilationData.call(this);

                this._wrapDataRegister = null;
            };

            Object.defineProperty(DiffuseWrapMethod.prototype, "wrapFactor", {
                /**
                * A factor to indicate the amount by which the light is allowed to wrap.
                */
                get: function () {
                    return this._wrapFactor;
                },
                set: function (value) {
                    this._wrapFactor = value;
                    this._wrapFactor = 1 / (value + 1);
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            DiffuseWrapMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
                var code = _super.prototype.iGetFragmentPreLightingCode.call(this, shaderObject, methodVO, registerCache, sharedRegisters);
                this._pIsFirstLight = true;
                this._wrapDataRegister = registerCache.getFreeFragmentConstant();
                methodVO.secondaryFragmentConstantsIndex = this._wrapDataRegister.index * 4;

                return code;
            };

            /**
            * @inheritDoc
            */
            DiffuseWrapMethod.prototype.iGetFragmentCodePerLight = function (shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
                var code = "";
                var t;

                // write in temporary if not first light, so we can add to total diffuse colour
                if (this._pIsFirstLight) {
                    t = this._pTotalLightColorReg;
                } else {
                    t = registerCache.getFreeFragmentVectorTemp();
                    registerCache.addFragmentTempUsages(t, 1);
                }

                code += "dp3 " + t + ".x, " + lightDirReg + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" + "add " + t + ".y, " + t + ".x, " + this._wrapDataRegister + ".x\n" + "mul " + t + ".y, " + t + ".y, " + this._wrapDataRegister + ".y\n" + "sat " + t + ".w, " + t + ".y\n" + "mul " + t + ".xz, " + t + ".w, " + lightDirReg + ".wz\n";

                if (this._iModulateMethod != null)
                    code += this._iModulateMethod(shaderObject, methodVO, lightDirReg, registerCache, sharedRegisters);

                code += "mul " + t + ", " + t + ".x, " + lightColReg + "\n";

                if (!this._pIsFirstLight) {
                    code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + t + ".xyz\n";
                    registerCache.removeFragmentTempUsage(t);
                }

                this._pIsFirstLight = false;

                return code;
            };

            /**
            * @inheritDoc
            */
            DiffuseWrapMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);

                var index = methodVO.secondaryFragmentConstantsIndex;
                var data = shaderObject.fragmentConstantData;
                data[index] = this._wrapFactor;
                data[index + 1] = 1 / (this._wrapFactor + 1);
            };
            return DiffuseWrapMethod;
        })(materials.DiffuseBasicMethod);
        materials.DiffuseWrapMethod = DiffuseWrapMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * EffectAlphaMaskMethod allows the use of an additional texture to specify the alpha value of the material. When used
        * with the secondary uv set, it allows for a tiled main texture with independently varying alpha (useful for water
        * etc).
        */
        var EffectAlphaMaskMethod = (function (_super) {
            __extends(EffectAlphaMaskMethod, _super);
            /**
            * Creates a new EffectAlphaMaskMethod object.
            *
            * @param texture The texture to use as the alpha mask.
            * @param useSecondaryUV Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently.
            */
            function EffectAlphaMaskMethod(texture, useSecondaryUV) {
                if (typeof useSecondaryUV === "undefined") { useSecondaryUV = false; }
                _super.call(this);

                this._texture = texture;
                this._useSecondaryUV = useSecondaryUV;
            }
            /**
            * @inheritDoc
            */
            EffectAlphaMaskMethod.prototype.iInitVO = function (shaderObject, methodVO) {
                methodVO.needsSecondaryUV = this._useSecondaryUV;
                methodVO.needsUV = !this._useSecondaryUV;
            };

            Object.defineProperty(EffectAlphaMaskMethod.prototype, "useSecondaryUV", {
                /**
                * Indicated whether or not the secondary uv set for the mask. This allows mapping alpha independently, for
                * instance to tile the main texture and normal map while providing untiled alpha, for example to define the
                * transparency over a tiled water surface.
                */
                get: function () {
                    return this._useSecondaryUV;
                },
                set: function (value) {
                    if (this._useSecondaryUV == value)
                        return;
                    this._useSecondaryUV = value;
                    this.iInvalidateShaderProgram();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(EffectAlphaMaskMethod.prototype, "texture", {
                /**
                * The texture to use as the alpha mask.
                */
                get: function () {
                    return this._texture;
                },
                set: function (value) {
                    this._texture = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            EffectAlphaMaskMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                stage.context.activateTexture(methodVO.texturesIndex, this._texture);
            };

            /**
            * @inheritDoc
            */
            EffectAlphaMaskMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                var textureReg = registerCache.getFreeTextureReg();
                var temp = registerCache.getFreeFragmentVectorTemp();
                var uvReg = this._useSecondaryUV ? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying;
                methodVO.texturesIndex = textureReg.index;

                return materials.ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, textureReg, this._texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, uvReg) + "mul " + targetReg + ", " + targetReg + ", " + temp + ".x\n";
            };
            return EffectAlphaMaskMethod;
        })(materials.EffectMethodBase);
        materials.EffectAlphaMaskMethod = EffectAlphaMaskMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * EffectColorMatrixMethod provides a shading method that changes the colour of a material analogous to a ColorMatrixFilter.
        */
        var EffectColorMatrixMethod = (function (_super) {
            __extends(EffectColorMatrixMethod, _super);
            /**
            * Creates a new EffectColorTransformMethod.
            *
            * @param matrix An array of 20 items for 4 x 5 color transform.
            */
            function EffectColorMatrixMethod(matrix) {
                _super.call(this);

                if (matrix.length != 20)
                    throw new Error("Matrix length must be 20!");

                this._matrix = matrix;
            }
            Object.defineProperty(EffectColorMatrixMethod.prototype, "colorMatrix", {
                /**
                * The 4 x 5 matrix to transform the color of the material.
                */
                get: function () {
                    return this._matrix;
                },
                set: function (value) {
                    this._matrix = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            EffectColorMatrixMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                var code = "";
                var colorMultReg = registerCache.getFreeFragmentConstant();
                registerCache.getFreeFragmentConstant();
                registerCache.getFreeFragmentConstant();
                registerCache.getFreeFragmentConstant();

                var colorOffsetReg = registerCache.getFreeFragmentConstant();

                methodVO.fragmentConstantsIndex = colorMultReg.index * 4;

                var temp = registerCache.getFreeFragmentVectorTemp();

                code += "m44 " + temp + ", " + targetReg + ", " + colorMultReg + "\n" + "add " + targetReg + ", " + temp + ", " + colorOffsetReg + "\n";

                return code;
            };

            /**
            * @inheritDoc
            */
            EffectColorMatrixMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                var matrix = this._matrix;
                var index = methodVO.fragmentConstantsIndex;
                var data = shaderObject.fragmentConstantData;

                // r
                data[index] = matrix[0];
                data[index + 1] = matrix[1];
                data[index + 2] = matrix[2];
                data[index + 3] = matrix[3];

                // g
                data[index + 4] = matrix[5];
                data[index + 5] = matrix[6];
                data[index + 6] = matrix[7];
                data[index + 7] = matrix[8];

                // b
                data[index + 8] = matrix[10];
                data[index + 9] = matrix[11];
                data[index + 10] = matrix[12];
                data[index + 11] = matrix[13];

                // a
                data[index + 12] = matrix[15];
                data[index + 13] = matrix[16];
                data[index + 14] = matrix[17];
                data[index + 15] = matrix[18];

                // rgba offset
                data[index + 16] = matrix[4];
                data[index + 17] = matrix[9];
                data[index + 18] = matrix[14];
                data[index + 19] = matrix[19];
            };
            return EffectColorMatrixMethod;
        })(materials.EffectMethodBase);
        materials.EffectColorMatrixMethod = EffectColorMatrixMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * EffectEnvMapMethod provides a material method to perform reflection mapping using cube maps.
        */
        var EffectEnvMapMethod = (function (_super) {
            __extends(EffectEnvMapMethod, _super);
            /**
            * Creates an EffectEnvMapMethod object.
            * @param envMap The environment map containing the reflected scene.
            * @param alpha The reflectivity of the surface.
            */
            function EffectEnvMapMethod(envMap, alpha) {
                if (typeof alpha === "undefined") { alpha = 1; }
                _super.call(this);
                this._cubeTexture = envMap;
                this._alpha = alpha;
            }
            Object.defineProperty(EffectEnvMapMethod.prototype, "mask", {
                /**
                * An optional texture to modulate the reflectivity of the surface.
                */
                get: function () {
                    return this._mask;
                },
                set: function (value) {
                    if (value != this._mask || (value && this._mask && (value.hasMipmaps != this._mask.hasMipmaps || value.format != this._mask.format)))
                        this.iInvalidateShaderProgram();

                    this._mask = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            EffectEnvMapMethod.prototype.iInitVO = function (shaderObject, methodVO) {
                methodVO.needsNormals = true;
                methodVO.needsView = true;
                methodVO.needsUV = this._mask != null;
            };

            Object.defineProperty(EffectEnvMapMethod.prototype, "envMap", {
                /**
                * The cubic environment map containing the reflected scene.
                */
                get: function () {
                    return this._cubeTexture;
                },
                set: function (value) {
                    this._cubeTexture = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            EffectEnvMapMethod.prototype.dispose = function () {
            };

            Object.defineProperty(EffectEnvMapMethod.prototype, "alpha", {
                /**
                * The reflectivity of the surface.
                */
                get: function () {
                    return this._alpha;
                },
                set: function (value) {
                    this._alpha = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            EffectEnvMapMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex] = this._alpha;

                stage.context.activateCubeTexture(methodVO.texturesIndex, this._cubeTexture);
                if (this._mask)
                    stage.context.activateTexture(methodVO.texturesIndex + 1, this._mask);
            };

            /**
            * @inheritDoc
            */
            EffectEnvMapMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                var dataRegister = registerCache.getFreeFragmentConstant();
                var temp = registerCache.getFreeFragmentVectorTemp();
                var code = "";
                var cubeMapReg = registerCache.getFreeTextureReg();

                methodVO.texturesIndex = cubeMapReg.index;
                methodVO.fragmentConstantsIndex = dataRegister.index * 4;

                registerCache.addFragmentTempUsages(temp, 1);
                var temp2 = registerCache.getFreeFragmentVectorTemp();

                // r = I - 2(I.N)*N
                code += "dp3 " + temp + ".w, " + sharedRegisters.viewDirFragment + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" + "add " + temp + ".w, " + temp + ".w, " + temp + ".w\n" + "mul " + temp + ".xyz, " + sharedRegisters.normalFragment + ".xyz, " + temp + ".w\n" + "sub " + temp + ".xyz, " + temp + ".xyz, " + sharedRegisters.viewDirFragment + ".xyz\n" + materials.ShaderCompilerHelper.getTexCubeSampleCode(temp, cubeMapReg, this._cubeTexture, shaderObject.useSmoothTextures, shaderObject.useMipmapping, temp) + "sub " + temp2 + ".w, " + temp + ".w, fc0.x\n" + "kil " + temp2 + ".w\n" + "sub " + temp + ", " + temp + ", " + targetReg + "\n";

                if (this._mask)
                    code += materials.ShaderCompilerHelper.getTex2DSampleCode(temp2, sharedRegisters, registerCache.getFreeTextureReg(), this._mask, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping) + "mul " + temp + ", " + temp2 + ", " + temp + "\n";

                code += "mul " + temp + ", " + temp + ", " + dataRegister + ".x\n" + "add " + targetReg + ", " + targetReg + ", " + temp + "\n";

                registerCache.removeFragmentTempUsage(temp);

                return code;
            };
            return EffectEnvMapMethod;
        })(materials.EffectMethodBase);
        materials.EffectEnvMapMethod = EffectEnvMapMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * EffectFogMethod provides a method to add distance-based fog to a material.
        */
        var EffectFogMethod = (function (_super) {
            __extends(EffectFogMethod, _super);
            /**
            * Creates a new EffectFogMethod object.
            * @param minDistance The distance from which the fog starts appearing.
            * @param maxDistance The distance at which the fog is densest.
            * @param fogColor The colour of the fog.
            */
            function EffectFogMethod(minDistance, maxDistance, fogColor) {
                if (typeof fogColor === "undefined") { fogColor = 0x808080; }
                _super.call(this);
                this._minDistance = 0;
                this._maxDistance = 1000;
                this.minDistance = minDistance;
                this.maxDistance = maxDistance;
                this.fogColor = fogColor;
            }
            /**
            * @inheritDoc
            */
            EffectFogMethod.prototype.iInitVO = function (shaderObject, methodVO) {
                methodVO.needsProjection = true;
            };

            /**
            * @inheritDoc
            */
            EffectFogMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
                var data = shaderObject.fragmentConstantData;
                var index = methodVO.fragmentConstantsIndex;
                data[index + 3] = 1;
                data[index + 6] = 0;
                data[index + 7] = 0;
            };

            Object.defineProperty(EffectFogMethod.prototype, "minDistance", {
                /**
                * The distance from which the fog starts appearing.
                */
                get: function () {
                    return this._minDistance;
                },
                set: function (value) {
                    this._minDistance = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(EffectFogMethod.prototype, "maxDistance", {
                /**
                * The distance at which the fog is densest.
                */
                get: function () {
                    return this._maxDistance;
                },
                set: function (value) {
                    this._maxDistance = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(EffectFogMethod.prototype, "fogColor", {
                /**
                * The colour of the fog.
                */
                get: function () {
                    return this._fogColor;
                },
                set: function (value /*uint*/ ) {
                    this._fogColor = value;
                    this._fogR = ((value >> 16) & 0xff) / 0xff;
                    this._fogG = ((value >> 8) & 0xff) / 0xff;
                    this._fogB = (value & 0xff) / 0xff;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            EffectFogMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                var data = shaderObject.fragmentConstantData;
                var index = methodVO.fragmentConstantsIndex;
                data[index] = this._fogR;
                data[index + 1] = this._fogG;
                data[index + 2] = this._fogB;
                data[index + 4] = this._minDistance;
                data[index + 5] = 1 / (this._maxDistance - this._minDistance);
            };

            /**
            * @inheritDoc
            */
            EffectFogMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                var fogColor = registerCache.getFreeFragmentConstant();
                var fogData = registerCache.getFreeFragmentConstant();
                var temp = registerCache.getFreeFragmentVectorTemp();
                registerCache.addFragmentTempUsages(temp, 1);
                var temp2 = registerCache.getFreeFragmentVectorTemp();
                var code = "";
                methodVO.fragmentConstantsIndex = fogColor.index * 4;

                code += "sub " + temp2 + ".w, " + sharedRegisters.projectionFragment + ".z, " + fogData + ".x\n" + "mul " + temp2 + ".w, " + temp2 + ".w, " + fogData + ".y\n" + "sat " + temp2 + ".w, " + temp2 + ".w\n" + "sub " + temp + ", " + fogColor + ", " + targetReg + "\n" + "mul " + temp + ", " + temp + ", " + temp2 + ".w\n" + "add " + targetReg + ", " + targetReg + ", " + temp + "\n"; // fogRatio*(fogColor- col) + col

                registerCache.removeFragmentTempUsage(temp);

                return code;
            };
            return EffectFogMethod;
        })(materials.EffectMethodBase);
        materials.EffectFogMethod = EffectFogMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * EffectFresnelEnvMapMethod provides a method to add fresnel-based reflectivity to an object using cube maps, which gets
        * stronger as the viewing angle becomes more grazing.
        */
        var EffectFresnelEnvMapMethod = (function (_super) {
            __extends(EffectFresnelEnvMapMethod, _super);
            /**
            * Creates a new <code>EffectFresnelEnvMapMethod</code> object.
            *
            * @param envMap The environment map containing the reflected scene.
            * @param alpha The reflectivity of the material.
            */
            function EffectFresnelEnvMapMethod(envMap, alpha) {
                if (typeof alpha === "undefined") { alpha = 1; }
                _super.call(this);
                this._fresnelPower = 5;
                this._normalReflectance = 0;

                this._cubeTexture = envMap;
                this._alpha = alpha;
            }
            /**
            * @inheritDoc
            */
            EffectFresnelEnvMapMethod.prototype.iInitVO = function (shaderObject, methodVO) {
                methodVO.needsNormals = true;
                methodVO.needsView = true;
                methodVO.needsUV = this._mask != null;
            };

            /**
            * @inheritDoc
            */
            EffectFresnelEnvMapMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
                shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex + 3] = 1;
            };

            Object.defineProperty(EffectFresnelEnvMapMethod.prototype, "mask", {
                /**
                * An optional texture to modulate the reflectivity of the surface.
                */
                get: function () {
                    return this._mask;
                },
                set: function (value) {
                    if (Boolean(value) != Boolean(this._mask) || (value && this._mask && (value.hasMipmaps != this._mask.hasMipmaps || value.format != this._mask.format))) {
                        this.iInvalidateShaderProgram();
                    }
                    this._mask = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(EffectFresnelEnvMapMethod.prototype, "fresnelPower", {
                /**
                * The power used in the Fresnel equation. Higher values make the fresnel effect more pronounced. Defaults to 5.
                */
                get: function () {
                    return this._fresnelPower;
                },
                set: function (value) {
                    this._fresnelPower = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(EffectFresnelEnvMapMethod.prototype, "envMap", {
                /**
                * The cubic environment map containing the reflected scene.
                */
                get: function () {
                    return this._cubeTexture;
                },
                set: function (value) {
                    this._cubeTexture = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(EffectFresnelEnvMapMethod.prototype, "alpha", {
                /**
                * The reflectivity of the surface.
                */
                get: function () {
                    return this._alpha;
                },
                set: function (value) {
                    this._alpha = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(EffectFresnelEnvMapMethod.prototype, "normalReflectance", {
                /**
                * The minimum amount of reflectance, ie the reflectance when the view direction is normal to the surface or light direction.
                */
                get: function () {
                    return this._normalReflectance;
                },
                set: function (value) {
                    this._normalReflectance = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            EffectFresnelEnvMapMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                var data = shaderObject.fragmentConstantData;
                var index = methodVO.fragmentConstantsIndex;
                data[index] = this._alpha;
                data[index + 1] = this._normalReflectance;
                data[index + 2] = this._fresnelPower;

                stage.context.activateCubeTexture(methodVO.texturesIndex, this._cubeTexture);

                if (this._mask)
                    stage.context.activateTexture(methodVO.texturesIndex + 1, this._mask);
            };

            /**
            * @inheritDoc
            */
            EffectFresnelEnvMapMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                var dataRegister = registerCache.getFreeFragmentConstant();
                var temp = registerCache.getFreeFragmentVectorTemp();
                var code = "";
                var cubeMapReg = registerCache.getFreeTextureReg();
                var viewDirReg = sharedRegisters.viewDirFragment;
                var normalReg = sharedRegisters.normalFragment;

                methodVO.texturesIndex = cubeMapReg.index;
                methodVO.fragmentConstantsIndex = dataRegister.index * 4;

                registerCache.addFragmentTempUsages(temp, 1);
                var temp2 = registerCache.getFreeFragmentVectorTemp();

                // r = V - 2(V.N)*N
                code += "dp3 " + temp + ".w, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" + "add " + temp + ".w, " + temp + ".w, " + temp + ".w\n" + "mul " + temp + ".xyz, " + normalReg + ".xyz, " + temp + ".w\n" + "sub " + temp + ".xyz, " + temp + ".xyz, " + viewDirReg + ".xyz\n" + materials.ShaderCompilerHelper.getTexCubeSampleCode(temp, cubeMapReg, this._cubeTexture, shaderObject.useSmoothTextures, shaderObject.useMipmapping, temp) + "sub " + temp2 + ".w, " + temp + ".w, fc0.x\n" + "kil " + temp2 + ".w\n" + "sub " + temp + ", " + temp + ", " + targetReg + "\n";

                // calculate fresnel term
                code += "dp3 " + viewDirReg + ".w, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" + "sub " + viewDirReg + ".w, " + dataRegister + ".w, " + viewDirReg + ".w\n" + "pow " + viewDirReg + ".w, " + viewDirReg + ".w, " + dataRegister + ".z\n" + "sub " + normalReg + ".w, " + dataRegister + ".w, " + viewDirReg + ".w\n" + "mul " + normalReg + ".w, " + dataRegister + ".y, " + normalReg + ".w\n" + "add " + viewDirReg + ".w, " + viewDirReg + ".w, " + normalReg + ".w\n" + "mul " + viewDirReg + ".w, " + dataRegister + ".x, " + viewDirReg + ".w\n";

                if (this._mask) {
                    var maskReg = registerCache.getFreeTextureReg();
                    code += materials.ShaderCompilerHelper.getTex2DSampleCode(temp2, sharedRegisters, maskReg, this._mask, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping) + "mul " + viewDirReg + ".w, " + temp2 + ".x, " + viewDirReg + ".w\n";
                }

                // blend
                code += "mul " + temp + ", " + temp + ", " + viewDirReg + ".w\n" + "add " + targetReg + ", " + targetReg + ", " + temp + "\n";

                registerCache.removeFragmentTempUsage(temp);

                return code;
            };
            return EffectFresnelEnvMapMethod;
        })(materials.EffectMethodBase);
        materials.EffectFresnelEnvMapMethod = EffectFresnelEnvMapMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * EffectLightMapMethod provides a method that allows applying a light map texture to the calculated pixel colour.
        * It is different from DiffuseLightMapMethod in that the latter only modulates the diffuse shading value rather
        * than the whole pixel colour.
        */
        var EffectLightMapMethod = (function (_super) {
            __extends(EffectLightMapMethod, _super);
            /**
            * Creates a new EffectLightMapMethod object.
            *
            * @param texture The texture containing the light map.
            * @param blendMode The blend mode with which the light map should be applied to the lighting result.
            * @param useSecondaryUV Indicates whether the secondary UV set should be used to map the light map.
            */
            function EffectLightMapMethod(texture, blendMode, useSecondaryUV) {
                if (typeof blendMode === "undefined") { blendMode = "multiply"; }
                if (typeof useSecondaryUV === "undefined") { useSecondaryUV = false; }
                _super.call(this);
                this._useSecondaryUV = useSecondaryUV;
                this._texture = texture;
                this.blendMode = blendMode;
            }
            /**
            * @inheritDoc
            */
            EffectLightMapMethod.prototype.iInitVO = function (shaderObject, methodVO) {
                methodVO.needsUV = !this._useSecondaryUV;
                methodVO.needsSecondaryUV = this._useSecondaryUV;
            };

            Object.defineProperty(EffectLightMapMethod.prototype, "blendMode", {
                /**
                * The blend mode with which the light map should be applied to the lighting result.
                *
                * @see EffectLightMapMethod.ADD
                * @see EffectLightMapMethod.MULTIPLY
                */
                get: function () {
                    return this._blendMode;
                },
                set: function (value) {
                    if (value != EffectLightMapMethod.ADD && value != EffectLightMapMethod.MULTIPLY)
                        throw new Error("Unknown blendmode!");
                    if (this._blendMode == value)
                        return;
                    this._blendMode = value;
                    this.iInvalidateShaderProgram();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(EffectLightMapMethod.prototype, "texture", {
                /**
                * The texture containing the light map.
                */
                get: function () {
                    return this._texture;
                },
                set: function (value) {
                    if (value.hasMipmaps != this._texture.hasMipmaps || value.format != this._texture.format)
                        this.iInvalidateShaderProgram();
                    this._texture = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            EffectLightMapMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                stage.context.activateTexture(methodVO.texturesIndex, this._texture);

                _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);
            };

            /**
            * @inheritDoc
            */
            EffectLightMapMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                var code;
                var lightMapReg = registerCache.getFreeTextureReg();
                var temp = registerCache.getFreeFragmentVectorTemp();
                methodVO.texturesIndex = lightMapReg.index;

                code = materials.ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, lightMapReg, this._texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, this._useSecondaryUV ? sharedRegisters.secondaryUVVarying : sharedRegisters.uvVarying);

                switch (this._blendMode) {
                    case EffectLightMapMethod.MULTIPLY:
                        code += "mul " + targetReg + ", " + targetReg + ", " + temp + "\n";
                        break;
                    case EffectLightMapMethod.ADD:
                        code += "add " + targetReg + ", " + targetReg + ", " + temp + "\n";
                        break;
                }

                return code;
            };
            EffectLightMapMethod.MULTIPLY = "multiply";

            EffectLightMapMethod.ADD = "add";
            return EffectLightMapMethod;
        })(materials.EffectMethodBase);
        materials.EffectLightMapMethod = EffectLightMapMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * EffectRefractionEnvMapMethod provides a method to add refracted transparency based on cube maps.
        */
        var EffectRefractionEnvMapMethod = (function (_super) {
            __extends(EffectRefractionEnvMapMethod, _super);
            /**
            * Creates a new EffectRefractionEnvMapMethod object. Example values for dispersion are: dispersionR: -0.03, dispersionG: -0.01, dispersionB: = .0015
            *
            * @param envMap The environment map containing the refracted scene.
            * @param refractionIndex The refractive index of the material.
            * @param dispersionR The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
            * @param dispersionG The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
            * @param dispersionB The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
            */
            function EffectRefractionEnvMapMethod(envMap, refractionIndex, dispersionR, dispersionG, dispersionB) {
                if (typeof refractionIndex === "undefined") { refractionIndex = .1; }
                if (typeof dispersionR === "undefined") { dispersionR = 0; }
                if (typeof dispersionG === "undefined") { dispersionG = 0; }
                if (typeof dispersionB === "undefined") { dispersionB = 0; }
                _super.call(this);
                this._dispersionR = 0;
                this._dispersionG = 0;
                this._dispersionB = 0;
                this._alpha = 1;
                this._envMap = envMap;
                this._dispersionR = dispersionR;
                this._dispersionG = dispersionG;
                this._dispersionB = dispersionB;
                this._useDispersion = !(this._dispersionR == this._dispersionB && this._dispersionR == this._dispersionG);
                this._refractionIndex = refractionIndex;
            }
            /**
            * @inheritDoc
            */
            EffectRefractionEnvMapMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
                var index = methodVO.fragmentConstantsIndex;
                var data = shaderObject.fragmentConstantData;
                data[index + 4] = 1;
                data[index + 5] = 0;
                data[index + 7] = 1;
            };

            /**
            * @inheritDoc
            */
            EffectRefractionEnvMapMethod.prototype.iInitVO = function (shaderObject, methodVO) {
                methodVO.needsNormals = true;
                methodVO.needsView = true;
            };

            Object.defineProperty(EffectRefractionEnvMapMethod.prototype, "envMap", {
                /**
                * The cube environment map to use for the refraction.
                */
                get: function () {
                    return this._envMap;
                },
                set: function (value) {
                    this._envMap = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(EffectRefractionEnvMapMethod.prototype, "refractionIndex", {
                /**
                * The refractive index of the material.
                */
                get: function () {
                    return this._refractionIndex;
                },
                set: function (value) {
                    this._refractionIndex = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(EffectRefractionEnvMapMethod.prototype, "dispersionR", {
                /**
                * The amount of chromatic dispersion of the red channel. Defaults to 0 (none).
                */
                get: function () {
                    return this._dispersionR;
                },
                set: function (value) {
                    this._dispersionR = value;

                    var useDispersion = !(this._dispersionR == this._dispersionB && this._dispersionR == this._dispersionG);
                    if (this._useDispersion != useDispersion) {
                        this.iInvalidateShaderProgram();
                        this._useDispersion = useDispersion;
                    }
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(EffectRefractionEnvMapMethod.prototype, "dispersionG", {
                /**
                * The amount of chromatic dispersion of the green channel. Defaults to 0 (none).
                */
                get: function () {
                    return this._dispersionG;
                },
                set: function (value) {
                    this._dispersionG = value;

                    var useDispersion = !(this._dispersionR == this._dispersionB && this._dispersionR == this._dispersionG);
                    if (this._useDispersion != useDispersion) {
                        this.iInvalidateShaderProgram();
                        this._useDispersion = useDispersion;
                    }
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(EffectRefractionEnvMapMethod.prototype, "dispersionB", {
                /**
                * The amount of chromatic dispersion of the blue channel. Defaults to 0 (none).
                */
                get: function () {
                    return this._dispersionB;
                },
                set: function (value) {
                    this._dispersionB = value;

                    var useDispersion = !(this._dispersionR == this._dispersionB && this._dispersionR == this._dispersionG);
                    if (this._useDispersion != useDispersion) {
                        this.iInvalidateShaderProgram();
                        this._useDispersion = useDispersion;
                    }
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(EffectRefractionEnvMapMethod.prototype, "alpha", {
                /**
                * The amount of transparency of the object. Warning: the alpha applies to the refracted color, not the actual
                * material. A value of 1 will make it appear fully transparent.
                */
                get: function () {
                    return this._alpha;
                },
                set: function (value) {
                    this._alpha = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            EffectRefractionEnvMapMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                var index = methodVO.fragmentConstantsIndex;
                var data = shaderObject.fragmentConstantData;

                data[index] = this._dispersionR + this._refractionIndex;

                if (this._useDispersion) {
                    data[index + 1] = this._dispersionG + this._refractionIndex;
                    data[index + 2] = this._dispersionB + this._refractionIndex;
                }
                data[index + 3] = this._alpha;

                stage.context.activateCubeTexture(methodVO.texturesIndex, this._envMap);
            };

            /**
            * @inheritDoc
            */
            EffectRefractionEnvMapMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                // todo: data2.x could use common reg, so only 1 reg is used
                var data = registerCache.getFreeFragmentConstant();
                var data2 = registerCache.getFreeFragmentConstant();
                var code = "";
                var cubeMapReg = registerCache.getFreeTextureReg();
                var refractionDir;
                var refractionColor;
                var temp;

                methodVO.texturesIndex = cubeMapReg.index;
                methodVO.fragmentConstantsIndex = data.index * 4;

                refractionDir = registerCache.getFreeFragmentVectorTemp();
                registerCache.addFragmentTempUsages(refractionDir, 1);
                refractionColor = registerCache.getFreeFragmentVectorTemp();
                registerCache.addFragmentTempUsages(refractionColor, 1);

                temp = registerCache.getFreeFragmentVectorTemp();

                var viewDirReg = sharedRegisters.viewDirFragment;
                var normalReg = sharedRegisters.normalFragment;

                code += "neg " + viewDirReg + ".xyz, " + viewDirReg + ".xyz\n";

                code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" + "mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" + "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" + "mul " + temp + ".w, " + data + ".x, " + temp + ".w\n" + "mul " + temp + ".w, " + data + ".x, " + temp + ".w\n" + "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" + "sqt " + temp + ".y, " + temp + ".w\n" + "mul " + temp + ".x, " + data + ".x, " + temp + ".x\n" + "add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" + "mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" + "mul " + refractionDir + ", " + data + ".x, " + viewDirReg + "\n" + "sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" + "nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n";
                code += materials.ShaderCompilerHelper.getTexCubeSampleCode(refractionColor, cubeMapReg, this._envMap, shaderObject.useSmoothTextures, shaderObject.useMipmapping, refractionDir) + "sub " + refractionColor + ".w, " + refractionColor + ".w, fc0.x	\n" + "kil " + refractionColor + ".w\n";

                if (this._useDispersion) {
                    // GREEN
                    code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" + "mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" + "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" + "mul " + temp + ".w, " + data + ".y, " + temp + ".w\n" + "mul " + temp + ".w, " + data + ".y, " + temp + ".w\n" + "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" + "sqt " + temp + ".y, " + temp + ".w\n" + "mul " + temp + ".x, " + data + ".y, " + temp + ".x\n" + "add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" + "mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" + "mul " + refractionDir + ", " + data + ".y, " + viewDirReg + "\n" + "sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" + "nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n";
                    code += materials.ShaderCompilerHelper.getTexCubeSampleCode(temp, cubeMapReg, this._envMap, shaderObject.useSmoothTextures, shaderObject.useMipmapping, refractionDir) + "mov " + refractionColor + ".y, " + temp + ".y\n";

                    // BLUE
                    code += "dp3 " + temp + ".x, " + viewDirReg + ".xyz, " + normalReg + ".xyz\n" + "mul " + temp + ".w, " + temp + ".x, " + temp + ".x\n" + "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" + "mul " + temp + ".w, " + data + ".z, " + temp + ".w\n" + "mul " + temp + ".w, " + data + ".z, " + temp + ".w\n" + "sub " + temp + ".w, " + data2 + ".x, " + temp + ".w\n" + "sqt " + temp + ".y, " + temp + ".w\n" + "mul " + temp + ".x, " + data + ".z, " + temp + ".x\n" + "add " + temp + ".x, " + temp + ".x, " + temp + ".y\n" + "mul " + temp + ".xyz, " + temp + ".x, " + normalReg + ".xyz\n" + "mul " + refractionDir + ", " + data + ".z, " + viewDirReg + "\n" + "sub " + refractionDir + ".xyz, " + refractionDir + ".xyz, " + temp + ".xyz\n" + "nrm " + refractionDir + ".xyz, " + refractionDir + ".xyz\n";
                    code += materials.ShaderCompilerHelper.getTexCubeSampleCode(temp, cubeMapReg, this._envMap, shaderObject.useSmoothTextures, shaderObject.useMipmapping, refractionDir) + "mov " + refractionColor + ".z, " + temp + ".z\n";
                }

                registerCache.removeFragmentTempUsage(refractionDir);

                code += "sub " + refractionColor + ".xyz, " + refractionColor + ".xyz, " + targetReg + ".xyz\n" + "mul " + refractionColor + ".xyz, " + refractionColor + ".xyz, " + data + ".w\n" + "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + refractionColor + ".xyz\n";

                registerCache.removeFragmentTempUsage(refractionColor);

                // restore
                code += "neg " + viewDirReg + ".xyz, " + viewDirReg + ".xyz\n";

                return code;
            };
            return EffectRefractionEnvMapMethod;
        })(materials.EffectMethodBase);
        materials.EffectRefractionEnvMapMethod = EffectRefractionEnvMapMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * EffectRimLightMethod provides a method to add rim lighting to a material. This adds a glow-like effect to edges of objects.
        */
        var EffectRimLightMethod = (function (_super) {
            __extends(EffectRimLightMethod, _super);
            /**
            * Creates a new <code>EffectRimLightMethod</code> object.
            *
            * @param color The colour of the rim light.
            * @param strength The strength of the rim light.
            * @param power The power of the rim light. Higher values will result in a higher edge fall-off.
            * @param blend The blend mode with which to add the light to the object.
            */
            function EffectRimLightMethod(color, strength, power, blend) {
                if (typeof color === "undefined") { color = 0xffffff; }
                if (typeof strength === "undefined") { strength = .4; }
                if (typeof power === "undefined") { power = 2; }
                if (typeof blend === "undefined") { blend = "mix"; }
                _super.call(this);

                this._blendMode = blend;
                this._strength = strength;
                this._power = power;

                this.color = color;
            }
            /**
            * @inheritDoc
            */
            EffectRimLightMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
                shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex + 3] = 1;
            };

            /**
            * @inheritDoc
            */
            EffectRimLightMethod.prototype.iInitVO = function (shaderObject, methodVO) {
                methodVO.needsNormals = true;
                methodVO.needsView = true;
            };

            Object.defineProperty(EffectRimLightMethod.prototype, "blendMode", {
                /**
                * The blend mode with which to add the light to the object.
                *
                * EffectRimLightMethod.MULTIPLY multiplies the rim light with the material's colour.
                * EffectRimLightMethod.ADD adds the rim light with the material's colour.
                * EffectRimLightMethod.MIX provides normal alpha blending.
                */
                get: function () {
                    return this._blendMode;
                },
                set: function (value) {
                    if (this._blendMode == value)
                        return;
                    this._blendMode = value;
                    this.iInvalidateShaderProgram();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(EffectRimLightMethod.prototype, "color", {
                /**
                * The color of the rim light.
                */
                get: function () {
                    return this._color;
                },
                set: function (value /*uint*/ ) {
                    this._color = value;
                    this._colorR = ((value >> 16) & 0xff) / 0xff;
                    this._colorG = ((value >> 8) & 0xff) / 0xff;
                    this._colorB = (value & 0xff) / 0xff;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(EffectRimLightMethod.prototype, "strength", {
                /**
                * The strength of the rim light.
                */
                get: function () {
                    return this._strength;
                },
                set: function (value) {
                    this._strength = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(EffectRimLightMethod.prototype, "power", {
                /**
                * The power of the rim light. Higher values will result in a higher edge fall-off.
                */
                get: function () {
                    return this._power;
                },
                set: function (value) {
                    this._power = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            EffectRimLightMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                var index = methodVO.fragmentConstantsIndex;
                var data = shaderObject.fragmentConstantData;
                data[index] = this._colorR;
                data[index + 1] = this._colorG;
                data[index + 2] = this._colorB;
                data[index + 4] = this._strength;
                data[index + 5] = this._power;
            };

            /**
            * @inheritDoc
            */
            EffectRimLightMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                var dataRegister = registerCache.getFreeFragmentConstant();
                var dataRegister2 = registerCache.getFreeFragmentConstant();
                var temp = registerCache.getFreeFragmentVectorTemp();
                var code = "";

                methodVO.fragmentConstantsIndex = dataRegister.index * 4;

                code += "dp3 " + temp + ".x, " + sharedRegisters.viewDirFragment + ".xyz, " + sharedRegisters.normalFragment + ".xyz\n" + "sat " + temp + ".x, " + temp + ".x\n" + "sub " + temp + ".x, " + dataRegister + ".w, " + temp + ".x\n" + "pow " + temp + ".x, " + temp + ".x, " + dataRegister2 + ".y\n" + "mul " + temp + ".x, " + temp + ".x, " + dataRegister2 + ".x\n" + "sub " + temp + ".x, " + dataRegister + ".w, " + temp + ".x\n" + "mul " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".x\n" + "sub " + temp + ".w, " + dataRegister + ".w, " + temp + ".x\n";

                if (this._blendMode == EffectRimLightMethod.ADD) {
                    code += "mul " + temp + ".xyz, " + temp + ".w, " + dataRegister + ".xyz\n" + "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
                } else if (this._blendMode == EffectRimLightMethod.MULTIPLY) {
                    code += "mul " + temp + ".xyz, " + temp + ".w, " + dataRegister + ".xyz\n" + "mul " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
                } else {
                    code += "sub " + temp + ".xyz, " + dataRegister + ".xyz, " + targetReg + ".xyz\n" + "mul " + temp + ".xyz, " + temp + ".xyz, " + temp + ".w\n" + "add " + targetReg + ".xyz, " + targetReg + ".xyz, " + temp + ".xyz\n";
                }

                return code;
            };
            EffectRimLightMethod.ADD = "add";
            EffectRimLightMethod.MULTIPLY = "multiply";
            EffectRimLightMethod.MIX = "mix";
            return EffectRimLightMethod;
        })(materials.EffectMethodBase);
        materials.EffectRimLightMethod = EffectRimLightMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * NormalHeightMapMethod provides a normal map method that uses a height map to calculate the normals.
        */
        var NormalHeightMapMethod = (function (_super) {
            __extends(NormalHeightMapMethod, _super);
            /**
            * Creates a new NormalHeightMapMethod method.
            *
            * @param heightMap The texture containing the height data. 0 means low, 1 means high.
            * @param worldWidth The width of the 'world'. This is used to map uv coordinates' u component to scene dimensions.
            * @param worldHeight The height of the 'world'. This is used to map the height map values to scene dimensions.
            * @param worldDepth The depth of the 'world'. This is used to map uv coordinates' v component to scene dimensions.
            */
            function NormalHeightMapMethod(heightMap, worldWidth, worldHeight, worldDepth) {
                _super.call(this);

                this.normalMap = heightMap;
                this._worldXYRatio = worldWidth / worldHeight;
                this._worldXZRatio = worldDepth / worldHeight;
            }
            /**
            * @inheritDoc
            */
            NormalHeightMapMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
                var index = methodVO.fragmentConstantsIndex;
                var data = shaderObject.fragmentConstantData;
                data[index] = 1 / this.normalMap.width;
                data[index + 1] = 1 / this.normalMap.height;
                data[index + 2] = 0;
                data[index + 3] = 1;
                data[index + 4] = this._worldXYRatio;
                data[index + 5] = this._worldXZRatio;
            };

            Object.defineProperty(NormalHeightMapMethod.prototype, "tangentSpace", {
                /**
                * @inheritDoc
                */
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * @inheritDoc
            */
            NormalHeightMapMethod.prototype.copyFrom = function (method) {
                _super.prototype.copyFrom.call(this, method);

                this._worldXYRatio = method._worldXYRatio;
                this._worldXZRatio = method._worldXZRatio;
            };

            /**
            * @inheritDoc
            */
            NormalHeightMapMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                var temp = registerCache.getFreeFragmentVectorTemp();
                var dataReg = registerCache.getFreeFragmentConstant();
                var dataReg2 = registerCache.getFreeFragmentConstant();
                this._pNormalTextureRegister = registerCache.getFreeTextureReg();
                methodVO.texturesIndex = this._pNormalTextureRegister.index;
                methodVO.fragmentConstantsIndex = dataReg.index * 4;

                return materials.ShaderCompilerHelper.getTex2DSampleCode(targetReg, sharedRegisters, this._pNormalTextureRegister, this.normalMap, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, sharedRegisters.uvVarying, "clamp") + "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg + ".xzzz\n" + materials.ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, this._pNormalTextureRegister, this.normalMap, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, temp, "clamp") + "sub " + targetReg + ".x, " + targetReg + ".x, " + temp + ".x\n" + "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg + ".zyzz\n" + materials.ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, this._pNormalTextureRegister, this.normalMap, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, temp, "clamp") + "sub " + targetReg + ".z, " + targetReg + ".z, " + temp + ".x\n" + "mov " + targetReg + ".y, " + dataReg + ".w\n" + "mul " + targetReg + ".xz, " + targetReg + ".xz, " + dataReg2 + ".xy\n" + "nrm " + targetReg + ".xyz, " + targetReg + ".xyz\n";
            };
            return NormalHeightMapMethod;
        })(materials.NormalBasicMethod);
        materials.NormalHeightMapMethod = NormalHeightMapMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * NormalSimpleWaterMethod provides a basic normal map method to create water ripples by translating two wave normal maps.
        */
        var NormalSimpleWaterMethod = (function (_super) {
            __extends(NormalSimpleWaterMethod, _super);
            /**
            * Creates a new NormalSimpleWaterMethod object.
            * @param waveMap1 A normal map containing one layer of a wave structure.
            * @param waveMap2 A normal map containing a second layer of a wave structure.
            */
            function NormalSimpleWaterMethod(waveMap1, waveMap2) {
                _super.call(this);
                this._useSecondNormalMap = false;
                this._water1OffsetX = 0;
                this._water1OffsetY = 0;
                this._water2OffsetX = 0;
                this._water2OffsetY = 0;
                this.normalMap = waveMap1;
                this.secondaryNormalMap = waveMap2;
            }
            /**
            * @inheritDoc
            */
            NormalSimpleWaterMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
                var index = methodVO.fragmentConstantsIndex;
                var data = shaderObject.fragmentConstantData;
                data[index] = .5;
                data[index + 1] = 0;
                data[index + 2] = 0;
                data[index + 3] = 1;
            };

            /**
            * @inheritDoc
            */
            NormalSimpleWaterMethod.prototype.iInitVO = function (shaderObject, methodVO) {
                _super.prototype.iInitVO.call(this, shaderObject, methodVO);

                this._useSecondNormalMap = this.normalMap != this.secondaryNormalMap;
            };

            Object.defineProperty(NormalSimpleWaterMethod.prototype, "water1OffsetX", {
                /**
                * The translation of the first wave layer along the X-axis.
                */
                get: function () {
                    return this._water1OffsetX;
                },
                set: function (value) {
                    this._water1OffsetX = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(NormalSimpleWaterMethod.prototype, "water1OffsetY", {
                /**
                * The translation of the first wave layer along the Y-axis.
                */
                get: function () {
                    return this._water1OffsetY;
                },
                set: function (value) {
                    this._water1OffsetY = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(NormalSimpleWaterMethod.prototype, "water2OffsetX", {
                /**
                * The translation of the second wave layer along the X-axis.
                */
                get: function () {
                    return this._water2OffsetX;
                },
                set: function (value) {
                    this._water2OffsetX = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(NormalSimpleWaterMethod.prototype, "water2OffsetY", {
                /**
                * The translation of the second wave layer along the Y-axis.
                */
                get: function () {
                    return this._water2OffsetY;
                },
                set: function (value) {
                    this._water2OffsetY = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(NormalSimpleWaterMethod.prototype, "secondaryNormalMap", {
                /**
                * A second normal map that will be combined with the first to create a wave-like animation pattern.
                */
                get: function () {
                    return this._texture2;
                },
                set: function (value) {
                    this._texture2 = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            NormalSimpleWaterMethod.prototype.iCleanCompilationData = function () {
                _super.prototype.iCleanCompilationData.call(this);
                this._normalTextureRegister2 = null;
            };

            /**
            * @inheritDoc
            */
            NormalSimpleWaterMethod.prototype.dispose = function () {
                _super.prototype.dispose.call(this);
                this._texture2 = null;
            };

            /**
            * @inheritDoc
            */
            NormalSimpleWaterMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);

                var data = shaderObject.fragmentConstantData;
                var index = methodVO.fragmentConstantsIndex;

                data[index + 4] = this._water1OffsetX;
                data[index + 5] = this._water1OffsetY;
                data[index + 6] = this._water2OffsetX;
                data[index + 7] = this._water2OffsetY;

                //if (this._useSecondNormalMap >= 0)
                if (this._useSecondNormalMap)
                    stage.context.activateTexture(methodVO.texturesIndex + 1, this._texture2);
            };

            /**
            * @inheritDoc
            */
            NormalSimpleWaterMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                var temp = registerCache.getFreeFragmentVectorTemp();
                var dataReg = registerCache.getFreeFragmentConstant();
                var dataReg2 = registerCache.getFreeFragmentConstant();
                this._pNormalTextureRegister = registerCache.getFreeTextureReg();
                this._normalTextureRegister2 = this._useSecondNormalMap ? registerCache.getFreeTextureReg() : this._pNormalTextureRegister;
                methodVO.texturesIndex = this._pNormalTextureRegister.index;

                methodVO.fragmentConstantsIndex = dataReg.index * 4;

                return "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".xyxy\n" + materials.ShaderCompilerHelper.getTex2DSampleCode(targetReg, sharedRegisters, this._pNormalTextureRegister, this.normalMap, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, temp) + "add " + temp + ", " + sharedRegisters.uvVarying + ", " + dataReg2 + ".zwzw\n" + materials.ShaderCompilerHelper.getTex2DSampleCode(temp, sharedRegisters, this._normalTextureRegister2, this._texture2, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping, temp) + "add " + targetReg + ", " + targetReg + ", " + temp + "		\n" + "mul " + targetReg + ", " + targetReg + ", " + dataReg + ".x	\n" + "sub " + targetReg + ".xyz, " + targetReg + ".xyz, " + sharedRegisters.commons + ".xxx	\n" + "nrm " + targetReg + ".xyz, " + targetReg + ".xyz							\n";
            };
            return NormalSimpleWaterMethod;
        })(materials.NormalBasicMethod);
        materials.NormalSimpleWaterMethod = NormalSimpleWaterMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        var DirectionalLight = away.entities.DirectionalLight;
        var Event = away.events.Event;
        var ShadingMethodEvent = away.events.ShadingMethodEvent;

        /**
        * ShadowCascadeMethod is a shadow map method to apply cascade shadow mapping on materials.
        * Must be used with a DirectionalLight with a CascadeShadowMapper assigned to its shadowMapper property.
        *
        * @see away.lights.CascadeShadowMapper
        */
        var ShadowCascadeMethod = (function (_super) {
            __extends(ShadowCascadeMethod, _super);
            /**
            * Creates a new ShadowCascadeMethod object.
            *
            * @param shadowMethodBase The shadow map sampling method used to sample individual cascades (fe: ShadowHardMethod, ShadowSoftMethod)
            */
            function ShadowCascadeMethod(shadowMethodBase) {
                var _this = this;
                _super.call(this, shadowMethodBase.castingLight);

                this._baseMethod = shadowMethodBase;
                if (!(this._pCastingLight instanceof DirectionalLight))
                    throw new Error("ShadowCascadeMethod is only compatible with DirectionalLight");

                this._cascadeShadowMapper = this._pCastingLight.shadowMapper;

                if (!this._cascadeShadowMapper)
                    throw new Error("ShadowCascadeMethod requires a light that has a CascadeShadowMapper instance assigned to shadowMapper.");

                this._cascadeShadowMapper.addEventListener(Event.CHANGE, function (event) {
                    return _this.onCascadeChange(event);
                });
                this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, function (event) {
                    return _this.onShaderInvalidated(event);
                });
            }
            Object.defineProperty(ShadowCascadeMethod.prototype, "baseMethod", {
                /**
                * The shadow map sampling method used to sample individual cascades. These are typically those used in conjunction
                * with a DirectionalShadowMapper.
                *
                * @see ShadowHardMethod
                * @see ShadowSoftMethod
                */
                get: function () {
                    return this._baseMethod;
                },
                set: function (value) {
                    var _this = this;
                    if (this._baseMethod == value)
                        return;

                    this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, function (event) {
                        return _this.onShaderInvalidated(event);
                    });
                    this._baseMethod = value;
                    this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, function (event) {
                        return _this.onShaderInvalidated(event);
                    });
                    this.iInvalidateShaderProgram();
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            ShadowCascadeMethod.prototype.iInitVO = function (shaderObject, methodVO) {
                var tempVO = new materials.MethodVO(this._baseMethod);
                this._baseMethod.iInitVO(shaderObject, tempVO);

                methodVO.needsGlobalVertexPos = true;
                methodVO.needsProjection = true;
            };

            /**
            * @inheritDoc
            */
            ShadowCascadeMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
                var fragmentData = shaderObject.fragmentConstantData;
                var vertexData = shaderObject.vertexConstantData;
                var index = methodVO.fragmentConstantsIndex;
                fragmentData[index] = 1.0;
                fragmentData[index + 1] = 1 / 255.0;
                fragmentData[index + 2] = 1 / 65025.0;
                fragmentData[index + 3] = 1 / 16581375.0;

                fragmentData[index + 6] = .5;
                fragmentData[index + 7] = -.5;

                index = methodVO.vertexConstantsIndex;
                vertexData[index] = .5;
                vertexData[index + 1] = -.5;
                vertexData[index + 2] = 0;
            };

            /**
            * @inheritDoc
            */
            ShadowCascadeMethod.prototype.iCleanCompilationData = function () {
                _super.prototype.iCleanCompilationData.call(this);
                this._cascadeProjections = null;
                this._depthMapCoordVaryings = null;
            };

            /**
            * @inheritDoc
            */
            ShadowCascadeMethod.prototype.iGetVertexCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
                var code = "";
                var dataReg = registerCache.getFreeVertexConstant();

                this.initProjectionsRegs(registerCache);
                methodVO.vertexConstantsIndex = dataReg.index * 4;

                var temp = registerCache.getFreeVertexVectorTemp();

                for (var i = 0; i < this._cascadeShadowMapper.numCascades; ++i) {
                    code += "m44 " + temp + ", " + sharedRegisters.globalPositionVertex + ", " + this._cascadeProjections[i] + "\n" + "add " + this._depthMapCoordVaryings[i] + ", " + temp + ", " + dataReg + ".zzwz\n";
                }

                return code;
            };

            /**
            * Creates the registers for the cascades' projection coordinates.
            */
            ShadowCascadeMethod.prototype.initProjectionsRegs = function (registerCache) {
                this._cascadeProjections = new Array(this._cascadeShadowMapper.numCascades);
                this._depthMapCoordVaryings = new Array(this._cascadeShadowMapper.numCascades);

                for (var i = 0; i < this._cascadeShadowMapper.numCascades; ++i) {
                    this._depthMapCoordVaryings[i] = registerCache.getFreeVarying();
                    this._cascadeProjections[i] = registerCache.getFreeVertexConstant();
                    registerCache.getFreeVertexConstant();
                    registerCache.getFreeVertexConstant();
                    registerCache.getFreeVertexConstant();
                }
            };

            /**
            * @inheritDoc
            */
            ShadowCascadeMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                var numCascades = this._cascadeShadowMapper.numCascades;
                var depthMapRegister = registerCache.getFreeTextureReg();
                var decReg = registerCache.getFreeFragmentConstant();
                var dataReg = registerCache.getFreeFragmentConstant();
                var planeDistanceReg = registerCache.getFreeFragmentConstant();
                var planeDistances = Array(planeDistanceReg + ".x", planeDistanceReg + ".y", planeDistanceReg + ".z", planeDistanceReg + ".w");
                var code;

                methodVO.fragmentConstantsIndex = decReg.index * 4;
                methodVO.texturesIndex = depthMapRegister.index;

                var inQuad = registerCache.getFreeFragmentVectorTemp();
                registerCache.addFragmentTempUsages(inQuad, 1);
                var uvCoord = registerCache.getFreeFragmentVectorTemp();
                registerCache.addFragmentTempUsages(uvCoord, 1);

                // assume lowest partition is selected, will be overwritten later otherwise
                code = "mov " + uvCoord + ", " + this._depthMapCoordVaryings[numCascades - 1] + "\n";

                for (var i = numCascades - 2; i >= 0; --i) {
                    var uvProjection = this._depthMapCoordVaryings[i];

                    // calculate if in texturemap (result == 0 or 1, only 1 for a single partition)
                    code += "slt " + inQuad + ".z, " + sharedRegisters.projectionFragment + ".z, " + planeDistances[i] + "\n"; // z = x > minX, w = y > minY

                    var temp = registerCache.getFreeFragmentVectorTemp();

                    // linearly interpolate between old and new uv coords using predicate value == conditional toggle to new value if predicate == 1 (true)
                    code += "sub " + temp + ", " + uvProjection + ", " + uvCoord + "\n" + "mul " + temp + ", " + temp + ", " + inQuad + ".z\n" + "add " + uvCoord + ", " + uvCoord + ", " + temp + "\n";
                }

                registerCache.removeFragmentTempUsage(inQuad);

                code += "div " + uvCoord + ", " + uvCoord + ", " + uvCoord + ".w\n" + "mul " + uvCoord + ".xy, " + uvCoord + ".xy, " + dataReg + ".zw\n" + "add " + uvCoord + ".xy, " + uvCoord + ".xy, " + dataReg + ".zz\n";

                code += this._baseMethod._iGetCascadeFragmentCode(shaderObject, methodVO, decReg, depthMapRegister, uvCoord, targetReg, registerCache, sharedRegisters) + "add " + targetReg + ".w, " + targetReg + ".w, " + dataReg + ".y\n";

                registerCache.removeFragmentTempUsage(uvCoord);

                return code;
            };

            /**
            * @inheritDoc
            */
            ShadowCascadeMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                stage.context.activateTexture(methodVO.texturesIndex, this._pCastingLight.shadowMapper.depthMap);

                var vertexData = shaderObject.vertexConstantData;
                var vertexIndex = methodVO.vertexConstantsIndex;

                shaderObject.vertexConstantData[methodVO.vertexConstantsIndex + 3] = -1 / (this._cascadeShadowMapper.depth * this._pEpsilon);

                var numCascades = this._cascadeShadowMapper.numCascades;
                vertexIndex += 4;
                for (var k = 0; k < numCascades; ++k) {
                    this._cascadeShadowMapper.getDepthProjections(k).copyRawDataTo(vertexData, vertexIndex, true);
                    vertexIndex += 16;
                }

                var fragmentData = shaderObject.fragmentConstantData;
                var fragmentIndex = methodVO.fragmentConstantsIndex;
                fragmentData[fragmentIndex + 5] = 1 - this._pAlpha;

                var nearPlaneDistances = this._cascadeShadowMapper._iNearPlaneDistances;

                fragmentIndex += 8;
                for (var i = 0; i < numCascades; ++i)
                    fragmentData[fragmentIndex + i] = nearPlaneDistances[i];

                this._baseMethod.iActivateForCascade(shaderObject, methodVO, stage);
            };

            /**
            * @inheritDoc
            */
            ShadowCascadeMethod.prototype.iSetRenderState = function (shaderObject, methodVO, renderable, stage, camera) {
            };

            /**
            * Called when the shadow mappers cascade configuration changes.
            */
            ShadowCascadeMethod.prototype.onCascadeChange = function (event) {
                this.iInvalidateShaderProgram();
            };

            /**
            * Called when the base method's shader code is invalidated.
            */
            ShadowCascadeMethod.prototype.onShaderInvalidated = function (event) {
                this.iInvalidateShaderProgram();
            };
            return ShadowCascadeMethod;
        })(materials.ShadowMapMethodBase);
        materials.ShadowCascadeMethod = ShadowCascadeMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        var BitmapData = away.base.BitmapData;

        var BitmapTexture = away.textures.BitmapTexture;

        /**
        * ShadowDitheredMethod provides a soft shadowing technique by randomly distributing sample points differently for each fragment.
        */
        var ShadowDitheredMethod = (function (_super) {
            __extends(ShadowDitheredMethod, _super);
            /**
            * Creates a new ShadowDitheredMethod object.
            * @param castingLight The light casting the shadows
            * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 24.
            */
            function ShadowDitheredMethod(castingLight, numSamples, range) {
                if (typeof numSamples === "undefined") { numSamples = 4; }
                if (typeof range === "undefined") { range = 1; }
                _super.call(this, castingLight);

                this._depthMapSize = this._pCastingLight.shadowMapper.depthMapSize;

                this.numSamples = numSamples;
                this.range = range;

                ++ShadowDitheredMethod._grainUsages;

                if (!ShadowDitheredMethod._grainTexture)
                    this.initGrainTexture();
            }
            Object.defineProperty(ShadowDitheredMethod.prototype, "numSamples", {
                /**
                * The amount of samples to take for dithering. Minimum 1, maximum 24. The actual maximum may depend on the
                * complexity of the shader.
                */
                get: function () {
                    return this._numSamples;
                },
                set: function (value /*int*/ ) {
                    this._numSamples = value;
                    if (this._numSamples < 1)
                        this._numSamples = 1;
                    else if (this._numSamples > 24)
                        this._numSamples = 24;
                    this.iInvalidateShaderProgram();
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            ShadowDitheredMethod.prototype.iInitVO = function (shaderObject, methodVO) {
                _super.prototype.iInitVO.call(this, shaderObject, methodVO);

                methodVO.needsProjection = true;
            };

            /**
            * @inheritDoc
            */
            ShadowDitheredMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
                _super.prototype.iInitConstants.call(this, shaderObject, methodVO);

                var fragmentData = shaderObject.fragmentConstantData;
                var index = methodVO.fragmentConstantsIndex;
                fragmentData[index + 8] = 1 / this._numSamples;
            };

            Object.defineProperty(ShadowDitheredMethod.prototype, "range", {
                /**
                * The range in the shadow map in which to distribute the samples.
                */
                get: function () {
                    return this._range * 2;
                },
                set: function (value) {
                    this._range = value / 2;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * Creates a texture containing the dithering noise texture.
            */
            ShadowDitheredMethod.prototype.initGrainTexture = function () {
                ShadowDitheredMethod._grainBitmapData = new BitmapData(64, 64, false);
                var vec = new Array();
                var len = 4096;
                var step = 1 / (this._depthMapSize * this._range);
                var r, g;

                for (var i = 0; i < len; ++i) {
                    r = 2 * (Math.random() - .5);
                    g = 2 * (Math.random() - .5);
                    if (r < 0)
                        r -= step;
                    else
                        r += step;
                    if (g < 0)
                        g -= step;
                    else
                        g += step;
                    if (r > 1)
                        r = 1;
                    else if (r < -1)
                        r = -1;
                    if (g > 1)
                        g = 1;
                    else if (g < -1)
                        g = -1;
                    vec[i] = (Math.floor((r * .5 + .5) * 0xff) << 16) | (Math.floor((g * .5 + .5) * 0xff) << 8);
                }

                ShadowDitheredMethod._grainBitmapData.setVector(ShadowDitheredMethod._grainBitmapData.rect, vec);
                ShadowDitheredMethod._grainTexture = new BitmapTexture(ShadowDitheredMethod._grainBitmapData);
            };

            /**
            * @inheritDoc
            */
            ShadowDitheredMethod.prototype.dispose = function () {
                if (--ShadowDitheredMethod._grainUsages == 0) {
                    ShadowDitheredMethod._grainTexture.dispose();
                    ShadowDitheredMethod._grainBitmapData.dispose();
                    ShadowDitheredMethod._grainTexture = null;
                }
            };

            /**
            * @inheritDoc
            */
            ShadowDitheredMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);

                var data = shaderObject.fragmentConstantData;
                var index = methodVO.fragmentConstantsIndex;
                data[index + 9] = (stage.width - 1) / 63;
                data[index + 10] = (stage.height - 1) / 63;
                data[index + 11] = 2 * this._range / this._depthMapSize;
                stage.context.activateTexture(methodVO.texturesIndex + 1, ShadowDitheredMethod._grainTexture);
            };

            /**
            * @inheritDoc
            */
            ShadowDitheredMethod.prototype._pGetPlanarFragmentCode = function (methodVO, targetReg, regCache, sharedRegisters) {
                var depthMapRegister = regCache.getFreeTextureReg();
                var decReg = regCache.getFreeFragmentConstant();
                var dataReg = regCache.getFreeFragmentConstant();
                var customDataReg = regCache.getFreeFragmentConstant();

                methodVO.fragmentConstantsIndex = decReg.index * 4;
                methodVO.texturesIndex = depthMapRegister.index;

                return this.getSampleCode(customDataReg, depthMapRegister, decReg, targetReg, regCache, sharedRegisters);
            };

            /**
            * Get the actual shader code for shadow mapping
            * @param regCache The register cache managing the registers.
            * @param depthMapRegister The texture register containing the depth map.
            * @param decReg The register containing the depth map decoding data.
            * @param targetReg The target register to add the shadow coverage.
            */
            ShadowDitheredMethod.prototype.getSampleCode = function (customDataReg, depthMapRegister, decReg, targetReg, regCache, sharedRegisters) {
                var code = "";
                var grainRegister = regCache.getFreeTextureReg();
                var uvReg = regCache.getFreeFragmentVectorTemp();
                var numSamples = this._numSamples;
                regCache.addFragmentTempUsages(uvReg, 1);

                var temp = regCache.getFreeFragmentVectorTemp();

                var projectionReg = sharedRegisters.projectionFragment;

                code += "div " + uvReg + ", " + projectionReg + ", " + projectionReg + ".w\n" + "mul " + uvReg + ".xy, " + uvReg + ".xy, " + customDataReg + ".yz\n";

                while (numSamples > 0) {
                    if (numSamples == this._numSamples)
                        code += "tex " + uvReg + ", " + uvReg + ", " + grainRegister + " <2d,nearest,repeat,mipnone>\n";
                    else
                        code += "tex " + uvReg + ", " + uvReg + ".zwxy, " + grainRegister + " <2d,nearest,repeat,mipnone>\n";

                    // keep grain in uvReg.zw
                    code += "sub " + uvReg + ".zw, " + uvReg + ".xy, fc0.xx\n" + "mul " + uvReg + ".zw, " + uvReg + ".zw, " + customDataReg + ".w\n"; // (tex unpack scale and tex scale in one)

                    if (numSamples == this._numSamples) {
                        // first sample
                        code += "add " + uvReg + ".xy, " + uvReg + ".zw, " + this._pDepthMapCoordReg + ".xy\n" + "tex " + temp + ", " + uvReg + ", " + depthMapRegister + " <2d,nearest,clamp,mipnone>\n" + "dp4 " + temp + ".z, " + temp + ", " + decReg + "\n" + "slt " + targetReg + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n"; // 0 if in shadow
                    } else {
                        code += this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);
                    }

                    if (numSamples > 4)
                        code += "add " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".zw\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);

                    if (numSamples > 1)
                        code += "sub " + uvReg + ".xy, " + this._pDepthMapCoordReg + ".xy, " + uvReg + ".zw\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);

                    if (numSamples > 5)
                        code += "sub " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".zw\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);

                    if (numSamples > 2) {
                        code += "neg " + uvReg + ".w, " + uvReg + ".w\n"; // will be rotated 90 degrees when being accessed as wz
                        code += "add " + uvReg + ".xy, " + uvReg + ".wz, " + this._pDepthMapCoordReg + ".xy\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);
                    }

                    if (numSamples > 6)
                        code += "add " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".wz\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);

                    if (numSamples > 3)
                        code += "sub " + uvReg + ".xy, " + this._pDepthMapCoordReg + ".xy, " + uvReg + ".wz\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);

                    if (numSamples > 7)
                        code += "sub " + uvReg + ".xy, " + uvReg + ".xy, " + uvReg + ".wz\n" + this.addSample(uvReg, depthMapRegister, decReg, targetReg, regCache);

                    numSamples -= 8;
                }

                regCache.removeFragmentTempUsage(uvReg);
                code += "mul " + targetReg + ".w, " + targetReg + ".w, " + customDataReg + ".x\n"; // average
                return code;
            };

            /**
            * Adds the code for another tap to the shader code.
            * @param uvReg The uv register for the tap.
            * @param depthMapRegister The texture register containing the depth map.
            * @param decReg The register containing the depth map decoding data.
            * @param targetReg The target register to add the tap comparison result.
            * @param regCache The register cache managing the registers.
            * @return
            */
            ShadowDitheredMethod.prototype.addSample = function (uvReg, depthMapRegister, decReg, targetReg, regCache) {
                var temp = regCache.getFreeFragmentVectorTemp();

                return "tex " + temp + ", " + uvReg + ", " + depthMapRegister + " <2d,nearest,clamp,mipnone>\n" + "dp4 " + temp + ".z, " + temp + ", " + decReg + "\n" + "slt " + temp + ".z, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + temp + ".z\n";
            };

            /**
            * @inheritDoc
            */
            ShadowDitheredMethod.prototype.iActivateForCascade = function (shaderObject, methodVO, stage) {
                var data = shaderObject.fragmentConstantData;
                var index = methodVO.secondaryFragmentConstantsIndex;
                data[index] = 1 / this._numSamples;
                data[index + 1] = (stage.width - 1) / 63;
                data[index + 2] = (stage.height - 1) / 63;
                data[index + 3] = 2 * this._range / this._depthMapSize;

                stage.context.activateTexture(methodVO.texturesIndex + 1, ShadowDitheredMethod._grainTexture);
            };

            /**
            * @inheritDoc
            */
            ShadowDitheredMethod.prototype._iGetCascadeFragmentCode = function (shaderObject, methodVO, decodeRegister, depthTexture, depthProjection, targetRegister, registerCache, sharedRegisters) {
                this._pDepthMapCoordReg = depthProjection;

                var dataReg = registerCache.getFreeFragmentConstant();
                methodVO.secondaryFragmentConstantsIndex = dataReg.index * 4;

                return this.getSampleCode(dataReg, depthTexture, decodeRegister, targetRegister, registerCache, sharedRegisters);
            };
            return ShadowDitheredMethod;
        })(materials.ShadowMethodBase);
        materials.ShadowDitheredMethod = ShadowDitheredMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * ShadowFilteredMethod provides a softened shadowing technique by bilinearly interpolating shadow comparison
        * results of neighbouring pixels.
        */
        var ShadowFilteredMethod = (function (_super) {
            __extends(ShadowFilteredMethod, _super);
            /**
            * Creates a new DiffuseBasicMethod object.
            *
            * @param castingLight The light casting the shadow
            */
            function ShadowFilteredMethod(castingLight) {
                _super.call(this, castingLight);
            }
            /**
            * @inheritDoc
            */
            ShadowFilteredMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
                _super.prototype.iInitConstants.call(this, shaderObject, methodVO);

                var fragmentData = shaderObject.fragmentConstantData;
                var index = methodVO.fragmentConstantsIndex;
                fragmentData[index + 8] = .5;
                var size = this.castingLight.shadowMapper.depthMapSize;
                fragmentData[index + 9] = size;
                fragmentData[index + 10] = 1 / size;
            };

            /**
            * @inheritDoc
            */
            ShadowFilteredMethod.prototype._pGetPlanarFragmentCode = function (methodVO, targetReg, regCache, sharedRegisters) {
                var depthMapRegister = regCache.getFreeTextureReg();
                var decReg = regCache.getFreeFragmentConstant();
                var dataReg = regCache.getFreeFragmentConstant();

                // TODO: not used
                dataReg = dataReg;
                var customDataReg = regCache.getFreeFragmentConstant();
                var depthCol = regCache.getFreeFragmentVectorTemp();
                var uvReg;
                var code = "";
                methodVO.fragmentConstantsIndex = decReg.index * 4;

                regCache.addFragmentTempUsages(depthCol, 1);

                uvReg = regCache.getFreeFragmentVectorTemp();
                regCache.addFragmentTempUsages(uvReg, 1);

                code += "mov " + uvReg + ", " + this._pDepthMapCoordReg + "\n" + "tex " + depthCol + ", " + this._pDepthMapCoordReg + ", " + depthMapRegister + " <2d, nearest, clamp>\n" + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + uvReg + ".z, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" + "add " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".z\n" + "tex " + depthCol + ", " + uvReg + ", " + depthMapRegister + " <2d, nearest, clamp>\n" + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + uvReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" + "mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".y\n" + "frc " + depthCol + ".x, " + depthCol + ".x\n" + "sub " + uvReg + ".w, " + uvReg + ".w, " + uvReg + ".z\n" + "mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" + "add " + targetReg + ".w, " + uvReg + ".z, " + uvReg + ".w\n" + "mov " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x\n" + "add " + uvReg + ".y, " + this._pDepthMapCoordReg + ".y, " + customDataReg + ".z\n" + "tex " + depthCol + ", " + uvReg + ", " + depthMapRegister + " <2d, nearest, clamp>\n" + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + uvReg + ".z, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" + "add " + uvReg + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".z\n" + "tex " + depthCol + ", " + uvReg + ", " + depthMapRegister + " <2d, nearest, clamp>\n" + "dp4 " + depthCol + ".z, " + depthCol + ", " + decReg + "\n" + "slt " + uvReg + ".w, " + this._pDepthMapCoordReg + ".z, " + depthCol + ".z\n" + "mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".x, " + customDataReg + ".y\n" + "frc " + depthCol + ".x, " + depthCol + ".x\n" + "sub " + uvReg + ".w, " + uvReg + ".w, " + uvReg + ".z\n" + "mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" + "add " + uvReg + ".w, " + uvReg + ".z, " + uvReg + ".w\n" + "mul " + depthCol + ".x, " + this._pDepthMapCoordReg + ".y, " + customDataReg + ".y\n" + "frc " + depthCol + ".x, " + depthCol + ".x\n" + "sub " + uvReg + ".w, " + uvReg + ".w, " + targetReg + ".w\n" + "mul " + uvReg + ".w, " + uvReg + ".w, " + depthCol + ".x\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + uvReg + ".w\n";

                regCache.removeFragmentTempUsage(depthCol);
                regCache.removeFragmentTempUsage(uvReg);

                methodVO.texturesIndex = depthMapRegister.index;

                return code;
            };

            /**
            * @inheritDoc
            */
            ShadowFilteredMethod.prototype.iActivateForCascade = function (shaderObject, methodVO, stage) {
                var size = this.castingLight.shadowMapper.depthMapSize;
                var index = methodVO.secondaryFragmentConstantsIndex;
                var data = shaderObject.fragmentConstantData;
                data[index] = size;
                data[index + 1] = 1 / size;
            };

            /**
            * @inheritDoc
            */
            ShadowFilteredMethod.prototype._iGetCascadeFragmentCode = function (shaderObject, methodVO, decodeRegister, depthTexture, depthProjection, targetRegister, registerCache, sharedRegisters) {
                var code;
                var dataReg = registerCache.getFreeFragmentConstant();
                methodVO.secondaryFragmentConstantsIndex = dataReg.index * 4;
                var temp = registerCache.getFreeFragmentVectorTemp();
                registerCache.addFragmentTempUsages(temp, 1);
                var predicate = registerCache.getFreeFragmentVectorTemp();
                registerCache.addFragmentTempUsages(predicate, 1);

                code = "tex " + temp + ", " + depthProjection + ", " + depthTexture + " <2d, nearest, clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + predicate + ".x, " + depthProjection + ".z, " + temp + ".z\n" + "add " + depthProjection + ".x, " + depthProjection + ".x, " + dataReg + ".y\n" + "tex " + temp + ", " + depthProjection + ", " + depthTexture + " <2d, nearest, clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + predicate + ".z, " + depthProjection + ".z, " + temp + ".z\n" + "add " + depthProjection + ".y, " + depthProjection + ".y, " + dataReg + ".y\n" + "tex " + temp + ", " + depthProjection + ", " + depthTexture + " <2d, nearest, clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + predicate + ".w, " + depthProjection + ".z, " + temp + ".z\n" + "sub " + depthProjection + ".x, " + depthProjection + ".x, " + dataReg + ".y\n" + "tex " + temp + ", " + depthProjection + ", " + depthTexture + " <2d, nearest, clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + predicate + ".y, " + depthProjection + ".z, " + temp + ".z\n" + "mul " + temp + ".xy, " + depthProjection + ".xy, " + dataReg + ".x\n" + "frc " + temp + ".xy, " + temp + ".xy\n" + "sub " + depthProjection + ", " + predicate + ".xyzw, " + predicate + ".zwxy\n" + "mul " + depthProjection + ", " + depthProjection + ", " + temp + ".x\n" + "add " + predicate + ".xy, " + predicate + ".xy, " + depthProjection + ".zw\n" + "sub " + predicate + ".y, " + predicate + ".y, " + predicate + ".x\n" + "mul " + predicate + ".y, " + predicate + ".y, " + temp + ".y\n" + "add " + targetRegister + ".w, " + predicate + ".x, " + predicate + ".y\n";

                registerCache.removeFragmentTempUsage(temp);
                registerCache.removeFragmentTempUsage(predicate);
                return code;
            };
            return ShadowFilteredMethod;
        })(materials.ShadowMethodBase);
        materials.ShadowFilteredMethod = ShadowFilteredMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        var ShadingMethodEvent = away.events.ShadingMethodEvent;

        // TODO: shadow mappers references in materials should be an interface so that this class should NOT extend ShadowMapMethodBase just for some delegation work
        /**
        * ShadowNearMethod provides a shadow map method that restricts the shadowed area near the camera to optimize
        * shadow map usage. This method needs to be used in conjunction with a NearDirectionalShadowMapper.
        *
        * @see away.lights.NearDirectionalShadowMapper
        */
        var ShadowNearMethod = (function (_super) {
            __extends(ShadowNearMethod, _super);
            /**
            * Creates a new ShadowNearMethod object.
            * @param baseMethod The shadow map sampling method used to sample individual cascades (fe: ShadowHardMethod, ShadowSoftMethod)
            * @param fadeRatio The amount of shadow fading to the outer shadow area. A value of 1 would mean the shadows start fading from the camera's near plane.
            */
            function ShadowNearMethod(baseMethod, fadeRatio) {
                if (typeof fadeRatio === "undefined") { fadeRatio = .1; }
                var _this = this;
                _super.call(this, baseMethod.castingLight);

                this._onShaderInvalidatedDelegate = function (event) {
                    return _this.onShaderInvalidated(event);
                };

                this._baseMethod = baseMethod;
                this._fadeRatio = fadeRatio;
                this._nearShadowMapper = this._pCastingLight.shadowMapper;
                if (!this._nearShadowMapper)
                    throw new Error("ShadowNearMethod requires a light that has a NearDirectionalShadowMapper instance assigned to shadowMapper.");
                this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
            }
            Object.defineProperty(ShadowNearMethod.prototype, "baseMethod", {
                /**
                * The base shadow map method on which this method's shading is based.
                */
                get: function () {
                    return this._baseMethod;
                },
                set: function (value) {
                    if (this._baseMethod == value)
                        return;
                    this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
                    this._baseMethod = value;
                    this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
                    this.iInvalidateShaderProgram();
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            ShadowNearMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
                _super.prototype.iInitConstants.call(this, shaderObject, methodVO);
                this._baseMethod.iInitConstants(shaderObject, methodVO);

                var fragmentData = shaderObject.fragmentConstantData;
                var index = methodVO.secondaryFragmentConstantsIndex;
                fragmentData[index + 2] = 0;
                fragmentData[index + 3] = 1;
            };

            /**
            * @inheritDoc
            */
            ShadowNearMethod.prototype.iInitVO = function (shaderObject, methodVO) {
                this._baseMethod.iInitVO(shaderObject, methodVO);

                methodVO.needsProjection = true;
            };

            /**
            * @inheritDoc
            */
            ShadowNearMethod.prototype.dispose = function () {
                this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
            };

            Object.defineProperty(ShadowNearMethod.prototype, "alpha", {
                /**
                * @inheritDoc
                */
                get: function () {
                    return this._baseMethod.alpha;
                },
                set: function (value) {
                    this._baseMethod.alpha = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ShadowNearMethod.prototype, "epsilon", {
                /**
                * @inheritDoc
                */
                get: function () {
                    return this._baseMethod.epsilon;
                },
                set: function (value) {
                    this._baseMethod.epsilon = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ShadowNearMethod.prototype, "fadeRatio", {
                /**
                * The amount of shadow fading to the outer shadow area. A value of 1 would mean the shadows start fading from the camera's near plane.
                */
                get: function () {
                    return this._fadeRatio;
                },
                set: function (value) {
                    this._fadeRatio = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            ShadowNearMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                var code = this._baseMethod.iGetFragmentCode(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);

                var dataReg = registerCache.getFreeFragmentConstant();
                var temp = registerCache.getFreeFragmentSingleTemp();
                methodVO.secondaryFragmentConstantsIndex = dataReg.index * 4;

                code += "abs " + temp + ", " + sharedRegisters.projectionFragment + ".w\n" + "sub " + temp + ", " + temp + ", " + dataReg + ".x\n" + "mul " + temp + ", " + temp + ", " + dataReg + ".y\n" + "sat " + temp + ", " + temp + "\n" + "sub " + temp + ", " + dataReg + ".w," + temp + "\n" + "sub " + targetReg + ".w, " + dataReg + ".w," + targetReg + ".w\n" + "mul " + targetReg + ".w, " + targetReg + ".w, " + temp + "\n" + "sub " + targetReg + ".w, " + dataReg + ".w," + targetReg + ".w\n";

                return code;
            };

            /**
            * @inheritDoc
            */
            ShadowNearMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                this._baseMethod.iActivate(shaderObject, methodVO, stage);
            };

            /**
            * @inheritDoc
            */
            ShadowNearMethod.prototype.iDeactivate = function (shaderObject, methodVO, stage) {
                this._baseMethod.iDeactivate(shaderObject, methodVO, stage);
            };

            /**
            * @inheritDoc
            */
            ShadowNearMethod.prototype.iSetRenderState = function (shaderObject, methodVO, renderable, stage, camera) {
                // todo: move this to activate (needs camera)
                var near = camera.projection.near;
                var d = camera.projection.far - near;
                var maxDistance = this._nearShadowMapper.coverageRatio;
                var minDistance = maxDistance * (1 - this._fadeRatio);

                maxDistance = near + maxDistance * d;
                minDistance = near + minDistance * d;

                var fragmentData = shaderObject.fragmentConstantData;
                var index = methodVO.secondaryFragmentConstantsIndex;
                fragmentData[index] = minDistance;
                fragmentData[index + 1] = 1 / (maxDistance - minDistance);

                this._baseMethod.iSetRenderState(shaderObject, methodVO, renderable, stage, camera);
            };

            /**
            * @inheritDoc
            */
            ShadowNearMethod.prototype.iGetVertexCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
                return this._baseMethod.iGetVertexCode(shaderObject, methodVO, registerCache, sharedRegisters);
            };

            /**
            * @inheritDoc
            */
            ShadowNearMethod.prototype.iReset = function () {
                this._baseMethod.iReset();
            };

            /**
            * @inheritDoc
            */
            ShadowNearMethod.prototype.iCleanCompilationData = function () {
                _super.prototype.iCleanCompilationData.call(this);
                this._baseMethod.iCleanCompilationData();
            };

            /**
            * Called when the base method's shader code is invalidated.
            */
            ShadowNearMethod.prototype.onShaderInvalidated = function (event) {
                this.iInvalidateShaderProgram();
            };
            return ShadowNearMethod;
        })(materials.ShadowMethodBase);
        materials.ShadowNearMethod = ShadowNearMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * ShadowSoftMethod provides a soft shadowing technique by randomly distributing sample points.
        */
        var ShadowSoftMethod = (function (_super) {
            __extends(ShadowSoftMethod, _super);
            /**
            * Creates a new DiffuseBasicMethod object.
            *
            * @param castingLight The light casting the shadows
            * @param numSamples The amount of samples to take for dithering. Minimum 1, maximum 32.
            */
            function ShadowSoftMethod(castingLight, numSamples, range) {
                if (typeof numSamples === "undefined") { numSamples = 5; }
                if (typeof range === "undefined") { range = 1; }
                _super.call(this, castingLight);
                this._range = 1;

                this.numSamples = numSamples;
                this.range = range;
            }
            Object.defineProperty(ShadowSoftMethod.prototype, "numSamples", {
                /**
                * The amount of samples to take for dithering. Minimum 1, maximum 32. The actual maximum may depend on the
                * complexity of the shader.
                */
                get: function () {
                    return this._numSamples;
                },
                set: function (value /*int*/ ) {
                    this._numSamples = value;
                    if (this._numSamples < 1)
                        this._numSamples = 1;
                    else if (this._numSamples > 32)
                        this._numSamples = 32;

                    this._offsets = away.geom.PoissonLookup.getDistribution(this._numSamples);
                    this.iInvalidateShaderProgram();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ShadowSoftMethod.prototype, "range", {
                /**
                * The range in the shadow map in which to distribute the samples.
                */
                get: function () {
                    return this._range;
                },
                set: function (value) {
                    this._range = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            ShadowSoftMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
                _super.prototype.iInitConstants.call(this, shaderObject, methodVO);

                shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex + 8] = 1 / this._numSamples;
                shaderObject.fragmentConstantData[methodVO.fragmentConstantsIndex + 9] = 0;
            };

            /**
            * @inheritDoc
            */
            ShadowSoftMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);

                var texRange = .5 * this._range / this._pCastingLight.shadowMapper.depthMapSize;
                var data = shaderObject.fragmentConstantData;
                var index = methodVO.fragmentConstantsIndex + 10;
                var len = this._numSamples << 1;

                for (var i = 0; i < len; ++i)
                    data[index + i] = this._offsets[i] * texRange;
            };

            /**
            * @inheritDoc
            */
            ShadowSoftMethod.prototype._pGetPlanarFragmentCode = function (methodVO, targetReg, regCache, sharedRegisters) {
                // todo: move some things to super
                var depthMapRegister = regCache.getFreeTextureReg();
                var decReg = regCache.getFreeFragmentConstant();
                var dataReg = regCache.getFreeFragmentConstant();
                var customDataReg = regCache.getFreeFragmentConstant();

                methodVO.fragmentConstantsIndex = decReg.index * 4;
                methodVO.texturesIndex = depthMapRegister.index;

                return this.getSampleCode(regCache, depthMapRegister, decReg, targetReg, customDataReg);
            };

            /**
            * Adds the code for another tap to the shader code.
            * @param uv The uv register for the tap.
            * @param texture The texture register containing the depth map.
            * @param decode The register containing the depth map decoding data.
            * @param target The target register to add the tap comparison result.
            * @param regCache The register cache managing the registers.
            * @return
            */
            ShadowSoftMethod.prototype.addSample = function (uv, texture, decode, target, regCache) {
                var temp = regCache.getFreeFragmentVectorTemp();
                return "tex " + temp + ", " + uv + ", " + texture + " <2d,nearest,clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decode + "\n" + "slt " + uv + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n" + "add " + target + ".w, " + target + ".w, " + uv + ".w\n";
            };

            /**
            * @inheritDoc
            */
            ShadowSoftMethod.prototype.iActivateForCascade = function (shaderObject, methodVO, stage) {
                _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);

                var texRange = this._range / this._pCastingLight.shadowMapper.depthMapSize;
                var data = shaderObject.fragmentConstantData;
                var index = methodVO.secondaryFragmentConstantsIndex;
                var len = this._numSamples << 1;
                data[index] = 1 / this._numSamples;
                data[index + 1] = 0;
                index += 2;

                for (var i = 0; i < len; ++i)
                    data[index + i] = this._offsets[i] * texRange;

                if (len % 4 == 0) {
                    data[index + len] = 0;
                    data[index + len + 1] = 0;
                }
            };

            /**
            * @inheritDoc
            */
            ShadowSoftMethod.prototype._iGetCascadeFragmentCode = function (shaderObject, methodVO, decodeRegister, depthTexture, depthProjection, targetRegister, registerCache, sharedRegisters) {
                this._pDepthMapCoordReg = depthProjection;

                var dataReg = registerCache.getFreeFragmentConstant();
                methodVO.secondaryFragmentConstantsIndex = dataReg.index * 4;

                return this.getSampleCode(registerCache, depthTexture, decodeRegister, targetRegister, dataReg);
            };

            /**
            * Get the actual shader code for shadow mapping
            * @param regCache The register cache managing the registers.
            * @param depthTexture The texture register containing the depth map.
            * @param decodeRegister The register containing the depth map decoding data.
            * @param targetReg The target register to add the shadow coverage.
            * @param dataReg The register containing additional data.
            */
            ShadowSoftMethod.prototype.getSampleCode = function (regCache, depthTexture, decodeRegister, targetRegister, dataReg) {
                var uvReg;
                var code;
                var offsets = new Array(dataReg + ".zw");
                uvReg = regCache.getFreeFragmentVectorTemp();
                regCache.addFragmentTempUsages(uvReg, 1);

                var temp = regCache.getFreeFragmentVectorTemp();

                var numRegs = this._numSamples >> 1;
                for (var i = 0; i < numRegs; ++i) {
                    var reg = regCache.getFreeFragmentConstant();
                    offsets.push(reg + ".xy");
                    offsets.push(reg + ".zw");
                }

                for (i = 0; i < this._numSamples; ++i) {
                    if (i == 0) {
                        code = "add " + uvReg + ", " + this._pDepthMapCoordReg + ", " + dataReg + ".zwyy\n" + "tex " + temp + ", " + uvReg + ", " + depthTexture + " <2d,nearest,clamp>\n" + "dp4 " + temp + ".z, " + temp + ", " + decodeRegister + "\n" + "slt " + targetRegister + ".w, " + this._pDepthMapCoordReg + ".z, " + temp + ".z\n"; // 0 if in shadow;
                    } else {
                        code += "add " + uvReg + ".xy, " + this._pDepthMapCoordReg + ".xy, " + offsets[i] + "\n" + this.addSample(uvReg, depthTexture, decodeRegister, targetRegister, regCache);
                    }
                }

                regCache.removeFragmentTempUsage(uvReg);

                code += "mul " + targetRegister + ".w, " + targetRegister + ".w, " + dataReg + ".x\n"; // average

                return code;
            };
            return ShadowSoftMethod;
        })(materials.ShadowMethodBase);
        materials.ShadowSoftMethod = ShadowSoftMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        var Delegate = away.utils.Delegate;

        var ShadingMethodEvent = away.events.ShadingMethodEvent;

        /**
        * SpecularCompositeMethod provides a base class for specular methods that wrap a specular method to alter the
        * calculated specular reflection strength.
        */
        var SpecularCompositeMethod = (function (_super) {
            __extends(SpecularCompositeMethod, _super);
            /**
            * Creates a new <code>SpecularCompositeMethod</code> object.
            *
            * @param modulateMethod The method which will add the code to alter the base method's strength. It needs to have the signature modSpecular(t:ShaderRegisterElement, regCache:ShaderRegisterCache):string, in which t.w will contain the specular strength and t.xyz will contain the half-vector or the reflection vector.
            * @param baseMethod The base specular method on which this method's shading is based.
            */
            function SpecularCompositeMethod(modulateMethod, baseMethod) {
                if (typeof baseMethod === "undefined") { baseMethod = null; }
                _super.call(this);

                this._onShaderInvalidatedDelegate = Delegate.create(this, this.onShaderInvalidated);

                this._baseMethod = baseMethod || new materials.SpecularBasicMethod();
                this._baseMethod._iModulateMethod = modulateMethod;
                this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
            }
            /**
            * @inheritDoc
            */
            SpecularCompositeMethod.prototype.iInitVO = function (shaderObject, methodVO) {
                this._baseMethod.iInitVO(shaderObject, methodVO);
            };

            /**
            * @inheritDoc
            */
            SpecularCompositeMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
                this._baseMethod.iInitConstants(shaderObject, methodVO);
            };

            Object.defineProperty(SpecularCompositeMethod.prototype, "baseMethod", {
                /**
                * The base specular method on which this method's shading is based.
                */
                get: function () {
                    return this._baseMethod;
                },
                set: function (value) {
                    if (this._baseMethod == value)
                        return;

                    this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
                    this._baseMethod = value;
                    this._baseMethod.addEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
                    this.iInvalidateShaderProgram();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(SpecularCompositeMethod.prototype, "gloss", {
                /**
                * @inheritDoc
                */
                get: function () {
                    return this._baseMethod.gloss;
                },
                set: function (value) {
                    this._baseMethod.gloss = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(SpecularCompositeMethod.prototype, "specular", {
                /**
                * @inheritDoc
                */
                get: function () {
                    return this._baseMethod.specular;
                },
                set: function (value) {
                    this._baseMethod.specular = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(SpecularCompositeMethod.prototype, "passes", {
                /**
                * @inheritDoc
                */
                get: function () {
                    return this._baseMethod.passes;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * @inheritDoc
            */
            SpecularCompositeMethod.prototype.dispose = function () {
                this._baseMethod.removeEventListener(ShadingMethodEvent.SHADER_INVALIDATED, this._onShaderInvalidatedDelegate);
                this._baseMethod.dispose();
            };

            Object.defineProperty(SpecularCompositeMethod.prototype, "texture", {
                /**
                * @inheritDoc
                */
                get: function () {
                    return this._baseMethod.texture;
                },
                set: function (value) {
                    this._baseMethod.texture = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            SpecularCompositeMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                this._baseMethod.iActivate(shaderObject, methodVO, stage);
            };

            /**
            * @inheritDoc
            */
            SpecularCompositeMethod.prototype.iSetRenderState = function (shaderObject, methodVO, renderable, stage, camera) {
                this._baseMethod.iSetRenderState(shaderObject, methodVO, renderable, stage, camera);
            };

            /**
            * @inheritDoc
            */
            SpecularCompositeMethod.prototype.iDeactivate = function (shaderObject, methodVO, stage) {
                this._baseMethod.iDeactivate(shaderObject, methodVO, stage);
            };

            /**
            * @inheritDoc
            */
            SpecularCompositeMethod.prototype.iGetVertexCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
                return this._baseMethod.iGetVertexCode(shaderObject, methodVO, registerCache, sharedRegisters);
            };

            /**
            * @inheritDoc
            */
            SpecularCompositeMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
                return this._baseMethod.iGetFragmentPreLightingCode(shaderObject, methodVO, registerCache, sharedRegisters);
            };

            /**
            * @inheritDoc
            */
            SpecularCompositeMethod.prototype.iGetFragmentCodePerLight = function (shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
                return this._baseMethod.iGetFragmentCodePerLight(shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters);
            };

            /**
            * @inheritDoc
            * @return
            */
            SpecularCompositeMethod.prototype.iGetFragmentCodePerProbe = function (shaderObject, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters) {
                return this._baseMethod.iGetFragmentCodePerProbe(shaderObject, methodVO, cubeMapReg, weightRegister, registerCache, sharedRegisters);
            };

            /**
            * @inheritDoc
            */
            SpecularCompositeMethod.prototype.iGetFragmentPostLightingCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                return this._baseMethod.iGetFragmentPostLightingCode(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
            };

            /**
            * @inheritDoc
            */
            SpecularCompositeMethod.prototype.iReset = function () {
                this._baseMethod.iReset();
            };

            /**
            * @inheritDoc
            */
            SpecularCompositeMethod.prototype.iCleanCompilationData = function () {
                _super.prototype.iCleanCompilationData.call(this);
                this._baseMethod.iCleanCompilationData();
            };

            /**
            * Called when the base method's shader code is invalidated.
            */
            SpecularCompositeMethod.prototype.onShaderInvalidated = function (event) {
                this.iInvalidateShaderProgram();
            };
            return SpecularCompositeMethod;
        })(materials.SpecularBasicMethod);
        materials.SpecularCompositeMethod = SpecularCompositeMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    /**
    *
    */
    (function (materials) {
        /**
        * SpecularAnisotropicMethod provides a specular method resulting in anisotropic highlights. These are typical for
        * surfaces with microfacet details such as tiny grooves. In particular, this uses the Heidrich-Seidel distrubution.
        * The tangent vectors are used as the surface groove directions.
        */
        var SpecularAnisotropicMethod = (function (_super) {
            __extends(SpecularAnisotropicMethod, _super);
            /**
            * Creates a new SpecularAnisotropicMethod object.
            */
            function SpecularAnisotropicMethod() {
                _super.call(this);
            }
            /**
            * @inheritDoc
            */
            SpecularAnisotropicMethod.prototype.iInitVO = function (shaderObject, methodVO) {
                methodVO.needsTangents = true;
                methodVO.needsView = true;
            };

            /**
            * @inheritDoc
            */
            SpecularAnisotropicMethod.prototype.iGetFragmentCodePerLight = function (shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
                var code = "";
                var t;

                if (this._pIsFirstLight)
                    t = this._pTotalLightColorReg;
                else {
                    t = registerCache.getFreeFragmentVectorTemp();
                    registerCache.addFragmentTempUsages(t, 1);
                }

                // (sin(l,t) * sin(v,t) - cos(l,t)*cos(v,t)) ^ k
                code += "nrm " + t + ".xyz, " + sharedRegisters.tangentVarying + ".xyz\n" + "dp3 " + t + ".w, " + t + ".xyz, " + lightDirReg + ".xyz\n" + "dp3 " + t + ".z, " + t + ".xyz, " + sharedRegisters.viewDirFragment + ".xyz\n";

                // (sin(t.w) * sin(t.z) - cos(t.w)*cos(t.z)) ^ k
                code += "sin " + t + ".x, " + t + ".w\n" + "sin " + t + ".y, " + t + ".z\n" + "mul " + t + ".x, " + t + ".x, " + t + ".y\n" + "cos " + t + ".z, " + t + ".z\n" + "cos " + t + ".w, " + t + ".w\n" + "mul " + t + ".w, " + t + ".w, " + t + ".z\n" + "sub " + t + ".w, " + t + ".x, " + t + ".w\n";

                if (this._pUseTexture) {
                    // apply gloss modulation from texture
                    code += "mul " + this._pSpecularTexData + ".w, " + this._pSpecularTexData + ".y, " + this._pSpecularDataRegister + ".w\n" + "pow " + t + ".w, " + t + ".w, " + this._pSpecularTexData + ".w\n";
                } else
                    code += "pow " + t + ".w, " + t + ".w, " + this._pSpecularDataRegister + ".w\n";

                // attenuate
                code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";

                if (this._iModulateMethod != null)
                    code += this._iModulateMethod(shaderObject, methodVO, t, registerCache, sharedRegisters);

                code += "mul " + t + ".xyz, " + lightColReg + ".xyz, " + t + ".w\n";

                if (!this._pIsFirstLight) {
                    code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + t + ".xyz\n";
                    registerCache.removeFragmentTempUsage(t);
                }

                this._pIsFirstLight = false;

                return code;
            };
            return SpecularAnisotropicMethod;
        })(materials.SpecularBasicMethod);
        materials.SpecularAnisotropicMethod = SpecularAnisotropicMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * SpecularCelMethod provides a shading method to add specular cel (cartoon) shading.
        */
        var SpecularCelMethod = (function (_super) {
            __extends(SpecularCelMethod, _super);
            /**
            * Creates a new SpecularCelMethod object.
            * @param specularCutOff The threshold at which the specular highlight should be shown.
            * @param baseMethod An optional specular method on which the cartoon shading is based. If ommitted, SpecularBasicMethod is used.
            */
            function SpecularCelMethod(specularCutOff, baseMethod) {
                if (typeof specularCutOff === "undefined") { specularCutOff = .5; }
                if (typeof baseMethod === "undefined") { baseMethod = null; }
                var _this = this;
                _super.call(this, null, baseMethod);
                this._smoothness = .1;
                this._specularCutOff = .1;

                this.baseMethod._iModulateMethod = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                    return _this.clampSpecular(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
                };

                this._specularCutOff = specularCutOff;
            }
            Object.defineProperty(SpecularCelMethod.prototype, "smoothness", {
                /**
                * The smoothness of the highlight edge.
                */
                get: function () {
                    return this._smoothness;
                },
                set: function (value) {
                    this._smoothness = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(SpecularCelMethod.prototype, "specularCutOff", {
                /**
                * The threshold at which the specular highlight should be shown.
                */
                get: function () {
                    return this._specularCutOff;
                },
                set: function (value) {
                    this._specularCutOff = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            SpecularCelMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);

                var index = methodVO.secondaryFragmentConstantsIndex;
                var data = shaderObject.fragmentConstantData;
                data[index] = this._smoothness;
                data[index + 1] = this._specularCutOff;
            };

            /**
            * @inheritDoc
            */
            SpecularCelMethod.prototype.iCleanCompilationData = function () {
                _super.prototype.iCleanCompilationData.call(this);
                this._dataReg = null;
            };

            /**
            * Snaps the specular shading strength of the wrapped method to zero or one, depending on whether or not it exceeds the specularCutOff
            * @param vo The MethodVO used to compile the current shader.
            * @param t The register containing the specular strength in the "w" component, and either the half-vector or the reflection vector in "xyz".
            * @param regCache The register cache used for the shader compilation.
            * @param sharedRegisters The shared register data for this shader.
            * @return The AGAL fragment code for the method.
            */
            SpecularCelMethod.prototype.clampSpecular = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                return "sub " + targetReg + ".y, " + targetReg + ".w, " + this._dataReg + ".y\n" + "div " + targetReg + ".y, " + targetReg + ".y, " + this._dataReg + ".x\n" + "sat " + targetReg + ".y, " + targetReg + ".y\n" + "sge " + targetReg + ".w, " + targetReg + ".w, " + this._dataReg + ".y\n" + "mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n";
            };

            /**
            * @inheritDoc
            */
            SpecularCelMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
                this._dataReg = registerCache.getFreeFragmentConstant();
                methodVO.secondaryFragmentConstantsIndex = this._dataReg.index * 4;

                return _super.prototype.iGetFragmentPreLightingCode.call(this, shaderObject, methodVO, registerCache, sharedRegisters);
            };
            return SpecularCelMethod;
        })(materials.SpecularCompositeMethod);
        materials.SpecularCelMethod = SpecularCelMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * SpecularFresnelMethod provides a specular shading method that causes stronger highlights on grazing view angles.
        */
        var SpecularFresnelMethod = (function (_super) {
            __extends(SpecularFresnelMethod, _super);
            /**
            * Creates a new SpecularFresnelMethod object.
            * @param basedOnSurface Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
            * @param baseMethod The specular method to which the fresnel equation. Defaults to SpecularBasicMethod.
            */
            function SpecularFresnelMethod(basedOnSurface, baseMethod) {
                if (typeof basedOnSurface === "undefined") { basedOnSurface = true; }
                if (typeof baseMethod === "undefined") { baseMethod = null; }
                var _this = this;
                // may want to offer diff speculars
                _super.call(this, null, baseMethod);
                this._fresnelPower = 5;
                this._normalReflectance = .028;

                this.baseMethod._iModulateMethod = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                    return _this.modulateSpecular(shaderObject, methodVO, targetReg, registerCache, sharedRegisters);
                };

                this._incidentLight = !basedOnSurface;
            }
            /**
            * @inheritDoc
            */
            SpecularFresnelMethod.prototype.iInitConstants = function (shaderObject, methodVO) {
                var index = methodVO.secondaryFragmentConstantsIndex;
                shaderObject.fragmentConstantData[index + 2] = 1;
                shaderObject.fragmentConstantData[index + 3] = 0;
            };

            Object.defineProperty(SpecularFresnelMethod.prototype, "basedOnSurface", {
                /**
                * Defines whether the fresnel effect should be based on the view angle on the surface (if true), or on the angle between the light and the view.
                */
                get: function () {
                    return !this._incidentLight;
                },
                set: function (value) {
                    if (this._incidentLight != value)
                        return;

                    this._incidentLight = !value;

                    this.iInvalidateShaderProgram();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(SpecularFresnelMethod.prototype, "fresnelPower", {
                /**
                * The power used in the Fresnel equation. Higher values make the fresnel effect more pronounced. Defaults to 5.
                */
                get: function () {
                    return this._fresnelPower;
                },
                set: function (value) {
                    this._fresnelPower = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            SpecularFresnelMethod.prototype.iCleanCompilationData = function () {
                _super.prototype.iCleanCompilationData.call(this);
                this._dataReg = null;
            };

            Object.defineProperty(SpecularFresnelMethod.prototype, "normalReflectance", {
                /**
                * The minimum amount of reflectance, ie the reflectance when the view direction is normal to the surface or light direction.
                */
                get: function () {
                    return this._normalReflectance;
                },
                set: function (value) {
                    this._normalReflectance = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            SpecularFresnelMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
                _super.prototype.iActivate.call(this, shaderObject, methodVO, stage);

                var fragmentData = shaderObject.fragmentConstantData;

                var index = methodVO.secondaryFragmentConstantsIndex;
                fragmentData[index] = this._normalReflectance;
                fragmentData[index + 1] = this._fresnelPower;
            };

            /**
            * @inheritDoc
            */
            SpecularFresnelMethod.prototype.iGetFragmentPreLightingCode = function (shaderObject, methodVO, registerCache, sharedRegisters) {
                this._dataReg = registerCache.getFreeFragmentConstant();

                console.log('SpecularFresnelMethod', 'iGetFragmentPreLightingCode', this._dataReg);

                methodVO.secondaryFragmentConstantsIndex = this._dataReg.index * 4;

                return _super.prototype.iGetFragmentPreLightingCode.call(this, shaderObject, methodVO, registerCache, sharedRegisters);
            };

            /**
            * Applies the fresnel effect to the specular strength.
            *
            * @param vo The MethodVO object containing the method data for the currently compiled material pass.
            * @param target The register containing the specular strength in the "w" component, and the half-vector/reflection vector in "xyz".
            * @param regCache The register cache used for the shader compilation.
            * @param sharedRegisters The shared registers created by the compiler.
            * @return The AGAL fragment code for the method.
            */
            SpecularFresnelMethod.prototype.modulateSpecular = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
                var code;

                code = "dp3 " + targetReg + ".y, " + sharedRegisters.viewDirFragment + ".xyz, " + (this._incidentLight ? targetReg : sharedRegisters.normalFragment) + ".xyz\n" + "sub " + targetReg + ".y, " + this._dataReg + ".z, " + targetReg + ".y\n" + "pow " + targetReg + ".x, " + targetReg + ".y, " + this._dataReg + ".y\n" + "sub " + targetReg + ".y, " + this._dataReg + ".z, " + targetReg + ".y\n" + "mul " + targetReg + ".y, " + this._dataReg + ".x, " + targetReg + ".y\n" + "add " + targetReg + ".y, " + targetReg + ".x, " + targetReg + ".y\n" + "mul " + targetReg + ".w, " + targetReg + ".w, " + targetReg + ".y\n";

                console.log('SpecularFresnelMethod', 'modulateSpecular', code);

                return code;
            };
            return SpecularFresnelMethod;
        })(materials.SpecularCompositeMethod);
        materials.SpecularFresnelMethod = SpecularFresnelMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (materials) {
        /**
        * SpecularPhongMethod provides a specular method that provides Phong highlights.
        */
        var SpecularPhongMethod = (function (_super) {
            __extends(SpecularPhongMethod, _super);
            /**
            * Creates a new SpecularPhongMethod object.
            */
            function SpecularPhongMethod() {
                _super.call(this);
            }
            /**
            * @inheritDoc
            */
            SpecularPhongMethod.prototype.iGetFragmentCodePerLight = function (shaderObject, methodVO, lightDirReg, lightColReg, registerCache, sharedRegisters) {
                var code = "";
                var t;

                if (this._pIsFirstLight) {
                    t = this._pTotalLightColorReg;
                } else {
                    t = registerCache.getFreeFragmentVectorTemp();
                    registerCache.addFragmentTempUsages(t, 1);
                }

                var viewDirReg = sharedRegisters.viewDirFragment;
                var normalReg = sharedRegisters.normalFragment;

                // phong model
                code += "dp3 " + t + ".w, " + lightDirReg + ", " + normalReg + "\n" + "add " + t + ".w, " + t + ".w, " + t + ".w\n" + "mul " + t + ".xyz, " + normalReg + ", " + t + ".w\n" + "sub " + t + ".xyz, " + t + ", " + lightDirReg + "\n" + "add " + t + ".w, " + t + ".w, " + sharedRegisters.commons + ".w\n" + "sat " + t + ".w, " + t + ".w\n" + "mul " + t + ".xyz, " + t + ", " + t + ".w\n" + "dp3 " + t + ".w, " + t + ", " + viewDirReg + "\n" + "sat " + t + ".w, " + t + ".w\n";

                if (this._pUseTexture) {
                    // apply gloss modulation from texture
                    code += "mul " + this._pSpecularTexData + ".w, " + this._pSpecularTexData + ".y, " + this._pSpecularDataRegister + ".w\n" + "pow " + t + ".w, " + t + ".w, " + this._pSpecularTexData + ".w\n";
                } else
                    code += "pow " + t + ".w, " + t + ".w, " + this._pSpecularDataRegister + ".w\n";

                // attenuate
                if (shaderObject.usesLightFallOff)
                    code += "mul " + t + ".w, " + t + ".w, " + lightDirReg + ".w\n";

                if (this._iModulateMethod != null)
                    code += this._iModulateMethod(shaderObject, methodVO, t, registerCache, sharedRegisters);

                code += "mul " + t + ".xyz, " + lightColReg + ".xyz, " + t + ".w\n";

                if (!this._pIsFirstLight) {
                    code += "add " + this._pTotalLightColorReg + ".xyz, " + this._pTotalLightColorReg + ".xyz, " + t + ".xyz\n";
                    registerCache.removeFragmentTempUsage(t);
                }

                this._pIsFirstLight = false;

                return code;
            };
            return SpecularPhongMethod;
        })(materials.SpecularBasicMethod);
        materials.SpecularPhongMethod = SpecularPhongMethod;
    })(away.materials || (away.materials = {}));
    var materials = away.materials;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (utils) {
        var PerspectiveMatrix3D = (function (_super) {
            __extends(PerspectiveMatrix3D, _super);
            function PerspectiveMatrix3D(v) {
                if (typeof v === "undefined") { v = null; }
                _super.call(this, v);
            }
            PerspectiveMatrix3D.prototype.perspectiveFieldOfViewLH = function (fieldOfViewY, aspectRatio, zNear, zFar) {
                var yScale = 1 / Math.tan(fieldOfViewY / 2);
                var xScale = yScale / aspectRatio;
                this.copyRawDataFrom([xScale, 0.0, 0.0, 0.0, 0.0, yScale, 0.0, 0.0, 0.0, 0.0, zFar / (zFar - zNear), 1.0, 0.0, 0.0, (zNear * zFar) / (zNear - zFar), 0.0]);
            };
            return PerspectiveMatrix3D;
        })(away.geom.Matrix3D);
        utils.PerspectiveMatrix3D = PerspectiveMatrix3D;
    })(away.utils || (away.utils = {}));
    var utils = away.utils;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * ...
        */
        var AnimationSubGeometry = (function () {
            function AnimationSubGeometry() {
                this._pVertexBuffer = new Array(8);
                this._pBufferContext = new Array(8);
                this._pBufferDirty = new Array(8);
                this.numProcessedVertices = 0;
                this.previousTime = Number.NEGATIVE_INFINITY;
                this.animationParticles = new Array();
                for (var i = 0; i < 8; i++)
                    this._pBufferDirty[i] = true;

                this._iUniqueId = AnimationSubGeometry.SUBGEOM_ID_COUNT++;
            }
            AnimationSubGeometry.prototype.createVertexData = function (numVertices /*uint*/ , totalLenOfOneVertex /*uint*/ ) {
                this._numVertices = numVertices;
                this._totalLenOfOneVertex = totalLenOfOneVertex;
                this._pVertexData = new Array(numVertices * totalLenOfOneVertex);
            };

            AnimationSubGeometry.prototype.activateVertexBuffer = function (index /*int*/ , bufferOffset /*int*/ , stage, format) {
                var contextIndex = stage.stageIndex;
                var context = stage.context;

                var buffer = this._pVertexBuffer[contextIndex];
                if (!buffer || this._pBufferContext[contextIndex] != context) {
                    buffer = this._pVertexBuffer[contextIndex] = context.createVertexBuffer(this._numVertices, this._totalLenOfOneVertex);
                    this._pBufferContext[contextIndex] = context;
                    this._pBufferDirty[contextIndex] = true;
                }
                if (this._pBufferDirty[contextIndex]) {
                    buffer.uploadFromArray(this._pVertexData, 0, this._numVertices);
                    this._pBufferDirty[contextIndex] = false;
                }
                context.setVertexBufferAt(index, buffer, bufferOffset, format);
            };

            AnimationSubGeometry.prototype.dispose = function () {
                while (this._pVertexBuffer.length) {
                    var vertexBuffer = this._pVertexBuffer.pop();

                    if (vertexBuffer)
                        vertexBuffer.dispose();
                }
            };

            AnimationSubGeometry.prototype.invalidateBuffer = function () {
                for (var i = 0; i < 8; i++)
                    this._pBufferDirty[i] = true;
            };

            Object.defineProperty(AnimationSubGeometry.prototype, "vertexData", {
                get: function () {
                    return this._pVertexData;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AnimationSubGeometry.prototype, "numVertices", {
                get: function () {
                    return this._numVertices;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AnimationSubGeometry.prototype, "totalLenOfOneVertex", {
                get: function () {
                    return this._totalLenOfOneVertex;
                },
                enumerable: true,
                configurable: true
            });
            AnimationSubGeometry.SUBGEOM_ID_COUNT = 0;
            return AnimationSubGeometry;
        })();
        animators.AnimationSubGeometry = AnimationSubGeometry;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ColorSegmentPoint = (function () {
            function ColorSegmentPoint(life, color) {
                //0<life<1
                if (life <= 0 || life >= 1)
                    throw (new Error("life exceeds range (0,1)"));
                this._life = life;
                this._color = color;
            }
            Object.defineProperty(ColorSegmentPoint.prototype, "color", {
                get: function () {
                    return this._color;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ColorSegmentPoint.prototype, "life", {
                get: function () {
                    return this._life;
                },
                enumerable: true,
                configurable: true
            });
            return ColorSegmentPoint;
        })();
        animators.ColorSegmentPoint = ColorSegmentPoint;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var Vector3D = away.geom.Vector3D;
        var Matrix3D = away.geom.Matrix3D;
        var Quaternion = away.geom.Quaternion;

        /**
        * Contains transformation data for a skeleton joint, used for skeleton animation.
        *
        * @see away.animation.Skeleton
        * @see away.animation.SkeletonJoint
        *
        * todo: support (uniform) scale
        */
        var JointPose = (function () {
            function JointPose() {
                /**
                * The rotation of the pose stored as a quaternion
                */
                this.orientation = new Quaternion();
                /**
                * The translation of the pose
                */
                this.translation = new Vector3D();
            }
            /**
            * Converts the transformation to a Matrix3D representation.
            *
            * @param target An optional target matrix to store the transformation. If not provided, it will create a new instance.
            * @return The transformation matrix of the pose.
            */
            JointPose.prototype.toMatrix3D = function (target) {
                if (typeof target === "undefined") { target = null; }
                if (target == null)
                    target = new Matrix3D();

                this.orientation.toMatrix3D(target);
                target.appendTranslation(this.translation.x, this.translation.y, this.translation.z);
                return target;
            };

            /**
            * Copies the transformation data from a source pose object into the existing pose object.
            *
            * @param pose The source pose to copy from.
            */
            JointPose.prototype.copyFrom = function (pose) {
                var or = pose.orientation;
                var tr = pose.translation;
                this.orientation.x = or.x;
                this.orientation.y = or.y;
                this.orientation.z = or.z;
                this.orientation.w = or.w;
                this.translation.x = tr.x;
                this.translation.y = tr.y;
                this.translation.z = tr.z;
            };
            return JointPose;
        })();
        animators.JointPose = JointPose;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * ...
        */
        var ParticleAnimationData = (function () {
            function ParticleAnimationData(index /*uint*/ , startTime, duration, delay, particle) {
                this.index = index;
                this.startTime = startTime;
                this.totalTime = duration + delay;
                this.duration = duration;
                this.delay = delay;
                this.startVertexIndex = particle.startVertexIndex;
                this.numVertices = particle.numVertices;
            }
            return ParticleAnimationData;
        })();
        animators.ParticleAnimationData = ParticleAnimationData;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ParticleData = (function () {
            function ParticleData() {
            }
            return ParticleData;
        })();
        animators.ParticleData = ParticleData;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * Dynamic class for holding the local properties of a particle, used for processing the static properties
        * of particles in the particle animation set before beginning upload to the GPU.
        */
        var ParticleProperties = (function () {
            function ParticleProperties() {
            }
            return ParticleProperties;
        })();
        animators.ParticleProperties = ParticleProperties;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * Options for setting the properties mode of a particle animation node.
        */
        var ParticlePropertiesMode = (function () {
            function ParticlePropertiesMode() {
            }
            ParticlePropertiesMode.GLOBAL = 0;

            ParticlePropertiesMode.LOCAL_STATIC = 1;

            ParticlePropertiesMode.LOCAL_DYNAMIC = 2;
            return ParticlePropertiesMode;
        })();
        animators.ParticlePropertiesMode = ParticlePropertiesMode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var AssetType = away.library.AssetType;

        /**
        * A Skeleton object is a hierarchical grouping of joint objects that can be used for skeletal animation.
        *
        * @see away.animators.SkeletonJoint
        */
        var Skeleton = (function (_super) {
            __extends(Skeleton, _super);
            /**
            * Creates a new <code>Skeleton</code> object
            */
            function Skeleton() {
                _super.call(this);

                // in the long run, it might be a better idea to not store Joint objects, but keep all data in Vectors, that we can upload easily?
                this.joints = new Array();
            }
            Object.defineProperty(Skeleton.prototype, "numJoints", {
                /**
                * The total number of joints in the skeleton.
                */
                get: function () {
                    return this.joints.length;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Returns the joint object in the skeleton with the given name, otherwise returns a null object.
            *
            * @param jointName The name of the joint object to be found.
            * @return The joint object with the given name.
            *
            * @see #joints
            */
            Skeleton.prototype.jointFromName = function (jointName) {
                var jointIndex = this.jointIndexFromName(jointName);
                if (jointIndex != -1)
                    return this.joints[jointIndex];
                else
                    return null;
            };

            /**
            * Returns the joint index, given the joint name. -1 is returned if the joint name is not found.
            *
            * @param jointName The name of the joint object to be found.
            * @return The index of the joint object in the joints Array
            *
            * @see #joints
            */
            Skeleton.prototype.jointIndexFromName = function (jointName) {
                // this is implemented as a linear search, rather than a possibly
                // more optimal method (Dictionary lookup, for example) because:
                // a) it is assumed that it will be called once for each joint
                // b) it is assumed that it will be called only during load, and not during main loop
                // c) maintaining a dictionary (for safety) would dictate an interface to access SkeletonJoints,
                //    rather than direct array access.  this would be sub-optimal.
                var jointIndex;
                var joint;
                for (var i; i < this.joints.length; i++) {
                    joint = this.joints[i];
                    if (joint.name == jointName)
                        return jointIndex;
                    jointIndex++;
                }

                return -1;
            };

            /**
            * @inheritDoc
            */
            Skeleton.prototype.dispose = function () {
                this.joints.length = 0;
            };

            Object.defineProperty(Skeleton.prototype, "assetType", {
                /**
                * @inheritDoc
                */
                get: function () {
                    return AssetType.SKELETON;
                },
                enumerable: true,
                configurable: true
            });
            return Skeleton;
        })(away.library.NamedAssetBase);
        animators.Skeleton = Skeleton;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * Options for setting the animation mode of a vertex animator object.
        *
        * @see away.animators.VertexAnimator
        */
        var VertexAnimationMode = (function () {
            function VertexAnimationMode() {
            }
            VertexAnimationMode.ADDITIVE = "additive";

            VertexAnimationMode.ABSOLUTE = "absolute";
            return VertexAnimationMode;
        })();
        animators.VertexAnimationMode = VertexAnimationMode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * A value obect representing a single joint in a skeleton object.
        *
        * @see away.animators.Skeleton
        */
        var SkeletonJoint = (function () {
            /**
            * Creates a new <code>SkeletonJoint</code> object
            */
            function SkeletonJoint() {
                /**
                * The index of the parent joint in the skeleton's joints vector.
                *
                * @see away.animators.Skeleton#joints
                */
                this.parentIndex = -1;
            }
            return SkeletonJoint;
        })();
        animators.SkeletonJoint = SkeletonJoint;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var AssetType = away.library.AssetType;

        /**
        * A collection of pose objects, determining the pose for an entire skeleton.
        * The <code>jointPoses</code> vector object corresponds to a skeleton's <code>joints</code> vector object, however, there is no
        * reference to a skeleton's instance, since several skeletons can be influenced by the same pose (eg: animation
        * clips are added to any animator with a valid skeleton)
        *
        * @see away.animators.Skeleton
        * @see away.animators.JointPose
        */
        var SkeletonPose = (function (_super) {
            __extends(SkeletonPose, _super);
            /**
            * Creates a new <code>SkeletonPose</code> object.
            */
            function SkeletonPose() {
                _super.call(this);

                this.jointPoses = new Array();
            }
            Object.defineProperty(SkeletonPose.prototype, "numJointPoses", {
                /**
                * The total number of joint poses in the skeleton pose.
                */
                get: function () {
                    return this.jointPoses.length;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SkeletonPose.prototype, "assetType", {
                /**
                * @inheritDoc
                */
                get: function () {
                    return AssetType.SKELETON_POSE;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Returns the joint pose object with the given joint name, otherwise returns a null object.
            *
            * @param jointName The name of the joint object whose pose is to be found.
            * @return The pose object with the given joint name.
            */
            SkeletonPose.prototype.jointPoseFromName = function (jointName) {
                var jointPoseIndex = this.jointPoseIndexFromName(jointName);
                if (jointPoseIndex != -1)
                    return this.jointPoses[jointPoseIndex];
                else
                    return null;
            };

            /**
            * Returns the pose index, given the joint name. -1 is returned if the joint name is not found in the pose.
            *
            * @param The name of the joint object whose pose is to be found.
            * @return The index of the pose object in the jointPoses Array
            *
            * @see #jointPoses
            */
            SkeletonPose.prototype.jointPoseIndexFromName = function (jointName) {
                // this is implemented as a linear search, rather than a possibly
                // more optimal method (Dictionary lookup, for example) because:
                // a) it is assumed that it will be called once for each joint
                // b) it is assumed that it will be called only during load, and not during main loop
                // c) maintaining a dictionary (for safety) would dictate an interface to access JointPoses,
                //    rather than direct array access.  this would be sub-optimal.
                var jointPoseIndex;
                var jointPose;
                for (var i; i < this.jointPoses.length; i++) {
                    jointPose = this.jointPoses[i];
                    if (jointPose.name == jointName)
                        return jointPoseIndex;
                    jointPoseIndex++;
                }

                return -1;
            };

            /**
            * Creates a copy of the <code>SkeletonPose</code> object, with a dulpicate of its component joint poses.
            *
            * @return SkeletonPose
            */
            SkeletonPose.prototype.clone = function () {
                var clone = new SkeletonPose();
                var numJointPoses = this.jointPoses.length;
                for (var i = 0; i < numJointPoses; i++) {
                    var cloneJointPose = new animators.JointPose();
                    var thisJointPose = this.jointPoses[i];
                    cloneJointPose.name = thisJointPose.name;
                    cloneJointPose.copyFrom(thisJointPose);
                    clone.jointPoses[i] = cloneJointPose;
                }
                return clone;
            };

            /**
            * @inheritDoc
            */
            SkeletonPose.prototype.dispose = function () {
                this.jointPoses.length = 0;
            };
            return SkeletonPose;
        })(away.library.NamedAssetBase);
        animators.SkeletonPose = SkeletonPose;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * Provides an abstract base class for nodes with time-based animation data in an animation blend tree.
        */
        var AnimationClipNodeBase = (function (_super) {
            __extends(AnimationClipNodeBase, _super);
            /**
            * Creates a new <code>AnimationClipNodeBase</code> object.
            */
            function AnimationClipNodeBase() {
                _super.call(this);
                this._pLooping = true;
                this._pTotalDuration = 0;
                this._pStitchDirty = true;
                this._pStitchFinalFrame = false;
                this._pNumFrames = 0;
                this._pDurations = new Array();
                /*uint*/
                this._pTotalDelta = new away.geom.Vector3D();
                this.fixedFrameRate = true;
            }
            Object.defineProperty(AnimationClipNodeBase.prototype, "looping", {
                /**
                * Determines whether the contents of the animation node have looping characteristics enabled.
                */
                get: function () {
                    return this._pLooping;
                },
                set: function (value) {
                    if (this._pLooping == value)
                        return;

                    this._pLooping = value;

                    this._pStitchDirty = true;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AnimationClipNodeBase.prototype, "stitchFinalFrame", {
                /**
                * Defines if looping content blends the final frame of animation data with the first (true) or works on the
                * assumption that both first and last frames are identical (false). Defaults to false.
                */
                get: function () {
                    return this._pStitchFinalFrame;
                },
                set: function (value) {
                    if (this._pStitchFinalFrame == value)
                        return;

                    this._pStitchFinalFrame = value;

                    this._pStitchDirty = true;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AnimationClipNodeBase.prototype, "totalDuration", {
                get: function () {
                    if (this._pStitchDirty)
                        this._pUpdateStitch();

                    return this._pTotalDuration;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AnimationClipNodeBase.prototype, "totalDelta", {
                get: function () {
                    if (this._pStitchDirty)
                        this._pUpdateStitch();

                    return this._pTotalDelta;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AnimationClipNodeBase.prototype, "lastFrame", {
                get: function () {
                    if (this._pStitchDirty)
                        this._pUpdateStitch();

                    return this._pLastFrame;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AnimationClipNodeBase.prototype, "durations", {
                /**
                * Returns a vector of time values representing the duration (in milliseconds) of each animation frame in the clip.
                */
                get: function () {
                    return this._pDurations;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Updates the node's final frame stitch state.
            *
            * @see #stitchFinalFrame
            */
            AnimationClipNodeBase.prototype._pUpdateStitch = function () {
                this._pStitchDirty = false;

                this._pLastFrame = (this._pStitchFinalFrame) ? this._pNumFrames : this._pNumFrames - 1;

                this._pTotalDuration = 0;
                this._pTotalDelta.x = 0;
                this._pTotalDelta.y = 0;
                this._pTotalDelta.z = 0;
            };
            return AnimationClipNodeBase;
        })(animators.AnimationNodeBase);
        animators.AnimationClipNodeBase = AnimationClipNodeBase;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * Provides an abstract base class for particle animation nodes.
        */
        var ParticleNodeBase = (function (_super) {
            __extends(ParticleNodeBase, _super);
            /**
            * Creates a new <code>ParticleNodeBase</code> object.
            *
            * @param               name            Defines the generic name of the particle animation node.
            * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
            * @param               dataLength      Defines the length of the data used by the node when in <code>LOCAL_STATIC</code> mode.
            * @param    [optional] priority        the priority of the particle animation node, used to order the agal generated in a particle animation set. Defaults to 1.
            */
            function ParticleNodeBase(name, mode /*uint*/ , dataLength /*uint*/ , priority) {
                if (typeof priority === "undefined") { priority = 1; }
                _super.call(this);
                this._pDataLength = 3;

                name = name + ParticleNodeBase.MODES[mode];

                this.name = name;
                this._pMode = mode;
                this._priority = priority;
                this._pDataLength = dataLength;

                this._pOneData = new Array(this._pDataLength);
            }
            Object.defineProperty(ParticleNodeBase.prototype, "mode", {
                /**
                * Returns the property mode of the particle animation node. Typically set in the node constructor
                *
                * @see away.animators.ParticlePropertiesMode
                */
                get: function () {
                    return this._pMode;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ParticleNodeBase.prototype, "priority", {
                /**
                * Returns the priority of the particle animation node, used to order the agal generated in a particle animation set. Set automatically on instantiation.
                *
                * @see away.animators.ParticleAnimationSet
                * @see #getAGALVertexCode
                */
                get: function () {
                    return this._priority;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ParticleNodeBase.prototype, "dataLength", {
                /**
                * Returns the length of the data used by the node when in <code>LOCAL_STATIC</code> mode. Used to generate the local static data of the particle animation set.
                *
                * @see away.animators.ParticleAnimationSet
                * @see #getAGALVertexCode
                */
                get: function () {
                    return this._pDataLength;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ParticleNodeBase.prototype, "oneData", {
                /**
                * Returns the generated data vector of the node after one particle pass during the generation of all local static data of the particle animation set.
                *
                * @see away.animators.ParticleAnimationSet
                * @see #generatePropertyOfOneParticle
                */
                get: function () {
                    return this._pOneData;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Returns the AGAL code of the particle animation node for use in the vertex shader.
            */
            ParticleNodeBase.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
                return "";
            };

            /**
            * Returns the AGAL code of the particle animation node for use in the fragment shader.
            */
            ParticleNodeBase.prototype.getAGALFragmentCode = function (shaderObject, animationRegisterCache) {
                return "";
            };

            /**
            * Returns the AGAL code of the particle animation node for use in the fragment shader when UV coordinates are required.
            */
            ParticleNodeBase.prototype.getAGALUVCode = function (shaderObject, animationRegisterCache) {
                return "";
            };

            /**
            * Called internally by the particle animation set when assigning the set of static properties originally defined by the initParticleFunc of the set.
            *
            * @see away.animators.ParticleAnimationSet#initParticleFunc
            */
            ParticleNodeBase.prototype._iGeneratePropertyOfOneParticle = function (param) {
            };

            /**
            * Called internally by the particle animation set when determining the requirements of the particle animation node AGAL.
            */
            ParticleNodeBase.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
            };
            ParticleNodeBase.GLOBAL = 'Global';
            ParticleNodeBase.LOCAL_STATIC = 'LocalStatic';
            ParticleNodeBase.LOCAL_DYNAMIC = 'LocalDynamic';

            ParticleNodeBase.MODES = {
                0: ParticleNodeBase.GLOBAL,
                1: ParticleNodeBase.LOCAL_STATIC,
                2: ParticleNodeBase.LOCAL_DYNAMIC
            };
            return ParticleNodeBase;
        })(animators.AnimationNodeBase);
        animators.ParticleNodeBase = ParticleNodeBase;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var Vector3D = away.geom.Vector3D;

        /**
        * A particle animation node used to apply a constant acceleration vector to the motion of a particle.
        */
        var ParticleAccelerationNode = (function (_super) {
            __extends(ParticleAccelerationNode, _super);
            /**
            * Creates a new <code>ParticleAccelerationNode</code>
            *
            * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
            * @param    [optional] acceleration    Defines the default acceleration vector of the node, used when in global mode.
            */
            function ParticleAccelerationNode(mode /*uint*/ , acceleration) {
                if (typeof acceleration === "undefined") { acceleration = null; }
                _super.call(this, "ParticleAcceleration", mode, 3);

                this._pStateClass = animators.ParticleAccelerationState;

                this._acceleration = acceleration || new Vector3D();
            }
            /**
            * @inheritDoc
            */
            ParticleAccelerationNode.prototype.pGetAGALVertexCode = function (shaderObject, animationRegisterCache) {
                var accelerationValue = (this._pMode == animators.ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
                animationRegisterCache.setRegisterIndex(this, ParticleAccelerationNode.ACCELERATION_INDEX, accelerationValue.index);

                var temp = animationRegisterCache.getFreeVertexVectorTemp();
                animationRegisterCache.addVertexTempUsages(temp, 1);

                var code = "mul " + temp + "," + animationRegisterCache.vertexTime + "," + accelerationValue + "\n";

                if (animationRegisterCache.needVelocity) {
                    var temp2 = animationRegisterCache.getFreeVertexVectorTemp();
                    code += "mul " + temp2 + "," + temp + "," + animationRegisterCache.vertexTwoConst + "\n";
                    code += "add " + animationRegisterCache.velocityTarget + ".xyz," + temp2 + ".xyz," + animationRegisterCache.velocityTarget + ".xyz\n";
                }
                animationRegisterCache.removeVertexTempUsage(temp);

                code += "mul " + temp + "," + temp + "," + animationRegisterCache.vertexTime + "\n";
                code += "add " + animationRegisterCache.positionTarget + ".xyz," + temp + "," + animationRegisterCache.positionTarget + ".xyz\n";
                return code;
            };

            /**
            * @inheritDoc
            */
            ParticleAccelerationNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };

            /**
            * @inheritDoc
            */
            ParticleAccelerationNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
                var tempAcceleration = param[ParticleAccelerationNode.ACCELERATION_VECTOR3D];
                if (!tempAcceleration)
                    throw new Error("there is no " + ParticleAccelerationNode.ACCELERATION_VECTOR3D + " in param!");

                this._pOneData[0] = tempAcceleration.x / 2;
                this._pOneData[1] = tempAcceleration.y / 2;
                this._pOneData[2] = tempAcceleration.z / 2;
            };
            ParticleAccelerationNode.ACCELERATION_INDEX = 0;

            ParticleAccelerationNode.ACCELERATION_VECTOR3D = "AccelerationVector3D";
            return ParticleAccelerationNode;
        })(animators.ParticleNodeBase);
        animators.ParticleAccelerationNode = ParticleAccelerationNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var Vector3D = away.geom.Vector3D;

        var ShaderRegisterElement = away.materials.ShaderRegisterElement;

        /**
        * A particle animation node used to control the position of a particle over time along a bezier curve.
        */
        var ParticleBezierCurveNode = (function (_super) {
            __extends(ParticleBezierCurveNode, _super);
            /**
            * Creates a new <code>ParticleBezierCurveNode</code>
            *
            * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
            * @param    [optional] controlPoint    Defines the default control point of the node, used when in global mode.
            * @param    [optional] endPoint        Defines the default end point of the node, used when in global mode.
            */
            function ParticleBezierCurveNode(mode /*uint*/ , controlPoint, endPoint) {
                if (typeof controlPoint === "undefined") { controlPoint = null; }
                if (typeof endPoint === "undefined") { endPoint = null; }
                _super.call(this, "ParticleBezierCurve", mode, 6);

                this._pStateClass = animators.ParticleBezierCurveState;

                this._iControlPoint = controlPoint || new Vector3D();
                this._iEndPoint = endPoint || new Vector3D();
            }
            /**
            * @inheritDoc
            */
            ParticleBezierCurveNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
                var controlValue = (this._pMode == animators.ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
                animationRegisterCache.setRegisterIndex(this, ParticleBezierCurveNode.BEZIER_CONTROL_INDEX, controlValue.index);

                var endValue = (this._pMode == animators.ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
                animationRegisterCache.setRegisterIndex(this, ParticleBezierCurveNode.BEZIER_END_INDEX, endValue.index);

                var temp = animationRegisterCache.getFreeVertexVectorTemp();
                var rev_time = new ShaderRegisterElement(temp.regName, temp.index, 0);
                var time_2 = new ShaderRegisterElement(temp.regName, temp.index, 1);
                var time_temp = new ShaderRegisterElement(temp.regName, temp.index, 2);
                animationRegisterCache.addVertexTempUsages(temp, 1);
                var temp2 = animationRegisterCache.getFreeVertexVectorTemp();
                var distance = new ShaderRegisterElement(temp2.regName, temp2.index);
                animationRegisterCache.removeVertexTempUsage(temp);

                var code = "";
                code += "sub " + rev_time + "," + animationRegisterCache.vertexOneConst + "," + animationRegisterCache.vertexLife + "\n";
                code += "mul " + time_2 + "," + animationRegisterCache.vertexLife + "," + animationRegisterCache.vertexLife + "\n";

                code += "mul " + time_temp + "," + animationRegisterCache.vertexLife + "," + rev_time + "\n";
                code += "mul " + time_temp + "," + time_temp + "," + animationRegisterCache.vertexTwoConst + "\n";
                code += "mul " + distance + ".xyz," + time_temp + "," + controlValue + "\n";
                code += "add " + animationRegisterCache.positionTarget + ".xyz," + distance + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";
                code += "mul " + distance + ".xyz," + time_2 + "," + endValue + "\n";
                code += "add " + animationRegisterCache.positionTarget + ".xyz," + distance + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";

                if (animationRegisterCache.needVelocity) {
                    code += "mul " + time_2 + "," + animationRegisterCache.vertexLife + "," + animationRegisterCache.vertexTwoConst + "\n";
                    code += "sub " + time_temp + "," + animationRegisterCache.vertexOneConst + "," + time_2 + "\n";
                    code += "mul " + time_temp + "," + animationRegisterCache.vertexTwoConst + "," + time_temp + "\n";
                    code += "mul " + distance + ".xyz," + controlValue + "," + time_temp + "\n";
                    code += "add " + animationRegisterCache.velocityTarget + ".xyz," + distance + ".xyz," + animationRegisterCache.velocityTarget + ".xyz\n";
                    code += "mul " + distance + ".xyz," + endValue + "," + time_2 + "\n";
                    code += "add " + animationRegisterCache.velocityTarget + ".xyz," + distance + ".xyz," + animationRegisterCache.velocityTarget + ".xyz\n";
                }

                return code;
            };

            /**
            * @inheritDoc
            */
            ParticleBezierCurveNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };

            /**
            * @inheritDoc
            */
            ParticleBezierCurveNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
                var bezierControl = param[ParticleBezierCurveNode.BEZIER_CONTROL_VECTOR3D];
                if (!bezierControl)
                    throw new Error("there is no " + ParticleBezierCurveNode.BEZIER_CONTROL_VECTOR3D + " in param!");

                var bezierEnd = param[ParticleBezierCurveNode.BEZIER_END_VECTOR3D];
                if (!bezierEnd)
                    throw new Error("there is no " + ParticleBezierCurveNode.BEZIER_END_VECTOR3D + " in param!");

                this._pOneData[0] = bezierControl.x;
                this._pOneData[1] = bezierControl.y;
                this._pOneData[2] = bezierControl.z;
                this._pOneData[3] = bezierEnd.x;
                this._pOneData[4] = bezierEnd.y;
                this._pOneData[5] = bezierEnd.z;
            };
            ParticleBezierCurveNode.BEZIER_CONTROL_INDEX = 0;

            ParticleBezierCurveNode.BEZIER_END_INDEX = 1;

            ParticleBezierCurveNode.BEZIER_CONTROL_VECTOR3D = "BezierControlVector3D";

            ParticleBezierCurveNode.BEZIER_END_VECTOR3D = "BezierEndVector3D";
            return ParticleBezierCurveNode;
        })(animators.ParticleNodeBase);
        animators.ParticleBezierCurveNode = ParticleBezierCurveNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * A particle animation node that controls the rotation of a particle to always face the camera.
        */
        var ParticleBillboardNode = (function (_super) {
            __extends(ParticleBillboardNode, _super);
            /**
            * Creates a new <code>ParticleBillboardNode</code>
            */
            function ParticleBillboardNode(billboardAxis) {
                if (typeof billboardAxis === "undefined") { billboardAxis = null; }
                _super.call(this, "ParticleBillboard", animators.ParticlePropertiesMode.GLOBAL, 0, 4);

                this._pStateClass = animators.ParticleBillboardState;

                this._iBillboardAxis = billboardAxis;
            }
            /**
            * @inheritDoc
            */
            ParticleBillboardNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
                var rotationMatrixRegister = animationRegisterCache.getFreeVertexConstant();
                animationRegisterCache.setRegisterIndex(this, ParticleBillboardNode.MATRIX_INDEX, rotationMatrixRegister.index);
                animationRegisterCache.getFreeVertexConstant();
                animationRegisterCache.getFreeVertexConstant();
                animationRegisterCache.getFreeVertexConstant();

                var temp = animationRegisterCache.getFreeVertexVectorTemp();

                var code = "m33 " + temp + ".xyz," + animationRegisterCache.scaleAndRotateTarget + "," + rotationMatrixRegister + "\n" + "mov " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp + "\n";

                var shaderRegisterElement;
                for (var i = 0; i < animationRegisterCache.rotationRegisters.length; i++) {
                    shaderRegisterElement = animationRegisterCache.rotationRegisters[i];
                    code += "m33 " + temp + ".xyz," + shaderRegisterElement + "," + rotationMatrixRegister + "\n" + "mov " + shaderRegisterElement + ".xyz," + shaderRegisterElement + "\n";
                }

                return code;
            };

            /**
            * @inheritDoc
            */
            ParticleBillboardNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };

            /**
            * @inheritDoc
            */
            ParticleBillboardNode.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
                particleAnimationSet.hasBillboard = true;
            };
            ParticleBillboardNode.MATRIX_INDEX = 0;
            return ParticleBillboardNode;
        })(animators.ParticleNodeBase);
        animators.ParticleBillboardNode = ParticleBillboardNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ColorTransform = away.geom.ColorTransform;

        /**
        * A particle animation node used to control the color variation of a particle over time.
        */
        var ParticleColorNode = (function (_super) {
            __extends(ParticleColorNode, _super);
            /**
            * Creates a new <code>ParticleColorNode</code>
            *
            * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
            * @param    [optional] usesMultiplier  Defines whether the node uses multiplier data in the shader for its color transformations. Defaults to true.
            * @param    [optional] usesOffset      Defines whether the node uses offset data in the shader for its color transformations. Defaults to true.
            * @param    [optional] usesCycle       Defines whether the node uses the <code>cycleDuration</code> property in the shader to calculate the period of the animation independent of particle duration. Defaults to false.
            * @param    [optional] usesPhase       Defines whether the node uses the <code>cyclePhase</code> property in the shader to calculate a starting offset to the cycle rotation of the particle. Defaults to false.
            * @param    [optional] startColor      Defines the default start color transform of the node, when in global mode.
            * @param    [optional] endColor        Defines the default end color transform of the node, when in global mode.
            * @param    [optional] cycleDuration   Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
            * @param    [optional] cyclePhase      Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
            */
            function ParticleColorNode(mode /*uint*/ , usesMultiplier, usesOffset, usesCycle, usesPhase, startColor, endColor, cycleDuration, cyclePhase) {
                if (typeof usesMultiplier === "undefined") { usesMultiplier = true; }
                if (typeof usesOffset === "undefined") { usesOffset = true; }
                if (typeof usesCycle === "undefined") { usesCycle = false; }
                if (typeof usesPhase === "undefined") { usesPhase = false; }
                if (typeof startColor === "undefined") { startColor = null; }
                if (typeof endColor === "undefined") { endColor = null; }
                if (typeof cycleDuration === "undefined") { cycleDuration = 1; }
                if (typeof cyclePhase === "undefined") { cyclePhase = 0; }
                _super.call(this, "ParticleColor", mode, (usesMultiplier && usesOffset) ? 16 : 8, animators.ParticleAnimationSet.COLOR_PRIORITY);

                this._pStateClass = animators.ParticleColorState;

                this._iUsesMultiplier = usesMultiplier;
                this._iUsesOffset = usesOffset;
                this._iUsesCycle = usesCycle;
                this._iUsesPhase = usesPhase;

                this._iStartColor = startColor || new ColorTransform();
                this._iEndColor = endColor || new ColorTransform();
                this._iCycleDuration = cycleDuration;
                this._iCyclePhase = cyclePhase;
            }
            /**
            * @inheritDoc
            */
            ParticleColorNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
                var code = "";
                if (animationRegisterCache.needFragmentAnimation) {
                    var temp = animationRegisterCache.getFreeVertexVectorTemp();

                    if (this._iUsesCycle) {
                        var cycleConst = animationRegisterCache.getFreeVertexConstant();
                        animationRegisterCache.setRegisterIndex(this, ParticleColorNode.CYCLE_INDEX, cycleConst.index);

                        animationRegisterCache.addVertexTempUsages(temp, 1);
                        var sin = animationRegisterCache.getFreeVertexSingleTemp();
                        animationRegisterCache.removeVertexTempUsage(temp);

                        code += "mul " + sin + "," + animationRegisterCache.vertexTime + "," + cycleConst + ".x\n";

                        if (this._iUsesPhase)
                            code += "add " + sin + "," + sin + "," + cycleConst + ".y\n";

                        code += "sin " + sin + "," + sin + "\n";
                    }

                    if (this._iUsesMultiplier) {
                        var startMultiplierValue = (this._pMode == animators.ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
                        var deltaMultiplierValue = (this._pMode == animators.ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();

                        animationRegisterCache.setRegisterIndex(this, ParticleColorNode.START_MULTIPLIER_INDEX, startMultiplierValue.index);
                        animationRegisterCache.setRegisterIndex(this, ParticleColorNode.DELTA_MULTIPLIER_INDEX, deltaMultiplierValue.index);

                        code += "mul " + temp + "," + deltaMultiplierValue + "," + (this._iUsesCycle ? sin : animationRegisterCache.vertexLife) + "\n";
                        code += "add " + temp + "," + temp + "," + startMultiplierValue + "\n";
                        code += "mul " + animationRegisterCache.colorMulTarget + "," + temp + "," + animationRegisterCache.colorMulTarget + "\n";
                    }

                    if (this._iUsesOffset) {
                        var startOffsetValue = (this._pMode == animators.ParticlePropertiesMode.LOCAL_STATIC) ? animationRegisterCache.getFreeVertexAttribute() : animationRegisterCache.getFreeVertexConstant();
                        var deltaOffsetValue = (this._pMode == animators.ParticlePropertiesMode.LOCAL_STATIC) ? animationRegisterCache.getFreeVertexAttribute() : animationRegisterCache.getFreeVertexConstant();

                        animationRegisterCache.setRegisterIndex(this, ParticleColorNode.START_OFFSET_INDEX, startOffsetValue.index);
                        animationRegisterCache.setRegisterIndex(this, ParticleColorNode.DELTA_OFFSET_INDEX, deltaOffsetValue.index);

                        code += "mul " + temp + "," + deltaOffsetValue + "," + (this._iUsesCycle ? sin : animationRegisterCache.vertexLife) + "\n";
                        code += "add " + temp + "," + temp + "," + startOffsetValue + "\n";
                        code += "add " + animationRegisterCache.colorAddTarget + "," + temp + "," + animationRegisterCache.colorAddTarget + "\n";
                    }
                }

                return code;
            };

            /**
            * @inheritDoc
            */
            ParticleColorNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };

            /**
            * @inheritDoc
            */
            ParticleColorNode.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
                if (this._iUsesMultiplier)
                    particleAnimationSet.hasColorMulNode = true;
                if (this._iUsesOffset)
                    particleAnimationSet.hasColorAddNode = true;
            };

            /**
            * @inheritDoc
            */
            ParticleColorNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
                var startColor = param[ParticleColorNode.COLOR_START_COLORTRANSFORM];
                if (!startColor)
                    throw (new Error("there is no " + ParticleColorNode.COLOR_START_COLORTRANSFORM + " in param!"));

                var endColor = param[ParticleColorNode.COLOR_END_COLORTRANSFORM];
                if (!endColor)
                    throw (new Error("there is no " + ParticleColorNode.COLOR_END_COLORTRANSFORM + " in param!"));

                var i = 0;

                if (!this._iUsesCycle) {
                    //multiplier
                    if (this._iUsesMultiplier) {
                        this._pOneData[i++] = startColor.redMultiplier;
                        this._pOneData[i++] = startColor.greenMultiplier;
                        this._pOneData[i++] = startColor.blueMultiplier;
                        this._pOneData[i++] = startColor.alphaMultiplier;
                        this._pOneData[i++] = endColor.redMultiplier - startColor.redMultiplier;
                        this._pOneData[i++] = endColor.greenMultiplier - startColor.greenMultiplier;
                        this._pOneData[i++] = endColor.blueMultiplier - startColor.blueMultiplier;
                        this._pOneData[i++] = endColor.alphaMultiplier - startColor.alphaMultiplier;
                    }

                    //offset
                    if (this._iUsesOffset) {
                        this._pOneData[i++] = startColor.redOffset / 255;
                        this._pOneData[i++] = startColor.greenOffset / 255;
                        this._pOneData[i++] = startColor.blueOffset / 255;
                        this._pOneData[i++] = startColor.alphaOffset / 255;
                        this._pOneData[i++] = (endColor.redOffset - startColor.redOffset) / 255;
                        this._pOneData[i++] = (endColor.greenOffset - startColor.greenOffset) / 255;
                        this._pOneData[i++] = (endColor.blueOffset - startColor.blueOffset) / 255;
                        this._pOneData[i++] = (endColor.alphaOffset - startColor.alphaOffset) / 255;
                    }
                } else {
                    //multiplier
                    if (this._iUsesMultiplier) {
                        this._pOneData[i++] = (startColor.redMultiplier + endColor.redMultiplier) / 2;
                        this._pOneData[i++] = (startColor.greenMultiplier + endColor.greenMultiplier) / 2;
                        this._pOneData[i++] = (startColor.blueMultiplier + endColor.blueMultiplier) / 2;
                        this._pOneData[i++] = (startColor.alphaMultiplier + endColor.alphaMultiplier) / 2;
                        this._pOneData[i++] = (startColor.redMultiplier - endColor.redMultiplier) / 2;
                        this._pOneData[i++] = (startColor.greenMultiplier - endColor.greenMultiplier) / 2;
                        this._pOneData[i++] = (startColor.blueMultiplier - endColor.blueMultiplier) / 2;
                        this._pOneData[i++] = (startColor.alphaMultiplier - endColor.alphaMultiplier) / 2;
                    }

                    //offset
                    if (this._iUsesOffset) {
                        this._pOneData[i++] = (startColor.redOffset + endColor.redOffset) / (255 * 2);
                        this._pOneData[i++] = (startColor.greenOffset + endColor.greenOffset) / (255 * 2);
                        this._pOneData[i++] = (startColor.blueOffset + endColor.blueOffset) / (255 * 2);
                        this._pOneData[i++] = (startColor.alphaOffset + endColor.alphaOffset) / (255 * 2);
                        this._pOneData[i++] = (startColor.redOffset - endColor.redOffset) / (255 * 2);
                        this._pOneData[i++] = (startColor.greenOffset - endColor.greenOffset) / (255 * 2);
                        this._pOneData[i++] = (startColor.blueOffset - endColor.blueOffset) / (255 * 2);
                        this._pOneData[i++] = (startColor.alphaOffset - endColor.alphaOffset) / (255 * 2);
                    }
                }
            };
            ParticleColorNode.START_MULTIPLIER_INDEX = 0;

            ParticleColorNode.DELTA_MULTIPLIER_INDEX = 1;

            ParticleColorNode.START_OFFSET_INDEX = 2;

            ParticleColorNode.DELTA_OFFSET_INDEX = 3;

            ParticleColorNode.CYCLE_INDEX = 4;

            ParticleColorNode.COLOR_START_COLORTRANSFORM = "ColorStartColorTransform";

            ParticleColorNode.COLOR_END_COLORTRANSFORM = "ColorEndColorTransform";
            return ParticleColorNode;
        })(animators.ParticleNodeBase);
        animators.ParticleColorNode = ParticleColorNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * A particle animation node used to create a follow behaviour on a particle system.
        */
        var ParticleFollowNode = (function (_super) {
            __extends(ParticleFollowNode, _super);
            /**
            * Creates a new <code>ParticleFollowNode</code>
            *
            * @param    [optional] usesPosition     Defines wehether the individual particle reacts to the position of the target.
            * @param    [optional] usesRotation     Defines wehether the individual particle reacts to the rotation of the target.
            * @param    [optional] smooth     Defines wehether the state calculate the interpolated value.
            */
            function ParticleFollowNode(usesPosition, usesRotation, smooth) {
                if (typeof usesPosition === "undefined") { usesPosition = true; }
                if (typeof usesRotation === "undefined") { usesRotation = true; }
                if (typeof smooth === "undefined") { smooth = false; }
                _super.call(this, "ParticleFollow", animators.ParticlePropertiesMode.LOCAL_DYNAMIC, (usesPosition && usesRotation) ? 6 : 3, animators.ParticleAnimationSet.POST_PRIORITY);

                this._pStateClass = animators.ParticleFollowState;

                this._iUsesPosition = usesPosition;
                this._iUsesRotation = usesRotation;
                this._iSmooth = smooth;
            }
            /**
            * @inheritDoc
            */
            ParticleFollowNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
                //TODO: use Quaternion to implement this function
                var code = "";
                if (this._iUsesRotation) {
                    var rotationAttribute = animationRegisterCache.getFreeVertexAttribute();
                    animationRegisterCache.setRegisterIndex(this, ParticleFollowNode.FOLLOW_ROTATION_INDEX, rotationAttribute.index);

                    var temp1 = animationRegisterCache.getFreeVertexVectorTemp();
                    animationRegisterCache.addVertexTempUsages(temp1, 1);
                    var temp2 = animationRegisterCache.getFreeVertexVectorTemp();
                    animationRegisterCache.addVertexTempUsages(temp2, 1);
                    var temp3 = animationRegisterCache.getFreeVertexVectorTemp();

                    var temp4;
                    if (animationRegisterCache.hasBillboard) {
                        animationRegisterCache.addVertexTempUsages(temp3, 1);
                        temp4 = animationRegisterCache.getFreeVertexVectorTemp();
                    }

                    animationRegisterCache.removeVertexTempUsage(temp1);
                    animationRegisterCache.removeVertexTempUsage(temp2);
                    if (animationRegisterCache.hasBillboard)
                        animationRegisterCache.removeVertexTempUsage(temp3);

                    var len = animationRegisterCache.rotationRegisters.length;
                    var i;

                    //x axis
                    code += "mov " + temp1 + "," + animationRegisterCache.vertexZeroConst + "\n";
                    code += "mov " + temp1 + ".x," + animationRegisterCache.vertexOneConst + "\n";
                    code += "mov " + temp3 + "," + animationRegisterCache.vertexZeroConst + "\n";
                    code += "sin " + temp3 + ".y," + rotationAttribute + ".x\n";
                    code += "cos " + temp3 + ".z," + rotationAttribute + ".x\n";
                    code += "mov " + temp2 + ".x," + animationRegisterCache.vertexZeroConst + "\n";
                    code += "mov " + temp2 + ".y," + temp3 + ".z\n";
                    code += "neg " + temp2 + ".z," + temp3 + ".y\n";

                    if (animationRegisterCache.hasBillboard)
                        code += "m33 " + temp4 + ".xyz," + animationRegisterCache.positionTarget + ".xyz," + temp1 + "\n";
                    else {
                        code += "m33 " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
                        for (i = 0; i < len; i++)
                            code += "m33 " + animationRegisterCache.rotationRegisters[i] + ".xyz," + animationRegisterCache.rotationRegisters[i] + "," + temp1 + "\n";
                    }

                    //y axis
                    code += "mov " + temp1 + "," + animationRegisterCache.vertexZeroConst + "\n";
                    code += "cos " + temp1 + ".x," + rotationAttribute + ".y\n";
                    code += "sin " + temp1 + ".z," + rotationAttribute + ".y\n";
                    code += "mov " + temp2 + "," + animationRegisterCache.vertexZeroConst + "\n";
                    code += "mov " + temp2 + ".y," + animationRegisterCache.vertexOneConst + "\n";
                    code += "mov " + temp3 + "," + animationRegisterCache.vertexZeroConst + "\n";
                    code += "neg " + temp3 + ".x," + temp1 + ".z\n";
                    code += "mov " + temp3 + ".z," + temp1 + ".x\n";

                    if (animationRegisterCache.hasBillboard)
                        code += "m33 " + temp4 + ".xyz," + temp4 + ".xyz," + temp1 + "\n";
                    else {
                        code += "m33 " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
                        for (i = 0; i < len; i++)
                            code += "m33 " + animationRegisterCache.rotationRegisters[i] + ".xyz," + animationRegisterCache.rotationRegisters[i] + "," + temp1 + "\n";
                    }

                    //z axis
                    code += "mov " + temp2 + "," + animationRegisterCache.vertexZeroConst + "\n";
                    code += "sin " + temp2 + ".x," + rotationAttribute + ".z\n";
                    code += "cos " + temp2 + ".y," + rotationAttribute + ".z\n";
                    code += "mov " + temp1 + "," + animationRegisterCache.vertexZeroConst + "\n";
                    code += "mov " + temp1 + ".x," + temp2 + ".y\n";
                    code += "neg " + temp1 + ".y," + temp2 + ".x\n";
                    code += "mov " + temp3 + "," + animationRegisterCache.vertexZeroConst + "\n";
                    code += "mov " + temp3 + ".z," + animationRegisterCache.vertexOneConst + "\n";

                    if (animationRegisterCache.hasBillboard) {
                        code += "m33 " + temp4 + ".xyz," + temp4 + ".xyz," + temp1 + "\n";
                        code += "sub " + temp4 + ".xyz," + temp4 + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";
                        code += "add " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp4 + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";
                    } else {
                        code += "m33 " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
                        for (i = 0; i < len; i++)
                            code += "m33 " + animationRegisterCache.rotationRegisters[i] + ".xyz," + animationRegisterCache.rotationRegisters[i] + "," + temp1 + "\n";
                    }
                }

                if (this._iUsesPosition) {
                    var positionAttribute = animationRegisterCache.getFreeVertexAttribute();
                    animationRegisterCache.setRegisterIndex(this, ParticleFollowNode.FOLLOW_POSITION_INDEX, positionAttribute.index);
                    code += "add " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + positionAttribute + "," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";
                }

                return code;
            };

            /**
            * @inheritDoc
            */
            ParticleFollowNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };
            ParticleFollowNode.FOLLOW_POSITION_INDEX = 0;

            ParticleFollowNode.FOLLOW_ROTATION_INDEX = 1;
            return ParticleFollowNode;
        })(animators.ParticleNodeBase);
        animators.ParticleFollowNode = ParticleFollowNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ColorTransform = away.geom.ColorTransform;

        var ParticleInitialColorNode = (function (_super) {
            __extends(ParticleInitialColorNode, _super);
            function ParticleInitialColorNode(mode /*uint*/ , usesMultiplier, usesOffset, initialColor) {
                if (typeof usesMultiplier === "undefined") { usesMultiplier = true; }
                if (typeof usesOffset === "undefined") { usesOffset = false; }
                if (typeof initialColor === "undefined") { initialColor = null; }
                _super.call(this, "ParticleInitialColor", mode, (usesMultiplier && usesOffset) ? 8 : 4, animators.ParticleAnimationSet.COLOR_PRIORITY);

                this._pStateClass = animators.ParticleInitialColorState;

                this._iUsesMultiplier = usesMultiplier;
                this._iUsesOffset = usesOffset;
                this._iInitialColor = initialColor || new ColorTransform();
            }
            /**
            * @inheritDoc
            */
            ParticleInitialColorNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
                var code = "";
                if (animationRegisterCache.needFragmentAnimation) {
                    if (this._iUsesMultiplier) {
                        var multiplierValue = (this._pMode == animators.ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
                        animationRegisterCache.setRegisterIndex(this, ParticleInitialColorNode.MULTIPLIER_INDEX, multiplierValue.index);

                        code += "mul " + animationRegisterCache.colorMulTarget + "," + multiplierValue + "," + animationRegisterCache.colorMulTarget + "\n";
                    }

                    if (this._iUsesOffset) {
                        var offsetValue = (this._pMode == animators.ParticlePropertiesMode.LOCAL_STATIC) ? animationRegisterCache.getFreeVertexAttribute() : animationRegisterCache.getFreeVertexConstant();
                        animationRegisterCache.setRegisterIndex(this, ParticleInitialColorNode.OFFSET_INDEX, offsetValue.index);

                        code += "add " + animationRegisterCache.colorAddTarget + "," + offsetValue + "," + animationRegisterCache.colorAddTarget + "\n";
                    }
                }

                return code;
            };

            /**
            * @inheritDoc
            */
            ParticleInitialColorNode.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
                if (this._iUsesMultiplier)
                    particleAnimationSet.hasColorMulNode = true;
                if (this._iUsesOffset)
                    particleAnimationSet.hasColorAddNode = true;
            };

            /**
            * @inheritDoc
            */
            ParticleInitialColorNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
                var initialColor = param[ParticleInitialColorNode.COLOR_INITIAL_COLORTRANSFORM];
                if (!initialColor)
                    throw (new Error("there is no " + ParticleInitialColorNode.COLOR_INITIAL_COLORTRANSFORM + " in param!"));

                var i = 0;

                //multiplier
                if (this._iUsesMultiplier) {
                    this._pOneData[i++] = initialColor.redMultiplier;
                    this._pOneData[i++] = initialColor.greenMultiplier;
                    this._pOneData[i++] = initialColor.blueMultiplier;
                    this._pOneData[i++] = initialColor.alphaMultiplier;
                }

                //offset
                if (this._iUsesOffset) {
                    this._pOneData[i++] = initialColor.redOffset / 255;
                    this._pOneData[i++] = initialColor.greenOffset / 255;
                    this._pOneData[i++] = initialColor.blueOffset / 255;
                    this._pOneData[i++] = initialColor.alphaOffset / 255;
                }
            };
            ParticleInitialColorNode.MULTIPLIER_INDEX = 0;

            ParticleInitialColorNode.OFFSET_INDEX = 1;

            ParticleInitialColorNode.COLOR_INITIAL_COLORTRANSFORM = "ColorInitialColorTransform";
            return ParticleInitialColorNode;
        })(animators.ParticleNodeBase);
        animators.ParticleInitialColorNode = ParticleInitialColorNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var Vector3D = away.geom.Vector3D;

        var ShaderRegisterElement = away.materials.ShaderRegisterElement;

        /**
        * A particle animation node used to control the position of a particle over time around a circular orbit.
        */
        var ParticleOrbitNode = (function (_super) {
            __extends(ParticleOrbitNode, _super);
            /**
            * Creates a new <code>ParticleOrbitNode</code> object.
            *
            * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
            * @param    [optional] usesEulers      Defines whether the node uses the <code>eulers</code> property in the shader to calculate a rotation on the orbit. Defaults to true.
            * @param    [optional] usesCycle       Defines whether the node uses the <code>cycleDuration</code> property in the shader to calculate the period of the orbit independent of particle duration. Defaults to false.
            * @param    [optional] usesPhase       Defines whether the node uses the <code>cyclePhase</code> property in the shader to calculate a starting offset to the cycle rotation of the particle. Defaults to false.
            * @param    [optional] radius          Defines the radius of the orbit when in global mode. Defaults to 100.
            * @param    [optional] cycleDuration   Defines the duration of the orbit in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
            * @param    [optional] cyclePhase      Defines the phase of the orbit in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
            * @param    [optional] eulers          Defines the euler rotation in degrees, applied to the orientation of the orbit when in global mode.
            */
            function ParticleOrbitNode(mode /*uint*/ , usesEulers, usesCycle, usesPhase, radius, cycleDuration, cyclePhase, eulers) {
                if (typeof usesEulers === "undefined") { usesEulers = true; }
                if (typeof usesCycle === "undefined") { usesCycle = false; }
                if (typeof usesPhase === "undefined") { usesPhase = false; }
                if (typeof radius === "undefined") { radius = 100; }
                if (typeof cycleDuration === "undefined") { cycleDuration = 1; }
                if (typeof cyclePhase === "undefined") { cyclePhase = 0; }
                if (typeof eulers === "undefined") { eulers = null; }
                var len = 3;
                if (usesPhase)
                    len++;
                _super.call(this, "ParticleOrbit", mode, len);

                this._pStateClass = animators.ParticleOrbitState;

                this._iUsesEulers = usesEulers;
                this._iUsesCycle = usesCycle;
                this._iUsesPhase = usesPhase;

                this._iRadius = radius;
                this._iCycleDuration = cycleDuration;
                this._iCyclePhase = cyclePhase;
                this._iEulers = eulers || new Vector3D();
            }
            /**
            * @inheritDoc
            */
            ParticleOrbitNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
                var orbitRegister = (this._pMode == animators.ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
                animationRegisterCache.setRegisterIndex(this, ParticleOrbitNode.ORBIT_INDEX, orbitRegister.index);

                var eulersMatrixRegister = animationRegisterCache.getFreeVertexConstant();
                animationRegisterCache.setRegisterIndex(this, ParticleOrbitNode.EULERS_INDEX, eulersMatrixRegister.index);
                animationRegisterCache.getFreeVertexConstant();
                animationRegisterCache.getFreeVertexConstant();
                animationRegisterCache.getFreeVertexConstant();

                var temp1 = animationRegisterCache.getFreeVertexVectorTemp();
                animationRegisterCache.addVertexTempUsages(temp1, 1);
                var distance = new ShaderRegisterElement(temp1.regName, temp1.index);

                var temp2 = animationRegisterCache.getFreeVertexVectorTemp();
                var cos = new ShaderRegisterElement(temp2.regName, temp2.index, 0);
                var sin = new ShaderRegisterElement(temp2.regName, temp2.index, 1);
                var degree = new ShaderRegisterElement(temp2.regName, temp2.index, 2);
                animationRegisterCache.removeVertexTempUsage(temp1);

                var code = "";

                if (this._iUsesCycle) {
                    code += "mul " + degree + "," + animationRegisterCache.vertexTime + "," + orbitRegister + ".y\n";

                    if (this._iUsesPhase)
                        code += "add " + degree + "," + degree + "," + orbitRegister + ".w\n";
                } else
                    code += "mul " + degree + "," + animationRegisterCache.vertexLife + "," + orbitRegister + ".y\n";

                code += "cos " + cos + "," + degree + "\n";
                code += "sin " + sin + "," + degree + "\n";
                code += "mul " + distance + ".x," + cos + "," + orbitRegister + ".x\n";
                code += "mul " + distance + ".y," + sin + "," + orbitRegister + ".x\n";
                code += "mov " + distance + ".wz" + animationRegisterCache.vertexZeroConst + "\n";
                if (this._iUsesEulers)
                    code += "m44 " + distance + "," + distance + "," + eulersMatrixRegister + "\n";
                code += "add " + animationRegisterCache.positionTarget + ".xyz," + distance + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";

                if (animationRegisterCache.needVelocity) {
                    code += "neg " + distance + ".x," + sin + "\n";
                    code += "mov " + distance + ".y," + cos + "\n";
                    code += "mov " + distance + ".zw," + animationRegisterCache.vertexZeroConst + "\n";
                    if (this._iUsesEulers)
                        code += "m44 " + distance + "," + distance + "," + eulersMatrixRegister + "\n";
                    code += "mul " + distance + "," + distance + "," + orbitRegister + ".z\n";
                    code += "div " + distance + "," + distance + "," + orbitRegister + ".y\n";
                    if (!this._iUsesCycle)
                        code += "div " + distance + "," + distance + "," + animationRegisterCache.vertexLife + "\n";
                    code += "add " + animationRegisterCache.velocityTarget + ".xyz," + animationRegisterCache.velocityTarget + ".xyz," + distance + ".xyz\n";
                }
                return code;
            };

            /**
            * @inheritDoc
            */
            ParticleOrbitNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };

            /**
            * @inheritDoc
            */
            ParticleOrbitNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
                //Vector3D.x is radius, Vector3D.y is cycle duration, Vector3D.z is phase
                var orbit = param[ParticleOrbitNode.ORBIT_VECTOR3D];
                if (!orbit)
                    throw new Error("there is no " + ParticleOrbitNode.ORBIT_VECTOR3D + " in param!");

                this._pOneData[0] = orbit.x;
                if (this._iUsesCycle && orbit.y <= 0)
                    throw (new Error("the cycle duration must be greater than zero"));
                this._pOneData[1] = Math.PI * 2 / (!this._iUsesCycle ? 1 : orbit.y);
                this._pOneData[2] = orbit.x * Math.PI * 2;
                if (this._iUsesPhase)
                    this._pOneData[3] = orbit.z * Math.PI / 180;
            };
            ParticleOrbitNode.ORBIT_INDEX = 0;

            ParticleOrbitNode.EULERS_INDEX = 1;

            ParticleOrbitNode.ORBIT_VECTOR3D = "OrbitVector3D";
            return ParticleOrbitNode;
        })(animators.ParticleNodeBase);
        animators.ParticleOrbitNode = ParticleOrbitNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var Vector3D = away.geom.Vector3D;

        var ShaderRegisterElement = away.materials.ShaderRegisterElement;

        /**
        * A particle animation node used to control the position of a particle over time using simple harmonic motion.
        */
        var ParticleOscillatorNode = (function (_super) {
            __extends(ParticleOscillatorNode, _super);
            /**
            * Creates a new <code>ParticleOscillatorNode</code>
            *
            * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
            * @param    [optional] oscillator      Defines the default oscillator axis (x, y, z) and cycleDuration (w) of the node, used when in global mode.
            */
            function ParticleOscillatorNode(mode /*uint*/ , oscillator) {
                if (typeof oscillator === "undefined") { oscillator = null; }
                _super.call(this, "ParticleOscillator", mode, 4);

                this._pStateClass = animators.ParticleOscillatorState;

                this._iOscillator = oscillator || new Vector3D();
            }
            /**
            * @inheritDoc
            */
            ParticleOscillatorNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
                var oscillatorRegister = (this._pMode == animators.ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
                animationRegisterCache.setRegisterIndex(this, ParticleOscillatorNode.OSCILLATOR_INDEX, oscillatorRegister.index);
                var temp = animationRegisterCache.getFreeVertexVectorTemp();
                var dgree = new ShaderRegisterElement(temp.regName, temp.index, 0);
                var sin = new ShaderRegisterElement(temp.regName, temp.index, 1);
                var cos = new ShaderRegisterElement(temp.regName, temp.index, 2);
                animationRegisterCache.addVertexTempUsages(temp, 1);
                var temp2 = animationRegisterCache.getFreeVertexVectorTemp();
                var distance = new ShaderRegisterElement(temp2.regName, temp2.index);
                animationRegisterCache.removeVertexTempUsage(temp);

                var code = "";
                code += "mul " + dgree + "," + animationRegisterCache.vertexTime + "," + oscillatorRegister + ".w\n";
                code += "sin " + sin + "," + dgree + "\n";
                code += "mul " + distance + ".xyz," + sin + "," + oscillatorRegister + ".xyz\n";
                code += "add " + animationRegisterCache.positionTarget + ".xyz," + distance + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";

                if (animationRegisterCache.needVelocity) {
                    code += "cos " + cos + "," + dgree + "\n";
                    code += "mul " + distance + ".xyz," + cos + "," + oscillatorRegister + ".xyz\n";
                    code += "add " + animationRegisterCache.velocityTarget + ".xyz," + distance + ".xyz," + animationRegisterCache.velocityTarget + ".xyz\n";
                }

                return code;
            };

            /**
            * @inheritDoc
            */
            ParticleOscillatorNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };

            /**
            * @inheritDoc
            */
            ParticleOscillatorNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
                //(Vector3D.x,Vector3D.y,Vector3D.z) is oscillator axis, Vector3D.w is oscillator cycle duration
                var drift = param[ParticleOscillatorNode.OSCILLATOR_VECTOR3D];
                if (!drift)
                    throw (new Error("there is no " + ParticleOscillatorNode.OSCILLATOR_VECTOR3D + " in param!"));

                this._pOneData[0] = drift.x;
                this._pOneData[1] = drift.y;
                this._pOneData[2] = drift.z;
                if (drift.w <= 0)
                    throw (new Error("the cycle duration must greater than zero"));
                this._pOneData[3] = Math.PI * 2 / drift.w;
            };
            ParticleOscillatorNode.OSCILLATOR_INDEX = 0;

            ParticleOscillatorNode.OSCILLATOR_VECTOR3D = "OscillatorVector3D";
            return ParticleOscillatorNode;
        })(animators.ParticleNodeBase);
        animators.ParticleOscillatorNode = ParticleOscillatorNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var Vector3D = away.geom.Vector3D;

        /**
        * A particle animation node used to set the starting position of a particle.
        */
        var ParticlePositionNode = (function (_super) {
            __extends(ParticlePositionNode, _super);
            /**
            * Creates a new <code>ParticlePositionNode</code>
            *
            * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
            * @param    [optional] position        Defines the default position of the particle when in global mode. Defaults to 0,0,0.
            */
            function ParticlePositionNode(mode /*uint*/ , position) {
                if (typeof position === "undefined") { position = null; }
                _super.call(this, "ParticlePosition", mode, 3);

                this._pStateClass = animators.ParticlePositionState;

                this._iPosition = position || new Vector3D();
            }
            /**
            * @inheritDoc
            */
            ParticlePositionNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
                var positionAttribute = (this._pMode == animators.ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
                animationRegisterCache.setRegisterIndex(this, ParticlePositionNode.POSITION_INDEX, positionAttribute.index);

                return "add " + animationRegisterCache.positionTarget + ".xyz," + positionAttribute + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";
            };

            /**
            * @inheritDoc
            */
            ParticlePositionNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };

            /**
            * @inheritDoc
            */
            ParticlePositionNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
                var offset = param[ParticlePositionNode.POSITION_VECTOR3D];
                if (!offset)
                    throw (new Error("there is no " + ParticlePositionNode.POSITION_VECTOR3D + " in param!"));

                this._pOneData[0] = offset.x;
                this._pOneData[1] = offset.y;
                this._pOneData[2] = offset.z;
            };
            ParticlePositionNode.POSITION_INDEX = 0;

            ParticlePositionNode.POSITION_VECTOR3D = "PositionVector3D";
            return ParticlePositionNode;
        })(animators.ParticleNodeBase);
        animators.ParticlePositionNode = ParticlePositionNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ShaderRegisterElement = away.materials.ShaderRegisterElement;

        /**
        * A particle animation node used to control the rotation of a particle to match its heading vector.
        */
        var ParticleRotateToHeadingNode = (function (_super) {
            __extends(ParticleRotateToHeadingNode, _super);
            /**
            * Creates a new <code>ParticleBillboardNode</code>
            */
            function ParticleRotateToHeadingNode() {
                _super.call(this, "ParticleRotateToHeading", animators.ParticlePropertiesMode.GLOBAL, 0, 3);

                this._pStateClass = animators.ParticleRotateToHeadingState;
            }
            /**
            * @inheritDoc
            */
            ParticleRotateToHeadingNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
                var code = "";
                var len = animationRegisterCache.rotationRegisters.length;
                var i;
                if (animationRegisterCache.hasBillboard) {
                    var temp1 = animationRegisterCache.getFreeVertexVectorTemp();
                    animationRegisterCache.addVertexTempUsages(temp1, 1);
                    var temp2 = animationRegisterCache.getFreeVertexVectorTemp();
                    animationRegisterCache.addVertexTempUsages(temp2, 1);
                    var temp3 = animationRegisterCache.getFreeVertexVectorTemp();

                    var rotationMatrixRegister = animationRegisterCache.getFreeVertexConstant();
                    animationRegisterCache.setRegisterIndex(this, ParticleRotateToHeadingNode.MATRIX_INDEX, rotationMatrixRegister.index);
                    animationRegisterCache.getFreeVertexConstant();
                    animationRegisterCache.getFreeVertexConstant();
                    animationRegisterCache.getFreeVertexConstant();

                    animationRegisterCache.removeVertexTempUsage(temp1);
                    animationRegisterCache.removeVertexTempUsage(temp2);

                    //process the velocity
                    code += "m33 " + temp1 + ".xyz," + animationRegisterCache.velocityTarget + ".xyz," + rotationMatrixRegister + "\n";

                    code += "mov " + temp3 + "," + animationRegisterCache.vertexZeroConst + "\n";
                    code += "mov " + temp3 + ".xy," + temp1 + ".xy\n";
                    code += "nrm " + temp3 + ".xyz," + temp3 + ".xyz\n";

                    //temp3.x=cos,temp3.y=sin
                    //only process z axis
                    code += "mov " + temp2 + "," + animationRegisterCache.vertexZeroConst + "\n";
                    code += "mov " + temp2 + ".x," + temp3 + ".y\n";
                    code += "mov " + temp2 + ".y," + temp3 + ".x\n";
                    code += "mov " + temp1 + "," + animationRegisterCache.vertexZeroConst + "\n";
                    code += "mov " + temp1 + ".x," + temp3 + ".x\n";
                    code += "neg " + temp1 + ".y," + temp3 + ".y\n";
                    code += "mov " + temp3 + "," + animationRegisterCache.vertexZeroConst + "\n";
                    code += "mov " + temp3 + ".z," + animationRegisterCache.vertexOneConst + "\n";
                    code += "m33 " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
                    for (i = 0; i < len; i++)
                        code += "m33 " + animationRegisterCache.rotationRegisters[i] + ".xyz," + animationRegisterCache.rotationRegisters[i] + "," + temp1 + "\n";
                } else {
                    var nrmVel = animationRegisterCache.getFreeVertexVectorTemp();
                    animationRegisterCache.addVertexTempUsages(nrmVel, 1);

                    var xAxis = animationRegisterCache.getFreeVertexVectorTemp();
                    animationRegisterCache.addVertexTempUsages(xAxis, 1);

                    var R = animationRegisterCache.getFreeVertexVectorTemp();
                    animationRegisterCache.addVertexTempUsages(R, 1);
                    var R_rev = animationRegisterCache.getFreeVertexVectorTemp();
                    var cos = new ShaderRegisterElement(R.regName, R.index, 3);
                    var sin = new ShaderRegisterElement(R_rev.regName, R_rev.index, 3);
                    var cos2 = new ShaderRegisterElement(nrmVel.regName, nrmVel.index, 3);
                    var tempSingle = sin;

                    animationRegisterCache.removeVertexTempUsage(nrmVel);
                    animationRegisterCache.removeVertexTempUsage(xAxis);
                    animationRegisterCache.removeVertexTempUsage(R);

                    code += "mov " + xAxis + ".x," + animationRegisterCache.vertexOneConst + "\n";
                    code += "mov " + xAxis + ".yz," + animationRegisterCache.vertexZeroConst + "\n";

                    code += "nrm " + nrmVel + ".xyz," + animationRegisterCache.velocityTarget + ".xyz\n";
                    code += "dp3 " + cos2 + "," + nrmVel + ".xyz," + xAxis + ".xyz\n";
                    code += "crs " + nrmVel + ".xyz," + xAxis + ".xyz," + nrmVel + ".xyz\n";
                    code += "nrm " + nrmVel + ".xyz," + nrmVel + ".xyz\n";

                    //use R as temp to judge if nrm is (0,0,0).
                    //if nrm is (0,0,0) ,change it to (0,0,1).
                    code += "dp3 " + R + ".x," + nrmVel + ".xyz," + nrmVel + ".xyz\n";
                    code += "sge " + R + ".x," + animationRegisterCache.vertexZeroConst + "," + R + ".x\n";
                    code += "add " + nrmVel + ".z," + R + ".x," + nrmVel + ".z\n";

                    code += "add " + tempSingle + "," + cos2 + "," + animationRegisterCache.vertexOneConst + "\n";
                    code += "div " + tempSingle + "," + tempSingle + "," + animationRegisterCache.vertexTwoConst + "\n";
                    code += "sqt " + cos + "," + tempSingle + "\n";

                    code += "sub " + tempSingle + "," + animationRegisterCache.vertexOneConst + "," + cos2 + "\n";
                    code += "div " + tempSingle + "," + tempSingle + "," + animationRegisterCache.vertexTwoConst + "\n";
                    code += "sqt " + sin + "," + tempSingle + "\n";

                    code += "mul " + R + ".xyz," + sin + "," + nrmVel + ".xyz\n";

                    //use cos as R.w
                    code += "mul " + R_rev + ".xyz," + sin + "," + nrmVel + ".xyz\n";
                    code += "neg " + R_rev + ".xyz," + R_rev + ".xyz\n";

                    //use cos as R_rev.w
                    //nrmVel and xAxis are used as temp register
                    code += "crs " + nrmVel + ".xyz," + R + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";

                    //use cos as R.w
                    code += "mul " + xAxis + ".xyz," + cos + "," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";
                    code += "add " + nrmVel + ".xyz," + nrmVel + ".xyz," + xAxis + ".xyz\n";
                    code += "dp3 " + xAxis + ".w," + R + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";
                    code += "neg " + nrmVel + ".w," + xAxis + ".w\n";

                    code += "crs " + R + ".xyz," + nrmVel + ".xyz," + R_rev + ".xyz\n";

                    //code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," +R_rev + ".w\n";
                    code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," + cos + "\n";
                    code += "add " + R + ".xyz," + R + ".xyz," + xAxis + ".xyz\n";
                    code += "mul " + xAxis + ".xyz," + nrmVel + ".w," + R_rev + ".xyz\n";

                    code += "add " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + R + ".xyz," + xAxis + ".xyz\n";

                    for (i = 0; i < len; i++) {
                        //just repeat the calculate above
                        //because of the limited registers, no need to optimise
                        code += "mov " + xAxis + ".x," + animationRegisterCache.vertexOneConst + "\n";
                        code += "mov " + xAxis + ".yz," + animationRegisterCache.vertexZeroConst + "\n";
                        code += "nrm " + nrmVel + ".xyz," + animationRegisterCache.velocityTarget + ".xyz\n";
                        code += "dp3 " + cos2 + "," + nrmVel + ".xyz," + xAxis + ".xyz\n";
                        code += "crs " + nrmVel + ".xyz," + xAxis + ".xyz," + nrmVel + ".xyz\n";
                        code += "nrm " + nrmVel + ".xyz," + nrmVel + ".xyz\n";
                        code += "dp3 " + R + ".x," + nrmVel + ".xyz," + nrmVel + ".xyz\n";
                        code += "sge " + R + ".x," + animationRegisterCache.vertexZeroConst + "," + R + ".x\n";
                        code += "add " + nrmVel + ".z," + R + ".x," + nrmVel + ".z\n";
                        code += "add " + tempSingle + "," + cos2 + "," + animationRegisterCache.vertexOneConst + "\n";
                        code += "div " + tempSingle + "," + tempSingle + "," + animationRegisterCache.vertexTwoConst + "\n";
                        code += "sqt " + cos + "," + tempSingle + "\n";
                        code += "sub " + tempSingle + "," + animationRegisterCache.vertexOneConst + "," + cos2 + "\n";
                        code += "div " + tempSingle + "," + tempSingle + "," + animationRegisterCache.vertexTwoConst + "\n";
                        code += "sqt " + sin + "," + tempSingle + "\n";
                        code += "mul " + R + ".xyz," + sin + "," + nrmVel + ".xyz\n";
                        code += "mul " + R_rev + ".xyz," + sin + "," + nrmVel + ".xyz\n";
                        code += "neg " + R_rev + ".xyz," + R_rev + ".xyz\n";
                        code += "crs " + nrmVel + ".xyz," + R + ".xyz," + animationRegisterCache.rotationRegisters[i] + ".xyz\n";
                        code += "mul " + xAxis + ".xyz," + cos + "," + animationRegisterCache.rotationRegisters[i] + ".xyz\n";
                        code += "add " + nrmVel + ".xyz," + nrmVel + ".xyz," + xAxis + ".xyz\n";
                        code += "dp3 " + xAxis + ".w," + R + ".xyz," + animationRegisterCache.rotationRegisters[i] + ".xyz\n";
                        code += "neg " + nrmVel + ".w," + xAxis + ".w\n";
                        code += "crs " + R + ".xyz," + nrmVel + ".xyz," + R_rev + ".xyz\n";
                        code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," + cos + "\n";
                        code += "add " + R + ".xyz," + R + ".xyz," + xAxis + ".xyz\n";
                        code += "mul " + xAxis + ".xyz," + nrmVel + ".w," + R_rev + ".xyz\n";
                        code += "add " + animationRegisterCache.rotationRegisters[i] + ".xyz," + R + ".xyz," + xAxis + ".xyz\n";
                    }
                }
                return code;
            };

            /**
            * @inheritDoc
            */
            ParticleRotateToHeadingNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };

            /**
            * @inheritDoc
            */
            ParticleRotateToHeadingNode.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
                particleAnimationSet.needVelocity = true;
            };
            ParticleRotateToHeadingNode.MATRIX_INDEX = 0;
            return ParticleRotateToHeadingNode;
        })(animators.ParticleNodeBase);
        animators.ParticleRotateToHeadingNode = ParticleRotateToHeadingNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var Vector3D = away.geom.Vector3D;

        var ShaderRegisterElement = away.materials.ShaderRegisterElement;

        /**
        * A particle animation node used to control the rotation of a particle to face to a position
        */
        var ParticleRotateToPositionNode = (function (_super) {
            __extends(ParticleRotateToPositionNode, _super);
            /**
            * Creates a new <code>ParticleRotateToPositionNode</code>
            */
            function ParticleRotateToPositionNode(mode /*uint*/ , position) {
                if (typeof position === "undefined") { position = null; }
                _super.call(this, "ParticleRotateToPosition", mode, 3, 3);

                this._pStateClass = animators.ParticleRotateToPositionState;

                this._iPosition = position || new Vector3D();
            }
            /**
            * @inheritDoc
            */
            ParticleRotateToPositionNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
                var positionAttribute = (this._pMode == animators.ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
                animationRegisterCache.setRegisterIndex(this, ParticleRotateToPositionNode.POSITION_INDEX, positionAttribute.index);

                var code = "";
                var len = animationRegisterCache.rotationRegisters.length;
                var i;
                if (animationRegisterCache.hasBillboard) {
                    var temp1 = animationRegisterCache.getFreeVertexVectorTemp();
                    animationRegisterCache.addVertexTempUsages(temp1, 1);
                    var temp2 = animationRegisterCache.getFreeVertexVectorTemp();
                    animationRegisterCache.addVertexTempUsages(temp2, 1);
                    var temp3 = animationRegisterCache.getFreeVertexVectorTemp();

                    var rotationMatrixRegister = animationRegisterCache.getFreeVertexConstant();
                    animationRegisterCache.setRegisterIndex(this, ParticleRotateToPositionNode.MATRIX_INDEX, rotationMatrixRegister.index);
                    animationRegisterCache.getFreeVertexConstant();
                    animationRegisterCache.getFreeVertexConstant();
                    animationRegisterCache.getFreeVertexConstant();

                    animationRegisterCache.removeVertexTempUsage(temp1);
                    animationRegisterCache.removeVertexTempUsage(temp2);

                    //process the position
                    code += "sub " + temp1 + ".xyz," + positionAttribute + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";
                    code += "m33 " + temp1 + ".xyz," + temp1 + ".xyz," + rotationMatrixRegister + "\n";

                    code += "mov " + temp3 + "," + animationRegisterCache.vertexZeroConst + "\n";
                    code += "mov " + temp3 + ".xy," + temp1 + ".xy\n";
                    code += "nrm " + temp3 + ".xyz," + temp3 + ".xyz\n";

                    //temp3.x=cos,temp3.y=sin
                    //only process z axis
                    code += "mov " + temp2 + "," + animationRegisterCache.vertexZeroConst + "\n";
                    code += "mov " + temp2 + ".x," + temp3 + ".y\n";
                    code += "mov " + temp2 + ".y," + temp3 + ".x\n";
                    code += "mov " + temp1 + "," + animationRegisterCache.vertexZeroConst + "\n";
                    code += "mov " + temp1 + ".x," + temp3 + ".x\n";
                    code += "neg " + temp1 + ".y," + temp3 + ".y\n";
                    code += "mov " + temp3 + "," + animationRegisterCache.vertexZeroConst + "\n";
                    code += "mov " + temp3 + ".z," + animationRegisterCache.vertexOneConst + "\n";
                    code += "m33 " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp1 + "\n";
                    for (i = 0; i < len; i++)
                        code += "m33 " + animationRegisterCache.rotationRegisters[i] + ".xyz," + animationRegisterCache.rotationRegisters[i] + "," + temp1 + "\n";
                } else {
                    var nrmDirection = animationRegisterCache.getFreeVertexVectorTemp();
                    animationRegisterCache.addVertexTempUsages(nrmDirection, 1);

                    var temp = animationRegisterCache.getFreeVertexVectorTemp();
                    animationRegisterCache.addVertexTempUsages(temp, 1);
                    var cos = new ShaderRegisterElement(temp.regName, temp.index, 0);
                    var sin = new ShaderRegisterElement(temp.regName, temp.index, 1);
                    var o_temp = new ShaderRegisterElement(temp.regName, temp.index, 2);
                    var tempSingle = new ShaderRegisterElement(temp.regName, temp.index, 3);

                    var R = animationRegisterCache.getFreeVertexVectorTemp();
                    animationRegisterCache.addVertexTempUsages(R, 1);

                    animationRegisterCache.removeVertexTempUsage(nrmDirection);
                    animationRegisterCache.removeVertexTempUsage(temp);
                    animationRegisterCache.removeVertexTempUsage(R);

                    code += "sub " + nrmDirection + ".xyz," + positionAttribute + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";
                    code += "nrm " + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";

                    code += "mov " + sin + "," + nrmDirection + ".y\n";
                    code += "mul " + cos + "," + sin + "," + sin + "\n";
                    code += "sub " + cos + "," + animationRegisterCache.vertexOneConst + "," + cos + "\n";
                    code += "sqt " + cos + "," + cos + "\n";

                    code += "mul " + R + ".x," + cos + "," + animationRegisterCache.scaleAndRotateTarget + ".y\n";
                    code += "mul " + R + ".y," + sin + "," + animationRegisterCache.scaleAndRotateTarget + ".z\n";
                    code += "mul " + R + ".z," + sin + "," + animationRegisterCache.scaleAndRotateTarget + ".y\n";
                    code += "mul " + R + ".w," + cos + "," + animationRegisterCache.scaleAndRotateTarget + ".z\n";

                    code += "sub " + animationRegisterCache.scaleAndRotateTarget + ".y," + R + ".x," + R + ".y\n";
                    code += "add " + animationRegisterCache.scaleAndRotateTarget + ".z," + R + ".z," + R + ".w\n";

                    code += "abs " + R + ".y," + nrmDirection + ".y\n";
                    code += "sge " + R + ".z," + R + ".y," + animationRegisterCache.vertexOneConst + "\n";
                    code += "mul " + R + ".x," + R + ".y," + nrmDirection + ".y\n";

                    //judgu if nrmDirection=(0,1,0);
                    code += "mov " + nrmDirection + ".y," + animationRegisterCache.vertexZeroConst + "\n";
                    code += "dp3 " + sin + "," + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
                    code += "sge " + tempSingle + "," + animationRegisterCache.vertexZeroConst + "," + sin + "\n";

                    code += "mov " + nrmDirection + ".y," + animationRegisterCache.vertexZeroConst + "\n";
                    code += "nrm " + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";

                    code += "sub " + sin + "," + animationRegisterCache.vertexOneConst + "," + tempSingle + "\n";
                    code += "mul " + sin + "," + sin + "," + nrmDirection + ".x\n";

                    code += "mov " + cos + "," + nrmDirection + ".z\n";
                    code += "neg " + cos + "," + cos + "\n";
                    code += "sub " + o_temp + "," + animationRegisterCache.vertexOneConst + "," + cos + "\n";
                    code += "mul " + o_temp + "," + R + ".x," + tempSingle + "\n";
                    code += "add " + cos + "," + cos + "," + o_temp + "\n";

                    code += "mul " + R + ".x," + cos + "," + animationRegisterCache.scaleAndRotateTarget + ".x\n";
                    code += "mul " + R + ".y," + sin + "," + animationRegisterCache.scaleAndRotateTarget + ".z\n";
                    code += "mul " + R + ".z," + sin + "," + animationRegisterCache.scaleAndRotateTarget + ".x\n";
                    code += "mul " + R + ".w," + cos + "," + animationRegisterCache.scaleAndRotateTarget + ".z\n";

                    code += "sub " + animationRegisterCache.scaleAndRotateTarget + ".x," + R + ".x," + R + ".y\n";
                    code += "add " + animationRegisterCache.scaleAndRotateTarget + ".z," + R + ".z," + R + ".w\n";

                    for (i = 0; i < len; i++) {
                        //just repeat the calculate above
                        //because of the limited registers, no need to optimise
                        code += "sub " + nrmDirection + ".xyz," + positionAttribute + ".xyz," + animationRegisterCache.positionTarget + ".xyz\n";
                        code += "nrm " + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
                        code += "mov " + sin + "," + nrmDirection + ".y\n";
                        code += "mul " + cos + "," + sin + "," + sin + "\n";
                        code += "sub " + cos + "," + animationRegisterCache.vertexOneConst + "," + cos + "\n";
                        code += "sqt " + cos + "," + cos + "\n";
                        code += "mul " + R + ".x," + cos + "," + animationRegisterCache.rotationRegisters[i] + ".y\n";
                        code += "mul " + R + ".y," + sin + "," + animationRegisterCache.rotationRegisters[i] + ".z\n";
                        code += "mul " + R + ".z," + sin + "," + animationRegisterCache.rotationRegisters[i] + ".y\n";
                        code += "mul " + R + ".w," + cos + "," + animationRegisterCache.rotationRegisters[i] + ".z\n";
                        code += "sub " + animationRegisterCache.rotationRegisters[i] + ".y," + R + ".x," + R + ".y\n";
                        code += "add " + animationRegisterCache.rotationRegisters[i] + ".z," + R + ".z," + R + ".w\n";
                        code += "abs " + R + ".y," + nrmDirection + ".y\n";
                        code += "sge " + R + ".z," + R + ".y," + animationRegisterCache.vertexOneConst + "\n";
                        code += "mul " + R + ".x," + R + ".y," + nrmDirection + ".y\n";
                        code += "mov " + nrmDirection + ".y," + animationRegisterCache.vertexZeroConst + "\n";
                        code += "dp3 " + sin + "," + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
                        code += "sge " + tempSingle + "," + animationRegisterCache.vertexZeroConst + "," + sin + "\n";
                        code += "mov " + nrmDirection + ".y," + animationRegisterCache.vertexZeroConst + "\n";
                        code += "nrm " + nrmDirection + ".xyz," + nrmDirection + ".xyz\n";
                        code += "sub " + sin + "," + animationRegisterCache.vertexOneConst + "," + tempSingle + "\n";
                        code += "mul " + sin + "," + sin + "," + nrmDirection + ".x\n";
                        code += "mov " + cos + "," + nrmDirection + ".z\n";
                        code += "neg " + cos + "," + cos + "\n";
                        code += "sub " + o_temp + "," + animationRegisterCache.vertexOneConst + "," + cos + "\n";
                        code += "mul " + o_temp + "," + R + ".x," + tempSingle + "\n";
                        code += "add " + cos + "," + cos + "," + o_temp + "\n";
                        code += "mul " + R + ".x," + cos + "," + animationRegisterCache.rotationRegisters[i] + ".x\n";
                        code += "mul " + R + ".y," + sin + "," + animationRegisterCache.rotationRegisters[i] + ".z\n";
                        code += "mul " + R + ".z," + sin + "," + animationRegisterCache.rotationRegisters[i] + ".x\n";
                        code += "mul " + R + ".w," + cos + "," + animationRegisterCache.rotationRegisters[i] + ".z\n";
                        code += "sub " + animationRegisterCache.rotationRegisters[i] + ".x," + R + ".x," + R + ".y\n";
                        code += "add " + animationRegisterCache.rotationRegisters[i] + ".z," + R + ".z," + R + ".w\n";
                    }
                }
                return code;
            };

            /**
            * @inheritDoc
            */
            ParticleRotateToPositionNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };

            /**
            * @inheritDoc
            */
            ParticleRotateToPositionNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
                var offset = param[ParticleRotateToPositionNode.POSITION_VECTOR3D];
                if (!offset)
                    throw (new Error("there is no " + ParticleRotateToPositionNode.POSITION_VECTOR3D + " in param!"));

                this._pOneData[0] = offset.x;
                this._pOneData[1] = offset.y;
                this._pOneData[2] = offset.z;
            };
            ParticleRotateToPositionNode.MATRIX_INDEX = 0;

            ParticleRotateToPositionNode.POSITION_INDEX = 1;

            ParticleRotateToPositionNode.POSITION_VECTOR3D = "RotateToPositionVector3D";
            return ParticleRotateToPositionNode;
        })(animators.ParticleNodeBase);
        animators.ParticleRotateToPositionNode = ParticleRotateToPositionNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var Vector3D = away.geom.Vector3D;

        var ShaderRegisterElement = away.materials.ShaderRegisterElement;

        /**
        * A particle animation node used to set the starting rotational velocity of a particle.
        */
        var ParticleRotationalVelocityNode = (function (_super) {
            __extends(ParticleRotationalVelocityNode, _super);
            /**
            * Creates a new <code>ParticleRotationalVelocityNode</code>
            *
            * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
            */
            function ParticleRotationalVelocityNode(mode /*uint*/ , rotationalVelocity) {
                if (typeof rotationalVelocity === "undefined") { rotationalVelocity = null; }
                _super.call(this, "ParticleRotationalVelocity", mode, 4);

                this._pStateClass = animators.ParticleRotationalVelocityState;

                this._iRotationalVelocity = rotationalVelocity || new Vector3D();
            }
            /**
            * @inheritDoc
            */
            ParticleRotationalVelocityNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
                var rotationRegister = (this._pMode == animators.ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
                animationRegisterCache.setRegisterIndex(this, ParticleRotationalVelocityNode.ROTATIONALVELOCITY_INDEX, rotationRegister.index);

                var nrmVel = animationRegisterCache.getFreeVertexVectorTemp();
                animationRegisterCache.addVertexTempUsages(nrmVel, 1);

                var xAxis = animationRegisterCache.getFreeVertexVectorTemp();
                animationRegisterCache.addVertexTempUsages(xAxis, 1);

                var temp = animationRegisterCache.getFreeVertexVectorTemp();
                animationRegisterCache.addVertexTempUsages(temp, 1);
                var Rtemp = new ShaderRegisterElement(temp.regName, temp.index);
                var R_rev = animationRegisterCache.getFreeVertexVectorTemp();
                R_rev = new ShaderRegisterElement(R_rev.regName, R_rev.index);

                var cos = new ShaderRegisterElement(Rtemp.regName, Rtemp.index, 3);
                var sin = new ShaderRegisterElement(R_rev.regName, R_rev.index, 3);

                animationRegisterCache.removeVertexTempUsage(nrmVel);
                animationRegisterCache.removeVertexTempUsage(xAxis);
                animationRegisterCache.removeVertexTempUsage(temp);

                var code = "";
                code += "mov " + nrmVel + ".xyz," + rotationRegister + ".xyz\n";
                code += "mov " + nrmVel + ".w," + animationRegisterCache.vertexZeroConst + "\n";

                code += "mul " + cos + "," + animationRegisterCache.vertexTime + "," + rotationRegister + ".w\n";

                code += "sin " + sin + "," + cos + "\n";
                code += "cos " + cos + "," + cos + "\n";

                code += "mul " + Rtemp + ".xyz," + sin + "," + nrmVel + ".xyz\n";

                code += "mul " + R_rev + ".xyz," + sin + "," + nrmVel + ".xyz\n";
                code += "neg " + R_rev + ".xyz," + R_rev + ".xyz\n";

                //nrmVel and xAxis are used as temp register
                code += "crs " + nrmVel + ".xyz," + Rtemp + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";

                code += "mul " + xAxis + ".xyz," + cos + "," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";
                code += "add " + nrmVel + ".xyz," + nrmVel + ".xyz," + xAxis + ".xyz\n";
                code += "dp3 " + xAxis + ".w," + Rtemp + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz\n";
                code += "neg " + nrmVel + ".w," + xAxis + ".w\n";

                code += "crs " + Rtemp + ".xyz," + nrmVel + ".xyz," + R_rev + ".xyz\n";

                //use cos as R_rev.w
                code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," + cos + "\n";
                code += "add " + Rtemp + ".xyz," + Rtemp + ".xyz," + xAxis + ".xyz\n";
                code += "mul " + xAxis + ".xyz," + nrmVel + ".w," + R_rev + ".xyz\n";

                code += "add " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + Rtemp + ".xyz," + xAxis + ".xyz\n";

                var len = animationRegisterCache.rotationRegisters.length;
                for (var i = 0; i < len; i++) {
                    code += "mov " + nrmVel + ".xyz," + rotationRegister + ".xyz\n";
                    code += "mov " + nrmVel + ".w," + animationRegisterCache.vertexZeroConst + "\n";
                    code += "mul " + cos + "," + animationRegisterCache.vertexTime + "," + rotationRegister + ".w\n";
                    code += "sin " + sin + "," + cos + "\n";
                    code += "cos " + cos + "," + cos + "\n";
                    code += "mul " + Rtemp + ".xyz," + sin + "," + nrmVel + ".xyz\n";
                    code += "mul " + R_rev + ".xyz," + sin + "," + nrmVel + ".xyz\n";
                    code += "neg " + R_rev + ".xyz," + R_rev + ".xyz\n";
                    code += "crs " + nrmVel + ".xyz," + Rtemp + ".xyz," + animationRegisterCache.rotationRegisters[i] + ".xyz\n";
                    code += "mul " + xAxis + ".xyz," + cos + "," + animationRegisterCache.rotationRegisters[i] + "\n";
                    code += "add " + nrmVel + ".xyz," + nrmVel + ".xyz," + xAxis + ".xyz\n";
                    code += "dp3 " + xAxis + ".w," + Rtemp + ".xyz," + animationRegisterCache.rotationRegisters[i] + "\n";
                    code += "neg " + nrmVel + ".w," + xAxis + ".w\n";
                    code += "crs " + Rtemp + ".xyz," + nrmVel + ".xyz," + R_rev + ".xyz\n";
                    code += "mul " + xAxis + ".xyzw," + nrmVel + ".xyzw," + cos + "\n";
                    code += "add " + Rtemp + ".xyz," + Rtemp + ".xyz," + xAxis + ".xyz\n";
                    code += "mul " + xAxis + ".xyz," + nrmVel + ".w," + R_rev + ".xyz\n";
                    code += "add " + animationRegisterCache.rotationRegisters[i] + "," + Rtemp + ".xyz," + xAxis + ".xyz\n";
                }
                return code;
            };

            /**
            * @inheritDoc
            */
            ParticleRotationalVelocityNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };

            /**
            * @inheritDoc
            */
            ParticleRotationalVelocityNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
                //(Vector3d.x,Vector3d.y,Vector3d.z) is rotation axis,Vector3d.w is cycle duration
                var rotate = param[ParticleRotationalVelocityNode.ROTATIONALVELOCITY_VECTOR3D];
                if (!rotate)
                    throw (new Error("there is no " + ParticleRotationalVelocityNode.ROTATIONALVELOCITY_VECTOR3D + " in param!"));

                if (rotate.length <= 0)
                    rotate.z = 1; //set the default direction
                else
                    rotate.normalize();

                this._pOneData[0] = rotate.x;
                this._pOneData[1] = rotate.y;
                this._pOneData[2] = rotate.z;
                if (rotate.w <= 0)
                    throw (new Error("the cycle duration must greater than zero"));

                // it's used as angle/2 in agal
                this._pOneData[3] = Math.PI / rotate.w;
            };
            ParticleRotationalVelocityNode.ROTATIONALVELOCITY_INDEX = 0;

            ParticleRotationalVelocityNode.ROTATIONALVELOCITY_VECTOR3D = "RotationalVelocityVector3D";
            return ParticleRotationalVelocityNode;
        })(animators.ParticleNodeBase);
        animators.ParticleRotationalVelocityNode = ParticleRotationalVelocityNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * A particle animation node used to control the scale variation of a particle over time.
        */
        var ParticleScaleNode = (function (_super) {
            __extends(ParticleScaleNode, _super);
            /**
            * Creates a new <code>ParticleScaleNode</code>
            *
            * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
            * @param    [optional] usesCycle       Defines whether the node uses the <code>cycleDuration</code> property in the shader to calculate the period of animation independent of particle duration. Defaults to false.
            * @param    [optional] usesPhase       Defines whether the node uses the <code>cyclePhase</code> property in the shader to calculate a starting offset to the animation cycle. Defaults to false.
            * @param    [optional] minScale        Defines the default min scale transform of the node, when in global mode. Defaults to 1.
            * @param    [optional] maxScale        Defines the default max color transform of the node, when in global mode. Defaults to 1.
            * @param    [optional] cycleDuration   Defines the default duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
            * @param    [optional] cyclePhase      Defines the default phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
            */
            function ParticleScaleNode(mode /*uint*/ , usesCycle, usesPhase, minScale, maxScale, cycleDuration, cyclePhase) {
                if (typeof minScale === "undefined") { minScale = 1; }
                if (typeof maxScale === "undefined") { maxScale = 1; }
                if (typeof cycleDuration === "undefined") { cycleDuration = 1; }
                if (typeof cyclePhase === "undefined") { cyclePhase = 0; }
                _super.call(this, "ParticleScale", mode, (usesCycle && usesPhase) ? 4 : ((usesCycle || usesPhase) ? 3 : 2), 3);

                this._pStateClass = animators.ParticleScaleState;

                this._iUsesCycle = usesCycle;
                this._iUsesPhase = usesPhase;

                this._iMinScale = minScale;
                this._iMaxScale = maxScale;
                this._iCycleDuration = cycleDuration;
                this._iCyclePhase = cyclePhase;
            }
            /**
            * @inheritDoc
            */
            ParticleScaleNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
                var code = "";
                var temp = animationRegisterCache.getFreeVertexSingleTemp();

                var scaleRegister = (this._pMode == animators.ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
                animationRegisterCache.setRegisterIndex(this, ParticleScaleNode.SCALE_INDEX, scaleRegister.index);

                if (this._iUsesCycle) {
                    code += "mul " + temp + "," + animationRegisterCache.vertexTime + "," + scaleRegister + ".z\n";

                    if (this._iUsesPhase)
                        code += "add " + temp + "," + temp + "," + scaleRegister + ".w\n";

                    code += "sin " + temp + "," + temp + "\n";
                }

                code += "mul " + temp + "," + scaleRegister + ".y," + ((this._iUsesCycle) ? temp : animationRegisterCache.vertexLife) + "\n";
                code += "add " + temp + "," + scaleRegister + ".x," + temp + "\n";
                code += "mul " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp + "\n";

                return code;
            };

            /**
            * @inheritDoc
            */
            ParticleScaleNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };

            /**
            * @inheritDoc
            */
            ParticleScaleNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
                var scale = param[ParticleScaleNode.SCALE_VECTOR3D];
                if (!scale)
                    throw (new Error("there is no " + ParticleScaleNode.SCALE_VECTOR3D + " in param!"));

                if (this._iUsesCycle) {
                    this._pOneData[0] = (scale.x + scale.y) / 2;
                    this._pOneData[1] = Math.abs(scale.x - scale.y) / 2;
                    if (scale.z <= 0)
                        throw (new Error("the cycle duration must be greater than zero"));
                    this._pOneData[2] = Math.PI * 2 / scale.z;
                    if (this._iUsesPhase)
                        this._pOneData[3] = scale.w * Math.PI / 180;
                } else {
                    this._pOneData[0] = scale.x;
                    this._pOneData[1] = scale.y - scale.x;
                }
            };
            ParticleScaleNode.SCALE_INDEX = 0;

            ParticleScaleNode.SCALE_VECTOR3D = "ScaleVector3D";
            return ParticleScaleNode;
        })(animators.ParticleNodeBase);
        animators.ParticleScaleNode = ParticleScaleNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ShaderRegisterElement = away.materials.ShaderRegisterElement;

        var ParticleSegmentedColorNode = (function (_super) {
            __extends(ParticleSegmentedColorNode, _super);
            function ParticleSegmentedColorNode(usesMultiplier, usesOffset, numSegmentPoint /*int*/ , startColor, endColor, segmentPoints) {
                //because of the stage3d register limitation, it only support the global mode
                _super.call(this, "ParticleSegmentedColor", animators.ParticlePropertiesMode.GLOBAL, 0, animators.ParticleAnimationSet.COLOR_PRIORITY);

                this._pStateClass = animators.ParticleSegmentedColorState;

                if (numSegmentPoint > 4)
                    throw (new Error("the numSegmentPoint must be less or equal 4"));
                this._iUsesMultiplier = usesMultiplier;
                this._iUsesOffset = usesOffset;
                this._iNumSegmentPoint = numSegmentPoint;
                this._iStartColor = startColor;
                this._iEndColor = endColor;
                this._iSegmentPoints = segmentPoints;
            }
            /**
            * @inheritDoc
            */
            ParticleSegmentedColorNode.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
                if (this._iUsesMultiplier)
                    particleAnimationSet.hasColorMulNode = true;
                if (this._iUsesOffset)
                    particleAnimationSet.hasColorAddNode = true;
            };

            /**
            * @inheritDoc
            */
            ParticleSegmentedColorNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
                var code = "";
                if (animationRegisterCache.needFragmentAnimation) {
                    var accMultiplierColor;

                    //var accOffsetColor:ShaderRegisterElement;
                    if (this._iUsesMultiplier) {
                        accMultiplierColor = animationRegisterCache.getFreeVertexVectorTemp();
                        animationRegisterCache.addVertexTempUsages(accMultiplierColor, 1);
                    }

                    var tempColor = animationRegisterCache.getFreeVertexVectorTemp();
                    animationRegisterCache.addVertexTempUsages(tempColor, 1);

                    var temp = animationRegisterCache.getFreeVertexVectorTemp();
                    var accTime = new ShaderRegisterElement(temp.regName, temp.index, 0);
                    var tempTime = new ShaderRegisterElement(temp.regName, temp.index, 1);

                    if (this._iUsesMultiplier)
                        animationRegisterCache.removeVertexTempUsage(accMultiplierColor);

                    animationRegisterCache.removeVertexTempUsage(tempColor);

                    //for saving all the life values (at most 4)
                    var lifeTimeRegister = animationRegisterCache.getFreeVertexConstant();
                    animationRegisterCache.setRegisterIndex(this, ParticleSegmentedColorNode.TIME_DATA_INDEX, lifeTimeRegister.index);

                    var i;

                    var startMulValue;
                    var deltaMulValues;
                    if (this._iUsesMultiplier) {
                        startMulValue = animationRegisterCache.getFreeVertexConstant();
                        animationRegisterCache.setRegisterIndex(this, ParticleSegmentedColorNode.START_MULTIPLIER_INDEX, startMulValue.index);
                        deltaMulValues = new Array();
                        for (i = 0; i < this._iNumSegmentPoint + 1; i++)
                            deltaMulValues.push(animationRegisterCache.getFreeVertexConstant());
                    }

                    var startOffsetValue;
                    var deltaOffsetValues;
                    if (this._iUsesOffset) {
                        startOffsetValue = animationRegisterCache.getFreeVertexConstant();
                        animationRegisterCache.setRegisterIndex(this, ParticleSegmentedColorNode.START_OFFSET_INDEX, startOffsetValue.index);
                        deltaOffsetValues = new Array();
                        for (i = 0; i < this._iNumSegmentPoint + 1; i++)
                            deltaOffsetValues.push(animationRegisterCache.getFreeVertexConstant());
                    }

                    if (this._iUsesMultiplier)
                        code += "mov " + accMultiplierColor + "," + startMulValue + "\n";
                    if (this._iUsesOffset)
                        code += "add " + animationRegisterCache.colorAddTarget + "," + animationRegisterCache.colorAddTarget + "," + startOffsetValue + "\n";

                    for (i = 0; i < this._iNumSegmentPoint; i++) {
                        switch (i) {
                            case 0:
                                code += "min " + tempTime + "," + animationRegisterCache.vertexLife + "," + lifeTimeRegister + ".x\n";
                                break;
                            case 1:
                                code += "sub " + accTime + "," + animationRegisterCache.vertexLife + "," + lifeTimeRegister + ".x\n";
                                code += "max " + tempTime + "," + accTime + "," + animationRegisterCache.vertexZeroConst + "\n";
                                code += "min " + tempTime + "," + tempTime + "," + lifeTimeRegister + ".y\n";
                                break;
                            case 2:
                                code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".y\n";
                                code += "max " + tempTime + "," + accTime + "," + animationRegisterCache.vertexZeroConst + "\n";
                                code += "min " + tempTime + "," + tempTime + "," + lifeTimeRegister + ".z\n";
                                break;
                            case 3:
                                code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".z\n";
                                code += "max " + tempTime + "," + accTime + "," + animationRegisterCache.vertexZeroConst + "\n";
                                code += "min " + tempTime + "," + tempTime + "," + lifeTimeRegister + ".w\n";
                                break;
                        }
                        if (this._iUsesMultiplier) {
                            code += "mul " + tempColor + "," + tempTime + "," + deltaMulValues[i] + "\n";
                            code += "add " + accMultiplierColor + "," + accMultiplierColor + "," + tempColor + "\n";
                        }
                        if (this._iUsesOffset) {
                            code += "mul " + tempColor + "," + tempTime + "," + deltaOffsetValues[i] + "\n";
                            code += "add " + animationRegisterCache.colorAddTarget + "," + animationRegisterCache.colorAddTarget + "," + tempColor + "\n";
                        }
                    }

                    //for the last segment:
                    if (this._iNumSegmentPoint == 0)
                        tempTime = animationRegisterCache.vertexLife;
                    else {
                        switch (this._iNumSegmentPoint) {
                            case 1:
                                code += "sub " + accTime + "," + animationRegisterCache.vertexLife + "," + lifeTimeRegister + ".x\n";
                                break;
                            case 2:
                                code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".y\n";
                                break;
                            case 3:
                                code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".z\n";
                                break;
                            case 4:
                                code += "sub " + accTime + "," + accTime + "," + lifeTimeRegister + ".w\n";
                                break;
                        }
                        code += "max " + tempTime + "," + accTime + "," + animationRegisterCache.vertexZeroConst + "\n";
                    }
                    if (this._iUsesMultiplier) {
                        code += "mul " + tempColor + "," + tempTime + "," + deltaMulValues[this._iNumSegmentPoint] + "\n";
                        code += "add " + accMultiplierColor + "," + accMultiplierColor + "," + tempColor + "\n";
                        code += "mul " + animationRegisterCache.colorMulTarget + "," + animationRegisterCache.colorMulTarget + "," + accMultiplierColor + "\n";
                    }
                    if (this._iUsesOffset) {
                        code += "mul " + tempColor + "," + tempTime + "," + deltaOffsetValues[this._iNumSegmentPoint] + "\n";
                        code += "add " + animationRegisterCache.colorAddTarget + "," + animationRegisterCache.colorAddTarget + "," + tempColor + "\n";
                    }
                }
                return code;
            };
            ParticleSegmentedColorNode.START_MULTIPLIER_INDEX = 0;

            ParticleSegmentedColorNode.START_OFFSET_INDEX = 1;

            ParticleSegmentedColorNode.TIME_DATA_INDEX = 2;
            return ParticleSegmentedColorNode;
        })(animators.ParticleNodeBase);
        animators.ParticleSegmentedColorNode = ParticleSegmentedColorNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ShaderRegisterElement = away.materials.ShaderRegisterElement;

        /**
        * A particle animation node used when a spritesheet texture is required to animate the particle.
        * NB: to enable use of this node, the <code>repeat</code> property on the material has to be set to true.
        */
        var ParticleSpriteSheetNode = (function (_super) {
            __extends(ParticleSpriteSheetNode, _super);
            /**
            * Creates a new <code>ParticleSpriteSheetNode</code>
            *
            * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
            * @param    [optional] numColumns      Defines the number of columns in the spritesheet, when in global mode. Defaults to 1.
            * @param    [optional] numRows         Defines the number of rows in the spritesheet, when in global mode. Defaults to 1.
            * @param    [optional] cycleDuration   Defines the default cycle duration in seconds, when in global mode. Defaults to 1.
            * @param    [optional] cyclePhase      Defines the default cycle phase, when in global mode. Defaults to 0.
            * @param    [optional] totalFrames     Defines the total number of frames used by the spritesheet, when in global mode. Defaults to the number defined by numColumns and numRows.
            * @param    [optional] looping         Defines whether the spritesheet animation is set to loop indefinitely. Defaults to true.
            */
            function ParticleSpriteSheetNode(mode /*uint*/ , usesCycle, usesPhase, numColumns, numRows, cycleDuration, cyclePhase, totalFrames) {
                if (typeof numColumns === "undefined") { numColumns = 1; }
                if (typeof numRows === "undefined") { numRows = 1; }
                if (typeof cycleDuration === "undefined") { cycleDuration = 1; }
                if (typeof cyclePhase === "undefined") { cyclePhase = 0; }
                if (typeof totalFrames === "undefined") { totalFrames = Number.MAX_VALUE; }
                _super.call(this, "ParticleSpriteSheet", mode, usesCycle ? (usesPhase ? 3 : 2) : 1, animators.ParticleAnimationSet.POST_PRIORITY + 1);

                this._pStateClass = animators.ParticleSpriteSheetState;

                this._iUsesCycle = usesCycle;
                this._iUsesPhase = usesPhase;

                this._iNumColumns = numColumns;
                this._iNumRows = numRows;
                this._iCyclePhase = cyclePhase;
                this._iCycleDuration = cycleDuration;
                this._iTotalFrames = Math.min(totalFrames, numColumns * numRows);
            }
            Object.defineProperty(ParticleSpriteSheetNode.prototype, "numColumns", {
                /**
                * Defines the number of columns in the spritesheet, when in global mode. Defaults to 1. Read only.
                */
                get: function () {
                    return this._iNumColumns;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ParticleSpriteSheetNode.prototype, "numRows", {
                /**
                * Defines the number of rows in the spritesheet, when in global mode. Defaults to 1. Read only.
                */
                get: function () {
                    return this._iNumRows;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ParticleSpriteSheetNode.prototype, "totalFrames", {
                /**
                * Defines the total number of frames used by the spritesheet, when in global mode. Defaults to the number defined by numColumns and numRows. Read only.
                */
                get: function () {
                    return this._iTotalFrames;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * @inheritDoc
            */
            ParticleSpriteSheetNode.prototype.getAGALUVCode = function (shaderObject, animationRegisterCache) {
                //get 2 vc
                var uvParamConst1 = animationRegisterCache.getFreeVertexConstant();
                var uvParamConst2 = (this._pMode == animators.ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
                animationRegisterCache.setRegisterIndex(this, ParticleSpriteSheetNode.UV_INDEX_0, uvParamConst1.index);
                animationRegisterCache.setRegisterIndex(this, ParticleSpriteSheetNode.UV_INDEX_1, uvParamConst2.index);

                var uTotal = new ShaderRegisterElement(uvParamConst1.regName, uvParamConst1.index, 0);
                var uStep = new ShaderRegisterElement(uvParamConst1.regName, uvParamConst1.index, 1);
                var vStep = new ShaderRegisterElement(uvParamConst1.regName, uvParamConst1.index, 2);

                var uSpeed = new ShaderRegisterElement(uvParamConst2.regName, uvParamConst2.index, 0);
                var cycle = new ShaderRegisterElement(uvParamConst2.regName, uvParamConst2.index, 1);
                var phaseTime = new ShaderRegisterElement(uvParamConst2.regName, uvParamConst2.index, 2);

                var temp = animationRegisterCache.getFreeVertexVectorTemp();
                var time = new ShaderRegisterElement(temp.regName, temp.index, 0);
                var vOffset = new ShaderRegisterElement(temp.regName, temp.index, 1);
                temp = new ShaderRegisterElement(temp.regName, temp.index, 2);
                var temp2 = new ShaderRegisterElement(temp.regName, temp.index, 3);

                var u = new ShaderRegisterElement(animationRegisterCache.uvTarget.regName, animationRegisterCache.uvTarget.index, 0);
                var v = new ShaderRegisterElement(animationRegisterCache.uvTarget.regName, animationRegisterCache.uvTarget.index, 1);

                var code = "";

                //scale uv
                code += "mul " + u + "," + u + "," + uStep + "\n";
                if (this._iNumRows > 1)
                    code += "mul " + v + "," + v + "," + vStep + "\n";

                if (this._iUsesCycle) {
                    if (this._iUsesPhase)
                        code += "add " + time + "," + animationRegisterCache.vertexTime + "," + phaseTime + "\n";
                    else
                        code += "mov " + time + "," + animationRegisterCache.vertexTime + "\n";
                    code += "div " + time + "," + time + "," + cycle + "\n";
                    code += "frc " + time + "," + time + "\n";
                    code += "mul " + time + "," + time + "," + cycle + "\n";
                    code += "mul " + temp + "," + time + "," + uSpeed + "\n";
                } else
                    code += "mul " + temp.toString() + "," + animationRegisterCache.vertexLife + "," + uTotal + "\n";

                if (this._iNumRows > 1) {
                    code += "frc " + temp2 + "," + temp + "\n";
                    code += "sub " + vOffset + "," + temp + "," + temp2 + "\n";
                    code += "mul " + vOffset + "," + vOffset + "," + vStep + "\n";
                    code += "add " + v + "," + v + "," + vOffset + "\n";
                }

                code += "div " + temp2 + "," + temp + "," + uStep + "\n";
                code += "frc " + temp + "," + temp2 + "\n";
                code += "sub " + temp2 + "," + temp2 + "," + temp + "\n";
                code += "mul " + temp + "," + temp2 + "," + uStep + "\n";

                if (this._iNumRows > 1)
                    code += "frc " + temp + "," + temp + "\n";
                code += "add " + u + "," + u + "," + temp + "\n";

                return code;
            };

            /**
            * @inheritDoc
            */
            ParticleSpriteSheetNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };

            /**
            * @inheritDoc
            */
            ParticleSpriteSheetNode.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
                particleAnimationSet.hasUVNode = true;
            };

            /**
            * @inheritDoc
            */
            ParticleSpriteSheetNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
                if (this._iUsesCycle) {
                    var uvCycle = param[ParticleSpriteSheetNode.UV_VECTOR3D];
                    if (!uvCycle)
                        throw (new Error("there is no " + ParticleSpriteSheetNode.UV_VECTOR3D + " in param!"));
                    if (uvCycle.x <= 0)
                        throw (new Error("the cycle duration must be greater than zero"));
                    var uTotal = this._iTotalFrames / this._iNumColumns;
                    this._pOneData[0] = uTotal / uvCycle.x;
                    this._pOneData[1] = uvCycle.x;
                    if (this._iUsesPhase)
                        this._pOneData[2] = uvCycle.y;
                }
            };
            ParticleSpriteSheetNode.UV_INDEX_0 = 0;

            ParticleSpriteSheetNode.UV_INDEX_1 = 1;

            ParticleSpriteSheetNode.UV_VECTOR3D = "UVVector3D";
            return ParticleSpriteSheetNode;
        })(animators.ParticleNodeBase);
        animators.ParticleSpriteSheetNode = ParticleSpriteSheetNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * A particle animation node used as the base node for timekeeping inside a particle. Automatically added to a particle animation set on instatiation.
        */
        var ParticleTimeNode = (function (_super) {
            __extends(ParticleTimeNode, _super);
            /**
            * Creates a new <code>ParticleTimeNode</code>
            *
            * @param    [optional] usesDuration    Defines whether the node uses the <code>duration</code> data in the static properties to determine how long a particle is visible for. Defaults to false.
            * @param    [optional] usesDelay       Defines whether the node uses the <code>delay</code> data in the static properties to determine how long a particle is hidden for. Defaults to false. Requires <code>usesDuration</code> to be true.
            * @param    [optional] usesLooping     Defines whether the node creates a looping timeframe for each particle determined by the <code>startTime</code>, <code>duration</code> and <code>delay</code> data in the static properties function. Defaults to false. Requires <code>usesLooping</code> to be true.
            */
            function ParticleTimeNode(usesDuration, usesLooping, usesDelay) {
                if (typeof usesDuration === "undefined") { usesDuration = false; }
                if (typeof usesLooping === "undefined") { usesLooping = false; }
                if (typeof usesDelay === "undefined") { usesDelay = false; }
                this._pStateClass = animators.ParticleTimeState;

                this._iUsesDuration = usesDuration;
                this._iUsesLooping = usesLooping;
                this._iUsesDelay = usesDelay;

                _super.call(this, "ParticleTime", animators.ParticlePropertiesMode.LOCAL_STATIC, 4, 0);
            }
            /**
            * @inheritDoc
            */
            ParticleTimeNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
                var timeStreamRegister = animationRegisterCache.getFreeVertexAttribute();
                animationRegisterCache.setRegisterIndex(this, ParticleTimeNode.TIME_STREAM_INDEX, timeStreamRegister.index);
                var timeConst = animationRegisterCache.getFreeVertexConstant();
                animationRegisterCache.setRegisterIndex(this, ParticleTimeNode.TIME_CONSTANT_INDEX, timeConst.index);

                var code = "";
                code += "sub " + animationRegisterCache.vertexTime + "," + timeConst + "," + timeStreamRegister + ".x\n";

                //if time=0,set the position to zero.
                var temp = animationRegisterCache.getFreeVertexSingleTemp();
                code += "sge " + temp + "," + animationRegisterCache.vertexTime + "," + animationRegisterCache.vertexZeroConst + "\n";
                code += "mul " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + temp + "\n";
                if (this._iUsesDuration) {
                    if (this._iUsesLooping) {
                        var div = animationRegisterCache.getFreeVertexSingleTemp();
                        if (this._iUsesDelay) {
                            code += "div " + div + "," + animationRegisterCache.vertexTime + "," + timeStreamRegister + ".z\n";
                            code += "frc " + div + "," + div + "\n";
                            code += "mul " + animationRegisterCache.vertexTime + "," + div + "," + timeStreamRegister + ".z\n";
                            code += "slt " + div + "," + animationRegisterCache.vertexTime + "," + timeStreamRegister + ".y\n";
                            code += "mul " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + div + "\n";
                        } else {
                            code += "mul " + div + "," + animationRegisterCache.vertexTime + "," + timeStreamRegister + ".w\n";
                            code += "frc " + div + "," + div + "\n";
                            code += "mul " + animationRegisterCache.vertexTime + "," + div + "," + timeStreamRegister + ".y\n";
                        }
                    } else {
                        var sge = animationRegisterCache.getFreeVertexSingleTemp();
                        code += "sge " + sge + "," + timeStreamRegister + ".y," + animationRegisterCache.vertexTime + "\n";
                        code += "mul " + animationRegisterCache.scaleAndRotateTarget + ".xyz," + animationRegisterCache.scaleAndRotateTarget + ".xyz," + sge + "\n";
                    }
                }
                code += "mul " + animationRegisterCache.vertexLife + "," + animationRegisterCache.vertexTime + "," + timeStreamRegister + ".w\n";
                return code;
            };

            /**
            * @inheritDoc
            */
            ParticleTimeNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };

            /**
            * @inheritDoc
            */
            ParticleTimeNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
                this._pOneData[0] = param.startTime;
                this._pOneData[1] = param.duration;
                this._pOneData[2] = param.delay + param.duration;
                this._pOneData[3] = 1 / param.duration;
            };
            ParticleTimeNode.TIME_STREAM_INDEX = 0;

            ParticleTimeNode.TIME_CONSTANT_INDEX = 1;
            return ParticleTimeNode;
        })(animators.ParticleNodeBase);
        animators.ParticleTimeNode = ParticleTimeNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var Vector3D = away.geom.Vector3D;

        var ShaderRegisterElement = away.materials.ShaderRegisterElement;

        /**
        * A particle animation node used to control the UV offset and scale of a particle over time.
        */
        var ParticleUVNode = (function (_super) {
            __extends(ParticleUVNode, _super);
            /**
            * Creates a new <code>ParticleTimeNode</code>
            *
            * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
            * @param    [optional] cycle           Defines whether the time track is in loop mode. Defaults to false.
            * @param    [optional] scale           Defines whether the time track is in loop mode. Defaults to false.
            * @param    [optional] axis            Defines whether the time track is in loop mode. Defaults to false.
            */
            function ParticleUVNode(mode /*uint*/ , cycle, scale, axis) {
                if (typeof cycle === "undefined") { cycle = 1; }
                if (typeof scale === "undefined") { scale = 1; }
                if (typeof axis === "undefined") { axis = "x"; }
                //because of the stage3d register limitation, it only support the global mode
                _super.call(this, "ParticleUV", animators.ParticlePropertiesMode.GLOBAL, 4, animators.ParticleAnimationSet.POST_PRIORITY + 1);

                this._pStateClass = animators.ParticleUVState;

                this._cycle = cycle;
                this._scale = scale;
                this._axis = axis;

                this.updateUVData();
            }
            Object.defineProperty(ParticleUVNode.prototype, "cycle", {
                /**
                *
                */
                get: function () {
                    return this._cycle;
                },
                set: function (value) {
                    this._cycle = value;

                    this.updateUVData();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ParticleUVNode.prototype, "scale", {
                /**
                *
                */
                get: function () {
                    return this._scale;
                },
                set: function (value) {
                    this._scale = value;

                    this.updateUVData();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ParticleUVNode.prototype, "axis", {
                /**
                *
                */
                get: function () {
                    return this._axis;
                },
                set: function (value) {
                    this._axis = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            ParticleUVNode.prototype.getAGALUVCode = function (shaderObject, animationRegisterCache) {
                var code = "";

                var uvConst = animationRegisterCache.getFreeVertexConstant();
                animationRegisterCache.setRegisterIndex(this, ParticleUVNode.UV_INDEX, uvConst.index);

                var axisIndex = this._axis == "x" ? 0 : (this._axis == "y" ? 1 : 2);

                var target = new ShaderRegisterElement(animationRegisterCache.uvTarget.regName, animationRegisterCache.uvTarget.index, axisIndex);

                var sin = animationRegisterCache.getFreeVertexSingleTemp();

                if (this._scale != 1)
                    code += "mul " + target + "," + target + "," + uvConst + ".y\n";

                code += "mul " + sin + "," + animationRegisterCache.vertexTime + "," + uvConst + ".x\n";
                code += "sin " + sin + "," + sin + "\n";
                code += "add " + target + "," + target + "," + sin + "\n";

                return code;
            };

            /**
            * @inheritDoc
            */
            ParticleUVNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };

            ParticleUVNode.prototype.updateUVData = function () {
                this._iUvData = new Vector3D(Math.PI * 2 / this._cycle, this._scale, 0, 0);
            };

            /**
            * @inheritDoc
            */
            ParticleUVNode.prototype._iProcessAnimationSetting = function (particleAnimationSet) {
                particleAnimationSet.hasUVNode = true;
            };
            ParticleUVNode.UV_INDEX = 0;

            ParticleUVNode.U_AXIS = "x";

            ParticleUVNode.V_AXIS = "y";
            return ParticleUVNode;
        })(animators.ParticleNodeBase);
        animators.ParticleUVNode = ParticleUVNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var Vector3D = away.geom.Vector3D;

        /**
        * A particle animation node used to set the starting velocity of a particle.
        */
        var ParticleVelocityNode = (function (_super) {
            __extends(ParticleVelocityNode, _super);
            /**
            * Creates a new <code>ParticleVelocityNode</code>
            *
            * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
            * @param    [optional] velocity        Defines the default velocity vector of the node, used when in global mode.
            */
            function ParticleVelocityNode(mode /*uint*/ , velocity) {
                if (typeof velocity === "undefined") { velocity = null; }
                _super.call(this, "ParticleVelocity", mode, 3);

                this._pStateClass = animators.ParticleVelocityState;

                this._iVelocity = velocity || new Vector3D();
            }
            /**
            * @inheritDoc
            */
            ParticleVelocityNode.prototype.getAGALVertexCode = function (shaderObject, animationRegisterCache) {
                var velocityValue = (this._pMode == animators.ParticlePropertiesMode.GLOBAL) ? animationRegisterCache.getFreeVertexConstant() : animationRegisterCache.getFreeVertexAttribute();
                animationRegisterCache.setRegisterIndex(this, ParticleVelocityNode.VELOCITY_INDEX, velocityValue.index);

                var distance = animationRegisterCache.getFreeVertexVectorTemp();
                var code = "";
                code += "mul " + distance + "," + animationRegisterCache.vertexTime + "," + velocityValue + "\n";
                code += "add " + animationRegisterCache.positionTarget + ".xyz," + distance + "," + animationRegisterCache.positionTarget + ".xyz\n";

                if (animationRegisterCache.needVelocity)
                    code += "add " + animationRegisterCache.velocityTarget + ".xyz," + velocityValue + ".xyz," + animationRegisterCache.velocityTarget + ".xyz\n";

                return code;
            };

            /**
            * @inheritDoc
            */
            ParticleVelocityNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };

            /**
            * @inheritDoc
            */
            ParticleVelocityNode.prototype._iGeneratePropertyOfOneParticle = function (param) {
                var _tempVelocity = param[ParticleVelocityNode.VELOCITY_VECTOR3D];
                if (!_tempVelocity)
                    throw new Error("there is no " + ParticleVelocityNode.VELOCITY_VECTOR3D + " in param!");

                this._pOneData[0] = _tempVelocity.x;
                this._pOneData[1] = _tempVelocity.y;
                this._pOneData[2] = _tempVelocity.z;
            };
            ParticleVelocityNode.VELOCITY_INDEX = 0;

            ParticleVelocityNode.VELOCITY_VECTOR3D = "VelocityVector3D";
            return ParticleVelocityNode;
        })(animators.ParticleNodeBase);
        animators.ParticleVelocityNode = ParticleVelocityNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * A skeleton animation node that uses two animation node inputs to blend a lineraly interpolated output of a skeleton pose.
        */
        var SkeletonBinaryLERPNode = (function (_super) {
            __extends(SkeletonBinaryLERPNode, _super);
            /**
            * Creates a new <code>SkeletonBinaryLERPNode</code> object.
            */
            function SkeletonBinaryLERPNode() {
                _super.call(this);

                this._pStateClass = animators.SkeletonBinaryLERPState;
            }
            /**
            * @inheritDoc
            */
            SkeletonBinaryLERPNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };
            return SkeletonBinaryLERPNode;
        })(animators.AnimationNodeBase);
        animators.SkeletonBinaryLERPNode = SkeletonBinaryLERPNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * A skeleton animation node containing time-based animation data as individual skeleton poses.
        */
        var SkeletonClipNode = (function (_super) {
            __extends(SkeletonClipNode, _super);
            /**
            * Creates a new <code>SkeletonClipNode</code> object.
            */
            function SkeletonClipNode() {
                _super.call(this);
                this._frames = new Array();
                /**
                * Determines whether to use SLERP equations (true) or LERP equations (false) in the calculation
                * of the output skeleton pose. Defaults to false.
                */
                this.highQuality = false;

                this._pStateClass = animators.SkeletonClipState;
            }
            Object.defineProperty(SkeletonClipNode.prototype, "frames", {
                /**
                * Returns a vector of skeleton poses representing the pose of each animation frame in the clip.
                */
                get: function () {
                    return this._frames;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Adds a skeleton pose frame to the internal timeline of the animation node.
            *
            * @param skeletonPose The skeleton pose object to add to the timeline of the node.
            * @param duration The specified duration of the frame in milliseconds.
            */
            SkeletonClipNode.prototype.addFrame = function (skeletonPose, duration /*number /*uint*/ ) {
                this._frames.push(skeletonPose);
                this._pDurations.push(duration);

                this._pNumFrames = this._pDurations.length;

                this._pStitchDirty = true;
            };

            /**
            * @inheritDoc
            */
            SkeletonClipNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };

            /**
            * @inheritDoc
            */
            SkeletonClipNode.prototype._pUpdateStitch = function () {
                _super.prototype._pUpdateStitch.call(this);

                var i = this._pNumFrames - 1;
                var p1, p2, delta;
                while (i--) {
                    this._pTotalDuration += this._pDurations[i];
                    p1 = this._frames[i].jointPoses[0].translation;
                    p2 = this._frames[i + 1].jointPoses[0].translation;
                    delta = p2.subtract(p1);
                    this._pTotalDelta.x += delta.x;
                    this._pTotalDelta.y += delta.y;
                    this._pTotalDelta.z += delta.z;
                }

                if (this._pStitchFinalFrame || !this._pLooping) {
                    this._pTotalDuration += this._pDurations[this._pNumFrames - 1];
                    p1 = this._frames[0].jointPoses[0].translation;
                    p2 = this._frames[1].jointPoses[0].translation;
                    delta = p2.subtract(p1);
                    this._pTotalDelta.x += delta.x;
                    this._pTotalDelta.y += delta.y;
                    this._pTotalDelta.z += delta.z;
                }
            };
            return SkeletonClipNode;
        })(animators.AnimationClipNodeBase);
        animators.SkeletonClipNode = SkeletonClipNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * A skeleton animation node that uses a difference input pose with a base input pose to blend a linearly interpolated output of a skeleton pose.
        */
        var SkeletonDifferenceNode = (function (_super) {
            __extends(SkeletonDifferenceNode, _super);
            /**
            * Creates a new <code>SkeletonAdditiveNode</code> object.
            */
            function SkeletonDifferenceNode() {
                _super.call(this);

                this._pStateClass = animators.SkeletonDifferenceState;
            }
            /**
            * @inheritDoc
            */
            SkeletonDifferenceNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };
            return SkeletonDifferenceNode;
        })(animators.AnimationNodeBase);
        animators.SkeletonDifferenceNode = SkeletonDifferenceNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * A skeleton animation node that uses four directional input poses with an input direction to blend a linearly interpolated output of a skeleton pose.
        */
        var SkeletonDirectionalNode = (function (_super) {
            __extends(SkeletonDirectionalNode, _super);
            function SkeletonDirectionalNode() {
                _super.call(this);

                this._pStateClass = animators.SkeletonDirectionalState;
            }
            /**
            * @inheritDoc
            */
            SkeletonDirectionalNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };
            return SkeletonDirectionalNode;
        })(animators.AnimationNodeBase);
        animators.SkeletonDirectionalNode = SkeletonDirectionalNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * A skeleton animation node that uses an n-dimensional array of animation node inputs to blend a lineraly interpolated output of a skeleton pose.
        */
        var SkeletonNaryLERPNode = (function (_super) {
            __extends(SkeletonNaryLERPNode, _super);
            /**
            * Creates a new <code>SkeletonNaryLERPNode</code> object.
            */
            function SkeletonNaryLERPNode() {
                _super.call(this);
                this._iInputs = new Array();

                this._pStateClass = animators.SkeletonNaryLERPState;
            }
            Object.defineProperty(SkeletonNaryLERPNode.prototype, "numInputs", {
                get: function () {
                    return this._numInputs;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Returns an integer representing the input index of the given skeleton animation node.
            *
            * @param input The skeleton animation node for with the input index is requested.
            */
            SkeletonNaryLERPNode.prototype.getInputIndex = function (input) {
                return this._iInputs.indexOf(input);
            };

            /**
            * Returns the skeleton animation node object that resides at the given input index.
            *
            * @param index The input index for which the skeleton animation node is requested.
            */
            SkeletonNaryLERPNode.prototype.getInputAt = function (index /*uint*/ ) {
                return this._iInputs[index];
            };

            /**
            * Adds a new skeleton animation node input to the animation node.
            */
            SkeletonNaryLERPNode.prototype.addInput = function (input) {
                this._iInputs[this._numInputs++] = input;
            };

            /**
            * @inheritDoc
            */
            SkeletonNaryLERPNode.prototype.getAnimationState = function (animator) {
                return animator.getAnimationState(this);
            };
            return SkeletonNaryLERPNode;
        })(animators.AnimationNodeBase);
        animators.SkeletonNaryLERPNode = SkeletonNaryLERPNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * A vertex animation node containing time-based animation data as individual geometry obejcts.
        */
        var VertexClipNode = (function (_super) {
            __extends(VertexClipNode, _super);
            /**
            * Creates a new <code>VertexClipNode</code> object.
            */
            function VertexClipNode() {
                _super.call(this);
                this._frames = new Array();
                this._translations = new Array();

                this._pStateClass = away.animators.VertexClipState;
            }
            Object.defineProperty(VertexClipNode.prototype, "frames", {
                /**
                * Returns a vector of geometry frames representing the vertex values of each animation frame in the clip.
                */
                get: function () {
                    return this._frames;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Adds a geometry object to the internal timeline of the animation node.
            *
            * @param geometry The geometry object to add to the timeline of the node.
            * @param duration The specified duration of the frame in milliseconds.
            * @param translation The absolute translation of the frame, used in root delta calculations for mesh movement.
            */
            VertexClipNode.prototype.addFrame = function (geometry, duration /*uint*/ , translation) {
                if (typeof translation === "undefined") { translation = null; }
                this._frames.push(geometry);
                this._pDurations.push(duration);
                this._translations.push(translation || new away.geom.Vector3D());

                this._pNumFrames = this._pDurations.length;

                this._pStitchDirty = true;
            };

            /**
            * @inheritDoc
            */
            VertexClipNode.prototype._pUpdateStitch = function () {
                _super.prototype._pUpdateStitch.call(this);

                var i = this._pNumFrames - 1;
                var p1, p2, delta;
                while (i--) {
                    this._pTotalDuration += this._pDurations[i];
                    p1 = this._translations[i];
                    p2 = this._translations[i + 1];
                    delta = p2.subtract(p1);
                    this._pTotalDelta.x += delta.x;
                    this._pTotalDelta.y += delta.y;
                    this._pTotalDelta.z += delta.z;
                }

                if (this._pNumFrames > 1 && (this._pStitchFinalFrame || !this._pLooping)) {
                    this._pTotalDuration += this._pDurations[this._pNumFrames - 1];
                    p1 = this._translations[0];
                    p2 = this._translations[1];
                    delta = p2.subtract(p1);
                    this._pTotalDelta.x += delta.x;
                    this._pTotalDelta.y += delta.y;
                    this._pTotalDelta.z += delta.z;
                }
            };
            return VertexClipNode;
        })(animators.AnimationClipNodeBase);
        animators.VertexClipNode = VertexClipNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (animators) {
        /**
        *
        */
        var AnimationStateBase = (function () {
            function AnimationStateBase(animator, animationNode) {
                this._pRootDelta = new away.geom.Vector3D();
                this._pPositionDeltaDirty = true;
                this._pStartTime = 0;
                this._pAnimator = animator;
                this._pAnimationNode = animationNode;
            }
            Object.defineProperty(AnimationStateBase.prototype, "positionDelta", {
                /**
                * Returns a 3d vector representing the translation delta of the animating entity for the current timestep of animation
                */
                get: function () {
                    if (this._pPositionDeltaDirty) {
                        this._pUpdatePositionDelta();
                    }

                    return this._pRootDelta;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Resets the start time of the node to a  new value.
            *
            * @param startTime The absolute start time (in milliseconds) of the node's starting time.
            */
            AnimationStateBase.prototype.offset = function (startTime) {
                this._pStartTime = startTime;

                this._pPositionDeltaDirty = true;
            };

            /**
            * Updates the configuration of the node to its current state.
            *
            * @param time The absolute time (in milliseconds) of the animator's play head position.
            *
            * @see away.animators.AnimatorBase#update()
            */
            AnimationStateBase.prototype.update = function (time) {
                if (this._pTime == time - this._pStartTime) {
                    return;
                }

                this._pUpdateTime(time);
            };

            /**
            * Sets the animation phase of the node.
            *
            * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
            */
            AnimationStateBase.prototype.phase = function (value) {
            };

            /**
            * Updates the node's internal playhead position.
            *
            * @param time The local time (in milliseconds) of the node's playhead position.
            */
            AnimationStateBase.prototype._pUpdateTime = function (time) {
                this._pTime = time - this._pStartTime;

                this._pPositionDeltaDirty = true;
            };

            /**
            * Updates the node's root delta position
            */
            AnimationStateBase.prototype._pUpdatePositionDelta = function () {
            };
            return AnimationStateBase;
        })();
        animators.AnimationStateBase = AnimationStateBase;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * ...
        */
        var ParticleStateBase = (function (_super) {
            __extends(ParticleStateBase, _super);
            function ParticleStateBase(animator, particleNode, needUpdateTime) {
                if (typeof needUpdateTime === "undefined") { needUpdateTime = false; }
                _super.call(this, animator, particleNode);
                this._pDynamicProperties = new Array();
                this._pDynamicPropertiesDirty = new Object();

                this._particleNode = particleNode;
                this._pNeedUpdateTime = needUpdateTime;
            }
            Object.defineProperty(ParticleStateBase.prototype, "needUpdateTime", {
                get: function () {
                    return this._pNeedUpdateTime;
                },
                enumerable: true,
                configurable: true
            });

            ParticleStateBase.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
            };

            ParticleStateBase.prototype._pUpdateDynamicProperties = function (animationSubGeometry) {
                this._pDynamicPropertiesDirty[animationSubGeometry._iUniqueId] = true;

                var animationParticles = animationSubGeometry.animationParticles;
                var vertexData = animationSubGeometry.vertexData;
                var totalLenOfOneVertex = animationSubGeometry.totalLenOfOneVertex;
                var dataLength = this._particleNode.dataLength;
                var dataOffset = this._particleNode._iDataOffset;
                var vertexLength;

                //			var particleOffset:number /*uint*/;
                var startingOffset;
                var vertexOffset;
                var data;
                var animationParticle;

                //			var numParticles:number /*uint*/ = _positions.length/dataLength;
                var numParticles = this._pDynamicProperties.length;
                var i = 0;
                var j = 0;
                var k = 0;

                while (i < numParticles) {
                    while (j < numParticles && (animationParticle = animationParticles[j]).index == i) {
                        data = this._pDynamicProperties[i];
                        vertexLength = animationParticle.numVertices * totalLenOfOneVertex;
                        startingOffset = animationParticle.startVertexIndex * totalLenOfOneVertex + dataOffset;

                        for (k = 0; k < vertexLength; k += totalLenOfOneVertex) {
                            vertexOffset = startingOffset + k;

                            for (k = 0; k < vertexLength; k += totalLenOfOneVertex) {
                                vertexOffset = startingOffset + k;
                                vertexData[vertexOffset++] = data.x;
                                vertexData[vertexOffset++] = data.y;
                                vertexData[vertexOffset++] = data.z;

                                if (dataLength == 4)
                                    vertexData[vertexOffset++] = data.w;
                            }
                            //loop through each value in the particle vertex
                            //						switch(dataLength) {
                            //							case 4:
                            //								vertexData[vertexOffset++] = _positions[particleOffset++];
                            //							case 3:
                            //								vertexData[vertexOffset++] = _positions[particleOffset++];
                            //							case 2:
                            //								vertexData[vertexOffset++] = _positions[particleOffset++];
                            //							case 1:
                            //								vertexData[vertexOffset++] = _positions[particleOffset++];
                            //						}
                        }
                        j++;
                    }
                    i++;
                }

                animationSubGeometry.invalidateBuffer();
            };
            return ParticleStateBase;
        })(animators.AnimationStateBase);
        animators.ParticleStateBase = ParticleStateBase;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ContextGLVertexBufferFormat = away.stagegl.ContextGLVertexBufferFormat;
        var Vector3D = away.geom.Vector3D;

        /**
        * ...
        */
        var ParticleAccelerationState = (function (_super) {
            __extends(ParticleAccelerationState, _super);
            function ParticleAccelerationState(animator, particleAccelerationNode) {
                _super.call(this, animator, particleAccelerationNode);

                this._particleAccelerationNode = particleAccelerationNode;
                this._acceleration = this._particleAccelerationNode._acceleration;

                this.updateAccelerationData();
            }
            Object.defineProperty(ParticleAccelerationState.prototype, "acceleration", {
                /**
                * Defines the acceleration vector of the state, used when in global mode.
                */
                get: function () {
                    return this._acceleration;
                },
                set: function (value) {
                    this._acceleration.x = value.x;
                    this._acceleration.y = value.y;
                    this._acceleration.z = value.z;

                    this.updateAccelerationData();
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            ParticleAccelerationState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
                var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleAccelerationNode.ACCELERATION_INDEX);

                if (this._particleAccelerationNode.mode == animators.ParticlePropertiesMode.LOCAL_STATIC)
                    animationSubGeometry.activateVertexBuffer(index, this._particleAccelerationNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
                else
                    animationRegisterCache.setVertexConst(index, this._halfAcceleration.x, this._halfAcceleration.y, this._halfAcceleration.z);
            };

            ParticleAccelerationState.prototype.updateAccelerationData = function () {
                if (this._particleAccelerationNode.mode == animators.ParticlePropertiesMode.GLOBAL)
                    this._halfAcceleration = new Vector3D(this._acceleration.x / 2, this._acceleration.y / 2, this._acceleration.z / 2);
            };
            return ParticleAccelerationState;
        })(animators.ParticleStateBase);
        animators.ParticleAccelerationState = ParticleAccelerationState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ContextGLVertexBufferFormat = away.stagegl.ContextGLVertexBufferFormat;

        /**
        * ...
        */
        var ParticleBezierCurveState = (function (_super) {
            __extends(ParticleBezierCurveState, _super);
            function ParticleBezierCurveState(animator, particleBezierCurveNode) {
                _super.call(this, animator, particleBezierCurveNode);

                this._particleBezierCurveNode = particleBezierCurveNode;
                this._controlPoint = this._particleBezierCurveNode._iControlPoint;
                this._endPoint = this._particleBezierCurveNode._iEndPoint;
            }
            Object.defineProperty(ParticleBezierCurveState.prototype, "controlPoint", {
                /**
                * Defines the default control point of the node, used when in global mode.
                */
                get: function () {
                    return this._controlPoint;
                },
                set: function (value) {
                    this._controlPoint = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ParticleBezierCurveState.prototype, "endPoint", {
                /**
                * Defines the default end point of the node, used when in global mode.
                */
                get: function () {
                    return this._endPoint;
                },
                set: function (value) {
                    this._endPoint = value;
                },
                enumerable: true,
                configurable: true
            });


            ParticleBezierCurveState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
                var controlIndex = animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleBezierCurveNode.BEZIER_CONTROL_INDEX);
                var endIndex = animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleBezierCurveNode.BEZIER_END_INDEX);

                if (this._particleBezierCurveNode.mode == animators.ParticlePropertiesMode.LOCAL_STATIC) {
                    animationSubGeometry.activateVertexBuffer(controlIndex, this._particleBezierCurveNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
                    animationSubGeometry.activateVertexBuffer(endIndex, this._particleBezierCurveNode._iDataOffset + 3, stage, ContextGLVertexBufferFormat.FLOAT_3);
                } else {
                    animationRegisterCache.setVertexConst(controlIndex, this._controlPoint.x, this._controlPoint.y, this._controlPoint.z);
                    animationRegisterCache.setVertexConst(endIndex, this._endPoint.x, this._endPoint.y, this._endPoint.z);
                }
            };
            return ParticleBezierCurveState;
        })(animators.ParticleStateBase);
        animators.ParticleBezierCurveState = ParticleBezierCurveState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var Matrix3D = away.geom.Matrix3D;
        var Orientation3D = away.geom.Orientation3D;

        var MathConsts = away.geom.MathConsts;

        /**
        * ...
        */
        var ParticleBillboardState = (function (_super) {
            __extends(ParticleBillboardState, _super);
            /**
            *
            */
            function ParticleBillboardState(animator, particleNode) {
                _super.call(this, animator, particleNode);
                this._matrix = new Matrix3D;

                this._billboardAxis = particleNode._iBillboardAxis;
            }
            ParticleBillboardState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
                var comps;
                if (this._billboardAxis) {
                    var pos = renderable.sourceEntity.sceneTransform.position;
                    var look = camera.sceneTransform.position.subtract(pos);
                    var right = look.crossProduct(this._billboardAxis);
                    right.normalize();
                    look = this.billboardAxis.crossProduct(right);
                    look.normalize();

                    //create a quick inverse projection matrix
                    this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
                    comps = this._matrix.decompose(Orientation3D.AXIS_ANGLE);
                    this._matrix.copyColumnFrom(0, right);
                    this._matrix.copyColumnFrom(1, this.billboardAxis);
                    this._matrix.copyColumnFrom(2, look);
                    this._matrix.copyColumnFrom(3, pos);
                    this._matrix.appendRotation(-comps[1].w * MathConsts.RADIANS_TO_DEGREES, comps[1]);
                } else {
                    //create a quick inverse projection matrix
                    this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
                    this._matrix.append(camera.inverseSceneTransform);

                    //decompose using axis angle rotations
                    comps = this._matrix.decompose(Orientation3D.AXIS_ANGLE);

                    //recreate the matrix with just the rotation data
                    this._matrix.identity();
                    this._matrix.appendRotation(-comps[1].w * MathConsts.RADIANS_TO_DEGREES, comps[1]);
                }

                //set a new matrix transform constant
                animationRegisterCache.setVertexConstFromMatrix(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleBillboardNode.MATRIX_INDEX), this._matrix);
            };

            Object.defineProperty(ParticleBillboardState.prototype, "billboardAxis", {
                /**
                * Defines the billboard axis.
                */
                get: function () {
                    return this.billboardAxis;
                },
                set: function (value) {
                    this.billboardAxis = value ? value.clone() : null;
                    if (this.billboardAxis)
                        this.billboardAxis.normalize();
                },
                enumerable: true,
                configurable: true
            });

            return ParticleBillboardState;
        })(animators.ParticleStateBase);
        animators.ParticleBillboardState = ParticleBillboardState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ContextGLVertexBufferFormat = away.stagegl.ContextGLVertexBufferFormat;

        var Vector3D = away.geom.Vector3D;

        /**
        * ...
        * @author ...
        */
        var ParticleColorState = (function (_super) {
            __extends(ParticleColorState, _super);
            function ParticleColorState(animator, particleColorNode) {
                _super.call(this, animator, particleColorNode);

                this._particleColorNode = particleColorNode;
                this._usesMultiplier = this._particleColorNode._iUsesMultiplier;
                this._usesOffset = this._particleColorNode._iUsesOffset;
                this._usesCycle = this._particleColorNode._iUsesCycle;
                this._usesPhase = this._particleColorNode._iUsesPhase;
                this._startColor = this._particleColorNode._iStartColor;
                this._endColor = this._particleColorNode._iEndColor;
                this._cycleDuration = this._particleColorNode._iCycleDuration;
                this._cyclePhase = this._particleColorNode._iCyclePhase;

                this.updateColorData();
            }
            Object.defineProperty(ParticleColorState.prototype, "startColor", {
                /**
                * Defines the start color transform of the state, when in global mode.
                */
                get: function () {
                    return this._startColor;
                },
                set: function (value) {
                    this._startColor = value;

                    this.updateColorData();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ParticleColorState.prototype, "endColor", {
                /**
                * Defines the end color transform of the state, when in global mode.
                */
                get: function () {
                    return this._endColor;
                },
                set: function (value) {
                    this._endColor = value;

                    this.updateColorData();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ParticleColorState.prototype, "cycleDuration", {
                /**
                * Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
                */
                get: function () {
                    return this._cycleDuration;
                },
                set: function (value) {
                    this._cycleDuration = value;

                    this.updateColorData();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ParticleColorState.prototype, "cyclePhase", {
                /**
                * Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
                */
                get: function () {
                    return this._cyclePhase;
                },
                set: function (value) {
                    this._cyclePhase = value;

                    this.updateColorData();
                },
                enumerable: true,
                configurable: true
            });


            ParticleColorState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
                if (animationRegisterCache.needFragmentAnimation) {
                    var dataOffset = this._particleColorNode._iDataOffset;
                    if (this._usesCycle)
                        animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleColorNode.CYCLE_INDEX), this._cycleData.x, this._cycleData.y, this._cycleData.z, this._cycleData.w);

                    if (this._usesMultiplier) {
                        if (this._particleColorNode.mode == animators.ParticlePropertiesMode.LOCAL_STATIC) {
                            animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleColorNode.START_MULTIPLIER_INDEX), dataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
                            dataOffset += 4;
                            animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleColorNode.DELTA_MULTIPLIER_INDEX), dataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
                            dataOffset += 4;
                        } else {
                            animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleColorNode.START_MULTIPLIER_INDEX), this._startMultiplierData.x, this._startMultiplierData.y, this._startMultiplierData.z, this._startMultiplierData.w);
                            animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleColorNode.DELTA_MULTIPLIER_INDEX), this._deltaMultiplierData.x, this._deltaMultiplierData.y, this._deltaMultiplierData.z, this._deltaMultiplierData.w);
                        }
                    }
                    if (this._usesOffset) {
                        if (this._particleColorNode.mode == animators.ParticlePropertiesMode.LOCAL_STATIC) {
                            animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleColorNode.START_OFFSET_INDEX), dataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
                            dataOffset += 4;
                            animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleColorNode.DELTA_OFFSET_INDEX), dataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
                            dataOffset += 4;
                        } else {
                            animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleColorNode.START_OFFSET_INDEX), this._startOffsetData.x, this._startOffsetData.y, this._startOffsetData.z, this._startOffsetData.w);
                            animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleColorNode.DELTA_OFFSET_INDEX), this._deltaOffsetData.x, this._deltaOffsetData.y, this._deltaOffsetData.z, this._deltaOffsetData.w);
                        }
                    }
                }
            };

            ParticleColorState.prototype.updateColorData = function () {
                if (this._usesCycle) {
                    if (this._cycleDuration <= 0)
                        throw (new Error("the cycle duration must be greater than zero"));
                    this._cycleData = new Vector3D(Math.PI * 2 / this._cycleDuration, this._cyclePhase * Math.PI / 180, 0, 0);
                }
                if (this._particleColorNode.mode == animators.ParticlePropertiesMode.GLOBAL) {
                    if (this._usesCycle) {
                        if (this._usesMultiplier) {
                            this._startMultiplierData = new Vector3D((this._startColor.redMultiplier + this._endColor.redMultiplier) / 2, (this._startColor.greenMultiplier + this._endColor.greenMultiplier) / 2, (this._startColor.blueMultiplier + this._endColor.blueMultiplier) / 2, (this._startColor.alphaMultiplier + this._endColor.alphaMultiplier) / 2);
                            this._deltaMultiplierData = new Vector3D((this._endColor.redMultiplier - this._startColor.redMultiplier) / 2, (this._endColor.greenMultiplier - this._startColor.greenMultiplier) / 2, (this._endColor.blueMultiplier - this._startColor.blueMultiplier) / 2, (this._endColor.alphaMultiplier - this._startColor.alphaMultiplier) / 2);
                        }

                        if (this._usesOffset) {
                            this._startOffsetData = new Vector3D((this._startColor.redOffset + this._endColor.redOffset) / (255 * 2), (this._startColor.greenOffset + this._endColor.greenOffset) / (255 * 2), (this._startColor.blueOffset + this._endColor.blueOffset) / (255 * 2), (this._startColor.alphaOffset + this._endColor.alphaOffset) / (255 * 2));
                            this._deltaOffsetData = new Vector3D((this._endColor.redOffset - this._startColor.redOffset) / (255 * 2), (this._endColor.greenOffset - this._startColor.greenOffset) / (255 * 2), (this._endColor.blueOffset - this._startColor.blueOffset) / (255 * 2), (this._endColor.alphaOffset - this._startColor.alphaOffset) / (255 * 2));
                        }
                    } else {
                        if (this._usesMultiplier) {
                            this._startMultiplierData = new Vector3D(this._startColor.redMultiplier, this._startColor.greenMultiplier, this._startColor.blueMultiplier, this._startColor.alphaMultiplier);
                            this._deltaMultiplierData = new Vector3D((this._endColor.redMultiplier - this._startColor.redMultiplier), (this._endColor.greenMultiplier - this._startColor.greenMultiplier), (this._endColor.blueMultiplier - this._startColor.blueMultiplier), (this._endColor.alphaMultiplier - this._startColor.alphaMultiplier));
                        }

                        if (this._usesOffset) {
                            this._startOffsetData = new Vector3D(this._startColor.redOffset / 255, this._startColor.greenOffset / 255, this._startColor.blueOffset / 255, this._startColor.alphaOffset / 255);
                            this._deltaOffsetData = new Vector3D((this._endColor.redOffset - this._startColor.redOffset) / 255, (this._endColor.greenOffset - this._startColor.greenOffset) / 255, (this._endColor.blueOffset - this._startColor.blueOffset) / 255, (this._endColor.alphaOffset - this._startColor.alphaOffset) / 255);
                        }
                    }
                }
            };
            return ParticleColorState;
        })(animators.ParticleStateBase);
        animators.ParticleColorState = ParticleColorState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ContextGLVertexBufferFormat = away.stagegl.ContextGLVertexBufferFormat;
        var Vector3D = away.geom.Vector3D;

        var MathConsts = away.geom.MathConsts;

        /**
        * ...
        */
        var ParticleFollowState = (function (_super) {
            __extends(ParticleFollowState, _super);
            function ParticleFollowState(animator, particleFollowNode) {
                _super.call(this, animator, particleFollowNode, true);
                this._targetPos = new Vector3D();
                this._targetEuler = new Vector3D();
                //temporary vector3D for calculation
                this._temp = new Vector3D();

                this._particleFollowNode = particleFollowNode;
                this._smooth = particleFollowNode._iSmooth;
            }
            Object.defineProperty(ParticleFollowState.prototype, "followTarget", {
                get: function () {
                    return this._followTarget;
                },
                set: function (value) {
                    this._followTarget = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ParticleFollowState.prototype, "smooth", {
                get: function () {
                    return this._smooth;
                },
                set: function (value) {
                    this._smooth = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            ParticleFollowState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
                if (this._followTarget) {
                    if (this._particleFollowNode._iUsesPosition) {
                        this._targetPos.x = this._followTarget.transform.position.x / renderable.sourceEntity.scaleX;
                        this._targetPos.y = this._followTarget.transform.position.y / renderable.sourceEntity.scaleY;
                        this._targetPos.z = this._followTarget.transform.position.z / renderable.sourceEntity.scaleZ;
                    }
                    if (this._particleFollowNode._iUsesRotation) {
                        this._targetEuler.x = this._followTarget.rotationX;
                        this._targetEuler.y = this._followTarget.rotationY;
                        this._targetEuler.z = this._followTarget.rotationZ;
                        this._targetEuler.scaleBy(MathConsts.DEGREES_TO_RADIANS);
                    }
                }

                //initialization
                if (!this._prePos)
                    this._prePos = this._targetPos.clone();
                if (!this._preEuler)
                    this._preEuler = this._targetEuler.clone();

                var currentTime = this._pTime / 1000;
                var previousTime = animationSubGeometry.previousTime;
                var deltaTime = currentTime - previousTime;

                var needProcess = previousTime != currentTime;

                if (this._particleFollowNode._iUsesPosition && this._particleFollowNode._iUsesRotation) {
                    if (needProcess)
                        this.processPositionAndRotation(currentTime, deltaTime, animationSubGeometry);

                    animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleFollowNode.FOLLOW_POSITION_INDEX), this._particleFollowNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
                    animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleFollowNode.FOLLOW_ROTATION_INDEX), this._particleFollowNode._iDataOffset + 3, stage, ContextGLVertexBufferFormat.FLOAT_3);
                } else if (this._particleFollowNode._iUsesPosition) {
                    if (needProcess)
                        this.processPosition(currentTime, deltaTime, animationSubGeometry);

                    animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleFollowNode.FOLLOW_POSITION_INDEX), this._particleFollowNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
                } else if (this._particleFollowNode._iUsesRotation) {
                    if (needProcess)
                        this.precessRotation(currentTime, deltaTime, animationSubGeometry);

                    animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleFollowNode.FOLLOW_ROTATION_INDEX), this._particleFollowNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
                }

                this._prePos.copyFrom(this._targetPos);
                this._targetEuler.copyFrom(this._targetEuler);
                animationSubGeometry.previousTime = currentTime;
            };

            ParticleFollowState.prototype.processPosition = function (currentTime, deltaTime, animationSubGeometry) {
                var data = animationSubGeometry.animationParticles;
                var vertexData = animationSubGeometry.vertexData;

                var changed = false;
                var len = data.length;
                var interpolatedPos;
                var posVelocity;
                if (this._smooth) {
                    posVelocity = this._prePos.subtract(this._targetPos);
                    posVelocity.scaleBy(1 / deltaTime);
                } else
                    interpolatedPos = this._targetPos;
                for (var i = 0; i < len; i++) {
                    var k = (currentTime - data[i].startTime) / data[i].totalTime;
                    var t = (k - Math.floor(k)) * data[i].totalTime;
                    if (t - deltaTime <= 0) {
                        var inc = data[i].startVertexIndex * animationSubGeometry.totalLenOfOneVertex + this._particleFollowNode._iDataOffset;

                        if (this._smooth) {
                            this._temp.copyFrom(posVelocity);
                            this._temp.scaleBy(t);
                            interpolatedPos = this._targetPos.add(this._temp);
                        }

                        if (vertexData[inc] != interpolatedPos.x || vertexData[inc + 1] != interpolatedPos.y || vertexData[inc + 2] != interpolatedPos.z) {
                            changed = true;
                            for (var j = 0; j < data[i].numVertices; j++) {
                                vertexData[inc++] = interpolatedPos.x;
                                vertexData[inc++] = interpolatedPos.y;
                                vertexData[inc++] = interpolatedPos.z;
                            }
                        }
                    }
                }
                if (changed)
                    animationSubGeometry.invalidateBuffer();
            };

            ParticleFollowState.prototype.precessRotation = function (currentTime, deltaTime, animationSubGeometry) {
                var data = animationSubGeometry.animationParticles;
                var vertexData = animationSubGeometry.vertexData;

                var changed = false;
                var len = data.length;

                var interpolatedRotation;
                var rotationVelocity;

                if (this._smooth) {
                    rotationVelocity = this._preEuler.subtract(this._targetEuler);
                    rotationVelocity.scaleBy(1 / deltaTime);
                } else
                    interpolatedRotation = this._targetEuler;

                for (var i = 0; i < len; i++) {
                    var k = (currentTime - data[i].startTime) / data[i].totalTime;
                    var t = (k - Math.floor(k)) * data[i].totalTime;
                    if (t - deltaTime <= 0) {
                        var inc = data[i].startVertexIndex * animationSubGeometry.totalLenOfOneVertex + this._particleFollowNode._iDataOffset;

                        if (this._smooth) {
                            this._temp.copyFrom(rotationVelocity);
                            this._temp.scaleBy(t);
                            interpolatedRotation = this._targetEuler.add(this._temp);
                        }

                        if (vertexData[inc] != interpolatedRotation.x || vertexData[inc + 1] != interpolatedRotation.y || vertexData[inc + 2] != interpolatedRotation.z) {
                            changed = true;
                            for (var j = 0; j < data[i].numVertices; j++) {
                                vertexData[inc++] = interpolatedRotation.x;
                                vertexData[inc++] = interpolatedRotation.y;
                                vertexData[inc++] = interpolatedRotation.z;
                            }
                        }
                    }
                }
                if (changed)
                    animationSubGeometry.invalidateBuffer();
            };

            ParticleFollowState.prototype.processPositionAndRotation = function (currentTime, deltaTime, animationSubGeometry) {
                var data = animationSubGeometry.animationParticles;
                var vertexData = animationSubGeometry.vertexData;

                var changed = false;
                var len = data.length;

                var interpolatedPos;
                var interpolatedRotation;

                var posVelocity;
                var rotationVelocity;
                if (this._smooth) {
                    posVelocity = this._prePos.subtract(this._targetPos);
                    posVelocity.scaleBy(1 / deltaTime);
                    rotationVelocity = this._preEuler.subtract(this._targetEuler);
                    rotationVelocity.scaleBy(1 / deltaTime);
                } else {
                    interpolatedPos = this._targetPos;
                    interpolatedRotation = this._targetEuler;
                }

                for (var i = 0; i < len; i++) {
                    var k = (currentTime - data[i].startTime) / data[i].totalTime;
                    var t = (k - Math.floor(k)) * data[i].totalTime;
                    if (t - deltaTime <= 0) {
                        var inc = data[i].startVertexIndex * animationSubGeometry.totalLenOfOneVertex + this._particleFollowNode._iDataOffset;
                        if (this._smooth) {
                            this._temp.copyFrom(posVelocity);
                            this._temp.scaleBy(t);
                            interpolatedPos = this._targetPos.add(this._temp);

                            this._temp.copyFrom(rotationVelocity);
                            this._temp.scaleBy(t);
                            interpolatedRotation = this._targetEuler.add(this._temp);
                        }

                        if (vertexData[inc] != interpolatedPos.x || vertexData[inc + 1] != interpolatedPos.y || vertexData[inc + 2] != interpolatedPos.z || vertexData[inc + 3] != interpolatedRotation.x || vertexData[inc + 4] != interpolatedRotation.y || vertexData[inc + 5] != interpolatedRotation.z) {
                            changed = true;
                            for (var j = 0; j < data[i].numVertices; j++) {
                                vertexData[inc++] = interpolatedPos.x;
                                vertexData[inc++] = interpolatedPos.y;
                                vertexData[inc++] = interpolatedPos.z;
                                vertexData[inc++] = interpolatedRotation.x;
                                vertexData[inc++] = interpolatedRotation.y;
                                vertexData[inc++] = interpolatedRotation.z;
                            }
                        }
                    }
                }
                if (changed)
                    animationSubGeometry.invalidateBuffer();
            };
            return ParticleFollowState;
        })(animators.ParticleStateBase);
        animators.ParticleFollowState = ParticleFollowState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ContextGLVertexBufferFormat = away.stagegl.ContextGLVertexBufferFormat;

        var Vector3D = away.geom.Vector3D;

        var ParticleInitialColorState = (function (_super) {
            __extends(ParticleInitialColorState, _super);
            function ParticleInitialColorState(animator, particleInitialColorNode) {
                _super.call(this, animator, particleInitialColorNode);

                this._particleInitialColorNode = particleInitialColorNode;
                this._usesMultiplier = particleInitialColorNode._iUsesMultiplier;
                this._usesOffset = particleInitialColorNode._iUsesOffset;
                this._initialColor = particleInitialColorNode._iInitialColor;

                this.updateColorData();
            }
            Object.defineProperty(ParticleInitialColorState.prototype, "initialColor", {
                /**
                * Defines the initial color transform of the state, when in global mode.
                */
                get: function () {
                    return this._initialColor;
                },
                set: function (value) {
                    this._initialColor = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            ParticleInitialColorState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
                // TODO: not used
                renderable = renderable;
                camera = camera;

                if (animationRegisterCache.needFragmentAnimation) {
                    if (this._particleInitialColorNode.mode == animators.ParticlePropertiesMode.LOCAL_STATIC) {
                        var dataOffset = this._particleInitialColorNode._iDataOffset;
                        if (this._usesMultiplier) {
                            animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleInitialColorNode.MULTIPLIER_INDEX), dataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
                            dataOffset += 4;
                        }
                        if (this._usesOffset)
                            animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleInitialColorNode.OFFSET_INDEX), dataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
                    } else {
                        if (this._usesMultiplier)
                            animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleInitialColorNode.MULTIPLIER_INDEX), this._multiplierData.x, this._multiplierData.y, this._multiplierData.z, this._multiplierData.w);
                        if (this._usesOffset)
                            animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleInitialColorNode.OFFSET_INDEX), this._offsetData.x, this._offsetData.y, this._offsetData.z, this._offsetData.w);
                    }
                }
            };

            ParticleInitialColorState.prototype.updateColorData = function () {
                if (this._particleInitialColorNode.mode == animators.ParticlePropertiesMode.GLOBAL) {
                    if (this._usesMultiplier)
                        this._multiplierData = new Vector3D(this._initialColor.redMultiplier, this._initialColor.greenMultiplier, this._initialColor.blueMultiplier, this._initialColor.alphaMultiplier);
                    if (this._usesOffset)
                        this._offsetData = new Vector3D(this._initialColor.redOffset / 255, this._initialColor.greenOffset / 255, this._initialColor.blueOffset / 255, this._initialColor.alphaOffset / 255);
                }
            };
            return ParticleInitialColorState;
        })(animators.ParticleStateBase);
        animators.ParticleInitialColorState = ParticleInitialColorState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ContextGLVertexBufferFormat = away.stagegl.ContextGLVertexBufferFormat;
        var Matrix3D = away.geom.Matrix3D;
        var Vector3D = away.geom.Vector3D;

        /**
        * ...
        */
        var ParticleOrbitState = (function (_super) {
            __extends(ParticleOrbitState, _super);
            function ParticleOrbitState(animator, particleOrbitNode) {
                _super.call(this, animator, particleOrbitNode);

                this._particleOrbitNode = particleOrbitNode;
                this._usesEulers = this._particleOrbitNode._iUsesEulers;
                this._usesCycle = this._particleOrbitNode._iUsesCycle;
                this._usesPhase = this._particleOrbitNode._iUsesPhase;
                this._eulers = this._particleOrbitNode._iEulers;
                this._radius = this._particleOrbitNode._iRadius;
                this._cycleDuration = this._particleOrbitNode._iCycleDuration;
                this._cyclePhase = this._particleOrbitNode._iCyclePhase;
                this.updateOrbitData();
            }
            Object.defineProperty(ParticleOrbitState.prototype, "radius", {
                /**
                * Defines the radius of the orbit when in global mode. Defaults to 100.
                */
                get: function () {
                    return this._radius;
                },
                set: function (value) {
                    this._radius = value;

                    this.updateOrbitData();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ParticleOrbitState.prototype, "cycleDuration", {
                /**
                * Defines the duration of the orbit in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
                */
                get: function () {
                    return this._cycleDuration;
                },
                set: function (value) {
                    this._cycleDuration = value;

                    this.updateOrbitData();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ParticleOrbitState.prototype, "cyclePhase", {
                /**
                * Defines the phase of the orbit in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
                */
                get: function () {
                    return this._cyclePhase;
                },
                set: function (value) {
                    this._cyclePhase = value;

                    this.updateOrbitData();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ParticleOrbitState.prototype, "eulers", {
                /**
                * Defines the euler rotation in degrees, applied to the orientation of the orbit when in global mode.
                */
                get: function () {
                    return this._eulers;
                },
                set: function (value) {
                    this._eulers = value;

                    this.updateOrbitData();
                },
                enumerable: true,
                configurable: true
            });


            ParticleOrbitState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
                var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleOrbitNode.ORBIT_INDEX);

                if (this._particleOrbitNode.mode == animators.ParticlePropertiesMode.LOCAL_STATIC) {
                    if (this._usesPhase)
                        animationSubGeometry.activateVertexBuffer(index, this._particleOrbitNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
                    else
                        animationSubGeometry.activateVertexBuffer(index, this._particleOrbitNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
                } else
                    animationRegisterCache.setVertexConst(index, this._orbitData.x, this._orbitData.y, this._orbitData.z, this._orbitData.w);

                if (this._usesEulers)
                    animationRegisterCache.setVertexConstFromMatrix(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleOrbitNode.EULERS_INDEX), this._eulersMatrix);
            };

            ParticleOrbitState.prototype.updateOrbitData = function () {
                if (this._usesEulers) {
                    this._eulersMatrix = new Matrix3D();
                    this._eulersMatrix.appendRotation(this._eulers.x, Vector3D.X_AXIS);
                    this._eulersMatrix.appendRotation(this._eulers.y, Vector3D.Y_AXIS);
                    this._eulersMatrix.appendRotation(this._eulers.z, Vector3D.Z_AXIS);
                }
                if (this._particleOrbitNode.mode == animators.ParticlePropertiesMode.GLOBAL) {
                    this._orbitData = new Vector3D(this._radius, 0, this._radius * Math.PI * 2, this._cyclePhase * Math.PI / 180);
                    if (this._usesCycle) {
                        if (this._cycleDuration <= 0)
                            throw (new Error("the cycle duration must be greater than zero"));
                        this._orbitData.y = Math.PI * 2 / this._cycleDuration;
                    } else
                        this._orbitData.y = Math.PI * 2;
                }
            };
            return ParticleOrbitState;
        })(animators.ParticleStateBase);
        animators.ParticleOrbitState = ParticleOrbitState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ContextGLVertexBufferFormat = away.stagegl.ContextGLVertexBufferFormat;
        var Vector3D = away.geom.Vector3D;

        /**
        * ...
        */
        var ParticleOscillatorState = (function (_super) {
            __extends(ParticleOscillatorState, _super);
            function ParticleOscillatorState(animator, particleOscillatorNode) {
                _super.call(this, animator, particleOscillatorNode);

                this._particleOscillatorNode = particleOscillatorNode;
                this._oscillator = this._particleOscillatorNode._iOscillator;

                this.updateOscillatorData();
            }
            Object.defineProperty(ParticleOscillatorState.prototype, "oscillator", {
                /**
                * Defines the default oscillator axis (x, y, z) and cycleDuration (w) of the state, used when in global mode.
                */
                get: function () {
                    return this._oscillator;
                },
                set: function (value) {
                    this._oscillator = value;

                    this.updateOscillatorData();
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            ParticleOscillatorState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
                var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleOscillatorNode.OSCILLATOR_INDEX);

                if (this._particleOscillatorNode.mode == animators.ParticlePropertiesMode.LOCAL_STATIC)
                    animationSubGeometry.activateVertexBuffer(index, this._particleOscillatorNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
                else
                    animationRegisterCache.setVertexConst(index, this._oscillatorData.x, this._oscillatorData.y, this._oscillatorData.z, this._oscillatorData.w);
            };

            ParticleOscillatorState.prototype.updateOscillatorData = function () {
                if (this._particleOscillatorNode.mode == animators.ParticlePropertiesMode.GLOBAL) {
                    if (this._oscillator.w <= 0)
                        throw (new Error("the cycle duration must greater than zero"));

                    if (this._oscillatorData == null)
                        this._oscillatorData = new Vector3D();

                    this._oscillatorData.x = this._oscillator.x;
                    this._oscillatorData.y = this._oscillator.y;
                    this._oscillatorData.z = this._oscillator.z;
                    this._oscillatorData.w = Math.PI * 2 / this._oscillator.w;
                }
            };
            return ParticleOscillatorState;
        })(animators.ParticleStateBase);
        animators.ParticleOscillatorState = ParticleOscillatorState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ContextGLVertexBufferFormat = away.stagegl.ContextGLVertexBufferFormat;

        /**
        * ...
        * @author ...
        */
        var ParticlePositionState = (function (_super) {
            __extends(ParticlePositionState, _super);
            function ParticlePositionState(animator, particlePositionNode) {
                _super.call(this, animator, particlePositionNode);

                this._particlePositionNode = particlePositionNode;
                this._position = this._particlePositionNode._iPosition;
            }
            Object.defineProperty(ParticlePositionState.prototype, "position", {
                /**
                * Defines the position of the particle when in global mode. Defaults to 0,0,0.
                */
                get: function () {
                    return this._position;
                },
                set: function (value) {
                    this._position = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            *
            */
            ParticlePositionState.prototype.getPositions = function () {
                return this._pDynamicProperties;
            };

            ParticlePositionState.prototype.setPositions = function (value) {
                this._pDynamicProperties = value;

                this._pDynamicPropertiesDirty = new Object();
            };

            /**
            * @inheritDoc
            */
            ParticlePositionState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
                if (this._particlePositionNode.mode == animators.ParticlePropertiesMode.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationSubGeometry._iUniqueId])
                    this._pUpdateDynamicProperties(animationSubGeometry);

                var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticlePositionNode.POSITION_INDEX);

                if (this._particlePositionNode.mode == animators.ParticlePropertiesMode.GLOBAL)
                    animationRegisterCache.setVertexConst(index, this._position.x, this._position.y, this._position.z);
                else
                    animationSubGeometry.activateVertexBuffer(index, this._particlePositionNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
            };
            return ParticlePositionState;
        })(animators.ParticleStateBase);
        animators.ParticlePositionState = ParticlePositionState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var Matrix3D = away.geom.Matrix3D;

        /**
        * ...
        */
        var ParticleRotateToHeadingState = (function (_super) {
            __extends(ParticleRotateToHeadingState, _super);
            function ParticleRotateToHeadingState(animator, particleNode) {
                _super.call(this, animator, particleNode);
                this._matrix = new Matrix3D();
            }
            ParticleRotateToHeadingState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
                if (animationRegisterCache.hasBillboard) {
                    this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
                    this._matrix.append(camera.inverseSceneTransform);
                    animationRegisterCache.setVertexConstFromMatrix(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleRotateToHeadingNode.MATRIX_INDEX), this._matrix);
                }
            };
            return ParticleRotateToHeadingState;
        })(animators.ParticleStateBase);
        animators.ParticleRotateToHeadingState = ParticleRotateToHeadingState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ContextGLVertexBufferFormat = away.stagegl.ContextGLVertexBufferFormat;

        var Matrix3D = away.geom.Matrix3D;

        /**
        * ...
        */
        var ParticleRotateToPositionState = (function (_super) {
            __extends(ParticleRotateToPositionState, _super);
            function ParticleRotateToPositionState(animator, particleRotateToPositionNode) {
                _super.call(this, animator, particleRotateToPositionNode);
                this._matrix = new Matrix3D();

                this._particleRotateToPositionNode = particleRotateToPositionNode;
                this._position = this._particleRotateToPositionNode._iPosition;
            }
            Object.defineProperty(ParticleRotateToPositionState.prototype, "position", {
                /**
                * Defines the position of the point the particle will rotate to face when in global mode. Defaults to 0,0,0.
                */
                get: function () {
                    return this._position;
                },
                set: function (value) {
                    this._position = value;
                },
                enumerable: true,
                configurable: true
            });


            ParticleRotateToPositionState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
                var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleRotateToPositionNode.POSITION_INDEX);

                if (animationRegisterCache.hasBillboard) {
                    this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
                    this._matrix.append(camera.inverseSceneTransform);
                    animationRegisterCache.setVertexConstFromMatrix(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleRotateToPositionNode.MATRIX_INDEX), this._matrix);
                }

                if (this._particleRotateToPositionNode.mode == animators.ParticlePropertiesMode.GLOBAL) {
                    this._offset = renderable.sourceEntity.inverseSceneTransform.transformVector(this._position);
                    animationRegisterCache.setVertexConst(index, this._offset.x, this._offset.y, this._offset.z);
                } else
                    animationSubGeometry.activateVertexBuffer(index, this._particleRotateToPositionNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
            };
            return ParticleRotateToPositionState;
        })(animators.ParticleStateBase);
        animators.ParticleRotateToPositionState = ParticleRotateToPositionState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ContextGLVertexBufferFormat = away.stagegl.ContextGLVertexBufferFormat;
        var Vector3D = away.geom.Vector3D;

        /**
        * ...
        */
        var ParticleRotationalVelocityState = (function (_super) {
            __extends(ParticleRotationalVelocityState, _super);
            function ParticleRotationalVelocityState(animator, particleRotationNode) {
                _super.call(this, animator, particleRotationNode);

                this._particleRotationalVelocityNode = particleRotationNode;
                this._rotationalVelocity = this._particleRotationalVelocityNode._iRotationalVelocity;

                this.updateRotationalVelocityData();
            }
            Object.defineProperty(ParticleRotationalVelocityState.prototype, "rotationalVelocity", {
                /**
                * Defines the default rotationalVelocity of the state, used when in global mode.
                */
                get: function () {
                    return this._rotationalVelocity;
                },
                set: function (value) {
                    this._rotationalVelocity = value;

                    this.updateRotationalVelocityData();
                },
                enumerable: true,
                configurable: true
            });


            /**
            *
            */
            ParticleRotationalVelocityState.prototype.getRotationalVelocities = function () {
                return this._pDynamicProperties;
            };

            ParticleRotationalVelocityState.prototype.setRotationalVelocities = function (value) {
                this._pDynamicProperties = value;

                this._pDynamicPropertiesDirty = new Object();
            };

            /**
            * @inheritDoc
            */
            ParticleRotationalVelocityState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
                if (this._particleRotationalVelocityNode.mode == animators.ParticlePropertiesMode.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationSubGeometry._iUniqueId])
                    this._pUpdateDynamicProperties(animationSubGeometry);

                var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleRotationalVelocityNode.ROTATIONALVELOCITY_INDEX);

                if (this._particleRotationalVelocityNode.mode == animators.ParticlePropertiesMode.GLOBAL)
                    animationRegisterCache.setVertexConst(index, this._rotationalVelocityData.x, this._rotationalVelocityData.y, this._rotationalVelocityData.z, this._rotationalVelocityData.w);
                else
                    animationSubGeometry.activateVertexBuffer(index, this._particleRotationalVelocityNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
            };

            ParticleRotationalVelocityState.prototype.updateRotationalVelocityData = function () {
                if (this._particleRotationalVelocityNode.mode == animators.ParticlePropertiesMode.GLOBAL) {
                    if (this._rotationalVelocity.w <= 0)
                        throw (new Error("the cycle duration must greater than zero"));
                    var rotation = this._rotationalVelocity.clone();

                    if (rotation.length <= 0)
                        rotation.z = 1; //set the default direction
                    else
                        rotation.normalize();

                    // w is used as angle/2 in agal
                    this._rotationalVelocityData = new Vector3D(rotation.x, rotation.y, rotation.z, Math.PI / rotation.w);
                }
            };
            return ParticleRotationalVelocityState;
        })(animators.ParticleStateBase);
        animators.ParticleRotationalVelocityState = ParticleRotationalVelocityState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ContextGLVertexBufferFormat = away.stagegl.ContextGLVertexBufferFormat;
        var Vector3D = away.geom.Vector3D;

        /**
        * ...
        */
        var ParticleScaleState = (function (_super) {
            __extends(ParticleScaleState, _super);
            function ParticleScaleState(animator, particleScaleNode) {
                _super.call(this, animator, particleScaleNode);

                this._particleScaleNode = particleScaleNode;
                this._usesCycle = this._particleScaleNode._iUsesCycle;
                this._usesPhase = this._particleScaleNode._iUsesPhase;
                this._minScale = this._particleScaleNode._iMinScale;
                this._maxScale = this._particleScaleNode._iMaxScale;
                this._cycleDuration = this._particleScaleNode._iCycleDuration;
                this._cyclePhase = this._particleScaleNode._iCyclePhase;

                this.updateScaleData();
            }
            Object.defineProperty(ParticleScaleState.prototype, "minScale", {
                /**
                * Defines the end scale of the state, when in global mode. Defaults to 1.
                */
                get: function () {
                    return this._minScale;
                },
                set: function (value) {
                    this._minScale = value;

                    this.updateScaleData();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ParticleScaleState.prototype, "maxScale", {
                /**
                * Defines the end scale of the state, when in global mode. Defaults to 1.
                */
                get: function () {
                    return this._maxScale;
                },
                set: function (value) {
                    this._maxScale = value;

                    this.updateScaleData();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ParticleScaleState.prototype, "cycleDuration", {
                /**
                * Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
                */
                get: function () {
                    return this._cycleDuration;
                },
                set: function (value) {
                    this._cycleDuration = value;

                    this.updateScaleData();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ParticleScaleState.prototype, "cyclePhase", {
                /**
                * Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
                */
                get: function () {
                    return this._cyclePhase;
                },
                set: function (value) {
                    this._cyclePhase = value;

                    this.updateScaleData();
                },
                enumerable: true,
                configurable: true
            });


            ParticleScaleState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
                var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleScaleNode.SCALE_INDEX);

                if (this._particleScaleNode.mode == animators.ParticlePropertiesMode.LOCAL_STATIC) {
                    if (this._usesCycle) {
                        if (this._usesPhase)
                            animationSubGeometry.activateVertexBuffer(index, this._particleScaleNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);
                        else
                            animationSubGeometry.activateVertexBuffer(index, this._particleScaleNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
                    } else
                        animationSubGeometry.activateVertexBuffer(index, this._particleScaleNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_2);
                } else
                    animationRegisterCache.setVertexConst(index, this._scaleData.x, this._scaleData.y, this._scaleData.z, this._scaleData.w);
            };

            ParticleScaleState.prototype.updateScaleData = function () {
                if (this._particleScaleNode.mode == animators.ParticlePropertiesMode.GLOBAL) {
                    if (this._usesCycle) {
                        if (this._cycleDuration <= 0)
                            throw (new Error("the cycle duration must be greater than zero"));
                        this._scaleData = new Vector3D((this._minScale + this._maxScale) / 2, Math.abs(this._minScale - this._maxScale) / 2, Math.PI * 2 / this._cycleDuration, this._cyclePhase * Math.PI / 180);
                    } else
                        this._scaleData = new Vector3D(this._minScale, this._maxScale - this._minScale, 0, 0);
                }
            };
            return ParticleScaleState;
        })(animators.ParticleStateBase);
        animators.ParticleScaleState = ParticleScaleState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ParticleSegmentedColorState = (function (_super) {
            __extends(ParticleSegmentedColorState, _super);
            function ParticleSegmentedColorState(animator, particleSegmentedColorNode) {
                _super.call(this, animator, particleSegmentedColorNode);

                this._usesMultiplier = particleSegmentedColorNode._iUsesMultiplier;
                this._usesOffset = particleSegmentedColorNode._iUsesOffset;
                this._startColor = particleSegmentedColorNode._iStartColor;
                this._endColor = particleSegmentedColorNode._iEndColor;
                this._segmentPoints = particleSegmentedColorNode._iSegmentPoints;
                this._numSegmentPoint = particleSegmentedColorNode._iNumSegmentPoint;
                this.updateColorData();
            }
            Object.defineProperty(ParticleSegmentedColorState.prototype, "startColor", {
                /**
                * Defines the start color transform of the state, when in global mode.
                */
                get: function () {
                    return this._startColor;
                },
                set: function (value) {
                    this._startColor = value;

                    this.updateColorData();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ParticleSegmentedColorState.prototype, "endColor", {
                /**
                * Defines the end color transform of the state, when in global mode.
                */
                get: function () {
                    return this._endColor;
                },
                set: function (value) {
                    this._endColor = value;
                    this.updateColorData();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ParticleSegmentedColorState.prototype, "numSegmentPoint", {
                /**
                * Defines the number of segments.
                */
                get: function () {
                    return this._numSegmentPoint;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ParticleSegmentedColorState.prototype, "segmentPoints", {
                /**
                * Defines the key points of color
                */
                get: function () {
                    return this._segmentPoints;
                },
                set: function (value) {
                    this._segmentPoints = value;
                    this.updateColorData();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ParticleSegmentedColorState.prototype, "usesMultiplier", {
                get: function () {
                    return this._usesMultiplier;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ParticleSegmentedColorState.prototype, "usesOffset", {
                get: function () {
                    return this._usesOffset;
                },
                enumerable: true,
                configurable: true
            });

            ParticleSegmentedColorState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
                if (animationRegisterCache.needFragmentAnimation) {
                    if (this._numSegmentPoint > 0)
                        animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleSegmentedColorNode.TIME_DATA_INDEX), this._timeLifeData[0], this._timeLifeData[1], this._timeLifeData[2], this._timeLifeData[3]);
                    if (this._usesMultiplier)
                        animationRegisterCache.setVertexConstFromArray(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleSegmentedColorNode.START_MULTIPLIER_INDEX), this._multiplierData);
                    if (this._usesOffset)
                        animationRegisterCache.setVertexConstFromArray(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleSegmentedColorNode.START_OFFSET_INDEX), this._offsetData);
                }
            };

            ParticleSegmentedColorState.prototype.updateColorData = function () {
                this._timeLifeData = new Array();
                this._multiplierData = new Array();
                this._offsetData = new Array();
                var i;
                for (i = 0; i < this._numSegmentPoint; i++) {
                    if (i == 0)
                        this._timeLifeData.push(this._segmentPoints[i].life);
                    else
                        this._timeLifeData.push(this._segmentPoints[i].life - this._segmentPoints[i - 1].life);
                }
                if (this._numSegmentPoint == 0)
                    this._timeLifeData.push(1);
                else
                    this._timeLifeData.push(1 - this._segmentPoints[i - 1].life);

                if (this._usesMultiplier) {
                    this._multiplierData.push(this._startColor.redMultiplier, this._startColor.greenMultiplier, this._startColor.blueMultiplier, this._startColor.alphaMultiplier);
                    for (i = 0; i < this._numSegmentPoint; i++) {
                        if (i == 0)
                            this._multiplierData.push((this._segmentPoints[i].color.redMultiplier - this._startColor.redMultiplier) / this._timeLifeData[i], (this._segmentPoints[i].color.greenMultiplier - this._startColor.greenMultiplier) / this._timeLifeData[i], (this._segmentPoints[i].color.blueMultiplier - this._startColor.blueMultiplier) / this._timeLifeData[i], (this._segmentPoints[i].color.alphaMultiplier - this._startColor.alphaMultiplier) / this._timeLifeData[i]);
                        else
                            this._multiplierData.push((this._segmentPoints[i].color.redMultiplier - this._segmentPoints[i - 1].color.redMultiplier) / this._timeLifeData[i], (this._segmentPoints[i].color.greenMultiplier - this._segmentPoints[i - 1].color.greenMultiplier) / this._timeLifeData[i], (this._segmentPoints[i].color.blueMultiplier - this._segmentPoints[i - 1].color.blueMultiplier) / this._timeLifeData[i], (this._segmentPoints[i].color.alphaMultiplier - this._segmentPoints[i - 1].color.alphaMultiplier) / this._timeLifeData[i]);
                    }
                    if (this._numSegmentPoint == 0)
                        this._multiplierData.push(this._endColor.redMultiplier - this._startColor.redMultiplier, this._endColor.greenMultiplier - this._startColor.greenMultiplier, this._endColor.blueMultiplier - this._startColor.blueMultiplier, this._endColor.alphaMultiplier - this._startColor.alphaMultiplier);
                    else
                        this._multiplierData.push((this._endColor.redMultiplier - this._segmentPoints[i - 1].color.redMultiplier) / this._timeLifeData[i], (this._endColor.greenMultiplier - this._segmentPoints[i - 1].color.greenMultiplier) / this._timeLifeData[i], (this._endColor.blueMultiplier - this._segmentPoints[i - 1].color.blueMultiplier) / this._timeLifeData[i], (this._endColor.alphaMultiplier - this._segmentPoints[i - 1].color.alphaMultiplier) / this._timeLifeData[i]);
                }

                if (this._usesOffset) {
                    this._offsetData.push(this._startColor.redOffset / 255, this._startColor.greenOffset / 255, this._startColor.blueOffset / 255, this._startColor.alphaOffset / 255);
                    for (i = 0; i < this._numSegmentPoint; i++) {
                        if (i == 0)
                            this._offsetData.push((this._segmentPoints[i].color.redOffset - this._startColor.redOffset) / this._timeLifeData[i] / 255, (this._segmentPoints[i].color.greenOffset - this._startColor.greenOffset) / this._timeLifeData[i] / 255, (this._segmentPoints[i].color.blueOffset - this._startColor.blueOffset) / this._timeLifeData[i] / 255, (this._segmentPoints[i].color.alphaOffset - this._startColor.alphaOffset) / this._timeLifeData[i] / 255);
                        else
                            this._offsetData.push((this._segmentPoints[i].color.redOffset - this._segmentPoints[i - 1].color.redOffset) / this._timeLifeData[i] / 255, (this._segmentPoints[i].color.greenOffset - this._segmentPoints[i - 1].color.greenOffset) / this._timeLifeData[i] / 255, (this._segmentPoints[i].color.blueOffset - this._segmentPoints[i - 1].color.blueOffset) / this._timeLifeData[i] / 255, (this._segmentPoints[i].color.alphaOffset - this._segmentPoints[i - 1].color.alphaOffset) / this._timeLifeData[i] / 255);
                    }
                    if (this._numSegmentPoint == 0)
                        this._offsetData.push((this._endColor.redOffset - this._startColor.redOffset) / 255, (this._endColor.greenOffset - this._startColor.greenOffset) / 255, (this._endColor.blueOffset - this._startColor.blueOffset) / 255, (this._endColor.alphaOffset - this._startColor.alphaOffset) / 255);
                    else
                        this._offsetData.push((this._endColor.redOffset - this._segmentPoints[i - 1].color.redOffset) / this._timeLifeData[i] / 255, (this._endColor.greenOffset - this._segmentPoints[i - 1].color.greenOffset) / this._timeLifeData[i] / 255, (this._endColor.blueOffset - this._segmentPoints[i - 1].color.blueOffset) / this._timeLifeData[i] / 255, (this._endColor.alphaOffset - this._segmentPoints[i - 1].color.alphaOffset) / this._timeLifeData[i] / 255);
                }

                //cut off the data
                this._timeLifeData.length = 4;
            };
            return ParticleSegmentedColorState;
        })(animators.ParticleStateBase);
        animators.ParticleSegmentedColorState = ParticleSegmentedColorState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ContextGLVertexBufferFormat = away.stagegl.ContextGLVertexBufferFormat;

        /**
        * ...
        */
        var ParticleSpriteSheetState = (function (_super) {
            __extends(ParticleSpriteSheetState, _super);
            function ParticleSpriteSheetState(animator, particleSpriteSheetNode) {
                _super.call(this, animator, particleSpriteSheetNode);

                this._particleSpriteSheetNode = particleSpriteSheetNode;

                this._usesCycle = this._particleSpriteSheetNode._iUsesCycle;
                this._usesPhase = this._particleSpriteSheetNode._iUsesCycle;
                this._totalFrames = this._particleSpriteSheetNode._iTotalFrames;
                this._numColumns = this._particleSpriteSheetNode._iNumColumns;
                this._numRows = this._particleSpriteSheetNode._iNumRows;
                this._cycleDuration = this._particleSpriteSheetNode._iCycleDuration;
                this._cyclePhase = this._particleSpriteSheetNode._iCyclePhase;

                this.updateSpriteSheetData();
            }
            Object.defineProperty(ParticleSpriteSheetState.prototype, "cyclePhase", {
                /**
                * Defines the cycle phase, when in global mode. Defaults to zero.
                */
                get: function () {
                    return this._cyclePhase;
                },
                set: function (value) {
                    this._cyclePhase = value;

                    this.updateSpriteSheetData();
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ParticleSpriteSheetState.prototype, "cycleDuration", {
                /**
                * Defines the cycle duration in seconds, when in global mode. Defaults to 1.
                */
                get: function () {
                    return this._cycleDuration;
                },
                set: function (value) {
                    this._cycleDuration = value;

                    this.updateSpriteSheetData();
                },
                enumerable: true,
                configurable: true
            });


            ParticleSpriteSheetState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
                if (animationRegisterCache.needUVAnimation) {
                    animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleSpriteSheetNode.UV_INDEX_0), this._spriteSheetData[0], this._spriteSheetData[1], this._spriteSheetData[2], this._spriteSheetData[3]);
                    if (this._usesCycle) {
                        var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleSpriteSheetNode.UV_INDEX_1);
                        if (this._particleSpriteSheetNode.mode == animators.ParticlePropertiesMode.LOCAL_STATIC) {
                            if (this._usesPhase)
                                animationSubGeometry.activateVertexBuffer(index, this._particleSpriteSheetNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
                            else
                                animationSubGeometry.activateVertexBuffer(index, this._particleSpriteSheetNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_2);
                        } else
                            animationRegisterCache.setVertexConst(index, this._spriteSheetData[4], this._spriteSheetData[5]);
                    }
                }
            };

            ParticleSpriteSheetState.prototype.updateSpriteSheetData = function () {
                this._spriteSheetData = new Array(8);

                var uTotal = this._totalFrames / this._numColumns;

                this._spriteSheetData[0] = uTotal;
                this._spriteSheetData[1] = 1 / this._numColumns;
                this._spriteSheetData[2] = 1 / this._numRows;

                if (this._usesCycle) {
                    if (this._cycleDuration <= 0)
                        throw (new Error("the cycle duration must be greater than zero"));
                    this._spriteSheetData[4] = uTotal / this._cycleDuration;
                    this._spriteSheetData[5] = this._cycleDuration;
                    if (this._usesPhase)
                        this._spriteSheetData[6] = this._cyclePhase;
                }
            };
            return ParticleSpriteSheetState;
        })(animators.ParticleStateBase);
        animators.ParticleSpriteSheetState = ParticleSpriteSheetState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ContextGLVertexBufferFormat = away.stagegl.ContextGLVertexBufferFormat;

        /**
        * ...
        */
        var ParticleTimeState = (function (_super) {
            __extends(ParticleTimeState, _super);
            function ParticleTimeState(animator, particleTimeNode) {
                _super.call(this, animator, particleTimeNode, true);

                this._particleTimeNode = particleTimeNode;
            }
            ParticleTimeState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
                animationSubGeometry.activateVertexBuffer(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleTimeNode.TIME_STREAM_INDEX), this._particleTimeNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_4);

                var particleTime = this._pTime / 1000;
                animationRegisterCache.setVertexConst(animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleTimeNode.TIME_CONSTANT_INDEX), particleTime, particleTime, particleTime, particleTime);
            };
            return ParticleTimeState;
        })(animators.ParticleStateBase);
        animators.ParticleTimeState = ParticleTimeState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * ...
        */
        var ParticleUVState = (function (_super) {
            __extends(ParticleUVState, _super);
            function ParticleUVState(animator, particleUVNode) {
                _super.call(this, animator, particleUVNode);

                this._particleUVNode = particleUVNode;
            }
            ParticleUVState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
                if (animationRegisterCache.needUVAnimation) {
                    var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleUVNode.UV_INDEX);
                    var data = this._particleUVNode._iUvData;
                    animationRegisterCache.setVertexConst(index, data.x, data.y);
                }
            };
            return ParticleUVState;
        })(animators.ParticleStateBase);
        animators.ParticleUVState = ParticleUVState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ContextGLVertexBufferFormat = away.stagegl.ContextGLVertexBufferFormat;

        /**
        * ...
        */
        var ParticleVelocityState = (function (_super) {
            __extends(ParticleVelocityState, _super);
            function ParticleVelocityState(animator, particleVelocityNode) {
                _super.call(this, animator, particleVelocityNode);

                this._particleVelocityNode = particleVelocityNode;
                this._velocity = this._particleVelocityNode._iVelocity;
            }
            Object.defineProperty(ParticleVelocityState.prototype, "velocity", {
                /**
                * Defines the default velocity vector of the state, used when in global mode.
                */
                get: function () {
                    return this._velocity;
                },
                set: function (value) {
                    this._velocity = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            *
            */
            ParticleVelocityState.prototype.getVelocities = function () {
                return this._pDynamicProperties;
            };

            ParticleVelocityState.prototype.setVelocities = function (value) {
                this._pDynamicProperties = value;

                this._pDynamicPropertiesDirty = new Object();
            };

            ParticleVelocityState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
                if (this._particleVelocityNode.mode == animators.ParticlePropertiesMode.LOCAL_DYNAMIC && !this._pDynamicPropertiesDirty[animationSubGeometry._iUniqueId])
                    this._pUpdateDynamicProperties(animationSubGeometry);

                var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, animators.ParticleVelocityNode.VELOCITY_INDEX);

                if (this._particleVelocityNode.mode == animators.ParticlePropertiesMode.GLOBAL)
                    animationRegisterCache.setVertexConst(index, this._velocity.x, this._velocity.y, this._velocity.z);
                else
                    animationSubGeometry.activateVertexBuffer(index, this._particleVelocityNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
            };
            return ParticleVelocityState;
        })(animators.ParticleStateBase);
        animators.ParticleVelocityState = ParticleVelocityState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
var away;
(function (away) {
    ///<reference path="../../_definitions.ts"/>
    (function (animators) {
        /**
        *
        */
        var AnimationClipState = (function (_super) {
            __extends(AnimationClipState, _super);
            function AnimationClipState(animator, animationClipNode) {
                _super.call(this, animator, animationClipNode);
                this._pFramesDirty = true;

                this._animationClipNode = animationClipNode;
            }
            Object.defineProperty(AnimationClipState.prototype, "blendWeight", {
                /**
                * Returns a fractional value between 0 and 1 representing the blending ratio of the current playhead position
                * between the current frame (0) and next frame (1) of the animation.
                *
                * @see #currentFrame
                * @see #nextFrame
                */
                get: function () {
                    if (this._pFramesDirty)
                        this._pUpdateFrames();

                    return this._pBlendWeight;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AnimationClipState.prototype, "currentFrame", {
                /**
                * Returns the current frame of animation in the clip based on the internal playhead position.
                */
                get: function () {
                    if (this._pFramesDirty)
                        this._pUpdateFrames();

                    return this._pCurrentFrame;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AnimationClipState.prototype, "nextFrame", {
                /**
                * Returns the next frame of animation in the clip based on the internal playhead position.
                */
                get: function () {
                    if (this._pFramesDirty)
                        this._pUpdateFrames();

                    return this._pNextFrame;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * @inheritDoc
            */
            AnimationClipState.prototype.update = function (time /*int*/ ) {
                if (!this._animationClipNode.looping) {
                    if (time > this._pStartTime + this._animationClipNode.totalDuration)
                        time = this._pStartTime + this._animationClipNode.totalDuration;
                    else if (time < this._pStartTime)
                        time = this._pStartTime;
                }

                if (this._pTime == time - this._pStartTime)
                    return;

                this._pUpdateTime(time);
            };

            /**
            * @inheritDoc
            */
            AnimationClipState.prototype.phase = function (value) {
                var time = value * this._animationClipNode.totalDuration + this._pStartTime;

                if (this._pTime == time - this._pStartTime)
                    return;

                this._pUpdateTime(time);
            };

            /**
            * @inheritDoc
            */
            AnimationClipState.prototype._pUpdateTime = function (time /*int*/ ) {
                this._pFramesDirty = true;

                this._pTimeDir = (time - this._pStartTime > this._pTime) ? 1 : -1;

                _super.prototype._pUpdateTime.call(this, time);
            };

            /**
            * Updates the nodes internal playhead to determine the current and next animation frame, and the blendWeight between the two.
            *
            * @see #currentFrame
            * @see #nextFrame
            * @see #blendWeight
            */
            AnimationClipState.prototype._pUpdateFrames = function () {
                this._pFramesDirty = false;

                var looping = this._animationClipNode.looping;
                var totalDuration = this._animationClipNode.totalDuration;
                var lastFrame = this._animationClipNode.lastFrame;
                var time = this._pTime;

                //trace("time", time, totalDuration)
                if (looping && (time >= totalDuration || time < 0)) {
                    time %= totalDuration;
                    if (time < 0)
                        time += totalDuration;
                }

                if (!looping && time >= totalDuration) {
                    this.notifyPlaybackComplete();
                    this._pCurrentFrame = lastFrame;
                    this._pNextFrame = lastFrame;
                    this._pBlendWeight = 0;
                } else if (!looping && time <= 0) {
                    this._pCurrentFrame = 0;
                    this._pNextFrame = 0;
                    this._pBlendWeight = 0;
                } else if (this._animationClipNode.fixedFrameRate) {
                    var t = time / totalDuration * lastFrame;
                    this._pCurrentFrame = Math.floor(t);
                    this._pBlendWeight = t - this._pCurrentFrame;
                    this._pNextFrame = this._pCurrentFrame + 1;
                } else {
                    this._pCurrentFrame = 0;
                    this._pNextFrame = 0;

                    var dur = 0, frameTime;
                    var durations = this._animationClipNode.durations;

                    do {
                        frameTime = dur;
                        dur += durations[this._pNextFrame];
                        this._pCurrentFrame = this._pNextFrame++;
                    } while(time > dur);

                    if (this._pCurrentFrame == lastFrame) {
                        this._pCurrentFrame = 0;
                        this._pNextFrame = 1;
                    }

                    this._pBlendWeight = (time - frameTime) / durations[this._pCurrentFrame];
                }
            };

            AnimationClipState.prototype.notifyPlaybackComplete = function () {
                if (this._animationStatePlaybackComplete == null)
                    this._animationStatePlaybackComplete = new away.events.AnimationStateEvent(away.events.AnimationStateEvent.PLAYBACK_COMPLETE, this._pAnimator, this, this._animationClipNode);

                this._animationClipNode.dispatchEvent(this._animationStatePlaybackComplete);
            };
            return AnimationClipState;
        })(animators.AnimationStateBase);
        animators.AnimationClipState = AnimationClipState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        *
        */
        var SkeletonBinaryLERPState = (function (_super) {
            __extends(SkeletonBinaryLERPState, _super);
            function SkeletonBinaryLERPState(animator, skeletonAnimationNode) {
                _super.call(this, animator, skeletonAnimationNode);
                this._blendWeight = 0;
                this._skeletonPose = new animators.SkeletonPose();
                this._skeletonPoseDirty = true;

                this._skeletonAnimationNode = skeletonAnimationNode;

                this._inputA = animator.getAnimationState(this._skeletonAnimationNode.inputA);
                this._inputB = animator.getAnimationState(this._skeletonAnimationNode.inputB);
            }
            Object.defineProperty(SkeletonBinaryLERPState.prototype, "blendWeight", {
                /**
                * Defines a fractional value between 0 and 1 representing the blending ratio between inputA (0) and inputB (1),
                * used to produce the skeleton pose output.
                *
                * @see inputA
                * @see inputB
                */
                get: function () {
                    return this._blendWeight;
                },
                set: function (value) {
                    this._blendWeight = value;

                    this._pPositionDeltaDirty = true;
                    this._skeletonPoseDirty = true;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            SkeletonBinaryLERPState.prototype.phase = function (value) {
                this._skeletonPoseDirty = true;

                this._pPositionDeltaDirty = true;

                this._inputA.phase(value);
                this._inputB.phase(value);
            };

            /**
            * @inheritDoc
            */
            SkeletonBinaryLERPState.prototype._pUpdateTime = function (time /*int*/ ) {
                this._skeletonPoseDirty = true;

                this._inputA.update(time);
                this._inputB.update(time);

                _super.prototype._pUpdateTime.call(this, time);
            };

            /**
            * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
            */
            SkeletonBinaryLERPState.prototype.getSkeletonPose = function (skeleton) {
                if (this._skeletonPoseDirty)
                    this.updateSkeletonPose(skeleton);

                return this._skeletonPose;
            };

            /**
            * @inheritDoc
            */
            SkeletonBinaryLERPState.prototype._pUpdatePositionDelta = function () {
                this._pPositionDeltaDirty = false;

                var deltA = this._inputA.positionDelta;
                var deltB = this._inputB.positionDelta;

                this._pRootDelta.x = deltA.x + this._blendWeight * (deltB.x - deltA.x);
                this._pRootDelta.y = deltA.y + this._blendWeight * (deltB.y - deltA.y);
                this._pRootDelta.z = deltA.z + this._blendWeight * (deltB.z - deltA.z);
            };

            /**
            * Updates the output skeleton pose of the node based on the blendWeight value between input nodes.
            *
            * @param skeleton The skeleton used by the animator requesting the ouput pose.
            */
            SkeletonBinaryLERPState.prototype.updateSkeletonPose = function (skeleton) {
                this._skeletonPoseDirty = false;

                var endPose;
                var endPoses = this._skeletonPose.jointPoses;
                var poses1 = this._inputA.getSkeletonPose(skeleton).jointPoses;
                var poses2 = this._inputB.getSkeletonPose(skeleton).jointPoses;
                var pose1, pose2;
                var p1, p2;
                var tr;
                var numJoints = skeleton.numJoints;

                // :s
                if (endPoses.length != numJoints)
                    endPoses.length = numJoints;

                for (var i = 0; i < numJoints; ++i) {
                    endPose = endPoses[i];

                    if (endPose == null)
                        endPose = endPoses[i] = new animators.JointPose();

                    pose1 = poses1[i];
                    pose2 = poses2[i];
                    p1 = pose1.translation;
                    p2 = pose2.translation;

                    endPose.orientation.lerp(pose1.orientation, pose2.orientation, this._blendWeight);

                    tr = endPose.translation;
                    tr.x = p1.x + this._blendWeight * (p2.x - p1.x);
                    tr.y = p1.y + this._blendWeight * (p2.y - p1.y);
                    tr.z = p1.z + this._blendWeight * (p2.z - p1.z);
                }
            };
            return SkeletonBinaryLERPState;
        })(animators.AnimationStateBase);
        animators.SkeletonBinaryLERPState = SkeletonBinaryLERPState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var Vector3D = away.geom.Vector3D;

        /**
        *
        */
        var SkeletonClipState = (function (_super) {
            __extends(SkeletonClipState, _super);
            function SkeletonClipState(animator, skeletonClipNode) {
                _super.call(this, animator, skeletonClipNode);
                this._rootPos = new Vector3D();
                this._skeletonPose = new animators.SkeletonPose();
                this._skeletonPoseDirty = true;

                this._skeletonClipNode = skeletonClipNode;
                this._frames = this._skeletonClipNode.frames;
            }
            Object.defineProperty(SkeletonClipState.prototype, "currentPose", {
                /**
                * Returns the current skeleton pose frame of animation in the clip based on the internal playhead position.
                */
                get: function () {
                    if (this._pFramesDirty)
                        this._pUpdateFrames();

                    return this._currentPose;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SkeletonClipState.prototype, "nextPose", {
                /**
                * Returns the next skeleton pose frame of animation in the clip based on the internal playhead position.
                */
                get: function () {
                    if (this._pFramesDirty)
                        this._pUpdateFrames();

                    return this._nextPose;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
            */
            SkeletonClipState.prototype.getSkeletonPose = function (skeleton) {
                if (this._skeletonPoseDirty)
                    this.updateSkeletonPose(skeleton);

                return this._skeletonPose;
            };

            /**
            * @inheritDoc
            */
            SkeletonClipState.prototype._pUpdateTime = function (time /*int*/ ) {
                this._skeletonPoseDirty = true;

                _super.prototype._pUpdateTime.call(this, time);
            };

            /**
            * @inheritDoc
            */
            SkeletonClipState.prototype._pUpdateFrames = function () {
                _super.prototype._pUpdateFrames.call(this);

                this._currentPose = this._frames[this._pCurrentFrame];

                if (this._skeletonClipNode.looping && this._pNextFrame >= this._skeletonClipNode.lastFrame) {
                    this._nextPose = this._frames[0];
                    this._pAnimator.dispatchCycleEvent();
                } else
                    this._nextPose = this._frames[this._pNextFrame];
            };

            /**
            * Updates the output skeleton pose of the node based on the internal playhead position.
            *
            * @param skeleton The skeleton used by the animator requesting the ouput pose.
            */
            SkeletonClipState.prototype.updateSkeletonPose = function (skeleton) {
                this._skeletonPoseDirty = false;

                if (!this._skeletonClipNode.totalDuration)
                    return;

                if (this._pFramesDirty)
                    this._pUpdateFrames();

                var currentPose = this._currentPose.jointPoses;
                var nextPose = this._nextPose.jointPoses;
                var numJoints = skeleton.numJoints;
                var p1, p2;
                var pose1, pose2;
                var endPoses = this._skeletonPose.jointPoses;
                var endPose;
                var tr;

                // :s
                if (endPoses.length != numJoints)
                    endPoses.length = numJoints;

                if ((numJoints != currentPose.length) || (numJoints != nextPose.length))
                    throw new Error("joint counts don't match!");

                for (var i = 0; i < numJoints; ++i) {
                    endPose = endPoses[i];

                    if (endPose == null)
                        endPose = endPoses[i] = new animators.JointPose();

                    pose1 = currentPose[i];
                    pose2 = nextPose[i];
                    p1 = pose1.translation;
                    p2 = pose2.translation;

                    if (this._skeletonClipNode.highQuality)
                        endPose.orientation.slerp(pose1.orientation, pose2.orientation, this._pBlendWeight);
                    else
                        endPose.orientation.lerp(pose1.orientation, pose2.orientation, this._pBlendWeight);

                    if (i > 0) {
                        tr = endPose.translation;
                        tr.x = p1.x + this._pBlendWeight * (p2.x - p1.x);
                        tr.y = p1.y + this._pBlendWeight * (p2.y - p1.y);
                        tr.z = p1.z + this._pBlendWeight * (p2.z - p1.z);
                    }
                }
            };

            /**
            * @inheritDoc
            */
            SkeletonClipState.prototype._pUpdatePositionDelta = function () {
                this._pPositionDeltaDirty = false;

                if (this._pFramesDirty)
                    this._pUpdateFrames();

                var p1, p2, p3;
                var totalDelta = this._skeletonClipNode.totalDelta;

                // jumping back, need to reset position
                if ((this._pTimeDir > 0 && this._pNextFrame < this._pOldFrame) || (this._pTimeDir < 0 && this._pNextFrame > this._pOldFrame)) {
                    this._rootPos.x -= totalDelta.x * this._pTimeDir;
                    this._rootPos.y -= totalDelta.y * this._pTimeDir;
                    this._rootPos.z -= totalDelta.z * this._pTimeDir;
                }

                var dx = this._rootPos.x;
                var dy = this._rootPos.y;
                var dz = this._rootPos.z;

                if (this._skeletonClipNode.stitchFinalFrame && this._pNextFrame == this._skeletonClipNode.lastFrame) {
                    p1 = this._frames[0].jointPoses[0].translation;
                    p2 = this._frames[1].jointPoses[0].translation;
                    p3 = this._currentPose.jointPoses[0].translation;

                    this._rootPos.x = p3.x + p1.x + this._pBlendWeight * (p2.x - p1.x);
                    this._rootPos.y = p3.y + p1.y + this._pBlendWeight * (p2.y - p1.y);
                    this._rootPos.z = p3.z + p1.z + this._pBlendWeight * (p2.z - p1.z);
                } else {
                    p1 = this._currentPose.jointPoses[0].translation;
                    p2 = this._frames[this._pNextFrame].jointPoses[0].translation; //cover the instances where we wrap the pose but still want the final frame translation values
                    this._rootPos.x = p1.x + this._pBlendWeight * (p2.x - p1.x);
                    this._rootPos.y = p1.y + this._pBlendWeight * (p2.y - p1.y);
                    this._rootPos.z = p1.z + this._pBlendWeight * (p2.z - p1.z);
                }

                this._pRootDelta.x = this._rootPos.x - dx;
                this._pRootDelta.y = this._rootPos.y - dy;
                this._pRootDelta.z = this._rootPos.z - dz;

                this._pOldFrame = this._pNextFrame;
            };
            return SkeletonClipState;
        })(animators.AnimationClipState);
        animators.SkeletonClipState = SkeletonClipState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var Quaternion = away.geom.Quaternion;

        /**
        *
        */
        var SkeletonDifferenceState = (function (_super) {
            __extends(SkeletonDifferenceState, _super);
            function SkeletonDifferenceState(animator, skeletonAnimationNode) {
                _super.call(this, animator, skeletonAnimationNode);
                this._blendWeight = 0;
                this._skeletonPose = new animators.SkeletonPose();
                this._skeletonPoseDirty = true;

                this._skeletonAnimationNode = skeletonAnimationNode;

                this._baseInput = animator.getAnimationState(this._skeletonAnimationNode.baseInput);
                this._differenceInput = animator.getAnimationState(this._skeletonAnimationNode.differenceInput);
            }
            Object.defineProperty(SkeletonDifferenceState.prototype, "blendWeight", {
                /**
                * Defines a fractional value between 0 and 1 representing the blending ratio between the base input (0) and difference input (1),
                * used to produce the skeleton pose output.
                *
                * @see #baseInput
                * @see #differenceInput
                */
                get: function () {
                    return this._blendWeight;
                },
                set: function (value) {
                    this._blendWeight = value;

                    this._pPositionDeltaDirty = true;
                    this._skeletonPoseDirty = true;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            SkeletonDifferenceState.prototype.phase = function (value) {
                this._skeletonPoseDirty = true;

                this._pPositionDeltaDirty = true;

                this._baseInput.phase(value);
                this._baseInput.phase(value);
            };

            /**
            * @inheritDoc
            */
            SkeletonDifferenceState.prototype._pUpdateTime = function (time /*int*/ ) {
                this._skeletonPoseDirty = true;

                this._baseInput.update(time);
                this._differenceInput.update(time);

                _super.prototype._pUpdateTime.call(this, time);
            };

            /**
            * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
            */
            SkeletonDifferenceState.prototype.getSkeletonPose = function (skeleton) {
                if (this._skeletonPoseDirty)
                    this.updateSkeletonPose(skeleton);

                return this._skeletonPose;
            };

            /**
            * @inheritDoc
            */
            SkeletonDifferenceState.prototype._pUpdatePositionDelta = function () {
                this._pPositionDeltaDirty = false;

                var deltA = this._baseInput.positionDelta;
                var deltB = this._differenceInput.positionDelta;

                this.positionDelta.x = deltA.x + this._blendWeight * deltB.x;
                this.positionDelta.y = deltA.y + this._blendWeight * deltB.y;
                this.positionDelta.z = deltA.z + this._blendWeight * deltB.z;
            };

            /**
            * Updates the output skeleton pose of the node based on the blendWeight value between base input and difference input nodes.
            *
            * @param skeleton The skeleton used by the animator requesting the ouput pose.
            */
            SkeletonDifferenceState.prototype.updateSkeletonPose = function (skeleton) {
                this._skeletonPoseDirty = false;

                var endPose;
                var endPoses = this._skeletonPose.jointPoses;
                var basePoses = this._baseInput.getSkeletonPose(skeleton).jointPoses;
                var diffPoses = this._differenceInput.getSkeletonPose(skeleton).jointPoses;
                var base, diff;
                var basePos, diffPos;
                var tr;
                var numJoints = skeleton.numJoints;

                // :s
                if (endPoses.length != numJoints)
                    endPoses.length = numJoints;

                for (var i = 0; i < numJoints; ++i) {
                    endPose = endPoses[i];

                    if (endPose == null)
                        endPose = endPoses[i] = new animators.JointPose();

                    base = basePoses[i];
                    diff = diffPoses[i];
                    basePos = base.translation;
                    diffPos = diff.translation;

                    SkeletonDifferenceState._tempQuat.multiply(diff.orientation, base.orientation);
                    endPose.orientation.lerp(base.orientation, SkeletonDifferenceState._tempQuat, this._blendWeight);

                    tr = endPose.translation;
                    tr.x = basePos.x + this._blendWeight * diffPos.x;
                    tr.y = basePos.y + this._blendWeight * diffPos.y;
                    tr.z = basePos.z + this._blendWeight * diffPos.z;
                }
            };
            SkeletonDifferenceState._tempQuat = new Quaternion();
            return SkeletonDifferenceState;
        })(animators.AnimationStateBase);
        animators.SkeletonDifferenceState = SkeletonDifferenceState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        *
        */
        var SkeletonDirectionalState = (function (_super) {
            __extends(SkeletonDirectionalState, _super);
            function SkeletonDirectionalState(animator, skeletonAnimationNode) {
                _super.call(this, animator, skeletonAnimationNode);
                this._skeletonPose = new animators.SkeletonPose();
                this._skeletonPoseDirty = true;
                this._blendWeight = 0;
                this._direction = 0;
                this._blendDirty = true;

                this._skeletonAnimationNode = skeletonAnimationNode;

                this._forward = animator.getAnimationState(this._skeletonAnimationNode.forward);
                this._backward = animator.getAnimationState(this._skeletonAnimationNode.backward);
                this._left = animator.getAnimationState(this._skeletonAnimationNode.left);
                this._right = animator.getAnimationState(this._skeletonAnimationNode.right);
            }

            Object.defineProperty(SkeletonDirectionalState.prototype, "direction", {
                get: function () {
                    return this._direction;
                },
                /**
                * Defines the direction in degrees of the aniamtion between the forwards (0), right(90) backwards (180) and left(270) input nodes,
                * used to produce the skeleton pose output.
                */
                set: function (value) {
                    if (this._direction == value)
                        return;

                    this._direction = value;

                    this._blendDirty = true;

                    this._skeletonPoseDirty = true;
                    this._pPositionDeltaDirty = true;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * @inheritDoc
            */
            SkeletonDirectionalState.prototype.phase = function (value) {
                if (this._blendDirty)
                    this.updateBlend();

                this._skeletonPoseDirty = true;

                this._pPositionDeltaDirty = true;

                this._inputA.phase(value);
                this._inputB.phase(value);
            };

            /**
            * @inheritDoc
            */
            SkeletonDirectionalState.prototype._pUdateTime = function (time /*int*/ ) {
                if (this._blendDirty)
                    this.updateBlend();

                this._skeletonPoseDirty = true;

                this._inputA.update(time);
                this._inputB.update(time);

                _super.prototype._pUpdateTime.call(this, time);
            };

            /**
            * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
            */
            SkeletonDirectionalState.prototype.getSkeletonPose = function (skeleton) {
                if (this._skeletonPoseDirty)
                    this.updateSkeletonPose(skeleton);

                return this._skeletonPose;
            };

            /**
            * @inheritDoc
            */
            SkeletonDirectionalState.prototype._pUpdatePositionDelta = function () {
                this._pPositionDeltaDirty = false;

                if (this._blendDirty)
                    this.updateBlend();

                var deltA = this._inputA.positionDelta;
                var deltB = this._inputB.positionDelta;

                this.positionDelta.x = deltA.x + this._blendWeight * (deltB.x - deltA.x);
                this.positionDelta.y = deltA.y + this._blendWeight * (deltB.y - deltA.y);
                this.positionDelta.z = deltA.z + this._blendWeight * (deltB.z - deltA.z);
            };

            /**
            * Updates the output skeleton pose of the node based on the direction value between forward, backwards, left and right input nodes.
            *
            * @param skeleton The skeleton used by the animator requesting the ouput pose.
            */
            SkeletonDirectionalState.prototype.updateSkeletonPose = function (skeleton) {
                this._skeletonPoseDirty = false;

                if (this._blendDirty)
                    this.updateBlend();

                var endPose;
                var endPoses = this._skeletonPose.jointPoses;
                var poses1 = this._inputA.getSkeletonPose(skeleton).jointPoses;
                var poses2 = this._inputB.getSkeletonPose(skeleton).jointPoses;
                var pose1, pose2;
                var p1, p2;
                var tr;
                var numJoints = skeleton.numJoints;

                // :s
                if (endPoses.length != numJoints)
                    endPoses.length = numJoints;

                for (var i = 0; i < numJoints; ++i) {
                    endPose = endPoses[i];

                    if (endPose == null)
                        endPose = endPoses[i] = new animators.JointPose();

                    pose1 = poses1[i];
                    pose2 = poses2[i];
                    p1 = pose1.translation;
                    p2 = pose2.translation;

                    endPose.orientation.lerp(pose1.orientation, pose2.orientation, this._blendWeight);

                    tr = endPose.translation;
                    tr.x = p1.x + this._blendWeight * (p2.x - p1.x);
                    tr.y = p1.y + this._blendWeight * (p2.y - p1.y);
                    tr.z = p1.z + this._blendWeight * (p2.z - p1.z);
                }
            };

            /**
            * Updates the blend value for the animation output based on the direction value between forward, backwards, left and right input nodes.
            *
            * @private
            */
            SkeletonDirectionalState.prototype.updateBlend = function () {
                this._blendDirty = false;

                if (this._direction < 0 || this._direction > 360) {
                    this._direction %= 360;
                    if (this._direction < 0)
                        this._direction += 360;
                }

                if (this._direction < 90) {
                    this._inputA = this._forward;
                    this._inputB = this._right;
                    this._blendWeight = this._direction / 90;
                } else if (this._direction < 180) {
                    this._inputA = this._right;
                    this._inputB = this._backward;
                    this._blendWeight = (this._direction - 90) / 90;
                } else if (this._direction < 270) {
                    this._inputA = this._backward;
                    this._inputB = this._left;
                    this._blendWeight = (this._direction - 180) / 90;
                } else {
                    this._inputA = this._left;
                    this._inputB = this._forward;
                    this._blendWeight = (this._direction - 270) / 90;
                }
            };
            return SkeletonDirectionalState;
        })(animators.AnimationStateBase);
        animators.SkeletonDirectionalState = SkeletonDirectionalState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        *
        */
        var SkeletonNaryLERPState = (function (_super) {
            __extends(SkeletonNaryLERPState, _super);
            function SkeletonNaryLERPState(animator, skeletonAnimationNode) {
                _super.call(this, animator, skeletonAnimationNode);
                this._skeletonPose = new animators.SkeletonPose();
                this._skeletonPoseDirty = true;
                this._blendWeights = new Array();
                this._inputs = new Array();

                this._skeletonAnimationNode = skeletonAnimationNode;

                var i = this._skeletonAnimationNode.numInputs;

                while (i--)
                    this._inputs[i] = animator.getAnimationState(this._skeletonAnimationNode._iInputs[i]);
            }
            /**
            * @inheritDoc
            */
            SkeletonNaryLERPState.prototype.phase = function (value) {
                this._skeletonPoseDirty = true;

                this._pPositionDeltaDirty = true;

                for (var j = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
                    if (this._blendWeights[j])
                        this._inputs[j].update(value);
                }
            };

            /**
            * @inheritDoc
            */
            SkeletonNaryLERPState.prototype._pUdateTime = function (time /*int*/ ) {
                for (var j = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
                    if (this._blendWeights[j])
                        this._inputs[j].update(time);
                }

                _super.prototype._pUpdateTime.call(this, time);
            };

            /**
            * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
            */
            SkeletonNaryLERPState.prototype.getSkeletonPose = function (skeleton) {
                if (this._skeletonPoseDirty)
                    this.updateSkeletonPose(skeleton);

                return this._skeletonPose;
            };

            /**
            * Returns the blend weight of the skeleton aniamtion node that resides at the given input index.
            *
            * @param index The input index for which the skeleton animation node blend weight is requested.
            */
            SkeletonNaryLERPState.prototype.getBlendWeightAt = function (index /*uint*/ ) {
                return this._blendWeights[index];
            };

            /**
            * Sets the blend weight of the skeleton aniamtion node that resides at the given input index.
            *
            * @param index The input index on which the skeleton animation node blend weight is to be set.
            * @param blendWeight The blend weight value to use for the given skeleton animation node index.
            */
            SkeletonNaryLERPState.prototype.setBlendWeightAt = function (index /*uint*/ , blendWeight) {
                this._blendWeights[index] = blendWeight;

                this._pPositionDeltaDirty = true;
                this._skeletonPoseDirty = true;
            };

            /**
            * @inheritDoc
            */
            SkeletonNaryLERPState.prototype._pUpdatePositionDelta = function () {
                this._pPositionDeltaDirty = false;

                var delta;
                var weight;

                this.positionDelta.x = 0;
                this.positionDelta.y = 0;
                this.positionDelta.z = 0;

                for (var j = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
                    weight = this._blendWeights[j];

                    if (weight) {
                        delta = this._inputs[j].positionDelta;
                        this.positionDelta.x += weight * delta.x;
                        this.positionDelta.y += weight * delta.y;
                        this.positionDelta.z += weight * delta.z;
                    }
                }
            };

            /**
            * Updates the output skeleton pose of the node based on the blend weight values given to the input nodes.
            *
            * @param skeleton The skeleton used by the animator requesting the ouput pose.
            */
            SkeletonNaryLERPState.prototype.updateSkeletonPose = function (skeleton) {
                this._skeletonPoseDirty = false;

                var weight;
                var endPoses = this._skeletonPose.jointPoses;
                var poses;
                var endPose, pose;
                var endTr, tr;
                var endQuat, q;
                var firstPose;
                var i;
                var w0, x0, y0, z0;
                var w1, x1, y1, z1;
                var numJoints = skeleton.numJoints;

                // :s
                if (endPoses.length != numJoints)
                    endPoses.length = numJoints;

                for (var j = 0; j < this._skeletonAnimationNode.numInputs; ++j) {
                    weight = this._blendWeights[j];

                    if (!weight)
                        continue;

                    poses = this._inputs[j].getSkeletonPose(skeleton).jointPoses;

                    if (!firstPose) {
                        firstPose = poses;
                        for (i = 0; i < numJoints; ++i) {
                            endPose = endPoses[i];

                            if (endPose == null)
                                endPose = endPoses[i] = new animators.JointPose();

                            pose = poses[i];
                            q = pose.orientation;
                            tr = pose.translation;

                            endQuat = endPose.orientation;

                            endQuat.x = weight * q.x;
                            endQuat.y = weight * q.y;
                            endQuat.z = weight * q.z;
                            endQuat.w = weight * q.w;

                            endTr = endPose.translation;
                            endTr.x = weight * tr.x;
                            endTr.y = weight * tr.y;
                            endTr.z = weight * tr.z;
                        }
                    } else {
                        for (i = 0; i < skeleton.numJoints; ++i) {
                            endPose = endPoses[i];
                            pose = poses[i];

                            q = firstPose[i].orientation;
                            x0 = q.x;
                            y0 = q.y;
                            z0 = q.z;
                            w0 = q.w;

                            q = pose.orientation;
                            tr = pose.translation;

                            x1 = q.x;
                            y1 = q.y;
                            z1 = q.z;
                            w1 = q.w;

                            // find shortest direction
                            if (x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1 < 0) {
                                x1 = -x1;
                                y1 = -y1;
                                z1 = -z1;
                                w1 = -w1;
                            }
                            endQuat = endPose.orientation;
                            endQuat.x += weight * x1;
                            endQuat.y += weight * y1;
                            endQuat.z += weight * z1;
                            endQuat.w += weight * w1;

                            endTr = endPose.translation;
                            endTr.x += weight * tr.x;
                            endTr.y += weight * tr.y;
                            endTr.z += weight * tr.z;
                        }
                    }
                }

                for (i = 0; i < skeleton.numJoints; ++i)
                    endPoses[i].orientation.normalize();
            };
            return SkeletonNaryLERPState;
        })(animators.AnimationStateBase);
        animators.SkeletonNaryLERPState = SkeletonNaryLERPState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        *
        */
        var VertexClipState = (function (_super) {
            __extends(VertexClipState, _super);
            function VertexClipState(animator, vertexClipNode) {
                _super.call(this, animator, vertexClipNode);

                this._vertexClipNode = vertexClipNode;
                this._frames = this._vertexClipNode.frames;
            }
            Object.defineProperty(VertexClipState.prototype, "currentGeometry", {
                /**
                * @inheritDoc
                */
                get: function () {
                    if (this._pFramesDirty)
                        this._pUpdateFrames();

                    return this._currentGeometry;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(VertexClipState.prototype, "nextGeometry", {
                /**
                * @inheritDoc
                */
                get: function () {
                    if (this._pFramesDirty)
                        this._pUpdateFrames();

                    return this._nextGeometry;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * @inheritDoc
            */
            VertexClipState.prototype._pUpdateFrames = function () {
                _super.prototype._pUpdateFrames.call(this);

                this._currentGeometry = this._frames[this._pCurrentFrame];

                if (this._vertexClipNode.looping && this._pNextFrame >= this._vertexClipNode.lastFrame) {
                    this._nextGeometry = this._frames[0];
                    this._pAnimator.dispatchCycleEvent();
                } else
                    this._nextGeometry = this._frames[this._pNextFrame];
            };

            /**
            * @inheritDoc
            */
            VertexClipState.prototype._pUpdatePositionDelta = function () {
                //TODO:implement positiondelta functionality for vertex animations
            };
            return VertexClipState;
        })(animators.AnimationClipState);
        animators.VertexClipState = VertexClipState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var CrossfadeTransition = (function () {
            function CrossfadeTransition(blendSpeed) {
                this.blendSpeed = 0.5;
                this.blendSpeed = blendSpeed;
            }
            CrossfadeTransition.prototype.getAnimationNode = function (animator, startNode, endNode, startBlend /*int*/ ) {
                var crossFadeTransitionNode = new animators.CrossfadeTransitionNode();
                crossFadeTransitionNode.inputA = startNode;
                crossFadeTransitionNode.inputB = endNode;
                crossFadeTransitionNode.blendSpeed = this.blendSpeed;
                crossFadeTransitionNode.startBlend = startBlend;

                return crossFadeTransitionNode;
            };
            return CrossfadeTransition;
        })();
        animators.CrossfadeTransition = CrossfadeTransition;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * A skeleton animation node that uses two animation node inputs to blend a lineraly interpolated output of a skeleton pose.
        */
        var CrossfadeTransitionNode = (function (_super) {
            __extends(CrossfadeTransitionNode, _super);
            /**
            * Creates a new <code>CrossfadeTransitionNode</code> object.
            */
            function CrossfadeTransitionNode() {
                _super.call(this);

                this._pStateClass = animators.CrossfadeTransitionState;
            }
            return CrossfadeTransitionNode;
        })(animators.SkeletonBinaryLERPNode);
        animators.CrossfadeTransitionNode = CrossfadeTransitionNode;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var AnimationStateEvent = away.events.AnimationStateEvent;

        /**
        *
        */
        var CrossfadeTransitionState = (function (_super) {
            __extends(CrossfadeTransitionState, _super);
            function CrossfadeTransitionState(animator, skeletonAnimationNode) {
                _super.call(this, animator, skeletonAnimationNode);

                this._crossfadeTransitionNode = skeletonAnimationNode;
            }
            /**
            * @inheritDoc
            */
            CrossfadeTransitionState.prototype._pUpdateTime = function (time /*int*/ ) {
                this.blendWeight = Math.abs(time - this._crossfadeTransitionNode.startBlend) / (1000 * this._crossfadeTransitionNode.blendSpeed);

                if (this.blendWeight >= 1) {
                    this.blendWeight = 1;

                    if (this._animationStateTransitionComplete == null)
                        this._animationStateTransitionComplete = new AnimationStateEvent(AnimationStateEvent.TRANSITION_COMPLETE, this._pAnimator, this, this._crossfadeTransitionNode);

                    this._crossfadeTransitionNode.dispatchEvent(this._animationStateTransitionComplete);
                }

                _super.prototype._pUpdateTime.call(this, time);
            };
            return CrossfadeTransitionState;
        })(animators.SkeletonBinaryLERPState);
        animators.CrossfadeTransitionState = CrossfadeTransitionState;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * The animation data set used by particle-based animators, containing particle animation data.
        *
        * @see away.animators.ParticleAnimator
        */
        var ParticleAnimationSet = (function (_super) {
            __extends(ParticleAnimationSet, _super);
            /**
            * Creates a new <code>ParticleAnimationSet</code>
            *
            * @param    [optional] usesDuration    Defines whether the animation set uses the <code>duration</code> data in its static properties to determine how long a particle is visible for. Defaults to false.
            * @param    [optional] usesLooping     Defines whether the animation set uses a looping timeframe for each particle determined by the <code>startTime</code>, <code>duration</code> and <code>delay</code> data in its static properties function. Defaults to false. Requires <code>usesDuration</code> to be true.
            * @param    [optional] usesDelay       Defines whether the animation set uses the <code>delay</code> data in its static properties to determine how long a particle is hidden for. Defaults to false. Requires <code>usesLooping</code> to be true.
            */
            function ParticleAnimationSet(usesDuration, usesLooping, usesDelay) {
                if (typeof usesDuration === "undefined") { usesDuration = false; }
                if (typeof usesLooping === "undefined") { usesLooping = false; }
                if (typeof usesDelay === "undefined") { usesDelay = false; }
                _super.call(this);
                this._animationSubGeometries = new Object();
                this._particleNodes = new Array();
                this._localDynamicNodes = new Array();
                this._localStaticNodes = new Array();
                this._totalLenOfOneVertex = 0;

                //automatically add a particle time node to the set
                this.addAnimation(this._timeNode = new animators.ParticleTimeNode(usesDuration, usesLooping, usesDelay));
            }
            Object.defineProperty(ParticleAnimationSet.prototype, "particleNodes", {
                /**
                * Returns a vector of the particle animation nodes contained within the set.
                */
                get: function () {
                    return this._particleNodes;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * @inheritDoc
            */
            ParticleAnimationSet.prototype.addAnimation = function (node) {
                var i;
                var n = node;
                n._iProcessAnimationSetting(this);
                if (n.mode == animators.ParticlePropertiesMode.LOCAL_STATIC) {
                    n._iDataOffset = this._totalLenOfOneVertex;
                    this._totalLenOfOneVertex += n.dataLength;
                    this._localStaticNodes.push(n);
                } else if (n.mode == animators.ParticlePropertiesMode.LOCAL_DYNAMIC)
                    this._localDynamicNodes.push(n);

                for (i = this._particleNodes.length - 1; i >= 0; i--) {
                    if (this._particleNodes[i].priority <= n.priority)
                        break;
                }

                this._particleNodes.splice(i + 1, 0, n);

                _super.prototype.addAnimation.call(this, node);
            };

            /**
            * @inheritDoc
            */
            ParticleAnimationSet.prototype.activate = function (shaderObject, stage) {
                //			this._iAnimationRegisterCache = pass.animationRegisterCache;
            };

            /**
            * @inheritDoc
            */
            ParticleAnimationSet.prototype.deactivate = function (shaderObject, stage) {
                //			var context:IContextStageGL = <IContextStageGL> stage.context;
                //			var offset:number /*int*/ = this._iAnimationRegisterCache.vertexAttributesOffset;
                //			var used:number /*int*/ = this._iAnimationRegisterCache.numUsedStreams;
                //			for (var i:number /*int*/ = offset; i < used; i++)
                //				context.setVertexBufferAt(i, null);
            };

            /**
            * @inheritDoc
            */
            ParticleAnimationSet.prototype.getAGALVertexCode = function (shaderObject) {
                //grab animationRegisterCache from the materialpassbase or create a new one if the first time
                this._iAnimationRegisterCache = shaderObject.animationRegisterCache;

                if (this._iAnimationRegisterCache == null)
                    this._iAnimationRegisterCache = shaderObject.animationRegisterCache = new animators.AnimationRegisterCache(shaderObject.profile);

                //reset animationRegisterCache
                this._iAnimationRegisterCache.vertexConstantOffset = shaderObject.numUsedVertexConstants;
                this._iAnimationRegisterCache.vertexAttributesOffset = shaderObject.numUsedStreams;
                this._iAnimationRegisterCache.varyingsOffset = shaderObject.numUsedVaryings;
                this._iAnimationRegisterCache.fragmentConstantOffset = shaderObject.numUsedFragmentConstants;
                this._iAnimationRegisterCache.hasUVNode = this.hasUVNode;
                this._iAnimationRegisterCache.needVelocity = this.needVelocity;
                this._iAnimationRegisterCache.hasBillboard = this.hasBillboard;
                this._iAnimationRegisterCache.sourceRegisters = shaderObject.animatableAttributes;
                this._iAnimationRegisterCache.targetRegisters = shaderObject.animationTargetRegisters;
                this._iAnimationRegisterCache.needFragmentAnimation = shaderObject.usesFragmentAnimation;
                this._iAnimationRegisterCache.needUVAnimation = !shaderObject.usesUVTransform;
                this._iAnimationRegisterCache.hasColorAddNode = this.hasColorAddNode;
                this._iAnimationRegisterCache.hasColorMulNode = this.hasColorMulNode;
                this._iAnimationRegisterCache.reset();

                var code = "";

                code += this._iAnimationRegisterCache.getInitCode();

                var node;
                var i;

                for (i = 0; i < this._particleNodes.length; i++) {
                    node = this._particleNodes[i];
                    if (node.priority < ParticleAnimationSet.POST_PRIORITY)
                        code += node.getAGALVertexCode(shaderObject, this._iAnimationRegisterCache);
                }

                code += this._iAnimationRegisterCache.getCombinationCode();

                for (i = 0; i < this._particleNodes.length; i++) {
                    node = this._particleNodes[i];
                    if (node.priority >= ParticleAnimationSet.POST_PRIORITY && node.priority < ParticleAnimationSet.COLOR_PRIORITY)
                        code += node.getAGALVertexCode(shaderObject, this._iAnimationRegisterCache);
                }

                code += this._iAnimationRegisterCache.initColorRegisters();

                for (i = 0; i < this._particleNodes.length; i++) {
                    node = this._particleNodes[i];
                    if (node.priority >= ParticleAnimationSet.COLOR_PRIORITY)
                        code += node.getAGALVertexCode(shaderObject, this._iAnimationRegisterCache);
                }
                code += this._iAnimationRegisterCache.getColorPassCode();
                return code;
            };

            /**
            * @inheritDoc
            */
            ParticleAnimationSet.prototype.getAGALUVCode = function (shaderObject) {
                var code = "";
                if (this.hasUVNode) {
                    this._iAnimationRegisterCache.setUVSourceAndTarget(shaderObject.uvSource, shaderObject.uvTarget);
                    code += "mov " + this._iAnimationRegisterCache.uvTarget + ".xy," + this._iAnimationRegisterCache.uvAttribute.toString() + "\n";
                    var node;
                    for (var i = 0; i < this._particleNodes.length; i++)
                        node = this._particleNodes[i];
                    code += node.getAGALUVCode(shaderObject, this._iAnimationRegisterCache);
                    code += "mov " + this._iAnimationRegisterCache.uvVar.toString() + "," + this._iAnimationRegisterCache.uvTarget + ".xy\n";
                } else
                    code += "mov " + shaderObject.uvTarget + "," + shaderObject.uvSource + "\n";
                return code;
            };

            /**
            * @inheritDoc
            */
            ParticleAnimationSet.prototype.getAGALFragmentCode = function (shaderObject, shadedTarget) {
                return this._iAnimationRegisterCache.getColorCombinationCode(shadedTarget);
            };

            /**
            * @inheritDoc
            */
            ParticleAnimationSet.prototype.doneAGALCode = function (shaderObject) {
                this._iAnimationRegisterCache.setDataLength();

                //set vertexZeroConst,vertexOneConst,vertexTwoConst
                this._iAnimationRegisterCache.setVertexConst(this._iAnimationRegisterCache.vertexZeroConst.index, 0, 1, 2, 0);
            };

            Object.defineProperty(ParticleAnimationSet.prototype, "usesCPU", {
                /**
                * @inheritDoc
                */
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * @inheritDoc
            */
            ParticleAnimationSet.prototype.cancelGPUCompatibility = function () {
            };

            ParticleAnimationSet.prototype.dispose = function () {
                for (var key in this._animationSubGeometries)
                    this._animationSubGeometries[key].dispose();

                _super.prototype.dispose.call(this);
            };

            ParticleAnimationSet.prototype.getAnimationSubGeometry = function (subMesh) {
                var mesh = subMesh.parentMesh;
                var animationSubGeometry = (mesh.shareAnimationGeometry) ? this._animationSubGeometries[subMesh.subGeometry.id] : this._animationSubGeometries[subMesh.id];

                if (animationSubGeometry)
                    return animationSubGeometry;

                this._iGenerateAnimationSubGeometries(mesh);

                return (mesh.shareAnimationGeometry) ? this._animationSubGeometries[subMesh.subGeometry.id] : this._animationSubGeometries[subMesh.id];
            };

            /** @private */
            ParticleAnimationSet.prototype._iGenerateAnimationSubGeometries = function (mesh) {
                if (this.initParticleFunc == null)
                    throw (new Error("no initParticleFunc set"));

                var geometry = mesh.geometry;

                if (!geometry)
                    throw (new Error("Particle animation can only be performed on a ParticleGeometry object"));

                var i, j, k;
                var animationSubGeometry;
                var newAnimationSubGeometry = false;
                var subGeometry;
                var subMesh;
                var localNode;

                for (i = 0; i < mesh.subMeshes.length; i++) {
                    subMesh = mesh.subMeshes[i];
                    subGeometry = subMesh.subGeometry;
                    if (mesh.shareAnimationGeometry) {
                        animationSubGeometry = this._animationSubGeometries[subGeometry.id];

                        if (animationSubGeometry)
                            continue;
                    }

                    animationSubGeometry = new animators.AnimationSubGeometry();

                    if (mesh.shareAnimationGeometry)
                        this._animationSubGeometries[subGeometry.id] = animationSubGeometry;
                    else
                        this._animationSubGeometries[subMesh.id] = animationSubGeometry;

                    newAnimationSubGeometry = true;

                    //create the vertexData vector that will be used for local node data
                    animationSubGeometry.createVertexData(subGeometry.numVertices, this._totalLenOfOneVertex);
                }

                if (!newAnimationSubGeometry)
                    return;

                var particles = geometry.particles;
                var particlesLength = particles.length;
                var numParticles = geometry.numParticles;
                var particleProperties = new animators.ParticleProperties();
                var particle;

                var oneDataLen;
                var oneDataOffset;
                var counterForVertex;
                var counterForOneData;
                var oneData;
                var numVertices;
                var vertexData;
                var vertexLength;
                var startingOffset;
                var vertexOffset;

                //default values for particle param
                particleProperties.total = numParticles;
                particleProperties.startTime = 0;
                particleProperties.duration = 1000;
                particleProperties.delay = 0.1;

                i = 0;
                j = 0;
                while (i < numParticles) {
                    particleProperties.index = i;

                    //call the init on the particle parameters
                    this.initParticleFunc.call(this.initParticleScope, particleProperties);

                    for (k = 0; k < this._localStaticNodes.length; k++)
                        this._localStaticNodes[k]._iGeneratePropertyOfOneParticle(particleProperties);

                    while (j < particlesLength && (particle = particles[j]).particleIndex == i) {
                        for (k = 0; k < mesh.subMeshes.length; k++) {
                            subMesh = mesh.subMeshes[k];
                            if (subMesh.subGeometry == particle.subGeometry) {
                                animationSubGeometry = (mesh.shareAnimationGeometry) ? this._animationSubGeometries[subMesh.subGeometry.id] : this._animationSubGeometries[subMesh.id];
                                break;
                            }
                        }
                        numVertices = particle.numVertices;
                        vertexData = animationSubGeometry.vertexData;
                        vertexLength = numVertices * this._totalLenOfOneVertex;
                        startingOffset = animationSubGeometry.numProcessedVertices * this._totalLenOfOneVertex;

                        for (k = 0; k < this._localStaticNodes.length; k++) {
                            localNode = this._localStaticNodes[k];
                            oneData = localNode.oneData;
                            oneDataLen = localNode.dataLength;
                            oneDataOffset = startingOffset + localNode._iDataOffset;

                            for (counterForVertex = 0; counterForVertex < vertexLength; counterForVertex += this._totalLenOfOneVertex) {
                                vertexOffset = oneDataOffset + counterForVertex;

                                for (counterForOneData = 0; counterForOneData < oneDataLen; counterForOneData++)
                                    vertexData[vertexOffset + counterForOneData] = oneData[counterForOneData];
                            }
                        }

                        //store particle properties if they need to be retreived for dynamic local nodes
                        if (this._localDynamicNodes.length)
                            animationSubGeometry.animationParticles.push(new animators.ParticleAnimationData(i, particleProperties.startTime, particleProperties.duration, particleProperties.delay, particle));

                        animationSubGeometry.numProcessedVertices += numVertices;

                        //next index
                        j++;
                    }

                    //next particle
                    i++;
                }
            };
            ParticleAnimationSet.POST_PRIORITY = 9;

            ParticleAnimationSet.COLOR_PRIORITY = 18;
            return ParticleAnimationSet;
        })(animators.AnimationSetBase);
        animators.ParticleAnimationSet = ParticleAnimationSet;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var ContextGLProgramType = away.stagegl.ContextGLProgramType;

        /**
        * Provides an interface for assigning paricle-based animation data sets to mesh-based entity objects
        * and controlling the various available states of animation through an interative playhead that can be
        * automatically updated or manually triggered.
        *
        * Requires that the containing geometry of the parent mesh is particle geometry
        *
        * @see away.base.ParticleGeometry
        */
        var ParticleAnimator = (function (_super) {
            __extends(ParticleAnimator, _super);
            /**
            * Creates a new <code>ParticleAnimator</code> object.
            *
            * @param particleAnimationSet The animation data set containing the particle animations used by the animator.
            */
            function ParticleAnimator(particleAnimationSet) {
                _super.call(this, particleAnimationSet);
                this._animationParticleStates = new Array();
                this._animatorParticleStates = new Array();
                this._timeParticleStates = new Array();
                this._totalLenOfOneVertex = 0;
                this._animatorSubGeometries = new Object();
                this._particleAnimationSet = particleAnimationSet;

                var state;
                var node;

                for (var i = 0; i < this._particleAnimationSet.particleNodes.length; i++) {
                    node = this._particleAnimationSet.particleNodes[i];
                    state = this.getAnimationState(node);
                    if (node.mode == animators.ParticlePropertiesMode.LOCAL_DYNAMIC) {
                        this._animatorParticleStates.push(state);
                        node._iDataOffset = this._totalLenOfOneVertex;
                        this._totalLenOfOneVertex += node.dataLength;
                    } else {
                        this._animationParticleStates.push(state);
                    }
                    if (state.needUpdateTime)
                        this._timeParticleStates.push(state);
                }
            }
            /**
            * @inheritDoc
            */
            ParticleAnimator.prototype.clone = function () {
                return new ParticleAnimator(this._particleAnimationSet);
            };

            /**
            * @inheritDoc
            */
            ParticleAnimator.prototype.setRenderState = function (shaderObject, renderable, stage, camera, vertexConstantOffset /*int*/ , vertexStreamOffset /*int*/ ) {
                var animationRegisterCache = this._particleAnimationSet._iAnimationRegisterCache;

                var subMesh = renderable.subMesh;
                var state;
                var i;

                if (!subMesh)
                    throw (new Error("Must be subMesh"));

                //process animation sub geometries
                var animationSubGeometry = this._particleAnimationSet.getAnimationSubGeometry(subMesh);

                for (i = 0; i < this._animationParticleStates.length; i++)
                    this._animationParticleStates[i].setRenderState(stage, renderable, animationSubGeometry, animationRegisterCache, camera);

                //process animator subgeometries
                var animatorSubGeometry = this.getAnimatorSubGeometry(subMesh);

                for (i = 0; i < this._animatorParticleStates.length; i++)
                    this._animatorParticleStates[i].setRenderState(stage, renderable, animatorSubGeometry, animationRegisterCache, camera);

                stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, animationRegisterCache.vertexConstantOffset, animationRegisterCache.vertexConstantData, animationRegisterCache.numVertexConstant);

                if (animationRegisterCache.numFragmentConstant > 0)
                    stage.context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, animationRegisterCache.fragmentConstantOffset, animationRegisterCache.fragmentConstantData, animationRegisterCache.numFragmentConstant);
            };

            /**
            * @inheritDoc
            */
            ParticleAnimator.prototype.testGPUCompatibility = function (shaderObject) {
            };

            /**
            * @inheritDoc
            */
            ParticleAnimator.prototype.start = function () {
                _super.prototype.start.call(this);

                for (var i = 0; i < this._timeParticleStates.length; i++)
                    this._timeParticleStates[i].offset(this._pAbsoluteTime);
            };

            /**
            * @inheritDoc
            */
            ParticleAnimator.prototype._pUpdateDeltaTime = function (dt) {
                this._pAbsoluteTime += dt;

                for (var i = 0; i < this._timeParticleStates.length; i++)
                    this._timeParticleStates[i].update(this._pAbsoluteTime);
            };

            /**
            * @inheritDoc
            */
            ParticleAnimator.prototype.resetTime = function (offset) {
                if (typeof offset === "undefined") { offset = 0; }
                for (var i = 0; i < this._timeParticleStates.length; i++)
                    this._timeParticleStates[i].offset(this._pAbsoluteTime + offset);
                this.update(this.time);
            };

            ParticleAnimator.prototype.dispose = function () {
                for (var key in this._animatorSubGeometries)
                    this._animatorSubGeometries[key].dispose();
            };

            ParticleAnimator.prototype.getAnimatorSubGeometry = function (subMesh) {
                if (!this._animatorParticleStates.length)
                    return;

                var subGeometry = subMesh.subGeometry;
                var animatorSubGeometry = this._animatorSubGeometries[subGeometry.id] = new animators.AnimationSubGeometry();

                //create the vertexData vector that will be used for local state data
                animatorSubGeometry.createVertexData(subGeometry.numVertices, this._totalLenOfOneVertex);

                //pass the particles data to the animator subGeometry
                animatorSubGeometry.animationParticles = this._particleAnimationSet.getAnimationSubGeometry(subMesh).animationParticles;
            };
            return ParticleAnimator;
        })(animators.AnimatorBase);
        animators.ParticleAnimator = ParticleAnimator;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var TriangleSubGeometry = away.base.TriangleSubGeometry;

        var AnimationStateEvent = away.events.AnimationStateEvent;

        var ContextGLProgramType = away.stagegl.ContextGLProgramType;

        /**
        * Provides an interface for assigning skeleton-based animation data sets to mesh-based entity objects
        * and controlling the various available states of animation through an interative playhead that can be
        * automatically updated or manually triggered.
        */
        var SkeletonAnimator = (function (_super) {
            __extends(SkeletonAnimator, _super);
            /**
            * Creates a new <code>SkeletonAnimator</code> object.
            *
            * @param skeletonAnimationSet The animation data set containing the skeleton animations used by the animator.
            * @param skeleton The skeleton object used for calculating the resulting global matrices for transforming skinned mesh data.
            * @param forceCPU Optional value that only allows the animator to perform calculation on the CPU. Defaults to false.
            */
            function SkeletonAnimator(animationSet, skeleton, forceCPU) {
                if (typeof forceCPU === "undefined") { forceCPU = false; }
                var _this = this;
                _super.call(this, animationSet);
                this._globalPose = new animators.SkeletonPose();
                this._morphedSubGeometry = new Object();
                this._morphedSubGeometryDirty = new Object();

                this._skeleton = skeleton;
                this._forceCPU = forceCPU;
                this._jointsPerVertex = animationSet.jointsPerVertex;

                this._numJoints = this._skeleton.numJoints;
                this._globalMatrices = new Array(this._numJoints * 12);

                var j = 0;
                for (var i = 0; i < this._numJoints; ++i) {
                    this._globalMatrices[j++] = 1;
                    this._globalMatrices[j++] = 0;
                    this._globalMatrices[j++] = 0;
                    this._globalMatrices[j++] = 0;
                    this._globalMatrices[j++] = 0;
                    this._globalMatrices[j++] = 1;
                    this._globalMatrices[j++] = 0;
                    this._globalMatrices[j++] = 0;
                    this._globalMatrices[j++] = 0;
                    this._globalMatrices[j++] = 0;
                    this._globalMatrices[j++] = 1;
                    this._globalMatrices[j++] = 0;
                }

                this._onTransitionCompleteDelegate = function (event) {
                    return _this.onTransitionComplete(event);
                };
                this._onIndicesUpdateDelegate = function (event) {
                    return _this.onIndicesUpdate(event);
                };
                this._onVerticesUpdateDelegate = function (event) {
                    return _this.onVerticesUpdate(event);
                };
            }
            Object.defineProperty(SkeletonAnimator.prototype, "globalMatrices", {
                /**
                * returns the calculated global matrices of the current skeleton pose.
                *
                * @see #globalPose
                */
                get: function () {
                    if (this._globalPropertiesDirty)
                        this.updateGlobalProperties();

                    return this._globalMatrices;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SkeletonAnimator.prototype, "globalPose", {
                /**
                * returns the current skeleton pose output from the animator.
                *
                * @see away.animators.data.SkeletonPose
                */
                get: function () {
                    if (this._globalPropertiesDirty)
                        this.updateGlobalProperties();

                    return this._globalPose;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SkeletonAnimator.prototype, "skeleton", {
                /**
                * Returns the skeleton object in use by the animator - this defines the number and heirarchy of joints used by the
                * skinned geoemtry to which skeleon animator is applied.
                */
                get: function () {
                    return this._skeleton;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SkeletonAnimator.prototype, "forceCPU", {
                /**
                * Indicates whether the skeleton animator is disabled by default for GPU rendering, something that allows the animator to perform calculation on the GPU.
                * Defaults to false.
                */
                get: function () {
                    return this._forceCPU;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SkeletonAnimator.prototype, "useCondensedIndices", {
                /**
                * Offers the option of enabling GPU accelerated animation on skeletons larger than 32 joints
                * by condensing the number of joint index values required per mesh. Only applicable to
                * skeleton animations that utilise more than one mesh object. Defaults to false.
                */
                get: function () {
                    return this._useCondensedIndices;
                },
                set: function (value) {
                    this._useCondensedIndices = value;
                },
                enumerable: true,
                configurable: true
            });


            /**
            * @inheritDoc
            */
            SkeletonAnimator.prototype.clone = function () {
                /* The cast to SkeletonAnimationSet should never fail, as _animationSet can only be set
                through the constructor, which will only accept a SkeletonAnimationSet. */
                return new SkeletonAnimator(this._pAnimationSet, this._skeleton, this._forceCPU);
            };

            /**
            * Plays an animation state registered with the given name in the animation data set.
            *
            * @param name The data set name of the animation state to be played.
            * @param transition An optional transition object that determines how the animator will transition from the currently active animation state.
            * @param offset An option offset time (in milliseconds) that resets the state's internal clock to the absolute time of the animator plus the offset value. Required for non-looping animation states.
            */
            SkeletonAnimator.prototype.play = function (name, transition, offset) {
                if (typeof transition === "undefined") { transition = null; }
                if (typeof offset === "undefined") { offset = NaN; }
                if (this._pActiveAnimationName == name)
                    return;

                this._pActiveAnimationName = name;

                if (!this._pAnimationSet.hasAnimation(name))
                    throw new Error("Animation root node " + name + " not found!");

                if (transition && this._pActiveNode) {
                    //setup the transition
                    this._pActiveNode = transition.getAnimationNode(this, this._pActiveNode, this._pAnimationSet.getAnimation(name), this._pAbsoluteTime);
                    this._pActiveNode.addEventListener(AnimationStateEvent.TRANSITION_COMPLETE, this._onTransitionCompleteDelegate);
                } else
                    this._pActiveNode = this._pAnimationSet.getAnimation(name);

                this._pActiveState = this.getAnimationState(this._pActiveNode);

                if (this.updatePosition) {
                    //update straight away to reset position deltas
                    this._pActiveState.update(this._pAbsoluteTime);
                    this._pActiveState.positionDelta;
                }

                this._activeSkeletonState = this._pActiveState;

                this.start();

                //apply a time offset if specified
                if (!isNaN(offset))
                    this.reset(name, offset);
            };

            /**
            * @inheritDoc
            */
            SkeletonAnimator.prototype.setRenderState = function (shaderObject, renderable, stage, camera, vertexConstantOffset /*int*/ , vertexStreamOffset /*int*/ ) {
                // do on request of globalProperties
                if (this._globalPropertiesDirty)
                    this.updateGlobalProperties();

                var subGeometry = renderable.subMesh.subGeometry;

                subGeometry.useCondensedIndices = this._useCondensedIndices;

                if (this._useCondensedIndices) {
                    // using a condensed data set
                    this.updateCondensedMatrices(subGeometry.condensedIndexLookUp, subGeometry.numCondensedJoints);
                    stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, vertexConstantOffset, this._condensedMatrices, subGeometry.numCondensedJoints * 3);
                } else {
                    if (this._pAnimationSet.usesCPU) {
                        if (this._morphedSubGeometryDirty[subGeometry.id])
                            this.morphSubGeometry(renderable, subGeometry);

                        return;
                    }
                    stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, vertexConstantOffset, this._globalMatrices, this._numJoints * 3);
                }

                stage.context.activateBuffer(vertexStreamOffset, renderable.getVertexData(TriangleSubGeometry.JOINT_INDEX_DATA), renderable.getVertexOffset(TriangleSubGeometry.JOINT_INDEX_DATA), renderable.JOINT_INDEX_FORMAT);
                stage.context.activateBuffer(vertexStreamOffset + 1, renderable.getVertexData(TriangleSubGeometry.JOINT_WEIGHT_DATA), renderable.getVertexOffset(TriangleSubGeometry.JOINT_WEIGHT_DATA), renderable.JOINT_WEIGHT_FORMAT);
            };

            /**
            * @inheritDoc
            */
            SkeletonAnimator.prototype.testGPUCompatibility = function (shaderObject) {
                if (!this._useCondensedIndices && (this._forceCPU || this._jointsPerVertex > 4 || shaderObject.numUsedVertexConstants + this._numJoints * 3 > 128))
                    this._pAnimationSet.cancelGPUCompatibility();
            };

            /**
            * Applies the calculated time delta to the active animation state node or state transition object.
            */
            SkeletonAnimator.prototype._pUpdateDeltaTime = function (dt) {
                _super.prototype._pUpdateDeltaTime.call(this, dt);

                //invalidate pose matrices
                this._globalPropertiesDirty = true;

                //trigger geometry invalidation if using CPU animation
                if (this._pAnimationSet.usesCPU)
                    for (var key in this._morphedSubGeometryDirty)
                        this._morphedSubGeometryDirty[key] = true;
            };

            SkeletonAnimator.prototype.updateCondensedMatrices = function (condensedIndexLookUp /*uint*/ , numJoints /*uint*/ ) {
                var i = 0, j = 0;
                var len;
                var srcIndex;

                this._condensedMatrices = new Array();

                do {
                    srcIndex = condensedIndexLookUp[i] * 4;
                    len = srcIndex + 12;

                    while (srcIndex < len)
                        this._condensedMatrices[j++] = this._globalMatrices[srcIndex++];
                } while(++i < numJoints);
            };

            SkeletonAnimator.prototype.updateGlobalProperties = function () {
                this._globalPropertiesDirty = false;

                //get global pose
                this.localToGlobalPose(this._activeSkeletonState.getSkeletonPose(this._skeleton), this._globalPose, this._skeleton);

                // convert pose to matrix
                var mtxOffset = 0;
                var globalPoses = this._globalPose.jointPoses;
                var raw;
                var ox, oy, oz, ow;
                var xy2, xz2, xw2;
                var yz2, yw2, zw2;
                var n11, n12, n13;
                var n21, n22, n23;
                var n31, n32, n33;
                var m11, m12, m13, m14;
                var m21, m22, m23, m24;
                var m31, m32, m33, m34;
                var joints = this._skeleton.joints;
                var pose;
                var quat;
                var vec;
                var t;

                for (var i = 0; i < this._numJoints; ++i) {
                    pose = globalPoses[i];
                    quat = pose.orientation;
                    vec = pose.translation;
                    ox = quat.x;
                    oy = quat.y;
                    oz = quat.z;
                    ow = quat.w;

                    xy2 = (t = 2.0 * ox) * oy;
                    xz2 = t * oz;
                    xw2 = t * ow;
                    yz2 = (t = 2.0 * oy) * oz;
                    yw2 = t * ow;
                    zw2 = 2.0 * oz * ow;

                    yz2 = 2.0 * oy * oz;
                    yw2 = 2.0 * oy * ow;
                    zw2 = 2.0 * oz * ow;
                    ox *= ox;
                    oy *= oy;
                    oz *= oz;
                    ow *= ow;

                    n11 = (t = ox - oy) - oz + ow;
                    n12 = xy2 - zw2;
                    n13 = xz2 + yw2;
                    n21 = xy2 + zw2;
                    n22 = -t - oz + ow;
                    n23 = yz2 - xw2;
                    n31 = xz2 - yw2;
                    n32 = yz2 + xw2;
                    n33 = -ox - oy + oz + ow;

                    // prepend inverse bind pose
                    raw = joints[i].inverseBindPose;
                    m11 = raw[0];
                    m12 = raw[4];
                    m13 = raw[8];
                    m14 = raw[12];
                    m21 = raw[1];
                    m22 = raw[5];
                    m23 = raw[9];
                    m24 = raw[13];
                    m31 = raw[2];
                    m32 = raw[6];
                    m33 = raw[10];
                    m34 = raw[14];

                    this._globalMatrices[mtxOffset] = n11 * m11 + n12 * m21 + n13 * m31;
                    this._globalMatrices[mtxOffset + 1] = n11 * m12 + n12 * m22 + n13 * m32;
                    this._globalMatrices[mtxOffset + 2] = n11 * m13 + n12 * m23 + n13 * m33;
                    this._globalMatrices[mtxOffset + 3] = n11 * m14 + n12 * m24 + n13 * m34 + vec.x;
                    this._globalMatrices[mtxOffset + 4] = n21 * m11 + n22 * m21 + n23 * m31;
                    this._globalMatrices[mtxOffset + 5] = n21 * m12 + n22 * m22 + n23 * m32;
                    this._globalMatrices[mtxOffset + 6] = n21 * m13 + n22 * m23 + n23 * m33;
                    this._globalMatrices[mtxOffset + 7] = n21 * m14 + n22 * m24 + n23 * m34 + vec.y;
                    this._globalMatrices[mtxOffset + 8] = n31 * m11 + n32 * m21 + n33 * m31;
                    this._globalMatrices[mtxOffset + 9] = n31 * m12 + n32 * m22 + n33 * m32;
                    this._globalMatrices[mtxOffset + 10] = n31 * m13 + n32 * m23 + n33 * m33;
                    this._globalMatrices[mtxOffset + 11] = n31 * m14 + n32 * m24 + n33 * m34 + vec.z;

                    mtxOffset = mtxOffset + 12;
                }
            };

            SkeletonAnimator.prototype.getRenderableSubGeometry = function (renderable, sourceSubGeometry) {
                this._morphedSubGeometryDirty[sourceSubGeometry.id] = true;

                //early out for GPU animations
                if (!this._pAnimationSet.usesCPU)
                    return sourceSubGeometry;

                var targetSubGeometry;

                if (!(targetSubGeometry = this._morphedSubGeometry[sourceSubGeometry.id])) {
                    //not yet stored
                    targetSubGeometry = this._morphedSubGeometry[sourceSubGeometry.id] = sourceSubGeometry.clone();

                    //turn off auto calculations on the morphed geometry
                    targetSubGeometry.autoDeriveNormals = false;
                    targetSubGeometry.autoDeriveTangents = false;
                    targetSubGeometry.autoDeriveUVs = false;

                    //add event listeners for any changes in UV values on the source geometry
                    sourceSubGeometry.addEventListener(away.events.SubGeometryEvent.INDICES_UPDATED, this._onIndicesUpdateDelegate);
                    sourceSubGeometry.addEventListener(away.events.SubGeometryEvent.VERTICES_UPDATED, this._onVerticesUpdateDelegate);
                }

                return targetSubGeometry;
            };

            /**
            * If the animation can't be performed on GPU, transform vertices manually
            * @param subGeom The subgeometry containing the weights and joint index data per vertex.
            * @param pass The material pass for which we need to transform the vertices
            */
            SkeletonAnimator.prototype.morphSubGeometry = function (renderable, sourceSubGeometry) {
                this._morphedSubGeometryDirty[sourceSubGeometry.id] = false;

                var sourcePositions = sourceSubGeometry.positions;
                var sourceNormals = sourceSubGeometry.vertexNormals;
                var sourceTangents = sourceSubGeometry.vertexTangents;

                var jointIndices = sourceSubGeometry.jointIndices;
                var jointWeights = sourceSubGeometry.jointWeights;

                var targetSubGeometry = this._morphedSubGeometry[sourceSubGeometry.id];

                var targetPositions = targetSubGeometry.positions;
                var targetNormals = targetSubGeometry.vertexNormals;
                var targetTangents = targetSubGeometry.vertexTangents;

                var index = 0;
                var j = 0;
                var k;
                var vx, vy, vz;
                var nx, ny, nz;
                var tx, ty, tz;
                var len = sourcePositions.length;
                var weight;
                var vertX, vertY, vertZ;
                var normX, normY, normZ;
                var tangX, tangY, tangZ;
                var m11, m12, m13, m14;
                var m21, m22, m23, m24;
                var m31, m32, m33, m34;

                while (index < len) {
                    vertX = sourcePositions[index];
                    vertY = sourcePositions[index + 1];
                    vertZ = sourcePositions[index + 2];
                    normX = sourceNormals[index];
                    normY = sourceNormals[index + 1];
                    normZ = sourceNormals[index + 2];
                    tangX = sourceTangents[index];
                    tangY = sourceTangents[index + 1];
                    tangZ = sourceTangents[index + 2];
                    vx = 0;
                    vy = 0;
                    vz = 0;
                    nx = 0;
                    ny = 0;
                    nz = 0;
                    tx = 0;
                    ty = 0;
                    tz = 0;
                    k = 0;
                    while (k < this._jointsPerVertex) {
                        weight = jointWeights[j];
                        if (weight > 0) {
                            // implicit /3*12 (/3 because indices are multiplied by 3 for gpu matrix access, *12 because it's the matrix size)
                            var mtxOffset = jointIndices[j++] << 2;
                            m11 = this._globalMatrices[mtxOffset];
                            m12 = this._globalMatrices[mtxOffset + 1];
                            m13 = this._globalMatrices[mtxOffset + 2];
                            m14 = this._globalMatrices[mtxOffset + 3];
                            m21 = this._globalMatrices[mtxOffset + 4];
                            m22 = this._globalMatrices[mtxOffset + 5];
                            m23 = this._globalMatrices[mtxOffset + 6];
                            m24 = this._globalMatrices[mtxOffset + 7];
                            m31 = this._globalMatrices[mtxOffset + 8];
                            m32 = this._globalMatrices[mtxOffset + 9];
                            m33 = this._globalMatrices[mtxOffset + 10];
                            m34 = this._globalMatrices[mtxOffset + 11];
                            vx += weight * (m11 * vertX + m12 * vertY + m13 * vertZ + m14);
                            vy += weight * (m21 * vertX + m22 * vertY + m23 * vertZ + m24);
                            vz += weight * (m31 * vertX + m32 * vertY + m33 * vertZ + m34);
                            nx += weight * (m11 * normX + m12 * normY + m13 * normZ);
                            ny += weight * (m21 * normX + m22 * normY + m23 * normZ);
                            nz += weight * (m31 * normX + m32 * normY + m33 * normZ);
                            tx += weight * (m11 * tangX + m12 * tangY + m13 * tangZ);
                            ty += weight * (m21 * tangX + m22 * tangY + m23 * tangZ);
                            tz += weight * (m31 * tangX + m32 * tangY + m33 * tangZ);
                            ++k;
                        } else {
                            j += (this._jointsPerVertex - k);
                            k = this._jointsPerVertex;
                        }
                    }

                    targetPositions[index] = vx;
                    targetPositions[index + 1] = vy;
                    targetPositions[index + 2] = vz;
                    targetNormals[index] = nx;
                    targetNormals[index + 1] = ny;
                    targetNormals[index + 2] = nz;
                    targetTangents[index] = tx;
                    targetTangents[index + 1] = ty;
                    targetTangents[index + 2] = tz;

                    index += 3;
                }

                targetSubGeometry.updatePositions(targetPositions);
                targetSubGeometry.updateVertexNormals(targetNormals);
                targetSubGeometry.updateVertexTangents(targetTangents);
            };

            /**
            * Converts a local hierarchical skeleton pose to a global pose
            * @param targetPose The SkeletonPose object that will contain the global pose.
            * @param skeleton The skeleton containing the joints, and as such, the hierarchical data to transform to global poses.
            */
            SkeletonAnimator.prototype.localToGlobalPose = function (sourcePose, targetPose, skeleton) {
                var globalPoses = targetPose.jointPoses;
                var globalJointPose;
                var joints = skeleton.joints;
                var len = sourcePose.numJointPoses;
                var jointPoses = sourcePose.jointPoses;
                var parentIndex;
                var joint;
                var parentPose;
                var pose;
                var or;
                var tr;
                var t;
                var q;

                var x1, y1, z1, w1;
                var x2, y2, z2, w2;
                var x3, y3, z3;

                // :s
                if (globalPoses.length != len)
                    globalPoses.length = len;

                for (var i = 0; i < len; ++i) {
                    globalJointPose = globalPoses[i];

                    if (globalJointPose == null)
                        globalJointPose = globalPoses[i] = new animators.JointPose();

                    joint = joints[i];
                    parentIndex = joint.parentIndex;
                    pose = jointPoses[i];

                    q = globalJointPose.orientation;
                    t = globalJointPose.translation;

                    if (parentIndex < 0) {
                        tr = pose.translation;
                        or = pose.orientation;
                        q.x = or.x;
                        q.y = or.y;
                        q.z = or.z;
                        q.w = or.w;
                        t.x = tr.x;
                        t.y = tr.y;
                        t.z = tr.z;
                    } else {
                        // append parent pose
                        parentPose = globalPoses[parentIndex];

                        // rotate point
                        or = parentPose.orientation;
                        tr = pose.translation;
                        x2 = or.x;
                        y2 = or.y;
                        z2 = or.z;
                        w2 = or.w;
                        x3 = tr.x;
                        y3 = tr.y;
                        z3 = tr.z;

                        w1 = -x2 * x3 - y2 * y3 - z2 * z3;
                        x1 = w2 * x3 + y2 * z3 - z2 * y3;
                        y1 = w2 * y3 - x2 * z3 + z2 * x3;
                        z1 = w2 * z3 + x2 * y3 - y2 * x3;

                        // append parent translation
                        tr = parentPose.translation;
                        t.x = -w1 * x2 + x1 * w2 - y1 * z2 + z1 * y2 + tr.x;
                        t.y = -w1 * y2 + x1 * z2 + y1 * w2 - z1 * x2 + tr.y;
                        t.z = -w1 * z2 - x1 * y2 + y1 * x2 + z1 * w2 + tr.z;

                        // append parent orientation
                        x1 = or.x;
                        y1 = or.y;
                        z1 = or.z;
                        w1 = or.w;
                        or = pose.orientation;
                        x2 = or.x;
                        y2 = or.y;
                        z2 = or.z;
                        w2 = or.w;

                        q.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
                        q.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
                        q.y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
                        q.z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;
                    }
                }
            };

            SkeletonAnimator.prototype.onTransitionComplete = function (event) {
                if (event.type == AnimationStateEvent.TRANSITION_COMPLETE) {
                    event.animationNode.removeEventListener(AnimationStateEvent.TRANSITION_COMPLETE, this._onTransitionCompleteDelegate);

                    //if this is the current active state transition, revert control to the active node
                    if (this._pActiveState == event.animationState) {
                        this._pActiveNode = this._pAnimationSet.getAnimation(this._pActiveAnimationName);
                        this._pActiveState = this.getAnimationState(this._pActiveNode);
                        this._activeSkeletonState = this._pActiveState;
                    }
                }
            };

            SkeletonAnimator.prototype.onIndicesUpdate = function (event) {
                var subGeometry = event.target;

                this._morphedSubGeometry[subGeometry.id].updateIndices(subGeometry.indices);
            };

            SkeletonAnimator.prototype.onVerticesUpdate = function (event) {
                var subGeometry = event.target;
                var morphGeometry = this._morphedSubGeometry[subGeometry.id];

                switch (event.dataType) {
                    case TriangleSubGeometry.UV_DATA:
                        morphGeometry.updateUVs(subGeometry.uvs);
                    case TriangleSubGeometry.SECONDARY_UV_DATA:
                        morphGeometry.updateUVs(subGeometry.secondaryUVs);
                }
            };
            return SkeletonAnimator;
        })(animators.AnimatorBase);
        animators.SkeletonAnimator = SkeletonAnimator;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * The animation data set used by skeleton-based animators, containing skeleton animation data.
        *
        * @see away.animators.SkeletonAnimator
        */
        var SkeletonAnimationSet = (function (_super) {
            __extends(SkeletonAnimationSet, _super);
            /**
            * Creates a new <code>SkeletonAnimationSet</code> object.
            *
            * @param jointsPerVertex Sets the amount of skeleton joints that can be linked to a single vertex via skinned weight values. For GPU-base animation, the maximum allowed value is 4. Defaults to 4.
            */
            function SkeletonAnimationSet(jointsPerVertex) {
                if (typeof jointsPerVertex === "undefined") { jointsPerVertex = 4; }
                _super.call(this);

                this._jointsPerVertex = jointsPerVertex;
            }
            Object.defineProperty(SkeletonAnimationSet.prototype, "jointsPerVertex", {
                /**
                * Returns the amount of skeleton joints that can be linked to a single vertex via skinned weight values. For GPU-base animation, the
                * maximum allowed value is 4.
                */
                get: function () {
                    return this._jointsPerVertex;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * @inheritDoc
            */
            SkeletonAnimationSet.prototype.getAGALVertexCode = function (shaderObject) {
                var len = shaderObject.animatableAttributes.length;

                var indexOffset0 = shaderObject.numUsedVertexConstants;
                var indexOffset1 = indexOffset0 + 1;
                var indexOffset2 = indexOffset0 + 2;
                var indexStream = "va" + shaderObject.numUsedStreams;
                var weightStream = "va" + (shaderObject.numUsedStreams + 1);
                var indices = [indexStream + ".x", indexStream + ".y", indexStream + ".z", indexStream + ".w"];
                var weights = [weightStream + ".x", weightStream + ".y", weightStream + ".z", weightStream + ".w"];
                var temp1 = this._pFindTempReg(shaderObject.animationTargetRegisters);
                var temp2 = this._pFindTempReg(shaderObject.animationTargetRegisters, temp1);
                var dot = "dp4";
                var code = "";

                for (var i = 0; i < len; ++i) {
                    var src = shaderObject.animatableAttributes[i];

                    for (var j = 0; j < this._jointsPerVertex; ++j) {
                        code += dot + " " + temp1 + ".x, " + src + ", vc[" + indices[j] + "+" + indexOffset0 + "]\n" + dot + " " + temp1 + ".y, " + src + ", vc[" + indices[j] + "+" + indexOffset1 + "]\n" + dot + " " + temp1 + ".z, " + src + ", vc[" + indices[j] + "+" + indexOffset2 + "]\n" + "mov " + temp1 + ".w, " + src + ".w\n" + "mul " + temp1 + ", " + temp1 + ", " + weights[j] + "\n"; // apply weight

                        // add or mov to target. Need to write to a temp reg first, because an output can be a target
                        if (j == 0)
                            code += "mov " + temp2 + ", " + temp1 + "\n";
                        else
                            code += "add " + temp2 + ", " + temp2 + ", " + temp1 + "\n";
                    }

                    // switch to dp3 once positions have been transformed, from now on, it should only be vectors instead of points
                    dot = "dp3";
                    code += "mov " + shaderObject.animationTargetRegisters[i] + ", " + temp2 + "\n";
                }

                return code;
            };

            /**
            * @inheritDoc
            */
            SkeletonAnimationSet.prototype.activate = function (shaderObject, stage) {
            };

            /**
            * @inheritDoc
            */
            SkeletonAnimationSet.prototype.deactivate = function (shaderObject, stage) {
                //			var streamOffset:number /*uint*/ = pass.numUsedStreams;
                //			var context:IContextStageGL = <IContextStageGL> stage.context;
                //			context.setVertexBufferAt(streamOffset, null);
                //			context.setVertexBufferAt(streamOffset + 1, null);
            };

            /**
            * @inheritDoc
            */
            SkeletonAnimationSet.prototype.getAGALFragmentCode = function (shaderObject, shadedTarget) {
                return "";
            };

            /**
            * @inheritDoc
            */
            SkeletonAnimationSet.prototype.getAGALUVCode = function (shaderObject) {
                return "mov " + shaderObject.uvTarget + "," + shaderObject.uvSource + "\n";
            };

            /**
            * @inheritDoc
            */
            SkeletonAnimationSet.prototype.doneAGALCode = function (shaderObject) {
            };
            return SkeletonAnimationSet;
        })(animators.AnimationSetBase);
        animators.SkeletonAnimationSet = SkeletonAnimationSet;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        /**
        * The animation data set used by vertex-based animators, containing vertex animation state data.
        *
        * @see away.animators.VertexAnimator
        */
        var VertexAnimationSet = (function (_super) {
            __extends(VertexAnimationSet, _super);
            /**
            * Returns whether or not normal data is used in last set GPU pass of the vertex shader.
            */
            //		public get useNormals():boolean
            //		{
            //			return this._uploadNormals;
            //		}
            /**
            * Creates a new <code>VertexAnimationSet</code> object.
            *
            * @param numPoses The number of poses made available at once to the GPU animation code.
            * @param blendMode Optional value for setting the animation mode of the vertex animator object.
            *
            * @see away3d.animators.data.VertexAnimationMode
            */
            function VertexAnimationSet(numPoses, blendMode) {
                if (typeof numPoses === "undefined") { numPoses = 2; }
                if (typeof blendMode === "undefined") { blendMode = "absolute"; }
                _super.call(this);
                this._numPoses = numPoses;
                this._blendMode = blendMode;
            }
            Object.defineProperty(VertexAnimationSet.prototype, "numPoses", {
                /**
                * Returns the number of poses made available at once to the GPU animation code.
                */
                get: function () {
                    return this._numPoses;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(VertexAnimationSet.prototype, "blendMode", {
                /**
                * Returns the active blend mode of the vertex animator object.
                */
                get: function () {
                    return this._blendMode;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * @inheritDoc
            */
            VertexAnimationSet.prototype.getAGALVertexCode = function (shaderObject) {
                if (this._blendMode == away.animators.VertexAnimationMode.ABSOLUTE)
                    return this.getAbsoluteAGALCode(shaderObject);
                else
                    return this.getAdditiveAGALCode(shaderObject);
            };

            /**
            * @inheritDoc
            */
            VertexAnimationSet.prototype.activate = function (shaderObject, stage) {
                //			var uID:number = pass._iUniqueId;
                //			this._uploadNormals = <boolean> this._useNormals[uID];
                //			this._uploadTangents = <boolean> this._useTangents[uID];
            };

            /**
            * @inheritDoc
            */
            VertexAnimationSet.prototype.deactivate = function (shaderObject, stage) {
                //			var uID:number = pass._iUniqueId;
                //			var index:number /*uint*/ = this._streamIndices[uID];
                //			var context:IContextStageGL = <IContextStageGL> stage.context;
                //			context.setVertexBufferAt(index, null);
                //			if (this._uploadNormals)
                //				context.setVertexBufferAt(index + 1, null);
                //			if (this._uploadTangents)
                //				context.setVertexBufferAt(index + 2, null);
            };

            /**
            * @inheritDoc
            */
            VertexAnimationSet.prototype.getAGALFragmentCode = function (shaderObject, shadedTarget) {
                return "";
            };

            /**
            * @inheritDoc
            */
            VertexAnimationSet.prototype.getAGALUVCode = function (shaderObject) {
                return "mov " + shaderObject.uvTarget + "," + shaderObject.uvSource + "\n";
            };

            /**
            * @inheritDoc
            */
            VertexAnimationSet.prototype.doneAGALCode = function (shaderObject) {
            };

            /**
            * Generates the vertex AGAL code for absolute blending.
            */
            VertexAnimationSet.prototype.getAbsoluteAGALCode = function (shaderObject) {
                var code = "";
                var temp1 = this._pFindTempReg(shaderObject.animationTargetRegisters);
                var temp2 = this._pFindTempReg(shaderObject.animationTargetRegisters, temp1);
                var regs = new Array("x", "y", "z", "w");
                var len = shaderObject.animatableAttributes.length;
                var constantReg = "vc" + shaderObject.numUsedVertexConstants;

                if (len > 2)
                    len = 2;
                var streamIndex = shaderObject.numUsedStreams;

                for (var i = 0; i < len; ++i) {
                    code += "mul " + temp1 + ", " + shaderObject.animatableAttributes[i] + ", " + constantReg + "." + regs[0] + "\n";

                    for (var j = 1; j < this._numPoses; ++j) {
                        code += "mul " + temp2 + ", va" + streamIndex + ", " + constantReg + "." + regs[j] + "\n";

                        if (j < this._numPoses - 1)
                            code += "add " + temp1 + ", " + temp1 + ", " + temp2 + "\n";

                        ++streamIndex;
                    }

                    code += "add " + shaderObject.animationTargetRegisters[i] + ", " + temp1 + ", " + temp2 + "\n";
                }

                // add code for bitangents if tangents are used
                if (shaderObject.tangentDependencies > 0 || shaderObject.outputsNormals) {
                    code += "dp3 " + temp1 + ".x, " + shaderObject.animatableAttributes[2] + ", " + shaderObject.animationTargetRegisters[1] + "\n" + "mul " + temp1 + ", " + shaderObject.animationTargetRegisters[1] + ", " + temp1 + ".x\n" + "sub " + shaderObject.animationTargetRegisters[2] + ", " + shaderObject.animationTargetRegisters[2] + ", " + temp1 + "\n";
                }
                return code;
            };

            /**
            * Generates the vertex AGAL code for additive blending.
            */
            VertexAnimationSet.prototype.getAdditiveAGALCode = function (shaderObject) {
                var code = "";
                var len = shaderObject.animatableAttributes.length;
                var regs = ["x", "y", "z", "w"];
                var temp1 = this._pFindTempReg(shaderObject.animationTargetRegisters);
                var k;

                var streamIndex = shaderObject.numUsedStreams;

                if (len > 2)
                    len = 2;

                code += "mov  " + shaderObject.animationTargetRegisters[0] + ", " + shaderObject.animatableAttributes[0] + "\n";
                if (shaderObject.normalDependencies > 0)
                    code += "mov " + shaderObject.animationTargetRegisters[1] + ", " + shaderObject.animatableAttributes[1] + "\n";

                for (var i = 0; i < len; ++i) {
                    for (var j = 0; j < this._numPoses; ++j) {
                        code += "mul " + temp1 + ", va" + (streamIndex + k) + ", vc" + shaderObject.numUsedVertexConstants + "." + regs[j] + "\n" + "add " + shaderObject.animationTargetRegisters[i] + ", " + shaderObject.animationTargetRegisters[i] + ", " + temp1 + "\n";
                        k++;
                    }
                }

                if (shaderObject.tangentDependencies > 0 || shaderObject.outputsNormals) {
                    code += "dp3 " + temp1 + ".x, " + shaderObject.animatableAttributes[2] + ", " + shaderObject.animationTargetRegisters[1] + "\n" + "mul " + temp1 + ", " + shaderObject.animationTargetRegisters[1] + ", " + temp1 + ".x\n" + "sub " + shaderObject.animationTargetRegisters[2] + ", " + shaderObject.animatableAttributes[2] + ", " + temp1 + "\n";
                }

                return code;
            };
            return VertexAnimationSet;
        })(animators.AnimationSetBase);
        animators.VertexAnimationSet = VertexAnimationSet;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (animators) {
        var TriangleSubGeometry = away.base.TriangleSubGeometry;

        var VertexDataPool = away.pool.VertexDataPool;

        /**
        * Provides an interface for assigning vertex-based animation data sets to mesh-based entity objects
        * and controlling the various available states of animation through an interative playhead that can be
        * automatically updated or manually triggered.
        */
        var VertexAnimator = (function (_super) {
            __extends(VertexAnimator, _super);
            /**
            * Creates a new <code>VertexAnimator</code> object.
            *
            * @param vertexAnimationSet The animation data set containing the vertex animations used by the animator.
            */
            function VertexAnimator(vertexAnimationSet) {
                _super.call(this, vertexAnimationSet);
                this._poses = new Array();
                this._weights = Array(1, 0, 0, 0);

                this._vertexAnimationSet = vertexAnimationSet;
                this._numPoses = vertexAnimationSet.numPoses;
                this._blendMode = vertexAnimationSet.blendMode;
            }
            /**
            * @inheritDoc
            */
            VertexAnimator.prototype.clone = function () {
                return new VertexAnimator(this._vertexAnimationSet);
            };

            /**
            * Plays a sequence with a given name. If the sequence is not found, it may not be loaded yet, and it will retry every frame.
            * @param sequenceName The name of the clip to be played.
            */
            VertexAnimator.prototype.play = function (name, transition, offset) {
                if (typeof transition === "undefined") { transition = null; }
                if (typeof offset === "undefined") { offset = NaN; }
                if (this._pActiveAnimationName == name)
                    return;

                this._pActiveAnimationName = name;

                //TODO: implement transitions in vertex animator
                if (!this._pAnimationSet.hasAnimation(name))
                    throw new Error("Animation root node " + name + " not found!");

                this._pActiveNode = this._pAnimationSet.getAnimation(name);

                this._pActiveState = this.getAnimationState(this._pActiveNode);

                if (this.updatePosition) {
                    //update straight away to reset position deltas
                    this._pActiveState.update(this._pAbsoluteTime);
                    this._pActiveState.positionDelta;
                }

                this._activeVertexState = this._pActiveState;

                this.start();

                //apply a time offset if specified
                if (!isNaN(offset))
                    this.reset(name, offset);
            };

            /**
            * @inheritDoc
            */
            VertexAnimator.prototype._pUpdateDeltaTime = function (dt) {
                _super.prototype._pUpdateDeltaTime.call(this, dt);

                var geometryFlag = false;

                if (this._poses[0] != this._activeVertexState.currentGeometry) {
                    this._poses[0] = this._activeVertexState.currentGeometry;
                    geometryFlag = true;
                }

                if (this._poses[1] != this._activeVertexState.nextGeometry) {
                    this._poses[1] = this._activeVertexState.nextGeometry;
                    geometryFlag = true;
                }

                this._weights[0] = 1 - (this._weights[1] = this._activeVertexState.blendWeight);

                if (geometryFlag) {
                    //invalidate meshes
                    var mesh;
                    var len = this._pOwners.length;
                    for (var i = 0; i < len; i++) {
                        mesh = this._pOwners[i];
                        mesh._iInvalidateRenderableGeometries();
                    }
                }
            };

            /**
            * @inheritDoc
            */
            VertexAnimator.prototype.setRenderState = function (shaderObject, renderable, stage, camera, vertexConstantOffset /*int*/ , vertexStreamOffset /*int*/ ) {
                // todo: add code for when running on cpu
                // if no poses defined, set temp data
                if (!this._poses.length) {
                    this.setNullPose(shaderObject, renderable, stage, vertexConstantOffset, vertexStreamOffset);
                    return;
                }

                // this type of animation can only be SubMesh
                var subMesh = renderable.subMesh;
                var subGeom;
                var i;
                var len = this._numPoses;

                stage.context.setProgramConstantsFromArray(away.stagegl.ContextGLProgramType.VERTEX, vertexConstantOffset, this._weights, 1);

                if (this._blendMode == animators.VertexAnimationMode.ABSOLUTE)
                    i = 1;
                else
                    i = 0;

                for (; i < len; ++i) {
                    subGeom = this._poses[i].subGeometries[subMesh._iIndex] || subMesh.subGeometry;

                    stage.context.activateBuffer(vertexStreamOffset++, VertexDataPool.getItem(subGeom, renderable.getIndexData(), TriangleSubGeometry.POSITION_DATA), subGeom.getOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);

                    if (shaderObject.normalDependencies > 0)
                        stage.context.activateBuffer(vertexStreamOffset++, VertexDataPool.getItem(subGeom, renderable.getIndexData(), TriangleSubGeometry.NORMAL_DATA), subGeom.getOffset(TriangleSubGeometry.NORMAL_DATA), TriangleSubGeometry.NORMAL_FORMAT);
                }
            };

            VertexAnimator.prototype.setNullPose = function (shaderObject, renderable, stage, vertexConstantOffset /*int*/ , vertexStreamOffset /*int*/ ) {
                stage.context.setProgramConstantsFromArray(away.stagegl.ContextGLProgramType.VERTEX, vertexConstantOffset, this._weights, 1);

                if (this._blendMode == animators.VertexAnimationMode.ABSOLUTE) {
                    var len = this._numPoses;
                    for (var i = 1; i < len; ++i) {
                        stage.context.activateBuffer(vertexStreamOffset++, renderable.getVertexData(TriangleSubGeometry.POSITION_DATA), renderable.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);

                        if (shaderObject.normalDependencies > 0)
                            stage.context.activateBuffer(vertexStreamOffset++, renderable.getVertexData(TriangleSubGeometry.NORMAL_DATA), renderable.getVertexOffset(TriangleSubGeometry.NORMAL_DATA), TriangleSubGeometry.NORMAL_FORMAT);
                    }
                }
                // todo: set temp data for additive?
            };

            /**
            * Verifies if the animation will be used on cpu. Needs to be true for all passes for a material to be able to use it on gpu.
            * Needs to be called if gpu code is potentially required.
            */
            VertexAnimator.prototype.testGPUCompatibility = function (shaderObject) {
            };

            VertexAnimator.prototype.getRenderableSubGeometry = function (renderable, sourceSubGeometry) {
                if (this._blendMode == animators.VertexAnimationMode.ABSOLUTE && this._poses.length)
                    return this._poses[0].subGeometries[renderable.subMesh._iIndex] || sourceSubGeometry;

                //nothing to do here
                return sourceSubGeometry;
            };
            return VertexAnimator;
        })(animators.AnimatorBase);
        animators.VertexAnimator = VertexAnimator;
    })(away.animators || (away.animators = {}));
    var animators = away.animators;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (parsers) {
        var TriangleSubGeometry = away.base.TriangleSubGeometry;
        var Mesh = away.entities.Mesh;
        var DefaultMaterialManager = away.materials.DefaultMaterialManager;
        var BasicSpecularMethod = away.materials.SpecularBasicMethod;
        var TriangleMethodMaterial = away.materials.TriangleMethodMaterial;
        var TriangleMaterialMode = away.materials.TriangleMaterialMode;
        var URLLoaderDataFormat = away.net.URLLoaderDataFormat;

        /**
        * OBJParser provides a parser for the OBJ data type.
        */
        var OBJParser = (function (_super) {
            __extends(OBJParser, _super);
            /**
            * Creates a new OBJParser object.
            * @param uri The url or id of the data or file to be parsed.
            * @param extra The holder for extra contextual data that the parser might need.
            */
            function OBJParser(scale) {
                if (typeof scale === "undefined") { scale = 1; }
                _super.call(this, URLLoaderDataFormat.TEXT);
                this._mtlLibLoaded = true;
                this._activeMaterialID = "";
                this._scale = scale;
            }
            Object.defineProperty(OBJParser.prototype, "scale", {
                /**
                * Scaling factor applied directly to vertices data
                * @param value The scaling factor.
                */
                set: function (value) {
                    this._scale = value;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Indicates whether or not a given file extension is supported by the parser.
            * @param extension The file extension of a potential file to be parsed.
            * @return Whether or not the given file type is supported.
            */
            OBJParser.supportsType = function (extension) {
                extension = extension.toLowerCase();
                return extension == "obj";
            };

            /**
            * Tests whether a data block can be parsed by the parser.
            * @param data The data block to potentially be parsed.
            * @return Whether or not the given data is supported.
            */
            OBJParser.supportsData = function (data) {
                var content = parsers.ParserUtils.toString(data);
                var hasV = false;
                var hasF = false;

                if (content) {
                    hasV = content.indexOf("\nv ") != -1;
                    hasF = content.indexOf("\nf ") != -1;
                }

                return hasV && hasF;
            };

            /**
            * @inheritDoc
            */
            OBJParser.prototype._iResolveDependency = function (resourceDependency) {
                if (resourceDependency.id == 'mtl') {
                    var str = parsers.ParserUtils.toString(resourceDependency.data);
                    this.parseMtl(str);
                } else {
                    var asset;

                    if (resourceDependency.assets.length != 1) {
                        return;
                    }

                    asset = resourceDependency.assets[0];

                    if (asset.assetType == away.library.AssetType.TEXTURE) {
                        var lm = new LoadedMaterial();
                        lm.materialID = resourceDependency.id;
                        lm.texture = asset;

                        this._materialLoaded.push(lm);

                        if (this._meshes.length > 0) {
                            this.applyMaterial(lm);
                        }
                    }
                }
            };

            /**
            * @inheritDoc
            */
            OBJParser.prototype._iResolveDependencyFailure = function (resourceDependency) {
                if (resourceDependency.id == "mtl") {
                    this._mtlLib = false;
                    this._mtlLibLoaded = false;
                } else {
                    var lm = new LoadedMaterial();
                    lm.materialID = resourceDependency.id;
                    this._materialLoaded.push(lm);
                }

                if (this._meshes.length > 0)
                    this.applyMaterial(lm);
            };

            /**
            * @inheritDoc
            */
            OBJParser.prototype._pProceedParsing = function () {
                var line;
                var creturn = String.fromCharCode(10);
                var trunk;

                if (!this._startedParsing) {
                    this._textData = this._pGetTextData();

                    // Merge linebreaks that are immediately preceeded by
                    // the "escape" backward slash into single lines.
                    this._textData = this._textData.replace(/\\[\r\n]+\s*/gm, ' ');
                }

                if (this._textData.indexOf(creturn) == -1)
                    creturn = String.fromCharCode(13);

                if (!this._startedParsing) {
                    this._startedParsing = true;
                    this._vertices = new Array();
                    this._vertexNormals = new Array();
                    this._materialIDs = new Array();
                    this._materialLoaded = new Array();
                    this._meshes = new Array();
                    this._uvs = new Array();
                    this._stringLength = this._textData.length;
                    this._charIndex = this._textData.indexOf(creturn, 0);
                    this._oldIndex = 0;
                    this._objects = new Array();
                    this._objectIndex = 0;
                }

                while (this._charIndex < this._stringLength && this._pHasTime()) {
                    this._charIndex = this._textData.indexOf(creturn, this._oldIndex);

                    if (this._charIndex == -1)
                        this._charIndex = this._stringLength;

                    line = this._textData.substring(this._oldIndex, this._charIndex);
                    line = line.split('\r').join("");
                    line = line.replace("  ", " ");
                    trunk = line.split(" ");
                    this._oldIndex = this._charIndex + 1;
                    this.parseLine(trunk);

                    // If whatever was parsed on this line resulted in the
                    // parsing being paused to retrieve dependencies, break
                    // here and do not continue parsing until un-paused.
                    if (this.parsingPaused) {
                        return parsers.ParserBase.MORE_TO_PARSE;
                    }
                }

                if (this._charIndex >= this._stringLength) {
                    if (this._mtlLib && !this._mtlLibLoaded) {
                        return parsers.ParserBase.MORE_TO_PARSE;
                    }

                    this.translate();
                    this.applyMaterials();

                    return parsers.ParserBase.PARSING_DONE;
                }

                return parsers.ParserBase.MORE_TO_PARSE;
            };

            OBJParser.prototype._pStartParsing = function (frameLimit) {
                _super.prototype._pStartParsing.call(this, frameLimit);

                //create a content object for Loaders
                this._pContent = new away.containers.DisplayObjectContainer();
            };

            /**
            * Parses a single line in the OBJ file.
            */
            OBJParser.prototype.parseLine = function (trunk) {
                switch (trunk[0]) {
                    case "mtllib":
                        this._mtlLib = true;
                        this._mtlLibLoaded = false;
                        this.loadMtl(trunk[1]);

                        break;

                    case "g":
                        this.createGroup(trunk);

                        break;

                    case "o":
                        this.createObject(trunk);

                        break;

                    case "usemtl":
                        if (this._mtlLib) {
                            if (!trunk[1])
                                trunk[1] = "def000";

                            this._materialIDs.push(trunk[1]);
                            this._activeMaterialID = trunk[1];

                            if (this._currentGroup)
                                this._currentGroup.materialID = this._activeMaterialID;
                        }

                        break;

                    case "v":
                        this.parseVertex(trunk);

                        break;

                    case "vt":
                        this.parseUV(trunk);

                        break;

                    case "vn":
                        this.parseVertexNormal(trunk);

                        break;

                    case "f":
                        this.parseFace(trunk);
                }
            };

            /**
            * Converts the parsed data into an Away3D scenegraph structure
            */
            OBJParser.prototype.translate = function () {
                for (var objIndex = 0; objIndex < this._objects.length; ++objIndex) {
                    var groups = this._objects[objIndex].groups;
                    var numGroups = groups.length;
                    var materialGroups;
                    var numMaterialGroups;
                    var geometry;
                    var mesh;

                    var m;
                    var sm;
                    var bmMaterial;

                    for (var g = 0; g < numGroups; ++g) {
                        geometry = new away.base.Geometry();
                        materialGroups = groups[g].materialGroups;
                        numMaterialGroups = materialGroups.length;

                        for (m = 0; m < numMaterialGroups; ++m)
                            this.translateMaterialGroup(materialGroups[m], geometry);

                        if (geometry.subGeometries.length == 0)
                            continue;

                        // Finalize and force type-based name
                        this._pFinalizeAsset(geometry); //, "");

                        bmMaterial = new TriangleMethodMaterial(DefaultMaterialManager.getDefaultTexture());

                        //check for multipass
                        if (this.materialMode >= 2)
                            bmMaterial.materialMode = TriangleMaterialMode.MULTI_PASS;

                        mesh = new Mesh(geometry, bmMaterial);

                        if (this._objects[objIndex].name) {
                            // this is a full independent object ('o' tag in OBJ file)
                            mesh.name = this._objects[objIndex].name;
                        } else if (groups[g].name) {
                            // this is a group so the sub groups contain the actual mesh object names ('g' tag in OBJ file)
                            mesh.name = groups[g].name;
                        } else {
                            // No name stored. Use empty string which will force it
                            // to be overridden by finalizeAsset() to type default.
                            mesh.name = "";
                        }

                        this._meshes.push(mesh);

                        if (groups[g].materialID != "")
                            bmMaterial.name = groups[g].materialID + "~" + mesh.name;
                        else
                            bmMaterial.name = this._lastMtlID + "~" + mesh.name;

                        if (mesh.subMeshes.length > 1) {
                            for (sm = 1; sm < mesh.subMeshes.length; ++sm)
                                mesh.subMeshes[sm].material = bmMaterial;
                        }

                        //add to the content property
                        this._pContent.addChild(mesh);

                        this._pFinalizeAsset(mesh);
                    }
                }
            };

            /**
            * Translates an obj's material group to a subgeometry.
            * @param materialGroup The material group data to convert.
            * @param geometry The Geometry to contain the converted SubGeometry.
            */
            OBJParser.prototype.translateMaterialGroup = function (materialGroup, geometry) {
                var faces = materialGroup.faces;
                var face;
                var numFaces = faces.length;
                var numVerts;
                var sub;

                var vertices = new Array();
                var uvs = new Array();
                var normals = new Array();
                var indices = new Array();

                this._realIndices = [];
                this._vertexIndex = 0;

                var j;
                for (var i = 0; i < numFaces; ++i) {
                    face = faces[i];
                    numVerts = face.indexIds.length - 1;

                    for (j = 1; j < numVerts; ++j) {
                        this.translateVertexData(face, j, vertices, uvs, indices, normals);
                        this.translateVertexData(face, 0, vertices, uvs, indices, normals);
                        this.translateVertexData(face, j + 1, vertices, uvs, indices, normals);
                    }
                }
                if (vertices.length > 0) {
                    sub = new TriangleSubGeometry(true);
                    sub.autoDeriveNormals = normals.length ? false : true;
                    sub.updateIndices(indices);
                    sub.updatePositions(vertices);
                    sub.updateVertexNormals(normals);
                    sub.updateUVs(uvs);

                    geometry.addSubGeometry(sub);
                }
            };

            OBJParser.prototype.translateVertexData = function (face, vertexIndex, vertices, uvs, indices /*uint*/ , normals) {
                var index;
                var vertex;
                var vertexNormal;
                var uv;

                if (!this._realIndices[face.indexIds[vertexIndex]]) {
                    index = this._vertexIndex;
                    this._realIndices[face.indexIds[vertexIndex]] = ++this._vertexIndex;
                    vertex = this._vertices[face.vertexIndices[vertexIndex] - 1];
                    vertices.push(vertex.x * this._scale, vertex.y * this._scale, vertex.z * this._scale);

                    if (face.normalIndices.length > 0) {
                        vertexNormal = this._vertexNormals[face.normalIndices[vertexIndex] - 1];
                        normals.push(vertexNormal.x, vertexNormal.y, vertexNormal.z);
                    }

                    if (face.uvIndices.length > 0) {
                        try  {
                            uv = this._uvs[face.uvIndices[vertexIndex] - 1];
                            uvs.push(uv.u, uv.v);
                        } catch (e) {
                            switch (vertexIndex) {
                                case 0:
                                    uvs.push(0, 1);
                                    break;
                                case 1:
                                    uvs.push(.5, 0);
                                    break;
                                case 2:
                                    uvs.push(1, 1);
                            }
                        }
                    }
                } else {
                    index = this._realIndices[face.indexIds[vertexIndex]] - 1;
                }

                indices.push(index);
            };

            /**
            * Creates a new object group.
            * @param trunk The data block containing the object tag and its parameters
            */
            OBJParser.prototype.createObject = function (trunk) {
                this._currentGroup = null;
                this._currentMaterialGroup = null;
                this._objects.push(this._currentObject = new ObjectGroup());

                if (trunk)
                    this._currentObject.name = trunk[1];
            };

            /**
            * Creates a new group.
            * @param trunk The data block containing the group tag and its parameters
            */
            OBJParser.prototype.createGroup = function (trunk) {
                if (!this._currentObject)
                    this.createObject(null);
                this._currentGroup = new Group();

                this._currentGroup.materialID = this._activeMaterialID;

                if (trunk)
                    this._currentGroup.name = trunk[1];
                this._currentObject.groups.push(this._currentGroup);

                this.createMaterialGroup(null);
            };

            /**
            * Creates a new material group.
            * @param trunk The data block containing the material tag and its parameters
            */
            OBJParser.prototype.createMaterialGroup = function (trunk) {
                this._currentMaterialGroup = new MaterialGroup();
                if (trunk)
                    this._currentMaterialGroup.url = trunk[1];
                this._currentGroup.materialGroups.push(this._currentMaterialGroup);
            };

            /**
            * Reads the next vertex coordinates.
            * @param trunk The data block containing the vertex tag and its parameters
            */
            OBJParser.prototype.parseVertex = function (trunk) {
                //for the very rare cases of other delimiters/charcodes seen in some obj files
                var v1, v2, v3;
                if (trunk.length > 4) {
                    var nTrunk = [];
                    var val;

                    for (var i = 1; i < trunk.length; ++i) {
                        val = parseFloat(trunk[i]);
                        if (!isNaN(val))
                            nTrunk.push(val);
                    }

                    v1 = nTrunk[0];
                    v2 = nTrunk[1];
                    v3 = -nTrunk[2];
                    this._vertices.push(new Vertex(v1, v2, v3));
                } else {
                    v1 = parseFloat(trunk[1]);
                    v2 = parseFloat(trunk[2]);
                    v3 = -parseFloat(trunk[3]);

                    this._vertices.push(new Vertex(v1, v2, v3));
                }
            };

            /**
            * Reads the next uv coordinates.
            * @param trunk The data block containing the uv tag and its parameters
            */
            OBJParser.prototype.parseUV = function (trunk) {
                if (trunk.length > 3) {
                    var nTrunk = [];
                    var val;
                    for (var i = 1; i < trunk.length; ++i) {
                        val = parseFloat(trunk[i]);
                        if (!isNaN(val))
                            nTrunk.push(val);
                    }
                    this._uvs.push(new UV(nTrunk[0], 1 - nTrunk[1]));
                } else {
                    this._uvs.push(new UV(parseFloat(trunk[1]), 1 - parseFloat(trunk[2])));
                }
            };

            /**
            * Reads the next vertex normal coordinates.
            * @param trunk The data block containing the vertex normal tag and its parameters
            */
            OBJParser.prototype.parseVertexNormal = function (trunk) {
                if (trunk.length > 4) {
                    var nTrunk = [];
                    var val;
                    for (var i = 1; i < trunk.length; ++i) {
                        val = parseFloat(trunk[i]);
                        if (!isNaN(val))
                            nTrunk.push(val);
                    }
                    this._vertexNormals.push(new Vertex(nTrunk[0], nTrunk[1], -nTrunk[2]));
                } else {
                    this._vertexNormals.push(new Vertex(parseFloat(trunk[1]), parseFloat(trunk[2]), -parseFloat(trunk[3])));
                }
            };

            /**
            * Reads the next face's indices.
            * @param trunk The data block containing the face tag and its parameters
            */
            OBJParser.prototype.parseFace = function (trunk) {
                var len = trunk.length;
                var face = new FaceData();

                if (!this._currentGroup) {
                    this.createGroup(null);
                }

                var indices;
                for (var i = 1; i < len; ++i) {
                    if (trunk[i] == "") {
                        continue;
                    }

                    indices = trunk[i].split("/");
                    face.vertexIndices.push(this.parseIndex(parseInt(indices[0]), this._vertices.length));

                    if (indices[1] && String(indices[1]).length > 0)
                        face.uvIndices.push(this.parseIndex(parseInt(indices[1]), this._uvs.length));

                    if (indices[2] && String(indices[2]).length > 0)
                        face.normalIndices.push(this.parseIndex(parseInt(indices[2]), this._vertexNormals.length));

                    face.indexIds.push(trunk[i]);
                }

                this._currentMaterialGroup.faces.push(face);
            };

            /**
            * This is a hack around negative face coords
            */
            OBJParser.prototype.parseIndex = function (index, length) {
                if (index < 0)
                    return index + length + 1;
                else
                    return index;
            };

            OBJParser.prototype.parseMtl = function (data) {
                var materialDefinitions = data.split('newmtl');
                var lines;
                var trunk;
                var j;

                var basicSpecularMethod;
                var useSpecular;
                var useColor;
                var diffuseColor;
                var color;
                var specularColor;
                var specular;
                var alpha;
                var mapkd;

                for (var i = 0; i < materialDefinitions.length; ++i) {
                    lines = (materialDefinitions[i].split('\r')).join("").split('\n');

                    //lines = (materialDefinitions[i].split('\r') as Array).join("").split('\n');
                    if (lines.length == 1)
                        lines = materialDefinitions[i].split(String.fromCharCode(13));

                    diffuseColor = color = specularColor = 0xFFFFFF;
                    specular = 0;
                    useSpecular = false;
                    useColor = false;
                    alpha = 1;
                    mapkd = "";

                    for (j = 0; j < lines.length; ++j) {
                        lines[j] = lines[j].replace(/\s+$/, "");

                        if (lines[j].substring(0, 1) != "#" && (j == 0 || lines[j] != "")) {
                            trunk = lines[j].split(" ");

                            if (String(trunk[0]).charCodeAt(0) == 9 || String(trunk[0]).charCodeAt(0) == 32)
                                trunk[0] = trunk[0].substring(1, trunk[0].length);

                            if (j == 0) {
                                this._lastMtlID = trunk.join("");
                                this._lastMtlID = (this._lastMtlID == "") ? "def000" : this._lastMtlID;
                            } else {
                                switch (trunk[0]) {
                                    case "Ka":
                                        if (trunk[1] && !isNaN(Number(trunk[1])) && trunk[2] && !isNaN(Number(trunk[2])) && trunk[3] && !isNaN(Number(trunk[3])))
                                            color = trunk[1] * 255 << 16 | trunk[2] * 255 << 8 | trunk[3] * 255;
                                        break;

                                    case "Ks":
                                        if (trunk[1] && !isNaN(Number(trunk[1])) && trunk[2] && !isNaN(Number(trunk[2])) && trunk[3] && !isNaN(Number(trunk[3]))) {
                                            specularColor = trunk[1] * 255 << 16 | trunk[2] * 255 << 8 | trunk[3] * 255;
                                            useSpecular = true;
                                        }
                                        break;

                                    case "Ns":
                                        if (trunk[1] && !isNaN(Number(trunk[1])))
                                            specular = Number(trunk[1]) * 0.001;
                                        if (specular == 0)
                                            useSpecular = false;
                                        break;

                                    case "Kd":
                                        if (trunk[1] && !isNaN(Number(trunk[1])) && trunk[2] && !isNaN(Number(trunk[2])) && trunk[3] && !isNaN(Number(trunk[3]))) {
                                            diffuseColor = trunk[1] * 255 << 16 | trunk[2] * 255 << 8 | trunk[3] * 255;
                                            useColor = true;
                                        }
                                        break;

                                    case "tr":
                                    case "d":
                                        if (trunk[1] && !isNaN(Number(trunk[1])))
                                            alpha = Number(trunk[1]);
                                        break;

                                    case "map_Kd":
                                        mapkd = this.parseMapKdString(trunk);
                                        mapkd = mapkd.replace(/\\/g, "/");
                                }
                            }
                        }
                    }

                    if (mapkd != "") {
                        if (useSpecular) {
                            basicSpecularMethod = new BasicSpecularMethod();
                            basicSpecularMethod.specularColor = specularColor;
                            basicSpecularMethod.specular = specular;

                            var specularData = new SpecularData();
                            specularData.alpha = alpha;
                            specularData.basicSpecularMethod = basicSpecularMethod;
                            specularData.materialID = this._lastMtlID;

                            if (!this._materialSpecularData)
                                this._materialSpecularData = new Array();

                            this._materialSpecularData.push(specularData);
                        }

                        this._pAddDependency(this._lastMtlID, new away.net.URLRequest(mapkd));
                    } else if (useColor && !isNaN(color)) {
                        var lm = new LoadedMaterial();
                        lm.materialID = this._lastMtlID;

                        if (alpha == 0)
                            console.log("Warning: an alpha value of 0 was found in mtl color tag (Tr or d) ref:" + this._lastMtlID + ", mesh(es) using it will be invisible!");

                        var cm;

                        if (this.materialMode < 2) {
                            cm = new TriangleMethodMaterial(color);

                            var colorMat = cm;

                            colorMat.alpha = alpha;
                            colorMat.diffuseColor = diffuseColor;
                            colorMat.repeat = true;

                            if (useSpecular) {
                                colorMat.specularColor = specularColor;
                                colorMat.specular = specular;
                            }
                        } else {
                            cm = new TriangleMethodMaterial(color);
                            cm.materialMode = TriangleMaterialMode.MULTI_PASS;

                            var colorMultiMat = cm;

                            colorMultiMat.diffuseColor = diffuseColor;
                            colorMultiMat.repeat = true;

                            if (useSpecular) {
                                colorMultiMat.specularColor = specularColor;
                                colorMultiMat.specular = specular;
                            }
                        }

                        lm.cm = cm;

                        this._materialLoaded.push(lm);

                        if (this._meshes.length > 0)
                            this.applyMaterial(lm);
                    }
                }

                this._mtlLibLoaded = true;
            };

            OBJParser.prototype.parseMapKdString = function (trunk) {
                var url = "";
                var i;
                var breakflag;

                for (i = 1; i < trunk.length;) {
                    switch (trunk[i]) {
                        case "-blendu":
                        case "-blendv":
                        case "-cc":
                        case "-clamp":
                        case "-texres":
                            i += 2; //Skip ahead 1 attribute
                            break;
                        case "-mm":
                            i += 3; //Skip ahead 2 attributes
                            break;
                        case "-o":
                        case "-s":
                        case "-t":
                            i += 4; //Skip ahead 3 attributes
                            continue;
                        default:
                            breakflag = true;
                            break;
                    }

                    if (breakflag)
                        break;
                }

                for (i; i < trunk.length; i++) {
                    url += trunk[i];
                    url += " ";
                }

                //Remove the extraneous space and/or newline from the right side
                url = url.replace(/\s+$/, "");

                return url;
            };

            OBJParser.prototype.loadMtl = function (mtlurl) {
                // Add raw-data dependency to queue and load dependencies now,
                // which will pause the parsing in the meantime.
                this._pAddDependency('mtl', new away.net.URLRequest(mtlurl), true);
                this._pPauseAndRetrieveDependencies(); //
            };

            OBJParser.prototype.applyMaterial = function (lm) {
                var decomposeID;
                var mesh;
                var tm;
                var j;
                var specularData;

                for (var i = 0; i < this._meshes.length; ++i) {
                    mesh = this._meshes[i];
                    decomposeID = mesh.material.name.split("~");

                    if (decomposeID[0] == lm.materialID) {
                        if (lm.cm) {
                            if (mesh.material)
                                mesh.material = null;
                            mesh.material = lm.cm;
                        } else if (lm.texture) {
                            if (this.materialMode < 2) {
                                tm = mesh.material;

                                tm.texture = lm.texture;
                                tm.color = lm.color;
                                tm.alpha = lm.alpha;
                                tm.repeat = true;

                                if (lm.specularMethod) {
                                    // By setting the specularMethod property to null before assigning
                                    // the actual method instance, we avoid having the properties of
                                    // the new method being overridden with the settings from the old
                                    // one, which is default behavior of the setter.
                                    tm.specularMethod = null;
                                    tm.specularMethod = lm.specularMethod;
                                } else if (this._materialSpecularData) {
                                    for (j = 0; j < this._materialSpecularData.length; ++j) {
                                        specularData = this._materialSpecularData[j];

                                        if (specularData.materialID == lm.materialID) {
                                            tm.specularMethod = null; // Prevent property overwrite (see above)
                                            tm.specularMethod = specularData.basicSpecularMethod;
                                            tm.color = specularData.color;
                                            tm.alpha = specularData.alpha;
                                            break;
                                        }
                                    }
                                }
                            } else {
                                tm = mesh.material;
                                tm.materialMode = TriangleMaterialMode.MULTI_PASS;

                                tm.texture = lm.texture;
                                tm.color = lm.color;
                                tm.repeat = true;

                                if (lm.specularMethod) {
                                    // By setting the specularMethod property to null before assigning
                                    // the actual method instance, we avoid having the properties of
                                    // the new method being overridden with the settings from the old
                                    // one, which is default behavior of the setter.
                                    tm.specularMethod = null;
                                    tm.specularMethod = lm.specularMethod;
                                } else if (this._materialSpecularData) {
                                    for (j = 0; j < this._materialSpecularData.length; ++j) {
                                        specularData = this._materialSpecularData[j];

                                        if (specularData.materialID == lm.materialID) {
                                            tm.specularMethod = null; // Prevent property overwrite (see above)
                                            tm.specularMethod = specularData.basicSpecularMethod;
                                            tm.color = specularData.color;

                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        mesh.material.name = decomposeID[1] ? decomposeID[1] : decomposeID[0];
                        this._meshes.splice(i, 1);
                        --i;
                    }
                }

                if (lm.cm || tm)
                    this._pFinalizeAsset(lm.cm || tm);
            };

            OBJParser.prototype.applyMaterials = function () {
                if (this._materialLoaded.length == 0)
                    return;

                for (var i = 0; i < this._materialLoaded.length; ++i)
                    this.applyMaterial(this._materialLoaded[i]);
            };
            return OBJParser;
        })(parsers.ParserBase);
        parsers.OBJParser = OBJParser;
    })(away.parsers || (away.parsers = {}));
    var parsers = away.parsers;
})(away || (away = {}));

var BasicSpecularMethod = away.materials.SpecularBasicMethod;
var MaterialBase = away.materials.MaterialBase;
var Texture2DBase = away.textures.Texture2DBase;

var ObjectGroup = (function () {
    function ObjectGroup() {
        this.groups = new Array();
    }
    return ObjectGroup;
})();

var Group = (function () {
    function Group() {
        this.materialGroups = new Array();
    }
    return Group;
})();

var MaterialGroup = (function () {
    function MaterialGroup() {
        this.faces = new Array();
    }
    return MaterialGroup;
})();

var SpecularData = (function () {
    function SpecularData() {
        this.color = 0xFFFFFF;
        this.alpha = 1;
    }
    return SpecularData;
})();

var LoadedMaterial = (function () {
    function LoadedMaterial() {
        this.color = 0xFFFFFF;
        this.alpha = 1;
    }
    return LoadedMaterial;
})();

var FaceData = (function () {
    function FaceData() {
        this.vertexIndices = new Array();
        this.uvIndices = new Array();
        this.normalIndices = new Array();
        this.indexIds = new Array();
    }
    return FaceData;
})();

/**
* Texture coordinates value object.
*/
var UV = (function () {
    /**
    * Creates a new <code>UV</code> object.
    *
    * @param    u        [optional]    The horizontal coordinate of the texture value. Defaults to 0.
    * @param    v        [optional]    The vertical coordinate of the texture value. Defaults to 0.
    */
    function UV(u, v) {
        if (typeof u === "undefined") { u = 0; }
        if (typeof v === "undefined") { v = 0; }
        this._u = u;
        this._v = v;
    }
    Object.defineProperty(UV.prototype, "v", {
        /**
        * Defines the vertical coordinate of the texture value.
        */
        get: function () {
            return this._v;
        },
        set: function (value) {
            this._v = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(UV.prototype, "u", {
        /**
        * Defines the horizontal coordinate of the texture value.
        */
        get: function () {
            return this._u;
        },
        set: function (value) {
            this._u = value;
        },
        enumerable: true,
        configurable: true
    });


    /**
    * returns a new UV value Object
    */
    UV.prototype.clone = function () {
        return new UV(this._u, this._v);
    };

    /**
    * returns the value object as a string for trace/debug purpose
    */
    UV.prototype.toString = function () {
        return this._u + "," + this._v;
    };
    return UV;
})();

var Vertex = (function () {
    /**
    * Creates a new <code>Vertex</code> value object.
    *
    * @param    x            [optional]    The x value. Defaults to 0.
    * @param    y            [optional]    The y value. Defaults to 0.
    * @param    z            [optional]    The z value. Defaults to 0.
    * @param    index        [optional]    The index value. Defaults is NaN.
    */
    function Vertex(x, y, z, index) {
        if (typeof x === "undefined") { x = 0; }
        if (typeof y === "undefined") { y = 0; }
        if (typeof z === "undefined") { z = 0; }
        if (typeof index === "undefined") { index = 0; }
        this._x = x;
        this._y = y;
        this._z = z;
        this._index = index;
    }

    Object.defineProperty(Vertex.prototype, "index", {
        get: function () {
            return this._index;
        },
        /**
        * To define/store the index of value object
        * @param    ind        The index
        */
        set: function (ind) {
            this._index = ind;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Vertex.prototype, "x", {
        /**
        * To define/store the x value of the value object
        * @param    value        The x value
        */
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Vertex.prototype, "y", {
        /**
        * To define/store the y value of the value object
        * @param    value        The y value
        */
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Vertex.prototype, "z", {
        /**
        * To define/store the z value of the value object
        * @param    value        The z value
        */
        get: function () {
            return this._z;
        },
        set: function (value) {
            this._z = value;
        },
        enumerable: true,
        configurable: true
    });


    /**
    * returns a new Vertex value Object
    */
    Vertex.prototype.clone = function () {
        return new Vertex(this._x, this._y, this._z);
    };
    return Vertex;
})();
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (parsers) {
        var JointPose = away.animators.JointPose;
        var Skeleton = away.animators.Skeleton;
        var SkeletonAnimationSet = away.animators.SkeletonAnimationSet;
        var SkeletonAnimator = away.animators.SkeletonAnimator;
        var SkeletonClipNode = away.animators.SkeletonClipNode;
        var SkeletonPose = away.animators.SkeletonPose;
        var SkeletonJoint = away.animators.SkeletonJoint;
        var VertexAnimationSet = away.animators.VertexAnimationSet;
        var VertexAnimator = away.animators.VertexAnimator;
        var VertexClipNode = away.animators.VertexClipNode;
        var BlendMode = away.base.BlendMode;
        var Geometry = away.base.Geometry;

        var TriangleSubGeometry = away.base.TriangleSubGeometry;
        var Mesh = away.entities.Mesh;
        var DirectionalLight = away.entities.DirectionalLight;
        var PointLight = away.entities.PointLight;
        var ColorTransform = away.geom.ColorTransform;
        var Matrix3D = away.geom.Matrix3D;
        var AssetType = away.library.AssetType;
        var AmbientEnvMapMethod = away.materials.AmbientEnvMapMethod;
        var DefaultMaterialManager = away.materials.DefaultMaterialManager;
        var DiffuseDepthMethod = away.materials.DiffuseDepthMethod;
        var DiffuseCelMethod = away.materials.DiffuseCelMethod;

        //	import DiffuseSubSurfaceMethod			= away.materials.DiffuseSubSurfaceMethod;
        var DiffuseGradientMethod = away.materials.DiffuseGradientMethod;
        var DiffuseLightMapMethod = away.materials.DiffuseLightMapMethod;
        var DiffuseWrapMethod = away.materials.DiffuseWrapMethod;
        var EffectAlphaMaskMethod = away.materials.EffectAlphaMaskMethod;
        var EffectColorMatrixMethod = away.materials.EffectColorMatrixMethod;
        var EffectColorTransformMethod = away.materials.EffectColorTransformMethod;
        var EffectEnvMapMethod = away.materials.EffectEnvMapMethod;
        var EffectFogMethod = away.materials.EffectFogMethod;
        var EffectFresnelEnvMapMethod = away.materials.EffectFresnelEnvMapMethod;
        var EffectLightMapMethod = away.materials.EffectLightMapMethod;

        var EffectRimLightMethod = away.materials.EffectRimLightMethod;

        var NormalSimpleWaterMethod = away.materials.NormalSimpleWaterMethod;
        var TriangleMethodMaterial = away.materials.TriangleMethodMaterial;
        var TriangleMaterialMode = away.materials.TriangleMaterialMode;
        var ShadowDitheredMethod = away.materials.ShadowDitheredMethod;
        var ShadowFilteredMethod = away.materials.ShadowFilteredMethod;
        var SkyboxMaterial = away.materials.SkyboxMaterial;
        var SpecularFresnelMethod = away.materials.SpecularFresnelMethod;
        var ShadowHardMethod = away.materials.ShadowHardMethod;
        var SpecularAnisotropicMethod = away.materials.SpecularAnisotropicMethod;
        var SpecularCelMethod = away.materials.SpecularCelMethod;
        var SpecularPhongMethod = away.materials.SpecularPhongMethod;
        var ShadowNearMethod = away.materials.ShadowNearMethod;
        var CubeMapShadowMapper = away.materials.CubeMapShadowMapper;
        var DirectionalShadowMapper = away.materials.DirectionalShadowMapper;

        var ShadowSoftMethod = away.materials.ShadowSoftMethod;
        var StaticLightPicker = away.materials.StaticLightPicker;
        var URLLoaderDataFormat = away.net.URLLoaderDataFormat;
        var ParserBase = away.parsers.ParserBase;
        var ParserUtils = away.parsers.ParserUtils;

        var BitmapCubeTexture = away.textures.BitmapCubeTexture;

        var ImageCubeTexture = away.textures.ImageCubeTexture;
        var ImageTexture = away.textures.ImageTexture;

        var ByteArray = away.utils.ByteArray;

        /**
        * AWDParser provides a parser for the AWD data type.
        */
        var AWDParser = (function (_super) {
            __extends(AWDParser, _super);
            /**
            * Creates a new AWDParser object.
            * @param uri The url or id of the data or file to be parsed.
            * @param extra The holder for extra contextual data that the parser might need.
            */
            function AWDParser() {
                _super.call(this, URLLoaderDataFormat.ARRAY_BUFFER);
                //set to "true" to have some console.logs in the Console
                this._debug = false;
                this._startedParsing = false;
                this._texture_users = {};
                this._parsed_header = false;

                this._blocks = new Array();
                this._blocks[0] = new AWDBlock();
                this._blocks[0].data = null; // Zero address means null in AWD

                this.blendModeDic = new Array(); // used to translate ints to blendMode-strings
                this.blendModeDic.push(BlendMode.NORMAL);
                this.blendModeDic.push(BlendMode.ADD);
                this.blendModeDic.push(BlendMode.ALPHA);
                this.blendModeDic.push(BlendMode.DARKEN);
                this.blendModeDic.push(BlendMode.DIFFERENCE);
                this.blendModeDic.push(BlendMode.ERASE);
                this.blendModeDic.push(BlendMode.HARDLIGHT);
                this.blendModeDic.push(BlendMode.INVERT);
                this.blendModeDic.push(BlendMode.LAYER);
                this.blendModeDic.push(BlendMode.LIGHTEN);
                this.blendModeDic.push(BlendMode.MULTIPLY);
                this.blendModeDic.push(BlendMode.NORMAL);
                this.blendModeDic.push(BlendMode.OVERLAY);
                this.blendModeDic.push(BlendMode.SCREEN);
                this.blendModeDic.push(BlendMode.SHADER);
                this.blendModeDic.push(BlendMode.OVERLAY);

                this._depthSizeDic = new Array(); // used to translate ints to depthSize-values
                this._depthSizeDic.push(256);
                this._depthSizeDic.push(512);
                this._depthSizeDic.push(2048);
                this._depthSizeDic.push(1024);
                this._version = Array(); // will contain 2 int (major-version, minor-version) for awd-version-check
            }
            /**
            * Indicates whether or not a given file extension is supported by the parser.
            * @param extension The file extension of a potential file to be parsed.
            * @return Whether or not the given file type is supported.
            */
            AWDParser.supportsType = function (extension) {
                extension = extension.toLowerCase();
                return extension == "awd";
            };

            /**
            * Tests whether a data block can be parsed by the parser.
            * @param data The data block to potentially be parsed.
            * @return Whether or not the given data is supported.
            */
            AWDParser.supportsData = function (data) {
                return (away.parsers.ParserUtils.toString(data, 3) == 'AWD');
            };

            /**
            * @inheritDoc
            */
            AWDParser.prototype._iResolveDependency = function (resourceDependency) {
                // this will be called when Dependency has finished loading.
                // the Assets waiting for this Bitmap, can be Texture or CubeTexture.
                // if the Bitmap is awaited by a CubeTexture, we need to check if its the last Bitmap of the CubeTexture,
                // so we know if we have to finalize the Asset (CubeTexture) or not.
                if (resourceDependency.assets.length == 1) {
                    var isCubeTextureArray = resourceDependency.id.split("#");
                    var ressourceID = isCubeTextureArray[0];
                    var asset;
                    var thisBitmapTexture;
                    var block;

                    if (isCubeTextureArray.length == 1) {
                        asset = resourceDependency.assets[0];
                        if (asset) {
                            var mat;
                            var users;

                            block = this._blocks[resourceDependency.id];
                            block.data = asset; // Store finished asset

                            // Reset name of texture to the one defined in the AWD file,
                            // as opposed to whatever the image parser came up with.
                            asset.resetAssetPath(block.name, null, true);
                            block.name = asset.name;

                            // Finalize texture asset to dispatch texture event, which was
                            // previously suppressed while the dependency was loaded.
                            this._pFinalizeAsset(asset);

                            if (this._debug) {
                                console.log("Successfully loaded Bitmap for texture");
                                console.log("Parsed texture: Name = " + block.name);
                            }
                        }
                    }

                    if (isCubeTextureArray.length > 1) {
                        thisBitmapTexture = resourceDependency.assets[0];

                        var tx = thisBitmapTexture;

                        this._cubeTextures[isCubeTextureArray[1]] = tx.htmlImageElement; // ?
                        this._texture_users[ressourceID].push(1);

                        if (this._debug) {
                            console.log("Successfully loaded Bitmap " + this._texture_users[ressourceID].length + " / 6 for Cubetexture");
                        }
                        if (this._texture_users[ressourceID].length == this._cubeTextures.length) {
                            var posX = this._cubeTextures[0];
                            var negX = this._cubeTextures[1];
                            var posY = this._cubeTextures[2];
                            var negY = this._cubeTextures[3];
                            var posZ = this._cubeTextures[4];
                            var negZ = this._cubeTextures[5];

                            asset = new ImageCubeTexture(posX, negX, posY, negY, posZ, negZ);
                            block = this._blocks[ressourceID];
                            block.data = asset; // Store finished asset

                            // Reset name of texture to the one defined in the AWD file,
                            // as opposed to whatever the image parser came up with.
                            asset.resetAssetPath(block.name, null, true);
                            block.name = asset.name;

                            // Finalize texture asset to dispatch texture event, which was
                            // previously suppressed while the dependency was loaded.
                            this._pFinalizeAsset(asset);
                            if (this._debug) {
                                console.log("Parsed CubeTexture: Name = " + block.name);
                            }
                        }
                    }
                }
            };

            /**
            * @inheritDoc
            */
            AWDParser.prototype._iResolveDependencyFailure = function (resourceDependency) {
                //not used - if a dependcy fails, the awaiting Texture or CubeTexture will never be finalized, and the default-bitmaps will be used.
                // this means, that if one Bitmap of a CubeTexture fails, the CubeTexture will have the DefaultTexture applied for all six Bitmaps.
            };

            /**
            * Resolve a dependency name
            *
            * @param resourceDependency The dependency to be resolved.
            */
            AWDParser.prototype._iResolveDependencyName = function (resourceDependency, asset) {
                var oldName = asset.name;

                if (asset) {
                    var block = this._blocks[parseInt(resourceDependency.id)];

                    // Reset name of texture to the one defined in the AWD file,
                    // as opposed to whatever the image parser came up with.
                    asset.resetAssetPath(block.name, null, true);
                }

                var newName = asset.name;

                asset.name = oldName;

                return newName;
            };

            /**
            * @inheritDoc
            */
            AWDParser.prototype._pProceedParsing = function () {
                if (!this._startedParsing) {
                    this._byteData = this._pGetByteData(); //getByteData();
                    this._startedParsing = true;
                }

                if (!this._parsed_header) {
                    //----------------------------------------------------------------------------
                    // LITTLE_ENDIAN - Default for ArrayBuffer / Not implemented in ByteArray
                    //----------------------------------------------------------------------------
                    //this._byteData.endian = Endian.LITTLE_ENDIAN;
                    //----------------------------------------------------------------------------
                    //----------------------------------------------------------------------------
                    // Parse header and decompress body if needed
                    this.parseHeader();

                    switch (this._compression) {
                        case AWDParser.DEFLATE:
                        case AWDParser.LZMA:
                            this._pDieWithError('Compressed AWD formats not yet supported');
                            break;

                        case AWDParser.UNCOMPRESSED:
                            this._body = this._byteData;
                            break;
                    }

                    this._parsed_header = true;
                    //----------------------------------------------------------------------------
                    // LITTLE_ENDIAN - Default for ArrayBuffer / Not implemented in ByteArray
                    //----------------------------------------------------------------------------
                    //this._body.endian = Endian.LITTLE_ENDIAN;// Should be default
                    //----------------------------------------------------------------------------
                }

                if (this._body) {
                    while (this._body.getBytesAvailable() > 0 && !this.parsingPaused) {
                        this.parseNextBlock();
                    }

                    //----------------------------------------------------------------------------
                    // Return complete status
                    if (this._body.getBytesAvailable() == 0) {
                        this.dispose();
                        return ParserBase.PARSING_DONE;
                    } else {
                        return ParserBase.MORE_TO_PARSE;
                    }
                } else {
                    switch (this._compression) {
                        case AWDParser.DEFLATE:
                        case AWDParser.LZMA:
                            if (this._debug) {
                                console.log("(!) AWDParser Error: Compressed AWD formats not yet supported (!)");
                            }

                            break;
                    }

                    // Error - most likely _body not set because we do not support compression.
                    return ParserBase.PARSING_DONE;
                }
            };

            AWDParser.prototype._pStartParsing = function (frameLimit) {
                _super.prototype._pStartParsing.call(this, frameLimit);

                //create a content object for Loaders
                this._pContent = new away.containers.DisplayObjectContainer();
            };

            AWDParser.prototype.dispose = function () {
                for (var c in this._blocks) {
                    var b = this._blocks[c];
                    b.dispose();
                }
            };

            AWDParser.prototype.parseNextBlock = function () {
                var block;
                var assetData;
                var isParsed = false;
                var ns;
                var type;
                var flags;
                var len;

                this._cur_block_id = this._body.readUnsignedInt();

                ns = this._body.readUnsignedByte();
                type = this._body.readUnsignedByte();
                flags = this._body.readUnsignedByte();
                len = this._body.readUnsignedInt();

                var blockCompression = bitFlags.test(flags, bitFlags.FLAG4);
                var blockCompressionLZMA = bitFlags.test(flags, bitFlags.FLAG5);

                if (this._accuracyOnBlocks) {
                    this._accuracyMatrix = bitFlags.test(flags, bitFlags.FLAG1);
                    this._accuracyGeo = bitFlags.test(flags, bitFlags.FLAG2);
                    this._accuracyProps = bitFlags.test(flags, bitFlags.FLAG3);
                    this._geoNrType = AWDParser.FLOAT32;

                    if (this._accuracyGeo) {
                        this._geoNrType = AWDParser.FLOAT64;
                    }

                    this._matrixNrType = AWDParser.FLOAT32;

                    if (this._accuracyMatrix) {
                        this._matrixNrType = AWDParser.FLOAT64;
                    }

                    this._propsNrType = AWDParser.FLOAT32;

                    if (this._accuracyProps) {
                        this._propsNrType = AWDParser.FLOAT64;
                    }
                }

                var blockEndAll = this._body.position + len;

                if (len > this._body.getBytesAvailable()) {
                    this._pDieWithError('AWD2 block length is bigger than the bytes that are available!');
                    this._body.position += this._body.getBytesAvailable();
                    return;
                }
                this._newBlockBytes = new ByteArray();

                this._body.readBytes(this._newBlockBytes, 0, len);

                //----------------------------------------------------------------------------
                // Compressed AWD Formats not yet supported
                if (blockCompression) {
                    this._pDieWithError('Compressed AWD formats not yet supported');
                    /*
                    if (blockCompressionLZMA)
                    {
                    this._newBlockBytes.uncompress(AWDParser.COMPRESSIONMODE_LZMA);
                    }
                    else
                    {
                    this._newBlockBytes.uncompress();
                    }
                    */
                }

                //----------------------------------------------------------------------------
                // LITTLE_ENDIAN - Default for ArrayBuffer / Not implemented in ByteArray
                //----------------------------------------------------------------------------
                //this._newBlockBytes.endian = Endian.LITTLE_ENDIAN;
                //----------------------------------------------------------------------------
                this._newBlockBytes.position = 0;
                block = new AWDBlock();
                block.len = this._newBlockBytes.position + len;
                block.id = this._cur_block_id;

                var blockEndBlock = this._newBlockBytes.position + len;

                if (blockCompression) {
                    this._pDieWithError('Compressed AWD formats not yet supported');
                    //blockEndBlock   = this._newBlockBytes.position + this._newBlockBytes.length;
                    //block.len       = blockEndBlock;
                }

                if (this._debug) {
                    console.log("AWDBlock:  ID = " + this._cur_block_id + " | TypeID = " + type + " | Compression = " + blockCompression + " | Matrix-Precision = " + this._accuracyMatrix + " | Geometry-Precision = " + this._accuracyGeo + " | Properties-Precision = " + this._accuracyProps);
                }

                this._blocks[this._cur_block_id] = block;

                if ((this._version[0] == 2) && (this._version[1] == 1)) {
                    switch (type) {
                        case 11:
                            this.parsePrimitves(this._cur_block_id);
                            isParsed = true;
                            break;
                        case 31:
                            this.parseSkyboxInstance(this._cur_block_id);
                            isParsed = true;
                            break;
                        case 41:
                            this.parseLight(this._cur_block_id);
                            isParsed = true;
                            break;
                        case 42:
                            this.parseCamera(this._cur_block_id);
                            isParsed = true;
                            break;

                        case 51:
                            this.parseLightPicker(this._cur_block_id);
                            isParsed = true;
                            break;
                        case 81:
                            this.parseMaterial_v1(this._cur_block_id);
                            isParsed = true;
                            break;
                        case 83:
                            this.parseCubeTexture(this._cur_block_id);
                            isParsed = true;
                            break;
                        case 91:
                            this.parseSharedMethodBlock(this._cur_block_id);
                            isParsed = true;
                            break;
                        case 92:
                            this.parseShadowMethodBlock(this._cur_block_id);
                            isParsed = true;
                            break;
                        case 111:
                            this.parseMeshPoseAnimation(this._cur_block_id, true);
                            isParsed = true;
                            break;
                        case 112:
                            this.parseMeshPoseAnimation(this._cur_block_id);
                            isParsed = true;
                            break;
                        case 113:
                            this.parseVertexAnimationSet(this._cur_block_id);
                            isParsed = true;
                            break;
                        case 122:
                            this.parseAnimatorSet(this._cur_block_id);
                            isParsed = true;
                            break;
                        case 253:
                            this.parseCommand(this._cur_block_id);
                            isParsed = true;
                            break;
                    }
                    //*/
                }

                //*
                if (isParsed == false) {
                    switch (type) {
                        case 1:
                            this.parseTriangleGeometrieBlock(this._cur_block_id);
                            break;
                        case 22:
                            this.parseContainer(this._cur_block_id);
                            break;
                        case 23:
                            this.parseMeshInstance(this._cur_block_id);
                            break;
                        case 81:
                            this.parseMaterial(this._cur_block_id);
                            break;
                        case 82:
                            this.parseTexture(this._cur_block_id);
                            break;
                        case 101:
                            this.parseSkeleton(this._cur_block_id);
                            break;
                        case 102:
                            this.parseSkeletonPose(this._cur_block_id);
                            break;
                        case 103:
                            this.parseSkeletonAnimation(this._cur_block_id);
                            break;
                        case 121:

                        case 254:
                            this.parseNameSpace(this._cur_block_id);
                            break;
                        case 255:
                            this.parseMetaData(this._cur_block_id);
                            break;
                        default:
                            if (this._debug) {
                                console.log("AWDBlock:   Unknown BlockType  (BlockID = " + this._cur_block_id + ") - Skip " + len + " bytes");
                            }
                            this._newBlockBytes.position += len;
                            break;
                    }
                }

                //*/
                var msgCnt = 0;
                if (this._newBlockBytes.position == blockEndBlock) {
                    if (this._debug) {
                        if (block.errorMessages) {
                            while (msgCnt < block.errorMessages.length) {
                                console.log("        (!) Error: " + block.errorMessages[msgCnt] + " (!)");
                                msgCnt++;
                            }
                        }
                    }
                    if (this._debug) {
                        console.log("\n");
                    }
                } else {
                    if (this._debug) {
                        console.log("  (!)(!)(!) Error while reading AWDBlock ID " + this._cur_block_id + " = skip to next block");

                        if (block.errorMessages) {
                            while (msgCnt < block.errorMessages.length) {
                                console.log("        (!) Error: " + block.errorMessages[msgCnt] + " (!)");
                                msgCnt++;
                            }
                        }
                    }
                }

                this._body.position = blockEndAll;
                this._newBlockBytes = null;
            };

            //--Parser Blocks---------------------------------------------------------------------------
            //Block ID = 1
            AWDParser.prototype.parseTriangleGeometrieBlock = function (blockID) {
                var geom = new away.base.Geometry();

                // Read name and sub count
                var name = this.parseVarStr();
                var num_subs = this._newBlockBytes.readUnsignedShort();

                // Read optional properties
                var props = this.parseProperties({ 1: this._geoNrType, 2: this._geoNrType });
                var geoScaleU = props.get(1, 1);
                var geoScaleV = props.get(2, 1);

                // Loop through sub meshes
                var subs_parsed = 0;
                while (subs_parsed < num_subs) {
                    var i;
                    var sm_len, sm_end;
                    var sub_geom;
                    var w_indices;
                    var weights;

                    sm_len = this._newBlockBytes.readUnsignedInt();
                    sm_end = this._newBlockBytes.position + sm_len;

                    // Ignore for now
                    var subProps = this.parseProperties({ 1: this._geoNrType, 2: this._geoNrType });

                    while (this._newBlockBytes.position < sm_end) {
                        var idx = 0;
                        var str_ftype, str_type, str_len, str_end;

                        // Type, field type, length
                        str_type = this._newBlockBytes.readUnsignedByte();
                        str_ftype = this._newBlockBytes.readUnsignedByte();
                        str_len = this._newBlockBytes.readUnsignedInt();
                        str_end = this._newBlockBytes.position + str_len;

                        var x, y, z;

                        if (str_type == 1) {
                            var verts = new Array();

                            while (this._newBlockBytes.position < str_end) {
                                // TODO: Respect stream field type
                                x = this.readNumber(this._accuracyGeo);
                                y = this.readNumber(this._accuracyGeo);
                                z = this.readNumber(this._accuracyGeo);

                                verts[idx++] = x;
                                verts[idx++] = y;
                                verts[idx++] = z;
                            }
                        } else if (str_type == 2) {
                            var indices = new Array();

                            while (this._newBlockBytes.position < str_end) {
                                // TODO: Respect stream field type
                                indices[idx++] = this._newBlockBytes.readUnsignedShort();
                            }
                        } else if (str_type == 3) {
                            var uvs = new Array();
                            while (this._newBlockBytes.position < str_end) {
                                uvs[idx++] = this.readNumber(this._accuracyGeo);
                            }
                        } else if (str_type == 4) {
                            var normals = new Array();

                            while (this._newBlockBytes.position < str_end) {
                                normals[idx++] = this.readNumber(this._accuracyGeo);
                            }
                        } else if (str_type == 6) {
                            w_indices = Array();

                            while (this._newBlockBytes.position < str_end) {
                                w_indices[idx++] = this._newBlockBytes.readUnsignedShort() * 3; // TODO: Respect stream field type
                            }
                        } else if (str_type == 7) {
                            weights = new Array();

                            while (this._newBlockBytes.position < str_end) {
                                weights[idx++] = this.readNumber(this._accuracyGeo);
                            }
                        } else {
                            this._newBlockBytes.position = str_end;
                        }
                    }

                    this.parseUserAttributes(); // Ignore sub-mesh attributes for now

                    sub_geom = new TriangleSubGeometry(true);
                    if (weights)
                        sub_geom.jointsPerVertex = weights.length / (verts.length / 3);
                    if (normals)
                        sub_geom.autoDeriveNormals = false;
                    if (uvs)
                        sub_geom.autoDeriveUVs = false;
                    sub_geom.updateIndices(indices);
                    sub_geom.updatePositions(verts);
                    sub_geom.updateVertexNormals(normals);
                    sub_geom.updateUVs(uvs);
                    sub_geom.updateVertexTangents(null);
                    sub_geom.updateJointWeights(weights);
                    sub_geom.updateJointIndices(w_indices);

                    var scaleU = subProps.get(1, 1);
                    var scaleV = subProps.get(2, 1);
                    var setSubUVs = false;

                    if ((geoScaleU != scaleU) || (geoScaleV != scaleV)) {
                        setSubUVs = true;
                        scaleU = geoScaleU / scaleU;
                        scaleV = geoScaleV / scaleV;
                    }

                    if (setSubUVs)
                        sub_geom.scaleUV(scaleU, scaleV);

                    geom.addSubGeometry(sub_geom);

                    // TODO: Somehow map in-sub to out-sub indices to enable look-up
                    // when creating meshes (and their material assignments.)
                    subs_parsed++;
                }
                if ((geoScaleU != 1) || (geoScaleV != 1))
                    geom.scaleUV(geoScaleU, geoScaleV);
                this.parseUserAttributes();
                this._pFinalizeAsset(geom, name);
                this._blocks[blockID].data = geom;

                if (this._debug) {
                    console.log("Parsed a TriangleGeometry: Name = " + name + "| Id = " + sub_geom.id);
                }
            };

            //Block ID = 11
            AWDParser.prototype.parsePrimitves = function (blockID) {
                var name;
                var prefab;
                var primType;
                var subs_parsed;
                var props;
                var bsm;

                // Read name and sub count
                name = this.parseVarStr();
                primType = this._newBlockBytes.readUnsignedByte();
                props = this.parseProperties({ 101: this._geoNrType, 102: this._geoNrType, 103: this._geoNrType, 110: this._geoNrType, 111: this._geoNrType, 301: AWDParser.UINT16, 302: AWDParser.UINT16, 303: AWDParser.UINT16, 701: AWDParser.BOOL, 702: AWDParser.BOOL, 703: AWDParser.BOOL, 704: AWDParser.BOOL });

                var primitiveTypes = ["Unsupported Type-ID", "PrimitivePlanePrefab", "PrimitiveCubePrefab", "PrimitiveSpherePrefab", "PrimitiveCylinderPrefab", "PrimitivesConePrefab", "PrimitivesCapsulePrefab", "PrimitivesTorusPrefab"];

                switch (primType) {
                    case 1:
                        prefab = new away.prefabs.PrimitivePlanePrefab(props.get(101, 100), props.get(102, 100), props.get(301, 1), props.get(302, 1), props.get(701, true), props.get(702, false));
                        break;

                    case 2:
                        prefab = new away.prefabs.PrimitiveCubePrefab(props.get(101, 100), props.get(102, 100), props.get(103, 100), props.get(301, 1), props.get(302, 1), props.get(303, 1), props.get(701, true));
                        break;

                    case 3:
                        prefab = new away.prefabs.PrimitiveSpherePrefab(props.get(101, 50), props.get(301, 16), props.get(302, 12), props.get(701, true));
                        break;

                    case 4:
                        prefab = new away.prefabs.PrimitiveCylinderPrefab(props.get(101, 50), props.get(102, 50), props.get(103, 100), props.get(301, 16), props.get(302, 1), true, true, true); // bool701, bool702, bool703, bool704);
                        if (!props.get(701, true))
                            prefab.topClosed = false;
                        if (!props.get(702, true))
                            prefab.bottomClosed = false;
                        if (!props.get(703, true))
                            prefab.yUp = false;

                        break;

                    case 5:
                        prefab = new away.prefabs.PrimitiveConePrefab(props.get(101, 50), props.get(102, 100), props.get(301, 16), props.get(302, 1), props.get(701, true), props.get(702, true));
                        break;

                    case 6:
                        prefab = new away.prefabs.PrimitiveCapsulePrefab(props.get(101, 50), props.get(102, 100), props.get(301, 16), props.get(302, 15), props.get(701, true));
                        break;

                    case 7:
                        prefab = new away.prefabs.PrimitiveTorusPrefab(props.get(101, 50), props.get(102, 50), props.get(301, 16), props.get(302, 8), props.get(701, true));
                        break;

                    default:
                        prefab = new away.prefabs.PrefabBase();
                        console.log("ERROR: UNSUPPORTED PREFAB_TYPE");
                        break;
                }

                if ((props.get(110, 1) != 1) || (props.get(111, 1) != 1)) {
                    //geom.subGeometries;
                    //geom.scaleUV(props.get(110, 1), props.get(111, 1)); //TODO add back scaling to prefabs
                }

                this.parseUserAttributes();
                prefab.name = name;
                this._pFinalizeAsset(prefab, name);
                this._blocks[blockID].data = prefab;

                if (this._debug) {
                    if ((primType < 0) || (primType > 7)) {
                        primType = 0;
                    }
                    console.log("Parsed a Primivite: Name = " + name + "| type = " + primitiveTypes[primType]);
                }
            };

            // Block ID = 22
            AWDParser.prototype.parseContainer = function (blockID) {
                var name;
                var par_id;
                var mtx;
                var ctr;
                var parent;

                par_id = this._newBlockBytes.readUnsignedInt();
                mtx = this.parseMatrix3D();
                name = this.parseVarStr();

                var parentName = "Root (TopLevel)";
                ctr = new away.containers.DisplayObjectContainer();
                ctr.transform.matrix3D = mtx;

                var returnedArray = this.getAssetByID(par_id, [AssetType.CONTAINER, AssetType.LIGHT, AssetType.MESH]);

                if (returnedArray[0]) {
                    var obj = returnedArray[1].addChild(ctr);
                    parentName = returnedArray[1].name;
                } else if (par_id > 0) {
                    this._blocks[blockID].addError("Could not find a parent for this ObjectContainer3D");
                } else {
                    //add to the content property
                    this._pContent.addChild(ctr);
                }

                // in AWD version 2.1 we read the Container properties
                if ((this._version[0] == 2) && (this._version[1] == 1)) {
                    var props = this.parseProperties({ 1: this._matrixNrType, 2: this._matrixNrType, 3: this._matrixNrType, 4: AWDParser.UINT8 });
                    ctr.pivot = new away.geom.Vector3D(props.get(1, 0), props.get(2, 0), props.get(3, 0));
                } else {
                    this.parseProperties(null);
                }

                // the extraProperties should only be set for AWD2.1-Files, but is read for both versions
                ctr.extra = this.parseUserAttributes();

                this._pFinalizeAsset(ctr, name);
                this._blocks[blockID].data = ctr;

                if (this._debug) {
                    console.log("Parsed a Container: Name = '" + name + "' | Parent-Name = " + parentName);
                }
            };

            // Block ID = 23
            AWDParser.prototype.parseMeshInstance = function (blockID) {
                var num_materials;
                var materials_parsed;
                var parent;
                var par_id = this._newBlockBytes.readUnsignedInt();
                var mtx = this.parseMatrix3D();
                var name = this.parseVarStr();
                var parentName = "Root (TopLevel)";
                var data_id = this._newBlockBytes.readUnsignedInt();
                var geom;
                var returnedArrayGeometry = this.getAssetByID(data_id, [AssetType.GEOMETRY]);

                if (returnedArrayGeometry[0]) {
                    geom = returnedArrayGeometry[1];
                } else {
                    this._blocks[blockID].addError("Could not find a Geometry for this Mesh. A empty Geometry is created!");
                    geom = new away.base.Geometry();
                }

                this._blocks[blockID].geoID = data_id;
                var materials = new Array();
                num_materials = this._newBlockBytes.readUnsignedShort();

                var materialNames = new Array();
                materials_parsed = 0;

                var returnedArrayMaterial;

                while (materials_parsed < num_materials) {
                    var mat_id;
                    mat_id = this._newBlockBytes.readUnsignedInt();
                    returnedArrayMaterial = this.getAssetByID(mat_id, [AssetType.MATERIAL]);
                    if ((!returnedArrayMaterial[0]) && (mat_id > 0)) {
                        this._blocks[blockID].addError("Could not find Material Nr " + materials_parsed + " (ID = " + mat_id + " ) for this Mesh");
                    }

                    var m = returnedArrayMaterial[1];

                    materials.push(m);
                    materialNames.push(m.name);

                    materials_parsed++;
                }

                var mesh = new Mesh(geom, null);
                mesh.transform.matrix3D = mtx;

                var returnedArrayParent = this.getAssetByID(par_id, [AssetType.CONTAINER, AssetType.LIGHT, AssetType.MESH]);

                if (returnedArrayParent[0]) {
                    var objC = returnedArrayParent[1];
                    objC.addChild(mesh);
                    parentName = objC.name;
                } else if (par_id > 0) {
                    this._blocks[blockID].addError("Could not find a parent for this Mesh");
                } else {
                    //add to the content property
                    this._pContent.addChild(mesh);
                }

                if (materials.length >= 1 && mesh.subMeshes.length == 1) {
                    mesh.material = materials[0];
                } else if (materials.length > 1) {
                    var i;

                    for (i = 0; i < mesh.subMeshes.length; i++) {
                        mesh.subMeshes[i].material = materials[Math.min(materials.length - 1, i)];
                    }
                }
                if ((this._version[0] == 2) && (this._version[1] == 1)) {
                    var props = this.parseProperties({ 1: this._matrixNrType, 2: this._matrixNrType, 3: this._matrixNrType, 4: AWDParser.UINT8, 5: AWDParser.BOOL });
                    mesh.pivot = new away.geom.Vector3D(props.get(1, 0), props.get(2, 0), props.get(3, 0));
                    mesh.castsShadows = props.get(5, true);
                } else {
                    this.parseProperties(null);
                }

                mesh.extra = this.parseUserAttributes();

                this._pFinalizeAsset(mesh, name);
                this._blocks[blockID].data = mesh;

                if (this._debug) {
                    console.log("Parsed a Mesh: Name = '" + name + "' | Parent-Name = " + parentName + "| Geometry-Name = " + geom.name + " | SubMeshes = " + mesh.subMeshes.length + " | Mat-Names = " + materialNames.toString());
                }
            };

            //Block ID 31
            AWDParser.prototype.parseSkyboxInstance = function (blockID) {
                var name = this.parseVarStr();
                var cubeTexAddr = this._newBlockBytes.readUnsignedInt();

                var returnedArrayCubeTex = this.getAssetByID(cubeTexAddr, [AssetType.TEXTURE], "CubeTexture");
                if ((!returnedArrayCubeTex[0]) && (cubeTexAddr != 0))
                    this._blocks[blockID].addError("Could not find the Cubetexture (ID = " + cubeTexAddr + " ) for this Skybox");
                var asset = new away.entities.Skybox(new SkyboxMaterial(returnedArrayCubeTex[1]));

                this.parseProperties(null);
                asset.extra = this.parseUserAttributes();
                this._pFinalizeAsset(asset, name);
                this._blocks[blockID].data = asset;
                if (this._debug)
                    console.log("Parsed a Skybox: Name = '" + name + "' | CubeTexture-Name = " + returnedArrayCubeTex[1].name);
            };

            //Block ID = 41
            AWDParser.prototype.parseLight = function (blockID) {
                var light;
                var newShadowMapper;

                var par_id = this._newBlockBytes.readUnsignedInt();
                var mtx = this.parseMatrix3D();
                var name = this.parseVarStr();
                var lightType = this._newBlockBytes.readUnsignedByte();
                var props = this.parseProperties({ 1: this._propsNrType, 2: this._propsNrType, 3: AWDParser.COLOR, 4: this._propsNrType, 5: this._propsNrType, 6: AWDParser.BOOL, 7: AWDParser.COLOR, 8: this._propsNrType, 9: AWDParser.UINT8, 10: AWDParser.UINT8, 11: this._propsNrType, 12: AWDParser.UINT16, 21: this._matrixNrType, 22: this._matrixNrType, 23: this._matrixNrType });
                var shadowMapperType = props.get(9, 0);
                var parentName = "Root (TopLevel)";
                var lightTypes = ["Unsupported LightType", "PointLight", "DirectionalLight"];
                var shadowMapperTypes = ["No ShadowMapper", "DirectionalShadowMapper", "NearDirectionalShadowMapper", "CascadeShadowMapper", "CubeMapShadowMapper"];

                if (lightType == 1) {
                    light = new PointLight();

                    light.radius = props.get(1, 90000);
                    light.fallOff = props.get(2, 100000);

                    if (shadowMapperType > 0) {
                        if (shadowMapperType == 4) {
                            newShadowMapper = new CubeMapShadowMapper();
                        }
                    }

                    light.transform.matrix3D = mtx;
                }

                if (lightType == 2) {
                    light = new DirectionalLight(props.get(21, 0), props.get(22, -1), props.get(23, 1));

                    if (shadowMapperType > 0) {
                        if (shadowMapperType == 1) {
                            newShadowMapper = new DirectionalShadowMapper();
                        }
                        //if (shadowMapperType == 2)
                        //  newShadowMapper = new NearDirectionalShadowMapper(props.get(11, 0.5));
                        //if (shadowMapperType == 3)
                        //   newShadowMapper = new CascadeShadowMapper(props.get(12, 3));
                    }
                }
                light.color = props.get(3, 0xffffff);
                light.specular = props.get(4, 1.0);
                light.diffuse = props.get(5, 1.0);
                light.ambientColor = props.get(7, 0xffffff);
                light.ambient = props.get(8, 0.0);

                // if a shadowMapper has been created, adjust the depthMapSize if needed, assign to light and set castShadows to true
                if (newShadowMapper) {
                    if (newShadowMapper instanceof CubeMapShadowMapper) {
                        if (props.get(10, 1) != 1) {
                            newShadowMapper.depthMapSize = this._depthSizeDic[props.get(10, 1)];
                        }
                    } else {
                        if (props.get(10, 2) != 2) {
                            newShadowMapper.depthMapSize = this._depthSizeDic[props.get(10, 2)];
                        }
                    }

                    light.shadowMapper = newShadowMapper;
                    light.castsShadows = true;
                }

                if (par_id != 0) {
                    var returnedArrayParent = this.getAssetByID(par_id, [AssetType.CONTAINER, AssetType.LIGHT, AssetType.MESH]);

                    if (returnedArrayParent[0]) {
                        returnedArrayParent[1].addChild(light);
                        parentName = returnedArrayParent[1].name;
                    } else {
                        this._blocks[blockID].addError("Could not find a parent for this Light");
                    }
                } else {
                    //add to the content property
                    this._pContent.addChild(light);
                }

                this.parseUserAttributes();

                this._pFinalizeAsset(light, name);

                this._blocks[blockID].data = light;

                if (this._debug)
                    console.log("Parsed a Light: Name = '" + name + "' | Type = " + lightTypes[lightType] + " | Parent-Name = " + parentName + " | ShadowMapper-Type = " + shadowMapperTypes[shadowMapperType]);
            };

            //Block ID = 43
            AWDParser.prototype.parseCamera = function (blockID) {
                var par_id = this._newBlockBytes.readUnsignedInt();
                var mtx = this.parseMatrix3D();
                var name = this.parseVarStr();
                var parentName = "Root (TopLevel)";
                var projection;

                this._newBlockBytes.readUnsignedByte(); //set as active camera
                this._newBlockBytes.readShort(); //lengthof lenses - not used yet

                var projectiontype = this._newBlockBytes.readShort();
                var props = this.parseProperties({ 101: this._propsNrType, 102: this._propsNrType, 103: this._propsNrType, 104: this._propsNrType });

                switch (projectiontype) {
                    case 5001:
                        projection = new away.projections.PerspectiveProjection(props.get(101, 60));
                        break;
                    case 5002:
                        projection = new away.projections.OrthographicProjection(props.get(101, 500));
                        break;
                    case 5003:
                        projection = new away.projections.OrthographicOffCenterProjection(props.get(101, -400), props.get(102, 400), props.get(103, -300), props.get(104, 300));
                        break;
                    default:
                        console.log("unsupportedLenstype");
                        return;
                }

                var camera = new away.entities.Camera(projection);
                camera.transform.matrix3D = mtx;

                var returnedArrayParent = this.getAssetByID(par_id, [AssetType.CONTAINER, AssetType.LIGHT, AssetType.MESH]);

                if (returnedArrayParent[0]) {
                    var objC = returnedArrayParent[1];
                    objC.addChild(camera);

                    parentName = objC.name;
                } else if (par_id > 0) {
                    this._blocks[blockID].addError("Could not find a parent for this Camera");
                } else {
                    //add to the content property
                    this._pContent.addChild(camera);
                }

                camera.name = name;
                props = this.parseProperties({ 1: this._matrixNrType, 2: this._matrixNrType, 3: this._matrixNrType, 4: AWDParser.UINT8 });
                camera.pivot = new away.geom.Vector3D(props.get(1, 0), props.get(2, 0), props.get(3, 0));
                camera.extra = this.parseUserAttributes();

                this._pFinalizeAsset(camera, name);

                this._blocks[blockID].data = camera;

                if (this._debug) {
                    console.log("Parsed a Camera: Name = '" + name + "' | Projectiontype = " + projection + " | Parent-Name = " + parentName);
                }
            };

            //Block ID = 51
            AWDParser.prototype.parseLightPicker = function (blockID) {
                var name = this.parseVarStr();
                var numLights = this._newBlockBytes.readUnsignedShort();
                var lightsArray = new Array();
                var k = 0;
                var lightID = 0;

                var returnedArrayLight;
                var lightsArrayNames = new Array();

                for (k = 0; k < numLights; k++) {
                    lightID = this._newBlockBytes.readUnsignedInt();
                    returnedArrayLight = this.getAssetByID(lightID, [AssetType.LIGHT]);

                    if (returnedArrayLight[0]) {
                        lightsArray.push(returnedArrayLight[1]);
                        lightsArrayNames.push(returnedArrayLight[1].name);
                    } else {
                        this._blocks[blockID].addError("Could not find a Light Nr " + k + " (ID = " + lightID + " ) for this LightPicker");
                    }
                }

                if (lightsArray.length == 0) {
                    this._blocks[blockID].addError("Could not create this LightPicker, cause no Light was found.");
                    this.parseUserAttributes();
                    return;
                }

                var lightPick = new StaticLightPicker(lightsArray);
                lightPick.name = name;

                this.parseUserAttributes();
                this._pFinalizeAsset(lightPick, name);

                this._blocks[blockID].data = lightPick;
                if (this._debug) {
                    console.log("Parsed a StaticLightPicker: Name = '" + name + "' | Texture-Name = " + lightsArrayNames.toString());
                }
            };

            //Block ID = 81
            AWDParser.prototype.parseMaterial = function (blockID) {
                // TODO: not used
                ////blockLength = block.len;
                var name;
                var type;
                var props;
                var mat;
                var attributes;
                var finalize;
                var num_methods;
                var methods_parsed;
                var returnedArray;

                name = this.parseVarStr();
                type = this._newBlockBytes.readUnsignedByte();
                num_methods = this._newBlockBytes.readUnsignedByte();

                // Read material numerical properties
                // (1=color, 2=bitmap url, 10=alpha, 11=alpha_blending, 12=alpha_threshold, 13=repeat)
                props = this.parseProperties({ 1: AWDParser.INT32, 2: AWDParser.BADDR, 10: this._propsNrType, 11: AWDParser.BOOL, 12: this._propsNrType, 13: AWDParser.BOOL });

                methods_parsed = 0;
                while (methods_parsed < num_methods) {
                    var method_type;

                    method_type = this._newBlockBytes.readUnsignedShort();
                    this.parseProperties(null);
                    this.parseUserAttributes();
                    methods_parsed += 1;
                }
                var debugString = "";
                attributes = this.parseUserAttributes();
                if (type === 1) {
                    debugString += "Parsed a ColorMaterial(SinglePass): Name = '" + name + "' | ";
                    var color;
                    color = props.get(1, 0xffffff);
                    if (this.materialMode < 2) {
                        mat = new TriangleMethodMaterial(color, props.get(10, 1.0));
                    } else {
                        mat = new TriangleMethodMaterial(color);
                        mat.materialMode = TriangleMaterialMode.MULTI_PASS;
                    }
                } else if (type === 2) {
                    var tex_addr = props.get(2, 0);

                    returnedArray = this.getAssetByID(tex_addr, [AssetType.TEXTURE]);

                    if ((!returnedArray[0]) && (tex_addr > 0))
                        this._blocks[blockID].addError("Could not find the DiffsueTexture (ID = " + tex_addr + " ) for this Material");

                    mat = new TriangleMethodMaterial(returnedArray[1]);

                    if (this.materialMode < 2) {
                        mat.alphaBlending = props.get(11, false);
                        mat.alpha = props.get(10, 1.0);
                        debugString += "Parsed a TriangleMethodMaterial(SinglePass): Name = '" + name + "' | Texture-Name = " + mat.name;
                    } else {
                        mat.materialMode = TriangleMaterialMode.MULTI_PASS;
                        debugString += "Parsed a TriangleMethodMaterial(MultiPass): Name = '" + name + "' | Texture-Name = " + mat.name;
                    }
                }

                mat.extra = attributes;
                mat.alphaThreshold = props.get(12, 0.0);
                mat.repeat = props.get(13, false);
                this._pFinalizeAsset(mat, name);
                this._blocks[blockID].data = mat;

                if (this._debug) {
                    console.log(debugString);
                }
            };

            // Block ID = 81 AWD2.1
            AWDParser.prototype.parseMaterial_v1 = function (blockID) {
                var mat;
                var normalTexture;
                var specTexture;
                var returnedArray;

                var name = this.parseVarStr();
                var type = this._newBlockBytes.readUnsignedByte();
                var num_methods = this._newBlockBytes.readUnsignedByte();
                var props = this.parseProperties({ 1: AWDParser.UINT32, 2: AWDParser.BADDR, 3: AWDParser.BADDR, 4: AWDParser.UINT8, 5: AWDParser.BOOL, 6: AWDParser.BOOL, 7: AWDParser.BOOL, 8: AWDParser.BOOL, 9: AWDParser.UINT8, 10: this._propsNrType, 11: AWDParser.BOOL, 12: this._propsNrType, 13: AWDParser.BOOL, 15: this._propsNrType, 16: AWDParser.UINT32, 17: AWDParser.BADDR, 18: this._propsNrType, 19: this._propsNrType, 20: AWDParser.UINT32, 21: AWDParser.BADDR, 22: AWDParser.BADDR });
                var spezialType = props.get(4, 0);
                var debugString = "";

                if (spezialType >= 2) {
                    this._blocks[blockID].addError("Material-spezialType '" + spezialType + "' is not supported, can only be 0:singlePass, 1:MultiPass !");
                    return;
                }

                if (this.materialMode == 1)
                    spezialType = 0;
                else if (this.materialMode == 2)
                    spezialType = 1;

                if (spezialType < 2) {
                    if (type == 1) {
                        var color = props.get(1, 0xcccccc);

                        if (spezialType == 1) {
                            mat = new TriangleMethodMaterial(color);
                            mat.materialMode = TriangleMaterialMode.MULTI_PASS;
                            debugString += "Parsed a ColorMaterial(MultiPass): Name = '" + name + "' | ";
                        } else {
                            mat = new TriangleMethodMaterial(color, props.get(10, 1.0));
                            mat.alphaBlending = props.get(11, false);
                            debugString += "Parsed a ColorMaterial(SinglePass): Name = '" + name + "' | ";
                        }
                    } else if (type == 2) {
                        var tex_addr = props.get(2, 0);
                        returnedArray = this.getAssetByID(tex_addr, [AssetType.TEXTURE]);

                        if ((!returnedArray[0]) && (tex_addr > 0))
                            this._blocks[blockID].addError("Could not find the AmbientTexture (ID = " + tex_addr + " ) for this TriangleMethodMaterial");

                        var texture = returnedArray[1];

                        mat = new TriangleMethodMaterial(texture);

                        if (spezialType == 1) {
                            mat.materialMode = TriangleMaterialMode.MULTI_PASS;

                            debugString += "Parsed a TriangleMethodMaterial(MultiPass): Name = '" + name + "' | Texture-Name = " + texture.name;
                        } else {
                            mat.alpha = props.get(10, 1.0);
                            mat.alphaBlending = props.get(11, false);

                            debugString += "Parsed a TriangleMethodMaterial(SinglePass): Name = '" + name + "' | Texture-Name = " + texture.name;
                        }
                    }

                    var diffuseTexture;
                    var diffuseTex_addr = props.get(17, 0);

                    returnedArray = this.getAssetByID(diffuseTex_addr, [AssetType.TEXTURE]);

                    if ((!returnedArray[0]) && (diffuseTex_addr != 0)) {
                        this._blocks[blockID].addError("Could not find the DiffuseTexture (ID = " + diffuseTex_addr + " ) for this TriangleMethodMaterial");
                    }

                    if (returnedArray[0])
                        diffuseTexture = returnedArray[1];

                    if (diffuseTexture) {
                        mat.diffuseTexture = diffuseTexture;
                        debugString += " | DiffuseTexture-Name = " + diffuseTexture.name;
                    }

                    var normalTex_addr = props.get(3, 0);

                    returnedArray = this.getAssetByID(normalTex_addr, [AssetType.TEXTURE]);

                    if ((!returnedArray[0]) && (normalTex_addr != 0)) {
                        this._blocks[blockID].addError("Could not find the NormalTexture (ID = " + normalTex_addr + " ) for this TriangleMethodMaterial");
                    }

                    if (returnedArray[0]) {
                        normalTexture = returnedArray[1];
                        debugString += " | NormalTexture-Name = " + normalTexture.name;
                    }

                    var specTex_addr = props.get(21, 0);
                    returnedArray = this.getAssetByID(specTex_addr, [AssetType.TEXTURE]);

                    if ((!returnedArray[0]) && (specTex_addr != 0)) {
                        this._blocks[blockID].addError("Could not find the SpecularTexture (ID = " + specTex_addr + " ) for this TriangleMethodMaterial");
                    }
                    if (returnedArray[0]) {
                        specTexture = returnedArray[1];
                        debugString += " | SpecularTexture-Name = " + specTexture.name;
                    }

                    var lightPickerAddr = props.get(22, 0);
                    returnedArray = this.getAssetByID(lightPickerAddr, [AssetType.LIGHT_PICKER]);

                    if ((!returnedArray[0]) && (lightPickerAddr)) {
                        this._blocks[blockID].addError("Could not find the LightPicker (ID = " + lightPickerAddr + " ) for this TriangleMethodMaterial");
                    } else {
                        mat.lightPicker = returnedArray[1];
                        //debugString+=" | Lightpicker-Name = "+LightPickerBase(returnedArray[1]).name;
                    }

                    mat.smooth = props.get(5, true);
                    mat.mipmap = props.get(6, true);
                    mat.bothSides = props.get(7, false);
                    mat.alphaPremultiplied = props.get(8, false);
                    mat.blendMode = this.blendModeDic[props.get(9, 0)];
                    mat.repeat = props.get(13, false);

                    if (normalTexture)
                        mat.normalMap = normalTexture;

                    if (specTexture)
                        mat.specularMap = specTexture;

                    mat.alphaThreshold = props.get(12, 0.0);
                    mat.ambient = props.get(15, 1.0);
                    mat.diffuseColor = props.get(16, 0xffffff);
                    mat.specular = props.get(18, 1.0);
                    mat.gloss = props.get(19, 50);
                    mat.specularColor = props.get(20, 0xffffff);

                    var methods_parsed = 0;
                    var targetID;

                    while (methods_parsed < num_methods) {
                        var method_type;
                        method_type = this._newBlockBytes.readUnsignedShort();

                        props = this.parseProperties({ 1: AWDParser.BADDR, 2: AWDParser.BADDR, 3: AWDParser.BADDR, 101: this._propsNrType, 102: this._propsNrType, 103: this._propsNrType, 201: AWDParser.UINT32, 202: AWDParser.UINT32, 301: AWDParser.UINT16, 302: AWDParser.UINT16, 401: AWDParser.UINT8, 402: AWDParser.UINT8, 601: AWDParser.COLOR, 602: AWDParser.COLOR, 701: AWDParser.BOOL, 702: AWDParser.BOOL, 801: AWDParser.MTX4x4 });

                        switch (method_type) {
                            case 999:
                                targetID = props.get(1, 0);
                                returnedArray = this.getAssetByID(targetID, [AssetType.EFFECTS_METHOD]);

                                if (!returnedArray[0]) {
                                    this._blocks[blockID].addError("Could not find the EffectMethod (ID = " + targetID + " ) for this Material");
                                } else {
                                    mat.addEffectMethod(returnedArray[1]);

                                    debugString += " | EffectMethod-Name = " + returnedArray[1].name;
                                }

                                break;

                            case 998:
                                targetID = props.get(1, 0);
                                returnedArray = this.getAssetByID(targetID, [AssetType.SHADOW_MAP_METHOD]);

                                if (!returnedArray[0]) {
                                    this._blocks[blockID].addError("Could not find the ShadowMethod (ID = " + targetID + " ) for this Material");
                                } else {
                                    mat.shadowMethod = returnedArray[1];
                                    debugString += " | ShadowMethod-Name = " + returnedArray[1].name;
                                }

                                break;

                            case 1:
                                targetID = props.get(1, 0);
                                returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE], "CubeTexture");
                                if (!returnedArray[0])
                                    this._blocks[blockID].addError("Could not find the EnvMap (ID = " + targetID + " ) for this EnvMapAmbientMethodMaterial");
                                mat.ambientMethod = new AmbientEnvMapMethod(returnedArray[1]);
                                debugString += " | AmbientEnvMapMethod | EnvMap-Name =" + returnedArray[1].name;
                                break;

                            case 51:
                                mat.diffuseMethod = new DiffuseDepthMethod();
                                debugString += " | DiffuseDepthMethod";
                                break;
                            case 52:
                                targetID = props.get(1, 0);
                                returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE]);
                                if (!returnedArray[0])
                                    this._blocks[blockID].addError("Could not find the GradientDiffuseTexture (ID = " + targetID + " ) for this GradientDiffuseMethod");
                                mat.diffuseMethod = new DiffuseGradientMethod(returnedArray[1]);
                                debugString += " | DiffuseGradientMethod | GradientDiffuseTexture-Name =" + returnedArray[1].name;
                                break;
                            case 53:
                                mat.diffuseMethod = new DiffuseWrapMethod(props.get(101, 5));
                                debugString += " | DiffuseWrapMethod";
                                break;
                            case 54:
                                targetID = props.get(1, 0);
                                returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE]);
                                if (!returnedArray[0])
                                    this._blocks[blockID].addError("Could not find the LightMap (ID = " + targetID + " ) for this LightMapDiffuseMethod");
                                mat.diffuseMethod = new DiffuseLightMapMethod(returnedArray[1], this.blendModeDic[props.get(401, 10)], false, mat.diffuseMethod);
                                debugString += " | DiffuseLightMapMethod | LightMapTexture-Name =" + returnedArray[1].name;
                                break;
                            case 55:
                                mat.diffuseMethod = new DiffuseCelMethod(props.get(401, 3), mat.diffuseMethod);
                                mat.diffuseMethod.smoothness = props.get(101, 0.1);
                                debugString += " | DiffuseCelMethod";
                                break;
                            case 56:
                                break;

                            case 101:
                                mat.specularMethod = new SpecularAnisotropicMethod();
                                debugString += " | SpecularAnisotropicMethod";
                                break;
                            case 102:
                                mat.specularMethod = new SpecularPhongMethod();
                                debugString += " | SpecularPhongMethod";
                                break;
                            case 103:
                                mat.specularMethod = new SpecularCelMethod(props.get(101, 0.5), mat.specularMethod);
                                mat.specularMethod.smoothness = props.get(102, 0.1);
                                debugString += " | SpecularCelMethod";
                                break;
                            case 104:
                                mat.specularMethod = new SpecularFresnelMethod(props.get(701, true), mat.specularMethod);
                                mat.specularMethod.fresnelPower = props.get(101, 5);
                                mat.specularMethod.normalReflectance = props.get(102, 0.1);
                                debugString += " | SpecularFresnelMethod";
                                break;
                            case 151:
                                break;
                            case 152:
                                targetID = props.get(1, 0);
                                returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE]);
                                if (!returnedArray[0])
                                    this._blocks[blockID].addError("Could not find the SecoundNormalMap (ID = " + targetID + " ) for this SimpleWaterNormalMethod");
                                if (!mat.normalMap)
                                    this._blocks[blockID].addError("Could not find a normal Map on this Material to use with this SimpleWaterNormalMethod");

                                mat.normalMap = returnedArray[1];
                                mat.normalMethod = new NormalSimpleWaterMethod(mat.normalMap, returnedArray[1]);
                                debugString += " | NormalSimpleWaterMethod | Second-NormalTexture-Name = " + returnedArray[1].name;
                                break;
                        }
                        this.parseUserAttributes();
                        methods_parsed += 1;
                    }
                }
                mat.extra = this.parseUserAttributes();
                this._pFinalizeAsset(mat, name);

                this._blocks[blockID].data = mat;
                if (this._debug) {
                    console.log(debugString);
                }
            };

            //Block ID = 82
            AWDParser.prototype.parseTexture = function (blockID) {
                var asset;

                this._blocks[blockID].name = this.parseVarStr();

                var type = this._newBlockBytes.readUnsignedByte();
                var data_len;

                this._texture_users[this._cur_block_id.toString()] = [];

                // External
                if (type == 0) {
                    data_len = this._newBlockBytes.readUnsignedInt();
                    var url;
                    url = this._newBlockBytes.readUTFBytes(data_len);
                    this._pAddDependency(this._cur_block_id.toString(), new away.net.URLRequest(url), false, null, true);
                } else {
                    data_len = this._newBlockBytes.readUnsignedInt();

                    var data;
                    data = new ByteArray();
                    this._newBlockBytes.readBytes(data, 0, data_len);

                    //
                    // AWDParser - Fix for FireFox Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=715075 .
                    //
                    // Converting data to image here instead of parser - fix FireFox bug where image width / height is 0 when created from data
                    // This gives the browser time to initialise image width / height.
                    this._pAddDependency(this._cur_block_id.toString(), null, false, ParserUtils.byteArrayToImage(data), true);
                    //this._pAddDependency(this._cur_block_id.toString(), null, false, data, true);
                }

                // Ignore for now
                this.parseProperties(null);
                this._blocks[blockID].extras = this.parseUserAttributes();
                this._pPauseAndRetrieveDependencies();
                this._blocks[blockID].data = asset;

                if (this._debug) {
                    var textureStylesNames = ["external", "embed"];
                    console.log("Start parsing a " + textureStylesNames[type] + " Bitmap for Texture");
                }
            };

            //Block ID = 83
            AWDParser.prototype.parseCubeTexture = function (blockID) {
                //blockLength = block.len;
                var data_len;
                var asset;
                var i;

                this._cubeTextures = new Array();
                this._texture_users[this._cur_block_id.toString()] = [];

                var type = this._newBlockBytes.readUnsignedByte();

                this._blocks[blockID].name = this.parseVarStr();

                for (i = 0; i < 6; i++) {
                    this._texture_users[this._cur_block_id.toString()] = [];
                    this._cubeTextures.push(null);

                    // External
                    if (type == 0) {
                        data_len = this._newBlockBytes.readUnsignedInt();
                        var url;
                        url = this._newBlockBytes.readUTFBytes(data_len);

                        this._pAddDependency(this._cur_block_id.toString() + "#" + i, new away.net.URLRequest(url), false, null, true);
                    } else {
                        data_len = this._newBlockBytes.readUnsignedInt();
                        var data;
                        data = new ByteArray();

                        this._newBlockBytes.readBytes(data, 0, data_len);

                        this._pAddDependency(this._cur_block_id.toString() + "#" + i, null, false, ParserUtils.byteArrayToImage(data), true);
                    }
                }

                // Ignore for now
                this.parseProperties(null);
                this._blocks[blockID].extras = this.parseUserAttributes();
                this._pPauseAndRetrieveDependencies();
                this._blocks[blockID].data = asset;

                if (this._debug) {
                    var textureStylesNames = ["external", "embed"];
                    console.log("Start parsing 6 " + textureStylesNames[type] + " Bitmaps for CubeTexture");
                }
            };

            //Block ID = 91
            AWDParser.prototype.parseSharedMethodBlock = function (blockID) {
                var asset;

                this._blocks[blockID].name = this.parseVarStr();
                asset = this.parseSharedMethodList(blockID);
                this.parseUserAttributes();
                this._blocks[blockID].data = asset;
                this._pFinalizeAsset(asset, this._blocks[blockID].name);
                this._blocks[blockID].data = asset;

                if (this._debug) {
                    console.log("Parsed a EffectMethod: Name = " + asset.name + " Type = " + asset);
                }
            };

            //Block ID = 92
            AWDParser.prototype.parseShadowMethodBlock = function (blockID) {
                var type;
                var data_len;
                var asset;
                var shadowLightID;
                this._blocks[blockID].name = this.parseVarStr();

                shadowLightID = this._newBlockBytes.readUnsignedInt();
                var returnedArray = this.getAssetByID(shadowLightID, [AssetType.LIGHT]);

                if (!returnedArray[0]) {
                    this._blocks[blockID].addError("Could not find the TargetLight (ID = " + shadowLightID + " ) for this ShadowMethod - ShadowMethod not created");
                    return;
                }

                asset = this.parseShadowMethodList(returnedArray[1], blockID);

                if (!asset)
                    return;

                this.parseUserAttributes(); // Ignore for now
                this._pFinalizeAsset(asset, this._blocks[blockID].name);
                this._blocks[blockID].data = asset;

                if (this._debug) {
                    console.log("Parsed a ShadowMapMethodMethod: Name = " + asset.name + " | Type = " + asset + " | Light-Name = ", returnedArray[1].name);
                }
            };

            //Block ID = 253
            AWDParser.prototype.parseCommand = function (blockID) {
                var hasBlocks = (this._newBlockBytes.readUnsignedByte() == 1);
                var par_id = this._newBlockBytes.readUnsignedInt();
                var mtx = this.parseMatrix3D();
                var name = this.parseVarStr();

                var parentObject;
                var targetObject;

                var returnedArray = this.getAssetByID(par_id, [AssetType.CONTAINER, AssetType.LIGHT, AssetType.MESH]);

                if (returnedArray[0]) {
                    parentObject = returnedArray[1];
                }

                var numCommands = this._newBlockBytes.readShort();
                var typeCommand = this._newBlockBytes.readShort();

                var props = this.parseProperties({ 1: AWDParser.BADDR });

                switch (typeCommand) {
                    case 1:
                        var targetID = props.get(1, 0);
                        var returnedArrayTarget = this.getAssetByID(targetID, [AssetType.LIGHT, AssetType.TEXTURE_PROJECTOR]);

                        if ((!returnedArrayTarget[0]) && (targetID != 0)) {
                            this._blocks[blockID].addError("Could not find the light (ID = " + targetID + " ( for this CommandBock!");
                            return;
                        }

                        targetObject = returnedArrayTarget[1];

                        if (parentObject) {
                            parentObject.addChild(targetObject);
                        }

                        targetObject.transform.matrix3D = mtx;

                        break;
                }

                if (targetObject) {
                    props = this.parseProperties({ 1: this._matrixNrType, 2: this._matrixNrType, 3: this._matrixNrType, 4: AWDParser.UINT8 });

                    targetObject.pivot = new away.geom.Vector3D(props.get(1, 0), props.get(2, 0), props.get(3, 0));
                    targetObject.extra = this.parseUserAttributes();
                }
                this._blocks[blockID].data = targetObject;

                if (this._debug) {
                    console.log("Parsed a CommandBlock: Name = '" + name);
                }
            };

            //blockID 255
            AWDParser.prototype.parseMetaData = function (blockID) {
                var props = this.parseProperties({ 1: AWDParser.UINT32, 2: AWDParser.AWDSTRING, 3: AWDParser.AWDSTRING, 4: AWDParser.AWDSTRING, 5: AWDParser.AWDSTRING });

                if (this._debug) {
                    console.log("Parsed a MetaDataBlock: TimeStamp         = " + props.get(1, 0));
                    console.log("                        EncoderName       = " + props.get(2, "unknown"));
                    console.log("                        EncoderVersion    = " + props.get(3, "unknown"));
                    console.log("                        GeneratorName     = " + props.get(4, "unknown"));
                    console.log("                        GeneratorVersion  = " + props.get(5, "unknown"));
                }
            };

            //blockID 254
            AWDParser.prototype.parseNameSpace = function (blockID) {
                var id = this._newBlockBytes.readUnsignedByte();
                var nameSpaceString = this.parseVarStr();
                if (this._debug)
                    console.log("Parsed a NameSpaceBlock: ID = " + id + " | String = " + nameSpaceString);
            };

            //--Parser UTILS---------------------------------------------------------------------------
            // this functions reads and creates a ShadowMethodMethod
            AWDParser.prototype.parseShadowMethodList = function (light, blockID) {
                var methodType = this._newBlockBytes.readUnsignedShort();
                var shadowMethod;
                var props = this.parseProperties({ 1: AWDParser.BADDR, 2: AWDParser.BADDR, 3: AWDParser.BADDR, 101: this._propsNrType, 102: this._propsNrType, 103: this._propsNrType, 201: AWDParser.UINT32, 202: AWDParser.UINT32, 301: AWDParser.UINT16, 302: AWDParser.UINT16, 401: AWDParser.UINT8, 402: AWDParser.UINT8, 601: AWDParser.COLOR, 602: AWDParser.COLOR, 701: AWDParser.BOOL, 702: AWDParser.BOOL, 801: AWDParser.MTX4x4 });

                var targetID;
                var returnedArray;
                switch (methodType) {
                    case 1002:
                        targetID = props.get(1, 0);
                        returnedArray = this.getAssetByID(targetID, [AssetType.SHADOW_MAP_METHOD]);
                        if (!returnedArray[0]) {
                            this._blocks[blockID].addError("Could not find the ShadowBaseMethod (ID = " + targetID + " ) for this ShadowNearMethod - ShadowMethod not created");
                            return shadowMethod;
                        }
                        shadowMethod = new ShadowNearMethod(returnedArray[1]);
                        break;
                    case 1101:
                        shadowMethod = new ShadowFilteredMethod(light);
                        shadowMethod.alpha = props.get(101, 1);
                        shadowMethod.epsilon = props.get(102, 0.002);
                        break;

                    case 1102:
                        shadowMethod = new ShadowDitheredMethod(light, props.get(201, 5));
                        shadowMethod.alpha = props.get(101, 1);
                        shadowMethod.epsilon = props.get(102, 0.002);
                        shadowMethod.range = props.get(103, 1);

                        break;
                    case 1103:
                        shadowMethod = new ShadowSoftMethod(light, props.get(201, 5));
                        shadowMethod.alpha = props.get(101, 1);
                        shadowMethod.epsilon = props.get(102, 0.002);
                        shadowMethod.range = props.get(103, 1);

                        break;
                    case 1104:
                        shadowMethod = new ShadowHardMethod(light);
                        shadowMethod.alpha = props.get(101, 1);
                        shadowMethod.epsilon = props.get(102, 0.002);
                        break;
                }
                this.parseUserAttributes();
                return shadowMethod;
            };

            //Block ID 101
            AWDParser.prototype.parseSkeleton = function (blockID /*uint*/ ) {
                var name = this.parseVarStr();
                var num_joints = this._newBlockBytes.readUnsignedShort();
                var skeleton = new Skeleton();
                this.parseProperties(null); // Discard properties for now

                var joints_parsed = 0;
                while (joints_parsed < num_joints) {
                    var joint;
                    var ibp;

                    // Ignore joint id
                    this._newBlockBytes.readUnsignedShort();
                    joint = new SkeletonJoint();
                    joint.parentIndex = this._newBlockBytes.readUnsignedShort() - 1; // 0=null in AWD
                    joint.name = this.parseVarStr();

                    ibp = this.parseMatrix3D();
                    joint.inverseBindPose = ibp.rawData;

                    // Ignore joint props/attributes for now
                    this.parseProperties(null);
                    this.parseUserAttributes();
                    skeleton.joints.push(joint);
                    joints_parsed++;
                }

                // Discard attributes for now
                this.parseUserAttributes();
                this._pFinalizeAsset(skeleton, name);
                this._blocks[blockID].data = skeleton;
                if (this._debug)
                    console.log("Parsed a Skeleton: Name = " + skeleton.name + " | Number of Joints = " + joints_parsed);
            };

            //Block ID = 102
            AWDParser.prototype.parseSkeletonPose = function (blockID /*uint*/ ) {
                var name = this.parseVarStr();
                var num_joints = this._newBlockBytes.readUnsignedShort();
                this.parseProperties(null); // Ignore properties for now

                var pose = new SkeletonPose();

                var joints_parsed = 0;
                while (joints_parsed < num_joints) {
                    var joint_pose;
                    var has_transform;
                    joint_pose = new JointPose();
                    has_transform = this._newBlockBytes.readUnsignedByte();
                    if (has_transform == 1) {
                        var mtx_data = this.parseMatrix43RawData();

                        var mtx = new Matrix3D(mtx_data);
                        joint_pose.orientation.fromMatrix(mtx);
                        joint_pose.translation.copyFrom(mtx.position);

                        pose.jointPoses[joints_parsed] = joint_pose;
                    }
                    joints_parsed++;
                }

                // Skip attributes for now
                this.parseUserAttributes();
                this._pFinalizeAsset(pose, name);
                this._blocks[blockID].data = pose;
                if (this._debug)
                    console.log("Parsed a SkeletonPose: Name = " + pose.name + " | Number of Joints = " + joints_parsed);
            };

            //blockID 103
            AWDParser.prototype.parseSkeletonAnimation = function (blockID /*uint*/ ) {
                var frame_dur;
                var pose_addr;
                var name = this.parseVarStr();
                var clip = new SkeletonClipNode();
                var num_frames = this._newBlockBytes.readUnsignedShort();
                this.parseProperties(null); // Ignore properties for now

                var frames_parsed = 0;
                var returnedArray;
                while (frames_parsed < num_frames) {
                    pose_addr = this._newBlockBytes.readUnsignedInt();
                    frame_dur = this._newBlockBytes.readUnsignedShort();
                    returnedArray = this.getAssetByID(pose_addr, [AssetType.SKELETON_POSE]);
                    if (!returnedArray[0])
                        this._blocks[blockID].addError("Could not find the SkeletonPose Frame # " + frames_parsed + " (ID = " + pose_addr + " ) for this SkeletonClipNode");
                    else
                        clip.addFrame(this._blocks[pose_addr].data, frame_dur);
                    frames_parsed++;
                }
                if (clip.frames.length == 0) {
                    this._blocks[blockID].addError("Could not this SkeletonClipNode, because no Frames where set.");
                    return;
                }

                // Ignore attributes for now
                this.parseUserAttributes();
                this._pFinalizeAsset(clip, name);
                this._blocks[blockID].data = clip;
                if (this._debug)
                    console.log("Parsed a SkeletonClipNode: Name = " + clip.name + " | Number of Frames = " + clip.frames.length);
            };

            //Block ID = 111 /  Block ID = 112
            AWDParser.prototype.parseMeshPoseAnimation = function (blockID /*uint*/ , poseOnly) {
                if (typeof poseOnly === "undefined") { poseOnly = false; }
                var num_frames = 1;
                var num_submeshes;
                var frames_parsed;
                var subMeshParsed;
                var frame_dur;
                var x;
                var y;
                var z;
                var str_len;
                var str_end;
                var geometry;
                var subGeom;
                var idx = 0;
                var clip = new VertexClipNode();
                var indices;
                var verts;
                var num_Streams = 0;
                var streamsParsed = 0;
                var streamtypes = new Array();
                var props;
                var thisGeo;
                var name = this.parseVarStr();
                var geoAdress = this._newBlockBytes.readUnsignedInt();
                var returnedArray = this.getAssetByID(geoAdress, [AssetType.GEOMETRY]);
                if (!returnedArray[0]) {
                    this._blocks[blockID].addError("Could not find the target-Geometry-Object " + geoAdress + " ) for this VertexClipNode");
                    return;
                }
                var uvs = this.getUVForVertexAnimation(geoAdress);
                if (!poseOnly)
                    num_frames = this._newBlockBytes.readUnsignedShort();

                num_submeshes = this._newBlockBytes.readUnsignedShort();
                num_Streams = this._newBlockBytes.readUnsignedShort();
                streamsParsed = 0;
                while (streamsParsed < num_Streams) {
                    streamtypes.push(this._newBlockBytes.readUnsignedShort());
                    streamsParsed++;
                }
                props = this.parseProperties({ 1: AWDParser.BOOL, 2: AWDParser.BOOL });

                clip.looping = props.get(1, true);
                clip.stitchFinalFrame = props.get(2, false);

                frames_parsed = 0;
                while (frames_parsed < num_frames) {
                    frame_dur = this._newBlockBytes.readUnsignedShort();
                    geometry = new Geometry();
                    subMeshParsed = 0;
                    while (subMeshParsed < num_submeshes) {
                        streamsParsed = 0;
                        str_len = this._newBlockBytes.readUnsignedInt();
                        str_end = this._newBlockBytes.position + str_len;
                        while (streamsParsed < num_Streams) {
                            if (streamtypes[streamsParsed] == 1) {
                                indices = returnedArray[1].subGeometries[subMeshParsed].indices;
                                verts = new Array();
                                idx = 0;
                                while (this._newBlockBytes.position < str_end) {
                                    x = this.readNumber(this._accuracyGeo);
                                    y = this.readNumber(this._accuracyGeo);
                                    z = this.readNumber(this._accuracyGeo);
                                    verts[idx++] = x;
                                    verts[idx++] = y;
                                    verts[idx++] = z;
                                }
                                subGeom = new TriangleSubGeometry(true);
                                subGeom.updateIndices(indices);
                                subGeom.updatePositions(verts);
                                subGeom.updateUVs(uvs[subMeshParsed]);
                                subGeom.updateVertexNormals(null);
                                subGeom.updateVertexTangents(null);
                                subGeom.autoDeriveNormals = false;
                                subGeom.autoDeriveTangents = false;
                                subMeshParsed++;
                                geometry.addSubGeometry(subGeom);
                            } else
                                this._newBlockBytes.position = str_end;
                            streamsParsed++;
                        }
                    }
                    clip.addFrame(geometry, frame_dur);
                    frames_parsed++;
                }
                this.parseUserAttributes();
                this._pFinalizeAsset(clip, name);

                this._blocks[blockID].data = clip;
                if (this._debug)
                    console.log("Parsed a VertexClipNode: Name = " + clip.name + " | Target-Geometry-Name = " + returnedArray[1].name + " | Number of Frames = " + clip.frames.length);
            };

            //BlockID 113
            AWDParser.prototype.parseVertexAnimationSet = function (blockID /*uint*/ ) {
                var poseBlockAdress;
                var outputString = "";
                var name = this.parseVarStr();
                var num_frames = this._newBlockBytes.readUnsignedShort();
                var props = this.parseProperties({ 1: AWDParser.UINT16 });
                var frames_parsed = 0;
                var skeletonFrames = new Array();
                var vertexFrames = new Array();
                while (frames_parsed < num_frames) {
                    poseBlockAdress = this._newBlockBytes.readUnsignedInt();
                    var returnedArray = this.getAssetByID(poseBlockAdress, [AssetType.ANIMATION_NODE]);
                    if (!returnedArray[0])
                        this._blocks[blockID].addError("Could not find the AnimationClipNode Nr " + frames_parsed + " ( " + poseBlockAdress + " ) for this AnimationSet");
                    else {
                        if (returnedArray[1] instanceof VertexClipNode)
                            vertexFrames.push(returnedArray[1]);
                        if (returnedArray[1] instanceof SkeletonClipNode)
                            skeletonFrames.push(returnedArray[1]);
                    }
                    frames_parsed++;
                }
                if ((vertexFrames.length == 0) && (skeletonFrames.length == 0)) {
                    this._blocks[blockID].addError("Could not create this AnimationSet, because it contains no animations");
                    return;
                }
                this.parseUserAttributes();
                if (vertexFrames.length > 0) {
                    var newVertexAnimationSet = new VertexAnimationSet();
                    for (var i = 0; i < vertexFrames.length; i++)
                        newVertexAnimationSet.addAnimation(vertexFrames[i]);
                    this._pFinalizeAsset(newVertexAnimationSet, name);
                    this._blocks[blockID].data = newVertexAnimationSet;
                    if (this._debug)
                        console.log("Parsed a VertexAnimationSet: Name = " + name + " | Animations = " + newVertexAnimationSet.animations.length + " | Animation-Names = " + newVertexAnimationSet.animationNames.toString());
                } else if (skeletonFrames.length > 0) {
                    returnedArray = this.getAssetByID(poseBlockAdress, [AssetType.ANIMATION_NODE]);
                    var newSkeletonAnimationSet = new SkeletonAnimationSet(props.get(1, 4));
                    for (var i = 0; i < skeletonFrames.length; i++)
                        newSkeletonAnimationSet.addAnimation(skeletonFrames[i]);
                    this._pFinalizeAsset(newSkeletonAnimationSet, name);
                    this._blocks[blockID].data = newSkeletonAnimationSet;
                    if (this._debug)
                        console.log("Parsed a SkeletonAnimationSet: Name = " + name + " | Animations = " + newSkeletonAnimationSet.animations.length + " | Animation-Names = " + newSkeletonAnimationSet.animationNames.toString());
                }
            };

            //BlockID 122
            AWDParser.prototype.parseAnimatorSet = function (blockID /*uint*/ ) {
                var targetMesh;
                var animSetBlockAdress;
                var targetAnimationSet;
                var outputString = "";
                var name = this.parseVarStr();
                var type = this._newBlockBytes.readUnsignedShort();

                var props = this.parseProperties({ 1: AWDParser.BADDR });

                animSetBlockAdress = this._newBlockBytes.readUnsignedInt();
                var targetMeshLength = this._newBlockBytes.readUnsignedShort();
                var meshAdresses = new Array();
                for (var i = 0; i < targetMeshLength; i++)
                    meshAdresses.push(this._newBlockBytes.readUnsignedInt());

                var activeState = this._newBlockBytes.readUnsignedShort();
                var autoplay = (this._newBlockBytes.readUnsignedByte() == 1);
                this.parseUserAttributes();
                this.parseUserAttributes();

                var returnedArray;
                var targetMeshes = new Array();

                for (i = 0; i < meshAdresses.length; i++) {
                    returnedArray = this.getAssetByID(meshAdresses[i], [AssetType.MESH]);
                    if (returnedArray[0])
                        targetMeshes.push(returnedArray[1]);
                }
                returnedArray = this.getAssetByID(animSetBlockAdress, [AssetType.ANIMATION_SET]);
                if (!returnedArray[0]) {
                    this._blocks[blockID].addError("Could not find the AnimationSet ( " + animSetBlockAdress + " ) for this Animator");
                    ;
                    return;
                }
                targetAnimationSet = returnedArray[1];
                var thisAnimator;
                if (type == 1) {
                    returnedArray = this.getAssetByID(props.get(1, 0), [AssetType.SKELETON]);
                    if (!returnedArray[0]) {
                        this._blocks[blockID].addError("Could not find the Skeleton ( " + props.get(1, 0) + " ) for this Animator");
                        return;
                    }
                    thisAnimator = new SkeletonAnimator(targetAnimationSet, returnedArray[1]);
                } else if (type == 2)
                    thisAnimator = new VertexAnimator(targetAnimationSet);

                this._pFinalizeAsset(thisAnimator, name);
                this._blocks[blockID].data = thisAnimator;
                for (i = 0; i < targetMeshes.length; i++) {
                    if (type == 1)
                        targetMeshes[i].animator = thisAnimator;
                    if (type == 2)
                        targetMeshes[i].animator = thisAnimator;
                }
                if (this._debug)
                    console.log("Parsed a Animator: Name = " + name);
            };

            // this functions reads and creates a EffectMethod
            AWDParser.prototype.parseSharedMethodList = function (blockID) {
                var methodType = this._newBlockBytes.readUnsignedShort();
                var effectMethodReturn;

                var props = this.parseProperties({ 1: AWDParser.BADDR, 2: AWDParser.BADDR, 3: AWDParser.BADDR, 101: this._propsNrType, 102: this._propsNrType, 103: this._propsNrType, 104: this._propsNrType, 105: this._propsNrType, 106: this._propsNrType, 107: this._propsNrType, 201: AWDParser.UINT32, 202: AWDParser.UINT32, 301: AWDParser.UINT16, 302: AWDParser.UINT16, 401: AWDParser.UINT8, 402: AWDParser.UINT8, 601: AWDParser.COLOR, 602: AWDParser.COLOR, 701: AWDParser.BOOL, 702: AWDParser.BOOL });
                var targetID;
                var returnedArray;

                switch (methodType) {
                    case 401:
                        effectMethodReturn = new EffectColorMatrixMethod(props.get(101, new Array(0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)));
                        break;
                    case 402:
                        effectMethodReturn = new EffectColorTransformMethod();
                        var offCol = props.get(601, 0x00000000);
                        effectMethodReturn.colorTransform = new ColorTransform(props.get(102, 1), props.get(103, 1), props.get(104, 1), props.get(101, 1), ((offCol >> 16) & 0xFF), ((offCol >> 8) & 0xFF), (offCol & 0xFF), ((offCol >> 24) & 0xFF));
                        break;
                    case 403:
                        targetID = props.get(1, 0);
                        console.log('ENV MAP', targetID);

                        returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE], "CubeTexture");
                        if (!returnedArray[0])
                            this._blocks[blockID].addError("Could not find the EnvMap (ID = " + targetID + " ) for this EnvMapMethod");
                        effectMethodReturn = new EffectEnvMapMethod(returnedArray[1], props.get(101, 1));
                        targetID = props.get(2, 0);
                        if (targetID > 0) {
                            returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE]);
                            if (!returnedArray[0])
                                this._blocks[blockID].addError("Could not find the Mask-texture (ID = " + targetID + " ) for this EnvMapMethod");
                            // Todo: test mask with EnvMapMethod
                            //(<EnvMapMethod> effectMethodReturn).mask = <Texture2DBase> returnedArray[1];
                        }
                        break;
                    case 404:
                        targetID = props.get(1, 0);
                        returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE]);
                        if (!returnedArray[0])
                            this._blocks[blockID].addError("Could not find the LightMap (ID = " + targetID + " ) for this LightMapMethod");
                        effectMethodReturn = new EffectLightMapMethod(returnedArray[1], this.blendModeDic[props.get(401, 10)]); //usesecondaryUV not set
                        break;

                    case 406:
                        effectMethodReturn = new EffectRimLightMethod(props.get(601, 0xffffff), props.get(101, 0.4), props.get(101, 2)); //blendMode
                        break;
                    case 407:
                        targetID = props.get(1, 0);
                        returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE]);
                        if (!returnedArray[0])
                            this._blocks[blockID].addError("Could not find the Alpha-texture (ID = " + targetID + " ) for this AlphaMaskMethod");
                        effectMethodReturn = new EffectAlphaMaskMethod(returnedArray[1], props.get(701, false));
                        break;

                    case 410:
                        targetID = props.get(1, 0);
                        returnedArray = this.getAssetByID(targetID, [AssetType.TEXTURE], "CubeTexture");
                        if (!returnedArray[0])
                            this._blocks[blockID].addError("Could not find the EnvMap (ID = " + targetID + " ) for this FresnelEnvMapMethod");
                        effectMethodReturn = new EffectFresnelEnvMapMethod(returnedArray[1], props.get(101, 1));
                        break;
                    case 411:
                        effectMethodReturn = new EffectFogMethod(props.get(101, 0), props.get(102, 1000), props.get(601, 0x808080));
                        break;
                }
                this.parseUserAttributes();
                return effectMethodReturn;
            };

            AWDParser.prototype.parseUserAttributes = function () {
                var attributes;
                var list_len;
                var attibuteCnt;

                list_len = this._newBlockBytes.readUnsignedInt();

                if (list_len > 0) {
                    var list_end;

                    attributes = {};

                    list_end = this._newBlockBytes.position + list_len;

                    while (this._newBlockBytes.position < list_end) {
                        var ns_id;
                        var attr_key;
                        var attr_type;
                        var attr_len;
                        var attr_val;

                        // TODO: Properly tend to namespaces in attributes
                        ns_id = this._newBlockBytes.readUnsignedByte();
                        attr_key = this.parseVarStr();
                        attr_type = this._newBlockBytes.readUnsignedByte();
                        attr_len = this._newBlockBytes.readUnsignedInt();

                        if ((this._newBlockBytes.position + attr_len) > list_end) {
                            console.log("           Error in reading attribute # " + attibuteCnt + " = skipped to end of attribute-list");
                            this._newBlockBytes.position = list_end;
                            return attributes;
                        }

                        switch (attr_type) {
                            case AWDParser.AWDSTRING:
                                attr_val = this._newBlockBytes.readUTFBytes(attr_len);
                                break;
                            case AWDParser.INT8:
                                attr_val = this._newBlockBytes.readByte();
                                break;
                            case AWDParser.INT16:
                                attr_val = this._newBlockBytes.readShort();
                                break;
                            case AWDParser.INT32:
                                attr_val = this._newBlockBytes.readInt();
                                break;
                            case AWDParser.BOOL:
                            case AWDParser.UINT8:
                                attr_val = this._newBlockBytes.readUnsignedByte();
                                break;
                            case AWDParser.UINT16:
                                attr_val = this._newBlockBytes.readUnsignedShort();
                                break;
                            case AWDParser.UINT32:
                            case AWDParser.BADDR:
                                attr_val = this._newBlockBytes.readUnsignedInt();
                                break;
                            case AWDParser.FLOAT32:
                                attr_val = this._newBlockBytes.readFloat();
                                break;
                            case AWDParser.FLOAT64:
                                attr_val = this._newBlockBytes.readDouble();
                                break;
                            default:
                                attr_val = 'unimplemented attribute type ' + attr_type;
                                this._newBlockBytes.position += attr_len;
                                break;
                        }

                        if (this._debug) {
                            console.log("attribute = name: " + attr_key + "  / value = " + attr_val);
                        }

                        attributes[attr_key] = attr_val;
                        attibuteCnt += 1;
                    }
                }

                return attributes;
            };

            AWDParser.prototype.parseProperties = function (expected) {
                var list_end;
                var list_len;
                var propertyCnt = 0;
                var props = new AWDProperties();

                list_len = this._newBlockBytes.readUnsignedInt();
                list_end = this._newBlockBytes.position + list_len;

                if (expected) {
                    while (this._newBlockBytes.position < list_end) {
                        var len;
                        var key;
                        var type;

                        key = this._newBlockBytes.readUnsignedShort();
                        len = this._newBlockBytes.readUnsignedInt();

                        if ((this._newBlockBytes.position + len) > list_end) {
                            console.log("           Error in reading property # " + propertyCnt + " = skipped to end of propertie-list");
                            this._newBlockBytes.position = list_end;
                            return props;
                        }

                        if (expected.hasOwnProperty(key.toString())) {
                            type = expected[key];
                            props.set(key, this.parseAttrValue(type, len));
                        } else {
                            this._newBlockBytes.position += len;
                        }

                        propertyCnt += 1;
                    }
                } else {
                    this._newBlockBytes.position = list_end;
                }

                return props;
            };

            AWDParser.prototype.parseAttrValue = function (type, len) {
                var elem_len;
                var read_func;

                switch (type) {
                    case AWDParser.BOOL:
                    case AWDParser.INT8:
                        elem_len = 1;
                        read_func = this._newBlockBytes.readByte;
                        break;

                    case AWDParser.INT16:
                        elem_len = 2;
                        read_func = this._newBlockBytes.readShort;
                        break;

                    case AWDParser.INT32:
                        elem_len = 4;
                        read_func = this._newBlockBytes.readInt;
                        break;

                    case AWDParser.UINT8:
                        elem_len = 1;
                        read_func = this._newBlockBytes.readUnsignedByte;
                        break;

                    case AWDParser.UINT16:
                        elem_len = 2;
                        read_func = this._newBlockBytes.readUnsignedShort;
                        break;

                    case AWDParser.UINT32:
                    case AWDParser.COLOR:
                    case AWDParser.BADDR:
                        elem_len = 4;
                        read_func = this._newBlockBytes.readUnsignedInt;
                        break;

                    case AWDParser.FLOAT32:
                        elem_len = 4;
                        read_func = this._newBlockBytes.readFloat;
                        break;

                    case AWDParser.FLOAT64:
                        elem_len = 8;
                        read_func = this._newBlockBytes.readDouble;
                        break;

                    case AWDParser.AWDSTRING:
                        return this._newBlockBytes.readUTFBytes(len);

                    case AWDParser.VECTOR2x1:
                    case AWDParser.VECTOR3x1:
                    case AWDParser.VECTOR4x1:
                    case AWDParser.MTX3x2:
                    case AWDParser.MTX3x3:
                    case AWDParser.MTX4x3:
                    case AWDParser.MTX4x4:
                        elem_len = 8;
                        read_func = this._newBlockBytes.readDouble;
                        break;
                }

                if (elem_len < len) {
                    var list = [];
                    var num_read = 0;
                    var num_elems = len / elem_len;

                    while (num_read < num_elems) {
                        list.push(read_func.apply(this._newBlockBytes)); // list.push(read_func());
                        num_read++;
                    }

                    return list;
                } else {
                    var val = read_func.apply(this._newBlockBytes);
                    return val;
                }
            };

            AWDParser.prototype.parseHeader = function () {
                var flags;
                var body_len;

                this._byteData.position = 3; // Skip magic string and parse version

                this._version[0] = this._byteData.readUnsignedByte();
                this._version[1] = this._byteData.readUnsignedByte();

                flags = this._byteData.readUnsignedShort(); // Parse bit flags

                this._streaming = bitFlags.test(flags, bitFlags.FLAG1);

                if ((this._version[0] == 2) && (this._version[1] == 1)) {
                    this._accuracyMatrix = bitFlags.test(flags, bitFlags.FLAG2);
                    this._accuracyGeo = bitFlags.test(flags, bitFlags.FLAG3);
                    this._accuracyProps = bitFlags.test(flags, bitFlags.FLAG4);
                }

                // if we set _accuracyOnBlocks, the precision-values are read from each block-header.
                // set storagePrecision types
                this._geoNrType = AWDParser.FLOAT32;

                if (this._accuracyGeo) {
                    this._geoNrType = AWDParser.FLOAT64;
                }

                this._matrixNrType = AWDParser.FLOAT32;

                if (this._accuracyMatrix) {
                    this._matrixNrType = AWDParser.FLOAT64;
                }

                this._propsNrType = AWDParser.FLOAT32;

                if (this._accuracyProps) {
                    this._propsNrType = AWDParser.FLOAT64;
                }

                this._compression = this._byteData.readUnsignedByte(); // compression

                if (this._debug) {
                    console.log("Import AWDFile of version = " + this._version[0] + " - " + this._version[1]);
                    console.log("Global Settings = Compression = " + this._compression + " | Streaming = " + this._streaming + " | Matrix-Precision = " + this._accuracyMatrix + " | Geometry-Precision = " + this._accuracyGeo + " | Properties-Precision = " + this._accuracyProps);
                }

                // Check file integrity
                body_len = this._byteData.readUnsignedInt();
                if (!this._streaming && body_len != this._byteData.getBytesAvailable()) {
                    this._pDieWithError('AWD2 body length does not match header integrity field');
                }
            };

            // Helper - functions
            AWDParser.prototype.getUVForVertexAnimation = function (meshID /*uint*/ ) {
                if (this._blocks[meshID].data instanceof Mesh)
                    meshID = this._blocks[meshID].geoID;
                if (this._blocks[meshID].uvsForVertexAnimation)
                    return this._blocks[meshID].uvsForVertexAnimation;
                var geometry = this._blocks[meshID].data;
                var geoCnt = 0;
                var ud;
                var uStride;
                var uOffs;
                var numPoints;
                var i;
                var newUvs;
                var sub_geom;
                this._blocks[meshID].uvsForVertexAnimation = new Array();
                while (geoCnt < geometry.subGeometries.length) {
                    newUvs = new Array();
                    sub_geom = geometry.subGeometries[geoCnt];
                    numPoints = sub_geom.numVertices;
                    ud = sub_geom.uvs;
                    uStride = sub_geom.getStride(TriangleSubGeometry.UV_DATA);
                    uOffs = sub_geom.getOffset(TriangleSubGeometry.UV_DATA);
                    for (i = 0; i < numPoints; i++) {
                        newUvs.push(ud[uOffs + i * uStride + 0]);
                        newUvs.push(ud[uOffs + i * uStride + 1]);
                    }
                    this._blocks[meshID].uvsForVertexAnimation.push(newUvs);
                    geoCnt++;
                }
                return this._blocks[meshID].uvsForVertexAnimation;
            };

            AWDParser.prototype.parseVarStr = function () {
                var len = this._newBlockBytes.readUnsignedShort();
                return this._newBlockBytes.readUTFBytes(len);
            };

            AWDParser.prototype.getAssetByID = function (assetID, assetTypesToGet, extraTypeInfo) {
                if (typeof extraTypeInfo === "undefined") { extraTypeInfo = "SingleTexture"; }
                var returnArray = new Array();
                var typeCnt = 0;
                if (assetID > 0) {
                    if (this._blocks[assetID]) {
                        if (this._blocks[assetID].data) {
                            while (typeCnt < assetTypesToGet.length) {
                                var iasset = this._blocks[assetID].data;

                                if (iasset.assetType == assetTypesToGet[typeCnt]) {
                                    //if the right assetType was found
                                    if ((assetTypesToGet[typeCnt] == AssetType.TEXTURE) && (extraTypeInfo == "CubeTexture")) {
                                        if (this._blocks[assetID].data instanceof ImageCubeTexture) {
                                            returnArray.push(true);
                                            returnArray.push(this._blocks[assetID].data);
                                            return returnArray;
                                        }
                                    }
                                    if ((assetTypesToGet[typeCnt] == AssetType.TEXTURE) && (extraTypeInfo == "SingleTexture")) {
                                        if (this._blocks[assetID].data instanceof ImageTexture) {
                                            returnArray.push(true);
                                            returnArray.push(this._blocks[assetID].data);
                                            return returnArray;
                                        }
                                    } else {
                                        returnArray.push(true);
                                        returnArray.push(this._blocks[assetID].data);
                                        return returnArray;
                                    }
                                }

                                //if ((assetTypesToGet[typeCnt] == AssetType.GEOMETRY) && (IAsset(_blocks[assetID].data).assetType == AssetType.MESH)) {
                                if ((assetTypesToGet[typeCnt] == AssetType.GEOMETRY) && (iasset.assetType == AssetType.MESH)) {
                                    var mesh = this._blocks[assetID].data;

                                    returnArray.push(true);
                                    returnArray.push(mesh.geometry);
                                    return returnArray;
                                }

                                typeCnt++;
                            }
                        }
                    }
                }

                // if the has not returned anything yet, the asset is not found, or the found asset is not the right type.
                returnArray.push(false);
                returnArray.push(this.getDefaultAsset(assetTypesToGet[0], extraTypeInfo));
                return returnArray;
            };

            AWDParser.prototype.getDefaultAsset = function (assetType, extraTypeInfo) {
                switch (true) {
                    case (assetType == AssetType.TEXTURE):
                        if (extraTypeInfo == "CubeTexture")
                            return this.getDefaultCubeTexture();
                        if (extraTypeInfo == "SingleTexture")
                            return this.getDefaultTexture();
                        break;
                    case (assetType == AssetType.MATERIAL):
                        return this.getDefaultMaterial();
                        break;
                    default:
                        break;
                }

                return null;
            };

            AWDParser.prototype.getDefaultMaterial = function () {
                if (!this._defaultBitmapMaterial)
                    this._defaultBitmapMaterial = DefaultMaterialManager.getDefaultMaterial();

                return this._defaultBitmapMaterial;
            };

            AWDParser.prototype.getDefaultTexture = function () {
                if (!this._defaultTexture)
                    this._defaultTexture = DefaultMaterialManager.getDefaultTexture();

                return this._defaultTexture;
            };

            AWDParser.prototype.getDefaultCubeTexture = function () {
                if (!this._defaultCubeTexture) {
                    var defaultBitmap = DefaultMaterialManager.createCheckeredBitmapData();

                    this._defaultCubeTexture = new BitmapCubeTexture(defaultBitmap, defaultBitmap, defaultBitmap, defaultBitmap, defaultBitmap, defaultBitmap);
                    this._defaultCubeTexture.name = "defaultCubeTexture";
                }

                return this._defaultCubeTexture;
            };

            AWDParser.prototype.readNumber = function (precision) {
                if (typeof precision === "undefined") { precision = false; }
                if (precision)
                    return this._newBlockBytes.readDouble();
                return this._newBlockBytes.readFloat();
            };

            AWDParser.prototype.parseMatrix3D = function () {
                return new Matrix3D(this.parseMatrix43RawData());
            };

            AWDParser.prototype.parseMatrix32RawData = function () {
                var i;
                var mtx_raw = new Array(6);
                for (i = 0; i < 6; i++) {
                    mtx_raw[i] = this._newBlockBytes.readFloat();
                }

                return mtx_raw;
            };

            AWDParser.prototype.parseMatrix43RawData = function () {
                var mtx_raw = new Array(16);

                mtx_raw[0] = this.readNumber(this._accuracyMatrix);
                mtx_raw[1] = this.readNumber(this._accuracyMatrix);
                mtx_raw[2] = this.readNumber(this._accuracyMatrix);
                mtx_raw[3] = 0.0;
                mtx_raw[4] = this.readNumber(this._accuracyMatrix);
                mtx_raw[5] = this.readNumber(this._accuracyMatrix);
                mtx_raw[6] = this.readNumber(this._accuracyMatrix);
                mtx_raw[7] = 0.0;
                mtx_raw[8] = this.readNumber(this._accuracyMatrix);
                mtx_raw[9] = this.readNumber(this._accuracyMatrix);
                mtx_raw[10] = this.readNumber(this._accuracyMatrix);
                mtx_raw[11] = 0.0;
                mtx_raw[12] = this.readNumber(this._accuracyMatrix);
                mtx_raw[13] = this.readNumber(this._accuracyMatrix);
                mtx_raw[14] = this.readNumber(this._accuracyMatrix);
                mtx_raw[15] = 1.0;

                //TODO: fix max exporter to remove NaN values in joint 0 inverse bind pose
                if (isNaN(mtx_raw[0])) {
                    mtx_raw[0] = 1;
                    mtx_raw[1] = 0;
                    mtx_raw[2] = 0;
                    mtx_raw[4] = 0;
                    mtx_raw[5] = 1;
                    mtx_raw[6] = 0;
                    mtx_raw[8] = 0;
                    mtx_raw[9] = 0;
                    mtx_raw[10] = 1;
                    mtx_raw[12] = 0;
                    mtx_raw[13] = 0;
                    mtx_raw[14] = 0;
                }

                return mtx_raw;
            };
            AWDParser.COMPRESSIONMODE_LZMA = "lzma";
            AWDParser.UNCOMPRESSED = 0;
            AWDParser.DEFLATE = 1;
            AWDParser.LZMA = 2;
            AWDParser.INT8 = 1;
            AWDParser.INT16 = 2;
            AWDParser.INT32 = 3;
            AWDParser.UINT8 = 4;
            AWDParser.UINT16 = 5;
            AWDParser.UINT32 = 6;
            AWDParser.FLOAT32 = 7;
            AWDParser.FLOAT64 = 8;
            AWDParser.BOOL = 21;
            AWDParser.COLOR = 22;
            AWDParser.BADDR = 23;
            AWDParser.AWDSTRING = 31;
            AWDParser.AWDBYTEARRAY = 32;
            AWDParser.VECTOR2x1 = 41;
            AWDParser.VECTOR3x1 = 42;
            AWDParser.VECTOR4x1 = 43;
            AWDParser.MTX3x2 = 44;
            AWDParser.MTX3x3 = 45;
            AWDParser.MTX4x3 = 46;
            AWDParser.MTX4x4 = 47;
            return AWDParser;
        })(away.parsers.ParserBase);
        parsers.AWDParser = AWDParser;
    })(away.parsers || (away.parsers = {}));
    var parsers = away.parsers;
})(away || (away = {}));

var AWDBlock = (function () {
    function AWDBlock() {
    }
    AWDBlock.prototype.dispose = function () {
        this.id = null;
        this.bytes = null;
        this.errorMessages = null;
        this.uvsForVertexAnimation = null;
    };

    AWDBlock.prototype.addError = function (errorMsg) {
        if (!this.errorMessages)
            this.errorMessages = new Array();
        this.errorMessages.push(errorMsg);
    };
    return AWDBlock;
})();

var bitFlags = (function () {
    function bitFlags() {
    }
    bitFlags.test = function (flags, testFlag) {
        return (flags & testFlag) == testFlag;
    };
    bitFlags.FLAG1 = 1;
    bitFlags.FLAG2 = 2;
    bitFlags.FLAG3 = 4;
    bitFlags.FLAG4 = 8;
    bitFlags.FLAG5 = 16;
    bitFlags.FLAG6 = 32;
    bitFlags.FLAG7 = 64;
    bitFlags.FLAG8 = 128;
    bitFlags.FLAG9 = 256;
    bitFlags.FLAG10 = 512;
    bitFlags.FLAG11 = 1024;
    bitFlags.FLAG12 = 2048;
    bitFlags.FLAG13 = 4096;
    bitFlags.FLAG14 = 8192;
    bitFlags.FLAG15 = 16384;
    bitFlags.FLAG16 = 32768;
    return bitFlags;
})();

var AWDProperties = (function () {
    function AWDProperties() {
    }
    AWDProperties.prototype.set = function (key, value) {
        this[key.toString()] = value;
    };

    AWDProperties.prototype.get = function (key, fallback) {
        if (this.hasOwnProperty(key.toString())) {
            return this[key.toString()];
        } else {
            return fallback;
        }
    };
    return AWDProperties;
})();
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (parsers) {
        var SubGeometry = away.base.TriangleSubGeometry;
        var DefaultMaterialManager = away.materials.DefaultMaterialManager;
        var TriangleMethodMaterial = away.materials.TriangleMethodMaterial;
        var TriangleMaterialMode = away.materials.TriangleMaterialMode;
        var URLLoaderDataFormat = away.net.URLLoaderDataFormat;

        /**
        * Max3DSParser provides a parser for the 3ds data type.
        */
        var Max3DSParser = (function (_super) {
            __extends(Max3DSParser, _super);
            /**
            * Creates a new <code>Max3DSParser</code> object.
            *
            * @param useSmoothingGroups Determines whether the parser looks for smoothing groups in the 3ds file or assumes uniform smoothing. Defaults to true.
            */
            function Max3DSParser(useSmoothingGroups) {
                if (typeof useSmoothingGroups === "undefined") { useSmoothingGroups = true; }
                _super.call(this, URLLoaderDataFormat.ARRAY_BUFFER);

                this._useSmoothingGroups = useSmoothingGroups;
            }
            /**
            * Indicates whether or not a given file extension is supported by the parser.
            * @param extension The file extension of a potential file to be parsed.
            * @return Whether or not the given file type is supported.
            */
            Max3DSParser.supportsType = function (extension) {
                extension = extension.toLowerCase();
                return extension == "3ds";
            };

            /**
            * Tests whether a data block can be parsed by the parser.
            * @param data The data block to potentially be parsed.
            * @return Whether or not the given data is supported.
            */
            Max3DSParser.supportsData = function (data) {
                var ba;

                ba = parsers.ParserUtils.toByteArray(data);
                if (ba) {
                    ba.position = 0;
                    if (ba.readShort() == 0x4d4d)
                        return true;
                }

                return false;
            };

            /**
            * @inheritDoc
            */
            Max3DSParser.prototype._iResolveDependency = function (resourceDependency) {
                if (resourceDependency.assets.length == 1) {
                    var asset;

                    asset = resourceDependency.assets[0];
                    if (asset.assetType == away.library.AssetType.TEXTURE) {
                        var tex;

                        tex = this._textures[resourceDependency.id];
                        tex.texture = asset;
                    }
                }
            };

            /**
            * @inheritDoc
            */
            Max3DSParser.prototype._iResolveDependencyFailure = function (resourceDependency) {
                // TODO: Implement
            };

            /**
            * @inheritDoc
            */
            Max3DSParser.prototype._pProceedParsing = function () {
                if (!this._byteData) {
                    this._byteData = this._pGetByteData();
                    this._byteData.position = 0;

                    //----------------------------------------------------------------------------
                    // LITTLE_ENDIAN - Default for ArrayBuffer / Not implemented in ByteArray
                    //----------------------------------------------------------------------------
                    //this._byteData.endian = Endian.LITTLE_ENDIAN;// Should be default
                    //----------------------------------------------------------------------------
                    this._textures = {};
                    this._materials = {};
                    this._unfinalized_objects = {};
                }

                while (this._pHasTime()) {
                    // If we are currently working on an object, and the most recent chunk was
                    // the last one in that object, finalize the current object.
                    if (this._cur_mat && this._byteData.position >= this._cur_mat_end)
                        this.finalizeCurrentMaterial();
                    else if (this._cur_obj && this._byteData.position >= this._cur_obj_end) {
                        // Can't finalize at this point, because we have to wait until the full
                        // animation section has been parsed for any potential pivot definitions
                        this._unfinalized_objects[this._cur_obj.name] = this._cur_obj;
                        this._cur_obj_end = Number.MAX_VALUE;
                        this._cur_obj = null;
                    }

                    if (this._byteData.getBytesAvailable() > 0) {
                        var cid;
                        var len;
                        var end;

                        cid = this._byteData.readUnsignedShort();
                        len = this._byteData.readUnsignedInt();
                        end = this._byteData.position + (len - 6);

                        switch (cid) {
                            case 0x4D4D:
                            case 0x3D3D:
                            case 0xB000:
                                continue;
                                break;

                            case 0xAFFF:
                                this._cur_mat_end = end;
                                this._cur_mat = this.parseMaterial();
                                break;

                            case 0x4000:
                                this._cur_obj_end = end;
                                this._cur_obj = new ObjectVO();
                                this._cur_obj.name = this.readNulTermstring();
                                this._cur_obj.materials = new Array();
                                this._cur_obj.materialFaces = {};
                                break;

                            case 0x4100:
                                this._cur_obj.type = away.library.AssetType.MESH;
                                break;

                            case 0x4110:
                                this.parseVertexList();
                                break;

                            case 0x4120:
                                this.parseFaceList();
                                break;

                            case 0x4140:
                                this.parseUVList();
                                break;

                            case 0x4130:
                                this.parseFaceMaterialList();
                                break;

                            case 0x4160:
                                this._cur_obj.transform = this.readTransform();
                                break;

                            case 0xB002:
                                this.parseObjectAnimation(end);
                                break;

                            case 0x4150:
                                this.parseSmoothingGroups();
                                break;

                            default:
                                // Skip this (unknown) chunk
                                this._byteData.position += (len - 6);
                                break;
                        }

                        // Pause parsing if there were any dependencies found during this
                        // iteration (i.e. if there are any dependencies that need to be
                        // retrieved at this time.)
                        if (this.dependencies.length) {
                            this._pPauseAndRetrieveDependencies();
                            break;
                        }
                    }
                }

                // More parsing is required if the entire byte array has not yet
                // been read, or if there is a currently non-finalized object in
                // the pipeline.
                if (this._byteData.getBytesAvailable() || this._cur_obj || this._cur_mat) {
                    return parsers.ParserBase.MORE_TO_PARSE;
                } else {
                    var name;

                    for (name in this._unfinalized_objects) {
                        var obj;
                        obj = this.constructObject(this._unfinalized_objects[name]);
                        if (obj) {
                            //add to the content property
                            this._pContent.addChild(obj);

                            this._pFinalizeAsset(obj, name);
                        }
                    }

                    return parsers.ParserBase.PARSING_DONE;
                }
            };

            Max3DSParser.prototype._pStartParsing = function (frameLimit) {
                _super.prototype._pStartParsing.call(this, frameLimit);

                //create a content object for Loaders
                this._pContent = new away.containers.DisplayObjectContainer();
            };

            Max3DSParser.prototype.parseMaterial = function () {
                var mat;

                mat = new MaterialVO();

                while (this._byteData.position < this._cur_mat_end) {
                    var cid;
                    var len;
                    var end;

                    cid = this._byteData.readUnsignedShort();
                    len = this._byteData.readUnsignedInt();
                    end = this._byteData.position + (len - 6);

                    switch (cid) {
                        case 0xA000:
                            mat.name = this.readNulTermstring();
                            break;

                        case 0xA010:
                            mat.ambientColor = this.readColor();
                            break;

                        case 0xA020:
                            mat.diffuseColor = this.readColor();
                            break;

                        case 0xA030:
                            mat.specularColor = this.readColor();
                            break;

                        case 0xA081:
                            mat.twoSided = true;
                            break;

                        case 0xA200:
                            mat.colorMap = this.parseTexture(end);
                            break;

                        case 0xA204:
                            mat.specularMap = this.parseTexture(end);
                            break;

                        default:
                            this._byteData.position = end;
                            break;
                    }
                }

                return mat;
            };

            Max3DSParser.prototype.parseTexture = function (end /*uint*/ ) {
                var tex;

                tex = new TextureVO();

                while (this._byteData.position < end) {
                    var cid;
                    var len;

                    cid = this._byteData.readUnsignedShort();
                    len = this._byteData.readUnsignedInt();

                    switch (cid) {
                        case 0xA300:
                            tex.url = this.readNulTermstring();
                            break;

                        default:
                            // Skip this unknown texture sub-chunk
                            this._byteData.position += (len - 6);
                            break;
                    }
                }

                this._textures[tex.url] = tex;
                this._pAddDependency(tex.url, new away.net.URLRequest(tex.url));

                return tex;
            };

            Max3DSParser.prototype.parseVertexList = function () {
                var i;
                var len;
                var count;

                count = this._byteData.readUnsignedShort();
                this._cur_obj.verts = new Array(count * 3);

                i = 0;
                len = this._cur_obj.verts.length;
                while (i < len) {
                    var x, y, z;

                    x = this._byteData.readFloat();
                    y = this._byteData.readFloat();
                    z = this._byteData.readFloat();

                    this._cur_obj.verts[i++] = x;
                    this._cur_obj.verts[i++] = z;
                    this._cur_obj.verts[i++] = y;
                }
            };

            Max3DSParser.prototype.parseFaceList = function () {
                var i;
                var len;
                var count;

                count = this._byteData.readUnsignedShort();
                this._cur_obj.indices = new Array(count * 3);

                i = 0;
                len = this._cur_obj.indices.length;
                while (i < len) {
                    var i0, i1, i2;

                    i0 = this._byteData.readUnsignedShort();
                    i1 = this._byteData.readUnsignedShort();
                    i2 = this._byteData.readUnsignedShort();

                    this._cur_obj.indices[i++] = i0;
                    this._cur_obj.indices[i++] = i2;
                    this._cur_obj.indices[i++] = i1;

                    // Skip "face info", irrelevant in Away3D
                    this._byteData.position += 2;
                }

                this._cur_obj.smoothingGroups = new Array(count);
            };

            Max3DSParser.prototype.parseSmoothingGroups = function () {
                var len = this._cur_obj.indices.length / 3;
                var i = 0;
                while (i < len) {
                    this._cur_obj.smoothingGroups[i] = this._byteData.readUnsignedInt();
                    i++;
                }
            };

            Max3DSParser.prototype.parseUVList = function () {
                var i;
                var len;
                var count;

                count = this._byteData.readUnsignedShort();
                this._cur_obj.uvs = new Array(count * 2);

                i = 0;
                len = this._cur_obj.uvs.length;
                while (i < len) {
                    this._cur_obj.uvs[i++] = this._byteData.readFloat();
                    this._cur_obj.uvs[i++] = 1.0 - this._byteData.readFloat();
                }
            };

            Max3DSParser.prototype.parseFaceMaterialList = function () {
                var mat;
                var count;
                var i;
                var faces;

                mat = this.readNulTermstring();
                count = this._byteData.readUnsignedShort();

                faces = new Array(count);
                i = 0;
                while (i < faces.length)
                    faces[i++] = this._byteData.readUnsignedShort();

                this._cur_obj.materials.push(mat);
                this._cur_obj.materialFaces[mat] = faces;
            };

            Max3DSParser.prototype.parseObjectAnimation = function (end) {
                var vo;
                var obj;
                var pivot;
                var name;
                var hier;

                // Pivot defaults to origin
                pivot = new away.geom.Vector3D;

                while (this._byteData.position < end) {
                    var cid;
                    var len;

                    cid = this._byteData.readUnsignedShort();
                    len = this._byteData.readUnsignedInt();

                    switch (cid) {
                        case 0xb010:
                            name = this.readNulTermstring();
                            this._byteData.position += 4;
                            hier = this._byteData.readShort();
                            break;

                        case 0xb013:
                            pivot.x = this._byteData.readFloat();
                            pivot.z = this._byteData.readFloat();
                            pivot.y = this._byteData.readFloat();
                            break;

                        default:
                            this._byteData.position += (len - 6);
                            break;
                    }
                }

                // If name is "$$$DUMMY" this is an empty object (e.g. a container)
                // and will be ignored in this version of the parser
                // TODO: Implement containers in 3DS parser.
                if (name != '$$$DUMMY' && this._unfinalized_objects.hasOwnProperty(name)) {
                    vo = this._unfinalized_objects[name];
                    obj = this.constructObject(vo, pivot);

                    if (obj) {
                        //add to the content property
                        this._pContent.addChild(obj);

                        this._pFinalizeAsset(obj, vo.name);
                    }

                    delete this._unfinalized_objects[name];
                }
            };

            Max3DSParser.prototype.constructObject = function (obj, pivot) {
                if (typeof pivot === "undefined") { pivot = null; }
                if (obj.type == away.library.AssetType.MESH) {
                    var i;
                    var sub;
                    var geom;
                    var mat;
                    var mesh;
                    var mtx;
                    var vertices;
                    var faces;

                    if (obj.materials.length > 1)
                        console.log("The Away3D 3DS parser does not support multiple materials per mesh at this point.");

                    // Ignore empty objects
                    if (!obj.indices || obj.indices.length == 0)
                        return null;

                    vertices = new Array(obj.verts.length / 3);
                    faces = new Array(obj.indices.length / 3);

                    this.prepareData(vertices, faces, obj);

                    if (this._useSmoothingGroups)
                        this.applySmoothGroups(vertices, faces);

                    obj.verts = new Array(vertices.length * 3);
                    for (i = 0; i < vertices.length; i++) {
                        obj.verts[i * 3] = vertices[i].x;
                        obj.verts[i * 3 + 1] = vertices[i].y;
                        obj.verts[i * 3 + 2] = vertices[i].z;
                    }
                    obj.indices = new Array(faces.length * 3);

                    for (i = 0; i < faces.length; i++) {
                        obj.indices[i * 3] = faces[i].a;
                        obj.indices[i * 3 + 1] = faces[i].b;
                        obj.indices[i * 3 + 2] = faces[i].c;
                    }

                    if (obj.uvs) {
                        // If the object had UVs to start with, use UVs generated by
                        // smoothing group splitting algorithm. Otherwise those UVs
                        // will be nonsense and should be skipped.
                        obj.uvs = new Array(vertices.length * 2);
                        for (i = 0; i < vertices.length; i++) {
                            obj.uvs[i * 2] = vertices[i].u;
                            obj.uvs[i * 2 + 1] = vertices[i].v;
                        }
                    }

                    geom = new away.base.Geometry();

                    // Construct sub-geometries (potentially splitting buffers)
                    // and add them to geometry.
                    sub = new SubGeometry(true);
                    sub.updateIndices(obj.indices);
                    sub.updatePositions(obj.verts);
                    sub.updateUVs(obj.uvs);

                    geom.addSubGeometry(sub);

                    if (obj.materials.length > 0) {
                        var mname;
                        mname = obj.materials[0];
                        mat = this._materials[mname].material;
                    }

                    // Apply pivot translation to geometry if a pivot was
                    // found while parsing the keyframe chunk earlier.
                    if (pivot) {
                        if (obj.transform) {
                            // If a transform was found while parsing the
                            // object chunk, use it to find the local pivot vector
                            var dat = obj.transform.concat();
                            dat[12] = 0;
                            dat[13] = 0;
                            dat[14] = 0;
                            mtx = new away.geom.Matrix3D(dat);
                            pivot = mtx.transformVector(pivot);
                        }

                        pivot.scaleBy(-1);

                        mtx = new away.geom.Matrix3D();
                        mtx.appendTranslation(pivot.x, pivot.y, pivot.z);
                        geom.applyTransformation(mtx);
                    }

                    // Apply transformation to geometry if a transformation
                    // was found while parsing the object chunk earlier.
                    if (obj.transform) {
                        mtx = new away.geom.Matrix3D(obj.transform);
                        mtx.invert();
                        geom.applyTransformation(mtx);
                    }

                    // Final transform applied to geometry. Finalize the geometry,
                    // which will no longer be modified after this point.
                    this._pFinalizeAsset(geom, obj.name.concat('_geom'));

                    // Build mesh and return it
                    mesh = new away.entities.Mesh(geom, mat);
                    mesh.transform.matrix3D = new away.geom.Matrix3D(obj.transform);
                    return mesh;
                }

                // If reached, unknown
                return null;
            };

            Max3DSParser.prototype.prepareData = function (vertices, faces, obj) {
                // convert raw ObjectVO's data to structured VertexVO and FaceVO
                var i;
                var j;
                var k;
                var len = obj.verts.length;
                for (i = 0, j = 0, k = 0; i < len;) {
                    var v = new VertexVO;
                    v.x = obj.verts[i++];
                    v.y = obj.verts[i++];
                    v.z = obj.verts[i++];
                    if (obj.uvs) {
                        v.u = obj.uvs[j++];
                        v.v = obj.uvs[j++];
                    }
                    vertices[k++] = v;
                }
                len = obj.indices.length;
                for (i = 0, k = 0; i < len;) {
                    var f = new FaceVO();
                    f.a = obj.indices[i++];
                    f.b = obj.indices[i++];
                    f.c = obj.indices[i++];
                    f.smoothGroup = obj.smoothingGroups[k] || 0;
                    faces[k++] = f;
                }
            };

            Max3DSParser.prototype.applySmoothGroups = function (vertices, faces) {
                // clone vertices according to following rule:
                // clone if vertex's in faces from groups 1+2 and 3
                // don't clone if vertex's in faces from groups 1+2, 3 and 1+3
                var i;
                var j;
                var k;
                var l;
                var len;
                var numVerts = vertices.length;
                var numFaces = faces.length;

                // extract groups data for vertices
                var vGroups = new Array(numVerts);
                for (i = 0; i < numVerts; i++)
                    vGroups[i] = new Array();
                for (i = 0; i < numFaces; i++) {
                    var face = faces[i];
                    for (j = 0; j < 3; j++) {
                        var groups = vGroups[(j == 0) ? face.a : ((j == 1) ? face.b : face.c)];
                        var group = face.smoothGroup;
                        for (k = groups.length - 1; k >= 0; k--) {
                            if ((group & groups[k]) > 0) {
                                group |= groups[k];
                                groups.splice(k, 1);
                                k = groups.length - 1;
                            }
                        }
                        groups.push(group);
                    }
                }

                // clone vertices
                var vClones = new Array(numVerts);
                for (i = 0; i < numVerts; i++) {
                    if ((len = vGroups[i].length) < 1)
                        continue;
                    var clones = new Array(len);
                    vClones[i] = clones;
                    clones[0] = i;
                    var v0 = vertices[i];
                    for (j = 1; j < len; j++) {
                        var v1 = new VertexVO;
                        v1.x = v0.x;
                        v1.y = v0.y;
                        v1.z = v0.z;
                        v1.u = v0.u;
                        v1.v = v0.v;
                        clones[j] = vertices.length;
                        vertices.push(v1);
                    }
                }
                numVerts = vertices.length;

                for (i = 0; i < numFaces; i++) {
                    face = faces[i];
                    group = face.smoothGroup;
                    for (j = 0; j < 3; j++) {
                        k = (j == 0) ? face.a : ((j == 1) ? face.b : face.c);
                        groups = vGroups[k];
                        len = groups.length;
                        clones = vClones[k];
                        for (l = 0; l < len; l++) {
                            if (((group == 0) && (groups[l] == 0)) || ((group & groups[l]) > 0)) {
                                var index = clones[l];
                                if (group == 0) {
                                    // vertex is unique if no smoothGroup found
                                    groups.splice(l, 1);
                                    clones.splice(l, 1);
                                }
                                if (j == 0)
                                    face.a = index;
                                else if (j == 1)
                                    face.b = index;
                                else
                                    face.c = index;
                                l = len;
                            }
                        }
                    }
                }
            };

            Max3DSParser.prototype.finalizeCurrentMaterial = function () {
                var mat;

                if (this._cur_mat.colorMap)
                    mat = new TriangleMethodMaterial(this._cur_mat.colorMap.texture || DefaultMaterialManager.getDefaultTexture());
                else
                    mat = new TriangleMethodMaterial(this._cur_mat.ambientColor);

                mat.diffuseColor = this._cur_mat.diffuseColor;
                mat.specularColor = this._cur_mat.specularColor;

                if (this.materialMode >= 2)
                    mat.materialMode = TriangleMaterialMode.MULTI_PASS;

                mat.bothSides = this._cur_mat.twoSided;

                this._pFinalizeAsset(mat, this._cur_mat.name);

                this._materials[this._cur_mat.name] = this._cur_mat;
                this._cur_mat.material = mat;

                this._cur_mat = null;
            };

            Max3DSParser.prototype.readNulTermstring = function () {
                var chr;
                var str = "";

                while ((chr = this._byteData.readUnsignedByte()) > 0)
                    str += String.fromCharCode(chr);

                return str;
            };

            Max3DSParser.prototype.readTransform = function () {
                var data;

                data = new Array(16);

                // X axis
                data[0] = this._byteData.readFloat(); // X
                data[2] = this._byteData.readFloat(); // Z
                data[1] = this._byteData.readFloat(); // Y
                data[3] = 0;

                // Z axis
                data[8] = this._byteData.readFloat(); // X
                data[10] = this._byteData.readFloat(); // Z
                data[9] = this._byteData.readFloat(); // Y
                data[11] = 0;

                // Y Axis
                data[4] = this._byteData.readFloat(); // X
                data[6] = this._byteData.readFloat(); // Z
                data[5] = this._byteData.readFloat(); // Y
                data[7] = 0;

                // Translation
                data[12] = this._byteData.readFloat(); // X
                data[14] = this._byteData.readFloat(); // Z
                data[13] = this._byteData.readFloat(); // Y
                data[15] = 1;

                return data;
            };

            Max3DSParser.prototype.readColor = function () {
                var cid;
                var len;
                var r, g, b;

                cid = this._byteData.readUnsignedShort();
                len = this._byteData.readUnsignedInt();

                switch (cid) {
                    case 0x0010:
                        r = this._byteData.readFloat() * 255;
                        g = this._byteData.readFloat() * 255;
                        b = this._byteData.readFloat() * 255;
                        break;
                    case 0x0011:
                        r = this._byteData.readUnsignedByte();
                        g = this._byteData.readUnsignedByte();
                        b = this._byteData.readUnsignedByte();
                        break;
                    default:
                        this._byteData.position += (len - 6);
                        break;
                }

                return (r << 16) | (g << 8) | b;
            };
            return Max3DSParser;
        })(parsers.ParserBase);
        parsers.Max3DSParser = Max3DSParser;
    })(away.parsers || (away.parsers = {}));
    var parsers = away.parsers;
})(away || (away = {}));

var Vector3D = away.geom.Vector3D;

var TextureVO = (function () {
    function TextureVO() {
    }
    return TextureVO;
})();

var MaterialVO = (function () {
    function MaterialVO() {
    }
    return MaterialVO;
})();

var ObjectVO = (function () {
    function ObjectVO() {
    }
    return ObjectVO;
})();

var VertexVO = (function () {
    function VertexVO() {
    }
    return VertexVO;
})();

var FaceVO = (function () {
    function FaceVO() {
    }
    return FaceVO;
})();
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (parsers) {
        var Geometry = away.base.Geometry;
        var TriangleSubGeometry = away.base.TriangleSubGeometry;
        var VertexAnimationSet = away.animators.VertexAnimationSet;
        var VertexClipNode = away.animators.VertexClipNode;
        var DefaultMaterialManager = away.materials.DefaultMaterialManager;
        var TriangleMethodMaterial = away.materials.TriangleMethodMaterial;
        var TriangleMaterialMode = away.materials.TriangleMaterialMode;
        var URLLoaderDataFormat = away.net.URLLoaderDataFormat;

        /**
        * MD2Parser provides a parser for the MD2 data type.
        */
        var MD2Parser = (function (_super) {
            __extends(MD2Parser, _super);
            /**
            * Creates a new MD2Parser object.
            * @param textureType The extension of the texture (e.g. jpg/png/...)
            * @param ignoreTexturePath If true, the path of the texture is ignored
            */
            function MD2Parser(textureType, ignoreTexturePath) {
                if (typeof textureType === "undefined") { textureType = "jpg"; }
                if (typeof ignoreTexturePath === "undefined") { ignoreTexturePath = true; }
                _super.call(this, URLLoaderDataFormat.ARRAY_BUFFER);
                this._clipNodes = new Object();
                // the current subgeom being built
                this._animationSet = new VertexAnimationSet();
                this.materialFinal = false;
                this.geoCreated = false;
                this._textureType = textureType;
                this._ignoreTexturePath = ignoreTexturePath;
            }
            /**
            * Indicates whether or not a given file extension is supported by the parser.
            * @param extension The file extension of a potential file to be parsed.
            * @return Whether or not the given file type is supported.
            */
            MD2Parser.supportsType = function (extension) {
                extension = extension.toLowerCase();
                return extension == "md2";
            };

            /**
            * Tests whether a data block can be parsed by the parser.
            * @param data The data block to potentially be parsed.
            * @return Whether or not the given data is supported.
            */
            MD2Parser.supportsData = function (data) {
                return (parsers.ParserUtils.toString(data, 4) == 'IDP2');
            };

            /**
            * @inheritDoc
            */
            MD2Parser.prototype._iResolveDependency = function (resourceDependency) {
                if (resourceDependency.assets.length != 1)
                    return;

                var asset = resourceDependency.assets[0];

                if (asset) {
                    var material = new TriangleMethodMaterial(asset);

                    if (this.materialMode >= 2)
                        material.materialMode = TriangleMaterialMode.MULTI_PASS;

                    //add to the content property
                    this._pContent.addChild(this._mesh);

                    material.name = this._mesh.material.name;
                    this._mesh.material = material;
                    this._pFinalizeAsset(material);
                    this._pFinalizeAsset(this._mesh.geometry);
                    this._pFinalizeAsset(this._mesh);
                }
                this.materialFinal = true;
            };

            /**
            * @inheritDoc
            */
            MD2Parser.prototype._iResolveDependencyFailure = function (resourceDependency) {
                // apply system default
                if (this.materialMode < 2) {
                    this._mesh.material = DefaultMaterialManager.getDefaultMaterial();
                } else {
                    this._mesh.material = new TriangleMethodMaterial(away.materials.DefaultMaterialManager.getDefaultTexture());
                    this._mesh.material.materialMode = TriangleMaterialMode.MULTI_PASS;
                }

                //add to the content property
                this._pContent.addChild(this._mesh);

                this._pFinalizeAsset(this._mesh.geometry);
                this._pFinalizeAsset(this._mesh);
                this.materialFinal = true;
            };

            /**
            * @inheritDoc
            */
            MD2Parser.prototype._pProceedParsing = function () {
                if (!this._startedParsing) {
                    this._byteData = this._pGetByteData();
                    this._startedParsing = true;

                    // Reset bytearray read position (which may have been
                    // moved forward by the supportsData() function.)
                    this._byteData.position = 0;
                }

                while (this._pHasTime()) {
                    if (!this._parsedHeader) {
                        //----------------------------------------------------------------------------
                        // LITTLE_ENDIAN - Default for ArrayBuffer / Not implemented in ByteArray
                        //----------------------------------------------------------------------------
                        //this._byteData.endian = Endian.LITTLE_ENDIAN;
                        // TODO: Create a mesh only when encountered (if it makes sense
                        // for this file format) and return it using this._pFinalizeAsset()
                        this._geometry = new Geometry();
                        this._mesh = new away.entities.Mesh(this._geometry, null);
                        if (this.materialMode < 2) {
                            this._mesh.material = DefaultMaterialManager.getDefaultMaterial();
                        } else {
                            this._mesh.material = new TriangleMethodMaterial(DefaultMaterialManager.getDefaultTexture());
                            this._mesh.material.materialMode = TriangleMaterialMode.MULTI_PASS;
                        }

                        //_geometry.animation = new VertexAnimation(2, VertexAnimationMode.ABSOLUTE);
                        //_animator = new VertexAnimator(VertexAnimationState(_mesh.animationState));
                        // Parse header and decompress body
                        this.parseHeader();
                        this.parseMaterialNames();
                    } else if (!this._parsedUV) {
                        this.parseUV();
                    } else if (!this._parsedFaces) {
                        this.parseFaces();
                    } else if (!this._parsedFrames) {
                        this.parseFrames();
                    } else if ((this.geoCreated) && (this.materialFinal)) {
                        return away.parsers.ParserBase.PARSING_DONE;
                    } else if (!this.geoCreated) {
                        this.geoCreated = true;

                        //create default subgeometry
                        this._geometry.addSubGeometry(this._firstSubGeom.clone());

                        // Force name to be chosen by this._pFinalizeAsset()
                        this._mesh.name = "";
                        if (this.materialFinal) {
                            //add to the content property
                            this._pContent.addChild(this._mesh);

                            this._pFinalizeAsset(this._mesh.geometry);
                            this._pFinalizeAsset(this._mesh);
                        }

                        this._pPauseAndRetrieveDependencies();
                    }
                }

                return away.parsers.ParserBase.MORE_TO_PARSE;
            };

            MD2Parser.prototype._pStartParsing = function (frameLimit) {
                _super.prototype._pStartParsing.call(this, frameLimit);

                //create a content object for Loaders
                this._pContent = new away.containers.DisplayObjectContainer();
            };

            /**
            * Reads in all that MD2 Header data that is declared as private variables.
            * I know its a lot, and it looks ugly, but only way to do it in Flash
            */
            MD2Parser.prototype.parseHeader = function () {
                this._ident = this._byteData.readInt();
                this._version = this._byteData.readInt();
                this._skinWidth = this._byteData.readInt();
                this._skinHeight = this._byteData.readInt();

                //skip this._frameSize
                this._byteData.readInt();
                this._numSkins = this._byteData.readInt();
                this._numVertices = this._byteData.readInt();
                this._numST = this._byteData.readInt();
                this._numTris = this._byteData.readInt();

                //skip this._numGlCmds
                this._byteData.readInt();
                this._numFrames = this._byteData.readInt();
                this._offsetSkins = this._byteData.readInt();
                this._offsetST = this._byteData.readInt();
                this._offsetTris = this._byteData.readInt();
                this._offsetFrames = this._byteData.readInt();

                //skip this._offsetGlCmds
                this._byteData.readInt();
                this._offsetEnd = this._byteData.readInt();

                this._parsedHeader = true;
            };

            /**
            * Parses the file names for the materials.
            */
            MD2Parser.prototype.parseMaterialNames = function () {
                var url;
                var name;
                var extIndex;
                var slashIndex;
                this._materialNames = new Array();
                this._byteData.position = this._offsetSkins;

                var regExp = new RegExp("[^a-zA-Z0-9\\_\/.]", "g");
                for (var i = 0; i < this._numSkins; ++i) {
                    name = this._byteData.readUTFBytes(64);
                    name = name.replace(regExp, "");
                    extIndex = name.lastIndexOf(".");
                    if (this._ignoreTexturePath)
                        slashIndex = name.lastIndexOf("/");
                    if (name.toLowerCase().indexOf(".jpg") == -1 && name.toLowerCase().indexOf(".png") == -1) {
                        name = name.substring(slashIndex + 1, extIndex);
                        url = name + "." + this._textureType;
                    } else {
                        url = name;
                    }

                    this._materialNames[i] = name;

                    // only support 1 skin TODO: really?
                    if (this.dependencies.length == 0)
                        this._pAddDependency(name, new away.net.URLRequest(url));
                }

                if (this._materialNames.length > 0)
                    this._mesh.material.name = this._materialNames[0];
                else
                    this.materialFinal = true;
            };

            /**
            * Parses the uv data for the mesh.
            */
            MD2Parser.prototype.parseUV = function () {
                var j = 0;

                this._uvs = new Array(this._numST * 2);
                this._byteData.position = this._offsetST;
                for (var i = 0; i < this._numST; i++) {
                    this._uvs[j++] = this._byteData.readShort() / this._skinWidth;
                    this._uvs[j++] = this._byteData.readShort() / this._skinHeight;
                }

                this._parsedUV = true;
            };

            /**
            * Parses unique indices for the faces.
            */
            MD2Parser.prototype.parseFaces = function () {
                var a, b, c, ta, tb, tc;
                var i;

                this._vertIndices = new Array();
                this._uvIndices = new Array();
                this._indices = new Array();

                this._byteData.position = this._offsetTris;

                for (i = 0; i < this._numTris; i++) {
                    //collect vertex indices
                    a = this._byteData.readUnsignedShort();
                    b = this._byteData.readUnsignedShort();
                    c = this._byteData.readUnsignedShort();

                    //collect uv indices
                    ta = this._byteData.readUnsignedShort();
                    tb = this._byteData.readUnsignedShort();
                    tc = this._byteData.readUnsignedShort();

                    this.addIndex(a, ta);
                    this.addIndex(b, tb);
                    this.addIndex(c, tc);
                }

                var len = this._uvIndices.length;
                this._finalUV = new Array(len * 2);

                for (i = 0; i < len; ++i) {
                    this._finalUV[i << 1] = this._uvs[this._uvIndices[i] << 1];
                    this._finalUV[(i << 1) + 1] = this._uvs[(this._uvIndices[i] << 1) + 1];
                }

                this._parsedFaces = true;
            };

            /**
            * Adds a face index to the list if it doesn't exist yet, based on vertexIndex and uvIndex, and adds the
            * corresponding vertex and uv data in the correct location.
            * @param vertexIndex The original index in the vertex list.
            * @param uvIndex The original index in the uv list.
            */
            MD2Parser.prototype.addIndex = function (vertexIndex /*uint*/ , uvIndex /*uint*/ ) {
                var index = this.findIndex(vertexIndex, uvIndex);

                if (index == -1) {
                    this._indices.push(this._vertIndices.length);
                    this._vertIndices.push(vertexIndex);
                    this._uvIndices.push(uvIndex);
                } else
                    this._indices.push(index);
            };

            /**
            * Finds the final index corresponding to the original MD2's vertex and uv indices. Returns -1 if it wasn't added yet.
            * @param vertexIndex The original index in the vertex list.
            * @param uvIndex The original index in the uv list.
            * @return The index of the final mesh corresponding to the original vertex and uv index. -1 if it doesn't exist yet.
            */
            MD2Parser.prototype.findIndex = function (vertexIndex /*uint*/ , uvIndex /*uint*/ ) {
                var len = this._vertIndices.length;

                for (var i = 0; i < len; ++i) {
                    if (this._vertIndices[i] == vertexIndex && this._uvIndices[i] == uvIndex)
                        return i;
                }

                return -1;
            };

            /**
            * Parses all the frame geometries.
            */
            MD2Parser.prototype.parseFrames = function () {
                var sx, sy, sz;
                var tx, ty, tz;
                var geometry;
                var subGeom;
                var vertLen = this._vertIndices.length;
                var fvertices;
                var tvertices;
                var i, j, k;

                //var ch : number /*uint*/;
                var name = "";
                var prevClip = null;

                this._byteData.position = this._offsetFrames;

                for (i = 0; i < this._numFrames; i++) {
                    tvertices = new Array();
                    fvertices = new Array(vertLen * 3);

                    sx = this._byteData.readFloat();
                    sy = this._byteData.readFloat();
                    sz = this._byteData.readFloat();

                    tx = this._byteData.readFloat();
                    ty = this._byteData.readFloat();
                    tz = this._byteData.readFloat();

                    name = this.readFrameName();

                    for (j = 0; j < this._numVertices; j++, this._byteData.position++)
                        tvertices.push(sx * this._byteData.readUnsignedByte() + tx, sy * this._byteData.readUnsignedByte() + ty, sz * this._byteData.readUnsignedByte() + tz);

                    k = 0;
                    for (j = 0; j < vertLen; j++) {
                        fvertices[k++] = tvertices[this._vertIndices[j] * 3];
                        fvertices[k++] = tvertices[this._vertIndices[j] * 3 + 2];
                        fvertices[k++] = tvertices[this._vertIndices[j] * 3 + 1];
                    }

                    subGeom = new TriangleSubGeometry(true);

                    if (this._firstSubGeom == null)
                        this._firstSubGeom = subGeom;

                    geometry = new Geometry();
                    geometry.addSubGeometry(subGeom);

                    subGeom.updateIndices(this._indices);
                    subGeom.updatePositions(fvertices);
                    subGeom.updateUVs(this._finalUV);
                    subGeom.vertexNormals;
                    subGeom.vertexTangents;
                    subGeom.autoDeriveNormals = false;
                    subGeom.autoDeriveTangents = false;

                    var clip = this._clipNodes[name];

                    if (!clip) {
                        // If another sequence was parsed before this one, starting
                        // a new state means the previous one is complete and can
                        // hence be finalized.
                        if (prevClip) {
                            this._pFinalizeAsset(prevClip);
                            this._animationSet.addAnimation(prevClip);
                        }

                        clip = new VertexClipNode();
                        clip.name = name;
                        clip.stitchFinalFrame = true;

                        this._clipNodes[name] = clip;

                        prevClip = clip;
                    }
                    clip.addFrame(geometry, 1000 / away.parsers.MD2Parser.FPS);
                }

                // Finalize the last state
                if (prevClip) {
                    this._pFinalizeAsset(prevClip);
                    this._animationSet.addAnimation(prevClip);
                }

                // Force this._pFinalizeAsset() to decide name
                this._pFinalizeAsset(this._animationSet);

                this._parsedFrames = true;
            };

            MD2Parser.prototype.readFrameName = function () {
                var name = "";
                var k = 0;
                for (var j = 0; j < 16; j++) {
                    var ch = this._byteData.readUnsignedByte();

                    if (Math.floor(ch) > 0x39 && Math.floor(ch) <= 0x7A && k == 0)
                        name += String.fromCharCode(ch);

                    if (Math.floor(ch) >= 0x30 && Math.floor(ch) <= 0x39)
                        k++;
                }
                return name;
            };
            MD2Parser.FPS = 6;
            return MD2Parser;
        })(parsers.ParserBase);
        parsers.MD2Parser = MD2Parser;
    })(away.parsers || (away.parsers = {}));
    var parsers = away.parsers;
})(away || (away = {}));
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (parsers) {
        var JointPose = away.animators.JointPose;
        var SkeletonPose = away.animators.SkeletonPose;
        var SkeletonClipNode = away.animators.SkeletonClipNode;
        var Quaternion = away.geom.Quaternion;
        var Vector3D = away.geom.Vector3D;
        var URLLoaderDataFormat = away.net.URLLoaderDataFormat;

        /**
        * MD5AnimParser provides a parser for the md5anim data type, providing an animation sequence for the md5 format.
        *
        * todo: optimize
        */
        var MD5AnimParser = (function (_super) {
            __extends(MD5AnimParser, _super);
            /**
            * Creates a new MD5AnimParser object.
            * @param uri The url or id of the data or file to be parsed.
            * @param extra The holder for extra contextual data that the parser might need.
            */
            function MD5AnimParser(additionalRotationAxis, additionalRotationRadians) {
                if (typeof additionalRotationAxis === "undefined") { additionalRotationAxis = null; }
                if (typeof additionalRotationRadians === "undefined") { additionalRotationRadians = 0; }
                _super.call(this, URLLoaderDataFormat.TEXT);
                this._parseIndex = 0;
                this._line = 0;
                this._charLineIndex = 0;
                this._rotationQuat = new Quaternion();
                var t1 = new Quaternion();
                var t2 = new Quaternion();

                t1.fromAxisAngle(Vector3D.X_AXIS, -Math.PI * .5);
                t2.fromAxisAngle(Vector3D.Y_AXIS, -Math.PI * .5);

                this._rotationQuat.multiply(t2, t1);

                if (additionalRotationAxis) {
                    this._rotationQuat.multiply(t2, t1);
                    t1.fromAxisAngle(additionalRotationAxis, additionalRotationRadians);
                    this._rotationQuat.multiply(t1, this._rotationQuat);
                }
            }
            /**
            * Indicates whether or not a given file extension is supported by the parser.
            * @param extension The file extension of a potential file to be parsed.
            * @return Whether or not the given file type is supported.
            */
            MD5AnimParser.supportsType = function (extension) {
                extension = extension.toLowerCase();
                return extension == "md5anim";
            };

            /**
            * Tests whether a data block can be parsed by the parser.
            * @param data The data block to potentially be parsed.
            * @return Whether or not the given data is supported.
            */
            MD5AnimParser.supportsData = function (data) {
                return false;
            };

            /**
            * @inheritDoc
            */
            MD5AnimParser.prototype._pProceedParsing = function () {
                var token;

                if (!this._startedParsing) {
                    this._textData = this._pGetTextData();
                    this._startedParsing = true;
                }

                while (this._pHasTime()) {
                    token = this.getNextToken();
                    switch (token) {
                        case MD5AnimParser.COMMENT_TOKEN:
                            this.ignoreLine();
                            break;
                        case "":
                            break;
                        case MD5AnimParser.VERSION_TOKEN:
                            this._version = this.getNextInt();
                            if (this._version != 10)
                                throw new Error("Unknown version number encountered!");
                            break;
                        case MD5AnimParser.COMMAND_LINE_TOKEN:
                            this.parseCMD();
                            break;
                        case MD5AnimParser.NUM_FRAMES_TOKEN:
                            this._numFrames = this.getNextInt();
                            this._bounds = new Array();
                            this._frameData = new Array();
                            break;
                        case MD5AnimParser.NUM_JOINTS_TOKEN:
                            this._numJoints = this.getNextInt();
                            this._hierarchy = new Array(this._numJoints);
                            this._baseFrameData = new Array(this._numJoints);
                            break;
                        case MD5AnimParser.FRAME_RATE_TOKEN:
                            this._frameRate = this.getNextInt();
                            break;
                        case MD5AnimParser.NUM_ANIMATED_COMPONENTS_TOKEN:
                            this._numAnimatedComponents = this.getNextInt();
                            break;
                        case MD5AnimParser.HIERARCHY_TOKEN:
                            this.parseHierarchy();
                            break;
                        case MD5AnimParser.BOUNDS_TOKEN:
                            this.parseBounds();
                            break;
                        case MD5AnimParser.BASE_FRAME_TOKEN:
                            this.parseBaseFrame();
                            break;
                        case MD5AnimParser.FRAME_TOKEN:
                            this.parseFrame();
                            break;
                        default:
                            if (!this._reachedEOF)
                                this.sendUnknownKeywordError();
                    }

                    if (this._reachedEOF) {
                        this._clip = new SkeletonClipNode();
                        this.translateClip();
                        this._pFinalizeAsset(this._clip);
                        return parsers.ParserBase.PARSING_DONE;
                    }
                }
                return parsers.ParserBase.MORE_TO_PARSE;
            };

            /**
            * Converts all key frame data to an SkinnedAnimationSequence.
            */
            MD5AnimParser.prototype.translateClip = function () {
                for (var i = 0; i < this._numFrames; ++i)
                    this._clip.addFrame(this.translatePose(this._frameData[i]), 1000 / this._frameRate);
            };

            /**
            * Converts a single key frame data to a SkeletonPose.
            * @param frameData The actual frame data.
            * @return A SkeletonPose containing the frame data's pose.
            */
            MD5AnimParser.prototype.translatePose = function (frameData) {
                var hierarchy;
                var pose;
                var base;
                var flags;
                var j;
                var translate = new Vector3D();
                var orientation = new Quaternion();
                var components = frameData.components;
                var skelPose = new SkeletonPose();
                var jointPoses = skelPose.jointPoses;

                for (var i = 0; i < this._numJoints; ++i) {
                    j = 0;
                    pose = new JointPose();
                    hierarchy = this._hierarchy[i];
                    base = this._baseFrameData[i];
                    flags = hierarchy.flags;
                    translate.x = base.position.x;
                    translate.y = base.position.y;
                    translate.z = base.position.z;
                    orientation.x = base.orientation.x;
                    orientation.y = base.orientation.y;
                    orientation.z = base.orientation.z;

                    if (flags & 1)
                        translate.x = components[hierarchy.startIndex + (j++)];
                    if (flags & 2)
                        translate.y = components[hierarchy.startIndex + (j++)];
                    if (flags & 4)
                        translate.z = components[hierarchy.startIndex + (j++)];
                    if (flags & 8)
                        orientation.x = components[hierarchy.startIndex + (j++)];
                    if (flags & 16)
                        orientation.y = components[hierarchy.startIndex + (j++)];
                    if (flags & 32)
                        orientation.z = components[hierarchy.startIndex + (j++)];

                    var w = 1 - orientation.x * orientation.x - orientation.y * orientation.y - orientation.z * orientation.z;
                    orientation.w = w < 0 ? 0 : -Math.sqrt(w);

                    if (hierarchy.parentIndex < 0) {
                        pose.orientation.multiply(this._rotationQuat, orientation);
                        pose.translation = this._rotationQuat.rotatePoint(translate);
                    } else {
                        pose.orientation.copyFrom(orientation);
                        pose.translation.x = translate.x;
                        pose.translation.y = translate.y;
                        pose.translation.z = translate.z;
                    }
                    pose.orientation.y = -pose.orientation.y;
                    pose.orientation.z = -pose.orientation.z;
                    pose.translation.x = -pose.translation.x;

                    jointPoses[i] = pose;
                }

                return skelPose;
            };

            /**
            * Parses the skeleton's hierarchy data.
            */
            MD5AnimParser.prototype.parseHierarchy = function () {
                var ch;
                var data;
                var token = this.getNextToken();
                var i = 0;

                if (token != "{")
                    this.sendUnknownKeywordError();

                do {
                    if (this._reachedEOF)
                        this.sendEOFError();
                    data = new HierarchyData();
                    data.name = this.parseLiteralstring();
                    data.parentIndex = this.getNextInt();
                    data.flags = this.getNextInt();
                    data.startIndex = this.getNextInt();
                    this._hierarchy[i++] = data;

                    ch = this.getNextChar();

                    if (ch == "/") {
                        this.putBack();
                        ch = this.getNextToken();
                        if (ch == MD5AnimParser.COMMENT_TOKEN)
                            this.ignoreLine();
                        ch = this.getNextChar();
                    }

                    if (ch != "}")
                        this.putBack();
                } while(ch != "}");
            };

            /**
            * Parses frame bounds.
            */
            MD5AnimParser.prototype.parseBounds = function () {
                var ch;
                var data;
                var token = this.getNextToken();
                var i = 0;

                if (token != "{")
                    this.sendUnknownKeywordError();

                do {
                    if (this._reachedEOF)
                        this.sendEOFError();
                    data = new BoundsData();
                    data.min = this.parseVector3D();
                    data.max = this.parseVector3D();
                    this._bounds[i++] = data;

                    ch = this.getNextChar();

                    if (ch == "/") {
                        this.putBack();
                        ch = this.getNextToken();
                        if (ch == MD5AnimParser.COMMENT_TOKEN)
                            this.ignoreLine();
                        ch = this.getNextChar();
                    }

                    if (ch != "}")
                        this.putBack();
                } while(ch != "}");
            };

            /**
            * Parses the base frame.
            */
            MD5AnimParser.prototype.parseBaseFrame = function () {
                var ch;
                var data;
                var token = this.getNextToken();
                var i = 0;

                if (token != "{")
                    this.sendUnknownKeywordError();

                do {
                    if (this._reachedEOF)
                        this.sendEOFError();
                    data = new BaseFrameData();
                    data.position = this.parseVector3D();
                    data.orientation = this.parseQuaternion();
                    this._baseFrameData[i++] = data;

                    ch = this.getNextChar();

                    if (ch == "/") {
                        this.putBack();
                        ch = this.getNextToken();
                        if (ch == MD5AnimParser.COMMENT_TOKEN)
                            this.ignoreLine();
                        ch = this.getNextChar();
                    }

                    if (ch != "}")
                        this.putBack();
                } while(ch != "}");
            };

            /**
            * Parses a single frame.
            */
            MD5AnimParser.prototype.parseFrame = function () {
                var ch;
                var data;
                var token;
                var frameIndex;

                frameIndex = this.getNextInt();

                token = this.getNextToken();
                if (token != "{")
                    this.sendUnknownKeywordError();

                do {
                    if (this._reachedEOF)
                        this.sendEOFError();
                    data = new FrameData();
                    data.components = new Array(this._numAnimatedComponents);

                    for (var i = 0; i < this._numAnimatedComponents; ++i)
                        data.components[i] = this.getNextNumber();

                    this._frameData[frameIndex] = data;

                    ch = this.getNextChar();

                    if (ch == "/") {
                        this.putBack();
                        ch = this.getNextToken();
                        if (ch == MD5AnimParser.COMMENT_TOKEN)
                            this.ignoreLine();
                        ch = this.getNextChar();
                    }

                    if (ch != "}")
                        this.putBack();
                } while(ch != "}");
            };

            /**
            * Puts back the last read character into the data stream.
            */
            MD5AnimParser.prototype.putBack = function () {
                this._parseIndex--;
                this._charLineIndex--;
                this._reachedEOF = this._parseIndex >= this._textData.length;
            };

            /**
            * Gets the next token in the data stream.
            */
            MD5AnimParser.prototype.getNextToken = function () {
                var ch;
                var token = "";

                while (!this._reachedEOF) {
                    ch = this.getNextChar();
                    if (ch == " " || ch == "\r" || ch == "\n" || ch == "\t") {
                        if (token != MD5AnimParser.COMMENT_TOKEN)
                            this.skipWhiteSpace();
                        if (token != "")
                            return token;
                    } else
                        token += ch;

                    if (token == MD5AnimParser.COMMENT_TOKEN)
                        return token;
                }

                return token;
            };

            /**
            * Skips all whitespace in the data stream.
            */
            MD5AnimParser.prototype.skipWhiteSpace = function () {
                var ch;

                do
                    ch = this.getNextChar(); while(ch == "\n" || ch == " " || ch == "\r" || ch == "\t");

                this.putBack();
            };

            /**
            * Skips to the next line.
            */
            MD5AnimParser.prototype.ignoreLine = function () {
                var ch;
                while (!this._reachedEOF && ch != "\n")
                    ch = this.getNextChar();
            };

            /**
            * Retrieves the next single character in the data stream.
            */
            MD5AnimParser.prototype.getNextChar = function () {
                var ch = this._textData.charAt(this._parseIndex++);

                if (ch == "\n") {
                    ++this._line;
                    this._charLineIndex = 0;
                } else if (ch != "\r")
                    ++this._charLineIndex;

                if (this._parseIndex == this._textData.length)
                    this._reachedEOF = true;

                return ch;
            };

            /**
            * Retrieves the next integer in the data stream.
            */
            MD5AnimParser.prototype.getNextInt = function () {
                var i = parseInt(this.getNextToken());
                if (isNaN(i))
                    this.sendParseError("int type");
                return i;
            };

            /**
            * Retrieves the next floating point number in the data stream.
            */
            MD5AnimParser.prototype.getNextNumber = function () {
                var f = parseFloat(this.getNextToken());
                if (isNaN(f))
                    this.sendParseError("float type");
                return f;
            };

            /**
            * Retrieves the next 3d vector in the data stream.
            */
            MD5AnimParser.prototype.parseVector3D = function () {
                var vec = new Vector3D();
                var ch = this.getNextToken();

                if (ch != "(")
                    this.sendParseError("(");
                vec.x = this.getNextNumber();
                vec.y = this.getNextNumber();
                vec.z = this.getNextNumber();

                if (this.getNextToken() != ")")
                    this.sendParseError(")");

                return vec;
            };

            /**
            * Retrieves the next quaternion in the data stream.
            */
            MD5AnimParser.prototype.parseQuaternion = function () {
                var quat = new Quaternion();
                var ch = this.getNextToken();

                if (ch != "(")
                    this.sendParseError("(");
                quat.x = this.getNextNumber();
                quat.y = this.getNextNumber();
                quat.z = this.getNextNumber();

                // quat supposed to be unit length
                var t = 1 - (quat.x * quat.x) - (quat.y * quat.y) - (quat.z * quat.z);
                quat.w = t < 0 ? 0 : -Math.sqrt(t);

                if (this.getNextToken() != ")")
                    this.sendParseError(")");

                return quat;
            };

            /**
            * Parses the command line data.
            */
            MD5AnimParser.prototype.parseCMD = function () {
                // just ignore the command line property
                this.parseLiteralstring();
            };

            /**
            * Retrieves the next literal string in the data stream. A literal string is a sequence of characters bounded
            * by double quotes.
            */
            MD5AnimParser.prototype.parseLiteralstring = function () {
                this.skipWhiteSpace();

                var ch = this.getNextChar();
                var str = "";

                if (ch != "\"")
                    this.sendParseError("\"");

                do {
                    if (this._reachedEOF)
                        this.sendEOFError();
                    ch = this.getNextChar();
                    if (ch != "\"")
                        str += ch;
                } while(ch != "\"");

                return str;
            };

            /**
            * Throws an end-of-file error when a premature end of file was encountered.
            */
            MD5AnimParser.prototype.sendEOFError = function () {
                throw new Error("Unexpected end of file");
            };

            /**
            * Throws an error when an unexpected token was encountered.
            * @param expected The token type that was actually expected.
            */
            MD5AnimParser.prototype.sendParseError = function (expected) {
                throw new Error("Unexpected token at line " + (this._line + 1) + ", character " + this._charLineIndex + ". " + expected + " expected, but " + this._textData.charAt(this._parseIndex - 1) + " encountered");
            };

            /**
            * Throws an error when an unknown keyword was encountered.
            */
            MD5AnimParser.prototype.sendUnknownKeywordError = function () {
                throw new Error("Unknown keyword at line " + (this._line + 1) + ", character " + this._charLineIndex + ". ");
            };
            MD5AnimParser.VERSION_TOKEN = "MD5Version";
            MD5AnimParser.COMMAND_LINE_TOKEN = "commandline";
            MD5AnimParser.NUM_FRAMES_TOKEN = "numFrames";
            MD5AnimParser.NUM_JOINTS_TOKEN = "numJoints";
            MD5AnimParser.FRAME_RATE_TOKEN = "frameRate";
            MD5AnimParser.NUM_ANIMATED_COMPONENTS_TOKEN = "numAnimatedComponents";

            MD5AnimParser.HIERARCHY_TOKEN = "hierarchy";
            MD5AnimParser.BOUNDS_TOKEN = "bounds";
            MD5AnimParser.BASE_FRAME_TOKEN = "baseframe";
            MD5AnimParser.FRAME_TOKEN = "frame";

            MD5AnimParser.COMMENT_TOKEN = "//";
            return MD5AnimParser;
        })(parsers.ParserBase);
        parsers.MD5AnimParser = MD5AnimParser;
    })(away.parsers || (away.parsers = {}));
    var parsers = away.parsers;
})(away || (away = {}));

// value objects
var HierarchyData = (function () {
    function HierarchyData() {
    }
    HierarchyData.prototype.HierarchyData = function () {
    };
    return HierarchyData;
})();

var BoundsData = (function () {
    function BoundsData() {
    }
    BoundsData.prototype.BoundsData = function () {
    };
    return BoundsData;
})();

var BaseFrameData = (function () {
    function BaseFrameData() {
    }
    BaseFrameData.prototype.BaseFrameData = function () {
    };
    return BaseFrameData;
})();

var FrameData = (function () {
    function FrameData() {
    }
    FrameData.prototype.FrameData = function () {
    };
    return FrameData;
})();
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (parsers) {
        var SkeletonAnimationSet = away.animators.SkeletonAnimationSet;
        var Skeleton = away.animators.Skeleton;
        var SkeletonJoint = away.animators.SkeletonJoint;
        var Geometry = away.base.Geometry;
        var TriangleSubGeometry = away.base.TriangleSubGeometry;

        var Quaternion = away.geom.Quaternion;
        var Vector3D = away.geom.Vector3D;
        var Mesh = away.entities.Mesh;
        var URLLoaderDataFormat = away.net.URLLoaderDataFormat;

        // todo: create animation system, parse skeleton
        /**
        * MD5MeshParser provides a parser for the md5mesh data type, providing the geometry of the md5 format.
        *
        * todo: optimize
        */
        var MD5MeshParser = (function (_super) {
            __extends(MD5MeshParser, _super);
            /**
            * Creates a new MD5MeshParser object.
            */
            function MD5MeshParser(additionalRotationAxis, additionalRotationRadians) {
                if (typeof additionalRotationAxis === "undefined") { additionalRotationAxis = null; }
                if (typeof additionalRotationRadians === "undefined") { additionalRotationRadians = 0; }
                _super.call(this, URLLoaderDataFormat.TEXT);
                this._parseIndex = 0;
                this._line = 0;
                this._charLineIndex = 0;
                this._rotationQuat = new Quaternion();

                this._rotationQuat.fromAxisAngle(Vector3D.X_AXIS, -Math.PI * .5);

                if (additionalRotationAxis) {
                    var quat = new Quaternion();
                    quat.fromAxisAngle(additionalRotationAxis, additionalRotationRadians);
                    this._rotationQuat.multiply(this._rotationQuat, quat);
                }
            }
            /**
            * Indicates whether or not a given file extension is supported by the parser.
            * @param extension The file extension of a potential file to be parsed.
            * @return Whether or not the given file type is supported.
            */
            MD5MeshParser.supportsType = function (extension) {
                extension = extension.toLowerCase();
                return extension == "md5mesh";
            };

            /**
            * Tests whether a data block can be parsed by the parser.
            * @param data The data block to potentially be parsed.
            * @return Whether or not the given data is supported.
            */
            MD5MeshParser.supportsData = function (data) {
                return false;
            };

            /**
            * @inheritDoc
            */
            MD5MeshParser.prototype._pProceedParsing = function () {
                var token;

                if (!this._startedParsing) {
                    this._textData = this._pGetTextData();
                    this._startedParsing = true;
                }

                while (this._pHasTime()) {
                    token = this.getNextToken();
                    switch (token) {
                        case MD5MeshParser.COMMENT_TOKEN:
                            this.ignoreLine();
                            break;
                        case MD5MeshParser.VERSION_TOKEN:
                            this._version = this.getNextInt();
                            if (this._version != 10)
                                throw new Error("Unknown version number encountered!");
                            break;
                        case MD5MeshParser.COMMAND_LINE_TOKEN:
                            this.parseCMD();
                            break;
                        case MD5MeshParser.NUM_JOINTS_TOKEN:
                            this._numJoints = this.getNextInt();
                            this._bindPoses = new Array(this._numJoints);
                            break;
                        case MD5MeshParser.NUM_MESHES_TOKEN:
                            this._numMeshes = this.getNextInt();
                            break;
                        case MD5MeshParser.JOINTS_TOKEN:
                            this.parseJoints();
                            break;
                        case MD5MeshParser.MESH_TOKEN:
                            this.parseMesh();
                            break;
                        default:
                            if (!this._reachedEOF)
                                this.sendUnknownKeywordError();
                    }

                    if (this._reachedEOF) {
                        this.calculateMaxJointCount();
                        this._animationSet = new SkeletonAnimationSet(this._maxJointCount);

                        this._mesh = new Mesh(new Geometry(), null);
                        this._geometry = this._mesh.geometry;

                        for (var i = 0; i < this._meshData.length; ++i)
                            this._geometry.addSubGeometry(this.translateGeom(this._meshData[i].vertexData, this._meshData[i].weightData, this._meshData[i].indices));

                        //_geometry.animation = _animation;
                        //					_mesh.animationController = _animationController;
                        //add to the content property
                        this._pContent.addChild(this._mesh);

                        this._pFinalizeAsset(this._geometry);
                        this._pFinalizeAsset(this._mesh);
                        this._pFinalizeAsset(this._skeleton);
                        this._pFinalizeAsset(this._animationSet);
                        return parsers.ParserBase.PARSING_DONE;
                    }
                }
                return parsers.ParserBase.MORE_TO_PARSE;
            };

            MD5MeshParser.prototype._pStartParsing = function (frameLimit) {
                _super.prototype._pStartParsing.call(this, frameLimit);

                //create a content object for Loaders
                this._pContent = new away.containers.DisplayObjectContainer();
            };

            MD5MeshParser.prototype.calculateMaxJointCount = function () {
                this._maxJointCount = 0;

                var numMeshData = this._meshData.length;
                for (var i = 0; i < numMeshData; ++i) {
                    var meshData = this._meshData[i];
                    var vertexData = meshData.vertexData;
                    var numVerts = vertexData.length;

                    for (var j = 0; j < numVerts; ++j) {
                        var zeroWeights = this.countZeroWeightJoints(vertexData[j], meshData.weightData);
                        var totalJoints = vertexData[j].countWeight - zeroWeights;
                        if (totalJoints > this._maxJointCount)
                            this._maxJointCount = totalJoints;
                    }
                }
            };

            MD5MeshParser.prototype.countZeroWeightJoints = function (vertex, weights) {
                var start = vertex.startWeight;
                var end = vertex.startWeight + vertex.countWeight;
                var count = 0;
                var weight;

                for (var i = start; i < end; ++i) {
                    weight = weights[i].bias;
                    if (weight == 0)
                        ++count;
                }

                return count;
            };

            /**
            * Parses the skeleton's joints.
            */
            MD5MeshParser.prototype.parseJoints = function () {
                var ch;
                var joint;
                var pos;
                var quat;
                var i = 0;
                var token = this.getNextToken();

                if (token != "{")
                    this.sendUnknownKeywordError();

                this._skeleton = new Skeleton();

                do {
                    if (this._reachedEOF)
                        this.sendEOFError();
                    joint = new SkeletonJoint();
                    joint.name = this.parseLiteralstring();
                    joint.parentIndex = this.getNextInt();
                    pos = this.parseVector3D();
                    pos = this._rotationQuat.rotatePoint(pos);
                    quat = this.parseQuaternion();

                    // todo: check if this is correct, or maybe we want to actually store it as quats?
                    this._bindPoses[i] = quat.toMatrix3D();
                    this._bindPoses[i].appendTranslation(pos.x, pos.y, pos.z);
                    var inv = this._bindPoses[i].clone();
                    inv.invert();
                    joint.inverseBindPose = inv.rawData;

                    this._skeleton.joints[i++] = joint;

                    ch = this.getNextChar();

                    if (ch == "/") {
                        this.putBack();
                        ch = this.getNextToken();
                        if (ch == MD5MeshParser.COMMENT_TOKEN)
                            this.ignoreLine();
                        ch = this.getNextChar();
                    }

                    if (ch != "}")
                        this.putBack();
                } while(ch != "}");
            };

            /**
            * Puts back the last read character into the data stream.
            */
            MD5MeshParser.prototype.putBack = function () {
                this._parseIndex--;
                this._charLineIndex--;
                this._reachedEOF = this._parseIndex >= this._textData.length;
            };

            /**
            * Parses the mesh geometry.
            */
            MD5MeshParser.prototype.parseMesh = function () {
                var token = this.getNextToken();
                var ch;
                var vertexData;
                var weights;
                var indices;

                if (token != "{")
                    this.sendUnknownKeywordError();

                if (this._shaders == null)
                    this._shaders = new Array();

                while (ch != "}") {
                    ch = this.getNextToken();
                    switch (ch) {
                        case MD5MeshParser.COMMENT_TOKEN:
                            this.ignoreLine();
                            break;
                        case MD5MeshParser.MESH_SHADER_TOKEN:
                            this._shaders.push(this.parseLiteralstring());
                            break;
                        case MD5MeshParser.MESH_NUM_VERTS_TOKEN:
                            vertexData = new Array(this.getNextInt());
                            break;
                        case MD5MeshParser.MESH_NUM_TRIS_TOKEN:
                            indices = new Array(this.getNextInt() * 3);
                            break;
                        case MD5MeshParser.MESH_NUM_WEIGHTS_TOKEN:
                            weights = new Array(this.getNextInt());
                            break;
                        case MD5MeshParser.MESH_VERT_TOKEN:
                            this.parseVertex(vertexData);
                            break;
                        case MD5MeshParser.MESH_TRI_TOKEN:
                            this.parseTri(indices);
                            break;
                        case MD5MeshParser.MESH_WEIGHT_TOKEN:
                            this.parseJoint(weights);
                            break;
                    }
                }

                if (this._meshData == null)
                    this._meshData = new Array();

                var i = this._meshData.length;
                this._meshData[i] = new MeshData();
                this._meshData[i].vertexData = vertexData;
                this._meshData[i].weightData = weights;
                this._meshData[i].indices = indices;
            };

            /**
            * Converts the mesh data to a SkinnedSub instance.
            * @param vertexData The mesh's vertices.
            * @param weights The joint weights per vertex.
            * @param indices The indices for the faces.
            * @return A SubGeometry instance containing all geometrical data for the current mesh.
            */
            MD5MeshParser.prototype.translateGeom = function (vertexData, weights, indices /*uint*/ ) {
                var len = vertexData.length;
                var v1, v2, v3;
                var vertex;
                var weight;
                var bindPose;
                var pos;
                var subGeom = new TriangleSubGeometry(true);
                var uvs = new Array(len * 2);
                var vertices = new Array(len * 3);
                var jointIndices = new Array(len * this._maxJointCount);
                var jointWeights = new Array(len * this._maxJointCount);
                var l = 0;
                var nonZeroWeights;

                for (var i = 0; i < len; ++i) {
                    vertex = vertexData[i];
                    v1 = vertex.index * 3;
                    v2 = v1 + 1;
                    v3 = v1 + 2;
                    vertices[v1] = vertices[v2] = vertices[v3] = 0;

                    nonZeroWeights = 0;
                    for (var j = 0; j < vertex.countWeight; ++j) {
                        weight = weights[vertex.startWeight + j];
                        if (weight.bias > 0) {
                            bindPose = this._bindPoses[weight.joint];
                            pos = bindPose.transformVector(weight.pos);
                            vertices[v1] += pos.x * weight.bias;
                            vertices[v2] += pos.y * weight.bias;
                            vertices[v3] += pos.z * weight.bias;

                            // indices need to be multiplied by 3 (amount of matrix registers)
                            jointIndices[l] = weight.joint * 3;
                            jointWeights[l++] = weight.bias;
                            ++nonZeroWeights;
                        }
                    }

                    for (j = nonZeroWeights; j < this._maxJointCount; ++j) {
                        jointIndices[l] = 0;
                        jointWeights[l++] = 0;
                    }

                    v1 = vertex.index << 1;
                    uvs[v1++] = vertex.s;
                    uvs[v1] = vertex.t;
                }

                subGeom.jointsPerVertex = this._maxJointCount;
                subGeom.updateIndices(indices);
                subGeom.updatePositions(vertices);
                subGeom.updateUVs(uvs);
                subGeom.updateJointIndices(jointIndices);
                subGeom.updateJointWeights(jointWeights);

                // cause explicit updates
                subGeom.vertexNormals;
                subGeom.vertexTangents;

                // turn auto updates off because they may be animated and set explicitly
                subGeom.autoDeriveTangents = false;
                subGeom.autoDeriveNormals = false;

                return subGeom;
            };

            /**
            * Retrieve the next triplet of vertex indices that form a face.
            * @param indices The index list in which to store the read data.
            */
            MD5MeshParser.prototype.parseTri = function (indices /*uint*/ ) {
                var index = this.getNextInt() * 3;
                indices[index] = this.getNextInt();
                indices[index + 1] = this.getNextInt();
                indices[index + 2] = this.getNextInt();
            };

            /**
            * Reads a new joint data set for a single joint.
            * @param weights the target list to contain the weight data.
            */
            MD5MeshParser.prototype.parseJoint = function (weights) {
                var weight = new JointData();
                weight.index = this.getNextInt();
                weight.joint = this.getNextInt();
                weight.bias = this.getNextNumber();
                weight.pos = this.parseVector3D();
                weights[weight.index] = weight;
            };

            /**
            * Reads the data for a single vertex.
            * @param vertexData The list to contain the vertex data.
            */
            MD5MeshParser.prototype.parseVertex = function (vertexData) {
                var vertex = new VertexData();
                vertex.index = this.getNextInt();
                this.parseUV(vertex);
                vertex.startWeight = this.getNextInt();
                vertex.countWeight = this.getNextInt();

                //			if (vertex.countWeight > _maxJointCount) _maxJointCount = vertex.countWeight;
                vertexData[vertex.index] = vertex;
            };

            /**
            * Reads the next uv coordinate.
            * @param vertexData The vertexData to contain the UV coordinates.
            */
            MD5MeshParser.prototype.parseUV = function (vertexData) {
                var ch = this.getNextToken();
                if (ch != "(")
                    this.sendParseError("(");
                vertexData.s = this.getNextNumber();
                vertexData.t = this.getNextNumber();

                if (this.getNextToken() != ")")
                    this.sendParseError(")");
            };

            /**
            * Gets the next token in the data stream.
            */
            MD5MeshParser.prototype.getNextToken = function () {
                var ch;
                var token = "";

                while (!this._reachedEOF) {
                    ch = this.getNextChar();
                    if (ch == " " || ch == "\r" || ch == "\n" || ch == "\t") {
                        if (token != MD5MeshParser.COMMENT_TOKEN)
                            this.skipWhiteSpace();
                        if (token != "")
                            return token;
                    } else
                        token += ch;

                    if (token == MD5MeshParser.COMMENT_TOKEN)
                        return token;
                }

                return token;
            };

            /**
            * Skips all whitespace in the data stream.
            */
            MD5MeshParser.prototype.skipWhiteSpace = function () {
                var ch;

                do
                    ch = this.getNextChar(); while(ch == "\n" || ch == " " || ch == "\r" || ch == "\t");

                this.putBack();
            };

            /**
            * Skips to the next line.
            */
            MD5MeshParser.prototype.ignoreLine = function () {
                var ch;
                while (!this._reachedEOF && ch != "\n")
                    ch = this.getNextChar();
            };

            /**
            * Retrieves the next single character in the data stream.
            */
            MD5MeshParser.prototype.getNextChar = function () {
                var ch = this._textData.charAt(this._parseIndex++);

                if (ch == "\n") {
                    ++this._line;
                    this._charLineIndex = 0;
                } else if (ch != "\r")
                    ++this._charLineIndex;

                if (this._parseIndex >= this._textData.length)
                    this._reachedEOF = true;

                return ch;
            };

            /**
            * Retrieves the next integer in the data stream.
            */
            MD5MeshParser.prototype.getNextInt = function () {
                var i = parseInt(this.getNextToken());
                if (isNaN(i))
                    this.sendParseError("int type");
                return i;
            };

            /**
            * Retrieves the next floating point number in the data stream.
            */
            MD5MeshParser.prototype.getNextNumber = function () {
                var f = parseFloat(this.getNextToken());
                if (isNaN(f))
                    this.sendParseError("float type");
                return f;
            };

            /**
            * Retrieves the next 3d vector in the data stream.
            */
            MD5MeshParser.prototype.parseVector3D = function () {
                var vec = new Vector3D();
                var ch = this.getNextToken();

                if (ch != "(")
                    this.sendParseError("(");
                vec.x = -this.getNextNumber();
                vec.y = this.getNextNumber();
                vec.z = this.getNextNumber();

                if (this.getNextToken() != ")")
                    this.sendParseError(")");

                return vec;
            };

            /**
            * Retrieves the next quaternion in the data stream.
            */
            MD5MeshParser.prototype.parseQuaternion = function () {
                var quat = new Quaternion();
                var ch = this.getNextToken();

                if (ch != "(")
                    this.sendParseError("(");
                quat.x = this.getNextNumber();
                quat.y = -this.getNextNumber();
                quat.z = -this.getNextNumber();

                // quat supposed to be unit length
                var t = 1 - quat.x * quat.x - quat.y * quat.y - quat.z * quat.z;
                quat.w = t < 0 ? 0 : -Math.sqrt(t);

                if (this.getNextToken() != ")")
                    this.sendParseError(")");

                var rotQuat = new Quaternion();
                rotQuat.multiply(this._rotationQuat, quat);
                return rotQuat;
            };

            /**
            * Parses the command line data.
            */
            MD5MeshParser.prototype.parseCMD = function () {
                // just ignore the command line property
                this.parseLiteralstring();
            };

            /**
            * Retrieves the next literal string in the data stream. A literal string is a sequence of characters bounded
            * by double quotes.
            */
            MD5MeshParser.prototype.parseLiteralstring = function () {
                this.skipWhiteSpace();

                var ch = this.getNextChar();
                var str = "";

                if (ch != "\"")
                    this.sendParseError("\"");

                do {
                    if (this._reachedEOF)
                        this.sendEOFError();
                    ch = this.getNextChar();
                    if (ch != "\"")
                        str += ch;
                } while(ch != "\"");

                return str;
            };

            /**
            * Throws an end-of-file error when a premature end of file was encountered.
            */
            MD5MeshParser.prototype.sendEOFError = function () {
                throw new Error("Unexpected end of file");
            };

            /**
            * Throws an error when an unexpected token was encountered.
            * @param expected The token type that was actually expected.
            */
            MD5MeshParser.prototype.sendParseError = function (expected) {
                throw new Error("Unexpected token at line " + (this._line + 1) + ", character " + this._charLineIndex + ". " + expected + " expected, but " + this._textData.charAt(this._parseIndex - 1) + " encountered");
            };

            /**
            * Throws an error when an unknown keyword was encountered.
            */
            MD5MeshParser.prototype.sendUnknownKeywordError = function () {
                throw new Error("Unknown keyword at line " + (this._line + 1) + ", character " + this._charLineIndex + ". ");
            };
            MD5MeshParser.VERSION_TOKEN = "MD5Version";
            MD5MeshParser.COMMAND_LINE_TOKEN = "commandline";
            MD5MeshParser.NUM_JOINTS_TOKEN = "numJoints";
            MD5MeshParser.NUM_MESHES_TOKEN = "numMeshes";
            MD5MeshParser.COMMENT_TOKEN = "//";
            MD5MeshParser.JOINTS_TOKEN = "joints";
            MD5MeshParser.MESH_TOKEN = "mesh";

            MD5MeshParser.MESH_SHADER_TOKEN = "shader";
            MD5MeshParser.MESH_NUM_VERTS_TOKEN = "numverts";
            MD5MeshParser.MESH_VERT_TOKEN = "vert";
            MD5MeshParser.MESH_NUM_TRIS_TOKEN = "numtris";
            MD5MeshParser.MESH_TRI_TOKEN = "tri";
            MD5MeshParser.MESH_NUM_WEIGHTS_TOKEN = "numweights";
            MD5MeshParser.MESH_WEIGHT_TOKEN = "weight";
            return MD5MeshParser;
        })(parsers.ParserBase);
        parsers.MD5MeshParser = MD5MeshParser;
    })(away.parsers || (away.parsers = {}));
    var parsers = away.parsers;
})(away || (away = {}));

var VertexData = (function () {
    function VertexData() {
    }
    return VertexData;
})();

var JointData = (function () {
    function JointData() {
    }
    return JointData;
})();

var MeshData = (function () {
    function MeshData() {
    }
    return MeshData;
})();
///<reference path="../_definitions.ts"/>
var away;
(function (away) {
    (function (parsers) {
        var AssetLoader = away.library.AssetLoader;

        var Parsers = (function () {
            function Parsers() {
            }
            /**
            * Short-hand function to enable all bundled parsers for auto-detection. In practice,
            * this is the same as invoking enableParsers(Parsers.ALL_BUNDLED) on any of the
            * loader classes SingleFileLoader, AssetLoader, AssetLibrary or Loader3D.
            *
            * See notes about file size in the documentation for the ALL_BUNDLED constant.
            *
            * @see away.parsers.Parsers.ALL_BUNDLED
            */
            Parsers.enableAllBundled = function () {
                AssetLoader.enableParsers(Parsers.ALL_BUNDLED);
            };
            Parsers.ALL_BUNDLED = Array(parsers.AWDParser, parsers.Max3DSParser, parsers.MD2Parser, parsers.OBJParser);
            return Parsers;
        })();
        parsers.Parsers = Parsers;
    })(away.parsers || (away.parsers = {}));
    var parsers = away.parsers;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (commands) {
        var Geometry = away.base.Geometry;
        var TriangleSubGeometry = away.base.TriangleSubGeometry;
        var Matrix3DUtils = away.geom.Matrix3DUtils;
        var Mesh = away.entities.Mesh;

        /**
        *  Class Merge merges two or more static meshes into one.<code>Merge</code>
        */
        var Merge = (function () {
            /**
            * @param    keepMaterial    [optional]    Determines if the merged object uses the recevier mesh material information or keeps its source material(s). Defaults to false.
            * If false and receiver object has multiple materials, the last material found in receiver submeshes is applied to the merged submesh(es).
            * @param    disposeSources  [optional]    Determines if the mesh and geometry source(s) used for the merging are disposed. Defaults to false.
            * If true, only receiver geometry and resulting mesh are kept in  memory.
            * @param    objectSpace     [optional]    Determines if source mesh(es) is/are merged using objectSpace or worldspace. Defaults to false.
            */
            function Merge(keepMaterial, disposeSources, objectSpace) {
                if (typeof keepMaterial === "undefined") { keepMaterial = false; }
                if (typeof disposeSources === "undefined") { disposeSources = false; }
                if (typeof objectSpace === "undefined") { objectSpace = false; }
                this._keepMaterial = keepMaterial;
                this._disposeSources = disposeSources;
                this._objectSpace = objectSpace;
            }

            Object.defineProperty(Merge.prototype, "disposeSources", {
                get: function () {
                    return this._disposeSources;
                },
                /**
                * Determines if the mesh and geometry source(s) used for the merging are disposed. Defaults to false.
                */
                set: function (b) {
                    this._disposeSources = b;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Merge.prototype, "keepMaterial", {
                get: function () {
                    return this._keepMaterial;
                },
                /**
                * Determines if the material source(s) used for the merging are disposed. Defaults to false.
                */
                set: function (b) {
                    this._keepMaterial = b;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Merge.prototype, "objectSpace", {
                get: function () {
                    return this._objectSpace;
                },
                /**
                * Determines if source mesh(es) is/are merged using objectSpace or worldspace. Defaults to false.
                */
                set: function (b) {
                    this._objectSpace = b;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Merges all the children of a container into a single Mesh. If no Mesh object is found, method returns the receiver without modification.
            *
            * @param    receiver           The Mesh to receive the merged contents of the container.
            * @param    objectContainer    The DisplayObjectContainer holding the meshes to be mergd.
            *
            * @return The merged Mesh instance.
            */
            Merge.prototype.applyToContainer = function (receiver, objectContainer) {
                this.reset();

                //collect container meshes
                this.parseContainer(receiver, objectContainer);

                //collect receiver
                this.collect(receiver, false);

                //merge to receiver
                this.merge(receiver, this._disposeSources);
            };

            /**
            * Merges all the meshes found in the Array&lt;Mesh&gt; into a single Mesh.
            *
            * @param    receiver    The Mesh to receive the merged contents of the meshes.
            * @param    meshes      A series of Meshes to be merged with the reciever mesh.
            */
            Merge.prototype.applyToMeshes = function (receiver, meshes) {
                this.reset();

                if (!meshes.length)
                    return;

                for (var i = 0; i < meshes.length; i++)
                    if (meshes[i] != receiver)
                        this.collect(meshes[i], this._disposeSources);

                //collect receiver
                this.collect(receiver, false);

                //merge to receiver
                this.merge(receiver, this._disposeSources);
            };

            /**
            *  Merges 2 meshes into one. It is recommand to use apply when 2 meshes are to be merged. If more need to be merged, use either applyToMeshes or applyToContainer methods.
            *
            * @param    receiver    The Mesh to receive the merged contents of both meshes.
            * @param    mesh        The Mesh to be merged with the receiver mesh
            */
            Merge.prototype.apply = function (receiver, mesh) {
                this.reset();

                //collect mesh
                this.collect(mesh, this._disposeSources);

                //collect receiver
                this.collect(receiver, false);

                //merge to receiver
                this.merge(receiver, this._disposeSources);
            };

            Merge.prototype.reset = function () {
                this._toDispose = new Array();
                this._geomVOs = new Array();
            };

            Merge.prototype.merge = function (destMesh, dispose) {
                var i;
                var subIdx;
                var oldGeom;
                var destGeom;
                var useSubMaterials;

                oldGeom = destMesh.geometry;
                destGeom = destMesh.geometry = new Geometry();
                subIdx = destMesh.subMeshes.length;

                // Only apply materials directly to sub-meshes if necessary,
                // i.e. if there is more than one material available.
                useSubMaterials = (this._geomVOs.length > 1);

                for (i = 0; i < this._geomVOs.length; i++) {
                    var s;
                    var data;
                    var sub = new TriangleSubGeometry(true);
                    sub.autoDeriveNormals = false;
                    sub.autoDeriveTangents = false;

                    data = this._geomVOs[i];
                    sub.updateIndices(data.indices);
                    sub.updatePositions(data.vertices);
                    sub.updateVertexNormals(data.normals);
                    sub.updateVertexTangents(data.tangents);
                    sub.updateUVs(data.uvs);

                    destGeom.addSubGeometry(sub);

                    if (this._keepMaterial && useSubMaterials)
                        destMesh.subMeshes[subIdx].material = data.material;
                }

                if (this._keepMaterial && !useSubMaterials && this._geomVOs.length)
                    destMesh.material = this._geomVOs[0].material;

                if (dispose) {
                    var m;
                    var len = this._toDispose.length;
                    for (var i; i < len; i++) {
                        m = this._toDispose[i];
                        m.geometry.dispose();
                        m.dispose();
                    }

                    //dispose of the original receiver geometry
                    oldGeom.dispose();
                }

                this._toDispose = null;
            };

            Merge.prototype.collect = function (mesh, dispose) {
                if (mesh.geometry) {
                    var subIdx;
                    var subGeometries = mesh.geometry.subGeometries;
                    var calc;
                    for (subIdx = 0; subIdx < subGeometries.length; subIdx++) {
                        var i;
                        var len;
                        var iIdx, vIdx, nIdx, tIdx, uIdx;
                        var indexOffset;
                        var subGeom;
                        var vo;
                        var vertices;
                        var normals;
                        var tangents;
                        var pd, nd, td, ud;

                        subGeom = subGeometries[subIdx];
                        pd = subGeom.positions;
                        nd = subGeom.vertexNormals;
                        td = subGeom.vertexTangents;
                        ud = subGeom.uvs;

                        // Get (or create) a VO for this material
                        vo = this.getSubGeomData(mesh.subMeshes[subIdx].material || mesh.material);

                        // Vertices and normals are copied to temporary vectors, to be transformed
                        // before concatenated onto those of the data. This is unnecessary if no
                        // transformation will be performed, i.e. for object space merging.
                        vertices = (this._objectSpace) ? vo.vertices : new Array();
                        normals = (this._objectSpace) ? vo.normals : new Array();
                        tangents = (this._objectSpace) ? vo.tangents : new Array();

                        // Copy over vertex attributes
                        vIdx = vertices.length;
                        nIdx = normals.length;
                        tIdx = tangents.length;
                        uIdx = vo.uvs.length;
                        len = subGeom.numVertices;
                        for (i = 0; i < len; i++) {
                            calc = i * 3;

                            // Position
                            vertices[vIdx++] = pd[calc];
                            vertices[vIdx++] = pd[calc + 1];
                            vertices[vIdx++] = pd[calc + 2];

                            // Normal
                            normals[nIdx++] = nd[calc];
                            normals[nIdx++] = nd[calc + 1];
                            normals[nIdx++] = nd[calc + 2];

                            // Tangent
                            tangents[tIdx++] = td[calc];
                            tangents[tIdx++] = td[calc + 1];
                            tangents[tIdx++] = td[calc + 2];

                            // UV
                            vo.uvs[uIdx++] = ud[i * 2];
                            vo.uvs[uIdx++] = ud[i * 2 + 1];
                        }

                        // Copy over triangle indices
                        indexOffset = (!this._objectSpace) ? vo.vertices.length / 3 : 0;
                        iIdx = vo.indices.length;
                        len = subGeom.numTriangles;
                        for (i = 0; i < len; i++) {
                            calc = i * 3;
                            vo.indices[iIdx++] = subGeom.indices[calc] + indexOffset;
                            vo.indices[iIdx++] = subGeom.indices[calc + 1] + indexOffset;
                            vo.indices[iIdx++] = subGeom.indices[calc + 2] + indexOffset;
                        }

                        if (!this._objectSpace) {
                            mesh.sceneTransform.transformVectors(vertices, vertices);
                            Matrix3DUtils.deltaTransformVectors(mesh.sceneTransform, normals, normals);
                            Matrix3DUtils.deltaTransformVectors(mesh.sceneTransform, tangents, tangents);

                            // Copy vertex data from temporary (transformed) vectors
                            vIdx = vo.vertices.length;
                            nIdx = vo.normals.length;
                            tIdx = vo.tangents.length;
                            len = vertices.length;
                            for (i = 0; i < len; i++) {
                                vo.vertices[vIdx++] = vertices[i];
                                vo.normals[nIdx++] = normals[i];
                                vo.tangents[tIdx++] = tangents[i];
                            }
                        }
                    }

                    if (dispose)
                        this._toDispose.push(mesh);
                }
            };

            Merge.prototype.getSubGeomData = function (material) {
                var data;

                if (this._keepMaterial) {
                    var i;
                    var len;

                    len = this._geomVOs.length;
                    for (i = 0; i < len; i++) {
                        if (this._geomVOs[i].material == material) {
                            data = this._geomVOs[i];
                            break;
                        }
                    }
                } else if (this._geomVOs.length) {
                    // If materials are not to be kept, all data can be
                    // put into a single VO, so return that one.
                    data = this._geomVOs[0];
                }

                // No data (for this material) found, create new.
                if (!data) {
                    data = new GeometryVO();
                    data.vertices = new Array();
                    data.normals = new Array();
                    data.tangents = new Array();
                    data.uvs = new Array();
                    data.indices = new Array();
                    data.material = material;

                    this._geomVOs.push(data);
                }

                return data;
            };

            Merge.prototype.parseContainer = function (receiver, object) {
                var child;
                var i;

                if (object instanceof Mesh && object != receiver)
                    this.collect(object, this._disposeSources);

                for (i = 0; i < object.numChildren; ++i) {
                    child = object.getChildAt(i);
                    this.parseContainer(receiver, child);
                }
            };
            return Merge;
        })();
        commands.Merge = Merge;
    })(away.commands || (away.commands = {}));
    var commands = away.commands;
})(away || (away = {}));

var GeometryVO = (function () {
    function GeometryVO() {
    }
    return GeometryVO;
})();
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (tools) {
        /**
        * ...
        */
        var ParticleGeometryTransform = (function () {
            function ParticleGeometryTransform() {
            }


            Object.defineProperty(ParticleGeometryTransform.prototype, "UVTransform", {
                get: function () {
                    return this._defaultUVTransform;
                },
                set: function (value) {
                    this._defaultUVTransform = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ParticleGeometryTransform.prototype, "vertexTransform", {
                get: function () {
                    return this._defaultVertexTransform;
                },
                set: function (value) {
                    this._defaultVertexTransform = value;
                    this._defaultInvVertexTransform = value.clone();
                    this._defaultInvVertexTransform.invert();
                    this._defaultInvVertexTransform.transpose();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ParticleGeometryTransform.prototype, "invVertexTransform", {
                get: function () {
                    return this._defaultInvVertexTransform;
                },
                enumerable: true,
                configurable: true
            });
            return ParticleGeometryTransform;
        })();
        tools.ParticleGeometryTransform = ParticleGeometryTransform;
    })(away.tools || (away.tools = {}));
    var tools = away.tools;
})(away || (away = {}));
///<reference path="../../_definitions.ts"/>
var away;
(function (away) {
    (function (tools) {
        var ParticleData = away.animators.ParticleData;
        var ParticleGeometry = away.base.ParticleGeometry;

        var TriangleSubGeometry = away.base.TriangleSubGeometry;

        var Point = away.geom.Point;
        var Vector3D = away.geom.Vector3D;

        /**
        * ...
        */
        var ParticleGeometryHelper = (function () {
            function ParticleGeometryHelper() {
            }
            ParticleGeometryHelper.generateGeometry = function (geometries, transforms) {
                if (typeof transforms === "undefined") { transforms = null; }
                var indicesVector = new Array();
                var positionsVector = new Array();
                var normalsVector = new Array();
                var tangentsVector = new Array();
                var uvsVector = new Array();
                var vertexCounters = new Array();
                var particles = new Array();
                var subGeometries = new Array();
                var numParticles = geometries.length;

                var sourceSubGeometries;
                var sourceSubGeometry;
                var numSubGeometries;
                var indices;
                var positions;
                var normals;
                var tangents;
                var uvs;
                var vertexCounter;
                var subGeometry;
                var i;
                var j;
                var sub2SubMap = new Array();

                var tempVertex = new Vector3D;
                var tempNormal = new Vector3D;
                var tempTangents = new Vector3D;
                var tempUV = new Point;

                for (i = 0; i < numParticles; i++) {
                    sourceSubGeometries = geometries[i].subGeometries;
                    numSubGeometries = sourceSubGeometries.length;
                    for (var srcIndex = 0; srcIndex < numSubGeometries; srcIndex++) {
                        //create a different particle subgeometry group for each source subgeometry in a particle.
                        if (sub2SubMap.length <= srcIndex) {
                            sub2SubMap.push(subGeometries.length);
                            indicesVector.push(new Array());
                            positionsVector.push(new Array());
                            normalsVector.push(new Array());
                            tangentsVector.push(new Array());
                            uvsVector.push(new Array());
                            subGeometries.push(new TriangleSubGeometry(true));
                            vertexCounters.push(0);
                        }

                        sourceSubGeometry = sourceSubGeometries[srcIndex];

                        //add a new particle subgeometry if this source subgeometry will take us over the maxvertex limit
                        if (sourceSubGeometry.numVertices + vertexCounters[sub2SubMap[srcIndex]] > ParticleGeometryHelper.MAX_VERTEX) {
                            //update submap and add new subgeom vectors
                            sub2SubMap[srcIndex] = subGeometries.length;
                            indicesVector.push(new Array());
                            positionsVector.push(new Array());
                            normalsVector.push(new Array());
                            tangentsVector.push(new Array());
                            uvsVector.push(new Array());
                            subGeometries.push(new TriangleSubGeometry(true));
                            vertexCounters.push(0);
                        }

                        j = sub2SubMap[srcIndex];

                        //select the correct vector
                        indices = indicesVector[j];
                        positions = positionsVector[j];
                        normals = normalsVector[j];
                        tangents = tangentsVector[j];
                        uvs = uvsVector[j];
                        vertexCounter = vertexCounters[j];
                        subGeometry = subGeometries[j];

                        var particleData = new ParticleData();
                        particleData.numVertices = sourceSubGeometry.numVertices;
                        particleData.startVertexIndex = vertexCounter;
                        particleData.particleIndex = i;
                        particleData.subGeometry = subGeometry;
                        particles.push(particleData);

                        vertexCounters[j] += sourceSubGeometry.numVertices;

                        var k;
                        var tempLen;
                        var compact = sourceSubGeometry;
                        var product;
                        var sourcePositions;
                        var sourceNormals;
                        var sourceTangents;
                        var sourceUVs;

                        if (compact) {
                            tempLen = compact.numVertices;
                            compact.numTriangles;
                            sourcePositions = compact.positions;
                            sourceNormals = compact.vertexNormals;
                            sourceTangents = compact.vertexTangents;
                            sourceUVs = compact.uvs;

                            if (transforms) {
                                var particleGeometryTransform = transforms[i];
                                var vertexTransform = particleGeometryTransform.vertexTransform;
                                var invVertexTransform = particleGeometryTransform.invVertexTransform;
                                var UVTransform = particleGeometryTransform.UVTransform;

                                for (k = 0; k < tempLen; k++) {
                                    /*
                                    * 0 - 2: vertex position X, Y, Z
                                    * 3 - 5: normal X, Y, Z
                                    * 6 - 8: tangent X, Y, Z
                                    * 9 - 10: U V
                                    * 11 - 12: Secondary U V*/
                                    product = k * 3;
                                    tempVertex.x = sourcePositions[product];
                                    tempVertex.y = sourcePositions[product + 1];
                                    tempVertex.z = sourcePositions[product + 2];
                                    tempNormal.x = sourceNormals[product];
                                    tempNormal.y = sourceNormals[product + 1];
                                    tempNormal.z = sourceNormals[product + 2];
                                    tempTangents.x = sourceTangents[product];
                                    tempTangents.y = sourceTangents[product + 1];
                                    tempTangents.z = sourceTangents[product + 2];
                                    tempUV.x = sourceUVs[k * 2];
                                    tempUV.y = sourceUVs[k * 2 + 1];
                                    if (vertexTransform) {
                                        tempVertex = vertexTransform.transformVector(tempVertex);
                                        tempNormal = invVertexTransform.deltaTransformVector(tempNormal);
                                        tempTangents = invVertexTransform.deltaTransformVector(tempNormal);
                                    }
                                    if (UVTransform)
                                        tempUV = UVTransform.transformPoint(tempUV);

                                    //this is faster than that only push one data
                                    sourcePositions.push(tempVertex.x, tempVertex.y, tempVertex.z);
                                    sourceNormals.push(tempNormal.x, tempNormal.y, tempNormal.z);
                                    sourceTangents.push(tempTangents.x, tempTangents.y, tempTangents.z);
                                    sourceUVs.push(tempUV.x, tempUV.y);
                                }
                            } else {
                                for (k = 0; k < tempLen; k++) {
                                    product = k * 3;

                                    //this is faster than that only push one data
                                    positions.push(sourcePositions[product], sourcePositions[product + 1], sourcePositions[product + 2]);
                                    normals.push(sourceNormals[product], sourceNormals[product + 1], sourceNormals[product + 2]);
                                    tangents.push(sourceTangents[product], sourceTangents[product + 1], sourceTangents[product + 2]);
                                    uvs.push(sourceUVs[k * 2], sourceUVs[k * 2 + 1]);
                                }
                            }
                        } else {
                            //Todo
                        }

                        var sourceIndices = sourceSubGeometry.indices;
                        tempLen = sourceSubGeometry.numTriangles;
                        for (k = 0; k < tempLen; k++) {
                            product = k * 3;
                            indices.push(sourceIndices[product] + vertexCounter, sourceIndices[product + 1] + vertexCounter, sourceIndices[product + 2] + vertexCounter);
                        }
                    }
                }

                var particleGeometry = new ParticleGeometry();
                particleGeometry.particles = particles;
                particleGeometry.numParticles = numParticles;

                numParticles = subGeometries.length;
                for (i = 0; i < numParticles; i++) {
                    subGeometry = subGeometries[i];
                    subGeometry.autoDeriveNormals = false;
                    subGeometry.autoDeriveTangents = false;
                    subGeometry.updateIndices(indicesVector[i]);
                    subGeometry.updatePositions(positionsVector[i]);
                    subGeometry.updateVertexNormals(normalsVector[i]);
                    subGeometry.updateVertexTangents(tangentsVector[i]);
                    subGeometry.updateUVs(uvsVector[i]);
                    particleGeometry.addSubGeometry(subGeometry);
                }

                return particleGeometry;
            };
            ParticleGeometryHelper.MAX_VERTEX = 65535;
            return ParticleGeometryHelper;
        })();
        tools.ParticleGeometryHelper = ParticleGeometryHelper;
    })(away.tools || (away.tools = {}));
    var tools = away.tools;
})(away || (away = {}));
/**********************************************************************************************************************************************************************************************************
* This file contains a reference to all the classes used in the project.
********************************************************************************************************************************************************************************************************
*
* The TypeScript compiler exports classes in a non deterministic manner, as the extend functionality copies the prototype chain
* of one object onto another during initialisation and load (to create extensible functionality), the non deterministic nature of the
* compiler can result in an extend operation referencing a class that is undefined and not yet loaded - which throw an JavaScript error.
*
* This file provides the compiler with a strict order in which to export the TypeScript classes to mitigate undefined extend errors
*
* @see https://typescript.codeplex.com/workitem/1356 @see https://typescript.codeplex.com/workitem/913
*
*********************************************************************************************************************************************************************************************************/
///<reference path="../../libs/ref/js.d.ts"/>
///<reference path="../../libs/awayjs-core.next.d.ts"/>
///<reference path="../../libs/stagegl-core.next.d.ts"/>
///<reference path="events/AnimationStateEvent.ts" />
///<reference path="core/base/ParticleGeometry.ts"/>
///<reference path="core/pick/PickingColliderBase.ts" />
///<reference path="core/pick/JSPickingCollider.ts" />
///<reference path="core/pick/ShaderPicker.ts" />
//<reference path="materials/passes/SingleObjectDepthPass.ts"/>
///<reference path="materials/methods/AmbientEnvMapMethod.ts"/>
///<reference path="materials/methods/DiffuseCompositeMethod.ts"/>
///<reference path="materials/methods/DiffuseCelMethod.ts"/>
///<reference path="materials/methods/DiffuseDepthMethod.ts"/>
///<reference path="materials/methods/DiffuseGradientMethod.ts"/>
///<reference path="materials/methods/DiffuseLightMapMethod.ts"/>
//<reference path="materials/methods/DiffuseSubSurfaceMethod.ts"/>
///<reference path="materials/methods/DiffuseWrapMethod.ts"/>
///<reference path="materials/methods/EffectAlphaMaskMethod.ts"/>
///<reference path="materials/methods/EffectColorMatrixMethod.ts"/>
///<reference path="materials/methods/EffectEnvMapMethod.ts"/>
///<reference path="materials/methods/EffectFogMethod.ts"/>
///<reference path="materials/methods/EffectFresnelEnvMapMethod.ts"/>
///<reference path="materials/methods/EffectLightMapMethod.ts"/>
///<reference path="materials/methods/EffectRefractionEnvMapMethod.ts"/>
///<reference path="materials/methods/EffectRimLightMethod.ts"/>
///<reference path="materials/methods/NormalHeightMapMethod.ts"/>
///<reference path="materials/methods/NormalSimpleWaterMethod.ts"/>
///<reference path="materials/methods/ShadowCascadeMethod.ts"/>
///<reference path="materials/methods/ShadowDitheredMethod.ts"/>
///<reference path="materials/methods/ShadowFilteredMethod.ts"/>
///<reference path="materials/methods/ShadowNearMethod.ts"/>
///<reference path="materials/methods/ShadowSoftMethod.ts"/>
///<reference path="materials/methods/SpecularCompositeMethod.ts"/>
///<reference path="materials/methods/SpecularAnisotropicMethod.ts"/>
///<reference path="materials/methods/SpecularCelMethod.ts"/>
///<reference path="materials/methods/SpecularFresnelMethod.ts"/>
///<reference path="materials/methods/SpecularPhongMethod.ts"/>
///<reference path="utils/PerspectiveMatrix3D.ts"/>
///<reference path="animators/data/AnimationSubGeometry.ts"/>
///<reference path="animators/data/ColorSegmentPoint.ts"/>
///<reference path="animators/data/JointPose.ts"/>
///<reference path="animators/data/ParticleAnimationData.ts"/>
///<reference path="animators/data/ParticleData.ts"/>
///<reference path="animators/data/ParticleProperties.ts"/>
///<reference path="animators/data/ParticlePropertiesMode.ts"/>
///<reference path="animators/data/Skeleton.ts"/>
///<reference path="animators/data/VertexAnimationMode.ts"/>
///<reference path="animators/data/SkeletonJoint.ts"/>
///<reference path="animators/data/SkeletonPose.ts"/>
///<reference path="animators/data/VertexAnimationMode.ts"/>
///<reference path="animators/nodes/AnimationClipNodeBase.ts"/>
///<reference path="animators/nodes/ParticleNodeBase.ts"/>
///<reference path="animators/nodes/ParticleAccelerationNode.ts"/>
///<reference path="animators/nodes/ParticleBezierCurveNode.ts"/>
///<reference path="animators/nodes/ParticleBillboardNode.ts"/>
///<reference path="animators/nodes/ParticleColorNode.ts"/>
///<reference path="animators/nodes/ParticleFollowNode.ts"/>
///<reference path="animators/nodes/ParticleInitialColorNode.ts"/>
///<reference path="animators/nodes/ParticleOrbitNode.ts"/>
///<reference path="animators/nodes/ParticleOscillatorNode.ts"/>
///<reference path="animators/nodes/ParticlePositionNode.ts"/>
///<reference path="animators/nodes/ParticleRotateToHeadingNode.ts"/>
///<reference path="animators/nodes/ParticleRotateToPositionNode.ts"/>
///<reference path="animators/nodes/ParticleRotationalVelocityNode.ts"/>
///<reference path="animators/nodes/ParticleScaleNode.ts"/>
///<reference path="animators/nodes/ParticleSegmentedColorNode.ts"/>
///<reference path="animators/nodes/ParticleSpriteSheetNode.ts"/>
///<reference path="animators/nodes/ParticleTimeNode.ts"/>
///<reference path="animators/nodes/ParticleUVNode.ts"/>
///<reference path="animators/nodes/ParticleVelocityNode.ts"/>
///<reference path="animators/nodes/SkeletonBinaryLERPNode.ts"/>
///<reference path="animators/nodes/SkeletonClipNode.ts"/>
///<reference path="animators/nodes/SkeletonDifferenceNode.ts"/>
///<reference path="animators/nodes/SkeletonDirectionalNode.ts"/>
///<reference path="animators/nodes/SkeletonNaryLERPNode.ts"/>
///<reference path="animators/nodes/VertexClipNode.ts"/>
///<reference path="animators/states/ISkeletonAnimationState.ts"/>
///<reference path="animators/states/IVertexAnimationState.ts"/>
///<reference path="animators/states/AnimationStateBase.ts"/>
///<reference path="animators/states/ParticleStateBase.ts"/>
///<reference path="animators/states/ParticleAccelerationState.ts"/>
///<reference path="animators/states/ParticleBezierCurveState.ts"/>
///<reference path="animators/states/ParticleBillboardState.ts"/>
///<reference path="animators/states/ParticleColorState.ts"/>
///<reference path="animators/states/ParticleFollowState.ts"/>
///<reference path="animators/states/ParticleInitialColorState.ts"/>
///<reference path="animators/states/ParticleOrbitState.ts"/>
///<reference path="animators/states/ParticleOscillatorState.ts"/>
///<reference path="animators/states/ParticlePositionState.ts"/>
///<reference path="animators/states/ParticleRotateToHeadingState.ts"/>
///<reference path="animators/states/ParticleRotateToPositionState.ts"/>
///<reference path="animators/states/ParticleRotationalVelocityState.ts"/>
///<reference path="animators/states/ParticleScaleState.ts"/>
///<reference path="animators/states/ParticleSegmentedColorState.ts"/>
///<reference path="animators/states/ParticleSpriteSheetState.ts"/>
///<reference path="animators/states/ParticleTimeState.ts"/>
///<reference path="animators/states/ParticleUVState.ts"/>
///<reference path="animators/states/ParticleVelocityState.ts"/>
///<reference path="animators/states/AnimationClipState.ts"/>
///<reference path="animators/states/SkeletonBinaryLERPState.ts"/>
///<reference path="animators/states/SkeletonClipState.ts"/>
///<reference path="animators/states/SkeletonDifferenceState.ts"/>
///<reference path="animators/states/SkeletonDirectionalState.ts"/>
///<reference path="animators/states/SkeletonNaryLERPState.ts"/>
///<reference path="animators/states/VertexClipState.ts"/>
///<reference path="animators/transitions/IAnimationTransition.ts"/>
///<reference path="animators/transitions/CrossfadeTransition.ts"/>
///<reference path="animators/transitions/CrossfadeTransitionNode.ts"/>
///<reference path="animators/transitions/CrossfadeTransitionState.ts"/>
///<reference path="animators/ParticleAnimationSet.ts"/>
///<reference path="animators/ParticleAnimator.ts"/>
///<reference path="animators/SkeletonAnimator.ts"/>
///<reference path="animators/SkeletonAnimationSet.ts"/>
///<reference path="animators/VertexAnimationSet.ts"/>
///<reference path="animators/VertexAnimator.ts"/>
///<reference path="parsers/OBJParser.ts"/>
///<reference path="parsers/AWDParser.ts"/>
///<reference path="parsers/Max3DSParser.ts"/>
///<reference path="parsers/MD2Parser.ts"/>
///<reference path="parsers/MD5AnimParser.ts"/>
///<reference path="parsers/MD5MeshParser.ts"/>
///<reference path="parsers/Parsers.ts"/>
///<reference path="tools/commands/Merge.ts"/>
///<reference path="tools/data/ParticleGeometryTransform.ts"/>
///<reference path="tools/helpers/ParticleGeometryHelper.ts"/>
///<reference path="away/_definitions.ts"/>
away.Debug.THROW_ERRORS = false;
away.Debug.LOG_PI_ERRORS = false;

var away;
(function (away) {
    var StageGLRenderer = (function (_super) {
        __extends(StageGLRenderer, _super);
        function StageGLRenderer() {
            _super.call(this);
        }
        return StageGLRenderer;
    })(away.events.EventDispatcher);
    away.StageGLRenderer = StageGLRenderer;
})(away || (away = {}));
//# sourceMappingURL=stagegl-extensions.next.js.map
