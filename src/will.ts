import { getFirstName, transformImportant } from './utils'

export function will(key: string, val: string) {
  const [value, important] = transformImportant(val)

  return `${important}${key}-${getFirstName(value)}`
}
