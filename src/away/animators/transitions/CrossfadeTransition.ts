///<reference path="../../_definitions.ts"/>

module away.animators
{
	
	export class CrossfadeTransition implements IAnimationTransition
	{
		public blendSpeed:number = 0.5;
		
		constructor(blendSpeed:number)
		{
			this.blendSpeed = blendSpeed;
		}
		
		public getAnimationNode(animator:IAnimator, startNode:AnimationNodeBase, endNode:AnimationNodeBase, startBlend:number /*int*/):AnimationNodeBase
		{
			var crossFadeTransitionNode:CrossfadeTransitionNode = new CrossfadeTransitionNode();
			crossFadeTransitionNode.inputA = startNode;
			crossFadeTransitionNode.inputB = endNode;
			crossFadeTransitionNode.blendSpeed = this.blendSpeed;
			crossFadeTransitionNode.startBlend = startBlend;
			
			return <AnimationNodeBase> crossFadeTransitionNode;
		}
	}
}
