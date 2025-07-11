import fsp from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { escapeRegExp } from 'lazy-js-utils'
import {
  transformStyleToTailwindcss,
  transformStyleToTailwindPre,
} from 'transform-to-tailwindcss-core'
import { classCollector } from './classCollector'
import { compilerCss } from './compilerCss'
import { nodeHtmlParser } from './node-html-parser'
import { tail } from './tail'
import { transformVue } from './transformVue'
import {
  diffTemplateStyle,
  getCssType,
  getStyleScoped,
  getVueCompilerSfc,
  isEmptyStyle,
  isNodeEnvironment,
  isNot,
  joinWithUnderLine,
  TRANSFER_FLAG,
  transformUnocssBack,
  trim,
} from './utils'
import { wrapperVueTemplate } from './wrapperVueTemplate'

const tailReg = /:?:(.+)/ // :after
const emptyClass = /[,\w>.#\-+:[\]="'\s()]+\{\}\n/g

interface Position {
  column: number
  line: number
  offset: number
}
interface AllChange {
  before: string
  after: string
  name: string
  source: string
  tag: string
  prefix: string
  attr: string[]
  class: string
  media: string
  start: Position
  end: Position
}

let isRem: boolean | undefined = false
interface Options {
  isJsx?: boolean
  filepath?: string
  globalCss?: string
  isRem?: boolean
  debug?: boolean
  collectClasses?: boolean
}

export async function transformCss(
  style: string,
  code: string,
  media = '',
  options: Options,
): Promise<string> {
  const {
    isJsx,
    isRem: _isRem,
    filepath: _filepath,
    globalCss,
    debug,
  } = options || {}
  // 理论上filepath应该总是从plugin中获取id，但提供process.cwd()作为后备默认值
  // 在浏览器环境中使用空字符串或原始filepath
  const filepath = _filepath || (isNodeEnvironment() ? process.cwd() : '')
  isRem = _isRem
  if (debug) {
    console.log(
      `[transform-to-tailwindcss] Transforming CSS in ${filepath || 'unknown file'}`,
    )
  }
  const allChanges: AllChange[] = []
  let newCode = (await importCss(
    code,
    style,
    filepath,
    isJsx,
    debug,
    isRem,
    globalCss,
  )) as string
  const { parse } = await getVueCompilerSfc()
  const stack = parse(newCode).descriptor.template?.ast
  const updateOffsetMap: any = {}
  const deferRun: any[] = []
  style.replace(
    /([.#\w](?:[^{}]|\n)*)\{([#\\\s\w\-.:;,%@/()+'"!]*)\}/g,
    (all: any, name: any, value: any = '') => {
      name = trim(name.replace(/\s+/g, ' '))

      // 过滤掉特殊的CSS选择器
      if (
        name.includes(':deep(')
        || name.includes('>>>')
        || name.includes('/deep/')
        || name.includes('::v-deep')
        || name.includes(':global(')
        || name.includes('@') // 过滤 @media, @keyframes 等
      ) {
        return
      }

      const originClassName = name
      const before = trim(value.replace(/\n\s*/g, ''))
      const [transfer, noTransfer] = transformStyleToTailwindcss(
        before,
        isRem,
        debug,
      )
      const tailMatcher = name.match(tailReg)

      const prefix = tailMatcher
        ? (name.endsWith(tailMatcher[0]) ? '' : 'group-') + tail(tailMatcher[1])
        : ''
      // :deep()
      if (prefix === 'group-deep')
        return
      // hover .xxx 这种没办法处理因为 tailwind 只支持 hover:[&:xxx] 在当前的元素下
      if (prefix.includes(' '))
        return

      const after
        = prefix && transfer
          ? `${prefix}="${transfer.replace(
            /="\[([^\]]*)\]"/g,
            (_: string, v: string) => `-[${v}]`,
          )}"`
          : (transfer ?? before)
      // 未被转换跳过
      if (before === after)
        return

      // 收集转换后的类名
      classCollector.addClasses(after)

      if (prefix)
        name = name.replace(tailMatcher[0], '')

      // 找template > ast
      const result = nodeHtmlParser(newCode, originClassName, stack?.children)

      if (!result.length)
        return

      // 拿出class
      const _class = newCode.match(/<style[^>]+>(.*)<\/style>/s)![1]
      // 删除原本class
      let newClass = _class.replace(all, _ =>
        _.replace(value, noTransfer.join(';')))

      // 如果class中内容全部被移除删除这个定义的class
      newClass = newClass.replace(emptyClass, '')
      newCode = newCode.replace(_class, newClass)

      for (const r of result) {
        const parent = r.parent
        if (prefix.startsWith('group-') && parent) {
          // 给result的parent添加class="group"
          const hasClass = parent.props.find((i: any) => i.name === 'class')
          if (hasClass) {
            if (hasClass.value.content.includes('group'))
              return
            // 如果有class
            const index = hasClass.value.loc.start.offset
            const newIndex
              = hasClass.value.loc.start.offset
                + getCalculateOffset(updateOffsetMap, index)
            const updateText = 'group '
            updateOffsetMap[index] = updateText.length
            hasClass.value.content = `${hasClass.value.content} ${updateText}`
            newCode = `${newCode.slice(0, newIndex + 1)}${updateText}${newCode.slice(
              newIndex + 1,
            )}`
          }
          else {
            const index = parent.loc.start.offset + parent.tag.length + 1
            const newIndex
              = hasClass.value.loc.start.offset
                + getCalculateOffset(updateOffsetMap, index)
            const updateText = 'class="group" '
            parent.props.push({
              type: 6,
              name: 'class',
              value: {
                type: 2,
                content: 'group',
                loc: {
                  start: {
                    column: 0,
                    line: 0,
                    offset: newIndex,
                  },
                  end: {
                    column: 0,
                    line: 0,
                    offset: newIndex + updateText.length,
                  },
                },
              },
              loc: {
                start: {
                  column: 0,
                  line: 0,
                  offset: newIndex,
                },
                end: {
                  column: 0,
                  line: 0,
                  offset: newIndex + updateText.length,
                },
              },
            })
            updateOffsetMap[index] = updateText.length
            newCode = `${newCode.slice(0, newIndex)}${updateText}${newCode.slice(
              newIndex,
            )}`
          }
        }

        const {
          loc: { start, end },
          tag,
          props,
        } = r

        let _class = ''
        const attr = props.reduce((result: string[], cur: any) => {
          let item

          if (cur.name === 'class' && (item = cur.value?.content))
            _class = item
          else if (!cur.value)
            result.push(cur.name)

          return result
        }, [] as string[])

        // 运行完后执行
        deferRun.push(() => {
          const newIndex = getCalculateOffset(updateOffsetMap, start.offset)
          const newSource = newCode.slice(
            start.offset + newIndex,
            end.offset + newIndex,
          )
          allChanges.push({
            before,
            after,
            name: originClassName,
            source: newSource,
            tag,
            attr,
            class: _class,
            prefix,
            media,
            start,
            end,
          })
        })
      }

      return all
    },
  )
  deferRun.forEach(run => run())
  return await resolveConflictClass(
    allChanges,
    newCode,
    isJsx,
    updateOffsetMap,
    debug,
  )
}

async function importCss(
  code: string,
  style: string,
  filepath: string,
  isJsx?: boolean,
  debug?: boolean,
  isRem?: boolean,
  globalCss?: string,
) {
  const originCode = code
  for await (const match of style.matchAll(
    /@import (url\()?["']*([\w./\-]*)["']*\)?;/g,
  )) {
    if (!match)
      continue
    const url = path.resolve(filepath, '..', match[2])

    const content = await fsp.readFile(
      path.resolve(filepath!, '..', url),
      'utf-8',
    )
    const type = getCssType(url)
    const css = await compilerCss(content, type, url, style, debug)

    const [_, beforeStyle] = code.match(/<style.*>(.*)<\/style>/s)!
    code = code.replace(beforeStyle, '')

    const vue = wrapperVueTemplate(code, css)

    const transfer = await transformVue(vue, {
      isJsx,
      isRem,
      filepath,
      globalCss,
      debug,
    })

    if (diffTemplateStyle(transfer, vue)) {
      code = originCode
      continue
    }
    // 如果<style scoped>为空全部转换删除@import

    if (isEmptyStyle(transfer)) {
      code = wrapperVueTemplate(transfer, beforeStyle.replace(match[0], ''))
      continue
    }
    // 否则剩余的生成新的@import css
    const restStyle = getStyleScoped(transfer)
    if (restStyle.replace(/\s+|;/g, '') === css!.replace(/(\s+|;)/g, '')) {
      return originCode
    }

    fsp.writeFile(
      url.replace(`.${type}`, `${TRANSFER_FLAG}.${type}`),
      restStyle,
      'utf-8',
    )

    code = wrapperVueTemplate(
      transfer.replace(/<style scoped>.*<\/style>/s, ''),
      beforeStyle,
    )
    continue
  }
  return code
}

// 查找是否存在冲突样式按照names
async function resolveConflictClass(
  allChange: AllChange[],
  code: string,
  isJsx: boolean = true,
  updateOffset: Record<number, number>,
  debug?: boolean,
) {
  const originCode = code
  const changes = findSameSource(allChange)
  let result = code
  for await (const key of Object.keys(changes)) {
    const value = changes[key]
    const {
      tag,
      prefix,
      media,
      source,
      start: { offset },
      end: { offset: offsetEnd },
    } = value[0]

    let [after, transform] = await getConflictClass(value, debug)
    if (!after)
      continue

    const newResult = transform(result)
    result = newResult
    const target = transform(source)
    if (media)
      after = `${media}:${after}`
    if (prefix) {
      if (isNot(prefix)) {
        const match = target.match(/<[^>]*(class="[^"]+)[^>]*/)
        if (match) {
          // 将class合并
          after = after.replace(
            /class="(\[&:not\([\w\s\-.#]+\)\]:[\w\-.]+)"\s*/,
            (_, v) => {
              const updateText = ` ${v}`
              result = result.replace(match[1], `${match[1]}${updateText}`)
              return ''
            },
          )
        }
      }
      else {
        after = after.replace(/="\[/g, '-"[')
      }
    }

    // 默认全部都输出到class中
    const returnValue
      = isJsx || after.replace(/[\w\-]+=("{1})(.*?)\1/g, '').includes('[')
        ? after
            .replace(/\[([^\]]+)\]/g, (all, v) =>
              all.replace(v, joinWithUnderLine(v)))
            .replace(/-(rgba?([^)]+))/g, '-[$1]')
            .replace(
              /([\w\-]+(?:-\[[^\]]*\])?)=(['"]{1})(.*?)\2/g,
              (_all, prefix, quote, content) => {
                // 拆分 content 中的空格，但是要忽略 ( ) [] 中的空格, 然后用 prefix 连接
                const splitContent: string[] = content
                  .split(/(?<!\[[^\]]*)\s+/)
                  .filter(Boolean)

                return splitContent.map(item => `${prefix}:${item}`).join(` `)
              },
            )
        : after

    // 收集最终生成的类名到 classCollector
    if (returnValue) {
      classCollector.addClasses(returnValue)
    }

    // (["]{1})(.*?)\1
    const getUpdateOffset = getCalculateOffset(updateOffset, offset)
    const start = originCode.slice(
      offset + getUpdateOffset,
      offsetEnd + getUpdateOffset,
    )

    if (isJsx || after.replace(/[\w\-]+=("{1})(.*?)\1/g, '').includes('[')) {
      const newReg = new RegExp(
        `^<${tag}(?:[^\/'">]|"[^"]*"|'[^']*')*[^:]class=["']([^"']+)["']([^\/'">]|"[^"]*"|'[^']*')*\/?>`,
        's',
      )
      const matcher = target.match(newReg)

      if (matcher) {
        // updateText
        result = result.replace(
          start,
          start.replace(
            `class="${matcher[1]}"`,
            `class="${matcher[1]} ${returnValue}"`,
          ),
        )
        continue
      }

      result = result.replace(
        start,
        start.replace(`<${tag}`, `<${tag} class="${returnValue}"`),
      )
      continue
    }

    result = result.replace(
      start,
      start.replace(`<${tag}`, `<${tag} ${returnValue}`),
    )
  }

  return result
}

function calculateWeight(c: string) {
  const data = c.split(' ').filter(i => i !== '+' && i !== '>')
  let num = 0

  data.forEach((item) => {
    item.replace(/#\w+/g, () => {
      num += 100
      return ''
    })
    item.replace(/.\w+/, () => {
      num += 10
      return ''
    })
    item.replace(/^\w+/, () => {
      num += 10
      return ''
    })
    item.replace(/\[[\w\s='"-]+\]/g, () => {
      num += 10
      return ''
    })
    item.replace(/:\w+/g, () => {
      num += 1
      return ''
    })
  })

  return num
}

function getMatchingWeight(name: string, currentClass: string): number {
  // 如果name包含逗号，说明是多个选择器，需要找到匹配当前class的选择器
  if (name.includes(',')) {
    const selectors = name.split(',').map(s => s.trim())
    const currentClasses = currentClass.split(' ').filter(Boolean)

    // 找到最匹配的选择器
    let bestMatch = ''
    let maxMatchCount = 0

    for (const selector of selectors) {
      let matchCount = 0
      // 提取选择器中的类名
      const selectorClasses = selector.match(/\.[A-Z][\w-]*/gi) || []

      for (const selectorClass of selectorClasses) {
        const className = selectorClass.substring(1) // 去掉点号
        if (currentClasses.includes(className)) {
          matchCount++
        }
      }

      if (matchCount > maxMatchCount) {
        maxMatchCount = matchCount
        bestMatch = selector
      }
    }

    // 如果找到匹配的选择器，使用它计算权重，否则使用第一个
    return calculateWeight(bestMatch || selectors[0])
  }

  // 如果没有逗号，直接计算权重
  return calculateWeight(name)
}

function findSameSource(allChange: AllChange[]) {
  const result: any = {}
  allChange.forEach((item) => {
    const { source, start, end } = item
    const key = `${source}:${start.offset}:${end.offset}`
    if (!result[key])
      result[key] = []
    result[key].push(item)
  })
  return result
}

const skipTransformFlag = Symbol('skipTransformFlag')
async function getConflictClass(
  allChange: AllChange[],
  debug?: boolean,
): Promise<[string, (code: string) => string]> {
  let map: Record<string, Array<number | string | symbol>> = {}
  let transform = (code: string) => code
  for await (const item of allChange) {
    const {
      before,
      name,
      source,
      attr,
      after,
      prefix,
      media,
      class: _class,
    } = item
    const pre = prefix ? `${prefix}|` : ''
    const beforeArr = before.split(';').filter(Boolean)
    const data = beforeArr.map((item) => {
      const [key, value] = item.split(':')
      return [`${pre}${key}`, value]
    })

    // 计算当前选择器的权重
    const currentWeight = getMatchingWeight(name, _class)

    data.forEach((item) => {
      const [key, value] = item
      if (value === undefined)
        return
      if (!map[key]) {
        map[key] = [currentWeight, value]
      }
      else {
        const [preWeight] = map[key] as any
        if (preWeight === skipTransformFlag)
          return
        if (+currentWeight >= +preWeight)
          map[key] = [+currentWeight, value]
      }
    })

    // map如果已存在内联转换的unocss且为相同属性的判断是否需要删除
    if (attr) {
      const res = (await transformUnocssBack(
        attr.map((i) => {
          if (prefix)
            return `${prefix}="${i}"`
          if (media)
            return `${media}:${i}`
          return i
        }),
      )) as any[]
      Object.keys(map).forEach((i) => {
        const index = res.findIndex(r => r === i)
        if (index !== -1) {
          const inline = item.attr[index]
          if (inline?.endsWith('!') || !after?.endsWith('!')) {
            // 需要删除
            return delete map[i]
          }
          else {
            // 不需要删除，移除原本的inlineStyle的转换后的结果
            transform = (code: string) =>
              code.replace(source, source.replace(` ${inline}`, ''))
          }
        }
      })
    }
  }

  // 提前处理 map
  const joinMap = Object.keys(map)
    .map((key) => {
      const value = map[key][1] as string
      return `${key}:${value}`
    })
    .join(';')
  const { transformedResult, newStyle } = transformStyleToTailwindPre(joinMap)
  if (transformedResult) {
    // map 赋值新 newStyle
    map = newStyle.split(';').reduce(
      (acc: Record<string, Array<number | string | symbol>>, item: string) => {
        const [key, value] = item.trim().split(':')
        if (value !== undefined) {
          acc[key] = [map[key][0], value]
        }
        return acc
      },
      // 将 transformedResult 赋值给 map
      // map[]
      {},
    )
    map[transformedResult] = [1, skipTransformFlag]
  }
  return [
    Object.keys(map)
      .reduce((result, key) => {
        const keys = key.split('|')
        let prefix = keys.length > 1 ? keys[0] : ''
        let transferCss
          = map[key][1] === skipTransformFlag
            ? key
            : transformStyleToTailwindcss(
              `${key}:${map[key][1] as string}`,
              isRem,
              debug,
            )[0]

        const match = transferCss.match(/(\S*)="\[([^\]]*)\]"/)
        if (match) {
          transferCss = `${match.input?.replace(
            match[0],
            match[0]
              .replace(/="\[([^\]]*)\]"/, (_: string, v: string) => `-[${v}]`)
              .replace(/="([^"]*)"/, '-$1'),
          )}`
        }

        // transferCss = `${match[1]}-${joinWithUnderLine(match[2])}`
        transferCss = transferCss.replace(/"/g, '\'')
        const _transferCss = prefix
          ? isNot(prefix)
            ? `class="${prefix}${transferCss
              .replace(
                /="\[([^\]]*)\]"/g,
                (_: string, v: string) => `-[${v}]`,
              )
              .replace(/="([^"]*)"/, '-$1')}"`
            : `${prefix}="${transferCss
              .replace(
                /="\[([^\]]*)\]"/g,
                (_: string, v: string) => `-[${v}]`,
              )
              .replace(/="([^"]*)"/, '-$1')}"`
          : transferCss
        // 如果存在相同的prefix, 进行合并

        if (!prefix) {
          const reg = /^(\S*)="[^"]*"$/
          if (reg.test(transferCss))
            prefix = transferCss.match(reg)![1]
        }

        if (prefix) {
          const prefixReg1 = new RegExp(
            `(?<!\\S)${escapeRegExp(prefix)}(?!\\S)`,
          )
          if (prefixReg1.test(result)) {
            return result.replace(prefixReg1, all =>
              all.replace(prefix, _transferCss))
          }
          const prefixReg2 = new RegExp(`(?<!\\S)${escapeRegExp(prefix)}=`)

          if (prefixReg2.test(result)) {
            if (isNot(prefix)) {
              const reg = new RegExp(
                `${escapeRegExp(prefix)}([\\w\\:\\-;\\[\\]\\/\\+%]+)`,
              )
              return result.replace(reg, all => `${all}:${transferCss}`)
            }
            const reg = new RegExp(`${escapeRegExp(prefix)}=(["]{1})(.*?)\\1`)
            return result.replace(reg, (all, _, v) => {
              const unique = [
                ...new Set(
                  v
                    .split(' ')
                    .concat(
                      _transferCss.slice(prefix.length + 2, -1).split(' '),
                    ),
                ),
              ].join(' ')
              if (v)
                return all.replace(v, unique)
              return `${prefix}="${unique.trim()}"`
            })
          }
        }
        return `${result}${_transferCss} `
      }, '')
      .trim(),
    transform,
  ]
}

function getCalculateOffset(offsetMap: any, offset: any) {
  return Object.keys(offsetMap).reduce((result, key) => {
    if (+key <= offset)
      result += offsetMap[key]

    return result
  }, 0)
}
