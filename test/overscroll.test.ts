import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('overscroll', () => {
  it('overscroll-behavior: auto;', () => {
    expect(toTailwindcss('overscroll-behavior: auto;')).toBe(
      'overscroll-auto',
    )
  })

  it('overscroll-behavior-y: auto;', () => {
    expect(toTailwindcss('overscroll-behavior-y: auto;')).toBe(
      'overscroll-y-auto',
    )
  })

  it('overscroll-behavior-x: contain;', () => {
    expect(toTailwindcss('overscroll-behavior-x: contain;')).toBe(
      'overscroll-x-contain',
    )
  })
})
