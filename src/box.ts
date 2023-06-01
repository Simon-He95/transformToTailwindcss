import { getFirstName, transformImportant, trim } from './utils'
export function box(key: string, val: string) {
  // eslint-disable-next-line prefer-const
  let [value, important] = transformImportant(val)

  if (key.startsWith('box-decoration'))
    return `${important}box-decoration-${value}`
  if (key === 'box-sizing')
    return `${important}box-${getFirstName(value)}`
  const rgb = /rgba?(\([\w,\s.]+\))/g
  value = value
    .replace(rgb, (r, v) => r.replace(v, trim(v, 'all')))
    .replace(/\s*,\s*/g, ',')
  return `${important}shadow-[${value
    .replace(/\s+/, ' ')
    .split(' ')
    .join('_')}]`
}
