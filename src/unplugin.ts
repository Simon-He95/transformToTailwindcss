import type { Options } from './type'
import { createFilter } from '@rollup/pluginutils'
import { createUnplugin } from 'unplugin'
import { classCollector } from './classCollector'
import { transformCode } from './transformCode'

const unplugin = createUnplugin((options?: Options): any => {
  const filter = createFilter(options?.include, options?.exclude)

  // 初始化类名收集器
  if (options?.collectClasses) {
    classCollector.clear()
    classCollector.enable(options?.outputPath, options?.skipIfNoChanges)
  }

  return [
    {
      name: 'unplugin-transform-to-tailwindcss',
      enforce: 'pre',
      buildStart() {
        // 在构建开始时重置状态
        if (options?.collectClasses) {
          classCollector.resetBuildState()
        }
      },
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

        return await transformCode(code, {
          filepath: id,
          type: suffix,
          isRem: options?.isRem,
          debug: options?.debug,
          collectClasses: options?.collectClasses,
        })
      },
      buildEnd() {
        // 构建结束时生成safelist文件
        if (options?.collectClasses) {
          classCollector.onBuildEnd()
        }
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
