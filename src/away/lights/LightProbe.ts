
///<reference path="../_definitions.ts" />

module away.lights
{
	export class LightProbe extends away.lights.LightBase
	{
		private _diffuseMap:away.textures.CubeTextureBase;
		private _specularMap:away.textures.CubeTextureBase;
		
		constructor( diffuseMap:away.textures.CubeTextureBase, specularMap:away.textures.CubeTextureBase = null)
		{
			super();
			this._diffuseMap = diffuseMap;
			this._specularMap = specularMap;
		}
		
		//@override
		public pCreateEntityPartitionNode():away.partition.EntityNode
		{
			return new away.partition.LightProbeNode( this );
		}
		
		public get diffuseMap():away.textures.CubeTextureBase
		{
			return this._diffuseMap;
		}
		
		public set diffuseMap( value:away.textures.CubeTextureBase )
		{
			this._diffuseMap = value;
		}
		
		public get specularMap():away.textures.CubeTextureBase
		{
			return this._specularMap;
		}
		
		public set specularMap( value:away.textures.CubeTextureBase )
		{
			this._specularMap = value;
		}
		
		//@override
		public pUpdateBounds()
		{
			this._pBoundsInvalid = false;
		}
		
		//@override
		public pGetDefaultBoundingVolume():away.bounds.BoundingVolumeBase
		{
			return new away.bounds.NullBounds();
		}
		
		//@override
		public iGetObjectProjectionMatrix( renderable:away.base.IRenderable, target:away.geom.Matrix3D = null):away.geom.Matrix3D
		{
			// TODO: not used
			renderable = renderable;
			target = target;
			
			throw new away.errors.Error( "Object projection matrices are not supported for LightProbe objects!" );
			return null;
		}
	}
}