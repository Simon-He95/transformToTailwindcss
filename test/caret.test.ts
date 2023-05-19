import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('caret', () => {
  it('caret-color: inherit;', () => {
    expect(toTailwindcss('caret-color: inherit;')).toBe('caret-inherit')
  })

  it('caret-color: #fff;', () => {
    expect(toTailwindcss('caret-color: #fff;')).toBe('caret-[#fff]')
  })
})
