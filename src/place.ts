import { getLastName, transformImportant } from './utils'

export function place(key: string, val: string) {
  const [value, important] = transformImportant(val)

  return `${important}${key}-${getLastName(value)}`
}
