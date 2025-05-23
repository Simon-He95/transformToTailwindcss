import fsp from 'node:fs/promises'
import path from 'node:path'
import {
  transformStyleToTailwindcss,
  transformStyleToTailwindPre,
} from 'transform-to-tailwindcss-core'
import { compilerCss } from './compilerCss'
import { tail } from './tail'
import { transformVue } from './transformVue'
import {
  diffTemplateStyle,
  getCssType,
  getStyleScoped,
  getVueCompilerSfc,
  isEmptyStyle,
  isNot,
  joinWithUnderLine,
  TRANSFER_FLAG,
  transformUnocssBack,
  trim,
} from './utils'
import { wrapperVueTemplate } from './wrapperVueTemplate'

const combineReg = /([.#]?[\w\-]+)((?:[.#]\w+)+)/ // xx.xx

const addReg = /([.#\w\-]+)\s*\+\s*([.#\w]+)/ // xx + xx
const tailReg = /:?:(.+)/ // :after
const tagReg = /\[([\w\-]*)[='" ]*([\w-]*)['" ]*\]/ // [class="xxx"]
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
  media: string
  start: Position
  end: Position
}

let isRem: boolean | undefined = false
interface Options {
  isJsx?: boolean
  filepath?: string
  isRem?: boolean
}

export async function transformCss(
  style: string,
  code: string,
  media = '',
  options: Options,
): Promise<string> {
  const { isJsx, isRem: _isRem, filepath } = options || {}
  isRem = _isRem
  const allChanges: AllChange[] = []
  let newCode = (await importCss(code, style, filepath, isJsx)) as string
  const { parse } = await getVueCompilerSfc()
  const stack = parse(newCode).descriptor.template?.ast
  const updateOffsetMap: any = {}
  const deferRun: any[] = []
  style.replace(
    /(.*)\{([#\\\s\w\-.:;,%()+'"!]*)\}/g,
    (all: any, name: any, value: any = '') => {
      name = trim(name.replace(/\s+/g, ' '))

      const originClassName = name
      const before = trim(value.replace(/\n\s*/g, ''))
      const [transfer, noTransfer] = transformStyleToTailwindcss(before, isRem)
      const tailMatcher = name.match(tailReg)

      const prefix = tailMatcher
        ? (name.endsWith(tailMatcher[0]) ? '' : 'group-') + tail(tailMatcher[1])
        : ''
      // :deep()
      if (prefix === 'group-deep')
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

      if (prefix)
        name = name.replace(tailMatcher[0], '')

      // 找template > ast
      const names = name.replace(/\s*\+\s*/, '+').split(' ')

      const result = findDeepChild(names, stack)

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
          loc: { source, start, end },
          tag,
          props,
        } = r

        const attr = props.reduce((result: string[], cur: any) => {
          let item

          if (cur.name === 'class' && (item = cur.value?.content))
            result.push(item)
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
  return await resolveConflictClass(allChanges, newCode, isJsx, updateOffsetMap)
}

async function importCss(
  code: string,
  style: string,
  filepath?: string,
  isJsx?: boolean,
) {
  const originCode = code
  for await (const match of style.matchAll(
    /@import (url\()?["']*([\w./\-]*)["']*\)?;/g,
  )) {
    if (!match)
      continue
    const url = path.resolve(filepath!, '..', match[2])

    const content = await fsp.readFile(
      path.resolve(filepath!, '..', url),
      'utf-8',
    )
    const type = getCssType(url)
    const css = await compilerCss(content, type)

    const [_, beforeStyle] = code.match(/<style.*>(.*)<\/style>/s)!
    code = code.replace(beforeStyle, '')

    const vue = wrapperVueTemplate(code, css)

    const transfer = await transformVue(vue, { isJsx, isRem })

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

// 查找下一级的
function findChild(
  list: any[],
  stack: any,
  deps = Infinity,
  targets: any = undefined,
  result: any[] = [],
) {
  for (let j = 0; j < list.length; j++) {
    const curFirst = list[j]
    if (targets) {
      targets.forEach((t: any) =>
        findChild(list.slice(j), t, deps, undefined, result),
      )
      continue
    }
    const combineMatch = curFirst.match(combineReg)
    const addMatch = curFirst.match(addReg)

    targets = combineMatch
      ? astFindTag(stack, combineMatch[1], deps, combineMatch[2])
      : addMatch
        ? astFindTag(stack, addMatch[2], deps, undefined, addMatch[1])
        : astFindTag(stack, curFirst, deps)
    if (list.length === 1) {
      result.push(...targets)
      return result
    }
  }
  return result
}

// 查找下无限级的
function findDeepChild(list: any[], stack: any, result: any[] = []) {
  if (list.length) {
    let cur = list.shift()
    while (cur === '>') {
      cur = list.shift()
    }

    const curs = cur.split('>')

    const combineMatch = cur.match(combineReg)
    const addMatch = cur.match(addReg)

    let found: any[] = []
    if (curs.length > 1) {
      found = findChild(curs, stack, 1)
    }
    else if (combineMatch) {
      found = astFindTag(stack, combineMatch[1], Infinity, combineMatch[2])
    }
    else if (addMatch) {
      found = astFindTag(stack, addMatch[2], Infinity, undefined, addMatch[1])
    }
    else {
      found = astFindTag(stack, cur, Infinity)
    }

    // 递归查找下一级
    if (found.length) {
      found.forEach((item: any) => {
        findDeepChild(list, item, result)
      })
    }
  }
  else {
    result.push(stack)
  }
  return sort(result)
}

function sort(data: any[]) {
  const result: any[] = []
  data.forEach((item) => {
    if (
      !result.some(
        k =>
          k.loc.start.offset === item.loc.start.offset
          && k.loc.end.offset === item.loc.end.offset,
      )
    ) {
      result.push(item)
    }
  })
  return result
}

function matchCombine(
  props: any[],
  combineClass: string[],
  combineId: string[],
) {
  const classPassed = combineClass.length
    ? props.some(
        (prop: any) =>
          prop.name === 'class'
          && combineClass.every((c) => {
            const className = prop.value.content?.split(' ').filter(Boolean)
            return className?.some((item: string) => item.includes(c))
          }),
      )
    : true
  const idPassed = combineId.length
    ? props.some(
        (prop: any) =>
          prop.name === 'id'
          && combineId.every((i) => {
            const idName = prop.value.content?.split(' ').filter(Boolean)
            return idName?.some((item: string) => item.includes(i))
          }),
      )
    : true
  return classPassed && idPassed
}

export function astFindTag(
  ast: any,
  tag = '',
  deps = Infinity,
  combine: string | undefined = undefined,
  add: string | undefined = undefined,
  result: any = [],
  siblings: any = [],
) {
  // type: 3 是注释
  if (ast.type === 3)
    return result

  const tagMatch = tag.match(tagReg)

  const selector = tagMatch
    ? tagMatch[2]
      ? tagMatch[1]
      : tagMatch[1]
    : tag.startsWith('.')
      ? 'class'
      : tag.startsWith('#')
        ? 'id'
        : ''
  // combine 可能包含多个 .xxx#xxx.### , 需要一个个一个的去匹配
  const combineClass: string[] = []
  const combineId: string[] = []
  if (combine) {
    combine
      .split('.')
      .filter(Boolean)
      .forEach((item) => {
        if (item.includes('#')) {
          const classNames = item.replace(/#([^.#]+)/g, (_, id) => {
            combineId.push(id)
            return ''
          })
          combineClass.push(...classNames.split('.').filter(Boolean))
        }
        else {
          combineClass.push(item)
        }
      })
  }
  const combineSelector = combine
    ? combine.startsWith('.')
      ? 'class'
      : combine.startsWith('#')
        ? 'id'
        : undefined
    : undefined
  const addSelector = add
    ? add.startsWith('.')
      ? 'class'
      : add.startsWith('#')
        ? 'id'
        : undefined
    : undefined
  if (selector) {
    if (
      ast.props
      && ast.props.length
      && ast.props.some(
        (prop: any) =>
          prop.name === selector
          && ((tagMatch && !tagMatch[0].indexOf('=') && !tagMatch[2])
            || prop.value?.content
              .split(' ')
              .includes(tagMatch && tagMatch[2] ? tagMatch[2] : tag.slice(1))),
      )
      && (combine === undefined
        || (ast.props
          && ast.props.length
          && matchCombine(ast.props, combineClass, combineId)))
        && (add === undefined
          || siblings.some(
            (sib: any) =>
              sib !== ast
              && sib.props
              && sib.props.length
              && sib.props.some(
                (prop: any) =>
                  prop.name === addSelector
                  && prop.value.content?.includes(add.slice(1)),
              ),
          ))
    ) {
      result.push(ast)
    }
  }
  else if (
    ast.tag === tag
    && (combine === undefined
      || (ast.props
        && ast.props.length
        && matchCombine(ast.props, combineClass, combineId)))
      && (add === undefined
        || siblings.some(
          (sib: any) =>
            sib !== ast
            && sib.props
            && sib.props.length
            && sib.props.some(
              (prop: any) =>
                prop.name === addSelector
                && prop.value.content?.includes(add.slice(1)),
            ),
        ))
  ) {
    result.push(ast)
  }

  if (ast.children && ast.children.length && deps) {
    deps--
    ast.children.forEach((child: any) => {
      child.parent = ast
      astFindTag(child, tag, deps, combine, add, result, ast.children)
    })
  }
  return result
}

// 查找是否存在冲突样式按照names
async function resolveConflictClass(
  allChange: AllChange[],
  code: string,
  isJsx: boolean = true,
  updateOffset: Record<number, number>,
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

    let [after, transform] = await getConflictClass(value)
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
              (_all, prefix, _, content) => {
                // 拆分 content 中的空格，但是要忽略 ( ) [] 中的空格, 然后用 prefix 连接
                const splitContent: string[] = content
                  .split(/(?<!\[[^\]]*)\s+/)
                  .filter(Boolean)

                return splitContent.map(item => `${prefix}:${item}`).join(` `)
              },
            )
        : after

    // (["]{1})(.*?)\1
    const getUpdateOffset = getCalculateOffset(updateOffset, offset)
    const start = originCode.slice(
      offset + getUpdateOffset,
      offsetEnd + getUpdateOffset,
    )

    if (isJsx || after.replace(/[\w\-]+=("{1})(.*?)\1/g, '').includes('[')) {
      const newReg = new RegExp(
        `<${tag}.*\\sclass=["']([^"']+)["'][^\\/>]*\/?>`,
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
): Promise<[string, (code: string) => string]> {
  let map: Record<string, Array<number | string | symbol>> = {}
  let transform = (code: string) => code
  for await (const item of allChange) {
    const { before, name, source, attr, after, prefix, media } = item
    const pre = prefix ? `${prefix}|` : ''
    const beforeArr = before.split(';').filter(Boolean)
    const data = beforeArr.map((item) => {
      const [key, value] = item.split(':')
      return [`${pre}${key}`, value]
    })
    data.forEach((item) => {
      const [key, value] = item
      if (value === undefined)
        return
      if (!map[key]) {
        map[key] = [calculateWeight(name), value]
      }
      else {
        const [preWeight] = map[key] as any
        if (preWeight === skipTransformFlag)
          return
        const curWeight = calculateWeight(name)
        if (+curWeight >= +preWeight)
          map[key] = [+curWeight, value]
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
        const [key, value] = item.split(':')
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
          const prefixReg1 = new RegExp(`(?<!\\S)${prefix}(?!\\S)`)
          if (prefixReg1.test(result)) {
            return result.replace(prefixReg1, all =>
              all.replace(prefix, _transferCss))
          }
          const prefixReg2 = new RegExp(`(?<!\\S)${prefix}=`)

          if (prefixReg2.test(result)) {
            if (isNot(prefix)) {
              const newPrefix = prefix.replace(/[[\]()]/g, all => `\\${all}`)
              const reg = new RegExp(`${newPrefix}([\\w\\:\\-;\\[\\]\\/\\+%]+)`)
              return result.replace(reg, all => `${all}:${transferCss}`)
            }
            const reg = new RegExp(`${prefix}=(["]{1})(.*?)\\1`)
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
