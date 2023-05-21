import { getLastName, transformImportant } from './utils'

export function user(key: string, val: string) {
  const [value, important] = transformImportant(val)

  return `${important}${getLastName(key)}-${value}`
}
