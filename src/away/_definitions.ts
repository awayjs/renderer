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

///<reference path="../../build/ref/webgl.d.ts"/>
///<reference path="../../build/ref/js.d.ts"/>

///<reference path="errors/Error.ts" />
///<reference path="errors/ArgumentError.ts" />
///<reference path="errors/PartialImplementationError.ts" />
///<reference path="errors/AbstractMethodError.ts" />
///<reference path="errors/DocumentError.ts" />
///<reference path="errors/CastError.ts"/>
///<reference path="errors/AnimationSetError.ts"/>

///<reference path="events/Event.ts" />
///<reference path="events/EventDispatcher.ts" />
///<reference path="events/IEventDispatcher.ts" />
///<reference path="events/LightEvent.ts" />
///<reference path="events/IOErrorEvent.ts" />
///<reference path="events/HTTPStatusEvent.ts" />
///<reference path="events/ProgressEvent.ts" />
///<reference path="events/LoaderEvent.ts" />
///<reference path="events/CameraEvent.ts" />
///<reference path="events/AssetEvent.ts" />
///<reference path="events/TimerEvent.ts" />
///<reference path="events/ParserEvent.ts" />
///<reference path="events/Scene3DEvent.ts" />
///<reference path="events/Object3DEvent.ts" />
///<reference path="events/MouseEvent3D.ts"/>
///<reference path="events/LensEvent.ts" />
///<reference path="events/AnimationStateEvent.ts" />
///<reference path="events/AnimatorEvent.ts" />
///<reference path="events/ShadingMethodEvent.ts"/>
///<reference path="events/Stage3DEvent.ts"/>
///<reference path="events/GeometryEvent.ts"/>

///<reference path="library/assets/IAsset.ts" />
///<reference path="library/assets/NamedAssetBase.ts" />
///<reference path="library/assets/AssetType.ts" />
///<reference path="library/naming/ConflictStrategyBase.ts" />
///<reference path="library/naming/NumSuffixConflictStrategy.ts" />
///<reference path="library/naming/IgnoreConflictStrategy.ts" />
///<reference path="library/naming/ErrorConflictStrategy.ts" />
///<reference path="library/naming/ConflictPrecedence.ts" />
///<reference path="library/naming/ConflictStrategy.ts" />
///<reference path="library/utils/AssetLibraryIterator.ts"/>
///<reference path="library/utils/IDUtil.ts" />
///<reference path="library/AssetLibraryBundle.ts"/>
///<reference path="library/AssetLibrary.ts" />

///<reference path="core/base/Object3D.ts" />
///<reference path="core/base/SubMesh.ts"/>
///<reference path="core/base/IRenderable.ts" />
///<reference path="core/base/IMaterialOwner.ts" />
///<reference path="core/base/SubGeometryBase.ts"/>
///<reference path="core/base/ISubGeometry.ts"/>
///<reference path="core/base/CompactSubGeometry.ts"/>
///<reference path="core/base/SkinnedSubGeometry.ts"/>
///<reference path="core/base/Geometry.ts"/>
///<reference path="core/base/SubGeometry.ts"/>

///<reference path="core/data/RenderableListItem.ts"/>
///<reference path="core/data/EntityListItem.ts"/>
///<reference path="core/data/EntityListItemPool.ts"/>
///<reference path="core/data/RenderableListItemPool.ts"/>

///<reference path="core/traverse/PartitionTraverser.ts" />
///<reference path="core/traverse/EntityCollector.ts" />
///<reference path="core/traverse/ShadowCasterCollector.ts" />
///<reference path="core/traverse/RaycastCollector.ts" />

///<reference path="core/display/BitmapData.ts"/>
///<reference path="core/display/BitmapDataChannel.ts"/>
///<reference path="core/display/BlendMode.ts"/>
///<reference path="core/display/Stage3D.ts" />
///<reference path="core/display/Stage.ts"/>

///<reference path="core/display3D/Context3DClearMask.ts"/>
///<reference path="core/display3D/VertexBuffer3D.ts"/>
///<reference path="core/display3D/IndexBuffer3D.ts"/>
///<reference path="core/display3D/Program3D.ts"/>
///<reference path="core/display3D/SamplerState.ts"/>
///<reference path="core/display3D/Context3DTextureFormat.ts"/>
///<reference path="core/display3D/TextureBase.ts"/>
///<reference path="core/display3D/Texture.ts" />
///<reference path="core/display3D/CubeTexture.ts" />
///<reference path="core/display3D/Context3DTriangleFace.ts"/>
///<reference path="core/display3D/Context3DVertexBufferFormat.ts"/>
///<reference path="core/display3D/Context3DProgramType.ts"/>
///<reference path="core/display3D/Context3DBlendFactor.ts"/>
///<reference path="core/display3D/Context3DCompareMode.ts"/>
///<reference path="core/display3D/Context3DMipFilter.ts"/>
///<reference path="core/display3D/Context3DProfile.ts"/>
///<reference path="core/display3D/Context3DStencilAction.ts"/>
///<reference path="core/display3D/Context3DTextureFilter.ts"/>
///<reference path="core/display3D/Context3DWrapMode.ts"/>
///<reference path="core/display3D/Context3D.ts" />
///<reference path="core/display3D/AGLSLContext3D.ts" />

///<reference path="core/geom/ColorTransform.ts"/>
///<reference path="core/geom/Matrix.ts" />
///<reference path="core/geom/Matrix3D.ts" />
///<reference path="core/geom/Point.ts" />
///<reference path="core/geom/Rectangle.ts" />
///<reference path="core/geom/Vector3D.ts" />

///<reference path="core/math/MathConsts.ts" />
///<reference path="core/math/Quaternion.ts" />
///<reference path="core/math/PlaneClassification.ts" />
///<reference path="core/math/Plane3D.ts" />
///<reference path="core/math/Matrix3DUtils.ts" />
///<reference path="core/math/PoissonLookup.ts" />

///<reference path="core/net/URLRequest.ts" />
///<reference path="core/net/IMGLoader.ts" />
///<reference path="core/net/URLLoaderDataFormat.ts" />
///<reference path="core/net/URLRequestMethod.ts" />
///<reference path="core/net/URLLoader.ts" />
///<reference path="core/net/URLVariables.ts" />

///<reference path="core/partition/NodeBase.ts" />
///<reference path="core/partition/NullNode.ts" />
///<reference path="core/partition/Partition3D.ts" />
///<reference path="core/partition/EntityNode.ts" />
///<reference path="core/partition/CameraNode.ts" />
///<reference path="core/partition/LightNode.ts" />
///<reference path="core/partition/DirectionalLightNode.ts" />
///<reference path="core/partition/PointLightNode.ts"/>
///<reference path="core/partition/LightProbeNode.ts"/>
///<reference path="core/partition/MeshNode.ts" />
///<reference path="core/partition/SkyBoxNode.ts" />
///<reference path="core/partition/RenderableNode.ts" />

///<reference path="core/pick/IPickingCollider.ts" />
///<reference path="core/pick/PickingColliderBase.ts" />
///<reference path="core/pick/PickingCollisionVO.ts" />
///<reference path="core/pick/AS3PickingCollider.ts" />
///<reference path="core/pick/PickingColliderType.ts" />
///<reference path="core/pick/IPicker.ts"/>
///<reference path="core/pick/PickingColliderBase.ts" />
///<reference path="core/pick/AS3PickingCollider.ts" />
///<reference path="core/pick/ShaderPicker.ts" />
///<reference path="core/pick/RaycastPicker.ts" />
///<reference path="core/pick/PickingType.ts"/>

///<reference path="core/render/RendererBase.ts"/>
///<reference path="core/render/DepthRenderer.ts"/>
///<reference path="core/render/DefaultRenderer.ts"/>
///<reference path="core/render/Filter3DRenderer.ts"/>

///<reference path="core/sort/IEntitySorter.ts"/>
///<reference path="core/sort/RenderableMergeSort.ts"/>

///<reference path="core/ui/Keyboard.ts"/>

///<reference path="containers/ObjectContainer3D.ts" />
///<reference path="containers/Scene3D.ts" />
///<reference path="containers/View3D.ts"/>

///<reference path="entities/Entity.ts" />
///<reference path="entities/SegmentSet.ts" />
///<reference path="entities/Mesh.ts"/>
///<reference path="entities/SkyBox.ts" />
///<reference path="entities/Sprite3D.ts"/>

///<reference path="bounds/BoundingVolumeBase.ts" />
///<reference path="bounds/NullBounds.ts" />
///<reference path="bounds/BoundingSphere.ts" />
///<reference path="bounds/AxisAlignedBoundingBox.ts" />

///<reference path="cameras/lenses/LensBase.ts" />
///<reference path="cameras/lenses/PerspectiveLens.ts" />
///<reference path="cameras/lenses/FreeMatrixLens.ts" />
///<reference path="cameras/lenses/OrthographicLens.ts" />
///<reference path="cameras/lenses/OrthographicOffCenterLens.ts" />
///<reference path="cameras/lenses/PerspectiveOffCenterLens.ts" />
///<reference path="cameras/lenses/ObliqueNearPlaneLens.ts" />
///<reference path="cameras/Camera3D.ts" />

///<reference path="controllers/ControllerBase.ts"/>
///<reference path="controllers/LookAtController.ts"/>
///<reference path="controllers/HoverController.ts"/>
///<reference path="controllers/FirstPersonController.ts"/>
///<reference path="controllers/FollowController.ts"/>
///<reference path="controllers/SpringController.ts"/>

///<reference path="filters/tasks/Filter3DTaskBase.ts"/>
///<reference path="filters/Filter3DBase.ts"/>

///<reference path="lights/shadowmaps/ShadowMapperBase.ts"/>
///<reference path="lights/shadowmaps/CubeMapShadowMapper.ts"/>
///<reference path="lights/shadowmaps/DirectionalShadowMapper.ts"/>
///<reference path="lights/LightBase.ts"/>
///<reference path="lights/PointLight.ts"/>
///<reference path="lights/DirectionalLight.ts"/>
///<reference path="lights/LightProbe.ts"/>

///<reference path="lights/LightBase.ts"/>
///<reference path="lights/LightProbe.ts"/>
///<reference path="lights/PointLight.ts"/>
///<reference path="lights/DirectionalLight.ts"/>
///<reference path="lights/shadowmaps/ShadowMapperBase.ts"/>
///<reference path="lights/shadowmaps/CubeMapShadowMapper.ts"/>
///<reference path="lights/shadowmaps/DirectionalShadowMapper.ts"/>
///<reference path="lights/shadowmaps/NearDirectionalShadowMapper.ts"/>

///<reference path="managers/RTTBufferManager.ts"/>
///<reference path="managers/Stage3DProxy.ts"/>
///<reference path="managers/Mouse3DManager.ts"/>
///<reference path="managers/Stage3DManager.ts"/>
///<reference path="managers/AGALProgram3DCache.ts"/>

///<reference path="materials/utils/MipmapGenerator.ts" />

///<reference path="materials/passes/MaterialPassBase.ts"/>
///<reference path="materials/passes/CompiledPass.ts"/>
///<reference path="materials/passes/SuperShaderPass.ts"/>
///<reference path="materials/passes/DepthMapPass.ts"/>
///<reference path="materials/passes/DistanceMapPass.ts"/>
///<reference path="materials/passes/LightingPass.ts"/>
///<reference path="materials/passes/ShadowCasterPass.ts"/>
///<reference path="materials/passes/SegmentPass.ts"/>
///<reference path="materials/passes/SkyBoxPass.ts"/>

///<reference path="materials/methods/MethodVO.ts"/>
///<reference path="materials/methods/ShadingMethodBase.ts"/>
///<reference path="materials/methods/EffectMethodBase.ts"/>
///<reference path="materials/methods/MethodVOSet.ts"/>
///<reference path="materials/methods/ShaderMethodSetup.ts"/>
///<reference path="materials/methods/LightingMethodBase.ts"/>
///<reference path="materials/methods/ShadowMapMethodBase.ts"/>
///<reference path="materials/methods/SimpleShadowMapMethodBase.ts"/>
///<reference path="materials/methods/FilteredShadowMapMethod.ts"/>
///<reference path="materials/methods/FogMethod.ts"/>
///<reference path="materials/methods/HardShadowMapMethod.ts"/>
///<reference path="materials/methods/SoftShadowMapMethod.ts"/>
///<reference path="materials/methods/DitheredShadowMapMethod.ts"/>
///<reference path="materials/methods/NearShadowMapMethod.ts"/>
///<reference path="materials/methods/BasicAmbientMethod.ts"/>
///<reference path="materials/methods/BasicDiffuseMethod.ts"/>
///<reference path="materials/methods/BasicNormalMethod.ts"/>
///<reference path="materials/methods/BasicSpecularMethod.ts"/>
///<reference path="materials/methods/ColorTransformMethod.ts"/>
///<reference path="materials/methods/PhongSpecularMethod.ts"/>
///<reference path="materials/methods/CompositeDiffuseMethod.ts"/>
///<reference path="materials/methods/CompositeSpecularMethod.ts"/>
///<reference path="materials/methods/EnvMapMethod.ts"/>
///<reference path="materials/methods/FresnelSpecularMethod.ts"/>
///<reference path="materials/methods/SimpleWaterNormalMethod.ts"/>

///<reference path="materials/lightpickers/LightPickerBase.ts"/>
///<reference path="materials/lightpickers/StaticLightPicker.ts"/>

///<reference path="materials/compilation/ShaderRegisterCache.ts"/>
///<reference path="materials/compilation/ShaderRegisterElement.ts"/>
///<reference path="materials/compilation/ShaderRegisterData.ts"/>
///<reference path="materials/compilation/MethodDependencyCounter.ts"/>
///<reference path="materials/compilation/RegisterPool.ts"/>
///<reference path="materials/compilation/ShaderRegisterCache.ts"/>
///<reference path="materials/compilation/ShaderCompiler.ts"/>
///<reference path="materials/compilation/SuperShaderCompiler.ts"/>

///<reference path="materials/LightSources.ts"/>
///<reference path="materials/MaterialBase.ts"/>
///<reference path="materials/SinglePassMaterialBase.ts"/>
///<reference path="materials/MultiPassMaterialBase.ts"/>
///<reference path="materials/TextureMultiPassMaterial.ts"/>
///<reference path="materials/ColorMultiPassMaterial.ts"/>
///<reference path="materials/TextureMaterial.ts"/>
///<reference path="materials/ColorMaterial.ts"/>
///<reference path="materials/utils/DefaultMaterialManager.ts"/>
///<reference path="materials/compilation/LightingShaderCompiler.ts"/>
///<reference path="materials/SegmentMaterial.ts"/>
///<reference path="materials/SkyBoxMaterial.ts"/>

///<reference path="primitives/data/Segment.ts" />
///<reference path="primitives/PrimitiveBase.ts"/>
///<reference path="primitives/LineSegment.ts"/>
///<reference path="primitives/TorusGeometry.ts"/>
///<reference path="primitives/CubeGeometry.ts"/>
///<reference path="primitives/PlaneGeometry.ts"/>
///<reference path="primitives/CapsuleGeometry.ts" />
///<reference path="primitives/CylinderGeometry.ts" />
///<reference path="primitives/ConeGeometry.ts" />
///<reference path="primitives/RegularPolygonGeometry.ts" />
///<reference path="primitives/SphereGeometry.ts" />
///<reference path="primitives/WireframePrimitiveBase.ts" />
///<reference path="primitives/WireframeSphere.ts" />
///<reference path="primitives/WireframeCube.ts" />
///<reference path="primitives/WireframeCylinder.ts" />
///<reference path="primitives/WireframePlane.ts" />
///<reference path="primitives/WireframeRegularPolygon.ts" />
///<reference path="primitives/WireframeTetrahedron.ts" />

///<reference path="textures/TextureProxyBase.ts" />
///<reference path="textures/Texture2DBase.ts" />
///<reference path="textures/HTMLImageElementTexture.ts" />
///<reference path="textures/BitmapTexture.ts" />
///<reference path="textures/CubeTextureBase.ts" />
///<reference path="textures/RenderTexture.ts" />
///<reference path="textures/HTMLImageElementCubeTexture.ts" />
///<reference path="textures/BitmapCubeTexture.ts" />

///<reference path="utils/ByteArrayBase.ts"/>
///<reference path="utils/ByteArray.ts"/>
///<reference path="utils/ByteArrayBuffer.ts"/>
///<reference path="utils/Cast.ts"/>
///<reference path="utils/ColorUtils.ts"/>
///<reference path="utils/CSS.ts" />
///<reference path="utils/Debug.ts"/>
///<reference path="utils/GeometryUtils.ts"/>
///<reference path="utils/getTimer.ts" />
///<reference path="utils/PerspectiveMatrix3D.ts"/>
///<reference path="utils/RequestAnimationFrame.ts"/>
///<reference path="utils/TextureUtils.ts" />
///<reference path="utils/Timer.ts" />

///<reference path="animators/data/JointPose.ts"/>
///<reference path="animators/data/Skeleton.ts"/>
///<reference path="animators/data/VertexAnimationMode.ts"/>
///<reference path="animators/data/SkeletonJoint.ts"/>
///<reference path="animators/data/SkeletonPose.ts"/>
///<reference path="animators/data/VertexAnimationMode.ts"/>

///<reference path="animators/nodes/AnimationNodeBase.ts"/>
///<reference path="animators/nodes/AnimationClipNodeBase.ts"/>
///<reference path="animators/nodes/SkeletonBinaryLERPNode.ts"/>
///<reference path="animators/nodes/SkeletonClipNode.ts"/>
///<reference path="animators/nodes/SkeletonDifferenceNode.ts"/>
///<reference path="animators/nodes/SkeletonDirectionalNode.ts"/>
///<reference path="animators/nodes/SkeletonNaryLERPNode.ts"/>
///<reference path="animators/nodes/VertexClipNode.ts"/>

///<reference path="animators/states/IAnimationState.ts"/>
///<reference path="animators/states/ISkeletonAnimationState.ts"/>
///<reference path="animators/states/IVertexAnimationState.ts"/>
///<reference path="animators/states/AnimationStateBase.ts"/>
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

///<reference path="animators/AnimationSetBase.ts"/>
///<reference path="animators/AnimatorBase.ts"/>
///<reference path="animators/IAnimationSet.ts"/>
///<reference path="animators/IAnimator.ts"/>
///<reference path="animators/SkeletonAnimator.ts"/>
///<reference path="animators/SkeletonAnimationSet.ts"/>
///<reference path="animators/VertexAnimationSet.ts"/>
///<reference path="animators/VertexAnimator.ts"/>

///<reference path="loaders/misc/AssetLoaderContext.ts"/>
///<reference path="loaders/AssetLoader.ts" />
///<reference path="loaders/misc/AssetLoaderToken.ts" />
///<reference path="loaders/parsers/ParserBase.ts" />
///<reference path="loaders/Loader3D.ts" />
///<reference path="loaders/misc/ISingleFileTSLoader.ts" />
///<reference path="loaders/parsers/ParserDataFormat.ts" />
///<reference path="loaders/parsers/ImageParser.ts" />
///<reference path="loaders/parsers/CubeTextureParser.ts"/>
///<reference path="loaders/misc/SingleFileLoader.ts"/>
///<reference path="loaders/misc/SingleFileImageLoader.ts" />
///<reference path="loaders/misc/SingleFileURLLoader.ts" />
///<reference path="loaders/misc/ResourceDependency.ts" />
///<reference path="loaders/parsers/ParserLoaderType.ts" />
///<reference path="loaders/parsers/utils/ParserUtil.ts"/>
///<reference path="loaders/parsers/OBJParser.ts"/>
///<reference path="loaders/parsers/AWDParser.ts"/>
///<reference path="loaders/parsers/Max3DSParser.ts"/>
///<reference path="loaders/parsers/MD2Parser.ts"/>
///<reference path="loaders/parsers/MD5AnimParser.ts"/>
///<reference path="loaders/parsers/MD5MeshParser.ts"/>
///<reference path="loaders/parsers/Parsers.ts"/>

///<reference path="../aglsl/Sampler.ts"/>
///<reference path="../aglsl/Token.ts"/>
///<reference path="../aglsl/Header.ts"/>
///<reference path="../aglsl/OpLUT.ts"/>
///<reference path="../aglsl/Header.ts"/>
///<reference path="../aglsl/Description.ts"/>
///<reference path="../aglsl/Destination.ts"/>
///<reference path="../aglsl/Context3D.ts"/>
///<reference path="../aglsl/Mapping.ts"/>
///<reference path="../aglsl/assembler/OpCode.ts"/>
///<reference path="../aglsl/assembler/OpcodeMap.ts"/>
///<reference path="../aglsl/assembler/Part.ts"/>
///<reference path="../aglsl/assembler/RegMap.ts"/>
///<reference path="../aglsl/assembler/SamplerMap.ts"/>
///<reference path="../aglsl/assembler/AGALMiniAssembler.ts"/>
///<reference path="../aglsl/AGALTokenizer.ts"/>
///<reference path="../aglsl/Parser.ts"/>
///<reference path="../aglsl/AGLSLCompiler.ts"/>
