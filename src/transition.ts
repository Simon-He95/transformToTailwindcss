import { transformImportant, trim } from './utils'
const times = ['transition-delay', 'transition-duration']

export function transition(key: string, val: string) {
  const [value, important] = transformImportant(val)
  if (key === 'transition-timing-function') {
    if (value === 'linear')
      return `ease-${value}${important}`
    return `${important}ease-[${trim(value, 'all')}]`
  }
  if (key === 'transition')
    return transformTransition(value, important)

  if (key === 'transition-property') {
    if (value.includes('color'))
      return `transition-color${important}`
    if (value === 'box-shadow')
      return `transition-shadow${important}`
    return `transition-${value}${important}`
  }
  if (times.includes(key))
    return `${key.split('-')[1]}-${value.slice(0, -2)}`
}

function transformTransition(v: string, important = '') {
  let hasDuration = false
  return v
    .split(' ')
    .map((item) => {
      if (/^[0-9]/.test(item)) {
        if (hasDuration)
          return `${important}delay-${item}`
        hasDuration = true
        return `${important}duration-${item}`
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
