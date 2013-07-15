/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../entities/Entity.ts" />
///<reference path="../errors/AbstractMethodError.ts" />
///<reference path="../containers/Scene3D.ts" />
///<reference path="../partition/NodeBase.ts" />
///<reference path="../geom/Vector3D.ts" />
///<reference path="../base/IRenderable.ts" />

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
		
		public applySkyBox( renderable:away.base.IRenderable )
		{
			throw new away.errors.AbstractMethodError();
		}
		
		public applyRenderable( renderable:away.base.IRenderable )
		{
			throw new away.errors.AbstractMethodError();
		}
		
		/*
		public applyUnknownLight(light:LightBase)
		{
			throw new away.errors.AbstractMethodError();
		}
		
		public applyDirectionalLight(light:DirectionalLight)
		{
			throw new away.errors.AbstractMethodError();
		}
		
		public applyPointLight(light:PointLight)
		{
			throw new away.errors.AbstractMethodError();
		}
		
		public applyLightProbe(light:LightProbe)
		{
			throw new away.errors.AbstractMethodError();
		}
		*/
		public applyEntity(entity:away.entities.Entity)
		{
			throw new away.errors.AbstractMethodError();
		}
		
		public get entryPoint():away.geom.Vector3D
		{
			return this._iEntryPoint;
		}
	}
}