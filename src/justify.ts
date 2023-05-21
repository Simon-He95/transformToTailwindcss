import { getLastName, transformImportant } from './utils'

export function justify(key: string, val: string) {
  const [value, important] = transformImportant(val)

  if (key === 'justify-content')
    return `${important}justify-${getLastName(value)}`
  return `${important}${key}-${getLastName(value)}`
}
