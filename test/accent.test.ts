import { describe, expect, it } from 'vitest'
import { toTailwindcss } from '../src/toTailwindcss'

describe('accent', () => {
  it('accent-color: inherit;', () => {
    expect(toTailwindcss('accent-color: inherit !important;')).toBe(
      '!accent-inherit',
    )
  })

  it('accent-color: #fff;', () => {
    expect(toTailwindcss('accent-color: #fff;')).toBe('accent-[#fff]')
  })

  it('align-self: center;', () => {
    expect(toTailwindcss('align-self: center;')).toBe('self-center')
  })

  it('align-self: flex-start;', () => {
    expect(toTailwindcss('align-self: flex-start;')).toBe('self-start')
  })
})
