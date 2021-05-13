import { ContainerNode } from '@awayjs/view';

export interface IMaskData {
	node: ContainerNode;
	bitMask: ui32;
}

export class RenderState {
	public maskStack: IMaskData[] = [];
	public maskConfig: ui32 = 0;
	public masksCount: number = 0;

	public extend(
		maskConfig: number = this.maskConfig,
		masksCount: number = this.masksCount,
	): RenderState {
		const state = new RenderState();

		state.maskConfig = maskConfig;
		state.masksCount = masksCount;

		state.maskStack = this.maskStack;

		return state;

	}
}
