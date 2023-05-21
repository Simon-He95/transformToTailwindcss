import { transformImportant } from './utils'

export function mix(key: string, val: string) {
  const [value, important] = transformImportant(val)

  return `${important}mix-blend-${value}`
}
