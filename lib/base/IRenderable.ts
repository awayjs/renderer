import { IEventDispatcher } from '@awayjs/core';
import { IPartitionEntity } from '@awayjs/view';
import { _Stage_ElementsBase } from './_Stage_ElementsBase';
import { IRenderEntity } from './IRenderEntity';
import { _Render_MaterialBase } from './_Render_MaterialBase';


export interface IRenderable extends IEventDispatcher
{	
	
	materialID:number;

    renderOrderId:number;

    zIndex:number;
	
	next:IRenderable;

	sourceEntity:IRenderEntity;

	renderMaterial:_Render_MaterialBase;
	
	stageElements:_Stage_ElementsBase;

	maskOwners:Array<IPartitionEntity>;

	executeRender(enableDepthAndStencil?:boolean, surfaceSelector?:number, mipmapSelector?:number, maskConfig?:number):void;
}