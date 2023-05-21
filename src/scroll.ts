import { transformImportant } from './utils'

export function scroll(key: string, val: string) {
  const [value, important] = transformImportant(val)

  if (key.startsWith('scroll-snap'))
    return `${important}snap-${value}`
  if (key === 'scroll-behavior')
    return `${important}scroll-${value}`
  // margin padding
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, prefix, suffix] = key.match(/scroll-(margin|padding)-?([\w]+)?/)!
  if (suffix)
    return `${important}scroll-${prefix[0]}${suffix[0]}-${value}`
  return `${important}scroll-${prefix[0]}-${value}`
}
