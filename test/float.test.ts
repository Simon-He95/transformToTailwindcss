import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'
describe('float', () => {
  it('float-left', () => {
    expect(toTailwindcss('float:left')).toBe('float-left')
  })

  it('float-none', () => {
    expect(toTailwindcss('float:none')).toBe('float-none')
  })
})
