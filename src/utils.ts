import { createGenerator } from '@unocss/core'
import presetUno from '@unocss/preset-uno'
import type { CssType } from './type'

export const flag = '.__unocss_transfer__'

export function isNot(s: string) {
  return /\[&:not\(/.test(s)
}

export function getLastName(s: string) {
  const all = s.split('-')
  return all[all.length - 1]
}

export function joinWithLine(s: string) {
  return s.replace(/\s+/, ' ').split(' ').join('-')
}

export function joinWithUnderLine(s: string) {
  return s.replace(/\s+/, ' ').split(' ').join('_')
}

export type TrimType = 'all' | 'pre' | 'around' | 'post'

/**
 * 删除空格
 * @param { string } s 字符串
 * @param { TrimType } type 所有 ｜ 前置 ｜ 前后 ｜ 后置 'all' | 'pre' | 'around' | 'post'
 * @returns string
 */
export function trim(s: string, type: TrimType = 'around'): string {
  if (type === 'pre')
    return s.replace(/(^\s*)/g, '')
  if (type === 'post')
    return s.replace(/(\s*$)/g, '')
  if (type === 'all')
    return s.replace(/\s+/g, '')
  if (type === 'around')
    return s.replace(/(^\s*)|(\s*$)/g, '')
  return s
}

export function diffTemplateStyle(before: string, after: string) {
  const s1 = before.match(/<style scoped>.*<\/style>/s)!
  const s2 = after.match(/<style scoped>.*<\/style>/s)!

  return s1[0] === s2[0]
}

export function isEmptyStyle(code: string) {
  return /<style scoped>[\n\s]*<\/style>/.test(code)
}

export function getStyleScoped(code: string) {
  const match = code.match(/<style scoped>(.*)<\/style>/s)
  if (!match)
    return ''
  return match[1]
}

export function getCssType(filename: string) {
  const ext = filename.split('.').pop()!
  const result = ext === 'styl' ? 'stylus' : ext
  return result as CssType
}

export function transformUnocssBack(code: string[]) {
  const result: string[] = []
  return new Promise((resolve) => {
    createGenerator(
      {},
      {
        presets: [presetUno()],
      },
    )
      .generate(code || '')
      .then((res: any) => {
        const css = res.getLayers()
        code.forEach((item) => {
          try {
            const reg = new RegExp(
              `${item.replace(/([\!\(\)\[\]\*])/g, '\\\\$1')}{(.*)}`,
            )
            const match = css.match(reg)
            if (!match)
              return
            const matcher = match[1]

            result.push(
              matcher
                .split(';')
                .filter((i: any) => /^\w+[\w\-]*:/.test(i))[0]
                .split(':')[0],
            )
          }
          catch (error) {}
        })

        resolve(result)
      })
  })
}
