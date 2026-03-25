import type { CssType } from './type'
import { compilerCss } from './compilerCss'
import { prettierCode } from './prettierCode'
import { transformCss } from './transformCss'
import { transformInlineStyle } from './transformInlineStyle'
import { transformMedia } from './transformMedia'
import { cleanupEmptyStyles, getVueCompilerSfc } from './utils'

interface Options {
  isJsx?: boolean
  filepath?: string
  globalCss?: string
  isRem?: boolean
  isV4?: boolean
  debug?: boolean
  collectClasses?: boolean
}

export async function transformVue(code: string, options?: Options) {
  const { isRem, isV4, isJsx, filepath, globalCss, debug, collectClasses }
    = options || {}
  const { parse } = await getVueCompilerSfc()
  const {
    descriptor: { template, styles },
    errors,
  } = parse(code)

  if (errors.length)
    return code
  // transform inline-style
  code = transformInlineStyle(code, isJsx, isRem, debug, collectClasses, isV4)

  if (errors.length || !template)
    return code
  // transform @media 注：transformBack是将@media中内容用一个占位符替换等到transformCss处理完将结果还原回去
  const [transferMediaCode, transformBack] = await transformMedia(
    code,
    isJsx,
    isRem,
    isV4,
    debug,
    collectClasses,
    filepath, // 传递 filepath 参数
  )

  code = transferMediaCode
  if (styles.length) {
    // transform class
    const {
      attrs: { scoped },
      content: style,
      lang = 'css',
    } = styles[0]

    const css = await compilerCss(
      style,
      lang as CssType,
      filepath,
      globalCss,
      debug,
    )
    if (css) {
      code = code.replace(style, `\n${css}\n`).replace(` lang="${lang}"`, '')

      // 只针对scoped css处理
      if (scoped) {
        if (debug) {
          console.log(
            `[transform-to-tailwindcss] Processing scoped CSS in ${filepath}`,
          )
        }
        code = await transformCss(css, code, '', {
          isJsx,
          filepath,
          isRem,
          isV4,
          debug,
          collectClasses,
        })
      }
    }
  }
  // 还原@media 未匹配到的class
  code = transformBack(code)
  code = cleanupEmptyStyles(code)

  return prettierCode(code)
}
