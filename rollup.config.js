var includePaths = require('rollup-plugin-includepaths');

module.exports = {
	entry: './dist/index.js',
	sourceMap: true,
	format: 'umd',
	moduleName: 'AwayjsRenderer',
	external: [
		'@awayjs/core',
		'@awayjs/graphics',
		'@awayjs/scene',
		'@awayjs/stage',
		'@awayjs/view'
	],
	globals: {
		'@awayjs/core': 'AwayjsCore',
		'@awayjs/graphics': 'AwayjsGraphics',
		'@awayjs/scene': 'AwayjsScene',
		'@awayjs/stage': 'AwayjsStage',
		'@awayjs/view': 'AwayjsView',
	},
	targets: [
		{ dest: './bundle/awayjs-renderer.umd.js'}
	],
	plugins: [
		includePaths({
			include : {
				"tslib": "./node_modules/tslib/tslib.es6.js"
			}
		}) ]
};