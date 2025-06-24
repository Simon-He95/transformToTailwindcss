import { transformCss } from './transformCss'
import { getLastName } from './utils'

const mediaReg = /@media([\s\w]*)\(([\w-]+):\s*(\w+)\)\s*\{([\s\w.{}\-:;]*)\}/g

const mediaSingleReg
  = /@media([\s\w]*)\(([\w-]+):\s*(\w+)\)\s*\{([\s\w.{}\-:;]*)\}/
const emptyMediaReg = /@media([\s\w]*)\(([\w-]+):\s*(\w+)\)\s*\{\s*\}/g
const valMap: any = {
  '640px': 'sm',
  '768px': 'md',
  '1024px': 'lg',
  '1280px': 'xl',
  '1536px': '2xl',
}

export async function transformMedia(
  code: string,
  isJsx?: boolean,
  isRem?: boolean,
  debug?: boolean,
  collectClasses?: boolean,
  filepath?: string,
): Promise<[string, (r: string) => string]> {
  // 理论上filepath应该总是从plugin中获取id，但提供process.cwd()作为后备默认值
  const transferBackMap: any = []
  let result = code

  const matcher = code.match(mediaReg)
  if (!matcher)
    return returnValue(result)

  for await (const item of matcher) {
    const [all, pre, key, val, inner] = item.match(mediaSingleReg)!
    const tempFlag = `/* __transformMedia${Math.random()}__ */`

    const value = valMap[val]

    if (!value) {
      result = result.replace(all, tempFlag)
      transferBackMap.push((r: string) => r.replace(tempFlag, all))

      continue
    }

    if (pre.trim()) {
      const transfer = await transformCss(inner, result, `max-${value}`, {
        isJsx,
        isRem,
        debug,
        collectClasses,
        filepath,
      })

      if (transfer !== result) {
        result = transfer.replace(emptyMediaReg, '')
        transferBackMap.push((r: string) => r.replace(tempFlag, transfer))

        continue
      }
      result = result.replace(all, tempFlag)
      transferBackMap.push((r: string) => r.replace(tempFlag, all))

      continue
    }
    let mapValue: string = value
    if (key === 'prefers-reduced-motion')
      mapValue = `${getLastName(key)}-${val === 'no-preference' ? 'safe' : val}`

    const transfer = (
      await transformCss(inner, result, mapValue, {
        isJsx,
        isRem,
        debug,
        collectClasses,
        filepath,
      })
    ).replace(emptyMediaReg, '')
    result = transfer.replace(all, tempFlag)
    transferBackMap.push((r: string) => r.replace(tempFlag, all))
  }

  return returnValue(result)

  function returnValue(result: string): [string, (r: string) => string] {
    return [
      result,
      (r: string) =>
        transferBackMap.reduce(
          (result: string, fn: (r: string) => string) => fn(result),
          r,
        ),
    ]
  }
}
