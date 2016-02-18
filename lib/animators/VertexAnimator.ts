import Graphics							= require("awayjs-display/lib/graphics/Graphics");
import ElementsBase						= require("awayjs-display/lib/graphics/ElementsBase"	);
import TriangleElements					= require("awayjs-display/lib/graphics/TriangleElements");
import Graphic							= require("awayjs-display/lib/graphics/Graphic");
import Camera							= require("awayjs-display/lib/entities/Camera");
import Mesh								= require("awayjs-display/lib/entities/Mesh");

import Stage							= require("awayjs-stagegl/lib/base/Stage");
import ContextGLProgramType				= require("awayjs-stagegl/lib/base/ContextGLProgramType");

import AnimatorBase						= require("awayjs-renderergl/lib/animators/AnimatorBase");
import VertexAnimationSet				= require("awayjs-renderergl/lib/animators/VertexAnimationSet");
import VertexAnimationMode				= require("awayjs-renderergl/lib/animators/data/VertexAnimationMode");
import IVertexAnimationState			= require("awayjs-renderergl/lib/animators/states/IVertexAnimationState");
import IAnimationTransition				= require("awayjs-renderergl/lib/animators/transitions/IAnimationTransition");
import GraphicRenderable				= require("awayjs-renderergl/lib/renderables/GraphicRenderable");
import RenderableBase					= require("awayjs-renderergl/lib/renderables/RenderableBase");
import ShaderBase						= require("awayjs-renderergl/lib/shaders/ShaderBase");
import GL_ElementsBase					= require("awayjs-renderergl/lib/elements/GL_ElementsBase");

/**
 * Provides an interface for assigning vertex-based animation data sets to mesh-based entity objects
 * and controlling the various available states of animation through an interative playhead that can be
 * automatically updated or manually triggered.
 */
class VertexAnimator extends AnimatorBase
{
	private _vertexAnimationSet:VertexAnimationSet;
	private _poses:Array<Graphics> = new Array<Graphics>();
	private _weights:Float32Array = new Float32Array([1, 0, 0, 0]);
	private _numPoses:number /*uint*/;
	private _blendMode:string;
	private _activeVertexState:IVertexAnimationState;

	/**
	 * Creates a new <code>VertexAnimator</code> object.
	 *
	 * @param vertexAnimationSet The animation data set containing the vertex animations used by the animator.
	 */
	constructor(vertexAnimationSet:VertexAnimationSet)
	{
		super(vertexAnimationSet);

		this._vertexAnimationSet = vertexAnimationSet;
		this._numPoses = vertexAnimationSet.numPoses;
		this._blendMode = vertexAnimationSet.blendMode;
	}

	/**
	 * @inheritDoc
	 */
	public clone():AnimatorBase
	{
		return new VertexAnimator(this._vertexAnimationSet);
	}

	/**
	 * Plays a sequence with a given name. If the sequence is not found, it may not be loaded yet, and it will retry every frame.
	 * @param sequenceName The name of the clip to be played.
	 */
	public play(name:string, transition:IAnimationTransition = null, offset:number = NaN)
	{
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

		this._activeVertexState = <IVertexAnimationState> this._pActiveState;

		this.start();

		//apply a time offset if specified
		if (!isNaN(offset))
			this.reset(name, offset);
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateDeltaTime(dt:number)
	{
		super._pUpdateDeltaTime(dt);

		var geometryFlag:boolean = false;

		if (this._poses[0] != this._activeVertexState.currentGraphics) {
			this._poses[0] = this._activeVertexState.currentGraphics;
			geometryFlag = true;
		}

		if (this._poses[1] != this._activeVertexState.nextGraphics) {
			this._poses[1] = this._activeVertexState.nextGraphics;
			geometryFlag = true;
		}

		this._weights[0] = 1 - (this._weights[1] = this._activeVertexState.blendWeight);

		if (geometryFlag) {
			//invalidate meshes
			var mesh:Mesh;
			var len:number = this._pOwners.length;
			for (var i:number = 0; i < len; i++) {
				mesh = this._pOwners[i];
				mesh.graphics.invalidateElements();
			}
		}
	}

	/**
	 * @inheritDoc
	 */
	public setRenderState(shader:ShaderBase, renderable:RenderableBase, stage:Stage, camera:Camera, vertexConstantOffset:number /*int*/, vertexStreamOffset:number /*int*/)
	{
		// todo: add code for when running on cpu
		// this type of animation can only be SubMesh
		var graphic:Graphic = <Graphic> (<GraphicRenderable> renderable).graphic;
		var elements:ElementsBase = graphic.elements;

		// if no poses defined, set temp data
		if (!this._poses.length) {
			this.setNullPose(shader, elements, stage, vertexConstantOffset, vertexStreamOffset);
			return;
		}


		var i:number /*uint*/;
		var len:number /*uint*/ = this._numPoses;

		stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, vertexConstantOffset, this._weights, 1);

		if (this._blendMode == VertexAnimationMode.ABSOLUTE)
			i = 1;
		else
			i = 0;

		var elementsGL:GL_ElementsBase;

		for (; i < len; ++i) {
			elements = this._poses[i].getGraphicAt(graphic._iIndex).elements || graphic.elements;

			elementsGL = shader._elementsPool.getAbstraction(elements);
			elementsGL._indexMappings = shader._elementsPool.getAbstraction(graphic.elements).getIndexMappings();

			if (elements.isAsset(TriangleElements)) {
				elementsGL.activateVertexBufferVO(vertexStreamOffset++, (<TriangleElements> elements).positions);

				if (shader.normalDependencies > 0)
					elementsGL.activateVertexBufferVO(vertexStreamOffset++, (<TriangleElements> elements).normals);
			}
		}
	}

	private setNullPose(shader:ShaderBase, elements:ElementsBase, stage:Stage, vertexConstantOffset:number /*int*/, vertexStreamOffset:number /*int*/)
	{
		stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, vertexConstantOffset, this._weights, 1);

		var elementsGL:GL_ElementsBase = shader._elementsPool.getAbstraction(elements);

		if (this._blendMode == VertexAnimationMode.ABSOLUTE) {
			var len:number /*uint*/ = this._numPoses;
			for (var i:number /*uint*/ = 1; i < len; ++i) {
				if (elements.isAsset(TriangleElements)) {
					elementsGL.activateVertexBufferVO(vertexStreamOffset++, (<TriangleElements> elements).positions);

					if (shader.normalDependencies > 0)
						elementsGL.activateVertexBufferVO(vertexStreamOffset++, (<TriangleElements> elements).normals);
				}
			}
		}
		// todo: set temp data for additive?
	}

	/**
	 * Verifies if the animation will be used on cpu. Needs to be true for all passes for a material to be able to use it on gpu.
	 * Needs to be called if gpu code is potentially required.
	 */
	public testGPUCompatibility(shader:ShaderBase)
	{
	}

	public getRenderableElements(renderable:GraphicRenderable, sourceElements:TriangleElements):TriangleElements
	{
		if (this._blendMode == VertexAnimationMode.ABSOLUTE && this._poses.length)
			return <TriangleElements> this._poses[0].getGraphicAt(renderable.graphic._iIndex).elements || sourceElements;

		//nothing to do here
		return sourceElements;
	}
}

export = VertexAnimator;