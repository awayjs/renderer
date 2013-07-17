/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */

///<reference path="../_definitions.ts" />

module away.lights
{
	export class LightBase extends away.entities.Entity
	{
		
		private _color:number = 0xffffff;
		private _colorR:number = 1;
		private _colorG:number = 1;
		private _colorB:number = 1;
		
		private _ambientColor:number = 0xffffff;
		private _ambient:number = 0;
		public _iAmbientR:number = 0;
		public _iAmbientG:number = 0;
		public _iAmbientB:number = 0;
		
		private _specular:number = 1;
		public _iSpecularR:number = 1;
		public _iSpecularG:number = 1;
		public _iSpecularB:number = 1;
		
		private _diffuse:number = 1;
		public _iDiffuseR:number = 1;
		public _iDiffuseG:number = 1;
		public _iDiffuseB:number = 1;
		
		private _castsShadows:boolean;
		
		// TODO private _shadowMapper:ShadowMapperBase;
		
		constructor()
		{
			super();
		}
		
		public get castsShadows():boolean
		{
			return this._castsShadows;
		}
		
		public set castsShadows(value:boolean)
		{
			if( this._castsShadows == value )
			{
				return;
			}
			
			this._castsShadows = value;
			
			throw new away.errors.PartialImplementationError();
			/*
			if( value )
			{
				_shadowMapper ||= createShadowMapper();
				_shadowMapper.light = this;
			} else {
				_shadowMapper.dispose();
				_shadowMapper = null;
			}
			*/
			this.dispatchEvent(new away.events.LightEvent( away.events.LightEvent.CASTS_SHADOW_CHANGE) );
		}
		
		//TODO implement pCreateShadowMapper
		/*
		protected pCreateShadowMapper():ShadowMapperBase
		{
			throw new AbstractMethodError();
		}
		*/
		
		public get specular():number
		{
			return this._specular;
		}
		
		public set specular( value:number )
		{
			if( value < 0 )
			{
				value = 0;
			}
			this._specular = value;
			this.updateSpecular();
		}
		
		public get diffuse():number
		{
			return this._diffuse;
		}
		
		public set diffuse(value:number)
		{
			if (value < 0)
			{
				value = 0;
			}
			this._diffuse = value;
			this.updateDiffuse();
		}
		
		public get color():number
		{
			return this._color;
		}
		
		public set color( value:number )
		{
			this._color = value;
			this._colorR = ((this._color >> 16) & 0xff)/0xff;
			this._colorG = ((this._color >> 8) & 0xff)/0xff;
			this._colorB = (this._color & 0xff)/0xff;
			this.updateDiffuse();
			this.updateSpecular();
		}
		
		public get ambient():number
		{
			return this._ambient;
		}
		
		public set ambient( value:number )
		{
			if( value < 0 )
			{
				value = 0;
			}
			else if( value > 1 )
			{
				value = 1;
			}
			this._ambient = value;
			this.updateAmbient();
		}
		
		public get ambientColor():number
		{
			return this._ambientColor;
		}
		
		public set ambientColor( value:number )
		{
			this._ambientColor = value;
			this.updateAmbient();
		}
		
		private updateAmbient()
		{
			this._iAmbientR = ((this._ambientColor >> 16) & 0xff)/0xff*this._ambient;
			this._iAmbientG = ((this._ambientColor >> 8) & 0xff)/0xff*this._ambient;
			this._iAmbientB = (this._ambientColor & 0xff)/0xff*this._ambient;
		}
		
		public iGetObjectProjectionMatrix( renderable:away.base.IRenderable, target:away.geom.Matrix3D = null ):away.geom.Matrix3D
		{
			throw new away.errors.AbstractMethodError();
		}
		
		//@override
		public pCreateEntityPartitionNode():away.partition.EntityNode
		{
			return new away.partition.LightNode( this );
		}
		
		//@override
		public get assetType():string
		{
			return away.library.AssetType.LIGHT;
		}
		
		private updateSpecular()
		{
			this._iSpecularR = this._colorR*this._specular;
			this._iSpecularG = this._colorG*this._specular;
			this._iSpecularB = this._colorB*this._specular;
		}
		
		private updateDiffuse()
		{
			this._iDiffuseR = this._colorR*this._diffuse;
			this._iDiffuseG = this._colorG*this._diffuse;
			this._iDiffuseB = this._colorB*this._diffuse;
		}
		
		// TODO shadowMapper():ShadowMapperBase
		/*
		public get shadowMapper():ShadowMapperBase
		{
			return this._shadowMapper;
		}
		*/
		
		// TODO shadowMapper(value:ShadowMapperBase)
		/*
		public set shadowMapper(value:ShadowMapperBase)
		{
			this._shadowMapper = value;
			this._shadowMapper.light = this;
		}*/
	}
}