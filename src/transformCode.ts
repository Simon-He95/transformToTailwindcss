import type { SuffixType } from './type'
import { transformAstro } from './transformAstro'
import { transformHtml } from './transformHtml'
import { transformJsx } from './transformJsx'
import { transformSvelte } from './transformSvelte'
import { transformVue } from './transformVue'

interface Options {
  filepath?: string
  type?: SuffixType
  isRem?: boolean
  debug?: boolean
}
export async function transfromCode(code: string, options: Options = {}) {
  const { isRem, filepath, type, debug } = options
  // 删除代码中的注释部分
  // code = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
  if (debug) {
    console.log(`[transform-to-tailwindcss] Processing file: ${filepath}`)
  }
  if (type === 'tsx')
    return transformJsx(code, { filepath, isRem, debug })
  if (type === 'html')
    return transformHtml(code, { filepath, isRem, debug })
  if (type === 'svelte')
    return transformSvelte(code, { filepath, isRem, debug })
  if (type === 'astro')
    return transformAstro(code, { filepath, isRem, debug })

  return transformVue(code, { isJsx: true, filepath, isRem, debug })
}
