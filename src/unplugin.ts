import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import { transfromCode } from './transformCode'
import type { Options } from './utils'

// export function vitePluginTransformToTailwindcss() {
//   return {
//     name: 'vite-plugin-transform-to-tailwindcss',
//     async transform(code: string, id: string) {
//       const suffix = id.endsWith('.vue')
//         ? 'vue'
//         : id.endsWith('.tsx')
//           ? 'tsx'
//           : ''
//       if (!suffix)
//         return code

//       return await transfromCode(code, id, suffix)
//     },
//     enforce: 'pre',
//   }
// }

const unplugin = createUnplugin((options: Options = {}): any => {
  const filter = createFilter(options.include, options.exclude)
  return [
    {
      name: 'unplugin-transform-to-tailwindcss',
      enforce: 'pre',
      transformInclude(id: string) {
        return filter(id)
      },
      async transform(code: string, id: string) {
        const suffix = id.endsWith('.vue')
          ? 'vue'
          : id.endsWith('.tsx')
            ? 'tsx'
            : ''
        if (!suffix)
          return code

        return await transfromCode(code, id, suffix)
      },
    },
  ]
})

export const viteTransformToTailwindcss = unplugin.vite
export const rollupTransformToTailwindcss = unplugin.rollup
export const webpackTransformToTailwindcss = unplugin.webpack
export const esbuildTransformToTailwindcss = unplugin.esbuild
