import {
  getFirstName,
  getLastName,
  joinWithUnderLine,
  transformImportant,
  trim,
} from './utils'

const lastMaps = ['flex-basis', 'flex-grow', 'flex-shrink']
export function flex(key: string, val: string) {
  const [value, important] = transformImportant(val)

  if (lastMaps.includes(key))
    return `${getLastName(key)}-${value}${important}`
  if (value === '1')
    return `${important}flex-1`
  const firstVal = trim(value)[0]
  if (key === 'flex' && (firstVal === '0' || firstVal === '1'))
    return `${important}flex-[${joinWithUnderLine(value)}]`

  return `${important}${getFirstName(key)}-${value.replace('column', 'col')}`
}
