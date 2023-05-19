import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'
describe('isolation', () => {
  it('isolation: isolate;', () => {
    expect(toTailwindcss('isolation: isolate;')).toBe('isolate')
  })

  it('isolation: auto;', () => {
    expect(toTailwindcss('isolation: auto;')).toBe('isolation-auto')
  })
})
