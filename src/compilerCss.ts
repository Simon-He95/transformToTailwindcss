import type { CssType } from './type'
import { lessCompiler } from './lessCompiler'
import { sassCompiler } from './sassCompiler'
import { stylusCompiler } from './stylusCompiler'

export function compilerCss(css: string, lang: CssType) {
  switch (lang) {
    case 'stylus':
      return stylusCompiler(css)
    case 'less':
      return lessCompiler(css)
    case 'scss':
      return sassCompiler(css)
    default:
      return css
  }
}
