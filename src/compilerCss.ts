import type { CssType } from './type'
import process from 'node:process'
import { lessCompiler } from './lessCompiler'
import { sassCompiler } from './sassCompiler'
import { stylusCompiler } from './stylusCompiler'

export function compilerCss(
  css: string,
  lang: CssType,
  filepath: string = process.cwd(),
  globalCss?: string,
  debug?: boolean,
) {
  switch (lang) {
    case 'stylus':
      return stylusCompiler(css, filepath, globalCss, debug)
    case 'less':
      return lessCompiler(css, filepath, globalCss, debug)
    case 'scss':
      return sassCompiler(css, filepath, globalCss, debug)
    default:
      return css
  }
}
