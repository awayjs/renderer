import {ElementsBase}						from "@awayjs/graphics/lib/elements/ElementsBase";
import {TriangleElements}					from "@awayjs/graphics/lib/elements/TriangleElements";
import {Shape}							from "@awayjs/graphics/lib/base/Shape";
import {Graphics}							from "@awayjs/graphics/lib/Graphics";

import {Camera}							from "@awayjs/scene/lib/display/Camera";
import {Sprite}							from "@awayjs/scene/lib/display/Sprite";

import {Stage}							from "@awayjs/stage/lib/base/Stage";

import {AnimatorBase}						from "../animators/AnimatorBase";
import {VertexAnimationSet}				from "../animators/VertexAnimationSet";
import {AnimationRegisterData}			from "../animators/data/AnimationRegisterData";
import {VertexAnimationMode}				from "../animators/data/VertexAnimationMode";
import {IVertexAnimationState}			from "../animators/states/IVertexAnimationState";
import {IAnimationTransition}				from "../animators/transitions/IAnimationTransition";
import {GL_ShapeRenderable}				from "../renderables/GL_ShapeRenderable";
import {GL_RenderableBase}				from "../renderables/GL_RenderableBase";
import {ShaderBase}						from "../shaders/ShaderBase";
import {GL_ElementsBase}					from "../elements/GL_ElementsBase";

/**
 * Provides an interface for assigning vertex-based animation data sets to sprite-based entity objects
 * and controlling the various available states of animation through an interative playhead that can be
 * automatically updated or manually triggered.
 */
export class VertexAnimator extends AnimatorBase
{
	private _vertexAnimationSet:VertexAnimationSet;
	private _poses:Array<Graphics> = new Array<Graphics>();
	private _weights:Float32Array = new Float32Array([1, 0, 0, 0]);
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
	public play(name:string, transition:IAnimationTransition = null, offset:number = NaN):void
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
	public _pUpdateDeltaTime(dt:number):void
	{
		super._pUpdateDeltaTime(dt);

		var geometryFlag:boolean = false;

		if (this._poses[0] != this._activeVertexState.currentGraphics) {
			this._poses[0] = this._activeVertexState.currentGraphics;
			geometryFlag = true;
		}

		if (this._poses[1] != this._activeVertexState.nextGraphics)
			this._poses[1] = this._activeVertexState.nextGraphics;

		this._weights[0] = 1 - (this._weights[1] = this._activeVertexState.blendWeight);

		if (geometryFlag)
			this.invalidateElements();
	}

	/**
	 * @inheritDoc
	 */
	public setRenderState(shader:ShaderBase, renderable:GL_ShapeRenderable, stage:Stage, camera:Camera):void
	{
		// todo: add code for when running on cpu
		// this type of animation can only be Shape
		var shape:Shape = <Shape> renderable.shape;
		var sprite:Sprite = <Sprite> renderable.sourceEntity;
		var elements:ElementsBase = shape.elements;

		// if no poses defined, set temp data
		if (!this._poses.length) {
			this.setNullPose(shader, elements, stage);
			return;
		}

		var animationRegisterData:AnimationRegisterData = shader.animationRegisterData;
		var i:number;
		var len:number = this._vertexAnimationSet.numPoses;

		shader.setVertexConstFromArray(animationRegisterData.weightsIndex, this._weights);

		if (this._vertexAnimationSet.blendMode == VertexAnimationMode.ABSOLUTE)
			i = 1;
		else
			i = 0;

		var elementsGL:GL_ElementsBase;
		var k:number = 0;
		var shapeIndex:number = sprite.graphics.getShapeIndex(shape);

		for (; i < len; ++i) {
			elements = this._poses[i].getShapeAt(shapeIndex).elements || shape.elements;

			elementsGL = <GL_ElementsBase> stage.getAbstraction(elements);
			elementsGL._indexMappings = (<GL_ElementsBase> stage.getAbstraction(shape.elements)).getIndexMappings();

			if (elements.isAsset(TriangleElements)) {
				elementsGL.activateVertexBufferVO(animationRegisterData.poseIndices[k++], (<TriangleElements> elements).positions);

				if (shader.normalDependencies > 0)
					elementsGL.activateVertexBufferVO(animationRegisterData.poseIndices[k++], (<TriangleElements> elements).normals);
			}
		}
	}

	private setNullPose(shader:ShaderBase, elements:ElementsBase, stage:Stage):void
	{
		var animationRegisterData:AnimationRegisterData = shader.animationRegisterData;
		
		shader.setVertexConstFromArray(animationRegisterData.weightsIndex, this._weights);

		var elementsGL:GL_ElementsBase = (<GL_ElementsBase> stage.getAbstraction(elements));
		var k:number = 0;
		
		if (this._vertexAnimationSet.blendMode == VertexAnimationMode.ABSOLUTE) {
			var len:number = this._vertexAnimationSet.numPoses;
			for (var i:number = 1; i < len; ++i) {
				if (elements.isAsset(TriangleElements)) {
					elementsGL.activateVertexBufferVO(animationRegisterData.poseIndices[k++], (<TriangleElements> elements).positions);

					if (shader.normalDependencies > 0)
						elementsGL.activateVertexBufferVO(animationRegisterData.poseIndices[k++], (<TriangleElements> elements).normals);
				}
			}
		}
		// todo: set temp data for additive?
	}

	/**
	 * Verifies if the animation will be used on cpu. Needs to be true for all passes for a material to be able to use it on gpu.
	 * Needs to be called if gpu code is potentially required.
	 */
	public testGPUCompatibility(shader:ShaderBase):void
	{
	}

	public getRenderableElements(renderable:GL_ShapeRenderable, sourceElements:TriangleElements):TriangleElements
	{
		if (this._vertexAnimationSet.blendMode == VertexAnimationMode.ABSOLUTE && this._poses.length)
			return <TriangleElements> this._poses[0].getShapeAt((<Sprite> renderable.sourceEntity).graphics.getShapeIndex(renderable.shape)).elements || sourceElements;

		//nothing to do here
		return sourceElements;
	}
}