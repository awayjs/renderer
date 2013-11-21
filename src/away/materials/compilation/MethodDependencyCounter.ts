///<reference path="../../_definitions.ts"/>
module away.materials
{
	//import away3d.materials.LightSources;
	//import away3d.materials.methods.MethodVO;

	/**
	 * MethodDependencyCounter keeps track of the number of dependencies for "named registers" used across methods.
	 * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
	 * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
	 * each time a method has been compiled into the shader.
	 *
	 * @see RegisterPool.addUsage
	 */
	export class MethodDependencyCounter
	{
		private _projectionDependencies:number;
		private _normalDependencies:number;
		private _viewDirDependencies:number;
		private _uvDependencies:number;
		private _secondaryUVDependencies:number;
		private _globalPosDependencies:number;
		private _tangentDependencies:number;
		private _usesGlobalPosFragment:boolean = false;
		private _numPointLights:number;
		private _lightSourceMask:number;

		/**
		 * Creates a new MethodDependencyCounter object.
		 */
			constructor()
		{
		}

		/**
		 * Clears dependency counts for all registers. Called when recompiling a pass.
		 */
		public reset()
		{
			this._projectionDependencies = 0;
			this._normalDependencies = 0;
			this._viewDirDependencies = 0;
			this._uvDependencies = 0;
			this._secondaryUVDependencies = 0;
			this._globalPosDependencies = 0;
			this._tangentDependencies = 0;
			this._usesGlobalPosFragment = false;
		}

		/**
		 * Sets the amount of lights that have a position associated with them.
		 * @param numPointLights The amount of point lights.
		 * @param lightSourceMask The light source types used by the material.
		 */
		public setPositionedLights(numPointLights:number, lightSourceMask:number)
		{
			this._numPointLights = numPointLights;
			this._lightSourceMask = lightSourceMask;
		}

		/**
		 * Increases dependency counters for the named registers listed as required by the given MethodVO.
		 * @param methodVO the MethodVO object for which to include dependencies.
		 */
		public includeMethodVO(methodVO:away.materials.MethodVO)
		{
			if (methodVO.needsProjection) {

				++this._projectionDependencies;

			}

			if (methodVO.needsGlobalVertexPos) {

				++this._globalPosDependencies;

				if (methodVO.needsGlobalFragmentPos) {

					this._usesGlobalPosFragment = true;

				}

			} else if (methodVO.needsGlobalFragmentPos) {

				++this._globalPosDependencies;
				this._usesGlobalPosFragment = true;

			}

			if (methodVO.needsNormals) {

				++this._normalDependencies;

			}

			if (methodVO.needsTangents) {

				++this._tangentDependencies;

			}

			if (methodVO.needsView) {

				++this._viewDirDependencies;

			}

			if (methodVO.needsUV) {

				++this._uvDependencies;

			}

			if (methodVO.needsSecondaryUV) {

				++this._secondaryUVDependencies;

			}

		}

		/**
		 * The amount of tangent vector dependencies (fragment shader).
		 */
		public get tangentDependencies():number
		{
			return this._tangentDependencies;
		}

		/**
		 * Indicates whether there are any dependencies on the world-space position vector.
		 */
		public get usesGlobalPosFragment():boolean
		{
			return this._usesGlobalPosFragment;
		}

		/**
		 * The amount of dependencies on the projected position.
		 */
		public get projectionDependencies():number
		{
			return this._projectionDependencies;
		}

		/**
		 * The amount of dependencies on the normal vector.
		 */
		public get normalDependencies():number
		{
			return this._normalDependencies;
		}

		/**
		 * The amount of dependencies on the view direction.
		 */
		public get viewDirDependencies():number
		{
			return this._viewDirDependencies;
		}

		/**
		 * The amount of dependencies on the primary UV coordinates.
		 */
		public get uvDependencies():number
		{
			return this._uvDependencies;
		}

		/**
		 * The amount of dependencies on the secondary UV coordinates.
		 */
		public get secondaryUVDependencies():number
		{
			return this._secondaryUVDependencies;
		}

		/**
		 * The amount of dependencies on the global position. This can be 0 while hasGlobalPosDependencies is true when
		 * the global position is used as a temporary value (fe to calculate the view direction)
		 */
		public get globalPosDependencies():number
		{
			return this._globalPosDependencies;
		}

		/**
		 * Adds any external world space dependencies, used to force world space calculations.
		 */
		public addWorldSpaceDependencies(fragmentLights:boolean)
		{
			if (this._viewDirDependencies > 0) {

				++this._globalPosDependencies;

			}


			if (this._numPointLights > 0 && (this._lightSourceMask & away.materials.LightSources.LIGHTS)) {
				++this._globalPosDependencies;

				if (fragmentLights) {

					this._usesGlobalPosFragment = true;

				}

			}
		}
	}
}
