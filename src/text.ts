import { transformImportant } from './utils'

export function text(key: string, val: string) {
  const [value, important] = transformImportant(val)

  if (key === 'text-decoration-line') {
    if (value === 'none')
      return `${important}no-underline`
    return `${important}${value}`
  }
  if (key === 'text-transform') {
    if (value === 'none')
      return `${important}normal-case`
    return `${important}${value}`
  }
  if (key.startsWith('text-decoration') || key === 'text-indent')
    return `${important}${key.split('-')[1]}-${value}`

  if (key === 'text-underline-offset')
    return `${important}underline-offset-${value}`
  return `${important}text-${value}`
}
