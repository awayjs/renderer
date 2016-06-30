import {AttributesBuffer}					from "@awayjs/core/lib/attributes/AttributesBuffer";
import {Matrix3DUtils}					from "@awayjs/core/lib/geom/Matrix3DUtils";

import {DisplayObjectContainer}			from "@awayjs/display/lib/display/DisplayObjectContainer";
import {Graphics}							from "@awayjs/display/lib/graphics/Graphics";
import {TriangleElements}					from "@awayjs/display/lib/graphics/TriangleElements";
import {Sprite}							from "@awayjs/display/lib/display/Sprite";
import {MaterialBase}						from "@awayjs/display/lib/materials/MaterialBase";
import {AttributesView} from "@awayjs/core/lib/attributes/AttributesView";

/**
 *  Class Merge merges two or more static sprites into one.<code>Merge</code>
 */
export class Merge
{

	//private const LIMIT:uint = 196605;
	private _objectSpace:boolean;
	private _keepMaterial:boolean;
	private _disposeSources:boolean;
	private _graphicVOs:Array<GraphicVO>;
	private _toDispose:Array<Sprite>;

	/**
	 * @param    keepMaterial    [optional]    Determines if the merged object uses the recevier sprite material information or keeps its source material(s). Defaults to false.
	 * If false and receiver object has multiple materials, the last material found in receiver subsprites is applied to the merged subsprite(es).
	 * @param    disposeSources  [optional]    Determines if the sprite and geometry source(s) used for the merging are disposed. Defaults to false.
	 * If true, only receiver geometry and resulting sprite are kept in  memory.
	 * @param    objectSpace     [optional]    Determines if source sprite(es) is/are merged using objectSpace or worldspace. Defaults to false.
	 */
	constructor(keepMaterial:boolean = false, disposeSources:boolean = false, objectSpace:boolean = false)
	{
		this._keepMaterial = keepMaterial;
		this._disposeSources = disposeSources;
		this._objectSpace = objectSpace;
	}

	/**
	 * Determines if the sprite and geometry source(s) used for the merging are disposed. Defaults to false.
	 */
	public set disposeSources(b:boolean)
	{
		this._disposeSources = b;
	}

	public get disposeSources():boolean
	{
		return this._disposeSources;
	}

	/**
	 * Determines if the material source(s) used for the merging are disposed. Defaults to false.
	 */
	public set keepMaterial(b:boolean)
	{
		this._keepMaterial = b;
	}

	public get keepMaterial():boolean
	{
		return this._keepMaterial;
	}

	/**
	 * Determines if source sprite(es) is/are merged using objectSpace or worldspace. Defaults to false.
	 */
	public set objectSpace(b:boolean)
	{
		this._objectSpace = b;
	}

	public get objectSpace():boolean
	{
		return this._objectSpace;
	}

	/**
	 * Merges all the children of a container into a single Sprite. If no Sprite object is found, method returns the receiver without modification.
	 *
	 * @param    receiver           The Sprite to receive the merged contents of the container.
	 * @param    objectContainer    The DisplayObjectContainer holding the sprites to be mergd.
	 *
	 * @return The merged Sprite instance.
	 */
	public applyToContainer(receiver:Sprite, objectContainer:DisplayObjectContainer):void
	{
		this.reset();

		//collect container sprites
		this.parseContainer(receiver, objectContainer);

		//collect receiver
		this.collect(receiver, false);

		//merge to receiver
		this.merge(receiver, this._disposeSources);
	}

	/**
	 * Merges all the sprites found in the Array&lt;Sprite&gt; into a single Sprite.
	 *
	 * @param    receiver    The Sprite to receive the merged contents of the sprites.
	 * @param    sprites      A series of Sprites to be merged with the reciever sprite.
	 */
	public applyToSprites(receiver:Sprite, sprites:Array<Sprite>):void
	{
		this.reset();

		if (!sprites.length)
			return;

		//collect sprites in vector
		for (var i:number = 0; i < sprites.length; i++)
			if (sprites[i] != receiver)
				this.collect(sprites[i], this._disposeSources);

		//collect receiver
		this.collect(receiver, false);

		//merge to receiver
		this.merge(receiver, this._disposeSources);
	}

	/**
	 *  Merges 2 sprites into one. It is recommand to use apply when 2 sprites are to be merged. If more need to be merged, use either applyToSprites or applyToContainer methods.
	 *
	 * @param    receiver    The Sprite to receive the merged contents of both sprites.
	 * @param    sprite        The Sprite to be merged with the receiver sprite
	 */
	public apply(receiver:Sprite, sprite:Sprite):void
	{
		this.reset();

		//collect sprite
		this.collect(sprite, this._disposeSources);

		//collect receiver
		this.collect(receiver, false);

		//merge to receiver
		this.merge(receiver, this._disposeSources);
	}

	private reset():void
	{
		this._toDispose  = new Array<Sprite>();
		this._graphicVOs = new Array<GraphicVO>();
	}

	private merge(destSprite:Sprite, dispose:boolean):void
	{
		var i:number;
		//var oldGraphics:Graphics;
		var destGraphics:Graphics;
		var useSubMaterials:boolean;

		//oldGraphics = destSprite.graphics.clone();
		destGraphics = destSprite.graphics;

		// Only apply materials directly to sub-sprites if necessary,
		// i.e. if there is more than one material available.
		useSubMaterials = (this._graphicVOs.length > 1);

		for (i = 0; i < this._graphicVOs.length; i++) {
			var elements:TriangleElements = new TriangleElements(new AttributesBuffer());
			elements.autoDeriveNormals = false;
			elements.autoDeriveTangents = false;

			var data:GraphicVO = this._graphicVOs[i];
			elements.setIndices(data.indices);
			elements.setPositions(data.vertices);
			elements.setNormals(data.normals);
			elements.setTangents(data.tangents);
			elements.setUVs(data.uvs);

			if (this._keepMaterial && useSubMaterials)
				destGraphics.addGraphic(elements, data.material);
			else
				destGraphics.addGraphic(elements);
		}

		if (this._keepMaterial && !useSubMaterials && this._graphicVOs.length)
			destSprite.material = this._graphicVOs[0].material;

		if (dispose) {
			var len:number = this._toDispose.length;
			for (var i:number; i < len; i++)
				this._toDispose[i].dispose();
		}

		this._toDispose = null;
	}

	private collect(sprite:Sprite, dispose:boolean):void
	{
		var subIdx:number;
		var calc:number;
		for (subIdx = 0; subIdx < sprite.graphics.count; subIdx++) {
			var i:number;
			var len:number;
			var iIdx:number, vIdx:number, nIdx:number, tIdx:number, uIdx:number;
			var indexOffset:number;
			var elements:TriangleElements;
			var vo:GraphicVO;
			var vertices:Array<number>;
			var normals:Array<number>;
			var tangents:Array<number>;
			var ind:Uint16Array;

			elements = <TriangleElements> sprite.graphics.getGraphicAt(subIdx).elements;

			// Get (or create) a VO for this material
			vo = this.getGraphicData(sprite.graphics.getGraphicAt(subIdx).material);

			// Vertices and normals are copied to temporary vectors, to be transformed
			// before concatenated onto those of the data. This is unnecessary if no
			// transformation will be performed, i.e. for object space merging.
			vertices = (this._objectSpace)? vo.vertices : new Array<number>();
			normals = (this._objectSpace)? vo.normals : new Array<number>();
			tangents = (this._objectSpace)? vo.tangents : new Array<number>();

			// Copy over vertex attributes
			vIdx = vertices.length;
			nIdx = normals.length;
			tIdx = tangents.length;
			uIdx = vo.uvs.length;
			
			this.copyAttributes(elements.positions, vertices, elements.numVertices, vIdx);
			this.copyAttributes(elements.normals, normals, elements.numVertices, nIdx);
			this.copyAttributes(elements.tangents, tangents, elements.numVertices, tIdx);
			this.copyAttributes(elements.uvs, vo.uvs, elements.numVertices, uIdx);

			// Copy over triangle indices
			indexOffset = (!this._objectSpace)? vo.vertices.length/3 :0;
			iIdx = vo.indices.length;
			len = elements.numElements;
			ind = elements.indices.get(len);
			for (i = 0; i < len; i++) {
				calc = i*3;
				vo.indices[iIdx++] = ind[calc] + indexOffset;
				vo.indices[iIdx++] = ind[calc + 1] + indexOffset;
				vo.indices[iIdx++] = ind[calc + 2] + indexOffset;
			}

			if (!this._objectSpace) {
				sprite.sceneTransform.transformVectors(vertices, vertices);
				Matrix3DUtils.deltaTransformVectors(sprite.sceneTransform, normals, normals);
				Matrix3DUtils.deltaTransformVectors(sprite.sceneTransform, tangents, tangents);

				// Copy vertex data from temporary (transformed) vectors
				vIdx = vo.vertices.length;
				nIdx = vo.normals.length;
				tIdx = vo.tangents.length;
				len = vertices.length;
				for (i = 0; i < len; i++) {
					vo.vertices[vIdx++] = vertices[i];
					vo.normals[nIdx++] = normals[i];
					vo.tangents[tIdx++] = tangents[i];
				}
			}
		}

		if (dispose)
			this._toDispose.push(sprite);
	}
	
	private copyAttributes(attributes:AttributesView, array:Array<number>, count:number, startIndex:number)
	{
		var vertices:ArrayBufferView = attributes.get(count);
		var dim:number = attributes.dimensions;
		var stride:number = attributes.stride;
		var len:number = count*stride;
		
		for (var i:number = 0; i < len; i += stride)
			for (var j:number = 0; j < dim; j++)
				array[startIndex++] = vertices[i + j];
	}

	private getGraphicData(material:MaterialBase):GraphicVO
	{
		var data:GraphicVO;

		if (this._keepMaterial) {
			var i:number;
			var len:number;

			len = this._graphicVOs.length;
			for (i = 0; i < len; i++) {
				if (this._graphicVOs[i].material == material) {
					data = this._graphicVOs[i];
					break;
				}
			}
		} else if (this._graphicVOs.length) {
			// If materials are not to be kept, all data can be
			// put into a single VO, so return that one.
			data = this._graphicVOs[0];
		}

		// No data (for this material) found, create new.
		if (!data) {
			data = new GraphicVO();
			data.vertices = new Array<number>();
			data.normals = new Array<number>();
			data.tangents = new Array<number>();
			data.uvs = new Array<number>();
			data.indices = new Array<number>();
			data.material = material;

			this._graphicVOs.push(data);
		}

		return data;
	}

	private parseContainer(receiver:Sprite, object:DisplayObjectContainer):void
	{
		var child:DisplayObjectContainer;
		var i:number;

		if (object instanceof Sprite && object != (<DisplayObjectContainer> receiver))
			this.collect(<Sprite> object, this._disposeSources);

		for (i = 0; i < object.numChildren; ++i) {
			child = <DisplayObjectContainer> object.getChildAt(i);
			this.parseContainer(receiver, child);
		}
	}
}

export class GraphicVO
{
	public uvs:Array<number>;
	public vertices:Array<number>;
	public normals:Array<number>;
	public tangents:Array<number>;
	public indices:Array<number>;
	public material:MaterialBase;
}
