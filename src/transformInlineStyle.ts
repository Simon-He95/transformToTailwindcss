import { transformStyleToTailwindcss } from 'transform-to-tailwindcss-core'
import { classCollector } from './classCollector'

const styleReg = /<([\w\-]+)[^/>]*[^:]style="([^"]+)"[^>]*>/g

const removeStyleReg = / style="([^"]*)"/
const templateReg = /^<template>(.*)<\/template>$/ms
const commentReg = /<!--.*-->/gs
export function transformInlineStyle(
  code: string,
  isJsx?: boolean,
  isRem?: boolean,
  debug?: boolean,
  collectClasses?: boolean,
): string {
  // code中提取template
  const match = code.match(templateReg)
  if (!match)
    return code
  let templateMatch = match[1]
  const commentMap: Record<string, string> = {}
  let count = 0
  const commentPrefix = '__commentMap__'
  templateMatch = templateMatch.replace(commentReg, (comment: string) => {
    count++
    commentMap[count] = comment
    return `${commentPrefix}${count}`
  })

  templateMatch.replace(styleReg, (target, tag, inlineStyle) => {
    const [after, noMap] = transformStyleToTailwindcss(
      inlineStyle,
      isRem,
      debug,
    )

    // 收集转换后的类名
    if (collectClasses && after) {
      classCollector.addClasses(after)
    }

    // transform inline-style

    if (isJsx) {
      const newReg = new RegExp(`<${tag}.*\\sclass="([^"]*)"`, 's')
      const matcher = target.match(newReg)

      if (matcher) {
        return (templateMatch = templateMatch.replace(
          target,
          target
            .replace(removeStyleReg, '')
            .replace(
              `class="${matcher[1]}"`,
              noMap.length
                ? `class="${matcher[1]} ${after}" style="${noMap.map(item => item && item.trim()).join(';')}"`
                : `class="${matcher[1]} ${after}"`,
            ),
        ))
      }

      return (templateMatch = templateMatch.replace(
        target,
        target
          .replace(removeStyleReg, '')
          .replace(
            `<${tag}`,
            noMap.length
              ? `<${tag} class="${after}" style="${noMap.map(item => item && item.trim()).join(';')}"`
              : `<${tag} class="${after}"`,
          ),
      ))
    }

    return (templateMatch = templateMatch.replace(
      target,
      target
        .replace(removeStyleReg, '')
        .replace(
          `<${tag}`,
          noMap.length
            ? `<${tag} ${after} style="${noMap.map(item => item && item.trim()).join(';')}"`
            : `<${tag} ${after}`,
        ),
    ))
  })

  // 还原注释
  Object.keys(commentMap).forEach((key) => {
    const commentKey = `${commentPrefix}${key}`
    const value = commentMap[key]
    templateMatch = templateMatch.replace(commentKey, value)
  })

  return code.replace(templateReg, `<template>${templateMatch}</template>`)
}
