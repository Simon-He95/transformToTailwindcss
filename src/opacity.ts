import { isPercent, transformImportant } from './utils'

export function opacity(key: string, val: string) {
  const [value, important] = transformImportant(val)

  if (isPercent(val))
    return `${important}op-${value.replace('%', '')}`

  return `${important}op-${+value * 100}`
}
