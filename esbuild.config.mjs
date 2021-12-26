import * as esbuild from "esbuild";
import process from "process";
import builtins from 'builtin-modules';
import vuePlugin from 'esbuild-plugin-vue3';
import svgPlugin from 'esbuild-plugin-svg';
import fs from 'fs';


const banner =
	`/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the GitHub repository of this plugin
at https://github.com/curtgrimes/obsidian-metronome-plugin
*/
`;

const prod = (process.argv[2] === 'production');

// Obsidian requires that the style file is called styles.css
const renameCSSFile = () => fs.rename('main.css', 'styles.css', () => { });

try {
	await esbuild.build({
		banner: {
			js: banner,
		},
		entryPoints: ['src/main.ts'],
		bundle: true,
		external: ['obsidian', 'electron', ...builtins],
		plugins: [vuePlugin(), svgPlugin()],
		format: 'cjs',
		target: 'es2016',
		logLevel: "info",
		sourcemap: prod ? false : 'inline',
		treeShaking: true,
		outfile: 'main.js',
		minify: prod,
		watch: prod ? false : {
			onRebuild: renameCSSFile
		},
	});


	renameCSSFile();
}
catch (e) {
	console.error(e);
	process.exit(1)
}