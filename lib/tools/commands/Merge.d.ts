import { DisplayObjectContainer } from "@awayjs/display/lib/display/DisplayObjectContainer";
import { Sprite } from "@awayjs/display/lib/display/Sprite";
import { MaterialBase } from "@awayjs/display/lib/materials/MaterialBase";
/**
 *  Class Merge merges two or more static sprites into one.<code>Merge</code>
 */
export declare class Merge {
    private _objectSpace;
    private _keepMaterial;
    private _disposeSources;
    private _graphicVOs;
    private _toDispose;
    /**
     * @param    keepMaterial    [optional]    Determines if the merged object uses the recevier sprite material information or keeps its source material(s). Defaults to false.
     * If false and receiver object has multiple materials, the last material found in receiver subsprites is applied to the merged subsprite(es).
     * @param    disposeSources  [optional]    Determines if the sprite and geometry source(s) used for the merging are disposed. Defaults to false.
     * If true, only receiver geometry and resulting sprite are kept in  memory.
     * @param    objectSpace     [optional]    Determines if source sprite(es) is/are merged using objectSpace or worldspace. Defaults to false.
     */
    constructor(keepMaterial?: boolean, disposeSources?: boolean, objectSpace?: boolean);
    /**
     * Determines if the sprite and geometry source(s) used for the merging are disposed. Defaults to false.
     */
    disposeSources: boolean;
    /**
     * Determines if the material source(s) used for the merging are disposed. Defaults to false.
     */
    keepMaterial: boolean;
    /**
     * Determines if source sprite(es) is/are merged using objectSpace or worldspace. Defaults to false.
     */
    objectSpace: boolean;
    /**
     * Merges all the children of a container into a single Sprite. If no Sprite object is found, method returns the receiver without modification.
     *
     * @param    receiver           The Sprite to receive the merged contents of the container.
     * @param    objectContainer    The DisplayObjectContainer holding the sprites to be mergd.
     *
     * @return The merged Sprite instance.
     */
    applyToContainer(receiver: Sprite, objectContainer: DisplayObjectContainer): void;
    /**
     * Merges all the sprites found in the Array&lt;Sprite&gt; into a single Sprite.
     *
     * @param    receiver    The Sprite to receive the merged contents of the sprites.
     * @param    sprites      A series of Sprites to be merged with the reciever sprite.
     */
    applyToSprites(receiver: Sprite, sprites: Array<Sprite>): void;
    /**
     *  Merges 2 sprites into one. It is recommand to use apply when 2 sprites are to be merged. If more need to be merged, use either applyToSprites or applyToContainer methods.
     *
     * @param    receiver    The Sprite to receive the merged contents of both sprites.
     * @param    sprite        The Sprite to be merged with the receiver sprite
     */
    apply(receiver: Sprite, sprite: Sprite): void;
    private reset();
    private merge(destSprite, dispose);
    private collect(sprite, dispose);
    private copyAttributes(attributes, array, count, startIndex);
    private getGraphicData(material);
    private parseContainer(receiver, object);
}
export declare class GraphicVO {
    uvs: Array<number>;
    vertices: Array<number>;
    normals: Array<number>;
    tangents: Array<number>;
    indices: Array<number>;
    material: MaterialBase;
}
