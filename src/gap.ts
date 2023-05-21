import { transformImportant } from './utils'

export function transformGap(key: string, val: string) {
  const [value, important] = transformImportant(val)

  if (key.startsWith('column'))
    return `${important}gap-x-${value}`
  return `${important}gap-y-${value}`
}
