import { getVal, transformImportant } from './utils'

export function row(key: string, val: string) {
  const [value, important] = transformImportant(val)

  return `${important}gap-y${getVal(value)}`
}
