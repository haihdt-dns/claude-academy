import * as esbuild from 'esbuild';
import process from 'node:process';

import { rimrafSync } from 'rimraf';
import paths from '../paths.cjs';
import colors from './colors.cjs';
import collectEntries from './entries.cjs';

rimrafSync(`${paths.appBuild}/${paths.subDirectory}${paths.assetPath}/js`);

const rootPath = '/';

const ctx = await esbuild.context({
  bundle: true,
  entryNames: '[name]',
  entryPoints: collectEntries(),
  format: 'esm',
  legalComments: 'eof',
  minify: true,
  outdir: `${paths.appBuild}/${paths.assetPath}/js`,
  platform: 'browser',
  publicPath: './',
  sourcemap: process.env.NODE_ENV === 'development' ? 'inline' : false,
  splitting: true,
  target: ['esnext', 'safari15'],
  treeShaking: true,
  define: {
    global: 'globalThis',
  },
});

await ctx.rebuild();

const noticeMessage = `${colors.redBg}${colors.black}   esBuild Done.   ${colors.reset}`;
console.log(noticeMessage);
ctx.dispose();
