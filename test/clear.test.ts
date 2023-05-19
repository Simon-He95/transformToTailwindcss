import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'
describe('clear', () => {
  it('clear-left', () => {
    expect(toTailwindcss('clear:left')).toBe('clear-left')
  })

  it('clear-none', () => {
    expect(toTailwindcss('clear:none')).toBe('clear-none')
  })
})
