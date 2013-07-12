/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../containers/Scene3D.ts" />
///<reference path="../partition/NodeBase.ts" />
///<reference path="../geom/Vector3D.ts" />

module away.traverse
{
	export class PartitionTraverser
	{
		public scene:away.containers.Scene3D;
		
		public _iEntryPoint:away.geom.Vector3D;
		public static _iCollectionMark:number = 0;
		
		constructor()
		{
		}
		
		public enterNode(node:away.partition.NodeBase):boolean
		{
			node = node;
			return true;
		}
		
		/*
		public applySkyBox(renderable:IRenderable)
		{
			throw new AbstractMethodError();
		}
		
		public applyRenderable(renderable:IRenderable)
		{
			throw new AbstractMethodError();
		}
		
		public applyUnknownLight(light:LightBase)
		{
			throw new AbstractMethodError();
		}
		
		public applyDirectionalLight(light:DirectionalLight)
		{
			throw new AbstractMethodError();
		}
		
		public applyPointLight(light:PointLight)
		{
			throw new AbstractMethodError();
		}
		
		public applyLightProbe(light:LightProbe)
		{
			throw new AbstractMethodError();
		}
		
		public applyEntity(entity:Entity)
		{
			throw new AbstractMethodError();
		}
		*/
		
		public get entryPoint():away.geom.Vector3D
		{
			return this._iEntryPoint;
		}
	}
}