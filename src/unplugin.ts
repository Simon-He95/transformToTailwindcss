import type { Options } from './type'
import { createFilter } from '@rollup/pluginutils'
import { createUnplugin } from 'unplugin'
import { transfromCode } from './transformCode'

const unplugin = createUnplugin((options?: Options): any => {
  const filter = createFilter(options?.include, options?.exclude)
  return [
    {
      name: 'unplugin-transform-to-tailwindcss',
      enforce: 'pre',
      transformInclude(id: string) {
        return filter(id)
      },
      async transform(code: string, id: string) {
        let suffix!: 'vue' | 'tsx'
        if (id.endsWith('.vue')) {
          suffix = 'vue'
        }
        else if (id.endsWith('lang.tsx')) {
          // skip
        }
        else if (id.endsWith('.tsx')) {
          suffix = 'tsx'
        }

        if (!suffix)
          return code

        return await transfromCode(code, {
          filepath: id,
          type: suffix,
          isRem: options?.isRem,
          debug: options?.debug,
        })
      },
    },
  ]
})

export const viteTransformToTailwindcss = unplugin.vite
export const rollupTransformToTailwindcss = unplugin.rollup
export const webpackTransformToTailwindcss = unplugin.webpack
export const esbuildTransformToTailwindcss = unplugin.esbuild
export const rspackTransformToUnocss = unplugin.rspack
export const farmTransformToUnocss = unplugin.farm
export const rolldownTransformToUnocss = unplugin.rolldown
