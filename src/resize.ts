import { transformImportant } from './utils'

const map: any = {
  vertical: 'y',
  horizontal: 'x',
}
export function resize(key: string, val: string) {
  const [value, important] = transformImportant(val)

  if (value === 'both')
    return `${important}${key}`
  return `${important}${key}-${map[value] || value}`
}
