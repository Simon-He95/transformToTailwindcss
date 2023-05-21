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
      ? `rounded${getVal(value)}${important}`
      : `${important}rounded-[${joinWithUnderLine(value)}]`
  }
  if (key === 'border-style')
    return `border-${value}`

  if (borderSize.some(b => key.startsWith(b)))
    return `border-${key.split('-')[1][0]}${getVal(value)}`
  if (key.startsWith('border-image'))
    return ''
  if (/rgb/.test(value)) {
    value = value.replace(/rgb[a](.*)/, (all, v) =>
      all.replace(v, trim(v, 'all')),
    )
  }

  return `${important}border-[${joinWithUnderLine(value)}]`
}
