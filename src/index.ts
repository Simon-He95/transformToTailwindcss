import type { Options } from './type'
import { classCollector } from './classCollector'
import { transformAstro } from './transformAstro'
import { transformCode } from './transformCode'
import { transformHtml } from './transformHtml'
import { transformJsx } from './transformJsx'
import { transformSvelte } from './transformSvelte'
import { transformVue } from './transformVue'
import {
  esbuildTransformToTailwindcss,
  farmTransformToUnocss,
  rolldownTransformToUnocss,
  rollupTransformToTailwindcss,
  rspackTransformToUnocss,
  viteTransformToTailwindcss,
  webpackTransformToTailwindcss,
} from './unplugin'

export {
  classCollector,
  esbuildTransformToTailwindcss,
  farmTransformToUnocss,
  rolldownTransformToUnocss,
  rollupTransformToTailwindcss,
  rspackTransformToUnocss,
  transformAstro,
  transformCode,
  transformHtml,
  transformJsx,
  transformSvelte,
  transformVue,
  viteTransformToTailwindcss,
  webpackTransformToTailwindcss,
}

export type { Options }
