import {
  getVal,
  isCalc,
  joinWithUnderLine,
  transformImportant,
  trim,
} from './utils'

const borderSize = [
  'border-left',
  'border-top',
  'border-right',
  'border-bottom',
]
export function border(key: string, val: string) {
  // eslint-disable-next-line prefer-const
  let [value, important] = transformImportant(val)

  if (key === 'border-spacing')
    return `${important}${key}-[${joinWithUnderLine(value)}]`
  if (key === 'border-color')
    return `${important}border${getVal(value)}`
  if (key === 'border-radius') {
    return isCalc(value)
      ? `${important}rounded${getVal(value)}`
      : `${important}rounded-[${joinWithUnderLine(value)}]`
  }
  if (borderSize.some(b => key.startsWith(b)))
    return `${important}border-${key.split('-')[1][0]}${getVal(value)}`
  if (key === 'border-inline-end-width')
    return `${important}border-e${getVal(value)}`
  if (key === 'border-inline-start-width')
    return `${important}border-s${getVal(value)}`
  if (key.startsWith('border-image'))
    return ''

  if (/^\d[%|(px)|(rem)]$/.test(value) || key === 'border-collapse')
    return `${important}border-${value}`
  if (key === 'border-width' || key === 'border-style')
    return `${important}border${getVal(value)}`
  if (key === 'border-color') {
    if (value === 'currentColor')
      return `${important}border-current`
    return `${important}border${getVal(value)}`
  }
  if (/rgb/.test(value)) {
    value = value.replace(/rgb[a](.*)/, (all, v) =>
      all.replace(v, trim(v, 'all')),
    )
  }

  return `${important}border-[${joinWithUnderLine(value)}]`
}
