import { getLastName, getVal, transformImportant } from './utils'

export function word(key: string, val: string) {
  const [value, important] = transformImportant(val)
  if (key.startsWith('word-spacing'))
    return `${important}word-spacing${getVal(val)}`
  if (value === 'keep-all')
    return `${important}break-keep`
  return `${important}break-${getLastName(value)}`
}
