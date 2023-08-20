import { transformAstro } from './transformAstro'
import { transformHtml } from './transformHtml'
import { transformJsx } from './transformJsx'
import { transformSvelte } from './transformSvelte'
import { transformVue } from './transformVue'
import type { SuffixType } from './type'

interface Options {
  filepath?: string
  type?: SuffixType
  isRem?: boolean
}
export async function transfromCode(code: string, options: Options = {}) {
  const { isRem, filepath, type } = options
  // 删除代码中的注释部分
  // code = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
  if (type === 'tsx')
    return transformJsx(code, { filepath, isRem })
  if (type === 'html')
    return transformHtml(code, { filepath, isRem })
  if (type === 'svelte')
    return transformSvelte(code, { filepath, isRem })
  if (type === 'astro')
    return transformAstro(code, { filepath, isRem })

  return transformVue(code, { isJsx: true, filepath, isRem })
}
