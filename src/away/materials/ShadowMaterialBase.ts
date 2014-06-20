///<reference path="../_definitions.ts"/>

module away.materials
{
	import AnimationSetBase				= away.animators.AnimationSetBase;
	import AnimatorBase					= away.animators.AnimatorBase;
	import BlendMode					= away.base.BlendMode;
	import IMaterialOwner				= away.base.IMaterialOwner;
	import Stage						= away.base.Stage;
	import Camera						= away.entities.Camera;
	import Event						= away.events.Event;
	import Matrix3D						= away.geom.Matrix3D;
	import AssetType					= away.library.AssetType;
	import DepthMapPass					= away.materials.DepthMapPass;
	import DistanceMapPass				= away.materials.DistanceMapPass;
	import MaterialPassBase				= away.materials.MaterialPassBase;
	import RenderableBase				= away.pool.RenderableBase;
	import ICollector					= away.traverse.ICollector;

	/**
	 * MaterialBase forms an abstract base class for any material.
	 * A material consists of several passes, each of which constitutes at least one render call. Several passes could
	 * be used for special effects (render lighting for many lights in several passes, render an outline in a separate
	 * pass) or to provide additional render-to-texture passes (rendering diffuse light to texture for texture-space
	 * subsurface scattering, or rendering a depth map for specialized self-shadowing).
	 *
	 * Away3D provides default materials trough SinglePassMaterialBase and TriangleMaterial, which use modular
	 * methods to build the shader code. MaterialBase can be extended to build specific and high-performant custom
	 * shaders, or entire new material frameworks.
	 */
	export class ShadowMaterialBase extends MaterialBase
	{
		public _pDepthPass:DepthMapPass;
		public _pDistancePass:DistanceMapPass;

		private _distanceBasedDepthRender:boolean;

		public _pHeight:number = 1;
		public _pWidth:number = 1;
		public _pRequiresBlending:boolean = false;

		/**
		 * Creates a new MaterialBase object.
		 */
		constructor()
		{
			super();

			this._iBaseScreenPassIndex = 2; //allow for depth pass objects
		}

		public pAddDepthPasses()
		{
			this.pAddPass(this._pDepthPass = new DepthMapPass(this));
			this.pAddPass(this._pDistancePass = new DistanceMapPass(this));
		}

		/**
		 * Indicates that the depth pass uses transparency testing to discard pixels.
		 *
		 * @private
		 */

		public iHasDepthAlphaThreshold():boolean
		{
			return this._pDepthPass.alphaThreshold > 0;
		}

		/**
		 * Sets the render state for the depth pass that is independent of the rendered object. Used when rendering
		 * depth or distances (fe: shadow maps, depth pre-pass).
		 *
		 * @param stage The Stage used for rendering.
		 * @param camera The camera from which the scene is viewed.
		 * @param distanceBased Whether or not the depth pass or distance pass should be activated. The distance pass
		 * is required for shadow cube maps.
		 *
		 * @internal
		 */
		public iActivateForDepth(stage:Stage, camera:Camera, distanceBased:boolean = false) // ARCANE
		{
			this._distanceBasedDepthRender = distanceBased;

			if (distanceBased)
				this._pDistancePass.iActivate(stage, camera);
			else
				this._pDepthPass.iActivate(stage, camera);
		}

		/**
		 * Clears the render state for the depth pass.
		 *
		 * @param stage The Stage used for rendering.
		 *
		 * @internal
		 */
		public iDeactivateForDepth(stage:Stage)
		{
			if (this._distanceBasedDepthRender)
				this._pDistancePass.iDeactivate(stage);
			else
				this._pDepthPass.iDeactivate(stage);
		}

		/**
		 * Renders a renderable using the depth pass.
		 *
		 * @param renderable The RenderableBase instance that needs to be rendered.
		 * @param stage The Stage used for rendering.
		 * @param camera The camera from which the scene is viewed.
		 * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
		 * camera.viewProjection as it includes the scaling factors when rendering to textures.
		 *
		 * @internal
		 */
		public iRenderDepth(renderable:RenderableBase, stage:Stage, camera:Camera, viewProjection:Matrix3D)
		{
			if (this._distanceBasedDepthRender) {
				if (renderable.materialOwner.animator)
					this._pDistancePass.iUpdateAnimationState(renderable, stage, camera);

				this._pDistancePass.iRender(renderable, stage, camera, viewProjection);

			} else {
				if (renderable.materialOwner.animator)
					this._pDepthPass.iUpdateAnimationState(renderable, stage, camera);

				this._pDepthPass.iRender(renderable, stage, camera, viewProjection);
			}
		}
	}
}