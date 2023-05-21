import { transformImportant } from './utils'

export function display(key: string, val: string) {
  const [value, important] = transformImportant(val)

  if (value === 'none')
    return `${important}hidden`
  if (value === 'hidden')
    return `${important}invisible`
  return `${important}${value}`
}
