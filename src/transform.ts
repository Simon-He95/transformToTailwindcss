import {
  getHundred,
  getVal,
  joinEmpty,
  joinWithLine,
  transformImportant,
  trim,
} from './utils'

export function transform(key: string, val: string) {
  const [v, important] = transformImportant(val)
  if (key === 'transform-origin')
    return `${important}origin-${joinWithLine(v)}`
  if (key === 'transform-style')
    return `${important}transform-${v}`

  return joinEmpty(v)
    .split(' ')
    .map((v) => {
      const matcher = v.match(/([a-z]+)([A-Z])?\((.*)\)/)
      if (!matcher)
        return undefined
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, namePrefix, nameSuffix, value] = matcher
      if (nameSuffix) {
        if (namePrefix === 'scale') {
          if (value.includes(',')) {
            return `${important}${namePrefix}-[${nameSuffix.toLowerCase()}-${value
              .split(',')
              .join('_')}]`
          }
          return `${important}${namePrefix}-${nameSuffix.toLowerCase()}${getVal(
            getHundred(value).toString(),
          )}`
        }
        return `${important}${namePrefix}-${nameSuffix.toLowerCase()}${getVal(
          trim(value, 'all'),
        )}`
      }
      else {
        if (namePrefix === 'scale') {
          if (value.includes(','))
            return `${important}${namePrefix}-[${value.split(',').join('_')}]`
          return `${important}${namePrefix}-${getHundred(value)}`
        }
        const [x, y] = value.split(',')
        return `${important}${namePrefix}-x${getVal(
          x,
        )} ${important}${namePrefix}-y${getVal(y ?? x)}`
      }
    })
    .filter(Boolean)
    .join(' ')
}
