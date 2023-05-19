import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'
describe('display', () => {
  it('display:none', () => {
    expect(toTailwindcss('display:none')).toBe('hidden')
  })

  it('inline-flex', () => {
    expect(toTailwindcss('display: inline-flex')).toBe('inline-flex')
  })
})
