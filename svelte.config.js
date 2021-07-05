
import node from '@sveltejs/adapter-node';
import adapter from '@sveltejs/adapter-static';
const config = {
	// параметры для svelte.compile (https://svelte.dev/docs#svelte_compile)
	compilerOptions: null,

	// массив расширений, которые будут считаться компонентами Svelte
	extensions: ['.svelte'],

	kit: {
        adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: null
		}),
		amp: false,
		appDir: '_app',
		files: {
			assets: 'static',
			hooks: 'src/hooks',
			lib: 'src/lib',
			routes: 'src/routes',
			serviceWorker: 'src/service-worker',
			template: 'src/app.html'
		},
		floc: false,
		host: null,
		hostHeader: null,
		hydrate: true,
		paths: {
			assets: '',
			base: ''
		},
		prerender: {
			crawl: true,
			enabled: true,
			force: false,
			pages: ['*']
		},
		router: true,
		ssr: true,
		target: null,
		trailingSlash: 'never',
		package: {
 			dir: 'package',
 			exports: {
 				include: ['**'],
 				exclude: ['_*', '**/_*']
 			},
 			files: {
 				include: ['**'],
 				exclude: []
 			}
 		},
		vite: () => ({})
	},

	// параметры для svelte.preprocess (https://svelte.dev/docs#svelte_preprocess)
	preprocess: null
};

export default config;