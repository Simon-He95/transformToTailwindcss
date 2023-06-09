import { getVal, transformImportant } from './utils'

export function color(key: string, val: string) {
  const [value, important] = transformImportant(val)

  return `${important}text${getVal(value)}`
}
