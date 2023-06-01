import { box } from './box'
import { getHundred, getVal, transformImportant } from './utils'

const hundred = ['contrast', 'brightness', 'saturate']
const percent = ['grayscale', 'invert', 'sepia']
export function filter(key: string, val: string) {
  const [v, important] = transformImportant(val)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, name, value] = v.match(/([\w-]+)\((.*)\)/)!

  if (hundred.includes(name))
    return `${important}${name}${getVal(getHundred(value).toString())}`

  if (name === 'drop-shadow')
    return `${important}drop${getVal(box(name, value))}`
  if (percent.includes(name)) {
    return `${important}${name}${
      value.endsWith('%')
        ? getVal(value.slice(0, -1))
        : getVal(getHundred(value).toString())
    }`
  }
  if (name === 'hue-rotate')
    return `${important}${name}${getVal(value.slice(0, -3))}`
  return `${important}${name}${getVal(value)}`
}
