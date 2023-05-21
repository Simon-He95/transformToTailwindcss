import { transformImportant } from './utils'

export function isolation(key: string, val: string) {
  const [value, important] = transformImportant(val)

  if (val === 'isolate')
    return `${important}${value}`
  return `${important}${key}-${value}`
}
