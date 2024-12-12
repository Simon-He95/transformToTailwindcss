import { prettierCode } from './prettierCode'
import { transformVue } from './transformVue'
import { wrapperVueTemplate } from './wrapperVueTemplate'

interface Options {
  filepath?: string
  isRem?: boolean
}
export async function transformSvelte(code: string, options: Options = {}) {
  const { filepath, isRem } = options
  const match = code.match(
    /(<script.*<\/script>)?(.*(?=<style>))(<style>.*<\/style>)?/s,
  )
  if (!match)
    return code

  const [_all, _js, template, css] = match
  const _css = css ? css.replace(/<style>(.*)<\/style>/s, '$1') : ''
  const _template = wrapperVueTemplate(template, _css)
  const vue = await transformVue(_template, { isJsx: true, isRem, filepath })

  vue.replace(
    /<template>(.*)<\/template>\s*<style scoped>(.*)<\/style>/s,
    (_, newTemplate, newCss) =>
      (code = code.replace(template, newTemplate).replace(css, newCss)),
  )
  return prettierCode(code)
}
