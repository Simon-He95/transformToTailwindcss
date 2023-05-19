import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('object', () => {
  it('object-fit: contain;', () => {
    expect(toTailwindcss('object-fit: contain;')).toBe('object-contain')
  })

  it('object-fit: scale-down;', () => {
    expect(toTailwindcss('object-fit: scale-down;')).toBe(
      'object-scale-down',
    )
  })

  it('object-position: bottom;', () => {
    expect(toTailwindcss('object-position: bottom;')).toBe('object-bottom')
  })

  it('object-position: left bottom;', () => {
    expect(toTailwindcss('object-position: left bottom;')).toBe(
      'object-left-bottom',
    )
  })
})
