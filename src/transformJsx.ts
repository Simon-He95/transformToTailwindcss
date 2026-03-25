import fs from 'node:fs'
import path from 'node:path'
import { parse as babelParse, traverse as babelTraverse } from '@babel/core'
import vueJsxPlugin from '@vue/babel-plugin-jsx'
import { transformVue } from './transformVue'

interface Options {
  filepath?: string
  globalCss?: string
  isRem?: boolean
  isV4?: boolean
  debug?: boolean
  collectClasses?: boolean
}
export async function transformJsx(code: string, options: Options = {}) {
  const { filepath, globalCss, isRem, isV4, debug, collectClasses } = options
  const ast = babelParse(code, {
    babelrc: false,
    comments: true,
    plugins: [[vueJsxPlugin, {}]],
  })

  let container: any = null
  let css = ''
  let cssPath = ''
  babelTraverse(ast as any, {
    enter({ node }: any) {
      if (node.type === 'JSXElement') {
        if (container)
          return
        container = node
      }
      if (node.type === 'ImportDeclaration') {
        const value = node.source.value
        if (value.endsWith('.css')) {
          css += fs.readFileSync(
            (cssPath = path.resolve(filepath!, '../', value)),
            'utf-8',
          )
        }
      }
    },
  })
  const jsxCode = code.slice(container.start, container.end)

  const wrapperVue = `<template>${jsxCode.replace(
    /className/g,
    'class',
  )}</template>
    <style scoped>
    ${css}
    </style>`

  const vueTransfer = await transformVue(wrapperVue, {
    isJsx: true,
    isRem,
    isV4,
    filepath,
    globalCss,
    debug,
    collectClasses,
  })
  const templateMatch = vueTransfer.match(/<template>(.*)<\/template>/s)
  const styleMatch = vueTransfer.match(/<style scoped>(.*)<\/style>/s)
  if (cssPath) {
    await fs.promises.writeFile(
      cssPath.replace('.css', '.__unocss_transfer__.css'),
      styleMatch?.[1] ?? '',
      'utf-8',
    )
  }
  const jsxTransfer = (templateMatch?.[1] ?? jsxCode).replace(
    /\bclass=/g,
    'className=',
  )
  return code.replace(jsxCode, jsxTransfer)
}
