import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('justify', () => {
  it('justify-content: flex-start;', () => {
    expect(toTailwindcss('justify-content: flex-start;')).toBe(
      'justify-start',
    )
  })

  it('justify-items: start;', () => {
    expect(toTailwindcss('justify-items: start;')).toBe(
      'justify-items-start',
    )
  })

  it('justify-self: auto;', () => {
    expect(toTailwindcss('justify-self: auto;')).toBe('justify-self-auto')
  })
})
