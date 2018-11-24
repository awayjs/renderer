import {Vector3D, AbstractionBase, Plane3D} from "@awayjs/core";

import {IEntity} from "../base/IEntity";
import {PartitionBase} from "../partition/PartitionBase";
import {ITraverser} from "../partition/ITraverser";
import {INode} from "../partition/INode";

import {PickingCollision} from "./PickingCollision";
import { PickEntity } from '../base/PickEntity';
import { PickGroup } from '../PickGroup';

/**
 * Picks a 3d object from a view or scene by 3D raycast calculations.
 * Performs an initial coarse boundary calculation to return a subset of entities whose bounding volumes intersect with the specified ray,
 * then triggers an optional picking collider on individual renderable objects to further determine the precise values of the picking ray collision.
 *
 * @class away.pick.RaycastPicker
 */
export class TabPicker extends AbstractionBase implements ITraverser
{
	protected _partition:PartitionBase;
	protected _entity:IEntity;

	public get partition():PartitionBase
	{
		return this._partition;
	}

    /**
     *
     * @returns {IEntity}
     */
    public get entity():IEntity
    {
        return this._entity;
	}
	
	private _pickGroup:PickGroup;

	private _tabEntities:IEntity[] = [];
	private _customTabEntities:IEntity[][] = [];
	private _customTabEntitiesSorted:IEntity[] = [];

	/**
	 * Creates a new <code>RaycastPicker</code> object.
	 *
	 * @param findClosestCollision Determines whether the picker searches for the closest bounds collision along the ray,
	 * or simply returns the first collision encountered. Defaults to false.
	 */
	constructor(partition:PartitionBase, pickGroup:PickGroup)
	{
		super(partition, pickGroup);
		
		this._partition = partition;
		this._entity = partition.root;
		this._pickGroup = pickGroup;
	}

	private sortTabEnabledEntities():void
	{
		if(this._customTabEntities.length<=0 && this._tabEntities.length<=0)
            return;
        
        var snapGridY:number=10;
        var len:number=0;
        var len2:number=0;
        var orderedOnY:IEntity[][]=[];
        var i:number=0;
        var e:number=0;
		if(this._customTabEntities.length>0){
            snapGridY=10;
            // for custom tabs, we need to sort them in cases where multiple enities have the same tabIndex
            var t:number=0;
            var t_len=this._customTabEntities.length;
            this._customTabEntitiesSorted=[];
            for(t=0; t<t_len; t++){
                if(this._customTabEntities[t] && this._customTabEntities[t].length==1 && this._customTabEntities[t][0]){
                    this._customTabEntitiesSorted.push(this._customTabEntities[t][0]);
                }
                else if(this._customTabEntities[t] && this._customTabEntities[t].length>1){
                    len=this._customTabEntities[t].length;
                    for(i=0; i<len; i++){
                        var enabledEntitiy=this._customTabEntities[t][i];
                        var ySnappedToGrid=Math.round(enabledEntitiy.scenePosition.y/snapGridY);
                        if(orderedOnY.length<=ySnappedToGrid){
                            orderedOnY.length=ySnappedToGrid+1;
                        }
                        if(!orderedOnY[ySnappedToGrid])
                            orderedOnY[ySnappedToGrid]=[];
                        orderedOnY[ySnappedToGrid].push(enabledEntitiy);
                    }
                    for(i=0; i<orderedOnY.length; i++){
                        var entityRow=orderedOnY[i];
                        if(entityRow){
                            entityRow.sort(function(a, b){
                                return a.scenePosition.x>b.scenePosition.x?1:0;
                            })
                            for(e=0; e<entityRow.length; e++){
                                this._customTabEntitiesSorted.push(entityRow[e]);
                            }
                        }
                    }                    
                }            
            }
            return;
        }
        
        //  first sort into rows based on global y-position, snapping y-positions to a grid 
        //  than sort the rows by global x-position
        len=this._tabEntities.length;
        for(i=0; i<len; i++){
            var enabledEntitiy=this._tabEntities[i];
            var ySnappedToGrid=Math.round(enabledEntitiy.scenePosition.y/snapGridY);
            if(orderedOnY.length<=ySnappedToGrid){
                orderedOnY.length=ySnappedToGrid+1;
            }
            if(!orderedOnY[ySnappedToGrid])
                orderedOnY[ySnappedToGrid]=[];
            orderedOnY[ySnappedToGrid].push(enabledEntitiy);
        }
        
        this._tabEntities.length=0;
        i=orderedOnY.length;
        while(i>0){
            i--;
            var entityRow=orderedOnY[i];
            if(entityRow){
                entityRow.sort(function(a, b){
                    return a.scenePosition.x>b.scenePosition.x?1:0;
                })
                e=entityRow.length;
                while(e>0){
                    e--;
                    this._tabEntities[this._tabEntities.length]=entityRow[e];
                }
            }
        }


	}
	public traverse():void
	{
		this._tabEntities.length = 0;
        this._customTabEntities.length = 0;
        this._customTabEntitiesSorted.length=0;
        this._partition.traverse(this);

        this.sortTabEnabledEntities();
		this._invalid = false;
	}

	public getTraverser(partition:PartitionBase):ITraverser
	{
		return this;
	}
	
	
	public getNextTabEntity(currentFocus:IEntity):IEntity
	{
		if (this._invalid)
			this.traverse();

		if(this._customTabEntitiesSorted.length<=0 && this._tabEntities.length<=0)
			return currentFocus;

		if(this._customTabEntitiesSorted.length>0){
            var newTabIndex:number=-1;
			var i:number=0;
			if(currentFocus){
                while(i<this._customTabEntitiesSorted.length){
                    if(this._customTabEntitiesSorted[i]==currentFocus){                        
                        newTabIndex=i;
                        break;
                    }
                    i++;
                }
            }
            newTabIndex++;
			i=newTabIndex;
			while(i<this._customTabEntitiesSorted.length){
				if(this._customTabEntitiesSorted[i]){
					return this._customTabEntitiesSorted[i];
				}
				i++;
            }
            for(i=0; i<newTabIndex; i++){
				if(this._customTabEntitiesSorted[i]){
					return this._customTabEntitiesSorted[i];
				}
            }
			return currentFocus;
		}
		if(currentFocus){
			var len:number=this._tabEntities.length;
			for(var i:number=0; i<len; i++){
				if(this._tabEntities[i]==currentFocus){
					if(i==0){
						return this._tabEntities[len-1];
					}
					return this._tabEntities[i-1];						
				}
			}
		}
		// this point we would already have exit out if tabEntities.length was 0
		return this._tabEntities[0];	

	}

	public getPrevTabEntity(currentFocus:IEntity):IEntity
	{
		if (this._invalid)
			this.traverse();

		if(this._customTabEntities.length<=0 && this._tabEntities.length<=0)
			return currentFocus;

		if(this._customTabEntities.length>0){
            var newTabIndex:number=-1;
			var i:number=0;
			if(currentFocus){
                while(i<this._customTabEntitiesSorted.length){
                    if(this._customTabEntitiesSorted[i]==currentFocus){                        
                        newTabIndex=i;
                        break;
                    }
                    i++;
                }
            }
            newTabIndex++;
			i=newTabIndex;
			while(i<this._customTabEntitiesSorted.length){
				if(this._customTabEntitiesSorted[i]){
					return this._customTabEntitiesSorted[i];
				}
				i++;
			}
			return currentFocus;
		}
		if(currentFocus){
			var len:number=this._tabEntities.length;
			for(var i:number=0; i<len; i++){
				if(this._tabEntities[i]==currentFocus){
					if(i==len-1){
						return this._tabEntities[0];
					}
					return this._tabEntities[i+1];						
				}
			}
		}
		// this point we would already have exit out if tabEntities.length was 0
		return this._tabEntities[0];	

	}

	/**
	 * Returns true if the current node is at least partly in the frustum. If so, the partition node knows to pass on the traverser to its children.
	 *
	 * @param node The Partition3DNode object to frustum-test.
	 */
	public enterNode(node:INode):boolean
	{
		if (!node.isVisible())
			return false;
		return true;
	}

	public dispose():void
	{
		//TODO
	}

	/**
	 *
	 * @param entity
	 */
	public applyEntity(entity:IEntity):void
	{
		if (entity.tabEnabled) {
			if(entity.assetType != "[asset TextField]" || (<any> entity).type == "input"){
				// add the entity to the correct tab list.
				if(entity.tabIndex >= 0){
					if(this._customTabEntities.length < entity.tabIndex)
                        this._customTabEntities.length = entity.tabIndex;
                    if(!this._customTabEntities[entity.tabIndex]){
                        this._customTabEntities[entity.tabIndex]=[];
                    }
					this._customTabEntities[entity.tabIndex].push(entity);
				}
				else{
					this._tabEntities[this._tabEntities.length] = entity;
				}
	
			}
		}
	}
}