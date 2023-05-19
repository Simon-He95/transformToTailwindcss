import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('touch', () => {
  it('touch-action: auto;', () => {
    expect(toTailwindcss('touch-action: auto;')).toBe('touch-auto')
  })

  it('touch-action: pan-x;', () => {
    expect(toTailwindcss('touch-action: pan-x;')).toBe('touch-pan-x')
  })
})
