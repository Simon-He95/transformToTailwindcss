import type { CssType } from './type'
import { lessCompiler } from './lessCompiler'
import { sassCompiler } from './sassCompiler'
import { stylusCompiler } from './stylusCompiler'

export function compilerCss(css: string, lang: CssType, debug?: boolean) {
  switch (lang) {
    case 'stylus':
      return stylusCompiler(css, undefined, undefined, debug)
    case 'less':
      return lessCompiler(css, undefined, undefined, undefined, debug)
    case 'scss':
      return sassCompiler(css, undefined, undefined, debug)
    default:
      return css
  }
}
