import type { SuffixType } from './type'
import { transformAstro } from './transformAstro'
import { transformHtml } from './transformHtml'
import { transformJsx } from './transformJsx'
import { transformSvelte } from './transformSvelte'
import { transformVue } from './transformVue'

interface Options {
  filepath?: string
  globalCss?: string
  type?: SuffixType
  isRem?: boolean
  debug?: boolean
  collectClasses?: boolean
}
export async function transformCode(code: string, options: Options = {}) {
  const { isRem, filepath, globalCss, type, debug, collectClasses } = options
  // 删除代码中的注释部分
  // code = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
  if (debug) {
    console.log(`[transform-to-tailwindcss] Processing file: ${filepath}`)
  }
  if (type === 'tsx') {
    return transformJsx(code, {
      filepath,
      globalCss,
      isRem,
      debug,
      collectClasses,
    })
  }
  if (type === 'html') {
    return transformHtml(code, {
      filepath,
      globalCss,
      isRem,
      debug,
      collectClasses,
    })
  }
  if (type === 'svelte') {
    return transformSvelte(code, {
      filepath,
      globalCss,
      isRem,
      debug,
      collectClasses,
    })
  }
  if (type === 'astro') {
    return transformAstro(code, {
      filepath,
      globalCss,
      isRem,
      debug,
      collectClasses,
    })
  }

  return transformVue(code, {
    isJsx: true,
    filepath,
    globalCss,
    isRem,
    debug,
    collectClasses,
  })
}
