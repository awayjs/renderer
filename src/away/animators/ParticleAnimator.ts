///<reference path="../_definitions.ts"/>

module away.animators
{
	import ISubGeometry						= away.base.ISubGeometry;
	import SubMesh							= away.base.SubMesh;
	import StageGL							= away.base.StageGL;
	import Camera							= away.entities.Camera;
	import Vector3D							= away.geom.Vector3D;
	import ContextGLProgramType				= away.gl.ContextGLProgramType;
	import ContextGLVertexBufferFormat		= away.gl.ContextGLVertexBufferFormat;
	import MaterialPassBase					= away.materials.MaterialPassBase;
	import RenderableBase					= away.pool.RenderableBase;
	
	/**
	 * Provides an interface for assigning paricle-based animation data sets to mesh-based entity objects
	 * and controlling the various available states of animation through an interative playhead that can be
	 * automatically updated or manually triggered.
	 *
	 * Requires that the containing geometry of the parent mesh is particle geometry
	 *
	 * @see away.base.ParticleGeometry
	 */
	export class ParticleAnimator extends AnimatorBase implements AnimatorBase
	{
		
		private _particleAnimationSet:ParticleAnimationSet;
		private _animationParticleStates:Array<ParticleStateBase> = new Array<ParticleStateBase>();
		private _animatorParticleStates:Array<ParticleStateBase> = new Array<ParticleStateBase>();
		private _timeParticleStates:Array<ParticleStateBase> = new Array<ParticleStateBase>();
		private _totalLenOfOneVertex:number /*uint*/ = 0;
		private _animatorSubGeometries:Object = new Object();
		
		/**
		 * Creates a new <code>ParticleAnimator</code> object.
		 *
		 * @param particleAnimationSet The animation data set containing the particle animations used by the animator.
		 */
		constructor(particleAnimationSet:ParticleAnimationSet)
		{
			super(particleAnimationSet);
			this._particleAnimationSet = particleAnimationSet;
			
			var state:ParticleStateBase;
			var node:ParticleNodeBase;

			for (var i:number = 0; i < this._particleAnimationSet.particleNodes.length; i++) {
				node = this._particleAnimationSet.particleNodes[i];
				state = <ParticleStateBase> this.getAnimationState(node);
				if (node.mode == ParticlePropertiesMode.LOCAL_DYNAMIC) {
					this._animatorParticleStates.push(state);
					node._iDataOffset = this._totalLenOfOneVertex;
					this._totalLenOfOneVertex += node.dataLength;
				} else
					this._animationParticleStates.push(state);
				if (state.needUpdateTime)
					this._timeParticleStates.push(state);
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public clone():AnimatorBase
		{
			return new ParticleAnimator(this._particleAnimationSet);
		}
		
		/**
		 * @inheritDoc
		 */
		public setRenderState(stageGL:StageGL, renderable:RenderableBase, vertexConstantOffset:number /*int*/, vertexStreamOffset:number /*int*/, camera:Camera)
		{
			var animationRegisterCache:AnimationRegisterCache = this._particleAnimationSet._iAnimationRegisterCache;
			
			var subMesh:SubMesh = (<away.pool.SubMeshRenderable> renderable).subMesh;
			var state:ParticleStateBase;
			var i:number;

			if (!subMesh)
				throw(new Error("Must be subMesh"));
			
			//process animation sub geometries
			if (!subMesh.animationSubGeometry)
				this._particleAnimationSet._iGenerateAnimationSubGeometries(<away.entities.Mesh> renderable.sourceEntity);
			
			var animationSubGeometry:AnimationSubGeometry = subMesh.animationSubGeometry;
			
			for (i = 0; i < this._animationParticleStates.length; i++)
				this._animationParticleStates[i].setRenderState(stageGL, renderable, animationSubGeometry, animationRegisterCache, camera);

			//process animator subgeometries
			if (!subMesh.animatorSubGeometry && this._animatorParticleStates.length)
				this.generateAnimatorSubGeometry(subMesh);
			
			var animatorSubGeometry:AnimationSubGeometry = subMesh.animatorSubGeometry;
			
			for (i = 0; i < this._animatorParticleStates.length; i++)
				this._animatorParticleStates[i].setRenderState(stageGL, renderable, animatorSubGeometry, animationRegisterCache, camera);
			
			stageGL.contextGL.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, animationRegisterCache.vertexConstantOffset, animationRegisterCache.vertexConstantData, animationRegisterCache.numVertexConstant);
			
			if (animationRegisterCache.numFragmentConstant > 0)
				stageGL.contextGL.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, animationRegisterCache.fragmentConstantOffset, animationRegisterCache.fragmentConstantData, animationRegisterCache.numFragmentConstant);
		}
		
		/**
		 * @inheritDoc
		 */
		public testGPUCompatibility(pass:MaterialPassBase)
		{
		
		}
		
		/**
		 * @inheritDoc
		 */
		public start()
		{
			super.start();

			for (var i:number = 0; i < this._timeParticleStates.length; i++)
				this._timeParticleStates[i].offset(this._pAbsoluteTime);
		}
		
		/**
		 * @inheritDoc
		 */
		public _pUpdateDeltaTime(dt:number)
		{
			this._pAbsoluteTime += dt;
			
			for (var i:number = 0; i < this._timeParticleStates.length; i++)
				this._timeParticleStates[i].update(this._pAbsoluteTime);
		}
		
		/**
		 * @inheritDoc
		 */
		public resetTime(offset:number /*int*/ = 0)
		{
			for (var i:number = 0; i < this._timeParticleStates.length; i++)
				this._timeParticleStates[i].offset(this._pAbsoluteTime + offset);
			this.update(this.time);
		}
		
		public dispose()
		{
			for (var key in this._animatorSubGeometries)
				(<AnimationSubGeometry> this._animatorSubGeometries[key]).dispose();
		}
		
		private generateAnimatorSubGeometry(subMesh:SubMesh)
		{
			var subGeometry:ISubGeometry = subMesh.subGeometry;
			var animatorSubGeometry:AnimationSubGeometry = subMesh.animatorSubGeometry = this._animatorSubGeometries[subGeometry.id] = new AnimationSubGeometry();
			
			//create the vertexData vector that will be used for local state data
			animatorSubGeometry.createVertexData(subGeometry.numVertices, this._totalLenOfOneVertex);
			
			//pass the particles data to the animator subGeometry
			animatorSubGeometry.animationParticles = subMesh.animationSubGeometry.animationParticles;
		}
	}

}
