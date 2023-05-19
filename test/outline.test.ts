import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('outline', () => {
  it('outline-width: 0px;', () => {
    expect(toTailwindcss('outline-width: 0px;')).toBe('outline-0px')
  })

  it('outline-color: #000;', () => {
    expect(toTailwindcss('outline-color: #000;')).toBe('outline-#000')
  })

  it('outline-style: dashed;', () => {
    expect(toTailwindcss('outline-style: dashed;')).toBe('outline-dashed')
  })

  it('outline-offset: 0px;', () => {
    expect(toTailwindcss('outline-offset: 0px;')).toBe('outline-offset-0px')
  })
})
