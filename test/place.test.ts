import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('place', () => {
  it('place-content: center;', () => {
    expect(toTailwindcss('place-content: center;')).toBe(
      'place-content-center',
    )
  })

  it('place-content: space-between;', () => {
    expect(toTailwindcss('place-content: space-between;')).toBe(
      'place-content-between',
    )
  })

  it('place-items: start;', () => {
    expect(toTailwindcss('place-items: start;')).toBe('place-items-start')
  })

  it('place-self: auto;', () => {
    expect(toTailwindcss('place-self: auto;')).toBe('place-self-auto')
  })
})
