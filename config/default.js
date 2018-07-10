'use strict';

/*!
 * V4Fire Client Core
 * https://github.com/V4Fire/Client
 *
 * Released under the MIT license
 * https://github.com/V4Fire/Client/blob/master/LICENSE
 */

const
	config = require('@v4fire/core/config/default'),
	o = require('uniconf/options').option;

module.exports = config.createConfig({dirs: [__dirname, 'client']}, {
	__proto__: config,

	build: {
		entries: o('entries', {
			env: true,
			short: 'e',
			coerce: (v) => v ? v.split(',') : []
		}),

		fast() {
			const v = o('fast-build', {
				env: true,
				type: 'boolean'
			});

			return v != null ? v : isProd;
		},

		buildGraphFromCache: o('build-graph-from-cache', {
			env: true,
			type: 'boolean'
		})
	},

	webpack: {
		externals: {
			'collection.js': '$C',
			'eventemitter2': 'EventEmitter2',
			'localforage': 'localforage',
			'sugar': 'Sugar',
			'vue': 'Vue',
			'chart.js': 'Chart',
			'ion-sound': 'ion',
			'socket.io-client': 'io',
			'setimmediate': 'setImmediate'
		},

		fatHTML: false,
		devtool: false,

		longCache() {
			return o('long-cache', {
				default: !isProd,
				type: 'boolean'
			});
		},

		cacheDir() {
			return '[confighash]';
		},

		hashLength() {
			return !isProd || this.fatHTML ? false : 15;
		},

		dataURILimit() {
			return this.fatHTML ? false : 4096;
		},

		dllOutput(params) {
			return this.output(params);
		},

		output(params) {
			const
				res = !isProd || this.fatHTML ? '[name]' : '[hash]_[name]';

			if (params) {
				return res.replace(/\[(.*?)]/g, (str, key) => {
					if (params[key] != null) {
						return params[key];
					}

					return '';
				});
			}

			return res;
		},

		assetsJSON() {
			return 'assets.json';
		}
	},

	imageOpts: {
		mozjpeg: {
			progressive: true,
			quality: 65
		},

		optipng: {
			enabled: false,
		},

		pngquant: {
			quality: '65-90',
			speed: 4
		},

		gifsicle: {
			interlaced: false,
		},

		webp: {
			quality: 75
		},

		svgo: {

		}
	},

	html: {
		useShortDoctype: true,
		conservativeCollapse: true,
		removeAttributeQuotes: true,
		removeComments: isProd,
		collapseWhitespace: isProd
	},

	postcss: {

	},

	autoprefixer: {

	},

	uglify: {

	},

	monic() {
		return {
			stylus: {
				flags: {
					'+:*': true
				}
			}
		};
	},

	favicons() {
		return {
			appName: this.appName,
			path: this.src.assets('favicons'),
			background: '#FFF',
			display: 'standalone',
			orientation: 'portrait',
			version: 1.0,
			logging: false
		};
	},

	snakeskin() {
		const snakeskinVars = include('build/snakeskin.vars.js');

		const {
			webpack,
			src
		} = this;

		return {
			client: this.extend(super.snakeskin(), {
				adapter: 'ss2vue',
				adapterOptions: {transpiler: true},
				tagFilter: 'tagFilter',
				tagNameFilter: 'tagNameFilter',
				bemFilter: 'bemFilter',
				vars: snakeskinVars
			}),

			server: this.extend(super.snakeskin(), {
				vars: {
					...snakeskinVars,
					fatHTML: webpack.fatHTML,
					hashLength: webpack.hashLength(),
					root: src.cwd(),
					outputPattern: webpack.output,
					output: src.clientOutput(),
					favicons: this.favicons().path,
					assets: src.assets(),
					lib: src.lib()
				}
			})
		};
	},

	typescript() {
		return {
			client: super.typescript(),
			worker: super.typescript(),
			server: super.typescript()
		};
	},

	css() {
		return {
			minimize: Boolean(isProd || Number(process.env.MINIFY_CSS))
		};
	},

	stylus() {
		return {
			preferPathResolver: 'webpack'
		};
	},

	typograf() {
		return {
			locale: this.lang
		};
	},
});
