import { IAbstractionPool } from '@awayjs/core';
import { ProgramData, Stage } from '@awayjs/stage';
import { View } from '@awayjs/view';
import { ISimplePass } from './IPass';
import { _Render_MaterialBase } from './_Render_MaterialBase';
import { _Render_RenderableBase } from './_Render_RenderableBase';
import { _Stage_ElementsBase } from './_Stage_ElementsBase';

export interface IShaderBase extends IAbstractionPool {
	view: View;

	stage: Stage;

	pass: ISimplePass;

	renderMaterial: _Render_MaterialBase;

	programData: ProgramData;

	activeElements: _Stage_ElementsBase;

	writeDepth: boolean;

	usesPremultipliedAlpha: boolean;

	useBothSides: boolean;

	usesUVTransform: boolean;

	usesColorTransform: boolean;

	alphaThreshold: number;

	numUsedTextures: number;

	numUsedStreams: number;

	reset(): void;

	dispose(): void;

	setBlendMode(mode: string): void;

	_activate(): void;

	_deactivate(): void;

	_setRenderState(renderState: _Render_RenderableBase): void;
}