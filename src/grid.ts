import {
  getFirstName,
  getLastName,
  joinWithLine,
  transformImportant,
  trim,
} from './utils'

export function grid(key: string, val: string) {
  const [value, important] = transformImportant(val)

  if (key.startsWith('grid-template')) {
    const matcher = value.match(/repeat\s*\(\s*([0-9]+)/)
    if (matcher) {
      return `${important}grid-${
        getLastName(key) === 'rows' ? 'rows' : 'cols'
      }-${matcher[1]}`
    }
    return `${important}grid-${
      getLastName(key) === 'rows' ? 'rows' : 'cols'
    }-${value}`
  }
  if (key === 'grid-auto-flow') {
    return `${important}grid-flow-${joinWithLine(value).replace(
      'column',
      'col',
    )}`
  }
  if (key.startsWith('grid-auto')) {
    const matcher = value.match(/minmax\s*\(\s*0\s*,\s*1fr/)
    return `${important}auto-${getLastName(key) === 'rows' ? 'rows' : 'cols'}-${
      matcher ? 'fr' : getFirstName(value)
    }`
  }
  const matcher = value.match(/span\s+([0-9])/)
  if (matcher) {
    return `${important}${key.slice(5).replace('column', 'col')}-span-${
      matcher[1]
    }`
  }
  if (trim(value, 'all') === '1/-1')
    return `${important}${key.slice(5).replace('column', 'col')}-span-full`
  return `${important}${key.slice(5).replace('column', 'col')}-${value}`
}
