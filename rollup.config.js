import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
	input: './dist/index.js',
	output: {
		name: 'AwayjsRenderer',
		globals: {
			'@awayjs/core': 'AwayjsCore',
			'@awayjs/stage': 'AwayjsStage',
			'@awayjs/view': 'AwayjsView'
		},
		sourcemap: true,
		format: 'umd',
		file: './bundle/awayjs-renderer.umd.js'
	},
	external: [
		'@awayjs/core',
		'@awayjs/stage',
		'@awayjs/view'
	],
	plugins: [
		nodeResolve(),
		commonjs(),
		terser(),
	]
};