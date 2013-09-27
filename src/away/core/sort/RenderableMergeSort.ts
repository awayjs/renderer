///<reference path="../../_definitions.ts"/>

module away.sort
{
	export class RenderableMergeSort implements away.sort.IEntitySorter
	{
		constructor()
		{
		}
		
		public sort( collector:away.traverse.EntityCollector )
		{
			collector.opaqueRenderableHead = this.mergeSortByMaterial(collector.opaqueRenderableHead);
			collector.blendedRenderableHead = this.mergeSortByDepth(collector.blendedRenderableHead);
		}
		
		private mergeSortByDepth( head:away.data.RenderableListItem ):away.data.RenderableListItem
		{
			var headB:away.data.RenderableListItem;
			var fast:away.data.RenderableListItem;
			var slow:away.data.RenderableListItem;
			
			if( !head || !head.next )
			{
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
			head = this.mergeSortByDepth(head);
			headB = this.mergeSortByDepth(headB);
			
			// merge sublists while respecting order
			var result:away.data.RenderableListItem;
			var curr:away.data.RenderableListItem;
			var l:away.data.RenderableListItem;
			
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
					result = l;
				else
					curr.next = l;
				
				curr = l;
			}
			
			if (head)
				curr.next = head;
			else if (headB)
				curr.next = headB;
			
			return result;
		}
		
		private mergeSortByMaterial( head:away.data.RenderableListItem):away.data.RenderableListItem
		{
			var headB:away.data.RenderableListItem;
			var fast:away.data.RenderableListItem, slow:away.data.RenderableListItem;
			
			if (!head || !head.next)
			{
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
			head = this.mergeSortByMaterial(head);
			headB = this.mergeSortByMaterial(headB);
			
			// merge sublists while respecting order
			var result:away.data.RenderableListItem;
			var curr:away.data.RenderableListItem;
			var l:away.data.RenderableListItem;
			var cmp:number = 0;
			
			if (!head)
				return headB;
			if (!headB)
				return head;
			
			while (head && headB && head != null && headB != null) {
				
				// first sort per render order id (reduces program3D switches),
				// then on material id (reduces setting props),
				// then on zIndex (reduces overdraw)
				var aid:number = head.renderOrderId;
				var bid:number = headB.renderOrderId;
				
				if (aid == bid) {
					var ma:number = head.materialId;
					var mb:number = headB.materialId;
					
					if (ma == mb) {
						if (head.zIndex < headB.zIndex)
							cmp = 1;
						else
							cmp = -1;
					} else if (ma > mb)
						cmp = 1;
					else
						cmp = -1;
				} else if (aid > bid)
					cmp = 1;
				else
					cmp = -1;
				
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
				curr.next = head;
			else if (headB)
				curr.next = headB;
			
			return result;
		}
	}
}