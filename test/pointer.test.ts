import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('pointer', () => {
  it('pointer-events: none;', () => {
    expect(toTailwindcss('pointer-events: none;')).toBe(
      'pointer-events-none',
    )
  })

  it('pointer-events: auto;', () => {
    expect(toTailwindcss('pointer-events: auto;')).toBe(
      'pointer-events-auto',
    )
  })
})
