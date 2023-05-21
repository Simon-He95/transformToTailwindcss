import { transformImportant } from './utils'

export function content(key: string, val: string) {
  const [value, important] = transformImportant(val)

  return `${important}content-[${value}]`
}
