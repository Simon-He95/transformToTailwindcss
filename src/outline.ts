import { getFirstName, transformImportant } from './utils'

export function outline(key: string, val: string) {
  const [value, important] = transformImportant(val)

  if (key === 'outline-offset')
    return `${important}${key}-${value}`
  return `${important}${getFirstName(key)}-${value}`
}
