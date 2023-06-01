import { transformImportant } from './utils'

export function font(key: string, val: string) {
  const [value, important] = transformImportant(val)

  if (key === 'font-size')
    return `${important}text-${value}`
  if (key === 'font-weight')
    return `${important}font-${value}`
  if (key === 'font-family') {
    const match = value.match(/ui-(\w{0,4})/)!
    if (!match)
      return `${important}font-${val}`
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, family] = match
    return `${important}font-${family}`
  }
  if (key === 'font-style') {
    if (value === 'normal')
      return `${important}font-not-italic`
    return `${important}font-${value}`
  }
  if (key === 'font-variant-numeric') {
    if (value === 'normal')
      return `${important}normal-nums`
    return `${important}${value}`
  }
  return transformFont(value, important)
}

function transformFont(v: string, important: string) {
  return v
    .split(' ')
    .map(item =>
      /^[0-9]/.test(item)
        ? `${important}text-[${item}]`
        : `${important}font-${item}`,
    )
    .join(' ')
}
