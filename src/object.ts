import { getFirstName, joinWithLine, transformImportant } from './utils'

export function object(key: string, val: string) {
  const [value, important] = transformImportant(val)

  if (key === 'object-position')
    return `${important}${getFirstName(key)}-${joinWithLine(value)}`
  return `${important}${getFirstName(key)}-${value}`
}
