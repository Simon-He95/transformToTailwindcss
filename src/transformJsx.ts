import fs from 'node:fs'
import path from 'node:path'
import { parse as babelParse, traverse as babelTraverse } from '@babel/core'
import vueJsxPlugin from '@vue/babel-plugin-jsx'
import { transformVue } from './transformVue'

interface Options {
  filepath?: string
  globalCss?: string
  isRem?: boolean
  debug?: boolean
  collectClasses?: boolean
}
export async function transformJsx(code: string, options: Options = {}) {
  const { filepath, globalCss, isRem, debug } = options
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

  let vueTransfer = await transformVue(wrapperVue, {
    isJsx: true,
    isRem,
    filepath,
    globalCss,
    debug,
  })
  vueTransfer = vueTransfer.replace(/class/g, 'className')
  if (cssPath) {
    const cssTransfer = vueTransfer.match(/<style scoped>(.*)<\/style>/s)![1]
    fs.promises.writeFile(
      cssPath.replace('.css', '.__unocss_transfer__.css'),
      cssTransfer,
      'utf-8',
    )
  }
  const jsxTransfer = vueTransfer.match(/<template>(.*)<\/template>/s)![1]
  return code.replace(jsxCode, jsxTransfer)
}
