import { IEntitySorter } from "../sort/IEntitySorter";
import { GL_RenderableBase } from "../renderables/GL_RenderableBase";
/**
 * @class away.sort.RenderableMergeSort
 */
export declare class RenderableMergeSort implements IEntitySorter {
    sortBlendedRenderables(head: GL_RenderableBase): GL_RenderableBase;
    sortOpaqueRenderables(head: GL_RenderableBase): GL_RenderableBase;
}
