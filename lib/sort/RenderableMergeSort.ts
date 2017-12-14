import {_Render_RenderableBase} from "../base/_Render_RenderableBase";

import {IEntitySorter} from "./IEntitySorter";

/**
 * @class away.sort.RenderableMergeSort
 */
export class RenderableMergeSort implements IEntitySorter
{
	public sortBlendedRenderables(head:_Render_RenderableBase):_Render_RenderableBase
	{
		var headB:_Render_RenderableBase;
		var fast:_Render_RenderableBase;
		var slow:_Render_RenderableBase;

		if (!head || !head.next) {
			return head;
		}

		// split in two sublists
		slow = head;
		fast = head.next;

		while (fast) {
			fast = fast.next;
			if (fast) {
				slow = slow.next;
				fast = fast.next;
			}
		}

		headB = slow.next;
		slow.next = null;

		// recurse
		head = this.sortBlendedRenderables(head);
		headB = this.sortBlendedRenderables(headB);

		// merge sublists while respecting order
		var result:_Render_RenderableBase;
		var curr:_Render_RenderableBase;
		var l:_Render_RenderableBase;

		if (!head)
			return headB;
		if (!headB)
			return head;

		while (head && headB) {
			if (head.zIndex < headB.zIndex) {
				l = head;
				head = head.next;
			} else {
				l = headB;
				headB = headB.next;
			}

			if (!result)
				result = l; else
				curr.next = l;

			curr = l;
		}

		if (head)
			curr.next = head; else if (headB)
			curr.next = headB;

		return result;
	}

	public sortOpaqueRenderables(head:_Render_RenderableBase):_Render_RenderableBase
	{
		var headB:_Render_RenderableBase;
		var fast:_Render_RenderableBase, slow:_Render_RenderableBase;

		if (!head || !head.next) {
			return head;
		}

		// split in two sublists
		slow = head;
		fast = head.next;

		while (fast) {
			fast = fast.next;
			if (fast) {
				slow = slow.next;
				fast = fast.next;
			}
		}

		headB = slow.next;
		slow.next = null;

		// recurse
		head = this.sortOpaqueRenderables(head);
		headB = this.sortOpaqueRenderables(headB);

		// merge sublists while respecting order
		var result:_Render_RenderableBase;
		var curr:_Render_RenderableBase;
		var l:_Render_RenderableBase;
		var cmp:number = 0;

		if (!head)
			return headB;
		if (!headB)
			return head;

		while (head && headB && head != null && headB != null) {

			// first sort per render order id (reduces program3D switches),
			// then on render object id (reduces setting props),
			// then on zIndex (reduces overdraw)
			var aid:number = head.renderOrderId;
			var bid:number = headB.renderOrderId;

			if (aid == bid) {
				var ma:number = head.materialID;
				var mb:number = headB.materialID;

				if (ma == mb) {
					if (head.zIndex < headB.zIndex)
						cmp = 1; else
						cmp = -1;
				} else if (ma > mb) {
					cmp = 1;
				} else {
					cmp = -1;
				}
			} else if (aid > bid) {
				cmp = 1;
			} else {
				cmp = -1;
			}

			if (cmp < 0) {
				l = head;
				head = head.next;
			} else {
				l = headB;
				headB = headB.next;
			}

			if (!result) {
				result = l;
				curr = l;
			} else {
				curr.next = l;
				curr = l;
			}
		}

		if (head)
			curr.next = head; else if (headB)
			curr.next = headB;

		return result;
	}
}