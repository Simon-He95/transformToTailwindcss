import { transformImportant, trim } from './utils'
const times = ['transition-delay', 'transition-duration']

export function transition(key: string, val: string) {
  const [value, important] = transformImportant(val)
  if (key === 'transition-timing-function') {
    if (value === 'linear')
      return `${important}ease-${value}`
    return `${important}ease-[${trim(value, 'all')}]`
  }
  if (key === 'transition')
    return transformTransition(value, important)

  if (key === 'transition-property') {
    if (value.includes('color'))
      return `${important}transition-color`
    if (value === 'box-shadow')
      return `${important}transition-shadow`
    return `${important}transition-${value}`
  }
  if (times.includes(key))
    return `${key.split('-')[1]}-${value.slice(0, -2)}`
}

function transformTransition(v: string, important = '') {
  let hasDuration = false
  return v
    .split(' ')
    .map((item) => {
      if (/^[0-9]/.test(item) || /^\.[0-9]/.test(item)) {
        const calculateTime = item.endsWith('s')
          ? 1000 * +item.slice(0, -1)
          : item.slice(0, -3)
        if (hasDuration)
          return `${important}delay-${calculateTime}`
        hasDuration = true
        return `${important}duration-${calculateTime}`
      }
      if (item.startsWith('background'))
        return `${important}transition-colors`
      if (item === 'linear')
        return `${important}ease-linear`
      if (/^(cubic-bezier)|(ease)/.test(item))
        return `${important}${item}`
      return `${important}transition-${item}`
    })
    .join(' ')
}
