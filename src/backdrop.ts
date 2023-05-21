import { filter } from './filter'
import { transformImportant } from './utils'

export function backdrop(key: string, val: string) {
  const [value, important] = transformImportant(val)

  return `${important}backdrop-${filter(key, value)}`
}
