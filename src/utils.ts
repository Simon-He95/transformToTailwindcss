import type { CssType } from './type'
import { createGenerator } from '@unocss/core'
import presetUno from '@unocss/preset-uno'

export const TRANSFER_FLAG = '.__unocss_transfer__'

/**
 * 检查是否在 Node.js 环境中运行
 * @returns {boolean} 如果在 Node.js 环境中返回 true，在浏览器环境中返回 false
 */
export function isNodeEnvironment(): boolean {
  try {
    // 使用 require 而不是全局 process 以避免 ESLint 警告
    // eslint-disable-next-line ts/no-require-imports
    const process = require('node:process')
    return (
      typeof window === 'undefined'
      && typeof process !== 'undefined'
      && Boolean(process.versions?.node)
    )
  }
  catch {
    // 如果在浏览器环境中，require 可能会失败
    return false
  }
}

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
  return /<style scoped>\s*<\/style>/.test(code)
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
              `${item.replace(/([!()[\]*])/g, '\\\\$1')}{(.*)}`,
            )
            const match = css.match(reg)
            if (!match)
              return
            const matcher = match[1]

            result.push(
              matcher
                .split(';')
                .filter((i: any) => /^\w[\w\-]*:/.test(i))[0]
                .split(':')[0],
            )
          }
          catch (error) {}
        })

        resolve(result)
      })
  })
}

/**
 * 动态导入 Vue Compiler SFC，避免打包时的问题
 * @returns Vue Compiler SFC 中的方法
 */
export async function getVueCompilerSfc() {
  const { parse } = await import('@vue/compiler-sfc')
  return { parse }
}
