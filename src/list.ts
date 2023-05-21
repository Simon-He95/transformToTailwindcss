import { getFirstName, getVal, transformImportant } from './utils'

export function list(key: string, val: string) {
  const [value, important] = transformImportant(val)
  return `${important}${getFirstName(key)}${getVal(value)}`
}
