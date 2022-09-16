import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from 'vite-imagetools';

/** @type {import('vite').UserConfig} */
const config = {
	define: {
		'process.env.VITE_BUILD_TIME': JSON.stringify(new Date().toISOString()),
	},
	plugins: [imagetools(), sveltekit()],
	server: {
		port: 3000,
		strictPort: false,
	},
	preview: {
		port: 4173,
		strictPort: false,
	},
};

export default config;
