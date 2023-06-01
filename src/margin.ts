import { getVal, transformImportant, trim } from './utils'
const map: any = {
  'margin-left': 'ml',
  'margin-right': 'mr',
  'margin-top': 'mt',
  'margin-bottom': 'mb',
  'padding-left': 'pl',
  'padding-right': 'pr',
  'padding-top': 'pt',
  'padding-bottom': 'pb',
}
export function transformMargin(key: string, val: string) {
  const [value, important] = transformImportant(val)

  const specail = map[key]

  if (specail)
    return `${important}${specail}${getVal(value)}`
  const values = trim(value).split(' ')
  const len = values.length

  if (len === 1)
    return `${important}${key[0]}${getVal(values[0])}`
  if (len === 2) {
    return `${important}${key[0]}x${getVal(values[1])} ${important}${
      key[0]
    }y${getVal(values[0])}`
  }
  if (len === 3) {
    return `${important}${key[0]}x${getVal(values[1])} ${important}${
      key[0]
    }t${getVal(values[0])} ${important}${key[0]}b${getVal(values[2])}`
  }
  return `${important}${key[0]}t${getVal(values[0])} ${important}${
    key[0]
  }b${getVal(values[2])} ${important}${key[0]}l${getVal(
    values[3],
  )} ${important}${key[0]}r${getVal(values[1])}`
}
