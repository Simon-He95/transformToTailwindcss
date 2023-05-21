import { getFirstName, getVal, transformImportant } from './utils'
export function size(key: string, val: string) {
  const [value, important] = transformImportant(val)

  return `${important}${key[0]}${getVal(value, getFirstName)}`
}
