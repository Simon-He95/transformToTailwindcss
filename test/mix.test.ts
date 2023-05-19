import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('mix', () => {
  it('mix-blend-mode: normal;', () => {
    expect(toTailwindcss('mix-blend-mode: normal;')).toBe(
      'mix-blend-normal',
    )
  })

  it('mix-blend-mode: color-dodge;', () => {
    expect(toTailwindcss('mix-blend-mode: color-dodge;')).toBe(
      'mix-blend-color-dodge',
    )
  })
})
