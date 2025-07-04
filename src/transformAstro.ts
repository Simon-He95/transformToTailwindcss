import { prettierCode } from './prettierCode'
import { transformVue } from './transformVue'
import { wrapperVueTemplate } from './wrapperVueTemplate'

interface Options {
  filepath?: string
  globalCss?: string
  isRem?: boolean
  debug?: boolean
  collectClasses?: boolean
}
export async function transformAstro(code: string, options: Options) {
  const { isRem, filepath, globalCss, debug } = options || {}
  const match = code.match(/(---.*---)?(.*(?=<style>))(<style>.*<\/style>)?/s)
  if (!match)
    return code

  const [_all, _js, template, css] = match
  const _css = css ? css.replace(/<style>(.*)<\/style>/s, '$1') : ''
  const _template = wrapperVueTemplate(template, _css)
  const vue = await transformVue(_template, {
    isJsx: true,
    isRem,
    filepath,
    globalCss,
    debug,
  })
  vue.replace(
    /<template>(.*)<\/template>\s*<style scoped>(.*)<\/style>/s,
    (_, newTemplate, newCss) =>
      (code = code.replace(template, newTemplate).replace(css, newCss)),
  )

  return prettierCode(code)
}
